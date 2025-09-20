import { HttpInterceptorFn } from '@angular/common/http';

import {environment} from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = environment.AUTH_TOKEN;
  const newReq = req.clone({
    headers: req.headers.append('Authentication', `Bearer ${authToken}`),
  });

  return next(newReq);
};
