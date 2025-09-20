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

  // Estados de formularios
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
    console.log('Fecha de registro:', userData?.fechaRegistro)
    
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
    setInfoForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setLocationForm(prev => ({ ...prev, [name]: value }))
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

      const response = await api.put('/users/me', updateData)
      
      console.log('=== FRONTEND RESPONSE ===')
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      
      if (response.status === 200) {
        const updatedUser = response.data.data.user
        console.log('Updated user:', updatedUser)
        setUser(updatedUser)
        setToLocalStorage('user', updatedUser)
        setSuccess('Información actualizada correctamente')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      console.error('Error response:', err.response?.data)
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
      await api.put('/users/me/password', {
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

      const response = await api.put('/users/me', updateData)
      
      if (response.status === 200) {
        const updatedUser = response.data.data.user
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="default" />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Hola, {user.nombre}</span>
              <button
                onClick={handleLogout}
                className="btn-outline"
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{user.nombre}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rol</label>
                    <p className="text-gray-900 capitalize">
                      {user.rol === 'oferente' ? 'Oferente' : 'Solicitante'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Miembro desde</label>
                    <p className="text-gray-900">
                      {user.fechaRegistro ? 
                        (() => {
                          try {
                            const date = new Date(user.fechaRegistro)
                            return isNaN(date.getTime()) ? 'No disponible' : date.toLocaleDateString('es-ES')
                          } catch (error) {
                            console.error('Error parsing date:', error)
                            return 'No disponible'
                          }
                        })() 
                        : 'No disponible'
                      }
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

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'info'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Información Personal
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'password'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Cambiar Contraseña
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'location'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Ubicación
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="card">
                {activeTab === 'info' && (
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                    
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={infoForm.nombre}
                          onChange={handleInfoChange}
                          className="input-field"
                          placeholder="Tu nombre"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={infoForm.telefono}
                          onChange={handleInfoChange}
                          className="input-field"
                          placeholder="Tu teléfono"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                        Habilidades
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="skills"
                          name="skills"
                          value={infoForm.skills}
                          onChange={handleInfoChange}
                          className="input-field"
                          placeholder="Habilidades separadas por comas"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
                    
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="input-field"
                          placeholder="Tu contraseña actual"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="input-field"
                          placeholder="Nueva contraseña"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <div className="input-icon">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="input-field"
                          placeholder="Confirma tu nueva contraseña"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </button>
                  </form>
                )}

                {activeTab === 'location' && (
                  <form onSubmit={handleLocationSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubicación</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-2">
                          Latitud
                        </label>
                        <div className="relative">
                          <div className="input-icon">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <input
                            type="number"
                            step="any"
                            id="latitud"
                            name="latitud"
                            value={locationForm.latitud}
                            onChange={handleLocationChange}
                            className="input-field"
                            placeholder="Latitud"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-2">
                          Longitud
                        </label>
                        <div className="relative">
                          <div className="input-icon">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <input
                            type="number"
                            step="any"
                            id="longitud"
                            name="longitud"
                            value={locationForm.longitud}
                            onChange={handleLocationChange}
                            className="input-field"
                            placeholder="Longitud"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="btn-secondary"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Obtener mi ubicación actual
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando ubicación...' : 'Guardar Ubicación'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}