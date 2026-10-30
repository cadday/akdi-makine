var em = Object.defineProperty;
var tm = (e, t, r) => t in e ? em(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Lc = (e, t, r) => tm(e, typeof t != "symbol" ? t + "" : t, r);
import pr, { ipcMain as Z, dialog as An, app as xt, BrowserWindow as ol, session as rm, shell as Td } from "electron";
import Zt from "fs";
import nm from "constants";
import Wn from "stream";
import Ls from "util";
import Pd from "assert";
import oe from "path";
import Ns from "child_process";
import al from "events";
import Vn from "crypto";
import ll from "tty";
import Fs from "os";
import er from "url";
import Dd from "zlib";
import im from "http";
import { fileURLToPath as sm } from "node:url";
import Be from "node:path";
import { writeFile as cl, stat as om, readFile as $d, mkdir as am, rm as lm } from "node:fs/promises";
import { randomUUID as Od } from "node:crypto";
import gt from "buffer";
import Ld from "node:net";
var T = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, dt = {}, xr = {}, ke = {};
ke.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
ke.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Bt = nm, cm = process.cwd, is = null, um = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return is || (is = cm.call(process)), is;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Nc = process.chdir;
  process.chdir = function(e) {
    is = null, Nc.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Nc);
}
var fm = dm;
function dm(e) {
  Bt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, u, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, u, d, _) {
    _ && process.nextTick(_);
  }, e.lchownSync = function() {
  }), um === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function u(d, _, x) {
      var g = Date.now(), y = 0;
      l(d, _, function b(C) {
        if (C && (C.code === "EACCES" || C.code === "EPERM" || C.code === "EBUSY") && Date.now() - g < 6e4) {
          setTimeout(function() {
            e.stat(_, function($, B) {
              $ && $.code === "ENOENT" ? l(d, _, b) : x(C);
            });
          }, y), y < 100 && (y += 10);
          return;
        }
        x && x(C);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function u(d, _, x, g, y, b) {
      var C;
      if (b && typeof b == "function") {
        var $ = 0;
        C = function(B, j, Q) {
          if (B && B.code === "EAGAIN" && $ < 10)
            return $++, l.call(e, d, _, x, g, y, C);
          b.apply(this, arguments);
        };
      }
      return l.call(e, d, _, x, g, y, C);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(u, d, _, x, g) {
      for (var y = 0; ; )
        try {
          return l.call(e, u, d, _, x, g);
        } catch (b) {
          if (b.code === "EAGAIN" && y < 10) {
            y++;
            continue;
          }
          throw b;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(u, d, _) {
      l.open(
        u,
        Bt.O_WRONLY | Bt.O_SYMLINK,
        d,
        function(x, g) {
          if (x) {
            _ && _(x);
            return;
          }
          l.fchmod(g, d, function(y) {
            l.close(g, function(b) {
              _ && _(y || b);
            });
          });
        }
      );
    }, l.lchmodSync = function(u, d) {
      var _ = l.openSync(u, Bt.O_WRONLY | Bt.O_SYMLINK, d), x = !0, g;
      try {
        g = l.fchmodSync(_, d), x = !1;
      } finally {
        if (x)
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
    Bt.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(u, d, _, x) {
      l.open(u, Bt.O_SYMLINK, function(g, y) {
        if (g) {
          x && x(g);
          return;
        }
        l.futimes(y, d, _, function(b) {
          l.close(y, function(C) {
            x && x(b || C);
          });
        });
      });
    }, l.lutimesSync = function(u, d, _) {
      var x = l.openSync(u, Bt.O_SYMLINK), g, y = !0;
      try {
        g = l.futimesSync(x, d, _), y = !1;
      } finally {
        if (y)
          try {
            l.closeSync(x);
          } catch {
          }
        else
          l.closeSync(x);
      }
      return g;
    }) : l.futimes && (l.lutimes = function(u, d, _, x) {
      x && process.nextTick(x);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(u, d, _) {
      return l.call(e, u, d, function(x) {
        p(x) && (x = null), _ && _.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(u, d) {
      try {
        return l.call(e, u, d);
      } catch (_) {
        if (!p(_)) throw _;
      }
    };
  }
  function s(l) {
    return l && function(u, d, _, x) {
      return l.call(e, u, d, _, function(g) {
        p(g) && (g = null), x && x.apply(this, arguments);
      });
    };
  }
  function o(l) {
    return l && function(u, d, _) {
      try {
        return l.call(e, u, d, _);
      } catch (x) {
        if (!p(x)) throw x;
      }
    };
  }
  function a(l) {
    return l && function(u, d, _) {
      typeof d == "function" && (_ = d, d = null);
      function x(g, y) {
        y && (y.uid < 0 && (y.uid += 4294967296), y.gid < 0 && (y.gid += 4294967296)), _ && _.apply(this, arguments);
      }
      return d ? l.call(e, u, d, x) : l.call(e, u, x);
    };
  }
  function c(l) {
    return l && function(u, d) {
      var _ = d ? l.call(e, u, d) : l.call(e, u);
      return _ && (_.uid < 0 && (_.uid += 4294967296), _.gid < 0 && (_.gid += 4294967296)), _;
    };
  }
  function p(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Fc = Wn.Stream, hm = pm;
function pm(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Fc.call(this);
    var s = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var o = Object.keys(i), a = 0, c = o.length; a < c; a++) {
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
    e.open(this.path, this.flags, this.mode, function(l, u) {
      if (l) {
        s.emit("error", l), s.readable = !1;
        return;
      }
      s.fd = u, s.emit("open", u), s._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Fc.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var s = Object.keys(i), o = 0, a = s.length; o < a; o++) {
      var c = s[o];
      this[c] = i[c];
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
var _m = xm, mm = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function xm(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: mm(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var fe = Zt, gm = fm, ym = hm, Em = _m, Oi = Ls, Se, ls;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Se = Symbol.for("graceful-fs.queue"), ls = Symbol.for("graceful-fs.previous")) : (Se = "___graceful-fs.queue", ls = "___graceful-fs.previous");
function wm() {
}
function Nd(e, t) {
  Object.defineProperty(e, Se, {
    get: function() {
      return t;
    }
  });
}
var hr = wm;
Oi.debuglog ? hr = Oi.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (hr = function() {
  var e = Oi.format.apply(Oi, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!fe[Se]) {
  var vm = T[Se] || [];
  Nd(fe, vm), fe.close = function(e) {
    function t(r, n) {
      return e.call(fe, r, function(i) {
        i || Uc(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ls, {
      value: e
    }), t;
  }(fe.close), fe.closeSync = function(e) {
    function t(r) {
      e.apply(fe, arguments), Uc();
    }
    return Object.defineProperty(t, ls, {
      value: e
    }), t;
  }(fe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    hr(fe[Se]), Pd.equal(fe[Se].length, 0);
  });
}
T[Se] || Nd(T, fe[Se]);
var qe = ul(Em(fe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fe.__patched && (qe = ul(fe), fe.__patched = !0);
function ul(e) {
  gm(e), e.gracefulify = ul, e.createReadStream = j, e.createWriteStream = Q;
  var t = e.readFile;
  e.readFile = r;
  function r(M, E, W) {
    return typeof E == "function" && (W = E, E = null), J(M, E, W);
    function J(le, P, S, O) {
      return t(le, P, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? Ir([J, [le, P, S], A, O || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(M, E, W, J) {
    return typeof W == "function" && (J = W, W = null), le(M, E, W, J);
    function le(P, S, O, A, L) {
      return n(P, S, O, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ir([le, [P, S, O, A], D, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = o);
  function o(M, E, W, J) {
    return typeof W == "function" && (J = W, W = null), le(M, E, W, J);
    function le(P, S, O, A, L) {
      return s(P, S, O, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ir([le, [P, S, O, A], D, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(M, E, W, J) {
    return typeof W == "function" && (J = W, W = 0), le(M, E, W, J);
    function le(P, S, O, A, L) {
      return a(P, S, O, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ir([le, [P, S, O, A], D, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = u;
  var l = /^v[0-5]\./;
  function u(M, E, W) {
    typeof E == "function" && (W = E, E = null);
    var J = l.test(process.version) ? function(S, O, A, L) {
      return p(S, le(
        S,
        O,
        A,
        L
      ));
    } : function(S, O, A, L) {
      return p(S, O, le(
        S,
        O,
        A,
        L
      ));
    };
    return J(M, E, W);
    function le(P, S, O, A) {
      return function(L, D) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? Ir([
          J,
          [P, S, O],
          L,
          A || Date.now(),
          Date.now()
        ]) : (D && D.sort && D.sort(), typeof O == "function" && O.call(this, L, D));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = ym(e);
    b = d.ReadStream, $ = d.WriteStream;
  }
  var _ = e.ReadStream;
  _ && (b.prototype = Object.create(_.prototype), b.prototype.open = C);
  var x = e.WriteStream;
  x && ($.prototype = Object.create(x.prototype), $.prototype.open = B), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return b;
    },
    set: function(M) {
      b = M;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return $;
    },
    set: function(M) {
      $ = M;
    },
    enumerable: !0,
    configurable: !0
  });
  var g = b;
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
  var y = $;
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
  function b(M, E) {
    return this instanceof b ? (_.apply(this, arguments), this) : b.apply(Object.create(b.prototype), arguments);
  }
  function C() {
    var M = this;
    se(M.path, M.flags, M.mode, function(E, W) {
      E ? (M.autoClose && M.destroy(), M.emit("error", E)) : (M.fd = W, M.emit("open", W), M.read());
    });
  }
  function $(M, E) {
    return this instanceof $ ? (x.apply(this, arguments), this) : $.apply(Object.create($.prototype), arguments);
  }
  function B() {
    var M = this;
    se(M.path, M.flags, M.mode, function(E, W) {
      E ? (M.destroy(), M.emit("error", E)) : (M.fd = W, M.emit("open", W));
    });
  }
  function j(M, E) {
    return new e.ReadStream(M, E);
  }
  function Q(M, E) {
    return new e.WriteStream(M, E);
  }
  var K = e.open;
  e.open = se;
  function se(M, E, W, J) {
    return typeof W == "function" && (J = W, W = null), le(M, E, W, J);
    function le(P, S, O, A, L) {
      return K(P, S, O, function(D, k) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ir([le, [P, S, O, A], D, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function Ir(e) {
  hr("ENQUEUE", e[0].name, e[1]), fe[Se].push(e), fl();
}
var Li;
function Uc() {
  for (var e = Date.now(), t = 0; t < fe[Se].length; ++t)
    fe[Se][t].length > 2 && (fe[Se][t][3] = e, fe[Se][t][4] = e);
  fl();
}
function fl() {
  if (clearTimeout(Li), Li = void 0, fe[Se].length !== 0) {
    var e = fe[Se].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      hr("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      hr("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var a = Date.now() - s, c = Math.max(s - i, 1), p = Math.min(c * 1.2, 100);
      a >= p ? (hr("RETRY", t.name, r), t.apply(null, r.concat([i]))) : fe[Se].push(e);
    }
    Li === void 0 && (Li = setTimeout(fl, 0));
  }
}
(function(e) {
  const t = ke.fromCallback, r = qe, n = [
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
  }, e.read = function(i, s, o, a, c, p) {
    return typeof p == "function" ? r.read(i, s, o, a, c, p) : new Promise((l, u) => {
      r.read(i, s, o, a, c, (d, _, x) => {
        if (d) return u(d);
        l({ bytesRead: _, buffer: x });
      });
    });
  }, e.write = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.write(i, s, ...o) : new Promise((a, c) => {
      r.write(i, s, ...o, (p, l, u) => {
        if (p) return c(p);
        a({ bytesWritten: l, buffer: u });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.writev(i, s, ...o) : new Promise((a, c) => {
      r.writev(i, s, ...o, (p, l, u) => {
        if (p) return c(p);
        a({ bytesWritten: l, buffers: u });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(xr);
var dl = {}, Fd = {};
const bm = oe;
Fd.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(bm.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Ud = xr, { checkPath: Bd } = Fd, Md = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
dl.makeDir = async (e, t) => (Bd(e), Ud.mkdir(e, {
  mode: Md(t),
  recursive: !0
}));
dl.makeDirSync = (e, t) => (Bd(e), Ud.mkdirSync(e, {
  mode: Md(t),
  recursive: !0
}));
const Rm = ke.fromPromise, { makeDir: Cm, makeDirSync: Uo } = dl, Bo = Rm(Cm);
var yt = {
  mkdirs: Bo,
  mkdirsSync: Uo,
  // alias
  mkdirp: Bo,
  mkdirpSync: Uo,
  ensureDir: Bo,
  ensureDirSync: Uo
};
const Im = ke.fromPromise, kd = xr;
function Am(e) {
  return kd.access(e).then(() => !0).catch(() => !1);
}
var gr = {
  pathExists: Im(Am),
  pathExistsSync: kd.existsSync
};
const kr = qe;
function Sm(e, t, r, n) {
  kr.open(e, "r+", (i, s) => {
    if (i) return n(i);
    kr.futimes(s, t, r, (o) => {
      kr.close(s, (a) => {
        n && n(o || a);
      });
    });
  });
}
function Tm(e, t, r) {
  const n = kr.openSync(e, "r+");
  return kr.futimesSync(n, t, r), kr.closeSync(n);
}
var qd = {
  utimesMillis: Sm,
  utimesMillisSync: Tm
};
const jr = xr, be = oe, Pm = Ls;
function Dm(e, t, r) {
  const n = r.dereference ? (i) => jr.stat(i, { bigint: !0 }) : (i) => jr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function $m(e, t, r) {
  let n;
  const i = r.dereference ? (o) => jr.statSync(o, { bigint: !0 }) : (o) => jr.lstatSync(o, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: s, destStat: null };
    throw o;
  }
  return { srcStat: s, destStat: n };
}
function Om(e, t, r, n, i) {
  Pm.callbackify(Dm)(e, t, n, (s, o) => {
    if (s) return i(s);
    const { srcStat: a, destStat: c } = o;
    if (c) {
      if (zn(a, c)) {
        const p = be.basename(e), l = be.basename(t);
        return r === "move" && p !== l && p.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && hl(e, t) ? i(new Error(Us(e, t, r))) : i(null, { srcStat: a, destStat: c });
  });
}
function Lm(e, t, r, n) {
  const { srcStat: i, destStat: s } = $m(e, t, n);
  if (s) {
    if (zn(i, s)) {
      const o = be.basename(e), a = be.basename(t);
      if (r === "move" && o !== a && o.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && hl(e, t))
    throw new Error(Us(e, t, r));
  return { srcStat: i, destStat: s };
}
function jd(e, t, r, n, i) {
  const s = be.resolve(be.dirname(e)), o = be.resolve(be.dirname(r));
  if (o === s || o === be.parse(o).root) return i();
  jr.stat(o, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : zn(t, c) ? i(new Error(Us(e, r, n))) : jd(e, t, o, n, i));
}
function Hd(e, t, r, n) {
  const i = be.resolve(be.dirname(e)), s = be.resolve(be.dirname(r));
  if (s === i || s === be.parse(s).root) return;
  let o;
  try {
    o = jr.statSync(s, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (zn(t, o))
    throw new Error(Us(e, r, n));
  return Hd(e, t, s, n);
}
function zn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function hl(e, t) {
  const r = be.resolve(e).split(be.sep).filter((i) => i), n = be.resolve(t).split(be.sep).filter((i) => i);
  return r.reduce((i, s, o) => i && n[o] === s, !0);
}
function Us(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Vr = {
  checkPaths: Om,
  checkPathsSync: Lm,
  checkParentPaths: jd,
  checkParentPathsSync: Hd,
  isSrcSubdir: hl,
  areIdentical: zn
};
const We = qe, Sn = oe, Nm = yt.mkdirs, Fm = gr.pathExists, Um = qd.utimesMillis, Tn = Vr;
function Bm(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Tn.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: o, destStat: a } = s;
    Tn.checkParentPaths(e, o, t, "copy", (c) => c ? n(c) : r.filter ? Gd(Bc, a, e, t, r, n) : Bc(a, e, t, r, n));
  });
}
function Bc(e, t, r, n, i) {
  const s = Sn.dirname(r);
  Fm(s, (o, a) => {
    if (o) return i(o);
    if (a) return cs(e, t, r, n, i);
    Nm(s, (c) => c ? i(c) : cs(e, t, r, n, i));
  });
}
function Gd(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, s) : s(), (o) => s(o));
}
function Mm(e, t, r, n, i) {
  return n.filter ? Gd(cs, e, t, r, n, i) : cs(e, t, r, n, i);
}
function cs(e, t, r, n, i) {
  (n.dereference ? We.stat : We.lstat)(t, (o, a) => o ? i(o) : a.isDirectory() ? Vm(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? km(a, e, t, r, n, i) : a.isSymbolicLink() ? Xm(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function km(e, t, r, n, i, s) {
  return t ? qm(e, r, n, i, s) : Wd(e, r, n, i, s);
}
function qm(e, t, r, n, i) {
  if (n.overwrite)
    We.unlink(r, (s) => s ? i(s) : Wd(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Wd(e, t, r, n, i) {
  We.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? jm(e.mode, t, r, i) : Bs(r, e.mode, i));
}
function jm(e, t, r, n) {
  return Hm(e) ? Gm(r, e, (i) => i ? n(i) : Mc(e, t, r, n)) : Mc(e, t, r, n);
}
function Hm(e) {
  return (e & 128) === 0;
}
function Gm(e, t, r) {
  return Bs(e, t | 128, r);
}
function Mc(e, t, r, n) {
  Wm(t, r, (i) => i ? n(i) : Bs(r, e, n));
}
function Bs(e, t, r) {
  return We.chmod(e, t, r);
}
function Wm(e, t, r) {
  We.stat(e, (n, i) => n ? r(n) : Um(t, i.atime, i.mtime, r));
}
function Vm(e, t, r, n, i, s) {
  return t ? Vd(r, n, i, s) : zm(e.mode, r, n, i, s);
}
function zm(e, t, r, n, i) {
  We.mkdir(r, (s) => {
    if (s) return i(s);
    Vd(t, r, n, (o) => o ? i(o) : Bs(r, e, i));
  });
}
function Vd(e, t, r, n) {
  We.readdir(e, (i, s) => i ? n(i) : zd(s, e, t, r, n));
}
function zd(e, t, r, n, i) {
  const s = e.pop();
  return s ? Ym(e, s, t, r, n, i) : i();
}
function Ym(e, t, r, n, i, s) {
  const o = Sn.join(r, t), a = Sn.join(n, t);
  Tn.checkPaths(o, a, "copy", i, (c, p) => {
    if (c) return s(c);
    const { destStat: l } = p;
    Mm(l, o, a, i, (u) => u ? s(u) : zd(e, r, n, i, s));
  });
}
function Xm(e, t, r, n, i) {
  We.readlink(t, (s, o) => {
    if (s) return i(s);
    if (n.dereference && (o = Sn.resolve(process.cwd(), o)), e)
      We.readlink(r, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? We.symlink(o, r, i) : i(a) : (n.dereference && (c = Sn.resolve(process.cwd(), c)), Tn.isSrcSubdir(o, c) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Tn.isSrcSubdir(c, o) ? i(new Error(`Cannot overwrite '${c}' with '${o}'.`)) : Km(o, r, i)));
    else
      return We.symlink(o, r, i);
  });
}
function Km(e, t, r) {
  We.unlink(t, (n) => n ? r(n) : We.symlink(e, t, r));
}
var Jm = Bm;
const Le = qe, Pn = oe, Qm = yt.mkdirsSync, Zm = qd.utimesMillisSync, Dn = Vr;
function ex(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Dn.checkPathsSync(e, t, "copy", r);
  return Dn.checkParentPathsSync(e, n, t, "copy"), tx(i, e, t, r);
}
function tx(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Pn.dirname(r);
  return Le.existsSync(i) || Qm(i), Yd(e, t, r, n);
}
function rx(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Yd(e, t, r, n);
}
function Yd(e, t, r, n) {
  const s = (n.dereference ? Le.statSync : Le.lstatSync)(t);
  if (s.isDirectory()) return cx(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return nx(s, e, t, r, n);
  if (s.isSymbolicLink()) return dx(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function nx(e, t, r, n, i) {
  return t ? ix(e, r, n, i) : Xd(e, r, n, i);
}
function ix(e, t, r, n) {
  if (n.overwrite)
    return Le.unlinkSync(r), Xd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Xd(e, t, r, n) {
  return Le.copyFileSync(t, r), n.preserveTimestamps && sx(e.mode, t, r), pl(r, e.mode);
}
function sx(e, t, r) {
  return ox(e) && ax(r, e), lx(t, r);
}
function ox(e) {
  return (e & 128) === 0;
}
function ax(e, t) {
  return pl(e, t | 128);
}
function pl(e, t) {
  return Le.chmodSync(e, t);
}
function lx(e, t) {
  const r = Le.statSync(e);
  return Zm(t, r.atime, r.mtime);
}
function cx(e, t, r, n, i) {
  return t ? Kd(r, n, i) : ux(e.mode, r, n, i);
}
function ux(e, t, r, n) {
  return Le.mkdirSync(r), Kd(t, r, n), pl(r, e);
}
function Kd(e, t, r) {
  Le.readdirSync(e).forEach((n) => fx(n, e, t, r));
}
function fx(e, t, r, n) {
  const i = Pn.join(t, e), s = Pn.join(r, e), { destStat: o } = Dn.checkPathsSync(i, s, "copy", n);
  return rx(o, i, s, n);
}
function dx(e, t, r, n) {
  let i = Le.readlinkSync(t);
  if (n.dereference && (i = Pn.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = Le.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return Le.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (s = Pn.resolve(process.cwd(), s)), Dn.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (Le.statSync(r).isDirectory() && Dn.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return hx(i, r);
  } else
    return Le.symlinkSync(i, r);
}
function hx(e, t) {
  return Le.unlinkSync(t), Le.symlinkSync(e, t);
}
var px = ex;
const _x = ke.fromCallback;
var _l = {
  copy: _x(Jm),
  copySync: px
};
const kc = qe, Jd = oe, te = Pd, $n = process.platform === "win32";
function Qd(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || kc[r], r = r + "Sync", e[r] = e[r] || kc[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ml(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te.strictEqual(typeof r, "function", "rimraf: callback function required"), te(t, "rimraf: invalid options argument provided"), te.strictEqual(typeof t, "object", "rimraf: options should be object"), Qd(t), qc(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => qc(e, t, i), o);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function qc(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && $n)
      return jc(e, t, n, r);
    if (i && i.isDirectory())
      return ss(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return $n ? jc(e, t, s, r) : ss(e, t, s, r);
        if (s.code === "EISDIR")
          return ss(e, t, s, r);
      }
      return r(s);
    });
  });
}
function jc(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, o) => {
      s ? n(s.code === "ENOENT" ? null : r) : o.isDirectory() ? ss(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Hc(e, t, r) {
  let n;
  te(e), te(t);
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
  n.isDirectory() ? os(e, t, r) : t.unlinkSync(e);
}
function ss(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? mx(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function mx(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, o;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      ml(Jd.join(e, a), t, (c) => {
        if (!o) {
          if (c) return r(o = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Zd(e, t) {
  let r;
  t = t || {}, Qd(t), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te(t, "rimraf: missing options"), te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && $n && Hc(e, t, n);
  }
  try {
    r && r.isDirectory() ? os(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return $n ? Hc(e, t, n) : os(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    os(e, t, n);
  }
}
function os(e, t, r) {
  te(e), te(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      xx(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function xx(e, t) {
  if (te(e), te(t), t.readdirSync(e).forEach((r) => Zd(Jd.join(e, r), t)), $n) {
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
var gx = ml;
ml.sync = Zd;
const us = qe, yx = ke.fromCallback, e0 = gx;
function Ex(e, t) {
  if (us.rm) return us.rm(e, { recursive: !0, force: !0 }, t);
  e0(e, t);
}
function wx(e) {
  if (us.rmSync) return us.rmSync(e, { recursive: !0, force: !0 });
  e0.sync(e);
}
var Ms = {
  remove: yx(Ex),
  removeSync: wx
};
const vx = ke.fromPromise, t0 = xr, r0 = oe, n0 = yt, i0 = Ms, Gc = vx(async function(t) {
  let r;
  try {
    r = await t0.readdir(t);
  } catch {
    return n0.mkdirs(t);
  }
  return Promise.all(r.map((n) => i0.remove(r0.join(t, n))));
});
function Wc(e) {
  let t;
  try {
    t = t0.readdirSync(e);
  } catch {
    return n0.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = r0.join(e, r), i0.removeSync(r);
  });
}
var bx = {
  emptyDirSync: Wc,
  emptydirSync: Wc,
  emptyDir: Gc,
  emptydir: Gc
};
const Rx = ke.fromCallback, s0 = oe, Ht = qe, o0 = yt;
function Cx(e, t) {
  function r() {
    Ht.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Ht.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = s0.dirname(e);
    Ht.stat(s, (o, a) => {
      if (o)
        return o.code === "ENOENT" ? o0.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(o);
      a.isDirectory() ? r() : Ht.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function Ix(e) {
  let t;
  try {
    t = Ht.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = s0.dirname(e);
  try {
    Ht.statSync(r).isDirectory() || Ht.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") o0.mkdirsSync(r);
    else throw n;
  }
  Ht.writeFileSync(e, "");
}
var Ax = {
  createFile: Rx(Cx),
  createFileSync: Ix
};
const Sx = ke.fromCallback, a0 = oe, jt = qe, l0 = yt, Tx = gr.pathExists, { areIdentical: c0 } = Vr;
function Px(e, t, r) {
  function n(i, s) {
    jt.link(i, s, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  jt.lstat(t, (i, s) => {
    jt.lstat(e, (o, a) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (s && c0(a, s)) return r(null);
      const c = a0.dirname(t);
      Tx(c, (p, l) => {
        if (p) return r(p);
        if (l) return n(e, t);
        l0.mkdirs(c, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function Dx(e, t) {
  let r;
  try {
    r = jt.lstatSync(t);
  } catch {
  }
  try {
    const s = jt.lstatSync(e);
    if (r && c0(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = a0.dirname(t);
  return jt.existsSync(n) || l0.mkdirsSync(n), jt.linkSync(e, t);
}
var $x = {
  createLink: Sx(Px),
  createLinkSync: Dx
};
const Gt = oe, vn = qe, Ox = gr.pathExists;
function Lx(e, t, r) {
  if (Gt.isAbsolute(e))
    return vn.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Gt.dirname(t), i = Gt.join(n, e);
    return Ox(i, (s, o) => s ? r(s) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : vn.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: Gt.relative(n, e)
    })));
  }
}
function Nx(e, t) {
  let r;
  if (Gt.isAbsolute(e)) {
    if (r = vn.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Gt.dirname(t), i = Gt.join(n, e);
    if (r = vn.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = vn.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Gt.relative(n, e)
    };
  }
}
var Fx = {
  symlinkPaths: Lx,
  symlinkPathsSync: Nx
};
const u0 = qe;
function Ux(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  u0.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Bx(e, t) {
  let r;
  if (t) return t;
  try {
    r = u0.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Mx = {
  symlinkType: Ux,
  symlinkTypeSync: Bx
};
const kx = ke.fromCallback, f0 = oe, it = xr, d0 = yt, qx = d0.mkdirs, jx = d0.mkdirsSync, h0 = Fx, Hx = h0.symlinkPaths, Gx = h0.symlinkPathsSync, p0 = Mx, Wx = p0.symlinkType, Vx = p0.symlinkTypeSync, zx = gr.pathExists, { areIdentical: _0 } = Vr;
function Yx(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, it.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      it.stat(e),
      it.stat(t)
    ]).then(([o, a]) => {
      if (_0(o, a)) return n(null);
      Vc(e, t, r, n);
    }) : Vc(e, t, r, n);
  });
}
function Vc(e, t, r, n) {
  Hx(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, Wx(s.toCwd, r, (o, a) => {
      if (o) return n(o);
      const c = f0.dirname(t);
      zx(c, (p, l) => {
        if (p) return n(p);
        if (l) return it.symlink(e, t, a, n);
        qx(c, (u) => {
          if (u) return n(u);
          it.symlink(e, t, a, n);
        });
      });
    });
  });
}
function Xx(e, t, r) {
  let n;
  try {
    n = it.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = it.statSync(e), c = it.statSync(t);
    if (_0(a, c)) return;
  }
  const i = Gx(e, t);
  e = i.toDst, r = Vx(i.toCwd, r);
  const s = f0.dirname(t);
  return it.existsSync(s) || jx(s), it.symlinkSync(e, t, r);
}
var Kx = {
  createSymlink: kx(Yx),
  createSymlinkSync: Xx
};
const { createFile: zc, createFileSync: Yc } = Ax, { createLink: Xc, createLinkSync: Kc } = $x, { createSymlink: Jc, createSymlinkSync: Qc } = Kx;
var Jx = {
  // file
  createFile: zc,
  createFileSync: Yc,
  ensureFile: zc,
  ensureFileSync: Yc,
  // link
  createLink: Xc,
  createLinkSync: Kc,
  ensureLink: Xc,
  ensureLinkSync: Kc,
  // symlink
  createSymlink: Jc,
  createSymlinkSync: Qc,
  ensureSymlink: Jc,
  ensureSymlinkSync: Qc
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
var xl = { stringify: Qx, stripBom: Zx };
let Hr;
try {
  Hr = qe;
} catch {
  Hr = Zt;
}
const ks = ke, { stringify: m0, stripBom: x0 } = xl;
async function eg(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Hr, n = "throws" in t ? t.throws : !0;
  let i = await ks.fromCallback(r.readFile)(e, t);
  i = x0(i);
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
const tg = ks.fromPromise(eg);
function rg(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Hr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = x0(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function ng(e, t, r = {}) {
  const n = r.fs || Hr, i = m0(t, r);
  await ks.fromCallback(n.writeFile)(e, i, r);
}
const ig = ks.fromPromise(ng);
function sg(e, t, r = {}) {
  const n = r.fs || Hr, i = m0(t, r);
  return n.writeFileSync(e, i, r);
}
var og = {
  readFile: tg,
  readFileSync: rg,
  writeFile: ig,
  writeFileSync: sg
};
const Ni = og;
var ag = {
  // jsonfile exports
  readJson: Ni.readFile,
  readJsonSync: Ni.readFileSync,
  writeJson: Ni.writeFile,
  writeJsonSync: Ni.writeFileSync
};
const lg = ke.fromCallback, bn = qe, g0 = oe, y0 = yt, cg = gr.pathExists;
function ug(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = g0.dirname(e);
  cg(i, (s, o) => {
    if (s) return n(s);
    if (o) return bn.writeFile(e, t, r, n);
    y0.mkdirs(i, (a) => {
      if (a) return n(a);
      bn.writeFile(e, t, r, n);
    });
  });
}
function fg(e, ...t) {
  const r = g0.dirname(e);
  if (bn.existsSync(r))
    return bn.writeFileSync(e, ...t);
  y0.mkdirsSync(r), bn.writeFileSync(e, ...t);
}
var gl = {
  outputFile: lg(ug),
  outputFileSync: fg
};
const { stringify: dg } = xl, { outputFile: hg } = gl;
async function pg(e, t, r = {}) {
  const n = dg(t, r);
  await hg(e, n, r);
}
var _g = pg;
const { stringify: mg } = xl, { outputFileSync: xg } = gl;
function gg(e, t, r) {
  const n = mg(t, r);
  xg(e, n, r);
}
var yg = gg;
const Eg = ke.fromPromise, Me = ag;
Me.outputJson = Eg(_g);
Me.outputJsonSync = yg;
Me.outputJSON = Me.outputJson;
Me.outputJSONSync = Me.outputJsonSync;
Me.writeJSON = Me.writeJson;
Me.writeJSONSync = Me.writeJsonSync;
Me.readJSON = Me.readJson;
Me.readJSONSync = Me.readJsonSync;
var wg = Me;
const vg = qe, ka = oe, bg = _l.copy, E0 = Ms.remove, Rg = yt.mkdirp, Cg = gr.pathExists, Zc = Vr;
function Ig(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Zc.checkPaths(e, t, "move", r, (s, o) => {
    if (s) return n(s);
    const { srcStat: a, isChangingCase: c = !1 } = o;
    Zc.checkParentPaths(e, a, t, "move", (p) => {
      if (p) return n(p);
      if (Ag(t)) return eu(e, t, i, c, n);
      Rg(ka.dirname(t), (l) => l ? n(l) : eu(e, t, i, c, n));
    });
  });
}
function Ag(e) {
  const t = ka.dirname(e);
  return ka.parse(t).root === t;
}
function eu(e, t, r, n, i) {
  if (n) return Mo(e, t, r, i);
  if (r)
    return E0(t, (s) => s ? i(s) : Mo(e, t, r, i));
  Cg(t, (s, o) => s ? i(s) : o ? i(new Error("dest already exists.")) : Mo(e, t, r, i));
}
function Mo(e, t, r, n) {
  vg.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Sg(e, t, r, n) : n());
}
function Sg(e, t, r, n) {
  bg(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : E0(e, n));
}
var Tg = Ig;
const w0 = qe, qa = oe, Pg = _l.copySync, v0 = Ms.removeSync, Dg = yt.mkdirpSync, tu = Vr;
function $g(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = tu.checkPathsSync(e, t, "move", r);
  return tu.checkParentPathsSync(e, i, t, "move"), Og(t) || Dg(qa.dirname(t)), Lg(e, t, n, s);
}
function Og(e) {
  const t = qa.dirname(e);
  return qa.parse(t).root === t;
}
function Lg(e, t, r, n) {
  if (n) return ko(e, t, r);
  if (r)
    return v0(t), ko(e, t, r);
  if (w0.existsSync(t)) throw new Error("dest already exists.");
  return ko(e, t, r);
}
function ko(e, t, r) {
  try {
    w0.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Ng(e, t, r);
  }
}
function Ng(e, t, r) {
  return Pg(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), v0(e);
}
var Fg = $g;
const Ug = ke.fromCallback;
var Bg = {
  move: Ug(Tg),
  moveSync: Fg
}, tr = {
  // Export promiseified graceful-fs:
  ...xr,
  // Export extra methods:
  ..._l,
  ...bx,
  ...Jx,
  ...wg,
  ...yt,
  ...Bg,
  ...gl,
  ...gr,
  ...Ms
}, yr = {}, zt = {}, we = {}, Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.CancellationError = Yt.CancellationToken = void 0;
const Mg = al;
class kg extends Mg.EventEmitter {
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
      return Promise.reject(new ja());
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
          s(new ja());
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
Yt.CancellationToken = kg;
class ja extends Error {
  constructor() {
    super("cancelled");
  }
}
Yt.CancellationError = ja;
var zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.newError = qg;
function qg(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Ee = {}, Ha = { exports: {} }, Fi = { exports: {} }, qo, ru;
function b0() {
  if (ru) return qo;
  ru = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  qo = function(l, u) {
    u = u || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return o(l);
    if (d === "number" && isFinite(l))
      return u.long ? c(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function o(l) {
    if (l = String(l), !(l.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (u) {
        var d = parseFloat(u[1]), _ = (u[2] || "ms").toLowerCase();
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
    var u = Math.abs(l);
    return u >= n ? Math.round(l / n) + "d" : u >= r ? Math.round(l / r) + "h" : u >= t ? Math.round(l / t) + "m" : u >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var u = Math.abs(l);
    return u >= n ? p(l, u, n, "day") : u >= r ? p(l, u, r, "hour") : u >= t ? p(l, u, t, "minute") : u >= e ? p(l, u, e, "second") : l + " ms";
  }
  function p(l, u, d, _) {
    var x = u >= d * 1.5;
    return Math.round(l / d) + " " + _ + (x ? "s" : "");
  }
  return qo;
}
var jo, nu;
function R0() {
  if (nu) return jo;
  nu = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = s, n.enabled = c, n.humanize = b0(), n.destroy = l, Object.keys(t).forEach((u) => {
      n[u] = t[u];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(u) {
      let d = 0;
      for (let _ = 0; _ < u.length; _++)
        d = (d << 5) - d + u.charCodeAt(_), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(u) {
      let d, _ = null, x, g;
      function y(...b) {
        if (!y.enabled)
          return;
        const C = y, $ = Number(/* @__PURE__ */ new Date()), B = $ - (d || $);
        C.diff = B, C.prev = d, C.curr = $, d = $, b[0] = n.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let j = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (K, se) => {
          if (K === "%%")
            return "%";
          j++;
          const M = n.formatters[se];
          if (typeof M == "function") {
            const E = b[j];
            K = M.call(C, E), b.splice(j, 1), j--;
          }
          return K;
        }), n.formatArgs.call(C, b), (C.log || n.log).apply(C, b);
      }
      return y.namespace = u, y.useColors = n.useColors(), y.color = n.selectColor(u), y.extend = i, y.destroy = n.destroy, Object.defineProperty(y, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => _ !== null ? _ : (x !== n.namespaces && (x = n.namespaces, g = n.enabled(u)), g),
        set: (b) => {
          _ = b;
        }
      }), typeof n.init == "function" && n.init(y), y;
    }
    function i(u, d) {
      const _ = n(this.namespace + (typeof d > "u" ? ":" : d) + u);
      return _.log = this.log, _;
    }
    function s(u) {
      n.save(u), n.namespaces = u, n.names = [], n.skips = [];
      const d = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const _ of d)
        _[0] === "-" ? n.skips.push(_.slice(1)) : n.names.push(_);
    }
    function o(u, d) {
      let _ = 0, x = 0, g = -1, y = 0;
      for (; _ < u.length; )
        if (x < d.length && (d[x] === u[_] || d[x] === "*"))
          d[x] === "*" ? (g = x, y = _, x++) : (_++, x++);
        else if (g !== -1)
          x = g + 1, y++, _ = y;
        else
          return !1;
      for (; x < d.length && d[x] === "*"; )
        x++;
      return x === d.length;
    }
    function a() {
      const u = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), u;
    }
    function c(u) {
      for (const d of n.skips)
        if (o(u, d))
          return !1;
      for (const d of n.names)
        if (o(u, d))
          return !0;
      return !1;
    }
    function p(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return jo = e, jo;
}
var iu;
function jg() {
  return iu || (iu = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = s, t.useColors = r, t.storage = o(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
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
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      c.splice(1, 0, p, "color: inherit");
      let l = 0, u = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (u = l));
      }), c.splice(u, 0, p);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = R0()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Fi, Fi.exports)), Fi.exports;
}
var Ui = { exports: {} }, Ho, su;
function Hg() {
  return su || (su = 1, Ho = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Ho;
}
var Go, ou;
function C0() {
  if (ou) return Go;
  ou = 1;
  const e = Fs, t = ll, r = Hg(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function o(c, p) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !p && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const u = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function a(c) {
    const p = o(c, c && c.isTTY);
    return s(p);
  }
  return Go = {
    supportsColor: a,
    stdout: s(o(!0, t.isatty(1))),
    stderr: s(o(!0, t.isatty(2)))
  }, Go;
}
var au;
function Gg() {
  return au || (au = 1, function(e, t) {
    const r = ll, n = Ls;
    t.init = l, t.log = a, t.formatArgs = s, t.save = c, t.load = p, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = C0();
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
      const x = _.substring(6).toLowerCase().replace(/_([a-z])/g, (y, b) => b.toUpperCase());
      let g = process.env[_];
      return /^(yes|on|true|enabled)$/i.test(g) ? g = !0 : /^(no|off|false|disabled)$/i.test(g) ? g = !1 : g === "null" ? g = null : g = Number(g), d[x] = g, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: _, useColors: x } = this;
      if (x) {
        const g = this.color, y = "\x1B[3" + (g < 8 ? g : "8;5;" + g), b = `  ${y};1m${_} \x1B[0m`;
        d[0] = b + d[0].split(`
`).join(`
` + b), d.push(y + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const _ = Object.keys(t.inspectOpts);
      for (let x = 0; x < _.length; x++)
        d.inspectOpts[_[x]] = t.inspectOpts[_[x]];
    }
    e.exports = R0()(t);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((_) => _.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(Ui, Ui.exports)), Ui.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ha.exports = jg() : Ha.exports = Gg();
var Wg = Ha.exports, Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.ProgressCallbackTransform = void 0;
const Vg = Wn;
class zg extends Vg.Transform {
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
Yn.ProgressCallbackTransform = zg;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.DigestTransform = Ee.HttpExecutor = Ee.HttpError = void 0;
Ee.addSensitiveRedirectHeader = ey;
Ee.addSensitiveFieldPattern = ty;
Ee.createHttpError = Wa;
Ee.parseJson = ny;
Ee.configureRequestOptionsFromUrl = P0;
Ee.configureRequestUrl = wl;
Ee.safeGetHeader = qr;
Ee.configureRequestOptions = fs;
Ee.isSensitiveFieldName = D0;
Ee.hashSensitiveValue = $0;
Ee.safeStringifyJson = Lr;
const I0 = Vn, Yg = Wg, Xg = Zt, Kg = Wn, Ga = er, Jg = Yt, lu = zr, Qg = Yn, Mt = (0, Yg.default)("electron-builder"), yl = (e) => e.toLowerCase().replace(/[-_]/g, ""), A0 = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), S0 = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], Zg = ["key"];
function ey(e) {
  A0.add(yl(e));
}
function ty(e) {
  S0.push(e.toLowerCase().replace(/[-_]/g, ""));
}
function Wa(e, t = null) {
  return new El(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Lr(e.headers), t);
}
const ry = /* @__PURE__ */ new Map([
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
class El extends Error {
  constructor(t, r = `HTTP error: ${ry.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ee.HttpError = El;
function ny(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Or {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Jg.CancellationToken(), n) {
    fs(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      Mt.enabled && Mt(Lr(n));
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
    if (Mt.enabled) {
      const { headers: s, auth: o, ...a } = t;
      Mt(`Request: ${Lr(a)}`);
    }
    return r.createPromise((s, o, a) => {
      const c = this.createRequest(t, (p) => {
        try {
          this.handleResponse(p, t, r, s, o, i, n);
        } catch (l) {
          o(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, o, t.timeout), this.addRedirectHandlers(c, t, o, i, (p) => {
        this.doApiRequest(p, r, n, i).then(s).catch(o);
      }), n(c, o), a(() => c.abort());
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
    var c;
    if (Mt.enabled) {
      const { headers: _, auth: x, ...g } = r;
      Mt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Lr(g)}`);
    }
    if (t.statusCode === 404) {
      s(Wa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = p >= 300 && p < 400, u = qr(t, "location");
    if (l && u != null) {
      if (o > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Or.prepareRedirectUrlOptions(u, r), n, a, o).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", s), t.on("data", (_) => d += _), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const _ = qr(t, "content-type"), x = _ != null && (Array.isArray(_) ? _.find((g) => g.includes("json")) != null : _.includes("json"));
          s(Wa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${x ? Lr(JSON.parse(d)) : d}
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
      wl(t, a), fs(a), this.doDownload(a, {
        destination: null,
        options: r,
        onCancel: s,
        callback: (c) => {
          c == null ? n(Buffer.concat(o)) : i(c);
        },
        responseHandler: (c, p) => {
          let l = 0;
          c.on("data", (u) => {
            if (l += u.length, l > 524288e3) {
              p(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            o.push(u);
          }), c.on("end", () => {
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
      const o = qr(s, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(Or.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? sy(r, s) : r.responseHandler(s, r.callback);
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
    const n = P0(t, { ...r }), i = n.headers;
    if (i == null)
      return n;
    const s = Or.reconstructOriginalUrl(r), o = T0(t, r);
    if (Or.isCrossOriginRedirect(s, o)) {
      Mt.enabled && Mt(`Cross-origin redirect (${s.host} → ${o.host}): stripping sensitive headers`);
      for (const a of Object.keys(i))
        A0.has(yl(a)) && delete i[a];
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new Ga.URL(`${r}//${n}${i}${s}`);
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
        if (n < r && (i instanceof El && i.isServerError() || i.code === "EPIPE")) {
          await new Promise((s) => setTimeout(s, 1e3 * (n + 1)));
          continue;
        }
        throw i;
      }
  }
}
Ee.HttpExecutor = Or;
function T0(e, t) {
  try {
    return new Ga.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new Ga.URL(e, s);
  }
}
function P0(e, t) {
  const r = fs(t), n = T0(e, t);
  return wl(n, r), r;
}
function wl(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Va extends Kg.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, I0.createHash)(r);
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
      throw (0, lu.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, lu.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ee.DigestTransform = Va;
function iy(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function qr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function sy(e, t) {
  if (!iy(qr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = qr(t, "content-length");
    o != null && r.push(new Qg.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Va(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Va(e.options.sha2, "sha256", "hex"));
  const i = (0, Xg.createWriteStream)(e.destination);
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
function fs(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function D0(e) {
  const t = yl(e);
  return S0.some((r) => t.includes(r)) || Zg.some((r) => t.endsWith(r));
}
function $0(e) {
  return `${(0, I0.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
}
function Lr(e, t) {
  return JSON.stringify(e, (r, n) => D0(r) || t != null && t.has(r) ? typeof n == "string" ? $0(n) : "<stripped sensitive data>" : n, 2);
}
var qs = {};
Object.defineProperty(qs, "__esModule", { value: !0 });
qs.MemoLazy = void 0;
class oy {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && O0(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
qs.MemoLazy = oy;
function O0(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((o) => O0(e[o], t[o]));
  }
  return e === t;
}
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.githubUrl = ay;
Xn.githubTagPrefix = ly;
Xn.getS3LikeProviderBaseUrl = cy;
function ay(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function ly(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function cy(e) {
  const t = e.provider;
  if (t === "s3")
    return uy(e);
  if (t === "spaces")
    return fy(e);
  throw new Error(`Not supported provider: ${t}`);
}
function uy(e) {
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
  return L0(t, e.path);
}
function L0(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function fy(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return L0(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var vl = {};
Object.defineProperty(vl, "__esModule", { value: !0 });
vl.retry = N0;
const dy = Yt;
async function N0(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: o = 0, shouldRetry: a, cancellationToken: c = new dy.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((r = a == null ? void 0 : a(p)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * o)), await N0(e, { ...t, retries: n - 1, attempt: o + 1 });
    throw p;
  }
}
var bl = {};
Object.defineProperty(bl, "__esModule", { value: !0 });
bl.parseDn = hy;
function hy(e) {
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
        const c = parseInt(e.slice(o, o + 2), 16);
        Number.isNaN(c) ? n += e[o] : (o++, n += String.fromCharCode(c));
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
        let c = o;
        for (; e[c] === " "; )
          c++;
        i = c;
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
var Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.nil = Gr.UUID = void 0;
const F0 = Vn, U0 = zr, py = "options.name must be either a string or a Buffer", cu = (0, F0.randomBytes)(16);
cu[0] = cu[0] | 1;
const as = {}, Y = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  as[t] = e, Y[e] = t;
}
class _r {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = _r.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return _y(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = my(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (as[t[14] + t[15]] & 240) >> 4,
        variant: uu((as[t[19] + t[20]] & 224) >> 5),
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
        variant: uu((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, U0.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = as[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Gr.UUID = _r;
_r.OID = _r.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function uu(e) {
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
var Rn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Rn || (Rn = {}));
function _y(e, t, r, n, i = Rn.ASCII) {
  const s = (0, F0.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, U0.newError)(py, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const a = s.digest();
  let c;
  switch (i) {
    case Rn.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = a;
      break;
    case Rn.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = new _r(a);
      break;
    default:
      c = Y[a[0]] + Y[a[1]] + Y[a[2]] + Y[a[3]] + "-" + Y[a[4]] + Y[a[5]] + "-" + Y[a[6] & 15 | r] + Y[a[7]] + "-" + Y[a[8] & 63 | 128] + Y[a[9]] + "-" + Y[a[10]] + Y[a[11]] + Y[a[12]] + Y[a[13]] + Y[a[14]] + Y[a[15]];
      break;
  }
  return c;
}
function my(e) {
  return Y[e[0]] + Y[e[1]] + Y[e[2]] + Y[e[3]] + "-" + Y[e[4]] + Y[e[5]] + "-" + Y[e[6]] + Y[e[7]] + "-" + Y[e[8]] + Y[e[9]] + "-" + Y[e[10]] + Y[e[11]] + Y[e[12]] + Y[e[13]] + Y[e[14]] + Y[e[15]];
}
Gr.nil = new _r("00000000-0000-0000-0000-000000000000");
var Kn = {}, B0 = {};
(function(e) {
  (function(t) {
    t.parser = function(h, f) {
      return new n(h, f);
    }, t.SAXParser = n, t.SAXStream = u, t.createStream = p, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
      s(R), R.q = R.c = "", R.bufferCheckPosition = t.MAX_BUFFER_LENGTH, R.encoding = null, R.opt = f || {}, R.opt.lowercase = R.opt.lowercase || R.opt.lowercasetags, R.looseCase = R.opt.lowercase ? "toLowerCase" : "toUpperCase", R.opt.maxEntityCount = R.opt.maxEntityCount || 512, R.opt.maxEntityDepth = R.opt.maxEntityDepth || 4, R.entityCount = R.entityDepth = 0, R.tags = [], R.closed = R.closedRoot = R.sawRoot = !1, R.tag = R.error = null, R.strict = !!h, R.noscript = !!(h || R.opt.noscript), R.state = E.BEGIN, R.strictEntities = R.opt.strictEntities, R.ENTITIES = R.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), R.attribList = [], R.opt.xmlns && (R.ns = Object.create(y)), R.opt.unquotedAttributeValues === void 0 && (R.opt.unquotedAttributeValues = !h), R.trackPosition = R.opt.position !== !1, R.trackPosition && (R.position = R.line = R.column = 0), J(R, "onready");
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
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), R = 0, w = 0, X = r.length; w < X; w++) {
        var ce = h[r[w]].length;
        if (ce > f)
          switch (r[w]) {
            case "textNode":
              L(h);
              break;
            case "cdata":
              A(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              A(h, "onscript", h.script), h.script = "";
              break;
            default:
              k(h, "Max buffer length exceeded: " + r[w]);
          }
        R = Math.max(R, ce);
      }
      var he = t.MAX_BUFFER_LENGTH - R;
      h.bufferCheckPosition = he + h.position;
    }
    function s(h) {
      for (var f = 0, R = r.length; f < R; f++)
        h[r[f]] = "";
    }
    function o(h) {
      L(h), h.cdata !== "" && (A(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (A(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        z(this);
      },
      write: on,
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
    var c = t.EVENTS.filter(function(h) {
      return h !== "error" && h !== "end";
    });
    function p(h, f) {
      return new u(h, f);
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
    function u(h, f) {
      if (!(this instanceof u))
        return new u(h, f);
      a.apply(this), this._parser = new n(h, f), this.writable = !0, this.readable = !0;
      var R = this;
      this._parser.onend = function() {
        R.emit("end");
      }, this._parser.onerror = function(w) {
        R.emit("error", w), R._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(w) {
        Object.defineProperty(R, "on" + w, {
          get: function() {
            return R._parser["on" + w];
          },
          set: function(X) {
            if (!X)
              return R.removeAllListeners(w), R._parser["on" + w] = X, X;
            R.on(w, X);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    u.prototype = Object.create(a.prototype, {
      constructor: {
        value: u
      }
    }), u.prototype._decodeBuffer = function(h, f) {
      if (this._decoderBuffer && (h = Buffer.concat([this._decoderBuffer, h]), this._decoderBuffer = null), !this._decoder) {
        var R = l(h, f);
        if (!R)
          return this._decoderBuffer = h, "";
        this._parser.encoding = R, this._decoder = new TextDecoder(R);
      }
      return this._decoder.decode(h, { stream: !f });
    }, u.prototype.write = function(h) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h))
        h = this._decodeBuffer(h, !1);
      else if (this._decoderBuffer) {
        var f = this._decodeBuffer(Buffer.alloc(0), !0);
        f && (this._parser.write(f), this.emit("data", f));
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, u.prototype.end = function(h) {
      if (h && h.length && this.write(h), this._decoderBuffer) {
        var f = this._decodeBuffer(Buffer.alloc(0), !0);
        f && (this._parser.write(f), this.emit("data", f));
      } else if (this._decoder) {
        var R = this._decoder.decode();
        R && (this._parser.write(R), this.emit("data", R));
      }
      return this._parser.end(), !0;
    }, u.prototype.on = function(h, f) {
      var R = this;
      return !R._parser["on" + h] && c.indexOf(h) !== -1 && (R._parser["on" + h] = function() {
        var w = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        w.splice(0, 0, h), R.emit.apply(R, w);
      }), a.prototype.on.call(R, h, f);
    };
    var d = /^\[CDATA\[$/i, _ = /^DOCTYPE$/i, x = "http://www.w3.org/XML/1998/namespace", g = "http://www.w3.org/2000/xmlns/", y = { xml: x, xmlns: g }, b = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, $ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, B = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function j(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function Q(h) {
      return h === '"' || h === "'";
    }
    function K(h) {
      return h === ">" || j(h);
    }
    function se(h, f) {
      return h.test(f);
    }
    function M(h, f) {
      return !se(h, f);
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
    function J(h, f, R) {
      h[f] && h[f](R);
    }
    function le(h) {
      var f = h && h.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return f ? f[2] : null;
    }
    function P(h) {
      return h ? h.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function S(h, f) {
      const R = P(h), w = P(f);
      return !R || !w ? !0 : w === "utf16" ? R === "utf16le" || R === "utf16be" : R === w;
    }
    function O(h, f) {
      if (!(!h.strict || !h.encoding || !f || f.name !== "xml")) {
        var R = le(f.body);
        R && !S(h.encoding, R) && N(
          h,
          "XML declaration encoding " + R + " does not match detected stream encoding " + h.encoding.toUpperCase()
        );
      }
    }
    function A(h, f, R) {
      h.textNode && L(h), J(h, f, R);
    }
    function L(h) {
      h.textNode = D(h.opt, h.textNode), h.textNode && J(h, "ontext", h.textNode), h.textNode = "";
    }
    function D(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function k(h, f) {
      return L(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, J(h, "onerror", f), h;
    }
    function z(h) {
      return h.sawRoot && !h.closedRoot && N(h, "Unclosed root tag"), h.state !== E.BEGIN && h.state !== E.BEGIN_WHITESPACE && h.state !== E.TEXT && k(h, "Unexpected end"), L(h), h.c = "", h.closed = !0, J(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function N(h, f) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && k(h, f);
    }
    function ee(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var f = h.tags[h.tags.length - 1] || h, R = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (R.ns = f.ns), h.attribList.length = 0, A(h, "onopentagstart", R);
    }
    function ge(h, f) {
      var R = h.indexOf(":"), w = R < 0 ? ["", h] : h.split(":"), X = w[0], ce = w[1];
      return f && h === "xmlns" && (X = "xmlns", ce = ""), { prefix: X, local: ce };
    }
    function q(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = ge(h.attribName, !0), R = f.prefix, w = f.local;
        if (R === "xmlns")
          if (w === "xml" && h.attribValue !== x)
            N(
              h,
              "xml: prefix must be bound to " + x + `
Actual: ` + h.attribValue
            );
          else if (w === "xmlns" && h.attribValue !== g)
            N(
              h,
              "xmlns: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else {
            var X = h.tag, ce = h.tags[h.tags.length - 1] || h;
            X.ns === ce.ns && (X.ns = Object.create(ce.ns)), X.ns[w] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, A(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function Pe(h, f) {
      if (h.opt.xmlns) {
        var R = h.tag, w = ge(h.tagName);
        R.prefix = w.prefix, R.local = w.local, R.uri = R.ns[w.prefix] || "", R.prefix && !R.uri && (N(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), R.uri = w.prefix);
        var X = h.tags[h.tags.length - 1] || h;
        R.ns && X.ns !== R.ns && Object.keys(R.ns).forEach(function(Rr) {
          A(h, "onopennamespace", {
            prefix: Rr,
            uri: R.ns[Rr]
          });
        });
        for (var ce = 0, he = h.attribList.length; ce < he; ce++) {
          var De = h.attribList[ce], $e = De[0], et = De[1], ye = ge($e, !0), tt = ye.prefix, Po = ye.local, Ci = tt === "" ? "" : R.ns[tt] || "", Lt = {
            name: $e,
            value: et,
            prefix: tt,
            local: Po,
            uri: Ci
          };
          tt && tt !== "xmlns" && !Ci && (N(
            h,
            "Unbound namespace prefix: " + JSON.stringify(tt)
          ), Lt.uri = tt), h.tag.attributes[$e] = Lt, A(h, "onattribute", Lt);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), A(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = E.SCRIPT : h.state = E.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function nn(h) {
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
      for (var w = R; f--; ) {
        var X = h.tags[f];
        if (X.name !== w)
          N(h, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        N(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = E.TEXT;
        return;
      }
      h.tagName = R;
      for (var ce = h.tags.length; ce-- > f; ) {
        var he = h.tag = h.tags.pop();
        h.tagName = h.tag.name, A(h, "onclosetag", h.tagName);
        var De = {};
        for (var $e in he.ns)
          De[$e] = he.ns[$e];
        var et = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && he.ns !== et.ns && Object.keys(he.ns).forEach(function(ye) {
          var tt = he.ns[ye];
          A(h, "onclosenamespace", { prefix: ye, uri: tt });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = E.TEXT;
    }
    function Ze(h) {
      var f = h.entity, R = f.toLowerCase(), w, X = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[R] ? h.ENTITIES[R] : (f = R, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), w = parseInt(f, 16), X = w.toString(16)) : (f = f.slice(1), w = parseInt(f, 10), X = w.toString(10))), f = f.replace(/^0+/, ""), isNaN(w) || X.toLowerCase() !== f || w < 0 || w > 1114111 || !Ri(w) ? (N(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(w));
    }
    function Ri(h) {
      return h === 9 || h === 10 || h === 13 || h >= 32 && h <= 55295 || h >= 57344 && h <= 65533 || h >= 65536 && h <= 1114111;
    }
    function sn(h, f) {
      f === "<" ? (h.state = E.OPEN_WAKA, h.startTagPosition = h.position) : j(f) || (N(h, "Non-whitespace before first tag."), h.textNode = f, h.state = E.TEXT);
    }
    function br(h, f) {
      var R = "";
      return f < h.length && (R = h.charAt(f)), R;
    }
    function on(h) {
      var f = this;
      if (this.error)
        throw this.error;
      if (f.closed)
        return k(
          f,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return z(f);
      typeof h == "object" && (h = h.toString());
      for (var R = 0, w = ""; w = br(h, R++), f.c = w, !!w; )
        switch (f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case E.BEGIN:
            if (f.state = E.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            sn(f, w);
            continue;
          case E.BEGIN_WHITESPACE:
            sn(f, w);
            continue;
          case E.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var ce = R - 1; w && w !== "<" && w !== "&"; )
                w = br(h, R++), w && f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(ce, R - 1);
            }
            w === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : (!j(w) && (!f.sawRoot || f.closedRoot) && N(f, "Text data outside of root node."), w === "&" ? f.state = E.TEXT_ENTITY : f.textNode += w);
            continue;
          case E.SCRIPT:
            w === "<" ? f.state = E.SCRIPT_ENDING : f.script += w;
            continue;
          case E.SCRIPT_ENDING:
            w === "/" ? f.state = E.CLOSE_TAG : (f.script += "<" + w, f.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (w === "!")
              f.state = E.SGML_DECL, f.sgmlDecl = "";
            else if (!j(w)) if (se(b, w))
              f.state = E.OPEN_TAG, f.tagName = w;
            else if (w === "/")
              f.state = E.CLOSE_TAG, f.tagName = "";
            else if (w === "?")
              f.state = E.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (N(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var X = f.position - f.startTagPosition;
                w = new Array(X).join(" ") + w;
              }
              f.textNode += "<" + w, f.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (f.sgmlDecl + w === "--") {
              f.state = E.COMMENT, f.comment = "", f.sgmlDecl = "";
              continue;
            }
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = E.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + w, f.sgmlDecl = "") : d.test(f.sgmlDecl + w) ? (A(f, "onopencdata"), f.state = E.CDATA, f.sgmlDecl = "", f.cdata = "") : _.test(f.sgmlDecl + w) ? (f.state = E.DOCTYPE, (f.doctype || f.sawRoot) && N(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : w === ">" ? (A(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = E.TEXT) : (Q(w) && (f.state = E.SGML_DECL_QUOTED), f.sgmlDecl += w);
            continue;
          case E.SGML_DECL_QUOTED:
            w === f.q && (f.state = E.SGML_DECL, f.q = ""), f.sgmlDecl += w;
            continue;
          case E.DOCTYPE:
            w === ">" ? (f.state = E.TEXT, A(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += w, w === "[" ? f.state = E.DOCTYPE_DTD : Q(w) && (f.state = E.DOCTYPE_QUOTED, f.q = w));
            continue;
          case E.DOCTYPE_QUOTED:
            f.doctype += w, w === f.q && (f.q = "", f.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            w === "]" ? (f.doctype += w, f.state = E.DOCTYPE) : w === "<" ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : Q(w) ? (f.doctype += w, f.state = E.DOCTYPE_DTD_QUOTED, f.q = w) : f.doctype += w;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            f.doctype += w, w === f.q && (f.state = E.DOCTYPE_DTD, f.q = "");
            continue;
          case E.COMMENT:
            w === "-" ? f.state = E.COMMENT_ENDING : f.comment += w;
            continue;
          case E.COMMENT_ENDING:
            w === "-" ? (f.state = E.COMMENT_ENDED, f.comment = D(f.opt, f.comment), f.comment && A(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + w, f.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            w !== ">" ? (N(f, "Malformed comment"), f.comment += "--" + w, f.state = E.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = E.DOCTYPE_DTD : f.state = E.TEXT;
            continue;
          case E.CDATA:
            for (var ce = R - 1; w && w !== "]"; )
              w = br(h, R++), w && f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += h.substring(ce, R - 1), w === "]" && (f.state = E.CDATA_ENDING);
            continue;
          case E.CDATA_ENDING:
            w === "]" ? f.state = E.CDATA_ENDING_2 : (f.cdata += "]" + w, f.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            w === ">" ? (f.cdata && A(f, "oncdata", f.cdata), A(f, "onclosecdata"), f.cdata = "", f.state = E.TEXT) : w === "]" ? f.cdata += "]" : (f.cdata += "]]" + w, f.state = E.CDATA);
            continue;
          case E.PROC_INST:
            w === "?" ? f.state = E.PROC_INST_ENDING : j(w) ? f.state = E.PROC_INST_BODY : f.procInstName += w;
            continue;
          case E.PROC_INST_BODY:
            if (!f.procInstBody && j(w))
              continue;
            w === "?" ? f.state = E.PROC_INST_ENDING : f.procInstBody += w;
            continue;
          case E.PROC_INST_ENDING:
            if (w === ">") {
              const et = {
                name: f.procInstName,
                body: f.procInstBody
              };
              O(f, et), A(f, "onprocessinginstruction", et), f.procInstName = f.procInstBody = "", f.state = E.TEXT;
            } else
              f.procInstBody += "?" + w, f.state = E.PROC_INST_BODY;
            continue;
          case E.OPEN_TAG:
            se(C, w) ? f.tagName += w : (ee(f), w === ">" ? Pe(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : (j(w) || N(f, "Invalid character in tag name"), f.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            w === ">" ? (Pe(f, !0), nn(f)) : (N(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (j(w))
              continue;
            w === ">" ? Pe(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : se(b, w) ? (f.attribName = w, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            w === "=" ? f.state = E.ATTRIB_VALUE : w === ">" ? (N(f, "Attribute without value"), f.attribValue = f.attribName, q(f), Pe(f)) : j(w) ? f.state = E.ATTRIB_NAME_SAW_WHITE : se(C, w) ? f.attribName += w : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              f.state = E.ATTRIB_VALUE;
            else {
              if (j(w))
                continue;
              N(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", A(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", w === ">" ? Pe(f) : se(b, w) ? (f.attribName = w, f.state = E.ATTRIB_NAME) : (N(f, "Invalid attribute name"), f.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (j(w))
              continue;
            Q(w) ? (f.q = w, f.state = E.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || k(f, "Unquoted attribute value"), f.state = E.ATTRIB_VALUE_UNQUOTED, f.attribValue = w);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (w !== f.q) {
              w === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_Q : f.attribValue += w;
              continue;
            }
            q(f), f.q = "", f.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            j(w) ? f.state = E.ATTRIB : w === ">" ? Pe(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : se(b, w) ? (N(f, "No whitespace between attributes"), f.attribName = w, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!K(w)) {
              w === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_U : f.attribValue += w;
              continue;
            }
            q(f), w === ">" ? Pe(f) : f.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (f.tagName)
              w === ">" ? nn(f) : se(C, w) ? f.tagName += w : f.script ? (f.script += "</" + f.tagName + w, f.tagName = "", f.state = E.SCRIPT) : (j(w) || N(f, "Invalid tagname in closing tag"), f.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (j(w))
                continue;
              M(b, w) ? f.script ? (f.script += "</" + w, f.state = E.SCRIPT) : N(f, "Invalid tagname in closing tag.") : f.tagName = w;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (j(w))
              continue;
            w === ">" ? nn(f) : N(f, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var he, De;
            switch (f.state) {
              case E.TEXT_ENTITY:
                he = E.TEXT, De = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                he = E.ATTRIB_VALUE_QUOTED, De = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                he = E.ATTRIB_VALUE_UNQUOTED, De = "attribValue";
                break;
            }
            if (w === ";") {
              var $e = Ze(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes($e) ? ((f.entityCount += 1) > f.opt.maxEntityCount && k(
                f,
                "Parsed entity count exceeds max entity count"
              ), (f.entityDepth += 1) > f.opt.maxEntityDepth && k(
                f,
                "Parsed entity depth exceeds max entity depth"
              ), f.entity = "", f.state = he, f.write($e), f.entityDepth -= 1) : (f[De] += $e, f.entity = "", f.state = he);
            } else se(f.entity.length ? B : $, w) ? f.entity += w : (N(f, "Invalid character in entity name"), f[De] += "&" + f.entity + w, f.entity = "", f.state = he);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, R = function() {
        var w = 16384, X = [], ce, he, De = -1, $e = arguments.length;
        if (!$e)
          return "";
        for (var et = ""; ++De < $e; ) {
          var ye = Number(arguments[De]);
          if (!isFinite(ye) || // `NaN`, `+Infinity`, or `-Infinity`
          ye < 0 || // not a valid Unicode code point
          ye > 1114111 || // not a valid Unicode code point
          f(ye) !== ye)
            throw RangeError("Invalid code point: " + ye);
          ye <= 65535 ? X.push(ye) : (ye -= 65536, ce = (ye >> 10) + 55296, he = ye % 1024 + 56320, X.push(ce, he)), (De + 1 === $e || X.length > w) && (et += h.apply(null, X), X.length = 0);
        }
        return et;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: R,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = R;
    }();
  })(e);
})(B0);
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.XElement = void 0;
Kn.parseXml = Ey;
const xy = B0, Bi = zr;
class M0 {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Bi.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!yy(t))
      throw (0, Bi.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Bi.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Bi.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (fu(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => fu(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Kn.XElement = M0;
const gy = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function yy(e) {
  return gy.test(e);
}
function fu(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Ey(e) {
  let t = null;
  const r = xy.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new M0(i.name);
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
var Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.mapToObject = k0;
Er.isValidKey = js;
Er.asArray = wy;
Er.deepAssign = by;
Er.objectToArgs = Iy;
function k0(e) {
  const t = {};
  for (const [r, n] of e)
    js(r) && (n instanceof Map ? t[r] = k0(n) : t[r] = n);
  return t;
}
function js(e) {
  return ["__proto__", "prototype", "constructor"].includes(e) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof e) || e === null;
}
function wy(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function du(e) {
  if (Array.isArray(e))
    return !1;
  const t = typeof e;
  return t === "object" || t === "function";
}
function vy(e, t, r) {
  const n = t[r];
  if (n === void 0)
    return;
  const i = e[r];
  i == null || n == null || !du(i) || !du(n) ? Array.isArray(i) && Array.isArray(n) ? e[r] = Array.from(new Set(i.concat(n))) : e[r] = n : e[r] = q0(i, n);
}
function q0(e, t) {
  if (e !== t)
    for (const r of Object.getOwnPropertyNames(t))
      js(r) && vy(e, t, r);
  return e;
}
function by(e, ...t) {
  for (const r of t)
    r != null && q0(e, r);
  return e;
}
const Ry = /^[a-zA-Z][a-zA-Z0-9-]*$/, Cy = /[\0\r\n]/;
function Iy(e) {
  const t = Object.entries(e).reduce((r, [n, i]) => {
    if (!js(n) || i == null)
      return r;
    if (!Ry.test(n))
      throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(n)}`);
    if (Cy.test(i))
      throw new Error(`objectToArgs: value for --${n} contains a null byte or newline`);
    return r.concat([`--${n}`, i]);
  }, []);
  return Object.freeze(t);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
  var t = Yt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = zr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Ee;
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
  var i = qs;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = Yn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var o = Xn;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return o.githubTagPrefix;
  } });
  var a = vl;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = bl;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var p = Gr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var l = Kn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } });
  var u = Er;
  Object.defineProperty(e, "isValidKey", { enumerable: !0, get: function() {
    return u.isValidKey;
  } }), Object.defineProperty(e, "mapToObject", { enumerable: !0, get: function() {
    return u.mapToObject;
  } }), Object.defineProperty(e, "asArray", { enumerable: !0, get: function() {
    return u.asArray;
  } }), Object.defineProperty(e, "deepAssign", { enumerable: !0, get: function() {
    return u.deepAssign;
  } }), Object.defineProperty(e, "objectToArgs", { enumerable: !0, get: function() {
    return u.objectToArgs;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
})(we);
var Te = {}, Rl = {}, at = {};
function j0(e) {
  return typeof e > "u" || e === null;
}
function Ay(e) {
  return typeof e == "object" && e !== null;
}
function Sy(e) {
  return Array.isArray(e) ? e : j0(e) ? [] : [e];
}
function Ty(e, t) {
  if (t) {
    const r = Object.keys(t);
    for (let n = 0, i = r.length; n < i; n += 1) {
      const s = r[n];
      e[s] = t[s];
    }
  }
  return e;
}
function Py(e, t) {
  let r = "";
  for (let n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Dy(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
at.isNothing = j0;
at.isObject = Ay;
at.toArray = Sy;
at.repeat = Py;
at.isNegativeZero = Dy;
at.extend = Ty;
function H0(e, t) {
  let r = "";
  const n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function On(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = H0(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
On.prototype = Object.create(Error.prototype);
On.prototype.constructor = On;
On.prototype.toString = function(t) {
  return this.name + ": " + H0(this, t);
};
var Jn = On;
const gn = at;
function Wo(e, t, r, n, i) {
  let s = "", o = "";
  const a = Math.floor(i / 2) - 1;
  return n - t > a && (s = " ... ", t = n - a + s.length), r - n > a && (o = " ...", r = n + a - o.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + s.length
    // relative position
  };
}
function Vo(e, t) {
  return gn.repeat(" ", t - e.length) + e;
}
function $y(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  const r = /\r?\n|\r|\0/g, n = [0], i = [];
  let s, o = -1;
  for (; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  let a = "";
  const c = Math.min(e.line + t.linesAfter, i.length).toString().length, p = t.maxLength - (t.indent + c + 3);
  for (let u = 1; u <= t.linesBefore && !(o - u < 0); u++) {
    const d = Wo(
      e.buffer,
      n[o - u],
      i[o - u],
      e.position - (n[o] - n[o - u]),
      p
    );
    a = gn.repeat(" ", t.indent) + Vo((e.line - u + 1).toString(), c) + " | " + d.str + `
` + a;
  }
  const l = Wo(e.buffer, n[o], i[o], e.position, p);
  a += gn.repeat(" ", t.indent) + Vo((e.line + 1).toString(), c) + " | " + l.str + `
`, a += gn.repeat("-", t.indent + c + 3 + l.pos) + `^
`;
  for (let u = 1; u <= t.linesAfter && !(o + u >= i.length); u++) {
    const d = Wo(
      e.buffer,
      n[o + u],
      i[o + u],
      e.position - (n[o] - n[o + u]),
      p
    );
    a += gn.repeat(" ", t.indent) + Vo((e.line + u + 1).toString(), c) + " | " + d.str + `
`;
  }
  return a.replace(/\n$/, "");
}
var Oy = $y;
const hu = Jn, Ly = [
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
], Ny = [
  "scalar",
  "sequence",
  "mapping"
];
function Fy(e) {
  const t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Uy(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Ly.indexOf(r) === -1)
      throw new hu('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Fy(t.styleAliases || null), Ny.indexOf(this.kind) === -1)
    throw new hu('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var je = Uy;
const fn = Jn, zo = je;
function pu(e, t) {
  const r = [];
  return e[t].forEach(function(n) {
    let i = r.length;
    r.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function By() {
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
function za(e) {
  return this.extend(e);
}
za.prototype.extend = function(t) {
  let r = [], n = [];
  if (t instanceof zo)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new fn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof zo))
      throw new fn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new fn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new fn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof zo))
      throw new fn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  const i = Object.create(za.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = pu(i, "implicit"), i.compiledExplicit = pu(i, "explicit"), i.compiledTypeMap = By(i.compiledImplicit, i.compiledExplicit), i;
};
var G0 = za;
const My = je;
var W0 = new My("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
});
const ky = je;
var V0 = new ky("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
});
const qy = je;
var z0 = new qy("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
});
const jy = G0;
var Y0 = new jy({
  explicit: [
    W0,
    V0,
    z0
  ]
});
const Hy = je;
function Gy(e) {
  if (e === null) return !0;
  const t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Wy() {
  return null;
}
function Vy(e) {
  return e === null;
}
var X0 = new Hy("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Gy,
  construct: Wy,
  predicate: Vy,
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
const zy = je;
function Yy(e) {
  if (e === null) return !1;
  const t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Xy(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Ky(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var K0 = new zy("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Yy,
  construct: Xy,
  predicate: Ky,
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
const Jy = at, Qy = je;
function Zy(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function e1(e) {
  return e >= 48 && e <= 55;
}
function t1(e) {
  return e >= 48 && e <= 57;
}
function r1(e) {
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
      return n && isFinite(yn(e));
    }
    if (i === "x") {
      for (r++; r < t; r++) {
        if (!Zy(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(yn(e));
    }
    if (i === "o") {
      for (r++; r < t; r++) {
        if (!e1(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(yn(e));
    }
  }
  for (; r < t; r++) {
    if (!t1(e.charCodeAt(r)))
      return !1;
    n = !0;
  }
  return n ? isFinite(yn(e)) : !1;
}
function yn(e) {
  let t = e, r = 1, n = t[0];
  if ((n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function n1(e) {
  return yn(e);
}
function i1(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Jy.isNegativeZero(e);
}
var J0 = new Qy("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: r1,
  construct: n1,
  predicate: i1,
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
const Q0 = at, s1 = je, o1 = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
), a1 = new RegExp(
  "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function l1(e) {
  return e === null || !o1.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : a1.test(e);
}
function c1(e) {
  let t = e.toLowerCase();
  const r = t[0] === "-" ? -1 : 1;
  return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
const u1 = /^[-+]?[0-9]+e/;
function f1(e, t) {
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
  else if (Q0.isNegativeZero(e))
    return "-0.0";
  const r = e.toString(10);
  return u1.test(r) ? r.replace("e", ".e") : r;
}
function d1(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Q0.isNegativeZero(e));
}
var Z0 = new s1("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: l1,
  construct: c1,
  predicate: d1,
  represent: f1,
  defaultStyle: "lowercase"
}), eh = Y0.extend({
  implicit: [
    X0,
    K0,
    J0,
    Z0
  ]
}), th = eh;
const h1 = je, rh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), nh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function p1(e) {
  return e === null ? !1 : rh.exec(e) !== null || nh.exec(e) !== null;
}
function _1(e) {
  let t = 0, r = null, n = rh.exec(e);
  if (n === null && (n = nh.exec(e)), n === null) throw new Error("Date resolve error");
  const i = +n[1], s = +n[2] - 1, o = +n[3];
  if (!n[4])
    return new Date(Date.UTC(i, s, o));
  const a = +n[4], c = +n[5], p = +n[6];
  if (n[7]) {
    for (t = n[7].slice(0, 3); t.length < 3; )
      t += "0";
    t = +t;
  }
  if (n[9]) {
    const u = +n[10], d = +(n[11] || 0);
    r = (u * 60 + d) * 6e4, n[9] === "-" && (r = -r);
  }
  const l = new Date(Date.UTC(i, s, o, a, c, p, t));
  return r && l.setTime(l.getTime() - r), l;
}
function m1(e) {
  return e.toISOString();
}
var ih = new h1("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: p1,
  construct: _1,
  instanceOf: Date,
  represent: m1
});
const x1 = je;
function g1(e) {
  return e === "<<" || e === null;
}
var sh = new x1("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: g1
});
const y1 = je, Cl = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function E1(e) {
  if (e === null) return !1;
  let t = 0;
  const r = e.length, n = Cl;
  for (let i = 0; i < r; i++) {
    const s = n.indexOf(e.charAt(i));
    if (!(s > 64)) {
      if (s < 0) return !1;
      t += 6;
    }
  }
  return t % 8 === 0;
}
function w1(e) {
  const t = e.replace(/[\r\n=]/g, ""), r = t.length, n = Cl;
  let i = 0;
  const s = [];
  for (let a = 0; a < r; a++)
    a % 4 === 0 && a && (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)), i = i << 6 | n.indexOf(t.charAt(a));
  const o = r % 4 * 6;
  return o === 0 ? (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)) : o === 18 ? (s.push(i >> 10 & 255), s.push(i >> 2 & 255)) : o === 12 && s.push(i >> 4 & 255), new Uint8Array(s);
}
function v1(e) {
  let t = "", r = 0;
  const n = e.length, i = Cl;
  for (let o = 0; o < n; o++)
    o % 3 === 0 && o && (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]), r = (r << 8) + e[o];
  const s = n % 3;
  return s === 0 ? (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]) : s === 2 ? (t += i[r >> 10 & 63], t += i[r >> 4 & 63], t += i[r << 2 & 63], t += i[64]) : s === 1 && (t += i[r >> 2 & 63], t += i[r << 4 & 63], t += i[64], t += i[64]), t;
}
function b1(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var oh = new y1("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: E1,
  construct: w1,
  predicate: b1,
  represent: v1
});
const R1 = je, _u = Object.prototype.hasOwnProperty, C1 = Object.prototype.toString;
function I1(e) {
  if (e === null) return !0;
  const t = {}, r = e;
  for (let n = 0, i = r.length; n < i; n += 1) {
    const s = r[n];
    let o = !1;
    if (C1.call(s) !== "[object Object]") return !1;
    let a;
    for (a in s)
      if (_u.call(s, a))
        if (!o) o = !0;
        else return !1;
    if (!o || _u.call(t, a)) return !1;
    Object.defineProperty(t, a, { value: !0 });
  }
  return !0;
}
function A1(e) {
  return e !== null ? e : [];
}
var ah = new R1("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: I1,
  construct: A1
});
const S1 = je, T1 = Object.prototype.toString;
function P1(e) {
  if (e === null) return !0;
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n];
    if (T1.call(s) !== "[object Object]") return !1;
    const o = Object.keys(s);
    if (o.length !== 1) return !1;
    r[n] = [o[0], s[o[0]]];
  }
  return !0;
}
function D1(e) {
  if (e === null) return [];
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n], o = Object.keys(s);
    r[n] = [o[0], s[o[0]]];
  }
  return r;
}
var lh = new S1("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: P1,
  construct: D1
});
const $1 = je, O1 = Object.prototype.hasOwnProperty;
function L1(e) {
  if (e === null) return !0;
  const t = e;
  for (const r in t)
    if (O1.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function N1(e) {
  return e !== null ? e : {};
}
var ch = new $1("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: L1,
  construct: N1
}), Il = th.extend({
  implicit: [
    ih,
    sh
  ],
  explicit: [
    oh,
    ah,
    lh,
    ch
  ]
});
const ur = at, uh = Jn, F1 = Oy, U1 = Il, ot = Object.prototype.hasOwnProperty, ds = 1, fh = 2, dh = 3, hs = 4, Yo = 1, B1 = 2, mu = 3, M1 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, k1 = /[\x85\u2028\u2029]/, q1 = /[,\[\]{}]/, hh = /^(?:!|!!|![0-9A-Za-z-]+!)$/, ph = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
function xu(e) {
  return Object.prototype.toString.call(e);
}
function _t(e) {
  return e === 10 || e === 13;
}
function Tt(e) {
  return e === 9 || e === 32;
}
function Ve(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Nr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function j1(e) {
  if (e >= 48 && e <= 57)
    return e - 48;
  const t = e | 32;
  return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function H1(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function G1(e) {
  return e >= 48 && e <= 57 ? e - 48 : -1;
}
function gu(e) {
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
function W1(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function _h(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
const mh = new Array(256), xh = new Array(256);
for (let e = 0; e < 256; e++)
  mh[e] = gu(e) ? 1 : 0, xh[e] = gu(e);
function V1(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || U1, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
}
function gh(e, t) {
  const r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = F1(r), new uh(t, r);
}
function U(e, t) {
  throw gh(e, t);
}
function ps(e, t) {
  e.onWarning && e.onWarning.call(null, gh(e, t));
}
function fr(e, t, r) {
  const n = e.anchorMapTransactions;
  if (n.length !== 0) {
    const i = n[n.length - 1];
    ot.call(i, t) || (i[t] = {
      existed: ot.call(e.anchorMap, t),
      value: e.anchorMap[t]
    });
  }
  e.anchorMap[t] = r;
}
function z1(e) {
  e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
}
function Y1(e) {
  const t = e.anchorMapTransactions.pop(), r = e.anchorMapTransactions;
  if (r.length === 0) return;
  const n = r[r.length - 1], i = Object.keys(t);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    ot.call(n, a) || (n[a] = t[a]);
  }
}
function X1(e) {
  const t = e.anchorMapTransactions.pop(), r = Object.keys(t);
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = t[r[n]];
    i.existed ? e.anchorMap[r[n]] = i.value : delete e.anchorMap[r[n]];
  }
}
function yh(e) {
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
function yu(e, t) {
  e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
}
const Eu = {
  YAML: function(t, r, n) {
    t.version !== null && U(t, "duplication of %YAML directive"), n.length !== 1 && U(t, "YAML directive accepts exactly one argument");
    const i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
    i === null && U(t, "ill-formed argument of the YAML directive");
    const s = parseInt(i[1], 10), o = parseInt(i[2], 10);
    s !== 1 && U(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && ps(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    let i;
    n.length !== 2 && U(t, "TAG directive accepts exactly two arguments");
    const s = n[0];
    i = n[1], hh.test(s) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), ot.call(t.tagMap, s) && U(t, 'there is a previously declared suffix for "' + s + '" tag handle'), ph.test(i) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      i = decodeURIComponent(i);
    } catch {
      U(t, "tag prefix is malformed: " + i);
    }
    t.tagMap[s] = i;
  }
};
function Wt(e, t, r, n) {
  if (t < r) {
    const i = e.input.slice(t, r);
    if (n)
      for (let s = 0, o = i.length; s < o; s += 1) {
        const a = i.charCodeAt(s);
        a === 9 || a >= 32 && a <= 1114111 || U(e, "expected valid JSON character");
      }
    else M1.test(i) && U(e, "the stream contains non-printable characters");
    e.result += i;
  }
}
function wu(e) {
  e.totalMergeKeys++, e.maxTotalMergeKeys !== -1 && e.totalMergeKeys > e.maxTotalMergeKeys && U(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")");
}
function vu(e, t, r, n) {
  ur.isObject(r) || U(e, "cannot merge mappings; the provided source object is unacceptable"), wu(e);
  const i = Object.keys(r);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    wu(e), ot.call(t, a) || (_h(t, a, r[a]), n[a] = !0);
  }
}
function Fr(e, t, r, n, i, s, o, a, c) {
  if (Array.isArray(i)) {
    i = Array.prototype.slice.call(i);
    for (let p = 0, l = i.length; p < l; p += 1)
      Array.isArray(i[p]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && xu(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  }
  if (typeof i == "object" && xu(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s)) {
      s.length > 100 && U(e, "abnormal merge sequence size");
      for (let p = 0, l = s.length; p < l; p += 1)
        vu(e, t, s[p], r);
    } else
      vu(e, t, s, r);
  else
    !e.json && !ot.call(r, i) && ot.call(t, i) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, U(e, "duplicated mapping key")), _h(t, i, s), delete r[i];
  return t;
}
function Al(e) {
  const t = e.input.charCodeAt(e.position);
  t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : U(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function me(e, t, r) {
  let n = 0, i = e.input.charCodeAt(e.position);
  for (; i !== 0; ) {
    for (; Tt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (_t(i))
      for (Al(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && ps(e, "deficient indentation"), n;
}
function Hs(e) {
  let t = e.position, r = e.input.charCodeAt(t);
  return !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ve(r)));
}
function Sl(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += ur.repeat(`
`, t - 1));
}
function K1(e, t, r) {
  let n, i, s, o, a, c;
  const p = e.kind, l = e.result;
  let u = e.input.charCodeAt(e.position);
  if (Ve(u) || Nr(u) || u === 35 || u === 38 || u === 42 || u === 33 || u === 124 || u === 62 || u === 39 || u === 34 || u === 37 || u === 64 || u === 96)
    return !1;
  if (u === 63 || u === 45) {
    const d = e.input.charCodeAt(e.position + 1);
    if (Ve(d) || r && Nr(d))
      return !1;
  }
  for (e.kind = "scalar", e.result = "", n = i = e.position, s = !1; u !== 0; ) {
    if (u === 58) {
      const d = e.input.charCodeAt(e.position + 1);
      if (Ve(d) || r && Nr(d))
        break;
    } else if (u === 35) {
      const d = e.input.charCodeAt(e.position - 1);
      if (Ve(d))
        break;
    } else {
      if (e.position === e.lineStart && Hs(e) || r && Nr(u))
        break;
      if (_t(u))
        if (o = e.line, a = e.lineStart, c = e.lineIndent, me(e, !1, -1), e.lineIndent >= t) {
          s = !0, u = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = i, e.line = o, e.lineStart = a, e.lineIndent = c;
          break;
        }
    }
    s && (Wt(e, n, i, !1), Sl(e, e.line - o), n = i = e.position, s = !1), Tt(u) || (i = e.position + 1), u = e.input.charCodeAt(++e.position);
  }
  return Wt(e, n, i, !1), e.result ? !0 : (e.kind = p, e.result = l, !1);
}
function J1(e, t) {
  let r, n, i = e.input.charCodeAt(e.position);
  if (i !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (i = e.input.charCodeAt(e.position)) !== 0; )
    if (i === 39)
      if (Wt(e, r, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39)
        r = e.position, e.position++, n = e.position;
      else
        return !0;
    else _t(i) ? (Wt(e, r, n, !0), Sl(e, me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Hs(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, Tt(i) || (n = e.position));
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function Q1(e, t) {
  let r, n, i, s = e.input.charCodeAt(e.position);
  if (s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Wt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Wt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), _t(s))
        me(e, !1, t);
      else if (s < 256 && mh[s])
        e.result += xh[s], e.position++;
      else if ((i = H1(s)) > 0) {
        let o = i, a = 0;
        for (; o > 0; o--)
          s = e.input.charCodeAt(++e.position), (i = j1(s)) >= 0 ? a = (a << 4) + i : U(e, "expected hexadecimal character");
        e.result += W1(a), e.position++;
      } else
        U(e, "unknown escape sequence");
      r = n = e.position;
    } else _t(s) ? (Wt(e, r, n, !0), Sl(e, me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Hs(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, Tt(s) || (n = e.position));
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function Z1(e, t) {
  let r = !0, n, i, s;
  const o = e.tag;
  let a;
  const c = e.anchor;
  let p, l, u, d;
  const _ = /* @__PURE__ */ Object.create(null);
  let x, g, y, b = e.input.charCodeAt(e.position);
  if (b === 91)
    p = 93, d = !1, a = [];
  else if (b === 123)
    p = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && fr(e, e.anchor, a), b = e.input.charCodeAt(++e.position); b !== 0; ) {
    if (me(e, !0, t), b = e.input.charCodeAt(e.position), b === p)
      return e.position++, e.tag = o, e.anchor = c, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    if (r ? b === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), g = x = y = null, l = u = !1, b === 63) {
      const C = e.input.charCodeAt(e.position + 1);
      Ve(C) && (l = u = !0, e.position++, me(e, !0, t));
    }
    n = e.line, i = e.lineStart, s = e.position, Wr(e, t, ds, !1, !0), g = e.tag, x = e.result, me(e, !0, t), b = e.input.charCodeAt(e.position), (u || e.line === n) && b === 58 && (l = !0, b = e.input.charCodeAt(++e.position), me(e, !0, t), Wr(e, t, ds, !1, !0), y = e.result), d ? Fr(e, a, _, g, x, y, n, i, s) : l ? a.push(Fr(e, null, _, g, x, y, n, i, s)) : a.push(x), me(e, !0, t), b = e.input.charCodeAt(e.position), b === 44 ? (r = !0, b = e.input.charCodeAt(++e.position)) : r = !1;
  }
  U(e, "unexpected end of the stream within a flow collection");
}
function eE(e, t) {
  let r, n = Yo, i = !1, s = !1, o = t, a = 0, c = !1, p, l = e.input.charCodeAt(e.position);
  if (l === 124)
    r = !1;
  else if (l === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; l !== 0; )
    if (l = e.input.charCodeAt(++e.position), l === 43 || l === 45)
      Yo === n ? n = l === 43 ? mu : B1 : U(e, "repeat of a chomping mode identifier");
    else if ((p = G1(l)) >= 0)
      p === 0 ? U(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? U(e, "repeat of an indentation width identifier") : (o = t + p - 1, s = !0);
    else
      break;
  if (Tt(l)) {
    do
      l = e.input.charCodeAt(++e.position);
    while (Tt(l));
    if (l === 35)
      do
        l = e.input.charCodeAt(++e.position);
      while (!_t(l) && l !== 0);
  }
  for (; l !== 0; ) {
    for (Al(e), e.lineIndent = 0, l = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && l === 32; )
      e.lineIndent++, l = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), _t(l)) {
      a++;
      continue;
    }
    if (!s && o === 0 && U(e, "missing indentation for block scalar"), e.lineIndent < o) {
      n === mu ? e.result += ur.repeat(`
`, i ? 1 + a : a) : n === Yo && i && (e.result += `
`);
      break;
    }
    r ? Tt(l) ? (c = !0, e.result += ur.repeat(`
`, i ? 1 + a : a)) : c ? (c = !1, e.result += ur.repeat(`
`, a + 1)) : a === 0 ? i && (e.result += " ") : e.result += ur.repeat(`
`, a) : e.result += ur.repeat(`
`, i ? 1 + a : a), i = !0, s = !0, a = 0;
    const u = e.position;
    for (; !_t(l) && l !== 0; )
      l = e.input.charCodeAt(++e.position);
    Wt(e, u, e.position, !1);
  }
  return !0;
}
function bu(e, t) {
  const r = e.tag, n = e.anchor, i = [];
  let s = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && fr(e, e.anchor, i);
  let o = e.input.charCodeAt(e.position);
  for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), o === 45); ) {
    const a = e.input.charCodeAt(e.position + 1);
    if (!Ve(a))
      break;
    if (s = !0, e.position++, me(e, !0, -1) && e.lineIndent <= t) {
      i.push(null), o = e.input.charCodeAt(e.position);
      continue;
    }
    const c = e.line;
    if (Wr(e, t, dh, !1, !0), i.push(e.result), me(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === c || e.lineIndent > t) && o !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = n, e.kind = "sequence", e.result = i, !0) : !1;
}
function Eh(e, t, r) {
  let n, i, s, o;
  const a = e.tag, c = e.anchor, p = {}, l = /* @__PURE__ */ Object.create(null);
  let u = null, d = null, _ = null, x = !1, g = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && fr(e, e.anchor, p);
  let y = e.input.charCodeAt(e.position);
  for (; y !== 0; ) {
    !x && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation"));
    const b = e.input.charCodeAt(e.position + 1), C = e.line;
    if ((y === 63 || y === 58) && Ve(b))
      y === 63 ? (x && (Fr(e, p, l, u, d, null, i, s, o), u = d = _ = null), g = !0, x = !0, n = !0) : x ? (x = !1, n = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = b;
    else {
      if (i = e.line, s = e.lineStart, o = e.position, !Wr(e, r, fh, !1, !0))
        break;
      if (e.line === C) {
        for (y = e.input.charCodeAt(e.position); Tt(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), Ve(y) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), x && (Fr(e, p, l, u, d, null, i, s, o), u = d = _ = null), g = !0, x = !1, n = !1, u = e.tag, d = e.result;
        else if (g)
          U(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = a, e.anchor = c, !0;
      } else if (g)
        U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = a, e.anchor = c, !0;
    }
    if ((e.line === C || e.lineIndent > t) && (x && (i = e.line, s = e.lineStart, o = e.position), Wr(e, t, hs, !0, n) && (x ? d = e.result : _ = e.result), x || (Fr(e, p, l, u, d, _, i, s, o), u = d = _ = null), me(e, !0, -1), y = e.input.charCodeAt(e.position)), (e.line === C || e.lineIndent > t) && y !== 0)
      U(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return x && Fr(e, p, l, u, d, null, i, s, o), g && (e.tag = a, e.anchor = c, e.kind = "mapping", e.result = p), g;
}
function tE(e) {
  let t = !1, r = !1, n, i, s = e.input.charCodeAt(e.position);
  if (s !== 33) return !1;
  e.tag !== null && U(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (t = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, n = "!!", s = e.input.charCodeAt(++e.position)) : n = "!";
  let o = e.position;
  if (t) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (i = e.input.slice(o, e.position), s = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Ve(s); )
      s === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(o - 1, e.position + 1), hh.test(n) || U(e, "named tag handle cannot contain such characters"), r = !0, o = e.position + 1)), s = e.input.charCodeAt(++e.position);
    i = e.input.slice(o, e.position), q1.test(i) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  i && !ph.test(i) && U(e, "tag name cannot contain such characters: " + i);
  try {
    i = decodeURIComponent(i);
  } catch {
    U(e, "tag name is malformed: " + i);
  }
  return t ? e.tag = i : ot.call(e.tagMap, n) ? e.tag = e.tagMap[n] + i : n === "!" ? e.tag = "!" + i : n === "!!" ? e.tag = "tag:yaml.org,2002:" + i : U(e, 'undeclared tag handle "' + n + '"'), !0;
}
function rE(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 38) return !1;
  e.anchor !== null && U(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
  const r = e.position;
  for (; t !== 0 && !Ve(t) && !Nr(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function nE(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 42) return !1;
  t = e.input.charCodeAt(++e.position);
  const r = e.position;
  for (; t !== 0 && !Ve(t) && !Nr(t); )
    t = e.input.charCodeAt(++e.position);
  e.position === r && U(e, "name of an alias node must contain at least one character");
  const n = e.input.slice(r, e.position);
  return ot.call(e.anchorMap, n) || U(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], me(e, !0, -1), !0;
}
function iE(e, t, r, n) {
  const i = yh(e);
  return z1(e), yu(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, Eh(e, r, n) && e.kind === "mapping" ? (Y1(e), !0) : (X1(e), yu(e, i), !1);
}
function Wr(e, t, r, n, i) {
  let s, o, a = 1, c = !1, p = !1, l = null, u, d, _;
  e.depth >= e.maxDepth && U(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
  const x = s = o = hs === r || dh === r;
  if (n && me(e, !0, -1) && (c = !0, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)), a === 1)
    for (; ; ) {
      const g = e.input.charCodeAt(e.position), y = yh(e);
      if (c && (g === 33 && e.tag !== null || g === 38 && e.anchor !== null) || !tE(e) && !rE(e))
        break;
      l === null && (l = y), me(e, !0, -1) ? (c = !0, o = x, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)) : o = !1;
    }
  if (o && (o = c || i), a === 1 || hs === r)
    if (ds === r || fh === r ? d = t : d = t + 1, _ = e.position - e.lineStart, a === 1)
      if (o && (bu(e, _) || Eh(e, _, d)) || Z1(e, d))
        p = !0;
      else {
        const g = e.input.charCodeAt(e.position);
        l !== null && x && !o && g !== 124 && g !== 62 && iE(
          e,
          l,
          l.position - l.lineStart,
          d
        ) || s && eE(e, d) || J1(e, d) || Q1(e, d) ? p = !0 : nE(e) ? (p = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : K1(e, d, ds === r) && (p = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && fr(e, e.anchor, e.result);
      }
    else a === 0 && (p = o && bu(e, _));
  if (e.tag === null)
    e.anchor !== null && fr(e, e.anchor, e.result);
  else if (e.tag === "?") {
    e.result !== null && e.kind !== "scalar" && U(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
    for (let g = 0, y = e.implicitTypes.length; g < y; g += 1)
      if (u = e.implicitTypes[g], u.resolve(e.result)) {
        e.result = u.construct(e.result), e.tag = u.tag, e.anchor !== null && fr(e, e.anchor, e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (ot.call(e.typeMap[e.kind || "fallback"], e.tag))
      u = e.typeMap[e.kind || "fallback"][e.tag];
    else {
      u = null;
      const g = e.typeMap.multi[e.kind || "fallback"];
      for (let y = 0, b = g.length; y < b; y += 1)
        if (e.tag.slice(0, g[y].tag.length) === g[y].tag) {
          u = g[y];
          break;
        }
    }
    u || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && u.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + u.kind + '", not "' + e.kind + '"'), u.resolve(e.result, e.tag) ? (e.result = u.construct(e.result, e.tag), e.anchor !== null && fr(e, e.anchor, e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || p;
}
function sE(e) {
  const t = e.position;
  let r = !1, n;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (n = e.input.charCodeAt(e.position)) !== 0 && (me(e, !0, -1), n = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || n !== 37)); ) {
    r = !0, n = e.input.charCodeAt(++e.position);
    let i = e.position;
    for (; n !== 0 && !Ve(n); )
      n = e.input.charCodeAt(++e.position);
    const s = e.input.slice(i, e.position), o = [];
    for (s.length < 1 && U(e, "directive name must not be less than one character in length"); n !== 0; ) {
      for (; Tt(n); )
        n = e.input.charCodeAt(++e.position);
      if (n === 35) {
        do
          n = e.input.charCodeAt(++e.position);
        while (n !== 0 && !_t(n));
        break;
      }
      if (_t(n)) break;
      for (i = e.position; n !== 0 && !Ve(n); )
        n = e.input.charCodeAt(++e.position);
      o.push(e.input.slice(i, e.position));
    }
    n !== 0 && Al(e), ot.call(Eu, s) ? Eu[s](e, s, o) : ps(e, 'unknown document directive "' + s + '"');
  }
  if (me(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, me(e, !0, -1)) : r && U(e, "directives end mark is expected"), Wr(e, e.lineIndent - 1, hs, !1, !0), me(e, !0, -1), e.checkLineBreaks && k1.test(e.input.slice(t, e.position)) && ps(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Hs(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, me(e, !0, -1));
    return;
  }
  e.position < e.length - 1 && U(e, "end of the stream or a document separator is expected");
}
function wh(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  const r = new V1(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, U(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    sE(r);
  return r.documents;
}
function oE(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  const n = wh(e, r);
  if (typeof t != "function")
    return n;
  for (let i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function aE(e, t) {
  const r = wh(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new uh("expected a single document in the stream, but found more");
  }
}
Rl.loadAll = oE;
Rl.load = aE;
var vh = {};
const Gs = at, Qn = Jn, lE = Il, bh = Object.prototype.toString, Rh = Object.prototype.hasOwnProperty, Tl = 65279, cE = 9, Ln = 10, uE = 13, fE = 32, dE = 33, hE = 34, Ya = 35, pE = 37, _E = 38, mE = 39, xE = 42, Ch = 44, gE = 45, _s = 58, yE = 61, EE = 62, wE = 63, vE = 64, Ih = 91, Ah = 93, bE = 96, Sh = 123, RE = 124, Th = 125, Fe = {};
Fe[0] = "\\0";
Fe[7] = "\\a";
Fe[8] = "\\b";
Fe[9] = "\\t";
Fe[10] = "\\n";
Fe[11] = "\\v";
Fe[12] = "\\f";
Fe[13] = "\\r";
Fe[27] = "\\e";
Fe[34] = '\\"';
Fe[92] = "\\\\";
Fe[133] = "\\N";
Fe[160] = "\\_";
Fe[8232] = "\\L";
Fe[8233] = "\\P";
const CE = [
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
], IE = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function AE(e, t) {
  if (t === null) return {};
  const r = {}, n = Object.keys(t);
  for (let i = 0, s = n.length; i < s; i += 1) {
    let o = n[i], a = String(t[o]);
    o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2));
    const c = e.compiledTypeMap.fallback[o];
    c && Rh.call(c.styleAliases, a) && (a = c.styleAliases[a]), r[o] = a;
  }
  return r;
}
function SE(e) {
  let t, r;
  const n = e.toString(16).toUpperCase();
  if (e <= 255)
    t = "x", r = 2;
  else if (e <= 65535)
    t = "u", r = 4;
  else if (e <= 4294967295)
    t = "U", r = 8;
  else
    throw new Qn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + Gs.repeat("0", r - n.length) + n;
}
const TE = 1, Nn = 2;
function PE(e) {
  this.schema = e.schema || lE, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Gs.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = AE(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Nn : TE, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ru(e, t) {
  const r = Gs.repeat(" ", t);
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
function Xa(e, t) {
  return `
` + Gs.repeat(" ", e.indent * t);
}
function DE(e, t) {
  for (let r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (e.implicitTypes[r].resolve(t))
      return !0;
  return !1;
}
function ms(e) {
  return e === fE || e === cE;
}
function Fn(e) {
  return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== Tl || e >= 65536 && e <= 1114111;
}
function Cu(e) {
  return Fn(e) && e !== Tl && // - b-char
  e !== uE && e !== Ln;
}
function Iu(e, t, r) {
  const n = Cu(e), i = n && !ms(e);
  return (
    // ns-plain-safe
    (r ? n : n && // - c-flow-indicator
    e !== Ch && e !== Ih && e !== Ah && e !== Sh && e !== Th) && // ns-plain-char
    e !== Ya && // false on '#'
    !(t === _s && !i) || // false on ': '
    Cu(t) && !ms(t) && e === Ya || // change to true on '[^ ]#'
    t === _s && i
  );
}
function $E(e) {
  return Fn(e) && e !== Tl && !ms(e) && // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  e !== gE && e !== wE && e !== _s && e !== Ch && e !== Ih && e !== Ah && e !== Sh && e !== Th && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  e !== Ya && e !== _E && e !== xE && e !== dE && e !== RE && e !== yE && e !== EE && e !== mE && e !== hE && // | “%” | “@” | “`”)
  e !== pE && e !== vE && e !== bE;
}
function OE(e) {
  return !ms(e) && e !== _s;
}
function En(e, t) {
  const r = e.charCodeAt(t);
  let n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Ph(e) {
  return /^\n* /.test(e);
}
const Dh = 1, Ka = 2, $h = 3, Oh = 4, $r = 5;
function LE(e, t, r, n, i, s, o, a) {
  let c, p = 0, l = null, u = !1, d = !1;
  const _ = n !== -1;
  let x = -1, g = $E(En(e, 0)) && OE(En(e, e.length - 1));
  if (t || o)
    for (c = 0; c < e.length; p >= 65536 ? c += 2 : c++) {
      if (p = En(e, c), !Fn(p))
        return $r;
      g = g && Iu(p, l, a), l = p;
    }
  else {
    for (c = 0; c < e.length; p >= 65536 ? c += 2 : c++) {
      if (p = En(e, c), p === Ln)
        u = !0, _ && (d = d || // Foldable line = too long, and not more-indented.
        c - x - 1 > n && e[x + 1] !== " ", x = c);
      else if (!Fn(p))
        return $r;
      g = g && Iu(p, l, a), l = p;
    }
    d = d || _ && c - x - 1 > n && e[x + 1] !== " ";
  }
  return !u && !d ? g && !o && !i(e) ? Dh : s === Nn ? $r : Ka : r > 9 && Ph(e) ? $r : o ? s === Nn ? $r : Ka : d ? Oh : $h;
}
function NE(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Nn ? '""' : "''";
    if (!e.noCompatMode && (CE.indexOf(t) !== -1 || IE.test(t)))
      return e.quotingType === Nn ? '"' + t + '"' : "'" + t + "'";
    const s = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || // No block styles in flow mode.
    e.flowLevel > -1 && r >= e.flowLevel;
    function c(p) {
      return DE(e, p);
    }
    switch (LE(
      t,
      a,
      e.indent,
      o,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Dh:
        return t;
      case Ka:
        return "'" + t.replace(/'/g, "''") + "'";
      case $h:
        return "|" + Au(t, e.indent) + Su(Ru(t, s));
      case Oh:
        return ">" + Au(t, e.indent) + Su(Ru(FE(t, o), s));
      case $r:
        return '"' + UE(t) + '"';
      default:
        throw new Qn("impossible error: invalid scalar style");
    }
  }();
}
function Au(e, t) {
  const r = Ph(e) ? String(t) : "", n = e[e.length - 1] === `
`, s = n && (e[e.length - 2] === `
` || e === `
`) ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function Su(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function FE(e, t) {
  const r = /(\n+)([^\n]*)/g;
  let n = function() {
    let a = e.indexOf(`
`);
    return a = a !== -1 ? a : e.length, r.lastIndex = a, Tu(e.slice(0, a), t);
  }(), i = e[0] === `
` || e[0] === " ", s, o;
  for (; o = r.exec(e); ) {
    const a = o[1], c = o[2];
    s = c[0] === " ", n += a + (!i && !s && c !== "" ? `
` : "") + Tu(c, t), i = s;
  }
  return n;
}
function Tu(e, t) {
  if (e === "" || e[0] === " ") return e;
  const r = / [^ ]/g;
  let n, i = 0, s, o = 0, a = 0, c = "";
  for (; n = r.exec(e); )
    a = n.index, a - i > t && (s = o > i ? o : a, c += `
` + e.slice(i, s), i = s + 1), o = a;
  return c += `
`, e.length - i > t && o > i ? c += e.slice(i, o) + `
` + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function UE(e) {
  let t = "", r = 0;
  for (let n = 0; n < e.length; r >= 65536 ? n += 2 : n++) {
    r = En(e, n);
    const i = Fe[r];
    !i && Fn(r) ? (t += e[n], r >= 65536 && (t += e[n + 1])) : t += i || SE(r);
  }
  return t;
}
function BE(e, t, r) {
  let n = "";
  const i = e.tag;
  for (let s = 0, o = r.length; s < o; s += 1) {
    let a = r[s];
    e.replacer && (a = e.replacer.call(r, String(s), a)), (Pt(e, t, a, !1, !1) || typeof a > "u" && Pt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  }
  e.tag = i, e.dump = "[" + n + "]";
}
function Pu(e, t, r, n) {
  let i = "";
  const s = e.tag;
  for (let o = 0, a = r.length; o < a; o += 1) {
    let c = r[o];
    e.replacer && (c = e.replacer.call(r, String(o), c)), (Pt(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Pt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Xa(e, t)), e.dump && Ln === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  }
  e.tag = s, e.dump = i || "[]";
}
function ME(e, t, r) {
  let n = "";
  const i = e.tag, s = Object.keys(r);
  for (let o = 0, a = s.length; o < a; o += 1) {
    let c = "";
    n !== "" && (c += ", "), e.condenseFlow && (c += '"');
    const p = s[o];
    let l = r[p];
    e.replacer && (l = e.replacer.call(r, p, l)), Pt(e, t, p, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Pt(e, t, l, !1, !1) && (c += e.dump, n += c));
  }
  e.tag = i, e.dump = "{" + n + "}";
}
function kE(e, t, r, n) {
  let i = "";
  const s = e.tag, o = Object.keys(r);
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Qn("sortKeys must be a boolean or a function");
  for (let a = 0, c = o.length; a < c; a += 1) {
    let p = "";
    (!n || i !== "") && (p += Xa(e, t));
    const l = o[a];
    let u = r[l];
    if (e.replacer && (u = e.replacer.call(r, l, u)), !Pt(e, t + 1, l, !0, !0, !0))
      continue;
    const d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
    d && (e.dump && Ln === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, d && (p += Xa(e, t)), Pt(e, t + 1, u, !0, d) && (e.dump && Ln === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p);
  }
  e.tag = s, e.dump = i || "{}";
}
function Du(e, t, r) {
  const n = r ? e.explicitTypes : e.implicitTypes;
  for (let i = 0, s = n.length; i < s; i += 1) {
    const o = n[i];
    if ((o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        const a = e.styleMap[o.tag] || o.defaultStyle;
        let c;
        if (bh.call(o.represent) === "[object Function]")
          c = o.represent(t, a);
        else if (Rh.call(o.represent, a))
          c = o.represent[a](t, a);
        else
          throw new Qn("!<" + o.tag + '> tag resolver accepts not "' + a + '" style');
        e.dump = c;
      }
      return !0;
    }
  }
  return !1;
}
function Pt(e, t, r, n, i, s, o) {
  e.tag = null, e.dump = r, Du(e, r, !1) || Du(e, r, !0);
  const a = bh.call(e.dump), c = n;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  const p = a === "[object Object]" || a === "[object Array]";
  let l, u;
  if (p && (l = e.duplicates.indexOf(r), u = l !== -1), (e.tag !== null && e.tag !== "?" || u || e.indent !== 2 && t > 0) && (i = !1), u && e.usedDuplicates[l])
    e.dump = "*ref_" + l;
  else {
    if (p && u && !e.usedDuplicates[l] && (e.usedDuplicates[l] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (kE(e, t, e.dump, i), u && (e.dump = "&ref_" + l + e.dump)) : (ME(e, t, e.dump), u && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? Pu(e, t - 1, e.dump, i) : Pu(e, t, e.dump, i), u && (e.dump = "&ref_" + l + e.dump)) : (BE(e, t, e.dump), u && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && NE(e, e.dump, t, s, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Qn("unacceptable kind of an object to dump " + a);
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
function qE(e, t) {
  const r = [], n = [];
  Ja(e, r, n);
  const i = n.length;
  for (let s = 0; s < i; s += 1)
    t.duplicates.push(r[n[s]]);
  t.usedDuplicates = new Array(i);
}
function Ja(e, t, r) {
  if (e !== null && typeof e == "object") {
    const n = t.indexOf(e);
    if (n !== -1)
      r.indexOf(n) === -1 && r.push(n);
    else if (t.push(e), Array.isArray(e))
      for (let i = 0, s = e.length; i < s; i += 1)
        Ja(e[i], t, r);
    else {
      const i = Object.keys(e);
      for (let s = 0, o = i.length; s < o; s += 1)
        Ja(e[i[s]], t, r);
    }
  }
}
function jE(e, t) {
  t = t || {};
  const r = new PE(t);
  r.noRefs || qE(e, r);
  let n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Pt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
vh.dump = jE;
const Lh = Rl, HE = vh;
function Pl(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Te.Type = je;
Te.Schema = G0;
Te.FAILSAFE_SCHEMA = Y0;
Te.JSON_SCHEMA = eh;
Te.CORE_SCHEMA = th;
Te.DEFAULT_SCHEMA = Il;
Te.load = Lh.load;
Te.loadAll = Lh.loadAll;
Te.dump = HE.dump;
Te.YAMLException = Jn;
Te.types = {
  binary: oh,
  float: Z0,
  map: z0,
  null: X0,
  pairs: lh,
  set: ch,
  timestamp: ih,
  bool: K0,
  int: J0,
  merge: sh,
  omap: ah,
  seq: V0,
  str: W0
};
Te.safeLoad = Pl("safeLoad", "load");
Te.safeLoadAll = Pl("safeLoadAll", "loadAll");
Te.safeDump = Pl("safeDump", "dump");
var Ws = {};
Object.defineProperty(Ws, "__esModule", { value: !0 });
Ws.Lazy = void 0;
class GE {
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
Ws.Lazy = GE;
var Qa = { exports: {} };
const WE = "2.0.0", Nh = 256, VE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, zE = 16, YE = Nh - 6, XE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Vs = {
  MAX_LENGTH: Nh,
  MAX_SAFE_COMPONENT_LENGTH: zE,
  MAX_SAFE_BUILD_LENGTH: YE,
  MAX_SAFE_INTEGER: VE,
  RELEASE_TYPES: XE,
  SEMVER_SPEC_VERSION: WE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const KE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var zs = KE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Vs, s = zs;
  t = e.exports = {};
  const o = t.re = [], a = t.safeRe = [], c = t.src = [], p = t.safeSrc = [], l = t.t = {};
  let u = 0;
  const d = "[a-zA-Z0-9-]", _ = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], x = (y) => {
    for (const [b, C] of _)
      y = y.split(`${b}*`).join(`${b}{0,${C}}`).split(`${b}+`).join(`${b}{1,${C}}`);
    return y;
  }, g = (y, b, C) => {
    const $ = x(b), B = u++;
    s(y, B, b), l[y] = B, c[B] = b, p[B] = $, o[B] = new RegExp(b, C ? "g" : void 0), a[B] = new RegExp($, C ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), g("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${d}+`), g("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), g("FULL", `^${c[l.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), g("LOOSE", `^${c[l.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), g("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", c[l.COERCE], !0), g("COERCERTLFULL", c[l.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Qa, Qa.exports);
var Zn = Qa.exports;
const JE = Object.freeze({ loose: !0 }), QE = Object.freeze({}), ZE = (e) => e ? typeof e != "object" ? JE : e : QE;
var Dl = ZE;
const $u = /^[0-9]+$/, Fh = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = $u.test(e), n = $u.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, ew = (e, t) => Fh(t, e);
var Uh = {
  compareIdentifiers: Fh,
  rcompareIdentifiers: ew
};
const Mi = zs, { MAX_LENGTH: Ou, MAX_SAFE_INTEGER: ki } = Vs, { safeRe: qi, t: ji } = Zn, tw = Dl, { compareIdentifiers: Xo } = Uh;
let rw = class ht {
  constructor(t, r) {
    if (r = tw(r), t instanceof ht) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ou)
      throw new TypeError(
        `version is longer than ${Ou} characters`
      );
    Mi("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? qi[ji.LOOSE] : qi[ji.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ki || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ki || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ki || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < ki)
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
    if (Mi("SemVer.compare", this.version, this.options, t), !(t instanceof ht)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ht(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ht || (t = new ht(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ht || (t = new ht(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Mi("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Xo(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ht || (t = new ht(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Mi("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Xo(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? qi[ji.PRERELEASELOOSE] : qi[ji.PRERELEASE]);
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
          n === !1 && (s = [r]), Xo(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var He = rw;
const Lu = He, nw = (e, t, r = !1) => {
  if (e instanceof Lu)
    return e;
  try {
    return new Lu(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Yr = nw;
const iw = Yr, sw = (e, t) => {
  const r = iw(e, t);
  return r ? r.version : null;
};
var ow = sw;
const aw = Yr, lw = (e, t) => {
  const r = aw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var cw = lw;
const Nu = He, uw = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Nu(
      e instanceof Nu ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var fw = uw;
const Fu = Yr, dw = (e, t) => {
  const r = Fu(e, null, !0), n = Fu(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, o = s ? r : n, a = s ? n : r, c = !!o.prerelease.length;
  if (!!a.prerelease.length && !c) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(o) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var hw = dw;
const pw = He, _w = (e, t) => new pw(e, t).major;
var mw = _w;
const xw = He, gw = (e, t) => new xw(e, t).minor;
var yw = gw;
const Ew = He, ww = (e, t) => new Ew(e, t).patch;
var vw = ww;
const bw = Yr, Rw = (e, t) => {
  const r = bw(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Cw = Rw;
const Uu = He, Iw = (e, t, r) => new Uu(e, r).compare(new Uu(t, r));
var lt = Iw;
const Aw = lt, Sw = (e, t, r) => Aw(t, e, r);
var Tw = Sw;
const Pw = lt, Dw = (e, t) => Pw(e, t, !0);
var $w = Dw;
const Bu = He, Ow = (e, t, r) => {
  const n = new Bu(e, r), i = new Bu(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var $l = Ow;
const Lw = $l, Nw = (e, t) => e.sort((r, n) => Lw(r, n, t));
var Fw = Nw;
const Uw = $l, Bw = (e, t) => e.sort((r, n) => Uw(n, r, t));
var Mw = Bw;
const kw = lt, qw = (e, t, r) => kw(e, t, r) > 0;
var Ys = qw;
const jw = lt, Hw = (e, t, r) => jw(e, t, r) < 0;
var Ol = Hw;
const Gw = lt, Ww = (e, t, r) => Gw(e, t, r) === 0;
var Bh = Ww;
const Vw = lt, zw = (e, t, r) => Vw(e, t, r) !== 0;
var Mh = zw;
const Yw = lt, Xw = (e, t, r) => Yw(e, t, r) >= 0;
var Ll = Xw;
const Kw = lt, Jw = (e, t, r) => Kw(e, t, r) <= 0;
var Nl = Jw;
const Qw = Bh, Zw = Mh, ev = Ys, tv = Ll, rv = Ol, nv = Nl, iv = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Qw(e, r, n);
    case "!=":
      return Zw(e, r, n);
    case ">":
      return ev(e, r, n);
    case ">=":
      return tv(e, r, n);
    case "<":
      return rv(e, r, n);
    case "<=":
      return nv(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var kh = iv;
const sv = He, ov = Yr, { safeRe: Hi, t: Gi } = Zn, av = (e, t) => {
  if (e instanceof sv)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Hi[Gi.COERCEFULL] : Hi[Gi.COERCE]);
  else {
    const c = t.includePrerelease ? Hi[Gi.COERCERTLFULL] : Hi[Gi.COERCERTL];
    let p;
    for (; (p = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || p.index + p[0].length !== r.index + r[0].length) && (r = p), c.lastIndex = p.index + p[1].length + p[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", a = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ov(`${n}.${i}.${s}${o}${a}`, t);
};
var lv = av;
class cv {
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
var uv = cv, Ko, Mu;
function ct() {
  if (Mu) return Ko;
  Mu = 1;
  const e = /\s+/g;
  class t {
    constructor(S, O) {
      if (O = i(O), S instanceof t)
        return S.loose === !!O.loose && S.includePrerelease === !!O.includePrerelease ? S : new t(S.raw, O);
      if (S instanceof s)
        return this.raw = S.value, this.set = [[S]], this.formatted = void 0, this;
      if (this.options = O, this.loose = !!O.loose, this.includePrerelease = !!O.includePrerelease, this.raw = S.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((L) => !g(L[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const L of this.set)
            if (L.length === 1 && y(L[0])) {
              this.set = [L];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let S = 0; S < this.set.length; S++) {
          S > 0 && (this.formatted += "||");
          const O = this.set[S];
          for (let A = 0; A < O.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += O[A].toString().trim();
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
    parseRange(S) {
      const A = ((this.options.includePrerelease && _) | (this.options.loose && x)) + ":" + S, L = n.get(A);
      if (L)
        return L;
      const D = this.options.loose, k = D ? c[p.HYPHENRANGELOOSE] : c[p.HYPHENRANGE];
      S = S.replace(k, J(this.options.includePrerelease)), o("hyphen replace", S), S = S.replace(c[p.COMPARATORTRIM], l), o("comparator trim", S), S = S.replace(c[p.TILDETRIM], u), o("tilde trim", S), S = S.replace(c[p.CARETTRIM], d), o("caret trim", S);
      let z = S.split(" ").map((q) => C(q, this.options)).join(" ").split(/\s+/).map((q) => W(q, this.options));
      D && (z = z.filter((q) => (o("loose invalid filter", q, this.options), !!q.match(c[p.COMPARATORLOOSE])))), o("range list", z);
      const N = /* @__PURE__ */ new Map(), ee = z.map((q) => new s(q, this.options));
      for (const q of ee) {
        if (g(q))
          return [q];
        N.set(q.value, q);
      }
      N.size > 1 && N.has("") && N.delete("");
      const ge = [...N.values()];
      return n.set(A, ge), ge;
    }
    intersects(S, O) {
      if (!(S instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => b(A, O) && S.set.some((L) => b(L, O) && A.every((D) => L.every((k) => D.intersects(k, O)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(S) {
      if (!S)
        return !1;
      if (typeof S == "string")
        try {
          S = new a(S, this.options);
        } catch {
          return !1;
        }
      for (let O = 0; O < this.set.length; O++)
        if (le(this.set[O], S, this.options))
          return !0;
      return !1;
    }
  }
  Ko = t;
  const r = uv, n = new r(), i = Dl, s = Xs(), o = zs, a = He, {
    safeRe: c,
    t: p,
    comparatorTrimReplace: l,
    tildeTrimReplace: u,
    caretTrimReplace: d
  } = Zn, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: x } = Vs, g = (P) => P.value === "<0.0.0-0", y = (P) => P.value === "", b = (P, S) => {
    let O = !0;
    const A = P.slice();
    let L = A.pop();
    for (; O && A.length; )
      O = A.every((D) => L.intersects(D, S)), L = A.pop();
    return O;
  }, C = (P, S) => (P = P.replace(c[p.BUILD], ""), o("comp", P, S), P = Q(P, S), o("caret", P), P = B(P, S), o("tildes", P), P = se(P, S), o("xrange", P), P = E(P, S), o("stars", P), P), $ = (P) => !P || P.toLowerCase() === "x" || P === "*", B = (P, S) => P.trim().split(/\s+/).map((O) => j(O, S)).join(" "), j = (P, S) => {
    const O = S.loose ? c[p.TILDELOOSE] : c[p.TILDE];
    return P.replace(O, (A, L, D, k, z) => {
      o("tilde", P, A, L, D, k, z);
      let N;
      return $(L) ? N = "" : $(D) ? N = `>=${L}.0.0 <${+L + 1}.0.0-0` : $(k) ? N = `>=${L}.${D}.0 <${L}.${+D + 1}.0-0` : z ? (o("replaceTilde pr", z), N = `>=${L}.${D}.${k}-${z} <${L}.${+D + 1}.0-0`) : N = `>=${L}.${D}.${k} <${L}.${+D + 1}.0-0`, o("tilde return", N), N;
    });
  }, Q = (P, S) => P.trim().split(/\s+/).map((O) => K(O, S)).join(" "), K = (P, S) => {
    o("caret", P, S);
    const O = S.loose ? c[p.CARETLOOSE] : c[p.CARET], A = S.includePrerelease ? "-0" : "";
    return P.replace(O, (L, D, k, z, N) => {
      o("caret", P, L, D, k, z, N);
      let ee;
      return $(D) ? ee = "" : $(k) ? ee = `>=${D}.0.0${A} <${+D + 1}.0.0-0` : $(z) ? D === "0" ? ee = `>=${D}.${k}.0${A} <${D}.${+k + 1}.0-0` : ee = `>=${D}.${k}.0${A} <${+D + 1}.0.0-0` : N ? (o("replaceCaret pr", N), D === "0" ? k === "0" ? ee = `>=${D}.${k}.${z}-${N} <${D}.${k}.${+z + 1}-0` : ee = `>=${D}.${k}.${z}-${N} <${D}.${+k + 1}.0-0` : ee = `>=${D}.${k}.${z}-${N} <${+D + 1}.0.0-0`) : (o("no pr"), D === "0" ? k === "0" ? ee = `>=${D}.${k}.${z}${A} <${D}.${k}.${+z + 1}-0` : ee = `>=${D}.${k}.${z}${A} <${D}.${+k + 1}.0-0` : ee = `>=${D}.${k}.${z} <${+D + 1}.0.0-0`), o("caret return", ee), ee;
    });
  }, se = (P, S) => (o("replaceXRanges", P, S), P.split(/\s+/).map((O) => M(O, S)).join(" ")), M = (P, S) => {
    P = P.trim();
    const O = S.loose ? c[p.XRANGELOOSE] : c[p.XRANGE];
    return P.replace(O, (A, L, D, k, z, N) => {
      o("xRange", P, A, L, D, k, z, N);
      const ee = $(D), ge = ee || $(k), q = ge || $(z), Pe = q;
      return L === "=" && Pe && (L = ""), N = S.includePrerelease ? "-0" : "", ee ? L === ">" || L === "<" ? A = "<0.0.0-0" : A = "*" : L && Pe ? (ge && (k = 0), z = 0, L === ">" ? (L = ">=", ge ? (D = +D + 1, k = 0, z = 0) : (k = +k + 1, z = 0)) : L === "<=" && (L = "<", ge ? D = +D + 1 : k = +k + 1), L === "<" && (N = "-0"), A = `${L + D}.${k}.${z}${N}`) : ge ? A = `>=${D}.0.0${N} <${+D + 1}.0.0-0` : q && (A = `>=${D}.${k}.0${N} <${D}.${+k + 1}.0-0`), o("xRange return", A), A;
    });
  }, E = (P, S) => (o("replaceStars", P, S), P.trim().replace(c[p.STAR], "")), W = (P, S) => (o("replaceGTE0", P, S), P.trim().replace(c[S.includePrerelease ? p.GTE0PRE : p.GTE0], "")), J = (P) => (S, O, A, L, D, k, z, N, ee, ge, q, Pe) => ($(A) ? O = "" : $(L) ? O = `>=${A}.0.0${P ? "-0" : ""}` : $(D) ? O = `>=${A}.${L}.0${P ? "-0" : ""}` : k ? O = `>=${O}` : O = `>=${O}${P ? "-0" : ""}`, $(ee) ? N = "" : $(ge) ? N = `<${+ee + 1}.0.0-0` : $(q) ? N = `<${ee}.${+ge + 1}.0-0` : Pe ? N = `<=${ee}.${ge}.${q}-${Pe}` : P ? N = `<${ee}.${ge}.${+q + 1}-0` : N = `<=${N}`, `${O} ${N}`.trim()), le = (P, S, O) => {
    for (let A = 0; A < P.length; A++)
      if (!P[A].test(S))
        return !1;
    if (S.prerelease.length && !O.includePrerelease) {
      for (let A = 0; A < P.length; A++)
        if (o(P[A].semver), P[A].semver !== s.ANY && P[A].semver.prerelease.length > 0) {
          const L = P[A].semver;
          if (L.major === S.major && L.minor === S.minor && L.patch === S.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ko;
}
var Jo, ku;
function Xs() {
  if (ku) return Jo;
  ku = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, u) {
      if (u = r(u), l instanceof t) {
        if (l.loose === !!u.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, u), this.options = u, this.loose = !!u.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const u = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = l.match(u);
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
    intersects(l, u) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, u).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, u).test(l.semver) : (u = r(u), u.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !u.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, u) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, u) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Jo = t;
  const r = Dl, { safeRe: n, t: i } = Zn, s = kh, o = zs, a = He, c = ct();
  return Jo;
}
const fv = ct(), dv = (e, t, r) => {
  try {
    t = new fv(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ks = dv;
const hv = ct(), pv = (e, t) => new hv(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var _v = pv;
const mv = He, xv = ct(), gv = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new xv(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new mv(n, r));
  }), n;
};
var yv = gv;
const Ev = He, wv = ct(), vv = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new wv(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new Ev(n, r));
  }), n;
};
var bv = vv;
const Qo = He, Rv = ct(), qu = Ys, Cv = (e, t) => {
  e = new Rv(e, t);
  let r = new Qo("0.0.0");
  if (e.test(r) || (r = new Qo("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((o) => {
      const a = new Qo(o.semver.version);
      switch (o.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!s || qu(a, s)) && (s = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || qu(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var Iv = Cv;
const Av = ct(), Sv = (e, t) => {
  try {
    return new Av(e, t).range || "*";
  } catch {
    return null;
  }
};
var Tv = Sv;
const Pv = He, qh = Xs(), { ANY: Dv } = qh, $v = ct(), Ov = Ks, ju = Ys, Hu = Ol, Lv = Nl, Nv = Ll, Fv = (e, t, r, n) => {
  e = new Pv(e, n), t = new $v(t, n);
  let i, s, o, a, c;
  switch (r) {
    case ">":
      i = ju, s = Lv, o = Hu, a = ">", c = ">=";
      break;
    case "<":
      i = Hu, s = Nv, o = ju, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Ov(e, t, n))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const l = t.set[p];
    let u = null, d = null;
    if (l.forEach((_) => {
      _.semver === Dv && (_ = new qh(">=0.0.0")), u = u || _, d = d || _, i(_.semver, u.semver, n) ? u = _ : o(_.semver, d.semver, n) && (d = _);
    }), u.operator === a || u.operator === c || (!d.operator || d.operator === a) && s(e, d.semver))
      return !1;
    if (d.operator === c && o(e, d.semver))
      return !1;
  }
  return !0;
};
var Fl = Fv;
const Uv = Fl, Bv = (e, t, r) => Uv(e, t, ">", r);
var Mv = Bv;
const kv = Fl, qv = (e, t, r) => kv(e, t, "<", r);
var jv = qv;
const Gu = ct(), Hv = (e, t, r) => (e = new Gu(e, r), t = new Gu(t, r), e.intersects(t, r));
var Gv = Hv;
const Wv = Ks, Vv = lt;
var zv = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const o = e.sort((l, u) => Vv(l, u, r));
  for (const l of o)
    Wv(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [l, u] of n)
    l === u ? a.push(l) : !u && l === o[0] ? a.push("*") : u ? l === o[0] ? a.push(`<=${u}`) : a.push(`${l} - ${u}`) : a.push(`>=${l}`);
  const c = a.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < p.length ? c : t;
};
const Wu = ct(), Ul = Xs(), { ANY: Zo } = Ul, dn = Ks, Bl = lt, Yv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Wu(e, r), t = new Wu(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const o = Kv(i, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Xv = [new Ul(">=0.0.0-0")], Vu = [new Ul(">=0.0.0")], Kv = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Zo) {
    if (t.length === 1 && t[0].semver === Zo)
      return !0;
    r.includePrerelease ? e = Xv : e = Vu;
  }
  if (t.length === 1 && t[0].semver === Zo) {
    if (r.includePrerelease)
      return !0;
    t = Vu;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? i = zu(i, _, r) : _.operator === "<" || _.operator === "<=" ? s = Yu(s, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && s) {
    if (o = Bl(i.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const _ of n) {
    if (i && !dn(_, String(i), r) || s && !dn(_, String(s), r))
      return null;
    for (const x of t)
      if (!dn(_, String(x), r))
        return !1;
    return !0;
  }
  let a, c, p, l, u = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && s.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const _ of t) {
    if (l = l || _.operator === ">" || _.operator === ">=", p = p || _.operator === "<" || _.operator === "<=", i) {
      if (d && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === d.major && _.semver.minor === d.minor && _.semver.patch === d.patch && (d = !1), _.operator === ">" || _.operator === ">=") {
        if (a = zu(i, _, r), a === _ && a !== i)
          return !1;
      } else if (i.operator === ">=" && !dn(i.semver, String(_), r))
        return !1;
    }
    if (s) {
      if (u && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === u.major && _.semver.minor === u.minor && _.semver.patch === u.patch && (u = !1), _.operator === "<" || _.operator === "<=") {
        if (c = Yu(s, _, r), c === _ && c !== s)
          return !1;
      } else if (s.operator === "<=" && !dn(s.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (s || i) && o !== 0)
      return !1;
  }
  return !(i && p && !s && o !== 0 || s && l && !i && o !== 0 || d || u);
}, zu = (e, t, r) => {
  if (!e)
    return t;
  const n = Bl(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Yu = (e, t, r) => {
  if (!e)
    return t;
  const n = Bl(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Jv = Yv;
const ea = Zn, Xu = Vs, Qv = He, Ku = Uh, Zv = Yr, eb = ow, tb = cw, rb = fw, nb = hw, ib = mw, sb = yw, ob = vw, ab = Cw, lb = lt, cb = Tw, ub = $w, fb = $l, db = Fw, hb = Mw, pb = Ys, _b = Ol, mb = Bh, xb = Mh, gb = Ll, yb = Nl, Eb = kh, wb = lv, vb = Xs(), bb = ct(), Rb = Ks, Cb = _v, Ib = yv, Ab = bv, Sb = Iv, Tb = Tv, Pb = Fl, Db = Mv, $b = jv, Ob = Gv, Lb = zv, Nb = Jv;
var jh = {
  parse: Zv,
  valid: eb,
  clean: tb,
  inc: rb,
  diff: nb,
  major: ib,
  minor: sb,
  patch: ob,
  prerelease: ab,
  compare: lb,
  rcompare: cb,
  compareLoose: ub,
  compareBuild: fb,
  sort: db,
  rsort: hb,
  gt: pb,
  lt: _b,
  eq: mb,
  neq: xb,
  gte: gb,
  lte: yb,
  cmp: Eb,
  coerce: wb,
  Comparator: vb,
  Range: bb,
  satisfies: Rb,
  toComparators: Cb,
  maxSatisfying: Ib,
  minSatisfying: Ab,
  minVersion: Sb,
  validRange: Tb,
  outside: Pb,
  gtr: Db,
  ltr: $b,
  intersects: Ob,
  simplifyRange: Lb,
  subset: Nb,
  SemVer: Qv,
  re: ea.re,
  src: ea.src,
  tokens: ea.t,
  SEMVER_SPEC_VERSION: Xu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Xu.RELEASE_TYPES,
  compareIdentifiers: Ku.compareIdentifiers,
  rcompareIdentifiers: Ku.rcompareIdentifiers
}, ei = {}, xs = { exports: {} };
xs.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, o = 9007199254740991, a = "[object Arguments]", c = "[object Array]", p = "[object AsyncFunction]", l = "[object Boolean]", u = "[object Date]", d = "[object Error]", _ = "[object Function]", x = "[object GeneratorFunction]", g = "[object Map]", y = "[object Number]", b = "[object Null]", C = "[object Object]", $ = "[object Promise]", B = "[object Proxy]", j = "[object RegExp]", Q = "[object Set]", K = "[object String]", se = "[object Symbol]", M = "[object Undefined]", E = "[object WeakMap]", W = "[object ArrayBuffer]", J = "[object DataView]", le = "[object Float32Array]", P = "[object Float64Array]", S = "[object Int8Array]", O = "[object Int16Array]", A = "[object Int32Array]", L = "[object Uint8Array]", D = "[object Uint8ClampedArray]", k = "[object Uint16Array]", z = "[object Uint32Array]", N = /[\\^$.*+?()[\]{}|]/g, ee = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, q = {};
  q[le] = q[P] = q[S] = q[O] = q[A] = q[L] = q[D] = q[k] = q[z] = !0, q[a] = q[c] = q[W] = q[l] = q[J] = q[u] = q[d] = q[_] = q[g] = q[y] = q[C] = q[j] = q[Q] = q[K] = q[E] = !1;
  var Pe = typeof T == "object" && T && T.Object === Object && T, nn = typeof self == "object" && self && self.Object === Object && self, Ze = Pe || nn || Function("return this")(), Ri = t && !t.nodeType && t, sn = Ri && !0 && e && !e.nodeType && e, br = sn && sn.exports === Ri, on = br && Pe.process, h = function() {
    try {
      return on && on.binding && on.binding("util");
    } catch {
    }
  }(), f = h && h.isTypedArray;
  function R(m, v) {
    for (var I = -1, F = m == null ? 0 : m.length, re = 0, G = []; ++I < F; ) {
      var de = m[I];
      v(de, I, m) && (G[re++] = de);
    }
    return G;
  }
  function w(m, v) {
    for (var I = -1, F = v.length, re = m.length; ++I < F; )
      m[re + I] = v[I];
    return m;
  }
  function X(m, v) {
    for (var I = -1, F = m == null ? 0 : m.length; ++I < F; )
      if (v(m[I], I, m))
        return !0;
    return !1;
  }
  function ce(m, v) {
    for (var I = -1, F = Array(m); ++I < m; )
      F[I] = v(I);
    return F;
  }
  function he(m) {
    return function(v) {
      return m(v);
    };
  }
  function De(m, v) {
    return m.has(v);
  }
  function $e(m, v) {
    return m == null ? void 0 : m[v];
  }
  function et(m) {
    var v = -1, I = Array(m.size);
    return m.forEach(function(F, re) {
      I[++v] = [re, F];
    }), I;
  }
  function ye(m, v) {
    return function(I) {
      return m(v(I));
    };
  }
  function tt(m) {
    var v = -1, I = Array(m.size);
    return m.forEach(function(F) {
      I[++v] = F;
    }), I;
  }
  var Po = Array.prototype, Ci = Function.prototype, Lt = Object.prototype, Rr = Ze["__core-js_shared__"], mc = Ci.toString, ft = Lt.hasOwnProperty, xc = function() {
    var m = /[^.]+$/.exec(Rr && Rr.keys && Rr.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), gc = Lt.toString, r_ = RegExp(
    "^" + mc.call(ft).replace(N, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), yc = br ? Ze.Buffer : void 0, Ii = Ze.Symbol, Ec = Ze.Uint8Array, wc = Lt.propertyIsEnumerable, n_ = Po.splice, nr = Ii ? Ii.toStringTag : void 0, vc = Object.getOwnPropertySymbols, i_ = yc ? yc.isBuffer : void 0, s_ = ye(Object.keys, Object), Do = Cr(Ze, "DataView"), an = Cr(Ze, "Map"), $o = Cr(Ze, "Promise"), Oo = Cr(Ze, "Set"), Lo = Cr(Ze, "WeakMap"), ln = Cr(Object, "create"), o_ = or(Do), a_ = or(an), l_ = or($o), c_ = or(Oo), u_ = or(Lo), bc = Ii ? Ii.prototype : void 0, No = bc ? bc.valueOf : void 0;
  function ir(m) {
    var v = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++v < I; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function f_() {
    this.__data__ = ln ? ln(null) : {}, this.size = 0;
  }
  function d_(m) {
    var v = this.has(m) && delete this.__data__[m];
    return this.size -= v ? 1 : 0, v;
  }
  function h_(m) {
    var v = this.__data__;
    if (ln) {
      var I = v[m];
      return I === n ? void 0 : I;
    }
    return ft.call(v, m) ? v[m] : void 0;
  }
  function p_(m) {
    var v = this.__data__;
    return ln ? v[m] !== void 0 : ft.call(v, m);
  }
  function __(m, v) {
    var I = this.__data__;
    return this.size += this.has(m) ? 0 : 1, I[m] = ln && v === void 0 ? n : v, this;
  }
  ir.prototype.clear = f_, ir.prototype.delete = d_, ir.prototype.get = h_, ir.prototype.has = p_, ir.prototype.set = __;
  function vt(m) {
    var v = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++v < I; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function m_() {
    this.__data__ = [], this.size = 0;
  }
  function x_(m) {
    var v = this.__data__, I = Si(v, m);
    if (I < 0)
      return !1;
    var F = v.length - 1;
    return I == F ? v.pop() : n_.call(v, I, 1), --this.size, !0;
  }
  function g_(m) {
    var v = this.__data__, I = Si(v, m);
    return I < 0 ? void 0 : v[I][1];
  }
  function y_(m) {
    return Si(this.__data__, m) > -1;
  }
  function E_(m, v) {
    var I = this.__data__, F = Si(I, m);
    return F < 0 ? (++this.size, I.push([m, v])) : I[F][1] = v, this;
  }
  vt.prototype.clear = m_, vt.prototype.delete = x_, vt.prototype.get = g_, vt.prototype.has = y_, vt.prototype.set = E_;
  function sr(m) {
    var v = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++v < I; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function w_() {
    this.size = 0, this.__data__ = {
      hash: new ir(),
      map: new (an || vt)(),
      string: new ir()
    };
  }
  function v_(m) {
    var v = Ti(this, m).delete(m);
    return this.size -= v ? 1 : 0, v;
  }
  function b_(m) {
    return Ti(this, m).get(m);
  }
  function R_(m) {
    return Ti(this, m).has(m);
  }
  function C_(m, v) {
    var I = Ti(this, m), F = I.size;
    return I.set(m, v), this.size += I.size == F ? 0 : 1, this;
  }
  sr.prototype.clear = w_, sr.prototype.delete = v_, sr.prototype.get = b_, sr.prototype.has = R_, sr.prototype.set = C_;
  function Ai(m) {
    var v = -1, I = m == null ? 0 : m.length;
    for (this.__data__ = new sr(); ++v < I; )
      this.add(m[v]);
  }
  function I_(m) {
    return this.__data__.set(m, n), this;
  }
  function A_(m) {
    return this.__data__.has(m);
  }
  Ai.prototype.add = Ai.prototype.push = I_, Ai.prototype.has = A_;
  function Nt(m) {
    var v = this.__data__ = new vt(m);
    this.size = v.size;
  }
  function S_() {
    this.__data__ = new vt(), this.size = 0;
  }
  function T_(m) {
    var v = this.__data__, I = v.delete(m);
    return this.size = v.size, I;
  }
  function P_(m) {
    return this.__data__.get(m);
  }
  function D_(m) {
    return this.__data__.has(m);
  }
  function $_(m, v) {
    var I = this.__data__;
    if (I instanceof vt) {
      var F = I.__data__;
      if (!an || F.length < r - 1)
        return F.push([m, v]), this.size = ++I.size, this;
      I = this.__data__ = new sr(F);
    }
    return I.set(m, v), this.size = I.size, this;
  }
  Nt.prototype.clear = S_, Nt.prototype.delete = T_, Nt.prototype.get = P_, Nt.prototype.has = D_, Nt.prototype.set = $_;
  function O_(m, v) {
    var I = Pi(m), F = !I && Y_(m), re = !I && !F && Fo(m), G = !I && !F && !re && $c(m), de = I || F || re || G, ve = de ? ce(m.length, String) : [], Re = ve.length;
    for (var ue in m)
      ft.call(m, ue) && !(de && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ue == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      re && (ue == "offset" || ue == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      G && (ue == "buffer" || ue == "byteLength" || ue == "byteOffset") || // Skip index properties.
      H_(ue, Re))) && ve.push(ue);
    return ve;
  }
  function Si(m, v) {
    for (var I = m.length; I--; )
      if (Sc(m[I][0], v))
        return I;
    return -1;
  }
  function L_(m, v, I) {
    var F = v(m);
    return Pi(m) ? F : w(F, I(m));
  }
  function cn(m) {
    return m == null ? m === void 0 ? M : b : nr && nr in Object(m) ? q_(m) : z_(m);
  }
  function Rc(m) {
    return un(m) && cn(m) == a;
  }
  function Cc(m, v, I, F, re) {
    return m === v ? !0 : m == null || v == null || !un(m) && !un(v) ? m !== m && v !== v : N_(m, v, I, F, Cc, re);
  }
  function N_(m, v, I, F, re, G) {
    var de = Pi(m), ve = Pi(v), Re = de ? c : Ft(m), ue = ve ? c : Ft(v);
    Re = Re == a ? C : Re, ue = ue == a ? C : ue;
    var ze = Re == C, rt = ue == C, Oe = Re == ue;
    if (Oe && Fo(m)) {
      if (!Fo(v))
        return !1;
      de = !0, ze = !1;
    }
    if (Oe && !ze)
      return G || (G = new Nt()), de || $c(m) ? Ic(m, v, I, F, re, G) : M_(m, v, Re, I, F, re, G);
    if (!(I & i)) {
      var Xe = ze && ft.call(m, "__wrapped__"), Ke = rt && ft.call(v, "__wrapped__");
      if (Xe || Ke) {
        var Ut = Xe ? m.value() : m, bt = Ke ? v.value() : v;
        return G || (G = new Nt()), re(Ut, bt, I, F, G);
      }
    }
    return Oe ? (G || (G = new Nt()), k_(m, v, I, F, re, G)) : !1;
  }
  function F_(m) {
    if (!Dc(m) || W_(m))
      return !1;
    var v = Tc(m) ? r_ : ee;
    return v.test(or(m));
  }
  function U_(m) {
    return un(m) && Pc(m.length) && !!q[cn(m)];
  }
  function B_(m) {
    if (!V_(m))
      return s_(m);
    var v = [];
    for (var I in Object(m))
      ft.call(m, I) && I != "constructor" && v.push(I);
    return v;
  }
  function Ic(m, v, I, F, re, G) {
    var de = I & i, ve = m.length, Re = v.length;
    if (ve != Re && !(de && Re > ve))
      return !1;
    var ue = G.get(m);
    if (ue && G.get(v))
      return ue == v;
    var ze = -1, rt = !0, Oe = I & s ? new Ai() : void 0;
    for (G.set(m, v), G.set(v, m); ++ze < ve; ) {
      var Xe = m[ze], Ke = v[ze];
      if (F)
        var Ut = de ? F(Ke, Xe, ze, v, m, G) : F(Xe, Ke, ze, m, v, G);
      if (Ut !== void 0) {
        if (Ut)
          continue;
        rt = !1;
        break;
      }
      if (Oe) {
        if (!X(v, function(bt, ar) {
          if (!De(Oe, ar) && (Xe === bt || re(Xe, bt, I, F, G)))
            return Oe.push(ar);
        })) {
          rt = !1;
          break;
        }
      } else if (!(Xe === Ke || re(Xe, Ke, I, F, G))) {
        rt = !1;
        break;
      }
    }
    return G.delete(m), G.delete(v), rt;
  }
  function M_(m, v, I, F, re, G, de) {
    switch (I) {
      case J:
        if (m.byteLength != v.byteLength || m.byteOffset != v.byteOffset)
          return !1;
        m = m.buffer, v = v.buffer;
      case W:
        return !(m.byteLength != v.byteLength || !G(new Ec(m), new Ec(v)));
      case l:
      case u:
      case y:
        return Sc(+m, +v);
      case d:
        return m.name == v.name && m.message == v.message;
      case j:
      case K:
        return m == v + "";
      case g:
        var ve = et;
      case Q:
        var Re = F & i;
        if (ve || (ve = tt), m.size != v.size && !Re)
          return !1;
        var ue = de.get(m);
        if (ue)
          return ue == v;
        F |= s, de.set(m, v);
        var ze = Ic(ve(m), ve(v), F, re, G, de);
        return de.delete(m), ze;
      case se:
        if (No)
          return No.call(m) == No.call(v);
    }
    return !1;
  }
  function k_(m, v, I, F, re, G) {
    var de = I & i, ve = Ac(m), Re = ve.length, ue = Ac(v), ze = ue.length;
    if (Re != ze && !de)
      return !1;
    for (var rt = Re; rt--; ) {
      var Oe = ve[rt];
      if (!(de ? Oe in v : ft.call(v, Oe)))
        return !1;
    }
    var Xe = G.get(m);
    if (Xe && G.get(v))
      return Xe == v;
    var Ke = !0;
    G.set(m, v), G.set(v, m);
    for (var Ut = de; ++rt < Re; ) {
      Oe = ve[rt];
      var bt = m[Oe], ar = v[Oe];
      if (F)
        var Oc = de ? F(ar, bt, Oe, v, m, G) : F(bt, ar, Oe, m, v, G);
      if (!(Oc === void 0 ? bt === ar || re(bt, ar, I, F, G) : Oc)) {
        Ke = !1;
        break;
      }
      Ut || (Ut = Oe == "constructor");
    }
    if (Ke && !Ut) {
      var Di = m.constructor, $i = v.constructor;
      Di != $i && "constructor" in m && "constructor" in v && !(typeof Di == "function" && Di instanceof Di && typeof $i == "function" && $i instanceof $i) && (Ke = !1);
    }
    return G.delete(m), G.delete(v), Ke;
  }
  function Ac(m) {
    return L_(m, J_, j_);
  }
  function Ti(m, v) {
    var I = m.__data__;
    return G_(v) ? I[typeof v == "string" ? "string" : "hash"] : I.map;
  }
  function Cr(m, v) {
    var I = $e(m, v);
    return F_(I) ? I : void 0;
  }
  function q_(m) {
    var v = ft.call(m, nr), I = m[nr];
    try {
      m[nr] = void 0;
      var F = !0;
    } catch {
    }
    var re = gc.call(m);
    return F && (v ? m[nr] = I : delete m[nr]), re;
  }
  var j_ = vc ? function(m) {
    return m == null ? [] : (m = Object(m), R(vc(m), function(v) {
      return wc.call(m, v);
    }));
  } : Q_, Ft = cn;
  (Do && Ft(new Do(new ArrayBuffer(1))) != J || an && Ft(new an()) != g || $o && Ft($o.resolve()) != $ || Oo && Ft(new Oo()) != Q || Lo && Ft(new Lo()) != E) && (Ft = function(m) {
    var v = cn(m), I = v == C ? m.constructor : void 0, F = I ? or(I) : "";
    if (F)
      switch (F) {
        case o_:
          return J;
        case a_:
          return g;
        case l_:
          return $;
        case c_:
          return Q;
        case u_:
          return E;
      }
    return v;
  });
  function H_(m, v) {
    return v = v ?? o, !!v && (typeof m == "number" || ge.test(m)) && m > -1 && m % 1 == 0 && m < v;
  }
  function G_(m) {
    var v = typeof m;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? m !== "__proto__" : m === null;
  }
  function W_(m) {
    return !!xc && xc in m;
  }
  function V_(m) {
    var v = m && m.constructor, I = typeof v == "function" && v.prototype || Lt;
    return m === I;
  }
  function z_(m) {
    return gc.call(m);
  }
  function or(m) {
    if (m != null) {
      try {
        return mc.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Sc(m, v) {
    return m === v || m !== m && v !== v;
  }
  var Y_ = Rc(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Rc : function(m) {
    return un(m) && ft.call(m, "callee") && !wc.call(m, "callee");
  }, Pi = Array.isArray;
  function X_(m) {
    return m != null && Pc(m.length) && !Tc(m);
  }
  var Fo = i_ || Z_;
  function K_(m, v) {
    return Cc(m, v);
  }
  function Tc(m) {
    if (!Dc(m))
      return !1;
    var v = cn(m);
    return v == _ || v == x || v == p || v == B;
  }
  function Pc(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= o;
  }
  function Dc(m) {
    var v = typeof m;
    return m != null && (v == "object" || v == "function");
  }
  function un(m) {
    return m != null && typeof m == "object";
  }
  var $c = f ? he(f) : U_;
  function J_(m) {
    return X_(m) ? O_(m) : B_(m);
  }
  function Q_() {
    return [];
  }
  function Z_() {
    return !1;
  }
  e.exports = K_;
})(xs, xs.exports);
var Fb = xs.exports;
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.DownloadedUpdateHelper = void 0;
ei.createTempUpdateFile = qb;
const Ub = Vn, Bb = Zt, Ju = Fb, lr = tr, Cn = oe;
class Mb {
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
    return Cn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ju(this.versionInfo, r) && Ju(this.fileInfo.info, n.info) && await (0, lr.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, o) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, o && await (0, lr.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, lr.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, lr.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, lr.readJson)(n);
    } catch (p) {
      let l = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${p.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Cn.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, lr.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const c = await kb(a);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, a);
  }
  getUpdateInfoFile() {
    return Cn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ei.DownloadedUpdateHelper = Mb;
function kb(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const o = (0, Ub.createHash)(t);
    o.on("error", s).setEncoding(r), (0, Bb.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function qb(e, t, r) {
  let n = 0, i = Cn.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, lr.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = Cn.join(t, `${n++}-${e}`);
    }
  return i;
}
var Js = {}, Ml = {};
Object.defineProperty(Ml, "__esModule", { value: !0 });
Ml.getAppCacheDir = Hb;
const ta = oe, jb = Fs;
function Hb() {
  const e = (0, jb.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ta.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ta.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ta.join(e, ".cache"), t;
}
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.ElectronAppAdapter = void 0;
const Qu = oe, Gb = Ml;
class Wb {
  constructor(t = pr.app) {
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
    return this.isPackaged ? Qu.join(process.resourcesPath, "app-update.yml") : Qu.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Gb.getAppCacheDir)();
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
Js.ElectronAppAdapter = Wb;
var Hh = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = we;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return pr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(s) {
      super(), this.proxyLoginCallback = s, this.cachedSession = null;
    }
    async download(s, o, a) {
      return await a.cancellationToken.createPromise((c, p, l) => {
        const u = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(s, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: o,
          options: a,
          onCancel: l,
          callback: (d) => {
            d == null ? c(o) : p(d);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(s, o) {
      s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const a = pr.net.request({
        ...s,
        session: this.cachedSession
      });
      return a.on("response", o), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(s, o, a, c, p) {
      s.on("redirect", (l, u, d) => {
        s.abort(), c > this.maxRedirects ? a(this.createMaxRedirectError()) : p(t.HttpExecutor.prepareRedirectUrlOptions(d, o));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Hh);
var ti = {}, ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.newBaseUrl = Vb;
ut.newUrlFromBase = zb;
ut.getChannelFilename = Yb;
const Gh = er;
function Vb(e) {
  const t = new Gh.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function zb(e, t, r = !1) {
  const n = new Gh.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Yb(e) {
  return `${e}.yml`;
}
var xe = {}, Xb = "[object Symbol]", Wh = /[\\^$.*+?()[\]{}|]/g, Kb = RegExp(Wh.source), Jb = typeof T == "object" && T && T.Object === Object && T, Qb = typeof self == "object" && self && self.Object === Object && self, Zb = Jb || Qb || Function("return this")(), eR = Object.prototype, tR = eR.toString, Zu = Zb.Symbol, ef = Zu ? Zu.prototype : void 0, tf = ef ? ef.toString : void 0;
function rR(e) {
  if (typeof e == "string")
    return e;
  if (iR(e))
    return tf ? tf.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function nR(e) {
  return !!e && typeof e == "object";
}
function iR(e) {
  return typeof e == "symbol" || nR(e) && tR.call(e) == Xb;
}
function sR(e) {
  return e == null ? "" : rR(e);
}
function oR(e) {
  return e = sR(e), e && Kb.test(e) ? e.replace(Wh, "\\$&") : e;
}
var Vh = oR;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.Provider = void 0;
xe.findFile = fR;
xe.parseUpdateInfo = dR;
xe.getFileList = zh;
xe.resolveFiles = hR;
const Xt = we, aR = Te, lR = er, gs = ut, cR = Vh;
class uR {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, gs.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, gs.newUrlFromBase)(`${t.pathname.replace(new RegExp(cR(n), "g"), r)}.blockmap`, i ? new lR.URL(i) : t), s];
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Xt.configureRequestUrl)(t, n), n;
  }
}
xe.Provider = uR;
function fR(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, Xt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((o) => o.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((o) => [o.url.pathname, o.info.url].some((a) => a.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((o) => !r.some((a) => o.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function dR(e, t, r) {
  if (e == null)
    throw (0, Xt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, aR.load)(e);
  } catch (i) {
    throw (0, Xt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function zh(e) {
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
  throw (0, Xt.newError)(`No files provided: ${(0, Xt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function hR(e, t, r = (n) => n) {
  const i = zh(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Xt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Xt.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, gs.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), s = e.packages, o = s == null ? null : s[process.arch] || s.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, gs.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.GenericProvider = void 0;
const rf = we, ra = ut, na = xe;
class pR extends na.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, ra.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, ra.getChannelFilename)(this.channel), r = (0, ra.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, na.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof rf.HttpError && i.statusCode === 404)
          throw (0, rf.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, na.resolveFiles)(t, this.baseUrl);
  }
}
ti.GenericProvider = pR;
var Qs = {}, Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
Zs.BitbucketProvider = void 0;
const nf = we, ia = ut, sa = xe;
class _R extends sa.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, ia.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new nf.CancellationToken(), r = (0, ia.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, ia.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, sa.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, nf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, sa.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Zs.BitbucketProvider = _R;
var Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.GitHubProvider = Kt.BaseGitHubProvider = void 0;
Kt.computeReleaseNotes = Xh;
const It = we, pt = jh, mR = er, Ur = ut, Za = xe, oa = /\/tag\/(v?[^/]+)$/;
class Yh extends Za.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Ur.newBaseUrl)((0, It.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Ur.newBaseUrl)((0, It.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Kt.BaseGitHubProvider = Yh;
class xR extends Yh {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const o = new It.CancellationToken(), a = await this.httpRequest((0, Ur.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), c = (0, It.parseXml)(a);
    let p = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const y = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = pt.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (y === null)
          l = oa.exec(p.element("link").attribute("href"))[1];
        else
          for (const b of c.getElements("entry")) {
            const C = oa.exec(b.element("link").attribute("href"));
            if (C === null)
              continue;
            const $ = C[1];
            if (!pt.valid($))
              continue;
            const B = ((n = pt.prerelease($)) === null || n === void 0 ? void 0 : n[0]) || null, j = !y || ["alpha", "beta"].includes(y), Q = B !== null && !["alpha", "beta"].includes(String(B));
            if (j && !Q && !(y === "beta" && B === "alpha")) {
              l = $, p = b;
              break;
            }
            if (B && B === y) {
              l = $, p = b;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(o);
        for (const y of c.getElements("entry")) {
          const b = oa.exec(y.element("link").attribute("href"));
          if (b != null && b[1] === l) {
            p = y;
            break;
          }
        }
      }
    } catch (y) {
      throw (0, It.newError)(`Cannot parse releases feed: ${y.stack || y.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, It.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, d = "", _ = "";
    const x = async (y) => {
      d = (0, Ur.getChannelFilename)(y), _ = (0, Ur.newUrlFromBase)(this.getBaseDownloadPath(String(l), d), this.baseUrl);
      const b = this.createRequestOptions(_);
      try {
        return await this.executor.request(b, o);
      } catch (C) {
        throw C instanceof It.HttpError && C.statusCode === 404 ? (0, It.newError)(`Cannot find ${d} in the latest release artifacts (${_}): ${C.stack || C.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : C;
      }
    };
    try {
      let y = this.channel;
      this.updater.allowPrerelease && (!((i = pt.prerelease(l)) === null || i === void 0) && i[0]) && (y = this.getCustomChannelName(String((s = pt.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), u = await x(y);
    } catch (y) {
      if (this.updater.allowPrerelease)
        u = await x(this.getDefaultChannelName());
      else
        throw y;
    }
    const g = (0, Za.parseUpdateInfo)(u, d, _);
    return g.releaseName == null && (g.releaseName = p.elementValueOrEmpty("title")), g.releaseNotes == null && (g.releaseNotes = Xh(this.updater.currentVersion, this.updater.fullChangelog, c, p)), {
      tag: l,
      ...g
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Ur.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new mR.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, It.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Za.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Kt.GitHubProvider = xR;
function sf(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Xh(e, t, r, n) {
  if (!t)
    return sf(n);
  const i = /\/tag\/v?([^/]+)$/;
  let s;
  try {
    s = i.exec(n.element("link").attribute("href"))[1], s = pt.valid(s) ? s : void 0;
  } catch {
  }
  if (s == null)
    return null;
  const o = [];
  for (const a of r.getElements("entry")) {
    let c;
    try {
      const u = i.exec(a.element("link").attribute("href"));
      if (!u)
        continue;
      c = u[1];
    } catch {
      continue;
    }
    if (!pt.valid(c))
      continue;
    const p = pt.gt(c, e.raw), l = pt.lte(c, s);
    p && l && o.push({
      version: c,
      note: sf(a)
    });
  }
  return o.sort((a, c) => pt.rcompare(a.version, c.version));
}
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
eo.GitLabProvider = void 0;
const Ce = we, aa = er, gR = Vh, Wi = ut, la = xe;
class yR extends la.Provider {
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
    this.baseApiUrl = (0, Wi.newBaseUrl)(`https://${s}/api/v4`);
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
    const t = new Ce.CancellationToken(), r = (0, Wi.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), n = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
    let i;
    try {
      i = await this.httpRequest(r, n, t);
    } catch (_) {
      throw (0, Ce.newError)(`Unable to find latest release on GitLab (${r}): ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (!i)
      throw (0, Ce.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let s;
    try {
      s = JSON.parse(i);
    } catch (_) {
      throw (0, Ce.newError)(`Unable to parse latest release response from GitLab (${r}): response was not valid JSON: ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (s.upcoming_release)
      throw (0, Ce.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    const o = s.tag_name;
    let a = null, c = "", p = null;
    const l = async (_) => {
      c = (0, Wi.getChannelFilename)(_);
      const x = s.assets.links.find((b) => b.name === c);
      if (!x)
        throw (0, Ce.newError)(`Cannot find ${c} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      p = new aa.URL(x.direct_asset_url);
      const g = this.setAuthHeaderForToken(this.options.token || null), y = Object.keys(g).length ? g : void 0;
      try {
        const b = await this.httpRequest(p, y, t);
        if (!b)
          throw (0, Ce.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return b;
      } catch (b) {
        throw b instanceof Ce.HttpError && b.statusCode === 404 ? (0, Ce.newError)(`Cannot find ${c} in the latest release artifacts (${p}): ${b.stack || b.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : b;
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
      throw (0, Ce.newError)(`Unable to parse channel data from ${c}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, la.parseUpdateInfo)(a, c, p);
    u.releaseName == null && (u.releaseName = s.name), u.releaseNotes == null && (u.releaseNotes = s.description || null);
    const d = {
      tag: o,
      assets: this.convertAssetsToMap(s.assets),
      ...u
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
        return new aa.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new Ce.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, Wi.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const o = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(s, o, r);
        if (a)
          return JSON.parse(a);
      } catch (o) {
        if (o instanceof Ce.HttpError && o.statusCode === 404)
          continue;
        throw (0, Ce.newError)(`Unable to find release ${i} on GitLab (${s}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Ce.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const c = n.replace(new RegExp(gR(r), "g"), t);
      s = this.findBlockMapInAssets(a, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [o, a] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!a)
        throw (0, Ce.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!o)
        throw (0, Ce.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [o, a];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, la.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((o) => t.assets.has(o)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, Ce.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new aa.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
eo.GitLabProvider = yR;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
to.KeygenProvider = void 0;
const of = we, ca = ut, ua = xe;
class ER extends ua.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, ca.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new of.CancellationToken(), r = (0, ca.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, ca.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, ua.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, of.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, ua.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
to.KeygenProvider = ER;
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.PrivateGitHubProvider = void 0;
const Ar = we, wR = Te, vR = oe, af = er, lf = ut, bR = Kt, RR = xe;
class CR extends bR.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Ar.CancellationToken(), r = (0, lf.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, Ar.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new af.URL(i.url);
    let o;
    try {
      o = (0, wR.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof Ar.HttpError && a.statusCode === 404 ? (0, Ar.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
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
    const i = (0, lf.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      if (r) {
        const o = s.filter((a) => !a.draft);
        return o.find((a) => a.prerelease) || o[0];
      } else
        return s;
    } catch (s) {
      throw (0, Ar.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, RR.getFileList)(t).map((r) => {
      const n = vR.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, Ar.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new af.URL(i.url),
        info: r
      };
    });
  }
}
ro.PrivateGitHubProvider = CR;
Object.defineProperty(Qs, "__esModule", { value: !0 });
Qs.isUrlProbablySupportMultiRangeRequests = Kh;
Qs.createClient = DR;
const Vi = we, IR = Zs, cf = ti, AR = Kt, SR = eo, TR = to, PR = ro;
function Kh(e) {
  return !e.includes("s3.amazonaws.com");
}
function DR(e, t, r) {
  if (typeof e == "string")
    throw (0, Vi.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new AR.GitHubProvider(i, t, r) : new PR.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new IR.BitbucketProvider(e, t, r);
    case "gitlab":
      return new SR.GitLabProvider(e, t, r);
    case "keygen":
      return new TR.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new cf.GenericProvider({
        provider: "generic",
        url: (0, Vi.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new cf.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Kh(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, Vi.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, Vi.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var no = {}, ri = {}, Xr = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.OperationKind = void 0;
wr.computeOperations = $R;
var dr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(dr || (wr.OperationKind = dr = {}));
function $R(e, t, r) {
  const n = ff(e.files), i = ff(t.files);
  let s = null;
  const o = t.files[0], a = [], c = o.name, p = n.get(c);
  if (p == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let u = 0;
  const { checksumToOffset: d, checksumToOldSize: _ } = LR(n.get(c), p.offset, r);
  let x = o.offset;
  for (let g = 0; g < l.checksums.length; x += l.sizes[g], g++) {
    const y = l.sizes[g], b = l.checksums[g];
    let C = d.get(b);
    C != null && _.get(b) !== y && (r.warn(`Checksum ("${b}") matches, but size differs (old: ${_.get(b)}, new: ${y})`), C = void 0), C === void 0 ? (u++, s != null && s.kind === dr.DOWNLOAD && s.end === x ? s.end += y : (s = {
      kind: dr.DOWNLOAD,
      start: x,
      end: x + y
      // oldBlocks: null,
    }, uf(s, a, b, g))) : s != null && s.kind === dr.COPY && s.end === C ? s.end += y : (s = {
      kind: dr.COPY,
      start: C,
      end: C + y
      // oldBlocks: [checksum]
    }, uf(s, a, b, g));
  }
  return u > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${u} changed blocks`), a;
}
const OR = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function uf(e, t, r, n) {
  if (OR && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((o, a) => o < a ? o : a);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${dr[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function LR(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let s = t;
  for (let o = 0; o < e.checksums.length; o++) {
    const a = e.checksums[o], c = e.sizes[o], p = i.get(a);
    if (p === void 0)
      n.set(a, s), i.set(a, c);
    else if (r.debug != null) {
      const l = p === c ? "(same size)" : `(size: ${p}, this size: ${c})`;
      r.debug(`${a} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    s += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function ff(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.DataSplitter = void 0;
Xr.copyData = Jh;
const zi = we, NR = Zt, FR = Wn, UR = wr, df = Buffer.from(`\r
\r
`);
var qt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(qt || (qt = {}));
function Jh(e, t, r, n, i) {
  const s = (0, NR.createReadStream)("", {
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
class BR extends FR.Writable {
  constructor(t, r, n, i, s, o, a, c) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = o, this.grandTotalBytes = a, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = qt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, zi.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === qt.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = qt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === qt.BODY)
          this.readState = qt.INIT;
        else {
          this.partIndex++;
          let o = this.partIndexToTaskIndex.get(this.partIndex);
          if (o == null)
            if (this.isFinished)
              o = this.options.end;
            else
              throw (0, zi.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < o)
            await this.copyExistingData(a, o);
          else if (a > o)
            throw (0, zi.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = qt.HEADER;
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
        if (o.kind !== UR.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Jh(o, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(df, r);
    if (n !== -1)
      return n + df.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, zi.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
Xr.DataSplitter = BR;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.executeTasksUsingMultipleRangeRequests = MR;
io.checkIsRangesSupported = tl;
const el = we, hf = Xr, pf = wr;
function MR(e, t, r, n, i) {
  const s = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = o + 1e3;
    kR(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => s(a), i);
  };
  return s;
}
function kR(e, t, r, n, i) {
  let s = "bytes=", o = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), p = [];
  for (let d = t.start; d < t.end; d++) {
    const _ = t.tasks[d];
    _.kind === pf.OperationKind.DOWNLOAD && (s += `${_.start}-${_.end - 1}, `, c.set(o, d), o++, p.push(_.end - _.start), a += _.end - _.start);
  }
  if (o <= 1) {
    const d = (_) => {
      if (_ >= t.end) {
        n();
        return;
      }
      const x = t.tasks[_++];
      if (x.kind === pf.OperationKind.COPY)
        (0, hf.copyData)(x, r, t.oldFileFd, i, () => d(_));
      else {
        const g = e.createRequestOptions();
        g.headers.Range = `bytes=${x.start}-${x.end - 1}`;
        const y = e.httpExecutor.createRequest(g, (b) => {
          b.on("error", i), tl(b, i) && (b.pipe(r, {
            end: !1
          }), b.once("end", () => d(_)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(y, i), y.end();
      }
    };
    d(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = s.substring(0, s.length - 2);
  const u = e.httpExecutor.createRequest(l, (d) => {
    if (!tl(d, i))
      return;
    const _ = (0, el.safeGetHeader)(d, "content-type"), x = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(_);
    if (x == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${_}"`));
      return;
    }
    const g = new hf.DataSplitter(r, t, c, x[1] || x[2], p, n, a, e.options.onProgress);
    g.on("error", i), d.pipe(g), d.on("end", () => {
      setTimeout(() => {
        u.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(u, i), u.end();
}
function tl(e, t) {
  if (e.statusCode >= 400)
    return t((0, el.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, el.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.ProgressDifferentialDownloadCallbackTransform = void 0;
const qR = Wn;
var Br;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Br || (Br = {}));
class jR extends qR.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Br.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Br.COPY) {
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
    this.operationType = Br.COPY;
  }
  beginRangeDownload() {
    this.operationType = Br.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
so.ProgressDifferentialDownloadCallbackTransform = jR;
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.DifferentialDownloader = void 0;
const hn = we, fa = tr, HR = Zt, GR = Xr, WR = er, Yi = wr, _f = io, VR = so;
class zR {
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
    return (0, hn.configureRequestUrl)(this.options.newUrl, t), (0, hn.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Yi.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, o = 0;
    for (const c of i) {
      const p = c.end - c.start;
      c.kind === Yi.OperationKind.DOWNLOAD ? s += p : o += p;
    }
    const a = this.blockAwareFileInfo.size;
    if (s + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${o}, newSize: ${a}`);
    return n.info(`Full: ${mf(a)}, To download: ${mf(s)} (${Math.round(s / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, fa.close)(i.descriptor).catch((s) => {
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
    const n = await (0, fa.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, fa.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, HR.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, a) => {
      const c = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const b = [];
        let C = 0;
        for (const B of t)
          B.kind === Yi.OperationKind.DOWNLOAD && (b.push(B.end - B.start), C += B.end - B.start);
        const $ = {
          expectedByteCounts: b,
          grandTotal: C
        };
        p = new VR.ProgressDifferentialDownloadCallbackTransform($, this.options.cancellationToken, this.options.onProgress), c.push(p);
      }
      const l = new hn.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), s.on("finish", () => {
        s.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (b) {
            a(b);
            return;
          }
          o(void 0);
        });
      }), c.push(s);
      let u = null;
      for (const b of c)
        b.on("error", a), u == null ? u = b : u = u.pipe(b);
      const d = c[0];
      let _;
      if (this.options.isUseMultipleRangeRequest) {
        _ = (0, _f.executeTasksUsingMultipleRangeRequests)(this, t, d, n, a), _(0);
        return;
      }
      let x = 0, g = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const y = this.createRequestOptions();
      y.redirect = "manual", _ = (b) => {
        var C, $;
        if (b >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const B = t[b++];
        if (B.kind === Yi.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, GR.copyData)(B, d, n, a, () => _(b));
          return;
        }
        const j = `bytes=${B.start}-${B.end - 1}`;
        y.headers.range = j, ($ = (C = this.logger) === null || C === void 0 ? void 0 : C.debug) === null || $ === void 0 || $.call(C, `download range: ${j}`), p && p.beginRangeDownload();
        const Q = this.httpExecutor.createRequest(y, (K) => {
          K.on("error", a), K.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), K.statusCode >= 400 && a((0, hn.createHttpError)(K)), K.pipe(d, {
            end: !1
          }), K.once("end", () => {
            p && p.endRangeDownload(), ++x === 100 ? (x = 0, setTimeout(() => _(b), 1e3)) : _(b);
          });
        });
        Q.on("redirect", (K, se, M) => {
          this.logger.info(`Redirect to ${YR(M)}`), g = M, (0, hn.configureRequestUrl)(new WR.URL(g), y), Q.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(Q, a), Q.end();
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
        (0, _f.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
ri.DifferentialDownloader = zR;
function mf(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function YR(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(no, "__esModule", { value: !0 });
no.GenericDifferentialDownloader = void 0;
const XR = ri;
class KR extends XR.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
no.GenericDifferentialDownloader = KR;
var rr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = we;
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
})(rr);
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.NoOpLogger = zt.AppUpdater = void 0;
const Ue = we, JR = Vn, QR = Fs, ZR = al, nt = tr, eC = Te, da = Ws, Je = oe, cr = jh, xf = ei, tC = Js, gf = Hh, rC = ti, ha = Qs, pa = Dd, nC = no, Sr = rr;
class kl extends ZR.EventEmitter {
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
        throw (0, Ue.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ue.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, gf.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Qh();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new da.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Sr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new da.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new da.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new tC.ElectronAppAdapter(), this.httpExecutor = new gf.ElectronHttpExecutor((s, o) => this.emit("login", s, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, cr.parse)(n);
    if (i == null)
      throw (0, Ue.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = iC(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new rC.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, ha.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, ha.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = kl.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new pr.Notification(n).show();
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
    const i = await this.stagingUserIdPromise.value, o = Ue.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, cr.parse)(t.version);
    if (r == null)
      throw (0, Ue.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, cr.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, cr.gt)(r, n), o = (0, cr.lt)(r, n);
    return s ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, QR.release)();
    if (r)
      try {
        if ((0, cr.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, ha.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new Ue.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ue.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ue.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ue.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Ue.CancellationError))
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
    this.emit(Sr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, eC.load)(await (0, nt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Je.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, nt.readFile)(t, "utf-8");
      if (Ue.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Ue.UUID.v5((0, JR.randomBytes)(4096), Ue.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, nt.outputFile)(t, r);
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
      const i = Je.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new xf.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(Sr.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (C) => this.emit(Sr.DOWNLOAD_PROGRESS, C));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, o = r.packageInfo;
    function a() {
      const C = decodeURIComponent(t.fileInfo.url.pathname);
      return C.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Je.basename(C) : Je.basename(t.fileInfo.info.url);
    }
    const c = await this.getOrCreateDownloadHelper(), p = c.cacheDirForPendingUpdate;
    await (0, nt.mkdir)(p, { recursive: !0 });
    const l = a();
    let u = Je.join(p, l);
    const d = o == null ? null : Je.join(p, `package-${s}${Je.extname(o.path) || ".7z"}`), _ = async (C) => {
      await c.setDownloadedFile(u, d, i, r, l, C), await t.done({
        ...i,
        downloadedFile: u
      });
      const $ = Je.join(p, "current.blockmap");
      return await (0, nt.pathExists)($) && await (0, nt.copyFile)($, Je.join(c.cacheDir, "current.blockmap")), d == null ? [u] : [u, d];
    }, x = this._logger, g = await c.validateDownloadedPath(u, i, r, x);
    if (g != null)
      return u = g, await _(!1);
    const y = async () => (await c.clear().catch(() => {
    }), await (0, nt.unlink)(u).catch(() => {
    })), b = await (0, xf.createTempUpdateFile)(`temp-${l}`, p, x);
    try {
      await t.task(b, n, d, y), await (0, Ue.retry)(() => (0, nt.rename)(b, u), {
        retries: 60,
        interval: 500,
        shouldRetry: (C) => C instanceof Error && /^EBUSY:/.test(C.message) ? !0 : (x.warn(`Cannot rename temp file to final file: ${C.message || C.stack}`), !1)
      });
    } catch (C) {
      throw await y(), C instanceof Ue.CancellationError && (x.info("cancelled"), this.emit("update-cancelled", i)), C;
    }
    return x.info(`New version ${s} has been downloaded to ${u}`), await _(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = r.updateInfoAndProvider.provider, a = await o.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const c = async (x) => {
        const g = await this.httpExecutor.downloadToBuffer(x, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (g == null || g.length === 0)
          throw new Error(`Blockmap "${x.href}" is empty`);
        try {
          return JSON.parse((0, pa.gunzipSync)(g).toString());
        } catch (y) {
          throw new Error(`Cannot parse blockmap "${x.href}", error: ${y}`);
        }
      }, p = {
        newUrl: t.url,
        oldFile: Je.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: o.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Sr.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (x) => this.emit(Sr.DOWNLOAD_PROGRESS, x));
      const l = async (x, g) => {
        const y = Je.join(g, "current.blockmap");
        await (0, nt.outputFile)(y, (0, pa.gzipSync)(JSON.stringify(x)));
      }, u = async (x) => {
        const g = Je.join(x, "current.blockmap");
        try {
          if (await (0, nt.pathExists)(g))
            return JSON.parse((0, pa.gunzipSync)(await (0, nt.readFile)(g)).toString());
        } catch (y) {
          this._logger.warn(`Cannot parse blockmap "${g}", error: ${y}`);
        }
        return null;
      }, d = await c(a[1]);
      await l(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let _ = await u(this.downloadedUpdateHelper.cacheDir);
      return _ == null && (_ = await c(a[0])), await new nC.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(_, d), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
zt.AppUpdater = kl;
function iC(e) {
  const t = (0, cr.prerelease)(e);
  return t != null && t.length > 0;
}
class Qh {
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
zt.NoOpLogger = Qh;
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.BaseUpdater = void 0;
const yf = Ns, _a = oe, sC = zt;
class oC extends sC.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      pr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    return t.split(_a.delimiter).filter((r) => _a.isAbsolute(r)).join(_a.delimiter);
  }
  spawnSyncLog(t, r = [], n = {}) {
    var i;
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const s = { ...process.env, ...n }, o = (0, yf.spawnSync)(t, r, {
      env: { ...s, PATH: this.sanitizeEnvPath((i = s.PATH) !== null && i !== void 0 ? i : "") },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: c, stdout: p, stderr: l } = o;
    if (a != null)
      throw this._logger.error(l), a;
    if (c != null && c !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${c}`);
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
        const a = { stdio: i, env: n, detached: !0 }, c = (0, yf.spawn)(t, r, a);
        c.on("error", (p) => {
          o(p);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (a) {
        o(a);
      }
    });
  }
}
yr.BaseUpdater = oC;
var Un = {}, ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Tr = tr, aC = ri, lC = Dd;
class cC extends aC.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Zh(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await uC(this.options.oldFile), i);
  }
}
ni.FileWithEmbeddedBlockMapDifferentialDownloader = cC;
function Zh(e) {
  return JSON.parse((0, lC.inflateRawSync)(e).toString());
}
async function uC(e) {
  const t = await (0, Tr.open)(e, "r");
  try {
    const r = (await (0, Tr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Tr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Tr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Tr.close)(t), Zh(i);
  } catch (r) {
    throw await (0, Tr.close)(t), r;
  }
}
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.AppImageUpdater = void 0;
const ma = we, Ef = Ns, fC = tr, dC = Zt, Pr = oe, hC = yr, pC = ni, _C = xe, wf = rr;
class mC extends hC.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, _C.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, ma.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, fC.chmod)(i, 493);
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
      return this.listenerCount(wf.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(wf.DOWNLOAD_PROGRESS, a)), await new pC.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, ma.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    if (!Pr.isAbsolute(r) || r.includes("\0"))
      throw (0, ma.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, dC.unlinkSync)(r);
    let n;
    const i = Pr.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Pr.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Pr.join(Pr.dirname(r), Pr.basename(s)), (0, Ef.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Ef.execFileSync)(n, [], { env: o })), !0;
  }
}
Un.AppImageUpdater = mC;
var Bn = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.LinuxUpdater = void 0;
const xC = yr, gC = /^[a-zA-Z0-9_-]+$/;
class yC extends xC.BaseUpdater {
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
    i && (gC.test(i) ? n = [i] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${i}" contains unsafe characters. Ignoring override.`));
    for (const a of n)
      if (this.hasCommand(a))
        return a;
    const s = i ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${i}", ` : "", o = t[0];
    return this._logger.warn(`No package manager found in the list: ${s}${t.join(", ")}. Utilizing default: ${o}`), o;
  }
}
Kr.LinuxUpdater = yC;
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.DebUpdater = void 0;
const EC = xe, vf = rr, wC = Kr;
class ql extends wC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, EC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(vf.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(vf.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
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
      ql.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Bn.DebUpdater = ql;
var Mn = {};
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.PacmanUpdater = void 0;
const bf = rr, vC = xe, bC = Kr;
class jl extends bC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, vC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(bf.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(bf.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      jl.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Mn.PacmanUpdater = jl;
var kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.RpmUpdater = void 0;
const Rf = rr, RC = xe, CC = Kr;
class Hl extends CC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, RC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Rf.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Rf.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      Hl.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
kn.RpmUpdater = Hl;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.MacUpdater = void 0;
const Cf = we, xa = tr, IC = Zt, If = oe, AC = im, SC = zt, TC = xe, Af = Ns, Sf = Vn;
class Gl extends SC.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = pr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
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
      this.debug("Checking for macOS Rosetta environment"), s = (0, Af.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (l) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${l}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const u = (0, Af.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${u}`), o = o || u;
    } catch (l) {
      n.warn(`uname shell command to check for arm64 failed: ${l}`);
    }
    o = o || process.arch === "arm64" || s, r = Gl.filterFilesForArch(r, o);
    const a = (0, TC.findFile)(r, "zip", ["pkg", "dmg"]);
    if (a == null)
      throw (0, Cf.newError)(`ZIP file not provided: ${(0, Cf.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const c = t.updateInfoAndProvider.provider, p = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: a,
      downloadUpdateOptions: t,
      task: async (l, u) => {
        const d = If.join(this.downloadedUpdateHelper.cacheDir, p), _ = () => (0, xa.pathExistsSync)(d) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let x = !0;
        _() && (x = await this.differentialDownloadInstaller(a, t, l, c, p)), x && await this.httpExecutor.download(a.url, l, u);
      },
      done: async (l) => {
        if (!t.disableDifferentialDownload)
          try {
            const u = If.join(this.downloadedUpdateHelper.cacheDir, p);
            await (0, xa.copyFile)(l.downloadedFile, u);
          } catch (u) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${u.message}`);
          }
        return this.updateDownloaded(a, l);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, xa.stat)(i)).size, o = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, AC.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (p) => {
      const l = p.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((p, l) => {
      const u = (0, Sf.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${u}`, "ascii"), _ = `/${(0, Sf.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (x, g) => {
        const y = x.url;
        if (o.info(`${y} requested`), y === "/") {
          if (!x.headers.authorization || x.headers.authorization.indexOf("Basic ") === -1) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), o.warn("No authenthication info");
            return;
          }
          const $ = x.headers.authorization.split(" ")[1], B = Buffer.from($, "base64").toString("ascii"), [j, Q] = B.split(":");
          if (j !== "autoupdater" || Q !== u) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const K = Buffer.from(`{ "url": "${c(this.server)}${_}" }`);
          g.writeHead(200, { "Content-Type": "application/json", "Content-Length": K.length }), g.end(K);
          return;
        }
        if (!y.startsWith(_)) {
          o.warn(`${y} requested, but not supported`), g.writeHead(404), g.end();
          return;
        }
        o.info(`${_} requested by Squirrel.Mac, pipe ${i}`);
        let b = !1;
        g.on("finish", () => {
          b || (this.nativeUpdater.removeListener("error", l), p([]));
        });
        const C = (0, IC.createReadStream)(i);
        C.on("error", ($) => {
          try {
            g.end();
          } catch (B) {
            o.warn(`cannot end response: ${B}`);
          }
          b = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${$}`));
        }), g.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), C.pipe(g);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
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
qn.MacUpdater = Gl;
var jn = {}, Wl = {};
Object.defineProperty(Wl, "__esModule", { value: !0 });
Wl.verifySignature = DC;
const Tf = we, ep = Ns, PC = Fs, Pf = oe;
function tp(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function DC(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, ep.execFile)(...tp(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (o, a, c) => {
      var p;
      try {
        if (o != null || c) {
          ga(r, o, c, i), n(null);
          return;
        }
        const l = $C(a);
        if (l.Status === 0) {
          try {
            const x = Pf.normalize(l.Path), g = Pf.normalize(t);
            if (r.info(`LiteralPath: ${x}. Update Path: ${g}`), x !== g) {
              ga(r, new Error(`LiteralPath of ${x} is different than ${g}`), c, i), n(null);
              return;
            }
          } catch (x) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = x.message) !== null && p !== void 0 ? p : x.stack}`);
          }
          const d = (0, Tf.parseDn)(l.SignerCertificate.Subject);
          let _ = !1;
          for (const x of e) {
            const g = (0, Tf.parseDn)(x);
            if (g.size ? _ = Array.from(g.keys()).every((b) => g.get(b) === d.get(b)) : x === d.get("CN") && (r.warn(`Signature validated using only CN ${x}. Please add your full Distinguished Name (DN) to publisherNames configuration`), _ = !0), _) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (d, _) => d === "RawData" ? void 0 : _, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (l) {
        ga(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function $C(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function ga(e, t, r, n) {
  if (OC()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, ep.execFileSync)(...tp("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function OC() {
  const e = PC.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.NsisUpdater = void 0;
const Xi = we, Df = oe, LC = yr, NC = ni, $f = rr, FC = xe, UC = tr, BC = Wl, Of = er;
class MC extends LC.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, BC.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, FC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, o, a) => {
        const c = n.packageInfo, p = c != null && o != null;
        if (p && t.disableWebInstaller)
          throw (0, Xi.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Xi.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, Xi.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, c, o, r))
          try {
            await this.httpExecutor.download(new Of.URL(c.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (u) {
            try {
              await (0, UC.unlink)(o);
            } catch {
            }
            throw u;
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
      this.spawnLog(Df.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((o) => {
      const a = o.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? s() : a === "ENOENT" ? pr.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new Of.URL(r.path),
        oldFile: Df.join(this.downloadedUpdateHelper.cacheDir, Xi.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount($f.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit($f.DOWNLOAD_PROGRESS, o)), await new NC.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
jn.NsisUpdater = MC;
(function(e) {
  var t = T && T.__createBinding || (Object.create ? function(y, b, C, $) {
    $ === void 0 && ($ = C);
    var B = Object.getOwnPropertyDescriptor(b, C);
    (!B || ("get" in B ? !b.__esModule : B.writable || B.configurable)) && (B = { enumerable: !0, get: function() {
      return b[C];
    } }), Object.defineProperty(y, $, B);
  } : function(y, b, C, $) {
    $ === void 0 && ($ = C), y[$] = b[C];
  }), r = T && T.__exportStar || function(y, b) {
    for (var C in y) C !== "default" && !Object.prototype.hasOwnProperty.call(b, C) && t(b, y, C);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = tr, i = oe;
  var s = yr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var o = zt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var a = xe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = Un;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var p = Bn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var l = Mn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var u = kn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var d = qn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var _ = jn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return _.NsisUpdater;
  } }), r(rr, e);
  let x;
  function g() {
    if (process.platform === "win32")
      x = new jn.NsisUpdater();
    else if (process.platform === "darwin")
      x = new qn.MacUpdater();
    else {
      x = new Un.AppImageUpdater();
      try {
        const y = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(y))
          return x;
        switch ((0, n.readFileSync)(y).toString().trim()) {
          case "deb":
            x = new Bn.DebUpdater();
            break;
          case "rpm":
            x = new kn.RpmUpdater();
            break;
          case "pacman":
            x = new Mn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (y) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", y.message);
      }
    }
    return x;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => x || g()
  });
})(dt);
const Lf = 512 * 1024 * 1024;
function kC(e) {
  const t = (r) => {
    const n = e();
    if (!n || n.isDestroyed() || r !== n.webContents)
      throw new Error("Unauthorized backup request");
    return n;
  };
  Z.handle("backup:save", async (r, n) => {
    const i = t(r.sender);
    if (!(n instanceof Uint8Array) || n.byteLength === 0 || n.byteLength > Lf)
      throw new Error("Backup archive is invalid or exceeds the 512 MB limit");
    const { canceled: s, filePath: o } = await An.showSaveDialog(i, {
      title: "Export Database Backup",
      defaultPath: Be.join(xt.getPath("documents"), `AKDI-MAKINE-Backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`),
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }]
    });
    return s || !o ? { canceled: !0 } : (await cl(o, Buffer.from(n)), { canceled: !1, filePath: o });
  }), Z.handle("backup:open", async (r) => {
    const n = t(r.sender), { canceled: i, filePaths: s } = await An.showOpenDialog(n, {
      title: "Restore Database Backup",
      properties: ["openFile"],
      filters: [{ name: "AKDI MAKINE Backup", extensions: ["zip"] }]
    });
    if (i || s.length === 0) return { canceled: !0 };
    const o = s[0], a = await om(o);
    if (a.size === 0 || a.size > Lf)
      throw new Error("Backup archive is empty or exceeds the 512 MB limit");
    const c = await $d(o);
    return { canceled: !1, bytes: new Uint8Array(c) };
  });
}
const qC = 10 * 1024 * 1024, jC = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]), HC = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function rp() {
  return Be.join(xt.getPath("userData"), "images");
}
function ya(e) {
  if (typeof e != "string" || !HC.test(e))
    throw new Error("Invalid image ID");
  return Be.join(rp(), e);
}
function GC(e, t) {
  return e === "image/jpeg" ? t[0] === 255 && t[1] === 216 && t[2] === 255 : e === "image/png" ? t.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10" : e === "image/gif" ? new TextDecoder().decode(t.subarray(0, 3)) === "GIF" : e === "image/webp" ? new TextDecoder().decode(t.subarray(0, 4)) === "RIFF" && new TextDecoder().decode(t.subarray(8, 12)) === "WEBP" : e === "image/bmp" ? new TextDecoder().decode(t.subarray(0, 2)) === "BM" : !1;
}
function WC(e, t) {
  const r = (i) => {
    const s = e();
    if (!s || s.isDestroyed() || i !== s.webContents)
      throw new Error("Unauthorized image request");
  }, n = (i) => {
    const s = e();
    if ((!s || s.isDestroyed() || i !== s.webContents) && !t(i))
      throw new Error("Unauthorized image request");
  };
  Z.handle("images:save", async (i, s) => {
    if (r(i.sender), !s || typeof s != "object") throw new Error("Invalid image upload");
    const o = s;
    if (typeof o.name != "string" || typeof o.type != "string" || !(o.bytes instanceof Uint8Array))
      throw new Error("Invalid image upload");
    const a = o.bytes, c = Be.basename(o.name).slice(0, 255), p = o.type.toLowerCase();
    if (!c || !jC.has(p) || a.byteLength === 0 || a.byteLength > qC || !GC(p, a))
      throw new Error("Image must be a supported raster image no larger than 10 MB");
    const l = Od();
    return await am(rp(), { recursive: !0 }), await cl(ya(l), Buffer.from(a)), { id: l, name: c, type: p, size: a.byteLength };
  }), Z.handle("images:read", async (i, s) => {
    n(i.sender);
    try {
      const o = await $d(ya(s));
      return { bytes: new Uint8Array(o) };
    } catch (o) {
      if (o.code === "ENOENT") return null;
      throw o;
    }
  }), Z.handle("images:delete", async (i, s) => {
    r(i.sender), await lm(ya(s), { force: !0 });
  });
}
var ne = {}, Vl = {}, ii = {}, rl = { exports: {} }, Ki = { exports: {} }, Ea, Nf;
function np() {
  if (Nf) return Ea;
  Nf = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = o, n.enabled = c, n.humanize = b0(), Object.keys(t).forEach(function(l) {
      n[l] = t[l];
    }), n.instances = [], n.names = [], n.skips = [], n.formatters = {};
    function r(l) {
      for (var u = 0, d = 0; d < l.length; d++)
        u = (u << 5) - u + l.charCodeAt(d), u |= 0;
      return n.colors[Math.abs(u) % n.colors.length];
    }
    n.selectColor = r;
    function n(l) {
      var u;
      function d() {
        if (d.enabled) {
          for (var _ = arguments.length, x = new Array(_), g = 0; g < _; g++)
            x[g] = arguments[g];
          var y = d, b = Number(/* @__PURE__ */ new Date()), C = b - (u || b);
          y.diff = C, y.prev = u, y.curr = b, u = b, x[0] = n.coerce(x[0]), typeof x[0] != "string" && x.unshift("%O");
          var $ = 0;
          x[0] = x[0].replace(/%([a-zA-Z%])/g, function(j, Q) {
            if (j === "%%")
              return j;
            $++;
            var K = n.formatters[Q];
            if (typeof K == "function") {
              var se = x[$];
              j = K.call(y, se), x.splice($, 1), $--;
            }
            return j;
          }), n.formatArgs.call(y, x);
          var B = y.log || n.log;
          B.apply(y, x);
        }
      }
      return d.namespace = l, d.enabled = n.enabled(l), d.useColors = n.useColors(), d.color = r(l), d.destroy = i, d.extend = s, typeof n.init == "function" && n.init(d), n.instances.push(d), d;
    }
    function i() {
      var l = n.instances.indexOf(this);
      return l !== -1 ? (n.instances.splice(l, 1), !0) : !1;
    }
    function s(l, u) {
      return n(this.namespace + (typeof u > "u" ? ":" : u) + l);
    }
    function o(l) {
      n.save(l), n.names = [], n.skips = [];
      var u, d = (typeof l == "string" ? l : "").split(/[\s,]+/), _ = d.length;
      for (u = 0; u < _; u++)
        d[u] && (l = d[u].replace(/\*/g, ".*?"), l[0] === "-" ? n.skips.push(new RegExp("^" + l.substr(1) + "$")) : n.names.push(new RegExp("^" + l + "$")));
      for (u = 0; u < n.instances.length; u++) {
        var x = n.instances[u];
        x.enabled = n.enabled(x.namespace);
      }
    }
    function a() {
      n.enable("");
    }
    function c(l) {
      if (l[l.length - 1] === "*")
        return !0;
      var u, d;
      for (u = 0, d = n.skips.length; u < d; u++)
        if (n.skips[u].test(l))
          return !1;
      for (u = 0, d = n.names.length; u < d; u++)
        if (n.names[u].test(l))
          return !0;
      return !1;
    }
    function p(l) {
      return l instanceof Error ? l.stack || l.message : l;
    }
    return n.enable(n.load()), n;
  }
  return Ea = e, Ea;
}
var Ff;
function VC() {
  return Ff || (Ff = 1, function(e, t) {
    function r(l) {
      return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? r = function(d) {
        return typeof d;
      } : r = function(d) {
        return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
      }, r(l);
    }
    t.log = s, t.formatArgs = i, t.save = o, t.load = a, t.useColors = n, t.storage = c(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function n() {
      return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? !1 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function i(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !!this.useColors) {
        var u = "color: " + this.color;
        l.splice(1, 0, u, "color: inherit");
        var d = 0, _ = 0;
        l[0].replace(/%[a-zA-Z%]/g, function(x) {
          x !== "%%" && (d++, x === "%c" && (_ = d));
        }), l.splice(_, 0, u);
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
    function c() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = np()(t);
    var p = e.exports.formatters;
    p.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Ki, Ki.exports)), Ki.exports;
}
var Ji = { exports: {} }, Uf;
function zC() {
  return Uf || (Uf = 1, function(e, t) {
    var r = ll, n = Ls;
    t.init = u, t.log = c, t.formatArgs = o, t.save = p, t.load = l, t.useColors = s, t.colors = [6, 2, 3, 4, 5, 1];
    try {
      var i = C0();
      i && (i.stderr || i).level >= 2 && (t.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter(function(_) {
      return /^debug_/i.test(_);
    }).reduce(function(_, x) {
      var g = x.substring(6).toLowerCase().replace(/_([a-z])/g, function(b, C) {
        return C.toUpperCase();
      }), y = process.env[x];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), _[g] = y, _;
    }, {});
    function s() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(_) {
      var x = this.namespace, g = this.useColors;
      if (g) {
        var y = this.color, b = "\x1B[3" + (y < 8 ? y : "8;5;" + y), C = "  ".concat(b, ";1m").concat(x, " \x1B[0m");
        _[0] = C + _[0].split(`
`).join(`
` + C), _.push(b + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        _[0] = a() + x + " " + _[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function c() {
      return process.stderr.write(n.format.apply(n, arguments) + `
`);
    }
    function p(_) {
      _ ? process.env.DEBUG = _ : delete process.env.DEBUG;
    }
    function l() {
      return process.env.DEBUG;
    }
    function u(_) {
      _.inspectOpts = {};
      for (var x = Object.keys(t.inspectOpts), g = 0; g < x.length; g++)
        _.inspectOpts[x[g]] = t.inspectOpts[x[g]];
    }
    e.exports = np()(t);
    var d = e.exports.formatters;
    d.o = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts).split(`
`).map(function(x) {
        return x.trim();
      }).join(" ");
    }, d.O = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts);
    };
  }(Ji, Ji.exports)), Ji.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? rl.exports = VC() : rl.exports = zC();
var _e = rl.exports, ie = {}, Jr = {}, ae = {}, ip = {};
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
})(ip);
var sp = {};
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
})(sp);
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(ip), t(sp);
})(ae);
var Ye = {}, YC = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ye, "__esModule", { value: !0 });
const XC = YC(_e);
XC.default("request-body");
class zl {
  constructor(t) {
    if (new.target === zl)
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
Ye.default = zl;
function KC(e) {
  return !!e.isModbusRequestBody;
}
Ye.isModbusRequestBody = KC;
var JC = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const QC = ae, ZC = JC(Ye);
class oo extends ZC.default {
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
      return r > 43 ? null : new oo(r, 1);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (!QC.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    super(t), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._code, 1), t;
  }
}
Jr.default = oo;
function eI(e) {
  return e instanceof oo;
}
Jr.isExceptionRequestBody = eI;
var si = {}, tI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(si, "__esModule", { value: !0 });
const Bf = ae, rI = tI(Ye);
class ao extends rI.default {
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
      if (t.readUInt8(0) !== Bf.FC.READ_COIL)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new ao(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Bf.FC.READ_COIL), this._start = t, this._count = r, this._start > 65535)
      throw new Error("InvalidStartAddress");
    if (this._count > 2e3)
      throw new Error("InvalidQuantity");
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
si.default = ao;
function nI(e) {
  return e instanceof ao;
}
si.isReadCoilsRequestBody = nI;
var oi = {}, iI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Mf = ae, sI = iI(Ye);
class lo extends sI.default {
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
      if (t.readUInt8(0) !== Mf.FC.READ_DISCRETE_INPUT)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new lo(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Mf.FC.READ_DISCRETE_INPUT), t > 65535)
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
oi.default = lo;
function oI(e) {
  return e instanceof lo;
}
oi.isReadDiscreteInputsRequestBody = oI;
var ai = {}, aI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ai, "__esModule", { value: !0 });
const kf = ae, lI = aI(Ye);
class co extends lI.default {
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
      return r !== kf.FC.READ_HOLDING_REGISTERS ? null : new co(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(kf.FC.READ_HOLDING_REGISTERS), t > 65535)
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
ai.default = co;
function cI(e) {
  return e instanceof co;
}
ai.isReadHoldingRegistersRequestBody = cI;
var li = {}, uI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(li, "__esModule", { value: !0 });
const qf = ae, fI = uI(Ye);
class uo extends fI.default {
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
      return r !== qf.FC.READ_INPUT_REGISTERS ? null : new uo(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(qf.FC.READ_INPUT_REGISTERS), t > 65535)
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
li.default = uo;
function dI(e) {
  return e instanceof uo;
}
li.isReadInputRegistersRequestBody = dI;
var ci = {}, ui = {}, hI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ui, "__esModule", { value: !0 });
const jf = ae, pI = hI(Ye);
class fo extends pI.default {
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
      if (t.readUInt8(0) !== jf.FC.WRITE_MULTIPLE_COILS)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3), s = t.readUInt8(5), o = t.slice(6, 6 + s);
      return new fo(n, o, i);
    } catch {
      return null;
    }
  }
  constructor(t, r, n) {
    if (super(jf.FC.WRITE_MULTIPLE_COILS), t > 65535)
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
      const c = Buffer.allocUnsafe(this._numberOfBytes);
      for (let p = 0; p < i; p += 1)
        s += this._values[p] ? Math.pow(2, a) : 0, a = (a + 1) % 8, (a === 0 || p === i - 1) && (c.writeUInt8(s, o), o = o + 1, s = 0);
      this._valuesAsBuffer = c;
    } else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(this._byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._quantity, 3), t.writeUInt8(this._numberOfBytes, 5), this._valuesAsBuffer.copy(t, 6, 0, this._byteCount), t;
  }
}
ui.default = fo;
function _I(e) {
  return e instanceof fo;
}
ui.isWriteMultipleCoilsRequestBody = _I;
var fi = {}, mI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(fi, "__esModule", { value: !0 });
const Hf = ae, xI = mI(Ye);
class ho extends xI.default {
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
      return r !== Hf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new ho(n, s);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Hf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), t > 65535)
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
fi.default = ho;
function gI(e) {
  return e instanceof ho;
}
fi.isWriteMultipleRegistersRequestBody = gI;
var di = {}, yI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(di, "__esModule", { value: !0 });
const Gf = ae, EI = yI(Ye);
class po extends EI.default {
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
      return r !== Gf.FC.WRITE_SINGLE_COIL ? null : new po(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Gf.FC.WRITE_SINGLE_COIL), t > 65535)
      throw new Error("InvalidStartAddress");
    this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value ? 65280 : 0, 3), t;
  }
}
di.default = po;
function wI(e) {
  return e instanceof po;
}
di.isWriteSingleCoilRequestBody = wI;
var hi = {}, vI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(hi, "__esModule", { value: !0 });
const Wf = ae, bI = vI(Ye);
class _o extends bI.default {
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
      return r !== Wf.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new _o(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Wf.FC.WRITE_SINGLE_HOLDING_REGISTER), t > 65535)
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
hi.default = _o;
function RI(e) {
  return e instanceof _o;
}
hi.isWriteSingleRegisterRequestBody = RI;
var Et = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Rt = ae, CI = Et(Jr), II = Et(si), AI = Et(oi), SI = Et(ai), TI = Et(li), PI = Et(ui), DI = Et(fi), $I = Et(di), OI = Et(hi), LI = Et(_e), wa = LI.default("request-factory");
class NI {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      if (wa("fc", r, "payload", t), Rt.isFunctionCode(r))
        switch (r) {
          case Rt.FC.READ_COIL:
            return II.default.fromBuffer(t);
          case Rt.FC.READ_DISCRETE_INPUT:
            return AI.default.fromBuffer(t);
          case Rt.FC.READ_HOLDING_REGISTERS:
            return SI.default.fromBuffer(t);
          case Rt.FC.READ_INPUT_REGISTERS:
            return TI.default.fromBuffer(t);
          case Rt.FC.WRITE_SINGLE_COIL:
            return $I.default.fromBuffer(t);
          case Rt.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return OI.default.fromBuffer(t);
          case Rt.FC.WRITE_MULTIPLE_COILS:
            return PI.default.fromBuffer(t);
          case Rt.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return DI.default.fromBuffer(t);
        }
      if (r <= 43)
        return wa("Illegal Function (fc %d)", r), new CI.default(r, 1);
    } catch (r) {
      return wa("Exception while reading function code", r), null;
    }
  }
}
ci.default = NI;
Object.defineProperty(ie, "__esModule", { value: !0 });
var op = Jr;
ie.ExceptionRequestBody = op.default;
ie.isExceptionRequestBody = op.isExceptionRequestBody;
var ap = si;
ie.ReadCoilsRequestBody = ap.default;
ie.isReadCoilsRequestBody = ap.isReadCoilsRequestBody;
var lp = oi;
ie.ReadDiscreteInputsRequestBody = lp.default;
ie.isReadDiscreteInputsRequestBody = lp.isReadDiscreteInputsRequestBody;
var cp = ai;
ie.ReadHoldingRegistersRequestBody = cp.default;
ie.isReadHoldingRegistersRequestBody = cp.isReadHoldingRegistersRequestBody;
var up = li;
ie.ReadInputRegistersRequestBody = up.default;
ie.isReadInputRegistersRequestBody = up.isReadInputRegistersRequestBody;
var fp = Ye;
ie.ModbusRequestBody = fp.default;
ie.isModbusRequestBody = fp.isModbusRequestBody;
var FI = ci;
ie.RequestFactory = FI.default;
var dp = ui;
ie.WriteMultipleCoilsRequestBody = dp.default;
ie.isWriteMultipleCoilsRequestBody = dp.isWriteMultipleCoilsRequestBody;
var hp = fi;
ie.WriteMultipleRegistersRequestBody = hp.default;
ie.isWriteMultipleRegistersRequestBody = hp.isWriteMultipleRegistersRequestBody;
var pp = di;
ie.WriteSingleCoilRequestBody = pp.default;
ie.isWriteSingleCoilRequestBody = pp.isWriteSingleCoilRequestBody;
var _p = hi;
ie.WriteSingleRegisterRequestBody = _p.default;
ie.isWriteSingleRegisterRequestBody = _p.isWriteSingleRegisterRequestBody;
Object.defineProperty(ii, "__esModule", { value: !0 });
const UI = _e, Ie = UI("modbus-client"), Ct = ie;
class Yl {
  constructor(t) {
    if (new.target === Yl)
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
    Ie("issuing new read coils request");
    let n;
    try {
      n = new Ct.ReadCoilsRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readDiscreteInputs(t, r) {
    Ie("issuing new read discrete inputs request");
    let n;
    try {
      n = new Ct.ReadDiscreteInputsRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readHoldingRegisters(t, r) {
    Ie("issuing new read holding registers request");
    let n;
    try {
      n = new Ct.ReadHoldingRegistersRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readInputRegisters(t, r) {
    Ie("issuing new read input registers request");
    let n;
    try {
      n = new Ct.ReadInputRegistersRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleCoil(t, r) {
    Ie("issuing new write single coil request");
    let n;
    try {
      n = new Ct.WriteSingleCoilRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleRegister(t, r) {
    Ie("issuing new write single register request");
    let n;
    try {
      n = new Ct.WriteSingleRegisterRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeMultipleCoils(t, r, n = 0) {
    Ie("issuing new write multiple coils request");
    let i;
    try {
      r instanceof Buffer ? i = new Ct.WriteMultipleCoilsRequestBody(t, r, n) : i = new Ct.WriteMultipleCoilsRequestBody(t, r);
    } catch (s) {
      return Ie("unknown request error occurred"), Promise.reject(s);
    }
    return this._requestHandler.register(i);
  }
  writeMultipleRegisters(t, r) {
    Ie("issuing new write multiple registers request");
    let n;
    try {
      n = new Ct.WriteMultipleRegistersRequestBody(t, r);
    } catch (i) {
      return Ie("unknown request error occurred"), Promise.reject(i);
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
    Ie("received data"), this._responseHandler.handleData(t);
    do {
      const r = this._responseHandler.shift();
      if (!r)
        return;
      this.unitId === r.unitId && this._requestHandler.handle(r);
    } while (!0);
  }
}
ii.default = Yl;
var Xl = {}, pi = {}, vr = {}, Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
const BI = ae;
class MI {
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
    if (r === !1 && !BI.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    this._fc = t;
  }
}
Qr.default = MI;
var kI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(vr, "__esModule", { value: !0 });
const Vf = ae, qI = kI(Qr);
class Hn extends qI.default {
  get code() {
    return this._code;
  }
  get message() {
    return Vf.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return !0;
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0) - 128, n = t.readUInt8(1);
    if (!Vf.isFunctionCode(r))
      throw Error("InvalidFunctionCode");
    return new Hn(r, n);
  }
  static fromRequest(t) {
    return new Hn(t.fc, t.code);
  }
  constructor(t, r) {
    super(t, !0), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc + 128, 0), t.writeUInt8(this._code, 1), t;
  }
}
vr.default = Hn;
function jI(e) {
  return e instanceof Hn;
}
vr.isExceptionResponseBody = jI;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
class HI {
  constructor({ err: t, message: r, response: n, request: i }) {
    this.err = t, this.message = r, this.request = i, this.response = n;
  }
}
$t.UserRequestError = HI;
function mp(e) {
  return e instanceof mp ? !0 : !(typeof e != "object" || e.err === void 0 || typeof e.err != "string" || e.message === void 0 || typeof e.message != "string");
}
$t.isUserRequestError = mp;
var _i = {}, mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
class GI {
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
mo.UserRequestMetrics = GI;
Object.defineProperty(_i, "__esModule", { value: !0 });
const WI = $t, VI = mo, zI = _e, zf = zI("user-request");
class YI {
  constructor(t, r = 5e3) {
    zf("creating new user request with timeout", r), this._request = t, this._timeout = r, this._metrics = new VI.UserRequestMetrics(), this._promise = new Promise((n, i) => {
      this._resolve = n, this._reject = i;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(t) {
    this._metrics.startedAt = /* @__PURE__ */ new Date(), this._timer = setTimeout(() => {
      this._reject(new WI.UserRequestError({
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
    return this._metrics.receivedAt = /* @__PURE__ */ new Date(), zf("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime), this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: t
    });
  }
  get reject() {
    return this._reject;
  }
}
_i.default = YI;
var xp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(pi, "__esModule", { value: !0 });
const Yf = "OutOfSync", Xf = "Offline", XI = "ModbusException", KI = "ManuallyCleared", JI = _e, Qe = JI("client-request-handler"), QI = xp(vr), Dr = $t, ZI = xp(_i);
class Kl {
  constructor(t, r) {
    if (new.target === Kl)
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
    const r = new ZI.default(t, this._timeout);
    return this._requests.push(r), this._flush(), r.promise;
  }
  handle(t) {
    if (Qe("incoming response"), !t) {
      Qe("well, sorry I was wrong, no response at all");
      return;
    }
    const r = this._currentRequest;
    if (!r) {
      Qe("no current request, no idea where this came from");
      return;
    }
    const n = r.request;
    if (t.body.isException === !1 && t.body.fc !== n.body.fc) {
      Qe("something is weird, request fc and response fc do not match."), r.reject(new Dr.UserRequestError({
        err: Yf,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.body instanceof QI.default) {
      Qe("response is a exception"), r.reject(new Dr.UserRequestError({
        err: XI,
        message: "A Modbus Exception Occurred - See Response Body",
        request: n,
        response: t
      })), this._clearCurrentRequest(), this._flush();
      return;
    }
    Qe("resolving request"), r.resolve(t), this._clearCurrentRequest(), this._flush();
  }
  manuallyRejectCurrentRequest() {
    this._currentRequest && (this._currentRequest.reject(new Dr.UserRequestError({
      err: KI,
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
      t && t.reject(new Dr.UserRequestError({
        err: Yf,
        message: "rejecting because of earlier OutOfSync error",
        request: t.request
      }));
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline", this._currentRequest && this._currentRequest.reject(new Dr.UserRequestError({
      err: Xf,
      message: "connection to modbus server closed",
      request: this._currentRequest.request
    })), this._clearAllRequests();
  }
  _flush() {
    if (Qe("flushing"), this._currentRequest !== null) {
      Qe("executing another request, come back later");
      return;
    }
    if (this._requests.length === 0) {
      Qe("no request to be executed");
      return;
    }
    if (this._currentRequest = this._requests.shift(), this._state === "offline") {
      Qe("rejecting request immediatly, client offline"), this._currentRequest && this._currentRequest.reject(new Dr.UserRequestError({
        err: Xf,
        message: "no connection to modbus server",
        request: this._currentRequest.request
      })), this._clearCurrentRequest(), setTimeout(this._flush.bind(this), 0);
      return;
    }
    const t = this._currentRequest && this._currentRequest.createPayload();
    Qe("flushing new request", t), this._currentRequest && this._currentRequest.start(() => {
      this._clearCurrentRequest(), this._flush();
    }), this._socket.write(t, (r) => {
      Qe("request fully flushed, ( error:", r, ")");
    });
  }
}
pi.default = Kl;
var mi = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
class gp {
}
gp.fromBuffer = (e) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
Zr.default = gp;
function eA(e) {
  return e.body !== void 0;
}
Zr.isModbusRequest = eA;
var yp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(mi, "__esModule", { value: !0 });
const tA = _e, Qi = tA("tcp-request"), rA = yp(Zr), nA = yp(ci);
class Jl extends rA.default {
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
        return Qi("no enough data in the buffer yet"), null;
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      Qi("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), Qi("buffer", t);
      const o = nA.default.fromBuffer(t.slice(7, 6 + i));
      return o ? new Jl(r, n, i, s, o) : null;
    } catch (r) {
      return Qi("not enough data to create a tcp request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload(), r = Buffer.alloc(7 + this._body.byteCount);
    return r.writeUInt16BE(this._id, 0), r.writeUInt16BE(0, 2), r.writeUInt16BE(this._body.byteCount + 1, 4), r.writeUInt8(this._unitId, 6), t.copy(r, 7), r;
  }
}
mi.default = Jl;
var Ep = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Xl, "__esModule", { value: !0 });
const iA = _e, Zi = iA("tcp-client-request-handler"), sA = Ep(pi), oA = Ep(mi), Kf = $t, aA = "OutOfSync", lA = "Protocol";
class cA extends sA.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._requestId = 0, this._unitId = r, this._requests = [], this._currentRequest = null, this._socket.on("connect", this._onConnect.bind(this)), this._socket.on("close", this._onClose.bind(this));
  }
  register(t) {
    this._requestId = (this._requestId + 1) % 65535, Zi("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", t.byteCount);
    const r = new oA.default(this._requestId, 0, t.byteCount + 1, this._unitId, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (!t)
      return;
    const r = this._currentRequest;
    if (!r) {
      Zi("something is strange, received a respone without a request");
      return;
    }
    const n = r.request;
    if (t.id !== n.id) {
      Zi("something weird is going on, response transition id does not equal request transition id", t.id, n.id), r.reject(new Kf.UserRequestError({
        err: aA,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.protocol !== 0) {
      Zi("server responds with wrong protocol version"), r.reject(new Kf.UserRequestError({
        err: lA,
        message: "Unknown protocol version " + t.protocol,
        request: n
      })), this._clearAllRequests();
      return;
    }
    super.handle(t);
  }
}
Xl.default = cA;
var Ql = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
class uA {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
xi.default = uA;
var gi = {}, yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
class fA {
  get body() {
    return this._body;
  }
  static fromRequest(t, r) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
yi.default = fA;
var Ei = {}, xo = {};
const dA = _e, Jf = dA("buffer-utils");
class hA {
  static bufferShift(t, r, n) {
    t = t - 1;
    const i = t % 8, s = Math.floor(t / 8), a = Math.floor(r / 8) - s + 1, c = Buffer.allocUnsafe(a);
    c[0] = n[0] << i, Jf("buffer[0] = %s ( %s << %d )", c[0].toString(2), n[0].toString(2), i);
    const p = Buffer.concat([n, Buffer.alloc(1)], n.length + 1);
    for (let l = 1; l < a; l++)
      c[l] = (p[l] << i) + (p[l - 1] >> 8 - i), Jf("buffer[%d] = %s ( %s << %d + %s >> %d)", l, c[l].toString(2), p[l].toString(2), i, p[l - 1].toString(2), 8 - t);
    return c;
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
var Zl = hA, en = {}, pA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(en, "__esModule", { value: !0 });
const _A = pA(Qr);
class mA extends _A.default {
  constructor(t) {
    super(t);
  }
  get fc() {
    return this._fc;
  }
}
en.default = mA;
var wp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(xo, "__esModule", { value: !0 });
const xA = _e, gA = xA("read-coils-response"), yA = wp(Zl), Qf = ae, EA = wp(en), { bufferToArrayStatus: Zf, arrayStatusToBuffer: wA } = yA.default;
class ys extends EA.default {
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
    const n = Zf(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new ys(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== Qf.FC.READ_COIL ? null : new ys(i, n);
    } catch {
      return gA("no valid read coils response body in the buffer yet"), null;
    }
  }
  constructor(t, r) {
    if (super(Qf.FC.READ_COIL), this._coils = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = wA(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = Zf(t);
    else
      throw new Error("InvalidCoilsInput");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
xo.default = ys;
var go = {}, vp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(go, "__esModule", { value: !0 });
const vA = vp(Zl), ed = ae, bA = vp(en), { bufferToArrayStatus: td, arrayStatusToBuffer: RA } = vA.default;
class Es extends bA.default {
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
    const n = td(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new Es(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== ed.FC.READ_DISCRETE_INPUT ? null : new Es(i, n);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(ed.FC.READ_DISCRETE_INPUT), this._discrete = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = RA(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = td(t);
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
go.default = Es;
var yo = {}, CA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(yo, "__esModule", { value: !0 });
const IA = _e, AA = IA("ReadHoldingRegistersResponseBody"), rd = ae, SA = CA(en);
class ws extends SA.default {
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
    return new ws(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== rd.FC.READ_HOLDING_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new ws(n, s, i);
  }
  constructor(t, r, n) {
    if (super(rd.FC.READ_HOLDING_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, AA("ReadHoldingRegistersResponseBody values", r), r instanceof Array)
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
yo.default = ws;
var Eo = {}, TA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const nd = ae, PA = TA(en);
class vs extends PA.default {
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
    return new vs(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== nd.FC.READ_INPUT_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new vs(n, s, i);
  }
  constructor(t, r, n) {
    if (super(nd.FC.READ_INPUT_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, r instanceof Array)
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
Eo.default = vs;
var wo = {}, tn = {}, DA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(tn, "__esModule", { value: !0 });
const $A = DA(Qr);
class OA extends $A.default {
}
tn.default = OA;
var LA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(wo, "__esModule", { value: !0 });
const id = ae, NA = LA(tn);
class bs extends NA.default {
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
    return new bs(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== id.FC.WRITE_MULTIPLE_COILS ? null : new bs(n, i);
  }
  constructor(t, r) {
    super(id.FC.WRITE_MULTIPLE_COILS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
wo.default = bs;
var vo = {}, FA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(vo, "__esModule", { value: !0 });
const sd = ae, UA = FA(tn);
class Rs extends UA.default {
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
    return new Rs(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== sd.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new Rs(n, i);
  }
  constructor(t, r) {
    super(sd.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
vo.default = Rs;
var bo = {}, BA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(bo, "__esModule", { value: !0 });
const od = ae, MA = BA(tn);
class Cs extends MA.default {
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
    return new Cs(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3) === 65280;
    return r !== od.FC.WRITE_SINGLE_COIL ? null : new Cs(n, i);
  }
  constructor(t, r) {
    super(od.FC.WRITE_SINGLE_COIL), this._address = t, this._value = r === 65280 ? 65280 : 0;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
bo.default = Cs;
var Ro = {}, kA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const ad = ae, qA = kA(tn);
class Is extends qA.default {
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
    return new Is(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== ad.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new Is(n, i);
  }
  constructor(t, r) {
    super(ad.FC.WRITE_SINGLE_HOLDING_REGISTER), this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
Ro.default = Is;
var Ot = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const jA = _e, va = jA("response-factory"), kt = ae, HA = Ot(vr), GA = Ot(xo), WA = Ot(go), VA = Ot(yo), zA = Ot(Eo), YA = Ot(wo), XA = Ot(vo), KA = Ot(bo), JA = Ot(Ro);
class QA {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      return va("fc", r, "payload", t), r > 128 ? HA.default.fromBuffer(t) : r === kt.FC.READ_COIL ? GA.default.fromBuffer(t) : r === kt.FC.READ_DISCRETE_INPUT ? WA.default.fromBuffer(t) : r === kt.FC.READ_HOLDING_REGISTERS ? VA.default.fromBuffer(t) : r === kt.FC.READ_INPUT_REGISTERS ? zA.default.fromBuffer(t) : r === kt.FC.WRITE_SINGLE_COIL ? KA.default.fromBuffer(t) : r === kt.FC.WRITE_SINGLE_HOLDING_REGISTER ? JA.default.fromBuffer(t) : r === kt.FC.WRITE_MULTIPLE_COILS ? YA.default.fromBuffer(t) : r === kt.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? XA.default.fromBuffer(t) : null;
    } catch (r) {
      return va("when NoSuchIndex Exception, the buffer does not contain a complete message"), va(r), null;
    }
  }
}
Ei.default = QA;
var bp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(gi, "__esModule", { value: !0 });
const ZA = _e, pn = ZA("tcp-response"), eS = bp(yi), tS = bp(Ei);
class As extends eS.default {
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
    return new As(t.id, t.protocol, r.byteCount + 1, t.unitId, r);
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      pn("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), pn("buffer", t);
      const o = tS.default.fromBuffer(t.slice(7, 7 + i - 1));
      return o ? (pn("buffer contains a valid response body"), new As(r, n, i, s, o)) : (pn("not enough data for a response body"), null);
    } catch {
      return pn("not enough data available"), null;
    }
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt16BE(this._id, 0), t.writeUInt16BE(this._protocol, 2), t.writeUInt16BE(this._bodyLength, 4), t.writeUInt8(this._unitId, 6), this._body.createPayload().copy(t, 7), t;
  }
}
gi.default = As;
var Rp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ql, "__esModule", { value: !0 });
const rS = _e, _n = rS("tcp-response-handler"), nS = Rp(xi), iS = Rp(gi);
class sS extends nS.default {
  constructor() {
    super(), this._buffer = Buffer.alloc(0), this._messages = [];
  }
  handleData(t) {
    _n("receiving new data", t), this._buffer = Buffer.concat([this._buffer, t]), _n("buffer", this._buffer);
    do {
      const r = iS.default.fromBuffer(this._buffer);
      if (!r) {
        _n("not enough data available to parse");
        return;
      }
      _n("response id", r.id, "protocol", r.protocol, "length", r.bodyLength, "unit", r.unitId), _n("reset buffer from", this._buffer.length, "to", this._buffer.length - r.byteCount), this._messages.push(r), this._buffer = this._buffer.slice(r.byteCount);
    } while (!0);
  }
}
Ql.default = sS;
var ec = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Vl, "__esModule", { value: !0 });
const oS = ec(ii), aS = ec(Xl), lS = ec(Ql);
class cS extends oS.default {
  constructor(t, r = 1, n = 5e3) {
    super(t), this._requestHandler = new aS.default(t, r, n), this._responseHandler = new lS.default(), this._unitId = r, this._timeout = n;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
Vl.default = cS;
var tc = {}, rc = {}, es = {}, ld;
function wt() {
  return ld || (ld = 1, Object.defineProperty(es, "__esModule", {
    value: !0
  }), es.default = function(e, t) {
    var r = function(i, s) {
      return t(i, s) >>> 0;
    };
    return r.signed = t, r.unsigned = r, r.model = e, r;
  }), es;
}
var ba, cd;
function uS() {
  if (cd) return ba;
  cd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return ba = (0, r.default)("crc1", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = ~~s, a = 0, c = 0; c < i.length; c++) {
      var p = i[c];
      a += p;
    }
    return o += a % 256, o % 256;
  }), ba;
}
var Ra, ud;
function fS() {
  if (ud) return Ra;
  ud = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Ra = (0, r.default)("crc-8", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), Ra;
}
var Ca, fd;
function dS() {
  if (fd) return Ca;
  fd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255, 70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Ca = (0, r.default)("dallas-1-wire", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), Ca;
}
var Ia, dd;
function hS() {
  if (dd) return Ia;
  dd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Ia = (0, r.default)("crc-16", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), Ia;
}
var Aa, hd;
function pS() {
  if (hd) return Aa;
  hd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Aa = (0, r.default)("ccitt", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a >> 8 ^ p) & 255] ^ a << 8) & 65535;
    }
    return a;
  }), Aa;
}
var Sa, pd;
function _S() {
  if (pd) return Sa;
  pd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Sa = (0, r.default)("crc-16-modbus", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), Sa;
}
var Ta, _d;
function mS() {
  if (_d) return Ta;
  _d = 1;
  var e = gt, t = wt(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return Ta = (0, r.default)("xmodem", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = typeof s < "u" ? ~~s : 0, a = 0; a < i.length; a++) {
      var c = i[a], p = o >>> 8 & 255;
      p ^= c & 255, p ^= p >>> 4, o = o << 8 & 65535, o ^= p, p = p << 5 & 65535, o ^= p, p = p << 7 & 65535, o ^= p;
    }
    return o;
  }), Ta;
}
var Pa, md;
function xS() {
  if (md) return Pa;
  md = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Pa = (0, r.default)("kermit", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 0, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), Pa;
}
var Da, xd;
function gS() {
  if (xd) return Da;
  xd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Da = (0, r.default)("crc-24", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 11994318, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a >> 16 ^ p) & 255] ^ a << 8) & 16777215;
    }
    return a;
  }), Da;
}
var $a, gd;
function yS() {
  if (gd) return $a;
  gd = 1;
  var e = gt, t = wt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), $a = (0, r.default)("crc-32", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = o === 0 ? 0 : ~~o ^ -1, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] ^ a >>> 8;
    }
    return a ^ -1;
  }), $a;
}
var Oa, yd;
function nc() {
  return yd || (yd = 1, Oa = {
    crc1: uS(),
    crc8: fS(),
    crc81wire: dS(),
    crc16: hS(),
    crc16ccitt: pS(),
    crc16modbus: _S(),
    crc16xmodem: mS(),
    crc16kermit: xS(),
    crc24: gS(),
    crc32: yS()
  }), Oa;
}
var rn = {}, Cp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(rn, "__esModule", { value: !0 });
const ES = _e, ts = ES("rtu-request"), Ed = nc(), wS = Cp(Zr), vS = Cp(ci);
class ic extends wS.default {
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
        return ts("not enough data in the buffer yet"), null;
      const r = t.readUInt8(0);
      ts(`rtu header complete, address, ${r}`), ts("buffer", t);
      const n = vS.default.fromBuffer(t.slice(1));
      if (!n)
        return null;
      const i = 1 + n.byteCount, s = Ed.crc16modbus(t.slice(0, i)), o = t.readUInt16LE(i), a = s !== o;
      return new ic(r, n, a);
    } catch (r) {
      return ts("not enough data to create a rtu request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload();
    this._crc = Ed.crc16modbus(Buffer.concat([Buffer.from([this._address]), t]));
    const r = Buffer.alloc(2);
    r.writeUInt16LE(this._crc, 0);
    const n = Buffer.from([this._address]);
    return Buffer.concat([n, t, r]);
  }
}
rn.default = ic;
var sc = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(rc, "__esModule", { value: !0 });
const bS = _e, mn = bS("rtu-client-request-handler"), RS = sc(nc()), CS = sc(pi), IS = sc(rn), AS = $t;
class SS extends CS.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._address = r, this._requests = [], this._currentRequest = null, this._socket.on("open", this._onConnect.bind(this)), this._socket.isOpen && this._onConnect();
  }
  register(t) {
    mn("registrating new request");
    const r = new IS.default(this._address, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (mn("new response coming in"), !t)
      return;
    const r = this._currentRequest;
    if (!r) {
      mn("something is strange, received a respone without a request");
      return;
    }
    const n = Buffer.concat([Buffer.from([t.address]), t.body.createPayload()]);
    mn("create crc from response", n);
    const i = RS.default.crc16modbus(n);
    if (t.crc !== i) {
      mn("CRC does not match", t.crc, "!==", i), r.reject(new AS.UserRequestError({
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
rc.default = SS;
var oc = {}, wi = {}, Ip = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(wi, "__esModule", { value: !0 });
const TS = _e, wd = TS("rtu-response"), PS = nc(), DS = Ip(yi), $S = Ip(Ei);
class Ss extends DS.default {
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
    return new Ss(t.address, void 0, r);
  }
  static fromBuffer(t) {
    if (t.length < 1)
      return null;
    const r = t.readUInt8(0);
    wd("address", r, "buffer", t);
    const n = $S.default.fromBuffer(t.slice(1));
    if (!n)
      return null;
    let i;
    try {
      i = t.readUInt16LE(1 + n.byteCount);
    } catch {
      return wd("If NoSuchIndexException, it is probably serial and not all data has arrived"), null;
    }
    return new Ss(r, i, n);
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._address, 0), this._body.createPayload().copy(t, 1), this._crc = PS.crc16modbus(t.slice(0, this.byteCount - 2)), t.writeUInt16LE(this._crc, this.byteCount - 2), t;
  }
}
wi.default = Ss;
var Ap = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(oc, "__esModule", { value: !0 });
const OS = _e, xn = OS("rtu-response-handler"), LS = Ap(xi), NS = Ap(wi);
class FS extends LS.default {
  constructor() {
    super(), this._messages = [];
  }
  handleData(t) {
    xn("receiving new data"), this._buffer = Buffer.concat([this._buffer, t]), xn("buffer", this._buffer);
    do {
      const r = NS.default.fromBuffer(this._buffer);
      if (!r) {
        xn("not enough data available to parse");
        return;
      }
      xn("crc", r.crc), xn("reset buffer from", this._buffer.length, "to", this._buffer.length - r.byteCount), this._buffer = this._buffer.slice(r.byteCount), this._messages.push(r);
    } while (!0);
  }
  shift() {
    return this._messages.shift();
  }
}
oc.default = FS;
var ac = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(tc, "__esModule", { value: !0 });
const US = ac(ii), BS = ac(rc), MS = ac(oc);
class kS extends US.default {
  constructor(t, r, n = 5e3) {
    super(t), this._requestHandler = new BS.default(t, r, n), this._responseHandler = new MS.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
tc.default = kS;
var lc = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const qS = al, vd = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class jS extends qS.EventEmitter {
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
  constructor(t = vd) {
    super(), this._options = Object.assign({}, vd, t);
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
Co.default = jS;
var Io = {}, rs = {}, bd;
function HS() {
  if (bd) return rs;
  bd = 1;
  var e = T && T.__importDefault || function(s) {
    return s && s.__esModule ? s : { default: s };
  };
  Object.defineProperty(rs, "__esModule", { value: !0 });
  const t = e(rn), n = _e("modbus-server-request-handler");
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
          const c = this._buffer.slice(0, a.byteCount).toString("hex");
          n(`request message was corrupt: ${c}`);
        } else
          this._requests.unshift(a);
        this._buffer = this._buffer.slice(a.byteCount);
      } while (!0);
    }
  }
  return rs.default = i, rs;
}
var ns = {}, Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
var Sp = vr;
Ge.ExceptionResponseBody = Sp.default;
Ge.isExceptionResponseBody = Sp.isExceptionResponseBody;
var GS = xo;
Ge.ReadCoilsResponseBody = GS.default;
var WS = go;
Ge.ReadDiscreteInputsResponseBody = WS.default;
var VS = yo;
Ge.ReadHoldingRegistersResponseBody = VS.default;
var zS = Eo;
Ge.ReadInputRegistersResponseBody = zS.default;
var YS = Qr;
Ge.ModbusResponseBody = YS.default;
var XS = Ei;
Ge.ResponseFactory = XS.default;
var KS = wo;
Ge.WriteMultipleCoilsResponseBody = KS.default;
var JS = vo;
Ge.WriteMultipleRegistersResponseBody = JS.default;
var QS = bo;
Ge.WriteSingleCoilResponseBody = QS.default;
var ZS = Ro;
Ge.WriteSingleRegisterResponseBody = ZS.default;
var Rd;
function eT() {
  if (Rd) return ns;
  Rd = 1;
  var e = T && T.__importDefault || function(l) {
    return l && l.__esModule ? l : { default: l };
  };
  Object.defineProperty(ns, "__esModule", { value: !0 });
  const t = Ge, r = ie, n = e(Zl), i = ae, { bufferToArrayStatus: s, arrayStatusToBuffer: o } = n.default, c = _e("modbus tcp response handler");
  class p {
    constructor(u, d) {
      this._server = u, this._fromRequest = d;
    }
    handle(u, d) {
      if (!u)
        return null;
      if (r.isExceptionRequestBody(u.body)) {
        const x = t.ExceptionResponseBody.fromRequest(u.body), g = this._fromRequest(u, x);
        return d(g.createPayload()), g;
      }
      const _ = u.body.fc;
      if (i.isFunctionCode(_))
        switch (_) {
          case i.FC.READ_COIL:
            return this._handleReadCoil(u, d);
          case i.FC.READ_DISCRETE_INPUT:
            return this._handleDiscreteInput(u, d);
          case i.FC.READ_HOLDING_REGISTERS:
            return this._handleReadHoldingRegisters(u, d);
          case i.FC.READ_INPUT_REGISTERS:
            return this._handleReadInputRegisters(u, d);
          case i.FC.WRITE_SINGLE_COIL:
            return this._handleWriteSingleCoil(u, d);
          case i.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return this._handleWriteSingleHoldingRegister(u, d);
          case i.FC.WRITE_MULTIPLE_COILS:
            return this._handleWriteMultipleCoils(u, d);
          case i.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return this._handleWriteMultipleHoldingRegisters(u, d);
        }
    }
    _handleReadCoil(u, d) {
      if (!r.isReadCoilsRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected ReadCoilsRequestBody but received ${u.body.name}`);
      if (!this._server.coils) {
        c("no coils buffer on server, trying readCoils handler"), this._server.emit("readCoils", u, d);
        return;
      }
      this._server.emit("preReadCoils", u, d);
      const _ = t.ReadCoilsResponseBody.fromRequest(u.body, this._server.coils), x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postReadCoils", u, d), x;
    }
    _handleDiscreteInput(u, d) {
      if (!r.isReadDiscreteInputsRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${u.body.name}`);
      if (!this._server.discrete) {
        c("no discrete input buffer on server, trying readDiscreteInputs handler"), this._server.emit("readDiscreteInputs", u, d);
        return;
      }
      this._server.emit("preReadDiscreteInputs", u, d);
      const _ = t.ReadDiscreteInputsResponseBody.fromRequest(u.body, this._server.discrete), x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postReadDiscreteInputs", u, d), x;
    }
    _handleReadHoldingRegisters(u, d) {
      if (!r.isReadHoldingRegistersRequestBody(u.body)) {
        const y = `InvalidRequestClass - Expected ReadHoldingRegistersRequestBody but received ${u.body.name}`;
        throw new Error(y);
      }
      if (!this._server.holding) {
        c("no holding register buffer on server, trying readHoldingRegisters handler"), this._server.emit("readHoldingRegisters", u, d);
        return;
      }
      this._server.emit("preReadHoldingRegisters", u, d);
      const _ = t.ReadHoldingRegistersResponseBody.fromRequest(u.body, this._server.holding), x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postReadHoldingRegisters", u, d), x;
    }
    _handleReadInputRegisters(u, d) {
      if (!r.isReadInputRegistersRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${u.body.name}`);
      if (!this._server.input) {
        c("no input register buffer on server, trying readInputRegisters handler"), this._server.emit("readInputRegisters", u, d);
        return;
      }
      this._server.emit("preReadInputRegisters", u, d);
      const _ = t.ReadInputRegistersResponseBody.fromRequest(u.body, this._server.input), x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postReadInputRegisters", u, d), x;
    }
    _handleWriteSingleCoil(u, d) {
      if (!r.isWriteSingleCoilRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${u.body.name}`);
      if (!this._server.coils) {
        c("no coils buffer on server, trying writeSingleCoil handler"), this._server.emit("writeSingleCoil", u, d);
        return;
      }
      this._server.emit("preWriteSingleCoil", u, d);
      const _ = t.WriteSingleCoilResponseBody.fromRequest(u.body), x = u.body.address;
      c("Writing value %d to address %d", u.body.value, x);
      const g = this._server.coils.readUInt8(Math.floor(x / 8));
      let y;
      if (u.body.value !== 65280 && u.body.value !== 0) {
        c("illegal data value");
        const $ = new t.ExceptionResponseBody(u.body.fc, 3), B = this._fromRequest(u, $);
        return d(B.createPayload()), B;
      }
      if (u.body.value === 65280 ? y = g | Math.pow(2, x % 8) : y = g & ~Math.pow(2, x % 8), _.address / 8 > this._server.coils.length) {
        c("illegal data address");
        const $ = new t.ExceptionResponseBody(u.body.fc, 2), B = this._fromRequest(u, $);
        return d(B.createPayload()), B;
      } else
        this._server.coils.writeUInt8(y, Math.floor(x / 8));
      const b = this._fromRequest(u, _), C = b.createPayload();
      return d(C), this._server.emit("postWriteSingleCoil", u, d), b;
    }
    _handleWriteSingleHoldingRegister(u, d) {
      if (!r.isWriteSingleRegisterRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleRegisterRequestBody but received ${u.body.name}`);
      if (!this._server.holding) {
        c("no register buffer on server, trying writeSingleRegister handler"), this._server.emit("writeSingleRegister", u, d);
        return;
      }
      this._server.emit("preWriteSingleRegister", u, d);
      const _ = t.WriteSingleRegisterResponseBody.fromRequest(u.body);
      if (_.address * 2 > this._server.holding.length) {
        c("illegal data address");
        const y = new t.ExceptionResponseBody(u.body.fc, 2), b = this._fromRequest(u, y);
        return d(b.createPayload()), b;
      } else
        this._server.holding.writeUInt16BE(_.value, _.address * 2);
      const x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postWriteSingleRegister", u, d), x;
    }
    _handleWriteMultipleCoils(u, d) {
      if (!r.isWriteMultipleCoilsRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${u.body.name}`);
      if (!this._server.coils) {
        c("no coils buffer on server, trying writeMultipleCoils handler"), this._server.emit("writeMultipleCoils", u, d);
        return;
      }
      this._server.emit("preWriteMultipleCoils", u, d);
      const _ = t.WriteMultipleCoilsResponseBody.fromRequest(u.body), x = s(this._server.coils), g = s(u.body.valuesAsBuffer), y = u.body.address, b = y + u.body.quantity, C = x.map((j, Q) => {
        let K = j;
        if (Q >= y && Q < b) {
          const M = g.shift();
          K = M !== void 0 ? M : j;
        }
        return K;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, x), this._server.coils.fill(o(C)), this._server.emit("postWriteMultipleCoils", this._server.coils, C);
      const $ = this._fromRequest(u, _), B = $.createPayload();
      return d(B), this._server.emit("postWriteMultipleCoils", u, d), $;
    }
    _handleWriteMultipleHoldingRegisters(u, d) {
      if (!r.isWriteMultipleRegistersRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleRegistersRequestBody but received ${u.body.name}`);
      if (!this._server.holding) {
        c("no register buffer on server, trying writeMultipleRegisters handler"), this._server.emit("writeMultipleRegisters", u, d);
        return;
      }
      this._server.emit("preWriteMultipleRegisters", u, d);
      const _ = t.WriteMultipleRegistersResponseBody.fromRequest(u.body);
      if (u.body.address * 2 + u.body.values.length > this._server.holding.length) {
        c("illegal data address");
        const y = new t.ExceptionResponseBody(u.body.fc, 2), b = this._fromRequest(u, y);
        return d(b.createPayload()), b;
      } else
        this._server.emit("writeMultipleRegisters", this._server.holding), c("Request Body: ", u.body), this._server.holding.fill(new Uint8Array(u.body.values), u.body.address * 2, u.body.address * 2 + u.body.values.length), this._server.emit("postWriteMultipleRegisters", this._server.holding);
      const x = this._fromRequest(u, _), g = x.createPayload();
      return d(g), this._server.emit("postWriteMultipleRegisters", u, d), x;
    }
  }
  return ns.default = p, ns;
}
var Tp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Io, "__esModule", { value: !0 });
const tT = _e, La = tT("modbus tcp client socket"), rT = Tp(HS()), nT = Tp(eT());
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
    La("new data coming in"), this._requestHandler.handle(t);
    do {
      const r = this._requestHandler.shift();
      if (!r) {
        La("no request to process");
        break;
      }
      this._responseHandler.handle(r, (n) => {
        this._socket.write(n, () => {
          La("response flushed", n);
        });
      });
    } while (!0);
  }
}
Io.default = iT;
var Ao = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(lc, "__esModule", { value: !0 });
const sT = _e, oT = sT("modbus tcp server"), aT = Ao(Co), lT = Ao(Io), cT = Ao(mi), uT = Ao(gi);
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
lc.default = fT;
var cc = {}, So = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(cc, "__esModule", { value: !0 });
const dT = So(Io), hT = So(Co), pT = So(rn), _T = So(wi);
class mT extends hT.default {
  constructor(t, r) {
    super(r), this._socket = t;
    const n = pT.default.fromBuffer, i = _T.default.fromRequest, s = new dT.default(this, t, n, i);
    this.emit("connection", s);
  }
}
cc.default = mT;
var Pp = {}, uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
const xT = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function gT(e) {
  return typeof e != "object" ? !1 : !!xT.includes(e.message);
}
uc.isInternalException = gT;
var Dp = {};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t($t);
})(Dp);
(function(e) {
  function t(i) {
    for (var s in i) e.hasOwnProperty(s) || (e[s] = i[s]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(uc), t(Dp);
  var r = vr;
  e.isExceptionResponseBody = r.isExceptionResponseBody;
  var n = Jr;
  e.isExceptionRequestBody = n.isExceptionRequestBody;
})(Pp);
var $p = {}, fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
const Op = 0, Lp = 65535, yT = Lp, ET = Op, wT = 0, vT = 1, bT = 128;
fc.LIMITS = {
  COIL_MAX: vT,
  COIL_MIN: wT,
  ERROR_CODE_THRESHOLD: bT,
  REGISTER_MAX: yT,
  REGISTER_MIN: ET,
  UINT16_MAX: Lp,
  UINT16_MIN: Op
};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(fc);
})($p);
var vi = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
}, To = T && T.__importStar || function(e) {
  if (e && e.__esModule) return e;
  var t = {};
  if (e != null) for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
  return t.default = e, t;
};
Object.defineProperty(ne, "__esModule", { value: !0 });
const Np = vi(Vl);
ne.ModbusTCPClient = Np.default;
const Fp = vi(tc);
ne.ModbusRTUClient = Fp.default;
const Up = vi(lc);
ne.ModbusTCPServer = Up.default;
const Bp = vi(cc);
ne.ModbusRTUServer = Bp.default;
const RT = To(ae), CT = To(Pp), IT = To(ie), AT = To(Ge), ST = vi(_i), TT = $p;
ne.client = {
  RTU: Fp.default,
  TCP: Np.default
};
ne.server = {
  RTU: Bp.default,
  TCP: Up.default
};
ne.requests = Object.assign({}, IT, { UserRequest: ST.default });
ne.responses = AT;
ne.codes = RT;
ne.errors = CT;
ne.limits = TT.LIMITS;
var PT = Zr;
ne.ModbusAbstractRequest = PT.default;
var DT = yi;
ne.ModbusAbstractResponse = DT.default;
var $T = pi;
ne.MBClientRequestHandler = $T.default;
var OT = xi;
ne.ModbusClientResponseHandler = OT.default;
var LT = ii;
ne.ModbusClient = LT.default;
var NT = mi;
ne.ModbusTCPRequest = NT.default;
var FT = gi;
ne.ModbusTCPResponse = FT.default;
var UT = rn;
ne.ModbusRTURequest = UT.default;
var BT = wi;
ne.ModbusRTUResponse = BT.default;
var MT = $t;
ne.UserRequestError = MT.UserRequestError;
var kT = _i;
ne.UserRequest = kT.default;
var qT = mo;
ne.UserRequestMetrics = qT.UserRequestMetrics;
const Cd = 3048, jT = 2050, HT = 2048, GT = 2120, WT = 2106, Ts = 4096, VT = 4098, dc = 4116, Na = dc - Ts + 1, zT = dc - Ts, nl = 4598, Mp = 1e4, YT = 4600, kp = 10, Fa = 4, Ps = 4606, hc = 10, XT = 750, KT = 4608, Ds = 1e4, qp = 4610, $s = 10, Os = 4622, jp = 4624, Ua = qp - Ps + 2, Ba = jp - Os + 2;
function il(e, t) {
  if (typeof e != "number" || !Number.isInteger(e) || e < 0 || e > 65535)
    throw new Error(`PLC returned an invalid value for holding register ${t}`);
  return e;
}
function st(e, t, r) {
  const n = il(e, r), s = il(t, r + 1) * 65536 + n;
  return s >= 2147483648 ? s - 4294967296 : s;
}
function At(e, t, r, n, i = {}) {
  if (typeof e != "number" || !Number.isFinite(e))
    throw new Error(`${t} must be a number`);
  const s = e * r, o = Math.round(s), a = Number.EPSILON * Math.max(1, Math.abs(s)) * 4, c = i.min ?? -2147483648, p = i.max ?? 2147483647;
  if (Math.abs(s - o) > a || o < c || o > p)
    throw new Error(`${t} must have at most ${n} decimal places and fit the supported PLC range`);
  return o;
}
function St(e) {
  const t = e < 0 ? e + 4294967296 : e;
  return [t % 65536, Math.floor(t / 65536)];
}
async function JT(e) {
  const r = (await e.readCoils(Cd, 1)).response.body.valuesAsArray[0];
  if (r !== !0 && r !== !1 && r !== 0 && r !== 1)
    throw new Error(`PLC returned an invalid value for coil ${Cd}`);
  return r === !0 || r === 1;
}
async function QT(e) {
  const r = (await e.readHoldingRegisters(Ts, Na)).response.body.valuesAsArray;
  if (r.length !== Na)
    throw new Error(`PLC returned ${r.length} overview registers; expected ${Na}`);
  const n = st(r[0], r[1], Ts), i = st(r[2], r[3], VT);
  return {
    load: n,
    distance: i,
    status: il(r[zT], dc)
  };
}
async function ZT(e) {
  const r = (await e.readHoldingRegisters(nl, Fa)).response.body.valuesAsArray;
  if (r.length !== Fa)
    throw new Error(
      `PLC returned ${r.length} test limit registers; expected ${Fa}`
    );
  return {
    testDistanceLimit: st(r[0], r[1], nl) / Mp,
    testLoadLimit: st(r[2], r[3], YT) / kp
  };
}
async function eP(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw new Error("Invalid PLC limits");
  const r = t, n = At(
    r.testDistanceLimit,
    "Test Distance Limit",
    Mp,
    4,
    { min: 0 }
  ), i = At(
    r.testLoadLimit,
    "Test Load Limit",
    kp,
    1,
    { min: 0 }
  );
  await e.writeMultipleRegisters(nl, [
    ...St(n),
    ...St(i)
  ]);
}
async function tP(e) {
  const r = (await e.readHoldingRegisters(
    Ps,
    Ua
  )).response.body.valuesAsArray;
  if (r.length !== Ua)
    throw new Error(
      `PLC returned ${r.length} initial adjustment registers; expected ${Ua}`
    );
  const i = (await e.readHoldingRegisters(
    Os,
    Ba
  )).response.body.valuesAsArray;
  if (i.length !== Ba)
    throw new Error(
      `PLC returned ${i.length} final adjustment registers; expected ${Ba}`
    );
  return {
    manualVelocity: st(r[0], r[1], Ps) / hc,
    topDistanceLimit: st(r[2], r[3], KT) / Ds,
    bottomDistanceLimit: st(i[0], i[1], Os) / Ds,
    topLoadLimit: st(r[4], r[5], qp) / $s,
    bottomLoadLimit: st(i[2], i[3], jp) / $s
  };
}
async function rP(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw new Error("Invalid PLC adjustments");
  const r = t, n = At(
    r.manualVelocity,
    "Manual Velocity",
    hc,
    1,
    { max: XT }
  ), i = At(
    r.topDistanceLimit,
    "Top Distance Limit",
    Ds,
    4
  ), s = At(
    r.bottomDistanceLimit,
    "Bottom Distance Limit",
    Ds,
    4
  ), o = At(r.topLoadLimit, "Top Load Limit", $s, 1), a = At(
    r.bottomLoadLimit,
    "Bottom Load Limit",
    $s,
    1
  );
  await e.writeMultipleRegisters(Ps, [
    ...St(n),
    ...St(i),
    ...St(o)
  ]), await e.writeMultipleRegisters(Os, [
    ...St(s),
    ...St(a)
  ]);
}
async function nP(e, t) {
  await e.writeSingleCoil(jT, t);
}
async function iP(e, t) {
  await e.writeSingleCoil(HT, t);
}
async function sP(e) {
  console.log("Triggering Reset Load"), await e.writeSingleCoil(GT, !0);
}
async function oP(e) {
  await e.writeSingleCoil(WT, !0);
}
const aP = 2098, lP = 4596, cP = 4120, uP = 2108, fP = 2109, Hp = 2110, Id = 4096, dP = 4098, Ma = 4, hP = 10, Gp = 1e4, pP = 3e4, _P = 3e4, Wp = 100, mP = Wp * 3;
async function xP(e, t) {
  var s;
  if (t.type !== "Tensile" && t.type !== "Compression")
    throw new Error("Invalid PLC test type");
  const r = St(
    At(t.velocity, "Preset Velocity", hc, 1, { min: 1 })
  ), n = (s = t.targets) == null ? void 0 : s[0], i = St(At(n, "Target 1", Gp, 4));
  await e.writeSingleCoil(aP, t.type === "Compression"), await e.writeMultipleRegisters(lP, r), await e.writeMultipleRegisters(cP, i);
}
async function gP(e) {
  await e.writeSingleCoil(uP, !0);
}
async function yP(e) {
  await e.writeSingleCoil(Hp, !0);
}
async function Vp(e) {
  return zp(e, fP);
}
async function zp(e, t) {
  const n = (await e.readCoils(t, 1)).response.body.valuesAsArray[0];
  if (n !== !0 && n !== !1 && n !== 0 && n !== 1)
    throw new Error(`PLC returned an invalid value for coil ${t}`);
  return n === !0 || n === 1;
}
async function EP(e) {
  return zp(e, Hp);
}
async function wP(e) {
  const r = (await e.readHoldingRegisters(Id, Ma)).response.body.valuesAsArray;
  if (r.length !== Ma)
    throw new Error(`PLC returned ${r.length} test sample registers; expected ${Ma}`);
  return {
    load: st(r[0], r[1], Id) / hP,
    displacement: st(r[2], r[3], dP) / Gp
  };
}
async function vP(e) {
  const t = await Vp(e);
  return {
    running: t,
    sample: t ? await wP(e) : null
  };
}
class bP {
  constructor(t) {
    Lc(this, "activeRun", null);
    this.publishUpdate = t;
  }
  get hasActiveRun() {
    return this.activeRun !== null;
  }
  async start(t, r) {
    if (this.activeRun) throw new Error("A PLC test is already active");
    if (typeof r.testId != "string" || r.testId.trim().length === 0)
      throw new Error("Invalid test ID");
    const n = {
      testId: r.testId,
      client: t,
      startedAt: 0,
      sawRunning: !1,
      startCommandSent: !1,
      startCommandPromise: null,
      stopRequested: !1,
      stopSignalWasObserved: !1,
      stopCommandWrittenAt: null,
      stopCommandPromise: null,
      failureMessage: null,
      pollTimer: null,
      state: "starting"
    };
    this.activeRun = n, this.publishUpdate({ testId: n.testId, state: n.state });
    try {
      if (await Vp(t))
        throw new Error("The PLC is already running a test");
      if (await xP(t, r.preset), this.activeRun !== n) return;
      if (n.stopRequested) {
        this.finishRun(n, "stopped");
        return;
      }
      if (n.startCommandPromise = gP(t), await n.startCommandPromise, n.startCommandSent = !0, n.startedAt = Date.now(), this.activeRun !== n) return;
      n.stopRequested && await this.writeStopCommand(n), this.schedulePoll(n);
    } catch (i) {
      if (await this.failRun(n, i), this.activeRun === n) return;
      throw i;
    }
  }
  async stop(t) {
    const r = this.activeRun;
    if (!r) throw new Error("There is no active PLC test");
    if (t !== r.testId) throw new Error("The requested test is not the active PLC test");
    if (r.stopRequested || (r.stopRequested = !0, r.state = "stopping", this.publishUpdate({ testId: r.testId, state: r.state })), r.startCommandSent)
      try {
        await this.writeStopCommand(r);
      } catch (n) {
        throw await this.failRun(r, n), n;
      }
  }
  connectionLost(t) {
    const r = this.activeRun;
    r && this.finishRun(r, "failed", t.message);
  }
  async shutdown() {
    const t = this.activeRun;
    if (t) {
      if (t.pollTimer && clearTimeout(t.pollTimer), t.pollTimer = null, t.startCommandPromise)
        try {
          await t.startCommandPromise, t.startCommandSent = !0;
        } catch (r) {
          console.error("Could not confirm PLC test start during shutdown", r);
        }
      if (t.startCommandSent && t.client.connectionState === "online")
        try {
          await this.writeStopCommand(t);
        } catch (r) {
          console.error("Could not request PLC test stop during shutdown", r);
        }
      this.activeRun = null;
    }
  }
  async writeStopCommand(t) {
    return t.stopCommandPromise || (t.stopCommandPromise = yP(t.client).then(() => {
      t.stopCommandWrittenAt = Date.now();
    })), t.stopCommandPromise;
  }
  schedulePoll(t) {
    this.activeRun === t && (t.pollTimer = setTimeout(() => {
      t.pollTimer = null, this.poll(t);
    }, Wp));
  }
  async poll(t) {
    if (this.activeRun === t)
      try {
        const r = await vP(t.client);
        if (this.activeRun !== t) return;
        const n = t.stopRequested ? await EP(t.client) : !1;
        if (n && (t.stopSignalWasObserved = !0), t.stopRequested && t.stopCommandWrittenAt !== null && Date.now() - t.stopCommandWrittenAt >= _P) {
          const i = "The PLC did not acknowledge the test stop request";
          this.finishRun(t, "failed", t.failureMessage ? `${t.failureMessage}; ${i}` : i);
          return;
        }
        if (r.running)
          t.sawRunning = !0, !t.stopRequested && t.state !== "running" && (t.state = "running", this.publishUpdate({ testId: t.testId, state: t.state })), r.sample && this.publishUpdate({
            testId: t.testId,
            state: t.state,
            sample: {
              elapsedMs: Date.now() - t.startedAt,
              load: r.sample.load,
              displacement: r.sample.displacement
            }
          });
        else if (t.sawRunning) {
          this.finishRunWhenIdle(t, t.stopRequested ? "stopped" : "completed");
          return;
        } else if (t.stopRequested) {
          if (t.stopSignalWasObserved && !n || t.stopCommandWrittenAt !== null && !n && Date.now() - t.stopCommandWrittenAt >= mP) {
            this.finishRunWhenIdle(t, "stopped");
            return;
          }
        } else if (Date.now() - t.startedAt >= pP)
          throw new Error("The PLC did not start the test");
        this.schedulePoll(t);
      } catch (r) {
        await this.failRun(t, r);
      }
  }
  async failRun(t, r) {
    if (this.activeRun !== t) return;
    const n = r instanceof Error ? r.message : String(r);
    if (t.failureMessage) {
      this.finishRun(t, "failed", `${t.failureMessage}; ${n}`);
      return;
    }
    if (!t.startCommandPromise) {
      this.finishRun(t, "failed", n);
      return;
    }
    if (!t.startCommandSent)
      try {
        await t.startCommandPromise, t.startCommandSent = !0;
      } catch {
        t.startCommandSent = !0;
      }
    if (t.client.connectionState !== "online") {
      this.finishRun(t, "failed", n);
      return;
    }
    t.failureMessage = n, t.stopRequested || (t.stopRequested = !0, t.state = "stopping", this.publishUpdate({ testId: t.testId, state: t.state }));
    try {
      await this.writeStopCommand(t);
    } catch (i) {
      const s = i instanceof Error ? i.message : String(i);
      this.finishRun(t, "failed", `${n}; could not request PLC test stop: ${s}`);
      return;
    }
    this.schedulePoll(t);
  }
  finishRunWhenIdle(t, r) {
    if (t.failureMessage) {
      this.finishRun(t, "failed", t.failureMessage);
      return;
    }
    this.finishRun(t, r);
  }
  finishRun(t, r, n) {
    this.activeRun === t && (t.pollTimer && clearTimeout(t.pollTimer), t.pollTimer = null, t.state = r, this.activeRun = null, this.publishUpdate({
      testId: t.testId,
      state: r,
      ...n ? { error: n } : {}
    }));
  }
}
const wn = 502, Ad = 5e3, RP = 6e4, CP = 1e3;
let mt = null, Ne = null, V = null, Jt = null, In = null, pe = { state: "disconnected", ipAddress: null }, Sd = !1;
const mr = /* @__PURE__ */ new Map(), Dt = new bP((e) => {
  mt && !mt.isDestroyed() && mt.webContents.send("plc:test-run-update", e);
});
function Vt(e) {
  const t = pe.state === e.state && pe.ipAddress === e.ipAddress && pe.plcWorking === e.plcWorking && pe.clearSelection === e.clearSelection && pe.error === e.error;
  pe = e, !t && mt && !mt.isDestroyed() && mt.webContents.send("plc:status", e);
}
function Yp(e) {
  if (e instanceof Error) return e.message;
  if (typeof e != "object" || e === null) return String(e);
  const t = e, r = t.response, n = typeof r == "object" && r !== null ? r.body : null, i = typeof n == "object" && n !== null ? n.message : null, s = [
    typeof t.err == "string" ? t.err : null,
    typeof t.message == "string" ? t.message : null,
    typeof i == "string" ? i : null
  ].filter((o) => !!o);
  return s.length > 0 ? s.join(": ") : "Unknown PLC error";
}
function Xp(e) {
  return e instanceof Error ? e : new Error(Yp(e));
}
function Ae(e) {
  if (!mt || mt.isDestroyed() || e !== mt.webContents)
    throw new Error("Unauthorized PLC request");
}
function Kp(e) {
  if (typeof e != "string" || !Ld.isIPv4(e.trim()))
    throw new Error("Enter a valid IPv4 address");
  return e.trim().split(".").map((t) => String(Number(t))).join(".");
}
function Qt(e, t) {
  const r = mr.get(e);
  r && (clearTimeout(r.timeout), mr.delete(e), t && (r.socket.removeAllListeners(), r.socket.destroy()));
}
function Jp(e) {
  for (const [t, r] of mr)
    if (r.socket === e) {
      Qt(t, !1);
      return;
    }
}
function bi() {
  In && (clearTimeout(In), In = null);
}
function Qp(e, t) {
  if (Ne !== e) return;
  const r = Jt;
  Dt.connectionLost(t ?? new Error("PLC connection closed during a test")), bi(), Ne = null, V = null, Jt = null, e.removeAllListeners(), e.destroy(), Vt({
    state: "offline",
    ipAddress: r,
    plcWorking: null,
    clearSelection: !0,
    ...t ? { error: t.message } : {}
  });
}
function IP(e, t) {
  Jp(e), Qp(e, t);
}
function AP(e) {
  if (Jp(e), Ne === e) {
    const t = Jt;
    Dt.connectionLost(new Error("PLC connection closed unexpectedly during a test")), bi(), Ne = null, V = null, Jt = null, Vt({
      state: "offline",
      ipAddress: t,
      plcWorking: null,
      clearSelection: !0,
      error: "PLC connection closed unexpectedly"
    });
  }
}
function SP(e) {
  return new Promise((t, r) => {
    const n = new Ld.Socket(), i = new ne.client.TCP(n, 1, Ad);
    let s = !1, o = !1;
    const a = setTimeout(() => {
      o || (o = !0, n.destroy(), r(new Error(`Connection to ${e}:${wn} timed out`)));
    }, Ad);
    n.on("connect", () => {
      s = !0, o = !0, clearTimeout(a), t({ socket: n, client: i });
    }), n.on("error", (c) => {
      if (!s) {
        if (o) return;
        o = !0, clearTimeout(a), r(new Error(`Could not connect to ${e}:${wn}: ${c.message}`));
        return;
      }
      IP(n, c);
    }), n.on("close", () => {
      if (!s) {
        if (o) return;
        o = !0, clearTimeout(a), r(new Error(`Connection to ${e}:${wn} closed before it was established`));
        return;
      }
      AP(n);
    });
    try {
      n.connect({ host: e, port: wn });
    } catch (c) {
      o = !0, clearTimeout(a), n.removeAllListeners(), n.destroy(), r(Xp(c));
    }
  });
}
async function Zp(e) {
  if (Dt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  const t = Kp(e), { socket: r, client: n } = await SP(t), i = Od(), s = setTimeout(() => Qt(i, !0), RP);
  return mr.set(i, { ipAddress: t, socket: r, client: n, timeout: s }), { token: i, ipAddress: t };
}
function TP(e, t, r) {
  const n = async () => {
    if (!(Ne !== e || V !== t)) {
      try {
        const i = await JT(t);
        if (Ne !== e || V !== t) return;
        Vt({
          state: "online",
          ipAddress: r,
          plcWorking: i
        });
      } catch (i) {
        Qp(e, Xp(i));
        return;
      }
      Ne === e && V === t && (In = setTimeout(() => {
        In = null, n();
      }, CP));
    }
  };
  n();
}
function e_(e) {
  if (Dt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  if (typeof e != "string") throw new Error("Invalid prepared PLC connection");
  const t = mr.get(e);
  if (!t) throw new Error("Prepared PLC connection expired or is no longer available");
  if (t.socket.destroyed || !t.socket.writable)
    throw Qt(e, !0), new Error(`Connection to ${t.ipAddress}:${wn} is no longer available`);
  Qt(e, !1), bi();
  const r = Ne;
  Ne = t.socket, V = t.client, Jt = t.ipAddress;
  const n = { state: "connecting", ipAddress: t.ipAddress, plcWorking: null };
  return Vt(n), r && r !== Ne && (r.removeAllListeners(), r.destroy()), TP(t.socket, t.client, t.ipAddress), n;
}
function PP() {
  if (Dt.hasActiveRun) throw new Error("Stop the active test before disconnecting");
  bi();
  const e = Ne;
  Ne = null, V = null, Jt = null;
  for (const r of mr.keys())
    Qt(r, !0);
  e && (e.removeAllListeners(), e.destroy());
  const t = { state: "disconnected", ipAddress: null, plcWorking: null };
  return Vt(t), t;
}
async function DP(e) {
  if (Dt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  const t = Kp(e), r = Ne, n = Jt;
  Vt({ state: "connecting", ipAddress: t });
  let i = null;
  try {
    return i = (await Zp(t)).token, e_(i);
  } catch (s) {
    return i && Qt(i, !0), r && Ne === r && !r.destroyed && r.writable && n ? Vt({
      state: "online",
      ipAddress: n,
      plcWorking: pe.ipAddress === n ? pe.plcWorking : null
    }) : Vt({
      state: "offline",
      ipAddress: t,
      plcWorking: null,
      error: Yp(s)
    }), pe;
  }
}
function $P(e) {
  if (typeof e != "object" || e === null) throw new Error("Invalid PLC test request");
  const t = e;
  if (typeof t.testId != "string" || t.testId.trim().length === 0)
    throw new Error("Invalid test ID");
  if (typeof t.preset != "object" || t.preset === null)
    throw new Error("Invalid preset for PLC test");
  const r = t.preset;
  if (r.type !== "Tensile" && r.type !== "Compression")
    throw new Error("Invalid PLC test type");
  if (typeof r.velocity != "number" || !Number.isFinite(r.velocity))
    throw new Error("Invalid PLC test velocity");
  if (!Array.isArray(r.targets))
    throw new Error("Invalid PLC test targets");
  const n = r.targets.map((i) => {
    if (typeof i != "number" || !Number.isFinite(i)) throw new Error("Invalid PLC test targets");
    return i;
  });
  return {
    testId: t.testId,
    preset: {
      type: r.type,
      velocity: r.velocity,
      targets: n
    }
  };
}
function OP(e) {
  mt = e, !Sd && (Z.handle("plc:prepare-connection", async (t, r) => (Ae(t.sender), Zp(r))), Z.handle("plc:activate-connection", (t, r) => (Ae(t.sender), e_(r))), Z.handle("plc:cancel-connection", (t, r) => {
    if (Ae(t.sender), typeof r != "string") throw new Error("Invalid prepared PLC connection");
    Qt(r, !0);
  }), Z.handle("plc:connect", async (t, r) => (Ae(t.sender), DP(r))), Z.handle("plc:disconnect", (t) => (Ae(t.sender), PP())), Z.handle("plc:start-test-run", async (t, r) => {
    Ae(t.sender);
    const n = $P(r);
    if (!V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot start a test while the PLC is offline");
    await Dt.start(V, n);
  }), Z.handle("plc:stop-test-run", async (t, r) => {
    if (Ae(t.sender), typeof r != "string") throw new Error("Invalid test ID");
    await Dt.stop(r);
  }), Z.handle("plc:get-status", (t) => (Ae(t.sender), pe)), Z.handle("plc:read-overview-values", async (t) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot read overview values while the PLC is offline");
    return QT(V);
  }), Z.handle("plc:read-limits", async (t) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot read limits while the PLC is offline");
    return ZT(V);
  }), Z.handle("plc:write-limits", async (t, r) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot write limits while the PLC is offline");
    return eP(V, r);
  }), Z.handle("plc:read-adjustments", async (t) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot read adjustments while the PLC is offline");
    return tP(V);
  }), Z.handle("plc:write-adjustments", async (t, r) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot write adjustments while the PLC is offline");
    return rP(V, r);
  }), Z.handle("plc:set-move-up", async (t, r) => {
    if (Ae(t.sender), typeof r != "boolean") throw new Error("Invalid Move Up command value");
    if (!V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot control Move Up while the PLC is offline");
    return nP(V, r);
  }), Z.handle("plc:set-move-down", async (t, r) => {
    if (Ae(t.sender), typeof r != "boolean") throw new Error("Invalid Move Down command value");
    if (!V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot control Move Down while the PLC is offline");
    return iP(V, r);
  }), Z.handle("plc:reset-load", async (t) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot reset load while the PLC is offline");
    return sP(V);
  }), Z.handle("plc:reset-stroke", async (t) => {
    if (Ae(t.sender), !V || V.connectionState !== "online" || pe.state !== "online")
      throw new Error("Cannot reset stroke while the PLC is offline");
    return oP(V);
  }), Sd = !0);
}
async function LP() {
  bi(), await Dt.shutdown();
  for (const t of mr.keys())
    Qt(t, !0);
  const e = Ne;
  Ne = null, V = null, Jt = null, e && (e.removeAllListeners(), e.destroy()), pe = { state: "disconnected", ipAddress: null, plcWorking: null };
}
const pc = Be.dirname(sm(import.meta.url));
process.env.APP_ROOT = Be.join(pc, "..");
const Gn = process.env.VITE_DEV_SERVER_URL, sD = Be.join(process.env.APP_ROOT, "dist-electron"), _c = Be.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Gn ? Be.join(process.env.APP_ROOT, "public") : _c;
let H;
const sl = /* @__PURE__ */ new Set();
WC(() => H, (e) => sl.has(e.id));
kC(() => H);
const Mr = /* @__PURE__ */ new Map();
async function NP(e, t, r) {
  let n;
  try {
    return await Promise.race([
      e,
      new Promise((i, s) => {
        n = setTimeout(() => s(new Error(r)), t);
      })
    ]);
  } finally {
    n && clearTimeout(n);
  }
}
function FP() {
  !xt.isPackaged || process.platform !== "win32" || (dt.autoUpdater.autoDownload = !0, dt.autoUpdater.autoInstallOnAppQuit = !1, dt.autoUpdater.on("checking-for-update", () => console.info("Checking for application updates")), dt.autoUpdater.on("update-available", (e) => console.info(`Application update ${e.version} is available`)), dt.autoUpdater.on("update-not-available", () => console.info("Application is up to date")), dt.autoUpdater.on("error", (e) => console.error("Application update failed:", e)), dt.autoUpdater.on("update-downloaded", (e) => {
    const t = {
      type: "info",
      title: "Update ready to install",
      message: `Version ${e.version} has been downloaded. Restart the app now to install it?`,
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1,
      noLink: !0
    };
    (H && !H.isDestroyed() ? An.showMessageBox(H, t) : An.showMessageBox(t)).then(({ response: n }) => {
      n === 0 && dt.autoUpdater.quitAndInstall();
    }).catch((n) => console.error("Could not show update installation prompt:", n));
  }), dt.autoUpdater.checkForUpdates().catch((e) => console.error("Could not check for application updates:", e)));
}
Z.handle("pdf:ready", (e, t) => {
  const r = Mr.get(e.sender.id);
  if (!r) throw new Error("Unexpected PDF ready signal");
  return clearTimeout(r.timeout), Mr.delete(e.sender.id), typeof t == "string" && t ? r.reject(new Error(t)) : r.resolve(), !0;
});
Z.handle("pdf:show-in-folder", (e, t) => {
  if (!H || H.isDestroyed() || e.sender !== H.webContents)
    throw new Error("Unauthorized PDF request");
  if (typeof t != "string" || !t.trim()) throw new Error("Invalid PDF path");
  Td.showItemInFolder(t);
});
Z.handle("window:minimize", () => {
  H == null || H.minimize();
});
Z.handle("window:maximize", () => {
  if (H) {
    if (H.isMaximized()) {
      H.restore();
      return;
    }
    H.maximize();
  }
});
Z.handle("window:close", () => {
  H == null || H.close();
});
Z.handle("window:is-maximized", () => !!H && H.isMaximized());
Z.handle("pdf:save-record", async (e, t) => {
  if (!H || H.isDestroyed() || e.sender !== H.webContents)
    throw new Error("Unauthorized PDF request");
  if (!t || typeof t != "object") throw new Error("Invalid PDF request");
  const r = t, n = /* @__PURE__ */ new Set(["test", "specimen", "preset", "data-field"]);
  let i, s;
  if (r.type === "test-comparison") {
    const _ = t, x = _.testIds;
    if (typeof _.name != "string" || !Array.isArray(x) || x.length < 2 || !x.every((y) => typeof y == "string" && y.trim().length > 0))
      throw new Error("Invalid PDF comparison request");
    i = _.name;
    const g = new URLSearchParams();
    x.forEach((y) => g.append("testId", y)), s = `/print/test-comparison?${g.toString()}`;
  } else {
    const _ = t;
    if (!_.type || !n.has(_.type) || typeof _.id != "string" || !_.id || typeof _.name != "string")
      throw new Error("Invalid PDF request");
    i = _.name, s = `/print/${_.type}/${encodeURIComponent(_.id)}`;
  }
  const o = Array.from(i.replace(/[<>:"/\\|?*]/g, "_"), (_) => _.charCodeAt(0) < 32 ? "_" : _).join("").trim().replace(/[. ]+$/, "") || "Test", a = H, { canceled: c, filePath: p } = await An.showSaveDialog(H, {
    title: r.type === "test-comparison" ? "Save Test Comparison as PDF" : "Save Record as PDF",
    defaultPath: Be.join(xt.getPath("documents"), `${o}.pdf`),
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });
  if (c || !p) return { canceled: !0 };
  if (a.isDestroyed()) throw new Error("The main window was closed before PDF export completed");
  e.sender.send("pdf:creating");
  const l = new ol({
    parent: a,
    width: 750,
    minWidth: 750,
    maxWidth: 750,
    height: 900,
    show: !1,
    autoHideMenuBar: !0,
    webPreferences: {
      preload: Be.join(pc, "preload.mjs"),
      devTools: !xt.isPackaged,
      backgroundThrottling: !1
    }
  }), u = l.webContents.id;
  sl.add(u);
  const d = new Promise((_, x) => {
    const g = setTimeout(() => {
      Mr.delete(u), x(new Error("Timed out waiting for the PDF report to render"));
    }, 6e4);
    Mr.set(u, { resolve: _, reject: x, timeout: g });
  });
  try {
    const _ = Gn ? l.loadURL(`${Gn.replace(/\/$/, "")}/#${s}`) : l.loadFile(Be.join(_c, "index.html"), { hash: s });
    await Promise.all([_, d]);
    const x = await NP(
      l.webContents.printToPDF({
        pageSize: "A4",
        printBackground: !0,
        displayHeaderFooter: !1
      }),
      6e4,
      "Timed out while generating the PDF"
    );
    return await cl(p, x), { canceled: !1, filePath: p };
  } finally {
    sl.delete(u);
    const _ = Mr.get(u);
    _ && (clearTimeout(_.timeout), Mr.delete(u)), l.isDestroyed() || l.close();
  }
});
function t_() {
  H && !H.isDestroyed() || (H = new ol({
    icon: Be.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Be.join(pc, "preload.mjs"),
      devTools: !xt.isPackaged
    },
    minWidth: 1e3,
    minHeight: 600,
    autoHideMenuBar: !0,
    show: !1,
    frame: !1,
    titleBarStyle: "hidden"
  }), OP(H), H.webContents.setWindowOpenHandler(({ url: e }) => e.startsWith("http:") || e.startsWith("https:") ? (Td.openExternal(e), { action: "deny" }) : { action: "allow" }), H.on("maximize", () => {
    H == null || H.webContents.send("window:maximized-state-changed", !0);
  }), H.on("unmaximize", () => {
    H == null || H.webContents.send("window:maximized-state-changed", !1);
  }), H.maximize(), H.show(), Gn ? H.loadURL(Gn) : H.loadFile(Be.join(_c, "index.html")));
}
xt.on("window-all-closed", () => {
  LP().finally(() => {
    process.platform !== "darwin" && xt.quit(), H = null;
  });
});
xt.on("activate", () => {
  ol.getAllWindows().length === 0 && t_();
});
xt.whenReady().then(() => {
  rm.defaultSession.setPermissionRequestHandler((e, t, r) => {
    r(!1);
  }), t_(), FP();
});
export {
  sD as MAIN_DIST,
  _c as RENDERER_DIST,
  Gn as VITE_DEV_SERVER_URL
};
