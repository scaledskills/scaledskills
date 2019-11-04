import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private _HttpClient: HttpClient) {
  }
  apiUrlName() {
    let url: string;
    const origin = window.location.origin;
    if (origin.indexOf("localhost") > -1) {
      url = 'http://hajorel712-001-site1.ftempurl.com/';
    } else if (origin.indexOf("scaledskills") > -1) {
      url = 'http://hajorel712-001-site1.ftempurl.com/';
    }
    return url;
  }

  httpCall(url: string, method: string, data: any, params: any) {
    let apiUrl = this.apiUrlName() + url;
    switch (method) {
      case 'POST':
        return this._HttpClient.post<any>(apiUrl, data, { 'headers': {}, 'params': params})
        break;
      case 'PUT':
        return this._HttpClient.put<any>(apiUrl, data, { 'headers': {}, 'params': params })
        break;
      case 'DELETE':
        return this._HttpClient.delete<any>(apiUrl, { 'headers': {}, 'params': params })
        break;
      case 'GET':
        switch (params) {
          case null:
            return this._HttpClient.get<any[]>(apiUrl, { 'headers': {}, 'params': params })
            break;
          default:
            return this._HttpClient.get<any[]>(apiUrl, { 'headers': {}, 'params': params });
        }
        break;
      default:
        return
    }
  }
}
