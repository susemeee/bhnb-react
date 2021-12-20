import Star, { StarProjection } from "./star"
import { azaltToCatesian } from "./util"

// brightness : mag -> size
const brightness = (mag: number) => Math.min(6.0, (-11 / 9) * mag + 21 / 3)

// setRandomMap : star* -> star*
export const starToRandomMap = (stars: Star[]): StarProjection[] => {
  return stars.map((star) => {
    const size = Math.random() * 3
    return {
      x: innerWidth * Math.random(),
      y: innerHeight * Math.random(),
      width: size,
      height: size,
    }
  })
}

// setCelestialMap : star* -> star*
export const starToCelestialMap = (stars: Star[]): StarProjection[] => {
  return stars.map((star) => {
    const az = star.az!
    const alt = star.alt!
    const mag = star.mag!

    return {
      x: ((az / 360 + 0.5) % 1.0) * innerWidth,
      y: ((-alt + 90) / 180) * innerHeight,
      width: brightness(mag),
      height: brightness(mag),
    }
  })
}

// setGroundMap : fov -> star* -> star*
export const starToGroundMap = (
  stars: Star[],
  fov: string = "N"
): StarProjection[] => {
  return stars.map((star) => {
    const az = star.az!
    const alt = star.alt!
    const mag = star.mag!

    const { x, y, z } = azaltToCatesian(az, alt)

    let start, end, factor

    let Y, Z

    if (fov === "N") {
      start = 90
      end = 270
      factor = 1 + x

      Y = y / factor
      Z = z / factor
    } else {
      start = 270
      end = 90
      factor = 1 - x

      Y = -y / factor
      Z = z / factor
    }

    const W = innerWidth / 2
    const H = innerHeight
    const scale = Math.sqrt(W * W + H * H)

    // Filter out half sphere
    if (start <= az && az <= end) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
    }

    return {
      x: W - Y * scale,
      y: H - Z * scale,
      width: brightness(mag),
      height: brightness(mag),
    }
  })
}
