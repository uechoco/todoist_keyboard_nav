
const KEY = {
  TAB:9, ESC:27,
  LEFT:37, UP:38, RIGHT:39, DOWN:40,
  F: 70, G:71, I:73, L:76,
  P: 80, T:84, W:87, X:88,
};

const MODE = {
  ROOT: 'root',
  GLOBAL: 'global',
  LIST: 'list'
};

const LOG_MODE = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
}

var doc = document;
var log_mode = LOG_MODE.DEBUG;

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
 * insert mode_label
 */
(function() {
  var quickFindElem = doc.querySelector('div#quick_find');
  var elem = document.createElement('div');
  elem.id = 'tkn_mode_label';
  quickFindElem.insertBefore(elem, quickFindElem.firstChild);
})();

var changeModeLabel = function(label) {
  var modeLabelElem = doc.querySelector('div#tkn_mode_label');
  modeLabelElem.innerHTML = label;
};

/**
 * mode classes
 *
 * - RootMode
 *   - GlobalMode
 *   - ListMode
 */
var RootMode = function() {
  var self = this;
  this.name = MODE.ROOT;
  this.keydown = function(e) {
    switch (e.keyCode) {
      case KEY.G:
        e.preventDefault();
        changeMode(MODE.GLOBAL);
        break;
      case KEY.L:
        e.preventDefault();
        changeMode(MODE.LIST);
        break;
    }
  };
  this.onEnterMode = function() {
    changeModeLabel('---');
  };
  this.onLeaveMode = function(nextMode) {};
};

var GlobalMode = function() {
  var self = this;
  this.name = MODE.GLOBAL;
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
  };
  this.onEnterMode = function() {
    changeModeLabel(this.name);
  };
  this.onLeaveMode = function(nextMode) {};
};

var ListMode = function() {
  var self = this;
  this.name = MODE.LIST;
  this.keydown = function(e) {
    switch (e.keyCode) {
      case KEY.G:
        e.preventDefault();
        changeMode(MODE.GLOBAL);
        break;
      case KEY.ESC:
        e.preventDefault();
        changeMode(MODE.ROOT);
        break;
      default:
        logger.d('ListMode.keydown', e.keyCode);
        break;
    }
  };
  this.onEnterMode = function() {
    changeModeLabel(this.name);

    var taskItemNodeList = doc.querySelectorAll('div.list_editor ul.items li.task_item.menu_clickable');
    for (var i = 0; i < taskItemNodeList.length; ++i) {
      var taskItemLiElem = taskItemNodeList[i];
      var selectorElem = document.createElement('div');
      selectorElem.className = 'tkn_selector';
      selectorElem.innerHTML = '.';
      taskItemLiElem.insertBefore(selectorElem, taskItemLiElem.firstChild);
    }
  };
  this.onLeaveMode = function(nextMode) {
    var selectorNodeList = doc.querySelectorAll('div.list_editor ul.items li.task_item.menu_clickable div.tkn_selector');
    for (var i = 0; i < selectorNodeList.length; ++i) {
      selectorNodeList[i].remove();
    }
  };
};

var modeCache = {
  root  : new RootMode(),
  global: new GlobalMode(),
  list  : new ListMode()
};
var mode = undefined;
var changeMode = function(modeName) {
  if (mode) {
    mode.onLeaveMode(modeName);
  }
  mode = modeCache[modeName];
  mode.onEnterMode();
  logger.d('changeMode', modeName);
};
changeMode(MODE.ROOT);

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