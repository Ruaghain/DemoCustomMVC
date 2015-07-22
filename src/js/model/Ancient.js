/**
 * Ancient Model
 *
 * @constructor Ancient
 * @param {Object} data Ancient
 * @param {String} [data.name] Total results returned by endpoint
 * @param {String} [data.superpower] Description of the Ancient Gods power
 * @param {String} [data.end_of_an_era] Date of their demise
 * @return {Object} Error Model
 */
module.exports = function(data) {
    return {
        name: data.name || "",
        superpower: data.superpower || "",
        end_of_an_era: data.end_of_an_era || ""
    }
}