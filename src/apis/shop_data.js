import axios from 'axios'

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