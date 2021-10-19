import { Component, AfterViewInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class ShowcaseTagsComponent implements AfterViewInit {

  constructor(private highlight: HighlightService) { }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

  public import = `
  import { NtsTagsModule } from '@ntersol/tags';`;

  public inputFieldTs: string = `
    public tags: NtsTags.TagDef[] = [
      {
        guid: '1',
        tagText: 'First tag',
        description: 'this is the first tag',
        textColor: '#f26',
        backgroundColor: 'black',
      },
      {
        guid: '2',
        tagText: 'Second tag',
        description: 'this is the second tag',
        textColor: '#040354',
        backgroundColor: '#fff',
      }
    ];
  `;

  public handlersTs: string = `
    public onCreate(tag: NtsTags.TagDef) {
      console.log('--create new--');
      console.log(tag);
    }

    public onUpdate(tag: NtsTags.TagDef) {
      console.log('--update--');
      console.log(tag);
    }

    public onDelete(tag: NtsTags.TagDef) {
      console.log('--delete--');
      console.log(tag);
    }
  `;

  public exampleHTML: string = this.htmlEncode(`
  <nts-tags
    [tags]="tags"
    (tagCreated)="onCreate($event)"
    (tagUpdated)="onUpdate($event)"
    (tagDeleted)="onDelete($event)">
  </nts-tags>`);


  public testTags: any[] = [
    {
      guid: '1',
      tagText: 'First tag',
      description: 'this is the first tag',
      textColor: '#f26',
      backgroundColor: 'black',
    },
    {
      guid: '2',
      tagText: 'Second tag',
      description: 'this is the second tag',
      textColor: '#040354',
      backgroundColor: '#fff',
    },
  ];

  public onCreate(event: any) {
    this.testTags.push(event);
  }

  public onUpdate(event: any) {
    const tagIndex = this.testTags.findIndex(value => value.guid === event.guid);
    this.testTags[tagIndex] = event;
  }

  public onDelete(event: any) {
    const tagIndex = this.testTags.findIndex(value => value.guid === event.guid);
    this.testTags.splice(tagIndex, 1);
  }

  htmlEncode(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
