const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

module.exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username })
    try {
        const registeredUser = await User.register(user, password)
        console.log(`The registered user: ${registeredUser}`)
        req.login(registeredUser, err => {
            if (err) { 
                return next(err); 
            }
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/artsocial");
        })
    } catch (e) {
        req.flash("error", e.message)
        return res.redirect("register")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/artsocial";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(() => { });
    req.flash("success", "Goodbye")
    res.redirect("/artsocial")
}