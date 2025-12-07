import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Member, MemberSearchService, SearchRequest } from '../../services/member-search';
import { SearchResultsComponent } from '../search-results/search-results';

@Component({
  selector: 'app-member-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchResultsComponent],
  templateUrl: './member-search.html',
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

  constructor(
    private fb: FormBuilder,
    private memberSearchService: MemberSearchService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      businessUnit: [''],
      country: [''],
      sourceMemberId: ['']
    });
  }

  ngOnInit(): void { }

  onSearch(resetPage: boolean = true) {
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
    this.searchForm.reset();
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
