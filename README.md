<!--
 * @Autor        : Pat
 * @Description  : live
 * @Email        : gouqingping@yahoo.com
 * @Date         : 2020-12-22 11:28:59
 * @LastEditors  : Pat
 * @LastEditTime : 2021-12-16 09:22:31
-->
###  启动后端 
+ `port` 启动端口,默认8888
+ `code` rtsp视频流编码格式，默认libx265
> node index.js --mode port=18888 --mode code=libx265
```cmd
    npm run start
```

### 前端环境
> 构建好一个vue项目之后，`npm install flv.js -S -D` 详情查看 `test` 文件夹