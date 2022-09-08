<template>
  <div id="app">
	<keep-alive>
	  <router-view v-if="$route.meta.keepAlive"></router-view>
	</keep-alive>
	<router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    /* HelloWorld */
  },
  mounted() {
	if(!window.onresize){
		window.onresize = function(){
			//已屏幕 360 x 640 的字体 20 像素为基准
			let fs_px1 = Math.log2(window.innerWidth / 360) * 20;
			let fs_px2 = Math.round(fs_px1 / 10) * 10;//让它是 10 的倍数：
			if(fs_px2 < 20){
				fs_px2 = 20;
			}
		    document.documentElement.style.fontSize = (fs_px2 + "px");
		}
	}
	window.onresize();
	//this.$yhoAjax("member_app_login", {username: "18249941545", password: "a12345678", uuid: "866982030752119", gpush_token: "1"})
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  color: #000;
  background-color: #fff;
  height: 100vh;
  overflow: auto;
}
</style>
