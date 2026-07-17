import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import require$$1 from "tty";
import require$$1$1 from "util";
import require$$0 from "os";
import require$$0$1 from "buffer";
import require$$0$2 from "events";
import net from "net";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var modbus = {};
var modbusTcpClient = {};
var modbusClient = {};
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    Object.keys(env).forEach(function(key) {
      createDebug[key] = env[key];
    });
    createDebug.instances = [];
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      var hash = 0;
      for (var i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      var prevTime;
      function debug2() {
        if (!debug2.enabled) {
          return;
        }
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var self2 = debug2;
        var curr = Number(/* @__PURE__ */ new Date());
        var ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") {
            return match;
          }
          index++;
          var formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        var logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = createDebug.enabled(namespace);
      debug2.useColors = createDebug.useColors();
      debug2.color = selectColor(namespace);
      debug2.destroy = destroy;
      debug2.extend = extend;
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      createDebug.instances.push(debug2);
      return debug2;
    }
    function destroy() {
      var index = createDebug.instances.indexOf(this);
      if (index !== -1) {
        createDebug.instances.splice(index, 1);
        return true;
      }
      return false;
    }
    function extend(namespace, delimiter) {
      return createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      var i;
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
      for (i = 0; i < createDebug.instances.length; i++) {
        var instance = createDebug.instances[i];
        instance.enabled = createDebug.enabled(instance.namespace);
      }
    }
    function disable() {
      createDebug.enable("");
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      var i;
      var len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      var _console;
      return (typeof console === "undefined" ? "undefined" : _typeof(console)) === "object" && console.log && (_console = console).log.apply(_console, arguments);
    }
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    var formatters = module.exports.formatters;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0;
  const tty = require$$1;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    var tty = require$$1;
    var util = require$$1$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      var supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      var name = this.namespace, useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log() {
      return process.stderr.write(util.format.apply(util, arguments) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports);
    var formatters = module.exports.formatters;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src.exports = requireBrowser();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
var request = {};
var exception$1 = {};
var codes = {};
var errors$1 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ErrorMessages = {
    1: "ILLEGAL FUNCTION",
    2: "ILLEGAL DATA ADDRESS",
    3: "ILLEGAL DATA VALUE",
    4: "SLAVE DEVICE FAILURE",
    5: "ACKNOWLEDGE",
    6: "SLAVE DEVICE BUSY",
    8: "MEMORY PARITY ERROR",
    10: "GATEWAY PATH UNAVAILABLE",
    11: "GATEWAY TARGET DEVICE FAILED TO RESPOND"
  };
  function errorCodeToMessage(x) {
    if (isErrorCode(x)) {
      return exports.ErrorMessages[x];
    } else {
      throw new Error("");
    }
  }
  exports.errorCodeToMessage = errorCodeToMessage;
  function isErrorCode(x) {
    switch (x) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 10:
      case 11:
        return true;
      default:
        return false;
    }
  }
  exports.isErrorCode = isErrorCode;
})(errors$1);
var functionCodes = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var FC;
  (function(FC2) {
    FC2[FC2["READ_COIL"] = 1] = "READ_COIL";
    FC2[FC2["READ_DISCRETE_INPUT"] = 2] = "READ_DISCRETE_INPUT";
    FC2[FC2["READ_HOLDING_REGISTERS"] = 3] = "READ_HOLDING_REGISTERS";
    FC2[FC2["READ_INPUT_REGISTERS"] = 4] = "READ_INPUT_REGISTERS";
    FC2[FC2["WRITE_SINGLE_COIL"] = 5] = "WRITE_SINGLE_COIL";
    FC2[FC2["WRITE_SINGLE_HOLDING_REGISTER"] = 6] = "WRITE_SINGLE_HOLDING_REGISTER";
    FC2[FC2["WRITE_MULTIPLE_COILS"] = 15] = "WRITE_MULTIPLE_COILS";
    FC2[FC2["WRITE_MULTIPLE_HOLDING_REGISTERS"] = 16] = "WRITE_MULTIPLE_HOLDING_REGISTERS";
  })(FC = exports.FC || (exports.FC = {}));
  function isFunctionCode(x) {
    if (FC[x] === void 0) {
      return false;
    } else {
      return true;
    }
  }
  exports.isFunctionCode = isFunctionCode;
})(functionCodes);
(function(exports) {
  function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(errors$1);
  __export(functionCodes);
})(codes);
var requestBody = {};
var __importDefault$B = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(requestBody, "__esModule", { value: true });
const debug_1$1 = __importDefault$B(srcExports);
debug_1$1.default("request-body");
class ModbusRequestBody {
  constructor(fc) {
    if (new.target === ModbusRequestBody) {
      throw new TypeError("Cannot construct ModbusRequestBody directly.");
    }
    this._fc = fc;
  }
  get fc() {
    return this._fc;
  }
  get isException() {
    return false;
  }
  get isModbusRequestBody() {
    return true;
  }
}
requestBody.default = ModbusRequestBody;
function isModbusRequestBody(x) {
  if (x.isModbusRequestBody) {
    return true;
  } else {
    return false;
  }
}
requestBody.isModbusRequestBody = isModbusRequestBody;
var __importDefault$A = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exception$1, "__esModule", { value: true });
const codes_1$c = codes;
const request_body_js_1$8 = __importDefault$A(requestBody);
class ExceptionRequestBody extends request_body_js_1$8.default {
  get code() {
    return this._code;
  }
  get name() {
    return "ExceptionRequest";
  }
  get count() {
    return 0;
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return true;
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      if (fc > 43) {
        return null;
      }
      return new ExceptionRequestBody(fc, 1);
    } catch (e) {
      return null;
    }
  }
  constructor(fc, code) {
    if (!codes_1$c.isFunctionCode(fc)) {
      throw Error("InvalidFunctionCode");
    }
    super(fc);
    this._code = code;
  }
  createPayload() {
    const payload = Buffer.alloc(2);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt8(this._code, 1);
    return payload;
  }
}
exception$1.default = ExceptionRequestBody;
function isExceptionRequestBody(x) {
  if (x instanceof ExceptionRequestBody) {
    return true;
  } else {
    return false;
  }
}
exception$1.isExceptionRequestBody = isExceptionRequestBody;
var readCoils$1 = {};
var __importDefault$z = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readCoils$1, "__esModule", { value: true });
const index_js_1$7 = codes;
const request_body_js_1$7 = __importDefault$z(requestBody);
class ReadCoilsRequestBody extends request_body_js_1$7.default {
  get start() {
    return this._start;
  }
  get count() {
    return this._count;
  }
  get name() {
    return "ReadCoils";
  }
  get byteCount() {
    return 5;
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      if (fc !== index_js_1$7.FC.READ_COIL) {
        return null;
      }
      const start = buffer.readUInt16BE(1);
      const quantity = buffer.readUInt16BE(3);
      return new ReadCoilsRequestBody(start, quantity);
    } catch (e) {
      return null;
    }
  }
  constructor(start, count) {
    super(index_js_1$7.FC.READ_COIL);
    this._start = start;
    this._count = count;
    if (this._start > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (this._count > 2e3) {
      throw new Error("InvalidQuantity");
    }
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._count, 3);
    return payload;
  }
}
readCoils$1.default = ReadCoilsRequestBody;
function isReadCoilsRequestBody(x) {
  if (x instanceof ReadCoilsRequestBody) {
    return true;
  } else {
    return false;
  }
}
readCoils$1.isReadCoilsRequestBody = isReadCoilsRequestBody;
var readDiscreteInputs$1 = {};
var __importDefault$y = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readDiscreteInputs$1, "__esModule", { value: true });
const codes_1$b = codes;
const request_body_js_1$6 = __importDefault$y(requestBody);
class ReadDiscreteInputsRequestBody extends request_body_js_1$6.default {
  get start() {
    return this._start;
  }
  get count() {
    return this._count;
  }
  get name() {
    return "ReadDiscreteInput";
  }
  get byteCount() {
    return 5;
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      if (fc !== codes_1$b.FC.READ_DISCRETE_INPUT) {
        return null;
      }
      const start = buffer.readUInt16BE(1);
      const quantity = buffer.readUInt16BE(3);
      return new ReadDiscreteInputsRequestBody(start, quantity);
    } catch (e) {
      return null;
    }
  }
  constructor(start, count) {
    super(codes_1$b.FC.READ_DISCRETE_INPUT);
    if (start > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (count > 2e3) {
      throw new Error("InvalidQuantity");
    }
    this._start = start;
    this._count = count;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._count, 3);
    return payload;
  }
}
readDiscreteInputs$1.default = ReadDiscreteInputsRequestBody;
function isReadDiscreteInputsRequestBody(x) {
  if (x instanceof ReadDiscreteInputsRequestBody) {
    return true;
  } else {
    return false;
  }
}
readDiscreteInputs$1.isReadDiscreteInputsRequestBody = isReadDiscreteInputsRequestBody;
var readHoldingRegisters$1 = {};
var __importDefault$x = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readHoldingRegisters$1, "__esModule", { value: true });
const codes_1$a = codes;
const request_body_js_1$5 = __importDefault$x(requestBody);
class ReadHoldingRegistersRequestBody extends request_body_js_1$5.default {
  get start() {
    return this._start;
  }
  get count() {
    return this._count;
  }
  get byteCount() {
    return 5;
  }
  get name() {
    return "ReadHoldingRegisters";
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const start = buffer.readUInt16BE(1);
      const count = buffer.readUInt16BE(3);
      if (fc !== codes_1$a.FC.READ_HOLDING_REGISTERS) {
        return null;
      }
      return new ReadHoldingRegistersRequestBody(start, count);
    } catch (e) {
      return null;
    }
  }
  constructor(start, count) {
    super(codes_1$a.FC.READ_HOLDING_REGISTERS);
    if (start > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (count > 2e3) {
      throw new Error("InvalidQuantity");
    }
    this._start = start;
    this._count = count;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._count, 3);
    return payload;
  }
}
readHoldingRegisters$1.default = ReadHoldingRegistersRequestBody;
function isReadHoldingRegistersRequestBody(x) {
  if (x instanceof ReadHoldingRegistersRequestBody) {
    return true;
  } else {
    return false;
  }
}
readHoldingRegisters$1.isReadHoldingRegistersRequestBody = isReadHoldingRegistersRequestBody;
var readInputRegisters$1 = {};
var __importDefault$w = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readInputRegisters$1, "__esModule", { value: true });
const codes_1$9 = codes;
const request_body_js_1$4 = __importDefault$w(requestBody);
class ReadInputRegistersRequestBody extends request_body_js_1$4.default {
  get start() {
    return this._start;
  }
  get count() {
    return this._count;
  }
  get name() {
    return "ReadInputRegisters";
  }
  get byteCount() {
    return 5;
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const start = buffer.readUInt16BE(1);
      const count = buffer.readUInt16BE(3);
      if (fc !== codes_1$9.FC.READ_INPUT_REGISTERS) {
        return null;
      }
      return new ReadInputRegistersRequestBody(start, count);
    } catch (e) {
      return null;
    }
  }
  constructor(start, count) {
    super(codes_1$9.FC.READ_INPUT_REGISTERS);
    if (start > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (count > 2e3) {
      throw new Error("InvalidQuantity");
    }
    this._start = start;
    this._count = count;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._count, 3);
    return payload;
  }
}
readInputRegisters$1.default = ReadInputRegistersRequestBody;
function isReadInputRegistersRequestBody(x) {
  if (x instanceof ReadInputRegistersRequestBody) {
    return true;
  } else {
    return false;
  }
}
readInputRegisters$1.isReadInputRegistersRequestBody = isReadInputRegistersRequestBody;
var requestFactory = {};
var writeMultipleCoils$1 = {};
var __importDefault$v = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeMultipleCoils$1, "__esModule", { value: true });
const codes_1$8 = codes;
const request_body_js_1$3 = __importDefault$v(requestBody);
class WriteMultipleCoilsRequestBody extends request_body_js_1$3.default {
  get address() {
    return this._address;
  }
  get values() {
    return this._values;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get quantity() {
    return this._quantity;
  }
  get count() {
    return this.quantity;
  }
  get byteCount() {
    return this._byteCount;
  }
  get numberOfBytes() {
    return this._numberOfBytes;
  }
  get name() {
    return "WriteMultipleCoils";
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      if (fc !== codes_1$8.FC.WRITE_MULTIPLE_COILS) {
        return null;
      }
      const address = buffer.readUInt16BE(1);
      const quantity = buffer.readUInt16BE(3);
      const numberOfBytes = buffer.readUInt8(5);
      const values = buffer.slice(6, 6 + numberOfBytes);
      return new WriteMultipleCoilsRequestBody(address, values, quantity);
    } catch (e) {
      return null;
    }
  }
  constructor(address, values, quantity) {
    super(codes_1$8.FC.WRITE_MULTIPLE_COILS);
    if (address > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (Array.isArray(values) && values.length > 1968 * 8) {
      throw new Error("InvalidArraySize");
    }
    if (values instanceof Buffer) {
      if (values.length > 1968) {
        throw new Error("InvalidBufferSize");
      }
      if (quantity !== void 0 && values.length * 8 < quantity) {
        throw new Error("InvalidBufferSize");
      }
    }
    this._address = address;
    this._values = values;
    this._quantity = quantity || values.length;
    this._numberOfBytes = Math.ceil(this._quantity / 8);
    if (this._values instanceof Buffer) {
      this._valuesAsBuffer = this._values;
      this._byteCount = Math.ceil(this._quantity / 8) + 6;
      this._valuesAsArray = [];
      for (let i = 0; i < this._quantity; i += 1) {
        const pos = i % 8;
        const curByteIdx = Math.floor(i / 8);
        const curByte = this._values.readUInt8(curByteIdx);
        this._valuesAsArray.push((curByte & Math.pow(2, pos)) > 0);
      }
    } else if (this._values instanceof Array) {
      this._byteCount = Math.ceil(this._values.length / 8) + 6;
      this._valuesAsArray = this._values;
      const len = Math.min(1968, this._values.length);
      let curByte = 0;
      let curByteIdx = 0;
      let cntr = 0;
      const bytes = Buffer.allocUnsafe(this._numberOfBytes);
      for (let i = 0; i < len; i += 1) {
        curByte += this._values[i] ? Math.pow(2, cntr) : 0;
        cntr = (cntr + 1) % 8;
        if (cntr === 0 || i === len - 1) {
          bytes.writeUInt8(curByte, curByteIdx);
          curByteIdx = curByteIdx + 1;
          curByte = 0;
        }
      }
      this._valuesAsBuffer = bytes;
    } else {
      throw new Error("InvalidType_MustBeBufferOrArray");
    }
  }
  createPayload() {
    const payload = Buffer.alloc(this._byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._quantity, 3);
    payload.writeUInt8(this._numberOfBytes, 5);
    this._valuesAsBuffer.copy(payload, 6, 0, this._byteCount);
    return payload;
  }
}
writeMultipleCoils$1.default = WriteMultipleCoilsRequestBody;
function isWriteMultipleCoilsRequestBody(x) {
  if (x instanceof WriteMultipleCoilsRequestBody) {
    return true;
  } else {
    return false;
  }
}
writeMultipleCoils$1.isWriteMultipleCoilsRequestBody = isWriteMultipleCoilsRequestBody;
var writeMultipleRegisters$1 = {};
var __importDefault$u = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeMultipleRegisters$1, "__esModule", { value: true });
const codes_1$7 = codes;
const request_body_js_1$2 = __importDefault$u(requestBody);
class WriteMultipleRegistersRequestBody extends request_body_js_1$2.default {
  get address() {
    return this._address;
  }
  get quantity() {
    return this._quantity;
  }
  get count() {
    return this.quantity;
  }
  get values() {
    return this._values;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get byteCount() {
    return this._byteCount;
  }
  get numberOfBytes() {
    return this._numberOfBytes;
  }
  get name() {
    return "WriteMultipleRegisters";
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const address = buffer.readUInt16BE(1);
      const numberOfBytes = buffer.readUInt8(5);
      const values = buffer.slice(6, 6 + numberOfBytes);
      if (fc !== codes_1$7.FC.WRITE_MULTIPLE_HOLDING_REGISTERS) {
        return null;
      }
      return new WriteMultipleRegistersRequestBody(address, values);
    } catch (e) {
      return null;
    }
  }
  constructor(address, values) {
    super(codes_1$7.FC.WRITE_MULTIPLE_HOLDING_REGISTERS);
    if (address > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (Array.isArray(values) && values.length > 123) {
      throw new Error("InvalidArraySize");
    }
    if (values instanceof Buffer && values.length > 123 * 2) {
      throw new Error("InvalidBufferSize");
    }
    this._address = address;
    this._values = values;
    if (this._values instanceof Buffer) {
      this._byteCount = Math.min(this._values.length + 6, 246);
      this._numberOfBytes = this._values.length;
      this._quantity = Math.floor(this._values.length / 2);
      this._valuesAsBuffer = this._values;
      this._valuesAsArray = [];
      for (let i = 0; i < this._values.length; i += 2) {
        this._valuesAsArray.push(this._values.readUInt16BE(i));
      }
    } else if (this._values instanceof Array) {
      this._valuesAsArray = this._values;
      this._byteCount = Math.min(this._values.length * 2 + 6, 246);
      this._numberOfBytes = Math.floor(this._values.length * 2);
      this._quantity = this._values.length;
      this._valuesAsBuffer = Buffer.alloc(this._numberOfBytes);
      this._values.forEach((v, i) => {
        this._valuesAsBuffer.writeUInt16BE(v, i * 2);
      });
    } else {
      throw new Error("InvalidType_MustBeBufferOrArray");
    }
  }
  createPayload() {
    const payload = Buffer.alloc(6 + this._numberOfBytes);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._quantity, 3);
    payload.writeUInt8(this._numberOfBytes, 5);
    this._valuesAsBuffer.copy(payload, 6);
    return payload;
  }
}
writeMultipleRegisters$1.default = WriteMultipleRegistersRequestBody;
function isWriteMultipleRegistersRequestBody(x) {
  if (x instanceof WriteMultipleRegistersRequestBody) {
    return true;
  } else {
    return false;
  }
}
writeMultipleRegisters$1.isWriteMultipleRegistersRequestBody = isWriteMultipleRegistersRequestBody;
var writeSingleCoil$1 = {};
var __importDefault$t = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeSingleCoil$1, "__esModule", { value: true });
const index_js_1$6 = codes;
const request_body_js_1$1 = __importDefault$t(requestBody);
class WriteSingleCoilRequestBody extends request_body_js_1$1.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value ? 65280 : 0;
  }
  get byteCount() {
    return 5;
  }
  get count() {
    return 1;
  }
  get name() {
    return "WriteSingleCoil";
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const address = buffer.readUInt16BE(1);
      const value = buffer.readUInt16BE(3) === 65280;
      if (fc !== index_js_1$6.FC.WRITE_SINGLE_COIL) {
        return null;
      }
      return new WriteSingleCoilRequestBody(address, value);
    } catch (e) {
      return null;
    }
  }
  constructor(address, value) {
    super(index_js_1$6.FC.WRITE_SINGLE_COIL);
    if (address > 65535) {
      throw new Error("InvalidStartAddress");
    }
    this._address = address;
    this._value = value;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._value ? 65280 : 0, 3);
    return payload;
  }
}
writeSingleCoil$1.default = WriteSingleCoilRequestBody;
function isWriteSingleCoilRequestBody(x) {
  if (x instanceof WriteSingleCoilRequestBody) {
    return true;
  } else {
    return false;
  }
}
writeSingleCoil$1.isWriteSingleCoilRequestBody = isWriteSingleCoilRequestBody;
var writeSingleRegister$1 = {};
var __importDefault$s = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeSingleRegister$1, "__esModule", { value: true });
const codes_1$6 = codes;
const request_body_js_1 = __importDefault$s(requestBody);
class WriteSingleRegisterRequestBody extends request_body_js_1.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value;
  }
  get name() {
    return "WriteSingleRegister";
  }
  get quantity() {
    return 1;
  }
  get count() {
    return 1;
  }
  get byteCount() {
    return 5;
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const address = buffer.readUInt16BE(1);
      const value = buffer.readUInt16BE(3);
      if (fc !== codes_1$6.FC.WRITE_SINGLE_HOLDING_REGISTER) {
        return null;
      }
      return new WriteSingleRegisterRequestBody(address, value);
    } catch (e) {
      return null;
    }
  }
  constructor(address, value) {
    super(codes_1$6.FC.WRITE_SINGLE_HOLDING_REGISTER);
    if (address > 65535) {
      throw new Error("InvalidStartAddress");
    }
    if (!Number.isInteger(value) || value < 0 || value > 65535) {
      throw new Error("InvalidValue");
    }
    this._address = address;
    this._value = value;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._value, 3);
    return payload;
  }
}
writeSingleRegister$1.default = WriteSingleRegisterRequestBody;
function isWriteSingleRegisterRequestBody(x) {
  if (x instanceof WriteSingleRegisterRequestBody) {
    return true;
  } else {
    return false;
  }
}
writeSingleRegister$1.isWriteSingleRegisterRequestBody = isWriteSingleRegisterRequestBody;
var __importDefault$r = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(requestFactory, "__esModule", { value: true });
const codes_1$5 = codes;
const exception_js_1$2 = __importDefault$r(exception$1);
const read_coils_js_1$1 = __importDefault$r(readCoils$1);
const read_discrete_inputs_js_1$1 = __importDefault$r(readDiscreteInputs$1);
const read_holding_registers_js_1$1 = __importDefault$r(readHoldingRegisters$1);
const read_input_registers_js_1$1 = __importDefault$r(readInputRegisters$1);
const write_multiple_coils_js_1$1 = __importDefault$r(writeMultipleCoils$1);
const write_multiple_registers_js_1$1 = __importDefault$r(writeMultipleRegisters$1);
const write_single_coil_js_1$1 = __importDefault$r(writeSingleCoil$1);
const write_single_register_js_1$1 = __importDefault$r(writeSingleRegister$1);
const debug_1 = __importDefault$r(srcExports);
const debug$h = debug_1.default("request-factory");
class RequestFactory {
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      debug$h("fc", fc, "payload", buffer);
      if (codes_1$5.isFunctionCode(fc)) {
        switch (fc) {
          case codes_1$5.FC.READ_COIL:
            return read_coils_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.READ_DISCRETE_INPUT:
            return read_discrete_inputs_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.READ_HOLDING_REGISTERS:
            return read_holding_registers_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.READ_INPUT_REGISTERS:
            return read_input_registers_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.WRITE_SINGLE_COIL:
            return write_single_coil_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return write_single_register_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.WRITE_MULTIPLE_COILS:
            return write_multiple_coils_js_1$1.default.fromBuffer(buffer);
          case codes_1$5.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return write_multiple_registers_js_1$1.default.fromBuffer(buffer);
        }
      }
      if (fc <= 43) {
        debug$h("Illegal Function (fc %d)", fc);
        return new exception_js_1$2.default(fc, 1);
      }
    } catch (e) {
      debug$h("Exception while reading function code", e);
      return null;
    }
  }
}
requestFactory.default = RequestFactory;
Object.defineProperty(request, "__esModule", { value: true });
var exception_1$1 = exception$1;
request.ExceptionRequestBody = exception_1$1.default;
request.isExceptionRequestBody = exception_1$1.isExceptionRequestBody;
var read_coils_1$1 = readCoils$1;
request.ReadCoilsRequestBody = read_coils_1$1.default;
request.isReadCoilsRequestBody = read_coils_1$1.isReadCoilsRequestBody;
var read_discrete_inputs_1$1 = readDiscreteInputs$1;
request.ReadDiscreteInputsRequestBody = read_discrete_inputs_1$1.default;
request.isReadDiscreteInputsRequestBody = read_discrete_inputs_1$1.isReadDiscreteInputsRequestBody;
var read_holding_registers_1$1 = readHoldingRegisters$1;
request.ReadHoldingRegistersRequestBody = read_holding_registers_1$1.default;
request.isReadHoldingRegistersRequestBody = read_holding_registers_1$1.isReadHoldingRegistersRequestBody;
var read_input_registers_1$1 = readInputRegisters$1;
request.ReadInputRegistersRequestBody = read_input_registers_1$1.default;
request.isReadInputRegistersRequestBody = read_input_registers_1$1.isReadInputRegistersRequestBody;
var request_body_1 = requestBody;
request.ModbusRequestBody = request_body_1.default;
request.isModbusRequestBody = request_body_1.isModbusRequestBody;
var request_factory_1 = requestFactory;
request.RequestFactory = request_factory_1.default;
var write_multiple_coils_1$1 = writeMultipleCoils$1;
request.WriteMultipleCoilsRequestBody = write_multiple_coils_1$1.default;
request.isWriteMultipleCoilsRequestBody = write_multiple_coils_1$1.isWriteMultipleCoilsRequestBody;
var write_multiple_registers_1$1 = writeMultipleRegisters$1;
request.WriteMultipleRegistersRequestBody = write_multiple_registers_1$1.default;
request.isWriteMultipleRegistersRequestBody = write_multiple_registers_1$1.isWriteMultipleRegistersRequestBody;
var write_single_coil_1$1 = writeSingleCoil$1;
request.WriteSingleCoilRequestBody = write_single_coil_1$1.default;
request.isWriteSingleCoilRequestBody = write_single_coil_1$1.isWriteSingleCoilRequestBody;
var write_single_register_1$1 = writeSingleRegister$1;
request.WriteSingleRegisterRequestBody = write_single_register_1$1.default;
request.isWriteSingleRegisterRequestBody = write_single_register_1$1.isWriteSingleRegisterRequestBody;
Object.defineProperty(modbusClient, "__esModule", { value: true });
const Debug$g = srcExports;
const debug$g = Debug$g("modbus-client");
const request_1 = request;
class MBClient {
  constructor(socket2) {
    if (new.target === MBClient) {
      throw new TypeError("Cannot instantiate ModbusClient directly.");
    }
    this._socket = socket2;
    if (!socket2) {
      throw new Error("NoSocketException.");
    }
    this._socket.on("data", this._onData.bind(this));
  }
  get connectionState() {
    return this._requestHandler.state;
  }
  get socket() {
    return this._socket;
  }
  get requestCount() {
    return this._requestHandler.requestCount;
  }
  readCoils(start, count) {
    debug$g("issuing new read coils request");
    let request2;
    try {
      request2 = new request_1.ReadCoilsRequestBody(start, count);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  readDiscreteInputs(start, count) {
    debug$g("issuing new read discrete inputs request");
    let request2;
    try {
      request2 = new request_1.ReadDiscreteInputsRequestBody(start, count);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  readHoldingRegisters(start, count) {
    debug$g("issuing new read holding registers request");
    let request2;
    try {
      request2 = new request_1.ReadHoldingRegistersRequestBody(start, count);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  readInputRegisters(start, count) {
    debug$g("issuing new read input registers request");
    let request2;
    try {
      request2 = new request_1.ReadInputRegistersRequestBody(start, count);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  writeSingleCoil(address, value) {
    debug$g("issuing new write single coil request");
    let request2;
    try {
      request2 = new request_1.WriteSingleCoilRequestBody(address, value);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  writeSingleRegister(address, value) {
    debug$g("issuing new write single register request");
    let request2;
    try {
      request2 = new request_1.WriteSingleRegisterRequestBody(address, value);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  writeMultipleCoils(start, values, quantity = 0) {
    debug$g("issuing new write multiple coils request");
    let request2;
    try {
      if (values instanceof Buffer) {
        request2 = new request_1.WriteMultipleCoilsRequestBody(start, values, quantity);
      } else {
        request2 = new request_1.WriteMultipleCoilsRequestBody(start, values);
      }
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  writeMultipleRegisters(start, values) {
    debug$g("issuing new write multiple registers request");
    let request2;
    try {
      request2 = new request_1.WriteMultipleRegistersRequestBody(start, values);
    } catch (e) {
      debug$g("unknown request error occurred");
      return Promise.reject(e);
    }
    return this._requestHandler.register(request2);
  }
  manuallyClearRequests(numRequests) {
    return this._requestHandler.manuallyRejectRequests(numRequests);
  }
  manuallyRejectCurrentRequest() {
    return this._requestHandler.manuallyRejectCurrentRequest();
  }
  customErrorRequest(err) {
    return this._requestHandler.customErrorRequest(err);
  }
  _onData(data) {
    debug$g("received data");
    this._responseHandler.handleData(data);
    do {
      const response2 = this._responseHandler.shift();
      if (!response2) {
        return;
      }
      if (this.unitId === response2.unitId) {
        this._requestHandler.handle(response2);
      }
    } while (1);
  }
}
modbusClient.default = MBClient;
var tcpClientRequestHandler = {};
var clientRequestHandler = {};
var exception = {};
var responseBody = {};
Object.defineProperty(responseBody, "__esModule", { value: true });
const codes_1$4 = codes;
class ModbusBaseResponseBody {
  get fc() {
    return this._fc;
  }
  get isException() {
    return false;
  }
  static fromRequest(requestBody2, buf) {
    throw new TypeError("Cannot call from request from abstract class");
  }
  constructor(fc, ignoreInvalidFunctionCode = false) {
    if (ignoreInvalidFunctionCode === false) {
      if (!codes_1$4.isFunctionCode(fc)) {
        throw Error("InvalidFunctionCode");
      }
    }
    this._fc = fc;
  }
}
responseBody.default = ModbusBaseResponseBody;
var __importDefault$q = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exception, "__esModule", { value: true });
const codes_1$3 = codes;
const response_body_js_1 = __importDefault$q(responseBody);
class ExceptionResponseBody extends response_body_js_1.default {
  get code() {
    return this._code;
  }
  get message() {
    return codes_1$3.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return true;
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0) - 128;
    const code = buffer.readUInt8(1);
    if (!codes_1$3.isFunctionCode(fc)) {
      throw Error("InvalidFunctionCode");
    }
    return new ExceptionResponseBody(fc, code);
  }
  static fromRequest(requestBody2) {
    return new ExceptionResponseBody(requestBody2.fc, requestBody2.code);
  }
  constructor(fc, code) {
    const ignoreInvalidFunctionCode = true;
    super(fc, ignoreInvalidFunctionCode);
    this._code = code;
  }
  createPayload() {
    const payload = Buffer.alloc(2);
    payload.writeUInt8(this._fc + 128, 0);
    payload.writeUInt8(this._code, 1);
    return payload;
  }
}
exception.default = ExceptionResponseBody;
function isExceptionResponseBody(x) {
  if (x instanceof ExceptionResponseBody) {
    return true;
  } else {
    return false;
  }
}
exception.isExceptionResponseBody = isExceptionResponseBody;
var userRequestError = {};
Object.defineProperty(userRequestError, "__esModule", { value: true });
class UserRequestError {
  constructor({ err, message, response: response2, request: request2 }) {
    this.err = err;
    this.message = message;
    this.request = request2;
    this.response = response2;
  }
}
userRequestError.UserRequestError = UserRequestError;
function isUserRequestError$1(x) {
  if (x instanceof isUserRequestError$1) {
    return true;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (x.err === void 0 || typeof x.err !== "string") {
    return false;
  }
  if (x.message === void 0 || typeof x.message !== "string") {
    return false;
  }
  return true;
}
userRequestError.isUserRequestError = isUserRequestError$1;
var userRequest = {};
var userRequestMetrics = {};
Object.defineProperty(userRequestMetrics, "__esModule", { value: true });
class UserRequestMetrics {
  constructor() {
    this.createdAt = /* @__PURE__ */ new Date();
    this.startedAt = /* @__PURE__ */ new Date();
    this.receivedAt = /* @__PURE__ */ new Date();
  }
  get transferTime() {
    return this.receivedAt.getTime() - this.startedAt.getTime();
  }
  get waitTime() {
    return this.startedAt.getTime() - this.createdAt.getTime();
  }
  toJSON() {
    return Object.assign({}, this, { transferTime: this.transferTime });
  }
}
userRequestMetrics.UserRequestMetrics = UserRequestMetrics;
Object.defineProperty(userRequest, "__esModule", { value: true });
const user_request_error_1$4 = userRequestError;
const user_request_metrics_1$1 = userRequestMetrics;
const Debug$f = srcExports;
const debug$f = Debug$f("user-request");
class UserRequest {
  constructor(request2, timeout = 5e3) {
    debug$f("creating new user request with timeout", timeout);
    this._request = request2;
    this._timeout = timeout;
    this._metrics = new user_request_metrics_1$1.UserRequestMetrics();
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(cb) {
    this._metrics.startedAt = /* @__PURE__ */ new Date();
    this._timer = setTimeout(() => {
      this._reject(new user_request_error_1$4.UserRequestError({
        err: "Timeout",
        message: "Req timed out",
        request: this._request
      }));
      cb();
    }, this._timeout);
  }
  get metrics() {
    return this._metrics;
  }
  done() {
    clearTimeout(this._timer);
  }
  get request() {
    return this._request;
  }
  get timeout() {
    return this._timeout;
  }
  get promise() {
    return this._promise;
  }
  resolve(response2) {
    this._metrics.receivedAt = /* @__PURE__ */ new Date();
    debug$f("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime);
    return this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: response2
    });
  }
  get reject() {
    return this._reject;
  }
}
userRequest.default = UserRequest;
var __importDefault$p = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(clientRequestHandler, "__esModule", { value: true });
const OUT_OF_SYNC$1 = "OutOfSync";
const OFFLINE = "Offline";
const MODBUS_EXCEPTION = "ModbusException";
const MANUALLY_CLEARED = "ManuallyCleared";
const Debug$e = srcExports;
const debug$e = Debug$e("client-request-handler");
const exception_js_1$1 = __importDefault$p(exception);
const user_request_error_1$3 = userRequestError;
const user_request_js_1$1 = __importDefault$p(userRequest);
class MBClientRequestHandler {
  constructor(socket2, timeout) {
    if (new.target === MBClientRequestHandler) {
      throw new TypeError("Cannot instantiate ModbusClientRequestHandler directly.");
    }
    this._socket = socket2;
    this._timeout = timeout;
    this._state = "offline";
  }
  get state() {
    return this._state;
  }
  get requestCount() {
    return this._requests.length;
  }
  registerRequest(request2) {
    const userRequest2 = new user_request_js_1$1.default(request2, this._timeout);
    this._requests.push(userRequest2);
    this._flush();
    return userRequest2.promise;
  }
  handle(response2) {
    debug$e("incoming response");
    if (!response2) {
      debug$e("well, sorry I was wrong, no response at all");
      return;
    }
    const userRequest2 = this._currentRequest;
    if (!userRequest2) {
      debug$e("no current request, no idea where this came from");
      return;
    }
    const request2 = userRequest2.request;
    if (response2.body.isException === false && response2.body.fc !== request2.body.fc) {
      debug$e("something is weird, request fc and response fc do not match.");
      userRequest2.reject(new user_request_error_1$3.UserRequestError({
        err: OUT_OF_SYNC$1,
        message: "request fc and response fc does not match.",
        request: request2
      }));
      this._clearAllRequests();
      return;
    }
    if (response2.body instanceof exception_js_1$1.default) {
      debug$e("response is a exception");
      userRequest2.reject(new user_request_error_1$3.UserRequestError({
        err: MODBUS_EXCEPTION,
        message: `A Modbus Exception Occurred - See Response Body`,
        request: request2,
        response: response2
      }));
      this._clearCurrentRequest();
      this._flush();
      return;
    }
    debug$e("resolving request");
    userRequest2.resolve(response2);
    this._clearCurrentRequest();
    this._flush();
  }
  manuallyRejectCurrentRequest() {
    if (this._currentRequest) {
      this._currentRequest.reject(new user_request_error_1$3.UserRequestError({
        err: MANUALLY_CLEARED,
        message: "the request was manually cleared",
        request: this._currentRequest.request
      }));
      this._flush();
    }
  }
  manuallyRejectRequests(numRequests) {
    for (let i = 0; i < numRequests; i++) {
      this.manuallyRejectCurrentRequest();
    }
  }
  manuallylRejectAllRequests() {
    this.manuallyRejectRequests(this.requestCount);
  }
  customErrorRequest(err) {
    if (this._currentRequest) {
      this._currentRequest.reject(err);
    }
  }
  _clearCurrentRequest() {
    if (!this._currentRequest) {
      return;
    }
    this._currentRequest.done();
    this._currentRequest = null;
  }
  _clearAllRequests() {
    this._clearCurrentRequest();
    while (this._requests.length > 0) {
      const req = this._requests.shift();
      if (req) {
        req.reject(new user_request_error_1$3.UserRequestError({
          err: OUT_OF_SYNC$1,
          message: "rejecting because of earlier OutOfSync error",
          request: req.request
        }));
      }
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline";
    this._currentRequest && this._currentRequest.reject(new user_request_error_1$3.UserRequestError({
      err: OFFLINE,
      message: "connection to modbus server closed",
      request: this._currentRequest.request
    }));
    this._clearAllRequests();
  }
  _flush() {
    debug$e("flushing");
    if (this._currentRequest !== null) {
      debug$e("executing another request, come back later");
      return;
    }
    if (this._requests.length === 0) {
      debug$e("no request to be executed");
      return;
    }
    this._currentRequest = this._requests.shift();
    if (this._state === "offline") {
      debug$e("rejecting request immediatly, client offline");
      this._currentRequest && this._currentRequest.reject(new user_request_error_1$3.UserRequestError({
        err: OFFLINE,
        message: "no connection to modbus server",
        request: this._currentRequest.request
      }));
      this._clearCurrentRequest();
      setTimeout(this._flush.bind(this), 0);
      return;
    }
    const payload = this._currentRequest && this._currentRequest.createPayload();
    debug$e("flushing new request", payload);
    this._currentRequest && this._currentRequest.start(() => {
      this._clearCurrentRequest();
      this._flush();
    });
    this._socket.write(payload, (err) => {
      debug$e("request fully flushed, ( error:", err, ")");
    });
  }
}
clientRequestHandler.default = MBClientRequestHandler;
var tcpRequest = {};
var abstractRequest = {};
Object.defineProperty(abstractRequest, "__esModule", { value: true });
class ModbusAbstractRequest {
}
ModbusAbstractRequest.fromBuffer = (buffer) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
abstractRequest.default = ModbusAbstractRequest;
function isModbusRequest(x) {
  if (x.body !== void 0) {
    return true;
  } else {
    return false;
  }
}
abstractRequest.isModbusRequest = isModbusRequest;
var __importDefault$o = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(tcpRequest, "__esModule", { value: true });
const Debug$d = srcExports;
const debug$d = Debug$d("tcp-request");
const abstract_request_js_1$1 = __importDefault$o(abstractRequest);
const request_factory_js_1$1 = __importDefault$o(requestFactory);
class ModbusTCPRequest extends abstract_request_js_1$1.default {
  constructor(id, protocol, length, unitId, body) {
    super();
    this._id = id;
    this._protocol = protocol;
    this._length = length;
    this._unitId = unitId;
    this._body = body;
  }
  get id() {
    return this._id;
  }
  get protocol() {
    return this._protocol;
  }
  get length() {
    return this._length;
  }
  get unitId() {
    return this._unitId;
  }
  get address() {
    return this.unitId;
  }
  get slaveId() {
    return this.unitId;
  }
  get name() {
    return this._body.name;
  }
  get body() {
    return this._body;
  }
  get corrupted() {
    return false;
  }
  get byteCount() {
    return this._length + 6;
  }
  static fromBuffer(buffer) {
    try {
      if (buffer.length < 7) {
        debug$d("no enough data in the buffer yet");
        return null;
      }
      const id = buffer.readUInt16BE(0);
      const protocol = buffer.readUInt16BE(2);
      const length = buffer.readUInt16BE(4);
      const unitId = buffer.readUInt8(6);
      debug$d("tcp header complete, id", id, "protocol", protocol, "length", length, "unitId", unitId);
      debug$d("buffer", buffer);
      const body = request_factory_js_1$1.default.fromBuffer(buffer.slice(7, 6 + length));
      if (!body) {
        return null;
      }
      return new ModbusTCPRequest(id, protocol, length, unitId, body);
    } catch (e) {
      debug$d("not enough data to create a tcp request", e);
      return null;
    }
  }
  createPayload() {
    const body = this._body.createPayload();
    const payload = Buffer.alloc(7 + this._body.byteCount);
    payload.writeUInt16BE(this._id, 0);
    payload.writeUInt16BE(0, 2);
    payload.writeUInt16BE(this._body.byteCount + 1, 4);
    payload.writeUInt8(this._unitId, 6);
    body.copy(payload, 7);
    return payload;
  }
}
tcpRequest.default = ModbusTCPRequest;
var __importDefault$n = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(tcpClientRequestHandler, "__esModule", { value: true });
const Debug$c = srcExports;
const debug$c = Debug$c("tcp-client-request-handler");
const client_request_handler_js_1$1 = __importDefault$n(clientRequestHandler);
const tcp_request_js_1$1 = __importDefault$n(tcpRequest);
const user_request_error_1$2 = userRequestError;
const OUT_OF_SYNC = "OutOfSync";
const PROTOCOL = "Protocol";
class ModbusTCPClientRequestHandler extends client_request_handler_js_1$1.default {
  constructor(socket2, unitId, timeout = 5e3) {
    super(socket2, timeout);
    this._requestId = 0;
    this._unitId = unitId;
    this._requests = [];
    this._currentRequest = null;
    this._socket.on("connect", this._onConnect.bind(this));
    this._socket.on("close", this._onClose.bind(this));
  }
  register(requestBody2) {
    this._requestId = (this._requestId + 1) % 65535;
    debug$c("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", requestBody2.byteCount);
    const tcpRequest2 = new tcp_request_js_1$1.default(this._requestId, 0, requestBody2.byteCount + 1, this._unitId, requestBody2);
    return super.registerRequest(tcpRequest2);
  }
  handle(response2) {
    if (!response2) {
      return;
    }
    const userRequest2 = this._currentRequest;
    if (!userRequest2) {
      debug$c("something is strange, received a respone without a request");
      return;
    }
    const request2 = userRequest2.request;
    if (response2.id !== request2.id) {
      debug$c("something weird is going on, response transition id does not equal request transition id", response2.id, request2.id);
      userRequest2.reject(new user_request_error_1$2.UserRequestError({
        err: OUT_OF_SYNC,
        message: "request fc and response fc does not match.",
        request: request2
      }));
      this._clearAllRequests();
      return;
    }
    if (response2.protocol !== 0) {
      debug$c("server responds with wrong protocol version");
      userRequest2.reject(new user_request_error_1$2.UserRequestError({
        err: PROTOCOL,
        message: "Unknown protocol version " + response2.protocol,
        request: request2
      }));
      this._clearAllRequests();
      return;
    }
    super.handle(response2);
  }
}
tcpClientRequestHandler.default = ModbusTCPClientRequestHandler;
var tcpClientResponseHandler = {};
var clientResponseHandler = {};
Object.defineProperty(clientResponseHandler, "__esModule", { value: true });
class ModbusClientResponseHandler {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
clientResponseHandler.default = ModbusClientResponseHandler;
var tcpResponse = {};
var abstractResponse = {};
Object.defineProperty(abstractResponse, "__esModule", { value: true });
class ModbusAbstractResponse {
  get body() {
    return this._body;
  }
  static fromRequest(request2, body) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
abstractResponse.default = ModbusAbstractResponse;
var responseFactory = {};
var readCoils = {};
const Debug$b = srcExports;
const debug$b = Debug$b("buffer-utils");
class BufferUtils {
  static bufferShift(startAddress, endAddress, outputs) {
    startAddress = startAddress - 1;
    const startShift = startAddress % 8;
    const startByte = Math.floor(startAddress / 8);
    const endByte = Math.floor(endAddress / 8);
    const size = endByte - startByte + 1;
    const buffer = Buffer.allocUnsafe(size);
    buffer[0] = outputs[0] << startShift;
    debug$b("buffer[0] = %s ( %s << %d )", buffer[0].toString(2), outputs[0].toString(2), startShift);
    const paddedBuffer = Buffer.concat([outputs, Buffer.alloc(1)], outputs.length + 1);
    for (let i = 1; i < size; i++) {
      buffer[i] = (paddedBuffer[i] << startShift) + (paddedBuffer[i - 1] >> 8 - startShift);
      debug$b("buffer[%d] = %s ( %s << %d + %s >> %d)", i, buffer[i].toString(2), paddedBuffer[i].toString(2), startShift, paddedBuffer[i - 1].toString(2), 8 - startAddress);
    }
    return buffer;
  }
  static firstByte(startAddress, originalByte, outputByte) {
    startAddress = startAddress - 1;
    const startShift = startAddress % 8;
    const mask = 255 >> 8 - startShift;
    const maskedOriginalByte = originalByte & mask;
    return outputByte + maskedOriginalByte;
  }
  static lastByte(endAddress, originalByte, outputByte) {
    const endShift = endAddress % 8;
    const mask = 255 << endShift;
    const maskedOriginalByte = originalByte & mask;
    return outputByte + maskedOriginalByte;
  }
  static bufferToArrayStatus(buffer) {
    const statusArray = [];
    let pos;
    let curByteIdx;
    let curByte;
    if (!(buffer instanceof Buffer)) {
      return statusArray;
    }
    for (let i = 0; i < buffer.length * 8; i += 1) {
      pos = i % 8;
      curByteIdx = Math.floor(i / 8);
      curByte = buffer.readUInt8(curByteIdx);
      const value = (curByte & Math.pow(2, pos)) > 0;
      statusArray.push(value ? 1 : 0);
    }
    return statusArray;
  }
  static arrayStatusToBuffer(array) {
    const byteCount = array instanceof Array ? Math.ceil(array.length / 8) : 0;
    const buffer = Buffer.alloc(byteCount);
    if (!(array instanceof Array)) {
      return buffer;
    }
    let byteOffset;
    let bitOffset;
    let byte;
    for (let i = 0; i < array.length; i += 1) {
      byteOffset = Math.floor(i / 8);
      bitOffset = i % 8;
      byte = buffer.readUInt8(byteOffset);
      byte += array[i] ? Math.pow(2, bitOffset) : 0;
      buffer.writeUInt8(byte, byteOffset);
    }
    return buffer;
  }
}
var bufferUtils = BufferUtils;
var readResponseBody = {};
var __importDefault$m = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readResponseBody, "__esModule", { value: true });
const response_body_1$2 = __importDefault$m(responseBody);
class ModbusReadResponseBody extends response_body_1$2.default {
  constructor(fc) {
    super(fc);
  }
  get fc() {
    return this._fc;
  }
}
readResponseBody.default = ModbusReadResponseBody;
var __importDefault$l = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readCoils, "__esModule", { value: true });
const Debug$a = srcExports;
const debug$a = Debug$a("read-coils-response");
const buffer_utils_js_1$1 = __importDefault$l(bufferUtils);
const codes_1$2 = codes;
const read_response_body_js_1$3 = __importDefault$l(readResponseBody);
const { bufferToArrayStatus: bufferToArrayStatus$1, arrayStatusToBuffer: arrayStatusToBuffer$1 } = buffer_utils_js_1$1.default;
class ReadCoilsResponseBody extends read_response_body_js_1$3.default {
  get values() {
    return this._coils;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get numberOfBytes() {
    return this._numberOfBytes;
  }
  get byteCount() {
    return this._numberOfBytes + 2;
  }
  static fromRequest(requestBody2, coils) {
    const coilsStatus = bufferToArrayStatus$1(coils);
    const start = requestBody2.start;
    const end = start + requestBody2.count;
    const coilsSegment = coilsStatus.slice(start, end);
    return new ReadCoilsResponseBody(coilsSegment, Math.ceil(coilsSegment.length / 8));
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const byteCount = buffer.readUInt8(1);
      const coilStatus = buffer.slice(2, 2 + byteCount);
      if (coilStatus.length !== byteCount) {
        return null;
      }
      if (fc !== codes_1$2.FC.READ_COIL) {
        return null;
      }
      return new ReadCoilsResponseBody(coilStatus, byteCount);
    } catch (e) {
      debug$a("no valid read coils response body in the buffer yet");
      return null;
    }
  }
  constructor(coils, numberOfBytes) {
    super(codes_1$2.FC.READ_COIL);
    this._coils = coils;
    this._numberOfBytes = numberOfBytes;
    if (coils instanceof Array) {
      this._valuesAsArray = coils;
      this._valuesAsBuffer = arrayStatusToBuffer$1(coils);
    } else if (coils instanceof Buffer) {
      this._valuesAsBuffer = coils;
      this._valuesAsArray = bufferToArrayStatus$1(coils);
    } else {
      throw new Error("InvalidCoilsInput");
    }
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt8(this._numberOfBytes, 1);
    this._valuesAsBuffer.copy(payload, 2);
    return payload;
  }
}
readCoils.default = ReadCoilsResponseBody;
var readDiscreteInputs = {};
var __importDefault$k = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readDiscreteInputs, "__esModule", { value: true });
const buffer_utils_js_1 = __importDefault$k(bufferUtils);
const index_js_1$5 = codes;
const read_response_body_js_1$2 = __importDefault$k(readResponseBody);
const { bufferToArrayStatus, arrayStatusToBuffer } = buffer_utils_js_1.default;
class ReadDiscreteInputsResponseBody extends read_response_body_js_1$2.default {
  get discrete() {
    return this._discrete;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get numberOfBytes() {
    return this._numberOfBytes;
  }
  get byteCount() {
    return this._numberOfBytes + 2;
  }
  static fromRequest(requestBody2, discreteInputs) {
    const discreteStatus = bufferToArrayStatus(discreteInputs);
    const start = requestBody2.start;
    const end = start + requestBody2.count;
    const segmentStatus = discreteStatus.slice(start, end);
    return new ReadDiscreteInputsResponseBody(segmentStatus, Math.ceil(segmentStatus.length / 8));
  }
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      const byteCount = buffer.readUInt8(1);
      const coilStatus = buffer.slice(2, 2 + byteCount);
      if (coilStatus.length !== byteCount) {
        return null;
      }
      if (fc !== index_js_1$5.FC.READ_DISCRETE_INPUT) {
        return null;
      }
      return new ReadDiscreteInputsResponseBody(coilStatus, byteCount);
    } catch (e) {
      return null;
    }
  }
  constructor(discrete, numberOfBytes) {
    super(index_js_1$5.FC.READ_DISCRETE_INPUT);
    this._discrete = discrete;
    this._numberOfBytes = numberOfBytes;
    if (discrete instanceof Array) {
      this._valuesAsArray = discrete;
      this._valuesAsBuffer = arrayStatusToBuffer(discrete);
    } else if (discrete instanceof Buffer) {
      this._valuesAsBuffer = discrete;
      this._valuesAsArray = bufferToArrayStatus(discrete);
    } else {
      throw new Error("InvalidType_MustBeBufferOrArray");
    }
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt8(this._numberOfBytes, 1);
    this._valuesAsBuffer.copy(payload, 2);
    return payload;
  }
}
readDiscreteInputs.default = ReadDiscreteInputsResponseBody;
var readHoldingRegisters = {};
var __importDefault$j = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readHoldingRegisters, "__esModule", { value: true });
const Debug$9 = srcExports;
const debug$9 = Debug$9("ReadHoldingRegistersResponseBody");
const codes_1$1 = codes;
const read_response_body_js_1$1 = __importDefault$j(readResponseBody);
class ReadHoldingRegistersResponseBody extends read_response_body_js_1$1.default {
  get byteCount() {
    return this._bufferLength;
  }
  get values() {
    return this._values;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get length() {
    return this._values.length;
  }
  static fromRequest(requestBody2, holdingRegisters) {
    const startByte = requestBody2.start * 2;
    const endByte = requestBody2.start * 2 + requestBody2.count * 2;
    const bufferSegment = holdingRegisters.slice(startByte, endByte);
    return new ReadHoldingRegistersResponseBody(bufferSegment.length, bufferSegment);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const byteCount = buffer.readUInt8(1);
    const payload = buffer.slice(2, 2 + byteCount);
    if (fc !== codes_1$1.FC.READ_HOLDING_REGISTERS) {
      return null;
    }
    const values = [];
    for (let i = 0; i < byteCount; i += 2) {
      values.push(payload.readUInt16BE(i));
    }
    return new ReadHoldingRegistersResponseBody(byteCount, values, payload);
  }
  constructor(byteCount, values, payload) {
    super(codes_1$1.FC.READ_HOLDING_REGISTERS);
    this._byteCount = byteCount;
    this._values = values;
    this._bufferLength = 2;
    debug$9("ReadHoldingRegistersResponseBody values", values);
    if (values instanceof Array) {
      this._valuesAsArray = values;
      this._valuesAsBuffer = Buffer.from(values);
      this._bufferLength += values.length * 2;
    } else if (values instanceof Buffer) {
      this._valuesAsArray = Uint16Array.from(values);
      this._valuesAsBuffer = values;
      this._bufferLength += values.length;
    } else {
      throw new Error("InvalidType_MustBeBufferOrArray");
    }
    if (payload instanceof Buffer) {
      this._valuesAsBuffer = payload;
    }
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let payload = Buffer.alloc(2);
      payload.writeUInt8(this._fc, 0);
      payload.writeUInt8(this._byteCount, 1);
      payload = Buffer.concat([payload, this._values]);
      return payload;
    }
    if (this._values instanceof Array) {
      const payload = Buffer.alloc(this._byteCount + 2);
      payload.writeUInt8(this._fc, 0);
      payload.writeUInt8(this._byteCount, 1);
      this._values.forEach((value, i) => {
        payload.writeUInt16BE(Math.max(0, Math.min(65535, value)), 2 * i + 2);
      });
      return payload;
    }
    throw new Error("InvalidType_MustBeBufferOrArray");
  }
}
readHoldingRegisters.default = ReadHoldingRegistersResponseBody;
var readInputRegisters = {};
var __importDefault$i = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(readInputRegisters, "__esModule", { value: true });
const index_js_1$4 = codes;
const read_response_body_js_1 = __importDefault$i(readResponseBody);
class ReadInputRegistersResponseBody extends read_response_body_js_1.default {
  get byteCount() {
    return this._bufferLength;
  }
  get values() {
    return this._values;
  }
  get valuesAsArray() {
    return this._valuesAsArray;
  }
  get valuesAsBuffer() {
    return this._valuesAsBuffer;
  }
  get length() {
    return this._values.length;
  }
  static fromRequest(requestBody2, inputRegisters) {
    const startByte = requestBody2.start * 2;
    const endByte = startByte + requestBody2.count * 2;
    const buf = inputRegisters.slice(startByte, endByte);
    return new ReadInputRegistersResponseBody(buf.length, buf);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const byteCount = buffer.readUInt8(1);
    const payload = buffer.slice(2, 2 + byteCount);
    if (fc !== index_js_1$4.FC.READ_INPUT_REGISTERS) {
      return null;
    }
    const values = [];
    for (let i = 0; i < byteCount; i += 2) {
      values.push(payload.readUInt16BE(i));
    }
    return new ReadInputRegistersResponseBody(byteCount, values, payload);
  }
  constructor(byteCount, values, payload) {
    super(index_js_1$4.FC.READ_INPUT_REGISTERS);
    this._byteCount = byteCount;
    this._values = values;
    this._bufferLength = 2;
    if (values instanceof Array) {
      this._valuesAsArray = values;
      this._valuesAsBuffer = Buffer.from(values);
      this._bufferLength += values.length * 2;
    } else if (values instanceof Buffer) {
      this._valuesAsArray = Uint16Array.from(values);
      this._valuesAsBuffer = values;
      this._bufferLength += values.length;
    } else {
      throw new Error("InvalidType_MustBeBufferOrArray");
    }
    if (payload instanceof Buffer) {
      this._valuesAsBuffer = payload;
    }
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let payload = Buffer.alloc(2);
      payload.writeUInt8(this._fc, 0);
      payload.writeUInt8(this._byteCount, 1);
      payload = Buffer.concat([payload, this._values]);
      return payload;
    }
    if (this._values instanceof Array) {
      const payload = Buffer.alloc(this._byteCount + 2);
      payload.writeUInt8(this._fc, 0);
      payload.writeUInt8(this._byteCount, 1);
      this._values.forEach((value, i) => {
        payload.writeUInt16BE(Math.max(0, Math.min(65535, value)), 2 + 2 * i);
      });
      return payload;
    }
    throw new Error("this._values is not an instance of a Buffer or an Array");
  }
}
readInputRegisters.default = ReadInputRegistersResponseBody;
var writeMultipleCoils = {};
var writeResponse_body = {};
var __importDefault$h = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeResponse_body, "__esModule", { value: true });
const response_body_1$1 = __importDefault$h(responseBody);
class ModbusWriteResponseBody extends response_body_1$1.default {
}
writeResponse_body.default = ModbusWriteResponseBody;
var __importDefault$g = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeMultipleCoils, "__esModule", { value: true });
const index_js_1$3 = codes;
const write_response_body_js_1$2 = __importDefault$g(writeResponse_body);
class WriteMultipleCoilsResponseBody extends write_response_body_js_1$2.default {
  get start() {
    return this._start;
  }
  get quantity() {
    return this._quantity;
  }
  get count() {
    return this.quantity;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(requestBody2) {
    const start = requestBody2.address;
    const quantity = requestBody2.quantity;
    return new WriteMultipleCoilsResponseBody(start, quantity);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const start = buffer.readUInt16BE(1);
    const quantity = buffer.readUInt16BE(3);
    if (fc !== index_js_1$3.FC.WRITE_MULTIPLE_COILS) {
      return null;
    }
    return new WriteMultipleCoilsResponseBody(start, quantity);
  }
  constructor(start, quantity) {
    super(index_js_1$3.FC.WRITE_MULTIPLE_COILS);
    this._start = start;
    this._quantity = quantity;
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._quantity, 3);
    return payload;
  }
}
writeMultipleCoils.default = WriteMultipleCoilsResponseBody;
var writeMultipleRegisters = {};
var __importDefault$f = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeMultipleRegisters, "__esModule", { value: true });
const codes_1 = codes;
const write_response_body_1 = __importDefault$f(writeResponse_body);
class WriteMultipleRegistersResponseBody extends write_response_body_1.default {
  get start() {
    return this._start;
  }
  get quantity() {
    return this._quantity;
  }
  get count() {
    return this.quantity;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(requestBody2) {
    const start = requestBody2.address;
    const quantity = requestBody2.quantity;
    return new WriteMultipleRegistersResponseBody(start, quantity);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const start = buffer.readUInt16BE(1);
    const quantity = buffer.readUInt16BE(3);
    if (fc !== codes_1.FC.WRITE_MULTIPLE_HOLDING_REGISTERS) {
      return null;
    }
    return new WriteMultipleRegistersResponseBody(start, quantity);
  }
  constructor(start, quantity) {
    super(codes_1.FC.WRITE_MULTIPLE_HOLDING_REGISTERS);
    this._start = start;
    this._quantity = quantity;
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._start, 1);
    payload.writeUInt16BE(this._quantity, 3);
    return payload;
  }
}
writeMultipleRegisters.default = WriteMultipleRegistersResponseBody;
var writeSingleCoil = {};
var __importDefault$e = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeSingleCoil, "__esModule", { value: true });
const index_js_1$2 = codes;
const write_response_body_js_1$1 = __importDefault$e(writeResponse_body);
class WriteSingleCoilResponseBody extends write_response_body_js_1$1.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value === 65280;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(requestBody2) {
    const address = requestBody2.address;
    const value = requestBody2.value;
    return new WriteSingleCoilResponseBody(address, value);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const address = buffer.readUInt16BE(1);
    const value = buffer.readUInt16BE(3) === 65280;
    if (fc !== index_js_1$2.FC.WRITE_SINGLE_COIL) {
      return null;
    }
    return new WriteSingleCoilResponseBody(address, value);
  }
  constructor(address, value) {
    super(index_js_1$2.FC.WRITE_SINGLE_COIL);
    this._address = address;
    this._value = value === 65280 ? 65280 : 0;
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._value, 3);
    return payload;
  }
}
writeSingleCoil.default = WriteSingleCoilResponseBody;
var writeSingleRegister = {};
var __importDefault$d = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(writeSingleRegister, "__esModule", { value: true });
const index_js_1$1 = codes;
const write_response_body_js_1 = __importDefault$d(writeResponse_body);
class WriteSingleRegisterResponseBody extends write_response_body_js_1.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(requestBody2) {
    const address = requestBody2.address;
    const value = requestBody2.value;
    return new WriteSingleRegisterResponseBody(address, value);
  }
  static fromBuffer(buffer) {
    const fc = buffer.readUInt8(0);
    const address = buffer.readUInt16BE(1);
    const value = buffer.readUInt16BE(3);
    if (fc !== index_js_1$1.FC.WRITE_SINGLE_HOLDING_REGISTER) {
      return null;
    }
    return new WriteSingleRegisterResponseBody(address, value);
  }
  constructor(address, value) {
    super(index_js_1$1.FC.WRITE_SINGLE_HOLDING_REGISTER);
    this._address = address;
    this._value = value;
  }
  createPayload() {
    const payload = Buffer.alloc(5);
    payload.writeUInt8(this._fc, 0);
    payload.writeUInt16BE(this._address, 1);
    payload.writeUInt16BE(this._value, 3);
    return payload;
  }
}
writeSingleRegister.default = WriteSingleRegisterResponseBody;
var __importDefault$c = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(responseFactory, "__esModule", { value: true });
const Debug$8 = srcExports;
const debug$8 = Debug$8("response-factory");
const index_js_1 = codes;
const exception_js_1 = __importDefault$c(exception);
const read_coils_js_1 = __importDefault$c(readCoils);
const read_discrete_inputs_js_1 = __importDefault$c(readDiscreteInputs);
const read_holding_registers_js_1 = __importDefault$c(readHoldingRegisters);
const read_input_registers_js_1 = __importDefault$c(readInputRegisters);
const write_multiple_coils_js_1 = __importDefault$c(writeMultipleCoils);
const write_multiple_registers_js_1 = __importDefault$c(writeMultipleRegisters);
const write_single_coil_js_1 = __importDefault$c(writeSingleCoil);
const write_single_register_js_1 = __importDefault$c(writeSingleRegister);
class ResponseFactory {
  static fromBuffer(buffer) {
    try {
      const fc = buffer.readUInt8(0);
      debug$8("fc", fc, "payload", buffer);
      if (fc > 128) {
        return exception_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.READ_COIL) {
        return read_coils_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.READ_DISCRETE_INPUT) {
        return read_discrete_inputs_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.READ_HOLDING_REGISTERS) {
        return read_holding_registers_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.READ_INPUT_REGISTERS) {
        return read_input_registers_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.WRITE_SINGLE_COIL) {
        return write_single_coil_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.WRITE_SINGLE_HOLDING_REGISTER) {
        return write_single_register_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.WRITE_MULTIPLE_COILS) {
        return write_multiple_coils_js_1.default.fromBuffer(buffer);
      }
      if (fc === index_js_1.FC.WRITE_MULTIPLE_HOLDING_REGISTERS) {
        return write_multiple_registers_js_1.default.fromBuffer(buffer);
      }
      return null;
    } catch (e) {
      debug$8("when NoSuchIndex Exception, the buffer does not contain a complete message");
      debug$8(e);
      return null;
    }
  }
}
responseFactory.default = ResponseFactory;
var __importDefault$b = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(tcpResponse, "__esModule", { value: true });
const Debug$7 = srcExports;
const debug$7 = Debug$7("tcp-response");
const abstract_response_js_1$1 = __importDefault$b(abstractResponse);
const response_factory_js_1$1 = __importDefault$b(responseFactory);
class ModbusTCPResponse extends abstract_response_js_1$1.default {
  constructor(id, protocol, bodyLength, unitId, body) {
    super();
    this._id = id;
    this._protocol = protocol;
    this._bodyLength = bodyLength;
    this._unitId = unitId;
    this._body = body;
  }
  get id() {
    return this._id;
  }
  get protocol() {
    return this._protocol;
  }
  get bodyLength() {
    return this._bodyLength;
  }
  get byteCount() {
    return this._bodyLength + 6;
  }
  get unitId() {
    return this._unitId;
  }
  get slaveId() {
    return this._unitId;
  }
  get address() {
    return this._unitId;
  }
  get body() {
    return this._body;
  }
  static fromRequest(tcpRequest2, modbusBody) {
    return new ModbusTCPResponse(tcpRequest2.id, tcpRequest2.protocol, modbusBody.byteCount + 1, tcpRequest2.unitId, modbusBody);
  }
  static fromBuffer(buffer) {
    try {
      const id = buffer.readUInt16BE(0);
      const protocol = buffer.readUInt16BE(2);
      const length = buffer.readUInt16BE(4);
      const unitId = buffer.readUInt8(6);
      debug$7("tcp header complete, id", id, "protocol", protocol, "length", length, "unitId", unitId);
      debug$7("buffer", buffer);
      const body = response_factory_js_1$1.default.fromBuffer(buffer.slice(7, 7 + length - 1));
      if (!body) {
        debug$7("not enough data for a response body");
        return null;
      }
      debug$7("buffer contains a valid response body");
      return new ModbusTCPResponse(id, protocol, length, unitId, body);
    } catch (e) {
      debug$7("not enough data available");
      return null;
    }
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt16BE(this._id, 0);
    payload.writeUInt16BE(this._protocol, 2);
    payload.writeUInt16BE(this._bodyLength, 4);
    payload.writeUInt8(this._unitId, 6);
    this._body.createPayload().copy(payload, 7);
    return payload;
  }
}
tcpResponse.default = ModbusTCPResponse;
var __importDefault$a = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(tcpClientResponseHandler, "__esModule", { value: true });
const Debug$6 = srcExports;
const debug$6 = Debug$6("tcp-response-handler");
const client_response_handler_js_1$1 = __importDefault$a(clientResponseHandler);
const tcp_response_js_1$1 = __importDefault$a(tcpResponse);
class ModbusTCPClientResponseHandler extends client_response_handler_js_1$1.default {
  constructor() {
    super();
    this._buffer = Buffer.alloc(0);
    this._messages = [];
  }
  handleData(data) {
    debug$6("receiving new data", data);
    this._buffer = Buffer.concat([this._buffer, data]);
    debug$6("buffer", this._buffer);
    do {
      const response2 = tcp_response_js_1$1.default.fromBuffer(this._buffer);
      if (!response2) {
        debug$6("not enough data available to parse");
        return;
      }
      debug$6("response id", response2.id, "protocol", response2.protocol, "length", response2.bodyLength, "unit", response2.unitId);
      debug$6("reset buffer from", this._buffer.length, "to", this._buffer.length - response2.byteCount);
      this._messages.push(response2);
      this._buffer = this._buffer.slice(response2.byteCount);
    } while (1);
  }
}
tcpClientResponseHandler.default = ModbusTCPClientResponseHandler;
var __importDefault$9 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(modbusTcpClient, "__esModule", { value: true });
const modbus_client_js_1$1 = __importDefault$9(modbusClient);
const tcp_client_request_handler_js_1 = __importDefault$9(tcpClientRequestHandler);
const tcp_client_response_handler_js_1 = __importDefault$9(tcpClientResponseHandler);
class ModbusTCPClient extends modbus_client_js_1$1.default {
  constructor(socket2, unitId = 1, timeout = 5e3) {
    super(socket2);
    this._requestHandler = new tcp_client_request_handler_js_1.default(socket2, unitId, timeout);
    this._responseHandler = new tcp_client_response_handler_js_1.default();
    this._unitId = unitId;
    this._timeout = timeout;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
modbusTcpClient.default = ModbusTCPClient;
var modbusRtuClient = {};
var rtuClientRequestHandler = {};
var define_crc = {};
var hasRequiredDefine_crc;
function requireDefine_crc() {
  if (hasRequiredDefine_crc) return define_crc;
  hasRequiredDefine_crc = 1;
  Object.defineProperty(define_crc, "__esModule", {
    value: true
  });
  define_crc.default = function(model, calc) {
    var fn = function fn2(buf, previous) {
      return calc(buf, previous) >>> 0;
    };
    fn.signed = calc;
    fn.unsigned = fn;
    fn.model = model;
    return fn;
  };
  return define_crc;
}
var crc1;
var hasRequiredCrc1;
function requireCrc1() {
  if (hasRequiredCrc1) return crc1;
  hasRequiredCrc1 = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  crc1 = (0, _define_crc2.default)("crc1", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = ~~previous;
    var accum = 0;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      accum += byte;
    }
    crc += accum % 256;
    return crc % 256;
  });
  return crc1;
}
var crc8;
var hasRequiredCrc8;
function requireCrc8() {
  if (hasRequiredCrc8) return crc8;
  hasRequiredCrc8 = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc8 = (0, _define_crc2.default)("crc-8", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = ~~previous;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = TABLE[(crc ^ byte) & 255] & 255;
    }
    return crc;
  });
  return crc8;
}
var crc8_1wire;
var hasRequiredCrc8_1wire;
function requireCrc8_1wire() {
  if (hasRequiredCrc8_1wire) return crc8_1wire;
  hasRequiredCrc8_1wire = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255, 70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc8_1wire = (0, _define_crc2.default)("dallas-1-wire", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = ~~previous;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = TABLE[(crc ^ byte) & 255] & 255;
    }
    return crc;
  });
  return crc8_1wire;
}
var crc16;
var hasRequiredCrc16;
function requireCrc16() {
  if (hasRequiredCrc16) return crc16;
  hasRequiredCrc16 = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc16 = (0, _define_crc2.default)("crc-16", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = ~~previous;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = (TABLE[(crc ^ byte) & 255] ^ crc >> 8) & 65535;
    }
    return crc;
  });
  return crc16;
}
var crc16_ccitt;
var hasRequiredCrc16_ccitt;
function requireCrc16_ccitt() {
  if (hasRequiredCrc16_ccitt) return crc16_ccitt;
  hasRequiredCrc16_ccitt = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc16_ccitt = (0, _define_crc2.default)("ccitt", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = typeof previous !== "undefined" ? ~~previous : 65535;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = (TABLE[(crc >> 8 ^ byte) & 255] ^ crc << 8) & 65535;
    }
    return crc;
  });
  return crc16_ccitt;
}
var crc16_modbus;
var hasRequiredCrc16_modbus;
function requireCrc16_modbus() {
  if (hasRequiredCrc16_modbus) return crc16_modbus;
  hasRequiredCrc16_modbus = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc16_modbus = (0, _define_crc2.default)("crc-16-modbus", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = typeof previous !== "undefined" ? ~~previous : 65535;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = (TABLE[(crc ^ byte) & 255] ^ crc >> 8) & 65535;
    }
    return crc;
  });
  return crc16_modbus;
}
var crc16_xmodem;
var hasRequiredCrc16_xmodem;
function requireCrc16_xmodem() {
  if (hasRequiredCrc16_xmodem) return crc16_xmodem;
  hasRequiredCrc16_xmodem = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  crc16_xmodem = (0, _define_crc2.default)("xmodem", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = typeof previous !== "undefined" ? ~~previous : 0;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      var code = crc >>> 8 & 255;
      code ^= byte & 255;
      code ^= code >>> 4;
      crc = crc << 8 & 65535;
      crc ^= code;
      code = code << 5 & 65535;
      crc ^= code;
      code = code << 7 & 65535;
      crc ^= code;
    }
    return crc;
  });
  return crc16_xmodem;
}
var crc16_kermit;
var hasRequiredCrc16_kermit;
function requireCrc16_kermit() {
  if (hasRequiredCrc16_kermit) return crc16_kermit;
  hasRequiredCrc16_kermit = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc16_kermit = (0, _define_crc2.default)("kermit", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = typeof previous !== "undefined" ? ~~previous : 0;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = (TABLE[(crc ^ byte) & 255] ^ crc >> 8) & 65535;
    }
    return crc;
  });
  return crc16_kermit;
}
var crc24;
var hasRequiredCrc24;
function requireCrc24() {
  if (hasRequiredCrc24) return crc24;
  hasRequiredCrc24 = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc24 = (0, _define_crc2.default)("crc-24", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = typeof previous !== "undefined" ? ~~previous : 11994318;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = (TABLE[(crc >> 16 ^ byte) & 255] ^ crc << 8) & 16777215;
    }
    return crc;
  });
  return crc24;
}
var crc32;
var hasRequiredCrc32;
function requireCrc32() {
  if (hasRequiredCrc32) return crc32;
  hasRequiredCrc32 = 1;
  var _buffer = require$$0$1;
  var _define_crc = requireDefine_crc();
  var _define_crc2 = _interopRequireDefault(_define_crc);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var TABLE = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
  if (typeof Int32Array !== "undefined") TABLE = new Int32Array(TABLE);
  crc32 = (0, _define_crc2.default)("crc-32", function(buf, previous) {
    if (!_buffer.Buffer.isBuffer(buf)) buf = (0, _buffer.Buffer)(buf);
    var crc = previous === 0 ? 0 : ~~previous ^ -1;
    for (var index = 0; index < buf.length; index++) {
      var byte = buf[index];
      crc = TABLE[(crc ^ byte) & 255] ^ crc >>> 8;
    }
    return crc ^ -1;
  });
  return crc32;
}
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  lib = {
    crc1: requireCrc1(),
    crc8: requireCrc8(),
    crc81wire: requireCrc8_1wire(),
    crc16: requireCrc16(),
    crc16ccitt: requireCrc16_ccitt(),
    crc16modbus: requireCrc16_modbus(),
    crc16xmodem: requireCrc16_xmodem(),
    crc16kermit: requireCrc16_kermit(),
    crc24: requireCrc24(),
    crc32: requireCrc32()
  };
  return lib;
}
var rtuRequest = {};
var __importDefault$8 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(rtuRequest, "__esModule", { value: true });
const Debug$5 = srcExports;
const debug$5 = Debug$5("rtu-request");
const CRC$1 = requireLib();
const abstract_request_js_1 = __importDefault$8(abstractRequest);
const request_factory_js_1 = __importDefault$8(requestFactory);
class ModbusRTURequest extends abstract_request_js_1.default {
  constructor(address, body, corrupted = false) {
    super();
    this._address = address;
    this._body = body;
    this._corrupted = corrupted;
  }
  get address() {
    return this._address;
  }
  get slaveId() {
    return this.address;
  }
  get unitId() {
    return this.address;
  }
  get crc() {
    return this._crc;
  }
  get name() {
    return this._body.name;
  }
  get corrupted() {
    return this._corrupted === true;
  }
  get body() {
    return this._body;
  }
  get byteCount() {
    return this.body.byteCount + 3;
  }
  static fromBuffer(buffer) {
    try {
      if (buffer.length < 1 + 2) {
        debug$5("not enough data in the buffer yet");
        return null;
      }
      const address = buffer.readUInt8(0);
      debug$5(`rtu header complete, address, ${address}`);
      debug$5("buffer", buffer);
      const body = request_factory_js_1.default.fromBuffer(buffer.slice(1));
      if (!body) {
        return null;
      }
      const payloadLength = 1 + body.byteCount;
      const expectedCrc = CRC$1.crc16modbus(buffer.slice(0, payloadLength));
      const actualCrc = buffer.readUInt16LE(payloadLength);
      const corrupted = expectedCrc !== actualCrc;
      return new ModbusRTURequest(address, body, corrupted);
    } catch (e) {
      debug$5("not enough data to create a rtu request", e);
      return null;
    }
  }
  createPayload() {
    const bodyPayload = this._body.createPayload();
    this._crc = CRC$1.crc16modbus(Buffer.concat([Buffer.from([this._address]), bodyPayload]));
    const crBu = Buffer.alloc(2);
    crBu.writeUInt16LE(this._crc, 0);
    const idBuf = Buffer.from([this._address]);
    const payload = Buffer.concat([idBuf, bodyPayload, crBu]);
    return payload;
  }
}
rtuRequest.default = ModbusRTURequest;
var __importDefault$7 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(rtuClientRequestHandler, "__esModule", { value: true });
const Debug$4 = srcExports;
const debug$4 = Debug$4("rtu-client-request-handler");
const crc_1 = __importDefault$7(requireLib());
const client_request_handler_js_1 = __importDefault$7(clientRequestHandler);
const rtu_request_js_1$1 = __importDefault$7(rtuRequest);
const user_request_error_1$1 = userRequestError;
class ModbusRTUClientRequestHandler extends client_request_handler_js_1.default {
  constructor(socket2, address, timeout = 5e3) {
    super(socket2, timeout);
    this._address = address;
    this._requests = [];
    this._currentRequest = null;
    this._socket.on("open", this._onConnect.bind(this));
    if (this._socket.isOpen) {
      this._onConnect();
    }
  }
  register(requestBody2) {
    debug$4("registrating new request");
    const request2 = new rtu_request_js_1$1.default(this._address, requestBody2);
    return super.registerRequest(request2);
  }
  handle(response2) {
    debug$4("new response coming in");
    if (!response2) {
      return;
    }
    const userRequest2 = this._currentRequest;
    if (!userRequest2) {
      debug$4("something is strange, received a respone without a request");
      return;
    }
    const buf = Buffer.concat([Buffer.from([response2.address]), response2.body.createPayload()]);
    debug$4("create crc from response", buf);
    const crc = crc_1.default.crc16modbus(buf);
    if (response2.crc !== crc) {
      debug$4("CRC does not match", response2.crc, "!==", crc);
      userRequest2.reject(new user_request_error_1$1.UserRequestError({
        err: "crcMismatch",
        message: "the response payload does not match the crc",
        request: userRequest2.request,
        response: response2
      }));
      this._clearAllRequests();
      return;
    }
    super.handle(response2);
  }
  get address() {
    return this._address;
  }
}
rtuClientRequestHandler.default = ModbusRTUClientRequestHandler;
var rtuClientResponseHandler = {};
var rtuResponse = {};
var __importDefault$6 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(rtuResponse, "__esModule", { value: true });
const Debug$3 = srcExports;
const debug$3 = Debug$3("rtu-response");
const CRC = requireLib();
const abstract_response_js_1 = __importDefault$6(abstractResponse);
const response_factory_js_1 = __importDefault$6(responseFactory);
class ModbusRTUResponse extends abstract_response_js_1.default {
  constructor(address, crc, body) {
    super();
    this._address = address;
    this._crc = crc;
    this._body = body;
  }
  get address() {
    return this._address;
  }
  get crc() {
    return this._crc;
  }
  get body() {
    return this._body;
  }
  get byteCount() {
    return this._body.byteCount + 3;
  }
  get slaveId() {
    return this._address;
  }
  get unitId() {
    return this._address;
  }
  static fromRequest(rtuRequest2, modbusBody) {
    return new ModbusRTUResponse(rtuRequest2.address, void 0, modbusBody);
  }
  static fromBuffer(buffer) {
    if (buffer.length < 1) {
      return null;
    }
    const address = buffer.readUInt8(0);
    debug$3("address", address, "buffer", buffer);
    const body = response_factory_js_1.default.fromBuffer(buffer.slice(1));
    if (!body) {
      return null;
    }
    let crc;
    try {
      crc = buffer.readUInt16LE(1 + body.byteCount);
    } catch (e) {
      debug$3("If NoSuchIndexException, it is probably serial and not all data has arrived");
      return null;
    }
    return new ModbusRTUResponse(address, crc, body);
  }
  createPayload() {
    const payload = Buffer.alloc(this.byteCount);
    payload.writeUInt8(this._address, 0);
    const bodyPayload = this._body.createPayload();
    bodyPayload.copy(payload, 1);
    this._crc = CRC.crc16modbus(payload.slice(0, this.byteCount - 2));
    payload.writeUInt16LE(this._crc, this.byteCount - 2);
    return payload;
  }
}
rtuResponse.default = ModbusRTUResponse;
var __importDefault$5 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(rtuClientResponseHandler, "__esModule", { value: true });
const Debug$2 = srcExports;
const debug$2 = Debug$2("rtu-response-handler");
const client_response_handler_js_1 = __importDefault$5(clientResponseHandler);
const rtu_response_js_1$1 = __importDefault$5(rtuResponse);
class ModbusRTUClientResponseHandler extends client_response_handler_js_1.default {
  constructor() {
    super();
    this._messages = [];
  }
  handleData(data) {
    debug$2("receiving new data");
    this._buffer = Buffer.concat([this._buffer, data]);
    debug$2("buffer", this._buffer);
    do {
      const response2 = rtu_response_js_1$1.default.fromBuffer(this._buffer);
      if (!response2) {
        debug$2("not enough data available to parse");
        return;
      }
      debug$2("crc", response2.crc);
      debug$2("reset buffer from", this._buffer.length, "to", this._buffer.length - response2.byteCount);
      this._buffer = this._buffer.slice(response2.byteCount);
      this._messages.push(response2);
    } while (1);
  }
  shift() {
    return this._messages.shift();
  }
}
rtuClientResponseHandler.default = ModbusRTUClientResponseHandler;
var __importDefault$4 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(modbusRtuClient, "__esModule", { value: true });
const modbus_client_js_1 = __importDefault$4(modbusClient);
const rtu_client_request_handler_js_1 = __importDefault$4(rtuClientRequestHandler);
const rtu_client_response_handler_js_1 = __importDefault$4(rtuClientResponseHandler);
class ModbusRTUClient extends modbus_client_js_1.default {
  constructor(socket2, address, timeout = 5e3) {
    super(socket2);
    this._requestHandler = new rtu_client_request_handler_js_1.default(socket2, address, timeout);
    this._responseHandler = new rtu_client_response_handler_js_1.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
modbusRtuClient.default = ModbusRTUClient;
var modbusTcpServer = {};
var modbusServer = {};
Object.defineProperty(modbusServer, "__esModule", { value: true });
const events_1 = require$$0$2;
const DEFAULT_MODBUS_SERVER_OPTIONS = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class ModbusServer extends events_1.EventEmitter {
  get _coils() {
    return this._options.coils;
  }
  get _discrete() {
    return this._options.discrete;
  }
  get _holding() {
    return this._options.holding;
  }
  get _input() {
    return this._options.input;
  }
  constructor(options = DEFAULT_MODBUS_SERVER_OPTIONS) {
    super();
    this._options = Object.assign({}, DEFAULT_MODBUS_SERVER_OPTIONS, options);
  }
  get coils() {
    return this._coils;
  }
  get discrete() {
    return this._discrete;
  }
  get holding() {
    return this._holding;
  }
  get input() {
    return this._input;
  }
  on(event, listener) {
    return super.on(event, listener);
  }
  emit(event, ...args) {
    return super.emit(event, ...args);
  }
}
modbusServer.default = ModbusServer;
var modbusServerClient = {};
var modbusServerRequestHandler = {};
var hasRequiredModbusServerRequestHandler;
function requireModbusServerRequestHandler() {
  if (hasRequiredModbusServerRequestHandler) return modbusServerRequestHandler;
  hasRequiredModbusServerRequestHandler = 1;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(modbusServerRequestHandler, "__esModule", { value: true });
  const rtu_request_12 = __importDefault2(rtuRequest);
  const Debug2 = srcExports;
  const debug2 = Debug2("modbus-server-request-handler");
  class ModbusServerRequestHandler {
    constructor(fromBufferMethod) {
      this._fromBuffer = fromBufferMethod;
      this._requests = [];
      this._buffer = Buffer.alloc(0);
    }
    shift() {
      return this._requests.shift();
    }
    handle(data) {
      this._buffer = Buffer.concat([this._buffer, data]);
      debug2("this._buffer", this._buffer);
      do {
        const request2 = this._fromBuffer(this._buffer);
        debug2("request", request2);
        if (!request2) {
          return;
        }
        if (request2 instanceof rtu_request_12.default && request2.corrupted) {
          const corruptDataDump = this._buffer.slice(0, request2.byteCount).toString("hex");
          debug2(`request message was corrupt: ${corruptDataDump}`);
        } else {
          this._requests.unshift(request2);
        }
        this._buffer = this._buffer.slice(request2.byteCount);
      } while (1);
    }
  }
  modbusServerRequestHandler.default = ModbusServerRequestHandler;
  return modbusServerRequestHandler;
}
var modbusServerResponseHandler = {};
var response = {};
Object.defineProperty(response, "__esModule", { value: true });
var exception_1 = exception;
response.ExceptionResponseBody = exception_1.default;
response.isExceptionResponseBody = exception_1.isExceptionResponseBody;
var read_coils_1 = readCoils;
response.ReadCoilsResponseBody = read_coils_1.default;
var read_discrete_inputs_1 = readDiscreteInputs;
response.ReadDiscreteInputsResponseBody = read_discrete_inputs_1.default;
var read_holding_registers_1 = readHoldingRegisters;
response.ReadHoldingRegistersResponseBody = read_holding_registers_1.default;
var read_input_registers_1 = readInputRegisters;
response.ReadInputRegistersResponseBody = read_input_registers_1.default;
var response_body_1 = responseBody;
response.ModbusResponseBody = response_body_1.default;
var response_factory_1 = responseFactory;
response.ResponseFactory = response_factory_1.default;
var write_multiple_coils_1 = writeMultipleCoils;
response.WriteMultipleCoilsResponseBody = write_multiple_coils_1.default;
var write_multiple_registers_1 = writeMultipleRegisters;
response.WriteMultipleRegistersResponseBody = write_multiple_registers_1.default;
var write_single_coil_1 = writeSingleCoil;
response.WriteSingleCoilResponseBody = write_single_coil_1.default;
var write_single_register_1 = writeSingleRegister;
response.WriteSingleRegisterResponseBody = write_single_register_1.default;
var hasRequiredModbusServerResponseHandler;
function requireModbusServerResponseHandler() {
  if (hasRequiredModbusServerResponseHandler) return modbusServerResponseHandler;
  hasRequiredModbusServerResponseHandler = 1;
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(modbusServerResponseHandler, "__esModule", { value: true });
  const response_1 = response;
  const request_12 = request;
  const buffer_utils_js_12 = __importDefault2(bufferUtils);
  const codes_12 = codes;
  const { bufferToArrayStatus: bufferToArrayStatus2, arrayStatusToBuffer: arrayStatusToBuffer2 } = buffer_utils_js_12.default;
  const Debug2 = srcExports;
  const debug2 = Debug2("modbus tcp response handler");
  class ModbusServerResponseHandler {
    constructor(server, fromRequest) {
      this._server = server;
      this._fromRequest = fromRequest;
    }
    handle(request2, cb) {
      if (!request2) {
        return null;
      }
      if (request_12.isExceptionRequestBody(request2.body)) {
        const responseBody2 = response_1.ExceptionResponseBody.fromRequest(request2.body);
        const response2 = this._fromRequest(request2, responseBody2);
        cb(response2.createPayload());
        return response2;
      }
      const fc = request2.body.fc;
      if (codes_12.isFunctionCode(fc)) {
        switch (fc) {
          case codes_12.FC.READ_COIL:
            return this._handleReadCoil(request2, cb);
          case codes_12.FC.READ_DISCRETE_INPUT:
            return this._handleDiscreteInput(request2, cb);
          case codes_12.FC.READ_HOLDING_REGISTERS:
            return this._handleReadHoldingRegisters(request2, cb);
          case codes_12.FC.READ_INPUT_REGISTERS:
            return this._handleReadInputRegisters(request2, cb);
          case codes_12.FC.WRITE_SINGLE_COIL:
            return this._handleWriteSingleCoil(request2, cb);
          case codes_12.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return this._handleWriteSingleHoldingRegister(request2, cb);
          case codes_12.FC.WRITE_MULTIPLE_COILS:
            return this._handleWriteMultipleCoils(request2, cb);
          case codes_12.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return this._handleWriteMultipleHoldingRegisters(request2, cb);
        }
      }
      return;
    }
    _handleReadCoil(request2, cb) {
      if (!request_12.isReadCoilsRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected ReadCoilsRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.coils) {
        debug2("no coils buffer on server, trying readCoils handler");
        this._server.emit("readCoils", request2, cb);
        return;
      }
      this._server.emit("preReadCoils", request2, cb);
      const responseBody2 = response_1.ReadCoilsResponseBody.fromRequest(request2.body, this._server.coils);
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postReadCoils", request2, cb);
      return response2;
    }
    _handleDiscreteInput(request2, cb) {
      if (!request_12.isReadDiscreteInputsRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.discrete) {
        debug2("no discrete input buffer on server, trying readDiscreteInputs handler");
        this._server.emit("readDiscreteInputs", request2, cb);
        return;
      }
      this._server.emit("preReadDiscreteInputs", request2, cb);
      const responseBody2 = response_1.ReadDiscreteInputsResponseBody.fromRequest(request2.body, this._server.discrete);
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postReadDiscreteInputs", request2, cb);
      return response2;
    }
    _handleReadHoldingRegisters(request2, cb) {
      if (!request_12.isReadHoldingRegistersRequestBody(request2.body)) {
        const msg = `InvalidRequestClass - Expected ReadHoldingRegistersRequestBody but received ${request2.body.name}`;
        throw new Error(msg);
      }
      if (!this._server.holding) {
        debug2("no holding register buffer on server, trying readHoldingRegisters handler");
        this._server.emit("readHoldingRegisters", request2, cb);
        return;
      }
      this._server.emit("preReadHoldingRegisters", request2, cb);
      const responseBody2 = response_1.ReadHoldingRegistersResponseBody.fromRequest(request2.body, this._server.holding);
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postReadHoldingRegisters", request2, cb);
      return response2;
    }
    _handleReadInputRegisters(request2, cb) {
      if (!request_12.isReadInputRegistersRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.input) {
        debug2("no input register buffer on server, trying readInputRegisters handler");
        this._server.emit("readInputRegisters", request2, cb);
        return;
      }
      this._server.emit("preReadInputRegisters", request2, cb);
      const responseBody2 = response_1.ReadInputRegistersResponseBody.fromRequest(request2.body, this._server.input);
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postReadInputRegisters", request2, cb);
      return response2;
    }
    _handleWriteSingleCoil(request2, cb) {
      if (!request_12.isWriteSingleCoilRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.coils) {
        debug2("no coils buffer on server, trying writeSingleCoil handler");
        this._server.emit("writeSingleCoil", request2, cb);
        return;
      }
      this._server.emit("preWriteSingleCoil", request2, cb);
      const responseBody2 = response_1.WriteSingleCoilResponseBody.fromRequest(request2.body);
      const address = request2.body.address;
      debug2("Writing value %d to address %d", request2.body.value, address);
      const oldValue = this._server.coils.readUInt8(Math.floor(address / 8));
      let newValue;
      if (request2.body.value !== 65280 && request2.body.value !== 0) {
        debug2("illegal data value");
        const exceptionBody = new response_1.ExceptionResponseBody(request2.body.fc, 3);
        const exceptionResponse = this._fromRequest(request2, exceptionBody);
        cb(exceptionResponse.createPayload());
        return exceptionResponse;
      }
      if (request2.body.value === 65280) {
        newValue = oldValue | Math.pow(2, address % 8);
      } else {
        newValue = oldValue & ~Math.pow(2, address % 8);
      }
      if (responseBody2.address / 8 > this._server.coils.length) {
        debug2("illegal data address");
        const exceptionBody = new response_1.ExceptionResponseBody(request2.body.fc, 2);
        const exceptionResponse = this._fromRequest(request2, exceptionBody);
        cb(exceptionResponse.createPayload());
        return exceptionResponse;
      } else {
        this._server.coils.writeUInt8(newValue, Math.floor(address / 8));
      }
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postWriteSingleCoil", request2, cb);
      return response2;
    }
    _handleWriteSingleHoldingRegister(request2, cb) {
      if (!request_12.isWriteSingleRegisterRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected WriteSingleRegisterRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.holding) {
        debug2("no register buffer on server, trying writeSingleRegister handler");
        this._server.emit("writeSingleRegister", request2, cb);
        return;
      }
      this._server.emit("preWriteSingleRegister", request2, cb);
      const responseBody2 = response_1.WriteSingleRegisterResponseBody.fromRequest(request2.body);
      if (responseBody2.address * 2 > this._server.holding.length) {
        debug2("illegal data address");
        const exceptionBody = new response_1.ExceptionResponseBody(request2.body.fc, 2);
        const exceptionResponse = this._fromRequest(request2, exceptionBody);
        cb(exceptionResponse.createPayload());
        return exceptionResponse;
      } else {
        this._server.holding.writeUInt16BE(responseBody2.value, responseBody2.address * 2);
      }
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postWriteSingleRegister", request2, cb);
      return response2;
    }
    _handleWriteMultipleCoils(request2, cb) {
      if (!request_12.isWriteMultipleCoilsRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.coils) {
        debug2("no coils buffer on server, trying writeMultipleCoils handler");
        this._server.emit("writeMultipleCoils", request2, cb);
        return;
      }
      this._server.emit("preWriteMultipleCoils", request2, cb);
      const responseBody2 = response_1.WriteMultipleCoilsResponseBody.fromRequest(request2.body);
      const oldStatus = bufferToArrayStatus2(this._server.coils);
      const requestCoilValues = bufferToArrayStatus2(request2.body.valuesAsBuffer);
      const start = request2.body.address;
      const end = start + request2.body.quantity;
      const newStatus = oldStatus.map((byte, i) => {
        let value = byte;
        const inRange = i >= start && i < end;
        if (inRange) {
          const newValue = requestCoilValues.shift();
          value = newValue !== void 0 ? newValue : byte;
        }
        return value;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, oldStatus);
      this._server.coils.fill(arrayStatusToBuffer2(newStatus));
      this._server.emit("postWriteMultipleCoils", this._server.coils, newStatus);
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postWriteMultipleCoils", request2, cb);
      return response2;
    }
    _handleWriteMultipleHoldingRegisters(request2, cb) {
      if (!request_12.isWriteMultipleRegistersRequestBody(request2.body)) {
        throw new Error(`InvalidRequestClass - Expected WriteMultipleRegistersRequestBody but received ${request2.body.name}`);
      }
      if (!this._server.holding) {
        debug2("no register buffer on server, trying writeMultipleRegisters handler");
        this._server.emit("writeMultipleRegisters", request2, cb);
        return;
      }
      this._server.emit("preWriteMultipleRegisters", request2, cb);
      const responseBody2 = response_1.WriteMultipleRegistersResponseBody.fromRequest(request2.body);
      if (request2.body.address * 2 + request2.body.values.length > this._server.holding.length) {
        debug2("illegal data address");
        const exceptionBody = new response_1.ExceptionResponseBody(request2.body.fc, 2);
        const exceptionResponse = this._fromRequest(request2, exceptionBody);
        cb(exceptionResponse.createPayload());
        return exceptionResponse;
      } else {
        this._server.emit("writeMultipleRegisters", this._server.holding);
        debug2("Request Body: ", request2.body);
        this._server.holding.fill(new Uint8Array(request2.body.values), request2.body.address * 2, request2.body.address * 2 + request2.body.values.length);
        this._server.emit("postWriteMultipleRegisters", this._server.holding);
      }
      const response2 = this._fromRequest(request2, responseBody2);
      const payload = response2.createPayload();
      cb(payload);
      this._server.emit("postWriteMultipleRegisters", request2, cb);
      return response2;
    }
  }
  modbusServerResponseHandler.default = ModbusServerResponseHandler;
  return modbusServerResponseHandler;
}
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(modbusServerClient, "__esModule", { value: true });
const Debug$1 = srcExports;
const debug$1 = Debug$1("modbus tcp client socket");
const modbus_server_request_handler_js_1 = __importDefault$3(requireModbusServerRequestHandler());
const modbus_server_response_handler_js_1 = __importDefault$3(requireModbusServerResponseHandler());
class ModbusServerClient {
  constructor(server, socket2, fromBufferMethod, fromRequestMethod) {
    this._server = server;
    this._socket = socket2;
    this._requestHandler = new modbus_server_request_handler_js_1.default(fromBufferMethod);
    this._responseHandler = new modbus_server_response_handler_js_1.default(this._server, fromRequestMethod);
    this._socket.on("data", this._onData.bind(this));
  }
  get socket() {
    return this._socket;
  }
  get server() {
    return this._server;
  }
  _onData(data) {
    debug$1("new data coming in");
    this._requestHandler.handle(data);
    do {
      const request2 = this._requestHandler.shift();
      if (!request2) {
        debug$1("no request to process");
        break;
      }
      this._responseHandler.handle(request2, (response2) => {
        this._socket.write(response2, () => {
          debug$1("response flushed", response2);
        });
      });
    } while (1);
  }
}
modbusServerClient.default = ModbusServerClient;
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(modbusTcpServer, "__esModule", { value: true });
const Debug = srcExports;
const debug = Debug("modbus tcp server");
const modbus_server_1 = __importDefault$2(modbusServer);
const modbus_server_client_js_1$1 = __importDefault$2(modbusServerClient);
const tcp_request_js_1 = __importDefault$2(tcpRequest);
const tcp_response_js_1 = __importDefault$2(tcpResponse);
class ModbusTCPServer extends modbus_server_1.default {
  constructor(server, options) {
    super(options);
    this._server = server;
    server.on("connection", this._onConnection.bind(this));
  }
  _onConnection(socket2) {
    debug("new connection coming in");
    const Request = tcp_request_js_1.default.fromBuffer;
    const Response = tcp_response_js_1.default.fromRequest;
    const client = new modbus_server_client_js_1$1.default(this, socket2, Request, Response);
    this.emit("connection", client);
  }
}
modbusTcpServer.default = ModbusTCPServer;
var modbusRtuServer = {};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(modbusRtuServer, "__esModule", { value: true });
const modbus_server_client_js_1 = __importDefault$1(modbusServerClient);
const modbus_server_js_1 = __importDefault$1(modbusServer);
const rtu_request_js_1 = __importDefault$1(rtuRequest);
const rtu_response_js_1 = __importDefault$1(rtuResponse);
class ModbusRTUServer extends modbus_server_js_1.default {
  constructor(socket2, options) {
    super(options);
    this._socket = socket2;
    const fromBuffer = rtu_request_js_1.default.fromBuffer;
    const fromRequest = rtu_response_js_1.default.fromRequest;
    const client = new modbus_server_client_js_1.default(this, socket2, fromBuffer, fromRequest);
    this.emit("connection", client);
  }
}
modbusRtuServer.default = ModbusRTUServer;
var errors = {};
var isInternalException$1 = {};
Object.defineProperty(isInternalException$1, "__esModule", { value: true });
const InternalErrorMessagesArray = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function isInternalException(x) {
  if (typeof x !== "object") {
    return false;
  }
  if (InternalErrorMessagesArray.includes(x.message)) {
    return true;
  }
  return false;
}
isInternalException$1.isInternalException = isInternalException;
var isUserRequestError = {};
(function(exports) {
  function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(userRequestError);
})(isUserRequestError);
(function(exports) {
  function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(isInternalException$1);
  __export(isUserRequestError);
  var exception_12 = exception;
  exports.isExceptionResponseBody = exception_12.isExceptionResponseBody;
  var exception_2 = exception$1;
  exports.isExceptionRequestBody = exception_2.isExceptionRequestBody;
})(errors);
var constants = {};
var limits = {};
Object.defineProperty(limits, "__esModule", { value: true });
const UINT16_MIN = 0;
const UINT16_MAX = 65535;
const REGISTER_MAX = UINT16_MAX;
const REGISTER_MIN = UINT16_MIN;
const COIL_MIN = 0;
const COIL_MAX = 1;
const ERROR_CODE_THRESHOLD = 128;
limits.LIMITS = {
  COIL_MAX,
  COIL_MIN,
  ERROR_CODE_THRESHOLD,
  REGISTER_MAX,
  REGISTER_MIN,
  UINT16_MAX,
  UINT16_MIN
};
(function(exports) {
  function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(limits);
})(constants);
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};
Object.defineProperty(modbus, "__esModule", { value: true });
const modbus_tcp_client_js_1 = __importDefault(modbusTcpClient);
modbus.ModbusTCPClient = modbus_tcp_client_js_1.default;
const modbus_rtu_client_js_1 = __importDefault(modbusRtuClient);
modbus.ModbusRTUClient = modbus_rtu_client_js_1.default;
const modbus_tcp_server_js_1 = __importDefault(modbusTcpServer);
modbus.ModbusTCPServer = modbus_tcp_server_js_1.default;
const modbus_rtu_server_js_1 = __importDefault(modbusRtuServer);
modbus.ModbusRTUServer = modbus_rtu_server_js_1.default;
const Codes = __importStar(codes);
const Errors = __importStar(errors);
const Requests = __importStar(request);
const Responses = __importStar(response);
const user_request_js_1 = __importDefault(userRequest);
const constants_1 = constants;
modbus.client = {
  RTU: modbus_rtu_client_js_1.default,
  TCP: modbus_tcp_client_js_1.default
};
modbus.server = {
  RTU: modbus_rtu_server_js_1.default,
  TCP: modbus_tcp_server_js_1.default
};
modbus.requests = Object.assign({}, Requests, { UserRequest: user_request_js_1.default });
modbus.responses = Responses;
modbus.codes = Codes;
modbus.errors = Errors;
modbus.limits = constants_1.LIMITS;
var abstract_request_1 = abstractRequest;
modbus.ModbusAbstractRequest = abstract_request_1.default;
var abstract_response_1 = abstractResponse;
modbus.ModbusAbstractResponse = abstract_response_1.default;
var client_request_handler_1 = clientRequestHandler;
modbus.MBClientRequestHandler = client_request_handler_1.default;
var client_response_handler_1 = clientResponseHandler;
modbus.ModbusClientResponseHandler = client_response_handler_1.default;
var modbus_client_1 = modbusClient;
modbus.ModbusClient = modbus_client_1.default;
var tcp_request_1 = tcpRequest;
modbus.ModbusTCPRequest = tcp_request_1.default;
var tcp_response_1 = tcpResponse;
modbus.ModbusTCPResponse = tcp_response_1.default;
var rtu_request_1 = rtuRequest;
modbus.ModbusRTURequest = rtu_request_1.default;
var rtu_response_1 = rtuResponse;
modbus.ModbusRTUResponse = rtu_response_1.default;
var user_request_error_1 = userRequestError;
modbus.UserRequestError = user_request_error_1.UserRequestError;
var user_request_1 = userRequest;
modbus.UserRequest = user_request_1.default;
var user_request_metrics_1 = userRequestMetrics;
modbus.UserRequestMetrics = user_request_metrics_1.UserRequestMetrics;
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "akdi.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    },
    autoHideMenuBar: true,
    show: false
  });
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.webContents.on("did-finish-load", connectToPLC);
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
const PLC_IP = "192.168.0.100";
const PLC_PORT = 502;
const REG_START_ADDRESS = 4106;
const REG_COUNT = 11;
const COIL_START_ADDRESS = 2049;
const COIL_COUNT = 2;
const socket = new net.Socket();
let plcClient;
let pollingInterval;
function connectToPLC() {
  plcClient = new modbus.client.TCP(socket);
  socket.on("connect", () => {
    console.log("🔌 Industrial networking active. Connected to PLC.");
    startRealTimePolling();
  });
  socket.on("error", (err) => {
    console.error("❌ Network Connection failed:", err.message);
    if (mainWindow) mainWindow.webContents.send("plc-status", { error: `Disconnected: ${err.message}` });
    setTimeout(connectToPLC, 5e3);
  });
  socket.connect({ host: PLC_IP, port: PLC_PORT });
}
function startRealTimePolling() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    if (!socket.writable) return;
    try {
      const [regResponse, coilResponse] = await Promise.all([
        plcClient.readHoldingRegisters(REG_START_ADDRESS, REG_COUNT),
        plcClient.readCoils(COIL_START_ADDRESS, COIL_COUNT)
      ]);
      const rawRegs = regResponse.response.body.values;
      const uInt16D10 = rawRegs[0];
      const uInt16D20 = rawRegs[10];
      const rawCoils = coilResponse.response.body.valuesAsArray || coilResponse.response.body.values;
      const statusM1 = rawCoils && rawCoils.length > 0 ? rawCoils[0] : false;
      const statusM2 = rawCoils && rawCoils.length > 1 ? rawCoils[1] : false;
      if (mainWindow) {
        mainWindow.webContents.send("plc-live-data", {
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          d10Value: uInt16D10,
          d20Value: uInt16D20,
          m1Status: statusM1,
          m2Status: statusM2
        });
      }
    } catch (err) {
      console.error("Polling transaction dropped:", err.message);
    }
  }, 50);
}
ipcMain.handle("write-plc-coil", async (_event, { address, value }) => {
  if (!socket.writable) return { success: false, error: "PLC communication line down" };
  try {
    await plcClient.writeSingleCoil(address, value);
    return { success: true, message: `Coil ${address} set to ${value}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
