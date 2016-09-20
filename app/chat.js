import fetch from 'node-fetch';
import net from 'net';

import userType from './constant/userType';
import messageType from './constant/messageType';
import GiftType from './constant/giftType';

import * as thankUtils from './thankUtils';

import Promise from 'bluebird';

/**
 * 获取聊天服务器信息
 * @param  {[type]} roomId [description]
 * @return {[type]}        [description]
 */
export function getChatServerInfo(roomId) {
	return fetch(`http://api.homer.panda.tv/chatroom/getinfo?roomid=${roomId}`)
		.then(resp => {
			return resp.json();
		})
		.then(json => {
			const data = json.data;
			const chatAddr = data.chat_addr_list[0];
			const server_ip = chatAddr.split(':')[0];
			const server_port = chatAddr.split(':')[1];
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
export function connect(serverInfo) {
	const socket = net.connect({
		host: serverInfo.ip,
		port: serverInfo.port
	}, () => {
		console.log('connect success');
	});

	var msg = 'u:' + serverInfo['rid']
		             + '@' + serverInfo['appid']
		             + '\nk:1\nt:300\nts:' + serverInfo['ts']
		             + '\nsign:' + serverInfo['sign']
		             + '\nauthtype:' + serverInfo['authtype'];

  _sendData(socket, msg);

	return Promise.resolve({
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
	const model = msg.data;
	const content = model.content;
	const from = model.from;
	const msgType = messageType(msg.type);
	let nickName = from.nickName;
	switch(msgType.key) {
		case 'danmu':
			var identity = from.identity;
			var sp_identity = from.sp_identity;
			if(sp_identity != 0){
				nickName = `#[${userType(sp_identity)}]# ${nickName}`.red;
			}
			if(identity != 30) {
				nickName = `[${userType(identity)}] ${nickName}`.yellow;
			}
			console.log(`${nickName} : ${content}`);
			break;
		case 'zhuzi':
			// { from:
		 //   { identity: '30',
		 //     nickName: '一眼看透你',
		 //     rid: '30259118',
		 //     sp_identity: '0' },
		 //  to: { toroom: '392616' },
		 //  content: '100' }
			thankUtils.addThankItem(model, GiftType.ZHUZI, content);
			console.log(`${nickName}`.green,`送给主播`,`${content}`.green,`个竹子`);
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
			const price = content.price;
			if(price / 2 === 1){
				thankUtils.addThankItem(model, GiftType.FANTUAN, 1);
				console.log(`*******\t${nickName}送给主播[1]个饭团\t*******`.cyan);
			}else if(price / 50 === 1){
				thankUtils.addThankItem(model, GiftType.KAOYU, 1);
				console.log(`*******\t${nickName}送给主播[1]个烤鱼\t*******`.cyan);
			}else if(price / 1000 === 1){
				thankUtils.addThankItem(model, GiftType.LONGXIA, 1);
				console.log(`*******\t${nickName}送给主播[1]个龙虾\t*******`.cyan);
			}else if(price / 10000 === 1){
				thankUtils.addThankItem(model, GiftType.FOTIAOQIANG, 1);
				console.log(`*******\t${nickName}送给主播[1]个佛跳墙\t*******`.cyan);
			}
			// thank(roomId, nickName, 0, '饭团' );
			break;
		case 'shangfangguan':{
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
			 const to = model.to;
			 console.log(`${nickName}将${to.nickName}设为了${userType(to.identity)}`);
			break;
		}
		case 'renshu':
			console.log(`观众人数更新:${content}`);
			break;
		case 'likai':{
			// { type: '208',
			//   time: 1474277422,
			//   data:
			//    { from: { rid: '-1' },
			//      to: { toroom: '337852' },
			//      content: '122156459' } }
			const toRoomId = model.to.toroom;
			console.log(`有人离开了，去了房间: ${toRoomId}`);
			break;
		}
		case 'fotiaoqiang':{
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
			const to = model.to;
			const toUserName = to.nickName;
			const toRoomId = to.roomid;
			console.log(`${nickName}给${toUserName}送了1个佛跳墙，房间号为：${toRoomId}`);
			break;
		}
		case 'xiangyun':{
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
			console.log(`${nickName}给${toUserName}送了1个祥云，房间号为：${toRoomId}`, content);
			break;
		}
		case 'adv':{
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
			console.log(`[系统广告]：${content.custommsg}`);
			break;
		}
		case 'qiangzhuzi':{
			// { type: '1010',
			//   time: 1474356465,
			//   data:
			//    { from: { __plat: 'pc_web', nickName: '可惜多路棒棒哒', rid: '5179352' },
			//      to: { toroom: '314497' },
			//      content: { bamboos: '266', content: '个竹子', newBamboos: '0' } } }
			console.log(`[${nickName}在${from.__plat}]：抢到了${content.bamboos}${content.content}`);
			break;
		}
		default:
			console.log(`>>>> 收到未知消息！`.red, msg);
	}
}

/**
 * 监听事件
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function listenEvent(params) {
	const socket = params.socket;
	const info = params.info;
	let completeMsg = [];
	// 接收数据
	socket.on('data', (chunk) => {
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
	socket.on('error', function(err) {
		console.log('出现错误，准备销毁socket...', String(err, 'utf8'));
		socket.destroy();
	});

	return Promise.resolve(params);
}

function _sendKeepalive(socket) {
	var data = new Buffer(4);
	data.writeInt16BE(6, 0);
	data.writeInt16BE(0, 2);
	socket.write(data);
}

export function heartBeat(params, second) {
	if(!second) {
		second = 150;
	}
	const socket = params.socket;
	setInterval(() => {
		_sendKeepalive(socket);
	}, parseInt(second) * 1000);
	return Promise.resolve(params);
}

export function sendMsg(msg, roomId, sign) {
	fetch('http://api.m.panda.tv/ajax_send_group_msg',{
		method: 'POST',
		headers: {
			'Host': 'api.m.panda.tv',
			'Accept': '*/*',
			'User-Agent': 'PandaTV-ios/1.1.2 (iPhone; iOS 9.3.5; Scale/3.00)',
			'xiaozhangdepandatv': '1',
			'Cookie': 'M=t%3D1473337056%26v%3D1.0%26mt%3D1473337056%26s%3Dafad0b743d36b4b20e87cf6e8f65ad72; R=r%3D32710864%26u%3DCnaqnGi32710864%26n%3D%25R4%25O8%25N4%25R4%25O8%25NN%25R4%25O8%25NQ%25R6%2596%2587%26le%3DMJI2MJ1yWGDjZGV2YzAioD%3D%3D%26m%3DZGH2Amp5BGp5ZGD%3D%26im%3DnUE0pPHmDFHlEvHlEzx3YaOxnJ0hM3ZyZxLmAwD0BJD2AQAuZJL5MGR2ZmDkZwOwBGAyAJZ4MJSyZv5jozp%3D'
		},
		body: `__channel=appstore&__plat=ios&__version=1.1.2.1218&content=${msg}&pt_sign=${sign}&pt_time=1474343949&roomid=${roomId}&type=1`
	})
	.then(resp => {
		return resp.json();
	})
	.then(res => {
		if(res.errno !== 0){
			console.log('消息发送失败!'.red);
		}
	}).catch(err => {
		console.log('发送消息失败...', err);
	});
}
