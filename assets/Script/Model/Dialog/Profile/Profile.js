
cc.Class({
    extends: cc.Component,

    properties: {
        header: {
            default: null,
            type:    cc.Node,
        },
        CaNhan: {
            default: null,
            type:    cc.Node,
        },
        KetSat: {
            default: null,
            type:    cc.Node,
        },
        LichSu: {
            default: null,
            type:    cc.Node,
        },
        BaoMat: {
            default: null,
            type:    cc.Node,
        },
    },
    init(){
        this.CaNhan = this.CaNhan.getComponent('CaNhan');
        this.KetSat = this.KetSat.getComponent('KetSat');
        this.LichSu = this.LichSu.getComponent('LichSu');
        this.BaoMat = this.BaoMat.getComponent('BaoMat');

        this.CaNhan.init();
        this.KetSat.init();
        //this.LichSu.init();
        this.BaoMat.init();

        this.body = [this.CaNhan, this.KetSat, this.LichSu, this.BaoMat];
        Promise.all(this.header.children.map(function(obj) {
            return obj.getComponent('itemHeadMenu');
        }))
        .then(result => {
            this.header = result;
        });
    },
    onEnable: function () {
		cc.RedT.inGame.header.node.active = false;
	},
	onDisable: function () {
		cc.RedT.inGame.header.node.active = true;
	},
    onSelectHead: function(event, name){
        Promise.all(this.header.map(function(header) {
            if (header.node.name == name) {
                header.select();
            }else{
                header.unselect();
            }
        }));
        Promise.all(this.body.map(function(body) {
            if (body.node.name == name) {
                body.node.active = true;
            }else{
                body.node.active = false;
            }
        }));
    },
    superView:function(name){
        if(name == "CaNhan"){
            this.onSelectHead(null, "CaNhan");
            //if (name != "CaNhan") this.CaNhan.onSelectHead(null, name);
        }else if(name == "KetSat"){
            this.onSelectHead(null, "KetSat");
            //if (name != "TieuRed") this.TieuRed.onSelectHead(null, name);
        }else if(name == "LichSu"){
            this.onSelectHead(null, "LichSu");
            //if (name != "TieuRed") this.TieuRed.onSelectHead(null, name);
        }else if(name == "BaoMat"){
            this.onSelectHead(null, "BaoMat");
            //if (name != "TieuRed") this.TieuRed.onSelectHead(null, name);
        }
    },
    onData: function(data){
        if (void 0 !== data.history){
            this.LichSu.onData(data.history);
        }
        if (void 0 !== data.the_cao){
            cc.RedT.inGame.dialog.the_cao.onData(data.the_cao);
        }
        if (void 0 !== data.chuyen_red){
            //this.ChuyenRed.onData(data.chuyen_red);
        }
        if (void 0 !== data.level){
            this.CaNhan.level(data.level);
            cc.RedT.inGame.header.level(data.level.level);
            cc.RedT.inGame.header.updateEXP(data.level.vipHT, data.level.vipNext);
        }
    },
});
