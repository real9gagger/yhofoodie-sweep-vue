//全局语言包
import yhoStore from '@/utils/yhostore'

let ll_type = yhoStore.get("location_language");
if(!ll_type || !/^(zh|en|ms)$/g.test(ll_type)){
	ll_type = "zh";
}
let langPack = require(`@/languages/${ll_type}.json`);

export default {
	install: function(vue){
		vue.prototype.$yhoI18n = function(code, args){ //args 数组，如 "我现在有$[0]元，收入 $[1] 元" ，索引从 0 开始。
			if(!code) {
				return "";
			}else if(!args){
				return (langPack[code] || "");
			}else if(!Array.isArray(args)){
				return (langPack[code] || "").replace(/\$\[0\]/g, args.toString());
			}else{
				return (langPack[code] || "").replace(/\$\[\d+\]/g, function(mm){
					let nth = +mm.substr(2, mm.length - 3);
					if(nth >= 0 && nth < args.length){
						return args[nth];
					} else {
						return mm;
					}
				});
			}
		};
		
		vue.prototype.$yhoLang = function(type){
			if(type && /^(zh|en|ms)$/g.test(type)){
				ll_type = type;
				yhoStore.set("location_language", ll_type);
				langPack = require(`@/languages/${ll_type}.json`);
				return type;
			} else {
				return ll_type;
			}
		} //本地语言
	}
}

export function getLangeType(){
	return ll_type;
}