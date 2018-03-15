$(document).ready(function(){
	
	$(".button-collapse").sideNav({
		edge: "right"}
	);

//Search results variables
var searchproduct = "TruDog";
var searchcompany ="Tyson";
var searchbarcode="";
var daterange;
var search;
var startdate;
var enddate;
var fdaStart;
var fdaEnd;
var fdaRange;
var COMPANY="Meijer Greek Yogurt";
//------------------------THESE SEARCH FORMATS WORK--------------------------------//
//-------Note if a limit is not included, query will only bring up 1 result--------//
//  This API does not provide results for 2-20-2018 to present (3/13/2018)

//	SEARCH BY PRODUCT DESCRIPTION WITH/WITHOUT A # OF RESULTS LIMIT
//	var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=product_description=Highland&limit=100";

//	SEARCH BY A RECALL DATE RANGE WITH/WITHOUT A # OF RESULTS LIMIT
	// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:[20180201+TO+20180310]&limit=100";	

//	SEARCH BY COMPANY NAME WITH/WITHOUT A # OF RESULTS LIMIT
	// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:Tyson&limit=100";

//	SEARCH BY SPECIFIC RECALL DATE WITH/WITHOUT A # OF RESULTS LIMIT
	// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:20170511&limit=10";
  
//-----------TEST NEW QUERYURL HERE----------------------------//
	// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:Tyson+AND+recall_initiation_date:20170511&limit=100";
 // var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:[2018-01-01+TO+2018-03-10]+AND+recalling_firm:"+COMPANY+"&limit=100";    

//  SEARCH BY COMPANY NAME WITH/WITHOUT A # OF RESULTS LIMIT
// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:"+search+"+AND+recall_initiation_date:[20180201+TO+20180310]&limit=100";
// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:"+COMPANY+"&limit=10";
// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=product_description:"+searchcompany+"+AND+recall_initiation_date:[20101+TO+20180312]&limit=10";
//josh test
// var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:[20180101+TO+20180312]&limit=10";




$("#search-button").on("click", function(event){
    event.preventDefault();
    console.log("clicked");
//---------------------TEST USER INPUT WITH BUTTON CLICK------------------------//

	search= $("#search").val().trim();
	startdate= $("#start").val().trim();
	enddate= $("#end").val().trim();
	console.log(search);
	console.log(startdate);
	console.log(enddate);
	//	Convert user input start date into standard format
	convertedStart = moment(startdate, "YYYY-MM-DD");
	//	Convert user standard formatted start date into FDA format
	fdaStart = (moment(convertedStart).format("YYYYMMDD"));
	console.log(fdaStart);
	//	Convert user input end date into standard format
	convertedEnd = moment(enddate, "YYYY-MM-DD");
	//	Convert user standard formatted start date into FDA format
	fdaEnd = (moment(convertedEnd).format("YYYYMMDD"));
	console.log(fdaEnd);

	fdaRange="["+fdaStart+"+TO+"+fdaEnd+"]";
	console.log(fdaRange);

	searchResults();
});



function searchResults(){
//	APP URL
 var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=product_description:"+search+"+AND+recall_initiation_date:"+fdaRange+"&limit=10";
//  var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:[2018-01-01+TO+2018-03-10]+AND+recalling_firm:Meijer&limit=100"; 
//  var queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recall_initiation_date:"+fdaRange+"+AND+recalling_firm:"+searchcompany+"&limit=100";    
   

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
 //   	console.log(response);
 	var data = response.results[i];

    for (var i = 0; i < response.results.length; i++) {
    	var data = response.results[i];
    	console.log(data.product_description);
    	console.log(data.recall_initiation_date);
    	console.log(data.recalling_firm);
    	// $("#mytable > tbody").append("<tr><td>"+data.product_description+"</td><td>"+data.recall_initiation_date+"</td><td>"+data.recalling_firm+"</td></tr>");
        $("#mytable > tbody").append("<tr><td>"+data.recall_initiation_date+"</td><td>"+data.product_description+"</td><td>"+data.recalling_firm+"</td><td>"+data.reason_for_recall+"</td></tr>");

    }

	});  //ajax url function

}
});