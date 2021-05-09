export default {
    /**
     * 场景开始的滚动百分比
    */
    __start__: 0, 

    /** 
     * 场景结束的滚动百分比
    */
    __end__: 1, 

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__: function (rate, scrolled, gloalVars) {
        
    }, 

    /**
     * 滚动更新时的更新函数
     * @param {rate}       当前场景的百分比
     * @param {scrolled}   滚动百分比绝对值
     * @param {gloalVars}  全局变量存放处
     */
    __onUpdate__: function (rate, scrolled, gloalVars) {
        
    }, 

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onInactive__: function (scrolled, gloalVars) {
        
    }, 

    /**
     * 未激活时的滚动更新参数
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onUpdateInactive__: function (scrolled, gloalVars) {
        
    },

    /**
     * 子场景配置文件 可以是 [{conf}] 或 {id: {conf}} 
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__: []

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}