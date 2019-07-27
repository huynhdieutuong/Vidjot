const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideasRoute = require('./routes/ideas.route');
const usersRoute = require('./routes/users.route');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// Routes
app.get('/', (req, res) => res.render('index', {title: 'Welcome'}));
app.get('/about', (req, res) => res.render('about', {title: 'About'}));

app.use('/ideas', ideasRoute);
app.use('/users', usersRoute);


// Port
const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));