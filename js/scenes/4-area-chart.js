import SceneBase from "../utils/SceneBase.js"

function getValueByRate(start, end, rate) {
    return rate * (end - start) + start 
}

/**
 * 2.0 版场景定义
 */
export default class LineChart extends SceneBase {
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
                "__dataUrl__": "/data/04-china-transaction-data.json",  
                "__colors__": [
                    "#2364B9", 
                    "#014AA9", 
                    "#297EEC", 
                    // "#488FEC", 
                    // "#639FEC", 
                    // "#6382AA", 
                    // "#80C8FA", 
                    // "#CCE0FA", 
                    // "#6BA5F0", 
                ]
            }, conf)
    
            this.__onload__ = conf.__onload__
            this.__dataUrl__ = conf.__dataUrl__
            this.colors = conf.__colors__
    
    
            d3.json(this.__dataUrl__).then((data) => {
                data = this.__onload__(data)

                for (var cityData of data.data) {
                    // console.log(cityData)
                    var cityname = cityData.name

                    var minDate = cityData.data[0].date
                    var maxDate = cityData.data[cityData.data.length - 1].date
                    // console.log(cityname,minDate,maxDate)

                    var minValue = Infinity
                    var maxValue = -Infinity
                    for (var d of cityData.data) {
                        maxValue = Math.max(maxValue, d.value)
                        minValue = Math.min(minValue, d.value)
                    }
                    console.log(cityname, minValue, maxValue)

                    var padding = {top: 50, right: 50, bottom: 50, left: 50, x_interval: 50, y_interval: 40}

                    this.addSubObject({
                        __start__: 0, 
                        __end__: 1, 
    
                        onActivate: function (rate, absolute, globalVars) {
                            var x_w = (globalVars.svgWidth - padding.left - padding.right - 2 * padding.x_interval) / 3
                            var x_index = 1
                            if( this.cityData.index < 6) {
                                x_index = this.cityData.index % 3
                            }

                            var y_w = (conf.svgHeight - padding.top - padding.bottom - 2 * padding.y_interval) / 3
                            var y_index = parseInt(this.cityData.index / 3)


                            var minD = (new Date((this.minDate).toString()+" 00:00:00")).getTime();
                            var maxD = (new Date((this.maxDate).toString()+" 00:00:00")).getTime();

                            var xScale = d3.scaleLinear()
                                        .domain([ minD, maxD ])
                                        .range([ 0, this.cityData.data.length / 8 ])

                            var yScale = d3.scaleLinear()
                                        .domain([ this.minValue, this.maxValue ])
                                        .range([ y_w / 2, 0 ])

                            //对称轴线
                            // var symmetric_y = padding.top + y_w/2 + (y_w + padding.y_interval) * y_index
                            // d3.select("#area-chart-g")
                            //     .append("line")
                            //     .attr("x1",0)
                            //     .attr("y1",symmetric_y)
                            //     .attr("x2",globalVars.svgWidth)
                            //     .attr("y2",symmetric_y)
                            //     .attr("stroke","red")

                            //添加线段生成器
                            const areaPath = d3.area()
                                            .x( function(d){ return xScale((new Date((d.date).toString()+" 00:00:00")).getTime());} )
                                            .y0( function(d){ return 2 * y_w/2 - yScale(d.value);} )
                                            .y1( function(d){ return yScale(d.value);} )

                            d3.select("#area-chart-g")
                                .append("g")
                                .attr("class", "area")
                                .append("path")
                                .attr("id", "area-" + this.cityname)
                                .attr("transform", "translate("+ (x_index * (x_w + padding.x_interval) + padding.left) +","+ (y_index * (y_w + padding.y_interval) + padding.top) +")")
                                .attr("id", "areapath")
                                .attr("stroke-width", 1)
                                .attr("stroke", "black")
                                .attr("fill","green")
                                .attr("d", areaPath(this.cityData.data))

                            //动画遮罩
                            d3.select("#area-chart-g")
                                .append("g")
                                .attr("class", "mask-rect-g")
                                .append("rect")
                                .attr("id","rect-" + this.cityname )
                                .attr("width", this.cityData.data.length / 8 * 1.05)
                                .attr("height", y_w * 1.1)
                                .attr("x", x_index * (x_w + padding.x_interval) + padding.left )
                                .attr("y", y_index * (y_w + padding.y_interval) + padding.top - y_w*0.05)
                                .attr("fill","white")
                                .attr("opacity", 1)
                                .style("z-index",2)

                            //文字
                            d3.select("#area-chart-g")
                                .append("g")
                                .attr("class", "text-g")
                                .append("text")
                                .attr("id","text-"+ this.cityname)
                                .attr("dx", "25px")
                                .attr("transform", "translate("+ (x_index * (x_w + padding.x_interval) + padding.left) +","+ (y_index * (y_w + padding.y_interval) + padding.top) +")")
                                .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                                .attr("font-size", 16)
                                .text(this.cityname)
                                .style("z-index",3)

                        },
    
                        onUpdate: function (rate, absolute, globalVars) {
                            // console.log(this.cityData.index)
                            var x_index = 1
                            if( this.cityData.index < 6) {
                                x_index = this.cityData.index % 3
                            }
                            var x_w = (globalVars.svgWidth - padding.left - padding.right - 2 * padding.x_interval) / 3
                            var self = this
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + self.cityname )
                                    .attr("x", getValueByRate((x_index * (x_w + padding.x_interval) + padding.left), (x_index * (x_w + padding.x_interval) + padding.left + (self.cityData.data.length / 8 * 1.05)), rate) )
                                    .attr("width", getValueByRate(self.cityData.data.length / 8 * 1.05, 0, rate))
                            }else{
                                d3.select("#rect-" + self.cityname )
                                    .attr("x", getValueByRate((x_index * (x_w + padding.x_interval) + padding.left + (self.cityData.data.length / 8 * 1.05)), (x_index * (x_w + padding.x_interval) + padding.left), 1-rate) )
                                    .attr("width", getValueByRate(0, self.cityData.data.length / 8 * 1.05, 1-rate))
                            }
                            
                        },
    
                        onInactive: function (rate, absolute, globalVars) {
                            console.log(this.cityname)
                            d3.select("#rect-" + this.cityname).remove()
                            d3.select("#text-" + this.cityname).remove()
                            d3.select("#area-" + this.cityname).remove()
                        }, 
                        
                        cityData: cityData,
                        cityname: cityname,

                        minDate: minDate,
                        maxDate: maxDate,
                        minValue: minValue,
                        maxValue: maxValue,
    
                    })

                    
                }

            }

            )


         }
    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
     onActivate (rate, abso, gloalVars) {
        d3.select("#main-camvas")
          .append("g")
          .attr("class", "area-chart")
          .attr("id", "area-chart-g")
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
        d3.select("#main-camvas")
          .selectAll(".area-chart")
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