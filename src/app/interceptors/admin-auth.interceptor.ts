import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('admin_token');
  if (!token || !req.url.startsWith(environment.apiBase)) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
