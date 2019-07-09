
cc.Class({
	extends: cc.Component,
	init: function(obj){
		this.RedT = obj;
	},
	update: function(t){
		this.node.position = cc.v2(this.node.position.x-(100*t), 0)
		if (-this.node.width > this.node.position.x) {
			this.reset();
		}
	},
	setNews: function(){
		this.node.active   = true
		this.node.position = cc.v2(this.RedT.node.width, 0)
	},
	reset: function(){
		this.node.removeAllChildren();
		this.node.active = false;
	},
});
