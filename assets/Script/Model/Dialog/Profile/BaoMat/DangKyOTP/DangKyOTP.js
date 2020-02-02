
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		phone: {
			default: null,
			type:    cc.EditBox,
		},
		nodeReg:  cc.Node,
		nodeInfo: cc.Node,
		labelPhone:  cc.Label,
		labelStatus: cc.Label,
	},
	onLoad () {
	},
	onEnable: function () {
	},
	onDisable: function () {
		this.clear();
	},
	onRegClick: function() {
		if (!helper.checkPhoneValid(this.phone.string))
		{
			cc.RedT.inGame.notice.show({title:'LỖI!', text: 'Số điện thoại không hợp lệ.'});
		}else{
			cc.RedT.send({user:{security:{regPhone:this.phone.string}}});
		}
	},
	clear: function(){
		this.phone.string = "";
	},
	statusOTP: function(status){
		this.nodeReg.active  = !status;
		this.nodeInfo.active = status;
		if (cc.RedT.user.veryphone) {
			this.labelStatus.string = 'Đã Xác Thực';
			this.labelStatus.node.color  = this.labelStatus.node.color.fromHEX('06B30D');
		}else{
			this.labelStatus.string = 'Chưa Xác Thực';
			this.labelStatus.node.color  = this.labelStatus.node.color.fromHEX('FF0000');
		}
	},
});
