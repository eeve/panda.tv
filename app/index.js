import colors from 'colors';

import thankQueue from './thankQueue';
import * as thankUtils from './thankUtils';
import * as Chat from './chat';

// 卡哥 392616
// 楚楚可云 314497
// Xuebaby 377420
// 主播福成	440526
// 一万八 403249
const roomId = 403249;

Chat.login()
	.then(data => {
		return Chat.getChatServerInfo(roomId)
			.then(Chat.connect)
			.then(Chat.listenEvent)
			.then(Chat.heartBeat)
			.then(() => {
				// 开启感谢模式
				setInterval(() => {
					// 获取感谢语句
					const msg = thankUtils.buildAllThankMsg();
					if(msg) {
						Chat.sendMsg(msg, roomId, data.token);
						console.log(`待播报礼物人数：${Object.keys(thankQueue.all()).length}`);
					}
				}, 15000);
			});
	}).catch(e => {
		console.log('error', e);
	});


