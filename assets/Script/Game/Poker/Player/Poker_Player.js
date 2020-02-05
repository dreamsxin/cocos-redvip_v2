
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nickname: cc.Label,
		balans:   cc.Label,
		bet:      cc.Label,
		card:     cc.Node,
		d:        cc.Node,
		status:   cc.Node,
		notice:   cc.Node,
		Progress: cc.ProgressBar,
		Avatar:   cc.Sprite,
		item:     {
			default: [],
			type: cc.Sprite,
		},
	},
	init: function(){
		this.isAll = false;
		this.isHuy = false;
		this.item.forEach(function(item, index){
			this['item'+index] = {position:item.node.position, angle:item.node.angle};
		}.bind(this));
	},
	ChiaBai: function(bai, card, time){
		let item = this.item[card];
		let base = cc.RedT.inGame;
		if (bai.data) {
			let data = bai.data[card];
			let position = base.bo_bai.parent.convertToWorldSpaceAR(base.bo_bai.position);
			item.node.position = item.node.parent.convertToNodeSpaceAR(position);
			item.node.scaleX = base.bo_bai.width/item.node.width;
			item.node.scaleY = base.bo_bai.height/item.node.height;
			item.node.angle  = 0;
			item.node.active = true;
			item.spriteFrame = cc.RedT.util.card.cardB1;
			item.node.runAction(cc.sequence(cc.delayTime(time),
				cc.spawn(cc.moveTo(0.1, this['item'+card].position), cc.rotateTo(0.1, this['item'+card].angle), cc.scaleTo(0.1, 1)),
				cc.delayTime(0.1),
				cc.scaleTo(0.1, 0, 1),
				cc.callFunc(function() {
					item.spriteFrame = cc.RedT.util.card.getCard(data.card, data.type);
				}, this),
				cc.scaleTo(0.1, 1, 1),
			));
		}else{
			item.spriteFrame = cc.RedT.util.card.cardB1;
			let position = base.bo_bai.parent.convertToWorldSpaceAR(base.bo_bai.position);
			item.node.position = item.node.parent.convertToNodeSpaceAR(position);
			item.node.scaleX = base.bo_bai.width/item.node.width;
			item.node.scaleY = base.bo_bai.height/item.node.height;
			item.node.angle  = 0;
			item.node.active = true;
			item.node.runAction(cc.sequence(cc.delayTime(time),
				cc.spawn(cc.moveTo(0.1, this['item'+card].position), cc.rotateTo(0.1, this['item'+card].angle), cc.scaleTo(0.1, 1)),
			));
		}
	},
	openCard: function(bai){
		this.item.forEach(function(item, index){
			let card = bai[index];
			item.node.runAction(cc.sequence(
				cc.scaleTo(0.1, 0, 1),
				cc.callFunc(function() {
					item.spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
				}, this),
				cc.scaleTo(0.1, 1, 1),
			));
		});
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
			if (data.card !== void 0) {
				this.ChiaBai(data.card);
			}
			if (data.openCard !== void 0 && cc.RedT.inGame.player[cc.RedT.inGame.meMap] !== this) {
				this.openCard(data.openCard);
			}
		}else{
			this.node.active = false;
		}
	},
	infoGame: function(info){
		if (void 0 !== info.hoa) {
			this.miniStatus(cc.RedT.inGame.spriteHoa);
			info.hoa = info.hoa>>0;
			if (info.hoa > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.hoa, true, 2.5, 22);
			}
		}
		if (void 0 !== info.to) {
			this.miniStatus(cc.RedT.inGame.spriteCuoc);
			info.to = info.to>>0;
			if (info.to > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.to, true, 1.5, 22);
			}
		}
		if (void 0 !== info.win) {
			info.win = info.win>>0;
			if (info.win > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.win, true, 3, 28);
			}
		}
		if (void 0 !== info.lost) {
			this.miniStatus(cc.RedT.inGame.spriteLost);
			info.lost = info.lost>>0;
			if (info.lost > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.lost, false, 2.5, 22);
			}
		}
		if (void 0 !== info.theo) {
			this.miniStatus(cc.RedT.inGame.spriteTheo);
			info.theo = info.theo>>0;
			if (info.theo > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.theo, true, 1.5, 22);
			}
		}
		if (void 0 !== info.xem) {
			if (!this.isAll && !this.isHuy) {
				this.miniStatus(cc.RedT.inGame.spriteXem);
			}
			info.xem = info.xem>>0;
			if (info.xem > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.xem, true, 1.5, 22);
			}
		}
		if (void 0 !== info.huy) {
			this.isHuy = true;
			this.miniStatus(cc.RedT.inGame.spriteHuy);
		}
		if (void 0 !== info.all) {
			this.isAll = true;
			this.miniStatus(cc.RedT.inGame.spriteAll);
			info.all = info.all>>0;
			if (info.all > 0) {
				// Hiệu ứng cộng tiền
				this.noticeBet(info.all, true, 1.5, 25);
			}
		}
	},
	miniStatus: function(sprite){
		this.status.destroyAllChildren();
		let status = new cc.Node;
		status = status.addComponent(cc.Sprite);
		status.spriteFrame = sprite;
		this.status.addChild(status.node);
		status.node.opacity = 50;
		status.node.scale = 3;
		status.node.y = cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this ? 52 : 33;
		status.node.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.1, 255), cc.scaleTo(0.1, 1)), cc.delayTime(2.5), cc.callFunc(function(){
			this.destroy();
		}, status.node)));
	},
	startProgress: function(time) {
		this.resetStatus();
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
			item.node.active = false;
		});
		this.isAll = false;
		this.isHuy = false;
		this.resetStatus();
		this.bet.string = '';
	},
	resetStatus: function(cp = false){
		this.status.destroyAllChildren();
		this.notice.destroyAllChildren();
	},
	noticeBet: function(bet, plus = true, time, size){
		let temp = new cc.Node;
		temp.addComponent(cc.Label);
		temp = temp.getComponent(cc.Label);
		temp.string = (plus ? '+' : '-') + helper.numberWithCommas(bet);
		temp.font = plus ? cc.RedT.inGame.font1 : cc.RedT.inGame.font2;
		temp.lineHeight = 40;
		temp.fontSize   = size;
		temp.spacingX   = -4;
		this.notice.addChild(temp.node);
		let y = 100;
		let x = plus ? -8 : -3;
		if (cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this) {
			x = plus ? -8 : -4;
			y = 126;
		}
		temp.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(x, y)), cc.delayTime(time), cc.callFunc(function(){
			this.destroy();
		}, temp.node)));
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
