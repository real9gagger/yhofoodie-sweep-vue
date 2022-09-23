import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var moduleA = {
	state(){
		return {
			textInputerValue: "" ,//文本输入框的内容
			cartGoodsList: [], //购物车菜品列表
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
	}
};

var vuexstore = new Vuex.Store({
	modules: { moduleA },
	getters: {
		textInputerValue: state => state.moduleA.textInputerValue,
		cartGoodsList: state => state.moduleA.cartGoodsList
	}
});

export default vuexstore;