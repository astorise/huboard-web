import Ember from "ember";
import Issue from "app/models/forms/create-issue";

var HbQuickIssueComponent = Ember.Component.extend({
  classNames: ["create-issue"],
  placeholderText: "Add issue...",

  initModel: function(){
    this.set("model", Issue.createNew());
  }.on("init"),
  clearModel: function(){
    this.set("model", Issue.createNew());
  },
  isValid: function(){
    return this.get("model.title").trim() !== "" &&
      this.get("processing") !== true;
  }.property("model.title", "processing"),

  bindToFocus: function(){
    var _self = this;
    this.$("input").on("focus.huboard", function() {
      _self.set("placeholderText", "Add title then ↵");
    });
    this.$("input").on("blur.huboard", function() {
      _self.set("placeholderText", "Add issue...");
    });
  }.on("didInsertElement"),
  releaseEvents: function(){
    this.$("input").off("blur.huboard focus.huboard");
  }.on("willDestroyElement"),

  actions: {
    openFullScreen: function(){
      var model = Issue.createNew();
      model.set("title", this.get("model.title"));
      model.set("milestone", this.get("column.milestone"));
      var order = this.get("parentView.topOrderNumber");

      this.attrs.createFullscreenIssue(model, order);
      this.clearModel();
    },
    onQuickAdd: function(){
      if (!this.get("isValid")) {return;}
      this.set("processing", true);
      var order = this.get("parentView.topOrderNumber");
      this.set("model.milestone", this.get("column.milestone"));

      var _self = this;
      return this.get('repo').createIssue(this.get('model'), order).then(() => {
          _self.set("processing", false);
          _self.clearModel();
      });

    }
  }
});

export default HbQuickIssueComponent;
