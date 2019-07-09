
var helper = require('Helper');
var reel   = require('VuongQuocRed_reel');
var Line   = require('VuongQuocRed_line');
var gameBonus = require('VuongQuocRed_playBonus');
var notice = require('Notice');

cc.Class({
	extends: cc.Component,
	properties: {
		gameBonus: gameBonus,
		redhat: {
			default: null,
			type: cc.Node
		},
		reels: {
			default: [],
			type: reel,
		},
		icons: {
			default: [],
			type: cc.SpriteFrame,
		},
		betString: {
			default: [],
			type: cc.String,
		},
		iconPrefab: {
			default: null,
			type: cc.Prefab,
		},
		BigWin:       cc.Animation,
		BigWin_Label: cc.Label,
		NoHu:         cc.Animation,
		NoHu_Label:   cc.Label,
		EF_Bonus:     cc.Animation,
		EF_Free:      cc.Animation,
		buttonCoint: cc.Node,
		buttonLine:  cc.Node,
		buttonSpin:  cc.Node,
		buttonFree:  cc.Node,
		freeLabel:   cc.Label,
		buttonAuto:  cc.Node,
		buttonStop:  cc.Node,
		nodeChangerBetL:  cc.Node,
		nodeChangerBetR:  cc.Node,
		nodeRed: {
			default: null,
			type: cc.Node,
		},
		nodeXu: {
			default: null,
			type: cc.Node,
		},
		bet: {
			default: null,
			type: cc.Label,
		},
		betL: {
			default: null,
			type: cc.Node,
		},
		betR: {
			default: null,
			type: cc.Node,
		},
		nodeNotice: {
			default: null,
			type: cc.Node,
		},
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		MiniPanel: cc.Prefab,
		loading: {
			default: null,
			type: cc.Node
		},
		notice:      notice,
		Line: Line,
		hu:        cc.Label,
		taikhoan:  cc.Label,
		tong:      cc.Label,
		vuathang:  cc.Label,
		labelLine: cc.Label,
		bangThuong: cc.Node,
		onColor:  "",
		offColor: "",
		isAuto:     false,
		isSpin:     false,
		isFreeSpin: false,
		red:     true,
		betSelect: 0,
	},
	onLoad () {
		cc.RedT.inGame    = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.BigWin.on('finished', this.BigWinFinish, this);
		this.BigWin.on('play',     this.BigWinPlay,   this);
		this.NoHu.on('finished', this.NoHuFinish, this);
		this.NoHu.on('play',     this.NoHuPlay,   this);

		this.EF_Bonus.on('finished', this.EF_BonusFinish, this);
		this.EF_Free.on('finished',  this.EF_FreeFinish,  this);

		var self = this;
		this.gameBonus.init(this);
		this.Line.init(this);

		Promise.all(this.reels.map(function(reel) {
			reel.init(self);
		}));
		cc.RedT.send({scene:"vq_red"});
		this.taikhoan.string = helper.numberWithCommas(cc.RedT.user.red);
	},
	BigWinPlay: function(){
		var huong = cc.callFunc(function(){
			helper.numberTo(this.BigWin_Label, 0, this.H_win, 2000, true);
		}, this);
		this.BigWin.node.runAction(cc.sequence(cc.delayTime(0.3), huong));
	},
	BigWinFinish: function(){
		this.isBigWin = false;
		this.BigWin.node.active = false;
		this.BigWin_Label.string = "";
		this.hieuUng();
	},
	NoHuPlay: function(){
		var huong = cc.callFunc(function(){
			helper.numberTo(this.NoHu_Label, 0, this.H_win, 2000, true);
		}, this);
		this.NoHu.node.runAction(cc.sequence(cc.delayTime(0.3), huong));
	},
	NoHuFinish: function(){
		this.isNoHu = false;
		this.NoHu.node.active  = false;
		this.NoHu_Label.string = "";
		this.hieuUng();
	},
	EF_BonusFinish: function(){
		this.isBonus = false;
		this.EF_Bonus.node.active = false;
		this.gameBonus.onPlay();
	},
	EF_FreeFinish: function(){
		this.isFree = false;
		this.EF_Free.node.active = false;
		this.hieuUng();
	},
	EF_vuathang: function(){
		this.vuathang.string = helper.numberWithCommas(this.H_win);
		this.buttonFree.active = !!this.H_free;
		this.buttonSpin.active = !this.H_free;
		this.freeLabel.string  = this.H_free;
	},
	onChangerBetR: function(){
		cc.RedT.audio.playClick();
		this.betSelect++;
		if (this.betSelect>2) this.betSelect = 0;
		this.bet.string  = this.betString[this.betSelect];
		this.tong.string = helper.numberWithCommas(this.Line.data.length * helper.getOnlyNumberInString(this.bet.string));
		this.onGetHu();
	},
	onChangerBetL: function(){
		cc.RedT.audio.playClick();
		this.betSelect--;
		if (this.betSelect<0) this.betSelect = 2;
		this.bet.string = this.betString[this.betSelect];
		this.tong.string = helper.numberWithCommas(this.Line.data.length * helper.getOnlyNumberInString(this.bet.string));
		this.onGetHu();
	},
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		this.userData(cc.RedT.user);
		this.onGetHu();
	},
	onClickSpin: function(){
		cc.RedT.audio.playClick();
		this.onSpin();
	},
	onAutoSpin: function(){
		cc.RedT.audio.playClick();
		this.onGetSpin();
	},
	onClickAuto: function(){
		cc.RedT.audio.playClick();
		this.onAuto();
	},
	onClickStop: function(){
		cc.RedT.audio.playClick();
		this.onStop();
	},
	onSpin: function(){
		if (this.Line.data.length < 1) {
			this.addNotice('Chọn ít nhất 1 dòng');
		}else{
			if (!this.isSpin) {
				this.isSpin = true;
				this.setSpin();
				this.onGetSpin();
			}
		}
	},
	onAuto: function(){
		this.isAuto = !this.isAuto;
		this.buttonAuto.color = this.isAuto ? cc.Color.WHITE : cc.color(200,200,200);
	},
	onStop: function(){
		this.isAuto = this.buttonStop.active = false;
		this.buttonAuto.active = true;
		this.buttonAuto.color  = cc.color(200,200,200);

	},
	setSpin: function(){
		this.buttonLine.pauseSystemEvents();
		this.buttonSpin.pauseSystemEvents();
		this.buttonCoint.pauseSystemEvents();
		this.nodeChangerBetL.pauseSystemEvents();
		this.nodeChangerBetR.pauseSystemEvents();
	},
	resetSpin: function(){
		this.isSpin = this.buttonStop.active = this.isAuto = false;
		this.buttonAuto.active = true;
		this.buttonLine.resumeSystemEvents();
		this.buttonSpin.resumeSystemEvents();
		this.buttonCoint.resumeSystemEvents();
		this.nodeChangerBetL.resumeSystemEvents();
		this.nodeChangerBetR.resumeSystemEvents();
	},
	runReels: function(){
		Promise.all(this.reels.map(function(reel, index) {
			reel.spin(index);
		}))
	},
	copy: function(){
		Promise.all(this.reels.map(function(reel){
			reel.icons[reel.icons.length-1].setIcon(reel.icons[2].data);
			reel.icons[reel.icons.length-2].setIcon(reel.icons[1].data);
			reel.icons[reel.icons.length-3].setIcon(reel.icons[0].data);
		}));
	},
	random: function(){
		Promise.all(this.reels.map(function(reel){
			Promise.all(reel.icons.map(function(icon, index){
				if (index > 2 && index < reel.icons.length-3) {
					icon.random();
				}
			}));
		}));
	},
	hieuUng: function(){
		if (this.isBigWin && !this.isNoHu) {
			// Big Win
			this.BigWin.node.active = true;
			this.BigWin.play();
		}else if (this.isNoHu){
			// Nổ Hũ
			this.NoHu.node.active = true;
			this.NoHu.play();
		}else if (this.isBonus){
			// Bonus
			this.EF_Bonus.node.active = true;
			this.EF_Bonus.play();
		}else if (this.isFree){
			// Free
			this.EF_Free.node.active = true;
			this.EF_Free.play();
		}else if (this.H_win > 0){
			var temp = new cc.Node;
			temp.addComponent(cc.Label);
			temp = temp.getComponent(cc.Label);
			temp.string = '+'+ helper.numberWithCommas(this.H_win);
			temp.font = cc.RedT.util.fontCong;
			temp.lineHeight = 130;
			temp.fontSize   = 25;
			temp.node.position = cc.v2(0, 21);
			this.nodeNotice.addChild(temp.node);
			temp.node.runAction(cc.sequence(cc.moveTo(1.5, cc.v2(0, 74)), cc.callFunc(function(){
				temp.node.destroy();
				this.hieuUng();
			}, this)));
			this.H_win = 0;
		}else{
			if (this.isAuto || this.isFreeSpin) {
				this.timeOut = setTimeout(function(){
					this.onAutoSpin();
				}
				.bind(this), 400);
			}else{
				this.resetSpin();
			}
		}
	},
	onData: function(data) {
		console.log(data);
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.VuongQuocRed){
			this.VuongQuocRed(data.VuongQuocRed);
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
	userData: function(data){
		if (this.red) {
			this.taikhoan.string = helper.numberWithCommas(data.red);
		}else{
			this.taikhoan.string = helper.numberWithCommas(data.xu);
		}
	},
	VuongQuocRed: function(data){
		var self = this;
		if (void 0 !== data.status) {
			if (data.status === 1) {
				this.buttonStop.active = this.isAuto ? true : false;
				this.buttonAuto.active = !this.buttonStop.active;
				Promise.all(data.cel.map(function(cel, cel_index){
					Promise.all(cel.map(function(icon, index){
						self.reels[cel_index].icons[index].setIcon(icon, true);
					}));
				}));
				this.runReels();
				this.H_line_win = data.line_win;
				this.H_win      = data.win;
				this.H_free     = data.free;
				this.isBonus    = data.isBonus;
				this.isNoHu     = data.nohu;
				this.isBigWin   = data.isBigWin;
				this.isFree     = data.isFree;
				this.isFreeSpin = !!data.free;
			}else{
				this.resetSpin();
			}
		}
		if (void 0 !== data.bonus) {
			this.gameBonus.onData(data.bonus);
		}
		/**
		if (void 0 !== data.log) {
			//this.RedT.Dialog.BigBabol_LichSu.onData(data.log);
		}
		if (void 0 !== data.top) {
			//this.RedT.Dialog.BigBabol_Top.onData(data.top);
		}
		*/
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	onGetSpin: function(){
		cc.RedT.send({g:{vq_red:{spin:{cuoc: helper.getOnlyNumberInString(this.bet.string), red: this.red, line: this.Line.data}}}});
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
			console.log(cc.RedT.inGame);
			cc.RedT.inGame.signOut();
		});
	},
	onGetHu: function(){
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var self = this;
			var cuoc = helper.getOnlyNumberInString(self.bet.string);
			Promise.all(cc.RedT.setting.topHu.data['vq_red'].filter(function(temp){
				return temp.type == cuoc && temp.red == self.red;
			}))
			.then(result => {
				var s = helper.getOnlyNumberInString(this.hu.string);
				var bet = result[0].bet;
				if (s-bet != 0) 
					helper.numberTo(this.hu, s, bet, 2000, true);
			});
		}
	},
	BangThuongToggle: function(){
		cc.RedT.audio.playClick();
		this.bangThuong.active = !this.bangThuong.active;
	},
});
