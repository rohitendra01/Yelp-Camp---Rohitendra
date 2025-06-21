module.exports.isLoggedIn = (req, res, next) =>{
    // console.log("req.user...", req.user);
    
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.session.returnTo;
        req.flash('error','You must be signed in');
        return  res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) =>{
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}