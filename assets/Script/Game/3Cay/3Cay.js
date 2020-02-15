
var helper   = require('Helper');
var	notice   = require('Notice');
var	mePlayer = require('3Cay_player');

cc.Class({
    extends: cc.Component,

    properties: {
    	gameRoom: cc.Label,
    	nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		noticeOut: cc.Node,
		notice:    notice,
		mePlayer: mePlayer,
		panel: false,
		dataOn: true,
    },
    onLoad(){
    	cc.RedT.inGame = this;
		cc.RedT.MiniPanel.node.parent = this.redhat;
		cc.RedT.send({scene:'bacay', g:{bacay:{ingame:true}}});

		this.mePlayer.nickname.string = cc.RedT.user.name;
		this.mePlayer.balans.string = helper.numberWithCommas(cc.RedT.user.red);
		this.mePlayer.setAvatar(cc.RedT.user.avatar);
    },
    onData: function(data) {
		if (!!data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (!!data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (!!data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
		if (void 0 !== data.vipp) {
			cc.RedT.MiniPanel.Dialog.VipPoint.onData(data.vipp);
		}
		if (void 0 !== data.user){
			cc.RedT.userData(data.user);
		}
		if (this.dataOn) {
			if (!!data.kick) {
				this.kick();
			}
			if (void 0 !== data.notice){
				this.notice.show(data.notice);
			}
		}
	},

	kick: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		this.loading.active = true;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame');
	},
	backGame: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		cc.RedT.send({g:{bacay:{outgame:true}}});
		this.loading.active = true;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.RedT.MiniPanel.node.parent = null;
		this.dataOn = false;
		clearInterval(this.regTime1);
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	toggleNoticeOut: function(){
		this.noticeOut.active = !this.noticeOut.active;
	},
    // update (dt) {},
});
