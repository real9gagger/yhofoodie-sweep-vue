<template>
  <div class="error404">
    <div class="error404-body-con">
		<div class="tc-mc ta-c fs-1rem5 fw-b">ERROR</div>
		<div class="fw-b ta-c">{{theUrl}}</div>
        <div class="error404-body-con-title">4<span>0</span>4</div>
        <div class="error404-body-con-message">
			<p>找不到此页面</p>
			<p style="margin-top:10px;">YOU&nbsp;LOOK&nbsp;LOST</p>
		</div>
        <div class="error404-body-con-btns">
          <a @click="goHome" class="tc-mc">返回主页</a>
          <a @click="backPage" class="tc-mc" style="margin-left: 40px;">返回上一页</a>
        </div>
    </div>
	<div class="error404-copy-right">www.yhofoodie.com</div>
  </div>
</template>

<script>
export default {
  name: "errorHttp404",
  data(){
	  return {
		  theUrl: ""
	  }
  },
  mounted() {
	  if(this.$route.redirectedFrom){
		  this.theUrl = "URL: /#" + this.$route.redirectedFrom
	  }
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push("/home");
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes error404animation {
  0% {
    transform: rotateZ(0deg);
  }
  20% {
    transform: rotateZ(-60deg);
  }
  40% {
    transform: rotateZ(-10deg);
  }
  60% {
    transform: rotateZ(50deg);
  }
  80% {
    transform: rotateZ(-20deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.error404 {
	width: 100vw;
	height: 100vh;
	&-body-con {
		max-width: 800px;
		height: 400px;
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 1;
		transform: translate(-50%, -50%);
		width: 100%;
		&-title {
			text-align: center;
			font-size: 160px;
			font-weight: 700;
			color: #2d8cf0;
			span {
				display: inline-block;
				color: #19be6b;
				font-size: 140px;
				padding:0 10px;
				animation: error404animation 3s ease 0s infinite alternate;
			}
		}
		&-message {
			display: block;
			text-align: center;
			font-size: 20px;
			font-weight: 500;
			letter-spacing: 2px;
			color: #999;
			margin-top: 20px;
		}
		&-btns {
			text-align: center;
			padding:40px 0 20px 0;
			font-weight: bold;
			font-size: 20px;
		}
	}
	&-copy-right {
		text-align: center;
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 10px;
		color: #f0f0f0;
		font-size: 16px;
	}
}
</style>
