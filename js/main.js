// 获取页面宽度
var pageWidth = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

// 获取页面高度
var pageHeight = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

var widthScale = 0.9;
var heightScale = 0.9;

var gloalVars = {
    pageWidth, pageHeight, widthScale, heightScale, 
    svgWidth: pageWidth * widthScale, 
    svgHeight: pageHeight * heightScale
}

// 设置 中央 SVG 的宽高
var svg = d3.select("#world-map-svg")
            .attr("width", pageWidth * widthScale)
            .attr("height", pageHeight * heightScale);

d3.select("#policy-freq-svg")
  .attr("width", pageWidth * widthScale)
  .attr("height", pageHeight * heightScale);

d3.select("#world-line-svg")
  .attr("width", pageWidth * widthScale)
  .attr("height", pageHeight * heightScale);

d3.select("#world-back-svg")
  .attr("width", pageWidth * widthScale)
  .attr("height", pageHeight * heightScale);

d3.select("#tx-bar-svg")
  .attr("width", pageWidth * widthScale)
  .attr("height", pageHeight * heightScale);
  

import SceneBase from "./utils/SceneBase.js"
import ScrollSceneBasePlugin from "./utils/plugins/ScrollSceneBasePlugin.js"
import SimpleCurvePlugin from "./utils/plugins/SimpleCurvePlugin.js"

SceneBase.use(ScrollSceneBasePlugin)
SceneBase.use(SimpleCurvePlugin)

SceneBase.setGloalVars(gloalVars)

import TitleScene from "./scenes/titleScene.js"
import ScrollBarChart from "./utils/components/scroll-bar.js"
import LineChart from "./scenes/line-chart.js"

import WorldMapLeft from "./scenes/2-world-map.js"
import LineChart2 from "./scenes/4-area-chart.js"
import WorldMapBackground from "./scenes/2-world-map-background.js"

import LinearOpacity from "./utils/components/LinearOpacity.js"

import TransactionScrollBarChart from "./scenes/4-transaction-scroll-bar.js"

SceneBase.scroll.init([
    // new TitleScene().start(0).end(3 * gloalVars.svgHeight).setRateMode('absolute'), 

    // 左侧的世界地图
    // 右侧的折线图
    // new SceneBase()
    // .start("world-map-start-observer")
    // .end("world-map-end-observer")
    // .setRateMode('absolute')
    // .subObject(new WorldMapLeft({
    //     svgHeight: pageHeight * heightScale, 
    //     svgWidth: pageWidth * widthScale, 
    // }))
    // .subObject(new LineChart({
    //     svgHeight: pageHeight * heightScale
    // })), 

    new LineChart({svgHeight: pageHeight * heightScale})
    .start("world-line-start-observer")
    .end("world-line-end-observer")
    .setRateMode('absolute'), 

    // 政策词频统计图
    new ScrollBarChart({
        svgHeight: pageHeight * heightScale, 
        __dataUrl__: "/data/3-policy-word-freq-real.json", 
        __onload__: function (data) {
            var tmpList = data.data
            var tmpRes = []
            for (var i of tmpList) {
                tmpRes.push({
                    time: i.year, 
                    details: i.words
                })
            }
            tmpRes = tmpRes.sort(function (a, b) {
                if (a.time < b.time) {
                    return -1
                }
                if (a.time > b.time) {
                    return 1
                }
                return 0
            })
            return {data: tmpRes}
        }, 
        __canvasId__: "policy-freq-svg"
    })
    .start("policy-freq-start-observer")
    .end("policy-freq-end-observer")
    .setRateMode('absolute'), 

    // 碳排放交易河流图
    // new LineChart2({
    //     svgHeight: pageHeight * heightScale, 
    //     svgWidth: pageWidth * widthScale
    // })
    // .start("policy-river-start-observer")
    // .end("policy-river-end-observer")
    // .setRateMode('absolute')
    // .subObject(
    //     new LinearOpacity({
    //         mountOn: '#area-chart-g', 
    //         startOpacity: 0, 
    //         endOpacity: 1
    //         })
    //         .end(0.1),
    // ), 

    new WorldMapBackground({
        pageWidth, pageHeight, widthScale, heightScale, 
        svgWidth: pageWidth * widthScale, 
        svgHeight: pageHeight * heightScale
    })
    .start("world-back-start-observer")
    .end("world-back-end-observer")
    .setRateMode('absolute'), 
    

    new TransactionScrollBarChart({
        svgHeight: pageHeight * heightScale, 
        svgWidth: pageWidth * widthScale
    })
    .start("tx-bar-start-observer")
    .end("tx-bar-end-observer")
    .setRateMode('absolute'), 
])
console.log(SceneBase.scroll.__rootScene__)