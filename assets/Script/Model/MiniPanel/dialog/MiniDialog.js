
var TaiXiuLichSuPhien = require('TaiXiuLichSuPhien'),
    TaiXiuLichSu      = require('TaiXiuLichSu'),
    MiniPoker_LichSu  = require('MiniPoker_LichSu'),
    MiniPoker_Top     = require('MiniPoker_Top'),
    BigBabol_LichSu   = require('BigBabol_LichSu'),
    BigBabol_Top      = require('BigBabol_Top');

cc.Class({
    extends: cc.Component,

    properties: {
        TaiXiuLichSuPhien: TaiXiuLichSuPhien,
        TaiXiuLichSu:      TaiXiuLichSu,
        MiniPoker_LichSu:  MiniPoker_LichSu,
        MiniPoker_Top:     MiniPoker_Top,
        BigBabol_LichSu:   BigBabol_LichSu,
        BigBabol_Top:      BigBabol_Top,
    },

    init: function(obj) {
        this.objShow    = null;
        this.objTmp     = null;
        this.TaiXiuLichSuPhien.init(obj.TaiXiu);
    },

    onClickBack: function(){
        cc.RedT.audio.playUnClick();
        this.onBack();
    },
    onBack: function(){
        if(this.objShow != null){
            if(void 0 == this.objShow.previous || null == this.objShow.previous){
                this.objShow.active = false;
                this.node.active    = false;
                this.objShow        = null;
            }else{
                this.objTmp              = this.objShow;
                this.objShow             = this.objShow.previous;
                this.objTmp.previous     = null;
                this.objTmp.active       = false;
                this.objShow.active      = true;
                this.objTmp              = null;
            }
        }else{
            this.node.active = false;
        }
    },
    onClosePrevious: function(obj){
        if(void 0 !== obj.previous && null !== obj.previous){
            this.onClosePrevious(obj.previous)
            obj.previous = null
        }
        obj.active = false
    },
    onCloseDialog: function(){
        if(this.objShow != null ){
            if(void 0 == this.objShow.previous || null == this.objShow.previous){
                this.objShow.active = this.node.active = false
                this.objShow        = null
            }else{
                this.onClosePrevious(this.objShow.previous)
                this.objShow.active          = this.node.active = false
                this.objShow.previous        = null
                this.objShow                 = null
            }
        }else{
            this.node.active = false
        }
    },

    // Show
    showTaiXiuLichSuPhien: function(){
        this.node.active = this.TaiXiuLichSuPhien.node.active = true;
        this.objShow     = this.TaiXiuLichSuPhien.node;
    },
    showTaiXiuLichSu: function(){
        this.node.active = this.TaiXiuLichSu.node.active = true;
        this.objShow     = this.TaiXiuLichSu.node;
    },
    showMiniPokerLichSu: function(){
        this.node.active = this.MiniPoker_LichSu.node.active = true;
        this.objShow     = this.MiniPoker_LichSu.node;
    },
    showMiniPokerTop: function(){
        this.node.active = this.MiniPoker_Top.node.active = true;
        this.objShow     = this.MiniPoker_Top.node;
    },
    showBigBabolLichSu: function(){
        this.node.active = this.BigBabol_LichSu.node.active = true;
        this.objShow     = this.BigBabol_LichSu.node;
    },
    showBigBabolTop: function(){
        this.node.active = this.BigBabol_Top.node.active = true;
        this.objShow     = this.BigBabol_Top.node;
    },
});
