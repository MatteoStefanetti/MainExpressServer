let express = require('express');
var router = express.Router();

/** It is a map with association key-value as numbers-names of the chat rooms. */
let chatMap = new Map([
  [hashCode('global'), 'global'],
  [hashCode('england'), 'england'],
  [hashCode('emirates fa cup'), 'emirates fa cup']
])

/** HashCode function for strings.
 * @param {string} str the string to hash
 * @return {number} a hash code value for the given string, -1 if str is null */
function hashCode(str) {
  if(str){
    let h = 0, l = str.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + str.charCodeAt(i++) | 0;
    return h;
  }
  return -1
}

function stringifyChatRoomsMap(){
  let stringedMap = ''
  chatMap.forEach((val, key) => {stringedMap += '  ' + key + ': ' + val})
  return stringedMap
}

router.get('/get_chat_rooms_map', (req, res) => {
  res.status(200).json(stringifyChatRoomsMap())
})

router.get('/add_chat_room/:room_name', function(req, res){
  if(req.params && req.params.room_name) {
    const element = req.params.room_name
    if(!chatMap.has(hashCode(String(element)))){
      chatMap.set(hashCode(String(element)), String(element))
      res.json(String("Chat added to map: " + stringifyChatRoomsMap()))
    } else {
      res.json("The chat exists. " + stringifyChatRoomsMap())
    }
  } else
    res.status(500).json("No parameter has been passed.")
});

module.exports = router;
