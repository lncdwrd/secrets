require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;


app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


/*** Mongoose ***/
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Mongoose Encryption
const secret = process.env.S_STRING;

userSchema.plugin(encrypt, { 
    secret: secret,
    encryptedFields: ['password']
});

const User = new mongoose.model('User', userSchema);



/*** Home ***/
app.route('/')

.get((req, res) => {
    res.render('home');
})


/*** Login ***/
app.route('/login')

.get((req, res) => {
    res.render('login');
})

.post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        } else {
            console.log(err);
        }
    })
})
 

/*** Register ***/
app.route('/register')

.get((req, res) => {
    res.render('register');
})

.post((req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    })
})



/*** Port ***/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
