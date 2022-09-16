<template>
	<transition name="garnish-counts">
		<div v-if="garnishInfo" class="garnish-counts-mask" data-close="yes" @click="closeMe($event)">
			<div class="garnish-counts-container" id="garnishCountsBox">
				<p class="garnish-counts-close" @click="setCount(9)"><svg><use xlink:href="#icon_close1"></use></svg></p>
				<p class="pd-tb-1rem fw-b fs-1rem">{{garnishInfo.garnish_id | toGarnishName}}</p>
				<p class="fx-r fx-mc">
					<a class="pd-lr-1rem" @click="setCount(0)" :class="{disabled: newCount <= 1}"><svg class="wh-1rem5 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
					<span class="ta-c wi-2rem fs-1rem">{{newCount}}</span>
					<a class="pd-lr-1rem" @click="setCount(1)" :class="{disabled: newCount >= maxCount}"><svg class="wh-1rem5 fi-mc"><use xlink:href="#icon_jia2"></use></svg></a>
				</p>
				<p class="tc-mc fx-r fx-mc mg-t-1rem" @click="gotoDesc()">
					<span>+{{totalPrice}}</span>
					<span v-if="limitType === 1">，仅限 {{maxCount}} 份</span>
					<span v-else-if="limitType === 2">，最多 {{maxCount}} 份</span>
					<svg v-if="limitType" class="wh-1rem fi-cc mg-l-rem5"><use xlink:href="#icon_info1"></use></svg>
				</p>
				<p class="fx-r fx-mc pd-tb-1rem">
					<a class="btnbox fx-g1 bg-f0 tc-33" @click="setCount(2)">删除</a>
					<a class="btnbox fx-g1 mg-l-1rem bg-mc tc-ff" @click="setCount(3)">确定</a>
				</p>
			</div>
		</div>
	</transition>
</template>

<script>
	import { getGarnishName } from '@/config/goods'
	/* 配菜数量加减框 */
	export default {
		name: "orderGarnishCounts",
		data(){
			return {
				newCount: 0,
				maxCount: 0,
				limitType: 0,//1-仅限X份，2-最多X份
				garnishInfo: null
			}
		},
		filters: {
			toGarnishName(gid){
				return getGarnishName(gid) || `G${gid}?`;
			}
		},
		computed: {
			totalPrice(){
				if(this.garnishInfo != null){
					return toFixed2(accMul(this.garnishInfo.goods_price, this.newCount));
				}
				return "0.00";
			}
		},
		methods:{
			showMe(infos, elem, limits){
				if(infos){
					this.garnishInfo = infos;
					this.newCount = infos.garnish_count;
					
					let max1 = +limits || 0;
					let max2 = +infos.maxcount || 0;
					
					if(max1 > 0){//不能大于最大可选配菜份数
						this.maxCount = Math.max(max1 + this.newCount, 0);//加号！
						this.limitType = 2;
					} else if(max2 > 0){//不能大于此份配菜的最大可选数量
						this.maxCount = max2;
						this.limitType = 1;
					} else{
						this.maxCount = 88888888;
						this.limitType = 0;
					}
					
					this.showBox(elem);
				} else {
					this.garnishInfo = null;
					this.newCount = 0;
					this.maxCount = 0;
				}
			},
			setCount(action){
				if(action===0){
					if(this.newCount <= 1){//减
						return;
					} else{
						this.newCount--;
					}
				}else if (action===1){//加
					if(this.newCount >= this.maxCount){
						return;
					} else{
						this.newCount++;
					}
				}else if (action===2) {//删除
					this.garnishInfo.garnish_count = 0;
					this.garnishInfo = null;
					this.$emit("confirm", 0);
				}else if (action===3) {//确定
					this.garnishInfo.garnish_count = this.newCount;
					this.garnishInfo = null;
					this.$emit("confirm", this.newCount);
				}else{//取消
					this.garnishInfo = null;
				}
			},
			showBox(elemDom){//从某个元素位置逐渐放大
				this.$nextTick(() => {
					let $elem = $(elemDom);
					let $gBox = $("#garnishCountsBox");
					let elemOS = $elem.offset();
					let gWidth = $gBox.outerWidth();
					let gHeight = $gBox.outerHeight();
					let gTop = Math.min(elemOS.top - gHeight - 20, (window.innerHeight - gHeight) / 2);//防止弹框遮住配菜框
					let gLeft = (window.innerWidth - gWidth) / 2;
					let scaleX = ($elem.outerWidth() / gWidth).toFixed(8);
					let scaleY = ($elem.outerHeight() / gHeight).toFixed(8);
					let transX = Math.round(elemOS.left - gLeft);
					let transY = Math.round(elemOS.top - gTop);
					
					$gBox.css({
						"top": gTop,
						"left": gLeft,
						"transform": `translate(${transX}px,${transY}px) scale(${scaleX},${scaleY})`
					});
					
					setTimeout(function(){
						$gBox.css({
							"transition": "all 0.3s",
							"transform": "translate(0, 0) scale(1, 1)"
						});
					}, 50);
				});
			},
			closeMe(evt){
				let elem = (evt.target || evt.srcElement);
				if(elem.getAttribute("data-close") === "yes"){
					this.showMe(null, null);
				}
			},
			gotoDesc(){
				this.$router.push("/helpdesc");
			}
		}
	}
</script>

<style scoped="scoped">
	.garnish-counts-mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 30;
		background-color: rgba(0,0,0,0.6);
	}
	
	.garnish-counts-container{
		position: absolute;
		top: 0;
		left: 0;
		width: 80%;
		z-index: 1;
		background-color: #fff;
		border-radius: 1rem;
		padding: 0 1rem;
		text-align: center;
		transform-origin: 0 0 0;
		overflow: hidden;
	}
	
	.garnish-counts-close{
		position: absolute;
		top: 0;
		right: 0;
		z-index: 2;
		padding: 0.5rem 0.75rem;
	}
	.garnish-counts-close > svg{
		width: 0.8rem;
		height: 0.8rem;
		fill: #999;
	}
	
	.garnish-counts-enter{ opacity: 0 }
	.garnish-counts-enter-active{ transition: all 0.3s }
	.garnish-counts-enter-to{ opacity: 1 }
	.garnish-counts-leave{ opacity: 1 }
	.garnish-counts-leave-active{ transition: all 0.3s }
	.garnish-counts-leave-to{ opacity: 0 }
</style>