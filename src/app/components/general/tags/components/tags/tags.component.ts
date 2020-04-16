import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
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
export class TagsComponent implements OnInit {
  @Input() tags: NtsTags.TagDef[] = [];

  @Output() tagCreated = new EventEmitter<any>();
  @Output() tagUpdated = new EventEmitter<any>();
  @Output() tagDeleted = new EventEmitter<any>();

  public isEditing = false;

  // Formgroup
  public formTag = this.fb.group({
    guid: [null, []],
    type: ['Document'],
    tagText: ['My Tag', [Validators.required]],
    description: ['', []],
    textColor: ['#ffffff', [Validators.required]],
    backgroundColor: ['#515287', [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  }

  /**
   * Create a new tag
   */
  public tagAdd() {
    // Get instance of tag data
    const tag = this.formTag.value;
    // Trim any whitespace
    Object.keys(tag).forEach(key =>
      tag[key] && typeof tag[key] === 'string' ? (tag[key] = tag[key].trim()) : tag[key],
    );
    this.tagCreated.emit(tag);
  }

  /**
   * Edit an existing tag
   * @param tag
   */
  public tagEdit(tag: NtsTags.TagDef) {
    this.isEditing = true;
    this.formTag.patchValue(tag);
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

  /**
   * Reset tag
   */
  public tagReset() {
    this.formTag.reset();
    /**
    this.formTag.patchValue(this.tagDefault);
    this.textColor = this.tagDefault.textColor;
    this.backgroundColor = this.tagDefault.backgroundColor;
    this.isEditing = false;
     */
  }
}
