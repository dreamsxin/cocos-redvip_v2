
var DangKyOTP      = require('DangKyOTP'),
	BaoMatDangNhap = require('BaoMatDangNhap'),
	DoiMatKhau     = require('DoiMatKhau'),
	BaoMatGame     = require('BaoMatGame'),
	BaoMatTaiKhoan = require('BaoMatTaiKhoan');

cc.Class({
    extends: cc.Component,

    properties: {
    	header: {
			default: null,
			type:    cc.Node,
		},
    	DangKyOTP:      DangKyOTP,
    	BaoMatDangNhap: BaoMatDangNhap,
    	DoiMatKhau:     DoiMatKhau,
    	BaoMatGame:     BaoMatGame,
    	BaoMatTaiKhoan: BaoMatTaiKhoan,
    },
    init(){
    },
    onLoad(){
    	this.body = [this.DangKyOTP.node, this.BaoMatDangNhap.node, this.DoiMatKhau.node, this.BaoMatGame.node, this.BaoMatTaiKhoan.node];
    	Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
    },
    onSelectHead: function(event, name){
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		}));
		Promise.all(this.body.map(function(body) {
			if (body.name == name) {
				body.active = true;
			}else{
				body.active = false;
			}
		}));
	},
});
