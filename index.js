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
        if(offset === true)
            this._offset+= this._limit;
        else if(offset === false)
            this._offset-= this._limit;
        else this._offset = offset;

        if(this._offset < 0) this._offset = 0;

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

    self.hasNext = function(){
        return self.total && self.total > self._offset + self._limit;
    }

    self.hasPrevious = function(){
        return self.total && self._offset > 0;
    }

    self.onError = function(reason){
        console.log("Error: ", reason)   
    }

    self.fetch = function(){
        var i = 0, target, options, requestOptions; 

        if(typeof arguments[i] === 'function') target = arguments[i++];
        else if(typeof arguments[i] === 'string') target = arguments[i++];
        else if(typeof arguments[i] === 'object' && arguments[i].nodeType) target = arguments[i++];
        else target = this.elem;

        if(typeof arguments[i] === 'object') options = arguments[i++];
        if(typeof arguments[i] === 'object') requestOptions = arguments[i++];

        this.get(options,requestOptions)
            .then(function(data){
                self.total = data.response.total_posts;
                
                self.next = function(){ 
                    self.offset(true);
                    self.fetch(target,options,requestOptions) 
                };

                self.previous = function(){
                    self.offset(false); 
                    self.fetch(target,options,requestOptions);
                };

                try{
                    self.render(target,data.response);
                } catch(error){
                    self.onError(error);
                }   

            },function(error){
                self.onError((error.message||(error.meta && error.meta.msg)||error.code||'?'));
            }
        );  

        return this;    
    }

    self.render = function(target,data,size){
        if(typeof target === 'string'){
            target = document.getElementById(container);
        }

        if(!target) throw new Error("Tumblr posts invalid target");

        var posts = data.posts;

        if(!Array.isArray(posts)) posts = [posts];

        size = mergeOptions(this._size,size);

        var html = '';

        for(var i = 0, post; post = posts[i]; i++){

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

        if(typeof target === 'function') {
            target({html:html,data:data});
        }    
        else target.innerHTML = html;

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
