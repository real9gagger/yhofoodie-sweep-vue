import VueRouter from "vue-router"

let routerList = [
	{
		path: "/",
		name: "主页",
		component: () => import("@/views/home"),
		meta: {
			keepAlive: false
		}
	},
	{
	  path: "*",
	  redirect: "/e404",
	},
	{
		path: "/e404",
		name: "登录页",
		component: () => import("@/views/error/http404"),
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
	}
]

export default new VueRouter({
	routes: routerList
})