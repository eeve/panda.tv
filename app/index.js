import colors from 'colors';

import thankQueue from './thankQueue';
import * as thankUtils from './thankUtils';
import * as Chat from './chat';
import config from './config';

import fetch from 'node-fetch';

// 卡哥 392616
// 楚楚可云 314497
// Xuebaby 377420
// 主播福成	440526
// 一万八 403249
// 刘从心 392132
// 洪湖小肖 337852
const roomId = 337852;

Chat.login(config.account, config.password)
	.then(userInfo => {
		console.log('登录用户信息', userInfo);
		return Chat.getChatServerInfo(roomId)
			.then(Chat.connect)
			.then(Chat.listenEvent)
			.then(Chat.heartBeat)
			.then(Chat.getTokenAndLogin)
			.then((data) => {
				console.log('发送弹幕的token: ', data.token);
				data.token = 'd02927c0bd83bfac5c2a00e6414f1796';
				// 开启感谢模式
				let second = 0;
				setInterval(() => {
					// 获取感谢语句
					const msg = thankUtils.buildAllThankMsg();
					if(msg) {
						Chat.sendMsg(msg, roomId, data.token);
						console.log(`待播报礼物人数：${Object.keys(thankQueue.all()).length}`);
					} else {
						second++;
						if(second > 3){
							Chat.sendMsg('6666666', roomId, data.token);
							second = 0;
						}
					}
				}, 3000);
			});
	})
	.catch(e => {
		console.log('error', e);
	});
