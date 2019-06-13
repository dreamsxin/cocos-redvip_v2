
var TaiXiu    = require('TaiXiu'),
    MiniPoker = require('MiniPoker'),
    BigBabol  = require('BigBabol'),
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
        TopHu:     TopHu,
    },
    init(){
    	this.Dialog.init(this);
        this.TaiXiu.init(this);
        this.MiniPoker.init(this);
        this.BigBabol.init(this);
    },
    signIn:function(){
        this.minigame.active = true;
        this.TaiXiu.signIn();
    },
    newGame: function() {
        this.minigame.active = false;
        this.Dialog.onCloseDialog();
        this.TaiXiu.newGame();
    },
    onData: function(data){
        if (void 0 !== data.poker){
            this.MiniPoker.onData(data.poker);
        }
        if (void 0 !== data.big_babol){
            this.BigBabol.onData(data.big_babol);
        }
    },
});
