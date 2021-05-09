class ScrollSceneBasePlugin {}

ScrollSceneBasePlugin.install = function (SceneBase, conf) {
    // 更新函数
    ScrollSceneBasePlugin.__scrollUpdateFunction__ = function () {
        // 真实的滚动值
        var scrolled = (document.documentElement.scrollTop || document.body.scrollTop)
        
        // 滚动的百分比
        var rate = scrolled / (document.documentElement.scrollHeight - ScrollSceneBasePlugin.__pageHeight__)
        
        ScrollSceneBasePlugin.lastScrolled = ScrollSceneBasePlugin.nowScrolled
        ScrollSceneBasePlugin.lastRate = ScrollSceneBasePlugin.nowRate
        ScrollSceneBasePlugin.nowScrolled = scrolled
        ScrollSceneBasePlugin.nowRate = rate

        ScrollSceneBasePlugin.__rootScene__.__onUpdate__(rate, scrolled, SceneBase.__gloalVars__)
    }

    // 初始化函数
    ScrollSceneBasePlugin.init = function () {
        if (ScrollSceneBasePlugin.__rootScene__ === undefined) {
            ScrollSceneBasePlugin.__rootScene__ = new SceneBase(...arguments)
        }

        // 获取页面高度
        ScrollSceneBasePlugin.__pageHeight__ = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

        // 滚动时进行更新
        window.addEventListener("scroll", ScrollSceneBasePlugin.__scrollUpdateFunction__)

        // 加载完先自动更新一波
        var oldOnloadFunction = window.onload
        window.onload = function () {
            ScrollSceneBasePlugin.__scrollUpdateFunction__()
            if (oldOnloadFunction) {
                oldOnloadFunction.call(window)
            }
        }

        return SceneBase.__rootScene__
    }

    SceneBase.scroll = ScrollSceneBasePlugin
}

export default ScrollSceneBasePlugin