import { Component, OnInit } from '@angular/core';
import { imageResize } from '@ntersol/utils';
import { BehaviorSubject } from 'rxjs';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-image-resizer',
  templateUrl: './image-resizer.component.html',
  styleUrls: ['./image-resizer.component.css']
})
export class ImageResizerComponent implements OnInit {

  public exampleTS: string =
    `
  // Import util
  import { imageResize } from '@ntersol/utils';

  // Feed an uploaded file and max dimensions. Function returns a Promise
  imageResize(file, 400).then((newFile: any) => {
    file = newFile;
  });
  `;

  public file: any = null;
  public maxSize = 400;

  public imagePreview$ = new BehaviorSubject<string | null>(null);

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {
  }

  public resize(e: any) {
    this.file = e.target.files[0];
    this.display();
  }

  public display() {
    imageResize(this.file, this.maxSize).then(file => {
      this.imagePreview$.next(URL.createObjectURL(file))
    });

  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
