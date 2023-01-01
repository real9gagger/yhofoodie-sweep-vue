<template>
	<transition name="alacarte-slideup">
		<div v-if="goodsInfo" class="alacarte-goods-container fx-c">
			<h4 class="fx-g1" @click="showMe()"><!--占位专用--></h4>
			<ul id="alacarteUlBox">
				<li class="ps-s bg-ff pd-t-1rem pd-b-rem5 pd-lr-rem5">
					<div class="fx-r">
						<goods-image :pic-src="goodsInfo.goods_thumb" @click.native="gotoDetails($event)"></goods-image>
						<div class="fx-g1 pd-l-rem5">
							<p class="fw-b fx-r">
								<span class="fx-g1 fs-1rem">{{goodsInfo.goods_name}}</span>
								<a class="pd-lr-rem5" @click="showMe()"><svg class="alacarte-close-icon"><use xlink:href="#icon_close1"></use></svg></a>
							</p>
							<p class="tc-66 fs-rem7">
								<span v-if="goodsInfo.spec_index >= 0" class="pd-r-rem5">{{goodsInfo.spec_list[goodsInfo.spec_index].spec_id | toSpecName}}</span>
								<span v-if="goodsInfo.taste_index >= 0" class="pd-r-rem5">{{goodsInfo.taste_list[goodsInfo.taste_index].taste_id | toTasteName}}</span>
								<template v-if="isPack">
									<svg class="wh-rem8 fi-mc va-tt"><use xlink:href="#icon_dabao1"></use></svg>
									<span class="tc-mc pd-l-rem1">打包</span>
								</template>
							</p>
							<p class="tc-66 fs-rem7" v-if="garnishCount">
								<svg class="wh-rem8 fi-99"><use xlink:href="#icon_peicai1"></use></svg>
								<template v-for="vvv in goodsInfo.garnish_list">
									<template v-if="vvv.garnish_count > 1">{{vvv.garnish_id | toGarnishName}} x{{vvv.garnish_count}},</template>
									<template v-else-if="vvv.garnish_count === 1">{{vvv.garnish_id | toGarnishName}},</template>
								</template>
							</p>
							<p class="tc-66 fs-rem7" v-if="beizhuCount > 0 || textInputerValue">
								<svg class="wh-rem8 fi-99 va-tt"><use xlink:href="#icon_beizhu1"></use></svg>
								<template v-for="vvv in goodsInfo.beizhu_list">
									<template v-if="vvv.selectIndex >= 0">{{vvv.list[vvv.selectIndex].name}},</template>
								</template>{{textInputerValue}}
							</p>
							<p class="fx-hc" @click="gotoDesc()">
								<b class="tc-mc fs-1rem">{{goodsInfo.total_price}}</b>
								<span class="fx-g1 ta-r tc-cc">计价方式&nbsp;</span>
								<svg class="wh-1em fi-cc"><use xlink:href="#icon_wenhao1"></use></svg>
							</p>
						</div>
					</div>
				</li>
				<li class="pd-rem5 tp-f0">
					<div class="fx-hc">
						<span class="fw-b fx-g1">数量</span>
						<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
						<span class="ta-c wi-1rem5">{{goodsInfo.goods_count}}</span>
						<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia1"></use></svg></a>
					</div>
				</li>
				<li v-if="isAllowPackaging" class="pd-rem5 tp-f0">
					<div class="fx-hc pd-r-rem5">
						<b class="fx-g1">打包</b>
						<span v-if="packChargePrice" class="pd-r-1rem tc-aa">(打包附加费 <i :class="{'tc-mc': isPack}">+{{packChargePrice | roundTwoDecimal}}</i>)</span>
						<mu-switch v-model="isPack" @change="switcherChange"></mu-switch>
					</div>
				</li>
				<li v-if="goodsInfo.spec_list" class="pd-rem5">
					<p class="fw-b">规格</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.spec_list" class="alacarte-goods-subitem" 
							@click="selectGkp(vxo, ixo, 1)"
							:key="vxo.spec_id"
							:class="{checked: ixo === goodsInfo.spec_index}">
							<span>{{vxo.spec_id | toSpecName}}</span>
							<span v-if="vxo.is_soldout" class="dp-bk tc-99">已售罄</span>
							<span v-else class="tc-mc dp-bk">{{vxo.goods_price}}</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.taste_list" class="pd-rem5">
					<p class="fw-b">口味</p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.taste_list" class="alacarte-goods-subitem" 
							@click="selectGkp(vxo, ixo, 2)"
							:key="vxo.taste_id"
							:class="{bigger: !vxo.is_soldout && vxo.goods_price == 0 , checked: ixo === goodsInfo.taste_index}">
							<span>{{vxo.taste_id | toTasteName}}</span>
							<span v-if="vxo.is_soldout" class="dp-bk tc-99">已售罄</span>
							<span v-else-if="vxo.goods_price != 0" class="tc-mc dp-bk">+{{vxo.goods_price}}</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.garnish_list" class="pd-rem5">
					<p class="fw-b">配菜<span class="pd-l-rem5 tc-99" v-if="garnishLimit">(最多 {{garnishLimit}} 份)</span></p>
					<p>
						<a v-for="vxo,ixo in goodsInfo.garnish_list" class="alacarte-goods-subitem"
							@click="selectGkp(vxo, ixo, 3)"
							:key="vxo.garnish_id"
							:class="{checked: !!vxo.garnish_count, editing: ixo === garnishIndex}">
							<span>{{vxo.garnish_id | toGarnishName}}</span>
							<span v-if="vxo.is_soldout" class="dp-bk tc-99">已售罄</span>
							<span v-else class="dp-bk">
								<span class="tc-mc">+{{vxo.goods_price}}</span>
								<b v-if="vxo.garnish_count > 1" class="alacarte-mul-sign">{{vxo.garnish_count}}</b>
								<span v-else-if="vxo.maxcount==1" class="pd-l-rem25 tc-mc">(限1份)</span>
							</span>
						</a>
					</p>
				</li>
				<li v-if="goodsInfo.beizhu_list" class="pd-rem5">
					<p class="fw-b">备注<span v-if="goodsInfo.beizhu_list.length" class="pd-l-rem5 tc-99">带*为必选</span></p>
					<p style="padding-left:1px">
						<template v-for="item,index in goodsInfo.beizhu_list">
							<a v-for="subitem,subindex in item.list"
								class="alacarte-beizhu-box"
								@click="selectGbz(index, subindex)"
                                :key="subitem.id"
								:class="{
                                    isfirst: subindex===0,
                                    islast: subindex===item.lastIndex,
                                    checked: subindex===item.selectIndex,
                                }"><span v-if="subindex===0" class="bzgroupbox">{{item.name}}<em v-if="item.isRequired" class="tc-red">*</em></span>{{subitem.name}}</a>
						</template>
						<a class="alacarte-beizhu-box isfirst islast" 
							@click="selectGbz(-1, -1)" 
                            :class="{checked: !!textInputerValue}"
						><svg class="wh-1em fi-66"><use xlink:href="#icon_edit1"></use></svg>&nbsp;{{textInputerValue || "自定义备注"}}</a>
					</p>
				</li>
				<li class="ps-s po-b-0 ta-c bg-ff pd-tb-1rem">
					<div class="wi-col-10 btnbox bg-mcff" @click="addtoCart">加入购物车</div>
				</li>
			</ul>
			<garnish-counts ref="garnishCountsBox" @confirm="garnishConfirm"></garnish-counts>
		</div>
	</transition>
</template>

<script>
	import yhoStore from '@/utils/yhostore'
	import { mapGetters } from 'vuex'
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import { getRemarkInfo, getGoodsPackCharge, getShopSetting } from '@/apis/shop_data'
	import garnishCounts from './garnishcounts'
	import goodsImage from '@/components/GoodsImage'
	
	/* 菜品点菜框 */
	export default {
		name: "goodsAlacarteGoods",
		data(){
			return {
				goodsInfo: null,
				garnishCount: 0,
				garnishLimit: 0,
				garnishIndex: -1,
				beizhuCount: 0,
				ulScrollTop: 0,
				packChargePrice: 0, //打包附加费金额
				isSubmiting: false, //避免连续点击导致重复提交数据
				isPack: false, //是否打包
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
			toGarnishName(gid){
				return getGarnishName(gid) || `[A${gid}]`;
			},
			roundTwoDecimal(num){//保留两位小数
				return toFixed2(num);
			}
		},
		computed: {
			...mapGetters(["textInputerValue"])
		},
		components: { garnishCounts, goodsImage },
		mounted() {
			//nothing to do
		},
		deactivated(){//保存上次滚动到的地方
			this.ulScrollTop = $("#alacarteUlBox").scrollTop() || 0;
		},
		activated(){
			if(this.ulScrollTop){
				this.$nextTick(function(){ //返回上次滚动到的地方
					$("#alacarteUlBox").scrollTop(this.ulScrollTop);
				});
			}
		},
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
					newer.beizhu_list = [];
					
					if(newer.remarks){//菜品可选备注
						for(let rid in newer.remarks){
							let robj = getRemarkInfo(rid);
							if(robj){
                                robj.isRequired = (newer.remarks[rid] == 1); //是否必选的备注
                                robj.selectIndex = -1;//(robj.isRequired ? 0 : -1); //如果是必选，则默认选择第一个
								newer.beizhu_list.push(robj);
							}
						}
					}
					
					this.garnishLimit = (+newer.garnish_max_count || 0);
					this.packChargePrice = getGoodsPackCharge(newer.goods_price, newer.pack_charge, newer.pack_charge_type);
					this.goodsInfo = newer;
				} else {
					this.resetData();
					this.$emit("confirm", null);
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
						if(this.garnishLimit && this.garnishCount >= this.garnishLimit){
							return !yhoToast(`最多 ${this.garnishLimit} 份`);
						} else {
							this.$set(argx, "garnish_count", 1);
						}
					} else if(argx.maxcount == 1){//最大可选数量为1，不用弹出对话框
						argx.garnish_count = 0;
					} else {//弹出对话框
						this.garnishIndex = arg0;
						return !this.$refs.garnishCountsBox.showMe(argx, window.event.currentTarget, this.garnishLimit, this.garnishCount);
					}
				}
				this.recalcPrice();
			},
			selectGbz(idx0, idx1){//选择 goods 备注
				if(idx0 === -1){
					this.$router.push({
						path: "/inputer",
						query: {
							title: "自定义备注",
							value: this.textInputerValue
						}
					});
					return;
				}
				
				let bzobj = this.goodsInfo.beizhu_list[idx0];
				if(bzobj.selectIndex === idx1){
					this.beizhuCount--;
					bzobj.selectIndex = -1;
				} else {
					this.beizhuCount += (bzobj.selectIndex === -1 ? 1 : 0);
					bzobj.selectIndex = idx1;
				}
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
				
				if(this.isPack && this.packChargePrice){//加上打包附加费
					pp = accAdd(pp, this.packChargePrice);
				}
				
				gg.unit_price = pp;//套餐单价，整型，非字符串
				
				if(gg.goods_count > 1){
					pp = accMul(pp, gg.goods_count);
				}
				
				gg.total_price = toFixed2(pp);
			},
			gotoDesc(){//转到说明
				this.$router.push("/helpdesc");
			},
			gotoDetails(evt){//查看菜品详情
				let imgWhRatio = 0;
				if(this.goodsInfo.goods_thumb){
					imgWhRatio = getImageHwRatio($(evt.currentTarget).children("img").get(0));
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
				if(!this.isSubmiting){
					this.isSubmiting = true; //避免连续点击导致重复提交数据
					
					let newGoods = this.formatGoods(this.goodsInfo);
					this.$emit("confirm", newGoods);
					this.resetData();
				}
			},
			resetData(){
				this.goodsInfo = null;
				this.garnishCount = 0;
				this.garnishLimit = 0;
				this.garnishIndex = -1;
				this.beizhuCount = 0;
				this.ulScrollTop = 0;
				this.isPack = false;
				this.isSubmiting = false;
				this.$store.commit("resetTextInputerValue");//清空备注输入
			},
			garnishConfirm(arg0){
				if(arg0 >= 0){
					this.recalcPrice();
				}
				this.garnishIndex = -1;
			},
			formatGoods(ginfos){//格式化菜品数据，用于提交给后台
				let keyString = (ginfos.cate_key + ginfos.goods_key);
				let newGoods = {
					"cart_id": newCartID(),
					"goods_id": ginfos.id,
					"goods_name": ginfos.goods_name,
					"goods_thumb": ginfos.goods_thumb,
					"goods_count": ginfos.goods_count || 1,
					"total_price": ginfos.total_price || ginfos.goods_price, //乘上数量后所得总价
					"unit_price": ginfos.unit_price, //规格+口味+配菜 总价。【单价，未乘以数量】
					"cate_key": ginfos.cate_key,
					"goods_key": ginfos.goods_key,
					"is_package_goods": 0, //0-非套餐，1-套餐
					"spec_id": 0, //规格
					"taste_id": 0, //口味
					"garnish_ids": {}, //配菜
					"unique_key": "", //用来判断当前菜品是否已经添加过了
					"goods_remarks": {}, //备注
					"is_pack": this.isPack //是否打包
				};
				
				if(ginfos.spec_index >= 0){//用户选的规格
					newGoods.spec_id = ginfos.spec_list[ginfos.spec_index].spec_id;
					keyString += `s${newGoods.spec_id}`;
				}
				
				if(ginfos.taste_index >= 0){//用户选的口味
					newGoods.taste_id = ginfos.taste_list[ginfos.taste_index].taste_id;
					keyString += `t${newGoods.taste_id}`;
				}
				
				if(this.garnishCount){//用户选的配菜
					for(let gobj of ginfos.garnish_list){
						if(gobj.garnish_count){
							newGoods.garnish_ids[gobj.garnish_id] = gobj.garnish_count;
							if(gobj.garnish_count > 1){
								keyString += `a${gobj.garnish_id}x${gobj.garnish_count}`;
							} else {
								keyString += `a${gobj.garnish_id}`;
							}
						}
					}
				}
				
				if(this.beizhuCount > 0){//用户选择的备注
					for(let bobj of ginfos.beizhu_list){
						if(bobj.selectIndex >= 0){
							let selbz = bobj.list[bobj.selectIndex];
							newGoods.goods_remarks[selbz.id] = selbz.name;
							keyString += `r${selbz.id}`;
						}
					}
				}
				
				if(this.textInputerValue){//用户自定义备注
					newGoods.goods_remarks["B0000"] = this.textInputerValue; //键名英文字母开头，以便让自定义备注排在最后
					keyString += `b${newGoods.cart_id}`; //如果有自定义备注，则让key保持唯一性
				}
				
				if(this.isPack){//是否打包
					keyString += "p1";
				}
				
				newGoods.unique_key = keyString;
				
				return newGoods;
			},
			switcherChange(){
				if(this.packChargePrice){
					this.recalcPrice();
				}
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
		border:1px solid #dfdfdf;
		background-color: #f3f3f3;
		border-radius: 0.4rem;
		color: #333;
		text-align: center;
		vertical-align: top;
		min-width: 5rem;
		&.bigger{
			padding: 0.8rem 1rem;
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
	.alacarte-beizhu-box{
		display: inline-block;
		margin-top: 1rem;
		margin-left: -1px;
		border: 1px solid #dfdfdf;
		vertical-align: top;
		padding: 0.8rem;
		background-color: #f3f3f3;
		color: #333;
        position: relative;
        > .bzgroupbox {
            position: absolute;
            left: 0.3rem;
            top: -0.6rem;
            z-index: 1;
            font-size: 0.6rem;
            padding: 0rem 0.4rem;
            background-color: #f3f3f3;
            border-radius: 1rem;
            border: 1px solid #dfdfdf;
        }
		&.isfirst{
			border-top-left-radius: 0.4rem;
			border-bottom-left-radius: 0.4rem;
		}
		&.islast{
			border-top-right-radius: 0.4rem;
			border-bottom-right-radius: 0.4rem;
			margin-right:0.5rem;
		}
		&.checked{
			position: relative;
			z-index: 1;
			border-color: $appMainColor;
			background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
		}
	}
	.alacarte-mul-sign{
		padding-left: 0.25rem;
		&:before{
			content: "x";
			font-size: 0.6rem;
			font-weight: normal;
		}
	}
	
	/* 向上滑出动画 */
	.alacarte-slideup-enter{ 
		background-color: rgba(0,0,0,0.0);
		> ul { transform: translateY(100%) }
	}
	.alacarte-slideup-enter-active{ transition: all 0.4s }
	.alacarte-slideup-enter-to{
		background-color: $maskBoxBgColor;
		> ul { transform: translateY(0) }
	}
	.alacarte-slideup-leave{ 
		background-color: $maskBoxBgColor;
		> ul { transform: translateY(0) }
	}
	.alacarte-slideup-leave-active{ transition: all 0.4s }
	.alacarte-slideup-leave-to{
		background-color: rgba(0,0,0,0.0);
		> ul { transform: translateY(100%) }
	}
</style>