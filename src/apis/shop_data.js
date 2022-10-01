import axios from 'axios'
import yhoStore from '@/utils/yhostore'

let shopInitDatas = null;
let shopRemarkObjs = null;
let cookbookIDObjectMap = null;

function initKeyMaps(code){
	if(code === 1){
		shopRemarkObjs = {};
		for(let robj of shopInitDatas.beizhu){
			if(robj.list && robj.list.length){
				robj.lastIndex = robj.list.length - 1;
				shopRemarkObjs[robj.id] = robj;
			}
		}
	} else if(code === 2){
		cookbookIDObjectMap = {};
		for(let cobj of shopInitDatas.cookbook_list){
			cookbookIDObjectMap[cobj.id] = cobj;
		}
	}
}

//>>================================ 初始化店铺配置数据 ================================
getShopDatas();
//<<================================ 初始化店铺配置数据 ================================

export function getShopDatas(){
	if (shopInitDatas || (shopInitDatas = yhoStore.onceObject("shop_datas_cache"))){
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
				shopInitDatas = {
					"shop_info":{}
				};
			}
			yhoStore.onceObject("shop_datas_cache", shopInitDatas);//保存到缓存（会话级别）里，防止刷新丢失数据
			return shopInitDatas;
		});
	}
};

export function getRemarkInfo(rid){
	if(!shopRemarkObjs){
		initKeyMaps(1);
	}
	return shopRemarkObjs[rid];
}

export function getCookboookName(cid, separator){
	if(cid && cid.length){
		if(!cookbookIDObjectMap){
			initKeyMaps(2);
		}
		if (Array.isArray(cid)){
			let outputs = [];
			for(let vx of cid){
				let cobj = cookbookIDObjectMap[vx];
				if(cobj && cobj.cookbook_name){
					outputs.push(cobj.cookbook_name);
				} else {
					outputs.push(`Cookbook${vx}`);
				}
			}
			return outputs.join(separator || ",");
		} else {
			let cobj = cookbookIDObjectMap[cid];
			if(cobj && cobj.cookbook_name){
				return cobj.cookbook_name;
			} else {
				return `Cookbook${cid}`;
			}
		}
	}
	return "";
}

//获取菜品打包附加费
export function getGoodsPackCharge(goodsPrice, pcPrice, pcType){
	if(shopInitDatas.shop_info.is_can_takeway != 1){ //店铺不允许打包
		return 0;
	}
	
	if(pcType == 2){//优先取菜品设置的打包附加费====指定金额
		return (pcPrice * 1.0);//转成数字类型
	} else if(pcType == 1){//优先取菜品设置的打包附加费====指定巴仙
		return (pcPrice / 100 * goodsPrice);
	}
	
	let shopPcType = shopInitDatas.shop_info.pack_charge_type;
	if(shopPcType == 0){
		return 0;
	}else if(shopPcType == 2){//店铺设置的打包附加费====指定金额
		return (shopInitDatas.shop_info.pack_charge * 1.0);//转成数字类型
	} else if(shopPcType == 1){//店铺设置的打包附加费====指定巴仙
		return (shopInitDatas.shop_info.pack_charge / 100 * goodsPrice);
	}
	return 0;
}

//获取店铺设置
export function getShopSetting(keyName){
	return shopInitDatas.shop_info[keyName];
}