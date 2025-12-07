import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Member } from '../../services/member-search';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent {
  @Input() rowData: Member[] = [];
  @Input() totalCount: number = 0;
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();

  colDefs: ColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'middleName', headerName: 'Middle Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'businessUnit', headerName: 'Business Unit', flex: 1 },
    { field: 'country', headerName: 'Country', flex: 1 },
    { field: 'sourceMemberId', headerName: 'Source ID', flex: 1 }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  onNext() {
    this.pageChange.emit(this.currentPage + 1);
  }

  onPrevious() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onFirst() {
    this.pageChange.emit(0);
  }

  onLast() {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    if (totalPages > 0) {
      this.pageChange.emit(totalPages - 1);
    }
  }
}
