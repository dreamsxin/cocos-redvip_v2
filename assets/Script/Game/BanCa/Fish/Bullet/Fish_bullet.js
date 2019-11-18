
cc.Class({
	extends: cc.Component,

	properties: {
		body:     cc.RigidBody,
		collider: cc.PhysicsCircleCollider,
		icon:     cc.Node,
		isMe:     false,
		isLock:   false,
		bullet:   0,
		id:       0,
		anim:     dragonBones.ArmatureDisplay,
	},
	init: function(obj, target){
		this.RedT = obj;

        var x = target.x;
        var y = target.y;

		this.node.x = this.RedT.node.x;
		this.node.y = this.RedT.node.y;

        var selfX = this.node.x;
        var selfY = this.node.y;

        var velocity = cc.v2(x-selfX, y-selfY);
        velocity.normalizeSelf();
        velocity.mulSelf(this.RedT.RedT.Game.bulletVelocity);

        this.body.linearVelocity = velocity;

        let positionUser = this.RedT.node.parent.convertToWorldSpaceAR(target);
		let position1_1  = this.RedT.node.convertToNodeSpaceAR(positionUser);
		position1_1 = cc.misc.radiansToDegrees(Math.atan2(position1_1.x, position1_1.y));
		this.icon.angle = -position1_1;
	},

	onBeginContact: function (contact, selfCollider, otherCollider) {
		if (otherCollider.node.group !== 'fish_box') {
			let ef_bullet = cc.instantiate(this.RedT.RedT.Game.ef_bullet[this.bullet]);
			ef_bullet.x = this.node.x;
			ef_bullet.y = this.node.y;
			this.RedT.RedT.Game.nodeDan.addChild(ef_bullet);
			this.node.destroy();
			if (this.isMe) {
				//
			}
		}
    },
	onEndContact: function () {
		let vecNew = this.body.linearVelocity;
		vecNew = cc.misc.radiansToDegrees(Math.atan2(vecNew.x, vecNew.y));
		this.icon.angle = -vecNew;
	},
	updateGroup: function() {
		let group = 'dan';
		if (this.isLock) {
			group += this.RedT.map;
		}
		this.node.group = group;
	},
});
