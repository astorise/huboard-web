import Ember from 'ember';
import Repo from 'app/models/new/repo';
import ajax from 'ic-ajax';

var ApplicationRoute = Ember.Route.extend({
  filters: Ember.inject.service(),

  actions: {
    sessionErrorHandler: function(){
      this.transitionTo("unauthorized");
    },
    toggleSidebar: function(){
      this.controllerFor("application").toggleProperty("isSidebarOpen");
    },
    clearFilters: function(){
      this.get("filters").clear();
    }
  },
  model: function () {
    return new Ember.RSVP.Promise(function(resolve){
       Ember.run.once(function(){
        var repo = App.get("repo");
        resolve(Repo.create({data:repo}));
       });
    });
  },
  setupController: function(controller){
    this._super.apply(this, arguments);

    Ember.$(document).ajaxError(function(event, xhr){
      if(App.get('loggedIn') && xhr.status === 404){
        this.send("sessionErrorHandler");
      }
      if(App.get('loggedIn') && xhr.status === 422){
        var contentType = xhr.getResponseHeader("Content-Type"),
            isJson = contentType.indexOf("application/json") === 0;

        if(isJson) {
          var message = JSON.parse(xhr.responseText);
          if(message.error === "CSRF token is expired" || message.error === "GitHub token is expired") {
            this.send("sessionErrorHandler");
          }
        }
      }
    }.bind(this));
  }
});

export default ApplicationRoute;
