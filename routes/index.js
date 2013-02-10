
var redis = require('redis');
var redis_client = redis.createClient();
/*
 * GET home page.
 */

exports.index = function(req, res) {

   var drawingId = Math.random().toString(36).substring(12);
   var starturl = '/drawing/'+drawingId;
   redis_client.sadd('drawingids', drawingId); 
 
   res.redirect(starturl);
};
