define(['jquery'], function($) {
    var manoeuvreArray = [{}];

    function parseManoeuvresFromJSON(manoeuvreArray) {

        $.ajax({
            url: 'js/json/manoeuvres.json',
            dataType: 'json',
            async: false,
            success: function(json) {
                var catalogue = json["catalogue"];
                var manoeuvres = catalogue["manoeuvre"];
                var postfix = "";
                var x = 0;

                for (var a = 0; a < manoeuvres.length; a++) {
                    var manoeuvre = manoeuvres[a];
                    postfix = manoeuvre["_olan"];
                    var varients = manoeuvre["variant"];

                    for (var b = 0; b < varients.length; b++) {
                        var variant = varients[b];
                        manoeuvreArray[x] = {};
                        manoeuvreArray[x]["olan"] = variant["_olanPrefix"] + postfix;
                        manoeuvreArray[x]["components"] = variant["component"];
                        manoeuvreArray[x++]["name"] = variant["_name"];
                    }
                }
            }
        });
    }

    return {

        init: function() {
            parseManoeuvresFromJSON(manoeuvreArray);
        },

        getManoeuvreArray: function() {
            return manoeuvreArray;
        },

        parseManoeuvreInput: function() {
            var input = $('#input').val();

            var moves = input.split(" ");
            var returnMoves = [{}];
            var i = 0;
            for (move in moves) {
                for (var a = 0; a < manoeuvreArray.length; a++) {
                    if (manoeuvreArray[a]["olan"] === moves[move]) {
                        console.log(manoeuvreArray[a])
                        returnMoves[i] = manoeuvreArray[a];
                        i++;
                        break;
                    }
                }
            }
            if (Object.keys(returnMoves[0]).length === 0) {
                return [];
            }
            return returnMoves;
        }

    }
});
