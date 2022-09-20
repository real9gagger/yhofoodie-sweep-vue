<template>
	<div class="hi-f bg-f0">
		<div class="fx-hc bg-mc bg-lg-l1 tc-ff hi-3rem pd-lr-rem5">
			<back-button class="fx-g1"></back-button>
			<div class="fx-g1 ta-c fs-1rem">{{myTitle}}</div>
			<div class="fx-g1 ta-r fs-1rem" @click="onDone">完成</div>
		</div>
		<div class="mg-t-1rem ps-r" id="textInputerContentBox">
			<input v-if="boxType==='number'" v-model="inputValue" type="number" class="text-inputer-box ta-c fs-2rem ls-2px" placeholder="请输入数字" />
			<input v-else-if="boxType==='tel'" v-model="inputValue" type="tel" class="text-inputer-box ta-c fs-1rem5 ls-2px" placeholder="请输入手机号码" />
			<template v-else>
				<textarea v-model="inputValue" class="text-inputer-box fs-1rem" maxlength="160" placeholder="请输入内容"></textarea>
				<p class="ps-a po-br-0 tc-cc pd-r-rem5 pd-b-rem5 lh-1x">{{160 - inputValue.length}}</p>
			</template>
		</div>
	</div>
</template>

<script>
	import backButton from './BackButton'
	export default {
		name: "TextInputer",//文本输入框
		data(){
			return {
				myTitle: "",
				boxType: "text",
				inputValue: ""
			}
		},
		components: { backButton },
		mounted() {
			var params = this.$route.query;
			this.myTitle = params.title || "请输入内容";
			this.boxType = params.type || "text";
			this.inputValue = params.value || "";
			this.$nextTick(function(){
				$("#textInputerContentBox").children("input,textarea").focus();
			});
		},
		methods:{
			onDone(){
				this.$emit("ondone", this.inputValue);
			}
		}
	}
</script>

<style scoped="scoped">
	.text-inputer-box{
		resize: none;
		width: 100%;
		border: 0;
		background-color: #fff;
		height: 10rem;
		padding: 0.5rem;
		vertical-align: middle;
	}
	.text-inputer-box.ls-2px{
		letter-spacing: 2px;
	}
</style>