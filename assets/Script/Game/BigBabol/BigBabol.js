
var helper = require('Helper');
var reel   = require('BigBabol_reel'),
	line   = require('BigBabol_line');

cc.Class({
	extends: cc.Component,

	properties: {
		background: cc.Node,
		line: line,
		labelLine: cc.Label,
		reels: {
			default: [],
			type: reel,
		},
		icons: {
			default: [],
			type: cc.SpriteFrame,
		},
		iconPrefab: {
			default: null,
			type: cc.Prefab,
		},
		buttonLine:  cc.Node,
		buttonSpin:  cc.Node,
		buttonAuto:  cc.Node,
		buttonStop:  cc.Node,
		buttonCoint: cc.Node,
		nodeRed: {
			default: null,
			type: cc.Node,
		},
		nodeXu: {
			default: null,
			type: cc.Node,
		},
		font: {
			default: null,
			type:    cc.BitmapFont
		},
		bet: {
			default: null,
			type: cc.Node,
		},
		notice: {
			default: null,
			type: cc.Node,
		},
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		phien: cc.Label,
		hu:    cc.Label,
		cuoc:     "",
		onColor:  "",
		offColor: "",
		isAuto:  false,
		isSpeed: false,
		isSpin:  false,
		red:     true,
	},
	init(obj){
		this.RedT = obj;
	},
	onLoad () {
		var self = this;
		this.ttOffset = null;
		this.line.init(this);

		Promise.all(this.reels.map(function(reel) {
			reel.init(self);
		}))
	},
	onEnable: function() {
		//this.onGetInfo();
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
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	autoSpin: function(){
		Promise.all(this.reels.map(function(reel, index) {
			reel.spin(index);
		}))
	},
	onSpin: function(){
		this.buttonLine.pauseSystemEvents();
		this.buttonSpin.pauseSystemEvents();
		this.buttonCoint.pauseSystemEvents();
		this.line.node.active = false;
		Promise.all(this.bet.children.map(function(bet){
			bet.pauseSystemEvents();
		}))
	},
	offSpin: function(){
		this.isSpin = this.buttonStop.active = false;
		this.buttonLine.resumeSystemEvents();
		this.buttonSpin.resumeSystemEvents();
		this.buttonCoint.resumeSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
			if(!bet.children[0].active) bet.resumeSystemEvents();
		}))
	},
	onClickSpin: function(){
		if (this.line.data.length < 1) {
			this.addNotice('Chọn ít nhất 1 dòng');
		}else{
			if (!this.isSpin) {
				this.isSpin = true;
				this.onSpin();
				this.onGetSpin();
			}
		}
	},
	onClickAuto: function(){
		this.isAuto            = !this.isAuto;
		this.buttonAuto.color  = this.isAuto ? cc.Color.WHITE : cc.color(155,155,155);
		this.buttonStop.active = this.isSpin ? (this.isAuto ? true : false) : false;
		this.buttonAuto.active = !this.buttonStop.active;
	},
	onClickStop: function(){
		this.onClickAuto();
		this.buttonStop.active = false;
	},
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		//this.onGetInfo();
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
		//this.onGetInfo();
	},
	onGetInfo: function(){
		cc.RedT.send({g:{big_babol:{info:{cuoc:this.cuoc, red: this.red}}}});
	},
	onGetSpin: function(){
		cc.RedT.send({g:{big_babol:{spin:{cuoc:this.cuoc, red: this.red, line: this.line.data}}}});
	},
	onCloseGame: function(){
		this.isSpin = false;
		Promise.all(this.reels.map(function(reel) {
			reel.stop();
		}));
		this.offSpin();
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.notice.addChild(notice);
	},
	onData:function(data){
		var self = this;
		if (void 0 !== data.status) {
			if (data.status === 1) {
				this.win = data.win;
				this.buttonStop.active = this.isAuto ? true : false;
				this.buttonAuto.active = !this.buttonStop.active;
				Promise.all(data.cel.map(function(cel, cel_index){
					Promise.all(cel.map(function(icon, index){
						self.reels[cel_index].icons[index].setIcon(icon, true);
					}));
				}));
				this.autoSpin();
			}else{
				this.offSpin();
			}
		}
		if (void 0 !== data.hu) {
			helper.numberTo(this.hu, helper.getOnlyNumberInString(this.hu.string), data.hu, 2000, true);
		}
		if (void 0 !== data.phien) {
			this.phien.string = data.phien;
		}
		if (void 0 !== data.log) {
			this.RedT.Dialog.BigBabol_LichSu.onData(data.log);
		}
		if (void 0 !== data.top) {
			this.RedT.Dialog.BigBabol_Top.onData(data.top);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	copy: function(){
		Promise.all(this.reels.map(function(reel){
			reel.icons[25].setIcon(reel.icons[2].data);
			reel.icons[24].setIcon(reel.icons[1].data);
			reel.icons[23].setIcon(reel.icons[0].data);
			//reel.node.y = 0;
		}));
	},
	delay1: function(){
		if (!!this.win) {
			if (void 0 !== this.noHu && this.noHu == true) {
				return cc.delayTime(3);
			}else{
				return cc.delayTime(1.5);
			}
		}else
			return cc.delayTime(0.3);
	},
	hieuUng: function(){
		if (void 0 !== this.win && this.win > 0) {
			this.congTien(this.win)
		}
	},
	congTien: function(tien){
		var node = new cc.Node;
			node.addComponent(cc.Label);
			node = node.getComponent(cc.Label);
			helper.numberTo(node, 0, tien, 800, true);
			node.font = this.red ? this.RedT.TaiXiu.TX_Main.fontCong : this.RedT.TaiXiu.TX_Main.fontTru;
			node.lineHeight = 80;
			node.fontSize   = 25;
			node.node.position = cc.v2(-6,166);
			node.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
            	this.node.destroy();
        	}, node)));

			this.notice.addChild(node.node);
	},
	random: function(){
		Promise.all(this.reels.map(function(reel){
			Promise.all(reel.icons.map(function(icon, index){
				if (index > 2 && index < 23) {
	            	icon.random();
	            }
			}));
		}));
	},
});
