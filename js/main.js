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
import wordPolicyFreq from "./scenes/3-policy-freq.js"

SceneBase.scroll.init([
    // titleScene, 
    // mapAndLineScene, 
    // testScene, 
    // new SceneExtendedTemplate({__start__: 0.52, __end__: 0.65})
    new wordPolicyFreq({
        svgHeight: pageHeight * heightScale
    })
])

console.log(SceneBase.scroll.__rootScene__)