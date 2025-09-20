import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from '../components/Logo'
import { getFromLocalStorage, removeFromLocalStorage } from '../lib/localStorage'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userData = getFromLocalStorage('user')
    if (userData) {
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    removeFromLocalStorage('token')
    removeFromLocalStorage('user')
    setUser(null)
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo size="default" className="text-white" />
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-white">Hola, {user.nombre}</span>
                  <Link href="/profile" className="text-white hover:text-gray-200 transition-colors">
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-gray-200 transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Conecta tu comunidad
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Encuentra servicios locales o ofrece tus habilidades. 
            Construye una red de apoyo en tu comunidad.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-secondary text-lg px-8 py-3">
                Comenzar Ahora
              </Link>
              <Link href="/login" className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg">
                Ya tengo cuenta
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-8">
              <Link href="/profile" className="btn-secondary text-lg px-8 py-3">
                Ir a mi Perfil
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Conecta</h3>
              <p className="text-white/80">Encuentra personas en tu área con las habilidades que necesitas</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Confía</h3>
              <p className="text-white/80">Sistema de verificación y calificaciones para mayor seguridad</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Crece</h3>
              <p className="text-white/80">Desarrolla tu red profesional y personal en tu comunidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

