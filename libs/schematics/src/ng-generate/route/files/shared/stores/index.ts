<% if(apiStore) { %>export * from './<%= dasherize(name) %>-api-store.service';<% } %>
<% if(uiStore) { %>export * from './<%= dasherize(name) %>-ui-store.service';<% } %>
