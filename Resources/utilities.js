exports.array_merge = function() {
    var arg, args = Array.prototype.slice.call(arguments), argl = args.length, retObj = {}, k = "", argil = 0, j = 0, i = 0, ct = 0, toStr = Object.prototype.toString, retArr = true;
    for (i = 0; argl > i; i++) if ("[object Array]" !== toStr.call(args[i])) {
        retArr = false;
        break;
    }
    if (retArr) {
        retArr = [];
        for (i = 0; argl > i; i++) retArr = retArr.concat(args[i]);
        return retArr;
    }
    for (i = 0, ct = 0; argl > i; i++) {
        arg = args[i];
        if ("[object Array]" === toStr.call(arg)) for (j = 0, argil = arg.length; argil > j; j++) retObj[ct++] = arg[j]; else for (k in arg) arg.hasOwnProperty(k) && (parseInt(k, 10) + "" === k ? retObj[ct++] = arg[k] : retObj[k] = arg[k]);
    }
    return retObj;
};

exports.serialize = function(obj) {
    var str = [];
    for (var p in obj) obj[p] instanceof Array ? "types" == p ? str.push(encodeURIComponent(p) + "=" + obj[p].join("|")) : str.push(encodeURIComponent(p) + "=" + obj[p].join(",")) : str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
};

exports.GUID = function() {
    var S4 = function() {
        return Math.floor(65536 * Math.random()).toString(16);
    };
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};

exports.cropImage = function(image, x, y, width, height) {
    var baseImage = Titanium.UI.createImageView({
        image: image,
        width: Titanium.Platform.displayCaps.platformWidth,
        height: Titanium.Platform.displayCaps.platformHeight
    });
    var cropView = Titanium.UI.createView({
        width: width,
        height: height
    });
    cropView.add(baseImage);
    baseImage.left = -x;
    baseImage.top = -y;
    return cropView.toImage();
};

exports.confirmDelete = function(confirmed, title, message) {
    var alert = Titanium.UI.createAlertDialog({
        title: title || "Delete data",
        message: message || "Are you sure?",
        buttonNames: [ "Yes", "No" ],
        cancel: 1
    });
    alert.addEventListener("click", function(e) {
        if (e.cancel === e.index || true === e.cancel) return;
        switch (e.index) {
          case 0:
            confirmed();
            break;

          case 1:
            break;

          default:        }
    });
    alert.show();
};

exports.getColorFromId = function(id) {
    var i = parseInt(id.replace(/[^0-9]/g, ""));
    var red = 64 + i % 128;
    var green = 64 + Math.floor(i / 3) % 128;
    var blue = 64 + Math.floor(i / 5) % 128;
    return "rgb(" + red + "," + green + "," + blue + ")";
};