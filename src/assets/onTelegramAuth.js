const axios = require('axios');

module.exports = function(user) {
  let clone = {};
  Object.keys(user).map(function(p){
    return p === 'id' ? (clone['telegramId'] = user[p]) : (clone[p] = user[p]);
  });
  axios({
    method: 'POST',
    url: 'http://api.assistente.dev.org.br/users',
    data: clone
  }).then(function(res){
    this.flash.status = res.data[0] ? 'success' : false;
    this.flash.message = 'Em breve você receberá uma mensagem!';
  }).catch(function(err){
    this.flash.status = 'error';
    this.flash.message = err;
  });
};
