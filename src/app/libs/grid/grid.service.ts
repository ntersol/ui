import { Injectable } from '@angular/core';

import { GridTemplateRendererComponent } from './grid-template-renderer/grid-template-renderer.component';
import { GridStatusBarComponent } from './grid-status-bar/grid-status-bar.component';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  // Manage grid component references
  public statusBar = GridStatusBarComponent;
  public templateRenderer = GridTemplateRendererComponent;

  constructor() {}
}
