import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <p matTooltip="Hello from material tootip">Hello popup</p>
  `,
})
export class ChildComponent {}
