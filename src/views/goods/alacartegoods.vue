<template>
	<transition name="alacarte-slideup">
		<div v-if="goodsInfo" class="alacarte-goods-container fx-c">
			<h4 class="fx-g1" @click="showMe()"><!--占位专用--></h4>
			<ul id="alacarteUlBox">
				<li class="ps-s bg-ff pd-t-1rem pd-b-rem5 pd-lr-rem5">
					<div class="fx-r">
						<div @click="gotoDetails($event)"><img :src="getSrc(goodsInfo.goods_thumb)" class="wh-5rem br-rem5 bg-f0"/></div>
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
								<svg class="wh-rem8 fi-99 va-m"><use xlink:href="#icon_peicai1"></use></svg>
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
								<span class="fx-g1 ta-r tc-cc">计价方式</span>
								<svg class="wh-1em fi-cc mg-l-rem2"><use xlink:href="#icon_wenhao1"></use></svg>
							</p>
						</div>
					</div>
				</li>
				<li class="pd-rem5">
					<div class="fx-hc">
						<span class="fw-b fx-g1">数量</span>
						<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
						<span class="ta-c wi-1rem5">{{goodsInfo.goods_count}}</span>
						<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia1"></use></svg></a>
					</div>
				</li>
				<li class="pd-rem5">
					<div class="fx-hc pd-r-rem5">
						<b class="fx-g1">打包</b>
						<mu-switch v-model="isPack"></mu-switch>
					</div>
				</li>
				<li v-if="goodsInfo.spec_list" class="pd-rem5">
					<p class="fw-b">规格</p>
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
				<li v-if="goodsInfo.taste_list" class="pd-rem5">
					<p class="fw-b">口味</p>
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
				<li v-if="goodsInfo.garnish_list" class="pd-rem5">
					<p class="fw-b">配菜<span class="pd-l-rem5 tc-99" v-if="garnishLimit">(最多 {{garnishLimit}} 份)</span></p>
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
				<li v-if="goodsInfo.beizhu_list" class="pd-rem5">
					<p class="fw-b">备注<span class="pd-l-rem5 tc-99">带*为必选</span></p>
					<p style="padding-left:1px">
						<template v-for="item,index in goodsInfo.beizhu_list">
							<a v-for="subitem,subindex in item.list"
								class="alacarte-beizhu-box"
								@click="selectGbz(index, subindex)" :key="subitem.id"
								:class="{isfirst: subindex===0, islast: subindex===item.lastIndex, checked: subindex===item.selectIndex}"
							>{{subitem.name}}</a>
						</template>
						<a class="alacarte-beizhu-box isfirst islast" 
							@click="selectGbz(-1, -1)" :class="{checked: !!textInputerValue}"
						><svg class="wh-1em fi-66"><use xlink:href="#icon_edit1"></use></svg>&nbsp;{{textInputerValue || "自定义备注"}}</a>
					</p>
				</li>
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
	import yhoStore from '@/utils/yhostore'
	import { mapGetters } from 'vuex'
	import { getSpecName, getTasteName, getGarnishName } from '@/apis/goods'
	import { getShopDatas, getRemarkInfo } from '@/apis/shop_data'
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
				beizhuCount: 0,
				ulScrollTop: 0,
				isPack: false //是否打包
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
		computed: {
			...mapGetters(["textInputerValue"])
		},
		components: { garnishCounts },
		mounted() {
			//var $mine = this;
			getShopDatas();
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
								robj.selectIndex = -1;
								newer.beizhu_list.push(robj);
							}
						}
					}
					
					this.garnishLimit = (+newer.garnish_max_count || 0);
					this.goodsInfo = newer;
				} else {
					this.resetData();
					this.$emit("confirm", null);
				}
			},
			getSrc(url){
				if(url){
					return (constVars.OSS_IMG_PATH + url + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "/image/foods_icon.png";
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
				let newGoods = this.formatGoods(this.goodsInfo);
				this.resetData();
				this.$emit("confirm", newGoods);
			},
			resetData(){
				this.goodsInfo = null;
				this.garnishCount = 0;
				this.garnishLimit = 0;
				this.garnishIndex = -1;
				this.beizhuCount = 0;
				this.ulScrollTop = 0;
				this.isPack = false;
				this.$store.commit("resetTextInputerValue");//清空备注输入
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
					"is_package_goods": 0, //0-非套餐，1-套餐
					"goods_price": "", //规格+口味 总价
					"spec_id": 0, //规格
					"taste_id": 0, //口味
					"garnish_ids": {}, //配菜
					"unit_price": "", //规格+口味+配菜 总价
					"unique_key": "", //用来判断当前菜品是否已经添加过了
					"goods_remarks": {}, //备注
					"is_pack": this.isPack //是否打包
				};
				let garnishTotalPrice = 0;//配菜总价
				
				if(ginfos.spec_index >= 0){//用户选的规格
					newGoods.spec_id = ginfos.spec_list[ginfos.spec_index].spec_id;
					goodsPrice = ginfos.spec_list[ginfos.spec_index].goods_price;
					keyString += `s${newGoods.spec_id}`;
				}
				
				if(ginfos.taste_index >= 0){//用户选的口味
					newGoods.taste_id = ginfos.taste_list[ginfos.taste_index].taste_id;
					goodsPrice = toFixed2(accAdd(goodsPrice, ginfos.taste_list[ginfos.taste_index].goods_price));
					keyString += `t${newGoods.taste_id}`;
				}
				
				if(ginfos.garnish_list){//用户选的配菜
					for(let gobj of ginfos.garnish_list){
						if(gobj.garnish_count){
							newGoods.garnish_ids[gobj.garnish_id] = gobj.garnish_count;
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
				
				if(ginfos.beizhu_list){//用户选择的备注
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
				
				newGoods.goods_price = goodsPrice;
				newGoods.unit_price = accAdd(goodsPrice, garnishTotalPrice);
				newGoods.unique_key = keyString;
				console.log(newGoods)
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
	.alacarte-beizhu-box{
		display: inline-block;
		margin-top: 0.5rem;
		margin-left: -1px;
		border: 1px solid #dfdfdf;
		vertical-align: top;
		padding: 0.8rem;
		background-color: #f3f3f3;
		color: #333;
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