import { ErrorBoundary } from './components/ErrorBoundary'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/header'
import Footer from './components/footer'
import Home from './views/home'
import Form from './views/form'
import Listings from './views/listings'
import './App.css'

function App() {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/listings" element={<Listings />} />
          <Route
            path="*"
            element={
              <section className="center">
                <h1>{t('notFound.title')}</h1>
                <p>
                  {t('notFound.message')} <Link to="/listings">{t('notFound.listings')}</Link>
                </p>
              </section>
            }
          />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </>
  )
}

export default App
