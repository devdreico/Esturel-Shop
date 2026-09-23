import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/cart/CartDrawer'
import { AddToast } from './components/cart/AddToast'
import { AuroraBackdrop, BackToTop } from './components/ui/Aurora'
import { ScrollProgress, FadePage } from './components/ui/Motion'
import { HomePage } from './pages/Home'
import { CatalogPage } from './pages/Catalog'
import { ProductDetailPage } from './pages/ProductDetail'
import { CartPage } from './pages/Cart'
import { CheckoutPage } from './pages/Checkout'
import { NewsPage } from './pages/News'
import { AsesorPage } from './pages/Asesor'
import { NotFoundPage } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen font-sans">
      <AuroraBackdrop />
      <ScrollProgress />
      <ScrollToTop />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <FadePage key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogo" element={<CatalogPage />} />
                <Route path="/producto/:slug" element={<ProductDetailPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/noticias" element={<NewsPage />} />
                <Route path="/asesor" element={<AsesorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </FadePage>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <AddToast />
      <BackToTop />
    </div>
  )
}
