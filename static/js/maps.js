
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap, bounds, points, points_on_map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'satellite'
  });
	points = getPoints();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: points,
    map: map
  });
	// keep live track of the coordinates
	google.maps.event.addListener(map, "bounds_changed", function() {
		onMapMove();
	});
	google.maps.event.addListener(map, 'click', function(event){
  	//console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() );
		console.log(pointInBounds(event.latLng, bounds));
	});
}

function onMapMove() {
	bounds = map.getBounds().toJSON()
	document.getElementById("north").innerHTML = bounds.north;
	document.getElementById("west").innerHTML = bounds.west
	document.getElementById("east").innerHTML = bounds.east;
	document.getElementById("south").innerHTML = bounds.south;

	var num_points_on_map = 0
	for(var i = 0; i < points.length; i++) {
		num_points_on_map += (pointInBounds(points[i], bounds) ? 1 : 0);
	}
	document.getElementById("points").innerHTML = num_points_on_map;
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

function changeGradient() {
	debugger;
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
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function getPoints() {
	pts = []
	for(var i = 0; i < 1000; i++) {
		var lat = (Math.random() * 160) - 80;
		var long = (Math.random() * 360) - 180;
		var point = new google.maps.LatLng(lat, long)
		pts.push(point);
	}
	return pts;
}
