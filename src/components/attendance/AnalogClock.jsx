import { useEffect, useRef } from 'react'

export default function AnalogClock({ time }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const radius = Math.min(width, height) / 2 - 20

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(width / 2, height / 2)

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 2
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x1 = Math.cos(angle) * (radius - 15)
      const y1 = Math.sin(angle) * (radius - 15)
      const x2 = Math.cos(angle) * (radius - 5)
      const y2 = Math.sin(angle) * (radius - 5)
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(hourAngle) * radius * 0.5, Math.sin(hourAngle) * radius * 0.5)
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()

    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(minuteAngle) * radius * 0.7, Math.sin(minuteAngle) * radius * 0.7)
    ctx.strokeStyle = '#4b5563'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.stroke()

    const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(secondAngle) * radius * 0.8, Math.sin(secondAngle) * radius * 0.8)
    ctx.strokeStyle = '#14b8a6'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, 0, 8, 0, 2 * Math.PI)
    ctx.fillStyle = '#14b8a6'
    ctx.fill()

    ctx.restore()
  }, [time])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="drop-shadow-lg"
      />
    </div>
  )
}