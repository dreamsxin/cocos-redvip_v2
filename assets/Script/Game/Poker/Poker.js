
var helper        = require('Helper'),
	notice        = require('Notice'),
	module_player = require('Poker_Player');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		notice:    notice,
		player: {
			default: [],
			type: module_player,
		},
		labelRoom: cc.Label,
		roomCard:  cc.Node,

		botton:   cc.Node,
		btm_bo:   cc.Node,
		btm_xem:  cc.Node,
		btm_theo: cc.Node,
		btm_to:   cc.Node,
		btm_all:  cc.Node,
	},

	onLoad () {
		cc.RedT.inGame = this;
		let MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.d = null;

		cc.RedT.audio.bg.pause();
		//cc.RedT.audio.bg = cc.RedT.audio.bgSlot1;

		//this.dialog.init();

		cc.RedT.send({scene:'poker', g:{poker:{ingame:true}}});

		/**
		if(cc.RedT.isSoundBackground()){
			this.playMusic();
		}
		*/
	},
	onData: function(data) {
		console.log(data);
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
		if (!!data.game) {  // có người ra khỏi phòng
			this.game(data.game);
		}
	},
	gameStart: function(data){
		data.forEach(function(player){
			this.player[player.ghe].setInfo(player.data);
		}.bind(this));
	},
	game: function(data){
		if (!!data.start) {
			this.gameStart(data.start);
		}
		if (!!data.chia_bai) {
			this.ChiaBai(data.chia_bai);
		}
		if (!!data.turn) {
			this.LuotChoi(data.turn);
		}
		if (!!data.player) {
			//trạng thái người chơi
		}
		if (!!data.card) {
			// thẻ bài trên bàn
			//this.mainCard(data.turn);
		}
	},
	LuotChoi:   function(data){
		let player = this.player[data.ghe];
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
		}
	},
	infoPlayer: function(data){

	},
	mainCard:   function(data){

	},
	ChiaBai:    function(data){
		data.forEach(function(bai){
			this.player[bai.id].ChiaBai(bai);
		}.bind(this));
	},
	infoGhe: function(info){
		let self = this;
		let player = {};
		let newGhe = [];
		if (this.meMap != 1) {
			let map = this.meMap-1;
			newGhe = [...info.slice(map), ...info.slice(0, map)];
		}else{
			newGhe = info;
		}
		newGhe.forEach(function(obj, index){
			let item = self.player[index];
			player[obj.ghe] = item;
			item.setInfo(obj.data);
			return void 0;
		});
		this.player = player;
		self   = null;
		player = null;
		newGhe = null;
	},
	infoRoom: function(data){
		if (data.game !== void 0) {
			this.labelRoom.string = helper.numberWithCommas(data.game);
		}
		if (data.d !== void 0) {
			if (this.d) {
				this.player[this.d].d.active = false;
			}
			this.player[data.d].d.active = true;
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
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
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
});
