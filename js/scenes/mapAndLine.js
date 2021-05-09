export default {
    /**
     * 场景开始的滚动百分比
    */
    __start__: 0.131, 

    /** 
     * 场景结束的滚动百分比
    */
    __end__: 0.3, 

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__: function (rate, scrolled, gloalVars) {
        this.svgLeft = d3.select("#main-camvas")
                         .append("g")
                         .attr("class", "map-and-line-scene")
                         .attr("id", "map-and-line-scene-l")

        this.svgRight = d3.select("#main-camvas")
                          .append("g")
                          .attr("class", "map-and-line-scene")
                          .attr("id", "map-and-line-scene-r")
                          .attr("transform", "translate(" + gloalVars.svgWidth * 0.5 + "," + 0 + ")")

        this.svgLeft.append("text")
                    .attr("x", gloalVars.svgWidth * 0.25)
                    .attr("y", gloalVars.svgHeight * 0.1)
                    .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                    .attr("font-size", 40)
                    .text("世界地图")

        this.svgRight.append("text")
                     .attr("x", gloalVars.svgWidth * 0.25)
                     .attr("y", gloalVars.svgHeight * 0.1)
                     .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                     .attr("font-size", 40)
                     .text("条形图")

        this.timeText = d3.select("#main-camvas")
                          .append("text")
                          .attr("class", "map-and-line-scene")
                          .attr("id", "map-and-line-scene-year")
                          .attr("x", gloalVars.svgWidth * 0.5)
                          .attr("y", gloalVars.svgHeight * 0.9)
                          .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                          .attr("font-size", 80)
                          .text("1960")
    }, 

    /**
     * 滚动更新时的更新函数
     * @param {*} rate      当前场景的百分比
     * @param {*} scrolled  滚动百分比绝对值
     * @param {*} gloalVars 全局变量存放处
     */
    __onUpdate__: function (rate, scrolled, gloalVars) {
        this.timeText.text("" + Math.ceil(1950 + rate * 70))
    }, 

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {rate}      当前场景的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onInactive__: function (rate, scrolled, gloalVars) {
        var svg = d3.select("#main-camvas")

        svg.selectAll(".map-and-line-scene")
           .remove()

        delete this.svgLeft
        delete this.svgRight
        delete this.timeText
    }, 

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {scrolled}  滚动百分比绝对值
     * @param {gloalVars} 全局变量存放处
     */
    __onUpdateInactive__: function (rate, scrolled, gloalVars) {
        
    },

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}