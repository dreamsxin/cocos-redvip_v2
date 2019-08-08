
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
		_am: null,
		_updating: !1,
		_canRetry: !1,
		_storagePath: ""
	},
	init: function(t) {
		this.Splash = t;
	},
	onLoad: function() {
		cc.sys.isBrowser ? this.Splash.loadAssets() : (this.initHotUpdate(), this.checkUpdate())
	},
	onDestroy: function() {
		if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
	},
	initHotUpdate: function() {
		this.updateProgress(0);
		this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "redvip-remote-asset";
		this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
		this._am.setVerifyCallback(function(t, e) {
			e.compressed;
			return !0
		}
		.bind(this));
		cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
	},
	checkUpdate: function() {
		if (this._updating) {
            this.Splash.messageLabel.string = Message.HOT_UPDATE_CHECKING_VERSION;
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.Splash.messageLabel.string = Message.HOT_UPDATE_DOWNLOAD_MANIFEST_FAILED;
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
	},
	hotUpdate: function() {
		if (this._am && !this._updating) {
			this._am.setEventCallback(this.updateCb.bind(this));

			if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
				this._am.loadLocalManifest(this.manifestUrl.nativeUrl);
			}
			this._failCount = 0;
			this._am.update();
			this._updating = true;
		}
	},
	retry: function() {
		!this._updating && this._canRetry && (this.retryButtonNode.active = !1,
		this._canRetry = !1,
		this.Splash.messageLabel.string = Message.HOT_UPDATE_RETRY,
		this._am.downloadFailedAssets())
	},
	checkCb: function(t) {
		var e = !1
		  , i = !1;
		switch (console.log("Code: " + t.getEventCode()),
		t.getEventCode()) {
		case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_NOT_FOUND;
			break;
		case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
		case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_DOWNLOAD_MANIFEST_FAILED;
			break;
		case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
			this.updateProgress(838),
			this.Splash.messageLabel.string = Message.HOT_UPDATE_ALREADY_UP_TO_DATE,
			e = !0;
			break;
		case jsb.EventAssetsManager.NEW_VERSION_FOUND:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_FOUND_UPDATE,
			this.updateProgress(0);
			i = true;
			break;
		default:
			return
		}
		this._am.setEventCallback(null);
        this._checkListener = null;
		this._updating = !1,
		e && this.Splash.loadAssets(),
		i && (this.hotUpdate())
	},
	updateCb: function(t) {
		var e = !1
		  , i = !1;
		switch (t.getEventCode()) {
		case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_NOT_FOUND,
			i = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_PROGRESSION:
			var RedT = t.getPercent()*838;
			this.updateProgress(RedT);
			t.getMessage();
			this.Splash.messageLabel.string = Message.HOT_UPDATE_UPDATING;
			break;
		case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
		case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_DOWNLOAD_MANIFEST_FAILED,
			i = !0;
			break;
		case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
			this.updateProgress(838),
			this.Splash.messageLabel.string = Message.HOT_UPDATE_ALREADY_UP_TO_DATE,
			i = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_FINISHED:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_UPDATE_SUCCESS,
			e = !0;
			break;
		case jsb.EventAssetsManager.UPDATE_FAILED:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_UPDATE_FAILED,
			this.retryButtonNode.active = !0,
			this._updating = !1,
			this._canRetry = !0;
			break;
		case jsb.EventAssetsManager.ERROR_UPDATING:
			this.Splash.messageLabel.string = Message.HOT_UPDATE_UPDATE_FAILED;
			break;
		case jsb.EventAssetsManager.ERROR_DECOMPRESS:
			this.Splash.messageLabel.string = t.getMessage()
		}
		if (i && (this._am.setEventCallback(null),
		this._updateListener = null,
		this._updating = !1),
		e) {
			this._am.setEventCallback(null),
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
	},
	updateProgress: function(progress){
		this.updateProgressBar.width = progress;
		this.star.position           = cc.v2(progress, 0);
	},
});
