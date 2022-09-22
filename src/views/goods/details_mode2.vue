<template>
	<div v-if="goodsInfo" class="hi-s bg-f0 of-h ps-r" id="detailsWrapBox">
		<div class="details-goods-pic" v-if="goodsInfo.goods_thumb">
			<img class="wi-f" @load="onImgLoaded" :src="ossImagePath + goodsInfo.goods_thumb" />
		</div>
		<div class="swiper-wrapper">
			<div class="swiper-slide" :style="`height:calc(${imgHeight}px - 30vh)`"></div>
			<div class="swiper-slide" style="height:30vh"></div>
			<div class="details-box-content swiper-slide">
				<div class="details-box-item swipe-handler">
					<p class="ta-c lh-1x ps-a po-tl-0 wi-f">
						<svg class="details-svg-icon3"><use xlink:href="#icon_shouqi1"></use></svg>
						<svg class="details-svg-icon3"><use xlink:href="#icon_zhankai1"></use></svg>
					</p>
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
						<template v-if="goodsInfo.sales != 0">
							<svg class="details-svg-icon2"><use xlink:href="#icon_xiaoliang"></use></svg>
							<span>销量 {{goodsInfo.sales}}</span>
						</template>
					</p>
					<p class="tc-mc mg-t-rem5">
						<span class="fs-12px">RM </span>
						<b class="fs-1rem2">{{goodsInfo.goods_price}}</b>
						<span class="fs-12px" v-if="goodsInfo.goods_unit"> / {{goodsInfo.goods_unit}}</span>
					</p>
				</div>
				<div class="details-box-item swipe-handler">
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
						<span class="fx-g3 pd-l-rem5">{{getSpecNameString(goodsInfo.spec_list)}}</span>
					</p>
					<p class="fx-r mg-t-rem5 tc-66" v-if="goodsInfo.taste_list && goodsInfo.taste_list.length">
						<span class="fx-g1">口味</span>
						<span class="fx-g3 pd-l-rem5">{{getTasteNameString(goodsInfo.taste_list)}}</span>
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
					<p class="ws-w mg-t-rem5 tc-66">{{goodsInfo.goods_material}}</p>
				</div>
				<bottom-line class="mg-lr-rem5">•</bottom-line>
			</div>
		</div>
	</div>
</template>

<script>
	/* 菜品详情模式-2，有 swiper 特效【此页面未完成】*/
	import constVars from '@/apis/const'
	import yhoStore from '@/utils/yhostore'
	import bottomLine from '@/components/BottomLine'
	import { getCateName, getSpecName, getTasteName } from '@/apis/goods'
	
	export default {
		name: "goodsDetailsMode2",
		data(){
			return {
				ossImagePath: constVars.OSS_IMG_PATH,
				goodsInfo: null,
				cateName: "",
				imgHeight: 360,
				swiperObj: null
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
						this.goodsInfo.sales != 0
					);
				}
				return false;
			}
		},
		mounted() {
			var $mine = this;
			$mine.goodsInfo = yhoStore.onceObject("selected_goods_infos");
			if($mine.goodsInfo && $mine.goodsInfo.id === $mine.$route.query.gid){
				$mine.cateName = getCateName($mine.goodsInfo.goods_cate_id);
				$mine.$nextTick(function(){
					 $mine.swiperObj = new Swiper("#detailsWrapBox", {
					    direction: "vertical",
						initialSlide: 1, //从0开始
						slidesPerView: "auto",
						swipeHandler: ".swipe-handler",
						touchRatio: 0.5,
						touchMoveStopPropagation: true,
						//noSwiping: true, //设为true时，可以在slide上（或其他元素）增加类名 swiper-no-swiping，使该slide无法拖动
						on:{
							slideChange: function(sobj){
								if(sobj.activeIndex===0){
									$(sobj.slides[2]).find(".details-svg-icon3")
										.eq(0).removeClass("showme")
										.next().addClass("showme");
								} else if(sobj.activeIndex===1){
									$(sobj.slides[2]).find(".details-svg-icon3").removeClass("showme");
								} else {
									$(sobj.slides[2]).find(".details-svg-icon3")
										.eq(0).addClass("showme")
										.next().removeClass("showme");
								}
							}
						}
					});
				});
			} else {
				$mine.goodsInfo = null;
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
			getSpecNameString(slist){
				let sids = slist.map(item => item.spec_id);
				return getSpecName(sids, " / ");
			},
			getTasteNameString(tlist){
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
			},
			onImgLoaded(evt){
				//console.log(arguments)
				this.imgHeight = Math.ceil($(evt.currentTarget).height() || 0);
				this.swiperObj.init();
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.details-goods-pic{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 0;
	}
	
	.details-box-content{
		position: relative;
		top: 0;
		left: 0;
		z-index: 9;
		overflow: auto;
		/* background-image: linear-gradient(0deg,transparent 0%, rgba(255,255,255,0.5) 100%); */
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
		fill: #000;
	}
	
	.details-svg-icon3{
		display: none;
		width: 1rem;
		height: 1rem;
		fill: #666;
		&.showme{
			display: inline-block;
		}
	}
	
	.details-food-tag{
		width: 20px;
		height: 20px;
		margin-right: 2px;
	}
</style>