(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var base = "https://athena-7.herokuapp.com/ancients.json";
var resultView = require("../view/resultView");
var resultViewContainer = require("../view/resultViewContainer");
var errorMessageView = require("../view/errorMessageView");

var Result = require("../model/Result");
var ResultsContainer = require("../model/ResultsContainer");
var Error = require("../model/Error");

module.exports = function() {
    var searchResults = {};
    return {
        searchSuccessCallback: function(data, searchTerm, resultsMountNode) {
            var results = "";
            $.each(data, function(index) {
                results += resultView(new Result(data[index]));
            });
            var resultsList = $(results);
            var container = ResultsContainer({
                totalResults: data.length,
                results: results,
                searchTerm: searchTerm
            });
            $("#" + resultsMountNode).empty().append(resultViewContainer(container));
            return true;
        },
        getData: function(event, resultListId, includeTerm) {
            var searchTerm = event.target.value;
            $("#" + resultListId).empty();
            var self = this;
            var options = {
                url: base,
                cache: false,
                dataType: "json",
                success: function(data) {
                    var cachedData = includeTerm && searchTerm !== "" ? data["ancients"] : data;
                    self.searchSuccessCallback(cachedData, searchTerm, resultListId);
                    searchResults[searchTerm] = cachedData;
                }
            };
            if (includeTerm) {
                options.data = {
                    'search': searchTerm
                };
            }
            if (searchResults[searchTerm] !== undefined) {
                console.log("using cached data...");
                self.searchSuccessCallback(searchResults[searchTerm], searchTerm, resultListId);

            } else {
                $.ajax(options);
            }
        },
        getDataError: function(event, resultListId, includeTerm) {
            var searchTerm = event.target.value;
            $("#" + resultListId).empty();
            var options = {
                url: base,
                cache: false,
                dataType: "json",
                data: {
                    'error': true
                },
                error: function(data) {
                    var errorMessage = new Error(data.responseText);
                    $("#" + resultListId).empty().append($(errorMessageView(errorMessage)));
                }
            };
            $.ajax(options);
        }
    }
}
},{"../model/Error":3,"../model/Result":4,"../model/ResultsContainer":5,"../view/errorMessageView":6,"../view/resultView":7,"../view/resultViewContainer":8}],2:[function(require,module,exports){
(function (global){
controller = require("./controller/controller");
global.cont = new controller();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./controller/controller":1}],3:[function(require,module,exports){
module.exports = function(data) {
    var data = typeof data === "string"?JSON.parse(data):data;
    return {
        errorMessage: data.error || ""
	}
}
},{}],4:[function(require,module,exports){
module.exports = function(data) {
    return {
        name: data.name || "",
        superpower: data.superpower || "",
        end_of_an_era: data.end_of_an_era || ""
    }
}
},{}],5:[function(require,module,exports){
module.exports = function(data) {
	var totalResults = data.totalResults || 0;
    return {
        totalResults : totalResults || "",
        results: data.results || "",
        term : data.searchTerm
    }
}
},{}],6:[function(require,module,exports){
module.exports = function(item) {
    var errorMessage = item.errorMessage;
    return (
        `<span>${errorMessage}</span><br/>` 
    );
}
},{}],7:[function(require,module,exports){
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
module.exports = function(item) {
    var totalResults = item.totalResults;
    var results = item.results;
    var term = item.term;
    return (
        `<span>${totalResults} results found mathing the term ${term}</span><br/>` +
        `${results}`
    );
}
},{}]},{},[1,2,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29udHJvbGxlci9jb250cm9sbGVyLmpzIiwic3JjL2pzL21haW4uanMiLCJzcmMvanMvbW9kZWwvRXJyb3IuanMiLCJzcmMvanMvbW9kZWwvUmVzdWx0LmpzIiwic3JjL2pzL21vZGVsL1Jlc3VsdHNDb250YWluZXIuanMiLCJzcmMvanMvdmlldy9lcnJvck1lc3NhZ2VWaWV3LmpzIiwic3JjL2pzL3ZpZXcvcmVzdWx0Vmlldy5qcyIsInNyYy9qcy92aWV3L3Jlc3VsdFZpZXdDb250YWluZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZFQTtBQUNBOzs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYmFzZSA9IFwiaHR0cHM6Ly9hdGhlbmEtNy5oZXJva3VhcHAuY29tL2FuY2llbnRzLmpzb25cIjtcclxudmFyIHJlc3VsdFZpZXcgPSByZXF1aXJlKFwiLi4vdmlldy9yZXN1bHRWaWV3XCIpO1xyXG52YXIgcmVzdWx0Vmlld0NvbnRhaW5lciA9IHJlcXVpcmUoXCIuLi92aWV3L3Jlc3VsdFZpZXdDb250YWluZXJcIik7XHJcbnZhciBlcnJvck1lc3NhZ2VWaWV3ID0gcmVxdWlyZShcIi4uL3ZpZXcvZXJyb3JNZXNzYWdlVmlld1wiKTtcclxuXHJcbnZhciBSZXN1bHQgPSByZXF1aXJlKFwiLi4vbW9kZWwvUmVzdWx0XCIpO1xyXG52YXIgUmVzdWx0c0NvbnRhaW5lciA9IHJlcXVpcmUoXCIuLi9tb2RlbC9SZXN1bHRzQ29udGFpbmVyXCIpO1xyXG52YXIgRXJyb3IgPSByZXF1aXJlKFwiLi4vbW9kZWwvRXJyb3JcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlYXJjaFJlc3VsdHMgPSB7fTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VhcmNoU3VjY2Vzc0NhbGxiYWNrOiBmdW5jdGlvbihkYXRhLCBzZWFyY2hUZXJtLCByZXN1bHRzTW91bnROb2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gXCJcIjtcclxuICAgICAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzICs9IHJlc3VsdFZpZXcobmV3IFJlc3VsdChkYXRhW2luZGV4XSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHNMaXN0ID0gJChyZXN1bHRzKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IFJlc3VsdHNDb250YWluZXIoe1xyXG4gICAgICAgICAgICAgICAgdG90YWxSZXN1bHRzOiBkYXRhLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHJlc3VsdHMsXHJcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgcmVzdWx0c01vdW50Tm9kZSkuZW1wdHkoKS5hcHBlbmQocmVzdWx0Vmlld0NvbnRhaW5lcihjb250YWluZXIpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbihldmVudCwgcmVzdWx0TGlzdElkLCBpbmNsdWRlVGVybSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGVybSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHJlc3VsdExpc3RJZCkuZW1wdHkoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHVybDogYmFzZSxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FjaGVkRGF0YSA9IGluY2x1ZGVUZXJtICYmIHNlYXJjaFRlcm0gIT09IFwiXCIgPyBkYXRhW1wiYW5jaWVudHNcIl0gOiBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoU3VjY2Vzc0NhbGxiYWNrKGNhY2hlZERhdGEsIHNlYXJjaFRlcm0sIHJlc3VsdExpc3RJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoUmVzdWx0c1tzZWFyY2hUZXJtXSA9IGNhY2hlZERhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChpbmNsdWRlVGVybSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICdzZWFyY2gnOiBzZWFyY2hUZXJtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hSZXN1bHRzW3NlYXJjaFRlcm1dICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgY2FjaGVkIGRhdGEuLi5cIik7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaFN1Y2Nlc3NDYWxsYmFjayhzZWFyY2hSZXN1bHRzW3NlYXJjaFRlcm1dLCBzZWFyY2hUZXJtLCByZXN1bHRMaXN0SWQpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQuYWpheChvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0RGF0YUVycm9yOiBmdW5jdGlvbihldmVudCwgcmVzdWx0TGlzdElkLCBpbmNsdWRlVGVybSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGVybSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgJChcIiNcIiArIHJlc3VsdExpc3RJZCkuZW1wdHkoKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IGJhc2UsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2Vycm9yJzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IG5ldyBFcnJvcihkYXRhLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIHJlc3VsdExpc3RJZCkuZW1wdHkoKS5hcHBlbmQoJChlcnJvck1lc3NhZ2VWaWV3KGVycm9yTWVzc2FnZSkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJC5hamF4KG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9jb250cm9sbGVyL2NvbnRyb2xsZXJcIik7XHJcbmdsb2JhbC5jb250ID0gbmV3IGNvbnRyb2xsZXIoKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHZhciBkYXRhID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCI/SlNPTi5wYXJzZShkYXRhKTpkYXRhO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IGRhdGEuZXJyb3IgfHwgXCJcIlxyXG5cdH1cclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOiBkYXRhLm5hbWUgfHwgXCJcIixcclxuICAgICAgICBzdXBlcnBvd2VyOiBkYXRhLnN1cGVycG93ZXIgfHwgXCJcIixcclxuICAgICAgICBlbmRfb2ZfYW5fZXJhOiBkYXRhLmVuZF9vZl9hbl9lcmEgfHwgXCJcIlxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0dmFyIHRvdGFsUmVzdWx0cyA9IGRhdGEudG90YWxSZXN1bHRzIHx8IDA7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvdGFsUmVzdWx0cyA6IHRvdGFsUmVzdWx0cyB8fCBcIlwiLFxyXG4gICAgICAgIHJlc3VsdHM6IGRhdGEucmVzdWx0cyB8fCBcIlwiLFxyXG4gICAgICAgIHRlcm0gOiBkYXRhLnNlYXJjaFRlcm1cclxuICAgIH1cclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdmFyIGVycm9yTWVzc2FnZSA9IGl0ZW0uZXJyb3JNZXNzYWdlO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBgPHNwYW4+JHtlcnJvck1lc3NhZ2V9PC9zcGFuPjxici8+YCBcclxuICAgICk7XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHZhciBuYW1lID0gaXRlbS5uYW1lLnRvVXBwZXJDYXNlKCk7XHJcbiAgICB2YXIgc3VwZXJwb3dlciA9IGl0ZW0uc3VwZXJwb3dlci50b1VwcGVyQ2FzZSgpO1xyXG4gICAgdmFyIGVuZF9vZl9hbl9lcmEgPSBpdGVtLmVuZF9vZl9hbl9lcmEudG9VcHBlckNhc2UoKTtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgYDxzcGFuPiR7bmFtZX08L3NwYW4+PGJyLz5gICtcclxuICAgICAgICBgPHNwYW4+JHtzdXBlcnBvd2VyfTwvPHNwYW4+PGJyLz5gICtcclxuICAgICAgICBgPHNwYW4+JHtlbmRfb2ZfYW5fZXJhfTwvPHNwYW4+YFxyXG4gICAgKTtcclxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgdmFyIHRvdGFsUmVzdWx0cyA9IGl0ZW0udG90YWxSZXN1bHRzO1xyXG4gICAgdmFyIHJlc3VsdHMgPSBpdGVtLnJlc3VsdHM7XHJcbiAgICB2YXIgdGVybSA9IGl0ZW0udGVybTtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgYDxzcGFuPiR7dG90YWxSZXN1bHRzfSByZXN1bHRzIGZvdW5kIG1hdGhpbmcgdGhlIHRlcm0gJHt0ZXJtfTwvc3Bhbj48YnIvPmAgK1xyXG4gICAgICAgIGAke3Jlc3VsdHN9YFxyXG4gICAgKTtcclxufSJdfQ==
