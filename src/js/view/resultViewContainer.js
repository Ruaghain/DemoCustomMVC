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