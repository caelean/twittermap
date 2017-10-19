
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap, bounds, points_on_map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'satellite'
  });
	points = getPoints();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });
	// keep live track of the coordinates
	google.maps.event.addListener(map, "bounds_changed", function() {
	bounds = map.getBounds().toJSON()
	document.getElementById("north").innerHTML = bounds.north;
	document.getElementById("west").innerHTML = bounds.west
	document.getElementById("east").innerHTML = bounds.east;
	document.getElementById("south").innerHTML = bounds.south;

	var num_points_on_map = 0
	for(var i = 0; i < points.length; i++) {
		point = points[i];
		if (point.lat() <= bounds.north && point.lat() >= bounds.south) {
			if (bounds.east > bounds.west) {
				if (point.lng() <= bounds.east && point.lng() >= bounds.west) {
						num_points_on_map++;
				}
			} else {
				if ((point.lng() < bounds.east && point.lng() >= -180) || (point.lng() > bounds.west && point.lng() <= 180)) {
						num_points_on_map++;
				}
			}
		}
	}
	document.getElementById("points").innerHTML = num_points_on_map;
	});
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
