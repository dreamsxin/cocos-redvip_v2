
cc.Class({
	extends: cc.Component,

	properties: {
		fish:     dragonBones.ArmatureDisplay,
		shadow:   dragonBones.ArmatureDisplay,
		collider: cc.PolygonCollider,
		anim:     cc.Animation,
		head:     cc.Node,
		end:      cc.Node,

		suoMe:    cc.Node,
		suoOther: cc.Node,
	},
	init: function(obj, data){
		this.RedT      = obj;
		this.id        = data.id;
		this.node.id   = data.id;
		this.node.fish = data.f;
		this.player1 = false;
		this.player2 = false;
		this.player3 = false;
		this.player4 = false;
		this.bullet1 = {};
		this.bullet2 = {};
		this.bullet3 = {};
		this.bullet4 = {};
		if (!!this.anim) {
			this.anim.on('finished', this.onFinish, this);
			if (void 0 !== data.r) {
				this.anim.play(this.anim.getClips()[data.r].name);
			}
			if (void 0 !== data.a) {
				this.anim.play(data.a);
			}
		}
	},
	onFinish: function(){
		if (this.node) {
			this.clear();
			this.node.destroy();
			delete this.RedT;
		}
	},
	onDelete: function(){
		this.node.destroy();
		delete this.RedT;
	},
	updateGroup: function() {
		let group = 'fish';
		if (!!this.player1) {
			group += '1';
		}
		if (!!this.player2) {
			group += '2';
		}
		if (!!this.player3) {
			group += '3';
		}
		if (!!this.player4) {
			group += '4';
		}
		if (this.node) {
			this.node.group = group;
		}
		this.updateSuoOther();
	},
	unLock: function(map){
		let player = this['player'+map];
		if (!!player) {
			player.isLock = false;
			player.fish   = null;
		}
		Object.entries(this['bullet'+map]).forEach(function(bullet){
			bullet[1].isLock = false;
			bullet[1].updateGroup();
			delete this['bullet'+map][bullet[0]];
		}.bind(this));
		this['player'+map] = false;
		this.updateGroup();
	},
	updateSuoOther: function(){
		let suoding = false;
		if (!!this.player1 && this.player1 !== this.RedT.player) {
			suoding = true;
		}
		if (!!this.player2 && this.player2 !== this.RedT.player) {
			suoding = true;
		}
		if (!!this.player3 && this.player3 !== this.RedT.player) {
			suoding = true;
		}
		if (!!this.player4 && this.player4 !== this.RedT.player) {
			suoding = true;
		}
		this.suoOther.active = suoding;
	},
	getPoint: function(){
		let width     = this.RedT.node.width/2 - 20;
		let height    = this.RedT.node.height/2 - 20;

		let headPoint    = this.head.parent.convertToWorldSpaceAR(this.head.position);
		let position = this.RedT.node.parent.convertToNodeSpaceAR(headPoint);

		let headX = Math.abs(position.x);
		let headY = Math.abs(position.y);

		if (width < headX || height < headY) {
			if (this.end) {
				let endPoint    = this.end.parent.convertToWorldSpaceAR(this.end.position);
				let positionEnd = this.RedT.node.parent.convertToNodeSpaceAR(endPoint);
				let endX = Math.abs(positionEnd.x);
				let endY = Math.abs(positionEnd.y);

				let check = this.node.scaleX*this.node.parent.scaleX;

				if (width < headX){
					headX = headX-(headX-width);
					if (endX < headX) {
						// huy ban
						this.PhaHuy();
						return positionEnd;
					}
					if (check === 1) {
						position.x = position.x+(headX-width);
					}else{
						position.x = position.x-(headX-width);
					}
				}
				if (height < headY){
					headY = headY-(headY-height);
					if (endY < headY) {
						// huy ban
						this.PhaHuy();
						return positionEnd;
					}
					if (check === 1) {
						position.y = position.y+(headY-height);
					}else{
						position.y = position.y-(headY-height);
					}
				}
			}
		}
		return position;
	},
	PhaHuy: function(data){
		this.collider.enabled = false;
		this.anim.stop();
		this.clear();

		this.suoMe.active    = false;
		this.suoOther.active = false;

		this.fish.timeScale   = 2;
		this.shadow.timeScale = 2;
	},
	clear: function(){
		delete this.RedT.fish[this.node.id];
		if (!!this.player1) {
			this.player1.isLock = false;
			this.player1.fish   = null;
			delete this.player1;
		}
		Object.entries(this.bullet1).forEach(function(bullet){
			bullet[1].isLock = false;
			bullet[1].updateGroup();
			delete this.bullet1[bullet[0]];
		}.bind(this));
		if (!!this.player2) {
			this.player2.isLock = false;
			this.player2.fish   = null;
			delete this.player2;
		}
		Object.entries(this.bullet2).forEach(function(bullet){
			bullet[1].isLock = false;
			bullet[1].updateGroup();
			delete this.bullet2[bullet[0]];
		}.bind(this));
		if (!!this.player3) {
			this.player3.isLock = false;
			this.player3.fish   = null;
			delete this.player3;
		}
		Object.entries(this.bullet3).forEach(function(bullet){
			bullet[1].isLock = false;
			bullet[1].updateGroup();
			delete this.bullet3[bullet[0]];
		}.bind(this));
		if (!!this.player4) {
			this.player4.isLock = false;
			this.player4.fish   = null;
			delete this.player4;
		}
		Object.entries(this.bullet4).forEach(function(bullet){
			bullet[1].isLock = false;
			bullet[1].updateGroup();
			delete this.bullet4[bullet[0]];
		}.bind(this));
	},
});
