
var Blob = require('blob');

cc.Class({
    extends: cc.Component,

    properties: {
        box:  cc.Node,
        blob: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        cc.director.getPhysicsManager().gravity = cc.v2();
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onTouchBegan: function (event) {
        var touchLoc = this.node.convertToNodeSpaceAR(event.touch.getLocation());

        var node = cc.instantiate(this.blob);
        var blob = node.getComponent(Blob);
        blob.init(this);
        blob.emitTo(touchLoc);

        node.active = true;
        this.box.addChild(node);
    },
});
