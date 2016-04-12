/**
 * Created by songzhj on 2016/4/11.
 */

var server = require('http').createServer();
var io = require('socket.io')(server);

var rooms = {};

function Room(userID, userName) {
    this.id = userID;
    this.users = new Array();
    this.users[userID] = userName;
}



io.on('connection', function(socket){
    console.log('connect');
    //监听客户端创建房间
    socket.on('create', function (obj) {
        var room = new Room(obj.userID, obj.userName);
        rooms[room.id] = room;
    });
    //监听客户端加入房间
    socket.on('login', function () {
         
    });
});
server.listen(4110);