import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var moduleA = {
	state(){
		return {
			textInputerValue: "" ,//文本输入框的内容
			cartGoodsList: [], //购物车菜品列表
			cartTotalInfo: {
				total_price: "0.00",
				total_count: 0
			}, //购物车菜品总价、数量等信息...
		}
	},
	actions: {},
	mutations: {
		setTextInputerValue(state, val){
			state.textInputerValue = (val || "").trim();
		},
		resetTextInputerValue(state){
			state.textInputerValue = "";
		},
		addGoodsToCart(state, ginfos){//添加到购物车
			state.cartGoodsList.push(ginfos);
		},
		removeGoodsFromCart(state, index){//从购物车删除某个商品
			state.cartGoodsList.splice(index, 1);
		},
		clearGoodsFromCart(state){//清空购物车
			state.cartGoodsList.splice(0);
		},
		recalcTotalPrice(state){//重新计算购物车总价，数量
			let sum1 = 0;
			let sum2 = 0;
			let obj0 = {};
			let key0 = ""; 
			
			for(let item of state.cartGoodsList){
				sum1 += item.goods_count;
				sum2 = accAdd(sum2, item.total_price);
				key0 = (item.cate_key + item.goods_key);
				
				if(!obj0[item.cate_key]){
					obj0[item.cate_key] = item.goods_count;
				} else {
					obj0[item.cate_key] += item.goods_count;
				}
				
				if(!obj0[key0]){
					obj0[key0] = item.goods_count;
				} else {
					obj0[key0] += item.goods_count;
				}
			}
			
			obj0.total_price = toFixed2(sum2);
			obj0.total_count = sum1;
			
			state.cartTotalInfo = obj0;
		}
	}
};

var vuexstore = new Vuex.Store({
	modules: { moduleA },
	getters: {
		textInputerValue: state => state.moduleA.textInputerValue,
		cartGoodsList: state => state.moduleA.cartGoodsList,
		cartTotalInfo: state => state.moduleA.cartTotalInfo,
	}
});

export default vuexstore;