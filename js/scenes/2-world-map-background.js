import SceneBase from "../utils/SceneBase.js"
import { getRgb } from "../utils/helpers.js"

/**
 * 2.0 版场景定义
 */
export default class WorldMapBackground extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)

        conf = Object.assign({
            "__startYear__": 1960, 
            "__endYear__": 2016
        }, conf)

        d3.json("/data/2-countryEmit.json").then((data) => {

            d3.json("/data/world.geojson").then((Mdata) => {

                d3.json("/data/CE_citys.json").then((n2e) => {

                    this.addSubObject({
                        // __start__: 0, 
                        // __end__: (startYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                        onActivate: function (rate, abso, gloalVars) {        
                            const projection = d3.geoMercator() //墨卡托投影
                                .center([0, 0])  //链式写法，.center([longitude, latitude])设置地图中心
                                .scale([gloalVars.svgWidth / 9])   //.scale([value])设置地图缩放
                                .translate([gloalVars.svgWidth * 0.5, gloalVars.svgHeight * 0.5]) //.translate([x,y])设置偏移
            
                                const pathGenerator = d3.geoPath()
                                    .projection(projection); //配置上投影
            
                                d3.select("#world-back-g")
                                .selectAll("#ee-country-cir-" + this.index)
                                .data(Mdata.features)
                                .join("path")
                                .attr("class", "world-map-path")
                                .attr("id", "ee-country-cir-" + this.index)
                                .attr("d", pathGenerator)
                                .attr("stroke-width", 0.5)
                                .attr("stroke", "#000000")
                                .attr("fill", "#ffffff");
                        }, 
            
                        onInactive: function (rate, abso, gloalVars) {
                            d3.select("#ee-country-cir-" + this.index)
                            .remove()
                        }
                    })

                    // 中文名称对应的地图
                    this.chinese2English = {}

                    for (let _ of n2e.data) {
                        let k = Object.keys(_)[0]
                        let v = Object.values(_)[0]
                        this.chinese2English[k] = v
                    }

                    this.english2Index = {}

                    // 英文地图名称对应的下标
                    for (let i = 0; i < Mdata.features.length; ++i) {
                        let _ = Mdata.features[i]
                        this.english2Index[_.properties.name] = i
                    }

                    let nowIndex = 0
        
                    let maxEmit = -1
                    let minEmit = Infinity
        
                    for (let country of data.countryData) {
                        for (let yearLine of country.carbon) {
                            maxEmit = Math.max(maxEmit, yearLine.value)
                            minEmit = Math.min(minEmit, yearLine.value)
                        }
                    }
        
                    // maxEmit = Math.log10(maxEmit)
                    // minEmit = Math.log10(minEmit)
        
                    for (let country of data.countryData) {
                        let maxEmit = -1
                        let minEmit = Infinity
                        
                        let index = nowIndex++
        
                        let countryName = country.countryName
                        let position = country.position
                        let carbonData = country.carbon
        
                        let firstYear = conf.__endYear__
                        let lastYear = conf.__startYear__
        
                        for (let yearLine of carbonData) {
                            let yearName = yearLine.year
                            let value = yearLine.value
        
                            firstYear = Math.min(firstYear, yearName)
                            lastYear = Math.max(lastYear, yearName)
        
                            maxEmit = Math.max(maxEmit, value)
                            minEmit = Math.min(minEmit, value)
                        }
        
                        let startYear = Math.max(firstYear, conf.__startYear__)
                        let endYear = Math.min(lastYear, conf.__endYear__)

                        let idx = ''
                        if (this.chinese2English[countryName] && (idx = this.english2Index[this.chinese2English[countryName]])) {
                            
                            this.addSubObject({
                                __start__: (startYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                                __end__: (endYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                                onActivate: function (rate, abso, gloalVars) {
            
                                    const projection = d3.geoMercator() //墨卡托投影
                                        .center([0, 0])  //链式写法，.center([longitude, latitude])设置地图中心
                                        .scale([gloalVars.svgWidth / 9])   //.scale([value])设置地图缩放
                                        .translate([gloalVars.svgWidth * 0.5, gloalVars.svgHeight * 0.5]) //.translate([x,y])设置偏移
            
                                    const pathGenerator = d3.geoPath()
                                        .projection(projection); //配置上投影

                                    let self = this

                                    d3.select("#world-back-g")
                                    .selectAll("#country-cir-" + this.index)
                                    .data([this.pathData])
                                    .join("path")
                                    .attr("class", "world-map-path")
                                    .attr("id", "country-cir-" + this.index)
                                    .attr("d", pathGenerator)
                                    .attr("stroke-width", 0.5)
                                    .attr("stroke", "#000000")
                                    .attr("fill", "#ffffff")
                                    .on("mouseover", function (e) {
                                        d3.select(this)
                                            .attr("fill", "#F48024")

                                        d3.select("#world-back-g")
                                          .append("rect")
                                          .attr("class", "info-rect" + self.index)
                                          .attr("x", e.clientX - 0.0275 * conf.pageWidth)
                                          .attr("y", e.clientY - 0.0275 * conf.pageHeight)
                                          .attr("width", 100)
                                          .attr("height", 60)
                                          .attr("opacity", 1)
                                          .style("z-index", "105")
                                          .attr("fill", "white")
                                          .attr("stroke", "black")
                                          .attr("rx", 5)
                                          .attr("ry", 5)
                                        
                                          d3.select("#world-back-g")
                                          .append("text")
                                          .attr("class", "info-text-title-" + self.index)
                                          .attr("x", e.clientX - 0.0275 * conf.pageWidth + 50)
                                          .attr("y", e.clientY - 0.0275 * conf.pageHeight + 20)
                                          .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                                          .text(self.countryName)

                                          d3.select("#world-back-g")
                                          .append("text")
                                          .attr("class", "info-text-value-" + self.index)
                                          .attr("x", e.clientX - 0.0275 * conf.pageWidth + 50)
                                          .attr("y", e.clientY - 0.0275 * conf.pageHeight + 50)
                                          .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                                          .text(self.nowValue + '吨')
                                        //   console.log(e)
                                        // console.log(self.countryName)
                                    })
                                    .on("mousemove", function (e) {
                                        d3.select(this)
                                            .attr("fill", "#F48024")

                                        d3.selectAll(".info-text-title-" + self.index)
                                          .attr("x", e.clientX - 0.0275 * conf.pageWidth + 50)
                                          .attr("y", e.clientY - 0.0275 * conf.pageHeight + 20)

                                        d3.selectAll(".info-text-value-" + self.index)
                                        .attr("x", e.clientX - 0.0275 * conf.pageWidth + 50)
                                        .attr("y", e.clientY - 0.0275 * conf.pageHeight + 50)

                                        d3.selectAll(".info-rect" + self.index)
                                          .attr("x", e.clientX - 0.0275 * conf.pageWidth)
                                          .attr("y", e.clientY - 0.0275 * conf.pageHeight)
                                    })
                                    .on("mouseout", function (e) {
                                        d3.selectAll(".info-rect" + self.index).remove()
                                        d3.selectAll(".info-text-title-" + self.index).remove()
                                        d3.selectAll(".info-text-value-" + self.index).remove()
                                        SceneBase.scroll.forceUpdate()
                                    })
                                }, 
            
                                onInactive: function (rate, abso, gloalVars) {
                                    d3.select("#country-cir-" + this.index)
                                    .remove()
                                }, 
            
                                onUpdate: function (rate, abso, gloalVars) {
                                    // 根据年份找到下标，然后计算出对应的颜色
            
                                    let nowIndex = Math.floor(rate * this.carbonData.length)
            
                                    let lastValue = (this.carbonData[nowIndex - 1] || {value: 1}).value
                                    let thisValue = this.carbonData[Math.min(nowIndex, this.carbonData.length - 1)].value
            
                                    // lastValue = Math.log10(lastValue)
                                    // thisValue = Math.log10(thisValue)
            
                                    let tmpEle = d3.select("#country-cir-" + this.index)
                                    .attr("fill", WorldMapBackground.getColor(
                                        SceneBase.linearMap(rate, nowIndex / this.carbonData.length, (nowIndex + 1) / this.carbonData.length, lastValue, thisValue), 
                                        this.minEmit, 
                                        this.maxEmit
                                    ))

                                    this.nowValue = WorldMapBackground.getLargeNumStr(thisValue)
                                    
                                    tmpEle.attr("opacity", 1)
                                },
                                
                                countryName: countryName, 
                                position: position, 
                                carbonData: carbonData, 
                                index: index, 
            
                                maxEmit: maxEmit, 
                                minEmit: minEmit, 
            
                                firstYear: firstYear, 
                                lastYear: lastYear, 
    
                                pathData: Mdata.features[idx]
                            })   
                        }
                    }

                    this.addSubObject({
                        onActivate: function (rate, abso, globalVars) {
                            // 添加时间显示
                            d3.select("#world-back-g") 
                            .append("text")
                            .attr("id", "world-time-year")
                            .attr("class", "world-time-showing")
                            .attr("x", globalVars.svgWidth * 0.65)
                            .attr("y", globalVars.svgHeight * 0.95)
                            .attr("style", "text-anchor:middle;dominant-baseline:middle;")
                            .attr("fill", "black")
                            //   .attr("stroke-out", "#E9FBF2")
                            .attr("font-size", 40)
                            .attr("opacity", 1)
                            .text("adasd")
                        }, 

                        onInactive: function (rate, abso, globalVars) {
                            // 添加时间显示
                            d3.select("#world-time-year") 
                            .remove()
                        }, 

                        onUpdate: function (rate, abso, globalVars) {
                            d3.select("#world-time-year")
                            .text(new Date(SceneBase.linearMap(rate, 0, 1, new Date('1960-01-01').getTime(), new Date('2016-12-31').getTime())).toJSON().substr(0, 10))
                        }
                    })

                    let mapExampleNum = 10
                    let mapExampleColorList = []
                    for (let i = 0; i < mapExampleNum; ++i) {
                        let v = SceneBase.linearMap(i, 0, mapExampleNum, minEmit, maxEmit)

                        mapExampleColorList.push({
                            value: WorldMapBackground.getLargeNumStr(v), 
                            color: WorldMapBackground.getColor(v, minEmit, maxEmit)
                        })
                    }

                    this.addSubObject({
                        onActivate: function (rate, abso, globalVars) {
                            // 添加图例
                            d3.select("#world-back-g")
                            .selectAll(".map-example-showing")
                            .data(mapExampleColorList)
                            .enter()
                            .append("rect")
                            .attr("class", "map-example-showing")
                            .attr("x", globalVars.svgWidth * 0.03)
                            .attr("y", function (d, i) {
                                return (mapExampleNum - i + 1 * mapExampleNum) * globalVars.svgHeight / 2 / mapExampleNum
                            })
                            .attr("width", 20)
                            .attr("height", globalVars.svgHeight / 2 / mapExampleNum)
                            .attr("fill", function (d, i) {
                                return d.color
                            })
                            .attr("opacity", 1)
                            .on("mouseover", function (e) {
                                d3.select(this)
                                    .attr("fill", "#F48024")
                            })
                            .on("mouseout", function (e, d) {
                                d3.select(this)
                                    .attr("fill", d.color)
                            })

                            // 添加图例文字
                            d3.select("#world-back-g")
                            .selectAll(".map-example-txt-showing")
                            .data(mapExampleColorList)
                            .enter()
                            .append("text")
                            .attr("class", "map-example-txt-showing")
                            .attr("x", globalVars.svgWidth * 0.03 + 25)
                            .attr("y", function (d, i) {
                                return (mapExampleNum - (i - 0.5) + 1 * mapExampleNum) * globalVars.svgHeight / 2 / mapExampleNum
                            })
                            .attr("fill", "black")
                            .attr("opacity", 1)
                            .text(function (d, i) {
                                return d.value + '吨'
                            })
                        }, 

                        onInactive: function (rate, abso, globalVars) {
                            // 移除图例
                            d3.select(".map-example-showing") 
                            .remove()
                        }, 
                    })

                    SceneBase.scroll.forceUpdate()
                })
            })

        
        })

        
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
    onActivate (rate, abso, gloalVars) {
        d3.select("#world-back-svg")
          .append("g")
          .attr("class", "world-back")
          .attr("id", "world-back-g")
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
        d3.select("#world-back-g")
          .remove()
    }

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    onUpdateInactive (rate, abso, gloalVars) {
        
    }

    /**
     * 如果要添加子元素，请在构造函数中使用 addSubObject 添加
     */

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}

WorldMapBackground.getPosition = function (lon, lat, svgWidth, svgHeight) {
    return {
        x: svgWidth * (lon + 180) / 360, 
        y: svgHeight * (-lat + 90) / 180
    }
}

WorldMapBackground.linearMap = function (now, startNum, endNum, startOutput, endOutput) {
    let tmpValue = (now - startNum) / (endNum - startNum) * (endOutput - startOutput) + startOutput
    tmpValue = Math.max(tmpValue, Math.min(startOutput, endOutput))
    tmpValue = Math.min(tmpValue, Math.max(startOutput, endOutput))
    return tmpValue
}

WorldMapBackground.getColor = function (now, minn, maxx) {
    return getRgb(
        SceneBase.linearMap(now, minn, maxx, 186, 0x66), 
        SceneBase.linearMap(now, minn, maxx, 239, 0x66), 
        SceneBase.linearMap(now, minn, maxx, 210, 0x66)

        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0xff, 0xff), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0)
    )
}

WorldMapBackground.getLargeNumStr = function (n) {
    
    if (n > 100000000) {
        n = n / 100000000
        return n.toFixed(2) + '亿'
    }
    if (n > 10000) {
        n = n / 10000
        return n.toFixed(1) + '万'
    }
    if (n > 100) {
        return Math.round(n)
    }
    return n.toFixed(2)
}