import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CompanyFormComponent } from './company-form.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  standalone: true,
  imports: [CommonModule, CompanyFormComponent]
})
export class CompanyListComponent implements OnInit {
  companies: any[] = [];
  selectedCompany: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCompanies();
  }

  fetchCompanies() {
    // Fetch all companies from the API endpoint
    this.http.get('http://localhost:3000/companies').subscribe(
      (data: any) => {
        this.companies = data; // Assign the fetched data to companies array
      },
      error => {
        Swal.fire('Error', 'There was an issue fetching the companies.', 'error');
      }
    );
  }

  onEdit(company: any) {
    this.selectedCompany = company;
}

onDelete(company: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${company.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/companies/${company.id}`).subscribe(
          response => {
            Swal.fire('Deleted!', `${company.name} has been deleted.`, 'success');
            this.companies = this.companies.filter(c => c.id !== company.id);
          },
          error => {
            Swal.fire('Error', 'There was an issue deleting the company.', 'error');
          }
        );
      }
    });
}

onCompanyUpdated(updatedCompany: any) {
    if (updatedCompany.deleted) {
        this.companies = this.companies.filter(company => company.id !== updatedCompany.id);
    } else {
        const index = this.companies.findIndex(company => company.id === updatedCompany.id);
        if (index !== -1) {
            this.companies[index] = updatedCompany;
        } else {
            this.companies.push(updatedCompany);
        }
    }
}

  
}
