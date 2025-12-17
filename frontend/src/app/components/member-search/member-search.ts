import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, ValidatorFn, AbstractControl, ValidationErrors, FormsModule, Validators } from '@angular/forms';
import { Member, MemberSearchService, SearchRequest } from '../../services/member-search';
import { SearchResultsComponent } from '../search-results/search-results';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ToastService } from '../../services/toast.service';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearchResultsComponent, LoadingSpinnerComponent, ValidationErrorsComponent],
  template: `
    <div class="search-container">
      <div class="header-row">
          <h2>Member Search</h2>
          <div class="mode-toggle">
              <label class="switch">
                <input type="checkbox" (change)="toggleAiMode($event)">
                <span class="slider round"></span>
              </label>
              <span class="mode-label">{{ isAiMode ? '✨ AI Mode' : 'Standard Mode' }}</span>
          </div>
      </div>
      
      <div *ngIf="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="!isAiMode && searchForm.errors?.['invalidSearch'] && searchForm.touched" class="warning-banner">
         Validation Error: You must provide (First Name OR Last Name) AND select at least one Business Unit.
      </div>

      <!-- STANDARD SEARCH CARD -->
      <div class="search-card" *ngIf="!isAiMode">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input formControlName="firstName" type="text" placeholder="e.g. John" 
                     [class.invalid]="searchForm.get('firstName')?.invalid && searchForm.get('firstName')?.touched"
                     [class.valid]="searchForm.get('firstName')?.valid && searchForm.get('firstName')?.touched" />
              <app-validation-errors [control]="searchForm.get('firstName')" fieldName="First name"></app-validation-errors>
            </div>
            
            <div class="form-group">
              <label>Middle Name</label>
              <input formControlName="middleName" type="text" 
                     [class.invalid]="searchForm.get('middleName')?.invalid && searchForm.get('middleName')?.touched"
                     [class.valid]="searchForm.get('middleName')?.valid && searchForm.get('middleName')?.touched" />
              <app-validation-errors [control]="searchForm.get('middleName')" fieldName="Middle name"></app-validation-errors>
            </div>

            <div class="form-group">
              <label>Last Name</label>
              <input formControlName="lastName" type="text" placeholder="e.g. Doe" 
                     [class.invalid]="searchForm.get('lastName')?.invalid && searchForm.get('lastName')?.touched"
                     [class.valid]="searchForm.get('lastName')?.valid && searchForm.get('lastName')?.touched" />
              <app-validation-errors [control]="searchForm.get('lastName')" fieldName="Last name"></app-validation-errors>
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
              <input formControlName="country" type="text" 
                     [class.invalid]="searchForm.get('country')?.invalid && searchForm.get('country')?.touched"
                     [class.valid]="searchForm.get('country')?.valid && searchForm.get('country')?.touched" />
              <app-validation-errors [control]="searchForm.get('country')" fieldName="Country"></app-validation-errors>
            </div>

            <div class="form-group">
                <label>Source Member ID</label>
                <input formControlName="sourceMemberId" type="text" 
                       [class.invalid]="searchForm.get('sourceMemberId')?.invalid && searchForm.get('sourceMemberId')?.touched"
                       [class.valid]="searchForm.get('sourceMemberId')?.valid && searchForm.get('sourceMemberId')?.touched" />
                <app-validation-errors [control]="searchForm.get('sourceMemberId')" fieldName="Source Member ID"></app-validation-errors>
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

      <!-- AI SEARCH CARD -->
      <div class="search-card ai-card" *ngIf="isAiMode">
          <div class="ai-card-content"> <!-- Wrapper for border effect -->
            <div class="ai-input-group">
                <textarea 
                  [(ngModel)]="aiQuery" 
                  placeholder="✨ Ask the database..."
                  rows="3"
                  class="ai-input"></textarea>
                <button class="btn-ai" (click)="onAiSearch()" [disabled]="isLoading || !aiQuery.trim()">
                    <span *ngIf="!isLoading">✨</span>
                    {{ isLoading ? 'Thinking...' : 'Generate Search' }}
                </button>
            </div>
            <p class="ai-hint">Try: <span>"Show me all Sales members in UK"</span></p>
          </div>
      </div>

      <app-search-results 
        *ngIf="hasSearched"
        [rowData]="searchResults"
        [totalCount]="totalCount"
        [currentPage]="currentPage"
        [pageSize]="pageSize"
        (pageChange)="onPageChange($event)"
        (refresh)="onRefresh()"> 
      </app-search-results>

      <app-loading-spinner [isLoading]="isLoading" [message]="loadingMessage"></app-loading-spinner>

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
  loadingMessage: string = 'Searching...';

  // AI Mode State
  isAiMode = false;
  aiQuery = '';

  // Dropdown Logic
  businessUnitOptions = ['IT', 'HR', 'Admin', 'Sales'];
  showBuDropdown = false;

  constructor(
    private fb: FormBuilder,
    private memberSearchService: MemberSearchService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    this.searchForm = this.fb.group({
      firstName: ['', [
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s'-]+$/)
      ]],
      middleName: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s'-]+$/)
      ]],
      lastName: ['', [
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s'-]+$/)
      ]],
      businessUnits: [[]], // Array of strings
      country: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      sourceMemberId: ['', Validators.maxLength(50)]
    }, { validators: searchValidator });
  }

  ngOnInit(): void { }

  toggleAiMode(event: any) {
    this.isAiMode = event.target.checked;
    this.hasSearched = false;
    this.errorMessage = '';
    this.searchResults = [];
  }

  // Toggle Dropdown
  toggleBuDropdown() {
    this.showBuDropdown = !this.showBuDropdown;
  }

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
    this.executeSearch(this.searchForm.value, resetPage);
  }

  onAiSearch(resetPage: boolean = true) {
    if (!this.aiQuery.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = false;

    if (resetPage) {
      this.currentPage = 0;
    }

    this.memberSearchService.aiSearch(this.aiQuery, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.handleResponse(response);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private executeSearch(formValues: any, resetPage: boolean) {
    if (resetPage) {
      this.currentPage = 0;
    }

    this.errorMessage = '';
    const request: SearchRequest = {
      ...formValues,
      page: this.currentPage,
      size: this.pageSize
    };

    console.log('Sending search request:', request);
    this.isLoading = true;
    this.memberSearchService.search(request).subscribe({
      next: (response) => this.handleResponse(response),
      error: (err) => this.handleError(err)
    });
  }

  private handleResponse(response: any) {
    console.log('Search response received:', response);
    this.searchResults = response.content;
    this.totalCount = response.totalElements;
    this.isLoading = false;
    this.hasSearched = true;

    // Show success toast
    const count = response.totalElements;
    this.toastService.success(`Found ${count} member${count !== 1 ? 's' : ''}`);

    this.cdr.detectChanges();
  }

  private handleError(err: any) {
    console.error('Search failed', err);
    this.isLoading = false;

    // Extract error message from backend error response
    let errorMsg = 'Search failed';
    if (err.error?.message) {
      errorMsg = err.error.message;
    } else if (err.message) {
      errorMsg = err.message;
    }

    this.errorMessage = errorMsg;
    this.toastService.error(errorMsg);

    this.cdr.detectChanges();
  }

  onRefresh() {
    // Re-run the last active search type
    if (this.isAiMode) {
      this.onAiSearch(false);
    } else {
      this.onSearch(false);
    }
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
    // For pagination, if AI mode is on, we need to support pagination for AI queries too.
    // However, the current simple implementation re-submits string.
    // Ideally we would state-track parameters. For now, simple re-submit is fine.
    if (this.isAiMode) {
      this.onAiSearch(false);
    } else {
      this.onSearch(false);
    }
  }
}
