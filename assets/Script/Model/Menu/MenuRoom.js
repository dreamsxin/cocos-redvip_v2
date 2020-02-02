
cc.Class({
    extends: cc.Component,

    properties: {
    	rooms: {
    		default: [],
    		type: cc.Sprite,
    	},
    	table1: {
    		default: [],
    		type: cc.SpriteFrame,
    	},
    	table2: {
    		default: [],
    		type: cc.SpriteFrame,
    	},
    	title: cc.Label,
        red: true,
    },
    onBack: function(){
    	this.node.stopAllActions();
    	let x = -cc.RedT.inGame.node.width;
		this.node.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(x, 0)), cc.callFunc(function(){
    		this.node.x = cc.RedT.inGame.node.width;
    		this.node.active = false;
		}, this)));
    },
	openGame: function(game){
		this.game = game;
		this.node.stopAllActions();
		this.title.string = game.title;
    	this.node.active = true;
		this.node.runAction(cc.moveTo(0.3, cc.v2(0, 0)));
	},
	changerRoom: function(red){
		var self = this;
		if (this.game.table2) {
			if (red) {
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table2[3];
					}else if (index < 8) {
						room.spriteFrame = self.table2[4];
					}else{
						room.spriteFrame = self.table2[5];
					}
				});
			}else{
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table2[0];
					}else if (index < 8) {
						room.spriteFrame = self.table2[1];
					}else{
						room.spriteFrame = self.table2[2];
					}
				});
			}
		}else{
			if (red) {
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table1[3];
					}else if (index < 8) {
						room.spriteFrame = self.table1[4];
					}else{
						room.spriteFrame = self.table1[5];
					}
				});
			}else{
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table1[0];
					}else if (index < 8) {
						room.spriteFrame = self.table1[1];
					}else{
						room.spriteFrame = self.table1[2];
					}
				});
			}
		}
	},
	onClickRoom: function(event){
		this.bet = event.target.name;
		cc.RedT.audio.playClick();
		if (this.game.game == "poker") {
			cc.RedT.inGame.dialog.showPokerNap(this);
		}
	},
	onData: function(game){
    	cc.director.loadScene(game);
    },
});
