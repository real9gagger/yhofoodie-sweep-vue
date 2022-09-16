<template>
	<div class="pd-lr-1rem fx-c hi-f">
		<h3 class="ta-c pd-tb-1rem">说明</h3>
		<div class="fx-g1 of-a">
			<h4>菜品计价方式</h4>
			<p>
				1、菜品有规格或口味<br/>
				菜品总价 = (规格价格 + 口味价格) * 菜品数量 + SUM(配菜价格 * 配菜数量)<br/>
				2、没有规格和口味<br/>
				菜品总价 = 菜品价格 * 菜品数量 + SUM(配菜价格 * 配菜数量)
			</p>
			<h4 class="mg-t-1rem">最多X份</h4>
			<p>当前菜品最多可选的配菜份数</p>
			<h4 class="mg-t-1rem">仅限X份</h4>
			<p>当前配菜最大可选数量</p>
		</div>
		<div class="pd-tb-1rem">
			<p class="btnbox bg-f0 wi-f" @click="$router.back()">返回</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "helpDesc",
		data(){
			return {}
		}
	}
</script>

<style></style>