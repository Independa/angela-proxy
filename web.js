var express = require("express");
var logfmt = require("logfmt");
var app = express();
var FB = require('./fb/fb.js');

app.use(logfmt.requestLogger());
/*app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://qa-our.independa.com");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});*/
app.get('/', function(req, res){
  res.send("Independa Proxy");
});


// "params" need to be url encoded
// example: http://localhost:5111/fb/api?params=%7B%22method%22%3A%22fql.multiquery%22%2C%22queries%22%3A%7B%22photos%22%3A%22SELECT%20object_id%2C%20src_big%2C%20caption%2C%20owner%2C%20created%20FROM%20photo%20WHERE%20created%20%3E%20782687579%20AND%20album_object_id%3D10102435650518665%20ORDER%20BY%20created%20DESC%20LIMIT%20100%22%2C%22photos_users%22%3A%22SELECT%20uid%2C%20first_name%2C%20last_name%2C%20pic%2C%20pic_square%20FROM%20user%20WHERE%20uid%20IN%20(SELECT%20owner%20FROM%20%23photos)%22%2C%22photo_reg%22%3A%22SELECT%20photo_id%2C%20src%20FROM%20photo_src%20WHERE%20photo_id%20IN%20(SELECT%20object_id%20FROM%20%23photos)%20AND%20(width%20%3E%20640%20OR%20height%20%3E%20480)%20ORDER%20BY%20width%22%2C%22photo_small%22%3A%22SELECT%20photo_id%2C%20src%20FROM%20photo_src%20WHERE%20photo_id%20IN%20(SELECT%20object_id%20FROM%20%23photos)%20AND%20(width%20%3E%20300%20OR%20height%20%3E%20300)%20ORDER%20BY%20width%22%2C%22photo_big%22%3A%22SELECT%20photo_id%2C%20src%20FROM%20photo_src%20WHERE%20photo_id%20IN%20(SELECT%20object_id%20FROM%20%23photos)%20AND%20(width%20%3E%3D%201280%20OR%20height%20%3E%3D%20720)%20ORDER%20BY%20width%22%7D%2C%22access_token%22%3A%22CAAFajLNoYD0BAMQiyuvkdhU2MwZAsXoME5wkNAAkRiglhXpQ9G6oKHMIRNBXP7ci7XMvUfiZBpA4qwLjd1KupFHJ1F04aJPcWXa7wTFgpxns0J5CUHQsWo9LBfw8HN0hp30ZBxM7r5oGchl4kYwOk5ygelsHmnfohKDmXB0o3VTClQMkmsgDamLMWDT00QZD%22%7D
// var params = JSON.stringify({"method": "fql.multiquery"})
/*

  $.ajax({
    type: 'GET',
    data: {
      params: encodeURIComponent(params)
    }
  }
   */

app.get('/fb/api', function(req, res) {
  var params_parsed = {
    "method": "fql.multiquery",
    "queries": {},
    "access_token": ""
  };
  //console.log(req.query);
  if (typeof req.query !== 'undefined' && typeof req.query.params !== 'undefined'){
    params_parsed = JSON.parse(req.query.params);
  }

  FB.api(params_parsed, function(response){
    res.send(response);
  });

});

//just in case
app.post('/fb/api', function(req, res) {
  var params_parsed = {
    "method": "fql.multiquery",
    "queries": {},
    "access_token": ""
  };
  //console.log(req.query);
  if (typeof req.param !== 'undefined' && typeof req.param.params !== 'undefined'){
    params_parsed = JSON.parse(req.param.params);
  }

  FB.api(params_parsed, function(response){
    res.send(response);
  });

});


app.get('/fb/api/test', function(req, res) {

  var json_string = '{"method":"fql.multiquery","queries":{"photos":"SELECT object_id, src_big, caption, owner, created FROM photo WHERE created > 782687579 AND album_object_id=10102435650518665 ORDER BY created DESC LIMIT 100","photos_users":"SELECT uid, first_name, last_name, pic, pic_square FROM user WHERE uid IN (SELECT owner FROM #photos)","photo_reg":"SELECT photo_id, src FROM photo_src WHERE photo_id IN (SELECT object_id FROM #photos) AND (width > 640 OR height > 480) ORDER BY width","photo_small":"SELECT photo_id, src FROM photo_src WHERE photo_id IN (SELECT object_id FROM #photos) AND (width > 300 OR height > 300) ORDER BY width","photo_big":"SELECT photo_id, src FROM photo_src WHERE photo_id IN (SELECT object_id FROM #photos) AND (width >= 1280 OR height >= 720) ORDER BY width"},"access_token":"CAAFajLNoYD0BAMQiyuvkdhU2MwZAsXoME5wkNAAkRiglhXpQ9G6oKHMIRNBXP7ci7XMvUfiZBpA4qwLjd1KupFHJ1F04aJPcWXa7wTFgpxns0J5CUHQsWo9LBfw8HN0hp30ZBxM7r5oGchl4kYwOk5ygelsHmnfohKDmXB0o3VTClQMkmsgDamLMWDT00QZD"}';

  console.log(json_string);

  var json_parsed = JSON.parse(json_string);
  if(req.param("params")){
    json_parsed = JSON.parse(req.param("params"));
  }

  console.log(json_parsed);

  FB.api(json_parsed, function(response){
    res.send(response);
  });

});

app.get('/load-test', function(req, res){

  setTimeout(function(){
    res.send('Success!');
  }, 5000);

});

var port = Number(process.env.PORT || 5111);

app.listen(port, function() {

  console.log('Listening to Port: '+port);

});
