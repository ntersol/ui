import { NtsTree } from '../tree';

export const nodeCompareLabel = (filterTerm: string | null) => (node: NtsTree.TreeNode | null) => {
  if (!node) {
    return false;
  }
  const slug = String(node.label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
  const termSearch = String(filterTerm || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');

  return slug.includes(termSearch);
};
