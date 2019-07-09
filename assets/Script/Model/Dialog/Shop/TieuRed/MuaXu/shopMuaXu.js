
var helper      = require('Helper');
var BrowserUtil = require('BrowserUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        xu: {
            default: null,
            type: cc.Label,
        },
        red: {
            default: null,
            type: cc.EditBox,
        },
    },
    onLoad(){
        var self = this;
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onClickMua(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        this.clean();
    },
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        BrowserUtil.getHTMLElementByEditBox(this.red).addEventListener("keydown", this.keyHandle, !1)
    },
    removeEvent: function() {
        BrowserUtil.getHTMLElementByEditBox(this.red).removeEventListener("keydown", this.keyHandle, !1)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onClickMua();
        }
    },
    changeNextFocusEditBox: function() {
        BrowserUtil.focusEditBox(this.red)
    },
    isTop: function() {
        return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function(){
        this.red.string = '';
    },
    onChanger: function(red) {
        var value    = helper.getOnlyNumberInString(red);
        var valueRed = helper.numberWithCommas(value);

        this.xu.string  = helper.numberWithCommas(value*3);
        this.red.string = valueRed == "0" ? "" : valueRed;
    },
    onClickMua: function() {
        if (parseInt(helper.getOnlyNumberInString(this.red.string)) < 1000) {
            cc.RedT.inGame.notice.show({title: "MUA XU", text: "Số RED mua XU tối thiểu là 1.000"})
        }else{
            cc.RedT.send({shop:{mua_xu:{red: helper.getOnlyNumberInString(this.red.string)}}});
        }
    },
});
