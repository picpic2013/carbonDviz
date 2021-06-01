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
  .attr("width", 800)
  .attr("height", 600);

d3.select("#world-line-svg")
//   .attr("width", pageWidth * widthScale)
//   .attr("height", pageHeight * heightScale)
  .attr("width", 750)
  .attr("height", 600);

d3.select("#world-back-svg")
  .attr("width", pageWidth * widthScale)
  .attr("height", Math.min(pageHeight * heightScale, pageWidth * widthScale * 6 / 8));

d3.select("#tx-bar-svg")
  .attr("width", 800)
  .attr("height", 600);

d3.select("#carbon-density-svg")
  .attr("width", 800)
  .attr("height", 600);
  
d3.select("#carbon-ratio-svg")
  .attr("width", 800)
  .attr("height", 600);
  

import SceneBase from "./utils/SceneBase.js"
import ScrollSceneBasePlugin from "./utils/plugins/ScrollSceneBasePlugin.js"
import SimpleCurvePlugin from "./utils/plugins/SimpleCurvePlugin.js"

SceneBase.use(ScrollSceneBasePlugin)
SceneBase.use(SimpleCurvePlugin)

SceneBase.setGloalVars(gloalVars)

import ScrollBarChart from "./utils/components/scroll-bar.js"
import LineChart from "./scenes/line-chart.js"
import WorldMapBackground from "./scenes/2-world-map-background.js"
import TransactionScrollBarChart from "./scenes/4-transaction-scroll-bar.js"
import LowCarbonDensity from "./scenes/5-low-carbon-density.js"
import CarbonRatio from "./scenes/6-carbon-ratio.js"

SceneBase.scroll.init([
    new LineChart({
        svgHeight: 600, 
        svgWidth: 800, 
    })
    .start("world-line-start-observer")
    .end("world-line-end-observer")
    .setRateMode('absolute'), 

    // 政策词频统计图
    new ScrollBarChart({
        svgHeight: 600, 
        svgWidth: 800, 
        __dataUrl__: "/data/3-policy-word-freq-real.json", 
        __onload__: function (data) {
            // console.log(data)
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
            // console.log(tmpRes)
            return {data: tmpRes}
        }, 
        __canvasId__: "policy-freq-svg"
    })
    .start("policy-freq-start-observer")
    .end("policy-freq-end-observer")
    .setRateMode('absolute'), 

    new WorldMapBackground({
        pageWidth, pageHeight, widthScale, heightScale, 
        svgWidth: pageWidth * widthScale, 
        svgHeight: Math.min(pageHeight * heightScale, pageWidth * widthScale * 6 / 8)
    })
    .start("world-back-start-observer")
    .end("world-back-end-observer")
    .setRateMode('absolute'), 

    new LowCarbonDensity({
        svgHeight: 600, 
        svgWidth: 800, 
    }), 

    new TransactionScrollBarChart({
        svgHeight: 600, 
        svgWidth: 800
    })
    .start("tx-bar-start-observer")
    .end("tx-bar-end-observer")
    .setRateMode('absolute'), 

    new CarbonRatio({
        svgHeight: 600, 
        svgWidth: 800
    })
    .start("carbon-ratio-start-observer")
    .end("carbon-ratio-end-observer")
    .setRateMode('absolute'), 
])
// console.log(SceneBase.scroll.__rootScene__)