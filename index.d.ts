import { AxiosResponse} from "axios";
export { Http } from "./http/http";
export { HNotify as Notify } from "./http/notify";

export declare interface ResponseWrapper<T> {
  code: number;
  data: T;
  msg: string;
  message?: string;
}
export declare type Paginated<T> = {
  current: number;
  pageSize: number;
  total: number;
  items?: T[];
  list?: T[];
};
export declare type PaginatedQuery = {
  pageSize: number;
  current: number;
  sorter?: Sorter;
};
export declare type Sorter = {
  [key: string]: "asc" | "desc";
};
export declare type IResponse<T> = AxiosResponse<ResponseWrapper<T>>;