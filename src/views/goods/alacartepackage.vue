<template>
	<transition name="package-slideup">
		<div>
			<div class="fx-g1" @click="showMe()"><!--占位专用--></div>
			<div>
				
			</div>
		</div>
	</transition>
</template>

<script>
	import constVars from '@/apis/const'
	/* 套餐点菜框 */
	export default {
		name: "goodsAlacartePackage",
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$maskBoxBgColor: rgba(0,0,0,0.6);
	/* 向上滑出动画 */
	.package-slideup-enter{ 
		background-color: rgba(0,0,0,0.0);
		ul { transform: translateY(100%) }
	}
	.package-slideup-enter-active{ transition: all 0.4s }
	.package-slideup-enter-to{
		background-color: $maskBoxBgColor;
		ul { transform: translateY(0) }
	}
	.package-slideup-leave{ 
		background-color: $maskBoxBgColor;
		ul { transform: translateY(0) }
	}
	.package-slideup-leave-active{ transition: all 0.4s }
	.package-slideup-leave-to{
		background-color: rgba(0,0,0,0.0);
		ul { transform: translateY(100%) }
	}
</style>