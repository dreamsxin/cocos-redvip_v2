
let helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeFish:  cc.Node,
		nodeDan:   cc.Node,
		nodeTouch: cc.Node,
		nodeMenu:  cc.Node,

		PointFire: dragonBones.ArmatureDisplay,
		isAuto: false,
		isFire: false,
		setPoint: false,

		bulletVelocity: 2000,
		bulletSpeed:    100,
		red:            0,

		bullet: {
			default: [],
			type: cc.Prefab,
		},
	},
	init: function(obj){
		this.RedT     = obj;
		this.sungFixD = {1:{x:-1,y:1}, 2:{x:1,y:-1}};
		this.sungFix  = 1;
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
	},
	eventStart: function(e){
		this.isFire = true;
		this.angleSung(e.touch.getLocation(), true);
		this.setPoint = true;
	},
	eventMove: function(e){
		this.angleSung(e.touch.getLocation());
	},
	eventEnd: function(){
		this.isFire = false;
	},
	angleSung: function(ponit, ef = false){
		this.PointFire.node.position = this.node.convertToNodeSpaceAR(ponit);
		if (ef) {
			this.PointFire.playAnimation('newAnimation', 1);
			this.player.onFire(this.PointFire.node.position);
		}
		let positionUser = this.PointFire.node.parent.convertToWorldSpaceAR(this.PointFire.node.position);
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
	},
	betMinus: function(){
		this.player.typeBet--;
		if (this.player.typeBet<0) {
			this.player.typeBet = 5;
		}
		this.player.onChangerTypeBet(this.player.typeBet);
	},
});
