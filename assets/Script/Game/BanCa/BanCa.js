
var helper = require('Helper');
var notice = require('Notice');
//var dialog = require('VQRed_dialog');

cc.Class({
    extends: cc.Component,

    properties: {
    	nick:    cc.Label,
    	balans:  cc.Label,
    	loading: cc.Node,
    	notice:  notice,
    },
    onLoad () {
    	cc.RedT.inGame = this;
    	cc.RedT.send({scene:"bc"});

    	this.nick.string   = cc.RedT.user.name;
    	this.balans.string = helper.numberWithCommas(cc.RedT.user.red);
    },
    onData: function(data) {
    },
    backGame: function(){
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
});
