import { Http,Notify } from "./index";
import { notification } from "ant-design-vue";

// use your own way of notify errors
const notifyError = (message:string, duration:number) => notification.error({ message, duration, description: "" });
Notify.init({ error: notifyError });
// create your axios instance 
const BASE_URL = "http://api.xxx.net";
export const http = new Http(BASE_URL);
// now, we can use 'http' to get | post | delete | put datas