
var helper   = require('Helper');
var	notice   = require('Notice');
var	mePlayer = require('3Cay_player');

cc.Class({
    extends: cc.Component,

    properties: {
    	gameRoom: cc.Label,
    	labelTimeStart: cc.Label,
    	nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		noticeOut: cc.Node,
		notice:    notice,
		mePlayer: mePlayer,
		player: {
			default: [],
			type: mePlayer,
		},
		panel: false,
		dataOn: true,
    },
    onLoad(){
    	cc.RedT.inGame = this;
		cc.RedT.MiniPanel.node.parent = this.redhat;

		this.mePlayer.nickname.string = cc.RedT.user.name;
		this.mePlayer.balans.string = helper.numberWithCommas(cc.RedT.user.red);
		this.mePlayer.setAvatar(cc.RedT.user.avatar);

		this.player.forEach(function(player){
			player.init();
		});

		cc.RedT.send({scene:'bacay', g:{bacay:{ingame:true}}});
    },
    onData: function(data) {
    	console.log(data);
		if (!!data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (!!data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (!!data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
		if (void 0 !== data.vipp) {
			cc.RedT.MiniPanel.Dialog.VipPoint.onData(data.vipp);
		}
		if (void 0 !== data.user){
			cc.RedT.userData(data.user);
		}
		if (this.dataOn) {
			if (!!data.meMap) {
				this.meMap = data.meMap;
			}
			if (!!data.infoGhe) {  // thông tin các ghế
				this.infoGhe(data.infoGhe);
			}
			if (!!data.infoRoom) { // thông tin phòng
				this.infoRoom(data.infoRoom);
			}
			if (!!data.ingame) {  // có người vào phòng
				this.ingame(data.ingame);
			}
			if (!!data.outgame) {  // có người ra khỏi phòng
				this.outgame(data.outgame);
			}
			if (!!data.kick) {
				this.kick();
			}
			if (void 0 !== data.notice){
				this.notice.show(data.notice);
			}
		}
	},
	infoGhe: function(info){
		let player = {};
		let newGhe = [];
		if (this.meMap != 1) {
			let map = this.meMap-1;
			newGhe = newGhe.concat(info.slice(map),info.slice(0, map));
		}else{
			newGhe = info;
		}
		newGhe.forEach(function(obj, index){
			let item = this.player[index];
			item.map = obj.ghe;
			player[obj.ghe] = item;
			item.setInfo(obj.data);
			return void 0;
		}.bind(this));
		this.player = player;
		player = null;
		newGhe = null;
	},
	infoRoom: function(data){
		if (data.game !== void 0) {
			this.gameRoom.string = helper.numberWithCommas(data.game);
		}
		if (data.betGa !== void 0) {
			//this.mainBetGa.string = helper.numberWithCommas(data.bet);
		}
		if (data.isStop !== void 0) {
			//this.labelTimeStart.node.active = false;
			clearInterval(this.regTime1);
		}
		if (data.isPlay == true && data.time_start !== void 0) {
			/**
			this.resetGame();
			this.time_start = data.time_start>>0;
			this.labelTimeStart.node.active = true;
			this.labelTimeStart.string = '';
			this.regTime1 = setInterval(function(){
				this.labelTimeStart.string = helper.numberPad(this.time_start, 2);
				if (this.time_start < 0) {
					this.labelTimeStart.node.active = false;
					clearInterval(this.regTime1);
				}
				this.time_start--;
			}.bind(this), 1000);
			*/
		}
		if (data.first !== void 0) {
			/*
			data.first.forEach(function(player){
				let get_player = this.player[player.id];
				get_player.noticeBet(player.bet, '', 2, 22, this.font1);
				get_player.bet.string = helper.numberWithCommas(player.bet);
			}.bind(this));
			*/
		}
		if (data.card !== void 0) {
			data.card.forEach(function(obj){
				let player = this.player[obj.ghe];
				if (this.mePlayer !== player) {
					player.item.forEach(function(item){
						item.node.active = true;
						item.spriteFrame = cc.RedT.util.card.cardB1;
					});
				}
			}.bind(this));
		}
	},
	ingame: function(data){
		this.player[data.ghe].setInfo(data.data);
	},
	outgame: function(data){
		this.player[data].setInfo(null);
	},
	kick: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		this.loading.active = true;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame');
	},
	backGame: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		cc.RedT.send({g:{bacay:{outgame:true}}});
		this.loading.active = true;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	toggleNoticeOut: function(){
		this.noticeOut.active = !this.noticeOut.active;
	},
    // update (dt) {},
});
