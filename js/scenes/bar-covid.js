import SceneBase from "../utils/SceneBase.js"

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
            "__dataUrl__": "/data/COVID.json", 
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

        // d3.json("/data/3-policy-word-freq.json").then((data) => {
        d3.json(this.__dataUrl__).then((data) => {

            data = this.__onload__(data)

            var washedData = {}
            var minYear = Infinity
            var maxYear = -Infinity

            var lastEleName = undefined

            for (var yearIndex = 0; yearIndex < data.data.length; ++yearIndex) {
                var yearData = data.data[yearIndex]

                var yearName = yearData.time
                minYear = Math.min(minYear, yearName)
                maxYear = Math.max(maxYear, yearName)

                var tmpYearWordData = {}
                
                // 排序词
                yearData.details.sort(function (a, b) {
                    if (a.value > b.value) {
                        return -1
                    } else if (a.value < b.value) {
                        return 1
                    } else {
                        return 0
                    }
                })

                for (var rank = 0; rank < yearData.details.length; ++rank) {
                    var wordData = yearData.details[rank]

                    var wordName = wordData.name
                    var wordCount = wordData.value

                    tmpYearWordData[wordName] = {
                        "cnt": wordCount, 
                        "rank": rank
                    }
                }

                washedData[yearName] = tmpYearWordData
                washedData[yearName]["__min__"] = yearData.details[yearData.details.length - 1]
                washedData[yearName]["__max__"] = yearData.details[0]
                washedData[yearName]["__wordLen__"] = yearData.details.length
                washedData[yearName]["__index__"] = yearIndex

                washedData[yearName]["__lastElementName__"] = lastEleName
                if (lastEleName) {
                    washedData[lastEleName]["__nextElementName__"] = yearName
                }
                lastEleName = yearName
            }
            if (lastEleName) {
                washedData[lastEleName]["__nextElementName__"] = undefined
            }

            var totalYears = Object.keys(washedData).length
            var eleCnt = 0

            // 遍历年
            for (var yearData of data.data) {
                var yearName = yearData.time

                var maxCnt = -Infinity
                var minCnt = Infinity

                for (var wordData of yearData.details) {
                    var wordCount = wordData.value 
                    maxCnt = Math.max(maxCnt, wordCount)
                    minCnt = Math.min(minCnt, wordCount)
                }

                var thisYearMax = maxCnt
                var thisYearMin = minCnt

                var lastYearMax = 1
                var lastYearMin = 0
                if (washedData[washedData[yearName].__lastElementName__]) {
                    lastYearMax = washedData[washedData[yearName].__lastElementName__].__max__.value
                    lastYearMin = washedData[washedData[yearName].__lastElementName__].__min__.value

                    lastYearMax = (lastYearMax + thisYearMax) * 0.5
                    lastYearMin = (lastYearMin + thisYearMax) * 0.5
                } 

                var nextYearMax = 1
                var nextYearMin = 0
                if (washedData[washedData[yearName].__nextElementName__]) {
                    nextYearMax = washedData[washedData[yearName].__nextElementName__].__max__.value
                    nextYearMin = washedData[washedData[yearName].__nextElementName__].__min__.value

                    nextYearMax = (nextYearMax + thisYearMax) * 0.5
                    nextYearMin = (nextYearMin + thisYearMax) * 0.5
                } 


                // 遍历每个词
                for (var rank = 0; rank < yearData.details.length; ++rank) {
                    var wordData = yearData.details[rank]
                    
                    var wordName = wordData.name
                    var wordCount = wordData.value 

                    // 今年的位置
                    var thisYearPosition = ScrollBarChart.getPositionByRank(rank, yearData.details.length, conf.svgHeight)
                    var thisYearOpacity = 1
                    var thisYearLength = wordData.value
                    var thisYearHeight = ScrollBarChart.getHeightByDataLength(yearData.details.length, conf.svgHeight)
                    
                    // 去年的位置
                    var lastYearPosition = ScrollBarChart.getPositionByRank(rank + 1, yearData.details.length, conf.svgHeight)
                    var lastYearOpacity = 0
                    var lastYearLength = 0 
                    var lastYearHeight = thisYearHeight
                    if (washedData[washedData[yearName].__lastElementName__] && washedData[washedData[yearName].__lastElementName__][wordName]) {
                        lastYearPosition = ScrollBarChart.getPositionByRank(washedData[washedData[yearName].__lastElementName__][wordName].rank, washedData[washedData[yearName].__lastElementName__]["__wordLen__"], conf.svgHeight)
                        lastYearPosition = (lastYearPosition + thisYearPosition) * 0.5
                        lastYearOpacity = 1
                        lastYearLength = washedData[washedData[yearName].__lastElementName__][wordName].cnt
                        lastYearLength = (lastYearLength + thisYearLength) * 0.5
                        lastYearHeight = ScrollBarChart.getHeightByDataLength(washedData[washedData[yearName].__lastElementName__]["__wordLen__"], conf.svgHeight)
                        lastYearHeight = (lastYearHeight + thisYearHeight) * 0.5
                    } 

                    // 明年的位置
                    var nextYearPosition = ScrollBarChart.getPositionByRank(rank + 1, yearData.details.length, conf.svgHeight)
                    var nextYearOpacity = 0
                    var nextYearLength = 0
                    var nextYearHeight = thisYearHeight
                    if (washedData[washedData[yearName].__nextElementName__] && washedData[washedData[yearName].__nextElementName__][wordName]) {
                        nextYearPosition = ScrollBarChart.getPositionByRank(washedData[washedData[yearName].__nextElementName__][wordName].rank, washedData[washedData[yearName].__nextElementName__]["__wordLen__"], conf.svgHeight)
                        nextYearPosition = (nextYearPosition + thisYearPosition) * 0.5
                        nextYearOpacity = 1
                        nextYearLength = washedData[washedData[yearName].__nextElementName__][wordName].cnt
                        nextYearLength = (nextYearLength + thisYearLength) * 0.5
                        nextYearHeight = ScrollBarChart.getHeightByDataLength(washedData[washedData[yearName].__nextElementName__]["__wordLen__"], conf.svgHeight)
                        nextYearHeight = (nextYearHeight + thisYearHeight) * 0.5
                    } 

                    // 进入动画
                    var enterAnimation = {
                        __start__: 0, 
                        __end__: 0.5, 

                        onUpdate: function (rate, absolute, globalVars) {
                            d3.select("#rect-" + this.yearName + "-" + this.rank)
                              .attr("y", ScrollBarChart.getValueByRate(this.lastYearPosition, this.thisYearPosition, rate))
                              .attr("opacity", ScrollBarChart.getValueByRate(this.lastYearOpacity, this.thisYearOpacity, rate))
                              .attr("width", ScrollBarChart.getWidthByCnt(
                                  ScrollBarChart.getValueByRate(this.lastYearLength, this.thisYearLength, rate), 
                                  0, 
                                  ScrollBarChart.getValueByRate(this.lastYearMax, this.thisYearMax, rate), 
                                  globalVars.svgWidth
                              ))
                              .attr("height", ScrollBarChart.getValueByRate(this.lastYearHeight, this.thisYearHeight, rate))
                        }, 
                        onInactive: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("opacity", this.thisYearOpacity)
                                  .attr("width", ScrollBarChart.getWidthByCnt(this.thisYearLength, 0, this.thisYearMax, globalVars.svgWidth))
                                  .attr("height", this.thisYearHeight, globalVars.svgHeight)
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.lastYearPosition)
                                  .attr("opacity", this.lastYearOpacity)
                                  .attr("width", ScrollBarChart.getWidthByCnt(this.lastYearLength, 0, this.lastYearMax, globalVars.svgWidth))
                                  .attr("height", this.lastYearHeight)
                            }
                        }, 
                        thisYearPosition: thisYearPosition, 
                        thisYearOpacity: thisYearOpacity, 
                        thisYearHeight: thisYearHeight, 
                        lastYearPosition: lastYearPosition, 
                        lastYearOpacity: lastYearOpacity, 
                        lastYearHeight: lastYearHeight, 
                        nextYearPosition: nextYearPosition, 
                        nextYearOpacity: nextYearOpacity, 
                        nextYearHeight: nextYearHeight, 

                        yearName: yearName, 
                        rank: rank, 

                        thisYearLength: thisYearLength, 
                        lastYearLength: lastYearLength, 
                        nextYearLength: nextYearLength, 

                        thisYearMax: thisYearMax, 
                        thisYearMin: thisYearMin, 
                        lastYearMax: lastYearMax, 
                        lastYearMin: lastYearMin, 
                        nextYearMax: nextYearMax, 
                        nextYearMin: nextYearMin
                    }
                    
                    // 退出动画
                    var quitAnimation = {
                        __start__: 0.5, 
                        __end__: 1, 

                        onUpdate: function (rate, absolute, globalVars) {
                            // console.log(this)
                            d3.select("#rect-" + this.yearName + "-" + this.rank)
                              .attr("y", ScrollBarChart.getValueByRate(this.thisYearPosition, this.nextYearPosition, rate))
                              .attr("opacity", ScrollBarChart.getValueByRate(this.thisYearOpacity, this.nextYearOpacity, rate))
                              .attr("width", ScrollBarChart.getWidthByCnt(
                                  ScrollBarChart.getValueByRate(this.thisYearLength, this.nextYearLength, rate), 
                                  0, 
                                  ScrollBarChart.getValueByRate(this.thisYearMax, this.nextYearMax, rate), 
                                  globalVars.svgWidth
                            ))
                            .attr("height", ScrollBarChart.getValueByRate(this.thisYearHeight, this.nextYearHeight, rate))
                        }, 
                        onInactive: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.nextYearPosition)
                                  .attr("opacity", this.nextYearOpacity)
                                  .attr("width", ScrollBarChart.getWidthByCnt(this.nextYearLength, 0, this.nextYearMax, globalVars.svgWidth))
                                  .attr("height", this.nextYearHeight)
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("opacity", this.thisYearOpacity)
                                  .attr("width", ScrollBarChart.getWidthByCnt(this.thisYearLength, 0, this.thisYearMax, globalVars.svgWidth))
                                  .attr("height", this.thisYearHeight)
                            }
                        }, 
                        
                        thisYearPosition: thisYearPosition, 
                        thisYearOpacity: thisYearOpacity, 
                        thisYearHeight: thisYearHeight, 
                        lastYearPosition: lastYearPosition, 
                        lastYearOpacity: lastYearOpacity, 
                        lastYearHeight: lastYearHeight, 
                        nextYearPosition: nextYearPosition, 
                        nextYearOpacity: nextYearOpacity, 
                        nextYearHeight: nextYearHeight, 

                        yearName: yearName, 
                        rank: rank, 

                        thisYearLength: thisYearLength, 
                        lastYearLength: lastYearLength, 
                        nextYearLength: nextYearLength, 

                        thisYearMax: thisYearMax, 
                        thisYearMin: thisYearMin, 
                        lastYearMax: lastYearMax, 
                        lastYearMin: lastYearMin, 
                        nextYearMax: nextYearMax, 
                        nextYearMin: nextYearMin
                    }
                    this.addSubObject({
                        __start__: washedData[yearName].__index__ / totalYears, 
                        __end__: (washedData[yearName].__index__ + 1) / totalYears, 

                        onActivate: function (rate, absolute, globalVars) {
                            d3.select("#word-freq-bar-g")
                              .append("rect")
                              .attr("id", "rect-" + this.yearName + "-" + this.rank)
                              .attr("class", "rect-bars")
                              .attr("x", globalVars.svgWidth * 0.1)
                              .attr("fill", this.color)
                              .attr("stroke-width", 2)
                              .attr("stroke", "silver")
                              .attr("rx", Math.min(globalVars.svgWidth, globalVars.svgHeight) * 0.05)
                              .attr("ry", Math.min(globalVars.svgWidth, globalVars.svgHeight) * 0.05)
                        }, 
                        onInactive: function (rate, absolute, globalVars) {
                            d3.select("#rect-" + this.yearName + "-" + this.rank)
                              .remove()
                        }, 

                        __subObjects__: [
                            enterAnimation, 
                            quitAnimation
                        ], 

                        thisYearPosition: thisYearPosition, 
                        thisYearOpacity: thisYearOpacity, 
                        lastYearPosition: lastYearPosition, 
                        lastYearOpacity: lastYearOpacity, 
                        nextYearPosition: nextYearPosition, 
                        nextYearOpacity: nextYearOpacity, 

                        thisYearLength: thisYearLength, 
                        lastYearLength: lastYearLength, 
                        nextYearLength: nextYearLength, 

                        yearName: yearName, 
                        maxYear: maxYear, 
                        minYear: minYear, 
                        wordName: wordName, 
                        rank: rank, 
                        dataLength: yearData.details.length, 
                        wordCnt: wordCount, 
                        maxCnt: maxCnt, 
                        minCnt: minCnt, 

                        color: this.colors[wordName.hashCode() % this.colors.length], 
                        eleCnt: eleCnt
                    })

                    ++eleCnt
                }
            }

            // console.log(data.data)
            // console.log(washedData)

            // 给每年的每个词都添加一个矩形 & 文字
            // 每个组都有三部分动画 : 出现 + 停留 + 退出
            //     出现: 前一年的位置 -> 当前位置 若前一年不存在，则设为当前位置的后一个位置
            //     停留: 就是简单的停留，都不用设置动画
            //     退出: 当前位置 -> 后一年的位置 若前一年不存在，则设为当前位置的后一个位置
        })
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
        d3.select("#main-camvas")
          .selectAll(".word-freq-bar")
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