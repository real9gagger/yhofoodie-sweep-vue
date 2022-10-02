<template>
	<div class="hi-f fx-c fx-jc">
		<div class="ta-c">
			<p>扫码点餐</p>
			<p class="tc-mc fs-1rem" @click="gotoWork">开始点餐 &gt;&gt;</p>
		</div>
	</div>
</template>

<script>
	import { getShopDatas } from '@/apis/shop_data'
	
	export default {
		name: "homeIndex",
		data(){
			return {
				
			}
		},
		created(){
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