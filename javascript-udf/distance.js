/* a UDF library contains one or more javascript functions */
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
function haversineDistance(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
}

function landmarkByActivity(type, rowlimit, lat, lon) {
  var query = select l.name, l.activity, l.city, l.content, l.geo from `travel-sample`.inventory.landmark l where activity = $type limit $rowlimit;
  let landmarks = [];
  for (const row of query) {
    row['distance_km'] = haversineDistance(row["geo"]["lat"], row["geo"]["lon"], lat, lon)
    landmarks.push(row);
  }
  return {'num_entries': landmarks.length, 'data': landmarks};
}