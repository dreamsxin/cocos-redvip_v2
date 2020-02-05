
var helper        = require('Helper'),
	notice        = require('Notice'),
	module_player = require('Poker_Player');

cc.Class({
	extends: cc.Component,

	properties: {
		font1: cc.BitmapFont,
		font2: cc.BitmapFont,
		nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		bo_bai:    cc.Node,
		notice:    notice,
		player: {
			default: [],
			type: module_player,
		},
		labelRoom:  cc.Label,
		mainBet:    cc.Label,
		labelTimeStart: cc.Label,
		roomCard:   cc.Node,
		prefabCard: cc.Node,

		botton:   cc.Node,
		btm_bo:   cc.Node,
		btm_xem:  cc.Node,
		btm_theo: cc.Node,
		btm_to:   cc.Node,
		btm_all:  cc.Node,

		nodeTo:   cc.Node,

		spriteAll:  cc.SpriteFrame,
		spriteHuy:  cc.SpriteFrame,
		spriteTheo: cc.SpriteFrame,
		spriteXem:  cc.SpriteFrame,
		spriteCuoc: cc.SpriteFrame,
		spriteWin:  cc.SpriteFrame,
		spriteMeWin:cc.SpriteFrame,
		spriteLost: cc.SpriteFrame,
		spriteHoa:  cc.SpriteFrame,
	},
	onLoad(){
		cc.RedT.inGame = this;
		let MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.game_player = null;
		this.game_d      = null;

		cc.RedT.audio.bg.pause();
		//cc.RedT.audio.bg = cc.RedT.audio.bgSlot1;

		//this.dialog.init();
		this.player.forEach(function(player){
			player.init();
		});
		cc.RedT.send({scene:'poker', g:{poker:{ingame:true}}});

		/**
		if(cc.RedT.isSoundBackground()){
			this.playMusic();
		}
		*/
	},
	onData: function(data) {
		if (!!data.meMap) {
			this.meMap = data.meMap;
		}
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
		if (!!data.infoGhe) {  // thông tin các ghế
			console.log(data.infoGhe);
			this.infoGhe(data.infoGhe);
		}
		if (!!data.infoRoom) { // thông tin phòng
			console.log(data.infoRoom);
			this.infoRoom(data.infoRoom);
		}
		if (!!data.ingame) {  // có người vào phòng
			console.log(data.ingame);
			this.ingame(data.ingame);
		}
		if (!!data.outgame) {  // có người ra khỏi phòng
			console.log(data.outgame);
			this.outgame(data.outgame);
		}
		if (!!data.game) {
			console.log(data.game);
			this.game(data.game);
		}
	},
	gameStart: function(data){
		data.forEach(function(player){
			this.player[player.ghe].setInfo(player.data);
		}.bind(this));
	},
	gamePlayer: function(data){
		let player = this.player[data.ghe];
		if (data.data !== void 0) {
			player.setInfo(data.data);
		}
		if (data.info !== void 0) {
			player.infoGame(data.info);
		}
	},
	resetGame: function(){
		this.mainBet.string = '';
		this.roomCard.destroyAllChildren();
		this.nodeNotice.destroyAllChildren();
		Object.values(this.player).forEach(function(player){
			player.resetGame();
		});
	},
	gameInfo: function(data){
		data.forEach(function(player){
			let obj = this.player[player.ghe];
			if (player.data !== void 0) {
				obj.setInfo(player.data);
			}
			if (player.info !== void 0) {
				obj.infoGame(player.info);
			}
		}.bind(this));
	},
	gameStop: function(){
		this.offSelect();
	},
	gameFinish: function(){
		this.offSelect();
	},
	offSelect: function(){
		if (!!this.game_player) {
			this.game_player.isUpdate = false;
			this.game_player.progressTime = 0;
			this.game_player.Progress.progress = 0;
		}
		this.botton.active = false;
		this.nodeTo.active = false;
	},
	game: function(data){
		if (!!data.start) {
			this.gameStart(data.start);
		}
		if (!!data.stop) {
			this.gameStop();
		}
		if (!!data.finish) {
			this.gameFinish();
		}
		if (!!data.chia_bai) {
			this.ChiaBai(data.chia_bai);
		}
		if (!!data.turn) {
			this.LuotChoi(data.turn);
		}
		if (!!data.info) {
			this.gameInfo(data.info);
		}
		if (!!data.player) {
			this.gamePlayer(data.player);
		}
		if (!!data.offD) {
		}
		if (data.offSelect !== void 0) {
			this.offSelect();
		}
		if (!!data.card) {
			// thẻ bài trên bàn
			this.mainCard(data.card);
		}
	},
	LuotChoi: function(data){
		let player = this.player[data.ghe];
		if (!!this.game_player) {
			this.game_player.isUpdate = false;
			this.game_player.progressTime = 0;
			this.game_player.Progress.progress = 0;
		}
		this.game_player = player;
		player.startProgress(data.progress);
		if (data.select !== void 0) {
			this.botton.active = true;
			if (data.select.xem) {
				this.btm_xem.active = true;
			}else{
				this.btm_xem.active = false;
			}
			if (data.select.theo) {
				this.btm_theo.active = true;
			}else{
				this.btm_theo.active = false;
			}
			if (data.select.to) {
				this.btm_to.active = true;
			}else{
				this.btm_to.active = false;
			}
			if (data.select.all) {
				this.btm_all.active = true;
			}else{
				this.btm_all.active = false;
			}
		}else{
			this.botton.active = false;
			this.nodeTo.active = false;
		}
	},
	infoPlayer: function(data){

	},
	mainCard: function(data){
		let time = 0.1;
		let position = this.bo_bai.parent.convertToWorldSpaceAR(this.bo_bai.position);
		data.forEach(function(card){
			let node = cc.instantiate(this.prefabCard);
			this.roomCard.addChild(node);
			let component = node.children[0].getComponent(cc.Sprite);
			node = null;
			component.node.runAction(
				cc.sequence(
					cc.delayTime(time),
					cc.callFunc(function(){
						component.node.position = component.node.parent.convertToNodeSpaceAR(position);
						component.node.scaleX = this.bo_bai.width/component.node.width;
						component.node.scaleY = this.bo_bai.height/component.node.height;
						component.spriteFrame = cc.RedT.util.card.cardB1;
					}, this),
					cc.spawn(cc.moveTo(0.1, cc.v2(0,0)), cc.scaleTo(0.1, 1)),
					cc.delayTime(0.1),
					cc.scaleTo(0.1, 0, 1),
					cc.callFunc(function(){
						component.spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
						component = null;
					}, this),
					cc.scaleTo(0.1, 1, 1)
				)
			);
			time += 0.1;
		}.bind(this));
	},
	ChiaBai: function(data){
		let time = 0;
		for (let card = 0; card < 2; card++) {
			data.forEach(function(bai){
				this.player[bai.id].ChiaBai(bai, card, time);
				time += 0.05;
			}.bind(this));
		}
	},
	infoGhe: function(info){
		let player = {};
		let newGhe = [];
		if (this.meMap != 1) {
			let map = this.meMap-1;
			newGhe = [...info.slice(map), ...info.slice(0, map)];
		}else{
			newGhe = info;
		}
		newGhe.forEach(function(obj, index){
			let item = this.player[index];
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
			this.labelRoom.string = helper.numberWithCommas(data.game);
		}
		if (data.bet !== void 0) {
			this.mainBet.string = helper.numberWithCommas(data.bet);
		}
		if (data.isStop !== void 0) {
			this.labelTimeStart.node.active = false;
			clearInterval(this.regTime1);
		}
		if (data.isPlay !== void 0) {
			if (data.isPlay == true && data.time_start !== void 0) {
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
			}
		}
	},
	ingame: function(data){
		this.player[data.ghe].setInfo(data.data);
	},
	outgame: function(data){
		this.player[data].setInfo(null);
	},
	backGame: function(){
		cc.RedT.send({g:{poker:{outgame:true}}});
		this.loading.active = true;
		//!!this.timeOut && clearTimeout(this.timeOut);
		!!this.regTime1 && clearInterval(this.regTime1);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	onSelect: function(event, select){
		cc.RedT.send({g:{poker:{select:select}}});
	},
	toggleTo: function(){
		this.nodeTo.active = !this.nodeTo.active;
	},
});
