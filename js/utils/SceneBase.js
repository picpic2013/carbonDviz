function SceneBase(conf, father, ...subObjs) {
    this.__subObjects__ = this.__subObjects__ ? this.__subObjects__ : {}
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
    } else if (tmpSubObjs instanceof SceneBase) {
        this.addSubObject(tmpSubObjs)
    } else {
        for (var key of Object.keys(tmpSubObjs)) {
            this.addSubObject(tmpSubObjs[key], key)
        }
    }

    // 默认初始化 conf
    conf = (conf === undefined) ? {} : conf  

    // 把 conf 里所有的属性都转移到对象中
    Object.assign(this, conf, {
        "__onUpdate__": this.__onUpdate__, 
        "__onInactive__": this.__onInactive__, 
        "__subObjects__": this.__subObjects__
    })
    
    // 把构造函数中的剩余参数都当成子元素加入
    for (var sub of subObjs) {
        this.addSubObject(sub)
    }

    // 单独处理三个变量
    if (conf instanceof SceneBase) {
        this.__onUpdate__ = conf.__onUpdate__
    } else if (conf.__onUpdate__) {
        this.__onUpdateFunction__ = conf.__onUpdate__
    }

    if (conf instanceof SceneBase) {
        this.__onInactive__ = conf.__onInactive__
    } else if (conf.__onInactive__) {
        this.__onInactiveFunction__ = conf.__onInactive__
    }

    if (conf.__subObjects__) {
        if (Array.isArray(conf.__subObjects__)) {
            for (var value of conf.__subObjects__) {
                this.addSubObject(value)
            }
        } else {
            for (var key of Object.keys(conf.__subObjects__)) {
                this.addSubObject(conf.__subObjects__[key], key)
            }
        }
    }

    // 添加触发器
    if (conf instanceof SceneBase) {
        if (conf.__triggers__ === undefined) {
            conf.__triggers__ = []
        }
        conf.__triggers__.push(this)
    }
}

SceneBase.prototype.isInActiveRange = function (rate, scrolled, gloalVars) {
    if (rate < this.__start__ || rate > this.__end__) {
        return false
    }
    return true
}

SceneBase.prototype.calculatePercentage = function (rate, scrolled, gloalVars) {
    return (rate - this.__start__) / (this.__end__ - this.__start__)
}

SceneBase.prototype.__onActivate__ = function (rate, abso, gloalVars) {
    // 计算当前场景的进度
    rate = this.calculatePercentage.call(this, rate, abso, gloalVars)

    if (typeof this.onActivate === 'function') {
        this.onActivate.call(this, rate, abso, gloalVars)
    }
}

/**
 * 场景自动更新函数，自动生成，用户无需更改
 * @param {父场景中当前的进度值} rate 
 * @param {场景已经滚动的绝对值} scrolled 
 * @param {全局变量} gloalVars 
 */
SceneBase.prototype.__onUpdate__ = function (rate, scrolled, gloalVars) {
    // 计算当前场景的进度
    rate = this.calculatePercentage.call(this, rate, scrolled, gloalVars)

    // 先自己更新
    if (typeof this.onUpdate === 'function') {
        this.onUpdate.call(this, rate, scrolled, gloalVars)
    }

    // 再更新自己的所有子元素
    for (var subObj of Object.values(this.__subObjects__)) { 
        // 子场景自己判断，如果不在范围内
        if (subObj.isInActiveRange.call(subObj, rate, scrolled, gloalVars) === false) {
            if (subObj.isActive() === true) {
                subObj.__onInactive__.call(subObj, rate, scrolled, gloalVars)
                subObj.end()
            }
            
            subObj.__onUpdateInactive__.call(subObj, rate, scrolled, gloalVars)
            continue
        }
        
        // 子场景在范围内，需要更新
        // 调用子场景的更新函数
        if (subObj.isActive() === false) {
            subObj.__onActivate__.call(subObj, rate, scrolled, gloalVars)
            subObj.start()
        }

        subObj.__onUpdate__.call(subObj, rate, scrolled, gloalVars)
    }
}

SceneBase.prototype.__onInactive__ = function (rate, scrolled, gloalVars) {
    // 先销毁漏网之鱼
    for (var subObj of Object.values(this.__subObjects__)) {
        if (subObj.isActive() === true) {
            subObj.__onInactive__.call(subObj, rate, scrolled, gloalVars)
            subObj.end()
        }
    }

    // 再销毁自己
    if (typeof this.onInactive === 'function') {
        // 计算当前场景的进度
        rate = this.calculatePercentage.call(this, rate, scrolled, gloalVars)

        this.onInactive.call(this, rate, scrolled, gloalVars)
    }
}

SceneBase.prototype.__onUpdateInactive__ = function (rate, abso, gloalVars) {
    if (typeof this.onUpdateInactive === 'function') {
        // 计算当前场景的进度
        rate = this.calculatePercentage.call(this, rate, abso, gloalVars)
        
        this.onUpdateInactive.call(this, rate, abso, gloalVars)
    }
}

SceneBase.prototype.addSubObject = function (obj, id, father) {
    if (this.__triggers__) {
        for (var t of this.__triggers__) {
            t.addSubObject(obj, id)
        }
    }
    
    if (id === undefined) {
        if (SceneBase.__maxSubObjId__ === undefined) {
            SceneBase.__maxSubObjId__ = 0
        }
        id = "__untitled" + (SceneBase.__maxSubObjId__++) + "__"
    }

    father = father ? father : this

    if (obj.__father__ === undefined) {
        obj.__father__ = father
    }
    
    if (obj instanceof SceneBase) {
        this.__subObjects__[id] = obj
    } else {
        this.__subObjects__[id] = new SceneBase(obj, father)
    }
    
    return id
}

SceneBase.prototype.delSubObject = function (id, rate, scrolled, gloalVars) {
    if (this.__subObjects__[id] instanceof SceneBase && this.__subObjects__[id].isActive() === true) {
        this.__subObjects__[id].__onInactive__(rate, scrolled, gloalVars)
    }
    delete this.__subObjects__[id]
}

SceneBase.prototype.start = function () {
    this.__isActive__ = true
}

SceneBase.prototype.end = function () {
    this.__isActive__ = false
}

SceneBase.prototype.isActive = function () {
    return this.__isActive__
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

SceneBase.linearMap = function (now, startNum, endNum, startOutput, endOutput) {
    let tmpValue = (now - startNum) / (endNum - startNum) * (endOutput - startOutput) + startOutput
    tmpValue = Math.max(tmpValue, Math.min(startOutput, endOutput))
    tmpValue = Math.min(tmpValue, Math.max(startOutput, endOutput))
    return tmpValue
}

SceneBase.__gloalVars__ = {}

export default SceneBase