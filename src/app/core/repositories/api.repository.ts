import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Repository {
  private apiKey: string = environment.apiKey;
  private readonly endpoint = '/open';

  constructor(private apiService: ApiService) {}

  getCurrentExchangeRate(
    from_symbol: string,
    to_symbol: string
  ): Observable<any> {
    return this.apiService.get<any>(
      `${this.endpoint}/currentExchangeRate?apiKey=${this.apiKey}&from_symbol=${from_symbol}&to_symbol=${to_symbol}`
    );
  }

  getDailyExchangeRate(
    from_symbol: string,
    to_symbol: string
  ): Observable<any> {
    return this.apiService.get<any>(
      `${this.endpoint}/dailyExchangeRate?apiKey=${this.apiKey}&from_symbol=${from_symbol}&to_symbol=${to_symbol}`
    );
  }
}
