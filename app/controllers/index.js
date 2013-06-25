
try {
	exports.close = function() {
		winBase.close();
		mapWin = null;
		winBase = null;
	};
	Ti.API.info("Running in TiShadow");
} catch (e) {
	Ti.API.info("Running stand-alone");
}

Ti.UI.setBackgroundColor('#000');

var mapWin = Alloy.createController('mapview').getView();

var winBase = require('/ui/navWindow').createNavigationWindow(mapWin);

winBase.open();
