<template>
  <div id="app">
	<router-view></router-view>
    <!-- <img alt="Vue logo" src="./assets/logo.png"/>
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
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
			let fs_px1 = (window.innerWidth / 360) * 20;
			let fs_px2 = Math.floor(fs_px1 / 10) * 10;//让它是 10 的倍数：
			if(fs_px2 < 10){
				fs_px2 = 10;
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
