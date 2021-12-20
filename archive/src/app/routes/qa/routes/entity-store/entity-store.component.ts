import { DomainService } from '$domain';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-entity-store',
  templateUrl: './entity-store.component.html',
  styleUrls: ['./entity-store.component.css'],
})
export class EntityStoreComponent implements OnInit {
  public users$ = this.domain.users.select$;

  public formMain = this.fb.group({
    address: ['', []],
    company: ['', []],
    email: ['', []],
    id: ['', []],
    name: ['', [Validators.required]],
    phone: ['', []],
    username: ['', [Validators.required]],
    website: ['', []],
  });

  public columns = [
    { field: 'name', header: 'Name' },
    { field: 'username', header: 'Username' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'website', header: 'Website' },
  ];

  constructor(private domain: DomainService, private fb: FormBuilder) {}

  ngOnInit() {
    // this.domain.users.get().subscribe();
    this.users$.subscribe(x => console.log(x));
    // this.domain.users.query.select().subscribe(x => console.log(x));
  }
}
