import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {
    private baseUrl: string = `${environment.apiBaseUrl}/api/default`;
    private urlPrintPDF: string = `${this.baseUrl}/exportpdf`;
    
  

  constructor(private http: HttpClient) {

  }

  public printPDF(data: any): Observable<any> {
    return this.http.post(this.urlPrintPDF, data);
  }
//   public getAll(): Observable<any>{
//     return this.http.get(this.urlGetAll);
//   }
//   public getById(id: string): Observable<any>{
//     return this.http.get(`${this.urlGetBuId}/${id}`);
//   }

//   public getJSON(url: string): Observable<any> {
//     return this.http.get(url);
//   }
}