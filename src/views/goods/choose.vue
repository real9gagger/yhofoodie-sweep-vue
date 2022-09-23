<template>
	<transition name="choose-slideup">
		<div v-if="isShowChoose" class="choose-goods-container fx-c">
			<h4 class="fx-g1" @click="showList()"><!--占位专用--></h4>
			<ul>
				<li class="ps-s bg-ff">
					<div class="fx-r hi-f fx-mc pd-lr-rem5 pd-t-rem5">
						<b class="pd-tb-rem5 pd-l-rem5">已点菜品 {{cartGoodsCount}}</b>
						<a class="pd-rem5" @click="changeCount(0, 2)"><svg class="choose-header-icon"><use xlink:href="#icon_clearall"></use></svg></a>
						<b class="pd-l-rem5">用餐人数 {{numberofDining}}</b>
						<a class="pd-rem5"><svg class="choose-header-icon"><use xlink:href="#icon_edit1"></use></svg></a>
						<a class="pd-rem5 fx-g1 ta-r" @click="showList()"><svg class="choose-header-icon"><use xlink:href="#icon_close1"></use></svg></a>
					</div>
				</li>
				<li v-for="(item,index) in chooseList" :key="item.cart_id">
					<div class="fx-r choose-goods-item">
						<img :src="getSrc(item.goods_thumb)" />
						<div class="fx-g1 pd-l-rem5">
							<p class="fw-b">{{item.goods_name}}</p>
							<p class="tc-99">
								<span v-if="item.spec_id" class="pd-r-rem5">{{item.spec_id | toSpecName}}</span>
								<span v-if="item.taste_id" class="pd-r-rem5">{{item.taste_id | toTasteName}}</span>
								<template v-if="item.is_pack">
									<svg class="wh-1rem fi-mc va-t"><use xlink:href="#icon_dabao1"></use></svg>
									<span class="tc-mc pd-l-rem1">打包</span>
								</template>
							</p>
							<p class="tc-99" v-if="!$isEmpty(item.garnish_ids)">
								<svg class="wh-1rem fi-99 va-m"><use xlink:href="#icon_peicai1"></use></svg>
								<span>{{item.garnish_ids | toGarnishName}}</span>
							</p>
							<p class="tc-99" v-if="!$isEmpty(item.goods_remarks)">
								<svg class="wh-1rem fi-99 va-t"><use xlink:href="#icon_beizhu1"></use></svg>
								<span>{{item.goods_remarks | toGoodsRemark}}</span>
							</p>
							<counter-goods
								:goods-count="item.goods_count" 
								:goods-index="index"
								:counter-title="item.total_price"
								@change="counterChange"></counter-goods>
						</div>
					</div>
				</li>
				<li class="ps-s po-b-0 bg-ff">
					<div class="pd-rem5 ta-c">本店铺暂不支持打包</div>
				</li>
			</ul>
		</div>
	</transition>
</template>

<script>
	import constVars from '@/apis/const'
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import counterGoods from './counter'
	
	export default {
		name: "goodsChoose",
		data(){
			return {
				chooseList: [], //已选择的菜品
				cartGoodsCount: 0,
				cartTotalPrice: "0.00",
				cartAddingTimerID: 0,
				numberofDining: 1, //用餐人数
				isShowChoose: false //是否显示已点
			}
		},
		filters:{
			toSpecName(sid){
				return getSpecName(sid) || `S${sid}?`;
			},
			toTasteName(tid){
				return getTasteName(tid) || `T${tid}?`;
			},
			toGarnishName(gids){
				let output = "";
				for(let gid in gids){
					let gname = getGarnishName(gid) || `G${gid}?`;
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
		components:{ counterGoods },
		methods:{
			showList(){
				if(!this.chooseList.length){
					this.isShowChoose = false;
				} else {
					this.isShowChoose = !this.isShowChoose;
				}
			},
			getSrc(url){
				if(url){
					return (constVars.OSS_IMG_PATH + url + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "/image/foods_icon.png";
				}
			},
			recalcPrice(){//重新计算某些数据
				let sum1 = 0;
				let sum2 = 0;
				let obj0 = {};
				let key0 = ""; 
				
				for(let item of this.chooseList){
					sum1 += item.goods_count;
					sum2 = accAdd(sum2, item.total_price);
					key0 = (item.cate_key + item.goods_key);
					
					if(!obj0[item.cate_key]){
						obj0[item.cate_key] = item.goods_count;
					} else {
						obj0[item.cate_key] += item.goods_count;
					}
					
					if(!obj0[key0]){
						obj0[key0] = item.goods_count;
					} else {
						obj0[key0] += item.goods_count;
					}
				}
				
				this.cartGoodsCount = sum1;
				this.cartTotalPrice = toFixed2(sum2);
				
				if(this.cartGoodsCount === 0){
					this.isShowChoose = false;
				}
				//console.log(obj0);
				obj0.total_price = this.cartTotalPrice;
				obj0.total_count = this.cartGoodsCount;

				this.$emit("change", obj0);
			},
			checkGoods(ukey){//判断菜品是否已被添加过了
				for(let nth in this.chooseList){
					if(this.chooseList[nth].unique_key === ukey){
						return nth;
					}
				}
				return -1;
			},
			findGoods(gid){
				for(let nth in this.chooseList){
					if(this.chooseList[nth].goods_id === gid){
						return nth;
					}
				}
				return -1;
			},
			changeCount(nth, isAdds){
				if(isAdds === 2){//清空
					this.chooseList.splice(0);//清空
				} else {
					let temp = this.chooseList[nth];
					if(isAdds === 1 || isAdds === 3){
						temp.goods_count++;
						temp.total_price = toFixed2(accMul(temp.unit_price, temp.goods_count));
					} else {
						if(temp.goods_count > 1){
							temp.goods_count--;
							temp.total_price = toFixed2(accMul(temp.unit_price, temp.goods_count));
						} else {//删除某个菜品
							this.chooseList.splice(nth, 1);
						}
					}
				}
				if(isAdds < 3){
					this.recalcPrice();
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
					this.chooseList.push(ginfos);
				} else {
					$mine.changeCount(existsIndex, 3);
				}
				
				$mine.cartAddingTimerID = setTimeout($mine.recalcPrice, 500);
			},
			reduceGoods(gid){//减少菜品数量
				let existsIndex = this.findGoods(gid);
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