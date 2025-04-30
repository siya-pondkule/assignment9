import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CompanyFormComponent implements OnInit {
  @Input() company: any;
  @Output() companyUpdated = new EventEmitter<any>(); // Emit the updated company back to the parent
  companyForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.companyForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      location: ['', Validators.required],
      employee_count: [0, [Validators.required, Validators.min(1)]],
      founded_year: ['', Validators.required],
      industry: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.company) {
      this.isEditMode = true;
      this.companyForm.patchValue(this.company);
    }
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const endpoint = this.isEditMode
        ? `http://localhost:3000/companies/${this.companyForm.value.id}`
        : 'http://localhost:3000/companies';
      const method = this.isEditMode ? 'put' : 'post';

      this.http[method](endpoint, this.companyForm.value).subscribe(
        response => {
          Swal.fire(
            this.isEditMode ? 'Updated!' : 'Saved!',
            `Company ${this.isEditMode ? 'updated' : 'saved'} successfully.`,
            'success'
          );
          this.companyUpdated.emit(response); // Emit the updated company to parent
        },
        error => {
          Swal.fire('Error', 'There was an issue saving/updating the company.', 'error');
        }
      );
    }
  }

  onDelete() {
    if (this.isEditMode && this.company?.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete ${this.company.name}. This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`http://localhost:3000/companies/${this.company.id}`).subscribe(
            response => {
              Swal.fire('Deleted!', `${this.company.name} has been deleted.`, 'success');
              this.companyUpdated.emit({ id: this.company.id, deleted: true }); // Emit deleted status
            },
            error => {
              Swal.fire('Error', 'There was an issue deleting the company.', 'error');
            }
          );
        }
      });
    }
  }
}
