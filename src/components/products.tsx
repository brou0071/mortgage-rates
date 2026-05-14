import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Product from './product';
import { getProducts, createApplication, getApplication, type ProductType } from '../services/axios/nestoApi';
import { useInfiniteDataQueryHook } from '../services/hooks/useInfiniteDataQueryHook';
import { ErrorBoundary } from './ErrorBoundary';

function Products() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isSelecting, setIsSelecting] = useState(false);

	const { isLoading, isError, error, data } =
		useInfiniteDataQueryHook<ProductType[]>({
			queryKey: 'code-repositories',
			apiCall: getProducts,
			filters: {},
			rowsPerPage: 10,
			sorting: [],
		});

	const handleSelectProduct = async (productId: number) => {
		setIsSelecting(true);
		try {
			const createResponse = await createApplication({ productId });
			const applicationId = createResponse?.data?.id;

			const applicationResponse = await getApplication(applicationId, {} as any);
			const application = applicationResponse?.data;

			navigate('/form', { state: { application } });
		} catch (err) {
			console.error('Failed to create or fetch application:', err);
		} finally {
			setIsSelecting(false);
		}
	};

	const products = data?.pages.flatMap((page) => page.data ?? []) ?? [];
	const variableProducts = products.filter((product) => product.type === 'VARIABLE');
	const fixedProducts = products.filter((product) => product.type === 'FIXED');
	const lowestRateVariableProducts = variableProducts
		.sort((a, b) => a.rate - b.rate)
		.slice(0, 3);
	const lowestRateFixedProducts = fixedProducts
		.sort((a, b) => a.rate - b.rate)
		.slice(0, 3);

	if (isLoading || isSelecting) {
		return (
			<section className="center">
				<h1>{isSelecting ? t('products.creatingApplication') : t('products.loading')}</h1>
			</section>
		)
	}

	if (isError) {
		return (
			<section className="center">
				<h1>{t('products.errorTitle')}</h1>
				<p>{error?.message ?? t('products.errorTitle')}</p>
			</section>
		)
	}

	return (
		<ErrorBoundary>
			<section className="center">
				<div className="products">
					<div className="product-heading">
						<h3>{t('products.fixedHeading')}</h3>
					</div>
					{lowestRateFixedProducts.map((product: ProductType, index: number) => (
						<Product key={index} product={product} onSelect={handleSelectProduct} />
					))}
					<div className="product-heading">
						<h3>{t('products.variableHeading')}</h3>
					</div>
					{lowestRateVariableProducts.map((product: ProductType, index: number) => (
						<Product key={index} product={product} onSelect={handleSelectProduct} />
					))}
				</div>
			</section>
		</ErrorBoundary>
	)
}

export default Products
