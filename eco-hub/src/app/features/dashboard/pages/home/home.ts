import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartOptions,
  ChartType,
  ChartData,
  ChartConfiguration,
} from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Simulación de ventas mensuales',
      },
    },
  };

  public barChartLabels: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
  ];

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        label: 'Ventas 2025',
        backgroundColor: '#104D7E',
      },
    ],
  };

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
}
