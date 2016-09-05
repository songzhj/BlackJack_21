/**
 * Created by songzhj on 2016/4/11.
 */
(function() {
    window.GAME = {
        userName: null,
        userID: null,
        roomID: null,
        socket: null,
        // users: {'left-name': 0, 'up-name': 0, 'right-name': 0},
        //发牌(继续要牌)
        deal: function () {
            GAME.socket.emit('deal', {userID:GAME.userID, roomID:GAME.roomID});
        },
        //亮牌
        showdown: function () {
            GAME.socket.emit('showdown', {userID:GAME.userID, roomID:GAME.roomID});
        },
        //开始游戏
        start: function () {
            GAME.socket.emit('start', GAME.userID);
            document.getElementById('game-start').style.display = 'none';
        },
        //开始游戏，发牌
        startGame: function (pokers) {
            var arr = ['down-name', 'left-name', 'up-name', 'right-name'];
            for (var i = 0; i < arr.length; ++i) {
                for (var j = 0; j < pokers.length; ++j) {
                    if (pokers[j].id == document.getElementById(arr[i]).getAttribute('data-id')) {
                        var poker1 = document.createElement('div');
                        var poker2 = document.createElement('div');
                        poker1.className = poker2.className = 'poker';
                        // poker1.setAttribute('data-num', pokers[j].poker1.num);
                        // poker2.setAttribute('data-num', pokers[j].poker2.num);
                        if(pokers[j].id == this.userID) {
                            poker1.style.backgroundImage = 'url("../images/poker/' + pokers[j].poker1.color + '/' + pokers[j].poker1.num + '.png")';
                        } else {
                            poker1.style.backgroundImage = 'url("../images/poker/back.jpg")';
                        }
                        poker2.style.backgroundImage = 'url("../images/poker/' + pokers[j].poker2.color + '/' + pokers[j].poker2.num + '.png")';
                        poker2.style.marginLeft = '30px';
                        var addPlace = document.querySelector('#' + arr[i].split('-')[0] + ' ' + '.pokers');
                        addPlace.appendChild(poker1);
                        addPlace.appendChild(poker2);
                        pokers.splice(j, 1);
                        break;
                    }
                }
            }
        },
        //获取玩家ID
        getID: function () {
            return (new Date()).getTime() + "" + Math.floor(Math.random() * 100);
        },
        //添加玩家
        addUser: function(id, user) {
            var userElement = document.getElementById(id);
            userElement.setAttribute('data-id', user.id);
            userElement.innerHTML = user.name;
        },
        //修改玩家
        updateUser: function (users) {
            var arr = ['down-name', 'left-name', 'up-name', 'right-name'];
            for (var i = 0; i < users.length; ++i) {
                for (var j = 0; j < arr.length; ++j) {
                    var temp = document.getElementById(arr[j]);
                    if (temp.getAttribute('data-id') == '') {
                        this.addUser(arr[j], users[i]);
                        break;
                    } else if (temp.getAttribute('data-id') == users[i].id) {
                        break;
                    }
                }
            }
        },
        //修改纸牌
        updatePokers: function (o) {
            var arr = ['down-name', 'left-name', 'up-name', 'right-name'];
            for (var i = 0; i < arr.length; ++i) {
                var temp = document.getElementById(arr[i]);
                if (temp != null && o.id == temp.getAttribute('data-id')) {
                    var addPlace = document.querySelector('#' + arr[i].split('-')[0] + ' ' + '.pokers');
                    var poker = document.createElement('div');
                    poker.className = 'poker';
                    // poker.setAttribute('data-num', o.poker.num);
                    poker.style.backgroundImage = 'url("../images/poker/' + o.poker.color + '/' + o.poker.num + '.png")';
                    poker.style.marginLeft = (30 * addPlace.childElementCount) + 'px';
                    addPlace.appendChild(poker);
                    break;
                }
            }
            document.getElementsByClassName('game-button')[0].style.display = 'none';
            var name = document.getElementsByClassName('name');
            for (var i = 0; i < name.length; ++i) {
                if (name[i].getAttribute('data-id') == o.id) {
                    name[i].style.color = 'white';
                }
            }
        },
        //初始化游戏
        init: function () {
            //将自己加入游戏
            this.addUser('down-name', {roomID:this.roomID, id:this.userID, name:this.userName});

            //监听新玩家加入游戏
            this.socket.on('login', function (users) {
                GAME.updateUser(users);
            });
            //监听玩家退出
            this.socket.on('logout', function (user) {
                GAME.updateUser(user);
            });
            //监听游戏开始
            this.socket.on('start', function (pokers) {
                GAME.startGame(pokers);
            });
            //监听要牌权限
            this.socket.on('turn', function (user) {
                if (user.id == GAME.userID) {
                    document.getElementsByClassName('game-button')[0].style.display = 'block';
                }
                var name = document.getElementsByClassName('name');
                for (var i = 0; i < name.length; ++i) {
                    if (name[i].getAttribute('data-id') == user.id) {
                        name[i].style.color = 'red';
                    }
                }
            });
            //监听发牌
            this.socket.on('deal', function (obj) {
                GAME.updatePokers(obj);
            });
            //监听亮牌
            this.socket.on('showdown', function (obj) {
                var arr = ['left-name', 'up-name', 'right-name'];
                for (var i = 0; i < arr.length; ++i) {
                    var temp = document.getElementById(arr[i]);
                    if (temp != null && obj.id == temp.getAttribute('data-id')) {
                        var addPlace = document.querySelector('#' + arr[i].split('-')[0] + ' ' + '.pokers');
                        addPlace.removeChild(addPlace.firstElementChild);
                        var poker = document.createElement('div');
                        poker.className = 'poker';
                        poker.style.backgroundImage = 'url("../images/poker/' + obj.poker.color + '/' + obj.poker.num + '.png")';
                        poker.style.marginLeft = (30 * addPlace.childElementCount + 50) + 'px';
                        addPlace.appendChild(poker);
                        break;
                    }
                }
                document.getElementsByClassName('game-button')[0].style.display = 'none';
                var name = document.getElementsByClassName('name');
                for (var i = 0; i < name.length; ++i) {
                    if (name[i].getAttribute('data-id') == obj.id) {
                        name[i].style.color = 'white';
                    }
                }
            });
            //监听游戏结束
            this.socket.on('end', function (o) {
                document.getElementsByClassName('game-button')[0].style.display = 'none';
                var pokers = document.getElementsByClassName('pokers');
                for (var i = 0; i < pokers.length; ++i) { //清空牌局
                    pokers[i].innerHTML = '';
                }
                if(o.winner == '平局') {
                    alert('存在相同的最高点数，不分胜负');
                } else {
                    alert(o.winner + "赢得本局");
                }
                if (GAME.userID == GAME.roomID) { //房主获得开始按钮
                    document.getElementById('game-start').style.display = 'block';
                }
            });
            //给按钮绑定事件
            document.getElementById('game-start').onclick = this.start;
            document.getElementById('game-deal').onclick = this.deal;
            document.getElementById('game-showdown').onclick = this.showdown;
        },
        //创建游戏
        createSubmit: function () {
            var userName = document.getElementById('userName-create').value;
            if (userName != "") {
                document.getElementById('create').style.display = "none";
                document.getElementById('game').style.display = "block";
                GAME.userName = userName;
                GAME.userID = GAME.getID();
                GAME.roomID = GAME.userID;
                //连接后端服务器
                // this.socket = io.connect('ws://192.168.199.128:4110');
                GAME.socket = io.connect('ws://localhost:4110');
                GAME.init();
                document.getElementById('game-start').style.display = 'block';
                //通知服务器创建游戏
                GAME.socket.emit('create', {userID:GAME.userID, userName:GAME.userName});
                // alert('复制链接邀请好友加入游戏：' + 'http://192.168.199.128/client/index.html?room=' + GAME.userID);
                alert('复制链接邀请好友加入游戏：' + 'http://localhost:63342/client/index.html?room=' + GAME.userID);
            }
            return false;
        },
        //加入游戏
        loginSubmit: function () {
            var userName = document.getElementById('userName-login').value;
            if (userName != "") {
                document.getElementById('login').style.display = "none";
                document.getElementById('game').style.display = "block";
                GAME.userName = userName;
                GAME.userID = GAME.getID();
                //连接后端服务器
                GAME.socket = io.connect('ws://localhost:4110');
                GAME.init();
                // 通知服务器加入游戏
                var roomID = location.search.substring(1).split('=')[1];
                GAME.roomID = roomID;
                GAME.socket.emit('login', {userID:GAME.userID, userName:GAME.userName, roomID:roomID});
            }
            return false;
        }
    };

    //初始化,根据地址栏判断创建房间或加入房间.
    (function() {
        var height = (window.screen.availHeight - 82) + "px";
        document.getElementById('create').style.height = height;
        document.getElementById('login').style.height = height;
        document.getElementById('game').style.height = height;
        if (location.search.length > 0) {
            document.getElementById('login').style.display = "block";
        } else {
            document.getElementById('create').style.display = "block";
        }
        document.getElementById('create-submit').onclick = GAME.createSubmit;
        document.getElementById('login-submit').onclick = GAME.loginSubmit;
        GAME.userName;
    })();
})();



