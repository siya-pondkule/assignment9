import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyListComponent } from './company-list.component';
import { CompanyFormComponent } from './company-form.component';

@Component({
  selector: 'app-root',
  template: `
    <h1 style="text-align: center; font-size: 2em; margin-bottom: 20px;">{{ title }}</h1>
    <div style="text-align: center; margin-bottom: 20px;">
      <button (click)="showTab = 'add'" [class.active]="showTab === 'add'"
              style="padding: 10px 20px; margin-right: 10px; font-size: 16px; background-color: #F2874A; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
        Add Details
      </button>
      <button (click)="showTab = 'registrations'" [class.active]="showTab === 'registrations'"
              style="padding: 10px 20px; font-size: 16px; background-color: #F2874A; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
        Registrations
      </button>
    </div>

    <div *ngIf="showTab === 'add'" style="margin-bottom: 30px;">
      <app-company-form (companyUpdated)="onCompanyUpdated($event)"></app-company-form>
    </div>
    <div *ngIf="showTab === 'registrations'">
      <app-company-list (companyUpdated)="onCompanyUpdated($event)"></app-company-list>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, CompanyListComponent, CompanyFormComponent]
})
export class AppComponent {
  title = 'Employee Details';
  showTab = 'add'; // Default tab is 'Add Details'

  onCompanyUpdated(updatedCompany: any) {
    // Handle the updated company details if necessary
  }
}
