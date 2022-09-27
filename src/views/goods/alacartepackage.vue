<template>
	<div v-if="packageInfo">
		<div class="ps-s fx-hc hi-3rem bg-f6 pd-lr-rem5">
			<back-button class="fx-g1 tc-66"></back-button>
			<span class="fx-g3 ta-c">{{packageInfo.goods_name}}</span>
			<span class="fx-g1"></span>
		</div>
		<div>
			<div class="fx-r pd-rem5">
				<goods-image :pic-src="packageInfo.goods_thumb"></goods-image>
				<div class="fx-g1 pd-l-rem5">
					<p class="fw-b fs-1rem">{{packageInfo.goods_name}}</p>
					<p class="fx-hc" @click="gotoDesc()">
						<b class="tc-mc fs-1rem">{{packageInfo.total_price}}</b>
						<span class="fx-g1 ta-r tc-cc">计价方式</span>
						<svg class="wh-1em fi-cc mg-l-rem2"><use xlink:href="#icon_wenhao1"></use></svg>
					</p>
				</div>
			</div>
			<div class="fx-hc pd-rem5 tp-f0">
				<span class="fw-b fx-g1">数量</span>
				<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
				<span class="ta-c wi-1rem5">{{packageInfo.package_count}}</span>
				<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia2"></use></svg></a>
			</div>
			<div class="fx-hc pd-tb-rem5 pd-l-rem5 pd-r-1rem tp-f0">
				<b class="fx-g1">打包</b>
				<mu-switch v-model="isPack"></mu-switch>
			</div>
			<template v-if="packageInfo.package_cate_list">
				<div v-for="vxo,ixo in packageInfo.package_cate_list" :key="vxo.id" class="pd-tb-rem5 pd-l-rem5">
					<h4>{{vxo.cate_name}}<span v-if="vxo.count > 0" class="pd-l-rem5 tc-99">{{vxo.goods_list.length}} 选 {{vxo.count}}</span></h4>
					<ul>
						<li v-for="subitem,subindex in vxo.goods_list" :key="subitem.id" :style="goodsBoxWidth" class="package-goods-item">
							<div class="fx-r" :class="{checked: !!subitem.selected_count}" @click="selectGoods(ixo, subindex)">
								<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name" box-size="small"></goods-image>
								<div class="pd-lr-rem25 fx-g1">
									<p class="package-goods-title">{{subitem.goods_name}}</p>
									<p>
										<span v-if="subitem.goods_price != 0" class="tc-mc">+{{subitem.goods_price}}</span>
										<b v-if="subitem.selected_count > 1" class="package-mul-sign tc-mc">{{subitem.selected_count}}</b>
										<b v-else-if="subitem.count > 1" class="package-mul-sign tc-99">{{subitem.count}}</b>
									</p>
								</div>
								<div v-if="subitem.is_deleted" class="package-goods-deleted">已失效</div>
								<div v-else-if="subitem.is_multiple_choice" class="package-goods-limit">多规格</div>
							</div>
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
		</div>
		<package-goods ref="packageGoodsBox" @confirm="goodsConfirm"></package-goods>
	</div>
</template>

<script>
	import yhoStore from '@/utils/yhostore'
	import { mapGetters } from 'vuex'
	import { getGoodsObject } from '@/apis/goods'
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
				goodsBoxWidth: ""
			}
		},
		computed: {
			...mapGetters(["textInputerValue"])
		},
		mounted() {
			let ww = window.innerWidth;
			if(ww < 360){
				this.goodsBoxWidth = "width:100%"; //每行1列
			} else if(ww < 720){
				this.goodsBoxWidth = "width:50%"; //每行2列
			} else if(ww < 1080){
				this.goodsBoxWidth = "width:33.33333333%"; //每行3列
			} else if(ww < 1440){
				this.goodsBoxWidth = "width:25%"; //每行4列
			} else{
				this.goodsBoxWidth = "width:20%"; //每行5列
			}
			this.initData(yhoStore.onceObject("selected_goods_infos"));
		},
		components: {goodsImage,backButton,packageGoods},
		methods:{
			initData(pinfos){//初始化套餐数据...
				if(pinfos){					
					if(this.$isEmpty(pinfos.package_cate_list)){
						pinfos.package_cate_list = null;
					} else {
						$.each(pinfos.package_cate_list, function(idx, item){
							for(let subitem of item.goods_list){
								let gobj = getGoodsObject(subitem.goods_id);
								if(gobj){
									subitem.goods_name = gobj.goods_name;
									subitem.goods_thumb = gobj.goods_thumb;
								} else {
									subitem.goods_name = `[G${subitem.goods_id}]`;
									subitem.is_deleted = true; //菜品已被删除
								}
								subitem.selected_count = 0;
								subitem.spec_index = -1;
								subitem.taste_index = -1;
								subitem.is_multiple_choice = !!(subitem.spec_list.length || subitem.taste_list.length || subitem.garnish_list.length);
							}
						});
					}
					
					pinfos.total_price = pinfos.goods_price;
					pinfos.package_count = 1;
					
					this.packageInfo = pinfos;
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
					
					if(ginfos.selected_count || ginfos.is_multiple_choice){//弹出数量、规格、口味、配菜选项框
						return this.$refs.packageGoodsBox.showMe(ginfos, sycount, pindex);
					} else {
						if(sycount <= 0){
							return !yhoToast(`最多 ${maxcount} 份`);
						} else {
							//ginfos.selected_count = (sycount > 0 ? Math.min(sycount, ginfos.count) : 0);
							//ginfos.selected_count = (sycount >= ginfos.count ? (+ginfos.count || 1) : 0);
							ginfos.selected_count = Math.min(sycount, ginfos.count);
						}
					}
				}
				
				this.recalcPrice();
			},
			goodsConfirm(arg0){
				let pcobj = this.packageInfo.package_cate_list[arg0.pcIndex];
				if(pcobj.count == 1 && arg0.sgCount > 0){
					for(let gobj of pcobj.goods_list){
						gobj.selected_count = 0; //如果最大可选数量是1时，则取消已选的菜品
					}
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
		border-bottom-right-radius: 0.5rem;
		padding: 0 0.3rem;
	}
	.package-mul-sign{
		padding-left:0.25rem;
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
		border-bottom-right-radius: 0.5rem;
		padding: 0 0.3rem;
		
		/* display:inline-block;
		font-size: 0.6rem;
		color: $appMainColor;
		border: 1px solid $appMainColor;
		border-radius: 0.2rem;
		padding: 0 0.3rem; */
	}
	.package-goods-item{
		display: inline-block;
		padding: 0.5rem 0.5rem 0 0;
		vertical-align: top;
		width: 50%;
		> div {
			border: 1px solid #dfdfdf;
			border-radius: 0.5rem;
			background-color: #f3f3f3;
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
		border: 1px solid #dfdfdf;
		vertical-align: top;
		padding: 0.8rem;
		background-color: #f3f3f3;
		color: #333;
		border-radius: 0.4rem;
		&.checked{
			border-color: $appMainColor;
			background-color: rgba($mainColorR, $mainColorG, $mainColorB, 0.2);
		}
	}
</style>