
cc.Class({

    extends: cc.Component,

    init(obj){
        this.RedT = obj;
        this.icons = [];
        var self  = this;
        console.log(this)
        Promise.all([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map(function(obj, index){
            var icon = cc.instantiate(self.RedT.iconPrefab);
            self.node.addChild(icon);
            icon = icon.getComponent('BigBabol_reel_item');
            icon.init(self.RedT);
            if (index > 2 && index < 23) {
                icon.stop();
                icon.random();
            }
            return icon;
        }))
        .then(result => {
            this.icons = result;
            this.icons[25].setIcon(this.icons[2].random());
            this.icons[24].setIcon(this.icons[1].random());
            this.icons[23].setIcon(this.icons[0].random());
        });
    },
    spin: function(index){
        this.node.stopAllActions();
        var self = this;
        var d = cc.moveTo(2, cc.v2(this.node.x,-(this.node.height-260))).easing(cc.easeInOut(2));
        var p = cc.callFunc(function() {
            //this.RedT.copy();
            this.node.y = 0;
            this.RedT.random();
        }, this);
        var p2 = cc.callFunc(function() {
            if (index === 0) {
                this.RedT.copy();
            }
            this.node.y = 0;
        }, this);

        if (index === 2){
            var e = cc.callFunc(function() {
                if (this.RedT.isAuto)
                    this.RedT.onGetSpin()
                else
                    this.RedT.offSpin()
            }, this);
            /**
            if (!!this.RedT.data){
                var offEf = cc.callFunc(function() {
                    if (this.RedT.data.code == 9 && this.RedT.isAuto) {
                        this.RedT.onClickStop();
                    }
                }, this);
                this.node.runAction(cc.sequence(d, p, onEf, this.RedT.delay1(), offEf, this.RedT.delay2(), e));
            }else{
                */
                var onEf = cc.callFunc(function() {
                    this.RedT.hieuUng();
                }, this);
                this.node.runAction(cc.sequence(cc.delayTime(index*0.1), d, p, onEf, this.RedT.delay1(), e));
            //}
        } else
            this.node.runAction(cc.sequence(cc.delayTime(index*0.1), d, p2));
    },
    stop: function(){
        this.node.stopAllActions();
        this.RedT.copy();
        this.node.y = 0;
    },
});
