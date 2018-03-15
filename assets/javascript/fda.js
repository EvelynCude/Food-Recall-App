$(document).ready(function(){
	
	$(".button-collapse").sideNav({
		edge: "right"}
	);
	$('select').material_select();
	$("#search-button").on("click", function(event){
   event.preventDefault();
   console.log("clicked");

	});
});