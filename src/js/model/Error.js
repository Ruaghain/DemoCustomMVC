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