import SceneBase from "../utils/SceneBase.js"

/**
 * 2.0 版场景定义
 */
export class SceneExtendedTemplate extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)
        
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__(rate, abso, gloalVars) {

    }

    /**
     * 滚动更新时的更新函数
     * @param {rate}       当前场景的百分比
     * @param {abso}       全局绝对量
     * @param {gloalVars}  全局变量存放处
     */
    __onUpdate__ (rate, abso, gloalVars) {
        // 先自己代码再 super
        super.__onUpdate__(rate, abso, gloalVars)
    }

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    __onInactive__ (rate, abso, gloalVars) {
        super.__onInactive__(rate, abso, gloalVars)
        // 先 super 再自己的代码
    }

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    __onUpdateInactive__(rate, abso, gloalVars) {

    }

    /**
     * 子场景配置文件 可以是 [{conf}] 或 {id: {conf}} 
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__ = {}

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}