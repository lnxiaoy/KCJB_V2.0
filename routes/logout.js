var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log('LOGOUT!!!');
    if (req.session && req.session.token) {
	delete req.session.token;
    }
    res.json({succ :0 ,msg : 'ok'});
    return;
});

module.exports = router;
