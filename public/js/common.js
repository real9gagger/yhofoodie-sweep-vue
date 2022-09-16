// 精确除法
function accDiv(a1, a2) {
	if(!a1 || !a2) return 0;
	
	var s1 = a1.toString(),
		s2 = a2.toString();
	var i0 = 0,
		r1 = 0,
		r2 = 0,
		m0 = 0;
	
	i0 = (s1.indexOf(".") + 1);
	r1 = (i0 ? s1.length - i0 : 0);
	
	i0 = (s2.indexOf(".") + 1);
	r2 = (i0 ? s2.length - i0 : 0);
	
	m0 = Math.pow(10, r1 + r2);
	
	return ((Math.round(a1 * m0) / Math.round(a2 * m0)) || 0);
}

// 精确乘法
function accMul(a1, a2) {
	if(!a1 || !a2) return 0;
	
	var s1 = a1.toString(),
		s2 = a2.toString();
	var i0 = 0,
		r1 = 0,
		r2 = 0,
		m0 = 0;
	
	i0 = (s1.indexOf(".") + 1);
	r1 = (i0 ? s1.length - i0 : 0);
	
	i0 = (s2.indexOf(".") + 1);
	r2 = (i0 ? s2.length - i0 : 0);
	
	m0 = Math.pow(10, r1 + r2);
	
	return ((Math.round(m0 * a1 * a2) / m0) || 0);
}

// 精确减法
function accSub(a1, a2) {
    if(!a1) a1 = 0;
    if(!a2) a2 = 0;
    
    var s1 = a1.toString(),
    	s2 = a2.toString();
    var i0 = 0,
    	r1 = 0,
    	r2 = 0,
    	m0 = 0;
    
    i0 = (s1.indexOf(".") + 1);
    r1 = (i0 ? s1.length - i0 : 0);
    
    i0 = (s2.indexOf(".") + 1);
    r2 = (i0 ? s2.length - i0 : 0);
    
    m0 = Math.pow(10, (r1 >= r2 ? r1 : r2));
    
    return ((Math.round(a1 * m0 - a2 * m0) / m0) || 0);
}

// 精确加法
function accAdd(a1, a2) {
	if(!a1) a1 = 0;
	if(!a2) a2 = 0;
	
	var s1 = a1.toString(),
		s2 = a2.toString();
	var i0 = 0,
		r1 = 0,
		r2 = 0,
		m0 = 0;
	
	i0 = (s1.indexOf(".") + 1);
	r1 = (i0 ? s1.length - i0 : 0);
	
	i0 = (s2.indexOf(".") + 1);
	r2 = (i0 ? s2.length - i0 : 0);

	m0 = Math.pow(10, (r1 >= r2 ? r1 : r2));
	
	return ((Math.round(a1 * m0 + a2 * m0) / m0) || 0);
}

//图片加载失败调用的函数
function onImageLoadingError(){
	var evt = window.event;
	var img = (evt.target || evt.srcElement);
	if(evt.type === "error" && img.tagName === "IMG"){
		img.onerror = null;
		img.src = "/image/img_error.png?errorcode=LOADING_FAILED";
	}
}

//保留两位小数。避免出现 (0.575).toFixed(2) 等于 0.57 的结果
function toFixed2(str){
	if(!str){
		return "0.00";
	}
	
	let num_str = str.toString();
	let d_fixed = 2; //保留多少位小数
	let num_arr = num_str.split(".");
	let dec_num = (num_arr[1] ? num_arr[1].length : 0);//原数中有多少位小数位数 90.8976
	
	if(d_fixed < dec_num){
		num_str = ( num_arr[0] 
				  + num_arr[1].substr(0, d_fixed)
				  + "."
				  + num_arr[1].substr(d_fixed));  //移动小数点"
		num_str = (Math.round(+num_str) / Math.pow(10, d_fixed)).toString();// 是一个整数
		
		dec_num = num_str.indexOf(".") + 1;
		dec_num = (dec_num > 0 ? num_str.length - dec_num: 0);//原数中有多少位小数位数 90.8976
	}
	
	if(d_fixed === dec_num){
		return num_str;
	}else if(dec_num === 0){//原数中无小数点
		return (num_str + ".00000000000000000000000000000000".substr(0, d_fixed - dec_num + 1));
	}else{//有小数点
		return (num_str + ".00000000000000000000000000000000".substr(1, d_fixed - dec_num));
	}
}

// 最多保留 2 位小数！返回的是 number 类型，而 tofixed 返回的字符串
function mathRound2(num){
	let real_num = (+num || 0);
	let pows = 100; //默认 两位小数
	return Math.round(real_num * pows) / pows;
}

//格式化日期
function formatDate(dateObj, formatStr) {
	if(!dateObj){
		dateObj = new Date();
	}
	
	if(!formatStr){
		formatStr = "yyyy-MM-dd hh:mm:ss";
	}
	
    let ooo = [
		["(y+)", dateObj.getFullYear()], //year
        ["(M+)", dateObj.getMonth() + 1], //month
        ["(d+)", dateObj.getDate()], //day
        ["(h+)", dateObj.getHours()], //hour
        ["(m+)", dateObj.getMinutes()], //minute
        ["(s+)", dateObj.getSeconds()], //second
        ["(q+)", Math.floor(dateObj.getMonth() / 3) + 1], //quarter
        ["(S+)", dateObj.getMilliseconds()] //millisecond
    ];
	
    for (let arr of ooo) {
        if (new RegExp(arr[0]).test(formatStr)) {
			let mat = RegExp.$1;
			let val = arr[1].toString();
			if(val.length >= mat.length){
				formatStr = formatStr.replace(mat, val);
			} else {
				formatStr = formatStr.replace(mat, ("00000000" + val).substr(-mat.length));
			}
        }
    }
	
    return formatStr;
}

//格式化时间戳
function formatTime(timeStamp, formatStr) {
	let ts = (timeStamp * 1000) || 0;
	return formatDate(new Date(ts), formatStr);
}

//商品加到购物车动画
function addGoodsToGwc(fromElem, toElem) {
	if(!fromElem || !toElem) return;
	
	var $toElem = $(toElem);
	var fromOffset = $(fromElem).offset();
	var toOffset = $toElem.offset();
	var startLeft = fromOffset.left;
	var startTop = fromOffset.top;
	var endLeft = toOffset.left + $toElem.width() / 2;
	var endTop = toOffset.top;
	var outerHTML = `<div class="gwc-point-outer" style="left:${startLeft}px;top:${startTop}px"><div class="gwc-point-inner">+1</div></div>`;
	var $pointOuter = $(outerHTML).appendTo(document.body);

	setTimeout(function(){
		$pointOuter.one("transitionend", function () {
			$(this).remove();
			$toElem.addClass("gwc-tada-once").one("animationend", function () {
				$(this).removeClass("gwc-tada-once");
			});
		})
		.css("transform", `translate3d(0,${endTop - startTop}px,0)`)
		.children().css("transform", `translate3d(${endLeft - startLeft}px,0,0)`);
	}, 50);
}

//购物车菜品ID，要保证唯一性
function newCartID(){
	let randNum = Math.floor(Math.random() * 1000).toString();
	if(randNum < 1000){
		randNum = "00000000".substring(0, 3 - randNum.length) + randNum; //开头补足0
	}
	return (Date.now().toString()) + randNum; //16位数字
}