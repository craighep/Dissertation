define(['jquery'], function($) {
    return {
        addContent: function(renderer) {
            var dropdown = $('#dropdown');
            var s;

            for (s in splines) {
                dropdown.append(
                    $('<option></option>').val(s).html(s)
                );
            }
            $('#container').append(renderer.domElement);
        },

        addMoveReel: function(moves) {
            var list = $('.moves');
            var movesHtml = "";
            var bottom = "0%";
            if (moves.length > 0)
                bottom = "15%";
            $('#footer').css({
                "bottom": bottom
            });
            bottom = "10px";
            if (moves.length > 4)
                bottom = "16%";
            $('#stats').css({
                "bottom": bottom
            });

            for (move in moves) {
                movesHtml += '<li class="move"></li>';
            }
            list.html(
                $(movesHtml)
            );
        },

        addStatsBar: function(stats) {
            $('#container').append(stats.domElement);
        }
    }
});
