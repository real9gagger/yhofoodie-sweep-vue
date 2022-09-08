//import { getLangeType } from '@/config/lange'
import constVars from '@/config/const'
import axios from 'axios'

let shopGoodsData = null;
let cateIDIndexMap = null;
let specIDNameMap = null;
let tasteIDNameMap = null;
let garnishIDNameMap = null;
let nowDateTime = null; //避免频繁创建日期对象

//初始化键值对
function initKeyMaps(code){
	if(code === 1){
		cateIDIndexMap = {};
		for(let idx = 0; idx < shopGoodsData.list.length; idx++){
			cateIDIndexMap[shopGoodsData.list[idx].id] = idx;
		}
	} else if(code === 2){
		specIDNameMap = {};
		for(let sobj of shopGoodsData.spec_list){
			specIDNameMap[sobj.spec_id] = sobj.goods_spec_name;
		}
	} else if(code === 3){
		tasteIDNameMap = {};
		for(let tobj of shopGoodsData.taste_list){
			tasteIDNameMap[tobj.taste_id] = tobj.goods_taste_name;
		}
	} else if(code === 4){
		garnishIDNameMap = {};
		for(let gobj of shopGoodsData.garnish_list){
			garnishIDNameMap[gobj.garnish_id] = gobj.goods_garnish_name;
		}
	}
}

//返回时分秒时间戳整数，返回 hhmmss 格式
function getHHmmss(sxo) {
	var timeobj = null;
    if (sxo) {
        timeobj = new Date(sxo * 1000);
    } else {
        timeobj = nowDateTime;
    }
	
	return (timeobj.getHours() * 10000 + timeobj.getMinutes() * 100 + timeobj.getSeconds());
}

//检查是否在可售时间内
function isInTime(bzz, ezz) {
    var beg = getHHmmss(bzz), //开始
        end = getHHmmss(ezz), //结束
        cur = getHHmmss(); //当前	
    //结束时间【大于】开始时间：同一天
    //结束时间【小于】开始时间：隔一天
    if (end > beg) {
        return (cur > beg && cur < end);
    } else {
        return ((cur > beg && cur <= 235959) || (cur >= 0 && cur < end));
    }
}

//删掉一些无效菜品或分类
function handleGoodsList(gs){
	if(!gs.list){
		gs.list = [];
	}
	
	if(gs.package_list && gs.package_list.length){ //将套餐加入分类中
		for(let pobj of gs.package_list){//套餐JSON格式与普通菜品JSON格式统一成一个格式
			pobj.goods_material = pobj.description;
			pobj.is_package_goods = true;
			delete pobj.description;
		}
		let pp = {
			id: 0,//固定
			goods_cate_name: "套餐",
			goods_list: gs.package_list
		};
		let ix = Math.min(gs.list.length - 1, 4);
		for (;ix >= 0;ix--){
			if(gs.list[ix].id <= 2){//显示在推荐、热销之后！如果没有热销和推荐则显示在首位
				break;
			}
		}
		gs.list.splice(ix + 1, 0, pp);
	}
	
	$.each(gs.list, function(idx, item){
		for(let ix = item.goods_list.length - 1; ix >= 0; ix--){//由于有删除操作，因此必须要倒序遍历
			let delCount = 0;
			while (ix >= 0 && item.goods_list[ix].is_member_hide == 1){
				ix--;
				delCount++;
			}
			if(delCount > 0){
				item.goods_list.splice(ix + 1, delCount); //删掉不能在用户端显示的菜品
			}
		}
	});
	
	for(let ix = gs.list.length - 1; ix >= 0; ix--){//由于有删除操作，因此必须要倒序遍历
		let delCount = 0;
		while (ix >= 0 && gs.list[ix].goods_list.length === 0){
			ix--;
			delCount++;
		}
		if(delCount > 0){
			gs.list.splice(ix + 1, delCount); //删除没有菜品的分类
		}
	}
	
	return gs;
}

//返回格式 hh:mm - hh:mm
function formatHHmm2(ts1, ts2){
	let time1 = new Date(ts1 * 1000);
	let time2 = new Date(ts2 * 1000);
	
	let hh1 = time1.getHours();
	let hh2 = time2.getHours();
	let mm1 = time1.getMinutes();
	let mm2 = time2.getMinutes();
	
	return (
		(hh1 >= 10 ? `${hh1}:` : `0${hh1}:`) + 
		(mm1 >= 10 ? `${mm1} - ` : `0${mm1} - `) + 
		(hh2 >= 10 ? `${hh2}:` : `0${hh2}:`) + 
		(mm2 >= 10 ? `${mm2}` : `0${mm2}`)
	);
}

export function getShopGoods(){
	if (shopGoodsData){
		return new Promise((resolve, reject) => {
			resolve(shopGoodsData);
		});
	} else {
		return axios({
			url: '/json/shop_goods_for_dev.json', 
			//url: `${constVars.OSS_GOODS_PATH}${constVars.CURRENT_SHOP_ID}_${constVars.CURRENT_LANGE_TYPE}.json`,
			method: "GET"
		}).then(response => {
			if(response && response.data){
				shopGoodsData = handleGoodsList(response.data);
				return shopGoodsData;
			} else {
				return {
					"list": [],
					"garnish_list": [],
					"package_list": [],
					"spec_list": [],
					"taste_list": []
				};
			}
		});
	}
};

export function getCateName(cid, defval){
	if(cid){
		if(!cateIDIndexMap){
			initKeyMaps(1);
		}
		let v_v = shopGoodsData.list[cateIDIndexMap[cid]];
		if(v_v){
			return (v_v.goods_cate_name || defval);
		}
	}
	return defval;
}

export function getCateObject(cid){
	if(cid){
		if(!cateIDIndexMap){
			initKeyMaps(1);
		}
		return shopGoodsData.list[cateIDIndexMap[cid]];
	}
	return null;
}

export function getSpecName(sid, separator){
	if(sid && sid.length){
		if(!specIDNameMap){
			initKeyMaps(2);
		}
		if (Array.isArray(sid)){
			let outputs = [];
			for(let vx of sid){
				outputs.push(specIDNameMap[vx] || vx);
			}
			return outputs.join(separator || ",");
		} else {
			return (specIDNameMap[sid] || "");
		}
	} else {
		return "";
	}
}

export function getTasteName(tid, separator){
	if(tid && tid.length){
		if(!tasteIDNameMap){
			initKeyMaps(3);
		}
		if (Array.isArray(tid)){
			let outputs = [];
			for(let vx of tid){
				outputs.push(tasteIDNameMap[vx] || vx);
			}
			return outputs.join(separator || ",");
		} else {
			return (tasteIDNameMap[tid] || "");
		}
	} else {
		return "";
	}
}

export function getGarnishName(gid, separator){
	if(gid && gid.length){
		if(!garnishIDNameMap){
			initKeyMaps(4);
		}
		if (Array.isArray(gid)){
			let outputs = [];
			for(let vx of gid){
				outputs.push(garnishIDNameMap[vx] || vx);
			}
			return outputs.join(separator || ",");
		} else {
			return (garnishIDNameMap[gid] || "");
		}
	} else {
		return "";
	}
}

//判断分类是否在可售时间
export function isCateInSaleableTime(cateobj, ispack){
	if(!cateobj){
		return true; //如果菜品没有分类，默认可售
	}
	
	let isSaleable = true; //判断是否可售
	if (cateobj.week && cateobj.week.length) { //分类的每周可售日子
		let weekDays = "7123456";
		let weekNth = nowDateTime.getDay();
		isSaleable = (cateobj.week.indexOf(weekDays[weekNth]) >= 0);
	}
	
	if (ispack) {//套餐分类
		if(isSaleable && cateobj.use_time && cateobj.use_time.length === 3){
			if (isSaleable && cateobj.use_time[0].begin_time > 0 && cateobj.use_time[0].end_time > 0) {
				isSaleable = isInTime(cateobj.use_time[0].begin_time, cateobj.use_time[0].end_time);
			}
			if (isSaleable && cateobj.use_time[1].begin_time1 > 0 && cateobj.use_time[1].end_time1 > 0) {
				isSaleable = isInTime(cateobj.use_time[1].begin_time1, cateobj.use_time[1].end_time1);
			}
			if (isSaleable && cateobj.use_time[2].begin_time2 > 0 && cateobj.use_time[2].end_time2 > 0) {
				isSaleable = isInTime(cateobj.use_time[2].begin_time2, cateobj.use_time[2].end_time2);
			}
		}
	} else {//非套餐分类
		if(isSaleable){
			if (isSaleable && cateobj.begin_time > 0 && cateobj.end_time > 0) {
				isSaleable = isInTime(cateobj.begin_time, cateobj.end_time);
			}
			if (isSaleable && cateobj.begin_time1 > 0 && cateobj.end_time1 > 0) {
				isSaleable = isInTime(cateobj.begin_time1, cateobj.end_time1);
			}
			if (isSaleable && cateobj.begin_time2 > 0 && cateobj.end_time2 > 0) {
				isSaleable = isInTime(cateobj.begin_time2, cateobj.end_time2);
			}
		}
	}
	
	return isSaleable;
}

//获取可售时间范围
export function getSaleableTimeRange(gobj){
	if(!gobj){
		return "";
	}
	
	let weeklist = ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
	if(!!gobj.package_cate_list){//套餐分类
		let outputs = [];
		if(gobj.week && gobj.week.length && gobj.week.length !== 7){
			outputs.push(gobj.week.map(wk => weeklist[wk]).join(","));
		}
		if(gobj.use_time && gobj.use_time.length === 3){
			if (gobj.use_time[0].begin_time > 0 && gobj.use_time[0].end_time > 0) {
				outputs.push(formatHHmm2(gobj.use_time[0].begin_time, gobj.use_time[0].end_time));
			}
			if (gobj.use_time[1].begin_time1 > 0 && gobj.use_time[1].end_time1 > 0) {
				outputs.push(formatHHmm2(gobj.use_time[1].begin_time1, gobj.use_time[1].end_time1));
			}
			if (gobj.use_time[2].begin_time2 > 0 && gobj.use_time[2].end_time2 > 0) {
				outputs.push(formatHHmm2(gobj.use_time[2].begin_time2, gobj.use_time[2].end_time2));
			}
		}
		if(outputs.length){
			return outputs.join(" ");
		}
	} else { //非套餐分类
		let cateobj = getCateObject(gobj.goods_cate_id);
		if(cateobj){
			let outputs = [];
			if(cateobj.week && cateobj.week !== "7,1,2,3,4,5,6"){
				outputs.push(cateobj.week.replace(/\d/g, mat => weeklist[mat]));
			}
			if (cateobj.begin_time > 0 && cateobj.end_time > 0) {
				outputs.push(formatHHmm2(cateobj.begin_time, cateobj.end_time));
			}
			if (cateobj.begin_time1 > 0 && cateobj.end_time1 > 0) {
				outputs.push(formatHHmm2(cateobj.begin_time1, cateobj.end_time1));
			}
			if (cateobj.begin_time2 > 0 && cateobj.end_time2 > 0) {
				outputs.push(formatHHmm2(cateobj.begin_time2, cateobj.end_time2));
			}
			return outputs.join(" ");
		}
	}
	return "";
}

//重置时间
export function resetDateTime(){
	nowDateTime = new Date();
}

//获取推荐的菜品
export function getRecommendGoods(cateID){
	if(shopGoodsData.list[0].id == 1){//推荐菜品
		return shopGoodsData.list[0].goods_list;
	}
} 