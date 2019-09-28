
cc.Class({
    extends: cc.Component,

    properties: {
        labelBank:   cc.Label,
        labelNumber: cc.Label,
        labelName:   cc.Label,
        labelBranch: cc.Label,

        labelUID:  cc.Label,
        labelUID2: cc.Label,

        moreBank: {
            default: null,
            type: cc.Node,
        },
        scrollviewBank: {
            default: null,
            type: cc.ScrollView,
        },
        prefab: {
            default: null,
            type: cc.Prefab,
        },
        isLoad: false,
    },
    onLoad () {
        if(!this.isLoad) {
            cc.RedT.send({shop:{bank:{list:true}}});
        }
    },
    onEnable: function () {
        this.labelUID.string = cc.RedT.user.UID;
        this.labelUID2.string = cc.RedT.user.UID;
    },
    onDisable: function () {
        this.moreBank.active = false;
    },
    toggleMoreBank: function(){
        this.moreBank.active = !this.moreBank.active;
    },
    onData: function(data){
        var self = this;
        if (data.length > 0) {
            Promise.all(data.map(function(obj, index){
                var item = cc.instantiate(self.prefab);
                var componentLeft = item.getComponent('NapRed_itemOne');
                componentLeft.init(self, 'i_arg', 'labelBank')
                componentLeft.text.string = obj.bank;
                self.scrollviewBank.content.addChild(item);
                componentLeft.data = obj;
                return componentLeft;
            }))
            .then(result => {
                this['i_arg'] = result;
            })
        }
    },
    backT: function(data){
        this.labelNumber.string = data.number;
        this.labelName.string   = data.name;
        this.labelBranch.string = data.branch;
    },
});
