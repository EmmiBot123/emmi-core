'use strict';

window.goog = window.goog || {
  provide: function () { },
  require: function () { }
};

var Code = {};
Code.LANGUAGE_NAME = {
  'en': 'English 🇬🇧',
  'es': 'Español 🇪🇸',
  'pt': 'Português 🇵🇹',
  'it': 'Italiano 🇮🇹',
  'fr': 'Français 🇫🇷',
  'de': 'Deutsch 🇩🇪',
  'nl': 'Nederlands 🇳🇱',
  'cz': 'Čeština 🇨🇿',
  'pl': 'Polski 🇵🇱',
  'hu': 'Magyar 🇭🇺',
  'zh': '繁體中文 🇹🇼',
  'cn': '简体中文 🇨🇳',
  'ja': '日本語 🇯🇵',
  'tr': 'Türk 🇹🇷',
  'ru': 'Pусский 🇷🇺',
  'heb': 'עִברִית 🇮🇱',
  'bg': 'Български 🇧🇬',
  'ar': 'عربي 🇦🇪'
};
Code.LANGUAGE_RTL = ['ar', 'fa', 'he'];
Code.getLang = function () {
  var lang = window.localStorage.lang;
  if (lang === undefined) {
    lang = 'en';
    window.localStorage.lang = lang;
  }
  return lang;
};
Code.isRtl = function () {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};
Code.LANG = Code.getLang();

Code.initLanguage = function () {
  var rtl = Code.isRtl();
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', Code.LANG);

  // Build language menu
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  languages.sort(function (a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  });

  var languageMenu = document.getElementById('languageMenu');
  if (languageMenu) {
    languageMenu.innerHTML = '';
    for (var i = 0; i < languages.length; i++) {
      var tuple = languages[i];
      var langCode = tuple[1];
      var option = document.createElement('option');
      option.value = langCode;
      option.textContent = tuple[0];
      if (langCode === Code.LANG) option.selected = true;
      languageMenu.appendChild(option);
    }
  }

  // Set localized text on elements (only if MSG exists and the element exists)
  if (typeof MSG !== 'undefined') {
    var textMap = {
      'survol': 'survol',
      'btn_close_config': 'btn_close',
      'btn_valid_config': 'btn_valid',
      'btn_close_msg': 'btn_close'
    };
    for (var id in textMap) {
      var el = document.getElementById(id);
      if (el && MSG[textMap[id]]) el.textContent = MSG[textMap[id]];
    }

    // Set title attributes
    var titleMap = {
      'btn_preview': window.localStorage.prog !== 'python' ? 'btn_preview_ino' : 'btn_preview_py',
      'btn_saveino': window.localStorage.prog !== 'python' ? 'btn_save_ino' : 'btn_save_py',
      'btn_copy': 'btn_copy',
      'btn_undo': 'btn_undo',
      'btn_redo': 'btn_redo',
      'btn_search': 'btn_search',
      'btn_new': 'btn_new',
      'btn_saveXML': 'btn_saveXML',
      'btn_fakeload': 'btn_fakeload',
      'btn_term': 'btn_term',
      'btn_example': 'btn_example'
    };
    for (var id in titleMap) {
      var el = document.getElementById(id);
      if (el && MSG[titleMap[id]]) el.setAttribute('title', MSG[titleMap[id]]);
    }
  }

  // Set category names from Blockly.Msg
  document.querySelectorAll('xml category').forEach(function (cat) {
    if (!cat.getAttribute('id')) {
      cat.setAttribute('id', cat.getAttribute('name'));
      if (Blockly.Msg[cat.getAttribute('name')]) {
        cat.setAttribute('name', Blockly.Msg[cat.getAttribute('name')]);
      }
    }
  });
};

// Dynamically load language scripts
Code.loadScript = function (src) {
  return new Promise(function (resolve) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = resolve; // resolve anyway so Promise.all doesn't fail immediately
    document.head.appendChild(script);
  });
};

Code.loadLanguageScripts = function () {
  return Promise.all([
    Code.loadScript('/lang/msg_' + Code.LANG + '.js'),
    Code.loadScript('/lang/Blockly_' + Code.LANG + '.js'),
    Code.loadScript('/lang/microbit_' + Code.LANG + '.js'),
    Code.loadScript('/lang/Arduino_' + Code.LANG + '.js')
  ]);
};
