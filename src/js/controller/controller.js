/**
	endpoints used for querying
*/
var base = "https://athena-7.herokuapp.com/ancients.json";
var error = "https://athena-7.herokuapp.com/ancients.json?error=true";

/**
	Importing Views
*/
var ancientView = require("../view/ancientView");
var resultViewContainer = require("../view/resultViewContainer");
var errorMessageView = require("../view/errorMessageView");

/**
	Importing Models
*/
var Ancient = require("../model/Ancient");
var ResultsContainer = require("../model/ResultsContainer");
var Error = require("../model/Error");

/**
 * This controller is used to facilitate the communication from the page to server and render the results
 * 
 * @contructor controller
 * @property {Boolean} useError Indicates whether to use the error endpoint.*		 
 * @property {Boolean} includeTerm Indicates whether the searchterm should be sent to the server. When false, all results will be returned.

 */
module.exports = function() {
	/*
		Local cache of search results.
	*/
    var searchResults = {};
    return {
		includeTerm : false,
        useError: false,
        /**
         * Callback function executed when a query is successfully returned from the server
         * 
         * @method searchSuccessCallback
         * @param {Object} data Data return from server
         * @param {String} searchTerm Term used to query the server
         * @param {String} resultsMountNode text used in jQuery selector. This is where the results of the query will be mounted.
         */
        searchSuccessCallback: function(data, searchTerm, resultsMountNode) {
            var results = "";
            $.each(data, function(index) {
                results += ancientView(new Ancient(data[index]));
            });
            var resultsList = $(results);
            var container = ResultsContainer({
                totalResults: data.length,
                results: results,
                searchTerm: searchTerm
            });
            $("#results").empty().append(resultViewContainer(container));
            return true;
        },
        /**
         * Callback function executed when a query is unsuccessful
         * 
         * @method searchFailCallback
         * @param {Object} data Data return from server
         * @param {String} resultsMountNode text used in jQuery selector. This is where the results of the query will be mounted.
         */
        searchFailCallback: function(data, resultsMountNode) {
            var errorMessage = new Error(data.responseText);
            $("#results").empty().append($(errorMessageView(errorMessage)));
        },
        /**
         * This method is used to query the base endpoint with a given search term. 
         * The results are mounted on the resultsMountNode node.  
         * 
         * @method getData
         * @param {Object} event eventObject
         */
        getData: function(event) {
			var resultsMountNode = endpoint;
            var searchTerm = event.target.value, failCallback = this.searchFailCallback;
            //Empty result list
            $("#results").empty();
            var self = this;
            var options = {
                url: this.useError?error:base,
                cache: false,
                dataType: "json",
                success: function(data) {
                    var cachedData = self.includeTerm && searchTerm !== "" ? data["ancients"] : data;
                    self.searchSuccessCallback(cachedData, searchTerm, resultsMountNode);
					searchResults[resultsMountNode] = {};
					searchResults[resultsMountNode]["search" + searchTerm] = 
					{
						results : cachedData
					}
                },
                error: function(data) {
					failCallback(data, resultsMountNode);
                }

            };
            // Good endpoint has a different result structure.
            if (this.includeTerm) {
                options.data = {
                    'search': searchTerm
                };
            }
            if (searchResults.hasOwnProperty(resultsMountNode) && searchResults[resultsMountNode].hasOwnProperty("search" + searchTerm)) {
				console.log("using cached data...");
                self.searchSuccessCallback(searchResults[resultsMountNode]["search" + searchTerm], searchTerm, resultsMountNode);
            } else {
                $.ajax(options);
            }
        }
    }
}