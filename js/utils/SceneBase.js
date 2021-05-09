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

    __isInActiveRange__(rate, scrolled, gloalVars) {
        if (rate < this.__start__ || rate > this.__end__) {
            return false
        }
        return true
    }

    __onUpdate__ (rate, scrolled, gloalVars) {
        // 先自己更新
        if (this.__onUpdateFunction__) {
            this.__onUpdateFunction__.call(this, rate, scrolled, gloalVars)
        }

        // 再更新自己的所有子元素
        for (var subObj of Object.values(this.__subObjects__)) {
            // 计算子场景的进度
            var percentage = (rate - subObj.__start__) / (subObj.__end__ - subObj.__start__)
            
            // 如果不在范围内
            if (subObj.__isInActiveRange__(rate, scrolled, gloalVars) === false) {
                if (subObj.isActive() === true) {
                    if (subObj.__onInactive__) {
                        subObj.__onInactive__.call(subObj, percentage, scrolled, gloalVars)
                    }
                    subObj.end()
                }
                
                if (subObj.__onUpdateInactive__) {
                    subObj.__onUpdateInactive__.call(subObj, percentage, scrolled, gloalVars)
                }
                continue
            }
            
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

    __onInactive__ (rate, scrolled, gloalVars) {
        // 先销毁漏网之鱼
        for (var subObj of Object.values(this.__subObjects__)) {
            if (subObj.isActive() === true) {
                if (subObj.__onInactive__) {
                    // 计算子场景的进度
                    var percentage = (rate - subObj.__start__) / (subObj.__end__ - subObj.__start__)
                    subObj.__onInactive__.call(subObj, percentage, scrolled, gloalVars)
                }
                subObj.end()
            }
        }

        // 再销毁自己
        if (this.__onInactiveFunction__) {
            this.__onInactiveFunction__.call(this, rate, scrolled, gloalVars)
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

    delSubObject (id, rate, scrolled, gloalVars) {
        if (this.__subObjects__[id] instanceof SceneBase && this.__subObjects__[id].isActive() === true) {
            this.__subObjects__[id].__onInactive__(rate, scrolled, gloalVars)
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

SceneBase.setGloalVars = function (globalVars) {
    for (var key of Object.keys(globalVars)) {
        SceneBase.__gloalVars__[key] = globalVars[key]
    }
}

SceneBase.use = function (plugin, conf) {
    if (plugin.install !== undefined) {
        plugin.install(SceneBase, conf)
    }
}

SceneBase.__gloalVars__ = {}

export default SceneBase