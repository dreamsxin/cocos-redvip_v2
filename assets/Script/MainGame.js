
var helper = require('Helper');

var audio  = require('MainAudio'),
	header = require('Header'),
	dialog = require('Dialog'),
	notice = require('Notice'),
	MiniPanel = require('MiniPanel');

cc.Class({
	extends: cc.Component,
	properties: {
		audio: audio,
		header: header,
		MiniPanel: MiniPanel,
		news: {
			default: null,
			type: cc.Node
		},
		dialog: dialog,
		game: {
			default: null,
			type: cc.Node
		},
		loading: {
			default: null,
			type: cc.Node
		},
		notice:      notice,
		IS_LOGIN:    false,
		IS_SOUND:    true,
		isConnected: false,
	},
	onLoad: function () {
		this._socket = null;
		cc.RedT      = this;
		this.user    = {};
		this.dialog.init();
		this.MiniPanel.init();

		this.dialog.settings.setMusic();
	},
	connect: function(url, path = '/', port = false, ss = false) {
		if (!this.isConnected) {
			this._socket           = new WebSocket("ws" + (ss ? "s" : "") + "://" + url + (!!port ? ":" + port : "") + path);
			this._socket.onopen    = this._onSocketConnect;
			this._socket.onclose   = this._onSocketDisconnect;
			this._socket.onmessage = this._onSocketData;
			this._socket.onerror   = this._onSocketError;
			this.isConnected       = !0;
		}
	},
	disconnect: function() {
		this.isConnected = !1;
		this._socket.close()
	},
	send: function(message) {
		this._socket.send(this._encodeMessage(message))
	},
	_decodeMessage: function(message) {
		return JSON.parse(message)
	},
	_encodeMessage: function(message) {
		return JSON.stringify(message)
	},
	_onSocketConnect: function() {
		cc.RedT.isConnected = true;
	},
	_onSocketDisconnect: function() {
		cc.RedT.isConnected = false;
		cc.RedT.IS_LOGIN && cc.RedT.signOut();
		//cc.RedT.notice.show({title: 'THÔNG BÁO', text:'Mất kết nối...'});
	},
	_onSocketData: function(message) {
		var data = message.data;
		data = cc.RedT._decodeMessage(data);
		cc.RedT.onData(data);
	},
	_onSocketError: function(message) {
		//cc.RedT.signOut();
		//cc.RedT.notice.show({title: 'THÔNG BÁO', text:'Mất kết nối...'});
		console.log(message)
	},
	reconnect: function(){
		this.connect('127.0.0.1', '/websocket');
		//this.connect('150.95.109.43', '/websocket');
	},
	auth: function(obj) {
		var self = this;
		this.loading.active = true;
		this.reconnect();
		if (this._socket == null || this._socket.readyState != 1) {
			setTimeout(function(){
				self.send(obj);
			}, 300);
		}else{
			this.send(obj)
		}
	},
	unAuthorized: function(data){
		this.loading.active = false;
		if (void 0 !== data["message"]) {
			this.notice.show({title: 'ĐĂNG KÝ', text: 'Có lỗi sảy ra, xin vui lòng thử lại...'});
		} else {
			this.notice.show(data);
		}
	},
	Authorized:function(Authorized){
		this.loading.active = false;
		if (!Authorized) {
			this.dialog.showSignName();
		}else{
			this.signIn();
		}
	},
	onData: function(data){
		console.log(data);
		if (void 0 !== data["unauth"]){
			this.unAuthorized(data["unauth"]);
		}
		if (void 0 !== data.Authorized){
			this.Authorized(data.Authorized);
		}
		if (void 0 !== data.user){
			this.dataUser(data.user);
		}
		if (void 0 !== data.mini){
			this.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			this.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			this.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
		if (void 0 !== data.shop){
			this.dialog.shop.onData(data.shop);
		}
		if (void 0 !== data.profile){
			this.dialog.profile.onData(data.profile);
		}
		if (void 0 !== data.notice){
			this.notice.show(data.notice);
		}
	},
	dataUser: function(data){
		if (void 0 !== data.name){
			this.header.userName.string = data.name;
			this.dialog.profile.CaNhan.username.string = data.name;
		}
		if (void 0 !== data.red){
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(data.red);
			this.user.red = data.red;
		}
		if (void 0 !== data.xu){
			this.header.userXu.string = helper.numberWithCommas(data.xu);
			this.user.xu = data.xu;
		}
		if (void 0 !== data.ketSat){
			this.dialog.profile.KetSat.redKet.string = helper.numberWithCommas(data.ketSat);
		}
		if (void 0 !== data.UID){
			this.dialog.profile.CaNhan.UID.string = data.UID;
		}
		if (void 0 !== data.phone){
			this.dialog.profile.CaNhan.phone.string = data.phone;
		}
		if (void 0 !== data.email){
			this.dialog.profile.CaNhan.email.string = data.email;
		}
		if (void 0 !== data.joinedOn){
			this.dialog.profile.CaNhan.joinedOn.string = helper.getStringDateByTime(data.joinedOn);
		}
	},
	signOut: function(){
		this.user     = {};
		this.IS_LOGIN = false;
		this.AllReset();
	},
	signIn:function(){
		this.IS_LOGIN = true;
		this.header.isSignIn();
		this.dialog.onBack();
		this.MiniPanel.signIn();
	},
	AllReset:function(){
		this.loading.active = false;
		this.header.isSignOut();
		this.dialog.onCloseDialog();
		this.MiniPanel.newGame();
	},
	errConnect: function(){
		this.notice.show({title: 'THÔNG BÁO', text:'Mất kết nối...'});
	},

	// Function localStorage
	setAutoLogin: function(bool){
		localStorage.setItem('AUTO_LOGIN', bool)
	},
	isAutoLogin: function(){
		var check = localStorage.getItem('AUTO_LOGIN');
		return check == "true"
	},
	setSoundGame: function(bool){
		localStorage.setItem('SOUND_GAME', bool)
	},
	isSoundGame: function(){
		var check = localStorage.getItem('SOUND_GAME');
		return check == "true"
	},
	setSoundBackground: function(bool){
		localStorage.setItem('SOUND_BACKGROUND', bool)
	},
	isSoundBackground: function(){
		var check = localStorage.getItem('SOUND_BACKGROUND');
		return check == "true"
	},
	// END Function localStorage

	/**
	checkLoginFacebook: function() {
		if (cc.sys.isBrowser && FB) {
			var self = this;
			self.loading.active = true;
			!isInitFB && FB && FB.init({
				appId: "1979927462336372",
				autoLogAppEvents: !0,
				xfbml: !0,
				cookie: !0,
				version: "v3.1"
			}),
			FB.getLoginStatus(function(t) {
				if ("connected" === t.status) {
					var e = t.authResponse.userID
					  , i = s.LOGIN_FACEBOOK_TYPE
					  , o = t.authResponse.accessToken;
					self.loginSocial(e, "", i, o)
				} else
					self.setAutoLogin(!1),
				self.loading.active = false;
			})
		}
	},
	loginFacebook: function() {
		//if (cc.sys.isBrowser && FB) {
		//if (FB) {
			var self = this;
			self.loading.active = true;
			FB && (FB.init({
				appId: "308158023154919",
				autoLogAppEvents: !0,
				xfbml: !0,
				cookie: !0,
				version: "v3.1"
			}),
			FB.login(function(t) {
				console.log(t)
				self.loading.active = false;
				if (t.authResponse) {
					var uid   = t.authResponse.userID
					  , type  = s.LOGIN_FACEBOOK_TYPE
					  , token = t.authResponse.accessToken;
					self.loginSocial(uid, "", type, token)
				} else
					self.setAutoLogin(!1),
			}))
		//}
	},
	loginSocial: function(e, i, o, n, t) {
		var s = this
		  , a = {
			social_id: e,
			email: i,
			social_type: o,
			access_token: n,
			register_code: this.getRegisterCode(),
			mkt_code: this.getMarketingCode(),
			device_id: this.getDeviceID(),
			fid: this.getFID()
		};
		t && (a.otp = t);
		this.api.registerSocial(a, function(t) {
			0 === t.data.login_status ? (s.OTPLogin.setLoginFacebook(e, i, o, n),
			s.OTPLogin.clear(),
			s.hideProcessingNode(),
			s.GameCenterUI.showOtpLoginFormNode()) : (s.setAutoLogin(!0),
			s.setAccountType(!0),
			s.initDataAndConnectSFS(t.data),
			s.GameCenterUI.hideOtpLoginFormNode(),
			t.data.user.is_new && c.addTrackCompleteRegistration())
		}, function(t) {
			s.setAutoLogin(!1),
			s.deProcessingNode(),
			s.showDialogMessage(r.LOGIN_TITLE, t.msg)
		})
	},
	*/
});
