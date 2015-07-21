module.exports = function(data) {
	var totalResults = data.totalResults || 0;
    return {
        totalResults : totalResults || "",
        results: data.results || "",
        term : data.searchTerm
    }
}