import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService } from 'primeng/api';

import { NtsTreeComponent } from './components/tree/tree.component';
import { TreeTemplateDirective } from './directives/template.directive';
import { TreeTemplateNodeDirective } from './directives/node.directive';
import { ChildrenCountPipe } from './pipes/children-count.pipe';

const DEPS = [NtsTreeComponent, TreeTemplateDirective, TreeTemplateNodeDirective, ChildrenCountPipe];

@NgModule({
  declarations: [DEPS],
  imports: [CommonModule, TreeModule],
  providers: [TreeDragDropService],
  exports: [DEPS],
})
export class NtsTreeModule {}
