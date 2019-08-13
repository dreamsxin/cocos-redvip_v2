
cc.Class({
	extends: cc.Component,
	properties: {
		prefabItem: cc.Prefab,
	},
	init: function(obj){
		this.RedT = obj;
	},
	update: function(t){
		this.node.position = cc.v2(this.node.position.x-(130*t), 0);
		if (-this.node.width > this.node.position.x) {
			this.reset();
		}
	},
	setNews: function(){
		this.node.active   = true;
		this.node.position = cc.v2(this.RedT.node.width+200, 0);
	},
	reset: function(){
		this.node.removeAllChildren();
		this.node.active = false;
	},
	onData: function(data){
		if (void 0 !== data.a){
			this.NewsAddArray(data.a)
		}

		if (void 0 !== data.t){
			this.NewsAddText(data.t)
		}
	},
	NewsAddArray: function(arr){
		var self = this
		Promise.all(arr.map(function(text){
			var item = cc.instantiate(self.prefabItem);
				item = item.getComponent('NewsItem');

			item.users.string = text.users;
			item.bet.string   = text.bet;
			item.game.string  = text.game;

			self.node.addChild(item.node);
			return item;
		})).then(result => {
			if (!this.node.active) {
				this.setNews()
			}
		})
	},
	NewsAddText: function(text){
		var item = cc.instantiate(this.prefabItem);
			item = item.getComponent('NewsItem');

		if (!!text.status) {
			if (text.status == 1) {
				item.status.node.active = true;
				item.status.string      = "(Nổ Hũ)";
				item.win.string         = "nổ hũ";
			}else{
				item.status.string = "(Thắng Lớn)";
			}
		}
		item.users.string = text.users;
		item.bet.string   = text.bet;
		item.game.string  = text.game;

		this.node.addChild(item.node);

		if (!this.node.active) {
			this.setNews()
		}
	},
});
