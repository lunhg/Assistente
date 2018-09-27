// index.js
const Vue = require('vue');
const Index = require('../views/components/Index.vue');
const Data = require('./data.js');
const onTelegramAuth = require('./onTelegramAuth.js');

new Vue({
  el: '#Assistente',
  data () {
    return Data;
  },
  methods: {
    onTelegramAuth: onTelegramAuth
  },
  render: function (createElement) {
    return createElement(Index);
  }
});
