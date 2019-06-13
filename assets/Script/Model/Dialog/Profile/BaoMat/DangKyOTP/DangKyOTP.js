
var BrowserUtil = require('BrowserUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        phone: {
            default: null,
            type:    cc.EditBox,
        },
        email: {
            default: null,
            type:    cc.EditBox,
        },
        cmt: {
            default: null,
            type:    cc.EditBox,
        },
        otp: {
            default: null,
            type:    cc.EditBox,
        },
    },
    onLoad () {
        var self = this;
        this.editboxs = [this.phone, this.email, this.cmt, this.otp];
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onRegOTPClick(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        this.clear();
    },
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
    removeEvent: function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onRegOTPClick();
        }
    },
    changeNextFocusEditBox: function() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++)
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                i <= ++e && (e = 0),
                BrowserUtil.focusEditBox(this.editboxs[e]),
                t = !0;
                break
            }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0])
    },
    isTop: function() {
        return !cc.RedT.notice.node.active && !cc.RedT.loading.active;
    },
    onGetOTPClick: function() {
    },
    onRegOTPClick: function() {
    },
    clear: function(){
        this.phone.string = this.email.string = this.cmt.string = this.otp.string = "";
    },
});
