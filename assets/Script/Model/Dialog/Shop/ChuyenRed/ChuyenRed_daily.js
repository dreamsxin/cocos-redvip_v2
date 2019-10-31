
cc.Class({
	extends: cc.Component,

	properties: {
		bg: cc.Node,
		DaiLy: cc.Label,
		NICKNAME: cc.Label,
		Phone: cc.Label,
		FB: "",
	},
	init: function(obj, data) {
		this.controll = obj;
		this.DaiLy.string = data.name;
		this.NICKNAME.string = data.nickname;
		this.Phone.string = data.phone;
		this.FB = "https://facebook.com/" + data.fb;
	},
	onChuyenClick: function(){
		cc.RedT.audio.playClick();
		this.controll.selectDaiLy(this);
	},
	onFBClick: function(){
		window.open(this.FB, '_blank');
	},
});
