
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		textType: {
            default: null,
            type:    cc.Label
        },
        nodeChonTien: {
            default: null,
            type:    cc.Node
        },
        nodeChonSo: {
            default: null,
            type:    cc.Node
        },
	},
	init (obj) {
		this.RedT = obj;
	},
	ChonTienClick: function(event, value) {
		this.RedT.input.string = helper.numberWithCommas(helper.getOnlyNumberInString(this.RedT.input.string)*1+value*1);
	},
	ChonSoClick: function(event, value) {
		this.RedT.input.string = helper.numberWithCommas(helper.getOnlyNumberInString(this.RedT.input.string+value));
	},
	onBackClick: function(){
		this.RedT.input.string = helper.numberWithCommas(this.RedT.input.string.slice(0, this.RedT.input.string.length-1));
	},
	onCleanClick: function(){
		this.RedT.input.string = "";
	},
	onAllClick: function(){
	},
	onChangerTypeClick: function(){
		if (this.nodeChonTien.active) {
			this.nodeChonTien.active = false;
			this.nodeChonSo.active = true;
			this.textType.string = "CHỌN";
		}else{
			this.nodeChonSo.active = false;
			this.nodeChonTien.active = true;
			this.textType.string = "SỐ KHÁC";
		}
	},
	onCuocClick: function(){
	},
	onCloseClick: function(){
		this.node.active = false;
	},
});
