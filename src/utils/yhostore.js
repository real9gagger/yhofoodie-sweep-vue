function yhoStore(){
	this.NAME_PREFIX = ("yhofoodie_");
}

yhoStore.prototype.get = function(name, defval){
	return localStorage.getItem(this.NAME_PREFIX + name) || defval;
}

yhoStore.prototype.getObject = function(name, remove){
	let keyname = this.NAME_PREFIX + name;
	let jsonStr = localStorage.getItem(keyname);
	
	if(remove){
		localStorage.removeItem(keyname);
	}
	
	if(jsonStr){
		try {
			return JSON.parse(jsonStr);
		} catch(ex) {
			console.error(ex);
		}
	}
	
	return null;
}

yhoStore.prototype.pick = function(name, defval){
	let keyname = this.NAME_PREFIX + name;
	let value = localStorage.getItem(keyname);
	localStorage.removeItem(keyname);
	return (value || defval);
}

yhoStore.prototype.set = function(name, value){
	localStorage.setItem(this.NAME_PREFIX + name, value);
}

yhoStore.prototype.setObject = function(name, obj){
	localStorage.setItem(this.NAME_PREFIX + name, JSON.stringify(obj));
}

yhoStore.prototype.remove = function(name){
	localStorage.removeItem(this.NAME_PREFIX + name);
}

yhoStore.prototype.clear = function(){
	localStorage.clear();
}

yhoStore.prototype.onceObject = function(name, obj){
	if((typeof obj) === "undefined"){
		let jsonStr = sessionStorage.getItem(this.NAME_PREFIX + name);
		if(jsonStr){
			return JSON.parse(jsonStr);
		}
	} else if (obj === null){
		sessionStorage.removeItem(this.NAME_PREFIX + name);
	} else {
		sessionStorage.setItem(this.NAME_PREFIX + name, JSON.stringify(obj));
	}
	return null;
}

yhoStore.prototype.onceString = function(name, obj){
	if(obj === undefined){
		return sessionStorage.getItem(this.NAME_PREFIX + name);
	} else if (obj === null){
		sessionStorage.removeItem(this.NAME_PREFIX + name);
	} else {
		sessionStorage.setItem(this.NAME_PREFIX + name, obj);
	}
	return null;
}

let storeHelper = new yhoStore();

export default storeHelper