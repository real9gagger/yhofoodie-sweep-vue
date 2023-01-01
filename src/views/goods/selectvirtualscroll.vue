<template>
	<div @scroll="onBoxScrolling" id="rightMenuContainer">
		<div class="svscroll-switcher-box">
			<a v-if="viewMode === 2" @click="setViewMode(1)"><svg class="wh-1rem fi-66"><use xlink:href="#icon_listmode"></use></svg></a>
			<a v-else @click="setViewMode(2)"><svg class="wh-1rem fi-66"><use xlink:href="#icon_flowmode"></use></svg></a>
		</div>
		<div :style="`height:${offsetHeight1}px`" title="虚拟滚动-顶部占位专用"></div>
		<template v-for="item,ix0 in goodsData">
			<template v-if="ix0 >= startIndex && ix0 <= endIndex">
				<h4 class="svscroll-right-header" :key="item.id">{{item.goods_cate_name}}</h4>
				<ul v-if="viewMode === 1" class="svscroll-right-menu" :key="item.cate_key">
					<li v-for="subitem,ix1 in item.goods_list" :key="subitem.goods_key" @click="onItemClick($event, subitem)">
						<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name"></goods-image>
						<div class="fx-g1 fx-c pd-l-rem5">
							<p class="svscroll-goods-name">{{subitem.goods_name}}</p>
							<p class="mg-t-rem2 tc-99 fs-rem6" v-if="subitem.sales != 0">销量 {{subitem.sales}}</p>
							<p class="mg-t-rem2 tc-99 fs-rem6" v-if="subitem.goods_material && subitem.goods_material.length <= 30">{{subitem.goods_material}}</p>
							<p class="fx-g1"><!--占位专用--></p>
							<p v-if="!item.isAvailableCate || subitem.status != 1" class="mg-t-rem2 tc-99 fx-r">
								<b>{{subitem.goods_price}}</b>
								<span class="fx-g1 pd-l-rem5 ta-r">不在可售时间内</span>
							</p>
							<counter-goods v-else class="mg-t-rem2"
								:goods-count="cartTotalInfo[item.cate_key + subitem.goods_key]" 
								:cate-index="ix0"
								:goods-index="ix1"
								:multiple-choice="subitem.is_multiple_choice" 
								:counter-title="subitem.goods_price"
								@change="onCounterChange"></counter-goods>
						</div>
					</li>
				</ul>
				<ul v-else class="svscroll-right-flowmode" :key="item.cate_key">
					<li v-for="nth in goodsBoxCols" :style="flowModeWidth" :key="nth">
						<template v-for="subitem,ix1 in item.goods_list">
							<div v-if="isInCols(nth, ix1)" :key="subitem.goods_key" class="svscroll-flowmode-subitem" @click="onItemClick($event, subitem)">
								<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name" box-size="fill"></goods-image>
								<p class="mg-t-rem2 pd-lr-rem3 fw-b">{{subitem.goods_name}}</p>
								<p class="mg-t-rem2 pd-lr-rem3 tc-99 fs-rem6" v-if="subitem.sales != 0">销量 {{subitem.sales}}</p>
								<p class="mg-t-rem2 pd-lr-rem3 tc-99 fs-rem6" v-if="subitem.goods_material && subitem.goods_material.length <= 30">{{subitem.goods_material}}</p>
								<p v-if="!item.isAvailableCate || subitem.status != 1" class="mg-t-rem2 pd-lr-rem3 tc-99 ta-r">不在可售时间内</p>
								<counter-goods v-else class="mg-t-rem2 pd-lr-rem3" count-class="wi-1rem5"
									:goods-count="cartTotalInfo[item.cate_key + subitem.goods_key]" 
									:cate-index="ix0"
									:goods-index="ix1"
									:multiple-choice="subitem.is_multiple_choice"
									:counter-title="subitem.goods_price"
									@change="onCounterChange"></counter-goods>
							</div>
						</template>
					</li>
				</ul>
			</template>
		</template>
		<div :style="`height:${offsetHeight2}px`" title="虚拟滚动-底部占位专用"></div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import yhoStore from '@/utils/yhostore'
	import counterGoods from './counter'
	import goodsImage from '@/components/GoodsImage'

	export default {
		name: "goodsSelectVirtualScroll",//长列表虚拟滚动
		data(){
			return {
				curIndex: 0,
				startIndex: 0,
				endIndex: 0,
				lastScrollTop: 0,
				viewMode: 1, //视图模式：1-列表模式（默认），2-瀑布流模式
				isDontHandleScroll: false, //是否处理滚动事件
				isFindingCate: false, //节流专用
				h4OffsetTops: [],
				setTimeoutID: 0,
				goodsBoxCols: 1
			}
		},
		deactivated(){//保存上次滚动到的地方
			this.lastScrollTop = $("#rightMenuContainer").scrollTop();
		},
		activated(){
			if(this.lastScrollTop){
				this.$nextTick(function(){ //返回上次滚动到的地方
					$("#rightMenuContainer").scrollTop(this.lastScrollTop);
				});
			}
		},
		beforeDestroy(){
			clearTimeout(this.setTimeoutID);
		},
		props:{
			goodsData:{
				type: Array,
				default: null
			}
		},
		computed:{
			...mapGetters(["cartTotalInfo"]),
			offsetHeight1(){
				return (this.h4OffsetTops[this.startIndex] || 0);
			},
			offsetHeight2(){
				if(this.endIndex < (this.h4OffsetTops.length - 1)){
					return 500;
				} else {
					return 0;
				}
			},
			flowModeWidth(){
				return ("width:" + (100 / this.goodsBoxCols) + "%");
			}
		},
		components:{ counterGoods, goodsImage },
		methods:{
			initViewBox(){
				var $mine = this;
				var $rbox = $("#rightMenuContainer");
				$rbox.scrollTop(0);
				$mine.setTimeoutID = setTimeout(function(){//延迟一小段时间，防止初次进入界面时卡顿。vue数据量太大（1000+条数据）会引起卡顿问题
					$mine.endIndex = 88888888;//全部显示，然后计算一些高度
					$mine.$nextTick(function(){
						$mine.h4OffsetTops = [];
						$rbox.children("h4").each(function(index, h4dom){
							$mine.h4OffsetTops.push(h4dom.offsetTop);
						});
						$mine.endIndex = $mine.getEndIndex(0); //计算完各个框的高度后，还原。防止离开再返回时卡顿！
					});
				}, 750);
			},
			setCateIndex(idx){
				this.curIndex = idx;
				this.startIndex = this.getStartIndex(idx);
				this.endIndex = this.getEndIndex(idx);
				this.isDontHandleScroll = true;
				this.$nextTick(function(){
					$("#rightMenuContainer").scrollTop(this.h4OffsetTops[this.curIndex]);
				});
			},
			onItemClick(evt, ginfos){
				let imgWhRatio = 0;
				let cateName = this.goodsData[this.curIndex].goods_cate_name;
				
				if(ginfos.goods_thumb){
					imgWhRatio = getImageHwRatio($(evt.currentTarget).find("img").get(0));
				}
				
				yhoStore.onceObject("selected_goods_infos", ginfos); //选中的菜品信息
				
				this.$router.push({
					path: "/details",
					query: {
						gid: ginfos.id,
						ratio: imgWhRatio,
						cname: cateName
					}
				});
			},
			onCounterChange(params){
				this.$emit("counterchange", params);
			},
			onBoxScrolling(evt){
				if(this.isDontHandleScroll){
					return (this.isDontHandleScroll = false);
				} 
				
				if(this.isFindingCate){
					return;
				} else {
					this.isFindingCate = true;
				}
				
				let elem = evt.currentTarget;
				let sTop = elem.scrollTop;
				let cIndex = this.binarySearchIndex(this.startIndex, this.endIndex, sTop);

				if(this.curIndex !== cIndex){
					this.curIndex = cIndex;
					this.startIndex = this.getStartIndex(cIndex);
					this.endIndex = this.getEndIndex(cIndex);
					this.$emit("catechange", cIndex);
				}
				
				this.isFindingCate = false;
			},
			getStartIndex(idx){//获取开始索引
				return (idx > 1 ? idx - 1 : 0);
			},
			getEndIndex(idx){//获取至少累计有10个菜品的分类索引
				let sums = 0;
				for(let ix = idx + 1, nx = this.goodsData.length; ix < nx; ix++){
					if(sums >= 10){
						break;
					} else {
						sums += this.goodsData[ix].goods_list.length;
					}
					idx++;
				}
				return idx;
			},
			binarySearchIndex(start, end, threshold){ //折半查找。
				//原理：当使用倒序查找到第一个 offsetTop 小于 scrollTop 的元素所在索引时。这种方法耗时，用折半查找替代。
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
			},
			getBoxWidth(){//获取瀑布流模式每列的宽度（百分比），每行可以放下多少列
				let ww = window.innerWidth;
				if(ww <= 250){
					this.goodsBoxCols = 1; //每行1列
				} else if(ww <= 500){
					this.goodsBoxCols = 2; //每行2列
				} else if(ww <= 1000){
					this.goodsBoxCols = 3; //每行3列
				} else if(ww <= 1500){
					this.goodsBoxCols = 4; //每行4列
				} else if(ww <= 2000){
					this.goodsBoxCols = 5; //每行5列
				} else if(ww <= 2500){
					this.goodsBoxCols = 6; //每行6列
				} else if(ww <= 3000){
					this.goodsBoxCols = 7; //每行7列
				} else{//每行5列
					this.goodsBoxCols = 8; //每行8列
				}
			},
			isInCols(idx0, idx1){//是否在这一列中
				return ((idx1 % this.goodsBoxCols + 1) === idx0);
			},
			setViewMode(typecode){
				//this.curIndex = 0; //不能设置，否则无法触发 catechange 事件
				this.startIndex = 0;
				this.endIndex = 0;
				if(typecode === 1){
					this.viewMode = 1;
				} else {
					this.viewMode = 2;
					this.getBoxWidth();
				}
				this.initViewBox();
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.svscroll-right-header{
		padding: 0.3rem 0.5rem;
		position: sticky;
		top:0;
		z-index:1;
		background-color: #fff;
	}
	.svscroll-goods-name{
		display: -webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		overflow:hidden;
		text-overflow: ellipsis;
		font-weight: bold;
	}
	.svscroll-right-menu{
		padding:0 0.5rem;
		> li{
			display:flex;
			flex-direction: row;
			margin-bottom: 1rem;
			word-break: break-all;
			transition: transform 0.25s;
			&:active{
				opacity: 0.6;
			}
		}
	}
	.svscroll-right-flowmode{
		display: flex;
		flex-direction: row;
		padding:0 0.25rem 0 0.5rem;
		> li {
			flex-grow: 1;
			padding-right: 0.25rem;
		}
	}
	.svscroll-flowmode-subitem{
		border-radius: 0.5rem;
		margin-bottom: 0.25rem;
		padding-bottom: 0.5rem;
		overflow: hidden;
		background-color: #f3f3f3;
		&:active{
			opacity: 0.6;
		}
	}
	.svscroll-switcher-box{
		position: fixed;
		top:auto;
		right:0;
		z-index:10;
		> a{
			display:block;
			padding: 0.4rem 0.5rem;
			line-height: 1;
		}
	}
</style>