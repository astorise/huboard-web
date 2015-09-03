import Ember from 'ember';
import SortableMixin from "app/mixins/cards/sortable";

var HbColumnComponent = Ember.Component.extend(SortableMixin, {
  classNames: ["column"],
  classNameBindings:["isCollapsed:hb-state-collapsed","isHovering:hovering", "isTaskColumn:hb-task-column", "isTaskColumn:task-column"],
  isTaskColumn: true,
  cards: Ember.A(),

  columns: function(){
    return this.get("columnComponents").map(function(c){
      return c.get("model");
    });
  }.property("columnComponents.[]"),
  sortedIssues: function(){
    var column = this.get("model");
    var issues = this.get("model.board.issues").filter(function(i){
      return i.data.current_state.index === column.data.index;
    }).filter(function(i) {
      return !i.get("isArchived");
    }).sort(this.sortStrategy);
    return issues;
  }.property("issues.@each.{columnIndex,order}"),
  sortStrategy: function(a,b){
    if(a.data._data.order === b.data._data.order){
      if(a.repo.full_name === b.repo.full_name){
        return a.number - b.number;
      }
      return a.repo.full_name - b.repo.full_name;
    }
    return a.data._data.order - b.data._data.order;
  },
  moveIssue: function(issue, order){
    var self = this;
    this.get("sortedIssues").removeObject(issue);
    Ember.run.schedule("afterRender", self, function(){
      issue.reorder(order, self.get("model"));
    });
  },

  isCollapsed: Ember.computed({
    get: function(){
      return this.get("settings.taskColumn" + this.get("model.index") + "Collapsed");
    },
    set: function(key, value){
      this.set("settings.taskColumn" + this.get("model.index") + "Collapsed", value);
      return value;
    }
  }).property(),
  isLastColumn: function(){
    return this.get("columns.lastObject.name") === this.get("model.name");
  }.property("columns.lastObject"),
  isFirstColumn: function(){
    return this.get("columns.firstObject.name") === this.get("model.name");
  }.property("columns.firstObject"),
  isCreateVisible: Ember.computed.alias("isFirstColumn"),
  topOrderNumber: function(){
    var issues = this.get("sortedIssues");
    var milestone_issues = this.get("issues").sort(function(a,b){
      return a.data._data.milestone_order - b.data._data.milestone_order;
    });
    if(issues.length){
      return {
        order: issues.get("firstObject.data._data.order") / 2,
        milestone_order: milestone_issues.get("firstObject.data._data.milestone_order") / 2
      };
    } else {
      return {};
    }
  }.property("sortedIssues.[]"),

  registerWithController: function(){
    var _self = this;
    Ember.run.schedule("afterRender", this, function(){
      _self.attrs.registerColumn(_self);
    });
  }.on("didInsertElement"),
  unregisterWithController: function(){
    var _self = this;
    Ember.run.schedule("afterRender", this, function(){
      _self.attrs.unregisterColumn(_self);
    });
  }.on("willDestroyElement"),
  wireupIsCollapsed: function(){
    var self = this;
    this.$(".collapsed").click(function(){
      self.toggleProperty("isCollapsed");
    });
  }.on("didInsertElement"),

  disableModalOnHrefs: function () {
    this._super();
    this.$("a, .clickable").on("click.hbcard", function (ev){ ev.stopPropagation(); } );
  }.on("didInsertElement"),
  tearDownEvents: function () {
    this.$("a, .clickable").off("click.hbcard");
    return this._super();
  }.on("willDestroyElement") 
});

export default HbColumnComponent;
