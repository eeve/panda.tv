const Types = {
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
	'209':{
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
}

export default function(type) {
	type = String(type);
	let obj = Types[type];
	if(!obj){
		obj = {
			key: 'unknow',
			text: '未知'
		};
	}
	return {
		type: type,
		key: obj.key,
		desc: obj.text
	}
}
