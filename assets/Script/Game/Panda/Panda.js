
cc.Class({
    extends: cc.Component,

    properties: {
        redhat: cc.Node,
        MiniPanel: cc.Prefab,
        nodeNotice: cc.Node,
		prefabNotice: cc.Prefab,
		loading: cc.Node,

		hu:         cc.Label,
		taikhoan:   cc.Label,
		tong:       cc.Label,
		vuathang:   cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	cc.RedT.inGame = this;
		let MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);
		cc.RedT.send({scene:'panda'});
    },

    onData: function(data) {
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.panda){
			//this.VuongQuocRed(data.VuongQuocRed);
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
		if (void 0 !== data.vipp) {
			cc.RedT.MiniPanel.Dialog.VipPoint.onData(data.vipp);
		}
	},
	userData: function(data){
		//this.taikhoan.string = helper.numberWithCommas(data.red);
	},

    addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.nodeNotice.addChild(notice);
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
	onGetHu: function(){
		/**
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var cuoc = helper.getOnlyNumberInString(this.bet.string);
			Promise.all(cc.RedT.setting.topHu.data['panda'].filter(function(temp){
				return temp.type == cuoc;
			}))
			.then(result => {
				var s = helper.getOnlyNumberInString(this.hu.string);
				var bet = result[0].bet;
				if (s-bet != 0) 
					helper.numberTo(this.hu, s, bet, 2000, true);
			});
		}
		*/
	},

    // update (dt) {},
});
