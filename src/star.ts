export interface Star {
  ra: number
  dec: number
  mag: number
  proper?: string
  alt?: number
  az?: number
}

export interface StarProjection extends Partial<Star> {
  x: number
  y: number
  width: number
  height: number
}

export default Star
