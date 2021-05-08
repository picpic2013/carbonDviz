import { getRgb } from "../utils/helpers.js"

export default {
    /**
     * 场景开始的滚动百分比
    */
    __start__: 0.315, 

    /** 
     * 场景结束的滚动百分比
    */
    __end__: 0.48, 

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__: function (rate, scrolled, gloalVars) {
        var svg = d3.select("#main-camvas")
                    .append("g")
                    .attr("class", "test-scene")
                    .attr("id", "test-scene-g")

        this.circle = svg.append("circle")
                         .attr("id", "test-scene-circle")
                         .attr("cx", 0)
                         .attr("cy", gloalVars.svgHeight * 0.5)
                         .attr("r", 40)
                         .attr("fill", getRgb(0, 0, 0))
                         .attr("stroke", getRgb(255, 255, 255))
                         .attr("stroke-width", 5)
    }, 

    /**
     * 滚动更新时的更新函数
     * @param {*} rate      当前场景的百分比
     * @param {*} scrolled  滚动百分比绝对值
     * @param {*} gloalVars 全局变量存放处
     */
    __onUpdate__: function (rate, scrolled, gloalVars) {
        
    }, 

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onInactive__: function (scrolled, gloalVars) {
        d3.select("#main-camvas")
          .selectAll(".test-scene")
          .remove();
    }, 

    /**
     * 子场景配置文件
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__: [[[
        {
            __start__: 0, 
            __end__: 0.48, 
            __onUpdate__: function (rate, scrolled, gloalVars) {
                this.__father__.circle.attr("cx", gloalVars.svgWidth * rate)
            }
        }, {
            __start__: 0.48, 
            __end__: 1, 
            __onUpdate__: function (rate, scrolled, gloalVars) {
                this.__father__.circle.attr("cx", gloalVars.svgWidth * 0.5 * (2 - rate))
                                      .attr("cy", gloalVars.svgHeight * 0.5 * (1 - rate))
            }, 
            __subObjects__: [[
                {
                    __onUpdate__: function (rate, scrolled, gloalVars) {
                        // console.log(this.__father__)
                    }
                }
            ]]
        }], {
            __start__: 0.2, 
            __end__: 0.7, 
            __onUpdate__: function (rate, scrolled, gloalVars) {
                this.__father__.circle.attr("fill", getRgb(rate * 255, rate * 255, rate * 255))
            }
        }
    ]]

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}