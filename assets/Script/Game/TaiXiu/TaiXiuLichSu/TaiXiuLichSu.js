
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,
	properties: {
		content: cc.Node,
		page:    cc.Prefab,
	},
	init(obj){
		this.RedT = obj;
	},
	onLoad () {
		this.page = cc.instantiate(this.page);
        this.page.y = -273;
        this.node.addChild(this.page);
        this.page = this.page.getComponent('Pagination');
		this.page.init(this);

		this.content = this.content.children.map(function(obj) {
			return obj.getComponent('TaiXiuLichSu_item');
		});
	},
	onEnable: function () {
		this.get_data();
	},
	onDisable: function () {
	},
	get_data: function(page = 1){
		cc.RedT.send({taixiu:{get_log:{page:page}}});
	},
	onData: function(data){
		this.page.onSet(data.page, data.kmess, data.total);
		this.content.forEach(function(obj, index){
			var dataT = data.data[index];
			if (void 0 !== dataT) {
				obj.node.active = true;
				var tong = dataT.dice1+dataT.dice2+dataT.dice3;
				obj.phien.string  = dataT.phien;
				obj.time.string   = Helper.getStringDateByTime(dataT.time);
				obj.dat.string    = dataT.taixiu ? (dataT.select ? 'Tài' : 'Xỉu') : (dataT.select ? 'Chẵn' : 'Lẻ');
				obj.cuoc.string   = Helper.numberWithCommas(dataT.bet);
				obj.ketqua.string = dataT.taixiu ? (dataT.select ? (tong > 10 ? 'Thắng' : 'Thua') : (tong > 10 ? 'Thua' : 'Thắng')) : (dataT.select ? (!(tong%2) ? 'Thắng' : 'Thua') : (!(tong%2) ? 'Thua' : 'Thắng'));
				obj.tralai.string = Helper.numberWithCommas(dataT.tralai);
				obj.nhan.string   = Helper.numberWithCommas(dataT.betwin);
			}else{
				obj.node.active = false;
			}
		});
	},
});
