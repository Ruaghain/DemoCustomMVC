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
        totalResults : totalResults,
        results: data.results || "",
        term : data.searchTerm
    }
}