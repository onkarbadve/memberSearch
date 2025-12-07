import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Member, MemberSearchService, SearchRequest } from '../../services/member-search';
import { SearchResultsComponent } from '../search-results/search-results';

// Custom Validator: (First OR Last) AND BusinessUnit REQUIRED
const searchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const firstName = control.get('firstName')?.value;
  const lastName = control.get('lastName')?.value;
  const businessUnits = control.get('businessUnits')?.value;

  const hasName = (firstName && firstName.trim() !== '') || (lastName && lastName.trim() !== '');
  const hasBu = businessUnits && businessUnits.length > 0;

  return hasName && hasBu ? null : { invalidSearch: true };
};

@Component({
  selector: 'app-member-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchResultsComponent],
  template: `
    <div class="search-container">
      <h2>Member Search</h2>
      
      <div *ngIf="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="searchForm.errors?.['invalidSearch'] && searchForm.touched" class="warning-banner">
         Validation Error: You must provide (First Name OR Last Name) AND select at least one Business Unit.
      </div>

      <div class="search-card">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input formControlName="firstName" type="text" placeholder="e.g. John" />
            </div>
            
            <div class="form-group">
              <label>Middle Name</label>
              <input formControlName="middleName" type="text" />
            </div>

            <div class="form-group">
              <label>Last Name</label>
              <input formControlName="lastName" type="text" placeholder="e.g. Doe" />
            </div>

            <!-- Custom Multi-select Dropdown -->
            <div class="form-group relative">
              <label>Business Unit <span class="required">*</span></label>
              <div class="dropdown-trigger" (click)="toggleBuDropdown()">
                 {{ getSelectedBuLabel() }}
                 <span class="arrow">▼</span>
              </div>
              
              <div class="dropdown-menu" *ngIf="showBuDropdown">
                <label *ngFor="let bu of businessUnitOptions" class="checkbox-item">
                  <input type="checkbox" 
                         [checked]="isBuSelected(bu)" 
                         (change)="onBuChange($event, bu)" />
                  {{ bu }}
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Country</label>
              <input formControlName="country" type="text" />
            </div>

            <div class="form-group">
                <label>Source Member ID</label>
                <input formControlName="sourceMemberId" type="text" />
              </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" (click)="onReset()">Reset</button>
            <button type="submit" class="btn-primary" [disabled]="isLoading || searchForm.invalid">
              {{ isLoading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>
      </div>

      <app-search-results 
        *ngIf="hasSearched"
        [rowData]="searchResults"
        [totalCount]="totalCount"
        [currentPage]="currentPage"
        [pageSize]="pageSize"
        (pageChange)="onPageChange($event)"
        (refresh)="onSearch(false)"> 
      </app-search-results>

      <div *ngIf="false">
         Debug: Searched={{hasSearched}}, Count={{searchResults.length}}
         First={{searchResults[0] | json}}
      </div>
    </div>
  `,
  styleUrls: ['./member-search.css']
})
export class MemberSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: Member[] = [];
  totalCount: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasSearched: boolean = false;
  errorMessage: string = '';

  // Dropdown Logic
  businessUnitOptions = ['IT', 'HR', 'Admin', 'Sales'];
  showBuDropdown = false;

  constructor(
    private fb: FormBuilder,
    private memberSearchService: MemberSearchService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      businessUnits: [[]], // Array of strings
      country: [''],
      sourceMemberId: ['']
    }, { validators: searchValidator });
  }

  ngOnInit(): void { }

  // Toggle Dropdown
  toggleBuDropdown() {
    this.showBuDropdown = !this.showBuDropdown;
  }

  // Close dropdown when clicking outside (simple logic handling here or simple reset)
  // For now, toggle is enough.

  isBuSelected(bu: string): boolean {
    const selected = this.searchForm.get('businessUnits')?.value as string[];
    return selected ? selected.includes(bu) : false;
  }

  onBuChange(event: any, bu: string) {
    const isChecked = event.target.checked;
    const currentSelected = (this.searchForm.get('businessUnits')?.value || []) as string[];

    let newSelected: string[];
    if (isChecked) {
      newSelected = [...currentSelected, bu];
    } else {
      newSelected = currentSelected.filter(item => item !== bu);
    }

    this.searchForm.patchValue({ businessUnits: newSelected });
    this.searchForm.updateValueAndValidity(); // Trigget validation
  }

  getSelectedBuLabel(): string {
    const selected = (this.searchForm.get('businessUnits')?.value || []) as string[];
    if (selected.length === 0) return 'Select Business Units...';
    if (selected.length <= 2) return selected.join(', ');
    return `${selected.length} Selected`;
  }

  onSearch(resetPage: boolean = true) {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    if (resetPage) {
      this.currentPage = 0;
    }

    this.errorMessage = '';
    const formValues = this.searchForm.value;
    const request: SearchRequest = {
      ...formValues,
      page: this.currentPage,
      size: this.pageSize
    };

    console.log('Sending search request:', request);
    this.isLoading = true;
    this.memberSearchService.search(request).subscribe({
      next: (response) => {
        console.log('Search response received:', response);
        this.searchResults = response.content;
        this.totalCount = response.totalElements;
        this.isLoading = false;
        this.hasSearched = true;
        this.cdr.detectChanges(); // FORCE UPDATE
      },
      error: (err) => {
        console.error('Search failed', err);
        this.isLoading = false;
        this.errorMessage = 'Search failed: ' + (err.message || 'Unknown error');
        this.cdr.detectChanges(); // FORCE UPDATE
      }
    });
  }

  onReset() {
    this.searchForm.reset({ businessUnits: [] });
    this.clearResults();
  }

  onCancel() {
    this.clearResults();
  }

  clearResults() {
    this.searchResults = [];
    this.totalCount = 0;
    this.currentPage = 0;
    this.hasSearched = false;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.onSearch(false);
  }
}
