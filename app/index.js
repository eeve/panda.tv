import colors from 'colors';

import thankQueue from './thankQueue';
import * as thankUtils from './thankUtils';
import * as Chat from './chat';

// 卡哥 392616
// 楚楚可云 314497
// Xuebaby 377420
const roomId = 377420;

Chat.getChatServerInfo(roomId)
		.then(Chat.connect)
		.then(Chat.listenEvent)
		.then(Chat.heartBeat)
		.then(() => {
			// 开启感谢模式
			setInterval(() => {
				// 获取感谢语句
				const msg = thankUtils.buildAllThankMsg();
				if(msg) {
					Chat.sendMsg(msg, roomId, 'd0c60d6da58bec8106b0918e0c9e2878');
					console.log(`待播报礼物人数：${Object.keys(thankQueue.all()).length}`);
				}
			}, 3000);
		})
		.catch(e => {
			console.log('error', e);
		});
