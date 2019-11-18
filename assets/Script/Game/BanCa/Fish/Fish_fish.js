
cc.Class({
	extends: cc.Component,

	properties: {
		fish:     dragonBones.ArmatureDisplay,
		shadow:   dragonBones.ArmatureDisplay,
		body:     cc.RigidBody,
		collider: cc.PhysicsPolygonCollider,
		anim:     cc.AnimationState,
	},
	init: function(id){
		this.id = id;
		this.player1 = false;
		this.player2 = false;
		this.player3 = false;
		this.player4 = false;
		this.bullet1 = {};
		this.bullet2 = {};
		this.bullet3 = {};
		this.bullet4 = {};

		// 
	},
	updateGroup: function() {
		let group = 'fish';
		if (this.player1) {
			group += 1;
		}
		if (this.player2) {
			group += 2;
		}
		if (this.player3) {
			group += 3;
		}
		if (this.player4) {
			group += 4;
		}
		this.node.group = group;
	},
});
