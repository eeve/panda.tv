 const msgList = [
	'有免费竹子的走一波',
	'没订阅的订阅一波，感谢！',
	'主播就是这么6，大家订阅一波，不迷路。',
	'哇塞，66666'
];

export default function(){
	const index = parseInt(Math.random() * msgList.length);
	return msgList[index];
}
