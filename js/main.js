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
var svg = d3.select("#main-camvas")
            .attr("width", pageWidth * widthScale)
            .attr("height", pageHeight * heightScale);

import SceneBase from "./utils/SceneBase.js"
import ScrollSceneBasePlugin from "./utils/plugins/ScrollSceneBasePlugin.js"

SceneBase.use(ScrollSceneBasePlugin)
SceneBase.setGloalVars(gloalVars)

// import titleScene from "./scenes/titleScene.js"
// import mapAndLineScene from "./scenes/mapAndLine.js"
// import testScene from "./scenes/testScene.js"
// import { SceneExtendedTemplate } from "./scenes/TestScene2.js"
// import barCovid from "./scenes/bar-covid.js"
import ScrollBarChart from "./utils/components/scroll-bar.js"
// import LineChart from "./scenes/line-chart.js"

import WorldMapLeft from "./scenes/2-world-map.js"

SceneBase.scroll.init([
    // titleScene, 
    // mapAndLineScene, 
    // testScene, 
    // new SceneExtendedTemplate({__start__: 0.52, __end__: 0.65})

    // 政策词频统计图
    // new ScrollBarChart({
    //     svgHeight: pageHeight * heightScale, 
    //     __dataUrl__: "/data/3-policy-word-freq-real.json", 
    //     __onload__: function (data) {
    //         var tmpList = data.data
    //         var tmpRes = []
    //         for (var i of tmpList) {
    //             tmpRes.push({
    //                 time: i.year, 
    //                 details: i.words
    //             })
    //         }
    //         tmpRes = tmpRes.sort(function (a, b) {
    //             if (a.time < b.time) {
    //                 return -1
    //             }
    //             if (a.time > b.time) {
    //                 return 1
    //             }
    //             return 0
    //         })
    //         return {data: tmpRes}
    //     }
    // }), 

    // 右侧的折线图
    // new LineChart({
    //     svgHeight: pageHeight * heightScale
    // }), 

    // 左侧的世界地图
    new WorldMapLeft({
        svgHeight: pageHeight * heightScale, 
        svgWidth: pageWidth * widthScale
    })
])