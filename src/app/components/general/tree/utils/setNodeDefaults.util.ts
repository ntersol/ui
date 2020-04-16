import { NtsTree } from '..';

/**
 * Recursively merge the defaults with the supplied nodes
 * @param nodes
 * @param defaults
 * @param depth
 */
export const setNodeDefaults = (
  nodes: NtsTree.TreeNode[],
  defaults: Partial<NtsTree.TreeNode>[],
  depth = 0,
): NtsTree.TreeNode[] => {
  return nodes.map(node => {
    const nodeNew = Object.assign({}, defaults[depth], node);
    if (nodeNew.children) {
      nodeNew.children = setNodeDefaults(nodeNew.children, defaults, depth + 1);
    }

    return nodeNew;
  });
};
