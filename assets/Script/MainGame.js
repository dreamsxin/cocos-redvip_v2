
var helper = require('Helper');

var baseControll = require('BaseControll');

var header      = require('Header'),
	dialog      = require('Dialog'),
	newsContents = require('NewsContents'),
	notice      = require('Notice');

cc.Class({
	extends: cc.Component,
	properties: {
		PrefabT: {
			default: [],
			type: cc.Prefab
		},
		header: header,
		font:   cc.TTFFont,
		news: {
			default: null,
			type: cc.Node
		},
		newsContents: newsContents,
		iconVQRed: {
			default: null,
			type: cc.Node
		},
		iconTaiXiu: {
			default: null,
			type: cc.Node
		},
		redhat: {
			default: null,
			type: cc.Node
		},
		dialog: dialog,
		loading: {
			default: null,
			type: cc.Node
		},
		notice:      notice,
	},
	onLoad: function () {
		if (void 0 === cc.RedT) {
			cc.RedT = baseControll;
			cc.RedT.audio = this.PrefabT[0].data.getComponent('MainAudio');
		}
		// Connect Server
		//cc.RedT.reconnect();

		this.dialog.init();
		this.newsContents.init(this);
		this.dialog.settings.setMusic();
		cc.RedT.inGame = this;

		var MiniPanel = cc.instantiate(this.PrefabT[1]);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.iconVQRed  = this.iconVQRed.getComponent('iconGameHu');
		this.iconTaiXiu = this.iconTaiXiu.getComponent('iconGameTaiXiu');

		if (cc.RedT.IS_LOGIN){
			cc.RedT.send({scene:"home"});
		}
	},
	auth: function(obj) {
		var self = this;
		this.loading.active = true;
		//cc.RedT.reconnect();
		if (cc.RedT._socket == null || cc.RedT._socket.readyState != 1) {
			setTimeout(function(){
				cc.RedT.send(obj);
			}, 300);
		}else{
			cc.RedT.send(obj)
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
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
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
		if (void 0 !== data.news){
			this.newsF(data.news)
		}
		if (void 0 !== data.captcha) {
			this.captcha(data.captcha);
		}
	},
	captcha: function(data){
		if (void 0 !== data.signUp) {
			this.dialog.signUp.initCaptcha(data.signUp);
		}
		if (void 0 !== data.giftcode) {
			this.dialog.GiftCode.initCaptcha(data.giftcode);
		}
	},
	newsF: function(data){
		if (void 0 !== data.a)
			this.NewsAddArray(data.a)

		if (void 0 !== data.t)
			this.NewsAddText(data.t)
	},
	dataUser: function(data){
		if (void 0 !== data.name){
			this.header.userName.string = data.name;
			this.dialog.profile.CaNhan.username.string = data.name;
		}
		if (void 0 !== data.red){
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(data.red);
		}
		if (void 0 !== data.xu){
			this.header.userXu.string = helper.numberWithCommas(data.xu);
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
		if (void 0 !== data.level){
			this.header.level(data.level);
			this.header.updateEXP(data.vipHT, data.vipNext);
		}
	},
	NewsAddArray: function(arr){
		var self = this
		Promise.all(arr.map(function(text){
			var temp = new cc.Node;
			temp.addComponent(cc.RichText);
			temp            = temp.getComponent(cc.RichText);
			temp.string     = text
			temp.font       = self.font
			temp.lineHeight = 30
			temp.fontSize   = 20

			self.newsContents.node.addChild(temp.node)

			return temp;
		})).then(result => {
			if (!this.newsContents.node.active) {
				this.newsContents.setNews()
			}
		})
	},
	NewsAddText: function(text){
		var temp = new cc.Node;
		temp.addComponent(cc.RichText);
		temp            = temp.getComponent(cc.RichText);
		temp.string     = text
		temp.font       = this.font
		temp.lineHeight = 30
		temp.fontSize   = 20
		this.newsContents.node.addChild(temp.node)

		if (!this.newsContents.node.active) {
			this.newsContents.setNews()
		}
	},
	signOut: function(){
		cc.RedT.user     = {};
		cc.RedT.IS_LOGIN = false;
		this.AllReset();
	},
	signIn: function(){
		cc.RedT.IS_LOGIN = true;
		this.header.isSignIn();
		this.dialog.onBack();
		cc.RedT.MiniPanel.signIn();
	},
	AllReset:function(){
		this.loading.active = false;
		this.newsContents.reset();
		this.header.isSignOut();
		this.dialog.onCloseDialog();
		cc.RedT.MiniPanel.newGame();

		//cc.RedT.reconnect();
	},
	onGetTaiXiu: function(tai, xiu){
		var sTai = helper.getOnlyNumberInString(this.iconTaiXiu.tai.string);
		var sXiu = helper.getOnlyNumberInString(this.iconTaiXiu.xiu.string);
		if (sTai-tai != 0) {
			helper.numberTo(this.iconTaiXiu.tai, sTai, tai, 1000, true);
		}
		if (sXiu-xiu != 0) {
			helper.numberTo(this.iconTaiXiu.xiu, sXiu, xiu, 1000, true);
		}
	},
	onGetHu: function(){
		if (void 0 !== cc.RedT.setting.topHu.data) {
			// Vương Quốc Red
			var self = this;
			Promise.all(cc.RedT.setting.topHu.data['vq_red'].filter(function(temp){
				return temp.red == true;
			}))
			.then(result => {
				var h100 = result.filter(function(temp){return temp.type == 100});
				var h1k  = result.filter(function(temp){return temp.type == 1000});
				var h10k = result.filter(function(temp){return temp.type == 10000});

				var r100 = helper.getOnlyNumberInString(this.iconVQRed.hu100.string);
				var r1k  = helper.getOnlyNumberInString(this.iconVQRed.hu1k.string);
				var r10k = helper.getOnlyNumberInString(this.iconVQRed.hu10k.string);

				if (r100-h100[0].bet != 0) {
					helper.numberTo(this.iconVQRed.hu100, helper.getOnlyNumberInString(this.iconVQRed.hu100.string), h100[0].bet, 2000, true);
				}
				if (r1k-h1k[0].bet != 0) {
					helper.numberTo(this.iconVQRed.hu1k, helper.getOnlyNumberInString(this.iconVQRed.hu1k.string), h1k[0].bet, 2000, true);
				}
				if (r10k-h10k[0].bet != 0) {
					helper.numberTo(this.iconVQRed.hu10k, helper.getOnlyNumberInString(this.iconVQRed.hu10k.string), h10k[0].bet, 2000, true);
				}
			});
		}
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
