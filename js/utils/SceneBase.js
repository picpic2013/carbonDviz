export default class SceneBase {
    constructor (conf, father) {
        this.__subObjects__ = {}
        this.__father__ = (father === undefined) ? null : father

        if (Array.isArray(conf)) {
            for (var subObj of conf) {
                this.addSubObject(subObj, undefined, father)
            }
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

        conf = (conf === undefined) ? {} : conf
        
        for (var key of Object.keys(conf)) {
            if (key !== "__onUpdate__" && key !== "__onInactive__" && key !== "__subObjects__") {
                this[key] = conf[key]
            }
        }

        if (this.__start__ === undefined) {
            this.__start__ = 0
        }

        if (this.__end__ === undefined) {
            this.__end__ = 1
        } 

        if (conf.__onUpdate__) {
            this.__onUpdateFunction__ = conf.__onUpdate__
        }

        if (conf.__onInactive__) {
            this.__onInactiveFunction__ = conf.__onInactive__
        }

        if (this.__isActive__ === undefined) {
            this.__isActive__ = false;
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
        if (id === undefined) id = "__untitled" + Object.keys(this.__subObjects__).length + "__"
        father = father ? father : this
        if (obj instanceof SceneBase) {
            if (obj.__father__ === undefined) {
                obj.__father__ = father
            }
        } else {
            obj = new SceneBase(obj, father)
        }
        this.__subObjects__[id] = obj
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