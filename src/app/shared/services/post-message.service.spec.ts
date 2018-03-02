import { TestBed, inject } from '@angular/core/testing';

import { PostMessageService } from './post-message.service';

describe('PostMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostMessageService]
    });
  });

  it('should be created', inject([PostMessageService], (service: PostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
