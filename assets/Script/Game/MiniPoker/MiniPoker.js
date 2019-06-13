
var helper         = require('Helper'),
	MiniPoker_reel = require('MiniPoker_reel');

cc.Class({
	extends: cc.Component,

	properties: {
		background:     cc.Node,
		buttonSpin:     cc.Node,
		buttonAuto:     cc.Node,
		buttonSpeed:    cc.Node,
		buttonStop:     cc.Node,
		buttonAutoDot:  cc.Node,
		buttonSpeedDot: cc.Node,
		reels: {
			default: [],
			type: MiniPoker_reel,
		},
		buttonCoint: cc.Node,
		nodeRed: {
			default: null,
			type: cc.Node,
		},
		font: {
			default: null,
			type:    cc.BitmapFont
		},
		nodeXu: {
			default: null,
			type: cc.Node,
		},
		bet: {
			default: null,
			type: cc.Node,
		},
		notice: {
			default: null,
			type: cc.Node,
		},
		card:  cc.Prefab,
		cardf: cc.Prefab,
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		phien: cc.Label,
		hu:    cc.Label,
		cuoc:  "",
		isAuto:  false,
		isSpeed: false,
		isSpin:  false,
		red:     true,
	},
	init(obj){
		this.RedT = obj;
		this.Top    = obj.Dialog.MiniPoker_Top;
		this.LichSu = obj.Dialog.MiniPoker_LichSu;

	},
	onLoad () {
		var self = this;
		this.data     = null;
		this.ttOffset = null;
		this.card.data.getComponent('Card')
		.config()
		//this.card.config();

		Promise.all(this.reels.map(function(reel){
			reel.init(self);
		}))
	},
	onEnable: function() {
		this.onGetInfo();
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function() {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		this.onCloseGame();
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(){},
	openGame:function(){
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN)
			this.node.active = !0;
		else
			cc.RedT.dialog.showSignIn();
	},
	closeGame:function(){
		this.node.active = !1;
	},
	random: function(newG = false){
		Promise.all(this.reels.map(function(reel) {
			reel.random(newG)
		}))
	},
	autoSpin: function(){
		this.random();
		Promise.all(this.reels.map(function(reel, index) {
			reel.spin(index)
		}))
	},
	onSpin: function(){
		this.buttonSpin.pauseSystemEvents();
		this.buttonCoint.pauseSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
	    	bet.pauseSystemEvents();
	    }))
	},
	offSpin: function(){
		this.isSpin = false;
		this.buttonStop.active = this.isSpin ? (this.isAuto ? true : false) : false;
		this.buttonSpin.resumeSystemEvents();
		this.buttonCoint.resumeSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
			var oT = bet.children[0].active;
			if(!oT) bet.resumeSystemEvents();
    	}))
	},
	spin: function(event){
		if (!this.isSpin) {
			this.isSpin = true;
			this.onSpin();
			this.onGetSpin();
		}
	},
	onClickSpeed: function(){
		this.isSpeed               = !this.isSpeed;
		this.buttonSpeedDot.active = !this.buttonSpeedDot.active;
		this.buttonSpeed.color     = this.isSpeed ? cc.Color.WHITE : cc.color(206,206,206);
	},
	onClickAuto: function(){
		this.isAuto               = !this.isAuto;
		this.buttonAutoDot.active = !this.buttonAutoDot.active;
		this.buttonAuto.color     = this.isAuto ? cc.Color.WHITE : cc.color(206,206,206);
		this.buttonStop.active    = this.isSpin ? (this.isAuto ? true : false) : false;
	},
	onClickStop: function(){
        this.onClickAuto();
        this.buttonStop.active = false;
    },
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		this.onGetInfo();
	},
	changerBet: function(event, bet){
		this.cuoc = bet;
		var target = event.target;
		Promise.all(this.bet.children.map(function(obj){
			if (obj == target) {
				obj.children[0].active = true;
				obj.pauseSystemEvents();
			}else{
				obj.children[0].active = false;
				obj.resumeSystemEvents();
			}
		}))
		this.onGetInfo();
	},
	speed: function(){
		return this.isSpeed ? 2.5/2 : 2.5;
	},
	delay1: function(){
		return cc.delayTime(this.delayN1());
	},
	delay2: function(){
		return cc.delayTime(this.data.code >= 6 ? 1 : 0);
	},
	delayN1: function(){
		return this.data.code >= 6 ? 2.5 : 2;
	},
	getAction: function(){
		if (this.data.code >= 6) {
			//this.ef.active      = true;
			//helper.numberTo(this.efLabel.string, 0, this.data.win, 1500, true);
			var title = new cc.Node;
			title.addComponent(cc.Label);
			title = title.getComponent(cc.Label);
			title.string = this.data.text;
			title.font = this.font;
			title.lineHeight = 88;
			title.fontSize   = 18;
			title.node.y     = 14;
			this.notice.addChild(title.node);
			title.node.runAction(cc.sequence(this.delay1(), cc.callFunc(function(){this.node.destroy()}, title)));
		}else{
			this.addNotice(this.data.text);
		}
		var betWin = new cc.Node;
		betWin.addComponent(cc.Label);
		betWin = betWin.getComponent(cc.Label);
		betWin.string = '+' + helper.numberWithCommas(this.data.win);
		betWin.lineHeight = 130;
		betWin.fontSize   = 20;
		betWin.node.color = this.red ? cc.color(255,245,0,255) : cc.color(217,217,217,255);
		this.notice.addChild(betWin.node);
		betWin.node.runAction(cc.sequence(cc.moveTo(this.delayN1(), cc.v2(0, 130)), cc.callFunc(function(){this.node.destroy()}, betWin)));

		if (void 0 !== this.data.thuong && this.data.thuong > 0) {
			betWin.font = this.RedT.TaiXiu.TX_Main.fontTru;
			var betThuong = new cc.Node;
			betThuong.addComponent(cc.Label);
			betThuong = betThuong.getComponent(cc.Label);
			betThuong.string = '+' + helper.numberWithCommas(this.data.thuong);
			betThuong.font = this.RedT.TaiXiu.TX_Main.fontCong;
			betThuong.lineHeight = 130;
			betThuong.fontSize   = 20;
			betThuong.node.color    = cc.color(255,245,0,255);
			betThuong.node.position = cc.v2(0,-28);
			this.notice.addChild(betThuong.node);
			betThuong.node.runAction(cc.sequence(cc.moveTo(this.delayN1()-0.2, cc.v2(0, 135)), cc.callFunc(function(){this.node.destroy()}, betThuong)));
		}else{
			betWin.font = this.RedT.TaiXiu.TX_Main.fontCong;
		}
	},
	onData: function(data){
		var self = this;
		if (void 0 !== data.status) {
			if (data.status === 1) {
				this.buttonStop.active = this.isAuto ? true : false;
				Promise.all(data.card.map(function(card, index){
					self.reels[index].card[0].spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
				}));
				if(void 0 !== data.win){
					this.data = data;
				}else{
					this.data = null;
				}
				this.autoSpin();
			}else{
				this.offSpin();
			}
		}
		if (void 0 !== data.hu) {
			helper.numberTo(this.hu, helper.getOnlyNumberInString(this.hu.string), data.hu, 1700, true);
		}
		if (void 0 !== data.phien) {
			this.phien.string = "#" + data.phien;
		}
		if (void 0 !== data.log) {
			this.LichSu.onData(data.log);
		}
		if (void 0 !== data.top) {
			this.Top.onData(data.top);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text
		this.notice.addChild(notice)
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	onGetInfo: function(){
		cc.RedT.send({g:{mini_poker:{info:{cuoc:this.cuoc, red: this.red}}}});
	},
	onGetSpin: function(){
		cc.RedT.send({g:{mini_poker:{spin:{cuoc:this.cuoc, red: this.red}}}});
	},
	onCloseGame: function(){
    	this.isSpin = false;
    	Promise.all(this.reels.map(function(reel) {
			reel.stop();
		}));
		this.offSpin();
    },
});
