import SceneBase from "../SceneBase.js"

/**
 * 2.0 版场景定义
 */
export default class LinearOpacityAnimation extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)
        
        this.conf_ = Object.assign({
            mountOn: 'body', 
            startOpacity: 0, 
            endOpacity: 1
        }, conf)
    }

    /**
     * 滚动更新时的更新函数
     * @param {rate}       当前场景的百分比
     * @param {abso}       全局绝对量
     * @param {gloalVars}  全局变量存放处
     */
    onUpdate (rate, abso, gloalVars) {
        d3.select(this.conf_.mountOn)
          .attr("opacity", SceneBase.linearMap(rate, 0, 1, this.conf_.startOpacity, this.conf_.endOpacity))
    }

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    onInactive (rate, abso, gloalVars) {
        d3.select(this.conf_.mountOn)
          .attr("opacity", SceneBase.linearMap(rate, 0, 1, this.conf_.startOpacity, this.conf_.endOpacity))
    }
}