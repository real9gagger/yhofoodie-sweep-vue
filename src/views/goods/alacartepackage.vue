<template>
	<div v-if="packageInfo">
		<div class="fx-hc hi-3rem bg-f6 pd-lr-rem5">
			<back-button class="fx-g1 tc-66"></back-button>
			<span class="fx-g6 ta-c">套餐选菜</span>
			<a v-if="viewMode === 2" class="fx-g1 ta-r" @click="getBoxWidth(1)">
				<svg class="wh-1rem fi-66"><use xlink:href="#icon_listmode"></use></svg>
			</a>
			<a v-else-if="viewMode === 1" class="fx-g1 ta-r" @click="getBoxWidth(2)">
				<svg class="wh-1rem fi-66"><use xlink:href="#icon_flowmode"></use></svg>
			</a>
		</div>
		<div class="ps-s po-t-n1 bg-ff fx-r pd-rem5">
			<goods-image :pic-src="packageInfo.goods_thumb" box-size="small"></goods-image>
			<div class="fx-g1 pd-l-rem5">
				<p class="fw-b fs-1rem">{{packageInfo.goods_name}}</p>
				<p>
					<svg class="wh-rem8 fi-99 va-tt"><use xlink:href="#icon_taocan2"></use></svg>
					<span class="tc-99 pd-l-rem1">套餐</span>
				</p>
				<p class="fx-hc" @click="gotoDesc()">
					<b class="tc-mc fs-1rem">{{packageInfo.total_price}}</b>
					<span class="fx-g1 ta-r tc-cc">计价方式&nbsp;</span>
					<svg class="wh-1em fi-cc"><use xlink:href="#icon_wenhao1"></use></svg>
				</p>
			</div>
		</div>
		<div class="fx-hc pd-rem5 tp-f0">
			<span class="fw-b fx-g1">数量</span>
			<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
			<span class="ta-c wi-1rem5">{{packageInfo.package_count}}</span>
			<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia2"></use></svg></a>
		</div>
		<div v-if="isAllowPackaging" class="fx-hc pd-tb-rem5 pd-l-rem5 pd-r-1rem tp-f0">
			<b class="fx-g1">打包</b>
			<span v-if="packChargePrice" class="pd-r-1rem tc-aa">(打包附加费 <i :class="{'tc-mc': isPack}">+{{packChargePrice | roundTwoDecimal}}</i>)</span>
			<mu-switch v-model="isPack" @change="switcherChange"></mu-switch>
		</div>
		<template v-if="viewMode === 1">
			<div v-for="vxo,ixo in packageInfo.package_cate_list" :key="vxo.id" class="pd-tb-rem5 pd-l-rem5">
				<h4>
					<span>{{vxo.cate_name}}</span>
					<span v-if="vxo.is_fix_goods==1" class="pd-l-rem5 tc-99">固定 {{vxo.count}} 份</span>
					<span v-else-if="vxo.count > 0" class="pd-l-rem5 tc-99">{{vxo.goods_list.length}} 选 {{vxo.count}}</span>
				</h4>
				<ul>
					<li v-for="subitem,subindex in vxo.goods_list" :key="subitem.id" :style="goodsBoxWidth" class="package-goods-item">
						<div class="fx-r listmode" :class="{checked: !!subitem.selected_count}" @click="selectGoods(ixo, subindex)">
							<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name" :is-deleted="subitem.is_deleted" class="wh-4rem" box-size="none"></goods-image>
							<div class="pd-lr-rem25 fx-g1 hi-4rem">
								<p class="package-goods-title">{{subitem.goods_name}}</p>
								<p v-if="subitem.gkp_infos" class="fs-rem6 tc-99 of-lc1">{{subitem.gkp_infos}}...</p>
								<p>
									<span v-if="subitem.total_price != 0" class="tc-mc pd-r-rem25">+{{subitem.total_price}}</span>
									<b v-if="subitem.selected_count > 1" class="package-mul-sign tc-mc">{{subitem.selected_count}}</b>
									<b v-else-if="subitem.count > 1" class="package-mul-sign tc-99">{{subitem.count}}</b>
								</p>
							</div>
							<div v-if="subitem.is_deleted" class="package-goods-deleted">已失效</div>
							<div v-else-if="subitem.is_soldout" class="package-goods-deleted">已售罄</div>
							<div v-else-if="subitem.is_multiple_choice" class="package-goods-limit">多规格</div>
						</div>
					</li>
				</ul>
			</div>
		</template>
		<template v-else-if="viewMode === 2">
			<div v-for="vxo,ixo in packageInfo.package_cate_list" :key="vxo.id" class="pd-t-rem5 pd-l-rem5">
				<h4>{{vxo.cate_name}}<span v-if="vxo.count > 0" class="pd-l-rem5 tc-99">{{vxo.goods_list.length}} 选 {{vxo.count}}</span></h4>
				<ul>
					<li v-for="nth in goodsBoxCols" :style="goodsBoxWidth" :key="nth" class="package-goods-item">
						<template v-for="subitem,subindex in vxo.goods_list">
							<div v-if="isInCols(nth, subindex)" class="tablemode" :key="subitem.id" :class="{checked: !!subitem.selected_count}" @click="selectGoods(ixo, subindex)">
								<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name" :is-deleted="subitem.is_deleted" box-size="fill"></goods-image>
								<div class="pd-rem5">
									<p>{{subitem.goods_name}}</p>
									<p v-if="subitem.gkp_infos" class="fs-rem6 tc-99 of-lc1">{{subitem.gkp_infos}}...</p>
									<p>
										<span v-if="subitem.total_price != 0" class="tc-mc pd-r-rem25">+{{subitem.total_price}}</span>
										<b v-if="subitem.selected_count > 1" class="package-mul-sign tc-mc">{{subitem.selected_count}}</b>
										<b v-else-if="subitem.count > 1" class="package-mul-sign tc-99">{{subitem.count}}</b>
									</p>
								</div>
								<div v-if="subitem.is_deleted" class="package-goods-deleted">已失效</div>
								<div v-else-if="subitem.is_soldout" class="package-goods-deleted">已售罄</div>
								<div v-else-if="subitem.is_multiple_choice" class="package-goods-limit">多规格</div>
							</div>
						</template>
					</li>
				</ul>
			</div>
		</template>
		<div class="pd-rem5">
			<p class="fw-b">备注</p>
			<p>
				<a class="package-beizhu-box" 
					@click="addBeizhu()" 
					:class="{checked: !!textInputerValue}"
				><svg class="wh-1em fi-66"><use xlink:href="#icon_edit1"></use></svg>&nbsp;{{textInputerValue || "自定义备注"}}</a>
			</p>
		</div>
		<div class="ps-s po-b-0 ta-c bg-ff pd-tb-rem5">
			<div class="wi-col-10 btnbox bg-mcff" @click="addtoCart">加入购物车</div>
		</div>
		<package-goods ref="packageGoodsBox" @confirm="goodsConfirm"></package-goods>
	</div>
</template>

<script>
	import yhoStore from '@/utils/yhostore'
	import { mapGetters } from 'vuex'
	import { getGoodsObject } from '@/apis/goods'
	import { getGoodsPackCharge, getShopSetting } from '@/apis/shop_data'
	import goodsImage from '@/components/GoodsImage'
	import backButton from '@/components/BackButton'
	import packageGoods from './alacartepackagegoods'
	
	/* 套餐点菜框 */
	export default {
		name: "goodsAlacartePackage",
		data(){
			return {
				packageInfo: null,
				isPack: false,
				packChargePrice: 0, //打包附加费金额
				goodsBoxWidth: "",
				goodsBoxCols: 1, //大图模式时，一行有多少列
				appScrollTop: 0,
				viewMode: 0, //0-没有菜品，1-列表模式，2-大图模式
				isSubmiting: false,//是否正在提交，避免连续点击导致重复提交数据
				isAllowPackaging: (getShopSetting("is_can_takeway") == 1) //是否允许打包
			}
		},
		computed: {
			...mapGetters(["textInputerValue"])
		},
		mounted() {
			this.getBoxWidth(1);
			this.initData(yhoStore.onceObject("selected_goods_infos"));
		},
		deactivated(){//保存上次滚动到的地方
			this.appScrollTop = $("#yhoapp").scrollTop() || 0;
		},
		activated(){
			if(this.appScrollTop){
				//返回上次滚动到的地方，等页面切换动画执行完后再滚动
				setTimeout(function(sTop){ $("#yhoapp").scrollTop(sTop) }, 500, this.appScrollTop);
			}
		},
		filters: {
			roundTwoDecimal(num){//保留两位小数
				return toFixed2(num);
			}
		},
		components: {goodsImage,backButton,packageGoods},
		methods:{
			initData(pinfos){//初始化套餐数据...
				if(pinfos){
					let fgCount = 0;
					
					if(this.$isEmpty(pinfos.package_cate_list)){
						this.viewMode = 0;
					} else {
						$.each(pinfos.package_cate_list, function(idx, item){
							let isFG = false;
							if(item.is_fix_goods == 1){
								isFG = true;
								fgCount++;
							}
							for(let subitem of item.goods_list){
								let gobj = getGoodsObject(subitem.goods_id);
								if(gobj){
									subitem.goods_name = gobj.goods_name;
									subitem.goods_thumb = gobj.goods_thumb;
								} else {
									subitem.goods_name = `[G${subitem.goods_id}]`;
									subitem.is_deleted = true; //菜品已被删除
								}
								//初始化一些必要的数据【重要】
								subitem.gkp_infos = "";
								subitem.selected_count = (isFG ? +subitem.count : 0); //如果分类是固定菜品，默认选择菜品的可选数量
								subitem.spec_index = -1;
								subitem.taste_index = -1;
								subitem.total_price = subitem.goods_price;
								subitem.is_multiple_choice = !!(subitem.spec_list.length || subitem.taste_list.length || subitem.garnish_list.length);
							}
						});
					}
					
					pinfos.total_price = pinfos.goods_price;
					pinfos.package_count = 1;
					this.packChargePrice = getGoodsPackCharge(pinfos.goods_price, pinfos.pack_charge, pinfos.pack_charge_type);
					this.packageInfo = pinfos;
					this.isPack = false;
					this.isSubmiting = false;
					this.$store.commit("resetTextInputerValue");//清空备注输入
					
					if(fgCount){//如果有固定菜品，则重新计算总价
						this.recalcPrice();
					}
				} else {
					this.packageInfo = null;
				}
			},
			gotoDesc(){//转到说明
				this.$router.push("/helpdesc");
			},
			changeCount(isAdded){//点菜数量
				if(isAdded){
					this.packageInfo.package_count++;
				} else if(this.packageInfo.package_count > 1){
					this.packageInfo.package_count--;
				}
				this.recalcPrice();
			},
			recalcPrice(){
				var totalPrice = +this.packageInfo.goods_price;
				
				$.each(this.packageInfo.package_cate_list, function(idx, pcobj){
					for(let gobj of pcobj.goods_list){
						if(gobj.selected_count && gobj.total_price != 0){
							totalPrice = accAdd(totalPrice, gobj.total_price);
						}
					}
				});
				
				if(this.isPack && this.packChargePrice){//加上打包附加费
					totalPrice = accAdd(totalPrice, this.packChargePrice);
				}
				
				this.packageInfo.unit_price = totalPrice; //套餐单价，整型，非字符串
				
				if(this.packageInfo.package_count > 1){
					totalPrice = accMul(totalPrice, this.packageInfo.package_count);
				}
				
				this.packageInfo.total_price = toFixed2(totalPrice);
			},
			addBeizhu(){
				this.$router.push({
					path: "/inputer",
					query: {
						title: "自定义备注",
						value: this.textInputerValue
					}
				});
			},
			selectGoods(pindex, gindex){
				let pcobj = this.packageInfo.package_cate_list[pindex];
				let ginfos = pcobj.goods_list[gindex];
				let maxcount = (+pcobj.count || 1);
				
				if(ginfos.is_deleted){//菜品已失效
					return !yhoToast("菜品已失效，请选择其他菜品");
				} else if(ginfos.is_soldout){
					return !yhoToast("菜品已售罄，请选择其他菜品");
				}
				
				if(maxcount <= 1){//多选一
					if(ginfos.is_multiple_choice){
						return this.$refs.packageGoodsBox.showMe(ginfos, 0, pindex);
					} else if(!ginfos.selected_count){
						for(let gobj of pcobj.goods_list){
							gobj.selected_count = 0;
						}
						ginfos.selected_count = 1;
					}
				} else {//多选多
					let sycount = maxcount;//这个分类剩余可选数量
					for(let gobj of pcobj.goods_list){
						sycount -= gobj.selected_count;
					}

					if(!ginfos.selected_count){
						if(sycount <= 0){
							return !yhoToast(`最多 ${maxcount} 份`);
						} else if(ginfos.is_multiple_choice){//弹出数量、规格、口味、配菜选项框
							return this.$refs.packageGoodsBox.showMe(ginfos, sycount, pindex);
						} else {//非多选菜品，首次点击时选择剩余可选数量！
							//ginfos.selected_count = (sycount > 0 ? Math.min(sycount, ginfos.count) : 0);
							//ginfos.selected_count = (sycount >= ginfos.count ? (+ginfos.count || 1) : 0);
							ginfos.selected_count = Math.min(sycount, ginfos.count);
						}
					} else {//已选择了数量，弹出数量加减框
						return this.$refs.packageGoodsBox.showMe(ginfos, sycount, pindex);
					}
				}
				
				this.recalcPrice();
			},
			goodsConfirm(arg0){
				let pcobj = this.packageInfo.package_cate_list[arg0.pcIndex];
				if(pcobj.count == 1 && arg0.sgCount > 0){
					for(let gobj of pcobj.goods_list){
						if(gobj.selected_count && gobj.id !== arg0.itemID){
							gobj.selected_count = 0; //如果最大可选数量是1时，则取消已选的菜品
						}
					}
				}
				this.recalcPrice();
			},
			getBoxWidth(typecode){
				let ww = window.innerWidth;
				if(typecode === 1){
					if(ww <= 400){ 		this.goodsBoxWidth = "width:100%"; } //每行1列
					else if(ww <= 800){ this.goodsBoxWidth = "width:50%"; } //每行2列
					else if(ww <= 1200){this.goodsBoxWidth = "width:33.33333333%"; } //每行3列
					else if(ww <= 1600){this.goodsBoxWidth = "width:25%"; } //每行4列
					else{ 				this.goodsBoxWidth = "width:20%"; }//每行5列
				} else {
					this.goodsBoxCols = Math.floor(Math.min(ww, 1280) / 120); //最多10列
					this.goodsBoxWidth = ("width:" + (100 / this.goodsBoxCols).toFixed(6) + "%");
				}
				this.viewMode = typecode;
			},
			isInCols(idx0, idx1){//是否在这一列中
				return ((idx1 % this.goodsBoxCols + 1) === idx0);
			},
			formatPackage(pinfos){//格式化套餐数据，用于提交给后台
				let keyString = (pinfos.cate_key + pinfos.goods_key);
				let newPackage = {
					"cart_id": newCartID(),
					"goods_id": pinfos.id,
					"goods_name": pinfos.goods_name,
					"goods_thumb": pinfos.goods_thumb,
					"goods_count": pinfos.package_count || 1,
					"total_price": pinfos.total_price || pinfos.goods_price,
					"unit_price": pinfos.unit_price, //套餐原价
					"cate_key": pinfos.cate_key,
					"goods_key": pinfos.goods_key,
					"is_package_goods": 1, //0-非套餐，1-套餐
					"package_cate_list": null,
					"package_goods_list": null,
					"unique_key": "", //用来判断当前菜品是否已经添加过了
					"goods_remarks": {}, //备注
					"is_pack": this.isPack //是否打包
				};
				let packageCatesList = [];
				let packageGoodsList = [];
				
				$.each(this.packageInfo.package_cate_list, function(idx, pcobj){
					for(let gobj of pcobj.goods_list){
						if(gobj.selected_count){
							let sid = 0;
							let tid = 0;
							let gids = {};
							
							if(gobj.spec_index >= 0){
								sid = gobj.spec_list[gobj.spec_index].spec_id;
							}
							if(gobj.taste_index >= 0){
								tid = gobj.taste_list[gobj.taste_index].taste_id;
							}
							if(gobj.garnish_sel_count > 0){
								for(let temp of gobj.garnish_list){
									if(temp.garnish_count){
										gids[temp.garnish_id] = temp.garnish_count;
									}
								}
							}
							
							packageGoodsList.push({
								"cate_id":		pcobj.id,
								"item_id":		gobj.id,
								"goods_id": 	gobj.goods_id,
								"goods_name": 	gobj.goods_name,
								"goods_count": 	gobj.selected_count,
								"total_price": 	gobj.total_price,
								"spec_id": 		sid, //规格
								"taste_id": 	tid, //口味
								"garnish_ids": 	gids, //配菜
							});
						}
					}
					packageCatesList.push({"id": pcobj.id, "name": pcobj.cate_name});
				});
				
				keyString += `ct${newPackage.cart_id}`; //让key保持唯一性
				
				if(this.textInputerValue){//用户自定义备注
					newPackage.goods_remarks["B0000"] = this.textInputerValue; //键名英文字母开头，以便让自定义备注排在最后
				}
				
				newPackage.unique_key = keyString;
				newPackage.package_cate_list = packageCatesList;
				newPackage.package_goods_list = packageGoodsList;
				
				return newPackage;
			},
			addtoCart(){//加入购物车
				if(!this.isSubmiting){//避免连续点击导致重复提交数据
					this.isSubmiting = true;
					
					let newPackage = this.formatPackage(this.packageInfo);
					this.$store.commit("addGoodsToCart", newPackage);
					this.$store.commit("recalcTotalPrice"); //重新计算总价
					yhoToast("已加入购物车");
					this.$router.back();
				}
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
	.package-goods-title{
		display: -webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	.package-goods-limit{
		position:absolute;
		top: 0;
		left: 0;
		z-index: 0;
		font-size: 0.6rem;
		color: #fff;
		background-color: $appMainColor;
		border-bottom-right-radius: 0.3rem;
		padding: 0 0.4rem;
	}
	.package-mul-sign{
		&:before{
			content: "x";
			font-size: 0.6rem;
			font-weight: normal;
		}
	}
	.package-goods-deleted{
		position:absolute;
		top: 0;
		left: 0;
		z-index: 0;
		font-size: 0.6rem;
		color: #666;
		background-color: #ccc;
		border-bottom-right-radius: 0.3rem;
		padding: 0 0.4rem;
	}
	.package-goods-item{
		display: inline-block;
		padding: 0.5rem 0.5rem 0 0;
		vertical-align: top;
		width: 50%;
		> div.listmode {
			border: 1px solid #ddd;
			border-radius: 0.3rem;
			background-color: #f3f3f3;
			overflow: hidden;
			position: relative;
			&.checked{
				border-color: $appMainColor;
				background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
			}
		}
		> div.tablemode {
			border: 1px solid #ddd;
			border-radius: 0.3rem;
			background-color: #f3f3f3;
			margin-bottom: 0.5rem;
			overflow: hidden;
			position: relative;
			&.checked{
				border-color: $appMainColor;
				background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
			}
		}
	}
	.package-beizhu-box{
		display: inline-block;
		margin-top: 0.5rem;
		border: 1px solid #ddd;
		vertical-align: top;
		padding: 0.8rem;
		background-color: #f3f3f3;
		color: #333;
		border-radius: 0.3rem;
		&.checked{
			border-color: $appMainColor;
			background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
		}
	}
</style>