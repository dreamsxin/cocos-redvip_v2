
var helper = require('Helper'),
	notice = require('Notice'),
	dialog = require('Poker_dialog');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeNotice: cc.Node,
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		notice:    notice,
		dialog:    dialog,
	},

	onLoad () {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		//this.dialog.init();

		cc.RedT.send({scene:"poker"});

		/**
		if(cc.RedT.isSoundBackground()){
			cc.RedT.setSoundBackground(true);
			this.playMusic();
		}
		*/
	},
	onData: function(data) {
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
	},
});
