import { Component } from '@angular/core';
import { HomeService } from '../core/services/home.service';
import { AngularMaterialModule } from '../shared/module/angular-material.module';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-home',
  imports: [AngularMaterialModule, ChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  carnetData: any[] = [];
  isLoading = false;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.loadCarnetData();
  }

  loadCarnetData(): void {
    this.isLoading = true;
    this.homeService.getCarnetSummaryData().subscribe({
      next: (data) => {
        this.carnetData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading carnet data:', error);
        this.isLoading = false;
      }
    });
  }

  exportData() {
    // this.dataService.exportCarnetData().subscribe({
    //   next: (blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'carnet_data.xlsx';
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error: (error) => console.error('Error exporting data:', error)
    // });
  }
}