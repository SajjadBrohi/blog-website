const express = require('express');
const ejs = require('ejs');
const content = require(__dirname + '/content.js');

const app = express();

const allTheBlogs = [];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('home', { description: content.homeStartingContent(), allTheBlogs: allTheBlogs });
});

app.get('/about', (req, res) => {
	res.render('about', { description: content.aboutContent() });
});

app.get('/contact', (req, res) => {
	res.render('contact', { description: content.contactContent() });
});

app.get('/compose', (req, res) => {
	res.render('compose');
});

app.get('/posts/:blog', (req, res) => {
	allTheBlogs.forEach((blog) => {
		if (req.params.blog.toLowerCase().split(' ').join('-')
			=== blog.title.toLowerCase().split(' ').join('-')) {
			res.render('post', { title: blog.title, post: blog.post });
		}
	})
})

app.post('/', (req, res) => {
	const composedBlog = {
		title: req.body.title,
		post: req.body.post
	}

	allTheBlogs.push(composedBlog);
	res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => console.log('Server started on port 3000'));
