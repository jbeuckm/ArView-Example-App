// Create a test suite
describe("ArView Widget Tests", function() {

	var Alloy = require("/alloy");

	var arview = Alloy.createWidget("ArView");


	describe("can calculate diference in angle", function() {

		it("calculates angular difference", function() {
			
			var diff = arview.findAngularDistance(10, 20);
			expect(diff).toEqual(-10);

			var diff = arview.findAngularDistance(10, 350);
			expect(diff).toEqual(20);

		});

	});
	
}); 