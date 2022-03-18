import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { removeNils } from '@ntersol/utils';

@Component({
  selector: 'nts-remove-nils',
  templateUrl: './remove-nils.component.html',
  styleUrls: ['./remove-nils.component.css'],
})
export class RemoveNilsComponent implements OnInit {
  public object = {
    nameFirst: 'John',
    nameLast: '',
    id: 0,
    data: {
      isActive: false,
      isInactive: null,
    },
    preferences: {
      favoriteColors: ['Red'],
      favoriteFoods: [],
      favoriteBoardGames: [
        {
          label: 'Arkham Asylum',
          id: undefined,
        },
      ],
      favoriteBooks: {},
    },
  };

  public nilFree = removeNils(this.object);

  public exampleTS = `
  // Import from npm
  import { removeNils } from '@ntersol/utils'

  // Supply an object or array to the utility
  const nilFree = removeNils(object);`;

  public exampleTS2 = `
  // Import from npm
  import { removeNils } from '@ntersol/utils'

  // Sample Input
  const object = {
    nameFirst: 'John',
    nameLast: '',
    id: 0,
    data: {
      isActive: false,
      isInactive: null
    },
    preferences: {
      favoriteColors: ['Red'],
      favoriteFoods: [],
      favoriteBoardGames: [
        {
          label: 'Arkham Asylum',
          id: undefined
        }
      ],
      favoriteBooks: {}
    },
  }

  // Supply an object or array to the utility
  console.log(
    removeNils(object)
  );

  // Sample Output
  {
    nameFirst: "John",
    id: 0,
    data: {
      isActive: false
    },
    preferences: {
      favoriteColors: ["Red"],
      favoriteBoardGames: [
        { label: "Arkham Asylum" }
      ]
    }
  }
  `;

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {
    console.log(this.nilFree);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
