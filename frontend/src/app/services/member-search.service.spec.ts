import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MemberSearchService, SearchRequest, Member } from './member-search';
import { environment } from '../../environments/environment';

describe('MemberSearchService', () => {
    let service: MemberSearchService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MemberSearchService]
        });
        service = TestBed.inject(MemberSearchService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send POST request for search', () => {
        const mockRequest: SearchRequest = {
            firstName: 'John',
            businessUnits: ['IT'],
            page: 0,
            size: 10
        };

        const mockResponse = {
            content: [
                { id: 1, firstName: 'John', lastName: 'Doe', businessUnit: 'IT', country: 'USA', sourceMemberId: 'M001', entitled: true }
            ],
            totalElements: 1,
            totalPages: 1,
            number: 0,
            size: 10
        };

        service.search(mockRequest).subscribe(response => {
            expect(response.content.length).toBe(1);
            expect(response.content[0].firstName).toBe('John');
            expect(response.totalElements).toBe(1);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/members/search`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRequest);
        req.flush(mockResponse);
    });

    it('should send POST request for AI search', () => {
        const query = 'find engineers in USA';
        const mockResponse = {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 10
        };

        service.aiSearch(query, 0, 10).subscribe(response => {
            expect(response.totalElements).toBe(0);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/members/search/ai?page=0&size=10`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe(query);
        req.flush(mockResponse);
    });

    it('should send PUT request for update', () => {
        const memberId = 1;
        const updatedMember: Member = {
            id: 1,
            firstName: 'Jane',
            lastName: 'Doe',
            businessUnit: 'Sales',
            country: 'UK',
            sourceMemberId: 'M002',
            entitled: true
        };

        service.updateMember(memberId, updatedMember).subscribe(response => {
            expect(response.firstName).toBe('Jane');
            expect(response.businessUnit).toBe('Sales');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/members/${memberId}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedMember);
        req.flush(updatedMember);
    });

    it('should handle error response', () => {
        const mockRequest: SearchRequest = {
            page: 0,
            size: 10
        };

        service.search(mockRequest).subscribe(
            () => fail('should have failed with 400 error'),
            (error) => {
                expect(error.status).toBe(400);
            }
        );

        const req = httpMock.expectOne(`${environment.apiUrl}/api/members/search`);
        req.flush('Invalid request', { status: 400, statusText: 'Bad Request' });
    });
});
