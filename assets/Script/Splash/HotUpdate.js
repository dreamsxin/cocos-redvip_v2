
var Message = require("Message");

cc.Class({
	extends: cc.Component,
	properties: {
		manifestUrl: {
			default: null,
			type: cc.Asset,
		},
		retryButtonNode:   cc.Node,
		updateProgressBar: cc.Node,
		star:              cc.Node,
		messageLabel:      cc.Label,
		_updating: !1,
		_canRetry: !1,
		_storagePath: ""
	},
	init: function(t) {
		this.Splash = t
	},
	onLoad: function() {
		cc.sys.isBrowser ? this.Splash.loadAssets() : (this.hideProgressBar(),
		this.initHotUpdate(),
		this.checkUpdate())
	},
	showProgressBar: function() {
		this.updateProgressBar.active = !0,
		this.messageLabel.node.active = !0
	},
	hideProgressBar: function() {
		this.updateProgressBar.active = !1,
		this.messageLabel.node.active = !1
	},
	onDestroy: function() {
		this._updateListener && (cc.eventManager.removeListener(this._updateListener),
		this._updateListener = null),
		this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && this._am.release()
	},
	initHotUpdate: function() {
		this.star.position = cc.v2(0,0),
		this.updateProgressBar.width = 0,
		this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "redvip-remote-asset",
		this._am = new jsb.AssetsManager("",this._storagePath,this.versionCompareHandle),
		cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || this._am.retain(),
		this._am.setVerifyCallback(function(t, e) {
			e.compressed;
			return !0
		}
		.bind(this)),
		cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2),
		this.updateProgressBar.width = 0,
		this.star.position = cc.v2(0,0)
	},
	checkUpdate: function() {
		console.log("HOTUPDATE checkUpdate"),
		this._updating ? this.messageLabel.string = Message.HOT_UPDATE_CHECKING_VERSION : (this._am.getState() === jsb.AssetsManager.State.UNINITED && (console.log("HOTUPDATE loadLocalManifest"),
		this._am.loadLocalManifest(this.manifestUrl)),
		this._checkListener = new jsb.EventListenerAssetsManager(this._am,this.checkCb.bind(this)),
		cc.eventManager.addListener(this._checkListener, 1),
		this._am.checkUpdate(),
		this._updating = !0)
	},
	hotUpdate: function() {
		this._am && !this._updating && (this._updateListener = new jsb.EventListenerAssetsManager(this._am,this.updateCb.bind(this)),
		cc.eventManager.addListener(this._updateListener, 1),
		this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl),
		this._failCount = 0,
		this._am.update(),
		this._updating = !0)
	},
	retry: function() {
		!this._updating && this._canRetry && (this.retryButtonNode.active = !1,
		this._canRetry = !1,
		this.messageLabel.string = Message.HOT_UPDATE_RETRY,
		this._am.downloadFailedAssets())
	},
	checkCb: function(t) {
		var e = !1
		  , i = !1;
		switch (console.log("Code: " + t.getEventCode()),
		t.getEventCode()) {
		case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
			this.messageLabel.string = Message.HOT_UPDATE_NOT_FOUND;
			break;
		case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
		case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
			this.messageLabel.string = Message.HOT_UPDATE_DOWNLOAD_MANIFEST_FAILED;
			break;
		case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
			this.updateProgressBar.width = 838,
			this.star.position = cc.v2(838,0),
			this.messageLabel.string = Message.HOT_UPDATE_ALREADY_UP_TO_DATE,
			e = !0;
			break;
		case jsb.EventAssetsManager.NEW_VERSION_FOUND:
			this.messageLabel.string = Message.HOT_UPDATE_FOUND_UPDATE,
			i = !(this.updateProgressBar.width = 0);
			this.star.position = cc.v2(0,0);
			break;
		default:
			return
		}
		cc.eventManager.removeListener(this._checkListener),
		this._checkListener = null,
		this._updating = !1,
		e && this.Splash.loadAssets(),
		i && (this.showProgressBar(),
		this.hotUpdate())
	},
	updateCb: function(t) {
		var e = !1
		  , i = !1;
		switch (t.getEventCode()) {
		case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
			this.messageLabel.string = Message.HOT_UPDATE_NOT_FOUND,
			i = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_PROGRESSION:
			var RedT = t.getPercent()*838;
			this.updateProgressBar.width = RedT;
			this.star.position = cc.v2(RedT,0);
			t.getMessage();
			this.messageLabel.string = Message.HOT_UPDATE_UPDATING;
			break;
		case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
		case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
			this.messageLabel.string = Message.HOT_UPDATE_DOWNLOAD_MANIFEST_FAILED,
			i = !0;
			break;
		case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
			this.updateProgressBar.width = 838,
			this.star.position = cc.v2(838,0),
			this.messageLabel.string = Message.HOT_UPDATE_ALREADY_UP_TO_DATE,
			i = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_FINISHED:
			this.messageLabel.string = Message.HOT_UPDATE_UPDATE_SUCCESS,
			e = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_FAILED:
			this.messageLabel.string = Message.HOT_UPDATE_UPDATE_FAILED,
			this.retryButtonNode.active = !0,
			this._updating = !1,
			this._canRetry = !0;
			break;
		case jsb.EventAssetsManager.ERROR_UPDATING:
			this.messageLabel.string = Message.HOT_UPDATE_UPDATE_FAILED;
			break;
		case jsb.EventAssetsManager.ERROR_DECOMPRESS:
			this.messageLabel.string = t.getMessage()
		}
		if (i && (cc.eventManager.removeListener(this._updateListener),
		this._updateListener = null,
		this._updating = !1),
		e) {
			cc.eventManager.removeListener(this._updateListener),
			this._updateListener = null;
			var o = jsb.fileUtils.getSearchPaths()
			  , n = this._am.getLocalManifest().getSearchPaths();
			console.log(JSON.stringify(n)),
			Array.prototype.unshift(o, n),
			cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(o)),
			jsb.fileUtils.setSearchPaths(o),
			cc.audioEngine.stopAll(),
			cc.game.restart()
		}
	},
	onRetryClick: function() {
		//this.Splash.Audio.playClick(),
		this.retry()
	},
	versionCompareHandle: function(t, e) {
		console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e),
		console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);
		for (var i = t.split("."), o = e.split("."), n = 0; n < i.length; ++n) {
			var s = parseInt(i[n])
			  , a = parseInt(o[n] || 0);
			if (s !== a)
				return s - a
		}
		return o.length > i.length ? -1 : 0
	}
});
