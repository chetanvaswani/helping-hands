function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

// takes in an array of latitude and longitude in this partifular order
export function haversineDistance(
    coord1: [number, number],
    coord2: [number, number]
): number {
    const R = 6371000;
    const [lat1, lng1] = coord1;
    const [lat2, lng2] = coord2;
  
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
  
    const c = 2 * Math.asin(Math.sqrt(a));
  
    return R * c;
}
  