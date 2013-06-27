var args = arguments[0] || {};

Alloy.Collections.GooglePlace.on('reset', function(){
	alert(Alloy.Collections.GooglePlace.at(0).toJSON());
});
Alloy.Collections.GooglePlace.trigger('reset');

function tableClick(e) {
	alert(JSON.stringify(e));
}


