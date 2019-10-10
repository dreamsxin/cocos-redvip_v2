
let helper = require('Helper');
let notice = require('Notice');

cc.Class({
	extends: cc.Component,

	properties: {
		audioMoBat: {
			default: null,
			type: cc.AudioClip
		},
		audioSingleChip: {
			default: null,
			type: cc.AudioClip
		},
		audioMultiChip: {
			default: null,
			type: cc.AudioClip
		},
		audioXocDia: {
			default: null,
			type: cc.AudioClip
		},

		box_chan:   cc.Node,
		box_le:     cc.Node,
		box_red3:   cc.Node,
		box_red4:   cc.Node,
		box_white3: cc.Node,
		box_white4: cc.Node,

		total_chan:   cc.Label,
		total_le:     cc.Label,
		total_red3:   cc.Label,
		total_red4:   cc.Label,
		total_white3: cc.Label,
		total_white4: cc.Label,

		me_chan:   cc.Label,
		me_le:     cc.Label,
		me_red3:   cc.Label,
		me_red4:   cc.Label,
		me_white3: cc.Label,
		me_white4: cc.Label,

		me_name:   cc.Label,
		me_balans: cc.Label,

		labelTime: cc.Label,
		timeWait:  cc.Label,
		nodeTime:  cc.Node,
		nodeWait:  cc.Node,

		users_bg:    cc.Node,
		users_count: cc.Label,

		nodeDia: cc.Node,
		nodeBat: cc.Node,

		chip_1000:    cc.SpriteFrame,
		chip_10000:   cc.SpriteFrame,
		chip_50000:   cc.SpriteFrame,
		chip_100000:  cc.SpriteFrame,
		chip_1000000: cc.SpriteFrame,

		dot_red:   cc.SpriteFrame,
		dot_white: cc.SpriteFrame,

		redH:    cc.Node,
		miniNotice:  cc.Node,

		Progress: cc.ProgressBar,
		Animation: cc.Animation,

		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		notice:    notice,

		red: true,
	},

	/**
	var position = node.parent.convertToWorldSpaceAR(node.position);
	position = canvasNode.convertToNodeSpaceAR(position);
	*/
	onLoad () {
		console.log(this);
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redH.insertChild(MiniPanel);
		cc.RedT.send({scene:"xocxoc", g:{xocxoc:{ingame:true}}});

		this.me_name.string = cc.RedT.user.name;
		this.me_balans.string = helper.numberWithCommas(cc.RedT.user.red);
	},
	_playSFX: function(clip) {
		if (cc.RedT.IS_SOUND){
			cc.audioEngine.playEffect(clip, false);
		}
	},
	_play: function(clip) {
		if (cc.RedT.IS_SOUND){
			cc.audioEngine.play(clip, false, 1);
		}
	},
	playClick: function(){
		//this._playSFX(this.audioClick);
	},
	onData: function(data) {
		console.log(data);
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.xocxoc){
			this.xocxoc(data.xocxoc);
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
	},
	backGame: function(){
		clearInterval(this.timeInterval);
		cc.RedT.send({g:{xocxoc:{outgame:true}}});
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		clearInterval(this.timeInterval);
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	userData: function(data){
		if (this.red) {
			this.me_balans.string = helper.numberWithCommas(data.red);
		}else{
			this.me_balans.string = helper.numberWithCommas(data.xu);
		}
	},
	xocxoc: function(data){
		if (!!data.ingame) {
			this.xocxocIngame(data.ingame);
		}
		if (!!data.finish) {
			// ket qua
			this.xocxocFinish(data.finish);
		}
		if (!!data.log) {
			// me log
		}
		if (!!data.top) {
			//top win
		}
		if (!!data.status) {
		}
	},
	xocxocIngame: function(data){
		if (data.client) {
			this.updateClient(data.client);
		}

		if (!!data.time) {
			this.time_remain = data.time-1;
			this.playTime();
			if (this.time_remain <= 30) {
				this.startProgress(this.time_remain, (this.time_remain+2)/30);
			}
		}

		if (!!data.data) {
			this.updateData(data.data);
		}
	},
	xocxocFinish: function(data){
		this._playSFX(this.audioMoBat);
		this.time_remain = 41;
		this.playTime();
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function(){
			if (this.time_remain > 31) {
				var time = helper.numberPad(this.time_remain-31, 2);
				this.timeWait.string = time;
				this.nodeTime.active = false;
				this.nodeWait.active = true;
			}else if(this.time_remain === 31){
				// Xoc Dia
				this.nodeTime.active = false;
				this.nodeWait.active = false;
				this._playSFX(this.audioXocDia);
				this.Animation.play();
				this.resetData();
			}else{
				if (this.time_remain === 30) {
					this.startProgress(30);
				}
				if (this.time_remain > -1) {
					var time = helper.numberPad(this.time_remain, 2);
					this.nodeTime.active  = true;
					this.nodeWait.active  = false;
					this.labelTime.string = time;

					if (this.time_remain < 11) {
						this.labelTime.node.color = cc.Color.RED;
					}else{
						this.labelTime.node.color = cc.Color.WHITE
					}
				}else clearInterval(this.timeInterval);
			}
			this.time_remain--;
		}.bind(this), 1000);
	},
	updateClient: function(client){
		this.users_count.string = client;
	},
	updateData: function(data){
		if (this.red) {
			this.total_chan.string   = helper.numberWithCommas(data.red.chan);
			this.total_le.string     = helper.numberWithCommas(data.red.le);
			this.total_red3.string   = helper.numberWithCommas(data.red.red3);
			this.total_red4.string   = helper.numberWithCommas(data.red.red4);
			this.total_white3.string = helper.numberWithCommas(data.red.white3);
			this.total_white4.string = helper.numberWithCommas(data.red.white4);
		}else{
			this.total_chan.string   = helper.numberWithCommas(data.xu.chan);
			this.total_le.string     = helper.numberWithCommas(data.xu.le);
			this.total_red3.string   = helper.numberWithCommas(data.xu.red3);
			this.total_red4.string   = helper.numberWithCommas(data.xu.red4);
			this.total_white3.string = helper.numberWithCommas(data.xu.white3);
			this.total_white4.string = helper.numberWithCommas(data.xu.white4);
		}
	},
	resetData: function(){
		this.total_chan.string   = '';
		this.total_le.string     = '';
		this.total_red3.string   = '';
		this.total_red4.string   = '';
		this.total_white3.string = '';
		this.total_white4.string = '';

		this.me_chan.string   = '';
		this.me_le.string     = '';
		this.me_red3.string   = '';
		this.me_red4.string   = '';
		this.me_white3.string = '';
		this.me_white4.string = '';
	},
	startProgress: function(time, progress = 1) {
		this.Progress.progress = progress;
		this.progressTime = time;
	},
	update: function(t){
		if (!!this.progressTime) {
			this.Progress.progress = this.Progress.progress-(t/this.progressTime);
			if (this.Progress.progress <= 0) {
				this.Progress.progress = 0;
				this.progressTime = 0;
			}
		}
	},
});
