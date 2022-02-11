import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { <%= classify(name)%>Component } from './<%= dasherize(name)%>.component';
import { <%= classify(name)%>Module } from './<%= dasherize(name)%>.module';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(name)%>Component,
    data: { title: '<%= capitalize(name)%>' },
  },
];

export const <%= classify(name)%>Routing: ModuleWithProviders<<%= classify(name)%>Module> = RouterModule.forChild(routes);
