/**
 * Created by songzhj on 2016/4/11.
 */
(function() {
    window.GAME = {
        userName: null,
        userID: null,
        socket: null,
        users: {'left-name': 0, 'top-name': 0, 'right-name': 0},
        //发牌(继续要牌)
        deal: function () {

        },
        //亮牌
        showdown: function (userName, poker) {

        },
        //开始游戏
        start: function () {
            GAME.emit('start', GAME.userID);
        },
        //开始游戏，发牌
        startGame: function (pokers) {
            var arr = ['left-name', 'top-name', 'right-name'];
            for (var i = 0; i < arr.length; ++i) {
                for (var j = 0; j < pokers.length; ++j) {
                    if (pokers[j].id == document.getElementById(arr[i]).getAttribute('data-id')) {
                        var num1 = pokers[j].poker1.num, num2 = pokers[j].poker2.num;
                        var color = pokers[j].poker2.color;
                        var poker1 = '<div class="poker" data-poker="' + num1 + 'style="background-image: url(\"../image/poker/back.jpg\")">';
                        var poker2 = '<div class="poker" data-poker="' + num2 + 'style="background-image: url(\"../image/poker/' + color + '/' + num + '\")">';
                        document.querySelector('#' + arr[i].split('-')[0] + ' ' + 'pokers').innerHTML = poker1 + poker2;
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
            var arr = ['left-name', 'top-name', 'right-name'];
            for (var i = 0, j = 0; i < users.length; ++i) {
                if (users[i].id != this.userID) {
                    this.addUser(arr[j++], users[i]);
                }
            }
        },
        //修改纸牌
        updatePokers: function (o) {

        },
        //初始化游戏
        init: function () {
            //将自己加入游戏
            this.addUser('down-name', {id:this.userID, name:this.userName});

            //监听新玩家加入游戏
            this.socket.on('login', function (users) {
                GAME.updateUser(users);
            });
            //监听玩家退出
            this.socket.on('logout', function (user) {
                this.updateUser(o);
            });
            //监听游戏开始
            this.socket.on('start', function (pokers) {
                this.startGame(pokers);
            });
            //监听发牌
            this.socket.on('deal', function (o) {
                this.updatePokers(o);
            });
            //监听亮牌
            this.socket.on('showdown', function (o) {
                this.showdown(o.userName, o.poker);
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
                //连接后端服务器
                // this.socket = io.connect('ws://192.168.199.128:4110');
                GAME.socket = io.connect('ws://localhost:4110');
                GAME.init();
                document.getElementById('game-start').style.display = 'block';
                //通知服务器创建游戏
                GAME.socket.emit('create', {userID:GAME.userID, userName:GAME.userName});
                // alert('复制链接邀请好友加入游戏：' + 'http://192.168.199.128/client/index.html?room=' + GAME.userID);
                alert('复制链接邀请好友加入游戏：' + 'http://localhost:63342/BlackJack_21/client/index.html?room=' + GAME.userID);
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
                GAME.socket.emit('login', {userID:GAME.userID, userName:GAME.userName, roomID:roomID});
            }
            return false;
        }
    };

    //初始化,根据地址栏判断创建房间或加入房间.
    (function() {
        var height = (window.screen.height - 72) + "px";
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



