import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import nestoImg from '../assets/nesto-EN_Secondary.png'
import '../App.css'

function Header() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en'

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'fr' : 'en')
  }

  return (
    <header className="app-header">
      <div className="docs">
        <Link to="/home">
          <img src={nestoImg} className="base" width="189" height="50" alt="" />
        </Link>
      </div>
      <div className="nav">
        <Link to="/listings">{t('header.applications')}</Link>
        <h2 className="lang-toggle" onClick={toggleLanguage}>
          {currentLang === 'en' ? 'FR' : 'EN'}
        </h2>
      </div>
    </header>
  )
}

export default Header
