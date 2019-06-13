
cc.Class({
	extends: cc.Component,

	properties: {
		status: {
			default: null,
			type:    cc.Label,
		},
		button: {
			default: null,
			type:    cc.Label,
		},
		otp: {
			default: null,
			type:    cc.EditBox,
		},
	},
	changerStatus: function(status) {
		this.dataS = status;
		if (status) {
			this.status.string = "Đã Kích Hoạt";
			this.button.string = "KÍCH HOẠT";
			this.status.node.color = cc.color(0, 255, 71, 255);
		}else{
			this.status.string = "Chưa Kích Hoạt";
			this.button.string = "HUỶ";
			this.status.node.color = cc.color(255, 0, 0, 255);
		}
	},
	onGetOTPClick: function() {
    },
    onRegOTPClick: function() {
    },
});
