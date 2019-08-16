
var eventTaiXiu    = require('EventTaiXiu');
var eventAngrybird = require('EventAngrybird');
var eventBigBabol  = require('EventBigBabol');
var eventMiniPoker = require('EventMiniPoker');

cc.Class({
	extends: cc.Component,

	properties: {
		menu:    cc.Node,
		content: cc.Node,
		eventAngrybird: eventAngrybird,
		eventBigBabol:  eventBigBabol,
		eventMiniPoker: eventMiniPoker,
		eventTaiXiu:    eventTaiXiu,
	},
	selectEvent: function(event) {
		Promise.all(this.menu.children.map(function(menu){
			if (menu.name == event.target.name) {
				menu.children[0].active = true;
			}else{
				menu.children[0].active = false;
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
	onData: function(data){
		if (!!data.taixiu) {
			this.eventTaiXiu.onData(data.taixiu);
		}
	},
	onHU: function(hu){
		var miniPoker100 = hu.mini_poker.filter(function(obj){
			return obj.type == 100 && obj.red == true
		});
		this.eventMiniPoker.toX6.string = miniPoker100[0].toX6;
		this.eventMiniPoker.X6.string   = miniPoker100[0].X6;

		var Angrybird100 = hu.arb.filter(function(obj){
			return obj.type == 100 && obj.red == true
		});
		this.eventAngrybird.toX6.string = Angrybird100[0].toX6;
		this.eventAngrybird.X6.string   = Angrybird100[0].X6;

		var BigBabol100 = hu.big_babol.filter(function(obj){
			return obj.type == 100 && obj.red == true
		});
		this.eventBigBabol.toX6.string = BigBabol100[0].toX6;
		this.eventBigBabol.X6.string   = BigBabol100[0].X6;
	},
});
