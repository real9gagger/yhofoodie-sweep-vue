<template>
	<transition name="alacarte-slideup">
		<div v-if="goodsInfo" class="alacarte-goods-container fx-c">
			<h4 class="fx-g1" @click="showMe()"><!--占位专用--></h4>
			<ul>
				<li class="ps-s bg-ff pd-tb-1rem">
					<div class="fx-r">
						<div @click="gotoDetails($event)"><img :src="getSrc(goodsInfo.goods_thumb)" class="wh-5rem br-rem5 bg-f0"/></div>
						<div class="fx-g1 pd-l-rem5">
							<p class="fw-b fx-r">
								<span class="fx-g1 fs-1rem">{{goodsInfo.goods_name}}</span>
								<a class="pd-lr-rem5" @click="showMe()"><svg class="alacarte-close-icon"><use xlink:href="#icon_close1"></use></svg></a>
							</p>
							<p class="tc-66 fs-rem7">
								<span v-if="goodsInfo.spec_index >= 0" class="pd-r-rem5">{{goodsInfo.spec_list[goodsInfo.spec_index].spec_id | toSpecName}}</span>
								<span v-if="goodsInfo.taste_index >= 0">{{goodsInfo.taste_list[goodsInfo.taste_index].taste_id | toTasteName}}</span>
							</p>
							<p class="tc-66 fs-rem7" v-if="garnishCount">
								<template v-for="vvv in goodsInfo.garnish_list">
									<template v-if="vvv.garnish_count > 1">{{vvv.garnish_id | toGarnishName}} x{{vvv.garnish_count}},</template>
									<template v-else-if="vvv.garnish_count === 1">{{vvv.garnish_id | toGarnishName}},</template>
								</template>
							</p>
							<p class="fx-hc" @click="gotoDesc()">
								<b class="tc-mc fs-1rem">{{goodsInfo.total_price}}</b>
								<span class="fx-g1 ta-r tc-cc">计价方式</span>
								<svg class="wh-1em fi-cc mg-l-rem2"><use xlink:href="#icon_wenhao1"></use></svg>
							</p>
						</div>
					</div>
				</li>
				<li>
					<div class="fx-hc">
						<span class="fw-b fx-g1">数量</span>
						<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
						<span class="ta-c wi-1rem5">{{goodsInfo.goods_count}}</span>
						<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia1"></use></svg></a>
					</div>
				</li>
				<li class="pd-t-1rem pd-r-rem5">
					<div class="fx-hc">
						<b class="fx-g1">打包</b>
						<mu-switch v-model="isPack"></mu-switch>
					</div>
				</li>
				<li v-if="goodsInfo.spec_list">
					<p class="fw-b pd-t-1rem">规格</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.spec_list" class="alacarte-goods-subitem" 
							@click="selectGkp(ixo, 1)"
							:key="vxo.spec_id"
							:class="{checked: ixo === goodsInfo.spec_index}">
							<span>{{vxo.spec_id | toSpecName}}</span>
							<span class="tc-mc dp-bk">{{vxo.goods_price}}</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.taste_list">
					<p class="fw-b pd-t-1rem">口味</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.taste_list" class="alacarte-goods-subitem" 
							@click="selectGkp(ixo, 2)"
							:key="vxo.taste_id"
							:class="{bigger: vxo.goods_price == 0, checked: ixo === goodsInfo.taste_index}">
							<span>{{vxo.taste_id | toTasteName}}</span>
							<span class="tc-mc dp-bk">+{{vxo.goods_price}}</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.garnish_list">
					<p class="fw-b pd-t-1rem">配菜<span class="pd-l-rem5 tc-99" v-if="garnishLimit">(最多 {{garnishLimit}} 份)</span></p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.garnish_list" class="alacarte-goods-subitem"
							@click="selectGkp(ixo, 3)"
							:key="vxo.garnish_id"
							:class="{checked: !!vxo.garnish_count, editing: ixo === garnishIndex}">
							<span>{{vxo.garnish_id | toGarnishName}}</span>
							<span class="dp-bk">
								<span class="tc-mc">+{{vxo.goods_price}}</span>
								<template v-if="vxo.garnish_count > 1"><i class="fs-12px">&nbsp;x</i><b>{{vxo.garnish_count}}</b></template>
							</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.remarks"></li>
				<li class="ps-s po-b-0 ta-c bg-ff pd-tb-1rem">
					<div class="wi-col-10 btnbox bg-mc tc-ff" @click="addtoCart">加入购物车</div>
				</li>
			</ul>
			<garnish-counts ref="garnishCountsBox" @confirm="garnishConfirm"></garnish-counts>
		</div>
	</transition>
</template>

<script>
	import constVars from '@/apis/const'
	import yhoStore from '@/utils/store'
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import garnishCounts from './garnishcounts'
	
	/* 菜品点菜框 */
	export default {
		name: "goodsAlacarteGoods",
		data(){
			return {
				goodsInfo: null,
				garnishCount: 0,
				garnishLimit: 0,
				garnishIndex: -1,
				isPack: true //是否打包
			}
		},
		filters:{
			toSpecName(sid){
				return getSpecName(sid) || `S${sid}?`;
			},
			toTasteName(tid){
				return getTasteName(tid) || `T${tid}?`;
			},
			toGarnishName(gid){
				return getGarnishName(gid) || `G${gid}?`;
			}
		},
		components:{ garnishCounts },
		methods: {
			showMe(ginfos){//显示面板...
				if(ginfos){
					let newer = JSON.parse(JSON.stringify(ginfos)); //深度复制一份，防止污染原数据
					let tprice = newer.goods_price;
					
					if(this.$isEmpty(newer.spec_list)){
						newer.spec_list = null;
						newer.spec_index = -1;
					} else {
						newer.spec_index = 0
						tprice = newer.spec_list[0].goods_price;
					}
					
					if(this.$isEmpty(newer.taste_list)){
						newer.taste_list = null;
						newer.taste_index = -1;
					} else {
						newer.taste_index = 0;
						tprice = toFixed2(accAdd(tprice, newer.taste_list[0].goods_price));
					}
					
					if(this.$isEmpty(newer.garnish_list)){
						newer.garnish_list = null;
					}
					
					newer.total_price = tprice;
					newer.goods_count = 1;
					
					this.garnishLimit = (+newer.garnish_max_count || 0);
					this.goodsInfo = newer;
				} else {
					this.goodsInfo = null;
					this.$emit("confirm", null);
				}
			},
			getSrc(url){
				if(url){
					return (constVars.OSS_IMG_PATH + url + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "/image/foods_icon.png?ts=4444";
				}
			},
			changeCount(isAdded){//点菜数量
				if(isAdded){
					this.goodsInfo.goods_count++;
				} else if(this.goodsInfo.goods_count > 1){
					this.goodsInfo.goods_count--;
				}
				this.recalcPrice();
			},
			selectGkp(arg0, arg1){//选择规格、口味、配菜
				if(arg1 === 1){//规格
					this.goodsInfo.spec_index = arg0;
				} else if(arg1 === 2){//口味
					this.goodsInfo.taste_index = arg0;
				} else if(arg1 === 3){//配菜
					let temp = this.goodsInfo.garnish_list[arg0];
					if(!temp.garnish_count){//没有数量
						this.$set(temp, "garnish_count", 1);
					} else if(temp.maxcount == 1){//最大可选数量为1，不用弹出对话框
						temp.garnish_count = 0;
					} else {//弹出对话框
						this.garnishIndex = arg0;
						return !this.$refs.garnishCountsBox.showMe(temp, window.event.currentTarget, this.garnishLimit - this.garnishCount);
					}
				}
				this.recalcPrice();
			},
			recalcPrice(){//重新计算总价
				let gg = this.goodsInfo;
				let pp = 0;
				
				if(gg.spec_index >= 0){
					pp = accAdd(pp, gg.spec_list[gg.spec_index].goods_price);
				} else {
					pp = accAdd(pp, gg.goods_price);
				}
				
				if(gg.taste_index >= 0){
					pp = accAdd(pp, gg.taste_list[gg.taste_index].goods_price);
				}
				
				if(gg.goods_count > 1){
					pp = accMul(pp, gg.goods_count);
				}
				
				if(gg.garnish_list){
					let cc = 0;
					for(let temp of gg.garnish_list){
						if(temp.garnish_count){
							pp += accMul(temp.goods_price, temp.garnish_count);
							cc += temp.garnish_count;
						}
					}
					this.garnishCount = cc;
				}
				
				gg.total_price = toFixed2(pp);
			},
			gotoDesc(){//转到说明
				this.$router.push("/helpdesc");
			},
			gotoDetails(evt){//查看菜品详情
				let imgWhRatio = 0;
				if(this.goodsInfo.goods_thumb){
					let domImgBox = $(evt.currentTarget).children("img").get(0);
					if(!domImgBox.src.endsWith("LOADING_FAILED")){//不是加载失败的图片
						imgWhRatio = (domImgBox.naturalHeight / domImgBox.naturalWidth) || 0;
					}
				}
				
				yhoStore.onceObject("selected_goods_infos", this.goodsInfo); //选中的菜品信息
				this.$router.push({
					path: "/details",
					query: {
						gid: this.goodsInfo.id,
						ratio: imgWhRatio,
						cname: "其他"
					}
				});
			},
			addtoCart(){//加入购物车
				let newGoods = this.formatGoods(this.goodsInfo);
				this.goodsInfo = null;
				this.$emit("confirm", newGoods);
			},
			garnishConfirm(arg0){
				if(arg0 >= 0){
					this.recalcPrice();
				}
				this.garnishIndex = -1;
			},
			formatGoods(ginfos){
				let keyString = `g${ginfos.id}`;
				let goodsPrice = ginfos.goods_price;
				let newGoods = {
					"cart_id": newCartID(),
					"cate_id": ginfos.goods_cate_id,
					"goods_id": ginfos.id,
					"goods_name": ginfos.goods_name,
					"goods_thumb": ginfos.goods_thumb,
					"goods_count": ginfos.goods_count || 1,
					"total_price": ginfos.total_price || ginfos.goods_price,
					"cate_key": ginfos.cate_key,
					"goods_key": ginfos.goods_key,
					"is_package_goods": 0,
					"goods_price": "", //规格+口味 总价
					"spec_id": 0, //规格
					"taste_id": 0, //口味
					"garnish_ids": [], //配菜
					"garnish_total_price": "",//配菜 总价
					"unit_price": "",//规格+口味+配菜 总价
					"unique_key": "",//用来判断当前菜品是否已经添加过了
					"goods_remarks": "" //备注
				};
				let garnishTotalPrice = 0;
				
				if(ginfos.spec_index >= 0){
					newGoods.spec_id = ginfos.spec_list[ginfos.spec_index].spec_id;
					goodsPrice = ginfos.spec_list[ginfos.spec_index].goods_price;
					keyString += `s${newGoods.spec_id}`;
				}
				
				if(ginfos.taste_index >= 0){
					newGoods.taste_id = ginfos.taste_list[ginfos.taste_index].taste_id;
					goodsPrice = toFixed2(accAdd(goodsPrice, ginfos.taste_list[ginfos.taste_index].goods_price));
					keyString += `t${newGoods.taste_id}`;
				}
				
				if(ginfos.garnish_list && ginfos.garnish_list.length){
					for(let gobj of ginfos.garnish_list){
						if(gobj.garnish_count){
							newGoods.garnish_ids.push({
								"garnish_id": gobj.garnish_id,
								"garnish_price": gobj.goods_price,
								"garnish_count": gobj.garnish_count
							});
							if(gobj.garnish_count > 1){
								garnishTotalPrice = accAdd(garnishTotalPrice, accMul(gobj.goods_price, gobj.garnish_count));
								keyString += `a${gobj.garnish_id}x${gobj.garnish_count}`;
							} else {
								garnishTotalPrice = accAdd(garnishTotalPrice, gobj.goods_price);
								keyString += `a${gobj.garnish_id}`;
							}
						}
					}
				}
				
				newGoods.goods_price = goodsPrice;
				newGoods.unit_price = accAdd(goodsPrice, garnishTotalPrice);
				newGoods.garnish_total_price = garnishTotalPrice;
				newGoods.unique_key = keyString;
				
				return newGoods;
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$maskBoxBgColor: rgba(0,0,0,0.6);
	
	.alacarte-goods-container{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
		touch-action: manipulation;
		background-color: $maskBoxBgColor;
		> ul{
			max-height: 90%;
			overflow: auto;
			transition: inherit;
			position: relative;
			transform: translateY(0);
			border-radius: 1rem 1rem 0 0;
			background-color: #fff;
			padding: 0 0.5rem;
		}
	}
	
	.alacarte-close-icon{
		width:0.8rem;
		height:0.8rem;
		fill:#999;
		vertical-align: text-top;
	}
	
	.alacarte-goods-subitem{
		display: inline-block;
		padding: 0.2rem 1rem;
		margin:0.5rem 0.5rem 0 0;
		border:1px solid #f0f0f0;
		background-color: #f6f6f6;
		border-radius: 0.3rem;
		color: #333;
		text-align: center;
		vertical-align: top;
		min-width: 5rem;
		transition: all 0.3s;
		&.bigger{
			padding: 0.8rem 1rem;
			>.dp-bk{
				display: none !important;
			}
		}
		&.checked{
			border-color: $appMainColor;
			background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
		}
		&.editing{
			border-color:#f90;
			background-color: rgba(255, 153, 0, 0.2);
		}
	}
	
	/* 向上滑出动画 */
	.alacarte-slideup-enter{ 
		background-color: rgba(0,0,0,0.0);
		ul { transform: translateY(100%) }
	}
	.alacarte-slideup-enter-active{ transition: all 0.4s }
	.alacarte-slideup-enter-to{
		background-color: $maskBoxBgColor;
		ul { transform: translateY(0) }
	}
	.alacarte-slideup-leave{ 
		background-color: $maskBoxBgColor;
		ul { transform: translateY(0) }
	}
	.alacarte-slideup-leave-active{ transition: all 0.4s }
	.alacarte-slideup-leave-to{
		background-color: rgba(0,0,0,0.0);
		ul { transform: translateY(100%) }
	}
</style>