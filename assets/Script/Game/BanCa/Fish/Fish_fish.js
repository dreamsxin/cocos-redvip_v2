
cc.Class({
	extends: cc.Component,

	properties: {
		fish:     dragonBones.ArmatureDisplay,
		shadow:   dragonBones.ArmatureDisplay,
		collider: cc.PolygonCollider,
		anim:     cc.AnimationState,
		head:     cc.Node,
	},
	init: function(obj, data){
		//console.log(this);
		this.RedT      = obj;
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

		this.anim.on('finished', this.onFinish, this);

		if (void 0 !== data.r) {
			this.anim.play(this.anim.getClips()[data.r].name);
		}
		if (void 0 !== data.a) {
			this.anim.play(data.a);
		}
	},
	onFinish: function(){
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

		this.node.destroy();
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
	getPoint: function(){
		let width  = this.RedT.node.width/2;
		let height = this.RedT.node.height/2;
		let head = this.head.parent.convertToWorldSpaceAR(this.head.position);
		let position = this.node.parent.convertToNodeSpaceAR(head);
		return position;
	},
});
