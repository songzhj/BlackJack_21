/**
 * Created by songzhj on 2016/4/11.
 */

var server = require('http').createServer();

var io = require('socket.io')(server);
//服务器所有房间
var rooms = {};
/*房间*/
function Room(userID) {
    this.id = userID;
    this.pokers = null;
    this.users = new Array();
    this.isPlaying = false; //该房间游戏是否开始
    this.playerLast = 0; //该房间内有权利要牌的玩家数量（未亮牌玩家）
    this.turn = 0; //轮到谁要牌
}
/*玩家*/
function User(id, name) {
    this.id = id;
    this.name = name;
    this.pokers = new Array();
    this.showdown = false; //玩家是否亮牌
}
/*扑克牌*/
function Poker(num, color) {
    this.num = num;
    this.color = color;
    this.isDeal = false;
}
/*生成一副扑克牌*/
function genPokers() {
    var pokers = new Array();
    var i = 0;
    for (; i < 52; ++i) {
        var num = 0;
        switch (i % 13) {
            case 10:
                num = 'J';
                break;
            case 11:
                num = 'Q';
                break;
            case 12:
                num = 'K';
                break;
            case 0:
                num = 'A';
                break;
            default:
                num = i % 13 + 1;
        }
        var color = 0;
        switch (parseInt(i / 13)) {
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
/*发牌*/
function deal(room) {
    var i = Math.floor(Math.random() * 51);
    while(room.pokers[i].isDeal) {
        i = Math.floor(Math.random() * 51);
    }
    room.pokers[i].isDeal = true;
    return room.pokers[i];
}
/*WebSocket连接*/
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
         if (rooms[obj.roomID].isPlaying) { //游戏进行中的房间不能加入
             return false;
         }
         if (rooms[obj.roomID].users.length > 3) { //房间满员不能进入
             return false;
         }
         var user = new User(obj.userID, obj.userName);
         rooms[obj.roomID].users.push(user);
         console.log('login ' + obj.userName);
         io.emit('login', rooms[obj.roomID].users);
    });
    //监听开始游戏
    socket.on('start', function (id) {
         var room = rooms[id];
         room.isPlaying = true;  //设置房间游戏进行中
         room.playerLast = room.users.length; //房间内仍有权力要牌的玩家（没有亮牌）
         room.pokers = genPokers();  //生成一副新的牌
         var pokers = new Array();
         var users = room.users;
         for (var i = 0; i < users.length; ++i) {
             var poker1 = deal(room);
             var poker2 = deal(room);
             var newObj = new Object();
             newObj.poker1 = poker1;
             newObj.poker2 = poker2;
             newObj.id = users[i].id;
             pokers.push(newObj);
             users[i].pokers.push(poker1, poker2);
         }
         io.emit('start', pokers);
         io.emit('turn', users[0]);
    });
});
server.listen(4110);