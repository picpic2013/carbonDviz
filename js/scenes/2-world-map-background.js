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
                // data = conf.__onload__(data)
    
                // console.log(data)
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
    
                        // if (value < 0) {
                        //     console.log(countryName, yearName)
                        // }
                    }
    
                    let startYear = Math.max(firstYear, conf.__startYear__)
                    let endYear = Math.min(lastYear, conf.__endYear__)

                    if (index >= Mdata.features.length) {
                        break
                    }

                    this.addSubObject({
                        // __start__: 0, 
                        // __end__: (startYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                        onActivate: function (rate, abso, gloalVars) {
                            let pos = WorldMapBackground.getPosition(this.position[0], this.position[1], conf.svgWidth, conf.svgHeight)
                            
                            let self = this
    
                              const projection = d3.geoMercator() //墨卡托投影
                                .center([0, 0])  //链式写法，.center([longitude, latitude])设置地图中心
                                .scale([gloalVars.svgWidth / 9])   //.scale([value])设置地图缩放
                                .translate([gloalVars.svgWidth * 0.5, gloalVars.svgHeight * 0.5]) //.translate([x,y])设置偏移
    
                                const pathGenerator = d3.geoPath()
                                    .projection(projection); //配置上投影
    
                                d3.select("#world-back-g")
                                .selectAll("#ee-country-cir-" + this.index)
                                .data([this.Mdata.features[this.index]])
                                .join("path")
                                // .enter()
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
                        }, 

                    //     onUpdate: function (rate, abso, gloalVars) {
                    //         let thisValue = this.carbonData[Math.min(nowIndex, this.carbonData.length - 1)].value

                    //         let tmpEle = d3.select("#ee-country-cir-" + this.index)
                    //           .attr("fill", WorldMapBackground.getColor(
                    //             SceneBase.linearMap(rate, nowIndex / this.carbonData.length, (nowIndex + 1) / this.carbonData.length, lastValue, thisValue), 
                    //             this.minEmit, 
                    //             this.maxEmit
                    //           ))
    
                    //         // tmpEle.attr("opacity", WorldMapLeft.linearMap(rate, 0, 1 / this.carbonData.length, 0, 1))
                    //         tmpEle.attr("opacity", 1)
    
                    //         // if (nowIndex == this.carbonData.length - 1) {
                    //         //     tmpEle.attr("opacity", WorldMapLeft.linearMap(rate, nowIndex / this.carbonData.length, 1, 1, 0))
                    //         // }
                    //     },

                        countryName: countryName, 
                        position: position, 
                        carbonData: carbonData, 
                        index: index, 
    
                        maxEmit: maxEmit, 
                        minEmit: minEmit, 
    
                        firstYear: firstYear, 
                        lastYear: lastYear, 

                        Mdata: Mdata
                    })

                    this.addSubObject({
                        __start__: (startYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                        __end__: (endYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                        onActivate: function (rate, abso, gloalVars) {
                            let pos = WorldMapBackground.getPosition(this.position[0], this.position[1], conf.svgWidth, conf.svgHeight)
                            
                            let self = this
    
                            // d3.select("#world-map-g")
                            //   .append("circle")
                            //   .attr("id", "country-cir-" + this.index)
                            //   .attr("cx", pos.x)
                            //   .attr("cy", pos.y)
                            //   .attr("r", 20)
    
                            //   .on("mouseover", function () {
                            //       console.log(self.countryName, self.position)
                            //     // console.log(self.__end__)
                            //   })
    
                              const projection = d3.geoMercator() //墨卡托投影
                                .center([0, 0])  //链式写法，.center([longitude, latitude])设置地图中心
                                .scale([gloalVars.svgWidth / 9])   //.scale([value])设置地图缩放
                                .translate([gloalVars.svgWidth * 0.5, gloalVars.svgHeight * 0.5]) //.translate([x,y])设置偏移
    
                                const pathGenerator = d3.geoPath()
                                    .projection(projection); //配置上投影
    
                                d3.select("#world-back-g")
                                .selectAll("#country-cir-" + this.index)
                                .data([this.Mdata.features[this.index]])
                                .join("path")
                                // .enter()
                                .attr("class", "world-map-path")
                                .attr("id", "country-cir-" + this.index)
                                .attr("d", pathGenerator)
                                .attr("stroke-width", 0.5)
                                .attr("stroke", "#000000")
                                .attr("fill", "#ffffff");
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
    
                            // tmpEle.attr("opacity", WorldMapLeft.linearMap(rate, 0, 1 / this.carbonData.length, 0, 1))
                            tmpEle.attr("opacity", 1)
    
                            // if (nowIndex == this.carbonData.length - 1) {
                            //     tmpEle.attr("opacity", WorldMapLeft.linearMap(rate, nowIndex / this.carbonData.length, 1, 1, 0))
                            // }
                        },
                        
                        countryName: countryName, 
                        position: position, 
                        carbonData: carbonData, 
                        index: index, 
    
                        maxEmit: maxEmit, 
                        minEmit: minEmit, 
    
                        firstYear: firstYear, 
                        lastYear: lastYear, 

                        Mdata: Mdata
                    })
                }
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
        SceneBase.linearMap(now, minn, maxx, 0x00, 0x66), 
        SceneBase.linearMap(now, minn, maxx, 0xcc, 0x66), 
        SceneBase.linearMap(now, minn, maxx, 0x00, 0x66)

        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0xff, 0xff), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0)
    )
}