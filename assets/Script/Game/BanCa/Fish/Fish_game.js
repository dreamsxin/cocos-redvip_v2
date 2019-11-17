
let helper = require('Helper');

let shubiao = require('Fish_shubiao');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeFish:  cc.Node,
		nodeDan:   cc.Node,
		nodeTouch: cc.Node,
		nodeMenu:  cc.Node,

		spriteAuto: cc.Sprite,
		spriteLock: cc.Sprite,
		nodeAuto:   cc.Node,
		nodeLock:   cc.Node,

		shubiao: shubiao,
		isAuto: false,
		isFire: false,
		isLock: false,
		setPoint: false,

		bulletVelocity: 2000,
		bulletSpeed:    100,
		red:            0,
		bulletID:       0,

		bullet: {
			default: [],
			type: cc.Prefab,
		},
		ef_bullet: {
			default: [],
			type: cc.Prefab,
		},
	},
	init: function(obj){
		this.RedT      = obj;
		this.sungFixD  = {1:{x:-1,y:1}, 2:{x:1,y:-1}};
		this.sungFix   = 1;
		this.meBulllet = {};
		this.fishLock  = null;
		this.shubiao.init(this);
	},
	onEnable: function() {
		this.nodeTouch.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.nodeTouch.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.nodeTouch.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.nodeTouch.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
	},
	onDisable: function() {
		this.nodeTouch.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.nodeTouch.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.nodeTouch.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.nodeTouch.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);

		this.nodeMenu.active = false;
		this.RedT.players.forEach(function(obj){
			obj.iconCoint.spriteFrame = this.RedT.cointOther;
			obj.nodeChangerbet.active = false;
			obj.isMe = false;
			obj.nodeSung.angle = 0;
			obj.nodeCanh.angle = 0;
		}.bind(this));

		this.nodeFish.removeAllChildren();
		this.nodeDan.removeAllChildren();
		this.setPoint = false;
		this.bulletID = 0;
		this.meBulllet = {};

		this.isAuto = false;
		this.isFire = false;
		this.isLock = false;
	},
	eventStart: function(e){
		this.isFire = true;
		this.angleSung(e.touch.getLocation(), true);
		this.setPoint = true;
		if (this.isLock) {
			this.shubiao.onLock();
		}
	},
	eventMove: function(e){
		this.angleSung(e.touch.getLocation());
	},
	eventEnd: function(){
		this.isFire = false;
	},
	angleSung: function(ponit, ef = false){
		this.shubiao.node.position = this.node.convertToNodeSpaceAR(ponit);
		if (ef) {
			this.shubiao.dragonBones.playAnimation('newAnimation', 1);
			this.player.onFire(this.shubiao.node.position);
		}
		let positionUser = this.shubiao.node.parent.convertToWorldSpaceAR(this.shubiao.node.position);
		let position1_1 = this.player.node.convertToNodeSpaceAR(positionUser);
		position1_1 = cc.misc.radiansToDegrees(Math.atan2(position1_1.x*this.sungFixD[this.sungFix].x, position1_1.y*this.sungFixD[this.sungFix].y));
		if(position1_1 > 90){
			position1_1 = 90;
		}
		if(position1_1 < -90){
			position1_1 = -90;
		}
		this.player.nodeSung.angle = position1_1;
		this.player.nodeCanh.angle = this.player.nodeSung.angle;
	},
	menuToggle: function() {
		this.nodeMenu.active = !this.nodeMenu.active;
	},
	onClickOutGame: function() {
		cc.RedT.send({g:{fish:{outgame:true}}});
		this.RedT.nodeHome.active = true;
		this.RedT.nodeGame.active = false;
	},
	betPlus: function(){
		this.player.typeBet++;
		if (this.player.typeBet>5) {
			this.player.typeBet = 0;
		}
		this.player.onChangerTypeBet(this.player.typeBet);
		this.sendChangerTypeBet(this.player.typeBet);
	},
	betMinus: function(){
		this.player.typeBet--;
		if (this.player.typeBet<0) {
			this.player.typeBet = 5;
		}
		this.player.onChangerTypeBet(this.player.typeBet);
		this.sendChangerTypeBet(this.player.typeBet);
	},
	sendChangerTypeBet:function(bet){
		cc.RedT.send({g:{fish:{typeBet:bet}}});
	},
	onClickAuto: function(){
		this.isAuto = !this.isAuto;
		this.isLock = false;
		this.spriteAuto.enable = !this.isAuto;
		this.nodeAuto.active   = this.isAuto;
		this.spriteLock.enable = true;
		this.nodeLock.active   = false;
		this.setPoint && this.player.onFire();
	},
	onClickLock: function(){
		this.isLock = !this.isLock;
		this.isAuto = false;
		this.spriteLock.enable = !this.isLock;
		this.nodeLock.active   = this.isLock;
		this.spriteAuto.enable = true;
		this.nodeAuto.active   = false;
	},
});
