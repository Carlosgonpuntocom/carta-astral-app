import type * as HoroscopeTypes from 'circular-natal-horoscope-js'
import * as horoscopeNamespace from 'circular-natal-horoscope-js'

type OriginCtor = typeof HoroscopeTypes.Origin
type HoroscopeCtor = typeof HoroscopeTypes.Horoscope

function resolveCtor<T>(name: 'Origin' | 'Horoscope'): T {
  const ns = horoscopeNamespace as Record<string, unknown>
  const fromNamed = ns[name]
  if (typeof fromNamed === 'function') {
    return fromNamed as T
  }

  const def = ns.default as Record<string, unknown> | undefined
  const fromDefault = def?.[name]
  if (typeof fromDefault === 'function') {
    return fromDefault as T
  }

  throw new Error(
    `No se pudo resolver ${name} desde circular-natal-horoscope-js (named/default).`,
  )
}

export const Origin: OriginCtor = resolveCtor<OriginCtor>('Origin')
export const Horoscope: HoroscopeCtor = resolveCtor<HoroscopeCtor>('Horoscope')
