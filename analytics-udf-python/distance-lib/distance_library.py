from geopy import distance


class Distance:
    def calculate_geodesic_distance(self, lat1, lon1, lat2, lon2) -> float:
        """Calculate Distance using geodesic distance"""
        return distance.distance((lat1, lon1), (lat2, lon2)).km
