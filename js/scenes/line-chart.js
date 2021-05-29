import SceneBase from "../utils/SceneBase.js"



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
            "__dataUrl__": "/data/2-year-emit-sum.json",  
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

            var minYear = data.data[0].year
            var maxYear = data.data[data.data.length - 1].year
            // console.log(minYear+'  '+maxYear)

            var maxValue = -Infinity
            var minValue = Infinity

            for (var d of data.data) {
                var eachyearValue = d.value 
                maxValue = Math.max(maxValue, eachyearValue)
                minValue = Math.min(minValue, eachyearValue)
            }
            // console.log(minValue+'  '+maxValue)


            var padding = {top: 50, right: 50, bottom: 80, left: 100}

            this.addSubObject({
                __start__: 0, 
                __end__: 1, 

                __onActivate__: function (rate, absolute, globalVars) {
                    
                    //添加坐标轴
                    var xScale = d3.scaleLinear()
                                    .domain([ minYear, maxYear ])
                                    .range([ 0, globalVars.svgWidth - padding.left - padding.right ])
                    var xAxis = d3.axisBottom(xScale)
                                    .tickFormat(d3.format("d"))
                    d3.select("#line-chart-g")
                        .append("g")
                        .attr("class", "axis")
                        .attr("id", "X_axis")
                        .attr("transform","translate("+ padding.left +","+ ( conf.svgHeight - padding.bottom ) +")")
                        .attr("opacity",1)
                        .call(xAxis)   

                    var yScale = d3.scaleLinear()
                        .domain([ minValue * 0.9 , maxValue * 1.1 ])
                        .range([ conf.svgHeight - padding.top - padding.bottom, 0 ])
                    var yAxis = d3.axisLeft(yScale)
                    d3.select("#line-chart-g")
                        .append("g")
                        .attr("class", "axis")
                        .attr("id", "Y_axis")
                        .attr("transform","translate("+ padding.left +","+ padding.top +")")
                        .attr("opacity",1)
                        .call(yAxis)   

                    //添加线段生成器
                    const linePath = d3.line()
                                        .x( function(d){ return xScale(d.year);} )
                                        .y( function(d){ return yScale(d.value);} )

                  //添加路径
                    d3.select("#line-chart-g")
                        .append("path")
                        .attr("transform","translate("+ padding.left +","+ padding.top +")")
                        .attr("id", "mypath")
                        .attr("fill", "none")
                        .attr("stroke-width", 3)
                        .attr("stroke", d3.rgb(0,255,0))
                        .attr("d",  linePath(data.data))

                        

                     //关键事件节点
                    var critical_time = [
                        {"year": 1970,"value": 14868220.2892145,"s": "绿色和平组织成立"},
                        {"year": 1973,"value": 17116849.9537957,"s": "第四次中东战争、第一次石油危机、联合国环境规划署成立"},
                        {"year": 1979,"value": 19918489.0820914,"s": "美苏冷战恶化、第二次石油危机"},
                        {"year": 1990,"value": 22421693.5772915,"s": "第三次石油危机"}]

                    d3.select("#line-chart-g")
                        .append("g")
                        .attr("class","critical")
                        .selectAll("circle")
                        .data(critical_time)
                        .enter()
                        .append("circle")
                        .attr("id", function(d){
                            return "critical-"+d.year
                        })
                        .style("stroke", "gray")
                        .style("fill", "black")
                        .attr("transform", function(d){
                            return "translate("+ (xScale(d.year) + padding.left) + "," + (yScale(d.value) + padding.top) +")"
                        })
                        .attr("r", 10)

                    //实现鼠标交互
                    d3.select("#line-chart-g")
                        .append("g")
                        .attr("class","mouse_interaction")
                    var focusCircle = d3.select(".mouse_interaction")
                                        .append("g")
                                        .attr("class", "focusCircle")
                                        .style("display", "none")
                    focusCircle.append("circle")
                               .attr("id","focusdot")
                               .attr("r", 4.5)
                               .style("stroke", "gray")
                               .style("fill", "black")
                               .style("z-index", 2)
                    focusCircle.append("text")
                                .attr("id","focustext")
                                .attr("dx", 10)
                                .attr("dy", "-1em")
                                .style("fill", "black")
                                .style("font-size","12px")
                                .style("z-index", 2)
                    var focusLine = d3.select(".mouse_interaction")
                                        .append("g")
                                        .attr("class", "focusLine")
                                        .style("display", "none")
                    var vLine = focusLine.append("line")
                                        .attr("id","vLine")
                                        .style("stroke", "gray")
                                        .style("stroke-width", 2)
                                        .style("stroke-dasharray", "10,10")
                    var hLine = focusLine.append("line")
                                        .attr("id","hLine")
                                        .style("stroke", "gray")
                                        .style("stroke-width", 2)
                                        .style("stroke-dasharray", "10,10")
                    d3.select("#line-chart-g")
                        .attr("class","overlay")
                        .attr("x", padding.left)
                        .attr("y", padding.top)
                        .attr("width", globalVars.svgWidth - padding.left - padding.right)
                        .attr("height", conf.svgHeight - padding.top - padding.bottom)
                        .attr("fill", "none")
                        .attr("pointer-events","all")

                    
                    
                }, 

                __onUpdate__: function (rate, absolute, globalVars) {

                    var xScale = d3.scaleLinear()
                                    .domain([ minYear, maxYear ])
                                    .range([ 0, globalVars.svgWidth - padding.left - padding.right ])
                    var yScale = d3.scaleLinear()
                                    .domain([ minValue * 0.9 , maxValue * 1.1 ])
                                    .range([ conf.svgHeight - padding.top - padding.bottom, 0 ])


                    // 关键事件
                    var critical_time = [
                        {"year": 1970,"value": 14868220.2892145,"s": "绿色和平组织成立"},
                        {"year": 1973,"value": 17116849.9537957,"s": "第四次中东战争、第一次石油危机、联合国环境规划署成立"},
                        {"year": 1979,"value": 19918489.0820914,"s": "美苏冷战恶化、第二次石油危机"},
                        {"year": 1990,"value": 22421693.5772915,"s": "第三次石油危机"}]

                    
                    d3.select("#critical-"+critical_time[0].year)
                        .on("mouseover", function(){
                            var d = critical_time[0]
                            var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")
                            var title = tooltip.append("div")
                                                .attr("class","title")
                            var desText = tooltip.append("div")
                                                .attr("class","desText")
                        
                            title.html("<strong>"+d.year+"年</strong>")
                            desText.html("<strong>"+d.s+"</strong>")
                            tooltip.style("left", xScale(d.year) + padding.left)
                                    .style("top", yScale(d.value) + padding.top)
                                    .style("opacity", 1)
                        })
                        .on("mouseout", function(){
                            d3.select(".tooltip")
                            .remove()
                        })

                    d3.select("#critical-"+critical_time[1].year)
                        .on("mouseover", function(){
                            var d = critical_time[1]
                            var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")
                            var title = tooltip.append("div")
                                                .attr("class","title")
                            var desText = tooltip.append("div")
                                                .attr("class","desText")
                        
                            title.html("<strong>"+d.year+"年</strong>")
                            desText.html("<strong>"+d.s+"</strong>")
                            tooltip.style("left", xScale(d.year) + padding.left)
                                    .style("top", yScale(d.value) + padding.top)
                                    .style("opacity", 1)
                        })
                        .on("mouseout", function(){
                            d3.select(".tooltip")
                            .remove()
                        })
                 
                    d3.select("#critical-"+critical_time[2].year)
                        .on("mouseover", function(){
                            var d = critical_time[2]
                            var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")
                            var title = tooltip.append("div")
                                                .attr("class","title")
                            var desText = tooltip.append("div")
                                                .attr("class","desText")
                        
                            title.html("<strong>"+d.year+"年</strong>")
                            desText.html("<strong>"+d.s+"</strong>")
                            tooltip.style("left", xScale(d.year) + padding.left)
                                    .style("top", yScale(d.value) + padding.top)
                                    .style("opacity", 1)
                        })
                        .on("mouseout", function(){
                            d3.select(".tooltip")
                            .remove()
                        })
                    
                    d3.select("#critical-"+critical_time[3].year)
                        .on("mouseover", function(){
                            var d = critical_time[3]
                            var tooltip = d3.select("body")
                                            .append("div")
                                            .attr("class", "tooltip")
                            var title = tooltip.append("div")
                                                .attr("class","title")
                            var desText = tooltip.append("div")
                                                .attr("class","desText")
                        
                            title.html("<strong>"+d.year+"年</strong>")
                            desText.html("<strong>"+d.s+"</strong>")
                            tooltip.style("left", xScale(d.year) + padding.left)
                                    .style("top", yScale(d.value) + padding.top)
                                    .style("opacity", 1)
                        })
                        .on("mouseout", function(){
                            d3.select(".tooltip")
                            .remove()
                        })



                    //实现鼠标交互

                    var self = this

                    d3.select(".overlay")
                        .on("mouseover", function(){
                            d3.select(".focusCircle")
                                .style("display", null)
                            d3.selectAll(".focusLine")
                                .style("display", null)
                        })
                        .on("mouseout", function(){
                            d3.select(".focusCircle")
                                .style("display", "none")
                            d3.selectAll(".focusLine")
                                .style("display", "none")
                        })
                        .on("mousemove", function(event,d){
                            var data = self.data.data
                            var mouseX = d3.pointer(event)[0] - padding.left
                            var mouseY = d3.pointer(event)[1] - padding.top

                            //通过比例尺的反函数计算
                            var x0 = xScale.invert(mouseX)
                            var y0 = yScale.invert(mouseY)
                            //查找在原数据中对应的year,返回索引号
                            var bisect = d3.bisector(function(d){ return d.year}).left
                            var index = bisect(data, x0)
                            
                            var x1 = data[index].year
                            var y1 = data[index].value
                            var focusX = xScale(x1) + padding.left
                            var focusY = yScale(y1) + padding.top
                            // console.log(focusX,focusY)
                            d3.select("#focusdot")
                                .attr("transform", "translate("+ focusX + "," + focusY +")")
                                .style("display","block")
                            if( x1 > 1990 ){
                                d3.select("#focustext")
                                .attr("x", focusX - 265)
                                .attr("y", focusY)
                                .text(x1 + "年的碳排放量：" + y1 + "千吨")
                                .style("display","block")
                            }else{
                                d3.select("#focustext")
                                .attr("x", focusX)
                                .attr("y", focusY)
                                .text(x1 + "年的碳排放量：" + y1 + "千吨")
                                .style("display","block")
                            }
                            
                            d3.select("#vLine")
                                .attr("x1", focusX)
                                .attr("y1", focusY)
                                .attr("x2", focusX)
                                .attr("y2", conf.svgHeight - padding.bottom)
                                .style("display","block")
                            d3.select("#hLine")
                                .attr("x1", focusX)
                                .attr("y1", focusY)
                                .attr("x2", padding.left)
                                .attr("y2", focusY)
                                .style("display","block")
                        })

                },

                __onInactive__: function (rate, absolute, globalVars) {
                    d3.select(".axis").remove()
                    d3.select("#mypath").remove()
                    d3.select(".overlay").remove()
                    d3.select(".critical").remove()
                    d3.select(".mouse_interaction").remove()

                }, 

                __subObjects__: [
                    // enterAnimation, 
                    // quitAnimation
                ], 

                data:data,
                maxYear: maxYear, 
                minYear: minYear, 

            })


        })

    
        
    }





    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
     __onActivate__(rate, abso, gloalVars) {
        d3.select("#main-camvas")
          .append("g")
          .attr("class", "line-chart")
          .attr("id", "line-chart-g")
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
        d3.select("#main-camvas")
          .selectAll(".line-chart")
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

    /**
     * 子场景配置文件 可以是 [{conf}] 或 {id: {conf}} 
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__ = {}

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}