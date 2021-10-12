import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";

export declare type IObject = Record<string, any>;
export declare interface ResponseWrapper<T> {
  code: number;
  data?: T;
  msg?: string;
}
export declare type IResponse<T> = AxiosResponse<ResponseWrapper<T>>;
export declare interface Paginated<T> {
  current: number;
  pageSize: number;
  total: number;
  items?: T[];
}
export declare type IPaginatedResponse<T> = IResponse<Paginated<T>>;

export declare type PaginatedQuery = {
  pageSize: number;
  current: number;
  sorter?: Sorter;
};
export declare type Sorter = {
  [key: string]: "asc" | "desc";
};

export declare type TokenConfig = {
  key: string;
  value: string;
};

export interface RequestInterceptor {
  resolve: (config: AxiosRequestConfig) => AxiosRequestConfig;
  reject: (error: AxiosError) => void;
}
export interface ResponseInterceptor<T = any> {
  resolve: (res: IResponse<T>) => T;
  reject: (error: AxiosError) => void;
}

export declare type HttpInterceptors<T = any> = {
  request?: RequestInterceptor;
  response?: ResponseInterceptor<T>;
};

export const DEFAULT_REQUEST_CONFIG: AxiosRequestConfig;
export const DEFAULT_REQUEST_INTERCEPTOR: RequestInterceptor;
export const DEFAULT_RESPONSE_INTERCEPTOR: ResponseInterceptor;
export const DEFAULT_INTERCEPTORS: HttpInterceptors;

export declare class Http {
  instance: AxiosInstance;
  baseURL: string;
  private config?: AxiosRequestConfig;
  private interceptors: HttpInterceptors;
  private usePrivateInterceptors: boolean;
  private tokenConfig: TokenConfig;
  private usePrivateToken: boolean;

  private static INSTANCES: Record<string, Http>;
  private static defaults: Partial<AxiosRequestConfig>;
  private static GLOBAL_INTERCEPTORS: HttpInterceptors;
  private static GLOBAL_TOKEN_CONFIG: TokenConfig;

  constructor(baseURL: string, config?: AxiosRequestConfig);

  getUri(config?: AxiosRequestConfig): string;
  abort(): void;
  request<T = any, R = ResponseWrapper<T>>(
    config: AxiosRequestConfig
  ): Promise<R>;
  get<T = any, R = ResponseWrapper<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  post<T = any, R = ResponseWrapper<T>>(
    url: string,
    data?: IObject,
    config?: AxiosRequestConfig
  ): Promise<R>;
  put<T = any, R = ResponseWrapper<T>>(
    url: string,
    data?: IObject,
    config?: AxiosRequestConfig
  ): Promise<R>;
  patch<T = any, R = ResponseWrapper<T>>(
    url: string,
    data?: IObject,
    config?: AxiosRequestConfig
  ): Promise<R>;
  delete<T = any, R = ResponseWrapper<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  head<T = any, R = ResponseWrapper<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
  options<T = any, R = ResponseWrapper<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;

  setToken(tokenConfig: TokenConfig, usePrivateToken?: boolean): void;
  static setToken(tokenConfig: TokenConfig): void;

  setInterceptors(
    interceptors: HttpInterceptors,
    usePrivateInterceports?: boolean
  ): void;
  static setInterceptors(interceptors: HttpInterceptors): void;
}
