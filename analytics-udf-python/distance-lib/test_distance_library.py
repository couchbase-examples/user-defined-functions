from distance_library import Distance

lat1, lon1 = (51.5, 0)
lat2, lon2 = (38.8, -77.1)
distance = Distance().calculate_geodesic_distance(lat1, lon1, lat2, lon2)
print(f"Distance = {distance}km")
