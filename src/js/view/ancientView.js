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