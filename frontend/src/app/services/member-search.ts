import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SearchRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  businessUnit?: string;
  country?: string;
  sourceMemberId?: string;
  page: number;
  size: number;
}

export interface Member {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  businessUnit: string;
  country: string;
  sourceMemberId: string;
}

export interface SearchResponse {
  content: Member[];
  totalPages: number;
  totalElements: number;
  number: number; // current page
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class MemberSearchService {
  private apiUrl = 'https://localhost:8443/api/members/search';

  constructor(private http: HttpClient) { }

  search(request: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(this.apiUrl, request);
  }
}
