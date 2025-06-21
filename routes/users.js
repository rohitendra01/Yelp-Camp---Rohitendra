const express = require('express');

const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const User = require('../models/user');
const passport = require('passport');

const {storeReturnTo} = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if (err) {
                return next(err);
            }
            req.flash('success','Welcome to camps');
            res.redirect('/campgrounds');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
    // console.log(registeredUser);
    
    // res.send(req.body);
}));

router.get('/login', (req, res) =>{
    res.render('users/login');
});
router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash : true, failureRedirect : '/login'}), (req, res) =>{
    req.flash('success', 'welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
});
router.get('/logout', (req,res,next) => {
    req.logout(function(err){
        if (err) {
            return next(err);
        }
        req.flash('success', 'GoodBye');
        res.redirect('/campgrounds'); 
    });
});

module.exports = router;