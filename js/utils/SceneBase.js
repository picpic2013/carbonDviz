class SceneBase {
    constructor (conf, father) {
        this.__subObjects__ = {}
        this.__father__ = (father === undefined) ? window : father
        this.__isActive__ = false
        this.__start__ = 0
        this.__end__ = 1

        // 如果传入的参数是数组，就递归生成子元素
        if (Array.isArray(conf)) {
            for (var subObj of conf) {
                this.addSubObject(subObj, undefined, father)
            }
            return
        }

        // 将类中的子动画全部转换为 SceneBase 类
        var tmpSubObjs = this.__subObjects__
        this.__subObjects__ = {}
        if (Array.isArray(tmpSubObjs)) {
            for (var value of tmpSubObjs) {
                this.addSubObject(value)
            }
        } else if (tmpSubObjs instanceof Object) {
            for (var key of Object.keys(tmpSubObjs)) {
                this.addSubObject(tmpSubObjs[key], key)
            }
        }

        // 默认初始化 conf
        conf = (conf === undefined) ? {} : conf  
        
        // 把 conf 里所有的属性都转移到对象中
        for (var key of Object.keys(conf)) {
            if (key !== "__onUpdate__" && key !== "__onInactive__" && key !== "__subObjects__") {
                this[key] = conf[key]
            }
        }

        // 单独处理三个变量
        if (conf.__onUpdate__) {
            this.__onUpdateFunction__ = conf.__onUpdate__
        }

        if (conf.__onInactive__) {
            this.__onInactiveFunction__ = conf.__onInactive__
        }

        if (conf.__subObjects__) {
            if (Array.isArray(conf.__subObjects__)) {
                for (var value of conf.__subObjects__) {
                    this.addSubObject(value)
                }
            } else if (conf.__subObjects__ instanceof Object) {
                for (var key of Object.keys(conf.__subObjects__)) {
                    this.addSubObject(conf.__subObjects__[key], key)
                }
            }
        }

        for (var i = 2; i < arguments.length; ++i) {
            this.addSubObject(arguments[i])
        }
    }

    __onUpdate__ (rate, scrolled, gloalVars) {
        // 先自己更新
        if (this.__onUpdateFunction__) {
            this.__onUpdateFunction__.call(this, rate, scrolled, gloalVars)
        }

        // 再更新自己的所有子元素
        for (var subObj of Object.values(this.__subObjects__)) {
            // 如果不在范围内
            if (rate < subObj.__start__ || rate > subObj.__end__) {
                if (subObj.isActive() === true) {
                    if (subObj.__onInactive__) {
                        subObj.__onInactive__.call(subObj, scrolled, gloalVars)
                    }
                    subObj.end()
                }
                
                if (subObj.__onUpdateInactive__) {
                    subObj.__onUpdateInactive__.call(subObj, scrolled, gloalVars)
                }
                continue
            }
            
            // 计算子场景的进度
            var percentage = (rate - subObj.__start__) / (subObj.__end__ - subObj.__start__)
            
            // 调用子场景的更新函数
            if (subObj.isActive() === false) {
                if (subObj.__onActivate__) {
                    subObj.__onActivate__.call(subObj, percentage, scrolled, gloalVars)
                }
                subObj.start()
            }

            if (subObj.__onUpdate__) {
                subObj.__onUpdate__.call(subObj, percentage, scrolled, gloalVars)
            }
        }
    }

    __onInactive__ (scrolled, gloalVars) {
        // 先销毁漏网之鱼
        for (var subObj of Object.values(this.__subObjects__)) {
            if (subObj.isActive() === true) {
                if (subObj.__onInactive__) {
                    subObj.__onInactive__.call(subObj, scrolled, gloalVars)
                }
                subObj.end()
            }
        }

        // 再销毁自己
        if (this.__onInactiveFunction__) {
            this.__onInactiveFunction__.call(this, scrolled, gloalVars)
        }
    }

    addSubObject (obj, id, father) {
        if (id === undefined) {
            if (SceneBase.__maxSubObjId__ === undefined) {
                SceneBase.__maxSubObjId__ = 0
            }
            id = "__untitled" + (SceneBase.__maxSubObjId__++) + "__"
        }
        father = father ? father : this
        if (obj instanceof SceneBase) {
            if (obj.__father__ === undefined) {
                obj.__father__ = father
            }
        } else {
            obj = new SceneBase(obj, father)
        }
        this.__subObjects__[id] = obj
        return id
    }

    delSubObject (id, scrolled, gloalVars) {
        if (this.__subObjects__[id] instanceof SceneBase && this.__subObjects__[id].isActive() === true) {
            this.__subObjects__[id].__onInactive__(scrolled, gloalVars)
        }
        delete this.__subObjects__[id]
    }

    start() {
        this.__isActive__ = true
    }

    end() {
        this.__isActive__ = false
    }

    isActive() {
        return this.__isActive__
    }
}

SceneBase.newInstance = function () {
    return new SceneBase(...arguments)
}

SceneBase.__animationUpdate__ = function (time) {
    SceneBase.__nowAnimationTime__ = time

    SceneBase.__animations__.__onUpdate__ (time, time, SceneBase.__setGloalVars__)

    requestAnimationFrame(SceneBase.__animationUpdate__)
}

SceneBase.activateAnimation = function () {
    if (SceneBase.__requestAnimationFrame__ === undefined) {
        SceneBase.__requestAnimationFrame__ = requestAnimationFrame(SceneBase.__animationUpdate__)
    }

    if (SceneBase.__animations__ === undefined) {
        SceneBase.__animations__ = SceneBase.newInstance({
            __start__: 0, 
            __end__: Infinity
        })
    }
}

SceneBase.stopAnimation = function () {
    if (SceneBase.__requestAnimationFrame__) {
        cancelAnimationFrame(SceneBase.__requestAnimationFrame__)
        delete SceneBase.__requestAnimationFrame__
    }

    if (SceneBase.__animations__) {
        delete SceneBase.__animations__
    }
}

// 添加动画
SceneBase.addAnimation = function () {
    return SceneBase.__animations__.addSubObject(...arguments)
}

// 删除动画
SceneBase.delAnimation = function () {
    return SceneBase.__animations__.delSubObject(...arguments)
}

// 更新函数
SceneBase.__scrollUpdateFunction__ = function () {
    // 滚动的百分比
    var scrolled = (document.documentElement.scrollTop || document.body.scrollTop) /
                 (document.documentElement.scrollHeight - SceneBase.__pageHeight__)

    SceneBase.__rootScene__.__onUpdate__(scrolled, scrolled, SceneBase.__setGloalVars__)
}

SceneBase.initWithoutAnimation = function () {
    if (SceneBase.__rootScene__ === undefined) {
        SceneBase.__rootScene__ = new SceneBase(...arguments)
    }

    if (SceneBase.__setGloalVars__ === undefined) {
        SceneBase.__setGloalVars__ = {}
    }

    // 获取页面宽度
    SceneBase.__pageWidth__ = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

    // 获取页面高度
    SceneBase.__pageHeight__ = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

    // 滚动时进行更新
    window.addEventListener("scroll", SceneBase.__scrollUpdateFunction__)

    // 加载完先自动更新一波
    var oldOnloadFunction = window.onload
    window.onload = function () {
        SceneBase.__scrollUpdateFunction__()
        if (oldOnloadFunction) {
            oldOnloadFunction.call(window)
        }
    }

    return SceneBase.__rootScene__
}

SceneBase.init = function () {
    SceneBase.initWithoutAnimation(...arguments)

    SceneBase.activateAnimation()

    return SceneBase.__rootScene__
}

SceneBase.setGloalVars = function (globalVars) {
    if (SceneBase.__setGloalVars__ === undefined) {
        SceneBase.__setGloalVars__ = {}
    }

    for (var key of Object.keys(globalVars)) {
        SceneBase.__setGloalVars__[key] = globalVars[key]
    }
}

export default SceneBase