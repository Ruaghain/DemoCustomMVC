(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                    var cachedData = this.includeTerm && searchTerm !== "" ? data["ancients"] : data;
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
},{"../model/Ancient":4,"../model/Error":5,"../model/ResultsContainer":6,"../view/ancientView":7,"../view/errorMessageView":8,"../view/resultViewContainer":9}],2:[function(require,module,exports){
module.exports = function(data) {
	return {
		changeEndpoint : function(e, resultSet, include, error) {
			$(".selected").each(function(){
				$(this).addClass("unselected").removeClass("selected");
			})
			$(e.target).toggleClass("selected").removeClass("unselected");
			endpoint = resultSet;
			cont.includeTerm = include;
			cont.useError = error;
		}
	}
}
},{}],3:[function(require,module,exports){
(function (global){
/**
 * Initialise Controller
 */
controller = require("./controller/controller");
helper = require("./helper/helper");
global.cont = new controller();
global.helper = new helper();
global.endpoint = "resultSet1";


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./controller/controller":1,"./helper/helper":2}],4:[function(require,module,exports){
/**
 * Ancient Model
 *
 * @constructor Ancient
 * @param {Object} data Ancient
 * @param {String} [data.name] Total results returned by endpoint
 * @param {String} [data.superpower] Description of the Ancient Gods power
 * @param {String} [data.end_of_an_era] Date of their demise
 * @return {Object} Error Model
 */
module.exports = function(data) {
    return {
        name: data.name || "",
        superpower: data.superpower || "",
        end_of_an_era: data.end_of_an_era || ""
    }
}
},{}],5:[function(require,module,exports){
/**
 * Error
 *
 * @constructor Error 
 * @param data JSON string containing details of error response
 * @return {Object} Error Model
 */
module.exports = function(data) {
    var data = typeof data === "string"?JSON.parse(data):data;
    return {
        errorMessage: data.error || ""
	}
}
},{}],6:[function(require,module,exports){
/**
 * Result Container Model
 *
 * @constructor ResultContainer
 * @param {Object} data Result Container
 * @param {String} [data.totalResults] Total results returned by endpoint
 * @param {String} [data.results] String containing results 
 * @param {String} [data.term] Search term used to query endpoint
 * @return {Object} Error Model
 */
module.exports = function(data) {
	var totalResults = data.totalResults || 0;
    return {
        totalResults : totalResults || "",
        results: data.results || "",
        term : data.searchTerm
    }
}
},{}],7:[function(require,module,exports){
/**
 * How to represent the ancient.
 *
 * @method ancientView
 * @param {Object} item  Passing Ancient model to view
 * @return {String} String representing view
 */
module.exports = function(item) {
    var name = item.name.toUpperCase();
    var superpower = item.superpower.toUpperCase();
    var end_of_an_era = item.end_of_an_era.toUpperCase();
    return (
        `<span>${name}</span><br/>` +
        `<span>${superpower}</<span><br/>` +
        `<span>${end_of_an_era}</<span>`
    );
}
},{}],8:[function(require,module,exports){
/**
 * Returns an error view
 *
 * @method errorMessageView
 * @param {Object} item Error model
 * @return {String} String representing view
 */
module.exports = function(item) {
    var errorMessage = item.errorMessage;
    return (
        `<span>${errorMessage}</span><br/>` 
    );
}
},{}],9:[function(require,module,exports){
/**
 * View for the parent container of a list of results 
 *
 * @method resultViewContaner
 * @param {Object} item passing ResultContainer model to view
 * @return {String} String representing view
 */
 module.exports = function(item) {
    var totalResults = item.totalResults;
    var results = item.results;
    var term = item.term;
    return (
        `<span class="total">${totalResults} results found mathing the term ${term}</span><br/>` +
        `${results}`
    );
}
},{}]},{},[1,2,3,4,5,6,7,8,9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29udHJvbGxlci9jb250cm9sbGVyLmpzIiwic3JjL2pzL2hlbHBlci9oZWxwZXIuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2RlbC9BbmNpZW50LmpzIiwic3JjL2pzL21vZGVsL0Vycm9yLmpzIiwic3JjL2pzL21vZGVsL1Jlc3VsdHNDb250YWluZXIuanMiLCJzcmMvanMvdmlldy9hbmNpZW50Vmlldy5qcyIsInNyYy9qcy92aWV3L2Vycm9yTWVzc2FnZVZpZXcuanMiLCJzcmMvanMvdmlldy9yZXN1bHRWaWV3Q29udGFpbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcblx0ZW5kcG9pbnRzIHVzZWQgZm9yIHF1ZXJ5aW5nXHJcbiovXHJcbnZhciBiYXNlID0gXCJodHRwczovL2F0aGVuYS03Lmhlcm9rdWFwcC5jb20vYW5jaWVudHMuanNvblwiO1xyXG52YXIgZXJyb3IgPSBcImh0dHBzOi8vYXRoZW5hLTcuaGVyb2t1YXBwLmNvbS9hbmNpZW50cy5qc29uP2Vycm9yPXRydWVcIjtcclxuXHJcbi8qKlxyXG5cdEltcG9ydGluZyBWaWV3c1xyXG4qL1xyXG52YXIgYW5jaWVudFZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9hbmNpZW50Vmlld1wiKTtcclxudmFyIHJlc3VsdFZpZXdDb250YWluZXIgPSByZXF1aXJlKFwiLi4vdmlldy9yZXN1bHRWaWV3Q29udGFpbmVyXCIpO1xyXG52YXIgZXJyb3JNZXNzYWdlVmlldyA9IHJlcXVpcmUoXCIuLi92aWV3L2Vycm9yTWVzc2FnZVZpZXdcIik7XHJcblxyXG4vKipcclxuXHRJbXBvcnRpbmcgTW9kZWxzXHJcbiovXHJcbnZhciBBbmNpZW50ID0gcmVxdWlyZShcIi4uL21vZGVsL0FuY2llbnRcIik7XHJcbnZhciBSZXN1bHRzQ29udGFpbmVyID0gcmVxdWlyZShcIi4uL21vZGVsL1Jlc3VsdHNDb250YWluZXJcIik7XHJcbnZhciBFcnJvciA9IHJlcXVpcmUoXCIuLi9tb2RlbC9FcnJvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGNvbnRyb2xsZXIgaXMgdXNlZCB0byBmYWNpbGl0YXRlIHRoZSBjb21tdW5pY2F0aW9uIGZyb20gdGhlIHBhZ2UgdG8gc2VydmVyIGFuZCByZW5kZXIgdGhlIHJlc3VsdHNcclxuICogXHJcbiAqIEBjb250cnVjdG9yIGNvbnRyb2xsZXJcclxuICogQHByb3BlcnR5IHtCb29sZWFufSB1c2VFcnJvciBJbmRpY2F0ZXMgd2hldGhlciB0byB1c2UgdGhlIGVycm9yIGVuZHBvaW50LipcdFx0IFxyXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGluY2x1ZGVUZXJtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzZWFyY2h0ZXJtIHNob3VsZCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuIFdoZW4gZmFsc2UsIGFsbCByZXN1bHRzIHdpbGwgYmUgcmV0dXJuZWQuXHJcblxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHQvKlxyXG5cdFx0TG9jYWwgY2FjaGUgb2Ygc2VhcmNoIHJlc3VsdHMuXHJcblx0Ki9cclxuICAgIHZhciBzZWFyY2hSZXN1bHRzID0ge307XHJcbiAgICByZXR1cm4ge1xyXG5cdFx0aW5jbHVkZVRlcm0gOiBmYWxzZSxcclxuICAgICAgICB1c2VFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiBhIHF1ZXJ5IGlzIHN1Y2Nlc3NmdWxseSByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiBAbWV0aG9kIHNlYXJjaFN1Y2Nlc3NDYWxsYmFja1xyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIERhdGEgcmV0dXJuIGZyb20gc2VydmVyXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFRlcm0gVGVybSB1c2VkIHRvIHF1ZXJ5IHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVzdWx0c01vdW50Tm9kZSB0ZXh0IHVzZWQgaW4galF1ZXJ5IHNlbGVjdG9yLiBUaGlzIGlzIHdoZXJlIHRoZSByZXN1bHRzIG9mIHRoZSBxdWVyeSB3aWxsIGJlIG1vdW50ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2VhcmNoU3VjY2Vzc0NhbGxiYWNrOiBmdW5jdGlvbihkYXRhLCBzZWFyY2hUZXJtLCByZXN1bHRzTW91bnROb2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gXCJcIjtcclxuICAgICAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzICs9IGFuY2llbnRWaWV3KG5ldyBBbmNpZW50KGRhdGFbaW5kZXhdKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0c0xpc3QgPSAkKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gUmVzdWx0c0NvbnRhaW5lcih7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFJlc3VsdHM6IGRhdGEubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0czogcmVzdWx0cyxcclxuICAgICAgICAgICAgICAgIHNlYXJjaFRlcm06IHNlYXJjaFRlcm1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoXCIjcmVzdWx0c1wiKS5lbXB0eSgpLmFwcGVuZChyZXN1bHRWaWV3Q29udGFpbmVyKGNvbnRhaW5lcikpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gYSBxdWVyeSBpcyB1bnN1Y2Nlc3NmdWxcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiBAbWV0aG9kIHNlYXJjaEZhaWxDYWxsYmFja1xyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIERhdGEgcmV0dXJuIGZyb20gc2VydmVyXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJlc3VsdHNNb3VudE5vZGUgdGV4dCB1c2VkIGluIGpRdWVyeSBzZWxlY3Rvci4gVGhpcyBpcyB3aGVyZSB0aGUgcmVzdWx0cyBvZiB0aGUgcXVlcnkgd2lsbCBiZSBtb3VudGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNlYXJjaEZhaWxDYWxsYmFjazogZnVuY3Rpb24oZGF0YSwgcmVzdWx0c01vdW50Tm9kZSkge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gbmV3IEVycm9yKGRhdGEucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgJChcIiNyZXN1bHRzXCIpLmVtcHR5KCkuYXBwZW5kKCQoZXJyb3JNZXNzYWdlVmlldyhlcnJvck1lc3NhZ2UpKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHF1ZXJ5IHRoZSBiYXNlIGVuZHBvaW50IHdpdGggYSBnaXZlbiBzZWFyY2ggdGVybS4gXHJcbiAgICAgICAgICogVGhlIHJlc3VsdHMgYXJlIG1vdW50ZWQgb24gdGhlIHJlc3VsdHNNb3VudE5vZGUgbm9kZS4gIFxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIEBtZXRob2QgZ2V0RGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBldmVudE9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdHZhciByZXN1bHRzTW91bnROb2RlID0gZW5kcG9pbnQ7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXJtID0gZXZlbnQudGFyZ2V0LnZhbHVlLCBmYWlsQ2FsbGJhY2sgPSB0aGlzLnNlYXJjaEZhaWxDYWxsYmFjaztcclxuICAgICAgICAgICAgLy9FbXB0eSByZXN1bHQgbGlzdFxyXG4gICAgICAgICAgICAkKFwiI3Jlc3VsdHNcIikuZW1wdHkoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy51c2VFcnJvcj9lcnJvcjpiYXNlLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWNoZWREYXRhID0gdGhpcy5pbmNsdWRlVGVybSAmJiBzZWFyY2hUZXJtICE9PSBcIlwiID8gZGF0YVtcImFuY2llbnRzXCJdIDogZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaFN1Y2Nlc3NDYWxsYmFjayhjYWNoZWREYXRhLCBzZWFyY2hUZXJtLCByZXN1bHRzTW91bnROb2RlKTtcclxuXHRcdFx0XHRcdHNlYXJjaFJlc3VsdHNbcmVzdWx0c01vdW50Tm9kZV0gPSB7fTtcclxuXHRcdFx0XHRcdHNlYXJjaFJlc3VsdHNbcmVzdWx0c01vdW50Tm9kZV1bXCJzZWFyY2hcIiArIHNlYXJjaFRlcm1dID0gXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlc3VsdHMgOiBjYWNoZWREYXRhXHJcblx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdGZhaWxDYWxsYmFjayhkYXRhLCByZXN1bHRzTW91bnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIEdvb2QgZW5kcG9pbnQgaGFzIGEgZGlmZmVyZW50IHJlc3VsdCBzdHJ1Y3R1cmUuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVUZXJtKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3NlYXJjaCc6IHNlYXJjaFRlcm1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlYXJjaFJlc3VsdHMuaGFzT3duUHJvcGVydHkocmVzdWx0c01vdW50Tm9kZSkgJiYgc2VhcmNoUmVzdWx0c1tyZXN1bHRzTW91bnROb2RlXS5oYXNPd25Qcm9wZXJ0eShcInNlYXJjaFwiICsgc2VhcmNoVGVybSkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInVzaW5nIGNhY2hlZCBkYXRhLi4uXCIpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZWFyY2hTdWNjZXNzQ2FsbGJhY2soc2VhcmNoUmVzdWx0c1tyZXN1bHRzTW91bnROb2RlXVtcInNlYXJjaFwiICsgc2VhcmNoVGVybV0sIHNlYXJjaFRlcm0sIHJlc3VsdHNNb3VudE5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGNoYW5nZUVuZHBvaW50IDogZnVuY3Rpb24oZSwgcmVzdWx0U2V0LCBpbmNsdWRlLCBlcnJvcikge1xyXG5cdFx0XHQkKFwiLnNlbGVjdGVkXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwidW5zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQkKGUudGFyZ2V0KS50b2dnbGVDbGFzcyhcInNlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwidW5zZWxlY3RlZFwiKTtcclxuXHRcdFx0ZW5kcG9pbnQgPSByZXN1bHRTZXQ7XHJcblx0XHRcdGNvbnQuaW5jbHVkZVRlcm0gPSBpbmNsdWRlO1xyXG5cdFx0XHRjb250LnVzZUVycm9yID0gZXJyb3I7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIEluaXRpYWxpc2UgQ29udHJvbGxlclxyXG4gKi9cclxuY29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2NvbnRyb2xsZXIvY29udHJvbGxlclwiKTtcclxuaGVscGVyID0gcmVxdWlyZShcIi4vaGVscGVyL2hlbHBlclwiKTtcclxuZ2xvYmFsLmNvbnQgPSBuZXcgY29udHJvbGxlcigpO1xyXG5nbG9iYWwuaGVscGVyID0gbmV3IGhlbHBlcigpO1xyXG5nbG9iYWwuZW5kcG9pbnQgPSBcInJlc3VsdFNldDFcIjtcclxuXHJcbiIsIi8qKlxyXG4gKiBBbmNpZW50IE1vZGVsXHJcbiAqXHJcbiAqIEBjb25zdHJ1Y3RvciBBbmNpZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEFuY2llbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IFtkYXRhLm5hbWVdIFRvdGFsIHJlc3VsdHMgcmV0dXJuZWQgYnkgZW5kcG9pbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IFtkYXRhLnN1cGVycG93ZXJdIERlc2NyaXB0aW9uIG9mIHRoZSBBbmNpZW50IEdvZHMgcG93ZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IFtkYXRhLmVuZF9vZl9hbl9lcmFdIERhdGUgb2YgdGhlaXIgZGVtaXNlXHJcbiAqIEByZXR1cm4ge09iamVjdH0gRXJyb3IgTW9kZWxcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgXCJcIixcclxuICAgICAgICBzdXBlcnBvd2VyOiBkYXRhLnN1cGVycG93ZXIgfHwgXCJcIixcclxuICAgICAgICBlbmRfb2ZfYW5fZXJhOiBkYXRhLmVuZF9vZl9hbl9lcmEgfHwgXCJcIlxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIEVycm9yXHJcbiAqXHJcbiAqIEBjb25zdHJ1Y3RvciBFcnJvciBcclxuICogQHBhcmFtIGRhdGEgSlNPTiBzdHJpbmcgY29udGFpbmluZyBkZXRhaWxzIG9mIGVycm9yIHJlc3BvbnNlXHJcbiAqIEByZXR1cm4ge09iamVjdH0gRXJyb3IgTW9kZWxcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgdmFyIGRhdGEgPSB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIj9KU09OLnBhcnNlKGRhdGEpOmRhdGE7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogZGF0YS5lcnJvciB8fCBcIlwiXHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIFJlc3VsdCBDb250YWluZXIgTW9kZWxcclxuICpcclxuICogQGNvbnN0cnVjdG9yIFJlc3VsdENvbnRhaW5lclxyXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBSZXN1bHQgQ29udGFpbmVyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGF0YS50b3RhbFJlc3VsdHNdIFRvdGFsIHJlc3VsdHMgcmV0dXJuZWQgYnkgZW5kcG9pbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IFtkYXRhLnJlc3VsdHNdIFN0cmluZyBjb250YWluaW5nIHJlc3VsdHMgXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGF0YS50ZXJtXSBTZWFyY2ggdGVybSB1c2VkIHRvIHF1ZXJ5IGVuZHBvaW50XHJcbiAqIEByZXR1cm4ge09iamVjdH0gRXJyb3IgTW9kZWxcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cdHZhciB0b3RhbFJlc3VsdHMgPSBkYXRhLnRvdGFsUmVzdWx0cyB8fCAwO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b3RhbFJlc3VsdHMgOiB0b3RhbFJlc3VsdHMgfHwgXCJcIixcclxuICAgICAgICByZXN1bHRzOiBkYXRhLnJlc3VsdHMgfHwgXCJcIixcclxuICAgICAgICB0ZXJtIDogZGF0YS5zZWFyY2hUZXJtXHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogSG93IHRvIHJlcHJlc2VudCB0aGUgYW5jaWVudC5cclxuICpcclxuICogQG1ldGhvZCBhbmNpZW50Vmlld1xyXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSAgUGFzc2luZyBBbmNpZW50IG1vZGVsIHRvIHZpZXdcclxuICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50aW5nIHZpZXdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdmFyIG5hbWUgPSBpdGVtLm5hbWUudG9VcHBlckNhc2UoKTtcclxuICAgIHZhciBzdXBlcnBvd2VyID0gaXRlbS5zdXBlcnBvd2VyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICB2YXIgZW5kX29mX2FuX2VyYSA9IGl0ZW0uZW5kX29mX2FuX2VyYS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBgPHNwYW4+JHtuYW1lfTwvc3Bhbj48YnIvPmAgK1xyXG4gICAgICAgIGA8c3Bhbj4ke3N1cGVycG93ZXJ9PC88c3Bhbj48YnIvPmAgK1xyXG4gICAgICAgIGA8c3Bhbj4ke2VuZF9vZl9hbl9lcmF9PC88c3Bhbj5gXHJcbiAgICApO1xyXG59IiwiLyoqXHJcbiAqIFJldHVybnMgYW4gZXJyb3Igdmlld1xyXG4gKlxyXG4gKiBAbWV0aG9kIGVycm9yTWVzc2FnZVZpZXdcclxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gRXJyb3IgbW9kZWxcclxuICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50aW5nIHZpZXdcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdmFyIGVycm9yTWVzc2FnZSA9IGl0ZW0uZXJyb3JNZXNzYWdlO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBgPHNwYW4+JHtlcnJvck1lc3NhZ2V9PC9zcGFuPjxici8+YCBcclxuICAgICk7XHJcbn0iLCIvKipcclxuICogVmlldyBmb3IgdGhlIHBhcmVudCBjb250YWluZXIgb2YgYSBsaXN0IG9mIHJlc3VsdHMgXHJcbiAqXHJcbiAqIEBtZXRob2QgcmVzdWx0Vmlld0NvbnRhbmVyXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHBhc3NpbmcgUmVzdWx0Q29udGFpbmVyIG1vZGVsIHRvIHZpZXdcclxuICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50aW5nIHZpZXdcclxuICovXHJcbiBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHZhciB0b3RhbFJlc3VsdHMgPSBpdGVtLnRvdGFsUmVzdWx0cztcclxuICAgIHZhciByZXN1bHRzID0gaXRlbS5yZXN1bHRzO1xyXG4gICAgdmFyIHRlcm0gPSBpdGVtLnRlcm07XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIGA8c3BhbiBjbGFzcz1cInRvdGFsXCI+JHt0b3RhbFJlc3VsdHN9IHJlc3VsdHMgZm91bmQgbWF0aGluZyB0aGUgdGVybSAke3Rlcm19PC9zcGFuPjxici8+YCArXHJcbiAgICAgICAgYCR7cmVzdWx0c31gXHJcbiAgICApO1xyXG59Il19
