
var BrowserUtil = require('BrowserUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        username: {
            default: null,
            type: cc.EditBox,
        },
        password: {
            default: null,
            type: cc.EditBox,
        },
        repassword: {
            default: null,
            type: cc.EditBox,
        },
    },
    onLoad () {
        var self = this;
        this.editboxs = [this.username, this.password, this.repassword];
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onSignUpClick(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.escape ? (cc.RedT.dialog.onClickBack(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
        this.node.runAction(cc.RedT.dialog.actionShow);
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        this.clean();
        cc.RedT.dialog.resetSizeDialog(this.node);
    },
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
    removeEvent: function() {
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.escape:
                this.isTop() && cc.RedT.dialog.onClickBack();
                break;
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onSignUpClick();
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
    clean: function(){
        this.username.string = this.password.string = this.repassword.string = '';
    },
    onSignUpClick: function() {
        var error = null;

        if (this.username.string.length > 32 || this.username.string.length < 3)
            error = 'Độ dài Tên tài khoản 3 - 32 ký tự!!';
        else if (this.password.string.length > 32 || this.password.string.length < 6)
            error = 'Độ dài mật khẩu 6 - 32 ký tự!!';
        else if (this.password.string !== this.repassword.string)
            error = 'Xác nhận mật khẩu không khớp!';
        //else if (input_signUpCaptcha.captcha !== captcha)
        //  error = 'Captcha không đúng, gợi ý: 1+1=2!!';
        else if (this.username.string == this.password.string)
            error = 'Tài khoản không được trùng với mật khẩu!!';
        else if (this.username.string.match(new RegExp("^[a-zA-Z0-9]+$")) === null)
            error = 'Tên chỉ gồm Chữ và Số!';

        if (error) {
            cc.RedT.notice.show({title:"ĐĂNG KÝ", text:error});
            return;
        };
        cc.RedT.auth({authentication:{username: this.username.string, password: this.password.string, register: true}});
    },
});
