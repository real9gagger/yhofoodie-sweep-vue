<template>
	<div class="fx-hc">
		<b class="tc-mc fx-g1 pd-t-rem5" :class="titleClass">{{counterTitle}}</b>
		<a v-if="goodsCount > 0" class="pd-t-rem5" @click="addCount(-1, $event)"><svg class="counter-choose-svg" :class="btnSize"><use xlink:href="#icon_jian1"></use></svg></a>
		<i v-if="goodsCount > 0" class="ta-c pd-t-rem5" :class="countClass">{{goodsCount}}</i>
		<a class="pd-t-rem5" @click="addCount(1, $event)">
			<svg v-if="hollowPlus" class="counter-choose-svg" :class="btnSize"><use xlink:href="#icon_jia1"></use></svg>
			<svg v-else-if="goodsCount > 0 || !multipleChoice" class="counter-choose-svg" :class="btnSize"><use xlink:href="#icon_jia2"></use></svg>
			<span v-else class="counter-choose-tip">选</span>
		</a>
	</div>
</template>

<script>
	export default {
		name: "goodsCounter",
		props: {
			goodsCount:{
				type: Number,
				default: 0
			},
			cateIndex:{
				type: Number,
				default: -1
			},
			goodsIndex:{
				type: Number,
				default: -1
			},
			multipleChoice: {//是否多选
				type: Boolean,
				default: false
			},
			hollowPlus: {//是否是空心加号
				type: Boolean,
				default: false
			},
			counterTitle:{
				type: String,
				default: ""
			},
			titleClass:{
				type: String,
				default: ""
			},
			countClass:{
				type: String,
				default: "wi-2rem"
			},
			btnSize:{
				type: String,
				default: "small"
			}
		},
		data(){
			return {}
		},
		methods:{
			addCount(val, evt){
				evt.preventDefault();
				evt.stopPropagation();
				
				var theData = {
					newCount: 			this.goodsCount + val,
					multipleChoice: 	this.multipleChoice,
					actionValue: 		val,
					clickedElem: 		(this.cateIndex >= 0 && val >= 0 ? evt.currentTarget : null),//被点击的元素
					cateIndex: 			this.cateIndex,
					goodsIndex: 		this.goodsIndex
				};
				
				this.$emit("change", theData);
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.counter-choose-tip{
		background-color: $appMainColor;
		color: #fff;
		display: inline-block;
		border-radius: 1rem;
		font-size: 0.7rem;
		padding: 0.25rem;
		min-width: 1.2rem;
		line-height: 1;
	}
	.counter-choose-svg{
		fill: $appMainColor;
		overflow: hidden;
		&.small{
			height: 1.2rem;
			width: 1.2rem;
		}
		&.middle{
			height: 1.6rem;
			width: 1.6rem;
		}
		&.large{
			height: 2rem;
			width: 2rem;
		}
	}
</style>