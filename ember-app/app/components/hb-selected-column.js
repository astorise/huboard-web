import Ember from 'ember';

var HbSelectedColumnComponent = Ember.Component.extend({
  tagName: "ul",
  classNames: ["nav","breadcrumbs"],
  classNameBindings: ["isCustomState:hb-state","stateClass"],
  isCustomState: function(){
    return this.get("stateClass") !== "hb-state-open";
  }.property("stateClass"),
  isEnabled: function() {
    return App.get("repo.is_collaborator");
  }.property("repo.is_collaborator"),
  stateClass: function(){
    var github_state = this.get("issue.data.state");
    if(github_state === "closed"){
      return "hb-state-" + "closed";
    }
    var custom_state = this.get("issue.customState");
    if(custom_state){
      return "hb-state-" + custom_state;
    }
    return "hb-state-open";
  }.property("issue.data.current_state", "issue.customState", "issue.data.state"),
  selectedColumn: function () {
    var state = this.get("issue.data.current_state");
    return this.get("columns").find(function(column){
      return column.index === state.index;
    });
  }.property("issue.data.current_state", "issue.customState", "issue.data.state"),
  visibleColumns: function() {
    //return this.get('columns')
    var total = this.get("columns.length"),
      index = this.get("columns").indexOf(this.get("selectedColumn")),
      last = index === (total - 1),
      first = index === 0,
      start = last ? index - 2 : first ? index : index - 1,
      end = last ? index + 2 : first ? index + 3 : (index + 2) > total - 1 ? total : index + 2;

    return this.get("columns").slice(start, end);
  }.property("selectedColumn")
});

export default HbSelectedColumnComponent;
