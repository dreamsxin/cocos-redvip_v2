
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
	},

	init() {
		Promise.all(this.node.children.map(function(obj){
			return obj.getComponent('TheCao_item');
		}))
		.then(resulf => {
			this.TheCao = resulf;
		});
	},
	onEnable: function () {
        this.node.runAction(cc.RedT.dialog.actionShow);
    },
    onDisable: function () {
        cc.RedT.dialog.resetSizeDialog(this.node);
    },
	onData: function(data){
		this.setData(data);
		cc.RedT.loading.active = false;
		if (cc.RedT.dialog.objShow) {
			cc.RedT.dialog.objShow.active = false;
			this.node.previous = cc.RedT.dialog.objShow;
		}
		this.node.active = cc.RedT.dialog.node.active = true;
		cc.RedT.dialog.objShow = this.node;
	},
	getData: function(id){
		cc.RedT.loading.active = true;
		cc.RedT.send({user:{history:{the_cao: id}}});
	},
	setData: function(data){
		Promise.all(this.TheCao.map(function(TheCao, index){
			var info = data[index];
			if (void 0 !== info) {
				TheCao.node.active = true;
				TheCao.NhaMang.string = info.nhaMang;
				TheCao.MenhGia.string = Helper.numberWithCommas(info.menhGia);
				TheCao.SoThe.string   = info.maThe;
				TheCao.Seri.string    = info.seri;
				TheCao.HetHan.string  = info.time;
			}else{
				TheCao.node.active = false;
			}
		}))
	},
});
