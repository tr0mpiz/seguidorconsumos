module.exports = function(req, res, next){
  if (!req.user) {
    console.log("Require user...");
    res.redirect('/not_allowed');
  } else {
    next();
  }
};