// Requiring the packages and modules used
const express = require('express');
const ejs = require('ejs');
const content = require(__dirname + '/content.js');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost/blogDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Setting up Post Model
const postsSchema = new mongoose.Schema({
	title: String,
	post: String,
});

const Post = mongoose.model('Post', postsSchema);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Processing request to root route
app.get('/', (req, res) => {
	Post.find((err, posts) => {
		if (err) {
			console.log('Error in finding documents.');
		} else {
			res.render('home', {
				description: content.homeStartingContent(),
				allTheBlogs: posts,
			});
		}
	});
});

// Processing request to the '/about' route
app.get('/about', (req, res) => {
	res.render('about', { description: content.aboutContent() });
});

// Processing request to the '/contact' route
app.get('/contact', (req, res) => {
	res.render('contact', { description: content.contactContent() });
});

// Processing request to the '/compose' route
app.get('/compose', (req, res) => {
	res.render('compose');
});

// Processing request to any '/posts/:blog' route
app.get('/posts/:blog', (req, res) => {
	Post.find((err, posts) => {
		if (err) {
			console.log('Error in finding documents.');
		} else {
			posts.forEach((blog) => {
				if (req.params.blog == blog._id) {
					res.render('post', { title: blog.title, post: blog.post });
				}
			});
		}
	});
});

// Saving the data received from the form into the database
app.post('/', (req, res) => {
	const composedBlog = new Post({
		title: req.body.title,
		post: req.body.post,
	});

	composedBlog.save();
	res.redirect('/');
});

// Listening to the PORT environment variable of Heroku and the port 3000 for localhost
app.listen(process.env.PORT || 3000, () =>
	console.log('Server started on port 3000'),
);
