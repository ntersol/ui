export const arrayToTree = <t>(arr: t[] | null | undefined, level1Id: string, level2Id: string) => {
  if (!arr) {
    return null;
  }
  // Convert routes to a tree nested under sections
  const tree: Record<string, Record<string, t>> = {};
  arr.forEach((r: any) => {
    if (!tree[r[level1Id]]) {
        tree[r[level1Id]] = {};
    }
    tree[r[level1Id]][r[level2Id]] = r;
  });
  return tree;
};
