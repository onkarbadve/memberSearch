import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from './toast.component';
import { of } from 'rxjs';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let toastService: jasmine.SpyObj<ToastService>;

    beforeEach(async () => {
        const toastServiceSpy = jasmine.createSpyObj('ToastService', [], {
            toast$: of({ message: 'Test message', type: 'success', duration: 3000 })
        });

        await TestBed.configureTestingModule({
            imports: [ToastComponent],
            providers: [
                { provide: ToastService, useValue: toastServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display toast when service emits', (done) => {
        component.ngOnInit();

        setTimeout(() => {
            expect(component.toasts.length).toBe(1);
            expect(component.toasts[0].message).toBe('Test message');
            expect(component.toasts[0].type).toBe('success');
            done();
        }, 100);
    });

    it('should remove toast after duration', (done) => {
        component.ngOnInit();

        setTimeout(() => {
            expect(component.toasts.length).toBe(1);
        }, 100);

        setTimeout(() => {
            expect(component.toasts.length).toBe(0);
            done();
        }, 3200);
    });

    it('should return correct icon for success type', () => {
        expect(component.getIcon('success')).toBe('✓');
    });

    it('should return correct icon for error type', () => {
        expect(component.getIcon('error')).toBe('✕');
    });

    it('should return correct icon for info type', () => {
        expect(component.getIcon('info')).toBe('ℹ');
    });

    it('should return correct icon for warning type', () => {
        expect(component.getIcon('warning')).toBe('⚠');
    });

    it('should unsubscribe on destroy', () => {
        component.ngOnInit();
        spyOn(component['subscription']!, 'unsubscribe');
        component.ngOnDestroy();
        expect(component['subscription']!.unsubscribe).toHaveBeenCalled();
    });
});
