import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../lib/axios'
import Logo from '../components/Logo'
import { setToLocalStorage } from '../lib/localStorage'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar si hay un mensaje de éxito en la URL (desde registro)
    const { message } = router.query
    if (message) {
      // Mostrar mensaje de éxito temporalmente
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }, [router.query])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', formData)
      console.log('Respuesta del login:', response.data)
      
      if (response.status === 200) {
        const { token, user } = response.data.data
        
        console.log('Token:', token)
        console.log('User:', user)
        
        // Guardar en localStorage
        setToLocalStorage('token', token)
        setToLocalStorage('user', user)
        
        console.log('Datos guardados en localStorage')
        
        // Redirigir al perfil
        console.log('Redirigiendo a /profile')
        // Usar window.location para asegurar la redirección
        window.location.href = '/profile'
      }
    } catch (err) {
      console.error('Error en login:', err)
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.')
      } else if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos.')
      } else if (err.response?.status === 400) {
        setError('Por favor completa todos los campos.')
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sesión. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center mb-2">
            <Logo size="xl" className="text-white" />
          </Link>
          <h2 className="text-2xl font-semibold text-white">Iniciar sesión</h2>
          <p className="text-white/80 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de éxito del registro */}
            {router.query.message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {router.query.message}
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Tu contraseña"
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
            
            <div className="text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Primera vez en LOCALAID?
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Únete a nuestra comunidad y descubre servicios locales o comparte tus habilidades
            </p>
            <Link href="/register" className="btn-secondary">
              Crear cuenta gratuita
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

