import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PopupFactory } from './services/popup-factory.service';
import { Popup } from './services/popup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PopupFactory, Popup],
  imports: [MatButtonModule],
  styles: `:host {padding: 1rem; display:flex; gap:.5rem}`,
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
    const popupComponentRef = this._popup.appendComponent(ChildComponent);
    this._popup.startStylesSync();
    popupComponentRef.setInput('btnLabel', 'Action');
  }

  closePopup() {
    this._popup?.close();
  }

  ngOnDestroy(): void {
    this.closePopup();
  }
}
