
const KEY = {
  NUM_0: 48, NUM_1: 49, NUM_2: 50, NUM_3: 51, NUM_4: 52,
  NUM_5: 53, NUM_6: 54, NUM_7: 55, NUM_8: 56, NUM_9: 57,
  A: 65, F: 70, G:71, I:73, L:76, N: 78,
  P: 80, T:84, W:87
};

const MODE = {
  ROOT: 'root',
  GLOBAL: 'global',
  ASTERISK: 'asterisk'
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
    switch (e.key)
    {
      case '*':
        e.preventDefault();
        changeMode(MODE.ASTERISK);
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
        var elem = doc.querySelector('#top_filters li[data-track=\'navigation|inbox\']').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.T: // Filter Today
        e.preventDefault();
        var elem = doc.querySelector('#top_filters li[data-track=\'navigation|today\']').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.W: // Filter Next 7 Days (weekly)
        e.preventDefault();
        var elem = doc.querySelector('#top_filters li[data-track=\'navigation|next_7_days\']').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.NUM_1: // Favorite Items
      case KEY.NUM_2:
      case KEY.NUM_3:
      case KEY.NUM_4:
      case KEY.NUM_5:
      case KEY.NUM_6:
      case KEY.NUM_7:
      case KEY.NUM_8:
      case KEY.NUM_9:
        e.preventDefault();
        var elemList = doc.querySelectorAll('#top_filters li.favorite_item');
        var index = e.keyCode - KEY.NUM_1;
        if (elemList.length > index)
        {
          elemList.item(index).click();
        }
        changeMode(MODE.ROOT);
        break;
      case KEY.P: // Toggle Open/Close Projects
        e.preventDefault();
        var elem = doc.querySelector('#list_holder div[data-track=\'navigation|projects_panel\']').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.F: // Toggle Open/Close Filters
        e.preventDefault();
        var elem = doc.querySelector('#list_holder div[data-track=\'navigation|filters_panel\']').click();
        changeMode(MODE.ROOT);
        break;
      case KEY.L: // Toggle Open/Close Labels
        e.preventDefault();
        var elem = doc.querySelector('#list_holder div[data-track=\'navigation|labels_panel\']').click();
        changeMode(MODE.ROOT);
        break;
      default:
        changeMode(MODE.ROOT);
        break;
    }
  }
};


var AsteriskMode = function() {
  var self = this;
  this.keydown = function(e) {
    switch (e.keyCode) {
      case KEY.A: // Select All
        e.preventDefault();
        var firstItemList = doc.querySelector('#editor ul.items'); // only focued to the first item list
        if (firstItemList) {
          var elemList = firstItemList.querySelectorAll('li.task_item.menu_clickable');
          if (elemList && elemList.length > 0) {
            setModeLock(true);
            var mouseEvent = new MouseEvent("mousedown", {
              button: 0, // Main button pressed (usually the left button) or un-initialized
              buttons: 1, // 	Main button pressed (usually the left button)
              shiftKey: true
            });
            elemList.forEach(function(elem){
              elem.dispatchEvent(mouseEvent);
            });
            setModeLock(false);
          }
        }
        break;
      case KEY.N: // Deselect All (via item_selecor)
        e.preventDefault();
        var deselectItemsElem = doc.querySelector('#item_selecter a.deselect_items');
        if (deselectItemsElem) {
          deselectItemsElem.click();
        }
        break;
      default:
        break;
    }
    changeMode(MODE.ROOT);
  }
};

var modeCache = {
  root  : new RootMode(),
  global: new GlobalMode(),
  asterisk: new AsteriskMode()
};
var mode = modeCache.root;
var modeLock = false;


var setModeLock = function(bLock) {
  modeLock = bLock ? true : false;
};

var changeMode = function(modeName) {
  if (modeLock) {
    logger.d('changeMode', 'The modeLock enabled. Cant change mode to ' + modeName);
  } else {
    mode = modeCache[modeName];
    logger.d('changeMode', 'Changed mode to ' + modeName);
  }
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
