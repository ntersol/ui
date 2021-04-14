import { NtsTree } from '../tree';

/**
 *
 */
export const getNodes = (
  nodes: NtsTree.TreeNode[],
  // depth: number[] = [],
  // depthCurrent = 0,
) => {
  return nodes.reduce((a: NtsTree.TreeNode[], b) => {
    return [...a, b];
  }, []);
};
