
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
		dialog:   dialog,
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

		this.PhysicsManager = cc.director.getPhysicsManager();
		this.PhysicsManager.enabled = true;
		this.PhysicsManager.gravity = cc.v2();

		this.CollisionManager = cc.director.getCollisionManager();
		this.CollisionManager.enabled = true;

		this.dialog.init();
		this.room = {1:100,2:1000, 3:10000};
	},
	onRegGame: function(event){
		this.regGame = event.target.name;
		this.dialog.showNap();
	},
	onData: function(data) {
		if (void 0 !== data.fish){
			this.fishData(data.fish);
		}
		if (void 0 !== data.fishs){
			this.fishsData(data.fishs);
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
		if (void 0 !== data.other){
			this.dataOther(data.other);
		}
		if (void 0 !== data.me){
			this.dataMe(data.me);
		}

		if (void 0 !== data.otherEat){
			this.otherEat(data.otherEat);
		}
		if (void 0 !== data.meEat){
			this.meEat(data.meEat);
		}
		
		if (void 0 !== data.lock){
			this.fishLock(data.lock);
		}
		if (void 0 !== data.unlock){
			this.fishUnLock(data.unlock);
		}

		if (void 0 !== data.notice){
			this.notice.show(data.notice);
		}
	},
	otherEat: function(data){
		let fish = this.Game.fish[data.id];
		if (void 0 !== fish) {
			fish.PhaHuy(data);
			let player = this.players[data.map-1];
			let efcoint = this.Game.efcoint[fish.node.fish];
			let ef = Math.floor(Math.random()*(efcoint.max-efcoint.min+1))+efcoint.min;
			for (let i = 0; i < ef; i++) {
				var coint = cc.instantiate(this.Game.cointOther);
				coint = coint.getComponent('fish_EFcoint');
				coint.init(player, fish, efcoint);
			}
			var money = cc.instantiate(this.Game.labelOther);
			money = money.getComponent(cc.Label);
			money.string = helper.numberWithCommas(data.money);
			money.node.position = fish.node.position;
			this.Game.nodeLabel.addChild(money.node);
			// player.money = data.m;
			player.balans.string = helper.numberWithCommas(data.m);
			fish.node.runAction(cc.sequence(cc.delayTime(0.7), cc.spawn(cc.scaleTo(0.2, fish.node.scaleX*0.3, 0.3), cc.fadeTo(0.2, 50)), cc.callFunc(function(){
				this.onDelete();
			}, fish)));
		}
	},
	meEat: function(data){
		let fish = this.Game.fish[data.id];
		if (void 0 !== fish) {
			fish.PhaHuy(data);
			let efcoint = this.Game.efcoint[fish.node.fish];
			let ef = Math.floor(Math.random()*(efcoint.max-efcoint.min+1))+efcoint.min;
			for (let i = 0; i < ef; i++) {
				var coint = cc.instantiate(this.Game.cointMe);
				coint = coint.getComponent('fish_EFcoint');
				coint.init(this.Game.player, fish, efcoint);
			}
			var money = cc.instantiate(this.Game.labelMe);
			money = money.getComponent(cc.Label);
			money.string = helper.numberWithCommas(data.money);
			money.node.position = fish.node.position;
			this.Game.nodeLabel.addChild(money.node);
			this.Game.player.money = data.m;
			this.Game.player.balans.string = helper.numberWithCommas(data.m);
			fish.node.runAction(cc.sequence(cc.delayTime(0.7), cc.spawn(cc.scaleTo(0.2, fish.node.scaleX*0.3, 0.3), cc.fadeTo(0.2, 50)), cc.callFunc(function(){
				this.onDelete();
			}, fish)));
		}
	},
	fishData: function(data) {
		let fish = cc.instantiate(this.Game.fishPrefab[data.f-1]);
		fish = fish.getComponent('Fish_fish');
		fish.init(this.Game, data);
		this.Game.fish[data.id] = fish;
		this.Game.nodeFish.addChild(fish.node);
		//console.log('fish', data);
	},
	fishsData: function(data) {
		console.log(data);
	},
	otherBullet: function(data){
		this.players[data.map-1].otherBullet(data);
	},
	dataOther: function(data) {
		if (!!data.money) {
			let player = this.players[data.map-1];
			player.balans.string = helper.numberWithCommas(data.money);
		}
		if (!!data.updateType) {
			this.updateType(data.updateType);
		}
		if (!!data.bulllet) {
			this.otherBullet(data.bulllet);
		}
	},
	dataMe: function(data) {
		if (void 0 !== data.money) {
			this.Game.player.money = data.money;
			this.Game.player.balans.string = helper.numberWithCommas(data.money);
		}
		if (!!data.nap) {
			this.loading.active = false;
			this.dialog.onClickBack();
		}
	},
	updateType: function(data){
		this.players[data.map-1].onChangerTypeBet(data.type);
	},
	dataInfoGhe: function(data) {
		this.loading.active = false;
		this.dialog.onClickBack();
		this.players.forEach(function(obj, index){
			let dataT = data[index];
			if (void 0 === dataT || dataT.data === null) {
				obj.node.active = false;
			}else{
				if (this.MeMap === dataT.ghe) {
					this.Game.player = obj;
					obj.iconCoint.spriteFrame = this.cointMe;
					obj.nodeChangerbet.active = true;
					obj.isMe = true;
				}
				if (dataT.ghe === 1 || dataT.ghe === 2) {
					obj.sungFix = 1;
				}else{
					obj.sungFix = 2;
				}
				obj.node.active = true;
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
		let obj = this.players[data.ghe-1];
		obj.iconCoint.spriteFrame = this.cointOther;
		obj.node.active = true;
		obj.onInfo(data.data);
		if (data.ghe === 1 || data.ghe === 2) {
			obj.sungFix = 1;
		}else{
			obj.sungFix = 2;
		}
	},
	dataOutGame: function(data) {
		this.players[data-1].node.active = false;
	},
	backGame: function(){
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	fishLock: function(data){
		let fish = this.Game.fish[data.f];
		let player = this.players[data.map-1];
		if (void 0 !== fish) {
			fish['player'+data.map] = player;
			player.fish = fish;
			fish.updateGroup();
		}
	},
	fishUnLock: function(data){
		let player = this.players[data-1];
		if (!!player.fish) {
			player.fish.unLock(data);
		}
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
});
