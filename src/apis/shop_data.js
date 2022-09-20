import axios from 'axios'

let shopInitDatas = null;
let shopRemarkObjs = null;

export function getShopDatas(){
	if (shopInitDatas){
		return new Promise((resolve, reject) => {
			resolve(shopInitDatas);
		});
	} else {
		return axios({
			url: '/json/shop_datas_for_dev.json', 
			//url: `${constVars.OSS_GOODS_PATH}${constVars.CURRENT_SHOP_ID}_${constVars.CURRENT_LANGE_TYPE}.json`,
			method: "GET"
		}).then(response => {
			if(response && response.data){
				shopInitDatas = (response.data);
			} else {
				shopInitDatas = {};
			}
			return shopInitDatas;
		});
	}
};

export function getRemarkInfo(rid){
	if(!shopRemarkObjs){
		shopRemarkObjs = {};
		for(let robj of shopInitDatas.beizhu){
			if(robj.list && robj.list.length){
				robj.lastIndex = robj.list.length - 1;
				shopRemarkObjs[robj.id] = robj;
			}
		}
	}
	return shopRemarkObjs[rid];
}