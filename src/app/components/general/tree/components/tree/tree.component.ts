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
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeTemplateDirective } from '../../directives/template.directive';
import { Tree } from 'primeng/tree';
import { setNodeProp } from '../../utils/setNodeProp.util';
import { BehaviorSubject } from 'rxjs';
import { NtsFilterTreeNodes } from '../../utils/filterNodes.util';
import { map } from 'rxjs/operators';
import { setNodeDefaults } from '../../utils/setNodeDefaults.util';
import { nodeCompareLabel } from '../../utils/nodeLabelCompare.util';
import { NtsTree } from '../..';
const cloneDeep = require('lodash/cloneDeep');

@Component({
  selector: 'nts-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class NtsTreeComponent implements OnInit {
  @ViewChild('tree', { static: true }) tree!: Tree;

  private _value: TreeNode[] | null = null;
  @Input() set value(nodes: TreeNode[] | null) {
    this._value = nodes;
    
    this.nodesSrc$.next(this.value);
    this.selection = []; // When new nodes are supplied, reset selection array
    this.selectionChange.emit(this.selection);
  }
  get value(): TreeNode[] | null {
    const nodes = <TreeNode[]>cloneDeep(this._value) || [];
    // Set node defaults if supplied
    return this.nodeDefaults ? setNodeDefaults(nodes, this.nodeDefaults) : nodes;
  }

  private _filterTerm: string | null = null;
  /** Filter the tree by matching the label property to the supplied filter term */
  @Input() set filterTerm(term: string) {
    this._filterTerm = term;
    this.nodesSrc$.next(this.value);
  }
  private _filterFn: ((node: NtsTree.TreeNode) => boolean) | null = null;
  /** Filters the tree by evaluating a callback function that should return a boolean */
  @Input() set filterFn(fn: ((node: NtsTree.TreeNode) => boolean) | null) {
    this._filterFn = fn;
    this.nodesSrc$.next(this.value);
  }

  /** Node source for tree */
  public nodesSrc$ = new BehaviorSubject<TreeNode[] | null>(this.value);
  /** Final out put of nodes with filtering applied */
  public nodes$ = this.nodesSrc$.pipe(
    map(nodes => {
      if (!nodes) {
        return nodes;
      }
      let nodesFiltered = nodes;
      // If filter term supplied, filter nodes
      if (this._filterTerm) {
        nodesFiltered = NtsFilterTreeNodes(nodes, nodeCompareLabel(this._filterTerm));
      }

      // If filter FN supplied, apply filter
      if (this._filterFn) {
        nodesFiltered = NtsFilterTreeNodes(nodes, this._filterFn);
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
  @Input() nodeDefaults: Partial<TreeNode>[] | undefined;

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
