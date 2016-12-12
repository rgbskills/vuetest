window.onload = function () {

  Vue.component('employee-row', {
    template: '#employee-row',
    props: ['employee'],
    data: function () {
      return {
        editMode: false,
        errors: {}
      }
    },
    methods: {
      // toggle the manager status which also updates the employee in the database
      toggleManagerStatus: function () {
        this.employee.manager = !this.employee.manager
        this.updateEmployee()
      },
      // ajax call for updating an employee
      updateEmployee: function () {
        var that = this;
        $.ajax({
          method: 'PUT',
          data: {
            employee: that.employee,
          },
          url: '/employees/' + that.employee.id + '.json',
          success: function(res) {
            that.errors = {}
            that.employee = res
            that.editMode = false
          },
          error: function(res) {
            that.errors = res.responseJSON.errors
          }
        })
      },
      fireEmployee: function () {
        var that = this;
        $.ajax({
          method: 'DELETE',
          url: '/employees/' + that.employee.id + '.json',
          success: function(res) {
            that.$el.remove();
          }
        })
      }
    }
  })

  var employees = new Vue({
    el: '#employees',
    data: {
      employees: [],
      employee: {
        name: '',
        email: '',
        manager: false
      },
      errors: {}
    },
    created: function () {
      this.fetchData();
    },
    methods: {
      fetchData: function () {
        var that;
        that = this; // because this is used inside $ajax
        $.ajax({
          url: '/employees.json',
          success: function(res) {
            that.employees = res;
          }
        });
      },
      hireEmployee: function () {
        var that = this;
        $.ajax({
          method: 'POST',
          data: {
            employee: that.employee,
          },
          url: '/employees.json',
          success: function(res) {
            that.errors = {}
            that.employees.push(res);
          },
          error: function(res) {
            that.errors = res.responseJSON.errors
          }
        })
      }
    }
  });
}