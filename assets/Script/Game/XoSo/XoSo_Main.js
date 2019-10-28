
var History = require('XoSo_History');

cc.Class({
    extends: cc.Component,

    properties: {
        right:   cc.Node,
        History: History,
    },
    init: function(obj){
        this.RedT = obj;
    },
    showMain: function(){
        this.right.children.forEach(function(obj){
            if (obj.name === 'Main') {
                obj.active = true;
            }else{
                obj.active = false;
            }
        });
    },
    onHistoryClick: function(event, name) {
        this.RedT.position = 'History';
        this.right.children.forEach(function(obj){
            if (obj.name === 'History') {
                obj.active = true;
                obj.children.forEach(function(h){
                    if (h.name === name) {
                        h.active = true;
                    }else{
                        h.active = false;
                    }
                });
            }else{
                obj.active = false;
            }
        });
    },
});
