import thankQueue from './thankQueue';
import GiftType from './constant/giftType';

/**
 * 收到礼物时，添加到感谢队列
 * @param  {[type]} addThankItem [description]
 * @return {[type]}              [description]
 */
export function addThankItem(messageModel, giftType, count) {
	const from = messageModel.from;
	thankQueue.addItem(from.rid,{
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
export function buildThankMsg(item) {
	if(!item){
		console.log('队列无礼物。。。');
		return;
	}
	let msg = `感谢${item.nickName}送的`;
	if(item[GiftType.ZHUZI]){
		msg += `${item[GiftType.ZHUZI]}个竹子。`;
	}
	if(item[GiftType.FANTUAN]){
		msg += `${item[GiftType.FANTUAN]}个饭团。`;
	}
	if(item[GiftType.KAOYU]){
		msg += `${item[GiftType.KAOYU]}个烤鱼。`;
	}
	if(item[GiftType.LONGXIA]){
		msg += `${item[GiftType.LONGXIA]}个龙虾。`;
	}
	if(item[GiftType.FOTIAOQIANG]){
		msg += `${item[GiftType.FOTIAOQIANG]}个佛跳墙。`;
	}
	return msg;
}

/**
 * 检测感谢队列，将所有感谢元素构造成感谢语句并返回，感谢队列没有元素时返回null
 * @param  {[type]} refreshAllThank [description]
 * @return {[type]}                 [description]
 */
export function buildAllThankMsg() {
	const items = thankQueue.nextAll();
	let msg = '';
	for (var i = 0; i < items.length; i++) {
		let item = items[i];
		msg += buildThankMsg(item);
	}
	return msg ? msg : null;
}
