var ancientView = require('../../../src/js/view/ancientView');
describe('b', function(require) {
  it('should equal fixture contents', function() {
	var testObj = ancientView({
		name : "test",
		superpower : "test",
		end_of_an_era : ""
	})
	expect(testObj).toEqual('<div class="result" ><span>TEST</span><br/><span>TEST</span><br/><span></span></div>');
  });

});

