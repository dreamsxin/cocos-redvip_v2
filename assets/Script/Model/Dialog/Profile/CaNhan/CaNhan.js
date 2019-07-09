
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		avatar: cc.Sprite,
		UID: {
			default: null,
			type:    cc.Label,
		},
		username: {
			default: null,
			type:    cc.Label,
		},
		phone: {
			default: null,
			type:    cc.Label,
		},
		email: {
			default: null,
			type:    cc.Label,
		},
		joinedOn: {
			default: null,
			type:    cc.Label,
		},

		nodeRank: cc.Node,
		nodeNhan: cc.Node,
		vipLevel: cc.Label,
		vipTong:  cc.Label,
		vipHien:  cc.Label,
		vipTiep:  cc.Label,
	},
	init(){
	},
	onEnable: function () {
		this.getLevel();
	},
	getLevel: function(){
		cc.RedT.send({user:{getLevel: true}});
	},
	level: function(data){
		var self = this;
		this.vipLevel.string = "VIP"+data.level;
		this.vipTong.string  = helper.numberWithCommas(data.vipTL);
		this.vipHien.string  = helper.numberWithCommas(data.vipHT);
		this.vipTiep.string  = helper.numberWithCommas(data.vipNext);
		Promise.all(this.nodeRank.children.map(function(rank, index){
			if (rank.name <= data.level) {
				rank.color = rank.color.fromHEX('#FFFFFF');
				self.nodeNhan.children[index].children[4].active = true;
			}else{
				rank.color = rank.color.fromHEX('#5F5F5F');
				self.nodeNhan.children[index].children[4].active = false;
			}
		}))
	},
});
