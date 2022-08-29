<template>
	<div class="hi-f fx-c">
		<div class="ta-c">
			<p>扫码点餐</p>
		</div>
		<div class="fx-r fx-g1 of-h">
			<div class="hi-f of-a">
				<ul class="select-left-menu">
					<template v-for="item,index in shopGoods.list">
						<li :class="{activing: index === cateIndex}" @click="onCateClicked(index)">
							<span>{{item.goods_cate_name}}</span>
						</li>
					</template>
				</ul>
			</div>
			<div class="fx-g1 of-a ps-r">
				<template v-for="item,index in shopGoods.list">
					<h4 class="select-right-header" :id="'cateheader_' + item.id">{{item.goods_cate_name}}</h4>
					<ul class="select-right-menu">
						<li v-for="subitem,subindex in item.goods_list">
							<div class="fx-r">
								<img src="../../../public/image/waiter_happy.png" />
								<div>
									<span>{{subitem.goods_name}}</span>
								</div>
							</div>
						</li>
					</ul>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	/* 选菜界面 */
	import { getShopGoods } from '@/config/goods'
	
	export default {
		name: "orderSelect",
		data(){
			return {
				shopGoods: [],
				cateIndex: 0,
			}
		},
		computed:{
			cateGoods(){
				return (this.shopGoods.list[this.cateIndex].goods_list || []);
			}
		},
		mounted() {
			var $mine = this;
			getShopGoods().then((goods) => {
				$mine.shopGoods = goods;
				console.log(goods)
			})
		},
		methods:{
			onCateClicked(idx){
				this.cateIndex = idx;
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.select-left-menu{
		width: 120px;
		word-break: break-all;
		white-space: pre-wrap;
		background-color: #f0f0f0;
		& > li{
			padding: 10px;
			&.activing{
				background-color: #fff;
			}
		}
	}
	
	.select-right-header{
		padding: 10px;
		position: sticky;
		top:-1px;
		z-index:1;
		background-color: #fff;
	}
	.select-right-menu{
		& > li{
			padding:5px 10px;
			img {
				width: 100px;
				height: 100px;
				vertical-align: middle;
			}
		}
	}
</style>