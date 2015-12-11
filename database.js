// This is the file to handle all the queries


// Operation == true implies substract
// Operation  == false implies add

function modifyArmy(playerName, territoryName, number, operation) {
    db.collection('war').updateOne (
    searchJSON,
    {
        $inc: updateJSON
    }, function(err, results) {
        callback();
    });
}


function changeTerritory(player1, player2, territoryName) {

}
