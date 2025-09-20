import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

export interface SafeHtmlOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  removeScripts?: boolean;
  maxLength?: number;
}

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private defaultOptions: SafeHtmlOptions = {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'i', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: ['href', 'title', 'target'],
    removeScripts: true,
    maxLength: 10000
  };

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string, options: Partial<SafeHtmlOptions> = {}): SafeHtml {
    if (!value) {
      return '';
    }

    const mergedOptions = {...this.defaultOptions, ...options};

    // Čištění a validace obsahu
    const cleanedHtml = this.sanitizeHtml(value, mergedOptions);

    return this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
  }

  private sanitizeHtml(html: string, options: SafeHtmlOptions): string {
    let cleaned = html;

    // Odstranění skriptů
    if (options.removeScripts) {
      cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      cleaned = cleaned.replace(/javascript:/gi, '');
      cleaned = cleaned.replace(/on\w+\s*=/gi, ''); // odstraňujeme zpracovatele událostí
    }

    // Omezení délky
    if (options.maxLength && cleaned.length > options.maxLength) {
      cleaned = cleaned.substring(0, options.maxLength) + '...';
    }

    // Filtrování povolených tagů
    if (options.allowedTags) {
      const allowedTagsRegex = new RegExp(
        `<(?!\/?(?:${options.allowedTags.join('|')})\s*\/?>)[^>]+>`,
        'gi'
      );
      cleaned = cleaned.replace(allowedTagsRegex, '');
    }

    return cleaned;
  }
}
