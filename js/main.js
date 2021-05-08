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

import titleScene from "./scenes/titleScene.js"
import mapAndLineScene from "./scenes/mapAndLine.js"
import testScene from "./scenes/testScene.js"
import { SceneExtendedTemplate } from "./scenes/TestScene2.js"

var baseScene = new SceneBase([
        titleScene, 
        mapAndLineScene, 
        testScene, 
        new SceneExtendedTemplate({__start__: 0.52, __end__: 0.65})
])

// 更新函数
var updateFunction = function () {
    // 滚动的百分比
    var scrolled = (document.documentElement.scrollTop || document.body.scrollTop) /
                 (document.documentElement.scrollHeight - pageHeight)

    baseScene.__onUpdate__(scrolled, scrolled, gloalVars)
}

// 滚动时进行更新
window.addEventListener("scroll", updateFunction)

// 加载完先自动更新一波
window.onload = function () {
    updateFunction.call(this)
}