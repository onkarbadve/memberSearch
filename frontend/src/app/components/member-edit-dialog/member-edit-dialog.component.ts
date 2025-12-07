import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../services/member-search';

@Component({
    selector: 'app-member-edit-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Edit Member</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>
        
        <form [formGroup]="editForm" (ngSubmit)="onSave()" class="modal-body">
          <div class="form-group">
            <label>First Name</label>
            <input formControlName="firstName" type="text" />
          </div>
          <div class="form-group">
            <label>Middle Name</label>
            <input formControlName="middleName" type="text" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input formControlName="lastName" type="text" />
          </div>
          <div class="form-group">
            <label>Business Unit</label>
            <input formControlName="businessUnit" type="text" />
          </div>
          <div class="form-group">
            <label>Country</label>
            <input formControlName="country" type="text" />
          </div>
           <div class="form-group">
            <label>Source Member ID</label>
            <input formControlName="sourceMemberId" type="text" />
          </div>
        </form>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button type="button" class="btn-save" (click)="onSave()" [disabled]="editForm.invalid">Save</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    .modal-container {
      background: white;
      padding: 0;
      border-radius: 12px;
      width: 500px;
      max-width: 90%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }
    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h2 { margin: 0; font-size: 1.25rem; color: #333; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; }
    
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.875rem; font-weight: 500; color: #555; }
    .form-group input { 
      padding: 0.75rem; 
      border: 1px solid #ddd; 
      border-radius: 6px; 
      font-size: 1rem;
    }
    .form-group input:focus { outline: none; border-color: #2563eb; }

    .modal-footer {
      padding: 1rem 1.5rem;
      background: #f9fafb;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    .btn-cancel {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      color: #374151;
    }
    
    .btn-save {
      padding: 0.5rem 1rem;
      border: none;
      background: #2563eb;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-save:hover { background: #1d4ed8; }
    .btn-save:disabled { background: #93c5fd; cursor: not-allowed; }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class MemberEditDialogComponent implements OnInit {
    @Input() member: Member | null = null;
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<Member>();

    editForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.editForm = this.fb.group({
            id: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            businessUnit: ['', Validators.required],
            country: ['', Validators.required],
            sourceMemberId: ['', Validators.required],
            entitled: [false]
        });
    }

    ngOnInit() { }

    ngOnChanges() {
        if (this.member) {
            this.editForm.patchValue(this.member);
        }
    }

    onCancel() {
        this.close.emit();
    }

    onSave() {
        if (this.editForm.valid) {
            this.save.emit(this.editForm.value);
        }
    }
}
