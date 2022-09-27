<template>
	<div class="hi-f fx-c fx-jc">
		<div class="ta-c">
			<p>扫码点餐</p>
			<p class="tc-mc fs-1rem" @click="gotoWork">开始工作 &gt;&gt;</p>
		</div>
	</div>
</template>

<script>
	import yhoStore from '@/utils/yhostore'
	import { getShopDatas } from '@/apis/shop_data'
	
	export default {
		name: "homeIndex",
		data(){
			return {
				
			}
		},
		created(){
			yhoStore.onceString("user_login_token", Date.now());
			getShopDatas();
		},
		methods: {
			gotoWork(){
				this.$router.push("/select");
			}
		}
	}
</script>

<style>
</style>