import SceneBase from "../utils/SceneBase.js"

function getPositionByRank(rank, dataLength, svgHeight) {
    return (rank + 0.5) / (dataLength + 1) * svgHeight
}

function getWidthByCnt(cnt, minn, maxx, svgWidth) {
    return (cnt - minn + 1) / (maxx - minn + 1) * svgWidth * 0.8
}

function getValueByRate(start, end, rate) {
    return rate * (end - start) + start 
}

/**
 * 2.0 版场景定义
 */
export default class SceneExtendedTemplate extends SceneBase {
    /**
     * 构造函数，只执行一次，用于定义变量等
     * @param {conf}   兼容 1.0 的配置文件，或子元素 Array 
     * @param {father} 父元素，一般留空，自动配置
     */
    constructor (conf, father) {
        super(conf, father)

        d3.json("../../data/3-policy-word-freq.json").then((data) => {
            // { year: {word: cnt} }
            var washedData = {}
            var minYear = Infinity
            var maxYear = -Infinity

            for (var yearData of data.data) {
                var yearName = yearData.year
                minYear = Math.min(minYear, yearName)
                maxYear = Math.max(maxYear, yearName)

                var tmpYearWordData = {}
                
                // 排序词
                yearData.words.sort(function (a, b) {
                    if (a.value > b.value) {
                        return -1
                    } else if (a.value < b.value) {
                        return 1
                    } else {
                        return 0
                    }
                })

                for (var rank = 0; rank < yearData.words.length; ++rank) {
                    var wordData = yearData.words[rank]

                    var wordName = wordData.name
                    var wordCount = wordData.value

                    tmpYearWordData[wordName] = {
                        "cnt": wordCount, 
                        "rank": rank
                    }
                }

                washedData[yearName] = tmpYearWordData
                washedData[yearName]["__min__"] = yearData.words[yearData.words.length - 1]
                washedData[yearName]["__max__"] = yearData.words[0]
            }

            // 遍历年
            for (var yearData of data.data) {
                var yearName = yearData.year

                var maxCnt = -Infinity
                var minCnt = Infinity

                for (var wordData of yearData.words) {
                    var wordCount = wordData.value 
                    maxCnt = Math.max(maxCnt, wordCount)
                    minCnt = Math.min(minCnt, wordCount)
                }

                // console.log(maxCnt)
                // console.log(minCnt)

                var thisYearMax = maxCnt
                var thisYearMin = minCnt

                var lastYearMax = 1
                var lastYearMin = 0
                if (washedData[yearName - 1]) {
                    lastYearMax = washedData[yearName - 1].__max__.value
                    lastYearMin = washedData[yearName - 1].__min__.value

                    lastYearMax = (lastYearMax + thisYearMax) * 0.5
                    lastYearMin = (lastYearMin + thisYearMax) * 0.5
                } 

                var nextYearMax = 1
                var nextYearMin = 0
                if (washedData[yearName + 1]) {
                    nextYearMax = washedData[yearName + 1].__max__.value
                    nextYearMin = washedData[yearName + 1].__min__.value

                    nextYearMax = (nextYearMax + thisYearMax) * 0.5
                    nextYearMin = (nextYearMin + thisYearMax) * 0.5
                } 

                // 遍历每个词
                for (var rank = 0; rank < yearData.words.length; ++rank) {
                    var wordData = yearData.words[rank]
                    
                    var wordName = wordData.name
                    var wordCount = wordData.value 

                    // 今年的位置
                    var thisYearPosition = getPositionByRank(rank, yearData.words.length, conf.svgHeight)
                    var thisYearOpacity = 1
                    var thisYearLength = wordData.value
                    
                    // 去年的位置
                    var lastYearPosition = thisYearPosition + 100
                    var lastYearOpacity = 0
                    var lastYearLength = 0 
                    if (washedData[yearName - 1] && washedData[yearName - 1][wordName]) {
                        lastYearPosition = getPositionByRank(washedData[yearName - 1][wordName].rank, yearData.words.length, conf.svgHeight)
                        lastYearPosition = (lastYearPosition + thisYearPosition) * 0.5
                        lastYearOpacity = 1
                        lastYearLength = washedData[yearName - 1][wordName].cnt
                        lastYearLength = (lastYearLength + thisYearLength) * 0.5
                    } 

                    // 明年的位置
                    var nextYearPosition = thisYearPosition + 100
                    var nextYearOpacity = 0
                    var nextYearLength = 0
                    if (washedData[yearName + 1] && washedData[yearName + 1][wordName]) {
                        nextYearPosition = getPositionByRank(washedData[yearName + 1][wordName].rank, yearData.words.length, conf.svgHeight)
                        nextYearPosition = (nextYearPosition + thisYearPosition) * 0.5
                        nextYearOpacity = 1
                        nextYearLength = washedData[yearName + 1][wordName].cnt
                        nextYearLength = (nextYearLength + thisYearLength) * 0.5
                    } 

                    // 进入动画
                    var enterAnimation = {
                        __start__: 0, 
                        __end__: 0.2, 
                        
                        __onActivate__: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.lastYearPosition)
                                  .attr("width", this.lastYearLength)
                                  .attr("opacity", this.lastYearOpacity)
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("width", this.thisYearLength)
                                  .attr("opacity", this.thisYearOpacity)
                            }
                        }, 

                        __onUpdate__: function (rate, absolute, globalVars) {
                            d3.select("#rect-" + this.yearName + "-" + this.rank)
                              .attr("y", getValueByRate(this.lastYearPosition, this.thisYearPosition, rate))
                              .attr("opacity", getValueByRate(this.lastYearOpacity, this.thisYearOpacity, rate))
                              .attr("width", getWidthByCnt(
                                  getValueByRate(this.lastYearLength, this.thisYearLength, rate), 
                                  0, 
                                  getValueByRate(this.lastYearMax, this.thisYearMax, rate), 
                                  globalVars.svgWidth
                              ))
                        }, 
                        __onInactive__: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("opacity", this.thisYearOpacity)
                                  .attr("width", getWidthByCnt(this.thisYearLength, 0, this.thisYearMax, globalVars.svgWidth))
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.lastYearPosition)
                                  .attr("opacity", this.lastYearOpacity)
                                  .attr("width", getWidthByCnt(this.lastYearLength, 0, this.lastYearMax, globalVars.svgWidth))
                            }
                        }, 
                        thisYearPosition: thisYearPosition, 
                        thisYearOpacity: thisYearOpacity, 
                        lastYearPosition: lastYearPosition, 
                        lastYearOpacity: lastYearOpacity, 
                        nextYearPosition: nextYearPosition, 
                        nextYearOpacity: nextYearOpacity, 

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
                        __start__: 0.8, 
                        __end__: 1, 

                        __onActivate__: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("width", this.thisYearLength)
                                  .attr("opacity", this.thisYearOpacity)
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.nextYearPosition)
                                  .attr("width", this.nextYearLength)
                                  .attr("opacity", this.nextYearOpacity)
                            }
                        }, 

                        __onUpdate__: function (rate, absolute, globalVars) {
                            // console.log(this)
                            d3.select("#rect-" + this.yearName + "-" + this.rank)
                              .attr("y", getValueByRate(this.thisYearPosition, this.nextYearPosition, rate))
                              .attr("opacity", getValueByRate(this.thisYearOpacity, this.nextYearOpacity, rate))
                              .attr("width", getWidthByCnt(
                                  getValueByRate(this.thisYearLength, this.nextYearLength, rate), 
                                  0, 
                                  getValueByRate(this.thisYearMax, this.nextYearMax, rate), 
                                  globalVars.svgWidth
                            ))
                        }, 
                        __onInactive__: function (rate, absolute, globalVars) {
                            if (SceneBase.scroll.lastScrolled < SceneBase.scroll.nowScrolled) {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.nextYearPosition)
                                  .attr("opacity", this.nextYearOpacity)
                                  .attr("width", getWidthByCnt(this.nextYearLength, 0, this.nextYearMax, globalVars.svgWidth))
                            } else {
                                d3.select("#rect-" + this.yearName + "-" + this.rank)
                                  .attr("y", this.thisYearPosition)
                                  .attr("opacity", this.thisYearOpacity)
                                  .attr("width", getWidthByCnt(this.thisYearLength, 0, this.thisYearMax, globalVars.svgWidth))
                            }
                        }, 
                        
                        thisYearPosition: thisYearPosition, 
                        thisYearOpacity: thisYearOpacity, 
                        lastYearPosition: lastYearPosition, 
                        lastYearOpacity: lastYearOpacity, 
                        nextYearPosition: nextYearPosition, 
                        nextYearOpacity: nextYearOpacity, 

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

                    var tempSubId = this.addSubObject({
                        __start__: (yearName - minYear) / (maxYear - minYear + 1), 
                        __end__: (yearName - minYear + 1) / (maxYear - minYear + 1), 
                        __onActivate__: function (rate, absolute, globalVars) {
                            // console.log(this.yearName + " " + this.wordName + " 开始")
                            // console.log((this.wordCnt - this.minCnt + 5) / (this.maxCnt - this.minCnt + 6))
                            // console.log(this.wordCnt, this.maxCnt, this.minCnt)
                            var tmpEle = d3.select("#word-freq-bar-g")
                                            .append("rect")
                                            .attr("id", "rect-" + this.yearName + "-" + this.rank)
                                            .attr("x", globalVars.svgWidth * 0.1)
                                            .attr("height", 1 / (this.dataLength + 1) * globalVars.svgHeight * 0.9)
                                            .attr("fill", "gray")
                                            .attr("stroke-width", 2)
                                            .attr("stroke", "black")

                            
                        }, 
                        __onInactive__: function (rate, absolute, globalVars) {
                            // console.log(this.yearName + " " + this.wordName + " 结束")

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
                        dataLength: yearData.words.length, 
                        wordCnt: wordCount, 
                        maxCnt: maxCnt, 
                        minCnt: minCnt
                    })
                }
            }

            console.log(data.data)
            console.log(washedData)
            // console.log(minYear)
            // console.log(maxYear)
            

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
    __onActivate__(rate, abso, gloalVars) {
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

    /**
     * 子场景配置文件 可以是 [{conf}] 或 {id: {conf}} 
     * 子场景中可以使用 { this.__father__ } 获取父场景中的元素
     */
    __subObjects__ = {}

    /** 以下为自定义数据，在函数中可以通过 this.名称 使用 **/
}