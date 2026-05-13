import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Thêm withInterceptors
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor'; // Import interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Cấu hình HttpClient để sử dụng Interceptor
    provideHttpClient(
      withInterceptors([jwtInterceptor]) // Đăng ký thành công
    )
  ]
};