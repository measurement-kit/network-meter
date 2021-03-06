var ipc = require('ipc')
var Ractive = require('ractive')
var page = require('page')
var fs = require('fs')
var pluginParser = require('./plugin-parser.js');
var exec = require('./exec.js');
var libplugin = require('./plugin.js');
var handler = require('./handler.js');

Ractive.DEBUG = false

var state = {}

exports.getState = function() {
    return state
}

exports.init = function() {
    var templates = {
      status_: fs.readFileSync(__dirname + '/templates/status.tmpl').toString(),
      install: fs.readFileSync(__dirname + '/templates/install.tmpl').toString(),
      run: fs.readFileSync(__dirname + '/templates/run.tmpl').toString(),
      settings: fs.readFileSync(__dirname + '/templates/settings.tmpl').toString()
    }

    var routes = {
      status_: function configure (ctx, next) {
        ctx.template = templates.status_
        state.status_ = render(ctx, {})
        handler.updateTests(state)
      },
      install: function configure (ctx, next) {
        ctx.template = templates.install
        state.install = render(ctx, {})
        pluginParser.loadPlugins(function(data){
            // actions can only be bound to grid after full initialization
            var temp_plugins;
            temp_plugins = state.install.get("plugins");
            if (temp_plugins == undefined) {
                temp_plugins = [];
            }
            temp_plugins.push(data);
            state.install.set("plugins", temp_plugins).then(libplugin.bindDeleteButtons(state));
        });
      },
      run: function detail (ctx, next) {
        ctx.template = templates.run
        state.run = render(ctx, {})
        pluginParser.loadPlugins(function(data){
            // actions can only be bound to grid after full initialization
            var temp_plugins;
            temp_plugins = state.run.get("plugins");
            if (temp_plugins == undefined) {
                temp_plugins = [];
            }
            temp_plugins.push(data);
            state.run.set("plugins", temp_plugins).then(exec.bindPluginGrid(state));
        });
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
    page('/', routes.status_)
    page('/status', routes.status_)
    page('/install', routes.install)
    page('/run', routes.run)
    page('/settings', routes.settings)

    // initialize router
    page.start()
    page('/status')

    state.page = page;

    function render (ctx) {
      var ract = new Ractive({
        el: '#container',
        template: ctx.template,
        data: ctx.data
      })

      ract.on(events)
      return ract
    }
}

