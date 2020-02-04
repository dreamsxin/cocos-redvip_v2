
var helper    = require('Helper'),
	reel      = require('CoTrang_reel'),
	Line      = require('CoTrang_lines'),
	gameBonus = require('CoTrang_playBonus'),
	notice    = require('Notice'),
	dialog    = require('CoTrang_dialog');

cc.Class({
	extends: cc.Component,

	properties: {
		gameBonus: gameBonus,

		audioClickSpin: {
			default: null,
			type: cc.AudioClip
		},
		audioClick: {
			default: null,
			type: cc.AudioClip
		},

		audioWin: {
			default: null,
			type: cc.AudioClip
		},
		audioBigWin: {
			default: null,
			type: cc.AudioClip
		},
		audioJackpot: {
			default: null,
			type: cc.AudioClip
		},

		redhat: cc.Node,
		reels: {
			default: [],
			type: reel,
		},
		icon: cc.Prefab,
		icons: {
			default: [],
			type: cc.SpriteFrame,
		},

		betString: {
			default: [],
			type: cc.String,
		},

		audioIcons: {
			default: [],
			type: cc.SpriteFrame,
		},
		audioIcon: cc.Sprite,

		nodeRed: cc.Node,
		nodeXu:  cc.Node,

		nodeNotice:   cc.Node,
		prefabNotice: cc.Prefab,
		MiniPanel:    cc.Prefab,
		loading:      cc.Node,

		notice:     notice,
		dialog:     dialog,
		Line:       Line,
		hu:         cc.Label,
		taikhoan:   cc.Label,
		tong:       cc.Label,
		vuathang:   cc.Label,
		labelLine:  cc.Label,
		bet:        cc.Label,
		freeLabel:  cc.Label,
		phien:      cc.Label,

		BigWin:       cc.Animation,
		BigWin_Label: cc.Label,
		NoHu_close:   cc.Node,
		NoHu:         cc.Animation,
		NoHu_Label:   cc.Label,
		EF_Bonus:     cc.Animation,
		EF_Free:      cc.Animation,

		buttonCoint:  cc.Node,
		buttonLine:   cc.Node,
		buttonSpin:   cc.Node,
		buttonBet:    cc.Node,
		buttonAuto:   cc.Node,

		isAuto:     false,
		isSpin:     false,
		isFreeSpin: false,
		red:        true,
		betSelect:  0,
	},

	onLoad () {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.Line.init(this);

		cc.RedT.audio.bg.pause();
		cc.RedT.audio.bg = cc.RedT.audio.bgSlot2;

		this.BigWin.on('finished',  this.BigWinFinish, this);
		this.BigWin.on('play',      this.BigWinPlay,   this);
		this.EF_Free.on('finished', this.EF_FreeFinish,  this);

		this.NoHu.on('play', this.NoHuPlay,   this);

		this.EF_Bonus.on('finished', this.EF_BonusFinish, this);

		this.gameBonus.init(this);
		this.dialog.init();

		this.reels.forEach(function(reel) {
			reel.init(this);
		}.bind(this));

		cc.RedT.send({scene:"longlan"});
		this.taikhoan.string = helper.numberWithCommas(cc.RedT.user.red);
		this.speed = 400;

		if(cc.RedT.isSoundBackground()){
			cc.RedT.audio.bg.play();
            this.audioIcon.spriteFrame = this.audioIcons[1];
    	}else{
			this.audioIcon.spriteFrame = this.audioIcons[0];
    	}
	},
	_playSFX: function(clip) {
		if (cc.RedT.IS_SOUND){
			cc.audioEngine.playEffect(clip, false);
		}
	},
	playClick: function(){
		this._playSFX(this.audioClick);
	},
	BigWinPlay: function(){
		var huong = cc.callFunc(function(){
			this._playSFX(this.audioBigWin);
			helper.numberTo(this.BigWin_Label, 0, this.H_win, 2000, true);
		}, this);
		this.BigWin.node.runAction(cc.sequence(cc.delayTime(0.3), huong));
	},
	BigWinFinish: function(){
		this.isBigWin = false;
		this.BigWin.node.active = false;
		this.BigWin_Label.string = "";
		this.showLineWin(false);
		this.hieuUng();
	},
	NoHuPlay: function(){
		this.NoHu_Label.string = "";
		var huong = cc.callFunc(function(){
			this._playSFX(this.audioJackpot);
			helper.numberTo(this.NoHu_Label, 0, this.H_win, 2000, true);
		}, this);
		this.NoHu.node.runAction(cc.sequence(cc.delayTime(0.3), huong));

		var huongT = cc.callFunc(function(){
			this.NoHu_close.active = true;
		}, this);
		this.NoHu.node.runAction(cc.sequence(cc.delayTime(4), huongT));
	},
	NoHuFinish: function(){
		this.isNoHu = false;
		if (this.isAuto) {
			this.onAuto();
		}
		this.showLineWin(false);
		this.hieuUng();
	},
	NoHuClose: function(){
		this.NoHu.node.active = this.NoHu_close.active = false;
		this.NoHuFinish();
	},
	EF_BonusFinish: function(){
		this.EF_Bonus.node.active = false;
		this.gameBonus.onPlay(this.isBonus);
		this.isBonus = 0;
		this.showLineWin(false);
	},
	EF_FreeFinish: function(){
		this.isFree = false;
		this.EF_Free.node.active = false;
		this.showLineWin(false);
		this.hieuUng();
	},
	onData: function(data) {
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.longlan){
			this.LongLan(data.longlan);
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
		this.taikhoan.string = helper.numberWithCommas(data.red);
	},
	LongLan: function(data){
		if (void 0 !== data.status) {
			if (data.status === 1) {
				data.cel.forEach(function(cel, cel_index){
					cel.forEach(function(icon, index){
						this.reels[cel_index].icons[index].setIcon(icon, true);
					}.bind(this));
				}.bind(this));
				this.runReels();
				this.H_line_win = data.line_win;
				this.H_win      = data.win;
				this.H_free     = data.free;
				this.isBonus    = data.isBonus;
				this.isNoHu     = data.isNoHu;
				this.isBigWin   = data.isBigWin;
				this.isFree     = data.isFree;
				this.isFreeSpin = !!data.free;
			}else{
				this.resetSpin();
			}
		}
		if (!!data.phien) {
			this.phien.string = "#" + data.phien;
		}
		if (!!data.bonus) {
			this.gameBonus.onData(data.bonus);
		}
		if (!!data.log) {
			this.dialog.history.onData(data.log);
		}
		if (!!data.top) {
			this.dialog.top.onData(data.top);
		}
		if (!!data.notice) {
			this.addNotice(data.notice);
		}
	},
	EF_vuathang: function(){
		this.showLineWin(true);
		this.vuathang.string       = helper.numberWithCommas(this.H_win);
		this.buttonSpin.active     = !this.H_free;
		this.freeLabel.string      = 'Free: ' + this.H_free;
		this.freeLabel.node.active = !!this.H_free
	},
	onLineWin: function(bool){
		this.H_line_win.forEach(function(obj){
			let TRed = this.Line.mainLines[obj.line-1];
			if (bool) {
				TRed.ef = true;
				TRed.onShow();
			}else{
				TRed.ef = false;
				TRed.onHidden();
			}
		}.bind(this));
	},
	showLineWin: function(bool){
		this.onLineWin(bool);
		if (!bool && !this.isNoHu && !this.isBigWin && !this.isAuto && !this.isFreeSpin) {
			this.eflineN = 0;
			this.efLineWin();
		}
	},
	efLineWin: function(bool){
		if (this.H_line_win.length) {
			this.node.stopAllActions();
			if (void 0 === this.H_line_win[this.eflineN]) {
				this.eflineN = 0;
			}
			this.efOneLineWin(this.eflineN, true);
			var next = cc.callFunc(function() {
				this.efOneLineWin(this.eflineN, false);
				this.eflineN += 1;
				this.efLineWin();
			}, this);
			this.node.runAction(cc.sequence(cc.delayTime(1.5), next));
		}
	},
	efOneLineWin: function(number, bool){
		number = this.H_line_win[this.eflineN].line;
		let TRed = this.Line.mainLines[number-1];
		if (bool) {
			TRed.ef = true;
			TRed.onShow();
		}else{
			TRed.ef = false;
			TRed.onHidden();
		}
	},
	hieuUng: function(){
		if (this.isBigWin && !this.isNoHu) {
			// Big Win
			this.BigWin.node.active = true;
			this.BigWin.play();
			this.oldBigWin = true;
		}else if (this.isNoHu){
			// Nổ Hũ
			this.NoHu.node.active = true;
			this.NoHu.play();
		}else if (!!this.isBonus){
			// Bonus
			this.EF_Bonus.node.active = true;
			this.EF_Bonus.play();
			cc.RedT.audio.playEf('bonus');
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
			!this.oldBigWin && this._playSFX(this.audioWin);
			temp.node.runAction(cc.sequence(cc.moveTo(1.2, cc.v2(0, 105)), cc.callFunc(function(){
				this.speed = 0;
				temp.node.destroy();
				this.hieuUng();
				this.showLineWin(false);
			}, this)));
			this.H_win = 0;
			this.oldBigWin = false;
		}else{
			if (this.isAuto || this.isFreeSpin) {
				this.timeOut = setTimeout(function(){
					this.onAutoSpin();
					this.speed = 400;
				}
				.bind(this), this.speed);
			}else{
				this.resetSpin();
			}
		}
	},
	onChangerBet: function(){
		this._playSFX(this.audioClick);
		this.betSelect++;
		if (this.betSelect>2) this.betSelect = 0;
		this.bet.string  = this.betString[this.betSelect];
		this.tong.string = helper.numberWithCommas(this.Line.data.length * helper.getOnlyNumberInString(this.bet.string));
		this.onGetHu();
	},
	onClickAuto: function(){
		this._playSFX(this.audioClick);
		this.onAuto();
	},
	onAuto: function(){
		this.isAuto = !this.isAuto;
		if (this.isAuto) {
			this.buttonAuto.color = cc.Color.WHITE;
		}else{
			this.buttonAuto.color = this.buttonAuto.color.fromHEX('#8A8A8A');
		}
	},
	onClickSpin: function(){
		this.onSpin();
	},
	onAutoSpin: function(){
		this._playSFX(this.audioClickSpin);
		this.onGetSpin();
	},
	onSpin: function(){
		if (this.Line.data.length < 1) {
			this.addNotice('Chọn ít nhất 1 dòng');
		}else{
			if (!this.isSpin) {
				this._playSFX(this.audioClickSpin);
				this.node.stopAllActions();
				void 0 !== this.eflineN && void 0 !== this.H_line_win && this.H_line_win.length && this.efOneLineWin(this.eflineN, false);
				this.eflineO = this.eflineN = 0;
				this.isSpin = true;
				this.setSpin();
				this.onGetSpin();
			}
		}
	},
	setSpin: function(){
		this.buttonLine.pauseSystemEvents();
		this.buttonSpin.pauseSystemEvents();
		this.buttonCoint.pauseSystemEvents();
		this.buttonBet.pauseSystemEvents();
	},
	resetSpin: function(){
		if (this.isAuto) {
			this.onAuto();
		}
		this.isSpin = false;
		this.buttonLine.resumeSystemEvents();
		this.buttonSpin.resumeSystemEvents();
		this.buttonCoint.resumeSystemEvents();
		this.buttonBet.resumeSystemEvents();
	},
	runReels: function(){
		this.reels.forEach(function(reel, index) {
			reel.spin(index);
		});
	},
	copy: function(){
		this.reels.forEach(function(reel){
			reel.icons[reel.icons.length-1].setIcon(reel.icons[2].data);
			reel.icons[reel.icons.length-2].setIcon(reel.icons[1].data);
			reel.icons[reel.icons.length-3].setIcon(reel.icons[0].data);
		});
	},
	random: function(){
		this.reels.forEach(function(reel){
			reel.icons.forEach(function(icon, index){
				if (index > 2 && index < reel.icons.length-3) {
					icon.random();
				}
			});
		});
	},
	onGetSpin: function(){
		cc.RedT.send({g:{longlan:{spin:{cuoc: helper.getOnlyNumberInString(this.bet.string), line: this.Line.data}}}});
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
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var cuoc = helper.getOnlyNumberInString(this.bet.string);
			Promise.all(cc.RedT.setting.topHu.data['long'].filter(function(temp){
				return temp.type == cuoc;
			}))
			.then(result => {
				var s = helper.getOnlyNumberInString(this.hu.string);
				var bet = result[0].bet;
				if (s-bet != 0) 
					helper.numberTo(this.hu, s, bet, 2000, true);
			});
		}
	},
    onSetAudio: function(){
    	if(cc.RedT.isSoundBackground()){
        	cc.RedT.setSoundBackground(false);
            cc.RedT.audio.bg.pause();
            cc.RedT.IS_SOUND = false;
            cc.RedT.setSoundGame(false);
			this.audioIcon.spriteFrame = this.audioIcons[0];
    	}else{
    		cc.RedT.setSoundBackground(true);
            cc.RedT.audio.bg.play();
            cc.RedT.IS_SOUND = true;
            cc.RedT.setSoundGame(true);
            this.audioIcon.spriteFrame = this.audioIcons[1];
    	}
    },
});
