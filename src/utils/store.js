function yhoStore(){
	this.NAME_PREFIX = ("yhowaiter_");
}

yhoStore.prototype.get = function(name, defval){
	return localStorage.getItem(this.NAME_PREFIX + name) || defval;
}

yhoStore.prototype.set = function(name, value){
	return localStorage.setItem(this.NAME_PREFIX + name, value);
}

yhoStore.prototype.remove = function(name){
	return localStorage.removeItem(this.NAME_PREFIX + name);
}

yhoStore.prototype.pick = function(name, defval){
	let keyname = this.NAME_PREFIX + name;
	let value = localStorage.getItem(keyname);
	localStorage.removeItem(keyname);
	return (value || defval);
}

yhoStore.prototype.clear = function(){
	return localStorage.clear();
}

export default new yhoStore