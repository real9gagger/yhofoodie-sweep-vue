<template>
	<div class="goods-image-box" :class="boxSize">
		<img v-if="picSrc" :src="picUrl" class="dp-ib wh-f" loading="lazy" onerror="onImageLoadingError()" />
		<span v-else-if="goodsName" class="dp-ib">{{goodsName[0]}}</span>
		<img v-else src="/image/foods_icon.png" class="dp-ib wh-f" />
	</div>
</template>

<script>
	import constVars from '@/apis/const'
	export default {
		name: "GoodsImage",//菜品图片框
		props:{
			picSrc:{
				type: String,
				default: ""
			},
			goodsName:{
				type: String,
				default: ""
			},
			boxSize:{
				type: String,
				default: "middle"
			}
		},
		computed:{
			picUrl(){
				if(this.picSrc){
					//return "/image/waiter_happy.png"; //测试用
					return (constVars.OSS_IMG_PATH + this.picSrc + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "";
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.goods-image-box{
		background-color: #f0f0f0;
		border-radius: 0.5rem;
		text-align: center;
		overflow: hidden;
		color: #ccc;
		&.tiny{
			width: 3rem;
			height: 3rem;
			> span{
				line-height: 3rem;
				font-size: 1.5rem;
			}
		}
		&.small{
			width: 4rem;
			height: 4rem;
			> span{
				line-height: 4rem;
				font-size: 2rem;
			}
		}
		&.middle{
			width: 5rem;
			height: 5rem;
			> span{
				line-height: 5rem;
				font-size: 2.5rem;
			}
		}
		&.bigger{
			width: 6rem;
			height: 6rem;
			> span{
				line-height: 6rem;
				font-size: 3rem;
			}
		}
	}
</style>