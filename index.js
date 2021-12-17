/*
 * @Autor        : Pat
 * @Description  : 
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-12-22 11:28:59
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-15 19:40:12
 */
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const expressWebSocket = require("express-ws");
const webSocketStream = require("websocket-stream/stream");
// const os = require("os");
const app = express();
const [scriptNpm, ...modes] = process.env.npm_lifecycle_script.split("--mode");
const npm_env = {}
modes.forEach((item) => {
    const [key, value] = item.replace(" ", "").split("=");
    npm_env[key] = value;
});
let { port, code } = npm_env;
code = code || "libx265";
port = port || 8888;
ffmpeg.setFfmpegPath("./ffmpeg-N-100449-g28aedc7f54-win64-gpl-shared-vulkan/bin/ffmpeg");
// const networkInterfaces = os.networkInterfaces();
// const [netmask1, { address }] = networkInterfaces['以太网 2'];
app.use(express.static(__dirname));
expressWebSocket(app, null, { erMessageDeflate: true });
//设置跨域访问
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});
app.ws("/rtsp/:id/", (ws, req) => {
    const url = req.query.url;
    console.log("转换初始化");
    console.log(url);
    console.log(JSON.stringify(req.params || {}));
    if (url) {
        const stream = webSocketStream(ws, { binary: true, browserBufferTimeout: 1000000 }, { browserBufferTimeout: 1000000 });
        try {
            // 这里可以添加一些 RTSP 优化的参数
            // libx265 .audioCodec('libmp3lame')
            ffmpeg(url).addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400").on("start", () => {
                console.log("开始转换");
            }).on("codecData", (e) => {
                console.log("数据解码");
                // 摄像机在线处理
            }).on("error", (err) => {
                console.log(err.message);
            }).on("end", () => {
                console.log("转码结束");
                // 摄像机断线的处理
            }).outputFormat("flv").videoCodec(code).noAudio().pipe(stream);
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log(`url is undefind`)
    }
});
app.listen(port);
console.log("App running at:")
console.log(`- Local: %cws://localhost:${port}`, "color: green; font-size: 20px");
// console.log(`- Network: %cws://${address}:${port}`, "color: green; font-size: 20px");