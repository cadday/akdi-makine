import { ipcMain as P, app as H, BrowserWindow as St, session as Os, shell as Ps, dialog as $s } from "electron";
import { fileURLToPath as Ls } from "node:url";
import E from "node:path";
import { mkdir as js, writeFile as Xr, readFile as Hs, rm as Ws } from "node:fs/promises";
import { randomUUID as Ns } from "node:crypto";
import Jr from "tty";
import Gs from "util";
import ks from "os";
import D from "buffer";
import zs from "events";
import "net";
const Vs = 10 * 1024 * 1024, Ys = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]), Qs = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function Kr() {
  return E.join(H.getPath("userData"), "images");
}
function xt(r) {
  if (typeof r != "string" || !Qs.test(r))
    throw new Error("Invalid image ID");
  return E.join(Kr(), r);
}
function Xs(r, e) {
  return r === "image/jpeg" ? e[0] === 255 && e[1] === 216 && e[2] === 255 : r === "image/png" ? e.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10" : r === "image/gif" ? new TextDecoder().decode(e.subarray(0, 3)) === "GIF" : r === "image/webp" ? new TextDecoder().decode(e.subarray(0, 4)) === "RIFF" && new TextDecoder().decode(e.subarray(8, 12)) === "WEBP" : r === "image/bmp" ? new TextDecoder().decode(e.subarray(0, 2)) === "BM" : !1;
}
function Js(r) {
  const e = (t) => {
    const s = r();
    if (!s || s.isDestroyed() || t !== s.webContents)
      throw new Error("Unauthorized image request");
  };
  P.handle("images:save", async (t, s) => {
    if (e(t.sender), !s || typeof s != "object") throw new Error("Invalid image upload");
    const n = s;
    if (typeof n.name != "string" || typeof n.type != "string" || !(n.bytes instanceof Uint8Array))
      throw new Error("Invalid image upload");
    const a = n.bytes, c = E.basename(n.name).slice(0, 255), d = n.type.toLowerCase();
    if (!c || !Ys.has(d) || a.byteLength === 0 || a.byteLength > Vs || !Xs(d, a))
      throw new Error("Image must be a supported raster image no larger than 10 MB");
    const f = Ns();
    return await js(Kr(), { recursive: !0 }), await Xr(xt(f), Buffer.from(a)), { id: f, name: c, type: d, size: a.byteLength };
  }), P.handle("images:read", async (t, s) => {
    e(t.sender);
    try {
      const n = await Hs(xt(s));
      return { bytes: new Uint8Array(n) };
    } catch (n) {
      if (n.code === "ENOENT") return null;
      throw n;
    }
  }), P.handle("images:delete", async (t, s) => {
    e(t.sender), await Ws(xt(s), { force: !0 });
  });
}
var x = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, R = {}, Tt = {}, ae = {}, Dt = { exports: {} }, we = { exports: {} }, lt, sr;
function Ks() {
  if (sr) return lt;
  sr = 1;
  var r = 1e3, e = r * 60, t = e * 60, s = t * 24, n = s * 7, a = s * 365.25;
  lt = function(u, i) {
    i = i || {};
    var o = typeof u;
    if (o === "string" && u.length > 0)
      return c(u);
    if (o === "number" && isFinite(u))
      return i.long ? f(u) : d(u);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(u)
    );
  };
  function c(u) {
    if (u = String(u), !(u.length > 100)) {
      var i = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        u
      );
      if (i) {
        var o = parseFloat(i[1]), l = (i[2] || "ms").toLowerCase();
        switch (l) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return o * a;
          case "weeks":
          case "week":
          case "w":
            return o * n;
          case "days":
          case "day":
          case "d":
            return o * s;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return o * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return o * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return o * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return o;
          default:
            return;
        }
      }
    }
  }
  function d(u) {
    var i = Math.abs(u);
    return i >= s ? Math.round(u / s) + "d" : i >= t ? Math.round(u / t) + "h" : i >= e ? Math.round(u / e) + "m" : i >= r ? Math.round(u / r) + "s" : u + "ms";
  }
  function f(u) {
    var i = Math.abs(u);
    return i >= s ? h(u, i, s, "day") : i >= t ? h(u, i, t, "hour") : i >= e ? h(u, i, e, "minute") : i >= r ? h(u, i, r, "second") : u + " ms";
  }
  function h(u, i, o, l) {
    var _ = i >= o * 1.5;
    return Math.round(u / o) + " " + l + (_ ? "s" : "");
  }
  return lt;
}
var _t, nr;
function Zr() {
  if (nr) return _t;
  nr = 1;
  function r(e) {
    s.debug = s, s.default = s, s.coerce = h, s.disable = d, s.enable = c, s.enabled = f, s.humanize = Ks(), Object.keys(e).forEach(function(u) {
      s[u] = e[u];
    }), s.instances = [], s.names = [], s.skips = [], s.formatters = {};
    function t(u) {
      for (var i = 0, o = 0; o < u.length; o++)
        i = (i << 5) - i + u.charCodeAt(o), i |= 0;
      return s.colors[Math.abs(i) % s.colors.length];
    }
    s.selectColor = t;
    function s(u) {
      var i;
      function o() {
        if (o.enabled) {
          for (var l = arguments.length, _ = new Array(l), p = 0; p < l; p++)
            _[p] = arguments[p];
          var b = o, m = Number(/* @__PURE__ */ new Date()), M = m - (i || m);
          b.diff = M, b.prev = i, b.curr = m, i = m, _[0] = s.coerce(_[0]), typeof _[0] != "string" && _.unshift("%O");
          var A = 0;
          _[0] = _[0].replace(/%([a-zA-Z%])/g, function(W, Ce) {
            if (W === "%%")
              return W;
            A++;
            var K = s.formatters[Ce];
            if (typeof K == "function") {
              var tr = _[A];
              W = K.call(b, tr), _.splice(A, 1), A--;
            }
            return W;
          }), s.formatArgs.call(b, _);
          var F = b.log || s.log;
          F.apply(b, _);
        }
      }
      return o.namespace = u, o.enabled = s.enabled(u), o.useColors = s.useColors(), o.color = t(u), o.destroy = n, o.extend = a, typeof s.init == "function" && s.init(o), s.instances.push(o), o;
    }
    function n() {
      var u = s.instances.indexOf(this);
      return u !== -1 ? (s.instances.splice(u, 1), !0) : !1;
    }
    function a(u, i) {
      return s(this.namespace + (typeof i > "u" ? ":" : i) + u);
    }
    function c(u) {
      s.save(u), s.names = [], s.skips = [];
      var i, o = (typeof u == "string" ? u : "").split(/[\s,]+/), l = o.length;
      for (i = 0; i < l; i++)
        o[i] && (u = o[i].replace(/\*/g, ".*?"), u[0] === "-" ? s.skips.push(new RegExp("^" + u.substr(1) + "$")) : s.names.push(new RegExp("^" + u + "$")));
      for (i = 0; i < s.instances.length; i++) {
        var _ = s.instances[i];
        _.enabled = s.enabled(_.namespace);
      }
    }
    function d() {
      s.enable("");
    }
    function f(u) {
      if (u[u.length - 1] === "*")
        return !0;
      var i, o;
      for (i = 0, o = s.skips.length; i < o; i++)
        if (s.skips[i].test(u))
          return !1;
      for (i = 0, o = s.names.length; i < o; i++)
        if (s.names[i].test(u))
          return !0;
      return !1;
    }
    function h(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    return s.enable(s.load()), s;
  }
  return _t = r, _t;
}
var ar;
function Zs() {
  return ar || (ar = 1, function(r, e) {
    function t(u) {
      return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? t = function(o) {
        return typeof o;
      } : t = function(o) {
        return o && typeof Symbol == "function" && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, t(u);
    }
    e.log = a, e.formatArgs = n, e.save = c, e.load = d, e.useColors = s, e.storage = f(), e.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function s() {
      return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? !1 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(u) {
      if (u[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + u[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !!this.useColors) {
        var i = "color: " + this.color;
        u.splice(1, 0, i, "color: inherit");
        var o = 0, l = 0;
        u[0].replace(/%[a-zA-Z%]/g, function(_) {
          _ !== "%%" && (o++, _ === "%c" && (l = o));
        }), u.splice(l, 0, i);
      }
    }
    function a() {
      var u;
      return (typeof console > "u" ? "undefined" : t(console)) === "object" && console.log && (u = console).log.apply(u, arguments);
    }
    function c(u) {
      try {
        u ? e.storage.setItem("debug", u) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function d() {
      var u;
      try {
        u = e.storage.getItem("debug");
      } catch {
      }
      return !u && typeof process < "u" && "env" in process && (u = process.env.DEBUG), u;
    }
    function f() {
      try {
        return localStorage;
      } catch {
      }
    }
    r.exports = Zr()(e);
    var h = r.exports.formatters;
    h.j = function(u) {
      try {
        return JSON.stringify(u);
      } catch (i) {
        return "[UnexpectedJSONParseError]: " + i.message;
      }
    };
  }(we, we.exports)), we.exports;
}
var Ee = { exports: {} }, ht, ir;
function en() {
  return ir || (ir = 1, ht = (r, e = process.argv) => {
    const t = r.startsWith("-") ? "" : r.length === 1 ? "-" : "--", s = e.indexOf(t + r), n = e.indexOf("--");
    return s !== -1 && (n === -1 || s < n);
  }), ht;
}
var bt, ur;
function tn() {
  if (ur) return bt;
  ur = 1;
  const r = ks, e = Jr, t = en(), { env: s } = process;
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
    const u = n || 0;
    if (s.TERM === "dumb")
      return u;
    if (process.platform === "win32") {
      const i = r.release().split(".");
      return Number(i[0]) >= 10 && Number(i[2]) >= 10586 ? Number(i[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in s)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((i) => i in s) || s.CI_NAME === "codeship" ? 1 : u;
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
    return /-256(color)?$/i.test(s.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(s.TERM) || "COLORTERM" in s ? 1 : u;
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
var or;
function rn() {
  return or || (or = 1, function(r, e) {
    var t = Jr, s = Gs;
    e.init = i, e.log = f, e.formatArgs = c, e.save = h, e.load = u, e.useColors = a, e.colors = [6, 2, 3, 4, 5, 1];
    try {
      var n = tn();
      n && (n.stderr || n).level >= 2 && (e.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter(function(l) {
      return /^debug_/i.test(l);
    }).reduce(function(l, _) {
      var p = _.substring(6).toLowerCase().replace(/_([a-z])/g, function(m, M) {
        return M.toUpperCase();
      }), b = process.env[_];
      return /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : b === "null" ? b = null : b = Number(b), l[p] = b, l;
    }, {});
    function a() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function c(l) {
      var _ = this.namespace, p = this.useColors;
      if (p) {
        var b = this.color, m = "\x1B[3" + (b < 8 ? b : "8;5;" + b), M = "  ".concat(m, ";1m").concat(_, " \x1B[0m");
        l[0] = M + l[0].split(`
`).join(`
` + M), l.push(m + "m+" + r.exports.humanize(this.diff) + "\x1B[0m");
      } else
        l[0] = d() + _ + " " + l[0];
    }
    function d() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function f() {
      return process.stderr.write(s.format.apply(s, arguments) + `
`);
    }
    function h(l) {
      l ? process.env.DEBUG = l : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function i(l) {
      l.inspectOpts = {};
      for (var _ = Object.keys(e.inspectOpts), p = 0; p < _.length; p++)
        l.inspectOpts[_[p]] = e.inspectOpts[_[p]];
    }
    r.exports = Zr()(e);
    var o = r.exports.formatters;
    o.o = function(l) {
      return this.inspectOpts.colors = this.useColors, s.inspect(l, this.inspectOpts).split(`
`).map(function(_) {
        return _.trim();
      }).join(" ");
    }, o.O = function(l) {
      return this.inspectOpts.colors = this.useColors, s.inspect(l, this.inspectOpts);
    };
  }(Ee, Ee.exports)), Ee.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Dt.exports = Zs() : Dt.exports = rn();
var I = Dt.exports, g = {}, z = {}, v = {}, es = {};
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
})(es);
var ts = {};
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
})(ts);
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(es), e(ts);
})(v);
var B = {}, sn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(B, "__esModule", { value: !0 });
const nn = sn(I);
nn.default("request-body");
class Ft {
  constructor(e) {
    if (new.target === Ft)
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
B.default = Ft;
function an(r) {
  return !!r.isModbusRequestBody;
}
B.isModbusRequestBody = an;
var un = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(z, "__esModule", { value: !0 });
const on = v, cn = un(B);
class Ne extends cn.default {
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
      return t > 43 ? null : new Ne(t, 1);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (!on.isFunctionCode(e))
      throw Error("InvalidFunctionCode");
    super(e), this._code = t;
  }
  createPayload() {
    const e = Buffer.alloc(2);
    return e.writeUInt8(this._fc, 0), e.writeUInt8(this._code, 1), e;
  }
}
z.default = Ne;
function dn(r) {
  return r instanceof Ne;
}
z.isExceptionRequestBody = dn;
var ie = {}, fn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ie, "__esModule", { value: !0 });
const cr = v, xn = fn(B);
class Ge extends xn.default {
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
      if (e.readUInt8(0) !== cr.FC.READ_COIL)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return new Ge(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(cr.FC.READ_COIL), this._start = e, this._count = t, this._start > 65535)
      throw new Error("InvalidStartAddress");
    if (this._count > 2e3)
      throw new Error("InvalidQuantity");
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._count, 3), e;
  }
}
ie.default = Ge;
function ln(r) {
  return r instanceof Ge;
}
ie.isReadCoilsRequestBody = ln;
var ue = {}, _n = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ue, "__esModule", { value: !0 });
const dr = v, hn = _n(B);
class ke extends hn.default {
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
      if (e.readUInt8(0) !== dr.FC.READ_DISCRETE_INPUT)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3);
      return new ke(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(dr.FC.READ_DISCRETE_INPUT), e > 65535)
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
ue.default = ke;
function bn(r) {
  return r instanceof ke;
}
ue.isReadDiscreteInputsRequestBody = bn;
var oe = {}, pn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(oe, "__esModule", { value: !0 });
const fr = v, yn = pn(B);
class ze extends yn.default {
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
      return t !== fr.FC.READ_HOLDING_REGISTERS ? null : new ze(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(fr.FC.READ_HOLDING_REGISTERS), e > 65535)
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
function gn(r) {
  return r instanceof ze;
}
oe.isReadHoldingRegistersRequestBody = gn;
var ce = {}, Rn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ce, "__esModule", { value: !0 });
const xr = v, vn = Rn(B);
class Ve extends vn.default {
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
      return t !== xr.FC.READ_INPUT_REGISTERS ? null : new Ve(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(xr.FC.READ_INPUT_REGISTERS), e > 65535)
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
ce.default = Ve;
function In(r) {
  return r instanceof Ve;
}
ce.isReadInputRegistersRequestBody = In;
var de = {}, fe = {}, mn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(fe, "__esModule", { value: !0 });
const lr = v, Cn = mn(B);
class Ye extends Cn.default {
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
      if (e.readUInt8(0) !== lr.FC.WRITE_MULTIPLE_COILS)
        return null;
      const s = e.readUInt16BE(1), n = e.readUInt16BE(3), a = e.readUInt8(5), c = e.slice(6, 6 + a);
      return new Ye(s, c, n);
    } catch {
      return null;
    }
  }
  constructor(e, t, s) {
    if (super(lr.FC.WRITE_MULTIPLE_COILS), e > 65535)
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
fe.default = Ye;
function wn(r) {
  return r instanceof Ye;
}
fe.isWriteMultipleCoilsRequestBody = wn;
var xe = {}, En = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(xe, "__esModule", { value: !0 });
const _r = v, Bn = En(B);
class Qe extends Bn.default {
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
      return t !== _r.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new Qe(s, a);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(_r.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), e > 65535)
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
xe.default = Qe;
function qn(r) {
  return r instanceof Qe;
}
xe.isWriteMultipleRegistersRequestBody = qn;
var le = {}, Mn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(le, "__esModule", { value: !0 });
const hr = v, An = Mn(B);
class Xe extends An.default {
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
      return t !== hr.FC.WRITE_SINGLE_COIL ? null : new Xe(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(hr.FC.WRITE_SINGLE_COIL), e > 65535)
      throw new Error("InvalidStartAddress");
    this._address = e, this._value = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value ? 65280 : 0, 3), e;
  }
}
le.default = Xe;
function Dn(r) {
  return r instanceof Xe;
}
le.isWriteSingleCoilRequestBody = Dn;
var _e = {}, Sn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(_e, "__esModule", { value: !0 });
const br = v, Tn = Sn(B);
class Je extends Tn.default {
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
      return t !== br.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new Je(s, n);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(br.FC.WRITE_SINGLE_HOLDING_REGISTER), e > 65535)
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
_e.default = Je;
function Fn(r) {
  return r instanceof Je;
}
_e.isWriteSingleRegisterRequestBody = Fn;
var S = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(de, "__esModule", { value: !0 });
const U = v, Un = S(z), On = S(ie), Pn = S(ue), $n = S(oe), Ln = S(ce), jn = S(fe), Hn = S(xe), Wn = S(le), Nn = S(_e), Gn = S(I), pt = Gn.default("request-factory");
class kn {
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0);
      if (pt("fc", t, "payload", e), U.isFunctionCode(t))
        switch (t) {
          case U.FC.READ_COIL:
            return On.default.fromBuffer(e);
          case U.FC.READ_DISCRETE_INPUT:
            return Pn.default.fromBuffer(e);
          case U.FC.READ_HOLDING_REGISTERS:
            return $n.default.fromBuffer(e);
          case U.FC.READ_INPUT_REGISTERS:
            return Ln.default.fromBuffer(e);
          case U.FC.WRITE_SINGLE_COIL:
            return Wn.default.fromBuffer(e);
          case U.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return Nn.default.fromBuffer(e);
          case U.FC.WRITE_MULTIPLE_COILS:
            return jn.default.fromBuffer(e);
          case U.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return Hn.default.fromBuffer(e);
        }
      if (t <= 43)
        return pt("Illegal Function (fc %d)", t), new Un.default(t, 1);
    } catch (t) {
      return pt("Exception while reading function code", t), null;
    }
  }
}
de.default = kn;
Object.defineProperty(g, "__esModule", { value: !0 });
var rs = z;
g.ExceptionRequestBody = rs.default;
g.isExceptionRequestBody = rs.isExceptionRequestBody;
var ss = ie;
g.ReadCoilsRequestBody = ss.default;
g.isReadCoilsRequestBody = ss.isReadCoilsRequestBody;
var ns = ue;
g.ReadDiscreteInputsRequestBody = ns.default;
g.isReadDiscreteInputsRequestBody = ns.isReadDiscreteInputsRequestBody;
var as = oe;
g.ReadHoldingRegistersRequestBody = as.default;
g.isReadHoldingRegistersRequestBody = as.isReadHoldingRegistersRequestBody;
var is = ce;
g.ReadInputRegistersRequestBody = is.default;
g.isReadInputRegistersRequestBody = is.isReadInputRegistersRequestBody;
var us = B;
g.ModbusRequestBody = us.default;
g.isModbusRequestBody = us.isModbusRequestBody;
var zn = de;
g.RequestFactory = zn.default;
var os = fe;
g.WriteMultipleCoilsRequestBody = os.default;
g.isWriteMultipleCoilsRequestBody = os.isWriteMultipleCoilsRequestBody;
var cs = xe;
g.WriteMultipleRegistersRequestBody = cs.default;
g.isWriteMultipleRegistersRequestBody = cs.isWriteMultipleRegistersRequestBody;
var ds = le;
g.WriteSingleCoilRequestBody = ds.default;
g.isWriteSingleCoilRequestBody = ds.isWriteSingleCoilRequestBody;
var fs = _e;
g.WriteSingleRegisterRequestBody = fs.default;
g.isWriteSingleRegisterRequestBody = fs.isWriteSingleRegisterRequestBody;
Object.defineProperty(ae, "__esModule", { value: !0 });
const Vn = I, C = Vn("modbus-client"), O = g;
class Ut {
  constructor(e) {
    if (new.target === Ut)
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
      s = new O.ReadCoilsRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readDiscreteInputs(e, t) {
    C("issuing new read discrete inputs request");
    let s;
    try {
      s = new O.ReadDiscreteInputsRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readHoldingRegisters(e, t) {
    C("issuing new read holding registers request");
    let s;
    try {
      s = new O.ReadHoldingRegistersRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  readInputRegisters(e, t) {
    C("issuing new read input registers request");
    let s;
    try {
      s = new O.ReadInputRegistersRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeSingleCoil(e, t) {
    C("issuing new write single coil request");
    let s;
    try {
      s = new O.WriteSingleCoilRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeSingleRegister(e, t) {
    C("issuing new write single register request");
    let s;
    try {
      s = new O.WriteSingleRegisterRequestBody(e, t);
    } catch (n) {
      return C("unknown request error occurred"), Promise.reject(n);
    }
    return this._requestHandler.register(s);
  }
  writeMultipleCoils(e, t, s = 0) {
    C("issuing new write multiple coils request");
    let n;
    try {
      t instanceof Buffer ? n = new O.WriteMultipleCoilsRequestBody(e, t, s) : n = new O.WriteMultipleCoilsRequestBody(e, t);
    } catch (a) {
      return C("unknown request error occurred"), Promise.reject(a);
    }
    return this._requestHandler.register(n);
  }
  writeMultipleRegisters(e, t) {
    C("issuing new write multiple registers request");
    let s;
    try {
      s = new O.WriteMultipleRegistersRequestBody(e, t);
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
ae.default = Ut;
var Ot = {}, he = {}, N = {}, V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
const Yn = v;
class Qn {
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
    if (t === !1 && !Yn.isFunctionCode(e))
      throw Error("InvalidFunctionCode");
    this._fc = e;
  }
}
V.default = Qn;
var Xn = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(N, "__esModule", { value: !0 });
const pr = v, Jn = Xn(V);
class se extends Jn.default {
  get code() {
    return this._code;
  }
  get message() {
    return pr.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return !0;
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0) - 128, s = e.readUInt8(1);
    if (!pr.isFunctionCode(t))
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
N.default = se;
function Kn(r) {
  return r instanceof se;
}
N.isExceptionResponseBody = Kn;
var $ = {};
Object.defineProperty($, "__esModule", { value: !0 });
class Zn {
  constructor({ err: e, message: t, response: s, request: n }) {
    this.err = e, this.message = t, this.request = n, this.response = s;
  }
}
$.UserRequestError = Zn;
function xs(r) {
  return r instanceof xs ? !0 : !(typeof r != "object" || r.err === void 0 || typeof r.err != "string" || r.message === void 0 || typeof r.message != "string");
}
$.isUserRequestError = xs;
var be = {}, Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
class e0 {
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
Ke.UserRequestMetrics = e0;
Object.defineProperty(be, "__esModule", { value: !0 });
const t0 = $, r0 = Ke, s0 = I, yr = s0("user-request");
class n0 {
  constructor(e, t = 5e3) {
    yr("creating new user request with timeout", t), this._request = e, this._timeout = t, this._metrics = new r0.UserRequestMetrics(), this._promise = new Promise((s, n) => {
      this._resolve = s, this._reject = n;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(e) {
    this._metrics.startedAt = /* @__PURE__ */ new Date(), this._timer = setTimeout(() => {
      this._reject(new t0.UserRequestError({
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
    return this._metrics.receivedAt = /* @__PURE__ */ new Date(), yr("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime), this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: e
    });
  }
  get reject() {
    return this._reject;
  }
}
be.default = n0;
var ls = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(he, "__esModule", { value: !0 });
const gr = "OutOfSync", Rr = "Offline", a0 = "ModbusException", i0 = "ManuallyCleared", u0 = I, q = u0("client-request-handler"), o0 = ls(N), G = $, c0 = ls(be);
class Pt {
  constructor(e, t) {
    if (new.target === Pt)
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
    const t = new c0.default(e, this._timeout);
    return this._requests.push(t), this._flush(), t.promise;
  }
  handle(e) {
    if (q("incoming response"), !e) {
      q("well, sorry I was wrong, no response at all");
      return;
    }
    const t = this._currentRequest;
    if (!t) {
      q("no current request, no idea where this came from");
      return;
    }
    const s = t.request;
    if (e.body.isException === !1 && e.body.fc !== s.body.fc) {
      q("something is weird, request fc and response fc do not match."), t.reject(new G.UserRequestError({
        err: gr,
        message: "request fc and response fc does not match.",
        request: s
      })), this._clearAllRequests();
      return;
    }
    if (e.body instanceof o0.default) {
      q("response is a exception"), t.reject(new G.UserRequestError({
        err: a0,
        message: "A Modbus Exception Occurred - See Response Body",
        request: s,
        response: e
      })), this._clearCurrentRequest(), this._flush();
      return;
    }
    q("resolving request"), t.resolve(e), this._clearCurrentRequest(), this._flush();
  }
  manuallyRejectCurrentRequest() {
    this._currentRequest && (this._currentRequest.reject(new G.UserRequestError({
      err: i0,
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
      e && e.reject(new G.UserRequestError({
        err: gr,
        message: "rejecting because of earlier OutOfSync error",
        request: e.request
      }));
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline", this._currentRequest && this._currentRequest.reject(new G.UserRequestError({
      err: Rr,
      message: "connection to modbus server closed",
      request: this._currentRequest.request
    })), this._clearAllRequests();
  }
  _flush() {
    if (q("flushing"), this._currentRequest !== null) {
      q("executing another request, come back later");
      return;
    }
    if (this._requests.length === 0) {
      q("no request to be executed");
      return;
    }
    if (this._currentRequest = this._requests.shift(), this._state === "offline") {
      q("rejecting request immediatly, client offline"), this._currentRequest && this._currentRequest.reject(new G.UserRequestError({
        err: Rr,
        message: "no connection to modbus server",
        request: this._currentRequest.request
      })), this._clearCurrentRequest(), setTimeout(this._flush.bind(this), 0);
      return;
    }
    const e = this._currentRequest && this._currentRequest.createPayload();
    q("flushing new request", e), this._currentRequest && this._currentRequest.start(() => {
      this._clearCurrentRequest(), this._flush();
    }), this._socket.write(e, (t) => {
      q("request fully flushed, ( error:", t, ")");
    });
  }
}
he.default = Pt;
var pe = {}, Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
class _s {
}
_s.fromBuffer = (r) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
Y.default = _s;
function d0(r) {
  return r.body !== void 0;
}
Y.isModbusRequest = d0;
var hs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(pe, "__esModule", { value: !0 });
const f0 = I, Be = f0("tcp-request"), x0 = hs(Y), l0 = hs(de);
class $t extends x0.default {
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
        return Be("no enough data in the buffer yet"), null;
      const t = e.readUInt16BE(0), s = e.readUInt16BE(2), n = e.readUInt16BE(4), a = e.readUInt8(6);
      Be("tcp header complete, id", t, "protocol", s, "length", n, "unitId", a), Be("buffer", e);
      const c = l0.default.fromBuffer(e.slice(7, 6 + n));
      return c ? new $t(t, s, n, a, c) : null;
    } catch (t) {
      return Be("not enough data to create a tcp request", t), null;
    }
  }
  createPayload() {
    const e = this._body.createPayload(), t = Buffer.alloc(7 + this._body.byteCount);
    return t.writeUInt16BE(this._id, 0), t.writeUInt16BE(0, 2), t.writeUInt16BE(this._body.byteCount + 1, 4), t.writeUInt8(this._unitId, 6), e.copy(t, 7), t;
  }
}
pe.default = $t;
var bs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Ot, "__esModule", { value: !0 });
const _0 = I, qe = _0("tcp-client-request-handler"), h0 = bs(he), b0 = bs(pe), vr = $, p0 = "OutOfSync", y0 = "Protocol";
class g0 extends h0.default {
  constructor(e, t, s = 5e3) {
    super(e, s), this._requestId = 0, this._unitId = t, this._requests = [], this._currentRequest = null, this._socket.on("connect", this._onConnect.bind(this)), this._socket.on("close", this._onClose.bind(this));
  }
  register(e) {
    this._requestId = (this._requestId + 1) % 65535, qe("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", e.byteCount);
    const t = new b0.default(this._requestId, 0, e.byteCount + 1, this._unitId, e);
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
      qe("something weird is going on, response transition id does not equal request transition id", e.id, s.id), t.reject(new vr.UserRequestError({
        err: p0,
        message: "request fc and response fc does not match.",
        request: s
      })), this._clearAllRequests();
      return;
    }
    if (e.protocol !== 0) {
      qe("server responds with wrong protocol version"), t.reject(new vr.UserRequestError({
        err: y0,
        message: "Unknown protocol version " + e.protocol,
        request: s
      })), this._clearAllRequests();
      return;
    }
    super.handle(e);
  }
}
Ot.default = g0;
var Lt = {}, ye = {};
Object.defineProperty(ye, "__esModule", { value: !0 });
class R0 {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
ye.default = R0;
var ge = {}, Re = {};
Object.defineProperty(Re, "__esModule", { value: !0 });
class v0 {
  get body() {
    return this._body;
  }
  static fromRequest(e, t) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
Re.default = v0;
var ve = {}, Ze = {};
const I0 = I, Ir = I0("buffer-utils");
class m0 {
  static bufferShift(e, t, s) {
    e = e - 1;
    const n = e % 8, a = Math.floor(e / 8), d = Math.floor(t / 8) - a + 1, f = Buffer.allocUnsafe(d);
    f[0] = s[0] << n, Ir("buffer[0] = %s ( %s << %d )", f[0].toString(2), s[0].toString(2), n);
    const h = Buffer.concat([s, Buffer.alloc(1)], s.length + 1);
    for (let u = 1; u < d; u++)
      f[u] = (h[u] << n) + (h[u - 1] >> 8 - n), Ir("buffer[%d] = %s ( %s << %d + %s >> %d)", u, f[u].toString(2), h[u].toString(2), n, h[u - 1].toString(2), 8 - e);
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
var jt = m0, Q = {}, C0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Q, "__esModule", { value: !0 });
const w0 = C0(V);
class E0 extends w0.default {
  constructor(e) {
    super(e);
  }
  get fc() {
    return this._fc;
  }
}
Q.default = E0;
var ps = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Ze, "__esModule", { value: !0 });
const B0 = I, q0 = B0("read-coils-response"), M0 = ps(jt), mr = v, A0 = ps(Q), { bufferToArrayStatus: Cr, arrayStatusToBuffer: D0 } = M0.default;
class Te extends A0.default {
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
      return n.length !== s || t !== mr.FC.READ_COIL ? null : new Te(n, s);
    } catch {
      return q0("no valid read coils response body in the buffer yet"), null;
    }
  }
  constructor(e, t) {
    if (super(mr.FC.READ_COIL), this._coils = e, this._numberOfBytes = t, e instanceof Array)
      this._valuesAsArray = e, this._valuesAsBuffer = D0(e);
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
Ze.default = Te;
var et = {}, ys = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(et, "__esModule", { value: !0 });
const S0 = ys(jt), wr = v, T0 = ys(Q), { bufferToArrayStatus: Er, arrayStatusToBuffer: F0 } = S0.default;
class Fe extends T0.default {
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
    const s = Er(t), n = e.start, a = n + e.count, c = s.slice(n, a);
    return new Fe(c, Math.ceil(c.length / 8));
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
      return n.length !== s || t !== wr.FC.READ_DISCRETE_INPUT ? null : new Fe(n, s);
    } catch {
      return null;
    }
  }
  constructor(e, t) {
    if (super(wr.FC.READ_DISCRETE_INPUT), this._discrete = e, this._numberOfBytes = t, e instanceof Array)
      this._valuesAsArray = e, this._valuesAsBuffer = F0(e);
    else if (e instanceof Buffer)
      this._valuesAsBuffer = e, this._valuesAsArray = Er(e);
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(e, 2), e;
  }
}
et.default = Fe;
var tt = {}, U0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(tt, "__esModule", { value: !0 });
const O0 = I, P0 = O0("ReadHoldingRegistersResponseBody"), Br = v, $0 = U0(Q);
class Ue extends $0.default {
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
    return new Ue(a.length, a);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
    if (t !== Br.FC.READ_HOLDING_REGISTERS)
      return null;
    const a = [];
    for (let c = 0; c < s; c += 2)
      a.push(n.readUInt16BE(c));
    return new Ue(s, a, n);
  }
  constructor(e, t, s) {
    if (super(Br.FC.READ_HOLDING_REGISTERS), this._byteCount = e, this._values = t, this._bufferLength = 2, P0("ReadHoldingRegistersResponseBody values", t), t instanceof Array)
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
tt.default = Ue;
var rt = {}, L0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(rt, "__esModule", { value: !0 });
const qr = v, j0 = L0(Q);
class Oe extends j0.default {
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
    return new Oe(a.length, a);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt8(1), n = e.slice(2, 2 + s);
    if (t !== qr.FC.READ_INPUT_REGISTERS)
      return null;
    const a = [];
    for (let c = 0; c < s; c += 2)
      a.push(n.readUInt16BE(c));
    return new Oe(s, a, n);
  }
  constructor(e, t, s) {
    if (super(qr.FC.READ_INPUT_REGISTERS), this._byteCount = e, this._values = t, this._bufferLength = 2, t instanceof Array)
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
rt.default = Oe;
var st = {}, X = {}, H0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(X, "__esModule", { value: !0 });
const W0 = H0(V);
class N0 extends W0.default {
}
X.default = N0;
var G0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(st, "__esModule", { value: !0 });
const Mr = v, k0 = G0(X);
class Pe extends k0.default {
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
    return new Pe(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
    return t !== Mr.FC.WRITE_MULTIPLE_COILS ? null : new Pe(s, n);
  }
  constructor(e, t) {
    super(Mr.FC.WRITE_MULTIPLE_COILS), this._start = e, this._quantity = t;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._quantity, 3), e;
  }
}
st.default = Pe;
var nt = {}, z0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(nt, "__esModule", { value: !0 });
const Ar = v, V0 = z0(X);
class $e extends V0.default {
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
    return t !== Ar.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new $e(s, n);
  }
  constructor(e, t) {
    super(Ar.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), this._start = e, this._quantity = t;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._start, 1), e.writeUInt16BE(this._quantity, 3), e;
  }
}
nt.default = $e;
var at = {}, Y0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(at, "__esModule", { value: !0 });
const Dr = v, Q0 = Y0(X);
class Le extends Q0.default {
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
    return new Le(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3) === 65280;
    return t !== Dr.FC.WRITE_SINGLE_COIL ? null : new Le(s, n);
  }
  constructor(e, t) {
    super(Dr.FC.WRITE_SINGLE_COIL), this._address = e, this._value = t === 65280 ? 65280 : 0;
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value, 3), e;
  }
}
at.default = Le;
var it = {}, X0 = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(it, "__esModule", { value: !0 });
const Sr = v, J0 = X0(X);
class je extends J0.default {
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
    return new je(t, s);
  }
  static fromBuffer(e) {
    const t = e.readUInt8(0), s = e.readUInt16BE(1), n = e.readUInt16BE(3);
    return t !== Sr.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new je(s, n);
  }
  constructor(e, t) {
    super(Sr.FC.WRITE_SINGLE_HOLDING_REGISTER), this._address = e, this._value = t;
  }
  createPayload() {
    const e = Buffer.alloc(5);
    return e.writeUInt8(this._fc, 0), e.writeUInt16BE(this._address, 1), e.writeUInt16BE(this._value, 3), e;
  }
}
it.default = je;
var L = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ve, "__esModule", { value: !0 });
const K0 = I, yt = K0("response-factory"), j = v, Z0 = L(N), ea = L(Ze), ta = L(et), ra = L(tt), sa = L(rt), na = L(st), aa = L(nt), ia = L(at), ua = L(it);
class oa {
  static fromBuffer(e) {
    try {
      const t = e.readUInt8(0);
      return yt("fc", t, "payload", e), t > 128 ? Z0.default.fromBuffer(e) : t === j.FC.READ_COIL ? ea.default.fromBuffer(e) : t === j.FC.READ_DISCRETE_INPUT ? ta.default.fromBuffer(e) : t === j.FC.READ_HOLDING_REGISTERS ? ra.default.fromBuffer(e) : t === j.FC.READ_INPUT_REGISTERS ? sa.default.fromBuffer(e) : t === j.FC.WRITE_SINGLE_COIL ? ia.default.fromBuffer(e) : t === j.FC.WRITE_SINGLE_HOLDING_REGISTER ? ua.default.fromBuffer(e) : t === j.FC.WRITE_MULTIPLE_COILS ? na.default.fromBuffer(e) : t === j.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? aa.default.fromBuffer(e) : null;
    } catch (t) {
      return yt("when NoSuchIndex Exception, the buffer does not contain a complete message"), yt(t), null;
    }
  }
}
ve.default = oa;
var gs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ge, "__esModule", { value: !0 });
const ca = I, Z = ca("tcp-response"), da = gs(Re), fa = gs(ve);
class He extends da.default {
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
    return new He(e.id, e.protocol, t.byteCount + 1, e.unitId, t);
  }
  static fromBuffer(e) {
    try {
      const t = e.readUInt16BE(0), s = e.readUInt16BE(2), n = e.readUInt16BE(4), a = e.readUInt8(6);
      Z("tcp header complete, id", t, "protocol", s, "length", n, "unitId", a), Z("buffer", e);
      const c = fa.default.fromBuffer(e.slice(7, 7 + n - 1));
      return c ? (Z("buffer contains a valid response body"), new He(t, s, n, a, c)) : (Z("not enough data for a response body"), null);
    } catch {
      return Z("not enough data available"), null;
    }
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt16BE(this._id, 0), e.writeUInt16BE(this._protocol, 2), e.writeUInt16BE(this._bodyLength, 4), e.writeUInt8(this._unitId, 6), this._body.createPayload().copy(e, 7), e;
  }
}
ge.default = He;
var Rs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Lt, "__esModule", { value: !0 });
const xa = I, ee = xa("tcp-response-handler"), la = Rs(ye), _a = Rs(ge);
class ha extends la.default {
  constructor() {
    super(), this._buffer = Buffer.alloc(0), this._messages = [];
  }
  handleData(e) {
    ee("receiving new data", e), this._buffer = Buffer.concat([this._buffer, e]), ee("buffer", this._buffer);
    do {
      const t = _a.default.fromBuffer(this._buffer);
      if (!t) {
        ee("not enough data available to parse");
        return;
      }
      ee("response id", t.id, "protocol", t.protocol, "length", t.bodyLength, "unit", t.unitId), ee("reset buffer from", this._buffer.length, "to", this._buffer.length - t.byteCount), this._messages.push(t), this._buffer = this._buffer.slice(t.byteCount);
    } while (!0);
  }
}
Lt.default = ha;
var Ht = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Tt, "__esModule", { value: !0 });
const ba = Ht(ae), pa = Ht(Ot), ya = Ht(Lt);
class ga extends ba.default {
  constructor(e, t = 1, s = 5e3) {
    super(e), this._requestHandler = new pa.default(e, t, s), this._responseHandler = new ya.default(), this._unitId = t, this._timeout = s;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
Tt.default = ga;
var Wt = {}, Nt = {}, Me = {}, Tr;
function T() {
  return Tr || (Tr = 1, Object.defineProperty(Me, "__esModule", {
    value: !0
  }), Me.default = function(r, e) {
    var t = function(n, a) {
      return e(n, a) >>> 0;
    };
    return t.signed = e, t.unsigned = t, t.model = r, t;
  }), Me;
}
var gt, Fr;
function Ra() {
  if (Fr) return gt;
  Fr = 1;
  var r = D, e = T(), t = s(e);
  function s(n) {
    return n && n.__esModule ? n : { default: n };
  }
  return gt = (0, t.default)("crc1", function(n, a) {
    r.Buffer.isBuffer(n) || (n = (0, r.Buffer)(n));
    for (var c = ~~a, d = 0, f = 0; f < n.length; f++) {
      var h = n[f];
      d += h;
    }
    return c += d % 256, c % 256;
  }), gt;
}
var Rt, Ur;
function va() {
  if (Ur) return Rt;
  Ur = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Rt = (0, t.default)("crc-8", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = ~~c, f = 0; f < a.length; f++) {
      var h = a[f];
      d = n[(d ^ h) & 255] & 255;
    }
    return d;
  }), Rt;
}
var vt, Or;
function Ia() {
  if (Or) return vt;
  Or = 1;
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
var It, Pr;
function ma() {
  if (Pr) return It;
  Pr = 1;
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
var mt, $r;
function Ca() {
  if ($r) return mt;
  $r = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), mt = (0, t.default)("ccitt", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 65535, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d >> 8 ^ h) & 255] ^ d << 8) & 65535;
    }
    return d;
  }), mt;
}
var Ct, Lr;
function wa() {
  if (Lr) return Ct;
  Lr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Ct = (0, t.default)("crc-16-modbus", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 65535, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d ^ h) & 255] ^ d >> 8) & 65535;
    }
    return d;
  }), Ct;
}
var wt, jr;
function Ea() {
  if (jr) return wt;
  jr = 1;
  var r = D, e = T(), t = s(e);
  function s(n) {
    return n && n.__esModule ? n : { default: n };
  }
  return wt = (0, t.default)("xmodem", function(n, a) {
    r.Buffer.isBuffer(n) || (n = (0, r.Buffer)(n));
    for (var c = typeof a < "u" ? ~~a : 0, d = 0; d < n.length; d++) {
      var f = n[d], h = c >>> 8 & 255;
      h ^= f & 255, h ^= h >>> 4, c = c << 8 & 65535, c ^= h, h = h << 5 & 65535, c ^= h, h = h << 7 & 65535, c ^= h;
    }
    return c;
  }), wt;
}
var Et, Hr;
function Ba() {
  if (Hr) return Et;
  Hr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Et = (0, t.default)("kermit", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 0, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d ^ h) & 255] ^ d >> 8) & 65535;
    }
    return d;
  }), Et;
}
var Bt, Wr;
function qa() {
  if (Wr) return Bt;
  Wr = 1;
  var r = D, e = T(), t = s(e);
  function s(a) {
    return a && a.__esModule ? a : { default: a };
  }
  var n = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  return typeof Int32Array < "u" && (n = new Int32Array(n)), Bt = (0, t.default)("crc-24", function(a, c) {
    r.Buffer.isBuffer(a) || (a = (0, r.Buffer)(a));
    for (var d = typeof c < "u" ? ~~c : 11994318, f = 0; f < a.length; f++) {
      var h = a[f];
      d = (n[(d >> 16 ^ h) & 255] ^ d << 8) & 16777215;
    }
    return d;
  }), Bt;
}
var qt, Nr;
function Ma() {
  if (Nr) return qt;
  Nr = 1;
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
var Mt, Gr;
function Gt() {
  return Gr || (Gr = 1, Mt = {
    crc1: Ra(),
    crc8: va(),
    crc81wire: Ia(),
    crc16: ma(),
    crc16ccitt: Ca(),
    crc16modbus: wa(),
    crc16xmodem: Ea(),
    crc16kermit: Ba(),
    crc24: qa(),
    crc32: Ma()
  }), Mt;
}
var J = {}, vs = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(J, "__esModule", { value: !0 });
const Aa = I, Ae = Aa("rtu-request"), kr = Gt(), Da = vs(Y), Sa = vs(de);
class kt extends Da.default {
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
      const s = Sa.default.fromBuffer(e.slice(1));
      if (!s)
        return null;
      const n = 1 + s.byteCount, a = kr.crc16modbus(e.slice(0, n)), c = e.readUInt16LE(n), d = a !== c;
      return new kt(t, s, d);
    } catch (t) {
      return Ae("not enough data to create a rtu request", t), null;
    }
  }
  createPayload() {
    const e = this._body.createPayload();
    this._crc = kr.crc16modbus(Buffer.concat([Buffer.from([this._address]), e]));
    const t = Buffer.alloc(2);
    t.writeUInt16LE(this._crc, 0);
    const s = Buffer.from([this._address]);
    return Buffer.concat([s, e, t]);
  }
}
J.default = kt;
var zt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Nt, "__esModule", { value: !0 });
const Ta = I, te = Ta("rtu-client-request-handler"), Fa = zt(Gt()), Ua = zt(he), Oa = zt(J), Pa = $;
class $a extends Ua.default {
  constructor(e, t, s = 5e3) {
    super(e, s), this._address = t, this._requests = [], this._currentRequest = null, this._socket.on("open", this._onConnect.bind(this)), this._socket.isOpen && this._onConnect();
  }
  register(e) {
    te("registrating new request");
    const t = new Oa.default(this._address, e);
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
    const n = Fa.default.crc16modbus(s);
    if (e.crc !== n) {
      te("CRC does not match", e.crc, "!==", n), t.reject(new Pa.UserRequestError({
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
Nt.default = $a;
var Vt = {}, Ie = {}, Is = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Ie, "__esModule", { value: !0 });
const La = I, zr = La("rtu-response"), ja = Gt(), Ha = Is(Re), Wa = Is(ve);
class We extends Ha.default {
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
    return new We(e.address, void 0, t);
  }
  static fromBuffer(e) {
    if (e.length < 1)
      return null;
    const t = e.readUInt8(0);
    zr("address", t, "buffer", e);
    const s = Wa.default.fromBuffer(e.slice(1));
    if (!s)
      return null;
    let n;
    try {
      n = e.readUInt16LE(1 + s.byteCount);
    } catch {
      return zr("If NoSuchIndexException, it is probably serial and not all data has arrived"), null;
    }
    return new We(t, n, s);
  }
  createPayload() {
    const e = Buffer.alloc(this.byteCount);
    return e.writeUInt8(this._address, 0), this._body.createPayload().copy(e, 1), this._crc = ja.crc16modbus(e.slice(0, this.byteCount - 2)), e.writeUInt16LE(this._crc, this.byteCount - 2), e;
  }
}
Ie.default = We;
var ms = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Vt, "__esModule", { value: !0 });
const Na = I, re = Na("rtu-response-handler"), Ga = ms(ye), ka = ms(Ie);
class za extends Ga.default {
  constructor() {
    super(), this._messages = [];
  }
  handleData(e) {
    re("receiving new data"), this._buffer = Buffer.concat([this._buffer, e]), re("buffer", this._buffer);
    do {
      const t = ka.default.fromBuffer(this._buffer);
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
Vt.default = za;
var Yt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Wt, "__esModule", { value: !0 });
const Va = Yt(ae), Ya = Yt(Nt), Qa = Yt(Vt);
class Xa extends Va.default {
  constructor(e, t, s = 5e3) {
    super(e), this._requestHandler = new Ya.default(e, t, s), this._responseHandler = new Qa.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
Wt.default = Xa;
var Qt = {}, ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const Ja = zs, Vr = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class Ka extends Ja.EventEmitter {
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
ut.default = Ka;
var ot = {}, De = {}, Yr;
function Za() {
  if (Yr) return De;
  Yr = 1;
  var r = x && x.__importDefault || function(a) {
    return a && a.__esModule ? a : { default: a };
  };
  Object.defineProperty(De, "__esModule", { value: !0 });
  const e = r(J), s = I("modbus-server-request-handler");
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
  return De.default = n, De;
}
var Se = {}, w = {};
Object.defineProperty(w, "__esModule", { value: !0 });
var Cs = N;
w.ExceptionResponseBody = Cs.default;
w.isExceptionResponseBody = Cs.isExceptionResponseBody;
var ei = Ze;
w.ReadCoilsResponseBody = ei.default;
var ti = et;
w.ReadDiscreteInputsResponseBody = ti.default;
var ri = tt;
w.ReadHoldingRegistersResponseBody = ri.default;
var si = rt;
w.ReadInputRegistersResponseBody = si.default;
var ni = V;
w.ModbusResponseBody = ni.default;
var ai = ve;
w.ResponseFactory = ai.default;
var ii = st;
w.WriteMultipleCoilsResponseBody = ii.default;
var ui = nt;
w.WriteMultipleRegistersResponseBody = ui.default;
var oi = at;
w.WriteSingleCoilResponseBody = oi.default;
var ci = it;
w.WriteSingleRegisterResponseBody = ci.default;
var Qr;
function di() {
  if (Qr) return Se;
  Qr = 1;
  var r = x && x.__importDefault || function(u) {
    return u && u.__esModule ? u : { default: u };
  };
  Object.defineProperty(Se, "__esModule", { value: !0 });
  const e = w, t = g, s = r(jt), n = v, { bufferToArrayStatus: a, arrayStatusToBuffer: c } = s.default, f = I("modbus tcp response handler");
  class h {
    constructor(i, o) {
      this._server = i, this._fromRequest = o;
    }
    handle(i, o) {
      if (!i)
        return null;
      if (t.isExceptionRequestBody(i.body)) {
        const _ = e.ExceptionResponseBody.fromRequest(i.body), p = this._fromRequest(i, _);
        return o(p.createPayload()), p;
      }
      const l = i.body.fc;
      if (n.isFunctionCode(l))
        switch (l) {
          case n.FC.READ_COIL:
            return this._handleReadCoil(i, o);
          case n.FC.READ_DISCRETE_INPUT:
            return this._handleDiscreteInput(i, o);
          case n.FC.READ_HOLDING_REGISTERS:
            return this._handleReadHoldingRegisters(i, o);
          case n.FC.READ_INPUT_REGISTERS:
            return this._handleReadInputRegisters(i, o);
          case n.FC.WRITE_SINGLE_COIL:
            return this._handleWriteSingleCoil(i, o);
          case n.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return this._handleWriteSingleHoldingRegister(i, o);
          case n.FC.WRITE_MULTIPLE_COILS:
            return this._handleWriteMultipleCoils(i, o);
          case n.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return this._handleWriteMultipleHoldingRegisters(i, o);
        }
    }
    _handleReadCoil(i, o) {
      if (!t.isReadCoilsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadCoilsRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying readCoils handler"), this._server.emit("readCoils", i, o);
        return;
      }
      this._server.emit("preReadCoils", i, o);
      const l = e.ReadCoilsResponseBody.fromRequest(i.body, this._server.coils), _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postReadCoils", i, o), _;
    }
    _handleDiscreteInput(i, o) {
      if (!t.isReadDiscreteInputsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${i.body.name}`);
      if (!this._server.discrete) {
        f("no discrete input buffer on server, trying readDiscreteInputs handler"), this._server.emit("readDiscreteInputs", i, o);
        return;
      }
      this._server.emit("preReadDiscreteInputs", i, o);
      const l = e.ReadDiscreteInputsResponseBody.fromRequest(i.body, this._server.discrete), _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postReadDiscreteInputs", i, o), _;
    }
    _handleReadHoldingRegisters(i, o) {
      if (!t.isReadHoldingRegistersRequestBody(i.body)) {
        const b = `InvalidRequestClass - Expected ReadHoldingRegistersRequestBody but received ${i.body.name}`;
        throw new Error(b);
      }
      if (!this._server.holding) {
        f("no holding register buffer on server, trying readHoldingRegisters handler"), this._server.emit("readHoldingRegisters", i, o);
        return;
      }
      this._server.emit("preReadHoldingRegisters", i, o);
      const l = e.ReadHoldingRegistersResponseBody.fromRequest(i.body, this._server.holding), _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postReadHoldingRegisters", i, o), _;
    }
    _handleReadInputRegisters(i, o) {
      if (!t.isReadInputRegistersRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${i.body.name}`);
      if (!this._server.input) {
        f("no input register buffer on server, trying readInputRegisters handler"), this._server.emit("readInputRegisters", i, o);
        return;
      }
      this._server.emit("preReadInputRegisters", i, o);
      const l = e.ReadInputRegistersResponseBody.fromRequest(i.body, this._server.input), _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postReadInputRegisters", i, o), _;
    }
    _handleWriteSingleCoil(i, o) {
      if (!t.isWriteSingleCoilRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying writeSingleCoil handler"), this._server.emit("writeSingleCoil", i, o);
        return;
      }
      this._server.emit("preWriteSingleCoil", i, o);
      const l = e.WriteSingleCoilResponseBody.fromRequest(i.body), _ = i.body.address;
      f("Writing value %d to address %d", i.body.value, _);
      const p = this._server.coils.readUInt8(Math.floor(_ / 8));
      let b;
      if (i.body.value !== 65280 && i.body.value !== 0) {
        f("illegal data value");
        const A = new e.ExceptionResponseBody(i.body.fc, 3), F = this._fromRequest(i, A);
        return o(F.createPayload()), F;
      }
      if (i.body.value === 65280 ? b = p | Math.pow(2, _ % 8) : b = p & ~Math.pow(2, _ % 8), l.address / 8 > this._server.coils.length) {
        f("illegal data address");
        const A = new e.ExceptionResponseBody(i.body.fc, 2), F = this._fromRequest(i, A);
        return o(F.createPayload()), F;
      } else
        this._server.coils.writeUInt8(b, Math.floor(_ / 8));
      const m = this._fromRequest(i, l), M = m.createPayload();
      return o(M), this._server.emit("postWriteSingleCoil", i, o), m;
    }
    _handleWriteSingleHoldingRegister(i, o) {
      if (!t.isWriteSingleRegisterRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleRegisterRequestBody but received ${i.body.name}`);
      if (!this._server.holding) {
        f("no register buffer on server, trying writeSingleRegister handler"), this._server.emit("writeSingleRegister", i, o);
        return;
      }
      this._server.emit("preWriteSingleRegister", i, o);
      const l = e.WriteSingleRegisterResponseBody.fromRequest(i.body);
      if (l.address * 2 > this._server.holding.length) {
        f("illegal data address");
        const b = new e.ExceptionResponseBody(i.body.fc, 2), m = this._fromRequest(i, b);
        return o(m.createPayload()), m;
      } else
        this._server.holding.writeUInt16BE(l.value, l.address * 2);
      const _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postWriteSingleRegister", i, o), _;
    }
    _handleWriteMultipleCoils(i, o) {
      if (!t.isWriteMultipleCoilsRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${i.body.name}`);
      if (!this._server.coils) {
        f("no coils buffer on server, trying writeMultipleCoils handler"), this._server.emit("writeMultipleCoils", i, o);
        return;
      }
      this._server.emit("preWriteMultipleCoils", i, o);
      const l = e.WriteMultipleCoilsResponseBody.fromRequest(i.body), _ = a(this._server.coils), p = a(i.body.valuesAsBuffer), b = i.body.address, m = b + i.body.quantity, M = _.map((W, Ce) => {
        let K = W;
        if (Ce >= b && Ce < m) {
          const rr = p.shift();
          K = rr !== void 0 ? rr : W;
        }
        return K;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, _), this._server.coils.fill(c(M)), this._server.emit("postWriteMultipleCoils", this._server.coils, M);
      const A = this._fromRequest(i, l), F = A.createPayload();
      return o(F), this._server.emit("postWriteMultipleCoils", i, o), A;
    }
    _handleWriteMultipleHoldingRegisters(i, o) {
      if (!t.isWriteMultipleRegistersRequestBody(i.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleRegistersRequestBody but received ${i.body.name}`);
      if (!this._server.holding) {
        f("no register buffer on server, trying writeMultipleRegisters handler"), this._server.emit("writeMultipleRegisters", i, o);
        return;
      }
      this._server.emit("preWriteMultipleRegisters", i, o);
      const l = e.WriteMultipleRegistersResponseBody.fromRequest(i.body);
      if (i.body.address * 2 + i.body.values.length > this._server.holding.length) {
        f("illegal data address");
        const b = new e.ExceptionResponseBody(i.body.fc, 2), m = this._fromRequest(i, b);
        return o(m.createPayload()), m;
      } else
        this._server.emit("writeMultipleRegisters", this._server.holding), f("Request Body: ", i.body), this._server.holding.fill(new Uint8Array(i.body.values), i.body.address * 2, i.body.address * 2 + i.body.values.length), this._server.emit("postWriteMultipleRegisters", this._server.holding);
      const _ = this._fromRequest(i, l), p = _.createPayload();
      return o(p), this._server.emit("postWriteMultipleRegisters", i, o), _;
    }
  }
  return Se.default = h, Se;
}
var ws = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(ot, "__esModule", { value: !0 });
const fi = I, At = fi("modbus tcp client socket"), xi = ws(Za()), li = ws(di());
class _i {
  constructor(e, t, s, n) {
    this._server = e, this._socket = t, this._requestHandler = new xi.default(s), this._responseHandler = new li.default(this._server, n), this._socket.on("data", this._onData.bind(this));
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
ot.default = _i;
var ct = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Qt, "__esModule", { value: !0 });
const hi = I, bi = hi("modbus tcp server"), pi = ct(ut), yi = ct(ot), gi = ct(pe), Ri = ct(ge);
class vi extends pi.default {
  constructor(e, t) {
    super(t), this._server = e, e.on("connection", this._onConnection.bind(this));
  }
  _onConnection(e) {
    bi("new connection coming in");
    const t = gi.default.fromBuffer, s = Ri.default.fromRequest, n = new yi.default(this, e, t, s);
    this.emit("connection", n);
  }
}
Qt.default = vi;
var Xt = {}, dt = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(Xt, "__esModule", { value: !0 });
const Ii = dt(ot), mi = dt(ut), Ci = dt(J), wi = dt(Ie);
class Ei extends mi.default {
  constructor(e, t) {
    super(t), this._socket = e;
    const s = Ci.default.fromBuffer, n = wi.default.fromRequest, a = new Ii.default(this, e, s, n);
    this.emit("connection", a);
  }
}
Xt.default = Ei;
var Es = {}, Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
const Bi = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function qi(r) {
  return typeof r != "object" ? !1 : !!Bi.includes(r.message);
}
Jt.isInternalException = qi;
var Bs = {};
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e($);
})(Bs);
(function(r) {
  function e(n) {
    for (var a in n) r.hasOwnProperty(a) || (r[a] = n[a]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(Jt), e(Bs);
  var t = N;
  r.isExceptionResponseBody = t.isExceptionResponseBody;
  var s = z;
  r.isExceptionRequestBody = s.isExceptionRequestBody;
})(Es);
var qs = {}, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
const Ms = 0, As = 65535, Mi = As, Ai = Ms, Di = 0, Si = 1, Ti = 128;
Kt.LIMITS = {
  COIL_MAX: Si,
  COIL_MIN: Di,
  ERROR_CODE_THRESHOLD: Ti,
  REGISTER_MAX: Mi,
  REGISTER_MIN: Ai,
  UINT16_MAX: As,
  UINT16_MIN: Ms
};
(function(r) {
  function e(t) {
    for (var s in t) r.hasOwnProperty(s) || (r[s] = t[s]);
  }
  Object.defineProperty(r, "__esModule", { value: !0 }), e(Kt);
})(qs);
var me = x && x.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
}, ft = x && x.__importStar || function(r) {
  if (r && r.__esModule) return r;
  var e = {};
  if (r != null) for (var t in r) Object.hasOwnProperty.call(r, t) && (e[t] = r[t]);
  return e.default = r, e;
};
Object.defineProperty(R, "__esModule", { value: !0 });
const Ds = me(Tt);
R.ModbusTCPClient = Ds.default;
const Ss = me(Wt);
R.ModbusRTUClient = Ss.default;
const Ts = me(Qt);
R.ModbusTCPServer = Ts.default;
const Fs = me(Xt);
R.ModbusRTUServer = Fs.default;
const Fi = ft(v), Ui = ft(Es), Oi = ft(g), Pi = ft(w), $i = me(be), Li = qs;
R.client = {
  RTU: Ss.default,
  TCP: Ds.default
};
R.server = {
  RTU: Fs.default,
  TCP: Ts.default
};
R.requests = Object.assign({}, Oi, { UserRequest: $i.default });
R.responses = Pi;
R.codes = Fi;
R.errors = Ui;
R.limits = Li.LIMITS;
var ji = Y;
R.ModbusAbstractRequest = ji.default;
var Hi = Re;
R.ModbusAbstractResponse = Hi.default;
var Wi = he;
R.MBClientRequestHandler = Wi.default;
var Ni = ye;
R.ModbusClientResponseHandler = Ni.default;
var Gi = ae;
R.ModbusClient = Gi.default;
var ki = pe;
R.ModbusTCPRequest = ki.default;
var zi = ge;
R.ModbusTCPResponse = zi.default;
var Vi = J;
R.ModbusRTURequest = Vi.default;
var Yi = Ie;
R.ModbusRTUResponse = Yi.default;
var Qi = $;
R.UserRequestError = Qi.UserRequestError;
var Xi = be;
R.UserRequest = Xi.default;
var Ji = Ke;
R.UserRequestMetrics = Ji.UserRequestMetrics;
const Zt = E.dirname(Ls(import.meta.url));
process.env.APP_ROOT = E.join(Zt, "..");
const ne = process.env.VITE_DEV_SERVER_URL, cu = E.join(process.env.APP_ROOT, "dist-electron"), er = E.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ne ? E.join(process.env.APP_ROOT, "public") : er;
let y;
Js(() => y);
const k = /* @__PURE__ */ new Map();
P.handle("pdf:ready", (r, e) => {
  const t = k.get(r.sender.id);
  if (!t) throw new Error("Unexpected PDF ready signal");
  return clearTimeout(t.timeout), k.delete(r.sender.id), typeof e == "string" && e ? t.reject(new Error(e)) : t.resolve(), !0;
});
P.handle("window:minimize", () => {
  y == null || y.minimize();
});
P.handle("window:maximize", () => {
  if (y) {
    if (y.isMaximized()) {
      y.restore();
      return;
    }
    y.maximize();
  }
});
P.handle("window:close", () => {
  y == null || y.close();
});
P.handle("window:is-maximized", () => !!y && y.isMaximized());
P.handle("pdf:save-record", async (r, e) => {
  if (!y || y.isDestroyed() || r.sender !== y.webContents)
    throw new Error("Unauthorized PDF request");
  if (!e || typeof e != "object") throw new Error("Invalid PDF request");
  const t = e, s = /* @__PURE__ */ new Set(["test", "specimen", "preset", "data-field"]);
  let n, a;
  if (t.type === "test-comparison") {
    const l = e, _ = l.testIds;
    if (typeof l.name != "string" || !Array.isArray(_) || _.length < 2 || !_.every((b) => typeof b == "string" && b.trim().length > 0))
      throw new Error("Invalid PDF comparison request");
    n = l.name;
    const p = new URLSearchParams();
    _.forEach((b) => p.append("testId", b)), a = `/print/test-comparison?${p.toString()}`;
  } else {
    const l = e;
    if (!l.type || !s.has(l.type) || typeof l.id != "string" || !l.id || typeof l.name != "string")
      throw new Error("Invalid PDF request");
    n = l.name, a = `/print/${l.type}/${encodeURIComponent(l.id)}`;
  }
  const c = Array.from(n.replace(/[<>:"/\\|?*]/g, "_"), (l) => l.charCodeAt(0) < 32 ? "_" : l).join("").trim().replace(/[. ]+$/, "") || "Test", d = y, { canceled: f, filePath: h } = await $s.showSaveDialog(y, {
    title: t.type === "test-comparison" ? "Save Test Comparison as PDF" : "Save Record as PDF",
    defaultPath: E.join(H.getPath("documents"), `${c}.pdf`),
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });
  if (f || !h) return { canceled: !0 };
  if (d.isDestroyed()) throw new Error("The main window was closed before PDF export completed");
  const u = new St({
    parent: d,
    width: 750,
    minWidth: 750,
    maxWidth: 750,
    height: 900,
    show: !1,
    autoHideMenuBar: !0,
    webPreferences: {
      preload: E.join(Zt, "preload.mjs"),
      devTools: !H.isPackaged,
      backgroundThrottling: !1
    }
  }), i = u.webContents.id, o = new Promise((l, _) => {
    const p = setTimeout(() => {
      k.delete(i), _(new Error("Timed out waiting for the PDF report to render"));
    }, 3e4);
    k.set(i, { resolve: l, reject: _, timeout: p });
  });
  try {
    const l = ne ? u.loadURL(`${ne.replace(/\/$/, "")}/#${a}`) : u.loadFile(E.join(er, "index.html"), { hash: a });
    await Promise.all([l, o]);
    const _ = await u.webContents.printToPDF({
      pageSize: "A4",
      printBackground: !0,
      displayHeaderFooter: !1
    });
    return await Xr(h, _), { canceled: !1, filePath: h };
  } finally {
    const l = k.get(i);
    l && (clearTimeout(l.timeout), k.delete(i)), u.isDestroyed() || u.close();
  }
});
function Us() {
  y && !y.isDestroyed() || (y = new St({
    icon: E.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: E.join(Zt, "preload.mjs"),
      devTools: !H.isPackaged
    },
    minWidth: 1e3,
    minHeight: 600,
    autoHideMenuBar: !0,
    show: !1,
    frame: !1,
    titleBarStyle: "hidden"
  }), y.webContents.setWindowOpenHandler(({ url: r }) => r.startsWith("http:") || r.startsWith("https:") ? (Ps.openExternal(r), { action: "deny" }) : { action: "allow" }), y.on("maximize", () => {
    y == null || y.webContents.send("window:maximized-state-changed", !0);
  }), y.on("unmaximize", () => {
    y == null || y.webContents.send("window:maximized-state-changed", !1);
  }), y.maximize(), y.show(), ne ? y.loadURL(ne) : y.loadFile(E.join(er, "index.html")));
}
H.on("window-all-closed", () => {
  process.platform !== "darwin" && (H.quit(), y = null);
});
H.on("activate", () => {
  St.getAllWindows().length === 0 && Us();
});
H.whenReady().then(() => {
  Os.defaultSession.setPermissionRequestHandler((r, e, t) => {
    t(!1);
  }), Us();
});
export {
  cu as MAIN_DIST,
  er as RENDERER_DIST,
  ne as VITE_DEV_SERVER_URL
};
