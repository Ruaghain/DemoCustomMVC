module.exports = function(data) {
    return {
        name: data.name || "",
        superpower: data.superpower || "",
        end_of_an_era: data.end_of_an_era || ""
    }
}