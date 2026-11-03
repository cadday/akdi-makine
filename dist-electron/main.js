var im = Object.defineProperty;
var sm = (e, t, r) => t in e ? im(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Bc = (e, t, r) => sm(e, typeof t != "symbol" ? t + "" : t, r);
import pr, { ipcMain as X, dialog as Tn, app as yt, BrowserWindow as ul, session as om, shell as $d } from "electron";
import Zt from "fs";
import am from "constants";
import zn from "stream";
import Us from "util";
import Ld from "assert";
import oe from "path";
import Bs from "child_process";
import fl from "events";
import Yn from "crypto";
import dl from "tty";
import Ms from "os";
import er from "url";
import Nd from "zlib";
import lm from "http";
import { fileURLToPath as cm } from "node:url";
import Be from "node:path";
import { writeFile as hl, stat as um, readFile as Fd, mkdir as fm, rm as dm } from "node:fs/promises";
import { randomUUID as Ud } from "node:crypto";
import Et from "buffer";
import Bd from "node:net";
var T = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, dt = {}, gr = {}, ke = {};
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
var Bt = am, hm = process.cwd, os = null, pm = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return os || (os = hm.call(process)), os;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Mc = process.chdir;
  process.chdir = function(e) {
    os = null, Mc.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Mc);
}
var _m = mm;
function mm(e) {
  Bt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, u, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, u, d, _) {
    _ && process.nextTick(_);
  }, e.lchownSync = function() {
  }), pm === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function u(d, _, g) {
      var x = Date.now(), y = 0;
      l(d, _, function v(C) {
        if (C && (C.code === "EACCES" || C.code === "EPERM" || C.code === "EBUSY") && Date.now() - x < 6e4) {
          setTimeout(function() {
            e.stat(_, function(O, B) {
              O && O.code === "ENOENT" ? l(d, _, v) : g(C);
            });
          }, y), y < 100 && (y += 10);
          return;
        }
        g && g(C);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function u(d, _, g, x, y, v) {
      var C;
      if (v && typeof v == "function") {
        var O = 0;
        C = function(B, G, Z) {
          if (B && B.code === "EAGAIN" && O < 10)
            return O++, l.call(e, d, _, g, x, y, C);
          v.apply(this, arguments);
        };
      }
      return l.call(e, d, _, g, x, y, C);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, l), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(u, d, _, g, x) {
      for (var y = 0; ; )
        try {
          return l.call(e, u, d, _, g, x);
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
    l.lchmod = function(u, d, _) {
      l.open(
        u,
        Bt.O_WRONLY | Bt.O_SYMLINK,
        d,
        function(g, x) {
          if (g) {
            _ && _(g);
            return;
          }
          l.fchmod(x, d, function(y) {
            l.close(x, function(v) {
              _ && _(y || v);
            });
          });
        }
      );
    }, l.lchmodSync = function(u, d) {
      var _ = l.openSync(u, Bt.O_WRONLY | Bt.O_SYMLINK, d), g = !0, x;
      try {
        x = l.fchmodSync(_, d), g = !1;
      } finally {
        if (g)
          try {
            l.closeSync(_);
          } catch {
          }
        else
          l.closeSync(_);
      }
      return x;
    };
  }
  function r(l) {
    Bt.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(u, d, _, g) {
      l.open(u, Bt.O_SYMLINK, function(x, y) {
        if (x) {
          g && g(x);
          return;
        }
        l.futimes(y, d, _, function(v) {
          l.close(y, function(C) {
            g && g(v || C);
          });
        });
      });
    }, l.lutimesSync = function(u, d, _) {
      var g = l.openSync(u, Bt.O_SYMLINK), x, y = !0;
      try {
        x = l.futimesSync(g, d, _), y = !1;
      } finally {
        if (y)
          try {
            l.closeSync(g);
          } catch {
          }
        else
          l.closeSync(g);
      }
      return x;
    }) : l.futimes && (l.lutimes = function(u, d, _, g) {
      g && process.nextTick(g);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(u, d, _) {
      return l.call(e, u, d, function(g) {
        p(g) && (g = null), _ && _.apply(this, arguments);
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
    return l && function(u, d, _, g) {
      return l.call(e, u, d, _, function(x) {
        p(x) && (x = null), g && g.apply(this, arguments);
      });
    };
  }
  function o(l) {
    return l && function(u, d, _) {
      try {
        return l.call(e, u, d, _);
      } catch (g) {
        if (!p(g)) throw g;
      }
    };
  }
  function a(l) {
    return l && function(u, d, _) {
      typeof d == "function" && (_ = d, d = null);
      function g(x, y) {
        y && (y.uid < 0 && (y.uid += 4294967296), y.gid < 0 && (y.gid += 4294967296)), _ && _.apply(this, arguments);
      }
      return d ? l.call(e, u, d, g) : l.call(e, u, g);
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
var kc = zn.Stream, gm = xm;
function xm(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    kc.call(this);
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
    kc.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var ym = wm, Em = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function wm(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Em(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var de = Zt, bm = _m, vm = gm, Rm = ym, Ni = Us, Se, fs;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Se = Symbol.for("graceful-fs.queue"), fs = Symbol.for("graceful-fs.previous")) : (Se = "___graceful-fs.queue", fs = "___graceful-fs.previous");
function Cm() {
}
function Md(e, t) {
  Object.defineProperty(e, Se, {
    get: function() {
      return t;
    }
  });
}
var hr = Cm;
Ni.debuglog ? hr = Ni.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (hr = function() {
  var e = Ni.format.apply(Ni, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!de[Se]) {
  var Im = T[Se] || [];
  Md(de, Im), de.close = function(e) {
    function t(r, n) {
      return e.call(de, r, function(i) {
        i || qc(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, fs, {
      value: e
    }), t;
  }(de.close), de.closeSync = function(e) {
    function t(r) {
      e.apply(de, arguments), qc();
    }
    return Object.defineProperty(t, fs, {
      value: e
    }), t;
  }(de.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    hr(de[Se]), Ld.equal(de[Se].length, 0);
  });
}
T[Se] || Md(T, de[Se]);
var qe = pl(Rm(de));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !de.__patched && (qe = pl(de), de.__patched = !0);
function pl(e) {
  bm(e), e.gracefulify = pl, e.createReadStream = G, e.createWriteStream = Z;
  var t = e.readFile;
  e.readFile = r;
  function r(M, E, V) {
    return typeof E == "function" && (V = E, E = null), Q(M, E, V);
    function Q(le, D, S, $) {
      return t(le, D, function(A) {
        A && (A.code === "EMFILE" || A.code === "ENFILE") ? Ir([Q, [le, D, S], A, $ || Date.now(), Date.now()]) : typeof S == "function" && S.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(M, E, V, Q) {
    return typeof V == "function" && (Q = V, V = null), le(M, E, V, Q);
    function le(D, S, $, A, L) {
      return n(D, S, $, function(P) {
        P && (P.code === "EMFILE" || P.code === "ENFILE") ? Ir([le, [D, S, $, A], P, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = o);
  function o(M, E, V, Q) {
    return typeof V == "function" && (Q = V, V = null), le(M, E, V, Q);
    function le(D, S, $, A, L) {
      return s(D, S, $, function(P) {
        P && (P.code === "EMFILE" || P.code === "ENFILE") ? Ir([le, [D, S, $, A], P, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(M, E, V, Q) {
    return typeof V == "function" && (Q = V, V = 0), le(M, E, V, Q);
    function le(D, S, $, A, L) {
      return a(D, S, $, function(P) {
        P && (P.code === "EMFILE" || P.code === "ENFILE") ? Ir([le, [D, S, $, A], P, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = u;
  var l = /^v[0-5]\./;
  function u(M, E, V) {
    typeof E == "function" && (V = E, E = null);
    var Q = l.test(process.version) ? function(S, $, A, L) {
      return p(S, le(
        S,
        $,
        A,
        L
      ));
    } : function(S, $, A, L) {
      return p(S, $, le(
        S,
        $,
        A,
        L
      ));
    };
    return Q(M, E, V);
    function le(D, S, $, A) {
      return function(L, P) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? Ir([
          Q,
          [D, S, $],
          L,
          A || Date.now(),
          Date.now()
        ]) : (P && P.sort && P.sort(), typeof $ == "function" && $.call(this, L, P));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = vm(e);
    v = d.ReadStream, O = d.WriteStream;
  }
  var _ = e.ReadStream;
  _ && (v.prototype = Object.create(_.prototype), v.prototype.open = C);
  var g = e.WriteStream;
  g && (O.prototype = Object.create(g.prototype), O.prototype.open = B), Object.defineProperty(e, "ReadStream", {
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
      return O;
    },
    set: function(M) {
      O = M;
    },
    enumerable: !0,
    configurable: !0
  });
  var x = v;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return x;
    },
    set: function(M) {
      x = M;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = O;
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
    se(M.path, M.flags, M.mode, function(E, V) {
      E ? (M.autoClose && M.destroy(), M.emit("error", E)) : (M.fd = V, M.emit("open", V), M.read());
    });
  }
  function O(M, E) {
    return this instanceof O ? (g.apply(this, arguments), this) : O.apply(Object.create(O.prototype), arguments);
  }
  function B() {
    var M = this;
    se(M.path, M.flags, M.mode, function(E, V) {
      E ? (M.destroy(), M.emit("error", E)) : (M.fd = V, M.emit("open", V));
    });
  }
  function G(M, E) {
    return new e.ReadStream(M, E);
  }
  function Z(M, E) {
    return new e.WriteStream(M, E);
  }
  var J = e.open;
  e.open = se;
  function se(M, E, V, Q) {
    return typeof V == "function" && (Q = V, V = null), le(M, E, V, Q);
    function le(D, S, $, A, L) {
      return J(D, S, $, function(P, k) {
        P && (P.code === "EMFILE" || P.code === "ENFILE") ? Ir([le, [D, S, $, A], P, L || Date.now(), Date.now()]) : typeof A == "function" && A.apply(this, arguments);
      });
    }
  }
  return e;
}
function Ir(e) {
  hr("ENQUEUE", e[0].name, e[1]), de[Se].push(e), _l();
}
var Fi;
function qc() {
  for (var e = Date.now(), t = 0; t < de[Se].length; ++t)
    de[Se][t].length > 2 && (de[Se][t][3] = e, de[Se][t][4] = e);
  _l();
}
function _l() {
  if (clearTimeout(Fi), Fi = void 0, de[Se].length !== 0) {
    var e = de[Se].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      hr("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      hr("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var a = Date.now() - s, c = Math.max(s - i, 1), p = Math.min(c * 1.2, 100);
      a >= p ? (hr("RETRY", t.name, r), t.apply(null, r.concat([i]))) : de[Se].push(e);
    }
    Fi === void 0 && (Fi = setTimeout(_l, 0));
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
      r.read(i, s, o, a, c, (d, _, g) => {
        if (d) return u(d);
        l({ bytesRead: _, buffer: g });
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
})(gr);
var ml = {}, kd = {};
const Am = oe;
kd.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Am.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const qd = gr, { checkPath: jd } = kd, Hd = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ml.makeDir = async (e, t) => (jd(e), qd.mkdir(e, {
  mode: Hd(t),
  recursive: !0
}));
ml.makeDirSync = (e, t) => (jd(e), qd.mkdirSync(e, {
  mode: Hd(t),
  recursive: !0
}));
const Sm = ke.fromPromise, { makeDir: Tm, makeDirSync: ko } = ml, qo = Sm(Tm);
var wt = {
  mkdirs: qo,
  mkdirsSync: ko,
  // alias
  mkdirp: qo,
  mkdirpSync: ko,
  ensureDir: qo,
  ensureDirSync: ko
};
const Dm = ke.fromPromise, Gd = gr;
function Pm(e) {
  return Gd.access(e).then(() => !0).catch(() => !1);
}
var xr = {
  pathExists: Dm(Pm),
  pathExistsSync: Gd.existsSync
};
const kr = qe;
function Om(e, t, r, n) {
  kr.open(e, "r+", (i, s) => {
    if (i) return n(i);
    kr.futimes(s, t, r, (o) => {
      kr.close(s, (a) => {
        n && n(o || a);
      });
    });
  });
}
function $m(e, t, r) {
  const n = kr.openSync(e, "r+");
  return kr.futimesSync(n, t, r), kr.closeSync(n);
}
var Wd = {
  utimesMillis: Om,
  utimesMillisSync: $m
};
const jr = gr, Re = oe, Lm = Us;
function Nm(e, t, r) {
  const n = r.dereference ? (i) => jr.stat(i, { bigint: !0 }) : (i) => jr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function Fm(e, t, r) {
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
function Um(e, t, r, n, i) {
  Lm.callbackify(Nm)(e, t, n, (s, o) => {
    if (s) return i(s);
    const { srcStat: a, destStat: c } = o;
    if (c) {
      if (Xn(a, c)) {
        const p = Re.basename(e), l = Re.basename(t);
        return r === "move" && p !== l && p.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && gl(e, t) ? i(new Error(ks(e, t, r))) : i(null, { srcStat: a, destStat: c });
  });
}
function Bm(e, t, r, n) {
  const { srcStat: i, destStat: s } = Fm(e, t, n);
  if (s) {
    if (Xn(i, s)) {
      const o = Re.basename(e), a = Re.basename(t);
      if (r === "move" && o !== a && o.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && gl(e, t))
    throw new Error(ks(e, t, r));
  return { srcStat: i, destStat: s };
}
function Vd(e, t, r, n, i) {
  const s = Re.resolve(Re.dirname(e)), o = Re.resolve(Re.dirname(r));
  if (o === s || o === Re.parse(o).root) return i();
  jr.stat(o, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Xn(t, c) ? i(new Error(ks(e, r, n))) : Vd(e, t, o, n, i));
}
function zd(e, t, r, n) {
  const i = Re.resolve(Re.dirname(e)), s = Re.resolve(Re.dirname(r));
  if (s === i || s === Re.parse(s).root) return;
  let o;
  try {
    o = jr.statSync(s, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Xn(t, o))
    throw new Error(ks(e, r, n));
  return zd(e, t, s, n);
}
function Xn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function gl(e, t) {
  const r = Re.resolve(e).split(Re.sep).filter((i) => i), n = Re.resolve(t).split(Re.sep).filter((i) => i);
  return r.reduce((i, s, o) => i && n[o] === s, !0);
}
function ks(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Vr = {
  checkPaths: Um,
  checkPathsSync: Bm,
  checkParentPaths: Vd,
  checkParentPathsSync: zd,
  isSrcSubdir: gl,
  areIdentical: Xn
};
const We = qe, Dn = oe, Mm = wt.mkdirs, km = xr.pathExists, qm = Wd.utimesMillis, Pn = Vr;
function jm(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Pn.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: o, destStat: a } = s;
    Pn.checkParentPaths(e, o, t, "copy", (c) => c ? n(c) : r.filter ? Yd(jc, a, e, t, r, n) : jc(a, e, t, r, n));
  });
}
function jc(e, t, r, n, i) {
  const s = Dn.dirname(r);
  km(s, (o, a) => {
    if (o) return i(o);
    if (a) return ds(e, t, r, n, i);
    Mm(s, (c) => c ? i(c) : ds(e, t, r, n, i));
  });
}
function Yd(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, s) : s(), (o) => s(o));
}
function Hm(e, t, r, n, i) {
  return n.filter ? Yd(ds, e, t, r, n, i) : ds(e, t, r, n, i);
}
function ds(e, t, r, n, i) {
  (n.dereference ? We.stat : We.lstat)(t, (o, a) => o ? i(o) : a.isDirectory() ? Km(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? Gm(a, e, t, r, n, i) : a.isSymbolicLink() ? Zm(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Gm(e, t, r, n, i, s) {
  return t ? Wm(e, r, n, i, s) : Xd(e, r, n, i, s);
}
function Wm(e, t, r, n, i) {
  if (n.overwrite)
    We.unlink(r, (s) => s ? i(s) : Xd(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Xd(e, t, r, n, i) {
  We.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? Vm(e.mode, t, r, i) : qs(r, e.mode, i));
}
function Vm(e, t, r, n) {
  return zm(e) ? Ym(r, e, (i) => i ? n(i) : Hc(e, t, r, n)) : Hc(e, t, r, n);
}
function zm(e) {
  return (e & 128) === 0;
}
function Ym(e, t, r) {
  return qs(e, t | 128, r);
}
function Hc(e, t, r, n) {
  Xm(t, r, (i) => i ? n(i) : qs(r, e, n));
}
function qs(e, t, r) {
  return We.chmod(e, t, r);
}
function Xm(e, t, r) {
  We.stat(e, (n, i) => n ? r(n) : qm(t, i.atime, i.mtime, r));
}
function Km(e, t, r, n, i, s) {
  return t ? Kd(r, n, i, s) : Jm(e.mode, r, n, i, s);
}
function Jm(e, t, r, n, i) {
  We.mkdir(r, (s) => {
    if (s) return i(s);
    Kd(t, r, n, (o) => o ? i(o) : qs(r, e, i));
  });
}
function Kd(e, t, r, n) {
  We.readdir(e, (i, s) => i ? n(i) : Jd(s, e, t, r, n));
}
function Jd(e, t, r, n, i) {
  const s = e.pop();
  return s ? Qm(e, s, t, r, n, i) : i();
}
function Qm(e, t, r, n, i, s) {
  const o = Dn.join(r, t), a = Dn.join(n, t);
  Pn.checkPaths(o, a, "copy", i, (c, p) => {
    if (c) return s(c);
    const { destStat: l } = p;
    Hm(l, o, a, i, (u) => u ? s(u) : Jd(e, r, n, i, s));
  });
}
function Zm(e, t, r, n, i) {
  We.readlink(t, (s, o) => {
    if (s) return i(s);
    if (n.dereference && (o = Dn.resolve(process.cwd(), o)), e)
      We.readlink(r, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? We.symlink(o, r, i) : i(a) : (n.dereference && (c = Dn.resolve(process.cwd(), c)), Pn.isSrcSubdir(o, c) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Pn.isSrcSubdir(c, o) ? i(new Error(`Cannot overwrite '${c}' with '${o}'.`)) : eg(o, r, i)));
    else
      return We.symlink(o, r, i);
  });
}
function eg(e, t, r) {
  We.unlink(t, (n) => n ? r(n) : We.symlink(e, t, r));
}
var tg = jm;
const Le = qe, On = oe, rg = wt.mkdirsSync, ng = Wd.utimesMillisSync, $n = Vr;
function ig(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = $n.checkPathsSync(e, t, "copy", r);
  return $n.checkParentPathsSync(e, n, t, "copy"), sg(i, e, t, r);
}
function sg(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = On.dirname(r);
  return Le.existsSync(i) || rg(i), Qd(e, t, r, n);
}
function og(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Qd(e, t, r, n);
}
function Qd(e, t, r, n) {
  const s = (n.dereference ? Le.statSync : Le.lstatSync)(t);
  if (s.isDirectory()) return hg(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return ag(s, e, t, r, n);
  if (s.isSymbolicLink()) return mg(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function ag(e, t, r, n, i) {
  return t ? lg(e, r, n, i) : Zd(e, r, n, i);
}
function lg(e, t, r, n) {
  if (n.overwrite)
    return Le.unlinkSync(r), Zd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Zd(e, t, r, n) {
  return Le.copyFileSync(t, r), n.preserveTimestamps && cg(e.mode, t, r), xl(r, e.mode);
}
function cg(e, t, r) {
  return ug(e) && fg(r, e), dg(t, r);
}
function ug(e) {
  return (e & 128) === 0;
}
function fg(e, t) {
  return xl(e, t | 128);
}
function xl(e, t) {
  return Le.chmodSync(e, t);
}
function dg(e, t) {
  const r = Le.statSync(e);
  return ng(t, r.atime, r.mtime);
}
function hg(e, t, r, n, i) {
  return t ? e0(r, n, i) : pg(e.mode, r, n, i);
}
function pg(e, t, r, n) {
  return Le.mkdirSync(r), e0(t, r, n), xl(r, e);
}
function e0(e, t, r) {
  Le.readdirSync(e).forEach((n) => _g(n, e, t, r));
}
function _g(e, t, r, n) {
  const i = On.join(t, e), s = On.join(r, e), { destStat: o } = $n.checkPathsSync(i, s, "copy", n);
  return og(o, i, s, n);
}
function mg(e, t, r, n) {
  let i = Le.readlinkSync(t);
  if (n.dereference && (i = On.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = Le.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return Le.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (s = On.resolve(process.cwd(), s)), $n.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (Le.statSync(r).isDirectory() && $n.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return gg(i, r);
  } else
    return Le.symlinkSync(i, r);
}
function gg(e, t) {
  return Le.unlinkSync(t), Le.symlinkSync(e, t);
}
var xg = ig;
const yg = ke.fromCallback;
var yl = {
  copy: yg(tg),
  copySync: xg
};
const Gc = qe, t0 = oe, te = Ld, Ln = process.platform === "win32";
function r0(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Gc[r], r = r + "Sync", e[r] = e[r] || Gc[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function El(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te.strictEqual(typeof r, "function", "rimraf: callback function required"), te(t, "rimraf: invalid options argument provided"), te.strictEqual(typeof t, "object", "rimraf: options should be object"), r0(t), Wc(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => Wc(e, t, i), o);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function Wc(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Ln)
      return Vc(e, t, n, r);
    if (i && i.isDirectory())
      return as(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return Ln ? Vc(e, t, s, r) : as(e, t, s, r);
        if (s.code === "EISDIR")
          return as(e, t, s, r);
      }
      return r(s);
    });
  });
}
function Vc(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, o) => {
      s ? n(s.code === "ENOENT" ? null : r) : o.isDirectory() ? as(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function zc(e, t, r) {
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
  n.isDirectory() ? ls(e, t, r) : t.unlinkSync(e);
}
function as(e, t, r, n) {
  te(e), te(t), te(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Eg(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Eg(e, t, r) {
  te(e), te(t), te(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, o;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      El(t0.join(e, a), t, (c) => {
        if (!o) {
          if (c) return r(o = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function n0(e, t) {
  let r;
  t = t || {}, r0(t), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te(t, "rimraf: missing options"), te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Ln && zc(e, t, n);
  }
  try {
    r && r.isDirectory() ? ls(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Ln ? zc(e, t, n) : ls(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ls(e, t, n);
  }
}
function ls(e, t, r) {
  te(e), te(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      wg(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function wg(e, t) {
  if (te(e), te(t), t.readdirSync(e).forEach((r) => n0(t0.join(e, r), t)), Ln) {
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
var bg = El;
El.sync = n0;
const hs = qe, vg = ke.fromCallback, i0 = bg;
function Rg(e, t) {
  if (hs.rm) return hs.rm(e, { recursive: !0, force: !0 }, t);
  i0(e, t);
}
function Cg(e) {
  if (hs.rmSync) return hs.rmSync(e, { recursive: !0, force: !0 });
  i0.sync(e);
}
var js = {
  remove: vg(Rg),
  removeSync: Cg
};
const Ig = ke.fromPromise, s0 = gr, o0 = oe, a0 = wt, l0 = js, Yc = Ig(async function(t) {
  let r;
  try {
    r = await s0.readdir(t);
  } catch {
    return a0.mkdirs(t);
  }
  return Promise.all(r.map((n) => l0.remove(o0.join(t, n))));
});
function Xc(e) {
  let t;
  try {
    t = s0.readdirSync(e);
  } catch {
    return a0.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = o0.join(e, r), l0.removeSync(r);
  });
}
var Ag = {
  emptyDirSync: Xc,
  emptydirSync: Xc,
  emptyDir: Yc,
  emptydir: Yc
};
const Sg = ke.fromCallback, c0 = oe, Ht = qe, u0 = wt;
function Tg(e, t) {
  function r() {
    Ht.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Ht.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = c0.dirname(e);
    Ht.stat(s, (o, a) => {
      if (o)
        return o.code === "ENOENT" ? u0.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(o);
      a.isDirectory() ? r() : Ht.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function Dg(e) {
  let t;
  try {
    t = Ht.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = c0.dirname(e);
  try {
    Ht.statSync(r).isDirectory() || Ht.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") u0.mkdirsSync(r);
    else throw n;
  }
  Ht.writeFileSync(e, "");
}
var Pg = {
  createFile: Sg(Tg),
  createFileSync: Dg
};
const Og = ke.fromCallback, f0 = oe, jt = qe, d0 = wt, $g = xr.pathExists, { areIdentical: h0 } = Vr;
function Lg(e, t, r) {
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
      if (s && h0(a, s)) return r(null);
      const c = f0.dirname(t);
      $g(c, (p, l) => {
        if (p) return r(p);
        if (l) return n(e, t);
        d0.mkdirs(c, (u) => {
          if (u) return r(u);
          n(e, t);
        });
      });
    });
  });
}
function Ng(e, t) {
  let r;
  try {
    r = jt.lstatSync(t);
  } catch {
  }
  try {
    const s = jt.lstatSync(e);
    if (r && h0(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = f0.dirname(t);
  return jt.existsSync(n) || d0.mkdirsSync(n), jt.linkSync(e, t);
}
var Fg = {
  createLink: Og(Lg),
  createLinkSync: Ng
};
const Gt = oe, Rn = qe, Ug = xr.pathExists;
function Bg(e, t, r) {
  if (Gt.isAbsolute(e))
    return Rn.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Gt.dirname(t), i = Gt.join(n, e);
    return Ug(i, (s, o) => s ? r(s) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : Rn.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: Gt.relative(n, e)
    })));
  }
}
function Mg(e, t) {
  let r;
  if (Gt.isAbsolute(e)) {
    if (r = Rn.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Gt.dirname(t), i = Gt.join(n, e);
    if (r = Rn.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Rn.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Gt.relative(n, e)
    };
  }
}
var kg = {
  symlinkPaths: Bg,
  symlinkPathsSync: Mg
};
const p0 = qe;
function qg(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  p0.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function jg(e, t) {
  let r;
  if (t) return t;
  try {
    r = p0.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Hg = {
  symlinkType: qg,
  symlinkTypeSync: jg
};
const Gg = ke.fromCallback, _0 = oe, it = gr, m0 = wt, Wg = m0.mkdirs, Vg = m0.mkdirsSync, g0 = kg, zg = g0.symlinkPaths, Yg = g0.symlinkPathsSync, x0 = Hg, Xg = x0.symlinkType, Kg = x0.symlinkTypeSync, Jg = xr.pathExists, { areIdentical: y0 } = Vr;
function Qg(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, it.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      it.stat(e),
      it.stat(t)
    ]).then(([o, a]) => {
      if (y0(o, a)) return n(null);
      Kc(e, t, r, n);
    }) : Kc(e, t, r, n);
  });
}
function Kc(e, t, r, n) {
  zg(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, Xg(s.toCwd, r, (o, a) => {
      if (o) return n(o);
      const c = _0.dirname(t);
      Jg(c, (p, l) => {
        if (p) return n(p);
        if (l) return it.symlink(e, t, a, n);
        Wg(c, (u) => {
          if (u) return n(u);
          it.symlink(e, t, a, n);
        });
      });
    });
  });
}
function Zg(e, t, r) {
  let n;
  try {
    n = it.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = it.statSync(e), c = it.statSync(t);
    if (y0(a, c)) return;
  }
  const i = Yg(e, t);
  e = i.toDst, r = Kg(i.toCwd, r);
  const s = _0.dirname(t);
  return it.existsSync(s) || Vg(s), it.symlinkSync(e, t, r);
}
var ex = {
  createSymlink: Gg(Qg),
  createSymlinkSync: Zg
};
const { createFile: Jc, createFileSync: Qc } = Pg, { createLink: Zc, createLinkSync: eu } = Fg, { createSymlink: tu, createSymlinkSync: ru } = ex;
var tx = {
  // file
  createFile: Jc,
  createFileSync: Qc,
  ensureFile: Jc,
  ensureFileSync: Qc,
  // link
  createLink: Zc,
  createLinkSync: eu,
  ensureLink: Zc,
  ensureLinkSync: eu,
  // symlink
  createSymlink: tu,
  createSymlinkSync: ru,
  ensureSymlink: tu,
  ensureSymlinkSync: ru
};
function rx(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "", o = JSON.stringify(e, n, i);
  if (o === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return o.replace(/\n/g, t) + s;
}
function nx(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var wl = { stringify: rx, stripBom: nx };
let Hr;
try {
  Hr = qe;
} catch {
  Hr = Zt;
}
const Hs = ke, { stringify: E0, stripBom: w0 } = wl;
async function ix(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Hr, n = "throws" in t ? t.throws : !0;
  let i = await Hs.fromCallback(r.readFile)(e, t);
  i = w0(i);
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
const sx = Hs.fromPromise(ix);
function ox(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Hr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = w0(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function ax(e, t, r = {}) {
  const n = r.fs || Hr, i = E0(t, r);
  await Hs.fromCallback(n.writeFile)(e, i, r);
}
const lx = Hs.fromPromise(ax);
function cx(e, t, r = {}) {
  const n = r.fs || Hr, i = E0(t, r);
  return n.writeFileSync(e, i, r);
}
var ux = {
  readFile: sx,
  readFileSync: ox,
  writeFile: lx,
  writeFileSync: cx
};
const Ui = ux;
var fx = {
  // jsonfile exports
  readJson: Ui.readFile,
  readJsonSync: Ui.readFileSync,
  writeJson: Ui.writeFile,
  writeJsonSync: Ui.writeFileSync
};
const dx = ke.fromCallback, Cn = qe, b0 = oe, v0 = wt, hx = xr.pathExists;
function px(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = b0.dirname(e);
  hx(i, (s, o) => {
    if (s) return n(s);
    if (o) return Cn.writeFile(e, t, r, n);
    v0.mkdirs(i, (a) => {
      if (a) return n(a);
      Cn.writeFile(e, t, r, n);
    });
  });
}
function _x(e, ...t) {
  const r = b0.dirname(e);
  if (Cn.existsSync(r))
    return Cn.writeFileSync(e, ...t);
  v0.mkdirsSync(r), Cn.writeFileSync(e, ...t);
}
var bl = {
  outputFile: dx(px),
  outputFileSync: _x
};
const { stringify: mx } = wl, { outputFile: gx } = bl;
async function xx(e, t, r = {}) {
  const n = mx(t, r);
  await gx(e, n, r);
}
var yx = xx;
const { stringify: Ex } = wl, { outputFileSync: wx } = bl;
function bx(e, t, r) {
  const n = Ex(t, r);
  wx(e, n, r);
}
var vx = bx;
const Rx = ke.fromPromise, Me = fx;
Me.outputJson = Rx(yx);
Me.outputJsonSync = vx;
Me.outputJSON = Me.outputJson;
Me.outputJSONSync = Me.outputJsonSync;
Me.writeJSON = Me.writeJson;
Me.writeJSONSync = Me.writeJsonSync;
Me.readJSON = Me.readJson;
Me.readJSONSync = Me.readJsonSync;
var Cx = Me;
const Ix = qe, Ga = oe, Ax = yl.copy, R0 = js.remove, Sx = wt.mkdirp, Tx = xr.pathExists, nu = Vr;
function Dx(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  nu.checkPaths(e, t, "move", r, (s, o) => {
    if (s) return n(s);
    const { srcStat: a, isChangingCase: c = !1 } = o;
    nu.checkParentPaths(e, a, t, "move", (p) => {
      if (p) return n(p);
      if (Px(t)) return iu(e, t, i, c, n);
      Sx(Ga.dirname(t), (l) => l ? n(l) : iu(e, t, i, c, n));
    });
  });
}
function Px(e) {
  const t = Ga.dirname(e);
  return Ga.parse(t).root === t;
}
function iu(e, t, r, n, i) {
  if (n) return jo(e, t, r, i);
  if (r)
    return R0(t, (s) => s ? i(s) : jo(e, t, r, i));
  Tx(t, (s, o) => s ? i(s) : o ? i(new Error("dest already exists.")) : jo(e, t, r, i));
}
function jo(e, t, r, n) {
  Ix.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Ox(e, t, r, n) : n());
}
function Ox(e, t, r, n) {
  Ax(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : R0(e, n));
}
var $x = Dx;
const C0 = qe, Wa = oe, Lx = yl.copySync, I0 = js.removeSync, Nx = wt.mkdirpSync, su = Vr;
function Fx(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = su.checkPathsSync(e, t, "move", r);
  return su.checkParentPathsSync(e, i, t, "move"), Ux(t) || Nx(Wa.dirname(t)), Bx(e, t, n, s);
}
function Ux(e) {
  const t = Wa.dirname(e);
  return Wa.parse(t).root === t;
}
function Bx(e, t, r, n) {
  if (n) return Ho(e, t, r);
  if (r)
    return I0(t), Ho(e, t, r);
  if (C0.existsSync(t)) throw new Error("dest already exists.");
  return Ho(e, t, r);
}
function Ho(e, t, r) {
  try {
    C0.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Mx(e, t, r);
  }
}
function Mx(e, t, r) {
  return Lx(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), I0(e);
}
var kx = Fx;
const qx = ke.fromCallback;
var jx = {
  move: qx($x),
  moveSync: kx
}, tr = {
  // Export promiseified graceful-fs:
  ...gr,
  // Export extra methods:
  ...yl,
  ...Ag,
  ...tx,
  ...Cx,
  ...wt,
  ...jx,
  ...bl,
  ...xr,
  ...js
}, yr = {}, zt = {}, be = {}, Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.CancellationError = Yt.CancellationToken = void 0;
const Hx = fl;
class Gx extends Hx.EventEmitter {
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
      return Promise.reject(new Va());
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
          s(new Va());
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
Yt.CancellationToken = Gx;
class Va extends Error {
  constructor() {
    super("cancelled");
  }
}
Yt.CancellationError = Va;
var zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.newError = Wx;
function Wx(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var we = {}, za = { exports: {} }, Bi = { exports: {} }, Go, ou;
function A0() {
  if (ou) return Go;
  ou = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  Go = function(l, u) {
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
    var g = u >= d * 1.5;
    return Math.round(l / d) + " " + _ + (g ? "s" : "");
  }
  return Go;
}
var Wo, au;
function S0() {
  if (au) return Wo;
  au = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = s, n.enabled = c, n.humanize = A0(), n.destroy = l, Object.keys(t).forEach((u) => {
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
      let d, _ = null, g, x;
      function y(...v) {
        if (!y.enabled)
          return;
        const C = y, O = Number(/* @__PURE__ */ new Date()), B = O - (d || O);
        C.diff = B, C.prev = d, C.curr = O, d = O, v[0] = n.coerce(v[0]), typeof v[0] != "string" && v.unshift("%O");
        let G = 0;
        v[0] = v[0].replace(/%([a-zA-Z%])/g, (J, se) => {
          if (J === "%%")
            return "%";
          G++;
          const M = n.formatters[se];
          if (typeof M == "function") {
            const E = v[G];
            J = M.call(C, E), v.splice(G, 1), G--;
          }
          return J;
        }), n.formatArgs.call(C, v), (C.log || n.log).apply(C, v);
      }
      return y.namespace = u, y.useColors = n.useColors(), y.color = n.selectColor(u), y.extend = i, y.destroy = n.destroy, Object.defineProperty(y, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => _ !== null ? _ : (g !== n.namespaces && (g = n.namespaces, x = n.enabled(u)), x),
        set: (v) => {
          _ = v;
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
      let _ = 0, g = 0, x = -1, y = 0;
      for (; _ < u.length; )
        if (g < d.length && (d[g] === u[_] || d[g] === "*"))
          d[g] === "*" ? (x = g, y = _, g++) : (_++, g++);
        else if (x !== -1)
          g = x + 1, y++, _ = y;
        else
          return !1;
      for (; g < d.length && d[g] === "*"; )
        g++;
      return g === d.length;
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
  return Wo = e, Wo;
}
var lu;
function Vx() {
  return lu || (lu = 1, function(e, t) {
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
    e.exports = S0()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Bi, Bi.exports)), Bi.exports;
}
var Mi = { exports: {} }, Vo, cu;
function zx() {
  return cu || (cu = 1, Vo = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Vo;
}
var zo, uu;
function T0() {
  if (uu) return zo;
  uu = 1;
  const e = Ms, t = dl, r = zx(), { env: n } = process;
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
  return zo = {
    supportsColor: a,
    stdout: s(o(!0, t.isatty(1))),
    stderr: s(o(!0, t.isatty(2)))
  }, zo;
}
var fu;
function Yx() {
  return fu || (fu = 1, function(e, t) {
    const r = dl, n = Us;
    t.init = l, t.log = a, t.formatArgs = s, t.save = c, t.load = p, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = T0();
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
      const g = _.substring(6).toLowerCase().replace(/_([a-z])/g, (y, v) => v.toUpperCase());
      let x = process.env[_];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), d[g] = x, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: _, useColors: g } = this;
      if (g) {
        const x = this.color, y = "\x1B[3" + (x < 8 ? x : "8;5;" + x), v = `  ${y};1m${_} \x1B[0m`;
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
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const _ = Object.keys(t.inspectOpts);
      for (let g = 0; g < _.length; g++)
        d.inspectOpts[_[g]] = t.inspectOpts[_[g]];
    }
    e.exports = S0()(t);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((_) => _.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(Mi, Mi.exports)), Mi.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? za.exports = Vx() : za.exports = Yx();
var Xx = za.exports, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.ProgressCallbackTransform = void 0;
const Kx = zn;
class Jx extends Kx.Transform {
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
Kn.ProgressCallbackTransform = Jx;
Object.defineProperty(we, "__esModule", { value: !0 });
we.DigestTransform = we.HttpExecutor = we.HttpError = void 0;
we.addSensitiveRedirectHeader = iy;
we.addSensitiveFieldPattern = sy;
we.createHttpError = Xa;
we.parseJson = ay;
we.configureRequestOptionsFromUrl = L0;
we.configureRequestUrl = Cl;
we.safeGetHeader = qr;
we.configureRequestOptions = ps;
we.isSensitiveFieldName = N0;
we.hashSensitiveValue = F0;
we.safeStringifyJson = Lr;
const D0 = Yn, Qx = Xx, Zx = Zt, ey = zn, Ya = er, ty = Yt, du = zr, ry = Kn, Mt = (0, Qx.default)("electron-builder"), vl = (e) => e.toLowerCase().replace(/[-_]/g, ""), P0 = /* @__PURE__ */ new Set(["authorization", "proxyauthorization", "privatetoken", "xapikey", "xauthtoken", "xaccesstoken", "xgitlabtoken", "cookie", "xcsrftoken"]), O0 = ["token", "password", "secret", "authorization", "credential", "apikey", "passphrase", "auth"], ny = ["key"];
function iy(e) {
  P0.add(vl(e));
}
function sy(e) {
  O0.push(e.toLowerCase().replace(/[-_]/g, ""));
}
function Xa(e, t = null) {
  return new Rl(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Lr(e.headers), t);
}
const oy = /* @__PURE__ */ new Map([
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
class Rl extends Error {
  constructor(t, r = `HTTP error: ${oy.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
we.HttpError = Rl;
function ay(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class $r {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new ty.CancellationToken(), n) {
    ps(t);
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
      const { headers: _, auth: g, ...x } = r;
      Mt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Lr(x)}`);
    }
    if (t.statusCode === 404) {
      s(Xa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

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
      this.doApiRequest($r.prepareRedirectUrlOptions(u, r), n, a, o).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", s), t.on("data", (_) => d += _), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const _ = qr(t, "content-type"), g = _ != null && (Array.isArray(_) ? _.find((x) => x.includes("json")) != null : _.includes("json"));
          s(Xa(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${g ? Lr(JSON.parse(d)) : d}
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
      Cl(t, a), ps(a), this.doDownload(a, {
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
        n < this.maxRedirects ? this.doDownload($r.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? cy(r, s) : r.responseHandler(s, r.callback);
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
    const n = L0(t, { ...r }), i = n.headers;
    if (i == null)
      return n;
    const s = $r.reconstructOriginalUrl(r), o = $0(t, r);
    if ($r.isCrossOriginRedirect(s, o)) {
      Mt.enabled && Mt(`Cross-origin redirect (${s.host} → ${o.host}): stripping sensitive headers`);
      for (const a of Object.keys(i))
        P0.has(vl(a)) && delete i[a];
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new Ya.URL(`${r}//${n}${i}${s}`);
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
        if (n < r && (i instanceof Rl && i.isServerError() || i.code === "EPIPE")) {
          await new Promise((s) => setTimeout(s, 1e3 * (n + 1)));
          continue;
        }
        throw i;
      }
  }
}
we.HttpExecutor = $r;
function $0(e, t) {
  try {
    return new Ya.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new Ya.URL(e, s);
  }
}
function L0(e, t) {
  const r = ps(t), n = $0(e, t);
  return Cl(n, r), r;
}
function Cl(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ka extends ey.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, D0.createHash)(r);
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
      throw (0, du.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, du.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
we.DigestTransform = Ka;
function ly(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function qr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function cy(e, t) {
  if (!ly(qr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = qr(t, "content-length");
    o != null && r.push(new ry.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Ka(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Ka(e.options.sha2, "sha256", "hex"));
  const i = (0, Zx.createWriteStream)(e.destination);
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
function ps(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function N0(e) {
  const t = vl(e);
  return O0.some((r) => t.includes(r)) || ny.some((r) => t.endsWith(r));
}
function F0(e) {
  return `${(0, D0.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
}
function Lr(e, t) {
  return JSON.stringify(e, (r, n) => N0(r) || t != null && t.has(r) ? typeof n == "string" ? F0(n) : "<stripped sensitive data>" : n, 2);
}
var Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
Gs.MemoLazy = void 0;
class uy {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && U0(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Gs.MemoLazy = uy;
function U0(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((o) => U0(e[o], t[o]));
  }
  return e === t;
}
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.githubUrl = fy;
Jn.githubTagPrefix = dy;
Jn.getS3LikeProviderBaseUrl = hy;
function fy(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function dy(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function hy(e) {
  const t = e.provider;
  if (t === "s3")
    return py(e);
  if (t === "spaces")
    return _y(e);
  throw new Error(`Not supported provider: ${t}`);
}
function py(e) {
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
  return B0(t, e.path);
}
function B0(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function _y(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return B0(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Il = {};
Object.defineProperty(Il, "__esModule", { value: !0 });
Il.retry = M0;
const my = Yt;
async function M0(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: o = 0, shouldRetry: a, cancellationToken: c = new my.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((r = a == null ? void 0 : a(p)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * o)), await M0(e, { ...t, retries: n - 1, attempt: o + 1 });
    throw p;
  }
}
var Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
Al.parseDn = gy;
function gy(e) {
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
const k0 = Yn, q0 = zr, xy = "options.name must be either a string or a Buffer", hu = (0, k0.randomBytes)(16);
hu[0] = hu[0] | 1;
const cs = {}, Y = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  cs[t] = e, Y[e] = t;
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
    return yy(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Ey(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (cs[t[14] + t[15]] & 240) >> 4,
        variant: pu((cs[t[19] + t[20]] & 224) >> 5),
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
        variant: pu((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, q0.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = cs[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Gr.UUID = _r;
_r.OID = _r.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function pu(e) {
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
var In;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(In || (In = {}));
function yy(e, t, r, n, i = In.ASCII) {
  const s = (0, k0.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, q0.newError)(xy, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const a = s.digest();
  let c;
  switch (i) {
    case In.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = a;
      break;
    case In.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = new _r(a);
      break;
    default:
      c = Y[a[0]] + Y[a[1]] + Y[a[2]] + Y[a[3]] + "-" + Y[a[4]] + Y[a[5]] + "-" + Y[a[6] & 15 | r] + Y[a[7]] + "-" + Y[a[8] & 63 | 128] + Y[a[9]] + "-" + Y[a[10]] + Y[a[11]] + Y[a[12]] + Y[a[13]] + Y[a[14]] + Y[a[15]];
      break;
  }
  return c;
}
function Ey(e) {
  return Y[e[0]] + Y[e[1]] + Y[e[2]] + Y[e[3]] + "-" + Y[e[4]] + Y[e[5]] + "-" + Y[e[6]] + Y[e[7]] + "-" + Y[e[8]] + Y[e[9]] + "-" + Y[e[10]] + Y[e[11]] + Y[e[12]] + Y[e[13]] + Y[e[14]] + Y[e[15]];
}
Gr.nil = new _r("00000000-0000-0000-0000-000000000000");
var Qn = {}, j0 = {};
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
      s(R), R.q = R.c = "", R.bufferCheckPosition = t.MAX_BUFFER_LENGTH, R.encoding = null, R.opt = f || {}, R.opt.lowercase = R.opt.lowercase || R.opt.lowercasetags, R.looseCase = R.opt.lowercase ? "toLowerCase" : "toUpperCase", R.opt.maxEntityCount = R.opt.maxEntityCount || 512, R.opt.maxEntityDepth = R.opt.maxEntityDepth || 4, R.entityCount = R.entityDepth = 0, R.tags = [], R.closed = R.closedRoot = R.sawRoot = !1, R.tag = R.error = null, R.strict = !!h, R.noscript = !!(h || R.opt.noscript), R.state = E.BEGIN, R.strictEntities = R.opt.strictEntities, R.ENTITIES = R.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), R.attribList = [], R.opt.xmlns && (R.ns = Object.create(y)), R.opt.unquotedAttributeValues === void 0 && (R.opt.unquotedAttributeValues = !h), R.trackPosition = R.opt.position !== !1, R.trackPosition && (R.position = R.line = R.column = 0), Q(R, "onready");
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
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), R = 0, w = 0, K = r.length; w < K; w++) {
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
      var pe = t.MAX_BUFFER_LENGTH - R;
      h.bufferCheckPosition = pe + h.position;
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
      write: an,
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
          set: function(K) {
            if (!K)
              return R.removeAllListeners(w), R._parser["on" + w] = K, K;
            R.on(w, K);
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
    var d = /^\[CDATA\[$/i, _ = /^DOCTYPE$/i, g = "http://www.w3.org/XML/1998/namespace", x = "http://www.w3.org/2000/xmlns/", y = { xml: g, xmlns: x }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, O = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, B = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function G(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function Z(h) {
      return h === '"' || h === "'";
    }
    function J(h) {
      return h === ">" || G(h);
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
    for (var V in t.STATE)
      t.STATE[t.STATE[V]] = V;
    E = t.STATE;
    function Q(h, f, R) {
      h[f] && h[f](R);
    }
    function le(h) {
      var f = h && h.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return f ? f[2] : null;
    }
    function D(h) {
      return h ? h.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function S(h, f) {
      const R = D(h), w = D(f);
      return !R || !w ? !0 : w === "utf16" ? R === "utf16le" || R === "utf16be" : R === w;
    }
    function $(h, f) {
      if (!(!h.strict || !h.encoding || !f || f.name !== "xml")) {
        var R = le(f.body);
        R && !S(h.encoding, R) && N(
          h,
          "XML declaration encoding " + R + " does not match detected stream encoding " + h.encoding.toUpperCase()
        );
      }
    }
    function A(h, f, R) {
      h.textNode && L(h), Q(h, f, R);
    }
    function L(h) {
      h.textNode = P(h.opt, h.textNode), h.textNode && Q(h, "ontext", h.textNode), h.textNode = "";
    }
    function P(h, f) {
      return h.trim && (f = f.trim()), h.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function k(h, f) {
      return L(h), h.trackPosition && (f += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), f = new Error(f), h.error = f, Q(h, "onerror", f), h;
    }
    function z(h) {
      return h.sawRoot && !h.closedRoot && N(h, "Unclosed root tag"), h.state !== E.BEGIN && h.state !== E.BEGIN_WHITESPACE && h.state !== E.TEXT && k(h, "Unexpected end"), L(h), h.c = "", h.closed = !0, Q(h, "onend"), n.call(h, h.strict, h.opt), h;
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
    function xe(h, f) {
      var R = h.indexOf(":"), w = R < 0 ? ["", h] : h.split(":"), K = w[0], ce = w[1];
      return f && h === "xmlns" && (K = "xmlns", ce = ""), { prefix: K, local: ce };
    }
    function q(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var f = xe(h.attribName, !0), R = f.prefix, w = f.local;
        if (R === "xmlns")
          if (w === "xml" && h.attribValue !== g)
            N(
              h,
              "xml: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else if (w === "xmlns" && h.attribValue !== x)
            N(
              h,
              "xmlns: prefix must be bound to " + x + `
Actual: ` + h.attribValue
            );
          else {
            var K = h.tag, ce = h.tags[h.tags.length - 1] || h;
            K.ns === ce.ns && (K.ns = Object.create(ce.ns)), K.ns[w] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, A(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function De(h, f) {
      if (h.opt.xmlns) {
        var R = h.tag, w = xe(h.tagName);
        R.prefix = w.prefix, R.local = w.local, R.uri = R.ns[w.prefix] || "", R.prefix && !R.uri && (N(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), R.uri = w.prefix);
        var K = h.tags[h.tags.length - 1] || h;
        R.ns && K.ns !== R.ns && Object.keys(R.ns).forEach(function(Rr) {
          A(h, "onopennamespace", {
            prefix: Rr,
            uri: R.ns[Rr]
          });
        });
        for (var ce = 0, pe = h.attribList.length; ce < pe; ce++) {
          var Pe = h.attribList[ce], Oe = Pe[0], et = Pe[1], ye = xe(Oe, !0), tt = ye.prefix, $o = ye.local, Ai = tt === "" ? "" : R.ns[tt] || "", Lt = {
            name: Oe,
            value: et,
            prefix: tt,
            local: $o,
            uri: Ai
          };
          tt && tt !== "xmlns" && !Ai && (N(
            h,
            "Unbound namespace prefix: " + JSON.stringify(tt)
          ), Lt.uri = tt), h.tag.attributes[Oe] = Lt, A(h, "onattribute", Lt);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!f, h.sawRoot = !0, h.tags.push(h.tag), A(h, "onopentag", h.tag), f || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = E.SCRIPT : h.state = E.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function sn(h) {
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
        var K = h.tags[f];
        if (K.name !== w)
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
        var pe = h.tag = h.tags.pop();
        h.tagName = h.tag.name, A(h, "onclosetag", h.tagName);
        var Pe = {};
        for (var Oe in pe.ns)
          Pe[Oe] = pe.ns[Oe];
        var et = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && pe.ns !== et.ns && Object.keys(pe.ns).forEach(function(ye) {
          var tt = pe.ns[ye];
          A(h, "onclosenamespace", { prefix: ye, uri: tt });
        });
      }
      f === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = E.TEXT;
    }
    function Ze(h) {
      var f = h.entity, R = f.toLowerCase(), w, K = "";
      return h.ENTITIES[f] ? h.ENTITIES[f] : h.ENTITIES[R] ? h.ENTITIES[R] : (f = R, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), w = parseInt(f, 16), K = w.toString(16)) : (f = f.slice(1), w = parseInt(f, 10), K = w.toString(10))), f = f.replace(/^0+/, ""), isNaN(w) || K.toLowerCase() !== f || w < 0 || w > 1114111 || !Ii(w) ? (N(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(w));
    }
    function Ii(h) {
      return h === 9 || h === 10 || h === 13 || h >= 32 && h <= 55295 || h >= 57344 && h <= 65533 || h >= 65536 && h <= 1114111;
    }
    function on(h, f) {
      f === "<" ? (h.state = E.OPEN_WAKA, h.startTagPosition = h.position) : G(f) || (N(h, "Non-whitespace before first tag."), h.textNode = f, h.state = E.TEXT);
    }
    function vr(h, f) {
      var R = "";
      return f < h.length && (R = h.charAt(f)), R;
    }
    function an(h) {
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
      for (var R = 0, w = ""; w = vr(h, R++), f.c = w, !!w; )
        switch (f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case E.BEGIN:
            if (f.state = E.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            on(f, w);
            continue;
          case E.BEGIN_WHITESPACE:
            on(f, w);
            continue;
          case E.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var ce = R - 1; w && w !== "<" && w !== "&"; )
                w = vr(h, R++), w && f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += h.substring(ce, R - 1);
            }
            w === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : (!G(w) && (!f.sawRoot || f.closedRoot) && N(f, "Text data outside of root node."), w === "&" ? f.state = E.TEXT_ENTITY : f.textNode += w);
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
            else if (!G(w)) if (se(v, w))
              f.state = E.OPEN_TAG, f.tagName = w;
            else if (w === "/")
              f.state = E.CLOSE_TAG, f.tagName = "";
            else if (w === "?")
              f.state = E.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (N(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var K = f.position - f.startTagPosition;
                w = new Array(K).join(" ") + w;
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
            ), f.doctype = "", f.sgmlDecl = "") : w === ">" ? (A(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = E.TEXT) : (Z(w) && (f.state = E.SGML_DECL_QUOTED), f.sgmlDecl += w);
            continue;
          case E.SGML_DECL_QUOTED:
            w === f.q && (f.state = E.SGML_DECL, f.q = ""), f.sgmlDecl += w;
            continue;
          case E.DOCTYPE:
            w === ">" ? (f.state = E.TEXT, A(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += w, w === "[" ? f.state = E.DOCTYPE_DTD : Z(w) && (f.state = E.DOCTYPE_QUOTED, f.q = w));
            continue;
          case E.DOCTYPE_QUOTED:
            f.doctype += w, w === f.q && (f.q = "", f.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            w === "]" ? (f.doctype += w, f.state = E.DOCTYPE) : w === "<" ? (f.state = E.OPEN_WAKA, f.startTagPosition = f.position) : Z(w) ? (f.doctype += w, f.state = E.DOCTYPE_DTD_QUOTED, f.q = w) : f.doctype += w;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            f.doctype += w, w === f.q && (f.state = E.DOCTYPE_DTD, f.q = "");
            continue;
          case E.COMMENT:
            w === "-" ? f.state = E.COMMENT_ENDING : f.comment += w;
            continue;
          case E.COMMENT_ENDING:
            w === "-" ? (f.state = E.COMMENT_ENDED, f.comment = P(f.opt, f.comment), f.comment && A(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + w, f.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            w !== ">" ? (N(f, "Malformed comment"), f.comment += "--" + w, f.state = E.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = E.DOCTYPE_DTD : f.state = E.TEXT;
            continue;
          case E.CDATA:
            for (var ce = R - 1; w && w !== "]"; )
              w = vr(h, R++), w && f.trackPosition && (f.position++, w === `
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
            w === "?" ? f.state = E.PROC_INST_ENDING : G(w) ? f.state = E.PROC_INST_BODY : f.procInstName += w;
            continue;
          case E.PROC_INST_BODY:
            if (!f.procInstBody && G(w))
              continue;
            w === "?" ? f.state = E.PROC_INST_ENDING : f.procInstBody += w;
            continue;
          case E.PROC_INST_ENDING:
            if (w === ">") {
              const et = {
                name: f.procInstName,
                body: f.procInstBody
              };
              $(f, et), A(f, "onprocessinginstruction", et), f.procInstName = f.procInstBody = "", f.state = E.TEXT;
            } else
              f.procInstBody += "?" + w, f.state = E.PROC_INST_BODY;
            continue;
          case E.OPEN_TAG:
            se(C, w) ? f.tagName += w : (ee(f), w === ">" ? De(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : (G(w) || N(f, "Invalid character in tag name"), f.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            w === ">" ? (De(f, !0), sn(f)) : (N(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (G(w))
              continue;
            w === ">" ? De(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : se(v, w) ? (f.attribName = w, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            w === "=" ? f.state = E.ATTRIB_VALUE : w === ">" ? (N(f, "Attribute without value"), f.attribValue = f.attribName, q(f), De(f)) : G(w) ? f.state = E.ATTRIB_NAME_SAW_WHITE : se(C, w) ? f.attribName += w : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              f.state = E.ATTRIB_VALUE;
            else {
              if (G(w))
                continue;
              N(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", A(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", w === ">" ? De(f) : se(v, w) ? (f.attribName = w, f.state = E.ATTRIB_NAME) : (N(f, "Invalid attribute name"), f.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (G(w))
              continue;
            Z(w) ? (f.q = w, f.state = E.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || k(f, "Unquoted attribute value"), f.state = E.ATTRIB_VALUE_UNQUOTED, f.attribValue = w);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (w !== f.q) {
              w === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_Q : f.attribValue += w;
              continue;
            }
            q(f), f.q = "", f.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            G(w) ? f.state = E.ATTRIB : w === ">" ? De(f) : w === "/" ? f.state = E.OPEN_TAG_SLASH : se(v, w) ? (N(f, "No whitespace between attributes"), f.attribName = w, f.attribValue = "", f.state = E.ATTRIB_NAME) : N(f, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!J(w)) {
              w === "&" ? f.state = E.ATTRIB_VALUE_ENTITY_U : f.attribValue += w;
              continue;
            }
            q(f), w === ">" ? De(f) : f.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (f.tagName)
              w === ">" ? sn(f) : se(C, w) ? f.tagName += w : f.script ? (f.script += "</" + f.tagName + w, f.tagName = "", f.state = E.SCRIPT) : (G(w) || N(f, "Invalid tagname in closing tag"), f.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (G(w))
                continue;
              M(v, w) ? f.script ? (f.script += "</" + w, f.state = E.SCRIPT) : N(f, "Invalid tagname in closing tag.") : f.tagName = w;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (G(w))
              continue;
            w === ">" ? sn(f) : N(f, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var pe, Pe;
            switch (f.state) {
              case E.TEXT_ENTITY:
                pe = E.TEXT, Pe = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                pe = E.ATTRIB_VALUE_QUOTED, Pe = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                pe = E.ATTRIB_VALUE_UNQUOTED, Pe = "attribValue";
                break;
            }
            if (w === ";") {
              var Oe = Ze(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Oe) ? ((f.entityCount += 1) > f.opt.maxEntityCount && k(
                f,
                "Parsed entity count exceeds max entity count"
              ), (f.entityDepth += 1) > f.opt.maxEntityDepth && k(
                f,
                "Parsed entity depth exceeds max entity depth"
              ), f.entity = "", f.state = pe, f.write(Oe), f.entityDepth -= 1) : (f[Pe] += Oe, f.entity = "", f.state = pe);
            } else se(f.entity.length ? B : O, w) ? f.entity += w : (N(f, "Invalid character in entity name"), f[Pe] += "&" + f.entity + w, f.entity = "", f.state = pe);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, f = Math.floor, R = function() {
        var w = 16384, K = [], ce, pe, Pe = -1, Oe = arguments.length;
        if (!Oe)
          return "";
        for (var et = ""; ++Pe < Oe; ) {
          var ye = Number(arguments[Pe]);
          if (!isFinite(ye) || // `NaN`, `+Infinity`, or `-Infinity`
          ye < 0 || // not a valid Unicode code point
          ye > 1114111 || // not a valid Unicode code point
          f(ye) !== ye)
            throw RangeError("Invalid code point: " + ye);
          ye <= 65535 ? K.push(ye) : (ye -= 65536, ce = (ye >> 10) + 55296, pe = ye % 1024 + 56320, K.push(ce, pe)), (Pe + 1 === Oe || K.length > w) && (et += h.apply(null, K), K.length = 0);
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
})(j0);
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.XElement = void 0;
Qn.parseXml = Ry;
const wy = j0, ki = zr;
class H0 {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, ki.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!vy(t))
      throw (0, ki.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, ki.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, ki.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (_u(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => _u(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Qn.XElement = H0;
const by = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function vy(e) {
  return by.test(e);
}
function _u(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Ry(e) {
  let t = null;
  const r = wy.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new H0(i.name);
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
Er.mapToObject = G0;
Er.isValidKey = Ws;
Er.asArray = Cy;
Er.deepAssign = Ay;
Er.objectToArgs = Dy;
function G0(e) {
  const t = {};
  for (const [r, n] of e)
    Ws(r) && (n instanceof Map ? t[r] = G0(n) : t[r] = n);
  return t;
}
function Ws(e) {
  return ["__proto__", "prototype", "constructor"].includes(e) ? !1 : ["string", "number", "symbol", "boolean"].includes(typeof e) || e === null;
}
function Cy(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function mu(e) {
  if (Array.isArray(e))
    return !1;
  const t = typeof e;
  return t === "object" || t === "function";
}
function Iy(e, t, r) {
  const n = t[r];
  if (n === void 0)
    return;
  const i = e[r];
  i == null || n == null || !mu(i) || !mu(n) ? Array.isArray(i) && Array.isArray(n) ? e[r] = Array.from(new Set(i.concat(n))) : e[r] = n : e[r] = W0(i, n);
}
function W0(e, t) {
  if (e !== t)
    for (const r of Object.getOwnPropertyNames(t))
      Ws(r) && Iy(e, t, r);
  return e;
}
function Ay(e, ...t) {
  for (const r of t)
    r != null && W0(e, r);
  return e;
}
const Sy = /^[a-zA-Z][a-zA-Z0-9-]*$/, Ty = /[\0\r\n]/;
function Dy(e) {
  const t = Object.entries(e).reduce((r, [n, i]) => {
    if (!Ws(n) || i == null)
      return r;
    if (!Sy.test(n))
      throw new Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(n)}`);
    if (Ty.test(i))
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
  var n = we;
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
  var i = Gs;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = Kn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var o = Jn;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return o.githubTagPrefix;
  } });
  var a = Il;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = Al;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var p = Gr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var l = Qn;
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
})(be);
var Te = {}, Sl = {}, at = {};
function V0(e) {
  return typeof e > "u" || e === null;
}
function Py(e) {
  return typeof e == "object" && e !== null;
}
function Oy(e) {
  return Array.isArray(e) ? e : V0(e) ? [] : [e];
}
function $y(e, t) {
  if (t) {
    const r = Object.keys(t);
    for (let n = 0, i = r.length; n < i; n += 1) {
      const s = r[n];
      e[s] = t[s];
    }
  }
  return e;
}
function Ly(e, t) {
  let r = "";
  for (let n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Ny(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
at.isNothing = V0;
at.isObject = Py;
at.toArray = Oy;
at.repeat = Ly;
at.isNegativeZero = Ny;
at.extend = $y;
function z0(e, t) {
  let r = "";
  const n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Nn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = z0(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Nn.prototype = Object.create(Error.prototype);
Nn.prototype.constructor = Nn;
Nn.prototype.toString = function(t) {
  return this.name + ": " + z0(this, t);
};
var Zn = Nn;
const yn = at;
function Yo(e, t, r, n, i) {
  let s = "", o = "";
  const a = Math.floor(i / 2) - 1;
  return n - t > a && (s = " ... ", t = n - a + s.length), r - n > a && (o = " ...", r = n + a - o.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + s.length
    // relative position
  };
}
function Xo(e, t) {
  return yn.repeat(" ", t - e.length) + e;
}
function Fy(e, t) {
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
    const d = Yo(
      e.buffer,
      n[o - u],
      i[o - u],
      e.position - (n[o] - n[o - u]),
      p
    );
    a = yn.repeat(" ", t.indent) + Xo((e.line - u + 1).toString(), c) + " | " + d.str + `
` + a;
  }
  const l = Yo(e.buffer, n[o], i[o], e.position, p);
  a += yn.repeat(" ", t.indent) + Xo((e.line + 1).toString(), c) + " | " + l.str + `
`, a += yn.repeat("-", t.indent + c + 3 + l.pos) + `^
`;
  for (let u = 1; u <= t.linesAfter && !(o + u >= i.length); u++) {
    const d = Yo(
      e.buffer,
      n[o + u],
      i[o + u],
      e.position - (n[o] - n[o + u]),
      p
    );
    a += yn.repeat(" ", t.indent) + Xo((e.line + u + 1).toString(), c) + " | " + d.str + `
`;
  }
  return a.replace(/\n$/, "");
}
var Uy = Fy;
const gu = Zn, By = [
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
], My = [
  "scalar",
  "sequence",
  "mapping"
];
function ky(e) {
  const t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function qy(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (By.indexOf(r) === -1)
      throw new gu('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = ky(t.styleAliases || null), My.indexOf(this.kind) === -1)
    throw new gu('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var je = qy;
const dn = Zn, Ko = je;
function xu(e, t) {
  const r = [];
  return e[t].forEach(function(n) {
    let i = r.length;
    r.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function jy() {
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
function Ja(e) {
  return this.extend(e);
}
Ja.prototype.extend = function(t) {
  let r = [], n = [];
  if (t instanceof Ko)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new dn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof Ko))
      throw new dn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new dn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new dn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof Ko))
      throw new dn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  const i = Object.create(Ja.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = xu(i, "implicit"), i.compiledExplicit = xu(i, "explicit"), i.compiledTypeMap = jy(i.compiledImplicit, i.compiledExplicit), i;
};
var Y0 = Ja;
const Hy = je;
var X0 = new Hy("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
});
const Gy = je;
var K0 = new Gy("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
});
const Wy = je;
var J0 = new Wy("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
});
const Vy = Y0;
var Q0 = new Vy({
  explicit: [
    X0,
    K0,
    J0
  ]
});
const zy = je;
function Yy(e) {
  if (e === null) return !0;
  const t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Xy() {
  return null;
}
function Ky(e) {
  return e === null;
}
var Z0 = new zy("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Yy,
  construct: Xy,
  predicate: Ky,
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
const Jy = je;
function Qy(e) {
  if (e === null) return !1;
  const t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Zy(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function e1(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var eh = new Jy("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Qy,
  construct: Zy,
  predicate: e1,
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
const t1 = at, r1 = je;
function n1(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function i1(e) {
  return e >= 48 && e <= 55;
}
function s1(e) {
  return e >= 48 && e <= 57;
}
function o1(e) {
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
      return n && isFinite(En(e));
    }
    if (i === "x") {
      for (r++; r < t; r++) {
        if (!n1(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(En(e));
    }
    if (i === "o") {
      for (r++; r < t; r++) {
        if (!i1(e.charCodeAt(r))) return !1;
        n = !0;
      }
      return n && isFinite(En(e));
    }
  }
  for (; r < t; r++) {
    if (!s1(e.charCodeAt(r)))
      return !1;
    n = !0;
  }
  return n ? isFinite(En(e)) : !1;
}
function En(e) {
  let t = e, r = 1, n = t[0];
  if ((n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function a1(e) {
  return En(e);
}
function l1(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !t1.isNegativeZero(e);
}
var th = new r1("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: o1,
  construct: a1,
  predicate: l1,
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
const rh = at, c1 = je, u1 = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
), f1 = new RegExp(
  "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function d1(e) {
  return e === null || !u1.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : f1.test(e);
}
function h1(e) {
  let t = e.toLowerCase();
  const r = t[0] === "-" ? -1 : 1;
  return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
const p1 = /^[-+]?[0-9]+e/;
function _1(e, t) {
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
  else if (rh.isNegativeZero(e))
    return "-0.0";
  const r = e.toString(10);
  return p1.test(r) ? r.replace("e", ".e") : r;
}
function m1(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || rh.isNegativeZero(e));
}
var nh = new c1("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: d1,
  construct: h1,
  predicate: m1,
  represent: _1,
  defaultStyle: "lowercase"
}), ih = Q0.extend({
  implicit: [
    Z0,
    eh,
    th,
    nh
  ]
}), sh = ih;
const g1 = je, oh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ah = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function x1(e) {
  return e === null ? !1 : oh.exec(e) !== null || ah.exec(e) !== null;
}
function y1(e) {
  let t = 0, r = null, n = oh.exec(e);
  if (n === null && (n = ah.exec(e)), n === null) throw new Error("Date resolve error");
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
function E1(e) {
  return e.toISOString();
}
var lh = new g1("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: x1,
  construct: y1,
  instanceOf: Date,
  represent: E1
});
const w1 = je;
function b1(e) {
  return e === "<<" || e === null;
}
var ch = new w1("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: b1
});
const v1 = je, Tl = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function R1(e) {
  if (e === null) return !1;
  let t = 0;
  const r = e.length, n = Tl;
  for (let i = 0; i < r; i++) {
    const s = n.indexOf(e.charAt(i));
    if (!(s > 64)) {
      if (s < 0) return !1;
      t += 6;
    }
  }
  return t % 8 === 0;
}
function C1(e) {
  const t = e.replace(/[\r\n=]/g, ""), r = t.length, n = Tl;
  let i = 0;
  const s = [];
  for (let a = 0; a < r; a++)
    a % 4 === 0 && a && (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)), i = i << 6 | n.indexOf(t.charAt(a));
  const o = r % 4 * 6;
  return o === 0 ? (s.push(i >> 16 & 255), s.push(i >> 8 & 255), s.push(i & 255)) : o === 18 ? (s.push(i >> 10 & 255), s.push(i >> 2 & 255)) : o === 12 && s.push(i >> 4 & 255), new Uint8Array(s);
}
function I1(e) {
  let t = "", r = 0;
  const n = e.length, i = Tl;
  for (let o = 0; o < n; o++)
    o % 3 === 0 && o && (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]), r = (r << 8) + e[o];
  const s = n % 3;
  return s === 0 ? (t += i[r >> 18 & 63], t += i[r >> 12 & 63], t += i[r >> 6 & 63], t += i[r & 63]) : s === 2 ? (t += i[r >> 10 & 63], t += i[r >> 4 & 63], t += i[r << 2 & 63], t += i[64]) : s === 1 && (t += i[r >> 2 & 63], t += i[r << 4 & 63], t += i[64], t += i[64]), t;
}
function A1(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var uh = new v1("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: R1,
  construct: C1,
  predicate: A1,
  represent: I1
});
const S1 = je, yu = Object.prototype.hasOwnProperty, T1 = Object.prototype.toString;
function D1(e) {
  if (e === null) return !0;
  const t = {}, r = e;
  for (let n = 0, i = r.length; n < i; n += 1) {
    const s = r[n];
    let o = !1;
    if (T1.call(s) !== "[object Object]") return !1;
    let a;
    for (a in s)
      if (yu.call(s, a))
        if (!o) o = !0;
        else return !1;
    if (!o || yu.call(t, a)) return !1;
    Object.defineProperty(t, a, { value: !0 });
  }
  return !0;
}
function P1(e) {
  return e !== null ? e : [];
}
var fh = new S1("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: D1,
  construct: P1
});
const O1 = je, $1 = Object.prototype.toString;
function L1(e) {
  if (e === null) return !0;
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n];
    if ($1.call(s) !== "[object Object]") return !1;
    const o = Object.keys(s);
    if (o.length !== 1) return !1;
    r[n] = [o[0], s[o[0]]];
  }
  return !0;
}
function N1(e) {
  if (e === null) return [];
  const t = e, r = new Array(t.length);
  for (let n = 0, i = t.length; n < i; n += 1) {
    const s = t[n], o = Object.keys(s);
    r[n] = [o[0], s[o[0]]];
  }
  return r;
}
var dh = new O1("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: L1,
  construct: N1
});
const F1 = je, U1 = Object.prototype.hasOwnProperty;
function B1(e) {
  if (e === null) return !0;
  const t = e;
  for (const r in t)
    if (U1.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function M1(e) {
  return e !== null ? e : {};
}
var hh = new F1("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: B1,
  construct: M1
}), Dl = sh.extend({
  implicit: [
    lh,
    ch
  ],
  explicit: [
    uh,
    fh,
    dh,
    hh
  ]
});
const ur = at, ph = Zn, k1 = Uy, q1 = Dl, ot = Object.prototype.hasOwnProperty, _s = 1, _h = 2, mh = 3, ms = 4, Jo = 1, j1 = 2, Eu = 3, H1 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, G1 = /[\x85\u2028\u2029]/, W1 = /[,\[\]{}]/, gh = /^(?:!|!!|![0-9A-Za-z-]+!)$/, xh = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
function wu(e) {
  return Object.prototype.toString.call(e);
}
function gt(e) {
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
function V1(e) {
  if (e >= 48 && e <= 57)
    return e - 48;
  const t = e | 32;
  return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
}
function z1(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Y1(e) {
  return e >= 48 && e <= 57 ? e - 48 : -1;
}
function bu(e) {
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
function X1(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function yh(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
const Eh = new Array(256), wh = new Array(256);
for (let e = 0; e < 256; e++)
  Eh[e] = bu(e) ? 1 : 0, wh[e] = bu(e);
function K1(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || q1, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
}
function bh(e, t) {
  const r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = k1(r), new ph(t, r);
}
function U(e, t) {
  throw bh(e, t);
}
function gs(e, t) {
  e.onWarning && e.onWarning.call(null, bh(e, t));
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
function J1(e) {
  e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
}
function Q1(e) {
  const t = e.anchorMapTransactions.pop(), r = e.anchorMapTransactions;
  if (r.length === 0) return;
  const n = r[r.length - 1], i = Object.keys(t);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    ot.call(n, a) || (n[a] = t[a]);
  }
}
function Z1(e) {
  const t = e.anchorMapTransactions.pop(), r = Object.keys(t);
  for (let n = r.length - 1; n >= 0; n -= 1) {
    const i = t[r[n]];
    i.existed ? e.anchorMap[r[n]] = i.value : delete e.anchorMap[r[n]];
  }
}
function vh(e) {
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
function vu(e, t) {
  e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
}
const Ru = {
  YAML: function(t, r, n) {
    t.version !== null && U(t, "duplication of %YAML directive"), n.length !== 1 && U(t, "YAML directive accepts exactly one argument");
    const i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
    i === null && U(t, "ill-formed argument of the YAML directive");
    const s = parseInt(i[1], 10), o = parseInt(i[2], 10);
    s !== 1 && U(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && gs(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    let i;
    n.length !== 2 && U(t, "TAG directive accepts exactly two arguments");
    const s = n[0];
    i = n[1], gh.test(s) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), ot.call(t.tagMap, s) && U(t, 'there is a previously declared suffix for "' + s + '" tag handle'), xh.test(i) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else H1.test(i) && U(e, "the stream contains non-printable characters");
    e.result += i;
  }
}
function Cu(e) {
  e.totalMergeKeys++, e.maxTotalMergeKeys !== -1 && e.totalMergeKeys > e.maxTotalMergeKeys && U(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")");
}
function Iu(e, t, r, n) {
  ur.isObject(r) || U(e, "cannot merge mappings; the provided source object is unacceptable"), Cu(e);
  const i = Object.keys(r);
  for (let s = 0, o = i.length; s < o; s += 1) {
    const a = i[s];
    Cu(e), ot.call(t, a) || (yh(t, a, r[a]), n[a] = !0);
  }
}
function Fr(e, t, r, n, i, s, o, a, c) {
  if (Array.isArray(i)) {
    i = Array.prototype.slice.call(i);
    for (let p = 0, l = i.length; p < l; p += 1)
      Array.isArray(i[p]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && wu(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  }
  if (typeof i == "object" && wu(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s)) {
      s.length > 100 && U(e, "abnormal merge sequence size");
      for (let p = 0, l = s.length; p < l; p += 1)
        Iu(e, t, s[p], r);
    } else
      Iu(e, t, s, r);
  else
    !e.json && !ot.call(r, i) && ot.call(t, i) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, U(e, "duplicated mapping key")), yh(t, i, s), delete r[i];
  return t;
}
function Pl(e) {
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
    if (gt(i))
      for (Pl(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && gs(e, "deficient indentation"), n;
}
function Vs(e) {
  let t = e.position, r = e.input.charCodeAt(t);
  return !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ve(r)));
}
function Ol(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += ur.repeat(`
`, t - 1));
}
function eE(e, t, r) {
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
      if (e.position === e.lineStart && Vs(e) || r && Nr(u))
        break;
      if (gt(u))
        if (o = e.line, a = e.lineStart, c = e.lineIndent, me(e, !1, -1), e.lineIndent >= t) {
          s = !0, u = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = i, e.line = o, e.lineStart = a, e.lineIndent = c;
          break;
        }
    }
    s && (Wt(e, n, i, !1), Ol(e, e.line - o), n = i = e.position, s = !1), Tt(u) || (i = e.position + 1), u = e.input.charCodeAt(++e.position);
  }
  return Wt(e, n, i, !1), e.result ? !0 : (e.kind = p, e.result = l, !1);
}
function tE(e, t) {
  let r, n, i = e.input.charCodeAt(e.position);
  if (i !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (i = e.input.charCodeAt(e.position)) !== 0; )
    if (i === 39)
      if (Wt(e, r, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39)
        r = e.position, e.position++, n = e.position;
      else
        return !0;
    else gt(i) ? (Wt(e, r, n, !0), Ol(e, me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Vs(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, Tt(i) || (n = e.position));
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function rE(e, t) {
  let r, n, i, s = e.input.charCodeAt(e.position);
  if (s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Wt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Wt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), gt(s))
        me(e, !1, t);
      else if (s < 256 && Eh[s])
        e.result += wh[s], e.position++;
      else if ((i = z1(s)) > 0) {
        let o = i, a = 0;
        for (; o > 0; o--)
          s = e.input.charCodeAt(++e.position), (i = V1(s)) >= 0 ? a = (a << 4) + i : U(e, "expected hexadecimal character");
        e.result += X1(a), e.position++;
      } else
        U(e, "unknown escape sequence");
      r = n = e.position;
    } else gt(s) ? (Wt(e, r, n, !0), Ol(e, me(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Vs(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, Tt(s) || (n = e.position));
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function nE(e, t) {
  let r = !0, n, i, s;
  const o = e.tag;
  let a;
  const c = e.anchor;
  let p, l, u, d;
  const _ = /* @__PURE__ */ Object.create(null);
  let g, x, y, v = e.input.charCodeAt(e.position);
  if (v === 91)
    p = 93, d = !1, a = [];
  else if (v === 123)
    p = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && fr(e, e.anchor, a), v = e.input.charCodeAt(++e.position); v !== 0; ) {
    if (me(e, !0, t), v = e.input.charCodeAt(e.position), v === p)
      return e.position++, e.tag = o, e.anchor = c, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    if (r ? v === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), x = g = y = null, l = u = !1, v === 63) {
      const C = e.input.charCodeAt(e.position + 1);
      Ve(C) && (l = u = !0, e.position++, me(e, !0, t));
    }
    n = e.line, i = e.lineStart, s = e.position, Wr(e, t, _s, !1, !0), x = e.tag, g = e.result, me(e, !0, t), v = e.input.charCodeAt(e.position), (u || e.line === n) && v === 58 && (l = !0, v = e.input.charCodeAt(++e.position), me(e, !0, t), Wr(e, t, _s, !1, !0), y = e.result), d ? Fr(e, a, _, x, g, y, n, i, s) : l ? a.push(Fr(e, null, _, x, g, y, n, i, s)) : a.push(g), me(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (r = !0, v = e.input.charCodeAt(++e.position)) : r = !1;
  }
  U(e, "unexpected end of the stream within a flow collection");
}
function iE(e, t) {
  let r, n = Jo, i = !1, s = !1, o = t, a = 0, c = !1, p, l = e.input.charCodeAt(e.position);
  if (l === 124)
    r = !1;
  else if (l === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; l !== 0; )
    if (l = e.input.charCodeAt(++e.position), l === 43 || l === 45)
      Jo === n ? n = l === 43 ? Eu : j1 : U(e, "repeat of a chomping mode identifier");
    else if ((p = Y1(l)) >= 0)
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
      while (!gt(l) && l !== 0);
  }
  for (; l !== 0; ) {
    for (Pl(e), e.lineIndent = 0, l = e.input.charCodeAt(e.position); (!s || e.lineIndent < o) && l === 32; )
      e.lineIndent++, l = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > o && (o = e.lineIndent), gt(l)) {
      a++;
      continue;
    }
    if (!s && o === 0 && U(e, "missing indentation for block scalar"), e.lineIndent < o) {
      n === Eu ? e.result += ur.repeat(`
`, i ? 1 + a : a) : n === Jo && i && (e.result += `
`);
      break;
    }
    r ? Tt(l) ? (c = !0, e.result += ur.repeat(`
`, i ? 1 + a : a)) : c ? (c = !1, e.result += ur.repeat(`
`, a + 1)) : a === 0 ? i && (e.result += " ") : e.result += ur.repeat(`
`, a) : e.result += ur.repeat(`
`, i ? 1 + a : a), i = !0, s = !0, a = 0;
    const u = e.position;
    for (; !gt(l) && l !== 0; )
      l = e.input.charCodeAt(++e.position);
    Wt(e, u, e.position, !1);
  }
  return !0;
}
function Au(e, t) {
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
    if (Wr(e, t, mh, !1, !0), i.push(e.result), me(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === c || e.lineIndent > t) && o !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = n, e.kind = "sequence", e.result = i, !0) : !1;
}
function Rh(e, t, r) {
  let n, i, s, o;
  const a = e.tag, c = e.anchor, p = {}, l = /* @__PURE__ */ Object.create(null);
  let u = null, d = null, _ = null, g = !1, x = !1;
  if (e.firstTabInLine !== -1) return !1;
  e.anchor !== null && fr(e, e.anchor, p);
  let y = e.input.charCodeAt(e.position);
  for (; y !== 0; ) {
    !g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation"));
    const v = e.input.charCodeAt(e.position + 1), C = e.line;
    if ((y === 63 || y === 58) && Ve(v))
      y === 63 ? (g && (Fr(e, p, l, u, d, null, i, s, o), u = d = _ = null), x = !0, g = !0, n = !0) : g ? (g = !1, n = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = v;
    else {
      if (i = e.line, s = e.lineStart, o = e.position, !Wr(e, r, _h, !1, !0))
        break;
      if (e.line === C) {
        for (y = e.input.charCodeAt(e.position); Tt(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), Ve(y) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (Fr(e, p, l, u, d, null, i, s, o), u = d = _ = null), x = !0, g = !1, n = !1, u = e.tag, d = e.result;
        else if (x)
          U(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = a, e.anchor = c, !0;
      } else if (x)
        U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = a, e.anchor = c, !0;
    }
    if ((e.line === C || e.lineIndent > t) && (g && (i = e.line, s = e.lineStart, o = e.position), Wr(e, t, ms, !0, n) && (g ? d = e.result : _ = e.result), g || (Fr(e, p, l, u, d, _, i, s, o), u = d = _ = null), me(e, !0, -1), y = e.input.charCodeAt(e.position)), (e.line === C || e.lineIndent > t) && y !== 0)
      U(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return g && Fr(e, p, l, u, d, null, i, s, o), x && (e.tag = a, e.anchor = c, e.kind = "mapping", e.result = p), x;
}
function sE(e) {
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
      s === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(o - 1, e.position + 1), gh.test(n) || U(e, "named tag handle cannot contain such characters"), r = !0, o = e.position + 1)), s = e.input.charCodeAt(++e.position);
    i = e.input.slice(o, e.position), W1.test(i) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  i && !xh.test(i) && U(e, "tag name cannot contain such characters: " + i);
  try {
    i = decodeURIComponent(i);
  } catch {
    U(e, "tag name is malformed: " + i);
  }
  return t ? e.tag = i : ot.call(e.tagMap, n) ? e.tag = e.tagMap[n] + i : n === "!" ? e.tag = "!" + i : n === "!!" ? e.tag = "tag:yaml.org,2002:" + i : U(e, 'undeclared tag handle "' + n + '"'), !0;
}
function oE(e) {
  let t = e.input.charCodeAt(e.position);
  if (t !== 38) return !1;
  e.anchor !== null && U(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
  const r = e.position;
  for (; t !== 0 && !Ve(t) && !Nr(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function aE(e) {
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
function lE(e, t, r, n) {
  const i = vh(e);
  return J1(e), vu(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, Rh(e, r, n) && e.kind === "mapping" ? (Q1(e), !0) : (Z1(e), vu(e, i), !1);
}
function Wr(e, t, r, n, i) {
  let s, o, a = 1, c = !1, p = !1, l = null, u, d, _;
  e.depth >= e.maxDepth && U(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
  const g = s = o = ms === r || mh === r;
  if (n && me(e, !0, -1) && (c = !0, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)), a === 1)
    for (; ; ) {
      const x = e.input.charCodeAt(e.position), y = vh(e);
      if (c && (x === 33 && e.tag !== null || x === 38 && e.anchor !== null) || !sE(e) && !oE(e))
        break;
      l === null && (l = y), me(e, !0, -1) ? (c = !0, o = g, e.lineIndent > t ? a = 1 : e.lineIndent === t ? a = 0 : e.lineIndent < t && (a = -1)) : o = !1;
    }
  if (o && (o = c || i), a === 1 || ms === r)
    if (_s === r || _h === r ? d = t : d = t + 1, _ = e.position - e.lineStart, a === 1)
      if (o && (Au(e, _) || Rh(e, _, d)) || nE(e, d))
        p = !0;
      else {
        const x = e.input.charCodeAt(e.position);
        l !== null && g && !o && x !== 124 && x !== 62 && lE(
          e,
          l,
          l.position - l.lineStart,
          d
        ) || s && iE(e, d) || tE(e, d) || rE(e, d) ? p = !0 : aE(e) ? (p = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : eE(e, d, _s === r) && (p = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && fr(e, e.anchor, e.result);
      }
    else a === 0 && (p = o && Au(e, _));
  if (e.tag === null)
    e.anchor !== null && fr(e, e.anchor, e.result);
  else if (e.tag === "?") {
    e.result !== null && e.kind !== "scalar" && U(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"');
    for (let x = 0, y = e.implicitTypes.length; x < y; x += 1)
      if (u = e.implicitTypes[x], u.resolve(e.result)) {
        e.result = u.construct(e.result), e.tag = u.tag, e.anchor !== null && fr(e, e.anchor, e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (ot.call(e.typeMap[e.kind || "fallback"], e.tag))
      u = e.typeMap[e.kind || "fallback"][e.tag];
    else {
      u = null;
      const x = e.typeMap.multi[e.kind || "fallback"];
      for (let y = 0, v = x.length; y < v; y += 1)
        if (e.tag.slice(0, x[y].tag.length) === x[y].tag) {
          u = x[y];
          break;
        }
    }
    u || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && u.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + u.kind + '", not "' + e.kind + '"'), u.resolve(e.result, e.tag) ? (e.result = u.construct(e.result, e.tag), e.anchor !== null && fr(e, e.anchor, e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.depth -= 1, e.tag !== null || e.anchor !== null || p;
}
function cE(e) {
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
        while (n !== 0 && !gt(n));
        break;
      }
      if (gt(n)) break;
      for (i = e.position; n !== 0 && !Ve(n); )
        n = e.input.charCodeAt(++e.position);
      o.push(e.input.slice(i, e.position));
    }
    n !== 0 && Pl(e), ot.call(Ru, s) ? Ru[s](e, s, o) : gs(e, 'unknown document directive "' + s + '"');
  }
  if (me(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, me(e, !0, -1)) : r && U(e, "directives end mark is expected"), Wr(e, e.lineIndent - 1, ms, !1, !0), me(e, !0, -1), e.checkLineBreaks && G1.test(e.input.slice(t, e.position)) && gs(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Vs(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, me(e, !0, -1));
    return;
  }
  e.position < e.length - 1 && U(e, "end of the stream or a document separator is expected");
}
function Ch(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  const r = new K1(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, U(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    cE(r);
  return r.documents;
}
function uE(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  const n = Ch(e, r);
  if (typeof t != "function")
    return n;
  for (let i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function fE(e, t) {
  const r = Ch(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new ph("expected a single document in the stream, but found more");
  }
}
Sl.loadAll = uE;
Sl.load = fE;
var Ih = {};
const zs = at, ei = Zn, dE = Dl, Ah = Object.prototype.toString, Sh = Object.prototype.hasOwnProperty, $l = 65279, hE = 9, Fn = 10, pE = 13, _E = 32, mE = 33, gE = 34, Qa = 35, xE = 37, yE = 38, EE = 39, wE = 42, Th = 44, bE = 45, xs = 58, vE = 61, RE = 62, CE = 63, IE = 64, Dh = 91, Ph = 93, AE = 96, Oh = 123, SE = 124, $h = 125, Fe = {};
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
const TE = [
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
], DE = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function PE(e, t) {
  if (t === null) return {};
  const r = {}, n = Object.keys(t);
  for (let i = 0, s = n.length; i < s; i += 1) {
    let o = n[i], a = String(t[o]);
    o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2));
    const c = e.compiledTypeMap.fallback[o];
    c && Sh.call(c.styleAliases, a) && (a = c.styleAliases[a]), r[o] = a;
  }
  return r;
}
function OE(e) {
  let t, r;
  const n = e.toString(16).toUpperCase();
  if (e <= 255)
    t = "x", r = 2;
  else if (e <= 65535)
    t = "u", r = 4;
  else if (e <= 4294967295)
    t = "U", r = 8;
  else
    throw new ei("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + zs.repeat("0", r - n.length) + n;
}
const $E = 1, Un = 2;
function LE(e) {
  this.schema = e.schema || dE, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = zs.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = PE(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Un : $E, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Su(e, t) {
  const r = zs.repeat(" ", t);
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
function Za(e, t) {
  return `
` + zs.repeat(" ", e.indent * t);
}
function NE(e, t) {
  for (let r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (e.implicitTypes[r].resolve(t))
      return !0;
  return !1;
}
function ys(e) {
  return e === _E || e === hE;
}
function Bn(e) {
  return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== $l || e >= 65536 && e <= 1114111;
}
function Tu(e) {
  return Bn(e) && e !== $l && // - b-char
  e !== pE && e !== Fn;
}
function Du(e, t, r) {
  const n = Tu(e), i = n && !ys(e);
  return (
    // ns-plain-safe
    (r ? n : n && // - c-flow-indicator
    e !== Th && e !== Dh && e !== Ph && e !== Oh && e !== $h) && // ns-plain-char
    e !== Qa && // false on '#'
    !(t === xs && !i) || // false on ': '
    Tu(t) && !ys(t) && e === Qa || // change to true on '[^ ]#'
    t === xs && i
  );
}
function FE(e) {
  return Bn(e) && e !== $l && !ys(e) && // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  e !== bE && e !== CE && e !== xs && e !== Th && e !== Dh && e !== Ph && e !== Oh && e !== $h && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  e !== Qa && e !== yE && e !== wE && e !== mE && e !== SE && e !== vE && e !== RE && e !== EE && e !== gE && // | “%” | “@” | “`”)
  e !== xE && e !== IE && e !== AE;
}
function UE(e) {
  return !ys(e) && e !== xs;
}
function wn(e, t) {
  const r = e.charCodeAt(t);
  let n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Lh(e) {
  return /^\n* /.test(e);
}
const Nh = 1, el = 2, Fh = 3, Uh = 4, Or = 5;
function BE(e, t, r, n, i, s, o, a) {
  let c, p = 0, l = null, u = !1, d = !1;
  const _ = n !== -1;
  let g = -1, x = FE(wn(e, 0)) && UE(wn(e, e.length - 1));
  if (t || o)
    for (c = 0; c < e.length; p >= 65536 ? c += 2 : c++) {
      if (p = wn(e, c), !Bn(p))
        return Or;
      x = x && Du(p, l, a), l = p;
    }
  else {
    for (c = 0; c < e.length; p >= 65536 ? c += 2 : c++) {
      if (p = wn(e, c), p === Fn)
        u = !0, _ && (d = d || // Foldable line = too long, and not more-indented.
        c - g - 1 > n && e[g + 1] !== " ", g = c);
      else if (!Bn(p))
        return Or;
      x = x && Du(p, l, a), l = p;
    }
    d = d || _ && c - g - 1 > n && e[g + 1] !== " ";
  }
  return !u && !d ? x && !o && !i(e) ? Nh : s === Un ? Or : el : r > 9 && Lh(e) ? Or : o ? s === Un ? Or : el : d ? Uh : Fh;
}
function ME(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Un ? '""' : "''";
    if (!e.noCompatMode && (TE.indexOf(t) !== -1 || DE.test(t)))
      return e.quotingType === Un ? '"' + t + '"' : "'" + t + "'";
    const s = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || // No block styles in flow mode.
    e.flowLevel > -1 && r >= e.flowLevel;
    function c(p) {
      return NE(e, p);
    }
    switch (BE(
      t,
      a,
      e.indent,
      o,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Nh:
        return t;
      case el:
        return "'" + t.replace(/'/g, "''") + "'";
      case Fh:
        return "|" + Pu(t, e.indent) + Ou(Su(t, s));
      case Uh:
        return ">" + Pu(t, e.indent) + Ou(Su(kE(t, o), s));
      case Or:
        return '"' + qE(t) + '"';
      default:
        throw new ei("impossible error: invalid scalar style");
    }
  }();
}
function Pu(e, t) {
  const r = Lh(e) ? String(t) : "", n = e[e.length - 1] === `
`, s = n && (e[e.length - 2] === `
` || e === `
`) ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function Ou(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function kE(e, t) {
  const r = /(\n+)([^\n]*)/g;
  let n = function() {
    let a = e.indexOf(`
`);
    return a = a !== -1 ? a : e.length, r.lastIndex = a, $u(e.slice(0, a), t);
  }(), i = e[0] === `
` || e[0] === " ", s, o;
  for (; o = r.exec(e); ) {
    const a = o[1], c = o[2];
    s = c[0] === " ", n += a + (!i && !s && c !== "" ? `
` : "") + $u(c, t), i = s;
  }
  return n;
}
function $u(e, t) {
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
function qE(e) {
  let t = "", r = 0;
  for (let n = 0; n < e.length; r >= 65536 ? n += 2 : n++) {
    r = wn(e, n);
    const i = Fe[r];
    !i && Bn(r) ? (t += e[n], r >= 65536 && (t += e[n + 1])) : t += i || OE(r);
  }
  return t;
}
function jE(e, t, r) {
  let n = "";
  const i = e.tag;
  for (let s = 0, o = r.length; s < o; s += 1) {
    let a = r[s];
    e.replacer && (a = e.replacer.call(r, String(s), a)), (Dt(e, t, a, !1, !1) || typeof a > "u" && Dt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  }
  e.tag = i, e.dump = "[" + n + "]";
}
function Lu(e, t, r, n) {
  let i = "";
  const s = e.tag;
  for (let o = 0, a = r.length; o < a; o += 1) {
    let c = r[o];
    e.replacer && (c = e.replacer.call(r, String(o), c)), (Dt(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Dt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Za(e, t)), e.dump && Fn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  }
  e.tag = s, e.dump = i || "[]";
}
function HE(e, t, r) {
  let n = "";
  const i = e.tag, s = Object.keys(r);
  for (let o = 0, a = s.length; o < a; o += 1) {
    let c = "";
    n !== "" && (c += ", "), e.condenseFlow && (c += '"');
    const p = s[o];
    let l = r[p];
    e.replacer && (l = e.replacer.call(r, p, l)), Dt(e, t, p, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Dt(e, t, l, !1, !1) && (c += e.dump, n += c));
  }
  e.tag = i, e.dump = "{" + n + "}";
}
function GE(e, t, r, n) {
  let i = "";
  const s = e.tag, o = Object.keys(r);
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new ei("sortKeys must be a boolean or a function");
  for (let a = 0, c = o.length; a < c; a += 1) {
    let p = "";
    (!n || i !== "") && (p += Za(e, t));
    const l = o[a];
    let u = r[l];
    if (e.replacer && (u = e.replacer.call(r, l, u)), !Dt(e, t + 1, l, !0, !0, !0))
      continue;
    const d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
    d && (e.dump && Fn === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, d && (p += Za(e, t)), Dt(e, t + 1, u, !0, d) && (e.dump && Fn === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p);
  }
  e.tag = s, e.dump = i || "{}";
}
function Nu(e, t, r) {
  const n = r ? e.explicitTypes : e.implicitTypes;
  for (let i = 0, s = n.length; i < s; i += 1) {
    const o = n[i];
    if ((o.instanceOf || o.predicate) && (!o.instanceOf || typeof t == "object" && t instanceof o.instanceOf) && (!o.predicate || o.predicate(t))) {
      if (r ? o.multi && o.representName ? e.tag = o.representName(t) : e.tag = o.tag : e.tag = "?", o.represent) {
        const a = e.styleMap[o.tag] || o.defaultStyle;
        let c;
        if (Ah.call(o.represent) === "[object Function]")
          c = o.represent(t, a);
        else if (Sh.call(o.represent, a))
          c = o.represent[a](t, a);
        else
          throw new ei("!<" + o.tag + '> tag resolver accepts not "' + a + '" style');
        e.dump = c;
      }
      return !0;
    }
  }
  return !1;
}
function Dt(e, t, r, n, i, s, o) {
  e.tag = null, e.dump = r, Nu(e, r, !1) || Nu(e, r, !0);
  const a = Ah.call(e.dump), c = n;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  const p = a === "[object Object]" || a === "[object Array]";
  let l, u;
  if (p && (l = e.duplicates.indexOf(r), u = l !== -1), (e.tag !== null && e.tag !== "?" || u || e.indent !== 2 && t > 0) && (i = !1), u && e.usedDuplicates[l])
    e.dump = "*ref_" + l;
  else {
    if (p && u && !e.usedDuplicates[l] && (e.usedDuplicates[l] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (GE(e, t, e.dump, i), u && (e.dump = "&ref_" + l + e.dump)) : (HE(e, t, e.dump), u && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? Lu(e, t - 1, e.dump, i) : Lu(e, t, e.dump, i), u && (e.dump = "&ref_" + l + e.dump)) : (jE(e, t, e.dump), u && (e.dump = "&ref_" + l + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && ME(e, e.dump, t, s, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new ei("unacceptable kind of an object to dump " + a);
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
function WE(e, t) {
  const r = [], n = [];
  tl(e, r, n);
  const i = n.length;
  for (let s = 0; s < i; s += 1)
    t.duplicates.push(r[n[s]]);
  t.usedDuplicates = new Array(i);
}
function tl(e, t, r) {
  if (e !== null && typeof e == "object") {
    const n = t.indexOf(e);
    if (n !== -1)
      r.indexOf(n) === -1 && r.push(n);
    else if (t.push(e), Array.isArray(e))
      for (let i = 0, s = e.length; i < s; i += 1)
        tl(e[i], t, r);
    else {
      const i = Object.keys(e);
      for (let s = 0, o = i.length; s < o; s += 1)
        tl(e[i[s]], t, r);
    }
  }
}
function VE(e, t) {
  t = t || {};
  const r = new LE(t);
  r.noRefs || WE(e, r);
  let n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Dt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Ih.dump = VE;
const Bh = Sl, zE = Ih;
function Ll(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Te.Type = je;
Te.Schema = Y0;
Te.FAILSAFE_SCHEMA = Q0;
Te.JSON_SCHEMA = ih;
Te.CORE_SCHEMA = sh;
Te.DEFAULT_SCHEMA = Dl;
Te.load = Bh.load;
Te.loadAll = Bh.loadAll;
Te.dump = zE.dump;
Te.YAMLException = Zn;
Te.types = {
  binary: uh,
  float: nh,
  map: J0,
  null: Z0,
  pairs: dh,
  set: hh,
  timestamp: lh,
  bool: eh,
  int: th,
  merge: ch,
  omap: fh,
  seq: K0,
  str: X0
};
Te.safeLoad = Ll("safeLoad", "load");
Te.safeLoadAll = Ll("safeLoadAll", "loadAll");
Te.safeDump = Ll("safeDump", "dump");
var Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.Lazy = void 0;
class YE {
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
Ys.Lazy = YE;
var rl = { exports: {} };
const XE = "2.0.0", Mh = 256, KE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, JE = 16, QE = Mh - 6, ZE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Xs = {
  MAX_LENGTH: Mh,
  MAX_SAFE_COMPONENT_LENGTH: JE,
  MAX_SAFE_BUILD_LENGTH: QE,
  MAX_SAFE_INTEGER: KE,
  RELEASE_TYPES: ZE,
  SEMVER_SPEC_VERSION: XE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ew = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ks = ew;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Xs, s = Ks;
  t = e.exports = {};
  const o = t.re = [], a = t.safeRe = [], c = t.src = [], p = t.safeSrc = [], l = t.t = {};
  let u = 0;
  const d = "[a-zA-Z0-9-]", _ = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], g = (y) => {
    for (const [v, C] of _)
      y = y.split(`${v}*`).join(`${v}{0,${C}}`).split(`${v}+`).join(`${v}{1,${C}}`);
    return y;
  }, x = (y, v, C) => {
    const O = g(v), B = u++;
    s(y, B, v), l[y] = B, c[B] = v, p[B] = O, o[B] = new RegExp(v, C ? "g" : void 0), a[B] = new RegExp(O, C ? "g" : void 0);
  };
  x("NUMERICIDENTIFIER", "0|[1-9]\\d*"), x("NUMERICIDENTIFIERLOOSE", "\\d+"), x("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), x("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), x("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), x("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), x("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), x("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), x("BUILDIDENTIFIER", `${d}+`), x("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), x("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), x("FULL", `^${c[l.FULLPLAIN]}$`), x("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), x("LOOSE", `^${c[l.LOOSEPLAIN]}$`), x("GTLT", "((?:<|>)?=?)"), x("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), x("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), x("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), x("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), x("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), x("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), x("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), x("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), x("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), x("COERCERTL", c[l.COERCE], !0), x("COERCERTLFULL", c[l.COERCEFULL], !0), x("LONETILDE", "(?:~>?)"), x("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", x("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), x("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), x("LONECARET", "(?:\\^)"), x("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", x("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), x("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), x("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), x("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), x("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", x("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), x("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), x("STAR", "(<|>)?=?\\s*\\*"), x("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), x("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(rl, rl.exports);
var ti = rl.exports;
const tw = Object.freeze({ loose: !0 }), rw = Object.freeze({}), nw = (e) => e ? typeof e != "object" ? tw : e : rw;
var Nl = nw;
const Fu = /^[0-9]+$/, kh = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Fu.test(e), n = Fu.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, iw = (e, t) => kh(t, e);
var qh = {
  compareIdentifiers: kh,
  rcompareIdentifiers: iw
};
const qi = Ks, { MAX_LENGTH: Uu, MAX_SAFE_INTEGER: ji } = Xs, { safeRe: Hi, t: Gi } = ti, sw = Nl, { compareIdentifiers: Qo } = qh;
let ow = class ht {
  constructor(t, r) {
    if (r = sw(r), t instanceof ht) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Uu)
      throw new TypeError(
        `version is longer than ${Uu} characters`
      );
    qi("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Hi[Gi.LOOSE] : Hi[Gi.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ji || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ji || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ji || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < ji)
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
    if (qi("SemVer.compare", this.version, this.options, t), !(t instanceof ht)) {
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
      if (qi("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Qo(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ht || (t = new ht(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (qi("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Qo(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Hi[Gi.PRERELEASELOOSE] : Hi[Gi.PRERELEASE]);
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
          n === !1 && (s = [r]), Qo(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var He = ow;
const Bu = He, aw = (e, t, r = !1) => {
  if (e instanceof Bu)
    return e;
  try {
    return new Bu(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Yr = aw;
const lw = Yr, cw = (e, t) => {
  const r = lw(e, t);
  return r ? r.version : null;
};
var uw = cw;
const fw = Yr, dw = (e, t) => {
  const r = fw(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var hw = dw;
const Mu = He, pw = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Mu(
      e instanceof Mu ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var _w = pw;
const ku = Yr, mw = (e, t) => {
  const r = ku(e, null, !0), n = ku(t, null, !0), i = r.compare(n);
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
var gw = mw;
const xw = He, yw = (e, t) => new xw(e, t).major;
var Ew = yw;
const ww = He, bw = (e, t) => new ww(e, t).minor;
var vw = bw;
const Rw = He, Cw = (e, t) => new Rw(e, t).patch;
var Iw = Cw;
const Aw = Yr, Sw = (e, t) => {
  const r = Aw(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Tw = Sw;
const qu = He, Dw = (e, t, r) => new qu(e, r).compare(new qu(t, r));
var lt = Dw;
const Pw = lt, Ow = (e, t, r) => Pw(t, e, r);
var $w = Ow;
const Lw = lt, Nw = (e, t) => Lw(e, t, !0);
var Fw = Nw;
const ju = He, Uw = (e, t, r) => {
  const n = new ju(e, r), i = new ju(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Fl = Uw;
const Bw = Fl, Mw = (e, t) => e.sort((r, n) => Bw(r, n, t));
var kw = Mw;
const qw = Fl, jw = (e, t) => e.sort((r, n) => qw(n, r, t));
var Hw = jw;
const Gw = lt, Ww = (e, t, r) => Gw(e, t, r) > 0;
var Js = Ww;
const Vw = lt, zw = (e, t, r) => Vw(e, t, r) < 0;
var Ul = zw;
const Yw = lt, Xw = (e, t, r) => Yw(e, t, r) === 0;
var jh = Xw;
const Kw = lt, Jw = (e, t, r) => Kw(e, t, r) !== 0;
var Hh = Jw;
const Qw = lt, Zw = (e, t, r) => Qw(e, t, r) >= 0;
var Bl = Zw;
const eb = lt, tb = (e, t, r) => eb(e, t, r) <= 0;
var Ml = tb;
const rb = jh, nb = Hh, ib = Js, sb = Bl, ob = Ul, ab = Ml, lb = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return rb(e, r, n);
    case "!=":
      return nb(e, r, n);
    case ">":
      return ib(e, r, n);
    case ">=":
      return sb(e, r, n);
    case "<":
      return ob(e, r, n);
    case "<=":
      return ab(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Gh = lb;
const cb = He, ub = Yr, { safeRe: Wi, t: Vi } = ti, fb = (e, t) => {
  if (e instanceof cb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Wi[Vi.COERCEFULL] : Wi[Vi.COERCE]);
  else {
    const c = t.includePrerelease ? Wi[Vi.COERCERTLFULL] : Wi[Vi.COERCERTL];
    let p;
    for (; (p = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || p.index + p[0].length !== r.index + r[0].length) && (r = p), c.lastIndex = p.index + p[1].length + p[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", a = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ub(`${n}.${i}.${s}${o}${a}`, t);
};
var db = fb;
class hb {
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
var pb = hb, Zo, Hu;
function ct() {
  if (Hu) return Zo;
  Hu = 1;
  const e = /\s+/g;
  class t {
    constructor(S, $) {
      if ($ = i($), S instanceof t)
        return S.loose === !!$.loose && S.includePrerelease === !!$.includePrerelease ? S : new t(S.raw, $);
      if (S instanceof s)
        return this.raw = S.value, this.set = [[S]], this.formatted = void 0, this;
      if (this.options = $, this.loose = !!$.loose, this.includePrerelease = !!$.includePrerelease, this.raw = S.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((L) => !x(L[0])), this.set.length === 0)
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
          const $ = this.set[S];
          for (let A = 0; A < $.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += $[A].toString().trim();
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
      const A = ((this.options.includePrerelease && _) | (this.options.loose && g)) + ":" + S, L = n.get(A);
      if (L)
        return L;
      const P = this.options.loose, k = P ? c[p.HYPHENRANGELOOSE] : c[p.HYPHENRANGE];
      S = S.replace(k, Q(this.options.includePrerelease)), o("hyphen replace", S), S = S.replace(c[p.COMPARATORTRIM], l), o("comparator trim", S), S = S.replace(c[p.TILDETRIM], u), o("tilde trim", S), S = S.replace(c[p.CARETTRIM], d), o("caret trim", S);
      let z = S.split(" ").map((q) => C(q, this.options)).join(" ").split(/\s+/).map((q) => V(q, this.options));
      P && (z = z.filter((q) => (o("loose invalid filter", q, this.options), !!q.match(c[p.COMPARATORLOOSE])))), o("range list", z);
      const N = /* @__PURE__ */ new Map(), ee = z.map((q) => new s(q, this.options));
      for (const q of ee) {
        if (x(q))
          return [q];
        N.set(q.value, q);
      }
      N.size > 1 && N.has("") && N.delete("");
      const xe = [...N.values()];
      return n.set(A, xe), xe;
    }
    intersects(S, $) {
      if (!(S instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => v(A, $) && S.set.some((L) => v(L, $) && A.every((P) => L.every((k) => P.intersects(k, $)))));
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
      for (let $ = 0; $ < this.set.length; $++)
        if (le(this.set[$], S, this.options))
          return !0;
      return !1;
    }
  }
  Zo = t;
  const r = pb, n = new r(), i = Nl, s = Qs(), o = Ks, a = He, {
    safeRe: c,
    t: p,
    comparatorTrimReplace: l,
    tildeTrimReplace: u,
    caretTrimReplace: d
  } = ti, { FLAG_INCLUDE_PRERELEASE: _, FLAG_LOOSE: g } = Xs, x = (D) => D.value === "<0.0.0-0", y = (D) => D.value === "", v = (D, S) => {
    let $ = !0;
    const A = D.slice();
    let L = A.pop();
    for (; $ && A.length; )
      $ = A.every((P) => L.intersects(P, S)), L = A.pop();
    return $;
  }, C = (D, S) => (D = D.replace(c[p.BUILD], ""), o("comp", D, S), D = Z(D, S), o("caret", D), D = B(D, S), o("tildes", D), D = se(D, S), o("xrange", D), D = E(D, S), o("stars", D), D), O = (D) => !D || D.toLowerCase() === "x" || D === "*", B = (D, S) => D.trim().split(/\s+/).map(($) => G($, S)).join(" "), G = (D, S) => {
    const $ = S.loose ? c[p.TILDELOOSE] : c[p.TILDE];
    return D.replace($, (A, L, P, k, z) => {
      o("tilde", D, A, L, P, k, z);
      let N;
      return O(L) ? N = "" : O(P) ? N = `>=${L}.0.0 <${+L + 1}.0.0-0` : O(k) ? N = `>=${L}.${P}.0 <${L}.${+P + 1}.0-0` : z ? (o("replaceTilde pr", z), N = `>=${L}.${P}.${k}-${z} <${L}.${+P + 1}.0-0`) : N = `>=${L}.${P}.${k} <${L}.${+P + 1}.0-0`, o("tilde return", N), N;
    });
  }, Z = (D, S) => D.trim().split(/\s+/).map(($) => J($, S)).join(" "), J = (D, S) => {
    o("caret", D, S);
    const $ = S.loose ? c[p.CARETLOOSE] : c[p.CARET], A = S.includePrerelease ? "-0" : "";
    return D.replace($, (L, P, k, z, N) => {
      o("caret", D, L, P, k, z, N);
      let ee;
      return O(P) ? ee = "" : O(k) ? ee = `>=${P}.0.0${A} <${+P + 1}.0.0-0` : O(z) ? P === "0" ? ee = `>=${P}.${k}.0${A} <${P}.${+k + 1}.0-0` : ee = `>=${P}.${k}.0${A} <${+P + 1}.0.0-0` : N ? (o("replaceCaret pr", N), P === "0" ? k === "0" ? ee = `>=${P}.${k}.${z}-${N} <${P}.${k}.${+z + 1}-0` : ee = `>=${P}.${k}.${z}-${N} <${P}.${+k + 1}.0-0` : ee = `>=${P}.${k}.${z}-${N} <${+P + 1}.0.0-0`) : (o("no pr"), P === "0" ? k === "0" ? ee = `>=${P}.${k}.${z}${A} <${P}.${k}.${+z + 1}-0` : ee = `>=${P}.${k}.${z}${A} <${P}.${+k + 1}.0-0` : ee = `>=${P}.${k}.${z} <${+P + 1}.0.0-0`), o("caret return", ee), ee;
    });
  }, se = (D, S) => (o("replaceXRanges", D, S), D.split(/\s+/).map(($) => M($, S)).join(" ")), M = (D, S) => {
    D = D.trim();
    const $ = S.loose ? c[p.XRANGELOOSE] : c[p.XRANGE];
    return D.replace($, (A, L, P, k, z, N) => {
      o("xRange", D, A, L, P, k, z, N);
      const ee = O(P), xe = ee || O(k), q = xe || O(z), De = q;
      return L === "=" && De && (L = ""), N = S.includePrerelease ? "-0" : "", ee ? L === ">" || L === "<" ? A = "<0.0.0-0" : A = "*" : L && De ? (xe && (k = 0), z = 0, L === ">" ? (L = ">=", xe ? (P = +P + 1, k = 0, z = 0) : (k = +k + 1, z = 0)) : L === "<=" && (L = "<", xe ? P = +P + 1 : k = +k + 1), L === "<" && (N = "-0"), A = `${L + P}.${k}.${z}${N}`) : xe ? A = `>=${P}.0.0${N} <${+P + 1}.0.0-0` : q && (A = `>=${P}.${k}.0${N} <${P}.${+k + 1}.0-0`), o("xRange return", A), A;
    });
  }, E = (D, S) => (o("replaceStars", D, S), D.trim().replace(c[p.STAR], "")), V = (D, S) => (o("replaceGTE0", D, S), D.trim().replace(c[S.includePrerelease ? p.GTE0PRE : p.GTE0], "")), Q = (D) => (S, $, A, L, P, k, z, N, ee, xe, q, De) => (O(A) ? $ = "" : O(L) ? $ = `>=${A}.0.0${D ? "-0" : ""}` : O(P) ? $ = `>=${A}.${L}.0${D ? "-0" : ""}` : k ? $ = `>=${$}` : $ = `>=${$}${D ? "-0" : ""}`, O(ee) ? N = "" : O(xe) ? N = `<${+ee + 1}.0.0-0` : O(q) ? N = `<${ee}.${+xe + 1}.0-0` : De ? N = `<=${ee}.${xe}.${q}-${De}` : D ? N = `<${ee}.${xe}.${+q + 1}-0` : N = `<=${N}`, `${$} ${N}`.trim()), le = (D, S, $) => {
    for (let A = 0; A < D.length; A++)
      if (!D[A].test(S))
        return !1;
    if (S.prerelease.length && !$.includePrerelease) {
      for (let A = 0; A < D.length; A++)
        if (o(D[A].semver), D[A].semver !== s.ANY && D[A].semver.prerelease.length > 0) {
          const L = D[A].semver;
          if (L.major === S.major && L.minor === S.minor && L.patch === S.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Zo;
}
var ea, Gu;
function Qs() {
  if (Gu) return ea;
  Gu = 1;
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
  ea = t;
  const r = Nl, { safeRe: n, t: i } = ti, s = Gh, o = Ks, a = He, c = ct();
  return ea;
}
const _b = ct(), mb = (e, t, r) => {
  try {
    t = new _b(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Zs = mb;
const gb = ct(), xb = (e, t) => new gb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var yb = xb;
const Eb = He, wb = ct(), bb = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new wb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new Eb(n, r));
  }), n;
};
var vb = bb;
const Rb = He, Cb = ct(), Ib = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new Cb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new Rb(n, r));
  }), n;
};
var Ab = Ib;
const ta = He, Sb = ct(), Wu = Js, Tb = (e, t) => {
  e = new Sb(e, t);
  let r = new ta("0.0.0");
  if (e.test(r) || (r = new ta("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((o) => {
      const a = new ta(o.semver.version);
      switch (o.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!s || Wu(a, s)) && (s = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || Wu(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var Db = Tb;
const Pb = ct(), Ob = (e, t) => {
  try {
    return new Pb(e, t).range || "*";
  } catch {
    return null;
  }
};
var $b = Ob;
const Lb = He, Wh = Qs(), { ANY: Nb } = Wh, Fb = ct(), Ub = Zs, Vu = Js, zu = Ul, Bb = Ml, Mb = Bl, kb = (e, t, r, n) => {
  e = new Lb(e, n), t = new Fb(t, n);
  let i, s, o, a, c;
  switch (r) {
    case ">":
      i = Vu, s = Bb, o = zu, a = ">", c = ">=";
      break;
    case "<":
      i = zu, s = Mb, o = Vu, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Ub(e, t, n))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const l = t.set[p];
    let u = null, d = null;
    if (l.forEach((_) => {
      _.semver === Nb && (_ = new Wh(">=0.0.0")), u = u || _, d = d || _, i(_.semver, u.semver, n) ? u = _ : o(_.semver, d.semver, n) && (d = _);
    }), u.operator === a || u.operator === c || (!d.operator || d.operator === a) && s(e, d.semver))
      return !1;
    if (d.operator === c && o(e, d.semver))
      return !1;
  }
  return !0;
};
var kl = kb;
const qb = kl, jb = (e, t, r) => qb(e, t, ">", r);
var Hb = jb;
const Gb = kl, Wb = (e, t, r) => Gb(e, t, "<", r);
var Vb = Wb;
const Yu = ct(), zb = (e, t, r) => (e = new Yu(e, r), t = new Yu(t, r), e.intersects(t, r));
var Yb = zb;
const Xb = Zs, Kb = lt;
var Jb = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const o = e.sort((l, u) => Kb(l, u, r));
  for (const l of o)
    Xb(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [l, u] of n)
    l === u ? a.push(l) : !u && l === o[0] ? a.push("*") : u ? l === o[0] ? a.push(`<=${u}`) : a.push(`${l} - ${u}`) : a.push(`>=${l}`);
  const c = a.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < p.length ? c : t;
};
const Xu = ct(), ql = Qs(), { ANY: ra } = ql, hn = Zs, jl = lt, Qb = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Xu(e, r), t = new Xu(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const o = ev(i, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Zb = [new ql(">=0.0.0-0")], Ku = [new ql(">=0.0.0")], ev = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === ra) {
    if (t.length === 1 && t[0].semver === ra)
      return !0;
    r.includePrerelease ? e = Zb : e = Ku;
  }
  if (t.length === 1 && t[0].semver === ra) {
    if (r.includePrerelease)
      return !0;
    t = Ku;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const _ of e)
    _.operator === ">" || _.operator === ">=" ? i = Ju(i, _, r) : _.operator === "<" || _.operator === "<=" ? s = Qu(s, _, r) : n.add(_.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && s) {
    if (o = jl(i.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const _ of n) {
    if (i && !hn(_, String(i), r) || s && !hn(_, String(s), r))
      return null;
    for (const g of t)
      if (!hn(_, String(g), r))
        return !1;
    return !0;
  }
  let a, c, p, l, u = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && s.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const _ of t) {
    if (l = l || _.operator === ">" || _.operator === ">=", p = p || _.operator === "<" || _.operator === "<=", i) {
      if (d && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === d.major && _.semver.minor === d.minor && _.semver.patch === d.patch && (d = !1), _.operator === ">" || _.operator === ">=") {
        if (a = Ju(i, _, r), a === _ && a !== i)
          return !1;
      } else if (i.operator === ">=" && !hn(i.semver, String(_), r))
        return !1;
    }
    if (s) {
      if (u && _.semver.prerelease && _.semver.prerelease.length && _.semver.major === u.major && _.semver.minor === u.minor && _.semver.patch === u.patch && (u = !1), _.operator === "<" || _.operator === "<=") {
        if (c = Qu(s, _, r), c === _ && c !== s)
          return !1;
      } else if (s.operator === "<=" && !hn(s.semver, String(_), r))
        return !1;
    }
    if (!_.operator && (s || i) && o !== 0)
      return !1;
  }
  return !(i && p && !s && o !== 0 || s && l && !i && o !== 0 || d || u);
}, Ju = (e, t, r) => {
  if (!e)
    return t;
  const n = jl(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Qu = (e, t, r) => {
  if (!e)
    return t;
  const n = jl(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var tv = Qb;
const na = ti, Zu = Xs, rv = He, ef = qh, nv = Yr, iv = uw, sv = hw, ov = _w, av = gw, lv = Ew, cv = vw, uv = Iw, fv = Tw, dv = lt, hv = $w, pv = Fw, _v = Fl, mv = kw, gv = Hw, xv = Js, yv = Ul, Ev = jh, wv = Hh, bv = Bl, vv = Ml, Rv = Gh, Cv = db, Iv = Qs(), Av = ct(), Sv = Zs, Tv = yb, Dv = vb, Pv = Ab, Ov = Db, $v = $b, Lv = kl, Nv = Hb, Fv = Vb, Uv = Yb, Bv = Jb, Mv = tv;
var Vh = {
  parse: nv,
  valid: iv,
  clean: sv,
  inc: ov,
  diff: av,
  major: lv,
  minor: cv,
  patch: uv,
  prerelease: fv,
  compare: dv,
  rcompare: hv,
  compareLoose: pv,
  compareBuild: _v,
  sort: mv,
  rsort: gv,
  gt: xv,
  lt: yv,
  eq: Ev,
  neq: wv,
  gte: bv,
  lte: vv,
  cmp: Rv,
  coerce: Cv,
  Comparator: Iv,
  Range: Av,
  satisfies: Sv,
  toComparators: Tv,
  maxSatisfying: Dv,
  minSatisfying: Pv,
  minVersion: Ov,
  validRange: $v,
  outside: Lv,
  gtr: Nv,
  ltr: Fv,
  intersects: Uv,
  simplifyRange: Bv,
  subset: Mv,
  SemVer: rv,
  re: na.re,
  src: na.src,
  tokens: na.t,
  SEMVER_SPEC_VERSION: Zu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Zu.RELEASE_TYPES,
  compareIdentifiers: ef.compareIdentifiers,
  rcompareIdentifiers: ef.rcompareIdentifiers
}, ri = {}, Es = { exports: {} };
Es.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, o = 9007199254740991, a = "[object Arguments]", c = "[object Array]", p = "[object AsyncFunction]", l = "[object Boolean]", u = "[object Date]", d = "[object Error]", _ = "[object Function]", g = "[object GeneratorFunction]", x = "[object Map]", y = "[object Number]", v = "[object Null]", C = "[object Object]", O = "[object Promise]", B = "[object Proxy]", G = "[object RegExp]", Z = "[object Set]", J = "[object String]", se = "[object Symbol]", M = "[object Undefined]", E = "[object WeakMap]", V = "[object ArrayBuffer]", Q = "[object DataView]", le = "[object Float32Array]", D = "[object Float64Array]", S = "[object Int8Array]", $ = "[object Int16Array]", A = "[object Int32Array]", L = "[object Uint8Array]", P = "[object Uint8ClampedArray]", k = "[object Uint16Array]", z = "[object Uint32Array]", N = /[\\^$.*+?()[\]{}|]/g, ee = /^\[object .+?Constructor\]$/, xe = /^(?:0|[1-9]\d*)$/, q = {};
  q[le] = q[D] = q[S] = q[$] = q[A] = q[L] = q[P] = q[k] = q[z] = !0, q[a] = q[c] = q[V] = q[l] = q[Q] = q[u] = q[d] = q[_] = q[x] = q[y] = q[C] = q[G] = q[Z] = q[J] = q[E] = !1;
  var De = typeof T == "object" && T && T.Object === Object && T, sn = typeof self == "object" && self && self.Object === Object && self, Ze = De || sn || Function("return this")(), Ii = t && !t.nodeType && t, on = Ii && !0 && e && !e.nodeType && e, vr = on && on.exports === Ii, an = vr && De.process, h = function() {
    try {
      return an && an.binding && an.binding("util");
    } catch {
    }
  }(), f = h && h.isTypedArray;
  function R(m, b) {
    for (var I = -1, F = m == null ? 0 : m.length, re = 0, W = []; ++I < F; ) {
      var he = m[I];
      b(he, I, m) && (W[re++] = he);
    }
    return W;
  }
  function w(m, b) {
    for (var I = -1, F = b.length, re = m.length; ++I < F; )
      m[re + I] = b[I];
    return m;
  }
  function K(m, b) {
    for (var I = -1, F = m == null ? 0 : m.length; ++I < F; )
      if (b(m[I], I, m))
        return !0;
    return !1;
  }
  function ce(m, b) {
    for (var I = -1, F = Array(m); ++I < m; )
      F[I] = b(I);
    return F;
  }
  function pe(m) {
    return function(b) {
      return m(b);
    };
  }
  function Pe(m, b) {
    return m.has(b);
  }
  function Oe(m, b) {
    return m == null ? void 0 : m[b];
  }
  function et(m) {
    var b = -1, I = Array(m.size);
    return m.forEach(function(F, re) {
      I[++b] = [re, F];
    }), I;
  }
  function ye(m, b) {
    return function(I) {
      return m(b(I));
    };
  }
  function tt(m) {
    var b = -1, I = Array(m.size);
    return m.forEach(function(F) {
      I[++b] = F;
    }), I;
  }
  var $o = Array.prototype, Ai = Function.prototype, Lt = Object.prototype, Rr = Ze["__core-js_shared__"], Ec = Ai.toString, ft = Lt.hasOwnProperty, wc = function() {
    var m = /[^.]+$/.exec(Rr && Rr.keys && Rr.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), bc = Lt.toString, o_ = RegExp(
    "^" + Ec.call(ft).replace(N, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), vc = vr ? Ze.Buffer : void 0, Si = Ze.Symbol, Rc = Ze.Uint8Array, Cc = Lt.propertyIsEnumerable, a_ = $o.splice, nr = Si ? Si.toStringTag : void 0, Ic = Object.getOwnPropertySymbols, l_ = vc ? vc.isBuffer : void 0, c_ = ye(Object.keys, Object), Lo = Cr(Ze, "DataView"), ln = Cr(Ze, "Map"), No = Cr(Ze, "Promise"), Fo = Cr(Ze, "Set"), Uo = Cr(Ze, "WeakMap"), cn = Cr(Object, "create"), u_ = or(Lo), f_ = or(ln), d_ = or(No), h_ = or(Fo), p_ = or(Uo), Ac = Si ? Si.prototype : void 0, Bo = Ac ? Ac.valueOf : void 0;
  function ir(m) {
    var b = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++b < I; ) {
      var F = m[b];
      this.set(F[0], F[1]);
    }
  }
  function __() {
    this.__data__ = cn ? cn(null) : {}, this.size = 0;
  }
  function m_(m) {
    var b = this.has(m) && delete this.__data__[m];
    return this.size -= b ? 1 : 0, b;
  }
  function g_(m) {
    var b = this.__data__;
    if (cn) {
      var I = b[m];
      return I === n ? void 0 : I;
    }
    return ft.call(b, m) ? b[m] : void 0;
  }
  function x_(m) {
    var b = this.__data__;
    return cn ? b[m] !== void 0 : ft.call(b, m);
  }
  function y_(m, b) {
    var I = this.__data__;
    return this.size += this.has(m) ? 0 : 1, I[m] = cn && b === void 0 ? n : b, this;
  }
  ir.prototype.clear = __, ir.prototype.delete = m_, ir.prototype.get = g_, ir.prototype.has = x_, ir.prototype.set = y_;
  function Rt(m) {
    var b = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++b < I; ) {
      var F = m[b];
      this.set(F[0], F[1]);
    }
  }
  function E_() {
    this.__data__ = [], this.size = 0;
  }
  function w_(m) {
    var b = this.__data__, I = Di(b, m);
    if (I < 0)
      return !1;
    var F = b.length - 1;
    return I == F ? b.pop() : a_.call(b, I, 1), --this.size, !0;
  }
  function b_(m) {
    var b = this.__data__, I = Di(b, m);
    return I < 0 ? void 0 : b[I][1];
  }
  function v_(m) {
    return Di(this.__data__, m) > -1;
  }
  function R_(m, b) {
    var I = this.__data__, F = Di(I, m);
    return F < 0 ? (++this.size, I.push([m, b])) : I[F][1] = b, this;
  }
  Rt.prototype.clear = E_, Rt.prototype.delete = w_, Rt.prototype.get = b_, Rt.prototype.has = v_, Rt.prototype.set = R_;
  function sr(m) {
    var b = -1, I = m == null ? 0 : m.length;
    for (this.clear(); ++b < I; ) {
      var F = m[b];
      this.set(F[0], F[1]);
    }
  }
  function C_() {
    this.size = 0, this.__data__ = {
      hash: new ir(),
      map: new (ln || Rt)(),
      string: new ir()
    };
  }
  function I_(m) {
    var b = Pi(this, m).delete(m);
    return this.size -= b ? 1 : 0, b;
  }
  function A_(m) {
    return Pi(this, m).get(m);
  }
  function S_(m) {
    return Pi(this, m).has(m);
  }
  function T_(m, b) {
    var I = Pi(this, m), F = I.size;
    return I.set(m, b), this.size += I.size == F ? 0 : 1, this;
  }
  sr.prototype.clear = C_, sr.prototype.delete = I_, sr.prototype.get = A_, sr.prototype.has = S_, sr.prototype.set = T_;
  function Ti(m) {
    var b = -1, I = m == null ? 0 : m.length;
    for (this.__data__ = new sr(); ++b < I; )
      this.add(m[b]);
  }
  function D_(m) {
    return this.__data__.set(m, n), this;
  }
  function P_(m) {
    return this.__data__.has(m);
  }
  Ti.prototype.add = Ti.prototype.push = D_, Ti.prototype.has = P_;
  function Nt(m) {
    var b = this.__data__ = new Rt(m);
    this.size = b.size;
  }
  function O_() {
    this.__data__ = new Rt(), this.size = 0;
  }
  function $_(m) {
    var b = this.__data__, I = b.delete(m);
    return this.size = b.size, I;
  }
  function L_(m) {
    return this.__data__.get(m);
  }
  function N_(m) {
    return this.__data__.has(m);
  }
  function F_(m, b) {
    var I = this.__data__;
    if (I instanceof Rt) {
      var F = I.__data__;
      if (!ln || F.length < r - 1)
        return F.push([m, b]), this.size = ++I.size, this;
      I = this.__data__ = new sr(F);
    }
    return I.set(m, b), this.size = I.size, this;
  }
  Nt.prototype.clear = O_, Nt.prototype.delete = $_, Nt.prototype.get = L_, Nt.prototype.has = N_, Nt.prototype.set = F_;
  function U_(m, b) {
    var I = Oi(m), F = !I && Q_(m), re = !I && !F && Mo(m), W = !I && !F && !re && Fc(m), he = I || F || re || W, ve = he ? ce(m.length, String) : [], Ce = ve.length;
    for (var ue in m)
      ft.call(m, ue) && !(he && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ue == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      re && (ue == "offset" || ue == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      W && (ue == "buffer" || ue == "byteLength" || ue == "byteOffset") || // Skip index properties.
      z_(ue, Ce))) && ve.push(ue);
    return ve;
  }
  function Di(m, b) {
    for (var I = m.length; I--; )
      if (Oc(m[I][0], b))
        return I;
    return -1;
  }
  function B_(m, b, I) {
    var F = b(m);
    return Oi(m) ? F : w(F, I(m));
  }
  function un(m) {
    return m == null ? m === void 0 ? M : v : nr && nr in Object(m) ? W_(m) : J_(m);
  }
  function Sc(m) {
    return fn(m) && un(m) == a;
  }
  function Tc(m, b, I, F, re) {
    return m === b ? !0 : m == null || b == null || !fn(m) && !fn(b) ? m !== m && b !== b : M_(m, b, I, F, Tc, re);
  }
  function M_(m, b, I, F, re, W) {
    var he = Oi(m), ve = Oi(b), Ce = he ? c : Ft(m), ue = ve ? c : Ft(b);
    Ce = Ce == a ? C : Ce, ue = ue == a ? C : ue;
    var ze = Ce == C, rt = ue == C, $e = Ce == ue;
    if ($e && Mo(m)) {
      if (!Mo(b))
        return !1;
      he = !0, ze = !1;
    }
    if ($e && !ze)
      return W || (W = new Nt()), he || Fc(m) ? Dc(m, b, I, F, re, W) : H_(m, b, Ce, I, F, re, W);
    if (!(I & i)) {
      var Xe = ze && ft.call(m, "__wrapped__"), Ke = rt && ft.call(b, "__wrapped__");
      if (Xe || Ke) {
        var Ut = Xe ? m.value() : m, Ct = Ke ? b.value() : b;
        return W || (W = new Nt()), re(Ut, Ct, I, F, W);
      }
    }
    return $e ? (W || (W = new Nt()), G_(m, b, I, F, re, W)) : !1;
  }
  function k_(m) {
    if (!Nc(m) || X_(m))
      return !1;
    var b = $c(m) ? o_ : ee;
    return b.test(or(m));
  }
  function q_(m) {
    return fn(m) && Lc(m.length) && !!q[un(m)];
  }
  function j_(m) {
    if (!K_(m))
      return c_(m);
    var b = [];
    for (var I in Object(m))
      ft.call(m, I) && I != "constructor" && b.push(I);
    return b;
  }
  function Dc(m, b, I, F, re, W) {
    var he = I & i, ve = m.length, Ce = b.length;
    if (ve != Ce && !(he && Ce > ve))
      return !1;
    var ue = W.get(m);
    if (ue && W.get(b))
      return ue == b;
    var ze = -1, rt = !0, $e = I & s ? new Ti() : void 0;
    for (W.set(m, b), W.set(b, m); ++ze < ve; ) {
      var Xe = m[ze], Ke = b[ze];
      if (F)
        var Ut = he ? F(Ke, Xe, ze, b, m, W) : F(Xe, Ke, ze, m, b, W);
      if (Ut !== void 0) {
        if (Ut)
          continue;
        rt = !1;
        break;
      }
      if ($e) {
        if (!K(b, function(Ct, ar) {
          if (!Pe($e, ar) && (Xe === Ct || re(Xe, Ct, I, F, W)))
            return $e.push(ar);
        })) {
          rt = !1;
          break;
        }
      } else if (!(Xe === Ke || re(Xe, Ke, I, F, W))) {
        rt = !1;
        break;
      }
    }
    return W.delete(m), W.delete(b), rt;
  }
  function H_(m, b, I, F, re, W, he) {
    switch (I) {
      case Q:
        if (m.byteLength != b.byteLength || m.byteOffset != b.byteOffset)
          return !1;
        m = m.buffer, b = b.buffer;
      case V:
        return !(m.byteLength != b.byteLength || !W(new Rc(m), new Rc(b)));
      case l:
      case u:
      case y:
        return Oc(+m, +b);
      case d:
        return m.name == b.name && m.message == b.message;
      case G:
      case J:
        return m == b + "";
      case x:
        var ve = et;
      case Z:
        var Ce = F & i;
        if (ve || (ve = tt), m.size != b.size && !Ce)
          return !1;
        var ue = he.get(m);
        if (ue)
          return ue == b;
        F |= s, he.set(m, b);
        var ze = Dc(ve(m), ve(b), F, re, W, he);
        return he.delete(m), ze;
      case se:
        if (Bo)
          return Bo.call(m) == Bo.call(b);
    }
    return !1;
  }
  function G_(m, b, I, F, re, W) {
    var he = I & i, ve = Pc(m), Ce = ve.length, ue = Pc(b), ze = ue.length;
    if (Ce != ze && !he)
      return !1;
    for (var rt = Ce; rt--; ) {
      var $e = ve[rt];
      if (!(he ? $e in b : ft.call(b, $e)))
        return !1;
    }
    var Xe = W.get(m);
    if (Xe && W.get(b))
      return Xe == b;
    var Ke = !0;
    W.set(m, b), W.set(b, m);
    for (var Ut = he; ++rt < Ce; ) {
      $e = ve[rt];
      var Ct = m[$e], ar = b[$e];
      if (F)
        var Uc = he ? F(ar, Ct, $e, b, m, W) : F(Ct, ar, $e, m, b, W);
      if (!(Uc === void 0 ? Ct === ar || re(Ct, ar, I, F, W) : Uc)) {
        Ke = !1;
        break;
      }
      Ut || (Ut = $e == "constructor");
    }
    if (Ke && !Ut) {
      var $i = m.constructor, Li = b.constructor;
      $i != Li && "constructor" in m && "constructor" in b && !(typeof $i == "function" && $i instanceof $i && typeof Li == "function" && Li instanceof Li) && (Ke = !1);
    }
    return W.delete(m), W.delete(b), Ke;
  }
  function Pc(m) {
    return B_(m, tm, V_);
  }
  function Pi(m, b) {
    var I = m.__data__;
    return Y_(b) ? I[typeof b == "string" ? "string" : "hash"] : I.map;
  }
  function Cr(m, b) {
    var I = Oe(m, b);
    return k_(I) ? I : void 0;
  }
  function W_(m) {
    var b = ft.call(m, nr), I = m[nr];
    try {
      m[nr] = void 0;
      var F = !0;
    } catch {
    }
    var re = bc.call(m);
    return F && (b ? m[nr] = I : delete m[nr]), re;
  }
  var V_ = Ic ? function(m) {
    return m == null ? [] : (m = Object(m), R(Ic(m), function(b) {
      return Cc.call(m, b);
    }));
  } : rm, Ft = un;
  (Lo && Ft(new Lo(new ArrayBuffer(1))) != Q || ln && Ft(new ln()) != x || No && Ft(No.resolve()) != O || Fo && Ft(new Fo()) != Z || Uo && Ft(new Uo()) != E) && (Ft = function(m) {
    var b = un(m), I = b == C ? m.constructor : void 0, F = I ? or(I) : "";
    if (F)
      switch (F) {
        case u_:
          return Q;
        case f_:
          return x;
        case d_:
          return O;
        case h_:
          return Z;
        case p_:
          return E;
      }
    return b;
  });
  function z_(m, b) {
    return b = b ?? o, !!b && (typeof m == "number" || xe.test(m)) && m > -1 && m % 1 == 0 && m < b;
  }
  function Y_(m) {
    var b = typeof m;
    return b == "string" || b == "number" || b == "symbol" || b == "boolean" ? m !== "__proto__" : m === null;
  }
  function X_(m) {
    return !!wc && wc in m;
  }
  function K_(m) {
    var b = m && m.constructor, I = typeof b == "function" && b.prototype || Lt;
    return m === I;
  }
  function J_(m) {
    return bc.call(m);
  }
  function or(m) {
    if (m != null) {
      try {
        return Ec.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Oc(m, b) {
    return m === b || m !== m && b !== b;
  }
  var Q_ = Sc(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Sc : function(m) {
    return fn(m) && ft.call(m, "callee") && !Cc.call(m, "callee");
  }, Oi = Array.isArray;
  function Z_(m) {
    return m != null && Lc(m.length) && !$c(m);
  }
  var Mo = l_ || nm;
  function em(m, b) {
    return Tc(m, b);
  }
  function $c(m) {
    if (!Nc(m))
      return !1;
    var b = un(m);
    return b == _ || b == g || b == p || b == B;
  }
  function Lc(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= o;
  }
  function Nc(m) {
    var b = typeof m;
    return m != null && (b == "object" || b == "function");
  }
  function fn(m) {
    return m != null && typeof m == "object";
  }
  var Fc = f ? pe(f) : q_;
  function tm(m) {
    return Z_(m) ? U_(m) : j_(m);
  }
  function rm() {
    return [];
  }
  function nm() {
    return !1;
  }
  e.exports = em;
})(Es, Es.exports);
var kv = Es.exports;
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.DownloadedUpdateHelper = void 0;
ri.createTempUpdateFile = Wv;
const qv = Yn, jv = Zt, tf = kv, lr = tr, An = oe;
class Hv {
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
    return An.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return tf(this.versionInfo, r) && tf(this.fileInfo.info, n.info) && await (0, lr.pathExists)(t) ? t : null;
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
    const a = An.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, lr.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const c = await Gv(a);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, a);
  }
  getUpdateInfoFile() {
    return An.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ri.DownloadedUpdateHelper = Hv;
function Gv(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const o = (0, qv.createHash)(t);
    o.on("error", s).setEncoding(r), (0, jv.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function Wv(e, t, r) {
  let n = 0, i = An.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, lr.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = An.join(t, `${n++}-${e}`);
    }
  return i;
}
var eo = {}, Hl = {};
Object.defineProperty(Hl, "__esModule", { value: !0 });
Hl.getAppCacheDir = zv;
const ia = oe, Vv = Ms;
function zv() {
  const e = (0, Vv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ia.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ia.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ia.join(e, ".cache"), t;
}
Object.defineProperty(eo, "__esModule", { value: !0 });
eo.ElectronAppAdapter = void 0;
const rf = oe, Yv = Hl;
class Xv {
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
    return this.isPackaged ? rf.join(process.resourcesPath, "app-update.yml") : rf.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Yv.getAppCacheDir)();
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
eo.ElectronAppAdapter = Xv;
var zh = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = be;
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
})(zh);
var ni = {}, ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.newBaseUrl = Kv;
ut.newUrlFromBase = Jv;
ut.getChannelFilename = Qv;
const Yh = er;
function Kv(e) {
  const t = new Yh.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Jv(e, t, r = !1) {
  const n = new Yh.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Qv(e) {
  return `${e}.yml`;
}
var ge = {}, Zv = "[object Symbol]", Xh = /[\\^$.*+?()[\]{}|]/g, eR = RegExp(Xh.source), tR = typeof T == "object" && T && T.Object === Object && T, rR = typeof self == "object" && self && self.Object === Object && self, nR = tR || rR || Function("return this")(), iR = Object.prototype, sR = iR.toString, nf = nR.Symbol, sf = nf ? nf.prototype : void 0, of = sf ? sf.toString : void 0;
function oR(e) {
  if (typeof e == "string")
    return e;
  if (lR(e))
    return of ? of.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function aR(e) {
  return !!e && typeof e == "object";
}
function lR(e) {
  return typeof e == "symbol" || aR(e) && sR.call(e) == Zv;
}
function cR(e) {
  return e == null ? "" : oR(e);
}
function uR(e) {
  return e = cR(e), e && eR.test(e) ? e.replace(Xh, "\\$&") : e;
}
var Kh = uR;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.Provider = void 0;
ge.findFile = _R;
ge.parseUpdateInfo = mR;
ge.getFileList = Jh;
ge.resolveFiles = gR;
const Xt = be, fR = Te, dR = er, ws = ut, hR = Kh;
class pR {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, ws.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, ws.newUrlFromBase)(`${t.pathname.replace(new RegExp(hR(n), "g"), r)}.blockmap`, i ? new dR.URL(i) : t), s];
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
ge.Provider = pR;
function _R(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, Xt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((o) => o.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((o) => [o.url.pathname, o.info.url].some((a) => a.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((o) => !r.some((a) => o.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function mR(e, t, r) {
  if (e == null)
    throw (0, Xt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, fR.load)(e);
  } catch (i) {
    throw (0, Xt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Jh(e) {
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
function gR(e, t, r = (n) => n) {
  const i = Jh(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Xt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Xt.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, ws.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), s = e.packages, o = s == null ? null : s[process.arch] || s.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, ws.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.GenericProvider = void 0;
const af = be, sa = ut, oa = ge;
class xR extends oa.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, sa.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, sa.getChannelFilename)(this.channel), r = (0, sa.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, oa.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof af.HttpError && i.statusCode === 404)
          throw (0, af.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, oa.resolveFiles)(t, this.baseUrl);
  }
}
ni.GenericProvider = xR;
var to = {}, ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.BitbucketProvider = void 0;
const lf = be, aa = ut, la = ge;
class yR extends la.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, aa.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new lf.CancellationToken(), r = (0, aa.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, aa.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, la.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, lf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, la.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
ro.BitbucketProvider = yR;
var Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.GitHubProvider = Kt.BaseGitHubProvider = void 0;
Kt.computeReleaseNotes = Zh;
const St = be, pt = Vh, ER = er, Ur = ut, nl = ge, ca = /\/tag\/(v?[^/]+)$/;
class Qh extends nl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Ur.newBaseUrl)((0, St.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Ur.newBaseUrl)((0, St.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
Kt.BaseGitHubProvider = Qh;
class wR extends Qh {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const o = new St.CancellationToken(), a = await this.httpRequest((0, Ur.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), c = (0, St.parseXml)(a);
    let p = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const y = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = pt.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (y === null)
          l = ca.exec(p.element("link").attribute("href"))[1];
        else
          for (const v of c.getElements("entry")) {
            const C = ca.exec(v.element("link").attribute("href"));
            if (C === null)
              continue;
            const O = C[1];
            if (!pt.valid(O))
              continue;
            const B = ((n = pt.prerelease(O)) === null || n === void 0 ? void 0 : n[0]) || null, G = !y || ["alpha", "beta"].includes(y), Z = B !== null && !["alpha", "beta"].includes(String(B));
            if (G && !Z && !(y === "beta" && B === "alpha")) {
              l = O, p = v;
              break;
            }
            if (B && B === y) {
              l = O, p = v;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(o);
        for (const y of c.getElements("entry")) {
          const v = ca.exec(y.element("link").attribute("href"));
          if (v != null && v[1] === l) {
            p = y;
            break;
          }
        }
      }
    } catch (y) {
      throw (0, St.newError)(`Cannot parse releases feed: ${y.stack || y.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, St.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, d = "", _ = "";
    const g = async (y) => {
      d = (0, Ur.getChannelFilename)(y), _ = (0, Ur.newUrlFromBase)(this.getBaseDownloadPath(String(l), d), this.baseUrl);
      const v = this.createRequestOptions(_);
      try {
        return await this.executor.request(v, o);
      } catch (C) {
        throw C instanceof St.HttpError && C.statusCode === 404 ? (0, St.newError)(`Cannot find ${d} in the latest release artifacts (${_}): ${C.stack || C.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : C;
      }
    };
    try {
      let y = this.channel;
      this.updater.allowPrerelease && (!((i = pt.prerelease(l)) === null || i === void 0) && i[0]) && (y = this.getCustomChannelName(String((s = pt.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), u = await g(y);
    } catch (y) {
      if (this.updater.allowPrerelease)
        u = await g(this.getDefaultChannelName());
      else
        throw y;
    }
    const x = (0, nl.parseUpdateInfo)(u, d, _);
    return x.releaseName == null && (x.releaseName = p.elementValueOrEmpty("title")), x.releaseNotes == null && (x.releaseNotes = Zh(this.updater.currentVersion, this.updater.fullChangelog, c, p)), {
      tag: l,
      ...x
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Ur.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new ER.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, St.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, nl.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
Kt.GitHubProvider = wR;
function cf(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Zh(e, t, r, n) {
  if (!t)
    return cf(n);
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
      note: cf(a)
    });
  }
  return o.sort((a, c) => pt.rcompare(a.version, c.version));
}
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
no.GitLabProvider = void 0;
const Ie = be, ua = er, bR = Kh, zi = ut, fa = ge;
class vR extends fa.Provider {
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
    this.baseApiUrl = (0, zi.newBaseUrl)(`https://${s}/api/v4`);
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
    const t = new Ie.CancellationToken(), r = (0, zi.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), n = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) };
    let i;
    try {
      i = await this.httpRequest(r, n, t);
    } catch (_) {
      throw (0, Ie.newError)(`Unable to find latest release on GitLab (${r}): ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (!i)
      throw (0, Ie.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let s;
    try {
      s = JSON.parse(i);
    } catch (_) {
      throw (0, Ie.newError)(`Unable to parse latest release response from GitLab (${r}): response was not valid JSON: ${_.stack || _.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    if (s.upcoming_release)
      throw (0, Ie.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    const o = s.tag_name;
    let a = null, c = "", p = null;
    const l = async (_) => {
      c = (0, zi.getChannelFilename)(_);
      const g = s.assets.links.find((v) => v.name === c);
      if (!g)
        throw (0, Ie.newError)(`Cannot find ${c} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      p = new ua.URL(g.direct_asset_url);
      const x = this.setAuthHeaderForToken(this.options.token || null), y = Object.keys(x).length ? x : void 0;
      try {
        const v = await this.httpRequest(p, y, t);
        if (!v)
          throw (0, Ie.newError)(`Empty response from ${p}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return v;
      } catch (v) {
        throw v instanceof Ie.HttpError && v.statusCode === 404 ? (0, Ie.newError)(`Cannot find ${c} in the latest release artifacts (${p}): ${v.stack || v.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : v;
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
      throw (0, Ie.newError)(`Unable to parse channel data from ${c}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, fa.parseUpdateInfo)(a, c, p);
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
        return new ua.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new Ie.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, zi.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const o = { Accept: "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(s, o, r);
        if (a)
          return JSON.parse(a);
      } catch (o) {
        if (o instanceof Ie.HttpError && o.statusCode === 404)
          continue;
        throw (0, Ie.newError)(`Unable to find release ${i} on GitLab (${s}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Ie.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const c = n.replace(new RegExp(bR(r), "g"), t);
      s = this.findBlockMapInAssets(a, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [o, a] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!a)
        throw (0, Ie.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!o)
        throw (0, Ie.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [o, a];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, fa.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((o) => t.assets.has(o)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, Ie.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ua.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
no.GitLabProvider = vR;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.KeygenProvider = void 0;
const uf = be, da = ut, ha = ge;
class RR extends ha.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, da.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new uf.CancellationToken(), r = (0, da.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, da.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, ha.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, uf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, ha.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
io.KeygenProvider = RR;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.PrivateGitHubProvider = void 0;
const Ar = be, CR = Te, IR = oe, ff = er, df = ut, AR = Kt, SR = ge;
class TR extends AR.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Ar.CancellationToken(), r = (0, df.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, Ar.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new ff.URL(i.url);
    let o;
    try {
      o = (0, CR.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, df.newUrlFromBase)(n, this.baseUrl);
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
    return (0, SR.getFileList)(t).map((r) => {
      const n = IR.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, Ar.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ff.URL(i.url),
        info: r
      };
    });
  }
}
so.PrivateGitHubProvider = TR;
Object.defineProperty(to, "__esModule", { value: !0 });
to.isUrlProbablySupportMultiRangeRequests = ep;
to.createClient = NR;
const Yi = be, DR = ro, hf = ni, PR = Kt, OR = no, $R = io, LR = so;
function ep(e) {
  return !e.includes("s3.amazonaws.com");
}
function NR(e, t, r) {
  if (typeof e == "string")
    throw (0, Yi.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new PR.GitHubProvider(i, t, r) : new LR.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new DR.BitbucketProvider(e, t, r);
    case "gitlab":
      return new OR.GitLabProvider(e, t, r);
    case "keygen":
      return new $R.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new hf.GenericProvider({
        provider: "generic",
        url: (0, Yi.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new hf.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && ep(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, Yi.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, Yi.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var oo = {}, ii = {}, Xr = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.OperationKind = void 0;
wr.computeOperations = FR;
var dr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(dr || (wr.OperationKind = dr = {}));
function FR(e, t, r) {
  const n = _f(e.files), i = _f(t.files);
  let s = null;
  const o = t.files[0], a = [], c = o.name, p = n.get(c);
  if (p == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let u = 0;
  const { checksumToOffset: d, checksumToOldSize: _ } = BR(n.get(c), p.offset, r);
  let g = o.offset;
  for (let x = 0; x < l.checksums.length; g += l.sizes[x], x++) {
    const y = l.sizes[x], v = l.checksums[x];
    let C = d.get(v);
    C != null && _.get(v) !== y && (r.warn(`Checksum ("${v}") matches, but size differs (old: ${_.get(v)}, new: ${y})`), C = void 0), C === void 0 ? (u++, s != null && s.kind === dr.DOWNLOAD && s.end === g ? s.end += y : (s = {
      kind: dr.DOWNLOAD,
      start: g,
      end: g + y
      // oldBlocks: null,
    }, pf(s, a, v, x))) : s != null && s.kind === dr.COPY && s.end === C ? s.end += y : (s = {
      kind: dr.COPY,
      start: C,
      end: C + y
      // oldBlocks: [checksum]
    }, pf(s, a, v, x));
  }
  return u > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${u} changed blocks`), a;
}
const UR = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function pf(e, t, r, n) {
  if (UR && t.length !== 0) {
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
function BR(e, t, r) {
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
function _f(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.DataSplitter = void 0;
Xr.copyData = tp;
const Xi = be, MR = Zt, kR = zn, qR = wr, mf = Buffer.from(`\r
\r
`);
var qt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(qt || (qt = {}));
function tp(e, t, r, n, i) {
  const s = (0, MR.createReadStream)("", {
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
class jR extends kR.Writable {
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
      throw (0, Xi.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
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
              throw (0, Xi.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < o)
            await this.copyExistingData(a, o);
          else if (a > o)
            throw (0, Xi.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
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
        if (o.kind !== qR.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        tp(o, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(mf, r);
    if (n !== -1)
      return n + mf.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Xi.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
Xr.DataSplitter = jR;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.executeTasksUsingMultipleRangeRequests = HR;
ao.checkIsRangesSupported = sl;
const il = be, gf = Xr, xf = wr;
function HR(e, t, r, n, i) {
  const s = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = o + 1e3;
    GR(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => s(a), i);
  };
  return s;
}
function GR(e, t, r, n, i) {
  let s = "bytes=", o = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), p = [];
  for (let d = t.start; d < t.end; d++) {
    const _ = t.tasks[d];
    _.kind === xf.OperationKind.DOWNLOAD && (s += `${_.start}-${_.end - 1}, `, c.set(o, d), o++, p.push(_.end - _.start), a += _.end - _.start);
  }
  if (o <= 1) {
    const d = (_) => {
      if (_ >= t.end) {
        n();
        return;
      }
      const g = t.tasks[_++];
      if (g.kind === xf.OperationKind.COPY)
        (0, gf.copyData)(g, r, t.oldFileFd, i, () => d(_));
      else {
        const x = e.createRequestOptions();
        x.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const y = e.httpExecutor.createRequest(x, (v) => {
          v.on("error", i), sl(v, i) && (v.pipe(r, {
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
  const u = e.httpExecutor.createRequest(l, (d) => {
    if (!sl(d, i))
      return;
    const _ = (0, il.safeGetHeader)(d, "content-type"), g = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(_);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${_}"`));
      return;
    }
    const x = new gf.DataSplitter(r, t, c, g[1] || g[2], p, n, a, e.options.onProgress);
    x.on("error", i), d.pipe(x), d.on("end", () => {
      setTimeout(() => {
        u.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(u, i), u.end();
}
function sl(e, t) {
  if (e.statusCode >= 400)
    return t((0, il.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, il.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
lo.ProgressDifferentialDownloadCallbackTransform = void 0;
const WR = zn;
var Br;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Br || (Br = {}));
class VR extends WR.Transform {
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
lo.ProgressDifferentialDownloadCallbackTransform = VR;
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.DifferentialDownloader = void 0;
const pn = be, pa = tr, zR = Zt, YR = Xr, XR = er, Ki = wr, yf = ao, KR = lo;
class JR {
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
    return (0, pn.configureRequestUrl)(this.options.newUrl, t), (0, pn.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Ki.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, o = 0;
    for (const c of i) {
      const p = c.end - c.start;
      c.kind === Ki.OperationKind.DOWNLOAD ? s += p : o += p;
    }
    const a = this.blockAwareFileInfo.size;
    if (s + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${o}, newSize: ${a}`);
    return n.info(`Full: ${Ef(a)}, To download: ${Ef(s)} (${Math.round(s / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, pa.close)(i.descriptor).catch((s) => {
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
    const n = await (0, pa.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, pa.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, zR.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, a) => {
      const c = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const v = [];
        let C = 0;
        for (const B of t)
          B.kind === Ki.OperationKind.DOWNLOAD && (v.push(B.end - B.start), C += B.end - B.start);
        const O = {
          expectedByteCounts: v,
          grandTotal: C
        };
        p = new KR.ProgressDifferentialDownloadCallbackTransform(O, this.options.cancellationToken, this.options.onProgress), c.push(p);
      }
      const l = new pn.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), s.on("finish", () => {
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
      }), c.push(s);
      let u = null;
      for (const v of c)
        v.on("error", a), u == null ? u = v : u = u.pipe(v);
      const d = c[0];
      let _;
      if (this.options.isUseMultipleRangeRequest) {
        _ = (0, yf.executeTasksUsingMultipleRangeRequests)(this, t, d, n, a), _(0);
        return;
      }
      let g = 0, x = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const y = this.createRequestOptions();
      y.redirect = "manual", _ = (v) => {
        var C, O;
        if (v >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const B = t[v++];
        if (B.kind === Ki.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, YR.copyData)(B, d, n, a, () => _(v));
          return;
        }
        const G = `bytes=${B.start}-${B.end - 1}`;
        y.headers.range = G, (O = (C = this.logger) === null || C === void 0 ? void 0 : C.debug) === null || O === void 0 || O.call(C, `download range: ${G}`), p && p.beginRangeDownload();
        const Z = this.httpExecutor.createRequest(y, (J) => {
          J.on("error", a), J.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), J.statusCode >= 400 && a((0, pn.createHttpError)(J)), J.pipe(d, {
            end: !1
          }), J.once("end", () => {
            p && p.endRangeDownload(), ++g === 100 ? (g = 0, setTimeout(() => _(v), 1e3)) : _(v);
          });
        });
        Z.on("redirect", (J, se, M) => {
          this.logger.info(`Redirect to ${QR(M)}`), x = M, (0, pn.configureRequestUrl)(new XR.URL(x), y), Z.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(Z, a), Z.end();
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
        (0, yf.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
ii.DifferentialDownloader = JR;
function Ef(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function QR(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(oo, "__esModule", { value: !0 });
oo.GenericDifferentialDownloader = void 0;
const ZR = ii;
class eC extends ZR.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
oo.GenericDifferentialDownloader = eC;
var rr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = be;
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
const Ue = be, tC = Yn, rC = Ms, nC = fl, nt = tr, iC = Te, _a = Ys, Je = oe, cr = Vh, wf = ri, sC = eo, bf = zh, oC = ni, ma = to, ga = Nd, aC = oo, Sr = rr;
class Gl extends nC.EventEmitter {
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
    return (0, bf.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new rp();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new _a.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Sr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new _a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new _a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new sC.ElectronAppAdapter(), this.httpExecutor = new bf.ElectronHttpExecutor((s, o) => this.emit("login", s, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, cr.parse)(n);
    if (i == null)
      throw (0, Ue.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = lC(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new oC.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, ma.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, ma.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Gl.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, rC.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, ma.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, iC.load)(await (0, nt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const r = Ue.UUID.v5((0, tC.randomBytes)(4096), Ue.UUID.OID);
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
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new wf.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
      const O = Je.join(p, "current.blockmap");
      return await (0, nt.pathExists)(O) && await (0, nt.copyFile)(O, Je.join(c.cacheDir, "current.blockmap")), d == null ? [u] : [u, d];
    }, g = this._logger, x = await c.validateDownloadedPath(u, i, r, g);
    if (x != null)
      return u = x, await _(!1);
    const y = async () => (await c.clear().catch(() => {
    }), await (0, nt.unlink)(u).catch(() => {
    })), v = await (0, wf.createTempUpdateFile)(`temp-${l}`, p, g);
    try {
      await t.task(v, n, d, y), await (0, Ue.retry)(() => (0, nt.rename)(v, u), {
        retries: 60,
        interval: 500,
        shouldRetry: (C) => C instanceof Error && /^EBUSY:/.test(C.message) ? !0 : (g.warn(`Cannot rename temp file to final file: ${C.message || C.stack}`), !1)
      });
    } catch (C) {
      throw await y(), C instanceof Ue.CancellationError && (g.info("cancelled"), this.emit("update-cancelled", i)), C;
    }
    return g.info(`New version ${s} has been downloaded to ${u}`), await _(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = r.updateInfoAndProvider.provider, a = await o.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const c = async (g) => {
        const x = await this.httpExecutor.downloadToBuffer(g, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (x == null || x.length === 0)
          throw new Error(`Blockmap "${g.href}" is empty`);
        try {
          return JSON.parse((0, ga.gunzipSync)(x).toString());
        } catch (y) {
          throw new Error(`Cannot parse blockmap "${g.href}", error: ${y}`);
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
      this.listenerCount(Sr.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (g) => this.emit(Sr.DOWNLOAD_PROGRESS, g));
      const l = async (g, x) => {
        const y = Je.join(x, "current.blockmap");
        await (0, nt.outputFile)(y, (0, ga.gzipSync)(JSON.stringify(g)));
      }, u = async (g) => {
        const x = Je.join(g, "current.blockmap");
        try {
          if (await (0, nt.pathExists)(x))
            return JSON.parse((0, ga.gunzipSync)(await (0, nt.readFile)(x)).toString());
        } catch (y) {
          this._logger.warn(`Cannot parse blockmap "${x}", error: ${y}`);
        }
        return null;
      }, d = await c(a[1]);
      await l(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let _ = await u(this.downloadedUpdateHelper.cacheDir);
      return _ == null && (_ = await c(a[0])), await new aC.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(_, d), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
zt.AppUpdater = Gl;
function lC(e) {
  const t = (0, cr.prerelease)(e);
  return t != null && t.length > 0;
}
class rp {
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
zt.NoOpLogger = rp;
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.BaseUpdater = void 0;
const vf = Bs, xa = oe, cC = zt;
class uC extends cC.AppUpdater {
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
    return t.split(xa.delimiter).filter((r) => xa.isAbsolute(r)).join(xa.delimiter);
  }
  spawnSyncLog(t, r = [], n = {}) {
    var i;
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const s = { ...process.env, ...n }, o = (0, vf.spawnSync)(t, r, {
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
        const a = { stdio: i, env: n, detached: !0 }, c = (0, vf.spawn)(t, r, a);
        c.on("error", (p) => {
          o(p);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (a) {
        o(a);
      }
    });
  }
}
yr.BaseUpdater = uC;
var Mn = {}, si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
si.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Tr = tr, fC = ii, dC = Nd;
class hC extends fC.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = np(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await pC(this.options.oldFile), i);
  }
}
si.FileWithEmbeddedBlockMapDifferentialDownloader = hC;
function np(e) {
  return JSON.parse((0, dC.inflateRawSync)(e).toString());
}
async function pC(e) {
  const t = await (0, Tr.open)(e, "r");
  try {
    const r = (await (0, Tr.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Tr.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Tr.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Tr.close)(t), np(i);
  } catch (r) {
    throw await (0, Tr.close)(t), r;
  }
}
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.AppImageUpdater = void 0;
const ya = be, Rf = Bs, _C = tr, mC = Zt, Dr = oe, gC = yr, xC = si, yC = ge, Cf = rr;
class EC extends gC.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, yC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, ya.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, _C.chmod)(i, 493);
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
      return this.listenerCount(Cf.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Cf.DOWNLOAD_PROGRESS, a)), await new xC.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, ya.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    if (!Dr.isAbsolute(r) || r.includes("\0"))
      throw (0, ya.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, mC.unlinkSync)(r);
    let n;
    const i = Dr.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Dr.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Dr.join(Dr.dirname(r), Dr.basename(s)), (0, Rf.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Rf.execFileSync)(n, [], { env: o })), !0;
  }
}
Mn.AppImageUpdater = EC;
var kn = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.LinuxUpdater = void 0;
const wC = yr, bC = /^[a-zA-Z0-9_-]+$/;
class vC extends wC.BaseUpdater {
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
    i && (bC.test(i) ? n = [i] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${i}" contains unsafe characters. Ignoring override.`));
    for (const a of n)
      if (this.hasCommand(a))
        return a;
    const s = i ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${i}", ` : "", o = t[0];
    return this._logger.warn(`No package manager found in the list: ${s}${t.join(", ")}. Utilizing default: ${o}`), o;
  }
}
Kr.LinuxUpdater = vC;
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.DebUpdater = void 0;
const RC = ge, If = rr, CC = Kr;
class Wl extends CC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, RC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(If.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(If.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
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
      Wl.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
kn.DebUpdater = Wl;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.PacmanUpdater = void 0;
const Af = rr, IC = ge, AC = Kr;
class Vl extends AC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, IC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Af.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Af.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Vl.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
qn.PacmanUpdater = Vl;
var jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.RpmUpdater = void 0;
const Sf = rr, SC = ge, TC = Kr;
class zl extends TC.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, SC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Sf.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Sf.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      zl.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
jn.RpmUpdater = zl;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.MacUpdater = void 0;
const Tf = be, Ea = tr, DC = Zt, Df = oe, PC = lm, OC = zt, $C = ge, Pf = Bs, Of = Yn;
class Yl extends OC.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), s = (0, Pf.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (l) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${l}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const u = (0, Pf.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${u}`), o = o || u;
    } catch (l) {
      n.warn(`uname shell command to check for arm64 failed: ${l}`);
    }
    o = o || process.arch === "arm64" || s, r = Yl.filterFilesForArch(r, o);
    const a = (0, $C.findFile)(r, "zip", ["pkg", "dmg"]);
    if (a == null)
      throw (0, Tf.newError)(`ZIP file not provided: ${(0, Tf.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const c = t.updateInfoAndProvider.provider, p = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: a,
      downloadUpdateOptions: t,
      task: async (l, u) => {
        const d = Df.join(this.downloadedUpdateHelper.cacheDir, p), _ = () => (0, Ea.pathExistsSync)(d) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let g = !0;
        _() && (g = await this.differentialDownloadInstaller(a, t, l, c, p)), g && await this.httpExecutor.download(a.url, l, u);
      },
      done: async (l) => {
        if (!t.disableDifferentialDownload)
          try {
            const u = Df.join(this.downloadedUpdateHelper.cacheDir, p);
            await (0, Ea.copyFile)(l.downloadedFile, u);
          } catch (u) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${u.message}`);
          }
        return this.updateDownloaded(a, l);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ea.stat)(i)).size, o = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, PC.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (p) => {
      const l = p.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((p, l) => {
      const u = (0, Of.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${u}`, "ascii"), _ = `/${(0, Of.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (g, x) => {
        const y = g.url;
        if (o.info(`${y} requested`), y === "/") {
          if (!g.headers.authorization || g.headers.authorization.indexOf("Basic ") === -1) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), o.warn("No authenthication info");
            return;
          }
          const O = g.headers.authorization.split(" ")[1], B = Buffer.from(O, "base64").toString("ascii"), [G, Z] = B.split(":");
          if (G !== "autoupdater" || Z !== u) {
            x.statusCode = 401, x.statusMessage = "Invalid Authentication Credentials", x.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const J = Buffer.from(`{ "url": "${c(this.server)}${_}" }`);
          x.writeHead(200, { "Content-Type": "application/json", "Content-Length": J.length }), x.end(J);
          return;
        }
        if (!y.startsWith(_)) {
          o.warn(`${y} requested, but not supported`), x.writeHead(404), x.end();
          return;
        }
        o.info(`${_} requested by Squirrel.Mac, pipe ${i}`);
        let v = !1;
        x.on("finish", () => {
          v || (this.nativeUpdater.removeListener("error", l), p([]));
        });
        const C = (0, DC.createReadStream)(i);
        C.on("error", (O) => {
          try {
            x.end();
          } catch (B) {
            o.warn(`cannot end response: ${B}`);
          }
          v = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${O}`));
        }), x.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), C.pipe(x);
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
Hn.MacUpdater = Yl;
var Gn = {}, Xl = {};
Object.defineProperty(Xl, "__esModule", { value: !0 });
Xl.verifySignature = NC;
const $f = be, ip = Bs, LC = Ms, Lf = oe;
function sp(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function NC(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, ip.execFile)(...sp(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (o, a, c) => {
      var p;
      try {
        if (o != null || c) {
          wa(r, o, c, i), n(null);
          return;
        }
        const l = FC(a);
        if (l.Status === 0) {
          try {
            const g = Lf.normalize(l.Path), x = Lf.normalize(t);
            if (r.info(`LiteralPath: ${g}. Update Path: ${x}`), g !== x) {
              wa(r, new Error(`LiteralPath of ${g} is different than ${x}`), c, i), n(null);
              return;
            }
          } catch (g) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = g.message) !== null && p !== void 0 ? p : g.stack}`);
          }
          const d = (0, $f.parseDn)(l.SignerCertificate.Subject);
          let _ = !1;
          for (const g of e) {
            const x = (0, $f.parseDn)(g);
            if (x.size ? _ = Array.from(x.keys()).every((v) => x.get(v) === d.get(v)) : g === d.get("CN") && (r.warn(`Signature validated using only CN ${g}. Please add your full Distinguished Name (DN) to publisherNames configuration`), _ = !0), _) {
              n(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (d, _) => d === "RawData" ? void 0 : _, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), n(u);
      } catch (l) {
        wa(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function FC(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function wa(e, t, r, n) {
  if (UC()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, ip.execFileSync)(...sp("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function UC() {
  const e = LC.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.NsisUpdater = void 0;
const Ji = be, Nf = oe, BC = yr, MC = si, Ff = rr, kC = ge, qC = tr, jC = Xl, Uf = er;
class HC extends BC.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, jC.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, kC.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, o, a) => {
        const c = n.packageInfo, p = c != null && o != null;
        if (p && t.disableWebInstaller)
          throw (0, Ji.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Ji.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, Ji.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, c, o, r))
          try {
            await this.httpExecutor.download(new Uf.URL(c.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (u) {
            try {
              await (0, qC.unlink)(o);
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
      this.spawnLog(Nf.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
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
        newUrl: new Uf.URL(r.path),
        oldFile: Nf.join(this.downloadedUpdateHelper.cacheDir, Ji.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Ff.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Ff.DOWNLOAD_PROGRESS, o)), await new MC.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
Gn.NsisUpdater = HC;
(function(e) {
  var t = T && T.__createBinding || (Object.create ? function(y, v, C, O) {
    O === void 0 && (O = C);
    var B = Object.getOwnPropertyDescriptor(v, C);
    (!B || ("get" in B ? !v.__esModule : B.writable || B.configurable)) && (B = { enumerable: !0, get: function() {
      return v[C];
    } }), Object.defineProperty(y, O, B);
  } : function(y, v, C, O) {
    O === void 0 && (O = C), y[O] = v[C];
  }), r = T && T.__exportStar || function(y, v) {
    for (var C in y) C !== "default" && !Object.prototype.hasOwnProperty.call(v, C) && t(v, y, C);
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
  var a = ge;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = Mn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var p = kn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var l = qn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var u = jn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var d = Hn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var _ = Gn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return _.NsisUpdater;
  } }), r(rr, e);
  let g;
  function x() {
    if (process.platform === "win32")
      g = new Gn.NsisUpdater();
    else if (process.platform === "darwin")
      g = new Hn.MacUpdater();
    else {
      g = new Mn.AppImageUpdater();
      try {
        const y = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(y))
          return g;
        switch ((0, n.readFileSync)(y).toString().trim()) {
          case "deb":
            g = new kn.DebUpdater();
            break;
          case "rpm":
            g = new jn.RpmUpdater();
            break;
          case "pacman":
            g = new qn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (y) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", y.message);
      }
    }
    return g;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => g || x()
  });
})(dt);
const Bf = 512 * 1024 * 1024;
function GC(e) {
  const t = (r) => {
    const n = e();
    if (!n || n.isDestroyed() || r !== n.webContents)
      throw new Error("Unauthorized backup request");
    return n;
  };
  X.handle("backup:save", async (r, n) => {
    const i = t(r.sender);
    if (!n || typeof n != "object") throw new Error("Backup archive is invalid or exceeds the 512 MB limit");
    const s = n;
    if (!(s.bytes instanceof Uint8Array) || s.bytes.byteLength === 0 || s.bytes.byteLength > Bf || !s.labels || typeof s.labels.title != "string" || typeof s.labels.filterName != "string")
      throw new Error("Backup archive is invalid or exceeds the 512 MB limit");
    const { canceled: o, filePath: a } = await Tn.showSaveDialog(i, {
      title: s.labels.title,
      defaultPath: Be.join(yt.getPath("documents"), `AKDI-MAKINE-Backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`),
      filters: [{ name: s.labels.filterName, extensions: ["zip"] }]
    });
    return o || !a ? { canceled: !0 } : (await hl(a, Buffer.from(s.bytes)), { canceled: !1, filePath: a });
  }), X.handle("backup:open", async (r, n) => {
    const i = t(r.sender);
    if (!n || typeof n.title != "string" || typeof n.filterName != "string")
      throw new Error("Invalid backup dialog labels");
    const { canceled: s, filePaths: o } = await Tn.showOpenDialog(i, {
      title: n.title,
      properties: ["openFile"],
      filters: [{ name: n.filterName, extensions: ["zip"] }]
    });
    if (s || o.length === 0) return { canceled: !0 };
    const a = o[0], c = await um(a);
    if (c.size === 0 || c.size > Bf)
      throw new Error("Backup archive is empty or exceeds the 512 MB limit");
    const p = await Fd(a);
    return { canceled: !1, bytes: new Uint8Array(p) };
  });
}
const WC = 10 * 1024 * 1024, VC = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]), zC = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function op() {
  return Be.join(yt.getPath("userData"), "images");
}
function ba(e) {
  if (typeof e != "string" || !zC.test(e))
    throw new Error("Invalid image ID");
  return Be.join(op(), e);
}
function YC(e, t) {
  return e === "image/jpeg" ? t[0] === 255 && t[1] === 216 && t[2] === 255 : e === "image/png" ? t.subarray(0, 8).join(",") === "137,80,78,71,13,10,26,10" : e === "image/gif" ? new TextDecoder().decode(t.subarray(0, 3)) === "GIF" : e === "image/webp" ? new TextDecoder().decode(t.subarray(0, 4)) === "RIFF" && new TextDecoder().decode(t.subarray(8, 12)) === "WEBP" : e === "image/bmp" ? new TextDecoder().decode(t.subarray(0, 2)) === "BM" : !1;
}
function XC(e, t) {
  const r = (i) => {
    const s = e();
    if (!s || s.isDestroyed() || i !== s.webContents)
      throw new Error("Unauthorized image request");
  }, n = (i) => {
    const s = e();
    if ((!s || s.isDestroyed() || i !== s.webContents) && !t(i))
      throw new Error("Unauthorized image request");
  };
  X.handle("images:save", async (i, s) => {
    if (r(i.sender), !s || typeof s != "object") throw new Error("Invalid image upload");
    const o = s;
    if (typeof o.name != "string" || typeof o.type != "string" || !(o.bytes instanceof Uint8Array))
      throw new Error("Invalid image upload");
    const a = o.bytes, c = Be.basename(o.name).slice(0, 255), p = o.type.toLowerCase();
    if (!c || !VC.has(p) || a.byteLength === 0 || a.byteLength > WC || !YC(p, a))
      throw new Error("Image must be a supported raster image no larger than 10 MB");
    const l = Ud();
    return await fm(op(), { recursive: !0 }), await hl(ba(l), Buffer.from(a)), { id: l, name: c, type: p, size: a.byteLength };
  }), X.handle("images:read", async (i, s) => {
    n(i.sender);
    try {
      const o = await Fd(ba(s));
      return { bytes: new Uint8Array(o) };
    } catch (o) {
      if (o.code === "ENOENT") return null;
      throw o;
    }
  }), X.handle("images:delete", async (i, s) => {
    r(i.sender), await dm(ba(s), { force: !0 });
  });
}
var ne = {}, Kl = {}, oi = {}, ol = { exports: {} }, Qi = { exports: {} }, va, Mf;
function ap() {
  if (Mf) return va;
  Mf = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = p, n.disable = a, n.enable = o, n.enabled = c, n.humanize = A0(), Object.keys(t).forEach(function(l) {
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
          for (var _ = arguments.length, g = new Array(_), x = 0; x < _; x++)
            g[x] = arguments[x];
          var y = d, v = Number(/* @__PURE__ */ new Date()), C = v - (u || v);
          y.diff = C, y.prev = u, y.curr = v, u = v, g[0] = n.coerce(g[0]), typeof g[0] != "string" && g.unshift("%O");
          var O = 0;
          g[0] = g[0].replace(/%([a-zA-Z%])/g, function(G, Z) {
            if (G === "%%")
              return G;
            O++;
            var J = n.formatters[Z];
            if (typeof J == "function") {
              var se = g[O];
              G = J.call(y, se), g.splice(O, 1), O--;
            }
            return G;
          }), n.formatArgs.call(y, g);
          var B = y.log || n.log;
          B.apply(y, g);
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
        var g = n.instances[u];
        g.enabled = n.enabled(g.namespace);
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
  return va = e, va;
}
var kf;
function KC() {
  return kf || (kf = 1, function(e, t) {
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
        l[0].replace(/%[a-zA-Z%]/g, function(g) {
          g !== "%%" && (d++, g === "%c" && (_ = d));
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
    e.exports = ap()(t);
    var p = e.exports.formatters;
    p.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Qi, Qi.exports)), Qi.exports;
}
var Zi = { exports: {} }, qf;
function JC() {
  return qf || (qf = 1, function(e, t) {
    var r = dl, n = Us;
    t.init = u, t.log = c, t.formatArgs = o, t.save = p, t.load = l, t.useColors = s, t.colors = [6, 2, 3, 4, 5, 1];
    try {
      var i = T0();
      i && (i.stderr || i).level >= 2 && (t.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter(function(_) {
      return /^debug_/i.test(_);
    }).reduce(function(_, g) {
      var x = g.substring(6).toLowerCase().replace(/_([a-z])/g, function(v, C) {
        return C.toUpperCase();
      }), y = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), _[x] = y, _;
    }, {});
    function s() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(_) {
      var g = this.namespace, x = this.useColors;
      if (x) {
        var y = this.color, v = "\x1B[3" + (y < 8 ? y : "8;5;" + y), C = "  ".concat(v, ";1m").concat(g, " \x1B[0m");
        _[0] = C + _[0].split(`
`).join(`
` + C), _.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        _[0] = a() + g + " " + _[0];
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
      for (var g = Object.keys(t.inspectOpts), x = 0; x < g.length; x++)
        _.inspectOpts[g[x]] = t.inspectOpts[g[x]];
    }
    e.exports = ap()(t);
    var d = e.exports.formatters;
    d.o = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts).split(`
`).map(function(g) {
        return g.trim();
      }).join(" ");
    }, d.O = function(_) {
      return this.inspectOpts.colors = this.useColors, n.inspect(_, this.inspectOpts);
    };
  }(Zi, Zi.exports)), Zi.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ol.exports = KC() : ol.exports = JC();
var _e = ol.exports, ie = {}, Jr = {}, ae = {}, lp = {};
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
})(lp);
var cp = {};
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
})(cp);
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(lp), t(cp);
})(ae);
var Ye = {}, QC = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ye, "__esModule", { value: !0 });
const ZC = QC(_e);
ZC.default("request-body");
class Jl {
  constructor(t) {
    if (new.target === Jl)
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
Ye.default = Jl;
function eI(e) {
  return !!e.isModbusRequestBody;
}
Ye.isModbusRequestBody = eI;
var tI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Jr, "__esModule", { value: !0 });
const rI = ae, nI = tI(Ye);
class co extends nI.default {
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
      return r > 43 ? null : new co(r, 1);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (!rI.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    super(t), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._code, 1), t;
  }
}
Jr.default = co;
function iI(e) {
  return e instanceof co;
}
Jr.isExceptionRequestBody = iI;
var ai = {}, sI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ai, "__esModule", { value: !0 });
const jf = ae, oI = sI(Ye);
class uo extends oI.default {
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
      if (t.readUInt8(0) !== jf.FC.READ_COIL)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new uo(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(jf.FC.READ_COIL), this._start = t, this._count = r, this._start > 65535)
      throw new Error("InvalidStartAddress");
    if (this._count > 2e3)
      throw new Error("InvalidQuantity");
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._count, 3), t;
  }
}
ai.default = uo;
function aI(e) {
  return e instanceof uo;
}
ai.isReadCoilsRequestBody = aI;
var li = {}, lI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(li, "__esModule", { value: !0 });
const Hf = ae, cI = lI(Ye);
class fo extends cI.default {
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
      if (t.readUInt8(0) !== Hf.FC.READ_DISCRETE_INPUT)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3);
      return new fo(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Hf.FC.READ_DISCRETE_INPUT), t > 65535)
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
li.default = fo;
function uI(e) {
  return e instanceof fo;
}
li.isReadDiscreteInputsRequestBody = uI;
var ci = {}, fI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Gf = ae, dI = fI(Ye);
class ho extends dI.default {
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
      return r !== Gf.FC.READ_HOLDING_REGISTERS ? null : new ho(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Gf.FC.READ_HOLDING_REGISTERS), t > 65535)
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
ci.default = ho;
function hI(e) {
  return e instanceof ho;
}
ci.isReadHoldingRegistersRequestBody = hI;
var ui = {}, pI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(ui, "__esModule", { value: !0 });
const Wf = ae, _I = pI(Ye);
class po extends _I.default {
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
      return r !== Wf.FC.READ_INPUT_REGISTERS ? null : new po(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Wf.FC.READ_INPUT_REGISTERS), t > 65535)
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
ui.default = po;
function mI(e) {
  return e instanceof po;
}
ui.isReadInputRegistersRequestBody = mI;
var fi = {}, di = {}, gI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(di, "__esModule", { value: !0 });
const Vf = ae, xI = gI(Ye);
class _o extends xI.default {
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
      if (t.readUInt8(0) !== Vf.FC.WRITE_MULTIPLE_COILS)
        return null;
      const n = t.readUInt16BE(1), i = t.readUInt16BE(3), s = t.readUInt8(5), o = t.slice(6, 6 + s);
      return new _o(n, o, i);
    } catch {
      return null;
    }
  }
  constructor(t, r, n) {
    if (super(Vf.FC.WRITE_MULTIPLE_COILS), t > 65535)
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
di.default = _o;
function yI(e) {
  return e instanceof _o;
}
di.isWriteMultipleCoilsRequestBody = yI;
var hi = {}, EI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(hi, "__esModule", { value: !0 });
const zf = ae, wI = EI(Ye);
class mo extends wI.default {
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
      return r !== zf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new mo(n, s);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(zf.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), t > 65535)
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
hi.default = mo;
function bI(e) {
  return e instanceof mo;
}
hi.isWriteMultipleRegistersRequestBody = bI;
var pi = {}, vI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(pi, "__esModule", { value: !0 });
const Yf = ae, RI = vI(Ye);
class go extends RI.default {
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
      return r !== Yf.FC.WRITE_SINGLE_COIL ? null : new go(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Yf.FC.WRITE_SINGLE_COIL), t > 65535)
      throw new Error("InvalidStartAddress");
    this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value ? 65280 : 0, 3), t;
  }
}
pi.default = go;
function CI(e) {
  return e instanceof go;
}
pi.isWriteSingleCoilRequestBody = CI;
var _i = {}, II = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(_i, "__esModule", { value: !0 });
const Xf = ae, AI = II(Ye);
class xo extends AI.default {
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
      return r !== Xf.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new xo(n, i);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(Xf.FC.WRITE_SINGLE_HOLDING_REGISTER), t > 65535)
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
_i.default = xo;
function SI(e) {
  return e instanceof xo;
}
_i.isWriteSingleRegisterRequestBody = SI;
var bt = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(fi, "__esModule", { value: !0 });
const It = ae, TI = bt(Jr), DI = bt(ai), PI = bt(li), OI = bt(ci), $I = bt(ui), LI = bt(di), NI = bt(hi), FI = bt(pi), UI = bt(_i), BI = bt(_e), Ra = BI.default("request-factory");
class MI {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      if (Ra("fc", r, "payload", t), It.isFunctionCode(r))
        switch (r) {
          case It.FC.READ_COIL:
            return DI.default.fromBuffer(t);
          case It.FC.READ_DISCRETE_INPUT:
            return PI.default.fromBuffer(t);
          case It.FC.READ_HOLDING_REGISTERS:
            return OI.default.fromBuffer(t);
          case It.FC.READ_INPUT_REGISTERS:
            return $I.default.fromBuffer(t);
          case It.FC.WRITE_SINGLE_COIL:
            return FI.default.fromBuffer(t);
          case It.FC.WRITE_SINGLE_HOLDING_REGISTER:
            return UI.default.fromBuffer(t);
          case It.FC.WRITE_MULTIPLE_COILS:
            return LI.default.fromBuffer(t);
          case It.FC.WRITE_MULTIPLE_HOLDING_REGISTERS:
            return NI.default.fromBuffer(t);
        }
      if (r <= 43)
        return Ra("Illegal Function (fc %d)", r), new TI.default(r, 1);
    } catch (r) {
      return Ra("Exception while reading function code", r), null;
    }
  }
}
fi.default = MI;
Object.defineProperty(ie, "__esModule", { value: !0 });
var up = Jr;
ie.ExceptionRequestBody = up.default;
ie.isExceptionRequestBody = up.isExceptionRequestBody;
var fp = ai;
ie.ReadCoilsRequestBody = fp.default;
ie.isReadCoilsRequestBody = fp.isReadCoilsRequestBody;
var dp = li;
ie.ReadDiscreteInputsRequestBody = dp.default;
ie.isReadDiscreteInputsRequestBody = dp.isReadDiscreteInputsRequestBody;
var hp = ci;
ie.ReadHoldingRegistersRequestBody = hp.default;
ie.isReadHoldingRegistersRequestBody = hp.isReadHoldingRegistersRequestBody;
var pp = ui;
ie.ReadInputRegistersRequestBody = pp.default;
ie.isReadInputRegistersRequestBody = pp.isReadInputRegistersRequestBody;
var _p = Ye;
ie.ModbusRequestBody = _p.default;
ie.isModbusRequestBody = _p.isModbusRequestBody;
var kI = fi;
ie.RequestFactory = kI.default;
var mp = di;
ie.WriteMultipleCoilsRequestBody = mp.default;
ie.isWriteMultipleCoilsRequestBody = mp.isWriteMultipleCoilsRequestBody;
var gp = hi;
ie.WriteMultipleRegistersRequestBody = gp.default;
ie.isWriteMultipleRegistersRequestBody = gp.isWriteMultipleRegistersRequestBody;
var xp = pi;
ie.WriteSingleCoilRequestBody = xp.default;
ie.isWriteSingleCoilRequestBody = xp.isWriteSingleCoilRequestBody;
var yp = _i;
ie.WriteSingleRegisterRequestBody = yp.default;
ie.isWriteSingleRegisterRequestBody = yp.isWriteSingleRegisterRequestBody;
Object.defineProperty(oi, "__esModule", { value: !0 });
const qI = _e, Ae = qI("modbus-client"), At = ie;
class Ql {
  constructor(t) {
    if (new.target === Ql)
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
    Ae("issuing new read coils request");
    let n;
    try {
      n = new At.ReadCoilsRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readDiscreteInputs(t, r) {
    Ae("issuing new read discrete inputs request");
    let n;
    try {
      n = new At.ReadDiscreteInputsRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readHoldingRegisters(t, r) {
    Ae("issuing new read holding registers request");
    let n;
    try {
      n = new At.ReadHoldingRegistersRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  readInputRegisters(t, r) {
    Ae("issuing new read input registers request");
    let n;
    try {
      n = new At.ReadInputRegistersRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleCoil(t, r) {
    Ae("issuing new write single coil request");
    let n;
    try {
      n = new At.WriteSingleCoilRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeSingleRegister(t, r) {
    Ae("issuing new write single register request");
    let n;
    try {
      n = new At.WriteSingleRegisterRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
    }
    return this._requestHandler.register(n);
  }
  writeMultipleCoils(t, r, n = 0) {
    Ae("issuing new write multiple coils request");
    let i;
    try {
      r instanceof Buffer ? i = new At.WriteMultipleCoilsRequestBody(t, r, n) : i = new At.WriteMultipleCoilsRequestBody(t, r);
    } catch (s) {
      return Ae("unknown request error occurred"), Promise.reject(s);
    }
    return this._requestHandler.register(i);
  }
  writeMultipleRegisters(t, r) {
    Ae("issuing new write multiple registers request");
    let n;
    try {
      n = new At.WriteMultipleRegistersRequestBody(t, r);
    } catch (i) {
      return Ae("unknown request error occurred"), Promise.reject(i);
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
    Ae("received data"), this._responseHandler.handleData(t);
    do {
      const r = this._responseHandler.shift();
      if (!r)
        return;
      this.unitId === r.unitId && this._requestHandler.handle(r);
    } while (!0);
  }
}
oi.default = Ql;
var Zl = {}, mi = {}, br = {}, Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
const jI = ae;
class HI {
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
    if (r === !1 && !jI.isFunctionCode(t))
      throw Error("InvalidFunctionCode");
    this._fc = t;
  }
}
Qr.default = HI;
var GI = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(br, "__esModule", { value: !0 });
const Kf = ae, WI = GI(Qr);
class Wn extends WI.default {
  get code() {
    return this._code;
  }
  get message() {
    return Kf.errorCodeToMessage(this._code);
  }
  get byteCount() {
    return 2;
  }
  get isException() {
    return !0;
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0) - 128, n = t.readUInt8(1);
    if (!Kf.isFunctionCode(r))
      throw Error("InvalidFunctionCode");
    return new Wn(r, n);
  }
  static fromRequest(t) {
    return new Wn(t.fc, t.code);
  }
  constructor(t, r) {
    super(t, !0), this._code = r;
  }
  createPayload() {
    const t = Buffer.alloc(2);
    return t.writeUInt8(this._fc + 128, 0), t.writeUInt8(this._code, 1), t;
  }
}
br.default = Wn;
function VI(e) {
  return e instanceof Wn;
}
br.isExceptionResponseBody = VI;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
class zI {
  constructor({ err: t, message: r, response: n, request: i }) {
    this.err = t, this.message = r, this.request = i, this.response = n;
  }
}
Ot.UserRequestError = zI;
function Ep(e) {
  return e instanceof Ep ? !0 : !(typeof e != "object" || e.err === void 0 || typeof e.err != "string" || e.message === void 0 || typeof e.message != "string");
}
Ot.isUserRequestError = Ep;
var gi = {}, yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
class YI {
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
yo.UserRequestMetrics = YI;
Object.defineProperty(gi, "__esModule", { value: !0 });
const XI = Ot, KI = yo, JI = _e, Jf = JI("user-request");
class QI {
  constructor(t, r = 5e3) {
    Jf("creating new user request with timeout", r), this._request = t, this._timeout = r, this._metrics = new KI.UserRequestMetrics(), this._promise = new Promise((n, i) => {
      this._resolve = n, this._reject = i;
    });
  }
  createPayload() {
    return this._request.createPayload();
  }
  start(t) {
    this._metrics.startedAt = /* @__PURE__ */ new Date(), this._timer = setTimeout(() => {
      this._reject(new XI.UserRequestError({
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
    return this._metrics.receivedAt = /* @__PURE__ */ new Date(), Jf("request completed in %d ms (sat in cue %d ms)", this.metrics.transferTime, this.metrics.waitTime), this._resolve({
      metrics: this.metrics,
      request: this._request,
      response: t
    });
  }
  get reject() {
    return this._reject;
  }
}
gi.default = QI;
var wp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(mi, "__esModule", { value: !0 });
const Qf = "OutOfSync", Zf = "Offline", ZI = "ModbusException", eA = "ManuallyCleared", tA = _e, Qe = tA("client-request-handler"), rA = wp(br), Pr = Ot, nA = wp(gi);
class ec {
  constructor(t, r) {
    if (new.target === ec)
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
    const r = new nA.default(t, this._timeout);
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
      Qe("something is weird, request fc and response fc do not match."), r.reject(new Pr.UserRequestError({
        err: Qf,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.body instanceof rA.default) {
      Qe("response is a exception"), r.reject(new Pr.UserRequestError({
        err: ZI,
        message: "A Modbus Exception Occurred - See Response Body",
        request: n,
        response: t
      })), this._clearCurrentRequest(), this._flush();
      return;
    }
    Qe("resolving request"), r.resolve(t), this._clearCurrentRequest(), this._flush();
  }
  manuallyRejectCurrentRequest() {
    this._currentRequest && (this._currentRequest.reject(new Pr.UserRequestError({
      err: eA,
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
      t && t.reject(new Pr.UserRequestError({
        err: Qf,
        message: "rejecting because of earlier OutOfSync error",
        request: t.request
      }));
    }
  }
  _onConnect() {
    this._state = "online";
  }
  _onClose() {
    this._state = "offline", this._currentRequest && this._currentRequest.reject(new Pr.UserRequestError({
      err: Zf,
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
      Qe("rejecting request immediatly, client offline"), this._currentRequest && this._currentRequest.reject(new Pr.UserRequestError({
        err: Zf,
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
mi.default = ec;
var xi = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
class bp {
}
bp.fromBuffer = (e) => {
  throw new TypeError("Cannot call from buffer from base abstract class");
};
Zr.default = bp;
function iA(e) {
  return e.body !== void 0;
}
Zr.isModbusRequest = iA;
var vp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(xi, "__esModule", { value: !0 });
const sA = _e, es = sA("tcp-request"), oA = vp(Zr), aA = vp(fi);
class tc extends oA.default {
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
        return es("no enough data in the buffer yet"), null;
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      es("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), es("buffer", t);
      const o = aA.default.fromBuffer(t.slice(7, 6 + i));
      return o ? new tc(r, n, i, s, o) : null;
    } catch (r) {
      return es("not enough data to create a tcp request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload(), r = Buffer.alloc(7 + this._body.byteCount);
    return r.writeUInt16BE(this._id, 0), r.writeUInt16BE(0, 2), r.writeUInt16BE(this._body.byteCount + 1, 4), r.writeUInt8(this._unitId, 6), t.copy(r, 7), r;
  }
}
xi.default = tc;
var Rp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zl, "__esModule", { value: !0 });
const lA = _e, ts = lA("tcp-client-request-handler"), cA = Rp(mi), uA = Rp(xi), ed = Ot, fA = "OutOfSync", dA = "Protocol";
class hA extends cA.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._requestId = 0, this._unitId = r, this._requests = [], this._currentRequest = null, this._socket.on("connect", this._onConnect.bind(this)), this._socket.on("close", this._onClose.bind(this));
  }
  register(t) {
    this._requestId = (this._requestId + 1) % 65535, ts("registrating new request", "transaction id", this._requestId, "unit id", this._unitId, "length", t.byteCount);
    const r = new uA.default(this._requestId, 0, t.byteCount + 1, this._unitId, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (!t)
      return;
    const r = this._currentRequest;
    if (!r) {
      ts("something is strange, received a respone without a request");
      return;
    }
    const n = r.request;
    if (t.id !== n.id) {
      ts("something weird is going on, response transition id does not equal request transition id", t.id, n.id), r.reject(new ed.UserRequestError({
        err: fA,
        message: "request fc and response fc does not match.",
        request: n
      })), this._clearAllRequests();
      return;
    }
    if (t.protocol !== 0) {
      ts("server responds with wrong protocol version"), r.reject(new ed.UserRequestError({
        err: dA,
        message: "Unknown protocol version " + t.protocol,
        request: n
      })), this._clearAllRequests();
      return;
    }
    super.handle(t);
  }
}
Zl.default = hA;
var rc = {}, yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
class pA {
  constructor() {
    this._buffer = Buffer.alloc(0);
  }
  shift() {
    return this._messages.shift();
  }
}
yi.default = pA;
var Ei = {}, wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
class _A {
  get body() {
    return this._body;
  }
  static fromRequest(t, r) {
    throw new TypeError("Cannot call fromRequest directly from abstract class");
  }
}
wi.default = _A;
var bi = {}, Eo = {};
const mA = _e, td = mA("buffer-utils");
class gA {
  static bufferShift(t, r, n) {
    t = t - 1;
    const i = t % 8, s = Math.floor(t / 8), a = Math.floor(r / 8) - s + 1, c = Buffer.allocUnsafe(a);
    c[0] = n[0] << i, td("buffer[0] = %s ( %s << %d )", c[0].toString(2), n[0].toString(2), i);
    const p = Buffer.concat([n, Buffer.alloc(1)], n.length + 1);
    for (let l = 1; l < a; l++)
      c[l] = (p[l] << i) + (p[l - 1] >> 8 - i), td("buffer[%d] = %s ( %s << %d + %s >> %d)", l, c[l].toString(2), p[l].toString(2), i, p[l - 1].toString(2), 8 - t);
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
var nc = gA, en = {}, xA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(en, "__esModule", { value: !0 });
const yA = xA(Qr);
class EA extends yA.default {
  constructor(t) {
    super(t);
  }
  get fc() {
    return this._fc;
  }
}
en.default = EA;
var Cp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Eo, "__esModule", { value: !0 });
const wA = _e, bA = wA("read-coils-response"), vA = Cp(nc), rd = ae, RA = Cp(en), { bufferToArrayStatus: nd, arrayStatusToBuffer: CA } = vA.default;
class bs extends RA.default {
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
    const n = nd(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new bs(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== rd.FC.READ_COIL ? null : new bs(i, n);
    } catch {
      return bA("no valid read coils response body in the buffer yet"), null;
    }
  }
  constructor(t, r) {
    if (super(rd.FC.READ_COIL), this._coils = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = CA(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = nd(t);
    else
      throw new Error("InvalidCoilsInput");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
Eo.default = bs;
var wo = {}, Ip = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(wo, "__esModule", { value: !0 });
const IA = Ip(nc), id = ae, AA = Ip(en), { bufferToArrayStatus: sd, arrayStatusToBuffer: SA } = IA.default;
class vs extends AA.default {
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
    const n = sd(r), i = t.start, s = i + t.count, o = n.slice(i, s);
    return new vs(o, Math.ceil(o.length / 8));
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
      return i.length !== n || r !== id.FC.READ_DISCRETE_INPUT ? null : new vs(i, n);
    } catch {
      return null;
    }
  }
  constructor(t, r) {
    if (super(id.FC.READ_DISCRETE_INPUT), this._discrete = t, this._numberOfBytes = r, t instanceof Array)
      this._valuesAsArray = t, this._valuesAsBuffer = SA(t);
    else if (t instanceof Buffer)
      this._valuesAsBuffer = t, this._valuesAsArray = sd(t);
    else
      throw new Error("InvalidType_MustBeBufferOrArray");
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt8(this._numberOfBytes, 1), this._valuesAsBuffer.copy(t, 2), t;
  }
}
wo.default = vs;
var bo = {}, TA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(bo, "__esModule", { value: !0 });
const DA = _e, PA = DA("ReadHoldingRegistersResponseBody"), od = ae, OA = TA(en);
class Rs extends OA.default {
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
    return new Rs(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== od.FC.READ_HOLDING_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new Rs(n, s, i);
  }
  constructor(t, r, n) {
    if (super(od.FC.READ_HOLDING_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, PA("ReadHoldingRegistersResponseBody values", r), r instanceof Array)
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
bo.default = Rs;
var vo = {}, $A = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(vo, "__esModule", { value: !0 });
const ad = ae, LA = $A(en);
class Cs extends LA.default {
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
    return new Cs(s.length, s);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt8(1), i = t.slice(2, 2 + n);
    if (r !== ad.FC.READ_INPUT_REGISTERS)
      return null;
    const s = [];
    for (let o = 0; o < n; o += 2)
      s.push(i.readUInt16BE(o));
    return new Cs(n, s, i);
  }
  constructor(t, r, n) {
    if (super(ad.FC.READ_INPUT_REGISTERS), this._byteCount = t, this._values = r, this._bufferLength = 2, r instanceof Array)
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
vo.default = Cs;
var Ro = {}, tn = {}, NA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(tn, "__esModule", { value: !0 });
const FA = NA(Qr);
class UA extends FA.default {
}
tn.default = UA;
var BA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const ld = ae, MA = BA(tn);
class Is extends MA.default {
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
    return new Is(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== ld.FC.WRITE_MULTIPLE_COILS ? null : new Is(n, i);
  }
  constructor(t, r) {
    super(ld.FC.WRITE_MULTIPLE_COILS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
Ro.default = Is;
var Co = {}, kA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Co, "__esModule", { value: !0 });
const cd = ae, qA = kA(tn);
class As extends qA.default {
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
    return new As(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== cd.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? null : new As(n, i);
  }
  constructor(t, r) {
    super(cd.FC.WRITE_MULTIPLE_HOLDING_REGISTERS), this._start = t, this._quantity = r;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._start, 1), t.writeUInt16BE(this._quantity, 3), t;
  }
}
Co.default = As;
var Io = {}, jA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Io, "__esModule", { value: !0 });
const ud = ae, HA = jA(tn);
class Ss extends HA.default {
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
    return new Ss(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3) === 65280;
    return r !== ud.FC.WRITE_SINGLE_COIL ? null : new Ss(n, i);
  }
  constructor(t, r) {
    super(ud.FC.WRITE_SINGLE_COIL), this._address = t, this._value = r === 65280 ? 65280 : 0;
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
Io.default = Ss;
var Ao = {}, GA = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ao, "__esModule", { value: !0 });
const fd = ae, WA = GA(tn);
class Ts extends WA.default {
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
    return new Ts(r, n);
  }
  static fromBuffer(t) {
    const r = t.readUInt8(0), n = t.readUInt16BE(1), i = t.readUInt16BE(3);
    return r !== fd.FC.WRITE_SINGLE_HOLDING_REGISTER ? null : new Ts(n, i);
  }
  constructor(t, r) {
    super(fd.FC.WRITE_SINGLE_HOLDING_REGISTER), this._address = t, this._value = r;
  }
  createPayload() {
    const t = Buffer.alloc(5);
    return t.writeUInt8(this._fc, 0), t.writeUInt16BE(this._address, 1), t.writeUInt16BE(this._value, 3), t;
  }
}
Ao.default = Ts;
var $t = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(bi, "__esModule", { value: !0 });
const VA = _e, Ca = VA("response-factory"), kt = ae, zA = $t(br), YA = $t(Eo), XA = $t(wo), KA = $t(bo), JA = $t(vo), QA = $t(Ro), ZA = $t(Co), eS = $t(Io), tS = $t(Ao);
class rS {
  static fromBuffer(t) {
    try {
      const r = t.readUInt8(0);
      return Ca("fc", r, "payload", t), r > 128 ? zA.default.fromBuffer(t) : r === kt.FC.READ_COIL ? YA.default.fromBuffer(t) : r === kt.FC.READ_DISCRETE_INPUT ? XA.default.fromBuffer(t) : r === kt.FC.READ_HOLDING_REGISTERS ? KA.default.fromBuffer(t) : r === kt.FC.READ_INPUT_REGISTERS ? JA.default.fromBuffer(t) : r === kt.FC.WRITE_SINGLE_COIL ? eS.default.fromBuffer(t) : r === kt.FC.WRITE_SINGLE_HOLDING_REGISTER ? tS.default.fromBuffer(t) : r === kt.FC.WRITE_MULTIPLE_COILS ? QA.default.fromBuffer(t) : r === kt.FC.WRITE_MULTIPLE_HOLDING_REGISTERS ? ZA.default.fromBuffer(t) : null;
    } catch (r) {
      return Ca("when NoSuchIndex Exception, the buffer does not contain a complete message"), Ca(r), null;
    }
  }
}
bi.default = rS;
var Ap = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const nS = _e, _n = nS("tcp-response"), iS = Ap(wi), sS = Ap(bi);
class Ds extends iS.default {
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
    return new Ds(t.id, t.protocol, r.byteCount + 1, t.unitId, r);
  }
  static fromBuffer(t) {
    try {
      const r = t.readUInt16BE(0), n = t.readUInt16BE(2), i = t.readUInt16BE(4), s = t.readUInt8(6);
      _n("tcp header complete, id", r, "protocol", n, "length", i, "unitId", s), _n("buffer", t);
      const o = sS.default.fromBuffer(t.slice(7, 7 + i - 1));
      return o ? (_n("buffer contains a valid response body"), new Ds(r, n, i, s, o)) : (_n("not enough data for a response body"), null);
    } catch {
      return _n("not enough data available"), null;
    }
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt16BE(this._id, 0), t.writeUInt16BE(this._protocol, 2), t.writeUInt16BE(this._bodyLength, 4), t.writeUInt8(this._unitId, 6), this._body.createPayload().copy(t, 7), t;
  }
}
Ei.default = Ds;
var Sp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(rc, "__esModule", { value: !0 });
const oS = _e, mn = oS("tcp-response-handler"), aS = Sp(yi), lS = Sp(Ei);
class cS extends aS.default {
  constructor() {
    super(), this._buffer = Buffer.alloc(0), this._messages = [];
  }
  handleData(t) {
    mn("receiving new data", t), this._buffer = Buffer.concat([this._buffer, t]), mn("buffer", this._buffer);
    do {
      const r = lS.default.fromBuffer(this._buffer);
      if (!r) {
        mn("not enough data available to parse");
        return;
      }
      mn("response id", r.id, "protocol", r.protocol, "length", r.bodyLength, "unit", r.unitId), mn("reset buffer from", this._buffer.length, "to", this._buffer.length - r.byteCount), this._messages.push(r), this._buffer = this._buffer.slice(r.byteCount);
    } while (!0);
  }
}
rc.default = cS;
var ic = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Kl, "__esModule", { value: !0 });
const uS = ic(oi), fS = ic(Zl), dS = ic(rc);
class hS extends uS.default {
  constructor(t, r = 1, n = 5e3) {
    super(t), this._requestHandler = new fS.default(t, r, n), this._responseHandler = new dS.default(), this._unitId = r, this._timeout = n;
  }
  get slaveId() {
    return this._unitId;
  }
  get unitId() {
    return this._unitId;
  }
}
Kl.default = hS;
var sc = {}, oc = {}, rs = {}, dd;
function vt() {
  return dd || (dd = 1, Object.defineProperty(rs, "__esModule", {
    value: !0
  }), rs.default = function(e, t) {
    var r = function(i, s) {
      return t(i, s) >>> 0;
    };
    return r.signed = t, r.unsigned = r, r.model = e, r;
  }), rs;
}
var Ia, hd;
function pS() {
  if (hd) return Ia;
  hd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return Ia = (0, r.default)("crc1", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = ~~s, a = 0, c = 0; c < i.length; c++) {
      var p = i[c];
      a += p;
    }
    return o += a % 256, o % 256;
  }), Ia;
}
var Aa, pd;
function _S() {
  if (pd) return Aa;
  pd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 7, 14, 9, 28, 27, 18, 21, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, 224, 231, 238, 233, 252, 251, 242, 245, 216, 223, 214, 209, 196, 195, 202, 205, 144, 151, 158, 153, 140, 139, 130, 133, 168, 175, 166, 161, 180, 179, 186, 189, 199, 192, 201, 206, 219, 220, 213, 210, 255, 248, 241, 246, 227, 228, 237, 234, 183, 176, 185, 190, 171, 172, 165, 162, 143, 136, 129, 134, 147, 148, 157, 154, 39, 32, 41, 46, 59, 60, 53, 50, 31, 24, 17, 22, 3, 4, 13, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, 137, 142, 135, 128, 149, 146, 155, 156, 177, 182, 191, 184, 173, 170, 163, 164, 249, 254, 247, 240, 229, 226, 235, 236, 193, 198, 207, 200, 221, 218, 211, 212, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, 25, 30, 23, 16, 5, 2, 11, 12, 33, 38, 47, 40, 61, 58, 51, 52, 78, 73, 64, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, 15, 26, 29, 20, 19, 174, 169, 160, 167, 178, 181, 188, 187, 150, 145, 152, 159, 138, 141, 132, 131, 222, 217, 208, 215, 194, 197, 204, 203, 230, 225, 232, 239, 250, 253, 244, 243];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Aa = (0, r.default)("crc-8", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), Aa;
}
var Sa, _d;
function mS() {
  if (_d) return Sa;
  _d = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252, 162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191, 93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255, 70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186, 228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249, 27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231, 185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243, 112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109, 51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207, 45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235, 181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106, 43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215, 137, 107, 53];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Sa = (0, r.default)("dallas-1-wire", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] & 255;
    }
    return a;
  }), Sa;
}
var Ta, md;
function gS() {
  if (md) return Ta;
  md = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Ta = (0, r.default)("crc-16", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = ~~o, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), Ta;
}
var Da, gd;
function xS() {
  if (gd) return Da;
  gd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Da = (0, r.default)("ccitt", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a >> 8 ^ p) & 255] ^ a << 8) & 65535;
    }
    return a;
  }), Da;
}
var Pa, xd;
function yS() {
  if (xd) return Pa;
  xd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Pa = (0, r.default)("crc-16-modbus", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 65535, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), Pa;
}
var Oa, yd;
function ES() {
  if (yd) return Oa;
  yd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(i) {
    return i && i.__esModule ? i : { default: i };
  }
  return Oa = (0, r.default)("xmodem", function(i, s) {
    e.Buffer.isBuffer(i) || (i = (0, e.Buffer)(i));
    for (var o = typeof s < "u" ? ~~s : 0, a = 0; a < i.length; a++) {
      var c = i[a], p = o >>> 8 & 255;
      p ^= c & 255, p ^= p >>> 4, o = o << 8 & 65535, o ^= p, p = p << 5 & 65535, o ^= p, p = p << 7 & 65535, o ^= p;
    }
    return o;
  }), Oa;
}
var $a, Ed;
function wS() {
  if (Ed) return $a;
  Ed = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 4489, 8978, 12955, 17956, 22445, 25910, 29887, 35912, 40385, 44890, 48851, 51820, 56293, 59774, 63735, 4225, 264, 13203, 8730, 22181, 18220, 30135, 25662, 40137, 36160, 49115, 44626, 56045, 52068, 63999, 59510, 8450, 12427, 528, 5017, 26406, 30383, 17460, 21949, 44362, 48323, 36440, 40913, 60270, 64231, 51324, 55797, 12675, 8202, 4753, 792, 30631, 26158, 21685, 17724, 48587, 44098, 40665, 36688, 64495, 60006, 55549, 51572, 16900, 21389, 24854, 28831, 1056, 5545, 10034, 14011, 52812, 57285, 60766, 64727, 34920, 39393, 43898, 47859, 21125, 17164, 29079, 24606, 5281, 1320, 14259, 9786, 57037, 53060, 64991, 60502, 39145, 35168, 48123, 43634, 25350, 29327, 16404, 20893, 9506, 13483, 1584, 6073, 61262, 65223, 52316, 56789, 43370, 47331, 35448, 39921, 29575, 25102, 20629, 16668, 13731, 9258, 5809, 1848, 65487, 60998, 56541, 52564, 47595, 43106, 39673, 35696, 33800, 38273, 42778, 46739, 49708, 54181, 57662, 61623, 2112, 6601, 11090, 15067, 20068, 24557, 28022, 31999, 38025, 34048, 47003, 42514, 53933, 49956, 61887, 57398, 6337, 2376, 15315, 10842, 24293, 20332, 32247, 27774, 42250, 46211, 34328, 38801, 58158, 62119, 49212, 53685, 10562, 14539, 2640, 7129, 28518, 32495, 19572, 24061, 46475, 41986, 38553, 34576, 62383, 57894, 53437, 49460, 14787, 10314, 6865, 2904, 32743, 28270, 23797, 19836, 50700, 55173, 58654, 62615, 32808, 37281, 41786, 45747, 19012, 23501, 26966, 30943, 3168, 7657, 12146, 16123, 54925, 50948, 62879, 58390, 37033, 33056, 46011, 41522, 23237, 19276, 31191, 26718, 7393, 3432, 16371, 11898, 59150, 63111, 50204, 54677, 41258, 45219, 33336, 37809, 27462, 31439, 18516, 23005, 11618, 15595, 3696, 8185, 63375, 58886, 54429, 50452, 45483, 40994, 37561, 33584, 31687, 27214, 22741, 18780, 15843, 11370, 7921, 3960];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), $a = (0, r.default)("kermit", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 0, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a ^ p) & 255] ^ a >> 8) & 65535;
    }
    return a;
  }), $a;
}
var La, wd;
function bS() {
  if (wd) return La;
  wd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 8801531, 9098509, 825846, 9692897, 1419802, 1651692, 10452759, 10584377, 2608578, 2839604, 11344079, 3303384, 11807523, 12104405, 4128302, 12930697, 4391538, 5217156, 13227903, 5679208, 13690003, 14450021, 5910942, 6606768, 14844747, 15604413, 6837830, 16197969, 7431594, 8256604, 16494759, 840169, 9084178, 8783076, 18463, 10434312, 1670131, 1434117, 9678590, 11358416, 2825259, 2590173, 10602790, 4109873, 12122826, 11821884, 3289031, 13213536, 5231515, 4409965, 12912278, 5929345, 14431610, 13675660, 5693559, 6823513, 15618722, 14863188, 6588335, 16513208, 8238147, 7417269, 16212302, 1680338, 10481449, 9664223, 1391140, 9061683, 788936, 36926, 8838341, 12067563, 4091408, 3340262, 11844381, 2868234, 11372785, 10555655, 2579964, 14478683, 5939616, 5650518, 13661357, 5180346, 13190977, 12967607, 4428364, 8219746, 16457881, 16234863, 7468436, 15633027, 6866552, 6578062, 14816117, 1405499, 9649856, 10463030, 1698765, 8819930, 55329, 803287, 9047340, 11858690, 3325945, 4072975, 12086004, 2561507, 10574104, 11387118, 2853909, 13647026, 5664841, 5958079, 14460228, 4446803, 12949160, 13176670, 5194661, 7454091, 16249200, 16476294, 8201341, 14834538, 6559633, 6852199, 15647388, 3360676, 11864927, 12161705, 4185682, 10527045, 2551230, 2782280, 11286707, 9619101, 1346150, 1577872, 10379115, 73852, 8875143, 9172337, 899466, 16124205, 7357910, 8182816, 16421083, 6680524, 14918455, 15678145, 6911546, 5736468, 13747439, 14507289, 5968354, 12873461, 4334094, 5159928, 13170435, 4167245, 12180150, 11879232, 3346363, 11301036, 2767959, 2532769, 10545498, 10360692, 1596303, 1360505, 9604738, 913813, 9157998, 8856728, 92259, 16439492, 8164415, 7343561, 16138546, 6897189, 15692510, 14936872, 6662099, 5986813, 14488838, 13733104, 5750795, 13156124, 5174247, 4352529, 12855018, 2810998, 11315341, 10498427, 2522496, 12124823, 4148844, 3397530, 11901793, 9135439, 862644, 110658, 8912057, 1606574, 10407765, 9590435, 1317464, 15706879, 6940164, 6651890, 14889737, 8145950, 16384229, 16161043, 7394792, 5123014, 13133629, 12910283, 4370992, 14535975, 5997020, 5707818, 13718737, 2504095, 10516836, 11329682, 2796649, 11916158, 3383173, 4130419, 12143240, 8893606, 129117, 876971, 9121104, 1331783, 9576124, 10389322, 1625009, 14908182, 6633453, 6925851, 15721184, 7380471, 16175372, 16402682, 8127489, 4389423, 12891860, 13119266, 5137369, 13704398, 5722165, 6015427, 14517560];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), La = (0, r.default)("crc-24", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = typeof o < "u" ? ~~o : 11994318, c = 0; c < s.length; c++) {
      var p = s[c];
      a = (i[(a >> 16 ^ p) & 255] ^ a << 8) & 16777215;
    }
    return a;
  }), La;
}
var Na, bd;
function vS() {
  if (bd) return Na;
  bd = 1;
  var e = Et, t = vt(), r = n(t);
  function n(s) {
    return s && s.__esModule ? s : { default: s };
  }
  var i = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
  return typeof Int32Array < "u" && (i = new Int32Array(i)), Na = (0, r.default)("crc-32", function(s, o) {
    e.Buffer.isBuffer(s) || (s = (0, e.Buffer)(s));
    for (var a = o === 0 ? 0 : ~~o ^ -1, c = 0; c < s.length; c++) {
      var p = s[c];
      a = i[(a ^ p) & 255] ^ a >>> 8;
    }
    return a ^ -1;
  }), Na;
}
var Fa, vd;
function ac() {
  return vd || (vd = 1, Fa = {
    crc1: pS(),
    crc8: _S(),
    crc81wire: mS(),
    crc16: gS(),
    crc16ccitt: xS(),
    crc16modbus: yS(),
    crc16xmodem: ES(),
    crc16kermit: wS(),
    crc24: bS(),
    crc32: vS()
  }), Fa;
}
var rn = {}, Tp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(rn, "__esModule", { value: !0 });
const RS = _e, ns = RS("rtu-request"), Rd = ac(), CS = Tp(Zr), IS = Tp(fi);
class lc extends CS.default {
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
        return ns("not enough data in the buffer yet"), null;
      const r = t.readUInt8(0);
      ns(`rtu header complete, address, ${r}`), ns("buffer", t);
      const n = IS.default.fromBuffer(t.slice(1));
      if (!n)
        return null;
      const i = 1 + n.byteCount, s = Rd.crc16modbus(t.slice(0, i)), o = t.readUInt16LE(i), a = s !== o;
      return new lc(r, n, a);
    } catch (r) {
      return ns("not enough data to create a rtu request", r), null;
    }
  }
  createPayload() {
    const t = this._body.createPayload();
    this._crc = Rd.crc16modbus(Buffer.concat([Buffer.from([this._address]), t]));
    const r = Buffer.alloc(2);
    r.writeUInt16LE(this._crc, 0);
    const n = Buffer.from([this._address]);
    return Buffer.concat([n, t, r]);
  }
}
rn.default = lc;
var cc = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(oc, "__esModule", { value: !0 });
const AS = _e, gn = AS("rtu-client-request-handler"), SS = cc(ac()), TS = cc(mi), DS = cc(rn), PS = Ot;
class OS extends TS.default {
  constructor(t, r, n = 5e3) {
    super(t, n), this._address = r, this._requests = [], this._currentRequest = null, this._socket.on("open", this._onConnect.bind(this)), this._socket.isOpen && this._onConnect();
  }
  register(t) {
    gn("registrating new request");
    const r = new DS.default(this._address, t);
    return super.registerRequest(r);
  }
  handle(t) {
    if (gn("new response coming in"), !t)
      return;
    const r = this._currentRequest;
    if (!r) {
      gn("something is strange, received a respone without a request");
      return;
    }
    const n = Buffer.concat([Buffer.from([t.address]), t.body.createPayload()]);
    gn("create crc from response", n);
    const i = SS.default.crc16modbus(n);
    if (t.crc !== i) {
      gn("CRC does not match", t.crc, "!==", i), r.reject(new PS.UserRequestError({
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
oc.default = OS;
var uc = {}, vi = {}, Dp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(vi, "__esModule", { value: !0 });
const $S = _e, Cd = $S("rtu-response"), LS = ac(), NS = Dp(wi), FS = Dp(bi);
class Ps extends NS.default {
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
    return new Ps(t.address, void 0, r);
  }
  static fromBuffer(t) {
    if (t.length < 1)
      return null;
    const r = t.readUInt8(0);
    Cd("address", r, "buffer", t);
    const n = FS.default.fromBuffer(t.slice(1));
    if (!n)
      return null;
    let i;
    try {
      i = t.readUInt16LE(1 + n.byteCount);
    } catch {
      return Cd("If NoSuchIndexException, it is probably serial and not all data has arrived"), null;
    }
    return new Ps(r, i, n);
  }
  createPayload() {
    const t = Buffer.alloc(this.byteCount);
    return t.writeUInt8(this._address, 0), this._body.createPayload().copy(t, 1), this._crc = LS.crc16modbus(t.slice(0, this.byteCount - 2)), t.writeUInt16LE(this._crc, this.byteCount - 2), t;
  }
}
vi.default = Ps;
var Pp = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(uc, "__esModule", { value: !0 });
const US = _e, xn = US("rtu-response-handler"), BS = Pp(yi), MS = Pp(vi);
class kS extends BS.default {
  constructor() {
    super(), this._messages = [];
  }
  handleData(t) {
    xn("receiving new data"), this._buffer = Buffer.concat([this._buffer, t]), xn("buffer", this._buffer);
    do {
      const r = MS.default.fromBuffer(this._buffer);
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
uc.default = kS;
var fc = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(sc, "__esModule", { value: !0 });
const qS = fc(oi), jS = fc(oc), HS = fc(uc);
class GS extends qS.default {
  constructor(t, r, n = 5e3) {
    super(t), this._requestHandler = new jS.default(t, r, n), this._responseHandler = new HS.default();
  }
  get slaveId() {
    return this._requestHandler.address;
  }
  get unitId() {
    return this._requestHandler.address;
  }
}
sc.default = GS;
var dc = {}, So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const WS = fl, Id = {
  coils: Buffer.alloc(1024),
  discrete: Buffer.alloc(1024),
  holding: Buffer.alloc(1024),
  input: Buffer.alloc(1024)
};
class VS extends WS.EventEmitter {
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
  constructor(t = Id) {
    super(), this._options = Object.assign({}, Id, t);
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
So.default = VS;
var To = {}, is = {}, Ad;
function zS() {
  if (Ad) return is;
  Ad = 1;
  var e = T && T.__importDefault || function(s) {
    return s && s.__esModule ? s : { default: s };
  };
  Object.defineProperty(is, "__esModule", { value: !0 });
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
  return is.default = i, is;
}
var ss = {}, Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
var Op = br;
Ge.ExceptionResponseBody = Op.default;
Ge.isExceptionResponseBody = Op.isExceptionResponseBody;
var YS = Eo;
Ge.ReadCoilsResponseBody = YS.default;
var XS = wo;
Ge.ReadDiscreteInputsResponseBody = XS.default;
var KS = bo;
Ge.ReadHoldingRegistersResponseBody = KS.default;
var JS = vo;
Ge.ReadInputRegistersResponseBody = JS.default;
var QS = Qr;
Ge.ModbusResponseBody = QS.default;
var ZS = bi;
Ge.ResponseFactory = ZS.default;
var eT = Ro;
Ge.WriteMultipleCoilsResponseBody = eT.default;
var tT = Co;
Ge.WriteMultipleRegistersResponseBody = tT.default;
var rT = Io;
Ge.WriteSingleCoilResponseBody = rT.default;
var nT = Ao;
Ge.WriteSingleRegisterResponseBody = nT.default;
var Sd;
function iT() {
  if (Sd) return ss;
  Sd = 1;
  var e = T && T.__importDefault || function(l) {
    return l && l.__esModule ? l : { default: l };
  };
  Object.defineProperty(ss, "__esModule", { value: !0 });
  const t = Ge, r = ie, n = e(nc), i = ae, { bufferToArrayStatus: s, arrayStatusToBuffer: o } = n.default, c = _e("modbus tcp response handler");
  class p {
    constructor(u, d) {
      this._server = u, this._fromRequest = d;
    }
    handle(u, d) {
      if (!u)
        return null;
      if (r.isExceptionRequestBody(u.body)) {
        const g = t.ExceptionResponseBody.fromRequest(u.body), x = this._fromRequest(u, g);
        return d(x.createPayload()), x;
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
      const _ = t.ReadCoilsResponseBody.fromRequest(u.body, this._server.coils), g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postReadCoils", u, d), g;
    }
    _handleDiscreteInput(u, d) {
      if (!r.isReadDiscreteInputsRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected ReadDiscreteInputsRequestBody but received ${u.body.name}`);
      if (!this._server.discrete) {
        c("no discrete input buffer on server, trying readDiscreteInputs handler"), this._server.emit("readDiscreteInputs", u, d);
        return;
      }
      this._server.emit("preReadDiscreteInputs", u, d);
      const _ = t.ReadDiscreteInputsResponseBody.fromRequest(u.body, this._server.discrete), g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postReadDiscreteInputs", u, d), g;
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
      const _ = t.ReadHoldingRegistersResponseBody.fromRequest(u.body, this._server.holding), g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postReadHoldingRegisters", u, d), g;
    }
    _handleReadInputRegisters(u, d) {
      if (!r.isReadInputRegistersRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected ReadInputRegistersRequestBody but received ${u.body.name}`);
      if (!this._server.input) {
        c("no input register buffer on server, trying readInputRegisters handler"), this._server.emit("readInputRegisters", u, d);
        return;
      }
      this._server.emit("preReadInputRegisters", u, d);
      const _ = t.ReadInputRegistersResponseBody.fromRequest(u.body, this._server.input), g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postReadInputRegisters", u, d), g;
    }
    _handleWriteSingleCoil(u, d) {
      if (!r.isWriteSingleCoilRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteSingleCoilRequestBody but received ${u.body.name}`);
      if (!this._server.coils) {
        c("no coils buffer on server, trying writeSingleCoil handler"), this._server.emit("writeSingleCoil", u, d);
        return;
      }
      this._server.emit("preWriteSingleCoil", u, d);
      const _ = t.WriteSingleCoilResponseBody.fromRequest(u.body), g = u.body.address;
      c("Writing value %d to address %d", u.body.value, g);
      const x = this._server.coils.readUInt8(Math.floor(g / 8));
      let y;
      if (u.body.value !== 65280 && u.body.value !== 0) {
        c("illegal data value");
        const O = new t.ExceptionResponseBody(u.body.fc, 3), B = this._fromRequest(u, O);
        return d(B.createPayload()), B;
      }
      if (u.body.value === 65280 ? y = x | Math.pow(2, g % 8) : y = x & ~Math.pow(2, g % 8), _.address / 8 > this._server.coils.length) {
        c("illegal data address");
        const O = new t.ExceptionResponseBody(u.body.fc, 2), B = this._fromRequest(u, O);
        return d(B.createPayload()), B;
      } else
        this._server.coils.writeUInt8(y, Math.floor(g / 8));
      const v = this._fromRequest(u, _), C = v.createPayload();
      return d(C), this._server.emit("postWriteSingleCoil", u, d), v;
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
        const y = new t.ExceptionResponseBody(u.body.fc, 2), v = this._fromRequest(u, y);
        return d(v.createPayload()), v;
      } else
        this._server.holding.writeUInt16BE(_.value, _.address * 2);
      const g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postWriteSingleRegister", u, d), g;
    }
    _handleWriteMultipleCoils(u, d) {
      if (!r.isWriteMultipleCoilsRequestBody(u.body))
        throw new Error(`InvalidRequestClass - Expected WriteMultipleCoilsRequestBody but received ${u.body.name}`);
      if (!this._server.coils) {
        c("no coils buffer on server, trying writeMultipleCoils handler"), this._server.emit("writeMultipleCoils", u, d);
        return;
      }
      this._server.emit("preWriteMultipleCoils", u, d);
      const _ = t.WriteMultipleCoilsResponseBody.fromRequest(u.body), g = s(this._server.coils), x = s(u.body.valuesAsBuffer), y = u.body.address, v = y + u.body.quantity, C = g.map((G, Z) => {
        let J = G;
        if (Z >= y && Z < v) {
          const M = x.shift();
          J = M !== void 0 ? M : G;
        }
        return J;
      });
      this._server.emit("writeMultipleCoils", this._server.coils, g), this._server.coils.fill(o(C)), this._server.emit("postWriteMultipleCoils", this._server.coils, C);
      const O = this._fromRequest(u, _), B = O.createPayload();
      return d(B), this._server.emit("postWriteMultipleCoils", u, d), O;
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
        const y = new t.ExceptionResponseBody(u.body.fc, 2), v = this._fromRequest(u, y);
        return d(v.createPayload()), v;
      } else
        this._server.emit("writeMultipleRegisters", this._server.holding), c("Request Body: ", u.body), this._server.holding.fill(new Uint8Array(u.body.values), u.body.address * 2, u.body.address * 2 + u.body.values.length), this._server.emit("postWriteMultipleRegisters", this._server.holding);
      const g = this._fromRequest(u, _), x = g.createPayload();
      return d(x), this._server.emit("postWriteMultipleRegisters", u, d), g;
    }
  }
  return ss.default = p, ss;
}
var $p = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(To, "__esModule", { value: !0 });
const sT = _e, Ua = sT("modbus tcp client socket"), oT = $p(zS()), aT = $p(iT());
class lT {
  constructor(t, r, n, i) {
    this._server = t, this._socket = r, this._requestHandler = new oT.default(n), this._responseHandler = new aT.default(this._server, i), this._socket.on("data", this._onData.bind(this));
  }
  get socket() {
    return this._socket;
  }
  get server() {
    return this._server;
  }
  _onData(t) {
    Ua("new data coming in"), this._requestHandler.handle(t);
    do {
      const r = this._requestHandler.shift();
      if (!r) {
        Ua("no request to process");
        break;
      }
      this._responseHandler.handle(r, (n) => {
        this._socket.write(n, () => {
          Ua("response flushed", n);
        });
      });
    } while (!0);
  }
}
To.default = lT;
var Do = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(dc, "__esModule", { value: !0 });
const cT = _e, uT = cT("modbus tcp server"), fT = Do(So), dT = Do(To), hT = Do(xi), pT = Do(Ei);
class _T extends fT.default {
  constructor(t, r) {
    super(r), this._server = t, t.on("connection", this._onConnection.bind(this));
  }
  _onConnection(t) {
    uT("new connection coming in");
    const r = hT.default.fromBuffer, n = pT.default.fromRequest, i = new dT.default(this, t, r, n);
    this.emit("connection", i);
  }
}
dc.default = _T;
var hc = {}, Po = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(hc, "__esModule", { value: !0 });
const mT = Po(To), gT = Po(So), xT = Po(rn), yT = Po(vi);
class ET extends gT.default {
  constructor(t, r) {
    super(r), this._socket = t;
    const n = xT.default.fromBuffer, i = yT.default.fromRequest, s = new mT.default(this, t, n, i);
    this.emit("connection", s);
  }
}
hc.default = ET;
var Lp = {}, pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
const wT = [
  "InvalidStartAddress",
  "InvalidQuantity",
  "InvalidArraySize",
  "InvalidBufferSize",
  "InvalidCoilsInput",
  "InvalidType_MustBeBufferOrArray",
  "InvalidValue"
];
function bT(e) {
  return typeof e != "object" ? !1 : !!wT.includes(e.message);
}
pc.isInternalException = bT;
var Np = {};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(Ot);
})(Np);
(function(e) {
  function t(i) {
    for (var s in i) e.hasOwnProperty(s) || (e[s] = i[s]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(pc), t(Np);
  var r = br;
  e.isExceptionResponseBody = r.isExceptionResponseBody;
  var n = Jr;
  e.isExceptionRequestBody = n.isExceptionRequestBody;
})(Lp);
var Fp = {}, _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
const Up = 0, Bp = 65535, vT = Bp, RT = Up, CT = 0, IT = 1, AT = 128;
_c.LIMITS = {
  COIL_MAX: IT,
  COIL_MIN: CT,
  ERROR_CODE_THRESHOLD: AT,
  REGISTER_MAX: vT,
  REGISTER_MIN: RT,
  UINT16_MAX: Bp,
  UINT16_MIN: Up
};
(function(e) {
  function t(r) {
    for (var n in r) e.hasOwnProperty(n) || (e[n] = r[n]);
  }
  Object.defineProperty(e, "__esModule", { value: !0 }), t(_c);
})(Fp);
var Ri = T && T.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
}, Oo = T && T.__importStar || function(e) {
  if (e && e.__esModule) return e;
  var t = {};
  if (e != null) for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
  return t.default = e, t;
};
Object.defineProperty(ne, "__esModule", { value: !0 });
const Mp = Ri(Kl);
ne.ModbusTCPClient = Mp.default;
const kp = Ri(sc);
ne.ModbusRTUClient = kp.default;
const qp = Ri(dc);
ne.ModbusTCPServer = qp.default;
const jp = Ri(hc);
ne.ModbusRTUServer = jp.default;
const ST = Oo(ae), TT = Oo(Lp), DT = Oo(ie), PT = Oo(Ge), OT = Ri(gi), $T = Fp;
ne.client = {
  RTU: kp.default,
  TCP: Mp.default
};
ne.server = {
  RTU: jp.default,
  TCP: qp.default
};
ne.requests = Object.assign({}, DT, { UserRequest: OT.default });
ne.responses = PT;
ne.codes = ST;
ne.errors = TT;
ne.limits = $T.LIMITS;
var LT = Zr;
ne.ModbusAbstractRequest = LT.default;
var NT = wi;
ne.ModbusAbstractResponse = NT.default;
var FT = mi;
ne.MBClientRequestHandler = FT.default;
var UT = yi;
ne.ModbusClientResponseHandler = UT.default;
var BT = oi;
ne.ModbusClient = BT.default;
var MT = xi;
ne.ModbusTCPRequest = MT.default;
var kT = Ei;
ne.ModbusTCPResponse = kT.default;
var qT = rn;
ne.ModbusRTURequest = qT.default;
var jT = vi;
ne.ModbusRTUResponse = jT.default;
var HT = Ot;
ne.UserRequestError = HT.UserRequestError;
var GT = gi;
ne.UserRequest = GT.default;
var WT = yo;
ne.UserRequestMetrics = WT.UserRequestMetrics;
const VT = 3048, zT = 2063, YT = 2051, XT = 2049, KT = 2105, JT = 2050, QT = 2048, ZT = 2120, eD = 2106, Os = 4096, tD = 4098, mc = 4116, Ba = mc - Os + 1, rD = mc - Os, al = 4598, Hp = 1e4, nD = 4600, Gp = 10, Ma = 4, $s = 4606, gc = 10, iD = 750, sD = 4608, Ls = 1e4, Wp = 4610, Ns = 10, Fs = 4622, Vp = 4624, ka = Wp - $s + 2, qa = Vp - Fs + 2;
function ll(e, t) {
  if (typeof e != "number" || !Number.isInteger(e) || e < 0 || e > 65535)
    throw new Error(`PLC returned an invalid value for holding register ${t}`);
  return e;
}
function st(e, t, r) {
  const n = ll(e, r), s = ll(t, r + 1) * 65536 + n;
  return s >= 2147483648 ? s - 4294967296 : s;
}
function _t(e, t, r, n, i = {}) {
  if (typeof e != "number" || !Number.isFinite(e))
    throw new Error(`${t} must be a number`);
  const s = e * r, o = Math.round(s), a = Number.EPSILON * Math.max(1, Math.abs(s)) * 4, c = i.min ?? -2147483648, p = i.max ?? 2147483647;
  if (Math.abs(s - o) > a || o < c || o > p)
    throw new Error(`${t} must have at most ${n} decimal places and fit the supported PLC range`);
  return o;
}
function mt(e) {
  const t = e < 0 ? e + 4294967296 : e;
  return [t % 65536, Math.floor(t / 65536)];
}
async function nn(e, t) {
  const n = (await e.readCoils(t, 1)).response.body.valuesAsArray;
  if (n.length === 0)
    throw new Error(`PLC returned no values for coil ${t}`);
  const i = n[0];
  if (i !== !0 && i !== !1 && i !== 0 && i !== 1)
    throw new Error(`PLC returned an invalid value for coil ${t}`);
  return i === !0 || i === 1;
}
async function oD(e) {
  return nn(e, VT);
}
async function zp(e) {
  return nn(e, zT);
}
async function aD(e) {
  return nn(e, YT);
}
async function lD(e) {
  const r = (await e.readHoldingRegisters(Os, Ba)).response.body.valuesAsArray;
  if (r.length !== Ba)
    throw new Error(`PLC returned ${r.length} overview registers; expected ${Ba}`);
  const n = st(r[0], r[1], Os), i = st(r[2], r[3], tD), s = await zp(e), o = await aD(e);
  return {
    load: n,
    distance: i,
    status: ll(r[rD], mc),
    emergencyHaltActive: s,
    machineHalted: o
  };
}
async function cD(e) {
  const r = (await e.readHoldingRegisters(al, Ma)).response.body.valuesAsArray;
  if (r.length !== Ma)
    throw new Error(
      `PLC returned ${r.length} test limit registers; expected ${Ma}`
    );
  return {
    testDistanceLimit: st(r[0], r[1], al) / Hp,
    testLoadLimit: st(r[2], r[3], nD) / Gp
  };
}
async function uD(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw new Error("Invalid PLC limits");
  const r = t, n = _t(
    r.testDistanceLimit,
    "Test Distance Limit",
    Hp,
    4,
    { min: 0 }
  ), i = _t(
    r.testLoadLimit,
    "Test Load Limit",
    Gp,
    1,
    { min: 0 }
  );
  await e.writeMultipleRegisters(al, [
    ...mt(n),
    ...mt(i)
  ]);
}
async function fD(e) {
  const r = (await e.readHoldingRegisters(
    $s,
    ka
  )).response.body.valuesAsArray;
  if (r.length !== ka)
    throw new Error(
      `PLC returned ${r.length} initial adjustment registers; expected ${ka}`
    );
  const i = (await e.readHoldingRegisters(
    Fs,
    qa
  )).response.body.valuesAsArray;
  if (i.length !== qa)
    throw new Error(
      `PLC returned ${i.length} final adjustment registers; expected ${qa}`
    );
  return {
    manualVelocity: st(r[0], r[1], $s) / gc,
    topDistanceLimit: st(r[2], r[3], sD) / Ls,
    bottomDistanceLimit: st(i[0], i[1], Fs) / Ls,
    topLoadLimit: st(r[4], r[5], Wp) / Ns,
    bottomLoadLimit: st(i[2], i[3], Vp) / Ns
  };
}
async function dD(e, t) {
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw new Error("Invalid PLC adjustments");
  const r = t, n = _t(
    r.manualVelocity,
    "Manual Velocity",
    gc,
    1,
    { max: iD }
  ), i = _t(
    r.topDistanceLimit,
    "Top Distance Limit",
    Ls,
    4
  ), s = _t(
    r.bottomDistanceLimit,
    "Bottom Distance Limit",
    Ls,
    4
  ), o = _t(r.topLoadLimit, "Top Load Limit", Ns, 1), a = _t(
    r.bottomLoadLimit,
    "Bottom Load Limit",
    Ns,
    1
  );
  await e.writeMultipleRegisters($s, [
    ...mt(n),
    ...mt(i),
    ...mt(o)
  ]), await e.writeMultipleRegisters(Fs, [
    ...mt(s),
    ...mt(a)
  ]);
}
async function hD(e, t) {
  await e.writeSingleCoil(JT, t);
}
async function pD(e, t) {
  await e.writeSingleCoil(QT, t);
}
async function _D(e) {
  console.log("Triggering Reset Load"), await e.writeSingleCoil(ZT, !0);
}
async function mD(e) {
  await e.writeSingleCoil(eD, !0);
}
async function gD(e) {
  await e.writeSingleCoil(XT, !0);
}
async function xD(e) {
  await e.writeSingleCoil(KT, !0);
}
const yD = 2098, ED = 2059, wD = 4596, bD = 4184, Td = [4120, 4122, 4124, 4128, 4130], ja = [4150, 4152, 4154, 4156, 4158], vD = 2108, RD = 2137, CD = 2109, Yp = 2110, Dd = 4096, ID = 4098, Ha = 4, us = 10, Xp = 1e4, AD = 3e4, SD = 3e4, Kp = 100, TD = Kp * 3;
async function DD(e, t) {
  if (t.type !== "Tensile" && t.type !== "Compression")
    throw new Error("Invalid PLC test type");
  if (t.method !== "Distance" && t.method !== "Load")
    throw new Error("Invalid PLC test method");
  if (!Array.isArray(t.targets) || t.targets.length < 1 || t.targets.length > 5)
    throw new Error("PLC tests require between one and five targets");
  const r = mt(
    _t(t.velocity, "Preset Velocity", gc, 1, { min: 1 })
  ), n = t.method === "Distance", i = n ? Xp : us, s = n ? 4 : 1, o = t.targets.map(
    (c, p) => mt(_t(c, `Target ${p + 1}`, i, s))
  );
  let a;
  if (!n) {
    const c = t.preload ?? 0;
    if (t.type === "Compression" && c > 0 || t.type === "Tensile" && c < 0)
      throw new Error("Preload sign must match the test type");
    a = mt(_t(c, "Preload", us, 1));
  }
  if (await e.writeSingleCoil(yD, t.type === "Compression"), await e.writeSingleCoil(ED, !n), await e.writeMultipleRegisters(wD, r), n)
    await e.writeMultipleRegisters(Td[0], o.slice(0, 3).flat()), o.length > 3 && await e.writeMultipleRegisters(Td[3], o.slice(3).flat());
  else {
    if (!a) throw new Error("Failed to encode PLC test preload");
    await e.writeMultipleRegisters(bD, a);
    const c = o.flat();
    console.log("Writing PLC load targets", {
      address: ja[0],
      targets: t.targets.map((p, l) => ({
        target: l + 1,
        address: ja[l],
        value: p,
        scaledValue: p * us,
        registers: o[l]
      })),
      registers: c
    }), await e.writeMultipleRegisters(ja[0], c);
  }
}
async function PD(e) {
  await e.writeSingleCoil(vD, !0);
}
async function OD(e) {
  await e.writeSingleCoil(Yp, !0);
}
async function Jp(e) {
  return nn(e, RD);
}
async function $D(e) {
  return nn(e, CD);
}
async function LD(e) {
  return nn(e, Yp);
}
async function ND(e) {
  const r = (await e.readHoldingRegisters(Dd, Ha)).response.body.valuesAsArray;
  if (r.length !== Ha)
    throw new Error(`PLC returned ${r.length} test sample registers; expected ${Ha}`);
  return {
    load: Math.abs(st(r[0], r[1], Dd) / us),
    displacement: Math.abs(
      st(r[2], r[3], ID) / Xp
    )
  };
}
async function FD(e) {
  const t = await zp(e);
  if (t)
    return {
      running: !1,
      dataCollectionStarted: !1,
      emergencyHaltActive: t
    };
  const r = await Jp(e), n = await $D(e);
  return {
    running: r,
    dataCollectionStarted: n,
    emergencyHaltActive: t
  };
}
class UD {
  constructor(t) {
    Bc(this, "activeRun", null);
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
      startedAt: null,
      monitoringStartedAt: 0,
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
      if (await Jp(t))
        throw new Error("The PLC is already running a test");
      if (await DD(t, r.preset), this.activeRun !== n) return;
      if (n.stopRequested) {
        this.finishRun(n, "stopped");
        return;
      }
      if (n.startCommandPromise = PD(t), await n.startCommandPromise, n.startCommandSent = !0, n.monitoringStartedAt = Date.now(), this.activeRun !== n) return;
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
    return t.stopCommandPromise || (t.stopCommandPromise = OD(t.client).then(() => {
      t.stopCommandWrittenAt = Date.now();
    })), t.stopCommandPromise;
  }
  schedulePoll(t) {
    this.activeRun === t && (t.pollTimer = setTimeout(() => {
      t.pollTimer = null, this.poll(t);
    }, Kp));
  }
  async poll(t) {
    if (this.activeRun === t)
      try {
        const r = await FD(t.client);
        if (this.activeRun !== t) return;
        if (r.emergencyHaltActive) {
          this.finishRunWhenIdle(t, "stopped");
          return;
        }
        r.dataCollectionStarted && t.startedAt === null && (t.startedAt = Date.now());
        const n = t.stopRequested ? await LD(t.client) : !1;
        if (n && (t.stopSignalWasObserved = !0), t.stopRequested && t.stopCommandWrittenAt !== null && Date.now() - t.stopCommandWrittenAt >= SD) {
          const i = "The PLC did not acknowledge the test stop request";
          this.finishRun(t, "failed", t.failureMessage ? `${t.failureMessage}; ${i}` : i);
          return;
        }
        if (r.running) {
          if (t.sawRunning = !0, !t.stopRequested && t.state !== "running" && (t.state = "running", this.publishUpdate({ testId: t.testId, state: t.state })), t.startedAt !== null) {
            const i = await ND(t.client);
            this.publishUpdate({
              testId: t.testId,
              state: t.state,
              sample: {
                elapsedMs: Date.now() - t.startedAt,
                load: i.load,
                displacement: i.displacement
              }
            });
          }
        } else if (t.sawRunning) {
          this.finishRunWhenIdle(t, t.stopRequested ? "stopped" : "completed");
          return;
        } else if (t.stopRequested) {
          if (t.stopSignalWasObserved && !n || t.stopCommandWrittenAt !== null && !n && Date.now() - t.stopCommandWrittenAt >= TD) {
            this.finishRunWhenIdle(t, "stopped");
            return;
          }
        } else if (Date.now() - t.monitoringStartedAt >= AD)
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
const bn = 502, Pd = 5e3, BD = 6e4, MD = 1e3;
let xt = null, Ne = null, H = null, Jt = null, Sn = null, fe = { state: "disconnected", ipAddress: null }, Od = !1;
const mr = /* @__PURE__ */ new Map(), Pt = new UD((e) => {
  xt && !xt.isDestroyed() && xt.webContents.send("plc:test-run-update", e);
});
function Vt(e) {
  const t = fe.state === e.state && fe.ipAddress === e.ipAddress && fe.plcWorking === e.plcWorking && fe.clearSelection === e.clearSelection && fe.error === e.error;
  fe = e, !t && xt && !xt.isDestroyed() && xt.webContents.send("plc:status", e);
}
function Qp(e) {
  if (e instanceof Error) return e.message;
  if (typeof e != "object" || e === null) return String(e);
  const t = e, r = t.response, n = typeof r == "object" && r !== null ? r.body : null, i = typeof n == "object" && n !== null ? n.message : null, s = [
    typeof t.err == "string" ? t.err : null,
    typeof t.message == "string" ? t.message : null,
    typeof i == "string" ? i : null
  ].filter((o) => !!o);
  return s.length > 0 ? s.join(": ") : "Unknown PLC error";
}
function Zp(e) {
  return e instanceof Error ? e : new Error(Qp(e));
}
function Ee(e) {
  if (!xt || xt.isDestroyed() || e !== xt.webContents)
    throw new Error("Unauthorized PLC request");
}
function e_(e) {
  if (typeof e != "string" || !Bd.isIPv4(e.trim()))
    throw new Error("Enter a valid IPv4 address");
  return e.trim().split(".").map((t) => String(Number(t))).join(".");
}
function Qt(e, t) {
  const r = mr.get(e);
  r && (clearTimeout(r.timeout), mr.delete(e), t && (r.socket.removeAllListeners(), r.socket.destroy()));
}
function t_(e) {
  for (const [t, r] of mr)
    if (r.socket === e) {
      Qt(t, !1);
      return;
    }
}
function Ci() {
  Sn && (clearTimeout(Sn), Sn = null);
}
function r_(e, t) {
  if (Ne !== e) return;
  const r = Jt;
  Pt.connectionLost(t ?? new Error("PLC connection closed during a test")), Ci(), Ne = null, H = null, Jt = null, e.removeAllListeners(), e.destroy(), Vt({
    state: "offline",
    ipAddress: r,
    plcWorking: null,
    clearSelection: !0,
    ...t ? { error: t.message } : {}
  });
}
function kD(e, t) {
  t_(e), r_(e, t);
}
function qD(e) {
  if (t_(e), Ne === e) {
    const t = Jt;
    Pt.connectionLost(new Error("PLC connection closed unexpectedly during a test")), Ci(), Ne = null, H = null, Jt = null, Vt({
      state: "offline",
      ipAddress: t,
      plcWorking: null,
      clearSelection: !0,
      error: "PLC connection closed unexpectedly"
    });
  }
}
function jD(e) {
  return new Promise((t, r) => {
    const n = new Bd.Socket(), i = new ne.client.TCP(n, 1, Pd);
    let s = !1, o = !1;
    const a = setTimeout(() => {
      o || (o = !0, n.destroy(), r(new Error(`Connection to ${e}:${bn} timed out`)));
    }, Pd);
    n.on("connect", () => {
      s = !0, o = !0, clearTimeout(a), t({ socket: n, client: i });
    }), n.on("error", (c) => {
      if (!s) {
        if (o) return;
        o = !0, clearTimeout(a), r(new Error(`Could not connect to ${e}:${bn}: ${c.message}`));
        return;
      }
      kD(n, c);
    }), n.on("close", () => {
      if (!s) {
        if (o) return;
        o = !0, clearTimeout(a), r(new Error(`Connection to ${e}:${bn} closed before it was established`));
        return;
      }
      qD(n);
    });
    try {
      n.connect({ host: e, port: bn });
    } catch (c) {
      o = !0, clearTimeout(a), n.removeAllListeners(), n.destroy(), r(Zp(c));
    }
  });
}
async function n_(e) {
  if (Pt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  const t = e_(e), { socket: r, client: n } = await jD(t), i = Ud(), s = setTimeout(() => Qt(i, !0), BD);
  return mr.set(i, { ipAddress: t, socket: r, client: n, timeout: s }), { token: i, ipAddress: t };
}
function HD(e, t, r) {
  const n = async () => {
    if (!(Ne !== e || H !== t)) {
      try {
        const i = await oD(t);
        if (Ne !== e || H !== t) return;
        Vt({
          state: "online",
          ipAddress: r,
          plcWorking: i
        });
      } catch (i) {
        r_(e, Zp(i));
        return;
      }
      Ne === e && H === t && (Sn = setTimeout(() => {
        Sn = null, n();
      }, MD));
    }
  };
  n();
}
function i_(e) {
  if (Pt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  if (typeof e != "string") throw new Error("Invalid prepared PLC connection");
  const t = mr.get(e);
  if (!t) throw new Error("Prepared PLC connection expired or is no longer available");
  if (t.socket.destroyed || !t.socket.writable)
    throw Qt(e, !0), new Error(`Connection to ${t.ipAddress}:${bn} is no longer available`);
  Qt(e, !1), Ci();
  const r = Ne;
  Ne = t.socket, H = t.client, Jt = t.ipAddress;
  const n = { state: "connecting", ipAddress: t.ipAddress, plcWorking: null };
  return Vt(n), r && r !== Ne && (r.removeAllListeners(), r.destroy()), HD(t.socket, t.client, t.ipAddress), n;
}
function GD() {
  if (Pt.hasActiveRun) throw new Error("Stop the active test before disconnecting");
  Ci();
  const e = Ne;
  Ne = null, H = null, Jt = null;
  for (const r of mr.keys())
    Qt(r, !0);
  e && (e.removeAllListeners(), e.destroy());
  const t = { state: "disconnected", ipAddress: null, plcWorking: null };
  return Vt(t), t;
}
async function WD(e) {
  if (Pt.hasActiveRun) throw new Error("Stop the active test before changing PLC connections");
  const t = e_(e), r = Ne, n = Jt;
  Vt({ state: "connecting", ipAddress: t });
  let i = null;
  try {
    return i = (await n_(t)).token, i_(i);
  } catch (s) {
    return i && Qt(i, !0), r && Ne === r && !r.destroyed && r.writable && n ? Vt({
      state: "online",
      ipAddress: n,
      plcWorking: fe.ipAddress === n ? fe.plcWorking : null
    }) : Vt({
      state: "offline",
      ipAddress: t,
      plcWorking: null,
      error: Qp(s)
    }), fe;
  }
}
function VD(e) {
  if (typeof e != "object" || e === null) throw new Error("Invalid PLC test request");
  const t = e;
  if (typeof t.testId != "string" || t.testId.trim().length === 0)
    throw new Error("Invalid test ID");
  if (typeof t.preset != "object" || t.preset === null)
    throw new Error("Invalid preset for PLC test");
  const r = t.preset;
  if (r.type !== "Tensile" && r.type !== "Compression")
    throw new Error("Invalid PLC test type");
  if (r.method !== "Load" && r.method !== "Distance")
    throw new Error("Invalid PLC test method");
  if (typeof r.velocity != "number" || !Number.isFinite(r.velocity))
    throw new Error("Invalid PLC test velocity");
  if (!Array.isArray(r.targets) || r.targets.length < 1 || r.targets.length > 5)
    throw new Error("Invalid PLC test targets");
  const n = r.targets.map((s) => {
    if (typeof s != "number" || !Number.isFinite(s)) throw new Error("Invalid PLC test targets");
    return s;
  });
  let i;
  if (r.method === "Load") {
    if (r.preload !== void 0 && (typeof r.preload != "number" || !Number.isFinite(r.preload)))
      throw new Error("Invalid PLC test preload");
    if (i = typeof r.preload == "number" ? r.preload : 0, r.type === "Compression" && i > 0 || r.type === "Tensile" && i < 0)
      throw new Error("PLC test preload sign does not match the test type");
  }
  return {
    testId: t.testId,
    preset: {
      type: r.type,
      method: r.method,
      velocity: r.velocity,
      ...i !== void 0 ? { preload: i } : {},
      targets: n
    }
  };
}
function zD(e) {
  xt = e, !Od && (X.handle("plc:prepare-connection", async (t, r) => (Ee(t.sender), n_(r))), X.handle("plc:activate-connection", (t, r) => (Ee(t.sender), i_(r))), X.handle("plc:cancel-connection", (t, r) => {
    if (Ee(t.sender), typeof r != "string") throw new Error("Invalid prepared PLC connection");
    Qt(r, !0);
  }), X.handle("plc:connect", async (t, r) => (Ee(t.sender), WD(r))), X.handle("plc:disconnect", (t) => (Ee(t.sender), GD())), X.handle("plc:start-test-run", async (t, r) => {
    Ee(t.sender);
    const n = VD(r);
    if (!H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot start a test while the PLC is offline");
    await Pt.start(H, n);
  }), X.handle("plc:stop-test-run", async (t, r) => {
    if (Ee(t.sender), typeof r != "string") throw new Error("Invalid test ID");
    await Pt.stop(r);
  }), X.handle("plc:get-status", (t) => (Ee(t.sender), fe)), X.handle("plc:read-overview-values", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot read overview values while the PLC is offline");
    return lD(H);
  }), X.handle("plc:read-limits", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot read limits while the PLC is offline");
    return cD(H);
  }), X.handle("plc:write-limits", async (t, r) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot write limits while the PLC is offline");
    return uD(H, r);
  }), X.handle("plc:read-adjustments", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot read adjustments while the PLC is offline");
    return fD(H);
  }), X.handle("plc:write-adjustments", async (t, r) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot write adjustments while the PLC is offline");
    return dD(H, r);
  }), X.handle("plc:set-move-up", async (t, r) => {
    if (Ee(t.sender), typeof r != "boolean") throw new Error("Invalid Move Up command value");
    if (!H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot control Move Up while the PLC is offline");
    return hD(H, r);
  }), X.handle("plc:set-move-down", async (t, r) => {
    if (Ee(t.sender), typeof r != "boolean") throw new Error("Invalid Move Down command value");
    if (!H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot control Move Down while the PLC is offline");
    return pD(H, r);
  }), X.handle("plc:halt-machine", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot halt machine while the PLC is offline");
    return gD(H);
  }), X.handle("plc:resume-machine", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot resume machine while the PLC is offline");
    return xD(H);
  }), X.handle("plc:reset-load", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot reset load while the PLC is offline");
    return _D(H);
  }), X.handle("plc:reset-stroke", async (t) => {
    if (Ee(t.sender), !H || H.connectionState !== "online" || fe.state !== "online")
      throw new Error("Cannot reset stroke while the PLC is offline");
    return mD(H);
  }), Od = !0);
}
async function YD() {
  Ci(), await Pt.shutdown();
  for (const t of mr.keys())
    Qt(t, !0);
  const e = Ne;
  Ne = null, H = null, Jt = null, e && (e.removeAllListeners(), e.destroy()), fe = { state: "disconnected", ipAddress: null, plcWorking: null };
}
const xc = Be.dirname(cm(import.meta.url));
process.env.APP_ROOT = Be.join(xc, "..");
const Vn = process.env.VITE_DEV_SERVER_URL, yP = Be.join(process.env.APP_ROOT, "dist-electron"), yc = Be.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Vn ? Be.join(process.env.APP_ROOT, "public") : yc;
let j, vn = {
  title: "Update Ready to Install",
  messageTemplate: "Version __VERSION__ has been downloaded. Restart the app now to install it?",
  restartButton: "Restart Now",
  laterButton: "Later"
};
const cl = /* @__PURE__ */ new Set();
XC(() => j, (e) => cl.has(e.id));
GC(() => j);
const Mr = /* @__PURE__ */ new Map();
async function XD(e, t, r) {
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
function KD() {
  !yt.isPackaged || process.platform !== "win32" || (dt.autoUpdater.autoDownload = !0, dt.autoUpdater.autoInstallOnAppQuit = !1, dt.autoUpdater.on("checking-for-update", () => console.info("Checking for application updates")), dt.autoUpdater.on("update-available", (e) => console.info(`Application update ${e.version} is available`)), dt.autoUpdater.on("update-not-available", () => console.info("Application is up to date")), dt.autoUpdater.on("error", (e) => console.error("Application update failed:", e)), dt.autoUpdater.on("update-downloaded", (e) => {
    const t = {
      type: "info",
      title: vn.title,
      message: vn.messageTemplate.replace("__VERSION__", () => e.version),
      buttons: [vn.restartButton, vn.laterButton],
      defaultId: 0,
      cancelId: 1,
      noLink: !0
    };
    (j && !j.isDestroyed() ? Tn.showMessageBox(j, t) : Tn.showMessageBox(t)).then(({ response: n }) => {
      n === 0 && dt.autoUpdater.quitAndInstall();
    }).catch((n) => console.error("Could not show update installation prompt:", n));
  }), dt.autoUpdater.checkForUpdates().catch((e) => console.error("Could not check for application updates:", e)));
}
X.handle("pdf:ready", (e, t) => {
  const r = Mr.get(e.sender.id);
  if (!r) throw new Error("Unexpected PDF ready signal");
  return clearTimeout(r.timeout), Mr.delete(e.sender.id), typeof t == "string" && t ? r.reject(new Error(t)) : r.resolve(), !0;
});
X.handle("pdf:show-in-folder", (e, t) => {
  if (!j || j.isDestroyed() || e.sender !== j.webContents)
    throw new Error("Unauthorized PDF request");
  if (typeof t != "string" || !t.trim()) throw new Error("Invalid PDF path");
  $d.showItemInFolder(t);
});
X.handle("window:minimize", () => {
  j == null || j.minimize();
});
X.handle("window:maximize", () => {
  if (j) {
    if (j.isMaximized()) {
      j.restore();
      return;
    }
    j.maximize();
  }
});
X.handle("window:close", () => {
  j == null || j.close();
});
X.handle("window:is-maximized", () => !!j && j.isMaximized());
X.handle("app:set-updater-messages", (e, t) => {
  if (!j || j.isDestroyed() || e.sender !== j.webContents)
    throw new Error("Unauthorized locale update");
  if (!t || typeof t != "object") throw new Error("Invalid updater dialog messages");
  const r = t;
  if (r.locale !== "en" && r.locale !== "tr" || typeof r.title != "string" || typeof r.messageTemplate != "string" || typeof r.restartButton != "string" || typeof r.laterButton != "string")
    throw new Error("Invalid updater dialog messages");
  vn = r;
});
X.handle("pdf:save-record", async (e, t) => {
  if (!j || j.isDestroyed() || e.sender !== j.webContents)
    throw new Error("Unauthorized PDF request");
  if (!t || typeof t != "object") throw new Error("Invalid PDF request");
  const r = t, n = r.dialogLabels;
  if (!n || typeof n.title != "string" || typeof n.filterName != "string")
    throw new Error("Invalid PDF dialog labels");
  const i = /* @__PURE__ */ new Set(["test", "specimen", "preset", "data-field"]);
  let s, o;
  if (r.type === "test-comparison") {
    const g = t, x = g.testIds;
    if (typeof g.name != "string" || !Array.isArray(x) || x.length < 2 || !x.every((v) => typeof v == "string" && v.trim().length > 0))
      throw new Error("Invalid PDF comparison request");
    s = g.name;
    const y = new URLSearchParams();
    x.forEach((v) => y.append("testId", v)), o = `/print/test-comparison?${y.toString()}`;
  } else {
    const g = t;
    if (!g.type || !i.has(g.type) || typeof g.id != "string" || !g.id || typeof g.name != "string")
      throw new Error("Invalid PDF request");
    s = g.name, o = `/print/${g.type}/${encodeURIComponent(g.id)}`;
  }
  const a = Array.from(s.replace(/[<>:"/\\|?*]/g, "_"), (g) => g.charCodeAt(0) < 32 ? "_" : g).join("").trim().replace(/[. ]+$/, "") || "Test", c = j, { canceled: p, filePath: l } = await Tn.showSaveDialog(j, {
    title: n.title,
    defaultPath: Be.join(yt.getPath("documents"), `${a}.pdf`),
    filters: [{ name: n.filterName, extensions: ["pdf"] }]
  });
  if (p || !l) return { canceled: !0 };
  if (c.isDestroyed()) throw new Error("The main window was closed before PDF export completed");
  e.sender.send("pdf:creating");
  const u = new ul({
    parent: c,
    width: 750,
    minWidth: 750,
    maxWidth: 750,
    height: 900,
    show: !1,
    autoHideMenuBar: !0,
    webPreferences: {
      preload: Be.join(xc, "preload.mjs"),
      devTools: !yt.isPackaged,
      backgroundThrottling: !1
    }
  }), d = u.webContents.id;
  cl.add(d);
  const _ = new Promise((g, x) => {
    const y = setTimeout(() => {
      Mr.delete(d), x(new Error("Timed out waiting for the PDF report to render"));
    }, 6e4);
    Mr.set(d, { resolve: g, reject: x, timeout: y });
  });
  try {
    const g = Vn ? u.loadURL(`${Vn.replace(/\/$/, "")}/#${o}`) : u.loadFile(Be.join(yc, "index.html"), { hash: o });
    await Promise.all([g, _]);
    const x = await XD(
      u.webContents.printToPDF({
        pageSize: "A4",
        printBackground: !0,
        displayHeaderFooter: !1
      }),
      6e4,
      "Timed out while generating the PDF"
    );
    return await hl(l, x), { canceled: !1, filePath: l };
  } finally {
    cl.delete(d);
    const g = Mr.get(d);
    g && (clearTimeout(g.timeout), Mr.delete(d)), u.isDestroyed() || u.close();
  }
});
function s_() {
  j && !j.isDestroyed() || (j = new ul({
    icon: Be.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: Be.join(xc, "preload.mjs"),
      devTools: !yt.isPackaged
    },
    minWidth: 960,
    minHeight: 600,
    autoHideMenuBar: !0,
    show: !1,
    frame: !1,
    titleBarStyle: "hidden"
  }), zD(j), j.webContents.setWindowOpenHandler(({ url: e }) => e.startsWith("http:") || e.startsWith("https:") ? ($d.openExternal(e), { action: "deny" }) : { action: "allow" }), j.on("maximize", () => {
    j == null || j.webContents.send("window:maximized-state-changed", !0);
  }), j.on("unmaximize", () => {
    j == null || j.webContents.send("window:maximized-state-changed", !1);
  }), j.maximize(), j.show(), Vn ? j.loadURL(Vn) : j.loadFile(Be.join(yc, "index.html")));
}
yt.on("window-all-closed", () => {
  YD().finally(() => {
    process.platform !== "darwin" && yt.quit(), j = null;
  });
});
yt.on("activate", () => {
  ul.getAllWindows().length === 0 && s_();
});
yt.whenReady().then(() => {
  om.defaultSession.setPermissionRequestHandler((e, t, r) => {
    r(!1);
  }), s_(), KD();
});
export {
  yP as MAIN_DIST,
  yc as RENDERER_DIST,
  Vn as VITE_DEV_SERVER_URL
};
