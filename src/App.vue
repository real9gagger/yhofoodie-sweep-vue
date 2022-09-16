<template>
  <div id="app">
	<keep-alive>
	  <router-view v-if="$route.meta.keepAlive"></router-view>
	</keep-alive>
	<router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
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
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  color: #000;
  background-color: #fff;
  height: 100%;
  overflow: auto;
  user-select: none;
}
</style>
