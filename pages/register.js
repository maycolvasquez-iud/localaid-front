import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../lib/axios'
import Logo from '../components/Logo'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'solicitante',
    skills: '',
    latitud: '',
    longitud: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      // Convertir skills de string a array
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        rol: formData.rol,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      }

      // Solo agregar ubicación si se proporcionaron coordenadas
      if (formData.latitud && formData.longitud) {
        userData.ubicacion = {
          type: 'Point',
          coordinates: [parseFloat(formData.longitud), parseFloat(formData.latitud)]
        }
      }

      const response = await api.post('/users', userData)
      
      if (response.status === 201) {
        // Redirigir al login después del registro exitoso
        router.push('/login?message=Registro exitoso. Por favor inicia sesión.')
      }
    } catch (err) {
      console.error('Error en registro:', err)
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.')
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Datos inválidos. Verifica la información ingresada.')
      } else if (err.response?.status === 409) {
        setError('Este email ya está registrado. Intenta con otro email o inicia sesión.')
      } else {
        setError(err.response?.data?.message || 'Error al registrar usuario. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString()
          }))
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
        }
      )
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
          <h2 className="text-2xl font-semibold text-white">Crear cuenta</h2>
          <p className="text-white/80 mt-2">Únete a la comunidad local</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
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
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario *
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="solicitante">Solicitante (Busco servicios)</option>
                <option value="oferente">Oferente (Ofrezco servicios)</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: carpintería, cocina, programación (separadas por comas)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separa cada habilidad con una coma
              </p>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación (Opcional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Agrega tu ubicación para que otros usuarios puedan encontrarte más fácilmente
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="any"
                    name="latitud"
                    value={formData.latitud}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Latitud (ej: 4.6097)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    name="longitud"
                    value={formData.longitud}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Longitud (ej: -74.0817)"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                📍 Obtener mi ubicación actual
              </button>
              <p className="text-xs text-gray-400 mt-1">
                Puedes omitir este paso y agregar tu ubicación más tarde
              </p>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Enlace al login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

