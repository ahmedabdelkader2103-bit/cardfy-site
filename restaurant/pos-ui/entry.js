function G1(u, i) {
  for (var c = 0; c < i.length; c++) {
    const r = i[c];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const d in r)
        if (d !== "default" && !(d in u)) {
          const m = Object.getOwnPropertyDescriptor(r, d);
          m && Object.defineProperty(u, d, m.get ? m : {
            enumerable: !0,
            get: () => r[d]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(u, Symbol.toStringTag, { value: "Module" }));
}
function Cp(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var Lc = { exports: {} }, pu = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var tp;
function F1() {
  if (tp) return pu;
  tp = 1;
  var u = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function c(r, d, m) {
    var p = null;
    if (m !== void 0 && (p = "" + m), d.key !== void 0 && (p = "" + d.key), "key" in d) {
      m = {};
      for (var v in d)
        v !== "key" && (m[v] = d[v]);
    } else m = d;
    return d = m.ref, {
      $$typeof: u,
      type: r,
      key: p,
      ref: d !== void 0 ? d : null,
      props: m
    };
  }
  return pu.Fragment = i, pu.jsx = c, pu.jsxs = c, pu;
}
var Ap;
function Z1() {
  return Ap || (Ap = 1, Lc.exports = F1()), Lc.exports;
}
var h = Z1(), Xc = { exports: {} }, gu = {}, Ic = { exports: {} }, Pc = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ep;
function Q1() {
  return ep || (ep = 1, (function(u) {
    function i(q, _) {
      var ut = q.length;
      q.push(_);
      t: for (; 0 < ut; ) {
        var ft = ut - 1 >>> 1, Z = q[ft];
        if (0 < d(Z, _))
          q[ft] = _, q[ut] = Z, ut = ft;
        else break t;
      }
    }
    function c(q) {
      return q.length === 0 ? null : q[0];
    }
    function r(q) {
      if (q.length === 0) return null;
      var _ = q[0], ut = q.pop();
      if (ut !== _) {
        q[0] = ut;
        t: for (var ft = 0, Z = q.length, Ft = Z >>> 1; ft < Ft; ) {
          var Jt = 2 * (ft + 1) - 1, iA = q[Jt], y = Jt + 1, E = q[y];
          if (0 > d(iA, ut))
            y < Z && 0 > d(E, iA) ? (q[ft] = E, q[y] = ut, ft = y) : (q[ft] = iA, q[Jt] = ut, ft = Jt);
          else if (y < Z && 0 > d(E, ut))
            q[ft] = E, q[y] = ut, ft = y;
          else break t;
        }
      }
      return _;
    }
    function d(q, _) {
      var ut = q.sortIndex - _.sortIndex;
      return ut !== 0 ? ut : q.id - _.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      u.unstable_now = function() {
        return m.now();
      };
    } else {
      var p = Date, v = p.now();
      u.unstable_now = function() {
        return p.now() - v;
      };
    }
    var S = [], U = [], R = 1, s = null, M = 3, Q = !1, H = !1, B = !1, C = !1, Y = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, nt = typeof setImmediate < "u" ? setImmediate : null;
    function tt(q) {
      for (var _ = c(U); _ !== null; ) {
        if (_.callback === null) r(U);
        else if (_.startTime <= q)
          r(U), _.sortIndex = _.expirationTime, i(S, _);
        else break;
        _ = c(U);
      }
    }
    function it(q) {
      if (B = !1, tt(q), !H)
        if (c(S) !== null)
          H = !0, ct || (ct = !0, rt());
        else {
          var _ = c(U);
          _ !== null && Ut(it, _.startTime - q);
        }
    }
    var ct = !1, P = -1, k = 5, mt = -1;
    function Gt() {
      return C ? !0 : !(u.unstable_now() - mt < k);
    }
    function jt() {
      if (C = !1, ct) {
        var q = u.unstable_now();
        mt = q;
        var _ = !0;
        try {
          t: {
            H = !1, B && (B = !1, X(P), P = -1), Q = !0;
            var ut = M;
            try {
              A: {
                for (tt(q), s = c(S); s !== null && !(s.expirationTime > q && Gt()); ) {
                  var ft = s.callback;
                  if (typeof ft == "function") {
                    s.callback = null, M = s.priorityLevel;
                    var Z = ft(
                      s.expirationTime <= q
                    );
                    if (q = u.unstable_now(), typeof Z == "function") {
                      s.callback = Z, tt(q), _ = !0;
                      break A;
                    }
                    s === c(S) && r(S), tt(q);
                  } else r(S);
                  s = c(S);
                }
                if (s !== null) _ = !0;
                else {
                  var Ft = c(U);
                  Ft !== null && Ut(
                    it,
                    Ft.startTime - q
                  ), _ = !1;
                }
              }
              break t;
            } finally {
              s = null, M = ut, Q = !1;
            }
            _ = void 0;
          }
        } finally {
          _ ? rt() : ct = !1;
        }
      }
    }
    var rt;
    if (typeof nt == "function")
      rt = function() {
        nt(jt);
      };
    else if (typeof MessageChannel < "u") {
      var Lt = new MessageChannel(), Et = Lt.port2;
      Lt.port1.onmessage = jt, rt = function() {
        Et.postMessage(null);
      };
    } else
      rt = function() {
        Y(jt, 0);
      };
    function Ut(q, _) {
      P = Y(function() {
        q(u.unstable_now());
      }, _);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(q) {
      q.callback = null;
    }, u.unstable_forceFrameRate = function(q) {
      0 > q || 125 < q ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : k = 0 < q ? Math.floor(1e3 / q) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return M;
    }, u.unstable_next = function(q) {
      switch (M) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = M;
      }
      var ut = M;
      M = _;
      try {
        return q();
      } finally {
        M = ut;
      }
    }, u.unstable_requestPaint = function() {
      C = !0;
    }, u.unstable_runWithPriority = function(q, _) {
      switch (q) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          q = 3;
      }
      var ut = M;
      M = q;
      try {
        return _();
      } finally {
        M = ut;
      }
    }, u.unstable_scheduleCallback = function(q, _, ut) {
      var ft = u.unstable_now();
      switch (typeof ut == "object" && ut !== null ? (ut = ut.delay, ut = typeof ut == "number" && 0 < ut ? ft + ut : ft) : ut = ft, q) {
        case 1:
          var Z = -1;
          break;
        case 2:
          Z = 250;
          break;
        case 5:
          Z = 1073741823;
          break;
        case 4:
          Z = 1e4;
          break;
        default:
          Z = 5e3;
      }
      return Z = ut + Z, q = {
        id: R++,
        callback: _,
        priorityLevel: q,
        startTime: ut,
        expirationTime: Z,
        sortIndex: -1
      }, ut > ft ? (q.sortIndex = ut, i(U, q), c(S) === null && q === c(U) && (B ? (X(P), P = -1) : B = !0, Ut(it, ut - ft))) : (q.sortIndex = Z, i(S, q), H || Q || (H = !0, ct || (ct = !0, rt()))), q;
    }, u.unstable_shouldYield = Gt, u.unstable_wrapCallback = function(q) {
      var _ = M;
      return function() {
        var ut = M;
        M = _;
        try {
          return q.apply(this, arguments);
        } finally {
          M = ut;
        }
      };
    };
  })(Pc)), Pc;
}
var ap;
function J1() {
  return ap || (ap = 1, Ic.exports = Q1()), Ic.exports;
}
var _c = { exports: {} }, gt = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var np;
function W1() {
  if (np) return gt;
  np = 1;
  var u = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), p = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), U = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), s = Symbol.for("react.activity"), M = Symbol.for("react.view_transition"), Q = Symbol.iterator;
  function H(y) {
    return y === null || typeof y != "object" ? null : (y = Q && y[Q] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var B = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, C = Object.assign, Y = {};
  function X(y, E, F) {
    this.props = y, this.context = E, this.refs = Y, this.updater = F || B;
  }
  X.prototype.isReactComponent = {}, X.prototype.setState = function(y, E) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, E, "setState");
  }, X.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function nt() {
  }
  nt.prototype = X.prototype;
  function tt(y, E, F) {
    this.props = y, this.context = E, this.refs = Y, this.updater = F || B;
  }
  var it = tt.prototype = new nt();
  it.constructor = tt, C(it, X.prototype), it.isPureReactComponent = !0;
  var ct = Array.isArray;
  function P() {
  }
  var k = { H: null, A: null, T: null, S: null }, mt = Object.prototype.hasOwnProperty;
  function Gt(y, E, F) {
    var I = F.ref;
    return {
      $$typeof: u,
      type: y,
      key: E,
      ref: I !== void 0 ? I : null,
      props: F
    };
  }
  function jt(y, E) {
    return Gt(y.type, E, y.props);
  }
  function rt(y) {
    return typeof y == "object" && y !== null && y.$$typeof === u;
  }
  function Lt(y) {
    var E = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(F) {
      return E[F];
    });
  }
  var Et = /\/+/g;
  function Ut(y, E) {
    return typeof y == "object" && y !== null && y.key != null ? Lt("" + y.key) : E.toString(36);
  }
  function q(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then(P, P) : (y.status = "pending", y.then(
          function(E) {
            y.status === "pending" && (y.status = "fulfilled", y.value = E);
          },
          function(E) {
            y.status === "pending" && (y.status = "rejected", y.reason = E);
          }
        )), y.status) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function _(y, E, F, I, dt) {
    var w = typeof y;
    (w === "undefined" || w === "boolean") && (y = null);
    var $ = !1;
    if (y === null) $ = !0;
    else
      switch (w) {
        case "bigint":
        case "string":
        case "number":
          $ = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case u:
            case i:
              $ = !0;
              break;
            case R:
              return $ = y._init, _(
                $(y._payload),
                E,
                F,
                I,
                dt
              );
          }
      }
    if ($)
      return dt = dt(y), $ = I === "" ? "." + Ut(y, 0) : I, ct(dt) ? (F = "", $ != null && (F = $.replace(Et, "$&/") + "/"), _(dt, E, F, "", function(Mt) {
        return Mt;
      })) : dt != null && (rt(dt) && (dt = jt(
        dt,
        F + (dt.key == null || y && y.key === dt.key ? "" : ("" + dt.key).replace(
          Et,
          "$&/"
        ) + "/") + $
      )), E.push(dt)), 1;
    $ = 0;
    var G = I === "" ? "." : I + ":";
    if (ct(y))
      for (var W = 0; W < y.length; W++)
        I = y[W], w = G + Ut(I, W), $ += _(
          I,
          E,
          F,
          w,
          dt
        );
    else if (W = H(y), typeof W == "function")
      for (y = W.call(y), W = 0; !(I = y.next()).done; )
        I = I.value, w = G + Ut(I, W++), $ += _(
          I,
          E,
          F,
          w,
          dt
        );
    else if (w === "object") {
      if (typeof y.then == "function")
        return _(
          q(y),
          E,
          F,
          I,
          dt
        );
      throw E = String(y), Error(
        "Objects are not valid as a React child (found: " + (E === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : E) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return $;
  }
  function ut(y, E, F) {
    if (y == null) return y;
    var I = [], dt = 0;
    return _(y, I, "", "", function(w) {
      return E.call(F, w, dt++);
    }), I;
  }
  function ft(y) {
    if (y._status === -1) {
      var E = y._result, F = E();
      F.then(
        function(I) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = I, F.status === void 0 && (F.status = "fulfilled", F.value = I));
        },
        function(I) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = I, F.status === void 0 && (F.status = "rejected", F.reason = I));
        }
      ), y._status === -1 && (y._status = 0, y._result = F);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var Z = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var E = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(E)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  };
  function Ft(y) {
    var E = k.T, F = {};
    F.types = E !== null ? E.types : null, k.T = F;
    try {
      var I = y(), dt = k.S;
      dt !== null && dt(F, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(P, Z);
    } catch (w) {
      Z(w);
    } finally {
      E !== null && F.types !== null && (E.types = F.types), k.T = E;
    }
  }
  function Jt(y) {
    var E = k.T;
    if (E !== null) {
      var F = E.types;
      F === null ? E.types = [y] : F.indexOf(y) === -1 && F.push(y);
    } else Ft(Jt.bind(null, y));
  }
  var iA = {
    map: ut,
    forEach: function(y, E, F) {
      ut(
        y,
        function() {
          E.apply(this, arguments);
        },
        F
      );
    },
    count: function(y) {
      var E = 0;
      return ut(y, function() {
        E++;
      }), E;
    },
    toArray: function(y) {
      return ut(y, function(E) {
        return E;
      }) || [];
    },
    only: function(y) {
      if (!rt(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  };
  return gt.Activity = s, gt.Children = iA, gt.Component = X, gt.Fragment = c, gt.Profiler = d, gt.PureComponent = tt, gt.StrictMode = r, gt.Suspense = S, gt.ViewTransition = M, gt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k, gt.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return k.H.useMemoCache(y);
    }
  }, gt.addTransitionType = Jt, gt.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, gt.cacheSignal = function() {
    return null;
  }, gt.cloneElement = function(y, E, F) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var I = C({}, y.props), dt = y.key;
    if (E != null)
      for (w in E.key !== void 0 && (dt = "" + E.key), E)
        !mt.call(E, w) || w === "key" || w === "__self" || w === "__source" || w === "ref" && E.ref === void 0 || (I[w] = E[w]);
    var w = arguments.length - 2;
    if (w === 1) I.children = F;
    else if (1 < w) {
      for (var $ = Array(w), G = 0; G < w; G++)
        $[G] = arguments[G + 2];
      I.children = $;
    }
    return Gt(y.type, dt, I);
  }, gt.createContext = function(y) {
    return y = {
      $$typeof: p,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: m,
      _context: y
    }, y;
  }, gt.createElement = function(y, E, F) {
    var I, dt = {}, w = null;
    if (E != null)
      for (I in E.key !== void 0 && (w = "" + E.key), E)
        mt.call(E, I) && I !== "key" && I !== "__self" && I !== "__source" && (dt[I] = E[I]);
    var $ = arguments.length - 2;
    if ($ === 1) dt.children = F;
    else if (1 < $) {
      for (var G = Array($), W = 0; W < $; W++)
        G[W] = arguments[W + 2];
      dt.children = G;
    }
    if (y && y.defaultProps)
      for (I in $ = y.defaultProps, $)
        dt[I] === void 0 && (dt[I] = $[I]);
    return Gt(y, w, dt);
  }, gt.createRef = function() {
    return { current: null };
  }, gt.forwardRef = function(y) {
    return { $$typeof: v, render: y };
  }, gt.isValidElement = rt, gt.lazy = function(y) {
    return {
      $$typeof: R,
      _payload: { _status: -1, _result: y },
      _init: ft
    };
  }, gt.memo = function(y, E) {
    return {
      $$typeof: U,
      type: y,
      compare: E === void 0 ? null : E
    };
  }, gt.startTransition = Ft, gt.unstable_useCacheRefresh = function() {
    return k.H.useCacheRefresh();
  }, gt.use = function(y) {
    return k.H.use(y);
  }, gt.useActionState = function(y, E, F) {
    return k.H.useActionState(y, E, F);
  }, gt.useCallback = function(y, E) {
    return k.H.useCallback(y, E);
  }, gt.useContext = function(y) {
    return k.H.useContext(y);
  }, gt.useDebugValue = function() {
  }, gt.useDeferredValue = function(y, E) {
    return k.H.useDeferredValue(y, E);
  }, gt.useEffect = function(y, E) {
    return k.H.useEffect(y, E);
  }, gt.useEffectEvent = function(y) {
    return k.H.useEffectEvent(y);
  }, gt.useId = function() {
    return k.H.useId();
  }, gt.useImperativeHandle = function(y, E, F) {
    return k.H.useImperativeHandle(y, E, F);
  }, gt.useInsertionEffect = function(y, E) {
    return k.H.useInsertionEffect(y, E);
  }, gt.useLayoutEffect = function(y, E) {
    return k.H.useLayoutEffect(y, E);
  }, gt.useMemo = function(y, E) {
    return k.H.useMemo(y, E);
  }, gt.useOptimistic = function(y, E) {
    return k.H.useOptimistic(y, E);
  }, gt.useReducer = function(y, E, F) {
    return k.H.useReducer(y, E, F);
  }, gt.useRef = function(y) {
    return k.H.useRef(y);
  }, gt.useState = function(y) {
    return k.H.useState(y);
  }, gt.useSyncExternalStore = function(y, E, F) {
    return k.H.useSyncExternalStore(
      y,
      E,
      F
    );
  }, gt.useTransition = function() {
    return k.H.useTransition();
  }, gt.version = "19.3.0", gt;
}
var lp;
function Ss() {
  return lp || (lp = 1, _c.exports = W1()), _c.exports;
}
var $c = { exports: {} }, NA = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var up;
function L1() {
  if (up) return NA;
  up = 1;
  var u = Ss();
  function i(R) {
    var s = "https://react.dev/errors/" + R;
    if (1 < arguments.length) {
      s += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var M = 2; M < arguments.length; M++)
        s += "&args[]=" + encodeURIComponent(arguments[M]);
    }
    return "Minified React error #" + R + "; visit " + s + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c() {
  }
  var r = {
    d: {
      f: c,
      r: function() {
        throw Error(i(522));
      },
      D: c,
      C: c,
      L: c,
      m: c,
      X: c,
      S: c,
      M: c
    },
    p: 0,
    findDOMNode: null
  }, d = Symbol.for("react.portal"), m = Symbol.for("react.recoverable"), p = Symbol.for("react.optimistic_key");
  function v(R, s, M) {
    var Q = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: Q == null ? null : Q === p ? p : "" + Q,
      children: R,
      containerInfo: s,
      implementation: M
    };
  }
  var S = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function U(R, s) {
    if (R === "font") return "";
    if (typeof s == "string")
      return s === "use-credentials" ? s : "";
  }
  return NA.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, NA.browser = function(R) {
    return { $$typeof: m, _reason: R };
  }, NA.createPortal = function(R, s) {
    var M = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!s || s.nodeType !== 1 && s.nodeType !== 9 && s.nodeType !== 11)
      throw Error(i(299));
    return v(R, s, null, M);
  }, NA.flushSync = function(R) {
    var s = S.T, M = r.p;
    try {
      if (S.T = null, r.p = 2, R) return R();
    } finally {
      S.T = s, r.p = M, r.d.f();
    }
  }, NA.preconnect = function(R, s) {
    typeof R == "string" && (s ? (s = s.crossOrigin, s = typeof s == "string" ? s === "use-credentials" ? s : "" : void 0) : s = null, r.d.C(R, s));
  }, NA.prefetchDNS = function(R) {
    typeof R == "string" && r.d.D(R);
  }, NA.preinit = function(R, s) {
    if (typeof R == "string" && s && typeof s.as == "string") {
      var M = s.as, Q = U(M, s.crossOrigin), H = typeof s.integrity == "string" ? s.integrity : void 0, B = typeof s.fetchPriority == "string" ? s.fetchPriority : void 0;
      M === "style" ? r.d.S(
        R,
        typeof s.precedence == "string" ? s.precedence : void 0,
        {
          crossOrigin: Q,
          integrity: H,
          fetchPriority: B
        }
      ) : M === "script" && r.d.X(R, {
        crossOrigin: Q,
        integrity: H,
        fetchPriority: B,
        nonce: typeof s.nonce == "string" ? s.nonce : void 0
      });
    }
  }, NA.preinitModule = function(R, s) {
    if (typeof R == "string")
      if (typeof s == "object" && s !== null) {
        if (s.as == null || s.as === "script") {
          var M = U(
            s.as,
            s.crossOrigin
          );
          r.d.M(R, {
            crossOrigin: M,
            integrity: typeof s.integrity == "string" ? s.integrity : void 0,
            nonce: typeof s.nonce == "string" ? s.nonce : void 0,
            fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0
          });
        }
      } else s == null && r.d.M(R);
  }, NA.preload = function(R, s) {
    if (typeof R == "string" && typeof s == "object" && s !== null && typeof s.as == "string") {
      var M = s.as, Q = U(M, s.crossOrigin);
      r.d.L(R, M, {
        crossOrigin: Q,
        integrity: typeof s.integrity == "string" ? s.integrity : void 0,
        nonce: typeof s.nonce == "string" ? s.nonce : void 0,
        type: typeof s.type == "string" ? s.type : void 0,
        fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0,
        referrerPolicy: typeof s.referrerPolicy == "string" ? s.referrerPolicy : void 0,
        imageSrcSet: typeof s.imageSrcSet == "string" ? s.imageSrcSet : void 0,
        imageSizes: typeof s.imageSizes == "string" ? s.imageSizes : void 0,
        media: typeof s.media == "string" ? s.media : void 0
      });
    }
  }, NA.preloadModule = function(R, s) {
    if (typeof R == "string")
      if (s) {
        var M = U(s.as, s.crossOrigin);
        r.d.m(R, {
          as: typeof s.as == "string" && s.as !== "script" ? s.as : void 0,
          crossOrigin: M,
          integrity: typeof s.integrity == "string" ? s.integrity : void 0,
          nonce: typeof s.nonce == "string" ? s.nonce : void 0,
          fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0
        });
      } else r.d.m(R);
  }, NA.requestFormReset = function(R) {
    r.d.r(R);
  }, NA.unstable_batchedUpdates = function(R, s) {
    return R(s);
  }, NA.useFormState = function(R, s, M) {
    return S.H.useFormState(R, s, M);
  }, NA.useFormStatus = function() {
    return S.H.useHostTransitionStatus();
  }, NA.version = "19.3.0", NA;
}
var ip;
function qp() {
  if (ip) return $c.exports;
  ip = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (i) {
        console.error(i);
      }
  }
  return u(), $c.exports = L1(), $c.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rp;
function X1() {
  if (rp) return gu;
  rp = 1;
  var u = J1(), i = Ss(), c = qp();
  function r(t) {
    var A = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      A += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        A += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + t + "; visit " + A + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function m(t) {
    for (var A = t, e = A; e && !e.alternate; )
      A = e, (A.flags & 4098) !== 0 && (t = A.return), e = A.return;
    for (; A.return; ) A = A.return;
    return A.tag === 3 ? t : null;
  }
  function p(t) {
    if (t.tag === 13) {
      var A = t.memoizedState;
      if (A === null && (t = t.alternate, t !== null && (A = t.memoizedState)), A !== null) return A.dehydrated;
    }
    return null;
  }
  function v(t) {
    if (t.tag === 31) {
      var A = t.memoizedState;
      if (A === null && (t = t.alternate, t !== null && (A = t.memoizedState)), A !== null) return A.dehydrated;
    }
    return null;
  }
  function S(t) {
    if (m(t) !== t)
      throw Error(r(188));
  }
  function U(t) {
    var A = t.alternate;
    if (!A) {
      if (A = m(t), A === null) throw Error(r(188));
      return A !== t ? null : t;
    }
    for (var e = t, a = A; ; ) {
      var n = e.return;
      if (n === null) break;
      var l = n.alternate;
      if (l === null) {
        if (a = n.return, a !== null) {
          e = a;
          continue;
        }
        break;
      }
      if (n.child === l.child) {
        for (l = n.child; l; ) {
          if (l === e) return S(n), t;
          if (l === a) return S(n), A;
          l = l.sibling;
        }
        throw Error(r(188));
      }
      if (e.return !== a.return) e = n, a = l;
      else {
        for (var o = !1, f = n.child; f; ) {
          if (f === e) {
            o = !0, e = n, a = l;
            break;
          }
          if (f === a) {
            o = !0, a = n, e = l;
            break;
          }
          f = f.sibling;
        }
        if (!o) {
          for (f = l.child; f; ) {
            if (f === e) {
              o = !0, e = l, a = n;
              break;
            }
            if (f === a) {
              o = !0, a = l, e = n;
              break;
            }
            f = f.sibling;
          }
          if (!o) throw Error(r(189));
        }
      }
      if (e.alternate !== a) throw Error(r(190));
    }
    if (e.tag !== 3) throw Error(r(188));
    return e.stateNode.current === e ? t : A;
  }
  function R(t) {
    var A = t.tag;
    if (A === 5 || A === 26 || A === 27 || A === 6) return t;
    for (t = t.child; t !== null; ) {
      if (A = R(t), A !== null) return A;
      t = t.sibling;
    }
    return null;
  }
  function s(t, A, e, a, n, l) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && e(t, a, n, l) || (t.tag !== 22 || t.memoizedState === null) && (A || t.tag !== 5 && t.tag !== 27) && s(
        t.child,
        A,
        e,
        a,
        n,
        l
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function M(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function Q(t) {
    var A = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (A = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return A;
  }
  function H(t) {
    var A = [null, null], e = M(t);
    return e === null || B(
      A,
      t,
      e.child,
      { foundSelf: !1 }
    ), A;
  }
  function B(t, A, e, a) {
    for (; e !== null; ) {
      if (e === A) a.foundSelf = !0;
      else if (e.tag === 5 || e.tag === 27 || e.tag === 6) {
        if (a.foundSelf) return t[1] = e, !0;
        t[0] = e;
      } else if ((e.tag !== 22 || e.memoizedState === null) && B(
        t,
        A,
        e.child,
        a
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function C(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var Y = null, X = null;
  function nt(t, A, e) {
    return t === e ? !0 : t === A ? (Y = t, !0) : !1;
  }
  function tt(t, A, e) {
    return t === e ? (X = t, !1) : t === A ? (X !== null && (Y = t), !0) : !1;
  }
  function it(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function ct(t, A, e) {
    for (var a = 0, n = t; n; n = e(n)) a++;
    n = 0;
    for (var l = A; l; l = e(l)) n++;
    for (; 0 < a - n; ) t = e(t), a--;
    for (; 0 < n - a; ) A = e(A), n--;
    for (; a--; ) {
      if (t === A || A !== null && t === A.alternate)
        return t;
      t = e(t), A = e(A);
    }
    return null;
  }
  var P = Object.assign, k = Symbol.for("react.element"), mt = Symbol.for("react.transitional.element"), Gt = Symbol.for("react.portal"), jt = Symbol.for("react.fragment"), rt = Symbol.for("react.strict_mode"), Lt = Symbol.for("react.profiler"), Et = Symbol.for("react.consumer"), Ut = Symbol.for("react.context"), q = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), ut = Symbol.for("react.suspense_list"), ft = Symbol.for("react.memo"), Z = Symbol.for("react.lazy"), Ft = Symbol.for("react.activity"), Jt = Symbol.for("react.legacy_hidden"), iA = Symbol.for("react.memo_cache_sentinel"), y = Symbol.for("react.view_transition"), E = Symbol.for("react.recoverable"), F = Symbol.iterator;
  function I(t) {
    return t === null || typeof t != "object" ? null : (t = F && t[F] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var dt = Symbol.for("react.client.reference");
  function w(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === dt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case jt:
        return "Fragment";
      case Lt:
        return "Profiler";
      case rt:
        return "StrictMode";
      case _:
        return "Suspense";
      case ut:
        return "SuspenseList";
      case Ft:
        return "Activity";
      case y:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case Gt:
          return "Portal";
        case Ut:
          return t.displayName || "Context";
        case Et:
          return (t._context.displayName || "Context") + ".Consumer";
        case q:
          var A = t.render;
          return t = t.displayName, t || (t = A.displayName || A.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case ft:
          return A = t.displayName || null, A !== null ? A : w(t.type) || "Memo";
        case Z:
          A = t._payload, t = t._init;
          try {
            return w(t(A));
          } catch {
          }
      }
    return null;
  }
  var $ = Array.isArray, G = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Mt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, rA = [], GA = -1;
  function oA(t) {
    return { current: t };
  }
  function Kt(t) {
    0 > GA || (t.current = rA[GA], rA[GA] = null, GA--);
  }
  function wt(t, A) {
    GA++, rA[GA] = t.current, t.current = A;
  }
  var tA = oA(null), ka = oA(null), Se = oA(null), AA = oA(null);
  function Ba(t, A) {
    switch (wt(Se, A), wt(ka, t), wt(tA, null), A.nodeType) {
      case 9:
      case 11:
        t = (t = A.documentElement) && (t = t.namespaceURI) ? o0(t) : 0;
        break;
      default:
        if (t = A.tagName, A = A.namespaceURI)
          A = o0(A), t = c0(A, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    Kt(tA), wt(tA, t);
  }
  function FA() {
    Kt(tA), Kt(ka), Kt(Se);
  }
  function gl(t) {
    var A = t.memoizedState;
    A !== null && (nl._currentValue = A.memoizedState, wt(AA, t)), A = tA.current;
    var e = c0(A, t.type);
    A !== e && (wt(ka, t), wt(tA, e));
  }
  function pn(t) {
    ka.current === t && (Kt(tA), Kt(ka)), AA.current === t && (Kt(AA), nl._currentValue = Mt);
  }
  var ua, Du;
  function fe(t) {
    if (ua === void 0)
      try {
        throw Error();
      } catch (e) {
        var A = e.stack.trim().match(/\n( *(at )?)/);
        ua = A && A[1] || "", Du = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ua + t + Du;
  }
  var Ya = !1;
  function xe(t, A) {
    if (!t || Ya) return "";
    Ya = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (A) {
              var K = function() {
                throw Error();
              };
              if (Object.defineProperty(K.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(K, []);
                } catch (L) {
                  var x = L;
                }
                Reflect.construct(t, [], K);
              } else {
                try {
                  K.call();
                } catch (L) {
                  x = L;
                }
                K = !1;
                try {
                  var D = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), K = !0, new t();
                } finally {
                  K && (D !== void 0 ? Object.defineProperty(t.prototype, "props", D) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (L) {
                x = L;
              }
              (K = t()) && typeof K.catch == "function" && K.catch(function() {
              });
            }
          } catch (L) {
            if (L && x && typeof L.stack == "string")
              return [L.stack, x.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var l = a.DetermineComponentFrameRoot(), o = l[0], f = l[1];
      if (o && f) {
        var g = o.split(`
`), T = f.split(`
`);
        for (n = a = 0; a < g.length && !g[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < T.length && !T[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === g.length || n === T.length)
          for (a = g.length - 1, n = T.length - 1; 1 <= a && 0 <= n && g[a] !== T[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (g[a] !== T[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || g[a] !== T[n]) {
                  var O = `
` + g[a].replace(" at new ", " at ");
                  return t.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", t.displayName)), O;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ya = !1, Error.prepareStackTrace = e;
    }
    return (e = t ? t.displayName || t.name : "") ? fe(e) : "";
  }
  function Ru(t, A) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return fe(t.type);
      case 16:
        return fe("Lazy");
      case 13:
        return t.child !== A && A !== null ? fe("Suspense Fallback") : fe("Suspense");
      case 19:
        return fe("SuspenseList");
      case 0:
      case 15:
        return xe(t.type, !1);
      case 11:
        return xe(t.type.render, !1);
      case 1:
        return xe(t.type, !0);
      case 31:
        return fe("Activity");
      case 30:
        return fe("ViewTransition");
      default:
        return "";
    }
  }
  function Be(t) {
    try {
      var A = "", e = null;
      do
        A += Ru(t, e), e = t, t = t.return;
      while (t);
      return A;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var hl = Object.prototype.hasOwnProperty, yl = u.unstable_scheduleCallback, gn = u.unstable_cancelCallback, Ou = u.unstable_shouldYield, $A = u.unstable_requestPaint, MA = u.unstable_now, vl = u.unstable_getCurrentPriorityLevel, de = u.unstable_ImmediatePriority, bl = u.unstable_UserBlockingPriority, hn = u.unstable_NormalPriority, Eu = u.unstable_LowPriority, Sl = u.unstable_IdlePriority, pt = u.log, eA = u.unstable_setDisableYieldValue, It = null, Bt = null;
  function VA(t) {
    if (typeof pt == "function" && eA(t), Bt && typeof Bt.setStrictMode == "function")
      try {
        Bt.setStrictMode(It, t);
      } catch {
      }
  }
  var Rt = Math.clz32 ? Math.clz32 : xl, KA = Math.log, te = Math.LN2;
  function xl(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (KA(t) / te | 0) | 0;
  }
  var zA = 256, ia = 262144, Vu = 4194304;
  function Ha(t) {
    var A = t & 42;
    if (A !== 0) return A;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Ku(t, A, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var n = 0, l = t.suspendedLanes, o = t.pingedLanes;
    t = t.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~l, a !== 0 ? n = Ha(a) : (o &= f, o !== 0 ? n = Ha(o) : e || (e = f & ~t, e !== 0 && (n = Ha(e))))) : (f = a & ~l, f !== 0 ? n = Ha(f) : o !== 0 ? n = Ha(o) : e || (e = a & ~t, e !== 0 && (n = Ha(e)))), n === 0 ? 0 : A !== 0 && A !== n && (A & l) === 0 && (l = n & -n, e = A & -A, l >= e || l === 32 && (e & 4194048) !== 0) ? A : n;
  }
  function Nl(t, A) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & A) === 0;
  }
  function Ks(t, A) {
    (A & 8) !== 0 && (A |= A & 32);
    var e = t.entangledLanes;
    if (e !== 0)
      for (t = t.entanglements, e &= A; 0 < e; ) {
        var a = 31 - Rt(e), n = 1 << a;
        A |= t[a], e &= ~n;
      }
    return A;
  }
  function eh(t, A) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return A + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return A + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ws() {
    var t = Vu;
    return Vu <<= 1, (Vu & 62914560) === 0 && (Vu = 4194304), t;
  }
  function br(t) {
    for (var A = [], e = 0; 31 > e; e++) A.push(t);
    return A;
  }
  function Tl(t, A) {
    t.pendingLanes |= A, A !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function ah(t, A, e, a, n, l) {
    var o = t.pendingLanes;
    t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= e, t.entangledLanes &= e, t.errorRecoveryDisabledLanes &= e, t.shellSuspendCounter = 0;
    var f = t.entanglements, g = t.expirationTimes, T = t.hiddenUpdates;
    for (e = o & ~e; 0 < e; ) {
      var O = 31 - Rt(e), K = 1 << O;
      f[O] = 0, g[O] = -1;
      var x = T[O];
      if (x !== null)
        for (T[O] = null, O = 0; O < x.length; O++) {
          var D = x[O];
          D !== null && (D.lane &= -536870913);
        }
      e &= ~K;
    }
    a !== 0 && Cs(t, a, 0), l !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= l & ~(o & ~A));
  }
  function Cs(t, A, e) {
    t.pendingLanes |= A, t.suspendedLanes &= ~A;
    var a = 31 - Rt(A);
    t.entangledLanes |= A, t.entanglements[a] = t.entanglements[a] | 1073741824 | e & 261930;
  }
  function qs(t, A) {
    var e = t.entangledLanes |= A;
    for (t = t.entanglements; e; ) {
      var a = 31 - Rt(e), n = 1 << a;
      n & A | t[a] & A && (t[a] |= A), e &= ~n;
    }
  }
  function ks(t, A) {
    var e = A & -A;
    return e = (e & 42) !== 0 ? 1 : Sr(e), (e & (t.suspendedLanes | A)) !== 0 ? 0 : e;
  }
  function Sr(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function xr(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Bs() {
    var t = W.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : W0(t.type));
  }
  function Ys(t, A) {
    var e = W.p;
    try {
      return W.p = t, A();
    } finally {
      W.p = e;
    }
  }
  var Ye = Math.random().toString(36).slice(2), hA = "__reactFiber$" + Ye, wA = "__reactProps$" + Ye, yn = "__reactContainer$" + Ye, Hs = "__reactEvents$" + Ye, nh = "__reactListeners$" + Ye, lh = "__reactHandles$" + Ye, Gs = "__reactResources$" + Ye, Ul = "__reactMarker$" + Ye, wu = "__reactLoad$" + Ye;
  function Cu(t) {
    delete t[hA], delete t[wA], delete t[nh], delete t[lh];
  }
  function Ga(t) {
    var A;
    if (A = t[hA]) return A;
    for (var e = t.parentNode; e; ) {
      if (A = e[yn] || e[hA]) {
        if (e = A.alternate, A.child !== null || e !== null && e.child !== null)
          for (t = z0(t); t !== null; ) {
            if (e = t[hA]) return e;
            t = z0(t);
          }
        return A;
      }
      t = e, e = t.parentNode;
    }
    return null;
  }
  function vn(t) {
    if (t = t[hA] || t[yn]) {
      var A = t.tag;
      if (A === 5 || A === 6 || A === 13 || A === 31 || A === 26 || A === 27 || A === 3)
        return t;
    }
    return null;
  }
  function Ml(t) {
    var A = t.tag;
    if (A === 5 || A === 26 || A === 27 || A === 6) return t.stateNode;
    throw Error(r(33));
  }
  function bn(t) {
    var A = t[Gs];
    return A || (A = t[Gs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), A;
  }
  function fA(t) {
    t[Ul] = !0;
  }
  function Fs(t) {
    t[wu] = void 0;
  }
  var Zs = /* @__PURE__ */ new Set(), Qs = {};
  function Fa(t, A) {
    Sn(t, A), Sn(t + "Capture", A);
  }
  function Sn(t, A) {
    for (Qs[t] = A, t = 0; t < A.length; t++)
      Zs.add(A[t]);
  }
  var uh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Js = {}, Ws = {};
  function ih(t) {
    return hl.call(Ws, t) ? !0 : hl.call(Js, t) ? !1 : uh.test(t) ? Ws[t] = !0 : (Js[t] = !0, !1);
  }
  var Dt = !1;
  function Ls() {
    var t = Dt;
    return Dt = !1, t;
  }
  function qu(t, A, e) {
    if (ih(A))
      if (e === null) t.removeAttribute(A);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(A);
            return;
          case "boolean":
            var a = A.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(A);
              return;
            }
        }
        t.setAttribute(A, e);
      }
  }
  function ku(t, A, e) {
    if (e === null) t.removeAttribute(A);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(A);
          return;
      }
      t.setAttribute(A, e);
    }
  }
  function He(t, A, e, a) {
    if (a === null) t.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttributeNS(A, e, a);
    }
  }
  function ZA(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Xs(t) {
    var A = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (A === "checkbox" || A === "radio");
  }
  function rh(t, A, e) {
    var a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      A
    );
    if (!t.hasOwnProperty(A) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, l = a.set;
      return Object.defineProperty(t, A, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(o) {
          e = "" + o, l.call(this, o);
        }
      }), Object.defineProperty(t, A, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return e;
        },
        setValue: function(o) {
          e = "" + o;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[A];
        }
      };
    }
  }
  function Nr(t) {
    if (!t._valueTracker) {
      var A = Xs(t) ? "checked" : "value";
      t._valueTracker = rh(
        t,
        A,
        "" + t[A]
      );
    }
  }
  function Is(t) {
    if (!t) return !1;
    var A = t._valueTracker;
    if (!A) return !0;
    var e = A.getValue(), a = "";
    return t && (a = Xs(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== e ? (A.setValue(t), !0) : !1;
  }
  var oh = /[\n"\\]/g;
  function Ae(t) {
    return t.replace(
      oh,
      function(A) {
        return "\\" + A.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Tr(t, A, e, a, n, l, o, f) {
    t.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? t.type = o : t.removeAttribute("type"), A != null ? o === "number" ? (A === 0 && t.value === "" || t.value != A) && (t.value = "" + ZA(A)) : t.value !== "" + ZA(A) && (t.value = "" + ZA(A)) : o !== "submit" && o !== "reset" || t.removeAttribute("value"), A != null ? o === "number" && t.value == A ? Ur(t, ZA(t.value)) : Ur(t, ZA(A)) : e != null ? Ur(t, ZA(e)) : a != null && t.removeAttribute("value"), n == null && l != null && (t.defaultChecked = !!l), n != null && (t.checked = n && typeof n != "function" && typeof n != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.name = "" + ZA(f) : t.removeAttribute("name");
  }
  function Ps(t, A, e, a, n, l, o, f) {
    if (l != null && typeof l != "function" && typeof l != "symbol" && typeof l != "boolean" && (t.type = l), A != null || e != null) {
      if (!(l !== "submit" && l !== "reset" || A != null)) {
        Nr(t);
        return;
      }
      e = e != null ? "" + ZA(e) : "", A = A != null ? "" + ZA(A) : e, f || A === t.value || (t.value = A), t.defaultValue = A;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = f ? t.checked : !!a, t.defaultChecked = !!a, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (t.name = o), Nr(t);
  }
  function Ur(t, A) {
    t.defaultValue !== "" + A && (t.defaultValue = "" + A);
  }
  function xn(t, A, e, a) {
    if (t = t.options, A) {
      A = {};
      for (var n = 0; n < e.length; n++)
        A["$" + e[n]] = !0;
      for (e = 0; e < t.length; e++)
        n = A.hasOwnProperty("$" + t[e].value), t[e].selected !== n && (t[e].selected = n), n && a && (t[e].defaultSelected = !0);
    } else {
      for (e = "" + ZA(e), A = null, n = 0; n < t.length; n++) {
        if (t[n].value === e) {
          t[n].selected = !0, a && (t[n].defaultSelected = !0);
          return;
        }
        A !== null || t[n].disabled || (A = t[n]);
      }
      A !== null && (A.selected = !0);
    }
  }
  function _s(t, A, e) {
    if (A != null && (A = "" + ZA(A), A !== t.value && (t.value = A), e == null)) {
      t.defaultValue !== A && (t.defaultValue = A);
      return;
    }
    t.defaultValue = e != null ? "" + ZA(e) : "";
  }
  function $s(t, A, e, a) {
    if (A == null) {
      if (a != null) {
        if (e != null) throw Error(r(92));
        if ($(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), A = e;
    }
    e = ZA(A), t.defaultValue = e, a = t.textContent, a === e && a !== "" && a !== null && (t.value = a), Nr(t);
  }
  function Nn(t, A) {
    if (A) {
      var e = t.firstChild;
      if (e && e === t.lastChild && e.nodeType === 3) {
        e.nodeValue = A;
        return;
      }
    }
    t.textContent = A;
  }
  var ch = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function tf(t, A, e) {
    var a = A.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? t.setProperty(A, "") : A === "float" ? t.cssFloat = "" : t[A] = "" : a ? t.setProperty(A, e) : typeof e != "number" || e === 0 || ch.has(A) ? A === "float" ? t.cssFloat = e : t[A] = ("" + e).trim() : t[A] = e + "px";
  }
  function Af(t, A, e) {
    if (A != null && typeof A != "object")
      throw Error(r(62));
    if (t = t.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || A != null && A.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "", Dt = !0);
      for (var n in A)
        a = A[n], A.hasOwnProperty(n) && e[n] !== a && (tf(t, n, a), Dt = !0);
    } else
      for (var l in A)
        A.hasOwnProperty(l) && tf(t, l, A[l]);
  }
  function Mr(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var sh = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), fh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Bu(t) {
    return fh.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function Ne() {
  }
  var zr = null;
  function jr(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Tn = null, Un = null;
  function ef(t) {
    var A = vn(t);
    if (A && (t = A.stateNode)) {
      var e = t[wA] || null;
      t: switch (t = A.stateNode, A.type) {
        case "input":
          if (Tr(
            t,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), A = e.name, e.type === "radio" && A != null) {
            for (e = t; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + Ae(
                "" + A
              ) + '"][type="radio"]'
            ), A = 0; A < e.length; A++) {
              var a = e[A];
              if (a !== t && a.form === t.form) {
                var n = a[wA] || null;
                if (!n) throw Error(r(90));
                Tr(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (A = 0; A < e.length; A++)
              a = e[A], a.form === t.form && Is(a);
          }
          break t;
        case "textarea":
          _s(t, e.value, e.defaultValue);
          break t;
        case "select":
          A = e.value, A != null && xn(t, !!e.multiple, A, !1);
      }
    }
  }
  var Dr = !1;
  function af(t, A, e) {
    if (Dr) return t(A, e);
    Dr = !0;
    try {
      var a = t(A);
      return a;
    } finally {
      if (Dr = !1, (Tn !== null || Un !== null) && (Bi(), Tn && (A = Tn, t = Un, Un = Tn = null, ef(A), t)))
        for (A = 0; A < t.length; A++) ef(t[A]);
    }
  }
  function zl(t, A) {
    var e = t.stateNode;
    if (e === null) return null;
    var a = e[wA] || null;
    if (a === null) return null;
    e = a[A];
    t: switch (A) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (e && typeof e != "function")
      throw Error(
        r(231, A, typeof e)
      );
    return e;
  }
  var Ge = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Rr = !1;
  if (Ge)
    try {
      var jl = {};
      Object.defineProperty(jl, "passive", {
        get: function() {
          Rr = !0;
        }
      }), window.addEventListener("test", jl, jl), window.removeEventListener("test", jl, jl);
    } catch {
      Rr = !1;
    }
  var ra = null, Or = null, Yu = null;
  function nf() {
    if (Yu) return Yu;
    var t, A = Or, e = A.length, a, n = "value" in ra ? ra.value : ra.textContent, l = n.length;
    for (t = 0; t < e && A[t] === n[t]; t++) ;
    var o = e - t;
    for (a = 1; a <= o && A[e - a] === n[l - a]; a++) ;
    return Yu = n.slice(t, 1 < a ? 1 - a : void 0);
  }
  function Hu(t) {
    var A = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && A === 13 && (t = 13)) : t = A, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Gu() {
    return !0;
  }
  function lf() {
    return !1;
  }
  function jA(t) {
    function A(e, a, n, l, o) {
      this._reactName = e, this._targetInst = n, this.type = a, this.nativeEvent = l, this.target = o, this.currentTarget = null;
      for (var f in t)
        t.hasOwnProperty(f) && (e = t[f], this[f] = e ? e(l) : l[f]);
      return this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? Gu : lf, this.isPropagationStopped = lf, this;
    }
    return P(A.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Gu);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Gu);
      },
      persist: function() {
      },
      isPersistent: Gu
    }), A;
  }
  var oa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Fu = jA(oa), Dl = P({}, oa, { view: 0, detail: 0 }), dh = jA(Dl), Er, Vr, Rl, Zu = P({}, Dl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: wr,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Rl && (Rl && t.type === "mousemove" ? (Er = t.screenX - Rl.screenX, Vr = t.screenY - Rl.screenY) : Vr = Er = 0, Rl = t), Er);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Vr;
    }
  }), uf = jA(Zu), mh = P({}, Zu, { dataTransfer: 0 }), ph = jA(mh), gh = P({}, Dl, { relatedTarget: 0 }), Kr = jA(gh), hh = P({}, oa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), yh = jA(hh), vh = P({}, oa, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), bh = jA(vh), Sh = P({}, oa, { data: 0 }), rf = jA(Sh), xh = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nh = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Th = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Uh(t) {
    var A = this.nativeEvent;
    return A.getModifierState ? A.getModifierState(t) : (t = Th[t]) ? !!A[t] : !1;
  }
  function wr() {
    return Uh;
  }
  var Mh = P({}, Dl, {
    key: function(t) {
      if (t.key) {
        var A = xh[t.key] || t.key;
        if (A !== "Unidentified") return A;
      }
      return t.type === "keypress" ? (t = Hu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Nh[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: wr,
    charCode: function(t) {
      return t.type === "keypress" ? Hu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Hu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), zh = jA(Mh), jh = P({}, Zu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), of = jA(jh), Dh = P({}, oa, { submitter: 0 }), Rh = jA(Dh), Oh = P({}, Dl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: wr
  }), Eh = jA(Oh), Vh = P({}, oa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Kh = jA(Vh), wh = P({}, Zu, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ch = jA(wh), qh = P({}, oa, {
    newState: 0,
    oldState: 0,
    source: 0
  }), kh = jA(qh), Bh = [9, 13, 27, 32], Cr = Ge && "CompositionEvent" in window, Ol = null;
  Ge && "documentMode" in document && (Ol = document.documentMode);
  var Yh = Ge && "TextEvent" in window && !Ol, cf = Ge && (!Cr || Ol && 8 < Ol && 11 >= Ol), sf = " ", ff = !1;
  function df(t, A) {
    switch (t) {
      case "keyup":
        return Bh.indexOf(A.keyCode) !== -1;
      case "keydown":
        return A.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function mf(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Mn = !1;
  function Hh(t, A) {
    switch (t) {
      case "compositionend":
        return mf(A);
      case "keypress":
        return A.which !== 32 ? null : (ff = !0, sf);
      case "textInput":
        return t = A.data, t === sf && ff ? null : t;
      default:
        return null;
    }
  }
  function Gh(t, A) {
    if (Mn)
      return t === "compositionend" || !Cr && df(t, A) ? (t = nf(), Yu = Or = ra = null, Mn = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(A.ctrlKey || A.altKey || A.metaKey) || A.ctrlKey && A.altKey) {
          if (A.char && 1 < A.char.length)
            return A.char;
          if (A.which) return String.fromCharCode(A.which);
        }
        return null;
      case "compositionend":
        return cf && A.locale !== "ko" ? null : A.data;
      default:
        return null;
    }
  }
  var Fh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function pf(t) {
    var A = t && t.nodeName && t.nodeName.toLowerCase();
    return A === "input" ? !!Fh[t.type] : A === "textarea";
  }
  function gf(t, A, e, a) {
    Tn ? Un ? Un.push(a) : Un = [a] : Tn = a, A = Qi(A, "onChange"), 0 < A.length && (e = new Fu(
      "onChange",
      "change",
      null,
      e,
      a
    ), t.push({ event: e, listeners: A }));
  }
  var El = null, Vl = null;
  function Zh(t) {
    a0(t, 0);
  }
  function Qu(t) {
    var A = Ml(t);
    if (Is(A)) return t;
  }
  function hf(t, A) {
    if (t === "change") return A;
  }
  var yf = !1;
  if (Ge) {
    var qr;
    if (Ge) {
      var kr = "oninput" in document;
      if (!kr) {
        var vf = document.createElement("div");
        vf.setAttribute("oninput", "return;"), kr = typeof vf.oninput == "function";
      }
      qr = kr;
    } else qr = !1;
    yf = qr && (!document.documentMode || 9 < document.documentMode);
  }
  function bf() {
    El && (El.detachEvent("onpropertychange", Sf), Vl = El = null);
  }
  function Sf(t) {
    if (t.propertyName === "value" && Qu(Vl)) {
      var A = [];
      gf(
        A,
        Vl,
        t,
        jr(t)
      ), af(Zh, A);
    }
  }
  function Qh(t, A, e) {
    t === "focusin" ? (bf(), El = A, Vl = e, El.attachEvent("onpropertychange", Sf)) : t === "focusout" && bf();
  }
  function Jh(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Qu(Vl);
  }
  function Wh(t, A) {
    if (t === "click") return Qu(A);
  }
  function Lh(t, A) {
    if (t === "input" || t === "change")
      return Qu(A);
  }
  function Xh(t, A) {
    return t === A && (t !== 0 || 1 / t === 1 / A) || t !== t && A !== A;
  }
  var QA = typeof Object.is == "function" ? Object.is : Xh;
  function Kl(t, A) {
    if (QA(t, A)) return !0;
    if (typeof t != "object" || t === null || typeof A != "object" || A === null)
      return !1;
    var e = Object.keys(t), a = Object.keys(A);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var n = e[a];
      if (!hl.call(A, n) || !QA(t[n], A[n]))
        return !1;
    }
    return !0;
  }
  function Br(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function xf(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Nf(t, A) {
    var e = xf(t);
    t = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (a = t + e.textContent.length, t <= A && a >= A)
          return { node: e, offset: A - t };
        t = a;
      }
      t: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break t;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = xf(e);
    }
  }
  function Tf(t, A) {
    return t && A ? t === A ? !0 : t && t.nodeType === 3 ? !1 : A && A.nodeType === 3 ? Tf(t, A.parentNode) : "contains" in t ? t.contains(A) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(A) & 16) : !1 : !1;
  }
  function Uf(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var A = Br(t.document); A instanceof t.HTMLIFrameElement; ) {
      try {
        var e = typeof A.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) t = A.contentWindow;
      else break;
      A = Br(t.document);
    }
    return A;
  }
  function Yr(t) {
    var A = t && t.nodeName && t.nodeName.toLowerCase();
    return A && (A === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || A === "textarea" || t.contentEditable === "true");
  }
  var Ih = Ge && "documentMode" in document && 11 >= document.documentMode, zn = null, Hr = null, wl = null, Gr = !1;
  function Mf(t, A, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Gr || zn == null || zn !== Br(a) || (a = zn, "selectionStart" in a && Yr(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), wl && Kl(wl, a) || (wl = a, a = Qi(Hr, "onSelect"), 0 < a.length && (A = new Fu(
      "onSelect",
      "select",
      null,
      A,
      e
    ), t.push({ event: A, listeners: a }), A.target = zn)));
  }
  function Za(t, A) {
    var e = {};
    return e[t.toLowerCase()] = A.toLowerCase(), e["Webkit" + t] = "webkit" + A, e["Moz" + t] = "moz" + A, e;
  }
  var jn = {
    animationend: Za("Animation", "AnimationEnd"),
    animationiteration: Za("Animation", "AnimationIteration"),
    animationstart: Za("Animation", "AnimationStart"),
    transitionrun: Za("Transition", "TransitionRun"),
    transitionstart: Za("Transition", "TransitionStart"),
    transitioncancel: Za("Transition", "TransitionCancel"),
    transitionend: Za("Transition", "TransitionEnd")
  }, Fr = {}, zf = {};
  Ge && (zf = document.createElement("div").style, "AnimationEvent" in window || (delete jn.animationend.animation, delete jn.animationiteration.animation, delete jn.animationstart.animation), "TransitionEvent" in window || delete jn.transitionend.transition);
  function Qa(t) {
    if (Fr[t]) return Fr[t];
    if (!jn[t]) return t;
    var A = jn[t], e;
    for (e in A)
      if (A.hasOwnProperty(e) && e in zf)
        return Fr[t] = A[e];
    return t;
  }
  var jf = Qa("animationend"), Df = Qa("animationiteration"), Rf = Qa("animationstart"), Ph = Qa("transitionrun"), _h = Qa("transitionstart"), $h = Qa("transitioncancel"), Of = Qa("transitionend"), Ef = /* @__PURE__ */ new Map(), Zr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Zr.push("scrollEnd");
  function me(t, A) {
    Ef.set(t, A), Fa(A, [t]);
  }
  var ty = 0;
  function Fe(t, A) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (A.autoName !== null) return A.autoName;
    t = ye.identifierPrefix;
    var e = ty++;
    return t = "_" + t + "t_" + e.toString(32) + "_", A.autoName = t;
  }
  function Vf(t) {
    if (t == null || typeof t == "string")
      return t;
    var A = null, e = Ln;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = t[e[a]];
        if (n != null) {
          if (n === "none") return "none";
          A = A == null ? n : A + (" " + n);
        }
      }
    return A ?? t.default;
  }
  function Ze(t, A) {
    return t = Vf(t), A = Vf(A), A == null ? t === "auto" ? null : t : A === "auto" ? null : A;
  }
  var Ju = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var A = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(A)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, ee = [], Dn = 0, Qr = 0;
  function Wu() {
    for (var t = Dn, A = Qr = Dn = 0; A < t; ) {
      var e = ee[A];
      ee[A++] = null;
      var a = ee[A];
      ee[A++] = null;
      var n = ee[A];
      ee[A++] = null;
      var l = ee[A];
      if (ee[A++] = null, a !== null && n !== null) {
        var o = a.pending;
        o === null ? n.next = n : (n.next = o.next, o.next = n), a.pending = n;
      }
      l !== 0 && Kf(e, n, l);
    }
  }
  function Lu(t, A, e, a) {
    ee[Dn++] = t, ee[Dn++] = A, ee[Dn++] = e, ee[Dn++] = a, Qr |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function Jr(t, A, e, a) {
    return Lu(t, A, e, a), Xu(t);
  }
  function Ja(t, A) {
    return Lu(t, null, null, A), Xu(t);
  }
  function Kf(t, A, e) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e);
    for (var n = !1, l = t.return; l !== null; )
      l.childLanes |= e, a = l.alternate, a !== null && (a.childLanes |= e), l.tag === 22 && (t = l.stateNode, t === null || t._visibility & 1 || (n = !0)), t = l, l = l.return;
    return t.tag === 3 ? (l = t.stateNode, n && A !== null && (n = 31 - Rt(e), t = l.hiddenUpdates, a = t[n], a === null ? t[n] = [A] : a.push(A), A.lane = e | 536870912), l) : null;
  }
  function Xu(t) {
    if (50 < au)
      throw au = 0, ki = null, Error(r(185));
    for (var A = t.return; A !== null; )
      t = A, A = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var Rn = {};
  function Ay(t, A, e, a) {
    this.tag = t, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = A, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function CA(t, A, e, a) {
    return new Ay(t, A, e, a);
  }
  function Wr(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Qe(t, A) {
    var e = t.alternate;
    return e === null ? (e = CA(
      t.tag,
      A,
      t.key,
      t.mode
    ), e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.alternate = t, t.alternate = e) : (e.pendingProps = A, e.type = t.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = t.flags & 1206910976, e.childLanes = t.childLanes, e.lanes = t.lanes, e.child = t.child, e.memoizedProps = t.memoizedProps, e.memoizedState = t.memoizedState, e.updateQueue = t.updateQueue, A = t.dependencies, e.dependencies = A === null ? null : { lanes: A.lanes, firstContext: A.firstContext }, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.refCleanup = t.refCleanup, e;
  }
  function wf(t, A) {
    t.flags &= 1206910978;
    var e = t.alternate;
    return e === null ? (t.childLanes = 0, t.lanes = A, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, t.type = e.type, A = e.dependencies, t.dependencies = A === null ? null : {
      lanes: A.lanes,
      firstContext: A.firstContext
    }), t;
  }
  function Iu(t, A, e, a, n, l) {
    var o = 0;
    if (a = t, typeof a == "function") Wr(a) && (o = 1);
    else if (typeof a == "string")
      o = D1(
        t,
        e,
        tA.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (a) {
        case Ft:
          return t = CA(31, e, A, n), t.elementType = Ft, t.lanes = l, t;
        case jt:
          return Wa(e.children, n, l, A);
        case rt:
          o = 8, n |= 24;
          break;
        case Lt:
          return t = CA(12, e, A, n | 2), t.elementType = Lt, t.lanes = l, t;
        case _:
          return t = CA(13, e, A, n), t.elementType = _, t.lanes = l, t;
        case ut:
          return t = CA(19, e, A, n), t.elementType = ut, t.lanes = l, t;
        case Jt:
        case y:
          return t = n | 32, t = CA(30, e, A, t), t.elementType = y, t.lanes = l, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case Ut:
                o = 10;
                break t;
              case Et:
                o = 9;
                break t;
              case q:
                o = 11;
                break t;
              case ft:
                o = 14;
                break t;
              case Z:
                o = 16, a = null;
                break t;
            }
          o = 29, e = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return A = CA(o, e, A, n), A.elementType = t, A.type = a, A.lanes = l, A;
  }
  function Wa(t, A, e, a) {
    return t = CA(7, t, a, A), t.lanes = e, t;
  }
  function Lr(t, A, e) {
    return t = CA(6, t, null, A), t.lanes = e, t;
  }
  function Cf(t) {
    var A = CA(18, null, null, 0);
    return A.stateNode = t, A;
  }
  function Xr(t, A, e) {
    return A = CA(
      4,
      t.children !== null ? t.children : [],
      t.key,
      A
    ), A.lanes = e, A.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, A;
  }
  var qf = /* @__PURE__ */ new WeakMap();
  function ae(t, A) {
    if (typeof t == "object" && t !== null) {
      var e = qf.get(t);
      return e !== void 0 ? e : (A = {
        value: t,
        source: A,
        stack: Be(A)
      }, qf.set(t, A), A);
    }
    return {
      value: t,
      source: A,
      stack: Be(A)
    };
  }
  var On = [], En = 0, Pu = null, Cl = 0, ne = [], le = 0, ca = null, Te = 1, Ue = "";
  function Je(t, A) {
    On[En++] = Cl, On[En++] = Pu, Pu = t, Cl = A;
  }
  function kf(t, A, e) {
    ne[le++] = Te, ne[le++] = Ue, ne[le++] = ca, ca = t;
    var a = Te;
    t = Ue;
    var n = 32 - Rt(a) - 1;
    a &= ~(1 << n), e += 1;
    var l = 32 - Rt(A) + n;
    if (30 < l) {
      var o = n - n % 5;
      l = (a & (1 << o) - 1).toString(32), a >>= o, n -= o, Te = 1 << 32 - Rt(A) + n | e << n | a, Ue = l + t;
    } else
      Te = 1 << l | e << n | a, Ue = t;
  }
  function _u(t) {
    t.return !== null && (Je(t, 1), kf(t, 1, 0));
  }
  function Ir(t) {
    for (; t === Pu; )
      Pu = On[--En], On[En] = null, Cl = On[--En], On[En] = null;
    for (; t === ca; )
      ca = ne[--le], ne[le] = null, Ue = ne[--le], ne[le] = null, Te = ne[--le], ne[le] = null;
  }
  function Bf(t, A) {
    ne[le++] = Te, ne[le++] = Ue, ne[le++] = ca, Te = A.id, Ue = A.overflow, ca = t;
  }
  var dA = null, Zt = null, vt = !1, sa = null, ue = !1, Pr = Error(r(519));
  function fa(t) {
    var A = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw ql(ae(A, t)), Pr;
  }
  function Yf(t) {
    var A = t.stateNode, e = t.type, a = t.memoizedProps;
    switch (A[hA] = t, A[wA] = a, e) {
      case "dialog":
        xt("cancel", A), xt("close", A);
        break;
      case "iframe":
      case "object":
      case "embed":
        xt("load", A);
        break;
      case "video":
      case "audio":
        for (e = 0; e < lu.length; e++)
          xt(lu[e], A);
        break;
      case "source":
        xt("error", A);
        break;
      case "img":
      case "image":
      case "link":
        xt("error", A), xt("load", A);
        break;
      case "details":
        xt("toggle", A);
        break;
      case "input":
        xt("invalid", A), Ps(
          A,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        xt("invalid", A);
        break;
      case "textarea":
        xt("invalid", A), $s(A, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || A.textContent === "" + e || a.suppressHydrationWarning === !0 || i0(A.textContent, e) ? (a.popover != null && (xt("beforetoggle", A), xt("toggle", A)), a.onScroll != null && xt("scroll", A), a.onScrollEnd != null && xt("scrollend", A), a.onClick != null && (A.onclick = Ne), A = !0) : A = !1, A || fa(t, !0);
  }
  function $u(t) {
    for (dA = t.return; dA; )
      switch (dA.tag) {
        case 5:
        case 31:
        case 13:
          ue = !1;
          return;
        case 27:
        case 3:
          ue = !0;
          return;
        default:
          dA = dA.return;
      }
  }
  function Vn(t) {
    if (t !== dA) return !1;
    if (!vt) return $u(t), vt = !0, !1;
    var A = t.tag, e;
    if ((e = A !== 3 && A !== 27) && ((e = A === 5) && (e = t.type, e = !(e !== "form" && e !== "button") || jc(t.type, t.memoizedProps)), e = !e), e && Zt && fa(t), $u(t), A === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Zt = M0(t);
    } else if (A === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Zt = M0(t);
    } else
      A === 27 ? (A = Zt, ja(t.type) ? (t = qc, qc = null, Zt = t) : Zt = A) : Zt = dA ? re(t.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    Zt = dA = null, vt = !1;
  }
  function _r() {
    var t = sa;
    return t !== null && (BA === null ? BA = t : BA.push.apply(
      BA,
      t
    ), sa = null), t;
  }
  function ql(t) {
    sa === null ? sa = [t] : sa.push(t);
  }
  var $r = oA(null), Xa = null, We = null;
  function da(t, A, e) {
    wt($r, A._currentValue), A._currentValue = e;
  }
  function Le(t) {
    t._currentValue = $r.current, Kt($r);
  }
  function ti(t, A, e) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & A) !== A ? (t.childLanes |= A, a !== null && (a.childLanes |= A)) : a !== null && (a.childLanes & A) !== A && (a.childLanes |= A), t === e) break;
      t = t.return;
    }
  }
  function to(t, A, e, a) {
    var n = t.child;
    for (n !== null && (n.return = t); n !== null; ) {
      var l = n.dependencies;
      if (l !== null) {
        var o = n.child;
        l = l.firstContext;
        t: for (; l !== null; ) {
          var f = l;
          l = n;
          for (var g = 0; g < A.length; g++)
            if (f.context === A[g]) {
              l.lanes |= e, f = l.alternate, f !== null && (f.lanes |= e), ti(
                l.return,
                e,
                t
              ), a || (o = null);
              break t;
            }
          l = f.next;
        }
      } else if (n.tag === 18) {
        if (o = n.return, o === null) throw Error(r(341));
        o.lanes |= e, l = o.alternate, l !== null && (l.lanes |= e), ti(o, e, t), o = null;
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null ? (n.lanes |= e, o = n.alternate, o !== null && (o.lanes |= e), ti(
          n.return,
          e,
          t
        ), o = n.child, o = o !== null ? o.sibling : null) : o = n.child;
      if (o !== null) o.return = n;
      else
        for (o = n; o !== null; ) {
          if (o === t) {
            o = null;
            break;
          }
          if (n = o.sibling, n !== null) {
            n.return = o.return, o = n;
            break;
          }
          o = o.return;
        }
      n = o;
    }
  }
  function Ia(t, A, e, a) {
    t = null;
    for (var n = A, l = !1; n !== null; ) {
      if (!l) {
        if ((n.flags & 524288) !== 0) l = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var o = n.alternate;
        if (o === null) throw Error(r(387));
        if (o = o.memoizedProps, o !== null) {
          var f = n.type;
          QA(n.pendingProps.value, o.value) || (t !== null ? t.push(f) : t = [f]);
        }
      } else if (n === AA.current) {
        if (o = n.alternate, o === null) throw Error(r(387));
        o.memoizedState.memoizedState !== n.memoizedState.memoizedState && (t !== null ? t.push(nl) : t = [nl]);
      }
      n = n.return;
    }
    return t !== null && to(
      A,
      t,
      e,
      a
    ), A.flags |= 262144, t !== null;
  }
  function Ai(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!QA(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Pa(t) {
    Xa = t, We = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function yA(t) {
    return Hf(Xa, t);
  }
  function ei(t, A) {
    return Xa === null && Pa(t), Hf(t, A);
  }
  function Hf(t, A) {
    var e = A._currentValue;
    if (A = { context: A, memoizedValue: e, next: null }, We === null) {
      if (t === null) throw Error(r(308));
      We = A, t.dependencies = { lanes: 0, firstContext: A }, t.flags |= 524288;
    } else We = We.next = A;
    return e;
  }
  var ey = typeof AbortController < "u" ? AbortController : function() {
    var t = [], A = this.signal = {
      aborted: !1,
      addEventListener: function(e, a) {
        t.push(a);
      }
    };
    this.abort = function() {
      A.aborted = !0, t.forEach(function(e) {
        return e();
      });
    };
  }, ay = u.unstable_scheduleCallback, ny = u.unstable_NormalPriority, aA = {
    $$typeof: Ut,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ao() {
    return {
      controller: new ey(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function kl(t) {
    t.refCount--, t.refCount === 0 && ay(ny, function() {
      t.controller.abort();
    });
  }
  function Gf(t, A) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var e = t.transitionTypes;
      for (e === null && (e = t.transitionTypes = []), t = 0; t < A.length; t++) {
        var a = A[t];
        e.indexOf(a) === -1 && e.push(a);
      }
    }
  }
  var Bl = null;
  function ly(t) {
    var A = t.transitionTypes;
    return t.transitionTypes = null, A;
  }
  var Yl = null, eo = 0, _a = 0, Kn = null;
  function uy(t, A) {
    if (Yl === null) {
      var e = Yl = [];
      eo = 0, _a = vc(), Kn = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return eo++, A.then(Ff, Ff), A;
  }
  function Ff() {
    if (--eo === 0 && (Bl = null, Yl !== null)) {
      Kn !== null && (Kn.status = "fulfilled");
      var t = Yl;
      Yl = null, _a = 0, Kn = null;
      for (var A = 0; A < t.length; A++) (0, t[A])();
    }
  }
  function iy(t, A) {
    var e = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        e.push(n);
      }
    };
    return t.then(
      function() {
        a.status = "fulfilled", a.value = A;
        for (var n = 0; n < e.length; n++) (0, e[n])(A);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < e.length; n++)
          (0, e[n])(void 0);
      }
    ), a;
  }
  var Zf = G.S;
  G.S = function(t, A) {
    if (Cm = MA(), typeof A == "object" && A !== null && typeof A.then == "function" && uy(t, A), Bl !== null)
      for (var e = _n; e !== null; )
        Gf(e, Bl), e = e.next;
    if (e = t.types, e !== null) {
      for (var a = _n; a !== null; )
        Gf(a, e), a = a.next;
      if (_a !== 0) {
        a = Bl, a === null && (a = Bl = []);
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          a.indexOf(l) === -1 && a.push(l);
        }
      }
    }
    Zf !== null && Zf(t, A);
  };
  var $a = oA(null);
  function ao() {
    var t = $a.current;
    return t !== null ? t : Ht.pooledCache;
  }
  function ai(t, A) {
    A === null ? wt($a, $a.current) : wt($a, A.pool);
  }
  function Qf() {
    var t = ao();
    return t === null ? null : { parent: aA._currentValue, pool: t };
  }
  var wn = Error(r(460)), no = Error(r(474)), ni = Error(r(542)), li = { then: function() {
  } };
  function Jf(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Wf(t, A, e) {
    switch (e = t[e], e === void 0 ? t.push(A) : e !== A && (A.then(Ne, Ne), A = e), A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw t = A.reason, Xf(t), t === void 0 && !("reason" in A) ? Error(r(600)) : t;
      default:
        if (typeof A.status == "string") A.then(Ne, Ne);
        else {
          if (t = Ht, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = A, t.status = "pending", t.then(
            function(a) {
              if (A.status === "pending") {
                var n = A;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (A.status === "pending") {
                var n = A;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw t = A.reason, Xf(t), t;
        }
        throw An = A, wn;
    }
  }
  function tn(t) {
    try {
      var A = t._init;
      return A(t._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (An = e, wn) : e;
    }
  }
  var An = null;
  function Lf() {
    if (An === null) throw Error(r(459));
    var t = An;
    return An = null, t;
  }
  function Xf(t) {
    if (t === wn || t === ni)
      throw Error(r(483));
  }
  var Cn = null, Hl = 0;
  function ui(t) {
    var A = Hl;
    return Hl += 1, Cn === null && (Cn = []), Wf(Cn, t, A);
  }
  function ma(t, A) {
    A = A.props.ref, t.ref = A !== void 0 ? A : null;
  }
  function ii(t, A) {
    throw A.$$typeof === k ? Error(r(525)) : (t = Object.prototype.toString.call(A), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : t
      )
    ));
  }
  function If(t) {
    function A(N, b) {
      if (t) {
        var j = N.deletions;
        j === null ? (N.deletions = [b], N.flags |= 16) : j.push(b);
      }
    }
    function e(N, b) {
      if (!t) return null;
      for (; b !== null; )
        A(N, b), b = b.sibling;
      return null;
    }
    function a(N) {
      for (var b = /* @__PURE__ */ new Map(); N !== null; )
        N.key === null ? b.set(N.index, N) : b.set(N.key, N), N = N.sibling;
      return b;
    }
    function n(N, b) {
      return N = Qe(N, b), N.index = 0, N.sibling = null, N;
    }
    function l(N, b, j) {
      return N.index = j, t ? (j = N.alternate, j !== null ? (j = j.index, j < b ? (N.flags |= 2, b) : j) : (N.flags |= 134217730, b)) : (N.flags |= 1048576, b);
    }
    function o(N) {
      return t && N.alternate === null && (N.flags |= 134217730), N;
    }
    function f(N, b, j, V) {
      return b === null || b.tag !== 6 ? (b = Lr(j, N.mode, V), b.return = N, b) : (b = n(b, j), b.return = N, b);
    }
    function g(N, b, j, V) {
      var At = j.type;
      return At === jt ? (N = O(
        N,
        b,
        j.props.children,
        V,
        j.key
      ), ma(N, j), N) : b !== null && (b.elementType === At || typeof At == "object" && At !== null && At.$$typeof === Z && tn(At) === b.type) ? (b = n(b, j.props), ma(b, j), b.return = N, b) : (b = Iu(
        j.type,
        j.key,
        j.props,
        null,
        N.mode,
        V
      ), ma(b, j), b.return = N, b);
    }
    function T(N, b, j, V) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== j.containerInfo || b.stateNode.implementation !== j.implementation ? (b = Xr(j, N.mode, V), b.return = N, b) : (b = n(b, j.children || []), b.return = N, b);
    }
    function O(N, b, j, V, At) {
      return b === null || b.tag !== 7 ? (b = Wa(
        j,
        N.mode,
        V,
        At
      ), b.return = N, b) : (b = n(b, j), b.return = N, b);
    }
    function K(N, b, j) {
      if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
        return b = Lr(
          "" + b,
          N.mode,
          j
        ), b.return = N, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case mt:
            return j = Iu(
              b.type,
              b.key,
              b.props,
              null,
              N.mode,
              j
            ), ma(j, b), j.return = N, j;
          case Gt:
            return b = Xr(
              b,
              N.mode,
              j
            ), b.return = N, b;
          case Z:
            return b = tn(b), K(N, b, j);
        }
        if ($(b) || I(b))
          return b = Wa(
            b,
            N.mode,
            j,
            null
          ), b.return = N, b;
        if (typeof b.then == "function")
          return K(N, ui(b), j);
        if (b.$$typeof === Ut)
          return K(
            N,
            ei(N, b),
            j
          );
        ii(N, b);
      }
      return null;
    }
    function x(N, b, j, V) {
      var At = b !== null ? b.key : null;
      if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint")
        return At !== null ? null : f(N, b, "" + j, V);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case mt:
            return j.key === At ? g(N, b, j, V) : null;
          case Gt:
            return j.key === At ? T(N, b, j, V) : null;
          case Z:
            return j = tn(j), x(N, b, j, V);
        }
        if ($(j) || I(j))
          return At !== null ? null : O(N, b, j, V, null);
        if (typeof j.then == "function")
          return x(
            N,
            b,
            ui(j),
            V
          );
        if (j.$$typeof === Ut)
          return x(
            N,
            b,
            ei(N, j),
            V
          );
        ii(N, j);
      }
      return null;
    }
    function D(N, b, j, V, At) {
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return N = N.get(j) || null, f(b, N, "" + V, At);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case mt:
            return N = N.get(
              V.key === null ? j : V.key
            ) || null, g(b, N, V, At);
          case Gt:
            return N = N.get(
              V.key === null ? j : V.key
            ) || null, T(b, N, V, At);
          case Z:
            return V = tn(V), D(
              N,
              b,
              j,
              V,
              At
            );
        }
        if ($(V) || I(V))
          return N = N.get(j) || null, O(b, N, V, At, null);
        if (typeof V.then == "function")
          return D(
            N,
            b,
            j,
            ui(V),
            At
          );
        if (V.$$typeof === Ut)
          return D(
            N,
            b,
            j,
            ei(b, V),
            At
          );
        ii(b, V);
      }
      return null;
    }
    function L(N, b, j, V) {
      for (var At = null, Tt = null, ot = b, st = b = 0, uA = null; ot !== null && st < j.length; st++) {
        ot.index > st ? (uA = ot, ot = null) : uA = ot.sibling;
        var zt = x(
          N,
          ot,
          j[st],
          V
        );
        if (zt === null) {
          ot === null && (ot = uA);
          break;
        }
        t && ot && zt.alternate === null && A(N, ot), b = l(zt, b, st), Tt === null ? At = zt : Tt.sibling = zt, Tt = zt, ot = uA;
      }
      if (st === j.length)
        return e(N, ot), vt && Je(N, st), At;
      if (ot === null) {
        for (; st < j.length; st++)
          ot = K(N, j[st], V), ot !== null && (b = l(
            ot,
            b,
            st
          ), Tt === null ? At = ot : Tt.sibling = ot, Tt = ot);
        return vt && Je(N, st), At;
      }
      for (ot = a(ot); st < j.length; st++)
        uA = D(
          ot,
          N,
          st,
          j[st],
          V
        ), uA !== null && (t && (zt = uA.alternate, zt !== null && ot.delete(zt.key === null ? st : zt.key)), b = l(
          uA,
          b,
          st
        ), Tt === null ? At = uA : Tt.sibling = uA, Tt = uA);
      return t && ot.forEach(function(Va) {
        return A(N, Va);
      }), vt && Je(N, st), At;
    }
    function lt(N, b, j, V) {
      if (j == null) throw Error(r(151));
      for (var At = null, Tt = null, ot = b, st = b = 0, uA = null, zt = j.next(); ot !== null && !zt.done; st++, zt = j.next()) {
        ot.index > st ? (uA = ot, ot = null) : uA = ot.sibling;
        var Va = x(N, ot, zt.value, V);
        if (Va === null) {
          ot === null && (ot = uA);
          break;
        }
        t && ot && Va.alternate === null && A(N, ot), b = l(Va, b, st), Tt === null ? At = Va : Tt.sibling = Va, Tt = Va, ot = uA;
      }
      if (zt.done)
        return e(N, ot), vt && Je(N, st), At;
      if (ot === null) {
        for (; !zt.done; st++, zt = j.next())
          zt = K(N, zt.value, V), zt !== null && (b = l(zt, b, st), Tt === null ? At = zt : Tt.sibling = zt, Tt = zt);
        return vt && Je(N, st), At;
      }
      for (ot = a(ot); !zt.done; st++, zt = j.next())
        zt = D(ot, N, st, zt.value, V), zt !== null && (t && (uA = zt.alternate, uA !== null && ot.delete(
          uA.key === null ? st : uA.key
        )), b = l(zt, b, st), Tt === null ? At = zt : Tt.sibling = zt, Tt = zt);
      return t && ot.forEach(function(H1) {
        return A(N, H1);
      }), vt && Je(N, st), At;
    }
    function yt(N, b, j, V) {
      if (typeof j == "object" && j !== null && j.type === jt && j.key === null && j.props.ref === void 0 && (j = j.props.children), typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case mt:
            t: {
              for (var At = j.key; b !== null; ) {
                if (b.key === At) {
                  if (At = j.type, At === jt) {
                    if (b.tag === 7) {
                      e(
                        N,
                        b.sibling
                      ), V = n(
                        b,
                        j.props.children
                      ), ma(V, j), V.return = N, N = V;
                      break t;
                    }
                  } else if (b.elementType === At || typeof At == "object" && At !== null && At.$$typeof === Z && tn(At) === b.type) {
                    e(
                      N,
                      b.sibling
                    ), V = n(b, j.props), ma(V, j), V.return = N, N = V;
                    break t;
                  }
                  e(N, b);
                  break;
                } else A(N, b);
                b = b.sibling;
              }
              j.type === jt ? (V = Wa(
                j.props.children,
                N.mode,
                V,
                j.key
              ), ma(V, j), V.return = N, N = V) : (V = Iu(
                j.type,
                j.key,
                j.props,
                null,
                N.mode,
                V
              ), ma(V, j), V.return = N, N = V);
            }
            return o(N);
          case Gt:
            t: {
              for (At = j.key; b !== null; ) {
                if (b.key === At)
                  if (b.tag === 4 && b.stateNode.containerInfo === j.containerInfo && b.stateNode.implementation === j.implementation) {
                    e(
                      N,
                      b.sibling
                    ), V = n(b, j.children || []), V.return = N, N = V;
                    break t;
                  } else {
                    e(N, b);
                    break;
                  }
                else A(N, b);
                b = b.sibling;
              }
              V = Xr(j, N.mode, V), V.return = N, N = V;
            }
            return o(N);
          case Z:
            return j = tn(j), yt(
              N,
              b,
              j,
              V
            );
        }
        if ($(j))
          return L(
            N,
            b,
            j,
            V
          );
        if (I(j)) {
          if (At = I(j), typeof At != "function") throw Error(r(150));
          return j = At.call(j), lt(
            N,
            b,
            j,
            V
          );
        }
        if (typeof j.then == "function")
          return yt(
            N,
            b,
            ui(j),
            V
          );
        if (j.$$typeof === Ut)
          return yt(
            N,
            b,
            ei(N, j),
            V
          );
        ii(N, j);
      }
      return typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint" ? (j = "" + j, b !== null && b.tag === 6 ? (e(N, b.sibling), V = n(b, j), V.return = N, N = V) : (e(N, b), V = Lr(j, N.mode, V), V.return = N, N = V), o(N)) : e(N, b);
    }
    return function(N, b, j, V) {
      try {
        Hl = 0;
        var At = yt(
          N,
          b,
          j,
          V
        );
        return Cn = null, At;
      } catch (ot) {
        if (ot === wn || ot === ni) throw ot;
        var Tt = CA(29, ot, null, N.mode);
        return Tt.lanes = V, Tt.return = N, Tt;
      } finally {
      }
    };
  }
  var en = If(!0), Pf = If(!1), pa = !1;
  function lo(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function uo(t, A) {
    t = t.updateQueue, A.updateQueue === t && (A.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function ga(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ha(t, A, e) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Ot & 2) !== 0) {
      var n = a.pending;
      return n === null ? A.next = A : (A.next = n.next, n.next = A), a.pending = A, A = Xu(t), Kf(t, null, e), A;
    }
    return Lu(t, a, A, e), Xu(t);
  }
  function Gl(t, A, e) {
    if (A = A.updateQueue, A !== null && (A = A.shared, (e & 4194048) !== 0)) {
      var a = A.lanes;
      a &= t.pendingLanes, e |= a, A.lanes = e, qs(t, e);
    }
  }
  function io(t, A) {
    var e = t.updateQueue, a = t.alternate;
    if (a !== null && (a = a.updateQueue, e === a)) {
      var n = null, l = null;
      if (e = e.firstBaseUpdate, e !== null) {
        do {
          var o = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null
          };
          l === null ? n = l = o : l = l.next = o, e = e.next;
        } while (e !== null);
        l === null ? n = l = A : l = l.next = A;
      } else n = l = A;
      e = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: l,
        shared: a.shared,
        callbacks: a.callbacks
      }, t.updateQueue = e;
      return;
    }
    t = e.lastBaseUpdate, t === null ? e.firstBaseUpdate = A : t.next = A, e.lastBaseUpdate = A;
  }
  var ro = !1;
  function Fl() {
    if (ro) {
      var t = Kn;
      if (t !== null) throw t;
    }
  }
  function Zl(t, A, e, a) {
    ro = !1;
    var n = t.updateQueue;
    pa = !1;
    var l = n.firstBaseUpdate, o = n.lastBaseUpdate, f = n.shared.pending;
    if (f !== null) {
      n.shared.pending = null;
      var g = f, T = g.next;
      g.next = null, o === null ? l = T : o.next = T, o = g;
      var O = t.alternate;
      O !== null && (O = O.updateQueue, f = O.lastBaseUpdate, f !== o && (f === null ? O.firstBaseUpdate = T : f.next = T, O.lastBaseUpdate = g));
    }
    if (l !== null) {
      var K = n.baseState;
      o = 0, O = T = g = null, f = l;
      do {
        var x = f.lane & -536870913, D = x !== f.lane;
        if (D ? (Nt & x) === x : (a & x) === x) {
          x !== 0 && x === _a && (ro = !0), O !== null && (O = O.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          t: {
            var L = t, lt = f;
            x = A;
            var yt = e;
            switch (lt.tag) {
              case 1:
                if (L = lt.payload, typeof L == "function") {
                  K = L.call(yt, K, x);
                  break t;
                }
                K = L;
                break t;
              case 3:
                L.flags = L.flags & -65537 | 128;
              case 0:
                if (L = lt.payload, x = typeof L == "function" ? L.call(yt, K, x) : L, x == null) break t;
                K = P({}, K, x);
                break t;
              case 2:
                pa = !0;
            }
          }
          x = f.callback, x !== null && (t.flags |= 64, D && (t.flags |= 8192), D = n.callbacks, D === null ? n.callbacks = [x] : D.push(x));
        } else
          D = {
            lane: x,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, O === null ? (T = O = D, g = K) : O = O.next = D, o |= x;
        if (f = f.next, f === null) {
          if (f = n.shared.pending, f === null)
            break;
          D = f, f = D.next, D.next = null, n.lastBaseUpdate = D, n.shared.pending = null;
        }
      } while (!0);
      O === null && (g = K), n.baseState = g, n.firstBaseUpdate = T, n.lastBaseUpdate = O, l === null && (n.shared.lanes = 0), Ta |= o, t.lanes = o, t.memoizedState = K;
    }
  }
  function _f(t, A) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(A);
  }
  function $f(t, A) {
    var e = t.callbacks;
    if (e !== null)
      for (t.callbacks = null, t = 0; t < e.length; t++)
        _f(e[t], A);
  }
  var ya = oA(null), ri = oA(0);
  function td(t, A) {
    t = $e, wt(ri, t), wt(ya, A), $e = t | A.baseLanes;
  }
  function oo() {
    wt(ri, $e), wt(ya, ya.current);
  }
  function co() {
    $e = ri.current, Kt(ya), Kt(ri);
  }
  var vA = oA(null), UA = null;
  function va(t) {
    var A = t.alternate;
    wt(bA, bA.current & 1), wt(vA, t), UA === null && (A === null || ya.current !== null || A.memoizedState !== null) && (UA = t);
  }
  function so(t) {
    wt(bA, bA.current), wt(vA, t), UA === null && (UA = t);
  }
  function Ad(t) {
    t.tag === 22 ? (wt(bA, bA.current), wt(vA, t), UA === null && (UA = t)) : ba();
  }
  function ba() {
    wt(bA, bA.current), wt(vA, vA.current);
  }
  function JA(t) {
    Kt(vA), UA === t && (UA = null), Kt(bA);
  }
  var bA = oA(0);
  function Ql(t, A) {
    wt(vA, vA.current), wt(bA, A);
  }
  function fo(t) {
    Kt(bA), Kt(vA), UA === t && (UA = null);
  }
  function oi(t) {
    for (var A = t; A !== null; ) {
      if (A.tag === 13) {
        var e = A.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || wc(e) || Cc(e)))
          return A;
      } else if (A.tag === 19 && A.memoizedProps.revealOrder !== "independent") {
        if ((A.flags & 128) !== 0) return A;
      } else if (A.child !== null) {
        A.child.return = A, A = A.child;
        continue;
      }
      if (A === t) break;
      for (; A.sibling === null; ) {
        if (A.return === null || A.return === t) return null;
        A = A.return;
      }
      A.sibling.return = A.return, A = A.sibling;
    }
    return null;
  }
  var Xe = 0, ht = null, Yt = null, nA = null, ci = !1, qn = !1, an = !1, si = 0, Jl = 0, kn = null, ry = 0;
  function Pt() {
    throw Error(r(321));
  }
  function mo(t, A) {
    if (A === null) return !1;
    for (var e = 0; e < A.length && e < t.length; e++)
      if (!QA(t[e], A[e])) return !1;
    return !0;
  }
  function po(t, A, e, a, n, l) {
    return Xe = l, ht = A, A.memoizedState = null, A.updateQueue = null, A.lanes = 0, G.H = t === null || t.memoizedState === null ? kd : Bd, an = !1, l = e(a, n), an = !1, qn && (l = ad(
      A,
      e,
      a,
      n
    )), ed(t), l;
  }
  function ed(t) {
    G.H = yi;
    var A = Yt !== null && Yt.next !== null;
    if (Xe = 0, nA = Yt = ht = null, ci = !1, Jl = 0, kn = null, A) throw Error(r(300));
    t === null || lA || (t = t.dependencies, t !== null && Ai(t) && (lA = !0));
  }
  function ad(t, A, e, a) {
    ht = t;
    var n = 0;
    do {
      if (qn && (kn = null), Jl = 0, qn = !1, 25 <= n) throw Error(r(301));
      if (n += 1, nA = Yt = null, t.updateQueue != null) {
        var l = t.updateQueue;
        l.lastEffect = null, l.events = null, l.stores = null, l.memoCache != null && (l.memoCache.index = 0);
      }
      G.H = gy, l = A(e, a);
    } while (qn);
    return l;
  }
  function oy() {
    var t = G.H, A = t.useState()[0];
    return A = typeof A.then == "function" ? Wl(A) : A, t = t.useState()[0], (Yt !== null ? Yt.memoizedState : null) !== t && (ht.flags |= 1024), A;
  }
  function go() {
    var t = si !== 0;
    return si = 0, t;
  }
  function ho(t, A, e) {
    A.updateQueue = t.updateQueue, A.flags &= -2053, t.lanes &= ~e;
  }
  function yo(t) {
    if (ci) {
      for (t = t.memoizedState; t !== null; ) {
        var A = t.queue;
        A !== null && (A.pending = null), t = t.next;
      }
      ci = !1;
    }
    Xe = 0, nA = Yt = ht = null, qn = !1, Jl = si = 0, kn = null;
  }
  function DA() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return nA === null ? ht.memoizedState = nA = t : nA = nA.next = t, nA;
  }
  function $t() {
    if (Yt === null) {
      var t = ht.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Yt.next;
    var A = nA === null ? ht.memoizedState : nA.next;
    if (A !== null)
      nA = A, Yt = t;
    else {
      if (t === null)
        throw ht.alternate === null ? Error(r(467)) : Error(r(310));
      Yt = t, t = {
        memoizedState: Yt.memoizedState,
        baseState: Yt.baseState,
        baseQueue: Yt.baseQueue,
        queue: Yt.queue,
        next: null
      }, nA === null ? ht.memoizedState = nA = t : nA = nA.next = t;
    }
    return nA;
  }
  function fi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Wl(t) {
    var A = Jl;
    return Jl += 1, kn === null && (kn = []), t = Wf(kn, t, A), A = ht, (nA === null ? A.memoizedState : nA.next) === null && (A = A.alternate, G.H = A === null || A.memoizedState === null ? kd : Bd), t;
  }
  function di(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Wl(t);
      if (t.$$typeof === E) return;
      if (t.$$typeof === Ut) return yA(t);
    }
    throw Error(r(438, String(t)));
  }
  function vo(t) {
    var A = null, e = ht.updateQueue;
    if (e !== null && (A = e.memoCache), A == null) {
      var a = ht.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (A = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (A == null && (A = { data: [], index: 0 }), e === null && (e = fi(), ht.updateQueue = e), e.memoCache = A, e = A.data[A.index], e === void 0)
      for (e = A.data[A.index] = Array(t), a = 0; a < t; a++)
        e[a] = iA;
    return A.index++, e;
  }
  function Ie(t, A) {
    return typeof A == "function" ? A(t) : A;
  }
  function mi(t) {
    var A = $t();
    return bo(A, Yt, t);
  }
  function bo(t, A, e) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var n = t.baseQueue, l = a.pending;
    if (l !== null) {
      if (n !== null) {
        var o = n.next;
        n.next = l.next, l.next = o;
      }
      A.baseQueue = n = l, a.pending = null;
    }
    if (l = t.baseState, n === null) t.memoizedState = l;
    else {
      A = n.next;
      var f = o = null, g = null, T = A, O = !1;
      do {
        var K = T.lane & -536870913;
        if (K !== T.lane ? (Nt & K) === K : (Xe & K) === K) {
          var x = T.revertLane;
          if (x === 0)
            g !== null && (g = g.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), K === _a && (O = !0);
          else if ((Xe & x) === x) {
            T = T.next, x === _a && (O = !0);
            continue;
          } else
            K = {
              lane: 0,
              revertLane: T.revertLane,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }, g === null ? (f = g = K, o = l) : g = g.next = K, ht.lanes |= x, Ta |= x;
          K = T.action, an && e(l, K), l = T.hasEagerState ? T.eagerState : e(l, K);
        } else
          x = {
            lane: K,
            revertLane: T.revertLane,
            gesture: T.gesture,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, g === null ? (f = g = x, o = l) : g = g.next = x, ht.lanes |= K, Ta |= K;
        T = T.next;
      } while (T !== null && T !== A);
      if (g === null ? o = l : g.next = f, !QA(l, t.memoizedState) && (lA = !0, O && (e = Kn, e !== null)))
        throw e;
      t.memoizedState = l, t.baseState = o, t.baseQueue = g, a.lastRenderedState = l;
    }
    return n === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function So(t) {
    var A = $t(), e = A.queue;
    if (e === null) throw Error(r(311));
    e.lastRenderedReducer = t;
    var a = e.dispatch, n = e.pending, l = A.memoizedState;
    if (n !== null) {
      e.pending = null;
      var o = n = n.next;
      do
        l = t(l, o.action), o = o.next;
      while (o !== n);
      QA(l, A.memoizedState) || (lA = !0), A.memoizedState = l, A.baseQueue === null && (A.baseState = l), e.lastRenderedState = l;
    }
    return [l, a];
  }
  function nd(t, A, e) {
    var a = ht, n = $t(), l = vt;
    if (l) {
      if (e === void 0) throw Error(r(407));
      e = e();
    } else e = A();
    var o = !QA(
      (Yt || n).memoizedState,
      e
    );
    if (o && (n.memoizedState = e, lA = !0), n = n.queue, To(id.bind(null, a, n, t), [
      t
    ]), t = n.getSnapshot !== A || o || nA !== null && (nA.memoizedState.tag & 1) !== 0, Bn(
      t ? 9 : 8,
      { destroy: void 0 },
      ud.bind(null, a, n, e, A),
      null
    ), t) {
      if (a.flags |= 2048, Ht === null) throw Error(r(349));
      l || (Xe & 127) !== 0 || ld(a, A, e);
    }
    return e;
  }
  function ld(t, A, e) {
    t.flags |= 16384, t = { getSnapshot: A, value: e }, A = ht.updateQueue, A === null ? (A = fi(), ht.updateQueue = A, A.stores = [t]) : (e = A.stores, e === null ? A.stores = [t] : e.push(t));
  }
  function ud(t, A, e, a) {
    A.value = e, A.getSnapshot = a, rd(A) && od(t);
  }
  function id(t, A, e) {
    return e(function() {
      rd(A) && od(t);
    });
  }
  function rd(t) {
    var A = t.getSnapshot;
    t = t.value;
    try {
      var e = A();
      return !QA(t, e);
    } catch {
      return !0;
    }
  }
  function od(t) {
    var A = Ja(t, 2);
    A !== null && YA(A, t, 2);
  }
  function xo(t) {
    var A = DA();
    if (typeof t == "function") {
      var e = t;
      if (t = e(), an) {
        VA(!0);
        try {
          e();
        } finally {
          VA(!1);
        }
      }
    }
    return A.memoizedState = A.baseState = t, A.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ie,
      lastRenderedState: t
    }, A;
  }
  function cd(t, A, e, a) {
    return t.baseState = e, bo(
      t,
      Yt,
      typeof a == "function" ? a : Ie
    );
  }
  function cy(t, A, e, a, n) {
    if (hi(t)) throw Error(r(485));
    if (t = A.action, t !== null) {
      var l = {
        payload: n,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(o) {
          l.listeners.push(o);
        }
      };
      G.T !== null ? e(!0) : l.isTransition = !1, a(l), e = A.pending, e === null ? (l.next = A.pending = l, sd(A, l)) : (l.next = e.next, A.pending = e.next = l);
    }
  }
  function sd(t, A) {
    var e = A.action, a = A.payload, n = t.state;
    if (A.isTransition) {
      var l = G.T, o = {};
      o.types = l !== null ? l.types : null, G.T = o;
      try {
        var f = e(n, a), g = G.S;
        g !== null && g(o, f), fd(t, A, f);
      } catch (T) {
        No(t, A, T);
      } finally {
        l !== null && o.types !== null && (l.types = o.types), G.T = l;
      }
    } else
      try {
        l = e(n, a), fd(t, A, l);
      } catch (T) {
        No(t, A, T);
      }
  }
  function fd(t, A, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        dd(t, A, a);
      },
      function(a) {
        return No(t, A, a);
      }
    ) : dd(t, A, e);
  }
  function dd(t, A, e) {
    A.status = "fulfilled", A.value = e, md(A), t.state = e, A = t.pending, A !== null && (e = A.next, e === A ? t.pending = null : (e = e.next, A.next = e, sd(t, e)));
  }
  function No(t, A, e) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        A.status = "rejected", A.reason = e, md(A), A = A.next;
      while (A !== a);
    }
    t.action = null;
  }
  function md(t) {
    t = t.listeners;
    for (var A = 0; A < t.length; A++) (0, t[A])();
  }
  function pd(t, A) {
    return A;
  }
  function gd(t, A) {
    if (vt) {
      var e = Ht.formState;
      if (e !== null) {
        t: {
          var a = ht;
          if (vt) {
            if (Zt) {
              A: {
                for (var n = Zt, l = ue; n.nodeType !== 8; ) {
                  if (!l) {
                    n = null;
                    break A;
                  }
                  if (n = re(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break A;
                  }
                }
                l = n.data, n = l === "F!" || l === "F" ? n : null;
              }
              if (n) {
                Zt = re(
                  n.nextSibling
                ), a = n.data === "F!";
                break t;
              }
            }
            fa(a);
          }
          a = !1;
        }
        a && (A = e[0]);
      }
    }
    return e = DA(), e.memoizedState = e.baseState = A, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: pd,
      lastRenderedState: A
    }, e.queue = a, e = wd.bind(
      null,
      ht,
      a
    ), a.dispatch = e, a = xo(!1), l = Do.bind(
      null,
      ht,
      !1,
      a.queue
    ), a = DA(), n = {
      state: A,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = n, e = cy.bind(
      null,
      ht,
      n,
      l,
      e
    ), n.dispatch = e, a.memoizedState = t, [A, e, !1];
  }
  function hd(t) {
    var A = $t();
    return yd(A, Yt, t);
  }
  function yd(t, A, e) {
    if (A = bo(
      t,
      A,
      pd
    )[0], t = mi(Ie)[0], typeof A == "object" && A !== null && typeof A.then == "function")
      try {
        var a = Wl(A);
      } catch (o) {
        throw o === wn ? ni : o;
      }
    else a = A;
    A = $t();
    var n = A.queue, l = n.dispatch;
    return e !== A.memoizedState && (ht.flags |= 2048, Bn(
      9,
      { destroy: void 0 },
      sy.bind(null, n, e),
      null
    )), [a, l, t];
  }
  function sy(t, A) {
    t.action = A;
  }
  function vd(t) {
    var A = $t(), e = Yt;
    if (e !== null)
      return yd(A, e, t);
    $t(), A = A.memoizedState, e = $t();
    var a = e.queue.dispatch;
    return e.memoizedState = t, [A, a, !1];
  }
  function Bn(t, A, e, a) {
    return t = { tag: t, create: e, deps: a, inst: A, next: null }, A = ht.updateQueue, A === null && (A = fi(), ht.updateQueue = A), e = A.lastEffect, e === null ? A.lastEffect = t.next = t : (a = e.next, e.next = t, t.next = a, A.lastEffect = t), t;
  }
  function bd() {
    return $t().memoizedState;
  }
  function pi(t, A, e, a) {
    var n = DA();
    ht.flags |= t, n.memoizedState = Bn(
      1 | A,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function gi(t, A, e, a) {
    var n = $t();
    a = a === void 0 ? null : a;
    var l = n.memoizedState.inst;
    Yt !== null && a !== null && mo(a, Yt.memoizedState.deps) ? n.memoizedState = Bn(A, l, e, a) : (ht.flags |= t, n.memoizedState = Bn(
      1 | A,
      l,
      e,
      a
    ));
  }
  function Sd(t, A) {
    pi(8390656, 8, t, A);
  }
  function To(t, A) {
    gi(2048, 8, t, A);
  }
  function fy(t) {
    ht.flags |= 4;
    var A = ht.updateQueue;
    if (A === null)
      A = fi(), ht.updateQueue = A, A.events = [t];
    else {
      var e = A.events;
      e === null ? A.events = [t] : e.push(t);
    }
  }
  function xd(t) {
    var A = $t().memoizedState;
    return fy({ ref: A, nextImpl: t }), function() {
      if ((Ot & 2) !== 0) throw Error(r(440));
      return A.impl.apply(void 0, arguments);
    };
  }
  function Nd(t, A) {
    return gi(4, 2, t, A);
  }
  function Td(t, A) {
    return gi(4, 4, t, A);
  }
  function Ud(t, A) {
    if (typeof A == "function") {
      t = t();
      var e = A(t);
      return function() {
        typeof e == "function" ? e() : A(null);
      };
    }
    if (A != null)
      return t = t(), A.current = t, function() {
        A.current = null;
      };
  }
  function Md(t, A, e) {
    e = e != null ? e.concat([t]) : null, gi(4, 4, Ud.bind(null, A, t), e);
  }
  function Uo() {
  }
  function zd(t, A) {
    var e = $t();
    A = A === void 0 ? null : A;
    var a = e.memoizedState;
    return A !== null && mo(A, a[1]) ? a[0] : (e.memoizedState = [t, A], t);
  }
  function jd(t, A) {
    var e = $t();
    A = A === void 0 ? null : A;
    var a = e.memoizedState;
    if (A !== null && mo(A, a[1]))
      return a[0];
    if (a = t(), an) {
      VA(!0);
      try {
        t();
      } finally {
        VA(!1);
      }
    }
    return e.memoizedState = [a, A], a;
  }
  function Mo(t, A, e) {
    return e === void 0 || (Xe & 1073741824) !== 0 && (Nt & 261930) === 0 ? t.memoizedState = A : (t.memoizedState = e, t = km(), ht.lanes |= t, Ta |= t, e);
  }
  function Dd(t, A, e, a) {
    return QA(e, A) ? e : ya.current !== null ? (t = Mo(t, e, a), QA(t, A) || (lA = !0), t) : (Xe & 106) === 0 || (Xe & 1073741824) !== 0 && (Nt & 261930) === 0 ? (lA = !0, t.memoizedState = e) : (t = km(), ht.lanes |= t, Ta |= t, A);
  }
  function Rd(t, A, e, a, n) {
    var l = W.p;
    W.p = l !== 0 && 8 > l ? l : 8;
    var o = G.T, f = {};
    f.types = o !== null ? o.types : null, G.T = f, Do(t, !1, A, e);
    try {
      var g = n(), T = G.S;
      if (T !== null && T(f, g), g !== null && typeof g == "object" && typeof g.then == "function") {
        var O = iy(
          g,
          a
        );
        Ll(
          t,
          A,
          O,
          IA(t)
        );
      } else
        Ll(
          t,
          A,
          a,
          IA(t)
        );
    } catch (K) {
      Ll(
        t,
        A,
        { then: function() {
        }, status: "rejected", reason: K },
        IA()
      );
    } finally {
      W.p = l, o !== null && f.types !== null && (o.types = f.types), G.T = o;
    }
  }
  function dy() {
  }
  function zo(t, A, e, a) {
    if (t.tag !== 5) throw Error(r(476));
    var n = Od(t).queue;
    Rd(
      t,
      n,
      A,
      Mt,
      e === null ? dy : function() {
        return Ed(t), e(a);
      }
    );
  }
  function Od(t) {
    var A = t.memoizedState;
    if (A !== null) return A;
    A = {
      memoizedState: Mt,
      baseState: Mt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ie,
        lastRenderedState: Mt
      },
      next: null
    };
    var e = {};
    return A.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ie,
        lastRenderedState: e
      },
      next: null
    }, t.memoizedState = A, t = t.alternate, t !== null && (t.memoizedState = A), A;
  }
  function Ed(t) {
    var A = Od(t);
    A.next === null && (A = t.alternate.memoizedState), Ll(
      t,
      A.next.queue,
      {},
      IA()
    );
  }
  function jo() {
    return yA(nl);
  }
  function Vd() {
    return $t().memoizedState;
  }
  function Kd() {
    return $t().memoizedState;
  }
  function my(t) {
    for (var A = t.return; A !== null; ) {
      switch (A.tag) {
        case 24:
        case 3:
          var e = IA();
          t = ga(e);
          var a = ha(A, t, e);
          a !== null && (YA(a, A, e), Gl(a, A, e)), A = { cache: Ao() }, t.payload = A;
          return;
      }
      A = A.return;
    }
  }
  function py(t, A, e) {
    var a = IA();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, hi(t) ? Cd(A, e) : (e = Jr(t, A, e, a), e !== null && (YA(e, t, a), qd(e, A, a)));
  }
  function wd(t, A, e) {
    var a = IA();
    Ll(t, A, e, a);
  }
  function Ll(t, A, e, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (hi(t)) Cd(A, n);
    else {
      var l = t.alternate;
      if (t.lanes === 0 && (l === null || l.lanes === 0) && (l = A.lastRenderedReducer, l !== null))
        try {
          var o = A.lastRenderedState, f = l(o, e);
          if (n.hasEagerState = !0, n.eagerState = f, QA(f, o))
            return Lu(t, A, n, 0), Ht === null && Wu(), !1;
        } catch {
        } finally {
        }
      if (e = Jr(t, A, n, a), e !== null)
        return YA(e, t, a), qd(e, A, a), !0;
    }
    return !1;
  }
  function Do(t, A, e, a) {
    if (a = {
      lane: 2,
      revertLane: vc(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, hi(t)) {
      if (A) throw Error(r(479));
    } else
      A = Jr(
        t,
        e,
        a,
        2
      ), A !== null && YA(A, t, 2);
  }
  function hi(t) {
    var A = t.alternate;
    return t === ht || A !== null && A === ht;
  }
  function Cd(t, A) {
    qn = ci = !0;
    var e = t.pending;
    e === null ? A.next = A : (A.next = e.next, e.next = A), t.pending = A;
  }
  function qd(t, A, e) {
    if ((e & 4194048) !== 0) {
      var a = A.lanes;
      a &= t.pendingLanes, e |= a, A.lanes = e, qs(t, e);
    }
  }
  var yi = {
    readContext: yA,
    use: di,
    useCallback: Pt,
    useContext: Pt,
    useEffect: Pt,
    useImperativeHandle: Pt,
    useLayoutEffect: Pt,
    useInsertionEffect: Pt,
    useMemo: Pt,
    useReducer: Pt,
    useRef: Pt,
    useState: Pt,
    useDebugValue: Pt,
    useDeferredValue: Pt,
    useTransition: Pt,
    useSyncExternalStore: Pt,
    useId: Pt,
    useHostTransitionStatus: Pt,
    useFormState: Pt,
    useActionState: Pt,
    useOptimistic: Pt,
    useMemoCache: Pt,
    useCacheRefresh: Pt,
    useEffectEvent: Pt
  }, kd = {
    readContext: yA,
    use: di,
    useCallback: function(t, A) {
      return DA().memoizedState = [
        t,
        A === void 0 ? null : A
      ], t;
    },
    useContext: yA,
    useEffect: Sd,
    useImperativeHandle: function(t, A, e) {
      e = e != null ? e.concat([t]) : null, pi(
        4194308,
        4,
        Ud.bind(null, A, t),
        e
      );
    },
    useLayoutEffect: function(t, A) {
      return pi(4194308, 4, t, A);
    },
    useInsertionEffect: function(t, A) {
      pi(4, 2, t, A);
    },
    useMemo: function(t, A) {
      var e = DA();
      A = A === void 0 ? null : A;
      var a = t();
      if (an) {
        VA(!0);
        try {
          t();
        } finally {
          VA(!1);
        }
      }
      return e.memoizedState = [a, A], a;
    },
    useReducer: function(t, A, e) {
      var a = DA();
      if (e !== void 0) {
        var n = e(A);
        if (an) {
          VA(!0);
          try {
            e(A);
          } finally {
            VA(!1);
          }
        }
      } else n = A;
      return a.memoizedState = a.baseState = n, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: n
      }, a.queue = t, t = t.dispatch = py.bind(
        null,
        ht,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var A = DA();
      return t = { current: t }, A.memoizedState = t;
    },
    useState: function(t) {
      t = xo(t);
      var A = t.queue, e = wd.bind(null, ht, A);
      return A.dispatch = e, [t.memoizedState, e];
    },
    useDebugValue: Uo,
    useDeferredValue: function(t, A) {
      var e = DA();
      return Mo(e, t, A);
    },
    useTransition: function() {
      var t = xo(!1);
      return t = Rd.bind(
        null,
        ht,
        t.queue,
        !0,
        !1
      ), DA().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, A, e) {
      var a = ht, n = DA();
      if (vt) {
        if (e === void 0)
          throw Error(r(407));
        e = e();
      } else {
        if (e = A(), Ht === null)
          throw Error(r(349));
        (Nt & 127) !== 0 || ld(a, A, e);
      }
      n.memoizedState = e;
      var l = { value: e, getSnapshot: A };
      return n.queue = l, Sd(id.bind(null, a, l, t), [
        t
      ]), a.flags |= 2048, Bn(
        9,
        { destroy: void 0 },
        ud.bind(
          null,
          a,
          l,
          e,
          A
        ),
        null
      ), e;
    },
    useId: function() {
      var t = DA(), A = Ht.identifierPrefix;
      if (vt) {
        var e = Ue, a = Te;
        e = (a & ~(1 << 32 - Rt(a) - 1)).toString(32) + e, A = "_" + A + "R_" + e, e = si++, 0 < e && (A += "H" + e.toString(32)), A += "_";
      } else
        e = ry++, A = "_" + A + "r_" + e.toString(32) + "_";
      return t.memoizedState = A;
    },
    useHostTransitionStatus: jo,
    useFormState: gd,
    useActionState: gd,
    useOptimistic: function(t) {
      var A = DA();
      A.memoizedState = A.baseState = t;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return A.queue = e, A = Do.bind(
        null,
        ht,
        !0,
        e
      ), e.dispatch = A, [t, A];
    },
    useMemoCache: vo,
    useCacheRefresh: function() {
      return DA().memoizedState = my.bind(
        null,
        ht
      );
    },
    useEffectEvent: function(t) {
      var A = DA(), e = { impl: t };
      return A.memoizedState = e, function() {
        if ((Ot & 2) !== 0)
          throw Error(r(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, Bd = {
    readContext: yA,
    use: di,
    useCallback: zd,
    useContext: yA,
    useEffect: To,
    useImperativeHandle: Md,
    useInsertionEffect: Nd,
    useLayoutEffect: Td,
    useMemo: jd,
    useReducer: mi,
    useRef: bd,
    useState: function() {
      return mi(Ie);
    },
    useDebugValue: Uo,
    useDeferredValue: function(t, A) {
      var e = $t();
      return Dd(
        e,
        Yt.memoizedState,
        t,
        A
      );
    },
    useTransition: function() {
      var t = mi(Ie)[0], A = $t().memoizedState;
      return [
        typeof t == "boolean" ? t : Wl(t),
        A
      ];
    },
    useSyncExternalStore: nd,
    useId: Vd,
    useHostTransitionStatus: jo,
    useFormState: hd,
    useActionState: hd,
    useOptimistic: function(t, A) {
      var e = $t();
      return cd(e, Yt, t, A);
    },
    useMemoCache: vo,
    useCacheRefresh: Kd,
    useEffectEvent: xd
  }, gy = {
    readContext: yA,
    use: di,
    useCallback: zd,
    useContext: yA,
    useEffect: To,
    useImperativeHandle: Md,
    useInsertionEffect: Nd,
    useLayoutEffect: Td,
    useMemo: jd,
    useReducer: So,
    useRef: bd,
    useState: function() {
      return So(Ie);
    },
    useDebugValue: Uo,
    useDeferredValue: function(t, A) {
      var e = $t();
      return Yt === null ? Mo(e, t, A) : Dd(
        e,
        Yt.memoizedState,
        t,
        A
      );
    },
    useTransition: function() {
      var t = So(Ie)[0], A = $t().memoizedState;
      return [
        typeof t == "boolean" ? t : Wl(t),
        A
      ];
    },
    useSyncExternalStore: nd,
    useId: Vd,
    useHostTransitionStatus: jo,
    useFormState: vd,
    useActionState: vd,
    useOptimistic: function(t, A) {
      var e = $t();
      return Yt !== null ? cd(e, Yt, t, A) : (e.baseState = t, [t, e.queue.dispatch]);
    },
    useMemoCache: vo,
    useCacheRefresh: Kd,
    useEffectEvent: xd
  };
  function Ro(t, A, e, a) {
    A = t.memoizedState, e = e(a, A), e = e == null ? A : P({}, A, e), t.memoizedState = e, t.lanes === 0 && (t.updateQueue.baseState = e);
  }
  var Oo = {
    enqueueSetState: function(t, A, e) {
      t = t._reactInternals;
      var a = IA(), n = ga(a);
      n.payload = A, e != null && (n.callback = e), A = ha(t, n, a), A !== null && (YA(A, t, a), Gl(A, t, a));
    },
    enqueueReplaceState: function(t, A, e) {
      t = t._reactInternals;
      var a = IA(), n = ga(a);
      n.tag = 1, n.payload = A, e != null && (n.callback = e), A = ha(t, n, a), A !== null && (YA(A, t, a), Gl(A, t, a));
    },
    enqueueForceUpdate: function(t, A) {
      t = t._reactInternals;
      var e = IA(), a = ga(e);
      a.tag = 2, A != null && (a.callback = A), A = ha(t, a, e), A !== null && (YA(A, t, e), Gl(A, t, e));
    }
  };
  function Yd(t, A, e, a, n, l, o) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, l, o) : A.prototype && A.prototype.isPureReactComponent ? !Kl(e, a) || !Kl(n, l) : !0;
  }
  function Hd(t, A, e, a) {
    t = A.state, typeof A.componentWillReceiveProps == "function" && A.componentWillReceiveProps(e, a), typeof A.UNSAFE_componentWillReceiveProps == "function" && A.UNSAFE_componentWillReceiveProps(e, a), A.state !== t && Oo.enqueueReplaceState(A, A.state, null);
  }
  function nn(t, A) {
    var e = A;
    if ("ref" in A) {
      e = {};
      for (var a in A)
        a !== "ref" && (e[a] = A[a]);
    }
    if (t = t.defaultProps) {
      e === A && (e = P({}, e));
      for (var n in t)
        e[n] === void 0 && (e[n] = t[n]);
    }
    return e;
  }
  function Gd(t) {
    Ju(t);
  }
  function Fd(t) {
    console.error(t);
  }
  function Zd(t) {
    Ju(t);
  }
  function vi(t, A) {
    try {
      var e = t.onUncaughtError;
      e(A.value, { componentStack: A.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Qd(t, A, e) {
    try {
      var a = t.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: A.tag === 1 ? A.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Eo(t, A, e) {
    return e = ga(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      vi(t, A);
    }, e;
  }
  function Jd(t) {
    return t = ga(t), t.tag = 3, t;
  }
  function Wd(t, A, e, a) {
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = a.value;
      t.payload = function() {
        return n(l);
      }, t.callback = function() {
        Qd(A, e, a);
      };
    }
    var o = e.stateNode;
    o !== null && typeof o.componentDidCatch == "function" && (t.callback = function() {
      Qd(A, e, a), typeof n != "function" && (Ua === null ? Ua = /* @__PURE__ */ new Set([this]) : Ua.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function hy(t, A, e, a, n) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (A = e.alternate, A !== null && Ia(
        A,
        e,
        n,
        !0
      ), e = vA.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            return UA === null ? Yi() : e.alternate === null && _t === 0 && (_t = 3), e.flags &= -257, e.flags |= 65536, e.lanes = n, a === li ? e.flags |= 16384 : (A = e.updateQueue, A === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : A.add(a), gc(t, a, n)), !1;
          case 22:
            return e.flags |= 65536, a === li ? e.flags |= 16384 : (A = e.updateQueue, A === null ? (A = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = A) : (e = A.retryQueue, e === null ? A.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), gc(t, a, n)), !1;
        }
        throw Error(r(435, e.tag));
      }
      return gc(t, a, n), Yi(), !1;
    }
    if (vt)
      return A = vA.current, A !== null ? ((A.flags & 65536) === 0 && (A.flags |= 256), A.flags |= 65536, A.lanes = n, a !== Pr && (t = Error(r(422), { cause: a }), ql(ae(t, e)))) : (a !== Pr && (A = Error(r(423), {
        cause: a
      }), ql(
        ae(A, e)
      )), t = t.current.alternate, t.flags |= 65536, n &= -n, t.lanes |= n, a = ae(a, e), n = Eo(
        t.stateNode,
        a,
        n
      ), io(t, n), _t !== 4 && (_t = 2)), !1;
    var l = Error(r(520), { cause: a });
    if (l = ae(l, e), eu === null ? eu = [l] : eu.push(l), _t !== 4 && (_t = 2), A === null) return !0;
    a = ae(a, e), e = A;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, t = n & -n, e.lanes |= t, t = Eo(e.stateNode, a, t), io(e, t), !1;
        case 1:
          if (A = e.type, l = e.stateNode, (e.flags & 128) === 0 && (typeof A.getDerivedStateFromError == "function" || l !== null && typeof l.componentDidCatch == "function" && (Ua === null || !Ua.has(l))))
            return e.flags |= 65536, n &= -n, e.lanes |= n, n = Jd(n), Wd(
              n,
              t,
              e,
              a
            ), io(e, n), !1;
          break;
        case 22:
          if (e.memoizedState !== null)
            return e.flags |= 65536, !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var Vo = Error(r(461)), lA = !1;
  function cA(t, A, e, a) {
    A.child = t === null ? Pf(A, null, e, a) : en(
      A,
      t.child,
      e,
      a
    );
  }
  function Ld(t, A, e, a, n) {
    e = e.render;
    var l = A.ref;
    if ("ref" in a) {
      var o = {};
      for (var f in a)
        f !== "ref" && (o[f] = a[f]);
    } else o = a;
    return Pa(A), a = po(
      t,
      A,
      e,
      o,
      l,
      n
    ), f = go(), t !== null && !lA ? (ho(t, A, n), Pe(t, A, n)) : (vt && f && _u(A), A.flags |= 1, cA(t, A, a, n), A.child);
  }
  function Xd(t, A, e, a, n) {
    if (t === null) {
      var l = e.type;
      return typeof l == "function" && !Wr(l) && l.defaultProps === void 0 && e.compare === null ? (A.tag = 15, A.type = l, Id(
        t,
        A,
        l,
        a,
        n
      )) : (t = Iu(
        e.type,
        null,
        a,
        A,
        A.mode,
        n
      ), t.ref = A.ref, t.return = A, A.child = t);
    }
    if (l = t.child, !Ho(t, n)) {
      var o = l.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Kl, e(o, a) && t.ref === A.ref)
        return Pe(t, A, n);
    }
    return A.flags |= 1, t = Qe(l, a), t.ref = A.ref, t.return = A, A.child = t;
  }
  function Id(t, A, e, a, n) {
    if (t !== null) {
      var l = t.memoizedProps;
      if (Kl(l, a) && t.ref === A.ref)
        if (lA = !1, A.pendingProps = a = l, Ho(t, n))
          (t.flags & 131072) !== 0 && (lA = !0);
        else
          return A.lanes = t.lanes, Pe(t, A, n);
    }
    return Ko(
      t,
      A,
      e,
      a,
      n
    );
  }
  function Pd(t, A, e, a) {
    var n = a.children, l = t !== null ? t.memoizedState : null;
    if (t === null && A.stateNode === null && (A.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((A.flags & 128) !== 0) {
        if (l = l !== null ? l.baseLanes | e : e, t !== null) {
          for (a = A.child = t.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~l;
        } else a = 0, A.child = null;
        return _d(
          t,
          A,
          l,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        A.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && ai(
          A,
          l !== null ? l.cachePool : null
        ), l !== null ? td(A, l) : oo(), Ad(A);
      else
        return a = A.lanes = 536870912, _d(
          t,
          A,
          l !== null ? l.baseLanes | e : e,
          e,
          a
        );
    } else
      l !== null ? (ai(A, l.cachePool), td(A, l), ba(), A.memoizedState = null) : (t !== null && ai(A, null), oo(), ba());
    return cA(t, A, n, e), A.child;
  }
  function Xl(t, A) {
    return t !== null && t.tag === 22 || A.stateNode !== null || (A.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), A.sibling;
  }
  function _d(t, A, e, a, n) {
    var l = ao();
    return l = l === null ? null : { parent: aA._currentValue, pool: l }, A.memoizedState = {
      baseLanes: e,
      cachePool: l
    }, t !== null && ai(A, null), oo(), Ad(A), t !== null && Ia(t, A, a, !0), A.childLanes = n, null;
  }
  function bi(t, A) {
    return A = Si(
      { mode: A.mode, children: A.children },
      t.mode
    ), A.ref = t.ref, t.child = A, A.return = t, A;
  }
  function $d(t, A, e) {
    return en(A, t.child, null, e), t = bi(A, A.pendingProps), t.flags |= 2, JA(A), A.memoizedState = null, t;
  }
  function yy(t, A, e) {
    var a = A.pendingProps, n = (A.flags & 128) !== 0;
    if (A.flags &= -129, t === null) {
      if (vt) {
        if (a.mode === "hidden")
          return t = bi(A, a), A.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, Xl(null, t);
        if (so(A), (t = Zt) ? (t = U0(
          t,
          ue
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (A.memoizedState = {
          dehydrated: t,
          treeContext: ca !== null ? { id: Te, overflow: Ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Cf(t), e.return = A, A.child = e, dA = A, Zt = null)) : t = null, t === null) throw fa(A);
        return A.lanes = 536870912, null;
      }
      return bi(A, a);
    }
    var l = t.memoizedState;
    if (l !== null) {
      var o = l.dehydrated;
      if (so(A), n)
        if (A.flags & 256)
          A.flags &= -257, A = $d(
            t,
            A,
            e
          );
        else if (A.memoizedState !== null)
          A.child = t.child, A.flags |= 128, A = null;
        else throw Error(r(558));
      else if (lA || Ia(t, A, e, !1), n = (e & t.childLanes) !== 0, lA || n) {
        if (ya.current === null) {
          if (a = Ht, a !== null && (o = ks(a, e), o !== 0 && o !== l.retryLane))
            throw l.retryLane = o, Ja(t, o), YA(a, t, o), Vo;
          Yi();
        }
        A = $d(
          t,
          A,
          e
        );
      } else
        t = l.treeContext, Zt = re(o.nextSibling), dA = A, vt = !0, sa = null, ue = !1, t !== null && Bf(A, t), A = bi(A, a), A.flags |= 134221824;
      return A;
    }
    return t = Qe(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = A.ref, A.child = t, t.return = A, t;
  }
  function Yn(t, A) {
    var e = A.ref;
    if (e === null)
      t !== null && t.ref !== null && (A.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(r(284));
      (t === null || t.ref !== e) && (A.flags |= 4194816);
    }
  }
  function Ko(t, A, e, a, n) {
    return Pa(A), e = po(
      t,
      A,
      e,
      a,
      void 0,
      n
    ), a = go(), t !== null && !lA ? (ho(t, A, n), Pe(t, A, n)) : (vt && a && _u(A), A.flags |= 1, cA(t, A, e, n), A.child);
  }
  function tm(t, A, e, a, n, l) {
    return Pa(A), A.updateQueue = null, e = ad(
      A,
      a,
      e,
      n
    ), ed(t), a = go(), t !== null && !lA ? (ho(t, A, l), Pe(t, A, l)) : (vt && a && _u(A), A.flags |= 1, cA(t, A, e, l), A.child);
  }
  function Am(t, A, e, a, n) {
    if (Pa(A), A.stateNode === null) {
      var l = Rn, o = e.contextType;
      typeof o == "object" && o !== null && (l = yA(o)), l = new e(a, l), A.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, l.updater = Oo, A.stateNode = l, l._reactInternals = A, l = A.stateNode, l.props = a, l.state = A.memoizedState, l.refs = {}, lo(A), o = e.contextType, l.context = typeof o == "object" && o !== null ? yA(o) : Rn, l.state = A.memoizedState, o = e.getDerivedStateFromProps, typeof o == "function" && (Ro(
        A,
        e,
        o,
        a
      ), l.state = A.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (o = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), o !== l.state && Oo.enqueueReplaceState(l, l.state, null), Zl(A, a, l, n), Fl(), l.state = A.memoizedState), typeof l.componentDidMount == "function" && (A.flags |= 4194308), a = !0;
    } else if (t === null) {
      l = A.stateNode;
      var f = A.memoizedProps, g = nn(e, f);
      l.props = g;
      var T = l.context, O = e.contextType;
      o = Rn, typeof O == "object" && O !== null && (o = yA(O));
      var K = e.getDerivedStateFromProps;
      O = typeof K == "function" || typeof l.getSnapshotBeforeUpdate == "function", f = A.pendingProps !== f, O || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (f || T !== o) && Hd(
        A,
        l,
        a,
        o
      ), pa = !1;
      var x = A.memoizedState;
      l.state = x, Zl(A, a, l, n), Fl(), T = A.memoizedState, f || x !== T || pa ? (typeof K == "function" && (Ro(
        A,
        e,
        K,
        a
      ), T = A.memoizedState), (g = pa || Yd(
        A,
        e,
        g,
        a,
        x,
        T,
        o
      )) ? (O || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount()), typeof l.componentDidMount == "function" && (A.flags |= 4194308)) : (typeof l.componentDidMount == "function" && (A.flags |= 4194308), A.memoizedProps = a, A.memoizedState = T), l.props = a, l.state = T, l.context = o, a = g) : (typeof l.componentDidMount == "function" && (A.flags |= 4194308), a = !1);
    } else {
      l = A.stateNode, uo(t, A), o = A.memoizedProps, O = nn(e, o), l.props = O, K = A.pendingProps, x = l.context, T = e.contextType, g = Rn, typeof T == "object" && T !== null && (g = yA(T)), f = e.getDerivedStateFromProps, (T = typeof f == "function" || typeof l.getSnapshotBeforeUpdate == "function") || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (o !== K || x !== g) && Hd(
        A,
        l,
        a,
        g
      ), pa = !1, x = A.memoizedState, l.state = x, Zl(A, a, l, n), Fl();
      var D = A.memoizedState;
      o !== K || x !== D || pa || t !== null && t.dependencies !== null && Ai(t.dependencies) ? (typeof f == "function" && (Ro(
        A,
        e,
        f,
        a
      ), D = A.memoizedState), (O = pa || Yd(
        A,
        e,
        O,
        a,
        x,
        D,
        g
      ) || t !== null && t.dependencies !== null && Ai(t.dependencies)) ? (T || typeof l.UNSAFE_componentWillUpdate != "function" && typeof l.componentWillUpdate != "function" || (typeof l.componentWillUpdate == "function" && l.componentWillUpdate(a, D, g), typeof l.UNSAFE_componentWillUpdate == "function" && l.UNSAFE_componentWillUpdate(
        a,
        D,
        g
      )), typeof l.componentDidUpdate == "function" && (A.flags |= 4), typeof l.getSnapshotBeforeUpdate == "function" && (A.flags |= 1024)) : (typeof l.componentDidUpdate != "function" || o === t.memoizedProps && x === t.memoizedState || (A.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === t.memoizedProps && x === t.memoizedState || (A.flags |= 1024), A.memoizedProps = a, A.memoizedState = D), l.props = a, l.state = D, l.context = g, a = O) : (typeof l.componentDidUpdate != "function" || o === t.memoizedProps && x === t.memoizedState || (A.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === t.memoizedProps && x === t.memoizedState || (A.flags |= 1024), a = !1);
    }
    return l = a, Yn(t, A), a = (A.flags & 128) !== 0, l || a ? (l = A.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : l.render(), A.flags |= 1, t !== null && a ? (A.child = en(
      A,
      t.child,
      null,
      n
    ), A.child = en(
      A,
      null,
      e,
      n
    )) : cA(t, A, e, n), A.memoizedState = l.state, t = A.child) : t = Pe(
      t,
      A,
      n
    ), t;
  }
  function em(t, A, e, a) {
    return La(), A.flags |= 256, cA(t, A, e, a), A.child;
  }
  var wo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Co(t) {
    return { baseLanes: t, cachePool: Qf() };
  }
  function qo(t, A, e) {
    return t = t !== null ? t.childLanes & ~e : 0, A && (t |= XA), t;
  }
  function am(t, A, e) {
    var a = A.pendingProps, n = !1, l = (A.flags & 128) !== 0, o;
    if ((o = l) || (o = t !== null && t.memoizedState === null ? !1 : (bA.current & 2) !== 0), o && (n = !0, A.flags &= -129), o = (A.flags & 32) !== 0, A.flags &= -33, t === null) {
      if (vt) {
        if (n ? va(A) : ba(), (t = Zt) ? (t = U0(
          t,
          ue
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (A.memoizedState = {
          dehydrated: t,
          treeContext: ca !== null ? { id: Te, overflow: Ue } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = Cf(t), e.return = A, A.child = e, dA = A, Zt = null)) : t = null, t === null) throw fa(A);
        return Cc(t) ? A.lanes = 32 : A.lanes = 536870912, null;
      }
      return l = a.children, a = a.fallback, n ? (ba(), n = A.mode, l = Si(
        { mode: "hidden", children: l },
        n
      ), a = Wa(
        a,
        n,
        e,
        null
      ), l.return = A, a.return = A, l.sibling = a, A.child = l, a = A.child, a.memoizedState = Co(e), a.childLanes = qo(
        t,
        o,
        e
      ), A.memoizedState = wo, Xl(null, a)) : (va(A), ko(A, l));
    }
    var f = t.memoizedState;
    if (f !== null) {
      var g = f.dehydrated;
      if (g !== null)
        return vy(
          t,
          A,
          l,
          o,
          a,
          g,
          f,
          e
        );
    }
    return n ? (ba(), n = a.fallback, l = A.mode, f = t.child, g = f.sibling, a = Qe(f, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = f.subtreeFlags & 1206910976, g !== null ? n = Qe(g, n) : (n = Wa(
      n,
      l,
      e,
      null
    ), n.flags |= 2), n.return = A, a.return = A, a.sibling = n, A.child = a, Xl(null, a), a = A.child, n = t.child.memoizedState, n === null ? n = Co(e) : (l = n.cachePool, l !== null ? (f = aA._currentValue, l = l.parent !== f ? { parent: f, pool: f } : l) : l = Qf(), n = {
      baseLanes: n.baseLanes | e,
      cachePool: l
    }), a.memoizedState = n, a.childLanes = qo(
      t,
      o,
      e
    ), A.memoizedState = wo, Xl(t.child, a)) : (va(A), e = t.child, t = e.sibling, e = Qe(e, {
      mode: "visible",
      children: a.children
    }), e.return = A, e.sibling = null, t !== null && (o = A.deletions, o === null ? (A.deletions = [t], A.flags |= 16) : o.push(t)), A.child = e, A.memoizedState = null, e);
  }
  function ko(t, A) {
    return A = Si(
      { mode: "visible", children: A },
      t.mode
    ), A.return = t, t.child = A;
  }
  function Si(t, A) {
    return t = CA(22, t, null, A), t.lanes = 0, t;
  }
  function xi(t, A, e) {
    return en(A, t.child, null, e), t = ko(
      A,
      A.pendingProps.children
    ), t.flags |= 2, A.memoizedState = null, t;
  }
  function vy(t, A, e, a, n, l, o, f) {
    if (e)
      return A.flags & 256 ? (va(A), A.flags &= -257, xi(
        t,
        A,
        f
      )) : A.memoizedState !== null ? (ba(), A.child = t.child, A.flags |= 128, null) : (ba(), l = n.fallback, o = A.mode, n = Si(
        { mode: "visible", children: n.children },
        o
      ), l = Wa(
        l,
        o,
        f,
        null
      ), l.flags |= 2, n.return = A, l.return = A, n.sibling = l, A.child = n, en(A, t.child, null, f), n = A.child, n.memoizedState = Co(f), n.childLanes = qo(
        t,
        a,
        f
      ), A.memoizedState = wo, Xl(null, n));
    if (va(A), Cc(l)) {
      if (a = l.nextSibling && l.nextSibling.dataset, a) var g = a.dgst;
      return a = g, a !== "" && (n = Error(r(419)), n.stack = "", n.digest = a, ql({ value: n, source: null, stack: null })), xi(
        t,
        A,
        f
      );
    }
    if (lA || Ia(t, A, f, !1), a = (f & t.childLanes) !== 0, lA || a) {
      if (ya.current !== null)
        return xi(
          t,
          A,
          f
        );
      if (a = Ht, a !== null && (n = ks(
        a,
        f
      ), n !== 0 && n !== o.retryLane))
        throw o.retryLane = n, Ja(t, n), YA(a, t, n), Vo;
      return wc(l) || Yi(), xi(
        t,
        A,
        f
      );
    }
    return wc(l) ? (A.flags |= 192, A.child = t.child, null) : (t = o.treeContext, Zt = re(l.nextSibling), dA = A, vt = !0, sa = null, ue = !1, t !== null && Bf(A, t), A = ko(
      A,
      n.children
    ), A.flags |= 134221824, A);
  }
  function nm(t, A, e) {
    t.lanes |= A;
    var a = t.alternate;
    a !== null && (a.lanes |= A), ti(t.return, A, e);
  }
  function lm(t) {
    for (var A = null; t !== null; ) {
      var e = t.alternate;
      e !== null && oi(e) === null && (A = t), t = t.sibling;
    }
    return A;
  }
  function Ni(t, A, e, a, n, l) {
    var o = t.memoizedState;
    o === null ? t.memoizedState = {
      isBackwards: A,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: e,
      tailMode: n,
      treeForkCount: l
    } : (o.isBackwards = A, o.rendering = null, o.renderingStartTime = 0, o.last = a, o.tail = e, o.tailMode = n, o.treeForkCount = l);
  }
  function Bo(t) {
    var A = t.child;
    for (t.child = null; A !== null; ) {
      var e = A.sibling;
      A.sibling = t.child, t.child = A, A = e;
    }
  }
  function Yo(t, A, e) {
    var a = A.pendingProps, n = a.revealOrder, l = a.tail;
    a = a.children;
    var o = bA.current;
    if (A.flags & 128)
      return Ql(A, o), null;
    var f = (o & 2) !== 0;
    if (f ? (o = o & 1 | 2, A.flags |= 128) : o &= 1, Ql(A, o), n === "backwards" && t !== null ? (Bo(t), cA(t, A, a, e), Bo(t)) : cA(t, A, a, e), a = vt ? Cl : 0, !f && t !== null && (t.flags & 128) !== 0)
      t: for (t = A.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && nm(t, e, A);
        else if (t.tag === 19)
          nm(t, e, A);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === A) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === A)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (n) {
      case "backwards":
        e = lm(A.child), e === null ? (n = A.child, A.child = null) : (n = e.sibling, e.sibling = null, Bo(A)), Ni(
          A,
          !0,
          n,
          null,
          l,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (e = null, n = A.child, A.child = null; n !== null; ) {
          if (t = n.alternate, t !== null && oi(t) === null) {
            A.child = n;
            break;
          }
          t = n.sibling, n.sibling = e, e = n, n = t;
        }
        Ni(
          A,
          !0,
          e,
          null,
          l,
          a
        );
        break;
      case "together":
        Ni(
          A,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        A.memoizedState = null;
        break;
      default:
        e = lm(A.child), e === null ? (n = A.child, A.child = null) : (n = e.sibling, e.sibling = null), Ni(
          A,
          !1,
          n,
          e,
          l,
          a
        );
    }
    return A.child;
  }
  function um(t, A, e) {
    var a = A.pendingProps;
    return da(A, A.type, a.value), cA(t, A, a.children, e), A.child;
  }
  function Pe(t, A, e) {
    if (t !== null && (A.dependencies = t.dependencies), Ta |= A.lanes, (e & A.childLanes) === 0)
      if (t !== null) {
        if (Ia(
          t,
          A,
          e,
          !1
        ), (e & A.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && A.child !== t.child)
      throw Error(r(153));
    if (A.child !== null) {
      for (t = A.child, e = Qe(t, t.pendingProps), A.child = e, e.return = A; t.sibling !== null; )
        t = t.sibling, e = e.sibling = Qe(t, t.pendingProps), e.return = A;
      e.sibling = null;
    }
    return A.child;
  }
  function Ho(t, A) {
    return (t.lanes & A) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Ai(t)));
  }
  function by(t, A, e) {
    switch (A.tag) {
      case 3:
        Ba(A, A.stateNode.containerInfo), da(A, aA, t.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        gl(A);
        break;
      case 4:
        Ba(A, A.stateNode.containerInfo);
        break;
      case 10:
        da(
          A,
          A.type,
          A.memoizedProps.value
        );
        break;
      case 31:
        if (A.memoizedState !== null)
          return A.flags |= 128, so(A), null;
        break;
      case 13:
        var a = A.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return va(A), A.flags |= 128, null;
          a = Ia(
            t,
            A,
            e,
            !1
          );
          var n = A.child.childLanes;
          return a || (e & n) !== 0 ? am(t, A, e) : (va(A), t = Pe(
            t,
            A,
            e
          ), t !== null ? t.sibling : null);
        }
        va(A);
        break;
      case 19:
        if (A.flags & 128)
          return Yo(
            t,
            A,
            e
          );
        if (n = (t.flags & 128) !== 0, a = (e & A.childLanes) !== 0, a || (Ia(
          t,
          A,
          e,
          !1
        ), a = (e & A.childLanes) !== 0), n) {
          if (a)
            return Yo(
              t,
              A,
              e
            );
          A.flags |= 128;
        }
        if (n = A.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Ql(A, bA.current), a) break;
        return null;
      case 22:
        return A.lanes = 0, Pd(
          t,
          A,
          e,
          A.pendingProps
        );
      case 24:
        da(A, aA, t.memoizedState.cache);
    }
    return Pe(t, A, e);
  }
  function im(t, A, e) {
    if (t !== null)
      if (t.memoizedProps !== A.pendingProps)
        lA = !0;
      else {
        if (!Ho(t, e) && (A.flags & 128) === 0)
          return lA = !1, by(
            t,
            A,
            e
          );
        lA = (t.flags & 131072) !== 0;
      }
    else
      lA = !1, vt && (A.flags & 1048576) !== 0 && kf(A, Cl, A.index);
    switch (A.lanes = 0, A.tag) {
      case 16:
        t: {
          var a = A.pendingProps;
          if (t = tn(A.elementType), A.type = t, typeof t == "function")
            Wr(t) ? (a = nn(t, a), A.tag = 1, A = Am(
              null,
              A,
              t,
              a,
              e
            )) : (A.tag = 0, A = Ko(
              null,
              A,
              t,
              a,
              e
            ));
          else {
            if (t != null) {
              var n = t.$$typeof;
              if (n === q) {
                A.tag = 11, A = Ld(
                  null,
                  A,
                  t,
                  a,
                  e
                );
                break t;
              } else if (n === ft) {
                A.tag = 14, A = Xd(
                  null,
                  A,
                  t,
                  a,
                  e
                );
                break t;
              } else if (n === Ut) {
                A.tag = 10, A.type = t, A = um(
                  null,
                  A,
                  e
                );
                break t;
              }
            }
            throw A = w(t) || t, Error(r(306, A, ""));
          }
        }
        return A;
      case 0:
        return Ko(
          t,
          A,
          A.type,
          A.pendingProps,
          e
        );
      case 1:
        return a = A.type, n = nn(
          a,
          A.pendingProps
        ), Am(
          t,
          A,
          a,
          n,
          e
        );
      case 3:
        t: {
          if (Ba(
            A,
            A.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          a = A.pendingProps;
          var l = A.memoizedState;
          n = l.element, uo(t, A), Zl(A, a, null, e);
          var o = A.memoizedState;
          if (a = o.cache, da(A, aA, a), a !== l.cache && to(
            A,
            [aA],
            e,
            !0
          ), Fl(), a = o.element, l.isDehydrated)
            if (l = {
              element: a,
              isDehydrated: !1,
              cache: o.cache
            }, A.updateQueue.baseState = l, A.memoizedState = l, A.flags & 256) {
              A = em(
                t,
                A,
                a,
                e
              );
              break t;
            } else if (a !== n) {
              n = ae(
                Error(r(424)),
                A
              ), ql(n), A = em(
                t,
                A,
                a,
                e
              );
              break t;
            } else {
              switch (t = A.stateNode.containerInfo, t.nodeType) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (Zt = re(t.firstChild), dA = A, vt = !0, sa = null, ue = !0, e = Pf(
                A,
                null,
                a,
                e
              ), A.child = e; e; )
                e.flags = e.flags & -3 | 134221824, e = e.sibling;
            }
          else {
            if (La(), a === n) {
              A = Pe(
                t,
                A,
                e
              );
              break t;
            }
            cA(t, A, a, e);
          }
          A = A.child;
        }
        return A;
      case 26:
        return Yn(t, A), t === null ? (e = E0(
          A.type,
          null,
          A.pendingProps,
          null
        )) ? A.memoizedState = e : vt || (A.stateNode = s0(
          A.type,
          A.pendingProps,
          Se.current,
          A
        )) : A.memoizedState = E0(
          A.type,
          t.memoizedProps,
          A.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return gl(A), t === null && vt && (a = A.stateNode = j0(
          A.type,
          A.pendingProps,
          Se.current
        ), dA = A, ue = !0, n = Zt, ja(A.type) ? (qc = n, Zt = re(a.firstChild)) : Zt = n), cA(
          t,
          A,
          A.pendingProps.children,
          e
        ), Yn(t, A), t === null && (A.flags |= 4194304), A.child;
      case 5:
        return t === null && vt && ((n = a = Zt) && (a = m1(
          a,
          A.type,
          A.pendingProps,
          ue
        ), a !== null ? (A.stateNode = a, dA = A, Zt = re(a.firstChild), ue = !1, n = !0) : n = !1), n || fa(A)), gl(A), n = A.type, l = A.pendingProps, o = t !== null ? t.memoizedProps : null, a = l.children, jc(n, l) ? a = null : o !== null && jc(n, o) && (A.flags |= 32), A.memoizedState !== null && (n = po(
          t,
          A,
          oy,
          null,
          null,
          e
        ), nl._currentValue = n), Yn(t, A), cA(t, A, a, e), A.child;
      case 6:
        return t === null && vt && ((t = e = Zt) && (e = p1(
          e,
          A.pendingProps,
          ue
        ), e !== null ? (A.stateNode = e, dA = A, Zt = null, t = !0) : t = !1), t || fa(A)), null;
      case 13:
        return am(t, A, e);
      case 4:
        return Ba(
          A,
          A.stateNode.containerInfo
        ), a = A.pendingProps, t === null ? A.child = en(
          A,
          null,
          a,
          e
        ) : cA(t, A, a, e), A.child;
      case 11:
        return Ld(
          t,
          A,
          A.type,
          A.pendingProps,
          e
        );
      case 7:
        return a = A.pendingProps, Yn(t, A), cA(t, A, a, e), A.child;
      case 8:
        return cA(
          t,
          A,
          A.pendingProps.children,
          e
        ), A.child;
      case 12:
        return cA(
          t,
          A,
          A.pendingProps.children,
          e
        ), A.child;
      case 10:
        return um(t, A, e);
      case 9:
        return n = A.type._context, a = A.pendingProps.children, Pa(A), n = yA(n), a = a(n), A.flags |= 1, cA(t, A, a, e), A.child;
      case 14:
        return Xd(
          t,
          A,
          A.type,
          A.pendingProps,
          e
        );
      case 15:
        return Id(
          t,
          A,
          A.type,
          A.pendingProps,
          e
        );
      case 19:
        return Yo(t, A, e);
      case 31:
        return yy(t, A, e);
      case 22:
        return Pd(
          t,
          A,
          e,
          A.pendingProps
        );
      case 24:
        return Pa(A), a = yA(aA), t === null ? (n = ao(), n === null && (n = Ht, l = Ao(), n.pooledCache = l, l.refCount++, l !== null && (n.pooledCacheLanes |= e), n = l), A.memoizedState = { parent: a, cache: n }, lo(A), da(A, aA, n)) : ((t.lanes & e) !== 0 && (uo(t, A), Zl(A, null, null, e), Fl()), n = t.memoizedState, l = A.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, A.memoizedState = n, A.lanes === 0 && (A.memoizedState = A.updateQueue.baseState = n), da(A, aA, a)) : (a = l.cache, da(A, aA, a), a !== n.cache && to(
          A,
          [aA],
          e,
          !0
        ))), cA(
          t,
          A,
          A.pendingProps.children,
          e
        ), A.child;
      case 30:
        return A.stateNode === null && (A.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = A.pendingProps, a.name != null && a.name !== "auto" ? A.flags |= t === null ? 18882560 : 18874368 : vt && _u(A), t !== null && t.memoizedProps.name !== a.name ? A.flags |= 4194816 : Yn(t, A), cA(t, A, a.children, e), A.child;
      case 29:
        throw A.pendingProps;
    }
    throw Error(r(156, A.tag));
  }
  function _e(t) {
    t.flags |= 4;
  }
  function Go(t, A, e, a, n) {
    var l;
    if ((l = (t.mode & 32) !== 0) && (l = e === null ? C0(A, a) : C0(A, a) && (a.src !== e.src || a.srcSet !== e.srcSet)), l) {
      if (t.flags |= 16777216, (n & 335544128) === n)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Gm()) t.flags |= 8192;
        else
          throw An = li, no;
    } else t.flags &= -16777217;
  }
  function rm(t, A) {
    if (A.type !== "stylesheet" || (A.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !q0(A))
      if (Gm()) t.flags |= 8192;
      else
        throw An = li, no;
  }
  function Ti(t, A) {
    A !== null && (t.flags |= 4), t.flags & 16384 && (A = t.tag !== 22 ? ws() : 536870912, t.lanes |= A, Qn |= A);
  }
  function Il(t, A) {
    if (!vt)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var e = t.tail, a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? A || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (A = t.tail, e = null; A !== null; )
            A.alternate !== null && (e = A), A = A.sibling;
          e === null ? t.tail = null : e.sibling = null;
      }
  }
  function Qt(t) {
    var A = t.alternate !== null && t.alternate.child === t.child, e = 0, a = 0;
    if (A)
      for (var n = t.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags & 1206910976, a |= n.flags & 1206910976, n.return = t, n = n.sibling;
    else
      for (n = t.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = t, n = n.sibling;
    return t.subtreeFlags |= a, t.childLanes = e, A;
  }
  function Sy(t, A, e) {
    var a = A.pendingProps;
    switch (Ir(A), A.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Qt(A), null;
      case 1:
        return Qt(A), null;
      case 3:
        return e = A.stateNode, a = null, t !== null && (a = t.memoizedState.cache), A.memoizedState.cache !== a && (A.flags |= 2048), Le(aA), FA(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (t === null || t.child === null) && (Vn(A) ? _e(A) : t === null || t.memoizedState.isDehydrated && (A.flags & 256) === 0 || (A.flags |= 1024, _r())), Qt(A), null;
      case 26:
        var n = A.type, l = A.memoizedState;
        return t === null ? (_e(A), l !== null ? (Qt(A), rm(A, l)) : (Qt(A), Go(
          A,
          n,
          null,
          a,
          e
        ))) : l ? l !== t.memoizedState ? (_e(A), Qt(A), rm(A, l)) : (Qt(A), A.flags &= -16777217) : (t = t.memoizedProps, t !== a && _e(A), Qt(A), Go(
          A,
          n,
          t,
          a,
          e
        )), null;
      case 27:
        if (pn(A), e = Se.current, n = A.type, t !== null && A.stateNode != null)
          t.memoizedProps !== a && _e(A);
        else {
          if (!a) {
            if (A.stateNode === null)
              throw Error(r(166));
            return Qt(A), A.subtreeFlags &= -33554433, null;
          }
          t = tA.current, Vn(A) ? Yf(A) : (t = j0(n, a, e), A.stateNode = t, _e(A));
        }
        return Qt(A), A.subtreeFlags &= -33554433, null;
      case 5:
        if (pn(A), n = A.type, t !== null && A.stateNode != null)
          t.memoizedProps !== a && _e(A);
        else {
          if (!a) {
            if (A.stateNode === null)
              throw Error(r(166));
            return Qt(A), A.subtreeFlags &= -33554433, null;
          }
          if (l = tA.current, Vn(A))
            Yf(A);
          else {
            var o = iu(
              Se.current
            );
            switch (l) {
              case 1:
                l = o.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                l = o.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    l = o.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    l = o.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    l = o.createElement("div"), l.innerHTML = "<script><\/script>", l = l.removeChild(
                      l.firstChild
                    );
                    break;
                  case "select":
                    l = typeof a.is == "string" ? o.createElement("select", {
                      is: a.is
                    }) : o.createElement("select"), a.multiple ? l.multiple = !0 : a.size && (l.size = a.size);
                    break;
                  default:
                    l = typeof a.is == "string" ? o.createElement(n, { is: a.is }) : o.createElement(n);
                }
            }
            l[hA] = A, l[wA] = a;
            t: for (o = A.child; o !== null; ) {
              if (o.tag === 5 || o.tag === 6)
                l.appendChild(o.stateNode);
              else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                o.child.return = o, o = o.child;
                continue;
              }
              if (o === A) break t;
              for (; o.sibling === null; ) {
                if (o.return === null || o.return === A)
                  break t;
                o = o.return;
              }
              o.sibling.return = o.return, o = o.sibling;
            }
            A.stateNode = l;
            t: switch (xA(l, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && _e(A);
          }
        }
        return Qt(A), A.subtreeFlags &= -33554433, Go(
          A,
          A.type,
          t === null ? null : t.memoizedProps,
          A.pendingProps,
          e
        ), null;
      case 6:
        if (t && A.stateNode != null)
          t.memoizedProps !== a && _e(A);
        else {
          if (typeof a != "string" && A.stateNode === null)
            throw Error(r(166));
          if (t = Se.current, Vn(A)) {
            if (t = A.stateNode, e = A.memoizedProps, a = null, n = dA, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            t[hA] = A, t = !!(t.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || i0(t.nodeValue, e)), t || fa(A, !0);
          } else
            t = iu(t).createTextNode(
              a
            ), t[hA] = A, A.stateNode = t;
        }
        return Qt(A), null;
      case 31:
        if (e = A.memoizedState, t === null || t.memoizedState !== null) {
          if (a = Vn(A), e !== null) {
            if (t === null) {
              if (!a) throw Error(r(318));
              if (t = A.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(557));
              t[hA] = A;
            } else
              La(), (A.flags & 128) === 0 && (A.memoizedState = null), A.flags |= 4;
            Qt(A), t = !1;
          } else
            e = _r(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = e), t = !0;
          if (!t)
            return A.flags & 256 ? (JA(A), A) : (JA(A), null);
          if ((A.flags & 128) !== 0)
            throw Error(r(558));
        }
        return Qt(A), null;
      case 13:
        if (a = A.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (n = Vn(A), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!n) throw Error(r(318));
              if (n = A.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(r(317));
              n[hA] = A;
            } else
              La(), (A.flags & 128) === 0 && (A.memoizedState = null), A.flags |= 4;
            Qt(A), n = !1;
          } else
            n = _r(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return A.flags & 256 ? (JA(A), A) : (JA(A), null);
        }
        return JA(A), (A.flags & 128) !== 0 ? (A.lanes = e, A) : (e = a !== null, t = t !== null && t.memoizedState !== null, e && (a = A.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), l = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (l = a.memoizedState.cachePool.pool), l !== n && (a.flags |= 2048)), e !== t && e && (A.child.flags |= 8192), Ti(A, A.updateQueue), Qt(A), null);
      case 4:
        return FA(), t === null && Nc(A.stateNode.containerInfo), A.flags |= 67108864, Qt(A), null;
      case 10:
        return Le(A.type), Qt(A), null;
      case 19:
        if (fo(A), a = A.memoizedState, a === null) return Qt(A), null;
        if (n = (A.flags & 128) !== 0, l = a.rendering, l === null)
          if (n) Il(a, !1);
          else {
            if (_t !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = A.child; t !== null; ) {
                if (l = oi(t), l !== null) {
                  for (A.flags |= 128, Il(a, !1), t = l.updateQueue, A.updateQueue = t, Ti(A, t), A.subtreeFlags = 0, t = e, e = A.child; e !== null; )
                    wf(e, t), e = e.sibling;
                  return Ql(
                    A,
                    bA.current & 1 | 2
                  ), vt && Je(A, a.treeForkCount), A.child;
                }
                t = t.sibling;
              }
            a.tail !== null && MA() > Ci && (A.flags |= 128, n = !0, Il(a, !1), A.lanes = 4194304);
          }
        else {
          if (!n)
            if (t = oi(l), t !== null) {
              if (A.flags |= 128, n = !0, t = t.updateQueue, A.updateQueue = t, Ti(A, t), Il(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !l.alternate && !vt)
                return Qt(A), null;
            } else
              2 * MA() - a.renderingStartTime > Ci && e !== 536870912 && (A.flags |= 128, n = !0, Il(a, !1), A.lanes = 4194304);
          a.isBackwards ? (l.sibling = A.child, A.child = l) : (t = a.last, t !== null ? t.sibling = l : A.child = l, a.last = l);
        }
        if (a.tail !== null) {
          t = a.tail;
          t: {
            for (e = t; e !== null; ) {
              if (e.alternate !== null) {
                e = !1;
                break t;
              }
              e = e.sibling;
            }
            e = !0;
          }
          return a.rendering = t, a.tail = t.sibling, a.renderingStartTime = MA(), t.sibling = null, l = bA.current, l = n ? l & 1 | 2 : l & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !e || vt ? Ql(A, l) : (e = l, wt(vA, A), wt(bA, e), UA === null && (UA = A)), vt && Je(A, a.treeForkCount), t;
        }
        return Qt(A), null;
      case 22:
      case 23:
        return JA(A), co(), a = A.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (A.flags |= 8192) : a && (A.flags |= 8192), a ? (e & 536870912) !== 0 && (A.flags & 128) === 0 && (Qt(A), A.subtreeFlags & 6 && (A.flags |= 8192)) : Qt(A), e = A.updateQueue, e !== null && Ti(A, e.retryQueue), e = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), a = null, A.memoizedState !== null && A.memoizedState.cachePool !== null && (a = A.memoizedState.cachePool.pool), a !== e && (A.flags |= 2048), t !== null && Kt($a), null;
      case 24:
        return e = null, t !== null && (e = t.memoizedState.cache), A.memoizedState.cache !== e && (A.flags |= 2048), Le(aA), Qt(A), null;
      case 25:
        return null;
      case 30:
        return A.flags |= 33554432, Qt(A), null;
    }
    throw Error(r(156, A.tag));
  }
  function xy(t, A) {
    switch (Ir(A), A.tag) {
      case 1:
        return t = A.flags, t & 65536 ? (A.flags = t & -65537 | 128, A) : null;
      case 3:
        return Le(aA), FA(), t = A.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (A.flags = t & -65537 | 128, A) : null;
      case 26:
      case 27:
      case 5:
        return pn(A), null;
      case 31:
        if (A.memoizedState !== null) {
          if (JA(A), A.alternate === null)
            throw Error(r(340));
          La();
        }
        return t = A.flags, t & 65536 ? (A.flags = t & -65537 | 128, A) : null;
      case 13:
        if (JA(A), t = A.memoizedState, t !== null && t.dehydrated !== null) {
          if (A.alternate === null)
            throw Error(r(340));
          La();
        }
        return t = A.flags, t & 65536 ? (A.flags = t & -65537 | 128, A) : null;
      case 19:
        return fo(A), t = A.flags, t & 65536 ? (A.flags = t & -65537 | 128, t = A.memoizedState, t !== null && (t.rendering = null, t.tail = null), A.flags |= 4, A) : null;
      case 4:
        return FA(), null;
      case 10:
        return Le(A.type), null;
      case 22:
      case 23:
        return JA(A), co(), t !== null && Kt($a), t = A.flags, t & 65536 ? (A.flags = t & -65537 | 128, A) : null;
      case 24:
        return Le(aA), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function om(t, A) {
    switch (Ir(A), A.tag) {
      case 3:
        Le(aA), FA();
        break;
      case 26:
      case 27:
      case 5:
        pn(A);
        break;
      case 4:
        FA();
        break;
      case 31:
        A.memoizedState !== null && JA(A);
        break;
      case 13:
        JA(A);
        break;
      case 19:
        fo(A);
        break;
      case 10:
        Le(A.type);
        break;
      case 22:
      case 23:
        JA(A), co(), t !== null && Kt($a);
        break;
      case 24:
        Le(aA);
    }
  }
  function Pl(t, A) {
    try {
      var e = A.updateQueue, a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        e = n;
        do {
          if ((e.tag & t) === t) {
            a = void 0;
            var l = e.create, o = e.inst;
            a = l(), o.destroy = a;
          }
          e = e.next;
        } while (e !== n);
      }
    } catch (f) {
      qt(A, A.return, f);
    }
  }
  function Sa(t, A, e) {
    try {
      var a = A.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var l = n.next;
        a = l;
        do {
          if ((a.tag & t) === t) {
            var o = a.inst, f = o.destroy;
            if (f !== void 0) {
              o.destroy = void 0, n = A;
              var g = e, T = f;
              try {
                T();
              } catch (O) {
                qt(
                  n,
                  g,
                  O
                );
              }
            }
          }
          a = a.next;
        } while (a !== l);
      }
    } catch (O) {
      qt(A, A.return, O);
    }
  }
  function cm(t) {
    var A = t.updateQueue;
    if (A !== null) {
      var e = t.stateNode;
      try {
        $f(A, e);
      } catch (a) {
        qt(t, t.return, a);
      }
    }
  }
  function sm(t, A, e) {
    e.props = nn(
      t.type,
      t.memoizedProps
    ), e.state = t.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      qt(t, A, a);
    }
  }
  function Me(t, A) {
    try {
      var e = t.ref;
      if (e !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            var n = t.stateNode, l = Fe(t.memoizedProps, n);
            (n.ref === null || n.ref.name !== l) && (n.ref = y0(l)), a = n.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var o = new PA(t);
              s(
                t.child,
                !1,
                f1,
                o,
                void 0,
                void 0
              ), t.stateNode = o;
            }
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof e == "function" ? t.refCleanup = e(a) : e.current = a;
      }
    } catch (f) {
      qt(t, A, f);
    }
  }
  function SA(t, A) {
    var e = t.ref, a = t.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          qt(t, A, n);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (n) {
          qt(t, A, n);
        }
      else e.current = null;
  }
  function Ui(t, A) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && A !== null)
      for (var e = 0; e < A.length; e++)
        T0(
          t.stateNode,
          A[e]
        );
  }
  function fm(t) {
    for (var A = t.return; A !== null && (Zo(A) && T0(t.stateNode, A.stateNode), !Fo(A)); )
      A = A.return;
  }
  function _l(t) {
    for (var A = t.return; A !== null && (Zo(A) && d1(t.stateNode, A.stateNode), !Fo(A)); )
      A = A.return;
  }
  function Fo(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function Zo(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function Qo(t) {
    var A = t.type, e = t.memoizedProps, a = t.stateNode;
    try {
      t: switch (A) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break t;
        case "img":
          e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (n) {
      qt(t, t.return, n);
    }
  }
  function Jo(t, A, e) {
    try {
      var a = t.stateNode;
      Ly(a, t.type, e, A), a[wA] = A;
    } catch (n) {
      qt(t, t.return, n);
    }
  }
  function dm(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && ja(t.type) || t.tag === 4;
  }
  function Wo(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || dm(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && ja(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Lo(t, A, e, a) {
    var n = t.tag;
    if (n === 5 || n === 6)
      n = t.stateNode, A ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(n, A) : (A = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, A.appendChild(n), e = e._reactRootContainer, e != null || A.onclick !== null || (A.onclick = Ne)), Ui(t, a), Dt = !0;
    else if (n !== 4 && (n === 27 && (Ui(t, a), a = null, ja(t.type) && (e = t.stateNode, A = null)), t = t.child, t !== null))
      for (Lo(
        t,
        A,
        e,
        a
      ), t = t.sibling; t !== null; )
        Lo(
          t,
          A,
          e,
          a
        ), t = t.sibling;
  }
  function Mi(t, A, e, a) {
    var n = t.tag;
    if (n === 5 || n === 6)
      n = t.stateNode, A ? e.insertBefore(n, A) : e.appendChild(n), Ui(t, a), Dt = !0;
    else if (n !== 4 && (n === 27 && (Ui(t, a), a = null, ja(t.type) && (e = t.stateNode)), t = t.child, t !== null))
      for (Mi(
        t,
        A,
        e,
        a
      ), t = t.sibling; t !== null; )
        Mi(
          t,
          A,
          e,
          a
        ), t = t.sibling;
  }
  function mm(t) {
    var A = t.stateNode, e = t.memoizedProps;
    try {
      for (var a = t.type, n = A.attributes; n.length; )
        A.removeAttributeNode(n[0]);
      xA(A, a, e), A[hA] = t, A[wA] = e;
    } catch (l) {
      qt(t, t.return, l);
    }
  }
  var zi = !1, WA = null;
  function pm(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (zi = !0);
  }
  var ze = null;
  function gm() {
    var t = ze;
    return ze = null, t;
  }
  var qA = 0;
  function Hn(t, A, e, a, n) {
    return qA = 0, hm(
      t.child,
      A,
      e,
      a,
      n
    );
  }
  function hm(t, A, e, a, n) {
    for (var l = !1; t !== null; ) {
      if (t.tag === 5) {
        var o = t.stateNode;
        if (a !== null) {
          var f = Oc(o);
          a.push(f), f.view && (l = !0);
        } else
          l || Oc(o).view && (l = !0);
        zi = !0, g0(
          o,
          qA === 0 ? A : A + "_" + qA,
          e
        ), qA++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && n || hm(
        t.child,
        A,
        e,
        a,
        n
      ) && (l = !0));
      t = t.sibling;
    }
    return l;
  }
  function je(t, A) {
    for (; t !== null; )
      t.tag === 5 ? h0(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && A || je(
        t.child,
        A
      )), t = t.sibling;
  }
  function ji(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (ji(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var A = t.memoizedProps;
          if (A.name == null || A.name === "auto")
            throw Error(r(544));
          var e = A.name;
          A = Ze(A.default, A.share), A !== "none" && (Hn(
            t,
            e,
            A,
            null,
            !1
          ) || je(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function Xo(t, A) {
    if (t.tag === 30) {
      var e = t.stateNode, a = t.memoizedProps, n = Fe(a, e), l = Ze(
        a.default,
        e.paired ? a.share : a.enter
      );
      l !== "none" ? Hn(t, n, l, null, !1) ? (ji(t), e.paired || A || Xn(t, a.onEnter)) : je(t.child, !1) : ji(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        Xo(t, A), t = t.sibling;
    else ji(t);
  }
  function Io(t) {
    if (WA !== null && WA.size !== 0) {
      var A = WA;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var e = t.memoizedProps, a = e.name;
              if (a != null && a !== "auto") {
                var n = A.get(a);
                if (n !== void 0) {
                  var l = Ze(
                    e.default,
                    e.share
                  );
                  if (l !== "none" && (Hn(
                    t,
                    a,
                    l,
                    null,
                    !1
                  ) ? (l = t.stateNode, n.paired = l, l.paired = n, Xn(t, e.onShare)) : je(t.child, !1)), A.delete(a), A.size === 0) break;
                }
              }
            }
            Io(t);
          }
          t = t.sibling;
        }
    }
  }
  function Po(t) {
    if (t.tag === 30) {
      var A = t.memoizedProps, e = Fe(A, t.stateNode), a = WA !== null ? WA.get(e) : void 0, n = Ze(
        A.default,
        a !== void 0 ? A.share : A.exit
      );
      n !== "none" && (Hn(t, e, n, null, !1) ? a !== void 0 ? (n = t.stateNode, a.paired = n, n.paired = a, WA.delete(e), Xn(t, A.onShare)) : Xn(t, A.onExit) : je(t.child, !1)), WA !== null && Io(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        Po(t), t = t.sibling;
    else
      WA !== null && Io(t);
  }
  function ym(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var A = t.memoizedProps, e = Fe(A, t.stateNode);
        A = Ze(A.default, A.update), t.flags &= -5, A !== "none" && Hn(
          t,
          e,
          A,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && ym(t);
      t = t.sibling;
    }
  }
  function _o(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var A = t.stateNode;
            A.paired !== null && (A.paired = null, je(t.child, !1));
          }
          _o(t);
        }
        t = t.sibling;
      }
  }
  function Di(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, je(t.child, !1), _o(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        Di(t), t = t.sibling;
    else _o(t);
  }
  function vm(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? je(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && vm(t), t = t.sibling;
  }
  function $o(t, A, e, a, n, l, o) {
    for (var f = !1; A !== null; ) {
      if (A.tag === 5) {
        var g = A.stateNode;
        if (l !== null && qA < l.length) {
          var T = l[qA], O = Oc(g);
          (T.view || O.view) && (f = !0);
          var K;
          if (K = (t.flags & 4) === 0)
            if (O.clip) K = !0;
            else {
              K = T.rect;
              var x = O.rect;
              K = K.y !== x.y || K.x !== x.x || K.height !== x.height || K.width !== x.width;
            }
          K && (t.flags |= 4), O.abs ? O = !T.abs : (T = T.rect, O = O.rect, O = T.height !== O.height || T.width !== O.width), O && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && g0(
          g,
          qA === 0 ? e : e + "_" + qA,
          n
        ), f && (t.flags & 4) !== 0 || (ze === null && (ze = []), ze.push(
          g,
          qA === 0 ? a : a + "_" + qA,
          A.memoizedProps
        )), qA++;
      } else (A.tag !== 22 || A.memoizedState === null) && (A.tag === 30 && o ? t.flags |= A.flags & 32 : $o(
        t,
        A.child,
        e,
        a,
        n,
        l,
        o
      ) && (f = !0));
      A = A.sibling;
    }
    return f;
  }
  function bm(t, A) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, a = t.stateNode, n = Fe(e, a), l = Ze(e.default, e.update), o;
        o = t.memoizedState, t.memoizedState = null, a = t;
        var f = t.child;
        qA = 0, n = $o(
          a,
          f,
          n,
          n,
          l,
          o,
          !1
        ), (t.flags & 4) !== 0 && n && Xn(t, e.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && bm(t);
      t = t.sibling;
    }
  }
  var mA = !1, Vt = !1, De = !1, tc = !1, Sm = typeof WeakSet == "function" ? WeakSet : Set, pA = null, Re = !1, $l = !1, Ri = !1, Ac = !1;
  function Ny(t, A, e) {
    if (t = t.containerInfo, Mc = ll, t = Uf(t), Yr(t)) {
      if ("selectionStart" in t)
        var a = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          a = (a = t.ownerDocument) && a.defaultView || window;
          var n = a.getSelection && a.getSelection();
          if (n && n.rangeCount !== 0) {
            a = n.anchorNode;
            var l = n.anchorOffset, o = n.focusNode;
            n = n.focusOffset;
            try {
              a.nodeType, o.nodeType;
            } catch {
              a = null;
              break t;
            }
            var f = 0, g = -1, T = -1, O = 0, K = 0, x = t, D = null;
            A: for (; ; ) {
              for (var L; x !== a || l !== 0 && x.nodeType !== 3 || (g = f + l), x !== o || n !== 0 && x.nodeType !== 3 || (T = f + n), x.nodeType === 3 && (f += x.nodeValue.length), (L = x.firstChild) !== null; )
                D = x, x = L;
              for (; ; ) {
                if (x === t) break A;
                if (D === a && ++O === l && (g = f), D === o && ++K === n && (T = f), (L = x.nextSibling) !== null) break;
                x = D, D = x.parentNode;
              }
              x = L;
            }
            a = g === -1 || T === -1 ? null : { start: g, end: T };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (zc = { focusedElem: t, selectionRange: a }, ll = !1, e = (e & 335544064) === e, pA = A, A = e ? 9270 : 1024; pA !== null; ) {
      if (t = pA, e && (a = t.deletions, a !== null))
        for (l = 0; l < a.length; l++)
          e && Po(a[l]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        e && pm(t), Oi(e);
      else {
        if (t.tag === 22) {
          if (a = t.alternate, t.memoizedState !== null) {
            a !== null && a.memoizedState === null && e && Po(a), Oi(e);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            e && pm(t), Oi(e);
            continue;
          }
        }
        a = t.child, (t.subtreeFlags & A) !== 0 && a !== null ? (a.return = t, pA = a) : (e && ym(t), Oi(e));
      }
    }
    WA = null;
  }
  function Oi(t) {
    for (; pA !== null; ) {
      var A = pA, e = t, a = A.alternate, n = A.flags;
      switch (A.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((n & 1024) !== 0 && a !== null) {
            e = void 0, n = a.memoizedProps, a = a.memoizedState;
            var l = A.stateNode;
            try {
              var o = nn(
                A.type,
                n
              );
              e = l.getSnapshotBeforeUpdate(
                o,
                a
              ), l.__reactInternalSnapshotBeforeUpdate = e;
            } catch (f) {
              qt(A, A.return, f);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (a = A.stateNode.containerInfo, e = a.nodeType, e === 9)
              Kc(a);
            else if (e === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Kc(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          e && a !== null && (e = Fe(
            a.memoizedProps,
            a.stateNode
          ), n = A.memoizedProps, n = Ze(n.default, n.update), n !== "none" && Hn(
            a,
            e,
            n,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((n & 1024) !== 0) throw Error(r(163));
      }
      if (a = A.sibling, a !== null) {
        a.return = A.return, pA = a;
        break;
      }
      pA = A.return;
    }
  }
  function xm(t, A, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Oe(t, e), a & 4 && Pl(5, e);
        break;
      case 1:
        if (Oe(t, e), a & 4)
          if (t = e.stateNode, A === null)
            try {
              t.componentDidMount();
            } catch (o) {
              qt(e, e.return, o);
            }
          else {
            var n = nn(
              e.type,
              A.memoizedProps
            );
            A = A.memoizedState;
            try {
              t.componentDidUpdate(
                n,
                A,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (o) {
              qt(
                e,
                e.return,
                o
              );
            }
          }
        a & 64 && cm(e), a & 512 && Me(e, e.return);
        break;
      case 3:
        if (Oe(t, e), a & 64 && (t = e.updateQueue, t !== null)) {
          if (A = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                A = e.child.stateNode;
                break;
              case 1:
                A = e.child.stateNode;
            }
          try {
            $f(t, A);
          } catch (o) {
            qt(e, e.return, o);
          }
        }
        break;
      case 27:
        A === null && a & 4 && mm(e);
      case 26:
      case 5:
        Oe(t, e), A === null && a & 4 && Qo(e), a & 512 && Me(e, e.return);
        break;
      case 12:
        Oe(t, e);
        break;
      case 31:
        Oe(t, e), a & 4 && Mm(t, e);
        break;
      case 13:
        Oe(t, e), a & 4 && zm(t, e), a & 64 && (t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null && (e = wy.bind(
          null,
          e
        ), g1(t, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || mA, !a) {
          var l = A !== null && A.memoizedState !== null || Vt;
          A = mA, n = Vt, mA = a, (Vt = l) && !n ? (a = 2, (e.subtreeFlags & 8772) !== 0 && (a |= 1), he(
            t,
            e,
            a
          )) : Oe(t, e), mA = A, Vt = n;
        }
        break;
      case 30:
        Oe(t, e), a & 512 && Me(e, e.return);
        break;
      case 7:
        a & 512 && Me(e, e.return);
      default:
        Oe(t, e);
    }
  }
  function ec(t, A) {
    for (t = t.child; t !== null; )
      Nm(t, A), t = t.sibling;
  }
  function Nm(t, A) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var e = t.stateNode;
          if (A) {
            var a = e.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var n = t.stateNode, l = t.memoizedProps.style, o = l != null && l.hasOwnProperty("display") ? l.display : null;
            n.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
          }
        } catch (g) {
          qt(t, t.return, g);
        }
        ac(t, A);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = A ? "" : t.memoizedProps, Dt = !0;
        } catch (g) {
          qt(t, t.return, g);
        }
        break;
      case 18:
        try {
          var f = t.stateNode;
          A ? p0(f, !0) : p0(t.stateNode, !1);
        } catch (g) {
          qt(t, t.return, g);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && ec(t, A);
        break;
      default:
        ec(t, A);
    }
  }
  function ac(t, A) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var e = t, a = A;
          switch (e.tag) {
            case 4:
              Nm(e, a);
              break t;
            case 22:
              e.memoizedState === null && ac(e, a);
              break t;
            default:
              ac(e, a);
          }
        }
        t = t.sibling;
      }
  }
  function Tm(t) {
    var A = t.alternate;
    A !== null && (t.alternate = null, Tm(A)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (A = t.stateNode, A !== null && Cu(A)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Wt = null, kA = !1;
  function pe(t, A, e) {
    for (e = e.child; e !== null; )
      Um(t, A, e), e = e.sibling;
  }
  function Um(t, A, e) {
    if (Bt && typeof Bt.onCommitFiberUnmount == "function")
      try {
        Bt.onCommitFiberUnmount(It, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        Vt || SA(e, A), pe(
          t,
          A,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && !Vt && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        Vt || SA(e, A), _l(e);
        var a = Wt, n = kA;
        ja(e.type) && (Wt = e.stateNode, kA = !1), pe(
          t,
          A,
          e
        ), D0(
          e.stateNode,
          e.type,
          e.memoizedProps
        ), Wt = a, kA = n;
        break;
      case 5:
        Vt || SA(e, A), _l(e);
      case 6:
        if (e.tag === 6 && _l(e), a = Wt, n = kA, Wt = null, pe(
          t,
          A,
          e
        ), Wt = a, kA = n, Wt !== null)
          if (kA)
            try {
              (Wt.nodeType === 9 ? Wt.body : Wt.nodeName === "HTML" ? Wt.ownerDocument.body : Wt).removeChild(e.stateNode), Dt = !0;
            } catch (l) {
              qt(
                e,
                A,
                l
              );
            }
          else
            try {
              Wt.removeChild(e.stateNode), Dt = !0;
            } catch (l) {
              qt(
                e,
                A,
                l
              );
            }
        break;
      case 18:
        Wt !== null && (kA ? (t = Wt, m0(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          e.stateNode
        ), ul(t)) : m0(Wt, e.stateNode));
        break;
      case 4:
        a = Wt, n = kA, Wt = e.stateNode.containerInfo, kA = !0, pe(
          t,
          A,
          e
        ), Wt = a, kA = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Sa(2, e, A), Vt || Sa(4, e, A), pe(
          t,
          A,
          e
        );
        break;
      case 1:
        Vt || (SA(e, A), a = e.stateNode, typeof a.componentWillUnmount == "function" && sm(
          e,
          A,
          a
        )), pe(
          t,
          A,
          e
        );
        break;
      case 21:
        pe(
          t,
          A,
          e
        );
        break;
      case 22:
        Vt = (a = Vt) || e.memoizedState !== null, pe(
          t,
          A,
          e
        ), Vt = a;
        break;
      case 30:
        SA(e, A), pe(
          t,
          A,
          e
        );
        break;
      case 7:
        Vt || SA(e, A), pe(
          t,
          A,
          e
        );
        break;
      default:
        pe(
          t,
          A,
          e
        );
    }
  }
  function Mm(t, A) {
    if (A.memoizedState === null && (t = A.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        ul(t);
      } catch (e) {
        qt(A, A.return, e);
      }
    }
  }
  function zm(t, A) {
    if (A.memoizedState === null && (t = A.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        ul(t);
      } catch (e) {
        qt(A, A.return, e);
      }
  }
  function Ty(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var A = t.stateNode;
        return A === null && (A = t.stateNode = new Sm()), A;
      case 22:
        return t = t.stateNode, A = t._retryCache, A === null && (A = t._retryCache = new Sm()), A;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function Ei(t, A) {
    var e = Ty(t);
    A.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var n = Cy.bind(null, t, a);
        a.then(n, n);
      }
    });
  }
  function RA(t, A, e) {
    var a = A.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var l = a[n], o = t, f = A, g = f;
        t: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
              if (ja(g.type)) {
                Wt = g.stateNode, kA = !1;
                break t;
              }
              break;
            case 5:
              Wt = g.stateNode, kA = !1;
              break t;
            case 3:
            case 4:
              Wt = g.stateNode.containerInfo, kA = !0;
              break t;
          }
          g = g.return;
        }
        if (Wt === null) throw Error(r(160));
        Um(o, f, l), Wt = null, kA = !1, o = l.alternate, o !== null && (o.return = null), l.return = null;
      }
    if (A.subtreeFlags & 13886)
      for (A = A.child; A !== null; )
        jm(A, t, e), A = A.sibling;
  }
  var ge = null;
  function jm(t, A, e) {
    var a = t.alternate, n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (n & 4 && (a = t.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var l = 0; l < a.length; l++) {
            var o = a[l];
            o.ref.impl = o.nextImpl;
          }
        RA(A, t, e), OA(t), n & 4 && (Sa(3, t, t.return), Pl(3, t), Sa(5, t, t.return));
        break;
      case 1:
        RA(A, t, e), OA(t), n & 512 && (Vt || a === null || SA(a, a.return)), n & 64 && mA && (t = t.updateQueue, t !== null && (A = t.callbacks, A !== null && (e = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = e === null ? A : e.concat(A))));
        break;
      case 26:
        if (l = ge, RA(A, t, e), OA(t), n & 512 && (Vt || a === null || SA(a, a.return)), n & 4)
          if (n = a !== null ? a.memoizedState : null, e = t.memoizedState, a === null)
            if (e === null)
              if (t.stateNode === null)
                if (mA)
                  t.stateNode = s0(
                    t.type,
                    t.memoizedProps,
                    A.containerInfo,
                    t
                  );
                else {
                  t: {
                    A = t.type, e = t.memoizedProps, n = l.ownerDocument || l;
                    A: switch (A) {
                      case "title":
                        a = n.getElementsByTagName("title")[0], (!a || a[Ul] || a[hA] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = n.createElement(A), n.head.insertBefore(
                          a,
                          n.querySelector("head > title")
                        )), xA(a, A, e), a[hA] = t, fA(a), A = a;
                        break t;
                      case "link":
                        if (l = w0(
                          "link",
                          "href",
                          n
                        ).get(A + (e.href || ""))) {
                          for (o = 0; o < l.length; o++)
                            if (a = l[o], a.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && a.getAttribute("rel") === (e.rel == null ? null : e.rel) && a.getAttribute("title") === (e.title == null ? null : e.title) && a.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                              l.splice(o, 1);
                              break A;
                            }
                        }
                        a = n.createElement(A), xA(a, A, e), n.head.appendChild(a);
                        break;
                      case "meta":
                        if (l = w0(
                          "meta",
                          "content",
                          n
                        ).get(A + (e.content || ""))) {
                          for (o = 0; o < l.length; o++)
                            if (a = l[o], a.getAttribute("content") === (e.content == null ? null : "" + e.content) && a.getAttribute("name") === (e.name == null ? null : e.name) && a.getAttribute("property") === (e.property == null ? null : e.property) && a.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && a.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                              l.splice(o, 1);
                              break A;
                            }
                        }
                        a = n.createElement(A), xA(a, A, e), n.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, A));
                    }
                    a[hA] = t, fA(a), A = a;
                  }
                  t.stateNode = A;
                }
              else
                mA || Hc(l, t.type, t.stateNode);
            else
              t.stateNode = K0(
                l,
                e,
                t.memoizedProps
              );
          else
            n !== e ? (n === null ? (A = a.stateNode, A === null || Vt || A.parentNode.removeChild(A)) : n.count--, e === null ? mA || Hc(l, t.type, t.stateNode) : K0(l, e, t.memoizedProps)) : e === null && t.stateNode !== null && Jo(
              t,
              t.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        RA(A, t, e), OA(t), n & 512 && (Vt || a === null || SA(a, a.return)), a !== null && n & 4 && Jo(
          t,
          t.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (l = De, De = !1, RA(A, t, e), De = l, OA(t), n & 512 && (Vt || a === null || SA(a, a.return)), t.flags & 32) {
          A = t.stateNode;
          try {
            Nn(A, ""), Dt = !0;
          } catch (O) {
            qt(t, t.return, O);
          }
        }
        n & 4 && t.stateNode != null && (A = t.memoizedProps, Jo(
          t,
          A,
          a !== null ? a.memoizedProps : A
        )), n & 1024 && (tc = !0);
        break;
      case 6:
        if (RA(A, t, e), OA(t), n & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          A = t.memoizedProps, e = t.stateNode;
          try {
            e.nodeValue = A, Dt = !0;
          } catch (O) {
            qt(t, t.return, O);
          }
        }
        break;
      case 3:
        if (Dt = !1, Wi = null, l = ge, ge = ru(A.containerInfo), RA(A, t, e), ge = l, OA(t), n & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            ul(A.containerInfo);
          } catch (O) {
            qt(t, t.return, O);
          }
        tc && (tc = !1, Dm(t)), Dt = !1;
        break;
      case 4:
        n = De, De = mA, a = Ls(), l = ge, ge = ru(
          t.stateNode.containerInfo
        ), RA(A, t, e), OA(t), ge = l, Dt && $l && (Ri = !0), Dt = a, De = n;
        break;
      case 12:
        RA(A, t, e), OA(t);
        break;
      case 31:
        RA(A, t, e), OA(t), n & 4 && (A = t.updateQueue, A !== null && (t.updateQueue = null, Ei(t, A)));
        break;
      case 13:
        RA(A, t, e), OA(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (wi = MA()), n & 4 && (A = t.updateQueue, A !== null && (t.updateQueue = null, Ei(t, A)));
        break;
      case 22:
        l = t.memoizedState !== null, o = a !== null && a.memoizedState !== null;
        var f = mA, g = Vt, T = De;
        mA = f || l, De = T || l, Vt = g || o, RA(A, t, e), Vt = g, De = T, mA = f, OA(t), n & 8192 && (A = t.stateNode, A._visibility = l ? A._visibility & -2 : A._visibility | 1, !l || a === null || o || mA || Vt || (A = o || Vt, e = mA, a = Vt, mA = l || mA, Vt = A, xa(t, 2), mA = e, Vt = a), !l && De || ec(t, l)), n & 4 && (A = t.updateQueue, A !== null && (e = A.retryQueue, e !== null && (A.retryQueue = null, Ei(t, e))));
        break;
      case 19:
        RA(A, t, e), OA(t), n & 4 && (A = t.updateQueue, A !== null && (t.updateQueue = null, Ei(t, A)));
        break;
      case 30:
        n & 512 && (Vt || a === null || SA(a, a.return)), n = Ls(), l = $l, o = (e & 335544064) === e, f = t.memoizedProps, $l = o && Ze(
          f.default,
          f.update
        ) !== "none", RA(A, t, e), OA(t), o && a !== null && Dt && (t.flags |= 4), $l = l, Dt = n;
        break;
      case 21:
        break;
      case 7:
        n & 512 && (Vt || a === null || SA(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = t);
      default:
        RA(A, t, e), OA(t);
    }
  }
  function OA(t) {
    var A = t.flags;
    if (A & 2) {
      try {
        for (var e, a = t.return; a !== null; ) {
          if (dm(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = t.return; n !== null; ) {
          if (Zo(n)) {
            var l = n.stateNode;
            a === null ? a = [l] : a.push(l);
          }
          if (Fo(n)) break;
          n = n.return;
        }
        var o = a;
        if (e == null) throw Error(r(160));
        switch (e.tag) {
          case 27:
            var f = e.stateNode, g = Wo(t);
            Mi(
              t,
              g,
              f,
              o
            );
            break;
          case 5:
            var T = e.stateNode;
            e.flags & 32 && (Nn(T, ""), e.flags &= -33);
            var O = Wo(t);
            Mi(
              t,
              O,
              T,
              o
            );
            break;
          case 3:
          case 4:
            var K = e.stateNode.containerInfo, x = Wo(t);
            Lo(
              t,
              x,
              K,
              o
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (D) {
        qt(t, t.return, D);
      }
      t.flags &= -3;
    }
    A & 4096 && (t.flags &= -4097);
  }
  function Dm(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var A = t;
        Dm(A), A.tag === 5 && A.flags & 1024 && (A = A.stateNode, ll = !0, A.reset(), ll = !1), t = t.sibling;
      }
  }
  function Gn(t, A) {
    if (A.subtreeFlags & 9270)
      for (A = A.child; A !== null; )
        Rm(A, t), A = A.sibling;
    else bm(A);
  }
  function Rm(t, A) {
    var e = t.alternate;
    if (e === null) Xo(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (Ac = Re = !1, gm(), Gn(A, t), !Re && !Ri) {
            if (t = ze, t !== null)
              for (var a = 0; a < t.length; a += 3) {
                e = t[a];
                var n = t[a + 1];
                h0(e, t[a + 2]), e = e.ownerDocument.documentElement, e !== null && e.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + n + ")"
                  }
                );
              }
            t = A.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Ac = !0;
          }
          ze = null;
          break;
        case 5:
          Gn(A, t);
          break;
        case 4:
          a = Re, Re = !1, Gn(A, t), Re && (Ri = !0), Re = a;
          break;
        case 22:
          t.memoizedState === null && (e.memoizedState !== null ? Xo(t, !1) : Gn(A, t));
          break;
        case 30:
          a = Re, n = gm(), Re = !1, Gn(A, t), Re && (t.flags |= 4);
          var l = t.memoizedProps, o = t.stateNode;
          A = Fe(l, o), o = Fe(e.memoizedProps, o);
          var f = Ze(l.default, l.update);
          f === "none" ? A = !1 : (l = e.memoizedState, e.memoizedState = null, e = t.child, qA = 0, A = $o(
            t,
            e,
            A,
            o,
            f,
            l,
            !0
          ), qA !== (l === null ? 0 : l.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && A ? (Xn(
            t,
            t.memoizedProps.onUpdate
          ), ze = n) : n !== null && (n.push.apply(n, ze), ze = n), Re = (t.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          Gn(A, t);
      }
  }
  function Oe(t, A) {
    if (A.subtreeFlags & 8772)
      for (A = A.child; A !== null; )
        xm(t, A.alternate, A), A = A.sibling;
  }
  function xa(t, A) {
    for (t = t.child; t !== null; ) {
      var e = t, a = A;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Sa(4, e, e.return), xa(
            e,
            a
          );
          break;
        case 1:
          SA(e, e.return);
          var n = e.stateNode;
          typeof n.componentWillUnmount == "function" && sm(
            e,
            e.return,
            n
          ), xa(
            e,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && D0(
            e.stateNode,
            e.type,
            e.memoizedProps
          );
        case 5:
          SA(e, e.return), e.tag !== 5 && e.tag !== 27 || _l(e), xa(
            e,
            a
          );
          break;
        case 6:
          _l(e);
          break;
        case 26:
          SA(e, e.return), n = e.stateNode, e.memoizedState !== null || n === null || Vt || n.parentNode.removeChild(n), xa(
            e,
            a
          );
          break;
        case 22:
          e.memoizedState === null && xa(
            e,
            a
          );
          break;
        case 30:
          SA(e, e.return), xa(
            e,
            a
          );
          break;
        case 7:
          SA(e, e.return);
        default:
          xa(
            e,
            a
          );
      }
      t = t.sibling;
    }
  }
  function he(t, A, e) {
    for (e = (A.subtreeFlags & 8772) !== 0 ? e : e & -2, A = A.child; A !== null; ) {
      var a = A.alternate, n = t, l = A, o = l.flags, f = (e & 1) !== 0;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          he(
            n,
            l,
            e
          ), Pl(4, l);
          break;
        case 1:
          if (he(
            n,
            l,
            e
          ), a = l, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (O) {
              qt(a, a.return, O);
            }
          if (a = l, n = a.updateQueue, n !== null) {
            var g = a.stateNode;
            try {
              var T = n.shared.hiddenCallbacks;
              if (T !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < T.length; n++)
                  _f(T[n], g);
            } catch (O) {
              qt(a, a.return, O);
            }
          }
          f && o & 64 && cm(l), Me(l, l.return);
          break;
        case 27:
          (e & 2) !== 0 && mm(l);
        case 5:
          l.tag !== 5 && l.tag !== 27 || fm(l), he(
            n,
            l,
            e
          ), f && a === null && o & 4 && Qo(l), Me(l, l.return);
          break;
        case 6:
          fm(l);
          break;
        case 26:
          g = l.stateNode, l.memoizedState !== null || g === null || mA || Hc(
            ru(g.ownerDocument),
            l.type,
            g
          ), he(
            n,
            l,
            e
          ), f && a === null && o & 4 && Qo(l), Me(l, l.return);
          break;
        case 12:
          he(
            n,
            l,
            e
          );
          break;
        case 31:
          he(
            n,
            l,
            e
          ), f && o & 4 && Mm(n, l);
          break;
        case 13:
          he(
            n,
            l,
            e
          ), f && o & 4 && zm(n, l);
          break;
        case 22:
          l.memoizedState === null && he(
            n,
            l,
            e
          ), Me(l, l.return);
          break;
        case 30:
          he(
            n,
            l,
            e
          ), Me(l, l.return);
          break;
        case 7:
          Me(l, l.return);
        default:
          he(
            n,
            l,
            e
          );
      }
      A = A.sibling;
    }
  }
  function nc(t, A) {
    var e = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), t = null, A.memoizedState !== null && A.memoizedState.cachePool !== null && (t = A.memoizedState.cachePool.pool), t !== e && (t != null && t.refCount++, e != null && kl(e));
  }
  function lc(t, A) {
    t = null, A.alternate !== null && (t = A.alternate.memoizedState.cache), A = A.memoizedState.cache, A !== t && (A.refCount++, t != null && kl(t));
  }
  function ie(t, A, e, a) {
    var n = (e & 335544064) === e;
    if (A.subtreeFlags & (n ? 10262 : 10256))
      for (A = A.child; A !== null; )
        Om(
          t,
          A,
          e,
          a
        ), A = A.sibling;
    else n && vm(A);
  }
  function Om(t, A, e, a) {
    var n = (e & 335544064) === e;
    n && A.alternate === null && A.return !== null && A.return.alternate !== null && Di(A);
    var l = A.flags;
    switch (A.tag) {
      case 0:
      case 11:
      case 15:
        ie(
          t,
          A,
          e,
          a
        ), l & 2048 && Pl(9, A);
        break;
      case 1:
        ie(
          t,
          A,
          e,
          a
        );
        break;
      case 3:
        ie(
          t,
          A,
          e,
          a
        ), n && Ac && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), l & 2048 && (l = null, A.alternate !== null && (l = A.alternate.memoizedState.cache), A = A.memoizedState.cache, A !== l && (A.refCount++, l != null && kl(l)));
        break;
      case 12:
        if (l & 2048) {
          ie(
            t,
            A,
            e,
            a
          ), l = A.stateNode;
          try {
            var o = A.memoizedProps, f = o.id, g = o.onPostCommit;
            typeof g == "function" && g(
              f,
              A.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (T) {
            qt(A, A.return, T);
          }
        } else
          ie(
            t,
            A,
            e,
            a
          );
        break;
      case 31:
        ie(
          t,
          A,
          e,
          a
        );
        break;
      case 13:
        ie(
          t,
          A,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        o = A.stateNode, f = A.alternate, A.memoizedState !== null ? (n && f !== null && f.memoizedState === null && Di(f), o._visibility & 2 ? ie(
          t,
          A,
          e,
          a
        ) : tu(
          t,
          A
        )) : (n && f !== null && f.memoizedState !== null && Di(A), o._visibility & 2 ? ie(
          t,
          A,
          e,
          a
        ) : (o._visibility |= 2, Fn(
          t,
          A,
          e,
          a,
          (A.subtreeFlags & 10256) !== 0 || !1
        ))), l & 2048 && nc(f, A);
        break;
      case 24:
        ie(
          t,
          A,
          e,
          a
        ), l & 2048 && lc(A.alternate, A);
        break;
      case 30:
        n && (l = A.alternate, l !== null && (je(l.child, !0), je(A.child, !0))), ie(
          t,
          A,
          e,
          a
        );
        break;
      default:
        ie(
          t,
          A,
          e,
          a
        );
    }
  }
  function Fn(t, A, e, a, n) {
    for (n = n && ((A.subtreeFlags & 10256) !== 0 || !1), A = A.child; A !== null; ) {
      var l = t, o = A, f = e, g = a, T = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          Fn(
            l,
            o,
            f,
            g,
            n
          ), Pl(8, o);
          break;
        case 23:
          break;
        case 22:
          var O = o.stateNode;
          o.memoizedState !== null ? O._visibility & 2 ? Fn(
            l,
            o,
            f,
            g,
            n
          ) : tu(
            l,
            o
          ) : (O._visibility |= 2, Fn(
            l,
            o,
            f,
            g,
            n
          )), n && T & 2048 && nc(
            o.alternate,
            o
          );
          break;
        case 24:
          Fn(
            l,
            o,
            f,
            g,
            n
          ), n && T & 2048 && lc(o.alternate, o);
          break;
        default:
          Fn(
            l,
            o,
            f,
            g,
            n
          );
      }
      A = A.sibling;
    }
  }
  function tu(t, A) {
    if (A.subtreeFlags & 10256)
      for (A = A.child; A !== null; ) {
        var e = t, a = A, n = a.flags;
        switch (a.tag) {
          case 22:
            tu(e, a), n & 2048 && nc(
              a.alternate,
              a
            );
            break;
          case 24:
            tu(e, a), n & 2048 && lc(a.alternate, a);
            break;
          default:
            tu(e, a);
        }
        A = A.sibling;
      }
  }
  var ln = 8192;
  function un(t, A, e) {
    if (t.subtreeFlags & ln)
      for (t = t.child; t !== null; )
        Em(
          t,
          A,
          e
        ), t = t.sibling;
  }
  function Em(t, A, e) {
    switch (t.tag) {
      case 26:
        un(
          t,
          A,
          e
        ), t.flags & ln && (t.memoizedState !== null ? R1(
          e,
          ge,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (A & 335544128) === A && B0(e, t)));
        break;
      case 5:
        un(
          t,
          A,
          e
        ), t.flags & ln && (t = t.stateNode, (A & 335544128) === A && B0(e, t));
        break;
      case 3:
      case 4:
        var a = ge;
        ge = ru(t.stateNode.containerInfo), un(
          t,
          A,
          e
        ), ge = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = ln, ln = 16777216, un(
          t,
          A,
          e
        ), ln = a) : un(
          t,
          A,
          e
        ));
        break;
      case 30:
        if ((t.flags & ln) !== 0 && (a = t.memoizedProps.name, a != null && a !== "auto")) {
          var n = t.stateNode;
          n.paired = null, WA === null && (WA = /* @__PURE__ */ new Map()), WA.set(a, n);
        }
        un(
          t,
          A,
          e
        );
        break;
      default:
        un(
          t,
          A,
          e
        );
    }
  }
  function Vm(t) {
    var A = t.alternate;
    if (A !== null && (t = A.child, t !== null)) {
      A.child = null;
      do
        A = t.sibling, t.sibling = null, t = A;
      while (t !== null);
    }
  }
  function Au(t) {
    var A = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (A !== null)
        for (var e = 0; e < A.length; e++) {
          var a = A[e];
          pA = a, wm(
            a,
            t
          );
        }
      Vm(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Km(t), t = t.sibling;
  }
  function Km(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Au(t), t.flags & 2048 && Sa(9, t, t.return);
        break;
      case 3:
        Au(t);
        break;
      case 12:
        Au(t);
        break;
      case 22:
        var A = t.stateNode;
        t.memoizedState !== null && A._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (A._visibility &= -3, Vi(t)) : Au(t);
        break;
      default:
        Au(t);
    }
  }
  function Vi(t) {
    var A = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (A !== null)
        for (var e = 0; e < A.length; e++) {
          var a = A[e];
          pA = a, wm(
            a,
            t
          );
        }
      Vm(t);
    }
    for (t = t.child; t !== null; ) {
      switch (A = t, A.tag) {
        case 0:
        case 11:
        case 15:
          Sa(8, A, A.return), Vi(A);
          break;
        case 22:
          e = A.stateNode, e._visibility & 2 && (e._visibility &= -3, Vi(A));
          break;
        default:
          Vi(A);
      }
      t = t.sibling;
    }
  }
  function wm(t, A) {
    for (; pA !== null; ) {
      var e = pA;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Sa(8, e, A);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          kl(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, pA = a;
      else
        t: for (e = t; pA !== null; ) {
          a = pA;
          var n = a.sibling, l = a.return;
          if (Tm(a), a === e) {
            pA = null;
            break t;
          }
          if (n !== null) {
            n.return = l, pA = n;
            break t;
          }
          pA = l;
        }
    }
  }
  var Uy = {
    getCacheForType: function(t) {
      var A = yA(aA), e = A.data.get(t);
      return e === void 0 && (e = t(), A.data.set(t, e)), e;
    },
    cacheSignal: function() {
      return yA(aA).controller.signal;
    }
  }, My = typeof WeakMap == "function" ? WeakMap : Map, Ot = 0, Ht = null, St = null, Nt = 0, Ct = 0, LA = null, Na = !1, Zn = !1, uc = !1, $e = 0, _t = 0, Ta = 0, rn = 0, Ki = 0, XA = 0, Qn = 0, eu = null, BA = null, ic = !1, wi = 0, Cm = 0, Ci = 1 / 0, qi = null, Ua = null, Xt = 0, ye = null, on = null, Ee = 0, rc = 0, oc = null, qm = null, Jn = null, Wn = null, Ln = null, au = 0, ki = null;
  function IA() {
    return (Ot & 2) !== 0 && Nt !== 0 ? Nt & -Nt : G.T !== null ? vc() : Bs();
  }
  function km() {
    if (XA === 0)
      if ((Nt & 536870912) === 0 || vt) {
        var t = ia;
        ia <<= 1, (ia & 3932160) === 0 && (ia = 262144), XA = t;
      } else XA = 536870912;
    return t = vA.current, t !== null && (t.flags |= 32), XA;
  }
  function Xn(t, A) {
    if (A != null) {
      var e = t.stateNode, a = e.ref;
      a === null && (a = e.ref = y0(
        Fe(t.memoizedProps, e)
      )), Wn === null && (Wn = []), Wn.push(A.bind(null, a));
    }
  }
  function YA(t, A, e) {
    (t === Ht && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null) && (In(t, 0), Ma(
      t,
      Nt,
      XA,
      !1
    )), Tl(t, e), ((Ot & 2) === 0 || t !== Ht) && (t === Ht && ((Ot & 2) === 0 && (rn |= e), _t === 4 && Ma(
      t,
      Nt,
      XA,
      !1
    )), Ve(t));
  }
  function Bm(t, A, e) {
    if ((Ot & 6) !== 0) throw Error(r(327));
    var a = !e && (A & 127) === 0 && (A & t.expiredLanes) === 0 || Nl(t, A), n = a ? Dy(t, A) : sc(t, A, !0), l = a;
    do {
      if (n === 0) {
        Zn && !a && Ma(t, A, 0, !1);
        break;
      } else {
        if (e = t.current.alternate, l && !zy(e)) {
          n = sc(t, A, !1), l = !1;
          continue;
        }
        if (n === 2) {
          if (l = A, t.errorRecoveryDisabledLanes & l)
            var o = 0;
          else
            o = t.pendingLanes & -536870913, o = o !== 0 ? o : o & 536870912 ? 536870912 : 0;
          if (o !== 0) {
            A = o;
            t: {
              var f = t;
              n = eu;
              var g = f.current.memoizedState.isDehydrated;
              if (g && (In(f, o).flags |= 256), o = sc(
                f,
                o,
                !1
              ), o !== 2 && o !== 6) {
                if (uc && !g) {
                  f.errorRecoveryDisabledLanes |= l, rn |= l, n = 4;
                  break t;
                }
                l = BA, BA = n, l !== null && (BA === null ? BA = l : BA.push.apply(
                  BA,
                  l
                ));
              }
              n = o;
            }
            if (l = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          In(t, 0), Ma(t, A, 0, !0);
          break;
        }
        t: {
          switch (a = t, l = n, l) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((A & 4194048) !== A && (A & 62914560) !== A)
                break;
            case 6:
              Ma(
                a,
                A,
                XA,
                !Na
              );
              break t;
            case 2:
              BA = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((A & 62914560) === A && (n = wi + 300 - MA(), 10 < n)) {
            if (Ma(
              a,
              A,
              XA,
              !Na
            ), Ku(a, 0, !0) !== 0) break t;
            Ee = A, a.timeoutHandle = Rc(
              Ym.bind(
                null,
                a,
                e,
                BA,
                qi,
                ic,
                A,
                XA,
                rn,
                Qn,
                Na,
                l,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break t;
          }
          Ym(
            a,
            e,
            BA,
            qi,
            ic,
            A,
            XA,
            rn,
            Qn,
            Na,
            l,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ve(t);
  }
  function Ym(t, A, e, a, n, l, o, f, g, T, O, K, x, D) {
    t.timeoutHandle = -1;
    var L = A.subtreeFlags, lt = (l & 335544064) === l;
    if (K = null, (lt || L & 8192 || (L & 16785408) === 16785408) && (K = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Ne
    }, WA = null, Em(
      A,
      l,
      K
    ), lt && (L = K, lt = t.containerInfo, lt = (lt.nodeType === 9 ? lt : lt.ownerDocument).__reactViewTransition, lt != null && (L.count++, L.waitingForViewTransition = !0, L = su.bind(L), lt.finished.then(L, L))), L = (l & 62914560) === l ? wi - MA() : (l & 4194048) === l ? Cm - MA() : 0, L = O1(
      K,
      L
    ), L !== null)) {
      Ee = l, t.cancelPendingCommit = L(
        Lm.bind(
          null,
          t,
          A,
          l,
          e,
          a,
          n,
          o,
          f,
          g,
          T,
          O,
          K,
          null,
          x,
          D
        )
      ), Ma(t, l, o, !T);
      return;
    }
    Lm(
      t,
      A,
      l,
      e,
      a,
      n,
      o,
      f,
      g,
      T,
      O,
      K
    );
  }
  function zy(t) {
    for (var A = t; ; ) {
      var e = A.tag;
      if ((e === 0 || e === 11 || e === 15) && A.flags & 16384 && (e = A.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var n = e[a], l = n.getSnapshot;
          n = n.value;
          try {
            if (!QA(l(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = A.child, A.subtreeFlags & 16384 && e !== null)
        e.return = A, A = e;
      else {
        if (A === t) break;
        for (; A.sibling === null; ) {
          if (A.return === null || A.return === t) return !0;
          A = A.return;
        }
        A.sibling.return = A.return, A = A.sibling;
      }
    }
    return !0;
  }
  function Ma(t, A, e, a) {
    A = Ks(t, A), A &= ~Ki, A &= ~rn, t.suspendedLanes |= A, t.pingedLanes &= ~A, a && (t.warmLanes |= A), a = t.expirationTimes;
    for (var n = A; 0 < n; ) {
      var l = 31 - Rt(n), o = 1 << l;
      a[l] = -1, n &= ~o;
    }
    e !== 0 && Cs(t, e, A);
  }
  function Bi() {
    return (Ot & 6) === 0 ? (nu(0), !1) : !0;
  }
  function cc() {
    if (St !== null) {
      if (Ct === 0)
        var t = St.return;
      else
        t = St, We = Xa = null, yo(t), Cn = null, Hl = 0, t = St;
      for (; t !== null; )
        om(t.alternate, t), t = t.return;
      St = null;
    }
  }
  function In(t, A) {
    var e = t.timeoutHandle;
    return e !== -1 && (t.timeoutHandle = -1, Py(e)), e = t.cancelPendingCommit, e !== null && (t.cancelPendingCommit = null, e()), Ee = 0, cc(), Ht = t, St = e = Qe(t.current, null), Nt = A, Ct = 0, LA = null, Na = !1, Zn = Nl(t, A), uc = !1, Qn = XA = Ki = rn = Ta = _t = 0, BA = eu = null, ic = !1, $e = Ks(t, A), Wu(), e;
  }
  function Hm(t, A) {
    ht = null, G.H = yi, A === wn || A === ni ? (A = Lf(), Ct = 3) : A === no ? (A = Lf(), Ct = 4) : Ct = A === Vo ? 8 : A !== null && typeof A == "object" && typeof A.then == "function" ? 6 : 1, LA = A, St === null && (_t = 1, vi(
      t,
      ae(A, t.current)
    ));
  }
  function Gm() {
    var t = vA.current;
    return t === null ? !0 : (Nt & 4194048) === Nt ? UA === null : (Nt & 62914560) === Nt || (Nt & 536870912) !== 0 ? t === UA : !1;
  }
  function Fm() {
    var t = G.H;
    return G.H = yi, t === null ? yi : t;
  }
  function Zm() {
    var t = G.A;
    return G.A = Uy, t;
  }
  function Yi() {
    _t = 4, Na || (Nt & 4194048) !== Nt && vA.current !== null || (Zn = !0), (Ta & 134217727) === 0 && (rn & 134217727) === 0 || Ht === null || Ma(
      Ht,
      Nt,
      XA,
      !1
    );
  }
  function sc(t, A, e) {
    var a = Ot;
    Ot |= 2;
    var n = Fm(), l = Zm();
    (Ht !== t || Nt !== A) && (qi = null, In(t, A)), A = !1;
    var o = _t;
    t: do
      try {
        if (Ct !== 0 && St !== null) {
          var f = St, g = LA;
          switch (Ct) {
            case 8:
              cc(), o = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              vA.current === null && (A = !0);
              var T = Ct;
              if (Ct = 0, LA = null, Pn(t, f, g, T), e && Zn) {
                o = 0;
                break t;
              }
              break;
            default:
              T = Ct, Ct = 0, LA = null, Pn(t, f, g, T);
          }
        }
        jy(), o = _t;
        break;
      } catch (O) {
        Hm(t, O);
      }
    while (!0);
    return A && t.shellSuspendCounter++, We = Xa = null, Ot = a, G.H = n, G.A = l, St === null && (Ht = null, Nt = 0, Wu()), o;
  }
  function jy() {
    for (; St !== null; ) Qm(St);
  }
  function Dy(t, A) {
    var e = Ot;
    Ot |= 2;
    var a = Fm(), n = Zm();
    Ht !== t || Nt !== A ? (qi = null, Ci = MA() + 500, In(t, A)) : Zn = Nl(
      t,
      A
    );
    t: do
      try {
        if (Ct !== 0 && St !== null) {
          A = St;
          var l = LA;
          A: switch (Ct) {
            case 1:
              Ct = 0, LA = null, Pn(t, A, l, 1);
              break;
            case 2:
            case 9:
              if (Jf(l)) {
                Ct = 0, LA = null, Jm(A);
                break;
              }
              A = function() {
                Ct !== 2 && Ct !== 9 || Ht !== t || (Ct = 7), Ve(t);
              }, l.then(A, A);
              break t;
            case 3:
              Ct = 7;
              break t;
            case 4:
              Ct = 5;
              break t;
            case 7:
              Jf(l) ? (Ct = 0, LA = null, Jm(A)) : (Ct = 0, LA = null, Pn(t, A, l, 7));
              break;
            case 5:
              var o = null;
              switch (St.tag) {
                case 26:
                  o = St.memoizedState;
                case 5:
                case 27:
                  var f = St;
                  if (o ? q0(o) : f.stateNode.complete) {
                    Ct = 0, LA = null;
                    var g = f.sibling;
                    if (g !== null) St = g;
                    else {
                      var T = f.return;
                      T !== null ? (St = T, Hi(T)) : St = null;
                    }
                    break A;
                  }
              }
              Ct = 0, LA = null, Pn(t, A, l, 5);
              break;
            case 6:
              Ct = 0, LA = null, Pn(t, A, l, 6);
              break;
            case 8:
              cc(), _t = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        Ry();
        break;
      } catch (O) {
        Hm(t, O);
      }
    while (!0);
    return We = Xa = null, G.H = a, G.A = n, Ot = e, St !== null ? 0 : (Ht = null, Nt = 0, Wu(), _t);
  }
  function Ry() {
    for (; St !== null && !Ou(); )
      Qm(St);
  }
  function Qm(t) {
    var A = im(t.alternate, t, $e);
    t.memoizedProps = t.pendingProps, A === null ? Hi(t) : St = A;
  }
  function Jm(t) {
    var A = t, e = A.alternate;
    switch (A.tag) {
      case 15:
      case 0:
        A = tm(
          e,
          A,
          A.pendingProps,
          A.type,
          void 0,
          Nt
        );
        break;
      case 11:
        A = tm(
          e,
          A,
          A.pendingProps,
          A.type.render,
          A.ref,
          Nt
        );
        break;
      case 5:
        yo(A);
        var a = A;
        a === dA && (vt ? ($u(a), a.tag === 5 && a.stateNode != null && (Zt = a.stateNode)) : ($u(a), vt = !0));
      default:
        om(e, A), A = St = wf(A, $e), A = im(e, A, $e);
    }
    t.memoizedProps = t.pendingProps, A === null ? Hi(t) : St = A;
  }
  function Pn(t, A, e, a) {
    We = Xa = null, yo(A), Cn = null, Hl = 0;
    var n = A.return;
    try {
      if (hy(
        t,
        n,
        A,
        e,
        Nt
      )) {
        _t = 1, vi(
          t,
          ae(e, t.current)
        ), St = null;
        return;
      }
    } catch (l) {
      if (n !== null) throw St = n, l;
      _t = 1, vi(
        t,
        ae(e, t.current)
      ), St = null;
      return;
    }
    A.flags & 32768 ? (vt || a === 1 ? t = !0 : Zn || (Nt & 536870912) !== 0 ? t = !1 : (Na = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = vA.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Wm(A, t)) : Hi(A);
  }
  function Hi(t) {
    var A = t;
    do {
      if ((A.flags & 32768) !== 0) {
        Wm(
          A,
          Na
        );
        return;
      }
      t = A.return;
      var e = Sy(
        A.alternate,
        A,
        $e
      );
      if (e !== null) {
        St = e;
        return;
      }
      if (A = A.sibling, A !== null) {
        St = A;
        return;
      }
      St = A = t;
    } while (A !== null);
    _t === 0 && (_t = 5);
  }
  function Wm(t, A) {
    do {
      var e = xy(t.alternate, t);
      if (e !== null) {
        e.flags &= 32767, St = e;
        return;
      }
      if (e = t.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !A && (t = t.sibling, t !== null)) {
        St = t;
        return;
      }
      St = t = e;
    } while (t !== null);
    _t = 6, St = null;
  }
  function Lm(t, A, e, a, n, l, o, f, g, T, O, K) {
    t.cancelPendingCommit = null;
    do
      Gi();
    while (Xt !== 0);
    if ((Ot & 6) !== 0) throw Error(r(327));
    if (A !== null) {
      if (A === t.current) throw Error(r(177));
      t === Ht && (St = Ht = null, Nt = 0), on = A, ye = t, Ee = e, oc = n, qm = a, Oy(
        t,
        A,
        e,
        o,
        f,
        g,
        K
      );
    }
  }
  function Oy(t, A, e, a, n, l, o) {
    var f = A.lanes | A.childLanes;
    if (rc = f, f |= Qr, ah(
      t,
      e,
      f,
      a,
      n,
      l
    ), Wn = null, (e & 335544064) === e ? (Ln = ly(t), a = 10262) : (Ln = null, a = 10256), (A.subtreeFlags & a) !== 0 || (A.flags & a) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, qy(hn, function() {
      return pc(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), zi = !1, a = (A.flags & 13878) !== 0, (A.subtreeFlags & 13878) !== 0 || a) {
      a = G.T, G.T = null, n = W.p, W.p = 2, l = Ot, Ot |= 4;
      try {
        Ny(t, A, e);
      } finally {
        Ot = l, W.p = n, G.T = a;
      }
    }
    Xt = 1, zi ? Jn = a1(
      o,
      t.containerInfo,
      Ln,
      fc,
      dc,
      Vy,
      mc,
      pc,
      Ey
    ) : (fc(), dc(), mc());
  }
  function Ey(t) {
    if (Xt !== 0) {
      var A = ye.onRecoverableError;
      A(t, { componentStack: null });
    }
  }
  function Vy() {
    Xt === 3 && (Xt = 0, Rm(on, ye), Xt = 4);
  }
  function fc() {
    if (Xt === 1) {
      Xt = 0;
      var t = ye, A = on, e = Ee, a = (A.flags & 13878) !== 0;
      if ((A.subtreeFlags & 13878) !== 0 || a) {
        a = G.T, G.T = null;
        var n = W.p;
        W.p = 2;
        var l = Ot;
        Ot |= 4;
        try {
          $l = Ri = !1, jm(A, t, e), e = zc;
          var o = Uf(t.containerInfo), f = e.focusedElem, g = e.selectionRange;
          if (o !== f && f && f.ownerDocument && Tf(
            f.ownerDocument.documentElement,
            f
          )) {
            if (g !== null && Yr(f)) {
              var T = g.start, O = g.end;
              if (O === void 0 && (O = T), "selectionStart" in f)
                f.selectionStart = T, f.selectionEnd = Math.min(
                  O,
                  f.value.length
                );
              else {
                var K = f.ownerDocument || document, x = K && K.defaultView || window;
                if (x.getSelection) {
                  var D = x.getSelection(), L = f.textContent.length, lt = Math.min(g.start, L), yt = g.end === void 0 ? lt : Math.min(g.end, L);
                  !D.extend && lt > yt && (o = yt, yt = lt, lt = o);
                  var N = Nf(
                    f,
                    lt
                  ), b = Nf(
                    f,
                    yt
                  );
                  if (N && b && (D.rangeCount !== 1 || D.anchorNode !== N.node || D.anchorOffset !== N.offset || D.focusNode !== b.node || D.focusOffset !== b.offset)) {
                    var j = K.createRange();
                    j.setStart(N.node, N.offset), D.removeAllRanges(), lt > yt ? (D.addRange(j), D.extend(b.node, b.offset)) : (j.setEnd(b.node, b.offset), D.addRange(j));
                  }
                }
              }
            }
            for (K = [], D = f; D = D.parentNode; )
              D.nodeType === 1 && K.push({
                element: D,
                left: D.scrollLeft,
                top: D.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < K.length; f++) {
              var V = K[f];
              V.element.scrollLeft = V.left, V.element.scrollTop = V.top;
            }
          }
          ll = !!Mc, zc = Mc = null;
        } finally {
          Ot = l, W.p = n, G.T = a;
        }
      }
      t.current = A, Xt = 2;
    }
  }
  function dc() {
    if (Xt === 2) {
      Xt = 0;
      var t = ye, A = on, e = (A.flags & 8772) !== 0;
      if ((A.subtreeFlags & 8772) !== 0 || e) {
        e = G.T, G.T = null;
        var a = W.p;
        W.p = 2;
        var n = Ot;
        Ot |= 4;
        try {
          xm(t, A.alternate, A);
        } finally {
          Ot = n, W.p = a, G.T = e;
        }
      }
      Xt = 3;
    }
  }
  function mc() {
    if (Xt === 4 || Xt === 3) {
      Xt = 0;
      var t = Jn;
      Jn = null, $A();
      var A = ye, e = on, a = Ee, n = qm, l = (a & 335544064) === a ? 10262 : 10256;
      if ((e.subtreeFlags & l) !== 0 || (e.flags & l) !== 0 ? Xt = 5 : (Xt = 0, on = ye = null, Xm(A, A.pendingLanes)), l = A.pendingLanes, l === 0 && (Ua = null), xr(a), e = e.stateNode, Bt && typeof Bt.onCommitFiberRoot == "function")
        try {
          Bt.onCommitFiberRoot(
            It,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (n !== null) {
        e = G.T, l = W.p, W.p = 2, G.T = null;
        try {
          for (var o = A.onRecoverableError, f = 0; f < n.length; f++) {
            var g = n[f];
            o(g.value, {
              componentStack: g.stack
            });
          }
        } finally {
          G.T = e, W.p = l;
        }
      }
      if (n = Wn, o = Ln, Ln = null, n !== null && (Wn = null, o === null && (o = []), t !== null))
        for (g = 0; g < n.length; g++)
          e = (0, n[g])(
            o
          ), e !== void 0 && t.finished.finally(e);
      (Ee & 3) !== 0 && Gi(), Ve(A), l = A.pendingLanes, (a & 261930) !== 0 && (l & 42) !== 0 ? A === ki ? au++ : (au = 0, ki = A) : (au = 0, ki = null), nu(0);
    }
  }
  function Xm(t, A) {
    (t.pooledCacheLanes &= A) === 0 && (A = t.pooledCache, A != null && (t.pooledCache = null, kl(A)));
  }
  function Gi() {
    return Jn !== null && (Jn.skipTransition(), Jn = null), fc(), dc(), mc(), pc();
  }
  function pc() {
    if (Xt !== 5) return !1;
    var t = ye, A = rc;
    rc = 0;
    var e = xr(Ee), a = G.T, n = W.p;
    try {
      W.p = 32 > e ? 32 : e, G.T = null, e = oc, oc = null;
      var l = ye, o = Ee;
      if (Xt = 0, on = ye = null, Ee = 0, (Ot & 6) !== 0) throw Error(r(331));
      var f = Ot;
      if (Ot |= 4, Km(l.current), Om(
        l,
        l.current,
        o,
        e
      ), Ot = f, nu(0, !1), Bt && typeof Bt.onPostCommitFiberRoot == "function")
        try {
          Bt.onPostCommitFiberRoot(It, l);
        } catch {
        }
      return !0;
    } finally {
      W.p = n, G.T = a, Xm(t, A);
    }
  }
  function Im(t, A, e) {
    A = ae(e, A), A = Eo(t.stateNode, A, 2), t = ha(t, A, 2), t !== null && (Tl(t, 2), Ve(t));
  }
  function qt(t, A, e) {
    if (t.tag === 3)
      Im(t, t, e);
    else
      for (; A !== null; ) {
        if (A.tag === 3) {
          Im(
            A,
            t,
            e
          );
          break;
        } else if (A.tag === 1) {
          var a = A.stateNode;
          if (typeof A.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ua === null || !Ua.has(a))) {
            t = ae(e, t), e = Jd(2), a = ha(A, e, 2), a !== null && (Wd(
              e,
              a,
              A,
              t
            ), Tl(a, 2), Ve(a));
            break;
          }
        }
        A = A.return;
      }
  }
  function gc(t, A, e) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new My();
      var n = /* @__PURE__ */ new Set();
      a.set(A, n);
    } else
      n = a.get(A), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(A, n));
    n.has(e) || (uc = !0, n.add(e), t = Ky.bind(null, t, A, e), A.then(t, t));
  }
  function Ky(t, A, e) {
    var a = t.pingCache;
    a !== null && a.delete(A), t.pingedLanes |= t.suspendedLanes & e, t.warmLanes &= ~e, Ht === t && (Nt & e) === e && ((_t === 4 || _t === 3 && (Nt & 62914560) === Nt && 300 > MA() - wi) && (Ot & 2) === 0 ? In(t, 0) : Ki |= e, Qn === Nt && (Qn = 0)), Ve(t);
  }
  function Pm(t, A) {
    A === 0 && (A = ws()), t = Ja(t, A), t !== null && (Tl(t, A), Ve(t));
  }
  function wy(t) {
    var A = t.memoizedState, e = 0;
    A !== null && (e = A.retryLane), Pm(t, e);
  }
  function Cy(t, A) {
    var e = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode, n = t.memoizedState;
        n !== null && (e = n.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(A), Pm(t, e);
  }
  function qy(t, A) {
    return yl(t, A);
  }
  var _n = null, $n = null, hc = !1, Fi = !1, yc = !1, za = 0;
  function Ve(t) {
    t !== $n && t.next === null && ($n === null ? _n = $n = t : $n = $n.next = t), Fi = !0, hc || (hc = !0, By());
  }
  function nu(t, A) {
    if (!yc && Fi) {
      yc = !0;
      do
        for (var e = !1, a = _n; a !== null; ) {
          if (t !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var l = 0;
            else {
              var o = a.suspendedLanes, f = a.pingedLanes;
              l = (1 << 31 - Rt(42 | t) + 1) - 1, l &= n & ~(o & ~f), l = l & 201326741 ? l & 201326741 | 1 : l ? l | 2 : 0;
            }
            l !== 0 && (e = !0, A0(a, l));
          } else
            l = Nt, l = Ku(
              a,
              a === Ht ? l : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (l & 3) === 0 || Nl(a, l) || (e = !0, A0(a, l));
          a = a.next;
        }
      while (e);
      yc = !1;
    }
  }
  function ky() {
    _m();
  }
  function _m() {
    Fi = hc = !1;
    var t = 0;
    za !== 0 && Iy() && (t = za);
    for (var A = MA(), e = null, a = _n; a !== null; ) {
      var n = a.next, l = $m(a, A);
      l === 0 ? (a.next = null, e === null ? _n = n : e.next = n, n === null && ($n = e)) : (e = a, (t !== 0 || (l & 3) !== 0) && (Fi = !0)), a = n;
    }
    Xt !== 0 && Xt !== 5 || nu(t), za !== 0 && (za = 0);
  }
  function $m(t, A) {
    for (var e = t.suspendedLanes, a = t.pingedLanes, n = t.expirationTimes, l = t.pendingLanes & -62914561; 0 < l; ) {
      var o = 31 - Rt(l), f = 1 << o, g = n[o];
      g === -1 ? ((f & e) === 0 || (f & a) !== 0) && (n[o] = eh(f, A)) : g <= A && (t.expiredLanes |= f), l &= ~f;
    }
    if (A = Ht, e = Nt, e = Ku(
      t,
      t === A ? e : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, e === 0 || t === A && (Ct === 2 || Ct === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && gn(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((e & 3) === 0 || Nl(t, e)) {
      if (A = e & -e, A === t.callbackPriority) return A;
      switch (a !== null && gn(a), xr(e)) {
        case 2:
        case 8:
          e = bl;
          break;
        case 32:
          e = hn;
          break;
        case 268435456:
          e = Sl;
          break;
        default:
          e = hn;
      }
      return a = t0.bind(null, t), e = yl(e, a), t.callbackPriority = A, t.callbackNode = e, A;
    }
    return a !== null && a !== null && gn(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function t0(t, A) {
    if (Xt !== 0 && Xt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var e = t.callbackNode;
    if (Gi() && t.callbackNode !== e)
      return null;
    var a = Nt;
    return a = Ku(
      t,
      t === Ht ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (Bm(t, a, A), $m(t, MA()), t.callbackNode != null && t.callbackNode === e ? t0.bind(null, t) : null);
  }
  function A0(t, A) {
    if (Gi()) return null;
    Bm(t, A, !0);
  }
  function By() {
    _y(function() {
      (Ot & 6) !== 0 ? yl(
        de,
        ky
      ) : _m();
    });
  }
  function vc() {
    if (za === 0) {
      var t = _a;
      t === 0 && (t = zA, zA <<= 1, (zA & 261888) === 0 && (zA = 256)), za = t;
    }
    return za;
  }
  function e0(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Bu(t);
  }
  function Yy(t, A, e, a, n) {
    if (A === "submit" && e && e.stateNode === n) {
      var l = e0(
        (n[wA] || null).action
      ), o = a.submitter;
      o && (A = (A = o[wA] || null) ? e0(A.formAction) : o.getAttribute("formAction"), A !== null && (l = A, o = null));
      var f = new Fu(
        "action",
        "action",
        null,
        a,
        n
      );
      t.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (za !== 0) {
                  var g = new FormData(n, o);
                  zo(
                    e,
                    {
                      pending: !0,
                      data: g,
                      method: n.method,
                      action: l
                    },
                    null,
                    g
                  );
                }
              } else
                typeof l == "function" && (f.preventDefault(), g = new FormData(n, o), zo(
                  e,
                  {
                    pending: !0,
                    data: g,
                    method: n.method,
                    action: l
                  },
                  l,
                  g
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var bc = 0; bc < Zr.length; bc++) {
    var Sc = Zr[bc], Hy = Sc.toLowerCase(), Gy = Sc[0].toUpperCase() + Sc.slice(1);
    me(
      Hy,
      "on" + Gy
    );
  }
  me(jf, "onAnimationEnd"), me(Df, "onAnimationIteration"), me(Rf, "onAnimationStart"), me("dblclick", "onDoubleClick"), me("focusin", "onFocus"), me("focusout", "onBlur"), me(Ph, "onTransitionRun"), me(_h, "onTransitionStart"), me($h, "onTransitionCancel"), me(Of, "onTransitionEnd"), Sn("onMouseEnter", ["mouseout", "mouseover"]), Sn("onMouseLeave", ["mouseout", "mouseover"]), Sn("onPointerEnter", ["pointerout", "pointerover"]), Sn("onPointerLeave", ["pointerout", "pointerover"]), Fa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Fa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Fa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Fa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Fa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Fa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var lu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Fy = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(lu)
  );
  function a0(t, A) {
    A = (A & 4) !== 0;
    for (var e = 0; e < t.length; e++) {
      var a = t[e], n = a.event;
      a = a.listeners;
      t: {
        var l = void 0;
        if (A)
          for (var o = a.length - 1; 0 <= o; o--) {
            var f = a[o], g = f.instance, T = f.currentTarget;
            if (f = f.listener, g !== l && n.isPropagationStopped())
              break t;
            l = f, n.currentTarget = T;
            try {
              l(n);
            } catch (O) {
              Ju(O);
            }
            n.currentTarget = null, l = g;
          }
        else
          for (o = 0; o < a.length; o++) {
            if (f = a[o], g = f.instance, T = f.currentTarget, f = f.listener, g !== l && n.isPropagationStopped())
              break t;
            l = f, n.currentTarget = T;
            try {
              l(n);
            } catch (O) {
              Ju(O);
            }
            n.currentTarget = null, l = g;
          }
      }
    }
  }
  function xt(t, A) {
    var e = A[Hs];
    e === void 0 && (e = A[Hs] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    e.has(a) || (n0(A, t, 2, !1), e.add(a));
  }
  function xc(t, A, e) {
    var a = 0;
    A && (a |= 4), n0(
      e,
      t,
      a,
      A
    );
  }
  var Zi = "_reactListening" + Math.random().toString(36).slice(2);
  function Nc(t) {
    if (!t[Zi]) {
      t[Zi] = !0, Zs.forEach(function(e) {
        e !== "selectionchange" && (Fy.has(e) || xc(e, !1, t), xc(e, !0, t));
      });
      var A = t.nodeType === 9 ? t : t.ownerDocument;
      A === null || A[Zi] || (A[Zi] = !0, xc("selectionchange", !1, A));
    }
  }
  function n0(t, A, e, a) {
    switch (W0(A)) {
      case 2:
        var n = w1;
        break;
      case 8:
        n = C1;
        break;
      default:
        n = Fc;
    }
    e = n.bind(
      null,
      A,
      e,
      t
    ), n = void 0, !Rr || A !== "touchstart" && A !== "touchmove" && A !== "wheel" || (n = !0), a ? n !== void 0 ? t.addEventListener(A, e, {
      capture: !0,
      passive: n
    }) : t.addEventListener(A, e, !0) : n !== void 0 ? t.addEventListener(A, e, {
      passive: n
    }) : t.addEventListener(A, e, !1);
  }
  function Tc(t, A, e, a, n) {
    var l = a;
    if ((A & 1) === 0 && (A & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var o = a.tag;
        if (o === 3 || o === 4) {
          var f = a.stateNode.containerInfo;
          if (f === n) break;
          if (o === 4)
            for (o = a.return; o !== null; ) {
              var g = o.tag;
              if ((g === 3 || g === 4) && o.stateNode.containerInfo === n)
                return;
              o = o.return;
            }
          for (; f !== null; ) {
            if (o = Ga(f), o === null) return;
            if (g = o.tag, g === 5 || g === 6 || g === 26 || g === 27) {
              a = l = o;
              continue t;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    af(function() {
      var T = l, O = jr(e), K = [];
      t: {
        var x = Ef.get(t);
        if (x !== void 0) {
          var D = Fu, L = t;
          switch (t) {
            case "keypress":
              if (Hu(e) === 0) break t;
            case "keydown":
            case "keyup":
              D = zh;
              break;
            case "focusin":
              L = "focus", D = Kr;
              break;
            case "focusout":
              L = "blur", D = Kr;
              break;
            case "beforeblur":
            case "afterblur":
              D = Kr;
              break;
            case "click":
              if (e.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              D = uf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = ph;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = Eh;
              break;
            case jf:
            case Df:
            case Rf:
              D = yh;
              break;
            case Of:
              D = Kh;
              break;
            case "scroll":
            case "scrollend":
              D = dh;
              break;
            case "wheel":
              D = Ch;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = bh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = of;
              break;
            case "submit":
              D = Rh;
              break;
            case "toggle":
            case "beforetoggle":
              D = kh;
          }
          var lt = (A & 4) !== 0, yt = !lt && (t === "scroll" || t === "scrollend"), N = lt ? x !== null ? x + "Capture" : null : x;
          lt = [];
          for (var b = T, j; b !== null; ) {
            var V = b;
            if (j = V.stateNode, V = V.tag, V !== 5 && V !== 26 && V !== 27 || j === null || N === null || (V = zl(b, N), V != null && lt.push(
              uu(b, V, j)
            )), yt) break;
            b = b.return;
          }
          0 < lt.length && (x = new D(
            x,
            L,
            null,
            e,
            O
          ), K.push({ event: x, listeners: lt }));
        }
      }
      if ((A & 7) === 0) {
        t: {
          if (D = t === "mouseover" || t === "pointerover", x = t === "mouseout" || t === "pointerout", D && e !== zr && (L = e.relatedTarget || e.fromElement) && (Ga(L) || L[yn]))
            break t;
          (x || D) && (L = O.window === O ? O : (D = O.ownerDocument) ? D.defaultView || D.parentWindow : window, x ? (D = e.relatedTarget || e.toElement, x = T, D = D ? Ga(D) : null, D !== null && (yt = m(D), lt = D.tag, D !== yt || lt !== 5 && lt !== 27 && lt !== 6) && (D = null)) : (x = null, D = T), x !== D && (lt = uf, V = "onMouseLeave", N = "onMouseEnter", b = "mouse", (t === "pointerout" || t === "pointerover") && (lt = of, V = "onPointerLeave", N = "onPointerEnter", b = "pointer"), yt = x == null ? L : Ml(x), j = D == null ? L : Ml(D), L = new lt(
            V,
            b + "leave",
            x,
            e,
            O
          ), L.target = yt, L.relatedTarget = j, V = null, Ga(O) === T && (lt = new lt(
            N,
            b + "enter",
            D,
            e,
            O
          ), lt.target = j, lt.relatedTarget = yt, V = lt), yt = V, lt = x && D ? ct(
            x,
            D,
            Zy
          ) : null, x !== null && l0(
            K,
            L,
            x,
            lt,
            !1
          ), D !== null && yt !== null && l0(
            K,
            yt,
            D,
            lt,
            !0
          )));
        }
        t: {
          if (x = T ? Ml(T) : window, D = x.nodeName && x.nodeName.toLowerCase(), D === "select" || D === "input" && x.type === "file")
            var At = hf;
          else if (pf(x))
            if (yf)
              At = Lh;
            else {
              At = Jh;
              var Tt = Qh;
            }
          else
            D = x.nodeName, !D || D.toLowerCase() !== "input" || x.type !== "checkbox" && x.type !== "radio" ? T && Mr(T.elementType) && (At = hf) : At = Wh;
          if (At && (At = At(t, T))) {
            gf(
              K,
              At,
              e,
              O
            );
            break t;
          }
          Tt && Tt(t, x, T);
        }
        switch (Tt = T ? Ml(T) : window, t) {
          case "focusin":
            (pf(Tt) || Tt.contentEditable === "true") && (zn = Tt, Hr = T, wl = null);
            break;
          case "focusout":
            wl = Hr = zn = null;
            break;
          case "mousedown":
            Gr = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Gr = !1, Mf(K, e, O);
            break;
          case "selectionchange":
            if (Ih) break;
          case "keydown":
          case "keyup":
            Mf(K, e, O);
        }
        var ot;
        if (Cr)
          t: {
            switch (t) {
              case "compositionstart":
                var st = "onCompositionStart";
                break t;
              case "compositionend":
                st = "onCompositionEnd";
                break t;
              case "compositionupdate":
                st = "onCompositionUpdate";
                break t;
            }
            st = void 0;
          }
        else
          Mn ? df(t, e) && (st = "onCompositionEnd") : t === "keydown" && e.keyCode === 229 && (st = "onCompositionStart");
        st && (cf && e.locale !== "ko" && (Mn || st !== "onCompositionStart" ? st === "onCompositionEnd" && Mn && (ot = nf()) : (ra = O, Or = "value" in ra ? ra.value : ra.textContent, Mn = !0)), Tt = Qi(T, st), 0 < Tt.length && (st = new rf(
          st,
          t,
          null,
          e,
          O
        ), K.push({ event: st, listeners: Tt }), ot ? st.data = ot : (ot = mf(e), ot !== null && (st.data = ot)))), (ot = Yh ? Hh(t, e) : Gh(t, e)) && (st = Qi(T, "onBeforeInput"), 0 < st.length && (Tt = new rf(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          O
        ), K.push({
          event: Tt,
          listeners: st
        }), Tt.data = ot)), Yy(
          K,
          t,
          T,
          e,
          O
        );
      }
      a0(K, A);
    });
  }
  function uu(t, A, e) {
    return {
      instance: t,
      listener: A,
      currentTarget: e
    };
  }
  function Qi(t, A) {
    for (var e = A + "Capture", a = []; t !== null; ) {
      var n = t, l = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || l === null || (n = zl(t, e), n != null && a.unshift(
        uu(t, n, l)
      ), n = zl(t, A), n != null && a.push(
        uu(t, n, l)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function Zy(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function l0(t, A, e, a, n) {
    for (var l = A._reactName, o = []; e !== null && e !== a; ) {
      var f = e, g = f.alternate, T = f.stateNode;
      if (f = f.tag, g !== null && g === a) break;
      f !== 5 && f !== 26 && f !== 27 || T === null || (g = T, n ? (T = zl(e, l), T != null && o.unshift(
        uu(e, T, g)
      )) : n || (T = zl(e, l), T != null && o.push(
        uu(e, T, g)
      ))), e = e.return;
    }
    o.length !== 0 && t.push({ event: A, listeners: o });
  }
  var Qy = /\r\n?/g, Jy = /\u0000|\uFFFD/g;
  function u0(t) {
    return (typeof t == "string" ? t : "" + t).replace(Qy, `
`).replace(Jy, "");
  }
  function i0(t, A) {
    return A = u0(A), u0(t) === A;
  }
  function kt(t, A, e, a, n, l) {
    switch (e) {
      case "children":
        if (typeof a == "string")
          A === "body" || A === "textarea" && a === "" || Nn(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          A !== "body" && Nn(t, "" + a);
        else return;
        break;
      case "className":
        ku(t, "class", a);
        break;
      case "tabIndex":
        ku(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        ku(t, e, a);
        break;
      case "style":
        Af(t, a, l);
        return;
      case "data":
        if (A !== "object") {
          ku(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (A !== "a" || e !== "href")) {
          t.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(e);
          break;
        }
        a = Bu(a), t.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof l == "function" && (e === "formAction" ? (A !== "input" && kt(t, A, "name", n.name, n, null), kt(
            t,
            A,
            "formEncType",
            n.formEncType,
            n,
            null
          ), kt(
            t,
            A,
            "formMethod",
            n.formMethod,
            n,
            null
          ), kt(
            t,
            A,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (kt(t, A, "encType", n.encType, n, null), kt(t, A, "method", n.method, n, null), kt(t, A, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(e);
          break;
        }
        a = Bu(a), t.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (t.onclick = Ne);
        return;
      case "onScroll":
        a != null && xt("scroll", t);
        return;
      case "onScrollEnd":
        a != null && xt("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(r(60));
            (l != null ? l.__html : void 0) !== e && (t.innerHTML = e);
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        e = Bu(a), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, a) : t.removeAttribute(e);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, "") : t.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0 ? t.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(e, a) : t.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(e, a) : t.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(e) : t.setAttribute(e, a);
        break;
      case "popover":
        xt("beforetoggle", t), xt("toggle", t), qu(t, "popover", a);
        break;
      case "xlinkActuate":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        He(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        He(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        He(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        He(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        qu(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N")
          e = sh.get(e) || e, qu(t, e, a);
        else return;
    }
    Dt = !0;
  }
  function Uc(t, A, e, a, n, l) {
    switch (e) {
      case "style":
        Af(t, a, l);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(r(60));
            (l != null ? l.__html : void 0) !== e && (t.innerHTML = e);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Nn(t, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Nn(t, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && xt("scroll", t);
        return;
      case "onScrollEnd":
        a != null && xt("scrollend", t);
        return;
      case "onClick":
        a != null && (t.onclick = Ne);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Qs.hasOwnProperty(e))
          t: {
            if (e[0] === "o" && e[1] === "n" && (n = e.endsWith("Capture"), l = e.slice(2, n ? e.length - 7 : void 0), A = t[wA] || null, A = A != null ? A[e] : null, typeof A == "function" && t.removeEventListener(l, A, n), typeof a == "function")) {
              typeof A != "function" && A !== null && (e in t ? t[e] = null : t.hasAttribute(e) && t.removeAttribute(e)), t.addEventListener(l, a, n);
              break t;
            }
            Dt = !0, e in t ? t[e] = a : a === !0 ? t.setAttribute(e, "") : qu(t, e, a);
          }
        return;
    }
    Dt = !0;
  }
  function xA(t, A, e) {
    switch (A) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        xt("error", t), xt("load", t);
        var a = !1, n = !1, l;
        for (l in e)
          if (e.hasOwnProperty(l)) {
            var o = e[l];
            if (o != null)
              switch (l) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, A));
                default:
                  kt(t, A, l, o, e, null);
              }
          }
        n && kt(t, A, "srcSet", e.srcSet, e, null), a && kt(t, A, "src", e.src, e, null);
        return;
      case "input":
        xt("invalid", t);
        var f = l = o = n = null, g = null, T = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var O = e[a];
            if (O != null)
              switch (a) {
                case "name":
                  n = O;
                  break;
                case "type":
                  o = O;
                  break;
                case "checked":
                  g = O;
                  break;
                case "defaultChecked":
                  T = O;
                  break;
                case "value":
                  l = O;
                  break;
                case "defaultValue":
                  f = O;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (O != null)
                    throw Error(r(137, A));
                  break;
                default:
                  kt(t, A, a, O, e, null);
              }
          }
        Ps(
          t,
          l,
          f,
          g,
          T,
          o,
          n,
          !1
        );
        return;
      case "select":
        xt("invalid", t), a = o = l = null;
        for (n in e)
          if (e.hasOwnProperty(n) && (f = e[n], f != null))
            switch (n) {
              case "value":
                l = f;
                break;
              case "defaultValue":
                o = f;
                break;
              case "multiple":
                a = f;
              default:
                kt(t, A, n, f, e, null);
            }
        A = l, e = o, t.multiple = !!a, A != null ? xn(t, !!a, A, !1) : e != null && xn(t, !!a, e, !0);
        return;
      case "textarea":
        xt("invalid", t), l = n = a = null;
        for (o in e)
          if (e.hasOwnProperty(o) && (f = e[o], f != null))
            switch (o) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                n = f;
                break;
              case "children":
                l = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(r(91));
                break;
              default:
                kt(t, A, o, f, e, null);
            }
        $s(t, a, n, l);
        return;
      case "option":
        for (g in e)
          if (e.hasOwnProperty(g) && (a = e[g], a != null))
            switch (g) {
              case "selected":
                t.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                kt(t, A, g, a, e, null);
            }
        return;
      case "dialog":
        xt("beforetoggle", t), xt("toggle", t), xt("cancel", t), xt("close", t);
        break;
      case "iframe":
      case "object":
        xt("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < lu.length; a++)
          xt(lu[a], t);
        break;
      case "image":
        xt("error", t), xt("load", t);
        break;
      case "details":
        xt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        xt("error", t), xt("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (T in e)
          if (e.hasOwnProperty(T) && (a = e[T], a != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, A));
              default:
                kt(t, A, T, a, e, null);
            }
        return;
      default:
        if (Mr(A)) {
          for (O in e)
            e.hasOwnProperty(O) && (a = e[O], a !== void 0 && Uc(
              t,
              A,
              O,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (f in e)
      e.hasOwnProperty(f) && (a = e[f], a != null && kt(t, A, f, a, e, null));
  }
  var Wy = {};
  function Ly(t, A, e, a) {
    switch (A) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, l = null, o = null, f = null, g = null, T = null, O = null;
        for (D in e) {
          var K = e[D];
          if (e.hasOwnProperty(D) && K != null)
            switch (D) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                g = K;
              default:
                a.hasOwnProperty(D) || kt(t, A, D, null, a, K);
            }
        }
        for (var x in a) {
          var D = a[x];
          if (K = e[x], a.hasOwnProperty(x) && (D != null || K != null))
            switch (x) {
              case "type":
                D !== K && (Dt = !0), l = D;
                break;
              case "name":
                D !== K && (Dt = !0), n = D;
                break;
              case "checked":
                D !== K && (Dt = !0), T = D;
                break;
              case "defaultChecked":
                D !== K && (Dt = !0), O = D;
                break;
              case "value":
                D !== K && (Dt = !0), o = D;
                break;
              case "defaultValue":
                D !== K && (Dt = !0), f = D;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(r(137, A));
                break;
              default:
                D !== K && kt(
                  t,
                  A,
                  x,
                  D,
                  a,
                  K
                );
            }
        }
        Tr(
          t,
          o,
          f,
          g,
          T,
          O,
          l,
          n
        );
        return;
      case "select":
        D = o = f = x = null;
        for (l in e)
          if (g = e[l], e.hasOwnProperty(l) && g != null)
            switch (l) {
              case "value":
                break;
              case "multiple":
                D = g;
              default:
                a.hasOwnProperty(l) || kt(
                  t,
                  A,
                  l,
                  null,
                  a,
                  g
                );
            }
        for (n in a)
          if (l = a[n], g = e[n], a.hasOwnProperty(n) && (l != null || g != null))
            switch (n) {
              case "value":
                l !== g && (Dt = !0), x = l;
                break;
              case "defaultValue":
                l !== g && (Dt = !0), f = l;
                break;
              case "multiple":
                l !== g && (Dt = !0), o = l;
              default:
                l !== g && kt(
                  t,
                  A,
                  n,
                  l,
                  a,
                  g
                );
            }
        A = f, e = o, a = D, x != null ? xn(t, !!e, x, !1) : !!a != !!e && (A != null ? xn(t, !!e, A, !0) : xn(t, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        D = x = null;
        for (f in e)
          if (n = e[f], e.hasOwnProperty(f) && n != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                kt(t, A, f, null, a, n);
            }
        for (o in a)
          if (n = a[o], l = e[o], a.hasOwnProperty(o) && (n != null || l != null))
            switch (o) {
              case "value":
                n !== l && (Dt = !0), x = n;
                break;
              case "defaultValue":
                n !== l && (Dt = !0), D = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== l && kt(t, A, o, n, a, l);
            }
        _s(t, x, D);
        return;
      case "option":
        for (var L in e)
          if (x = e[L], e.hasOwnProperty(L) && x != null && !a.hasOwnProperty(L))
            switch (L) {
              case "selected":
                t.selected = !1;
                break;
              default:
                kt(
                  t,
                  A,
                  L,
                  null,
                  a,
                  x
                );
            }
        for (g in a)
          if (x = a[g], D = e[g], a.hasOwnProperty(g) && x !== D && (x != null || D != null))
            switch (g) {
              case "selected":
                x !== D && (Dt = !0), t.selected = x && typeof x != "function" && typeof x != "symbol";
                break;
              default:
                kt(
                  t,
                  A,
                  g,
                  x,
                  a,
                  D
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var lt in e)
          x = e[lt], e.hasOwnProperty(lt) && x != null && !a.hasOwnProperty(lt) && kt(t, A, lt, null, a, x);
        for (T in a)
          if (x = a[T], D = e[T], a.hasOwnProperty(T) && x !== D && (x != null || D != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null)
                  throw Error(r(137, A));
                break;
              default:
                kt(
                  t,
                  A,
                  T,
                  x,
                  a,
                  D
                );
            }
        return;
      default:
        if (Mr(A)) {
          for (var yt in e)
            x = e[yt], e.hasOwnProperty(yt) && x !== void 0 && !a.hasOwnProperty(yt) && Uc(
              t,
              A,
              yt,
              void 0,
              a,
              x
            );
          for (O in a)
            x = a[O], D = e[O], !a.hasOwnProperty(O) || x === D || x === void 0 && D === void 0 || Uc(
              t,
              A,
              O,
              x,
              a,
              D
            );
          return;
        }
    }
    for (var N in e)
      x = e[N], e.hasOwnProperty(N) && x != null && !a.hasOwnProperty(N) && kt(t, A, N, null, a, x);
    for (K in a)
      x = a[K], D = e[K], !a.hasOwnProperty(K) || x === D || x == null && D == null || kt(t, A, K, x, a, D);
  }
  function r0(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Xy() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, A = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var n = e[a], l = n.transferSize, o = n.initiatorType, f = n.duration;
        if (l && f && r0(o)) {
          for (o = 0, f = n.responseEnd, a += 1; a < e.length; a++) {
            var g = e[a], T = g.startTime;
            if (T > f) break;
            var O = g.transferSize, K = g.initiatorType;
            O && r0(K) && (g = g.responseEnd, o += O * (g < f ? 1 : (f - T) / (g - T)));
          }
          if (--a, A += 8 * (l + o) / (n.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return A / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Mc = null, zc = null;
  function iu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function o0(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function c0(t, A) {
    if (t === 0)
      switch (A) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && A === "foreignObject" ? 0 : t;
  }
  function s0(t, A, e, a) {
    return e = iu(
      e
    ).createElement(t), e[hA] = a, e[wA] = A, xA(e, t, A), fA(e), e;
  }
  function jc(t, A) {
    return t === "textarea" || t === "noscript" || typeof A.children == "string" || typeof A.children == "number" || typeof A.children == "bigint" || typeof A.dangerouslySetInnerHTML == "object" && A.dangerouslySetInnerHTML !== null && A.dangerouslySetInnerHTML.__html != null;
  }
  var Dc = null;
  function Iy() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Dc ? !1 : (Dc = t, !0) : (Dc = null, !1);
  }
  var Rc = typeof setTimeout == "function" ? setTimeout : void 0, Py = typeof clearTimeout == "function" ? clearTimeout : void 0, f0 = typeof Promise == "function" ? Promise : void 0, d0 = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Rc, _y = typeof queueMicrotask == "function" ? queueMicrotask : typeof f0 < "u" ? function(t) {
    return f0.resolve(null).then(t).catch($y);
  } : Rc;
  function $y(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function ja(t) {
    return t === "head";
  }
  function m0(t, A) {
    var e = A, a = 0;
    do {
      var n = e.nextSibling;
      if (t.removeChild(e), n && n.nodeType === 8)
        if (e = n.data, e === "/$" || e === "/&") {
          if (a === 0) {
            t.removeChild(n), ul(A);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          kc(
            t.ownerDocument.documentElement
          );
        else if (e === "head") {
          e = t.ownerDocument.head, kc(e);
          for (var l = e.firstChild; l; ) {
            var o = l.nextSibling, f = l.nodeName;
            l[Ul] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && l.rel.toLowerCase() === "stylesheet" || e.removeChild(l), l = o;
          }
        } else
          e === "body" && kc(t.ownerDocument.body);
      e = n;
    } while (e);
    ul(A);
  }
  function p0(t, A) {
    var e = t;
    t = 0;
    do {
      var a = e.nextSibling;
      if (e.nodeType === 1 ? A ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (A ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
        if (e = a.data, e === "/$") {
          if (t === 0) break;
          t--;
        } else
          e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || t++;
      e = a;
    } while (e);
  }
  function g0(t, A, e) {
    if (A = CSS.escape(A) !== A ? "r-" + btoa(A).replace(/=/g, "") : A, t.style.viewTransitionName = A, e != null && (t.style.viewTransitionClass = e), e = getComputedStyle(t), e.display === "inline") {
      if (A = t.getClientRects(), A.length === 1) var a = 1;
      else
        for (var n = a = 0; n < A.length; n++) {
          var l = A[n];
          0 < l.width && 0 < l.height && a++;
        }
      a === 1 && (t = t.style, t.display = A.length === 1 ? "inline-block" : "block", t.marginTop = "-" + e.paddingTop, t.marginBottom = "-" + e.paddingBottom);
    }
  }
  function h0(t, A) {
    t = t.style, A = A.style;
    var e = A != null ? A.hasOwnProperty("viewTransitionName") ? A.viewTransitionName : A.hasOwnProperty("view-transition-name") ? A["view-transition-name"] : null : null;
    t.viewTransitionName = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), e = A != null ? A.hasOwnProperty("viewTransitionClass") ? A.viewTransitionClass : A.hasOwnProperty("view-transition-class") ? A["view-transition-class"] : null : null, t.viewTransitionClass = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), t.display === "inline-block" && (A == null ? t.display = t.margin = "" : (e = A.display, t.display = e == null || typeof e == "boolean" ? "" : e, e = A.margin, e != null ? t.margin = e : (e = A.hasOwnProperty("marginTop") ? A.marginTop : A["margin-top"], t.marginTop = e == null || typeof e == "boolean" ? "" : e, A = A.hasOwnProperty("marginBottom") ? A.marginBottom : A["margin-bottom"], t.marginBottom = A == null || typeof A == "boolean" ? "" : A)));
  }
  function t1(t, A, e) {
    return e = e.ownerDocument.defaultView, {
      rect: t,
      abs: A.position === "absolute" || A.position === "fixed",
      clip: A.clipPath !== "none" || A.overflow !== "visible" || A.filter !== "none" || A.mask !== "none" || A.mask !== "none" || A.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= e.innerHeight && t.left <= e.innerWidth
    };
  }
  function Oc(t) {
    var A = t.getBoundingClientRect(), e = getComputedStyle(t);
    return t1(A, e, t);
  }
  function A1(t) {
    return t.documentElement.clientHeight;
  }
  function e1(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function a1(t, A, e, a, n, l, o, f, g) {
    var T = A.nodeType === 9 ? A : A.ownerDocument;
    try {
      var O = T.startViewTransition({
        update: function() {
          var x = T.defaultView, D = x.navigation && x.navigation.transition, L = T.fonts.status;
          a();
          var lt = [];
          if (L === "loaded" && (A1(T), T.fonts.status === "loading" && lt.push(T.fonts.ready)), L = lt.length, t !== null)
            for (var yt = t.suspenseyImages, N = 0, b = 0; b < yt.length; b++) {
              var j = yt[b];
              if (!j.complete) {
                var V = j.getBoundingClientRect();
                if (0 < V.bottom && 0 < V.right && V.top < x.innerHeight && V.left < x.innerWidth) {
                  if (N += k0(j), N > Li) {
                    lt.length = L;
                    break;
                  }
                  j = new Promise(
                    e1.bind(j)
                  ), lt.push(j);
                }
              }
            }
          if (0 < lt.length)
            return x = Promise.race([
              Promise.all(lt),
              new Promise(function(At) {
                return setTimeout(At, 500);
              })
            ]).then(n, n), (D ? Promise.allSettled([D.finished, x]) : x).then(l, l);
          if (n(), D)
            return D.finished.then(
              l,
              l
            );
          l();
        },
        types: e
      });
      T.__reactViewTransition = O;
      var K = [];
      return O.ready.then(
        function() {
          for (var x = T.documentElement.getAnimations({
            subtree: !0
          }), D = 0; D < x.length; D++) {
            var L = x[D], lt = L.effect, yt = lt.pseudoElement;
            if (yt != null && yt.startsWith("::view-transition")) {
              K.push(L), L = lt.getKeyframes();
              for (var N = yt = void 0, b = !0, j = 0; j < L.length; j++) {
                var V = L[j], At = V.width;
                if (yt === void 0) yt = At;
                else if (yt !== At) {
                  b = !1;
                  break;
                }
                if (At = V.height, N === void 0) N = At;
                else if (N !== At) {
                  b = !1;
                  break;
                }
                delete V.width, delete V.height, V.transform === "none" && delete V.transform;
              }
              b && yt !== void 0 && N !== void 0 && (lt.setKeyframes(L), b = getComputedStyle(
                lt.target,
                lt.pseudoElement
              ), b.width !== yt || b.height !== N) && (b = L[0], b.width = yt, b.height = N, b = L[L.length - 1], b.width = yt, b.height = N, lt.setKeyframes(L));
            }
          }
          o();
        },
        function(x) {
          T.__reactViewTransition === O && (T.__reactViewTransition = null);
          try {
            if (typeof x == "object" && x !== null)
              switch (x.name) {
                case "InvalidStateError":
                  (x.message === "View transition was skipped because document visibility state is hidden." || x.message === "Skipping view transition because document visibility state has become hidden." || x.message === "Skipping view transition because viewport size changed." || x.message === "Transition was aborted because of invalid state") && (x = null);
              }
            x !== null && g(x);
          } finally {
            a(), n(), o();
          }
        }
      ), O.finished.finally(function() {
        for (var x = 0; x < K.length; x++)
          K[x].cancel();
        T.__reactViewTransition === O && (T.__reactViewTransition = null), f();
      }), O;
    } catch {
      return a(), n(), o(), null;
    }
  }
  function cn(t, A) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + A + ")";
  }
  cn.prototype.animate = function(t, A) {
    return A = typeof A == "number" ? { duration: A } : P({}, A), A.pseudoElement = this._selector, this._scope.animate(t, A);
  }, cn.prototype.getAnimations = function() {
    for (var t = this._scope, A = this._selector, e = t.getAnimations({ subtree: !0 }), a = [], n = 0; n < e.length; n++) {
      var l = e[n].effect;
      l !== null && l.target === t && l.pseudoElement === A && a.push(e[n]);
    }
    return a;
  }, cn.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function y0(t) {
    return {
      name: t,
      group: new cn("group", t),
      imagePair: new cn("image-pair", t),
      old: new cn("old", t),
      new: new cn("new", t)
    };
  }
  function PA(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  PA.prototype.addEventListener = function(t, A, e) {
    var a = null, n = null;
    if (!(e != null && typeof e != "boolean" && (a = e.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var l = this._eventListeners;
      if (b0(l, t, A, e) === -1) {
        var o = this, f = A;
        e != null && typeof e != "boolean" && e.once === !0 && (f = function(g) {
          o.removeEventListener(
            t,
            A,
            e
          ), typeof A == "function" ? A.call(this, g) : A.handleEvent(g);
        }), a !== null && (n = o.removeEventListener.bind(
          o,
          t,
          A,
          e
        ), a.addEventListener("abort", n, { once: !0 }), n = a.removeEventListener.bind(a, "abort", n)), a = tl(e), l.push({
          type: t,
          listener: A,
          optionsOrUseCapture: e,
          attachedListener: f,
          cleanup: n
        }), s(
          this._fragmentFiber.child,
          !1,
          n1,
          t,
          f,
          a
        );
      }
      this._eventListeners = l;
    }
  };
  function n1(t, A, e, a) {
    return C(t).addEventListener(
      A,
      e,
      a
    ), !1;
  }
  PA.prototype.removeEventListener = function(t, A, e) {
    var a = this._eventListeners;
    if (a !== null && (A = b0(
      a,
      t,
      A,
      e
    ), A !== -1)) {
      var n = a[A];
      e = n.attachedListener;
      var l = n.cleanup;
      n = tl(n.optionsOrUseCapture), s(
        this._fragmentFiber.child,
        !1,
        l1,
        t,
        e,
        n
      ), a.splice(A, 1), l !== null && l();
    }
  };
  function l1(t, A, e, a) {
    return C(t).removeEventListener(
      A,
      e,
      a
    ), !1;
  }
  function tl(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function v0(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function b0(t, A, e, a) {
    if (t.length === 0) return -1;
    a = v0(a);
    for (var n = 0; n < t.length; n++) {
      var l = t[n];
      if (l.type === A && l.listener === e && v0(l.optionsOrUseCapture) === a)
        return n;
    }
    return -1;
  }
  PA.prototype.dispatchEvent = function(t) {
    var A = M(
      this._fragmentFiber
    );
    if (A === null) return !0;
    A = C(A);
    var e = this._eventListeners;
    if (e !== null && 0 < e.length || !t.bubbles) {
      var a = A.nodeType === 9 ? A.createComment("") : document.createTextNode("");
      if (e)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          a.addEventListener(
            l.type,
            l.attachedListener,
            tl(l.optionsOrUseCapture)
          );
        }
      if (A.appendChild(a), t = a.dispatchEvent(t), e)
        for (n = 0; n < e.length; n++)
          l = e[n], a.removeEventListener(
            l.type,
            l.attachedListener,
            tl(l.optionsOrUseCapture)
          );
      return A.removeChild(a), t;
    }
    return A.dispatchEvent(t);
  }, PA.prototype.focus = function(t) {
    s(
      this._fragmentFiber.child,
      !0,
      S0,
      t,
      void 0,
      void 0
    );
  };
  function S0(t, A) {
    return t.tag === 6 ? !1 : (t = C(t), h1(t, A));
  }
  PA.prototype.focusLast = function(t) {
    var A = [];
    s(
      this._fragmentFiber.child,
      !0,
      Ec,
      A,
      void 0,
      void 0
    );
    for (var e = A.length - 1; 0 <= e && !S0(A[e], t); e--) ;
  };
  function Ec(t, A) {
    return A.push(t), !1;
  }
  PA.prototype.blur = function() {
    var t = M(
      this._fragmentFiber
    );
    t !== null && (t = C(t), t = iu(t).activeElement, t !== null && s(
      this._fragmentFiber.child,
      !1,
      u1,
      t,
      void 0,
      void 0
    ));
  };
  function u1(t, A) {
    return t.tag === 6 ? !1 : (t = C(t), t === A || t.contains(A) ? (A.blur(), !0) : !1);
  }
  PA.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), s(
      this._fragmentFiber.child,
      !1,
      i1,
      t,
      void 0,
      void 0
    );
  };
  function i1(t, A) {
    return t.tag === 6 || (t = C(t), A.observe(t)), !1;
  }
  PA.prototype.unobserveUsing = function(t) {
    var A = this._observers;
    if (A !== null && A.has(t)) {
      A.delete(t), s(
        this._fragmentFiber.child,
        !1,
        r1,
        t,
        void 0,
        void 0
      );
      for (var e = A = 0; e < ve.length; e++) {
        var a = ve[e];
        a.fragmentInstance === this && a.observer === t ? t.unobserve(a.instance) : ve[A++] = a;
      }
      ve.length = A;
    }
  };
  function r1(t, A) {
    return t.tag === 6 || (t = C(t), A.unobserve(t)), !1;
  }
  var ve = [], Vc = !1;
  function o1(t, A, e) {
    ve.push({
      fragmentInstance: t,
      observer: A,
      instance: e
    }), Vc || (Vc = !0, y1(function() {
      Vc = !1;
      var a = ve;
      ve = [];
      for (var n = 0; n < a.length; n++) {
        var l = a[n];
        l.observer.unobserve(l.instance);
      }
    }));
  }
  PA.prototype.getClientRects = function() {
    var t = [];
    return s(
      this._fragmentFiber.child,
      !1,
      c1,
      t,
      void 0,
      void 0
    ), t;
  };
  function c1(t, A) {
    if (t.tag === 6) {
      t = t.stateNode;
      var e = t.ownerDocument.createRange();
      e.selectNodeContents(t), A.push.apply(A, e.getClientRects());
    } else
      t = C(t), A.push.apply(A, t.getClientRects());
    return !1;
  }
  PA.prototype.getRootNode = function(t) {
    var A = M(
      this._fragmentFiber
    );
    return A === null ? this : C(A).getRootNode(t);
  }, PA.prototype.compareDocumentPosition = function(t) {
    var A = M(
      this._fragmentFiber
    );
    if (A === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var e = [];
    s(
      this._fragmentFiber.child,
      !1,
      Ec,
      e,
      void 0,
      void 0
    );
    var a = C(A);
    if (e.length === 0) {
      if (e = a, Q(this._fragmentFiber)) {
        t: {
          for (A = this._fragmentFiber.return; A !== null; ) {
            if (A.tag === 4) {
              A = A.stateNode.containerInfo;
              break t;
            }
            if (A.tag === 3 || A.tag === 5 || A.tag === 27)
              break;
            A = A.return;
          }
          A = null;
        }
        A != null && (e = A);
      }
      A = this._fragmentFiber;
      var n = a = e.compareDocumentPosition(t);
      return e === t ? n = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (e = H(A)[1], e === null ? n = Node.DOCUMENT_POSITION_PRECEDING : (t = C(e).compareDocumentPosition(
        t
      ), n = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    A = C(e[0]), n = C(e[e.length - 1]);
    var l = Q(this._fragmentFiber) ? A.parentElement : a;
    if (l == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = l.compareDocumentPosition(A) & Node.DOCUMENT_POSITION_CONTAINED_BY, l = l.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var o = A.compareDocumentPosition(t), f = n.compareDocumentPosition(t), g = o & Node.DOCUMENT_POSITION_CONTAINED_BY || f & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return f = a && l && o & Node.DOCUMENT_POSITION_FOLLOWING && f & Node.DOCUMENT_POSITION_PRECEDING, A = a && A === t || l && n === t || g || f ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && A === t || !l && n === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, A & Node.DOCUMENT_POSITION_DISCONNECTED || A & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || s1(
      A,
      this._fragmentFiber,
      e[0],
      e[e.length - 1],
      t
    ) ? A : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function s1(t, A, e, a, n) {
    var l = Ga(n);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (e = !!l)
        t: {
          for (; l !== null; ) {
            if (l.tag === 7 && (l === A || l.alternate === A)) {
              e = !0;
              break t;
            }
            l = l.return;
          }
          e = !1;
        }
      return e;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (l === null)
        return l = n.ownerDocument, n === l || n === l.documentElement || n === l.body;
      t: {
        for (l = A, A = M(A); l !== null; ) {
          if (!(l.tag !== 5 && l.tag !== 3 && l.tag !== 27 || l !== A && l.alternate !== A)) {
            l = !0;
            break t;
          }
          l = l.return;
        }
        l = !1;
      }
      return l;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((A = !!l) && !(A = l === e) && (A = ct(
      e,
      l,
      it
    ), A === null ? A = !1 : (s(
      A,
      !0,
      nt,
      l,
      e
    ), l = Y, Y = null, A = l !== null)), A) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((A = !!l) && !(A = l === a) && (A = ct(
      a,
      l,
      it
    ), A === null ? A = !1 : (s(
      A,
      !0,
      tt,
      l,
      a
    ), l = Y, X = Y = null, A = l !== null)), A) : !1;
  }
  function x0(t, A) {
    var e = t.ownerDocument.createRange();
    e.selectNodeContents(t), t = e.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      A ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  PA.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(r(566));
    var A = [];
    s(
      this._fragmentFiber.child,
      !1,
      Ec,
      A,
      void 0,
      void 0
    );
    var e = t !== !1;
    if (A.length === 0) {
      var a = H(
        this._fragmentFiber
      );
      if (a = e ? a[1] || a[0] || M(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        t = C(a), x0(t, e);
        return;
      }
      if (a = C(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          e = "host" in a ? a.host : null, e !== null && e.scrollIntoView(t);
          return;
        }
        a.scrollIntoView(t);
      }
    }
    for (a = e ? A.length - 1 : 0; a !== (e ? -1 : A.length); ) {
      var n = A[a];
      n.tag === 6 ? (n = C(n), x0(n, e)) : C(n).scrollIntoView(t), a += e ? -1 : 1;
    }
  };
  function f1(t, A) {
    return t = C(t), N0(t, A), !1;
  }
  function N0(t, A) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(A);
  }
  function T0(t, A) {
    var e = A._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a];
        t.addEventListener(
          n.type,
          n.attachedListener,
          tl(n.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (e = A._observers, e !== null && e.forEach(function(l) {
      for (var o = 0, f = 0; f < ve.length; f++) {
        var g = ve[f];
        (g.fragmentInstance !== A || g.observer !== l || g.instance !== t) && (ve[o++] = g);
      }
      ve.length = o, l.observe(t);
    }), N0(t, A));
  }
  function d1(t, A) {
    var e = A._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a];
        t.removeEventListener(
          n.type,
          n.attachedListener,
          tl(n.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (e = A._observers, e !== null && e.forEach(function(l) {
      typeof l.rootMargin == "string" ? o1(
        A,
        l,
        t
      ) : l.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(A));
  }
  function Kc(t) {
    var A = t.firstChild;
    for (A && A.nodeType === 10 && (A = A.nextSibling); A; ) {
      var e = A;
      switch (A = A.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Kc(e), Cu(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(e);
    }
  }
  function m1(t, A, e, a) {
    for (; t.nodeType === 1; ) {
      var n = e;
      if (t.nodeName.toLowerCase() !== A.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[Ul])
          switch (A) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (l = t.getAttribute("rel"), l === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (l !== n.rel || t.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || t.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || t.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (l = t.getAttribute("src"), (l !== (n.src == null ? null : n.src) || t.getAttribute("type") !== (n.type == null ? null : n.type) || t.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && l && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (A === "input" && t.type === "hidden") {
        var l = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && t.getAttribute("name") === l)
          return t;
      } else return t;
      if (t = re(t.nextSibling), t === null) break;
    }
    return null;
  }
  function p1(t, A, e) {
    if (A === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = re(t.nextSibling), t === null)) return null;
    return t;
  }
  function U0(t, A) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !A || (t = re(t.nextSibling), t === null)) return null;
    return t;
  }
  function wc(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Cc(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function g1(t, A) {
    var e = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = A;
    else if (t.data !== "$?" || e.readyState !== "loading")
      A();
    else {
      var a = function() {
        A(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), t._reactRetry = a;
    }
  }
  function re(t) {
    for (; t != null; t = t.nextSibling) {
      var A = t.nodeType;
      if (A === 1 || A === 3) break;
      if (A === 8) {
        if (A = t.data, A === "$" || A === "$!" || A === "$?" || A === "$~" || A === "&" || A === "F!" || A === "F")
          break;
        if (A === "/$" || A === "/&") return null;
      }
    }
    return t;
  }
  var qc = null;
  function M0(t) {
    t = t.nextSibling;
    for (var A = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === "/$" || e === "/&") {
          if (A === 0)
            return re(t.nextSibling);
          A--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || A++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function z0(t) {
    t = t.previousSibling;
    for (var A = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (A === 0) return t;
          A--;
        } else e !== "/$" && e !== "/&" || A++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function h1(t, A) {
    function e() {
      a = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var a = !1;
    try {
      t.ownerDocument.addEventListener("focus", e, !0), (t.focus || HTMLElement.prototype.focus).call(t, A);
    } finally {
      t.ownerDocument.removeEventListener("focus", e, !0);
    }
    return a;
  }
  function y1(t) {
    d0(function() {
      d0(function(A) {
        return t(A);
      });
    });
  }
  function j0(t, A, e) {
    switch (A = iu(e), t) {
      case "html":
        if (t = A.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = A.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = A.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function D0(t, A, e) {
    for (var a in e) {
      var n = e[a];
      e.hasOwnProperty(a) && n != null && kt(t, A, a, null, Wy, n);
    }
    e.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === Ne && (t.onclick = null), Cu(t);
  }
  function kc(t) {
    for (var A = t.attributes; A.length; )
      t.removeAttributeNode(A[0]);
    Cu(t);
  }
  var oe = /* @__PURE__ */ new Map(), R0 = /* @__PURE__ */ new Set();
  function ru(t) {
    if (typeof t.getRootNode == "function") {
      var A = t.getRootNode();
      if (A.nodeType === 9 || A.nodeType === 11) return A;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var ta = W.d;
  W.d = {
    f: v1,
    r: b1,
    D: S1,
    C: x1,
    L: N1,
    m: T1,
    X: M1,
    S: U1,
    M: z1
  };
  function v1() {
    var t = ta.f(), A = Bi();
    return t || A;
  }
  function b1(t) {
    var A = vn(t);
    A !== null && A.tag === 5 && A.type === "form" ? Ed(A) : ta.r(t);
  }
  var Al = typeof document > "u" ? null : document;
  function O0(t, A, e) {
    var a = Al;
    if (a && typeof A == "string" && A) {
      var n = Ae(A);
      n = 'link[rel="' + t + '"][href="' + n + '"]', typeof e == "string" && (n += '[crossorigin="' + e + '"]'), R0.has(n) || (R0.add(n), t = { rel: t, crossOrigin: e, href: A }, a.querySelector(n) === null && (A = a.createElement("link"), xA(A, "link", t), fA(A), a.head.appendChild(A)));
    }
  }
  function S1(t) {
    ta.D(t), O0("dns-prefetch", t, null);
  }
  function x1(t, A) {
    ta.C(t, A), O0("preconnect", t, A);
  }
  function N1(t, A, e) {
    ta.L(t, A, e);
    var a = Al;
    if (a && t && A) {
      var n = 'link[rel="preload"][as="' + Ae(A) + '"]';
      A === "image" && e && e.imageSrcSet ? (n += '[imagesrcset="' + Ae(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (n += '[imagesizes="' + Ae(
        e.imageSizes
      ) + '"]')) : n += '[href="' + Ae(t) + '"]';
      var l = n;
      switch (A) {
        case "style":
          l = el(t);
          break;
        case "script":
          l = al(t);
      }
      if (!(oe.has(l) || (t = P(
        {
          rel: "preload",
          href: A === "image" && e && e.imageSrcSet ? void 0 : t,
          as: A
        },
        e
      ), oe.set(l, t), a.querySelector(n) !== null || A === "style" && a.querySelector(ou(l)) || A === "script" && a.querySelector(cu(l))))) {
        var o = a.createElement("link");
        xA(o, "link", t), A === "style" && (o[wu] = !0, o.onload = o.onerror = function() {
          Fs(o);
        }), fA(o), a.head.appendChild(o);
      }
    }
  }
  function T1(t, A) {
    ta.m(t, A);
    var e = Al;
    if (e && t) {
      var a = A && typeof A.as == "string" ? A.as : "script", n = 'link[rel="modulepreload"][as="' + Ae(a) + '"][href="' + Ae(t) + '"]', l = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          l = al(t);
      }
      if (!oe.has(l) && (t = P({ rel: "modulepreload", href: t }, A), oe.set(l, t), e.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(cu(l)))
              return;
        }
        a = e.createElement("link"), xA(a, "link", t), fA(a), e.head.appendChild(a);
      }
    }
  }
  function U1(t, A, e) {
    ta.S(t, A, e);
    var a = Al;
    if (a && t) {
      var n = bn(a).hoistableStyles, l = el(t);
      A = A || "default";
      var o = n.get(l);
      if (!o) {
        var f = { loading: 0, preload: null };
        if (o = a.querySelector(
          ou(l)
        ))
          f.loading = 5;
        else {
          t = P(
            { rel: "stylesheet", href: t, "data-precedence": A },
            e
          ), (e = oe.get(l)) && Bc(t, e);
          var g = o = a.createElement("link");
          fA(g), xA(g, "link", t), g._p = new Promise(function(T, O) {
            g.onload = T, g.onerror = O;
          }), g.addEventListener("load", function() {
            f.loading |= 1;
          }), g.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Ji(o, A, a);
        }
        o = {
          type: "stylesheet",
          instance: o,
          count: 1,
          state: f
        }, n.set(l, o);
      }
    }
  }
  function M1(t, A) {
    ta.X(t, A);
    var e = Al;
    if (e && t) {
      var a = bn(e).hoistableScripts, n = al(t), l = a.get(n);
      l || (l = e.querySelector(cu(n)), l || (t = P({ src: t, async: !0 }, A), (A = oe.get(n)) && Yc(t, A), l = e.createElement("script"), fA(l), xA(l, "link", t), e.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, a.set(n, l));
    }
  }
  function z1(t, A) {
    ta.M(t, A);
    var e = Al;
    if (e && t) {
      var a = bn(e).hoistableScripts, n = al(t), l = a.get(n);
      l || (l = e.querySelector(cu(n)), l || (t = P({ src: t, async: !0, type: "module" }, A), (A = oe.get(n)) && Yc(t, A), l = e.createElement("script"), fA(l), xA(l, "link", t), e.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, a.set(n, l));
    }
  }
  function E0(t, A, e, a) {
    var n = (n = Se.current) ? ru(n) : null;
    if (!n) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (e = el(e.href), A = bn(
          n
        ).hoistableStyles, a = A.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, A.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          t = el(e.href);
          var l = bn(
            n
          ).hoistableStyles, o = l.get(t);
          if (o || (n = n.ownerDocument || n, o = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, l.set(t, o), (l = n.querySelector(
            ou(t)
          )) ? l._p || (o.instance = l, o.state.loading = 5) : (l = oe.get(t), l || (l = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, oe.set(t, l)), j1(
            n,
            t,
            l,
            o.state
          ))), A && a === null)
            throw Error(r(528, ""));
          return o;
        }
        if (A && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return A = e.async, e = e.src, typeof e == "string" && A && typeof A != "function" && typeof A != "symbol" ? (e = al(e), A = bn(
          n
        ).hoistableScripts, a = A.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, A.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function el(t) {
    return 'href="' + Ae(t) + '"';
  }
  function ou(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function V0(t) {
    return P({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function j1(t, A, e, a) {
    if (A = t.querySelector(
      'link[rel="preload"][as="style"][' + A + "]"
    )) {
      if (A[wu] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      A = t.createElement("link"), A[wu] = !0, A.onload = A.onerror = Fs.bind(null, A), xA(A, "link", e), fA(A), t.head.appendChild(A);
    a.preload = A, A.addEventListener("load", function() {
      return a.loading |= 1;
    }), A.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function al(t) {
    return '[src="' + Ae(t) + '"]';
  }
  function cu(t) {
    return "script[async]" + t;
  }
  function K0(t, A, e) {
    if (A.count++, A.instance === null)
      switch (A.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + Ae(e.href) + '"]'
          );
          if (a)
            return A.instance = a, fA(a), a;
          var n = P({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), fA(a), xA(a, "style", n), Ji(a, e.precedence, t), A.instance = a;
        case "stylesheet":
          n = el(e.href);
          var l = t.querySelector(
            ou(n)
          );
          if (l)
            return A.state.loading |= 4, A.instance = l, fA(l), l;
          a = V0(e), (n = oe.get(n)) && Bc(a, n), l = (t.ownerDocument || t).createElement("link"), fA(l);
          var o = l;
          return o._p = new Promise(function(f, g) {
            o.onload = f, o.onerror = g;
          }), xA(l, "link", a), A.state.loading |= 4, Ji(l, e.precedence, t), A.instance = l;
        case "script":
          return l = al(e.src), (n = t.querySelector(
            cu(l)
          )) ? (A.instance = n, fA(n), n) : (a = e, (n = oe.get(l)) && (a = P({}, e), Yc(a, n)), t = t.ownerDocument || t, n = t.createElement("script"), fA(n), xA(n, "link", a), t.head.appendChild(n), A.instance = n);
        case "void":
          return null;
        default:
          throw Error(r(443, A.type));
      }
    else
      A.type === "stylesheet" && (A.state.loading & 4) === 0 && (a = A.instance, A.state.loading |= 4, Ji(a, e.precedence, t));
    return A.instance;
  }
  function Ji(t, A, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, l = n, o = 0; o < a.length; o++) {
      var f = a[o];
      if (f.dataset.precedence === A) l = f;
      else if (l !== n) break;
    }
    l ? l.parentNode.insertBefore(t, l.nextSibling) : (A = e.nodeType === 9 ? e.head : e, A.insertBefore(t, A.firstChild));
  }
  function Bc(t, A) {
    t.crossOrigin == null && (t.crossOrigin = A.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = A.referrerPolicy), t.title == null && (t.title = A.title);
  }
  function Yc(t, A) {
    t.crossOrigin == null && (t.crossOrigin = A.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = A.referrerPolicy), t.integrity == null && (t.integrity = A.integrity);
  }
  var Wi = null;
  function w0(t, A, e) {
    if (Wi === null) {
      var a = /* @__PURE__ */ new Map(), n = Wi = /* @__PURE__ */ new Map();
      n.set(e, a);
    } else
      n = Wi, a = n.get(e), a || (a = /* @__PURE__ */ new Map(), n.set(e, a));
    if (a.has(t)) return a;
    for (a.set(t, null), e = e.getElementsByTagName(t), n = 0; n < e.length; n++) {
      var l = e[n];
      if (!(l[Ul] || l[hA] || t === "link" && l.getAttribute("rel") === "stylesheet") && l.namespaceURI !== "http://www.w3.org/2000/svg") {
        var o = l.getAttribute(A) || "";
        o = t + o;
        var f = a.get(o);
        f ? f.push(l) : a.set(o, [l]);
      }
    }
    return a;
  }
  function Hc(t, A, e) {
    t = t.ownerDocument || t, t.head.insertBefore(
      e,
      A === "title" ? t.querySelector("head > title") : null
    );
  }
  function D1(t, A, e) {
    if (e === 1 || A.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof A.precedence != "string" || typeof A.href != "string" || A.href === "")
          break;
        return !0;
      case "link":
        if (typeof A.rel != "string" || typeof A.href != "string" || A.href === "" || A.onLoad || A.onError)
          break;
        switch (A.rel) {
          case "stylesheet":
            return t = A.disabled, typeof A.precedence == "string" && t == null;
          default:
            return !0;
        }
      case "script":
        if (A.async && typeof A.async != "function" && typeof A.async != "symbol" && !A.onLoad && !A.onError && A.src && typeof A.src == "string")
          return !0;
    }
    return !1;
  }
  function C0(t, A) {
    return t === "img" && A.src != null && A.src !== "" && A.onLoad == null && A.loading !== "lazy";
  }
  function q0(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function k0(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function B0(t, A) {
    typeof A.decode == "function" && (t.imgCount++, A.complete || (t.imgBytes += k0(A), t.suspenseyImages.push(A)), t = E1.bind(t), A.decode().then(t, t));
  }
  function R1(t, A, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var n = el(a.href), l = A.querySelector(
          ou(n)
        );
        if (l) {
          A = l._p, A !== null && typeof A == "object" && typeof A.then == "function" && (t.count++, t = su.bind(t), A.then(t, t)), e.state.loading |= 4, e.instance = l, fA(l);
          return;
        }
        l = A.ownerDocument || A, a = V0(a), (n = oe.get(n)) && Bc(a, n), l = l.createElement("link"), fA(l);
        var o = l;
        o._p = new Promise(function(f, g) {
          o.onload = f, o.onerror = g;
        }), xA(l, "link", a), e.instance = l;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(e, A), (A = e.state.preload) && (e.state.loading & 3) === 0 && (t.count++, e = su.bind(t), A.addEventListener("load", e), A.addEventListener("error", e));
    }
  }
  var Li = 0;
  function O1(t, A) {
    return t.stylesheets && t.count === 0 && Ii(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (t.stylesheets && Ii(t, t.stylesheets), t.unsuspend) {
          var l = t.unsuspend;
          t.unsuspend = null, l();
        }
      }, 6e4 + A);
      0 < t.imgBytes && Li === 0 && (Li = 62500 * Xy());
      var n = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Ii(t, t.stylesheets), t.unsuspend)) {
            var l = t.unsuspend;
            t.unsuspend = null, l();
          }
        },
        (t.imgBytes > Li ? 50 : 800) + A
      );
      return t.unsuspend = e, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function Y0(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Ii(t, t.stylesheets);
      else if (t.unsuspend) {
        var A = t.unsuspend;
        t.unsuspend = null, A();
      }
    }
  }
  function su() {
    this.count--, Y0(this);
  }
  function E1() {
    this.imgCount--, Y0(this);
  }
  var Xi = null;
  function Ii(t, A) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Xi = /* @__PURE__ */ new Map(), A.forEach(V1, t), Xi = null, su.call(t));
  }
  function V1(t, A) {
    if (!(A.state.loading & 4)) {
      var e = Xi.get(t);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Xi.set(t, e);
        for (var n = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), l = 0; l < n.length; l++) {
          var o = n[l];
          (o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (e.set(o.dataset.precedence, o), a = o);
        }
        a && e.set(null, a);
      }
      n = A.instance, o = n.getAttribute("data-precedence"), l = e.get(o) || a, l === a && e.set(null, n), e.set(o, n), this.count++, a = su.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), l ? l.parentNode.insertBefore(n, l.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(n, t.firstChild)), A.state.loading |= 4;
    }
  }
  var nl = {
    $$typeof: Ut,
    Provider: null,
    Consumer: null,
    _currentValue: Mt,
    _currentValue2: Mt,
    _threadCount: 0
  };
  function K1(t, A, e, a, n, l, o, f, g) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = br(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = br(0), this.hiddenUpdates = br(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = l, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = g, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function H0(t, A, e, a, n, l, o, f, g, T, O, K) {
    return t = new K1(
      t,
      A,
      e,
      o,
      g,
      T,
      O,
      K,
      f
    ), A = 1, l === !0 && (A |= 24), l = CA(3, null, null, A), t.current = l, l.stateNode = t, A = Ao(), A.refCount++, t.pooledCache = A, A.refCount++, l.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: A
    }, lo(l), t;
  }
  function G0(t) {
    return t ? (t = Rn, t) : Rn;
  }
  function F0(t, A, e, a, n, l) {
    n = G0(n), a.context === null ? a.context = n : a.pendingContext = n, a = ga(A), a.payload = { element: e }, l = l === void 0 ? null : l, l !== null && (a.callback = l), e = ha(t, a, A), e !== null && (YA(e, t, A), Gl(e, t, A));
  }
  function Z0(t, A) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var e = t.retryLane;
      t.retryLane = e !== 0 && e < A ? e : A;
    }
  }
  function Gc(t, A) {
    Z0(t, A), (t = t.alternate) && Z0(t, A);
  }
  function Q0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var A = Ja(t, 67108864);
      A !== null && YA(A, t, 67108864), Gc(t, 67108864);
    }
  }
  function J0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var A = IA();
      A = Sr(A);
      var e = Ja(t, A);
      e !== null && YA(e, t, A), Gc(t, A);
    }
  }
  var ll = !0;
  function w1(t, A, e, a) {
    var n = G.T;
    G.T = null;
    var l = W.p;
    try {
      W.p = 2, Fc(t, A, e, a);
    } finally {
      W.p = l, G.T = n;
    }
  }
  function C1(t, A, e, a) {
    var n = G.T;
    G.T = null;
    var l = W.p;
    try {
      W.p = 8, Fc(t, A, e, a);
    } finally {
      W.p = l, G.T = n;
    }
  }
  function Fc(t, A, e, a) {
    if (ll) {
      var n = Zc(a);
      if (n === null)
        Tc(
          t,
          A,
          a,
          Pi,
          e
        ), L0(t, a);
      else if (k1(
        n,
        t,
        A,
        e,
        a
      ))
        a.stopPropagation();
      else if (L0(t, a), A & 4 && -1 < q1.indexOf(t)) {
        for (; n !== null; ) {
          var l = vn(n);
          if (l !== null)
            switch (l.tag) {
              case 3:
                if (l = l.stateNode, l.current.memoizedState.isDehydrated) {
                  var o = Ha(l.pendingLanes);
                  if (o !== 0) {
                    var f = l;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; o; ) {
                      var g = 1 << 31 - Rt(o);
                      f.entanglements[1] |= g, o &= ~g;
                    }
                    Ve(l), (Ot & 6) === 0 && (Ci = MA() + 500, nu(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = Ja(l, 2), f !== null && YA(f, l, 2), Bi(), Gc(l, 2);
            }
          if (l = Zc(a), l === null && Tc(
            t,
            A,
            a,
            Pi,
            e
          ), l === n) break;
          n = l;
        }
        n !== null && a.stopPropagation();
      } else
        Tc(
          t,
          A,
          a,
          null,
          e
        );
    }
  }
  function Zc(t) {
    return t = jr(t), Qc(t);
  }
  var Pi = null;
  function Qc(t) {
    if (Pi = null, t = Ga(t), t !== null) {
      var A = m(t);
      if (A === null) t = null;
      else {
        var e = A.tag;
        if (e === 13) {
          if (t = p(A), t !== null) return t;
          t = null;
        } else if (e === 31) {
          if (t = v(A), t !== null) return t;
          t = null;
        } else if (e === 3) {
          if (A.stateNode.current.memoizedState.isDehydrated)
            return A.tag === 3 ? A.stateNode.containerInfo : null;
          t = null;
        } else A !== t && (t = null);
      }
    }
    return Pi = t, null;
  }
  function W0(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (vl()) {
          case de:
            return 2;
          case bl:
            return 8;
          case hn:
          case Eu:
            return 32;
          case Sl:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Jc = !1, Da = null, Ra = null, Oa = null, fu = /* @__PURE__ */ new Map(), du = /* @__PURE__ */ new Map(), Ea = [], q1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function L0(t, A) {
    switch (t) {
      case "focusin":
      case "focusout":
        Da = null;
        break;
      case "dragenter":
      case "dragleave":
        Ra = null;
        break;
      case "mouseover":
      case "mouseout":
        Oa = null;
        break;
      case "pointerover":
      case "pointerout":
        fu.delete(A.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        du.delete(A.pointerId);
    }
  }
  function mu(t, A, e, a, n, l) {
    return t === null || t.nativeEvent !== l ? (t = {
      blockedOn: A,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: l,
      targetContainers: [n]
    }, A !== null && (A = vn(A), A !== null && Q0(A)), t) : (t.eventSystemFlags |= a, A = t.targetContainers, n !== null && A.indexOf(n) === -1 && A.push(n), t);
  }
  function k1(t, A, e, a, n) {
    switch (A) {
      case "focusin":
        return Da = mu(
          Da,
          t,
          A,
          e,
          a,
          n
        ), !0;
      case "dragenter":
        return Ra = mu(
          Ra,
          t,
          A,
          e,
          a,
          n
        ), !0;
      case "mouseover":
        return Oa = mu(
          Oa,
          t,
          A,
          e,
          a,
          n
        ), !0;
      case "pointerover":
        var l = n.pointerId;
        return fu.set(
          l,
          mu(
            fu.get(l) || null,
            t,
            A,
            e,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return l = n.pointerId, du.set(
          l,
          mu(
            du.get(l) || null,
            t,
            A,
            e,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function X0(t) {
    var A = Ga(t.target);
    if (A !== null) {
      var e = m(A);
      if (e !== null) {
        if (A = e.tag, A === 13) {
          if (A = p(e), A !== null) {
            t.blockedOn = A, Ys(t.priority, function() {
              J0(e);
            });
            return;
          }
        } else if (A === 31) {
          if (A = v(e), A !== null) {
            t.blockedOn = A, Ys(t.priority, function() {
              J0(e);
            });
            return;
          }
        } else if (A === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function _i(t) {
    if (t.blockedOn !== null) return !1;
    for (var A = t.targetContainers; 0 < A.length; ) {
      var e = Zc(t.nativeEvent);
      if (e === null) {
        e = t.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        zr = a, e.target.dispatchEvent(a), zr = null;
      } else
        return A = vn(e), A !== null && Q0(A), t.blockedOn = e, !1;
      A.shift();
    }
    return !0;
  }
  function I0(t, A, e) {
    _i(t) && e.delete(A);
  }
  function B1() {
    Jc = !1, Da !== null && _i(Da) && (Da = null), Ra !== null && _i(Ra) && (Ra = null), Oa !== null && _i(Oa) && (Oa = null), fu.forEach(I0), du.forEach(I0);
  }
  function $i(t, A) {
    t.blockedOn === A && (t.blockedOn = null, Jc || (Jc = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      B1
    )));
  }
  var tr = null;
  function P0(t) {
    tr !== t && (tr = t, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        tr === t && (tr = null);
        for (var A = 0; A < t.length; A += 3) {
          var e = t[A], a = t[A + 1], n = t[A + 2];
          if (typeof a != "function") {
            if (Qc(a || e) === null)
              continue;
            break;
          }
          var l = vn(e);
          l !== null && (t.splice(A, 3), A -= 3, zo(
            l,
            {
              pending: !0,
              data: n,
              method: e.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function ul(t) {
    function A(g) {
      return $i(g, t);
    }
    Da !== null && $i(Da, t), Ra !== null && $i(Ra, t), Oa !== null && $i(Oa, t), fu.forEach(A), du.forEach(A);
    for (var e = 0; e < Ea.length; e++) {
      var a = Ea[e];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Ea.length && (e = Ea[0], e.blockedOn === null); )
      X0(e), e.blockedOn === null && Ea.shift();
    if (e = (t.ownerDocument || t).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var n = e[a], l = e[a + 1], o = n[wA] || null;
        if (typeof l == "function")
          o || P0(e);
        else if (o) {
          var f = null;
          if (l && l.hasAttribute("formAction")) {
            if (n = l, o = l[wA] || null)
              f = o.formAction;
            else if (Qc(n) !== null) continue;
          } else f = o.action;
          typeof f == "function" ? e[a + 1] = f : (e.splice(a, 3), a -= 3), P0(e);
        }
      }
  }
  function _0() {
    function t(l) {
      l.canIntercept && l.info === "react-transition" && l.intercept({
        handler: function() {
          return new Promise(function(o) {
            return n = o;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function A() {
      n !== null && (n(), n = null), a || setTimeout(e, 20);
    }
    function e() {
      if (!a && !navigation.transition) {
        var l = navigation.currentEntry;
        l && l.url != null && navigation.navigate(l.url, {
          state: l.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", A), navigation.addEventListener("navigateerror", A), setTimeout(e, 100), function() {
        a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", A), navigation.removeEventListener("navigateerror", A), n !== null && (n(), n = null);
      };
    }
  }
  function Wc(t) {
    this._internalRoot = t;
  }
  Ar.prototype.render = Wc.prototype.render = function(t) {
    var A = this._internalRoot;
    if (A === null) throw Error(r(409));
    var e = A.current, a = IA();
    F0(e, a, t, A, null, null);
  }, Ar.prototype.unmount = Wc.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var A = t.containerInfo;
      F0(t.current, 2, null, t, null, null), Bi(), A[yn] = null;
    }
  };
  function Ar(t) {
    this._internalRoot = t;
  }
  Ar.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var A = Bs();
      t = { blockedOn: null, target: t, priority: A };
      for (var e = 0; e < Ea.length && A !== 0 && A < Ea[e].priority; e++) ;
      Ea.splice(e, 0, t), e === 0 && X0(t);
    }
  };
  var $0 = i.version;
  if ($0 !== "19.3.0")
    throw Error(
      r(
        527,
        $0,
        "19.3.0"
      )
    );
  W.findDOMNode = function(t) {
    var A = t._reactInternals;
    if (A === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = U(A), t = t !== null ? R(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Y1 = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: G,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var er = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!er.isDisabled && er.supportsFiber)
      try {
        It = er.inject(
          Y1
        ), Bt = er;
      } catch {
      }
  }
  return gu.createRoot = function(t, A) {
    if (!d(t)) throw Error(r(299));
    var e = !1, a = "", n = Gd, l = Fd, o = Zd;
    return A != null && (A.unstable_strictMode === !0 && (e = !0), A.identifierPrefix !== void 0 && (a = A.identifierPrefix), A.onUncaughtError !== void 0 && (n = A.onUncaughtError), A.onCaughtError !== void 0 && (l = A.onCaughtError), A.onRecoverableError !== void 0 && (o = A.onRecoverableError)), A = H0(
      t,
      1,
      !1,
      null,
      null,
      e,
      a,
      null,
      n,
      l,
      o,
      _0
    ), t[yn] = A.current, Nc(t), new Wc(A);
  }, gu.hydrateRoot = function(t, A, e) {
    if (!d(t)) throw Error(r(299));
    var a = !1, n = "", l = Gd, o = Fd, f = Zd, g = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (n = e.identifierPrefix), e.onUncaughtError !== void 0 && (l = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError), e.formState !== void 0 && (g = e.formState)), A = H0(
      t,
      1,
      !0,
      A,
      e ?? null,
      a,
      n,
      g,
      l,
      o,
      f,
      _0
    ), A.context = G0(null), e = A.current, a = IA(), a = Sr(a), n = ga(a), n.callback = null, ha(e, n, a), e = a, A.current.lanes = e, Tl(A, e), Ve(A), t[yn] = A.current, Nc(t), new Ar(A);
  }, gu.version = "19.3.0", gu;
}
var op;
function I1() {
  if (op) return Xc.exports;
  op = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (i) {
        console.error(i);
      }
  }
  return u(), Xc.exports = X1(), Xc.exports;
}
var P1 = I1(), z = Ss();
const J = /* @__PURE__ */ Cp(z), Su = /* @__PURE__ */ G1({
  __proto__: null,
  default: J
}, [z]);
var xs = qp();
const _1 = /* @__PURE__ */ Cp(xs);
function $1(u) {
  if (typeof document > "u") return;
  let i = document.head || document.getElementsByTagName("head")[0], c = document.createElement("style");
  c.type = "text/css", i.appendChild(c), c.styleSheet ? c.styleSheet.cssText = u : c.appendChild(document.createTextNode(u));
}
const tv = (u) => {
  switch (u) {
    case "success":
      return av;
    case "info":
      return lv;
    case "warning":
      return nv;
    case "error":
      return uv;
    default:
      return null;
  }
}, Av = Array(12).fill(0), ev = ({ visible: u, className: i }) => /* @__PURE__ */ J.createElement("div", {
  className: [
    "sonner-loading-wrapper",
    i
  ].filter(Boolean).join(" "),
  "data-visible": u
}, /* @__PURE__ */ J.createElement("div", {
  className: "sonner-spinner"
}, Av.map((c, r) => /* @__PURE__ */ J.createElement("div", {
  className: "sonner-loading-bar",
  key: `spinner-bar-${r}`
})))), av = /* @__PURE__ */ J.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ J.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
})), nv = /* @__PURE__ */ J.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ J.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
})), lv = /* @__PURE__ */ J.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ J.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
})), uv = /* @__PURE__ */ J.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ J.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
})), iv = /* @__PURE__ */ J.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true"
}, /* @__PURE__ */ J.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ J.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})), rv = () => {
  const [u, i] = J.useState(document.hidden);
  return J.useEffect(() => {
    const c = () => {
      i(document.hidden);
    };
    return document.addEventListener("visibilitychange", c), () => document.removeEventListener("visibilitychange", c);
  }, []), u;
};
let ov = 1;
const cv = 100, cp = (u) => {
  var i;
  return typeof (u == null ? void 0 : u.id) == "number" || (u == null || (i = u.id) == null ? void 0 : i.length) > 0 ? u.id : ov++;
};
class sv {
  constructor() {
    this.subscribe = (i) => (this.subscribers.push(i), this.getActiveToasts().forEach((c) => i(c)), () => {
      const c = this.subscribers.indexOf(i);
      this.subscribers.splice(c, 1);
    }), this.publish = (i) => {
      this.subscribers.forEach((c) => c(i));
    }, this.addToast = (i) => {
      this.publish(i), this.toasts = [
        ...this.toasts,
        i
      ], this.trimHistory();
    }, this.trimHistory = () => {
      let i = this.toasts.length - cv;
      i <= 0 || (this.toasts = this.toasts.filter((c) => i > 0 && this.dismissedToasts.has(c.id) ? (this.dismissedToasts.delete(c.id), i--, !1) : !0));
    }, this.create = (i) => {
      const { message: c, ...r } = i, d = cp(i), m = this.pendingDismissals.get(d);
      m !== void 0 && (cancelAnimationFrame(m), this.pendingDismissals.delete(d), this.dismissedToasts.delete(d));
      const p = this.dismissedToasts.has(d), v = i.dismissible === void 0 ? !0 : i.dismissible;
      return p && (this.dismissedToasts.delete(d), this.toasts = this.toasts.filter((U) => U.id !== d)), (p ? void 0 : this.toasts.find((U) => U.id === d)) ? this.toasts = this.toasts.map((U) => U.id === d ? (this.publish({
        ...U,
        ...i,
        id: d,
        title: c
      }), {
        ...U,
        ...i,
        id: d,
        dismissible: v,
        title: c
      }) : U) : this.addToast({
        title: c,
        ...r,
        dismissible: v,
        id: d
      }), d;
    }, this.dismiss = (i) => {
      if (i == null)
        return this.getActiveToasts().forEach((r) => {
          this.dismissedToasts.add(r.id), this.subscribers.forEach((d) => d({
            id: r.id,
            dismiss: !0
          }));
        }), i;
      this.dismissedToasts.add(i);
      const c = this.pendingDismissals.get(i);
      return c !== void 0 && cancelAnimationFrame(c), this.pendingDismissals.set(i, requestAnimationFrame(() => {
        this.pendingDismissals.delete(i), this.subscribers.forEach((r) => r({
          id: i,
          dismiss: !0
        }));
      })), i;
    }, this.message = (i, c) => this.create({
      ...c,
      message: i,
      type: void 0
    }), this.error = (i, c) => this.create({
      ...c,
      message: i,
      type: "error"
    }), this.success = (i, c) => this.create({
      ...c,
      type: "success",
      message: i
    }), this.info = (i, c) => this.create({
      ...c,
      type: "info",
      message: i
    }), this.warning = (i, c) => this.create({
      ...c,
      type: "warning",
      message: i
    }), this.loading = (i, c) => this.create({
      ...c,
      type: "loading",
      message: i
    }), this.promise = (i, c) => {
      if (!c)
        return;
      let r;
      c.loading !== void 0 && (r = this.create({
        ...c,
        promise: i,
        type: "loading",
        message: c.loading,
        description: typeof c.description != "function" ? c.description : void 0
      }));
      const d = Promise.resolve(i instanceof Function ? i() : i);
      let m = r !== void 0, p;
      const v = d.then(async (U) => {
        if (p = [
          "resolve",
          U
        ], J.isValidElement(U))
          m = !1, this.create({
            id: r,
            type: "default",
            message: U
          });
        else if (dv(U) && !U.ok) {
          m = !1;
          const s = typeof c.error == "function" ? await c.error(`HTTP error! status: ${U.status}`) : c.error, M = typeof c.description == "function" ? await c.description(`HTTP error! status: ${U.status}`) : c.description, H = typeof s == "object" && !J.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: r,
            type: "error",
            description: M,
            ...H
          });
        } else if (U instanceof Error) {
          m = !1;
          const s = typeof c.error == "function" ? await c.error(U) : c.error, M = typeof c.description == "function" ? await c.description(U) : c.description, H = typeof s == "object" && !J.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: r,
            type: "error",
            description: M,
            ...H
          });
        } else if (c.success !== void 0) {
          m = !1;
          const s = typeof c.success == "function" ? await c.success(U) : c.success, M = typeof c.description == "function" ? await c.description(U) : c.description, H = typeof s == "object" && !J.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: r,
            type: "success",
            description: M,
            ...H
          });
        }
      }).catch(async (U) => {
        if (p = [
          "reject",
          U
        ], c.error !== void 0) {
          m = !1;
          const R = typeof c.error == "function" ? await c.error(U) : c.error, s = typeof c.description == "function" ? await c.description(U) : c.description, Q = typeof R == "object" && !J.isValidElement(R) ? R : {
            message: R
          };
          this.create({
            id: r,
            type: "error",
            description: s,
            ...Q
          });
        }
      }).finally(() => {
        m && (this.dismiss(r), r = void 0), c.finally == null || c.finally.call(c);
      }), S = () => new Promise((U, R) => v.then(() => p[0] === "reject" ? R(p[1]) : U(p[1])).catch(R));
      return typeof r != "string" && typeof r != "number" ? {
        unwrap: S
      } : Object.assign(r, {
        unwrap: S
      });
    }, this.custom = (i, c) => {
      const r = cp(c);
      return this.create({
        ...c,
        jsx: i(r),
        id: r,
        type: void 0
      }), r;
    }, this.getActiveToasts = () => this.toasts.filter((i) => !this.dismissedToasts.has(i.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set(), this.pendingDismissals = /* @__PURE__ */ new Map();
  }
}
const HA = new sv(), fv = (u, i) => HA.message(u, i), dv = (u) => u && typeof u == "object" && "ok" in u && typeof u.ok == "boolean" && "status" in u && typeof u.status == "number", mv = fv, pv = () => HA.toasts, gv = () => HA.getActiveToasts(), sn = Object.assign(mv, {
  success: HA.success,
  info: HA.info,
  warning: HA.warning,
  error: HA.error,
  custom: HA.custom,
  message: HA.message,
  promise: HA.promise,
  dismiss: HA.dismiss,
  loading: HA.loading
}, {
  getHistory: pv,
  getToasts: gv
});
$1("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--normal-text);background:var(--normal-bg);border:1px solid var(--normal-border);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{-webkit-user-select:none;user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function ar(u) {
  return u.label !== void 0;
}
const hv = 3, yv = "24px", vv = "16px", sp = 4e3, bv = 356, Sv = 14, xv = 45, Nv = 200;
function Ke(...u) {
  return u.filter(Boolean).join(" ");
}
function Tv(u) {
  const [i, c] = u.split("-"), r = [];
  return i && r.push(i), c && r.push(c), r;
}
const Uv = (u) => {
  var i, c, r, d, m, p, v, S, U;
  const { invert: R, toast: s, unstyled: M, interacting: Q, setHeights: H, visibleToasts: B, heights: C, index: Y, toasts: X, expanded: nt, removeToast: tt, defaultRichColors: it, closeButton: ct, style: P, cancelButtonStyle: k, actionButtonStyle: mt, className: Gt = "", descriptionClassName: jt = "", duration: rt, position: Lt, gap: Et, expandByDefault: Ut, classNames: q, icons: _, closeButtonAriaLabel: ut = "Close toast" } = u, [ft, Z] = J.useState(null), [Ft, Jt] = J.useState(null), [iA, y] = J.useState(!1), [E, F] = J.useState(!1), [I, dt] = J.useState(!1), [w, $] = J.useState(!1), [G, W] = J.useState(!1), [Mt, rA] = J.useState(0), [GA, oA] = J.useState(0), Kt = J.useRef(s.duration || rt || sp), wt = J.useRef(null), tA = J.useRef(null), ka = Y === 0, Se = Y + 1 <= B, AA = s.type, Ba = AA ?? "default", FA = s.dismissible !== !1, gl = s.className || "", pn = s.descriptionClassName || "", ua = J.useMemo(() => C.findIndex((pt) => pt.toastId === s.id) || 0, [
    C,
    s.id
  ]), Du = J.useMemo(() => {
    var pt;
    return (pt = s.closeButton) != null ? pt : ct;
  }, [
    s.closeButton,
    ct
  ]), fe = J.useMemo(() => s.duration || rt || sp, [
    s.duration,
    rt
  ]), Ya = J.useRef(0), xe = J.useRef(0), Ru = J.useRef(0), Be = J.useRef(null), [hl, yl] = Lt.split("-"), gn = J.useMemo(() => C.reduce((pt, eA, It) => It >= ua ? pt : pt + eA.height, 0), [
    C,
    ua
  ]), Ou = rv(), $A = J.useMemo(() => {
    var pt;
    return (pt = u.swipeDirections) != null ? pt : Tv(Lt);
  }, [
    u.swipeDirections,
    Lt
  ]), MA = s.invert || R, vl = AA === "loading";
  xe.current = J.useMemo(() => ua * Et + gn, [
    ua,
    gn
  ]), J.useEffect(() => {
    Kt.current = fe;
  }, [
    fe
  ]), J.useEffect(() => {
    y(!0);
  }, []), J.useEffect(() => {
    const pt = tA.current;
    if (pt) {
      const eA = pt.getBoundingClientRect().height;
      return oA(eA), H((It) => [
        {
          toastId: s.id,
          height: eA,
          position: s.position
        },
        ...It
      ]), () => H((It) => It.filter((Bt) => Bt.toastId !== s.id));
    }
  }, [
    H,
    s.id
  ]), J.useLayoutEffect(() => {
    if (!iA) return;
    const pt = tA.current, eA = pt.style.height;
    pt.style.height = "auto";
    const It = pt.getBoundingClientRect().height;
    pt.style.height = eA, oA(It), H((Bt) => Bt.find((Rt) => Rt.toastId === s.id) ? Bt.map((Rt) => Rt.toastId === s.id ? {
      ...Rt,
      height: It
    } : Rt) : [
      {
        toastId: s.id,
        height: It,
        position: s.position
      },
      ...Bt
    ]);
  }, [
    iA,
    s.title,
    s.description,
    H,
    s.id,
    s.jsx,
    s.action,
    s.cancel
  ]);
  const de = J.useCallback(() => {
    F(!0), rA(xe.current), H((pt) => pt.filter((eA) => eA.toastId !== s.id)), setTimeout(() => {
      tt(s);
    }, Nv);
  }, [
    s,
    tt,
    H,
    xe
  ]);
  J.useEffect(() => {
    if (s.promise && AA === "loading" || s.duration === 1 / 0 || s.type === "loading") return;
    let pt;
    return nt || Q || Ou ? (() => {
      if (Ru.current < Ya.current) {
        const Bt = (/* @__PURE__ */ new Date()).getTime() - Ya.current;
        Kt.current = Kt.current - Bt;
      }
      Ru.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      Kt.current !== 1 / 0 && (Ya.current = (/* @__PURE__ */ new Date()).getTime(), pt = setTimeout(() => {
        s.onAutoClose == null || s.onAutoClose.call(s, s), de();
      }, Kt.current));
    })(), () => clearTimeout(pt);
  }, [
    nt,
    Q,
    s,
    AA,
    Ou,
    de
  ]), J.useEffect(() => {
    s.delete && (de(), s.onDismiss == null || s.onDismiss.call(s, s));
  }, [
    de,
    s.delete
  ]);
  function bl() {
    var pt;
    if (_ != null && _.loading) {
      var eA;
      return /* @__PURE__ */ J.createElement("div", {
        className: Ke(q == null ? void 0 : q.loader, s == null || (eA = s.classNames) == null ? void 0 : eA.loader, "sonner-loader"),
        "data-visible": AA === "loading"
      }, _.loading);
    }
    return /* @__PURE__ */ J.createElement(ev, {
      className: Ke(q == null ? void 0 : q.loader, s == null || (pt = s.classNames) == null ? void 0 : pt.loader),
      visible: AA === "loading"
    });
  }
  const hn = s.icon || (_ == null ? void 0 : _[AA]) || tv(AA);
  var Eu, Sl;
  return /* @__PURE__ */ J.createElement("li", {
    tabIndex: 0,
    ref: tA,
    className: Ke(Gt, gl, q == null ? void 0 : q.toast, s == null || (i = s.classNames) == null ? void 0 : i.toast, q == null ? void 0 : q[Ba], s == null || (c = s.classNames) == null ? void 0 : c[Ba]),
    "data-sonner-toast": "",
    "data-rich-colors": (Eu = s.richColors) != null ? Eu : it,
    "data-styled": !(s.jsx || s.unstyled || M),
    "data-mounted": iA,
    "data-promise": !!s.promise,
    "data-swiped": G,
    "data-removed": E,
    "data-visible": Se,
    "data-y-position": hl,
    "data-x-position": yl,
    "data-index": Y,
    "data-front": ka,
    "data-swiping": I,
    "data-dismissible": FA,
    "data-type": AA,
    "data-invert": MA,
    "data-swipe-out": w,
    "data-swipe-direction": Ft,
    "data-expanded": !!(nt || Ut && iA),
    "data-testid": s.testId,
    style: {
      "--index": Y,
      "--toasts-before": Y,
      "--z-index": X.length - Y,
      "--offset": `${E ? Mt : xe.current}px`,
      "--initial-height": Ut ? "auto" : `${GA}px`,
      ...P,
      ...s.style
    },
    onDragEnd: () => {
      dt(!1), Z(null), Be.current = null;
    },
    onPointerDown: (pt) => {
      pt.button !== 2 && (vl || !FA || (wt.current = /* @__PURE__ */ new Date(), rA(xe.current), pt.target.setPointerCapture(pt.pointerId), pt.target.tagName !== "BUTTON" && (dt(!0), Be.current = {
        x: pt.clientX,
        y: pt.clientY
      })));
    },
    onPointerUp: () => {
      var pt, eA, It;
      if (w || !FA) return;
      Be.current = null;
      const Bt = Number(((pt = tA.current) == null ? void 0 : pt.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), VA = Number(((eA = tA.current) == null ? void 0 : eA.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), Rt = (/* @__PURE__ */ new Date()).getTime() - ((It = wt.current) == null ? void 0 : It.getTime()), KA = ft === "x" ? Bt : VA, te = Math.abs(KA) / Rt;
      if ((ft === "x" ? $A.includes(Bt > 0 ? "right" : "left") : $A.includes(VA > 0 ? "bottom" : "top")) && (Math.abs(KA) >= xv || te > 0.11)) {
        rA(xe.current), s.onDismiss == null || s.onDismiss.call(s, s), Jt(ft === "x" ? Bt > 0 ? "right" : "left" : VA > 0 ? "down" : "up"), de(), $(!0);
        return;
      } else {
        var zA, ia;
        (zA = tA.current) == null || zA.style.setProperty("--swipe-amount-x", "0px"), (ia = tA.current) == null || ia.style.setProperty("--swipe-amount-y", "0px");
      }
      W(!1), dt(!1), Z(null);
    },
    onPointerMove: (pt) => {
      var eA, It, Bt;
      if (!Be.current || !FA || ((eA = window.getSelection()) == null ? void 0 : eA.toString().length) > 0) return;
      const Rt = pt.clientY - Be.current.y, KA = pt.clientX - Be.current.x;
      !ft && (Math.abs(KA) > 1 || Math.abs(Rt) > 1) && Z(Math.abs(KA) > Math.abs(Rt) ? "x" : "y");
      let te = {
        x: 0,
        y: 0
      };
      const xl = (zA) => 1 / (1.5 + Math.abs(zA) / 20);
      if (ft === "y") {
        if ($A.includes("top") || $A.includes("bottom"))
          if ($A.includes("top") && Rt < 0 || $A.includes("bottom") && Rt > 0)
            te.y = Rt;
          else {
            const zA = Rt * xl(Rt);
            te.y = Math.abs(zA) < Math.abs(Rt) ? zA : Rt;
          }
      } else if (ft === "x" && ($A.includes("left") || $A.includes("right")))
        if ($A.includes("left") && KA < 0 || $A.includes("right") && KA > 0)
          te.x = KA;
        else {
          const zA = KA * xl(KA);
          te.x = Math.abs(zA) < Math.abs(KA) ? zA : KA;
        }
      (Math.abs(te.x) > 0 || Math.abs(te.y) > 0) && W(!0), (It = tA.current) == null || It.style.setProperty("--swipe-amount-x", `${te.x}px`), (Bt = tA.current) == null || Bt.style.setProperty("--swipe-amount-y", `${te.y}px`);
    }
  }, Du && !s.jsx && AA !== "loading" ? /* @__PURE__ */ J.createElement("button", {
    "aria-label": ut,
    "data-disabled": vl,
    "data-close-button": !0,
    onClick: vl || !FA ? () => {
    } : () => {
      de(), s.onDismiss == null || s.onDismiss.call(s, s);
    },
    className: Ke(q == null ? void 0 : q.closeButton, s == null || (r = s.classNames) == null ? void 0 : r.closeButton)
  }, (Sl = _ == null ? void 0 : _.close) != null ? Sl : iv) : null, (AA || s.icon || s.promise) && s.icon !== null && ((_ == null ? void 0 : _[AA]) !== null || s.icon) ? /* @__PURE__ */ J.createElement("div", {
    "data-icon": "",
    className: Ke(q == null ? void 0 : q.icon, s == null || (d = s.classNames) == null ? void 0 : d.icon)
  }, AA === "loading" ? s.icon || bl() : s.promise ? bl() : null, AA !== "loading" ? hn : null) : null, /* @__PURE__ */ J.createElement("div", {
    "data-content": "",
    className: Ke(q == null ? void 0 : q.content, s == null || (m = s.classNames) == null ? void 0 : m.content)
  }, /* @__PURE__ */ J.createElement("div", {
    "data-title": "",
    className: Ke(q == null ? void 0 : q.title, s == null || (p = s.classNames) == null ? void 0 : p.title)
  }, s.jsx ? s.jsx : typeof s.title == "function" ? s.title() : s.title), s.description ? /* @__PURE__ */ J.createElement("div", {
    "data-description": "",
    className: Ke(jt, pn, q == null ? void 0 : q.description, s == null || (v = s.classNames) == null ? void 0 : v.description)
  }, typeof s.description == "function" ? s.description() : s.description) : null), /* @__PURE__ */ J.isValidElement(s.cancel) ? s.cancel : s.cancel && ar(s.cancel) ? /* @__PURE__ */ J.createElement("button", {
    "data-button": !0,
    "data-cancel": !0,
    style: s.cancelButtonStyle || k,
    onClick: (pt) => {
      ar(s.cancel) && FA && (s.cancel.onClick == null || s.cancel.onClick.call(s.cancel, pt), de());
    },
    className: Ke(q == null ? void 0 : q.cancelButton, s == null || (S = s.classNames) == null ? void 0 : S.cancelButton)
  }, s.cancel.label) : null, /* @__PURE__ */ J.isValidElement(s.action) ? s.action : s.action && ar(s.action) ? /* @__PURE__ */ J.createElement("button", {
    "data-button": !0,
    "data-action": !0,
    style: s.actionButtonStyle || mt,
    onClick: (pt) => {
      ar(s.action) && (s.action.onClick == null || s.action.onClick.call(s.action, pt), !pt.defaultPrevented && de());
    },
    className: Ke(q == null ? void 0 : q.actionButton, s == null || (U = s.classNames) == null ? void 0 : U.actionButton)
  }, s.action.label) : null);
};
function fp() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const u = document.documentElement.getAttribute("dir");
  return u === "auto" || !u ? window.getComputedStyle(document.documentElement).direction : u;
}
function Mv(u, i) {
  const c = {};
  return [
    u,
    i
  ].forEach((r, d) => {
    const m = d === 1, p = m ? "--mobile-offset" : "--offset", v = m ? vv : yv;
    function S(U) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((R) => {
        c[`${p}-${R}`] = typeof U == "number" ? `${U}px` : U;
      });
    }
    typeof r == "number" || typeof r == "string" ? S(r) : typeof r == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((U) => {
      r[U] === void 0 ? c[`${p}-${U}`] = v : c[`${p}-${U}`] = typeof r[U] == "number" ? `${r[U]}px` : r[U];
    }) : S(v);
  }), c;
}
const zv = /* @__PURE__ */ J.forwardRef(function(i, c) {
  const { id: r, invert: d, position: m = "bottom-right", hotkey: p = [
    "altKey",
    "KeyT"
  ], expand: v, closeButton: S, className: U, offset: R, mobileOffset: s, theme: M = "light", richColors: Q, duration: H, style: B, visibleToasts: C = hv, toastOptions: Y, dir: X = fp(), gap: nt = Sv, icons: tt, customAriaLabel: it, containerAriaLabel: ct = "Notifications" } = i, [P, k] = J.useState([]), mt = J.useMemo(() => r ? P.filter((y) => y.toasterId === r) : P.filter((y) => !y.toasterId), [
    P,
    r
  ]), Gt = J.useMemo(() => Array.from(new Set([
    m
  ].concat(mt.filter((y) => y.position).map((y) => y.position)))), [
    mt,
    m
  ]), [jt, rt] = J.useState([]), [Lt, Et] = J.useState(!1), [Ut, q] = J.useState(!1), [_, ut] = J.useState(M !== "system" ? M : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), ft = J.useRef(null), Z = p.join("+").replace(/Key/g, "").replace(/Digit/g, ""), Ft = J.useRef(null), Jt = J.useRef(!1), iA = J.useCallback((y) => {
    k((E) => {
      var F;
      return (F = E.find((I) => I.id === y.id)) != null && F.delete || HA.dismiss(y.id), E.filter(({ id: I }) => I !== y.id);
    });
  }, []);
  return J.useEffect(() => HA.subscribe((y) => {
    if (y.dismiss) {
      requestAnimationFrame(() => {
        k((E) => E.map((F) => F.id === y.id ? {
          ...F,
          delete: !0
        } : F));
      });
      return;
    }
    setTimeout(() => {
      _1.flushSync(() => {
        k((E) => {
          const F = E.findIndex((I) => I.id === y.id);
          return F !== -1 ? [
            ...E.slice(0, F),
            {
              ...E[F],
              ...y
            },
            ...E.slice(F + 1)
          ] : [
            y,
            ...E
          ];
        });
      });
    });
  }), []), J.useEffect(() => {
    if (M !== "system") {
      ut(M);
      return;
    }
    if (M === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? ut("dark") : ut("light")), typeof window > "u") return;
    const y = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      y.addEventListener("change", ({ matches: E }) => {
        ut(E ? "dark" : "light");
      });
    } catch {
      y.addListener(({ matches: F }) => {
        try {
          ut(F ? "dark" : "light");
        } catch (I) {
          console.error(I);
        }
      });
    }
  }, [
    M
  ]), J.useEffect(() => {
    P.length <= 1 && Et(!1);
  }, [
    P
  ]), J.useEffect(() => {
    const y = (E) => {
      var F;
      if (p.length > 0 && p.every((w) => E[w] || E.code === w)) {
        var dt;
        Et(!0), (dt = ft.current) == null || dt.focus();
      }
      E.code === "Escape" && (document.activeElement === ft.current || (F = ft.current) != null && F.contains(document.activeElement)) && Et(!1);
    };
    return document.addEventListener("keydown", y), () => document.removeEventListener("keydown", y);
  }, [
    p
  ]), J.useEffect(() => {
    if (ft.current)
      return () => {
        Ft.current && (Ft.current.focus({
          preventScroll: !0
        }), Ft.current = null, Jt.current = !1);
      };
  }, [
    ft.current
  ]), // Remove item from normal navigation flow, only available via hotkey
  /* @__PURE__ */ J.createElement("section", {
    ref: c,
    "aria-label": it ?? `${ct} ${Z}`,
    tabIndex: -1,
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-atomic": "false",
    suppressHydrationWarning: !0,
    "data-react-aria-top-layer": !0
  }, Gt.map((y, E) => {
    var F;
    const [I, dt] = y.split("-");
    return mt.length ? /* @__PURE__ */ J.createElement("ol", {
      key: y,
      dir: X === "auto" ? fp() : X,
      tabIndex: -1,
      ref: ft,
      className: U,
      "data-sonner-toaster": !0,
      "data-sonner-theme": _,
      "data-y-position": I,
      "data-x-position": dt,
      style: {
        "--front-toast-height": `${((F = jt[0]) == null ? void 0 : F.height) || 0}px`,
        "--width": `${bv}px`,
        "--gap": `${nt}px`,
        ...B,
        ...Mv(R, s)
      },
      onBlur: (w) => {
        Jt.current && !w.currentTarget.contains(w.relatedTarget) && (Jt.current = !1, Ft.current && (Ft.current.focus({
          preventScroll: !0
        }), Ft.current = null));
      },
      onFocus: (w) => {
        w.target instanceof HTMLElement && w.target.dataset.dismissible === "false" || Jt.current || (Jt.current = !0, Ft.current = w.relatedTarget);
      },
      onMouseEnter: () => Et(!0),
      onMouseMove: () => Et(!0),
      onMouseLeave: () => {
        Ut || Et(!1);
      },
      onDragEnd: () => Et(!1),
      onPointerDown: (w) => {
        w.target instanceof HTMLElement && w.target.dataset.dismissible === "false" || q(!0);
      },
      onPointerUp: () => q(!1)
    }, mt.filter((w) => !w.position && E === 0 || w.position === y).map((w, $) => {
      var G, W;
      return /* @__PURE__ */ J.createElement(Uv, {
        key: w.id,
        icons: tt,
        index: $,
        toast: w,
        defaultRichColors: Q,
        duration: (G = Y == null ? void 0 : Y.duration) != null ? G : H,
        className: Y == null ? void 0 : Y.className,
        descriptionClassName: Y == null ? void 0 : Y.descriptionClassName,
        invert: d,
        visibleToasts: C,
        closeButton: (W = Y == null ? void 0 : Y.closeButton) != null ? W : S,
        interacting: Ut,
        position: y,
        style: Y == null ? void 0 : Y.style,
        unstyled: Y == null ? void 0 : Y.unstyled,
        classNames: Y == null ? void 0 : Y.classNames,
        cancelButtonStyle: Y == null ? void 0 : Y.cancelButtonStyle,
        actionButtonStyle: Y == null ? void 0 : Y.actionButtonStyle,
        closeButtonAriaLabel: Y == null ? void 0 : Y.closeButtonAriaLabel,
        removeToast: iA,
        toasts: mt.filter((Mt) => Mt.position == w.position),
        heights: jt.filter((Mt) => Mt.position == w.position),
        setHeights: rt,
        expandByDefault: v,
        gap: nt,
        expanded: Lt,
        swipeDirections: i.swipeDirections
      });
    })) : null;
  }));
});
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jv = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), kp = (...u) => u.filter((i, c, r) => !!i && i.trim() !== "" && r.indexOf(i) === c).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Dv = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rv = z.forwardRef(
  ({
    color: u = "currentColor",
    size: i = 24,
    strokeWidth: c = 2,
    absoluteStrokeWidth: r,
    className: d = "",
    children: m,
    iconNode: p,
    ...v
  }, S) => z.createElement(
    "svg",
    {
      ref: S,
      ...Dv,
      width: i,
      height: i,
      stroke: u,
      strokeWidth: r ? Number(c) * 24 / Number(i) : c,
      className: kp("lucide", d),
      ...v
    },
    [
      ...p.map(([U, R]) => z.createElement(U, R)),
      ...Array.isArray(m) ? m : [m]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TA = (u, i) => {
  const c = z.forwardRef(
    ({ className: r, ...d }, m) => z.createElement(Rv, {
      ref: m,
      iconNode: i,
      className: kp(`lucide-${jv(u)}`, r),
      ...d
    })
  );
  return c.displayName = `${u}`, c;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ov = TA("Bell", [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ev = TA("Bike", [
  ["circle", { cx: "18.5", cy: "17.5", r: "3.5", key: "15x4ox" }],
  ["circle", { cx: "5.5", cy: "17.5", r: "3.5", key: "1noe27" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["path", { d: "M12 17.5V14l-3-3 4-3 2 3h2", key: "1npguv" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vv = TA("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bp = TA("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kv = TA("ChefHat", [
  [
    "path",
    {
      d: "M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z",
      key: "1qvrer"
    }
  ],
  ["path", { d: "M6 17h12", key: "1jwigz" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wv = TA("Flame", [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yp = TA("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cv = TA("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qv = TA("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hp = TA("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kv = TA("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gp = TA("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bv = TA("ShoppingBag", [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yv = TA("SlidersHorizontal", [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hv = TA("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dp = TA("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gv = TA("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function Fv({ actorName: u, actorRole: i, pendingCount: c, onMenu: r, onBell: d, onSearch: m }) {
  const p = new Intl.DateTimeFormat("ar-EG", { timeZone: "Africa/Cairo", weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" }).format(/* @__PURE__ */ new Date());
  return /* @__PURE__ */ h.jsx("header", { className: "sticky top-0 z-30 border-b border-border/70 bg-surface/80 backdrop-blur-xl", children: /* @__PURE__ */ h.jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5 sm:py-3", children: [
    /* @__PURE__ */ h.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ h.jsx(
        "button",
        {
          type: "button",
          "aria-label": "القائمة",
          onClick: r,
          className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground",
          children: /* @__PURE__ */ h.jsx(Cv, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ h.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ h.jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground", children: /* @__PURE__ */ h.jsx(Kv, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ h.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ h.jsxs("p", { className: "text-lg font-extrabold tracking-tight", children: [
            "CARD",
            /* @__PURE__ */ h.jsx("span", { className: "text-brand", children: "fy" })
          ] }),
          /* @__PURE__ */ h.jsx("p", { className: "hidden text-[11px] text-muted-foreground sm:block", children: "Restaurant POS" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "relative hidden min-w-0 md:block", children: [
      /* @__PURE__ */ h.jsx(Gp, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ h.jsx(
        "input",
        {
          type: "search",
          onChange: (v) => m(v.target.value),
          placeholder: "ابحث عن منتج، صنف، أو استخدم الكود ...",
          className: "h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-16 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/60"
        }
      ),
      /* @__PURE__ */ h.jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground", children: "Ctrl + K" })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 py-2 text-xs text-muted-foreground xl:flex", children: [
        /* @__PURE__ */ h.jsx(Vv, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ h.jsx("span", { className: "whitespace-nowrap", children: p })
      ] }),
      /* @__PURE__ */ h.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "الإشعارات",
          onClick: d,
          className: "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:text-foreground",
          children: [
            /* @__PURE__ */ h.jsx(Ov, { className: "h-5 w-5" }),
            c > 0 && /* @__PURE__ */ h.jsx("span", { className: "absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground", children: c > 99 ? "99+" : c })
          ]
        }
      ),
      /* @__PURE__ */ h.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-2 py-1.5 sm:px-3", children: [
        /* @__PURE__ */ h.jsx("span", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold", children: u.trim().split(/\s+/).slice(0, 2).map((v) => v[0]).join("") || "C" }),
        /* @__PURE__ */ h.jsxs("div", { className: "hidden leading-tight sm:block", children: [
          /* @__PURE__ */ h.jsx("p", { className: "text-xs font-bold", children: u }),
          /* @__PURE__ */ h.jsx("p", { className: "text-[11px] text-muted-foreground", children: i })
        ] })
      ] })
    ] })
  ] }) });
}
const Fp = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/61VfSlACEQAAAAEAAFVVanVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAVS9qdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOmQzYjRiMjAzLTUxMDgtNDhiNS1hM2JiLTE0MzQ5YTlkYTAwOQAAAAxXanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAJ0Wp1bWIAAAA7anVtZEDLDDK7ikidpwsq1vR/Q2kTYzJwYS5pY29uAAAAABhjMnNo40M+L4h8uaaeFnBWkzcFmAAAABdiZmRiAGltYWdlL3N2Zyt4bWwAAAAJd2JpZGI8c3ZnIHdpZHRoPSI3MTYiIGhlaWdodD0iNzE2IiB2aWV3Qm94PSIwIDAgNzE2IDcxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUwOC43NDkgMzE3LjM5OUM1MTYuNzc3IDI4Ny4zMTQgNTA4Ljk5MSAyNTMuODg0IDQ4NS4zODkgMjMwLjI4MkM0NjEuNzg4IDIwNi42ODEgNDI4LjM2IDE5OC44OTUgMzk4LjI3MyAyMDYuOTIzQzM3Ni4yMzEgMTg0LjkyOCAzNDMuMzkgMTc0Ljk1NiAzMTEuMTQ4IDE4My41OTZDMjc4LjkwNiAxOTIuMjM0IDI1NS40NSAyMTcuMjkyIDI0Ny4zNiAyNDcuMzYxQzIxNy4yOTEgMjU1LjQ1MSAxOTIuMjMzIDI3OC45MSAxODMuNTk1IDMxMS4xNDlDMTc0Ljk1NyAzNDMuMzkxIDE4NC45MjcgMzc2LjIzMiAyMDYuOTI0IDM5OC4yNzRDMTk4Ljg5NiA0MjguMzU5IDIwNi42ODMgNDYxLjc4OSAyMzAuMjg0IDQ4NS4zOTFDMjUzLjg4NSA1MDguOTkyIDI4Ny4zMTMgNTE2Ljc3OSAzMTcuNDAxIDUwOC43NUMzMzkuNDQyIDUzMC43NDUgMzcyLjI4NiA1NDAuNzE3IDQwNC41MjUgNTMyLjA3OUM0MzYuNzY3IDUyMy40NDEgNDYwLjIyMyA0OTguMzg0IDQ2OC4zMTMgNDY4LjMxNUM0OTguMzgzIDQ2MC4yMjQgNTIzLjQ0IDQzNi43NjYgNTMyLjA3OCA0MDQuNTI2QzU0MC43MTYgMzcyLjI4NSA1MzAuNzQ3IDMzOS40NDMgNTA4Ljc0OSAzMTcuNDAyVjMxNy4zOTlaTTQ3MC44OTkgMjQ0Ljc3NkM0ODYuODkyIDI2MC43NyA0OTMuNDg4IDI4Mi42MDEgNDkwLjY4NyAzMDMuNDEyTDQxNS41NzcgMjYwLjA0NkM0MTIuNDExIDI1OC4yMTggNDA4LjUwOSAyNTguMjE4IDQwNS4zNDUgMjYwLjA0NkwzMTcuNDAxIDMxMC44MlYyNzcuNTI2QzMxNy40MDEgMjc1LjE5MSAzMTguNjUyIDI3My4wMDUgMzIwLjY3NiAyNzEuODM3TDM4Ny42NDQgMjMzLjE3NEM0MTQuMTc4IDIxOC4zNTMgNDQ4LjM0NiAyMjIuMjIzIDQ3MC45MDEgMjQ0Ljc3Nkg0NzAuODk5Wk0zNTcuODM3IDMxMS4xNDRMMzk4LjI3NSAzMzQuNDkxVjM4MS4xODVMMzU3LjgzNyA0MDQuNTMyTDMxNy4zOTggMzgxLjE4NVYzMzQuNDkxTDM1Ny44MzcgMzExLjE0NFpNMjY0Ljc3NiAyNjkuNjkzQzI2NS4yMDcgMjM5LjMwNSAyODUuNjQ0IDIxMS42NDkgMzE2LjQ1MyAyMDMuMzkzQzMzOC4zIDE5Ny41NCAzNjAuNTA1IDIwMi43NDQgMzc3LjEyNyAyMTUuNTczTDMwMi4wMTQgMjU4LjkzN0MyOTguODQ4IDI2MC43NjQgMjk2Ljg5OCAyNjQuMTQ0IDI5Ni44OTggMjY3Ljc5OFYzNjkuMzQ2TDI2OC4wNjUgMzUyLjY5OUMyNjYuMDQzIDM1MS41MzEgMjY0Ljc3NiAzNDkuMzUzIDI2NC43NzYgMzQ3LjAxN1YyNjkuNjkxVjI2OS42OTNaTTIwMy4zOTEgMzE2LjQ1NEMyMDkuMjQ0IDI5NC42MDggMjI0Ljg1NCAyNzcuOTc4IDI0NC4yNzYgMjY5Ljk5OVYzNTYuNzNDMjQ0LjI3NiAzNjAuMzg0IDI0Ni4yMjYgMzYzLjc2MyAyNDkuMzkyIDM2NS41OTFMMzM3LjMzNyA0MTYuMzY1TDMwOC41MDMgNDMzLjAxM0MzMDYuNDgxIDQzNC4xODEgMzAzLjk2MSA0MzQuMTg4IDMwMS45MzkgNDMzLjAyTDIzNC45NzEgMzk0LjM1N0MyMDguODY4IDM3OC43ODkgMTk1LjEzOCAzNDcuMjYxIDIwMy4zOTEgMzE2LjQ1NFpNMjQ0Ljc3NSA0NzAuOUMyMjguNzgxIDQ1NC45MDYgMjIyLjE4NiA0MzMuMDc1IDIyNC45ODYgNDEyLjI2NEwzMDAuMDk2IDQ1NS42M0MzMDMuMjYzIDQ1Ny40NTcgMzA3LjE2NCA0NTcuNDU3IDMxMC4zMjggNDU1LjYzTDM5OC4yNzMgNDA0Ljg1NlY0MzguMTQ5QzM5OC4yNzMgNDQwLjQ4NSAzOTcuMDIyIDQ0Mi42NzEgMzk0Ljk5NyA0NDMuODM5TDMyOC4wMjkgNDgyLjUwMkMzMDEuNDk1IDQ5Ny4zMjIgMjY3LjMyNyA0OTMuNDUyIDI0NC43NzIgNDcwLjlIMjQ0Ljc3NVpNNDUwLjg5NyA0NDUuOTgyQzQ1MC40NjYgNDc2LjM3MSA0MzAuMDI5IDUwNC4wMjcgMzk5LjIyIDUxMi4yODNDMzc3LjM3MyA1MTguMTM2IDM1NS4xNjggNTEyLjkzMiAzMzguNTQ3IDUwMC4xMDJMNDEzLjY1OSA0NTYuNzM4QzQxNi44MjYgNDU0LjkxMSA0MTguNzc1IDQ1MS41MzIgNDE4Ljc3NSA0NDcuODc3VjM0Ni4zMjlMNDQ3LjYwOSAzNjIuOTc3QzQ0OS42MzEgMzY0LjE0NSA0NTAuODk3IDM2Ni4zMjMgNDUwLjg5NyAzNjguNjU5VjQ0NS45ODVWNDQ1Ljk4MlpNNTEyLjI4MiAzOTkuMjIxQzUwNi40MjkgNDIxLjA2OCA0OTAuODE5IDQzNy42OTcgNDcxLjM5NyA0NDUuNjc2VjM1OC45NDZDNDcxLjM5NyAzNTUuMjkyIDQ2OS40NDggMzUxLjkxMiA0NjYuMjgxIDM1MC4wODVMMzc4LjMzNiAyOTkuMzExTDQwNy4xNyAyODIuNjYzQzQwOS4xOTIgMjgxLjQ5NSA0MTEuNzEyIDI4MS40ODcgNDEzLjczNCAyODIuNjU1TDQ4MC43MDIgMzIxLjMxOEM1MDYuODA1IDMzNi44ODcgNTIwLjUzNiAzNjguNDE1IDUxMi4yODIgMzk5LjIyMVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgoAAAGSanVtYgAAAEFqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmFjdGlvbnMudjIAAAAAGGMyc2gc/SpNJILAWAEEuKIL2C5OAAABSWNib3KiZ2FjdGlvbnODpGZhY3Rpb25sYzJwYS5jcmVhdGVkZHdoZW7AdDIwMjYtMDktMTZUMDA6MDA6MDBabXNvZnR3YXJlQWdlbnSiZG5hbWVpZ3B0LWltYWdlZ3ZlcnNpb25jMi4wcWRpZ2l0YWxTb3VyY2VUeXBleEZodHRwOi8vY3YuaXB0Yy5vcmcvbmV3c2NvZGVzL2RpZ2l0YWxzb3VyY2V0eXBlL3RyYWluZWRBbGdvcml0aG1pY01lZGlhomZhY3Rpb25uYzJwYS5jb252ZXJ0ZWRkd2hlbsB0MjAyNi0wOS0xNlQwMDowMDowMFqiZmFjdGlvbngYYzJwYS53YXRlcm1hcmtlZC51bmJvdW5kZHdoZW7AdDIwMjYtMDktMTZUMDA6MDA6MDBacmFsbEFjdGlvbnNJbmNsdWRlZPQAAADDanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaEk1xavNpVEoTQZHeQHkrxMAAAB7Y2JvcqVqZXhjbHVzaW9uc4GiZXN0YXJ0FGZsZW5ndGgZVWFkbmFtZW5qdW1iZiBtYW5pZmVzdGNhbGdmc2hhMjU2ZGhhc2hYIBRRW3qAHOQ4mYJpD1Ah5OMK3WI4zp28cMK548ekTGw5Y3BhZEkAAAAAAAAAAAAAAAK7anVtYgAAACdqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltLnYyAAAAAoxjYm9ypmppbnN0YW5jZUlEeCx4bXA6aWlkOjk5MDhmYzI5LWIzMGItNDMxOC05NGE2LThhZjkwODRkNGJkMnRjbGFpbV9nZW5lcmF0b3JfaW5mb6RkbmFtZXgYT3BlbkFJIE1lZGlhIFNlcnZpY2UgQVBJZGljb26iY3VybHgkc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pY29uZGhhc2hYINOe8PYuMp1owJ2vzKHEZzbItLPSSBDVk/j7+lWEfyEfa3NwZWNWZXJzaW9uZTIuMi4wd29yZy5jb250ZW50YXV0aC5jMnBh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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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", rs = [{ id: "all", name: "الكل" }], pr = [], _A = {}, gr = [], Zv = (u) => {
  const i = String(u || "").trim();
  return /^(?:https:\/\/|\/(?!\/)|data:image\/(?:png|jpe?g|webp|gif);base64,)/i.test(i) ? i : Fp;
};
function Qv(u, i) {
  var c;
  rs.splice(1, rs.length, ...(u.categories || []).map((r) => ({ id: r.id, name: r.name_ar || r.name_en || "قسم" }))), pr.splice(0), gr.splice(0), Object.keys(_A).forEach((r) => delete _A[r]);
  for (const r of u.products || []) {
    if (!r.available) continue;
    const d = [];
    if ((c = r.variants) != null && c.length) {
      const m = `variant:${r.id}`;
      d.push(m), _A[m] = { id: m, name: "الحجم", multi: !1, required: !!r.variant_required, min: r.variant_required ? 1 : 0, max: 1, kind: "variant", options: r.variants.map((p) => ({ id: p.id, name: p.name, price: Number(p.price || 0) - Number(r.base_price || 0), rawPrice: Number(p.price || 0) })) };
    }
    for (const m of r.option_groups || []) {
      const p = `option:${m.id}`;
      d.push(p), _A[p] = { id: p, name: m.name, multi: Number(m.max_select || 1) > 1, required: !!m.required || Number(m.min_select || 0) > 0, min: Math.max(m.required ? 1 : 0, Number(m.min_select || 0)), max: Math.max(1, Number(m.max_select || 1)), kind: "option", options: (m.options || []).map((v) => ({ id: v.id, name: v.name, price: Number(v.price_delta || 0), rawPrice: Number(v.price_delta || 0) })) };
    }
    pr.push({ id: r.id, name: r.name_ar || r.name_en || "منتج", price: Number(r.base_price || 0), category: r.category_id, image: Zv(r.image_url), badge: r.badge || (r.is_featured ? "الأكثر مبيعاً" : r.is_new ? "جديد" : void 0), groups: d });
  }
  gr.push(...(u.delivery_zones || []).filter((r) => !r.branch_id || r.branch_id === i).map((r) => ({ id: r.id, name: r.name, fee: Number(r.fee || 0), branch_id: r.branch_id })));
}
const na = (u) => `EGP ${u.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, xu = (u) => pr.find((i) => i.id === u), Jv = (u) => Object.fromEntries(u.groups.map((i) => [i, []])), Zp = (u) => u.groups.some((i) => {
  const c = _A[i];
  return !!(c && (c.required || c.min > 0));
}), Qp = (u) => xu(u.productId).groups.flatMap((i) => {
  const c = _A[i], r = (u.selections[i] || []).length;
  return c && (r < c.min || r > c.max) ? [c.name] : [];
}), mp = (u, i) => u + "|" + Object.keys(i).sort().map((c) => `${c}:${[...i[c] || []].sort().join(",")}`).join("|"), Wv = (u) => xu(u.productId).price + Object.entries(u.selections).reduce((i, [c, r]) => i + r.reduce((d, m) => {
  var p, v;
  return d + (((v = (p = _A[c]) == null ? void 0 : p.options.find((S) => S.id === m)) == null ? void 0 : v.price) || 0);
}, 0), 0), Jp = (u) => Wv(u) * u.quantity, Lv = (u) => Object.entries(u.selections).flatMap(([i, c]) => c.map((r) => {
  var d, m;
  return (m = (d = _A[i]) == null ? void 0 : d.options.find((p) => p.id === r)) == null ? void 0 : m.name;
}).filter(Boolean));
function Xv({ onAdd: u, externalQuery: i = "" }) {
  const [c, r] = z.useState("all"), [d, m] = z.useState(""), [p, v] = z.useState(""), [S, U] = z.useState(""), R = z.useMemo(
    () => pr.filter(
      (s) => {
        var M, Q;
        return (c === "all" || s.category === c) && (d.trim() === "" || s.name.includes(d.trim())) && (i.trim() === "" || s.name.includes(i.trim())) && (p !== "popular" || ((M = s.badge) == null ? void 0 : M.includes("مبيع"))) && (p !== "new" || ((Q = s.badge) == null ? void 0 : Q.includes("جديد")));
      }
    ).sort((s, M) => S === "asc" ? s.price - M.price : S === "desc" ? M.price - s.price : 0),
    [c, d, i, p, S]
  );
  return /* @__PURE__ */ h.jsxs("section", { className: "flex min-h-0 min-w-0 flex-col gap-3", children: [
    /* @__PURE__ */ h.jsxs("div", { className: "relative h-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-36", children: [
      /* @__PURE__ */ h.jsx(
        "img",
        {
          src: Fp,
          alt: "شاورما البلد",
          width: 1536,
          height: 512,
          className: "h-full w-full object-cover"
        }
      ),
      /* @__PURE__ */ h.jsx("div", { className: "absolute inset-0 bg-gradient-to-l from-background/20 via-background/70 to-background/95" }),
      /* @__PURE__ */ h.jsxs("div", { className: "absolute inset-0 flex flex-col justify-center gap-1 px-4 sm:px-6", children: [
        /* @__PURE__ */ h.jsxs("h1", { className: "text-xl font-extrabold tracking-tight sm:text-3xl", children: [
          "طعم أصيل ",
          /* @__PURE__ */ h.jsx("span", { className: "text-brand", children: ".." }),
          " لكل وقت"
        ] }),
        /* @__PURE__ */ h.jsx("p", { className: "text-xs text-muted-foreground sm:text-sm", children: "شاورما • وجبات • مقليات • مشروبات" })
      ] })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "flex shrink-0 gap-2 overflow-x-auto pos-scroll pb-1", children: rs.map((s) => {
      const M = s.id === c;
      return /* @__PURE__ */ h.jsx(
        "button",
        {
          type: "button",
          onClick: () => r(s.id),
          className: `shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${M ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]" : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"}`,
          children: s.name
        },
        s.id
      );
    }) }),
    /* @__PURE__ */ h.jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "relative min-w-0 flex-1", children: [
        /* @__PURE__ */ h.jsx(Gp, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ h.jsx(
          "input",
          {
            value: d,
            onChange: (s) => m(s.target.value),
            type: "search",
            placeholder: "ابحث عن منتج ...",
            className: "h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
          }
        )
      ] }),
      /* @__PURE__ */ h.jsx(ts, { icon: /* @__PURE__ */ h.jsx(wv, { className: "h-4 w-4 text-brand" }), label: "الأكثر مبيعاً", active: p === "popular", onClick: () => v((s) => s === "popular" ? "" : "popular") }),
      /* @__PURE__ */ h.jsx(ts, { icon: /* @__PURE__ */ h.jsx(Hv, { className: "h-4 w-4 text-brand" }), label: "جديد", active: p === "new", onClick: () => v((s) => s === "new" ? "" : "new") }),
      /* @__PURE__ */ h.jsx(ts, { icon: /* @__PURE__ */ h.jsx(Yv, { className: "h-4 w-4" }), label: "تصفية", active: !!S, onClick: () => U((s) => s === "" ? "asc" : s === "asc" ? "desc" : "") })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto pos-scroll pl-1", children: [
      /* @__PURE__ */ h.jsx("div", { className: "grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 xl:grid-cols-4", children: R.map((s) => /* @__PURE__ */ h.jsxs(
        "button",
        {
          type: "button",
          onClick: () => u(s),
          className: "group relative overflow-hidden rounded-2xl border border-border bg-card text-right transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[var(--shadow-brand)]",
          children: [
            /* @__PURE__ */ h.jsxs("div", { className: "relative aspect-[4/3] overflow-hidden", children: [
              /* @__PURE__ */ h.jsx(
                "img",
                {
                  src: s.image,
                  alt: s.name,
                  loading: "lazy",
                  width: 816,
                  height: 816,
                  className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                }
              ),
              s.badge && /* @__PURE__ */ h.jsx("span", { className: "absolute right-2 top-2 rounded-lg brand-gradient px-2 py-0.5 text-[11px] font-bold text-brand-foreground", children: s.badge }),
              Zp(s) && /* @__PURE__ */ h.jsx("span", { className: "absolute left-2 top-2 rounded-md border border-brand/50 bg-surface/80 px-1.5 py-0.5 text-[10px] font-bold text-brand backdrop-blur-xl", children: "اختيار مطلوب" })
            ] }),
            /* @__PURE__ */ h.jsxs("div", { className: "flex items-center justify-between gap-2 p-3", children: [
              /* @__PURE__ */ h.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ h.jsx("p", { className: "line-clamp-2 text-sm font-bold leading-snug", children: s.name }),
                /* @__PURE__ */ h.jsx("p", { className: "mt-1 text-sm font-extrabold text-brand", dir: "ltr", children: na(s.price) })
              ] }),
              /* @__PURE__ */ h.jsx("span", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground", children: /* @__PURE__ */ h.jsx(Hp, { className: "h-5 w-5" }) })
            ] })
          ]
        },
        s.id
      )) }),
      R.length === 0 && /* @__PURE__ */ h.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "لا توجد منتجات مطابقة" })
    ] })
  ] });
}
function ts({ icon: u, label: i, onClick: c, active: r }) {
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      type: "button",
      onClick: c,
      "aria-pressed": r,
      className: "flex h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
      children: [
        u,
        i
      ]
    }
  );
}
function Iv({
  orderType: u,
  onOrderTypeChange: i,
  lines: c,
  onSelectLine: r,
  onQuantity: d,
  onRemove: m,
  onClearAll: p,
  notes: v,
  onNotesChange: S,
  subtotal: U,
  deliveryFee: R,
  zoneName: s,
  hasAddress: M,
  onOpenAddress: Q,
  onSaveOrder: H,
  onComplete: B,
  deliveryEnabled: C
}) {
  const Y = u === "delivery", X = U + (Y ? R : 0), nt = c.reduce((tt, it) => tt + it.quantity, 0);
  return /* @__PURE__ */ h.jsxs("aside", { className: "flex min-h-0 min-w-0 flex-col gap-3", children: [
    /* @__PURE__ */ h.jsxs("div", { className: "panel shrink-0 p-2", children: [
      /* @__PURE__ */ h.jsx("p", { className: "px-1 pb-2 pt-1 text-xs font-bold text-muted-foreground", children: "نوع الطلب" }),
      /* @__PURE__ */ h.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ h.jsx(
          gp,
          {
            active: Y,
            onClick: () => i("delivery"),
            disabled: !C,
            icon: /* @__PURE__ */ h.jsx(Ev, { className: "h-5 w-5" }),
            label: "توصيل"
          }
        ),
        /* @__PURE__ */ h.jsx(
          gp,
          {
            active: !Y,
            onClick: () => i("pickup"),
            icon: /* @__PURE__ */ h.jsx(Bv, { className: "h-5 w-5" }),
            label: "استلام من المطعم"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "panel flex min-h-0 flex-1 flex-col p-3", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3", children: [
        /* @__PURE__ */ h.jsxs("h2", { className: "truncate text-base font-extrabold", children: [
          "الطلب الحالي",
          nt > 0 && /* @__PURE__ */ h.jsxs("span", { className: "text-muted-foreground", children: [
            " (",
            nt,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ h.jsxs(
          "button",
          {
            type: "button",
            onClick: p,
            disabled: c.length === 0,
            className: "flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40",
            children: [
              /* @__PURE__ */ h.jsx(dp, { className: "h-4 w-4" }),
              "حذف الكل"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "min-h-0 flex-1 space-y-2 overflow-y-auto pos-scroll lg:min-h-[6rem]", children: [
        c.length === 0 && /* @__PURE__ */ h.jsx("div", { className: "grid h-full min-h-28 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground", children: "أضف منتجات لبدء الطلب" }),
        c.map((tt) => {
          const it = xu(tt.productId), ct = Lv(tt);
          return /* @__PURE__ */ h.jsxs(
            "div",
            {
              role: "button",
              tabIndex: 0,
              onClick: () => r(tt.id),
              onKeyDown: (P) => P.key === "Enter" && r(tt.id),
              className: "grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-surface-2/50 p-2 transition-colors hover:bg-surface-3/60",
              children: [
                /* @__PURE__ */ h.jsx(
                  "img",
                  {
                    src: it.image,
                    alt: it.name,
                    loading: "lazy",
                    width: 816,
                    height: 816,
                    className: "h-12 w-12 shrink-0 rounded-lg object-cover"
                  }
                ),
                /* @__PURE__ */ h.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ h.jsx("p", { className: "truncate text-sm font-bold", children: it.name }),
                  ct.length > 0 && /* @__PURE__ */ h.jsx("p", { className: "text-[11px] leading-snug text-muted-foreground", children: ct.join(" • ") }),
                  /* @__PURE__ */ h.jsx("p", { className: "mt-0.5 text-sm font-extrabold text-brand", dir: "ltr", children: na(Jp(tt)) })
                ] }),
                /* @__PURE__ */ h.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", onClick: (P) => P.stopPropagation(), children: [
                  /* @__PURE__ */ h.jsxs("div", { className: "flex items-center gap-1 rounded-lg border border-border bg-surface p-1", children: [
                    /* @__PURE__ */ h.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "زيادة الكمية",
                        onClick: () => d(tt.id, 1),
                        className: "grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground",
                        children: /* @__PURE__ */ h.jsx(Hp, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ h.jsx("span", { className: "w-6 text-center text-sm font-extrabold", children: tt.quantity }),
                    /* @__PURE__ */ h.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "تقليل الكمية",
                        onClick: () => d(tt.id, -1),
                        className: "grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground",
                        children: /* @__PURE__ */ h.jsx(qv, { className: "h-4 w-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ h.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "حذف المنتج",
                      onClick: () => m(tt.id),
                      className: "grid h-8 w-8 place-items-center rounded-lg text-destructive transition-colors hover:bg-destructive/10",
                      children: /* @__PURE__ */ h.jsx(dp, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            },
            tt.id
          );
        })
      ] }),
      /* @__PURE__ */ h.jsx("div", { className: "shrink-0 pt-3", children: /* @__PURE__ */ h.jsx(
        "input",
        {
          value: v,
          onChange: (tt) => S(tt.target.value),
          placeholder: "ملاحظات على الطلب ...",
          className: "h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
        }
      ) })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "panel shrink-0 p-3", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "space-y-1.5 text-sm", children: [
        /* @__PURE__ */ h.jsx(pp, { label: "المجموع الفرعي", value: na(U) }),
        Y && /* @__PURE__ */ h.jsx(
          pp,
          {
            label: s ? `رسوم التوصيل — ${s}` : "رسوم التوصيل",
            value: na(R)
          }
        ),
        /* @__PURE__ */ h.jsxs("div", { className: "mt-2 flex items-center justify-between gap-2 border-t border-border pt-2", children: [
          /* @__PURE__ */ h.jsx("span", { className: "text-sm font-extrabold", children: "الإجمالي" }),
          /* @__PURE__ */ h.jsx("span", { className: "text-xl font-extrabold text-brand", dir: "ltr", children: na(X) })
        ] })
      ] }),
      /* @__PURE__ */ h.jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ h.jsxs(
          "button",
          {
            type: "button",
            onClick: B,
            disabled: c.length === 0,
            className: "flex h-14 w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 text-lg font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.01] disabled:opacity-40",
            children: [
              /* @__PURE__ */ h.jsx(Bp, { className: "h-5 w-5 shrink-0" }),
              "إتمام الطلب"
            ]
          }
        ),
        /* @__PURE__ */ h.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ h.jsxs(
            "button",
            {
              type: "button",
              onClick: H,
              disabled: c.length === 0,
              className: "flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
              children: [
                /* @__PURE__ */ h.jsx(kv, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ h.jsx("span", { className: "truncate", children: "حفظ الطلب" })
              ]
            }
          ),
          Y && /* @__PURE__ */ h.jsxs(
            "button",
            {
              type: "button",
              onClick: Q,
              className: `flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors ${M ? "border-brand/50 bg-brand/10 text-brand" : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ h.jsx(Yp, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ h.jsx("span", { className: "truncate", children: M ? "تعديل العنوان" : "إضافة العنوان" })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function pp({ label: u, value: i }) {
  return /* @__PURE__ */ h.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ h.jsx("span", { className: "text-muted-foreground", children: u }),
    /* @__PURE__ */ h.jsx("span", { className: "font-bold", dir: "ltr", children: i })
  ] });
}
function gp({
  active: u,
  onClick: i,
  icon: c,
  label: r,
  disabled: d = !1
}) {
  return /* @__PURE__ */ h.jsxs(
    "button",
    {
      type: "button",
      onClick: i,
      disabled: d,
      className: `flex h-14 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-all ${u ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]" : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"}`,
      children: [
        c,
        /* @__PURE__ */ h.jsx("span", { className: "truncate", children: r })
      ]
    }
  );
}
var Pv = Object.defineProperty, dl = (u, i) => Pv(u, "name", { value: i, configurable: !0 }), Wp = !!(typeof window < "u" && window.document && window.document.createElement);
function wa(u, i, { checkForDefaultPrevented: c = !0 } = {}) {
  return /* @__PURE__ */ dl(function(d) {
    if (u == null || u(d), c === !1 || !d || !d.defaultPrevented)
      return i == null ? void 0 : i(d);
  }, "handleEvent");
}
dl(wa, "composeEventHandlers");
function _v(u) {
  var i;
  if (!Wp)
    throw new Error("Cannot access window outside of the DOM");
  return ((i = u == null ? void 0 : u.ownerDocument) == null ? void 0 : i.defaultView) ?? window;
}
dl(_v, "getOwnerWindow");
function os(u) {
  if (!Wp)
    throw new Error("Cannot access document outside of the DOM");
  return (u == null ? void 0 : u.ownerDocument) ?? document;
}
dl(os, "getOwnerDocument");
function Lp(u, i = !1) {
  const { activeElement: c } = os(u);
  if (!(c != null && c.nodeName))
    return null;
  if (Xp(c) && c.contentDocument)
    return Lp(c.contentDocument.body, i);
  if (i) {
    const r = c.getAttribute("aria-activedescendant");
    if (r) {
      const d = os(c).getElementById(r);
      if (d)
        return d;
    }
  }
  return c;
}
dl(Lp, "getActiveElement");
function Xp(u) {
  return u.tagName === "IFRAME";
}
dl(Xp, "isFrame");
var $v = Object.defineProperty, Ns = (u, i) => $v(u, "name", { value: i, configurable: !0 });
function cs(u, i) {
  if (typeof u == "function")
    return u(i);
  u != null && (u.current = i);
}
Ns(cs, "setRef");
function Ip(...u) {
  return (i) => {
    let c = !1;
    const r = u.map((d) => {
      const m = cs(d, i);
      return !c && typeof m == "function" && (c = !0), m;
    });
    if (c)
      return () => {
        for (let d = 0; d < r.length; d++) {
          const m = r[d];
          typeof m == "function" ? m() : cs(u[d], null);
        }
      };
  };
}
Ns(Ip, "composeRefs");
function ml(...u) {
  return z.useCallback(Ip(...u), u);
}
Ns(ml, "useComposedRefs");
var tb = Object.defineProperty, ce = (u, i) => tb(u, "name", { value: i, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Ab(u, i) {
  const c = z.createContext(i);
  c.displayName = u + "Context";
  const r = /* @__PURE__ */ ce((m) => {
    const { children: p, ...v } = m, S = z.useMemo(() => v, Object.values(v));
    return /* @__PURE__ */ h.jsx(c.Provider, { value: S, children: p });
  }, "Provider");
  r.displayName = u + "Provider";
  function d(m, p = {}) {
    const { optional: v = !1 } = p, S = z.useContext(c);
    if (S) return S;
    if (i !== void 0) return i;
    if (!v)
      throw new Error(`\`${m}\` must be used within \`${u}\``);
  }
  return ce(d, "useContext"), [r, d];
}
ce(Ab, "createContext");
// @__NO_SIDE_EFFECTS__
function Pp(u, i = []) {
  let c = [];
  function r(m, p) {
    const v = z.createContext(p);
    v.displayName = m + "Context";
    const S = c.length;
    c = [...c, p];
    const U = /* @__PURE__ */ ce((s) => {
      var Y;
      const { scope: M, children: Q, ...H } = s, B = ((Y = M == null ? void 0 : M[u]) == null ? void 0 : Y[S]) || v, C = z.useMemo(() => H, Object.values(H));
      return /* @__PURE__ */ h.jsx(B.Provider, { value: C, children: Q });
    }, "Provider");
    U.displayName = m + "Provider";
    function R(s, M, Q = {}) {
      var Y;
      const { optional: H = !1 } = Q, B = ((Y = M == null ? void 0 : M[u]) == null ? void 0 : Y[S]) || v, C = z.useContext(B);
      if (C) return C;
      if (p !== void 0) return p;
      if (!H)
        throw new Error(`\`${s}\` must be used within \`${m}\``);
    }
    return ce(R, "useContext"), [U, R];
  }
  ce(r, "createContext");
  const d = /* @__PURE__ */ ce(() => {
    const m = c.map((p) => z.createContext(p));
    return /* @__PURE__ */ ce(function(v) {
      const S = (v == null ? void 0 : v[u]) || m;
      return z.useMemo(
        () => ({ [`__scope${u}`]: { ...v, [u]: S } }),
        [v, S]
      );
    }, "useScope");
  }, "createScope");
  return d.scopeName = u, [r, _p(d, ...i)];
}
ce(Pp, "createContextScope");
function _p(...u) {
  const i = u[0];
  if (u.length === 1) return i;
  const c = /* @__PURE__ */ ce(() => {
    const r = u.map((d) => ({
      useScope: d(),
      scopeName: d.scopeName
    }));
    return /* @__PURE__ */ ce(function(m) {
      const p = r.reduce((v, { useScope: S, scopeName: U }) => {
        const s = S(m)[`__scope${U}`];
        return { ...v, ...s };
      }, {});
      return z.useMemo(() => ({ [`__scope${i.scopeName}`]: p }), [p]);
    }, "useComposedScopes");
  }, "createScope");
  return c.scopeName = i.scopeName, c;
}
ce(_p, "composeContextScopes");
var Ca = globalThis != null && globalThis.document ? z.useLayoutEffect : () => {
}, eb = Object.defineProperty, ab = (u, i) => eb(u, "name", { value: i, configurable: !0 }), nb = Su[" useId ".trim().toString()] || (() => {
}), lb = 0;
function fr(u) {
  const [i, c] = z.useState(nb());
  return Ca(() => {
    u || c((r) => r ?? String(lb++));
  }, [u]), u || (i ? `radix-${i}` : "");
}
ab(fr, "useId");
var ub = Object.defineProperty, ib = (u, i) => ub(u, "name", { value: i, configurable: !0 }), hp = Su[" useEffectEvent ".trim().toString()], yp = Su[" useInsertionEffect ".trim().toString()];
function $p(u) {
  if (typeof hp == "function")
    return hp(u);
  const i = z.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof yp == "function" ? yp(() => {
    i.current = u;
  }) : Ca(() => {
    i.current = u;
  }), z.useMemo(() => ((...c) => {
    var r;
    return (r = i.current) == null ? void 0 : r.call(i, ...c);
  }), []);
}
ib($p, "useEffectEvent");
var rb = Object.defineProperty, Nu = (u, i) => rb(u, "name", { value: i, configurable: !0 }), ob = Su[" useInsertionEffect ".trim().toString()] || Ca;
function tg({
  prop: u,
  defaultProp: i,
  onChange: c = /* @__PURE__ */ Nu(() => {
  }, "onChange"),
  caller: r
}) {
  const [d, m, p] = Ag({
    defaultProp: i,
    onChange: c
  }), v = u !== void 0, S = v ? u : d, U = z.useCallback(
    (R) => {
      var s;
      if (v) {
        const M = eg(R) ? R(u) : R;
        M !== u && ((s = p.current) == null || s.call(p, M));
      } else
        m(R);
    },
    [v, u, m, p]
  );
  return [S, U];
}
Nu(tg, "useControllableState");
function Ag({
  defaultProp: u,
  onChange: i
}) {
  const [c, r] = z.useState(u), d = z.useRef(c), m = z.useRef(i);
  return ob(() => {
    m.current = i;
  }, [i]), z.useEffect(() => {
    var p;
    d.current !== c && ((p = m.current) == null || p.call(m, c), d.current = c);
  }, [c, d]), [c, r, m];
}
Nu(Ag, "useUncontrolledState");
function eg(u) {
  return typeof u == "function";
}
Nu(eg, "isFunction");
var vp = Symbol("RADIX:SYNC_STATE");
function cb(u, i, c, r) {
  const { prop: d, defaultProp: m, onChange: p, caller: v } = i, S = d !== void 0, U = $p(p), R = [{ ...c, state: m }];
  r && R.push(r);
  const [s, M] = z.useReducer(
    (C, Y) => {
      if (Y.type === vp)
        return { ...C, state: Y.state };
      const X = u(C, Y);
      return S && !Object.is(X.state, C.state) && U(X.state), X;
    },
    ...R
  ), Q = s.state, H = z.useRef(Q);
  z.useEffect(() => {
    H.current !== Q && (H.current = Q, S || U(Q));
  }, [Q, H, S]);
  const B = z.useMemo(() => d !== void 0 ? { ...s, state: d } : s, [s, d]);
  return z.useEffect(() => {
    S && !Object.is(d, s.state) && M({ type: vp, state: d });
  }, [d, s.state, S]), [B, M];
}
Nu(cb, "useControllableStateReducer");
var sb = Object.defineProperty, be = (u, i) => sb(u, "name", { value: i, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Ts(u) {
  const i = z.forwardRef((c, r) => {
    let { children: d, ...m } = c, p = null, v = !1;
    const S = [];
    ss(d) && typeof nr == "function" && (d = nr(d._payload)), z.Children.forEach(d, (M) => {
      var Q;
      if (ug(M)) {
        v = !0;
        const H = M;
        let B = "child" in H.props ? H.props.child : H.props.children;
        ss(B) && typeof nr == "function" && (B = nr(B._payload)), p = db(H, B), S.push((Q = p == null ? void 0 : p.props) == null ? void 0 : Q.children);
      } else
        S.push(M);
    }), p ? p = z.cloneElement(p, void 0, S) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !v && z.Children.count(d) === 1 && z.isValidElement(d) && (p = d)
    );
    const U = p ? lg(p) : void 0, R = ml(r, U);
    if (!p) {
      if (d || d === 0)
        throw new Error(
          v ? gb(u) : pb(u)
        );
      return d;
    }
    const s = ng(m, p.props ?? {});
    return p.type !== z.Fragment && (s.ref = r ? R : U), z.cloneElement(p, s);
  });
  return i.displayName = `${u}.Slot`, i;
}
be(Ts, "createSlot");
var ag = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function fb(u) {
  const i = /* @__PURE__ */ be((c) => "child" in c ? c.children(c.child) : c.children, "Slottable");
  return i.displayName = `${u}.Slottable`, i.__radixId = ag, i;
}
be(fb, "createSlottable");
var db = /* @__PURE__ */ be((u, i) => {
  if ("child" in u.props) {
    const c = u.props.child;
    return z.isValidElement(c) ? z.cloneElement(c, void 0, u.props.children(c.props.children)) : null;
  }
  return z.isValidElement(i) ? i : null;
}, "getSlottableElementFromSlottable");
function ng(u, i) {
  const c = { ...i };
  for (const r in i) {
    const d = u[r], m = i[r];
    /^on[A-Z]/.test(r) ? d && m ? c[r] = (...v) => {
      const S = m(...v);
      return d(...v), S;
    } : d && (c[r] = d) : r === "style" ? c[r] = { ...d, ...m } : r === "className" && (c[r] = [d, m].filter(Boolean).join(" "));
  }
  return { ...u, ...c };
}
be(ng, "mergeProps");
function lg(u) {
  var r, d;
  let i = (r = Object.getOwnPropertyDescriptor(u.props, "ref")) == null ? void 0 : r.get, c = i && "isReactWarning" in i && i.isReactWarning;
  return c ? u.ref : (i = (d = Object.getOwnPropertyDescriptor(u, "ref")) == null ? void 0 : d.get, c = i && "isReactWarning" in i && i.isReactWarning, c ? u.props.ref : u.props.ref || u.ref);
}
be(lg, "getElementRef");
function ug(u) {
  return z.isValidElement(u) && typeof u.type == "function" && "__radixId" in u.type && u.type.__radixId === ag;
}
be(ug, "isSlottable");
var mb = Symbol.for("react.lazy");
function ss(u) {
  return u != null && typeof u == "object" && "$$typeof" in u && u.$$typeof === mb && "_payload" in u && ig(u._payload);
}
be(ss, "isLazyComponent");
function ig(u) {
  return typeof u == "object" && u !== null && "then" in u;
}
be(ig, "isPromiseLike");
var pb = /* @__PURE__ */ be((u) => `${u} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), gb = /* @__PURE__ */ be((u) => `${u} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), nr = Su[" use ".trim().toString()], hb = Object.defineProperty, yb = (u, i) => hb(u, "name", { value: i, configurable: !0 }), vb = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], dn = vb.reduce((u, i) => {
  const c = /* @__PURE__ */ Ts(`Primitive.${i}`), r = z.forwardRef((d, m) => {
    const { asChild: p, ...v } = d, S = p ? c : i;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ h.jsx(S, { ...v, ref: m });
  });
  return r.displayName = `Primitive.${i}`, { ...u, [i]: r };
}, {});
function rg(u, i) {
  u && xs.flushSync(() => u.dispatchEvent(i));
}
yb(rg, "dispatchDiscreteCustomEvent");
var bb = Object.defineProperty, Sb = (u, i) => bb(u, "name", { value: i, configurable: !0 });
function fl(u) {
  const i = z.useRef(u);
  return z.useEffect(() => {
    i.current = u;
  }), z.useMemo(() => ((...c) => {
    var r;
    return (r = i.current) == null ? void 0 : r.call(i, ...c);
  }), []);
}
Sb(fl, "useCallbackRef");
var xb = Object.defineProperty, gA = (u, i) => xb(u, "name", { value: i, configurable: !0 }), fs = "dismissableLayer.update", Nb = "dismissableLayer.pointerDownOutside", Tb = "dismissableLayer.focusOutside", bp, og = z.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Ub = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ gA(function(i, c) {
    const {
      disableOutsidePointerEvents: r = !1,
      deferPointerDownOutside: d = !1,
      onEscapeKeyDown: m,
      onPointerDownOutside: p,
      onFocusOutside: v,
      onInteractOutside: S,
      onDismiss: U,
      ...R
    } = i, s = z.useContext(og), [M, Q] = z.useState(null), H = (M == null ? void 0 : M.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, B] = z.useState({}), C = ml(c, Q), Y = Array.from(s.layers), [X] = [
      ...s.layersWithOutsidePointerEventsDisabled
    ].slice(-1), nt = X ? Y.indexOf(X) : -1, tt = M ? Y.indexOf(M) : -1, it = s.layersWithOutsidePointerEventsDisabled.size > 0, ct = tt >= nt, P = z.useRef(!1), k = sg(
      (rt) => {
        p == null || p(rt), S == null || S(rt), rt.defaultPrevented || U == null || U();
      },
      {
        ownerDocument: H,
        deferPointerDownOutside: d,
        isDeferredPointerDownOutsideRef: P,
        dismissableSurfaces: s.dismissableSurfaces,
        shouldHandlePointerDownOutside: z.useCallback(
          (rt) => {
            if (!(rt instanceof Node))
              return !1;
            const Lt = [...s.branches].some(
              (Et) => Et.contains(rt)
            );
            return ct && !Lt;
          },
          [s.branches, ct]
        )
      }
    ), mt = fg((rt) => {
      if (d && P.current)
        return;
      const Lt = rt.target;
      [...s.branches].some((Ut) => Ut.contains(Lt)) || (v == null || v(rt), S == null || S(rt), rt.defaultPrevented || U == null || U());
    }, H), Gt = M ? tt === Y.length - 1 : !1, jt = fl((rt) => {
      rt.key === "Escape" && (m == null || m(rt), !rt.defaultPrevented && U && (rt.preventDefault(), U()));
    });
    return z.useEffect(() => {
      if (Gt)
        return H.addEventListener("keydown", jt, { capture: !0 }), () => H.removeEventListener("keydown", jt, { capture: !0 });
    }, [H, Gt, jt]), z.useEffect(() => {
      if (M)
        return r && (s.layersWithOutsidePointerEventsDisabled.size === 0 && (bp = H.body.style.pointerEvents, H.body.style.pointerEvents = "none"), s.layersWithOutsidePointerEventsDisabled.add(M)), s.layers.add(M), ds(), () => {
          r && (s.layersWithOutsidePointerEventsDisabled.delete(M), s.layersWithOutsidePointerEventsDisabled.size === 0 && (H.body.style.pointerEvents = bp));
        };
    }, [M, H, r, s]), z.useEffect(() => () => {
      M && (s.layers.delete(M), s.layersWithOutsidePointerEventsDisabled.delete(M), ds());
    }, [M, s]), z.useEffect(() => {
      const rt = /* @__PURE__ */ gA(() => B({}), "handleUpdate");
      return document.addEventListener(fs, rt), () => document.removeEventListener(fs, rt);
    }, []), /* @__PURE__ */ h.jsx(
      dn.div,
      {
        ...R,
        ref: C,
        style: {
          pointerEvents: it ? ct ? "auto" : "none" : void 0,
          ...i.style
        },
        onFocusCapture: wa(i.onFocusCapture, mt.onFocusCapture),
        onBlurCapture: wa(i.onBlurCapture, mt.onBlurCapture),
        onPointerDownCapture: wa(
          i.onPointerDownCapture,
          k.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function cg() {
  const u = z.useContext(og), [i, c] = z.useState(null);
  return z.useEffect(() => {
    if (i)
      return u.dismissableSurfaces.add(i), () => {
        u.dismissableSurfaces.delete(i);
      };
  }, [i, u.dismissableSurfaces]), c;
}
gA(cg, "useDismissableLayerSurface");
var Mb = /* @__PURE__ */ gA(() => !0, "IS_TRUE");
function sg(u, i) {
  const {
    ownerDocument: c = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: d,
    dismissableSurfaces: m,
    shouldHandlePointerDownOutside: p = Mb
  } = i, v = fl(u), S = z.useRef(!1), U = z.useRef(!1), R = z.useRef(/* @__PURE__ */ new Map()), s = z.useRef(() => {
  });
  return z.useEffect(() => {
    function M() {
      U.current = !1, d.current = !1, R.current.clear();
    }
    gA(M, "resetOutsideInteraction");
    function Q() {
      return Array.from(R.current.values()).some(Boolean);
    }
    gA(Q, "isOutsideInteractionIntercepted");
    function H(nt) {
      if (!U.current)
        return;
      const tt = nt.target;
      tt instanceof Node && [...m].some((ct) => ct.contains(tt)) || R.current.set(nt.type, !0), nt.type === "click" && window.setTimeout(() => {
        U.current && s.current();
      }, 0);
    }
    gA(H, "handleInteractionCapture");
    function B(nt) {
      U.current && R.current.set(nt.type, !1);
    }
    gA(B, "handleInteractionBubble");
    const C = /* @__PURE__ */ gA((nt) => {
      if (nt.target && !S.current) {
        let tt = function() {
          c.removeEventListener("click", s.current);
          const ct = Q();
          M(), ct || Us(
            Nb,
            v,
            it,
            { discrete: !0 }
          );
        };
        if (gA(tt, "handleAndDispatchPointerDownOutsideEvent"), !p(nt.target)) {
          c.removeEventListener("click", s.current), M(), S.current = !1;
          return;
        }
        const it = { originalEvent: nt };
        U.current = !0, d.current = r && nt.button === 0, R.current.clear(), !r || nt.button !== 0 ? tt() : (c.removeEventListener("click", s.current), s.current = tt, c.addEventListener("click", s.current, { once: !0 }));
      } else
        c.removeEventListener("click", s.current), M();
      S.current = !1;
    }, "handlePointerDown"), Y = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const nt of Y)
      c.addEventListener(nt, H, !0), c.addEventListener(nt, B);
    const X = window.setTimeout(() => {
      c.addEventListener("pointerdown", C);
    }, 0);
    return () => {
      window.clearTimeout(X), c.removeEventListener("pointerdown", C), c.removeEventListener("click", s.current);
      for (const nt of Y)
        c.removeEventListener(nt, H, !0), c.removeEventListener(nt, B);
    };
  }, [
    c,
    v,
    r,
    d,
    m,
    p
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ gA(() => S.current = !0, "onPointerDownCapture")
  };
}
gA(sg, "usePointerDownOutside");
function fg(u, i = globalThis == null ? void 0 : globalThis.document) {
  const c = fl(u), r = z.useRef(!1);
  return z.useEffect(() => {
    const d = /* @__PURE__ */ gA((m) => {
      m.target && !r.current && Us(Tb, c, { originalEvent: m }, {
        discrete: !1
      });
    }, "handleFocus");
    return i.addEventListener("focusin", d), () => i.removeEventListener("focusin", d);
  }, [i, c]), {
    onFocusCapture: /* @__PURE__ */ gA(() => r.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ gA(() => r.current = !1, "onBlurCapture")
  };
}
gA(fg, "useFocusOutside");
function ds() {
  const u = new CustomEvent(fs);
  document.dispatchEvent(u);
}
gA(ds, "dispatchUpdate");
function Us(u, i, c, { discrete: r }) {
  const d = c.originalEvent.target, m = new CustomEvent(u, { bubbles: !1, cancelable: !0, detail: c });
  i && d.addEventListener(u, i, { once: !0 }), r ? rg(d, m) : d.dispatchEvent(m);
}
gA(Us, "handleAndDispatchCustomEvent");
var zb = Object.defineProperty, EA = (u, i) => zb(u, "name", { value: i, configurable: !0 }), As = "focusScope.autoFocusOnMount", es = "focusScope.autoFocusOnUnmount", Sp = { bubbles: !1, cancelable: !0 }, jb = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ EA(function(i, c) {
    const {
      loop: r = !1,
      trapped: d = !1,
      onMountAutoFocus: m,
      onUnmountAutoFocus: p,
      ...v
    } = i, [S, U] = z.useState(null), R = fl(m), s = fl(p), M = z.useRef(null), Q = ml(c, U), H = z.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    z.useEffect(() => {
      if (d) {
        let C = function(tt) {
          if (H.paused || !S) return;
          const it = tt.target;
          S.contains(it) ? M.current = it : ea(M.current, { select: !0 });
        }, Y = function(tt) {
          if (H.paused || !S) return;
          const it = tt.relatedTarget;
          it !== null && (S.contains(it) || ea(M.current, { select: !0 }));
        }, X = function(tt) {
          if (document.activeElement === document.body)
            for (const ct of tt)
              ct.removedNodes.length > 0 && ea(S);
        };
        EA(C, "handleFocusIn"), EA(Y, "handleFocusOut"), EA(X, "handleMutations"), document.addEventListener("focusin", C), document.addEventListener("focusout", Y);
        const nt = new MutationObserver(X);
        return S && nt.observe(S, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", C), document.removeEventListener("focusout", Y), nt.disconnect();
        };
      }
    }, [d, S, H.paused]), z.useEffect(() => {
      if (S) {
        xp.add(H);
        const C = document.activeElement;
        if (!S.contains(C)) {
          const X = new CustomEvent(As, Sp);
          S.addEventListener(As, R), S.dispatchEvent(X), X.defaultPrevented || (dg(yg(Ms(S)), { select: !0 }), document.activeElement === C && ea(S));
        }
        return () => {
          S.removeEventListener(As, R), setTimeout(() => {
            const X = new CustomEvent(es, Sp);
            S.addEventListener(es, s), S.dispatchEvent(X), X.defaultPrevented || ea(C ?? document.body, { select: !0 }), S.removeEventListener(es, s), xp.remove(H);
          }, 0);
        };
      }
    }, [S, R, s, H]);
    const B = z.useCallback(
      (C) => {
        if (!r && !d || H.paused) return;
        const Y = C.key === "Tab" && !C.altKey && !C.ctrlKey && !C.metaKey, X = document.activeElement;
        if (Y && X) {
          const nt = C.currentTarget, [tt, it] = mg(nt);
          tt && it ? !C.shiftKey && X === it ? (C.preventDefault(), r && ea(tt, { select: !0 })) : C.shiftKey && X === tt && (C.preventDefault(), r && ea(it, { select: !0 })) : X === nt && C.preventDefault();
        }
      },
      [r, d, H.paused]
    );
    return /* @__PURE__ */ h.jsx(dn.div, { tabIndex: -1, ...v, ref: Q, onKeyDown: B });
  }, "FocusScope")
);
function dg(u, { select: i = !1 } = {}) {
  const c = document.activeElement;
  for (const r of u)
    if (ea(r, { select: i }), document.activeElement !== c) return;
}
EA(dg, "focusFirst");
function mg(u) {
  const i = Ms(u), c = ms(i, u), r = ms(i.reverse(), u);
  return [c, r];
}
EA(mg, "getTabbableEdges");
function Ms(u) {
  const i = [], c = document.createTreeWalker(u, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ EA((r) => {
      const d = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || d ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; c.nextNode(); ) i.push(c.currentNode);
  return i;
}
EA(Ms, "getTabbableCandidates");
function ms(u, i) {
  const c = typeof i.checkVisibility == "function" && i.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of u)
    if (!(c ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : pg(r, { upTo: i })))
      return r;
}
EA(ms, "findVisible");
function pg(u, { upTo: i }) {
  if (getComputedStyle(u).visibility === "hidden") return !0;
  for (; u; ) {
    if (i !== void 0 && u === i) return !1;
    if (getComputedStyle(u).display === "none") return !0;
    u = u.parentElement;
  }
  return !1;
}
EA(pg, "isHidden");
function gg(u) {
  return u instanceof HTMLInputElement && "select" in u;
}
EA(gg, "isSelectableInput");
function ea(u, { select: i = !1 } = {}) {
  if (u && u.focus) {
    const c = document.activeElement;
    u.focus({ preventScroll: !0 }), u !== c && gg(u) && i && u.select();
  }
}
EA(ea, "focus");
var xp = hg();
function hg() {
  let u = [];
  return {
    add(i) {
      const c = u[0];
      i !== c && (c == null || c.pause()), u = ps(u, i), u.unshift(i);
    },
    remove(i) {
      var c;
      u = ps(u, i), (c = u[0]) == null || c.resume();
    }
  };
}
EA(hg, "createFocusScopesStack");
function ps(u, i) {
  const c = [...u], r = c.indexOf(i);
  return r !== -1 && c.splice(r, 1), c;
}
EA(ps, "arrayRemove");
function yg(u) {
  return u.filter((i) => i.tagName !== "A");
}
EA(yg, "removeLinks");
var Db = Object.defineProperty, Rb = (u, i) => Db(u, "name", { value: i, configurable: !0 }), Ob = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ Rb(function(i, c) {
    var S;
    const { container: r, ...d } = i, [m, p] = z.useState(!1);
    Ca(() => p(!0), []);
    const v = r || m && ((S = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : S.body);
    return v ? xs.createPortal(/* @__PURE__ */ h.jsx(dn.div, { ...d, ref: c }), v) : null;
  }, "Portal")
), Eb = Object.defineProperty, la = (u, i) => Eb(u, "name", { value: i, configurable: !0 });
function vg(u, i) {
  return z.useReducer((c, r) => i[c][r] ?? c, u);
}
la(vg, "useStateMachine");
var zs = /* @__PURE__ */ la((u) => {
  const { present: i, children: c } = u, r = bg(i), d = typeof c == "function" ? c({ present: r.isPresent }) : z.Children.only(c), m = Sg(r.ref, xg(d));
  return typeof c == "function" || r.isPresent ? z.cloneElement(d, { ref: m }) : null;
}, "Presence");
function bg(u) {
  const [i, c] = z.useState(), r = z.useRef(null), d = z.useRef(u), m = z.useRef("none"), p = z.useRef(void 0), v = u ? "mounted" : "unmounted", [S, U] = vg(v, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return z.useEffect(() => {
    S === "mounted" ? (m.current = p.current ?? cl(r.current), p.current = void 0) : m.current = "none";
  }, [S]), Ca(() => {
    const R = r.current, s = d.current;
    if (s !== u) {
      const Q = m.current, H = cl(R);
      u ? (p.current = H, U("MOUNT")) : H === "none" || (R == null ? void 0 : R.display) === "none" ? U("UNMOUNT") : U(s && Q !== H ? "ANIMATION_OUT" : "UNMOUNT"), d.current = u;
    }
  }, [u, U]), Ca(() => {
    if (i) {
      let R;
      const s = i.ownerDocument.defaultView ?? window, M = /* @__PURE__ */ la((H) => {
        const C = cl(r.current).includes(CSS.escape(H.animationName));
        if (H.target === i && C && (U("ANIMATION_END"), !d.current)) {
          const Y = i.style.animationFillMode;
          i.style.animationFillMode = "forwards", R = s.setTimeout(() => {
            i.style.animationFillMode === "forwards" && (i.style.animationFillMode = Y);
          });
        }
      }, "handleAnimationEnd"), Q = /* @__PURE__ */ la((H) => {
        H.target === i && (m.current = cl(r.current));
      }, "handleAnimationStart");
      return i.addEventListener("animationstart", Q), i.addEventListener("animationcancel", M), i.addEventListener("animationend", M), () => {
        s.clearTimeout(R), i.removeEventListener("animationstart", Q), i.removeEventListener("animationcancel", M), i.removeEventListener("animationend", M);
      };
    } else
      U("ANIMATION_END");
  }, [i, U]), {
    isPresent: ["mounted", "unmountSuspended"].includes(S),
    ref: z.useCallback((R) => {
      if (R) {
        const s = getComputedStyle(R);
        r.current = s, p.current = cl(s);
      } else
        r.current = null;
      c(R);
    }, [])
  };
}
la(bg, "usePresence");
function gs(u, i) {
  if (typeof u == "function")
    return u(i);
  u != null && (u.current = i);
}
la(gs, "setRef");
function Sg(...u) {
  const i = z.useRef(u);
  return i.current = u, z.useCallback((c) => {
    const r = i.current;
    let d = !1;
    const m = r.map((p) => {
      const v = gs(p, c);
      return !d && typeof v == "function" && (d = !0), v;
    });
    if (d)
      return () => {
        for (let p = 0; p < m.length; p++) {
          const v = m[p];
          typeof v == "function" ? v() : gs(r[p], null);
        }
      };
  }, []);
}
la(Sg, "useStableComposedRefs");
function cl(u) {
  return (u == null ? void 0 : u.animationName) || "none";
}
la(cl, "getAnimationName");
function xg(u) {
  var r, d;
  let i = (r = Object.getOwnPropertyDescriptor(u.props, "ref")) == null ? void 0 : r.get, c = i && "isReactWarning" in i && i.isReactWarning;
  return c ? u.ref : (i = (d = Object.getOwnPropertyDescriptor(u, "ref")) == null ? void 0 : d.get, c = i && "isReactWarning" in i && i.isReactWarning, c ? u.props.ref : u.props.ref || u.ref);
}
la(xg, "getElementRef");
var Vb = Object.defineProperty, js = (u, i) => Vb(u, "name", { value: i, configurable: !0 }), lr = 0, we = null;
function Kb(u) {
  return Ds(), u.children;
}
js(Kb, "FocusGuards");
function Ds() {
  z.useEffect(() => {
    we || (we = { start: hs(), end: hs() });
    const { start: u, end: i } = we;
    return document.body.firstElementChild !== u && document.body.insertAdjacentElement("afterbegin", u), document.body.lastElementChild !== i && document.body.insertAdjacentElement("beforeend", i), lr++, () => {
      lr === 1 && (we == null || we.start.remove(), we == null || we.end.remove(), we = null), lr = Math.max(0, lr - 1);
    };
  }, []);
}
js(Ds, "useFocusGuards");
function hs() {
  const u = document.createElement("span");
  return u.setAttribute("data-radix-focus-guard", ""), u.tabIndex = 0, u.style.outline = "none", u.style.opacity = "0", u.style.position = "fixed", u.style.pointerEvents = "none", u;
}
js(hs, "createFocusGuard");
var qe = function() {
  return qe = Object.assign || function(i) {
    for (var c, r = 1, d = arguments.length; r < d; r++) {
      c = arguments[r];
      for (var m in c) Object.prototype.hasOwnProperty.call(c, m) && (i[m] = c[m]);
    }
    return i;
  }, qe.apply(this, arguments);
};
function Ng(u, i) {
  var c = {};
  for (var r in u) Object.prototype.hasOwnProperty.call(u, r) && i.indexOf(r) < 0 && (c[r] = u[r]);
  if (u != null && typeof Object.getOwnPropertySymbols == "function")
    for (var d = 0, r = Object.getOwnPropertySymbols(u); d < r.length; d++)
      i.indexOf(r[d]) < 0 && Object.prototype.propertyIsEnumerable.call(u, r[d]) && (c[r[d]] = u[r[d]]);
  return c;
}
function wb(u, i, c) {
  if (c || arguments.length === 2) for (var r = 0, d = i.length, m; r < d; r++)
    (m || !(r in i)) && (m || (m = Array.prototype.slice.call(i, 0, r)), m[r] = i[r]);
  return u.concat(m || Array.prototype.slice.call(i));
}
var dr = "right-scroll-bar-position", mr = "width-before-scroll-bar", Cb = "with-scroll-bars-hidden", qb = "--removed-body-scroll-bar-size";
function as(u, i) {
  return typeof u == "function" ? u(i) : u && (u.current = i), u;
}
function kb(u, i) {
  var c = z.useState(function() {
    return {
      // value
      value: u,
      // last callback
      callback: i,
      // "memoized" public interface
      facade: {
        get current() {
          return c.value;
        },
        set current(r) {
          var d = c.value;
          d !== r && (c.value = r, c.callback(r, d));
        }
      }
    };
  })[0];
  return c.callback = i, c.facade;
}
var Bb = typeof window < "u" ? z.useLayoutEffect : z.useEffect, Np = /* @__PURE__ */ new WeakMap();
function Yb(u, i) {
  var c = kb(null, function(r) {
    return u.forEach(function(d) {
      return as(d, r);
    });
  });
  return Bb(function() {
    var r = Np.get(c);
    if (r) {
      var d = new Set(r), m = new Set(u), p = c.current;
      d.forEach(function(v) {
        m.has(v) || as(v, null);
      }), m.forEach(function(v) {
        d.has(v) || as(v, p);
      });
    }
    Np.set(c, u);
  }, [u]), c;
}
function Hb(u) {
  return u;
}
function Gb(u, i) {
  i === void 0 && (i = Hb);
  var c = [], r = !1, d = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return c.length ? c[c.length - 1] : u;
    },
    useMedium: function(m) {
      var p = i(m, r);
      return c.push(p), function() {
        c = c.filter(function(v) {
          return v !== p;
        });
      };
    },
    assignSyncMedium: function(m) {
      for (r = !0; c.length; ) {
        var p = c;
        c = [], p.forEach(m);
      }
      c = {
        push: function(v) {
          return m(v);
        },
        filter: function() {
          return c;
        }
      };
    },
    assignMedium: function(m) {
      r = !0;
      var p = [];
      if (c.length) {
        var v = c;
        c = [], v.forEach(m), p = c;
      }
      var S = function() {
        var R = p;
        p = [], R.forEach(m);
      }, U = function() {
        return Promise.resolve().then(S);
      };
      U(), c = {
        push: function(R) {
          p.push(R), U();
        },
        filter: function(R) {
          return p = p.filter(R), c;
        }
      };
    }
  };
  return d;
}
function Fb(u) {
  u === void 0 && (u = {});
  var i = Gb(null);
  return i.options = qe({ async: !0, ssr: !1 }, u), i;
}
var Tg = function(u) {
  var i = u.sideCar, c = Ng(u, ["sideCar"]);
  if (!i)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = i.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return z.createElement(r, qe({}, c));
};
Tg.isSideCarExport = !0;
function Zb(u, i) {
  return u.useMedium(i), Tg;
}
var Ug = Fb(), ns = function() {
}, yr = z.forwardRef(function(u, i) {
  var c = z.useRef(null), r = z.useState({
    onScrollCapture: ns,
    onWheelCapture: ns,
    onTouchMoveCapture: ns
  }), d = r[0], m = r[1], p = u.forwardProps, v = u.children, S = u.className, U = u.removeScrollBar, R = u.enabled, s = u.shards, M = u.sideCar, Q = u.noRelative, H = u.noIsolation, B = u.inert, C = u.allowPinchZoom, Y = u.as, X = Y === void 0 ? "div" : Y, nt = u.gapMode, tt = Ng(u, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), it = M, ct = Yb([c, i]), P = qe(qe({}, tt), d);
  return z.createElement(
    z.Fragment,
    null,
    R && z.createElement(it, { sideCar: Ug, removeScrollBar: U, shards: s, noRelative: Q, noIsolation: H, inert: B, setCallbacks: m, allowPinchZoom: !!C, lockRef: c, gapMode: nt }),
    p ? z.cloneElement(z.Children.only(v), qe(qe({}, P), { ref: ct })) : z.createElement(X, qe({}, P, { className: S, ref: ct }), v)
  );
});
yr.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
yr.classNames = {
  fullWidth: mr,
  zeroRight: dr
};
var Qb = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Jb() {
  if (!document)
    return null;
  var u = document.createElement("style");
  u.type = "text/css";
  var i = Qb();
  return i && u.setAttribute("nonce", i), u;
}
function Wb(u, i) {
  u.styleSheet ? u.styleSheet.cssText = i : u.appendChild(document.createTextNode(i));
}
function Lb(u) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(u);
}
var Xb = function() {
  var u = 0, i = null;
  return {
    add: function(c) {
      u == 0 && (i = Jb()) && (Wb(i, c), Lb(i)), u++;
    },
    remove: function() {
      u--, !u && i && (i.parentNode && i.parentNode.removeChild(i), i = null);
    }
  };
}, Ib = function() {
  var u = Xb();
  return function(i, c) {
    z.useEffect(function() {
      return u.add(i), function() {
        u.remove();
      };
    }, [i && c]);
  };
}, Mg = function() {
  var u = Ib(), i = function(c) {
    var r = c.styles, d = c.dynamic;
    return u(r, d), null;
  };
  return i;
}, Pb = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, ls = function(u) {
  return parseInt(u || "", 10) || 0;
}, _b = function(u) {
  var i = window.getComputedStyle(document.body), c = i[u === "padding" ? "paddingLeft" : "marginLeft"], r = i[u === "padding" ? "paddingTop" : "marginTop"], d = i[u === "padding" ? "paddingRight" : "marginRight"];
  return [ls(c), ls(r), ls(d)];
}, $b = function(u) {
  if (u === void 0 && (u = "margin"), typeof window > "u")
    return Pb;
  var i = _b(u), c = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: i[0],
    top: i[1],
    right: i[2],
    gap: Math.max(0, r - c + i[2] - i[0])
  };
}, tS = Mg(), sl = "data-scroll-locked", AS = function(u, i, c, r) {
  var d = u.left, m = u.top, p = u.right, v = u.gap;
  return c === void 0 && (c = "margin"), `
  .`.concat(Cb, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(v, "px ").concat(r, `;
  }
  body[`).concat(sl, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    i && "position: relative ".concat(r, ";"),
    c === "margin" && `
    padding-left: `.concat(d, `px;
    padding-top: `).concat(m, `px;
    padding-right: `).concat(p, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(v, "px ").concat(r, `;
    `),
    c === "padding" && "padding-right: ".concat(v, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }

  .`).concat(dr, ` {
    right: `).concat(v, "px ").concat(r, `;
  }

  .`).concat(mr, ` {
    margin-right: `).concat(v, "px ").concat(r, `;
  }

  .`).concat(dr, " .").concat(dr, ` {
    right: 0 `).concat(r, `;
  }

  .`).concat(mr, " .").concat(mr, ` {
    margin-right: 0 `).concat(r, `;
  }

  body[`).concat(sl, `] {
    `).concat(qb, ": ").concat(v, `px;
  }
`);
}, Tp = function() {
  var u = parseInt(document.body.getAttribute(sl) || "0", 10);
  return isFinite(u) ? u : 0;
}, eS = function() {
  z.useEffect(function() {
    return document.body.setAttribute(sl, (Tp() + 1).toString()), function() {
      var u = Tp() - 1;
      u <= 0 ? document.body.removeAttribute(sl) : document.body.setAttribute(sl, u.toString());
    };
  }, []);
}, aS = function(u) {
  var i = u.noRelative, c = u.noImportant, r = u.gapMode, d = r === void 0 ? "margin" : r;
  eS();
  var m = z.useMemo(function() {
    return $b(d);
  }, [d]);
  return z.createElement(tS, { styles: AS(m, !i, d, c ? "" : "!important") });
}, ys = !1;
if (typeof window < "u")
  try {
    var ur = Object.defineProperty({}, "passive", {
      get: function() {
        return ys = !0, !0;
      }
    });
    window.addEventListener("test", ur, ur), window.removeEventListener("test", ur, ur);
  } catch {
    ys = !1;
  }
var il = ys ? { passive: !1 } : !1, nS = function(u) {
  return u.tagName === "TEXTAREA";
}, zg = function(u, i) {
  if (!(u instanceof Element))
    return !1;
  var c = window.getComputedStyle(u);
  return (
    // not-not-scrollable
    c[i] !== "hidden" && // contains scroll inside self
    !(c.overflowY === c.overflowX && !nS(u) && c[i] === "visible")
  );
}, lS = function(u) {
  return zg(u, "overflowY");
}, uS = function(u) {
  return zg(u, "overflowX");
}, Up = function(u, i) {
  var c = i.ownerDocument, r = i;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var d = jg(u, r);
    if (d) {
      var m = Dg(u, r), p = m[1], v = m[2];
      if (p > v)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== c.body);
  return !1;
}, iS = function(u) {
  var i = u.scrollTop, c = u.scrollHeight, r = u.clientHeight;
  return [
    i,
    c,
    r
  ];
}, rS = function(u) {
  var i = u.scrollLeft, c = u.scrollWidth, r = u.clientWidth;
  return [
    i,
    c,
    r
  ];
}, jg = function(u, i) {
  return u === "v" ? lS(i) : uS(i);
}, Dg = function(u, i) {
  return u === "v" ? iS(i) : rS(i);
}, oS = function(u, i) {
  return u === "h" && i === "rtl" ? -1 : 1;
}, cS = function(u, i, c, r, d) {
  var m = oS(u, window.getComputedStyle(i).direction), p = m * r, v = c.target, S = i.contains(v), U = !1, R = p > 0, s = 0, M = 0;
  do {
    if (!v)
      break;
    var Q = Dg(u, v), H = Q[0], B = Q[1], C = Q[2], Y = B - C - m * H;
    (H || Y) && jg(u, v) && (s += Y, M += H);
    var X = v.parentNode;
    v = X && X.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? X.host : X;
  } while (
    // portaled content
    !S && v !== document.body || // self content
    S && (i.contains(v) || i === v)
  );
  return (R && Math.abs(s) < 1 || !R && Math.abs(M) < 1) && (U = !0), U;
}, ir = function(u) {
  return "changedTouches" in u ? [u.changedTouches[0].clientX, u.changedTouches[0].clientY] : [0, 0];
}, Mp = function(u) {
  return [u.deltaX, u.deltaY];
}, zp = function(u) {
  return u && "current" in u ? u.current : u;
}, sS = function(u, i) {
  return u[0] === i[0] && u[1] === i[1];
}, fS = function(u) {
  return `
  .block-interactivity-`.concat(u, ` {pointer-events: none;}
  .allow-interactivity-`).concat(u, ` {pointer-events: all;}
`);
}, dS = 0, rl = [];
function mS(u) {
  var i = z.useRef([]), c = z.useRef([0, 0]), r = z.useRef(), d = z.useState(dS++)[0], m = z.useState(Mg)[0], p = z.useRef(u);
  z.useEffect(function() {
    p.current = u;
  }, [u]), z.useEffect(function() {
    if (u.inert) {
      document.body.classList.add("block-interactivity-".concat(d));
      var B = wb([u.lockRef.current], (u.shards || []).map(zp), !0).filter(Boolean);
      return B.forEach(function(C) {
        return C.classList.add("allow-interactivity-".concat(d));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(d)), B.forEach(function(C) {
          return C.classList.remove("allow-interactivity-".concat(d));
        });
      };
    }
  }, [u.inert, u.lockRef.current, u.shards]);
  var v = z.useCallback(function(B, C) {
    if ("touches" in B && B.touches.length === 2 || B.type === "wheel" && B.ctrlKey)
      return !p.current.allowPinchZoom;
    var Y = ir(B), X = c.current, nt = "deltaX" in B ? B.deltaX : X[0] - Y[0], tt = "deltaY" in B ? B.deltaY : X[1] - Y[1], it, ct = B.target, P = Math.abs(nt) > Math.abs(tt) ? "h" : "v";
    if ("touches" in B && P === "h" && ct.type === "range")
      return !1;
    var k = window.getSelection(), mt = k && k.anchorNode, Gt = mt ? mt === ct || mt.contains(ct) : !1;
    if (Gt)
      return !1;
    var jt = Up(P, ct);
    if (!jt)
      return !0;
    if (jt ? it = P : (it = P === "v" ? "h" : "v", jt = Up(P, ct)), !jt)
      return !1;
    if (!r.current && "changedTouches" in B && (nt || tt) && (r.current = it), !it)
      return !0;
    var rt = r.current || it;
    return cS(rt, C, B, rt === "h" ? nt : tt);
  }, []), S = z.useCallback(function(B) {
    var C = B;
    if (!(!rl.length || rl[rl.length - 1] !== m)) {
      var Y = "deltaY" in C ? Mp(C) : ir(C), X = i.current.filter(function(it) {
        return it.name === C.type && (it.target === C.target || C.target === it.shadowParent) && sS(it.delta, Y);
      })[0];
      if (X && X.should) {
        C.cancelable && C.preventDefault();
        return;
      }
      if (!X) {
        var nt = (p.current.shards || []).map(zp).filter(Boolean).filter(function(it) {
          return it.contains(C.target);
        }), tt = nt.length > 0 ? v(C, nt[0]) : !p.current.noIsolation;
        tt && C.cancelable && C.preventDefault();
      }
    }
  }, []), U = z.useCallback(function(B, C, Y, X) {
    var nt = { name: B, delta: C, target: Y, should: X, shadowParent: pS(Y) };
    i.current.push(nt), setTimeout(function() {
      i.current = i.current.filter(function(tt) {
        return tt !== nt;
      });
    }, 1);
  }, []), R = z.useCallback(function(B) {
    c.current = ir(B), r.current = void 0;
  }, []), s = z.useCallback(function(B) {
    U(B.type, Mp(B), B.target, v(B, u.lockRef.current));
  }, []), M = z.useCallback(function(B) {
    U(B.type, ir(B), B.target, v(B, u.lockRef.current));
  }, []);
  z.useEffect(function() {
    return rl.push(m), u.setCallbacks({
      onScrollCapture: s,
      onWheelCapture: s,
      onTouchMoveCapture: M
    }), document.addEventListener("wheel", S, il), document.addEventListener("touchmove", S, il), document.addEventListener("touchstart", R, il), function() {
      rl = rl.filter(function(B) {
        return B !== m;
      }), document.removeEventListener("wheel", S, il), document.removeEventListener("touchmove", S, il), document.removeEventListener("touchstart", R, il);
    };
  }, []);
  var Q = u.removeScrollBar, H = u.inert;
  return z.createElement(
    z.Fragment,
    null,
    H ? z.createElement(m, { styles: fS(d) }) : null,
    Q ? z.createElement(aS, { noRelative: u.noRelative, gapMode: u.gapMode }) : null
  );
}
function pS(u) {
  for (var i = null; u !== null; )
    u instanceof ShadowRoot && (i = u.host, u = u.host), u = u.parentNode;
  return i;
}
const gS = Zb(Ug, mS);
var Rg = z.forwardRef(function(u, i) {
  return z.createElement(yr, qe({}, u, { ref: i, sideCar: gS }));
});
Rg.classNames = yr.classNames;
var hS = function(u) {
  if (typeof document > "u")
    return null;
  var i = Array.isArray(u) ? u[0] : u;
  return i.ownerDocument.body;
}, ol = /* @__PURE__ */ new WeakMap(), rr = /* @__PURE__ */ new WeakMap(), or = {}, us = 0, Og = function(u) {
  return u && (u.host || Og(u.parentNode));
}, yS = function(u, i) {
  return i.map(function(c) {
    if (u.contains(c))
      return c;
    var r = Og(c);
    return r && u.contains(r) ? r : (console.error("aria-hidden", c, "in not contained inside", u, ". Doing nothing"), null);
  }).filter(function(c) {
    return !!c;
  });
}, vS = function(u, i, c, r) {
  var d = yS(i, Array.isArray(u) ? u : [u]);
  or[c] || (or[c] = /* @__PURE__ */ new WeakMap());
  var m = or[c], p = [], v = /* @__PURE__ */ new Set(), S = new Set(d), U = function(s) {
    !s || v.has(s) || (v.add(s), U(s.parentNode));
  };
  d.forEach(U);
  var R = function(s) {
    !s || S.has(s) || Array.prototype.forEach.call(s.children, function(M) {
      if (v.has(M))
        R(M);
      else
        try {
          var Q = M.getAttribute(r), H = Q !== null && Q !== "false", B = (ol.get(M) || 0) + 1, C = (m.get(M) || 0) + 1;
          ol.set(M, B), m.set(M, C), p.push(M), B === 1 && H && rr.set(M, !0), C === 1 && M.setAttribute(c, "true"), H || M.setAttribute(r, "true");
        } catch (Y) {
          console.error("aria-hidden: cannot operate on ", M, Y);
        }
    });
  };
  return R(i), v.clear(), us++, function() {
    p.forEach(function(s) {
      var M = ol.get(s) - 1, Q = m.get(s) - 1;
      ol.set(s, M), m.set(s, Q), M || (rr.has(s) || s.removeAttribute(r), rr.delete(s)), Q || s.removeAttribute(c);
    }), us--, us || (ol = /* @__PURE__ */ new WeakMap(), ol = /* @__PURE__ */ new WeakMap(), rr = /* @__PURE__ */ new WeakMap(), or = {});
  };
}, bS = function(u, i, c) {
  c === void 0 && (c = "data-aria-hidden");
  var r = Array.from(Array.isArray(u) ? u : [u]), d = hS(u);
  return d ? (r.push.apply(r, Array.from(d.querySelectorAll("[aria-live], script"))), vS(r, d, c, "aria-hidden")) : function() {
    return null;
  };
}, SS = Object.defineProperty, se = (u, i) => SS(u, "name", { value: i, configurable: !0 }), Rs = "Dialog", [Eg, Cx] = /* @__PURE__ */ Pp(Rs), [xS, ke] = Eg(Rs), NS = /* @__PURE__ */ se((u) => {
  const {
    __scopeDialog: i,
    children: c,
    open: r,
    defaultOpen: d,
    onOpenChange: m,
    modal: p = !0
  } = u, v = z.useRef(null), S = z.useRef(null), [U, R] = tg({
    prop: r,
    defaultProp: d ?? !1,
    onChange: m,
    caller: Rs
  }), [s, M] = z.useState(0), [Q, H] = z.useState(0);
  return /* @__PURE__ */ h.jsx(
    xS,
    {
      scope: i,
      triggerRef: v,
      contentRef: S,
      contentId: fr(),
      titleId: fr(),
      descriptionId: fr(),
      titlePresent: s > 0,
      descriptionPresent: Q > 0,
      setTitleCount: M,
      setDescriptionCount: H,
      open: U,
      onOpenChange: R,
      onOpenToggle: z.useCallback(() => R((B) => !B), [R]),
      modal: p,
      children: c
    }
  );
}, "Dialog"), Vg = "DialogPortal", [TS, Kg] = Eg(Vg, {
  forceMount: void 0
}), US = /* @__PURE__ */ se((u) => {
  const { __scopeDialog: i, forceMount: c, children: r, container: d } = u, m = ke(Vg, i);
  return /* @__PURE__ */ h.jsx(TS, { scope: i, forceMount: c, children: z.Children.map(r, (p) => /* @__PURE__ */ h.jsx(zs, { present: c || m.open, children: /* @__PURE__ */ h.jsx(Ob, { asChild: !0, container: d, children: p }) })) });
}, "DialogPortal"), vs = "DialogOverlay", wg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ se(function(i, c) {
    const r = Kg(vs, i.__scopeDialog), { forceMount: d = r.forceMount, ...m } = i, p = ke(vs, i.__scopeDialog);
    return p.modal ? /* @__PURE__ */ h.jsx(zs, { present: d || p.open, children: /* @__PURE__ */ h.jsx(zS, { ...m, ref: c }) }) : null;
  }, "DialogOverlay")
), MS = /* @__PURE__ */ Ts("DialogOverlay.RemoveScroll"), zS = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ se(function(i, c) {
    const { __scopeDialog: r, ...d } = i, m = ke(vs, r), p = cg(), v = ml(c, p);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ h.jsx(Rg, { as: MS, allowPinchZoom: !0, shards: [m.contentRef], children: /* @__PURE__ */ h.jsx(
        dn.div,
        {
          "data-state": Os(m.open),
          ...d,
          ref: v,
          style: { pointerEvents: "auto", ...d.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), bu = "DialogContent", Cg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ se(function(i, c) {
    const r = Kg(bu, i.__scopeDialog), { forceMount: d = r.forceMount, ...m } = i, p = ke(bu, i.__scopeDialog);
    return /* @__PURE__ */ h.jsx(zs, { present: d || p.open, children: p.modal ? /* @__PURE__ */ h.jsx(jS, { ...m, ref: c }) : /* @__PURE__ */ h.jsx(DS, { ...m, ref: c }) });
  }, "DialogContent")
), jS = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ se(function(i, c) {
    const r = ke(bu, i.__scopeDialog), d = z.useRef(null), m = ml(c, r.contentRef, d);
    return z.useEffect(() => {
      const p = d.current;
      if (p) return bS(p);
    }, []), /* @__PURE__ */ h.jsx(
      qg,
      {
        ...i,
        ref: m,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        onCloseAutoFocus: wa(i.onCloseAutoFocus, (p) => {
          var v;
          p.preventDefault(), (v = r.triggerRef.current) == null || v.focus();
        }),
        onPointerDownOutside: wa(i.onPointerDownOutside, (p) => {
          const v = p.detail.originalEvent, S = v.button === 0 && v.ctrlKey === !0;
          (v.button === 2 || S) && p.preventDefault();
        }),
        onFocusOutside: wa(
          i.onFocusOutside,
          (p) => p.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), DS = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ se(function(i, c) {
    const r = ke(bu, i.__scopeDialog), d = z.useRef(!1), m = z.useRef(!1);
    return /* @__PURE__ */ h.jsx(
      qg,
      {
        ...i,
        ref: c,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (p) => {
          var v, S;
          (v = i.onCloseAutoFocus) == null || v.call(i, p), p.defaultPrevented || (d.current || (S = r.triggerRef.current) == null || S.focus(), p.preventDefault()), d.current = !1, m.current = !1;
        },
        onInteractOutside: (p) => {
          var U, R;
          (U = i.onInteractOutside) == null || U.call(i, p), p.defaultPrevented || (d.current = !0, p.detail.originalEvent.type === "pointerdown" && (m.current = !0));
          const v = p.target;
          ((R = r.triggerRef.current) == null ? void 0 : R.contains(v)) && p.preventDefault(), p.detail.originalEvent.type === "focusin" && m.current && p.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), qg = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ se(function(i, c) {
    const { __scopeDialog: r, trapFocus: d, onOpenAutoFocus: m, onCloseAutoFocus: p, ...v } = i, S = ke(bu, r);
    return Ds(), /* @__PURE__ */ h.jsx(h.Fragment, { children: /* @__PURE__ */ h.jsx(
      jb,
      {
        asChild: !0,
        loop: !0,
        trapped: d,
        onMountAutoFocus: m,
        onUnmountAutoFocus: p,
        children: /* @__PURE__ */ h.jsx(
          Ub,
          {
            role: "dialog",
            id: S.contentId,
            "aria-describedby": S.descriptionPresent ? S.descriptionId : void 0,
            "aria-labelledby": S.titlePresent ? S.titleId : void 0,
            "data-state": Os(S.open),
            ...v,
            ref: c,
            deferPointerDownOutside: !0,
            onDismiss: () => S.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), RS = "DialogTitle", kg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ se(function(i, c) {
    const { __scopeDialog: r, ...d } = i, m = ke(RS, r), { setTitleCount: p } = m;
    return Ca(() => (p((v) => v + 1), () => p((v) => v - 1)), [p]), /* @__PURE__ */ h.jsx(dn.h2, { id: m.titleId, ...d, ref: c });
  }, "DialogTitle")
), OS = "DialogDescription", Bg = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ se(function(i, c) {
    const { __scopeDialog: r, ...d } = i, m = ke(OS, r), { setDescriptionCount: p } = m;
    return Ca(() => (p((v) => v + 1), () => p((v) => v - 1)), [p]), /* @__PURE__ */ h.jsx(dn.p, { id: m.descriptionId, ...d, ref: c });
  }, "DialogDescription")
), ES = "DialogClose", VS = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ se(function(i, c) {
    const { __scopeDialog: r, ...d } = i, m = ke(ES, r);
    return /* @__PURE__ */ h.jsx(
      dn.button,
      {
        type: "button",
        ...d,
        ref: c,
        onClick: wa(i.onClick, () => m.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function Os(u) {
  return u ? "open" : "closed";
}
se(Os, "getState");
function Yg(u) {
  var i, c, r = "";
  if (typeof u == "string" || typeof u == "number") r += u;
  else if (typeof u == "object") if (Array.isArray(u)) {
    var d = u.length;
    for (i = 0; i < d; i++) u[i] && (c = Yg(u[i])) && (r && (r += " "), r += c);
  } else for (c in u) u[c] && (r && (r += " "), r += c);
  return r;
}
function KS() {
  for (var u, i, c = 0, r = "", d = arguments.length; c < d; c++) (u = arguments[c]) && (i = Yg(u)) && (r && (r += " "), r += i);
  return r;
}
const wS = (u, i) => {
  const c = new Array(u.length + i.length);
  for (let r = 0; r < u.length; r++)
    c[r] = u[r];
  for (let r = 0; r < i.length; r++)
    c[u.length + r] = i[r];
  return c;
}, CS = (u, i) => ({
  classGroupId: u,
  validator: i
}), Hg = (u = /* @__PURE__ */ new Map(), i = null, c) => ({
  nextPart: u,
  validators: i,
  classGroupId: c
}), hr = "-", jp = [], qS = "arbitrary..", kS = (u) => {
  const i = YS(u), {
    conflictingClassGroups: c,
    conflictingClassGroupModifiers: r
  } = u;
  return {
    getClassGroupId: (p) => {
      if (p.startsWith("[") && p.endsWith("]"))
        return BS(p);
      const v = p.split(hr), S = v[0] === "" && v.length > 1 ? 1 : 0;
      return Gg(v, S, i);
    },
    getConflictingClassGroupIds: (p, v) => {
      if (v) {
        const S = r[p], U = c[p];
        return S ? U ? wS(U, S) : S : U || jp;
      }
      return c[p] || jp;
    }
  };
}, Gg = (u, i, c) => {
  if (u.length - i === 0)
    return c.classGroupId;
  const d = u[i], m = c.nextPart.get(d);
  if (m) {
    const U = Gg(u, i + 1, m);
    if (U) return U;
  }
  const p = c.validators;
  if (p === null)
    return;
  const v = i === 0 ? u.join(hr) : u.slice(i).join(hr), S = p.length;
  for (let U = 0; U < S; U++) {
    const R = p[U];
    if (R.validator(v))
      return R.classGroupId;
  }
}, BS = (u) => u.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const i = u.slice(1, -1), c = i.indexOf(":"), r = i.slice(0, c);
  return r ? qS + r : void 0;
})(), YS = (u) => {
  const {
    theme: i,
    classGroups: c
  } = u;
  return HS(c, i);
}, HS = (u, i) => {
  const c = Hg();
  for (const r in u) {
    const d = u[r];
    Es(d, c, r, i);
  }
  return c;
}, Es = (u, i, c, r) => {
  const d = u.length;
  for (let m = 0; m < d; m++) {
    const p = u[m];
    GS(p, i, c, r);
  }
}, GS = (u, i, c, r) => {
  if (typeof u == "string") {
    FS(u, i, c);
    return;
  }
  if (typeof u == "function") {
    ZS(u, i, c, r);
    return;
  }
  QS(u, i, c, r);
}, FS = (u, i, c) => {
  const r = u === "" ? i : Fg(i, u);
  r.classGroupId = c;
}, ZS = (u, i, c, r) => {
  if (JS(u)) {
    Es(u(r), i, c, r);
    return;
  }
  i.validators === null && (i.validators = []), i.validators.push(CS(c, u));
}, QS = (u, i, c, r) => {
  const d = Object.entries(u), m = d.length;
  for (let p = 0; p < m; p++) {
    const [v, S] = d[p];
    Es(S, Fg(i, v), c, r);
  }
}, Fg = (u, i) => {
  let c = u;
  const r = i.split(hr), d = r.length;
  for (let m = 0; m < d; m++) {
    const p = r[m];
    let v = c.nextPart.get(p);
    v || (v = Hg(), c.nextPart.set(p, v)), c = v;
  }
  return c;
}, JS = (u) => "isThemeGetter" in u && u.isThemeGetter === !0, WS = (u) => {
  if (u < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, c = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const d = (m, p) => {
    c[m] = p, i++, i > u && (i = 0, r = c, c = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(m) {
      let p = c[m];
      if (p !== void 0)
        return p;
      if ((p = r[m]) !== void 0)
        return d(m, p), p;
    },
    set(m, p) {
      m in c ? c[m] = p : d(m, p);
    }
  };
}, bs = "!", Dp = ":", LS = [], Rp = (u, i, c, r, d) => ({
  modifiers: u,
  hasImportantModifier: i,
  baseClassName: c,
  maybePostfixModifierPosition: r,
  isExternal: d
}), XS = (u) => {
  const {
    prefix: i,
    experimentalParseClassName: c
  } = u;
  let r = (d) => {
    const m = [];
    let p = 0, v = 0, S = 0, U;
    const R = d.length;
    for (let B = 0; B < R; B++) {
      const C = d[B];
      if (p === 0 && v === 0) {
        if (C === Dp) {
          m.push(d.slice(S, B)), S = B + 1;
          continue;
        }
        if (C === "/") {
          U = B;
          continue;
        }
      }
      C === "[" ? p++ : C === "]" ? p-- : C === "(" ? v++ : C === ")" && v--;
    }
    const s = m.length === 0 ? d : d.slice(S);
    let M = s, Q = !1;
    s.endsWith(bs) ? (M = s.slice(0, -1), Q = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      s.startsWith(bs) && (M = s.slice(1), Q = !0)
    );
    const H = U && U > S ? U - S : void 0;
    return Rp(m, Q, M, H);
  };
  if (i) {
    const d = i + Dp, m = r;
    r = (p) => p.startsWith(d) ? m(p.slice(d.length)) : Rp(LS, !1, p, void 0, !0);
  }
  if (c) {
    const d = r;
    r = (m) => c({
      className: m,
      parseClassName: d
    });
  }
  return r;
}, IS = (u) => {
  const i = /* @__PURE__ */ new Map();
  return u.orderSensitiveModifiers.forEach((c, r) => {
    i.set(c, 1e6 + r);
  }), (c) => {
    const r = [];
    let d = [];
    for (let m = 0; m < c.length; m++) {
      const p = c[m], v = p[0] === "[", S = i.has(p);
      v || S ? (d.length > 0 && (d.sort(), r.push(...d), d = []), r.push(p)) : d.push(p);
    }
    return d.length > 0 && (d.sort(), r.push(...d)), r;
  };
}, PS = (u) => ({
  cache: WS(u.cacheSize),
  parseClassName: XS(u),
  sortModifiers: IS(u),
  postfixLookupClassGroupIds: _S(u),
  ...kS(u)
}), _S = (u) => {
  const i = /* @__PURE__ */ Object.create(null), c = u.postfixLookupClassGroups;
  if (c)
    for (let r = 0; r < c.length; r++)
      i[c[r]] = !0;
  return i;
}, $S = /\s+/, tx = (u, i) => {
  const {
    parseClassName: c,
    getClassGroupId: r,
    getConflictingClassGroupIds: d,
    sortModifiers: m,
    postfixLookupClassGroupIds: p
  } = i, v = [], S = u.trim().split($S);
  let U = "";
  for (let R = S.length - 1; R >= 0; R -= 1) {
    const s = S[R], {
      isExternal: M,
      modifiers: Q,
      hasImportantModifier: H,
      baseClassName: B,
      maybePostfixModifierPosition: C
    } = c(s);
    if (M) {
      U = s + (U.length > 0 ? " " + U : U);
      continue;
    }
    let Y = !!C, X;
    if (Y) {
      const P = B.substring(0, C);
      X = r(P);
      const k = X && p[X] ? r(B) : void 0;
      k && k !== X && (X = k, Y = !1);
    } else
      X = r(B);
    if (!X) {
      if (!Y) {
        U = s + (U.length > 0 ? " " + U : U);
        continue;
      }
      if (X = r(B), !X) {
        U = s + (U.length > 0 ? " " + U : U);
        continue;
      }
      Y = !1;
    }
    const nt = Q.length === 0 ? "" : Q.length === 1 ? Q[0] : m(Q).join(":"), tt = H ? nt + bs : nt, it = tt + X;
    if (v.indexOf(it) > -1)
      continue;
    v.push(it);
    const ct = d(X, Y);
    for (let P = 0; P < ct.length; ++P) {
      const k = ct[P];
      v.push(tt + k);
    }
    U = s + (U.length > 0 ? " " + U : U);
  }
  return U;
}, Ax = (...u) => {
  let i = 0, c, r, d = "";
  for (; i < u.length; )
    (c = u[i++]) && (r = Zg(c)) && (d && (d += " "), d += r);
  return d;
}, Zg = (u) => {
  if (typeof u == "string")
    return u;
  let i, c = "";
  for (let r = 0; r < u.length; r++)
    u[r] && (i = Zg(u[r])) && (c && (c += " "), c += i);
  return c;
}, ex = (u, ...i) => {
  let c, r, d, m;
  const p = (S) => {
    const U = i.reduce((R, s) => s(R), u());
    return c = PS(U), r = c.cache.get, d = c.cache.set, m = v, v(S);
  }, v = (S) => {
    const U = r(S);
    if (U)
      return U;
    const R = tx(S, c);
    return d(S, R), R;
  };
  return m = p, (...S) => m(Ax(...S));
}, ax = [], sA = (u) => {
  const i = (c) => c[u] || ax;
  return i.isThemeGetter = !0, i.themeKey = u, i;
}, Qg = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Jg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, nx = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, lx = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ux = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ix = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, rx = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ox = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ka = (u) => nx.test(u), bt = (u) => !!u && !Number.isNaN(Number(u)), Ce = (u) => !!u && Number.isInteger(Number(u)), is = (u) => u.endsWith("%") && bt(u.slice(0, -1)), Aa = (u) => lx.test(u), Wg = () => !0, cx = (u) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ux.test(u) && !ix.test(u)
), Vs = () => !1, sx = (u) => rx.test(u), fx = (u) => ox.test(u), dx = (u) => !et(u) && !at(u), mx = (u) => u.startsWith("@container") && (u[10] === "/" && u[11] !== void 0 || u[11] === "s" && u[16] !== void 0 && u.startsWith("-size/", 10) || u[11] === "n" && u[18] !== void 0 && u.startsWith("-normal/", 10)), px = (u) => qa(u, Ig, Vs), et = (u) => Qg.test(u), fn = (u) => qa(u, Pg, cx), Op = (u) => qa(u, Nx, bt), gx = (u) => qa(u, $g, Wg), hx = (u) => qa(u, _g, Vs), Ep = (u) => qa(u, Lg, Vs), yx = (u) => qa(u, Xg, fx), cr = (u) => qa(u, th, sx), at = (u) => Jg.test(u), hu = (u) => mn(u, Pg), vx = (u) => mn(u, _g), Vp = (u) => mn(u, Lg), bx = (u) => mn(u, Ig), Sx = (u) => mn(u, Xg), sr = (u) => mn(u, th, !0), xx = (u) => mn(u, $g, !0), qa = (u, i, c) => {
  const r = Qg.exec(u);
  return r ? r[1] ? i(r[1]) : c(r[2]) : !1;
}, mn = (u, i, c = !1) => {
  const r = Jg.exec(u);
  return r ? r[1] ? i(r[1]) : c : !1;
}, Lg = (u) => u === "position" || u === "percentage", Xg = (u) => u === "image" || u === "url", Ig = (u) => u === "length" || u === "size" || u === "bg-size", Pg = (u) => u === "length", Nx = (u) => u === "number", _g = (u) => u === "family-name", $g = (u) => u === "number" || u === "weight", th = (u) => u === "shadow", Tx = () => {
  const u = sA("color"), i = sA("font"), c = sA("text"), r = sA("font-weight"), d = sA("tracking"), m = sA("leading"), p = sA("breakpoint"), v = sA("container"), S = sA("spacing"), U = sA("radius"), R = sA("shadow"), s = sA("inset-shadow"), M = sA("text-shadow"), Q = sA("drop-shadow"), H = sA("blur"), B = sA("perspective"), C = sA("aspect"), Y = sA("ease"), X = sA("animate"), nt = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], tt = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], it = () => [...tt(), at, et], ct = () => ["auto", "hidden", "clip", "visible", "scroll"], P = () => ["auto", "contain", "none"], k = () => [at, et, S], mt = () => [Ka, "full", "auto", ...k()], Gt = () => [Ce, "none", "subgrid", at, et], jt = () => ["auto", {
    span: ["full", Ce, at, et]
  }, Ce, at, et], rt = () => [Ce, "auto", at, et], Lt = () => ["auto", "min", "max", "fr", at, et], Et = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], Ut = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], q = () => ["auto", ...k()], _ = () => [Ka, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...k()], ut = () => [v, Ka, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...k()], ft = () => [Ka, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...k()], Z = () => [u, at, et], Ft = () => [...tt(), Vp, Ep, {
    position: [at, et]
  }], Jt = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], iA = () => ["auto", "cover", "contain", bx, px, {
    size: [at, et]
  }], y = () => [is, hu, fn], E = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    U,
    at,
    et
  ], F = () => ["", bt, hu, fn], I = () => ["solid", "dashed", "dotted", "double"], dt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], w = () => [bt, is, Vp, Ep], $ = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    H,
    at,
    et
  ], G = () => ["none", bt, at, et], W = () => ["none", bt, at, et], Mt = () => [bt, at, et], rA = () => [Ka, "full", ...k()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Aa],
      breakpoint: [Aa],
      color: [Wg],
      container: [Aa],
      "drop-shadow": [Aa],
      ease: ["in", "out", "in-out"],
      font: [dx],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Aa],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Aa],
      shadow: [Aa],
      spacing: ["px", bt],
      text: [Aa],
      "text-shadow": [Aa],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Ka, et, at, C]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", at, et]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [mx],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [bt, "auto", et, at, v]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": nt()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": nt()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: it()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: ct()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": ct()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": ct()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: P()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": P()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": P()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: mt()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": mt()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": mt()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": mt(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: mt()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": mt(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: mt()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": mt()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": mt()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: mt()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: mt()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: mt()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: mt()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Ce, "auto", at, et]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Ka, "full", "auto", v, ...k()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [bt, Ka, "auto", "initial", "none", et]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", bt, at, et]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", bt, at, et]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Ce, "first", "last", "none", at, et]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": Gt()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: jt()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": rt()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": rt()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": Gt()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: jt()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": rt()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": rt()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": Lt()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Lt()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: k()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": k()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": k()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Et(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...Ut(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...Ut()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Et()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...Ut(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...Ut(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Et()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...Ut(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...Ut()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: k()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: k()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: k()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: k()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: k()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: k()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: k()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: k()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: k()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: k()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: k()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: q()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: q()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: q()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: q()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: q()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: q()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: q()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: q()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: q()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: q()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: q()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": k()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": k()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: _()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...ut()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...ut()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...ut()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...ft()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...ft()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...ft()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [v, "screen", ..._()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          v,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ..._()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          v,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [p]
          },
          ..._()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ..._()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ..._()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ..._()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", c, hu, fn]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [r, xx, gx]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", is, et]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [vx, hx, i]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [et]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [d, at, et]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [bt, "none", at, Op]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          m,
          ...k()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", at, et]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", at, et]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: Z()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: Z()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...I(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [bt, "from-font", "auto", at, fn]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: Z()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [bt, "auto", at, et]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: k()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [Ce, at, et]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", at, et]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", at, et]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Ft()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Jt()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: iA()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Ce, at, et],
          radial: ["", at, et],
          conic: ["", Ce, at, et]
        }, Sx, yx]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: Z()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: y()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: y()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: y()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: Z()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: Z()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: Z()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: E()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": E()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": E()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": E()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": E()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": E()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": E()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": E()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": E()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": E()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": E()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": E()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": E()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": E()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": E()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: F()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": F()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": F()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": F()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": F()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": F()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": F()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": F()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": F()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": F()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": F()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": F()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": F()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...I(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...I(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: Z()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": Z()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": Z()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": Z()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": Z()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": Z()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": Z()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": Z()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": Z()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": Z()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": Z()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: Z()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...I(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [bt, at, et]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", bt, hu, fn]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: Z()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          // Deprecated since Tailwind CSS v4.0.0
          "inner",
          "none",
          R,
          sr,
          cr
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: Z()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", s, sr, cr]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": Z()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: F()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: Z()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [bt, fn]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": Z()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": F()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": Z()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", M, sr, cr]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": Z()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [bt, at, et]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...dt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": dt()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [bt]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": w()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": w()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": Z()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": Z()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": w()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": w()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": Z()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": Z()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": w()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": w()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": Z()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": Z()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": w()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": w()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": Z()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": Z()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": w()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": w()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": Z()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": Z()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": w()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": w()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": Z()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": Z()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": w()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": w()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": Z()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": Z()
      }],
      "mask-image-radial": [{
        "mask-radial": [at, et]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": w()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": w()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": Z()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": Z()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": tt()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [bt]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": w()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": w()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": Z()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": Z()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Ft()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Jt()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: iA()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", at, et]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          at,
          et
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: $()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [bt, at, et]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [bt, at, et]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          Q,
          sr,
          cr
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": Z()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", bt, at, et]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [bt, at, et]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", bt, at, et]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [bt, at, et]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", bt, at, et]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          at,
          et
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": $()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [bt, at, et]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [bt, at, et]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", bt, at, et]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [bt, at, et]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", bt, at, et]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [bt, at, et]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [bt, at, et]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", bt, at, et]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": k()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": k()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": k()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", at, et]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [bt, "initial", at, et]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", Y, at, et]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [bt, at, et]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", X, at, et]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [B, at, et]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": it()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: G()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": G()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": G()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": G()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: W()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": W()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": W()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": W()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Mt()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Mt()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Mt()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [at, et, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: it()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: rA()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": rA()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": rA()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": rA()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [Ce, at, et]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: Z()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: Z()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", at, et]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": Z()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": Z()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": k()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": k()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": k()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": k()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": k()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": k()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": k()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": k()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": k()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": k()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": k()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": k()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": k()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": k()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": k()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": k()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": k()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": k()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": k()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": k()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": k()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": k()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", at, et]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...Z()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [bt, hu, fn, Op]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...Z()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["start", "end", "right", "left"],
      "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["ps", "pe", "pr", "pl"],
      py: ["pbs", "pbe", "pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["ms", "me", "mr", "ml"],
      my: ["mbs", "mbe", "mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
      "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-s", "border-color-e", "border-color-r", "border-color-l"],
      "border-color-y": ["border-color-bs", "border-color-be", "border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, Ux = /* @__PURE__ */ ex(Tx);
function pl(...u) {
  return Ux(KS(u));
}
const vr = NS, Mx = US, Ah = z.forwardRef(({ className: u, ...i }, c) => /* @__PURE__ */ h.jsx(
  wg,
  {
    ref: c,
    className: pl(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      u
    ),
    ...i
  }
));
Ah.displayName = wg.displayName;
const Tu = z.forwardRef(({ className: u, children: i, ...c }, r) => /* @__PURE__ */ h.jsxs(Mx, { children: [
  /* @__PURE__ */ h.jsx(Ah, {}),
  /* @__PURE__ */ h.jsxs(
    Cg,
    {
      ref: r,
      className: pl(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        u
      ),
      ...c,
      children: [
        i,
        /* @__PURE__ */ h.jsxs(VS, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ h.jsx(Gv, { className: "h-4 w-4" }),
          /* @__PURE__ */ h.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
Tu.displayName = Cg.displayName;
const Uu = ({ className: u, ...i }) => /* @__PURE__ */ h.jsx("div", { className: pl("flex flex-col space-y-1.5 text-center sm:text-left", u), ...i });
Uu.displayName = "DialogHeader";
const Mu = ({ className: u, ...i }) => /* @__PURE__ */ h.jsx(
  "div",
  {
    className: pl("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", u),
    ...i
  }
);
Mu.displayName = "DialogFooter";
const zu = z.forwardRef(({ className: u, ...i }, c) => /* @__PURE__ */ h.jsx(
  kg,
  {
    ref: c,
    className: pl("text-lg font-semibold leading-none tracking-tight", u),
    ...i
  }
));
zu.displayName = kg.displayName;
const ju = z.forwardRef(({ className: u, ...i }, c) => /* @__PURE__ */ h.jsx(
  Bg,
  {
    ref: c,
    className: pl("text-sm text-muted-foreground", u),
    ...i
  }
));
ju.displayName = Bg.displayName;
function zx({
  line: u,
  onToggle: i
}) {
  const c = xu(u.productId), r = c.groups.flatMap((d) => {
    const m = _A[d];
    return m ? [m] : [];
  });
  return /* @__PURE__ */ h.jsxs("div", { className: "rounded-2xl border border-brand/30 bg-surface-2/50 p-3", children: [
    /* @__PURE__ */ h.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ h.jsx(
          "img",
          {
            src: c.image,
            alt: c.name,
            loading: "lazy",
            width: 816,
            height: 816,
            className: "h-10 w-10 shrink-0 rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ h.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ h.jsx("p", { className: "truncate text-sm font-bold", children: c.name }),
          /* @__PURE__ */ h.jsx("p", { className: "text-xs font-bold text-brand", dir: "ltr", children: na(c.price) })
        ] })
      ] }),
      /* @__PURE__ */ h.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: "خيارات وإضافات المنتج" })
    ] }),
    r.length === 0 ? /* @__PURE__ */ h.jsx("p", { className: "py-4 text-center text-xs text-muted-foreground", children: "لا توجد إضافات متاحة لهذا المنتج" }) : /* @__PURE__ */ h.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: r.map((d) => /* @__PURE__ */ h.jsxs("div", { className: "rounded-xl border border-border bg-surface/60 p-2", children: [
      /* @__PURE__ */ h.jsxs("div", { className: "flex items-center justify-between gap-2 pb-2", children: [
        /* @__PURE__ */ h.jsx("p", { className: "truncate text-xs font-bold", children: d.name }),
        /* @__PURE__ */ h.jsx(
          "span",
          {
            className: `shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${d.required ? "bg-brand/15 text-brand" : "bg-surface-3 text-muted-foreground"}`,
            children: d.required ? "مطلوب" : "اختياري"
          }
        )
      ] }),
      /* @__PURE__ */ h.jsx("div", { className: "space-y-1.5", children: d.options.map((m) => {
        const p = (u.selections[d.id] ?? []).includes(m.id);
        return /* @__PURE__ */ h.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(d.id, m.id),
            className: `grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2.5 py-2 text-right transition-colors ${p ? "border-brand bg-brand/15" : "border-border bg-surface-2/60 hover:bg-surface-3"}`,
            children: [
              /* @__PURE__ */ h.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ h.jsx("span", { className: "block truncate text-xs font-bold", children: m.name }),
                /* @__PURE__ */ h.jsx(
                  "span",
                  {
                    className: `block text-[11px] ${p ? "text-brand" : "text-muted-foreground"}`,
                    dir: "ltr",
                    children: m.price > 0 ? `+${m.price}.00` : "+0.00"
                  }
                )
              ] }),
              /* @__PURE__ */ h.jsx(
                "span",
                {
                  className: `grid h-5 w-5 shrink-0 place-items-center border ${d.multi ? "rounded-md" : "rounded-full"} ${p ? "border-brand bg-brand text-brand-foreground" : "border-border"}`,
                  children: p && /* @__PURE__ */ h.jsx(Bp, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          m.id
        );
      }) })
    ] }, d.id)) })
  ] });
}
function jx({ open: u, line: i, busy: c, onOpenChange: r, onToggle: d, onConfirm: m }) {
  const p = i ? Qp(i) : [];
  return /* @__PURE__ */ h.jsx(vr, { open: u, onOpenChange: (v) => !c && r(v), children: /* @__PURE__ */ h.jsxs(Tu, { dir: "rtl", className: "lovable-product-configurator flex h-[100dvh] max-h-[100dvh] max-w-none flex-col gap-3 overflow-hidden border-border bg-surface p-3 text-right sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:p-4", children: [
    /* @__PURE__ */ h.jsxs(Uu, { className: "sr-only", children: [
      /* @__PURE__ */ h.jsx(zu, { children: "تهيئة المنتج" }),
      /* @__PURE__ */ h.jsx(ju, { children: "اختر خيارات وإضافات المنتج ثم أكد الاختيارات." })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto pos-scroll", children: i && /* @__PURE__ */ h.jsx(zx, { line: i, onToggle: d }) }),
    /* @__PURE__ */ h.jsxs(Mu, { className: "shrink-0 gap-2 sm:justify-start", children: [
      /* @__PURE__ */ h.jsx("button", { type: "button", disabled: p.length > 0 || c, onClick: m, className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-opacity disabled:opacity-40", children: c ? "جاري مراجعة السعر..." : "تم" }),
      /* @__PURE__ */ h.jsx("button", { type: "button", disabled: c, onClick: () => r(!1), className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground", children: "إلغاء" })
    ] }),
    p.length > 0 && /* @__PURE__ */ h.jsxs("p", { className: "shrink-0 text-xs font-bold text-destructive", children: [
      "أكمل الاختيارات المطلوبة: ",
      p.join(" • ")
    ] })
  ] }) });
}
const Kp = {
  name: "",
  phone: "",
  zoneId: "",
  address: "",
  notes: ""
};
function Dx({
  open: u,
  onOpenChange: i,
  value: c,
  onSave: r
}) {
  const [d, m] = z.useState(c);
  z.useEffect(() => {
    u && m(c);
  }, [u, c]);
  const p = (S, U) => m((R) => ({ ...R, [S]: U })), v = d.name.trim() && d.phone.trim() && d.zoneId && d.address.trim();
  return /* @__PURE__ */ h.jsx(vr, { open: u, onOpenChange: i, children: /* @__PURE__ */ h.jsxs(Tu, { dir: "rtl", className: "max-w-lg border-border bg-surface text-right", children: [
    /* @__PURE__ */ h.jsxs(Uu, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ h.jsxs(zu, { className: "flex items-center gap-2 text-lg font-extrabold", children: [
        /* @__PURE__ */ h.jsx(Yp, { className: "h-5 w-5 text-brand" }),
        "بيانات التوصيل"
      ] }),
      /* @__PURE__ */ h.jsx(ju, { children: "أضف بيانات العميل والعنوان لهذا الطلب." })
    ] }),
    /* @__PURE__ */ h.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ h.jsx(vu, { label: "اسم العميل", children: /* @__PURE__ */ h.jsx(
        "input",
        {
          value: d.name,
          onChange: (S) => p("name", S.target.value),
          className: yu,
          placeholder: "أحمد محمود"
        }
      ) }),
      /* @__PURE__ */ h.jsx(vu, { label: "رقم الهاتف", children: /* @__PURE__ */ h.jsx(
        "input",
        {
          value: d.phone,
          onChange: (S) => p("phone", S.target.value),
          inputMode: "tel",
          dir: "ltr",
          className: `${yu} text-right`,
          placeholder: "01000000000"
        }
      ) }),
      /* @__PURE__ */ h.jsx(vu, { label: "المنطقة", children: /* @__PURE__ */ h.jsxs(
        "select",
        {
          value: d.zoneId,
          onChange: (S) => p("zoneId", S.target.value),
          className: yu,
          children: [
            /* @__PURE__ */ h.jsx("option", { value: "", children: "اختر المنطقة" }),
            gr.map((S) => /* @__PURE__ */ h.jsxs("option", { value: S.id, children: [
              S.name,
              " — رسوم ",
              S.fee,
              " ج.م"
            ] }, S.id))
          ]
        }
      ) }),
      /* @__PURE__ */ h.jsx(vu, { label: "العنوان بالتفصيل", children: /* @__PURE__ */ h.jsx(
        "input",
        {
          value: d.address,
          onChange: (S) => p("address", S.target.value),
          className: yu,
          placeholder: "شارع / عمارة / دور / شقة"
        }
      ) }),
      /* @__PURE__ */ h.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ h.jsx(vu, { label: "ملاحظات التوصيل (اختياري)", children: /* @__PURE__ */ h.jsx(
        "textarea",
        {
          value: d.notes,
          onChange: (S) => p("notes", S.target.value),
          rows: 2,
          className: `${yu} h-auto resize-none py-2`,
          placeholder: "مثال: الجرس معطل — اتصل عند الوصول"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ h.jsxs(Mu, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ h.jsx(
        "button",
        {
          type: "button",
          disabled: !v,
          onClick: () => r(d),
          className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-opacity disabled:opacity-40",
          children: "حفظ"
        }
      ),
      /* @__PURE__ */ h.jsx(
        "button",
        {
          type: "button",
          onClick: () => i(!1),
          className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
          children: "إلغاء"
        }
      )
    ] })
  ] }) });
}
const yu = "h-11 w-full rounded-xl border border-border bg-surface-2/70 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60";
function vu({ label: u, children: i }) {
  return /* @__PURE__ */ h.jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ h.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: u }),
    i
  ] });
}
const Rx = { cash: "نقدي", card_at_venue: "بطاقة عند المطعم", pay_on_delivery: "الدفع عند الاستلام" };
function Ox({ open: u, onOpenChange: i, methods: c, busy: r, onConfirm: d }) {
  const [m, p] = z.useState("");
  return z.useEffect(() => {
    u && p(c.length === 1 ? c[0] : "");
  }, [u]), /* @__PURE__ */ h.jsx(vr, { open: u, onOpenChange: i, children: /* @__PURE__ */ h.jsxs(Tu, { dir: "rtl", className: "max-w-md border-border bg-surface text-right", children: [
    /* @__PURE__ */ h.jsxs(Uu, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ h.jsx(zu, { className: "text-lg font-extrabold", children: "تأكيد طريقة الدفع" }),
      /* @__PURE__ */ h.jsx(ju, { children: "اختر طريقة الدفع المتاحة لهذا الطلب قبل الإرسال." })
    ] }),
    /* @__PURE__ */ h.jsx("div", { className: "grid gap-2", children: c.map((v) => /* @__PURE__ */ h.jsx("button", { type: "button", onClick: () => p(v), className: `h-12 rounded-xl border px-4 text-right text-sm font-bold transition-colors ${m === v ? "border-brand bg-brand/15 text-brand" : "border-border bg-surface-2 text-foreground"}`, children: Rx[v] || v }, v)) }),
    /* @__PURE__ */ h.jsxs(Mu, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ h.jsx("button", { type: "button", disabled: !m || r, onClick: () => d(m), className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] disabled:opacity-40", children: r ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلب" }),
      /* @__PURE__ */ h.jsx("button", { type: "button", disabled: r, onClick: () => i(!1), className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground", children: "إلغاء" })
    ] })
  ] }) });
}
function Ex({ result: u, handoffHtml: i, onClose: c }) {
  const r = () => {
    var p;
    const d = window.open("", "_blank");
    if (!d) return;
    const m = (((p = u.order) == null ? void 0 : p.items) || []).map((v) => {
      var S, U;
      return `<p>${Number(v.quantity)} × ${String(((U = (S = v.snapshot) == null ? void 0 : S.product) == null ? void 0 : U.name_ar) || "منتج").replace(/[&<>]/g, (R) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[R])} — ${na(Number(v.line_total || 0))}</p>`;
    }).join("");
    d.document.write(`<html lang="ar" dir="rtl"><meta charset="utf-8"><title>${u.reference}</title><h2>${u.reference}</h2>${m}<strong>${na(Number(u.total || 0))}</strong>${i}</html>`), d.document.close(), d.print();
  };
  return /* @__PURE__ */ h.jsx(vr, { open: !0, onOpenChange: (d) => !d && c(), children: /* @__PURE__ */ h.jsxs(Tu, { dir: "rtl", className: "max-w-md border-border bg-surface text-right", children: [
    /* @__PURE__ */ h.jsxs(Uu, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ h.jsx(zu, { className: "text-lg font-extrabold", children: "تم حفظ الطلب" }),
      /* @__PURE__ */ h.jsxs(ju, { children: [
        u.reference,
        " — تم إرساله إلى محضّر الطلب."
      ] })
    ] }),
    /* @__PURE__ */ h.jsx("p", { className: "text-xl font-extrabold text-brand", dir: "ltr", children: na(Number(u.total || 0)) }),
    i && /* @__PURE__ */ h.jsx("div", { dangerouslySetInnerHTML: { __html: i } }),
    /* @__PURE__ */ h.jsxs(Mu, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ h.jsx("button", { type: "button", onClick: r, className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground", children: "طباعة الإيصال" }),
      /* @__PURE__ */ h.jsx("button", { type: "button", onClick: c, className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground", children: "إغلاق" })
    ] })
  ] }) });
}
let Vx = 0;
const Kx = () => `line-${++Vx}`;
function wp(u, i, c) {
  const r = mp(i.productId, i.selections), d = u.find((m) => (c === "add" || m.id !== i.id) && mp(m.productId, m.selections) === r);
  return d ? u.filter((m) => c !== "edit" || m.id !== i.id).map((m) => m.id === d.id ? { ...m, quantity: m.quantity + i.quantity } : m) : c === "edit" ? u.map((m) => m.id === i.id ? i : m) : [...u, i];
}
function wx({ services: u }) {
  const i = u.snapshot.catalog.settings || {}, c = !!i.delivery_enabled, r = `cardfy_pos_draft:${u.context.client_id}:${u.branchId}`, d = z.useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(r) || "null");
    } catch {
      return null;
    }
  }, [r]), m = (d == null ? void 0 : d.orderType) === "delivery" && c ? "delivery" : "pickup", [p, v] = z.useState(m), [S, U] = z.useState(Array.isArray(d == null ? void 0 : d.lines) ? d.lines : []), [R, s] = z.useState(typeof (d == null ? void 0 : d.notes) == "string" ? d.notes : ""), [M, Q] = z.useState((d == null ? void 0 : d.customer) || Kp), [H, B] = z.useState(!1), [C, Y] = z.useState(!1), [X, nt] = z.useState(!1), [tt, it] = z.useState(""), [ct, P] = z.useState(null), [k, mt] = z.useState(null), [Gt, jt] = z.useState(!1), rt = z.useMemo(() => ({ busy: !1, key: "", fingerprint: "" }), []), Lt = z.useMemo(() => S.reduce((w, $) => w + Jp($), 0), [S]), Et = gr.find((w) => w.id === M.zoneId) || null, Ut = p === "delivery" && Et ? Et.fee : 0, q = (u.snapshot.orders || []).filter((w) => w.order_type !== "dinein" && !["completed", "cancelled", "delivered", "on_the_way"].includes(w.status) && !w.assigned_driver_id).length, _ = (i.payment_methods || ["cash"]).filter((w) => p === "delivery" ? ["pay_on_delivery", "cash"].includes(w) : ["cash", "card_at_venue"].includes(w)), ut = (w) => {
    const $ = { id: Kx(), productId: w.id, quantity: 1, selections: Jv(w) };
    if (Zp(w)) {
      mt({ mode: "add", line: $ });
      return;
    }
    U((G) => wp(G, $, "add"));
  }, ft = (w) => {
    const $ = S.find((G) => G.id === w);
    $ && mt({ mode: "edit", line: { ...$, selections: Object.fromEntries(Object.entries($.selections).map(([G, W]) => [G, [...W]])) } });
  }, Z = (w, $) => U((G) => G.flatMap((W) => {
    if (W.id !== w) return [W];
    const Mt = W.quantity + $;
    return Mt <= 0 ? [] : [{ ...W, quantity: Mt }];
  })), Ft = (w) => U(($) => $.filter((G) => G.id !== w)), Jt = () => {
    U([]), s(""), mt(null), sessionStorage.removeItem(r);
  }, iA = (w, $) => mt((G) => {
    if (!G) return G;
    const W = _A[w];
    if (!W) return G;
    const Mt = G.line.selections[w] || [];
    let rA;
    return W.multi ? rA = Mt.includes($) ? Mt.filter((GA) => GA !== $) : Mt.length >= W.max ? Mt : [...Mt, $] : rA = Mt.includes($) && !W.required ? [] : [$], { ...G, line: { ...G.line, selections: { ...G.line.selections, [w]: rA } } };
  }), y = (w, $ = S) => ({ order_type: p === "pickup" ? "takeaway" : "delivery", source: "pos", branch_id: u.branchId, payment_method: w, ...p === "delivery" ? { customer_name: M.name, phone: M.phone, delivery_zone_id: M.zoneId, address: M.address } : {}, notes: [R, p === "delivery" && M.notes ? `ملاحظات التوصيل: ${M.notes}` : ""].filter(Boolean).join(`
`), table_id: "", coupon_code: "", items: $.map((G) => {
    var rA, GA;
    const W = ((GA = (rA = Object.entries(G.selections).find(([oA]) => {
      var Kt;
      return ((Kt = _A[oA]) == null ? void 0 : Kt.kind) === "variant";
    })) == null ? void 0 : rA[1]) == null ? void 0 : GA[0]) || "", Mt = Object.entries(G.selections).filter(([oA]) => {
      var Kt;
      return ((Kt = _A[oA]) == null ? void 0 : Kt.kind) === "option";
    }).flatMap(([, oA]) => oA);
    return { product_id: G.productId, quantity: G.quantity, variant_id: W, option_ids: Mt, notes: "" };
  }) }), E = async () => {
    if (!k || Qp(k.line).length) return;
    const w = wp(S, k.line, k.mode);
    jt(!0);
    try {
      await u.rpc("cfy_os_pos_quote", { p_token: u.context.token, p_page: "takeaway", p_order: y(_[0] || "cash", w) }), U(w), mt(null), sn.success(k.mode === "add" ? "تمت إضافة المنتج" : "تم تحديث المنتج");
    } catch ($) {
      sn.error($.message || "تعذر مراجعة سعر المنتج.");
    } finally {
      jt(!1);
    }
  }, F = () => {
    for (const w of S) {
      const $ = xu(w.productId);
      for (const G of $.groups) {
        const W = _A[G], Mt = (w.selections[G] || []).length;
        if (W && (Mt < W.min || Mt > W.max))
          throw ft(w.id), new Error(`راجع اختيارات ${W.name}.`);
      }
    }
    if (p === "delivery" && (!M.name.trim() || !M.phone.trim() || !M.zoneId || !M.address.trim()))
      throw B(!0), new Error("أكمل بيانات التوصيل قبل إتمام الطلب.");
    if (!_.length) throw new Error("لا توجد طريقة دفع مفعّلة لهذا النوع من الطلبات.");
  }, I = () => {
    try {
      F(), Y(!0);
    } catch (w) {
      sn.error(w.message);
    }
  }, dt = async (w) => {
    if (!rt.busy) {
      rt.busy = !0, nt(!0);
      try {
        const $ = y(w), G = JSON.stringify($);
        rt.fingerprint !== G && (rt.fingerprint = G, rt.key = crypto.randomUUID()), await u.rpc("cfy_os_pos_quote", { p_token: u.context.token, p_page: "takeaway", p_order: $ });
        const W = await u.rpc("cfy_os_pos_order", { p_token: u.context.token, p_page: "takeaway", p_order: $, p_intent: "save", p_request_key: rt.key });
        rt.key = "", rt.fingerprint = "", Y(!1), B(!1), Jt(), Q(Kp), P(W), u.status(`تم إنشاء ${W.reference} وإرساله إلى محضّر الطلب.`), sn.success(`تم إنشاء ${W.reference}`);
      } catch ($) {
        u.status($.message || "تعذر إنشاء الطلب.", !0), sn.error($.message || "تعذر إنشاء الطلب.");
      } finally {
        rt.busy = !1, nt(!1);
      }
    }
  };
  return /* @__PURE__ */ h.jsxs("div", { className: "flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden", children: [
    /* @__PURE__ */ h.jsx(Fv, { actorName: u.context.name || "CARDfy", actorRole: u.context.role === "owner" ? "مالك المطعم" : "موظف المطعم", pendingCount: q, onMenu: u.onMenu, onBell: u.onBell, onSearch: it }),
    /* @__PURE__ */ h.jsxs("main", { className: "grid min-h-0 flex-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1fr)_25rem] xl:grid-cols-[minmax(0,1fr)_28rem]", children: [
      /* @__PURE__ */ h.jsx(Xv, { onAdd: ut, externalQuery: tt }),
      /* @__PURE__ */ h.jsx(Iv, { orderType: p, onOrderTypeChange: (w) => w !== "delivery" || c ? v(w) : void 0, lines: S, onSelectLine: ft, onQuantity: Z, onRemove: Ft, onClearAll: Jt, notes: R, onNotesChange: s, subtotal: Lt, deliveryFee: Ut, zoneName: (Et == null ? void 0 : Et.name) || null, hasAddress: !!M.address, onOpenAddress: () => B(!0), onSaveOrder: () => {
        sessionStorage.setItem(r, JSON.stringify({ lines: S, notes: R, customer: M, orderType: p })), sn.success("تم حفظ الطلب مؤقتاً");
      }, onComplete: I, deliveryEnabled: c })
    ] }),
    /* @__PURE__ */ h.jsxs("footer", { className: "hidden items-center justify-between gap-2 border-t border-border/70 px-5 py-2 text-xs text-muted-foreground lg:flex", children: [
      /* @__PURE__ */ h.jsx("span", { className: "font-bold", children: /* @__PURE__ */ h.jsxs("bdi", { dir: "ltr", children: [
        "CARD",
        /* @__PURE__ */ h.jsx("span", { className: "text-brand", children: "fy" }),
        " Restaurant POS"
      ] }) }),
      /* @__PURE__ */ h.jsx("span", { children: "كل شيء في مكان واحد .. إدارة أسهل .. مطعم أكثر نجاحاً" })
    ] }),
    /* @__PURE__ */ h.jsx(jx, { open: !!k, line: (k == null ? void 0 : k.line) || null, busy: Gt, onOpenChange: (w) => !w && mt(null), onToggle: iA, onConfirm: E }),
    /* @__PURE__ */ h.jsx(Dx, { open: H, onOpenChange: B, value: M, onSave: (w) => {
      Q(w), B(!1), sn.success("تم حفظ بيانات التوصيل");
    } }),
    /* @__PURE__ */ h.jsx(Ox, { open: C, onOpenChange: Y, methods: _, busy: X, onConfirm: dt }),
    ct && /* @__PURE__ */ h.jsx(Ex, { result: ct, handoffHtml: u.customerHandoff(ct), onClose: () => P(null) }),
    /* @__PURE__ */ h.jsx(zv, { richColors: !0, position: "top-center", dir: "rtl" })
  ] });
}
let aa = null;
function qx(u, i) {
  Qv(i.snapshot.catalog, i.branchId), aa == null || aa.unmount(), aa = P1.createRoot(u), aa.render(/* @__PURE__ */ h.jsx(wx, { services: i }));
}
function kx() {
  aa == null || aa.unmount(), aa = null;
}
export {
  qx as mount,
  kx as unmount
};
