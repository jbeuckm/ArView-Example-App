/** @module utilities */

/**
 * 
 */
exports.array_merge = function() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Nate
  // +   input by: josh
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: arr1 = {"color": "red", 0: 2, 1: 4}
  // *     example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  // *     example 1: array_merge(arr1, arr2)
  // *     returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  // *     example 2: arr1 = []
  // *     example 2: arr2 = {1: "data"}
  // *     example 2: array_merge(arr1, arr2)
  // *     returns 2: {0: "data"}
  var args = Array.prototype.slice.call(arguments),
    argl = args.length,
    arg,
    retObj = {},
    k = '',
    argil = 0,
    j = 0,
    i = 0,
    ct = 0,
    toStr = Object.prototype.toString,
    retArr = true;

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
    }
  }

  if (retArr) {
    retArr = [];
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
    }
    return retArr;
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
      }
    }
    else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k];
          }
          else {
            retObj[k] = arg[k];
          }
        }
      }
    }
  }
  return retObj;
};



/**
 * Do the custom serialization for making the google places api request
 * 
 * @param {Object} obj
 */
exports.serialize = function(obj) {
	var str = [];
	for(var p in obj) {
  		if (obj[p]  instanceof Array) {
  			if (p == 'types') {
				str.push(encodeURIComponent(p) + "=" + obj[p].join('|'));
  			}
  			else {
				str.push(encodeURIComponent(p) + "=" + obj[p].join(','));
			}
  		}
  		else {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	}
	return str.join("&");
};



exports.GUID = function() {
    var S4 = function ()
    {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };

    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
};



exports.cropImage = function(image, x, y, width, height) {

	var baseImage = Titanium.UI.createImageView({
	    image: image,
	    width: Titanium.Platform.displayCaps.platformWidth,
	    height: Titanium.Platform.displayCaps.platformHeight
	});
	 
	var cropView = Titanium.UI.createView({
	    width: width, height: height
	});
	
	cropView.add(baseImage);
	
	baseImage.left = -x;
	baseImage.top = -y;

	return cropView.toImage();
}



exports.confirmDelete = function(confirmed, title, message) {
	
	var alert = Titanium.UI.createAlertDialog({ 
		title: title || 'Delete data', 
		message: message || 'Are you sure?', 
		buttonNames: ['Yes', 'No'], 
		cancel: 1 
	});
	
	alert.addEventListener('click', function(e) { 
		
//		Titanium.API.info('e = ' + JSON.stringify(e));

	   if (e.cancel === e.index || e.cancel === true) {
	      return;
	   }
	
			
		switch (e.index) {
			case 0: 
				confirmed();
				break;
			
			case 1: 
				break;

			default:
				break;
		}
	});
	
	alert.show();
}



exports.getColorFromId = function(id) {

	// need a numbers-only string
	var i = parseInt(id.replace(/[^0-9]/g, ''));

	var red = 64 + i % 128;
	var green = 64 + Math.floor(i/3) % 128;
	var blue = 64 + Math.floor(i/5) % 128;
	
	return 'rgb('+red+','+green+','+blue+')';
}


