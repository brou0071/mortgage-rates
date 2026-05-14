import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getApplications, getProducts, type ApplicationType, type ApplicantType, type ProductType } from '../services/axios/nestoApi';
import { useInfiniteDataQueryHook } from '../services/hooks/useInfiniteDataQueryHook';
import { ErrorBoundary } from './ErrorBoundary';

function Listings() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { isLoading, isError, error, data } =
		useInfiniteDataQueryHook<ApplicationType[]>({
			queryKey: 'applications',
			apiCall: getApplications,
			filters: {},
			rowsPerPage: 10,
			sorting: [],
		});

	const { data: productData } =
		useInfiniteDataQueryHook<ProductType[]>({
			queryKey: 'code-repositories',
			apiCall: getProducts,
			filters: {},
			rowsPerPage: 100,
			sorting: [],
		});

	if (isLoading) {
		return (
			<section className="center">
				<h1>{t('applications.loading')}</h1>
			</section>
		)
	}

	if (isError) {
		return (
			<section className="center">
				<h1>{t('applications.errorTitle')}</h1>
				<p>{error?.message ?? t('applications.errorTitle')}</p>
			</section>
		)
	}

	const applications = data?.pages.flatMap((page) => page.data ?? []) ?? [];
	const products = productData?.pages.flatMap((page) => page.data ?? []) ?? [];
	const productMap = new Map<number, string>(products.map((p: ProductType) => [p.id, p.name]));

	// Flatten applicants while keeping a reference to their parent application
	const rows: { applicant: ApplicantType; application: ApplicationType }[] =
		applications.flatMap((application: ApplicationType) =>
			(application.applicants ?? []).map((applicant: ApplicantType) => ({ applicant, application }))
		);

	return (
		<ErrorBoundary>
			<section>
				<h1>{t('applications.heading')}</h1>
				<table className="applications-table">
					<thead>
						<tr>
							<th>{t('applications.firstName')}</th>
							<th>{t('applications.lastName')}</th>
							<th>{t('applications.email')}</th>
							<th>{t('applications.phone')}</th>
							<th colSpan={2}>{t('applications.product')}</th>
						</tr>
					</thead>
					<tbody>
						{rows.map(({ applicant, application }, index) => (
							<tr key={index}>
								<td>{applicant.firstName}</td>
								<td>{applicant.lastName}</td>
								<td>{applicant.email}</td>
								<td>{applicant.phone}</td>
								<td>{application.productId != null ? (productMap.get(application.productId) ?? '—') : '—'}</td>
								<td>
									<button onClick={() => navigate('/form', { state: { application } })}>
										{t('applications.edit')}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
        <Link to="/home">
          {t('applications.backToProducts')}
        </Link>
			</section>
		</ErrorBoundary>
	)
}

export default Listings
