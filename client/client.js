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

        },
        //获取玩家ID
        getUid: function() {
            return new Date().getTime() + "" + Math.floor(Math.random() * 100);
        },
        //添加玩家
        addUser: function(id,o) {
            var user = document.getElementById(id);
            user.innerHTML = o.userName;
        },
        //修改玩家
        updateUser: function (o) {

        },
        //修改纸牌
        updatePokers: function (o) {

        },
        //初始化游戏
        init: function () {
            //将自己加入游戏
            this.addUser('down-name', this.userName);
            //监听新玩家加入游戏
            this.socket.on('login', function (o) {
                for(p in this.users) {
                    if (this.users[p] == 0) {
                        this.users[p] = 1;
                        this.addUser(p, o);
                        break;
                    }
                }
            });
            //监听玩家退出
            this.socket.on('logout', function (o) {
                this.updateUser(o);
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
            var game_start = document.getElementById('game-start');
            document.getElementById('game-deal').onclick = this.deal;
            document.getElementById('game-showdown').onclick = this.showdown;
            game_start.style.display = "block";
            game_start.onclick = this.start;
        },
        //创建游戏
        createSubmit: function () {
            var userName = document.getElementById('userName-create').value;
            if (userName != "") {
                document.getElementById('create').style.display = "none";
                document.getElementById('game').style.display = "block";
                this.userName = userName;
                this.userID = this.getUid();
                //连接后端服务器
                this.socket = io.connect('ws://192.168.199.128:4110');
                //通知服务器创建游戏
                this.socket.emit('create', {userID:this.userID, userName:this.userName});
                this.init();
            }
            return false;
        },
        //加入游戏
        loginSubmit: function () {
            var userName = document.getElementById('userName-login').value;
            if (userName != "") {
                document.getElementById('login').style.display = "none";
                document.getElementById('game').style.display = "block";
                this.userName = userName;
                this.userID = this.getUid();
                //连接后端服务器
                this.socket = io.connect('ws://192.168.199.128:4110');
                // 通知服务器加入游戏
                this.socket.emit('login', {userID:this.userID, userName:this.userName});
                this.init();
            }
            return false;
        }
    };

    //初始化,根据地址栏判断创建房间或加入房间.
    (function() {
        var height = (window.screen.availHeight - 72) + "px";
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
    })();
})();



