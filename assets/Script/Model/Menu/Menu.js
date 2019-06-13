

cc.Class({
    extends: cc.Component,

    properties: {
    	header: cc.Node,
    	games:  cc.Node,
    },
    onLoad () {},
    onHeadSelect: function(e) {
    	// select header
    	Promise.all(this.header.children.map(function(obj){
    		if (obj == e.target) {
    			obj.children[0].active = true;
    			obj.pauseSystemEvents();
    		}else{
    			obj.children[0].active = false;
    			obj.resumeSystemEvents();
    		}
    	}));

    	// select game
    	Promise.all(this.games.children.map(function(game){
    		if (e.target.name == 'all' || game.name == e.target.name) {
    			game.active = true;
    		}else{
    			game.active = false;
    		}
    	}));
    },
});
