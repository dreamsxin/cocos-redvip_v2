
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nickname:    cc.Label,
		balans:      cc.Label,
		ic_dealer:   cc.Node,

		nodeDealer:  cc.Node,
		betDealer:   cc.Label,

		nodeChicken: cc.Node,
		betChicken:  cc.Label,

		card:     cc.Node,
		status:   cc.Node,
		progress: cc.ProgressBar,
		avatar:   cc.Sprite,
		isOpen:   false,
		isAll:    false,
		isHuy:    false,
	},
	init: function(){
		this.item = this.card.children.map(function(item){
			item.defaultPosition = item.position;
			item.defaultAngle    = item.angle;
			return item.getComponent(cc.Sprite);
		});
	},
	setAvatar: function(data){
		data = data>>0;
		if (cc.RedT.avatars[data] !== void 0) {
			this.avatar.spriteFrame = cc.RedT.avatars[data];
		}else{
			this.avatar.spriteFrame = cc.RedT.avatars[0];
		}
	},
	setInfo: function(data, isWin = false){
		if (!!data) {
			this.node.active = true;
			if (data.balans !== void 0) {
				if (isWin) {
					this.node.runAction(cc.sequence(
						cc.delayTime(1),
						cc.callFunc(function() {
							this.balans.string = helper.numberWithCommas(data.balans);
							data = null;
						}, this),
					));
				}else{
					this.balans.string = helper.numberWithCommas(data.balans);
				}
			}
			!!data.name && (this.nickname.string = data.name);
			if (!!data.progress) {
				this.startProgress(data.progress);
			}
			if (data.betChuong !== void 0) {
				this.betDealer.node.active = !!data.betChuong;
				this.betDealer.string = helper.numberWithCommas(data.betChuong);
			}
			if (data.betGa !== void 0) {
				this.betChicken.node.active = !!data.betGa;
				this.betChicken.string = helper.numberWithCommas(data.betGa);
			}
			if (data.openCard !== void 0 && cc.RedT.inGame.player[cc.RedT.inGame.meMap] !== this) {
				this.openCard(data.openCard);
			}
			if (data.avatar !== void 0) {
				this.setAvatar(data.avatar);
			}
		}else{
			//this.resetGame();
			this.node.active = false;
		}
	},
	startProgress: function(time) {
		this.Progress.progress = 0;
		this.progressTime = time;
		this.oldTime  = new Date().getTime();
		this.isUpdate = true;
	},
	setProgress: function(time, progress) {
		this.Progress.progress = progress;
		this.progressTime = time;
		this.oldTime  = new Date().getTime();
		this.isUpdate = true;
	},
	resetGame: function(){
		this.item.forEach(function(item){
			item.node.color  = item.node.color.fromHEX('FFFFFF');
			item.node.active = false;
			item.bai = null;
		});
		this.isAll = false;
		this.isHuy = false;
		this.resetStatus();
		this.bgWin.active = false;
		this.bet.string = '';
		this.isOpen = false;
	},
	update: function(t){
		if (this.isUpdate === true) {
			let h = new Date().getTime();
			let progress = ((h-this.oldTime)/1000)/this.progressTime;
			this.Progress.progress = progress+(t/this.progressTime);
			if (this.Progress.progress >= 1) {
				this.Progress.progress = 0;
				this.progressTime = 0;
				this.isUpdate = false;
			}
		}
	},
});
