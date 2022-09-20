<template>
	<div class="skeleton-screen-container" :class="showLoadingClass">
		<slot name="header"></slot>
		<div v-for="num in itemCount" :key="num" :class="itemClass"><slot name="item"></slot></div>
		<slot name="footer"></slot>
	</div>
</template>

<script>
	export default {
		name: "SkeletonScreen",//骨架屏
		props: {
			itemCount:{
				type: Number,
				default: 1
			},
			animationType:{
				type: Number,
				default: 0
			},
			itemClass:{
				type: String,
				default: ""
			}
		},
		computed: {
			showLoadingClass(){
				switch(this.animationType){
					case 1: return "showloading1";
					case 2: return "showloading2";
					case 3: return "showloading3";
					default: return "";
				}
			}
		},
		data(){
			return {}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.skeleton-screen-container{
		span.skeleton-item{/* 文本 */
			display: inline-block;
			border-radius: 6px;
			vertical-align: middle;
		}
		.skeleton-item{
			min-height: 1rem;
			background-color: #f0f0f0;
		}
		&.showloading1{
			.skeleton-item {
				background-image: linear-gradient(90deg,transparent 25%,#e9e9e9 37%,transparent 63%);
				background-size: 400% 100%;
				animation: skeleton-loading-ani 1.4s ease infinite;
			}
		}
		&.showloading2{
			> div{
				position: relative;
				&:before{
					content: "";
					display: block;
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					z-index: 99;
					background-image: linear-gradient(90deg,transparent 25%,rgba(255, 255, 255, 0.4) 37%,transparent 63%);
					background-size: 400% 100%;
					animation: skeleton-loading-ani 1.4s ease infinite;
				}
			}
		}
		&.showloading3{
			position: relative;
			&:before{
				content: "";
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 99;
				background-image: linear-gradient(90deg,transparent 25%,rgba(255, 255, 255, 0.4) 37%,transparent 63%);
				background-size: 400% 100%;
				animation: skeleton-loading-ani 1.4s ease infinite;
			}
		}
	}
</style>