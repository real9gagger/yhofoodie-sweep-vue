<template>
	<div @click="goBack()" class="fx-hc">
		<svg class="back-button-svg"><use xlink:href="#icon_zuoxiangjiao"></use></svg>
		<span class="tc-66">{{title}}</span>
	</div>
</template>

<script>
	export default {
		name: "BackButton",//返回按钮
		props:{
			title:{
				type: String,
				default: ""
			}
		},
		data(){
			return {}
		},
		methods:{
			goBack(){
				this.$router.back();
			}
		}
	}
</script>

<style scoped="scoped">
	.back-button-svg{
		width:1rem;
		height:1rem;
		fill: #666;
	}
</style>