import { useTranslation } from 'react-i18next'
import '../App.css'

function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <strong>1.866.606.6481 | <a href="mailto:info@nestogroup.ca">info@nestogroup.ca</a></strong>
      <p>&copy; {year} {t('footer.rights')}</p>
    </footer>
  )
}

export default Footer
