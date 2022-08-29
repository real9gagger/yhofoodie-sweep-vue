import { getLangeType } from '@/config/lange'
import constVars from '@/config/const'
import axios from 'axios'

let cvs = constVars;

let goodsObj = require(`@/assets/shop_goods_for_dev.json`);

export function getShopGoods(){
	if (goodsObj){
		return new Promise((resolve, reject) => {
			resolve(goodsObj);
		});
	} else {
		axios({
			url: `${cvs.OSS_GOODS_PATH}${cvs.CURRENT_SHOP_ID}_${cvs.CURRENT_LANGE_TYPE}.json`,
			method: "GET"
		}).then(response => {
			console.log(response);
		});
	}
};
