/* SystemJS module definition */
declare let module: NodeModule;
declare let require: any;
interface NodeModule {
  id: string;
}

/* Starter Typings */

export interface IErrorApi {
  errorMsg?: string;
  headers?: Record<string, unkown>;
  message?: string;
  ok?: boolean;
  status?: number;
  _body?: string;
  statusText?: string;
  type?: number;
  url?: string;
}

interface ILogin {
  username: string;
  password: string;
}

interface IRest {
  Get?: any;
  Post?: any;
  Put?: any;
  Delete?: any;
}
