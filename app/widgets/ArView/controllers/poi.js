var args = arguments[0] || {};

$.poiView.modelId = args.id;

$.titleLabel.text = args.title;
$.ratingLabel.text = args.rating;

if (args.image) {
	$.poiImage.image = args.image;
}
else {
	$.poiImage.visible = false;
}


