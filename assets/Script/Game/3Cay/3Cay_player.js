
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
        isAll:    false,
        isHuy:    false,
    },
    init: function(){
        this.item = this.card.children.map(function(item){
            item.defaultPosition = item.position;
            item.defaultAngle    = item.angle;
            return item.getComponent(cc.Sprite);
        });
    },
});
