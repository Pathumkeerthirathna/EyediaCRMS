import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

function Maps() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyANMAlOFTy3Kn6aw7cGhHWejtI83Xdxmrg', // Replace with your actual API key
  });

  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(defaultCenter.lat);
  const [lng, setLng] = useState(defaultCenter.lng);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(markerPosition);
    map.fitBounds(bounds);
    setMap(map);
  }, [markerPosition]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLat = parseFloat(lat);
    const newLng = parseFloat(lng);
    if (!isNaN(newLat) && !isNaN(newLng)) {
      setMarkerPosition({ lat: newLat, lng: newLng });
      if (map) {
        const bounds = new window.google.maps.LatLngBounds({ lat: newLat, lng: newLng });
        map.fitBounds(bounds);
      }
    }
  };

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    setLat(clickedLat);
    setLng(clickedLng);
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-x-2">
        <input
          type="number"
          step="any"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
          className="border p-2 rounded"
        />
        <input
          type="number"
          step="any"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Show on Map</button>
      </form>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
}

export default Maps;
