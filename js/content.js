
const KEY = {
  F: 70, G:71, I:73, L:76,
  P: 80, T:84, W:87
};

const MODE = {
  ROOT: 'root',
  GLOBAL: 'global'
};

const LOG_MODE = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
}

var doc = document;
var log_mode = LOG_MODE.ERROR;

var Logger = function() {
  var self = this;
  this.d = function(tag, msg) { if (log_mode <= LOG_MODE.DEBUG) self.log(tag, msg); }
  this.i = function(tag, msg) { if (log_mode <= LOG_MODE.INFO)  self.log(tag, msg); }
  this.w = function(tag, msg) { if (log_mode <= LOG_MODE.WARN)  self.log(tag, msg); }
  this.e = function(tag, msg) { if (log_mode <= LOG_MODE.ERROR) self.log(tag, msg); }
  this.f = function(tag, msg) { if (log_mode <= LOG_MODE.FATAL) self.log(tag, msg); }
  this.log = function(tag, msg) {
    console.log('[' + tag + '] ' + msg);
  }
};
var logger = new Logger();

/**
 * mode classes
 *
 * - RootMode
 *   - GlobalMode
 */
var RootMode = function() {
  var self = this;
  this.keydown = function(e) {
    switch (e.keyCode) {
      case KEY.G:
        e.preventDefault();
        changeMode(MODE.GLOBAL);
        break;
    }
  }
};

var GlobalMode = function() {
  var self = this;
  this.keydown = function(e) {
    switch (e.keyCode) {
      case KEY.I: // Filter Inbox
        e.preventDefault();
        var elem = doc.querySelector('img.cmp_filter_inbox').parentElement.click();
        changeMode(MODE.ROOT);
        break;
      case KEY.T: // Filter Today
        e.preventDefault();
        var elem = doc.querySelector('img.cmp_filter_today').parentElement.click();
        changeMode(MODE.ROOT);
        break;
      case KEY.W: // Filter Next 7 Days (weekly)
        e.preventDefault();
        var elem = doc.querySelector('img.cmp_filter_days').parentElement.click();
        changeMode(MODE.ROOT);
        break;
      case KEY.P: // Control Projects
        e.preventDefault();
        var elem = doc.querySelector('td.control.projects').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.F: // Control Filters
        e.preventDefault();
        var elem = doc.querySelector('td.control.filters').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.L: // Control Labels
        e.preventDefault();
        var elem = doc.querySelector('td.control.labels').click();
        changeMode(MODE.ROOT);
        break;
      default:
        changeMode(MODE.ROOT);
        break;
    }
  }
};

var modeCache = {
  root  : new RootMode(),
  global: new GlobalMode()
};
var mode = modeCache.root;


var changeMode = function(modeName) {
  mode = modeCache[modeName];
  logger.d('changeMode', modeName);
}

var keydown = function(e) {
  // don't invoke when current focused element is for input.
  var active = doc.activeElement;
  if (['TEXTAREA', 'INPUT', 'SELECT'].indexOf(active.tagName) != -1
    || active.classList.contains('richtext_editor')) {
    return;
  }

  if (mode) {
    mode.keydown(e);
  }
};

doc.addEventListener('keydown', keydown);