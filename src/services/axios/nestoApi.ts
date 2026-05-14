import type { AxiosRequestConfig } from 'axios';
import { axios } from './instance';
import { catchAPIErrorAndLog } from '../hooks/util';
import { ErrorType } from '../../utils/errors';

export type ProductType = {
  id: number;
  name: string;
  family: "VALUE_FLEX" | "STANDARD";
  type: "VARIABLE" | "FIXED";
  term:
    | "1_YEAR"
    | "2_YEAR"
    | "3_YEAR"
    | "4_YEAR"
    | "5_YEAR"
    | "6_YEAR"
    | "7_YEAR"
    | "10_YEAR";
  insurable: boolean;
  insurance: "INSURED" | "CONVENTIONAL";
  prepaymentOption: "STANDARD" | "ENHANCED";
  restrictionsOption:
    | "NO_RESTRICTIONS"
    | "SOME_RESTRICTIONS"
    | "MORE_RESTRICTIONS";
  restrictions: string;
  fixedPenaltySpread: string;
  helocOption: "HELOC_WITH" | "HELOC_WITHOUT";
  helocDelta: number;
  lenderName: string;
  lenderType: string;
  rateHold: "30_DAYS" | "45_DAYS" | "60_DAYS" | "90_DAYS" | "120_DAYS";
  rate: number;
  ratePrimeVariance: number;
  bestRate: number;
  created: string;
  updated: string;
};

export type ApplicantType = {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type ApplicationType = {
  readonly id: string | null;
  token: string;
  type: "NEW" | "RENEWAL" | "REFINANCE";
  applicants: ApplicantType[];
  productId?: number;
  readonly createdAt: string;
};

export type CreateApplication = {
  productId: number;
};

export const getProducts = async (
  queryParams: ProductType[],
  requestConfig?: AxiosRequestConfig
) => {
  return await axios
    .get('/products', {
      ...requestConfig,
      params: queryParams,
    })
    .catch(catchAPIErrorAndLog('Error fetching Products', ErrorType.PRODUCTS));
};

export const createApplication = async (
  requestBody: CreateApplication,
  requestConfig?: AxiosRequestConfig
) => {
  return await axios
    .post('/applications', requestBody, {
      ...requestConfig,
    })
    .catch(catchAPIErrorAndLog('Error creating Application', ErrorType.APPLICATION));
};

export const getApplications = async (
  queryParams: ApplicationType[],
  requestConfig?: AxiosRequestConfig
) => {
  return await axios
    .get('/applications', {
      ...requestConfig,
      params: queryParams,
    })
    .catch(catchAPIErrorAndLog('Error fetching Applications', ErrorType.APPLICATIONS));
};

export const getApplication = async (
  application: string | null,
  queryParams: ApplicationType,
  requestConfig?: AxiosRequestConfig
) => {
  return await axios
    .get(`/applications/${application}`, {
      ...requestConfig,
      params: queryParams,
    })
    .catch(catchAPIErrorAndLog('Error fetching Application', ErrorType.APPLICATIONS));
};

export const updateApplication = async (
  application: string | null,
  requestBody: Partial<ApplicationType>,
  requestConfig?: AxiosRequestConfig
) => {
  return await axios
    .put(`/applications/${application}`, requestBody, {
      ...requestConfig,
    })
    .catch(catchAPIErrorAndLog('Error updating Enrollment Status', ErrorType.APPLICATION));
};

