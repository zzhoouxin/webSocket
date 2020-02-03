今天是2.3号，大年初十了。大家可能都在家办公吧。希望疫情可以早日结束。中国加油！!
网上看了一些webSocket的文字。就记录学习一下。
 
##1.大白话描述下WebSocket的产生
大家对于我们web应用的信息交互过程肯定都了解。`客户端发送请求-->服务端进行响应数据--->发送到客户端--->进行数据展示等`，我们通常网页都是这样的流程 是没有什么问题而言的。但是针对实效性较强的应用，比如 游戏、通讯等应用。如果数据响应较慢 会带来很不好的体验;

有问题就要解决问题。大佬们就想出来这样的办法 `轮询机制(分2种)`：
- 长轮询机制
- 流技术机制

#####1.1 长轮询机制
`普通轮询`
先说下轮询机制 ,从名字就知道:循环着访问。就是客户端每隔一段时间就请求服务端。通过不断的调用,达到客户端与服务端数据的同步；但是这样带来的问题就是效率低。 比如服务端数据没有发生更新 依旧占据着网络请求;有太多的无效的网路请求；

`长轮询`
为了减少无效的网络传输，长轮询对普通轮询进行了改进和提高，当服务器端没有数据更新时，链接会保持一段时间的周期，直到数据或状态发生改变或连接时间过期，通过这种机制我们就可以减少很多无效的客户端和服务器间的交互。当然，如果服务器端的数据变更非常频繁的话，这种机制并没有有效的提高性能，和普通轮询没有太大的区别，且长轮询也会耗费更多的资源，比如CPU,内存,带宽等。


#####1.2 流技术机制
流技术机制简单来说就是客户端的页面使用一个隐藏的窗口向服务端发出一个长连接的请求。服务器接到请求后作出回应，并不断更新状态，以保证客户端和服务器端的连接不过期。通过这种机制就可以将服务器端的信息不断传向客户端，从而保证信息的时效性。但这种机制对于用户体验并不友好，需要针对不同的浏览器升级不同的方案来改进用户体验，同时这种机制如果在并发情况下发生时，会对服务器的资源造成很大压力。


##2.webSocket的诞生
正是出于以上几种解决方案都有着各自的局限性,HTML5 WebSocket也就应运而生了，浏览器可以通过JavaScript借助现有的HTTP协议来向服务器发出WebSocket连接的请求，当连接建立后，客户端和服务器端就可以直接通过TCP连接来直接进行数据交换。这是由于websocket协议本质上就是一个TCP连接，所以在数据传输的稳定性和传输量上有所保证，且相对于以往的轮询和Comet技术在性能方面也有了长足的进步：
![image.png](https://upload-images.jianshu.io/upload_images/7078301-7a750cc48d228aaf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
有一点需要注意的是虽然websocket在通信时需要借助HTTP，但它本质上和HTTP有着很大的区别：

- WebSocket是一种双向通信协议，在建立连接之后，WebSocket服务端和客户端都能主动向对方发送或者接受数据。
- WebSocket需要先连接，只有再连接后才能进行相互通信。

##3.webSocket 上手使用
`上面算是介绍了下webSocket的历史吧`  不多BB  直接上代码
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
</head>
<script>
    // 只需要new一下就可以创建一个websocket的实例
    // 我们要去连接ws协议
    let ws = new WebSocket('ws://localhost:9999');
    // onopen是客户端与服务端建立连接后触发
    ws.onopen = function() {
        ws.send('我是客户端 收到请回复');
    };
    // onmessage是当服务端给客户端发来消息的时候触发
    ws.onmessage = function(res) {
        console.log(res); // 打印的是MessageEvent对象
        // 真正的消息数据是 res.data
        console.log(res.data);
    };
</script>
<body></body>
</html>
```
这样我们客户端的代码就算写好了。 API 是不是非常的简单呢；
具体作用 代码里面已经加了备注啦-也就是添加了一个监听消息-
就是 `onopen   send   onmessage` 这个也就是订阅模式的提现。

这个撸好后 我们在写一个服务端吧；作为交互的过程
服务端直接使用node的 express框架吧；
不熟悉的小伙伴 就先学习这个过程吧  后面需要吧express补上哦；
我们需要安装一个webSocket的包
```
npm init
npm  wx --save
npm express --save
```
在建立一个server.js 用来编写服务端
文件夹如下面
![image.png](https://upload-images.jianshu.io/upload_images/7078301-68db63aed3eebf21.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

下面开始编写server.js吧  直接复制吧
```
const express = require('express');
const app = express();
// 设置静态文件夹
app.use(express.static(__dirname));
// 监听3000端口
app.listen(3000);
// =============================================
// 开始创建一个websocket服务
const Server = require('ws').Server;
// 这里是设置服务器的端口号，需要客户端html代码里面建立连接的保持一致
const ws = new Server({ port: 9999 });

// 监听服务端和客户端的连接情况
ws.on('connection', function(socket) {
    // 监听客户端发来的消息
    socket.on('message', function(msg) {
        console.log(msg);   // 这个就是客户端发来的消息
        
        socket.send(`这里是服务端对你说的话： ${msg}`);
    });
});
```

下面执行命令 `node server.js`  然后在chrome打开 `http://localhost:3000/`
![image.png](https://upload-images.jianshu.io/upload_images/7078301-2f40502a17315352.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/7078301-214d5f16574f10bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

看客户端和服务端console的数据。交互就完成啦。这样一个简单的交互就搞定啦。 有米有很激动呢。
不过还没有结束哦。 我们知道webSocket是H5标准推出来的标准--
那么就有兼容的问题啦---兼容问题 永远让你很蛋疼吧

那么有问题就去解决  就有了新的一个库-[https://socket.io/](https://socket.io/)

##4.socket.io的使用
先来看下socket.io的特别有哪些
socket.io的特点
- 易用性：封装了服务端和客户端，使用简单方便
- 跨平台：支持跨平台，可以选择在服务端或是客户端开发实时应用
- 自适应：会根据浏览器来自己决定是使用WebSocket、Ajax长轮询还是Iframe流等方式去选择最优方式，甚至支持IE5.5

看完优点。那我们继续学习下socke.io的使用吧。 其实差别不大；

`安装`
```
npm i socket.io -S
```

我们基于刚才的server.js 文件进行修改
```
// server.js文件
const express = require('express');
const app = express();
// 设置静态文件夹
app.use(express.static(__dirname));
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
```

如果你仔细看 其实流程是一个样子的。 只不过是我们的语法糖发生了改变；
服务端就这样修改了。继续修改下客户端的html代码吧
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>scoket</title>
    <script src="socket.io/socket.io.js"></script>
    <script>
        const socket = io('/');
        // 监听与服务器连接成功的事件
        socket.on('connect', () => {
            console.log('连接成功');
            socket.send('客户端:我连接上了,我叫小客');
        });
        // 监听服务端发来的消息
        socket.on('message', msg => {
            // 这个msg就是传过来的真消息了，不用再msg.data取值了
            console.log(`客户端接收到的消息： ${msg}`);
        });
        // 监听与服务器连接断开事件
        socket.on('disconnect', () => {
            console.log('连接断开成功');
        });
    </script>
</head>
<body>learn scoket</body>
</html>
```

和刚才上面的流程一直。
执行命令 `node server.js` 然后在chrome打开 http://localhost:3000/
![image.png](https://upload-images.jianshu.io/upload_images/7078301-a3a483ff9e94d8cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![image.png](https://upload-images.jianshu.io/upload_images/7078301-26e3e2889ad5f692.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


好了这样一来 我们新的库使用就结束了。 相信看完这个文章的小伙伴对webSocket 有了认识；先溜了吧；
参考文章：
[https://juejin.im/post/5bc7f6b96fb9a05d3447eef8](https://juejin.im/post/5bc7f6b96fb9a05d3447eef8)
[https://juejin.im/post/5af5693451882530646527d1](https://juejin.im/post/5af5693451882530646527d1)
`最后的最后  希望疫情早日结束。中国加油！2020加油！`
`最后的最后  希望疫情早日结束。中国加油！2020加油！`
`最后的最后  希望疫情早日结束。中国加油！2020加油！`
重要的事情说3遍~






















