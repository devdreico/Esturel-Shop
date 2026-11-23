import { Suspense, lazy, useEffect, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/cart/CartDrawer'
import { AddToast } from './components/cart/AddToast'
import { AuroraBackdrop, BackToTop } from './components/ui/Aurora'
import { ScrollProgress, FadePage } from './components/ui/Motion'
import { WhatsAppFab } from './components/ui/WhatsAppFab'
import { ExternalRedirect } from './components/ui/ExternalRedirect'
import { applySeo, organizationJsonLd } from './lib/seo'
import { PACEFORM_URL } from './lib/partners'
import { INSTAGRAM_URL } from './lib/social'
import { site } from './config/site'
import { AnnouncementBar } from './components/layout/AnnouncementBar'
import { ConsentBanner } from './components/layout/ConsentBanner'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { initAnalytics } from './lib/analytics'

const HomePage = lazy(() => import('./pages/Home').then((m) => ({ default: m.HomePage })))
const CatalogPage = lazy(() => import('./pages/Catalog').then((m) => ({ default: m.CatalogPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetailPage })))
const CartPage = lazy(() => import('./pages/Cart').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.CheckoutPage })))
const NewsPage = lazy(() => import('./pages/News').then((m) => ({ default: m.NewsPage })))
const AsesorPage = lazy(() => import('./pages/Asesor').then((m) => ({ default: m.AsesorPage })))
const FaqPage = lazy(() => import('./pages/Faq').then((m) => ({ default: m.FaqPage })))
const ContactPage = lazy(() => import('./pages/Contact').then((m) => ({ default: m.ContactPage })))
const LegalPage = lazy(() => import('./pages/Legal').then((m) => ({ default: m.LegalPage })))
const OrderConfirmedPage = lazy(() => import('./pages/OrderConfirmed').then((m) => ({ default: m.OrderConfirmedPage })))
const NotFoundPage = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-busy="true" aria-label="Cargando">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-lg" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function RootSeo() {
  const location = useLocation()
  useEffect(() => {
    const path = location.pathname
    if (path === '/' || path === '') {
      applySeo({
        title: `${site.brand.name} · ${site.brand.tagline}`,
        description: site.brand.description,
        path: '/',
        jsonLd: organizationJsonLd(),
      })
    } else if (path === '/catalogo' || path.startsWith('/catalogo')) {
      applySeo({
        title: 'Catálogo de tecnología',
        description:
          'Explora audífonos, periféricos, streaming y frontera tech en Colombia. Precios en COP y pago contraentrega.',
        path: '/catalogo',
        noindex: Boolean(location.search),
      })
    } else if (path === '/noticias') {
      applySeo({
        title: 'Noticias tech',
        description: 'Feed de noticias de tecnología: IA, gadgets, audio y más.',
        path: '/noticias',
      })
    } else if (path === '/asesor') {
      applySeo({
        title: 'Asesoría tecnológica',
        description:
          'Asesoría personalizada de tecnología en Colombia. Comparamos specs y presupuesto.',
        path: '/asesor',
      })
    } else if (path === '/carrito') {
      applySeo({
        title: 'Carrito',
        description: 'Tu carrito de compras Esturel.',
        path: '/carrito',
        noindex: true,
      })
    } else if (path === '/checkout') {
      applySeo({
        title: 'Checkout',
        description: 'Pedido con pago contraentrega en efectivo. Envíos a todo Colombia.',
        path: '/checkout',
        noindex: true,
      })
    } else if (path === '/faq') {
      applySeo({ title: 'Preguntas frecuentes', description: 'Envíos, pagos, devoluciones y garantía.', path: '/faq' })
    } else if (path === '/contacto') {
      applySeo({ title: 'Contacto', description: 'Canales de contacto de Esturel.', path: '/contacto' })
    }
  }, [location.pathname, location.search])
  return null
}

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:rounded-full focus:bg-urple-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
    >
      Saltar al contenido
    </a>
  )
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-page font-sans">
      <AuroraBackdrop />
      <ScrollProgress />
      <AnnouncementBar />
      <SkipLink />
      <ScrollToTop />
      <RootSeo />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <AddToast />
      <WhatsAppFab />
      <BackToTop />
      <ConsentBanner />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const onConsent = () => initAnalytics()
    window.addEventListener('esturel:consent', onConsent)
    initAnalytics()
    return () => window.removeEventListener('esturel:consent', onConsent)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <Shell>
          <AnimatePresence mode="wait">
            <FadePage key={location.pathname}>
              <Suspense fallback={<PageLoader />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalogo" element={<CatalogPage />} />
                  <Route path="/producto/:slug" element={<ProductDetailPage />} />
                  <Route path="/carrito" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/pedido/confirmado" element={<OrderConfirmedPage />} />
                  <Route path="/noticias" element={<NewsPage />} />
                  <Route path="/asesor" element={<AsesorPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/contacto" element={<ContactPage />} />
                  <Route path="/privacidad" element={<LegalPage />} />
                  <Route path="/terminos" element={<LegalPage />} />
                  <Route path="/envios" element={<LegalPage />} />
                  <Route path="/devoluciones" element={<LegalPage />} />
                  <Route path="/garantia" element={<LegalPage />} />
                  <Route
                    path="/paceform"
                    element={<ExternalRedirect to={PACEFORM_URL} label="Paceform" />}
                  />
                  <Route
                    path="/instagram"
                    element={
                      <ExternalRedirect
                        to={INSTAGRAM_URL}
                        label="Instagram @esturelco"
                        path="/instagram"
                      />
                    }
                  />
                  <Route path="/ig" element={<ExternalRedirect to={INSTAGRAM_URL} label="Instagram @esturelco" path="/ig" />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </FadePage>
          </AnimatePresence>
        </Shell>
      </ErrorBoundary>
    </MotionConfig>
  )
}
