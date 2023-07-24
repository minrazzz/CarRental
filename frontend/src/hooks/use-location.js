import { useEffect, useState } from 'react'

export const useLocation = () => {
  const [coordinates, setCoordinates] = useState()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(postion => {
      const { coords } = postion
      setCoordinates(coords)
    })
  }, [])
  return [coordinates.longitude, coordinates.latitude]
}
