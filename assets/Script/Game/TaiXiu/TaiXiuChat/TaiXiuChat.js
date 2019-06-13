
var helper      = require('Helper');
var BrowserUtil = require('BrowserUtil');

cc.Class({
	extends: cc.Component,
	properties: {
		content: {
			default: null,
			type: cc.ScrollView
		},
		item: {
			default: null,
			type: cc.Prefab
		},
		input: {
			default: null,
			type: cc.EditBox
		},
		layout: {
			default: null,
			type: cc.Layout
		},
	},
	init(obj){
		this.RedT = obj;
	},
	onLoad () {
		var self = this;
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onChatClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	addEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).addEventListener("keydown", this.keyHandle, !1);
	},
	removeEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).removeEventListener("keydown", this.keyHandle, !1);
	},
	message: function(data, tobot = false){
		var item = cc.instantiate(this.item)
		var itemComponent = item.getComponent(cc.Label);
		itemComponent.string = data.user + ': ' + data.value;
		var name = item.children[0].getComponent(cc.Label);
		name.string = data.user;
		this.content.content.addChild(item);
		if(tobot){
			this.layout.updateLayout();
			if(this.layout.node.height > 300 && this.layout.node.height-this.layout.node.position.y-134 < 70) {
				this.content.scrollToBottom(0.1);
			}
		}
	},
	logs: function(logs){
		if (logs.length) {
			var self = this;
			Promise.all(logs.map(function(message){
				self.message(message);
			}))
		}
	},
	onData: function(data){
		if (void 0 !== data.message) {
			this.message(data.message, true);
		}
		if (void 0 !== data.logs) {
			this.logs(data.logs);
		}
	},
	onChatClick: function() {
		if(helper.isEmpty(this.input.string)){
			this.RedT.onData({err: "Nhập nội dung để chat..."});
		}else{
			cc.RedT.send({taixiu:{chat: this.input.string}});
			this.onData({message:{user:cc.RedT.header.userName.string, value:this.input.string}});
			this.clean();
		}
	},
	toggle: function(){
		this.RedT.setTop();
		cc.RedT.audio.playClick();
		this.node.active = !this.node.active;
	},
	clean: function(){
		this.input.string = "";
	},
	reset: function(){
		this.content.content.destroyAllChildren();
		this.node.active = false;
	},
});
