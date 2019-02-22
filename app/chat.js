import fetch from 'node-fetch';
import net from 'net';
import cookie from 'cookie';

import userType from './constant/userType';
import messageType from './constant/messageType';
import GiftType from './constant/giftType';

import * as thankUtils from './thankUtils';

import CryptoJS from './CryptoJS';

import Promise from 'bluebird';

let PD_COOKIES = [];

const headers = {
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

 	const msg = [
 		`u:${serverInfo.rid}@${serverInfo.appid}`,
 		`k:1`,
 		`t:300`,
 		`ts:${serverInfo.ts}`,
 		`sign:${serverInfo.sign}`,
 		`authtype:${serverInfo.authtype}`].join('\n');
	console.log(msg);
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
				nickName = `#[${userType(sp_identity, true)}]# ${nickName}`.red;
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
				console.log(msg);
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
			const to = model.to;
			const toUserName = to.nickName;
			const toRoomId = to.roomid;
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
		case 'chaoguantixing':{
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
			console.log(`超管提醒：${content}`.red);
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

export function sendMsg(msg, roomId, sign, time) {
	fetch('http://api.m.panda.tv/ajax_send_group_msg',{
		method: 'POST',
		headers: Object.assign(headers, {
			'Host': 'api.m.panda.tv',
			Cookie: PD_COOKIES.join('; '),
			'xiaozhangdepandatv': 1
		}),
		body: `__channel=appstore&__plat=ios&__version=1.1.2.1218&content=${msg}&pt_sign=${sign}&pt_time=${time}&roomid=${roomId}&type=1`
	})
	.then(resp => {
		return resp.json();
	})
	.then(res => {
		if(res.errno !== 0){
			console.log('消息发送失败!'.red, res);
		}
	}).catch(err => {
		console.log('发送消息失败...', err);
	});
}

/**
 * 登录并获取发送弹幕的token
 * @return {[type]} [description]
 */
export function getTokenAndLogin(){
	return fetch(`http://api.m.panda.tv/ajax_get_token?__version=1.1.2.1218&__plat=ios&__channel=appstore`, {
		headers: Object.assign(headers, {
			Cookie: PD_COOKIES.join('; '),
			xiaozhangdepandatv: 1
		})
	})
	.then(resp => resp.json())
	.then(res => res.data);
}

/**
 * 获取加密密码
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */

function _AESPassword(password){
	return new Promise((resolve, reject) => {
		fetch('https://u.panda.tv/ajax_aeskey')
		.then(resp => {
			// 收集Cookie
			// SESSCYPHP
			const cs = resp.headers.get('Set-Cookie');
			PD_COOKIES.push(cs.split(';')[0]);
			return resp.json();
		})
		.then(res => {
			if(res && res.errno == 0 && res.data) {
				const key = CryptoJS.enc.Utf8.parse(res.data);
				const iv = CryptoJS.enc.Utf8.parse("995d1b5ebbac3761");
				const pwd = CryptoJS.AES.encrypt(password, key, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.ZeroPadding
				}).toString();
				resolve(pwd);
			} else {
				reject('获取AES KEY失败');
			}
		})
		.catch(err => reject(err));
	});
}

function _login(query){
	return new Promise((resolve, reject) => {
		const url = `https://u.panda.tv/ajax_login?${query}`;
		fetch(url,{
			headers: {
				'Host': 'api.m.panda.tv',
				'Origin': 'https://m.panda.tv',
				'Referer': 'https://m.panda.tv/login.html?__plat=ios&__version=1.1.2.1218&__channel=appstore&__guid=CEF91AE5-76EA-43B2-B6C7-B11E8B0B3D4D',
				'Cookie': PD_COOKIES.join('; ')
			}
		})
			.then(resp => {
				// 收集Cookie
				// R
				// M
				const cs = resp.headers._headers['set-cookie'];
				const cR = cs[0].split(';')[0];
				const cM = cs[1].split(';')[0];
				PD_COOKIES.push(cR);
				PD_COOKIES.push(cM);
				return resp.json();
			})
			.then(res => {
				if(res){
					if(res.errno == 0){
						resolve(res.data);
					}else if(res.errno == 1802){
	          reject('错误过多，稍后再试');
	        }else if(res.errno == 1801){
	          reject('错误过多被锁定，请明天再试');
	        }else if(res.errno == 1901){
	        	reject('reset 异地登录逻辑');
	        }else if(res.errno == 1016){
	          reject('用户名或密码错误');
	        }else{
	          reject(res.errmsg);
	        }
				} else {
					reject('登录失败');
				}
			})
			.catch(err => reject(err));
	});
}

export function login(account, password) {
	return _AESPassword(password)
	.then(pwd => `sign=&pdftsrc=&pdft=&__plat=ios&__guid=CEF91AE5-76EA-43B2-B6C7-B11E8B0B3D4D&psrc=appstore&__version=1.1.2.1218&refer=http%3A%2F%2Fm.panda.tv%2F&account=${account}&password=${encodeURIComponent(pwd)}&https=1&_=${+new Date()}`)
	.then(query => _login(query));
}
