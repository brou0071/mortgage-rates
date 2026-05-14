import i18n from '../i18n';

export const ErrorType = {
  PRODUCTS: '01',
  APPLICATION: '02',
  APPLICATIONS: '03',
} as const;

export const generateErrorDescription = (httpStatus: number): string => {
  return i18n.t(`error.httpStatusDescriptions.${httpStatus}`);
};
