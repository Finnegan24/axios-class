# Http

To create instances of axios with common config、token and interceptors. we also give out a default status validator and code validator.
but a more intuitive ui component to notify errors is strongly recommanded.

## Usage

### Use Your Own Notification

The default notification while got http error and some other error message from server is `console.log`, you should customize your own notification first.

```javascript
import { Notify } from "axios-class";
import { notification } from "ant-design-vue";

// use your own way of notify errors,
// obviously, this is a global setting.
const notifyError = (message: string, duration: number) =>
  notification.error({ message, duration, description: "" });
Notify.init({ error: notifyError });
```

### Create Your Http Instances

Our application usually have multiple axios instances. Rather than multi-configs, multi-instances has a more semantic expression. You should
create new axios instances when different base url, configs or inteceptors are needed.

```javascript
import { Http } from "axios-class";

// create your axios instances
const baseURL = "http://api.xxx.net";
export const baseHttp = new Http(baseURL);

const ssoURL = "http://sso.xxx.net";
export const ssoHttp = new Http(ssoURL);

// we can use ssoHttp to do some login/authorize stuffs,
// then get datas with baseHttp mostly.
```

### Make Http Request

Use `'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options'` functions to make http request, just like you are using axios functions with typescript supported.

#### CRUD demo with typescript

- default types declared in http.d.ts

```typescript
// the default response wrapper
export declare interface ResponseWrapper<T> {
  code: number;
  data?: T;
  msg?: string;
}

// default data declaration for paginated response
export declare interface Paginated<T> {
  current: number;
  pageSize: number;
  total: number;
  items?: T[];
}

// default query params declaration for paginated query
export declare type PaginatedQuery = {
  current: number;
  pageSize: number;
  sorter?: Sorter;
};
export declare type Sorter = {
  [key: string]: "asc" | "desc";
};
```

- the demo model

```typescript
export interface ICategory {
  id: number;
  title: string;
  description?: string;
  parent_id?: number;
  created_at?: number;
}
```

- create http instance

```typescript
// http.ts
import { Http } from "axios-class";

// create http instances
const baseURL = "http://api.xxx.net";
export const http = new Http(baseURL);
```

- your fetch api

```typescript
// category.api.ts
import { http } from "./http";

/**
 * get paginated list of category
 * @param {Partial<ICategory> & PaginatedQuery} params fetch params
 * @returns the paginated list
 */
export const getCategoryList = (params: Partial<ICategory> & PaginatedQuery) =>
  http.get<Paginated<ICategory>>("/api/categories", { params });

/**
 * add new category
 * @param {*} params
 * @returns the newly created entity
 */
export const addCategory = (params: Partial<ICategory>) =>
  http.post("/api/categories", params);

/**
 * update an existed category
 * @param {Partial<ICategory>} params the entity to update
 * @returns the updated entity
 */
export const updateCategory = (params: Partial<ICategory>) =>
  http.put(`/api/categories/${params.id}`, params);

/**
 * delete category with the given id
 * @param {number} id
 * @returns 1 if deleted
 */
export const deleteCategory = (id: number) =>
  http.delete(`/api/categories/${id}`);
```

- use the apis

```typescript
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/service/category.api.ts';

const queryParams = { pageSize: 12, current: 1 };
const { code, data, msg } = await getCategoryList(queryParams);
console.log(data instanceof Paginated<ICategory>); // output: true


const toAdd = { title: 'new category', description: 'test add category' };
const { code, data, msg } = await addCategory(toAdd);
console.log('created category : ', JSON.stringify(data));
// output: { id: 1001, title: 'new category', description: 'test add category' }

const toUpdate = { id: 1001, title: 'update category', description: 'test update category' };
const { code, data, msg } = await updateCategory(toUpdate);
console.log('update category : ', JSON.stringify(data);
// output: { id: 1001, title: 'update category', description: 'test update category' }


const { code, data, msg } = await deleteCategory(1001);
console.log('delete category : ', data > 0);
// output: delete category : true

```
