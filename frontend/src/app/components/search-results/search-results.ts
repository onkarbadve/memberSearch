import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, GridApi, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { Member } from '../../services/member-search';
import { MemberSearchService } from '../../services/member-search';
import { MemberEditDialogComponent } from '../member-edit-dialog/member-edit-dialog.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MemberEditDialogComponent],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent implements OnChanges {
  @Input() rowData: Member[] = [];
  @Input() totalCount: number = 0;
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>(); // Request parent to refresh

  private gridApi!: GridApi;

  // Edit Modal State
  isEditModalOpen = false;
  selectedMember: Member | null = null;

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'businessUnit', headerName: 'Business Unit', width: 150 },
    { field: 'country', headerName: 'Country', width: 100 },
    { field: 'sourceMemberId', headerName: 'Source ID', width: 120 },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: () => {
        return '<button class="action-btn-edit">Edit</button>';
      },
      cellClass: 'actions-cell',
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(private memberSearchService: MemberSearchService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Inputs updated automatically
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.field === 'actions') {
      this.openEditModal(event.data);
    }
  }

  openEditModal(member: Member) {
    this.selectedMember = { ...member }; // Clone to avoid direct mutation
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedMember = null;
  }

  onSaveMember(updatedMember: Member) {
    if (!updatedMember.id) return;

    this.memberSearchService.updateMember(updatedMember.id, updatedMember).subscribe({
      next: (result) => {
        console.log('Member updated:', result);
        this.closeEditModal();
        this.refresh.emit(); // Tell parent to reload data
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update member.');
      }
    });
  }

  // Pagination Logic
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onFirst() {
    if (this.currentPage > 0) {
      this.pageChange.emit(0);
    }
  }

  onPrevious() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNext() {
    if ((this.currentPage + 1) * this.pageSize < this.totalCount) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onLast() {
    const lastPage = Math.max(0, this.totalPages - 1);
    if (this.currentPage < lastPage) {
      this.pageChange.emit(lastPage);
    }
  }
}
