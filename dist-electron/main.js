import rr, { ipcMain as Ye, dialog as dn, app as ft, BrowserWindow as Da, session as t_, shell as Yf } from "electron";
import qt from "fs";
import r_ from "constants";
import $n from "stream";
import hs from "util";
import Xf from "assert";
import ne from "path";
import ps from "child_process";
import Pa from "events";
import On from "crypto";
import Fa from "tty";
import _s from "os";
import jt from "url";
import Kf from "zlib";
import n_ from "http";
import { fileURLToPath as i_ } from "node:url";
import Pe from "node:path";
import { writeFile as Na, stat as s_, readFile as Jf, mkdir as o_, rm as a_ } from "node:fs/promises";
import { randomUUID as l_ } from "node:crypto";
import dt from "buffer";
import "net";
var S = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, at = {}, ir = {}, Ne = {};
Ne.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ne.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var St = r_, c_ = process.cwd, ji = null, u_ = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ji || (ji = c_.call(process)), ji;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ic = process.chdir;
  process.chdir = function(e) {
    ji = null, ic.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ic);
}
var f_ = d_;
function d_(e) {
  St.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, c, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, c, d, _) {
    _ && process.nextTick(_);
  }, e.lchownSync = function() {
  }), u_ === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function c(d, _, m) {
      var g = Date.now(), y = 0;
      l(d, _, function v(C) {
        if (C && (C.code === "EACCES" || C.code === "EPERM" || C.code === "EBUSY") && Date.now() - g < 6e4) {
          setTimeout(function() {
            e.stat(_, function(D, B) {
              D && D.code === "ENOENT" ? l(d, _, v) : m(C);
            });
          }, y), y < 100 && (y += 10);
          return;
        }
        m && m(C);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(c, l), c;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function c(d, _, m, g, y, v) {
      var C;
      if (v && typeof v == "function") {
        var D = 0;
        C = function(B, j, J) {
          if (B && B.code === "EAGAIN" && D < 10)
            return D++, l.call(e, d, _, m, g, y, C);
          v.apply(this, arguments);
        };
      }
      return l.call(e, d, _, m, g, y, C);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(c, l), c;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(c, d, _, m, g) {
      for (var y = 0; ; )
        try {
          return l.call(e, c, d, _, m, g);
        } catch (v) {
          if (v.code === "EAGAIN" && y < 10) {
            y++;
            continue;
          }
          throw v;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(c, d, _) {
      l.open(
        c,
        St.O_WRONLY | St.O_SYMLINK,
        d,
        function(m, g) {
          if (m) {
            _ && _(m);
            return;
          }
          l.fchmod(g, d, function(y) {
            l.close(g, function(v) {
              _ && _(y || v);
            });
          });
        }
      );
    }, l.lchmodSync = function(c, d) {
      var _ = l.openSync(c, St.O_WRONLY | St.O_SYMLINK, d), m = !0, g;
      try {
        g = l.fchmodSync(_, d), m = !1;
      } finally {
        if (m)
          try {
            l.closeSync(_);
          } catch {
          }
        else
          l.closeSync(_);
      }
      return g;
    };
  }
  function r(l) {
    St.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(c, d, _, m) {
      l.open(c, St.O_SYMLINK, function(g, y) {
        if (g) {
          m && m(g);
          return;
        }
        l.futimes(y, d, _, function(v) {
          l.close(y, function(C) {
            m && m(v || C);
          });
        });
      });
    }, l.lutimesSync = function(c, d, _) {
      var m = l.openSync(c, St.O_SYMLINK), g, y = !0;
      try {
        g = l.futimesSync(m, d, _), y = !1;
      } finally {
        if (y)
          try {
            l.closeSync(m);
          } catch {
          }
        else
          l.closeSync(m);
      }
      return g;
    }) : l.futimes && (l.lutimes = function(c, d, _, m) {
      m && process.nextTick(m);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(c, d, _) {
      return l.call(e, c, d, function(m) {
        p(m) && (m = null), _ && _.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(c, d) {
      try {
        return l.call(e, c, d);
      } catch (_) {
        if (!p(_)) throw _;
      }
    };
  }
  function s(l) {
    return l && function(c, d, _, m) {
      return l.call(e, c, d, _, function(g) {
        p(g) && (g = null), m && m.apply(this, arguments);
      });
    };
  }
  function o(l) {
    return l && function(c, d, _) {
      try {
        return l.call(e, c, d, _);
      } catch (m) {
        if (!p(m)) throw m;
      }
    };
  }
  function a(l) {
    return l && function(c, d, _) {
      typeof d == "function" && (_ = d, d = null);
      function m(g, y) {
        y && (y.uid < 0 && (y.uid += 4294967296), y.gid < 0 && (y.gid += 4294967296)), _ && _.apply(this, arguments);
      }
      return d ? l.call(e, c, d, m) : l.call(e, c, m);
    };
  }
  function u(l) {
    return l && function(c, d) {
      var _ = d ? l.call(e, c, d) : l.call(e, c);
      return _ && (_.uid < 0 && (_.uid += 4294967296), _.gid < 0 && (_.gid += 4294967296)), _;
    };
  }
  function p(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var c = !process.getuid || process.getuid() !== 0;
    return !!(c && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var sc = $n.Stream, h_ = p_;
function p_(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    sc.call(this);
    var s = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var o = Object.keys(i), a = 0, u = o.length; a < u; a++) {
      var p = o[a];
      this[p] = i[p];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        s._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, c) {
      if (l) {
        s.emit("error", l), s.readable = !1;
        return;
      }
      s.fd = c, s.emit("open", c), s._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    sc.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var s = Object.keys(i), o = 0, a = s.length; o < a; o++) {
      var u = s[o];
      this[u] = i[u];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var __ = m_, x_ = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function m_(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: x_(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ce = qt, g_ = f_, y_ = h_, E_ = __, mi = hs, Re, Vi;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Re = Symbol.for("graceful-fs.queue"), Vi = Symbol.for("graceful-fs.previous")) : (Re = "___graceful-fs.queue", Vi = "___graceful-fs.previous");
function b_() {
}
function Qf(e, t) {
  Object.defineProperty(e, Re, {
    get: function() {
      return t;
    }
  });
}
var tr = b_;
mi.debuglog ? tr = mi.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (tr = function() {
  var e = mi.format.apply(mi, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ce[Re]) {
  var w_ = S[Re] || [];
  Qf(ce, w_), ce.close = function(e) {
    function t(r, n) {
      return e.call(ce, r, function(i) {
        i || oc(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Vi, {
      value: e
    }), t;
  }(ce.close), ce.closeSync = function(e) {
    function t(r) {
      e.apply(ce, arguments), oc();
    }
    return Object.defineProperty(t, Vi, {
      value: e
    }), t;
  }(ce.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    tr(ce[Re]), Xf.equal(ce[Re].length, 0);
  });
}
S[Re] || Qf(S, ce[Re]);
var Ue = Ua(E_(ce));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ce.__patched && (Ue = Ua(ce), ce.__patched = !0);
function Ua(e) {
  g_(e), e.gracefulify = Ua, e.createReadStream = j, e.createWriteStream = J;
  var t = e.readFile;
  e.readFile = r;
  function r(M, E, W) {
    return typeof E == "function" && (W = E, E = null), K(M, E, W);
    function K(oe, $, T, P) {
      return t(oe, $, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? hr([K, [oe, $, T], A, P || Date.now(), Date.now()]) : typeof T == "function" && T.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(M, E, W, K) {
    return typeof W == "function" && (K = W, W = null), oe(M, E, W, K);
    function oe($, T, P, A, F) {
      return n($, T, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? hr([oe, [$, T, P, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = o);
  function o(M, E, W, K) {
    return typeof W == "function" && (K = W, W = null), oe(M, E, W, K);
    function oe($, T, P, A, F) {
      return s($, T, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? hr([oe, [$, T, P, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = u);
  function u(M, E, W, K) {
    return typeof W == "function" && (K = W, W = 0), oe(M, E, W, K);
    function oe($, T, P, A, F) {
      return a($, T, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? hr([oe, [$, T, P, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = c;
  var l = /^v[0-5]\./;
  function c(M, E, W) {
    typeof E == "function" && (W = E, E = null);
    var K = l.test(process.version) ? function(T, P, A, F) {
      return p(T, oe(
        T,
        P,
        A,
        F
      ));
    } : function(T, P, A, F) {
      return p(T, P, oe(
        T,
        P,
        A,
        F
      ));
    };
    return K(M, E, W);
    function oe($, T, P, A) {
      return function(F, O) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? hr([
          K,
          [$, T, P],
          F,
          A || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof P == "function" && P.call(this, F, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = y_(e);
    v = d.ReadStream, D = d.WriteStream;
  }
  var _ = e.ReadStream;
  _ && (v.prototype = Object.create(_.prototype), v.prototype.open = C);
  var m = e.WriteStream;
  m && (D.prototype = Object.create(m.prototype), D.prototype.open = B), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return v;
    },
    set: function(M) {
      v = M;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(M) {
      D = M;
    },
    enumerable: !0,
    configurable: !0
  });
  var g = v;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return g;
    },
    set: function(M) {
      g = M;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return y;
    },
    set: function(M) {
      y = M;
    },
    enumerable: !0,
    configurable: !0
  });
  function v(M, E) {
    return this instanceof v ? (_.apply(this, arguments), this) : v.apply(Object.create(v.prototype), arguments);
  }
  function C() {
    var M = this;
    re(M.path, M.flags, M.mode, function(E, W) {
      E ? (M.autoClose && M.destroy(), M.emit("error", E)) : (M.fd = W, M.emit("open", W), M.read());
    });
  }
  function D(M, E) {
    return this instanceof D ? (m.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function B() {
    var M = this;
    re(M.path, M.flags, M.mode, function(E, W) {
      E ? (M.destroy(), M.emit("error", E)) : (M.fd = W, M.emit("open", W));
    });
  }
  function j(M, E) {
    return new e.ReadStream(M, E);
  }
  function J(M, E) {
    return new e.WriteStream(M, E);
  }
  var X = e.open;
  e.open = re;
  function re(M, E, W, K) {
    return typeof W == "function" && (K = W, W = null), oe(M, E, W, K);
    function oe($, T, P, A, F) {
      return X($, T, P, function(O, k) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? hr([oe, [$, T, P, A], O, F || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function hr(e) {
  tr("ENQUEUE", e[0].name, e[1]), ce[Re].push(e), La();
}
var gi;
function oc() {
  for (var e = Date.now(), t = 0; t < ce[Re].length; ++t)
    ce[Re][t].length > 2 && (ce[Re][t][3] = e, ce[Re][t][4] = e);
  La();
}
function La() {
  if (clearTimeout(gi), gi = void 0, ce[Re].length !== 0) {
    var e = ce[Re].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      tr("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      tr("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var a = Date.now() - s, u = Math.max(s - i, 1), p = Math.min(u * 1.2, 100);
      a >= p ? (tr("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ce[Re].push(e);
    }
    gi === void 0 && (gi = setTimeout(La, 0));
  }
}
(function(e) {
  const t = Ne.fromCallback, r = Ue, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, s) {
    return typeof s == "function" ? r.exists(i, s) : new Promise((o) => r.exists(i, o));
  }, e.read = function(i, s, o, a, u, p) {
    return typeof p == "function" ? r.read(i, s, o, a, u, p) : new Promise((l, c) => {
      r.read(i, s, o, a, u, (d, _, m) => {
        if (d) return c(d);
        l({ bytesRead: _, buffer: m });
      });
    });
  }, e.write = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.write(i, s, ...o) : new Promise((a, u) => {
      r.write(i, s, ...o, (p, l, c) => {
        if (p) return u(p);
        a({ bytesWritten: l, buffer: c });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.writev(i, s, ...o) : new Promise((a, u) => {
      r.writev(i, s, ...o, (p, l, c) => {
        if (p) return u(p);
        a({ bytesWritten: l, buffers: c });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(ir);
var Ba = {}, Zf = {};
const v_ = ne;
Zf.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(v_.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const ed = ir, { checkPath: td } = Zf, rd = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Ba.makeDir = async (e, t) => (td(e), ed.mkdir(e, {
  mode: rd(t),
  recursive: !0
}));
Ba.makeDirSync = (e, t) => (td(e), ed.mkdirSync(e, {
  mode: rd(t),
  recursive: !0
}));
const R_ = Ne.fromPromise, { makeDir: C_, makeDirSync: xo } = Ba, mo = R_(C_);
var ht = {
  mkdirs: mo,
  mkdirsSync: xo,
  // alias
  mkdirp: mo,
  mkdirpSync: xo,
  ensureDir: mo,
  ensureDirSync: xo
};
const I_ = Ne.fromPromise, nd = ir;
function A_(e) {
  return nd.access(e).then(() => !0).catch(() => !1);
}
var sr = {
  pathExists: I_(A_),
  pathExistsSync: nd.existsSync
};
const Ar = Ue;
function T_(e, t, r, n) {
  Ar.open(e, "r+", (i, s) => {
    if (i) return n(i);
    Ar.futimes(s, t, r, (o) => {
      Ar.close(s, (a) => {
        n && n(o || a);
      });
    });
  });
}
function S_(e, t, r) {
  const n = Ar.openSync(e, "r+");
  return Ar.futimesSync(n, t, r), Ar.closeSync(n);
}
var id = {
  utimesMillis: T_,
  utimesMillisSync: S_
};
const Sr = ir, Ee = ne, $_ = hs;
function O_(e, t, r) {
  const n = r.dereference ? (i) => Sr.stat(i, { bigint: !0 }) : (i) => Sr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function D_(e, t, r) {
  let n;
  const i = r.dereference ? (o) => Sr.statSync(o, { bigint: !0 }) : (o) => Sr.lstatSync(o, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: s, destStat: null };
    throw o;
  }
  return { srcStat: s, destStat: n };
}
function P_(e, t, r, n, i) {
  $_.callbackify(O_)(e, t, n, (s, o) => {
    if (s) return i(s);
    const { srcStat: a, destStat: u } = o;
    if (u) {
      if (Dn(a, u)) {
        const p = Ee.basename(e), l = Ee.basename(t);
        return r === "move" && p !== l && p.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: u, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !u.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && u.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && Ma(e, t) ? i(new Error(xs(e, t, r))) : i(null, { srcStat: a, destStat: u });
  });
}
function F_(e, t, r, n) {
  const { srcStat: i, destStat: s } = D_(e, t, n);
  if (s) {
    if (Dn(i, s)) {
      const o = Ee.basename(e), a = Ee.basename(t);
      if (r === "move" && o !== a && o.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Ma(e, t))
    throw new Error(xs(e, t, r));
  return { srcStat: i, destStat: s };
}
function sd(e, t, r, n, i) {
  const s = Ee.resolve(Ee.dirname(e)), o = Ee.resolve(Ee.dirname(r));
  if (o === s || o === Ee.parse(o).root) return i();
  Sr.stat(o, { bigint: !0 }, (a, u) => a ? a.code === "ENOENT" ? i() : i(a) : Dn(t, u) ? i(new Error(xs(e, r, n))) : sd(e, t, o, n, i));
}
function od(e, t, r, n) {
  const i = Ee.resolve(Ee.dirname(e)), s = Ee.resolve(Ee.dirname(r));
  if (s === i || s === Ee.parse(s).root) return;
  let o;
  try {
    o = Sr.statSync(s, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Dn(t, o))
    throw new Error(xs(e, r, n));
  return od(e, t, s, n);
}
function Dn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Ma(e, t) {
  const r = Ee.resolve(e).split(Ee.sep).filter((i) => i), n = Ee.resolve(t).split(Ee.sep).filter((i) => i);
  return r.reduce((i, s, o) => i && n[o] === s, !0);
}
function xs(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Pr = {
  checkPaths: P_,
  checkPathsSync: F_,
  checkParentPaths: sd,
  checkParentPathsSync: od,
  isSrcSubdir: Ma,
  areIdentical: Dn
};
const ke = Ue, hn = ne, N_ = ht.mkdirs, U_ = sr.pathExists, L_ = id.utimesMillis, pn = Pr;
function B_(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), pn.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: o, destStat: a } = s;
    pn.checkParentPaths(e, o, t, "copy", (u) => u ? n(u) : r.filter ? ad(ac, a, e, t, r, n) : ac(a, e, t, r, n));
  });
}
function ac(e, t, r, n, i) {
  const s = hn.dirname(r);
  U_(s, (o, a) => {
    if (o) return i(o);
    if (a) return zi(e, t, r, n, i);
    N_(s, (u) => u ? i(u) : zi(e, t, r, n, i));
  });
}
function ad(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, s) : s(), (o) => s(o));
}
function M_(e, t, r, n, i) {
  return n.filter ? ad(zi, e, t, r, n, i) : zi(e, t, r, n, i);
}
function zi(e, t, r, n, i) {
  (n.dereference ? ke.stat : ke.lstat)(t, (o, a) => o ? i(o) : a.isDirectory() ? V_(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? k_(a, e, t, r, n, i) : a.isSymbolicLink() ? X_(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function k_(e, t, r, n, i, s) {
  return t ? q_(e, r, n, i, s) : ld(e, r, n, i, s);
}
function q_(e, t, r, n, i) {
  if (n.overwrite)
    ke.unlink(r, (s) => s ? i(s) : ld(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function ld(e, t, r, n, i) {
  ke.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? j_(e.mode, t, r, i) : ms(r, e.mode, i));
}
function j_(e, t, r, n) {
  return H_(e) ? G_(r, e, (i) => i ? n(i) : lc(e, t, r, n)) : lc(e, t, r, n);
}
function H_(e) {
  return (e & 128) === 0;
}
function G_(e, t, r) {
  return ms(e, t | 128, r);
}
function lc(e, t, r, n) {
  W_(t, r, (i) => i ? n(i) : ms(r, e, n));
}
function ms(e, t, r) {
  return ke.chmod(e, t, r);
}
function W_(e, t, r) {
  ke.stat(e, (n, i) => n ? r(n) : L_(t, i.atime, i.mtime, r));
}
function V_(e, t, r, n, i, s) {
  return t ? cd(r, n, i, s) : z_(e.mode, r, n, i, s);
}
function z_(e, t, r, n, i) {
  ke.mkdir(r, (s) => {
    if (s) return i(s);
    cd(t, r, n, (o) => o ? i(o) : ms(r, e, i));
  });
}
function cd(e, t, r, n) {
  ke.readdir(e, (i, s) => i ? n(i) : ud(s, e, t, r, n));
}
function ud(e, t, r, n, i) {
  const s = e.pop();
  return s ? Y_(e, s, t, r, n, i) : i();
}
function Y_(e, t, r, n, i, s) {
  const o = hn.join(r, t), a = hn.join(n, t);
  pn.checkPaths(o, a, "copy", i, (u, p) => {
    if (u) return s(u);
    const { destStat: l } = p;
    M_(l, o, a, i, (c) => c ? s(c) : ud(e, r, n, i, s));
  });
}
function X_(e, t, r, n, i) {
  ke.readlink(t, (s, o) => {
    if (s) return i(s);
    if (n.dereference && (o = hn.resolve(process.cwd(), o)), e)
      ke.readlink(r, (a, u) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? ke.symlink(o, r, i) : i(a) : (n.dereference && (u = hn.resolve(process.cwd(), u)), pn.isSrcSubdir(o, u) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${u}'.`)) : e.isDirectory() && pn.isSrcSubdir(u, o) ? i(new Error(`Cannot overwrite '${u}' with '${o}'.`)) : K_(o, r, i)));
    else
      return ke.symlink(o, r, i);
  });
}
function K_(e, t, r) {
  ke.unlink(t, (n) => n ? r(n) : ke.symlink(e, t, r));
}
var J_ = B_;
const $e = Ue, _n = ne, Q_ = ht.mkdirsSync, Z_ = id.utimesMillisSync, xn = Pr;
function ex(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = xn.checkPathsSync(e, t, "copy", r);
  return xn.checkParentPathsSync(e, n, t, "copy"), tx(i, e, t, r);
}
function tx(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = _n.dirname(r);
  return $e.existsSync(i) || Q_(i), fd(e, t, r, n);
}
function rx(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return fd(e, t, r, n);
}
function fd(e, t, r, n) {
  const s = (n.dereference ? $e.statSync : $e.lstatSync)(t);
  if (s.isDirectory()) return cx(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return nx(s, e, t, r, n);
  if (s.isSymbolicLink()) return dx(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function nx(e, t, r, n, i) {
  return t ? ix(e, r, n, i) : dd(e, r, n, i);
}
function ix(e, t, r, n) {
  if (n.overwrite)
    return $e.unlinkSync(r), dd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function dd(e, t, r, n) {
  return $e.copyFileSync(t, r), n.preserveTimestamps && sx(e.mode, t, r), ka(r, e.mode);
}
function sx(e, t, r) {
  return ox(e) && ax(r, e), lx(t, r);
}
function ox(e) {
  return (e & 128) === 0;
}
function ax(e, t) {
  return ka(e, t | 128);
}
function ka(e, t) {
  return $e.chmodSync(e, t);
}
function lx(e, t) {
  const r = $e.statSync(e);
  return Z_(t, r.atime, r.mtime);
}
function cx(e, t, r, n, i) {
  return t ? hd(r, n, i) : ux(e.mode, r, n, i);
}
function ux(e, t, r, n) {
  return $e.mkdirSync(r), hd(t, r, n), ka(r, e);
}
function hd(e, t, r) {
  $e.readdirSync(e).forEach((n) => fx(n, e, t, r));
}
function fx(e, t, r, n) {
  const i = _n.join(t, e), s = _n.join(r, e), { destStat: o } = xn.checkPathsSync(i, s, "copy", n);
  return rx(o, i, s, n);
}
function dx(e, t, r, n) {
  let i = $e.readlinkSync(t);
  if (n.dereference && (i = _n.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = $e.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return $e.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (s = _n.resolve(process.cwd(), s)), xn.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if ($e.statSync(r).isDirectory() && xn.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return hx(i, r);
  } else
    return $e.symlinkSync(i, r);
}
function hx(e, t) {
  return $e.unlinkSync(t), $e.symlinkSync(e, t);
}
var px = ex;
const _x = Ne.fromCallback;
var qa = {
  copy: _x(J_),
  copySync: px
};
const cc = Ue, pd = ne, Z = Xf, mn = process.platform === "win32";
function _d(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || cc[r], r = r + "Sync", e[r] = e[r] || cc[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ja(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z.strictEqual(typeof r, "function", "rimraf: callback function required"), Z(t, "rimraf: invalid options argument provided"), Z.strictEqual(typeof t, "object", "rimraf: options should be object"), _d(t), uc(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => uc(e, t, i), o);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function uc(e, t, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && mn)
      return fc(e, t, n, r);
    if (i && i.isDirectory())
      return Hi(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return mn ? fc(e, t, s, r) : Hi(e, t, s, r);
        if (s.code === "EISDIR")
          return Hi(e, t, s, r);
      }
      return r(s);
    });
  });
}
function fc(e, t, r, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, o) => {
      s ? n(s.code === "ENOENT" ? null : r) : o.isDirectory() ? Hi(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function dc(e, t, r) {
  let n;
  Z(e), Z(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? Gi(e, t, r) : t.unlinkSync(e);
}
function Hi(e, t, r, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? xx(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function xx(e, t, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, o;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      ja(pd.join(e, a), t, (u) => {
        if (!o) {
          if (u) return r(o = u);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function xd(e, t) {
  let r;
  t = t || {}, _d(t), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z(t, "rimraf: missing options"), Z.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && mn && dc(e, t, n);
  }
  try {
    r && r.isDirectory() ? Gi(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return mn ? dc(e, t, n) : Gi(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Gi(e, t, n);
  }
}
function Gi(e, t, r) {
  Z(e), Z(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      mx(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function mx(e, t) {
  if (Z(e), Z(t), t.readdirSync(e).forEach((r) => xd(pd.join(e, r), t)), mn) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var gx = ja;
ja.sync = xd;
const Yi = Ue, yx = Ne.fromCallback, md = gx;
function Ex(e, t) {
  if (Yi.rm) return Yi.rm(e, { recursive: !0, force: !0 }, t);
  md(e, t);
}
function bx(e) {
  if (Yi.rmSync) return Yi.rmSync(e, { recursive: !0, force: !0 });
  md.sync(e);
}
var gs = {
  remove: yx(Ex),
  removeSync: bx
};
const wx = Ne.fromPromise, gd = ir, yd = ne, Ed = ht, bd = gs, hc = wx(async function(t) {
  let r;
  try {
    r = await gd.readdir(t);
  } catch {
    return Ed.mkdirs(t);
  }
  return Promise.all(r.map((n) => bd.remove(yd.join(t, n))));
});
function pc(e) {
  let t;
  try {
    t = gd.readdirSync(e);
  } catch {
    return Ed.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = yd.join(e, r), bd.removeSync(r);
  });
}
var vx = {
  emptyDirSync: pc,
  emptydirSync: pc,
  emptyDir: hc,
  emptydir: hc
};
const Rx = Ne.fromCallback, wd = ne, Ft = Ue, vd = ht;
function Cx(e, t) {
  function r() {
    Ft.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Ft.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = wd.dirname(e);
    Ft.stat(s, (o, a) => {
      if (o)
        return o.code === "ENOENT" ? vd.mkdirs(s, (u) => {
          if (u) return t(u);
          r();
        }) : t(o);
      a.isDirectory() ? r() : Ft.readdir(s, (u) => {
        if (u) return t(u);
      });
    });
  });
}
function Ix(e) {
  let t;
  try {
    t = Ft.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = wd.dirname(e);
  try {
    Ft.statSync(r).isDirectory() || Ft.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") vd.mkdirsSync(r);
    else throw n;
  }
  Ft.writeFileSync(e, "");
}
var Ax = {
  createFile: Rx(Cx),
  createFileSync: Ix
};
const Tx = Ne.fromCallback, Rd = ne, Pt = Ue, Cd = ht, Sx = sr.pathExists, { areIdentical: Id } = Pr;
function $x(e, t, r) {
  function n(i, s) {
    Pt.link(i, s, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  Pt.lstat(t, (i, s) => {
    Pt.lstat(e, (o, a) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (s && Id(a, s)) return r(null);
      const u = Rd.dirname(t);
      Sx(u, (p, l) => {
        if (p) return r(p);
        if (l) return n(e, t);
        Cd.mkdirs(u, (c) => {
          if (c) return r(c);
          n(e, t);
        });
      });
    });
  });
}
function Ox(e, t) {
  let r;
  try {
    r = Pt.lstatSync(t);
  } catch {
  }
  try {
    const s = Pt.lstatSync(e);
    if (r && Id(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = Rd.dirname(t);
  return Pt.existsSync(n) || Cd.mkdirsSync(n), Pt.linkSync(e, t);
}
var Dx = {
  createLink: Tx($x),
  createLinkSync: Ox
};
const Nt = ne, ln = Ue, Px = sr.pathExists;
function Fx(e, t, r) {
  if (Nt.isAbsolute(e))
    return ln.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Nt.dirname(t), i = Nt.join(n, e);
    return Px(i, (s, o) => s ? r(s) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : ln.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: Nt.relative(n, e)
    })));
  }
}
function Nx(e, t) {
  let r;
  if (Nt.isAbsolute(e)) {
    if (r = ln.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Nt.dirname(t), i = Nt.join(n, e);
    if (r = ln.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = ln.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Nt.relative(n, e)
    };
  }
}
var Ux = {
  symlinkPaths: Fx,
  symlinkPathsSync: Nx
};
const Ad = Ue;
function Lx(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Ad.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Bx(e, t) {
  let r;
  if (t) return t;
  try {
    r = Ad.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Mx = {
  symlinkType: Lx,
  symlinkTypeSync: Bx
};
const kx = Ne.fromCallback, Td = ne, et = ir, Sd = ht, qx = Sd.mkdirs, jx = Sd.mkdirsSync, $d = Ux, Hx = $d.symlinkPaths, Gx = $d.symlinkPathsSync, Od = Mx, Wx = Od.symlinkType, Vx = Od.symlinkTypeSync, zx = sr.pathExists, { areIdentical: Dd } = Pr;
function Yx(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, et.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      et.stat(e),
      et.stat(t)
    ]).then(([o, a]) => {
      if (Dd(o, a)) return n(null);
      _c(e, t, r, n);
    }) : _c(e, t, r, n);
  });
}
function _c(e, t, r, n) {
  Hx(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, Wx(s.toCwd, r, (o, a) => {
      if (o) return n(o);
      const u = Td.dirname(t);
      zx(u, (p, l) => {
        if (p) return n(p);
        if (l) return et.symlink(e, t, a, n);
        qx(u, (c) => {
          if (c) return n(c);
          et.symlink(e, t, a, n);
        });
      });
    });
  });
}
function Xx(e, t, r) {
  let n;
  try {
    n = et.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = et.statSync(e), u = et.statSync(t);
    if (Dd(a, u)) return;
  }
  const i = Gx(e, t);
  e = i.toDst, r = Vx(i.toCwd, r);
  const s = Td.dirname(t);
  return et.existsSync(s) || jx(s), et.symlinkSync(e, t, r);
}
var Kx = {
  createSymlink: kx(Yx),
  createSymlinkSync: Xx
};
const { createFile: xc, createFileSync: mc } = Ax, { createLink: gc, createLinkSync: yc } = Dx, { createSymlink: Ec, createSymlinkSync: bc } = Kx;
var Jx = {
  // file
  createFile: xc,
  createFileSync: mc,
  ensureFile: xc,
  ensureFileSync: mc,
  // link
  createLink: gc,
  createLinkSync: yc,
  ensureLink: gc,
  ensureLinkSync: yc,
  // symlink
  createSymlink: Ec,
  createSymlinkSync: bc,
  ensureSymlink: Ec,
  ensureSymlinkSync: bc
};
function Qx(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "", o = JSON.stringify(e, n, i);
  if (o === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return o.replace(/\n/g, t) + s;
}
function Zx(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Ha = { stringify: Qx, stripBom: Zx };
let $r;
try {
  $r = Ue;
} catch {
  $r = qt;
}
const ys = Ne, { stringify: Pd, stripBom: Fd } = Ha;
async function em(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || $r, n = "throws" in t ? t.throws : !0;
  let i = await ys.fromCallback(r.readFile)(e, t);
  i = Fd(i);
  let s;
  try {
    s = JSON.parse(i, t ? t.reviver : null);
  } catch (o) {
    if (n)
      throw o.message = `${e}: ${o.message}`, o;
    return null;
  }
  return s;
}
const tm = ys.fromPromise(em);
function rm(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || $r, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Fd(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function nm(e, t, r = {}) {
  const n = r.fs || $r, i = Pd(t, r);
  await ys.fromCallback(n.writeFile)(e, i, r);
}
const im = ys.fromPromise(nm);
function sm(e, t, r = {}) {
  const n = r.fs || $r, i = Pd(t, r);
  return n.writeFileSync(e, i, r);
}
var om = {
  readFile: tm,
  readFileSync: rm,
  writeFile: im,
  writeFileSync: sm
};
const yi = om;
var am = {
  // jsonfile exports
  readJson: yi.readFile,
  readJsonSync: yi.readFileSync,
  writeJson: yi.writeFile,
  writeJsonSync: yi.writeFileSync
};
const lm = Ne.fromCallback, cn = Ue, Nd = ne, Ud = ht, cm = sr.pathExists;
function um(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Nd.dirname(e);
  cm(i, (s, o) => {
    if (s) return n(s);
    if (o) return cn.writeFile(e, t, r, n);
    Ud.mkdirs(i, (a) => {
      if (a) return n(a);
      cn.writeFile(e, t, r, n);
    });
  });
}
function fm(e, ...t) {
  const r = Nd.dirname(e);
  if (cn.existsSync(r))
    return cn.writeFileSync(e, ...t);
  Ud.mkdirsSync(r), cn.writeFileSync(e, ...t);
}
var Ga = {
  outputFile: lm(um),
  outputFileSync: fm
};
const { stringify: dm } = Ha, { outputFile: hm } = Ga;
async function pm(e, t, r = {}) {
  const n = dm(t, r);
  await hm(e, n, r);
}
var _m = pm;
const { stringify: xm } = Ha, { outputFileSync: mm } = Ga;
function gm(e, t, r) {
  const n = xm(t, r);
  mm(e, n, r);
}
var ym = gm;
const Em = Ne.fromPromise, Fe = am;
Fe.outputJson = Em(_m);
Fe.outputJsonSync = ym;
Fe.outputJSON = Fe.outputJson;
Fe.outputJSONSync = Fe.outputJsonSync;
Fe.writeJSON = Fe.writeJson;
Fe.writeJSONSync = Fe.writeJsonSync;
Fe.readJSON = Fe.readJson;
Fe.readJSONSync = Fe.readJsonSync;
var bm = Fe;
const wm = Ue, pa = ne, vm = qa.copy, Ld = gs.remove, Rm = ht.mkdirp, Cm = sr.pathExists, wc = Pr;
function Im(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  wc.checkPaths(e, t, "move", r, (s, o) => {
    if (s) return n(s);
    const { srcStat: a, isChangingCase: u = !1 } = o;
    wc.checkParentPaths(e, a, t, "move", (p) => {
      if (p) return n(p);
      if (Am(t)) return vc(e, t, i, u, n);
      Rm(pa.dirname(t), (l) => l ? n(l) : vc(e, t, i, u, n));
    });
  });
}
function Am(e) {
  const t = pa.dirname(e);
  return pa.parse(t).root === t;
}
function vc(e, t, r, n, i) {
  if (n) return go(e, t, r, i);
  if (r)
    return Ld(t, (s) => s ? i(s) : go(e, t, r, i));
  Cm(t, (s, o) => s ? i(s) : o ? i(new Error("dest already exists.")) : go(e, t, r, i));
}
function go(e, t, r, n) {
  wm.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Tm(e, t, r, n) : n());
}
function Tm(e, t, r, n) {
  vm(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : Ld(e, n));
}
var Sm = Im;
const Bd = Ue, _a = ne, $m = qa.copySync, Md = gs.removeSync, Om = ht.mkdirpSync, Rc = Pr;
function Dm(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = Rc.checkPathsSync(e, t, "move", r);
  return Rc.checkParentPathsSync(e, i, t, "move"), Pm(t) || Om(_a.dirname(t)), Fm(e, t, n, s);
}
function Pm(e) {
  const t = _a.dirname(e);
  return _a.parse(t).root === t;
}
function Fm(e, t, r, n) {
  if (n) return yo(e, t, r);
  if (r)
    return Md(t), yo(e, t, r);
  if (Bd.existsSync(t)) throw new Error("dest already exists.");
  return yo(e, t, r);
}
function yo(e, t, r) {
  try {
    Bd.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Nm(e, t, r);
  }
}
function Nm(e, t, r) {
  return $m(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Md(e);
}
var Um = Dm;
const Lm = Ne.fromCallback;
var Bm = {
  move: Lm(Sm),
  moveSync: Um
}, Ht = {
  // Export promiseified graceful-fs:
  ...ir,
  // Export extra methods:
  ...qa,
  ...vx,
  ...Jx,
  ...bm,
  ...ht,
  ...Bm,
  ...Ga,
  ...sr,
  ...gs
}, or = {}, Lt = {}, ge = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.CancellationError = Bt.CancellationToken = void 0;
const Mm = Pa;
class km extends Mm.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new xa());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, s) => {
      let o = null;
      if (n = () => {
        try {
          o != null && (o(), o = null);
        } finally {
          s(new xa());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, s, (a) => {
        o = a;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
Bt.CancellationToken = km;
class xa extends Error {
  constructor() {
    super("cancelled");
  }
}
Bt.CancellationError = xa;
var Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.newError = qm;
function qm(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var me = {}, ma = { exports: {} }, Ei = { exports: {} }, Eo, Cc;
function kd() {
  if (Cc) return Eo;
  Cc = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  Eo = function(l, c) {
    c = c || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return o(l);
    if (d === "number" && isFinite(l))
      return c.long ? u(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function o(l) {
    if (l = String(l), !(l.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (c) {
        var d = parseFloat(c[1]), _ = (c[2] || "ms").toLowerCase();
        switch (_) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * s;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function a(l) {
    var c = Math.abs(l);
    return c >= n ? Math.round(l / n) + "d" : c >= r ? Math.round(l / r) + "h" : c >= t ? Math.round(l / t) + "m" : c >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function u(l) {
    var c = Math.abs(l);
    return c >= n ? p(l, c, n, "day") : c >= r ? p(l, c, r, "hour") : c >= t ? p(l, c, t, "minute") : c >= e ? p(l, c, e, "second") : l + " ms";
  }
  function p(l, c, d, _) {
    var m = c >= d * 1.5;
    return Math.round(l / d) + " " + _ + (m ? "s" : "");
  }
  return Eo;
}
var bo, Ic;
function qd() {
  if (Ic) return bo;
  Ic = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = s, n.enabled = u, n.humanize = kd(), n.destroy = l, Object.keys(t).forEach((c) => {
      n[c] = t[c];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(c) {
      let d = 0;
      for (let _ = 0; _ < c.length; _++)
        d = (d << 5) - d + c.charCodeAt(_), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(c) {
      let d, _ = null, m, g;
      function y(...v) {
        if (!y.enabled)
          return;
        const C = y, D = Number(/* @__PURE__ */ new Date()), B = D - (d || D);
        C.diff = B, C.prev = d, C.curr = D, d = D, v[0] = n.coerce(v[0]), typeof v[0] != "string" && v.unshift("%O");
        let j = 0;
        v[0] = v[0].replace(/%([a-zA-Z%])/g, (X, re) => {
          if (X === "%%")
            return "%";
          j++;
          const M = n.formatters[re];
          if (typeof M == "function") {
            const E = v[j];
            X = M.call(C, E), v.splice(j, 1), j--;
          }
          return X;
        }), n.formatArgs.call(C, v), (C.log || n.log).apply(C, v);
      }
      return y.namespace = c, y.useColors = n.useColors(), y.color = n.selectColor(c), y.extend = i, y.destroy = n.destroy, Object.defineProperty(y, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => _ !== null ? _ : (m !== n.namespaces && (m = n.namespaces, g = n.enabled(c)), g),
        set: (v) => {
          _ = v;
        }
      }), typeof n.init == "function" && n.init(y), y;
    }
    function i(c, d) {
      const _ = n(this.namespace + (typeof d > "u" ? ":" : d) + c);
      return _.log = this.log, _;
    }
    function s(c) {
      n.save(c), n.namespaces = c, n.names = [], n.skips = [];
      const d = (typeof c == "string" ? c : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const _ of d)
        _[0] === "-" ? n.skips.push(_.slice(1)) : n.names.push(_);
    }
    function o(c, d) {
      let _ = 0, m = 0, g = -1, y = 0;
      for (; _ < c.length; )
        if (m < d.length && (d[m] === c[_] || d[m] === "*"))
          d[m] === "*" ? (g = m, y = _, m++) : (_++, m++);
        else if (g !== -1)
          m = g + 1, y++, _ = y;
        else
          return !1;
      for (; m < d.length && d[m] === "*"; )
        m++;
      return m === d.length;
    }
    function a() {
      const c = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), c;
    }
    function u(c) {
      for (const d of n.skips)
        if (o(c, d))
          return !1;
      for (const d of n.names)
        if (o(c, d))
          return !0;
      return !1;
    }
    function p(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return bo = e, bo;
}
var Ac;
function jm() {
  return Ac || (Ac = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = s, t.useColors = r, t.storage = o(), t.destroy = /* @__PURE__ */ (() => {
      let u = !1;
      return () => {
        u || (u = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let u;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (u = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(u[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(u) {
      if (u[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + u[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      u.splice(1, 0, p, "color: inherit");
      let l = 0, c = 0;
      u[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (c = l));
      }), u.splice(c, 0, p);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(u) {
      try {
        u ? t.storage.setItem("debug", u) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let u;
      try {
        u = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !u && typeof process < "u" && "env" in process && (u = process.env.DEBUG), u;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = qd()(t);
    const { formatters: a } = e.exports;
    a.j = function(u) {
      try {
        return JSON.stringify(u);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Ei, Ei.exports)), Ei.exports;
}
var bi = { exports: {} }, wo, Tc;
function Hm() {
  return Tc || (Tc = 1, wo = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), wo;
}
var vo, Sc;
function jd() {
  if (Sc) return vo;
  Sc = 1;
  const e = _s, t = Fa, r = Hm(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(u) {
    return u === 0 ? !1 : {
      level: u,
      hasBasic: !0,
      has256: u >= 2,
      has16m: u >= 3
    };
  }
  function o(u, p) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (u && !p && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const c = e.release().split(".");
      return Number(c[0]) >= 10 && Number(c[2]) >= 10586 ? Number(c[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((c) => c in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const c = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return c >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function a(u) {
    const p = o(u, u && u.isTTY);
    return s(p);
  }
  return vo = {
    supportsColor: a,
    stdout: s(o(!0, t.isatty(1))),
    stderr: s(o(!0, t.isatty(2)))
  }, vo;
}
var $c;
function Gm() {
  return $c || ($c = 1, function(e, t) {
    const r = Fa, n = hs;
    t.init = l, t.log = a, t.formatArgs = s, t.save = u, t.load = p, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = jd();
      d && (d.stderr || d).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, _) => {
      const m = _.substring(6).toLowerCase().replace(/_([a-z])/g, (y, v) => v.toUpperCase());
      let g = process.env[_];
      return /^(yes|on|true|enabled)$/i.test(g) ? g = !0 : /^(no|off|false|disabled)$/i.test(g) ? g = !1 : g === "null" ? g = null : g = Number(g), d[m] = g, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: _, useColors: m } = this;
      if (m) {
        const g = this.color, y = "\x1B[3" + (g < 8 ? g : "8;5;" + g), v = `  ${y};1m${_} \x1B[0m`;
        d[0] = v + d[0].split(`
`).join(`
` + v), d.push(y + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = o() + _ + " " + d[0];
    }
    function o() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...d) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function u(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const _ = Object.keys(t.inspectOpts);
      for (let m = 0; m < _.length; m++)
        d.inspectOpts[_[m]] = t.inspectOpts[_[m]];
    }
    e.exports = qd()(t);
    const { formatters: c } = e.exports;
    c.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((_) => _.trim()).join(" ");
    }, c.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(bi, bi.exports)), bi.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ma.exports = jm() : ma.exports = Gm();
var Wm = ma.exports, Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.ProgressCallbackTransform = void 0;
const Vm = $n;
class zm extends Vm.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Pn.ProgressCallbackTransform = zm;
Object.defineProperty(me, "__esModule", { value: !0 });
me.DigestTransform = me.HttpExecutor = me.HttpError = void 0;
me.addSensitiveRedirectHeader = eg;
me.addSensitiveFieldPattern = tg;
me.createHttpError = ya;
me.parseJson = ng;
me.configureRequestOptionsFromUrl = zd;
me.configureRequestUrl = za;
me.safeGetHeader = Tr;
me.configureRequestOptions = Xi;
me.isSensitiveFieldName = Yd;
me.hashSensitiveValue = Xd;
me.safeStringifyJson = br;
const Hd = On, Ym = Wm, Xm = qt, Km = $n, ga = jt, Jm = Bt, Oc = Fr, Qm = Pn, $t = (0, Ym.default)("electron-builder"), Wa = (e) => e.toLowerCase().replace(/[-_]/g, ""), Gd = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), Wd = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], Zm = ["key"];
function eg(e) {
  Gd.add(Wa(e));
}
function tg(e) {
  Wd.push(e.toLowerCase().replace(/[-_]/g, ""));
}
function ya(e, t = null) {
  return new Va(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + br(e.headers), t);
}
const rg = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Va extends Error {
  constructor(t, r = `HTTP error: ${rg.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
me.HttpError = Va;
function ng(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Er {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Jm.CancellationToken(), n) {
    Xi(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      $t.enabled && $t(br(n));
      const { headers: o, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": s.length,
          ...o
        },
        ...a
      };
    }
    return this.doApiRequest(t, r, (o) => o.end(s));
  }
  doApiRequest(t, r, n, i = 0) {
    if ($t.enabled) {
      const { headers: s, auth: o, ...a } = t;
      $t(`Request: ${br(a)}`);
    }
    return r.createPromise((s, o, a) => {
      const u = this.createRequest(t, (p) => {
        try {
          this.handleResponse(p, t, r, s, o, i, n);
        } catch (l) {
          o(l);
        }
      });
      this.addErrorAndTimeoutHandlers(u, o, t.timeout), this.addRedirectHandlers(u, t, o, i, (p) => {
        this.doApiRequest(p, r, n, i).then(s).catch(o);
      }), n(u, o), a(() => u.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, s) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, s, o, a) {
    var u;
    if ($t.enabled) {
      const { headers: _, auth: m, ...g } = r;
      $t(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${br(g)}`);
    }
    if (t.statusCode === 404) {
      s(ya(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (u = t.statusCode) !== null && u !== void 0 ? u : 0, l = p >= 300 && p < 400, c = Tr(t, "location");
    if (l && c != null) {
      if (o > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Er.prepareRedirectUrlOptions(c, r), n, a, o).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", s), t.on("data", (_) => d += _), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const _ = Tr(t, "content-type"), m = _ != null && (Array.isArray(_) ? _.find((g) => g.includes("json")) != null : _.includes("json"));
          s(ya(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${m ? br(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (_) {
        s(_);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, s) => {
      const o = [], a = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      za(t, a), Xi(a), this.doDownload(a, {
        destination: null,
        options: r,
        onCancel: s,
        callback: (u) => {
          u == null ? n(Buffer.concat(o)) : i(u);
        },
        responseHandler: (u, p) => {
          let l = 0;
          u.on("data", (c) => {
            if (l += c.length, l > 524288e3) {
              p(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            o.push(c);
          }), u.on("end", () => {
            p(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (s) => {
      if (s.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${s.statusCode}: ${s.statusMessage}`));
        return;
      }
      s.on("error", r.callback);
      const o = Tr(s, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(Er.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? sg(r, s) : r.responseHandler(s, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (s) => {
      this.doDownload(s, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = zd(t, { ...r }), i = n.headers;
    if (i == null)
      return n;
    const s = Er.reconstructOriginalUrl(r), o = Vd(t, r);
    if (Er.isCrossOriginRedirect(s, o)) {
      $t.enabled && $t(`Cross-origin redirect (${s.host} → ${o.host}): stripping sensitive headers`);
      for (const a of Object.keys(i))
        Gd.has(Wa(a)) && delete i[a];
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new ga.URL(`${r}//${n}${i}${s}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static async retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return await t();
      } catch (i) {
        if (n < r && (i instanceof Va && i.isServerError() || i.code === "EPIPE")) {
          await new Promise((s) => setTimeout(s, 1e3 * (n + 1)));
          continue;
        }
        throw i;
      }
  }
}
me.HttpExecutor = Er;
function Vd(e, t) {
  try {
    return new ga.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new ga.URL(e, s);
  }
}
function zd(e, t) {
  const r = Xi(t), n = Vd(e, t);
  return za(n, r), r;
}
function za(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ea extends Km.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Hd.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Oc.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Oc.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
me.DigestTransform = Ea;
function ig(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Tr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function sg(e, t) {
  if (!ig(Tr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = Tr(t, "content-length");
    o != null && r.push(new Qm.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Ea(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Ea(e.options.sha2, "sha256", "hex"));
  const i = (0, Xm.createWriteStream)(e.destination);
  r.push(i);
  let s = t;
  for (const o of r)
    o.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), s = s.pipe(o);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Xi(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Yd(e) {
  const t = Wa(e);
  return Wd.some((r) => t.includes(r)) || Zm.some((r) => t.endsWith(r));
}
function Xd(e) {
  return `${(0, Hd.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
}
function br(e, t) {
  return JSON.stringify(e, (r, n) => Yd(r) || t != null && t.has(r) ? typeof n == "string" ? Xd(n) : "<stripped sensitive data>" : n, 2);
}
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.MemoLazy = void 0;
class og {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Kd(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Es.MemoLazy = og;
function Kd(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((o) => Kd(e[o], t[o]));
  }
  return e === t;
}
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.githubUrl = ag;
Fn.githubTagPrefix = lg;
Fn.getS3LikeProviderBaseUrl = cg;
function ag(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function lg(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function cg(e) {
  const t = e.provider;
  if (t === "s3")
    return ug(e);
  if (t === "spaces")
    return fg(e);
  throw new Error(`Not supported provider: ${t}`);
}
function ug(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Jd(t, e.path);
}
function Jd(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function fg(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Jd(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
Ya.retry = Qd;
const dg = Bt;
async function Qd(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: o = 0, shouldRetry: a, cancellationToken: u = new dg.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((r = a == null ? void 0 : a(p)) !== null && r !== void 0 ? r : !0) && n > 0 && !u.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * o)), await Qd(e, { ...t, retries: n - 1, attempt: o + 1 });
    throw p;
  }
}
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
Xa.parseDn = hg;
function hg(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const s = /* @__PURE__ */ new Map();
  for (let o = 0; o <= e.length; o++) {
    if (o === e.length) {
      r !== null && s.set(r, n);
      break;
    }
    const a = e[o];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        o++;
        const u = parseInt(e.slice(o, o + 2), 16);
        Number.isNaN(u) ? n += e[o] : (o++, n += String.fromCharCode(u));
        continue;
      }
      if (r === null && a === "=") {
        r = n, n = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        r !== null && s.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (n.length === 0)
        continue;
      if (o > i) {
        let u = o;
        for (; e[u] === " "; )
          u++;
        i = u;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        o = i - 1;
        continue;
      }
    }
    n += a;
  }
  return s;
}
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.nil = Or.UUID = void 0;
const Zd = On, e0 = Fr, pg = "options.name must be either a string or a Buffer", Dc = (0, Zd.randomBytes)(16);
Dc[0] = Dc[0] | 1;
const Wi = {}, z = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Wi[t] = e, z[e] = t;
}
class nr {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = nr.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return _g(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = xg(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Wi[t[14] + t[15]] & 240) >> 4,
        variant: Pc((Wi[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: Pc((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, e0.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Wi[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Or.UUID = nr;
nr.OID = nr.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Pc(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var un;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(un || (un = {}));
function _g(e, t, r, n, i = un.ASCII) {
  const s = (0, Zd.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, e0.newError)(pg, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const a = s.digest();
  let u;
  switch (i) {
    case un.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, u = a;
      break;
    case un.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, u = new nr(a);
      break;
    default:
      u = z[a[0]] + z[a[1]] + z[a[2]] + z[a[3]] + "-" + z[a[4]] + z[a[5]] + "-" + z[a[6] & 15 | r] + z[a[7]] + "-" + z[a[8] & 63 | 128] + z[a[9]] + "-" + z[a[10]] + z[a[11]] + z[a[12]] + z[a[13]] + z[a[14]] + z[a[15]];
      break;
  }
  return u;
}
function xg(e) {
  return z[e[0]] + z[e[1]] + z[e[2]] + z[e[3]] + "-" + z[e[4]] + z[e[5]] + "-" + z[e[6]] + z[e[7]] + "-" + z[e[8]] + z[e[9]] + "-" + z[e[10]] + z[e[11]] + z[e[12]] + z[e[13]] + z[e[14]] + z[e[15]];
}
Or.nil = new nr("00000000-0000-0000-0000-000000000000");
var Nn = {}, t0 = {};
(function(e) {
  (function(t) {
    t.parser = function(h, f) {
      return new n(h, f);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = p, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(h, f) {
      if (!(this instanceof n))
        return new n(h, f);
      var R = this;
      s(R), R.q = R.c = "", R.bufferCheckPosition = t.MAX_BUFFER_LENGTH, R.encoding = null, R.opt = f || {}, R.opt.lowercase = R.opt.lowercase || R.opt.lowercasetags, R.looseCase = R.opt.lowercase ? "toLowerCase" : "toUpperCase", R.opt.maxEntityCount = R.opt.maxEntityCount || 512, R.opt.maxEntityDepth = R.opt.maxEntityDepth || 4, R.entityCount = R.entityDepth = 0, R.tags = [], R.closed = R.closedRoot = R.sawRoot = !1, R.tag = R.error = null, R.strict = !!h, R.noscript = !!(h || R.opt.noscript), R.state = E.BEGIN, R.strictEntities = R.opt.strictEntities, R.ENTITIES = R.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), R.attribList = [], R.opt.xmlns && (R.ns = Object.create(y)), R.opt.unquotedAttributeValues === void 0 && (R.opt.unquotedAttributeValues = !h), R.trackPosition = R.opt.position !== !1, R.trackPosition && (R.position = R.line = R.column = 0), K(R, "onready");
    }
    Object.create || (Object.create = function(h) {
      function f() {
      }
      f.prototype = h;
      var R = new f();
      return R;
    }), Object.keys || (Object.keys = function(h) {
      var f = [];
      for (var R in h) h.hasOwnProperty(R) && f.push(R);
      return f;
    });
    function i(h) {
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), R = 0, b = 0, Y = r.length; b < Y; b++) {
        var ae = h[r[b]].length;
        if (ae > f)
          switch (r[b]) {
            case "textNode":
              F(h);
              break;
            case "cdata":
              A(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              A(h, "onscript", h.script), h.script = "";
              break;
            default:
              k(h, "Max buffer length exceeded: " + r[b]);
          }
        R = Math.max(R, ae);
      }
      var fe = t.MAX_BUFFER_LENGTH - R;
      h.bufferCheckPosition = fe + h.position;
    }
    function s(h) {
      for (var f = 0, R = r.length; f < R; f++)
        h[r[f]] = "";
    }
    function o(h) {
      F(h), h.cdata !== "" && (A(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (A(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        V(this);
      },
      write: Vr,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        o(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var u = t.EVENTS.filter(function(h) {
      return h !== "error" && h !== "end";
    });
    function p(h, f) {
      return new c(h, f);
    }
    function l(h, f) {
      if (h.length >= 2) {
        if (h[0] === 255 && h[1] === 254)
          return "utf-16le";
        if (h[0] === 254 && h[1] === 255)
          return "utf-16be";
      }
      return h.length >= 3 && h[0] === 239 && h[1] === 187 && h[2] === 191 ? "utf8" : h.length >= 4 ? h[0] === 60 && h[1] === 0 && h[2] === 63 && h[3] === 0 ? "utf-16le" : h[0] === 0 && h[1] === 60 && h[2] === 0 && h[3] === 63 ? "utf-16be" : "utf8" : f ? "utf8" : null;
    }
    function c(h, f) {
      if (!(this instanceof c))
        return new c(h, f);
      a.apply(this), this._parser = new n(h, f), this.writable = !0, this.readable = !0;
      var R = this;
      this._parser.onend = function() {
        R.emit("end");
      }, this._parser.onerror = function(b) {
        R.emit("error", b), R._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, u.forEach(function(b) {
        Object.defineProperty(R, "on" + b, {
          get: function() {
            return R._parser["on" + b];
          },
          set: function(Y) {
            if (!Y)
              return R.removeAllListeners(b), R._parser["on" + b] = Y, Y;
            R.on(b, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(a.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype._decodeBuffer = function(h, f) {
      if (this._decoderBuffer && (h = Buffer.concat([this._decoderBuffer, h]), this._decoderBuffer = null), !this._decoder) {
        var R = l(h, f);
        if (!R)
          return this._decoderBuffer = h, "";
        this._parser.encoding = R, this._decoder = new TextDecoder(R);
      }
      return this._decoder.decode(h, { stream: !f });
    }, c.prototype.write = function(h) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h))
        h = this._decodeBuffer(h, !1);
      else if (this._decoderBuffer) {
        var f = this._decodeBuffer(Buffer.alloc(0), !0);
        f && (this._parser.write(f), this.emit("data", f));
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      if (h && h.length && this.write(h), this._decoderBuffer) {
        var f = this._decodeBuffer(Buffer.alloc(0), !0);
        f && (this._parser.write(f), this.emit("data", f));
      } else if (this._decoder) {
        var R = this._decoder.decode();
        R && (this._parser.write(R), this.emit("data", R));
      }
      return this._parser.end(), !0;
    }, c.prototype.on = function(h, f) {
      var R = this;
      return !R._parser["on" + h] && u.indexOf(h) !== -1 && (R._parser["on" + h] = function() {
        var b = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        b.splice(0, 0, h), R.emit.apply(R, b);
      }), a.prototype.on.call(R, h, f);
    };
    var d = /^\[CDATA\[$/i, _ = /^DOCTYPE$/i, m = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", y = { xml: m, xmlns: g }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, B = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function j(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function J(h) {
      return h === '"' || h === "'";
    }
    function X(h) {
      return h === ">" || j(h);
    }
    function re(h, f) {
      return h.test(f);
    }
    function M(h, f) {
      return !re(h, f);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
      // <script> ... <
    }, t.XML_ENTITIES = Object.assign(/* @__PURE__ */ Object.create(null), {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }), t.ENTITIES = Object.assign(/* @__PURE__ */ Object.create(null), {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }), Object.keys(t.ENTITIES).forEach(function(h) {
      var f = t.ENTITIES[h], R = typeof f == "number" ? String.fromCharCode(f) : f;
      t.ENTITIES[h] = R;
    });
    for (var W in t.STATE)
      t.STATE[t.STATE[W]] = W;
    E = t.STATE;
    function K(h, f, R) {
      h[f] && h[f](R);
    }
    function oe(h) {
      var f = h && h.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return f ? f[2] : null;
    }
    function $(h) {
      return h ? h.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function T(h, f) {
      const R = $(h), b = $(f);
      return !R || !b ? !0 : b === "utf16" ? R === "utf16le" || R === "utf16be" : R === b;
    }
    function P(h, f) {
      if (!(!h.strict || !h.encoding || !f || f.name !== "xml")) {
        var R = oe(f.body);
        R && !T(h.encoding, R) && N(
          h,
          "XML declaration encoding " + R + " does not match detected stream encoding " + h.encoding.toUpperCase()
        );
      }
    }
    function A(h, f, R) {
      h.textNode && F(h), K(h, f, R);
    }
    function F(h) {
      h.textNode = O(h.opt, h.textNode), h.textNode && K(h, "ontext", h.textNode), h.textNode = "";
    }
    function O(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function k(h, f) {
      return F(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, K(h, "onerror", f), h;
    }
    function V(h) {
      return h.sawRoot && !h.closedRoot && N(h, "Unclosed root tag"), h.state !== E.BEGIN && h.state !== E.BEGIN_WHITESPACE && h.state !== E.TEXT && k(h, "Unexpected end"), F(h), h.c = "", h.closed = !0, K(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function N(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && k(h, f);
    }
    function Q(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, R = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (R.ns = f.ns), h.attribList.length = 0, A(h, "onopentagstart", R);
    }
    function _e(h, f) {
      var R = h.indexOf(":"), b = R < 0 ? ["", h] : h.split(":"), Y = b[0], ae = b[1];
      return f && h === "xmlns" && (Y = "xmlns", ae = ""), { prefix: Y, local: ae };
    }
    function q(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = _e(h.attribName, !0), R = f.prefix, b = f.local;
        if (R === "xmlns")
          if (b === "xml" && h.attribValue !== m)
            N(
              h,
              "xml: prefix must be bound to " + m + `
Actual: ` + h.attribValue
            );
          else if (b === "xmlns" && h.attribValue !== g)
            N(
              h,
              "xmlns: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else {
            var Y = h.tag, ae = h.tags[h.tags.length - 1] || h;
            Y.ns === ae.ns && (Y.ns = Object.create(ae.ns)), Y.ns[b] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, A(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function Ie(h, f) {
      if (h.opt.xmlns) {
        var R = h.tag, b = _e(h.tagName);
        R.prefix = b.prefix, R.local = b.local, R.uri = R.ns[b.prefix] || "", R.prefix && !R.uri && (N(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), R.uri = b.prefix);
        var Y = h.tags[h.tags.length - 1] || h;
        R.ns && Y.ns !== R.ns && Object.keys(R.ns).forEach(function(fr) {
          A(h, "onopennamespace", {
            prefix: fr,
            uri: R.ns[fr]
          });
        });
        for (var ae = 0, fe = h.attribList.length; ae < fe; ae++) {
          var Ae = h.attribList[ae], Te = Ae[0], Ke = Ae[1], xe = _e(Te, !0), Je = xe.prefix, lo = xe.local, ci = Je === "" ? "" : R.ns[Je] || "", Ct = {
            name: Te,
            value: Ke,
            prefix: Je,
            local: lo,
            uri: ci
          };
          Je && Je !== "xmlns" && !ci && (N(
            h,
            "Unbound namespace prefix: " + JSON.stringify(Je)
          ), Ct.uri = Je), h.tag.attributes[Te] = Ct, A(h, "onattribute", Ct);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), A(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = E.SCRIPT : h.state = E.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function Gr(h) {
      if (!h.tagName) {
        N(h, "Weird empty close tag."), h.textNode += "</>", h.state = E.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = E.SCRIPT;
          return;
        }
        A(h, "onscript", h.script), h.script = "";
      }
      var f = h.tags.length, R = h.tagName;
      h.strict || (R = R[h.looseCase]());
      for (var b = R; f--; ) {
        var Y = h.tags[f];
        if (Y.name !== b)
          N(h, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        N(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = E.TEXT;
        return;
      }
      h.tagName = R;
      for (var ae = h.tags.length; ae-- > f; ) {
        var fe = h.tag = h.tags.pop();
        h.tagName = h.tag.name, A(h, "onclosetag", h.tagName);
        var Ae = {};
        for (var Te in fe.ns)
          Ae[Te] = fe.ns[Te];
        var Ke = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && fe.ns !== Ke.ns && Object.keys(fe.ns).forEach(function(xe) {
          var Je = fe.ns[xe];
          A(h, "onclosenamespace", { prefix: xe, uri: Je });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = E.TEXT;
    }
    function Xe(h) {
      var f = h.entity, R = f.toLowerCase(), b, Y = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[R] ? h.ENTITIES[R] : (f = R, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), b = parseInt(f, 16), Y = b.toString(16)) : (f = f.slice(1), b = parseInt(f, 10), Y = b.toString(10))), f = f.replace(/^0+/, ""), isNaN(b) || Y.toLowerCase() !== f || b < 0 || b > 1114111 || !li(b) ? (N(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(b));
    }
    function li(h) {
      return h === 9 || h === 10 || h === 13 || h >= 32 && h <= 55295 || h >= 57344 && h <= 65533 || h >= 65536 && h <= 1114111;
    }
    function Wr(h, f) {
      f === "<" ? (h.state = E.OPEN_WAKA, h.startTagPosition = h.position) : j(f) || (N(h, "Non-whitespace before first tag."), h.textNode = f, h.state = E.TEXT);
    }
    function ur(h, f) {
      var R = "";
      return f < h.length && (R = h.charAt(f)), R;
    }
    function Vr(h) {
      var f = this;
      if (this.error)
        throw this.error;
      if (f.closed)
        return k(
          f,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return V(f);
      typeof h == "object" && (h = h.toString());
      for (var R = 0, b = ""; b = ur(h, R++), f.c = b, !!b; )
        switch (f.trackPosition && (f.position++, b === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case E.BEGIN:
            if (f.state = E.BEGIN_WHITESPACE, b === "\uFEFF")
              continue;
            Wr(f, b);
            continue;
          case E.BEGIN_WHITESPACE:
            Wr(f, b);
            continue;
          case E.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var ae = R - 1; b && b !== "<" && b !== "&"; )
                b = ur(h, R++), b && f.trackPosition && (f.position++, b === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(ae, R - 1);
            }
            b === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : (!j(b) && (!f.sawRoot || f.closedRoot) && N(f, "Text data outside of root node."), b === "&" ? f.state = E.TEXT_ENTITY : f.textNode += b);
            continue;
          case E.SCRIPT:
            b === "<" ? f.state = E.SCRIPT_ENDING : f.script += b;
            continue;
          case E.SCRIPT_ENDING:
            b === "/" ? f.state = E.CLOSE_TAG : (f.script += "<" + b, f.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (b === "!")
              f.state = E.SGML_DECL, f.sgmlDecl = "";
            else if (!j(b)) if (re(v, b))
              f.state = E.OPEN_TAG, f.tagName = b;
            else if (b === "/")
              f.state = E.CLOSE_TAG, f.tagName = "";
            else if (b === "?")
              f.state = E.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (N(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var Y = f.position - f.startTagPosition;
                b = new Array(Y).join(" ") + b;
              }
              f.textNode += "<" + b, f.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (f.sgmlDecl + b === "--") {
              f.state = E.COMMENT, f.comment = "", f.sgmlDecl = "";
              continue;
            }
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = E.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + b, f.sgmlDecl = "") : d.test(f.sgmlDecl + b) ? (A(f, "onopencdata"), f.state = E.CDATA, f.sgmlDecl = "", f.cdata = "") : _.test(f.sgmlDecl + b) ? (f.state = E.DOCTYPE, (f.doctype || f.sawRoot) && N(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : b === ">" ? (A(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = E.TEXT) : (J(b) && (f.state = E.SGML_DECL_QUOTED), f.sgmlDecl += b);
            continue;
          case E.SGML_DECL_QUOTED:
            b === f.q && (f.state = E.SGML_DECL, f.q = ""), f.sgmlDecl += b;
            continue;
          case E.DOCTYPE:
            b === ">" ? (f.state = E.TEXT, A(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += b, b === "[" ? f.state = E.DOCTYPE_DTD : J(b) && (f.state = E.DOCTYPE_QUOTED, f.q = b));
            continue;
          case E.DOCTYPE_QUOTED:
            f.doctype += b, b === f.q && (f.q = "", f.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            b === "]" ? (f.doctype += b, f.state = E.DOCTYPE) : b === "<" ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : J(b) ? (f.doctype += b, f.state = E.DOCTYPE_DTD_QUOTED, f.q = b) : f.doctype += b;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            f.doctype += b, b === f.q && (f.state = E.DOCTYPE_DTD, f.q = "");
            continue;
          case E.COMMENT:
            b === "-" ? f.state = E.COMMENT_ENDING : f.comment += b;
            continue;
          case E.COMMENT_ENDING:
            b === "-" ? (f.state = E.COMMENT_ENDED, f.comment = O(f.opt, f.comment), f.comment && A(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + b, f.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            b !== ">" ? (N(f, "Malformed comment"), f.comment += "--" + b, f.state = E.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = E.DOCTYPE_DTD : f.state = E.TEXT;
            continue;
          case E.CDATA:
            for (var ae = R - 1; b && b !== "]"; )
              b = ur(h, R++), b && f.trackPosition && (f.position++, b === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(ae, R - 1), b === "]" && (f.state = E.CDATA_ENDING);
            continue;
          case E.CDATA_ENDING:
            b === "]" ? f.state = E.CDATA_ENDING_2 : (f.cdata += "]" + b, f.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            b === ">" ? (f.cdata && A(f, "oncdata", f.cdata), A(f, "onclosecdata"), f.cdata = "", f.state = E.TEXT) : b === "]" ? f.cdata += "]" : (f.cdata += "]]" + b, f.state = E.CDATA);
            continue;
          case E.PROC_INST:
            b === "?" ? f.state = E.PROC_INST_ENDING : j(b) ? f.state = E.PROC_INST_BODY : f.procInstName += b;
            continue;
          case E.PROC_INST_BODY:
            if (!f.procInstBody && j(b))
              continue;
            b === "?" ? f.state = E.PROC_INST_ENDING : f.procInstBody += b;
            continue;
          case E.PROC_INST_ENDING:
            if (b === ">") {
              const Ke = {
                name: f.procInstName,
                body: f.procInstBody
              };
              P(f, Ke), A(f, "onprocessinginstruction", Ke), f.procInstName = f.procInstBody = "", f.state = E.TEXT;
            } else
              f.procInstBody += "?" + b, f.state = E.PROC_INST_BODY;
            continue;
          case E.OPEN_TAG:
            re(C, b) ? f.tagName += b : (Q(f), b === ">" ? Ie(f) : b === "/" ? f.state = E.OPEN_TAG_SLASH : (j(b) || N(f, "Invalid character in tag name"), f.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            b === ">" ? (Ie(f, !0), Gr(f)) : (N(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (j(b))
              continue;
            b === ">" ? Ie(f) : b === "/" ? f.state = E.OPEN_TAG_SLASH : re(v, b) ? (f.attribName = b, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            b === "=" ? f.state = E.ATTRIB_VALUE : b === ">" ? (N(f, "Attribute without value"), f.attribValue = f.attribName, q(f), Ie(f)) : j(b) ? f.state = E.ATTRIB_NAME_SAW_WHITE : re(C, b) ? f.attribName += b : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (b === "=")
              f.state = E.ATTRIB_VALUE;
            else {
              if (j(b))
                continue;
              N(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", A(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", b === ">" ? Ie(f) : re(v, b) ? (f.attribName = b, f.state = E.ATTRIB_NAME) : (N(f, "Invalid attribute name"), f.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (j(b))
              continue;
            J(b) ? (f.q = b, f.state = E.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || k(f, "Unquoted attribute value"), f.state = E.ATTRIB_VALUE_UNQUOTED, f.attribValue = b);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (b !== f.q) {
              b === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_Q : f.attribValue += b;
              continue;
            }
            q(f), f.q = "", f.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            j(b) ? f.state = E.ATTRIB : b === ">" ? Ie(f) : b === "/" ? f.state = E.OPEN_TAG_SLASH : re(v, b) ? (N(f, "No whitespace between attributes"), f.attribName = b, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!X(b)) {
              b === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_U : f.attribValue += b;
              continue;
            }
            q(f), b === ">" ? Ie(f) : f.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (f.tagName)
              b === ">" ? Gr(f) : re(C, b) ? f.tagName += b : f.script ? (f.script += "</" + f.tagName + b, f.tagName = "", f.state = E.SCRIPT) : (j(b) || N(f, "Invalid tagname in closing tag"), f.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (j(b))
                continue;
              M(v, b) ? f.script ? (f.script += "</" + b, f.state = E.SCRIPT) : N(f, "Invalid tagname in closing tag.") : f.tagName = b;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (j(b))
              continue;
            b === ">" ? Gr(f) : N(f, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var fe, Ae;
            switch (f.state) {
              case E.TEXT_ENTITY:
                fe = E.TEXT, Ae = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                fe = E.ATTRIB_VALUE_QUOTED, Ae = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                fe = E.ATTRIB_VALUE_UNQUOTED, Ae = "attribValue";
                break;
            }
            if (b === ";") {
              var Te = Xe(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Te) ? ((f.entityCount += 1) > f.opt.maxEntityCount && k(
                f,
                "Parsed entity count exceeds max entity count"
              ), (f.entityDepth += 1) > f.opt.maxEntityDepth && k(
                f,
                "Parsed entity depth exceeds max entity depth"
              ), f.entity = "", f.state = fe, f.write(Te), f.entityDepth -= 1) : (f[Ae] += Te, f.entity = "", f.state = fe);
            } else re(f.entity.length ? B : D, b) ? f.entity += b : (N(f, "Invalid character in entity name"), f[Ae] += "&" + f.entity + b, f.entity = "", f.state = fe);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, R = function() {
        var b = 16384, Y = [], ae, fe, Ae = -1, Te = arguments.length;
        if (!Te)
          return "";
        for (var Ke = ""; ++Ae < Te; ) {
          var xe = Number(arguments[Ae]);
          if (!isFinite(xe) || // `NaN`, `+Infinity`, or `-Infinity`
          xe < 0 || // not a valid Unicode code point
          xe > 1114111 || // not a valid Unicode code point
          f(xe) !== xe)
            throw RangeError("Invalid code point: " + xe);
          xe <= 65535 ? Y.push(xe) : (xe -= 65536, ae = (xe >> 10) + 55296, fe = xe % 1024 + 56320, Y.push(ae, fe)), (Ae + 1 === Te || Y.length > b) && (Ke += h.apply(null, Y), Y.length = 0);
        }
        return Ke;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: R,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = R;
    }();
  })(e);
})(t0);
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.XElement = void 0;
Nn.parseXml = Eg;
const mg = t0, wi = Fr;
class r0 {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, wi.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!yg(t))
      throw (0, wi.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, wi.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, wi.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Fc(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Fc(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Nn.XElement = r0;
const gg = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function yg(e) {
  return gg.test(e);
}
function Fc(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Eg(e) {
  let t = null;
  const r = mg.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new r0(i.name);
    if (s.attributes = i.attributes, t === null)
      t = s;
    else {
      const o = n[n.length - 1];
      o.elements == null && (o.elements = []), o.elements.push(s);
    }
    n.push(s);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const s = n[n.length - 1];
    s.value = i, s.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
var ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.mapToObject = n0;
ar.isValidKey = bs;
ar.asArray = bg;
ar.deepAssign = vg;
ar.objectToArgs = Ig;
function n0(e) {
  const t = {};
  for (const [r, n] of e)
    bs(r) && (n instanceof Map ? t[r] = n0(n) : t[r] = n);
  return t;
}
function bs(e) {
  return ["__proto__", "prototype", "constructor"].includes(e) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof e) || e === null;
}
function bg(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function Nc(e) {
  if (Array.isArray(e))
    return !1;
  const t = typeof e;
  return t === "object" || t === "function";
}
function wg(e, t, r) {
  const n = t[r];
  if (n === void 0)
    return;
  const i = e[r];
  i == null || n == null || !Nc(i) || !Nc(n) ? Array.isArray(i) && Array.isArray(n) ? e[r] = Array.from(new Set(i.concat(n))) : e[r] = n : e[r] = i0(i, n);
}
function i0(e, t) {
  if (e !== t)
    for (const r of Object.getOwnPropertyNames(t))
      bs(r) && wg(e, t, r);
  return e;
}
function vg(e, ...t) {
  for (const r of t)
    r != null && i0(e, r);
  return e;
}
const Rg = /^[a-zA-Z][a-zA-Z0-9-]*$/, Cg = /[\0\r\n]/;
function Ig(e) {
  const t = Object.entries(e).reduce((r, [n, i]) => {
    if (!bs(n) || i == null)
      return r;
    if (!Rg.test(n))
      throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(n)}`);
    if (Cg.test(i))
      throw new Error(`objectToArgs: value for --${n} contains a null byte or newline`);
    return r.concat([`--${n}`, i]);
  }, []);
  return Object.freeze(t);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
  var t = Bt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Fr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = me;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "hashSensitiveValue", { enumerable: !0, get: function() {
    return n.hashSensitiveValue;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "isSensitiveFieldName", { enumerable: !0, get: function() {
    return n.isSensitiveFieldName;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = Es;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = Pn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var o = Fn;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return o.githubTagPrefix;
  } });
  var a = Ya;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var u = Xa;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return u.parseDn;
  } });
  var p = Or;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var l = Nn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } });
  var c = ar;
  Object.defineProperty(e, "isValidKey", { enumerable: !0, get: function() {
    return c.isValidKey;
  } }), Object.defineProperty(e, "mapToObject", { enumerable: !0, get: function() {
    return c.mapToObject;
  } }), Object.defineProperty(e, "asArray", { enumerable: !0, get: function() {
    return c.asArray;
  } }), Object.defineProperty(e, "deepAssign", { enumerable: !0, get: function() {
    return c.deepAssign;
  } }), Object.defineProperty(e, "objectToArgs", { enumerable: !0, get: function() {
    return c.objectToArgs;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
})(ge);
var Ce = {}, Ka = {}, rt = {};
function s0(e) {
  return typeof e > "u" || e === null;
}
function Ag(e) {
  return typeof e == "object" && e !== null;
}
function Tg(e) {
  return Array.isArray(e) ? e : s0(e) ? [] : [e];
}
function Sg(e, t) {
  if (t) {
    const r = Object.keys(t);
    for (let n = 0, i = r.length; n < i; n += 1) {
      const s = r[n];
      e[s] = t[s];
    }
  }
  return e;
}
function $g(e, t) {
  let r = "";
  for (let n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Og(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
rt.isNothing = s0;
rt.isObject = Ag;
rt.toArray = Tg;
rt.repeat = $g;
rt.isNegativeZero = Og;
rt.extend = Sg;
function o0(e, t) {
  let r = "";
  const n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function gn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = o0(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
gn.prototype = Object.create(Error.prototype);
gn.prototype.constructor = gn;
gn.prototype.toString = function(t) {
  return this.name + ": " + o0(this, t);
};
var Un = gn;
const sn = rt;
function Ro(e, t, r, n, i) {
  let s = "", o = "";
  const a = Math.floor(i / 2) - 1;
  return n - t > a && (s = " ... ", t = n - a + s.length), r - n > a && (o = " ...", r = n + a - o.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + s.length
    // relative position
  };
}
function Co(e, t) {
  return sn.repeat(" ", t - e.length) + e;
}
function Dg(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  const r = /\r?\n|\r|\0/g, n = [0], i = [];
  let s, o = -1;
  for (; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  let a = "";
  const u = Math.min(e.line + t.linesAfter, i.length).toString().length, p = t.maxLength - (t.indent + u + 3);
  for (let c = 1; c <= t.linesBefore && !(o - c < 0); c++) {
    const d = Ro(
      e.buffer,
      n[o - c],
      i[o - c],
      e.position - (n[o] - n[o - c]),
      p
    );
    a = sn.repeat(" ", t.indent) + Co((e.line - c + 1).toString(), u) + " | " + d.str + `
` + a;
  }
  const l = Ro(e.buffer, n[o], i[o], e.position, p);
  a += sn.repeat(" ", t.indent) + Co((e.line + 1).toString(), u) + " | " + l.str + `
`, a += sn.repeat("-", t.indent + u + 3 + l.pos) + `^
`;
  for (let c = 1; c <= t.linesAfter && !(o + c >= i.length); c++) {
    const d = Ro(
      e.buffer,
      n[o + c],
      i[o + c],
      e.position - (n[o] - n[o + c]),
      p
    );
    a += sn.repeat(" ", t.indent) + Co((e.line + c + 1).toString(), u) + " | " + d.str + `
`;
  }
  return a.replace(/\n$/, "");
}
var Pg = Dg;
const Uc = Un, Fg = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Ng = [
  "scalar",
  "sequence",
  "mapping"
];
function Ug(e) {
  const t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Lg(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Fg.indexOf(r) === -1)
      throw new Uc('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Ug(t.styleAliases || null), Ng.indexOf(this.kind) === -1)
    throw new Uc('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = Lg;
const Jr = Un, Io = Le;
function Lc(e, t) {
  const r = [];
  return e[t].forEach(function(n) {
    let i = r.length;
    r.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function Bg() {
  const e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  };
  function t(r) {
    r.multi ? (e.multi[r.kind].push(r), e.multi.fallback.push(r)) : e[r.kind][r.tag] = e.fallback[r.tag] = r;
  }
  for (let r = 0, n = arguments.length; r < n; r += 1)
    arguments[r].forEach(t);
  return e;
}
function ba(e) {
  return this.extend(e);
}
ba.prototype.extend = function(t) {
  let r = [], n = [];
  if (t instanceof Io)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Jr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof Io))
      throw new Jr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new Jr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new Jr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof Io))
      throw new Jr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  const i = Object.create(ba.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Lc(i, "implicit"), i.compiledExplicit = Lc(i, "explicit"), i.compiledTypeMap = Bg(i.compiledImplicit, i.compiledExplicit), i;
};
var a0 = ba;
const Mg = Le;
var l0 = new Mg("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
});
const kg = Le;
var c0 = new kg("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
});
const qg = Le;
var u0 = new qg("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
});
const jg = a0;
var f0 = new jg({
  explicit: [
    l0,
    c0,
    u0
  ]
});
const Hg = Le;
function Gg(e) {
  if (e === null) return !0;
  const t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Wg() {
  return null;
}
function Vg(e) {
  return e === null;
}
var d0 = new Hg("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Gg,
  construct: Wg,
  predicate: Vg,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
const zg = Le;
function Yg(e) {
  if (e === null) return !1;
  const t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Xg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Kg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var h0 = new zg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Yg,
  construct: Xg,
  predicate: Kg,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
const Jg = rt, Qg = Le;
function Zg(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function ey(e) {
  return e >= 48 && e <= 55;
}
function ty(e) {
  return e >= 48 && e <= 57;
}
function ry(e) {
  if (e === null) return !1;
  const t = e.length;
  let r = 0, n = !1;
  if (!t) return !1;
  let i = e[r];
  if ((i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++) {
        if (i = e[r], i !== "0" && i !== "1") return !1;
        n = !0;
      }
      return n && isFinite(on(e));
    }
    if (i === "x") {
      for (r++; r < t; r++) {
        if (!Zg(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(on(e));
    }
    if (i === "o") {
      for (r++; r < t; r++) {
        if (!ey(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(on(e));
    }
  }
  for (; r < t; r++) {
    if (!ty(e.charCodeAt(r)))
      return !1;
    n = !0;
  }
  return n ? isFinite(on(e)) : !1;
}
function on(e) {
  let t = e, r = 1, n = t[0];
  if ((n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function ny(e) {
  return on(e);
}
function iy(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Jg.isNegativeZero(e);
}
var p0 = new Qg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ry,
  construct: ny,
  predicate: iy,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
const _0 = rt, sy = Le, oy = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
), ay = new RegExp(
  "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function ly(e) {
  return e === null || !oy.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : ay.test(e);
}
function cy(e) {
  let t = e.toLowerCase();
  const r = t[0] === "-" ? -1 : 1;
  return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
const uy = /^[-+]?[0-9]+e/;
function fy(e, t) {
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (_0.isNegativeZero(e))
    return "-0.0";
  const r = e.toString(10);
  return uy.test(r) ? r.replace("e", ".e") : r;
}
function dy(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || _0.isNegativeZero(e));
}
var x0 = new sy("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: ly,
  construct: cy,
  predicate: dy,
  represent: fy,
  defaultStyle: "lowercase"
}), m0 = f0.extend({
  implicit: [
    d0,
    h0,
    p0,
    x0
  ]
}), g0 = m0;
const hy = Le, y0 = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), E0 = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function py(e) {
  return e === null ? !1 : y0.exec(e) !== null || E0.exec(e) !== null;
}
function _y(e) {
  let t = 0, r = null, n = y0.exec(e);
  if (n === null && (n = E0.exec(e)), n === null) throw new Error("Date resolve error");
  const i = +n[1], s = +n[2] - 1, o = +n[3];
  if (!n[4])
    return new Date(Date.UTC(i, s, o));
  const a = +n[4], u = +n[5], p = +n[6];
  if (n[7]) {
    for (t = n[7].slice(0, 3); t.length < 3; )
      t += "0";
    t = +t;
  }
  if (n[9]) {
    const c = +n[10], d = +(n[11] || 0);
    r = (c * 60 + d) * 6e4, n[9] === "-" && (r = -r);
  }
  const l = new Date(Date.UTC(i, s, o, a, u, p, t));
  return r && l.setTime(l.getTime() - r), l;
}
function xy(e) {
  return e.toISOString();
}
var b0 = new hy("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: py,
  construct: _y,
  instanceOf: Date,
  represent: xy
});
const my = Le;
function gy(e) {
  return e === "<<" || e === null;
}
var w0 = new my("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: gy
});
const yy = Le, Ja = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Ey(e) {
  if (e === null) return !1;
  let t = 0;
  const r = e.length, n = Ja;
  for (let i = 0; i < r; i++) {
    const s = n.indexOf(e.charAt(i));
    if (!(s > 64)) {
      if (s < 0) return !1;
      t += 6;
    }
  }
  return t % 8 === 0;
}
function by(e) {
  const t = e.replace(/[\r\n=]/g, ""), r = t.length, n = Ja;
  let i = 0;
  const s = [];
  for (let a = 0; a < r; a++)
    a % 4 === 0 && a && (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)), i = i << 6 | n.indexOf(t.charAt(a));
  const o = r % 4 * 6;
  return o === 0 ? (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)) : o === 18 ? (s.push(i >> 10 & 255), s.push(i >> 2 & 255)) : o === 12 && s.push(i >> 4 & 255), new Uint8Array(s);
}
function wy(e) {
  let t = "", r = 0;
  const n = e.length, i = Ja;
  for (let o = 0; o < n; o++)
    o % 3 === 0 && o && (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]), r = (r << 8) + e[o];
  const s = n % 3;
  return s === 0 ? (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]) : s === 2 ? (t += i[r >> 10 & 63], t += i[r >> 4 & 63], t += i[r << 2 & 63], t += i[64]) : s === 1 && (t += i[r >> 2 & 63], t += i[r << 4 & 63], t += i[64], t += i[64]), t;
}
function vy(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var v0 = new yy("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Ey,
  construct: by,
  predicate: vy,
  represent: wy
});
const Ry = Le, Bc = Object.prototype.hasOwnProperty, Cy = Object.prototype.toString;
function Iy(e) {
  if (e === null) return !0;
  const t = {}, r = e;
  for (let n = 0, i = r.length; n < i; n += 1) {
    const s = r[n];
    let o = !1;
    if (Cy.call(s) !== "[object Object]") return !1;
    let a;
    for (a in s)
      if (Bc.call(s, a))
        if (!o) o = !0;
        else return !1;
    if (!o || Bc.call(t, a)) return !1;
    Object.defineProperty(t, a, { value: !0 });
  }
  return !0;
}
function Ay(e) {
  return e !== null ? e : [];
}
var R0 = new Ry("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Iy,
  construct: Ay
});
const Ty = Le, Sy = Object.prototype.toString;
function $y(e) {
  if (e === null) return !0;
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n];
    if (Sy.call(s) !== "[object Object]") return !1;
    const o = Object.keys(s);
    if (o.length !== 1) return !1;
    r[n] = [o[0], s[o[0]]];
  }
  return !0;
}
function Oy(e) {
  if (e === null) return [];
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n], o = Object.keys(s);
    r[n] = [o[0], s[o[0]]];
  }
  return r;
}
var C0 = new Ty("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: $y,
  construct: Oy
});
const Dy = Le, Py = Object.prototype.hasOwnProperty;
function Fy(e) {
  if (e === null) return !0;
  const t = e;
  for (const r in t)
    if (Py.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function Ny(e) {
  return e !== null ? e : {};
}
var I0 = new Dy("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Fy,
  construct: Ny
}), Qa = g0.extend({
  implicit: [
    b0,
    w0
  ],
  explicit: [
    v0,
    R0,
    C0,
    I0
  ]
});
const Qt = rt, A0 = Un, Uy = Pg, Ly = Qa, tt = Object.prototype.hasOwnProperty, Ki = 1, T0 = 2, S0 = 3, Ji = 4, Ao = 1, By = 2, Mc = 3, My = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ky = /[\x85\u2028\u2029]/, qy = /[,\[\]{}]/, $0 = /^(?:!|!!|![0-9A-Za-z-]+!)$/, O0 = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
function kc(e) {
  return Object.prototype.toString.call(e);
}
function ut(e) {
  return e === 10 || e === 13;
}
function bt(e) {
  return e === 9 || e === 32;
}
function qe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function wr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function jy(e) {
  if (e >= 48 && e <= 57)
    return e - 48;
  const t = e | 32;
  return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function Hy(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Gy(e) {
  return e >= 48 && e <= 57 ? e - 48 : -1;
}
function qc(e) {
  switch (e) {
    case 48:
      return "\0";
    case 97:
      return "\x07";
    case 98:
      return "\b";
    case 116:
      return "	";
    case 9:
      return "	";
    case 110:
      return `
`;
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 114:
      return "\r";
    case 101:
      return "\x1B";
    case 32:
      return " ";
    case 34:
      return '"';
    case 47:
      return "/";
    case 92:
      return "\\";
    case 78:
      return "";
    case 95:
      return " ";
    case 76:
      return "\u2028";
    case 80:
      return "\u2029";
    default:
      return "";
  }
}
function Wy(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function D0(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
const P0 = new Array(256), F0 = new Array(256);
for (let e = 0; e < 256; e++)
  P0[e] = qc(e) ? 1 : 0, F0[e] = qc(e);
function Vy(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Ly, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
}
function N0(e, t) {
  const r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Uy(r), new A0(t, r);
}
function L(e, t) {
  throw N0(e, t);
}
function Qi(e, t) {
  e.onWarning && e.onWarning.call(null, N0(e, t));
}
function Zt(e, t, r) {
  const n = e.anchorMapTransactions;
  if (n.length !== 0) {
    const i = n[n.length - 1];
    tt.call(i, t) || (i[t] = {
      existed: tt.call(e.anchorMap, t),
      value: e.anchorMap[t]
    });
  }
  e.anchorMap[t] = r;
}
function zy(e) {
  e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
}
function Yy(e) {
  const t = e.anchorMapTransactions.pop(), r = e.anchorMapTransactions;
  if (r.length === 0) return;
  const n = r[r.length - 1], i = Object.keys(t);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    tt.call(n, a) || (n[a] = t[a]);
  }
}
function Xy(e) {
  const t = e.anchorMapTransactions.pop(), r = Object.keys(t);
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = t[r[n]];
    i.existed ? e.anchorMap[r[n]] = i.value : delete e.anchorMap[r[n]];
  }
}
function U0(e) {
  return {
    position: e.position,
    line: e.line,
    lineStart: e.lineStart,
    lineIndent: e.lineIndent,
    firstTabInLine: e.firstTabInLine,
    tag: e.tag,
    anchor: e.anchor,
    kind: e.kind,
    result: e.result
  };
}
function jc(e, t) {
  e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
}
const Hc = {
  YAML: function(t, r, n) {
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument");
    const i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
    i === null && L(t, "ill-formed argument of the YAML directive");
    const s = parseInt(i[1], 10), o = parseInt(i[2], 10);
    s !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && Qi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    let i;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments");
    const s = n[0];
    i = n[1], $0.test(s) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), tt.call(t.tagMap, s) && L(t, 'there is a previously declared suffix for "' + s + '" tag handle'), O0.test(i) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      i = decodeURIComponent(i);
    } catch {
      L(t, "tag prefix is malformed: " + i);
    }
    t.tagMap[s] = i;
  }
};
function Ut(e, t, r, n) {
  if (t < r) {
    const i = e.input.slice(t, r);
    if (n)
      for (let s = 0, o = i.length; s < o; s += 1) {
        const a = i.charCodeAt(s);
        a === 9 || a >= 32 && a <= 1114111 || L(e, "expected valid JSON character");
      }
    else My.test(i) && L(e, "the stream contains non-printable characters");
    e.result += i;
  }
}
function Gc(e) {
  e.totalMergeKeys++, e.maxTotalMergeKeys !== -1 && e.totalMergeKeys > e.maxTotalMergeKeys && L(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")");
}
function Wc(e, t, r, n) {
  Qt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), Gc(e);
  const i = Object.keys(r);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    Gc(e), tt.call(t, a) || (D0(t, a, r[a]), n[a] = !0);
  }
}
function vr(e, t, r, n, i, s, o, a, u) {
  if (Array.isArray(i)) {
    i = Array.prototype.slice.call(i);
    for (let p = 0, l = i.length; p < l; p += 1)
      Array.isArray(i[p]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && kc(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  }
  if (typeof i == "object" && kc(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s)) {
      s.length > 100 && L(e, "abnormal merge sequence size");
      for (let p = 0, l = s.length; p < l; p += 1)
        Wc(e, t, s[p], r);
    } else
      Wc(e, t, s, r);
  else
    !e.json && !tt.call(r, i) && tt.call(t, i) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = u || e.position, L(e, "duplicated mapping key")), D0(t, i, s), delete r[i];
  return t;
}
function Za(e) {
  const t = e.input.charCodeAt(e.position);
  t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function he(e, t, r) {
  let n = 0, i = e.input.charCodeAt(e.position);
  for (; i !== 0; ) {
    for (; bt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (ut(i))
      for (Za(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Qi(e, "deficient indentation"), n;
}
function ws(e) {
  let t = e.position, r = e.input.charCodeAt(t);
  return !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || qe(r)));
}
function el(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Qt.repeat(`
`, t - 1));
}
function Ky(e, t, r) {
  let n, i, s, o, a, u;
  const p = e.kind, l = e.result;
  let c = e.input.charCodeAt(e.position);
  if (qe(c) || wr(c) || c === 35 || c === 38 || c === 42 || c === 33 || c === 124 || c === 62 || c === 39 || c === 34 || c === 37 || c === 64 || c === 96)
    return !1;
  if (c === 63 || c === 45) {
    const d = e.input.charCodeAt(e.position + 1);
    if (qe(d) || r && wr(d))
      return !1;
  }
  for (e.kind = "scalar", e.result = "", n = i = e.position, s = !1; c !== 0; ) {
    if (c === 58) {
      const d = e.input.charCodeAt(e.position + 1);
      if (qe(d) || r && wr(d))
        break;
    } else if (c === 35) {
      const d = e.input.charCodeAt(e.position - 1);
      if (qe(d))
        break;
    } else {
      if (e.position === e.lineStart && ws(e) || r && wr(c))
        break;
      if (ut(c))
        if (o = e.line, a = e.lineStart, u = e.lineIndent, he(e, !1, -1), e.lineIndent >= t) {
          s = !0, c = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = i, e.line = o, e.lineStart = a, e.lineIndent = u;
          break;
        }
    }
    s && (Ut(e, n, i, !1), el(e, e.line - o), n = i = e.position, s = !1), bt(c) || (i = e.position + 1), c = e.input.charCodeAt(++e.position);
  }
  return Ut(e, n, i, !1), e.result ? !0 : (e.kind = p, e.result = l, !1);
}
function Jy(e, t) {
  let r, n, i = e.input.charCodeAt(e.position);
  if (i !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (i = e.input.charCodeAt(e.position)) !== 0; )
    if (i === 39)
      if (Ut(e, r, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39)
        r = e.position, e.position++, n = e.position;
      else
        return !0;
    else ut(i) ? (Ut(e, r, n, !0), el(e, he(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ws(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, bt(i) || (n = e.position));
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function Qy(e, t) {
  let r, n, i, s = e.input.charCodeAt(e.position);
  if (s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Ut(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Ut(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), ut(s))
        he(e, !1, t);
      else if (s < 256 && P0[s])
        e.result += F0[s], e.position++;
      else if ((i = Hy(s)) > 0) {
        let o = i, a = 0;
        for (; o > 0; o--)
          s = e.input.charCodeAt(++e.position), (i = jy(s)) >= 0 ? a = (a << 4) + i : L(e, "expected hexadecimal character");
        e.result += Wy(a), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else ut(s) ? (Ut(e, r, n, !0), el(e, he(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ws(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, bt(s) || (n = e.position));
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function Zy(e, t) {
  let r = !0, n, i, s;
  const o = e.tag;
  let a;
  const u = e.anchor;
  let p, l, c, d;
  const _ = /* @__PURE__ */ Object.create(null);
  let m, g, y, v = e.input.charCodeAt(e.position);
  if (v === 91)
    p = 93, d = !1, a = [];
  else if (v === 123)
    p = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && Zt(e, e.anchor, a), v = e.input.charCodeAt(++e.position); v !== 0; ) {
    if (he(e, !0, t), v = e.input.charCodeAt(e.position), v === p)
      return e.position++, e.tag = o, e.anchor = u, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    if (r ? v === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), g = m = y = null, l = c = !1, v === 63) {
      const C = e.input.charCodeAt(e.position + 1);
      qe(C) && (l = c = !0, e.position++, he(e, !0, t));
    }
    n = e.line, i = e.lineStart, s = e.position, Dr(e, t, Ki, !1, !0), g = e.tag, m = e.result, he(e, !0, t), v = e.input.charCodeAt(e.position), (c || e.line === n) && v === 58 && (l = !0, v = e.input.charCodeAt(++e.position), he(e, !0, t), Dr(e, t, Ki, !1, !0), y = e.result), d ? vr(e, a, _, g, m, y, n, i, s) : l ? a.push(vr(e, null, _, g, m, y, n, i, s)) : a.push(m), he(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (r = !0, v = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function e1(e, t) {
  let r, n = Ao, i = !1, s = !1, o = t, a = 0, u = !1, p, l = e.input.charCodeAt(e.position);
  if (l === 124)
    r = !1;
  else if (l === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; l !== 0; )
    if (l = e.input.charCodeAt(++e.position), l === 43 || l === 45)
      Ao === n ? n = l === 43 ? Mc : By : L(e, "repeat of a chomping mode identifier");
    else if ((p = Gy(l)) >= 0)
      p === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? L(e, "repeat of an indentation width identifier") : (o = t + p - 1, s = !0);
    else
      break;
  if (bt(l)) {
    do
      l = e.input.charCodeAt(++e.position);
    while (bt(l));
    if (l === 35)
      do
        l = e.input.charCodeAt(++e.position);
      while (!ut(l) && l !== 0);
  }
  for (; l !== 0; ) {
    for (Za(e), e.lineIndent = 0, l = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && l === 32; )
      e.lineIndent++, l = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), ut(l)) {
      a++;
      continue;
    }
    if (!s && o === 0 && L(e, "missing indentation for block scalar"), e.lineIndent < o) {
      n === Mc ? e.result += Qt.repeat(`
`, i ? 1 + a : a) : n === Ao && i && (e.result += `
`);
      break;
    }
    r ? bt(l) ? (u = !0, e.result += Qt.repeat(`
`, i ? 1 + a : a)) : u ? (u = !1, e.result += Qt.repeat(`
`, a + 1)) : a === 0 ? i && (e.result += " ") : e.result += Qt.repeat(`
`, a) : e.result += Qt.repeat(`
`, i ? 1 + a : a), i = !0, s = !0, a = 0;
    const c = e.position;
    for (; !ut(l) && l !== 0; )
      l = e.input.charCodeAt(++e.position);
    Ut(e, c, e.position, !1);
  }
  return !0;
}
function Vc(e, t) {
  const r = e.tag, n = e.anchor, i = [];
  let s = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && Zt(e, e.anchor, i);
  let o = e.input.charCodeAt(e.position);
  for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), o === 45); ) {
    const a = e.input.charCodeAt(e.position + 1);
    if (!qe(a))
      break;
    if (s = !0, e.position++, he(e, !0, -1) && e.lineIndent <= t) {
      i.push(null), o = e.input.charCodeAt(e.position);
      continue;
    }
    const u = e.line;
    if (Dr(e, t, S0, !1, !0), i.push(e.result), he(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === u || e.lineIndent > t) && o !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = n, e.kind = "sequence", e.result = i, !0) : !1;
}
function L0(e, t, r) {
  let n, i, s, o;
  const a = e.tag, u = e.anchor, p = {}, l = /* @__PURE__ */ Object.create(null);
  let c = null, d = null, _ = null, m = !1, g = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && Zt(e, e.anchor, p);
  let y = e.input.charCodeAt(e.position);
  for (; y !== 0; ) {
    !m && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation"));
    const v = e.input.charCodeAt(e.position + 1), C = e.line;
    if ((y === 63 || y === 58) && qe(v))
      y === 63 ? (m && (vr(e, p, l, c, d, null, i, s, o), c = d = _ = null), g = !0, m = !0, n = !0) : m ? (m = !1, n = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = v;
    else {
      if (i = e.line, s = e.lineStart, o = e.position, !Dr(e, r, T0, !1, !0))
        break;
      if (e.line === C) {
        for (y = e.input.charCodeAt(e.position); bt(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), qe(y) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), m && (vr(e, p, l, c, d, null, i, s, o), c = d = _ = null), g = !0, m = !1, n = !1, c = e.tag, d = e.result;
        else if (g)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = a, e.anchor = u, !0;
      } else if (g)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = a, e.anchor = u, !0;
    }
    if ((e.line === C || e.lineIndent > t) && (m && (i = e.line, s = e.lineStart, o = e.position), Dr(e, t, Ji, !0, n) && (m ? d = e.result : _ = e.result), m || (vr(e, p, l, c, d, _, i, s, o), c = d = _ = null), he(e, !0, -1), y = e.input.charCodeAt(e.position)), (e.line === C || e.lineIndent > t) && y !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return m && vr(e, p, l, c, d, null, i, s, o), g && (e.tag = a, e.anchor = u, e.kind = "mapping", e.result = p), g;
}
function t1(e) {
  let t = !1, r = !1, n, i, s = e.input.charCodeAt(e.position);
  if (s !== 33) return !1;
  e.tag !== null && L(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (t = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, n = "!!", s = e.input.charCodeAt(++e.position)) : n = "!";
  let o = e.position;
  if (t) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (i = e.input.slice(o, e.position), s = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !qe(s); )
      s === 33 && (r ? L(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(o - 1, e.position + 1), $0.test(n) || L(e, "named tag handle cannot contain such characters"), r = !0, o = e.position + 1)), s = e.input.charCodeAt(++e.position);
    i = e.input.slice(o, e.position), qy.test(i) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  i && !O0.test(i) && L(e, "tag name cannot contain such characters: " + i);
  try {
    i = decodeURIComponent(i);
  } catch {
    L(e, "tag name is malformed: " + i);
  }
  return t ? e.tag = i : tt.call(e.tagMap, n) ? e.tag = e.tagMap[n] + i : n === "!" ? e.tag = "!" + i : n === "!!" ? e.tag = "tag:yaml.org,2002:" + i : L(e, 'undeclared tag handle "' + n + '"'), !0;
}
function r1(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 38) return !1;
  e.anchor !== null && L(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
  const r = e.position;
  for (; t !== 0 && !qe(t) && !wr(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function n1(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 42) return !1;
  t = e.input.charCodeAt(++e.position);
  const r = e.position;
  for (; t !== 0 && !qe(t) && !wr(t); )
    t = e.input.charCodeAt(++e.position);
  e.position === r && L(e, "name of an alias node must contain at least one character");
  const n = e.input.slice(r, e.position);
  return tt.call(e.anchorMap, n) || L(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], he(e, !0, -1), !0;
}
function i1(e, t, r, n) {
  const i = U0(e);
  return zy(e), jc(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, L0(e, r, n) && e.kind === "mapping" ? (Yy(e), !0) : (Xy(e), jc(e, i), !1);
}
function Dr(e, t, r, n, i) {
  let s, o, a = 1, u = !1, p = !1, l = null, c, d, _;
  e.depth >= e.maxDepth && L(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
  const m = s = o = Ji === r || S0 === r;
  if (n && he(e, !0, -1) && (u = !0, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)), a === 1)
    for (; ; ) {
      const g = e.input.charCodeAt(e.position), y = U0(e);
      if (u && (g === 33 && e.tag !== null || g === 38 && e.anchor !== null) || !t1(e) && !r1(e))
        break;
      l === null && (l = y), he(e, !0, -1) ? (u = !0, o = m, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)) : o = !1;
    }
  if (o && (o = u || i), a === 1 || Ji === r)
    if (Ki === r || T0 === r ? d = t : d = t + 1, _ = e.position - e.lineStart, a === 1)
      if (o && (Vc(e, _) || L0(e, _, d)) || Zy(e, d))
        p = !0;
      else {
        const g = e.input.charCodeAt(e.position);
        l !== null && m && !o && g !== 124 && g !== 62 && i1(
          e,
          l,
          l.position - l.lineStart,
          d
        ) || s && e1(e, d) || Jy(e, d) || Qy(e, d) ? p = !0 : n1(e) ? (p = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Ky(e, d, Ki === r) && (p = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && Zt(e, e.anchor, e.result);
      }
    else a === 0 && (p = o && Vc(e, _));
  if (e.tag === null)
    e.anchor !== null && Zt(e, e.anchor, e.result);
  else if (e.tag === "?") {
    e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
    for (let g = 0, y = e.implicitTypes.length; g < y; g += 1)
      if (c = e.implicitTypes[g], c.resolve(e.result)) {
        e.result = c.construct(e.result), e.tag = c.tag, e.anchor !== null && Zt(e, e.anchor, e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (tt.call(e.typeMap[e.kind || "fallback"], e.tag))
      c = e.typeMap[e.kind || "fallback"][e.tag];
    else {
      c = null;
      const g = e.typeMap.multi[e.kind || "fallback"];
      for (let y = 0, v = g.length; y < v; y += 1)
        if (e.tag.slice(0, g[y].tag.length) === g[y].tag) {
          c = g[y];
          break;
        }
    }
    c || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && c.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + c.kind + '", not "' + e.kind + '"'), c.resolve(e.result, e.tag) ? (e.result = c.construct(e.result, e.tag), e.anchor !== null && Zt(e, e.anchor, e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || p;
}
function s1(e) {
  const t = e.position;
  let r = !1, n;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (n = e.input.charCodeAt(e.position)) !== 0 && (he(e, !0, -1), n = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || n !== 37)); ) {
    r = !0, n = e.input.charCodeAt(++e.position);
    let i = e.position;
    for (; n !== 0 && !qe(n); )
      n = e.input.charCodeAt(++e.position);
    const s = e.input.slice(i, e.position), o = [];
    for (s.length < 1 && L(e, "directive name must not be less than one character in length"); n !== 0; ) {
      for (; bt(n); )
        n = e.input.charCodeAt(++e.position);
      if (n === 35) {
        do
          n = e.input.charCodeAt(++e.position);
        while (n !== 0 && !ut(n));
        break;
      }
      if (ut(n)) break;
      for (i = e.position; n !== 0 && !qe(n); )
        n = e.input.charCodeAt(++e.position);
      o.push(e.input.slice(i, e.position));
    }
    n !== 0 && Za(e), tt.call(Hc, s) ? Hc[s](e, s, o) : Qi(e, 'unknown document directive "' + s + '"');
  }
  if (he(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, he(e, !0, -1)) : r && L(e, "directives end mark is expected"), Dr(e, e.lineIndent - 1, Ji, !1, !0), he(e, !0, -1), e.checkLineBreaks && ky.test(e.input.slice(t, e.position)) && Qi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ws(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, he(e, !0, -1));
    return;
  }
  e.position < e.length - 1 && L(e, "end of the stream or a document separator is expected");
}
function B0(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  const r = new Vy(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    s1(r);
  return r.documents;
}
function o1(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  const n = B0(e, r);
  if (typeof t != "function")
    return n;
  for (let i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function a1(e, t) {
  const r = B0(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new A0("expected a single document in the stream, but found more");
  }
}
Ka.loadAll = o1;
Ka.load = a1;
var M0 = {};
const vs = rt, Ln = Un, l1 = Qa, k0 = Object.prototype.toString, q0 = Object.prototype.hasOwnProperty, tl = 65279, c1 = 9, yn = 10, u1 = 13, f1 = 32, d1 = 33, h1 = 34, wa = 35, p1 = 37, _1 = 38, x1 = 39, m1 = 42, j0 = 44, g1 = 45, Zi = 58, y1 = 61, E1 = 62, b1 = 63, w1 = 64, H0 = 91, G0 = 93, v1 = 96, W0 = 123, R1 = 124, V0 = 125, Oe = {};
Oe[0] = "\\0";
Oe[7] = "\\a";
Oe[8] = "\\b";
Oe[9] = "\\t";
Oe[10] = "\\n";
Oe[11] = "\\v";
Oe[12] = "\\f";
Oe[13] = "\\r";
Oe[27] = "\\e";
Oe[34] = '\\"';
Oe[92] = "\\\\";
Oe[133] = "\\N";
Oe[160] = "\\_";
Oe[8232] = "\\L";
Oe[8233] = "\\P";
const C1 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], I1 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function A1(e, t) {
  if (t === null) return {};
  const r = {}, n = Object.keys(t);
  for (let i = 0, s = n.length; i < s; i += 1) {
    let o = n[i], a = String(t[o]);
    o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2));
    const u = e.compiledTypeMap.fallback[o];
    u && q0.call(u.styleAliases, a) && (a = u.styleAliases[a]), r[o] = a;
  }
  return r;
}
function T1(e) {
  let t, r;
  const n = e.toString(16).toUpperCase();
  if (e <= 255)
    t = "x", r = 2;
  else if (e <= 65535)
    t = "u", r = 4;
  else if (e <= 4294967295)
    t = "U", r = 8;
  else
    throw new Ln("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + vs.repeat("0", r - n.length) + n;
}
const S1 = 1, En = 2;
function $1(e) {
  this.schema = e.schema || l1, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = vs.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = A1(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? En : S1, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function zc(e, t) {
  const r = vs.repeat(" ", t);
  let n = 0, i = "";
  const s = e.length;
  for (; n < s; ) {
    let o;
    const a = e.indexOf(`
`, n);
    a === -1 ? (o = e.slice(n), n = s) : (o = e.slice(n, a + 1), n = a + 1), o.length && o !== `
` && (i += r), i += o;
  }
  return i;
}
function va(e, t) {
  return `
` + vs.repeat(" ", e.indent * t);
}
function O1(e, t) {
  for (let r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (e.implicitTypes[r].resolve(t))
      return !0;
  return !1;
}
function es(e) {
  return e === f1 || e === c1;
}
function bn(e) {
  return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== tl || e >= 65536 && e <= 1114111;
}
function Yc(e) {
  return bn(e) && e !== tl && // - b-char
  e !== u1 && e !== yn;
}
function Xc(e, t, r) {
  const n = Yc(e), i = n && !es(e);
  return (
    // ns-plain-safe
    (r ? n : n && // - c-flow-indicator
    e !== j0 && e !== H0 && e !== G0 && e !== W0 && e !== V0) && // ns-plain-char
    e !== wa && // false on '#'
    !(t === Zi && !i) || // false on ': '
    Yc(t) && !es(t) && e === wa || // change to true on '[^ ]#'
    t === Zi && i
  );
}
function D1(e) {
  return bn(e) && e !== tl && !es(e) && // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  e !== g1 && e !== b1 && e !== Zi && e !== j0 && e !== H0 && e !== G0 && e !== W0 && e !== V0 && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  e !== wa && e !== _1 && e !== m1 && e !== d1 && e !== R1 && e !== y1 && e !== E1 && e !== x1 && e !== h1 && // | “%” | “@” | “`”)
  e !== p1 && e !== w1 && e !== v1;
}
function P1(e) {
  return !es(e) && e !== Zi;
}
function an(e, t) {
  const r = e.charCodeAt(t);
  let n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function z0(e) {
  return /^\n* /.test(e);
}
const Y0 = 1, Ra = 2, X0 = 3, K0 = 4, yr = 5;
function F1(e, t, r, n, i, s, o, a) {
  let u, p = 0, l = null, c = !1, d = !1;
  const _ = n !== -1;
  let m = -1, g = D1(an(e, 0)) && P1(an(e, e.length - 1));
  if (t || o)
    for (u = 0; u < e.length; p >= 65536 ? u += 2 : u++) {
      if (p = an(e, u), !bn(p))
        return yr;
      g = g && Xc(p, l, a), l = p;
    }
  else {
    for (u = 0; u < e.length; p >= 65536 ? u += 2 : u++) {
      if (p = an(e, u), p === yn)
        c = !0, _ && (d = d || // Foldable line = too long, and not more-indented.
        u - m - 1 > n && e[m + 1] !== " ", m = u);
      else if (!bn(p))
        return yr;
      g = g && Xc(p, l, a), l = p;
    }
    d = d || _ && u - m - 1 > n && e[m + 1] !== " ";
  }
  return !c && !d ? g && !o && !i(e) ? Y0 : s === En ? yr : Ra : r > 9 && z0(e) ? yr : o ? s === En ? yr : Ra : d ? K0 : X0;
}
function N1(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === En ? '""' : "''";
    if (!e.noCompatMode && (C1.indexOf(t) !== -1 || I1.test(t)))
      return e.quotingType === En ? '"' + t + '"' : "'" + t + "'";
    const s = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || // No block styles in flow mode.
    e.flowLevel > -1 && r >= e.flowLevel;
    function u(p) {
      return O1(e, p);
    }
    switch (F1(
      t,
      a,
      e.indent,
      o,
      u,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Y0:
        return t;
      case Ra:
        return "'" + t.replace(/'/g, "''") + "'";
      case X0:
        return "|" + Kc(t, e.indent) + Jc(zc(t, s));
      case K0:
        return ">" + Kc(t, e.indent) + Jc(zc(U1(t, o), s));
      case yr:
        return '"' + L1(t) + '"';
      default:
        throw new Ln("impossible error: invalid scalar style");
    }
  }();
}
function Kc(e, t) {
  const r = z0(e) ? String(t) : "", n = e[e.length - 1] === `
`, s = n && (e[e.length - 2] === `
` || e === `
`) ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function Jc(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function U1(e, t) {
  const r = /(\n+)([^\n]*)/g;
  let n = function() {
    let a = e.indexOf(`
`);
    return a = a !== -1 ? a : e.length, r.lastIndex = a, Qc(e.slice(0, a), t);
  }(), i = e[0] === `
` || e[0] === " ", s, o;
  for (; o = r.exec(e); ) {
    const a = o[1], u = o[2];
    s = u[0] === " ", n += a + (!i && !s && u !== "" ? `
` : "") + Qc(u, t), i = s;
  }
  return n;
}
function Qc(e, t) {
  if (e === "" || e[0] === " ") return e;
  const r = / [^ ]/g;
  let n, i = 0, s, o = 0, a = 0, u = "";
  for (; n = r.exec(e); )
    a = n.index, a - i > t && (s = o > i ? o : a, u += `
` + e.slice(i, s), i = s + 1), o = a;
  return u += `
`, e.length - i > t && o > i ? u += e.slice(i, o) + `
` + e.slice(o + 1) : u += e.slice(i), u.slice(1);
}
function L1(e) {
  let t = "", r = 0;
  for (let n = 0; n < e.length; r >= 65536 ? n += 2 : n++) {
    r = an(e, n);
    const i = Oe[r];
    !i && bn(r) ? (t += e[n], r >= 65536 && (t += e[n + 1])) : t += i || T1(r);
  }
  return t;
}
function B1(e, t, r) {
  let n = "";
  const i = e.tag;
  for (let s = 0, o = r.length; s < o; s += 1) {
    let a = r[s];
    e.replacer && (a = e.replacer.call(r, String(s), a)), (wt(e, t, a, !1, !1) || typeof a > "u" && wt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  }
  e.tag = i, e.dump = "[" + n + "]";
}
function Zc(e, t, r, n) {
  let i = "";
  const s = e.tag;
  for (let o = 0, a = r.length; o < a; o += 1) {
    let u = r[o];
    e.replacer && (u = e.replacer.call(r, String(o), u)), (wt(e, t + 1, u, !0, !0, !1, !0) || typeof u > "u" && wt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += va(e, t)), e.dump && yn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  }
  e.tag = s, e.dump = i || "[]";
}
function M1(e, t, r) {
  let n = "";
  const i = e.tag, s = Object.keys(r);
  for (let o = 0, a = s.length; o < a; o += 1) {
    let u = "";
    n !== "" && (u += ", "), e.condenseFlow && (u += '"');
    const p = s[o];
    let l = r[p];
    e.replacer && (l = e.replacer.call(r, p, l)), wt(e, t, p, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), wt(e, t, l, !1, !1) && (u += e.dump, n += u));
  }
  e.tag = i, e.dump = "{" + n + "}";
}
function k1(e, t, r, n) {
  let i = "";
  const s = e.tag, o = Object.keys(r);
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Ln("sortKeys must be a boolean or a function");
  for (let a = 0, u = o.length; a < u; a += 1) {
    let p = "";
    (!n || i !== "") && (p += va(e, t));
    const l = o[a];
    let c = r[l];
    if (e.replacer && (c = e.replacer.call(r, l, c)), !wt(e, t + 1, l, !0, !0, !0))
      continue;
    const d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
    d && (e.dump && yn === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, d && (p += va(e, t)), wt(e, t + 1, c, !0, d) && (e.dump && yn === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p);
  }
  e.tag = s, e.dump = i || "{}";
}
function eu(e, t, r) {
  const n = r ? e.explicitTypes : e.implicitTypes;
  for (let i = 0, s = n.length; i < s; i += 1) {
    const o = n[i];
    if ((o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        const a = e.styleMap[o.tag] || o.defaultStyle;
        let u;
        if (k0.call(o.represent) === "[object Function]")
          u = o.represent(t, a);
        else if (q0.call(o.represent, a))
          u = o.represent[a](t, a);
        else
          throw new Ln("!<" + o.tag + '> tag resolver accepts not "' + a + '" style');
        e.dump = u;
      }
      return !0;
    }
  }
  return !1;
}
function wt(e, t, r, n, i, s, o) {
  e.tag = null, e.dump = r, eu(e, r, !1) || eu(e, r, !0);
  const a = k0.call(e.dump), u = n;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  const p = a === "[object Object]" || a === "[object Array]";
  let l, c;
  if (p && (l = e.duplicates.indexOf(r), c = l !== -1), (e.tag !== null && e.tag !== "?" || c || e.indent !== 2 && t > 0) && (i = !1), c && e.usedDuplicates[l])
    e.dump = "*ref_" + l;
  else {
    if (p && c && !e.usedDuplicates[l] && (e.usedDuplicates[l] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (k1(e, t, e.dump, i), c && (e.dump = "&ref_" + l + e.dump)) : (M1(e, t, e.dump), c && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? Zc(e, t - 1, e.dump, i) : Zc(e, t, e.dump, i), c && (e.dump = "&ref_" + l + e.dump)) : (B1(e, t, e.dump), c && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && N1(e, e.dump, t, s, u);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Ln("unacceptable kind of an object to dump " + a);
    }
    if (e.tag !== null && e.tag !== "?") {
      let d = encodeURI(
        e.tag[0] === "!" ? e.tag.slice(1) : e.tag
      ).replace(/!/g, "%21");
      e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump;
    }
  }
  return !0;
}
function q1(e, t) {
  const r = [], n = [];
  Ca(e, r, n);
  const i = n.length;
  for (let s = 0; s < i; s += 1)
    t.duplicates.push(r[n[s]]);
  t.usedDuplicates = new Array(i);
}
function Ca(e, t, r) {
  if (e !== null && typeof e == "object") {
    const n = t.indexOf(e);
    if (n !== -1)
      r.indexOf(n) === -1 && r.push(n);
    else if (t.push(e), Array.isArray(e))
      for (let i = 0, s = e.length; i < s; i += 1)
        Ca(e[i], t, r);
    else {
      const i = Object.keys(e);
      for (let s = 0, o = i.length; s < o; s += 1)
        Ca(e[i[s]], t, r);
    }
  }
}
function j1(e, t) {
  t = t || {};
  const r = new $1(t);
  r.noRefs || q1(e, r);
  let n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), wt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
M0.dump = j1;
const J0 = Ka, H1 = M0;
function rl(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Ce.Type = Le;
Ce.Schema = a0;
Ce.FAILSAFE_SCHEMA = f0;
Ce.JSON_SCHEMA = m0;
Ce.CORE_SCHEMA = g0;
Ce.DEFAULT_SCHEMA = Qa;
Ce.load = J0.load;
Ce.loadAll = J0.loadAll;
Ce.dump = H1.dump;
Ce.YAMLException = Un;
Ce.types = {
  binary: v0,
  float: x0,
  map: u0,
  null: d0,
  pairs: C0,
  set: I0,
  timestamp: b0,
  bool: h0,
  int: p0,
  merge: w0,
  omap: R0,
  seq: c0,
  str: l0
};
Ce.safeLoad = rl("safeLoad", "load");
Ce.safeLoadAll = rl("safeLoadAll", "loadAll");
Ce.safeDump = rl("safeDump", "dump");
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
Rs.Lazy = void 0;
class G1 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Rs.Lazy = G1;
var Ia = { exports: {} };
const W1 = "2.0.0", Q0 = 256, V1 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, z1 = 16, Y1 = Q0 - 6, X1 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Cs = {
  MAX_LENGTH: Q0,
  MAX_SAFE_COMPONENT_LENGTH: z1,
  MAX_SAFE_BUILD_LENGTH: Y1,
  MAX_SAFE_INTEGER: V1,
  RELEASE_TYPES: X1,
  SEMVER_SPEC_VERSION: W1,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const K1 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Is = K1;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Cs, s = Is;
  t = e.exports = {};
  const o = t.re = [], a = t.safeRe = [], u = t.src = [], p = t.safeSrc = [], l = t.t = {};
  let c = 0;
  const d = "[a-zA-Z0-9-]", _ = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], m = (y) => {
    for (const [v, C] of _)
      y = y.split(`${v}*`).join(`${v}{0,${C}}`).split(`${v}+`).join(`${v}{1,${C}}`);
    return y;
  }, g = (y, v, C) => {
    const D = m(v), B = c++;
    s(y, B, v), l[y] = B, u[B] = v, p[B] = D, o[B] = new RegExp(v, C ? "g" : void 0), a[B] = new RegExp(D, C ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), g("MAINVERSION", `(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})\\.(${u[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})\\.(${u[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${u[l.NONNUMERICIDENTIFIER]}|${u[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${u[l.PRERELEASEIDENTIFIER]}(?:\\.${u[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${u[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${d}+`), g("BUILD", `(?:\\+(${u[l.BUILDIDENTIFIER]}(?:\\.${u[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${u[l.MAINVERSION]}${u[l.PRERELEASE]}?${u[l.BUILD]}?`), g("FULL", `^${u[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${u[l.MAINVERSIONLOOSE]}${u[l.PRERELEASELOOSE]}?${u[l.BUILD]}?`), g("LOOSE", `^${u[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${u[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${u[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:\\.(${u[l.XRANGEIDENTIFIER]})(?:${u[l.PRERELEASE]})?${u[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[l.XRANGEIDENTIFIERLOOSE]})(?:${u[l.PRERELEASELOOSE]})?${u[l.BUILD]}?)?)?`), g("XRANGE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${u[l.GTLT]}\\s*${u[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${u[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", u[l.COERCEPLAIN] + `(?:${u[l.PRERELEASE]})?(?:${u[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", u[l.COERCE], !0), g("COERCERTLFULL", u[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${u[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${u[l.LONETILDE]}${u[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${u[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${u[l.LONECARET]}${u[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${u[l.LONECARET]}${u[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${u[l.GTLT]}\\s*(${u[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${u[l.GTLT]}\\s*(${u[l.LOOSEPLAIN]}|${u[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${u[l.XRANGEPLAIN]})\\s+-\\s+(${u[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${u[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${u[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ia, Ia.exports);
var Bn = Ia.exports;
const J1 = Object.freeze({ loose: !0 }), Q1 = Object.freeze({}), Z1 = (e) => e ? typeof e != "object" ? J1 : e : Q1;
var nl = Z1;
const tu = /^[0-9]+$/, Z0 = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = tu.test(e), n = tu.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, eE = (e, t) => Z0(t, e);
var eh = {
  compareIdentifiers: Z0,
  rcompareIdentifiers: eE
};
const vi = Is, { MAX_LENGTH: ru, MAX_SAFE_INTEGER: Ri } = Cs, { safeRe: Ci, t: Ii } = Bn, tE = nl, { compareIdentifiers: To } = eh;
let rE = class lt {
  constructor(t, r) {
    if (r = tE(r), t instanceof lt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ru)
      throw new TypeError(
        `version is longer than ${ru} characters`
      );
    vi("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ci[Ii.LOOSE] : Ci[Ii.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ri || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ri || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ri || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < Ri)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (vi("SemVer.compare", this.version, this.options, t), !(t instanceof lt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new lt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof lt || (t = new lt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof lt || (t = new lt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (vi("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return To(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof lt || (t = new lt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (vi("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return To(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ci[Ii.PRERELEASELOOSE] : Ci[Ii.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), To(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Be = rE;
const nu = Be, nE = (e, t, r = !1) => {
  if (e instanceof nu)
    return e;
  try {
    return new nu(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Nr = nE;
const iE = Nr, sE = (e, t) => {
  const r = iE(e, t);
  return r ? r.version : null;
};
var oE = sE;
const aE = Nr, lE = (e, t) => {
  const r = aE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var cE = lE;
const iu = Be, uE = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new iu(
      e instanceof iu ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var fE = uE;
const su = Nr, dE = (e, t) => {
  const r = su(e, null, !0), n = su(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, o = s ? r : n, a = s ? n : r, u = !!o.prerelease.length;
  if (!!a.prerelease.length && !u) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(o) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const l = u ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var hE = dE;
const pE = Be, _E = (e, t) => new pE(e, t).major;
var xE = _E;
const mE = Be, gE = (e, t) => new mE(e, t).minor;
var yE = gE;
const EE = Be, bE = (e, t) => new EE(e, t).patch;
var wE = bE;
const vE = Nr, RE = (e, t) => {
  const r = vE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var CE = RE;
const ou = Be, IE = (e, t, r) => new ou(e, r).compare(new ou(t, r));
var nt = IE;
const AE = nt, TE = (e, t, r) => AE(t, e, r);
var SE = TE;
const $E = nt, OE = (e, t) => $E(e, t, !0);
var DE = OE;
const au = Be, PE = (e, t, r) => {
  const n = new au(e, r), i = new au(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var il = PE;
const FE = il, NE = (e, t) => e.sort((r, n) => FE(r, n, t));
var UE = NE;
const LE = il, BE = (e, t) => e.sort((r, n) => LE(n, r, t));
var ME = BE;
const kE = nt, qE = (e, t, r) => kE(e, t, r) > 0;
var As = qE;
const jE = nt, HE = (e, t, r) => jE(e, t, r) < 0;
var sl = HE;
const GE = nt, WE = (e, t, r) => GE(e, t, r) === 0;
var th = WE;
const VE = nt, zE = (e, t, r) => VE(e, t, r) !== 0;
var rh = zE;
const YE = nt, XE = (e, t, r) => YE(e, t, r) >= 0;
var ol = XE;
const KE = nt, JE = (e, t, r) => KE(e, t, r) <= 0;
var al = JE;
const QE = th, ZE = rh, eb = As, tb = ol, rb = sl, nb = al, ib = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return QE(e, r, n);
    case "!=":
      return ZE(e, r, n);
    case ">":
      return eb(e, r, n);
    case ">=":
      return tb(e, r, n);
    case "<":
      return rb(e, r, n);
    case "<=":
      return nb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var nh = ib;
const sb = Be, ob = Nr, { safeRe: Ai, t: Ti } = Bn, ab = (e, t) => {
  if (e instanceof sb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ai[Ti.COERCEFULL] : Ai[Ti.COERCE]);
  else {
    const u = t.includePrerelease ? Ai[Ti.COERCERTLFULL] : Ai[Ti.COERCERTL];
    let p;
    for (; (p = u.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || p.index + p[0].length !== r.index + r[0].length) && (r = p), u.lastIndex = p.index + p[1].length + p[2].length;
    u.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", a = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ob(`${n}.${i}.${s}${o}${a}`, t);
};
var lb = ab;
class cb {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var ub = cb, So, lu;
function it() {
  if (lu) return So;
  lu = 1;
  const e = /\s+/g;
  class t {
    constructor(T, P) {
      if (P = i(P), T instanceof t)
        return T.loose === !!P.loose && T.includePrerelease === !!P.includePrerelease ? T : new t(T.raw, P);
      if (T instanceof s)
        return this.raw = T.value, this.set = [[T]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = T.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((F) => !g(F[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const F of this.set)
            if (F.length === 1 && y(F[0])) {
              this.set = [F];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let T = 0; T < this.set.length; T++) {
          T > 0 && (this.formatted += "||");
          const P = this.set[T];
          for (let A = 0; A < P.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += P[A].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(T) {
      const A = ((this.options.includePrerelease && _) | (this.options.loose && m)) + ":" + T, F = n.get(A);
      if (F)
        return F;
      const O = this.options.loose, k = O ? u[p.HYPHENRANGELOOSE] : u[p.HYPHENRANGE];
      T = T.replace(k, K(this.options.includePrerelease)), o("hyphen replace", T), T = T.replace(u[p.COMPARATORTRIM], l), o("comparator trim", T), T = T.replace(u[p.TILDETRIM], c), o("tilde trim", T), T = T.replace(u[p.CARETTRIM], d), o("caret trim", T);
      let V = T.split(" ").map((q) => C(q, this.options)).join(" ").split(/\s+/).map((q) => W(q, this.options));
      O && (V = V.filter((q) => (o("loose invalid filter", q, this.options), !!q.match(u[p.COMPARATORLOOSE])))), o("range list", V);
      const N = /* @__PURE__ */ new Map(), Q = V.map((q) => new s(q, this.options));
      for (const q of Q) {
        if (g(q))
          return [q];
        N.set(q.value, q);
      }
      N.size > 1 && N.has("") && N.delete("");
      const _e = [...N.values()];
      return n.set(A, _e), _e;
    }
    intersects(T, P) {
      if (!(T instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => v(A, P) && T.set.some((F) => v(F, P) && A.every((O) => F.every((k) => O.intersects(k, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(T) {
      if (!T)
        return !1;
      if (typeof T == "string")
        try {
          T = new a(T, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (oe(this.set[P], T, this.options))
          return !0;
      return !1;
    }
  }
  So = t;
  const r = ub, n = new r(), i = nl, s = Ts(), o = Is, a = Be, {
    safeRe: u,
    t: p,
    comparatorTrimReplace: l,
    tildeTrimReplace: c,
    caretTrimReplace: d
  } = Bn, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: m } = Cs, g = ($) => $.value === "<0.0.0-0", y = ($) => $.value === "", v = ($, T) => {
    let P = !0;
    const A = $.slice();
    let F = A.pop();
    for (; P && A.length; )
      P = A.every((O) => F.intersects(O, T)), F = A.pop();
    return P;
  }, C = ($, T) => ($ = $.replace(u[p.BUILD], ""), o("comp", $, T), $ = J($, T), o("caret", $), $ = B($, T), o("tildes", $), $ = re($, T), o("xrange", $), $ = E($, T), o("stars", $), $), D = ($) => !$ || $.toLowerCase() === "x" || $ === "*", B = ($, T) => $.trim().split(/\s+/).map((P) => j(P, T)).join(" "), j = ($, T) => {
    const P = T.loose ? u[p.TILDELOOSE] : u[p.TILDE];
    return $.replace(P, (A, F, O, k, V) => {
      o("tilde", $, A, F, O, k, V);
      let N;
      return D(F) ? N = "" : D(O) ? N = `>=${F}.0.0 <${+F + 1}.0.0-0` : D(k) ? N = `>=${F}.${O}.0 <${F}.${+O + 1}.0-0` : V ? (o("replaceTilde pr", V), N = `>=${F}.${O}.${k}-${V} <${F}.${+O + 1}.0-0`) : N = `>=${F}.${O}.${k} <${F}.${+O + 1}.0-0`, o("tilde return", N), N;
    });
  }, J = ($, T) => $.trim().split(/\s+/).map((P) => X(P, T)).join(" "), X = ($, T) => {
    o("caret", $, T);
    const P = T.loose ? u[p.CARETLOOSE] : u[p.CARET], A = T.includePrerelease ? "-0" : "";
    return $.replace(P, (F, O, k, V, N) => {
      o("caret", $, F, O, k, V, N);
      let Q;
      return D(O) ? Q = "" : D(k) ? Q = `>=${O}.0.0${A} <${+O + 1}.0.0-0` : D(V) ? O === "0" ? Q = `>=${O}.${k}.0${A} <${O}.${+k + 1}.0-0` : Q = `>=${O}.${k}.0${A} <${+O + 1}.0.0-0` : N ? (o("replaceCaret pr", N), O === "0" ? k === "0" ? Q = `>=${O}.${k}.${V}-${N} <${O}.${k}.${+V + 1}-0` : Q = `>=${O}.${k}.${V}-${N} <${O}.${+k + 1}.0-0` : Q = `>=${O}.${k}.${V}-${N} <${+O + 1}.0.0-0`) : (o("no pr"), O === "0" ? k === "0" ? Q = `>=${O}.${k}.${V}${A} <${O}.${k}.${+V + 1}-0` : Q = `>=${O}.${k}.${V}${A} <${O}.${+k + 1}.0-0` : Q = `>=${O}.${k}.${V} <${+O + 1}.0.0-0`), o("caret return", Q), Q;
    });
  }, re = ($, T) => (o("replaceXRanges", $, T), $.split(/\s+/).map((P) => M(P, T)).join(" ")), M = ($, T) => {
    $ = $.trim();
    const P = T.loose ? u[p.XRANGELOOSE] : u[p.XRANGE];
    return $.replace(P, (A, F, O, k, V, N) => {
      o("xRange", $, A, F, O, k, V, N);
      const Q = D(O), _e = Q || D(k), q = _e || D(V), Ie = q;
      return F === "=" && Ie && (F = ""), N = T.includePrerelease ? "-0" : "", Q ? F === ">" || F === "<" ? A = "<0.0.0-0" : A = "*" : F && Ie ? (_e && (k = 0), V = 0, F === ">" ? (F = ">=", _e ? (O = +O + 1, k = 0, V = 0) : (k = +k + 1, V = 0)) : F === "<=" && (F = "<", _e ? O = +O + 1 : k = +k + 1), F === "<" && (N = "-0"), A = `${F + O}.${k}.${V}${N}`) : _e ? A = `>=${O}.0.0${N} <${+O + 1}.0.0-0` : q && (A = `>=${O}.${k}.0${N} <${O}.${+k + 1}.0-0`), o("xRange return", A), A;
    });
  }, E = ($, T) => (o("replaceStars", $, T), $.trim().replace(u[p.STAR], "")), W = ($, T) => (o("replaceGTE0", $, T), $.trim().replace(u[T.includePrerelease ? p.GTE0PRE : p.GTE0], "")), K = ($) => (T, P, A, F, O, k, V, N, Q, _e, q, Ie) => (D(A) ? P = "" : D(F) ? P = `>=${A}.0.0${$ ? "-0" : ""}` : D(O) ? P = `>=${A}.${F}.0${$ ? "-0" : ""}` : k ? P = `>=${P}` : P = `>=${P}${$ ? "-0" : ""}`, D(Q) ? N = "" : D(_e) ? N = `<${+Q + 1}.0.0-0` : D(q) ? N = `<${Q}.${+_e + 1}.0-0` : Ie ? N = `<=${Q}.${_e}.${q}-${Ie}` : $ ? N = `<${Q}.${_e}.${+q + 1}-0` : N = `<=${N}`, `${P} ${N}`.trim()), oe = ($, T, P) => {
    for (let A = 0; A < $.length; A++)
      if (!$[A].test(T))
        return !1;
    if (T.prerelease.length && !P.includePrerelease) {
      for (let A = 0; A < $.length; A++)
        if (o($[A].semver), $[A].semver !== s.ANY && $[A].semver.prerelease.length > 0) {
          const F = $[A].semver;
          if (F.major === T.major && F.minor === T.minor && F.patch === T.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return So;
}
var $o, cu;
function Ts() {
  if (cu) return $o;
  cu = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, c) {
      if (c = r(c), l instanceof t) {
        if (l.loose === !!c.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, c), this.options = c, this.loose = !!c.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const c = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = l.match(c);
      if (!d)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new a(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new a(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, c) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new u(l.value, c).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new u(this.value, c).test(l.semver) : (c = r(c), c.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !c.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, c) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, c) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  $o = t;
  const r = nl, { safeRe: n, t: i } = Bn, s = nh, o = Is, a = Be, u = it();
  return $o;
}
const fb = it(), db = (e, t, r) => {
  try {
    t = new fb(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ss = db;
const hb = it(), pb = (e, t) => new hb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var _b = pb;
const xb = Be, mb = it(), gb = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new mb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new xb(n, r));
  }), n;
};
var yb = gb;
const Eb = Be, bb = it(), wb = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new bb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new Eb(n, r));
  }), n;
};
var vb = wb;
const Oo = Be, Rb = it(), uu = As, Cb = (e, t) => {
  e = new Rb(e, t);
  let r = new Oo("0.0.0");
  if (e.test(r) || (r = new Oo("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((o) => {
      const a = new Oo(o.semver.version);
      switch (o.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!s || uu(a, s)) && (s = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || uu(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var Ib = Cb;
const Ab = it(), Tb = (e, t) => {
  try {
    return new Ab(e, t).range || "*";
  } catch {
    return null;
  }
};
var Sb = Tb;
const $b = Be, ih = Ts(), { ANY: Ob } = ih, Db = it(), Pb = Ss, fu = As, du = sl, Fb = al, Nb = ol, Ub = (e, t, r, n) => {
  e = new $b(e, n), t = new Db(t, n);
  let i, s, o, a, u;
  switch (r) {
    case ">":
      i = fu, s = Fb, o = du, a = ">", u = ">=";
      break;
    case "<":
      i = du, s = Nb, o = fu, a = "<", u = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Pb(e, t, n))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const l = t.set[p];
    let c = null, d = null;
    if (l.forEach((_) => {
      _.semver === Ob && (_ = new ih(">=0.0.0")), c = c || _, d = d || _, i(_.semver, c.semver, n) ? c = _ : o(_.semver, d.semver, n) && (d = _);
    }), c.operator === a || c.operator === u || (!d.operator || d.operator === a) && s(e, d.semver))
      return !1;
    if (d.operator === u && o(e, d.semver))
      return !1;
  }
  return !0;
};
var ll = Ub;
const Lb = ll, Bb = (e, t, r) => Lb(e, t, ">", r);
var Mb = Bb;
const kb = ll, qb = (e, t, r) => kb(e, t, "<", r);
var jb = qb;
const hu = it(), Hb = (e, t, r) => (e = new hu(e, r), t = new hu(t, r), e.intersects(t, r));
var Gb = Hb;
const Wb = Ss, Vb = nt;
var zb = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const o = e.sort((l, c) => Vb(l, c, r));
  for (const l of o)
    Wb(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [l, c] of n)
    l === c ? a.push(l) : !c && l === o[0] ? a.push("*") : c ? l === o[0] ? a.push(`<=${c}`) : a.push(`${l} - ${c}`) : a.push(`>=${l}`);
  const u = a.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return u.length < p.length ? u : t;
};
const pu = it(), cl = Ts(), { ANY: Do } = cl, Qr = Ss, ul = nt, Yb = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new pu(e, r), t = new pu(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const o = Kb(i, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Xb = [new cl(">=0.0.0-0")], _u = [new cl(">=0.0.0")], Kb = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Do) {
    if (t.length === 1 && t[0].semver === Do)
      return !0;
    r.includePrerelease ? e = Xb : e = _u;
  }
  if (t.length === 1 && t[0].semver === Do) {
    if (r.includePrerelease)
      return !0;
    t = _u;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? i = xu(i, _, r) : _.operator === "<" || _.operator === "<=" ? s = mu(s, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && s) {
    if (o = ul(i.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const _ of n) {
    if (i && !Qr(_, String(i), r) || s && !Qr(_, String(s), r))
      return null;
    for (const m of t)
      if (!Qr(_, String(m), r))
        return !1;
    return !0;
  }
  let a, u, p, l, c = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  c && c.prerelease.length === 1 && s.operator === "<" && c.prerelease[0] === 0 && (c = !1);
  for (const _ of t) {
    if (l = l || _.operator === ">" || _.operator === ">=", p = p || _.operator === "<" || _.operator === "<=", i) {
      if (d && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === d.major && _.semver.minor === d.minor && _.semver.patch === d.patch && (d = !1), _.operator === ">" || _.operator === ">=") {
        if (a = xu(i, _, r), a === _ && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Qr(i.semver, String(_), r))
        return !1;
    }
    if (s) {
      if (c && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === c.major && _.semver.minor === c.minor && _.semver.patch === c.patch && (c = !1), _.operator === "<" || _.operator === "<=") {
        if (u = mu(s, _, r), u === _ && u !== s)
          return !1;
      } else if (s.operator === "<=" && !Qr(s.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (s || i) && o !== 0)
      return !1;
  }
  return !(i && p && !s && o !== 0 || s && l && !i && o !== 0 || d || c);
}, xu = (e, t, r) => {
  if (!e)
    return t;
  const n = ul(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, mu = (e, t, r) => {
  if (!e)
    return t;
  const n = ul(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Jb = Yb;
const Po = Bn, gu = Cs, Qb = Be, yu = eh, Zb = Nr, ew = oE, tw = cE, rw = fE, nw = hE, iw = xE, sw = yE, ow = wE, aw = CE, lw = nt, cw = SE, uw = DE, fw = il, dw = UE, hw = ME, pw = As, _w = sl, xw = th, mw = rh, gw = ol, yw = al, Ew = nh, bw = lb, ww = Ts(), vw = it(), Rw = Ss, Cw = _b, Iw = yb, Aw = vb, Tw = Ib, Sw = Sb, $w = ll, Ow = Mb, Dw = jb, Pw = Gb, Fw = zb, Nw = Jb;
var sh = {
  parse: Zb,
  valid: ew,
  clean: tw,
  inc: rw,
  diff: nw,
  major: iw,
  minor: sw,
  patch: ow,
  prerelease: aw,
  compare: lw,
  rcompare: cw,
  compareLoose: uw,
  compareBuild: fw,
  sort: dw,
  rsort: hw,
  gt: pw,
  lt: _w,
  eq: xw,
  neq: mw,
  gte: gw,
  lte: yw,
  cmp: Ew,
  coerce: bw,
  Comparator: ww,
  Range: vw,
  satisfies: Rw,
  toComparators: Cw,
  maxSatisfying: Iw,
  minSatisfying: Aw,
  minVersion: Tw,
  validRange: Sw,
  outside: $w,
  gtr: Ow,
  ltr: Dw,
  intersects: Pw,
  simplifyRange: Fw,
  subset: Nw,
  SemVer: Qb,
  re: Po.re,
  src: Po.src,
  tokens: Po.t,
  SEMVER_SPEC_VERSION: gu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: gu.RELEASE_TYPES,
  compareIdentifiers: yu.compareIdentifiers,
  rcompareIdentifiers: yu.rcompareIdentifiers
}, Mn = {}, ts = { exports: {} };
ts.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, o = 9007199254740991, a = "[object Arguments]", u = "[object Array]", p = "[object AsyncFunction]", l = "[object Boolean]", c = "[object Date]", d = "[object Error]", _ = "[object Function]", m = "[object GeneratorFunction]", g = "[object Map]", y = "[object Number]", v = "[object Null]", C = "[object Object]", D = "[object Promise]", B = "[object Proxy]", j = "[object RegExp]", J = "[object Set]", X = "[object String]", re = "[object Symbol]", M = "[object Undefined]", E = "[object WeakMap]", W = "[object ArrayBuffer]", K = "[object DataView]", oe = "[object Float32Array]", $ = "[object Float64Array]", T = "[object Int8Array]", P = "[object Int16Array]", A = "[object Int32Array]", F = "[object Uint8Array]", O = "[object Uint8ClampedArray]", k = "[object Uint16Array]", V = "[object Uint32Array]", N = /[\\^$.*+?()[\]{}|]/g, Q = /^\[object .+?Constructor\]$/, _e = /^(?:0|[1-9]\d*)$/, q = {};
  q[oe] = q[$] = q[T] = q[P] = q[A] = q[F] = q[O] = q[k] = q[V] = !0, q[a] = q[u] = q[W] = q[l] = q[K] = q[c] = q[d] = q[_] = q[g] = q[y] = q[C] = q[j] = q[J] = q[X] = q[E] = !1;
  var Ie = typeof S == "object" && S && S.Object === Object && S, Gr = typeof self == "object" && self && self.Object === Object && self, Xe = Ie || Gr || Function("return this")(), li = t && !t.nodeType && t, Wr = li && !0 && e && !e.nodeType && e, ur = Wr && Wr.exports === li, Vr = ur && Ie.process, h = function() {
    try {
      return Vr && Vr.binding && Vr.binding("util");
    } catch {
    }
  }(), f = h && h.isTypedArray;
  function R(x, w) {
    for (var I = -1, U = x == null ? 0 : x.length, ee = 0, G = []; ++I < U; ) {
      var ue = x[I];
      w(ue, I, x) && (G[ee++] = ue);
    }
    return G;
  }
  function b(x, w) {
    for (var I = -1, U = w.length, ee = x.length; ++I < U; )
      x[ee + I] = w[I];
    return x;
  }
  function Y(x, w) {
    for (var I = -1, U = x == null ? 0 : x.length; ++I < U; )
      if (w(x[I], I, x))
        return !0;
    return !1;
  }
  function ae(x, w) {
    for (var I = -1, U = Array(x); ++I < x; )
      U[I] = w(I);
    return U;
  }
  function fe(x) {
    return function(w) {
      return x(w);
    };
  }
  function Ae(x, w) {
    return x.has(w);
  }
  function Te(x, w) {
    return x == null ? void 0 : x[w];
  }
  function Ke(x) {
    var w = -1, I = Array(x.size);
    return x.forEach(function(U, ee) {
      I[++w] = [ee, U];
    }), I;
  }
  function xe(x, w) {
    return function(I) {
      return x(w(I));
    };
  }
  function Je(x) {
    var w = -1, I = Array(x.size);
    return x.forEach(function(U) {
      I[++w] = U;
    }), I;
  }
  var lo = Array.prototype, ci = Function.prototype, Ct = Object.prototype, fr = Xe["__core-js_shared__"], kl = ci.toString, ot = Ct.hasOwnProperty, ql = function() {
    var x = /[^.]+$/.exec(fr && fr.keys && fr.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), jl = Ct.toString, np = RegExp(
    "^" + kl.call(ot).replace(N, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Hl = ur ? Xe.Buffer : void 0, ui = Xe.Symbol, Gl = Xe.Uint8Array, Wl = Ct.propertyIsEnumerable, ip = lo.splice, Wt = ui ? ui.toStringTag : void 0, Vl = Object.getOwnPropertySymbols, sp = Hl ? Hl.isBuffer : void 0, op = xe(Object.keys, Object), co = dr(Xe, "DataView"), zr = dr(Xe, "Map"), uo = dr(Xe, "Promise"), fo = dr(Xe, "Set"), ho = dr(Xe, "WeakMap"), Yr = dr(Object, "create"), ap = Yt(co), lp = Yt(zr), cp = Yt(uo), up = Yt(fo), fp = Yt(ho), zl = ui ? ui.prototype : void 0, po = zl ? zl.valueOf : void 0;
  function Vt(x) {
    var w = -1, I = x == null ? 0 : x.length;
    for (this.clear(); ++w < I; ) {
      var U = x[w];
      this.set(U[0], U[1]);
    }
  }
  function dp() {
    this.__data__ = Yr ? Yr(null) : {}, this.size = 0;
  }
  function hp(x) {
    var w = this.has(x) && delete this.__data__[x];
    return this.size -= w ? 1 : 0, w;
  }
  function pp(x) {
    var w = this.__data__;
    if (Yr) {
      var I = w[x];
      return I === n ? void 0 : I;
    }
    return ot.call(w, x) ? w[x] : void 0;
  }
  function _p(x) {
    var w = this.__data__;
    return Yr ? w[x] !== void 0 : ot.call(w, x);
  }
  function xp(x, w) {
    var I = this.__data__;
    return this.size += this.has(x) ? 0 : 1, I[x] = Yr && w === void 0 ? n : w, this;
  }
  Vt.prototype.clear = dp, Vt.prototype.delete = hp, Vt.prototype.get = pp, Vt.prototype.has = _p, Vt.prototype.set = xp;
  function xt(x) {
    var w = -1, I = x == null ? 0 : x.length;
    for (this.clear(); ++w < I; ) {
      var U = x[w];
      this.set(U[0], U[1]);
    }
  }
  function mp() {
    this.__data__ = [], this.size = 0;
  }
  function gp(x) {
    var w = this.__data__, I = di(w, x);
    if (I < 0)
      return !1;
    var U = w.length - 1;
    return I == U ? w.pop() : ip.call(w, I, 1), --this.size, !0;
  }
  function yp(x) {
    var w = this.__data__, I = di(w, x);
    return I < 0 ? void 0 : w[I][1];
  }
  function Ep(x) {
    return di(this.__data__, x) > -1;
  }
  function bp(x, w) {
    var I = this.__data__, U = di(I, x);
    return U < 0 ? (++this.size, I.push([x, w])) : I[U][1] = w, this;
  }
  xt.prototype.clear = mp, xt.prototype.delete = gp, xt.prototype.get = yp, xt.prototype.has = Ep, xt.prototype.set = bp;
  function zt(x) {
    var w = -1, I = x == null ? 0 : x.length;
    for (this.clear(); ++w < I; ) {
      var U = x[w];
      this.set(U[0], U[1]);
    }
  }
  function wp() {
    this.size = 0, this.__data__ = {
      hash: new Vt(),
      map: new (zr || xt)(),
      string: new Vt()
    };
  }
  function vp(x) {
    var w = hi(this, x).delete(x);
    return this.size -= w ? 1 : 0, w;
  }
  function Rp(x) {
    return hi(this, x).get(x);
  }
  function Cp(x) {
    return hi(this, x).has(x);
  }
  function Ip(x, w) {
    var I = hi(this, x), U = I.size;
    return I.set(x, w), this.size += I.size == U ? 0 : 1, this;
  }
  zt.prototype.clear = wp, zt.prototype.delete = vp, zt.prototype.get = Rp, zt.prototype.has = Cp, zt.prototype.set = Ip;
  function fi(x) {
    var w = -1, I = x == null ? 0 : x.length;
    for (this.__data__ = new zt(); ++w < I; )
      this.add(x[w]);
  }
  function Ap(x) {
    return this.__data__.set(x, n), this;
  }
  function Tp(x) {
    return this.__data__.has(x);
  }
  fi.prototype.add = fi.prototype.push = Ap, fi.prototype.has = Tp;
  function It(x) {
    var w = this.__data__ = new xt(x);
    this.size = w.size;
  }
  function Sp() {
    this.__data__ = new xt(), this.size = 0;
  }
  function $p(x) {
    var w = this.__data__, I = w.delete(x);
    return this.size = w.size, I;
  }
  function Op(x) {
    return this.__data__.get(x);
  }
  function Dp(x) {
    return this.__data__.has(x);
  }
  function Pp(x, w) {
    var I = this.__data__;
    if (I instanceof xt) {
      var U = I.__data__;
      if (!zr || U.length < r - 1)
        return U.push([x, w]), this.size = ++I.size, this;
      I = this.__data__ = new zt(U);
    }
    return I.set(x, w), this.size = I.size, this;
  }
  It.prototype.clear = Sp, It.prototype.delete = $p, It.prototype.get = Op, It.prototype.has = Dp, It.prototype.set = Pp;
  function Fp(x, w) {
    var I = pi(x), U = !I && Xp(x), ee = !I && !U && _o(x), G = !I && !U && !ee && rc(x), ue = I || U || ee || G, ye = ue ? ae(x.length, String) : [], be = ye.length;
    for (var le in x)
      ot.call(x, le) && !(ue && // Safari 9 has enumerable `arguments.length` in strict mode.
      (le == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ee && (le == "offset" || le == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      G && (le == "buffer" || le == "byteLength" || le == "byteOffset") || // Skip index properties.
      Gp(le, be))) && ye.push(le);
    return ye;
  }
  function di(x, w) {
    for (var I = x.length; I--; )
      if (Ql(x[I][0], w))
        return I;
    return -1;
  }
  function Np(x, w, I) {
    var U = w(x);
    return pi(x) ? U : b(U, I(x));
  }
  function Xr(x) {
    return x == null ? x === void 0 ? M : v : Wt && Wt in Object(x) ? jp(x) : Yp(x);
  }
  function Yl(x) {
    return Kr(x) && Xr(x) == a;
  }
  function Xl(x, w, I, U, ee) {
    return x === w ? !0 : x == null || w == null || !Kr(x) && !Kr(w) ? x !== x && w !== w : Up(x, w, I, U, Xl, ee);
  }
  function Up(x, w, I, U, ee, G) {
    var ue = pi(x), ye = pi(w), be = ue ? u : At(x), le = ye ? u : At(w);
    be = be == a ? C : be, le = le == a ? C : le;
    var je = be == C, Qe = le == C, Se = be == le;
    if (Se && _o(x)) {
      if (!_o(w))
        return !1;
      ue = !0, je = !1;
    }
    if (Se && !je)
      return G || (G = new It()), ue || rc(x) ? Kl(x, w, I, U, ee, G) : kp(x, w, be, I, U, ee, G);
    if (!(I & i)) {
      var Ge = je && ot.call(x, "__wrapped__"), We = Qe && ot.call(w, "__wrapped__");
      if (Ge || We) {
        var Tt = Ge ? x.value() : x, mt = We ? w.value() : w;
        return G || (G = new It()), ee(Tt, mt, I, U, G);
      }
    }
    return Se ? (G || (G = new It()), qp(x, w, I, U, ee, G)) : !1;
  }
  function Lp(x) {
    if (!tc(x) || Vp(x))
      return !1;
    var w = Zl(x) ? np : Q;
    return w.test(Yt(x));
  }
  function Bp(x) {
    return Kr(x) && ec(x.length) && !!q[Xr(x)];
  }
  function Mp(x) {
    if (!zp(x))
      return op(x);
    var w = [];
    for (var I in Object(x))
      ot.call(x, I) && I != "constructor" && w.push(I);
    return w;
  }
  function Kl(x, w, I, U, ee, G) {
    var ue = I & i, ye = x.length, be = w.length;
    if (ye != be && !(ue && be > ye))
      return !1;
    var le = G.get(x);
    if (le && G.get(w))
      return le == w;
    var je = -1, Qe = !0, Se = I & s ? new fi() : void 0;
    for (G.set(x, w), G.set(w, x); ++je < ye; ) {
      var Ge = x[je], We = w[je];
      if (U)
        var Tt = ue ? U(We, Ge, je, w, x, G) : U(Ge, We, je, x, w, G);
      if (Tt !== void 0) {
        if (Tt)
          continue;
        Qe = !1;
        break;
      }
      if (Se) {
        if (!Y(w, function(mt, Xt) {
          if (!Ae(Se, Xt) && (Ge === mt || ee(Ge, mt, I, U, G)))
            return Se.push(Xt);
        })) {
          Qe = !1;
          break;
        }
      } else if (!(Ge === We || ee(Ge, We, I, U, G))) {
        Qe = !1;
        break;
      }
    }
    return G.delete(x), G.delete(w), Qe;
  }
  function kp(x, w, I, U, ee, G, ue) {
    switch (I) {
      case K:
        if (x.byteLength != w.byteLength || x.byteOffset != w.byteOffset)
          return !1;
        x = x.buffer, w = w.buffer;
      case W:
        return !(x.byteLength != w.byteLength || !G(new Gl(x), new Gl(w)));
      case l:
      case c:
      case y:
        return Ql(+x, +w);
      case d:
        return x.name == w.name && x.message == w.message;
      case j:
      case X:
        return x == w + "";
      case g:
        var ye = Ke;
      case J:
        var be = U & i;
        if (ye || (ye = Je), x.size != w.size && !be)
          return !1;
        var le = ue.get(x);
        if (le)
          return le == w;
        U |= s, ue.set(x, w);
        var je = Kl(ye(x), ye(w), U, ee, G, ue);
        return ue.delete(x), je;
      case re:
        if (po)
          return po.call(x) == po.call(w);
    }
    return !1;
  }
  function qp(x, w, I, U, ee, G) {
    var ue = I & i, ye = Jl(x), be = ye.length, le = Jl(w), je = le.length;
    if (be != je && !ue)
      return !1;
    for (var Qe = be; Qe--; ) {
      var Se = ye[Qe];
      if (!(ue ? Se in w : ot.call(w, Se)))
        return !1;
    }
    var Ge = G.get(x);
    if (Ge && G.get(w))
      return Ge == w;
    var We = !0;
    G.set(x, w), G.set(w, x);
    for (var Tt = ue; ++Qe < be; ) {
      Se = ye[Qe];
      var mt = x[Se], Xt = w[Se];
      if (U)
        var nc = ue ? U(Xt, mt, Se, w, x, G) : U(mt, Xt, Se, x, w, G);
      if (!(nc === void 0 ? mt === Xt || ee(mt, Xt, I, U, G) : nc)) {
        We = !1;
        break;
      }
      Tt || (Tt = Se == "constructor");
    }
    if (We && !Tt) {
      var _i = x.constructor, xi = w.constructor;
      _i != xi && "constructor" in x && "constructor" in w && !(typeof _i == "function" && _i instanceof _i && typeof xi == "function" && xi instanceof xi) && (We = !1);
    }
    return G.delete(x), G.delete(w), We;
  }
  function Jl(x) {
    return Np(x, Qp, Hp);
  }
  function hi(x, w) {
    var I = x.__data__;
    return Wp(w) ? I[typeof w == "string" ? "string" : "hash"] : I.map;
  }
  function dr(x, w) {
    var I = Te(x, w);
    return Lp(I) ? I : void 0;
  }
  function jp(x) {
    var w = ot.call(x, Wt), I = x[Wt];
    try {
      x[Wt] = void 0;
      var U = !0;
    } catch {
    }
    var ee = jl.call(x);
    return U && (w ? x[Wt] = I : delete x[Wt]), ee;
  }
  var Hp = Vl ? function(x) {
    return x == null ? [] : (x = Object(x), R(Vl(x), function(w) {
      return Wl.call(x, w);
    }));
  } : Zp, At = Xr;
  (co && At(new co(new ArrayBuffer(1))) != K || zr && At(new zr()) != g || uo && At(uo.resolve()) != D || fo && At(new fo()) != J || ho && At(new ho()) != E) && (At = function(x) {
    var w = Xr(x), I = w == C ? x.constructor : void 0, U = I ? Yt(I) : "";
    if (U)
      switch (U) {
        case ap:
          return K;
        case lp:
          return g;
        case cp:
          return D;
        case up:
          return J;
        case fp:
          return E;
      }
    return w;
  });
  function Gp(x, w) {
    return w = w ?? o, !!w && (typeof x == "number" || _e.test(x)) && x > -1 && x % 1 == 0 && x < w;
  }
  function Wp(x) {
    var w = typeof x;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? x !== "__proto__" : x === null;
  }
  function Vp(x) {
    return !!ql && ql in x;
  }
  function zp(x) {
    var w = x && x.constructor, I = typeof w == "function" && w.prototype || Ct;
    return x === I;
  }
  function Yp(x) {
    return jl.call(x);
  }
  function Yt(x) {
    if (x != null) {
      try {
        return kl.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function Ql(x, w) {
    return x === w || x !== x && w !== w;
  }
  var Xp = Yl(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Yl : function(x) {
    return Kr(x) && ot.call(x, "callee") && !Wl.call(x, "callee");
  }, pi = Array.isArray;
  function Kp(x) {
    return x != null && ec(x.length) && !Zl(x);
  }
  var _o = sp || e_;
  function Jp(x, w) {
    return Xl(x, w);
  }
  function Zl(x) {
    if (!tc(x))
      return !1;
    var w = Xr(x);
    return w == _ || w == m || w == p || w == B;
  }
  function ec(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= o;
  }
  function tc(x) {
    var w = typeof x;
    return x != null && (w == "object" || w == "function");
  }
  function Kr(x) {
    return x != null && typeof x == "object";
  }
  var rc = f ? fe(f) : Bp;
  function Qp(x) {
    return Kp(x) ? Fp(x) : Mp(x);
  }
  function Zp() {
    return [];
  }
  function e_() {
    return !1;
  }
  e.exports = Jp;
})(ts, ts.exports);
var Uw = ts.exports;
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.DownloadedUpdateHelper = void 0;
Mn.createTempUpdateFile = qw;
const Lw = On, Bw = qt, Eu = Uw, Kt = Ht, fn = ne;
class Mw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return fn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Eu(this.versionInfo, r) && Eu(this.fileInfo.info, n.info) && await (0, Kt.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, o) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, o && await (0, Kt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Kt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Kt.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, Kt.readJson)(n);
    } catch (p) {
      let l = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${p.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = fn.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, Kt.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const u = await kw(a);
    return t.info.sha512 !== u ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${u}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, a);
  }
  getUpdateInfoFile() {
    return fn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Mn.DownloadedUpdateHelper = Mw;
function kw(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const o = (0, Lw.createHash)(t);
    o.on("error", s).setEncoding(r), (0, Bw.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function qw(e, t, r) {
  let n = 0, i = fn.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, Kt.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = fn.join(t, `${n++}-${e}`);
    }
  return i;
}
var $s = {}, fl = {};
Object.defineProperty(fl, "__esModule", { value: !0 });
fl.getAppCacheDir = Hw;
const Fo = ne, jw = _s;
function Hw() {
  const e = (0, jw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Fo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Fo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Fo.join(e, ".cache"), t;
}
Object.defineProperty($s, "__esModule", { value: !0 });
$s.ElectronAppAdapter = void 0;
const bu = ne, Gw = fl;
class Ww {
  constructor(t = rr.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? bu.join(process.resourcesPath, "app-update.yml") : bu.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Gw.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
$s.ElectronAppAdapter = Ww;
var oh = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = ge;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return rr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(s) {
      super(), this.proxyLoginCallback = s, this.cachedSession = null;
    }
    async download(s, o, a) {
      return await a.cancellationToken.createPromise((u, p, l) => {
        const c = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(s, c), (0, t.configureRequestOptions)(c), this.doDownload(c, {
          destination: o,
          options: a,
          onCancel: l,
          callback: (d) => {
            d == null ? u(o) : p(d);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(s, o) {
      s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const a = rr.net.request({
        ...s,
        session: this.cachedSession
      });
      return a.on("response", o), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(s, o, a, u, p) {
      s.on("redirect", (l, c, d) => {
        s.abort(), u > this.maxRedirects ? a(this.createMaxRedirectError()) : p(t.HttpExecutor.prepareRedirectUrlOptions(d, o));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(oh);
var kn = {}, st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
st.newBaseUrl = Vw;
st.newUrlFromBase = zw;
st.getChannelFilename = Yw;
const ah = jt;
function Vw(e) {
  const t = new ah.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function zw(e, t, r = !1) {
  const n = new ah.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Yw(e) {
  return `${e}.yml`;
}
var pe = {}, Xw = "[object Symbol]", lh = /[\\^$.*+?()[\]{}|]/g, Kw = RegExp(lh.source), Jw = typeof S == "object" && S && S.Object === Object && S, Qw = typeof self == "object" && self && self.Object === Object && self, Zw = Jw || Qw || Function("return this")(), ev = Object.prototype, tv = ev.toString, wu = Zw.Symbol, vu = wu ? wu.prototype : void 0, Ru = vu ? vu.toString : void 0;
function rv(e) {
  if (typeof e == "string")
    return e;
  if (iv(e))
    return Ru ? Ru.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function nv(e) {
  return !!e && typeof e == "object";
}
function iv(e) {
  return typeof e == "symbol" || nv(e) && tv.call(e) == Xw;
}
function sv(e) {
  return e == null ? "" : rv(e);
}
function ov(e) {
  return e = sv(e), e && Kw.test(e) ? e.replace(lh, "\\$&") : e;
}
var ch = ov;
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.Provider = void 0;
pe.findFile = fv;
pe.parseUpdateInfo = dv;
pe.getFileList = uh;
pe.resolveFiles = hv;
const Mt = ge, av = Ce, lv = jt, rs = st, cv = ch;
class uv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, rs.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, rs.newUrlFromBase)(`${t.pathname.replace(new RegExp(cv(n), "g"), r)}.blockmap`, i ? new lv.URL(i) : t), s];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Mt.configureRequestUrl)(t, n), n;
  }
}
pe.Provider = uv;
function fv(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, Mt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((o) => o.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((o) => [o.url.pathname, o.info.url].some((a) => a.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((o) => !r.some((a) => o.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function dv(e, t, r) {
  if (e == null)
    throw (0, Mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, av.load)(e);
  } catch (i) {
    throw (0, Mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function uh(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Mt.newError)(`No files provided: ${(0, Mt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function hv(e, t, r = (n) => n) {
  const i = uh(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Mt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Mt.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, rs.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), s = e.packages, o = s == null ? null : s[process.arch] || s.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, rs.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.GenericProvider = void 0;
const Cu = ge, No = st, Uo = pe;
class pv extends Uo.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, No.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, No.getChannelFilename)(this.channel), r = (0, No.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Uo.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Cu.HttpError && i.statusCode === 404)
          throw (0, Cu.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((s, o) => {
            try {
              setTimeout(s, 1e3 * n);
            } catch (a) {
              o(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Uo.resolveFiles)(t, this.baseUrl);
  }
}
kn.GenericProvider = pv;
var Os = {}, Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
Ds.BitbucketProvider = void 0;
const Iu = ge, Lo = st, Bo = pe;
class _v extends Bo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, Lo.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Iu.CancellationToken(), r = (0, Lo.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Lo.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Bo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Iu.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Bo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Ds.BitbucketProvider = _v;
var kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.GitHubProvider = kt.BaseGitHubProvider = void 0;
kt.computeReleaseNotes = dh;
const Et = ge, ct = sh, xv = jt, Rr = st, Aa = pe, Mo = /\/tag\/(v?[^/]+)$/;
class fh extends Aa.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Rr.newBaseUrl)((0, Et.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Rr.newBaseUrl)((0, Et.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
kt.BaseGitHubProvider = fh;
class mv extends fh {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const o = new Et.CancellationToken(), a = await this.httpRequest((0, Rr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), u = (0, Et.parseXml)(a);
    let p = u.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const y = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = ct.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (y === null)
          l = Mo.exec(p.element("link").attribute("href"))[1];
        else
          for (const v of u.getElements("entry")) {
            const C = Mo.exec(v.element("link").attribute("href"));
            if (C === null)
              continue;
            const D = C[1];
            if (!ct.valid(D))
              continue;
            const B = ((n = ct.prerelease(D)) === null || n === void 0 ? void 0 : n[0]) || null, j = !y || ["alpha", "beta"].includes(y), J = B !== null && !["alpha", "beta"].includes(String(B));
            if (j && !J && !(y === "beta" && B === "alpha")) {
              l = D, p = v;
              break;
            }
            if (B && B === y) {
              l = D, p = v;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(o);
        for (const y of u.getElements("entry")) {
          const v = Mo.exec(y.element("link").attribute("href"));
          if (v != null && v[1] === l) {
            p = y;
            break;
          }
        }
      }
    } catch (y) {
      throw (0, Et.newError)(`Cannot parse releases feed: ${y.stack || y.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Et.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let c, d = "", _ = "";
    const m = async (y) => {
      d = (0, Rr.getChannelFilename)(y), _ = (0, Rr.newUrlFromBase)(this.getBaseDownloadPath(String(l), d), this.baseUrl);
      const v = this.createRequestOptions(_);
      try {
        return await this.executor.request(v, o);
      } catch (C) {
        throw C instanceof Et.HttpError && C.statusCode === 404 ? (0, Et.newError)(`Cannot find ${d} in the latest release artifacts (${_}): ${C.stack || C.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : C;
      }
    };
    try {
      let y = this.channel;
      this.updater.allowPrerelease && (!((i = ct.prerelease(l)) === null || i === void 0) && i[0]) && (y = this.getCustomChannelName(String((s = ct.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), c = await m(y);
    } catch (y) {
      if (this.updater.allowPrerelease)
        c = await m(this.getDefaultChannelName());
      else
        throw y;
    }
    const g = (0, Aa.parseUpdateInfo)(c, d, _);
    return g.releaseName == null && (g.releaseName = p.elementValueOrEmpty("title")), g.releaseNotes == null && (g.releaseNotes = dh(this.updater.currentVersion, this.updater.fullChangelog, u, p)), {
      tag: l,
      ...g
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Rr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new xv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Et.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Aa.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
kt.GitHubProvider = mv;
function Au(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function dh(e, t, r, n) {
  if (!t)
    return Au(n);
  const i = /\/tag\/v?([^/]+)$/;
  let s;
  try {
    s = i.exec(n.element("link").attribute("href"))[1], s = ct.valid(s) ? s : void 0;
  } catch {
  }
  if (s == null)
    return null;
  const o = [];
  for (const a of r.getElements("entry")) {
    let u;
    try {
      const c = i.exec(a.element("link").attribute("href"));
      if (!c)
        continue;
      u = c[1];
    } catch {
      continue;
    }
    if (!ct.valid(u))
      continue;
    const p = ct.gt(u, e.raw), l = ct.lte(u, s);
    p && l && o.push({
      version: u,
      note: Au(a)
    });
  }
  return o.sort((a, u) => ct.rcompare(a.version, u.version));
}
var Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
Ps.GitLabProvider = void 0;
const we = ge, ko = jt, gv = ch, Si = st, qo = pe;
class yv extends qo.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const s = t.host || "gitlab.com";
    this.baseApiUrl = (0, Si.newBaseUrl)(`https://${s}/api/v4`);
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new we.CancellationToken(), r = (0, Si.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), n = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
    let i;
    try {
      i = await this.httpRequest(r, n, t);
    } catch (_) {
      throw (0, we.newError)(`Unable to find latest release on GitLab (${r}): ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (!i)
      throw (0, we.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let s;
    try {
      s = JSON.parse(i);
    } catch (_) {
      throw (0, we.newError)(`Unable to parse latest release response from GitLab (${r}): response was not valid JSON: ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (s.upcoming_release)
      throw (0, we.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    const o = s.tag_name;
    let a = null, u = "", p = null;
    const l = async (_) => {
      u = (0, Si.getChannelFilename)(_);
      const m = s.assets.links.find((v) => v.name === u);
      if (!m)
        throw (0, we.newError)(`Cannot find ${u} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      p = new ko.URL(m.direct_asset_url);
      const g = this.setAuthHeaderForToken(this.options.token || null), y = Object.keys(g).length ? g : void 0;
      try {
        const v = await this.httpRequest(p, y, t);
        if (!v)
          throw (0, we.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return v;
      } catch (v) {
        throw v instanceof we.HttpError && v.statusCode === 404 ? (0, we.newError)(`Cannot find ${u} in the latest release artifacts (${p}): ${v.stack || v.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : v;
      }
    };
    try {
      a = await l(this.channel);
    } catch (_) {
      if (this.channel !== this.getDefaultChannelName())
        a = await l(this.getDefaultChannelName());
      else
        throw _;
    }
    if (!a)
      throw (0, we.newError)(`Unable to parse channel data from ${u}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const c = (0, qo.parseUpdateInfo)(a, u, p);
    c.releaseName == null && (c.releaseName = s.name), c.releaseNotes == null && (c.releaseNotes = s.description || null);
    const d = {
      tag: o,
      assets: this.convertAssetsToMap(s.assets),
      ...c
    };
    return this.cachedLatestVersion = d, d;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const s = t.get(i);
      if (s)
        return new ko.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new we.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, Si.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const o = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(s, o, r);
        if (a)
          return JSON.parse(a);
      } catch (o) {
        if (o instanceof we.HttpError && o.statusCode === 404)
          continue;
        throw (0, we.newError)(`Unable to find release ${i} on GitLab (${s}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, we.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, s = null;
    const o = await this.getVersionInfoForBlockMap(r);
    o && (i = this.findBlockMapInAssets(o, n));
    const a = await this.getVersionInfoForBlockMap(t);
    if (a) {
      const u = n.replace(new RegExp(gv(r), "g"), t);
      s = this.findBlockMapInAssets(a, u);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [o, a] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!a)
        throw (0, we.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!o)
        throw (0, we.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [o, a];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, qo.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((o) => t.assets.has(o)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, we.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ko.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Ps.GitLabProvider = yv;
var Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.KeygenProvider = void 0;
const Tu = ge, jo = st, Ho = pe;
class Ev extends Ho.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, jo.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Tu.CancellationToken(), r = (0, jo.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, jo.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Ho.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Tu.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ho.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Fs.KeygenProvider = Ev;
var Ns = {};
Object.defineProperty(Ns, "__esModule", { value: !0 });
Ns.PrivateGitHubProvider = void 0;
const pr = ge, bv = Ce, wv = ne, Su = jt, $u = st, vv = kt, Rv = pe;
class Cv extends vv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new pr.CancellationToken(), r = (0, $u.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, pr.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new Su.URL(i.url);
    let o;
    try {
      o = (0, bv.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof pr.HttpError && a.statusCode === 404 ? (0, pr.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return o.assets = n.assets, o;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, $u.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      if (r) {
        const o = s.filter((a) => !a.draft);
        return o.find((a) => a.prerelease) || o[0];
      } else
        return s;
    } catch (s) {
      throw (0, pr.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Rv.getFileList)(t).map((r) => {
      const n = wv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, pr.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Su.URL(i.url),
        info: r
      };
    });
  }
}
Ns.PrivateGitHubProvider = Cv;
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.isUrlProbablySupportMultiRangeRequests = hh;
Os.createClient = Ov;
const $i = ge, Iv = Ds, Ou = kn, Av = kt, Tv = Ps, Sv = Fs, $v = Ns;
function hh(e) {
  return !e.includes("s3.amazonaws.com");
}
function Ov(e, t, r) {
  if (typeof e == "string")
    throw (0, $i.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new Av.GitHubProvider(i, t, r) : new $v.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new Iv.BitbucketProvider(e, t, r);
    case "gitlab":
      return new Tv.GitLabProvider(e, t, r);
    case "keygen":
      return new Sv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Ou.GenericProvider({
        provider: "generic",
        url: (0, $i.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Ou.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && hh(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, $i.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, $i.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Us = {}, qn = {}, Ur = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.OperationKind = void 0;
lr.computeOperations = Dv;
var er;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(er || (lr.OperationKind = er = {}));
function Dv(e, t, r) {
  const n = Pu(e.files), i = Pu(t.files);
  let s = null;
  const o = t.files[0], a = [], u = o.name, p = n.get(u);
  if (p == null)
    throw new Error(`no file ${u} in old blockmap`);
  const l = i.get(u);
  let c = 0;
  const { checksumToOffset: d, checksumToOldSize: _ } = Fv(n.get(u), p.offset, r);
  let m = o.offset;
  for (let g = 0; g < l.checksums.length; m += l.sizes[g], g++) {
    const y = l.sizes[g], v = l.checksums[g];
    let C = d.get(v);
    C != null && _.get(v) !== y && (r.warn(`Checksum ("${v}") matches, but size differs (old: ${_.get(v)}, new: ${y})`), C = void 0), C === void 0 ? (c++, s != null && s.kind === er.DOWNLOAD && s.end === m ? s.end += y : (s = {
      kind: er.DOWNLOAD,
      start: m,
      end: m + y
      // oldBlocks: null,
    }, Du(s, a, v, g))) : s != null && s.kind === er.COPY && s.end === C ? s.end += y : (s = {
      kind: er.COPY,
      start: C,
      end: C + y
      // oldBlocks: [checksum]
    }, Du(s, a, v, g));
  }
  return c > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${c} changed blocks`), a;
}
const Pv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Du(e, t, r, n) {
  if (Pv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((o, a) => o < a ? o : a);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${er[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function Fv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let s = t;
  for (let o = 0; o < e.checksums.length; o++) {
    const a = e.checksums[o], u = e.sizes[o], p = i.get(a);
    if (p === void 0)
      n.set(a, s), i.set(a, u);
    else if (r.debug != null) {
      const l = p === u ? "(same size)" : `(size: ${p}, this size: ${u})`;
      r.debug(`${a} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    s += u;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Pu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.DataSplitter = void 0;
Ur.copyData = ph;
const Oi = ge, Nv = qt, Uv = $n, Lv = lr, Fu = Buffer.from(`\r
\r
`);
var Dt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Dt || (Dt = {}));
function ph(e, t, r, n, i) {
  const s = (0, Nv.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  s.on("error", n), s.once("end", i), s.pipe(t, {
    end: !1
  });
}
class Bv extends Uv.Writable {
  constructor(t, r, n, i, s, o, a, u) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = o, this.grandTotalBytes = a, this.onProgress = u, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Dt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      n();
    }).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Oi.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Dt.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Dt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Dt.BODY)
          this.readState = Dt.INIT;
        else {
          this.partIndex++;
          let o = this.partIndexToTaskIndex.get(this.partIndex);
          if (o == null)
            if (this.isFinished)
              o = this.options.end;
            else
              throw (0, Oi.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < o)
            await this.copyExistingData(a, o);
          else if (a > o)
            throw (0, Oi.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Dt.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, s = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, s), this.remainingPartDataCount = n - (s - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const s = () => {
        if (t === r) {
          n();
          return;
        }
        const o = this.options.tasks[t];
        if (o.kind !== Lv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        ph(o, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Fu, r);
    if (n !== -1)
      return n + Fu.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Oi.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r, this.transferred += n - r, this.delta += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((s, o) => {
      i.on("error", o), i.once("drain", () => {
        i.removeListener("error", o), s();
      });
    });
  }
}
Ur.DataSplitter = Bv;
var Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.executeTasksUsingMultipleRangeRequests = Mv;
Ls.checkIsRangesSupported = Sa;
const Ta = ge, Nu = Ur, Uu = lr;
function Mv(e, t, r, n, i) {
  const s = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = o + 1e3;
    kv(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => s(a), i);
  };
  return s;
}
function kv(e, t, r, n, i) {
  let s = "bytes=", o = 0, a = 0;
  const u = /* @__PURE__ */ new Map(), p = [];
  for (let d = t.start; d < t.end; d++) {
    const _ = t.tasks[d];
    _.kind === Uu.OperationKind.DOWNLOAD && (s += `${_.start}-${_.end - 1}, `, u.set(o, d), o++, p.push(_.end - _.start), a += _.end - _.start);
  }
  if (o <= 1) {
    const d = (_) => {
      if (_ >= t.end) {
        n();
        return;
      }
      const m = t.tasks[_++];
      if (m.kind === Uu.OperationKind.COPY)
        (0, Nu.copyData)(m, r, t.oldFileFd, i, () => d(_));
      else {
        const g = e.createRequestOptions();
        g.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const y = e.httpExecutor.createRequest(g, (v) => {
          v.on("error", i), Sa(v, i) && (v.pipe(r, {
            end: !1
          }), v.once("end", () => d(_)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(y, i), y.end();
      }
    };
    d(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = s.substring(0, s.length - 2);
  const c = e.httpExecutor.createRequest(l, (d) => {
    if (!Sa(d, i))
      return;
    const _ = (0, Ta.safeGetHeader)(d, "content-type"), m = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(_);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${_}"`));
      return;
    }
    const g = new Nu.DataSplitter(r, t, u, m[1] || m[2], p, n, a, e.options.onProgress);
    g.on("error", i), d.pipe(g), d.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function Sa(e, t) {
  if (e.statusCode >= 400)
    return t((0, Ta.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Ta.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
Bs.ProgressDifferentialDownloadCallbackTransform = void 0;
const qv = $n;
var Cr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Cr || (Cr = {}));
class jv extends qv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Cr.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Cr.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Cr.COPY;
  }
  beginRangeDownload() {
    this.operationType = Cr.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Bs.ProgressDifferentialDownloadCallbackTransform = jv;
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.DifferentialDownloader = void 0;
const Zr = ge, Go = Ht, Hv = qt, Gv = Ur, Wv = jt, Di = lr, Lu = Ls, Vv = Bs;
class zv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Zr.configureRequestUrl)(this.options.newUrl, t), (0, Zr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Di.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, o = 0;
    for (const u of i) {
      const p = u.end - u.start;
      u.kind === Di.OperationKind.DOWNLOAD ? s += p : o += p;
    }
    const a = this.blockAwareFileInfo.size;
    if (s + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${o}, newSize: ${a}`);
    return n.info(`Full: ${Bu(a)}, To download: ${Bu(s)} (${Math.round(s / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Go.close)(i.descriptor).catch((s) => {
      this.logger.error(`cannot close file "${i.path}": ${s}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((s) => {
      try {
        this.logger.error(`cannot close files: ${s}`);
      } catch (o) {
        try {
          console.error(o);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Go.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Go.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, Hv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, a) => {
      const u = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const v = [];
        let C = 0;
        for (const B of t)
          B.kind === Di.OperationKind.DOWNLOAD && (v.push(B.end - B.start), C += B.end - B.start);
        const D = {
          expectedByteCounts: v,
          grandTotal: C
        };
        p = new Vv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), u.push(p);
      }
      const l = new Zr.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, u.push(l), s.on("finish", () => {
        s.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (v) {
            a(v);
            return;
          }
          o(void 0);
        });
      }), u.push(s);
      let c = null;
      for (const v of u)
        v.on("error", a), c == null ? c = v : c = c.pipe(v);
      const d = u[0];
      let _;
      if (this.options.isUseMultipleRangeRequest) {
        _ = (0, Lu.executeTasksUsingMultipleRangeRequests)(this, t, d, n, a), _(0);
        return;
      }
      let m = 0, g = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const y = this.createRequestOptions();
      y.redirect = "manual", _ = (v) => {
        var C, D;
        if (v >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const B = t[v++];
        if (B.kind === Di.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, Gv.copyData)(B, d, n, a, () => _(v));
          return;
        }
        const j = `bytes=${B.start}-${B.end - 1}`;
        y.headers.range = j, (D = (C = this.logger) === null || C === void 0 ? void 0 : C.debug) === null || D === void 0 || D.call(C, `download range: ${j}`), p && p.beginRangeDownload();
        const J = this.httpExecutor.createRequest(y, (X) => {
          X.on("error", a), X.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), X.statusCode >= 400 && a((0, Zr.createHttpError)(X)), X.pipe(d, {
            end: !1
          }), X.once("end", () => {
            p && p.endRangeDownload(), ++m === 100 ? (m = 0, setTimeout(() => _(v), 1e3)) : _(v);
          });
        });
        J.on("redirect", (X, re, M) => {
          this.logger.info(`Redirect to ${Yv(M)}`), g = M, (0, Zr.configureRequestUrl)(new Wv.URL(g), y), J.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(J, a), J.end();
      }, _(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let s = 0;
    if (await this.request(i, (o) => {
      o.copy(n, s), s += o.length;
    }), s !== n.length)
      throw new Error(`Received data length ${s} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const s = this.httpExecutor.createRequest(t, (o) => {
        (0, Lu.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
qn.DifferentialDownloader = zv;
function Bu(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Yv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.GenericDifferentialDownloader = void 0;
const Xv = qn;
class Kv extends Xv.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Us.GenericDifferentialDownloader = Kv;
var Gt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = ge;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(s) {
      this.emitter = s;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(s) {
      n(this.emitter, "login", s);
    }
    progress(s) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, s);
    }
    updateDownloaded(s) {
      n(this.emitter, e.UPDATE_DOWNLOADED, s);
    }
    updateCancelled(s) {
      n(this.emitter, "update-cancelled", s);
    }
  }
  e.UpdaterSignal = r;
  function n(i, s, o) {
    i.on(s, o);
  }
})(Gt);
Object.defineProperty(Lt, "__esModule", { value: !0 });
Lt.NoOpLogger = Lt.AppUpdater = void 0;
const De = ge, Jv = On, Qv = _s, Zv = Pa, Ze = Ht, eR = Ce, Wo = Rs, Ve = ne, Jt = sh, Mu = Mn, tR = $s, ku = oh, rR = kn, Vo = Os, zo = Kf, nR = Us, _r = Gt;
class dl extends Zv.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, De.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, De.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, ku.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new _h();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Wo.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new _r.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new Wo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Wo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new tR.ElectronAppAdapter(), this.httpExecutor = new ku.ElectronHttpExecutor((s, o) => this.emit("login", s, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Jt.parse)(n);
    if (i == null)
      throw (0, De.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = iR(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](https://www.electron.build/publish#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new rR.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Vo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Vo.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = dl.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new rr.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, o = De.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Jt.parse)(t.version);
    if (r == null)
      throw (0, De.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Jt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, Jt.gt)(r, n), o = (0, Jt.lt)(r, n);
    return s ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, Qv.release)();
    if (r)
      try {
        if ((0, Jt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Vo.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new De.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, De.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new De.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, De.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof De.CancellationError))
        try {
          this.dispatchError(i);
        } catch (s) {
          this._logger.warn(`Cannot dispatch error event: ${s.stack || s}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(_r.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, eR.load)(await (0, Ze.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Ve.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Ze.readFile)(t, "utf-8");
      if (De.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = De.UUID.v5((0, Jv.randomBytes)(4096), De.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Ze.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Ve.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Mu.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(_r.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (C) => this.emit(_r.DOWNLOAD_PROGRESS, C));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, o = r.packageInfo;
    function a() {
      const C = decodeURIComponent(t.fileInfo.url.pathname);
      return C.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ve.basename(C) : Ve.basename(t.fileInfo.info.url);
    }
    const u = await this.getOrCreateDownloadHelper(), p = u.cacheDirForPendingUpdate;
    await (0, Ze.mkdir)(p, { recursive: !0 });
    const l = a();
    let c = Ve.join(p, l);
    const d = o == null ? null : Ve.join(p, `package-${s}${Ve.extname(o.path) || ".7z"}`), _ = async (C) => {
      await u.setDownloadedFile(c, d, i, r, l, C), await t.done({
        ...i,
        downloadedFile: c
      });
      const D = Ve.join(p, "current.blockmap");
      return await (0, Ze.pathExists)(D) && await (0, Ze.copyFile)(D, Ve.join(u.cacheDir, "current.blockmap")), d == null ? [c] : [c, d];
    }, m = this._logger, g = await u.validateDownloadedPath(c, i, r, m);
    if (g != null)
      return c = g, await _(!1);
    const y = async () => (await u.clear().catch(() => {
    }), await (0, Ze.unlink)(c).catch(() => {
    })), v = await (0, Mu.createTempUpdateFile)(`temp-${l}`, p, m);
    try {
      await t.task(v, n, d, y), await (0, De.retry)(() => (0, Ze.rename)(v, c), {
        retries: 60,
        interval: 500,
        shouldRetry: (C) => C instanceof Error && /^EBUSY:/.test(C.message) ? !0 : (m.warn(`Cannot rename temp file to final file: ${C.message || C.stack}`), !1)
      });
    } catch (C) {
      throw await y(), C instanceof De.CancellationError && (m.info("cancelled"), this.emit("update-cancelled", i)), C;
    }
    return m.info(`New version ${s} has been downloaded to ${c}`), await _(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = r.updateInfoAndProvider.provider, a = await o.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const u = async (m) => {
        const g = await this.httpExecutor.downloadToBuffer(m, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (g == null || g.length === 0)
          throw new Error(`Blockmap "${m.href}" is empty`);
        try {
          return JSON.parse((0, zo.gunzipSync)(g).toString());
        } catch (y) {
          throw new Error(`Cannot parse blockmap "${m.href}", error: ${y}`);
        }
      }, p = {
        newUrl: t.url,
        oldFile: Ve.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: o.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(_r.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (m) => this.emit(_r.DOWNLOAD_PROGRESS, m));
      const l = async (m, g) => {
        const y = Ve.join(g, "current.blockmap");
        await (0, Ze.outputFile)(y, (0, zo.gzipSync)(JSON.stringify(m)));
      }, c = async (m) => {
        const g = Ve.join(m, "current.blockmap");
        try {
          if (await (0, Ze.pathExists)(g))
            return JSON.parse((0, zo.gunzipSync)(await (0, Ze.readFile)(g)).toString());
        } catch (y) {
          this._logger.warn(`Cannot parse blockmap "${g}", error: ${y}`);
        }
        return null;
      }, d = await u(a[1]);
      await l(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let _ = await c(this.downloadedUpdateHelper.cacheDir);
      return _ == null && (_ = await u(a[0])), await new nR.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(_, d), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
Lt.AppUpdater = dl;
function iR(e) {
  const t = (0, Jt.prerelease)(e);
  return t != null && t.length > 0;
}
class _h {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
Lt.NoOpLogger = _h;
Object.defineProperty(or, "__esModule", { value: !0 });
or.BaseUpdater = void 0;
const qu = ps, Yo = ne, sR = Lt;
class oR extends sR.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      rr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, s = n == null ? null : n.downloadedFileInfo;
    if (i == null || s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: s.isAdminRightsRequired
      });
    } catch (o) {
      return this.dispatchError(o), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  /**
   * Strips relative-path entries from a PATH string.
   * Prevents PATH-poisoning where a writable directory earlier in PATH shadows
   * a trusted package manager binary.
   */
  sanitizeEnvPath(t) {
    return t.split(Yo.delimiter).filter((r) => Yo.isAbsolute(r)).join(Yo.delimiter);
  }
  spawnSyncLog(t, r = [], n = {}) {
    var i;
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const s = { ...process.env, ...n }, o = (0, qu.spawnSync)(t, r, {
      env: { ...s, PATH: this.sanitizeEnvPath((i = s.PATH) !== null && i !== void 0 ? i : "") },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: u, stdout: p, stderr: l } = o;
    if (a != null)
      throw this._logger.error(l), a;
    if (u != null && u !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${u}`);
    return p.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((s, o) => {
      try {
        const a = { stdio: i, env: n, detached: !0 }, u = (0, qu.spawn)(t, r, a);
        u.on("error", (p) => {
          o(p);
        }), u.unref(), u.pid !== void 0 && s(!0);
      } catch (a) {
        o(a);
      }
    });
  }
}
or.BaseUpdater = oR;
var wn = {}, jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const xr = Ht, aR = qn, lR = Kf;
class cR extends aR.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = xh(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await uR(this.options.oldFile), i);
  }
}
jn.FileWithEmbeddedBlockMapDifferentialDownloader = cR;
function xh(e) {
  return JSON.parse((0, lR.inflateRawSync)(e).toString());
}
async function uR(e) {
  const t = await (0, xr.open)(e, "r");
  try {
    const r = (await (0, xr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, xr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, xr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, xr.close)(t), xh(i);
  } catch (r) {
    throw await (0, xr.close)(t), r;
  }
}
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.AppImageUpdater = void 0;
const Xo = ge, ju = ps, fR = Ht, dR = qt, mr = ne, hR = or, pR = jn, _R = pe, Hu = Gt;
class xR extends hR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, _R.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, Xo.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, fR.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, s) {
    try {
      const o = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: s.requestHeaders,
        cancellationToken: s.cancellationToken
      };
      return this.listenerCount(Hu.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Hu.DOWNLOAD_PROGRESS, a)), await new pR.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Xo.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    if (!mr.isAbsolute(r) || r.includes("\0"))
      throw (0, Xo.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, dR.unlinkSync)(r);
    let n;
    const i = mr.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    mr.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = mr.join(mr.dirname(r), mr.basename(s)), (0, ju.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, ju.execFileSync)(n, [], { env: o })), !0;
  }
}
wn.AppImageUpdater = xR;
var vn = {}, Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.LinuxUpdater = void 0;
const mR = or, gR = /^[a-zA-Z0-9_-]+$/;
class yR extends mR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizes the installer path for use with shell:true spawn calls.
   * Backslash-escapes metacharacters that have special meaning in POSIX shell.
   * Note: paths containing single-quotes (') are not supported.
   */
  get installerPath() {
    const t = super.installerPath;
    return t == null ? null : t.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, i = `"${r.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, s = this.sudoWithArgs(i);
    this._logger.info(`Running as non-root user, using sudo to install: ${s}`);
    let o = '"';
    return (/pkexec/i.test(s[0]) || s[0] === "sudo") && (o = ""), this.spawnSyncLog(s[0], [...s.length > 1 ? s.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    let n = t;
    const i = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    i && (gR.test(i) ? n = [i] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${i}" contains unsafe characters. Ignoring override.`));
    for (const a of n)
      if (this.hasCommand(a))
        return a;
    const s = i ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${i}", ` : "", o = t[0];
    return this._logger.warn(`No package manager found in the list: ${s}${t.join(", ")}. Utilizing default: ${o}`), o;
  }
}
Lr.LinuxUpdater = yR;
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.DebUpdater = void 0;
const ER = pe, Gu = Gt, bR = Lr;
class hl extends bR.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, ER.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Gu.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Gu.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      hl.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var s;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (o) {
        i.warn((s = o.message) !== null && s !== void 0 ? s : o), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
vn.DebUpdater = hl;
var Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.PacmanUpdater = void 0;
const Wu = Gt, wR = pe, vR = Lr;
class pl extends vR.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, wR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Wu.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Wu.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      pl.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (s) {
      n.warn((i = s.message) !== null && i !== void 0 ? i : s), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (o) {
        throw n.error("Retry after pacman -Sy failed"), o;
      }
    }
  }
}
Rn.PacmanUpdater = pl;
var Cn = {};
Object.defineProperty(Cn, "__esModule", { value: !0 });
Cn.RpmUpdater = void 0;
const Vu = Gt, RR = pe, CR = Lr;
class _l extends CR.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, RR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Vu.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Vu.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      _l.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Cn.RpmUpdater = _l;
var In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.MacUpdater = void 0;
const zu = ge, Ko = Ht, IR = qt, Yu = ne, AR = n_, TR = Lt, SR = pe, Xu = ps, Ku = On;
class xl extends TR.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = rr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  /** Filters update files to the appropriate architecture.
   * On arm64 Macs (including Rosetta), arm64 files are preferred when available.
   * On x64 Macs, arm64 files are excluded. */
  static filterFilesForArch(t, r) {
    const n = (i) => {
      var s;
      return i.url.pathname.includes("arm64") || ((s = i.info.url) === null || s === void 0 ? void 0 : s.includes("arm64"));
    };
    return r && t.some(n) ? t.filter((i) => r === n(i)) : t.filter((i) => !n(i));
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let s = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), s = (0, Xu.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (l) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${l}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const c = (0, Xu.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${c}`), o = o || c;
    } catch (l) {
      n.warn(`uname shell command to check for arm64 failed: ${l}`);
    }
    o = o || process.arch === "arm64" || s, r = xl.filterFilesForArch(r, o);
    const a = (0, SR.findFile)(r, "zip", ["pkg", "dmg"]);
    if (a == null)
      throw (0, zu.newError)(`ZIP file not provided: ${(0, zu.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, p = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: a,
      downloadUpdateOptions: t,
      task: async (l, c) => {
        const d = Yu.join(this.downloadedUpdateHelper.cacheDir, p), _ = () => (0, Ko.pathExistsSync)(d) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let m = !0;
        _() && (m = await this.differentialDownloadInstaller(a, t, l, u, p)), m && await this.httpExecutor.download(a.url, l, c);
      },
      done: async (l) => {
        if (!t.disableDifferentialDownload)
          try {
            const c = Yu.join(this.downloadedUpdateHelper.cacheDir, p);
            await (0, Ko.copyFile)(l.downloadedFile, c);
          } catch (c) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${c.message}`);
          }
        return this.updateDownloaded(a, l);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ko.stat)(i)).size, o = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, AR.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const u = (p) => {
      const l = p.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((p, l) => {
      const c = (0, Ku.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${c}`, "ascii"), _ = `/${(0, Ku.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (m, g) => {
        const y = m.url;
        if (o.info(`${y} requested`), y === "/") {
          if (!m.headers.authorization || m.headers.authorization.indexOf("Basic ") === -1) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), o.warn("No authenthication info");
            return;
          }
          const D = m.headers.authorization.split(" ")[1], B = Buffer.from(D, "base64").toString("ascii"), [j, J] = B.split(":");
          if (j !== "autoupdater" || J !== c) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const X = Buffer.from(`{ "url": "${u(this.server)}${_}" }`);
          g.writeHead(200, { "Content-Type": "application/json", "Content-Length": X.length }), g.end(X);
          return;
        }
        if (!y.startsWith(_)) {
          o.warn(`${y} requested, but not supported`), g.writeHead(404), g.end();
          return;
        }
        o.info(`${_} requested by Squirrel.Mac, pipe ${i}`);
        let v = !1;
        g.on("finish", () => {
          v || (this.nativeUpdater.removeListener("error", l), p([]));
        });
        const C = (0, IR.createReadStream)(i);
        C.on("error", (D) => {
          try {
            g.end();
          } catch (B) {
            o.warn(`cannot end response: ${B}`);
          }
          v = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${D}`));
        }), g.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), C.pipe(g);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${u(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: u(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${d.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : p([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
In.MacUpdater = xl;
var An = {}, ml = {};
Object.defineProperty(ml, "__esModule", { value: !0 });
ml.verifySignature = OR;
const Ju = ge, mh = ps, $R = _s, Qu = ne;
function gh(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function OR(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, mh.execFile)(...gh(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (o, a, u) => {
      var p;
      try {
        if (o != null || u) {
          Jo(r, o, u, i), n(null);
          return;
        }
        const l = DR(a);
        if (l.Status === 0) {
          try {
            const m = Qu.normalize(l.Path), g = Qu.normalize(t);
            if (r.info(`LiteralPath: ${m}. Update Path: ${g}`), m !== g) {
              Jo(r, new Error(`LiteralPath of ${m} is different than ${g}`), u, i), n(null);
              return;
            }
          } catch (m) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = m.message) !== null && p !== void 0 ? p : m.stack}`);
          }
          const d = (0, Ju.parseDn)(l.SignerCertificate.Subject);
          let _ = !1;
          for (const m of e) {
            const g = (0, Ju.parseDn)(m);
            if (g.size ? _ = Array.from(g.keys()).every((v) => g.get(v) === d.get(v)) : m === d.get("CN") && (r.warn(`Signature validated using only CN ${m}. Please add your full Distinguished Name (DN) to publisherNames configuration`), _ = !0), _) {
              n(null);
              return;
            }
          }
        }
        const c = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (d, _) => d === "RawData" ? void 0 : _, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${c}`), n(c);
      } catch (l) {
        Jo(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function DR(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Jo(e, t, r, n) {
  if (PR()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, mh.execFileSync)(...gh("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function PR() {
  const e = $R.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(An, "__esModule", { value: !0 });
An.NsisUpdater = void 0;
const Pi = ge, Zu = ne, FR = or, NR = jn, ef = Gt, UR = pe, LR = Ht, BR = ml, tf = jt;
class MR extends FR.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, BR.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, UR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, o, a) => {
        const u = n.packageInfo, p = u != null && o != null;
        if (p && t.disableWebInstaller)
          throw (0, Pi.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Pi.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, Pi.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, u, o, r))
          try {
            await this.httpExecutor.download(new tf.URL(u.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: u.sha512
            });
          } catch (c) {
            try {
              await (0, LR.unlink)(o);
            } catch {
            }
            throw c;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const s = () => {
      this.spawnLog(Zu.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((o) => {
      const a = o.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? s() : a === "ENOENT" ? rr.shell.openPath(r).catch((u) => this.dispatchError(u)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new tf.URL(r.path),
        oldFile: Zu.join(this.downloadedUpdateHelper.cacheDir, Pi.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(ef.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(ef.DOWNLOAD_PROGRESS, o)), await new NR.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
An.NsisUpdater = MR;
(function(e) {
  var t = S && S.__createBinding || (Object.create ? function(y, v, C, D) {
    D === void 0 && (D = C);
    var B = Object.getOwnPropertyDescriptor(v, C);
    (!B || ("get" in B ? !v.__esModule : B.writable || B.configurable)) && (B = { enumerable: !0, get: function() {
      return v[C];
    } }), Object.defineProperty(y, D, B);
  } : function(y, v, C, D) {
    D === void 0 && (D = C), y[D] = v[C];
  }), r = S && S.__exportStar || function(y, v) {
    for (var C in y) C !== "default" && !Object.prototype.hasOwnProperty.call(v, C) && t(v, y, C);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Ht, i = ne;
  var s = or;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var o = Lt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var a = pe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var u = wn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return u.AppImageUpdater;
  } });
  var p = vn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var l = Rn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var c = Cn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return c.RpmUpdater;
  } });
  var d = In;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var _ = An;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return _.NsisUpdater;
  } }), r(Gt, e);
  let m;
  function g() {
    if (process.platform === "win32")
      m = new An.NsisUpdater();
    else if (process.platform === "darwin")
      m = new In.MacUpdater();
    else {
      m = new wn.AppImageUpdater();
      try {
        const y = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(y))
          return m;
        switch ((0, n.readFileSync)(y).toString().trim()) {
          case "deb":
            m = new vn.DebUpdater();
            break;
          case "rpm":
            m = new Cn.RpmUpdater();
            break;
          case "pacman":
            m = new Rn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (y) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", y.message);
      }
    }
    return m;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => m || g()
  });
})(at);
const rf = 512 * 1024 * 1024;
function kR(e) {
  const t = (r) => {
    const n = e();
    if (!n || n.isDestroyed() || r !== n.webContents)
      throw new Error("Unauthorized backup request");
    return n;
  };
  Ye.handle("backup:save", async (r, n) => {
    const i = t(r.sender);
    if (!(n instanceof Uint8Array) || n.byteLength === 0 || n.byteLength > rf)
      throw new Error("Backup archive is invalid or exceeds the 512 MB limit");
    const { canceled: s, filePath: o } = await dn.showSaveDialog(i, {
      title: "Export Database Backup",
      defaultPath: Pe.join(ft.getPath("documents"), `AKDI-MAKINE-Backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`),
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }]
    });
    return s || !o ? { canceled: !0 } : (await Na(o, Buffer.from(n)), { canceled: !1, filePath: o });
  }), Ye.handle("backup:open", async (r) => {
    const n = t(r.sender), { canceled: i, filePaths: s } = await dn.showOpenDialog(n, {
      title: "Restore Database Backup",
      properties: ["openFile"],
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }]
    });
    if (i || s.length === 0) return { canceled: !0 };
    const o = s[0], a = await s_(o);
    if (a.size === 0 || a.size > rf)
      throw new Error("Backup archive is empty or exceeds the 512 MB limit");
    const u = await Jf(o);
    return { canceled: !1, bytes: new Uint8Array(u) };
  });
}
const qR = 10 * 1024 * 1024, jR = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]), HR = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function yh() {
  return Pe.join(ft.getPath("userData"), "images");
}
function Qo(e) {
  if (typeof e != "string" || !HR.test(e))
    throw new Error("Invalid image ID");
  return Pe.join(yh(), e);
}
function GR(e, t) {
  return e === "image/jpeg" ? t[0] === 255 && t[1] === 216 && t[2] === 255 : e === "image/png" ? t.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10" : e === "image/gif" ? new TextDecoder().decode(t.subarray(0, 3)) === "GIF" : e === "image/webp" ? new TextDecoder().decode(t.subarray(0, 4)) === "RIFF" && new TextDecoder().decode(t.subarray(8, 12)) === "WEBP" : e === "image/bmp" ? new TextDecoder().decode(t.subarray(0, 2)) === "BM" : !1;
}
function WR(e, t) {
  const r = (i) => {
    const s = e();
    if (!s || s.isDestroyed() || i !== s.webContents)
      throw new Error("Unauthorized image request");
  }, n = (i) => {
    const s = e();
    if ((!s || s.isDestroyed() || i !== s.webContents) && !t(i))
      throw new Error("Unauthorized image request");
  };
  Ye.handle("images:save", async (i, s) => {
    if (r(i.sender), !s || typeof s != "object") throw new Error("Invalid image upload");
    const o = s;
    if (typeof o.name != "string" || typeof o.type != "string" || !(o.bytes instanceof Uint8Array))
      throw new Error("Invalid image upload");
    const a = o.bytes, u = Pe.basename(o.name).slice(0, 255), p = o.type.toLowerCase();
    if (!u || !jR.has(p) || a.byteLength === 0 || a.byteLength > qR || !GR(p, a))
      throw new Error("Image must be a supported raster image no larger than 10 MB");
    const l = l_();
    return await o_(yh(), { recursive: !0 }), await Na(Qo(l), Buffer.from(a)), { id: l, name: u, type: p, size: a.byteLength };
  }), Ye.handle("images:read", async (i, s) => {
    n(i.sender);
    try {
      const o = await Jf(Qo(s));
      return { bytes: new Uint8Array(o) };
    } catch (o) {
      if (o.code === "ENOENT") return null;
      throw o;
    }
  }), Ye.handle("images:delete", async (i, s) => {
    r(i.sender), await a_(Qo(s), { force: !0 });
  });
}
var ie = {}, gl = {}, Hn = {}, $a = { exports: {} }, Fi = { exports: {} }, Zo, nf;
function Eh() {
  if (nf) return Zo;
  nf = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = o, n.enabled = u, n.humanize = kd(), Object.keys(t).forEach(function(l) {
      n[l] = t[l];
    }), n.instances = [], n.names = [], n.skips = [], n.formatters = {};
    function r(l) {
      for (var c = 0, d = 0; d < l.length; d++)
        c = (c << 5) - c + l.charCodeAt(d), c |= 0;
      return n.colors[Math.abs(c) % n.colors.length];
    }
    n.selectColor = r;
    function n(l) {
      var c;
      function d() {
        if (d.enabled) {
          for (var _ = arguments.length, m = new Array(_), g = 0; g < _; g++)
            m[g] = arguments[g];
          var y = d, v = Number(/* @__PURE__ */ new Date()), C = v - (c || v);
          y.diff = C, y.prev = c, y.curr = v, c = v, m[0] = n.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
          var D = 0;
          m[0] = m[0].replace(/%([a-zA-Z%])/g, function(j, J) {
            if (j === "%%")
              return j;
            D++;
            var X = n.formatters[J];
            if (typeof X == "function") {
              var re = m[D];
              j = X.call(y, re), m.splice(D, 1), D--;
            }
            return j;
          }), n.formatArgs.call(y, m);
          var B = y.log || n.log;
          B.apply(y, m);
        }
      }
      return d.namespace = l, d.enabled = n.enabled(l), d.useColors = n.useColors(), d.color = r(l), d.destroy = i, d.extend = s, typeof n.init == "function" && n.init(d), n.instances.push(d), d;
    }
    function i() {
      var l = n.instances.indexOf(this);
      return l !== -1 ? (n.instances.splice(l, 1), !0) : !1;
    }
    function s(l, c) {
      return n(this.namespace + (typeof c > "u" ? ":" : c) + l);
    }
    function o(l) {
      n.save(l), n.names = [], n.skips = [];
      var c, d = (typeof l == "string" ? l : "").split(/[\s,]+/), _ = d.length;
      for (c = 0; c < _; c++)
        d[c] && (l = d[c].replace(/\*/g, ".*?"), l[0] === "-" ? n.skips.push(new RegExp("^" + l.substr(1) + "$")) : n.names.push(new RegExp("^" + l + "$")));
      for (c = 0; c < n.instances.length; c++) {
        var m = n.instances[c];
        m.enabled = n.enabled(m.namespace);
      }
    }
    function a() {
      n.enable("");
    }
    function u(l) {
      if (l[l.length - 1] === "*")
        return !0;
      var c, d;
      for (c = 0, d = n.skips.length; c < d; c++)
        if (n.skips[c].test(l))
          return !1;
      for (c = 0, d = n.names.length; c < d; c++)
        if (n.names[c].test(l))
          return !0;
      return !1;
    }
    function p(l) {
      return l instanceof Error ? l.stack || l.message : l;
    }
    return n.enable(n.load()), n;
  }
  return Zo = e, Zo;
}
var sf;
function VR() {
  return sf || (sf = 1, function(e, t) {
    function r(l) {
      return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? r = function(d) {
        return typeof d;
      } : r = function(d) {
        return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
      }, r(l);
    }
    t.log = s, t.formatArgs = i, t.save = o, t.load = a, t.useColors = n, t.storage = u(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function n() {
      return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? !1 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function i(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !!this.useColors) {
        var c = "color: " + this.color;
        l.splice(1, 0, c, "color: inherit");
        var d = 0, _ = 0;
        l[0].replace(/%[a-zA-Z%]/g, function(m) {
          m !== "%%" && (d++, m === "%c" && (_ = d));
        }), l.splice(_, 0, c);
      }
    }
    function s() {
      var l;
      return (typeof console > "u" ? "undefined" : r(console)) === "object" && console.log && (l = console).log.apply(l, arguments);
    }
    function o(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function a() {
      var l;
      try {
        l = t.storage.getItem("debug");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function u() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Eh()(t);
    var p = e.exports.formatters;
    p.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (c) {
        return "[UnexpectedJSONParseError]: " + c.message;
      }
    };
  }(Fi, Fi.exports)), Fi.exports;
}
var Ni = { exports: {} }, of;
function zR() {
  return of || (of = 1, function(e, t) {
    var r = Fa, n = hs;
    t.init = c, t.log = u, t.formatArgs = o, t.save = p, t.load = l, t.useColors = s, t.colors = [6, 2, 3, 4, 5, 1];
    try {
      var i = jd();
      i && (i.stderr || i).level >= 2 && (t.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter(function(_) {
      return /^debug_/i.test(_);
    }).reduce(function(_, m) {
      var g = m.substring(6).toLowerCase().replace(/_([a-z])/g, function(v, C) {
        return C.toUpperCase();
      }), y = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), _[g] = y, _;
    }, {});
    function s() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(_) {
      var m = this.namespace, g = this.useColors;
      if (g) {
        var y = this.color, v = "\x1B[3" + (y < 8 ? y : "8;5;" + y), C = "  ".concat(v, ";1m").concat(m, " \x1B[0m");
        _[0] = C + _[0].split(`
`).join(`
` + C), _.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        _[0] = a() + m + " " + _[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u() {
      return process.stderr.write(n.format.apply(n, arguments) + `
`);
    }
    function p(_) {
      _ ? process.env.DEBUG = _ : delete process.env.DEBUG;
    }
    function l() {
      return process.env.DEBUG;
    }
    function c(_) {
      _.inspectOpts = {};
      for (var m = Object.keys(t.inspectOpts), g = 0; g < m.length; g++)
        _.inspectOpts[m[g]] = t.inspectOpts[m[g]];
    }
    e.exports = Eh()(t);
    var d = e.exports.formatters;
    d.o = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts).split(`
`).map(function(m) {
        return m.trim();
      }).join(" ");
    }, d.O = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts);
    };
  }(Ni, Ni.exports)), Ni.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? $a.exports = VR() : $a.exports = zR();
var de = $a.exports, te = {}, Br = {}, se = {}, bh = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ErrorMessages = {
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
  function t(n) {
    if (r(n))
      return e.ErrorMessages[n];
    throw new Error("");
  }
  e.errorCodeToMessage = t;
  function r(n) {
    switch (n) {
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
  e.isErrorCode = r;
})(bh);
var wh = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  var t;
  (function(n) {
    n[n.READ_COIL = 1] = "READ_COIL", n[n.READ_DISCRETE_INPUT = 2] = "READ_DISCRETE_INPUT", n[n.READ_HOLDING_REGISTERS = 3] = "READ_HOLDING_REGISTERS", n[n.READ_INPUT_REGISTERS = 4] = "READ_INPUT_REGISTERS", n[n.WRITE_SINGLE_COIL = 5] = "WRITE_SINGLE_COIL", n[n.WRITE_SINGLE_HOLDING_REGISTER = 6] = "WRITE_SINGLE_HOLDING_REGISTER", n[n.WRITE_MULTIPLE_COILS = 15] = "WRITE_MULTIPLE_COILS", n[n.WRITE_MULTIPLE_HOLDING_REGISTERS = 16] = "WRITE_MULTIPLE_HOLDING_REGISTERS";
  })(t = e.FC || (e.FC = {}));
  function r(n) {
    return t[n] !== void 0;
  }
  e.isFunctionCode = r;
})(wh);
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(bh), t(wh);
})(se);
var He = {}, YR = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(He, "__esModule", { value: !0 });
const XR = YR(de);
XR.default("request-body");
class yl {
  constructor(t) {
    if (new.target === yl)
      throw new TypeError("Cannot construct ModbusRequestBody directly.");
    this._fc = t;
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
He.default = yl;
function KR(e) {
  return !!e.isModbusRequestBody;
}
He.isModbusRequestBody = KR;
var JR = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Br, "__esModule", { value: !0 });
const QR = se, ZR = JR(He);
class Ms extends ZR.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      return r > 43 ? null : new Ms(r, 1);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (!QR.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    super(t), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._code, 1), t;
  }
}
Br.default = Ms;
function eC(e) {
  return e instanceof Ms;
}
Br.isExceptionRequestBody = eC;
var Gn = {}, tC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Gn, "__esModule", { value: !0 });
const af = se, rC = tC(He);
class ks extends rC.default {
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
  static fromBuffer(t) {
    try {
      if (t.readUInt8(0) !== af.FC.READ_COIL)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new ks(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(af.FC.READ_COIL), this._start = t, this._count = r, this._start > 65535)
      throw new Error("InvalidStartAddress");
    if (this._count > 2e3)
      throw new Error("InvalidQuantity");
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
Gn.default = ks;
function nC(e) {
  return e instanceof ks;
}
Gn.isReadCoilsRequestBody = nC;
var Wn = {}, iC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Wn, "__esModule", { value: !0 });
const lf = se, sC = iC(He);
class qs extends sC.default {
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
  static fromBuffer(t) {
    try {
      if (t.readUInt8(0) !== lf.FC.READ_DISCRETE_INPUT)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new qs(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(lf.FC.READ_DISCRETE_INPUT), t > 65535)
      throw new Error("InvalidStartAddress");
    if (r > 2e3)
      throw new Error("InvalidQuantity");
    this._start = t, this._count = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
Wn.default = qs;
function oC(e) {
  return e instanceof qs;
}
Wn.isReadDiscreteInputsRequestBody = oC;
var Vn = {}, aC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Vn, "__esModule", { value: !0 });
const cf = se, lC = aC(He);
class js extends lC.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return r !== cf.FC.READ_HOLDING_REGISTERS ? null : new js(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(cf.FC.READ_HOLDING_REGISTERS), t > 65535)
      throw new Error("InvalidStartAddress");
    if (r > 2e3)
      throw new Error("InvalidQuantity");
    this._start = t, this._count = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
Vn.default = js;
function cC(e) {
  return e instanceof js;
}
Vn.isReadHoldingRegistersRequestBody = cC;
var zn = {}, uC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(zn, "__esModule", { value: !0 });
const uf = se, fC = uC(He);
class Hs extends fC.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return r !== uf.FC.READ_INPUT_REGISTERS ? null : new Hs(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(uf.FC.READ_INPUT_REGISTERS), t > 65535)
      throw new Error("InvalidStartAddress");
    if (r > 2e3)
      throw new Error("InvalidQuantity");
    this._start = t, this._count = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
zn.default = Hs;
function dC(e) {
  return e instanceof Hs;
}
zn.isReadInputRegistersRequestBody = dC;
var Yn = {}, Xn = {}, hC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Xn, "__esModule", { value: !0 });
const ff = se, pC = hC(He);
class Gs extends pC.default {
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
  static fromBuffer(t) {
    try {
      if (t.readUInt8(0) !== ff.FC.WRITE_MULTIPLE_COILS)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3), s = t.readUInt8(5), o = t.slice(6, 6 + s);
      return new Gs(n, o, i);
    } catch {
      return null;
    }
  }
  constructor(t, r, n) {
    if (super(ff.FC.WRITE_MULTIPLE_COILS), t > 65535)
      throw new Error("InvalidStartAddress");
    if (Array.isArray(r) && r.length > 1968 * 8)
      throw new Error("InvalidArraySize");
    if (r instanceof Buffer) {
      if (r.length > 1968)
        throw new Error("InvalidBufferSize");
      if (n !== void 0 && r.length * 8 < n)
        throw new Error("InvalidBufferSize");
    }
    if (this._address = t, this._values = r, this._quantity = n || r.length, this._numberOfBytes = Math.ceil(this._quantity / 8), this._values instanceof Buffer) {
      this._valuesAsBuffer = this._values, this._byteCount = Math.ceil(this._quantity / 8) + 6, this._valuesAsArray = [];
      for (let i = 0; i < this._quantity; i += 1) {
        const s = i % 8, o = Math.floor(i / 8), a = this._values.readUInt8(o);
        this._valuesAsArray.push((a & Math.pow(2, s)) > 0);
      }
    } else if (this._values instanceof Array) {
      this._byteCount = Math.ceil(this._values.length / 8) + 6, this._valuesAsArray = this._values;
      const i = Math.min(1968, this._values.length);
      let s = 0, o = 0, a = 0;
      const u = Buffer.allocUnsafe(this._numberOfBytes);
      for (let p = 0; p < i; p += 1)
        s += this._values[p] ? Math.pow(2, a) : 0, a = (a + 1) % 8, (a === 0 || p === i - 1) && (u.writeUInt8(s, o), o = o + 1, s = 0);
      this._valuesAsBuffer = u;
    } else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(this._byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._quantity, 3), t.writeUInt8(this._numberOfBytes, 5), this._valuesAsBuffer.copy(t, 6, 0, this._byteCount), t;
  }
}
Xn.default = Gs;
function _C(e) {
  return e instanceof Gs;
}
Xn.isWriteMultipleCoilsRequestBody = _C;
var Kn = {}, xC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Kn, "__esModule", { value: !0 });
const df = se, mC = xC(He);
class Ws extends mC.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt8(5), s = t.slice(6, 6 + i);
      return r !== df.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new Ws(n, s);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(df.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), t > 65535)
      throw new Error("InvalidStartAddress");
    if (Array.isArray(r) && r.length > 123)
      throw new Error("InvalidArraySize");
    if (r instanceof Buffer && r.length > 123 * 2)
      throw new Error("InvalidBufferSize");
    if (this._address = t, this._values = r, this._values instanceof Buffer) {
      this._byteCount = Math.min(this._values.length + 6, 246), this._numberOfBytes = this._values.length, this._quantity = Math.floor(this._values.length / 2), this._valuesAsBuffer = this._values, this._valuesAsArray = [];
      for (let n = 0; n < this._values.length; n += 2)
        this._valuesAsArray.push(this._values.readUInt16BE(n));
    } else if (this._values instanceof Array)
      this._valuesAsArray = this._values, this._byteCount = Math.min(this._values.length * 2 + 6, 246), this._numberOfBytes = Math.floor(this._values.length * 2), this._quantity = this._values.length, this._valuesAsBuffer = Buffer.alloc(this._numberOfBytes), this._values.forEach((n, i) => {
        this._valuesAsBuffer.writeUInt16BE(n, i * 2);
      });
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(6 + this._numberOfBytes);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._quantity, 3), t.writeUInt8(this._numberOfBytes, 5), this._valuesAsBuffer.copy(t, 6), t;
  }
}
Kn.default = Ws;
function gC(e) {
  return e instanceof Ws;
}
Kn.isWriteMultipleRegistersRequestBody = gC;
var Jn = {}, yC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const hf = se, EC = yC(He);
class Vs extends EC.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3) === 65280;
      return r !== hf.FC.WRITE_SINGLE_COIL ? null : new Vs(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(hf.FC.WRITE_SINGLE_COIL), t > 65535)
      throw new Error("InvalidStartAddress");
    this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value ? 65280 : 0, 3), t;
  }
}
Jn.default = Vs;
function bC(e) {
  return e instanceof Vs;
}
Jn.isWriteSingleCoilRequestBody = bC;
var Qn = {}, wC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Qn, "__esModule", { value: !0 });
const pf = se, vC = wC(He);
class zs extends vC.default {
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
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return r !== pf.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new zs(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(pf.FC.WRITE_SINGLE_HOLDING_REGISTER), t > 65535)
      throw new Error("InvalidStartAddress");
    if (!Number.isInteger(r) || r < 0 || r > 65535)
      throw new Error("InvalidValue");
    this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
Qn.default = zs;
function RC(e) {
  return e instanceof zs;
}
Qn.isWriteSingleRegisterRequestBody = RC;
var pt = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Yn, "__esModule", { value: !0 });
const gt = se, CC = pt(Br), IC = pt(Gn), AC = pt(Wn), TC = pt(Vn), SC = pt(zn), $C = pt(Xn), OC = pt(Kn), DC = pt(Jn), PC = pt(Qn), FC = pt(de), ea = FC.default("request-factory");
class NC {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      if (ea("fc", r, "payload", t), gt.isFunctionCode(r))
        switch (r) {
          case gt.FC.READ_COIL:
            return IC.default.fromBuffer(t);
          case gt.FC.READ_DISCRETE_INPUT:
            return AC.default.fromBuffer(t);
          case gt.FC.READ_HOLDING_REGISTERS:
            return TC.default.fromBuffer(t);
          case gt.FC.READ_INPUT_REGISTERS:
            return SC.default.fromBuffer(t);
          case gt.FC.WRITE_SINGLE_COIL:
            return DC.default.fromBuffer(t);
          case gt.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return PC.default.fromBuffer(t);
          case gt.FC.WRITE_MULTIPLE_COILS:
            return $C.default.fromBuffer(t);
          case gt.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return OC.default.fromBuffer(t);
        }
      if (r <= 43)
        return ea("Illegal Function (fc %d)", r), new CC.default(r, 1);
    } catch (r) {
      return ea("Exception while reading function code", r), null;
    }
  }
}
Yn.default = NC;
Object.defineProperty(te, "__esModule", { value: !0 });
var vh = Br;
te.ExceptionRequestBody = vh.default;
te.isExceptionRequestBody = vh.isExceptionRequestBody;
var Rh = Gn;
te.ReadCoilsRequestBody = Rh.default;
te.isReadCoilsRequestBody = Rh.isReadCoilsRequestBody;
var Ch = Wn;
te.ReadDiscreteInputsRequestBody = Ch.default;
te.isReadDiscreteInputsRequestBody = Ch.isReadDiscreteInputsRequestBody;
var Ih = Vn;
te.ReadHoldingRegistersRequestBody = Ih.default;
te.isReadHoldingRegistersRequestBody = Ih.isReadHoldingRegistersRequestBody;
var Ah = zn;
te.ReadInputRegistersRequestBody = Ah.default;
te.isReadInputRegistersRequestBody = Ah.isReadInputRegistersRequestBody;
var Th = He;
te.ModbusRequestBody = Th.default;
te.isModbusRequestBody = Th.isModbusRequestBody;
var UC = Yn;
te.RequestFactory = UC.default;
var Sh = Xn;
te.WriteMultipleCoilsRequestBody = Sh.default;
te.isWriteMultipleCoilsRequestBody = Sh.isWriteMultipleCoilsRequestBody;
var $h = Kn;
te.WriteMultipleRegistersRequestBody = $h.default;
te.isWriteMultipleRegistersRequestBody = $h.isWriteMultipleRegistersRequestBody;
var Oh = Jn;
te.WriteSingleCoilRequestBody = Oh.default;
te.isWriteSingleCoilRequestBody = Oh.isWriteSingleCoilRequestBody;
var Dh = Qn;
te.WriteSingleRegisterRequestBody = Dh.default;
te.isWriteSingleRegisterRequestBody = Dh.isWriteSingleRegisterRequestBody;
Object.defineProperty(Hn, "__esModule", { value: !0 });
const LC = de, ve = LC("modbus-client"), yt = te;
class El {
  constructor(t) {
    if (new.target === El)
      throw new TypeError("Cannot instantiate ModbusClient directly.");
    if (this._socket = t, !t)
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
  readCoils(t, r) {
    ve("issuing new read coils request");
    let n;
    try {
      n = new yt.ReadCoilsRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readDiscreteInputs(t, r) {
    ve("issuing new read discrete inputs request");
    let n;
    try {
      n = new yt.ReadDiscreteInputsRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readHoldingRegisters(t, r) {
    ve("issuing new read holding registers request");
    let n;
    try {
      n = new yt.ReadHoldingRegistersRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readInputRegisters(t, r) {
    ve("issuing new read input registers request");
    let n;
    try {
      n = new yt.ReadInputRegistersRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleCoil(t, r) {
    ve("issuing new write single coil request");
    let n;
    try {
      n = new yt.WriteSingleCoilRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleRegister(t, r) {
    ve("issuing new write single register request");
    let n;
    try {
      n = new yt.WriteSingleRegisterRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeMultipleCoils(t, r, n = 0) {
    ve("issuing new write multiple coils request");
    let i;
    try {
      r instanceof Buffer ? i = new yt.WriteMultipleCoilsRequestBody(t, r, n) : i = new yt.WriteMultipleCoilsRequestBody(t, r);
    } catch (s) {
      return ve("unknown request error occurred"), Promise.reject(s);
    }
    return this._requestHandler.register(i);
  }
  writeMultipleRegisters(t, r) {
    ve("issuing new write multiple registers request");
    let n;
    try {
      n = new yt.WriteMultipleRegistersRequestBody(t, r);
    } catch (i) {
      return ve("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  manuallyClearRequests(t) {
    return this._requestHandler.manuallyRejectRequests(t);
  }
  manuallyRejectCurrentRequest() {
    return this._requestHandler.manuallyRejectCurrentRequest();
  }
  customErrorRequest(t) {
    return this._requestHandler.customErrorRequest(t);
  }
  _onData(t) {
    ve("received data"), this._responseHandler.handleData(t);
    do {
      const r = this._responseHandler.shift();
      if (!r)
        return;
      this.unitId === r.unitId && this._requestHandler.handle(r);
    } while (!0);
  }
}
Hn.default = El;
var bl = {}, Zn = {}, cr = {}, Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
const BC = se;
class MC {
  get fc() {
    return this._fc;
  }
  get isException() {
    return !1;
  }
  static fromRequest(t, r) {
    throw new TypeError("Cannot call from request from abstract class");
  }
  constructor(t, r = !1) {
    if (r === !1 && !BC.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    this._fc = t;
  }
}
Mr.default = MC;
var kC = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(cr, "__esModule", { value: !0 });
const _f = se, qC = kC(Mr);
class Tn extends qC.default {
  get code() {
    return this._code;
  }
  get message() {
    return _f.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return !0;
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0) - 128, n = t.readUInt8(1);
    if (!_f.isFunctionCode(r))
      throw Error("InvalidFunctionCode");
    return new Tn(r, n);
  }
  static fromRequest(t) {
    return new Tn(t.fc, t.code);
  }
  constructor(t, r) {
    super(t, !0), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc + 128, 0), t.writeUInt8(this._code, 1), t;
  }
}
cr.default = Tn;
function jC(e) {
  return e instanceof Tn;
}
cr.isExceptionResponseBody = jC;
var vt = {};
Object.defineProperty(vt, "__esModule", { value: !0 });
class HC {
  constructor({ err: t, message: r, response: n, request: i }) {
    this.err = t, this.message = r, this.request = i, this.response = n;
  }
}
vt.UserRequestError = HC;
function Ph(e) {
  return e instanceof Ph ? !0 : !(typeof e != "object" || e.err === void 0 || typeof e.err != "string" || e.message === void 0 || typeof e.message != "string");
}
vt.isUserRequestError = Ph;
var ei = {}, Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
class GC {
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
Ys.UserRequestMetrics = GC;
Object.defineProperty(ei, "__esModule", { value: !0 });
const WC = vt, VC = Ys, zC = de, xf = zC("user-request");
class YC {
  constructor(t, r = 5e3) {
    xf("creating new user request with timeout", r), this._request = t, this._timeout = r, this._metrics = new VC.UserRequestMetrics(), this._promise = new Promise((n, i) => {
      this._resolve = n, this._reject = i;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(t) {
    this._metrics.startedAt = /* @__PURE__ */ new Date(), this._timer = setTimeout(() => {
      this._reject(new WC.UserRequestError({
        err: "Timeout",
        message: "Req timed out",
        request: this._request
      })), t();
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
  resolve(t) {
    return this._metrics.receivedAt = /* @__PURE__ */ new Date(), xf("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime), this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: t
    });
  }
  get reject() {
    return this._reject;
  }
}
ei.default = YC;
var Fh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zn, "__esModule", { value: !0 });
const mf = "OutOfSync", gf = "Offline", XC = "ModbusException", KC = "ManuallyCleared", JC = de, ze = JC("client-request-handler"), QC = Fh(cr), gr = vt, ZC = Fh(ei);
class wl {
  constructor(t, r) {
    if (new.target === wl)
      throw new TypeError("Cannot instantiate ModbusClientRequestHandler directly.");
    this._socket = t, this._timeout = r, this._state = "offline";
  }
  get state() {
    return this._state;
  }
  get requestCount() {
    return this._requests.length;
  }
  registerRequest(t) {
    const r = new ZC.default(t, this._timeout);
    return this._requests.push(r), this._flush(), r.promise;
  }
  handle(t) {
    if (ze("incoming response"), !t) {
      ze("well, sorry I was wrong, no response at all");
      return;
    }
    const r = this._currentRequest;
    if (!r) {
      ze("no current request, no idea where this came from");
      return;
    }
    const n = r.request;
    if (t.body.isException === !1 && t.body.fc !== n.body.fc) {
      ze("something is weird, request fc and response fc do not match."), r.reject(new gr.UserRequestError({
        err: mf,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.body instanceof QC.default) {
      ze("response is a exception"), r.reject(new gr.UserRequestError({
        err: XC,
        message: "A Modbus Exception Occurred - See Response Body",
        request: n,
        response: t
      })), this._clearCurrentRequest(), this._flush();
      return;
    }
    ze("resolving request"), r.resolve(t), this._clearCurrentRequest(), this._flush();
  }
  manuallyRejectCurrentRequest() {
    this._currentRequest && (this._currentRequest.reject(new gr.UserRequestError({
      err: KC,
      message: "the request was manually cleared",
      request: this._currentRequest.request
    })), this._flush());
  }
  manuallyRejectRequests(t) {
    for (let r = 0; r < t; r++)
      this.manuallyRejectCurrentRequest();
  }
  manuallylRejectAllRequests() {
    this.manuallyRejectRequests(this.requestCount);
  }
  customErrorRequest(t) {
    this._currentRequest && this._currentRequest.reject(t);
  }
  _clearCurrentRequest() {
    this._currentRequest && (this._currentRequest.done(), this._currentRequest = null);
  }
  _clearAllRequests() {
    for (this._clearCurrentRequest(); this._requests.length > 0; ) {
      const t = this._requests.shift();
      t && t.reject(new gr.UserRequestError({
        err: mf,
        message: "rejecting because of earlier OutOfSync error",
        request: t.request
      }));
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline", this._currentRequest && this._currentRequest.reject(new gr.UserRequestError({
      err: gf,
      message: "connection to modbus server closed",
      request: this._currentRequest.request
    })), this._clearAllRequests();
  }
  _flush() {
    if (ze("flushing"), this._currentRequest !== null) {
      ze("executing another request, come back later");
      return;
    }
    if (this._requests.length === 0) {
      ze("no request to be executed");
      return;
    }
    if (this._currentRequest = this._requests.shift(), this._state === "offline") {
      ze("rejecting request immediatly, client offline"), this._currentRequest && this._currentRequest.reject(new gr.UserRequestError({
        err: gf,
        message: "no connection to modbus server",
        request: this._currentRequest.request
      })), this._clearCurrentRequest(), setTimeout(this._flush.bind(this), 0);
      return;
    }
    const t = this._currentRequest && this._currentRequest.createPayload();
    ze("flushing new request", t), this._currentRequest && this._currentRequest.start(() => {
      this._clearCurrentRequest(), this._flush();
    }), this._socket.write(t, (r) => {
      ze("request fully flushed, ( error:", r, ")");
    });
  }
}
Zn.default = wl;
var ti = {}, kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
class Nh {
}
Nh.fromBuffer = (e) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
kr.default = Nh;
function eI(e) {
  return e.body !== void 0;
}
kr.isModbusRequest = eI;
var Uh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ti, "__esModule", { value: !0 });
const tI = de, Ui = tI("tcp-request"), rI = Uh(kr), nI = Uh(Yn);
class vl extends rI.default {
  constructor(t, r, n, i, s) {
    super(), this._id = t, this._protocol = r, this._length = n, this._unitId = i, this._body = s;
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
  static fromBuffer(t) {
    try {
      if (t.length < 7)
        return Ui("no enough data in the buffer yet"), null;
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      Ui("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), Ui("buffer", t);
      const o = nI.default.fromBuffer(t.slice(7, 6 + i));
      return o ? new vl(r, n, i, s, o) : null;
    } catch (r) {
      return Ui("not enough data to create a tcp request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload(), r = Buffer.alloc(7 + this._body.byteCount);
    return r.writeUInt16BE(this._id, 0), r.writeUInt16BE(0, 2), r.writeUInt16BE(this._body.byteCount + 1, 4), r.writeUInt8(this._unitId, 6), t.copy(r, 7), r;
  }
}
ti.default = vl;
var Lh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(bl, "__esModule", { value: !0 });
const iI = de, Li = iI("tcp-client-request-handler"), sI = Lh(Zn), oI = Lh(ti), yf = vt, aI = "OutOfSync", lI = "Protocol";
class cI extends sI.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._requestId = 0, this._unitId = r, this._requests = [], this._currentRequest = null, this._socket.on("connect", this._onConnect.bind(this)), this._socket.on("close", this._onClose.bind(this));
  }
  register(t) {
    this._requestId = (this._requestId + 1) % 65535, Li("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", t.byteCount);
    const r = new oI.default(this._requestId, 0, t.byteCount + 1, this._unitId, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (!t)
      return;
    const r = this._currentRequest;
    if (!r) {
      Li("something is strange, received a respone without a request");
      return;
    }
    const n = r.request;
    if (t.id !== n.id) {
      Li("something weird is going on, response transition id does not equal request transition id", t.id, n.id), r.reject(new yf.UserRequestError({
        err: aI,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.protocol !== 0) {
      Li("server responds with wrong protocol version"), r.reject(new yf.UserRequestError({
        err: lI,
        message: "Unknown protocol version " + t.protocol,
        request: n
      })), this._clearAllRequests();
      return;
    }
    super.handle(t);
  }
}
bl.default = cI;
var Rl = {}, ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
class uI {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
ri.default = uI;
var ni = {}, ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
class fI {
  get body() {
    return this._body;
  }
  static fromRequest(t, r) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
ii.default = fI;
var si = {}, Xs = {};
const dI = de, Ef = dI("buffer-utils");
class hI {
  static bufferShift(t, r, n) {
    t = t - 1;
    const i = t % 8, s = Math.floor(t / 8), a = Math.floor(r / 8) - s + 1, u = Buffer.allocUnsafe(a);
    u[0] = n[0] << i, Ef("buffer[0] = %s ( %s << %d )", u[0].toString(2), n[0].toString(2), i);
    const p = Buffer.concat([n, Buffer.alloc(1)], n.length + 1);
    for (let l = 1; l < a; l++)
      u[l] = (p[l] << i) + (p[l - 1] >> 8 - i), Ef("buffer[%d] = %s ( %s << %d + %s >> %d)", l, u[l].toString(2), p[l].toString(2), i, p[l - 1].toString(2), 8 - t);
    return u;
  }
  static firstByte(t, r, n) {
    t = t - 1;
    const s = 255 >> 8 - t % 8, o = r & s;
    return n + o;
  }
  static lastByte(t, r, n) {
    const s = 255 << t % 8, o = r & s;
    return n + o;
  }
  static bufferToArrayStatus(t) {
    const r = [];
    let n, i, s;
    if (!(t instanceof Buffer))
      return r;
    for (let o = 0; o < t.length * 8; o += 1) {
      n = o % 8, i = Math.floor(o / 8), s = t.readUInt8(i);
      const a = (s & Math.pow(2, n)) > 0;
      r.push(a ? 1 : 0);
    }
    return r;
  }
  static arrayStatusToBuffer(t) {
    const r = t instanceof Array ? Math.ceil(t.length / 8) : 0, n = Buffer.alloc(r);
    if (!(t instanceof Array))
      return n;
    let i, s, o;
    for (let a = 0; a < t.length; a += 1)
      i = Math.floor(a / 8), s = a % 8, o = n.readUInt8(i), o += t[a] ? Math.pow(2, s) : 0, n.writeUInt8(o, i);
    return n;
  }
}
var Cl = hI, qr = {}, pI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(qr, "__esModule", { value: !0 });
const _I = pI(Mr);
class xI extends _I.default {
  constructor(t) {
    super(t);
  }
  get fc() {
    return this._fc;
  }
}
qr.default = xI;
var Bh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Xs, "__esModule", { value: !0 });
const mI = de, gI = mI("read-coils-response"), yI = Bh(Cl), bf = se, EI = Bh(qr), { bufferToArrayStatus: wf, arrayStatusToBuffer: bI } = yI.default;
class ns extends EI.default {
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
  static fromRequest(t, r) {
    const n = wf(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new ns(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== bf.FC.READ_COIL ? null : new ns(i, n);
    } catch {
      return gI("no valid read coils response body in the buffer yet"), null;
    }
  }
  constructor(t, r) {
    if (super(bf.FC.READ_COIL), this._coils = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = bI(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = wf(t);
    else
      throw new Error("InvalidCoilsInput");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
Xs.default = ns;
var Ks = {}, Mh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ks, "__esModule", { value: !0 });
const wI = Mh(Cl), vf = se, vI = Mh(qr), { bufferToArrayStatus: Rf, arrayStatusToBuffer: RI } = wI.default;
class is extends vI.default {
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
  static fromRequest(t, r) {
    const n = Rf(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new is(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== vf.FC.READ_DISCRETE_INPUT ? null : new is(i, n);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(vf.FC.READ_DISCRETE_INPUT), this._discrete = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = RI(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = Rf(t);
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
Ks.default = is;
var Js = {}, CI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Js, "__esModule", { value: !0 });
const II = de, AI = II("ReadHoldingRegistersResponseBody"), Cf = se, TI = CI(qr);
class ss extends TI.default {
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
  static fromRequest(t, r) {
    const n = t.start * 2, i = t.start * 2 + t.count * 2, s = r.slice(n, i);
    return new ss(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== Cf.FC.READ_HOLDING_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new ss(n, s, i);
  }
  constructor(t, r, n) {
    if (super(Cf.FC.READ_HOLDING_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, AI("ReadHoldingRegistersResponseBody values", r), r instanceof Array)
      this._valuesAsArray = r, this._valuesAsBuffer = Buffer.from(r), this._bufferLength += r.length * 2;
    else if (r instanceof Buffer)
      this._valuesAsArray = Uint16Array.from(r), this._valuesAsBuffer = r, this._bufferLength += r.length;
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
    n instanceof Buffer && (this._valuesAsBuffer = n);
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let t = Buffer.alloc(2);
      return t.writeUInt8(this._fc, 0), t.writeUInt8(this._byteCount, 1), t = Buffer.concat([t, this._values]), t;
    }
    if (this._values instanceof Array) {
      const t = Buffer.alloc(this._byteCount + 2);
      return t.writeUInt8(this._fc, 0), t.writeUInt8(this._byteCount, 1), this._values.forEach((r, n) => {
        t.writeUInt16BE(Math.max(0, Math.min(65535, r)), 2 * n + 2);
      }), t;
    }
    throw new Error("InvalidType_MustBeBufferOrArray");
  }
}
Js.default = ss;
var Qs = {}, SI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Qs, "__esModule", { value: !0 });
const If = se, $I = SI(qr);
class os extends $I.default {
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
  static fromRequest(t, r) {
    const n = t.start * 2, i = n + t.count * 2, s = r.slice(n, i);
    return new os(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== If.FC.READ_INPUT_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new os(n, s, i);
  }
  constructor(t, r, n) {
    if (super(If.FC.READ_INPUT_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, r instanceof Array)
      this._valuesAsArray = r, this._valuesAsBuffer = Buffer.from(r), this._bufferLength += r.length * 2;
    else if (r instanceof Buffer)
      this._valuesAsArray = Uint16Array.from(r), this._valuesAsBuffer = r, this._bufferLength += r.length;
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
    n instanceof Buffer && (this._valuesAsBuffer = n);
  }
  createPayload() {
    if (this._values instanceof Buffer) {
      let t = Buffer.alloc(2);
      return t.writeUInt8(this._fc, 0), t.writeUInt8(this._byteCount, 1), t = Buffer.concat([t, this._values]), t;
    }
    if (this._values instanceof Array) {
      const t = Buffer.alloc(this._byteCount + 2);
      return t.writeUInt8(this._fc, 0), t.writeUInt8(this._byteCount, 1), this._values.forEach((r, n) => {
        t.writeUInt16BE(Math.max(0, Math.min(65535, r)), 2 + 2 * n);
      }), t;
    }
    throw new Error("this._values is not an instance of a Buffer or an Array");
  }
}
Qs.default = os;
var Zs = {}, jr = {}, OI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(jr, "__esModule", { value: !0 });
const DI = OI(Mr);
class PI extends DI.default {
}
jr.default = PI;
var FI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zs, "__esModule", { value: !0 });
const Af = se, NI = FI(jr);
class as extends NI.default {
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
  static fromRequest(t) {
    const r = t.address, n = t.quantity;
    return new as(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== Af.FC.WRITE_MULTIPLE_COILS ? null : new as(n, i);
  }
  constructor(t, r) {
    super(Af.FC.WRITE_MULTIPLE_COILS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
Zs.default = as;
var eo = {}, UI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(eo, "__esModule", { value: !0 });
const Tf = se, LI = UI(jr);
class ls extends LI.default {
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
  static fromRequest(t) {
    const r = t.address, n = t.quantity;
    return new ls(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== Tf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new ls(n, i);
  }
  constructor(t, r) {
    super(Tf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
eo.default = ls;
var to = {}, BI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(to, "__esModule", { value: !0 });
const Sf = se, MI = BI(jr);
class cs extends MI.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value === 65280;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(t) {
    const r = t.address, n = t.value;
    return new cs(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3) === 65280;
    return r !== Sf.FC.WRITE_SINGLE_COIL ? null : new cs(n, i);
  }
  constructor(t, r) {
    super(Sf.FC.WRITE_SINGLE_COIL), this._address = t, this._value = r === 65280 ? 65280 : 0;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
to.default = cs;
var ro = {}, kI = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ro, "__esModule", { value: !0 });
const $f = se, qI = kI(jr);
class us extends qI.default {
  get address() {
    return this._address;
  }
  get value() {
    return this._value;
  }
  get byteCount() {
    return 5;
  }
  static fromRequest(t) {
    const r = t.address, n = t.value;
    return new us(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== $f.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new us(n, i);
  }
  constructor(t, r) {
    super($f.FC.WRITE_SINGLE_HOLDING_REGISTER), this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
ro.default = us;
var Rt = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(si, "__esModule", { value: !0 });
const jI = de, ta = jI("response-factory"), Ot = se, HI = Rt(cr), GI = Rt(Xs), WI = Rt(Ks), VI = Rt(Js), zI = Rt(Qs), YI = Rt(Zs), XI = Rt(eo), KI = Rt(to), JI = Rt(ro);
class QI {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      return ta("fc", r, "payload", t), r > 128 ? HI.default.fromBuffer(t) : r === Ot.FC.READ_COIL ? GI.default.fromBuffer(t) : r === Ot.FC.READ_DISCRETE_INPUT ? WI.default.fromBuffer(t) : r === Ot.FC.READ_HOLDING_REGISTERS ? VI.default.fromBuffer(t) : r === Ot.FC.READ_INPUT_REGISTERS ? zI.default.fromBuffer(t) : r === Ot.FC.WRITE_SINGLE_COIL ? KI.default.fromBuffer(t) : r === Ot.FC.WRITE_SINGLE_HOLDING_REGISTER ? JI.default.fromBuffer(t) : r === Ot.FC.WRITE_MULTIPLE_COILS ? YI.default.fromBuffer(t) : r === Ot.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? XI.default.fromBuffer(t) : null;
    } catch (r) {
      return ta("when NoSuchIndex Exception, the buffer does not contain a complete message"), ta(r), null;
    }
  }
}
si.default = QI;
var kh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ni, "__esModule", { value: !0 });
const ZI = de, en = ZI("tcp-response"), eA = kh(ii), tA = kh(si);
class fs extends eA.default {
  constructor(t, r, n, i, s) {
    super(), this._id = t, this._protocol = r, this._bodyLength = n, this._unitId = i, this._body = s;
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
  static fromRequest(t, r) {
    return new fs(t.id, t.protocol, r.byteCount + 1, t.unitId, r);
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      en("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), en("buffer", t);
      const o = tA.default.fromBuffer(t.slice(7, 7 + i - 1));
      return o ? (en("buffer contains a valid response body"), new fs(r, n, i, s, o)) : (en("not enough data for a response body"), null);
    } catch {
      return en("not enough data available"), null;
    }
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt16BE(this._id, 0), t.writeUInt16BE(this._protocol, 2), t.writeUInt16BE(this._bodyLength, 4), t.writeUInt8(this._unitId, 6), this._body.createPayload().copy(t, 7), t;
  }
}
ni.default = fs;
var qh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Rl, "__esModule", { value: !0 });
const rA = de, tn = rA("tcp-response-handler"), nA = qh(ri), iA = qh(ni);
class sA extends nA.default {
  constructor() {
    super(), this._buffer = Buffer.alloc(0), this._messages = [];
  }
  handleData(t) {
    tn("receiving new data", t), this._buffer = Buffer.concat([this._buffer, t]), tn("buffer", this._buffer);
    do {
      const r = iA.default.fromBuffer(this._buffer);
      if (!r) {
        tn("not enough data available to parse");
        return;
      }
      tn("response id", r.id, "protocol", r.protocol, "length", r.bodyLength, "unit", r.unitId), tn("reset buffer from", this._buffer.length, "to", this._buffer.length - r.byteCount), this._messages.push(r), this._buffer = this._buffer.slice(r.byteCount);
    } while (!0);
  }
}
Rl.default = sA;
var Il = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(gl, "__esModule", { value: !0 });
const oA = Il(Hn), aA = Il(bl), lA = Il(Rl);
class cA extends oA.default {
  constructor(t, r = 1, n = 5e3) {
    super(t), this._requestHandler = new aA.default(t, r, n), this._responseHandler = new lA.default(), this._unitId = r, this._timeout = n;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
gl.default = cA;
var Al = {}, Tl = {}, Bi = {}, Of;
function _t() {
  return Of || (Of = 1, Object.defineProperty(Bi, "__esModule", {
    value: !0
  }), Bi.default = function(e, t) {
    var r = function(i, s) {
      return t(i, s) >>> 0;
    };
    return r.signed = t, r.unsigned = r, r.model = e, r;
  }), Bi;
}
var ra, Df;
function uA() {
  if (Df) return ra;
  Df = 1;
  var e = dt, t = _t(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return ra = (0, r.default)("crc1", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = ~~s, a = 0, u = 0; u < i.length; u++) {
      var p = i[u];
      a += p;
    }
    return o += a % 256, o % 256;
  }), ra;
}
var na, Pf;
function fA() {
  if (Pf) return na;
  Pf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), na = (0, r.default)("crc-8", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, u = 0; u < s.length; u++) {
      var p = s[u];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), na;
}
var ia, Ff;
function dA() {
  if (Ff) return ia;
  Ff = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255, 70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), ia = (0, r.default)("dallas-1-wire", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, u = 0; u < s.length; u++) {
      var p = s[u];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), ia;
}
var sa, Nf;
function hA() {
  if (Nf) return sa;
  Nf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), sa = (0, r.default)("crc-16", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, u = 0; u < s.length; u++) {
      var p = s[u];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), sa;
}
var oa, Uf;
function pA() {
  if (Uf) return oa;
  Uf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), oa = (0, r.default)("ccitt", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, u = 0; u < s.length; u++) {
      var p = s[u];
      a = (i[(a >> 8 ^ p) & 255] ^ a << 8) & 65535;
    }
    return a;
  }), oa;
}
var aa, Lf;
function _A() {
  if (Lf) return aa;
  Lf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), aa = (0, r.default)("crc-16-modbus", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, u = 0; u < s.length; u++) {
      var p = s[u];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), aa;
}
var la, Bf;
function xA() {
  if (Bf) return la;
  Bf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return la = (0, r.default)("xmodem", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = typeof s < "u" ? ~~s : 0, a = 0; a < i.length; a++) {
      var u = i[a], p = o >>> 8 & 255;
      p ^= u & 255, p ^= p >>> 4, o = o << 8 & 65535, o ^= p, p = p << 5 & 65535, o ^= p, p = p << 7 & 65535, o ^= p;
    }
    return o;
  }), la;
}
var ca, Mf;
function mA() {
  if (Mf) return ca;
  Mf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), ca = (0, r.default)("kermit", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 0, u = 0; u < s.length; u++) {
      var p = s[u];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), ca;
}
var ua, kf;
function gA() {
  if (kf) return ua;
  kf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), ua = (0, r.default)("crc-24", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 11994318, u = 0; u < s.length; u++) {
      var p = s[u];
      a = (i[(a >> 16 ^ p) & 255] ^ a << 8) & 16777215;
    }
    return a;
  }), ua;
}
var fa, qf;
function yA() {
  if (qf) return fa;
  qf = 1;
  var e = dt, t = _t(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), fa = (0, r.default)("crc-32", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = o === 0 ? 0 : ~~o ^ -1, u = 0; u < s.length; u++) {
      var p = s[u];
      a = i[(a ^ p) & 255] ^ a >>> 8;
    }
    return a ^ -1;
  }), fa;
}
var da, jf;
function Sl() {
  return jf || (jf = 1, da = {
    crc1: uA(),
    crc8: fA(),
    crc81wire: dA(),
    crc16: hA(),
    crc16ccitt: pA(),
    crc16modbus: _A(),
    crc16xmodem: xA(),
    crc16kermit: mA(),
    crc24: gA(),
    crc32: yA()
  }), da;
}
var Hr = {}, jh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Hr, "__esModule", { value: !0 });
const EA = de, Mi = EA("rtu-request"), Hf = Sl(), bA = jh(kr), wA = jh(Yn);
class $l extends bA.default {
  constructor(t, r, n = !1) {
    super(), this._address = t, this._body = r, this._corrupted = n;
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
  static fromBuffer(t) {
    try {
      if (t.length < 3)
        return Mi("not enough data in the buffer yet"), null;
      const r = t.readUInt8(0);
      Mi(`rtu header complete, address, ${r}`), Mi("buffer", t);
      const n = wA.default.fromBuffer(t.slice(1));
      if (!n)
        return null;
      const i = 1 + n.byteCount, s = Hf.crc16modbus(t.slice(0, i)), o = t.readUInt16LE(i), a = s !== o;
      return new $l(r, n, a);
    } catch (r) {
      return Mi("not enough data to create a rtu request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload();
    this._crc = Hf.crc16modbus(Buffer.concat([Buffer.from([this._address]), t]));
    const r = Buffer.alloc(2);
    r.writeUInt16LE(this._crc, 0);
    const n = Buffer.from([this._address]);
    return Buffer.concat([n, t, r]);
  }
}
Hr.default = $l;
var Ol = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Tl, "__esModule", { value: !0 });
const vA = de, rn = vA("rtu-client-request-handler"), RA = Ol(Sl()), CA = Ol(Zn), IA = Ol(Hr), AA = vt;
class TA extends CA.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._address = r, this._requests = [], this._currentRequest = null, this._socket.on("open", this._onConnect.bind(this)), this._socket.isOpen && this._onConnect();
  }
  register(t) {
    rn("registrating new request");
    const r = new IA.default(this._address, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (rn("new response coming in"), !t)
      return;
    const r = this._currentRequest;
    if (!r) {
      rn("something is strange, received a respone without a request");
      return;
    }
    const n = Buffer.concat([Buffer.from([t.address]), t.body.createPayload()]);
    rn("create crc from response", n);
    const i = RA.default.crc16modbus(n);
    if (t.crc !== i) {
      rn("CRC does not match", t.crc, "!==", i), r.reject(new AA.UserRequestError({
        err: "crcMismatch",
        message: "the response payload does not match the crc",
        request: r.request,
        response: t
      })), this._clearAllRequests();
      return;
    }
    super.handle(t);
  }
  get address() {
    return this._address;
  }
}
Tl.default = TA;
var Dl = {}, oi = {}, Hh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(oi, "__esModule", { value: !0 });
const SA = de, Gf = SA("rtu-response"), $A = Sl(), OA = Hh(ii), DA = Hh(si);
class ds extends OA.default {
  constructor(t, r, n) {
    super(), this._address = t, this._crc = r, this._body = n;
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
  static fromRequest(t, r) {
    return new ds(t.address, void 0, r);
  }
  static fromBuffer(t) {
    if (t.length < 1)
      return null;
    const r = t.readUInt8(0);
    Gf("address", r, "buffer", t);
    const n = DA.default.fromBuffer(t.slice(1));
    if (!n)
      return null;
    let i;
    try {
      i = t.readUInt16LE(1 + n.byteCount);
    } catch {
      return Gf("If NoSuchIndexException, it is probably serial and not all data has arrived"), null;
    }
    return new ds(r, i, n);
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._address, 0), this._body.createPayload().copy(t, 1), this._crc = $A.crc16modbus(t.slice(0, this.byteCount - 2)), t.writeUInt16LE(this._crc, this.byteCount - 2), t;
  }
}
oi.default = ds;
var Gh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Dl, "__esModule", { value: !0 });
const PA = de, nn = PA("rtu-response-handler"), FA = Gh(ri), NA = Gh(oi);
class UA extends FA.default {
  constructor() {
    super(), this._messages = [];
  }
  handleData(t) {
    nn("receiving new data"), this._buffer = Buffer.concat([this._buffer, t]), nn("buffer", this._buffer);
    do {
      const r = NA.default.fromBuffer(this._buffer);
      if (!r) {
        nn("not enough data available to parse");
        return;
      }
      nn("crc", r.crc), nn("reset buffer from", this._buffer.length, "to", this._buffer.length - r.byteCount), this._buffer = this._buffer.slice(r.byteCount), this._messages.push(r);
    } while (!0);
  }
  shift() {
    return this._messages.shift();
  }
}
Dl.default = UA;
var Pl = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Al, "__esModule", { value: !0 });
const LA = Pl(Hn), BA = Pl(Tl), MA = Pl(Dl);
class kA extends LA.default {
  constructor(t, r, n = 5e3) {
    super(t), this._requestHandler = new BA.default(t, r, n), this._responseHandler = new MA.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
Al.default = kA;
var Fl = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const qA = Pa, Wf = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class jA extends qA.EventEmitter {
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
  constructor(t = Wf) {
    super(), this._options = Object.assign({}, Wf, t);
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
  on(t, r) {
    return super.on(t, r);
  }
  emit(t, ...r) {
    return super.emit(t, ...r);
  }
}
no.default = jA;
var io = {}, ki = {}, Vf;
function HA() {
  if (Vf) return ki;
  Vf = 1;
  var e = S && S.__importDefault || function(s) {
    return s && s.__esModule ? s : { default: s };
  };
  Object.defineProperty(ki, "__esModule", { value: !0 });
  const t = e(Hr), n = de("modbus-server-request-handler");
  class i {
    constructor(o) {
      this._fromBuffer = o, this._requests = [], this._buffer = Buffer.alloc(0);
    }
    shift() {
      return this._requests.shift();
    }
    handle(o) {
      this._buffer = Buffer.concat([this._buffer, o]), n("this._buffer", this._buffer);
      do {
        const a = this._fromBuffer(this._buffer);
        if (n("request", a), !a)
          return;
        if (a instanceof t.default && a.corrupted) {
          const u = this._buffer.slice(0, a.byteCount).toString("hex");
          n(`request message was corrupt: ${u}`);
        } else
          this._requests.unshift(a);
        this._buffer = this._buffer.slice(a.byteCount);
      } while (!0);
    }
  }
  return ki.default = i, ki;
}
var qi = {}, Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
var Wh = cr;
Me.ExceptionResponseBody = Wh.default;
Me.isExceptionResponseBody = Wh.isExceptionResponseBody;
var GA = Xs;
Me.ReadCoilsResponseBody = GA.default;
var WA = Ks;
Me.ReadDiscreteInputsResponseBody = WA.default;
var VA = Js;
Me.ReadHoldingRegistersResponseBody = VA.default;
var zA = Qs;
Me.ReadInputRegistersResponseBody = zA.default;
var YA = Mr;
Me.ModbusResponseBody = YA.default;
var XA = si;
Me.ResponseFactory = XA.default;
var KA = Zs;
Me.WriteMultipleCoilsResponseBody = KA.default;
var JA = eo;
Me.WriteMultipleRegistersResponseBody = JA.default;
var QA = to;
Me.WriteSingleCoilResponseBody = QA.default;
var ZA = ro;
Me.WriteSingleRegisterResponseBody = ZA.default;
var zf;
function eT() {
  if (zf) return qi;
  zf = 1;
  var e = S && S.__importDefault || function(l) {
    return l && l.__esModule ? l : { default: l };
  };
  Object.defineProperty(qi, "__esModule", { value: !0 });
  const t = Me, r = te, n = e(Cl), i = se, { bufferToArrayStatus: s, arrayStatusToBuffer: o } = n.default, u = de("modbus tcp response handler");
  class p {
    constructor(c, d) {
      this._server = c, this._fromRequest = d;
    }
    handle(c, d) {
      if (!c)
        return null;
      if (r.isExceptionRequestBody(c.body)) {
        const m = t.ExceptionResponseBody.fromRequest(c.body), g = this._fromRequest(c, m);
        return d(g.createPayload()), g;
      }
      const _ = c.body.fc;
      if (i.isFunctionCode(_))
        switch (_) {
          case i.FC.READ_COIL:
            return this._handleReadCoil(c, d);
          case i.FC.READ_DISCRETE_INPUT:
            return this._handleDiscreteInput(c, d);
          case i.FC.READ_HOLDING_REGISTERS:
            return this._handleReadHoldingRegisters(c, d);
          case i.FC.READ_INPUT_REGISTERS:
            return this._handleReadInputRegisters(c, d);
          case i.FC.WRITE_SINGLE_COIL:
            return this._handleWriteSingleCoil(c, d);
          case i.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return this._handleWriteSingleHoldingRegister(c, d);
          case i.FC.WRITE_MULTIPLE_COILS:
            return this._handleWriteMultipleCoils(c, d);
          case i.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return this._handleWriteMultipleHoldingRegisters(c, d);
        }
    }
    _handleReadCoil(c, d) {
      if (!r.isReadCoilsRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected ReadCoilsRequestBody but received ${c.body.name}`);
      if (!this._server.coils) {
        u("no coils buffer on server, trying readCoils handler"), this._server.emit("readCoils", c, d);
        return;
      }
      this._server.emit("preReadCoils", c, d);
      const _ = t.ReadCoilsResponseBody.fromRequest(c.body, this._server.coils), m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postReadCoils", c, d), m;
    }
    _handleDiscreteInput(c, d) {
      if (!r.isReadDiscreteInputsRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${c.body.name}`);
      if (!this._server.discrete) {
        u("no discrete input buffer on server, trying readDiscreteInputs handler"), this._server.emit("readDiscreteInputs", c, d);
        return;
      }
      this._server.emit("preReadDiscreteInputs", c, d);
      const _ = t.ReadDiscreteInputsResponseBody.fromRequest(c.body, this._server.discrete), m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postReadDiscreteInputs", c, d), m;
    }
    _handleReadHoldingRegisters(c, d) {
      if (!r.isReadHoldingRegistersRequestBody(c.body)) {
        const y = `InvalidRequestClass - Expected ReadHoldingRegistersRequestBody but received ${c.body.name}`;
        throw new Error(y);
      }
      if (!this._server.holding) {
        u("no holding register buffer on server, trying readHoldingRegisters handler"), this._server.emit("readHoldingRegisters", c, d);
        return;
      }
      this._server.emit("preReadHoldingRegisters", c, d);
      const _ = t.ReadHoldingRegistersResponseBody.fromRequest(c.body, this._server.holding), m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postReadHoldingRegisters", c, d), m;
    }
    _handleReadInputRegisters(c, d) {
      if (!r.isReadInputRegistersRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${c.body.name}`);
      if (!this._server.input) {
        u("no input register buffer on server, trying readInputRegisters handler"), this._server.emit("readInputRegisters", c, d);
        return;
      }
      this._server.emit("preReadInputRegisters", c, d);
      const _ = t.ReadInputRegistersResponseBody.fromRequest(c.body, this._server.input), m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postReadInputRegisters", c, d), m;
    }
    _handleWriteSingleCoil(c, d) {
      if (!r.isWriteSingleCoilRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${c.body.name}`);
      if (!this._server.coils) {
        u("no coils buffer on server, trying writeSingleCoil handler"), this._server.emit("writeSingleCoil", c, d);
        return;
      }
      this._server.emit("preWriteSingleCoil", c, d);
      const _ = t.WriteSingleCoilResponseBody.fromRequest(c.body), m = c.body.address;
      u("Writing value %d to address %d", c.body.value, m);
      const g = this._server.coils.readUInt8(Math.floor(m / 8));
      let y;
      if (c.body.value !== 65280 && c.body.value !== 0) {
        u("illegal data value");
        const D = new t.ExceptionResponseBody(c.body.fc, 3), B = this._fromRequest(c, D);
        return d(B.createPayload()), B;
      }
      if (c.body.value === 65280 ? y = g | Math.pow(2, m % 8) : y = g & ~Math.pow(2, m % 8), _.address / 8 > this._server.coils.length) {
        u("illegal data address");
        const D = new t.ExceptionResponseBody(c.body.fc, 2), B = this._fromRequest(c, D);
        return d(B.createPayload()), B;
      } else
        this._server.coils.writeUInt8(y, Math.floor(m / 8));
      const v = this._fromRequest(c, _), C = v.createPayload();
      return d(C), this._server.emit("postWriteSingleCoil", c, d), v;
    }
    _handleWriteSingleHoldingRegister(c, d) {
      if (!r.isWriteSingleRegisterRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleRegisterRequestBody but received ${c.body.name}`);
      if (!this._server.holding) {
        u("no register buffer on server, trying writeSingleRegister handler"), this._server.emit("writeSingleRegister", c, d);
        return;
      }
      this._server.emit("preWriteSingleRegister", c, d);
      const _ = t.WriteSingleRegisterResponseBody.fromRequest(c.body);
      if (_.address * 2 > this._server.holding.length) {
        u("illegal data address");
        const y = new t.ExceptionResponseBody(c.body.fc, 2), v = this._fromRequest(c, y);
        return d(v.createPayload()), v;
      } else
        this._server.holding.writeUInt16BE(_.value, _.address * 2);
      const m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postWriteSingleRegister", c, d), m;
    }
    _handleWriteMultipleCoils(c, d) {
      if (!r.isWriteMultipleCoilsRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${c.body.name}`);
      if (!this._server.coils) {
        u("no coils buffer on server, trying writeMultipleCoils handler"), this._server.emit("writeMultipleCoils", c, d);
        return;
      }
      this._server.emit("preWriteMultipleCoils", c, d);
      const _ = t.WriteMultipleCoilsResponseBody.fromRequest(c.body), m = s(this._server.coils), g = s(c.body.valuesAsBuffer), y = c.body.address, v = y + c.body.quantity, C = m.map((j, J) => {
        let X = j;
        if (J >= y && J < v) {
          const M = g.shift();
          X = M !== void 0 ? M : j;
        }
        return X;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, m), this._server.coils.fill(o(C)), this._server.emit("postWriteMultipleCoils", this._server.coils, C);
      const D = this._fromRequest(c, _), B = D.createPayload();
      return d(B), this._server.emit("postWriteMultipleCoils", c, d), D;
    }
    _handleWriteMultipleHoldingRegisters(c, d) {
      if (!r.isWriteMultipleRegistersRequestBody(c.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleRegistersRequestBody but received ${c.body.name}`);
      if (!this._server.holding) {
        u("no register buffer on server, trying writeMultipleRegisters handler"), this._server.emit("writeMultipleRegisters", c, d);
        return;
      }
      this._server.emit("preWriteMultipleRegisters", c, d);
      const _ = t.WriteMultipleRegistersResponseBody.fromRequest(c.body);
      if (c.body.address * 2 + c.body.values.length > this._server.holding.length) {
        u("illegal data address");
        const y = new t.ExceptionResponseBody(c.body.fc, 2), v = this._fromRequest(c, y);
        return d(v.createPayload()), v;
      } else
        this._server.emit("writeMultipleRegisters", this._server.holding), u("Request Body: ", c.body), this._server.holding.fill(new Uint8Array(c.body.values), c.body.address * 2, c.body.address * 2 + c.body.values.length), this._server.emit("postWriteMultipleRegisters", this._server.holding);
      const m = this._fromRequest(c, _), g = m.createPayload();
      return d(g), this._server.emit("postWriteMultipleRegisters", c, d), m;
    }
  }
  return qi.default = p, qi;
}
var Vh = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(io, "__esModule", { value: !0 });
const tT = de, ha = tT("modbus tcp client socket"), rT = Vh(HA()), nT = Vh(eT());
class iT {
  constructor(t, r, n, i) {
    this._server = t, this._socket = r, this._requestHandler = new rT.default(n), this._responseHandler = new nT.default(this._server, i), this._socket.on("data", this._onData.bind(this));
  }
  get socket() {
    return this._socket;
  }
  get server() {
    return this._server;
  }
  _onData(t) {
    ha("new data coming in"), this._requestHandler.handle(t);
    do {
      const r = this._requestHandler.shift();
      if (!r) {
        ha("no request to process");
        break;
      }
      this._responseHandler.handle(r, (n) => {
        this._socket.write(n, () => {
          ha("response flushed", n);
        });
      });
    } while (!0);
  }
}
io.default = iT;
var so = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Fl, "__esModule", { value: !0 });
const sT = de, oT = sT("modbus tcp server"), aT = so(no), lT = so(io), cT = so(ti), uT = so(ni);
class fT extends aT.default {
  constructor(t, r) {
    super(r), this._server = t, t.on("connection", this._onConnection.bind(this));
  }
  _onConnection(t) {
    oT("new connection coming in");
    const r = cT.default.fromBuffer, n = uT.default.fromRequest, i = new lT.default(this, t, r, n);
    this.emit("connection", i);
  }
}
Fl.default = fT;
var Nl = {}, oo = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Nl, "__esModule", { value: !0 });
const dT = oo(io), hT = oo(no), pT = oo(Hr), _T = oo(oi);
class xT extends hT.default {
  constructor(t, r) {
    super(r), this._socket = t;
    const n = pT.default.fromBuffer, i = _T.default.fromRequest, s = new dT.default(this, t, n, i);
    this.emit("connection", s);
  }
}
Nl.default = xT;
var zh = {}, Ul = {};
Object.defineProperty(Ul, "__esModule", { value: !0 });
const mT = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function gT(e) {
  return typeof e != "object" ? !1 : !!mT.includes(e.message);
}
Ul.isInternalException = gT;
var Yh = {};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(vt);
})(Yh);
(function(e) {
  function t(i) {
    for (var s in i) e.hasOwnProperty(s) || (e[s] = i[s]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(Ul), t(Yh);
  var r = cr;
  e.isExceptionResponseBody = r.isExceptionResponseBody;
  var n = Br;
  e.isExceptionRequestBody = n.isExceptionRequestBody;
})(zh);
var Xh = {}, Ll = {};
Object.defineProperty(Ll, "__esModule", { value: !0 });
const Kh = 0, Jh = 65535, yT = Jh, ET = Kh, bT = 0, wT = 1, vT = 128;
Ll.LIMITS = {
  COIL_MAX: wT,
  COIL_MIN: bT,
  ERROR_CODE_THRESHOLD: vT,
  REGISTER_MAX: yT,
  REGISTER_MIN: ET,
  UINT16_MAX: Jh,
  UINT16_MIN: Kh
};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(Ll);
})(Xh);
var ai = S && S.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
}, ao = S && S.__importStar || function(e) {
  if (e && e.__esModule) return e;
  var t = {};
  if (e != null) for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
  return t.default = e, t;
};
Object.defineProperty(ie, "__esModule", { value: !0 });
const Qh = ai(gl);
ie.ModbusTCPClient = Qh.default;
const Zh = ai(Al);
ie.ModbusRTUClient = Zh.default;
const ep = ai(Fl);
ie.ModbusTCPServer = ep.default;
const tp = ai(Nl);
ie.ModbusRTUServer = tp.default;
const RT = ao(se), CT = ao(zh), IT = ao(te), AT = ao(Me), TT = ai(ei), ST = Xh;
ie.client = {
  RTU: Zh.default,
  TCP: Qh.default
};
ie.server = {
  RTU: tp.default,
  TCP: ep.default
};
ie.requests = Object.assign({}, IT, { UserRequest: TT.default });
ie.responses = AT;
ie.codes = RT;
ie.errors = CT;
ie.limits = ST.LIMITS;
var $T = kr;
ie.ModbusAbstractRequest = $T.default;
var OT = ii;
ie.ModbusAbstractResponse = OT.default;
var DT = Zn;
ie.MBClientRequestHandler = DT.default;
var PT = ri;
ie.ModbusClientResponseHandler = PT.default;
var FT = Hn;
ie.ModbusClient = FT.default;
var NT = ti;
ie.ModbusTCPRequest = NT.default;
var UT = ni;
ie.ModbusTCPResponse = UT.default;
var LT = Hr;
ie.ModbusRTURequest = LT.default;
var BT = oi;
ie.ModbusRTUResponse = BT.default;
var MT = vt;
ie.UserRequestError = MT.UserRequestError;
var kT = ei;
ie.UserRequest = kT.default;
var qT = Ys;
ie.UserRequestMetrics = qT.UserRequestMetrics;
const Bl = Pe.dirname(i_(import.meta.url));
process.env.APP_ROOT = Pe.join(Bl, "..");
const Sn = process.env.VITE_DEV_SERVER_URL, uS = Pe.join(process.env.APP_ROOT, "dist-electron"), Ml = Pe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Sn ? Pe.join(process.env.APP_ROOT, "public") : Ml;
let H;
const Oa = /* @__PURE__ */ new Set();
WR(() => H, (e) => Oa.has(e.id));
kR(() => H);
const Ir = /* @__PURE__ */ new Map();
function jT() {
  !ft.isPackaged || process.platform !== "win32" || (at.autoUpdater.autoDownload = !0, at.autoUpdater.autoInstallOnAppQuit = !1, at.autoUpdater.on("checking-for-update", () => console.info("Checking for application updates")), at.autoUpdater.on("update-available", (e) => console.info(`Application update ${e.version} is available`)), at.autoUpdater.on("update-not-available", () => console.info("Application is up to date")), at.autoUpdater.on("error", (e) => console.error("Application update failed:", e)), at.autoUpdater.on("update-downloaded", (e) => {
    const t = {
      type: "info",
      title: "Update ready to install",
      message: `Version ${e.version} has been downloaded. Restart the app now to install it?`,
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1,
      noLink: !0
    };
    (H && !H.isDestroyed() ? dn.showMessageBox(H, t) : dn.showMessageBox(t)).then(({ response: n }) => {
      n === 0 && at.autoUpdater.quitAndInstall();
    }).catch((n) => console.error("Could not show update installation prompt:", n));
  }), at.autoUpdater.checkForUpdates().catch((e) => console.error("Could not check for application updates:", e)));
}
Ye.handle("pdf:ready", (e, t) => {
  const r = Ir.get(e.sender.id);
  if (!r) throw new Error("Unexpected PDF ready signal");
  return clearTimeout(r.timeout), Ir.delete(e.sender.id), typeof t == "string" && t ? r.reject(new Error(t)) : r.resolve(), !0;
});
Ye.handle("pdf:show-in-folder", (e, t) => {
  if (!H || H.isDestroyed() || e.sender !== H.webContents)
    throw new Error("Unauthorized PDF request");
  if (typeof t != "string" || !t.trim()) throw new Error("Invalid PDF path");
  Yf.showItemInFolder(t);
});
Ye.handle("window:minimize", () => {
  H == null || H.minimize();
});
Ye.handle("window:maximize", () => {
  if (H) {
    if (H.isMaximized()) {
      H.restore();
      return;
    }
    H.maximize();
  }
});
Ye.handle("window:close", () => {
  H == null || H.close();
});
Ye.handle("window:is-maximized", () => !!H && H.isMaximized());
Ye.handle("pdf:save-record", async (e, t) => {
  if (!H || H.isDestroyed() || e.sender !== H.webContents)
    throw new Error("Unauthorized PDF request");
  if (!t || typeof t != "object") throw new Error("Invalid PDF request");
  const r = t, n = /* @__PURE__ */ new Set(["test", "specimen", "preset", "data-field"]);
  let i, s;
  if (r.type === "test-comparison") {
    const _ = t, m = _.testIds;
    if (typeof _.name != "string" || !Array.isArray(m) || m.length < 2 || !m.every((y) => typeof y == "string" && y.trim().length > 0))
      throw new Error("Invalid PDF comparison request");
    i = _.name;
    const g = new URLSearchParams();
    m.forEach((y) => g.append("testId", y)), s = `/print/test-comparison?${g.toString()}`;
  } else {
    const _ = t;
    if (!_.type || !n.has(_.type) || typeof _.id != "string" || !_.id || typeof _.name != "string")
      throw new Error("Invalid PDF request");
    i = _.name, s = `/print/${_.type}/${encodeURIComponent(_.id)}`;
  }
  const o = Array.from(i.replace(/[<>:"/\\|?*]/g, "_"), (_) => _.charCodeAt(0) < 32 ? "_" : _).join("").trim().replace(/[. ]+$/, "") || "Test", a = H, { canceled: u, filePath: p } = await dn.showSaveDialog(H, {
    title: r.type === "test-comparison" ? "Save Test Comparison as PDF" : "Save Record as PDF",
    defaultPath: Pe.join(ft.getPath("documents"), `${o}.pdf`),
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });
  if (u || !p) return { canceled: !0 };
  if (a.isDestroyed()) throw new Error("The main window was closed before PDF export completed");
  e.sender.send("pdf:creating");
  const l = new Da({
    parent: a,
    width: 750,
    minWidth: 750,
    maxWidth: 750,
    height: 900,
    show: !1,
    autoHideMenuBar: !0,
    webPreferences: {
      preload: Pe.join(Bl, "preload.mjs"),
      devTools: !ft.isPackaged,
      backgroundThrottling: !1
    }
  }), c = l.webContents.id;
  Oa.add(c);
  const d = new Promise((_, m) => {
    const g = setTimeout(() => {
      Ir.delete(c), m(new Error("Timed out waiting for the PDF report to render"));
    }, 3e4);
    Ir.set(c, { resolve: _, reject: m, timeout: g });
  });
  try {
    const _ = Sn ? l.loadURL(`${Sn.replace(/\/$/, "")}/#${s}`) : l.loadFile(Pe.join(Ml, "index.html"), { hash: s });
    await Promise.all([_, d]);
    const m = await l.webContents.printToPDF({
      pageSize: "A4",
      printBackground: !0,
      displayHeaderFooter: !1
    });
    return await Na(p, m), { canceled: !1, filePath: p };
  } finally {
    Oa.delete(c);
    const _ = Ir.get(c);
    _ && (clearTimeout(_.timeout), Ir.delete(c)), l.isDestroyed() || l.close();
  }
});
function rp() {
  H && !H.isDestroyed() || (H = new Da({
    icon: Pe.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Pe.join(Bl, "preload.mjs"),
      devTools: !ft.isPackaged
    },
    minWidth: 1e3,
    minHeight: 600,
    autoHideMenuBar: !0,
    show: !1,
    frame: !1,
    titleBarStyle: "hidden"
  }), H.webContents.setWindowOpenHandler(({ url: e }) => e.startsWith("http:") || e.startsWith("https:") ? (Yf.openExternal(e), { action: "deny" }) : { action: "allow" }), H.on("maximize", () => {
    H == null || H.webContents.send("window:maximized-state-changed", !0);
  }), H.on("unmaximize", () => {
    H == null || H.webContents.send("window:maximized-state-changed", !1);
  }), H.maximize(), H.show(), Sn ? H.loadURL(Sn) : H.loadFile(Pe.join(Ml, "index.html")));
}
ft.on("window-all-closed", () => {
  process.platform !== "darwin" && (ft.quit(), H = null);
});
ft.on("activate", () => {
  Da.getAllWindows().length === 0 && rp();
});
ft.whenReady().then(() => {
  t_.defaultSession.setPermissionRequestHandler((e, t, r) => {
    r(!1);
  }), rp(), jT();
});
export {
  uS as MAIN_DIST,
  Ml as RENDERER_DIST,
  Sn as VITE_DEV_SERVER_URL
};
