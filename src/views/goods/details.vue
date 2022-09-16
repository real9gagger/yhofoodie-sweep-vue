<template>
	<div v-if="goodsInfo" class="hi-min-s bg-f0 of-a ps-r" id="detailsWrapBox">
		<div class="details-goods-pic" v-if="goodsInfo.goods_thumb">
			<img class="wi-f bg-sz-fit" :style="goodsPicStyle" :src="ossImagePath + goodsInfo.goods_thumb" />
		</div>
		<div class="details-box-content">
			<div class="details-box-item">
				<p class="fw-b mg-t-rem3 fs-1rem">{{goodsInfo.goods_name}}</p>
				<p class="fx-hc mg-t-rem3 fs-12px" v-if="goodsInfo.sn">
					<svg class="details-svg-icon1"><use xlink:href="#icon_sn"></use></svg>
					<span class="tc-66">{{goodsInfo.sn}}</span>
				</p>
				<p class="fx-hc tc-99 mg-t-rem3 fs-12px" v-if="hasTags">
					<template v-if="goodsInfo.is_hot == 1">
						<svg class="details-svg-icon2"><use xlink:href="#icon_rexiao"></use></svg>
						<span class="pd-r-rem5">热销</span>
					</template>
					<template v-if="goodsInfo.is_top == 1">
						<svg class="details-svg-icon2"><use xlink:href="#icon_tuijian"></use></svg>
						<span class="pd-r-rem5">推荐</span>
					</template>
					<template v-if="goodsInfo.is_package_goods">
						<svg class="details-svg-icon2"><use xlink:href="#icon_taocan"></use></svg>
						<span class="pd-r-rem5">套餐</span>
					</template>
					<template v-if="goodsInfo.sales != 0">
						<svg class="details-svg-icon2"><use xlink:href="#icon_xiaoliang"></use></svg>
						<span>销量 {{goodsInfo.sales}}</span>
					</template>
				</p>
				<p class="tc-mc mg-t-rem5 fx-hc">
					<span class="fs-12px">RM&nbsp;</span>
					<b class="fs-1rem2">{{goodsInfo.goods_price}}</b>
					<span class="fs-12px" v-if="goodsInfo.goods_unit">&nbsp;/ {{goodsInfo.goods_unit}}</span>
					<span class="fx-g1"><!--占位--></span>
					<a class="pd-lr-rem5"><svg class="details-svg-icon3"><use xlink:href="#icon_jia2"></use></svg></a>
				</p>
			</div>
			<div class="details-box-item">
				<p class="fw-b">商品详情</p>
				<p class="fx-r mg-t-rem5 tc-66">
					<span class="fx-g1">菜谱</span>
					<span class="fx-g3 pd-l-rem5">{{goodsInfo.cookbook_id}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66">
					<span class="fx-g1">分类</span>
					<span class="fx-g3 pd-l-rem5">{{cateName}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.food_tag_type && goodsInfo.food_tag_type.length">
					<span class="fx-g1">标签</span>
					<span class="fx-g3 pd-l-rem5">
						<template v-for="tagCode,tagIndex in goodsInfo.food_tag_type">
							<img class="details-food-tag" :key="tagCode" :src="`/image/food_tag${tagCode}.png`"/>
							<span class="pd-r-rem5" :key="tagIndex + 99">{{getFoodTagName(tagCode)}}</span>
						</template>
					</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.pack_charge_type != 0">
					<span class="fx-g1">打包附加费</span>
					<span class="fx-g3 pd-l-rem5">{{getPackFeeDesc(goodsInfo)}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.spec_list && goodsInfo.spec_list.length">
					<span class="fx-g1">规格</span>
					<span class="fx-g3 pd-l-rem5">{{getSpecNames(goodsInfo.spec_list)}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.taste_list && goodsInfo.taste_list.length">
					<span class="fx-g1">口味</span>
					<span class="fx-g3 pd-l-rem5">{{getTasteNames(goodsInfo.taste_list)}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="saleableTimeRange">
					<span class="fx-g1">可售时间</span>
					<span class="fx-g3 pd-l-rem5">{{saleableTimeRange}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.tax_type != 0">
					<span class="fx-g1">税费</span>
					<span class="fx-g3 pd-l-rem5">{{getTaxTypeDesc(goodsInfo.tax_type)}}</span>
				</p>
				<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.goods_taste">
					<span class="fx-g1">其他</span>
					<span class="fx-g3 pd-l-rem5">{{goodsInfo.goods_taste}}</span>
				</p>
			</div>
			<div class="details-box-item" v-if="goodsInfo.goods_material">
				<p class="fw-b">商品描述</p>
				<p class="ws-w mg-t-rem5 tc-66" v-html="goodsInfo.goods_material">{{goodsInfo.goods_material}}</p>
			</div>
			<div class="details-box-item" v-if="recommendList && recommendList.length">
				<p class="fs-1rem fw-b tc-00">推荐</p>
				<ul class="details-recommend-ul fl-c">
					<li v-for="item in recommendList" v-if="item.goods_thumb" :key="item.id" class="fl-l wi-col-6">
						<div class="wh-same-wi">
							<img class="ps-a po-tl-0 wh-f bd-f0" loading="lazy" style="border-radius:0.5rem" :src="ossImagePath + item.goods_thumb + ossImageSizeForList" />
						</div>
						<div class="mg-t-rem5"><b>{{item.goods_name}}</b></div>
						<div class="mg-t-rem3"><b class="tc-mc">{{item.goods_price}}</b></div>
					</li>
				</ul>
			</div>
		</div>
		<bottom-line class="mg-lr-rem5">•</bottom-line>
	</div>
	<div v-else class="ta-c pd-t-4rem">
		<p><svg style="fill:#ccc;width:15rem;"><use xlink:href="#icon_nodata"></use></svg></p>
		<p class="fs-1rem tc-aa mg-t-rem5">菜品数据已丢失</p>
		<p class="tc-aa mg-t-1rem"><span class="tc-mc">{{remainingSeconds}}</span> 秒后返回上一页</p>
	</div>
</template>

<script>
	import constVars from '@/config/const'
	import yhoStore from '@/utils/store'
	import bottomLine from '@/components/BottomLine'
	import { getCateName, getSpecName, getTasteName, getSaleableTimeRange, getRecommendGoods } from '@/config/goods'

	export default {
		name: "orderDetails",
		data(){
			return {
				ossImagePath: constVars.OSS_IMG_PATH,
				ossImageSizeForList: constVars.OSS_IMG_SIZE_FOR_LIST,
				goodsInfo: null,
				cateName: "",
				saleableTimeRange: "",
				recommendList: null,
				picDefHeight: 0,
				remainingSeconds: 5,
				remainingTimerID: 0
			}
		},
		components: {
			bottomLine
		},
		computed: {
			hasTags(){
				if(this.goodsInfo){
					return (
						this.goodsInfo.is_hot == 1 || 
						this.goodsInfo.is_top == 1 || 
						this.goodsInfo.is_package_goods || 
						this.goodsInfo.sales != 0
					);
				}
				return false;
			},
			goodsPicStyle(){
				if(this.goodsInfo){
					let picHei = this.picDefHeight;
					let picBgi = this.ossImagePath + this.goodsInfo.goods_thumb + this.ossImageSizeForList;
					return (`min-height:${picHei}px;background-image:url("${picBgi}")`);
				} else {
					return "";
				}
			}
		},
		beforeDestroy(){
			if(this.remainingTimerID){
				clearInterval(this.remainingTimerID);
			}
		},
		mounted() {
			var $mine = this;
			var params = $mine.$route.query;
			
			$mine.goodsInfo = yhoStore.onceObject("selected_goods_infos");
			
			if($mine.goodsInfo && $mine.goodsInfo.id === params.gid){
				$mine.cateName = getCateName($mine.goodsInfo.goods_cate_id, params.cname);
				$mine.saleableTimeRange = getSaleableTimeRange($mine.goodsInfo);
				$mine.picDefHeight = Math.floor(window.innerWidth * params.ratio - 0.5); //减去一个调整值
				$mine.recommendList = getRecommendGoods($mine.goodsInfo.goods_cate_id);
			} else {
				$mine.goodsInfo = null;
				$mine.remainingTimerID = setInterval(function(){
					if(--$mine.remainingSeconds <= 0){
						clearInterval($mine.remainingTimerID);
						$mine.$router.back();
					}
				}, 1000);
			}
		},
		methods:{
			getFoodTagName(tagCode){
				switch(tagCode){
					case "1": return "酸";
					case "2": return "甜";
					case "3": return "辣";
					case "4": return "素";
					case "5": return "荤";
					default: return "";
				}
			},
			getSpecNames(slist){
				let sids = slist.map(item => item.spec_id);
				return getSpecName(sids, " / ");
			},
			getTasteNames(tlist){
				let tids = tlist.map(item => item.taste_id);
				return getTasteName(tids, " / ");
			},
			getPackFeeDesc(ginfos){
				if (ginfos.pack_charge_type==2) { //优先取菜品设置的打包附加费====指定金额
				    return ("RM " + ginfos.pack_charge + " / 份");
				} else if(ginfos.pack_charge_type==1) { //优先取菜品设置的打包附加费====指定巴仙
					return ("RM " + toFixed2((ginfos.pack_charge / 100) * ginfos.goods_price) + " / 份");
				} else {
					return "-";
				}
			},
			getTaxTypeDesc(taxtype){
				if(taxtype == 1){//不收取服务费
				    return "免服务费";
				} else if(taxtype == 2){//不收取销售税
					return "免销售税";
				} else if(taxtype == 3){//不收取服务费和销售税
					return "免服务费和销售税";
				}
				return "-";
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.details-goods-pic{
		z-index: 0;
	}
	
	.details-box-content{
		position: relative;
		top: 0;
		left: 0;
		z-index: 9;
		overflow: auto;
	}
	
	.details-box-item{
		position: relative;
		margin: 0.5rem;
		padding: 0.5rem;
		background-color: #fff;
		border-radius: 0.5rem;
	}
	
	.details-svg-icon1{
		width: 1.5em;
		height: 1.5em;
		margin-right: 5px;
		fill: #666;
	}
	
	.details-svg-icon2{
		width: 1em;
		height: 1em;
		margin-right: 5px;
		fill: $appMainColor;
	}
	
	.details-svg-icon3{
		display: inline-block;
		width: 1.6rem;
		height: 1.6rem;
		fill: $appMainColor;
	}
	
	.details-food-tag{
		width: 20px;
		height: 20px;
		margin-right: 2px;
	}
	
	.details-recommend-ul{
		margin-top: 0.5rem;
		> li{
			&:nth-child(2n){
				padding-left: 0.3rem;
				padding-bottom: 0.5rem;
			}
			&:nth-child(2n + 1){
				padding-right: 0.3rem;
				padding-bottom: 0.5rem;
			}
		}
	}
</style>