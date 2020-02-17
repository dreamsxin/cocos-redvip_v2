
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
		isLat:    false,
	},
	onDisable: function() {
		this.ic_dealer.active = false;
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
	ChiaBai: function(bai, card, time){
		let item = this.item[card];
		let base = cc.RedT.inGame;
		if (void 0 !== bai.data) {
			let data = bai.data[card];
			let position = base.nodeCard.parent.convertToWorldSpaceAR(base.nodeCard.position);
			item.node.position = item.node.parent.convertToNodeSpaceAR(position);
			item.node.scaleX = base.nodeCard.width/item.node.width;
			item.node.scaleY = base.nodeCard.height/item.node.height;
			item.node.angle  = 3;
			item.node.active = true;
			item.spriteFrame = cc.RedT.util.card.cardB1;
			item.node.runAction(cc.sequence(cc.delayTime(time),
				cc.spawn(cc.moveTo(0.1, cc.v2()), cc.scaleTo(0.1, 1)),
				cc.delayTime(0.1),
				cc.scaleTo(0.1, 0, 1),
				cc.callFunc(function() {
					this.spriteFrame = cc.RedT.util.card.getCard(data.card, data.type);
					data = null;
				}, item),
				cc.scaleTo(0.1, 1, 1),
			));
		}else{
			item.spriteFrame = cc.RedT.util.card.cardB1;
			let position = base.nodeCard.parent.convertToWorldSpaceAR(base.nodeCard.position);
			item.node.position = item.node.parent.convertToNodeSpaceAR(position);
			item.node.scaleX = base.nodeCard.width/item.node.width;
			item.node.scaleY = base.nodeCard.height/item.node.height;
			item.node.angle  = 0;
			item.node.active = true;
			item.node.runAction(cc.sequence(cc.delayTime(time),
				cc.spawn(cc.moveTo(0.1, item.node.defaultPosition), cc.rotateTo(0.1, item.node.defaultAngle), cc.scaleTo(0.1, 1)),
			));
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
				if (cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this) {
					cc.RedT.user.red = data.balans;
				}
			}
			!!data.name && (this.nickname.string = data.name);
			if (data.betChuong !== void 0) {
				this.nodeDealer.active = !!data.betChuong;
				this.betDealer.string = helper.numberWithCommas(data.betChuong);
			}
			if (data.betGa !== void 0) {
				this.nodeChicken.active = !!data.betGa;
				this.betChicken.string = helper.numberWithCommas(data.betGa);
			}
			if (data.isBetChuong && cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this) {
				cc.RedT.inGame.nodeSelectGa.active = true;
			}
			if (void 0 !== data.bet) {
				let bet = data.bet>>0;
				if (bet > 0) {
					this.noticeBet(bet, '', 3.5, 28, cc.RedT.inGame.font1, true);
				}
			}
			if (data.openCard !== void 0 && cc.RedT.inGame.player[cc.RedT.inGame.meMap] !== this) {
				this.openCard(data.openCard);
			}
			if (data.avatar !== void 0) {
				this.setAvatar(data.avatar);
			}
			if (data.progress !== void 0) {
				this.startProgress(data.progress);
			}
			if (data.round !== void 0) {
				if (data.round == 1 && cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this) {
					if (this.ic_dealer.active) {
						cc.RedT.inGame.nodeSelectChuong.active = false;
						cc.RedT.inGame.nodeSelectGa.active = true;
					}else{
						cc.RedT.inGame.nodeSelectChuong.active = true;
						cc.RedT.inGame.nodeSelectGa.active = false;
					}
				}
			}
		}else{
			this.resetGame();
			this.node.active = false;
		}
	},
	openCard: function(data){
		this.isLat = true;
		this.item.forEach(function(item, index){
			let card = data.card[index];
			item.node.runAction(cc.sequence(
				cc.scaleTo(0.1, 0, 1),
				cc.callFunc(function() {
					this.spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
				}, item),
				cc.scaleTo(0.1, 1, 1),
			));
		});
	},
	startProgress: function(time) {
		this.progress.progress = 0;
		this.progressTime = time;
		this.oldTime  = new Date().getTime();
		this.isUpdate = true;
	},
	resetGame: function(){
		this.item.forEach(function(item){
			item.node.color  = item.node.color.fromHEX('FFFFFF');
			item.node.active = false;
		});
		this.nodeChicken.active = false;
		this.nodeDealer.active = false;
		this.isLat = false;
		this.status.destroyAllChildren();

		//this.resetStatus();
		//this.bgWin.active = false;
		//this.bet.string = '';
		this.isOpen = false;
	},
	noticeBet: function(bet, t, time, size, font, destroy = false){
		let temp = new cc.Node;
		temp.addComponent(cc.Label);
		temp = temp.getComponent(cc.Label);
		temp.string = t + helper.numberWithCommas(bet);
		temp.font = font;
		temp.lineHeight = 40;
		temp.fontSize   = size;
		temp.spacingX   = -4;
		this.status.addChild(temp.node);
		let y = 33;
		let x = t.length == 0 ? 0 : (t == '+' ? -8 : -3);
		if (cc.RedT.inGame.mePlayer === this) {
			x = t.length == 0 ? 0 : (t == '+' ? -8 : -4);
			y = 59;
		}
		if (destroy) {
			temp.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(x, y)), cc.delayTime(time), cc.callFunc(function(){
				this.destroy();
			}, temp.node)));
		}
	},
	update: function(t){
		if (this.isUpdate === true) {
			let h = new Date().getTime();
			let progress = ((h-this.oldTime)/1000)/this.progressTime;
			this.progress.progress = progress+(t/this.progressTime);
			if (this.progress.progress >= 1) {
				this.progress.progress = 0;
				this.progressTime = 0;
				this.isUpdate = false;
			}
		}
	},
});
