
var helper = require('Helper');
var notice = require('Notice');

cc.Class({
	extends: cc.Component,

	properties: {
		redhat:       cc.Node,
		balans:       cc.Label,
		username:     cc.Label,
		today:        cc.Label,
		nodeNotice:   cc.Node,
		prefabNotice: cc.Prefab,
		MiniPanel:    cc.Prefab,
		loading:      cc.Node,
		notice:       notice,

		games:       cc.Node,
		position:    '',
	},
	onLoad () {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		cc.RedT.send({scene:'xo_so'});
		this.username.string = cc.RedT.user.name;
		this.balans.string   = helper.numberWithCommas(cc.RedT.user.red);
	},
	onData: function(data) {
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.XoSo){
			//this.VuongQuocRed(data.VuongQuocRed);
		}
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
	},
	userData: function(data){
		this.balans.string = helper.numberWithCommas(data.red);
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.nodeNotice.addChild(notice);
	},
	backGame: function(){
		switch(this.position) {
			case 'Main':
				this.loading.active = true;
				void 0 !== this.timeOut && clearTimeout(this.timeOut);
				cc.director.loadScene('MainGame');
				break;
			case 'MienBac':
				this.onSelectDat(null, 'Main');
				break;
		}
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	update: function(){
		let timestamp = new Date();
		this.today.string = this.day(timestamp.getDay()) + ' ' + this.addZero(timestamp.getDate()) + '/' + this.addZero((timestamp.getMonth()+1)) + '/' + timestamp.getFullYear() + ' ' + this.addZero(timestamp.getHours()) + ':' + this.addZero(this.addZero(timestamp.getMinutes())) + ':' + this.addZero(timestamp.getSeconds());
	},
	day: function(day){
		let weekday = new Array(7);
		weekday[0] = "CN";
		weekday[1] = "T2";
		weekday[2] = "T3";
		weekday[3] = "T4";
		weekday[4] = "T5";
		weekday[5] = "T6";
		weekday[6] = "T7";
		return weekday[day];
	},
	addZero: function(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	},
	onSelectDat: function(event, game) {
		this.position = game;
		this.games.children.forEach(function(obj){
			if (obj.name === game) {
				obj.active = true;
			}else{
				obj.active = false;
			}
		});
	},
});
