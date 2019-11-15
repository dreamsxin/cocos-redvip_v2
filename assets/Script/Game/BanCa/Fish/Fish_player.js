
cc.Class({
	extends: cc.Component,

	properties: {
		nick:           cc.Label,
		balans:         cc.Label,
		bet:            cc.Label,
		iconCoint:      cc.Sprite,
		typeBet:        0,
		nodeChangerbet: cc.Node,
		canhs: {
			default: [],
			type: dragonBones.ArmatureDisplay,
		},
		canh: dragonBones.ArmatureDisplay,

		sungs: {
			default: [],
			type: dragonBones.ArmatureDisplay,
		},
		sung: dragonBones.ArmatureDisplay,
		isFire: false,
	},
	init: function(obj) {
		this.RedT = obj;
	},
	onData: function(data){
	},
	onInfo: function(data){
		this.nick.string   = data.name;
		this.balans.string = data.balans;
		this.bet.string    = this.RedT['typeBet'+this.RedT.regGame][data.typeBet];
		this.typeBet       = data.typeBet;
		this.onTypeBet(data.typeBet);
	},
	onTypeBet: function(type){
		this.canhs.forEach(function(canh, index){
			if (type === index) {
				canh.node.active = true;
			}else{
				canh.node.active = false;
			}
		});
		this.sungs.forEach(function(sung, index){
			if (type === index) {
				sung.node.active = true;
			}else{
				sung.node.active = false;
			}
		});
		this.canh = this.canhs[type];
		this.sung = this.sungs[type];
		this.sung.node.insertChild(this.bet.node);

		let funcCanhEvent1 = function(){
			this.canh.playAnimation(this.RedT.anim_canh[1], 0);
			this.canh.off(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent1, this);
		};
		this.canh.on(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent1, this);
		this.canh.playAnimation(this.RedT.anim_canh[0], 1);

		let funcSungEvent1 = function(){
			this.sung.off(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent1, this);
		};
		this.sung.on(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent1, this);
		this.sung.playAnimation(this.RedT.anim_sung[1], 1);
	},
	onChangerTypeBet: function(type){
		let self = this;
		let funcCanhEvent1 = function(){
			this.canh.playAnimation(this.RedT.anim_canh[1], 0);
			this.canh.off(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent1, this);
		};

		let funcCanhEvent2 = function(){
			this.off(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent2, this);

			self.canh.node.active = true;
			self.canh.on(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent1, self);
			self.canh.playAnimation(self.RedT.anim_canh[0], 1);
		};
		this.canh.on(dragonBones.EventObject.LOOP_COMPLETE, funcCanhEvent2, this.canh);
		this.canh.playAnimation(this.RedT.anim_canh[2], 1);

		this.canh = this.canhs[type];

		let funcSungEvent1 = function(){
			this.sung.off(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent1, this);
		};

		let funcSungEvent2 = function(){
			this.off(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent2, this);

			self.sung.node.active = true;
			self.sung.on(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent1, self);
			self.sung.playAnimation(self.RedT.anim_sung[1], 1);
		};
		this.sung.on(dragonBones.EventObject.LOOP_COMPLETE, funcSungEvent2, this.sung);
		this.sung.playAnimation(this.RedT.anim_sung[2], 1);

		this.sung = this.sungs[type];
		this.sung.node.insertChild(this.bet.node);

		this.bet.string = this.RedT['typeBet'+this.RedT.regGame][type];
		this.typeBet    = type;
	},
	onFire: function(point = null){
		if ((this.RedT.Game.isAuto || this.RedT.Game.isFire) && !this.isFire) {
			this.isFire = true;
			let bullet = cc.instantiate(this.RedT.Game.bullet[this.typeBet]);
			bullet = bullet.getComponent('Fish_bullet');
			if (!!point) {
				bullet.init(this, point);
			}else{
				bullet.init(this, this.RedT.Game.PointFire.node.position);
			}
			this.RedT.Game.nodeDan.addChild(bullet.node);
			this.sung.playAnimation('fire', 1);
			setTimeout(function(){
				this.isFire = false;
				this.onFire();
			}.bind(this), this.RedT.Game.bulletSpeed);
		}
	},
});
