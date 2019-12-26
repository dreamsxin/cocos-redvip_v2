
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nickname: cc.Label,
		balans:   cc.Label,
		bet:      cc.Label,
		card:     cc.Node,
		d:        cc.Node,
		Progress: cc.ProgressBar,
		Avatar:   cc.Sprite,
		item:     {
			default: [],
			type: cc.Sprite,
		},
	},
	init: function(){
		// 	
	},
	ChiaBai: function(bai){
		this.card.active = true;
		if (bai.data) {
			this.item.forEach(function(item, index){
				let card = bai.data[index];
				item.spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
			});
		}else{
			this.item.forEach(function(item){
				item.spriteFrame = cc.RedT.util.card.cardB1;
			});
		}
	},
	setInfo: function(data){
		if (!!data) {
			this.node.active = true;
			if (data.balans !== void 0) {
				this.balans.string = helper.numberWithCommas(data.balans);
			}
			!!data.name && (this.nickname.string = data.name);
			if (!!data.progress) {
				this.startProgress(data.progress);
			}
			if (data.d === true){
				this.d.active = true;
				if (cc.RedT.inGame.game_d) {
					cc.RedT.inGame.game_d.d.active = false;
				}
				cc.RedT.inGame.game_d = this;
			}
			if (data.bet !== void 0) {
				this.bet.string = helper.numberWithCommas(data.bet);
			}
		}else{
			this.node.active = false;
		}
	},
	startProgress: function(time) {
		this.Progress.progress = 0;
		this.progressTime = time;
		this.isUpdate = true;
	},
	update: function(t){
		if (this.isUpdate === true) {
			this.Progress.progress = this.Progress.progress+(t/this.progressTime);
			if (this.Progress.progress >= 1) {
				this.Progress.progress = 0;
				this.progressTime = 0;
				this.isUpdate = true;
			}
		}
	},
});
