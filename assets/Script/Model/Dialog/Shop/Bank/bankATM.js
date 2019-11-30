
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		labelATMBank:   cc.Label,
		ATMID:          cc.String,
		prefab:         cc.Prefab,
		moreBank:       cc.Node,
		contentATMBank: cc.Node,
		inputTien:      cc.EditBox,
		loadList: false,
	},
	onEnable: function () {
		this.loadList === false && this.getList();
	},
	onDisable: function () {
		
		//this.clean();
	},
	getList: function(){
		cc.RedT.send({'shop':{'bank':{'atm':{'list':true}}}});
	},
	onData: function(data){
		if (void 0 !== data.list) {
			this.onListATM(data.list);
		}
	},
	onListATM:function(data){
		this.loadList = true;
		this['i_arg'] = data.map(function(obj, index){
			let item = cc.instantiate(this.prefab);
			let comp = item.getComponent('NapRed_itemOne');
			comp.init(this, 'i_arg', 'labelATMBank', 'onListClick')
			comp.id          = obj.id;
			comp.text.string = obj.name;
			this.contentATMBank.addChild(item);
			comp.data = obj;
			return comp;
		}.bind(this));
	},
	onListClick: function(data){
		this.ATMID = data.id;
	},
	toggleMoreBank: function(){
		this.moreBank.active = !this.moreBank.active;
	},
	onChangerRed: function(value = 0){
		value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
		this.inputTien.string = value == 0 ? '' : value;
	},
	onClickTiep: function(){
		let amount = helper.getOnlyNumberInString(this.inputTien.string)>>0;
		if (amount < 50000) {
			cc.RedT.inGame.notice.show({title:'LỖI', text:'Nạp tối thiểu 50.000'});
		}else if (this.ATMID.length === 0) {
			cc.RedT.inGame.notice.show({title:'LỖI', text:'Vui lòng chọn thẻ ATM thuộc Ngân Hàng bạn muốn nạp.'});
		}else{
			cc.RedT.send({'shop':{'bank':{'atm':{'select':{'id':this.ATMID, 'amount':amount}}}}});
		}
	},
});
