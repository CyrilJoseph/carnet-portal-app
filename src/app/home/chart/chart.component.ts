import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, AngularMaterialModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() chartData: any[] = [];

  constructor(private router: Router) { }

  navigateToManageProvider(spid: number): void {
    this.router.navigate(['/service-provider', spid]);
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: any[] }): void {

    // if (active && active?.length > 0) {
    //   console.log(event);
    //   // You can add custom logic here for what happens when a segment is clicked
    //   // For example: this.router.navigate(['/carnets', label]);
    // }
  }

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number || 0;
            const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    }
  };

  public chartType: ChartType = 'pie';
  public chartPlugins = [];

  public chartConfigs: {
    title: string,
    spid: number,
    data: ChartData<'pie'>;
    colors: string[];
    options: ChartConfiguration['options'];
  }[] = [];

  ngOnChanges() {
    this.processChartData();
  }

  private processChartData(): void {
    this.chartConfigs = this.chartData.map(provider => {
      const statusColors = provider.CARNETSTATUS.map((status: string) => {
        if (status === 'Valid') return '#AFDC8F';
        if (status === 'Open Claim') return '#92C5F9';
        if (status === 'Possible Claim') return '#B6A6E9';
        if (status === 'Closed Claim') return '#F8AE54';
        return '#9E9E9E';
      });

      return {
        title: provider.Service_Provider_Name,
        spid: provider.SPID,
        data: {
          labels: provider.CARNETSTATUS,
          datasets: [{
            data: provider.Carnet_Count,
            backgroundColor: statusColors,
            hoverBackgroundColor: statusColors.map((c: any) => this.adjustBrightness(c, -20)),
            borderWidth: 1,
            borderColor: '#fff'
          }]
        },
        colors: statusColors,
        options: this.chartOptions
      };
    });
  }

  private adjustBrightness(color: string, percent: number): string {
    // Helper function to adjust color brightness
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }
}