
var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
    	background: {
        	default: null,
        	type: cc.Node
        },
    	scrollview: {
        	default: null,
        	type: cc.ScrollView
        },
        item: {
        	default: null,
        	type: cc.Prefab
        },
        title: {
            default: null,
            type: cc.Label
        },
        game: {
        	default: null,
        	type: cc.Label
        },
    	cRed: {
        	default: null,
        	type: cc.Node
        },
        cXu: {
        	default: null,
        	type: cc.Node
        },
    },
    init(obj){
    	this.RedT = obj
    },
    onLoad () {
		this.ttOffset = null;
		this.taixiu   = this.red = true;
	},
    onEnable: function () {
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		this.get_data();
	},
	onDisable: function () {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
	},
	eventEnd: function(){},
	setTop: function(){
		this.node.parent.insertChild(this.node);
		this.RedT.setTop();
	},
    toggle: function() {
    	this.setTop();
    	cc.RedT.audio.playClick();
    	this.node.active = !this.node.active;
    },
    onChangerGame: function(){
    	this.taixiu = !this.taixiu;
    	this.game.string = this.taixiu ? "Chẵn Lẻ" : "Tài Xỉu";
        this.title.string = this.taixiu ? "TOP TÀI XỈU" : "TOP CHẴN LẺ";
    	this.get_data();
    },
    onChangerRed: function(){
    	this.red = !this.red;
    	this.cRed.active = !this.cRed.active;
        this.cXu.active  = !this.cXu.active;
    	this.get_data();
    },
    get_data: function(){
    	cc.RedT.send({taixiu:{get_top: {red: this.red, taixiu: this.taixiu}}});
    },
    onData: function(data){
        this.scrollview.content.destroyAllChildren();
        var self = this;
        Promise.all(data.map(function(obj, index){
            var item = cc.instantiate(self.item)
            var itemComponent = item.getComponent('TaiXiuLichSu_item');
            itemComponent.time.string  = index+1;
            itemComponent.phien.string = obj.name;
            itemComponent.dat.string   = helper.numberWithCommas(obj.bet);
            self.scrollview.content.addChild(item);
        }))
    },
});
