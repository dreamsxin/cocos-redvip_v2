
var TX_Main    = require('TaiXiuMain'),
 	TX_ThongKe = require('TaiXiuThongKe'),
 	TX_Top     = require('TaiXiuTop');

cc.Class({
	extends: cc.Component,
	properties: {
		TX_Main:    TX_Main,
		TX_ThongKe: TX_ThongKe,
		TX_Top:     TX_Top,
	},
	init(obj){
		this.getLogs = false;
		this.TX_Main.init(this);
		this.TX_ThongKe.init(this);
		this.TX_Top.init(this);
		this.TX_LichSu      = obj.Dialog.TaiXiuLichSu;
		this.TX_LichSuPhien = obj.Dialog.TaiXiuLichSuPhien;
	},
	onEnable: function () {
		this.regEvent(true);
	},
	onDisable: function () {
		this.regEvent(false);
	},
	regEvent: function(bool){
		cc.RedT.send({taixiu: !this.TX_Main.getLogs ? {view: bool, getLogs:true} : {view: bool}});
	},
	setTop: function(){
		this.node.parent.insertChild(this.node);
	},
	openGame: function () {
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN)
			this.node.active = !0;
		else
			cc.RedT.dialog.showSignIn();
	},
	closeGame: function () {
		cc.RedT.audio.playUnClick();
		this.node.active = this.TX_Top.node.active = this.TX_ThongKe.node.active = this.TX_Main.TX_Board.node.active = !1;
	},
	newGame: function(){
		this.TX_ThongKe.node.active = this.TX_Main.TX_Board.node.active = false;
		this.TX_Main.setDefautl();
	},
	signIn:function(){
        !this.node.active && (this.TX_Main.nodeTimePopup.active = true);
    },
});
