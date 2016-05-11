//Cnfig
Vue.http.options.emulateJSON = true;

new Vue({
  el: '#vue',

  data: {
    customers: [],
    formValues: {
      name: "",
      email: "",
      tel: "",
      description: "",
      status: ''
    },
    authenticated: false,
    update: false,
    currentIndex: undefined,
  },
  methods: {
    resetForm: function() {
      this.formValues = {
        name: "",
        email: "",
        tel: "",
        description: "",
        status: ''
      };
    },

    login: function() {
      var self = this;
      var lock = new Auth0Lock('nhZHsmxhYvJ0J7QpuEuD4smLIY2iHknc', 'rasmus1610.eu.auth0.com');
      lock.show((err, profile, token) => {
        if(err) {
          // TODO Handle the error
          console.log(err)
        } else {
          // Set the token and user profile in local storage
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', token);
          self.authenticated = true;
        }
      });
    },

    logout: function() {
      var self = this;
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      self.authenticated = false;
    },

    newCustomer: function() {
      var jwtHeader = { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') };
      if (this.formValues.name && this.formValues.email && this.formValues.tel && this.formValues.description) {
        this.$http.post("/api/customers", {
          name: this.formValues.name,
          email: this.formValues.email,
          telephone: this.formValues.tel,
          description: this.formValues.description,
          status: this.formValues.status
        }, {
          headers: jwtHeader
        }).then(function(res) {
          if (res.data.message) {
            console.log(res.data.message);
            this.resetForm();
            this.initialAjax();
          }
        }, function(res) {
          //TODO error handling
        });
      }
    },

    updateCustomer: function() {
      var jwtHeader = { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') };
      var itemId = this.customers[this.currentIndex]._id;
      this.$http.put('/api/customers/' + itemId, {
        name: this.formValues.name,
        email: this.formValues.email,
        telephone: this.formValues.tel,
        status: this.formValues.status,
        description: this.formValues.description
      }, {
        headers: jwtHeader
      }).then(function(res) {
        if (res.data.message) {
          console.log(res.data.message);
          this.resetForm();
          this.update = false;
          this.initialAjax();
        }
      }, function(res) {
        //TODO error handling
      });
    },

    handleFormSubmit: function(e) {
      e.preventDefault();
      if (!this.update) {
        this.newCustomer();
      } else {
        this.updateCustomer();
      }
    },

    deleteItem: function(index) {
      var jwtHeader = { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') };
      var itemId = this.customers[index]._id;
      this.$http.delete('/api/customers/' + itemId, {}, {
        headers: jwtHeader
      }).then(function(res) {
        if (res.data.message) {
          console.log(res.data.message);
        }
        this.initialAjax();
      });
    },

    updateItem: function(index) {
      var jwtHeader = { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') };
      var itemId = this.customers[index]._id;
      this.$http.get("/api/customers/" + itemId, {}, {
        headers: jwtHeader
      }).then(function(res) {
        this.formValues.name = res.data.name;
        this.formValues.email = res.data.email;
        this.formValues.tel = res.data.telephone;
        this.formValues.description = res.data.description;
        this.formValues.status = res.data.status;
        this.update = true;
        this.currentIndex = index;
      });
    },

    initialAjax: function() {
      var jwtHeader = { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') };
      // GET request
      this.$http.get('/api/customers', {}, {
        headers: jwtHeader
      }).then(function (res) {
          // success callback
          this.$set('customers', res.data);
      }, function (response) {
          // TODO error callback
      });
    }
  },

  ready: function() {
    this.initialAjax();
  }

});
