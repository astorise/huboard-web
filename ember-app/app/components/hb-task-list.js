import Ember from 'ember';
import config from '../config/environment'; //jshint ignore:line
import MarkdownParsing from '../mixins/markdown-parsing';

var HbTaskListComponent = Ember.Component.extend(MarkdownParsing, {
  classNames: ["js-task-list-container", "comment-text"],
  onBodyChange: function(){
    Ember.run(this, function(){
      this.set("bodyMarkup", this.get('body_html'));
    });
  }.observes('body_html'),
  bodyMarkup: function(key, value){
    if(arguments.length > 1){
      this.cleanUp();
      Ember.run.schedule('afterRender', this, "wireUp");
      return this.commitParser(value);
    } else {
      return this.get("body_html");
    }
  }.property(),
  wireUp: function(){
    if (this.get('canEdit') && this._state === "inDOM") {
      var component = this;
      this.$().taskList("enable");
      this.$(".js-task-list-field").on("tasklist:changed", function(){
        component.sendAction("taskChanged", this.value);
      });
    }
  }.on("didRender"),
  cleanUp: function(){
    if(this._state === "inDOM"){
      this.$().taskList("destroy");
      this.$(".js-task-list-field").off("tasklist:changed");
    }
  }.on('willDestroyElement')
});

export default HbTaskListComponent;
