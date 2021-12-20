import Star from "./star"

const r2d = (rad: number) => (rad * 180) / Math.PI
const d2r = (degree: number) => (degree * Math.PI) / 180

const { sin, cos, tan, asin, acos, atan2 } = Math

export interface Geography {
  lat: number
  lon: number
}

// getGeographic : ip -> {lat, long}
export const getLocalGeographic = async (): Promise<Geography> => {
  const endpoint = `http://ip-api.com/json/`
  const base = { lat: 37.582474, lon: 127.02756 }

  return fetch(endpoint)
    .then((res) => res.json())
    .catch((err) => base)
}

// getLocalSidereal : long -> LST
export const getLocalSidereal = (longitude: number) => {
  const now = new Date()
  const from2020 = new Date("2020/01/01")

  const offset =
    (now.getTime() - from2020.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0

  // Ignore err between UT1 and UTC,
  // since it's tiny.
  const UT1 =
    now.getUTCHours() +
    now.getUTCMinutes() / 60.0 +
    now.getUTCSeconds() / 3600.0

  /*
   * Formula by U.S. Naval Observatory, 2020
   * Computing general local sidereal is exhausting...
   * Use this!
   */
  const GST = (6.6090775 + 0.0657098246 * offset + 1.00273791 * UT1) % 24

  // GST = LST + long(converted to hours)
  const LST = (GST + longitude / 15.0) % 24

  return LST
}

// equatorialToHorizontal : lat -> LST -> star -> {az, alt}
export const equatorialToHorizontal = (
  lat: number,
  LST: number,
  star: Star
): Star => {
  /*
   * ra : hour
   * dec : -90 ~ +90
   * lat : -90 ~ +90
   * LST : hour
   * az : 360
   * alt : -90 ~ +90
   * HA : 0 ~ 360
   */

  const ra = star.ra
  const dec = star.dec

  // Convert HA to angle.
  const HA = ((LST - ra) * 15) % 360

  // For readability.
  const { sin, cos, tan, asin, acos, atan2 } = Math

  const Altitude = r2d(
    asin(
      sin(d2r(dec)) * sin(d2r(lat)) +
        cos(d2r(dec)) * cos(d2r(lat)) * cos(d2r(HA))
    )
  )

  const Azimuth =
    r2d(
      atan2(
        sin(d2r(HA)),
        cos(d2r(HA)) * sin(d2r(lat)) - tan(d2r(dec)) * cos(d2r(lat))
      )
    ) + 180

  star.az = Azimuth
  star.alt = Altitude

  return star
}

// azaltToCatesian : az -> alt -> {x, y, z}
export const azaltToCatesian = (az: number, alt: number) => {
  const pi = (-az + 360) % 360
  const theta = -alt + 90

  const x = sin(d2r(theta)) * cos(d2r(pi))
  const y = sin(d2r(theta)) * sin(d2r(pi))
  const z = cos(d2r(theta))

  return { x, y, z }
}

// azaltToCatesian : star* -> star*
export const convertAllEquatorial = (stars: Star[], geo: Geography) => {
  return stars.map((star) =>
    equatorialToHorizontal(geo.lat, getLocalSidereal(geo.lon), star)
  )
}
