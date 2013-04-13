var Tumblr = require('tumblr'),
	strftime = require('strftime');

function TumblrPosts(user,key){
	this.tumblr = new Tumblr(user,key);

	this._time = strftime;
	this._format = '%B %d, %Y %H:%M:%S';
}

TumblrPosts.prototype.target = function(container){
	if(typeof container === 'string')
		this.elem = document.getElementById(container);
	else this.elem = container;

	return this;
}

TumblrPosts.prototype.get = function(options,requestOptions){
	return this.tumblr.get('posts',options,requestOptions);
}

TumblrPosts.prototype.dateFormat = function(format,i18n){
	this._format = format;

	if(i18n) this._time = strftime.localizedStrftime(i18n);

	return this;
}

TumblrPosts.prototype.date = function(date,i18n){
	return this._time(this._format,new Date(Date(date)),i18n);
}

TumblrPosts.prototype.render = function(posts,size){

	var post;
	
	if(!Array.isArray(posts)) posts = [posts];

	if(size === undefined) size = 0;

	var html = '<ul class="tumblr">\n';

	for(var i = 0, l = posts.length; i < l; i++){
		post = posts[i];

		html+= '<li class="'+post.type+'">\n';
		html+='<h4>'+this.date(post.timestamp)+'</h4>\n';

		switch(post.type){
			case 'text':
				html+='<caption><h2>'+post.title+'</h2></caption>\n';
				html+='<span>'+post.body+'</span>';

				break;
			case 'photo':
				html+='<caption>'+post.caption+'</caption>\n';
				html+='<span>\n';

				post.photos.forEach(function(photo){
					html+='<img src="'+photo.alt_sizes[size].url+'">\n';
				});

				html+='</span>\n';

				break;
			case 'audio':
				html+='<caption>'+post.caption+'</caption>\n';
				html+='<span>'+post.embed+'</span>\n';
				break;
			case 'video':
				html+='<caption>'+post.caption+'</caption>\n';
				html+='<span>'+post.embed+'</span>\n';
				break;
			default:
				console.log("Ignoring post type:", post.type);					
		}

		html+= '</li>\n';
	} 

	html+= '</ul>\n';

	this.elem.innerHTML = html;

	return this;
}	

module.exports = TumblrPosts;
