
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
    	this.node.active = false;
    },
	openGame: function(game){
		this.game = game;
		this.title.string = game.title;
    	this.node.active = true;
	},
	changerRoom: function(red){
		if (this.game.table2) {
			if (red) {
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = this.table2[3];
					}else if (index < 8) {
						room.spriteFrame = this.table2[4];
					}else{
						room.spriteFrame = this.table2[5];
					}
				}.bind(this));
			}else{
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = this.table2[0];
					}else if (index < 8) {
						room.spriteFrame = this.table2[1];
					}else{
						room.spriteFrame = this.table2[2];
					}
				}.bind(this));
			}
		}else{
			if (red) {
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = this.table1[3];
					}else if (index < 8) {
						room.spriteFrame = this.table1[4];
					}else{
						room.spriteFrame = this.table1[5];
					}
				}.bind(this));
			}else{
				this.rooms.forEach(function(room, index){
					if (index < 4) {
						room.spriteFrame = this.table1[0];
					}else if (index < 8) {
						room.spriteFrame = this.table1[1];
					}else{
						room.spriteFrame = this.table1[2];
					}
				}.bind(this));
			}
		}
	},
	onClickRoom: function(event){
		this.bet = event.target.name;
		cc.RedT.audio.playClick();
		if (this.game.game == 'poker') {
			cc.RedT.inGame.dialog.showPokerNap(this);
		}
	},
	onData: function(game){
    	cc.director.loadScene(game);
    },
});
