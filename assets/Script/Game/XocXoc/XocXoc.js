
let helper = require('Helper');
let notice = require('Notice');

cc.Class({
	extends: cc.Component,

	properties: {
		audioMoBat: {
			default: null,
			type: cc.AudioClip
		},
		audioSingleChip: {
			default: null,
			type: cc.AudioClip
		},
		audioMultiChip: {
			default: null,
			type: cc.AudioClip
		},
		audioXocDia: {
			default: null,
			type: cc.AudioClip
		},

		box_chan:   cc.Node,
		box_le:     cc.Node,
		box_red3:   cc.Node,
		box_red4:   cc.Node,
		box_white3: cc.Node,
		box_white4: cc.Node,

		total_chan:   cc.Label,
		total_le:     cc.Label,
		total_red3:   cc.Label,
		total_red4:   cc.Label,
		total_white3: cc.Label,
		total_white4: cc.Label,

		me_chan:   cc.Label,
		me_le:     cc.Label,
		me_red3:   cc.Label,
		me_red4:   cc.Label,
		me_white3: cc.Label,
		me_white4: cc.Label,

		me_name:   cc.Label,
		me_balans: cc.Label,

		labelTime: cc.Label,
		timeWait:  cc.Label,
		nodeWait:  cc.Node,

		users_bg:    cc.Node,
		users_count: cc.Label,

		nodeBat: cc.Node,

		chip_1000:    cc.SpriteFrame,
		chip_10000:   cc.SpriteFrame,
		chip_50000:   cc.SpriteFrame,
		chip_100000:  cc.SpriteFrame,
		chip_1000000: cc.SpriteFrame,

		dot_red:   cc.SpriteFrame,
		dot_white: cc.SpriteFrame,

		dot: {
			default: [],
			type: cc.Sprite,
		},

		log_chan: cc.Label,
		log_le:   cc.Label,
		log_top:  cc.Node,
		logMain:  cc.Node,

		redH:    cc.Node,
		miniNotice: cc.Node,

		Animation: cc.Animation,

		prefabNotice: cc.Prefab,

		bet:     cc.Node,
        nodeRed: cc.Node,
		nodeXu:  cc.Node,

		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		notice:    notice,

		red: true,
	},

	/**
	var position = node.parent.convertToWorldSpaceAR(node.position);
	position = canvasNode.convertToNodeSpaceAR(position);
	*/
	ctor: function(){
		this.logs = [];
		this.nan  = false;
		this.cuoc = '1000';
		this.actionBatOpen  = cc.moveTo(0.5, cc.v2(0, 246));
		this.actionBatClose = cc.sequence(cc.moveTo(0.5, cc.v2(0, 0)), cc.delayTime(0.5), cc.callFunc(function(){
			this._playSFX(this.audioXocDia);
			this.Animation.play();
			this.resetData();
		}, this));
		this.maxDot = {x:44, y:44};

		this.maxBox1_3 = {x:103, y:104};
		this.maxBox1_1 = {x:121, y:184};

		this.clients = {
			'red': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
			'xu': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
		};

		this.users = {
			'red': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
			'xu': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
		};
	},
	onLoad () {
		console.log(this);
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redH.insertChild(MiniPanel);

		this.logMain = this.logMain.children.map(function(obj){
			return obj.children[0].getComponent(cc.Sprite);
		});

		this.logMain.reverse();

		this.log_top = this.log_top.children.map(function(obj){
			let data = {'cell':obj};
			let cell = obj.children.map(function(obj){
				return {c:obj.children[0].getComponent(cc.Sprite), t:obj.children[1].getComponent(cc.Label)};
			});
			cell.reverse();
			data.data = cell;
			return data;
		});

		this.log_top.reverse();

		this.me_name.string = cc.RedT.user.name;
		this.me_balans.string = helper.numberWithCommas(cc.RedT.user.red);

		cc.RedT.send({scene:"xocxoc", g:{xocxoc:{ingame:true}}});
	},
	_playSFX: function(clip) {
		if (cc.RedT.IS_SOUND){
			cc.audioEngine.playEffect(clip, false);
		}
	},
	_play: function(clip) {
		if (cc.RedT.IS_SOUND){
			cc.audioEngine.play(clip, false, 1);
		}
	},
	playClick: function(){
		//this._playSFX(this.audioClick);
	},
	onData: function(data) {
		console.log(data);
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.xocxoc){
			this.xocxoc(data.xocxoc);
		}
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
	},
	backGame: function(){
		clearInterval(this.timeInterval);
		cc.RedT.send({g:{xocxoc:{outgame:true}}});
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		clearInterval(this.timeInterval);
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
	userData: function(data){
		if (this.red) {
			this.me_balans.string = helper.numberWithCommas(data.red);
		}else{
			this.me_balans.string = helper.numberWithCommas(data.xu);
		}
	},
	xocxoc: function(data){
		if (!!data.ingame) {
			this.xocxocIngame(data.ingame);
		}
		if (!!data.finish) {
			this.xocxocFinish(data.finish);
		}
		if (!!data.log) {
			// me log
		}
		if (!!data.top) {
			//top win
		}

		if (!!data.chip) {
			this.clientsChip(data.chip);
		}
		if (!!data.mechip) {
			this.meChip(data.mechip);
		}
		if (!!data.client) {
			this.updateClient(data.client);
		}
		if (!!data.me) {
			this.updateMe(data.me);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	xocxocIngame: function(data){
		if (data.client) {
			this.countClient(data.client);
		}
		if (!!data.time) {
			this.time_remain = data.time-1;
			this.playTime();
			if (this.time_remain > 32 && data.logs.length) {
				this.nodeBat.position = cc.v2(0, 246);
				this.setDot([data.logs[0].red1, data.logs[0].red2, data.logs[0].red3, data.logs[0].red4]);
			}
		}
		if (!!data.data) {
			this.updateData(data.data);
		}
		if (!!data.logs) {
			this.logs = data.logs;
			this.setLogs();
		}
		if (!!data.me) {
			this.updateMe(data.me);
		}
		if (!!data.chats) {
		}
	},
	xocxocFinish: function(data){
		let dice = {red1:data[0], red2:data[1], red3:data[2], red4:data[3]};
		this.logs.unshift(dice);
		this.logs.length > 48 && this.logs.pop();
		this.setDot(data);
		this.labelTime.node.active = false;
		this._playSFX(this.audioMoBat);
		this.time_remain = 43;
		this.playTime();

		if (!this.nan) {
			this.nodeBat.runAction(this.actionBatOpen);
			this.setLogs();
		}
	},
	setDot: function(data){
		let self = this;
		let Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		let Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		let DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[0].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[1].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[2].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[3].node.position = cc.v2(Dot_x, Dot_y);

		this.dot.forEach(function(dot, index){
			let check = data[index];
			if (check) {
				dot.spriteFrame = self.dot_red;
			}else{
				dot.spriteFrame = self.dot_white;
			}
		});
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function(){
			if (this.time_remain > 32) {
				var time = helper.numberPad(this.time_remain-33, 2);
				this.timeWait.string = time;
				this.labelTime.node.active = false;
				this.nodeWait.active = true;
			}else if(this.time_remain > 30){
				// Xoc Dia
				this.labelTime.node.active = false;
				this.nodeWait.active = false;
				this.time_remain === 32 && this.nodeBat.runAction(this.actionBatClose);
			}else{
				if (this.time_remain > -1) {
					var time = helper.numberPad(this.time_remain, 2);
					this.labelTime.node.active  = true;
					this.nodeWait.active  = false;
					this.labelTime.string = time;

					if (this.time_remain < 11) {
						this.labelTime.node.color = cc.Color.RED;
					}else{
						this.labelTime.node.color = cc.Color.WHITE
					}
				}else clearInterval(this.timeInterval);
			}
			this.time_remain--;
		}.bind(this), 1000);
	},
	countClient: function(client){
		this.users_count.string = client;
	},
	updateData: function(data){
		if (this.red) {
			this.total_chan.string   = data.red.chan   > 0 ? helper.numberWithCommas(data.red.chan)   : '';
			this.total_le.string     = data.red.le     > 0 ? helper.numberWithCommas(data.red.le)     : '';
			this.total_red3.string   = data.red.red3   > 0 ? helper.numberWithCommas(data.red.red3)   : '';
			this.total_red4.string   = data.red.red4   > 0 ? helper.numberWithCommas(data.red.red4)   : '';
			this.total_white3.string = data.red.white3 > 0 ? helper.numberWithCommas(data.red.white3) : '';
			this.total_white4.string = data.red.white4 > 0 ? helper.numberWithCommas(data.red.white4) : '';
		}else{
			this.total_chan.string   = data.xu.chan   > 0 ? helper.numberWithCommas(data.xu.chan)   : '';
			this.total_le.string     = data.xu.le     > 0 ? helper.numberWithCommas(data.xu.le)     : '';
			this.total_red3.string   = data.xu.red3   > 0 ? helper.numberWithCommas(data.xu.red3)   : '';
			this.total_red4.string   = data.xu.red4   > 0 ? helper.numberWithCommas(data.xu.red4)   : '';
			this.total_white3.string = data.xu.white3 > 0 ? helper.numberWithCommas(data.xu.white3) : '';
			this.total_white4.string = data.xu.white4 > 0 ? helper.numberWithCommas(data.xu.white4) : '';
		}
	},
	resetData: function(){
		this.total_chan.string   = '';
		this.total_le.string     = '';
		this.total_red3.string   = '';
		this.total_red4.string   = '';
		this.total_white3.string = '';
		this.total_white4.string = '';

		this.me_chan.string   = '';
		this.me_le.string     = '';
		this.me_red3.string   = '';
		this.me_red4.string   = '';
		this.me_white3.string = '';
		this.me_white4.string = '';

		this.users.red.chan   = 0;
		this.users.red.le     = 0;
		this.users.red.red3   = 0;
		this.users.red.red4   = 0;
		this.users.red.white3 = 0;
		this.users.red.white4 = 0;

		this.users.xu.chan   = 0;
		this.users.xu.le     = 0;
		this.users.xu.red3   = 0;
		this.users.xu.red4   = 0;
		this.users.xu.white3 = 0;
		this.users.xu.white4 = 0;
	},
	setLogs: function(){
		let self = this;
		this.logMain.forEach(function(obj, index){
			let data = self.logs[index];
			if (data) {
				obj.node.active = true;
				data = Object.values(data);
				let gameChan = 0;     // Là chẵn
				data.forEach(function(kqH){
					if (kqH) {
						gameChan++;
					}
				});
				if (!(gameChan%2)) {
					obj.spriteFrame = self.dot_white;
				}else{
					obj.spriteFrame = self.dot_red;
				}
			}else{
				obj.node.active = false;
			}
		});

		let tmp_DS = -1;
		let tmp_arrA = [];
		let tmp_arrB = [];
		let c_chan = 0;
		let c_le = 0;

		let newArr = self.logs.slice();
		newArr.reverse();
		newArr.forEach(function(newDS){
			let data = Object.values(newDS);
			let gameChan = 0;
			data.forEach(function(kqH){
				if (kqH) {
					gameChan++;
				}
			});

			let type  = !(gameChan%2);
			if (tmp_DS === -1) {
				tmp_DS = type;
			}
			if (type !== tmp_DS || tmp_arrB.length > 3) {
				tmp_DS = type;
				//tmp_arrB.reverse();
				tmp_arrA.push(tmp_arrB);
				tmp_arrB = [];
			}
			if (type === tmp_DS) {
				tmp_arrB.push(gameChan)
			}
		});

		//tmp_arrB.reverse();
		tmp_arrA.push(tmp_arrB);
		tmp_arrA.reverse();
		tmp_arrA = tmp_arrA.slice(0, 12);

		this.log_top.forEach(function(obj, index){
			let data = tmp_arrA[index];
			if (data) {
				obj.cell.active = true;

				obj.data.forEach(function(cell, j){
					let jD = data[j];
					if (void 0 !== jD) {
						cell.c.node.parent.active = true;
						cell.c.spriteFrame = !(jD%2) ? (jD === 4 ? self.dot_red : self.dot_white) : self.dot_red;
						cell.t.string = jD === 0 ? 4 : jD;

						if (!(jD%2)) {
							c_chan++;
						}else{
							c_le++;
						}
					}else{
						cell.c.node.parent.active = false;
					}
				});
			}else{
				obj.cell.active = false;
			}
		});

		this.log_chan.string = c_chan;
		this.log_le.string   = c_le;
	},
	changerBet: function(event, bet){
		let target = event.target;
		this.cuoc = target.name;
		this.bet.children.forEach(function(obj){
			if (obj == target) {
				obj.children[0].active = false;
				obj.children[1].active = true;
				obj.pauseSystemEvents();
			}else{
				obj.children[0].active = true;
				obj.children[1].active = false;
				obj.resumeSystemEvents();
			}
		})
	},
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		this.updateMeCoint();
	},
	onCuoc: function(event, box){
		cc.RedT.send({g:{xocxoc:{cuoc:{red:this.red, cuoc:this.cuoc, box:box}}}});
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.miniNotice.addChild(notice);
	},
	clientsChip: function(data){
		let nodeBox = null;
		let max     = this.maxBox1_3;

		switch(data.box) {
		  	case 'chan':
		  		nodeBox = this.box_chan;
		  		max = this.maxBox1_1;
		    break;

		  	case 'le':
		  		nodeBox = this.box_le;
		  		max = this.maxBox1_1;
		    break;

		    case 'red3':
		  		nodeBox = this.box_red3;
		    break;

		    case 'red4':
		  		nodeBox = this.box_red4;
		    break;

		    case 'white3':
		  		nodeBox = this.box_white3;
		    break;

		    case 'white4':
		  		nodeBox = this.box_white4;
		    break;
		}

		let position = this.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);
		position = nodeBox.children[1].convertToNodeSpaceAR(position);

		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_'+data.cuoc];
		newN.node.position = position;
		newN.node.scale    = 0.67;

		nodeBox.children[1].addChild(newN.node);
		newN.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 0.3), cc.moveTo(0.3, cc.v2((Math.random()*(max.x+1))>>0, (Math.random()*(max.y+1))>>0))), cc.callFunc(function(){this._playSFX(this.audioSingleChip)}, this)));
	},
	meChip: function(data){
		let nodeBet = null;
		let nodeBox = null;
		let max     = this.maxBox1_3;

		this.bet.children.forEach(function(bet){
			if (bet.name == data.cuoc) {
				nodeBet = bet;
			}
		});

		switch(data.box) {
		  	case 'chan':
		  		nodeBox = this.box_chan;
		  		max = this.maxBox1_1;
		    break;

		  	case 'le':
		  		nodeBox = this.box_le;
		  		max = this.maxBox1_1;
		    break;

		    case 'red3':
		  		nodeBox = this.box_red3;
		    break;

		    case 'red4':
		  		nodeBox = this.box_red4;
		    break;

		    case 'white3':
		  		nodeBox = this.box_white3;
		    break;

		    case 'white4':
		  		nodeBox = this.box_white4;
		    break;
		}

		let position = nodeBet.parent.convertToWorldSpaceAR(nodeBet.position);
		position = nodeBox.children[1].convertToNodeSpaceAR(position);

		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_'+data.cuoc];
		newN.node.position = position;

		nodeBox.children[1].addChild(newN.node);
		newN.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 0.3), cc.moveTo(0.3, cc.v2((Math.random()*(max.x+1))>>0, (Math.random()*(max.y+1))>>0))), cc.callFunc(function(){this._playSFX(this.audioSingleChip)}, this)));
		//newN.node.runAction(cc.spawn(cc.scaleTo(0.3, 0.3), cc.moveTo(0.3, cc.v2((Math.random()*(max.x+1))>>0, (Math.random()*(max.y+1))>>0))));
	},
	updateMe: function(data){
		if (data.red) {
			this.updateMeRed(data.red);
		}
		if (data.xu) {
			this.updateMeXu(data.xu);
		}
	},
	updateMeRed: function(data){
		if (data.chan > 0) {
			this.users.red.chan = data.chan;
			this.red && (this.me_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.users.red.le = data.le;
			this.red && (this.me_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.users.red.red3 = data.red3;
			this.red && (this.me_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.users.red.red4 = data.red4;
			this.red && (this.me_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.users.red.white3 = data.white3;
			this.red && (this.me_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.users.red.white4 = data.white4;
			this.red && (this.me_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateMeXu: function(data){
		if (data.chan > 0) {
			this.users.xu.chan = data.chan;
			!this.red && (this.me_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.users.xu.le = data.le;
			!this.red && (this.me_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.users.xu.red3 = data.red3;
			!this.red && (this.me_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.users.xu.red4 = data.red4;
			!this.red && (this.me_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.users.xu.white3 = data.white3;
			!this.red && (this.me_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.users.xu.white4 = data.white4;
			!this.red && (this.me_white4.string = helper.numberWithCommas(data.white4));
		}
	},

	updateClient: function(data){
		if (data.red) {
			this.updateClientRed(data.red);
		}
		if (data.xu) {
			this.updateClientXu(data.xu);
		}
	},
	updateClientRed: function(data){
		if (data.chan > 0) {
			this.clients.red.chan = data.chan;
			this.red && (this.total_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.clients.red.le = data.le;
			this.red && (this.total_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.clients.red.red3 = data.red3;
			this.red && (this.total_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.clients.red.red4 = data.red4;
			this.red && (this.total_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.clients.red.white3 = data.white3;
			this.red && (this.total_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.clients.red.white4 = data.white4;
			this.red && (this.total_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateClientXu: function(data){
		if (data.chan > 0) {
			this.clients.xu.chan = data.chan;
			!this.red && (this.total_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.clients.xu.le = data.le;
			!this.red && (this.total_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.clients.xu.red3 = data.red3;
			!this.red && (this.total_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.clients.xu.red4 = data.red4;
			!this.red && (this.total_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.clients.xu.white3 = data.white3;
			!this.red && (this.total_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.clients.xu.white4 = data.white4;
			!this.red && (this.total_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateMeCoint: function(){
		if (this.red) {
			this.me_chan.string   = this.users.red.chan   > 0 ? helper.numberWithCommas(this.users.red.chan)   : '';
			this.me_le.string     = this.users.red.le     > 0 ? helper.numberWithCommas(this.users.red.le)     : '';
			this.me_red3.string   = this.users.red.red3   > 0 ? helper.numberWithCommas(this.users.red.red3)   : '';
			this.me_red4.string   = this.users.red.red4   > 0 ? helper.numberWithCommas(this.users.red.red4)   : '';
			this.me_white3.string = this.users.red.white3 > 0 ? helper.numberWithCommas(this.users.red.white3) : '';
			this.me_white4.string = this.users.red.white4 > 0 ? helper.numberWithCommas(this.users.red.white4) : '';

			this.total_chan.string   = this.clients.red.chan   > 0 ? helper.numberWithCommas(this.clients.red.chan)   : '';
			this.total_le.string     = this.clients.red.le     > 0 ? helper.numberWithCommas(this.clients.red.le)     : '';
			this.total_red3.string   = this.clients.red.red3   > 0 ? helper.numberWithCommas(this.clients.red.red3)   : '';
			this.total_red4.string   = this.clients.red.red4   > 0 ? helper.numberWithCommas(this.clients.red.red4)   : '';
			this.total_white3.string = this.clients.red.white3 > 0 ? helper.numberWithCommas(this.clients.red.white3) : '';
			this.total_white4.string = this.clients.red.white4 > 0 ? helper.numberWithCommas(this.clients.red.white4) : '';
		}else{
			this.me_chan.string   = this.users.xu.chan   > 0 ? helper.numberWithCommas(this.users.xu.chan)   : '';
			this.me_le.string     = this.users.xu.le     > 0 ? helper.numberWithCommas(this.users.xu.le)     : '';
			this.me_red3.string   = this.users.xu.red3   > 0 ? helper.numberWithCommas(this.users.xu.red3)   : '';
			this.me_red4.string   = this.users.xu.red4   > 0 ? helper.numberWithCommas(this.users.xu.red4)   : '';
			this.me_white3.string = this.users.xu.white3 > 0 ? helper.numberWithCommas(this.users.xu.white3) : '';
			this.me_white4.string = this.users.xu.white4 > 0 ? helper.numberWithCommas(this.users.xu.white4) : '';

			this.total_chan.string   = this.clients.xu.chan   > 0 ? helper.numberWithCommas(this.clients.xu.chan)   : '';
			this.total_le.string     = this.clients.xu.le     > 0 ? helper.numberWithCommas(this.clients.xu.le)     : '';
			this.total_red3.string   = this.clients.xu.red3   > 0 ? helper.numberWithCommas(this.clients.xu.red3)   : '';
			this.total_red4.string   = this.clients.xu.red4   > 0 ? helper.numberWithCommas(this.clients.xu.red4)   : '';
			this.total_white3.string = this.clients.xu.white3 > 0 ? helper.numberWithCommas(this.clients.xu.white3) : '';
			this.total_white4.string = this.clients.xu.white4 > 0 ? helper.numberWithCommas(this.clients.xu.white4) : '';
		}
	},
});
