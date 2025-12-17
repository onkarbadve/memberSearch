import { TestBed } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit success toast', (done) => {
        service.toast$.subscribe((toast: Toast) => {
            expect(toast.message).toBe('Success message');
            expect(toast.type).toBe('success');
            expect(toast.duration).toBe(3000);
            done();
        });

        service.success('Success message');
    });

    it('should emit error toast with custom duration', (done) => {
        service.toast$.subscribe((toast: Toast) => {
            expect(toast.message).toBe('Error message');
            expect(toast.type).toBe('error');
            expect(toast.duration).toBe(5000);
            done();
        });

        service.error('Error message');
    });

    it('should emit info toast', (done) => {
        service.toast$.subscribe((toast: Toast) => {
            expect(toast.message).toBe('Info message');
            expect(toast.type).toBe('info');
            expect(toast.duration).toBe(3000);
            done();
        });

        service.info('Info message');
    });

    it('should emit warning toast', (done) => {
        service.toast$.subscribe((toast: Toast) => {
            expect(toast.message).toBe('Warning message');
            expect(toast.type).toBe('warning');
            expect(toast.duration).toBe(4000);
            done();
        });

        service.warning('Warning message');
    });

    it('should allow custom duration for success toast', (done) => {
        service.toast$.subscribe((toast: Toast) => {
            expect(toast.duration).toBe(5000);
            done();
        });

        service.success('Custom duration', 5000);
    });
});
