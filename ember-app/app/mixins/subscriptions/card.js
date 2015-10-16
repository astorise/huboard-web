import Ember from 'ember';

var CardSubscriptionMixin = Ember.Mixin.create({
  hbsubscriptions: {
    channel: "{issue.repo.data.repo.full_name}",
    "issues.{issue.data.number}.issue_status_changed": "statusChanged",
    "issues.{issue.number}.issue_archived": "archived",
    "issues.{issue.number}.issue_closed": "closed",
    "local.{issue.number}.issue_closed": "closed",
    "issues.{issue.number}.issue_reopened": "opened",
    "local.{issue.number}.issue_reopened": "opened",
    "issues.{issue.number}.assigned": "assigned",
    "issues.{issue.number}.moved": "moved",
    "issues.{issue.number}.reordered": "reordered",
    "issues.{issue.number}.milestone_changed": "milestoneChanged"
  },
  hbsubscribers: {
    statusChanged: function(message){
      this.get("issue").set("_data", message.issue._data);
    },
    archived: function(message){
      this.get('issue').set('isArchived', true);
    },
    closed: function(message){
      this.get("issue").set("state", message.issue.state);
    },
    opened: function(message){
     this.get("issue").set("state", message.issue.state);
    },
    assigned: function(message){
     this.get("issue").set("assignee", message.issue.assignee);
    },
    moved: function (message) {
      this.get('issue').setProperties({
        current_state : message.issue.current_state,
        state: message.issue.state,
        _data: message.issue._data
      });
    },
    reordered: function (message) {
       this.get("issue").set("current_state", message.issue.current_state);
       this.get("issue").set("_data", message.issue._data);
    },
    milestoneChanged: function(message) {
      this.get('issue').setProperties({
        milestone: message.issue.milestone,
        body: message.issue.body,
        _data: message.issue._data
      });
    },
  }
});

export default CardSubscriptionMixin;
