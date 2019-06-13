
var CkeckOut = require('CheckOut')

cc.Class({
	extends: cc.Component,

	properties: {
		NhacNen:  CkeckOut,
		NhacGame: CkeckOut,
	},
	onLoad(){
		if (!cc.RedT.isSoundBackground()) {
			this.NhacNen.OnChangerClick();
		}
		if (!cc.RedT.isSoundGame()) {
			this.NhacGame.OnChangerClick();
		}
	},
	onEnable: function () {
        this.node.runAction(cc.RedT.dialog.actionShow);
    },
    onDisable: function () {
        cc.RedT.dialog.resetSizeDialog(this.node);
    },
	setMusic: function(){
		var check = localStorage.getItem('SOUND_BACKGROUND');
		if(check == null || cc.RedT.isSoundBackground()){
			cc.RedT.setSoundBackground(true);
			cc.RedT.audio.playMusic();
		}
		check = localStorage.getItem('SOUND_GAME');
		if(check == null){
			cc.RedT.setSoundGame(true);
		}else{
			if (cc.RedT.isSoundGame()) {
				cc.RedT.audio.isSound = true;
			}else{
				cc.RedT.audio.isSound = false;
			}
		}
	},
	OnChangerNhacNen: function() {
		cc.RedT.setSoundBackground(this.NhacNen.isChecked);
		if (this.NhacNen.isChecked) {
			cc.RedT.audio.playMusic();
		}else{
			cc.RedT.audio.pauseMusic();
		}
	},
	OnChangerNhacGame: function() {
		cc.RedT.setSoundGame(this.NhacGame.isChecked);
		if (this.NhacGame.isChecked) {
			cc.RedT.audio.isSound = true;
		}else{
			cc.RedT.audio.isSound = false;
		}
	},
	OnSignOutClick: function() {
		cc.RedT.notice.show({title: "ĐĂNG XUẤT", text: "Xác nhận hành động.\nHành động thực hiện đăng xuất khỏi tài khoản này?", button:{type: "sign_out", text: "ĐĂNG XUẤT"}})
	},
});
