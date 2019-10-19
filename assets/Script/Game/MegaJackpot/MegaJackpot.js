
cc.Class({
	extends: cc.Component,

	properties: {
		background:  sp.Skeleton,
		bg_move:     cc.Node,
		menuGame:    cc.Node,

		bgVQ:        cc.Node,
		imgVQ:       cc.Sprite,

		vqthanhdong: cc.SpriteFrame,
		vqbachkim:   cc.SpriteFrame,
		vqhoangkim:  cc.SpriteFrame,

		hu:          cc.Label,
		luot:        cc.Label,
	},
	init: function(obj){
		this.RedT = obj;
		cc.RedT.setting.MegaJackpot = cc.RedT.setting.MegaJackpot || {users:{100:0, 1000:0, 10000:0}};
		this.game = 100;
		this.bgAnim = {100:"thanhdong", 1000:"bachkim", 10000:"hoangkim"};

		let check = localStorage.getItem('MegaJackpot');
		if (check == "true") {
			this.node.active = true;
		}

		if (void 0 !== cc.RedT.setting.MegaJackpot.game) {
			if (cc.RedT.setting.MegaJackpot.game !== this.game) {
				this.changerGame(null, cc.RedT.setting.MegaJackpot.game);
			}
		}else{
			cc.RedT.setting.MegaJackpot.game = this.game = '100';
		}
		if (void 0 !== cc.RedT.setting.MegaJackpot.position) {
			this.node.position = cc.RedT.setting.MegaJackpot.position;
		}
	},
	onEnable: function() {
		//this.onGetHu();
		//this.regEvent(true);
		this.bg_move.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.bg_move.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.bg_move.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.bg_move.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.bg_move.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function() {
		//this.regEvent(false);
		this.bg_move.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.bg_move.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.bg_move.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.bg_move.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.bg_move.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		//this.onCloseGame();
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(){
		cc.RedT.setting.MegaJackpot.position = this.node.position;
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	changerGame:function(e, game){
		cc.RedT.setting.MegaJackpot.game = this.game = game;
		if (this.bgAnim[game]) {
			this.background.setAnimation(0, this.bgAnim[game], true);
			this.imgVQ.spriteFrame = this['vq'+this.bgAnim[game]];
		}
		this.luot = cc.RedT.setting.MegaJackpot.users[game] + ' Lượt';
		this.menuGame.children.forEach(function(item){
			if (item.name === game) {
				item.pauseSystemEvents();
				item.children[0].active = false;
				item.children[1].active = true;
			}else{
				item.resumeSystemEvents();
				item.children[0].active = true;
				item.children[1].active = false;
			}
		});
	},
	openGame: function () {
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN){
			this.node.active = !0;
			localStorage.setItem('MegaJackpot', true);
			this.setTop();
		} else cc.RedT.inGame.dialog.showSignIn();
	},
	closeGame:function(){
		this.node.active = !1;
		localStorage.setItem('MegaJackpot', false);
	},
	onData: function(data){
	},
});
