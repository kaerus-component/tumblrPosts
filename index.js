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

TumblrPosts.prototype.date = function(date){
	return this._time(this._format,new Date(date*1000));
}

function mergeOptions(target,source){
    for(var key in source) {
        target[key] = source[key];
    }
    
    return target;
}

function altSizeUrl(alts,size){
	var l = alts.length-1, s = size > l ? l : size;
	return alts[s].url;
}

function playerSizeEmbed(players,size){
	var l = players.length-1, s = size > l ? l : size;
	return players[s].embed_code;
}

TumblrPosts.prototype.render = function(posts,options){

	var post;
	
	if(!Array.isArray(posts)) posts = [posts];

	options = mergeOptions({player:{size:0}, photo:{size:0}},options);

	var html = '';

    for(var i = 0, l = posts.length; i < l; i++){
		post = posts[i];

		if(['text','photo','video','audio'].indexOf(post.type)<0) continue;

		html+= '<article class="'+post.type+'">\n';
		html+='<header>\n';
		html+='<time datetime="'+ post.date +'">'+this.date(post.timestamp)+'</time>\n';

		switch(post.type){
			case 'text':
                html+=post.title+'\n';
                html+='</header>\n';
                html+='<span>'+post.body+'</span>';

                break;
            case 'photo':
                html+=post.caption+'\n';
                html+='</header>\n';

                post.photos.forEach(function(photo){
                    html+='<figure>\n';
                    html+='<img src="'+altSizeUrl(photo.alt_sizes,options.photo.size)+'">\n';
                    if(photo.caption) html+='<figcaption>'+photo.caption+'</figcaption>\n';
                    html+='</figure>';
                });

                break;
            case 'audio':
                html+=post.caption+'\n';
                html+='</header>\n';
                html+='<span>'+post.embed+'</span>\n';
                
                break;
            case 'video':
                html+=post.caption+'\n';
                html+='</header>\n';
                html+='<span>\n';
                html+=playerSizeEmbed(post.player,options.player.size);
                html+='</span>\n';
                
                break;				
        }

        if(post.tags.length) 
            html+='<footer>'+post.tags.join(' ')+'</footer>\n';

        html+= '</article>\n';
    } 

    this.elem.innerHTML = html;

    return this;
}	

module.exports = TumblrPosts;
