import { useTranslation } from 'react-i18next'
import { type ProductType } from '../services/axios/nestoApi'

function Product({ product, onSelect }: { product: ProductType; onSelect: (productId: number) => void }) {
  const { t } = useTranslation()

  return (
    <div className="product">
      <h2>{product.name}</h2>
      <p>{product.type}</p>
      <h5 id="product-rate">{product.rate}%</h5>
      <button onClick={() => onSelect(product.id)}>{t('product.select')}</button>
    </div>
  )
}

export default Product
