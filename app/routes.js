var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

  res.render('index');

});


// Example routes - feel free to delete these

// Passing data into a page

router.get('/examples/template-data', function (req, res) {

  res.render('examples/template-data', { 'name' : 'Foo' });

});

// Branching

router.get('/examples/over-18', function (req, res) {

  // get the answer from the query string (eg. ?over18=false)
  var over18 = req.query.over18;

  if (over18 == "false"){

    // redirect to the relevant page
    res.redirect("/examples/under-18");

  } else {

    // if over18 is any other value (or is missing) render the page requested
    res.render('examples/over-18');

  }

});

// add your routes here


router.get('/edit-taxonomy', function(req,res){

  var selected = req.query.topic || []

  // ensure it's an array
  selected = [].concat(selected)

  //console.log(selected)

  var topics = require('./data/taxonomy.json')

  var checked = function checked(topic){
    //console.log(topic);
    var isChecked = selected.indexOf(topic) != -1
    return isChecked ? ('checked="checked"') : ""
  }

  /*

    split selected by level
    loop highest level (eg level4)
    if value is not the start of any value in displaySelected, add it
    loop next highest level

  */

  var levels = []
  var displaySelected = []

  for (var i=0; i<selected.length; i++){
    var topicPath = selected[i].split("|")

    if (!levels[topicPath.length]){
      levels[topicPath.length] = [selected[i]]
    } else {
      levels[topicPath.length].push(selected[i])
    }
  }

  // console.dir(levels)

  for (var j = levels.length-1; j>=0; j--){
    // console.log(j)
    if (!levels[j]){
      continue
    }
    for (var k=0; k < levels[j].length; k++){
      var found = false
      for (var l=0; l < displaySelected.length; l++){
        // console.log("levels[j][k]")
        // console.log(levels[j][k])
        if (displaySelected[l].indexOf(levels[j][k]) === 0){
          found = true
          break
        }
      }
      if (!found){
        displaySelected.push(levels[j][k])
      }
    }
  }

  console.dir(displaySelected)

  for (var m=0; m<displaySelected.length; m++){
    topicPath = displaySelected[m].split("|")
    topicPath[topicPath.length-1] = "<strong>" + topicPath[topicPath.length-1] + "</strong>"
    displaySelected[m] = topicPath.join(" &gt; ")
  }

  console.dir(displaySelected)

  if (displaySelected.length == 0){
    displaySelected.push("No topics selected")
  }

  res.render('edit-taxonomy',{Math: Math, topics: topics, checked: checked, displaySelected: displaySelected});

});


router.get('/edit-topic/:topicSlug', function(req,res){

  res.render('topic')

})


module.exports = router;
