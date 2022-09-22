import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var moduleA = {
	state(){
		return {
			textInputerValue: "" ,//文本输入框的内容
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
	}
};

var vuexstore = new Vuex.Store({
	modules: { moduleA },
	getters: {
		textInputerValue: state => state.moduleA.textInputerValue
	}
});

export default vuexstore;