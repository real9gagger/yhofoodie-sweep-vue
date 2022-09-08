<template>
	<div></div>
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