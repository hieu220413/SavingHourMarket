package com.fpt.capstone.savinghourmarket.util.kmean;

import java.util.Map;

public class HaversineDistance implements Distance{
    @Override
    public double calculate(Map<String, Double> f1, Map<String, Double> f2) {
        double lat1 = f1.get("latitude");
        double lon1 = f1.get("longitude");
        double lat2 = f2.get("latitude");
        double lon2 = f2.get("longitude");

        // distance between latitudes and longitudes
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // convert to radians
        lat1 = Math.toRadians(lat1);
        lat2 = Math.toRadians(lat2);

        // apply formulae
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                        Math.cos(lat1) *
                        Math.cos(lat2);
        double rad = 6371;
        double c = 2 * Math.asin(Math.sqrt(a));
        return rad * c;
    }
}
