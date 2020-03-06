declare namespace NtsTree {
  interface TreeNode {
    [index: string];
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

  interface NodeEvent {
    originalEvent: MouseEvent;
    node: TreeNode;
  }
  interface NodeDropEvent {
    originalEvent: MouseEvent;
    dragNode: TreeNode;
    dropNode: TreeNode;
    node: TreeNode;
  }
}
