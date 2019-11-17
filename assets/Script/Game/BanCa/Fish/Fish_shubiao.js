
cc.Class({
    extends: cc.Component,

    properties: {
        collider: cc.CircleCollider,
        dragonBones: dragonBones.ArmatureDisplay,
    },
    init:function(obj){
        this.RedT = obj;
    },
    onLock: function(){
        this.collider.enabled = true;
        setTimeout(function(){
            this.collider.enabled = false;
        }.bind(this), 50);
    },
    offLock: function(){
        this.collider.enabled = false;
    },
    onCollisionEnter: function (other) {
        console.log(other);
        this.offLock();
    },
});
