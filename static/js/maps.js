// twitter map

var map, heatmap, bounds, points, points_on_map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.775, lng: -122.434}, // San Fran
		zoom: 5,
		minZoom: 1,
    mapTypeId: 'roadmap',
		streetViewControl: false,
		styles: style,
	});
	points = getPoints();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map,
  });
	// keep live track of the coordinates
	google.maps.event.addListener(map, "bounds_changed", function() {
		onMapMove();
	});
}

function extendMap() {
	if ($("#collapse-button").text	().indexOf('Show') > -1) {
		$("#collapse-button").text("Hide controls");
		$('#map').css('height', 'calc(100% - 170px)');
	} else {
		$("#collapse-button").text('Show controls');
		$('#map').css('height', '100%');
	}
	var e = document.createEvent('UIEvents');
	e.initUIEvent('resize', true, false, window, 0);
	window.dispatchEvent(e);
}

function onMapMove() {
	bounds = map.getBounds().toJSON()
	center = map.getCenter().toJSON()
	document.getElementById("lat").innerHTML = center.lat;
	document.getElementById("lng").innerHTML = center.lng;

	points_on_map = []
	for(var i = 0; i < points.length; i++) {
		if (pointInBounds(points[i].location, bounds)) {
			points_on_map.push({name: points[i].name, influence: points[i].weight})
		}
	}
	points_on_map.sort(function(a,b){
      if( a.influence > b.influence){
          return -1;
      }else if( a.influence < b.influence ) {
          return 1;
      }
      return 0;
   });
	document.getElementById("points").innerHTML = points_on_map.length;
	document.getElementById("one").innerHTML = points_on_map[0].name;
	document.getElementById("two").innerHTML = points_on_map[1].name;
	document.getElementById("three").innerHTML = points_on_map[2].name;
	document.getElementById("four").innerHTML = points_on_map[3].name;
	document.getElementById("five").innerHTML = points_on_map[4].name;
}

function pointInBounds(point, bounds) {

	if (point.lat() <= bounds.north && point.lat() >= bounds.south) {
		if (bounds.east > bounds.west) {
			return point.lng() <= bounds.east && point.lng() >= bounds.west;
		} else {
			return (point.lng() < bounds.east && point.lng() >= -180) || (point.lng() > bounds.west && point.lng() <= 180);
		}

	}
	return false;
}

$("#search").on('keyup', function(e){
    if(e.keyCode == 13){
			var query = $("#search").val().replace(' ', '+');
			var key = "&key=AIzaSyCZBUXlJTya934fLCVMwtZZ_UfyYpyx6_8"
			var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + key
			$.get(
				url,
			 	function(data, status){
							var bounds = new google.maps.LatLngBounds();
							bounds.extend(data.results[0]['geometry']['viewport']['northeast'])
							bounds.extend(data.results[0]['geometry']['viewport']['southwest'])
							map.fitBounds(bounds);
							map.setCenter(data.results[0]['geometry']['location']);
				}
			);
    }
});

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 100);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function weightBy(value) {
	console.log("Weight: " + value);
}

function filterBy(value) {
	console.log("Sort: " + value);
}

function getPoints() {
	pts = []
	jQuery.each(data, function(i, point) {
		var lat = point.lat;
		var lng = point.long;
		var weight = point.influence;
		var point = {
			location: new google.maps.LatLng(lat, lng),
			weight: weight,
			name: point.name,
			handle: point.handle
		};
		pts.push(point);
	});
	return pts;
}
