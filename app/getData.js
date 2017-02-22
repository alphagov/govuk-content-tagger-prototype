const fs = require('fs')
const request = require('sync-request')

//var education = request('https://www.gov.uk/api/content/education')

var education = require(__dirname + '/data/education.json')

var taxonomy = []

var processTree = function(tree, parent){

  var childTaxons = tree.links.child_taxons

  for (var i = 0; i < childTaxons.length; i++){
    var topic = childTaxons[i]
    var newTopic = {
      'title': topic.title,
      'contentId': topic.content_id
    }
    parent.push(newTopic)
    if (childTaxons[i].links && childTaxons[i].links.child_taxons){
      newTopic.children = []
      processTree(topic, newTopic.children)
    }

  }
}

processTree(education, taxonomy)

fs.writeFileSync(__dirname + '/data/taxonomy.json', JSON.stringify(taxonomy, null, '  '))
