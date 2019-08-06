
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		page:     cc.Prefab,
		content:  cc.Node,
		cointRed: cc.Node,
		cointXu:  cc.Node,
		red:      true,
	},
	onLoad () {
		var page = cc.instantiate(this.page);
		page.y = -315;
		this.node.addChild(page);
		this.page = page.getComponent('Pagination');
		Promise.all(this.content.children.map(function(obj){
			return obj.getComponent('VQRed_history_item');
		}))
		.then(tab => {
			this.content = tab;
		})
		this.page.init(this);
	},
	onEnable: function() {
		this.get_data();
	},
	onDisable: function() {
	},
	get_data: function(page = 1){
		cc.RedT.send({g:{vq_red:{log:{red: this.red, page: page}}}});
	},
	changerCoint: function(){
		this.red             = !this.red;
		this.cointRed.active = !this.cointRed.active;
		this.cointXu.active  = !this.cointXu.active;
		this.get_data();
	},
	onData: function(data){
		var self = this;
		this.page.onSet(data.page, data.kmess, data.total);
		Promise.all(this.content.map(function(obj, i){
			var dataT = data.data[i];
			if (void 0 !== dataT) {
				obj.node.active = true;

				obj.time.string  = Helper.getStringDateByTime(dataT.time);
				obj.phien.string = dataT.id;
				obj.cuoc.string  = Helper.numberWithCommas(dataT.bet);

				obj.line.string  = dataT.kq + " Dòng";

				obj.win.string   = Helper.numberWithCommas(dataT.win);


				/**
				
				time:  cc.Label,
				phien: cc.Label,
				cuoc:  cc.Label,
				line:  cc.Label,
				win:   cc.Label,

				obj[2].string = Helper.numberWithCommas(dataT.bet);
				obj[3].string = dataT.kq + " Dòng";
				obj[4].string = Helper.numberWithCommas(dataT.win);
				var temp = obj[2].node;
				if (self.red) {
					temp.color = temp.color.fromHEX('#FFF500');
					obj[4].node.color = temp.color;
				}else{
					temp.color = temp.color.fromHEX('#FFFFFF');
					obj[4].node.color = temp.color;
				}
				*/
			}else{
				obj.node.active = false;
			}
		}))
	},
});
