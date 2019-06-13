
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		content: {
			default: null,
			type: cc.Node
		},
		body: {
			default: null,
			type: cc.Node
		},
		nodeRed: {
			default: null,
			type: cc.Node
		},
		nodeXu: {
			default: null,
			type: cc.Node
		},
		header: {
			default: null,
			type: cc.Node
		},
		panel: {
			default: null,
			type: cc.Node
		},
		red: false,
		bet: "",
	},

	onLoad () {
		this.ttOffset     = null;
		this.ttOffset2    = null;
		this.toggleRuning = false;
		Promise.all(this.content.children.map(function(obj){
			obj.hu = obj.children[2].getComponent(cc.Label);
		}));
		Promise.all(this.header.children.map(function(obj){
			return obj.children[0].getComponent(cc.Label);
		})).then(result => {
			this.header = result;
		})
		this.panel.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.panel.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.panel.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.panel.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.panel.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
		this.ttOffset2 = cc.v2(e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x), e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y))
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(e){
		this.xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x)
		this.yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y)
		if (this.xChanger <  5 &&
			this.xChanger > -5 &&
			this.yChanger <  5 &&
			this.yChanger > -5) {
			this.toggle()
		}
	},
	toggle: function(){
		cc.RedT.audio.playClick();
		if (!this.toggleRuning){
			this.toggleRuning = true;
			this.body.stopAllActions();
			if (this.body.active) {
				this.body.runAction(cc.sequence(cc.scaleTo(0.2, 0, 1), cc.callFunc(function(){
					this.toggleRuning = this.body.active = false;
				}, this)));
			}else{
				this.body.active = true;
				this.onChangerData();
				this.body.runAction(cc.sequence(cc.scaleTo(0.2, 1, 1), cc.callFunc(function(){
					this.toggleRuning = false;
				}, this)));
			}
		}
	},
	onChangerCoint: function(){
		this.red     = !this.red;
		this.nodeRed = !this.nodeRed;
		this.nodeXu  = !this.nodeXu;
		this.onChangerData();
	},
	onChangerBet: function(e, value){
		this.bet = value;
		Promise.all(this.header.map(function(obj){
			if (e.target !== obj.node.parent) {
				obj.font = cc.RedT.MiniPanel.TaiXiu.TX_Main.fontTru;
			}else{
				obj.font = cc.RedT.MiniPanel.TaiXiu.TX_Main.fontCong;
			}
		}));
		this.onChangerData();
	},
	onData: function(data){
		this.data = data;
		if (this.body.active) {
			this.onChangerData();
		}
	},
	onChangerData: function(){
		if (void 0 !== this.data) {
			var self = this;
			var dataName = [];
			Promise.all(this.content.children.map(function(obj){
				var name = obj.name;
				var T = self.data[name].filter(function(temp){
					return temp.type == self.bet && temp.red == self.red
				});
				dataName[name] = obj;
				T[0].name = name;
				return T[0];
			})).then(result => {
				var TT = result.sort(function(a, b){
					return b.bet - a.bet;
				});
				Promise.all(TT.map(function(obj, index){
					var temp = dataName[obj.name];
						temp.stopAllActions();
					var y = -(70*(index+1)-70/2);
						temp.runAction(cc.moveTo(0.2, cc.v2(0, y)));
					if (helper.getOnlyNumberInString(temp.hu.string) - obj.bet !== 0) {
						helper.numberTo(temp.hu, helper.getOnlyNumberInString(temp.hu.string), obj.bet, 3000, true);
					}
				}));
			})
		}
	},
	setTop: function(){
		this.node.parent.insertChild(this.node);
	},
});
