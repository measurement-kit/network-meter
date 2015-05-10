var ipc = require('ipc')
var Ractive = require('ractive')
var page = require('page')
var fs = require('fs')

Ractive.DEBUG = false

var templates = {
  dashboard: fs.readFileSync(__dirname + '/templates/dashboard.tmpl').toString(),
  install: fs.readFileSync(__dirname + '/templates/install.tmpl').toString(),
  run: fs.readFileSync(__dirname + '/templates/run.tmpl').toString(),
  settings: fs.readFileSync(__dirname + '/templates/settings.tmpl').toString()
}

var state = {}

var routes = {
  dashboard: function configure (ctx, next) {
    ctx.template = templates.dashboard
    state.dashboard = render(ctx, {})
  },
  install: function configure (ctx, next) {
    ctx.template = templates.install
    state.install = render(ctx, {})
  },
  run: function detail (ctx, next) {
    ctx.template = templates.run
    state.run = render(ctx, {})
  },
  settings: function about (ctx, next) {
    ctx.template = templates.settings
    state.settings = render(ctx, {})
  }
}

var events = {
  processAction: function (e) {
    var action = e.node.attributes['data-action'].value
    var procNameAttr = e.node.attributes['data-name']
    var data = {task: action}
    if (procNameAttr) data.name = procNameAttr.value
    ipc.send('task', data)
  },

  quit: function () {
    ipc.send('terminate')
  }

}

// set up routes
page('/', routes.dashboard)
page('/dashboard', routes.dashboard)
page('/install', routes.install)
page('/run', routes.run)
page('/settings', routes.settings)

// initialize router
page.start()
page('/dashboard')

function render (ctx) {
  var ract = new Ractive({
    el: '.page-content-wrapper',
    template: ctx.template,
    data: ctx.data
  })

  ract.on(events)
  return ract
}
