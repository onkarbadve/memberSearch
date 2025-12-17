import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-validation-errors',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="validation-errors" *ngIf="control && control.invalid && (control.dirty || control.touched)">
      <div class="error-message" *ngIf="control.errors?.['required']">
        {{ fieldName }} is required
      </div>
      <div class="error-message" *ngIf="control.errors?.['minlength']">
        {{ fieldName }} must be at least {{ control.errors?.['minlength'].requiredLength }} characters
      </div>
      <div class="error-message" *ngIf="control.errors?.['maxlength']">
        {{ fieldName }} must not exceed {{ control.errors?.['maxlength'].requiredLength }} characters
      </div>
      <div class="error-message" *ngIf="control.errors?.['pattern']">
        {{ fieldName }} contains invalid characters
      </div>
      <div class="error-message" *ngIf="control.errors?.['email']">
        Please enter a valid email address
      </div>
    </div>
  `,
    styles: [`
    .validation-errors {
      margin-top: 4px;
    }

    .error-message {
      color: #f5576c;
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .error-message::before {
      content: '⚠';
      font-size: 14px;
    }
  `]
})
export class ValidationErrorsComponent {
    @Input() control: AbstractControl | null = null;
    @Input() fieldName: string = 'This field';
}
