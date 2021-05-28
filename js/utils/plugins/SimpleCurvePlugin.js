class SimpleCurvePlugin {}

SimpleCurvePlugin.install = function (SceneBase, conf) {
    // 线性映射
    SimpleCurvePlugin.linearMap = function (now, startNum, endNum, startOutput, endOutput) {
        let tmpValue = (now - startNum) / (endNum - startNum) * (endOutput - startOutput) + startOutput
        tmpValue = Math.max(tmpValue, Math.min(startOutput, endOutput))
        tmpValue = Math.min(tmpValue, Math.max(startOutput, endOutput))
        return tmpValue
    }

    SceneBase.sc = SimpleCurvePlugin
}

export default SimpleCurvePlugin