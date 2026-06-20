import { Horario } from '../types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function parseHora(hora: string): number {
  if (hora.toLowerCase() === 'medianoche') return 23.99
  const match = hora.match(/^(\d+):(\d+)\s*(AM|PM)?$/i)
  if (!match) return 0
  let h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10) / 60
  const ampm = match[3]?.toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h + m
}

export function calcularEstado(horarios: Horario[] | undefined): string {
  if (!horarios || horarios.length === 0) return 'Cerrado'
  const ahora = new Date()
  const diaActual = DIAS[ahora.getDay()]
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60

  const hoy = horarios.find(h => h.dia === diaActual)
  if (!hoy) return 'Cerrado'

  const apertura = parseHora(hoy.apertura)
  const cierre = parseHora(hoy.cierre)

  return horaActual >= apertura && horaActual < cierre ? 'Abierto' : 'Cerrado'
}

export function formatCierre(cierre: string): string {
  return cierre.toLowerCase() === 'medianoche' ? '12:00 AM' : cierre
}

export function getHorarioDelDia(horarios: Horario[] | undefined): string {
  if (!horarios || horarios.length === 0) return ''
  const ahora = new Date()
  const diaActual = DIAS[ahora.getDay()]
  const hoy = horarios.find(h => h.dia === diaActual)
  if (!hoy) return ''
  return `${hoy.apertura} - ${formatCierre(hoy.cierre)}`
}
