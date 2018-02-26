import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/retry';
import {ROOT_URL} from "../config";

/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServiceProvider {
  rootUrl = ROOT_URL;

  constructor(public httpClient: HttpClient) {
  }

  upload(url: string, $event, data: (data: any) => void, error: (error: any) => void, fileKey: string, ...obj: any[]): void {
    const files = $event.target.files || $event.srcElement.files;
    console.log('文件路径', JSON.stringify(files));
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(fileKey, files[i]);
    }
    if (obj) {
      // console.log(JSON.stringify(obj));
      for (let i = 0; i < obj.length; i++) {
        console.log(JSON.stringify(obj[i]));
        // 这里拼接对象
        // formData.append("obj", obj[i].value);
      }
    }
    // console.log("files", files)
    // console.log("formData", formData)
    this.httpClient.post(this.rootUrl + url, formData).subscribe(data, error);
  }

  /**
   * @description post请求,失败后自动重新请求，默认重试3次
   * @param {string} url
   * @param {any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @param {number} retry
   */
  postRetry(url: string, body: any | any, data: (data: any) => void, error: (error: any) => void, retry: number): void {
    this.httpClient.post(this.rootUrl + url, body).retry(retry).subscribe(data, error);

  }

  /**
   * @description post请求
   * @param {string} url
   * @param {any | any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */
  post(url?: string, body?: any | null, data?: (data: any) => void, error?: (error: any) => void): void {
    this.httpClient.post(this.rootUrl + url, body).subscribe(data, error);
  }

  /**
   * @description get请求
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @return void
   */
  public get(url: string, data: (data: any) => void, error: (error: any) => void): void {
    this.httpClient.get(this.rootUrl + url).subscribe(data, error);
  }

  /**
   * @description get请求,失败后自动重新请求，默认重试3次
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @param {number} retry
   */
  getRetry(url: string, data: (data: any) => void, error: (error: any) => void, retry: number): void {
    if (!retry) {
      retry = 3; // 默认值为3
    }
    this.httpClient.get(this.rootUrl + url).retry(retry).subscribe(data, error);
  }
}
