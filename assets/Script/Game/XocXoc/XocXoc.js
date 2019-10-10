
let helper = require('Helper');
let notice = require('Notice');

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

        nodeDia: cc.Node,
        nodeBat: cc.Node,

        chip_1000:    cc.SpriteFrame,
        chip_10000:   cc.SpriteFrame,
        chip_50000:   cc.SpriteFrame,
        chip_100000:  cc.SpriteFrame,
        chip_1000000: cc.SpriteFrame,

        dot_red:   cc.SpriteFrame,
        dot_white: cc.SpriteFrame,

        redH:    cc.Node,
        miniNotice:  cc.Node,

        MiniPanel: cc.Prefab,
        loading:   cc.Node,
        notice:    notice,

        red: true,
    },

    /**
    var position = node.parent.convertToWorldSpaceAR(node.position);
    position = canvasNode.convertToNodeSpaceAR(position);
    */
    onLoad () {
        console.log(this);
        cc.RedT.inGame = this;
        var MiniPanel = cc.instantiate(this.MiniPanel);
        cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
        this.redH.insertChild(MiniPanel);
        cc.RedT.send({scene:"xocxoc", g:{xocxoc:{ingame:true}}});

        this.me_name.string = cc.RedT.user.name;
        this.me_balans.string = helper.numberWithCommas(cc.RedT.user.red);
    },
    onData: function(data) {
        console.log(data);
        if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.xocxoc){
			this.xocxoc(data.xocxoc);
		}
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
    },
    backGame: function(){
        cc.RedT.send({g:{xocxoc:{outgame:true}}});
        this.loading.active = true;
        void 0 !== this.timeOut && clearTimeout(this.timeOut);
        cc.director.loadScene('MainGame');
    },
    signOut: function(){
        cc.director.loadScene('MainGame', function(){
            cc.RedT.inGame.signOut();
        });
    },
    userData: function(data){
    	if (this.red) {
			this.me_balans.string = helper.numberWithCommas(data.red);
		}else{
			this.me_balans.string = helper.numberWithCommas(data.xu);
		}
    },
    xocxoc: function(data){
    },
});
