
// var smooth = require('smooth');

cc.Class({
    extends: cc.Component,

    properties: {
        bul:      cc.Node,
        body:     cc.RigidBody,
        collider: cc.PhysicsCircleCollider,
    },

    // use this for initialization
    init: function (obj) {
        this.RedT = obj;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    emitTo (target) {
        var x = target.x;
        var y = target.y;

        var selfX = this.node.x;
        var selfY = this.node.y;

        var velocity = cc.v2(x-selfX, y-selfY);
        velocity.normalizeSelf();
        velocity.mulSelf(1000);

        this.body.linearVelocity = velocity;

/**

        let positionUser = this.node.convertToWorldSpaceAR(target);
        let position1_1 = this.node.convertToNodeSpaceAR(positionUser);
        position1_1 = cc.misc.radiansToDegrees(Math.atan2(position1_1.x, position1_1.y));
        this.bul.angle = -position1_1;
        */
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
    },

    // will be called once when the contact between two colliders just about to end.
    onEndContact: function (contact, selfCollider, otherCollider) {
        let vecNew = this.body.linearVelocity;
        let position1_1 = cc.misc.radiansToDegrees(Math.atan2(vecNew.x, vecNew.y));
        this.bul.angle = -position1_1;
    },

    // will be called everytime collider contact should be resolved
    onPreSolve: function (contact, selfCollider, otherCollider) {

    },

    // will be called every time collider contact is resolved
    onPostSolve: function (contact, selfCollider, otherCollider) {
    }
});
