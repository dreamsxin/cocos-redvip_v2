
let fish = require('Fish_fish');

cc.Class({
	extends: cc.Component,

	properties: {
		anim: cc.Animation,
		fish: {
			default: [],
			type: fish,
		},
	},
	init: function(obj, data){
		this.g        = data.g;
		this.node.g   = data.g;

		this.anim.on('finished', this.onFinish, this);
		if (void 0 !== data.r) {
			this.anim.play(this.anim.getClips()[data.r].name);
		}
		if (void 0 !== data.a) {
			this.anim.play(data.a);
		}

		this.fish.forEach(function(obj, i){
			obj.init(obj, data.f[i]);
		});
	},
	onFinish: function(){
		this.fish.forEach(function(obj){
			obj.onFinish();
		});
		delete this.fish;
		this.node.destroy();
	},
});
