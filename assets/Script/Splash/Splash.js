
var Message   = require("Message");
var HotUpdate = require("HotUpdate");

cc.Class({
	extends: cc.Component,
	properties: {
		HotUpdate: HotUpdate,
		messageLabel: cc.Label,
	},
	onLoad: function() {
		this.isLoadScene  = !1,
		this.isLoadConfig = !1,
		this.HotUpdate.init(this),
		this.initOneSign()
	},
	initOneSign: function() {
		this.checkPlugin() && (sdkbox.PluginOneSignal.init(),
		sdkbox.PluginOneSignal.setListener({
			onSendTag: function(t, e, i) {},
			onGetTags: function(t) {},
			onIdsAvailable: function(t, e) {},
			onPostNotification: function(t, e) {},
			onNotification: function(t, e, i) {}
		}))
	},
	checkPlugin: function() {
		return "undefined" == typeof sdkbox ? (console.log("sdkbox is undefined"),
		!1) : void 0 !== sdkbox.PluginOneSignal || (console.log("sdkbox.PluginFacebook is undefined"),
		!1)
	},
	loadAssets: function() {
		this.HotUpdate.updateProgress(0);
		this.messageLabel.string = Message.SPLASH_GET_GET_DATA;
		setTimeout(function(){
			this.loadScene();
		}.bind(this), 100);
	},
	loadScene: function() {
		cc.director.preloadScene("MainGame", this.onProgress.bind(this), this.onLoaded.bind(this));
	},
	onProgress: function(completedCount, totalCount){
		// đang tải cảnh
		var RedT = ((completedCount/totalCount)*838)>>0;
		this.HotUpdate.updateProgress(RedT);
	},
	onLoaded: function(err, asset){
		// Tải cảnh thành công
		cc.director.loadScene("MainGame");
	},
});
