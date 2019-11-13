
var helper = require('Helper');
var notice = require('Notice');
var dialog = require('BanCa_dialog');

var Player = require('Fish_player');
var Game   = require('Fish_game');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeHome: cc.Node,
		nodeGame: cc.Node,
		nick:     cc.Label,
		balans:   cc.Label,
		loading:  cc.Node,
		notice:   notice,
		Game:     Game,
		players: {
			default: [],
			type: Player,
		},
		typeBet1: {
			default: [],
			type: cc.String,
		},
		typeBet2: {
			default: [],
			type: cc.String,
		},
		typeBet3: {
			default: [],
			type: cc.String,
		},

		anim_canh: {
			default: [],
			type: cc.String,
		},
		anim_sung: {
			default: [],
			type: cc.String,
		},
		cointMe:    cc.SpriteFrame,
		cointOther: cc.SpriteFrame,
	},
	onLoad () {
		cc.RedT.inGame = this;
		cc.RedT.send({scene:"bc"});

		this.nick.string   = cc.RedT.user.name;
		this.balans.string = helper.numberWithCommas(cc.RedT.user.red);
		this.players.forEach(function(obj){
			obj.init(this);
		}.bind(this));
		this.Game.init(this);
	},
	onRegGame: function(event){
		this.regGame = event.target.name;
		cc.RedT.send({g:{fish:{reg:{room:event.target.name, balans:10000}}}});
	},
	onData: function(data) {
		if (void 0 !== data.fish){
			this.fishData(data.fish);
		}
		if (void 0 !== data.meMap){
			this.MeMap = data.meMap;
			this.dataMeMap(data.meMap);
		}
		if (void 0 !== data.infoGhe){
			this.dataInfoGhe(data.infoGhe);
		}
		if (void 0 !== data.ingame){
			this.dataIngame(data.ingame);
		}
		if (void 0 !== data.outgame){
			this.dataOutGame(data.outgame);
		}

		if (void 0 !== data.notice){
			this.notice.show(data.notice);
		}
	},
	fishData: function(data) {
		console.log(data);
	},
	dataInfoGhe: function(data) {
		this.players.forEach(function(obj, index){
			let dataT = data[index];
			if (void 0 === dataT || dataT.data === null) {
				obj.node.active = false;
			}else{
				if (this.MeMap === dataT.ghe) {
					this.Game.player = obj;
					obj.iconCoint.spriteFrame = this.cointMe;
					obj.nodeChangerbet.active = true;
				}
				obj.node.active   = true;
				obj.onInfo(dataT.data);
			}
		}.bind(this));
	},
	dataMeMap: function(data) {
		if (data === 1 || data === 2) {
			this.Game.sungFix = 1;
		}else{
			this.Game.sungFix = 2;
		}
		this.nodeHome.active = false;
		this.nodeGame.active = true;
	},
	dataIngame: function(data) {
	},
	dataOutGame: function(data) {
	},
	backGame: function(){
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
});
