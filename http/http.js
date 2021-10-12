import axios from "axios";
import { uuid } from "./utils";

HNotify.init();

const DEFAULT_REQUEST_CONFIG = {
  timeout: 5000,
  validateStatus: HNotify.defaults.status,
};

const DEFAULT_REQUEST_INTERCEPTOR = {
  resolve: (config) => config,
  reject: (error) => error,
};

const DEFAULT_RESPONSE_INTERCEPTOR = {
  resolve: (response) => {
    const code = response.data.code;
    // notify message from server side
    code !== 0 && HNotify.defaults.error(code);
    return response.data;
  },
  reject: (error) => {
    if (error.response) {
      const data = error.response.data;
      // nofity error message
      HNotify.defaults.error(data || data.msg);
      // resolve the result
      return Promise.resolve({
        code: error.response.status,
        data: null,
        msg: error.response.data,
      });
    }
  },
};

export const DEFAULT_INTERCEPTORS = {
  request: DEFAULT_REQUEST_INTERCEPTOR,
  response: DEFAULT_RESPONSE_INTERCEPTOR,
};

/**
 * Used to create new axios instance.
 * @summary With default config and interceptors, or customize some of them later.
 * @example
 * const http = new Http('http://a.xxx.com');
 *
 * // http get
 * const params = { page: 1, size: 12 };
 * const { code, data, msg } = await http.get('/api/categories', { params });
 *
 * // http post
 * const category = { id:123, name: 'some category' };
 * const { code, data, msg } = await http.post('api/category', category);
 */
export class Http {
  instance;
  baseURL;
  config;
  source;

  interceptors = {
    request: { id: -1, hander: null },
    response: { id: -1, hander: null },
  };
  usePrivateInterceptor;

  tokenConfig;
  usePrivateToken;

  static INSTANCES = {};
  static defaults = Object.assign({}, axios.defaults, DEFAULT_REQUEST_CONFIG);
  static GLOBAL_INTERCEPTORS = DEFAULT_INTERCEPTORS;
  static GLOBAL_TOKEN_CONFIG = {
    key: "token",
    value: sessionStorage.getItem("token"),
  };

  constructor(baseURL, config = {}) {
    // create axios instance
    const merged = this.mergeConfigs(baseURL, config);
    this.instance = axios.create(merged);
    // set default auth token
    this.setToken(Http.GLOBAL_TOKEN_CONFIG, false);
    this.source = axios.CancelToken.source();
    // use interceptors
    this.setInterceptors(Http.GLOBAL_INTERCEPTORS);
    Http.INSTANCES[`${uuid()}`] = this;
  }

  mergeConfigs(baseURL, config) {
    this.config = config || {};
    this.baseURL = baseURL || "";
    return Object.assign({}, DEFAULT_REQUEST_CONFIG, this.config, {
      baseURL: this.baseURL,
    });
  }

  getUri(config) {
    return this.instance.getUri(config);
  }

  abort() {
    this.source.cancel("request abort...");
  }

  request(config) {
    const { key, value } = this.tokenConfig;
    key &&
      value &&
      (config.headers = Object.assign({}, config.headers, { [key]: value }));
    config.cancelToken = this.source.token;
    return this.instance.request(config);
  }

  get(url, config) {
    return this.request(Object.assign({ method: "get", url: url }, config));
  }

  post(url, data, config) {
    return this.request(
      Object.assign({ method: "post", url: url, data: data }, config)
    );
  }

  put(url, data, config) {
    return this.request(
      Object.assign({ method: "put", url: url, data: data }, config)
    );
  }

  patch(url, data, config) {
    return this.request(
      Object.assign({ method: "patch", url: url, data: data }, config)
    );
  }

  delete(url, config) {
    return this.request(Object.assign({ method: "delete", url: url }, config));
  }

  head(url, config) {
    return this.request(Object.assign({ method: "head", url: url }, config));
  }

  options(url, config) {
    return this.request(Object.assign({ method: "options", url: url }, config));
  }

  /**
   * Set token for the given instance
   * @param {TokenConfig} tokenConfig
   * @param {boolean} usePrivateToken
   */
  setToken(tokenConfig, usePrivateToken = false) {
    this.usePrivateToken = usePrivateToken;
    this.tokenConfig = tokenConfig;
  }

  /**
   * Set token for all instances
   * @param {TokenConfig} tokenConfig
   */
  static setToken(tokenConfig) {
    const httpInstances = Object.values(Http.INSTANCES);
    for (const http of httpInstances) {
      if (http.usePrivateToken) continue;
      http.setToken(tokenConfig);
    }
    Http.GLOBAL_TOKEN_CONFIG = tokenConfig;
  }

  /**
   * Set interceptors for the given instance
   * @param {*} interceptors
   */
  setInterceptors(interceptors, usePrivateInterceptor = false) {
    this.usePrivateInterceptor = usePrivateInterceptor;
    const axiosInterceptors = this.instance.interceptors;
    const httpInterceptor = this.interceptors;
    // eject previous handler
    axiosInterceptors.request.eject(httpInterceptor.request.id);
    axiosInterceptors.response.eject(httpInterceptor.response.id);
    // use new handler
    const { request, response } = interceptors;
    const requestId = axiosInterceptors.request.use(
      request.resolve,
      request.reject
    );
    const responseId = axiosInterceptors.response.use(
      response.resolve,
      response.reject
    );
    httpInterceptor.request = { id: requestId, hander: request };
    httpInterceptor.response = { id: responseId, hander: response };
  }

  /**
   * Set interceptors for all instances
   * @param {HttpInterceptors} interceptors
   */
  static setInterceptors(interceptors) {
    const httpInstances = Object.values(Http.INSTANCES);
    for (const http of httpInstances) {
      if (http.usePrivateInterceptor) continue;
      http.setInterceptors(interceptors);
    }
    Http.GLOBAL_INTERCEPTORS = interceptors;
  }

  static _notification = () => {};
  static notification(notifyFunc) {
    Http._notification = _notification;
  }
}
