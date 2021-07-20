import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NtsTags } from '../../tags';

/**
 * Create and manage tags
 * TODO:
 * -Support generic tag models that can hold properties not just for tag defs
 */
@Component({
  selector: 'nts-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  @Input() tags: NtsTags.TagDef[] = [];

  @Output() tagCreated = new EventEmitter<NtsTags.TagDef>();
  @Output() tagUpdated = new EventEmitter<NtsTags.TagDef>();
  @Output() tagDeleted = new EventEmitter<NtsTags.TagDef>();

  // public formTag: any;
  public tagActive: NtsTags.TagDef | null = null;

  /**
   * Edit an existing tag
   * @param tag
   */
  public tagEdit(tag: NtsTags.TagDef) {
    this.tagActive = { ...tag };
    // this.formTag.patchValue(tag);
  }

  /**
   * Delete an existing tag
   * @param tag
   */
  public tagDelete(tag: NtsTags.TagDef) {
    const confirm = window.confirm('Are you sure you want to delete this tag?');
    if (confirm) {
      this.tagDeleted.emit(tag);
    }
  }
}
