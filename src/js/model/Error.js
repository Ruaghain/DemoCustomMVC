module.exports = function(data) {
    var data = typeof data === "string"?JSON.parse(data):data;
    return {
        errorMessage: data.error || ""
	}
}