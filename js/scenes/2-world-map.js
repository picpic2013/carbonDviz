import SceneBase from "../utils/SceneBase.js"
import { getRgb } from "../utils/helpers.js"

/**
 * 2.0 版场景定义
 */
export default class WorldMapLeft extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)

        conf = Object.assign({
            "__startYear__": 1960, 
            "__endYear__": 2016, 
            "__onload__": function (data) {
                // console.log(data)
                return data
            }, 
            "__dataUrl__": "/data/2-countryEmit.json"
        }, conf)
        
        d3.json(conf.__dataUrl__).then((data) => {
            data = conf.__onload__(data)

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

                this.addSubObject({
                    __start__: (startYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                    __end__: (endYear - conf.__startYear__) / (conf.__endYear__ - conf.__startYear__), 
                    onActivate: function (rate, abso, gloalVars) {
                        let pos = WorldMapLeft.getPosition(this.position[0], this.position[1], conf.svgWidth, conf.svgHeight)
                        
                        let self = this

                        d3.select("#world-map-g")
                          .append("circle")
                          .attr("id", "country-cir-" + this.index)
                          .attr("cx", pos.x)
                          .attr("cy", pos.y)
                          .attr("r", 20)

                          .on("mouseover", function () {
                              console.log(self.countryName, self.position)
                            // console.log(self.__end__)
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
                          .attr("fill", WorldMapLeft.getColor(
                            WorldMapLeft.linearMap(rate, nowIndex / this.carbonData.length, (nowIndex + 1) / this.carbonData.length, lastValue, thisValue), 
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
                    lastYear: lastYear
                })

                // if (index > 0)
                //     break
            }

            // console.log(maxEmit, minEmit)

        })
    }

    /**
     * 场景被激活时执行的函数，一般用户创建对象 
     * @param {rate}      当前场景运行的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
    */
    onActivate (rate, abso, gloalVars) {
        d3.select("#world-map-svg")
          .append("g")
          .attr("class", "world-map")
          .attr("id", "world-map-g")
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
        d3.selectAll(".world-map").remove()
    }

    /**
     * 未激活时的滚动更新参数
     * @param {rate}      当前场景的百分比
     * @param {abso}      全局绝对量
     * @param {gloalVars} 全局变量存放处
     */
    onUpdateInactive (rate, abso, gloalVars) {

    }

}

WorldMapLeft.getPosition = function (lon, lat, svgWidth, svgHeight) {
    return {
        x: svgWidth * (lon + 180) / 360, 
        y: svgHeight * (-lat + 90) / 180
    }
}

WorldMapLeft.linearMap = function (now, startNum, endNum, startOutput, endOutput) {
    let tmpValue = (now - startNum) / (endNum - startNum) * (endOutput - startOutput) + startOutput
    tmpValue = Math.max(tmpValue, Math.min(startOutput, endOutput))
    tmpValue = Math.min(tmpValue, Math.max(startOutput, endOutput))
    return tmpValue
}

WorldMapLeft.getColor = function (now, minn, maxx) {
    return getRgb(
        WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x66), 
        WorldMapLeft.linearMap(now, minn, maxx, 0xcc, 0x66), 
        WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x66)

        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0xff, 0xff), 
        // WorldMapLeft.linearMap(now, minn, maxx, 0x00, 0x0)
    )
}