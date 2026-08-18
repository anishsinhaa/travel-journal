export function getMapEmbedUrl(maplink, location) {
  if (maplink) {
    const coordMatch = maplink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=12&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(maplink)}&output=embed`;
  }

  if (location) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  }

  return null;
}

export function getMapOpenUrl(maplink, location) {
  if (maplink) return maplink;
  if (location) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }
  return null;
}
