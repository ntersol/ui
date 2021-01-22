import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NtsTags } from '../../tags';

const tagDefault = {
  type: 'Document',
  tagText: 'My Tag',
  description: '',
  textColor: '#ffffff',
  backgroundColor: '#515287',
};

@Component({
  selector: 'nts-tags-quick',
  templateUrl: './tag-builder.component.html',
  styleUrls: ['./tag-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagBuilderComponent implements OnInit, OnChanges {
  @Input() tag: NtsTags.TagDef | null = null;

  @Output() tagCreated = new EventEmitter<NtsTags.TagDef>();
  @Output() tagUpdated = new EventEmitter<NtsTags.TagDef>();

  // Formgroup
  public formTag = this.fb.group({
    guid: [null, []],
    type: [tagDefault.type],
    tagText: [tagDefault.tagText, [Validators.required]],
    description: [tagDefault.description, []],
    textColor: [tagDefault.textColor, [Validators.required]],
    backgroundColor: [tagDefault.backgroundColor, [Validators.required]],
  });

  public isEditing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(model: SimpleChanges) {
    if (model.tag) {
      if (this.tag) {
        this.formTag.patchValue(this.tag);
        this.isEditing = true;
      } else {
        this.tagReset();
      }
    }
  }

  /**
   * Create a new tag
   */
  public tagAdd() {
    // Get instance of tag data
    const tag = this.formTag.value;
    // Trim any whitespace
    Object.keys(tag).forEach(key => (tag[key] && typeof tag[key] === 'string' ? (tag[key] = tag[key].trim()) : tag[key]));
    this.tagCreated.emit(tag);
    this.tagReset();
  }

  /**
   * Edit existing tag
   */
  public tagEdited() {
    // Get instance of tag data
    const tag = this.formTag.value;
    // Trim any whitespace
    Object.keys(tag).forEach(key => (tag[key] && typeof tag[key] === 'string' ? (tag[key] = tag[key].trim()) : tag[key]));
    this.tagUpdated.emit(tag);
    this.tagReset();
  }

  /**
   * Reset tag
   */
  public tagReset() {
    this.formTag.reset();
    this.formTag.patchValue(tagDefault);
    this.tag = null;
    this.isEditing = false;
    /**
    this.formTag.patchValue(this.tagDefault);
    this.textColor = this.tagDefault.textColor;
    this.backgroundColor = this.tagDefault.backgroundColor;
    this.isEditing = false;
     */
  }
}
