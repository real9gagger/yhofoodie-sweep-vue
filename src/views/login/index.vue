<template>
	<div class="hi-f">
		<div class="pad-t-30">
			<div class="language col-sm-3">
				<div id="bbb" @click="sle_lag1" class="fiex">
					<div style="min-width: 48px;" class="pad-r-10 pad-l-10 pad-t-5 pad-b-5 f-12">{{lag}}
					</div>
					<div id="aaa" :class="{'aaa':sel_show!=0}">
						<img src="/image/pull_down.png" class="pad-t-8 mag-l-5 pull_img" />
					</div>
				</div>
				<ul v-show="sel_show!=0" class="pop bg-fff f-12" style="display: block;">
					<li v-for="list in lange_configs" @click="sel_lag(list.val)" :key="list.val">{{list.name}}</li>
				</ul>
			</div>
		</div>
		<!--登录部分-->
		<div class="wrap pad-l-35 pad-r-35 pad-t-65">
			<p class="f-25">{{b_lg['1192']}}</p>
			<p class="mag-t-30 phone_n cf"><input type="tel" v-model="forms.username" :placeholder="b_lg[1003]" class="col-sm-12 pad-b-20 pad-t-20 f-16 required" data-valid="isNonEmpty" :data-error="b_lg[1123]" /></p>
			<p class="psd cf"><input type="password" v-model="forms.password" :placeholder="b_lg[1004]" class="col-sm-12 pad-b-20 pad-t-20 f-16 required" data-valid="isNonEmpty" :data-error="b_lg[1004]" /><span style="width: 30px; height: 30px;position: absolute; top: 21px; right: 13px;" class="000 pa delete_msg" @click="clear_password()" v-show='forms.password.length>=2'></span></p>
			<!--错误提示-->
			<div class="error-box red center" style="height:70px;line-height:70px;" id="errortip"></div>
			<p class="fff center">
				<a @click="sub_form" class="bk center fff bg-red9 pad-t-15 pad-b-15 login_btn btn">{{b_lg['1001']}}</a>
			</p>
			<p class="mag-t-30 center">
				<a href="javascript:gotoPage('enterPhoneNumber.html')" class="red9 f-15 bk">{{b_lg['1005']}}？</a>
			</p>
			<p class="mag-t-10 center">
				<span>{{b_lg['1193']}}？</span>
				<a href="javascript:gotoPage('register.html')" class="red9">{{b_lg['1194']}}</a>
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "loginIndex",
		data(){
			return {
				b_lg: {},
				sel_show: false,
				forms: {
					username: "",
					password: ""
				},
				lange_configs: [
					{value: "zh", name: "简体中文"},
				]
			}
		}
	}
</script>

<style>
</style>