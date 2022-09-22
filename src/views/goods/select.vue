<template>
	<div class="hi-f fx-c">
		<div class="fx-hc pd-lr-rem5 bd-b-f0" style="height:3rem">
			<back-button title="T01"></back-button>
			<div class="ps-r fx-g1 pd-l-1rem">
				<input class="select-search-input" placeholder="搜一搜" type="search" autocomplete="off" />
				<a class="ps-a po-t-c" style="right:0.5rem">
					<svg class="wh-1rem fi-99"><use xlink:href="#icon_sousuo"></use></svg>
				</a>
			</div>
		</div>
		<div class="fx-r fx-g1 of-h">
			<div class="hi-f of-a bg-f0 ps-r of-no-sb" id="leftMenuContainer">
				<ul class="select-left-menu">
					<li v-for="item,index in shopGoods" :class="{activing: index === cateIndex}" :key="item.cate_key" @click="onCateClicked(index)">
						<i class="vertical-bar"></i>
						<svg v-if="item.id==0"><use xlink:href="#icon_taocan"></use></svg>
						<svg v-else-if="item.id==1"><use xlink:href="#icon_tuijian"></use></svg>
						<svg v-else-if="item.id==2"><use xlink:href="#icon_rexiao"></use></svg>
						<span>{{item.goods_cate_name}}</span>
						<span class="cate-counts" v-if="chooseInfo[item.cate_key]">{{chooseInfo[item.cate_key]}}</span>
						<i class="inverse-corner"><!--反向圆角--></i>
					</li>
				</ul>
			</div>
			<div v-if="shopGoods" class="fx-g1 of-a ps-r" id="rightMenuContainer" @scroll="onGoodsScroll">
				<template v-for="item,ix0 in shopGoods">
					<h4 class="select-right-header" :key="item.id">{{item.goods_cate_name}}</h4>
					<ul class="select-right-menu" :key="item.cate_key">
						<li v-for="subitem,ix1 in item.goods_list" :key="subitem.goods_key">
							<div class="fx-r" @click="onGoodsClicked($event, subitem)">
								<div>
									<img v-if="subitem.goods_thumb" :src="getGoodsPic(subitem.goods_thumb)" loading="lazy" onerror="onImageLoadingError()" />
									<p v-else class="select-no-pic">{{subitem.goods_name[0]}}</p>
								</div>
								<div class="fx-g1 fx-c pd-l-rem5">
									<p class="select-goods-name">{{subitem.goods_name}}</p>
									<p class="pd-t-rem3 tc-99 fs-12px" v-if="subitem.sales != 0">
										<span>销量 {{subitem.sales}}</span>
									</p>
									<p class="pd-t-rem3 tc-99 fs-12px" v-if="subitem.goods_material && subitem.goods_material.length <= 30">
										<span>{{subitem.goods_material}}</span>
									</p>
									<p class="fx-g1"><!--占位专用--></p>
									<template v-if="!item.isAvailableCate || subitem.status != 1">
										<p class="tc-99 fw-b fx-g1">{{subitem.goods_price}}</p>
										<p class="tc-99 fs-rem7">不在可售时间范围内</p>
									</template>
									<template v-else >
										<counter-goods 
											:goods-count="chooseInfo[item.cate_key + subitem.goods_key]" 
											:cate-index="ix0"
											:goods-index="ix1"
											:multiple-choice="subitem.is_multiple_choice" 
											:counter-title="subitem.goods_price"
											@change="addToCart"></counter-goods>
									</template>
								</div>
							</div>
						</li>
					</ul>
				</template>
			</div>
			<skeleton-screen v-else :item-count="8" :animation-type="2" item-class="fx-r mg-b-1rem" class="fx-g1 pd-lr-rem5">
				<template #header>
					<div class="pd-tb-rem25"><span class="skeleton-item wi-6rem"></span></div>
				</template>
				<template #item>
					<div class="skeleton-item wh-5rem br-rem5 ps-r">
						<svg class="wh-1rem5 fi-cc ps-a po-mc"><use xlink:href="#icon_image1"></use></svg>
					</div>
					<div class="fx-g1 fx-c bg-ff pd-l-rem5">
						<span class="skeleton-item mg-b-rem5"></span>
						<span class="skeleton-item wi-4rem"></span>
						<p class="fx-g1"></p>
						<p class="fx-r">
							<span class="skeleton-item wi-2rem"></span>
							<span class="fx-g1"></span>
							<em class="skeleton-item br-h wh-1rem2"></em>
						</p>
					</div>
				</template>
			</skeleton-screen>
		</div>
		<div class="fx-r select-bottom-container">
			<div class="fx-g1 ps-r">
				<p class="select-cart-box fx-c fx-mc" @click="showChooseList()" :class="{nogoods: !chooseInfo.total_count}" id="myChooseCartBox">
					<b class="dp-bk tc-ff fs-12px lh-1x">{{chooseInfo.total_count || 0}}</b>
					<svg class="wh-1rem2 fi-ff"><use xlink:href="#icon_gouwuche"></use></svg>
				</p>
				<p class="pd-l-4rem5 tc-ff wh-f fx-hc">
					<span><i class="fs-12px">RM&nbsp;</i><b class="fs-1rem2">{{chooseInfo.total_price || "0.00"}}</b></span>
				</p>
			</div>
			<div class="hi-f wi-3rem">
				<svg class="wh-f">
					<defs>
						<linearGradient id="spath_lg001" x1="0%" y1="100%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#f88"></stop>
							<stop offset="100%" stop-color="#f99"></stop>
						</linearGradient>
					</defs>
					<use xlink:href="#icon_spath" fill="url(#spath_lg001)"></use>
				</svg>
			</div>
			<div class="fx-vc tc-ff pd-l-1rem fs-1rem wi-5rem" :class="{disabled: !chooseInfo.total_count}">
				<span>选好了</span>
			</div>
		</div>
		<choose-goods ref="chooseGBox" @change="onChooseChange"></choose-goods>
		<alacarte-goods ref="alacarteGBox" @confirm="addToCart"></alacarte-goods>
	</div>
</template>

<script>
	/* 选菜界面 */
	import * as goodsHelper from '@/apis/goods'
	import constVars from '@/apis/const'
	import yhoStore from '@/utils/yhostore'
	import chooseGoods from './choose'
	import counterGoods from './counter'
	import alacarteGoods from './alacartegoods'
	import backButton from '@/components/BackButton'
	import skeletonScreen from '@/components/SkeletonScreen'
	
	export default {
		name: "goodsSelect",
		data(){
			return {
				shopGoods: null,
				cateIndex: 0,
				h4OffsetTops: [],
				liOffsetTops: [],
				isSearchingCate: false,
				isDontHandleScroll: false,//是否处理滚动事件
				lastLeftScrollTop: 0,
				lastRightScrollTop: 0,
				chooseInfo: {},//已选菜品一些信息
				alacarteBtn: null,//点击的按钮
			}
		},
		computed:{
			cateName(){
				return (this.shopGoods[this.cateIndex].goods_cate_name || "");
			}
		},
		components: {
			chooseGoods,
			alacarteGoods,
			counterGoods,
			backButton,
			skeletonScreen
		},
		mounted() {
			var $mine = this;
			goodsHelper.getShopGoods().then((goods) => {
				$mine.checkGoodsStatus(goods.list || []);
				$mine.getOffsetTops();
				//console.log(goods);
			});
		},
		deactivated(){//保存上次滚动到的地方
			this.lastLeftScrollTop = $("#leftMenuContainer").scrollTop();
			this.lastRightScrollTop = $("#rightMenuContainer").scrollTop();
		},
		activated(){
			this.$nextTick(function(){ //返回上次滚动到的地方
				$("#leftMenuContainer").scrollTop(this.lastLeftScrollTop);
				$("#rightMenuContainer").scrollTop(this.lastRightScrollTop);
			});
		},
		methods:{
			onChooseChange(data){
				this.chooseInfo = data;
			},
			onCateClicked(idx){
				this.cateIndex = idx;
				this.isDontHandleScroll = true;
				this.$nextTick(function(){
					$("#rightMenuContainer").scrollTop(this.h4OffsetTops[this.cateIndex]);
				});
			},
			onGoodsClicked(evt, ginfos){
				let imgWhRatio = 0;
				if(ginfos.goods_thumb){
					imgWhRatio = getImageHwRatio($(evt.currentTarget).find("img").get(0));
				}
				
				yhoStore.onceObject("selected_goods_infos", ginfos); //选中的菜品信息
				
				this.$router.push({
					path: "/details",
					query: {
						gid: ginfos.id,
						ratio: imgWhRatio,
						cname: this.cateName
					}
				});
			},
			checkGoodsStatus(goodsList){//检查菜品是否可售
				let indexArr = [];
				
				goodsHelper.resetDateTime(); //必须调用！
				
				$.each(goodsList, function(idx, cate){
					if(cate.id > 2){
						cate.isAvailableCate = goodsHelper.isCateInSaleableTime(cate, false);
					} else if(cate.id === 0){ //套餐。单独判断
						for(let o_o of cate.goods_list){
							if (!goodsHelper.isCateInSaleableTime(o_o, true)){
								o_o.status = 90;//1-可供销售，90-不在可售时间范围内, 99-已售罄
							} else {
								o_o.status = 1;
							}
						}
						cate.isAvailableCate = true;
					} else {//推荐、热销 单独判断
						indexArr.push(idx);
						cate.isAvailableCate = true;
					}
				});
				
				for(let idx of indexArr){
					for(let e_e of goodsList[idx].goods_list){
						let cobj = goodsHelper.getCateObject(e_e.goods_cate_id);
						if(!cobj || cobj.isAvailableCate){ //上述已判断了分类的是否在可售时间内，因此这里直接获取判断结果就行
							e_e.status = 1;
						} else {
							e_e.status = 90;//1-可供销售，90-不在可售时间范围内, 99-已售罄
						}
					}
				}
				
				this.shopGoods = Object.freeze(goodsList);
			},
			getGoodsPic(path){
				return "/image/waiter_happy.png"; //测试用
				//return (constVars.OSS_IMG_PATH + path + constVars.OSS_IMG_SIZE_FOR_LIST);
			},
			getOffsetTops(){
				var $mine = this;
				$mine.$nextTick(function(){
					$mine.h4OffsetTops = []; //右边栏
					$("#rightMenuContainer").children("h4").each(function(index, elem){
						$mine.h4OffsetTops.push(elem.offsetTop);
					});
					$mine.liOffsetTops = []; //左边栏
					$("#leftMenuContainer").children("ul").children().each(function(index, elem){
						$mine.liOffsetTops.push(elem.offsetTop);
					});
				});
			},
			addToCart(arg0){
				if(arg0 && arg0.actionValue){
					let ginfos = this.shopGoods[arg0.cateIndex].goods_list[arg0.goodsIndex];
					if(!arg0.multipleChoice){//直接加入购物车，不弹窗
						if(arg0.actionValue > 0){
							this.$refs.chooseGBox.addGoods(this.$refs.alacarteGBox.formatGoods(ginfos));
							throwGoodsToGwc(arg0.clickedElem, "#myChooseCartBox");
						} else {
							this.$refs.chooseGBox.reduceGoods(ginfos.id);
						}
						this.alacarteBtn = null;
					} else {//显示点菜框【显示多规格/口味/配菜弹窗】
						this.alacarteBtn = arg0.clickedElem;
						if(arg0.actionValue > 0){
							this.$refs.alacarteGBox.showMe(ginfos);
						} else if (arg0.newCount <= 0){//只有一份，直接删除
							this.$refs.chooseGBox.reduceGoods(ginfos.id);
						} else {
							this.$refs.chooseGBox.showList();
						}
					}
				} else {//关闭弹窗后，确定加入购物车
					if(arg0){
						this.$refs.chooseGBox.addGoods(arg0);
						setTimeout(window.throwGoodsToGwc, 250, this.alacarteBtn, "#myChooseCartBox");//等弹窗完全隐藏后，再执行动画
					}
					this.alacarteBtn = null;
				}
			},
			onGoodsScroll(evt){
				var $mine = this;
				if($mine.isDontHandleScroll){
					$mine.isDontHandleScroll = false;
					return;
				}
				
				if($mine.isSearchingCate){
					return;
				} else {
					$mine.isSearchingCate = true;
				}
				
				let elem = (evt.target || evt.srcElement);
				let sTop = elem.scrollTop;
				let cIndex = $mine.binarySearchIndex(0, $mine.h4OffsetTops.length - 1, sTop);
				
				if($mine.cateIndex !== cIndex && cIndex >= 0 && cIndex < $mine.shopGoods.length){
					$mine.cateIndex = cIndex;
					//自动滚动左边分类栏
					let $leftbox = $("#leftMenuContainer");
					let hei0 = $leftbox.height();
					let hei1 = $leftbox.scrollTop();
					let hei2 = $mine.liOffsetTops[cIndex];//当前
					let hei3 = ($mine.liOffsetTops[cIndex + 1] || hei2) + 14; //加上一个调整值。下一个li元素的offsetTop（如果有，没有下一个元素就用当前的元素）
					if(hei3 >= (hei0 + hei1)){
						$leftbox.scrollTop(hei3 - hei0);
					} else if(hei2 < hei1){
						$leftbox.scrollTop(hei2);
					}
				}
				
				$mine.isSearchingCate = false;
			},
			showChooseList(){
				this.$refs.chooseGBox.showList();
			},
			binarySearchIndex(start, end, threshold){ //折半查找。
				//原理：倒序查找到第一个 offsetTop 小于 scrollTop 的元素所在索引。
				//这种方法耗时，用折半查找替代。
				//满足条件的元素特征：offsetTop <= scrollTop 且 下一个元素的 offsetTop > scrollTop
				var $mine = this;
				if (end < 0 || end >= $mine.h4OffsetTops.length){
					return 0;
				}
				
				if(start < 0 || start >= end){
					return end;
				}
				
				let mid = Math.floor((start + end) / 2);
				
				if($mine.h4OffsetTops[mid] <= threshold){
					if((mid + 1) <= end){
						if($mine.h4OffsetTops[mid + 1] > threshold){
							return mid;
						} else {
							return $mine.binarySearchIndex(mid + 1, end, threshold);
						}
					}
				} else {
					if((--mid) >= 0){						
						if($mine.h4OffsetTops[mid] <= threshold){
							return mid;
						} else {
							return $mine.binarySearchIndex(start, mid, threshold);
						}
					}
				}
				
				return 0;
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.select-left-menu{
		width: 5rem;
		word-break: break-word;
		white-space: pre-wrap;
		& > li{
			padding: 0.5rem;
			font-size: 0.7rem;
			position: relative;
			&.activing{
				background-color: #fff;
				i.vertical-bar{
					display: block;
					position: absolute;
					left: 0;
					top: 0;
					height: 100%;
					width: 2px;
					background-color: $appMainColor;
				}
				i.inverse-corner{
					display: block;
					position: absolute;
					top: -14px;
					bottom: -14px;
					right: 0;
					z-index: 1;
					width: 14px;
					background-color: inherit;
					&::before,&::after{
						content: "";
						display: block;
						position: absolute;
						left: 0;
						height: 14px;
						width: 100%;
						background-color: #f0f0f0;
					}
					&::before{
						top: 0;
						border-bottom-right-radius: 14px;
					}
					&::after{
						bottom: 0;
						border-top-right-radius: 14px;
					}
				}
			}
			>.cate-counts{
				display: inline-block;
				position: relative;
				z-index: 2;
				background-color: $appMainColor;
				color: #fff;
				text-align: center;
				margin-left: 0.25rem;
				border-radius: 0.5rem;
				min-width: 0.8rem;
				line-height: 0.8rem;
				font-size: 0.6rem;
			}
			>svg{
				width: 1em;
				height: 1em;
				fill: $appMainColor;
				margin-right: 5px;
				vertical-align: top;
			}
		}
	}
	
	.select-right-header{
		padding: 0.25rem 0.5rem;
		position: sticky;
		top:0;
		z-index:1;
		background-color: #fff;
	}
	
	.select-right-menu{
		padding:0 0.5rem;
		& > li{
			margin-bottom: 1rem;
			word-break: break-all;
			transition: transform 0.25s;
			img {
				width: 5rem;
				height: 5rem;
				background-color: #f0f0f0;
				border-radius: 0.5rem;
			}
			&:active{
				transform: scale(0.95);
			}
		}
	}
	
	.select-no-pic{
		width: 5rem;
		height: 5rem;
		line-height: 5rem;
		background-color: #f0f0f0;
		border-radius: 0.5rem;
		font-size: 2.5rem;
		color: #ccc;
		text-align: center;
	}
	
	.select-goods-name{
		display: -webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		overflow:hidden;
		text-overflow: ellipsis;
		font-weight: bold;
	}
	
	.select-search-input{
		border-radius: 1rem;
		height: 1.8rem;
		padding: 0 1rem;
		width: 100%;
		transition: width 0.5s;
		background-color: #f0f0f0;
		border: 0px solid $appMainColor;
	}
	
	.select-bottom-container{
		position: relative;
		z-index: 10;
		height: 3rem;
		background-image: linear-gradient(90deg, #f88 50%, #f66 100%);
		background-color: #fff;
		> :first-child{
			background-image: linear-gradient(90deg, #f66 0%, #f88 100%)
		}
	}
	
	.select-cart-box{
		position: absolute;
		width: 3rem;
		height: 3rem;
		left: 0.75rem;
		background-color: $appMainColor;
		top: -0.5rem;
		z-index: 1;
		border: 3px solid #fff;
		border-radius: 50%;
		text-align: center;
		&.nogoods{
			background-color: #f88;
		}
	}
</style>