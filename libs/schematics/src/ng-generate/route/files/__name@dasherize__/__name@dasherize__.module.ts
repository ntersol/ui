import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(name) %>Component } from './<%= dasherize(name)%>.component';
import { SiteModule } from '$site';
import { <%= classify(name)%>Routing } from './<%= dasherize(name)%>-routing.module';
<% if(apiStore || uiStore) { %>import { <% if(apiStore) { %><%= classify(name) %>ApiService<% } %><% if(apiStore && uiStore) {%>, <% } %><% if(uiStore) { %><%= classify(name) %>UiService<% } %> } from './shared/stores';<% } %>

@NgModule({
  imports: [CommonModule, SiteModule, <%= classify(name)%>Routing],
  declarations: [<%= classify(name) %>Component],
  <% if(apiStore || uiStore) { %>providers: [<% if(apiStore) { %><%= classify(name) %>ApiService<% } %><% if(apiStore && uiStore) {%>, <% } %><% if(uiStore) { %><%= classify(name) %>UiService<% } %>]<% } %>
})
export class <%= classify(name)%>Module {}
