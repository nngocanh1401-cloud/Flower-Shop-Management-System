import {
  __commonJS
} from "./chunk-EIB7IA3J.js";

// node_modules/rtl-detect/lib/rtl-detect.js
var require_rtl_detect = __commonJS({
  "node_modules/rtl-detect/lib/rtl-detect.js"(exports, module) {
    "use strict";
    var self;
    var RtlDetectLib = self = {
      // eslint-disable-line consistent-this
      // Private vars - star
      _regexEscape: /([\.\*\+\^\$\[\]\\\(\)\|\{\}\,\-\:\?])/g,
      // eslint-disable-line no-useless-escape
      _regexParseLocale: /^([a-zA-Z]*)([_\-a-zA-Z]*)$/,
      // Private vars - end
      // Private functions - star
      _escapeRegExpPattern: function(str) {
        if (typeof str !== "string") {
          return str;
        }
        return str.replace(self._regexEscape, "\\$1");
      },
      _toLowerCase: function(str, reserveReturnValue) {
        if (typeof str !== "string") {
          return reserveReturnValue && str;
        }
        return str.toLowerCase();
      },
      _toUpperCase: function(str, reserveReturnValue) {
        if (typeof str !== "string") {
          return reserveReturnValue && str;
        }
        return str.toUpperCase();
      },
      _trim: function(str, delimiter, reserveReturnValue) {
        var patterns = [];
        var regexp;
        var addPatterns = function(pattern2) {
          patterns.push("^" + pattern2 + "+|" + pattern2 + "+$");
        };
        if (typeof delimiter === "boolean") {
          reserveReturnValue = delimiter;
          delimiter = null;
        }
        if (typeof str !== "string") {
          return reserveReturnValue && str;
        }
        if (Array.isArray(delimiter)) {
          delimiter.map(function(item) {
            var pattern2 = self._escapeRegExpPattern(item);
            addPatterns(pattern2);
          });
        }
        if (typeof delimiter === "string") {
          var patternDelimiter = self._escapeRegExpPattern(delimiter);
          addPatterns(patternDelimiter);
        }
        if (!delimiter) {
          addPatterns("\\s");
        }
        var pattern = "(" + patterns.join("|") + ")";
        regexp = new RegExp(pattern, "g");
        while (str.match(regexp)) {
          str = str.replace(regexp, "");
        }
        return str;
      },
      _parseLocale: function(strLocale) {
        var matches = self._regexParseLocale.exec(strLocale);
        var parsedLocale;
        var lang;
        var countryCode;
        if (!strLocale || !matches) {
          return;
        }
        matches[2] = self._trim(matches[2], ["-", "_"]);
        lang = self._toLowerCase(matches[1]);
        countryCode = self._toUpperCase(matches[2]) || countryCode;
        parsedLocale = {
          lang,
          countryCode
        };
        return parsedLocale;
      },
      // Private functions - End
      // Public functions - star
      isRtlLang: function(strLocale) {
        var objLocale = self._parseLocale(strLocale);
        if (!objLocale) {
          return;
        }
        return self._BIDI_RTL_LANGS.indexOf(objLocale.lang) >= 0;
      },
      getLangDir: function(strLocale) {
        return self.isRtlLang(strLocale) ? "rtl" : "ltr";
      }
      // Public functions - End
    };
    Object.defineProperty(self, "_BIDI_RTL_LANGS", {
      value: [
        "ae",
        /* Avestan */
        "ar",
        /* 'العربية', Arabic */
        "arc",
        /* Aramaic */
        "bcc",
        /* 'بلوچی مکرانی', Southern Balochi */
        "bqi",
        /* 'بختياري', Bakthiari */
        "ckb",
        /* 'Soranî / کوردی', Sorani */
        "dv",
        /* Dhivehi */
        "fa",
        /* 'فارسی', Persian */
        "glk",
        /* 'گیلکی', Gilaki */
        "he",
        /* 'עברית', Hebrew */
        "ku",
        /* 'Kurdî / كوردی', Kurdish */
        "mzn",
        /* 'مازِرونی', Mazanderani */
        "nqo",
        /* N'Ko */
        "pnb",
        /* 'پنجابی', Western Punjabi */
        "prs",
        /* 'دری', Darī */
        "ps",
        /* 'پښتو', Pashto, */
        "sd",
        /* 'سنڌي', Sindhi */
        "ug",
        /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
        "ur",
        /* 'اردو', Urdu */
        "yi"
        /* 'ייִדיש', Yiddish */
      ],
      writable: false,
      enumerable: true,
      configurable: false
    });
    module.exports = RtlDetectLib;
  }
});

// node_modules/rtl-detect/index.js
var require_rtl_detect2 = __commonJS({
  "node_modules/rtl-detect/index.js"(exports, module) {
    var rtlDetect = require_rtl_detect();
    module.exports = {
      isRtlLang: rtlDetect.isRtlLang,
      getLangDir: rtlDetect.getLangDir
    };
  }
});
export default require_rtl_detect2();
//# sourceMappingURL=rtl-detect.js.map
