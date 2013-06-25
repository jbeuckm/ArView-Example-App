var isAndroid = "android" === Ti.Platform.osname;

exports.createNavigationWindow = function(baseWindow) {
    var me;
    var windows = [];
    if (isAndroid) {
        me = baseWindow;
        windows.push(baseWindow);
    } else {
        var me = Ti.UI.createWindow({
            backgroundColor: "black"
        });
        me.orientationModes = [ Ti.UI.PORTRAIT ];
        me.nav = Ti.UI.iPhone.createNavigationGroup({
            window: baseWindow
        });
        me.add(me.nav);
        me.addEventListener("focus", function(e) {
            baseWindow.fireEvent("focus", e);
        });
        me.addEventListener("blur", function(e) {
            baseWindow.fireEvent("blur", e);
        });
        windows.push(baseWindow);
    }
    me.closeTopWindow = function() {
        if (1 >= windows.length) return;
        var lastWindow = windows[windows.length - 1];
        isAndroid ? lastWindow.close() : me.nav.close(lastWindow);
    };
    me.openNextWindow = function(windowToOpen) {
        windowToOpen.nav = me;
        isAndroid ? windowToOpen.open({
            animated: true
        }) : me.nav.open(windowToOpen);
        windows.push(windowToOpen);
        windowToOpen.addEventListener("close", function() {
            windows.pop();
            windowToOpen.nav = null;
            windowToOpen = null;
        });
        Ti.API.debug("total windows=" + windows.length);
    };
    me.windowCount = function() {
        return windows.length;
    };
    return me;
};