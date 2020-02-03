// server.js文件
const express = require('express');
const app = express();
// 设置静态文件夹
app.use(express.static(__dirname + '/server'));
// 通过node的http模块来创建一个server服务
const server = require('http').createServer(app);
// WebSocket是依赖HTTP协议进行握手的
const io = require('socket.io')(server);
// 监听客户端与服务端的连接
io.on('connection', function(socket) {
    // send方法来给客户端发消息
    socket.send('服务端:我们连接起来了,我叫小服');
    // 监听客户端的消息是否接收成功
    socket.on('message', function(msg) {
        console.log(msg); // 客户端发来的消息
        socket.send('服务端:我收到了你的回复了');
    });
});
// 监听3000端口
server.listen(3000);