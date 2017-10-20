
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

function sha1(str) {
  //  discuss at: http://phpjs.org/functions/sha1/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //  depends on: utf8_encode
  //   example 1: sha1('Kevin van Zonneveld');
  //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

  var rotate_left = function(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  /*var lsb_hex = function (val) { // Not in use; needed?
    var str="";
    var i;
    var vh;
    var vl;

    for ( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };*/

  var cvt_hex = function(val) {
    var str = '';
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };

  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;

  var str_len = str.length;

  var word_array = [];
  for (i = 0; i < str_len - 3; i += 4) {
    j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (str_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
        8 | 0x80;
      break;
  }

  word_array.push(i);

  while ((word_array.length % 16) != 14) {
    word_array.push(0);
  }

  word_array.push(str_len >>> 29);
  word_array.push((str_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = word_array[blockstart + i];
    }
    for (i = 16; i <= 79; i++) {
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}


function sendRequest() {
	var dt = new Date;
  var time = parseInt(dt.getTime() / 1000);

  var callBackURL = "oob"; //oob for now
  var nonce = "12342897";

  //Create Signature Base String using formula
  var baseSign = "POST" + "&" + encodeURIComponent("https://api.twitter.com/oauth/request_token").toString() + "&"
   + encodeURIComponent("oauth_callback") + "%3D" + encodeURIComponent(callBackURL)
   + "%26"
   + encodeURIComponent("oauth_consumer_key") + "%3D" + encodeURIComponent("amVgivH7UO1pqDZMUiy7lnz7n")
   + "%26"
   + encodeURIComponent("oauth_nonce") + "%3D" + encodeURIComponent(nonce)
   + "%26"
   + encodeURIComponent("oauth_signature_method") + "%3D" + encodeURIComponent("HMAC-SHA1")
   + "%26"
   + encodeURIComponent("oauth_timestamp") + "%3D" + encodeURIComponent(time)
   + "%26"
   + encodeURIComponent("oauth_version") + "%3D" + encodeURIComponent("1.0");

  var signature = sha1("wikZPd4iUlvJgMjDXPN3BzROBAc8C2nMeDyAb2QRbhvxy1kGZw", baseSign);

  //Build headers from signature
  var headers = JSON.stringify({
      Authorization: {
          oauth_nonce: nonce,
          oauth_callback: encodeURIComponent(callBackURL),
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: time,
          oauth_consumer_key: "amVgivH7UO1pqDZMUiy7lnz7n",
					oauth_token: "921378112465702914-NaX3xg1VAsPmUnGOy2zZiLVWbeqAYj2",
          oauth_signature: signature,
          oauth_version: "1.0",
					accept: "*/*",
					'No-Access-Control-Allow-Origin' : "*"
      }
  });
	console.log(headers);
  $.ajax(
		{
			type: "post",
			headers: headers,
			url: "https://api.twitter.com/1.1/statuses/update.json?include_entities=true",
    	success: function(data, status){
					alert("Data: " + data + "\nStatus: " + status);
				},
			error: function(data, status){
					console.log(data);
			}
		})
}

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
