import { Injectable, Injector, inject } from '@angular/core';
import { Popup } from './popup.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PopupFactory {
  private readonly _document = inject(DOCUMENT);
  private readonly _injector = inject(Injector);

  open(): Popup {
    const newWindow = this._openNewWindow();

    if (newWindow === null) {
      throw new Error('Window creation failed');
    }

    this._copyStyles(newWindow);

    this._copyStylesheetLinks(newWindow);

    this._copyBodyClasses(window);

    return new Popup(newWindow, this._injector, this._document);
  }

  private _openNewWindow(): Window | null {
    return window.open(
      '',
      '_blank',
      'width=600, height=400, left=200, top=200'
    );
  }

  private _copyStyles(window: Window): void {
    this._document.querySelectorAll('style').forEach((styleElement) => {
      window.document.head.appendChild(styleElement.cloneNode(true));
    });
  }

  private _copyStylesheetLinks(window: Window): void {
    this._document
      .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      .forEach((link) => {
        const newLink = window.document.createElement('link');
        newLink.rel = link.rel;
        newLink.href = link.href;
        window.document.head.appendChild(newLink);
      });
  }

  private _copyBodyClasses(window: Window): void {
    this._document.body.classList.forEach((className) => {
      window.document.body.classList.add(className);
    });
  }
}
