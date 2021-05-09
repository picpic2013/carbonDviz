import SceneBase from "../utils/SceneBase.js"
import { getRgb } from "../utils/helpers.js"

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
        
        for (var i = 0 ; i < 10; ++i) {
            this.addSubObject({
                __start__: 0.45 / 11 * (i + 1), 
                __end__: 1, 
                
                __onActivate__: function (rate, scrolled, gloalVars) {
                    this.svg = d3.select("#main-camvas")
                                .append("g")
                                .attr("class", "test-scene2")
                                .attr("id", "test-scene2-g-" + this.index)

                                .append("circle")
                                .attr("id", "test-scene-circle-" + this.index)
                                .attr("cx", (this.index + 1) / 12 * gloalVars.svgWidth)
                                .attr("cy", gloalVars.svgHeight * 0.5)
                                .attr("r", 40)
                                .attr("fill", getRgb(0, 0, 0))
                                .attr("stroke", getRgb(255, 255, 255))
                                .attr("stroke-width", 5)
                    
                },                 

                __onInactive__: function (scrolled, gloalVars) {
                    d3.select("#test-scene2-g-" + this.index).remove()
                }, 

                __subObjects__: [
                    {
                        __start__: 0, 
                        __end__: 0.45 / 11 * (i + 1), 
                        __onUpdate__: function (rate, scrolled, gloalVars) {
                            d3.select("#test-scene-circle-" + this.index)
                              .attr("r", 40 + (1 - rate) * 100)
                              .attr("opacity", rate)
                        }, 
                        __onInactive__: function (rate, scrolled, gloalVars) {
                            if (this.__isInActiveRange__(rate, scrolled, gloalVars) === false) {
                                d3.select("#test-scene-circle-" + this.index)
                                  .attr("r", 40)
                                  .attr("opacity", 1)
                            } else {
                                d3.select("#test-scene-circle-" + this.index)
                                  .attr("r", 140)
                                  .attr("opacity", 0)
                            }
                        }, 
                        index: i
                    }, {
                        __start__: 0.45 / 11 * (i + 1) + 0.5, 
                        __end__: 1, 
                        __onUpdate__: function (rate, scrolled, gloalVars) {
                            d3.select("#test-scene-circle-" + this.index)
                              .attr("r", 40 + rate * 100)
                              .attr("opacity", (1 - rate))
                        }, 
                        __onInactive__: function (rate, scrolled, gloalVars) {
                            if (this.__isInActiveRange__(rate, scrolled, gloalVars) === false) {
                                d3.select("#test-scene-circle-" + this.index)
                                  .attr("r", 40)
                                  .attr("opacity", 1)
                            } else {
                                d3.select("#test-scene-circle-" + this.index)
                                  .attr("r", 140)
                                  .attr("opacity", 0)
                            }
                        }, 
                        index: i
                    }
                ], 

                index: i
            })
        }
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__(rate, scrolled, gloalVars) {

    }

    /**
     * 滚动更新时的更新函数
     * @param {*} rate      当前场景的百分比
     * @param {*} scrolled  滚动百分比绝对值
     * @param {*} gloalVars 全局变量存放处
     */
    __onUpdate__ (rate, scrolled, gloalVars) {
        super.__onUpdate__(rate, scrolled, gloalVars)
        
    }

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onInactive__ (scrolled, gloalVars) {
        super.__onInactive__(scrolled, gloalVars)
        
    }

    /**
     * 未激活时的滚动更新参数
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onUpdateInactive__(scrolled, gloalVars) {

    }

    /**
     * 子场景配置文件
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__ = {}

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}