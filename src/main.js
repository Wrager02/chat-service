import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import PubNub from 'pubnub'

Vue.use(VueRouter);
Vue.use(Vuex);

import App from './App.vue'
import GroupView from './components/group-view'
import Group from './components/group'
import Chat from './components/chat'
import Events from './components/events'
import Settings from './components/settings'

Vue.config.productionTip = false

function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getPublishKey() {
  return '';
}

function getSubscribeKey() {
  return '';
}

function getUsername() {
  return "Alex";
}

function getGroups() {
  return {
    "gruppe-1": {
      name: "Gruppe 1",
      url: "gruppe-1",
      channels: {
        "allgemein": {
          name: "Allgemein",
          url: "allgemein",
          uuid: "2532ef1c-4c1b-4a8a-8975-43149bca27e9",
          messages: []
        },
        "wichtig": {
          name: "Wichtig",
          url: "wichtig",
          uuid: "091c147f-c2ca-4232-ade9-3c9fb242d2aa",
          messages: []
        }
      }
    },
    "gruppe-2": {
      name: "Gruppe 2",
      url: "gruppe-2",
      channels: {
        "allgemein": {
          name: "Allgemein",
          url: "allgemein",
          uuid: "78ac78a6-54bd-46b2-8b4c-be073717e94c",
          messages: []
        },
        "wichtig": {
          name: "Wichtig",
          url: "wichtig",
          uuid: "6c8716bb-84c2-47e5-83fd-d0c19fa61189",
          messages: []
        }
      }
    },
  };
}

const store = new Vuex.Store({
  state: {
    pubnub: new PubNub({
      publishKey: getPublishKey(),
      subscribeKey: getSubscribeKey(),
      uuid: getUUID()
    }),
    user: getUsername(),
    groups: getGroups()
  },
  mutations: {
    publish(state, payload) {
      state.pubnub.publish(
          {
            channel: payload.channel,
            message: {
              'text': payload.message,
              'user': state.user,
              'group': payload.group,
              'chat': payload.chat
            }
          }
      );
    },
    addMessage(state, payload) {
      state.groups[payload.message.message.group].channels[payload.message.message.chat].messages.push(payload.message);
    }
  },
  getters: {
    getGroups: state => {
      return state.groups;
    },
    getGroup: state => group => {
      return state.groups[group];
    },
    getChannels: state => group => {
      return state.groups[group].channels;
    },
    getChannel: state => (group, channel) => {
      return state.groups[group].channels[channel];
    },
    getAllChannelUuids: state => {
      let r = [];

      Object.keys(state.groups).forEach(groupKey => {
        Object.keys(state.groups[groupKey].channels).forEach(channelKey => {
          r.push(state.groups[groupKey].channels[channelKey].uuid);
        });
      });

      return r;
    }
  }
});

store.state.pubnub.addListener({
  message: function(event) {
    store.commit('addMessage', {message: event});
  }
});

store.state.pubnub.subscribe({
  channels: store.getters.getAllChannelUuids,
  withPresence: true
});

const routes = [
  {
    path: '/',
    redirect: '/gruppen'
  }, {
    path: '/gruppen',
    name: 'groups',
    component: GroupView,
  }, {
    path: '/gruppen/:url/',
    name: 'group',
    component: Group,
    props: true,
    children: [
      {
        name: 'chat',
        path: ':type',
        component: Chat,
        props:true
      }
    ]
  }, {
    path: '/termine',
    component: Events
  }, {
    path: '/einstellungen',
    component: Settings
  }
];

const router = new VueRouter({
  routes
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
