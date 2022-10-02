<template>
  <div id="yhoapp">
	<transition 
		@before-enter="onPageBeforeEnter" 
		@enter="onPageEnter" 
		@after-enter="onPageAfterEnter" 
		@leave="onPageLeave" :css="false">
		<keep-alive :exclude="keepAliveExclude" :max="20">
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
	</transition>
	<transition 
		@before-enter="onPageBeforeEnter" 
		@enter="onPageEnter" 
		@after-enter="onPageAfterEnter" 
		@leave="onPageLeave" :css="false">
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</transition>
  </div>
</template>

<script>
//import Velocity from 'velocity-animate'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data(){
	return {}
  },
  computed: {
  	...mapGetters(["isRouterBack", "keepAliveExclude"])
  },
  mounted() {
	if(!window.onresize){
		window.onresize = function(){
			//【手机端】以屏幕 360x640 的字体 20 像素为基准，【电脑端】以 1366x768 为基准
			let fs_px1 = 0;
			if (navigator.userAgent.lastIndexOf("Mobile") >= 0){
				fs_px1 = (window.innerWidth / 360) * 10;
			} else {
				fs_px1 = (window.innerWidth / 1366) * 20;
			}
			let fs_px2 = Math.round(fs_px1 / 10) * 10;//让它是 10 的倍数：
			if(fs_px2 < 20){
				fs_px2 = 20;
			}
		    document.documentElement.style.fontSize = (fs_px2 + "px");
			document.body.style.height = (window.innerHeight + "px");
		}
	}
	window.onresize();
	//this.$yhoAjax("member_app_login", {username: "18249941545", password: "a12345678", uuid: "866982030752119", gpush_token: "1"})
  },
  methods:{
	onPageBeforeEnter(elem){//进入页面时要固定定位
		//等于null表示首次加载，此时不需要页面切换动画
		let transX = (this.isRouterBack ? -100 : (this.isRouterBack===false ? 100 : 0));
		$(elem).css({
			position: "fixed",
			top: "0px",
			left: "0px",
			right: "0px",
			bottom: "0px",
			zIndex: "99",
			transform: `translate(${transX}%,0)`, //如果是返回则，往右移动，打开新页面时才往左移动
			transition: "transform 0.4s"
		});
	},
	onPageEnter(elem, done){//页面进入
		/* Velocity(elem, { transform: "translateX(0)" }, { duration: 3000, complete: done }); */
		$(elem).one("transitionend", done);
		setTimeout(function(){ elem.style.transform = "translate(0,0)" }, 10);
	},
	onPageAfterEnter(elem){//进入动画执行完，重置	
		elem.style.position = null;
		elem.style.top = null;
		elem.style.left = null;
		elem.style.right = null;
		elem.style.bottom = null;
		elem.style.zIndex = null;
		elem.style.transform = null;
		elem.style.transition = null;
	},
	onPageLeave(elem, done){//页面离开
		$(elem).css({
			transform: "translate(0, 0)",
			transition: "transform 0.4s"
		}).one("transitionend", done);
		
		setTimeout(function(transX){
			elem.style.transform = `translate(${transX}%, 0)`;
		}, 10, (this.isRouterBack ? 100 : -100));//如果是返回则，往右移动，打开新页面时才往左移动
	}
  }
}
</script>

<style lang="scss">
#yhoapp {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  color: #000;
  background-color: #fff;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  scroll-behavior:smooth;
}
</style>
