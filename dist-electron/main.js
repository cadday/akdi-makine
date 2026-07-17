import { ipcMain as Ps, app as Oe, BrowserWindow as Qr, session as Ls } from "electron";
import { fileURLToPath as $s } from "node:url";
import H from "node:path";
import Jr from "tty";
import js from "util";
import Hs from "os";
import D from "buffer";
import Ws from "events";
import Ns from "net";
var x = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, y = {}, Tt = {}, ae = {}, St = { exports: {} }, me = { exports: {} }, lt, rr;
function Gs() {
  if (rr) return lt;
  rr = 1;
  var r = 1e3, e = r * 60, t = e * 60, s = t * 24, n = s * 7, a = s * 365.25;
  lt = function(o, i) {
    i = i || {};
    var u = typeof o;
    if (u === "string" && o.length > 0)
      return c(o);
    if (u === "number" && isFinite(o))
      return i.long ? f(o) : d(o);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(o)
    );
  };
  function c(o) {
    if (o = String(o), !(o.length > 100)) {
      var i = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        o
      );
      if (i) {
        var u = parseFloat(i[1]), _ = (i[2] || "ms").toLowerCase();
        switch (_) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return u * a;
          case "weeks":
          case "week":
          case "w":
            return u * n;
          case "days":
          case "day":
          case "d":
            return u * s;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return u * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return u * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return u * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return u;
          default:
            return;
        }
      }
    }
  }
  function d(o) {
    var i = Math.abs(o);
    return i >= s ? Math.round(o / s) + "d" : i >= t ? Math.round(o / t) + "h" : i >= e ? Math.round(o / e) + "m" : i >= r ? Math.round(o / r) + "s" : o + "ms";
  }
  function f(o) {
    var i = Math.abs(o);
    return i >= s ? h(o, i, s, "day") : i >= t ? h(o, i, t, "hour") : i >= e ? h(o, i, e, "minute") : i >= r ? h(o, i, r, "second") : o + " ms";
  }
  function h(o, i, u, _) {
    var l = i >= u * 1.5;
    return Math.round(o / u) + " " + _ + (l ? "s" : "");
  }
  return lt;
}
var _t, sr;
function Xr() {
  if (sr) return _t;
  sr = 1;
  function r(e) {
    s.debug = s, s.default = s, s.coerce = h, s.disable = d, s.enable = c, s.enabled = f, s.humanize = Gs(), Object.keys(e).forEach(function(o) {
      s[o] = e[o];
    }), s.instances = [], s.names = [], s.skips = [], s.formatters = {};
    function t(o) {
      for (var i = 0, u = 0; u < o.length; u++)
        i = (i << 5) - i + o.charCodeAt(u), i |= 0;
      return s.colors[Math.abs(i) % s.colors.length];
    }
    s.selectColor = t;
    function s(o) {
      var i;
      function u() {
        if (u.enabled) {
          for (var _ = arguments.length, l = new Array(_), p = 0; p < _; p++)
            l[p] = arguments[p];
          var b = u, I = Number(/* @__PURE__ */ new Date()), q = I - (i || I);
          b.diff = q, b.prev = i, b.curr = I, i = I, l[0] = s.coerce(l[0]), typeof l[0] != "string" && l.unshift("%O");
          var M = 0;
          l[0] = l[0].replace(/%([a-zA-Z%])/g, function(W, Ee) {
            if (W === "%%")
              return W;
            M++;
            var K = s.formatters[Ee];
            if (typeof K == "function") {
              var er = l[M];
              W = K.call(b, er), l.splice(M, 1), M--;
            }
            return W;
          }), s.formatArgs.call(b, l);
          var U = b.log || s.log;
          U.apply(b, l);
        }
      }
      return u.namespace = o, u.enabled = s.enabled(o), u.useColors = s.useColors(), u.color = t(o), u.destroy = n, u.extend = a, typeof s.init == "function" && s.init(u), s.instances.push(u), u;
    }
    function n() {
      var o = s.instances.indexOf(this);
      return o !== -1 ? (s.instances.splice(o, 1), !0) : !1;
    }
    function a(o, i) {
      return s(this.namespace + (typeof i > "u" ? ":" : i) + o);
    }
    function c(o) {
      s.save(o), s.names = [], s.skips = [];
      var i, u = (typeof o == "string" ? o : "").split(/[\s,]+/), _ = u.length;
      for (i = 0; i < _; i++)
        u[i] && (o = u[i].replace(/\*/g, ".*?"), o[0] === "-" ? s.skips.push(new RegExp("^" + o.substr(1) + "$")) : s.names.push(new RegExp("^" + o + "$")));
      for (i = 0; i < s.instances.length; i++) {
        var l = s.instances[i];
        l.enabled = s.enabled(l.namespace);
      }
    }
    function d() {
      s.enable("");
    }
    function f(o) {
      if (o[o.length - 1] === "*")
        return !0;
      var i, u;
      for (i = 0, u = s.skips.length; i < u; i++)
        if (s.skips[i].test(o))
          return !1;
      for (i = 0, u = s.names.length; i < u; i++)
        if (s.names[i].test(o))
          return !0;
      return !1;
    }
    function h(o) {
      return o instanceof Error ? o.stack || o.message : o;
    }
    return s.enable(s.load()), s;
  }
  return _t = r, _t;
}
var nr;
function ks() {
  return nr || (nr = 1, function(r, e) {
    function t(o) {
      return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? t = function(u) {
        return typeof u;
      } : t = function(u) {
        return u && typeof Symbol == "function" && u.constructor === Symbol && u !== Symbol.prototype ? "symbol" : typeof u;
      }, t(o);
    }
    e.log = a, e.formatArgs = n, e.save = c, e.load = d, e.useColors = s, e.storage = f(), e.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function s() {
      return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? !1 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(o) {
      if (o[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + o[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !!this.useColors) {
        var i = "color: " + this.color;
        o.splice(1, 0, i, "color: inherit");
        var u = 0, _ = 0;
        o[0].replace(/%[a-zA-Z%]/g, function(l) {
          l !== "%%" && (u++, l === "%c" && (_ = u));
        }), o.splice(_, 0, i);
      }
    }
    function a() {
      var o;
      return (typeof console > "u" ? "undefined" : t(console)) === "object" && console.log && (o = console).log.apply(o, arguments);
    }
    function c(o) {
      try {
        o ? e.storage.setItem("debug", o) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function d() {
      var o;
      try {
        o = e.storage.getItem("debug");
      } catch {
      }
      return !o && typeof process < "u" && "env" in process && (o = process.env.DEBUG), o;
    }
    function f() {
      try {
        return localStorage;
      } catch {
      }
    }
    r.exports = Xr()(e);
    var h = r.exports.formatters;
    h.j = function(o) {
      try {
        return JSON.stringify(o);
      } catch (i) {
        return "[UnexpectedJSONParseError]: " + i.message;
      }
    };
  }(me, me.exports)), me.exports;
}
var Be = { exports: {} }, ht, ar;
function Vs() {
  return ar || (ar = 1, ht = (r, e = process.argv) => {
    const t = r.startsWith("-") ? "" : r.length === 1 ? "-" : "--", s = e.indexOf(t + r), n = e.indexOf("--");
    return s !== -1 && (n === -1 || s < n);
  }), ht;
}
var bt, ir;
function zs() {
  if (ir) return bt;
  ir = 1;
  const r = Hs, e = Jr, t = Vs(), { env: s } = process;
  let n;
  t("no-color") || t("no-colors") || t("color=false") || t("color=never") ? n = 0 : (t("color") || t("colors") || t("color=true") || t("color=always")) && (n = 1), "FORCE_COLOR" in s && (s.FORCE_COLOR === "true" ? n = 1 : s.FORCE_COLOR === "false" ? n = 0 : n = s.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(s.FORCE_COLOR, 10), 3));
  function a(f) {
    return f === 0 ? !1 : {
      level: f,
      hasBasic: !0,
      has256: f >= 2,
      has16m: f >= 3
    };
  }
  function c(f, h) {
    if (n === 0)
      return 0;
    if (t("color=16m") || t("color=full") || t("color=truecolor"))
      return 3;
    if (t("color=256"))
      return 2;
    if (f && !h && n === void 0)
      return 0;
    const o = n || 0;
    if (s.TERM === "dumb")
      return o;
    if (process.platform === "win32") {
      const i = r.release().split(".");
      return Number(i[0]) >= 10 && Number(i[2]) >= 10586 ? Number(i[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in s)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((i) => i in s) || s.CI_NAME === "codeship" ? 1 : o;
    if ("TEAMCITY_VERSION" in s)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(s.TEAMCITY_VERSION) ? 1 : 0;
    if (s.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in s) {
      const i = parseInt((s.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (s.TERM_PROGRAM) {
        case "iTerm.app":
          return i >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(s.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(s.TERM) || "COLORTERM" in s ? 1 : o;
  }
  function d(f) {
    const h = c(f, f && f.isTTY);
    return a(h);
  }
  return bt = {
    supportsColor: d,
    stdout: a(c(!0, e.isatty(1))),
    stderr: a(c(!0, e.isatty(2)))
  }, bt;
}
var ur;
function Ys() {
  return ur || (ur = 1, function(r, e) {
    var t = Jr, s = js;
    e.init = i, e.log = f, e.formatArgs = c, e.save = h, e.load = o, e.useColors = a, e.colors = [6, 2, 3, 4, 5, 1];
    try {
      var n = zs();
      n && (n.stderr || n).level >= 2 && (e.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter(function(_) {
      return /^debug_/i.test(_);
    }).reduce(function(_, l) {
      var p = l.substring(6).toLowerCase().replace(/_([a-z])/g, function(I, q) {
        return q.toUpperCase();
      }), b = process.env[l];
      return /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : b === "null" ? b = null : b = Number(b), _[p] = b, _;
    }, {});
    function a() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function c(_) {
      var l = this.namespace, p = this.useColors;
      if (p) {
        var b = this.color, I = "\x1B[3" + (b < 8 ? b : "8;5;" + b), q = "  ".concat(I, ";1m").concat(l, " \x1B[0m");
        _[0] = q + _[0].split(`
`).join(`
` + q), _.push(I + "m+" + r.exports.humanize(this.diff) + "\x1B[0m");
      } else
        _[0] = d() + l + " " + _[0];
    }
    function d() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function f() {
      return process.stderr.write(s.format.apply(s, arguments) + `
`);
    }
    function h(_) {
      _ ? process.env.DEBUG = _ : delete process.env.DEBUG;
    }
    function o() {
      return process.env.DEBUG;
    }
    function i(_) {
      _.inspectOpts = {};
      for (var l = Object.keys(e.inspectOpts), p = 0; p < l.length; p++)
        _.inspectOpts[l[p]] = e.inspectOpts[l[p]];
    }
    r.exports = Xr()(e);
    var u = r.exports.formatters;
    u.o = function(_) {
      return this.inspectOpts.colors = this.useColors, s.inspect(_, this.inspectOpts).split(`
`).map(function(l) {
        return l.trim();
      }).join(" ");
    }, u.O = function(_) {
      return this.inspectOpts.colors = this.useColors, s.inspect(_, this.inspectOpts);
    };
  }(Be, Be.exports)), Be.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? St.exports = ks() : St.exports = Ys();
var v = St.exports, R = {}, V = {}, g = {}, Kr = {};
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.ErrorMessages = {
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
  function e(s) {
    if (t(s))
      return r.ErrorMessages[s];
    throw new Error("");
  }
  r.errorCodeToMessage = e;
  function t(s) {
    switch (s) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8:
      case 10:
      case 11:
        return !0;
      default:
        return !1;
    }
  }
  r.isErrorCode = t;
})(Kr);
var Zr = {};
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var e;
  (function(s) {
    s[s.READ_COIL = 1] = "READ_COIL", s[s.READ_DISCRETE_INPUT = 2] = "READ_DISCRETE_INPUT", s[s.READ_HOLDING_REGISTERS = 3] = "READ_HOLDING_REGISTERS", s[s.READ_INPUT_REGISTERS = 4] = "READ_INPUT_REGISTERS", s[s.WRITE_SINGLE_COIL = 5] = "WRITE_SINGLE_COIL", s[s.WRITE_SINGLE_HOLDING_REGISTER = 6] = "WRITE_SINGLE_HOLDING_REGISTER", s[s.WRITE_MULTIPLE_COILS = 15] = "WRITE_MULTIPLE_COILS", s[s.WRITE_MULTIPLE_HOLDING_REGISTERS = 16] = "WRITE_MULTIPLE_HOLDING_REGISTERS";
  })(e = r.FC || (r.FC = {}));
  function t(s) {
    return e[s] !== void 0;
  }
  r.isFunctionCode = t;
})(Zr);
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(Kr), e(Zr);
})(g);
var B = {}, Qs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(B, "__esModule", { value: !0 });
const Js = Qs(v);
Js.default("request-body");
class Ut {
  constructor(e) {
    if (new.target === Ut)
      throw new TypeError("Cannot construct ModbusRequestBody directly.");
    this._fc = e;
  }
  get fc() {
    return this._fc;
  }
  get isException() {
    return !1;
  }
  get isModbusRequestBody() {
    return !0;
  }
}
B.default = Ut;
function Xs(r) {
  return !!r.isModbusRequestBody;
}
B.isModbusRequestBody = Xs;
var Ks = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(V, "__esModule", { value: !0 });
const Zs = g, en = Ks(B);
class Ge extends en.default {
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
    return !0;
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0);
      return t > 43 ? null : new Ge(t, 1);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (!Zs.isFunctionCode(e))
      throw Error("InvalidFunctionCode");
    super(e), this._code = t;
  }
  createPayload() {
    const e = Buffer.alloc(2);
    return e.writeUInt8(this._fc, 0), e.writeUInt8(this._code, 1), e;
  }
}
V.default = Ge;
function tn(r) {
  return r instanceof Ge;
}
V.isExceptionRequestBody = tn;
var ie = {}, rn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ie, "__esModule", { value: !0 });
const or = g, sn = rn(B);
class ke extends sn.default {
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
  static fromBuffer(e) {
    try {
      if (e.readUInt8(0) !== or.FC.READ_COIL)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return new ke(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(or.FC.READ_COIL), this._start = e, this._count = t, this._start > 65535)
      throw new Error("InvalidStartAddress");
    if (this._count > 2e3)
      throw new Error("InvalidQuantity");
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._count, 3), e;
  }
}
ie.default = ke;
function nn(r) {
  return r instanceof ke;
}
ie.isReadCoilsRequestBody = nn;
var ue = {}, an = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ue, "__esModule", { value: !0 });
const cr = g, un = an(B);
class Ve extends un.default {
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
  static fromBuffer(e) {
    try {
      if (e.readUInt8(0) !== cr.FC.READ_DISCRETE_INPUT)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return new Ve(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(cr.FC.READ_DISCRETE_INPUT), e > 65535)
      throw new Error("InvalidStartAddress");
    if (t > 2e3)
      throw new Error("InvalidQuantity");
    this._start = e, this._count = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._count, 3), e;
  }
}
ue.default = Ve;
function on(r) {
  return r instanceof Ve;
}
ue.isReadDiscreteInputsRequestBody = on;
var oe = {}, cn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(oe, "__esModule", { value: !0 });
const dr = g, dn = cn(B);
class ze extends dn.default {
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
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return t !== dr.FC.READ_HOLDING_REGISTERS ? null : new ze(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(dr.FC.READ_HOLDING_REGISTERS), e > 65535)
      throw new Error("InvalidStartAddress");
    if (t > 2e3)
      throw new Error("InvalidQuantity");
    this._start = e, this._count = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._count, 3), e;
  }
}
oe.default = ze;
function fn(r) {
  return r instanceof ze;
}
oe.isReadHoldingRegistersRequestBody = fn;
var ce = {}, xn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ce, "__esModule", { value: !0 });
const fr = g, ln = xn(B);
class Ye extends ln.default {
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
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return t !== fr.FC.READ_INPUT_REGISTERS ? null : new Ye(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(fr.FC.READ_INPUT_REGISTERS), e > 65535)
      throw new Error("InvalidStartAddress");
    if (t > 2e3)
      throw new Error("InvalidQuantity");
    this._start = e, this._count = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._count, 3), e;
  }
}
ce.default = Ye;
function _n(r) {
  return r instanceof Ye;
}
ce.isReadInputRegistersRequestBody = _n;
var de = {}, fe = {}, hn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(fe, "__esModule", { value: !0 });
const xr = g, bn = hn(B);
class Qe extends bn.default {
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
  static fromBuffer(e) {
    try {
      if (e.readUInt8(0) !== xr.FC.WRITE_MULTIPLE_COILS)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3), a = e.readUInt8(5), c = e.slice(6, 6 + a);
      return new Qe(s, c, n);
    } catch {
      return null;
    }
  }
  constructor(e, t, s) {
    if (super(xr.FC.WRITE_MULTIPLE_COILS), e > 65535)
      throw new Error("InvalidStartAddress");
    if (Array.isArray(t) && t.length > 1968 * 8)
      throw new Error("InvalidArraySize");
    if (t instanceof Buffer) {
      if (t.length > 1968)
        throw new Error("InvalidBufferSize");
      if (s !== void 0 && t.length * 8 < s)
        throw new Error("InvalidBufferSize");
    }
    if (this._address = e, this._values = t, this._quantity = s || t.length, this._numberOfBytes = Math.ceil(this._quantity / 8), this._values instanceof Buffer) {
      this._valuesAsBuffer = this._values, this._byteCount = Math.ceil(this._quantity / 8) + 6, this._valuesAsArray = [];
      for (let n = 0; n < this._quantity; n += 1) {
        const a = n % 8, c = Math.floor(n / 8), d = this._values.readUInt8(c);
        this._valuesAsArray.push((d & Math.pow(2, a)) > 0);
      }
    } else if (this._values instanceof Array) {
      this._byteCount = Math.ceil(this._values.length / 8) + 6, this._valuesAsArray = this._values;
      const n = Math.min(1968, this._values.length);
      let a = 0, c = 0, d = 0;
      const f = Buffer.allocUnsafe(this._numberOfBytes);
      for (let h = 0; h < n; h += 1)
        a += this._values[h] ? Math.pow(2, d) : 0, d = (d + 1) % 8, (d === 0 || h === n - 1) && (f.writeUInt8(a, c), c = c + 1, a = 0);
      this._valuesAsBuffer = f;
    } else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const e = Buffer.alloc(this._byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._quantity, 3), e.writeUInt8(this._numberOfBytes, 5), this._valuesAsBuffer.copy(e, 6, 0, this._byteCount), e;
  }
}
fe.default = Qe;
function pn(r) {
  return r instanceof Qe;
}
fe.isWriteMultipleCoilsRequestBody = pn;
var xe = {}, yn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(xe, "__esModule", { value: !0 });
const lr = g, Rn = yn(B);
class Je extends Rn.default {
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
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt8(5), a = e.slice(6, 6 + n);
      return t !== lr.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new Je(s, a);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(lr.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), e > 65535)
      throw new Error("InvalidStartAddress");
    if (Array.isArray(t) && t.length > 123)
      throw new Error("InvalidArraySize");
    if (t instanceof Buffer && t.length > 123 * 2)
      throw new Error("InvalidBufferSize");
    if (this._address = e, this._values = t, this._values instanceof Buffer) {
      this._byteCount = Math.min(this._values.length + 6, 246), this._numberOfBytes = this._values.length, this._quantity = Math.floor(this._values.length / 2), this._valuesAsBuffer = this._values, this._valuesAsArray = [];
      for (let s = 0; s < this._values.length; s += 2)
        this._valuesAsArray.push(this._values.readUInt16BE(s));
    } else if (this._values instanceof Array)
      this._valuesAsArray = this._values, this._byteCount = Math.min(this._values.length * 2 + 6, 246), this._numberOfBytes = Math.floor(this._values.length * 2), this._quantity = this._values.length, this._valuesAsBuffer = Buffer.alloc(this._numberOfBytes), this._values.forEach((s, n) => {
        this._valuesAsBuffer.writeUInt16BE(s, n * 2);
      });
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const e = Buffer.alloc(6 + this._numberOfBytes);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._quantity, 3), e.writeUInt8(this._numberOfBytes, 5), this._valuesAsBuffer.copy(e, 6), e;
  }
}
xe.default = Je;
function gn(r) {
  return r instanceof Je;
}
xe.isWriteMultipleRegistersRequestBody = gn;
var le = {}, vn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(le, "__esModule", { value: !0 });
const _r = g, In = vn(B);
class Xe extends In.default {
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
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3) === 65280;
      return t !== _r.FC.WRITE_SINGLE_COIL ? null : new Xe(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(_r.FC.WRITE_SINGLE_COIL), e > 65535)
      throw new Error("InvalidStartAddress");
    this._address = e, this._value = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value ? 65280 : 0, 3), e;
  }
}
le.default = Xe;
function Cn(r) {
  return r instanceof Xe;
}
le.isWriteSingleCoilRequestBody = Cn;
var _e = {}, En = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(_e, "__esModule", { value: !0 });
const hr = g, mn = En(B);
class Ke extends mn.default {
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
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return t !== hr.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new Ke(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(hr.FC.WRITE_SINGLE_HOLDING_REGISTER), e > 65535)
      throw new Error("InvalidStartAddress");
    if (!Number.isInteger(t) || t < 0 || t > 65535)
      throw new Error("InvalidValue");
    this._address = e, this._value = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value, 3), e;
  }
}
_e.default = Ke;
function Bn(r) {
  return r instanceof Ke;
}
_e.isWriteSingleRegisterRequestBody = Bn;
var O = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(de, "__esModule", { value: !0 });
const F = g, wn = O(V), qn = O(ie), Mn = O(ue), An = O(oe), Sn = O(ce), Dn = O(fe), On = O(xe), Tn = O(le), Un = O(_e), Fn = O(v), pt = Fn.default("request-factory");
class Pn {
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0);
      if (pt("fc", t, "payload", e), F.isFunctionCode(t))
        switch (t) {
          case F.FC.READ_COIL:
            return qn.default.fromBuffer(e);
          case F.FC.READ_DISCRETE_INPUT:
            return Mn.default.fromBuffer(e);
          case F.FC.READ_HOLDING_REGISTERS:
            return An.default.fromBuffer(e);
          case F.FC.READ_INPUT_REGISTERS:
            return Sn.default.fromBuffer(e);
          case F.FC.WRITE_SINGLE_COIL:
            return Tn.default.fromBuffer(e);
          case F.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return Un.default.fromBuffer(e);
          case F.FC.WRITE_MULTIPLE_COILS:
            return Dn.default.fromBuffer(e);
          case F.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return On.default.fromBuffer(e);
        }
      if (t <= 43)
        return pt("Illegal Function (fc %d)", t), new wn.default(t, 1);
    } catch (t) {
      return pt("Exception while reading function code", t), null;
    }
  }
}
de.default = Pn;
Object.defineProperty(R, "__esModule", { value: !0 });
var es = V;
R.ExceptionRequestBody = es.default;
R.isExceptionRequestBody = es.isExceptionRequestBody;
var ts = ie;
R.ReadCoilsRequestBody = ts.default;
R.isReadCoilsRequestBody = ts.isReadCoilsRequestBody;
var rs = ue;
R.ReadDiscreteInputsRequestBody = rs.default;
R.isReadDiscreteInputsRequestBody = rs.isReadDiscreteInputsRequestBody;
var ss = oe;
R.ReadHoldingRegistersRequestBody = ss.default;
R.isReadHoldingRegistersRequestBody = ss.isReadHoldingRegistersRequestBody;
var ns = ce;
R.ReadInputRegistersRequestBody = ns.default;
R.isReadInputRegistersRequestBody = ns.isReadInputRegistersRequestBody;
var as = B;
R.ModbusRequestBody = as.default;
R.isModbusRequestBody = as.isModbusRequestBody;
var Ln = de;
R.RequestFactory = Ln.default;
var is = fe;
R.WriteMultipleCoilsRequestBody = is.default;
R.isWriteMultipleCoilsRequestBody = is.isWriteMultipleCoilsRequestBody;
var us = xe;
R.WriteMultipleRegistersRequestBody = us.default;
R.isWriteMultipleRegistersRequestBody = us.isWriteMultipleRegistersRequestBody;
var os = le;
R.WriteSingleCoilRequestBody = os.default;
R.isWriteSingleCoilRequestBody = os.isWriteSingleCoilRequestBody;
var cs = _e;
R.WriteSingleRegisterRequestBody = cs.default;
R.isWriteSingleRegisterRequestBody = cs.isWriteSingleRegisterRequestBody;
Object.defineProperty(ae, "__esModule", { value: !0 });
const $n = v, C = $n("modbus-client"), P = R;
class Ft {
  constructor(e) {
    if (new.target === Ft)
      throw new TypeError("Cannot instantiate ModbusClient directly.");
    if (this._socket = e, !e)
      throw new Error("NoSocketException.");
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
  readCoils(e, t) {
    C("issuing new read coils request");
    let s;
    try {
      s = new P.ReadCoilsRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readDiscreteInputs(e, t) {
    C("issuing new read discrete inputs request");
    let s;
    try {
      s = new P.ReadDiscreteInputsRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readHoldingRegisters(e, t) {
    C("issuing new read holding registers request");
    let s;
    try {
      s = new P.ReadHoldingRegistersRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readInputRegisters(e, t) {
    C("issuing new read input registers request");
    let s;
    try {
      s = new P.ReadInputRegistersRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeSingleCoil(e, t) {
    C("issuing new write single coil request");
    let s;
    try {
      s = new P.WriteSingleCoilRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeSingleRegister(e, t) {
    C("issuing new write single register request");
    let s;
    try {
      s = new P.WriteSingleRegisterRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeMultipleCoils(e, t, s = 0) {
    C("issuing new write multiple coils request");
    let n;
    try {
      t instanceof Buffer ? n = new P.WriteMultipleCoilsRequestBody(e, t, s) : n = new P.WriteMultipleCoilsRequestBody(e, t);
    } catch (a) {
      return C("unknown request error occurred"), Promise.reject(a);
    }
    return this._requestHandler.register(n);
  }
  writeMultipleRegisters(e, t) {
    C("issuing new write multiple registers request");
    let s;
    try {
      s = new P.WriteMultipleRegistersRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  manuallyClearRequests(e) {
    return this._requestHandler.manuallyRejectRequests(e);
  }
  manuallyRejectCurrentRequest() {
    return this._requestHandler.manuallyRejectCurrentRequest();
  }
  customErrorRequest(e) {
    return this._requestHandler.customErrorRequest(e);
  }
  _onData(e) {
    C("received data"), this._responseHandler.handleData(e);
    do {
      const t = this._responseHandler.shift();
      if (!t)
        return;
      this.unitId === t.unitId && this._requestHandler.handle(t);
    } while (!0);
  }
}
ae.default = Ft;
var Pt = {}, he = {}, G = {}, z = {};
Object.defineProperty(z, "__esModule", { value: !0 });
const jn = g;
class Hn {
  get fc() {
    return this._fc;
  }
  get isException() {
    return !1;
  }
  static fromRequest(e, t) {
    throw new TypeError("Cannot call from request from abstract class");
  }
  constructor(e, t = !1) {
    if (t === !1 && !jn.isFunctionCode(e))
      throw Error("InvalidFunctionCode");
    this._fc = e;
  }
}
z.default = Hn;
var Wn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(G, "__esModule", { value: !0 });
const br = g, Nn = Wn(z);
class se extends Nn.default {
  get code() {
    return this._code;
  }
  get message() {
    return br.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return !0;
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0) - 128, s = e.readUInt8(1);
    if (!br.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    return new se(t, s);
  }
  static fromRequest(e) {
    return new se(e.fc, e.code);
  }
  constructor(e, t) {
    super(e, !0), this._code = t;
  }
  createPayload() {
    const e = Buffer.alloc(2);
    return e.writeUInt8(this._fc + 128, 0), e.writeUInt8(this._code, 1), e;
  }
}
G.default = se;
function Gn(r) {
  return r instanceof se;
}
G.isExceptionResponseBody = Gn;
var L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
class kn {
  constructor({ err: e, message: t, response: s, request: n }) {
    this.err = e, this.message = t, this.request = n, this.response = s;
  }
}
L.UserRequestError = kn;
function ds(r) {
  return r instanceof ds ? !0 : !(typeof r != "object" || r.err === void 0 || typeof r.err != "string" || r.message === void 0 || typeof r.message != "string");
}
L.isUserRequestError = ds;
var be = {}, Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
class Vn {
  constructor() {
    this.createdAt = /* @__PURE__ */ new Date(), this.startedAt = /* @__PURE__ */ new Date(), this.receivedAt = /* @__PURE__ */ new Date();
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
Ze.UserRequestMetrics = Vn;
Object.defineProperty(be, "__esModule", { value: !0 });
const zn = L, Yn = Ze, Qn = v, pr = Qn("user-request");
class Jn {
  constructor(e, t = 5e3) {
    pr("creating new user request with timeout", t), this._request = e, this._timeout = t, this._metrics = new Yn.UserRequestMetrics(), this._promise = new Promise((s, n) => {
      this._resolve = s, this._reject = n;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(e) {
    this._metrics.startedAt = /* @__PURE__ */ new Date(), this._timer = setTimeout(() => {
      this._reject(new zn.UserRequestError({
        err: "Timeout",
        message: "Req timed out",
        request: this._request
      })), e();
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
  resolve(e) {
    return this._metrics.receivedAt = /* @__PURE__ */ new Date(), pr("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime), this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: e
    });
  }
  get reject() {
    return this._reject;
  }
}
be.default = Jn;
var fs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(he, "__esModule", { value: !0 });
const yr = "OutOfSync", Rr = "Offline", Xn = "ModbusException", Kn = "ManuallyCleared", Zn = v, w = Zn("client-request-handler"), e0 = fs(G), k = L, t0 = fs(be);
class Lt {
  constructor(e, t) {
    if (new.target === Lt)
      throw new TypeError("Cannot instantiate ModbusClientRequestHandler directly.");
    this._socket = e, this._timeout = t, this._state = "offline";
  }
  get state() {
    return this._state;
  }
  get requestCount() {
    return this._requests.length;
  }
  registerRequest(e) {
    const t = new t0.default(e, this._timeout);
    return this._requests.push(t), this._flush(), t.promise;
  }
  handle(e) {
    if (w("incoming response"), !e) {
      w("well, sorry I was wrong, no response at all");
      return;
    }
    const t = this._currentRequest;
    if (!t) {
      w("no current request, no idea where this came from");
      return;
    }
    const s = t.request;
    if (e.body.isException === !1 && e.body.fc !== s.body.fc) {
      w("something is weird, request fc and response fc do not match."), t.reject(new k.UserRequestError({
        err: yr,
        message: "request fc and response fc does not match.",
        request: s
      })), this._clearAllRequests();
      return;
    }
    if (e.body instanceof e0.default) {
      w("response is a exception"), t.reject(new k.UserRequestError({
        err: Xn,
        message: "A Modbus Exception Occurred - See Response Body",
        request: s,
        response: e
      })), this._clearCurrentRequest(), this._flush();
      return;
    }
    w("resolving request"), t.resolve(e), this._clearCurrentRequest(), this._flush();
  }
  manuallyRejectCurrentRequest() {
    this._currentRequest && (this._currentRequest.reject(new k.UserRequestError({
      err: Kn,
      message: "the request was manually cleared",
      request: this._currentRequest.request
    })), this._flush());
  }
  manuallyRejectRequests(e) {
    for (let t = 0; t < e; t++)
      this.manuallyRejectCurrentRequest();
  }
  manuallylRejectAllRequests() {
    this.manuallyRejectRequests(this.requestCount);
  }
  customErrorRequest(e) {
    this._currentRequest && this._currentRequest.reject(e);
  }
  _clearCurrentRequest() {
    this._currentRequest && (this._currentRequest.done(), this._currentRequest = null);
  }
  _clearAllRequests() {
    for (this._clearCurrentRequest(); this._requests.length > 0; ) {
      const e = this._requests.shift();
      e && e.reject(new k.UserRequestError({
        err: yr,
        message: "rejecting because of earlier OutOfSync error",
        request: e.request
      }));
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline", this._currentRequest && this._currentRequest.reject(new k.UserRequestError({
      err: Rr,
      message: "connection to modbus server closed",
      request: this._currentRequest.request
    })), this._clearAllRequests();
  }
  _flush() {
    if (w("flushing"), this._currentRequest !== null) {
      w("executing another request, come back later");
      return;
    }
    if (this._requests.length === 0) {
      w("no request to be executed");
      return;
    }
    if (this._currentRequest = this._requests.shift(), this._state === "offline") {
      w("rejecting request immediatly, client offline"), this._currentRequest && this._currentRequest.reject(new k.UserRequestError({
        err: Rr,
        message: "no connection to modbus server",
        request: this._currentRequest.request
      })), this._clearCurrentRequest(), setTimeout(this._flush.bind(this), 0);
      return;
    }
    const e = this._currentRequest && this._currentRequest.createPayload();
    w("flushing new request", e), this._currentRequest && this._currentRequest.start(() => {
      this._clearCurrentRequest(), this._flush();
    }), this._socket.write(e, (t) => {
      w("request fully flushed, ( error:", t, ")");
    });
  }
}
he.default = Lt;
var pe = {}, Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
class xs {
}
xs.fromBuffer = (r) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
Y.default = xs;
function r0(r) {
  return r.body !== void 0;
}
Y.isModbusRequest = r0;
var ls = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(pe, "__esModule", { value: !0 });
const s0 = v, we = s0("tcp-request"), n0 = ls(Y), a0 = ls(de);
class $t extends n0.default {
  constructor(e, t, s, n, a) {
    super(), this._id = e, this._protocol = t, this._length = s, this._unitId = n, this._body = a;
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
    return !1;
  }
  get byteCount() {
    return this._length + 6;
  }
  static fromBuffer(e) {
    try {
      if (e.length < 7)
        return we("no enough data in the buffer yet"), null;
      const t = e.readUInt16BE(0), s = e.readUInt16BE(2), n = e.readUInt16BE(4), a = e.readUInt8(6);
      we("tcp header complete, id", t, "protocol", s, "length", n, "unitId", a), we("buffer", e);
      const c = a0.default.fromBuffer(e.slice(7, 6 + n));
      return c ? new $t(t, s, n, a, c) : null;
    } catch (t) {
      return we("not enough data to create a tcp request", t), null;
    }
  }
  createPayload() {
    const e = this._body.createPayload(), t = Buffer.alloc(7 + this._body.byteCount);
    return t.writeUInt16BE(this._id, 0), t.writeUInt16BE(0, 2), t.writeUInt16BE(this._body.byteCount + 1, 4), t.writeUInt8(this._unitId, 6), e.copy(t, 7), t;
  }
}
pe.default = $t;
var _s = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Pt, "__esModule", { value: !0 });
const i0 = v, qe = i0("tcp-client-request-handler"), u0 = _s(he), o0 = _s(pe), gr = L, c0 = "OutOfSync", d0 = "Protocol";
class f0 extends u0.default {
  constructor(e, t, s = 5e3) {
    super(e, s), this._requestId = 0, this._unitId = t, this._requests = [], this._currentRequest = null, this._socket.on("connect", this._onConnect.bind(this)), this._socket.on("close", this._onClose.bind(this));
  }
  register(e) {
    this._requestId = (this._requestId + 1) % 65535, qe("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", e.byteCount);
    const t = new o0.default(this._requestId, 0, e.byteCount + 1, this._unitId, e);
    return super.registerRequest(t);
  }
  handle(e) {
    if (!e)
      return;
    const t = this._currentRequest;
    if (!t) {
      qe("something is strange, received a respone without a request");
      return;
    }
    const s = t.request;
    if (e.id !== s.id) {
      qe("something weird is going on, response transition id does not equal request transition id", e.id, s.id), t.reject(new gr.UserRequestError({
        err: c0,
        message: "request fc and response fc does not match.",
        request: s
      })), this._clearAllRequests();
      return;
    }
    if (e.protocol !== 0) {
      qe("server responds with wrong protocol version"), t.reject(new gr.UserRequestError({
        err: d0,
        message: "Unknown protocol version " + e.protocol,
        request: s
      })), this._clearAllRequests();
      return;
    }
    super.handle(e);
  }
}
Pt.default = f0;
var jt = {}, ye = {};
Object.defineProperty(ye, "__esModule", { value: !0 });
class x0 {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
ye.default = x0;
var Re = {}, ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
class l0 {
  get body() {
    return this._body;
  }
  static fromRequest(e, t) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
ge.default = l0;
var ve = {}, et = {};
const _0 = v, vr = _0("buffer-utils");
class h0 {
  static bufferShift(e, t, s) {
    e = e - 1;
    const n = e % 8, a = Math.floor(e / 8), d = Math.floor(t / 8) - a + 1, f = Buffer.allocUnsafe(d);
    f[0] = s[0] << n, vr("buffer[0] = %s ( %s << %d )", f[0].toString(2), s[0].toString(2), n);
    const h = Buffer.concat([s, Buffer.alloc(1)], s.length + 1);
    for (let o = 1; o < d; o++)
      f[o] = (h[o] << n) + (h[o - 1] >> 8 - n), vr("buffer[%d] = %s ( %s << %d + %s >> %d)", o, f[o].toString(2), h[o].toString(2), n, h[o - 1].toString(2), 8 - e);
    return f;
  }
  static firstByte(e, t, s) {
    e = e - 1;
    const a = 255 >> 8 - e % 8, c = t & a;
    return s + c;
  }
  static lastByte(e, t, s) {
    const a = 255 << e % 8, c = t & a;
    return s + c;
  }
  static bufferToArrayStatus(e) {
    const t = [];
    let s, n, a;
    if (!(e instanceof Buffer))
      return t;
    for (let c = 0; c < e.length * 8; c += 1) {
      s = c % 8, n = Math.floor(c / 8), a = e.readUInt8(n);
      const d = (a & Math.pow(2, s)) > 0;
      t.push(d ? 1 : 0);
    }
    return t;
  }
  static arrayStatusToBuffer(e) {
    const t = e instanceof Array ? Math.ceil(e.length / 8) : 0, s = Buffer.alloc(t);
    if (!(e instanceof Array))
      return s;
    let n, a, c;
    for (let d = 0; d < e.length; d += 1)
      n = Math.floor(d / 8), a = d % 8, c = s.readUInt8(n), c += e[d] ? Math.pow(2, a) : 0, s.writeUInt8(c, n);
    return s;
  }
}
var Ht = h0, Q = {}, b0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Q, "__esModule", { value: !0 });
const p0 = b0(z);
class y0 extends p0.default {
  constructor(e) {
    super(e);
  }
  get fc() {
    return this._fc;
  }
}
Q.default = y0;
var hs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(et, "__esModule", { value: !0 });
const R0 = v, g0 = R0("read-coils-response"), v0 = hs(Ht), Ir = g, I0 = hs(Q), { bufferToArrayStatus: Cr, arrayStatusToBuffer: C0 } = v0.default;
class Te extends I0.default {
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
  static fromRequest(e, t) {
    const s = Cr(t), n = e.start, a = n + e.count, c = s.slice(n, a);
    return new Te(c, Math.ceil(c.length / 8));
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
      return n.length !== s || t !== Ir.FC.READ_COIL ? null : new Te(n, s);
    } catch {
      return g0("no valid read coils response body in the buffer yet"), null;
    }
  }
  constructor(e, t) {
    if (super(Ir.FC.READ_COIL), this._coils = e, this._numberOfBytes = t, e instanceof Array)
      this._valuesAsArray = e, this._valuesAsBuffer = C0(e);
    else if (e instanceof Buffer)
      this._valuesAsBuffer = e, this._valuesAsArray = Cr(e);
    else
      throw new Error("InvalidCoilsInput");
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(e, 2), e;
  }
}
et.default = Te;
var tt = {}, bs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(tt, "__esModule", { value: !0 });
const E0 = bs(Ht), Er = g, m0 = bs(Q), { bufferToArrayStatus: mr, arrayStatusToBuffer: B0 } = E0.default;
class Ue extends m0.default {
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
  static fromRequest(e, t) {
    const s = mr(t), n = e.start, a = n + e.count, c = s.slice(n, a);
    return new Ue(c, Math.ceil(c.length / 8));
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
      return n.length !== s || t !== Er.FC.READ_DISCRETE_INPUT ? null : new Ue(n, s);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(Er.FC.READ_DISCRETE_INPUT), this._discrete = e, this._numberOfBytes = t, e instanceof Array)
      this._valuesAsArray = e, this._valuesAsBuffer = B0(e);
    else if (e instanceof Buffer)
      this._valuesAsBuffer = e, this._valuesAsArray = mr(e);
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(e, 2), e;
  }
}
tt.default = Ue;
var rt = {}, w0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(rt, "__esModule", { value: !0 });
const q0 = v, M0 = q0("ReadHoldingRegistersResponseBody"), Br = g, A0 = w0(Q);
class Fe extends A0.default {
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
  static fromRequest(e, t) {
    const s = e.start * 2, n = e.start * 2 + e.count * 2, a = t.slice(s, n);
    return new Fe(a.length, a);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
    if (t !== Br.FC.READ_HOLDING_REGISTERS)
      return null;
    const a = [];
    for (let c = 0; c < s; c += 2)
      a.push(n.readUInt16BE(c));
    return new Fe(s, a, n);
  }
  constructor(e, t, s) {
    if (super(Br.FC.READ_HOLDING_REGISTERS), this._byteCount = e, this._values = t, this._bufferLength = 2, M0("ReadHoldingRegistersResponseBody values", t), t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = Buffer.from(t), this._bufferLength += t.length * 2;
    else if (t instanceof Buffer)
      this._valuesAsArray = Uint16Array.from(t), this._valuesAsBuffer = t, this._bufferLength += t.length;
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
    s instanceof Buffer && (this._valuesAsBuffer = s);
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let e = Buffer.alloc(2);
      return e.writeUInt8(this._fc, 0), e.writeUInt8(this._byteCount, 1), e = Buffer.concat([e, this._values]), e;
    }
    if (this._values instanceof Array) {
      const e = Buffer.alloc(this._byteCount + 2);
      return e.writeUInt8(this._fc, 0), e.writeUInt8(this._byteCount, 1), this._values.forEach((t, s) => {
        e.writeUInt16BE(Math.max(0, Math.min(65535, t)), 2 * s + 2);
      }), e;
    }
    throw new Error("InvalidType_MustBeBufferOrArray");
  }
}
rt.default = Fe;
var st = {}, S0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(st, "__esModule", { value: !0 });
const wr = g, D0 = S0(Q);
class Pe extends D0.default {
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
  static fromRequest(e, t) {
    const s = e.start * 2, n = s + e.count * 2, a = t.slice(s, n);
    return new Pe(a.length, a);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
    if (t !== wr.FC.READ_INPUT_REGISTERS)
      return null;
    const a = [];
    for (let c = 0; c < s; c += 2)
      a.push(n.readUInt16BE(c));
    return new Pe(s, a, n);
  }
  constructor(e, t, s) {
    if (super(wr.FC.READ_INPUT_REGISTERS), this._byteCount = e, this._values = t, this._bufferLength = 2, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = Buffer.from(t), this._bufferLength += t.length * 2;
    else if (t instanceof Buffer)
      this._valuesAsArray = Uint16Array.from(t), this._valuesAsBuffer = t, this._bufferLength += t.length;
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
    s instanceof Buffer && (this._valuesAsBuffer = s);
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let e = Buffer.alloc(2);
      return e.writeUInt8(this._fc, 0), e.writeUInt8(this._byteCount, 1), e = Buffer.concat([e, this._values]), e;
    }
    if (this._values instanceof Array) {
      const e = Buffer.alloc(this._byteCount + 2);
      return e.writeUInt8(this._fc, 0), e.writeUInt8(this._byteCount, 1), this._values.forEach((t, s) => {
        e.writeUInt16BE(Math.max(0, Math.min(65535, t)), 2 + 2 * s);
      }), e;
    }
    throw new Error("this._values is not an instance of a Buffer or an Array");
  }
}
st.default = Pe;
var nt = {}, J = {}, O0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(J, "__esModule", { value: !0 });
const T0 = O0(z);
class U0 extends T0.default {
}
J.default = U0;
var F0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(nt, "__esModule", { value: !0 });
const qr = g, P0 = F0(J);
class Le extends P0.default {
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
  static fromRequest(e) {
    const t = e.address, s = e.quantity;
    return new Le(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
    return t !== qr.FC.WRITE_MULTIPLE_COILS ? null : new Le(s, n);
  }
  constructor(e, t) {
    super(qr.FC.WRITE_MULTIPLE_COILS), this._start = e, this._quantity = t;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._quantity, 3), e;
  }
}
nt.default = Le;
var at = {}, L0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(at, "__esModule", { value: !0 });
const Mr = g, $0 = L0(J);
class $e extends $0.default {
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
  static fromRequest(e) {
    const t = e.address, s = e.quantity;
    return new $e(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
    return t !== Mr.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new $e(s, n);
  }
  constructor(e, t) {
    super(Mr.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), this._start = e, this._quantity = t;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._quantity, 3), e;
  }
}
at.default = $e;
var it = {}, j0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(it, "__esModule", { value: !0 });
const Ar = g, H0 = j0(J);
class je extends H0.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value === 65280;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(e) {
    const t = e.address, s = e.value;
    return new je(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3) === 65280;
    return t !== Ar.FC.WRITE_SINGLE_COIL ? null : new je(s, n);
  }
  constructor(e, t) {
    super(Ar.FC.WRITE_SINGLE_COIL), this._address = e, this._value = t === 65280 ? 65280 : 0;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value, 3), e;
  }
}
it.default = je;
var ut = {}, W0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ut, "__esModule", { value: !0 });
const Sr = g, N0 = W0(J);
class He extends N0.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(e) {
    const t = e.address, s = e.value;
    return new He(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
    return t !== Sr.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new He(s, n);
  }
  constructor(e, t) {
    super(Sr.FC.WRITE_SINGLE_HOLDING_REGISTER), this._address = e, this._value = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value, 3), e;
  }
}
ut.default = He;
var $ = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ve, "__esModule", { value: !0 });
const G0 = v, yt = G0("response-factory"), j = g, k0 = $(G), V0 = $(et), z0 = $(tt), Y0 = $(rt), Q0 = $(st), J0 = $(nt), X0 = $(at), K0 = $(it), Z0 = $(ut);
class ea {
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0);
      return yt("fc", t, "payload", e), t > 128 ? k0.default.fromBuffer(e) : t === j.FC.READ_COIL ? V0.default.fromBuffer(e) : t === j.FC.READ_DISCRETE_INPUT ? z0.default.fromBuffer(e) : t === j.FC.READ_HOLDING_REGISTERS ? Y0.default.fromBuffer(e) : t === j.FC.READ_INPUT_REGISTERS ? Q0.default.fromBuffer(e) : t === j.FC.WRITE_SINGLE_COIL ? K0.default.fromBuffer(e) : t === j.FC.WRITE_SINGLE_HOLDING_REGISTER ? Z0.default.fromBuffer(e) : t === j.FC.WRITE_MULTIPLE_COILS ? J0.default.fromBuffer(e) : t === j.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? X0.default.fromBuffer(e) : null;
    } catch (t) {
      return yt("when NoSuchIndex Exception, the buffer does not contain a complete message"), yt(t), null;
    }
  }
}
ve.default = ea;
var ps = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Re, "__esModule", { value: !0 });
const ta = v, Z = ta("tcp-response"), ra = ps(ge), sa = ps(ve);
class We extends ra.default {
  constructor(e, t, s, n, a) {
    super(), this._id = e, this._protocol = t, this._bodyLength = s, this._unitId = n, this._body = a;
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
  static fromRequest(e, t) {
    return new We(e.id, e.protocol, t.byteCount + 1, e.unitId, t);
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt16BE(0), s = e.readUInt16BE(2), n = e.readUInt16BE(4), a = e.readUInt8(6);
      Z("tcp header complete, id", t, "protocol", s, "length", n, "unitId", a), Z("buffer", e);
      const c = sa.default.fromBuffer(e.slice(7, 7 + n - 1));
      return c ? (Z("buffer contains a valid response body"), new We(t, s, n, a, c)) : (Z("not enough data for a response body"), null);
    } catch {
      return Z("not enough data available"), null;
    }
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt16BE(this._id, 0), e.writeUInt16BE(this._protocol, 2), e.writeUInt16BE(this._bodyLength, 4), e.writeUInt8(this._unitId, 6), this._body.createPayload().copy(e, 7), e;
  }
}
Re.default = We;
var ys = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(jt, "__esModule", { value: !0 });
const na = v, ee = na("tcp-response-handler"), aa = ys(ye), ia = ys(Re);
class ua extends aa.default {
  constructor() {
    super(), this._buffer = Buffer.alloc(0), this._messages = [];
  }
  handleData(e) {
    ee("receiving new data", e), this._buffer = Buffer.concat([this._buffer, e]), ee("buffer", this._buffer);
    do {
      const t = ia.default.fromBuffer(this._buffer);
      if (!t) {
        ee("not enough data available to parse");
        return;
      }
      ee("response id", t.id, "protocol", t.protocol, "length", t.bodyLength, "unit", t.unitId), ee("reset buffer from", this._buffer.length, "to", this._buffer.length - t.byteCount), this._messages.push(t), this._buffer = this._buffer.slice(t.byteCount);
    } while (!0);
  }
}
jt.default = ua;
var Wt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Tt, "__esModule", { value: !0 });
const oa = Wt(ae), ca = Wt(Pt), da = Wt(jt);
class fa extends oa.default {
  constructor(e, t = 1, s = 5e3) {
    super(e), this._requestHandler = new ca.default(e, t, s), this._responseHandler = new da.default(), this._unitId = t, this._timeout = s;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
Tt.default = fa;
var Nt = {}, Gt = {}, Me = {}, Dr;
function T() {
  return Dr || (Dr = 1, Object.defineProperty(Me, "__esModule", {
    value: !0
  }), Me.default = function(r, e) {
    var t = function(n, a) {
      return e(n, a) >>> 0;
    };
    return t.signed = e, t.unsigned = t, t.model = r, t;
  }), Me;
}
var Rt, Or;
function xa() {
  if (Or) return Rt;
  Or = 1;
  var r = D, e = T(), t = s(e);
  function s(n) {
    return n && n.__esModule ? n : { default: n };
  }
  return Rt = (0, t.default)("crc1", function(n, a) {
    r.Buffer.isBuffer(n) || (n = (0, r.Buffer)(n));
    for (var c = ~~a, d = 0, f = 0; f < n.length; f++) {
      var h = n[f];
      d += h;
    }
    return c += d % 256, c % 256;
  }), Rt;
}
var gt, Tr;
function la() {
  if (Tr) return gt;
  Tr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), gt = (0, t.default)("crc-8", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = ~~c, f = 0; f < a.length; f++) {
      var h = a[f];
      d = n[(d ^ h) & 255] & 255;
    }
    return d;
  }), gt;
}
var vt, Ur;
function _a() {
  if (Ur) return vt;
  Ur = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255, 70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), vt = (0, t.default)("dallas-1-wire", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = ~~c, f = 0; f < a.length; f++) {
      var h = a[f];
      d = n[(d ^ h) & 255] & 255;
    }
    return d;
  }), vt;
}
var It, Fr;
function ha() {
  if (Fr) return It;
  Fr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), It = (0, t.default)("crc-16", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = ~~c, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d ^ h) & 255] ^ d >> 8) & 65535;
    }
    return d;
  }), It;
}
var Ct, Pr;
function ba() {
  if (Pr) return Ct;
  Pr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Ct = (0, t.default)("ccitt", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 65535, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d >> 8 ^ h) & 255] ^ d << 8) & 65535;
    }
    return d;
  }), Ct;
}
var Et, Lr;
function pa() {
  if (Lr) return Et;
  Lr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Et = (0, t.default)("crc-16-modbus", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 65535, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d ^ h) & 255] ^ d >> 8) & 65535;
    }
    return d;
  }), Et;
}
var mt, $r;
function ya() {
  if ($r) return mt;
  $r = 1;
  var r = D, e = T(), t = s(e);
  function s(n) {
    return n && n.__esModule ? n : { default: n };
  }
  return mt = (0, t.default)("xmodem", function(n, a) {
    r.Buffer.isBuffer(n) || (n = (0, r.Buffer)(n));
    for (var c = typeof a < "u" ? ~~a : 0, d = 0; d < n.length; d++) {
      var f = n[d], h = c >>> 8 & 255;
      h ^= f & 255, h ^= h >>> 4, c = c << 8 & 65535, c ^= h, h = h << 5 & 65535, c ^= h, h = h << 7 & 65535, c ^= h;
    }
    return c;
  }), mt;
}
var Bt, jr;
function Ra() {
  if (jr) return Bt;
  jr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Bt = (0, t.default)("kermit", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 0, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d ^ h) & 255] ^ d >> 8) & 65535;
    }
    return d;
  }), Bt;
}
var wt, Hr;
function ga() {
  if (Hr) return wt;
  Hr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), wt = (0, t.default)("crc-24", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 11994318, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d >> 16 ^ h) & 255] ^ d << 8) & 16777215;
    }
    return d;
  }), wt;
}
var qt, Wr;
function va() {
  if (Wr) return qt;
  Wr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), qt = (0, t.default)("crc-32", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = c === 0 ? 0 : ~~c ^ -1, f = 0; f < a.length; f++) {
      var h = a[f];
      d = n[(d ^ h) & 255] ^ d >>> 8;
    }
    return d ^ -1;
  }), qt;
}
var Mt, Nr;
function kt() {
  return Nr || (Nr = 1, Mt = {
    crc1: xa(),
    crc8: la(),
    crc81wire: _a(),
    crc16: ha(),
    crc16ccitt: ba(),
    crc16modbus: pa(),
    crc16xmodem: ya(),
    crc16kermit: Ra(),
    crc24: ga(),
    crc32: va()
  }), Mt;
}
var X = {}, Rs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(X, "__esModule", { value: !0 });
const Ia = v, Ae = Ia("rtu-request"), Gr = kt(), Ca = Rs(Y), Ea = Rs(de);
class Vt extends Ca.default {
  constructor(e, t, s = !1) {
    super(), this._address = e, this._body = t, this._corrupted = s;
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
    return this._corrupted === !0;
  }
  get body() {
    return this._body;
  }
  get byteCount() {
    return this.body.byteCount + 3;
  }
  static fromBuffer(e) {
    try {
      if (e.length < 3)
        return Ae("not enough data in the buffer yet"), null;
      const t = e.readUInt8(0);
      Ae(`rtu header complete, address, ${t}`), Ae("buffer", e);
      const s = Ea.default.fromBuffer(e.slice(1));
      if (!s)
        return null;
      const n = 1 + s.byteCount, a = Gr.crc16modbus(e.slice(0, n)), c = e.readUInt16LE(n), d = a !== c;
      return new Vt(t, s, d);
    } catch (t) {
      return Ae("not enough data to create a rtu request", t), null;
    }
  }
  createPayload() {
    const e = this._body.createPayload();
    this._crc = Gr.crc16modbus(Buffer.concat([Buffer.from([this._address]), e]));
    const t = Buffer.alloc(2);
    t.writeUInt16LE(this._crc, 0);
    const s = Buffer.from([this._address]);
    return Buffer.concat([s, e, t]);
  }
}
X.default = Vt;
var zt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Gt, "__esModule", { value: !0 });
const ma = v, te = ma("rtu-client-request-handler"), Ba = zt(kt()), wa = zt(he), qa = zt(X), Ma = L;
class Aa extends wa.default {
  constructor(e, t, s = 5e3) {
    super(e, s), this._address = t, this._requests = [], this._currentRequest = null, this._socket.on("open", this._onConnect.bind(this)), this._socket.isOpen && this._onConnect();
  }
  register(e) {
    te("registrating new request");
    const t = new qa.default(this._address, e);
    return super.registerRequest(t);
  }
  handle(e) {
    if (te("new response coming in"), !e)
      return;
    const t = this._currentRequest;
    if (!t) {
      te("something is strange, received a respone without a request");
      return;
    }
    const s = Buffer.concat([Buffer.from([e.address]), e.body.createPayload()]);
    te("create crc from response", s);
    const n = Ba.default.crc16modbus(s);
    if (e.crc !== n) {
      te("CRC does not match", e.crc, "!==", n), t.reject(new Ma.UserRequestError({
        err: "crcMismatch",
        message: "the response payload does not match the crc",
        request: t.request,
        response: e
      })), this._clearAllRequests();
      return;
    }
    super.handle(e);
  }
  get address() {
    return this._address;
  }
}
Gt.default = Aa;
var Yt = {}, Ie = {}, gs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Ie, "__esModule", { value: !0 });
const Sa = v, kr = Sa("rtu-response"), Da = kt(), Oa = gs(ge), Ta = gs(ve);
class Ne extends Oa.default {
  constructor(e, t, s) {
    super(), this._address = e, this._crc = t, this._body = s;
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
  static fromRequest(e, t) {
    return new Ne(e.address, void 0, t);
  }
  static fromBuffer(e) {
    if (e.length < 1)
      return null;
    const t = e.readUInt8(0);
    kr("address", t, "buffer", e);
    const s = Ta.default.fromBuffer(e.slice(1));
    if (!s)
      return null;
    let n;
    try {
      n = e.readUInt16LE(1 + s.byteCount);
    } catch {
      return kr("If NoSuchIndexException, it is probably serial and not all data has arrived"), null;
    }
    return new Ne(t, n, s);
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._address, 0), this._body.createPayload().copy(e, 1), this._crc = Da.crc16modbus(e.slice(0, this.byteCount - 2)), e.writeUInt16LE(this._crc, this.byteCount - 2), e;
  }
}
Ie.default = Ne;
var vs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Yt, "__esModule", { value: !0 });
const Ua = v, re = Ua("rtu-response-handler"), Fa = vs(ye), Pa = vs(Ie);
class La extends Fa.default {
  constructor() {
    super(), this._messages = [];
  }
  handleData(e) {
    re("receiving new data"), this._buffer = Buffer.concat([this._buffer, e]), re("buffer", this._buffer);
    do {
      const t = Pa.default.fromBuffer(this._buffer);
      if (!t) {
        re("not enough data available to parse");
        return;
      }
      re("crc", t.crc), re("reset buffer from", this._buffer.length, "to", this._buffer.length - t.byteCount), this._buffer = this._buffer.slice(t.byteCount), this._messages.push(t);
    } while (!0);
  }
  shift() {
    return this._messages.shift();
  }
}
Yt.default = La;
var Qt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Nt, "__esModule", { value: !0 });
const $a = Qt(ae), ja = Qt(Gt), Ha = Qt(Yt);
class Wa extends $a.default {
  constructor(e, t, s = 5e3) {
    super(e), this._requestHandler = new ja.default(e, t, s), this._responseHandler = new Ha.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
Nt.default = Wa;
var Jt = {}, ot = {};
Object.defineProperty(ot, "__esModule", { value: !0 });
const Na = Ws, Vr = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class Ga extends Na.EventEmitter {
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
  constructor(e = Vr) {
    super(), this._options = Object.assign({}, Vr, e);
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
  on(e, t) {
    return super.on(e, t);
  }
  emit(e, ...t) {
    return super.emit(e, ...t);
  }
}
ot.default = Ga;
var ct = {}, Se = {}, zr;
function ka() {
  if (zr) return Se;
  zr = 1;
  var r = x && x.__importDefault || function(a) {
    return a && a.__esModule ? a : { default: a };
  };
  Object.defineProperty(Se, "__esModule", { value: !0 });
  const e = r(X), s = v("modbus-server-request-handler");
  class n {
    constructor(c) {
      this._fromBuffer = c, this._requests = [], this._buffer = Buffer.alloc(0);
    }
    shift() {
      return this._requests.shift();
    }
    handle(c) {
      this._buffer = Buffer.concat([this._buffer, c]), s("this._buffer", this._buffer);
      do {
        const d = this._fromBuffer(this._buffer);
        if (s("request", d), !d)
          return;
        if (d instanceof e.default && d.corrupted) {
          const f = this._buffer.slice(0, d.byteCount).toString("hex");
          s(`request message was corrupt: ${f}`);
        } else
          this._requests.unshift(d);
        this._buffer = this._buffer.slice(d.byteCount);
      } while (!0);
    }
  }
  return Se.default = n, Se;
}
var De = {}, E = {};
Object.defineProperty(E, "__esModule", { value: !0 });
var Is = G;
E.ExceptionResponseBody = Is.default;
E.isExceptionResponseBody = Is.isExceptionResponseBody;
var Va = et;
E.ReadCoilsResponseBody = Va.default;
var za = tt;
E.ReadDiscreteInputsResponseBody = za.default;
var Ya = rt;
E.ReadHoldingRegistersResponseBody = Ya.default;
var Qa = st;
E.ReadInputRegistersResponseBody = Qa.default;
var Ja = z;
E.ModbusResponseBody = Ja.default;
var Xa = ve;
E.ResponseFactory = Xa.default;
var Ka = nt;
E.WriteMultipleCoilsResponseBody = Ka.default;
var Za = at;
E.WriteMultipleRegistersResponseBody = Za.default;
var ei = it;
E.WriteSingleCoilResponseBody = ei.default;
var ti = ut;
E.WriteSingleRegisterResponseBody = ti.default;
var Yr;
function ri() {
  if (Yr) return De;
  Yr = 1;
  var r = x && x.__importDefault || function(o) {
    return o && o.__esModule ? o : { default: o };
  };
  Object.defineProperty(De, "__esModule", { value: !0 });
  const e = E, t = R, s = r(Ht), n = g, { bufferToArrayStatus: a, arrayStatusToBuffer: c } = s.default, f = v("modbus tcp response handler");
  class h {
    constructor(i, u) {
      this._server = i, this._fromRequest = u;
    }
    handle(i, u) {
      if (!i)
        return null;
      if (t.isExceptionRequestBody(i.body)) {
        const l = e.ExceptionResponseBody.fromRequest(i.body), p = this._fromRequest(i, l);
        return u(p.createPayload()), p;
      }
      const _ = i.body.fc;
      if (n.isFunctionCode(_))
        switch (_) {
          case n.FC.READ_COIL:
            return this._handleReadCoil(i, u);
          case n.FC.READ_DISCRETE_INPUT:
            return this._handleDiscreteInput(i, u);
          case n.FC.READ_HOLDING_REGISTERS:
            return this._handleReadHoldingRegisters(i, u);
          case n.FC.READ_INPUT_REGISTERS:
            return this._handleReadInputRegisters(i, u);
          case n.FC.WRITE_SINGLE_COIL:
            return this._handleWriteSingleCoil(i, u);
          case n.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return this._handleWriteSingleHoldingRegister(i, u);
          case n.FC.WRITE_MULTIPLE_COILS:
            return this._handleWriteMultipleCoils(i, u);
          case n.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return this._handleWriteMultipleHoldingRegisters(i, u);
        }
    }
    _handleReadCoil(i, u) {
      if (!t.isReadCoilsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadCoilsRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying readCoils handler"), this._server.emit("readCoils", i, u);
        return;
      }
      this._server.emit("preReadCoils", i, u);
      const _ = e.ReadCoilsResponseBody.fromRequest(i.body, this._server.coils), l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postReadCoils", i, u), l;
    }
    _handleDiscreteInput(i, u) {
      if (!t.isReadDiscreteInputsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${i.body.name}`);
      if (!this._server.discrete) {
        f("no discrete input buffer on server, trying readDiscreteInputs handler"), this._server.emit("readDiscreteInputs", i, u);
        return;
      }
      this._server.emit("preReadDiscreteInputs", i, u);
      const _ = e.ReadDiscreteInputsResponseBody.fromRequest(i.body, this._server.discrete), l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postReadDiscreteInputs", i, u), l;
    }
    _handleReadHoldingRegisters(i, u) {
      if (!t.isReadHoldingRegistersRequestBody(i.body)) {
        const b = `InvalidRequestClass - Expected ReadHoldingRegistersRequestBody but received ${i.body.name}`;
        throw new Error(b);
      }
      if (!this._server.holding) {
        f("no holding register buffer on server, trying readHoldingRegisters handler"), this._server.emit("readHoldingRegisters", i, u);
        return;
      }
      this._server.emit("preReadHoldingRegisters", i, u);
      const _ = e.ReadHoldingRegistersResponseBody.fromRequest(i.body, this._server.holding), l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postReadHoldingRegisters", i, u), l;
    }
    _handleReadInputRegisters(i, u) {
      if (!t.isReadInputRegistersRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${i.body.name}`);
      if (!this._server.input) {
        f("no input register buffer on server, trying readInputRegisters handler"), this._server.emit("readInputRegisters", i, u);
        return;
      }
      this._server.emit("preReadInputRegisters", i, u);
      const _ = e.ReadInputRegistersResponseBody.fromRequest(i.body, this._server.input), l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postReadInputRegisters", i, u), l;
    }
    _handleWriteSingleCoil(i, u) {
      if (!t.isWriteSingleCoilRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying writeSingleCoil handler"), this._server.emit("writeSingleCoil", i, u);
        return;
      }
      this._server.emit("preWriteSingleCoil", i, u);
      const _ = e.WriteSingleCoilResponseBody.fromRequest(i.body), l = i.body.address;
      f("Writing value %d to address %d", i.body.value, l);
      const p = this._server.coils.readUInt8(Math.floor(l / 8));
      let b;
      if (i.body.value !== 65280 && i.body.value !== 0) {
        f("illegal data value");
        const M = new e.ExceptionResponseBody(i.body.fc, 3), U = this._fromRequest(i, M);
        return u(U.createPayload()), U;
      }
      if (i.body.value === 65280 ? b = p | Math.pow(2, l % 8) : b = p & ~Math.pow(2, l % 8), _.address / 8 > this._server.coils.length) {
        f("illegal data address");
        const M = new e.ExceptionResponseBody(i.body.fc, 2), U = this._fromRequest(i, M);
        return u(U.createPayload()), U;
      } else
        this._server.coils.writeUInt8(b, Math.floor(l / 8));
      const I = this._fromRequest(i, _), q = I.createPayload();
      return u(q), this._server.emit("postWriteSingleCoil", i, u), I;
    }
    _handleWriteSingleHoldingRegister(i, u) {
      if (!t.isWriteSingleRegisterRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleRegisterRequestBody but received ${i.body.name}`);
      if (!this._server.holding) {
        f("no register buffer on server, trying writeSingleRegister handler"), this._server.emit("writeSingleRegister", i, u);
        return;
      }
      this._server.emit("preWriteSingleRegister", i, u);
      const _ = e.WriteSingleRegisterResponseBody.fromRequest(i.body);
      if (_.address * 2 > this._server.holding.length) {
        f("illegal data address");
        const b = new e.ExceptionResponseBody(i.body.fc, 2), I = this._fromRequest(i, b);
        return u(I.createPayload()), I;
      } else
        this._server.holding.writeUInt16BE(_.value, _.address * 2);
      const l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postWriteSingleRegister", i, u), l;
    }
    _handleWriteMultipleCoils(i, u) {
      if (!t.isWriteMultipleCoilsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying writeMultipleCoils handler"), this._server.emit("writeMultipleCoils", i, u);
        return;
      }
      this._server.emit("preWriteMultipleCoils", i, u);
      const _ = e.WriteMultipleCoilsResponseBody.fromRequest(i.body), l = a(this._server.coils), p = a(i.body.valuesAsBuffer), b = i.body.address, I = b + i.body.quantity, q = l.map((W, Ee) => {
        let K = W;
        if (Ee >= b && Ee < I) {
          const tr = p.shift();
          K = tr !== void 0 ? tr : W;
        }
        return K;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, l), this._server.coils.fill(c(q)), this._server.emit("postWriteMultipleCoils", this._server.coils, q);
      const M = this._fromRequest(i, _), U = M.createPayload();
      return u(U), this._server.emit("postWriteMultipleCoils", i, u), M;
    }
    _handleWriteMultipleHoldingRegisters(i, u) {
      if (!t.isWriteMultipleRegistersRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleRegistersRequestBody but received ${i.body.name}`);
      if (!this._server.holding) {
        f("no register buffer on server, trying writeMultipleRegisters handler"), this._server.emit("writeMultipleRegisters", i, u);
        return;
      }
      this._server.emit("preWriteMultipleRegisters", i, u);
      const _ = e.WriteMultipleRegistersResponseBody.fromRequest(i.body);
      if (i.body.address * 2 + i.body.values.length > this._server.holding.length) {
        f("illegal data address");
        const b = new e.ExceptionResponseBody(i.body.fc, 2), I = this._fromRequest(i, b);
        return u(I.createPayload()), I;
      } else
        this._server.emit("writeMultipleRegisters", this._server.holding), f("Request Body: ", i.body), this._server.holding.fill(new Uint8Array(i.body.values), i.body.address * 2, i.body.address * 2 + i.body.values.length), this._server.emit("postWriteMultipleRegisters", this._server.holding);
      const l = this._fromRequest(i, _), p = l.createPayload();
      return u(p), this._server.emit("postWriteMultipleRegisters", i, u), l;
    }
  }
  return De.default = h, De;
}
var Cs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ct, "__esModule", { value: !0 });
const si = v, At = si("modbus tcp client socket"), ni = Cs(ka()), ai = Cs(ri());
class ii {
  constructor(e, t, s, n) {
    this._server = e, this._socket = t, this._requestHandler = new ni.default(s), this._responseHandler = new ai.default(this._server, n), this._socket.on("data", this._onData.bind(this));
  }
  get socket() {
    return this._socket;
  }
  get server() {
    return this._server;
  }
  _onData(e) {
    At("new data coming in"), this._requestHandler.handle(e);
    do {
      const t = this._requestHandler.shift();
      if (!t) {
        At("no request to process");
        break;
      }
      this._responseHandler.handle(t, (s) => {
        this._socket.write(s, () => {
          At("response flushed", s);
        });
      });
    } while (!0);
  }
}
ct.default = ii;
var dt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Jt, "__esModule", { value: !0 });
const ui = v, oi = ui("modbus tcp server"), ci = dt(ot), di = dt(ct), fi = dt(pe), xi = dt(Re);
class li extends ci.default {
  constructor(e, t) {
    super(t), this._server = e, e.on("connection", this._onConnection.bind(this));
  }
  _onConnection(e) {
    oi("new connection coming in");
    const t = fi.default.fromBuffer, s = xi.default.fromRequest, n = new di.default(this, e, t, s);
    this.emit("connection", n);
  }
}
Jt.default = li;
var Xt = {}, ft = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Xt, "__esModule", { value: !0 });
const _i = ft(ct), hi = ft(ot), bi = ft(X), pi = ft(Ie);
class yi extends hi.default {
  constructor(e, t) {
    super(t), this._socket = e;
    const s = bi.default.fromBuffer, n = pi.default.fromRequest, a = new _i.default(this, e, s, n);
    this.emit("connection", a);
  }
}
Xt.default = yi;
var Es = {}, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
const Ri = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function gi(r) {
  return typeof r != "object" ? !1 : !!Ri.includes(r.message);
}
Kt.isInternalException = gi;
var ms = {};
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(L);
})(ms);
(function(r) {
  function e(n) {
    for (var a in n) r.hasOwnProperty(a) || (r[a] = n[a]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(Kt), e(ms);
  var t = G;
  r.isExceptionResponseBody = t.isExceptionResponseBody;
  var s = V;
  r.isExceptionRequestBody = s.isExceptionRequestBody;
})(Es);
var Bs = {}, Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
const ws = 0, qs = 65535, vi = qs, Ii = ws, Ci = 0, Ei = 1, mi = 128;
Zt.LIMITS = {
  COIL_MAX: Ei,
  COIL_MIN: Ci,
  ERROR_CODE_THRESHOLD: mi,
  REGISTER_MAX: vi,
  REGISTER_MIN: Ii,
  UINT16_MAX: qs,
  UINT16_MIN: ws
};
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(Zt);
})(Bs);
var Ce = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
}, xt = x && x.__importStar || function(r) {
  if (r && r.__esModule) return r;
  var e = {};
  if (r != null) for (var t in r) Object.hasOwnProperty.call(r, t) && (e[t] = r[t]);
  return e.default = r, e;
};
Object.defineProperty(y, "__esModule", { value: !0 });
const Ms = Ce(Tt);
y.ModbusTCPClient = Ms.default;
const As = Ce(Nt);
y.ModbusRTUClient = As.default;
const Ss = Ce(Jt);
y.ModbusTCPServer = Ss.default;
const Ds = Ce(Xt);
y.ModbusRTUServer = Ds.default;
const Bi = xt(g), wi = xt(Es), qi = xt(R), Mi = xt(E), Ai = Ce(be), Si = Bs;
y.client = {
  RTU: As.default,
  TCP: Ms.default
};
y.server = {
  RTU: Ds.default,
  TCP: Ss.default
};
y.requests = Object.assign({}, qi, { UserRequest: Ai.default });
y.responses = Mi;
y.codes = Bi;
y.errors = wi;
y.limits = Si.LIMITS;
var Di = Y;
y.ModbusAbstractRequest = Di.default;
var Oi = ge;
y.ModbusAbstractResponse = Oi.default;
var Ti = he;
y.MBClientRequestHandler = Ti.default;
var Ui = ye;
y.ModbusClientResponseHandler = Ui.default;
var Fi = ae;
y.ModbusClient = Fi.default;
var Pi = pe;
y.ModbusTCPRequest = Pi.default;
var Li = Re;
y.ModbusTCPResponse = Li.default;
var $i = X;
y.ModbusRTURequest = $i.default;
var ji = Ie;
y.ModbusRTUResponse = ji.default;
var Hi = L;
y.UserRequestError = Hi.UserRequestError;
var Wi = be;
y.UserRequest = Wi.default;
var Ni = Ze;
y.UserRequestMetrics = Ni.UserRequestMetrics;
const Os = H.dirname($s(import.meta.url));
process.env.APP_ROOT = H.join(Os, "..");
const Dt = process.env.VITE_DEV_SERVER_URL, iu = H.join(process.env.APP_ROOT, "dist-electron"), Ts = H.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Dt ? H.join(process.env.APP_ROOT, "public") : Ts;
let A;
function Us() {
  A = new Qr({
    icon: H.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: H.join(Os, "preload.mjs")
    },
    autoHideMenuBar: !0,
    show: !1
  }), A.maximize(), A.show(), A.webContents.on("did-finish-load", Fs), Dt ? A.loadURL(Dt) : A.loadFile(H.join(Ts, "index.html"));
}
const Gi = "192.168.0.100", ki = 502, Vi = 4106, zi = 11, Yi = 2049, Qi = 2;
let S = null, N = !1, m = null, ne = null;
function Fs() {
  N || (console.log("🔄 Attempting to initialize communication line..."), S && (clearInterval(S), S = null), m && (m.removeAllListeners(), m.destroy(), m = null, ne = null), m = new Ns.Socket(), ne = new y.client.TCP(m), m.on("connect", () => {
    console.log("🔌 Delta PLC Connection Successful! Starting telemetry polling..."), N = !1, Ji();
  }), m.on("error", (r) => {
    console.error(`❌ Network Line Drop (${r.message}). Scheduling retry...`), A && A.webContents.send("plc-status", { error: `Disconnected: ${r.message}` }), Ot();
  }), m.on("close", () => {
    !N && S && (console.log("⚠️ Network socket closed unexpectedly."), Ot());
  }), m.connect({ host: Gi, port: ki }));
}
function Ot() {
  S && (clearInterval(S), S = null), !N && (N = !0, setTimeout(() => {
    N = !1, Fs();
  }, 3e3));
}
function Ji() {
  S && clearInterval(S), S = setInterval(async () => {
    if (!(!m || !m.writable || N))
      try {
        const [r, e] = await Promise.all([
          ne.readHoldingRegisters(Vi, zi),
          ne.readCoils(Yi, Qi)
        ]), t = r.response.body.values, s = t[0], n = t[10], a = e.response.body.valuesAsArray || e.response.body.values, c = a && a.length > 0 ? a[0] : !1, d = a && a.length > 1 ? a[1] : !1;
        A && A.webContents.send("plc-live-data", {
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          d10Value: s,
          d20Value: n,
          m1Status: c,
          m2Status: d
        });
      } catch (r) {
        console.warn("⚠️ Register transaction lost. Tearing down line connection:", r.message), Ot();
      }
  }, 100);
}
Ps.handle("write-plc-coil", async (r, { address: e, value: t }) => {
  if (!m.writable) return { success: !1, error: "PLC communication line down" };
  try {
    return await ne.writeSingleCoil(e, t), { success: !0, message: `Coil ${e} set to ${t}` };
  } catch (s) {
    return { success: !1, error: s.message };
  }
});
Oe.on("window-all-closed", () => {
  process.platform !== "darwin" && (Oe.quit(), A = null);
});
Oe.on("activate", () => {
  Qr.getAllWindows().length === 0 && Us();
});
Oe.whenReady().then(() => {
  Ls.defaultSession.setPermissionRequestHandler((r, e, t) => {
    t(!1);
  }), Us();
});
export {
  iu as MAIN_DIST,
  Ts as RENDERER_DIST,
  Dt as VITE_DEV_SERVER_URL
};
