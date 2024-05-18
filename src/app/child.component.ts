import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-child',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [MatTooltipModule, MatButtonModule],
  template: `
    <button mat-raised-button color="primary"
      matTooltip="Info about the action"
      aria-label="Button that displays a tooltip when focused or hovered over"
    >{{ btnLabel() }}</button>
  `,
})
export class ChildComponent {
  btnLabel = input.required<string>();
}
