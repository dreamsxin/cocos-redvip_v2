
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		prefab: cc.Prefab,
		isPush: false,
	},
	onLoad () {
		this.list = [];
	},
	pushNotice: function() {
		if (this.list.length > 0) {
			this.isPush = true;
			var data = this.list[0];
			this.addNotice(data);
			this.list.splice(0, 1);
		}else{
			this.isPush = false;
		}
	},
	onData: function(data){
		if (this.isPush) {
			this.list.push(data);
		}else{
			this.addNotice(data);
		}
		this.isPush = true;
	},
	addNotice: function(data){
		var notice = cc.instantiate(this.prefab);
		var notice = notice.getComponent('ThongBaoNoHu');
		notice.title.string = data.title;
		notice.text.string  = "<color=#00FF1F>" + data.name + "</color> vừa\n<color=#FFFF00>Nổ Hũ</color> <color=#00EBFF>" + helper.numberWithCommas(data.bet) + "</color>";
		notice.init(this);
		this.node.addChild(notice.node);
	},
});
