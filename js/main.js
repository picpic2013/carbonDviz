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

// 所有的更新场景
var allScrollScenes = []

import SceneBase from "./utils/SceneBase.js"

import titleScene from "./scenes/titleScene.js"
import mapAndLineScene from "./scenes/mapAndLine.js"

import testScene from "./scenes/testScene.js"

allScrollScenes.push(new SceneBase({
    __subObjects__: [
        titleScene, 
        mapAndLineScene, 
        testScene
    ]
}))

// 更新函数
var updateFunction = function () {
    // 滚动的百分比
    var scrolled = (document.documentElement.scrollTop || document.body.scrollTop) /
                 (document.documentElement.scrollHeight - pageHeight)

    // 如果需要更新该场景，即调用相应的更新函数
    for (var scene of allScrollScenes) {
        if (scene.__start__ === undefined || scene.__end__ === undefined) {
            console.error("scene invalid")
            continue
        }
        
        if (scene.__isActive__ === undefined) {
            scene.__isActive__ = false;
        }

        // 如果不在范围内
        if (scrolled < scene.__start__ || scrolled > scene.__end__) {
            if (scene.__isActive__ === true) {
                if (scene.__onInactive__) {
                    scene.__onInactive__.call(scene, scrolled, gloalVars)
                }
                scene.__isActive__ = false
            }
            
            if (scene.__onUpdateInactive__) {
                scene.__onUpdateInactive__.call(scene, scrolled, gloalVars)
            }
            continue
        }
        
        // 计算当前场景的进度
        var percentage = (scrolled - scene.__start__) / (scene.__end__ - scene.__start__)
        
        // 调用场景的更新函数
        if (scene.__isActive__ === false) {
            if (scene.__onActivate__) {
                scene.__onActivate__.call(scene, percentage, scrolled, gloalVars)
            }
            scene.__isActive__ = true
        }

        if (scene.__onUpdate__) {
            scene.__onUpdate__.call(scene, percentage, scrolled, gloalVars)
        }
    }
}

// 滚动时进行更新
window.addEventListener("scroll", updateFunction)

// 加载完先自动更新一波
window.onload = function () {
    updateFunction.call(this)
}