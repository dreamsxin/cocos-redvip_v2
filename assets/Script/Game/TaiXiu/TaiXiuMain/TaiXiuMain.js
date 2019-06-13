
var TX_Board    = require('TaiXiuBoard'),
	TX_Chat     = require('TaiXiuChat'),
	BrowserUtil = require('BrowserUtil'),
	helper      = require('Helper'),
	TaiXiu_efScale = require('TaiXiu_efScale');

cc.Class({
	extends: cc.Component,
	properties: {
		background: {
			default: null,
			type:    cc.Node
		},
		inputLeft: {
			default: null,
			type:    cc.EditBox
		},
		inputRight: {
			default: null,
			type:    cc.EditBox
		},
		totalLeft: {
			default: null,
			type:    cc.Label
		},
		totalRight: {
			default: null,
			type:    cc.Label
		},
		myLeft: {
			default: null,
			type:    cc.Label
		},
		myRight: {
			default: null,
			type:    cc.Label
		},
		playerLeft: {
			default: null,
			type:    cc.Label
		},
		playerRight: {
			default: null,
			type:    cc.Label
		},
		nodeKetQua: {
			default: null,
			type:    cc.Node
		},
		labelKetQua: {
			default: null,
			type:    cc.Label
		},
		timeWait: {
			default: null,
			type:    cc.Label
		},
		nodeTimeWait: {
			default: null,
			type:    cc.Node
		},
		timeCuoc: {
			default: null,
			type:    cc.Label
		},
		timePopup: {
			default: null,
			type:    cc.Label
		},
		nodeChanLe: {
			default: null,
			type:    cc.Node
		},
		nodeTaiXiu: {
			default: null,
			type:    cc.Node
		},
		nodeTimePopup: {
			default: null,
			type:    cc.Node
		},
		labelPhien: {
			default: null,
			type:    cc.Label
		},
		diaNan: {
			default: null,
			type:    cc.Node
		},
		dice: {
			default: [],
			type:    cc.Sprite
		},
		diceSF: {
			default: [],
			type:    cc.SpriteFrame
		},
		cointRED: {
			default: null,
			type:    cc.Node
		},
		cointXU: {
			default: null,
			type:    cc.Node
		},
		dotLogs: {
			default: null,
			type:    cc.Node
		},
		gameCover: {
			default: null,
			type:    cc.Label
		},
		diceAnimation: {
			default: null,
			type:    cc.Animation
		},
		efTai: TaiXiu_efScale,
		efXiu: TaiXiu_efScale,
		efChan: TaiXiu_efScale,
		efLe:  TaiXiu_efScale,
		frameNan: {
			default: [],
			type:    cc.SpriteFrame
		},
		spriteNan: {
			default: null,
			type:    cc.Sprite
		},
		dot_black: {
			default: null,
			type:    cc.SpriteFrame
		},
		dot_white: {
			default: null,
			type:    cc.SpriteFrame
		},
		dot_yellow: {
			default: null,
			type:    cc.SpriteFrame
		},
		notice: {
			default: null,
			type:    cc.Node
		},
		mini_warning: {
			default: null,
			type:    cc.Prefab
		},
		fontCong: {
			default: null,
			type:    cc.BitmapFont
		},
		fontTru: {
			default: null,
			type:    cc.BitmapFont
		},
		WIN_HT: {
			default: null,
			type:    cc.Label
		},
		WIN_DN: {
			default: null,
			type:    cc.Label
		},
		LOST_HT: {
			default: null,
			type:    cc.Label
		},
		LOST_DN: {
			default: null,
			type:    cc.Label
		},
		TX_Chat: TX_Chat,
		TX_Board: TX_Board,
		red:    true,
		taixiu: true,
	},
	init: function(obj) {
		this.RedT = obj;
		this.data = {taixiu:{}, chanle:{}, du_day:{}};
		this.isNan  = this.getLogs = false;
	},
	onLoad () {
		var self      = this;
		this.ttOffset = null;
		this.editboxs = [this.inputLeft, this.inputRight];
		this.TX_Board.init(this);
		this.TX_Chat.init(this);

		this.diaNan.getComponent('TaiXiu_DiaNan')
		.init(this);

		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onCuocClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}

		Promise.all(this.dotLogs.children.map(function(dot){
			var temp = dot.getComponent(cc.Sprite);
			temp.mod = dot.getComponent('TaiXiuMain_logTips');
			return temp;
		}))
		.then(resulf => {
			this.dotLogs = resulf;
		})

		this.onDiceAnimationFinish = function(event){
			this.setDice(true);
			if (this.isNan) {
			}else{
				this.dataLogs();
				this.nodeKetQua.active = true;
				if (this.diemSo > 10) {
					this.efTai.play()
				}else{
					this.efXiu.play()
				}
				if (this.diemSo%2) {
					this.efLe.play()
				}else{
					this.efChan.play()
				}
			}
			this.diceAnimation.node.active = false;
		}
		this.diceAnimation.on('finished', this.onDiceAnimationFinish, this);

		this.onCuocClick = function(){
			var bet = helper.getOnlyNumberInString(self.input.string);
			bet = parseInt(bet);
			self.input.string = '';
			self.TX_Board.node.active = false;
			if (isNaN(bet) || bet < 1000) {
				var notice = cc.instantiate(self.mini_warning);
				var noticeComponent = notice.getComponent('mini_warning');
				noticeComponent.text.string = "Tiền cược phải lớn hơn 1.000 " + (self.red ? "Red" : "Xu");
				self.notice.addChild(notice);
			}else{
				cc.RedT.send({taixiu: {cuoc: {red: self.red, taixiu: self.taixiu, select: (self.input.node.name == "inputLeft"), bet: bet}}});
			}
		}
	},
	onEnable: function () {
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);

		cc.sys.isBrowser && this.addEvent();
		this.nodeTimePopup.active = false;
	},
	onDisable: function () {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);

		cc.sys.isBrowser && this.removeEvent();
		this.clean();
		!!cc.RedT.IS_LOGIN && (this.nodeTimePopup.active = true);
	},
	addEvent: function() {
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1);
		}
	},
	removeEvent: function() {
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1);
		}
	},
	changeNextFocusEditBox: function() {
		for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++)
			if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
				i <= ++e && (e = 0),
				BrowserUtil.focusEditBox(this.editboxs[e]),
				t = !0;
				break
			}
		!t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0])
	},
	clean: function(){
		this.inputLeft.string = this.inputRight.string = '';
	},
	onChangerGame: function(){
		this.taixiu = !this.taixiu;
		this.gameCover.string  = this.taixiu ? "Chẵn Lẻ" : "Tài Xỉu";
		this.nodeTaiXiu.active = this.taixiu;
		this.nodeChanLe.active = !this.taixiu;
		this.dataLogs();
		this.RedT.TX_ThongKe.onChangerGame();
		this.RedT.TX_LichSuPhien.onChangerGame();
		this.taixiu && this.onDataTaiXiu(this.data.taixiu);
		!this.taixiu && this.onDataChanLe(this.data.chanle);
		this.onDuDay(this.data.du_day);
	},
	onChangerNan: function(){
		this.isNan = !this.isNan;
		this.spriteNan.spriteFrame = this.isNan ? this.frameNan[1] : this.frameNan[0];
	},
	onChangerRED: function(){
		this.red = !this.red;
		this.cointRED.active = !this.cointRED.active;
		this.cointXU.active  = !this.cointXU.active;
		this.totalLeft.node.color = this.totalRight.node.color = this.red ? this.totalRight.node.color.fromHEX('#FFEB0A') : this.totalRight.node.color.fromHEX('#FFFFFF');
		this.RedT.TX_LichSuPhien.onChangerCoint();
		this.taixiu && this.onDataTaiXiu(this.data.taixiu);
		!this.taixiu && this.onDataChanLe(this.data.chanle);
		this.onDuDay(this.data.du_day);
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
	},
	eventEnd: function(){},
	setTop: function(){
		this.node.parent.insertChild(this.node);
		this.RedT.setTop();
	},
	onSelectInput: function(event, select){
		this.TX_Board.node.active = true;
		switch(select) {
			case 'right':
				this.input = this.inputRight;
			break;

			case 'left':
				this.input = this.inputLeft;
			break;
		}
	},
	onChangerInput: function(){
		var value = helper.numberWithCommas(helper.getOnlyNumberInString(this.input.string));
		this.input.string = value == "0" ? "" : value;
	},
	setPhien:function(){
		var phien = this.logs[0].phien+1;
		this.labelPhien.string = "#" + phien;
	},
	setDice: function(bool = false, sprite = true){
		var self = this;
		Promise.all(this.dice.map(function(dice, index){
			sprite && (dice.spriteFrame = self.diceSF[self.logs[0].dice[index]-1]);
			dice.node.active = bool;
		}))
	},
	onData: function(data){
		if (void 0 !== data.get_phien) {
			this.RedT.TX_LichSuPhien.onData(data.get_phien);
		}
		if(void 0 !== data.err){
			var notice = cc.instantiate(this.mini_warning)
			var noticeComponent = notice.getComponent('mini_warning')
			noticeComponent.text.string = data.err;
			this.notice.addChild(notice);
		}
		if (void 0 !== data.du_day) {
			Object.assign(this.data.du_day, data.du_day);
			this.onDuDay(data.du_day);
		}
		if (void 0 !== data.taixiu) {
			Object.assign(this.data.taixiu, data.taixiu);
			this.taixiu && this.onDataTaiXiu(data.taixiu);
		}
		if (void 0 !== data.chanle) {
			Object.assign(this.data.chanle, data.chanle);
			!this.taixiu && this.onDataChanLe(data.chanle);
		}
		if(void 0 !== data.get_top){
			this.RedT.TX_Top.onData(data.get_top);
		}
		if(void 0 !== data.chat){
			this.TX_Chat.onData(data.chat);
		}
		if(void 0 !== data.status){
			this.status(data.status)
		}
		if(void 0 !== data.get_log){
			this.RedT.TX_LichSu.onData(data.get_log);
		}
		if(void 0 !== data.logs){
			this.logs    = data.logs;
			this.dataLogs();
			this.setPhien();
			if(this.time_remain > 60){
				this.setDice(!0);
				this.nodeTimeWait.active  = true;
				this.timeCuoc.node.active = false;
			}
			this.getLogs = true;
		}
		if(void 0 !== data.time_remain){
			this.time_remain = data.time_remain;
			this.playTime();
		}
		if(void 0 !== data.finish){
			if (this.getLogs) {
				// Huỷ đếm
				void 0 !== this.timeInterval && clearInterval(this.timeInterval);
				// Thêm kết quả
				this.logs.unshift({dice: [data.finish.dices[0], data.finish.dices[1], data.finish.dices[2]], phien: data.finish.phien});
				this.logs.length > 120 && this.logs.pop();
				// Đặt dữ liệu
				this.diemSo = data.finish.dices[0]+data.finish.dices[1]+data.finish.dices[2];
				this.labelKetQua.string = this.diemSo;
				if(this.isNan){
					this.diaNan.active         = true;
					this.diaNan.position       = cc.v2(0,-11.5);
					this.spriteNan.node.active = false;
					this.onDiceAnimationFinish();
				} else {
					this.diceAnimation.node.active = true;
					if (this.node.activeInHierarchy) {
						this.diceAnimation.play();
					}else{
						this.onDiceAnimationFinish();
					}
				}
				this.nodeTimeWait.active  = true;
				this.timeCuoc.node.active = false;
			}
			this.time_remain = 77;
			//this.time_remain = 82;
			this.playTime();
		}
	},
	efStop: function(){
		this.efTai.stop();
		this.efXiu.stop();
		this.efLe.stop();
		this.efChan.stop();
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function() {
			if (this.time_remain > 61) {
				var time = helper.numberPad(this.time_remain-62, 2);
				this.timePopup.node.active && (this.timePopup.string = time) && (this.timePopup.node.color = cc.color(255, 0, 0, 255));
				this.timeWait.string = '00:' + helper.numberPad(time, 2);
				if (this.time_remain < 71) {
					this.efStop();
				}
				if (this.time_remain < 66) {
					this.nodeKetQua.active = false;
					this.isNan && (this.diaNan.active = false);
				}
			}else{
				if (!!this.dice[0].node.active) {
					this.setDice(false, false);
					this.reset();
				}
				this.efStop();
				this.nodeTimeWait.active  = this.nodeKetQua.active     = this.diaNan.active = false;
				this.timeCuoc.node.active = this.spriteNan.node.active = true;
				if (this.time_remain > 0) {
					var time = helper.numberPad(this.time_remain-1, 2);
					if(this.getLogs){
						this.timeCuoc.string = '00:' + time;
					}
					this.timePopup.node.active && (this.timePopup.string = time) && (this.timePopup.node.color = cc.color(155, 75, 2, 255))
					if (this.time_remain <= 10)
						this.timeCuoc.node.color = cc.color(255, 69, 69, 255)
					else
						this.timeCuoc.node.color = cc.Color.WHITE
				}else clearInterval(this.timeInterval);
			}
			this.time_remain--;
		}
		.bind(this), 1000)
	},
	onDataChanLe: function(data){
		if (this.red) {
			void 0 !== data.red_chan        && (this.totalLeft.string   = helper.numberWithCommas(data.red_chan));
			void 0 !== data.red_le          && (this.totalRight.string  = helper.numberWithCommas(data.red_le));
			void 0 !== data.red_me_chan     && (this.myLeft.string      = helper.numberWithCommas(data.red_me_chan));
			void 0 !== data.red_me_le       && (this.myRight.string     = helper.numberWithCommas(data.red_me_le));
			void 0 !== data.red_player_chan && (this.playerLeft.string  = helper.numberWithCommas(data.red_player_chan));
			void 0 !== data.red_player_le   && (this.playerRight.string = helper.numberWithCommas(data.red_player_le));
		}else{
			void 0 !== data.xu_chan        && (this.totalLeft.string   = helper.numberWithCommas(data.xu_chan));
			void 0 !== data.xu_le          && (this.totalRight.string  = helper.numberWithCommas(data.xu_le));
			void 0 !== data.xu_me_chan     && (this.myLeft.string      = helper.numberWithCommas(data.xu_me_chan));
			void 0 !== data.xu_me_le       && (this.myRight.string     = helper.numberWithCommas(data.xu_me_le));
			void 0 !== data.xu_player_chan && (this.playerLeft.string  = helper.numberWithCommas(data.xu_player_chan));
			void 0 !== data.xu_player_le   && (this.playerRight.string = helper.numberWithCommas(data.xu_player_le));
		}
	},
	onDataTaiXiu: function(data){
		if (this.red) {
			void 0 !== data.red_tai        && (this.totalLeft.string   = helper.numberWithCommas(data.red_tai));
			void 0 !== data.red_xiu        && (this.totalRight.string  = helper.numberWithCommas(data.red_xiu));
			void 0 !== data.red_me_tai     && (this.myLeft.string      = helper.numberWithCommas(data.red_me_tai));
			void 0 !== data.red_me_xiu     && (this.myRight.string     = helper.numberWithCommas(data.red_me_xiu));
			void 0 !== data.red_player_tai && (this.playerLeft.string  = helper.numberWithCommas(data.red_player_tai));
			void 0 !== data.red_player_xiu && (this.playerRight.string = helper.numberWithCommas(data.red_player_xiu));
		}else{
			void 0 !== data.xu_tai        && (this.totalLeft.string   = helper.numberWithCommas(data.xu_tai));
			void 0 !== data.xu_xiu        && (this.totalRight.string  = helper.numberWithCommas(data.xu_xiu));
			void 0 !== data.xu_me_tai     && (this.myLeft.string      = helper.numberWithCommas(data.xu_me_tai));
			void 0 !== data.xu_me_xiu     && (this.myRight.string     = helper.numberWithCommas(data.xu_me_xiu));
			void 0 !== data.xu_player_tai && (this.playerLeft.string  = helper.numberWithCommas(data.xu_player_tai));
			void 0 !== data.xu_player_xiu && (this.playerRight.string = helper.numberWithCommas(data.xu_player_xiu));
		}
	},
	onDuDay: function(data){
		if (this.taixiu) {
			if (this.red) {
				this.WIN_HT.string  = data.t_day_thang_red_ht;
				this.WIN_DN.string  = data.t_day_thang_red;
				this.LOST_HT.string = data.t_day_thua_red_ht;
				this.LOST_DN.string = data.t_day_thua_red;
			}else{
				this.WIN_HT.string  = data.t_day_thang_xu_ht;
				this.WIN_DN.string  = data.t_day_thang_xu;
				this.LOST_HT.string = data.t_day_thua_xu_ht;
				this.LOST_DN.string = data.t_day_thua_xu;
			}
		}else{
			if (this.red) {
				this.WIN_HT.string  = data.c_day_thang_red_ht;
				this.WIN_DN.string  = data.c_day_thang_red;
				this.LOST_HT.string = data.c_day_thua_red_ht;
				this.LOST_DN.string = data.c_day_thua_red;
			}else{
				this.WIN_HT.string  = data.c_day_thang_xu_ht;
				this.WIN_DN.string  = data.c_day_thang_xu;
				this.LOST_HT.string = data.c_day_thua_xu_ht;
				this.LOST_DN.string = data.c_day_thua_xu;
			}
		}
	},
	dataLogs: function(){
		if (!!this.logs.length) {
			var self = this;
			//Main log
			Promise.all(this.dotLogs.map(function(dot, index){
				var data = self.logs[index];
				if (void 0 !== data) {
					var point = data.dice[0] + data.dice[1] + data.dice[2];
					dot.node.active = true;
					dot.node.phien = data.phien;
					dot.mod.text.string = data.dice[0] + '-' + data.dice[1] + '-' + data.dice[2];
					dot.spriteFrame = self.taixiu ? (point < 11 ? self.dot_white : self.dot_black) : (point%2 ? self.dot_black : self.dot_yellow);
				}else{
					dot.node.active = false;
				}
			}));
			//this.dotLogs

			var line_dice1 = [];
			var line_dice2 = [];
			var line_dice3 = [];
			var line_tong  = [];

			var tmp_DS = -1;
			var tmp_arrA = [];
			var tmp_arrB = [];
			var c_tai = 0;
			var c_xiu = 0;

			var sliced = this.logs.slice(0, 19);
			sliced.reverse();
			// Line paint
			var Paint = new Promise(function(resolve, reject){
				for (var i = 0; i < sliced.length; i++) {
					var data = sliced[i];
					if (void 0 !== data) {
						self.RedT.TX_ThongKe.lineAc(i, true);
						var dice1 = sliced[i].dice[0];
						var dice2 = sliced[i].dice[1];
						var dice3 = sliced[i].dice[2];
						var tong = dice1+dice2+dice3;

						line_dice1[i] = {x:i*28, y:dice1*28-28, dice: dice1};
						line_dice2[i] = {x:i*28, y:dice2*28-28, dice: dice2};
						line_dice3[i] = {x:i*28, y:dice3*28-28, dice: dice3};
						line_tong[i]  = {x:i*27.7, y:tong*9.233-27.7, tong: tong}
					}else{
						self.RedT.TX_ThongKe.lineAc(i, false);
					}
				}
				self.RedT.TX_ThongKe.draw(self.RedT.TX_ThongKe.dice1_line, self.RedT.TX_ThongKe.dice1_dots, line_dice1);
				self.RedT.TX_ThongKe.draw(self.RedT.TX_ThongKe.dice2_line, self.RedT.TX_ThongKe.dice2_dots, line_dice2);
				self.RedT.TX_ThongKe.draw(self.RedT.TX_ThongKe.dice3_line, self.RedT.TX_ThongKe.dice3_dots, line_dice3);
				self.RedT.TX_ThongKe.draw_Tong(self.RedT.TX_ThongKe.tong_line, line_tong);
			});

			// Ket Qua
			var KetQua = Promise.all(this.RedT.TX_ThongKe.KetQuaDot.map(function(dot, index){
				var data = self.logs[index];
				if (void 0 !== data) {
					dot.node.active = true;
					var point = data.dice[0] + data.dice[1] +data.dice[2];
					dot.spriteFrame = self.taixiu ? (point < 11 ? self.dot_white : self.dot_black) : (point%2 ? self.dot_black : self.dot_yellow);
					return self.taixiu ? (point > 10 ? 1 : 0) : (point%2 ? 0 : 1);
				}else{
					dot.node.active = false;
					return -1;
				}
			}));

			// Diem So
			var diemSo = new Promise((resolve, reject) => {
				var newArr = self.logs.slice();
				newArr.reverse();
				for (var newDS of newArr) {
					var point = newDS.dice[0]+newDS.dice[1]+newDS.dice[2];
					var type  = self.taixiu ? (point > 10 ? 1 : 0) : (point%2 ? 0 : 1);
					if (tmp_DS === -1) {
						tmp_DS = type;
					}
					if (type != tmp_DS || tmp_arrB.length > 4) {
						tmp_DS = type;
						tmp_arrA.push(tmp_arrB);
						tmp_arrB = [];
					}
					if (type == tmp_DS) {
						tmp_arrB.push(point)
					}
				}
				tmp_arrA.push(tmp_arrB);
				resolve(tmp_arrA);
			});

			Promise.all([KetQua, diemSo]).then(values => {
				var newData = values[1];
				newData.reverse();
				newData = newData.slice(0, 20);
				newData.reverse();
				self.RedT.TX_ThongKe.KetQuaLeft.string  = values[0].filter(i => i == 1).length;
				self.RedT.TX_ThongKe.KetQuaRight.string = values[0].filter(i => i == 0).length;
				Promise.all(self.RedT.TX_ThongKe.DiemSoCel.map(function(obj, i){
					var data = newData[i];
					if (void 0 !== data) {
						obj.active = true;
						return Promise.all(obj.RedT.map(function(current, index){
							var data_Cel = data[index];
							if (void 0 !== data_Cel) {
								var type = self.taixiu ? (data_Cel > 10 ? true : false) : (data_Cel%2 ? false : true);
								c_tai = type  ? c_tai+1 : c_tai;
								c_xiu = !type ? c_xiu+1 : c_xiu;
								current.active = true;
								current.color = self.taixiu ? (type ? cc.Color.BLACK : cc.Color.WHITE) : (type ? cc.Color.YELLOW : cc.Color.BLACK)
								current.text.string = data_Cel;
								current.text.node.color = self.taixiu ? (type ? cc.Color.WHITE : cc.Color.BLACK) : (type ? cc.Color.BLACK : cc.Color.WHITE)
							}else{
								current.active = false;
							}
							return void 0;
						}))
					}else{
						obj.active = false;
					}
					return void 0;
				})).then(varT => {
					self.RedT.TX_ThongKe.DiemSoLeft.string  = c_tai;
					self.RedT.TX_ThongKe.DiemSoRight.string = c_xiu;
				})
			});
		}
	},
	reset: function(){
		this.setPhien();
		this.isNan && this.dataLogs();
		this.data.chanle.red_chan = this.data.chanle.red_le = this.data.chanle.red_me_chan = this.data.chanle.red_me_le = this.data.chanle.red_player_chan = this.data.chanle.red_player_le = this.data.chanle.xu_chan = this.data.chanle.xu_le = this.data.chanle.xu_me_chan = this.data.chanle.xu_me_le = this.data.chanle.xu_player_chan = this.data.chanle.xu_player_le = this.data.taixiu.red_me_tai = this.data.taixiu.red_me_xiu = this.data.taixiu.red_player_tai = this.data.taixiu.red_player_xiu = this.data.taixiu.red_tai = this.data.taixiu.red_xiu = this.data.taixiu.xu_me_tai = this.data.taixiu.xu_me_xiu = this.data.taixiu.xu_player_tai = this.data.taixiu.xu_player_xiu = this.data.taixiu.xu_tai = this.data.taixiu.xu_xiu = this.totalLeft.string = this.totalRight.string = this.myLeft.string = this.myRight.string = this.playerLeft.string = this.playerRight.string = 0;
	},
	setDefautl: function(){
		this.getLogs = this.nodeTimePopup.active = false;
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.TX_Chat.reset();
	},
	status: function(data){
		setTimeout(function() {
			if(!this.isNan){
				var temp = new cc.Node;
				temp.addComponent(cc.Label);
				temp = temp.getComponent(cc.Label);
				temp.string = (data.win ? '+' : '-') + helper.numberWithCommas(data.bet);
				temp.font = data.win ? this.fontCong : this.fontTru;
				temp.lineHeight = 130;
				temp.fontSize   = 22;
				temp.node.color    = data.win ? cc.color(255,245,0,255) : cc.color(199,199,199,255);
				temp.node.position = cc.v2(data.select ? -252 : 252, -50);
				this.notice.addChild(temp.node);
				temp.node.runAction(cc.sequence(cc.moveTo(3, cc.v2(data.select ? -252 : 252, 130)), cc.callFunc(function(){this.node.destroy()}, temp)))
			}
			cc.RedT.send({taixiu:{get_new: true}})
		}
		.bind(this), 2e3)
	},
});
