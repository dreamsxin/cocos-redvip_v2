
cc.Class({
    extends: cc.Component,

    properties: {
    	page:    cc.Prefab,
    	header:  cc.Node,
    	body:    cc.Node,
    	quay:    cc.Node,
    	nhanve:  cc.Node,
    	select:  '',
    },
    onLoad () {
    	this.page = cc.instantiate(this.page);
        this.page.y = -300.91;
        this.node.addChild(this.page);
        this.page = this.page.getComponent('Pagination');

        Promise.all(this.quay.children.map(function(obj){
            return obj.getComponent('MegaJ_history_item');
        }))
        .then(result => {
            this.quay = result;
        });

        Promise.all(this.nhanve.children.map(function(obj){
            return obj.getComponent('MegaJ_top_item');
        }))
        .then(result => {
            this.nhanve = result;
        });

        this.page.init(this);
    },
    headSelect: function(event) {
    	this.select = event.target.name;

		this.header.children.forEach(function(head){
			if (head.name === this.select) {
				head.children[0].active = false;
				head.children[1].active = true;
				head.pauseSystemEvents();
			}else{
				head.children[0].active = true;
				head.children[1].active = false;
				head.resumeSystemEvents();
			}
		}.bind(this));

		this.body.children.forEach(function(body){
			if (body.name === this.select) {
				body.active = true;
			}else{
				body.active = false;
			}
		}.bind(this));

		this.get_data();
    },
    onEnable: function() {
        this.get_data();
    },
    get_data: function(page = 1){
    	let data = {};
    	data[this.select] = page;
        cc.RedT.send({g:{megaj:{history:data}}});
    },
});
