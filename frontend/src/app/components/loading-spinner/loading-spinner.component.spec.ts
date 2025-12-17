import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent;
    let fixture: ComponentFixture<LoadingSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadingSpinnerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not display overlay when isLoading is false', () => {
        component.isLoading = false;
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.loading-overlay');
        expect(overlay).toBeNull();
    });

    it('should display overlay when isLoading is true', () => {
        component.isLoading = true;
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.loading-overlay');
        expect(overlay).toBeTruthy();
    });

    it('should display custom message', () => {
        component.isLoading = true;
        component.message = 'Custom loading message';
        fixture.detectChanges();

        const messageElement = fixture.nativeElement.querySelector('.loading-message');
        expect(messageElement.textContent).toContain('Custom loading message');
    });

    it('should display default message when not provided', () => {
        component.isLoading = true;
        fixture.detectChanges();

        const messageElement = fixture.nativeElement.querySelector('.loading-message');
        expect(messageElement.textContent).toContain('Loading...');
    });

    it('should display spinner element', () => {
        component.isLoading = true;
        fixture.detectChanges();

        const spinner = fixture.nativeElement.querySelector('.spinner');
        expect(spinner).toBeTruthy();
    });
});
