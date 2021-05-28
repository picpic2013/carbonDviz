import SceneBase from "../utils/SceneBase.js"
import helpers from "../utils/helpers.js"

/**
 * 2.0 版场景定义
 */
export default class TitleScene extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)
      
        this.addSubObject({
            __start__: 0.9, 
            __end__: 1, 
            __onUpdate__: function (rate, abso, gloalVars) {
               // console.log(rate)
               d3.select("#scene1-g")
                 .attr("opacity", SceneBase.sc.linearMap(rate, 0, 1, 1, 0))
            }, 
            __onInactive__: function (rate) {
               d3.select("#scene1-g")
                 .attr("opacity", SceneBase.sc.linearMap(rate, 0, 1, 1, 0))
            }
         })
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
    __onActivate__(rate, abso, gloalVars) {
      var svg = d3.select("#main-camvas")
                  .append("g")
                  .attr("class", "scene1")
                  .attr("id", "scene1-g")

      // 标题
      svg.append("text")
         .attr("x", gloalVars.svgWidth * 0.5)
         .attr("y", gloalVars.svgHeight * 0.1)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("font-size", 80)
         .text("碳中和啥啥啥，反正就是标题");

      // 树
      svg.append("g")
         .attr("transform", "translate(" + gloalVars.svgWidth * 0.25 + "," + gloalVars.svgHeight * 0.7 + ")")
         .append("text")
         .attr("id", "tree")
         .attr("x", 0)
         .attr("y", 0)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("transform", "scale(1.5, 5)")
         .attr("fill", "green")
         .attr('font-size', 80)
         .text("树");

      // 高楼
      svg.append("g")
         .attr("transform", "translate(" + gloalVars.svgWidth * 0.75 + "," + gloalVars.svgHeight * 0.7 + ")")
         .append("text")
         .attr("x", 0)
         .attr("y", 0)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("transform", "scale(1.5, 7)")
         .attr("fill", "black")
         .attr('font-size', 80)
         .text("高楼");

      // 烟
      svg.append("g")
         .attr("transform", "translate(" + gloalVars.svgWidth * 0.5 + "," + gloalVars.svgHeight * 0.7 + ")")
         .append("text")
         .attr("x", 0)
         .attr("y", 0)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("transform", "scale(1, 3)")
         .attr("fill", "gray")
         .attr('font-size', 80)
         .text("<--烟--");

      // 树的时间
      svg.append("text")
         .attr("id", "tree-time")
         .attr("x", gloalVars.svgWidth * 0.25)
         .attr("y", gloalVars.svgHeight * 0.3)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("font-size", 80)
         .text("2021");

      // 楼的时间
      svg.append("text")
         .attr("id", "building-time")
         .attr("x", gloalVars.svgWidth * 0.75)
         .attr("y", gloalVars.svgHeight * 0.3)
         .attr("style", "text-anchor:middle;dominant-baseline:middle;")
         .attr("font-size", 80)
         .text("2021");
    }

    /**
     * 滚动更新时的更新函数
     * @param {rate}       当前场景的百分比
     * @param {abso}       全局绝对量
     * @param {gloalVars}  全局变量存放处
     */
    __onUpdate__ (rate, abso, gloalVars) {
      // 先自己代码再 super
      var rawRate = rate
      // rate = SceneBase.sc.linearMap(abso, 0, 10 * gloalVars.svgHeight, 0, 1)
      // console.log(abso, rate)

      // 更新树、楼的时间和颜色
      var svg = d3.select("#scene1-g")
      var treeTime = svg.select("#tree-time")
      var buildingTime = svg.select("#building-time")
      var tree = svg.select("#tree")

      treeTime.text("" + Math.ceil(2021 + rate * 2000))
           
      tree.attr("fill", helpers.getRgb(rate * 218, (1 - rate) * (255 - 60), 0))
      buildingTime.text("" + Math.ceil(2021 + rate * 300))

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

      var svg = d3.select("#main-camvas")

      svg.selectAll(".scene1")
         .remove();
    }

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    __onUpdateInactive__(rate, abso, gloalVars) {

    }

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}