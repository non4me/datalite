import {TestBed} from '@angular/core/testing';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
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

  it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

  it('should return empty string for null or empty input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as unknown as string)).toBe('');
  });

  it('should sanitize and trust the HTML', () => {
    const unsafeHtml = '<p style="color: red;">Test</p><script>alert("XSS")</script>';
    const expectedSanitizedHtml = '<p>Test</p>';

    sanitizer.bypassSecurityTrustHtml.and.returnValue(expectedSanitizedHtml as SafeHtml);
    const result = pipe.transform(unsafeHtml);

    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(expectedSanitizedHtml);
    expect(result).toBe(expectedSanitizedHtml);
    });

  it('should handle complex HTML structures', () => {
    const unsafeHtml = '<ul><li>Item 1</li><li>Item 2</li></ul><a href="javascript:alert(1)">Click me</a>';
    const expectedSanitizedHtml = '<ul><li>Item 1</li><li>Item 2</li></ul><a>Click me</a>';

    sanitizer.bypassSecurityTrustHtml.and.returnValue(expectedSanitizedHtml as SafeHtml);
    const result = pipe.transform(unsafeHtml);

    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(expectedSanitizedHtml);
    expect(result).toBe(expectedSanitizedHtml);
    });
});
