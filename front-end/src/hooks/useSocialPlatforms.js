// Hook responsável por gerenciar as plataformas sociais conectadas.
// Ele centraliza a lógica de conectar, desconectar e verificar status em uma API local.
import { useState, useCallback } from 'react'

export const useSocialPlatforms = (initialPlatforms = []) => {
  const [connectedPlatforms, setConnectedPlatforms] = useState({})
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const connectPlatform = useCallback(async (platformId, config = {}) => {
    try {
      setLoading(platformId)
      setError(null)

      // Simular chamada à API
      // Em produção: const response = await fetch('/api/platforms/connect', { ... })
      
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const accountInfo = {
        username: config.username || `usuario_${platformId}`,
        followers: config.followers || Math.floor(Math.random() * 50000) + 1000,
        connectedAt: new Date().toISOString(),
        ...config,
      }

      setConnectedPlatforms((prev) => ({
        ...prev,
        [platformId]: accountInfo,
      }))

      return true
    } catch (err) {
      setError(`Erro ao conectar ${platformId}: ${err.message}`)
      return false
    } finally {
      setLoading(null)
    }
  }, [])

  const disconnectPlatform = useCallback(async (platformId) => {
    try {
      setLoading(platformId)
      setError(null)

      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setConnectedPlatforms((prev) => {
        const newState = { ...prev }
        delete newState[platformId]
        return newState
      })

      return true
    } catch (err) {
      setError(`Erro ao desconectar ${platformId}: ${err.message}`)
      return false
    } finally {
      setLoading(null)
    }
  }, [])

  const isPlatformConnected = useCallback(
    (platformId) => !!connectedPlatforms[platformId],
    [connectedPlatforms]
  )

  const getConnectedCount = useCallback(
    () => Object.keys(connectedPlatforms).length,
    [connectedPlatforms]
  )

  return {
    connectedPlatforms,
    loading,
    error,
    connectPlatform,
    disconnectPlatform,
    isPlatformConnected,
    getConnectedCount,
  }
}

export default useSocialPlatforms
