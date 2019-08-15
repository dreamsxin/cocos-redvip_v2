
cc.Class({
    extends: cc.Component,

    properties: {
        menu:    cc.Node,
        content: cc.Node,
        item:    cc.Prefab,
        contentNowLeft:  cc.Node,
        contentNowRight: cc.Node,
        contentHQLeft:   cc.Node,
        contentHQRight:  cc.Node,
    },
    selectEvent: function(event) {
        Promise.all(this.menu.children.map(function(menu){
            if (menu.name == event.target.name) {
                menu.children[0].active = true;
                menu.children[1].color  = cc.Color.BLACK;
            }else{
                menu.children[0].active = false;
                menu.children[1].color  = cc.Color.WHITE;
            }
        }));
        Promise.all(this.content.children.map(function(content){
            if (content.name == event.target.name) {
                content.active = true;
            }else{
                content.active = false;
            }
        }));
    },
});
