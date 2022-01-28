import { Pipe, PipeTransform } from '@angular/core';
import { NtsTree } from '../tree';

const countChildren = (data: NtsTree.TreeNode[] | undefined, depthCurrent = 0, depthsToInclude?: number[]): number => {
  let count = 0;
  if (!data || !data.length) {
    return 0;
  }

  if (!depthsToInclude || depthsToInclude.includes(depthCurrent)) {
    count += data.length;
  }

  data.forEach((node) => {
    if (node.children && node.children.length) {
      count += countChildren(node.children, depthCurrent + 1, depthsToInclude);
    }
  });
  return count;
};

// Usage: {{ value | ntsTreeChildrenCount }}
@Pipe({
  name: 'ntsTreeChildrenCount',
})
export class ChildrenCountPipe implements PipeTransform {
  transform(value: NtsTree.TreeNode[] | null | undefined, depthsToInclude?: number[]): number | null {
    if (!value) {
      return null;
    }

    return countChildren(value, 0, depthsToInclude);
  }
}
