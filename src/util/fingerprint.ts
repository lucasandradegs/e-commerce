'use client'

import { useState, useEffect } from 'react'

// Função para calcular o hash SHA-256 de uma string
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

// Função para calcular a impressão digital do sensor de movimento
function calculateSensorFingerprint(sensorData: DeviceMotionEvent): string {
  const acceleration = sensorData.acceleration || { x: 0, y: 0, z: 0 }
  const accelerationIncludingGravity =
    sensorData.accelerationIncludingGravity || { x: 0, y: 0, z: 0 }
  const rotationRate = sensorData.rotationRate || {
    alpha: 0,
    beta: 0,
    gamma: 0,
  }
  const fingerprintData = [
    acceleration.x,
    acceleration.y,
    acceleration.z,
    accelerationIncludingGravity.x,
    accelerationIncludingGravity.y,
    accelerationIncludingGravity.z,
    rotationRate.alpha,
    rotationRate.beta,
    rotationRate.gamma,
  ].join(',')
  return fingerprintData
}

// Componente React para coletar dados do sensor de movimento e gerar um identificador único
const SensorFingerprint: React.FC = () => {
  const [sensorFingerprint, setSensorFingerprint] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const handleDeviceMotion = async (event: DeviceMotionEvent) => {
      const fingerprint = calculateSensorFingerprint(event)
      const hashedFingerprint = await sha256(fingerprint)
      setSensorFingerprint(hashedFingerprint)
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion)
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }
  }, [])

  console.log(sensorFingerprint)

  return null
}

export default SensorFingerprint
