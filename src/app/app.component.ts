import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PopupFactory } from './services/popup-factory.service';
import { Popup } from './services/popup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button color="primary" (click)="openPopup()">Open popup</button>
    <button mat-raised-button color="accent" (click)="closePopup()">Close popup</button>
  `,
})
export class App {
  private readonly _popupFactory = inject(PopupFactory);
  private _popup: Popup | null = null;

  async openPopup() {
    const { ChildComponent } = await import('./child.component');
    this._popup = this._popupFactory.open();
    this._popup.startStylesSync();
    const popupComponentRef = this._popup.appendComponent(ChildComponent);
  }

  closePopup() {
    this._popup?.close();
  }

  ngOnDestroy(): void {
    this.closePopup();
  }
}
