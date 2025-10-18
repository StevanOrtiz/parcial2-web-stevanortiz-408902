"use client"

import { useEffect } from "react"

export default function FacebookProfile() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initFacebookApp()
    }
  }, [])

  return (
    <div id="app-root" className="min-h-screen bg-gray-100">
      {/* El contenido será renderizado dinámicamente por los componentes JavaScript */}
    </div>
  )
}

function initFacebookApp() {
  // ============================================
  // SISTEMA DE ENRUTAMIENTO (Router)
  // ============================================
  class Router {
    constructor() {
      this.routes = {}
      this.currentRoute = "muro"

      window.addEventListener("hashchange", () => this.handleRouteChange())
      window.addEventListener("load", () => this.handleRouteChange())
    }

    register(path, callback) {
      this.routes[path] = callback
    }

    navigate(path) {
      window.location.hash = path
    }

    handleRouteChange() {
      const hash = window.location.hash.slice(1) || "muro"
      this.currentRoute = hash

      if (this.routes[hash]) {
        this.routes[hash]()
      }
    }

    getCurrentRoute() {
      return this.currentRoute
    }
  }

  // ============================================
  // COMPONENTE BASE (Parent Component)
  // ============================================
  class Component {
    constructor(props = {}) {
      this.props = props
      this.state = {}
      this.element = null
    }

    setState(newState) {
      this.state = { ...this.state, ...newState }
      this.update()
    }

    render() {
      return ""
    }

    mount(container) {
      const html = this.render()
      if (typeof container === "string") {
        container = document.querySelector(container)
      }
      if (container) {
        container.innerHTML = html
        this.element = container
        this.afterMount()
      }
    }

    update() {
      if (this.element) {
        const html = this.render()
        this.element.innerHTML = html
        this.afterMount()
      }
    }

    afterMount() {
      // Hook para ejecutar código después del montaje
    }
  }

  // ============================================
  // COMPONENTE HEADER (Child Component)
  // ============================================
  class HeaderComponent extends Component {
    render() {
      return `
        <header class="bg-blue-600 text-white shadow-md">
          <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold">facebook</h1>
            </div>
            <div class="flex-1 max-w-md mx-8">
              <input
                type="text"
                id="search-input"
                placeholder="Buscar en Facebook"
                class="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm">${this.props.userName || "Juan Pérez"}</span>
            </div>
          </div>
        </header>
      `
    }

    afterMount() {
      const searchInput = document.getElementById("search-input")
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          console.log("Búsqueda:", e.target.value)
        })
      }
    }
  }

  // ============================================
  // COMPONENTE PROFILE HEADER (Child Component)
  // ============================================
  class ProfileHeaderComponent extends Component {
    render() {
      return `
        <section class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div class="h-64 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div class="px-6 pb-6">
            <div class="flex items-end -mt-16 mb-4">
              <div class="w-32 h-32 bg-gray-300 rounded-full border-4 border-white mr-4"></div>
              <div class="flex-1">
                <h2 class="text-3xl font-bold text-gray-800 mb-1">${this.props.userName}</h2>
                <p class="text-gray-600">${this.props.friendsCount} amigos</p>
              </div>
            </div>
          </div>
        </section>
      `
    }
  }

  // ============================================
  // COMPONENTE NAVIGATION TABS (Child Component)
  // ============================================
  class NavigationComponent extends Component {
    constructor(props) {
      super(props)
      this.tabs = ["muro", "info", "photos", "boxes"]
    }

    render() {
      const currentRoute = this.props.currentRoute || "muro"

      return `
        <nav class="bg-white rounded-lg shadow-md mb-6">
          <div class="flex border-b">
            ${this.tabs
              .map(
                (tab) => `
              <button
                class="nav-tab px-6 py-3 font-medium ${
                  currentRoute === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }"
                data-route="${tab}"
              >
                ${tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            `,
              )
              .join("")}
          </div>
        </nav>
      `
    }

    afterMount() {
      const navTabs = document.querySelectorAll(".nav-tab")
      navTabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
          const route = e.target.getAttribute("data-route")
          this.props.router.navigate(route)
        })
      })
    }
  }

  // ============================================
  // COMPONENTE POST (Child Component)
  // ============================================
  class PostComponent extends Component {
    render() {
      const { author, time, content, hasImage } = this.props

      return `
        <article class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <h3 class="font-semibold text-gray-800">${author}</h3>
              <p class="text-sm text-gray-600">${time}</p>
            </div>
          </div>
          <p class="text-gray-800 mb-4">${content}</p>
          ${hasImage ? '<div class="h-64 bg-gray-200 rounded-lg mb-4"></div>' : ""}
          <div class="flex items-center justify-between text-gray-600">
            <button class="flex items-center space-x-2 hover:text-blue-600">
              <span>👍</span>
              <span>Me gusta</span>
            </button>
            <button class="flex items-center space-x-2 hover:text-blue-600">
              <span>💬</span>
              <span>Comentar</span>
            </button>
            <button class="flex items-center space-x-2 hover:text-blue-600">
              <span>📤</span>
              <span>Compartir</span>
            </button>
          </div>
        </article>
      `
    }
  }

  // ============================================
  // SECCIÓN MURO (Parent Component)
  // ============================================
  class MuroSection extends Component {
    render() {
      return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <article class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <input
                  type="text"
                  placeholder="¿Qué estás pensando, Juan?"
                  class="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </article>
            <div id="posts-container"></div>
          </div>
          
          <aside class="space-y-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="font-semibold text-gray-800 mb-4">Información</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <p>📍 Ciudad de México</p>
                <p>💼 Desarrollador Web</p>
                <p>🎓 Universidad Nacional</p>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="font-semibold text-gray-800 mb-4">Amigos</h3>
              <div class="grid grid-cols-3 gap-2">
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </aside>
        </div>
      `
    }

    afterMount() {
      const postsContainer = document.getElementById("posts-container")
      if (postsContainer) {
        const posts = [
          {
            author: "Juan Pérez",
            time: "Hace 2 horas",
            content: "¡Qué hermoso día para estar en el parque! 🌞",
            hasImage: true,
          },
          {
            author: "Juan Pérez",
            time: "Hace 1 día",
            content: "Trabajando en nuevos proyectos. ¡Muy emocionado por lo que viene!",
            hasImage: false,
          },
        ]

        posts.forEach((postData) => {
          const post = new PostComponent(postData)
          const postDiv = document.createElement("div")
          postsContainer.appendChild(postDiv)
          post.mount(postDiv)
        })
      }
    }
  }

  // ============================================
  // SECCIÓN INFO (Parent Component)
  // ============================================
  class InfoSection extends Component {
    render() {
      return `
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Información</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Información básica</h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">📧</span>
                  <span>juan.perez@email.com</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">📱</span>
                  <span>+52 55 1234 5678</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">🎂</span>
                  <span>15 de marzo de 1990</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">📍</span>
                  <span>Ciudad de México, México</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Trabajo y educación</h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">💼</span>
                  <span>Desarrollador Web en TechCorp</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">🎓</span>
                  <span>Ingeniería en Sistemas - Universidad Nacional</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-gray-600">🏫</span>
                  <span>Preparatoria Benito Juárez</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Acerca de</h3>
            <p class="text-gray-600 leading-relaxed">
              Desarrollador web apasionado por crear experiencias digitales increíbles. Me encanta trabajar con
              tecnologías modernas y siempre estoy aprendiendo algo nuevo. En mi tiempo libre disfruto de la
              fotografía, los videojuegos y pasar tiempo con amigos y familia.
            </p>
          </div>
        </div>
      `
    }
  }

  // ============================================
  // SECCIÓN PHOTOS (Parent Component)
  // ============================================
  class PhotosSection extends Component {
    render() {
      return `
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Fotos</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${Array(12)
              .fill(0)
              .map(
                () =>
                  '<div class="aspect-square bg-gray-300 rounded-lg hover:opacity-80 cursor-pointer transition-opacity"></div>',
              )
              .join("")}
          </div>
          
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Álbumes</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors">
                <div class="aspect-video bg-gray-300 rounded-lg mb-3"></div>
                <h4 class="font-medium text-gray-800">Vacaciones 2024</h4>
                <p class="text-sm text-gray-600">25 fotos</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors">
                <div class="aspect-video bg-gray-300 rounded-lg mb-3"></div>
                <h4 class="font-medium text-gray-800">Familia</h4>
                <p class="text-sm text-gray-600">18 fotos</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors">
                <div class="aspect-video bg-gray-300 rounded-lg mb-3"></div>
                <h4 class="font-medium text-gray-800">Trabajo</h4>
                <p class="text-sm text-gray-600">12 fotos</p>
              </div>
            </div>
          </div>
        </div>
      `
    }
  }

  // ============================================
  // COMPONENTE BOX (Child Component)
  // ============================================
  class BoxComponent extends Component {
    render() {
      const { title, color, items } = this.props

      return `
        <div class="bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg p-6 text-white">
          <h3 class="text-xl font-semibold mb-2">${title}</h3>
          <div class="space-y-2">
            ${items.map((item) => `<p class="text-${color}-100">${item}</p>`).join("")}
          </div>
        </div>
      `
    }
  }

  // ============================================
  // SECCIÓN BOXES (Parent Component)
  // ============================================
  class BoxesSection extends Component {
    render() {
      return `
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Boxes</h2>
          <div id="boxes-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
      `
    }

    afterMount() {
      const boxesContainer = document.getElementById("boxes-container")
      if (boxesContainer) {
        const boxes = [
          {
            title: "Estadísticas",
            color: "blue",
            items: ["Posts: 127", "Amigos: 1,234", "Fotos: 89"],
          },
          {
            title: "Actividad",
            color: "green",
            items: ["Última conexión: Hoy", "Posts esta semana: 5", "Interacciones: 234"],
          },
          {
            title: "Intereses",
            color: "purple",
            items: [
              '<span class="bg-purple-400 px-3 py-1 rounded-full text-sm">Tecnología</span>',
              '<span class="bg-purple-400 px-3 py-1 rounded-full text-sm">Fotografía</span>',
              '<span class="bg-purple-400 px-3 py-1 rounded-full text-sm">Viajes</span>',
            ],
          },
          {
            title: "Logros",
            color: "orange",
            items: ["🏆 Usuario del mes", "⭐ 5 años en Facebook", "🎯 100+ likes en un post"],
          },
          {
            title: "Eventos",
            color: "red",
            items: ["📅 Cumpleaños: 15 Mar", "🎉 Próximo evento: Reunión", "📍 Eventos asistidos: 23"],
          },
          {
            title: "Conexiones",
            color: "teal",
            items: ["👥 Grupos: 8", "📄 Páginas seguidas: 45", "🌐 Ubicaciones: 12"],
          },
        ]

        boxes.forEach((boxData) => {
          const box = new BoxComponent(boxData)
          const boxDiv = document.createElement("div")
          boxesContainer.appendChild(boxDiv)
          box.mount(boxDiv)
        })
      }
    }
  }

  // ============================================
  // APLICACIÓN PRINCIPAL (Main Parent Component)
  // ============================================
  class FacebookApp extends Component {
    constructor() {
      super()
      this.router = new Router()
      this.setupRoutes()
    }

    setupRoutes() {
      this.router.register("muro", () => this.renderSection("muro"))
      this.router.register("info", () => this.renderSection("info"))
      this.router.register("photos", () => this.renderSection("photos"))
      this.router.register("boxes", () => this.renderSection("boxes"))
    }

    renderSection(section) {
      // Actualizar navegación
      const navigation = new NavigationComponent({
        currentRoute: section,
        router: this.router,
      })
      navigation.mount("#navigation-container")

      // Renderizar sección correspondiente
      const contentContainer = document.getElementById("content-container")
      if (contentContainer) {
        let sectionComponent

        switch (section) {
          case "muro":
            sectionComponent = new MuroSection()
            break
          case "info":
            sectionComponent = new InfoSection()
            break
          case "photos":
            sectionComponent = new PhotosSection()
            break
          case "boxes":
            sectionComponent = new BoxesSection()
            break
          default:
            sectionComponent = new MuroSection()
        }

        sectionComponent.mount(contentContainer)
      }
    }

    render() {
      return `
        <div id="header-container"></div>
        <main class="max-w-6xl mx-auto px-4 py-6">
          <div id="profile-header-container"></div>
          <div id="navigation-container"></div>
          <div id="content-container"></div>
        </main>
      `
    }

    afterMount() {
      // Renderizar componentes estáticos
      const header = new HeaderComponent({ userName: "Juan Pérez" })
      header.mount("#header-container")

      const profileHeader = new ProfileHeaderComponent({
        userName: "Juan Pérez",
        friendsCount: "1,234",
      })
      profileHeader.mount("#profile-header-container")

      // Iniciar navegación
      this.router.handleRouteChange()
    }
  }

  // ============================================
  // INICIALIZACIÓN DE LA APLICACIÓN
  // ============================================
  const app = new FacebookApp()
  app.mount("#app-root")
}
