import SceneBase from "../SceneBase.js"
import { getRgb } from "../helpers.js"

/**
 * 2.0 版场景定义
 */
export default class ScrollBarChart extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)

        conf = Object.assign({
            "__onload__": function (data) {
                // console.log(data)
                return data
            }, 
            "__dataUrl__": "/data/lowcarbon_number.json", 
            "__dataUrl0__": "/data/lowcarbon_per.json",
            "__colors__": [ 
                getRgb(155, 249, 208), 
                "#B375F0", 
                "#FCAB1E"
            ], 
            "minYear" : 2010,
            "maxYear" : 2018,
            __canvasId__: "policy-freq-svg"
        }, conf)

        this.__onload__ = conf.__onload__
        this.__dataUrl__ = conf.__dataUrl__
        this.__dataUrl0__ = conf.__dataUrl0__
        this.colors = conf.__colors__
        this.minYear = conf.minYear
        this.maxYear = conf.maxYear
        this.__canvasId__ = conf.__canvasId__


        d3.json(this.__dataUrl0__).then((data) => {
            data = this.__onload__(data)
            // console.log(data.data)
            // console.log(this.minYear,this.maxYear)

            var maxCnt = -Infinity
            var minCnt = Infinity

            for (var yearData of data.data.data) {
                
                for (var lowcarbon of yearData.data) {
                    maxCnt = Math.max(maxCnt, lowcarbon.per)
                    minCnt = Math.min(minCnt, lowcarbon.per) 
                         
                }
            }
            // console.log("maxCnt :"+maxCnt+"  minCnt:"+minCnt)


            var padding = {top: 50, right: 50, bottom: 80, left: 100}
            // 遍历年
            for (var yearData of data.data.data) {
                var yearName = yearData.year
                var lowcarbon = yearData.data
                var index = 0
                // 遍历每个国家
                for (var lowcarbon of yearData.data) {
                    var lc_value = lowcarbon.per
                    var countryName = lowcarbon.country
                    lowcarbon.index = index  
                    index = index+1

                    this.addSubObject({
                        __start__: (yearName-2010)/9, 
                        __end__: (yearName-2010)/9 + 1/9, 
                        
                        onActivate: function (rate, absolute, globalVars) {
                            // 添加圆形
                            d3.select("#word-freq-bar-g")
                                .append("circle")
                                .attr("id", "circle-" + this.yearName + "-" + this.countryName)
                                .attr("class", "circle-bars")
                                .attr("cx", (this.svgWidth - padding.left - padding.right) * 0.2 + padding.left)
                                .attr("cy", this.svgHeight - padding.top - (this.svgHeight - padding.top - padding.bottom) / 15 * this.lowcarbon.index + (this.svgHeight - padding.top - padding.bottom) / 15 * 0.35)
                                .attr("fill", "#B375F0")
                                .attr("fill-opacity",0.8)

                            //国家名字
                            d3.select("#word-freq-bar-g")
                                .append("text")
                                .attr("class","circle-bars")
                                .attr("id", "circletext-" + this.yearName + "-" + this.countryName)
                                .attr("x",padding.left)
                                .attr("y",this.svgHeight - padding.top -  (this.svgHeight - padding.top - padding.bottom) / 15 * this.lowcarbon.index + (this.svgHeight - padding.top - padding.bottom) / 15 * 0.35)
                                .attr("style", "text-anchor:left;dominant-baseline:middle;")
                                .style("fill", "black")
                                .attr("dx","12px")
                                .attr("font-size","14px")
                                .text(this.countryName)

                            // 添加遮罩
                            d3.select("#word-freq-bar-g")
                                .append("rect")
                                .attr("class","circle-bars")
                                .attr("id", "overlay")
                                .attr("x",(this.svgWidth - padding.left - padding.right) * 0.2 + padding.left)
                                .attr("y",padding.top + (this.svgHeight - padding.top - padding.bottom) / 15 * 0.7 )
                                .attr("width", 30)
                                .attr("height", (this.svgHeight - padding.top - padding.bottom) * 1.1)
                                .attr("fill", getComputedStyle(document.documentElement).getPropertyValue('--body-background'))
                                .attr("fill-opacity",1)
                                .attr("stroke-width", 2)
                                .attr("stroke", getComputedStyle(document.documentElement).getPropertyValue('--body-background'))
                        
                        },
                        onUpdate: function (rate, absolute, globalVars) {

                            var xScale = d3.scaleLinear()
                                            .domain([ 0 , this.maxCnt ])
                                            .range([ 0 , 30 ])
                            var circle_r = xScale(this.lc_value)
                            var last_circle_r = 0
                            if( this.yearName > 2010){
                                last_circle_r = xScale(this.all_data[Number(this.yearName)-1-2010].data[this.lowcarbon.index].per)
                            }
                            var next_circle_r = 0
                            if( this.yearName < 2018){
                                next_circle_r = xScale(this.all_data[Number(this.yearName)+1-2010].data[this.lowcarbon.index].per)
                            }

                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#circle-" + this.yearName + "-" + this.countryName)
                                    .attr("r",ScrollBarChart.getValueByRate(last_circle_r, circle_r ,rate))
                            }else{
                                d3.select("#circle-" + this.yearName + "-" + this.countryName)
                                    .attr("r",ScrollBarChart.getValueByRate(next_circle_r, circle_r ,1-rate))
                            }
                            
                        },
                        onInactive: function (rate, absolute, globalVars) {
                            d3.select("#circle-" + this.yearName + "-" + this.countryName).remove()
                            d3.select("#circletext-" + this.yearName + "-" + this.countryName).remove()
                            d3.select("#overlay").remove()
                        },

                        maxCnt: maxCnt,
                        all_data : data.data.data,
                        yearName: yearName,
                        lowcarbon: lowcarbon,
                        countryName: countryName,
                        lc_value: lc_value,
                        svgHeight: conf.svgHeight,
                        svgWidth: conf.svgWidth
                    })
                    
                
                }


            }

            this.addSubObject({
                __start__: 0, 
                __end__: 1, 
                onActivate: function (rate, absolute, globalVars) {
                    //国家
                    d3.select("#word-freq-bar-g")
                        .append("text")
                        .attr("class","circle-bars")
                        .attr("id", "country")
                        .attr("x",padding.left)
                        .attr("y",padding.top)
                        .attr("style", "text-anchor:center;dominant-baseline:middle;")
                        .style("fill", "black")
                        .attr("dx","16px")
                        .attr("dy","14px")
                        .attr("font-size","18px")
                        .text("国家")
                    //占比
                    d3.select("#word-freq-bar-g")
                    .append("text")
                    .attr("class","circle-bars")
                    .attr("id", "per")
                    .attr("x",(this.svgWidth - padding.left - padding.right) * 0.2 + padding.left)
                    .attr("y",padding.top)
                    .attr("style", "text-anchor:center;dominant-baseline:middle;")
                    .style("fill", "black")
                    .attr("dx","-36px")
                    .attr("dy","14px")
                    .attr("font-size","18px")
                    .text("占比%")

                },
                onUpdate: function (rate, absolute, globalVars) {

                },
                onInactive: function (rate, absolute, globalVars) {

                    d3.select("#country").remove()
                    d3.select("#per").remove()
                },
                
                maxCnt: maxCnt,
                svgHeight: conf.svgHeight,
                svgWidth: conf.svgWidth
                 
            })
        })

        d3.json(this.__dataUrl__).then((data) => {
            data = this.__onload__(data)


            var maxCnt = -Infinity
            var minCnt = Infinity

            for (var yearData of data.data.data) {
                
                for (var lowcarbon of yearData.data) {
                    maxCnt = Math.max(maxCnt, lowcarbon.value)
                    minCnt = Math.min(minCnt, lowcarbon.value)             
                }
            }

            this.addSubObject({
                __start__: 0, 
                __end__: 1, 
                onActivate: function (rate, absolute, globalVars) {
                    // 添加x轴
                    var xScale = d3.scaleLinear()
                                    .domain([ 0 , this.maxCnt ])
                                    .range([ 0 , (this.svgWidth - padding.left - padding.right) * 0.7 ])
                    var xAxis = d3.axisBottom(xScale)
                                .tickFormat(d3.format("d"))
                    d3.select("#word-freq-bar-g")
                        .append("g")
                        .attr("class", "axis")
                        .attr("id", "X_axis")
                        .attr("transform","translate("+ ((this.svgWidth - padding.left - padding.right) * 0.3 + padding.left) +","+ ( this.svgHeight - padding.bottom -  (this.svgHeight - padding.top - padding.bottom)) +")")
                        .call(xAxis) 

                },
                onUpdate: function (rate, absolute, globalVars) {

                },
                onInactive: function (rate, absolute, globalVars) {
                    d3.select("#X_axis").remove()
                },
                
                maxCnt: maxCnt,
                svgHeight: conf.svgHeight,
                svgWidth: conf.svgWidth
                 
            })

            var padding = {top: 50, right: 50, bottom: 80, left: 100}
            // 遍历年
            for (var yearData of data.data.data) {
                var yearName = yearData.year
                var lowcarbon = yearData.data
                var index = 0

                //时间
                this.addSubObject({
                    __start__: (yearName-2010)/9, 
                    __end__: (yearName-2010)/9 + 1/9, 
                    // 添加时间显示
                    onActivate: function (rate, absolute, globalVars) {
                        d3.select("#word-freq-bar-g") 
                        .append("text")
                        .attr("id", "time-year-" + this.yearName)
                        .attr("class", "scroll-bar-time-showing")
                        .attr("x", this.svgWidth - padding.left)
                        .attr("y", this.svgHeight - padding.bottom)
                        .attr("dx","-50px")
                        .attr("dy","70px")
                        .attr("style", "text-anchor:right;dominant-baseline:middle;")
                        .attr("font-size", 30)
                        .attr("opacity", 0)
                    },
                    onUpdate: function (rate, absolute, globalVars) {
                        // 更新时间显示
                        var a = (new Date((this.yearName).toString()+"/1/1 00:00:00")).getTime();
                        var b = (new Date((this.yearName).toString()+"/12/31 23:59:00")).getTime();
                        var result = Math.abs(a - b);

    
                        var dd = (new Date(a + result * rate))
                        var month = ScrollBarChart.PrefixInteger(dd.getMonth()+1, 2)    
                        var day = ScrollBarChart.PrefixInteger(dd.getDate(), 2)
                        var t = dd.getFullYear()+"-"+month+"-"+day
                        d3.select("#time-year-" + this.yearName)
                        .text(t)
                        .attr("opacity", 1)
                    },
                    onInactive: function (rate, absolute, globalVars) {
                        d3.select("#time-year-" + this.yearName).remove()
                    },

                    yearName: yearName,
                    svgHeight: conf.svgHeight,
                    svgWidth: conf.svgWidth
                })
 
                // 遍历每个国家
                for (var lowcarbon of yearData.data) {
                    var lc_value = lowcarbon.value
                    var countryName = lowcarbon.country
                    lowcarbon.index = index  
                    index = index+1

                    this.addSubObject({
                        __start__: (yearName-2010)/9, 
                        __end__: (yearName-2010)/9 + 1/9, 
                        
                        onActivate: function (rate, absolute, globalVars) {
                            // 添加矩形
                            d3.select("#word-freq-bar-g")
                                .append("rect")
                                .attr("id", "rect-" + this.yearName + "-" + this.countryName)
                                .attr("class", "rect-bars")
                                .attr("x", (this.svgWidth - padding.left - padding.right) * 0.3 + padding.left)
                                .attr("fill", "#FCAB1E")
                                .attr("fill-opacity",0.9)
                                .attr("stroke-width", 2)
                                .attr("stroke", getComputedStyle(document.documentElement).getPropertyValue('--body-background'))
                                .attr("rx", Math.min(globalVars.svgWidth, globalVars.svgHeight) * 0.02)
                                .attr("ry", Math.min(globalVars.svgWidth, globalVars.svgHeight) * 0.02)
                                .attr("y", this.svgHeight - padding.top -  (this.svgHeight - padding.top - padding.bottom) / 15 * this.lowcarbon.index )
                                .attr("width", 0)
                                .attr("height", (this.svgHeight - padding.top - padding.bottom) / 15 * 0.7)
                            
                            d3.select("#word-freq-bar-g")
                                .append("text")
                                .attr("class","rect-bars")
                                .attr("id", "recttext-" + this.yearName + "-" + this.countryName)
                                .attr("x",this.svgWidth - padding.right)
                                .attr("y",this.svgHeight - padding.top -  (this.svgHeight - padding.top - padding.bottom) / 15 * this.lowcarbon.index )
                                .attr("style", "text-anchor:right;dominant-baseline:middle;")
                                .style("fill", "black")
                                .attr("dx","-5px")
                                .attr("dy","10px")
                                .attr("font-size","14px")
                                .text(this.lc_value)
                        
                        },
                        onUpdate: function (rate, absolute, globalVars) {
                            var xScale = d3.scaleLinear()
                                            .domain([ 0 , this.maxCnt ])
                                            .range([ 0 , (this.svgWidth - padding.left - padding.right) * 0.7 ])
                            var rect_width = xScale(this.lc_value)
                            var last_rect_width = 0
                            if( this.yearName > 2010){
                                last_rect_width = xScale(this.all_data[Number(this.yearName)-1-2010].data[this.lowcarbon.index].value)
                            }
                            var next_rect_width = 0
                            if( this.yearName < 2018){
                                next_rect_width = xScale(this.all_data[Number(this.yearName)+1-2010].data[this.lowcarbon.index].value)
                            }

                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.countryName)
                                    .attr("width",ScrollBarChart.getValueByRate(last_rect_width, rect_width ,rate))
                            }else{
                                d3.select("#rect-" + this.yearName + "-" + this.countryName)
                                    .attr("width",ScrollBarChart.getValueByRate(next_rect_width, rect_width ,1-rate))
                            }
                            
                        },
                        onInactive: function (rate, absolute, globalVars) {
                            d3.select("#rect-" + this.yearName + "-" + this.countryName).remove()
                            d3.select("#recttext-" + this.yearName + "-" + this.countryName).remove()
                        },

                        maxCnt: maxCnt,
                        all_data : data.data.data,
                        yearName: yearName,
                        lowcarbon: lowcarbon,
                        countryName: countryName,
                        lc_value: lc_value,
                        svgHeight: conf.svgHeight,
                        svgWidth: conf.svgWidth
                    })
                    
                
                }


            }
        })
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
    onActivate (rate, abso, gloalVars) {
        // console.log(this.__subObjects__)
      d3.select("#" + this.__canvasId__)
        .append("g")
        .attr("class", "word-freq-bar")
        .attr("id", "word-freq-bar-g")
    }

    /**
     * 滚动更新时的更新函数
     * @param {rate}       当前场景的百分比
     * @param {abso}       全局绝对量
     * @param {gloalVars}  全局变量存放处
     */
    onUpdate (rate, abso, gloalVars) {

    }

    /**
     * 场景被销毁时执行的函数，一般用于删除对象
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    onInactive (rate, abso, gloalVars) {
        d3.select("#" + this.__canvasId__)
          .selectAll(".word-freq-bar")
          .remove();
    }

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    onUpdateInactive (rate, abso, gloalVars) {

    }

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}

ScrollBarChart.getPositionByRank = function (rank, dataLength, svgHeight) {
    return (rank + 0.5) / (dataLength + 1) * svgHeight * 0.9
}

ScrollBarChart.getWidthByCnt = function (cnt, minn, maxx, svgWidth) {
    return (cnt - minn + 1) / (maxx - minn + 1) * svgWidth * 0.8
}

ScrollBarChart.getValueByRate = function (start, end, rate) {
    return rate * (end - start) + start 
}

ScrollBarChart.getHeightByDataLength = function (leng, svgHeight) {
    return 1 / (leng + 1) * svgHeight * 0.9 * 0.9
}

ScrollBarChart.PrefixInteger = function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};