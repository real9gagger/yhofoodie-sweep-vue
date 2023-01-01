<template>
	<div class="hi-f fx-c">
		<div class="fx-hc pd-lr-rem5 bd-b-dd hi-2rem8">
			<back-button title="T01"></back-button>
			<div class="ps-r fx-g1 pd-l-1rem">
				<input class="select-search-input" placeholder="想吃什么 搜一搜" type="search" autocomplete="off" />
				<a class="ps-a po-t-c" style="right:0.5rem">
					<svg class="wh-1rem fi-99"><use xlink:href="#icon_sousuo"></use></svg>
				</a>
			</div>
		</div>
		<div class="fx-r fx-g1 of-h" v-if="shopGoods">
			<div class="hi-f of-a bg-f0 ps-r of-no-sb" id="leftMenuContainer">
				<ul class="select-left-menu">
					<li v-for="item,index in shopGoods" :class="{activing: index === curCateIndex}" :key="item.cate_key" @click="onCateClicked(index)">
						<i class="vertical-bar"></i>
						<svg v-if="item.id==0"><use xlink:href="#icon_taocan1"></use></svg>
						<svg v-else-if="item.id==1"><use xlink:href="#icon_tuijian"></use></svg>
						<svg v-else-if="item.id==2"><use xlink:href="#icon_rexiao"></use></svg>
						<span>{{item.goods_cate_name}}</span>
						<span class="cate-counts" v-if="cartTotalInfo[item.cate_key]">{{cartTotalInfo[item.cate_key]}}</span>
						<i class="inverse-corner"><!--反向圆角--></i>
					</li>
				</ul>
			</div>
			<sv-scroll class="fx-g1 of-a ps-r" 
				ref="svScrollBox"
				:goods-data="shopGoods"
				@counterchange="addToCart"
				@catechange="onCateChange"></sv-scroll>
		</div>
		<div v-else class="fx-r fx-g1 of-h">
			<skeleton-screen :item-count="5" item-class="pd-lr-rem5" class="wi-5rem bg-f0 pd-tb-rem5">
				<template #item>
					<p class="mg-b-1rem hi-1rem br-5 bg-f9"></p>
					<p class="mg-b-1rem hi-1rem br-5 bg-f9 wi-h"></p>
				</template>
			</skeleton-screen>
			<skeleton-screen :item-count="10" :animation-type="2" item-class="fx-r mg-b-1rem" class="fx-g1 pd-lr-rem5">
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
				<p class="select-cart-box fx-c fx-mc" @click="showChooseList()" :class="{nogoods: !cartTotalInfo.total_count}" id="myChooseCartBox">
					<b class="dp-bk tc-ff fs-rem6 lh-1x">{{cartTotalInfo.total_count}}</b>
					<svg class="wh-1rem2 fi-ff"><use xlink:href="#icon_gouwuche"></use></svg>
				</p>
				<p class="pd-l-4rem5 tc-ff wh-f fx-hc">
					<span><i class="fs-rem6">RM&nbsp;</i><b class="fs-1rem2">{{cartTotalInfo.total_price}}</b></span>
				</p>
			</div>
			<div class="hi-f wi-2rem8">
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
			<div class="fx-vc tc-ff pd-l-1rem fs-1rem wi-5rem" :class="{disabled: !cartTotalInfo.total_count}">
				<span>选好了</span>
			</div>
		</div>
		<choose-goods ref="chooseGBox"></choose-goods>
		<alacarte-goods ref="alacarteGBox" @confirm="addToCart"></alacarte-goods>
	</div>
</template>

<script>
	/* 选菜界面 */
	import { mapGetters } from 'vuex'
	import * as goodsHelper from '@/apis/goods'
	import yhoStore from '@/utils/yhostore'
	import chooseGoods from './choose'
	import svScroll from './selectvirtualscroll'
	import alacarteGoods from './alacartegoods'
	import backButton from '@/components/BackButton'
	import skeletonScreen from '@/components/SkeletonScreen'
	
	export default {
		name: "goodsSelect",
		data(){
			return {
				shopGoods: null,
				curCateIndex: 0,
				liOffsetTops: [],
				lastLeftScrollTop: 0,
				alacarteBtn: null,//点击的按钮
			}
		},
		computed:{
			...mapGetters(["cartTotalInfo"])
		},
		components: {
			chooseGoods,
			svScroll,
			alacarteGoods,
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
			//console.log(this)
		},
		deactivated(){//保存上次滚动到的地方
			this.lastLeftScrollTop = $("#leftMenuContainer").scrollTop();
		},
		activated(){
			if(this.lastLeftScrollTop){
				this.$nextTick(function(){ //返回上次滚动到的地方
					$("#leftMenuContainer").scrollTop(this.lastLeftScrollTop);
				});
			}
		},
		methods:{
			onCateClicked(idx){
				this.curCateIndex = idx;
				this.$refs.svScrollBox.setCateIndex(idx);
			},
			onCateChange(idx){
				var $mine = this;
				
				$mine.curCateIndex = idx;
				
				let $leftbox = $("#leftMenuContainer");
				let hei0 = $leftbox.height();
				let hei1 = $leftbox.scrollTop();
				let hei2 = $mine.liOffsetTops[idx];//当前
				let hei3 = ($mine.liOffsetTops[idx + 1] || hei2) + 14; //加上一个调整值。下一个li元素的offsetTop（如果有，没有下一个元素就用当前的元素）

				if(hei3 >= (hei0 + hei1)){//往下滚动
					$leftbox.scrollTop(hei3 - hei0);
				} else if(hei2 < hei1){
					$leftbox.scrollTop(hei2);
				}
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
			getOffsetTops(){
				var $mine = this;
				$mine.$nextTick(function(){
					let $leftBox = $("#leftMenuContainer");
					$mine.liOffsetTops = []; //左边栏
					$leftBox.children("ul").children().each(function(index, elem){
						$mine.liOffsetTops.push(elem.offsetTop);
					});
					$mine.liOffsetTops.push($leftBox.get(0).scrollHeight);
					$mine.$refs.svScrollBox.setViewMode(1);
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
							this.$refs.chooseGBox.reduceGoods(ginfos.cate_key + ginfos.goods_key);
						}
						this.alacarteBtn = null;
					} else {//显示点菜框【显示多规格/口味/配菜弹窗】
						this.alacarteBtn = arg0.clickedElem;
						if(arg0.actionValue > 0){
							if(ginfos.is_package_goods){
								yhoStore.onceObject("selected_goods_infos", ginfos); //选中的菜品信息
								this.$router.push("/alacartepackage");
							} else {
								this.$refs.alacarteGBox.showMe(ginfos);
							}
						} /* else if (arg0.newCount <= 0){//只有一份，直接删除
							this.$refs.chooseGBox.reduceGoods(ginfos.cate_key + ginfos.goods_key);
						} */ else {
							this.$refs.chooseGBox.showList(this.cartTotalInfo.total_count);
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
			showChooseList(){
				this.$refs.chooseGBox.showList(this.cartTotalInfo.total_count);
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.select-left-menu{
		width: 5rem;
		word-break: break-word;
		white-space: pre-wrap;
		overflow: hidden;
		> li{
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

	.select-search-input{
		border-radius: 1rem;
		height: 1.7rem;
		padding: 0 1rem;
		width: 100%;
		transition: width 0.5s;
		background-color: #f0f0f0;
		border: 0px solid $appMainColor;
	}
	
	.select-bottom-container{
		position: relative;
		z-index: 10;
		height: 2.8rem;
		background-image: linear-gradient(90deg, #f88 50%, #f66 100%);
		background-color: #fff;
		> :first-child{
			background-image: linear-gradient(90deg, #f66 0%, #f88 100%)
		}
	}
	
	.select-cart-box{
		position: absolute;
		width: 2.8rem;
		height: 2.8rem;
		left: 0.75rem;
		background-color: $appMainColor;
		top: -0.75rem;
		z-index: 1;
		border: 3px solid #fff;
		border-radius: 50%;
		text-align: center;
		&.nogoods{
			background-color: #f88;
		}
	}
</style>