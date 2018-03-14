$(document).ready(function(){
	
	$(".button-collapse").sideNav({
		edge: "right"}
	);
	$("#search-button").on("click", function(event){
   event.preventDefault();
   console.log("clicked");
	});
});