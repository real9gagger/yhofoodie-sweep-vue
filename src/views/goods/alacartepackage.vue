<template>
	<transition name="package-slideup">
		<div v-if="packageInfo" class="package-goods-container fx-c">
			<div class="fx-g1" @click="showMe()"><!--占位专用--></div>
			<div class="content-box">
				<div class="fx-r ps-s bg-ff pd-t-1rem pd-b-rem5 pd-lr-rem5">
					<div @click="gotoDetails($event)">
						<img :src="getSrc(packageInfo.goods_thumb)" class="wh-5rem br-rem5 bg-f0"/>
					</div>
					<div class="fx-g1 pd-l-rem5">
						<p class="fw-b fx-r">
							<span class="fx-g1 fs-1rem">{{packageInfo.goods_name}}</span>
							<a class="pd-lr-rem5" @click="showMe()"><svg class="wh-rem8 fi-cc va-tt"><use xlink:href="#icon_close1"></use></svg></a>
						</p>
						<p class="fx-hc" @click="gotoDesc()">
							<b class="tc-mc fs-1rem">{{packageInfo.total_price}}</b>
							<span class="fx-g1 ta-r tc-cc">计价方式</span>
							<svg class="wh-1em fi-cc mg-l-rem2"><use xlink:href="#icon_wenhao1"></use></svg>
						</p>
					</div>
				</div>
				<div class="fx-hc pd-rem5">
					<span class="fw-b fx-g1">数量</span>
					<a @click="changeCount(0)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jian1"></use></svg></a>
					<span class="ta-c wi-1rem5">{{packageInfo.goods_count}}</span>
					<a @click="changeCount(1)" class="pd-lr-rem5"><svg class="wh-1rem2 fi-mc"><use xlink:href="#icon_jia1"></use></svg></a>
				</div>
				<div class="fx-hc pd-tb-rem5 pd-l-rem5 pd-r-1rem">
					<b class="fx-g1">打包</b>
					<mu-switch v-model="isPack"></mu-switch>
				</div>
				<template v-if="packageInfo.package_cate_list">
					<div class="pd-rem5" v-for="vxo in packageInfo.package_cate_list" :key="vxo.id">
						<h4 class="fw-b">{{vxo.cate_name}} <span v-if="vxo.count > 0" class="pd-l-rem5 tc-99">{{vxo.goods_list.length}} 选 {{vxo.count}}</span></h4>
						<ul>
							<li v-for="subitem in vxo.goods_list" :key="subitem.id">
								<div class="fx-r mg-t-rem5">
									<img :src="getSrc(subitem.goods_thumb)" class="wh-4rem bg-f0 br-rem5" />
									<p class="pd-l-rem5">{{subitem.goods_name}}</p>
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
		</div>
	</transition>
</template>

<script>
	import constVars from '@/apis/const'
	import yhoStore from '@/utils/yhostore'
	import { mapGetters } from 'vuex'
	import { getGoodsObject } from '@/apis/goods'
	
	/* 套餐点菜框 */
	export default {
		name: "goodsAlacartePackage",
		data(){
			return {
				packageInfo: null,
				isPack: false
			}
		},
		computed: {
			...mapGetters(["textInputerValue"])
		},
		mounted() {
			this.showMe(yhoStore.onceObject("selected_goods_infos"));
		},
		methods:{
			showMe(pinfos){//显示面板...
				if(pinfos){
					let newer = JSON.parse(JSON.stringify(pinfos)); //深度复制一份，防止污染原数据
					
					if(this.$isEmpty(newer.package_cate_list)){
						newer.package_cate_list = null;
					} else {
						$.each(newer.package_cate_list, function(idx, item){
							for(let subitem of item.goods_list){
								let gobj = getGoodsObject(subitem.goods_id);
								if(gobj){
									subitem.goods_name = gobj.goods_name;
									subitem.goods_thumb = gobj.goods_thumb;
								} else {
									subitem.goods_name = `Goods${subitem.goods_id}`;
									subitem.goods_thumb = "";
								}
							}
						});
					}
					
					newer.total_price = newer.goods_price;
					newer.goods_count = 1;
					
					this.packageInfo = newer;
				} else {
					this.packageInfo = null;
				}
			},
			getSrc(url){
				if(url){
					return (constVars.OSS_IMG_PATH + url + constVars.OSS_IMG_SIZE_FOR_LIST);
				} else {
					return "/image/foods_icon.png";
				}
			},
			gotoDetails(evt){//查看菜品详情
				let imgWhRatio = 0;
				if(this.packageInfo.goods_thumb){
					imgWhRatio = getImageHwRatio($(evt.currentTarget).children("img").get(0));
				}
				
				yhoStore.onceObject("selected_goods_infos", this.packageInfo); //选中的菜品信息
				this.$router.push({
					path: "/details",
					query: {
						gid: this.packageInfo.id,
						ratio: imgWhRatio,
						cname: "其他"
					}
				});
			},
			gotoDesc(){//转到说明
				this.$router.push("/helpdesc");
			},
			changeCount(isAdded){//点菜数量
				if(isAdded){
					this.packageInfo.goods_count++;
				} else if(this.packageInfo.goods_count > 1){
					this.packageInfo.goods_count--;
				}
				this.recalcPrice();
			},
			addBeizhu(){
				this.$router.push({
					path: "/inputer",
					query: {
						title: "自定义备注",
						value: this.textInputerValue
					}
				});
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	$maskBoxBgColor: rgba(0,0,0,0.6);
	
	.package-goods-container{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 20;
		touch-action: manipulation;
		background-color: $maskBoxBgColor;
		> .content-box{
			max-height: 90%;
			overflow: auto;
			transition: inherit;
			position: relative;
			transform: translateY(0);
			border-radius: 1rem 1rem 0 0;
			background-color: #fff;
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
	
	/* 向上滑出动画 */
	.package-slideup-enter{ 
		background-color: rgba(0,0,0,0.0);
		> .content-box { 
			transform: translateY(100%) 
		}
	}
	.package-slideup-enter-active{ transition: all 0.4s }
	.package-slideup-enter-to{
		background-color: $maskBoxBgColor;
		> .content-box { 
			transform: translateY(0) 
		}
	}
	.package-slideup-leave{ 
		background-color: $maskBoxBgColor;
		> .content-box { 
			transform: translateY(0) 
		}
	}
	.package-slideup-leave-active{ transition: all 0.4s }
	.package-slideup-leave-to{
		background-color: rgba(0,0,0,0.0);
		> .content-box { 
			transform: translateY(100%) 
		}
	}
</style>