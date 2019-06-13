
var signIn   = require('SignIn'),
	signUp   = require('SignUp'),
	signName = require('SignName'),
	shop     = require('Shop'),
	profile  = require('Profile'),
	Settings  = require('Settings'),
	the_cao  = require('TheCao');

cc.Class({
	extends: cc.Component,
	properties: {
		signIn: signIn,
		signUp: signUp,
		signOut: {
			default: null,
			type: cc.Node,
		},
		signName: signName,
		shop: shop,
		profile: profile,
		the_cao: the_cao,
		settings: Settings,
	},
	init: function() {
		this.actionShow = cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut(2.5)), cc.fadeTo(0.5, 255));
		this.objShow    = null;
		this.objTmp     = null;
		this.shop.init();
		this.profile.init();
		this.the_cao.init();
	},

	onClickBack: function(){
		cc.RedT.audio.playUnClick();
		this.onBack();
	},
	onBack: function(){
		if(this.objShow != null){
			if(void 0 == this.objShow.previous || null == this.objShow.previous){
				this.objShow.active = false;
				this.node.active    = false;
				this.objShow        = null;
			}else{
				this.objTmp              = this.objShow;
				this.objShow             = this.objShow.previous;
				this.objTmp.previous     = null;
				this.objTmp.active       = false;
				this.objShow.active      = true;
				this.objTmp              = null;
			}
		}else{
			this.node.active = false;
		}
	},
	onClosePrevious: function(obj){
		if(void 0 !== obj.previous && null !== obj.previous){
			this.onClosePrevious(obj.previous)
			obj.previous = null
		}
		obj.active = false
	},
	onCloseDialog: function(){
		if(this.objShow != null ){
			if(void 0 == this.objShow.previous || null == this.objShow.previous){
				this.objShow.active = this.node.active = false
				this.objShow        = null
			}else{
				this.onClosePrevious(this.objShow.previous)
				this.objShow.active          = this.node.active = false
				this.objShow.previous        = null
				this.objShow                 = null
			}
		}else{
			this.node.active = false
		}
	},

	resetSizeDialog: function(node){
		node.stopAllActions();
		node.scale   = 0.5;
		node.opacity = 0;
	},

	/**
	 * Function Show Dialog
	*/
	showSignIn: function(){
		this.node.active = this.signIn.node.active = true;
		this.objShow     = this.signIn.node;
	},
	showSignUp: function(){
		this.node.active = this.signUp.node.active = true;
		this.objShow     = this.signUp.node;
	},
	showSignName: function(){
		this.node.active        = this.signName.node.active = true;
		this.signUp.node.active = this.signIn.node.active   = false;
		this.objShow            = this.signName.node;
	},
	showShop: function(event, name){
		this.node.active = this.shop.node.active = true;
		this.objShow     = this.shop.node;
		this.shop.superView(name);
	},
	showProfile: function(event, name){
		this.node.active = this.profile.node.active = true;
		this.objShow     = this.profile.node;
		this.profile.superView(name);
	},
	showSetting: function(event, name){
		this.node.active = this.settings.node.active = true;
		this.objShow     = this.settings.node;
	},
});
