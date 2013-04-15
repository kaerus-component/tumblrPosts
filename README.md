tumblrPosts
===========

Tumblr posts plugin component

```html
<!doctype html>
<html>
<head>
	<title>Tumblr test</title>
</head>
<body>
	<section id="tumblr" class="posts">
	</section>
	<style type="text/css">
		* {margin:0;padding:0;}

		body { width: 40em;margin:0 auto;}

		section.posts {
			overflow: wrap;
			border: 1px solid grey;
		}

		section.posts article {
			padding: 1em;
		}

		section.posts article time {
			float: right;
		}

		section.posts article.text p {
			padding: 1em;
		}

		section.posts article.photo figure {
			margin-top: 1em;
		}

		section.posts article.audio iframe {
			margin-top: 1em;
		}

		section.posts article.video iframe {
			margin-top: 1em;
		}

	</style>
	
	<script src="../build/build.js"></script>
	<script>
		var Tumblr = require('tumblrPosts'),
			tumblr = new Tumblr('user','<key>');
		
		var target = document.getElementById('tumblr');

		tumblr.posts.fetch(function(response){
			console.log(response.data);
			target.innerHTML = response.html; 
		}).onError = function(message){
			target.innerHTML = "Failed to retrieve posts: " + message; 
		};	

	</script>
</body>
</html>
```

License
=======
```
Copyright (c) 2013 Kaerus (kaerus.com), Anders Elo <anders @ kaerus com>.
```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.