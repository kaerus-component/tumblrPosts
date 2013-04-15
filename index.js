var Tumblr = require('tumblr'),
    strftime = require('strftime');


function TumblrPosts(options){
    var tumblr, self = this['posts'] = {};

    this.plugin.push(function(){ tumblr = this });

    self._time = strftime;

    self._format = '%B %d, %Y %H:%M:%S';

    self._size = {player:0, photo:0};

    self._limit = 10;

    self._offset = 0;

    self.get = function(options,requestOptions){
        options = mergeOptions({limit:this._limit,offset:this._offset},options);

        return tumblr.get('posts',options,requestOptions);
    }

    self.size = function(options){
        mergeOptions(this._size,options);

        return this;
    }

    self.limit = function(limit){
        this._limit = limit;

        return this;
    }

    self.offset = function(offset){
        this._offset = offset;

        return this;
    }

    self.dateFormat = function(format,i18n){
        this._format = format;
        if(i18n) this._time = strftime.localizedStrftime(i18n);

        return this;
    }

    self.target = function(container){
        if(typeof container === 'string')
            this.elem = document.getElementById(container);
        else this.elem = container;

        return this;
    }

    self.date = function(date){
        return this._time(this._format,new Date(date*1000));
    }

    self.fetch = function(options,requestOptions){
        this.get(options,requestOptions)
            .then(function(data){
                self.render(data.response.posts);
            },function(error){
                self.render(error);
            }
        );  

        return this;    
    }

    self.render = function(posts,size){
        var post;
        
        if(!Array.isArray(posts)) posts = [posts];

        size = mergeOptions(this._size,size);

        var html = '';

        for(var i = 0, l = posts.length; i < l; i++){
            post = posts[i];

            if(['text','photo','video','audio'].indexOf(post.type)<0) continue;

            html+= '<article class="'+post.type+'">\n';
            html+='<time datetime="'+ post.date +'">'+this.date(post.timestamp)+'</time>\n';

            switch(post.type){
                case 'text':
                    html+='<header>'+post.title+'</header>\n';
                    html+='<span>'+post.body+'</span>';

                    break;
                case 'photo':
                    html+='<header>'+post.caption+'</header>\n';

                    post.photos.forEach(function(photo){
                        html+='<figure>\n';
                        html+='<img src="'+altSizeUrl(photo.alt_sizes,size)+'">\n';
                        if(photo.caption) html+='<figcaption>'+photo.caption+'</figcaption>\n';
                        html+='</figure>';
                    });

                    break;
                case 'audio':
                    html+='<header>'+post.caption+'</header>\n';
                    html+='<span>'+post.embed+'</span>\n';
                    
                    break;
                case 'video':
                    html+='<header>'+post.caption+'</header>\n';
                    html+='<span>\n';
                    html+=playerSizeEmbed(post.player,size);
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
}

function mergeOptions(target,source){
    for(var key in source) {
        target[key] = source[key];
    }
    
    return target;
}

function altSizeUrl(alts,size){
	var l = alts.length-1, s = size.photo > l ? l : size.photo;
	return alts[s].url;
}

function playerSizeEmbed(players,size){
	var l = players.length-1, s = size.player > l ? l : size.player;
	return players[s].embed_code;
}

TumblrPosts.call(Tumblr.prototype);

module.exports = Tumblr;
