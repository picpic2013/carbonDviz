class AnimationSceneBasePlugin {}

AnimationSceneBasePlugin.install = function (SceneBase, conf) {
    // 动画更新函数
    AnimationSceneBasePlugin.__animationUpdate__ = function (time) {
        AnimationSceneBasePlugin.__nowAnimationTime__ = time
    
        AnimationSceneBasePlugin.__animations__.__onUpdate__ (time, time, SceneBase.__setGloalVars__)
    
        requestAnimationFrame(AnimationSceneBasePlugin.__animationUpdate__)
    }
    
    // 初始化函数
    AnimationSceneBasePlugin.init = function () {
        if (AnimationSceneBasePlugin.__requestAnimationFrame__ === undefined) {
            AnimationSceneBasePlugin.__requestAnimationFrame__ = requestAnimationFrame(AnimationSceneBasePlugin.__animationUpdate__)
        }
    
        if (AnimationSceneBasePlugin.__animations__ === undefined) {
            SceneBase.__animations__ = SceneBase.newInstance({
                __start__: 0, 
                __end__: Infinity
            })
        }
    }
    
    // 停止所有动画
    AnimationSceneBasePlugin.stopAnimation = function () {
        if (AnimationSceneBasePlugin.__requestAnimationFrame__) {
            cancelAnimationFrame(AnimationSceneBasePlugin.__requestAnimationFrame__)
            delete AnimationSceneBasePlugin.__requestAnimationFrame__
        }
    
        if (AnimationSceneBasePlugin.__animations__) {
            delete AnimationSceneBasePlugin.__animations__
        }
    }
    
    // 添加动画
    AnimationSceneBasePlugin.addAnimation = function () {
        return AnimationSceneBasePlugin.__animations__.addSubObject(...arguments)
    }
    
    // 删除动画
    AnimationSceneBasePlugin.delAnimation = function () {
        return AnimationSceneBasePlugin.__animations__.delSubObject(...arguments)
    }

    SceneBase.prototype.animation = AnimationSceneBasePlugin
}