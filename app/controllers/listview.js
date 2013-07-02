var args = arguments[0] || {};

Alloy.Collections.GooglePlace.trigger('reset');

function tableClick(e) {
	alert(e.row.modelId);
	var model = Alloy.Collections.GooglePlace.where({id:e.row.modelId});
}


function clickClose() {
	$.win.close();
}
