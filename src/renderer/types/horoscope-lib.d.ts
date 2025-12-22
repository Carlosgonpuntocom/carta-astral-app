// Declaraciones de tipos para circular-natal-horoscope-js
// Si la librería ya tiene tipos, estos se pueden eliminar

declare module 'circular-natal-horoscope-js' {
  export interface OriginOptions {
    year: number
    month: number
    date: number
    hour: number
    minute: number
    latitude: number
    longitude: number
  }

  export interface PlanetData {
    longitude: number
    latitude?: number
    house?: number
    [key: string]: any
  }

  export interface HouseData {
    longitude: number
    [key: string]: any
  }

  export class Origin {
    constructor(options: OriginOptions)
    Planets: Record<string, PlanetData>
    Houses: HouseData[]
    Aspects?: any
  }
}

