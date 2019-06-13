
cc.Class({
    extends: cc.Component,

    properties: {
        nodeUsers: {
            default: null,
            type: cc.Node,
        },
        nodeGuest: {
            default: null,
            type: cc.Node,
        },
        exp: {
            default: null,
            type: cc.Node,
        },
        userName: {
            default: null,
            type: cc.Label,
        },

        userRed: {
            default: null,
            type: cc.Label,
        },
        userXu: {
            default: null,
            type: cc.Label,
        },
        expFull: 0,
    },
    isSignIn: function() {
        this.nodeUsers.active = true;
        this.nodeGuest.active = false;
    },
    isSignOut: function() {
        this.userName.string = this.userRed.string = this.userXu.string = '';
        this.nodeUsers.active = false;
        this.nodeGuest.active = true;
    },
});
