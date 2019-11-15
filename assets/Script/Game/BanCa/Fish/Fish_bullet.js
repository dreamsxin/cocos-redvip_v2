
cc.Class({
	extends: cc.Component,

	properties: {
		body:     cc.RigidBody,
		collider: cc.PhysicsCircleCollider,
		icon:     cc.Node,
		isMe:     false,
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
		//this.node.destroy();
		//this.anim.playAnimation(this.anim.getAnimationNames()[0], 1);
    },
	onEndContact: function () {
		let vecNew = this.body.linearVelocity;
		vecNew = cc.misc.radiansToDegrees(Math.atan2(vecNew.x, vecNew.y));
		this.icon.angle = -vecNew;
	},
});
