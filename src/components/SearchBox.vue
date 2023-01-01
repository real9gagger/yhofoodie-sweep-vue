<template>
    <div class="ps-r fx-g1">
    	<input class="search-box-input" @click="onInputClick" :placeholder="placeHolder" :readonly="readOnly" type="search" autocomplete="off" />
    	<a class="ps-a po-t-c" style="right:0.5rem"><svg class="wh-1rem fi-99"><use xlink:href="#icon_sousuo"></use></svg></a>
    </div>
</template>

<script>
    export default {
    	name: "SearchBox",//搜索框
    	props:{
    		placeHolder:{
    			type: String,
    			default: "想吃什么 搜一搜"
    		},
            readOnly:{
                type: Boolean,
                default: false
            }
    	},
    	data(){
    		return {}
    	},
    	methods:{
            onInputClick(){
                this.$emit("inputclick", 1);
            }
    	}
    }
</script>

<style scoped="scoped" lang="scss">
    .search-box-input{
    	border-radius: 1rem;
    	height: 1.8rem;
    	padding: 0 1rem;
    	width: 100%;
    	transition: width 0.5s;
    	background-color: #f0f0f0;
    	border: 0px solid $appMainColor;
    }
</style>