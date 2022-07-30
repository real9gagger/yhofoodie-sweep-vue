import axios from 'axios'
import qs from 'qs'

//var throttleTimerID = 0;
//let apiBasePath = "/yhoapi?ver=11&mo=s2&a="; //https://api.foodie.vc/interface.php?ver=11&mo=s2&a=";

export default {
	install: function(vue){
		vue.prototype.$yhoajax = function(api_name, post_data) {
			if(!post_data){
				post_data = {};
			}
			return axios({
				url: "/yhoapi?ver=11&mo=s2&a=" + api_name,
				headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
				method: "POST",
				data: qs.stringify(post_data)
			}).then(response => {
				if(response && response.data){
					return response.data;
				} else {
					return {msg: "无响应数据", status: 0};
				}
			});
		}
	}
}

/* export const getDataFrom = (api_name, req_params) => {
  if(!req_params){
    req_params = {};
  }
  
  return axios({
    url: api_name,
    method: "GET",
    params: req_params,
    //cache: !req_params.pleaseDoNotCacheMe //是否缓存，默认 true
  }).then((response) => {
    //console.log(response)
    if(response && response.data && !response.data.code){//code值：0 或者 undefined
      return response.data.data;
    }
    return null;
  });
}

export const postDataTo = (api_name, post_data) => {
  return axios({
    url: api_name,
    headers: { "Content-Type":"application/json; charset=UTF-8" },
    method: "POST",
    data: post_data
  }).then((response) => {
    if(response && response.data && !response.data.code){//code值：0 或者 undefined
      return response.data.data;
    }
    return null;
  });
}

export const putDataTo = (api_name, post_data) => {
  return axios({
    url: api_name,
    headers: { "Content-Type":"application/json; charset=UTF-8" },
    method: "PUT",
    data: post_data
  }).then((response) => {
    if(response && response.data && !response.data.code){//code值：0 或者 undefined
      return response.data.data;
    }
    return null;
  });
}

export const deleteDataFrom = (api_name, req_params) => {
  if(!req_params){
    req_params = {};
  }
  
  return axios({
    url: api_name,
    method: "DELETE",
    params: req_params
  }).then((response) => {
    if(response && response.data && !response.data.code){//code值：0 或者 undefined
      return response.data.data;
    }
    return null;
  });
}

//任务调用定时器
export const taskScheduleTimer = (callfn, interval, times) => {
  if((typeof callfn !== "function") || !callfn){
    return 0;
  }
  
  if((typeof interval !== "number") || interval <= 0){
    return 0;
  }
  
  if((typeof times !== "number") || times <= 0){
    return 0;
  }
  
  let timerID = setInterval(() => {
    if(--times < 0){
      //console.log("执行 N 次后，关闭了任务定时器");
      clearInterval(timerID);
    } else {
      //console.log(timerID);
      callfn(timerID);
    }
  }, interval);
  
  return timerID;
}

//防抖函数 / 节流函数
export const throttleCall = (callfn, waits, args) => {
  if((typeof callfn !== "function") || !callfn){
    return 0;
  }
  
  if((typeof waits !== "number") || waits <= 0){
    return 0;
  }
  
  clearTimeout(throttleTimerID);
  
  throttleTimerID = setTimeout(function(){
    callfn.apply(null, args);
  }, waits);
  
  return throttleTimerID;
}
 */