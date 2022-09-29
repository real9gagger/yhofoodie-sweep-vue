import VueRouter from "vue-router"
import yhoStore from '@/utils/yhostore'

let routerList = [
	{
		path: "/",
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
			keepAlive: true
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
	  redirect: "/e404",
	}
];

let yhoRouter = new VueRouter({
	routes: routerList,
	//scrollBehavior: function(to, from, savedPosition){}
})

//添加导航守卫，用的是 vue-router3，而非4，参见 https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html
yhoRouter.beforeEach((to, from, next) => {
	if(to.path !== "/" && !yhoStore.onceString("user_login_token")){
		next("/");
	} else {
		next();
	}
});

export default yhoRouter;