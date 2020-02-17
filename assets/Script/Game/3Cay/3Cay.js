
var helper   = require('Helper');
var	notice   = require('Notice');
var	mePlayer = require('3Cay_player');
var	cuoc     = require('3Cay_cuoc');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeSelectChuong:  cc.Node,
		labelSelectChuong: cc.Label,

		nodeSelectGa:  cc.Node,
		labelSelectGa: cc.Label,

		btn_lat:     cc.Node,

		nodeCard: cc.Node,
		gameRoom: cc.Label,
		gameStatus: cc.Label,
		labelTimeStart: cc.Label,
		mainBetGa: cc.Label,
		nodeBetGa: cc.Node,
		nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		noticeOut: cc.Node,
		notice:    notice,
		mePlayer: mePlayer,
		cuoc: cuoc,
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
			if (!!data.game) {
				this.game(data.game);
			}
			if (!!data.kick) {
				this.kick();
			}
			if (void 0 !== data.notice){
				this.notice.show(data.notice);
			}
		}
	},
	game: function(data){
		console.log(data);
		if (!!data.chia_bai) {
			this.gameStatus.string = '';
			this.nodeSelectChuong.active = false;
			this.nodeSelectGa.active     = false;
			this.ChiaBai(data.chia_bai);
		}
		if (!!data.truong) {
			Object.values(this.player).forEach(function(player){
				if (player.map == data.truong) {
					player.ic_dealer.active = true;
				}else{
					player.ic_dealer.active = false;
				}
			});
		}
		if (!!data.player) {
			let player = this.player[data.player.map];
			player.setInfo(data.player);
		}
		if (!!data.listPlayer) {
			data.listPlayer.forEach(function(player_data){
				let player = this.player[player_data.map];
				player.setInfo(player_data);
			}.bind(this));
		}
		if (data.btn_lat) {
			this.nodeSelectChuong.active = false;
			this.nodeSelectGa.active     = false;
			this.btn_lat.active          = true;
		}
		if (!!data.notice) {
			this.addNotice(data.notice);
		}
	},
	ChiaBai: function(data){
		let time = 0;
		for (let card = 0; card < 3; card++) {
			data.forEach(function(bai){
				this.player[bai.map].ChiaBai(bai, card, time);
				time += 0.05;
			}.bind(this));
		}
	},
	infoGhe: function(info){
		console.log(info);
		let player = {};
		let newGhe = [];
		if (this.meMap != 1) {
			let map = this.meMap-1;
			newGhe = newGhe.concat(info.slice(map), info.slice(0, map));
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
		console.log(data);
		if (data.game !== void 0) {
			this.gameRoom.string = helper.numberWithCommas(data.game);
			this.labelSelectGa.string = helper.numberWithCommas(data.game);
			this.cuoc.init(data.game);
		}
		if (data.betGa !== void 0) {
			this.nodeBetGa.active = true;
			this.mainBetGa.string = helper.numberWithCommas(data.betGa);
		}
		if (data.isStop !== void 0) {
			this.labelTimeStart.node.active = false;
			clearInterval(this.regTime1);
		}
		if (data.isPlay == true && data.time_start !== void 0) {
			this.resetGame();
			this.gameStatus.string = 'VÁN MỚI TRONG';
			this.time_start = data.time_start>>0;
			this.labelTimeStart.node.active = true;
			this.labelTimeStart.string = '';
			clearInterval(this.regTime1);
			this.regTime1 = setInterval(function(){
				this.labelTimeStart.string = helper.numberPad(this.time_start, 2);
				if (this.time_start < 0) {
					this.labelTimeStart.node.active = false;
					clearInterval(this.regTime1);
				}
				this.time_start--;
			}.bind(this), 1000);
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
		if (data.round !== void 0) {
			if (data.round == 0) {
				this.gameStatus.string = 'VÁN MỚI TRONG';
			}
			if (data.round == 1) {
				this.gameStatus.string = 'ĐẶT CƯỢC...';
			}
			if (data.time !== void 0) {
				clearInterval(this.regTime1);
				this.time_start = data.time>>0;
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
			}
		}
	},
	resetGame: function(){
		this.nodeBetGa.active = false;
		this.mainBetGa.string = '';
		this.gameStatus.string = '';
		this.btn_lat.active   = false;
		this.nodeSelectChuong.active = false;
		this.nodeSelectGa.active     = false;
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
	onCuocGaClick: function(){
		this.nodeSelectGa.active = false;
		cc.RedT.send({g:{bacay:{cuocG:true}}});
	},
	onClickLat: function(){
		this.btn_lat.active = false;
		cc.RedT.send({g:{bacay:{lat:true}}});
	},
	addNotice:function(text){
		let notice = cc.instantiate(this.prefabNotice)
		let noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.nodeNotice.addChild(notice);
	},
});
