import { Animation } from "konva/lib/Animation"
import { ShapeConfig } from "konva/lib/Shape"
import { Tween } from "konva/lib/Tween"
import React, { useEffect, useRef, useState } from "react"
import { Stage, Layer, Circle } from "react-konva"
import {
  starToCelestialMap,
  starToGroundMap,
  starToRandomMap,
} from "../projection"
import Star, { StarProjection } from "../star"
import { convertAllEquatorial, getLocalGeographic } from "../util"

import HYGDatabase from "../hyg-database.json"
import useWindowWidth from "../useWindowWidth"

export type ProjectionMapType = "RandomMap" | "CelestialMap" | "GroundMap"

interface IProjectionProps {
  mapType?: ProjectionMapType
  starShapeConf?: ShapeConfig
  anim?: boolean
}

// animation constants
const CIRCLE_ANIM_SIZE_TH = 0.8
const CIRCLE_TARGET_OPACITY = 0.3
const CIRCLE_OPACITY_DELTA = (1 - CIRCLE_TARGET_OPACITY) / 30

export const Projection: React.FC<IProjectionProps> = ({
  mapType = "GroundMap",
  starShapeConf = {
    fill: "white",
    shadowBlur: 6.0,
  },
  anim = false,
  ...props
}) => {
  const refs = useRef<any>([])
  const windowWidth = useWindowWidth(200)
  const [stars, setStars] = useState<Star[]>([])
  const [starProjections, setStarProjections] = useState<StarProjection[]>([])

  useEffect(() => {
    Promise.all([
      HYGDatabase.map((res) => ({
        ...res,
        ra: Number(res.ra),
        dec: Number(res.dec),
        mag: Number(res.mag),
      })) as Star[],
      getLocalGeographic(),
    ]).then(([stars, geo]) => setStars(convertAllEquatorial(stars, geo)))
  }, [])

  useEffect(() => {
    switch (mapType) {
      case `RandomMap`:
        setStarProjections(starToRandomMap(stars))
        break
      case `CelestialMap`:
        setStarProjections(starToCelestialMap(stars))
        break
      case `GroundMap`:
        setStarProjections(starToGroundMap(stars))
        break
      default:
        throw new Error("INVALID_PROJ_MODE")
    }
  }, [stars, windowWidth])

  useEffect(() => {
    if (!refs.current || anim === false) {
      return
    }

    for (const circle of refs.current) {
      if (circle.attrs.radius < CIRCLE_ANIM_SIZE_TH) {
        continue
      }
      const delay = (Math.random() * 2.0 + 0.5) * 1000
      circle.setAttr("d", delay)
      circle.setAttr("r", false)
    }

    const animation = new Animation(function (frame) {
      // frame skipping
      if (!frame || frame.time % 20 >= 1.0) {
        return false
      } else {
        for (const circle of refs.current) {
          if (!circle.attrs.d || frame.time < circle.attrs.d) {
            continue
          }
          // regular update
          const currentOpacity = circle.opacity()
          if (!circle.attrs.r) {
            circle.opacity(currentOpacity - CIRCLE_OPACITY_DELTA)
            if (currentOpacity < CIRCLE_TARGET_OPACITY) {
              circle.setAttr("r", true)
            }
          } else {
            circle.opacity(currentOpacity + CIRCLE_OPACITY_DELTA)
            if (currentOpacity >= 1.0) {
              circle.setAttr("r", false)
            }
          }
        }
      }
    })
    animation.start()
  }, [starProjections])

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {starProjections
          .filter((star) => star.width > 0 && star.height > 0)
          .map((star, index) => (
            <Circle
              ref={(element) => {
                refs.current[index] = element
              }}
              key={`${star.x}_${star.y}_${star.width}_${star.height}`}
              x={star.x}
              y={star.y}
              width={star.width}
              height={star.height}
              {...starShapeConf}
            />
          ))}
      </Layer>
    </Stage>
  )
}

export default Projection
