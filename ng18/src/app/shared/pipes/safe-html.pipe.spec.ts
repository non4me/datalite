import {TestBed} from '@angular/core/testing';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeHtmlPipe} from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
    let pipe: SafeHtmlPipe;
    let sanitizer: jasmine.SpyObj<DomSanitizer>;

    beforeEach(() => {
        const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

        TestBed.configureTestingModule({
            providers: [
                SafeHtmlPipe,
                {provide: DomSanitizer, useValue: sanitizerSpy}
            ]
        });

        pipe = TestBed.inject(SafeHtmlPipe);
        sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    });

    it('should create the pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('should sanitize input using default options', () => {
        const inputHtml = '<p>Valid content</p>';
        sanitizer.bypassSecurityTrustHtml.and.returnValue(inputHtml);

        const result = pipe.transform(inputHtml);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(inputHtml);
        expect(result).toBe(inputHtml);
    });

    it('should remove disallowed tags and attributes', () => {
        const inputHtml = '<script>alert(1)</script><p onclick="hack()">Test</p>';
        const sanitizedOutput = '<p>Test</p>'; // Expected after sanitization
        sanitizer.bypassSecurityTrustHtml.and.returnValue(sanitizedOutput);

        const result = pipe.transform(inputHtml);
        expect(result).toBe(sanitizedOutput);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(sanitizedOutput);
    });

    it('should truncate content exceeding maxLength', () => {
        const inputHtml = 'a'.repeat(10500); // Input exceeding default maxLength (10000)
        const truncatedOutput = 'a'.repeat(10000) + '...'; // Expected truncated output
        sanitizer.bypassSecurityTrustHtml.and.returnValue(truncatedOutput);

        const result = pipe.transform(inputHtml);
        expect(result).toBe(truncatedOutput);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(truncatedOutput);
    });

    it('should remove script tags and event handlers', () => {
        const inputHtml = '<script>alert(1)</script><p onclick="hack()">Test</p>';
        const sanitizedOutput = '<p>Test</p>'; // Expected after removing <script> and onclick
        sanitizer.bypassSecurityTrustHtml.and.returnValue(sanitizedOutput);

        const result = pipe.transform(inputHtml);
        expect(result).toBe(sanitizedOutput);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(sanitizedOutput);
    });

    it('should return empty string when no input provided', () => {
        const result = pipe.transform('');
        expect(result).toBe('');
        expect(sanitizer.bypassSecurityTrustHtml).not.toHaveBeenCalled(); // No sanitization for empty input
    });

    it('should apply custom options for sanitization', () => {
        const inputHtml = '<div>Content</div>';
        const sanitizedOutput = '<div>Content</div>'; // Expected output since div is allowed
        const customOptions = {allowedTags: ['div']};
        sanitizer.bypassSecurityTrustHtml.and.returnValue(sanitizedOutput);

        const result = pipe.transform(inputHtml, customOptions);
        expect(result).toBe(sanitizedOutput);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(sanitizedOutput);
    });
});
