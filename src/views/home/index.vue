<template>
	<div class="hi-f fx-c fx-jc">
		<div class="ta-c">
			<p>扫码点餐</p>
			<p class="tc-mc fs-1rem" @click="gotoWork">开始工作 &gt;&gt;</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "homeIndex",
		data(){
			return {
				
			}
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