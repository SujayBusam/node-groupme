#!/usr/bin/env node

/************************************************************************
 * Include the Stateless API
 ***********************************************************************/

var API = require('../index').Stateless;

/************************************************************************
 * Read the access token from the command line.
 ***********************************************************************/

if (process.argv.length < 3) {
    console.log("Usage: node scraper.js ACCESS_TOKEN");
    process.exit(1);
} 
var ACCESS_TOKEN = process.argv[2];

/************************************************************************
 * Request your user id and name
 ***********************************************************************/

API.Users.me(ACCESS_TOKEN, function(err,ret) {
  if (!err) {
    console.log("Your user id is", ret.id, "and your name is", ret.name);        
  } else {
    console.log("ERROR!", err)
  }
});

/************************************************************************
 * Request all your group info
 ***********************************************************************/

API.Groups.index(ACCESS_TOKEN, function(err,ret) {
  if (!err) {
    var names = [];
    for (var i = 0; i < ret.length; i++) {
      names.push({"name":ret[i].name, "id":ret[i].id});
    }
    console.log(names); 
    //console.log(ret);
  } else {
    console.log("ERROR!", err)
  }
});

/************************************************************************
 * If you also supply a group_id as a second argument, get group details
 ***********************************************************************/

// 
// 1701426
//

if (process.argv.length == 4) {
  MAX = 3;
  var group_id = process.argv[3];
  var page, opts;


  page = 0    // 1 page denotes 20 messages
  msg_no = 0
  opts = {}

  var check_message = function(opts){ 
    API.Messages.index(ACCESS_TOKEN, group_id, opts, function(err,ret){
      if (!err) {
        //console.log("Group info is", ret);        
        // Do something with the messages here...
        for (var i=0; i < ret['messages'].length; i++){
          console.log(msg_no, ret['messages'][i]['text']);
          msg_no++
        }        
        
        last_msg = ret['messages'].pop() // first element in array will be the latest message

        before_id = last_msg['id']
        opts = {before_id:before_id}; // everything before this id

        console.log("Running page ", page);
        page++;
        
        // base case
        if (page < MAX){
          check_message(opts)
        }
      } else {
        console.log("ERROR!", err)
      }
    });
  }

  //check_message(opts);


  // Get member names this way
  var get_members = function(){
    API.Groups.show(ACCESS_TOKEN, group_id,function(err,ret) {
      if (!err) {
        console.log("Group info is", ret);        
      } else {
        console.log("ERROR!", err)
      }
    });
  }

  

}