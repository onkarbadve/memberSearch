import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MemberSearchComponent } from './member-search';
import { MemberSearchService } from '../../services/member-search';
import { ToastService } from '../../services/toast.service';
import { of, throwError } from 'rxjs';

describe('MemberSearchComponent', () => {
    let component: MemberSearchComponent;
    let fixture: ComponentFixture<MemberSearchComponent>;
    let memberSearchService: jasmine.SpyObj<MemberSearchService>;
    let toastService: jasmine.SpyObj<ToastService>;

    beforeEach(async () => {
        const memberSearchServiceSpy = jasmine.createSpyObj('MemberSearchService', ['search', 'aiSearch', 'updateMember']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'info', 'warning']);

        await TestBed.configureTestingModule({
            imports: [MemberSearchComponent, ReactiveFormsModule, HttpClientTestingModule],
            providers: [
                { provide: MemberSearchService, useValue: memberSearchServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberSearchComponent);
        component = fixture.componentInstance;
        memberSearchService = TestBed.inject(MemberSearchService) as jasmine.SpyObj<MemberSearchService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
        expect(component.searchForm.get('firstName')?.value).toBe('');
        expect(component.searchForm.get('lastName')?.value).toBe('');
        expect(component.searchForm.get('businessUnits')?.value).toEqual([]);
    });

    it('should validate firstName pattern', () => {
        const firstNameControl = component.searchForm.get('firstName');

        firstNameControl?.setValue('123');
        expect(firstNameControl?.hasError('pattern')).toBe(true);

        firstNameControl?.setValue('John');
        expect(firstNameControl?.hasError('pattern')).toBe(false);
    });

    it('should validate firstName minLength', () => {
        const firstNameControl = component.searchForm.get('firstName');

        firstNameControl?.setValue('J');
        expect(firstNameControl?.hasError('minlength')).toBe(true);

        firstNameControl?.setValue('Jo');
        expect(firstNameControl?.hasError('minlength')).toBe(false);
    });

    it('should toggle AI mode', () => {
        expect(component.isAiMode).toBe(false);

        const event = { target: { checked: true } };
        component.toggleAiMode(event);

        expect(component.isAiMode).toBe(true);
        expect(component.hasSearched).toBe(false);
    });

    it('should perform search successfully', () => {
        const mockResponse = {
            content: [{ id: 1, firstName: 'John', lastName: 'Doe', businessUnit: 'IT', country: 'USA', sourceMemberId: 'M001', entitled: true }],
            totalElements: 1,
            totalPages: 1,
            number: 0,
            size: 10
        };

        memberSearchService.search.and.returnValue(of(mockResponse));

        component.searchForm.patchValue({
            firstName: 'John',
            businessUnits: ['IT']
        });

        component.onSearch();

        expect(memberSearchService.search).toHaveBeenCalled();
        expect(component.searchResults.length).toBe(1);
        expect(component.totalCount).toBe(1);
        expect(toastService.success).toHaveBeenCalledWith('Found 1 member');
    });

    it('should handle search error', () => {
        const mockError = { error: { message: 'Search failed' } };
        memberSearchService.search.and.returnValue(throwError(() => mockError));

        component.searchForm.patchValue({
            firstName: 'John',
            businessUnits: ['IT']
        });

        component.onSearch();

        expect(toastService.error).toHaveBeenCalledWith('Search failed');
        expect(component.isLoading).toBe(false);
    });

    it('should not submit invalid form', () => {
        component.searchForm.patchValue({
            firstName: '123' // Invalid pattern
        });

        component.onSearch();

        expect(memberSearchService.search).not.toHaveBeenCalled();
    });

    it('should reset form', () => {
        component.searchForm.patchValue({
            firstName: 'John',
            lastName: 'Doe'
        });
        component.searchResults = [{ id: 1, firstName: 'John', lastName: 'Doe', businessUnit: 'IT', country: 'USA', sourceMemberId: 'M001', entitled: true }];

        component.onReset();

        expect(component.searchForm.get('firstName')?.value).toBe('');
        expect(component.searchResults.length).toBe(0);
    });

    it('should handle AI search', () => {
        const mockResponse = {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 10
        };

        memberSearchService.aiSearch.and.returnValue(of(mockResponse));

        component.aiQuery = 'find engineers in USA';
        component.onAiSearch();

        expect(memberSearchService.aiSearch).toHaveBeenCalledWith('find engineers in USA', 0, 10);
        expect(toastService.success).toHaveBeenCalledWith('Found 0 members');
    });

    it('should toggle business unit dropdown', () => {
        expect(component.showBuDropdown).toBe(false);

        component.toggleBuDropdown();
        expect(component.showBuDropdown).toBe(true);

        component.toggleBuDropdown();
        expect(component.showBuDropdown).toBe(false);
    });

    it('should select and deselect business units', () => {
        const event = { target: { checked: true } };
        component.onBuChange(event, 'IT');

        expect(component.searchForm.get('businessUnits')?.value).toContain('IT');

        const deselectEvent = { target: { checked: false } };
        component.onBuChange(deselectEvent, 'IT');

        expect(component.searchForm.get('businessUnits')?.value).not.toContain('IT');
    });
});
