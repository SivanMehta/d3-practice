//you need to copy and paste the following into a console to get the ids:
/*
swimmers = $("a[href*=swimmer]")
for(i = 0; i < swimmers.length; i++){console.log(swimmers[i].href)
}
*/

const async = require('async')
const pull = require('./pull-data')

// these are the IDs pulled from CMU's roster for 2013-4 to 2016-7
ids_2013 = [152632, 206029, 162958, 166344, 296605, 200071, 243606, 106707, 206033, 210182, 118140, 248683, 241630, 147694, 98544, 233047, 296610, 166338, 147128, 151933, 136456, 158732, 207663, 183700, 189790, 147690, 218002, 111982, 158738, 177138, 85930]
              .map(id => [id, 2013])
ids_2014 = [362650, 206029, 241049, 361980, 296605, 200071, 361981, 243606, 106707, 243607, 361982, 201058, 206033, 210182, 377703, 118140, 241688, 329240, 147694, 233047, 296610, 166338, 237152, 147128, 136456, 207663, 189790, 212826, 147690, 233481, 111982, 270616, 85930]
              .map(id => [id, 2014])
ids_2015 = [230365, 431239, 241049, 330478, 286598, 361980, 296605, 361981, 243606, 106707, 445698, 201058, 210182, 377703, 118140, 431241, 288434, 233047, 166338, 237152, 147128, 349336, 136456, 183988, 207663, 189790, 233481, 111982, 270616]
              .map(id => [id, 2015])
ids_2016 = [230365, 616062, 431239, 243692, 138305, 241049, 330478, 271394, 289068, 361980, 296605, 243606, 330393, 350978, 445698, 276955, 220606, 524473, 291138, 210182, 291810, 288434, 281950, 299734, 244205, 233047, 237152, 272478, 349336, 183988, 207663, 189790, 405637 ]
              .map(id => [id, 2016])


candidate_ids = ids_2013.concat(ids_2014).concat(ids_2015).concat(ids_2016)
ids = []
for(var i = 0; i < candidate_ids.length; i ++) {
  prevYear = candidate_ids[i].slice()
  prevYear[1] -= 1
  inside = false
  for(var j = 0; j < candidate_ids.length; j ++) {
    if(candidate_ids[j][0] == prevYear[0] && candidate_ids[j][1] <= prevYear[1]) {
      inside = true
    }
  }

  if(!inside) {
    ids.push(candidate_ids[i])
  }
}

scrapers = ids.map(id => done => pull(id[0], id[1], done))
console.log("swimmerID|event|date|time|season|points")
async.parallel(scrapers)
