<template>
	<div class="goods-image-box" :class="boxSize">
		<img v-if="picSrc" :src="picUrl" class="dp-ib wh-f" loading="lazy" onerror="onImageLoadingError()" />
		<span v-else-if="isDeleted">[x]</span>
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
			},
			isDeleted:{
				type: Boolean,
				default: false
			}
		},
		computed:{
			picUrl(){
				if(this.picSrc){
					return "/image/waiter_happy.png"; //测试用
					//return (constVars.OSS_IMG_PATH + this.picSrc + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "";
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.goods-image-box{
		background-color: #eee;
		text-align: center;
		overflow: hidden;
		color: #ccc;
		&.tiny{
			width: 3rem;
			height: 3rem;
			border-radius: 0.5rem;
			> span{
				line-height: 3rem;
				font-size: 1.5rem;
			}
		}
		&.small{
			width: 4rem;
			height: 4rem;
			border-radius: 0.5rem;
			> span{
				line-height: 4rem;
				font-size: 2rem;
			}
		}
		&.middle{
			width: 5rem;
			height: 5rem;
			border-radius: 0.5rem;
			> span{
				line-height: 5rem;
				font-size: 2.5rem;
			}
		}
		&.bigger{
			width: 6rem;
			height: 6rem;
			border-radius: 0.5rem;
			> span{
				line-height: 6rem;
				font-size: 3rem;
			}
		}
		&.fill{
			position: relative;
			border-radius: 0;
			&:before{
				content:"";
				display:block;
				width:100%;
				padding-top:100%;
			}
			> span{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 0;
				font-size: 3rem;
			}
			> img{
				position: absolute;
				left: 0;
				top: 0;
				z-index: 0;
			}
		}
		&.none{
			position: relative;
			border-radius: inherit;
			> span{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 0;
				font-size: 2rem;
			}
		}
	}
</style>