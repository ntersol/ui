export namespace NtsTree {
  export interface TreeNode {
    [index: string]: any;
    label?: string;
    data?: any;
    icon?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
  }

  export interface NodeEvent {
    originalEvent: MouseEvent;
    node: TreeNode;
  }
  export interface NodeDropEvent {
    originalEvent: MouseEvent;
    dragNode: TreeNode;
    dropNode: TreeNode;
    node: TreeNode;
  }
}
