
var Helper = require('Helper')

cc.Class({
    extends: cc.Component,

    properties: {
        page:     cc.Prefab,
        content:  cc.Node,
        cointRed: cc.Node,
        cointXu:  cc.Node,
        header:   cc.Node,
        red:      true,
        isLoad:   false,
        hu:       true,
    },

    onLoad () {
        console.log(this);
        var page = cc.instantiate(this.page);
        page.y = -323;
        this.node.addChild(page);
        this.page = page.getComponent('Pagination');
        this.content2 = this.content.children.map(function(obj){return obj.children.map(function(t, index){return t.getComponent(cc.Label)})});
        this.page.init(this);
        Promise.all(this.header.children.map(function(obj) {
            return obj.getComponent('itemContentMenu');
        }))
        .then(result => {
            this.header = result;
        });
    },
    onEnable: function() {
        !this.isLoad && this.get_data();
    },
    onDisable: function() {
    },
    get_data: function(page = 1){
        this.isLoad = true;
        cc.RedT.send({g:{mini_poker:{top:{red: this.red, hu: this.hu, page: page}}}});
    },
    changerCoint: function(){
        this.red             = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active  = !this.cointXu.active;
        this.get_data();
    },
    subHeadClick:function(event, value){
        if (value == "hu") {
            this.hu = true;
        }else{
            this.hu = false;
        }
        Promise.all(this.header.map(function(header) {
            if (header.node == event.target) {
                header.select();
            }else{
                header.unselect();
            }
        }));
        this.get_data();
    },
    onData: function(data){
        var self = this
        this.page.onSet(data.page, data.kmess, data.total)
        this.content2.map(function(obj, i){
            var dataT = data.data[i]
            if (void 0 !== dataT) {
                self.content.children[i].active = true;
                obj[0].string = Helper.getStringDateByTime(dataT.time);
                obj[1].string = dataT.name;
                obj[2].string = dataT.bet;
                obj[3].string = Helper.numberWithCommas(dataT.win+dataT.bet);
            }else{
                self.content.children[i].active = false;
            }
        })

    },
});
