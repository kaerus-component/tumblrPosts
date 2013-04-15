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
	<section id="tumblr" class="posts"></section>

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
	
	<script>
		var Tumblr = require('tumblrPosts'),
			tumblr = new Tumblr('yourblog','<api_key>');
		
		/* select target and fetch */
		tumblr.posts.target('tumblr').fetch();

	</script>
</body>
</html>
```