import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type ApplicantType, type ApplicationType, type ProductType, getProducts, updateApplication } from '../services/axios/nestoApi';
import { useInfiniteDataQueryHook } from '../services/hooks/useInfiniteDataQueryHook';
import Product from '../components/product';

function Form() {
  const { state } = useLocation();
  const { t } = useTranslation();
  const application: ApplicationType | undefined = state?.application;
  const existingApplicant = application?.applicants?.[0];

  const [formData, setFormData] = useState<ApplicantType>({
    firstName: existingApplicant?.firstName ?? '',
    lastName: existingApplicant?.lastName ?? '',
    email: existingApplicant?.email ?? '',
    phone: existingApplicant?.phone ?? '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: productData, isLoading: productsLoading } =
    useInfiniteDataQueryHook<ProductType[]>({
      queryKey: 'products-form',
      apiCall: getProducts,
      filters: {},
      rowsPerPage: 1,
      sorting: [],
    });

  const products = productData?.pages.flatMap((page) => page.data ?? []) ?? [];
  const fallbackProduct = products
    .slice()
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 1)[0];

  // Prefer the product tied to the application, fall back to lowest rate
  const selectedProduct: ProductType | undefined =
    application?.productId != null
      ? (products.find((p) => p.id === application.productId) ?? fallbackProduct)
      : fallbackProduct;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateApplication(application?.id ?? null, {
        applicants: [formData],
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      console.error('Failed to update application:', err);
      setSubmitError(t('form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="form-container">
        {productsLoading ? (
          <div className="form-column form-product-column">
            <p>{t('form.loadingProduct')}</p>
          </div>
        ) : selectedProduct ? (
          <div className="form-column form-product-column">
            <Product product={selectedProduct} onSelect={() => {}} />
          </div>
        ) : (
          <div className="form-column form-product-column">
            <p>{t('form.noProduct')}</p>
          </div>
        )}

        <div className="form-column form-input-column">
          {submitted && (
            <div className="form-success">
              <p>{t('form.successMessage')}</p>
            </div>
          )}
          {submitError && (
            <div className="form-error">
              <p>{submitError}</p>
            </div>
          )}
          <form className="applicant-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">{t('form.firstName')}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder={t('form.firstNamePlaceholder')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{t('form.lastName')}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder={t('form.lastNamePlaceholder')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('form.emailPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('form.phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder={t('form.phonePlaceholder')}
              />
            </div>

            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t('form.saving') : t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Form;
