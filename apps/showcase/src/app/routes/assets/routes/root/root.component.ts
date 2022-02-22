import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
  assets = [
    {
      path: 'assets/img/how-its-made.png',
      alt: 'how the icon was made',
      width: 500,
    },
    {
      path: 'favicon.ico',
      alt: 'old school favicon, use sizes any to prevent svg supported browsers from picking this up',
      width: 16,
    },
    { path: 'favicon-16x16.png', alt: '16 by 16 favicon if png supported but not svg', width: 16 },
    { path: 'favicon-32x32.png', alt: '32 by 32 favicon if png supported but not svg', width: 32 },
    { path: 'n-black.svg', alt: 'n icon, black base variant', width: 500 },
    { path: 'n-colored.svg', alt: 'n icon, branded/colored variant', width: 500 },
    { path: 'favicon.svg', alt: 'vector based favicon, dark mode support', width: 500 },
    { path: 'safari-pinned-tab.svg', alt: 'vector based icon for safari pinned tabs', width: 500 },
    { path: 'ntersol-black.svg', alt: 'ntersol base, black base variant', width: 400 },
    { path: 'ntersol-colored.svg', alt: 'ntersol base, colored base variant', width: 400 },
    { path: 'n-ntersol-colored.svg', alt: 'ntersol logo with n icon aside', width: 800 },
  ];
}
