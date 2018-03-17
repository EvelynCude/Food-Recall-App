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




  //---------------------Search global variables--------------------//
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
  var barcodeURL;





  //-----------------DROPDOWN SELECTION FUNCTION--------------------//
  $('select[name="dropdown"]').change(function () {

    if ($(this).val() == "2") {
      selection = 2;
    } else if ($(this).val() == "3") {
      selection = 3;
    }
    else{
      selection = 1;
    }
  });





  //-------------------ON SEARCH CLICK FUNCTION------------------------//
  $("#search-button").on("click", function (event) {
    event.preventDefault();
//  store user inputs in global variables
    search = $("#search").val().trim();
    startdate = $("#start").val().trim();
    enddate = $("#end").val().trim();
    //	Convert user input start date into standard format
    convertedStart = moment(startdate, "YYYY-MM-DD");
    //	Convert user standard formatted start date into FDA format
    fdaStart = (moment(convertedStart).format("YYYYMMDD"));
    //	Convert user input end date into standard format
    convertedEnd = moment(enddate, "YYYY-MM-DD");
  //  Convert user standard formatted start date into FDA format and store in fda global variable
    fdaEnd = (moment(convertedEnd).format("YYYYMMDD"));
    fdaRange = "[" + fdaStart + "+TO+" + fdaEnd + "]";

 //  Choose query url depending on if the user selected barcode, product, or company
    if (selection == 2) {
      queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=product_name:" + search + "+AND+recall_initiation_date:" + fdaRange + "&limit=10";

    }
    else if (selection == 3) {
      queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:" + search + "+AND+recall_initiation_date:" + fdaRange + "&limit=10";

    }
    else if (selection == 1) {


      var url = "https://www.barcodelookup.com/restapi";
      url += '?' + $.param({
        'key': "3berdz3s0ax9lfne6bu0b90wum6og8",
        "barcode": search,
        'short': 'y'
      });

      // Creating an AJAX call via CORSBridge to Barcodelookup
      $.ajax({
        url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(url),
        method: 'GET'
      }).then(function (response) {
        var results = response;
        search = results.result[0].details.manufacturer;
       
      buildQueryURL(search);
      searchResults();
      });
    }
    searchResults();
  });

  function buildQueryURL(search) {
    queryURL = "https://api.fda.gov/food/enforcement.json?api_key=YPcbJ01rsUqDmd2a2v38fbeJgKRVmrvd4WOWKu1F&search=recalling_firm:" + search + "+AND+recall_initiation_date:" + fdaRange + "&limit=10";
    console.log(queryURL);
    
  };
 



  //----------------Query Search for response---------------------------//
  function searchResults() {
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
    //  clear results of previous user search from results table
    $("#results-table").empty();      
 	  var data = response.results[i];
    // For the length of the results, append data to html table
    for (var i = 0; i < response.results.length; i++) {
    	var data = response.results[i];
      $("#mytable > tbody").append("<tr><td>"+data.recall_initiation_date+"</td><td>"+data.product_description+"</td><td>"+data.recalling_firm+"</td><td>"+data.reason_for_recall+"</td></tr>");
    }
  });  
  //ajax success response function
  $(document).ajaxSuccess(function(event, xhr){
      //  clear results of previous user search from results table
      trueHit = 1;
      fireb();
    });
    //ajax error response function
    $(document).ajaxError(function (event, xhr) {
      //  clear results of previous user search from results table
      $("#results-table").empty();
    //  if the ajax error code was a 404-No results show "no results" message on the table
      if (xhr.status == 404) {
        $("#mytable > tbody").append("<tr><td></td><td>No results for that search.   Try modifying your search.</td><td></td><td></td></tr>");
        trueHit = 0;
      }
    });

    // Reset user input form
    $("#search").val("");
    $("#start").val("");
    $("#end").val("");
    $("select").prop('selectedIndex', 0); //Sets the first option as selected (specific for materialize)
    $("select").material_select();        //Update material select (specific for materialize)
  }




  //-------------------------Firebase----------------------------------//

  // Listen for search hit
  function fireb() {
    if (selection == 2) {
      searchType = "Product";
    }else if (selection == 3) {
      searchType = "Firm";
    }
    else if (selection == 1) {
      searchType = "Firm";
    }
    console.log(searchType);
    //Save Data to an object
    var recentHit = {
    	type : searchType,
      search : search
    }

    //Push object to Firebase
    hitRef.push(recentHit);
    //Run displayHits function
    displayHits();
  }


  // Display 10 most recent hits on DOM
  function displayHits() {

    hitRef.limitToLast(10).on('child_added', function (snapshot) {
      // Get data from returned
      console.log(snapshot.val());
      //  addHit(snapshot.val());
    });
  };

displayHits();
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

