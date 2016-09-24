// 感谢队列
let Queue = {};

// let Queue = {
// 	'001': {
// 		nickName: '小白',
// 		zhuzi: 100,
// 		maobi: 500,
// 		foutiaoqiang: 1
// 	}
// }

export default {
	addItem: function(id, item){
		this._addItem(id, item);
	},
	setItem: function(id, item){
		this._addItem(id, item, true);
	},
	_addItem: function(id, item, reset) {
		let obj = Queue[id];
		if(!obj) {
			obj = {
				nickName: item.nickName
			};
			obj[item.giftType] = item.count;
			Queue[id] = obj;
		} else {
			let count = obj[item.giftType];
			if(!count) {
				obj[item.giftType] = parseInt(item.count);
			} else {
				obj[item.giftType] = reset === true? count : parseInt(count) + parseInt(item.count);
			}
			Queue[id] = obj;
		}
	},
	all: function(){
		return Queue;
	},
	next: function() {
		const keys = Object.keys(Queue);
		const key = keys.shift();
		const obj = Queue[key];
		delete Queue[key];
		return obj;
	},
	nextAll: function() {
		let arr = [];
		for(let key in Queue) {
			let obj = Queue[key];
			delete Queue[key];
			arr.push(obj);
		}
		return arr;
	}
}
