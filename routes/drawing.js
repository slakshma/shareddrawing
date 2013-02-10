
var redis = require('redis');
var redis_client = redis.createClient();
/*
 * GET home page.
 */

exports.start = function(req, res) {

  console.log(req.params.drawingid);  
  redis_client.sismember('drawingids', req.params.drawingid, function (error, data) {
   // drawing not found
   if (!data) {
     console.log('session not found !!! returning error page to start new');
     return res.render('error');
   }

   console.log('session found :'+req.params.drawingid); 
   //found and join the session    
   res.render('canvas', { drawingid: req.params.drawingid });
  });

};
