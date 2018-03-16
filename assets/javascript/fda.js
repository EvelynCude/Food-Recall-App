$(document).ready(function(){
	
	$(".button-collapse").sideNav({
		edge: "right"}
	);
	$('select').material_select();

//	Firebase Database Configuration
  var config = {
    apiKey: "AIzaSyCE-JQYJcXJesJdYUV6jSBpnBZBybD1HWI",
    authDomain: "food-recall-app.firebaseapp.com",
    databaseURL: "https://food-recall-app.firebaseio.com",
    projectId: "food-recall-app",
    storageBucket: "",
    messagingSenderId: "847951863516"
  };
  firebase.initializeApp(config);

  //Firebase Database Variable
  var database = firebase.database();
  //Most recent search hit ref
  var hitRef = database.ref("hit");
  //Recent hit variable to push hit object to firebase
  var recentHit;


//	Search results variables
var selection;
var searchType;
var search;
var company;
var product;
var barcode;
var startdate;
var enddate;
var fdaStart;
var fdaEnd;
var fdaRange;
var trueHit;

var queryURL;


//-----------------ON DROPDOWN SELECTION FUNCTION--------------------//
$('select[name="dropdown"]').change(function(){
  
    if ($(this).val() == "2"){
    	selection=2;
	}else if($(this).val() == "3"){
    	selection=3;
    }
//>>>Add an "if barcode selected" statement here to run barcode code<<<//
//
//
//
//
//
//
//

});






//-------------------ON SEARCH CLICK FUNCTION------------------------//
$("#search-button").on("click", function(event){
    event.preventDefault();
	search= $("#search").val().trim();
	startdate= $("#start").val().trim();
	enddate= $("#end").val().trim();

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
	
	if(selection==2){
		queryURL ="https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:"+search+"+AND+recall_initiation_date:"+fdaRange+"&limit=10";
	}
	if(selection==3){
		queryURL ="https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:"+search+"+AND+recall_initiation_date:"+fdaRange+"&limit=10";
	}
	searchResults();
});


//----------------Query Search for response---------------------------//
function searchResults(){
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
  });  
  //ajax error response function
  $(document).ajaxSuccess(function(event, xhr){
      trueHit = 1;
      alert(trueHit);
  fireb();
  });

  //ajax error response function
  $(document).ajaxError(function(event, xhr){
      if(xhr.status==404){
      $("#mytable > tbody").append("<tr><td></td><td>No results for that search.  Try modifying your search.</td><td>"+xhr.statusText+"</td><td></td></tr>");
      trueHit = 0;
      alert(trueHit);
    }
  });
}

//-------------------------Firebase----------------------------------//


// Listen for the form submit
 function fireb(){
  	if(selection==2){
  		searchType = "Product";
  	}else if(selection==3){
  		searchType = "Firm";
  	}
	//Save Data to an object
    var recentHit = {
    	type : searchType,
      	search : search
    }
    //Push object to Firebase
    hitRef.push(recentHit);

  }

  displayHits();
// Display 10 most recent hits on DOM
  function displayHits(){

  hitRef.limitToLast(10).on('child_added', function (snapshot) {
    // Get data from returned
    console.log(snapshot.val());
  //  addHit(snapshot.val());
  });
}
});




























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
