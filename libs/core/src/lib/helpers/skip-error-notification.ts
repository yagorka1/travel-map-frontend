import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsCodesEnum } from '../enums/errors-codes.enum';

export const skipErrorNotification = (error: HttpErrorResponse): boolean => {
  if (error.error.errorCode === ErrorsCodesEnum.UNAUTHORIZED) {
    return true;
  }

  return false;
};
