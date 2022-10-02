import VueRouter from "vue-router"
import yhoStore from '@/utils/yhostore'
import vuexStore from '@/utils/vuexstore'

let routerList = [
	{
		path: "/", 
		name: "首页",
		redirect: "/home",//跳转到主页
	},
	{
		path: "/home",
		name: "主页",
		component: () => import("@/views/home/index"),
		meta: {
			keepAlive: true
		}
	},
	{
		path: "/select",
		name: "选菜",
		component: () => import("@/views/goods/select"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/details",
		name: "菜品详情",
		component: () => import("@/views/goods/details"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/alacartepackage",
		name: "选择套餐",
		component: () => import("@/views/goods/alacartepackage"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/login",
		name: "登录页",
		component: () => import("@/views/login"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/helpdesc",
		name: "说明",
		component: () => import("@/views/help/desc"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/inputer",
		name: "文本输入器",
		component: () => import("@/components/TextInputer"),
		meta: {
			keepAlive: false
		}
	},
	{
		path: "/e404",
		name: "找不到页面",
		component: () => import("@/views/error/http404"),
		meta: {
			keepAlive: false
		}
	},
	{
	  path: "*",
	  name: "未知页面",
	  redirect: "/e404",
	}
];

let yhoRouter = new VueRouter({
	routes: routerList,
	//scrollBehavior: function(to, from, savedPosition){}
});

let historyPaths = "";
let currentCName = "";//当前Vue控件名称

function isFirstin(toPath){
	if(!historyPaths){
		vuexStore.commit("setIsRouterBack", null);
		vuexStore.commit("clearKeepAliveExclude");
		historyPaths = `,${toPath}`;
		yhoStore.onceString("router_history_paths", historyPaths);
		return true;
	}
	return false;
}

function isGoback(toPath, fromPath){
	if(historyPaths.endsWith(`,${toPath},${fromPath}`)){
		vuexStore.commit("setIsRouterBack", true);
		vuexStore.commit("addKeepAliveExclude", currentCName);
		historyPaths = historyPaths.substr(0, historyPaths.length - fromPath.length - 1);
		yhoStore.onceString("router_history_paths", historyPaths);
		return true;
	}
	return false;
}

function isRefresh(toPath){
	if(historyPaths.endsWith(`,${toPath}`)){
		vuexStore.commit("setIsRouterBack", null);
		vuexStore.commit("clearKeepAliveExclude");
		return true;
	}
	return false;
}

function isReplace(fullPath, toPath){
	if(fullPath.endsWith("IS_REPLACE_ROUTER=1")){//使用路由替换功能时，请加上这个属性 IS_REPLACE_ROUTER:1
		vuexStore.commit("addKeepAliveExclude", currentCName);
		let idot = historyPaths.lastIndexOf(",");
		if(idot >= 0){
			historyPaths = historyPaths.substr(0, idot + 1) + toPath;
		} else {
			historyPaths = `,${toPath}`;
		}
		yhoStore.onceString("router_history_paths", historyPaths);
		return true;
	}
	return false;
}

function isForward(toPath){
	vuexStore.commit("setIsRouterBack", false);
	vuexStore.commit("clearKeepAliveExclude");
	historyPaths += `,${toPath}`;
	yhoStore.onceString("router_history_paths", historyPaths);
	return true;
}

//添加导航守卫，用的是 vue-router3，而非4，参见 https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html
yhoRouter.beforeEach((to, from, next) => {
	if(!historyPaths){
		historyPaths = yhoStore.onceString("router_history_paths");
	}
	
	if(isFirstin(to.path)){//首次进入
		return !next("/home");
	} else if(isRefresh(to.path)){//刷新
		to.meta.keepAlive = true;
	} else if(isReplace(to.fullPath, to.path)){//替换
		to.meta.keepAlive = !(from.meta.keepAlive = false);
	} else if(isGoback(to.path, from.path)){//返回
		from.meta.keepAlive = false;
	} else  {//前进
		to.meta.keepAlive = isForward(to.path);
	}
	
	next();
});

yhoRouter.afterEach((to, from) => {
	try{
		currentCName = to.matched[0].components.default.name;
	}catch(ex){
		currentCName = "";
	}
});

export default yhoRouter;