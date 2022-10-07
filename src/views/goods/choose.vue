<template>
	<transition name="choose-slideup">
		<div v-if="isShowBox" class="choose-goods-container fx-c">
			<h4 class="fx-g1" @click="showList()"><!--占位专用--></h4>
			<ul>
				<li class="ps-s bg-ff">
					<div class="fx-r hi-f fx-mc pd-lr-rem5 pd-t-rem5">
						<b class="pd-tb-rem5 pd-l-rem5">已点菜品 {{goodsTotalCount}}</b>
						<a class="pd-rem5" @click="changeCount(0, 2)"><svg class="choose-header-icon"><use xlink:href="#icon_clearall"></use></svg></a>
						<b class="pd-l-rem5">用餐人数 {{numberofDining}}</b>
						<a class="pd-rem5"><svg class="choose-header-icon"><use xlink:href="#icon_edit1"></use></svg></a>
						<a class="pd-rem5 fx-g1 ta-r" @click="showList()"><svg class="choose-header-icon"><use xlink:href="#icon_close1"></use></svg></a>
					</div>
				</li>
				<li v-for="(item,index) in cartGoodsList" :key="item.cart_id">
					<div class="fx-r choose-goods-item">
						<goods-image :pic-src="item.goods_thumb" box-size="small"></goods-image>
						<div class="fx-g1 pd-l-rem5">
							<p class="fw-b">{{item.goods_name}}</p>
							<p class="tc-99">
								<span v-if="item.spec_id" class="pd-r-rem5">{{item.spec_id | toSpecName}}</span>
								<span v-if="item.taste_id" class="pd-r-rem5">{{item.taste_id | toTasteName}}</span>
								<template v-if="item.is_package_goods">
									<svg class="wh-1rem fi-mc va-t"><use xlink:href="#icon_taocan2"></use></svg>
									<span class="tc-mc pd-l-rem1 pd-r-rem5">套餐</span>
								</template>
								<template v-if="item.is_pack">
									<svg class="wh-1rem fi-mc va-t"><use xlink:href="#icon_dabao1"></use></svg>
									<span class="tc-mc pd-l-rem1">打包</span>
								</template>
							</p>
							<p class="tc-99" v-if="!$isEmpty(item.garnish_ids)">
								<svg class="wh-1rem fi-99"><use xlink:href="#icon_peicai1"></use></svg>
								<span>{{item.garnish_ids | toGarnishName}}</span>
							</p>
							<template v-if="!$isEmpty(item.package_goods_list)">
								<p v-for="gobj in item.package_goods_list" :key="gobj.item_id">
									<svg class="wh-1rem fi-99"><use xlink:href="#icon_meishi"></use></svg>
									<span class="tc-99 pd-l-rem1">{{gobj.goods_name}}</span>
									<template v-if="gobj.goods_count > 1">
										<span class="fs-rem6 tc-mc">&emsp;x</span><b class="tc-mc">{{gobj.goods_count}}</b>
									</template>
								</p>
							</template>
							<p class="tc-99" v-if="!$isEmpty(item.goods_remarks)">
								<svg class="wh-1rem fi-99 va-t"><use xlink:href="#icon_beizhu1"></use></svg>
								<span>{{item.goods_remarks | toGoodsRemark}}</span>
							</p>
							<counter-goods class="mg-t-rem5"
								:goods-count="item.goods_count" 
								:goods-index="index"
								:counter-title="item.total_price"
								@change="counterChange"></counter-goods>
						</div>
					</div>
				</li>
				<li class="ps-s po-b-0 bg-ff">
					<div v-if="!isAllowPackaging" class="pd-rem5 ta-c">本店铺暂不支持打包</div>
				</li>
			</ul>
		</div>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import { getShopSetting } from '@/apis/shop_data'
	import counterGoods from './counter'
	import goodsImage from '@/components/GoodsImage'
	
	export default {
		name: "goodsChoose",
		data(){
			return {
				cartAddingTimerID: 0,
				numberofDining: 1, //用餐人数
				goodsTotalCount: 0, //已点菜品数量
				isShowBox: false, //是否显示已点
				isAllowPackaging: (getShopSetting("is_can_takeway") == 1) //是否允许打包
			}
		},
		filters:{
			toSpecName(sid){
				return getSpecName(sid) || `[S${sid}]`;
			},
			toTasteName(tid){
				return getTasteName(tid) || `[T${tid}]`;
			},
			toGarnishName(gids){
				let output = "";
				for(let gid in gids){
					let gname = getGarnishName(gid) || `[G${gid}]`;
					if(!output.length){
						output += gname;
					} else {
						output += `,${gname}`;
					}
					
					if(gids[gid] > 1){
						output += ` x${gids[gid]}`; 
					}
				}
				return output;
			},
			toGoodsRemark(rids){
				let output = "";
				for(let rid in rids){
					if(!output.length){
						output += rids[rid];
					} else {
						output += `,${rids[rid]}`;
					}
				}
				return output;
			}
		},
		computed: {
			...mapGetters(["cartGoodsList"])
		},
		components:{ counterGoods, goodsImage },
		methods:{
			showList(nums){
				if(nums){
					this.goodsTotalCount = nums;
					this.isShowBox = !this.isShowBox;
				} else {
					this.goodsTotalCount = 0;
					this.isShowBox = false;
				}
			},
			checkGoods(ukey){//判断菜品是否已被添加过了
				for(let nth in this.cartGoodsList){
					let keyStr = this.cartGoodsList[nth].unique_key;
					if(keyStr.length === ukey.length && keyStr === ukey){ //先判断长度再判断内容
						return nth;
					}
				}
				return -1;
			},
			changeCount(nth, isAdds){
				if(isAdds === 2){//清空
					this.$store.commit("clearGoodsFromCart");//清空购物车
					this.isShowBox = false;
				} else {
					let temp = this.cartGoodsList[nth];
					if(isAdds === 1 || isAdds === 3){
						temp.goods_count++;
						temp.total_price = toFixed2(accMul(temp.unit_price, temp.goods_count));
					} else {
						if(temp.goods_count > 1){
							temp.goods_count--;
							temp.total_price = toFixed2(accMul(temp.unit_price, temp.goods_count));
						} else {
							this.$store.commit("removeGoodsFromCart", nth);//删除某个菜品
							if(this.cartGoodsList.length === 0){
								this.isShowBox = false;
							}
						}
					}
				}
				if(isAdds < 3){
					this.$store.commit("recalcTotalPrice");//重新计算
				}
			},
			counterChange(arg0){
				this.changeCount(arg0.goodsIndex, arg0.actionValue >= 1 ? 1 : 0);
			},
			addGoods(ginfos){//没有规格/口味/配菜的菜品可以快速添加
				var $mine = this;

				clearTimeout($mine.cartAddingTimerID);
				
				var existsIndex = $mine.checkGoods(ginfos.unique_key);
				if(existsIndex < 0){//如果菜品没有被添加过
					this.$store.commit("addGoodsToCart", ginfos);
				} else {
					$mine.changeCount(existsIndex, 3);
				}
				
				$mine.cartAddingTimerID = setTimeout(function(){
					$mine.$store.commit("recalcTotalPrice"); //重新计算
				}, 500);
			},
			reduceGoods(ukey){//减少菜品数量
				let existsIndex = this.checkGoods(ukey);
				this.changeCount(existsIndex, 0);
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$bottomContainerHeight: 3rem;
	$maskBoxBgColor: rgba(0,0,0,0.6);
	
	.choose-goods-container{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: $bottomContainerHeight;
		z-index: 2;
		background-color: $maskBoxBgColor;
		> ul{
			max-height: 90%;
			min-height: 50%;
			overflow: auto;
			transition: inherit;
			position: relative;
			transform: translateY(0);
			border-radius: 1rem 1rem 0 0;
			background-color: #fff;
		}
	}
	.choose-goods-item{
		padding: 0.5rem 1rem;
		position: relative;
		> img{
			width: 4rem;
			height: 4rem;
			border-radius: 0.5rem;
			background-color: #f0f0f0;
		}
		&:active{
			background-color: #f0f0f0;
		}
		&:after{
			content: "";
			display: block;
			position: absolute;
			bottom: 0;
			left: 1rem;
			right: 1rem;
			z-index: 0;
			border-bottom: 1px solid #f0f0f0;
		}
	}
	.choose-header-icon{
		width:0.8rem;
		height:0.8rem;
		fill:#999;
		vertical-align:text-top;
	}
	
	/* 向上滑出动画 */
	.choose-slideup-enter{ 
		background-color: rgba(0,0,0,0.0);
		> ul { transform: translateY(100%) }
	}
	.choose-slideup-enter-active{ transition: all 0.4s }
	.choose-slideup-enter-to{
		background-color: $maskBoxBgColor;
		> ul { transform: translateY(0) }
	}
	.choose-slideup-leave{ 
		background-color: $maskBoxBgColor;
		> ul { transform: translateY(0) }
	}
	.choose-slideup-leave-active{ transition: all 0.4s }
	.choose-slideup-leave-to{
		background-color: rgba(0,0,0,0.0);
		> ul { transform: translateY(100%) }
	}
</style>