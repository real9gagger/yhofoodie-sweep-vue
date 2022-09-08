<template>
	<div class="hi-f fx-c">
		<div class="bg-mc fx-hc pd-lr-rem5" style="height:3rem">
			<p class="fx-g1">扫码点餐</p>
			<div class="ps-r op-5">
				<input class="seelct-search-input" type="search" autocomplete="off" />
				<a class="ps-a po-t-c" style="right:0.5rem">
					<svg style="width:1rem;height:1rem"><use xlink:href="#icon_sousuo"></use></svg>
				</a>
			</div>
		</div>
		<div class="fx-r fx-g1 of-h">
			<div class="hi-f of-a bg-f0 ps-r of-no-sb" id="leftMenuContainer">
				<ul class="select-left-menu">
					<template v-for="item,index in shopGoods">
						<li :class="{activing: index === cateIndex}" :key="item.id" @click="onCateClicked(index)">
							<i class="vertical-bar"></i>
							<svg v-if="item.id==0"><use xlink:href="#icon_taocan"></use></svg>
							<svg v-else-if="item.id==1"><use xlink:href="#icon_tuijian"></use></svg>
							<svg v-else-if="item.id==2"><use xlink:href="#icon_rexiao"></use></svg>
							<span>{{item.goods_cate_name}}</span>
							<i class="inverse-corner"><!--反向圆角--></i>
						</li>
					</template>
				</ul>
			</div>
			<div class="fx-g1 of-a ps-r" id="rightMenuContainer" @scroll="onGoodsScroll">
				<template v-for="item in shopGoods">
					<h4 class="select-right-header" :key="`H4${item.id}`">{{item.goods_cate_name}}</h4>
					<ul class="select-right-menu" :key="`UL${item.id}`">
						<li v-for="subitem in item.goods_list" :key="`LI${item.id}X${subitem.id}`">
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
									<p class="fx-g1"><!--占位--></p>
									<template v-if="!item.isAvailableCate || subitem.status != 1">
										<p class="tc-99 fw-b fx-g1">{{subitem.goods_price}}</p>
										<p class="tc-99 fs-rem7">不在可售时间范围内</p>
									</template>
									<template v-else >
										<p class="fx-hc pd-t-rem5">
											<b class="tc-mc fx-g1">{{subitem.goods_price}}</b>
											<a @click="addToCart($event)">
												<!-- <svg><use xlink:href="#icon_jian1"></use></svg>
												<span class="pd-lr-rem5">1</span> -->
												<svg><use xlink:href="#icon_jia2"></use></svg>
											</a>
										</p>
									</template>
								</div>
							</div>
						</li>
					</ul>
				</template>
			</div>
		</div>
		<div class="bg-mc fx-r" style="height:3rem" id="bottomActionBox">
			<div class="fx-g2 ps-r" style="background-color:#f90;">
				
			</div>
			<div class="hi-f" style="width:3rem">
				<svg class="wh-f" style="fill:#f90"><use xlink:href="#icon_spath"></use></svg>
			</div>
			<div class="fx-g1 bg-mc ps-r">


			</div>
		</div>
	</div>
</template>

<script>
	/* 选菜界面 */
	import * as goodsHelper from '@/config/goods'
	import constVars from '@/config/const'
	import yhoStore from '@/utils/store'
	
	export default {
		name: "orderSelect",
		data(){
			return {
				shopGoods: [],
				cateIndex: 0,
				goodsIndex: 0,
				h4OffsetTops: [],
				liOffsetTops: [],
				isSearchingCate: false,
				isDontHandleScroll: false,//是否处理滚动事件
				lastLeftScrollTop: 0,
				lastRightScrollTop: 0
			}
		},
		computed:{
			cateName(){
				return (this.shopGoods[this.cateIndex].goods_cate_name || "");
			},
			/* chooseGoods(){
				if (this.cateIndex >= 0 && this.cateIndex < this.shopGoods.length && this.goodsIndex >= 0) {
					return (this.shopGoods[this.cateIndex].goods_list[this.goodsIndex]);
				} else {
					return null;
				}
			} */
		},
		components: {},
		mounted() {
			var $mine = this;
			goodsHelper.getShopGoods().then((goods) => {
				$mine.shopGoods = (goods.list || []);
				$mine.checkGoodsStatus();
				$mine.getOffsetTops();
				//console.log(goods);
			});
		},
		beforeRouteLeave(to, from , next){//保存上次滚动到的地方
			this.lastLeftScrollTop = $("#leftMenuContainer").scrollTop();
			this.lastRightScrollTop = $("#rightMenuContainer").scrollTop();
			next();
		},
		activated(){
			this.$nextTick(function(){ //返回上次滚动到的地方
				$("#leftMenuContainer").scrollTop(this.lastLeftScrollTop);
				$("#rightMenuContainer").scrollTop(this.lastRightScrollTop);
			});
		},
		methods:{
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
					let domImgBox = $(evt.currentTarget).find("img").get(0);
					if(!domImgBox.src.endsWith("LOADING_FAILED")){//不是加载失败的图片
						imgWhRatio = (domImgBox.naturalHeight / domImgBox.naturalWidth) || 0;
					}
				}
				
				yhoStore.onceObject("selected_goods_infos", ginfos); //选中的菜品信息
				
				this.$router.push({
					path: "./details",
					query: {
						gid: ginfos.id,
						ratio: imgWhRatio,
						cname: this.cateName
					}
				});
			},
			checkGoodsStatus(){//检查菜品是否可售
				let indexArr = [];

				goodsHelper.resetDateTime(); //必须调用！
				
				$.each(this.shopGoods, function(idx, cate){
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
					for(let e_e of this.shopGoods[idx].goods_list){
						let cobj = goodsHelper.getCateObject(e_e.goods_cate_id);
						if(!cobj || cobj.isAvailableCate){ //上述已判断了分类的是否在可售时间内，因此这里直接获取判断结果就行
							e_e.status = 1;
						} else {
							e_e.status = 90;//1-可供销售，90-不在可售时间范围内, 99-已售罄
						}
					}
				}
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
			addToCart(evt){
				evt.preventDefault();
				evt.stopPropagation();
				
				addGoodsToGwc(evt.currentTarget, "#bottomActionBox");
			},
			onGoodsScroll(evt){
				var elem = (evt.target || evt.srcElement);
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
		word-break: break-all;
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
					background-color: #fd5749;
				}
				i.inverse-corner{
					display: block;
					position: absolute;
					top: -14px;
					bottom: -14px;
					right: 0;
					z-index: 9;
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
			svg{
				width: 1em;
				height: 1em;
				fill: #fd5749;
				margin-right: 5px;
				vertical-align: top;
			}
		}
	}
	
	.select-right-header{
		padding: 0.5rem;
		position: sticky;
		top:0;
		z-index:1;
		background-color: #fff;
	}
	
	.select-right-menu{
		padding:0 0.5rem;
		& > li{
			padding-bottom: 1rem;
			word-break: break-all;
			img {
				width: 5rem;
				height: 5rem;
				background-color: #f0f0f0;
				border-radius: 0.5rem;
			}
			svg{
				height: 1.2rem;
				width: 1.2rem;
				fill: #fd5749;
				overflow: hidden;
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
	
	.seelct-search-input{
		border-radius: 1rem;
		height: 2rem;
		width: 2rem;
		transition: width 0.5s;
		border: 0;
		&.stretching{
			width: 6rem;
		}
	}
</style>