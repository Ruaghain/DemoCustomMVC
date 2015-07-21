module.exports = function(item) {
    var totalResults = item.totalResults;
    var results = item.results;
    var term = item.term;
    return (
        `<span>${totalResults} results found mathing the term ${term}</span><br/>` +
        `${results}`
    );
}