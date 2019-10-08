
cc.Class({
    extends: cc.Component,

    properties: {
        box_chan:   cc.Node,
        box_le:     cc.Node,
        box_red3:   cc.Node,
        box_red4:   cc.Node,
        box_white3: cc.Node,
        box_white4: cc.Node,

        total_chan:   cc.Label,
        total_le:     cc.Label,
        total_red3:   cc.Label,
        total_red4:   cc.Label,
        total_white3: cc.Label,
        total_white4: cc.Label,

        me_chan:   cc.Label,
        me_le:     cc.Label,
        me_red3:   cc.Label,
        me_red4:   cc.Label,
        me_white3: cc.Label,
        me_white4: cc.Label,

        me_name:   cc.Label,
        me_balans: cc.Label,

        labelTime: cc.Label,
        timeWait:  cc.Label,
        nodeTime:  cc.Node,
        nodeWait:  cc.Node,

        users_bg:    cc.Node,
        users_count: cc.Label,

        chip_1000:    cc.SpriteFrame,
        chip_10000:   cc.SpriteFrame,
        chip_50000:   cc.SpriteFrame,
        chip_100000:  cc.SpriteFrame,
        chip_1000000: cc.SpriteFrame,

        dot_red:   cc.SpriteFrame,
        dot_white: cc.SpriteFrame,

        redH:    cc.Node,
        notice:  cc.Node,

        red: true,
    },

    /**
    var position = node.parent.convertToWorldSpaceAR(node.position);
    position = canvasNode.convertToNodeSpaceAR(position);
    */
    onLoad () {
        console.log(this);
    },
});
