<template>
	<div class="fx-hc pd-tb-1rem">
		<span class="bottom-line-span"></span>
		<span class="pd-lr-rem5 tc-cc fs-rem6"><slot></slot></span>
		<span class="bottom-line-span"></span>
	</div>
</template>

<script>
	export default {
		name: "BottomLine",//底部横线
		data(){
			return {}
		}
	}
</script>

<style scoped="scoped">
	.bottom-line-span{
		border-bottom: 1px solid #ddd;
		flex: 1;
	}
</style>