function checkCompatible(){
	var canvas = document.getElementById("container").getElementsByTagName("canvas");
	var compatible = true;

	if(canvas.namedItem === undefined) 
		compatible = false;
	
	return compatible;
}
if (!checkCompatible())
	document.getElementById("nogl").style.display = "block";