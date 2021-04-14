import { NtsTree } from '../tree';

/**
 * Filter the tree recursively by doing a string match against the label
 * @param nodes - Tree nodes to filter
 * @param fn - Function that is supplied the node as an argument and needs to return a boolean with whether to include/exclude
 * @param depth - TODO: Wire this up. Will limit the filter operations to tree nodes within this depth
 * @param depthCurrent - How deep the function has recursed
 */
export const filterTreeNodes = (
  nodes: NtsTree.TreeNode[] = [],
  fn: (node: NtsTree.TreeNode) => boolean,
  depth: number[] = [],
  depthCurrent = 0,
): NtsTree.TreeNode[] => {
  return nodes.filter(node => {
    // Recurse through any children
    if (node.children) {
      node.children = filterTreeNodes(node.children, fn, depth, depthCurrent + 1);
      if (node.children.length) {
        return true;
      }
    }

    return fn(node);
  });
};
