import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { Repository } from '../../core/repositories/api.repository';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private repository: Repository) {}

  title = 'exchange-brl';
  selectedCurrency: string = '';
  showCards = true;
  isFooterFixed = false;
  isExpanded = true;
  currentExchangeRate: {
    success?: boolean;
    lastUpdatedAt?: string;
    fromSymbol?: string;
    toSymbol?: string;
    exchangeRate?: number;
  } = {};
  dailyExchangeRate: {
    open: number;
    high: number;
    low: number;
    close: number;
    date: string;
    diff: number;
  }[] = [];

  onCurrencyChange() {
    console.log('Currency changed:', this.selectedCurrency);
  }

  onSearch() {
    try {
      this.repository
        .getCurrentExchangeRate(this.selectedCurrency, 'BRL')
        .subscribe((response) => {
          this.currentExchangeRate = response;
        });

      this.repository
        .getDailyExchangeRate(this.selectedCurrency, 'BRL')
        .subscribe((response) => {
          const currentDate = new Date();
          const data = response?.data ?? [];

          let filteredData = data.filter((record: any) => {
            const recordDate = new Date(record.date);
            const diffTime = currentDate.getTime() - recordDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            return diffDays <= 30;
          });

          filteredData = filteredData.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          const dailyWithDiff = filteredData.map((item: any, index: number) => {
            const previousClose =
              index > 0 ? filteredData[index - 1].close : item.close;
            const diff = item.close - previousClose;

            return {
              ...item,
              diff: parseFloat(diff.toFixed(4)),
            };
          });

          this.dailyExchangeRate = dailyWithDiff;
        });
    } catch (err) {
      console.error(err);
    }
  }

  toggleCards() {
    this.isExpanded = !this.isExpanded;
  }

  formatCurrency(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }

  formatToDateTime(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }
}
