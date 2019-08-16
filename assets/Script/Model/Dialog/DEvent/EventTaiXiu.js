
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		menu:    cc.Node,
		content: cc.Node,
		item:    cc.Prefab,
		itemHT:  cc.Prefab,
		contentNowLeft:  cc.Node,
		contentNowRight: cc.Node,
		contentHQLeft:   cc.Node,
		contentHQRight:  cc.Node,
	},
	selectEvent: function(event) {
		if (event.target.name == "top") {
			this.onGetTop();
		}else if (event.target.name == "homqua") {
			this.onGetHomQua();
		}
		Promise.all(this.menu.children.map(function(menu){
			if (menu.name == event.target.name) {
				menu.children[0].active = true;
				menu.children[1].color  = cc.Color.BLACK;
			}else{
				menu.children[0].active = false;
				menu.children[1].color  = cc.Color.WHITE;
			}
		}));
		Promise.all(this.content.children.map(function(content){
			if (content.name == event.target.name) {
				content.active = true;
			}else{
				content.active = false;
			}
		}));
	},
	onGetTop: function(){
		cc.RedT.send({event:{taixiu:{getTop:   true}}});
	},
	onGetHomQua: function(){
		cc.RedT.send({event:{taixiu:{getTopHQ: true}}});
	},
	onData: function(data){
		if (!!data.topHT) {
			this.topHT(data.topHT);
		}
		if (!!data.topHQ) {
			this.topHQ(data.topHQ);
		}
	},
	topHT: function(data){
		this.contentNowLeft.removeAllChildren();
		this.contentNowRight.removeAllChildren();
		var self = this;
		Promise.all(data.win.map(function(user, index){
			var item = cc.instantiate(self.itemHT);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string         = index+1;
            item.users.string       = user.name;
            item.day.string         = user.top;
            item.node.children[0].active = !(index&1);
            self.contentNowLeft.addChild(item.node);
		}));

		Promise.all(data.lost.map(function(user, index){
			var item = cc.instantiate(self.itemHT);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string         = index+1;
            item.users.string       = user.name;
            item.day.string         = user.top;
            item.node.children[0].active = !(index&1);
            self.contentNowRight.addChild(item.node);
		}));
	},

	topHQ: function(data){
		this.contentHQLeft.removeAllChildren();
		this.contentHQRight.removeAllChildren();
		var self = this;
		Promise.all(data.win.map(function(user, index){
			var item = cc.instantiate(self.item);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string   = index+1;
            item.users.string = user.name;
            item.day.string   = user.top;
            item.gift.string  = helper.numberWithCommas(user.gift);
            item.node.children[0].active = !(index&1);
            self.contentHQLeft.addChild(item.node);
		}));

		Promise.all(data.lost.map(function(user, index){
			var item = cc.instantiate(self.item);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string   = index+1;
            item.users.string = user.name;
            item.day.string   = user.top;
            item.gift.string  = helper.numberWithCommas(user.gift);
            item.node.children[0].active = !(index&1);
            self.contentHQRight.addChild(item.node);
		}));
	},
});
