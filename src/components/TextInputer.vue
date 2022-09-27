<template>
	<div class="hi-f bg-f0">
		<div class="fx-hc bg-mc bg-lg-l1 tc-ff hi-3rem pd-lr-rem5">
			<back-button class="fx-g1"></back-button>
			<div class="fx-g3 ta-c">{{myTitle}}</div>
			<div class="fx-g1 ta-r" @click="onDone">完成</div>
		</div>
		<div class="mg-t-1rem ps-r" id="textInputerContentBox">
			<input v-if="boxType==='number'" v-model="inputValue" type="number" class="text-inputer-box ta-c fs-2rem ls-2px" placeholder="请输入数字" />
			<input v-else-if="boxType==='tel'" v-model="inputValue" type="tel" class="text-inputer-box ta-c fs-1rem5 ls-2px" placeholder="请输入手机号码" />
			<template v-else >
				<textarea v-model="inputValue" class="text-inputer-box" maxlength="160" placeholder="请输入内容"></textarea>
				<p class="ps-a tc-cc" style="bottom:0;right:0.25rem">{{160 - inputValue.length}}</p>
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
			setTimeout(function(){
				$("#textInputerContentBox").children("input,textarea").focus();
			}, 500);
		},
		methods:{
			onDone(){
				this.$store.commit("setTextInputerValue", this.inputValue);
				this.$router.back();
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