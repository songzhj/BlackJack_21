/**
 * Created by songzhj on 2016/4/11.
 */

var server = require('http').createServer(function (req, res) {
    res.write()
});
var io = require('socket.io')(server);

var rooms = {};

function Room(userID, userName) {
    this.id = userID;
    this.users = new Array();
    this.users[userID] = userName;
}



io.on('connection', function(socket){
    socket.on('create', function (obj) {
        var room = new Room(obj.userID, obj.userName);
        rooms[room.id] = room;
    });
});
server.listen(4110);