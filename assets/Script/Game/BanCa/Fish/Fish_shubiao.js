
cc.Class({
	extends: cc.Component,

	properties: {
		collider: cc.CircleCollider,
		dragonBones: dragonBones.ArmatureDisplay,
	},
	init:function(obj){
		this.RedT = obj;
	},
	offLock: function(){
		this.collider.enabled = false;
	},
	onCollisionEnter: function (other) {
		if (other.node.group !== 'tuong') {
			let fish = this.RedT.fish[other.node.id];
			fish['player'+this.RedT.player.map] = this.RedT.player;
			this.RedT.player.fish = fish;
			this.RedT.player.isLock = true;
			this.RedT.player.fish.updateGroup();
			this.RedT.player.onFire();
		}else{
			if (this.RedT.player.fish) {
				this.RedT.player.fish.unLock(this.RedT.player.map);
			}
		}
		this.offLock();
	},
	fire: function(position){
		if (this.RedT.isLock) {
			this.collider.enabled = true;
			this.RedT.angleSung(position);
			this.RedT.shubiao.dragonBones.playAnimation('newAnimation', 1);
		}else{
			this.RedT.angleSung(position, true);
		}
	},
});
