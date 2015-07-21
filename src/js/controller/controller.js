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