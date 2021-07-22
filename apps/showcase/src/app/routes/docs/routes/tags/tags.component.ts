import { Component } from '@angular/core';
import { NtsTags } from '@ntersol/tags';

let index = 0;
@Component({
  selector: 'nts-showcase-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  installExample = `
  npm i @ntersol/tags`;
  importExample = `
  import { NtsTagsModule } from '@ntersol/tags';`;
  compExample = `
  // import NtsTags interface
  import { NtsTags } from '@ntersol/tags';

  // create variable to hold the tags (input)
  tags: NtsTags.TagDef[] = [];

  // create output functions to handle logic
  onTagCreated(tag: NtsTags.TagDef): void {
    tag.guid = ++index + '';
    this.tags.push(tag);
  }

  onTagUpdated(tag: NtsTags.TagDef): void {
    this.tags = this.tags.map((t) => {
      return t.guid === tag.guid ? tag : t;
    });
  }

  onTagDeleted(tag: NtsTags.TagDef): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }
  `;
  htmlExample = `
  &lt;nts-tags
    [tags]="tags"
    (tagCreated)="onTagCreated($event)"
    (tagUpdated)="onTagUpdated($event)"
    (tagDeleted)="onTagDeleted($event)"&gt;&lt;/nts-tags&gt;
  `;
  tags: NtsTags.TagDef[] = [];

  onTagCreated(tag: NtsTags.TagDef): void {
    tag.guid = ++index + '';
    this.tags.push(tag);
  }

  onTagUpdated(tag: NtsTags.TagDef): void {
    this.tags = this.tags.map((t) => {
      return t.guid === tag.guid ? tag : t;
    });
  }

  onTagDeleted(tag: NtsTags.TagDef): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }
}
