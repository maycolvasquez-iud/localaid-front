import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from '../components/Logo'
import api from '../lib/axios'
import { getFromLocalStorage, removeFromLocalStorage } from '../lib/localStorage'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [usersOnline, setUsersOnline] = useState([])
  const [servicesOffered, setServicesOffered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerForm, setOfferForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    precio: '',
    duracion: '',
    ubicacion: ''
  })

  useEffect(() => {
    const userData = getFromLocalStorage('user')
    const token = getFromLocalStorage('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }

    setUser(userData)
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Cargar usuarios en línea
      const usersResponse = await api.get('/users/online')
      setUsersOnline(usersResponse.data.data.users || [])

      // Cargar servicios ofertados
      const servicesResponse = await api.get('/services/offered')
      setServicesOffered(servicesResponse.data.data.services || [])
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err)
      // Datos de ejemplo si falla la API
      setUsersOnline([
        { id: 1, nombre: 'María González', rol: 'oferente', ultimaActividad: 'Hace 5 min' },
        { id: 2, nombre: 'Carlos López', rol: 'solicitante', ultimaActividad: 'Hace 2 min' },
        { id: 3, nombre: 'Ana Martínez', rol: 'oferente', ultimaActividad: 'Ahora' }
      ])
      setServicesOffered([
        {
          id: 1,
          titulo: 'Reparación de computadoras',
          descripcion: 'Servicio técnico especializado en Windows y Mac',
          categoria: 'Tecnología',
          precio: '$50.000 COP',
          duracion: '2 horas',
          ubicacion: 'Cedritos, Bogotá'
        },
        {
          id: 2,
          titulo: 'Clases de matemáticas',
          descripcion: 'Tutorías en matemáticas básicas y avanzadas',
          categoria: 'Educación',
          precio: '$30.000 COP',
          duracion: '1 hora',
          ubicacion: 'Chapinero, Bogotá'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleOfferChange = (e) => {
    const { name, value } = e.target
    setOfferForm(prev => ({ ...prev, [name]: value }))
  }

  const handleOfferSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/services', {
        ...offerForm,
        precio: parseFloat(offerForm.precio.replace(/[^\d]/g, '')),
        usuarioId: user._id
      })
      
      setShowOfferForm(false)
      setOfferForm({
        titulo: '',
        descripcion: '',
        categoria: '',
        precio: '',
        duracion: '',
        ubicacion: ''
      })
      loadDashboardData() // Recargar servicios
    } catch (err) {
      console.error('Error creando servicio:', err)
      alert('Error al crear el servicio. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeFromLocalStorage('token')
    removeFromLocalStorage('user with')
    router.push('/')
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="default" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Hola, {user.nombre}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.rol}</div>
                </div>
              </div>
              <Link href="/profile" className="btn-outline">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3v1" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🚀 Bienvenido a tu Centro de Control
            </h1>
            <p className="text-gray-600">
              Gestiona servicios, conecta con tu comunidad y ayuda local
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600">{usersOnline.length}</div>
              <div className="text-gray-600 text-sm">Usuarios en línea</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{servicesOffered.length}</div>
              <div className="text-gray-600 text-sm">Servicios ofertados</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">
                {servicesOffered.filter(s => s.categoria === 'Tecnología').length}
              </div>
              <div className="text-gray-600 text-sm">Tecnología</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">
                {servicesOffered.filter(s => s.categoria === 'Educación').length}
              </div>
              <div className="text-gray-600 text-sm">Educación</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Usuarios en Línea */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Usuarios en Línea</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  {usersOnline.map((onlineUser) => (
                    <div key={onlineUser.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {onlineUser.nombre.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{onlineUser.nombre}</div>
                        <div className="text-sm text-gray-500 capitalize">{onlineUser.rol}</div>
                        <div className="text-xs text-green-600">{onlineUser.ultimaActividad}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mapa de Servicios */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Servicios Disponibles en tu Área</h3>
                <div className="relative">
                  {/* Mapa de ejemplo - Puedes reemplazar con un mapa real */}
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-80 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-600 mb-2">Mapa de Servicios</p>
                      <p className="text-sm text-gray-500">Integración con Mapbox o Google Maps</p>
                    </div>
                  </div>
                  
                  {/* Marcadores de servicio simulados */}
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                    💻 Tecnología
                  </div>
                  <div className="absolute top-20 right-8 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    📚 Educación
                  </div>
                  <div className="absolute bottom-8 left-12 bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                    🔧 Reparaciones
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Servicios Ofertados */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Servicios Ofertados</h3>
              <button
                onClick={() => setShowOfferForm(true)}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ofertar Servicio
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesOffered.map((service) => (
                <div key={service.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{service.titulo}</h4>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {service.categoria}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{service.descripcion}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3-2-1.343-2-3-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      {service.ubicacion}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duracion}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-green-600">{service.precio}</span>
                      <button className="btn-outline text-xs">Contactar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal para Ofertar Servicio */}
          {showOfferForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ofertar Servicio</h3>
                  <button
                    onClick={() => setShowOfferForm(false)}
                    className="text-gray-400 hover:gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título del Servicio
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={offerForm.titulo}
                      onChange={handleOfferChange}
                      required
                      className="input-field"
                      placeholder="Ej: Reparación de computadoras"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={offerForm.descripcion}
                      onChange={handleOfferChange}
                      required
                      rows={3}
                      className="input-field"
                      placeholder="Describe tu servicio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      name="categoria"
                      value={offerForm.categoria}
                      onChange={handleOfferChange}
                      required
                      className="input-field"
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Educación">Educación</option>
                      <option value="Reparaciones">Reparaciones</option>
                      <option value="Limpieza">Limpieza</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (COP)
                      </label>
                      <input
                        type="text"
                        name="precio"
                        value={offerForm.precio}
                        onChange={handleOfferChange}
                        required
                        className="input-field"
                        placeholder="$50.000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duración
                      </label>
                      <input
                        type="text"
                        name="duracion"
                        value={offerForm.duracion}
                        onChange={handleOfferChange}
                        required
                        className="input-field"
                        placeholder="2 horas"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={offerForm.ubicacion}
                      onChange={handleOfferChange}
                      required
                      className="input-field"
                      placeholder="Ej: Cedritos, Bogotá"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowOfferForm(false)}
                      className="btn-outline flex-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {loading ? 'Creando...' : 'Ofertar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
