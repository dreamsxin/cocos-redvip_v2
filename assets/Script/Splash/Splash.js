
var Message   = require("Message");
var HotUpdate = require("HotUpdate");

cc.Class({
	extends: cc.Component,
	properties: {
		HotUpdate: HotUpdate,
		messageLabel: cc.Label,
		retryGetDataButtonNode: cc.Node,
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
		this.loadConfig(),
		this.loadScene()
	},
	loadScene: function() {
		var t = this;
		cc.director.preloadScene("MainGame", function() {
			t.isLoadScene = !0,
			t.isLoadConfig && cc.director.loadScene("MainGame")
		})
	},
	loadConfig: function() {
		var i = this;
		i.isLoadConfig = !0,
		i.isLoadScene && cc.director.loadScene("MainGame");
		/**
		var e = this;
		this.messageLabel.string = Message.SPLASH_GET_GET_DATA;
		this.api.getConfig({}, function(t) {
			e.setGeneralConfig(t.data),
		}, function(t) {
			e.messageLabel.string = Message.SPLASH_GET_CONFIG_FAILED,
			e.retryGetDataButtonNode.active = !0
		})
		*/
	},
	onRetryGetDataClick: function() {
		//this.Audio.playClick(),
		this.retryGetDataButtonNode.active = !1,
		this.loadConfig()
	},
});
