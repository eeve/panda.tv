/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _colors = __webpack_require__(1);

	var _colors2 = _interopRequireDefault(_colors);

	var _thankQueue = __webpack_require__(2);

	var _thankQueue2 = _interopRequireDefault(_thankQueue);

	var _thankUtils = __webpack_require__(3);

	var thankUtils = _interopRequireWildcard(_thankUtils);

	var _chat = __webpack_require__(6);

	var Chat = _interopRequireWildcard(_chat);

	var _config = __webpack_require__(14);

	var _config2 = _interopRequireDefault(_config);

	var _nodeFetch = __webpack_require__(7);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var roomId = 350372;

	Chat.login(_config2.default.account, _config2.default.password).then(function (userInfo) {
		console.log('登录用户信息', userInfo);
		return Chat.getChatServerInfo(roomId).then(Chat.connect).then(Chat.listenEvent).then(Chat.heartBeat).then(Chat.getTokenAndLogin).then(function (data) {
			console.log('发送弹幕的token: ' + data.token + ', time: ' + data.time);
			// 开启感谢模式
			var second = 0;
			setInterval(function () {
				// 获取感谢语句
				var msg = thankUtils.buildAllThankMsg();
				if (msg) {
					Chat.sendMsg(msg, roomId, data.token, data.time);
					console.log('待播报礼物人数：' + Object.keys(_thankQueue2.default.all()).length);
				} else {
					// second++;
					// if(second > 3){
					// 	Chat.sendMsg('6666666', roomId, data.token, data.time);
					// 	second = 0;
					// }
				}
			}, 10000);
		});
	}).catch(function (e) {
		console.log('error', e);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("colors");

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// 感谢队列
	var Queue = {};

	// let Queue = {
	// 	'001': {
	// 		nickName: '小白',
	// 		zhuzi: 100,
	// 		maobi: 500,
	// 		foutiaoqiang: 1
	// 	}
	// }

	exports.default = {
		addItem: function addItem(id, item) {
			var obj = Queue[id];
			if (!obj) {
				obj = {
					nickName: item.nickName
				};
				obj[item.giftType] = item.count;
				Queue[id] = obj;
			} else {
				var count = obj[item.giftType];
				if (!count) {
					obj[item.giftType] = parseInt(item.count);
				} else {
					obj[item.giftType] = parseInt(count) + parseInt(item.count);
				}
				Queue[id] = obj;
			}
		},
		all: function all() {
			return Queue;
		},
		next: function next() {
			var keys = Object.keys(Queue);
			var key = keys.shift();
			var obj = Queue[key];
			delete Queue[key];
			return obj;
		},
		nextAll: function nextAll() {
			var arr = [];
			for (var key in Queue) {
				var obj = Queue[key];
				delete Queue[key];
				arr.push(obj);
			}
			return arr;
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.addThankItem = addThankItem;
	exports.buildThankMsg = buildThankMsg;
	exports.buildAllThankMsg = buildAllThankMsg;

	var _thankQueue = __webpack_require__(2);

	var _thankQueue2 = _interopRequireDefault(_thankQueue);

	var _giftType = __webpack_require__(4);

	var _giftType2 = _interopRequireDefault(_giftType);

	var _msg = __webpack_require__(5);

	var _msg2 = _interopRequireDefault(_msg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 收到礼物时，添加到感谢队列
	 * @param  {[type]} addThankItem [description]
	 * @return {[type]}              [description]
	 */
	function addThankItem(messageModel, giftType, count) {
		var from = messageModel.from;

		_thankQueue2.default.addItem(from.rid, {
			giftType: giftType,
			nickName: from.nickName,
			count: count
		});
	}

	/**
	 * 将指定感谢队列中的元素构造为感谢语句
	 * @param  {[type]} buildThankMsg [description]
	 * @return {[type]}               [description]
	 */
	function buildThankMsg(item) {
		if (!item) {
			console.log('队列无礼物。。。');
			return;
		}
		var msg = '感谢' + item.nickName + '送的';
		if (item[_giftType2.default.ZHUZI]) {
			var count = item[_giftType2.default.ZHUZI];
			count = count > 1000 ? '一大波' : count + '个';
			msg += count + '竹子。';
		}
		if (item[_giftType2.default.FANTUAN]) {
			msg += item[_giftType2.default.FANTUAN] + '个饭团。';
		}
		if (item[_giftType2.default.KAOYU]) {
			msg += item[_giftType2.default.KAOYU] + '个烤鱼。';
		}
		if (item[_giftType2.default.LONGXIA]) {
			msg += item[_giftType2.default.LONGXIA] + '个龙虾。';
		}
		if (item[_giftType2.default.FOTIAOQIANG]) {
			msg += item[_giftType2.default.FOTIAOQIANG] + '个佛跳墙。';
		}
		return msg;
	}

	/**
	 * 检测感谢队列，将所有感谢元素构造成感谢语句并返回，感谢队列没有元素时返回null
	 * @param  {[type]} refreshAllThank [description]
	 * @return {[type]}                 [description]
	 */
	function buildAllThankMsg() {
		var items = _thankQueue2.default.nextAll();
		var msg = '';
		for (var i = 0; i < items.length; i++) {
			if (msg.length > 50) {
				break;
			}
			var item = items[i];
			msg += buildThankMsg(item);
		}
		return msg ? msg + (0, _msg2.default)() : null;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		ZHUZI: 'zhuzi',
		FANTUAN: 'fantuan',
		KAOYU: 'kaoyu',
		LONGXIA: 'longxia',
		FOTIAOQIANG: 'fotiaoqiang'
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function () {
		var index = parseInt(Math.random() * msgList.length);
		return msgList[index];
	};

	var msgList = ['有免费竹子的走一波', '没订阅的订阅一波，感谢！', '主播就是这么6，没订阅的订阅一波，订阅不迷路。', '66666'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getChatServerInfo = getChatServerInfo;
	exports.connect = connect;
	exports.listenEvent = listenEvent;
	exports.heartBeat = heartBeat;
	exports.sendMsg = sendMsg;
	exports.getTokenAndLogin = getTokenAndLogin;
	exports.login = login;

	var _nodeFetch = __webpack_require__(7);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	var _net = __webpack_require__(8);

	var _net2 = _interopRequireDefault(_net);

	var _cookie = __webpack_require__(9);

	var _cookie2 = _interopRequireDefault(_cookie);

	var _userType = __webpack_require__(10);

	var _userType2 = _interopRequireDefault(_userType);

	var _messageType = __webpack_require__(11);

	var _messageType2 = _interopRequireDefault(_messageType);

	var _giftType = __webpack_require__(4);

	var _giftType2 = _interopRequireDefault(_giftType);

	var _thankUtils = __webpack_require__(3);

	var thankUtils = _interopRequireWildcard(_thankUtils);

	var _CryptoJS = __webpack_require__(12);

	var _CryptoJS2 = _interopRequireDefault(_CryptoJS);

	var _bluebird = __webpack_require__(13);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PD_COOKIES = [];

	var headers = {
		'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8, ja-JP;q=0.7',
		'Accept': '*/*',
		'Connection': 'keep-alive',
		'Accept-Encoding': 'gzip, deflate',
		'User-Agent': 'PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)'
	};

	/**
	 * 获取聊天服务器信息
	 * @param  {[type]} roomId [description]
	 * @return {[type]}        [description]
	 */
	function getChatServerInfo(roomId) {
		return (0, _nodeFetch2.default)('http://api.homer.panda.tv/chatroom/getinfo?roomid=' + roomId).then(function (resp) {
			return resp.json();
		}).then(function (json) {
			var data = json.data;
			var chatAddr = data.chat_addr_list[0];
			var server_ip = chatAddr.split(':')[0];
			var server_port = chatAddr.split(':')[1];
			return {
				"ip": server_ip,
				"port": server_port,
				"rid": data.rid,
				"appid": data.appid,
				"authtype": data.authType,
				"sign": data.sign,
				"ts": data.ts
			};
		});
	}

	function _sendData(socket, msg) {
		var data = new Buffer(msg.length + 6);
		data.writeInt16BE(6, 0);
		data.writeInt16BE(2, 2);
		data.writeInt16BE(msg.length, 4);
		data.write(msg, 6);
		socket.write(data);
	}

	/**
	 * 连接聊天服务器
	 * @param  {[type]} serverInfo [description]
	 * @return {[type]}            [description]
	 */
	function connect(serverInfo) {
		var socket = _net2.default.connect({
			host: serverInfo.ip,
			port: serverInfo.port
		}, function () {
			console.log('connect success');
		});

		var msg = ['u:' + serverInfo.rid + '@' + serverInfo.appid, 'k:1', 't:300', 'ts:' + serverInfo.ts, 'sign:' + serverInfo.sign, 'authtype:' + serverInfo.authtype].join('\n');
		console.log(msg);
		_sendData(socket, msg);

		return _bluebird2.default.resolve({
			serverInfo: serverInfo,
			socket: socket
		});
	}

	function _getMsg(chunk) {
		var msgLen = chunk.readInt16BE(4);
		var msg = chunk.slice(6, 6 + msgLen);
		var offset = 6 + msgLen;
		msgLen = chunk.readInt32BE(offset);
		offset += 4;
		var msgInfo = [];
		msgInfo.push(chunk.slice(offset, offset + msgLen));
		msgInfo.push(msgLen);
		return msgInfo;
	}

	function _analyseMsg(totalMsg) {
		while (totalMsg.length > 0) {
			var IGNORE_LEN = 12;
			totalMsg = totalMsg.slice(IGNORE_LEN);
			var msgLen = totalMsg.readInt32BE(0);
			var msg = totalMsg.slice(4, 4 + msgLen);
			_formatMsg(msg);
			totalMsg = totalMsg.slice(4 + msgLen);
		}
	}

	function _formatMsg(msg) {
		msg = JSON.parse(msg);
		var model = msg.data;
		var content = model.content;
		var from = model.from;
		var msgType = (0, _messageType2.default)(msg.type);
		var nickName = from.nickName;
		switch (msgType.key) {
			case 'danmu':
				var identity = from.identity;
				var sp_identity = from.sp_identity;
				if (sp_identity != 0) {
					nickName = ('#[' + (0, _userType2.default)(sp_identity, true) + ']# ' + nickName).red;
				}
				if (identity != 30) {
					nickName = ('[' + (0, _userType2.default)(identity) + '] ' + nickName).yellow;
				}
				console.log(nickName + ' : ' + content);
				break;
			case 'zhuzi':
				// { from:
				//   { identity: '30',
				//     nickName: '一眼看透你',
				//     rid: '30259118',
				//     sp_identity: '0' },
				//  to: { toroom: '392616' },
				//  content: '100' }
				thankUtils.addThankItem(model, _giftType2.default.ZHUZI, content);
				console.log(('' + nickName).green, '送给主播', ('' + content).green, '个竹子');
				// thank(roomId, nickName, content, '竹子' );
				break;
			case 'maobi':
				// { type: '306',
				//   time: 1474348675,
				//   data:
				//    { from:
				//       { identity: '30',
				//         nickName: '我的小地图',
				//         rid: '31985480',
				//         sp_identity: '0' },
				//      to: { toroom: '392616' },
				//      content:
				//       { avatar: 'http://i5.pdim.gs/1f198faf2b74745fa467af23fe661896.jpg',
				//         combo: '6',
				//         count: '1',
				//         effective: '3',
				//         id: '569856ffb868a87b4f0f9f9c',
				//         name: '饭团',
				//         newBamboos: '21997',
				//         newExp: '1580.36',
				//         pic: [Object],
				//         price: '2' } } }
				var price = content.price;
				if (price / 2 === 1) {
					thankUtils.addThankItem(model, _giftType2.default.FANTUAN, 1);
					console.log(('*******\t' + nickName + '送给主播[1]个饭团\t*******').cyan);
				} else if (price / 50 === 1) {
					console.log(msg);
					thankUtils.addThankItem(model, _giftType2.default.KAOYU, 1);
					console.log(('*******\t' + nickName + '送给主播[1]个烤鱼\t*******').cyan);
				} else if (price / 1000 === 1) {
					thankUtils.addThankItem(model, _giftType2.default.LONGXIA, 1);
					console.log(('*******\t' + nickName + '送给主播[1]个龙虾\t*******').cyan);
				} else if (price / 10000 === 1) {
					thankUtils.addThankItem(model, _giftType2.default.FOTIAOQIANG, 1);
					console.log(('*******\t' + nickName + '送给主播[1]个佛跳墙\t*******').cyan);
				}
				// thank(roomId, nickName, 0, '饭团' );
				break;
			case 'shangfangguan':
				{
					// { type: '209',
					//   time: 1474356837,
					//   data:
					//    { from: { nickName: '楚楚可云', rid: '28287048' },
					//      to:
					//       { identity: '60',
					//         nickName: '赵建思密达',
					//         rid: '4916270',
					//         sp_identity: '0',
					//         toroom: '314497' },
					//      content: 'admin' } }
					var to = model.to;
					console.log(nickName + '将' + to.nickName + '设为了' + (0, _userType2.default)(to.identity));
					break;
				}
			case 'renshu':
				console.log('观众人数更新:' + content);
				break;
			case 'likai':
				{
					// { type: '208',
					//   time: 1474277422,
					//   data:
					//    { from: { rid: '-1' },
					//      to: { toroom: '337852' },
					//      content: '122156459' } }
					var toRoomId = model.to.toroom;
					console.log('有人离开了，去了房间: ' + toRoomId);
					break;
				}
			case 'fotiaoqiang':
				{
					// { type: '311',
					//  time: 1474277415,
					//  data:
					//   { from:
					//      { identity: '60',
					//        nickName: 'NiGo1',
					//        rid: '31717308',
					//        sp_identity: '0' },
					//     to: { nickName: '慕鐶', rid: '34984940', roomid: '438801', toroom: '0' },
					//     content:
					//      { begintime: '1474277415',
					//        countdown: '150',
					//        platshow: '1',
					//        roomshow: '1',
					//        times: '1',
					//        usercombo: '1' } } }
					var _to = model.to;
					var toUserName = _to.nickName;
					var _toRoomId = _to.roomid;
					console.log(nickName + '给' + toUserName + '送了1个佛跳墙，房间号为：' + _toRoomId);
					break;
				}
			case 'xiangyun':
				{
					// { type: '666',
					//   time: 1474352381,
					//   data:
					//    { from: { nickName: 'Armani', rid: '3014640' },
					//      to: { nickName: ' ', rid: '485118', roomid: '485118', toroom: '0' },
					//      content:
					//       { begintime: '1474352381',
					//         countdown: '150',
					//         extra: '',
					//         giftinfo: [Object],
					//         pic: [Object],
					//         platshow: '1',
					//         roomshow: '1',
					//         times: '1',
					//         usercombo: '1' } } }
					var _to2 = model.to;
					var _toUserName = _to2.nickName;
					var _toRoomId2 = _to2.roomid;
					console.log(nickName + '给' + _toUserName + '送了1个祥云，房间号为：' + _toRoomId2, content);
					break;
				}
			case 'adv':
				{
					// { type: '640',
					//   time: 1474353069,
					//   data:
					//    { from: { rid: '0' },
					//      to: { roomid: '485118', toroom: '0' },
					//      content:
					//       { begintime: '1474353069',
					//         countdown: '150',
					//         custommsg: '超级都市SUV风光580，邀请您收看《Hello！女神》精彩节目，快来抢宝箱吧！',
					//         extra: '1',
					//         pic: [Object],
					//         times: '1' } } }
					console.log('[系统广告]：' + content.custommsg);
					break;
				}
			case 'qiangzhuzi':
				{
					// { type: '1010',
					//   time: 1474356465,
					//   data:
					//    { from: { __plat: 'pc_web', nickName: '可惜多路棒棒哒', rid: '5179352' },
					//      to: { toroom: '314497' },
					//      content: { bamboos: '266', content: '个竹子', newBamboos: '0' } } }
					console.log('[' + nickName + '在' + from.__plat + ']：抢到了' + content.bamboos + content.content);
					break;
				}
			case 'chaoguantixing':
				{
					// { type: '22',
					//   time: 1474383833,
					//   data:
					//    { from:
					//       { nickName: 'admin',
					//         reminder_timestamp: '1474384013',
					//         rid: '0',
					//         ttl: '180',
					//         userName: 'admin' },
					//      to: { toroom: '403249' },
					//			content: '请主播注意直播正能量导向，切勿过度调戏水友。维持良好直播秩序' } }
					console.log(('超管提醒：' + content).red);
					break;
				}
			default:
				console.log('>>>> 收到未知消息！'.red, msg);
		}
	}

	/**
	 * 监听事件
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	function listenEvent(params) {
		var socket = params.socket;
		var info = params.info;
		var completeMsg = [];
		// 接收数据
		socket.on('data', function (chunk) {
			completeMsg.push(chunk);
			chunk = Buffer.concat(completeMsg);
			if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 6) {
				console.log('login');
				completeMsg = [];
			} else if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 3) {
				var msg = _getMsg(chunk);
				if (msg[0].length < msg[1]) {
					console.log('parted');
				} else {
					_analyseMsg(msg[0]);
					completeMsg = [];
				}
			} else if (chunk.readInt16BE(0) == 6 && chunk.readInt16BE(2) == 1) {
				console.log('keepalive');
				completeMsg = [];
			} else {
				console.log('error', String(chunk, 'utf8'));
				completeMsg = [];
			}
		});
		// 监听错误
		socket.on('error', function (err) {
			console.log('出现错误，准备销毁socket...', String(err, 'utf8'));
			socket.destroy();
		});

		return _bluebird2.default.resolve(params);
	}

	function _sendKeepalive(socket) {
		var data = new Buffer(4);
		data.writeInt16BE(6, 0);
		data.writeInt16BE(0, 2);
		socket.write(data);
	}

	function heartBeat(params, second) {
		if (!second) {
			second = 150;
		}
		var socket = params.socket;
		setInterval(function () {
			_sendKeepalive(socket);
		}, parseInt(second) * 1000);
		return _bluebird2.default.resolve(params);
	}

	function sendMsg(msg, roomId, sign, time) {
		(0, _nodeFetch2.default)('http://api.m.panda.tv/ajax_send_group_msg', {
			method: 'POST',
			headers: Object.assign(headers, {
				'Host': 'api.m.panda.tv',
				Cookie: PD_COOKIES.join('; '),
				'xiaozhangdepandatv': 1
			}),
			body: '__channel=appstore&__plat=ios&__version=1.1.2.1218&content=' + msg + '&pt_sign=' + sign + '&pt_time=' + time + '&roomid=' + roomId + '&type=1'
		}).then(function (resp) {
			return resp.json();
		}).then(function (res) {
			if (res.errno !== 0) {
				console.log('消息发送失败!'.red, res);
			}
		}).catch(function (err) {
			console.log('发送消息失败...', err);
		});
	}

	/**
	 * 登录并获取发送弹幕的token
	 * @return {[type]} [description]
	 */
	function getTokenAndLogin() {
		return (0, _nodeFetch2.default)('http://api.m.panda.tv/ajax_get_token?__version=1.1.2.1218&__plat=ios&__channel=appstore', {
			headers: Object.assign(headers, {
				Cookie: PD_COOKIES.join('; '),
				xiaozhangdepandatv: 1
			})
		}).then(function (resp) {
			return resp.json();
		}).then(function (res) {
			return res.data;
		});
	}

	/**
	 * 获取加密密码
	 * @param  {[type]} password [description]
	 * @return {[type]}          [description]
	 */

	function _AESPassword(password) {
		return new _bluebird2.default(function (resolve, reject) {
			(0, _nodeFetch2.default)('https://u.panda.tv/ajax_aeskey').then(function (resp) {
				// 收集Cookie
				// SESSCYPHP
				var cs = resp.headers.get('Set-Cookie');
				PD_COOKIES.push(cs.split(';')[0]);
				return resp.json();
			}).then(function (res) {
				if (res && res.errno == 0 && res.data) {
					var key = _CryptoJS2.default.enc.Utf8.parse(res.data);
					var iv = _CryptoJS2.default.enc.Utf8.parse("995d1b5ebbac3761");
					var pwd = _CryptoJS2.default.AES.encrypt(password, key, {
						iv: iv,
						mode: _CryptoJS2.default.mode.CBC,
						padding: _CryptoJS2.default.pad.ZeroPadding
					}).toString();
					resolve(pwd);
				} else {
					reject('获取AES KEY失败');
				}
			}).catch(function (err) {
				return reject(err);
			});
		});
	}

	function _login(query) {
		return new _bluebird2.default(function (resolve, reject) {
			var url = 'https://u.panda.tv/ajax_login?' + query;
			(0, _nodeFetch2.default)(url, {
				headers: {
					'Host': 'api.m.panda.tv',
					'Origin': 'https://m.panda.tv',
					'Referer': 'https://m.panda.tv/login.html?__plat=ios&__version=1.1.2.1218&__channel=appstore&__guid=CEF91AE5-76EA-43B2-B6C7-B11E8B0B3D4D',
					'Cookie': PD_COOKIES.join('; ')
				}
			}).then(function (resp) {
				// 收集Cookie
				// R
				// M
				var cs = resp.headers._headers['set-cookie'];
				var cR = cs[0].split(';')[0];
				var cM = cs[1].split(';')[0];
				PD_COOKIES.push(cR);
				PD_COOKIES.push(cM);
				return resp.json();
			}).then(function (res) {
				if (res) {
					if (res.errno == 0) {
						resolve(res.data);
					} else if (res.errno == 1802) {
						reject('错误过多，稍后再试');
					} else if (res.errno == 1801) {
						reject('错误过多被锁定，请明天再试');
					} else if (res.errno == 1901) {
						reject('reset 异地登录逻辑');
					} else if (res.errno == 1016) {
						reject('用户名或密码错误');
					} else {
						reject(res.errmsg);
					}
				} else {
					reject('登录失败');
				}
			}).catch(function (err) {
				return reject(err);
			});
		});
	}

	function login(account, password) {
		return _AESPassword(password).then(function (pwd) {
			return 'sign=&pdftsrc=&pdft=&__plat=ios&__guid=CEF91AE5-76EA-43B2-B6C7-B11E8B0B3D4D&psrc=appstore&__version=1.1.2.1218&refer=http%3A%2F%2Fm.panda.tv%2F&account=' + account + '&password=' + encodeURIComponent(pwd) + '&https=1&_=' + +new Date();
		}).then(function (query) {
			return _login(query);
		});
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("node-fetch");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("cookie");

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (identity, isSuper) {
		identity = parseInt(identity);
		if (isSuper === true) {
			switch (identity) {
				case 120:
					return "超管";
					break;
				default:
					return "";
			}
		} else {
			switch (identity) {
				case 60:
					return "房管";
					break;
				case 90:
					return "主播";
					break;
				default:
					return "";
			}
		}
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (type) {
		type = String(type);
		var obj = Types[type];
		if (!obj) {
			obj = {
				key: 'unknow',
				text: '未知'
			};
		}
		return {
			type: type,
			key: obj.key,
			desc: obj.text
		};
	};

	var Types = {
		'1': {
			key: 'danmu',
			text: '普通弹幕'
		},
		'206': {
			key: 'zhuzi',
			text: '收到竹子'
		},
		'306': {
			key: 'maobi',
			text: '收到猫币'
		},
		'207': {
			key: 'renshu',
			text: '更新观众人数'
		},
		'208': {
			key: 'likai',
			text: '有观众离开了'
		},
		'209': {
			key: 'shangfangguan',
			text: '上房管'
		},
		'311': {
			key: 'fotiaoqiang',
			text: '其他房间收到了佛跳墙'
		},
		'666': {
			key: 'xiangyun',
			text: '脚踏祥云'
		},
		'640': {
			key: 'adv',
			text: '收到邀请'
		},
		'1010': {
			key: 'qiangzhuzi',
			text: '抢到了竹子'
		},
		'22': {
			key: 'chaoguantixing',
			text: '超管提醒'
		}
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	var CryptoJS = function (e, t) {
	  var n = {},
	      r = n.lib = {},
	      i = function i() {},
	      s = r.Base = { extend: function extend(e) {
	      i.prototype = this;var t = new i();return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function () {
	        t.$super.init.apply(this, arguments);
	      }), t.init.prototype = t, t.$super = this, t;
	    }, create: function create() {
	      var e = this.extend();return e.init.apply(e, arguments), e;
	    }, init: function init() {}, mixIn: function mixIn(e) {
	      for (var t in e) {
	        e.hasOwnProperty(t) && (this[t] = e[t]);
	      }e.hasOwnProperty("toString") && (this.toString = e.toString);
	    }, clone: function clone() {
	      return this.init.prototype.extend(this);
	    } },
	      o = r.WordArray = s.extend({ init: function init(e, n) {
	      e = this.words = e || [], this.sigBytes = n != t ? n : 4 * e.length;
	    }, toString: function toString(e) {
	      return (e || a).stringify(this);
	    }, concat: function concat(e) {
	      var t = this.words,
	          n = e.words,
	          r = this.sigBytes;e = e.sigBytes, this.clamp();if (r % 4) for (var i = 0; i < e; i++) {
	        t[r + i >>> 2] |= (n[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 24 - 8 * ((r + i) % 4);
	      } else if (65535 < n.length) for (i = 0; i < e; i += 4) {
	        t[r + i >>> 2] = n[i >>> 2];
	      } else t.push.apply(t, n);return this.sigBytes += e, this;
	    }, clamp: function clamp() {
	      var t = this.words,
	          n = this.sigBytes;t[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4), t.length = e.ceil(n / 4);
	    }, clone: function clone() {
	      var e = s.clone.call(this);return e.words = this.words.slice(0), e;
	    }, random: function random(t) {
	      for (var n = [], r = 0; r < t; r += 4) {
	        n.push(4294967296 * e.random() | 0);
	      }return new o.init(n, t);
	    } }),
	      u = n.enc = {},
	      a = u.Hex = { stringify: function stringify(e) {
	      var t = e.words;e = e.sigBytes;for (var n = [], r = 0; r < e; r++) {
	        var i = t[r >>> 2] >>> 24 - 8 * (r % 4) & 255;n.push((i >>> 4).toString(16)), n.push((i & 15).toString(16));
	      }return n.join("");
	    }, parse: function parse(e) {
	      for (var t = e.length, n = [], r = 0; r < t; r += 2) {
	        n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - 4 * (r % 8);
	      }return new o.init(n, t / 2);
	    } },
	      f = u.Latin1 = { stringify: function stringify(e) {
	      var t = e.words;e = e.sigBytes;for (var n = [], r = 0; r < e; r++) {
	        n.push(String.fromCharCode(t[r >>> 2] >>> 24 - 8 * (r % 4) & 255));
	      }return n.join("");
	    }, parse: function parse(e) {
	      for (var t = e.length, n = [], r = 0; r < t; r++) {
	        n[r >>> 2] |= (e.charCodeAt(r) & 255) << 24 - 8 * (r % 4);
	      }return new o.init(n, t);
	    } },
	      l = u.Utf8 = { stringify: function stringify(e) {
	      try {
	        return decodeURIComponent(escape(f.stringify(e)));
	      } catch (t) {
	        throw Error("Malformed UTF-8 data");
	      }
	    }, parse: function parse(e) {
	      return f.parse(unescape(encodeURIComponent(e)));
	    } },
	      c = r.BufferedBlockAlgorithm = s.extend({ reset: function reset() {
	      this._data = new o.init(), this._nDataBytes = 0;
	    }, _append: function _append(e) {
	      "string" == typeof e && (e = l.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
	    }, _process: function _process(t) {
	      var n = this._data,
	          r = n.words,
	          i = n.sigBytes,
	          s = this.blockSize,
	          u = i / (4 * s),
	          u = t ? e.ceil(u) : e.max((u | 0) - this._minBufferSize, 0);t = u * s, i = e.min(4 * t, i);if (t) {
	        for (var a = 0; a < t; a += s) {
	          this._doProcessBlock(r, a);
	        }a = r.splice(0, t), n.sigBytes -= i;
	      }return new o.init(a, i);
	    }, clone: function clone() {
	      var e = s.clone.call(this);return e._data = this._data.clone(), e;
	    }, _minBufferSize: 0 });r.Hasher = c.extend({ cfg: s.extend(), init: function init(e) {
	      this.cfg = this.cfg.extend(e), this.reset();
	    }, reset: function reset() {
	      c.reset.call(this), this._doReset();
	    }, update: function update(e) {
	      return this._append(e), this._process(), this;
	    }, finalize: function finalize(e) {
	      return e && this._append(e), this._doFinalize();
	    }, blockSize: 16, _createHelper: function _createHelper(e) {
	      return function (t, n) {
	        return new e.init(n).finalize(t);
	      };
	    }, _createHmacHelper: function _createHmacHelper(e) {
	      return function (t, n) {
	        return new h.HMAC.init(e, n).finalize(t);
	      };
	    } });var h = n.algo = {};return n;
	}(Math);(function () {
	  var e = CryptoJS,
	      t = e.lib.WordArray;e.enc.Base64 = { stringify: function stringify(e) {
	      var t = e.words,
	          n = e.sigBytes,
	          r = this._map;e.clamp(), e = [];for (var i = 0; i < n; i += 3) {
	        for (var s = (t[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 16 | (t[i + 1 >>> 2] >>> 24 - 8 * ((i + 1) % 4) & 255) << 8 | t[i + 2 >>> 2] >>> 24 - 8 * ((i + 2) % 4) & 255, o = 0; 4 > o && i + .75 * o < n; o++) {
	          e.push(r.charAt(s >>> 6 * (3 - o) & 63));
	        }
	      }if (t = r.charAt(64)) for (; e.length % 4;) {
	        e.push(t);
	      }return e.join("");
	    }, parse: function parse(e) {
	      var n = e.length,
	          r = this._map,
	          i = r.charAt(64);i && (i = e.indexOf(i), -1 != i && (n = i));for (var i = [], s = 0, o = 0; o < n; o++) {
	        if (o % 4) {
	          var u = r.indexOf(e.charAt(o - 1)) << 2 * (o % 4),
	              a = r.indexOf(e.charAt(o)) >>> 6 - 2 * (o % 4);i[s >>> 2] |= (u | a) << 24 - 8 * (s % 4), s++;
	        }
	      }return t.create(i, s);
	    }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
	})(), function (e) {
	  function t(e, t, n, r, i, s, o) {
	    return e = e + (t & n | ~t & r) + i + o, (e << s | e >>> 32 - s) + t;
	  }function n(e, t, n, r, i, s, o) {
	    return e = e + (t & r | n & ~r) + i + o, (e << s | e >>> 32 - s) + t;
	  }function r(e, t, n, r, i, s, o) {
	    return e = e + (t ^ n ^ r) + i + o, (e << s | e >>> 32 - s) + t;
	  }function i(e, t, n, r, i, s, o) {
	    return e = e + (n ^ (t | ~r)) + i + o, (e << s | e >>> 32 - s) + t;
	  }for (var s = CryptoJS, o = s.lib, u = o.WordArray, a = o.Hasher, o = s.algo, f = [], l = 0; 64 > l; l++) {
	    f[l] = 4294967296 * e.abs(e.sin(l + 1)) | 0;
	  }o = o.MD5 = a.extend({ _doReset: function _doReset() {
	      this._hash = new u.init([1732584193, 4023233417, 2562383102, 271733878]);
	    }, _doProcessBlock: function _doProcessBlock(e, s) {
	      for (var o = 0; 16 > o; o++) {
	        var u = s + o,
	            a = e[u];e[u] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
	      }var o = this._hash.words,
	          u = e[s + 0],
	          a = e[s + 1],
	          l = e[s + 2],
	          c = e[s + 3],
	          h = e[s + 4],
	          v = e[s + 5],
	          m = e[s + 6],
	          g = e[s + 7],
	          y = e[s + 8],
	          w = e[s + 9],
	          E = e[s + 10],
	          S = e[s + 11],
	          x = e[s + 12],
	          T = e[s + 13],
	          N = e[s + 14],
	          C = e[s + 15],
	          k = o[0],
	          L = o[1],
	          A = o[2],
	          O = o[3],
	          k = t(k, L, A, O, u, 7, f[0]),
	          O = t(O, k, L, A, a, 12, f[1]),
	          A = t(A, O, k, L, l, 17, f[2]),
	          L = t(L, A, O, k, c, 22, f[3]),
	          k = t(k, L, A, O, h, 7, f[4]),
	          O = t(O, k, L, A, v, 12, f[5]),
	          A = t(A, O, k, L, m, 17, f[6]),
	          L = t(L, A, O, k, g, 22, f[7]),
	          k = t(k, L, A, O, y, 7, f[8]),
	          O = t(O, k, L, A, w, 12, f[9]),
	          A = t(A, O, k, L, E, 17, f[10]),
	          L = t(L, A, O, k, S, 22, f[11]),
	          k = t(k, L, A, O, x, 7, f[12]),
	          O = t(O, k, L, A, T, 12, f[13]),
	          A = t(A, O, k, L, N, 17, f[14]),
	          L = t(L, A, O, k, C, 22, f[15]),
	          k = n(k, L, A, O, a, 5, f[16]),
	          O = n(O, k, L, A, m, 9, f[17]),
	          A = n(A, O, k, L, S, 14, f[18]),
	          L = n(L, A, O, k, u, 20, f[19]),
	          k = n(k, L, A, O, v, 5, f[20]),
	          O = n(O, k, L, A, E, 9, f[21]),
	          A = n(A, O, k, L, C, 14, f[22]),
	          L = n(L, A, O, k, h, 20, f[23]),
	          k = n(k, L, A, O, w, 5, f[24]),
	          O = n(O, k, L, A, N, 9, f[25]),
	          A = n(A, O, k, L, c, 14, f[26]),
	          L = n(L, A, O, k, y, 20, f[27]),
	          k = n(k, L, A, O, T, 5, f[28]),
	          O = n(O, k, L, A, l, 9, f[29]),
	          A = n(A, O, k, L, g, 14, f[30]),
	          L = n(L, A, O, k, x, 20, f[31]),
	          k = r(k, L, A, O, v, 4, f[32]),
	          O = r(O, k, L, A, y, 11, f[33]),
	          A = r(A, O, k, L, S, 16, f[34]),
	          L = r(L, A, O, k, N, 23, f[35]),
	          k = r(k, L, A, O, a, 4, f[36]),
	          O = r(O, k, L, A, h, 11, f[37]),
	          A = r(A, O, k, L, g, 16, f[38]),
	          L = r(L, A, O, k, E, 23, f[39]),
	          k = r(k, L, A, O, T, 4, f[40]),
	          O = r(O, k, L, A, u, 11, f[41]),
	          A = r(A, O, k, L, c, 16, f[42]),
	          L = r(L, A, O, k, m, 23, f[43]),
	          k = r(k, L, A, O, w, 4, f[44]),
	          O = r(O, k, L, A, x, 11, f[45]),
	          A = r(A, O, k, L, C, 16, f[46]),
	          L = r(L, A, O, k, l, 23, f[47]),
	          k = i(k, L, A, O, u, 6, f[48]),
	          O = i(O, k, L, A, g, 10, f[49]),
	          A = i(A, O, k, L, N, 15, f[50]),
	          L = i(L, A, O, k, v, 21, f[51]),
	          k = i(k, L, A, O, x, 6, f[52]),
	          O = i(O, k, L, A, c, 10, f[53]),
	          A = i(A, O, k, L, E, 15, f[54]),
	          L = i(L, A, O, k, a, 21, f[55]),
	          k = i(k, L, A, O, y, 6, f[56]),
	          O = i(O, k, L, A, C, 10, f[57]),
	          A = i(A, O, k, L, m, 15, f[58]),
	          L = i(L, A, O, k, T, 21, f[59]),
	          k = i(k, L, A, O, h, 6, f[60]),
	          O = i(O, k, L, A, S, 10, f[61]),
	          A = i(A, O, k, L, l, 15, f[62]),
	          L = i(L, A, O, k, w, 21, f[63]);o[0] = o[0] + k | 0, o[1] = o[1] + L | 0, o[2] = o[2] + A | 0, o[3] = o[3] + O | 0;
	    }, _doFinalize: function _doFinalize() {
	      var t = this._data,
	          n = t.words,
	          r = 8 * this._nDataBytes,
	          i = 8 * t.sigBytes;n[i >>> 5] |= 128 << 24 - i % 32;var s = e.floor(r / 4294967296);n[(i + 64 >>> 9 << 4) + 15] = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360, n[(i + 64 >>> 9 << 4) + 14] = (r << 8 | r >>> 24) & 16711935 | (r << 24 | r >>> 8) & 4278255360, t.sigBytes = 4 * (n.length + 1), this._process(), t = this._hash, n = t.words;for (r = 0; 4 > r; r++) {
	        i = n[r], n[r] = (i << 8 | i >>> 24) & 16711935 | (i << 24 | i >>> 8) & 4278255360;
	      }return t;
	    }, clone: function clone() {
	      var e = a.clone.call(this);return e._hash = this._hash.clone(), e;
	    } }), s.MD5 = a._createHelper(o), s.HmacMD5 = a._createHmacHelper(o);
	}(Math), function () {
	  var e = CryptoJS,
	      t = e.lib,
	      n = t.Base,
	      r = t.WordArray,
	      t = e.algo,
	      i = t.EvpKDF = n.extend({ cfg: n.extend({ keySize: 4, hasher: t.MD5, iterations: 1 }), init: function init(e) {
	      this.cfg = this.cfg.extend(e);
	    }, compute: function compute(e, t) {
	      for (var n = this.cfg, i = n.hasher.create(), s = r.create(), o = s.words, u = n.keySize, n = n.iterations; o.length < u;) {
	        a && i.update(a);var a = i.update(e).finalize(t);i.reset();for (var f = 1; f < n; f++) {
	          a = i.finalize(a), i.reset();
	        }s.concat(a);
	      }return s.sigBytes = 4 * u, s;
	    } });e.EvpKDF = function (e, t, n) {
	    return i.create(n).compute(e, t);
	  };
	}(), CryptoJS.lib.Cipher || function (e) {
	  var t = CryptoJS,
	      n = t.lib,
	      r = n.Base,
	      i = n.WordArray,
	      s = n.BufferedBlockAlgorithm,
	      o = t.enc.Base64,
	      u = t.algo.EvpKDF,
	      a = n.Cipher = s.extend({ cfg: r.extend(), createEncryptor: function createEncryptor(e, t) {
	      return this.create(this._ENC_XFORM_MODE, e, t);
	    }, createDecryptor: function createDecryptor(e, t) {
	      return this.create(this._DEC_XFORM_MODE, e, t);
	    }, init: function init(e, t, n) {
	      this.cfg = this.cfg.extend(n), this._xformMode = e, this._key = t, this.reset();
	    }, reset: function reset() {
	      s.reset.call(this), this._doReset();
	    }, process: function process(e) {
	      return this._append(e), this._process();
	    }, finalize: function finalize(e) {
	      return e && this._append(e), this._doFinalize();
	    }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function _createHelper(e) {
	      return { encrypt: function encrypt(t, n, r) {
	          return ("string" == typeof n ? d : p).encrypt(e, t, n, r);
	        }, decrypt: function decrypt(t, n, r) {
	          return ("string" == typeof n ? d : p).decrypt(e, t, n, r);
	        } };
	    } });n.StreamCipher = a.extend({ _doFinalize: function _doFinalize() {
	      return this._process(!0);
	    }, blockSize: 1 });var f = t.mode = {},
	      l = function l(t, n, r) {
	    var i = this._iv;i ? this._iv = e : i = this._prevBlock;for (var s = 0; s < r; s++) {
	      t[n + s] ^= i[s];
	    }
	  },
	      c = (n.BlockCipherMode = r.extend({ createEncryptor: function createEncryptor(e, t) {
	      return this.Encryptor.create(e, t);
	    }, createDecryptor: function createDecryptor(e, t) {
	      return this.Decryptor.create(e, t);
	    }, init: function init(e, t) {
	      this._cipher = e, this._iv = t;
	    } })).extend();c.Encryptor = c.extend({ processBlock: function processBlock(e, t) {
	      var n = this._cipher,
	          r = n.blockSize;l.call(this, e, t, r), n.encryptBlock(e, t), this._prevBlock = e.slice(t, t + r);
	    } }), c.Decryptor = c.extend({ processBlock: function processBlock(e, t) {
	      var n = this._cipher,
	          r = n.blockSize,
	          i = e.slice(t, t + r);n.decryptBlock(e, t), l.call(this, e, t, r), this._prevBlock = i;
	    } }), f = f.CBC = c, c = (t.pad = {}).Pkcs7 = { pad: function pad(e, t) {
	      for (var n = 4 * t, n = n - e.sigBytes % n, r = n << 24 | n << 16 | n << 8 | n, s = [], o = 0; o < n; o += 4) {
	        s.push(r);
	      }n = i.create(s, n), e.concat(n);
	    }, unpad: function unpad(e) {
	      e.sigBytes -= e.words[e.sigBytes - 1 >>> 2] & 255;
	    } }, n.BlockCipher = a.extend({ cfg: a.cfg.extend({ mode: f, padding: c }), reset: function reset() {
	      a.reset.call(this);var e = this.cfg,
	          t = e.iv,
	          e = e.mode;if (this._xformMode == this._ENC_XFORM_MODE) var n = e.createEncryptor;else n = e.createDecryptor, this._minBufferSize = 1;this._mode = n.call(e, this, t && t.words);
	    }, _doProcessBlock: function _doProcessBlock(e, t) {
	      this._mode.processBlock(e, t);
	    }, _doFinalize: function _doFinalize() {
	      var e = this.cfg.padding;if (this._xformMode == this._ENC_XFORM_MODE) {
	        e.pad(this._data, this.blockSize);var t = this._process(!0);
	      } else t = this._process(!0), e.unpad(t);return t;
	    }, blockSize: 4 });var h = n.CipherParams = r.extend({ init: function init(e) {
	      this.mixIn(e);
	    }, toString: function toString(e) {
	      return (e || this.formatter).stringify(this);
	    } }),
	      f = (t.format = {}).OpenSSL = { stringify: function stringify(e) {
	      var t = e.ciphertext;return e = e.salt, (e ? i.create([1398893684, 1701076831]).concat(e).concat(t) : t).toString(o);
	    }, parse: function parse(e) {
	      e = o.parse(e);var t = e.words;if (1398893684 == t[0] && 1701076831 == t[1]) {
	        var n = i.create(t.slice(2, 4));t.splice(0, 4), e.sigBytes -= 16;
	      }return h.create({ ciphertext: e, salt: n });
	    } },
	      p = n.SerializableCipher = r.extend({ cfg: r.extend({ format: f }), encrypt: function encrypt(e, t, n, r) {
	      r = this.cfg.extend(r);var i = e.createEncryptor(n, r);return t = i.finalize(t), i = i.cfg, h.create({ ciphertext: t, key: n, iv: i.iv, algorithm: e, mode: i.mode, padding: i.padding, blockSize: e.blockSize, formatter: r.format });
	    }, decrypt: function decrypt(e, t, n, r) {
	      return r = this.cfg.extend(r), t = this._parse(t, r.format), e.createDecryptor(n, r).finalize(t.ciphertext);
	    }, _parse: function _parse(e, t) {
	      return "string" == typeof e ? t.parse(e, this) : e;
	    } }),
	      t = (t.kdf = {}).OpenSSL = { execute: function execute(e, t, n, r) {
	      return r || (r = i.random(8)), e = u.create({ keySize: t + n }).compute(e, r), n = i.create(e.words.slice(t), 4 * n), e.sigBytes = 4 * t, h.create({ key: e, iv: n, salt: r });
	    } },
	      d = n.PasswordBasedCipher = p.extend({ cfg: p.cfg.extend({ kdf: t }), encrypt: function encrypt(e, t, n, r) {
	      return r = this.cfg.extend(r), n = r.kdf.execute(n, e.keySize, e.ivSize), r.iv = n.iv, e = p.encrypt.call(this, e, t, n.key, r), e.mixIn(n), e;
	    }, decrypt: function decrypt(e, t, n, r) {
	      return r = this.cfg.extend(r), t = this._parse(t, r.format), n = r.kdf.execute(n, e.keySize, e.ivSize, t.salt), r.iv = n.iv, p.decrypt.call(this, e, t, n.key, r);
	    } });
	}(), function () {
	  for (var e = CryptoJS, t = e.lib.BlockCipher, n = e.algo, r = [], i = [], s = [], o = [], u = [], a = [], f = [], l = [], c = [], h = [], p = [], d = 0; 256 > d; d++) {
	    p[d] = 128 > d ? d << 1 : d << 1 ^ 283;
	  }for (var v = 0, m = 0, d = 0; 256 > d; d++) {
	    var g = m ^ m << 1 ^ m << 2 ^ m << 3 ^ m << 4,
	        g = g >>> 8 ^ g & 255 ^ 99;r[v] = g, i[g] = v;var y = p[v],
	        b = p[y],
	        w = p[b],
	        E = 257 * p[g] ^ 16843008 * g;s[v] = E << 24 | E >>> 8, o[v] = E << 16 | E >>> 16, u[v] = E << 8 | E >>> 24, a[v] = E, E = 16843009 * w ^ 65537 * b ^ 257 * y ^ 16843008 * v, f[g] = E << 24 | E >>> 8, l[g] = E << 16 | E >>> 16, c[g] = E << 8 | E >>> 24, h[g] = E, v ? (v = y ^ p[p[p[w ^ y]]], m ^= p[p[m]]) : v = m = 1;
	  }var S = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
	      n = n.AES = t.extend({ _doReset: function _doReset() {
	      for (var e = this._key, t = e.words, n = e.sigBytes / 4, e = 4 * ((this._nRounds = n + 6) + 1), i = this._keySchedule = [], s = 0; s < e; s++) {
	        if (s < n) i[s] = t[s];else {
	          var o = i[s - 1];s % n ? 6 < n && 4 == s % n && (o = r[o >>> 24] << 24 | r[o >>> 16 & 255] << 16 | r[o >>> 8 & 255] << 8 | r[o & 255]) : (o = o << 8 | o >>> 24, o = r[o >>> 24] << 24 | r[o >>> 16 & 255] << 16 | r[o >>> 8 & 255] << 8 | r[o & 255], o ^= S[s / n | 0] << 24), i[s] = i[s - n] ^ o;
	        }
	      }t = this._invKeySchedule = [];for (n = 0; n < e; n++) {
	        s = e - n, o = n % 4 ? i[s] : i[s - 4], t[n] = 4 > n || 4 >= s ? o : f[r[o >>> 24]] ^ l[r[o >>> 16 & 255]] ^ c[r[o >>> 8 & 255]] ^ h[r[o & 255]];
	      }
	    }, encryptBlock: function encryptBlock(e, t) {
	      this._doCryptBlock(e, t, this._keySchedule, s, o, u, a, r);
	    }, decryptBlock: function decryptBlock(e, t) {
	      var n = e[t + 1];e[t + 1] = e[t + 3], e[t + 3] = n, this._doCryptBlock(e, t, this._invKeySchedule, f, l, c, h, i), n = e[t + 1], e[t + 1] = e[t + 3], e[t + 3] = n;
	    }, _doCryptBlock: function _doCryptBlock(e, t, n, r, i, s, o, u) {
	      for (var a = this._nRounds, f = e[t] ^ n[0], l = e[t + 1] ^ n[1], c = e[t + 2] ^ n[2], h = e[t + 3] ^ n[3], p = 4, d = 1; d < a; d++) {
	        var v = r[f >>> 24] ^ i[l >>> 16 & 255] ^ s[c >>> 8 & 255] ^ o[h & 255] ^ n[p++],
	            m = r[l >>> 24] ^ i[c >>> 16 & 255] ^ s[h >>> 8 & 255] ^ o[f & 255] ^ n[p++],
	            g = r[c >>> 24] ^ i[h >>> 16 & 255] ^ s[f >>> 8 & 255] ^ o[l & 255] ^ n[p++],
	            h = r[h >>> 24] ^ i[f >>> 16 & 255] ^ s[l >>> 8 & 255] ^ o[c & 255] ^ n[p++],
	            f = v,
	            l = m,
	            c = g;
	      }v = (u[f >>> 24] << 24 | u[l >>> 16 & 255] << 16 | u[c >>> 8 & 255] << 8 | u[h & 255]) ^ n[p++], m = (u[l >>> 24] << 24 | u[c >>> 16 & 255] << 16 | u[h >>> 8 & 255] << 8 | u[f & 255]) ^ n[p++], g = (u[c >>> 24] << 24 | u[h >>> 16 & 255] << 16 | u[f >>> 8 & 255] << 8 | u[l & 255]) ^ n[p++], h = (u[h >>> 24] << 24 | u[f >>> 16 & 255] << 16 | u[l >>> 8 & 255] << 8 | u[c & 255]) ^ n[p++], e[t] = v, e[t + 1] = m, e[t + 2] = g, e[t + 3] = h;
	    }, keySize: 8 });e.AES = t._createHelper(n);
	}(), CryptoJS.pad.ZeroPadding = { pad: function pad(e, t) {
	    var n = t * 4;e.clamp(), e.sigBytes += n - (e.sigBytes % n || n);
	  }, unpad: function unpad(e) {
	    var t = e.words,
	        n = e.sigBytes - 1;while (!(t[n >>> 2] >>> 24 - n % 4 * 8 & 255)) {
	      n--;
	    }e.sigBytes = n + 1;
	  } };
	module.exports = CryptoJS;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		account: '15677997914',
		password: 'zxcasdqwe123'
	};

/***/ }
/******/ ]);
