import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../lib/axios'
import Logo from '../components/Logo'
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '../lib/localStorage'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  
  // Estados para diferentes formularios
  const [infoForm, setInfoForm] = useState({
    nombre: '',
    telefono: '',
    skills: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [locationForm, setLocationForm] = useState({
    latitud: '',
    longitud: ''
  })
  
  // Estados de UI
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const userData = getFromLocalStorage('user')
    console.log('Datos de usuario en perfil:', userData)
    
    if (!userData) {
      console.log('No hay usuario, redirigiendo a login')
      router.push('/login')
      return
    }

    setUser(userData)
    setInfoForm({
      nombre: userData.nombre || '',
      telefono: userData.telefono || '',
      skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills || ''
    })
    
    // Cargar ubicación si existe
    if (userData.ubicacion && userData.ubicacion.coordinates) {
      setLocationForm({
        latitud: userData.ubicacion.coordinates[1]?.toString() || '',
        longitud: userData.ubicacion.coordinates[0]?.toString() || ''
      })
    }
    
    setLoading(false)
  }, [router])

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setInfoForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setLocationForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        ...infoForm,
        skills: infoForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      }

      const response = await api.put(`/users/${user.id}`, updateData)
      
      if (response.status === 200) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        setToLocalStorage('user', updatedUser)
        setSuccess('Información actualizada correctamente')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar información')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      setSaving(false)
      return
    }

    try {
      await api.put(`/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      setSuccess('Contraseña actualizada correctamente')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña')
    } finally {
      setSaving(false)
    }
  }

  const handleLocationSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        ubicacion: {
          type: 'Point',
          coordinates: [parseFloat(locationForm.longitud), parseFloat(locationForm.latitud)]
        }
      }

      const response = await api.put(`/users/${user.id}`, updateData)
      
      if (response.status === 200) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        setToLocalStorage('user', updatedUser)
        setSuccess('Ubicación actualizada correctamente')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar ubicación')
    } finally {
      setSaving(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationForm({
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString()
          })
        },
        (error) => {
          setError('Error obteniendo ubicación: ' + error.message)
        }
      )
    } else {
      setError('Geolocalización no soportada por este navegador')
    }
  }

  const handleLogout = () => {
    removeFromLocalStorage('token')
    removeFromLocalStorage('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="default" className="text-white" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-white">Hola, {user.nombre}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
            <p className="text-white/80">Gestiona tu información personal</p>
          </div>

          {/* Tabs */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 mb-8">
            <div className="flex space-x-1">
              {[
                { id: 'info', label: 'Información Personal', icon: '👤' },
                { id: 'password', label: 'Cambiar Contraseña', icon: '🔒' },
                { id: 'location', label: 'Ubicación', icon: '📍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 font-medium'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido de las tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información de la cuenta */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la cuenta</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rol</label>
                    <p className="text-gray-900 capitalize">
                      {user.rol === 'oferente' ? 'Oferente' : 'Solicitante'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Miembro desde</label>
                    <p className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  {user.ubicacion && user.ubicacion.coordinates && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ubicación actual</label>
                      <p className="text-gray-900 text-sm">
                        {user.ubicacion.coordinates[1]?.toFixed(4)}, {user.ubicacion.coordinates[0]?.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formularios */}
            <div className="lg:col-span-2">
              {/* Mensajes globales */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {success}
                </div>
              )}

              {/* Tab: Información Personal */}
              {activeTab === 'info' && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar información personal</h3>
                  
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={infoForm.nombre}
                        onChange={handleInfoChange}
                        className="input-field"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={infoForm.telefono}
                        onChange={handleInfoChange}
                        className="input-field"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                        Habilidades
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={infoForm.skills}
                        onChange={handleInfoChange}
                        rows={3}
                        className="input-field"
                        placeholder="Ej: carpintería, cocina, programación (separadas por comas)"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Separa cada habilidad con una coma
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Cambiar Contraseña */}
              {activeTab === 'password' && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar contraseña</h3>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                        placeholder="Tu contraseña actual"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                        placeholder="Nueva contraseña (mínimo 6 caracteres)"
                        minLength="6"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input-field"
                        placeholder="Confirma tu nueva contraseña"
                        minLength="6"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Cambiando...' : 'Cambiar contraseña'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Ubicación */}
              {activeTab === 'location' && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actualizar ubicación</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Agrega tu ubicación para que otros usuarios puedan encontrarte más fácilmente
                  </p>
                  
                  <form onSubmit={handleLocationSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-2">
                          Latitud
                        </label>
                        <input
                          type="number"
                          step="any"
                          id="latitud"
                          name="latitud"
                          value={locationForm.latitud}
                          onChange={handleLocationChange}
                          className="input-field"
                          placeholder="4.6097"
                        />
                      </div>
                      <div>
                        <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-2">
                          Longitud
                        </label>
                        <input
                          type="number"
                          step="any"
                          id="longitud"
                          name="longitud"
                          value={locationForm.longitud}
                          onChange={handleLocationChange}
                          className="input-field"
                          placeholder="-74.0817"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      📍 Obtener mi ubicación actual
                    </button>

                    <button
                      type="submit"
                      disabled={saving || !locationForm.latitud || !locationForm.longitud}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Actualizar ubicación'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

