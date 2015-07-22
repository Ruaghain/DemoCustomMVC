module.exports = function(data) {
	return {
		changeEndpoint : function(e, resultSet, include, error) {
			$(".selected").each(function(){
				$(this).addClass("unselected").removeClass("selected");
			})
			$(e.target).toggleClass("selected").removeClass("unselected");
			endpoint = resultSet;
			cont.includeTerm = include;
			cont.useError = error;
		}
	}
}