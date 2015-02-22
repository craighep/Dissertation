define(['jquery'], function ($) {
  return {
        getTubes: function() {
          var input = $('#input').val();
          var moves = input.split(" ");
          var returnMoves = [];
          var i = 0;

          for (move in moves) {
              switch (moves[move]) {
                case "A":
                  returnMoves[i] = "VivianiCurve";
                  break;
                case "B":
                  returnMoves[i] = "HeartCurve"
                  break;
                case "C":
                  returnMoves[i] = "GrannyKnot";
                  break;
                case "D":
                  returnMoves[i] = "HelixCurve"
                  break;
                case "E":
                  returnMoves[i] = "FigureEightPolynomialKnot";
                  break;
                case "F":
                  returnMoves[i] = "TorusKnot"
                  break;
              }
              i++;
          }
          return returnMoves;
      }
  }
});
