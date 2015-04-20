define(function(){ 
	return {
		setUpAppend: function(toAppend) {
		            toAppend = "<div id='added'>" + toAppend + "</div>";
		            $('body').append(toAppend);
		},
        removeAppended: function(){
            $("#added").remove();
        }
	}
});