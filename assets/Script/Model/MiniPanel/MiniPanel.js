
var TaiXiu    = require('TaiXiu'),
	MiniPoker = require('MiniPoker'),
	BigBabol  = require('BigBabol'),
	BauCua    = require('BauCua'),
	BaCay     = require('Mini3Cay'),
	TopHu     = require('popupTopHu'),
	Dialog    = require('MiniDialog');

cc.Class({
	extends: cc.Component,

	properties: {
		minigame: {
			default: null,
			type: cc.Node
		},
		Dialog:    Dialog,
		TaiXiu:    TaiXiu,
		MiniPoker: MiniPoker,
		BigBabol:  BigBabol,
		BauCua:    BauCua,
		BaCay:     BaCay,
		TopHu:     TopHu,

		bgLight:    cc.Node,
		spriteLight:      cc.Sprite,
		onLight:    cc.SpriteFrame,
		offLight:   cc.SpriteFrame,

		nodeEfect:  cc.Node,
		// Prefab
		PrefabNoHu: cc.Prefab,
		light:      true,
	},
	onLoad () {
		if (void 0 === cc.RedT.setting.light) {
			cc.RedT.setting.light = true;
		}
		var self = this;
		this.node._onPreDestroy = function(){
			self.onDestroy();
		}
		this.Dialog.init(this);
		this.TaiXiu.init(this);
		this.MiniPoker.init(this);
		this.BigBabol.init(this);
		this.BauCua.init(this);
		this.BaCay.init(this);

		this.TopHu.init(this);

		if (cc.RedT.IS_LOGIN){
			this.signIn();
		}
		if (cc.RedT.setting.light != this.light) {
			this.LightChanger();
		}
	},
	LightChanger: function(){
		this.light = cc.RedT.setting.light = !this.light;
		if (this.light) {
			this.bgLight.active = false;
			this.spriteLight.spriteFrame = this.offLight;
		}else{
			this.bgLight.active = true;
			this.spriteLight.spriteFrame = this.onLight;
		}
	},
	signIn:function(){
		this.minigame.active = true;
		this.TaiXiu.signIn();
	},
	newGame: function() {
		this.minigame.active = false;
		this.Dialog.onCloseDialog();
		this.TaiXiu.newGame();
		this.BauCua.newGame();
	},
	onData: function(data){
		if (void 0 !== data.poker){
			this.MiniPoker.onData(data.poker);
		}
		if (void 0 !== data.big_babol){
			this.BigBabol.onData(data.big_babol);
		}
		if (void 0 !== data.baucua){
			this.BauCua.onData(data.baucua);
		}
		if (void 0 !== data.bacay){
			this.BaCay.onData(data.bacay);
		}
	},
	onDestroy: function(){
		clearInterval(this.TaiXiu.TX_Main.timeInterval);
		clearInterval(this.BauCua.timeInterval);
	},
});
