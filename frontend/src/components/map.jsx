import { useMemo, useState } from 'react'
import ReactMapGl, {
  FullscreenControl,
  GeolocateControl,
  Marker
} from 'react-map-gl'

export const Map = ({ onPickupLocationClick, onDropoffLocationClick }) => {
  const [pickupLocation, setPickupLocation] = useState()
  const [dropOffLocation, setDropOffLocation] = useState()
  const view = useMemo(
    () => ({
      longitude: 85.323959,
      latitude: 27.717245,
      zoom: 18
    }),
    []
  )
  const handleMapClick = event => {
    //if there is no pickup location set the pickup location and immediately return
    if (!pickupLocation) {
      onPickupLocationClick(event.lngLat)
      return setPickupLocation(event.lngLat)
    }
    if (!dropOffLocation) {
      onDropoffLocationClick(event.lngLat)
      setDropOffLocation(event.lngLat)
    }
  }
  return (
    <ReactMapGl
      initialViewState={{ ...view }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      style={{ position: 'absolute', inset: 0, borderRadius: '10px' }}
      mapStyle='mapbox://styles/mapbox/streets-v11'
      onClick={handleMapClick}
    >
      <GeolocateControl />
      <FullscreenControl />
      {pickupLocation && (
        <Marker
          longitude={pickupLocation.lng}
          latitude={pickupLocation.lat}
          color='green'
          onClick={() => setPickupLocation(undefined)}
        />
      )}
      {dropOffLocation && (
        <Marker
          longitude={dropOffLocation.lng}
          latitude={dropOffLocation.lat}
          color='red'
          clickTolerance={300}
          onClick={() =>
            setDropOffLocation(current => (current ? undefined : current))
          }
        />
      )}
    </ReactMapGl>
  )
}
