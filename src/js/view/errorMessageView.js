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