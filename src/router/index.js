import VueRouter from "vue-router"

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
]

export default new VueRouter({
	routes: routerList
})