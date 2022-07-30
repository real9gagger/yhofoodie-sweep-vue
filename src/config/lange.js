//全局语言包
import yhoStore from '@/utils/store'

let ll_type = yhoStore.get("location_language");
if(!ll_type || !/^(zh|en|ms)$/g.test(ll_type)){
	ll_type = "zh";
}
let langPack = require(`@/languages/${ll_type}.json`);

export default {
	install: function(vue){
		vue.prototype.$yhoi18n = function(code, args){ //args 数组，如 "我现在有$[1]元，收入 $[2] 元" ，索引从 1 开始。
			if(!code) {
				return "";
			}else if(!args){
				return (langPack[code] || "");
			}else if(!Array.isArray(args)){
				return (langPack[code] || "").replace(/\$\[1\]/g, args.toString());
			}else {
				return (langPack[code] || "").replace(/\$\[\d+\]/g, function(mm){
					let nth = +mm.substr(2, mm.length - 3);
					if(nth >= 1 && nth <= args.length){
						return args[nth - 1];
					} else {
						return "";
					}
				});
			}
		};
		
		vue.prototype.$yholang = function(type){
			if(type && /^(zh|en|ms)$/g.test(type)){
				ll_type = type;
				yhoStore.set("location_language", ll_type);
				langPack = require(`@/languages/${ll_type}.json`);
			} else {
				return ll_type;
			}
		} //本地语言
	}
}