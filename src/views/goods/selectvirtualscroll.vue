<template>
	<div @scroll="onBoxScrolling" id="rightMenuContainer">
		<div :style="`height:${offsetHeight1}px`" title="虚拟滚动-顶部占位专用"></div>
		<template v-for="item,ix0 in goodsData">
			<template v-if="ix0 >= startIndex && ix0 <= endIndex">
				<h4 class="svscroll-right-header" :key="item.id">{{item.goods_cate_name}}</h4>
				<ul class="svscroll-right-menu" :key="item.cate_key">
					<li v-for="subitem,ix1 in item.goods_list" :key="subitem.goods_key" @click="onItemClick($event, subitem)">
						<goods-image :pic-src="subitem.goods_thumb" :goods-name="subitem.goods_name"></goods-image>
						<div class="fx-g1 fx-c pd-l-rem5">
							<p class="svscroll-goods-name">{{subitem.goods_name}}</p>
							<p class="pd-t-rem3 tc-99 fs-rem6" v-if="subitem.sales != 0">销量 {{subitem.sales}}</p>
							<p class="pd-t-rem3 tc-99 fs-rem6" v-if="subitem.goods_material && subitem.goods_material.length <= 30">{{subitem.goods_material}}</p>
							<p class="fx-g1"><!--占位专用--></p>
							<p v-if="!item.isAvailableCate || subitem.status != 1" class="tc-99 fx-r">
								<b>{{subitem.goods_price}}</b>
								<span class="fx-g1 pd-l-rem5 ta-r">不在可售时间内</span>
							</p>
							<counter-goods v-else 
								class="mg-t-rem5"
								:goods-count="cartTotalInfo[item.cate_key + subitem.goods_key]" 
								:cate-index="ix0"
								:goods-index="ix1"
								:multiple-choice="subitem.is_multiple_choice" 
								:counter-title="subitem.goods_price"
								@change="onCounterChange"></counter-goods>
						</div>
					</li>
				</ul>
			</template>
		</template>
		<div :style="`height:${offsetHeight2}px`" title="虚拟滚动-底部占位专用"></div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
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
				isDontHandleScroll: false, //是否处理滚动事件
				isFindingCate: false, //节流专用
				h4OffsetTops: []
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
				let iLast = this.h4OffsetTops.length - 1;
				if(this.endIndex >= iLast){
					return 0;
				} else if(this.endIndex < iLast){
					return 1000;
				} else {
					return 0;
				}
			}
		},
		components:{
			counterGoods,
			goodsImage
		},
		methods:{
			initViewBox(){
				var $mine = this;
				setTimeout(function(){
					$mine.endIndex = 88888888;
					$mine.$nextTick(function(){
						$mine.h4OffsetTops = [];
						$("#rightMenuContainer").children("h4").each(function(index, h4dom){
							$mine.h4OffsetTops.push(h4dom.offsetTop);
						});
						$mine.endIndex = this.getEndIndex(0);
					});
				}, 800);
			},
			setCateIndex(idx){
				this.curIndex = idx;
				this.startIndex = (idx - 1);
				this.endIndex = this.getEndIndex(idx);
				this.isDontHandleScroll = true;
				this.$nextTick(function(){
					$("#rightMenuContainer").scrollTop(this.h4OffsetTops[this.curIndex]);
				});
			},
			onItemClick(evt, vxo){
				this.$emit("itemclick", evt, vxo);
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
				
				let elem = (evt.currentTarget);
				let sTop = elem.scrollTop;
				
				let cIndex = this.binarySearchIndex(this.startIndex, this.endIndex, sTop);
				if(this.curIndex !== cIndex){
					this.curIndex = cIndex;
					this.startIndex = (cIndex - 1);
					this.endIndex = this.getEndIndex(cIndex);
					this.$emit("catechange", cIndex);
				}
				
				this.isFindingCate = false;
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
		& > li{
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
</style>