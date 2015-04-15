Goals = new Mongo.Collection('goals');

Projects = new Mongo.Collection('projects');

//ConcernedPeople = new Mongo.Collection('concernedPeople');
Emails = new Mongo.Collection('emails');


Goals.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Goals.helpers({
  datePosted: function () {
    // http://momentjs.com/
    return moment(this.createdAt).format('l');
  },
  author: function () {
    return Meteor.users.findOne({_id: this.userId});
  },
/*
  voters: function () {
    return Meteor.users.find({_id: {$in: this.voterIds}});
  }
*/
});

Projects.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Projects.after.insert(function (userId, doc) {
  Meteor.users.update({_id: userId}, {$set: {
    "watchedProjectIds": ['' + this._id],
    "ownedProjectIds": ['' + this._id]
  }});
});

Projects.helpers({
  datePosted: function () {
    // http://momentjs.com/
    return moment(this.createdAt).format('l');
  },
  author: function () {
    return Meteor.users.findOne({_id: this.userId});
  },
/*
  voters: function () {
    return Meteor.users.find({_id: {$in: this.voterIds}});
  }
*/
});

// refer to https://developer.github.com/v3/repos/

Projects.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Answer",
    autoform: {
      'label-type': 'placeholder',
      placeholder: '项目名称(毛豆网)'
    },
    max: 200
  },
  description: {
    type: String,
    label: "Answer",
    autoform: {
      'label-type': 'placeholder',
      placeholder: '一句话描述项目(在线协作学习社区)'
    },
    max: 200
  },
  url: {
    type: String,
    label: "Answer",
    autoform: {
      'label-type': 'placeholder',
      placeholder: '项目Github Repo地址，如果没有可以放项目网站URL链接'
    },
    max: 200
  },
  steps: {
      type: Array,
      optional: true,
      minCount: 0,
      maxCount: 100
   },
  "steps.$": {
      type: Object,
      optional: true
   },
  "steps.$.description": {
      type: String,
      label: "Answer",
    autoform: {
      'label-type': 'placeholder',
      placeholder: '学习知识点描述'
    },
   },
  "steps.$.snapshot_url": {
      type: String,
      label: "Answer",
    autoform: {
      'label-type': 'placeholder',
      placeholder: '填写参考资料链接，如链接结尾是jpg/png，则此链接会显示为图片'
    },
   },
  watchers: {
    type: [String],
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return [Meteor.userId()];
      } else {
        this.unset();
      }
    },
  },
  owner: {
    type: String,
    optional: false,
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    }
  },

}));

Emails.attachSchema(  new SimpleSchema({
    titles :{
        type: String,
          autoform: {
      'label-type': 'placeholder',
      placeholder: '邮件主题'
    },
        max: 50
    },
   /* email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
      'label-type': 'placeholder',
      placeholder: '邮箱地址'
    },
    },*/
    message: {
        type: String,
        autoform: {
      'label-type': 'placeholder',
      placeholder: '邮件内容'
    },
        max: 1000
    }
}));
