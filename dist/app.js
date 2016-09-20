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

	var _chat = __webpack_require__(5);

	var Chat = _interopRequireWildcard(_chat);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 卡哥 392616
	// 楚楚可云 314497
	// Xuebaby 377420
	var roomId = 377420;

	Chat.getChatServerInfo(roomId).then(Chat.connect).then(Chat.listenEvent).then(Chat.heartBeat).then(function () {
		// 开启感谢模式
		setInterval(function () {
			// 获取感谢语句
			var msg = thankUtils.buildAllThankMsg();
			if (msg) {
				Chat.sendMsg(msg, roomId, 'd0c60d6da58bec8106b0918e0c9e2878');
				console.log('待播报礼物人数：' + Object.keys(_thankQueue2.default.all()).length);
			}
		}, 3000);
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
		var msg = '感谢［' + item.nickName + '］送的';
		if (item[_giftType2.default.ZHUZI]) {
			msg += item[_giftType2.default.ZHUZI] + '个竹子。';
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
		for (var i = items.length - 1; i >= 0; i--) {
			var item = items[i];
			msg += buildThankMsg(item);
		}
		return msg ? msg : null;
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

	var _nodeFetch = __webpack_require__(6);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	var _net = __webpack_require__(7);

	var _net2 = _interopRequireDefault(_net);

	var _userType = __webpack_require__(8);

	var _userType2 = _interopRequireDefault(_userType);

	var _messageType = __webpack_require__(9);

	var _messageType2 = _interopRequireDefault(_messageType);

	var _giftType = __webpack_require__(4);

	var _giftType2 = _interopRequireDefault(_giftType);

	var _thankUtils = __webpack_require__(3);

	var thankUtils = _interopRequireWildcard(_thankUtils);

	var _bluebird = __webpack_require__(10);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

		var msg = 'u:' + serverInfo['rid'] + '@' + serverInfo['appid'] + '\nk:1\nt:300\nts:' + serverInfo['ts'] + '\nsign:' + serverInfo['sign'] + '\nauthtype:' + serverInfo['authtype'];

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
					nickName = ('#[' + (0, _userType2.default)(sp_identity) + ']# ' + nickName).red;
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
					var _toRoomId = model.to.toroom;
					console.log('有人离开了，去了房间: ' + _toRoomId);
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
					var _toUserName = _to.nickName;
					var _toRoomId2 = _to.roomid;
					console.log(nickName + '给' + _toUserName + '送了1个佛跳墙，房间号为：' + _toRoomId2);
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
					console.log(nickName + '给' + toUserName + '送了1个祥云，房间号为：' + toRoomId, content);
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

	function sendMsg(msg, roomId, sign) {
		(0, _nodeFetch2.default)('http://api.m.panda.tv/ajax_send_group_msg', {
			method: 'POST',
			headers: {
				'Host': 'api.m.panda.tv',
				'Accept': '*/*',
				'User-Agent': 'PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)',
				'xiaozhangdepandatv': '1',
				'Cookie': 'M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D'
			},
			body: '__channel=appstore&__plat=ios&__version=1.1.2.1218&content=' + msg + '&pt_sign=' + sign + '&pt_time=1474343949&roomid=' + roomId + '&type=1'
		}).then(function (resp) {
			return resp.json();
		}).then(function (res) {
			if (res.errno !== 0) {
				console.log('消息发送失败!'.red);
			}
		}).catch(function (err) {
			console.log('发送消息失败...', err);
		});
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("node-fetch");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 8 */
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
/* 9 */
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
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ }
/******/ ]);