import { NtsTree } from '../tree';

/**
 *  Set/change a property for all nodes, configurable by depth
 * @param nodes
 * @param prop
 * @param value
 * @param depth
 * @param depthCurrent
 */
export const setNodeProp = (
  nodes: NtsTree.TreeNode[],
  prop: string,
  value: any,
  depth: number[] = [],
  depthCurrent = 0,
): NtsTree.TreeNode[] => {
  return nodes.map((nodeSrc) => {
    // Create new reference
    const node: NtsTree.TreeNode = Object.assign({}, nodeSrc);
    // Check depth rules, only update value if no depth or current depth is in the depth array
    if (!depth.length || (depth.length && depth.includes(depthCurrent))) {
      node[prop] = value;
    }
    // Recurse through any children
    if (node.children) {
      node.children = setNodeProp(node.children, prop, value, depth, depthCurrent + 1);
    }

    return node;
  });
};
