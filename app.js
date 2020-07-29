const express = require('express');
const ejs = require('ejs');
const content = require(__dirname + '/content.js');

const app = express();

const allTheBlogs = [];

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const blogPostRoutes = () => {
	allTheBlogs.forEach((blog) => {
		const blogURI = "/posts/" + encodeURI(blog.title);
		const blugDirectURL = "/posts/" + blog.title.toLowerCase().split(' ').join('-');

		app.get(blogURI, (req, res) => {
			res.render('post', { title: blog.title, post: blog.post })
		});

		app.get(blugDirectURL, (req, res) => {
			res.render('post', { title: blog.title, post: blog.post })
		});
	});
}


app.get('/', (req, res) => {
	blogPostRoutes();
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

app.post('/', (req, res) => {
	const composedBlog = {
		title: req.body.title,
		post: req.body.post
	}

	allTheBlogs.push(composedBlog);
	res.redirect('/');
})

app.listen(3000, () => console.log('Server started on port 3000'));
