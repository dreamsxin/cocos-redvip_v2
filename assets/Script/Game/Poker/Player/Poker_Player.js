
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
			this.resetGame();
		}
	},
	infoGame: function(info){
		if (void 0 !== info.hoa) {
			this.resetStatus(true);
			this.miniStatus(cc.RedT.inGame.spriteHoa);
		}
		if (void 0 !== info.to) {
			cc.RedT.inGame.resetStatus(false);
			this.miniStatus(cc.RedT.inGame.spriteCuoc);
		}
		if (void 0 !== info.win) {
			this.resetStatus(true);
		}
		if (void 0 !== info.lost) {
			this.resetStatus(true);
			this.miniStatus(cc.RedT.inGame.spriteLost);
		}
		if (void 0 !== info.theo) {
			this.miniStatus(cc.RedT.inGame.spriteTheo);
		}
		if (void 0 !== info.xem) {
			if (!this.isAll && !this.isHuy) {
				this.miniStatus(cc.RedT.inGame.spriteXem);
			}
		}
		if (void 0 !== info.huy) {
			this.isHuy = true;
			this.resetStatus(true);
			this.miniStatus(cc.RedT.inGame.spriteHuy);
		}
		if (void 0 !== info.all) {
			this.isAll = true;
			this.resetStatus(true);
			this.miniStatus(cc.RedT.inGame.spriteAll);
		}
	},
	miniStatus: function(sprite){
		let status = new cc.Node;
		status = status.addComponent(cc.Sprite);
		status.spriteFrame = sprite;
		this.status.addChild(status.node);
		let y = 33;
		if (cc.RedT.inGame.player[cc.RedT.inGame.meMap] === this) {
			y = 52;
		}
		status.node.runAction(cc.moveTo(0.25, cc.v2(0, y)));
	},
	startProgress: function(time) {
		this.Progress.progress = 0;
		this.progressTime = time;
		this.isUpdate = true;
	},
	setProgress: function(time, progress) {
		this.Progress.progress = progress;
		this.progressTime = time;
		this.isUpdate = true;
	},
	resetGame: function(){
		this.item.forEach(function(item){
			item.node.active = false;
		}.bind(this));
		this.isAll = false;
		this.isHuy = false;
		this.resetStatus(true);
		this.bet.string = '';
	},
	resetStatus: function(cp = false){
		if (!this.isAll && !this.isHuy || cp === true) {
			this.status.destroyAllChildren();
		}
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
