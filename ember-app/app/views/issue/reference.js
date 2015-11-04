import Ember from 'ember';

var IssueReferenceView = Ember.View.extend({
  classNameBindings: [":issue-reference-info", "isLoaded:hb-loaded:ui-blur"],
  isProcessing: false,
  isLoaded: false,
  commit: null,
  commitUrl: Ember.computed.alias("commit.html_url"),
  processMessage: function(){
    //needs emoji parser
    this.set("message", this.get("commit.commit.message"));
  }.observes("commit.commit.message"),
  shortSha: function(){
    if (this.get("commit") === null){
      return "";
    }
    return this.get("commit.sha").substr(0,7);
  }.property("commit.sha"),
  didInsertElement: function(){
    this.set("model", this.get("parentView.model"));
    if (this.get("model.commit_id") === null){
      return this.set("parentView.isVisible", false);
    }

    var self = this;
    var container = this.$().closest(".card-event");
    container.hover(function(){
      if (self.get("commit") === null) {
        self.fetchCommit();
      }
    });
  },
  willDestroyElement: function(){
    var container = this.$().closest(".card-event");
    container.off('hover');
  },
  fetchCommit: function(){
    if(this.get("isProcessing")){
      return;
    }
    this.set("isProcessing", true);
    var self = this;
    var commit = this.get("controller.model");
    this.get("controller").fetchCommit(commit)
      .then(function(commit){
        self.set('isLoaded', true);
        self.set("isProcessing", false);
        self.set("commit", commit);
      })
      .fail(function(){
        self.set("isProcessing", false);
      });
  }
});

export default IssueReferenceView;
