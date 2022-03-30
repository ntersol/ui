import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { TreeTemplateDirective } from '../../directives/template.directive';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { setNodeProp } from '../../utils/setNodeProp.util';
import { filterTreeNodes } from '../../utils/filterNodes.util';
import { setNodeDefaults } from '../../utils/setNodeDefaults.util';
import { nodeCompareLabel } from '../../utils/nodeLabelCompare.util';
import { NtsTree } from '../../tree';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'nts-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class NtsTreeComponent implements OnInit, OnChanges {
  @ViewChild('tree', { static: true }) tree!: Tree;

  /** Tree nodes */
  @Input() value: TreeNode[] | null = null;

  /** Filter the tree by matching the label property to the supplied filter term */
  @Input() filterTerm: string | null = null;

  /** Filters the tree by evaluating a callback function that should return a boolean */
  @Input() filterFn: ((node: NtsTree.TreeNode) => boolean) | null = null;

  /** Node source for tree */
  public nodesSrc$ = new BehaviorSubject<TreeNode[]>(this.value || []);
  /** Final out put of nodes with filtering applied */
  public nodes$: Observable<TreeNode<any>[]> = this.nodesSrc$.pipe(
    map((nodes) => {
      if (!nodes) {
        return [];
      }
      let nodesFiltered = nodes;
      // If filter term supplied, filter nodes
      if (this.filterTerm) {
        nodesFiltered = filterTreeNodes(nodes, nodeCompareLabel(this.filterTerm));
      }

      // If filter FN supplied, apply filter
      if (this.filterFn) {
        nodesFiltered = filterTreeNodes(nodesFiltered, this.filterFn);
      }

      return nodesFiltered;
    }),
  );

  @Input() selectionMode: 'single' | 'multiple' | 'checkbox' = 'multiple';
  @Input() draggable = false;
  @Input() droppable = false;
  @Input() contextMenu: any | null = null;
  @Input() compactView = false;
  @Input() propagateSelectionUp = false;
  @Input() propagateSelectionDown = false;
  /** Set default attributes for each node where array index corresponds to depth */
  @Input() nodeDefaults?: Partial<TreeNode>[];

  @Input() selection: NtsTree.TreeNode[] = [];
  @Output() selectionChange: EventEmitter<NtsTree.TreeNode[]> = new EventEmitter<any>();

  /** Custom node templates passed from the parent to the sub component */
  public templates: TreeTemplateDirective[] = [];
  @ContentChildren(TreeTemplateDirective)
  set columnTemplates(val: QueryList<TreeTemplateDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      this.templates = arr;
    }
  }

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeSelect = new EventEmitter<NtsTree.NodeEvent>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeUnselect = new EventEmitter<NtsTree.NodeEvent>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeUnselectAll = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeExpand = new EventEmitter<NtsTree.NodeEvent>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeCollapse = new EventEmitter<NtsTree.NodeEvent>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeContextMenuSelect = new EventEmitter<NtsTree.NodeEvent>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNodeDrop = new EventEmitter<NtsTree.NodeDropEvent>();

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(model: SimpleChanges) {
    if (model.value || model.filterTerm || model.filterFn) {
      const nodes = <TreeNode[]>cloneDeep(this.value) || [];
      const nodesWithDefaults = this.nodeDefaults ? setNodeDefaults(nodes, this.nodeDefaults) : nodes;
      this.nodesSrc$.next(nodesWithDefaults);
      this.selection = []; // When new nodes are supplied, reset selection array
      this.selectionChange.emit(this.selection);
    }
  }

  public selectAll() {}

  /**
   * Unselect all nodes
   */
  public unselectAll() {
    this.selection = [];
    this.onNodeUnselectAll.emit();
    this.ref.markForCheck();
  }

  // public onContextSelect(event: {event: MouseEvent, node: NtsTree.TreeNode}) {
  //   console.log(event)
  //   // this.selection.
  //   // this.onNodeContextMenuSelect.emit(event)

  // }

  /**
   * Expand all nodes. Supports configurable depth
   * @param depth
   */
  public nodesExpand(depth?: number[]) {
    if (!this.value) {
      return;
    }
    this.nodesSrc$.next(setNodeProp(this.value, 'expanded', true, depth));
  }

  /**
   * Collapse all nodes. Supports configurable depth
   * @param depth
   */
  public nodesCollapse(depth?: number[]) {
    if (!this.value) {
      return;
    }
    this.nodesSrc$.next(setNodeProp(this.value, 'expanded', false, depth));
  }
}
