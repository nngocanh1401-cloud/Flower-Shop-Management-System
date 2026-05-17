import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from "./chunk-JI77DKGC.js";
import "./chunk-ROCF3NSR.js";
import {
  Injectable,
  Injector,
  NgModule,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-4WAE3MJ6.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  switchMap,
  take,
  throwError
} from "./chunk-4S3KYZTJ.js";
import "./chunk-EIB7IA3J.js";

// node_modules/abp-ng2-module/fesm2022/abp-ng2-module.mjs
var AbpModule = class _AbpModule {
  static ɵfac = function AbpModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AbpModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpModule, [{
    type: NgModule,
    args: [{
      declarations: [],
      imports: [],
      exports: []
    }]
  }], null, null);
})();
var TokenService = class _TokenService {
  getToken() {
    return abp.auth.getToken();
  }
  getTokenCookieName() {
    return abp.auth.tokenCookieName;
  }
  clearToken() {
    abp.auth.clearToken();
  }
  setToken(authToken, expireDate) {
    abp.auth.setToken(authToken, expireDate);
  }
  //refresh token
  getRefreshToken() {
    return abp.auth.getRefreshToken();
  }
  getRefreshTokenCookieName() {
    return abp.auth.refreshTokenCookieName;
  }
  clearRefreshToken() {
    abp.auth.clearRefreshToken();
  }
  setRefreshToken(refreshToken, expireDate) {
    abp.auth.setRefreshToken(refreshToken, expireDate);
  }
  static ɵfac = function TokenService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TokenService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _TokenService,
    factory: _TokenService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TokenService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var PermissionCheckerService = class _PermissionCheckerService {
  isGranted(permissionName) {
    return abp.auth.isGranted(permissionName);
  }
  static ɵfac = function PermissionCheckerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PermissionCheckerService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _PermissionCheckerService,
    factory: _PermissionCheckerService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PermissionCheckerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var FeatureCheckerService = class _FeatureCheckerService {
  get(featureName) {
    return abp.features.get(featureName);
  }
  getValue(featureName) {
    return abp.features.getValue(featureName);
  }
  isEnabled(featureName) {
    return abp.features.isEnabled(featureName);
  }
  static ɵfac = function FeatureCheckerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FeatureCheckerService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FeatureCheckerService,
    factory: _FeatureCheckerService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FeatureCheckerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var LocalizationService = class _LocalizationService {
  get languages() {
    return abp.localization.languages;
  }
  get currentLanguage() {
    return abp.localization.currentLanguage;
  }
  localize(key, sourceName) {
    return abp.localization.localize(key, sourceName);
  }
  getSource(sourceName) {
    return abp.localization.getSource(sourceName);
  }
  static ɵfac = function LocalizationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalizationService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _LocalizationService,
    factory: _LocalizationService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalizationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var LogService = class _LogService {
  debug(logObject) {
    abp.log.debug(logObject);
  }
  info(logObject) {
    abp.log.info(logObject);
  }
  warn(logObject) {
    abp.log.warn(logObject);
  }
  error(logObject) {
    abp.log.error(logObject);
  }
  fatal(logObject) {
    abp.log.fatal(logObject);
  }
  static ɵfac = function LogService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LogService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _LogService,
    factory: _LogService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LogService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var MessageService = class _MessageService {
  info(message, title, options) {
    return abp.message.info(message, title, options);
  }
  success(message, title, options) {
    return abp.message.success(message, title, options);
  }
  warn(message, title, options) {
    return abp.message.warn(message, title, options);
  }
  error(message, title, options) {
    return abp.message.error(message, title, options);
  }
  confirm(message, title, callback, options) {
    return abp.message.confirm(message, title, callback, options);
  }
  static ɵfac = function MessageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MessageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MessageService,
    factory: _MessageService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MessageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var AbpMultiTenancyService = class _AbpMultiTenancyService {
  get isEnabled() {
    return abp.multiTenancy.isEnabled;
  }
  static ɵfac = function AbpMultiTenancyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpMultiTenancyService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AbpMultiTenancyService,
    factory: _AbpMultiTenancyService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpMultiTenancyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NotifyService = class _NotifyService {
  info(message, title, options) {
    abp.notify.info(message, title, options);
  }
  success(message, title, options) {
    abp.notify.success(message, title, options);
  }
  warn(message, title, options) {
    abp.notify.warn(message, title, options);
  }
  error(message, title, options) {
    abp.notify.error(message, title, options);
  }
  static ɵfac = function NotifyService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotifyService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NotifyService,
    factory: _NotifyService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotifyService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var AbpSessionService = class _AbpSessionService {
  get userId() {
    return abp.session.userId;
  }
  get tenantId() {
    return abp.session.tenantId;
  }
  get impersonatorUserId() {
    return abp.session.impersonatorUserId;
  }
  get impersonatorTenantId() {
    return abp.session.impersonatorTenantId;
  }
  get multiTenancySide() {
    return abp.session.multiTenancySide;
  }
  static ɵfac = function AbpSessionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpSessionService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AbpSessionService,
    factory: _AbpSessionService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpSessionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var SettingService = class _SettingService {
  get(name) {
    return abp.setting.get(name);
  }
  getBoolean(name) {
    return abp.setting.getBoolean(name);
  }
  getInt(name) {
    return abp.setting.getInt(name);
  }
  static ɵfac = function SettingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _SettingService,
    factory: _SettingService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var UtilsService = class _UtilsService {
  getCookieValue(key) {
    return abp.utils.getCookieValue(key);
  }
  setCookieValue(key, value, expireDate, path, domain, attributes) {
    abp.utils.setCookieValue(key, value, expireDate, path, domain, attributes);
  }
  deleteCookie(key, path) {
    abp.utils.deleteCookie(key, path);
  }
  static ɵfac = function UtilsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UtilsService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _UtilsService,
    factory: _UtilsService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UtilsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var AbpUserConfigurationService = class _AbpUserConfigurationService {
  _http;
  constructor(_http) {
    this._http = _http;
  }
  initialize() {
    this._http.get("/AbpUserConfiguration/GetAll").subscribe((result) => {
      jQuery.extend(true, abp, JSON.parse(JSON.stringify(result)));
    });
  }
  static ɵfac = function AbpUserConfigurationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpUserConfigurationService)(ɵɵinject(HttpClient));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AbpUserConfigurationService,
    factory: _AbpUserConfigurationService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpUserConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: HttpClient
  }], null);
})();
var RefreshTokenService = class _RefreshTokenService {
  static ɵfac = function RefreshTokenService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RefreshTokenService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _RefreshTokenService,
    factory: _RefreshTokenService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RefreshTokenService, [{
    type: Injectable
  }], null, null);
})();
var AbpHttpConfigurationService = class _AbpHttpConfigurationService {
  _messageService;
  _logService;
  constructor(_messageService, _logService) {
    this._messageService = _messageService;
    this._logService = _logService;
  }
  defaultError = {
    message: "An error has occurred!",
    details: "Error details were not sent by server."
  };
  defaultError401 = {
    message: "You are not authenticated!",
    details: "You should be authenticated (sign in) in order to perform this operation."
  };
  defaultError403 = {
    message: "You are not authorized!",
    details: "You are not allowed to perform this operation."
  };
  defaultError404 = {
    message: "Resource not found!",
    details: "The resource requested could not be found on the server."
  };
  logError(error) {
    this._logService.error(error);
  }
  showError(error) {
    if (error.details) {
      return this._messageService.error(error.details, error.message || this.defaultError.message);
    } else {
      return this._messageService.error(error.message || this.defaultError.message);
    }
  }
  handleTargetUrl(targetUrl) {
    if (!targetUrl) {
      location.href = "/";
    } else {
      location.href = targetUrl;
    }
  }
  handleUnAuthorizedRequest(messagePromise, targetUrl) {
    const self = this;
    if (messagePromise) {
      messagePromise.done(() => {
        this.handleTargetUrl(targetUrl || "/");
      });
    } else {
      self.handleTargetUrl(targetUrl || "/");
    }
  }
  handleNonAbpErrorResponse(response) {
    const self = this;
    switch (response.status) {
      case 401:
        self.handleUnAuthorizedRequest(self.showError(self.defaultError401), "/");
        break;
      case 403:
        self.showError(self.defaultError403);
        break;
      case 404:
        self.showError(self.defaultError404);
        break;
      default:
        self.showError(self.defaultError);
        break;
    }
  }
  handleAbpResponse(response, ajaxResponse) {
    var newResponse;
    if (ajaxResponse.success) {
      newResponse = response.clone({
        body: ajaxResponse.result
      });
      if (ajaxResponse.targetUrl) {
        this.handleTargetUrl(ajaxResponse.targetUrl);
        ;
      }
    } else {
      newResponse = response.clone({
        body: ajaxResponse.result
      });
      if (!ajaxResponse.error) {
        ajaxResponse.error = this.defaultError;
      }
      this.logError(ajaxResponse.error);
      this.showError(ajaxResponse.error);
      if (response.status === 401) {
        this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
      }
    }
    return newResponse;
  }
  getAbpAjaxResponseOrNull(response) {
    if (!response || !response.headers) {
      return null;
    }
    var contentType = response.headers.get("Content-Type");
    if (!contentType) {
      this._logService.warn("Content-Type is not sent!");
      return null;
    }
    if (contentType.indexOf("application/json") < 0) {
      this._logService.warn("Content-Type is not application/json: " + contentType);
      return null;
    }
    var responseObj = JSON.parse(JSON.stringify(response.body));
    if (!responseObj.__abp) {
      return null;
    }
    return responseObj;
  }
  handleResponse(response) {
    var ajaxResponse = this.getAbpAjaxResponseOrNull(response);
    if (ajaxResponse == null) {
      return response;
    }
    return this.handleAbpResponse(response, ajaxResponse);
  }
  blobToText(blob) {
    return new Observable((observer) => {
      if (!blob) {
        observer.next("");
        observer.complete();
      } else {
        let reader = new FileReader();
        reader.onload = function() {
          observer.next(this.result);
          observer.complete();
        };
        reader.readAsText(blob);
      }
    });
  }
  static ɵfac = function AbpHttpConfigurationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpHttpConfigurationService)(ɵɵinject(MessageService), ɵɵinject(LogService));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AbpHttpConfigurationService,
    factory: _AbpHttpConfigurationService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpHttpConfigurationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: MessageService
  }, {
    type: LogService
  }], null);
})();
var AbpHttpInterceptor = class _AbpHttpInterceptor {
  _injector;
  configuration;
  _tokenService = new TokenService();
  _utilsService = new UtilsService();
  _logService = new LogService();
  constructor(configuration, _injector) {
    this._injector = _injector;
    this.configuration = configuration;
  }
  intercept(request, next) {
    var modifiedRequest = this.normalizeRequestHeaders(request);
    return next.handle(modifiedRequest).pipe(catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.tryAuthWithRefreshToken(request, next, error);
      } else {
        return this.handleErrorResponse(error);
      }
    }), switchMap((event) => {
      return this.handleSuccessResponse(event);
    }));
  }
  tryGetRefreshTokenService() {
    var _refreshTokenService = this._injector.get(RefreshTokenService, null);
    if (_refreshTokenService) {
      return _refreshTokenService.tryAuthWithRefreshToken();
    }
    return of(false);
  }
  isRefreshing = false;
  refreshTokenSubject = new BehaviorSubject(null);
  tryAuthWithRefreshToken(request, next, error) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.tryGetRefreshTokenService().pipe(switchMap((authResult) => {
        this.isRefreshing = false;
        if (authResult) {
          this.refreshTokenSubject.next(authResult);
          let modifiedRequest = this.normalizeRequestHeaders(request);
          return next.handle(modifiedRequest);
        } else {
          return this.handleErrorResponse(error);
        }
      }));
    } else {
      return this.refreshTokenSubject.pipe(filter((authResult) => authResult != null), take(1), switchMap((authResult) => {
        let modifiedRequest = this.normalizeRequestHeaders(request);
        return next.handle(modifiedRequest);
      }));
    }
  }
  normalizeRequestHeaders(request) {
    var modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers.set("Pragma", "no-cache").set("Cache-Control", "no-cache").set("Expires", "Sat, 01 Jan 2000 00:00:00 GMT");
    modifiedHeaders = this.addXRequestedWithHeader(modifiedHeaders);
    modifiedHeaders = this.addAuthorizationHeaders(modifiedHeaders);
    modifiedHeaders = this.addAspNetCoreCultureHeader(modifiedHeaders);
    modifiedHeaders = this.addAcceptLanguageHeader(modifiedHeaders);
    modifiedHeaders = this.addTenantIdHeader(modifiedHeaders);
    return request.clone({
      headers: modifiedHeaders
    });
  }
  addXRequestedWithHeader(headers) {
    if (headers) {
      headers = headers.set("X-Requested-With", "XMLHttpRequest");
    }
    return headers;
  }
  addAspNetCoreCultureHeader(headers) {
    let cookieLangValue = this._utilsService.getCookieValue("Abp.Localization.CultureName");
    if (cookieLangValue && headers && !headers.has(".AspNetCore.Culture")) {
      headers = headers.set(".AspNetCore.Culture", cookieLangValue);
    }
    return headers;
  }
  addAcceptLanguageHeader(headers) {
    let cookieLangValue = this._utilsService.getCookieValue("Abp.Localization.CultureName");
    if (cookieLangValue && headers && !headers.has("Accept-Language")) {
      headers = headers.set("Accept-Language", cookieLangValue);
    }
    return headers;
  }
  addTenantIdHeader(headers) {
    let cookieTenantIdValue = this._utilsService.getCookieValue(abp.multiTenancy.tenantIdCookieName);
    if (cookieTenantIdValue && headers && !headers.has(abp.multiTenancy.tenantIdCookieName)) {
      headers = headers.set(abp.multiTenancy.tenantIdCookieName, cookieTenantIdValue);
    }
    return headers;
  }
  addAuthorizationHeaders(headers) {
    let authorizationHeaders = headers ? headers.getAll("Authorization") : null;
    if (!authorizationHeaders) {
      authorizationHeaders = [];
    }
    if (!this.itemExists(authorizationHeaders, (item) => item.indexOf("Bearer ") == 0)) {
      let token = this._tokenService.getToken();
      if (headers && token) {
        headers = headers.set("Authorization", "Bearer " + token);
      }
    }
    return headers;
  }
  handleSuccessResponse(event) {
    var self = this;
    if (event instanceof HttpResponse) {
      if (event.body instanceof Blob && event.body.type && event.body.type.indexOf("application/json") >= 0) {
        return self.configuration.blobToText(event.body).pipe(map((json) => {
          const responseBody = json == "null" ? {} : JSON.parse(json);
          var modifiedResponse = self.configuration.handleResponse(event.clone({
            body: responseBody
          }));
          return modifiedResponse.clone({
            body: new Blob([JSON.stringify(modifiedResponse.body)], {
              type: "application/json"
            })
          });
        }));
      }
    }
    return of(event);
  }
  handleErrorResponse(error) {
    if (!(error.error instanceof Blob)) {
      return throwError(error);
    }
    return this.configuration.blobToText(error.error).pipe(switchMap((json) => {
      const errorBody = json == "" || json == "null" ? {} : JSON.parse(json);
      const errorResponse = new HttpResponse({
        headers: error.headers,
        status: error.status,
        body: errorBody
      });
      var ajaxResponse = this.configuration.getAbpAjaxResponseOrNull(errorResponse);
      if (ajaxResponse != null) {
        this.configuration.handleAbpResponse(errorResponse, ajaxResponse);
      } else {
        this.configuration.handleNonAbpErrorResponse(errorResponse);
      }
      return throwError(error);
    }));
  }
  itemExists(items, predicate) {
    for (let i = 0; i < items.length; i++) {
      if (predicate(items[i])) {
        return true;
      }
    }
    return false;
  }
  static ɵfac = function AbpHttpInterceptor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbpHttpInterceptor)(ɵɵinject(AbpHttpConfigurationService), ɵɵinject(Injector));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AbpHttpInterceptor,
    factory: _AbpHttpInterceptor.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbpHttpInterceptor, [{
    type: Injectable
  }], () => [{
    type: AbpHttpConfigurationService
  }, {
    type: Injector
  }], null);
})();
export {
  AbpHttpConfigurationService,
  AbpHttpInterceptor,
  AbpModule,
  AbpMultiTenancyService,
  AbpSessionService,
  AbpUserConfigurationService,
  FeatureCheckerService,
  LocalizationService,
  LogService,
  MessageService,
  NotifyService,
  PermissionCheckerService,
  RefreshTokenService,
  SettingService,
  TokenService,
  UtilsService
};
//# sourceMappingURL=abp-ng2-module.js.map
