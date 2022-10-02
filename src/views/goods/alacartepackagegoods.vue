<template>
	<transition name="packagegoods-slideup">
		<div v-if="goodsInfo" class="packagegoods-box-container" data-close="true" @click="closeMe1($event)">
			<div class="pd-lr-rem5" @scroll="boxScroll($event)">
				<div class="fx-r pd-tb-1rem">
					<goods-image :pic-src="goodsInfo.goods_thumb"></goods-image>
					<div class="fx-g1 pd-l-rem5">
						<p class="fw-b fx-r">
							<span class="fx-g1 fs-1rem">{{goodsInfo.goods_name}}</span>
							<a class="pd-lr-rem5" @click="showMe()"><svg class="wh-rem8 fi-99"><use xlink:href="#icon_close1"></use></svg></a>
						</p>
						<p class="tc-mc fs-1rem fw-b">{{goodsInfo.total_price}}</p>
					</div>
				</div>
				<div class="fx-hc">
					<span class="fw-b fx-g1">数量</span>
					<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
					<span class="ta-c wi-1rem5">{{selectedCount}}</span>
					<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia1"></use></svg></a>
				</div>
				<div v-if="goodsInfo.spec_list" class="mg-t-1rem">
					<p class="fw-b">规格</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.spec_list" class="packagegoods-gkp-item" 
							@click="selectGkp(vxo, ixo, 1)"
							:key="vxo.id"
							:class="{bigger: !vxo.is_soldout && vxo.goods_price == 0, checked: ixo === goodsInfo.spec_index}">
							<span>{{vxo.spec_id | toSpecName}}</span>
							<br>
							<span v-if="vxo.is_soldout" class="tc-99">已售罄</span>
							<span v-else-if="vxo.goods_price > 0" class="tc-mc">{{vxo.goods_price}}</span>
						</a>
					</p>
				</div>
				<div v-if="goodsInfo.taste_list" class="mg-t-1rem">
					<p class="fw-b">口味</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.taste_list" class="packagegoods-gkp-item" 
							@click="selectGkp(vxo, ixo, 2)"
							:key="vxo.id"
							:class="{bigger: !vxo.is_soldout && vxo.goods_price == 0, checked: ixo === goodsInfo.taste_index}">
							<span>{{vxo.taste_id | toTasteName}}</span>
							<br>
							<span v-if="vxo.is_soldout" class="tc-99">已售罄</span>
							<span v-else-if="vxo.goods_price > 0" class="tc-mc">+{{vxo.goods_price}}</span>
						</a>
					</p>
				</div>
				<div v-if="goodsInfo.garnish_list" class="mg-t-1rem">
					<p class="fw-b">配菜<span class="pd-l-rem5 tc-99" v-if="garnishLimit">(最多 {{garnishLimit}} 份)</span></p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.garnish_list" class="packagegoods-gkp-item"
							@click="selectGkp(vxo, ixo, 3)"
							:key="vxo.id"
							:class="{checked: !!vxo.garnish_count, editing: ixo === garnishIndex}">
							<span>{{vxo.garnish_id | toGarnishName}}</span>
							<br>
							<span v-if="vxo.is_soldout" class="tc-99">已售罄</span>
							<template v-else >
								<span class="tc-mc">+{{vxo.goods_price}}</span>
								<b v-if="vxo.garnish_count > 1" class="packagegoods-mul-sign">{{vxo.garnish_count}}</b>
								<span v-else-if="vxo.maxcount==1" class="pd-l-rem25 tc-mc">(限1份)</span>
							</template>
						</a>
					</p>
				</div>
				<div v-if="!goodsInfo.is_multiple_choice" class="hi-4rem"><!--占位用--></div>
				<div class="ps-s po-b-0 fx-r fx-jb bg-ff pd-tb-1rem">
					<button class="wi-col-5 btnbox bg-f0 tc-mc" @click="onDone(0)">取消</button>
					<button class="wi-col-5 btnbox bg-mcff" @click="onDone(1)">确定</button>
				</div>
			</div>
			<div class="packagegoods-top-bar">
				<b>{{goodsInfo.goods_name}}</b>
				<a class="dp-ib pd-lr-1rem pd-tb-rem5 ps-a po-tr-0" @click="closeMe2($event)"><svg class="wh-rem8 fi-99"><use xlink:href="#icon_close1"></use></svg></a>
			</div>
			<garnish-counts ref="garnishCountsBox" @confirm="garnishConfirm"></garnish-counts>
		</div>
	</transition>
</template>

<script>
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import goodsImage from '@/components/GoodsImage'
	import garnishCounts from './garnishcounts'
	
	/* 套餐里的菜品选择框 */
	export default {
		name: "goodsAlacartePackageGoods",
		data(){
			return {
				goodsInfo: null,
				selectedCount: 0,
				limitCount: 0, //菜品最大可选数量
				garnishLimit: 0,
				garnishIndex: -1,
				packageCateIndex: -1
			}
		},
		filters:{
			toSpecName(sid){
				return getSpecName(sid) || `[S${sid}]`;
			},
			toTasteName(tid){
				return getTasteName(tid) || `[T${tid}]`;
			},
			toGarnishName(gid){
				return getGarnishName(gid) || `[G${gid}]`;
			}
		},
		components:{goodsImage,garnishCounts},
		methods:{
			showMe(ginfos, counts, pci){
				if(ginfos){
					if(!ginfos.has_inited){
						let tprice = ginfos.goods_price;
						
						if(this.$isEmpty(ginfos.spec_list)){
							ginfos.spec_list = null;
							ginfos.spec_index = -1;
						} else {
							ginfos.spec_index = 0;
							tprice = ginfos.spec_list[0].goods_price;
						}
						
						if(this.$isEmpty(ginfos.taste_list)){
							ginfos.taste_list = null;
							ginfos.taste_index = -1;
						} else {
							ginfos.taste_index = 0;
							tprice = toFixed2(accAdd(tprice, ginfos.taste_list[0].goods_price));
						}
						
						if(this.$isEmpty(ginfos.garnish_list)){
							ginfos.garnish_list = null;
						}
						
						ginfos.has_inited = true; //已被初始化过了，不必再次初始化
						ginfos.total_price = tprice;
						ginfos.garnish_sel_count = (ginfos.garnish_sel_count || 0);//已选配菜数量
					}
					
					this.selectedCount = (ginfos.selected_count || 1);//默认选择数量：1
					this.limitCount = (counts + ginfos.selected_count); //需要加上已选数量！
					this.garnishIndex = -1;
					this.garnishLimit = (+ginfos.garnish_max_count || 0);//配菜最大可选数量
					this.packageCateIndex = pci;//用于回传给父组件
					this.goodsInfo = ginfos;
				} else {
					this.goodsInfo = null;
				}
			},
			closeMe1(evt){
				let elem = (evt.target || evt.srcElement);
				if(elem.getAttribute("data-close") === "true"){
					this.showMe();
				}
			},
			closeMe2(evt){
				let elem = (evt.currentTarget);
				$(elem).parent().hide();
				this.showMe();
			},
			selectGkp(argx, arg0, arg1){//选择规格、口味、配菜
				if(argx.is_soldout){
					return !yhoToast("已售罄，请选择其他项");
				}
				
				if(arg1 === 1){//规格
					this.goodsInfo.spec_index = arg0;
				} else if(arg1 === 2){//口味
					this.goodsInfo.taste_index = arg0;
				} else if(arg1 === 3){//配菜
					if(!argx.garnish_count){//没有数量
						if(this.garnishLimit && this.goodsInfo.garnish_sel_count >= this.garnishLimit){
							return !yhoToast(`最多 ${this.garnishLimit} 份`);
						} else {
							this.$set(argx, "garnish_count", 1);
						}
					} else if(argx.maxcount == 1){//最大可选数量为1，不用弹出对话框
						argx.garnish_count = 0;
					} else {//弹出对话框
						this.garnishIndex = arg0;
						return !this.$refs.garnishCountsBox.showMe(argx, window.event.currentTarget, this.garnishLimit, this.goodsInfo.garnish_sel_count);
					}
				}
				this.recalcPrice();
			},
			garnishConfirm(arg0){
				if(arg0 >= 0){
					this.recalcPrice();
				}
				this.garnishIndex = -1;
			},
			changeCount(isAdded){//点菜数量
				if(isAdded){
					if(this.selectedCount >= this.limitCount){
						return !yhoToast("已达到最大可选数量");
					} else {
						this.selectedCount++;
					}
				} else if(this.selectedCount > 1){
					this.selectedCount--;
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
				
				if(this.selectedCount > 1){
					pp = accMul(pp, this.selectedCount);
				}
				
				if(gg.garnish_list){
					let cc = 0;
					for(let temp of gg.garnish_list){
						if(temp.garnish_count){
							pp += accMul(temp.goods_price, temp.garnish_count);
							cc += temp.garnish_count;
						}
					}
					this.goodsInfo.garnish_sel_count = cc;
				}
				
				gg.total_price = toFixed2(pp);
			},
			onDone(type){
				let cc = (type === 0 ? 0 : this.selectedCount);
				
				if(cc){
					this.getGkpInfos();
				}
				
				this.goodsInfo.selected_count = cc;
				
				this.$emit("confirm", {
					pcIndex: this.packageCateIndex, //套餐分类索引
					itemID: this.goodsInfo.id,
					sgCount: cc //选择的菜品数量
				});
				
				this.showMe();
			},
			boxScroll(evt){
				var elem = evt.currentTarget;
				var $firstBox = $(elem).next(".packagegoods-top-bar");
				var boxHei = $firstBox.innerHeight();
				var sTop = elem.scrollTop;
				
				if(sTop === 0){
					$firstBox.hide();
				}else if(sTop <= boxHei){
					$firstBox.css({
						display: "block",
						opacity: 0
					});
				} else if($firstBox[0].style.opacity != 1){
					$firstBox.css({
						display: "block",
						opacity: 1
					});
				}
			},
			getGkpInfos(){
				var oo = this.goodsInfo;
				var ss = [];
				
				if(oo.spec_index >= 0){
					ss.push(getSpecName(oo.spec_list[oo.spec_index].spec_id));
				}
				
				if(oo.taste_index >= 0){
					ss.push(getTasteName(oo.taste_list[oo.taste_index].taste_id));
				}
				
				if(oo.garnish_sel_count > 0){
					for(let temp of oo.garnish_list){
						if(temp.garnish_count){
							ss.push(getGarnishName(temp.garnish_id));
							break; //只需要获得简短的信息就行，不需要获取完整的信息
						}
					}
				}
				
				oo.gkp_infos = ss.join(" ");
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$maskBoxBgColor: rgba(0,0,0,0.6);
	
	.packagegoods-box-container{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
		touch-action: manipulation;
		background-color: $maskBoxBgColor;
		> div:first-child{
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 1;
			width: 100%;
			max-height: 90%;
			overflow: auto;
			transition: inherit;
			border-radius: 1rem 1rem 0 0;
			background-color: #fff;
		}
	}
	.packagegoods-gkp-item{
		display: inline-block;
		padding: 0.2rem 1rem;
		margin:0.5rem 0.5rem 0 0;
		border:1px solid #dfdfdf;
		background-color: #f3f3f3;
		border-radius: 0.4rem;
		color: #333;
		text-align: center;
		vertical-align: top;
		min-width: 5rem;
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
	.packagegoods-mul-sign{
		padding-left:0.25rem;
		&:before{
			content: "x";
			font-size: 0.6rem;
			font-weight: normal;
		}
	}
	.packagegoods-top-bar{
		display: none;
		position: fixed;
		top: 10%;
		left: 0;
		z-index: 2;
		width: 100%;
		padding: 0.5rem 0;
		text-align: center;
		background-color: #fff;
		transition: opacity 0.75s;
		opacity: 0;
		border-radius: 1rem 1rem 0 0;
	}
	/* 向上滑出动画 */
	.packagegoods-slideup-enter{
		background-color: rgba(0,0,0,0);
		> div { 
			transform: translateY(100%) 
		}
	}
	.packagegoods-slideup-enter-active{ transition: all 0.4s }
	.packagegoods-slideup-enter-to{
		background-color: $maskBoxBgColor;
		> div { 
			transform: translateY(0) 
		}
	}
	.packagegoods-slideup-leave{
		background-color: $maskBoxBgColor;
		> div { 
			transform: translateY(0) 
		}
	}
	.packagegoods-slideup-leave-active{ transition: all 0.4s }
	.packagegoods-slideup-leave-to{
		background-color: rgba(0,0,0,0);
		> div { 
			transform: translateY(100%) 
		}
	}
</style>