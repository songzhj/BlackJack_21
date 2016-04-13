/**
 * Created by songzhj on 2016/4/11.
 */

var server = require('http').createServer();
var io = require('socket.io')(server);

var rooms = {};

function Room(userID) {
    this.id = userID;
    this.users = new Array();
}

function User(id, name) {
    this.id = id;
    this.name = name;
}

function Poker (num, color) {
    this.num = num;
    this.color = color;
    this.isDeal = false;
}

function genPokers () {
    var pokers = new Array();
    var i = 0;
    for (; i < 52; ++i) {
        var num = 0;
        switch (i % 12) {
            case 1:
                num = 'A';
                break;
            case 10:
                num = 'J';
                break;
            case 11:
                num = 'Q';
                break;
            case 0:
                num = 'K';
                break;
        }
        var color = 0;
        switch (i / 12) {
            case 0:
                color = 'club';
                break;
            case 1:
                color = 'heart';
                break;
            case 2:
                color = 'spade';
                break;
            case 3:
                color = 'square';
                break;
        }
        var newPoker = new Poker(num, color);
        pokers.push(newPoker);
    }
    return pokers;
}

var pokers = null;

io.on('connection', function(socket){
    console.log('connect');
    //监听客户端创建房间
    socket.on('create', function (obj) {
        var room = new Room(obj.userID);
        var user = new User(obj.userID, obj.userName);
        room.users.push(user);
        rooms[room.id] = room;
        console.log('create room ' + room.id + ' ' + room.users + ' ' + room.users[0].name);
    });
    //监听客户端加入房间
    socket.on('login', function (obj) {
         var user = new User(obj.userID, obj.userName);
         rooms[obj.roomID].users.push(user);
         console.log('login ' + obj.userName);
         io.emit('login', rooms[obj.roomID].users);
    });
    //监听开始游戏
    socket.on('start', function () {
         pokers = genPokers();
         
    });
});
server.listen(4110);