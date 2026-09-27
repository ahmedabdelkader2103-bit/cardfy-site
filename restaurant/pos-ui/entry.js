function Y1(u, r) {
  for (var c = 0; c < r.length; c++) {
    const i = r[c];
    if (typeof i != "string" && !Array.isArray(i)) {
      for (const d in i)
        if (d !== "default" && !(d in u)) {
          const p = Object.getOwnPropertyDescriptor(i, d);
          p && Object.defineProperty(u, d, p.get ? p : {
            enumerable: !0,
            get: () => i[d]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(u, Symbol.toStringTag, { value: "Module" }));
}
function wp(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var Wc = { exports: {} }, mu = {};
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
function H1() {
  if (tp) return mu;
  tp = 1;
  var u = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function c(i, d, p) {
    var m = null;
    if (p !== void 0 && (m = "" + p), d.key !== void 0 && (m = "" + d.key), "key" in d) {
      p = {};
      for (var v in d)
        v !== "key" && (p[v] = d[v]);
    } else p = d;
    return d = p.ref, {
      $$typeof: u,
      type: i,
      key: m,
      ref: d !== void 0 ? d : null,
      props: p
    };
  }
  return mu.Fragment = r, mu.jsx = c, mu.jsxs = c, mu;
}
var ep;
function G1() {
  return ep || (ep = 1, Wc.exports = H1()), Wc.exports;
}
var y = G1(), Lc = { exports: {} }, pu = {}, Xc = { exports: {} }, Ic = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ap;
function F1() {
  return ap || (ap = 1, (function(u) {
    function r(k, P) {
      var lA = k.length;
      k.push(P);
      A: for (; 0 < lA; ) {
        var dA = lA - 1 >>> 1, F = k[dA];
        if (0 < d(F, P))
          k[dA] = P, k[lA] = F, lA = dA;
        else break A;
      }
    }
    function c(k) {
      return k.length === 0 ? null : k[0];
    }
    function i(k) {
      if (k.length === 0) return null;
      var P = k[0], lA = k.pop();
      if (lA !== P) {
        k[0] = lA;
        A: for (var dA = 0, F = k.length, GA = F >>> 1; dA < GA; ) {
          var WA = 2 * (dA + 1) - 1, rt = k[WA], h = WA + 1, U = k[h];
          if (0 > d(rt, lA))
            h < F && 0 > d(U, rt) ? (k[dA] = U, k[h] = lA, dA = h) : (k[dA] = rt, k[WA] = lA, dA = WA);
          else if (h < F && 0 > d(U, lA))
            k[dA] = U, k[h] = lA, dA = h;
          else break A;
        }
      }
      return P;
    }
    function d(k, P) {
      var lA = k.sortIndex - P.sortIndex;
      return lA !== 0 ? lA : k.id - P.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var p = performance;
      u.unstable_now = function() {
        return p.now();
      };
    } else {
      var m = Date, v = m.now();
      u.unstable_now = function() {
        return m.now() - v;
      };
    }
    var S = [], M = [], O = 1, s = null, D = 3, Z = !1, q = !1, Y = !1, C = !1, H = typeof setTimeout == "function" ? setTimeout : null, I = typeof clearTimeout == "function" ? clearTimeout : null, aA = typeof setImmediate < "u" ? setImmediate : null;
    function uA(k) {
      for (var P = c(M); P !== null; ) {
        if (P.callback === null) i(M);
        else if (P.startTime <= k)
          i(M), P.sortIndex = P.expirationTime, r(S, P);
        else break;
        P = c(M);
      }
    }
    function iA(k) {
      if (Y = !1, uA(k), !q)
        if (c(S) !== null)
          q = !0, sA || (sA = !0, oA());
        else {
          var P = c(M);
          P !== null && TA(iA, P.startTime - k);
        }
    }
    var sA = !1, J = -1, B = 5, gA = -1;
    function xA() {
      return C ? !0 : !(u.unstable_now() - gA < B);
    }
    function zA() {
      if (C = !1, sA) {
        var k = u.unstable_now();
        gA = k;
        var P = !0;
        try {
          A: {
            q = !1, Y && (Y = !1, I(J), J = -1), Z = !0;
            var lA = D;
            try {
              t: {
                for (uA(k), s = c(S); s !== null && !(s.expirationTime > k && xA()); ) {
                  var dA = s.callback;
                  if (typeof dA == "function") {
                    s.callback = null, D = s.priorityLevel;
                    var F = dA(
                      s.expirationTime <= k
                    );
                    if (k = u.unstable_now(), typeof F == "function") {
                      s.callback = F, uA(k), P = !0;
                      break t;
                    }
                    s === c(S) && i(S), uA(k);
                  } else i(S);
                  s = c(S);
                }
                if (s !== null) P = !0;
                else {
                  var GA = c(M);
                  GA !== null && TA(
                    iA,
                    GA.startTime - k
                  ), P = !1;
                }
              }
              break A;
            } finally {
              s = null, D = lA, Z = !1;
            }
            P = void 0;
          }
        } finally {
          P ? oA() : sA = !1;
        }
      }
    }
    var oA;
    if (typeof aA == "function")
      oA = function() {
        aA(zA);
      };
    else if (typeof MessageChannel < "u") {
      var JA = new MessageChannel(), HA = JA.port2;
      JA.port1.onmessage = zA, oA = function() {
        HA.postMessage(null);
      };
    } else
      oA = function() {
        H(zA, 0);
      };
    function TA(k, P) {
      J = H(function() {
        k(u.unstable_now());
      }, P);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(k) {
      k.callback = null;
    }, u.unstable_forceFrameRate = function(k) {
      0 > k || 125 < k ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : B = 0 < k ? Math.floor(1e3 / k) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return D;
    }, u.unstable_next = function(k) {
      switch (D) {
        case 1:
        case 2:
        case 3:
          var P = 3;
          break;
        default:
          P = D;
      }
      var lA = D;
      D = P;
      try {
        return k();
      } finally {
        D = lA;
      }
    }, u.unstable_requestPaint = function() {
      C = !0;
    }, u.unstable_runWithPriority = function(k, P) {
      switch (k) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          k = 3;
      }
      var lA = D;
      D = k;
      try {
        return P();
      } finally {
        D = lA;
      }
    }, u.unstable_scheduleCallback = function(k, P, lA) {
      var dA = u.unstable_now();
      switch (typeof lA == "object" && lA !== null ? (lA = lA.delay, lA = typeof lA == "number" && 0 < lA ? dA + lA : dA) : lA = dA, k) {
        case 1:
          var F = -1;
          break;
        case 2:
          F = 250;
          break;
        case 5:
          F = 1073741823;
          break;
        case 4:
          F = 1e4;
          break;
        default:
          F = 5e3;
      }
      return F = lA + F, k = {
        id: O++,
        callback: P,
        priorityLevel: k,
        startTime: lA,
        expirationTime: F,
        sortIndex: -1
      }, lA > dA ? (k.sortIndex = lA, r(M, k), c(S) === null && k === c(M) && (Y ? (I(J), J = -1) : Y = !0, TA(iA, lA - dA))) : (k.sortIndex = F, r(S, k), q || Z || (q = !0, sA || (sA = !0, oA()))), k;
    }, u.unstable_shouldYield = xA, u.unstable_wrapCallback = function(k) {
      var P = D;
      return function() {
        var lA = D;
        D = P;
        try {
          return k.apply(this, arguments);
        } finally {
          D = lA;
        }
      };
    };
  })(Ic)), Ic;
}
var np;
function Z1() {
  return np || (np = 1, Xc.exports = F1()), Xc.exports;
}
var Pc = { exports: {} }, pA = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lp;
function Q1() {
  if (lp) return pA;
  lp = 1;
  var u = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.consumer"), m = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), M = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), s = Symbol.for("react.activity"), D = Symbol.for("react.view_transition"), Z = Symbol.iterator;
  function q(h) {
    return h === null || typeof h != "object" ? null : (h = Z && h[Z] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var Y = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, C = Object.assign, H = {};
  function I(h, U, w) {
    this.props = h, this.context = U, this.refs = H, this.updater = w || Y;
  }
  I.prototype.isReactComponent = {}, I.prototype.setState = function(h, U) {
    if (typeof h != "object" && typeof h != "function" && h != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, h, U, "setState");
  }, I.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function aA() {
  }
  aA.prototype = I.prototype;
  function uA(h, U, w) {
    this.props = h, this.context = U, this.refs = H, this.updater = w || Y;
  }
  var iA = uA.prototype = new aA();
  iA.constructor = uA, C(iA, I.prototype), iA.isPureReactComponent = !0;
  var sA = Array.isArray;
  function J() {
  }
  var B = { H: null, A: null, T: null, S: null }, gA = Object.prototype.hasOwnProperty;
  function xA(h, U, w) {
    var G = w.ref;
    return {
      $$typeof: u,
      type: h,
      key: U,
      ref: G !== void 0 ? G : null,
      props: w
    };
  }
  function zA(h, U) {
    return xA(h.type, U, h.props);
  }
  function oA(h) {
    return typeof h == "object" && h !== null && h.$$typeof === u;
  }
  function JA(h) {
    var U = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(w) {
      return U[w];
    });
  }
  var HA = /\/+/g;
  function TA(h, U) {
    return typeof h == "object" && h !== null && h.key != null ? JA("" + h.key) : U.toString(36);
  }
  function k(h) {
    switch (h.status) {
      case "fulfilled":
        return h.value;
      case "rejected":
        throw h.reason;
      default:
        switch (typeof h.status == "string" ? h.then(J, J) : (h.status = "pending", h.then(
          function(U) {
            h.status === "pending" && (h.status = "fulfilled", h.value = U);
          },
          function(U) {
            h.status === "pending" && (h.status = "rejected", h.reason = U);
          }
        )), h.status) {
          case "fulfilled":
            return h.value;
          case "rejected":
            throw h.reason;
        }
    }
    throw h;
  }
  function P(h, U, w, G, tA) {
    var Q = typeof h;
    (Q === "undefined" || Q === "boolean") && (h = null);
    var cA = !1;
    if (h === null) cA = !0;
    else
      switch (Q) {
        case "bigint":
        case "string":
        case "number":
          cA = !0;
          break;
        case "object":
          switch (h.$$typeof) {
            case u:
            case r:
              cA = !0;
              break;
            case O:
              return cA = h._init, P(
                cA(h._payload),
                U,
                w,
                G,
                tA
              );
          }
      }
    if (cA)
      return tA = tA(h), cA = G === "" ? "." + TA(h, 0) : G, sA(tA) ? (w = "", cA != null && (w = cA.replace(HA, "$&/") + "/"), P(tA, U, w, "", function(LA) {
        return LA;
      })) : tA != null && (oA(tA) && (tA = zA(
        tA,
        w + (tA.key == null || h && h.key === tA.key ? "" : ("" + tA.key).replace(
          HA,
          "$&/"
        ) + "/") + cA
      )), U.push(tA)), 1;
    cA = 0;
    var L = G === "" ? "." : G + ":";
    if (sA(h))
      for (var _ = 0; _ < h.length; _++)
        G = h[_], Q = L + TA(G, _), cA += P(
          G,
          U,
          w,
          Q,
          tA
        );
    else if (_ = q(h), typeof _ == "function")
      for (h = _.call(h), _ = 0; !(G = h.next()).done; )
        G = G.value, Q = L + TA(G, _++), cA += P(
          G,
          U,
          w,
          Q,
          tA
        );
    else if (Q === "object") {
      if (typeof h.then == "function")
        return P(
          k(h),
          U,
          w,
          G,
          tA
        );
      throw U = String(h), Error(
        "Objects are not valid as a React child (found: " + (U === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : U) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return cA;
  }
  function lA(h, U, w) {
    if (h == null) return h;
    var G = [], tA = 0;
    return P(h, G, "", "", function(Q) {
      return U.call(w, Q, tA++);
    }), G;
  }
  function dA(h) {
    if (h._status === -1) {
      var U = h._result, w = U();
      w.then(
        function(G) {
          (h._status === 0 || h._status === -1) && (h._status = 1, h._result = G, w.status === void 0 && (w.status = "fulfilled", w.value = G));
        },
        function(G) {
          (h._status === 0 || h._status === -1) && (h._status = 2, h._result = G, w.status === void 0 && (w.status = "rejected", w.reason = G));
        }
      ), h._status === -1 && (h._status = 0, h._result = w);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var F = typeof reportError == "function" ? reportError : function(h) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var U = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h),
        error: h
      });
      if (!window.dispatchEvent(U)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", h);
      return;
    }
    console.error(h);
  };
  function GA(h) {
    var U = B.T, w = {};
    w.types = U !== null ? U.types : null, B.T = w;
    try {
      var G = h(), tA = B.S;
      tA !== null && tA(w, G), typeof G == "object" && G !== null && typeof G.then == "function" && G.then(J, F);
    } catch (Q) {
      F(Q);
    } finally {
      U !== null && w.types !== null && (U.types = w.types), B.T = U;
    }
  }
  function WA(h) {
    var U = B.T;
    if (U !== null) {
      var w = U.types;
      w === null ? U.types = [h] : w.indexOf(h) === -1 && w.push(h);
    } else GA(WA.bind(null, h));
  }
  var rt = {
    map: lA,
    forEach: function(h, U, w) {
      lA(
        h,
        function() {
          U.apply(this, arguments);
        },
        w
      );
    },
    count: function(h) {
      var U = 0;
      return lA(h, function() {
        U++;
      }), U;
    },
    toArray: function(h) {
      return lA(h, function(U) {
        return U;
      }) || [];
    },
    only: function(h) {
      if (!oA(h))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return h;
    }
  };
  return pA.Activity = s, pA.Children = rt, pA.Component = I, pA.Fragment = c, pA.Profiler = d, pA.PureComponent = uA, pA.StrictMode = i, pA.Suspense = S, pA.ViewTransition = D, pA.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B, pA.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(h) {
      return B.H.useMemoCache(h);
    }
  }, pA.addTransitionType = WA, pA.cache = function(h) {
    return function() {
      return h.apply(null, arguments);
    };
  }, pA.cacheSignal = function() {
    return null;
  }, pA.cloneElement = function(h, U, w) {
    if (h == null)
      throw Error(
        "The argument must be a React element, but you passed " + h + "."
      );
    var G = C({}, h.props), tA = h.key;
    if (U != null)
      for (Q in U.key !== void 0 && (tA = "" + U.key), U)
        !gA.call(U, Q) || Q === "key" || Q === "__self" || Q === "__source" || Q === "ref" && U.ref === void 0 || (G[Q] = U[Q]);
    var Q = arguments.length - 2;
    if (Q === 1) G.children = w;
    else if (1 < Q) {
      for (var cA = Array(Q), L = 0; L < Q; L++)
        cA[L] = arguments[L + 2];
      G.children = cA;
    }
    return xA(h.type, tA, G);
  }, pA.createContext = function(h) {
    return h = {
      $$typeof: m,
      _currentValue: h,
      _currentValue2: h,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, h.Provider = h, h.Consumer = {
      $$typeof: p,
      _context: h
    }, h;
  }, pA.createElement = function(h, U, w) {
    var G, tA = {}, Q = null;
    if (U != null)
      for (G in U.key !== void 0 && (Q = "" + U.key), U)
        gA.call(U, G) && G !== "key" && G !== "__self" && G !== "__source" && (tA[G] = U[G]);
    var cA = arguments.length - 2;
    if (cA === 1) tA.children = w;
    else if (1 < cA) {
      for (var L = Array(cA), _ = 0; _ < cA; _++)
        L[_] = arguments[_ + 2];
      tA.children = L;
    }
    if (h && h.defaultProps)
      for (G in cA = h.defaultProps, cA)
        tA[G] === void 0 && (tA[G] = cA[G]);
    return xA(h, Q, tA);
  }, pA.createRef = function() {
    return { current: null };
  }, pA.forwardRef = function(h) {
    return { $$typeof: v, render: h };
  }, pA.isValidElement = oA, pA.lazy = function(h) {
    return {
      $$typeof: O,
      _payload: { _status: -1, _result: h },
      _init: dA
    };
  }, pA.memo = function(h, U) {
    return {
      $$typeof: M,
      type: h,
      compare: U === void 0 ? null : U
    };
  }, pA.startTransition = GA, pA.unstable_useCacheRefresh = function() {
    return B.H.useCacheRefresh();
  }, pA.use = function(h) {
    return B.H.use(h);
  }, pA.useActionState = function(h, U, w) {
    return B.H.useActionState(h, U, w);
  }, pA.useCallback = function(h, U) {
    return B.H.useCallback(h, U);
  }, pA.useContext = function(h) {
    return B.H.useContext(h);
  }, pA.useDebugValue = function() {
  }, pA.useDeferredValue = function(h, U) {
    return B.H.useDeferredValue(h, U);
  }, pA.useEffect = function(h, U) {
    return B.H.useEffect(h, U);
  }, pA.useEffectEvent = function(h) {
    return B.H.useEffectEvent(h);
  }, pA.useId = function() {
    return B.H.useId();
  }, pA.useImperativeHandle = function(h, U, w) {
    return B.H.useImperativeHandle(h, U, w);
  }, pA.useInsertionEffect = function(h, U) {
    return B.H.useInsertionEffect(h, U);
  }, pA.useLayoutEffect = function(h, U) {
    return B.H.useLayoutEffect(h, U);
  }, pA.useMemo = function(h, U) {
    return B.H.useMemo(h, U);
  }, pA.useOptimistic = function(h, U) {
    return B.H.useOptimistic(h, U);
  }, pA.useReducer = function(h, U, w) {
    return B.H.useReducer(h, U, w);
  }, pA.useRef = function(h) {
    return B.H.useRef(h);
  }, pA.useState = function(h) {
    return B.H.useState(h);
  }, pA.useSyncExternalStore = function(h, U, w) {
    return B.H.useSyncExternalStore(
      h,
      U,
      w
    );
  }, pA.useTransition = function() {
    return B.H.useTransition();
  }, pA.version = "19.3.0", pA;
}
var up;
function bs() {
  return up || (up = 1, Pc.exports = Q1()), Pc.exports;
}
var _c = { exports: {} }, Nt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ip;
function J1() {
  if (ip) return Nt;
  ip = 1;
  var u = bs();
  function r(O) {
    var s = "https://react.dev/errors/" + O;
    if (1 < arguments.length) {
      s += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var D = 2; D < arguments.length; D++)
        s += "&args[]=" + encodeURIComponent(arguments[D]);
    }
    return "Minified React error #" + O + "; visit " + s + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c() {
  }
  var i = {
    d: {
      f: c,
      r: function() {
        throw Error(r(522));
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
  }, d = Symbol.for("react.portal"), p = Symbol.for("react.recoverable"), m = Symbol.for("react.optimistic_key");
  function v(O, s, D) {
    var Z = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: Z == null ? null : Z === m ? m : "" + Z,
      children: O,
      containerInfo: s,
      implementation: D
    };
  }
  var S = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function M(O, s) {
    if (O === "font") return "";
    if (typeof s == "string")
      return s === "use-credentials" ? s : "";
  }
  return Nt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, Nt.browser = function(O) {
    return { $$typeof: p, _reason: O };
  }, Nt.createPortal = function(O, s) {
    var D = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!s || s.nodeType !== 1 && s.nodeType !== 9 && s.nodeType !== 11)
      throw Error(r(299));
    return v(O, s, null, D);
  }, Nt.flushSync = function(O) {
    var s = S.T, D = i.p;
    try {
      if (S.T = null, i.p = 2, O) return O();
    } finally {
      S.T = s, i.p = D, i.d.f();
    }
  }, Nt.preconnect = function(O, s) {
    typeof O == "string" && (s ? (s = s.crossOrigin, s = typeof s == "string" ? s === "use-credentials" ? s : "" : void 0) : s = null, i.d.C(O, s));
  }, Nt.prefetchDNS = function(O) {
    typeof O == "string" && i.d.D(O);
  }, Nt.preinit = function(O, s) {
    if (typeof O == "string" && s && typeof s.as == "string") {
      var D = s.as, Z = M(D, s.crossOrigin), q = typeof s.integrity == "string" ? s.integrity : void 0, Y = typeof s.fetchPriority == "string" ? s.fetchPriority : void 0;
      D === "style" ? i.d.S(
        O,
        typeof s.precedence == "string" ? s.precedence : void 0,
        {
          crossOrigin: Z,
          integrity: q,
          fetchPriority: Y
        }
      ) : D === "script" && i.d.X(O, {
        crossOrigin: Z,
        integrity: q,
        fetchPriority: Y,
        nonce: typeof s.nonce == "string" ? s.nonce : void 0
      });
    }
  }, Nt.preinitModule = function(O, s) {
    if (typeof O == "string")
      if (typeof s == "object" && s !== null) {
        if (s.as == null || s.as === "script") {
          var D = M(
            s.as,
            s.crossOrigin
          );
          i.d.M(O, {
            crossOrigin: D,
            integrity: typeof s.integrity == "string" ? s.integrity : void 0,
            nonce: typeof s.nonce == "string" ? s.nonce : void 0,
            fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0
          });
        }
      } else s == null && i.d.M(O);
  }, Nt.preload = function(O, s) {
    if (typeof O == "string" && typeof s == "object" && s !== null && typeof s.as == "string") {
      var D = s.as, Z = M(D, s.crossOrigin);
      i.d.L(O, D, {
        crossOrigin: Z,
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
  }, Nt.preloadModule = function(O, s) {
    if (typeof O == "string")
      if (s) {
        var D = M(s.as, s.crossOrigin);
        i.d.m(O, {
          as: typeof s.as == "string" && s.as !== "script" ? s.as : void 0,
          crossOrigin: D,
          integrity: typeof s.integrity == "string" ? s.integrity : void 0,
          nonce: typeof s.nonce == "string" ? s.nonce : void 0,
          fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0
        });
      } else i.d.m(O);
  }, Nt.requestFormReset = function(O) {
    i.d.r(O);
  }, Nt.unstable_batchedUpdates = function(O, s) {
    return O(s);
  }, Nt.useFormState = function(O, s, D) {
    return S.H.useFormState(O, s, D);
  }, Nt.useFormStatus = function() {
    return S.H.useHostTransitionStatus();
  }, Nt.version = "19.3.0", Nt;
}
var rp;
function Cp() {
  if (rp) return _c.exports;
  rp = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (r) {
        console.error(r);
      }
  }
  return u(), _c.exports = J1(), _c.exports;
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
var op;
function W1() {
  if (op) return pu;
  op = 1;
  var u = Z1(), r = bs(), c = Cp();
  function i(A) {
    var t = "https://react.dev/errors/" + A;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + A + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(A) {
    return !(!A || A.nodeType !== 1 && A.nodeType !== 9 && A.nodeType !== 11);
  }
  function p(A) {
    for (var t = A, e = t; e && !e.alternate; )
      t = e, (t.flags & 4098) !== 0 && (A = t.return), e = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? A : null;
  }
  function m(A) {
    if (A.tag === 13) {
      var t = A.memoizedState;
      if (t === null && (A = A.alternate, A !== null && (t = A.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function v(A) {
    if (A.tag === 31) {
      var t = A.memoizedState;
      if (t === null && (A = A.alternate, A !== null && (t = A.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function S(A) {
    if (p(A) !== A)
      throw Error(i(188));
  }
  function M(A) {
    var t = A.alternate;
    if (!t) {
      if (t = p(A), t === null) throw Error(i(188));
      return t !== A ? null : A;
    }
    for (var e = A, a = t; ; ) {
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
          if (l === e) return S(n), A;
          if (l === a) return S(n), t;
          l = l.sibling;
        }
        throw Error(i(188));
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
          if (!o) throw Error(i(189));
        }
      }
      if (e.alternate !== a) throw Error(i(190));
    }
    if (e.tag !== 3) throw Error(i(188));
    return e.stateNode.current === e ? A : t;
  }
  function O(A) {
    var t = A.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return A;
    for (A = A.child; A !== null; ) {
      if (t = O(A), t !== null) return t;
      A = A.sibling;
    }
    return null;
  }
  function s(A, t, e, a, n, l) {
    for (; A !== null; ) {
      if ((A.tag === 5 || A.tag === 27 || A.tag === 6) && e(A, a, n, l) || (A.tag !== 22 || A.memoizedState === null) && (t || A.tag !== 5 && A.tag !== 27) && s(
        A.child,
        t,
        e,
        a,
        n,
        l
      ))
        return !0;
      A = A.sibling;
    }
    return !1;
  }
  function D(A) {
    for (A = A.return; A !== null; ) {
      if (A.tag === 3 || A.tag === 5 || A.tag === 27) return A;
      A = A.return;
    }
    return null;
  }
  function Z(A) {
    var t = !1;
    for (A = A.return; A !== null && (A.tag === 4 && (t = !0), !(A.tag === 3 || A.tag === 5 || A.tag === 27)); )
      A = A.return;
    return t;
  }
  function q(A) {
    var t = [null, null], e = D(A);
    return e === null || Y(
      t,
      A,
      e.child,
      { foundSelf: !1 }
    ), t;
  }
  function Y(A, t, e, a) {
    for (; e !== null; ) {
      if (e === t) a.foundSelf = !0;
      else if (e.tag === 5 || e.tag === 27 || e.tag === 6) {
        if (a.foundSelf) return A[1] = e, !0;
        A[0] = e;
      } else if ((e.tag !== 22 || e.memoizedState === null) && Y(
        A,
        t,
        e.child,
        a
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function C(A) {
    switch (A.tag) {
      case 5:
      case 27:
      case 6:
        return A.stateNode;
      case 3:
        return A.stateNode.containerInfo;
      default:
        throw Error(i(559));
    }
  }
  var H = null, I = null;
  function aA(A, t, e) {
    return A === e ? !0 : A === t ? (H = A, !0) : !1;
  }
  function uA(A, t, e) {
    return A === e ? (I = A, !1) : A === t ? (I !== null && (H = A), !0) : !1;
  }
  function iA(A) {
    if (A === null) return null;
    do
      A = A === null ? null : A.return;
    while (A && A.tag !== 5 && A.tag !== 27 && A.tag !== 3);
    return A || null;
  }
  function sA(A, t, e) {
    for (var a = 0, n = A; n; n = e(n)) a++;
    n = 0;
    for (var l = t; l; l = e(l)) n++;
    for (; 0 < a - n; ) A = e(A), a--;
    for (; 0 < n - a; ) t = e(t), n--;
    for (; a--; ) {
      if (A === t || t !== null && A === t.alternate)
        return A;
      A = e(A), t = e(t);
    }
    return null;
  }
  var J = Object.assign, B = Symbol.for("react.element"), gA = Symbol.for("react.transitional.element"), xA = Symbol.for("react.portal"), zA = Symbol.for("react.fragment"), oA = Symbol.for("react.strict_mode"), JA = Symbol.for("react.profiler"), HA = Symbol.for("react.consumer"), TA = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), lA = Symbol.for("react.suspense_list"), dA = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), GA = Symbol.for("react.activity"), WA = Symbol.for("react.legacy_hidden"), rt = Symbol.for("react.memo_cache_sentinel"), h = Symbol.for("react.view_transition"), U = Symbol.for("react.recoverable"), w = Symbol.iterator;
  function G(A) {
    return A === null || typeof A != "object" ? null : (A = w && A[w] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var tA = Symbol.for("react.client.reference");
  function Q(A) {
    if (A == null) return null;
    if (typeof A == "function")
      return A.$$typeof === tA ? null : A.displayName || A.name || null;
    if (typeof A == "string") return A;
    switch (A) {
      case zA:
        return "Fragment";
      case JA:
        return "Profiler";
      case oA:
        return "StrictMode";
      case P:
        return "Suspense";
      case lA:
        return "SuspenseList";
      case GA:
        return "Activity";
      case h:
        return "ViewTransition";
    }
    if (typeof A == "object")
      switch (A.$$typeof) {
        case xA:
          return "Portal";
        case TA:
          return A.displayName || "Context";
        case HA:
          return (A._context.displayName || "Context") + ".Consumer";
        case k:
          var t = A.render;
          return A = A.displayName, A || (A = t.displayName || t.name || "", A = A !== "" ? "ForwardRef(" + A + ")" : "ForwardRef"), A;
        case dA:
          return t = A.displayName || null, t !== null ? t : Q(A.type) || "Memo";
        case F:
          t = A._payload, A = A._init;
          try {
            return Q(A(t));
          } catch {
          }
      }
    return null;
  }
  var cA = Array.isArray, L = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, _ = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, LA = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, BA = [], la = -1;
  function Ht(A) {
    return { current: A };
  }
  function XA(A) {
    0 > la || (A.current = BA[la], BA[la] = null, la--);
  }
  function VA(A, t) {
    la++, BA[la] = A.current, A.current = t;
  }
  var tt = Ht(null), ka = Ht(null), be = Ht(null), et = Ht(null);
  function Ba(A, t) {
    switch (VA(be, t), VA(ka, A), VA(tt, null), t.nodeType) {
      case 9:
      case 11:
        A = (A = t.documentElement) && (A = A.namespaceURI) ? c0(A) : 0;
        break;
      default:
        if (A = t.tagName, t = t.namespaceURI)
          t = c0(t), A = s0(t, A);
        else
          switch (A) {
            case "svg":
              A = 1;
              break;
            case "math":
              A = 2;
              break;
            default:
              A = 0;
          }
    }
    XA(tt), VA(tt, A);
  }
  function Gt() {
    XA(tt), XA(ka), XA(be);
  }
  function pl(A) {
    var t = A.memoizedState;
    t !== null && (al._currentValue = t.memoizedState, VA(et, A)), t = tt.current;
    var e = s0(t, A.type);
    t !== e && (VA(ka, A), VA(tt, e));
  }
  function mn(A) {
    ka.current === A && (XA(tt), XA(ka)), et.current === A && (XA(et), al._currentValue = LA);
  }
  var ua, xu;
  function se(A) {
    if (ua === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        ua = t && t[1] || "", xu = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ua + A + xu;
  }
  var Ya = !1;
  function Se(A, t) {
    if (!A || Ya) return "";
    Ya = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
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
                } catch (X) {
                  var N = X;
                }
                Reflect.construct(A, [], K);
              } else {
                try {
                  K.call();
                } catch (X) {
                  N = X;
                }
                K = !1;
                try {
                  var R = Object.getOwnPropertyDescriptor(
                    A.prototype,
                    "props"
                  );
                  Object.defineProperty(A.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), K = !0, new A();
                } finally {
                  K && (R !== void 0 ? Object.defineProperty(A.prototype, "props", R) : delete A.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (X) {
                N = X;
              }
              (K = A()) && typeof K.catch == "function" && K.catch(function() {
              });
            }
          } catch (X) {
            if (X && N && typeof X.stack == "string")
              return [X.stack, N.stack];
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
                  var E = `
` + g[a].replace(" at new ", " at ");
                  return A.displayName && E.includes("<anonymous>") && (E = E.replace("<anonymous>", A.displayName)), E;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ya = !1, Error.prepareStackTrace = e;
    }
    return (e = A ? A.displayName || A.name : "") ? se(e) : "";
  }
  function Tu(A, t) {
    switch (A.tag) {
      case 26:
      case 27:
      case 5:
        return se(A.type);
      case 16:
        return se("Lazy");
      case 13:
        return A.child !== t && t !== null ? se("Suspense Fallback") : se("Suspense");
      case 19:
        return se("SuspenseList");
      case 0:
      case 15:
        return Se(A.type, !1);
      case 11:
        return Se(A.type.render, !1);
      case 1:
        return Se(A.type, !0);
      case 31:
        return se("Activity");
      case 30:
        return se("ViewTransition");
      default:
        return "";
    }
  }
  function ke(A) {
    try {
      var t = "", e = null;
      do
        t += Tu(A, e), e = A, A = A.return;
      while (A);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var gl = Object.prototype.hasOwnProperty, yl = u.unstable_scheduleCallback, pn = u.unstable_cancelCallback, Uu = u.unstable_shouldYield, Pt = u.unstable_requestPaint, Ut = u.unstable_now, hl = u.unstable_getCurrentPriorityLevel, fe = u.unstable_ImmediatePriority, vl = u.unstable_UserBlockingPriority, gn = u.unstable_NormalPriority, Mu = u.unstable_LowPriority, bl = u.unstable_IdlePriority, mA = u.log, at = u.unstable_setDisableYieldValue, PA = null, qA = null;
  function Et(A) {
    if (typeof mA == "function" && at(A), qA && typeof qA.setStrictMode == "function")
      try {
        qA.setStrictMode(PA, A);
      } catch {
      }
  }
  var RA = Math.clz32 ? Math.clz32 : Sl, Vt = Math.log, _t = Math.LN2;
  function Sl(A) {
    return A >>>= 0, A === 0 ? 32 : 31 - (Vt(A) / _t | 0) | 0;
  }
  var Mt = 256, ia = 262144, zu = 4194304;
  function Ha(A) {
    var t = A & 42;
    if (t !== 0) return t;
    switch (A & -A) {
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
        return A & -A;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return A & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return A & 62914560;
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
        return A;
    }
  }
  function ju(A, t, e) {
    var a = A.pendingLanes;
    if (a === 0) return 0;
    var n = 0, l = A.suspendedLanes, o = A.pingedLanes;
    A = A.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~l, a !== 0 ? n = Ha(a) : (o &= f, o !== 0 ? n = Ha(o) : e || (e = f & ~A, e !== 0 && (n = Ha(e))))) : (f = a & ~l, f !== 0 ? n = Ha(f) : o !== 0 ? n = Ha(o) : e || (e = a & ~A, e !== 0 && (n = Ha(e)))), n === 0 ? 0 : t !== 0 && t !== n && (t & l) === 0 && (l = n & -n, e = t & -t, l >= e || l === 32 && (e & 4194048) !== 0) ? t : n;
  }
  function Nl(A, t) {
    return (A.pendingLanes & ~(A.suspendedLanes & ~A.pingedLanes) & t) === 0;
  }
  function ws(A, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var e = A.entangledLanes;
    if (e !== 0)
      for (A = A.entanglements, e &= t; 0 < e; ) {
        var a = 31 - RA(e), n = 1 << a;
        t |= A[a], e &= ~n;
      }
    return t;
  }
  function Ay(A, t) {
    switch (A) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
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
        return t + 5e3;
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
  function Cs() {
    var A = zu;
    return zu <<= 1, (zu & 62914560) === 0 && (zu = 4194304), A;
  }
  function vr(A) {
    for (var t = [], e = 0; 31 > e; e++) t.push(A);
    return t;
  }
  function xl(A, t) {
    A.pendingLanes |= t, t !== 268435456 && (A.suspendedLanes = 0, A.pingedLanes = 0, A.warmLanes = 0);
  }
  function ty(A, t, e, a, n, l) {
    var o = A.pendingLanes;
    A.pendingLanes = e, A.suspendedLanes = 0, A.pingedLanes = 0, A.warmLanes = 0, A.expiredLanes &= e, A.entangledLanes &= e, A.errorRecoveryDisabledLanes &= e, A.shellSuspendCounter = 0;
    var f = A.entanglements, g = A.expirationTimes, T = A.hiddenUpdates;
    for (e = o & ~e; 0 < e; ) {
      var E = 31 - RA(e), K = 1 << E;
      f[E] = 0, g[E] = -1;
      var N = T[E];
      if (N !== null)
        for (T[E] = null, E = 0; E < N.length; E++) {
          var R = N[E];
          R !== null && (R.lane &= -536870913);
        }
      e &= ~K;
    }
    a !== 0 && qs(A, a, 0), l !== 0 && n === 0 && A.tag !== 0 && (A.suspendedLanes |= l & ~(o & ~t));
  }
  function qs(A, t, e) {
    A.pendingLanes |= t, A.suspendedLanes &= ~t;
    var a = 31 - RA(t);
    A.entangledLanes |= t, A.entanglements[a] = A.entanglements[a] | 1073741824 | e & 261930;
  }
  function ks(A, t) {
    var e = A.entangledLanes |= t;
    for (A = A.entanglements; e; ) {
      var a = 31 - RA(e), n = 1 << a;
      n & t | A[a] & t && (A[a] |= t), e &= ~n;
    }
  }
  function Bs(A, t) {
    var e = t & -t;
    return e = (e & 42) !== 0 ? 1 : br(e), (e & (A.suspendedLanes | t)) !== 0 ? 0 : e;
  }
  function br(A) {
    switch (A) {
      case 2:
        A = 1;
        break;
      case 8:
        A = 4;
        break;
      case 32:
        A = 16;
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
        A = 128;
        break;
      case 268435456:
        A = 134217728;
        break;
      default:
        A = 0;
    }
    return A;
  }
  function Sr(A) {
    return A &= -A, 2 < A ? 8 < A ? (A & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ys() {
    var A = _.p;
    return A !== 0 ? A : (A = window.event, A === void 0 ? 32 : L0(A.type));
  }
  function Hs(A, t) {
    var e = _.p;
    try {
      return _.p = A, t();
    } finally {
      _.p = e;
    }
  }
  var Be = Math.random().toString(36).slice(2), gt = "__reactFiber$" + Be, Kt = "__reactProps$" + Be, yn = "__reactContainer$" + Be, Gs = "__reactEvents$" + Be, ey = "__reactListeners$" + Be, ay = "__reactHandles$" + Be, Fs = "__reactResources$" + Be, Tl = "__reactMarker$" + Be, Du = "__reactLoad$" + Be;
  function Ru(A) {
    delete A[gt], delete A[Kt], delete A[ey], delete A[ay];
  }
  function Ga(A) {
    var t;
    if (t = A[gt]) return t;
    for (var e = A.parentNode; e; ) {
      if (t = e[yn] || e[gt]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (A = j0(A); A !== null; ) {
            if (e = A[gt]) return e;
            A = j0(A);
          }
        return t;
      }
      A = e, e = A.parentNode;
    }
    return null;
  }
  function hn(A) {
    if (A = A[gt] || A[yn]) {
      var t = A.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return A;
    }
    return null;
  }
  function Ul(A) {
    var t = A.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return A.stateNode;
    throw Error(i(33));
  }
  function vn(A) {
    var t = A[Fs];
    return t || (t = A[Fs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function st(A) {
    A[Tl] = !0;
  }
  function Zs(A) {
    A[Du] = void 0;
  }
  var Qs = /* @__PURE__ */ new Set(), Js = {};
  function Fa(A, t) {
    bn(A, t), bn(A + "Capture", t);
  }
  function bn(A, t) {
    for (Js[A] = t, A = 0; A < t.length; A++)
      Qs.add(t[A]);
  }
  var ny = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ws = {}, Ls = {};
  function ly(A) {
    return gl.call(Ls, A) ? !0 : gl.call(Ws, A) ? !1 : ny.test(A) ? Ls[A] = !0 : (Ws[A] = !0, !1);
  }
  var DA = !1;
  function Xs() {
    var A = DA;
    return DA = !1, A;
  }
  function Ou(A, t, e) {
    if (ly(t))
      if (e === null) A.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            A.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              A.removeAttribute(t);
              return;
            }
        }
        A.setAttribute(t, e);
      }
  }
  function Eu(A, t, e) {
    if (e === null) A.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          A.removeAttribute(t);
          return;
      }
      A.setAttribute(t, e);
    }
  }
  function Ye(A, t, e, a) {
    if (a === null) A.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          A.removeAttribute(e);
          return;
      }
      A.setAttributeNS(t, e, a);
    }
  }
  function Ft(A) {
    switch (typeof A) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return A;
      case "object":
        return A;
      default:
        return "";
    }
  }
  function Is(A) {
    var t = A.type;
    return (A = A.nodeName) && A.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function uy(A, t, e) {
    var a = Object.getOwnPropertyDescriptor(
      A.constructor.prototype,
      t
    );
    if (!A.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, l = a.set;
      return Object.defineProperty(A, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(o) {
          e = "" + o, l.call(this, o);
        }
      }), Object.defineProperty(A, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return e;
        },
        setValue: function(o) {
          e = "" + o;
        },
        stopTracking: function() {
          A._valueTracker = null, delete A[t];
        }
      };
    }
  }
  function Nr(A) {
    if (!A._valueTracker) {
      var t = Is(A) ? "checked" : "value";
      A._valueTracker = uy(
        A,
        t,
        "" + A[t]
      );
    }
  }
  function Ps(A) {
    if (!A) return !1;
    var t = A._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return A && (a = Is(A) ? A.checked ? "true" : "false" : A.value), A = a, A !== e ? (t.setValue(A), !0) : !1;
  }
  var iy = /[\n"\\]/g;
  function $t(A) {
    return A.replace(
      iy,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function xr(A, t, e, a, n, l, o, f) {
    A.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? A.type = o : A.removeAttribute("type"), t != null ? o === "number" ? (t === 0 && A.value === "" || A.value != t) && (A.value = "" + Ft(t)) : A.value !== "" + Ft(t) && (A.value = "" + Ft(t)) : o !== "submit" && o !== "reset" || A.removeAttribute("value"), t != null ? o === "number" && A.value == t ? Tr(A, Ft(A.value)) : Tr(A, Ft(t)) : e != null ? Tr(A, Ft(e)) : a != null && A.removeAttribute("value"), n == null && l != null && (A.defaultChecked = !!l), n != null && (A.checked = n && typeof n != "function" && typeof n != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? A.name = "" + Ft(f) : A.removeAttribute("name");
  }
  function _s(A, t, e, a, n, l, o, f) {
    if (l != null && typeof l != "function" && typeof l != "symbol" && typeof l != "boolean" && (A.type = l), t != null || e != null) {
      if (!(l !== "submit" && l !== "reset" || t != null)) {
        Nr(A);
        return;
      }
      e = e != null ? "" + Ft(e) : "", t = t != null ? "" + Ft(t) : e, f || t === A.value || (A.value = t), A.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, A.checked = f ? A.checked : !!a, A.defaultChecked = !!a, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (A.name = o), Nr(A);
  }
  function Tr(A, t) {
    A.defaultValue !== "" + t && (A.defaultValue = "" + t);
  }
  function Sn(A, t, e, a) {
    if (A = A.options, t) {
      t = {};
      for (var n = 0; n < e.length; n++)
        t["$" + e[n]] = !0;
      for (e = 0; e < A.length; e++)
        n = t.hasOwnProperty("$" + A[e].value), A[e].selected !== n && (A[e].selected = n), n && a && (A[e].defaultSelected = !0);
    } else {
      for (e = "" + Ft(e), t = null, n = 0; n < A.length; n++) {
        if (A[n].value === e) {
          A[n].selected = !0, a && (A[n].defaultSelected = !0);
          return;
        }
        t !== null || A[n].disabled || (t = A[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function $s(A, t, e) {
    if (t != null && (t = "" + Ft(t), t !== A.value && (A.value = t), e == null)) {
      A.defaultValue !== t && (A.defaultValue = t);
      return;
    }
    A.defaultValue = e != null ? "" + Ft(e) : "";
  }
  function Af(A, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(i(92));
        if (cA(a)) {
          if (1 < a.length) throw Error(i(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = Ft(t), A.defaultValue = e, a = A.textContent, a === e && a !== "" && a !== null && (A.value = a), Nr(A);
  }
  function Nn(A, t) {
    if (t) {
      var e = A.firstChild;
      if (e && e === A.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    A.textContent = t;
  }
  var ry = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function tf(A, t, e) {
    var a = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? A.setProperty(t, "") : t === "float" ? A.cssFloat = "" : A[t] = "" : a ? A.setProperty(t, e) : typeof e != "number" || e === 0 || ry.has(t) ? t === "float" ? A.cssFloat = e : A[t] = ("" + e).trim() : A[t] = e + "px";
  }
  function ef(A, t, e) {
    if (t != null && typeof t != "object")
      throw Error(i(62));
    if (A = A.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? A.setProperty(a, "") : a === "float" ? A.cssFloat = "" : A[a] = "", DA = !0);
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && e[n] !== a && (tf(A, n, a), DA = !0);
    } else
      for (var l in t)
        t.hasOwnProperty(l) && tf(A, l, t[l]);
  }
  function Ur(A) {
    if (A.indexOf("-") === -1) return !1;
    switch (A) {
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
  var oy = /* @__PURE__ */ new Map([
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
  ]), cy = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Vu(A) {
    return cy.test("" + A) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : A;
  }
  function Ne() {
  }
  var Mr = null;
  function zr(A) {
    return A = A.target || A.srcElement || window, A.correspondingUseElement && (A = A.correspondingUseElement), A.nodeType === 3 ? A.parentNode : A;
  }
  var xn = null, Tn = null;
  function af(A) {
    var t = hn(A);
    if (t && (A = t.stateNode)) {
      var e = A[Kt] || null;
      A: switch (A = t.stateNode, t.type) {
        case "input":
          if (xr(
            A,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), t = e.name, e.type === "radio" && t != null) {
            for (e = A; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + $t(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== A && a.form === A.form) {
                var n = a[Kt] || null;
                if (!n) throw Error(i(90));
                xr(
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
            for (t = 0; t < e.length; t++)
              a = e[t], a.form === A.form && Ps(a);
          }
          break A;
        case "textarea":
          $s(A, e.value, e.defaultValue);
          break A;
        case "select":
          t = e.value, t != null && Sn(A, !!e.multiple, t, !1);
      }
    }
  }
  var jr = !1;
  function nf(A, t, e) {
    if (jr) return A(t, e);
    jr = !0;
    try {
      var a = A(t);
      return a;
    } finally {
      if (jr = !1, (xn !== null || Tn !== null) && (Vi(), xn && (t = xn, A = Tn, Tn = xn = null, af(t), A)))
        for (t = 0; t < A.length; t++) af(A[t]);
    }
  }
  function Ml(A, t) {
    var e = A.stateNode;
    if (e === null) return null;
    var a = e[Kt] || null;
    if (a === null) return null;
    e = a[t];
    A: switch (t) {
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
        (a = !a.disabled) || (A = A.type, a = !(A === "button" || A === "input" || A === "select" || A === "textarea")), A = !a;
        break A;
      default:
        A = !1;
    }
    if (A) return null;
    if (e && typeof e != "function")
      throw Error(
        i(231, t, typeof e)
      );
    return e;
  }
  var He = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Dr = !1;
  if (He)
    try {
      var zl = {};
      Object.defineProperty(zl, "passive", {
        get: function() {
          Dr = !0;
        }
      }), window.addEventListener("test", zl, zl), window.removeEventListener("test", zl, zl);
    } catch {
      Dr = !1;
    }
  var ra = null, Rr = null, Ku = null;
  function lf() {
    if (Ku) return Ku;
    var A, t = Rr, e = t.length, a, n = "value" in ra ? ra.value : ra.textContent, l = n.length;
    for (A = 0; A < e && t[A] === n[A]; A++) ;
    var o = e - A;
    for (a = 1; a <= o && t[e - a] === n[l - a]; a++) ;
    return Ku = n.slice(A, 1 < a ? 1 - a : void 0);
  }
  function wu(A) {
    var t = A.keyCode;
    return "charCode" in A ? (A = A.charCode, A === 0 && t === 13 && (A = 13)) : A = t, A === 10 && (A = 13), 32 <= A || A === 13 ? A : 0;
  }
  function Cu() {
    return !0;
  }
  function uf() {
    return !1;
  }
  function zt(A) {
    function t(e, a, n, l, o) {
      this._reactName = e, this._targetInst = n, this.type = a, this.nativeEvent = l, this.target = o, this.currentTarget = null;
      for (var f in A)
        A.hasOwnProperty(f) && (e = A[f], this[f] = e ? e(l) : l[f]);
      return this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? Cu : uf, this.isPropagationStopped = uf, this;
    }
    return J(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Cu);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Cu);
      },
      persist: function() {
      },
      isPersistent: Cu
    }), t;
  }
  var oa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(A) {
      return A.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qu = zt(oa), jl = J({}, oa, { view: 0, detail: 0 }), sy = zt(jl), Or, Er, Dl, ku = J({}, jl, {
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
    getModifierState: Kr,
    button: 0,
    buttons: 0,
    relatedTarget: function(A) {
      return A.relatedTarget === void 0 ? A.fromElement === A.srcElement ? A.toElement : A.fromElement : A.relatedTarget;
    },
    movementX: function(A) {
      return "movementX" in A ? A.movementX : (A !== Dl && (Dl && A.type === "mousemove" ? (Or = A.screenX - Dl.screenX, Er = A.screenY - Dl.screenY) : Er = Or = 0, Dl = A), Or);
    },
    movementY: function(A) {
      return "movementY" in A ? A.movementY : Er;
    }
  }), rf = zt(ku), fy = J({}, ku, { dataTransfer: 0 }), dy = zt(fy), my = J({}, jl, { relatedTarget: 0 }), Vr = zt(my), py = J({}, oa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), gy = zt(py), yy = J({}, oa, {
    clipboardData: function(A) {
      return "clipboardData" in A ? A.clipboardData : window.clipboardData;
    }
  }), hy = zt(yy), vy = J({}, oa, { data: 0 }), of = zt(vy), by = {
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
  }, Sy = {
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
  }, Ny = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function xy(A) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(A) : (A = Ny[A]) ? !!t[A] : !1;
  }
  function Kr() {
    return xy;
  }
  var Ty = J({}, jl, {
    key: function(A) {
      if (A.key) {
        var t = by[A.key] || A.key;
        if (t !== "Unidentified") return t;
      }
      return A.type === "keypress" ? (A = wu(A), A === 13 ? "Enter" : String.fromCharCode(A)) : A.type === "keydown" || A.type === "keyup" ? Sy[A.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Kr,
    charCode: function(A) {
      return A.type === "keypress" ? wu(A) : 0;
    },
    keyCode: function(A) {
      return A.type === "keydown" || A.type === "keyup" ? A.keyCode : 0;
    },
    which: function(A) {
      return A.type === "keypress" ? wu(A) : A.type === "keydown" || A.type === "keyup" ? A.keyCode : 0;
    }
  }), Uy = zt(Ty), My = J({}, ku, {
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
  }), cf = zt(My), zy = J({}, oa, { submitter: 0 }), jy = zt(zy), Dy = J({}, jl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Kr
  }), Ry = zt(Dy), Oy = J({}, oa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ey = zt(Oy), Vy = J({}, ku, {
    deltaX: function(A) {
      return "deltaX" in A ? A.deltaX : "wheelDeltaX" in A ? -A.wheelDeltaX : 0;
    },
    deltaY: function(A) {
      return "deltaY" in A ? A.deltaY : "wheelDeltaY" in A ? -A.wheelDeltaY : "wheelDelta" in A ? -A.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ky = zt(Vy), wy = J({}, oa, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Cy = zt(wy), qy = [9, 13, 27, 32], wr = He && "CompositionEvent" in window, Rl = null;
  He && "documentMode" in document && (Rl = document.documentMode);
  var ky = He && "TextEvent" in window && !Rl, sf = He && (!wr || Rl && 8 < Rl && 11 >= Rl), ff = " ", df = !1;
  function mf(A, t) {
    switch (A) {
      case "keyup":
        return qy.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function pf(A) {
    return A = A.detail, typeof A == "object" && "data" in A ? A.data : null;
  }
  var Un = !1;
  function By(A, t) {
    switch (A) {
      case "compositionend":
        return pf(t);
      case "keypress":
        return t.which !== 32 ? null : (df = !0, ff);
      case "textInput":
        return A = t.data, A === ff && df ? null : A;
      default:
        return null;
    }
  }
  function Yy(A, t) {
    if (Un)
      return A === "compositionend" || !wr && mf(A, t) ? (A = lf(), Ku = Rr = ra = null, Un = !1, A) : null;
    switch (A) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return sf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Hy = {
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
  function gf(A) {
    var t = A && A.nodeName && A.nodeName.toLowerCase();
    return t === "input" ? !!Hy[A.type] : t === "textarea";
  }
  function yf(A, t, e, a) {
    xn ? Tn ? Tn.push(a) : Tn = [a] : xn = a, t = Bi(t, "onChange"), 0 < t.length && (e = new qu(
      "onChange",
      "change",
      null,
      e,
      a
    ), A.push({ event: e, listeners: t }));
  }
  var Ol = null, El = null;
  function Gy(A) {
    n0(A, 0);
  }
  function Bu(A) {
    var t = Ul(A);
    if (Ps(t)) return A;
  }
  function hf(A, t) {
    if (A === "change") return t;
  }
  var vf = !1;
  if (He) {
    var Cr;
    if (He) {
      var qr = "oninput" in document;
      if (!qr) {
        var bf = document.createElement("div");
        bf.setAttribute("oninput", "return;"), qr = typeof bf.oninput == "function";
      }
      Cr = qr;
    } else Cr = !1;
    vf = Cr && (!document.documentMode || 9 < document.documentMode);
  }
  function Sf() {
    Ol && (Ol.detachEvent("onpropertychange", Nf), El = Ol = null);
  }
  function Nf(A) {
    if (A.propertyName === "value" && Bu(El)) {
      var t = [];
      yf(
        t,
        El,
        A,
        zr(A)
      ), nf(Gy, t);
    }
  }
  function Fy(A, t, e) {
    A === "focusin" ? (Sf(), Ol = t, El = e, Ol.attachEvent("onpropertychange", Nf)) : A === "focusout" && Sf();
  }
  function Zy(A) {
    if (A === "selectionchange" || A === "keyup" || A === "keydown")
      return Bu(El);
  }
  function Qy(A, t) {
    if (A === "click") return Bu(t);
  }
  function Jy(A, t) {
    if (A === "input" || A === "change")
      return Bu(t);
  }
  function Wy(A, t) {
    return A === t && (A !== 0 || 1 / A === 1 / t) || A !== A && t !== t;
  }
  var Zt = typeof Object.is == "function" ? Object.is : Wy;
  function Vl(A, t) {
    if (Zt(A, t)) return !0;
    if (typeof A != "object" || A === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(A), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var n = e[a];
      if (!gl.call(t, n) || !Zt(A[n], t[n]))
        return !1;
    }
    return !0;
  }
  function kr(A) {
    if (A = A || (typeof document < "u" ? document : void 0), typeof A > "u") return null;
    try {
      return A.activeElement || A.body;
    } catch {
      return A.body;
    }
  }
  function xf(A) {
    for (; A && A.firstChild; ) A = A.firstChild;
    return A;
  }
  function Tf(A, t) {
    var e = xf(A);
    A = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (a = A + e.textContent.length, A <= t && a >= t)
          return { node: e, offset: t - A };
        A = a;
      }
      A: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break A;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = xf(e);
    }
  }
  function Uf(A, t) {
    return A && t ? A === t ? !0 : A && A.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Uf(A, t.parentNode) : "contains" in A ? A.contains(t) : A.compareDocumentPosition ? !!(A.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Mf(A) {
    A = A != null && A.ownerDocument != null && A.ownerDocument.defaultView != null ? A.ownerDocument.defaultView : window;
    for (var t = kr(A.document); t instanceof A.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) A = t.contentWindow;
      else break;
      t = kr(A.document);
    }
    return t;
  }
  function Br(A) {
    var t = A && A.nodeName && A.nodeName.toLowerCase();
    return t && (t === "input" && (A.type === "text" || A.type === "search" || A.type === "tel" || A.type === "url" || A.type === "password") || t === "textarea" || A.contentEditable === "true");
  }
  var Ly = He && "documentMode" in document && 11 >= document.documentMode, Mn = null, Yr = null, Kl = null, Hr = !1;
  function zf(A, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Hr || Mn == null || Mn !== kr(a) || (a = Mn, "selectionStart" in a && Br(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Kl && Vl(Kl, a) || (Kl = a, a = Bi(Yr, "onSelect"), 0 < a.length && (t = new qu(
      "onSelect",
      "select",
      null,
      t,
      e
    ), A.push({ event: t, listeners: a }), t.target = Mn)));
  }
  function Za(A, t) {
    var e = {};
    return e[A.toLowerCase()] = t.toLowerCase(), e["Webkit" + A] = "webkit" + t, e["Moz" + A] = "moz" + t, e;
  }
  var zn = {
    animationend: Za("Animation", "AnimationEnd"),
    animationiteration: Za("Animation", "AnimationIteration"),
    animationstart: Za("Animation", "AnimationStart"),
    transitionrun: Za("Transition", "TransitionRun"),
    transitionstart: Za("Transition", "TransitionStart"),
    transitioncancel: Za("Transition", "TransitionCancel"),
    transitionend: Za("Transition", "TransitionEnd")
  }, Gr = {}, jf = {};
  He && (jf = document.createElement("div").style, "AnimationEvent" in window || (delete zn.animationend.animation, delete zn.animationiteration.animation, delete zn.animationstart.animation), "TransitionEvent" in window || delete zn.transitionend.transition);
  function Qa(A) {
    if (Gr[A]) return Gr[A];
    if (!zn[A]) return A;
    var t = zn[A], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in jf)
        return Gr[A] = t[e];
    return A;
  }
  var Df = Qa("animationend"), Rf = Qa("animationiteration"), Of = Qa("animationstart"), Xy = Qa("transitionrun"), Iy = Qa("transitionstart"), Py = Qa("transitioncancel"), Ef = Qa("transitionend"), Vf = /* @__PURE__ */ new Map(), Fr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Fr.push("scrollEnd");
  function de(A, t) {
    Vf.set(A, t), Fa(t, [A]);
  }
  var _y = 0;
  function Ge(A, t) {
    if (A.name != null && A.name !== "auto") return A.name;
    if (t.autoName !== null) return t.autoName;
    A = ye.identifierPrefix;
    var e = _y++;
    return A = "_" + A + "t_" + e.toString(32) + "_", t.autoName = A;
  }
  function Kf(A) {
    if (A == null || typeof A == "string")
      return A;
    var t = null, e = Wn;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = A[e[a]];
        if (n != null) {
          if (n === "none") return "none";
          t = t == null ? n : t + (" " + n);
        }
      }
    return t ?? A.default;
  }
  function Fe(A, t) {
    return A = Kf(A), t = Kf(t), t == null ? A === "auto" ? null : A : t === "auto" ? null : t;
  }
  var Yu = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  }, Ae = [], jn = 0, Zr = 0;
  function Hu() {
    for (var A = jn, t = Zr = jn = 0; t < A; ) {
      var e = Ae[t];
      Ae[t++] = null;
      var a = Ae[t];
      Ae[t++] = null;
      var n = Ae[t];
      Ae[t++] = null;
      var l = Ae[t];
      if (Ae[t++] = null, a !== null && n !== null) {
        var o = a.pending;
        o === null ? n.next = n : (n.next = o.next, o.next = n), a.pending = n;
      }
      l !== 0 && wf(e, n, l);
    }
  }
  function Gu(A, t, e, a) {
    Ae[jn++] = A, Ae[jn++] = t, Ae[jn++] = e, Ae[jn++] = a, Zr |= a, A.lanes |= a, A = A.alternate, A !== null && (A.lanes |= a);
  }
  function Qr(A, t, e, a) {
    return Gu(A, t, e, a), Fu(A);
  }
  function Ja(A, t) {
    return Gu(A, null, null, t), Fu(A);
  }
  function wf(A, t, e) {
    A.lanes |= e;
    var a = A.alternate;
    a !== null && (a.lanes |= e);
    for (var n = !1, l = A.return; l !== null; )
      l.childLanes |= e, a = l.alternate, a !== null && (a.childLanes |= e), l.tag === 22 && (A = l.stateNode, A === null || A._visibility & 1 || (n = !0)), A = l, l = l.return;
    return A.tag === 3 ? (l = A.stateNode, n && t !== null && (n = 31 - RA(e), A = l.hiddenUpdates, a = A[n], a === null ? A[n] = [t] : a.push(t), t.lane = e | 536870912), l) : null;
  }
  function Fu(A) {
    if (50 < eu)
      throw eu = 0, Ei = null, Error(i(185));
    for (var t = A.return; t !== null; )
      A = t, t = A.return;
    return A.tag === 3 ? A.stateNode : null;
  }
  var Dn = {};
  function $y(A, t, e, a) {
    this.tag = A, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function wt(A, t, e, a) {
    return new $y(A, t, e, a);
  }
  function Jr(A) {
    return A = A.prototype, !(!A || !A.isReactComponent);
  }
  function Ze(A, t) {
    var e = A.alternate;
    return e === null ? (e = wt(
      A.tag,
      t,
      A.key,
      A.mode
    ), e.elementType = A.elementType, e.type = A.type, e.stateNode = A.stateNode, e.alternate = A, A.alternate = e) : (e.pendingProps = t, e.type = A.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = A.flags & 1206910976, e.childLanes = A.childLanes, e.lanes = A.lanes, e.child = A.child, e.memoizedProps = A.memoizedProps, e.memoizedState = A.memoizedState, e.updateQueue = A.updateQueue, t = A.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = A.sibling, e.index = A.index, e.ref = A.ref, e.refCleanup = A.refCleanup, e;
  }
  function Cf(A, t) {
    A.flags &= 1206910978;
    var e = A.alternate;
    return e === null ? (A.childLanes = 0, A.lanes = t, A.child = null, A.subtreeFlags = 0, A.memoizedProps = null, A.memoizedState = null, A.updateQueue = null, A.dependencies = null, A.stateNode = null) : (A.childLanes = e.childLanes, A.lanes = e.lanes, A.child = e.child, A.subtreeFlags = 0, A.deletions = null, A.memoizedProps = e.memoizedProps, A.memoizedState = e.memoizedState, A.updateQueue = e.updateQueue, A.type = e.type, t = e.dependencies, A.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), A;
  }
  function Zu(A, t, e, a, n, l) {
    var o = 0;
    if (a = A, typeof a == "function") Jr(a) && (o = 1);
    else if (typeof a == "string")
      o = z1(
        A,
        e,
        tt.current
      ) ? 26 : A === "html" || A === "head" || A === "body" ? 27 : 5;
    else
      A: switch (a) {
        case GA:
          return A = wt(31, e, t, n), A.elementType = GA, A.lanes = l, A;
        case zA:
          return Wa(e.children, n, l, t);
        case oA:
          o = 8, n |= 24;
          break;
        case JA:
          return A = wt(12, e, t, n | 2), A.elementType = JA, A.lanes = l, A;
        case P:
          return A = wt(13, e, t, n), A.elementType = P, A.lanes = l, A;
        case lA:
          return A = wt(19, e, t, n), A.elementType = lA, A.lanes = l, A;
        case WA:
        case h:
          return A = n | 32, A = wt(30, e, t, A), A.elementType = h, A.lanes = l, A.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, A;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case TA:
                o = 10;
                break A;
              case HA:
                o = 9;
                break A;
              case k:
                o = 11;
                break A;
              case dA:
                o = 14;
                break A;
              case F:
                o = 16, a = null;
                break A;
            }
          o = 29, e = Error(
            i(130, A === null ? "null" : typeof A, "")
          ), a = null;
      }
    return t = wt(o, e, t, n), t.elementType = A, t.type = a, t.lanes = l, t;
  }
  function Wa(A, t, e, a) {
    return A = wt(7, A, a, t), A.lanes = e, A;
  }
  function Wr(A, t, e) {
    return A = wt(6, A, null, t), A.lanes = e, A;
  }
  function qf(A) {
    var t = wt(18, null, null, 0);
    return t.stateNode = A, t;
  }
  function Lr(A, t, e) {
    return t = wt(
      4,
      A.children !== null ? A.children : [],
      A.key,
      t
    ), t.lanes = e, t.stateNode = {
      containerInfo: A.containerInfo,
      pendingChildren: null,
      implementation: A.implementation
    }, t;
  }
  var kf = /* @__PURE__ */ new WeakMap();
  function te(A, t) {
    if (typeof A == "object" && A !== null) {
      var e = kf.get(A);
      return e !== void 0 ? e : (t = {
        value: A,
        source: t,
        stack: ke(t)
      }, kf.set(A, t), t);
    }
    return {
      value: A,
      source: t,
      stack: ke(t)
    };
  }
  var Rn = [], On = 0, Qu = null, wl = 0, ee = [], ae = 0, ca = null, xe = 1, Te = "";
  function Qe(A, t) {
    Rn[On++] = wl, Rn[On++] = Qu, Qu = A, wl = t;
  }
  function Bf(A, t, e) {
    ee[ae++] = xe, ee[ae++] = Te, ee[ae++] = ca, ca = A;
    var a = xe;
    A = Te;
    var n = 32 - RA(a) - 1;
    a &= ~(1 << n), e += 1;
    var l = 32 - RA(t) + n;
    if (30 < l) {
      var o = n - n % 5;
      l = (a & (1 << o) - 1).toString(32), a >>= o, n -= o, xe = 1 << 32 - RA(t) + n | e << n | a, Te = l + A;
    } else
      xe = 1 << l | e << n | a, Te = A;
  }
  function Ju(A) {
    A.return !== null && (Qe(A, 1), Bf(A, 1, 0));
  }
  function Xr(A) {
    for (; A === Qu; )
      Qu = Rn[--On], Rn[On] = null, wl = Rn[--On], Rn[On] = null;
    for (; A === ca; )
      ca = ee[--ae], ee[ae] = null, Te = ee[--ae], ee[ae] = null, xe = ee[--ae], ee[ae] = null;
  }
  function Yf(A, t) {
    ee[ae++] = xe, ee[ae++] = Te, ee[ae++] = ca, xe = t.id, Te = t.overflow, ca = A;
  }
  var ft = null, FA = null, vA = !1, sa = null, ne = !1, Ir = Error(i(519));
  function fa(A) {
    var t = Error(
      i(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Cl(te(t, A)), Ir;
  }
  function Hf(A) {
    var t = A.stateNode, e = A.type, a = A.memoizedProps;
    switch (t[gt] = A, t[Kt] = a, e) {
      case "dialog":
        NA("cancel", t), NA("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        NA("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < nu.length; e++)
          NA(nu[e], t);
        break;
      case "source":
        NA("error", t);
        break;
      case "img":
      case "image":
      case "link":
        NA("error", t), NA("load", t);
        break;
      case "details":
        NA("toggle", t);
        break;
      case "input":
        NA("invalid", t), _s(
          t,
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
        NA("invalid", t);
        break;
      case "textarea":
        NA("invalid", t), Af(t, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || r0(t.textContent, e) ? (a.popover != null && (NA("beforetoggle", t), NA("toggle", t)), a.onScroll != null && NA("scroll", t), a.onScrollEnd != null && NA("scrollend", t), a.onClick != null && (t.onclick = Ne), t = !0) : t = !1, t || fa(A, !0);
  }
  function Wu(A) {
    for (ft = A.return; ft; )
      switch (ft.tag) {
        case 5:
        case 31:
        case 13:
          ne = !1;
          return;
        case 27:
        case 3:
          ne = !0;
          return;
        default:
          ft = ft.return;
      }
  }
  function En(A) {
    if (A !== ft) return !1;
    if (!vA) return Wu(A), vA = !0, !1;
    var t = A.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = A.type, e = !(e !== "form" && e !== "button") || zc(A.type, A.memoizedProps)), e = !e), e && FA && fa(A), Wu(A), t === 13) {
      if (A = A.memoizedState, A = A !== null ? A.dehydrated : null, !A) throw Error(i(317));
      FA = z0(A);
    } else if (t === 31) {
      if (A = A.memoizedState, A = A !== null ? A.dehydrated : null, !A) throw Error(i(317));
      FA = z0(A);
    } else
      t === 27 ? (t = FA, ja(A.type) ? (A = Cc, Cc = null, FA = A) : FA = t) : FA = ft ? ue(A.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    FA = ft = null, vA = !1;
  }
  function Pr() {
    var A = sa;
    return A !== null && (kt === null ? kt = A : kt.push.apply(
      kt,
      A
    ), sa = null), A;
  }
  function Cl(A) {
    sa === null ? sa = [A] : sa.push(A);
  }
  var _r = Ht(null), Xa = null, Je = null;
  function da(A, t, e) {
    VA(_r, t._currentValue), t._currentValue = e;
  }
  function We(A) {
    A._currentValue = _r.current, XA(_r);
  }
  function Lu(A, t, e) {
    for (; A !== null; ) {
      var a = A.alternate;
      if ((A.childLanes & t) !== t ? (A.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), A === e) break;
      A = A.return;
    }
  }
  function $r(A, t, e, a) {
    var n = A.child;
    for (n !== null && (n.return = A); n !== null; ) {
      var l = n.dependencies;
      if (l !== null) {
        var o = n.child;
        l = l.firstContext;
        A: for (; l !== null; ) {
          var f = l;
          l = n;
          for (var g = 0; g < t.length; g++)
            if (f.context === t[g]) {
              l.lanes |= e, f = l.alternate, f !== null && (f.lanes |= e), Lu(
                l.return,
                e,
                A
              ), a || (o = null);
              break A;
            }
          l = f.next;
        }
      } else if (n.tag === 18) {
        if (o = n.return, o === null) throw Error(i(341));
        o.lanes |= e, l = o.alternate, l !== null && (l.lanes |= e), Lu(o, e, A), o = null;
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null ? (n.lanes |= e, o = n.alternate, o !== null && (o.lanes |= e), Lu(
          n.return,
          e,
          A
        ), o = n.child, o = o !== null ? o.sibling : null) : o = n.child;
      if (o !== null) o.return = n;
      else
        for (o = n; o !== null; ) {
          if (o === A) {
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
  function Ia(A, t, e, a) {
    A = null;
    for (var n = t, l = !1; n !== null; ) {
      if (!l) {
        if ((n.flags & 524288) !== 0) l = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var o = n.alternate;
        if (o === null) throw Error(i(387));
        if (o = o.memoizedProps, o !== null) {
          var f = n.type;
          Zt(n.pendingProps.value, o.value) || (A !== null ? A.push(f) : A = [f]);
        }
      } else if (n === et.current) {
        if (o = n.alternate, o === null) throw Error(i(387));
        o.memoizedState.memoizedState !== n.memoizedState.memoizedState && (A !== null ? A.push(al) : A = [al]);
      }
      n = n.return;
    }
    return A !== null && $r(
      t,
      A,
      e,
      a
    ), t.flags |= 262144, A !== null;
  }
  function Xu(A) {
    for (A = A.firstContext; A !== null; ) {
      if (!Zt(
        A.context._currentValue,
        A.memoizedValue
      ))
        return !0;
      A = A.next;
    }
    return !1;
  }
  function Pa(A) {
    Xa = A, Je = null, A = A.dependencies, A !== null && (A.firstContext = null);
  }
  function yt(A) {
    return Gf(Xa, A);
  }
  function Iu(A, t) {
    return Xa === null && Pa(A), Gf(A, t);
  }
  function Gf(A, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, Je === null) {
      if (A === null) throw Error(i(308));
      Je = t, A.dependencies = { lanes: 0, firstContext: t }, A.flags |= 524288;
    } else Je = Je.next = t;
    return e;
  }
  var Ah = typeof AbortController < "u" ? AbortController : function() {
    var A = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(e, a) {
        A.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, A.forEach(function(e) {
        return e();
      });
    };
  }, th = u.unstable_scheduleCallback, eh = u.unstable_NormalPriority, nt = {
    $$typeof: TA,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ao() {
    return {
      controller: new Ah(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function ql(A) {
    A.refCount--, A.refCount === 0 && th(eh, function() {
      A.controller.abort();
    });
  }
  function Ff(A, t) {
    if ((A.pendingLanes & 4194048) !== 0) {
      var e = A.transitionTypes;
      for (e === null && (e = A.transitionTypes = []), A = 0; A < t.length; A++) {
        var a = t[A];
        e.indexOf(a) === -1 && e.push(a);
      }
    }
  }
  var kl = null;
  function ah(A) {
    var t = A.transitionTypes;
    return A.transitionTypes = null, t;
  }
  var Bl = null, to = 0, _a = 0, Vn = null;
  function nh(A, t) {
    if (Bl === null) {
      var e = Bl = [];
      to = 0, _a = hc(), Vn = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return to++, t.then(Zf, Zf), t;
  }
  function Zf() {
    if (--to === 0 && (kl = null, Bl !== null)) {
      Vn !== null && (Vn.status = "fulfilled");
      var A = Bl;
      Bl = null, _a = 0, Vn = null;
      for (var t = 0; t < A.length; t++) (0, A[t])();
    }
  }
  function lh(A, t) {
    var e = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        e.push(n);
      }
    };
    return A.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < e.length; n++) (0, e[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < e.length; n++)
          (0, e[n])(void 0);
      }
    ), a;
  }
  var Qf = L.S;
  L.S = function(A, t) {
    if (qm = Ut(), typeof t == "object" && t !== null && typeof t.then == "function" && nh(A, t), kl !== null)
      for (var e = Pn; e !== null; )
        Ff(e, kl), e = e.next;
    if (e = A.types, e !== null) {
      for (var a = Pn; a !== null; )
        Ff(a, e), a = a.next;
      if (_a !== 0) {
        a = kl, a === null && (a = kl = []);
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          a.indexOf(l) === -1 && a.push(l);
        }
      }
    }
    Qf !== null && Qf(A, t);
  };
  var $a = Ht(null);
  function eo() {
    var A = $a.current;
    return A !== null ? A : YA.pooledCache;
  }
  function Pu(A, t) {
    t === null ? VA($a, $a.current) : VA($a, t.pool);
  }
  function Jf() {
    var A = eo();
    return A === null ? null : { parent: nt._currentValue, pool: A };
  }
  var Kn = Error(i(460)), ao = Error(i(474)), _u = Error(i(542)), $u = { then: function() {
  } };
  function Wf(A) {
    return A = A.status, A === "fulfilled" || A === "rejected";
  }
  function Lf(A, t, e) {
    switch (e = A[e], e === void 0 ? A.push(t) : e !== t && (t.then(Ne, Ne), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw A = t.reason, If(A), A === void 0 && !("reason" in t) ? Error(i(600)) : A;
      default:
        if (typeof t.status == "string") t.then(Ne, Ne);
        else {
          if (A = YA, A !== null && 100 < A.shellSuspendCounter)
            throw Error(i(482));
          A = t, A.status = "pending", A.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw A = t.reason, If(A), A;
        }
        throw tn = t, Kn;
    }
  }
  function An(A) {
    try {
      var t = A._init;
      return t(A._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (tn = e, Kn) : e;
    }
  }
  var tn = null;
  function Xf() {
    if (tn === null) throw Error(i(459));
    var A = tn;
    return tn = null, A;
  }
  function If(A) {
    if (A === Kn || A === _u)
      throw Error(i(483));
  }
  var wn = null, Yl = 0;
  function Ai(A) {
    var t = Yl;
    return Yl += 1, wn === null && (wn = []), Lf(wn, A, t);
  }
  function ma(A, t) {
    t = t.props.ref, A.ref = t !== void 0 ? t : null;
  }
  function ti(A, t) {
    throw t.$$typeof === B ? Error(i(525)) : (A = Object.prototype.toString.call(t), Error(
      i(
        31,
        A === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : A
      )
    ));
  }
  function Pf(A) {
    function t(x, b) {
      if (A) {
        var j = x.deletions;
        j === null ? (x.deletions = [b], x.flags |= 16) : j.push(b);
      }
    }
    function e(x, b) {
      if (!A) return null;
      for (; b !== null; )
        t(x, b), b = b.sibling;
      return null;
    }
    function a(x) {
      for (var b = /* @__PURE__ */ new Map(); x !== null; )
        x.key === null ? b.set(x.index, x) : b.set(x.key, x), x = x.sibling;
      return b;
    }
    function n(x, b) {
      return x = Ze(x, b), x.index = 0, x.sibling = null, x;
    }
    function l(x, b, j) {
      return x.index = j, A ? (j = x.alternate, j !== null ? (j = j.index, j < b ? (x.flags |= 2, b) : j) : (x.flags |= 134217730, b)) : (x.flags |= 1048576, b);
    }
    function o(x) {
      return A && x.alternate === null && (x.flags |= 134217730), x;
    }
    function f(x, b, j, V) {
      return b === null || b.tag !== 6 ? (b = Wr(j, x.mode, V), b.return = x, b) : (b = n(b, j), b.return = x, b);
    }
    function g(x, b, j, V) {
      var $ = j.type;
      return $ === zA ? (x = E(
        x,
        b,
        j.props.children,
        V,
        j.key
      ), ma(x, j), x) : b !== null && (b.elementType === $ || typeof $ == "object" && $ !== null && $.$$typeof === F && An($) === b.type) ? (b = n(b, j.props), ma(b, j), b.return = x, b) : (b = Zu(
        j.type,
        j.key,
        j.props,
        null,
        x.mode,
        V
      ), ma(b, j), b.return = x, b);
    }
    function T(x, b, j, V) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== j.containerInfo || b.stateNode.implementation !== j.implementation ? (b = Lr(j, x.mode, V), b.return = x, b) : (b = n(b, j.children || []), b.return = x, b);
    }
    function E(x, b, j, V, $) {
      return b === null || b.tag !== 7 ? (b = Wa(
        j,
        x.mode,
        V,
        $
      ), b.return = x, b) : (b = n(b, j), b.return = x, b);
    }
    function K(x, b, j) {
      if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
        return b = Wr(
          "" + b,
          x.mode,
          j
        ), b.return = x, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case gA:
            return j = Zu(
              b.type,
              b.key,
              b.props,
              null,
              x.mode,
              j
            ), ma(j, b), j.return = x, j;
          case xA:
            return b = Lr(
              b,
              x.mode,
              j
            ), b.return = x, b;
          case F:
            return b = An(b), K(x, b, j);
        }
        if (cA(b) || G(b))
          return b = Wa(
            b,
            x.mode,
            j,
            null
          ), b.return = x, b;
        if (typeof b.then == "function")
          return K(x, Ai(b), j);
        if (b.$$typeof === TA)
          return K(
            x,
            Iu(x, b),
            j
          );
        ti(x, b);
      }
      return null;
    }
    function N(x, b, j, V) {
      var $ = b !== null ? b.key : null;
      if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint")
        return $ !== null ? null : f(x, b, "" + j, V);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case gA:
            return j.key === $ ? g(x, b, j, V) : null;
          case xA:
            return j.key === $ ? T(x, b, j, V) : null;
          case F:
            return j = An(j), N(x, b, j, V);
        }
        if (cA(j) || G(j))
          return $ !== null ? null : E(x, b, j, V, null);
        if (typeof j.then == "function")
          return N(
            x,
            b,
            Ai(j),
            V
          );
        if (j.$$typeof === TA)
          return N(
            x,
            b,
            Iu(x, j),
            V
          );
        ti(x, j);
      }
      return null;
    }
    function R(x, b, j, V, $) {
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return x = x.get(j) || null, f(b, x, "" + V, $);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case gA:
            return x = x.get(
              V.key === null ? j : V.key
            ) || null, g(b, x, V, $);
          case xA:
            return x = x.get(
              V.key === null ? j : V.key
            ) || null, T(b, x, V, $);
          case F:
            return V = An(V), R(
              x,
              b,
              j,
              V,
              $
            );
        }
        if (cA(V) || G(V))
          return x = x.get(j) || null, E(b, x, V, $, null);
        if (typeof V.then == "function")
          return R(
            x,
            b,
            j,
            Ai(V),
            $
          );
        if (V.$$typeof === TA)
          return R(
            x,
            b,
            j,
            Iu(b, V),
            $
          );
        ti(b, V);
      }
      return null;
    }
    function X(x, b, j, V) {
      for (var $ = null, MA = null, rA = b, fA = b = 0, it = null; rA !== null && fA < j.length; fA++) {
        rA.index > fA ? (it = rA, rA = null) : it = rA.sibling;
        var jA = N(
          x,
          rA,
          j[fA],
          V
        );
        if (jA === null) {
          rA === null && (rA = it);
          break;
        }
        A && rA && jA.alternate === null && t(x, rA), b = l(jA, b, fA), MA === null ? $ = jA : MA.sibling = jA, MA = jA, rA = it;
      }
      if (fA === j.length)
        return e(x, rA), vA && Qe(x, fA), $;
      if (rA === null) {
        for (; fA < j.length; fA++)
          rA = K(x, j[fA], V), rA !== null && (b = l(
            rA,
            b,
            fA
          ), MA === null ? $ = rA : MA.sibling = rA, MA = rA);
        return vA && Qe(x, fA), $;
      }
      for (rA = a(rA); fA < j.length; fA++)
        it = R(
          rA,
          x,
          fA,
          j[fA],
          V
        ), it !== null && (A && (jA = it.alternate, jA !== null && rA.delete(jA.key === null ? fA : jA.key)), b = l(
          it,
          b,
          fA
        ), MA === null ? $ = it : MA.sibling = it, MA = it);
      return A && rA.forEach(function(Va) {
        return t(x, Va);
      }), vA && Qe(x, fA), $;
    }
    function nA(x, b, j, V) {
      if (j == null) throw Error(i(151));
      for (var $ = null, MA = null, rA = b, fA = b = 0, it = null, jA = j.next(); rA !== null && !jA.done; fA++, jA = j.next()) {
        rA.index > fA ? (it = rA, rA = null) : it = rA.sibling;
        var Va = N(x, rA, jA.value, V);
        if (Va === null) {
          rA === null && (rA = it);
          break;
        }
        A && rA && Va.alternate === null && t(x, rA), b = l(Va, b, fA), MA === null ? $ = Va : MA.sibling = Va, MA = Va, rA = it;
      }
      if (jA.done)
        return e(x, rA), vA && Qe(x, fA), $;
      if (rA === null) {
        for (; !jA.done; fA++, jA = j.next())
          jA = K(x, jA.value, V), jA !== null && (b = l(jA, b, fA), MA === null ? $ = jA : MA.sibling = jA, MA = jA);
        return vA && Qe(x, fA), $;
      }
      for (rA = a(rA); !jA.done; fA++, jA = j.next())
        jA = R(rA, x, fA, jA.value, V), jA !== null && (A && (it = jA.alternate, it !== null && rA.delete(
          it.key === null ? fA : it.key
        )), b = l(jA, b, fA), MA === null ? $ = jA : MA.sibling = jA, MA = jA);
      return A && rA.forEach(function(B1) {
        return t(x, B1);
      }), vA && Qe(x, fA), $;
    }
    function hA(x, b, j, V) {
      if (typeof j == "object" && j !== null && j.type === zA && j.key === null && j.props.ref === void 0 && (j = j.props.children), typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case gA:
            A: {
              for (var $ = j.key; b !== null; ) {
                if (b.key === $) {
                  if ($ = j.type, $ === zA) {
                    if (b.tag === 7) {
                      e(
                        x,
                        b.sibling
                      ), V = n(
                        b,
                        j.props.children
                      ), ma(V, j), V.return = x, x = V;
                      break A;
                    }
                  } else if (b.elementType === $ || typeof $ == "object" && $ !== null && $.$$typeof === F && An($) === b.type) {
                    e(
                      x,
                      b.sibling
                    ), V = n(b, j.props), ma(V, j), V.return = x, x = V;
                    break A;
                  }
                  e(x, b);
                  break;
                } else t(x, b);
                b = b.sibling;
              }
              j.type === zA ? (V = Wa(
                j.props.children,
                x.mode,
                V,
                j.key
              ), ma(V, j), V.return = x, x = V) : (V = Zu(
                j.type,
                j.key,
                j.props,
                null,
                x.mode,
                V
              ), ma(V, j), V.return = x, x = V);
            }
            return o(x);
          case xA:
            A: {
              for ($ = j.key; b !== null; ) {
                if (b.key === $)
                  if (b.tag === 4 && b.stateNode.containerInfo === j.containerInfo && b.stateNode.implementation === j.implementation) {
                    e(
                      x,
                      b.sibling
                    ), V = n(b, j.children || []), V.return = x, x = V;
                    break A;
                  } else {
                    e(x, b);
                    break;
                  }
                else t(x, b);
                b = b.sibling;
              }
              V = Lr(j, x.mode, V), V.return = x, x = V;
            }
            return o(x);
          case F:
            return j = An(j), hA(
              x,
              b,
              j,
              V
            );
        }
        if (cA(j))
          return X(
            x,
            b,
            j,
            V
          );
        if (G(j)) {
          if ($ = G(j), typeof $ != "function") throw Error(i(150));
          return j = $.call(j), nA(
            x,
            b,
            j,
            V
          );
        }
        if (typeof j.then == "function")
          return hA(
            x,
            b,
            Ai(j),
            V
          );
        if (j.$$typeof === TA)
          return hA(
            x,
            b,
            Iu(x, j),
            V
          );
        ti(x, j);
      }
      return typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint" ? (j = "" + j, b !== null && b.tag === 6 ? (e(x, b.sibling), V = n(b, j), V.return = x, x = V) : (e(x, b), V = Wr(j, x.mode, V), V.return = x, x = V), o(x)) : e(x, b);
    }
    return function(x, b, j, V) {
      try {
        Yl = 0;
        var $ = hA(
          x,
          b,
          j,
          V
        );
        return wn = null, $;
      } catch (rA) {
        if (rA === Kn || rA === _u) throw rA;
        var MA = wt(29, rA, null, x.mode);
        return MA.lanes = V, MA.return = x, MA;
      } finally {
      }
    };
  }
  var en = Pf(!0), _f = Pf(!1), pa = !1;
  function no(A) {
    A.updateQueue = {
      baseState: A.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function lo(A, t) {
    A = A.updateQueue, t.updateQueue === A && (t.updateQueue = {
      baseState: A.baseState,
      firstBaseUpdate: A.firstBaseUpdate,
      lastBaseUpdate: A.lastBaseUpdate,
      shared: A.shared,
      callbacks: null
    });
  }
  function ga(A) {
    return { lane: A, tag: 0, payload: null, callback: null, next: null };
  }
  function ya(A, t, e) {
    var a = A.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (OA & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Fu(A), wf(A, null, e), t;
    }
    return Gu(A, a, t, e), Fu(A);
  }
  function Hl(A, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= A.pendingLanes, e |= a, t.lanes = e, ks(A, e);
    }
  }
  function uo(A, t) {
    var e = A.updateQueue, a = A.alternate;
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
        l === null ? n = l = t : l = l.next = t;
      } else n = l = t;
      e = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: l,
        shared: a.shared,
        callbacks: a.callbacks
      }, A.updateQueue = e;
      return;
    }
    A = e.lastBaseUpdate, A === null ? e.firstBaseUpdate = t : A.next = t, e.lastBaseUpdate = t;
  }
  var io = !1;
  function Gl() {
    if (io) {
      var A = Vn;
      if (A !== null) throw A;
    }
  }
  function Fl(A, t, e, a) {
    io = !1;
    var n = A.updateQueue;
    pa = !1;
    var l = n.firstBaseUpdate, o = n.lastBaseUpdate, f = n.shared.pending;
    if (f !== null) {
      n.shared.pending = null;
      var g = f, T = g.next;
      g.next = null, o === null ? l = T : o.next = T, o = g;
      var E = A.alternate;
      E !== null && (E = E.updateQueue, f = E.lastBaseUpdate, f !== o && (f === null ? E.firstBaseUpdate = T : f.next = T, E.lastBaseUpdate = g));
    }
    if (l !== null) {
      var K = n.baseState;
      o = 0, E = T = g = null, f = l;
      do {
        var N = f.lane & -536870913, R = N !== f.lane;
        if (R ? (UA & N) === N : (a & N) === N) {
          N !== 0 && N === _a && (io = !0), E !== null && (E = E.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          A: {
            var X = A, nA = f;
            N = t;
            var hA = e;
            switch (nA.tag) {
              case 1:
                if (X = nA.payload, typeof X == "function") {
                  K = X.call(hA, K, N);
                  break A;
                }
                K = X;
                break A;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = nA.payload, N = typeof X == "function" ? X.call(hA, K, N) : X, N == null) break A;
                K = J({}, K, N);
                break A;
              case 2:
                pa = !0;
            }
          }
          N = f.callback, N !== null && (A.flags |= 64, R && (A.flags |= 8192), R = n.callbacks, R === null ? n.callbacks = [N] : R.push(N));
        } else
          R = {
            lane: N,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, E === null ? (T = E = R, g = K) : E = E.next = R, o |= N;
        if (f = f.next, f === null) {
          if (f = n.shared.pending, f === null)
            break;
          R = f, f = R.next, R.next = null, n.lastBaseUpdate = R, n.shared.pending = null;
        }
      } while (!0);
      E === null && (g = K), n.baseState = g, n.firstBaseUpdate = T, n.lastBaseUpdate = E, l === null && (n.shared.lanes = 0), Ta |= o, A.lanes = o, A.memoizedState = K;
    }
  }
  function $f(A, t) {
    if (typeof A != "function")
      throw Error(i(191, A));
    A.call(t);
  }
  function Ad(A, t) {
    var e = A.callbacks;
    if (e !== null)
      for (A.callbacks = null, A = 0; A < e.length; A++)
        $f(e[A], t);
  }
  var ha = Ht(null), ei = Ht(0);
  function td(A, t) {
    A = _e, VA(ei, A), VA(ha, t), _e = A | t.baseLanes;
  }
  function ro() {
    VA(ei, _e), VA(ha, ha.current);
  }
  function oo() {
    _e = ei.current, XA(ha), XA(ei);
  }
  var ht = Ht(null), Tt = null;
  function va(A) {
    var t = A.alternate;
    VA(vt, vt.current & 1), VA(ht, A), Tt === null && (t === null || ha.current !== null || t.memoizedState !== null) && (Tt = A);
  }
  function co(A) {
    VA(vt, vt.current), VA(ht, A), Tt === null && (Tt = A);
  }
  function ed(A) {
    A.tag === 22 ? (VA(vt, vt.current), VA(ht, A), Tt === null && (Tt = A)) : ba();
  }
  function ba() {
    VA(vt, vt.current), VA(ht, ht.current);
  }
  function Qt(A) {
    XA(ht), Tt === A && (Tt = null), XA(vt);
  }
  var vt = Ht(0);
  function Zl(A, t) {
    VA(ht, ht.current), VA(vt, t);
  }
  function so(A) {
    XA(vt), XA(ht), Tt === A && (Tt = null);
  }
  function ai(A) {
    for (var t = A; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || Kc(e) || wc(e)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === A) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === A) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Le = 0, yA = null, kA = null, lt = null, ni = !1, Cn = !1, an = !1, li = 0, Ql = 0, qn = null, uh = 0;
  function _A() {
    throw Error(i(321));
  }
  function fo(A, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < A.length; e++)
      if (!Zt(A[e], t[e])) return !1;
    return !0;
  }
  function mo(A, t, e, a, n, l) {
    return Le = l, yA = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, L.H = A === null || A.memoizedState === null ? Bd : Yd, an = !1, l = e(a, n), an = !1, Cn && (l = nd(
      t,
      e,
      a,
      n
    )), ad(A), l;
  }
  function ad(A) {
    L.H = fi;
    var t = kA !== null && kA.next !== null;
    if (Le = 0, lt = kA = yA = null, ni = !1, Ql = 0, qn = null, t) throw Error(i(300));
    A === null || ut || (A = A.dependencies, A !== null && Xu(A) && (ut = !0));
  }
  function nd(A, t, e, a) {
    yA = A;
    var n = 0;
    do {
      if (Cn && (qn = null), Ql = 0, Cn = !1, 25 <= n) throw Error(i(301));
      if (n += 1, lt = kA = null, A.updateQueue != null) {
        var l = A.updateQueue;
        l.lastEffect = null, l.events = null, l.stores = null, l.memoCache != null && (l.memoCache.index = 0);
      }
      L.H = mh, l = t(e, a);
    } while (Cn);
    return l;
  }
  function ih() {
    var A = L.H, t = A.useState()[0];
    return t = typeof t.then == "function" ? Jl(t) : t, A = A.useState()[0], (kA !== null ? kA.memoizedState : null) !== A && (yA.flags |= 1024), t;
  }
  function po() {
    var A = li !== 0;
    return li = 0, A;
  }
  function go(A, t, e) {
    t.updateQueue = A.updateQueue, t.flags &= -2053, A.lanes &= ~e;
  }
  function yo(A) {
    if (ni) {
      for (A = A.memoizedState; A !== null; ) {
        var t = A.queue;
        t !== null && (t.pending = null), A = A.next;
      }
      ni = !1;
    }
    Le = 0, lt = kA = yA = null, Cn = !1, Ql = li = 0, qn = null;
  }
  function jt() {
    var A = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return lt === null ? yA.memoizedState = lt = A : lt = lt.next = A, lt;
  }
  function At() {
    if (kA === null) {
      var A = yA.alternate;
      A = A !== null ? A.memoizedState : null;
    } else A = kA.next;
    var t = lt === null ? yA.memoizedState : lt.next;
    if (t !== null)
      lt = t, kA = A;
    else {
      if (A === null)
        throw yA.alternate === null ? Error(i(467)) : Error(i(310));
      kA = A, A = {
        memoizedState: kA.memoizedState,
        baseState: kA.baseState,
        baseQueue: kA.baseQueue,
        queue: kA.queue,
        next: null
      }, lt === null ? yA.memoizedState = lt = A : lt = lt.next = A;
    }
    return lt;
  }
  function ui() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Jl(A) {
    var t = Ql;
    return Ql += 1, qn === null && (qn = []), A = Lf(qn, A, t), t = yA, (lt === null ? t.memoizedState : lt.next) === null && (t = t.alternate, L.H = t === null || t.memoizedState === null ? Bd : Yd), A;
  }
  function ii(A) {
    if (A !== null && typeof A == "object") {
      if (typeof A.then == "function") return Jl(A);
      if (A.$$typeof === U) return;
      if (A.$$typeof === TA) return yt(A);
    }
    throw Error(i(438, String(A)));
  }
  function ho(A) {
    var t = null, e = yA.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = yA.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = ui(), yA.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(A), a = 0; a < A; a++)
        e[a] = rt;
    return t.index++, e;
  }
  function Xe(A, t) {
    return typeof t == "function" ? t(A) : t;
  }
  function ri(A) {
    var t = At();
    return vo(t, kA, A);
  }
  function vo(A, t, e) {
    var a = A.queue;
    if (a === null) throw Error(i(311));
    a.lastRenderedReducer = e;
    var n = A.baseQueue, l = a.pending;
    if (l !== null) {
      if (n !== null) {
        var o = n.next;
        n.next = l.next, l.next = o;
      }
      t.baseQueue = n = l, a.pending = null;
    }
    if (l = A.baseState, n === null) A.memoizedState = l;
    else {
      t = n.next;
      var f = o = null, g = null, T = t, E = !1;
      do {
        var K = T.lane & -536870913;
        if (K !== T.lane ? (UA & K) === K : (Le & K) === K) {
          var N = T.revertLane;
          if (N === 0)
            g !== null && (g = g.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), K === _a && (E = !0);
          else if ((Le & N) === N) {
            T = T.next, N === _a && (E = !0);
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
            }, g === null ? (f = g = K, o = l) : g = g.next = K, yA.lanes |= N, Ta |= N;
          K = T.action, an && e(l, K), l = T.hasEagerState ? T.eagerState : e(l, K);
        } else
          N = {
            lane: K,
            revertLane: T.revertLane,
            gesture: T.gesture,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, g === null ? (f = g = N, o = l) : g = g.next = N, yA.lanes |= K, Ta |= K;
        T = T.next;
      } while (T !== null && T !== t);
      if (g === null ? o = l : g.next = f, !Zt(l, A.memoizedState) && (ut = !0, E && (e = Vn, e !== null)))
        throw e;
      A.memoizedState = l, A.baseState = o, A.baseQueue = g, a.lastRenderedState = l;
    }
    return n === null && (a.lanes = 0), [A.memoizedState, a.dispatch];
  }
  function bo(A) {
    var t = At(), e = t.queue;
    if (e === null) throw Error(i(311));
    e.lastRenderedReducer = A;
    var a = e.dispatch, n = e.pending, l = t.memoizedState;
    if (n !== null) {
      e.pending = null;
      var o = n = n.next;
      do
        l = A(l, o.action), o = o.next;
      while (o !== n);
      Zt(l, t.memoizedState) || (ut = !0), t.memoizedState = l, t.baseQueue === null && (t.baseState = l), e.lastRenderedState = l;
    }
    return [l, a];
  }
  function ld(A, t, e) {
    var a = yA, n = At(), l = vA;
    if (l) {
      if (e === void 0) throw Error(i(407));
      e = e();
    } else e = t();
    var o = !Zt(
      (kA || n).memoizedState,
      e
    );
    if (o && (n.memoizedState = e, ut = !0), n = n.queue, xo(rd.bind(null, a, n, A), [
      A
    ]), A = n.getSnapshot !== t || o || lt !== null && (lt.memoizedState.tag & 1) !== 0, kn(
      A ? 9 : 8,
      { destroy: void 0 },
      id.bind(null, a, n, e, t),
      null
    ), A) {
      if (a.flags |= 2048, YA === null) throw Error(i(349));
      l || (Le & 127) !== 0 || ud(a, t, e);
    }
    return e;
  }
  function ud(A, t, e) {
    A.flags |= 16384, A = { getSnapshot: t, value: e }, t = yA.updateQueue, t === null ? (t = ui(), yA.updateQueue = t, t.stores = [A]) : (e = t.stores, e === null ? t.stores = [A] : e.push(A));
  }
  function id(A, t, e, a) {
    t.value = e, t.getSnapshot = a, od(t) && cd(A);
  }
  function rd(A, t, e) {
    return e(function() {
      od(t) && cd(A);
    });
  }
  function od(A) {
    var t = A.getSnapshot;
    A = A.value;
    try {
      var e = t();
      return !Zt(A, e);
    } catch {
      return !0;
    }
  }
  function cd(A) {
    var t = Ja(A, 2);
    t !== null && Bt(t, A, 2);
  }
  function So(A) {
    var t = jt();
    if (typeof A == "function") {
      var e = A;
      if (A = e(), an) {
        Et(!0);
        try {
          e();
        } finally {
          Et(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = A, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Xe,
      lastRenderedState: A
    }, t;
  }
  function sd(A, t, e, a) {
    return A.baseState = e, vo(
      A,
      kA,
      typeof a == "function" ? a : Xe
    );
  }
  function rh(A, t, e, a, n) {
    if (si(A)) throw Error(i(485));
    if (A = t.action, A !== null) {
      var l = {
        payload: n,
        action: A,
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
      L.T !== null ? e(!0) : l.isTransition = !1, a(l), e = t.pending, e === null ? (l.next = t.pending = l, fd(t, l)) : (l.next = e.next, t.pending = e.next = l);
    }
  }
  function fd(A, t) {
    var e = t.action, a = t.payload, n = A.state;
    if (t.isTransition) {
      var l = L.T, o = {};
      o.types = l !== null ? l.types : null, L.T = o;
      try {
        var f = e(n, a), g = L.S;
        g !== null && g(o, f), dd(A, t, f);
      } catch (T) {
        No(A, t, T);
      } finally {
        l !== null && o.types !== null && (l.types = o.types), L.T = l;
      }
    } else
      try {
        l = e(n, a), dd(A, t, l);
      } catch (T) {
        No(A, t, T);
      }
  }
  function dd(A, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        md(A, t, a);
      },
      function(a) {
        return No(A, t, a);
      }
    ) : md(A, t, e);
  }
  function md(A, t, e) {
    t.status = "fulfilled", t.value = e, pd(t), A.state = e, t = A.pending, t !== null && (e = t.next, e === t ? A.pending = null : (e = e.next, t.next = e, fd(A, e)));
  }
  function No(A, t, e) {
    var a = A.pending;
    if (A.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = e, pd(t), t = t.next;
      while (t !== a);
    }
    A.action = null;
  }
  function pd(A) {
    A = A.listeners;
    for (var t = 0; t < A.length; t++) (0, A[t])();
  }
  function gd(A, t) {
    return t;
  }
  function yd(A, t) {
    if (vA) {
      var e = YA.formState;
      if (e !== null) {
        A: {
          var a = yA;
          if (vA) {
            if (FA) {
              t: {
                for (var n = FA, l = ne; n.nodeType !== 8; ) {
                  if (!l) {
                    n = null;
                    break t;
                  }
                  if (n = ue(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                l = n.data, n = l === "F!" || l === "F" ? n : null;
              }
              if (n) {
                FA = ue(
                  n.nextSibling
                ), a = n.data === "F!";
                break A;
              }
            }
            fa(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = jt(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: gd,
      lastRenderedState: t
    }, e.queue = a, e = Cd.bind(
      null,
      yA,
      a
    ), a.dispatch = e, a = So(!1), l = jo.bind(
      null,
      yA,
      !1,
      a.queue
    ), a = jt(), n = {
      state: t,
      dispatch: null,
      action: A,
      pending: null
    }, a.queue = n, e = rh.bind(
      null,
      yA,
      n,
      l,
      e
    ), n.dispatch = e, a.memoizedState = A, [t, e, !1];
  }
  function hd(A) {
    var t = At();
    return vd(t, kA, A);
  }
  function vd(A, t, e) {
    if (t = vo(
      A,
      t,
      gd
    )[0], A = ri(Xe)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Jl(t);
      } catch (o) {
        throw o === Kn ? _u : o;
      }
    else a = t;
    t = At();
    var n = t.queue, l = n.dispatch;
    return e !== t.memoizedState && (yA.flags |= 2048, kn(
      9,
      { destroy: void 0 },
      oh.bind(null, n, e),
      null
    )), [a, l, A];
  }
  function oh(A, t) {
    A.action = t;
  }
  function bd(A) {
    var t = At(), e = kA;
    if (e !== null)
      return vd(t, e, A);
    At(), t = t.memoizedState, e = At();
    var a = e.queue.dispatch;
    return e.memoizedState = A, [t, a, !1];
  }
  function kn(A, t, e, a) {
    return A = { tag: A, create: e, deps: a, inst: t, next: null }, t = yA.updateQueue, t === null && (t = ui(), yA.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = A.next = A : (a = e.next, e.next = A, A.next = a, t.lastEffect = A), A;
  }
  function Sd() {
    return At().memoizedState;
  }
  function oi(A, t, e, a) {
    var n = jt();
    yA.flags |= A, n.memoizedState = kn(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function ci(A, t, e, a) {
    var n = At();
    a = a === void 0 ? null : a;
    var l = n.memoizedState.inst;
    kA !== null && a !== null && fo(a, kA.memoizedState.deps) ? n.memoizedState = kn(t, l, e, a) : (yA.flags |= A, n.memoizedState = kn(
      1 | t,
      l,
      e,
      a
    ));
  }
  function Nd(A, t) {
    oi(8390656, 8, A, t);
  }
  function xo(A, t) {
    ci(2048, 8, A, t);
  }
  function ch(A) {
    yA.flags |= 4;
    var t = yA.updateQueue;
    if (t === null)
      t = ui(), yA.updateQueue = t, t.events = [A];
    else {
      var e = t.events;
      e === null ? t.events = [A] : e.push(A);
    }
  }
  function xd(A) {
    var t = At().memoizedState;
    return ch({ ref: t, nextImpl: A }), function() {
      if ((OA & 2) !== 0) throw Error(i(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Td(A, t) {
    return ci(4, 2, A, t);
  }
  function Ud(A, t) {
    return ci(4, 4, A, t);
  }
  function Md(A, t) {
    if (typeof t == "function") {
      A = A();
      var e = t(A);
      return function() {
        typeof e == "function" ? e() : t(null);
      };
    }
    if (t != null)
      return A = A(), t.current = A, function() {
        t.current = null;
      };
  }
  function zd(A, t, e) {
    e = e != null ? e.concat([A]) : null, ci(4, 4, Md.bind(null, t, A), e);
  }
  function To() {
  }
  function jd(A, t) {
    var e = At();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && fo(t, a[1]) ? a[0] : (e.memoizedState = [A, t], A);
  }
  function Dd(A, t) {
    var e = At();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && fo(t, a[1]))
      return a[0];
    if (a = A(), an) {
      Et(!0);
      try {
        A();
      } finally {
        Et(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function Uo(A, t, e) {
    return e === void 0 || (Le & 1073741824) !== 0 && (UA & 261930) === 0 ? A.memoizedState = t : (A.memoizedState = e, A = Bm(), yA.lanes |= A, Ta |= A, e);
  }
  function Rd(A, t, e, a) {
    return Zt(e, t) ? e : ha.current !== null ? (A = Uo(A, e, a), Zt(A, t) || (ut = !0), A) : (Le & 106) === 0 || (Le & 1073741824) !== 0 && (UA & 261930) === 0 ? (ut = !0, A.memoizedState = e) : (A = Bm(), yA.lanes |= A, Ta |= A, t);
  }
  function Od(A, t, e, a, n) {
    var l = _.p;
    _.p = l !== 0 && 8 > l ? l : 8;
    var o = L.T, f = {};
    f.types = o !== null ? o.types : null, L.T = f, jo(A, !1, t, e);
    try {
      var g = n(), T = L.S;
      if (T !== null && T(f, g), g !== null && typeof g == "object" && typeof g.then == "function") {
        var E = lh(
          g,
          a
        );
        Wl(
          A,
          t,
          E,
          Xt(A)
        );
      } else
        Wl(
          A,
          t,
          a,
          Xt(A)
        );
    } catch (K) {
      Wl(
        A,
        t,
        { then: function() {
        }, status: "rejected", reason: K },
        Xt()
      );
    } finally {
      _.p = l, o !== null && f.types !== null && (o.types = f.types), L.T = o;
    }
  }
  function sh() {
  }
  function Mo(A, t, e, a) {
    if (A.tag !== 5) throw Error(i(476));
    var n = Ed(A).queue;
    Od(
      A,
      n,
      t,
      LA,
      e === null ? sh : function() {
        return Vd(A), e(a);
      }
    );
  }
  function Ed(A) {
    var t = A.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: LA,
      baseState: LA,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xe,
        lastRenderedState: LA
      },
      next: null
    };
    var e = {};
    return t.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Xe,
        lastRenderedState: e
      },
      next: null
    }, A.memoizedState = t, A = A.alternate, A !== null && (A.memoizedState = t), t;
  }
  function Vd(A) {
    var t = Ed(A);
    t.next === null && (t = A.alternate.memoizedState), Wl(
      A,
      t.next.queue,
      {},
      Xt()
    );
  }
  function zo() {
    return yt(al);
  }
  function Kd() {
    return At().memoizedState;
  }
  function wd() {
    return At().memoizedState;
  }
  function fh(A) {
    for (var t = A.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = Xt();
          A = ga(e);
          var a = ya(t, A, e);
          a !== null && (Bt(a, t, e), Hl(a, t, e)), t = { cache: Ao() }, A.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function dh(A, t, e) {
    var a = Xt();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(A) ? qd(t, e) : (e = Qr(A, t, e, a), e !== null && (Bt(e, A, a), kd(e, t, a)));
  }
  function Cd(A, t, e) {
    var a = Xt();
    Wl(A, t, e, a);
  }
  function Wl(A, t, e, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (si(A)) qd(t, n);
    else {
      var l = A.alternate;
      if (A.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer, l !== null))
        try {
          var o = t.lastRenderedState, f = l(o, e);
          if (n.hasEagerState = !0, n.eagerState = f, Zt(f, o))
            return Gu(A, t, n, 0), YA === null && Hu(), !1;
        } catch {
        } finally {
        }
      if (e = Qr(A, t, n, a), e !== null)
        return Bt(e, A, a), kd(e, t, a), !0;
    }
    return !1;
  }
  function jo(A, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: hc(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(A)) {
      if (t) throw Error(i(479));
    } else
      t = Qr(
        A,
        e,
        a,
        2
      ), t !== null && Bt(t, A, 2);
  }
  function si(A) {
    var t = A.alternate;
    return A === yA || t !== null && t === yA;
  }
  function qd(A, t) {
    Cn = ni = !0;
    var e = A.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), A.pending = t;
  }
  function kd(A, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= A.pendingLanes, e |= a, t.lanes = e, ks(A, e);
    }
  }
  var fi = {
    readContext: yt,
    use: ii,
    useCallback: _A,
    useContext: _A,
    useEffect: _A,
    useImperativeHandle: _A,
    useLayoutEffect: _A,
    useInsertionEffect: _A,
    useMemo: _A,
    useReducer: _A,
    useRef: _A,
    useState: _A,
    useDebugValue: _A,
    useDeferredValue: _A,
    useTransition: _A,
    useSyncExternalStore: _A,
    useId: _A,
    useHostTransitionStatus: _A,
    useFormState: _A,
    useActionState: _A,
    useOptimistic: _A,
    useMemoCache: _A,
    useCacheRefresh: _A,
    useEffectEvent: _A
  }, Bd = {
    readContext: yt,
    use: ii,
    useCallback: function(A, t) {
      return jt().memoizedState = [
        A,
        t === void 0 ? null : t
      ], A;
    },
    useContext: yt,
    useEffect: Nd,
    useImperativeHandle: function(A, t, e) {
      e = e != null ? e.concat([A]) : null, oi(
        4194308,
        4,
        Md.bind(null, t, A),
        e
      );
    },
    useLayoutEffect: function(A, t) {
      return oi(4194308, 4, A, t);
    },
    useInsertionEffect: function(A, t) {
      oi(4, 2, A, t);
    },
    useMemo: function(A, t) {
      var e = jt();
      t = t === void 0 ? null : t;
      var a = A();
      if (an) {
        Et(!0);
        try {
          A();
        } finally {
          Et(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(A, t, e) {
      var a = jt();
      if (e !== void 0) {
        var n = e(t);
        if (an) {
          Et(!0);
          try {
            e(t);
          } finally {
            Et(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, A = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: A,
        lastRenderedState: n
      }, a.queue = A, A = A.dispatch = dh.bind(
        null,
        yA,
        A
      ), [a.memoizedState, A];
    },
    useRef: function(A) {
      var t = jt();
      return A = { current: A }, t.memoizedState = A;
    },
    useState: function(A) {
      A = So(A);
      var t = A.queue, e = Cd.bind(null, yA, t);
      return t.dispatch = e, [A.memoizedState, e];
    },
    useDebugValue: To,
    useDeferredValue: function(A, t) {
      var e = jt();
      return Uo(e, A, t);
    },
    useTransition: function() {
      var A = So(!1);
      return A = Od.bind(
        null,
        yA,
        A.queue,
        !0,
        !1
      ), jt().memoizedState = A, [!1, A];
    },
    useSyncExternalStore: function(A, t, e) {
      var a = yA, n = jt();
      if (vA) {
        if (e === void 0)
          throw Error(i(407));
        e = e();
      } else {
        if (e = t(), YA === null)
          throw Error(i(349));
        (UA & 127) !== 0 || ud(a, t, e);
      }
      n.memoizedState = e;
      var l = { value: e, getSnapshot: t };
      return n.queue = l, Nd(rd.bind(null, a, l, A), [
        A
      ]), a.flags |= 2048, kn(
        9,
        { destroy: void 0 },
        id.bind(
          null,
          a,
          l,
          e,
          t
        ),
        null
      ), e;
    },
    useId: function() {
      var A = jt(), t = YA.identifierPrefix;
      if (vA) {
        var e = Te, a = xe;
        e = (a & ~(1 << 32 - RA(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = li++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = uh++, t = "_" + t + "r_" + e.toString(32) + "_";
      return A.memoizedState = t;
    },
    useHostTransitionStatus: zo,
    useFormState: yd,
    useActionState: yd,
    useOptimistic: function(A) {
      var t = jt();
      t.memoizedState = t.baseState = A;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = jo.bind(
        null,
        yA,
        !0,
        e
      ), e.dispatch = t, [A, t];
    },
    useMemoCache: ho,
    useCacheRefresh: function() {
      return jt().memoizedState = fh.bind(
        null,
        yA
      );
    },
    useEffectEvent: function(A) {
      var t = jt(), e = { impl: A };
      return t.memoizedState = e, function() {
        if ((OA & 2) !== 0)
          throw Error(i(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, Yd = {
    readContext: yt,
    use: ii,
    useCallback: jd,
    useContext: yt,
    useEffect: xo,
    useImperativeHandle: zd,
    useInsertionEffect: Td,
    useLayoutEffect: Ud,
    useMemo: Dd,
    useReducer: ri,
    useRef: Sd,
    useState: function() {
      return ri(Xe);
    },
    useDebugValue: To,
    useDeferredValue: function(A, t) {
      var e = At();
      return Rd(
        e,
        kA.memoizedState,
        A,
        t
      );
    },
    useTransition: function() {
      var A = ri(Xe)[0], t = At().memoizedState;
      return [
        typeof A == "boolean" ? A : Jl(A),
        t
      ];
    },
    useSyncExternalStore: ld,
    useId: Kd,
    useHostTransitionStatus: zo,
    useFormState: hd,
    useActionState: hd,
    useOptimistic: function(A, t) {
      var e = At();
      return sd(e, kA, A, t);
    },
    useMemoCache: ho,
    useCacheRefresh: wd,
    useEffectEvent: xd
  }, mh = {
    readContext: yt,
    use: ii,
    useCallback: jd,
    useContext: yt,
    useEffect: xo,
    useImperativeHandle: zd,
    useInsertionEffect: Td,
    useLayoutEffect: Ud,
    useMemo: Dd,
    useReducer: bo,
    useRef: Sd,
    useState: function() {
      return bo(Xe);
    },
    useDebugValue: To,
    useDeferredValue: function(A, t) {
      var e = At();
      return kA === null ? Uo(e, A, t) : Rd(
        e,
        kA.memoizedState,
        A,
        t
      );
    },
    useTransition: function() {
      var A = bo(Xe)[0], t = At().memoizedState;
      return [
        typeof A == "boolean" ? A : Jl(A),
        t
      ];
    },
    useSyncExternalStore: ld,
    useId: Kd,
    useHostTransitionStatus: zo,
    useFormState: bd,
    useActionState: bd,
    useOptimistic: function(A, t) {
      var e = At();
      return kA !== null ? sd(e, kA, A, t) : (e.baseState = A, [A, e.queue.dispatch]);
    },
    useMemoCache: ho,
    useCacheRefresh: wd,
    useEffectEvent: xd
  };
  function Do(A, t, e, a) {
    t = A.memoizedState, e = e(a, t), e = e == null ? t : J({}, t, e), A.memoizedState = e, A.lanes === 0 && (A.updateQueue.baseState = e);
  }
  var Ro = {
    enqueueSetState: function(A, t, e) {
      A = A._reactInternals;
      var a = Xt(), n = ga(a);
      n.payload = t, e != null && (n.callback = e), t = ya(A, n, a), t !== null && (Bt(t, A, a), Hl(t, A, a));
    },
    enqueueReplaceState: function(A, t, e) {
      A = A._reactInternals;
      var a = Xt(), n = ga(a);
      n.tag = 1, n.payload = t, e != null && (n.callback = e), t = ya(A, n, a), t !== null && (Bt(t, A, a), Hl(t, A, a));
    },
    enqueueForceUpdate: function(A, t) {
      A = A._reactInternals;
      var e = Xt(), a = ga(e);
      a.tag = 2, t != null && (a.callback = t), t = ya(A, a, e), t !== null && (Bt(t, A, e), Hl(t, A, e));
    }
  };
  function Hd(A, t, e, a, n, l, o) {
    return A = A.stateNode, typeof A.shouldComponentUpdate == "function" ? A.shouldComponentUpdate(a, l, o) : t.prototype && t.prototype.isPureReactComponent ? !Vl(e, a) || !Vl(n, l) : !0;
  }
  function Gd(A, t, e, a) {
    A = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== A && Ro.enqueueReplaceState(t, t.state, null);
  }
  function nn(A, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (A = A.defaultProps) {
      e === t && (e = J({}, e));
      for (var n in A)
        e[n] === void 0 && (e[n] = A[n]);
    }
    return e;
  }
  function Fd(A) {
    Yu(A);
  }
  function Zd(A) {
    console.error(A);
  }
  function Qd(A) {
    Yu(A);
  }
  function di(A, t) {
    try {
      var e = A.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Jd(A, t, e) {
    try {
      var a = A.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Oo(A, t, e) {
    return e = ga(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      di(A, t);
    }, e;
  }
  function Wd(A) {
    return A = ga(A), A.tag = 3, A;
  }
  function Ld(A, t, e, a) {
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = a.value;
      A.payload = function() {
        return n(l);
      }, A.callback = function() {
        Jd(t, e, a);
      };
    }
    var o = e.stateNode;
    o !== null && typeof o.componentDidCatch == "function" && (A.callback = function() {
      Jd(t, e, a), typeof n != "function" && (Ua === null ? Ua = /* @__PURE__ */ new Set([this]) : Ua.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function ph(A, t, e, a, n) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = e.alternate, t !== null && Ia(
        t,
        e,
        n,
        !0
      ), e = ht.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            return Tt === null ? Ki() : e.alternate === null && $A === 0 && ($A = 3), e.flags &= -257, e.flags |= 65536, e.lanes = n, a === $u ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), pc(A, a, n)), !1;
          case 22:
            return e.flags |= 65536, a === $u ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), pc(A, a, n)), !1;
        }
        throw Error(i(435, e.tag));
      }
      return pc(A, a, n), Ki(), !1;
    }
    if (vA)
      return t = ht.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Ir && (A = Error(i(422), { cause: a }), Cl(te(A, e)))) : (a !== Ir && (t = Error(i(423), {
        cause: a
      }), Cl(
        te(t, e)
      )), A = A.current.alternate, A.flags |= 65536, n &= -n, A.lanes |= n, a = te(a, e), n = Oo(
        A.stateNode,
        a,
        n
      ), uo(A, n), $A !== 4 && ($A = 2)), !1;
    var l = Error(i(520), { cause: a });
    if (l = te(l, e), tu === null ? tu = [l] : tu.push(l), $A !== 4 && ($A = 2), t === null) return !0;
    a = te(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, A = n & -n, e.lanes |= A, A = Oo(e.stateNode, a, A), uo(e, A), !1;
        case 1:
          if (t = e.type, l = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || l !== null && typeof l.componentDidCatch == "function" && (Ua === null || !Ua.has(l))))
            return e.flags |= 65536, n &= -n, e.lanes |= n, n = Wd(n), Ld(
              n,
              A,
              e,
              a
            ), uo(e, n), !1;
          break;
        case 22:
          if (e.memoizedState !== null)
            return e.flags |= 65536, !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var Eo = Error(i(461)), ut = !1;
  function ot(A, t, e, a) {
    t.child = A === null ? _f(t, null, e, a) : en(
      t,
      A.child,
      e,
      a
    );
  }
  function Xd(A, t, e, a, n) {
    e = e.render;
    var l = t.ref;
    if ("ref" in a) {
      var o = {};
      for (var f in a)
        f !== "ref" && (o[f] = a[f]);
    } else o = a;
    return Pa(t), a = mo(
      A,
      t,
      e,
      o,
      l,
      n
    ), f = po(), A !== null && !ut ? (go(A, t, n), Ie(A, t, n)) : (vA && f && Ju(t), t.flags |= 1, ot(A, t, a, n), t.child);
  }
  function Id(A, t, e, a, n) {
    if (A === null) {
      var l = e.type;
      return typeof l == "function" && !Jr(l) && l.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = l, Pd(
        A,
        t,
        l,
        a,
        n
      )) : (A = Zu(
        e.type,
        null,
        a,
        t,
        t.mode,
        n
      ), A.ref = t.ref, A.return = t, t.child = A);
    }
    if (l = A.child, !Yo(A, n)) {
      var o = l.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Vl, e(o, a) && A.ref === t.ref)
        return Ie(A, t, n);
    }
    return t.flags |= 1, A = Ze(l, a), A.ref = t.ref, A.return = t, t.child = A;
  }
  function Pd(A, t, e, a, n) {
    if (A !== null) {
      var l = A.memoizedProps;
      if (Vl(l, a) && A.ref === t.ref)
        if (ut = !1, t.pendingProps = a = l, Yo(A, n))
          (A.flags & 131072) !== 0 && (ut = !0);
        else
          return t.lanes = A.lanes, Ie(A, t, n);
    }
    return Vo(
      A,
      t,
      e,
      a,
      n
    );
  }
  function _d(A, t, e, a) {
    var n = a.children, l = A !== null ? A.memoizedState : null;
    if (A === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (l = l !== null ? l.baseLanes | e : e, A !== null) {
          for (a = t.child = A.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~l;
        } else a = 0, t.child = null;
        return $d(
          A,
          t,
          l,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, A !== null && Pu(
          t,
          l !== null ? l.cachePool : null
        ), l !== null ? td(t, l) : ro(), ed(t);
      else
        return a = t.lanes = 536870912, $d(
          A,
          t,
          l !== null ? l.baseLanes | e : e,
          e,
          a
        );
    } else
      l !== null ? (Pu(t, l.cachePool), td(t, l), ba(), t.memoizedState = null) : (A !== null && Pu(t, null), ro(), ba());
    return ot(A, t, n, e), t.child;
  }
  function Ll(A, t) {
    return A !== null && A.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function $d(A, t, e, a, n) {
    var l = eo();
    return l = l === null ? null : { parent: nt._currentValue, pool: l }, t.memoizedState = {
      baseLanes: e,
      cachePool: l
    }, A !== null && Pu(t, null), ro(), ed(t), A !== null && Ia(A, t, a, !0), t.childLanes = n, null;
  }
  function mi(A, t) {
    return t = pi(
      { mode: t.mode, children: t.children },
      A.mode
    ), t.ref = A.ref, A.child = t, t.return = A, t;
  }
  function Am(A, t, e) {
    return en(t, A.child, null, e), A = mi(t, t.pendingProps), A.flags |= 2, Qt(t), t.memoizedState = null, A;
  }
  function gh(A, t, e) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, A === null) {
      if (vA) {
        if (a.mode === "hidden")
          return A = mi(t, a), t.lanes = 536870912, A.memoizedState = { baseLanes: 0, cachePool: null }, Ll(null, A);
        if (co(t), (A = FA) ? (A = M0(
          A,
          ne
        ), A = A !== null && A.data === "&" ? A : null, A !== null && (t.memoizedState = {
          dehydrated: A,
          treeContext: ca !== null ? { id: xe, overflow: Te } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = qf(A), e.return = t, t.child = e, ft = t, FA = null)) : A = null, A === null) throw fa(t);
        return t.lanes = 536870912, null;
      }
      return mi(t, a);
    }
    var l = A.memoizedState;
    if (l !== null) {
      var o = l.dehydrated;
      if (co(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = Am(
            A,
            t,
            e
          );
        else if (t.memoizedState !== null)
          t.child = A.child, t.flags |= 128, t = null;
        else throw Error(i(558));
      else if (ut || Ia(A, t, e, !1), n = (e & A.childLanes) !== 0, ut || n) {
        if (ha.current === null) {
          if (a = YA, a !== null && (o = Bs(a, e), o !== 0 && o !== l.retryLane))
            throw l.retryLane = o, Ja(A, o), Bt(a, A, o), Eo;
          Ki();
        }
        t = Am(
          A,
          t,
          e
        );
      } else
        A = l.treeContext, FA = ue(o.nextSibling), ft = t, vA = !0, sa = null, ne = !1, A !== null && Yf(t, A), t = mi(t, a), t.flags |= 134221824;
      return t;
    }
    return A = Ze(A.child, {
      mode: a.mode,
      children: a.children
    }), A.ref = t.ref, t.child = A, A.return = t, A;
  }
  function Bn(A, t) {
    var e = t.ref;
    if (e === null)
      A !== null && A.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(i(284));
      (A === null || A.ref !== e) && (t.flags |= 4194816);
    }
  }
  function Vo(A, t, e, a, n) {
    return Pa(t), e = mo(
      A,
      t,
      e,
      a,
      void 0,
      n
    ), a = po(), A !== null && !ut ? (go(A, t, n), Ie(A, t, n)) : (vA && a && Ju(t), t.flags |= 1, ot(A, t, e, n), t.child);
  }
  function tm(A, t, e, a, n, l) {
    return Pa(t), t.updateQueue = null, e = nd(
      t,
      a,
      e,
      n
    ), ad(A), a = po(), A !== null && !ut ? (go(A, t, l), Ie(A, t, l)) : (vA && a && Ju(t), t.flags |= 1, ot(A, t, e, l), t.child);
  }
  function em(A, t, e, a, n) {
    if (Pa(t), t.stateNode === null) {
      var l = Dn, o = e.contextType;
      typeof o == "object" && o !== null && (l = yt(o)), l = new e(a, l), t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, l.updater = Ro, t.stateNode = l, l._reactInternals = t, l = t.stateNode, l.props = a, l.state = t.memoizedState, l.refs = {}, no(t), o = e.contextType, l.context = typeof o == "object" && o !== null ? yt(o) : Dn, l.state = t.memoizedState, o = e.getDerivedStateFromProps, typeof o == "function" && (Do(
        t,
        e,
        o,
        a
      ), l.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (o = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), o !== l.state && Ro.enqueueReplaceState(l, l.state, null), Fl(t, a, l, n), Gl(), l.state = t.memoizedState), typeof l.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (A === null) {
      l = t.stateNode;
      var f = t.memoizedProps, g = nn(e, f);
      l.props = g;
      var T = l.context, E = e.contextType;
      o = Dn, typeof E == "object" && E !== null && (o = yt(E));
      var K = e.getDerivedStateFromProps;
      E = typeof K == "function" || typeof l.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, E || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (f || T !== o) && Gd(
        t,
        l,
        a,
        o
      ), pa = !1;
      var N = t.memoizedState;
      l.state = N, Fl(t, a, l, n), Gl(), T = t.memoizedState, f || N !== T || pa ? (typeof K == "function" && (Do(
        t,
        e,
        K,
        a
      ), T = t.memoizedState), (g = pa || Hd(
        t,
        e,
        g,
        a,
        N,
        T,
        o
      )) ? (E || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount()), typeof l.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof l.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = T), l.props = a, l.state = T, l.context = o, a = g) : (typeof l.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      l = t.stateNode, lo(A, t), o = t.memoizedProps, E = nn(e, o), l.props = E, K = t.pendingProps, N = l.context, T = e.contextType, g = Dn, typeof T == "object" && T !== null && (g = yt(T)), f = e.getDerivedStateFromProps, (T = typeof f == "function" || typeof l.getSnapshotBeforeUpdate == "function") || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (o !== K || N !== g) && Gd(
        t,
        l,
        a,
        g
      ), pa = !1, N = t.memoizedState, l.state = N, Fl(t, a, l, n), Gl();
      var R = t.memoizedState;
      o !== K || N !== R || pa || A !== null && A.dependencies !== null && Xu(A.dependencies) ? (typeof f == "function" && (Do(
        t,
        e,
        f,
        a
      ), R = t.memoizedState), (E = pa || Hd(
        t,
        e,
        E,
        a,
        N,
        R,
        g
      ) || A !== null && A.dependencies !== null && Xu(A.dependencies)) ? (T || typeof l.UNSAFE_componentWillUpdate != "function" && typeof l.componentWillUpdate != "function" || (typeof l.componentWillUpdate == "function" && l.componentWillUpdate(a, R, g), typeof l.UNSAFE_componentWillUpdate == "function" && l.UNSAFE_componentWillUpdate(
        a,
        R,
        g
      )), typeof l.componentDidUpdate == "function" && (t.flags |= 4), typeof l.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof l.componentDidUpdate != "function" || o === A.memoizedProps && N === A.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === A.memoizedProps && N === A.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = R), l.props = a, l.state = R, l.context = g, a = E) : (typeof l.componentDidUpdate != "function" || o === A.memoizedProps && N === A.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === A.memoizedProps && N === A.memoizedState || (t.flags |= 1024), a = !1);
    }
    return l = a, Bn(A, t), a = (t.flags & 128) !== 0, l || a ? (l = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : l.render(), t.flags |= 1, A !== null && a ? (t.child = en(
      t,
      A.child,
      null,
      n
    ), t.child = en(
      t,
      null,
      e,
      n
    )) : ot(A, t, e, n), t.memoizedState = l.state, A = t.child) : A = Ie(
      A,
      t,
      n
    ), A;
  }
  function am(A, t, e, a) {
    return La(), t.flags |= 256, ot(A, t, e, a), t.child;
  }
  var Ko = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function wo(A) {
    return { baseLanes: A, cachePool: Jf() };
  }
  function Co(A, t, e) {
    return A = A !== null ? A.childLanes & ~e : 0, t && (A |= Lt), A;
  }
  function nm(A, t, e) {
    var a = t.pendingProps, n = !1, l = (t.flags & 128) !== 0, o;
    if ((o = l) || (o = A !== null && A.memoizedState === null ? !1 : (vt.current & 2) !== 0), o && (n = !0, t.flags &= -129), o = (t.flags & 32) !== 0, t.flags &= -33, A === null) {
      if (vA) {
        if (n ? va(t) : ba(), (A = FA) ? (A = M0(
          A,
          ne
        ), A = A !== null && A.data !== "&" ? A : null, A !== null && (t.memoizedState = {
          dehydrated: A,
          treeContext: ca !== null ? { id: xe, overflow: Te } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = qf(A), e.return = t, t.child = e, ft = t, FA = null)) : A = null, A === null) throw fa(t);
        return wc(A) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return l = a.children, a = a.fallback, n ? (ba(), n = t.mode, l = pi(
        { mode: "hidden", children: l },
        n
      ), a = Wa(
        a,
        n,
        e,
        null
      ), l.return = t, a.return = t, l.sibling = a, t.child = l, a = t.child, a.memoizedState = wo(e), a.childLanes = Co(
        A,
        o,
        e
      ), t.memoizedState = Ko, Ll(null, a)) : (va(t), qo(t, l));
    }
    var f = A.memoizedState;
    if (f !== null) {
      var g = f.dehydrated;
      if (g !== null)
        return yh(
          A,
          t,
          l,
          o,
          a,
          g,
          f,
          e
        );
    }
    return n ? (ba(), n = a.fallback, l = t.mode, f = A.child, g = f.sibling, a = Ze(f, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = f.subtreeFlags & 1206910976, g !== null ? n = Ze(g, n) : (n = Wa(
      n,
      l,
      e,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, Ll(null, a), a = t.child, n = A.child.memoizedState, n === null ? n = wo(e) : (l = n.cachePool, l !== null ? (f = nt._currentValue, l = l.parent !== f ? { parent: f, pool: f } : l) : l = Jf(), n = {
      baseLanes: n.baseLanes | e,
      cachePool: l
    }), a.memoizedState = n, a.childLanes = Co(
      A,
      o,
      e
    ), t.memoizedState = Ko, Ll(A.child, a)) : (va(t), e = A.child, A = e.sibling, e = Ze(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, A !== null && (o = t.deletions, o === null ? (t.deletions = [A], t.flags |= 16) : o.push(A)), t.child = e, t.memoizedState = null, e);
  }
  function qo(A, t) {
    return t = pi(
      { mode: "visible", children: t },
      A.mode
    ), t.return = A, A.child = t;
  }
  function pi(A, t) {
    return A = wt(22, A, null, t), A.lanes = 0, A;
  }
  function gi(A, t, e) {
    return en(t, A.child, null, e), A = qo(
      t,
      t.pendingProps.children
    ), A.flags |= 2, t.memoizedState = null, A;
  }
  function yh(A, t, e, a, n, l, o, f) {
    if (e)
      return t.flags & 256 ? (va(t), t.flags &= -257, gi(
        A,
        t,
        f
      )) : t.memoizedState !== null ? (ba(), t.child = A.child, t.flags |= 128, null) : (ba(), l = n.fallback, o = t.mode, n = pi(
        { mode: "visible", children: n.children },
        o
      ), l = Wa(
        l,
        o,
        f,
        null
      ), l.flags |= 2, n.return = t, l.return = t, n.sibling = l, t.child = n, en(t, A.child, null, f), n = t.child, n.memoizedState = wo(f), n.childLanes = Co(
        A,
        a,
        f
      ), t.memoizedState = Ko, Ll(null, n));
    if (va(t), wc(l)) {
      if (a = l.nextSibling && l.nextSibling.dataset, a) var g = a.dgst;
      return a = g, a !== "" && (n = Error(i(419)), n.stack = "", n.digest = a, Cl({ value: n, source: null, stack: null })), gi(
        A,
        t,
        f
      );
    }
    if (ut || Ia(A, t, f, !1), a = (f & A.childLanes) !== 0, ut || a) {
      if (ha.current !== null)
        return gi(
          A,
          t,
          f
        );
      if (a = YA, a !== null && (n = Bs(
        a,
        f
      ), n !== 0 && n !== o.retryLane))
        throw o.retryLane = n, Ja(A, n), Bt(a, A, n), Eo;
      return Kc(l) || Ki(), gi(
        A,
        t,
        f
      );
    }
    return Kc(l) ? (t.flags |= 192, t.child = A.child, null) : (A = o.treeContext, FA = ue(l.nextSibling), ft = t, vA = !0, sa = null, ne = !1, A !== null && Yf(t, A), t = qo(
      t,
      n.children
    ), t.flags |= 134221824, t);
  }
  function lm(A, t, e) {
    A.lanes |= t;
    var a = A.alternate;
    a !== null && (a.lanes |= t), Lu(A.return, t, e);
  }
  function um(A) {
    for (var t = null; A !== null; ) {
      var e = A.alternate;
      e !== null && ai(e) === null && (t = A), A = A.sibling;
    }
    return t;
  }
  function yi(A, t, e, a, n, l) {
    var o = A.memoizedState;
    o === null ? A.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: e,
      tailMode: n,
      treeForkCount: l
    } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = a, o.tail = e, o.tailMode = n, o.treeForkCount = l);
  }
  function ko(A) {
    var t = A.child;
    for (A.child = null; t !== null; ) {
      var e = t.sibling;
      t.sibling = A.child, A.child = t, t = e;
    }
  }
  function Bo(A, t, e) {
    var a = t.pendingProps, n = a.revealOrder, l = a.tail;
    a = a.children;
    var o = vt.current;
    if (t.flags & 128)
      return Zl(t, o), null;
    var f = (o & 2) !== 0;
    if (f ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Zl(t, o), n === "backwards" && A !== null ? (ko(A), ot(A, t, a, e), ko(A)) : ot(A, t, a, e), a = vA ? wl : 0, !f && A !== null && (A.flags & 128) !== 0)
      A: for (A = t.child; A !== null; ) {
        if (A.tag === 13)
          A.memoizedState !== null && lm(A, e, t);
        else if (A.tag === 19)
          lm(A, e, t);
        else if (A.child !== null) {
          A.child.return = A, A = A.child;
          continue;
        }
        if (A === t) break A;
        for (; A.sibling === null; ) {
          if (A.return === null || A.return === t)
            break A;
          A = A.return;
        }
        A.sibling.return = A.return, A = A.sibling;
      }
    switch (n) {
      case "backwards":
        e = um(t.child), e === null ? (n = t.child, t.child = null) : (n = e.sibling, e.sibling = null, ko(t)), yi(
          t,
          !0,
          n,
          null,
          l,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (e = null, n = t.child, t.child = null; n !== null; ) {
          if (A = n.alternate, A !== null && ai(A) === null) {
            t.child = n;
            break;
          }
          A = n.sibling, n.sibling = e, e = n, n = A;
        }
        yi(
          t,
          !0,
          e,
          null,
          l,
          a
        );
        break;
      case "together":
        yi(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        e = um(t.child), e === null ? (n = t.child, t.child = null) : (n = e.sibling, e.sibling = null), yi(
          t,
          !1,
          n,
          e,
          l,
          a
        );
    }
    return t.child;
  }
  function im(A, t, e) {
    var a = t.pendingProps;
    return da(t, t.type, a.value), ot(A, t, a.children, e), t.child;
  }
  function Ie(A, t, e) {
    if (A !== null && (t.dependencies = A.dependencies), Ta |= t.lanes, (e & t.childLanes) === 0)
      if (A !== null) {
        if (Ia(
          A,
          t,
          e,
          !1
        ), (e & t.childLanes) === 0)
          return null;
      } else return null;
    if (A !== null && t.child !== A.child)
      throw Error(i(153));
    if (t.child !== null) {
      for (A = t.child, e = Ze(A, A.pendingProps), t.child = e, e.return = t; A.sibling !== null; )
        A = A.sibling, e = e.sibling = Ze(A, A.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function Yo(A, t) {
    return (A.lanes & t) !== 0 ? !0 : (A = A.dependencies, !!(A !== null && Xu(A)));
  }
  function hh(A, t, e) {
    switch (t.tag) {
      case 3:
        Ba(t, t.stateNode.containerInfo), da(t, nt, A.memoizedState.cache), La();
        break;
      case 27:
      case 5:
        pl(t);
        break;
      case 4:
        Ba(t, t.stateNode.containerInfo);
        break;
      case 10:
        da(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, co(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return va(t), t.flags |= 128, null;
          a = Ia(
            A,
            t,
            e,
            !1
          );
          var n = t.child.childLanes;
          return a || (e & n) !== 0 ? nm(A, t, e) : (va(t), A = Ie(
            A,
            t,
            e
          ), A !== null ? A.sibling : null);
        }
        va(t);
        break;
      case 19:
        if (t.flags & 128)
          return Bo(
            A,
            t,
            e
          );
        if (n = (A.flags & 128) !== 0, a = (e & t.childLanes) !== 0, a || (Ia(
          A,
          t,
          e,
          !1
        ), a = (e & t.childLanes) !== 0), n) {
          if (a)
            return Bo(
              A,
              t,
              e
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Zl(t, vt.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, _d(
          A,
          t,
          e,
          t.pendingProps
        );
      case 24:
        da(t, nt, A.memoizedState.cache);
    }
    return Ie(A, t, e);
  }
  function rm(A, t, e) {
    if (A !== null)
      if (A.memoizedProps !== t.pendingProps)
        ut = !0;
      else {
        if (!Yo(A, e) && (t.flags & 128) === 0)
          return ut = !1, hh(
            A,
            t,
            e
          );
        ut = (A.flags & 131072) !== 0;
      }
    else
      ut = !1, vA && (t.flags & 1048576) !== 0 && Bf(t, wl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        A: {
          var a = t.pendingProps;
          if (A = An(t.elementType), t.type = A, typeof A == "function")
            Jr(A) ? (a = nn(A, a), t.tag = 1, t = em(
              null,
              t,
              A,
              a,
              e
            )) : (t.tag = 0, t = Vo(
              null,
              t,
              A,
              a,
              e
            ));
          else {
            if (A != null) {
              var n = A.$$typeof;
              if (n === k) {
                t.tag = 11, t = Xd(
                  null,
                  t,
                  A,
                  a,
                  e
                );
                break A;
              } else if (n === dA) {
                t.tag = 14, t = Id(
                  null,
                  t,
                  A,
                  a,
                  e
                );
                break A;
              } else if (n === TA) {
                t.tag = 10, t.type = A, t = im(
                  null,
                  t,
                  e
                );
                break A;
              }
            }
            throw t = Q(A) || A, Error(i(306, t, ""));
          }
        }
        return t;
      case 0:
        return Vo(
          A,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, n = nn(
          a,
          t.pendingProps
        ), em(
          A,
          t,
          a,
          n,
          e
        );
      case 3:
        A: {
          if (Ba(
            t,
            t.stateNode.containerInfo
          ), A === null) throw Error(i(387));
          a = t.pendingProps;
          var l = t.memoizedState;
          n = l.element, lo(A, t), Fl(t, a, null, e);
          var o = t.memoizedState;
          if (a = o.cache, da(t, nt, a), a !== l.cache && $r(
            t,
            [nt],
            e,
            !0
          ), Gl(), a = o.element, l.isDehydrated)
            if (l = {
              element: a,
              isDehydrated: !1,
              cache: o.cache
            }, t.updateQueue.baseState = l, t.memoizedState = l, t.flags & 256) {
              t = am(
                A,
                t,
                a,
                e
              );
              break A;
            } else if (a !== n) {
              n = te(
                Error(i(424)),
                t
              ), Cl(n), t = am(
                A,
                t,
                a,
                e
              );
              break A;
            } else {
              switch (A = t.stateNode.containerInfo, A.nodeType) {
                case 9:
                  A = A.body;
                  break;
                default:
                  A = A.nodeName === "HTML" ? A.ownerDocument.body : A;
              }
              for (FA = ue(A.firstChild), ft = t, vA = !0, sa = null, ne = !0, e = _f(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 134221824, e = e.sibling;
            }
          else {
            if (La(), a === n) {
              t = Ie(
                A,
                t,
                e
              );
              break A;
            }
            ot(A, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Bn(A, t), A === null ? (e = V0(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : vA || (t.stateNode = f0(
          t.type,
          t.pendingProps,
          be.current,
          t
        )) : t.memoizedState = V0(
          t.type,
          A.memoizedProps,
          t.pendingProps,
          A.memoizedState
        ), null;
      case 27:
        return pl(t), A === null && vA && (a = t.stateNode = D0(
          t.type,
          t.pendingProps,
          be.current
        ), ft = t, ne = !0, n = FA, ja(t.type) ? (Cc = n, FA = ue(a.firstChild)) : FA = n), ot(
          A,
          t,
          t.pendingProps.children,
          e
        ), Bn(A, t), A === null && (t.flags |= 4194304), t.child;
      case 5:
        return A === null && vA && ((n = a = FA) && (a = f1(
          a,
          t.type,
          t.pendingProps,
          ne
        ), a !== null ? (t.stateNode = a, ft = t, FA = ue(a.firstChild), ne = !1, n = !0) : n = !1), n || fa(t)), pl(t), n = t.type, l = t.pendingProps, o = A !== null ? A.memoizedProps : null, a = l.children, zc(n, l) ? a = null : o !== null && zc(n, o) && (t.flags |= 32), t.memoizedState !== null && (n = mo(
          A,
          t,
          ih,
          null,
          null,
          e
        ), al._currentValue = n), Bn(A, t), ot(A, t, a, e), t.child;
      case 6:
        return A === null && vA && ((A = e = FA) && (e = d1(
          e,
          t.pendingProps,
          ne
        ), e !== null ? (t.stateNode = e, ft = t, FA = null, A = !0) : A = !1), A || fa(t)), null;
      case 13:
        return nm(A, t, e);
      case 4:
        return Ba(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, A === null ? t.child = en(
          t,
          null,
          a,
          e
        ) : ot(A, t, a, e), t.child;
      case 11:
        return Xd(
          A,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return a = t.pendingProps, Bn(A, t), ot(A, t, a, e), t.child;
      case 8:
        return ot(
          A,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return ot(
          A,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return im(A, t, e);
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Pa(t), n = yt(n), a = a(n), t.flags |= 1, ot(A, t, a, e), t.child;
      case 14:
        return Id(
          A,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return Pd(
          A,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return Bo(A, t, e);
      case 31:
        return gh(A, t, e);
      case 22:
        return _d(
          A,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return Pa(t), a = yt(nt), A === null ? (n = eo(), n === null && (n = YA, l = Ao(), n.pooledCache = l, l.refCount++, l !== null && (n.pooledCacheLanes |= e), n = l), t.memoizedState = { parent: a, cache: n }, no(t), da(t, nt, n)) : ((A.lanes & e) !== 0 && (lo(A, t), Fl(t, null, null, e), Gl()), n = A.memoizedState, l = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), da(t, nt, a)) : (a = l.cache, da(t, nt, a), a !== n.cache && $r(
          t,
          [nt],
          e,
          !0
        ))), ot(
          A,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= A === null ? 18882560 : 18874368 : vA && Ju(t), A !== null && A.memoizedProps.name !== a.name ? t.flags |= 4194816 : Bn(A, t), ot(A, t, a.children, e), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(i(156, t.tag));
  }
  function Pe(A) {
    A.flags |= 4;
  }
  function Ho(A, t, e, a, n) {
    var l;
    if ((l = (A.mode & 32) !== 0) && (l = e === null ? q0(t, a) : q0(t, a) && (a.src !== e.src || a.srcSet !== e.srcSet)), l) {
      if (A.flags |= 16777216, (n & 335544128) === n)
        if (A.stateNode.complete) A.flags |= 8192;
        else if (Fm()) A.flags |= 8192;
        else
          throw tn = $u, ao;
    } else A.flags &= -16777217;
  }
  function om(A, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      A.flags &= -16777217;
    else if (A.flags |= 16777216, !k0(t))
      if (Fm()) A.flags |= 8192;
      else
        throw tn = $u, ao;
  }
  function hi(A, t) {
    t !== null && (A.flags |= 4), A.flags & 16384 && (t = A.tag !== 22 ? Cs() : 536870912, A.lanes |= t, Zn |= t);
  }
  function Xl(A, t) {
    if (!vA)
      switch (A.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var e = A.tail, a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t || A.tail === null ? A.tail = null : A.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = A.tail, e = null; t !== null; )
            t.alternate !== null && (e = t), t = t.sibling;
          e === null ? A.tail = null : e.sibling = null;
      }
  }
  function ZA(A) {
    var t = A.alternate !== null && A.alternate.child === A.child, e = 0, a = 0;
    if (t)
      for (var n = A.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags & 1206910976, a |= n.flags & 1206910976, n.return = A, n = n.sibling;
    else
      for (n = A.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = A, n = n.sibling;
    return A.subtreeFlags |= a, A.childLanes = e, t;
  }
  function vh(A, t, e) {
    var a = t.pendingProps;
    switch (Xr(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ZA(t), null;
      case 1:
        return ZA(t), null;
      case 3:
        return e = t.stateNode, a = null, A !== null && (a = A.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), We(nt), Gt(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (A === null || A.child === null) && (En(t) ? Pe(t) : A === null || A.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Pr())), ZA(t), null;
      case 26:
        var n = t.type, l = t.memoizedState;
        return A === null ? (Pe(t), l !== null ? (ZA(t), om(t, l)) : (ZA(t), Ho(
          t,
          n,
          null,
          a,
          e
        ))) : l ? l !== A.memoizedState ? (Pe(t), ZA(t), om(t, l)) : (ZA(t), t.flags &= -16777217) : (A = A.memoizedProps, A !== a && Pe(t), ZA(t), Ho(
          t,
          n,
          A,
          a,
          e
        )), null;
      case 27:
        if (mn(t), e = be.current, n = t.type, A !== null && t.stateNode != null)
          A.memoizedProps !== a && Pe(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(i(166));
            return ZA(t), t.subtreeFlags &= -33554433, null;
          }
          A = tt.current, En(t) ? Hf(t) : (A = D0(n, a, e), t.stateNode = A, Pe(t));
        }
        return ZA(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (mn(t), n = t.type, A !== null && t.stateNode != null)
          A.memoizedProps !== a && Pe(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(i(166));
            return ZA(t), t.subtreeFlags &= -33554433, null;
          }
          if (l = tt.current, En(t))
            Hf(t);
          else {
            var o = uu(
              be.current
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
            l[gt] = t, l[Kt] = a;
            A: for (o = t.child; o !== null; ) {
              if (o.tag === 5 || o.tag === 6)
                l.appendChild(o.stateNode);
              else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                o.child.return = o, o = o.child;
                continue;
              }
              if (o === t) break A;
              for (; o.sibling === null; ) {
                if (o.return === null || o.return === t)
                  break A;
                o = o.return;
              }
              o.sibling.return = o.return, o = o.sibling;
            }
            t.stateNode = l;
            A: switch (St(l, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break A;
              case "img":
                a = !0;
                break A;
              default:
                a = !1;
            }
            a && Pe(t);
          }
        }
        return ZA(t), t.subtreeFlags &= -33554433, Ho(
          t,
          t.type,
          A === null ? null : A.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (A && t.stateNode != null)
          A.memoizedProps !== a && Pe(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(i(166));
          if (A = be.current, En(t)) {
            if (A = t.stateNode, e = t.memoizedProps, a = null, n = ft, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            A[gt] = t, A = !!(A.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || r0(A.nodeValue, e)), A || fa(t, !0);
          } else
            A = uu(A).createTextNode(
              a
            ), A[gt] = t, t.stateNode = A;
        }
        return ZA(t), null;
      case 31:
        if (e = t.memoizedState, A === null || A.memoizedState !== null) {
          if (a = En(t), e !== null) {
            if (A === null) {
              if (!a) throw Error(i(318));
              if (A = t.memoizedState, A = A !== null ? A.dehydrated : null, !A) throw Error(i(557));
              A[gt] = t;
            } else
              La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ZA(t), A = !1;
          } else
            e = Pr(), A !== null && A.memoizedState !== null && (A.memoizedState.hydrationErrors = e), A = !0;
          if (!A)
            return t.flags & 256 ? (Qt(t), t) : (Qt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(i(558));
        }
        return ZA(t), null;
      case 13:
        if (a = t.memoizedState, A === null || A.memoizedState !== null && A.memoizedState.dehydrated !== null) {
          if (n = En(t), a !== null && a.dehydrated !== null) {
            if (A === null) {
              if (!n) throw Error(i(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(i(317));
              n[gt] = t;
            } else
              La(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ZA(t), n = !1;
          } else
            n = Pr(), A !== null && A.memoizedState !== null && (A.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Qt(t), t) : (Qt(t), null);
        }
        return Qt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, A = A !== null && A.memoizedState !== null, e && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), l = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (l = a.memoizedState.cachePool.pool), l !== n && (a.flags |= 2048)), e !== A && e && (t.child.flags |= 8192), hi(t, t.updateQueue), ZA(t), null);
      case 4:
        return Gt(), A === null && Nc(t.stateNode.containerInfo), t.flags |= 67108864, ZA(t), null;
      case 10:
        return We(t.type), ZA(t), null;
      case 19:
        if (so(t), a = t.memoizedState, a === null) return ZA(t), null;
        if (n = (t.flags & 128) !== 0, l = a.rendering, l === null)
          if (n) Xl(a, !1);
          else {
            if ($A !== 0 || A !== null && (A.flags & 128) !== 0)
              for (A = t.child; A !== null; ) {
                if (l = ai(A), l !== null) {
                  for (t.flags |= 128, Xl(a, !1), A = l.updateQueue, t.updateQueue = A, hi(t, A), t.subtreeFlags = 0, A = e, e = t.child; e !== null; )
                    Cf(e, A), e = e.sibling;
                  return Zl(
                    t,
                    vt.current & 1 | 2
                  ), vA && Qe(t, a.treeForkCount), t.child;
                }
                A = A.sibling;
              }
            a.tail !== null && Ut() > Ri && (t.flags |= 128, n = !0, Xl(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (A = ai(l), A !== null) {
              if (t.flags |= 128, n = !0, A = A.updateQueue, t.updateQueue = A, hi(t, A), Xl(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !l.alternate && !vA)
                return ZA(t), null;
            } else
              2 * Ut() - a.renderingStartTime > Ri && e !== 536870912 && (t.flags |= 128, n = !0, Xl(a, !1), t.lanes = 4194304);
          a.isBackwards ? (l.sibling = t.child, t.child = l) : (A = a.last, A !== null ? A.sibling = l : t.child = l, a.last = l);
        }
        if (a.tail !== null) {
          A = a.tail;
          A: {
            for (e = A; e !== null; ) {
              if (e.alternate !== null) {
                e = !1;
                break A;
              }
              e = e.sibling;
            }
            e = !0;
          }
          return a.rendering = A, a.tail = A.sibling, a.renderingStartTime = Ut(), A.sibling = null, l = vt.current, l = n ? l & 1 | 2 : l & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !e || vA ? Zl(t, l) : (e = l, VA(ht, t), VA(vt, e), Tt === null && (Tt = t)), vA && Qe(t, a.treeForkCount), A;
        }
        return ZA(t), null;
      case 22:
      case 23:
        return Qt(t), oo(), a = t.memoizedState !== null, A !== null ? A.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (ZA(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ZA(t), e = t.updateQueue, e !== null && hi(t, e.retryQueue), e = null, A !== null && A.memoizedState !== null && A.memoizedState.cachePool !== null && (e = A.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), A !== null && XA($a), null;
      case 24:
        return e = null, A !== null && (e = A.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), We(nt), ZA(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, ZA(t), null;
    }
    throw Error(i(156, t.tag));
  }
  function bh(A, t) {
    switch (Xr(t), t.tag) {
      case 1:
        return A = t.flags, A & 65536 ? (t.flags = A & -65537 | 128, t) : null;
      case 3:
        return We(nt), Gt(), A = t.flags, (A & 65536) !== 0 && (A & 128) === 0 ? (t.flags = A & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return mn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Qt(t), t.alternate === null)
            throw Error(i(340));
          La();
        }
        return A = t.flags, A & 65536 ? (t.flags = A & -65537 | 128, t) : null;
      case 13:
        if (Qt(t), A = t.memoizedState, A !== null && A.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(i(340));
          La();
        }
        return A = t.flags, A & 65536 ? (t.flags = A & -65537 | 128, t) : null;
      case 19:
        return so(t), A = t.flags, A & 65536 ? (t.flags = A & -65537 | 128, A = t.memoizedState, A !== null && (A.rendering = null, A.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Gt(), null;
      case 10:
        return We(t.type), null;
      case 22:
      case 23:
        return Qt(t), oo(), A !== null && XA($a), A = t.flags, A & 65536 ? (t.flags = A & -65537 | 128, t) : null;
      case 24:
        return We(nt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function cm(A, t) {
    switch (Xr(t), t.tag) {
      case 3:
        We(nt), Gt();
        break;
      case 26:
      case 27:
      case 5:
        mn(t);
        break;
      case 4:
        Gt();
        break;
      case 31:
        t.memoizedState !== null && Qt(t);
        break;
      case 13:
        Qt(t);
        break;
      case 19:
        so(t);
        break;
      case 10:
        We(t.type);
        break;
      case 22:
      case 23:
        Qt(t), oo(), A !== null && XA($a);
        break;
      case 24:
        We(nt);
    }
  }
  function Il(A, t) {
    try {
      var e = t.updateQueue, a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        e = n;
        do {
          if ((e.tag & A) === A) {
            a = void 0;
            var l = e.create, o = e.inst;
            a = l(), o.destroy = a;
          }
          e = e.next;
        } while (e !== n);
      }
    } catch (f) {
      wA(t, t.return, f);
    }
  }
  function Sa(A, t, e) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var l = n.next;
        a = l;
        do {
          if ((a.tag & A) === A) {
            var o = a.inst, f = o.destroy;
            if (f !== void 0) {
              o.destroy = void 0, n = t;
              var g = e, T = f;
              try {
                T();
              } catch (E) {
                wA(
                  n,
                  g,
                  E
                );
              }
            }
          }
          a = a.next;
        } while (a !== l);
      }
    } catch (E) {
      wA(t, t.return, E);
    }
  }
  function sm(A) {
    var t = A.updateQueue;
    if (t !== null) {
      var e = A.stateNode;
      try {
        Ad(t, e);
      } catch (a) {
        wA(A, A.return, a);
      }
    }
  }
  function fm(A, t, e) {
    e.props = nn(
      A.type,
      A.memoizedProps
    ), e.state = A.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      wA(A, t, a);
    }
  }
  function Ue(A, t) {
    try {
      var e = A.ref;
      if (e !== null) {
        switch (A.tag) {
          case 26:
          case 27:
          case 5:
            var a = A.stateNode;
            break;
          case 30:
            var n = A.stateNode, l = Ge(A.memoizedProps, n);
            (n.ref === null || n.ref.name !== l) && (n.ref = v0(l)), a = n.ref;
            break;
          case 7:
            if (A.stateNode === null) {
              var o = new It(A);
              s(
                A.child,
                !1,
                c1,
                o,
                void 0,
                void 0
              ), A.stateNode = o;
            }
            a = A.stateNode;
            break;
          default:
            a = A.stateNode;
        }
        typeof e == "function" ? A.refCleanup = e(a) : e.current = a;
      }
    } catch (f) {
      wA(A, t, f);
    }
  }
  function bt(A, t) {
    var e = A.ref, a = A.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          wA(A, t, n);
        } finally {
          A.refCleanup = null, A = A.alternate, A != null && (A.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (n) {
          wA(A, t, n);
        }
      else e.current = null;
  }
  function vi(A, t) {
    if ((A.tag === 5 || A.tag === 27 || A.tag === 6) && A.alternate === null && t !== null)
      for (var e = 0; e < t.length; e++)
        U0(
          A.stateNode,
          t[e]
        );
  }
  function dm(A) {
    for (var t = A.return; t !== null && (Fo(t) && U0(A.stateNode, t.stateNode), !Go(t)); )
      t = t.return;
  }
  function Pl(A) {
    for (var t = A.return; t !== null && (Fo(t) && s1(A.stateNode, t.stateNode), !Go(t)); )
      t = t.return;
  }
  function Go(A) {
    return A.tag === 5 || A.tag === 3 || A.tag === 27;
  }
  function Fo(A) {
    return A && A.tag === 7 && A.stateNode !== null;
  }
  function Zo(A) {
    var t = A.type, e = A.memoizedProps, a = A.stateNode;
    try {
      A: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break A;
        case "img":
          e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (n) {
      wA(A, A.return, n);
    }
  }
  function Qo(A, t, e) {
    try {
      var a = A.stateNode;
      Jh(a, A.type, e, t), a[Kt] = t;
    } catch (n) {
      wA(A, A.return, n);
    }
  }
  function mm(A) {
    return A.tag === 5 || A.tag === 3 || A.tag === 26 || A.tag === 27 && ja(A.type) || A.tag === 4;
  }
  function Jo(A) {
    A: for (; ; ) {
      for (; A.sibling === null; ) {
        if (A.return === null || mm(A.return)) return null;
        A = A.return;
      }
      for (A.sibling.return = A.return, A = A.sibling; A.tag !== 5 && A.tag !== 6 && A.tag !== 18; ) {
        if (A.tag === 27 && ja(A.type) || A.flags & 2 || A.child === null || A.tag === 4) continue A;
        A.child.return = A, A = A.child;
      }
      if (!(A.flags & 2)) return A.stateNode;
    }
  }
  function Wo(A, t, e, a) {
    var n = A.tag;
    if (n === 5 || n === 6)
      n = A.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(n, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(n), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = Ne)), vi(A, a), DA = !0;
    else if (n !== 4 && (n === 27 && (vi(A, a), a = null, ja(A.type) && (e = A.stateNode, t = null)), A = A.child, A !== null))
      for (Wo(
        A,
        t,
        e,
        a
      ), A = A.sibling; A !== null; )
        Wo(
          A,
          t,
          e,
          a
        ), A = A.sibling;
  }
  function bi(A, t, e, a) {
    var n = A.tag;
    if (n === 5 || n === 6)
      n = A.stateNode, t ? e.insertBefore(n, t) : e.appendChild(n), vi(A, a), DA = !0;
    else if (n !== 4 && (n === 27 && (vi(A, a), a = null, ja(A.type) && (e = A.stateNode)), A = A.child, A !== null))
      for (bi(
        A,
        t,
        e,
        a
      ), A = A.sibling; A !== null; )
        bi(
          A,
          t,
          e,
          a
        ), A = A.sibling;
  }
  function pm(A) {
    var t = A.stateNode, e = A.memoizedProps;
    try {
      for (var a = A.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      St(t, a, e), t[gt] = A, t[Kt] = e;
    } catch (l) {
      wA(A, A.return, l);
    }
  }
  var Si = !1, Jt = null;
  function gm(A) {
    (A.tag === 30 || (A.subtreeFlags & 33554432) !== 0) && (Si = !0);
  }
  var Me = null;
  function ym() {
    var A = Me;
    return Me = null, A;
  }
  var Ct = 0;
  function Yn(A, t, e, a, n) {
    return Ct = 0, hm(
      A.child,
      t,
      e,
      a,
      n
    );
  }
  function hm(A, t, e, a, n) {
    for (var l = !1; A !== null; ) {
      if (A.tag === 5) {
        var o = A.stateNode;
        if (a !== null) {
          var f = Rc(o);
          a.push(f), f.view && (l = !0);
        } else
          l || Rc(o).view && (l = !0);
        Si = !0, y0(
          o,
          Ct === 0 ? t : t + "_" + Ct,
          e
        ), Ct++;
      } else (A.tag !== 22 || A.memoizedState === null) && (A.tag === 30 && n || hm(
        A.child,
        t,
        e,
        a,
        n
      ) && (l = !0));
      A = A.sibling;
    }
    return l;
  }
  function ze(A, t) {
    for (; A !== null; )
      A.tag === 5 ? h0(A.stateNode, A.memoizedProps) : (A.tag !== 22 || A.memoizedState === null) && (A.tag === 30 && t || ze(
        A.child,
        t
      )), A = A.sibling;
  }
  function Ni(A) {
    if ((A.subtreeFlags & 18874368) !== 0)
      for (A = A.child; A !== null; ) {
        if ((A.tag !== 22 || A.memoizedState === null) && (Ni(A), A.tag === 30 && (A.flags & 18874368) !== 0 && A.stateNode.paired)) {
          var t = A.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(i(544));
          var e = t.name;
          t = Fe(t.default, t.share), t !== "none" && (Yn(
            A,
            e,
            t,
            null,
            !1
          ) || ze(A.child, !1));
        }
        A = A.sibling;
      }
  }
  function Lo(A, t) {
    if (A.tag === 30) {
      var e = A.stateNode, a = A.memoizedProps, n = Ge(a, e), l = Fe(
        a.default,
        e.paired ? a.share : a.enter
      );
      l !== "none" ? Yn(A, n, l, null, !1) ? (Ni(A), e.paired || t || Ln(A, a.onEnter)) : ze(A.child, !1) : Ni(A);
    } else if ((A.subtreeFlags & 33554432) !== 0)
      for (A = A.child; A !== null; )
        Lo(A, t), A = A.sibling;
    else Ni(A);
  }
  function Xo(A) {
    if (Jt !== null && Jt.size !== 0) {
      var t = Jt;
      if ((A.subtreeFlags & 18874368) !== 0)
        for (A = A.child; A !== null; ) {
          if (A.tag !== 22 || A.memoizedState === null) {
            if (A.tag === 30 && (A.flags & 18874368) !== 0) {
              var e = A.memoizedProps, a = e.name;
              if (a != null && a !== "auto") {
                var n = t.get(a);
                if (n !== void 0) {
                  var l = Fe(
                    e.default,
                    e.share
                  );
                  if (l !== "none" && (Yn(
                    A,
                    a,
                    l,
                    null,
                    !1
                  ) ? (l = A.stateNode, n.paired = l, l.paired = n, Ln(A, e.onShare)) : ze(A.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Xo(A);
          }
          A = A.sibling;
        }
    }
  }
  function Io(A) {
    if (A.tag === 30) {
      var t = A.memoizedProps, e = Ge(t, A.stateNode), a = Jt !== null ? Jt.get(e) : void 0, n = Fe(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      n !== "none" && (Yn(A, e, n, null, !1) ? a !== void 0 ? (n = A.stateNode, a.paired = n, n.paired = a, Jt.delete(e), Ln(A, t.onShare)) : Ln(A, t.onExit) : ze(A.child, !1)), Jt !== null && Xo(A);
    } else if ((A.subtreeFlags & 33554432) !== 0)
      for (A = A.child; A !== null; )
        Io(A), A = A.sibling;
    else
      Jt !== null && Xo(A);
  }
  function vm(A) {
    for (A = A.child; A !== null; ) {
      if (A.tag === 30) {
        var t = A.memoizedProps, e = Ge(t, A.stateNode);
        t = Fe(t.default, t.update), A.flags &= -5, t !== "none" && Yn(
          A,
          e,
          t,
          A.memoizedState = [],
          !1
        );
      } else
        (A.subtreeFlags & 33554432) !== 0 && vm(A);
      A = A.sibling;
    }
  }
  function Po(A) {
    if ((A.subtreeFlags & 18874368) !== 0)
      for (A = A.child; A !== null; ) {
        if (A.tag !== 22 || A.memoizedState === null) {
          if (A.tag === 30 && (A.flags & 18874368) !== 0) {
            var t = A.stateNode;
            t.paired !== null && (t.paired = null, ze(A.child, !1));
          }
          Po(A);
        }
        A = A.sibling;
      }
  }
  function xi(A) {
    if (A.tag === 30)
      A.stateNode.paired = null, ze(A.child, !1), Po(A);
    else if ((A.subtreeFlags & 33554432) !== 0)
      for (A = A.child; A !== null; )
        xi(A), A = A.sibling;
    else Po(A);
  }
  function bm(A) {
    for (A = A.child; A !== null; )
      A.tag === 30 ? ze(A.child, !1) : (A.subtreeFlags & 33554432) !== 0 && bm(A), A = A.sibling;
  }
  function _o(A, t, e, a, n, l, o) {
    for (var f = !1; t !== null; ) {
      if (t.tag === 5) {
        var g = t.stateNode;
        if (l !== null && Ct < l.length) {
          var T = l[Ct], E = Rc(g);
          (T.view || E.view) && (f = !0);
          var K;
          if (K = (A.flags & 4) === 0)
            if (E.clip) K = !0;
            else {
              K = T.rect;
              var N = E.rect;
              K = K.y !== N.y || K.x !== N.x || K.height !== N.height || K.width !== N.width;
            }
          K && (A.flags |= 4), E.abs ? E = !T.abs : (T = T.rect, E = E.rect, E = T.height !== E.height || T.width !== E.width), E && (A.flags |= 32);
        } else A.flags |= 32;
        (A.flags & 4) !== 0 && y0(
          g,
          Ct === 0 ? e : e + "_" + Ct,
          n
        ), f && (A.flags & 4) !== 0 || (Me === null && (Me = []), Me.push(
          g,
          Ct === 0 ? a : a + "_" + Ct,
          t.memoizedProps
        )), Ct++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? A.flags |= t.flags & 32 : _o(
        A,
        t.child,
        e,
        a,
        n,
        l,
        o
      ) && (f = !0));
      t = t.sibling;
    }
    return f;
  }
  function Sm(A, t) {
    for (A = A.child; A !== null; ) {
      if (A.tag === 30) {
        var e = A.memoizedProps, a = A.stateNode, n = Ge(e, a), l = Fe(e.default, e.update), o;
        o = A.memoizedState, A.memoizedState = null, a = A;
        var f = A.child;
        Ct = 0, n = _o(
          a,
          f,
          n,
          n,
          l,
          o,
          !1
        ), (A.flags & 4) !== 0 && n && Ln(A, e.onUpdate);
      } else
        (A.subtreeFlags & 33554432) !== 0 && Sm(A);
      A = A.sibling;
    }
  }
  var dt = !1, EA = !1, je = !1, $o = !1, Nm = typeof WeakSet == "function" ? WeakSet : Set, mt = null, De = !1, _l = !1, Ti = !1, Ac = !1;
  function Sh(A, t, e) {
    if (A = A.containerInfo, Uc = nl, A = Mf(A), Br(A)) {
      if ("selectionStart" in A)
        var a = {
          start: A.selectionStart,
          end: A.selectionEnd
        };
      else
        A: {
          a = (a = A.ownerDocument) && a.defaultView || window;
          var n = a.getSelection && a.getSelection();
          if (n && n.rangeCount !== 0) {
            a = n.anchorNode;
            var l = n.anchorOffset, o = n.focusNode;
            n = n.focusOffset;
            try {
              a.nodeType, o.nodeType;
            } catch {
              a = null;
              break A;
            }
            var f = 0, g = -1, T = -1, E = 0, K = 0, N = A, R = null;
            t: for (; ; ) {
              for (var X; N !== a || l !== 0 && N.nodeType !== 3 || (g = f + l), N !== o || n !== 0 && N.nodeType !== 3 || (T = f + n), N.nodeType === 3 && (f += N.nodeValue.length), (X = N.firstChild) !== null; )
                R = N, N = X;
              for (; ; ) {
                if (N === A) break t;
                if (R === a && ++E === l && (g = f), R === o && ++K === n && (T = f), (X = N.nextSibling) !== null) break;
                N = R, R = N.parentNode;
              }
              N = X;
            }
            a = g === -1 || T === -1 ? null : { start: g, end: T };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Mc = { focusedElem: A, selectionRange: a }, nl = !1, e = (e & 335544064) === e, mt = t, t = e ? 9270 : 1024; mt !== null; ) {
      if (A = mt, e && (a = A.deletions, a !== null))
        for (l = 0; l < a.length; l++)
          e && Io(a[l]);
      if (A.alternate === null && (A.flags & 2) !== 0)
        e && gm(A), Ui(e);
      else {
        if (A.tag === 22) {
          if (a = A.alternate, A.memoizedState !== null) {
            a !== null && a.memoizedState === null && e && Io(a), Ui(e);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            e && gm(A), Ui(e);
            continue;
          }
        }
        a = A.child, (A.subtreeFlags & t) !== 0 && a !== null ? (a.return = A, mt = a) : (e && vm(A), Ui(e));
      }
    }
    Jt = null;
  }
  function Ui(A) {
    for (; mt !== null; ) {
      var t = mt, e = A, a = t.alternate, n = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((n & 1024) !== 0 && a !== null) {
            e = void 0, n = a.memoizedProps, a = a.memoizedState;
            var l = t.stateNode;
            try {
              var o = nn(
                t.type,
                n
              );
              e = l.getSnapshotBeforeUpdate(
                o,
                a
              ), l.__reactInternalSnapshotBeforeUpdate = e;
            } catch (f) {
              wA(t, t.return, f);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, e = a.nodeType, e === 9)
              Vc(a);
            else if (e === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Vc(a);
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
          e && a !== null && (e = Ge(
            a.memoizedProps,
            a.stateNode
          ), n = t.memoizedProps, n = Fe(n.default, n.update), n !== "none" && Yn(
            a,
            e,
            n,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((n & 1024) !== 0) throw Error(i(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, mt = a;
        break;
      }
      mt = t.return;
    }
  }
  function xm(A, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Re(A, e), a & 4 && Il(5, e);
        break;
      case 1:
        if (Re(A, e), a & 4)
          if (A = e.stateNode, t === null)
            try {
              A.componentDidMount();
            } catch (o) {
              wA(e, e.return, o);
            }
          else {
            var n = nn(
              e.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              A.componentDidUpdate(
                n,
                t,
                A.__reactInternalSnapshotBeforeUpdate
              );
            } catch (o) {
              wA(
                e,
                e.return,
                o
              );
            }
          }
        a & 64 && sm(e), a & 512 && Ue(e, e.return);
        break;
      case 3:
        if (Re(A, e), a & 64 && (A = e.updateQueue, A !== null)) {
          if (t = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            Ad(A, t);
          } catch (o) {
            wA(e, e.return, o);
          }
        }
        break;
      case 27:
        t === null && a & 4 && pm(e);
      case 26:
      case 5:
        Re(A, e), t === null && a & 4 && Zo(e), a & 512 && Ue(e, e.return);
        break;
      case 12:
        Re(A, e);
        break;
      case 31:
        Re(A, e), a & 4 && zm(A, e);
        break;
      case 13:
        Re(A, e), a & 4 && jm(A, e), a & 64 && (A = e.memoizedState, A !== null && (A = A.dehydrated, A !== null && (e = Vh.bind(
          null,
          e
        ), m1(A, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || dt, !a) {
          var l = t !== null && t.memoizedState !== null || EA;
          t = dt, n = EA, dt = a, (EA = l) && !n ? (a = 2, (e.subtreeFlags & 8772) !== 0 && (a |= 1), ge(
            A,
            e,
            a
          )) : Re(A, e), dt = t, EA = n;
        }
        break;
      case 30:
        Re(A, e), a & 512 && Ue(e, e.return);
        break;
      case 7:
        a & 512 && Ue(e, e.return);
      default:
        Re(A, e);
    }
  }
  function tc(A, t) {
    for (A = A.child; A !== null; )
      Tm(A, t), A = A.sibling;
  }
  function Tm(A, t) {
    switch (A.tag) {
      case 5:
      case 26:
        try {
          var e = A.stateNode;
          if (t) {
            var a = e.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var n = A.stateNode, l = A.memoizedProps.style, o = l != null && l.hasOwnProperty("display") ? l.display : null;
            n.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
          }
        } catch (g) {
          wA(A, A.return, g);
        }
        ec(A, t);
        break;
      case 6:
        try {
          A.stateNode.nodeValue = t ? "" : A.memoizedProps, DA = !0;
        } catch (g) {
          wA(A, A.return, g);
        }
        break;
      case 18:
        try {
          var f = A.stateNode;
          t ? g0(f, !0) : g0(A.stateNode, !1);
        } catch (g) {
          wA(A, A.return, g);
        }
        break;
      case 22:
      case 23:
        A.memoizedState === null && tc(A, t);
        break;
      default:
        tc(A, t);
    }
  }
  function ec(A, t) {
    if (A.subtreeFlags & 67108864)
      for (A = A.child; A !== null; ) {
        A: {
          var e = A, a = t;
          switch (e.tag) {
            case 4:
              Tm(e, a);
              break A;
            case 22:
              e.memoizedState === null && ec(e, a);
              break A;
            default:
              ec(e, a);
          }
        }
        A = A.sibling;
      }
  }
  function Um(A) {
    var t = A.alternate;
    t !== null && (A.alternate = null, Um(t)), A.child = null, A.deletions = null, A.sibling = null, A.tag === 5 && (t = A.stateNode, t !== null && Ru(t)), A.stateNode = null, A.return = null, A.dependencies = null, A.memoizedProps = null, A.memoizedState = null, A.pendingProps = null, A.stateNode = null, A.updateQueue = null;
  }
  var QA = null, qt = !1;
  function me(A, t, e) {
    for (e = e.child; e !== null; )
      Mm(A, t, e), e = e.sibling;
  }
  function Mm(A, t, e) {
    if (qA && typeof qA.onCommitFiberUnmount == "function")
      try {
        qA.onCommitFiberUnmount(PA, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        EA || bt(e, t), me(
          A,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && !EA && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        EA || bt(e, t), Pl(e);
        var a = QA, n = qt;
        ja(e.type) && (QA = e.stateNode, qt = !1), me(
          A,
          t,
          e
        ), R0(
          e.stateNode,
          e.type,
          e.memoizedProps
        ), QA = a, qt = n;
        break;
      case 5:
        EA || bt(e, t), Pl(e);
      case 6:
        if (e.tag === 6 && Pl(e), a = QA, n = qt, QA = null, me(
          A,
          t,
          e
        ), QA = a, qt = n, QA !== null)
          if (qt)
            try {
              (QA.nodeType === 9 ? QA.body : QA.nodeName === "HTML" ? QA.ownerDocument.body : QA).removeChild(e.stateNode), DA = !0;
            } catch (l) {
              wA(
                e,
                t,
                l
              );
            }
          else
            try {
              QA.removeChild(e.stateNode), DA = !0;
            } catch (l) {
              wA(
                e,
                t,
                l
              );
            }
        break;
      case 18:
        QA !== null && (qt ? (A = QA, p0(
          A.nodeType === 9 ? A.body : A.nodeName === "HTML" ? A.ownerDocument.body : A,
          e.stateNode
        ), ll(A)) : p0(QA, e.stateNode));
        break;
      case 4:
        a = QA, n = qt, QA = e.stateNode.containerInfo, qt = !0, me(
          A,
          t,
          e
        ), QA = a, qt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Sa(2, e, t), EA || Sa(4, e, t), me(
          A,
          t,
          e
        );
        break;
      case 1:
        EA || (bt(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && fm(
          e,
          t,
          a
        )), me(
          A,
          t,
          e
        );
        break;
      case 21:
        me(
          A,
          t,
          e
        );
        break;
      case 22:
        EA = (a = EA) || e.memoizedState !== null, me(
          A,
          t,
          e
        ), EA = a;
        break;
      case 30:
        bt(e, t), me(
          A,
          t,
          e
        );
        break;
      case 7:
        EA || bt(e, t), me(
          A,
          t,
          e
        );
        break;
      default:
        me(
          A,
          t,
          e
        );
    }
  }
  function zm(A, t) {
    if (t.memoizedState === null && (A = t.alternate, A !== null && (A = A.memoizedState, A !== null))) {
      A = A.dehydrated;
      try {
        ll(A);
      } catch (e) {
        wA(t, t.return, e);
      }
    }
  }
  function jm(A, t) {
    if (t.memoizedState === null && (A = t.alternate, A !== null && (A = A.memoizedState, A !== null && (A = A.dehydrated, A !== null))))
      try {
        ll(A);
      } catch (e) {
        wA(t, t.return, e);
      }
  }
  function Nh(A) {
    switch (A.tag) {
      case 31:
      case 13:
      case 19:
        var t = A.stateNode;
        return t === null && (t = A.stateNode = new Nm()), t;
      case 22:
        return A = A.stateNode, t = A._retryCache, t === null && (t = A._retryCache = new Nm()), t;
      default:
        throw Error(i(435, A.tag));
    }
  }
  function Mi(A, t) {
    var e = Nh(A);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var n = Kh.bind(null, A, a);
        a.then(n, n);
      }
    });
  }
  function Dt(A, t, e) {
    var a = t.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var l = a[n], o = A, f = t, g = f;
        A: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
              if (ja(g.type)) {
                QA = g.stateNode, qt = !1;
                break A;
              }
              break;
            case 5:
              QA = g.stateNode, qt = !1;
              break A;
            case 3:
            case 4:
              QA = g.stateNode.containerInfo, qt = !0;
              break A;
          }
          g = g.return;
        }
        if (QA === null) throw Error(i(160));
        Mm(o, f, l), QA = null, qt = !1, o = l.alternate, o !== null && (o.return = null), l.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Dm(t, A, e), t = t.sibling;
  }
  var pe = null;
  function Dm(A, t, e) {
    var a = A.alternate, n = A.flags;
    switch (A.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (n & 4 && (a = A.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var l = 0; l < a.length; l++) {
            var o = a[l];
            o.ref.impl = o.nextImpl;
          }
        Dt(t, A, e), Rt(A), n & 4 && (Sa(3, A, A.return), Il(3, A), Sa(5, A, A.return));
        break;
      case 1:
        Dt(t, A, e), Rt(A), n & 512 && (EA || a === null || bt(a, a.return)), n & 64 && dt && (A = A.updateQueue, A !== null && (t = A.callbacks, t !== null && (e = A.shared.hiddenCallbacks, A.shared.hiddenCallbacks = e === null ? t : e.concat(t))));
        break;
      case 26:
        if (l = pe, Dt(t, A, e), Rt(A), n & 512 && (EA || a === null || bt(a, a.return)), n & 4)
          if (n = a !== null ? a.memoizedState : null, e = A.memoizedState, a === null)
            if (e === null)
              if (A.stateNode === null)
                if (dt)
                  A.stateNode = f0(
                    A.type,
                    A.memoizedProps,
                    t.containerInfo,
                    A
                  );
                else {
                  A: {
                    t = A.type, e = A.memoizedProps, n = l.ownerDocument || l;
                    t: switch (t) {
                      case "title":
                        a = n.getElementsByTagName("title")[0], (!a || a[Tl] || a[gt] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = n.createElement(t), n.head.insertBefore(
                          a,
                          n.querySelector("head > title")
                        )), St(a, t, e), a[gt] = A, st(a), t = a;
                        break A;
                      case "link":
                        if (l = C0(
                          "link",
                          "href",
                          n
                        ).get(t + (e.href || ""))) {
                          for (o = 0; o < l.length; o++)
                            if (a = l[o], a.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && a.getAttribute("rel") === (e.rel == null ? null : e.rel) && a.getAttribute("title") === (e.title == null ? null : e.title) && a.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                              l.splice(o, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), St(a, t, e), n.head.appendChild(a);
                        break;
                      case "meta":
                        if (l = C0(
                          "meta",
                          "content",
                          n
                        ).get(t + (e.content || ""))) {
                          for (o = 0; o < l.length; o++)
                            if (a = l[o], a.getAttribute("content") === (e.content == null ? null : "" + e.content) && a.getAttribute("name") === (e.name == null ? null : e.name) && a.getAttribute("property") === (e.property == null ? null : e.property) && a.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && a.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                              l.splice(o, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), St(a, t, e), n.head.appendChild(a);
                        break;
                      default:
                        throw Error(i(468, t));
                    }
                    a[gt] = A, st(a), t = a;
                  }
                  A.stateNode = t;
                }
              else
                dt || Yc(l, A.type, A.stateNode);
            else
              A.stateNode = w0(
                l,
                e,
                A.memoizedProps
              );
          else
            n !== e ? (n === null ? (t = a.stateNode, t === null || EA || t.parentNode.removeChild(t)) : n.count--, e === null ? dt || Yc(l, A.type, A.stateNode) : w0(l, e, A.memoizedProps)) : e === null && A.stateNode !== null && Qo(
              A,
              A.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        Dt(t, A, e), Rt(A), n & 512 && (EA || a === null || bt(a, a.return)), a !== null && n & 4 && Qo(
          A,
          A.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (l = je, je = !1, Dt(t, A, e), je = l, Rt(A), n & 512 && (EA || a === null || bt(a, a.return)), A.flags & 32) {
          t = A.stateNode;
          try {
            Nn(t, ""), DA = !0;
          } catch (E) {
            wA(A, A.return, E);
          }
        }
        n & 4 && A.stateNode != null && (t = A.memoizedProps, Qo(
          A,
          t,
          a !== null ? a.memoizedProps : t
        )), n & 1024 && ($o = !0);
        break;
      case 6:
        if (Dt(t, A, e), Rt(A), n & 4) {
          if (A.stateNode === null)
            throw Error(i(162));
          t = A.memoizedProps, e = A.stateNode;
          try {
            e.nodeValue = t, DA = !0;
          } catch (E) {
            wA(A, A.return, E);
          }
        }
        break;
      case 3:
        if (DA = !1, Hi = null, l = pe, pe = iu(t.containerInfo), Dt(t, A, e), pe = l, Rt(A), n & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            ll(t.containerInfo);
          } catch (E) {
            wA(A, A.return, E);
          }
        $o && ($o = !1, Rm(A)), DA = !1;
        break;
      case 4:
        n = je, je = dt, a = Xs(), l = pe, pe = iu(
          A.stateNode.containerInfo
        ), Dt(t, A, e), Rt(A), pe = l, DA && _l && (Ti = !0), DA = a, je = n;
        break;
      case 12:
        Dt(t, A, e), Rt(A);
        break;
      case 31:
        Dt(t, A, e), Rt(A), n & 4 && (t = A.updateQueue, t !== null && (A.updateQueue = null, Mi(A, t)));
        break;
      case 13:
        Dt(t, A, e), Rt(A), A.child.flags & 8192 && A.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Di = Ut()), n & 4 && (t = A.updateQueue, t !== null && (A.updateQueue = null, Mi(A, t)));
        break;
      case 22:
        l = A.memoizedState !== null, o = a !== null && a.memoizedState !== null;
        var f = dt, g = EA, T = je;
        dt = f || l, je = T || l, EA = g || o, Dt(t, A, e), EA = g, je = T, dt = f, Rt(A), n & 8192 && (t = A.stateNode, t._visibility = l ? t._visibility & -2 : t._visibility | 1, !l || a === null || o || dt || EA || (t = o || EA, e = dt, a = EA, dt = l || dt, EA = t, Na(A, 2), dt = e, EA = a), !l && je || tc(A, l)), n & 4 && (t = A.updateQueue, t !== null && (e = t.retryQueue, e !== null && (t.retryQueue = null, Mi(A, e))));
        break;
      case 19:
        Dt(t, A, e), Rt(A), n & 4 && (t = A.updateQueue, t !== null && (A.updateQueue = null, Mi(A, t)));
        break;
      case 30:
        n & 512 && (EA || a === null || bt(a, a.return)), n = Xs(), l = _l, o = (e & 335544064) === e, f = A.memoizedProps, _l = o && Fe(
          f.default,
          f.update
        ) !== "none", Dt(t, A, e), Rt(A), o && a !== null && DA && (A.flags |= 4), _l = l, DA = n;
        break;
      case 21:
        break;
      case 7:
        n & 512 && (EA || a === null || bt(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = A);
      default:
        Dt(t, A, e), Rt(A);
    }
  }
  function Rt(A) {
    var t = A.flags;
    if (t & 2) {
      try {
        for (var e, a = A.return; a !== null; ) {
          if (mm(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = A.return; n !== null; ) {
          if (Fo(n)) {
            var l = n.stateNode;
            a === null ? a = [l] : a.push(l);
          }
          if (Go(n)) break;
          n = n.return;
        }
        var o = a;
        if (e == null) throw Error(i(160));
        switch (e.tag) {
          case 27:
            var f = e.stateNode, g = Jo(A);
            bi(
              A,
              g,
              f,
              o
            );
            break;
          case 5:
            var T = e.stateNode;
            e.flags & 32 && (Nn(T, ""), e.flags &= -33);
            var E = Jo(A);
            bi(
              A,
              E,
              T,
              o
            );
            break;
          case 3:
          case 4:
            var K = e.stateNode.containerInfo, N = Jo(A);
            Wo(
              A,
              N,
              K,
              o
            );
            break;
          default:
            throw Error(i(161));
        }
      } catch (R) {
        wA(A, A.return, R);
      }
      A.flags &= -3;
    }
    t & 4096 && (A.flags &= -4097);
  }
  function Rm(A) {
    if (A.subtreeFlags & 1024)
      for (A = A.child; A !== null; ) {
        var t = A;
        Rm(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, nl = !0, t.reset(), nl = !1), A = A.sibling;
      }
  }
  function Hn(A, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Om(t, A), t = t.sibling;
    else Sm(t);
  }
  function Om(A, t) {
    var e = A.alternate;
    if (e === null) Lo(A, !1);
    else
      switch (A.tag) {
        case 3:
          if (Ac = De = !1, ym(), Hn(t, A), !De && !Ti) {
            if (A = Me, A !== null)
              for (var a = 0; a < A.length; a += 3) {
                e = A[a];
                var n = A[a + 1];
                h0(e, A[a + 2]), e = e.ownerDocument.documentElement, e !== null && e.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + n + ")"
                  }
                );
              }
            A = t.containerInfo, A = A.nodeType === 9 ? A.documentElement : A.ownerDocument.documentElement, A !== null && A.style.viewTransitionName === "" && (A.style.viewTransitionName = "none", A.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), A.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Ac = !0;
          }
          Me = null;
          break;
        case 5:
          Hn(t, A);
          break;
        case 4:
          a = De, De = !1, Hn(t, A), De && (Ti = !0), De = a;
          break;
        case 22:
          A.memoizedState === null && (e.memoizedState !== null ? Lo(A, !1) : Hn(t, A));
          break;
        case 30:
          a = De, n = ym(), De = !1, Hn(t, A), De && (A.flags |= 4);
          var l = A.memoizedProps, o = A.stateNode;
          t = Ge(l, o), o = Ge(e.memoizedProps, o);
          var f = Fe(l.default, l.update);
          f === "none" ? t = !1 : (l = e.memoizedState, e.memoizedState = null, e = A.child, Ct = 0, t = _o(
            A,
            e,
            t,
            o,
            f,
            l,
            !0
          ), Ct !== (l === null ? 0 : l.length) && (A.flags |= 32)), (A.flags & 4) !== 0 && t ? (Ln(
            A,
            A.memoizedProps.onUpdate
          ), Me = n) : n !== null && (n.push.apply(n, Me), Me = n), De = (A.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          Hn(t, A);
      }
  }
  function Re(A, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        xm(A, t.alternate, t), t = t.sibling;
  }
  function Na(A, t) {
    for (A = A.child; A !== null; ) {
      var e = A, a = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Sa(4, e, e.return), Na(
            e,
            a
          );
          break;
        case 1:
          bt(e, e.return);
          var n = e.stateNode;
          typeof n.componentWillUnmount == "function" && fm(
            e,
            e.return,
            n
          ), Na(
            e,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && R0(
            e.stateNode,
            e.type,
            e.memoizedProps
          );
        case 5:
          bt(e, e.return), e.tag !== 5 && e.tag !== 27 || Pl(e), Na(
            e,
            a
          );
          break;
        case 6:
          Pl(e);
          break;
        case 26:
          bt(e, e.return), n = e.stateNode, e.memoizedState !== null || n === null || EA || n.parentNode.removeChild(n), Na(
            e,
            a
          );
          break;
        case 22:
          e.memoizedState === null && Na(
            e,
            a
          );
          break;
        case 30:
          bt(e, e.return), Na(
            e,
            a
          );
          break;
        case 7:
          bt(e, e.return);
        default:
          Na(
            e,
            a
          );
      }
      A = A.sibling;
    }
  }
  function ge(A, t, e) {
    for (e = (t.subtreeFlags & 8772) !== 0 ? e : e & -2, t = t.child; t !== null; ) {
      var a = t.alternate, n = A, l = t, o = l.flags, f = (e & 1) !== 0;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ge(
            n,
            l,
            e
          ), Il(4, l);
          break;
        case 1:
          if (ge(
            n,
            l,
            e
          ), a = l, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (E) {
              wA(a, a.return, E);
            }
          if (a = l, n = a.updateQueue, n !== null) {
            var g = a.stateNode;
            try {
              var T = n.shared.hiddenCallbacks;
              if (T !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < T.length; n++)
                  $f(T[n], g);
            } catch (E) {
              wA(a, a.return, E);
            }
          }
          f && o & 64 && sm(l), Ue(l, l.return);
          break;
        case 27:
          (e & 2) !== 0 && pm(l);
        case 5:
          l.tag !== 5 && l.tag !== 27 || dm(l), ge(
            n,
            l,
            e
          ), f && a === null && o & 4 && Zo(l), Ue(l, l.return);
          break;
        case 6:
          dm(l);
          break;
        case 26:
          g = l.stateNode, l.memoizedState !== null || g === null || dt || Yc(
            iu(g.ownerDocument),
            l.type,
            g
          ), ge(
            n,
            l,
            e
          ), f && a === null && o & 4 && Zo(l), Ue(l, l.return);
          break;
        case 12:
          ge(
            n,
            l,
            e
          );
          break;
        case 31:
          ge(
            n,
            l,
            e
          ), f && o & 4 && zm(n, l);
          break;
        case 13:
          ge(
            n,
            l,
            e
          ), f && o & 4 && jm(n, l);
          break;
        case 22:
          l.memoizedState === null && ge(
            n,
            l,
            e
          ), Ue(l, l.return);
          break;
        case 30:
          ge(
            n,
            l,
            e
          ), Ue(l, l.return);
          break;
        case 7:
          Ue(l, l.return);
        default:
          ge(
            n,
            l,
            e
          );
      }
      t = t.sibling;
    }
  }
  function ac(A, t) {
    var e = null;
    A !== null && A.memoizedState !== null && A.memoizedState.cachePool !== null && (e = A.memoizedState.cachePool.pool), A = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (A = t.memoizedState.cachePool.pool), A !== e && (A != null && A.refCount++, e != null && ql(e));
  }
  function nc(A, t) {
    A = null, t.alternate !== null && (A = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== A && (t.refCount++, A != null && ql(A));
  }
  function le(A, t, e, a) {
    var n = (e & 335544064) === e;
    if (t.subtreeFlags & (n ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Em(
          A,
          t,
          e,
          a
        ), t = t.sibling;
    else n && bm(t);
  }
  function Em(A, t, e, a) {
    var n = (e & 335544064) === e;
    n && t.alternate === null && t.return !== null && t.return.alternate !== null && xi(t);
    var l = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        le(
          A,
          t,
          e,
          a
        ), l & 2048 && Il(9, t);
        break;
      case 1:
        le(
          A,
          t,
          e,
          a
        );
        break;
      case 3:
        le(
          A,
          t,
          e,
          a
        ), n && Ac && (A = A.containerInfo, A = A.nodeType === 9 ? A.body : A.nodeName === "HTML" ? A.ownerDocument.body : A, A.style.viewTransitionName === "root" && (A.style.viewTransitionName = ""), A = A.ownerDocument.documentElement, A !== null && A.style.viewTransitionName === "none" && (A.style.viewTransitionName = "")), l & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && ql(l)));
        break;
      case 12:
        if (l & 2048) {
          le(
            A,
            t,
            e,
            a
          ), l = t.stateNode;
          try {
            var o = t.memoizedProps, f = o.id, g = o.onPostCommit;
            typeof g == "function" && g(
              f,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (T) {
            wA(t, t.return, T);
          }
        } else
          le(
            A,
            t,
            e,
            a
          );
        break;
      case 31:
        le(
          A,
          t,
          e,
          a
        );
        break;
      case 13:
        le(
          A,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        o = t.stateNode, f = t.alternate, t.memoizedState !== null ? (n && f !== null && f.memoizedState === null && xi(f), o._visibility & 2 ? le(
          A,
          t,
          e,
          a
        ) : $l(
          A,
          t
        )) : (n && f !== null && f.memoizedState !== null && xi(t), o._visibility & 2 ? le(
          A,
          t,
          e,
          a
        ) : (o._visibility |= 2, Gn(
          A,
          t,
          e,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), l & 2048 && ac(f, t);
        break;
      case 24:
        le(
          A,
          t,
          e,
          a
        ), l & 2048 && nc(t.alternate, t);
        break;
      case 30:
        n && (l = t.alternate, l !== null && (ze(l.child, !0), ze(t.child, !0))), le(
          A,
          t,
          e,
          a
        );
        break;
      default:
        le(
          A,
          t,
          e,
          a
        );
    }
  }
  function Gn(A, t, e, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var l = A, o = t, f = e, g = a, T = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          Gn(
            l,
            o,
            f,
            g,
            n
          ), Il(8, o);
          break;
        case 23:
          break;
        case 22:
          var E = o.stateNode;
          o.memoizedState !== null ? E._visibility & 2 ? Gn(
            l,
            o,
            f,
            g,
            n
          ) : $l(
            l,
            o
          ) : (E._visibility |= 2, Gn(
            l,
            o,
            f,
            g,
            n
          )), n && T & 2048 && ac(
            o.alternate,
            o
          );
          break;
        case 24:
          Gn(
            l,
            o,
            f,
            g,
            n
          ), n && T & 2048 && nc(o.alternate, o);
          break;
        default:
          Gn(
            l,
            o,
            f,
            g,
            n
          );
      }
      t = t.sibling;
    }
  }
  function $l(A, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = A, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            $l(e, a), n & 2048 && ac(
              a.alternate,
              a
            );
            break;
          case 24:
            $l(e, a), n & 2048 && nc(a.alternate, a);
            break;
          default:
            $l(e, a);
        }
        t = t.sibling;
      }
  }
  var ln = 8192;
  function un(A, t, e) {
    if (A.subtreeFlags & ln)
      for (A = A.child; A !== null; )
        Vm(
          A,
          t,
          e
        ), A = A.sibling;
  }
  function Vm(A, t, e) {
    switch (A.tag) {
      case 26:
        un(
          A,
          t,
          e
        ), A.flags & ln && (A.memoizedState !== null ? j1(
          e,
          pe,
          A.memoizedState,
          A.memoizedProps
        ) : (A = A.stateNode, (t & 335544128) === t && Y0(e, A)));
        break;
      case 5:
        un(
          A,
          t,
          e
        ), A.flags & ln && (A = A.stateNode, (t & 335544128) === t && Y0(e, A));
        break;
      case 3:
      case 4:
        var a = pe;
        pe = iu(A.stateNode.containerInfo), un(
          A,
          t,
          e
        ), pe = a;
        break;
      case 22:
        A.memoizedState === null && (a = A.alternate, a !== null && a.memoizedState !== null ? (a = ln, ln = 16777216, un(
          A,
          t,
          e
        ), ln = a) : un(
          A,
          t,
          e
        ));
        break;
      case 30:
        if ((A.flags & ln) !== 0 && (a = A.memoizedProps.name, a != null && a !== "auto")) {
          var n = A.stateNode;
          n.paired = null, Jt === null && (Jt = /* @__PURE__ */ new Map()), Jt.set(a, n);
        }
        un(
          A,
          t,
          e
        );
        break;
      default:
        un(
          A,
          t,
          e
        );
    }
  }
  function Km(A) {
    var t = A.alternate;
    if (t !== null && (A = t.child, A !== null)) {
      t.child = null;
      do
        t = A.sibling, A.sibling = null, A = t;
      while (A !== null);
    }
  }
  function Au(A) {
    var t = A.deletions;
    if ((A.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          mt = a, Cm(
            a,
            A
          );
        }
      Km(A);
    }
    if (A.subtreeFlags & 10256)
      for (A = A.child; A !== null; )
        wm(A), A = A.sibling;
  }
  function wm(A) {
    switch (A.tag) {
      case 0:
      case 11:
      case 15:
        Au(A), A.flags & 2048 && Sa(9, A, A.return);
        break;
      case 3:
        Au(A);
        break;
      case 12:
        Au(A);
        break;
      case 22:
        var t = A.stateNode;
        A.memoizedState !== null && t._visibility & 2 && (A.return === null || A.return.tag !== 13) ? (t._visibility &= -3, zi(A)) : Au(A);
        break;
      default:
        Au(A);
    }
  }
  function zi(A) {
    var t = A.deletions;
    if ((A.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          mt = a, Cm(
            a,
            A
          );
        }
      Km(A);
    }
    for (A = A.child; A !== null; ) {
      switch (t = A, t.tag) {
        case 0:
        case 11:
        case 15:
          Sa(8, t, t.return), zi(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, zi(t));
          break;
        default:
          zi(t);
      }
      A = A.sibling;
    }
  }
  function Cm(A, t) {
    for (; mt !== null; ) {
      var e = mt;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Sa(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          ql(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, mt = a;
      else
        A: for (e = A; mt !== null; ) {
          a = mt;
          var n = a.sibling, l = a.return;
          if (Um(a), a === e) {
            mt = null;
            break A;
          }
          if (n !== null) {
            n.return = l, mt = n;
            break A;
          }
          mt = l;
        }
    }
  }
  var xh = {
    getCacheForType: function(A) {
      var t = yt(nt), e = t.data.get(A);
      return e === void 0 && (e = A(), t.data.set(A, e)), e;
    },
    cacheSignal: function() {
      return yt(nt).controller.signal;
    }
  }, Th = typeof WeakMap == "function" ? WeakMap : Map, OA = 0, YA = null, SA = null, UA = 0, KA = 0, Wt = null, xa = !1, Fn = !1, lc = !1, _e = 0, $A = 0, Ta = 0, rn = 0, ji = 0, Lt = 0, Zn = 0, tu = null, kt = null, uc = !1, Di = 0, qm = 0, Ri = 1 / 0, Oi = null, Ua = null, IA = 0, ye = null, on = null, Oe = 0, ic = 0, rc = null, km = null, Qn = null, Jn = null, Wn = null, eu = 0, Ei = null;
  function Xt() {
    return (OA & 2) !== 0 && UA !== 0 ? UA & -UA : L.T !== null ? hc() : Ys();
  }
  function Bm() {
    if (Lt === 0)
      if ((UA & 536870912) === 0 || vA) {
        var A = ia;
        ia <<= 1, (ia & 3932160) === 0 && (ia = 262144), Lt = A;
      } else Lt = 536870912;
    return A = ht.current, A !== null && (A.flags |= 32), Lt;
  }
  function Ln(A, t) {
    if (t != null) {
      var e = A.stateNode, a = e.ref;
      a === null && (a = e.ref = v0(
        Ge(A.memoizedProps, e)
      )), Jn === null && (Jn = []), Jn.push(t.bind(null, a));
    }
  }
  function Bt(A, t, e) {
    (A === YA && (KA === 2 || KA === 9) || A.cancelPendingCommit !== null) && (Xn(A, 0), Ma(
      A,
      UA,
      Lt,
      !1
    )), xl(A, e), ((OA & 2) === 0 || A !== YA) && (A === YA && ((OA & 2) === 0 && (rn |= e), $A === 4 && Ma(
      A,
      UA,
      Lt,
      !1
    )), Ee(A));
  }
  function Ym(A, t, e) {
    if ((OA & 6) !== 0) throw Error(i(327));
    var a = !e && (t & 127) === 0 && (t & A.expiredLanes) === 0 || Nl(A, t), n = a ? zh(A, t) : cc(A, t, !0), l = a;
    do {
      if (n === 0) {
        Fn && !a && Ma(A, t, 0, !1);
        break;
      } else {
        if (e = A.current.alternate, l && !Uh(e)) {
          n = cc(A, t, !1), l = !1;
          continue;
        }
        if (n === 2) {
          if (l = t, A.errorRecoveryDisabledLanes & l)
            var o = 0;
          else
            o = A.pendingLanes & -536870913, o = o !== 0 ? o : o & 536870912 ? 536870912 : 0;
          if (o !== 0) {
            t = o;
            A: {
              var f = A;
              n = tu;
              var g = f.current.memoizedState.isDehydrated;
              if (g && (Xn(f, o).flags |= 256), o = cc(
                f,
                o,
                !1
              ), o !== 2 && o !== 6) {
                if (lc && !g) {
                  f.errorRecoveryDisabledLanes |= l, rn |= l, n = 4;
                  break A;
                }
                l = kt, kt = n, l !== null && (kt === null ? kt = l : kt.push.apply(
                  kt,
                  l
                ));
              }
              n = o;
            }
            if (l = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Xn(A, 0), Ma(A, t, 0, !0);
          break;
        }
        A: {
          switch (a = A, l = n, l) {
            case 0:
            case 1:
              throw Error(i(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              Ma(
                a,
                t,
                Lt,
                !xa
              );
              break A;
            case 2:
              kt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(i(329));
          }
          if ((t & 62914560) === t && (n = Di + 300 - Ut(), 10 < n)) {
            if (Ma(
              a,
              t,
              Lt,
              !xa
            ), ju(a, 0, !0) !== 0) break A;
            Oe = t, a.timeoutHandle = Dc(
              Hm.bind(
                null,
                a,
                e,
                kt,
                Oi,
                uc,
                t,
                Lt,
                rn,
                Zn,
                xa,
                l,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break A;
          }
          Hm(
            a,
            e,
            kt,
            Oi,
            uc,
            t,
            Lt,
            rn,
            Zn,
            xa,
            l,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ee(A);
  }
  function Hm(A, t, e, a, n, l, o, f, g, T, E, K, N, R) {
    A.timeoutHandle = -1;
    var X = t.subtreeFlags, nA = (l & 335544064) === l;
    if (K = null, (nA || X & 8192 || (X & 16785408) === 16785408) && (K = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Ne
    }, Jt = null, Vm(
      t,
      l,
      K
    ), nA && (X = K, nA = A.containerInfo, nA = (nA.nodeType === 9 ? nA : nA.ownerDocument).__reactViewTransition, nA != null && (X.count++, X.waitingForViewTransition = !0, X = cu.bind(X), nA.finished.then(X, X))), X = (l & 62914560) === l ? Di - Ut() : (l & 4194048) === l ? qm - Ut() : 0, X = D1(
      K,
      X
    ), X !== null)) {
      Oe = l, A.cancelPendingCommit = X(
        Xm.bind(
          null,
          A,
          t,
          l,
          e,
          a,
          n,
          o,
          f,
          g,
          T,
          E,
          K,
          null,
          N,
          R
        )
      ), Ma(A, l, o, !T);
      return;
    }
    Xm(
      A,
      t,
      l,
      e,
      a,
      n,
      o,
      f,
      g,
      T,
      E,
      K
    );
  }
  function Uh(A) {
    for (var t = A; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var n = e[a], l = n.getSnapshot;
          n = n.value;
          try {
            if (!Zt(l(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = t.child, t.subtreeFlags & 16384 && e !== null)
        e.return = t, t = e;
      else {
        if (t === A) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === A) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Ma(A, t, e, a) {
    t = ws(A, t), t &= ~ji, t &= ~rn, A.suspendedLanes |= t, A.pingedLanes &= ~t, a && (A.warmLanes |= t), a = A.expirationTimes;
    for (var n = t; 0 < n; ) {
      var l = 31 - RA(n), o = 1 << l;
      a[l] = -1, n &= ~o;
    }
    e !== 0 && qs(A, e, t);
  }
  function Vi() {
    return (OA & 6) === 0 ? (au(0), !1) : !0;
  }
  function oc() {
    if (SA !== null) {
      if (KA === 0)
        var A = SA.return;
      else
        A = SA, Je = Xa = null, yo(A), wn = null, Yl = 0, A = SA;
      for (; A !== null; )
        cm(A.alternate, A), A = A.return;
      SA = null;
    }
  }
  function Xn(A, t) {
    var e = A.timeoutHandle;
    return e !== -1 && (A.timeoutHandle = -1, Xh(e)), e = A.cancelPendingCommit, e !== null && (A.cancelPendingCommit = null, e()), Oe = 0, oc(), YA = A, SA = e = Ze(A.current, null), UA = t, KA = 0, Wt = null, xa = !1, Fn = Nl(A, t), lc = !1, Zn = Lt = ji = rn = Ta = $A = 0, kt = tu = null, uc = !1, _e = ws(A, t), Hu(), e;
  }
  function Gm(A, t) {
    yA = null, L.H = fi, t === Kn || t === _u ? (t = Xf(), KA = 3) : t === ao ? (t = Xf(), KA = 4) : KA = t === Eo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Wt = t, SA === null && ($A = 1, di(
      A,
      te(t, A.current)
    ));
  }
  function Fm() {
    var A = ht.current;
    return A === null ? !0 : (UA & 4194048) === UA ? Tt === null : (UA & 62914560) === UA || (UA & 536870912) !== 0 ? A === Tt : !1;
  }
  function Zm() {
    var A = L.H;
    return L.H = fi, A === null ? fi : A;
  }
  function Qm() {
    var A = L.A;
    return L.A = xh, A;
  }
  function Ki() {
    $A = 4, xa || (UA & 4194048) !== UA && ht.current !== null || (Fn = !0), (Ta & 134217727) === 0 && (rn & 134217727) === 0 || YA === null || Ma(
      YA,
      UA,
      Lt,
      !1
    );
  }
  function cc(A, t, e) {
    var a = OA;
    OA |= 2;
    var n = Zm(), l = Qm();
    (YA !== A || UA !== t) && (Oi = null, Xn(A, t)), t = !1;
    var o = $A;
    A: do
      try {
        if (KA !== 0 && SA !== null) {
          var f = SA, g = Wt;
          switch (KA) {
            case 8:
              oc(), o = 6;
              break A;
            case 3:
            case 2:
            case 9:
            case 6:
              ht.current === null && (t = !0);
              var T = KA;
              if (KA = 0, Wt = null, In(A, f, g, T), e && Fn) {
                o = 0;
                break A;
              }
              break;
            default:
              T = KA, KA = 0, Wt = null, In(A, f, g, T);
          }
        }
        Mh(), o = $A;
        break;
      } catch (E) {
        Gm(A, E);
      }
    while (!0);
    return t && A.shellSuspendCounter++, Je = Xa = null, OA = a, L.H = n, L.A = l, SA === null && (YA = null, UA = 0, Hu()), o;
  }
  function Mh() {
    for (; SA !== null; ) Jm(SA);
  }
  function zh(A, t) {
    var e = OA;
    OA |= 2;
    var a = Zm(), n = Qm();
    YA !== A || UA !== t ? (Oi = null, Ri = Ut() + 500, Xn(A, t)) : Fn = Nl(
      A,
      t
    );
    A: do
      try {
        if (KA !== 0 && SA !== null) {
          t = SA;
          var l = Wt;
          t: switch (KA) {
            case 1:
              KA = 0, Wt = null, In(A, t, l, 1);
              break;
            case 2:
            case 9:
              if (Wf(l)) {
                KA = 0, Wt = null, Wm(t);
                break;
              }
              t = function() {
                KA !== 2 && KA !== 9 || YA !== A || (KA = 7), Ee(A);
              }, l.then(t, t);
              break A;
            case 3:
              KA = 7;
              break A;
            case 4:
              KA = 5;
              break A;
            case 7:
              Wf(l) ? (KA = 0, Wt = null, Wm(t)) : (KA = 0, Wt = null, In(A, t, l, 7));
              break;
            case 5:
              var o = null;
              switch (SA.tag) {
                case 26:
                  o = SA.memoizedState;
                case 5:
                case 27:
                  var f = SA;
                  if (o ? k0(o) : f.stateNode.complete) {
                    KA = 0, Wt = null;
                    var g = f.sibling;
                    if (g !== null) SA = g;
                    else {
                      var T = f.return;
                      T !== null ? (SA = T, wi(T)) : SA = null;
                    }
                    break t;
                  }
              }
              KA = 0, Wt = null, In(A, t, l, 5);
              break;
            case 6:
              KA = 0, Wt = null, In(A, t, l, 6);
              break;
            case 8:
              oc(), $A = 6;
              break A;
            default:
              throw Error(i(462));
          }
        }
        jh();
        break;
      } catch (E) {
        Gm(A, E);
      }
    while (!0);
    return Je = Xa = null, L.H = a, L.A = n, OA = e, SA !== null ? 0 : (YA = null, UA = 0, Hu(), $A);
  }
  function jh() {
    for (; SA !== null && !Uu(); )
      Jm(SA);
  }
  function Jm(A) {
    var t = rm(A.alternate, A, _e);
    A.memoizedProps = A.pendingProps, t === null ? wi(A) : SA = t;
  }
  function Wm(A) {
    var t = A, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = tm(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          UA
        );
        break;
      case 11:
        t = tm(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          UA
        );
        break;
      case 5:
        yo(t);
        var a = t;
        a === ft && (vA ? (Wu(a), a.tag === 5 && a.stateNode != null && (FA = a.stateNode)) : (Wu(a), vA = !0));
      default:
        cm(e, t), t = SA = Cf(t, _e), t = rm(e, t, _e);
    }
    A.memoizedProps = A.pendingProps, t === null ? wi(A) : SA = t;
  }
  function In(A, t, e, a) {
    Je = Xa = null, yo(t), wn = null, Yl = 0;
    var n = t.return;
    try {
      if (ph(
        A,
        n,
        t,
        e,
        UA
      )) {
        $A = 1, di(
          A,
          te(e, A.current)
        ), SA = null;
        return;
      }
    } catch (l) {
      if (n !== null) throw SA = n, l;
      $A = 1, di(
        A,
        te(e, A.current)
      ), SA = null;
      return;
    }
    t.flags & 32768 ? (vA || a === 1 ? A = !0 : Fn || (UA & 536870912) !== 0 ? A = !1 : (xa = A = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = ht.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Lm(t, A)) : wi(t);
  }
  function wi(A) {
    var t = A;
    do {
      if ((t.flags & 32768) !== 0) {
        Lm(
          t,
          xa
        );
        return;
      }
      A = t.return;
      var e = vh(
        t.alternate,
        t,
        _e
      );
      if (e !== null) {
        SA = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        SA = t;
        return;
      }
      SA = t = A;
    } while (t !== null);
    $A === 0 && ($A = 5);
  }
  function Lm(A, t) {
    do {
      var e = bh(A.alternate, A);
      if (e !== null) {
        e.flags &= 32767, SA = e;
        return;
      }
      if (e = A.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (A = A.sibling, A !== null)) {
        SA = A;
        return;
      }
      SA = A = e;
    } while (A !== null);
    $A = 6, SA = null;
  }
  function Xm(A, t, e, a, n, l, o, f, g, T, E, K) {
    A.cancelPendingCommit = null;
    do
      Ci();
    while (IA !== 0);
    if ((OA & 6) !== 0) throw Error(i(327));
    if (t !== null) {
      if (t === A.current) throw Error(i(177));
      A === YA && (SA = YA = null, UA = 0), on = t, ye = A, Oe = e, rc = n, km = a, Dh(
        A,
        t,
        e,
        o,
        f,
        g,
        K
      );
    }
  }
  function Dh(A, t, e, a, n, l, o) {
    var f = t.lanes | t.childLanes;
    if (ic = f, f |= Zr, ty(
      A,
      e,
      f,
      a,
      n,
      l
    ), Jn = null, (e & 335544064) === e ? (Wn = ah(A), a = 10262) : (Wn = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (A.callbackNode = null, A.callbackPriority = 0, wh(gn, function() {
      return mc(), null;
    })) : (A.callbackNode = null, A.callbackPriority = 0), Si = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = L.T, L.T = null, n = _.p, _.p = 2, l = OA, OA |= 4;
      try {
        Sh(A, t, e);
      } finally {
        OA = l, _.p = n, L.T = a;
      }
    }
    IA = 1, Si ? Qn = t1(
      o,
      A.containerInfo,
      Wn,
      sc,
      fc,
      Oh,
      dc,
      mc,
      Rh
    ) : (sc(), fc(), dc());
  }
  function Rh(A) {
    if (IA !== 0) {
      var t = ye.onRecoverableError;
      t(A, { componentStack: null });
    }
  }
  function Oh() {
    IA === 3 && (IA = 0, Om(on, ye), IA = 4);
  }
  function sc() {
    if (IA === 1) {
      IA = 0;
      var A = ye, t = on, e = Oe, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = L.T, L.T = null;
        var n = _.p;
        _.p = 2;
        var l = OA;
        OA |= 4;
        try {
          _l = Ti = !1, Dm(t, A, e), e = Mc;
          var o = Mf(A.containerInfo), f = e.focusedElem, g = e.selectionRange;
          if (o !== f && f && f.ownerDocument && Uf(
            f.ownerDocument.documentElement,
            f
          )) {
            if (g !== null && Br(f)) {
              var T = g.start, E = g.end;
              if (E === void 0 && (E = T), "selectionStart" in f)
                f.selectionStart = T, f.selectionEnd = Math.min(
                  E,
                  f.value.length
                );
              else {
                var K = f.ownerDocument || document, N = K && K.defaultView || window;
                if (N.getSelection) {
                  var R = N.getSelection(), X = f.textContent.length, nA = Math.min(g.start, X), hA = g.end === void 0 ? nA : Math.min(g.end, X);
                  !R.extend && nA > hA && (o = hA, hA = nA, nA = o);
                  var x = Tf(
                    f,
                    nA
                  ), b = Tf(
                    f,
                    hA
                  );
                  if (x && b && (R.rangeCount !== 1 || R.anchorNode !== x.node || R.anchorOffset !== x.offset || R.focusNode !== b.node || R.focusOffset !== b.offset)) {
                    var j = K.createRange();
                    j.setStart(x.node, x.offset), R.removeAllRanges(), nA > hA ? (R.addRange(j), R.extend(b.node, b.offset)) : (j.setEnd(b.node, b.offset), R.addRange(j));
                  }
                }
              }
            }
            for (K = [], R = f; R = R.parentNode; )
              R.nodeType === 1 && K.push({
                element: R,
                left: R.scrollLeft,
                top: R.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < K.length; f++) {
              var V = K[f];
              V.element.scrollLeft = V.left, V.element.scrollTop = V.top;
            }
          }
          nl = !!Uc, Mc = Uc = null;
        } finally {
          OA = l, _.p = n, L.T = a;
        }
      }
      A.current = t, IA = 2;
    }
  }
  function fc() {
    if (IA === 2) {
      IA = 0;
      var A = ye, t = on, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = L.T, L.T = null;
        var a = _.p;
        _.p = 2;
        var n = OA;
        OA |= 4;
        try {
          xm(A, t.alternate, t);
        } finally {
          OA = n, _.p = a, L.T = e;
        }
      }
      IA = 3;
    }
  }
  function dc() {
    if (IA === 4 || IA === 3) {
      IA = 0;
      var A = Qn;
      Qn = null, Pt();
      var t = ye, e = on, a = Oe, n = km, l = (a & 335544064) === a ? 10262 : 10256;
      if ((e.subtreeFlags & l) !== 0 || (e.flags & l) !== 0 ? IA = 5 : (IA = 0, on = ye = null, Im(t, t.pendingLanes)), l = t.pendingLanes, l === 0 && (Ua = null), Sr(a), e = e.stateNode, qA && typeof qA.onCommitFiberRoot == "function")
        try {
          qA.onCommitFiberRoot(
            PA,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (n !== null) {
        e = L.T, l = _.p, _.p = 2, L.T = null;
        try {
          for (var o = t.onRecoverableError, f = 0; f < n.length; f++) {
            var g = n[f];
            o(g.value, {
              componentStack: g.stack
            });
          }
        } finally {
          L.T = e, _.p = l;
        }
      }
      if (n = Jn, o = Wn, Wn = null, n !== null && (Jn = null, o === null && (o = []), A !== null))
        for (g = 0; g < n.length; g++)
          e = (0, n[g])(
            o
          ), e !== void 0 && A.finished.finally(e);
      (Oe & 3) !== 0 && Ci(), Ee(t), l = t.pendingLanes, (a & 261930) !== 0 && (l & 42) !== 0 ? t === Ei ? eu++ : (eu = 0, Ei = t) : (eu = 0, Ei = null), au(0);
    }
  }
  function Im(A, t) {
    (A.pooledCacheLanes &= t) === 0 && (t = A.pooledCache, t != null && (A.pooledCache = null, ql(t)));
  }
  function Ci() {
    return Qn !== null && (Qn.skipTransition(), Qn = null), sc(), fc(), dc(), mc();
  }
  function mc() {
    if (IA !== 5) return !1;
    var A = ye, t = ic;
    ic = 0;
    var e = Sr(Oe), a = L.T, n = _.p;
    try {
      _.p = 32 > e ? 32 : e, L.T = null, e = rc, rc = null;
      var l = ye, o = Oe;
      if (IA = 0, on = ye = null, Oe = 0, (OA & 6) !== 0) throw Error(i(331));
      var f = OA;
      if (OA |= 4, wm(l.current), Em(
        l,
        l.current,
        o,
        e
      ), OA = f, au(0, !1), qA && typeof qA.onPostCommitFiberRoot == "function")
        try {
          qA.onPostCommitFiberRoot(PA, l);
        } catch {
        }
      return !0;
    } finally {
      _.p = n, L.T = a, Im(A, t);
    }
  }
  function Pm(A, t, e) {
    t = te(e, t), t = Oo(A.stateNode, t, 2), A = ya(A, t, 2), A !== null && (xl(A, 2), Ee(A));
  }
  function wA(A, t, e) {
    if (A.tag === 3)
      Pm(A, A, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Pm(
            t,
            A,
            e
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ua === null || !Ua.has(a))) {
            A = te(e, A), e = Wd(2), a = ya(t, e, 2), a !== null && (Ld(
              e,
              a,
              t,
              A
            ), xl(a, 2), Ee(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function pc(A, t, e) {
    var a = A.pingCache;
    if (a === null) {
      a = A.pingCache = new Th();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(e) || (lc = !0, n.add(e), A = Eh.bind(null, A, t, e), t.then(A, A));
  }
  function Eh(A, t, e) {
    var a = A.pingCache;
    a !== null && a.delete(t), A.pingedLanes |= A.suspendedLanes & e, A.warmLanes &= ~e, YA === A && (UA & e) === e && (($A === 4 || $A === 3 && (UA & 62914560) === UA && 300 > Ut() - Di) && (OA & 2) === 0 ? Xn(A, 0) : ji |= e, Zn === UA && (Zn = 0)), Ee(A);
  }
  function _m(A, t) {
    t === 0 && (t = Cs()), A = Ja(A, t), A !== null && (xl(A, t), Ee(A));
  }
  function Vh(A) {
    var t = A.memoizedState, e = 0;
    t !== null && (e = t.retryLane), _m(A, e);
  }
  function Kh(A, t) {
    var e = 0;
    switch (A.tag) {
      case 31:
      case 13:
        var a = A.stateNode, n = A.memoizedState;
        n !== null && (e = n.retryLane);
        break;
      case 19:
        a = A.stateNode;
        break;
      case 22:
        a = A.stateNode._retryCache;
        break;
      default:
        throw Error(i(314));
    }
    a !== null && a.delete(t), _m(A, e);
  }
  function wh(A, t) {
    return yl(A, t);
  }
  var Pn = null, _n = null, gc = !1, qi = !1, yc = !1, za = 0;
  function Ee(A) {
    A !== _n && A.next === null && (_n === null ? Pn = _n = A : _n = _n.next = A), qi = !0, gc || (gc = !0, qh());
  }
  function au(A, t) {
    if (!yc && qi) {
      yc = !0;
      do
        for (var e = !1, a = Pn; a !== null; ) {
          if (A !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var l = 0;
            else {
              var o = a.suspendedLanes, f = a.pingedLanes;
              l = (1 << 31 - RA(42 | A) + 1) - 1, l &= n & ~(o & ~f), l = l & 201326741 ? l & 201326741 | 1 : l ? l | 2 : 0;
            }
            l !== 0 && (e = !0, e0(a, l));
          } else
            l = UA, l = ju(
              a,
              a === YA ? l : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (l & 3) === 0 || Nl(a, l) || (e = !0, e0(a, l));
          a = a.next;
        }
      while (e);
      yc = !1;
    }
  }
  function Ch() {
    $m();
  }
  function $m() {
    qi = gc = !1;
    var A = 0;
    za !== 0 && Lh() && (A = za);
    for (var t = Ut(), e = null, a = Pn; a !== null; ) {
      var n = a.next, l = A0(a, t);
      l === 0 ? (a.next = null, e === null ? Pn = n : e.next = n, n === null && (_n = e)) : (e = a, (A !== 0 || (l & 3) !== 0) && (qi = !0)), a = n;
    }
    IA !== 0 && IA !== 5 || au(A), za !== 0 && (za = 0);
  }
  function A0(A, t) {
    for (var e = A.suspendedLanes, a = A.pingedLanes, n = A.expirationTimes, l = A.pendingLanes & -62914561; 0 < l; ) {
      var o = 31 - RA(l), f = 1 << o, g = n[o];
      g === -1 ? ((f & e) === 0 || (f & a) !== 0) && (n[o] = Ay(f, t)) : g <= t && (A.expiredLanes |= f), l &= ~f;
    }
    if (t = YA, e = UA, e = ju(
      A,
      A === t ? e : 0,
      A.cancelPendingCommit !== null || A.timeoutHandle !== -1
    ), a = A.callbackNode, e === 0 || A === t && (KA === 2 || KA === 9) || A.cancelPendingCommit !== null)
      return a !== null && a !== null && pn(a), A.callbackNode = null, A.callbackPriority = 0;
    if ((e & 3) === 0 || Nl(A, e)) {
      if (t = e & -e, t === A.callbackPriority) return t;
      switch (a !== null && pn(a), Sr(e)) {
        case 2:
        case 8:
          e = vl;
          break;
        case 32:
          e = gn;
          break;
        case 268435456:
          e = bl;
          break;
        default:
          e = gn;
      }
      return a = t0.bind(null, A), e = yl(e, a), A.callbackPriority = t, A.callbackNode = e, t;
    }
    return a !== null && a !== null && pn(a), A.callbackPriority = 2, A.callbackNode = null, 2;
  }
  function t0(A, t) {
    if (IA !== 0 && IA !== 5)
      return A.callbackNode = null, A.callbackPriority = 0, null;
    var e = A.callbackNode;
    if (Ci() && A.callbackNode !== e)
      return null;
    var a = UA;
    return a = ju(
      A,
      A === YA ? a : 0,
      A.cancelPendingCommit !== null || A.timeoutHandle !== -1
    ), a === 0 ? null : (Ym(A, a, t), A0(A, Ut()), A.callbackNode != null && A.callbackNode === e ? t0.bind(null, A) : null);
  }
  function e0(A, t) {
    if (Ci()) return null;
    Ym(A, t, !0);
  }
  function qh() {
    Ih(function() {
      (OA & 6) !== 0 ? yl(
        fe,
        Ch
      ) : $m();
    });
  }
  function hc() {
    if (za === 0) {
      var A = _a;
      A === 0 && (A = Mt, Mt <<= 1, (Mt & 261888) === 0 && (Mt = 256)), za = A;
    }
    return za;
  }
  function a0(A) {
    return A == null || typeof A == "symbol" || typeof A == "boolean" ? null : typeof A == "function" ? A : Vu(A);
  }
  function kh(A, t, e, a, n) {
    if (t === "submit" && e && e.stateNode === n) {
      var l = a0(
        (n[Kt] || null).action
      ), o = a.submitter;
      o && (t = (t = o[Kt] || null) ? a0(t.formAction) : o.getAttribute("formAction"), t !== null && (l = t, o = null));
      var f = new qu(
        "action",
        "action",
        null,
        a,
        n
      );
      A.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (za !== 0) {
                  var g = new FormData(n, o);
                  Mo(
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
                typeof l == "function" && (f.preventDefault(), g = new FormData(n, o), Mo(
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
  for (var vc = 0; vc < Fr.length; vc++) {
    var bc = Fr[vc], Bh = bc.toLowerCase(), Yh = bc[0].toUpperCase() + bc.slice(1);
    de(
      Bh,
      "on" + Yh
    );
  }
  de(Df, "onAnimationEnd"), de(Rf, "onAnimationIteration"), de(Of, "onAnimationStart"), de("dblclick", "onDoubleClick"), de("focusin", "onFocus"), de("focusout", "onBlur"), de(Xy, "onTransitionRun"), de(Iy, "onTransitionStart"), de(Py, "onTransitionCancel"), de(Ef, "onTransitionEnd"), bn("onMouseEnter", ["mouseout", "mouseover"]), bn("onMouseLeave", ["mouseout", "mouseover"]), bn("onPointerEnter", ["pointerout", "pointerover"]), bn("onPointerLeave", ["pointerout", "pointerover"]), Fa(
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
  var nu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Hh = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(nu)
  );
  function n0(A, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < A.length; e++) {
      var a = A[e], n = a.event;
      a = a.listeners;
      A: {
        var l = void 0;
        if (t)
          for (var o = a.length - 1; 0 <= o; o--) {
            var f = a[o], g = f.instance, T = f.currentTarget;
            if (f = f.listener, g !== l && n.isPropagationStopped())
              break A;
            l = f, n.currentTarget = T;
            try {
              l(n);
            } catch (E) {
              Yu(E);
            }
            n.currentTarget = null, l = g;
          }
        else
          for (o = 0; o < a.length; o++) {
            if (f = a[o], g = f.instance, T = f.currentTarget, f = f.listener, g !== l && n.isPropagationStopped())
              break A;
            l = f, n.currentTarget = T;
            try {
              l(n);
            } catch (E) {
              Yu(E);
            }
            n.currentTarget = null, l = g;
          }
      }
    }
  }
  function NA(A, t) {
    var e = t[Gs];
    e === void 0 && (e = t[Gs] = /* @__PURE__ */ new Set());
    var a = A + "__bubble";
    e.has(a) || (l0(t, A, 2, !1), e.add(a));
  }
  function Sc(A, t, e) {
    var a = 0;
    t && (a |= 4), l0(
      e,
      A,
      a,
      t
    );
  }
  var ki = "_reactListening" + Math.random().toString(36).slice(2);
  function Nc(A) {
    if (!A[ki]) {
      A[ki] = !0, Qs.forEach(function(e) {
        e !== "selectionchange" && (Hh.has(e) || Sc(e, !1, A), Sc(e, !0, A));
      });
      var t = A.nodeType === 9 ? A : A.ownerDocument;
      t === null || t[ki] || (t[ki] = !0, Sc("selectionchange", !1, t));
    }
  }
  function l0(A, t, e, a) {
    switch (L0(t)) {
      case 2:
        var n = V1;
        break;
      case 8:
        n = K1;
        break;
      default:
        n = Gc;
    }
    e = n.bind(
      null,
      t,
      e,
      A
    ), n = void 0, !Dr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? A.addEventListener(t, e, {
      capture: !0,
      passive: n
    }) : A.addEventListener(t, e, !0) : n !== void 0 ? A.addEventListener(t, e, {
      passive: n
    }) : A.addEventListener(t, e, !1);
  }
  function xc(A, t, e, a, n) {
    var l = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      A: for (; ; ) {
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
              continue A;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    nf(function() {
      var T = l, E = zr(e), K = [];
      A: {
        var N = Vf.get(A);
        if (N !== void 0) {
          var R = qu, X = A;
          switch (A) {
            case "keypress":
              if (wu(e) === 0) break A;
            case "keydown":
            case "keyup":
              R = Uy;
              break;
            case "focusin":
              X = "focus", R = Vr;
              break;
            case "focusout":
              X = "blur", R = Vr;
              break;
            case "beforeblur":
            case "afterblur":
              R = Vr;
              break;
            case "click":
              if (e.button === 2) break A;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              R = rf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = dy;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = Ry;
              break;
            case Df:
            case Rf:
            case Of:
              R = gy;
              break;
            case Ef:
              R = Ey;
              break;
            case "scroll":
            case "scrollend":
              R = sy;
              break;
            case "wheel":
              R = Ky;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = hy;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = cf;
              break;
            case "submit":
              R = jy;
              break;
            case "toggle":
            case "beforetoggle":
              R = Cy;
          }
          var nA = (t & 4) !== 0, hA = !nA && (A === "scroll" || A === "scrollend"), x = nA ? N !== null ? N + "Capture" : null : N;
          nA = [];
          for (var b = T, j; b !== null; ) {
            var V = b;
            if (j = V.stateNode, V = V.tag, V !== 5 && V !== 26 && V !== 27 || j === null || x === null || (V = Ml(b, x), V != null && nA.push(
              lu(b, V, j)
            )), hA) break;
            b = b.return;
          }
          0 < nA.length && (N = new R(
            N,
            X,
            null,
            e,
            E
          ), K.push({ event: N, listeners: nA }));
        }
      }
      if ((t & 7) === 0) {
        A: {
          if (R = A === "mouseover" || A === "pointerover", N = A === "mouseout" || A === "pointerout", R && e !== Mr && (X = e.relatedTarget || e.fromElement) && (Ga(X) || X[yn]))
            break A;
          (N || R) && (X = E.window === E ? E : (R = E.ownerDocument) ? R.defaultView || R.parentWindow : window, N ? (R = e.relatedTarget || e.toElement, N = T, R = R ? Ga(R) : null, R !== null && (hA = p(R), nA = R.tag, R !== hA || nA !== 5 && nA !== 27 && nA !== 6) && (R = null)) : (N = null, R = T), N !== R && (nA = rf, V = "onMouseLeave", x = "onMouseEnter", b = "mouse", (A === "pointerout" || A === "pointerover") && (nA = cf, V = "onPointerLeave", x = "onPointerEnter", b = "pointer"), hA = N == null ? X : Ul(N), j = R == null ? X : Ul(R), X = new nA(
            V,
            b + "leave",
            N,
            e,
            E
          ), X.target = hA, X.relatedTarget = j, V = null, Ga(E) === T && (nA = new nA(
            x,
            b + "enter",
            R,
            e,
            E
          ), nA.target = j, nA.relatedTarget = hA, V = nA), hA = V, nA = N && R ? sA(
            N,
            R,
            Gh
          ) : null, N !== null && u0(
            K,
            X,
            N,
            nA,
            !1
          ), R !== null && hA !== null && u0(
            K,
            hA,
            R,
            nA,
            !0
          )));
        }
        A: {
          if (N = T ? Ul(T) : window, R = N.nodeName && N.nodeName.toLowerCase(), R === "select" || R === "input" && N.type === "file")
            var $ = hf;
          else if (gf(N))
            if (vf)
              $ = Jy;
            else {
              $ = Zy;
              var MA = Fy;
            }
          else
            R = N.nodeName, !R || R.toLowerCase() !== "input" || N.type !== "checkbox" && N.type !== "radio" ? T && Ur(T.elementType) && ($ = hf) : $ = Qy;
          if ($ && ($ = $(A, T))) {
            yf(
              K,
              $,
              e,
              E
            );
            break A;
          }
          MA && MA(A, N, T);
        }
        switch (MA = T ? Ul(T) : window, A) {
          case "focusin":
            (gf(MA) || MA.contentEditable === "true") && (Mn = MA, Yr = T, Kl = null);
            break;
          case "focusout":
            Kl = Yr = Mn = null;
            break;
          case "mousedown":
            Hr = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Hr = !1, zf(K, e, E);
            break;
          case "selectionchange":
            if (Ly) break;
          case "keydown":
          case "keyup":
            zf(K, e, E);
        }
        var rA;
        if (wr)
          A: {
            switch (A) {
              case "compositionstart":
                var fA = "onCompositionStart";
                break A;
              case "compositionend":
                fA = "onCompositionEnd";
                break A;
              case "compositionupdate":
                fA = "onCompositionUpdate";
                break A;
            }
            fA = void 0;
          }
        else
          Un ? mf(A, e) && (fA = "onCompositionEnd") : A === "keydown" && e.keyCode === 229 && (fA = "onCompositionStart");
        fA && (sf && e.locale !== "ko" && (Un || fA !== "onCompositionStart" ? fA === "onCompositionEnd" && Un && (rA = lf()) : (ra = E, Rr = "value" in ra ? ra.value : ra.textContent, Un = !0)), MA = Bi(T, fA), 0 < MA.length && (fA = new of(
          fA,
          A,
          null,
          e,
          E
        ), K.push({ event: fA, listeners: MA }), rA ? fA.data = rA : (rA = pf(e), rA !== null && (fA.data = rA)))), (rA = ky ? By(A, e) : Yy(A, e)) && (fA = Bi(T, "onBeforeInput"), 0 < fA.length && (MA = new of(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          E
        ), K.push({
          event: MA,
          listeners: fA
        }), MA.data = rA)), kh(
          K,
          A,
          T,
          e,
          E
        );
      }
      n0(K, t);
    });
  }
  function lu(A, t, e) {
    return {
      instance: A,
      listener: t,
      currentTarget: e
    };
  }
  function Bi(A, t) {
    for (var e = t + "Capture", a = []; A !== null; ) {
      var n = A, l = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || l === null || (n = Ml(A, e), n != null && a.unshift(
        lu(A, n, l)
      ), n = Ml(A, t), n != null && a.push(
        lu(A, n, l)
      )), A.tag === 3) return a;
      A = A.return;
    }
    return [];
  }
  function Gh(A) {
    if (A === null) return null;
    do
      A = A.return;
    while (A && A.tag !== 5 && A.tag !== 27);
    return A || null;
  }
  function u0(A, t, e, a, n) {
    for (var l = t._reactName, o = []; e !== null && e !== a; ) {
      var f = e, g = f.alternate, T = f.stateNode;
      if (f = f.tag, g !== null && g === a) break;
      f !== 5 && f !== 26 && f !== 27 || T === null || (g = T, n ? (T = Ml(e, l), T != null && o.unshift(
        lu(e, T, g)
      )) : n || (T = Ml(e, l), T != null && o.push(
        lu(e, T, g)
      ))), e = e.return;
    }
    o.length !== 0 && A.push({ event: t, listeners: o });
  }
  var Fh = /\r\n?/g, Zh = /\u0000|\uFFFD/g;
  function i0(A) {
    return (typeof A == "string" ? A : "" + A).replace(Fh, `
`).replace(Zh, "");
  }
  function r0(A, t) {
    return t = i0(t), i0(A) === t;
  }
  function CA(A, t, e, a, n, l) {
    switch (e) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Nn(A, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Nn(A, "" + a);
        else return;
        break;
      case "className":
        Eu(A, "class", a);
        break;
      case "tabIndex":
        Eu(A, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Eu(A, e, a);
        break;
      case "style":
        ef(A, a, l);
        return;
      case "data":
        if (t !== "object") {
          Eu(A, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || e !== "href")) {
          A.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          A.removeAttribute(e);
          break;
        }
        a = Vu(a), A.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          A.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof l == "function" && (e === "formAction" ? (t !== "input" && CA(A, t, "name", n.name, n, null), CA(
            A,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), CA(
            A,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), CA(
            A,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (CA(A, t, "encType", n.encType, n, null), CA(A, t, "method", n.method, n, null), CA(A, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          A.removeAttribute(e);
          break;
        }
        a = Vu(a), A.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (A.onclick = Ne);
        return;
      case "onScroll":
        a != null && NA("scroll", A);
        return;
      case "onScrollEnd":
        a != null && NA("scrollend", A);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(i(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(i(60));
            (l != null ? l.__html : void 0) !== e && (A.innerHTML = e);
          }
        }
        break;
      case "multiple":
        A.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        A.muted = a && typeof a != "function" && typeof a != "symbol";
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
          A.removeAttribute("xlink:href");
          break;
        }
        e = Vu(a), A.setAttributeNS(
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
        a != null && typeof a != "function" && typeof a != "symbol" ? A.setAttribute(e, a) : A.removeAttribute(e);
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
        a && typeof a != "function" && typeof a != "symbol" ? A.setAttribute(e, "") : A.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0 ? A.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? A.setAttribute(e, a) : A.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? A.setAttribute(e, a) : A.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? A.removeAttribute(e) : A.setAttribute(e, a);
        break;
      case "popover":
        NA("beforetoggle", A), NA("toggle", A), Ou(A, "popover", a);
        break;
      case "xlinkActuate":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Ye(
          A,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Ye(
          A,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Ye(
          A,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Ye(
          A,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Ou(A, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N")
          e = oy.get(e) || e, Ou(A, e, a);
        else return;
    }
    DA = !0;
  }
  function Tc(A, t, e, a, n, l) {
    switch (e) {
      case "style":
        ef(A, a, l);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(i(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(i(60));
            (l != null ? l.__html : void 0) !== e && (A.innerHTML = e);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Nn(A, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Nn(A, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && NA("scroll", A);
        return;
      case "onScrollEnd":
        a != null && NA("scrollend", A);
        return;
      case "onClick":
        a != null && (A.onclick = Ne);
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
        if (!Js.hasOwnProperty(e))
          A: {
            if (e[0] === "o" && e[1] === "n" && (n = e.endsWith("Capture"), l = e.slice(2, n ? e.length - 7 : void 0), t = A[Kt] || null, t = t != null ? t[e] : null, typeof t == "function" && A.removeEventListener(l, t, n), typeof a == "function")) {
              typeof t != "function" && t !== null && (e in A ? A[e] = null : A.hasAttribute(e) && A.removeAttribute(e)), A.addEventListener(l, a, n);
              break A;
            }
            DA = !0, e in A ? A[e] = a : a === !0 ? A.setAttribute(e, "") : Ou(A, e, a);
          }
        return;
    }
    DA = !0;
  }
  function St(A, t, e) {
    switch (t) {
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
        NA("error", A), NA("load", A);
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
                  throw Error(i(137, t));
                default:
                  CA(A, t, l, o, e, null);
              }
          }
        n && CA(A, t, "srcSet", e.srcSet, e, null), a && CA(A, t, "src", e.src, e, null);
        return;
      case "input":
        NA("invalid", A);
        var f = l = o = n = null, g = null, T = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var E = e[a];
            if (E != null)
              switch (a) {
                case "name":
                  n = E;
                  break;
                case "type":
                  o = E;
                  break;
                case "checked":
                  g = E;
                  break;
                case "defaultChecked":
                  T = E;
                  break;
                case "value":
                  l = E;
                  break;
                case "defaultValue":
                  f = E;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (E != null)
                    throw Error(i(137, t));
                  break;
                default:
                  CA(A, t, a, E, e, null);
              }
          }
        _s(
          A,
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
        NA("invalid", A), a = o = l = null;
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
                CA(A, t, n, f, e, null);
            }
        t = l, e = o, A.multiple = !!a, t != null ? Sn(A, !!a, t, !1) : e != null && Sn(A, !!a, e, !0);
        return;
      case "textarea":
        NA("invalid", A), l = n = a = null;
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
                if (f != null) throw Error(i(91));
                break;
              default:
                CA(A, t, o, f, e, null);
            }
        Af(A, a, n, l);
        return;
      case "option":
        for (g in e)
          if (e.hasOwnProperty(g) && (a = e[g], a != null))
            switch (g) {
              case "selected":
                A.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                CA(A, t, g, a, e, null);
            }
        return;
      case "dialog":
        NA("beforetoggle", A), NA("toggle", A), NA("cancel", A), NA("close", A);
        break;
      case "iframe":
      case "object":
        NA("load", A);
        break;
      case "video":
      case "audio":
        for (a = 0; a < nu.length; a++)
          NA(nu[a], A);
        break;
      case "image":
        NA("error", A), NA("load", A);
        break;
      case "details":
        NA("toggle", A);
        break;
      case "embed":
      case "source":
      case "link":
        NA("error", A), NA("load", A);
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
                throw Error(i(137, t));
              default:
                CA(A, t, T, a, e, null);
            }
        return;
      default:
        if (Ur(t)) {
          for (E in e)
            e.hasOwnProperty(E) && (a = e[E], a !== void 0 && Tc(
              A,
              t,
              E,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (f in e)
      e.hasOwnProperty(f) && (a = e[f], a != null && CA(A, t, f, a, e, null));
  }
  var Qh = {};
  function Jh(A, t, e, a) {
    switch (t) {
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
        var n = null, l = null, o = null, f = null, g = null, T = null, E = null;
        for (R in e) {
          var K = e[R];
          if (e.hasOwnProperty(R) && K != null)
            switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                g = K;
              default:
                a.hasOwnProperty(R) || CA(A, t, R, null, a, K);
            }
        }
        for (var N in a) {
          var R = a[N];
          if (K = e[N], a.hasOwnProperty(N) && (R != null || K != null))
            switch (N) {
              case "type":
                R !== K && (DA = !0), l = R;
                break;
              case "name":
                R !== K && (DA = !0), n = R;
                break;
              case "checked":
                R !== K && (DA = !0), T = R;
                break;
              case "defaultChecked":
                R !== K && (DA = !0), E = R;
                break;
              case "value":
                R !== K && (DA = !0), o = R;
                break;
              case "defaultValue":
                R !== K && (DA = !0), f = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(i(137, t));
                break;
              default:
                R !== K && CA(
                  A,
                  t,
                  N,
                  R,
                  a,
                  K
                );
            }
        }
        xr(
          A,
          o,
          f,
          g,
          T,
          E,
          l,
          n
        );
        return;
      case "select":
        R = o = f = N = null;
        for (l in e)
          if (g = e[l], e.hasOwnProperty(l) && g != null)
            switch (l) {
              case "value":
                break;
              case "multiple":
                R = g;
              default:
                a.hasOwnProperty(l) || CA(
                  A,
                  t,
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
                l !== g && (DA = !0), N = l;
                break;
              case "defaultValue":
                l !== g && (DA = !0), f = l;
                break;
              case "multiple":
                l !== g && (DA = !0), o = l;
              default:
                l !== g && CA(
                  A,
                  t,
                  n,
                  l,
                  a,
                  g
                );
            }
        t = f, e = o, a = R, N != null ? Sn(A, !!e, N, !1) : !!a != !!e && (t != null ? Sn(A, !!e, t, !0) : Sn(A, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        R = N = null;
        for (f in e)
          if (n = e[f], e.hasOwnProperty(f) && n != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                CA(A, t, f, null, a, n);
            }
        for (o in a)
          if (n = a[o], l = e[o], a.hasOwnProperty(o) && (n != null || l != null))
            switch (o) {
              case "value":
                n !== l && (DA = !0), N = n;
                break;
              case "defaultValue":
                n !== l && (DA = !0), R = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(i(91));
                break;
              default:
                n !== l && CA(A, t, o, n, a, l);
            }
        $s(A, N, R);
        return;
      case "option":
        for (var X in e)
          if (N = e[X], e.hasOwnProperty(X) && N != null && !a.hasOwnProperty(X))
            switch (X) {
              case "selected":
                A.selected = !1;
                break;
              default:
                CA(
                  A,
                  t,
                  X,
                  null,
                  a,
                  N
                );
            }
        for (g in a)
          if (N = a[g], R = e[g], a.hasOwnProperty(g) && N !== R && (N != null || R != null))
            switch (g) {
              case "selected":
                N !== R && (DA = !0), A.selected = N && typeof N != "function" && typeof N != "symbol";
                break;
              default:
                CA(
                  A,
                  t,
                  g,
                  N,
                  a,
                  R
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
        for (var nA in e)
          N = e[nA], e.hasOwnProperty(nA) && N != null && !a.hasOwnProperty(nA) && CA(A, t, nA, null, a, N);
        for (T in a)
          if (N = a[T], R = e[T], a.hasOwnProperty(T) && N !== R && (N != null || R != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (N != null)
                  throw Error(i(137, t));
                break;
              default:
                CA(
                  A,
                  t,
                  T,
                  N,
                  a,
                  R
                );
            }
        return;
      default:
        if (Ur(t)) {
          for (var hA in e)
            N = e[hA], e.hasOwnProperty(hA) && N !== void 0 && !a.hasOwnProperty(hA) && Tc(
              A,
              t,
              hA,
              void 0,
              a,
              N
            );
          for (E in a)
            N = a[E], R = e[E], !a.hasOwnProperty(E) || N === R || N === void 0 && R === void 0 || Tc(
              A,
              t,
              E,
              N,
              a,
              R
            );
          return;
        }
    }
    for (var x in e)
      N = e[x], e.hasOwnProperty(x) && N != null && !a.hasOwnProperty(x) && CA(A, t, x, null, a, N);
    for (K in a)
      N = a[K], R = e[K], !a.hasOwnProperty(K) || N === R || N == null && R == null || CA(A, t, K, N, a, R);
  }
  function o0(A) {
    switch (A) {
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
  function Wh() {
    if (typeof performance.getEntriesByType == "function") {
      for (var A = 0, t = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var n = e[a], l = n.transferSize, o = n.initiatorType, f = n.duration;
        if (l && f && o0(o)) {
          for (o = 0, f = n.responseEnd, a += 1; a < e.length; a++) {
            var g = e[a], T = g.startTime;
            if (T > f) break;
            var E = g.transferSize, K = g.initiatorType;
            E && o0(K) && (g = g.responseEnd, o += E * (g < f ? 1 : (f - T) / (g - T)));
          }
          if (--a, t += 8 * (l + o) / (n.duration / 1e3), A++, 10 < A) break;
        }
      }
      if (0 < A) return t / A / 1e6;
    }
    return navigator.connection && (A = navigator.connection.downlink, typeof A == "number") ? A : 5;
  }
  var Uc = null, Mc = null;
  function uu(A) {
    return A.nodeType === 9 ? A : A.ownerDocument;
  }
  function c0(A) {
    switch (A) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function s0(A, t) {
    if (A === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return A === 1 && t === "foreignObject" ? 0 : A;
  }
  function f0(A, t, e, a) {
    return e = uu(
      e
    ).createElement(A), e[gt] = a, e[Kt] = t, St(e, A, t), st(e), e;
  }
  function zc(A, t) {
    return A === "textarea" || A === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var jc = null;
  function Lh() {
    var A = window.event;
    return A && A.type === "popstate" ? A === jc ? !1 : (jc = A, !0) : (jc = null, !1);
  }
  var Dc = typeof setTimeout == "function" ? setTimeout : void 0, Xh = typeof clearTimeout == "function" ? clearTimeout : void 0, d0 = typeof Promise == "function" ? Promise : void 0, m0 = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Dc, Ih = typeof queueMicrotask == "function" ? queueMicrotask : typeof d0 < "u" ? function(A) {
    return d0.resolve(null).then(A).catch(Ph);
  } : Dc;
  function Ph(A) {
    setTimeout(function() {
      throw A;
    });
  }
  function ja(A) {
    return A === "head";
  }
  function p0(A, t) {
    var e = t, a = 0;
    do {
      var n = e.nextSibling;
      if (A.removeChild(e), n && n.nodeType === 8)
        if (e = n.data, e === "/$" || e === "/&") {
          if (a === 0) {
            A.removeChild(n), ll(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          qc(
            A.ownerDocument.documentElement
          );
        else if (e === "head") {
          e = A.ownerDocument.head, qc(e);
          for (var l = e.firstChild; l; ) {
            var o = l.nextSibling, f = l.nodeName;
            l[Tl] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && l.rel.toLowerCase() === "stylesheet" || e.removeChild(l), l = o;
          }
        } else
          e === "body" && qc(A.ownerDocument.body);
      e = n;
    } while (e);
    ll(t);
  }
  function g0(A, t) {
    var e = A;
    A = 0;
    do {
      var a = e.nextSibling;
      if (e.nodeType === 1 ? t ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (t ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
        if (e = a.data, e === "/$") {
          if (A === 0) break;
          A--;
        } else
          e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || A++;
      e = a;
    } while (e);
  }
  function y0(A, t, e) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, A.style.viewTransitionName = t, e != null && (A.style.viewTransitionClass = e), e = getComputedStyle(A), e.display === "inline") {
      if (t = A.getClientRects(), t.length === 1) var a = 1;
      else
        for (var n = a = 0; n < t.length; n++) {
          var l = t[n];
          0 < l.width && 0 < l.height && a++;
        }
      a === 1 && (A = A.style, A.display = t.length === 1 ? "inline-block" : "block", A.marginTop = "-" + e.paddingTop, A.marginBottom = "-" + e.paddingBottom);
    }
  }
  function h0(A, t) {
    A = A.style, t = t.style;
    var e = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    A.viewTransitionName = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), e = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, A.viewTransitionClass = e == null || typeof e == "boolean" ? "" : ("" + e).trim(), A.display === "inline-block" && (t == null ? A.display = A.margin = "" : (e = t.display, A.display = e == null || typeof e == "boolean" ? "" : e, e = t.margin, e != null ? A.margin = e : (e = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], A.marginTop = e == null || typeof e == "boolean" ? "" : e, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], A.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function _h(A, t, e) {
    return e = e.ownerDocument.defaultView, {
      rect: A,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= A.bottom && 0 <= A.right && A.top <= e.innerHeight && A.left <= e.innerWidth
    };
  }
  function Rc(A) {
    var t = A.getBoundingClientRect(), e = getComputedStyle(A);
    return _h(t, e, A);
  }
  function $h(A) {
    return A.documentElement.clientHeight;
  }
  function A1(A) {
    this.addEventListener("load", A), this.addEventListener("error", A);
  }
  function t1(A, t, e, a, n, l, o, f, g) {
    var T = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var E = T.startViewTransition({
        update: function() {
          var N = T.defaultView, R = N.navigation && N.navigation.transition, X = T.fonts.status;
          a();
          var nA = [];
          if (X === "loaded" && ($h(T), T.fonts.status === "loading" && nA.push(T.fonts.ready)), X = nA.length, A !== null)
            for (var hA = A.suspenseyImages, x = 0, b = 0; b < hA.length; b++) {
              var j = hA[b];
              if (!j.complete) {
                var V = j.getBoundingClientRect();
                if (0 < V.bottom && 0 < V.right && V.top < N.innerHeight && V.left < N.innerWidth) {
                  if (x += B0(j), x > Gi) {
                    nA.length = X;
                    break;
                  }
                  j = new Promise(
                    A1.bind(j)
                  ), nA.push(j);
                }
              }
            }
          if (0 < nA.length)
            return N = Promise.race([
              Promise.all(nA),
              new Promise(function($) {
                return setTimeout($, 500);
              })
            ]).then(n, n), (R ? Promise.allSettled([R.finished, N]) : N).then(l, l);
          if (n(), R)
            return R.finished.then(
              l,
              l
            );
          l();
        },
        types: e
      });
      T.__reactViewTransition = E;
      var K = [];
      return E.ready.then(
        function() {
          for (var N = T.documentElement.getAnimations({
            subtree: !0
          }), R = 0; R < N.length; R++) {
            var X = N[R], nA = X.effect, hA = nA.pseudoElement;
            if (hA != null && hA.startsWith("::view-transition")) {
              K.push(X), X = nA.getKeyframes();
              for (var x = hA = void 0, b = !0, j = 0; j < X.length; j++) {
                var V = X[j], $ = V.width;
                if (hA === void 0) hA = $;
                else if (hA !== $) {
                  b = !1;
                  break;
                }
                if ($ = V.height, x === void 0) x = $;
                else if (x !== $) {
                  b = !1;
                  break;
                }
                delete V.width, delete V.height, V.transform === "none" && delete V.transform;
              }
              b && hA !== void 0 && x !== void 0 && (nA.setKeyframes(X), b = getComputedStyle(
                nA.target,
                nA.pseudoElement
              ), b.width !== hA || b.height !== x) && (b = X[0], b.width = hA, b.height = x, b = X[X.length - 1], b.width = hA, b.height = x, nA.setKeyframes(X));
            }
          }
          o();
        },
        function(N) {
          T.__reactViewTransition === E && (T.__reactViewTransition = null);
          try {
            if (typeof N == "object" && N !== null)
              switch (N.name) {
                case "InvalidStateError":
                  (N.message === "View transition was skipped because document visibility state is hidden." || N.message === "Skipping view transition because document visibility state has become hidden." || N.message === "Skipping view transition because viewport size changed." || N.message === "Transition was aborted because of invalid state") && (N = null);
              }
            N !== null && g(N);
          } finally {
            a(), n(), o();
          }
        }
      ), E.finished.finally(function() {
        for (var N = 0; N < K.length; N++)
          K[N].cancel();
        T.__reactViewTransition === E && (T.__reactViewTransition = null), f();
      }), E;
    } catch {
      return a(), n(), o(), null;
    }
  }
  function cn(A, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + A + "(" + t + ")";
  }
  cn.prototype.animate = function(A, t) {
    return t = typeof t == "number" ? { duration: t } : J({}, t), t.pseudoElement = this._selector, this._scope.animate(A, t);
  }, cn.prototype.getAnimations = function() {
    for (var A = this._scope, t = this._selector, e = A.getAnimations({ subtree: !0 }), a = [], n = 0; n < e.length; n++) {
      var l = e[n].effect;
      l !== null && l.target === A && l.pseudoElement === t && a.push(e[n]);
    }
    return a;
  }, cn.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function v0(A) {
    return {
      name: A,
      group: new cn("group", A),
      imagePair: new cn("image-pair", A),
      old: new cn("old", A),
      new: new cn("new", A)
    };
  }
  function It(A) {
    this._fragmentFiber = A, this._observers = this._eventListeners = null;
  }
  It.prototype.addEventListener = function(A, t, e) {
    var a = null, n = null;
    if (!(e != null && typeof e != "boolean" && (a = e.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var l = this._eventListeners;
      if (S0(l, A, t, e) === -1) {
        var o = this, f = t;
        e != null && typeof e != "boolean" && e.once === !0 && (f = function(g) {
          o.removeEventListener(
            A,
            t,
            e
          ), typeof t == "function" ? t.call(this, g) : t.handleEvent(g);
        }), a !== null && (n = o.removeEventListener.bind(
          o,
          A,
          t,
          e
        ), a.addEventListener("abort", n, { once: !0 }), n = a.removeEventListener.bind(a, "abort", n)), a = $n(e), l.push({
          type: A,
          listener: t,
          optionsOrUseCapture: e,
          attachedListener: f,
          cleanup: n
        }), s(
          this._fragmentFiber.child,
          !1,
          e1,
          A,
          f,
          a
        );
      }
      this._eventListeners = l;
    }
  };
  function e1(A, t, e, a) {
    return C(A).addEventListener(
      t,
      e,
      a
    ), !1;
  }
  It.prototype.removeEventListener = function(A, t, e) {
    var a = this._eventListeners;
    if (a !== null && (t = S0(
      a,
      A,
      t,
      e
    ), t !== -1)) {
      var n = a[t];
      e = n.attachedListener;
      var l = n.cleanup;
      n = $n(n.optionsOrUseCapture), s(
        this._fragmentFiber.child,
        !1,
        a1,
        A,
        e,
        n
      ), a.splice(t, 1), l !== null && l();
    }
  };
  function a1(A, t, e, a) {
    return C(A).removeEventListener(
      t,
      e,
      a
    ), !1;
  }
  function $n(A) {
    return A != null && typeof A != "boolean" && (A.once === !0 || A.signal instanceof AbortSignal) ? { capture: A.capture, passive: A.passive } : A;
  }
  function b0(A) {
    return A == null ? "c=0" : typeof A == "boolean" ? "c=" + (A ? "1" : "0") : "c=" + (A.capture ? "1" : "0");
  }
  function S0(A, t, e, a) {
    if (A.length === 0) return -1;
    a = b0(a);
    for (var n = 0; n < A.length; n++) {
      var l = A[n];
      if (l.type === t && l.listener === e && b0(l.optionsOrUseCapture) === a)
        return n;
    }
    return -1;
  }
  It.prototype.dispatchEvent = function(A) {
    var t = D(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = C(t);
    var e = this._eventListeners;
    if (e !== null && 0 < e.length || !A.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (e)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          a.addEventListener(
            l.type,
            l.attachedListener,
            $n(l.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), A = a.dispatchEvent(A), e)
        for (n = 0; n < e.length; n++)
          l = e[n], a.removeEventListener(
            l.type,
            l.attachedListener,
            $n(l.optionsOrUseCapture)
          );
      return t.removeChild(a), A;
    }
    return t.dispatchEvent(A);
  }, It.prototype.focus = function(A) {
    s(
      this._fragmentFiber.child,
      !0,
      N0,
      A,
      void 0,
      void 0
    );
  };
  function N0(A, t) {
    return A.tag === 6 ? !1 : (A = C(A), p1(A, t));
  }
  It.prototype.focusLast = function(A) {
    var t = [];
    s(
      this._fragmentFiber.child,
      !0,
      Oc,
      t,
      void 0,
      void 0
    );
    for (var e = t.length - 1; 0 <= e && !N0(t[e], A); e--) ;
  };
  function Oc(A, t) {
    return t.push(A), !1;
  }
  It.prototype.blur = function() {
    var A = D(
      this._fragmentFiber
    );
    A !== null && (A = C(A), A = uu(A).activeElement, A !== null && s(
      this._fragmentFiber.child,
      !1,
      n1,
      A,
      void 0,
      void 0
    ));
  };
  function n1(A, t) {
    return A.tag === 6 ? !1 : (A = C(A), A === t || A.contains(t) ? (t.blur(), !0) : !1);
  }
  It.prototype.observeUsing = function(A) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(A), s(
      this._fragmentFiber.child,
      !1,
      l1,
      A,
      void 0,
      void 0
    );
  };
  function l1(A, t) {
    return A.tag === 6 || (A = C(A), t.observe(A)), !1;
  }
  It.prototype.unobserveUsing = function(A) {
    var t = this._observers;
    if (t !== null && t.has(A)) {
      t.delete(A), s(
        this._fragmentFiber.child,
        !1,
        u1,
        A,
        void 0,
        void 0
      );
      for (var e = t = 0; e < he.length; e++) {
        var a = he[e];
        a.fragmentInstance === this && a.observer === A ? A.unobserve(a.instance) : he[t++] = a;
      }
      he.length = t;
    }
  };
  function u1(A, t) {
    return A.tag === 6 || (A = C(A), t.unobserve(A)), !1;
  }
  var he = [], Ec = !1;
  function i1(A, t, e) {
    he.push({
      fragmentInstance: A,
      observer: t,
      instance: e
    }), Ec || (Ec = !0, g1(function() {
      Ec = !1;
      var a = he;
      he = [];
      for (var n = 0; n < a.length; n++) {
        var l = a[n];
        l.observer.unobserve(l.instance);
      }
    }));
  }
  It.prototype.getClientRects = function() {
    var A = [];
    return s(
      this._fragmentFiber.child,
      !1,
      r1,
      A,
      void 0,
      void 0
    ), A;
  };
  function r1(A, t) {
    if (A.tag === 6) {
      A = A.stateNode;
      var e = A.ownerDocument.createRange();
      e.selectNodeContents(A), t.push.apply(t, e.getClientRects());
    } else
      A = C(A), t.push.apply(t, A.getClientRects());
    return !1;
  }
  It.prototype.getRootNode = function(A) {
    var t = D(
      this._fragmentFiber
    );
    return t === null ? this : C(t).getRootNode(A);
  }, It.prototype.compareDocumentPosition = function(A) {
    var t = D(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var e = [];
    s(
      this._fragmentFiber.child,
      !1,
      Oc,
      e,
      void 0,
      void 0
    );
    var a = C(t);
    if (e.length === 0) {
      if (e = a, Z(this._fragmentFiber)) {
        A: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break A;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (e = t);
      }
      t = this._fragmentFiber;
      var n = a = e.compareDocumentPosition(A);
      return e === A ? n = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (e = q(t)[1], e === null ? n = Node.DOCUMENT_POSITION_PRECEDING : (A = C(e).compareDocumentPosition(
        A
      ), n = A === 0 || A & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = C(e[0]), n = C(e[e.length - 1]);
    var l = Z(this._fragmentFiber) ? t.parentElement : a;
    if (l == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = l.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, l = l.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var o = t.compareDocumentPosition(A), f = n.compareDocumentPosition(A), g = o & Node.DOCUMENT_POSITION_CONTAINED_BY || f & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return f = a && l && o & Node.DOCUMENT_POSITION_FOLLOWING && f & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === A || l && n === A || g || f ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === A || !l && n === A ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || o1(
      t,
      this._fragmentFiber,
      e[0],
      e[e.length - 1],
      A
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function o1(A, t, e, a, n) {
    var l = Ga(n);
    if (A & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (e = !!l)
        A: {
          for (; l !== null; ) {
            if (l.tag === 7 && (l === t || l.alternate === t)) {
              e = !0;
              break A;
            }
            l = l.return;
          }
          e = !1;
        }
      return e;
    }
    if (A & Node.DOCUMENT_POSITION_CONTAINS) {
      if (l === null)
        return l = n.ownerDocument, n === l || n === l.documentElement || n === l.body;
      A: {
        for (l = t, t = D(t); l !== null; ) {
          if (!(l.tag !== 5 && l.tag !== 3 && l.tag !== 27 || l !== t && l.alternate !== t)) {
            l = !0;
            break A;
          }
          l = l.return;
        }
        l = !1;
      }
      return l;
    }
    return A & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!l) && !(t = l === e) && (t = sA(
      e,
      l,
      iA
    ), t === null ? t = !1 : (s(
      t,
      !0,
      aA,
      l,
      e
    ), l = H, H = null, t = l !== null)), t) : A & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!l) && !(t = l === a) && (t = sA(
      a,
      l,
      iA
    ), t === null ? t = !1 : (s(
      t,
      !0,
      uA,
      l,
      a
    ), l = H, I = H = null, t = l !== null)), t) : !1;
  }
  function x0(A, t) {
    var e = A.ownerDocument.createRange();
    e.selectNodeContents(A), A = e.getBoundingClientRect(), window.scrollTo(
      window.scrollX + A.left,
      t ? window.scrollY + A.top : window.scrollY + A.bottom - window.innerHeight
    );
  }
  It.prototype.scrollIntoView = function(A) {
    if (typeof A == "object") throw Error(i(566));
    var t = [];
    s(
      this._fragmentFiber.child,
      !1,
      Oc,
      t,
      void 0,
      void 0
    );
    var e = A !== !1;
    if (t.length === 0) {
      var a = q(
        this._fragmentFiber
      );
      if (a = e ? a[1] || a[0] || D(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        A = C(a), x0(A, e);
        return;
      }
      if (a = C(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          e = "host" in a ? a.host : null, e !== null && e.scrollIntoView(A);
          return;
        }
        a.scrollIntoView(A);
      }
    }
    for (a = e ? t.length - 1 : 0; a !== (e ? -1 : t.length); ) {
      var n = t[a];
      n.tag === 6 ? (n = C(n), x0(n, e)) : C(n).scrollIntoView(A), a += e ? -1 : 1;
    }
  };
  function c1(A, t) {
    return A = C(A), T0(A, t), !1;
  }
  function T0(A, t) {
    A.reactFragments == null && (A.reactFragments = /* @__PURE__ */ new Set()), A.reactFragments.add(t);
  }
  function U0(A, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a];
        A.addEventListener(
          n.type,
          n.attachedListener,
          $n(n.optionsOrUseCapture)
        );
      }
    A.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(l) {
      for (var o = 0, f = 0; f < he.length; f++) {
        var g = he[f];
        (g.fragmentInstance !== t || g.observer !== l || g.instance !== A) && (he[o++] = g);
      }
      he.length = o, l.observe(A);
    }), T0(A, t));
  }
  function s1(A, t) {
    var e = t._eventListeners;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a];
        A.removeEventListener(
          n.type,
          n.attachedListener,
          $n(n.optionsOrUseCapture)
        );
      }
    A.nodeType !== 3 && (e = t._observers, e !== null && e.forEach(function(l) {
      typeof l.rootMargin == "string" ? i1(
        t,
        l,
        A
      ) : l.unobserve(A);
    }), A.reactFragments != null && A.reactFragments.delete(t));
  }
  function Vc(A) {
    var t = A.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Vc(e), Ru(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      A.removeChild(e);
    }
  }
  function f1(A, t, e, a) {
    for (; A.nodeType === 1; ) {
      var n = e;
      if (A.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (A.nodeName !== "INPUT" || A.type !== "hidden"))
          break;
      } else if (a) {
        if (!A[Tl])
          switch (t) {
            case "meta":
              if (!A.hasAttribute("itemprop")) break;
              return A;
            case "link":
              if (l = A.getAttribute("rel"), l === "stylesheet" && A.hasAttribute("data-precedence"))
                break;
              if (l !== n.rel || A.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || A.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || A.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return A;
            case "style":
              if (A.hasAttribute("data-precedence")) break;
              return A;
            case "script":
              if (l = A.getAttribute("src"), (l !== (n.src == null ? null : n.src) || A.getAttribute("type") !== (n.type == null ? null : n.type) || A.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && l && A.hasAttribute("async") && !A.hasAttribute("itemprop"))
                break;
              return A;
            default:
              return A;
          }
      } else if (t === "input" && A.type === "hidden") {
        var l = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && A.getAttribute("name") === l)
          return A;
      } else return A;
      if (A = ue(A.nextSibling), A === null) break;
    }
    return null;
  }
  function d1(A, t, e) {
    if (t === "") return null;
    for (; A.nodeType !== 3; )
      if ((A.nodeType !== 1 || A.nodeName !== "INPUT" || A.type !== "hidden") && !e || (A = ue(A.nextSibling), A === null)) return null;
    return A;
  }
  function M0(A, t) {
    for (; A.nodeType !== 8; )
      if ((A.nodeType !== 1 || A.nodeName !== "INPUT" || A.type !== "hidden") && !t || (A = ue(A.nextSibling), A === null)) return null;
    return A;
  }
  function Kc(A) {
    return A.data === "$?" || A.data === "$~";
  }
  function wc(A) {
    return A.data === "$!" || A.data === "$?" && A.ownerDocument.readyState !== "loading";
  }
  function m1(A, t) {
    var e = A.ownerDocument;
    if (A.data === "$~") A._reactRetry = t;
    else if (A.data !== "$?" || e.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), A._reactRetry = a;
    }
  }
  function ue(A) {
    for (; A != null; A = A.nextSibling) {
      var t = A.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = A.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return A;
  }
  var Cc = null;
  function z0(A) {
    A = A.nextSibling;
    for (var t = 0; A; ) {
      if (A.nodeType === 8) {
        var e = A.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return ue(A.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      A = A.nextSibling;
    }
    return null;
  }
  function j0(A) {
    A = A.previousSibling;
    for (var t = 0; A; ) {
      if (A.nodeType === 8) {
        var e = A.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (t === 0) return A;
          t--;
        } else e !== "/$" && e !== "/&" || t++;
      }
      A = A.previousSibling;
    }
    return null;
  }
  function p1(A, t) {
    function e() {
      a = !0;
    }
    if (A.ownerDocument.activeElement === A) return !0;
    var a = !1;
    try {
      A.ownerDocument.addEventListener("focus", e, !0), (A.focus || HTMLElement.prototype.focus).call(A, t);
    } finally {
      A.ownerDocument.removeEventListener("focus", e, !0);
    }
    return a;
  }
  function g1(A) {
    m0(function() {
      m0(function(t) {
        return A(t);
      });
    });
  }
  function D0(A, t, e) {
    switch (t = uu(e), A) {
      case "html":
        if (A = t.documentElement, !A) throw Error(i(452));
        return A;
      case "head":
        if (A = t.head, !A) throw Error(i(453));
        return A;
      case "body":
        if (A = t.body, !A) throw Error(i(454));
        return A;
      default:
        throw Error(i(451));
    }
  }
  function R0(A, t, e) {
    for (var a in e) {
      var n = e[a];
      e.hasOwnProperty(a) && n != null && CA(A, t, a, null, Qh, n);
    }
    e.dangerouslySetInnerHTML != null && (A.textContent = ""), A.onclick === Ne && (A.onclick = null), Ru(A);
  }
  function qc(A) {
    for (var t = A.attributes; t.length; )
      A.removeAttributeNode(t[0]);
    Ru(A);
  }
  var ie = /* @__PURE__ */ new Map(), O0 = /* @__PURE__ */ new Set();
  function iu(A) {
    if (typeof A.getRootNode == "function") {
      var t = A.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return A.nodeType === 9 ? A : A.ownerDocument;
  }
  var $e = _.d;
  _.d = {
    f: y1,
    r: h1,
    D: v1,
    C: b1,
    L: S1,
    m: N1,
    X: T1,
    S: x1,
    M: U1
  };
  function y1() {
    var A = $e.f(), t = Vi();
    return A || t;
  }
  function h1(A) {
    var t = hn(A);
    t !== null && t.tag === 5 && t.type === "form" ? Vd(t) : $e.r(A);
  }
  var Al = typeof document > "u" ? null : document;
  function E0(A, t, e) {
    var a = Al;
    if (a && typeof t == "string" && t) {
      var n = $t(t);
      n = 'link[rel="' + A + '"][href="' + n + '"]', typeof e == "string" && (n += '[crossorigin="' + e + '"]'), O0.has(n) || (O0.add(n), A = { rel: A, crossOrigin: e, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), St(t, "link", A), st(t), a.head.appendChild(t)));
    }
  }
  function v1(A) {
    $e.D(A), E0("dns-prefetch", A, null);
  }
  function b1(A, t) {
    $e.C(A, t), E0("preconnect", A, t);
  }
  function S1(A, t, e) {
    $e.L(A, t, e);
    var a = Al;
    if (a && A && t) {
      var n = 'link[rel="preload"][as="' + $t(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (n += '[imagesrcset="' + $t(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (n += '[imagesizes="' + $t(
        e.imageSizes
      ) + '"]')) : n += '[href="' + $t(A) + '"]';
      var l = n;
      switch (t) {
        case "style":
          l = tl(A);
          break;
        case "script":
          l = el(A);
      }
      if (!(ie.has(l) || (A = J(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : A,
          as: t
        },
        e
      ), ie.set(l, A), a.querySelector(n) !== null || t === "style" && a.querySelector(ru(l)) || t === "script" && a.querySelector(ou(l))))) {
        var o = a.createElement("link");
        St(o, "link", A), t === "style" && (o[Du] = !0, o.onload = o.onerror = function() {
          Zs(o);
        }), st(o), a.head.appendChild(o);
      }
    }
  }
  function N1(A, t) {
    $e.m(A, t);
    var e = Al;
    if (e && A) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + $t(a) + '"][href="' + $t(A) + '"]', l = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          l = el(A);
      }
      if (!ie.has(l) && (A = J({ rel: "modulepreload", href: A }, t), ie.set(l, A), e.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(ou(l)))
              return;
        }
        a = e.createElement("link"), St(a, "link", A), st(a), e.head.appendChild(a);
      }
    }
  }
  function x1(A, t, e) {
    $e.S(A, t, e);
    var a = Al;
    if (a && A) {
      var n = vn(a).hoistableStyles, l = tl(A);
      t = t || "default";
      var o = n.get(l);
      if (!o) {
        var f = { loading: 0, preload: null };
        if (o = a.querySelector(
          ru(l)
        ))
          f.loading = 5;
        else {
          A = J(
            { rel: "stylesheet", href: A, "data-precedence": t },
            e
          ), (e = ie.get(l)) && kc(A, e);
          var g = o = a.createElement("link");
          st(g), St(g, "link", A), g._p = new Promise(function(T, E) {
            g.onload = T, g.onerror = E;
          }), g.addEventListener("load", function() {
            f.loading |= 1;
          }), g.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Yi(o, t, a);
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
  function T1(A, t) {
    $e.X(A, t);
    var e = Al;
    if (e && A) {
      var a = vn(e).hoistableScripts, n = el(A), l = a.get(n);
      l || (l = e.querySelector(ou(n)), l || (A = J({ src: A, async: !0 }, t), (t = ie.get(n)) && Bc(A, t), l = e.createElement("script"), st(l), St(l, "link", A), e.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, a.set(n, l));
    }
  }
  function U1(A, t) {
    $e.M(A, t);
    var e = Al;
    if (e && A) {
      var a = vn(e).hoistableScripts, n = el(A), l = a.get(n);
      l || (l = e.querySelector(ou(n)), l || (A = J({ src: A, async: !0, type: "module" }, t), (t = ie.get(n)) && Bc(A, t), l = e.createElement("script"), st(l), St(l, "link", A), e.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, a.set(n, l));
    }
  }
  function V0(A, t, e, a) {
    var n = (n = be.current) ? iu(n) : null;
    if (!n) throw Error(i(446));
    switch (A) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (e = tl(e.href), t = vn(
          n
        ).hoistableStyles, a = t.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          A = tl(e.href);
          var l = vn(
            n
          ).hoistableStyles, o = l.get(A);
          if (o || (n = n.ownerDocument || n, o = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, l.set(A, o), (l = n.querySelector(
            ru(A)
          )) ? l._p || (o.instance = l, o.state.loading = 5) : (l = ie.get(A), l || (l = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, ie.set(A, l)), M1(
            n,
            A,
            l,
            o.state
          ))), t && a === null)
            throw Error(i(528, ""));
          return o;
        }
        if (t && a !== null)
          throw Error(i(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (e = el(e), t = vn(
          n
        ).hoistableScripts, a = t.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(i(444, A));
    }
  }
  function tl(A) {
    return 'href="' + $t(A) + '"';
  }
  function ru(A) {
    return 'link[rel="stylesheet"][' + A + "]";
  }
  function K0(A) {
    return J({}, A, {
      "data-precedence": A.precedence,
      precedence: null
    });
  }
  function M1(A, t, e, a) {
    if (t = A.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[Du] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = A.createElement("link"), t[Du] = !0, t.onload = t.onerror = Zs.bind(null, t), St(t, "link", e), st(t), A.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function el(A) {
    return '[src="' + $t(A) + '"]';
  }
  function ou(A) {
    return "script[async]" + A;
  }
  function w0(A, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = A.querySelector(
            'style[data-href~="' + $t(e.href) + '"]'
          );
          if (a)
            return t.instance = a, st(a), a;
          var n = J({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (A.ownerDocument || A).createElement(
            "style"
          ), st(a), St(a, "style", n), Yi(a, e.precedence, A), t.instance = a;
        case "stylesheet":
          n = tl(e.href);
          var l = A.querySelector(
            ru(n)
          );
          if (l)
            return t.state.loading |= 4, t.instance = l, st(l), l;
          a = K0(e), (n = ie.get(n)) && kc(a, n), l = (A.ownerDocument || A).createElement("link"), st(l);
          var o = l;
          return o._p = new Promise(function(f, g) {
            o.onload = f, o.onerror = g;
          }), St(l, "link", a), t.state.loading |= 4, Yi(l, e.precedence, A), t.instance = l;
        case "script":
          return l = el(e.src), (n = A.querySelector(
            ou(l)
          )) ? (t.instance = n, st(n), n) : (a = e, (n = ie.get(l)) && (a = J({}, e), Bc(a, n)), A = A.ownerDocument || A, n = A.createElement("script"), st(n), St(n, "link", a), A.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(i(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Yi(a, e.precedence, A));
    return t.instance;
  }
  function Yi(A, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, l = n, o = 0; o < a.length; o++) {
      var f = a[o];
      if (f.dataset.precedence === t) l = f;
      else if (l !== n) break;
    }
    l ? l.parentNode.insertBefore(A, l.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(A, t.firstChild));
  }
  function kc(A, t) {
    A.crossOrigin == null && (A.crossOrigin = t.crossOrigin), A.referrerPolicy == null && (A.referrerPolicy = t.referrerPolicy), A.title == null && (A.title = t.title);
  }
  function Bc(A, t) {
    A.crossOrigin == null && (A.crossOrigin = t.crossOrigin), A.referrerPolicy == null && (A.referrerPolicy = t.referrerPolicy), A.integrity == null && (A.integrity = t.integrity);
  }
  var Hi = null;
  function C0(A, t, e) {
    if (Hi === null) {
      var a = /* @__PURE__ */ new Map(), n = Hi = /* @__PURE__ */ new Map();
      n.set(e, a);
    } else
      n = Hi, a = n.get(e), a || (a = /* @__PURE__ */ new Map(), n.set(e, a));
    if (a.has(A)) return a;
    for (a.set(A, null), e = e.getElementsByTagName(A), n = 0; n < e.length; n++) {
      var l = e[n];
      if (!(l[Tl] || l[gt] || A === "link" && l.getAttribute("rel") === "stylesheet") && l.namespaceURI !== "http://www.w3.org/2000/svg") {
        var o = l.getAttribute(t) || "";
        o = A + o;
        var f = a.get(o);
        f ? f.push(l) : a.set(o, [l]);
      }
    }
    return a;
  }
  function Yc(A, t, e) {
    A = A.ownerDocument || A, A.head.insertBefore(
      e,
      t === "title" ? A.querySelector("head > title") : null
    );
  }
  function z1(A, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
    switch (A) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return A = t.disabled, typeof t.precedence == "string" && A == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function q0(A, t) {
    return A === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function k0(A) {
    return !(A.type === "stylesheet" && (A.state.loading & 3) === 0);
  }
  function B0(A) {
    return (A.width || 100) * (A.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Y0(A, t) {
    typeof t.decode == "function" && (A.imgCount++, t.complete || (A.imgBytes += B0(t), A.suspenseyImages.push(t)), A = R1.bind(A), t.decode().then(A, A));
  }
  function j1(A, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var n = tl(a.href), l = t.querySelector(
          ru(n)
        );
        if (l) {
          t = l._p, t !== null && typeof t == "object" && typeof t.then == "function" && (A.count++, A = cu.bind(A), t.then(A, A)), e.state.loading |= 4, e.instance = l, st(l);
          return;
        }
        l = t.ownerDocument || t, a = K0(a), (n = ie.get(n)) && kc(a, n), l = l.createElement("link"), st(l);
        var o = l;
        o._p = new Promise(function(f, g) {
          o.onload = f, o.onerror = g;
        }), St(l, "link", a), e.instance = l;
      }
      A.stylesheets === null && (A.stylesheets = /* @__PURE__ */ new Map()), A.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (A.count++, e = cu.bind(A), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var Gi = 0;
  function D1(A, t) {
    return A.stylesheets && A.count === 0 && Zi(A, A.stylesheets), 0 < A.count || 0 < A.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (A.stylesheets && Zi(A, A.stylesheets), A.unsuspend) {
          var l = A.unsuspend;
          A.unsuspend = null, l();
        }
      }, 6e4 + t);
      0 < A.imgBytes && Gi === 0 && (Gi = 62500 * Wh());
      var n = setTimeout(
        function() {
          if (A.waitingForImages = !1, A.count === 0 && (A.stylesheets && Zi(A, A.stylesheets), A.unsuspend)) {
            var l = A.unsuspend;
            A.unsuspend = null, l();
          }
        },
        (A.imgBytes > Gi ? 50 : 800) + t
      );
      return A.unsuspend = e, function() {
        A.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function H0(A) {
    if (A.count === 0 && (A.imgCount === 0 || !A.waitingForImages)) {
      if (A.stylesheets) Zi(A, A.stylesheets);
      else if (A.unsuspend) {
        var t = A.unsuspend;
        A.unsuspend = null, t();
      }
    }
  }
  function cu() {
    this.count--, H0(this);
  }
  function R1() {
    this.imgCount--, H0(this);
  }
  var Fi = null;
  function Zi(A, t) {
    A.stylesheets = null, A.unsuspend !== null && (A.count++, Fi = /* @__PURE__ */ new Map(), t.forEach(O1, A), Fi = null, cu.call(A));
  }
  function O1(A, t) {
    if (!(t.state.loading & 4)) {
      var e = Fi.get(A);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Fi.set(A, e);
        for (var n = A.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), l = 0; l < n.length; l++) {
          var o = n[l];
          (o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (e.set(o.dataset.precedence, o), a = o);
        }
        a && e.set(null, a);
      }
      n = t.instance, o = n.getAttribute("data-precedence"), l = e.get(o) || a, l === a && e.set(null, n), e.set(o, n), this.count++, a = cu.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), l ? l.parentNode.insertBefore(n, l.nextSibling) : (A = A.nodeType === 9 ? A.head : A, A.insertBefore(n, A.firstChild)), t.state.loading |= 4;
    }
  }
  var al = {
    $$typeof: TA,
    Provider: null,
    Consumer: null,
    _currentValue: LA,
    _currentValue2: LA,
    _threadCount: 0
  };
  function E1(A, t, e, a, n, l, o, f, g) {
    this.tag = 1, this.containerInfo = A, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = vr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = vr(0), this.hiddenUpdates = vr(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = l, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = g, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function G0(A, t, e, a, n, l, o, f, g, T, E, K) {
    return A = new E1(
      A,
      t,
      e,
      o,
      g,
      T,
      E,
      K,
      f
    ), t = 1, l === !0 && (t |= 24), l = wt(3, null, null, t), A.current = l, l.stateNode = A, t = Ao(), t.refCount++, A.pooledCache = t, t.refCount++, l.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, no(l), A;
  }
  function F0(A) {
    return A ? (A = Dn, A) : Dn;
  }
  function Z0(A, t, e, a, n, l) {
    n = F0(n), a.context === null ? a.context = n : a.pendingContext = n, a = ga(t), a.payload = { element: e }, l = l === void 0 ? null : l, l !== null && (a.callback = l), e = ya(A, a, t), e !== null && (Bt(e, A, t), Hl(e, A, t));
  }
  function Q0(A, t) {
    if (A = A.memoizedState, A !== null && A.dehydrated !== null) {
      var e = A.retryLane;
      A.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function Hc(A, t) {
    Q0(A, t), (A = A.alternate) && Q0(A, t);
  }
  function J0(A) {
    if (A.tag === 13 || A.tag === 31) {
      var t = Ja(A, 67108864);
      t !== null && Bt(t, A, 67108864), Hc(A, 67108864);
    }
  }
  function W0(A) {
    if (A.tag === 13 || A.tag === 31) {
      var t = Xt();
      t = br(t);
      var e = Ja(A, t);
      e !== null && Bt(e, A, t), Hc(A, t);
    }
  }
  var nl = !0;
  function V1(A, t, e, a) {
    var n = L.T;
    L.T = null;
    var l = _.p;
    try {
      _.p = 2, Gc(A, t, e, a);
    } finally {
      _.p = l, L.T = n;
    }
  }
  function K1(A, t, e, a) {
    var n = L.T;
    L.T = null;
    var l = _.p;
    try {
      _.p = 8, Gc(A, t, e, a);
    } finally {
      _.p = l, L.T = n;
    }
  }
  function Gc(A, t, e, a) {
    if (nl) {
      var n = Fc(a);
      if (n === null)
        xc(
          A,
          t,
          a,
          Qi,
          e
        ), X0(A, a);
      else if (C1(
        n,
        A,
        t,
        e,
        a
      ))
        a.stopPropagation();
      else if (X0(A, a), t & 4 && -1 < w1.indexOf(A)) {
        for (; n !== null; ) {
          var l = hn(n);
          if (l !== null)
            switch (l.tag) {
              case 3:
                if (l = l.stateNode, l.current.memoizedState.isDehydrated) {
                  var o = Ha(l.pendingLanes);
                  if (o !== 0) {
                    var f = l;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; o; ) {
                      var g = 1 << 31 - RA(o);
                      f.entanglements[1] |= g, o &= ~g;
                    }
                    Ee(l), (OA & 6) === 0 && (Ri = Ut() + 500, au(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = Ja(l, 2), f !== null && Bt(f, l, 2), Vi(), Hc(l, 2);
            }
          if (l = Fc(a), l === null && xc(
            A,
            t,
            a,
            Qi,
            e
          ), l === n) break;
          n = l;
        }
        n !== null && a.stopPropagation();
      } else
        xc(
          A,
          t,
          a,
          null,
          e
        );
    }
  }
  function Fc(A) {
    return A = zr(A), Zc(A);
  }
  var Qi = null;
  function Zc(A) {
    if (Qi = null, A = Ga(A), A !== null) {
      var t = p(A);
      if (t === null) A = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (A = m(t), A !== null) return A;
          A = null;
        } else if (e === 31) {
          if (A = v(t), A !== null) return A;
          A = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          A = null;
        } else t !== A && (A = null);
      }
    }
    return Qi = A, null;
  }
  function L0(A) {
    switch (A) {
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
        switch (hl()) {
          case fe:
            return 2;
          case vl:
            return 8;
          case gn:
          case Mu:
            return 32;
          case bl:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Qc = !1, Da = null, Ra = null, Oa = null, su = /* @__PURE__ */ new Map(), fu = /* @__PURE__ */ new Map(), Ea = [], w1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function X0(A, t) {
    switch (A) {
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
        su.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        fu.delete(t.pointerId);
    }
  }
  function du(A, t, e, a, n, l) {
    return A === null || A.nativeEvent !== l ? (A = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: l,
      targetContainers: [n]
    }, t !== null && (t = hn(t), t !== null && J0(t)), A) : (A.eventSystemFlags |= a, t = A.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), A);
  }
  function C1(A, t, e, a, n) {
    switch (t) {
      case "focusin":
        return Da = du(
          Da,
          A,
          t,
          e,
          a,
          n
        ), !0;
      case "dragenter":
        return Ra = du(
          Ra,
          A,
          t,
          e,
          a,
          n
        ), !0;
      case "mouseover":
        return Oa = du(
          Oa,
          A,
          t,
          e,
          a,
          n
        ), !0;
      case "pointerover":
        var l = n.pointerId;
        return su.set(
          l,
          du(
            su.get(l) || null,
            A,
            t,
            e,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return l = n.pointerId, fu.set(
          l,
          du(
            fu.get(l) || null,
            A,
            t,
            e,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function I0(A) {
    var t = Ga(A.target);
    if (t !== null) {
      var e = p(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = m(e), t !== null) {
            A.blockedOn = t, Hs(A.priority, function() {
              W0(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = v(e), t !== null) {
            A.blockedOn = t, Hs(A.priority, function() {
              W0(e);
            });
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          A.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    A.blockedOn = null;
  }
  function Ji(A) {
    if (A.blockedOn !== null) return !1;
    for (var t = A.targetContainers; 0 < t.length; ) {
      var e = Fc(A.nativeEvent);
      if (e === null) {
        e = A.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        Mr = a, e.target.dispatchEvent(a), Mr = null;
      } else
        return t = hn(e), t !== null && J0(t), A.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function P0(A, t, e) {
    Ji(A) && e.delete(t);
  }
  function q1() {
    Qc = !1, Da !== null && Ji(Da) && (Da = null), Ra !== null && Ji(Ra) && (Ra = null), Oa !== null && Ji(Oa) && (Oa = null), su.forEach(P0), fu.forEach(P0);
  }
  function Wi(A, t) {
    A.blockedOn === t && (A.blockedOn = null, Qc || (Qc = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      q1
    )));
  }
  var Li = null;
  function _0(A) {
    Li !== A && (Li = A, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        Li === A && (Li = null);
        for (var t = 0; t < A.length; t += 3) {
          var e = A[t], a = A[t + 1], n = A[t + 2];
          if (typeof a != "function") {
            if (Zc(a || e) === null)
              continue;
            break;
          }
          var l = hn(e);
          l !== null && (A.splice(t, 3), t -= 3, Mo(
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
  function ll(A) {
    function t(g) {
      return Wi(g, A);
    }
    Da !== null && Wi(Da, A), Ra !== null && Wi(Ra, A), Oa !== null && Wi(Oa, A), su.forEach(t), fu.forEach(t);
    for (var e = 0; e < Ea.length; e++) {
      var a = Ea[e];
      a.blockedOn === A && (a.blockedOn = null);
    }
    for (; 0 < Ea.length && (e = Ea[0], e.blockedOn === null); )
      I0(e), e.blockedOn === null && Ea.shift();
    if (e = (A.ownerDocument || A).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var n = e[a], l = e[a + 1], o = n[Kt] || null;
        if (typeof l == "function")
          o || _0(e);
        else if (o) {
          var f = null;
          if (l && l.hasAttribute("formAction")) {
            if (n = l, o = l[Kt] || null)
              f = o.formAction;
            else if (Zc(n) !== null) continue;
          } else f = o.action;
          typeof f == "function" ? e[a + 1] = f : (e.splice(a, 3), a -= 3), _0(e);
        }
      }
  }
  function $0() {
    function A(l) {
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
    function t() {
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
      return navigation.addEventListener("navigate", A), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(e, 100), function() {
        a = !0, navigation.removeEventListener("navigate", A), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Jc(A) {
    this._internalRoot = A;
  }
  Xi.prototype.render = Jc.prototype.render = function(A) {
    var t = this._internalRoot;
    if (t === null) throw Error(i(409));
    var e = t.current, a = Xt();
    Z0(e, a, A, t, null, null);
  }, Xi.prototype.unmount = Jc.prototype.unmount = function() {
    var A = this._internalRoot;
    if (A !== null) {
      this._internalRoot = null;
      var t = A.containerInfo;
      Z0(A.current, 2, null, A, null, null), Vi(), t[yn] = null;
    }
  };
  function Xi(A) {
    this._internalRoot = A;
  }
  Xi.prototype.unstable_scheduleHydration = function(A) {
    if (A) {
      var t = Ys();
      A = { blockedOn: null, target: A, priority: t };
      for (var e = 0; e < Ea.length && t !== 0 && t < Ea[e].priority; e++) ;
      Ea.splice(e, 0, A), e === 0 && I0(A);
    }
  };
  var Ap = r.version;
  if (Ap !== "19.3.0")
    throw Error(
      i(
        527,
        Ap,
        "19.3.0"
      )
    );
  _.findDOMNode = function(A) {
    var t = A._reactInternals;
    if (t === void 0)
      throw typeof A.render == "function" ? Error(i(188)) : (A = Object.keys(A).join(","), Error(i(268, A)));
    return A = M(t), A = A !== null ? O(A) : null, A = A === null ? null : A.stateNode, A;
  };
  var k1 = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: L,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ii = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ii.isDisabled && Ii.supportsFiber)
      try {
        PA = Ii.inject(
          k1
        ), qA = Ii;
      } catch {
      }
  }
  return pu.createRoot = function(A, t) {
    if (!d(A)) throw Error(i(299));
    var e = !1, a = "", n = Fd, l = Zd, o = Qd;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (l = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = G0(
      A,
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
      $0
    ), A[yn] = t.current, Nc(A), new Jc(t);
  }, pu.hydrateRoot = function(A, t, e) {
    if (!d(A)) throw Error(i(299));
    var a = !1, n = "", l = Fd, o = Zd, f = Qd, g = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (n = e.identifierPrefix), e.onUncaughtError !== void 0 && (l = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError), e.formState !== void 0 && (g = e.formState)), t = G0(
      A,
      1,
      !0,
      t,
      e ?? null,
      a,
      n,
      g,
      l,
      o,
      f,
      $0
    ), t.context = F0(null), e = t.current, a = Xt(), a = br(a), n = ga(a), n.callback = null, ya(e, n, a), e = a, t.current.lanes = e, xl(t, e), Ee(t), A[yn] = t.current, Nc(A), new Xi(t);
  }, pu.version = "19.3.0", pu;
}
var cp;
function L1() {
  if (cp) return Lc.exports;
  cp = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (r) {
        console.error(r);
      }
  }
  return u(), Lc.exports = W1(), Lc.exports;
}
var X1 = L1(), z = bs();
const W = /* @__PURE__ */ wp(z), Su = /* @__PURE__ */ Y1({
  __proto__: null,
  default: W
}, [z]);
var Ss = Cp();
const I1 = /* @__PURE__ */ wp(Ss);
function P1(u) {
  if (typeof document > "u") return;
  let r = document.head || document.getElementsByTagName("head")[0], c = document.createElement("style");
  c.type = "text/css", r.appendChild(c), c.styleSheet ? c.styleSheet.cssText = u : c.appendChild(document.createTextNode(u));
}
const _1 = (u) => {
  switch (u) {
    case "success":
      return tv;
    case "info":
      return av;
    case "warning":
      return ev;
    case "error":
      return nv;
    default:
      return null;
  }
}, $1 = Array(12).fill(0), Av = ({ visible: u, className: r }) => /* @__PURE__ */ W.createElement("div", {
  className: [
    "sonner-loading-wrapper",
    r
  ].filter(Boolean).join(" "),
  "data-visible": u
}, /* @__PURE__ */ W.createElement("div", {
  className: "sonner-spinner"
}, $1.map((c, i) => /* @__PURE__ */ W.createElement("div", {
  className: "sonner-loading-bar",
  key: `spinner-bar-${i}`
})))), tv = /* @__PURE__ */ W.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ W.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
})), ev = /* @__PURE__ */ W.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ W.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
})), av = /* @__PURE__ */ W.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ W.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
})), nv = /* @__PURE__ */ W.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20",
  "aria-hidden": "true"
}, /* @__PURE__ */ W.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
})), lv = /* @__PURE__ */ W.createElement("svg", {
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
}, /* @__PURE__ */ W.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ W.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})), uv = () => {
  const [u, r] = W.useState(document.hidden);
  return W.useEffect(() => {
    const c = () => {
      r(document.hidden);
    };
    return document.addEventListener("visibilitychange", c), () => document.removeEventListener("visibilitychange", c);
  }, []), u;
};
let iv = 1;
const rv = 100, sp = (u) => {
  var r;
  return typeof (u == null ? void 0 : u.id) == "number" || (u == null || (r = u.id) == null ? void 0 : r.length) > 0 ? u.id : iv++;
};
class ov {
  constructor() {
    this.subscribe = (r) => (this.subscribers.push(r), this.getActiveToasts().forEach((c) => r(c)), () => {
      const c = this.subscribers.indexOf(r);
      this.subscribers.splice(c, 1);
    }), this.publish = (r) => {
      this.subscribers.forEach((c) => c(r));
    }, this.addToast = (r) => {
      this.publish(r), this.toasts = [
        ...this.toasts,
        r
      ], this.trimHistory();
    }, this.trimHistory = () => {
      let r = this.toasts.length - rv;
      r <= 0 || (this.toasts = this.toasts.filter((c) => r > 0 && this.dismissedToasts.has(c.id) ? (this.dismissedToasts.delete(c.id), r--, !1) : !0));
    }, this.create = (r) => {
      const { message: c, ...i } = r, d = sp(r), p = this.pendingDismissals.get(d);
      p !== void 0 && (cancelAnimationFrame(p), this.pendingDismissals.delete(d), this.dismissedToasts.delete(d));
      const m = this.dismissedToasts.has(d), v = r.dismissible === void 0 ? !0 : r.dismissible;
      return m && (this.dismissedToasts.delete(d), this.toasts = this.toasts.filter((M) => M.id !== d)), (m ? void 0 : this.toasts.find((M) => M.id === d)) ? this.toasts = this.toasts.map((M) => M.id === d ? (this.publish({
        ...M,
        ...r,
        id: d,
        title: c
      }), {
        ...M,
        ...r,
        id: d,
        dismissible: v,
        title: c
      }) : M) : this.addToast({
        title: c,
        ...i,
        dismissible: v,
        id: d
      }), d;
    }, this.dismiss = (r) => {
      if (r == null)
        return this.getActiveToasts().forEach((i) => {
          this.dismissedToasts.add(i.id), this.subscribers.forEach((d) => d({
            id: i.id,
            dismiss: !0
          }));
        }), r;
      this.dismissedToasts.add(r);
      const c = this.pendingDismissals.get(r);
      return c !== void 0 && cancelAnimationFrame(c), this.pendingDismissals.set(r, requestAnimationFrame(() => {
        this.pendingDismissals.delete(r), this.subscribers.forEach((i) => i({
          id: r,
          dismiss: !0
        }));
      })), r;
    }, this.message = (r, c) => this.create({
      ...c,
      message: r,
      type: void 0
    }), this.error = (r, c) => this.create({
      ...c,
      message: r,
      type: "error"
    }), this.success = (r, c) => this.create({
      ...c,
      type: "success",
      message: r
    }), this.info = (r, c) => this.create({
      ...c,
      type: "info",
      message: r
    }), this.warning = (r, c) => this.create({
      ...c,
      type: "warning",
      message: r
    }), this.loading = (r, c) => this.create({
      ...c,
      type: "loading",
      message: r
    }), this.promise = (r, c) => {
      if (!c)
        return;
      let i;
      c.loading !== void 0 && (i = this.create({
        ...c,
        promise: r,
        type: "loading",
        message: c.loading,
        description: typeof c.description != "function" ? c.description : void 0
      }));
      const d = Promise.resolve(r instanceof Function ? r() : r);
      let p = i !== void 0, m;
      const v = d.then(async (M) => {
        if (m = [
          "resolve",
          M
        ], W.isValidElement(M))
          p = !1, this.create({
            id: i,
            type: "default",
            message: M
          });
        else if (sv(M) && !M.ok) {
          p = !1;
          const s = typeof c.error == "function" ? await c.error(`HTTP error! status: ${M.status}`) : c.error, D = typeof c.description == "function" ? await c.description(`HTTP error! status: ${M.status}`) : c.description, q = typeof s == "object" && !W.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: i,
            type: "error",
            description: D,
            ...q
          });
        } else if (M instanceof Error) {
          p = !1;
          const s = typeof c.error == "function" ? await c.error(M) : c.error, D = typeof c.description == "function" ? await c.description(M) : c.description, q = typeof s == "object" && !W.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: i,
            type: "error",
            description: D,
            ...q
          });
        } else if (c.success !== void 0) {
          p = !1;
          const s = typeof c.success == "function" ? await c.success(M) : c.success, D = typeof c.description == "function" ? await c.description(M) : c.description, q = typeof s == "object" && !W.isValidElement(s) ? s : {
            message: s
          };
          this.create({
            id: i,
            type: "success",
            description: D,
            ...q
          });
        }
      }).catch(async (M) => {
        if (m = [
          "reject",
          M
        ], c.error !== void 0) {
          p = !1;
          const O = typeof c.error == "function" ? await c.error(M) : c.error, s = typeof c.description == "function" ? await c.description(M) : c.description, Z = typeof O == "object" && !W.isValidElement(O) ? O : {
            message: O
          };
          this.create({
            id: i,
            type: "error",
            description: s,
            ...Z
          });
        }
      }).finally(() => {
        p && (this.dismiss(i), i = void 0), c.finally == null || c.finally.call(c);
      }), S = () => new Promise((M, O) => v.then(() => m[0] === "reject" ? O(m[1]) : M(m[1])).catch(O));
      return typeof i != "string" && typeof i != "number" ? {
        unwrap: S
      } : Object.assign(i, {
        unwrap: S
      });
    }, this.custom = (r, c) => {
      const i = sp(c);
      return this.create({
        ...c,
        jsx: r(i),
        id: i,
        type: void 0
      }), i;
    }, this.getActiveToasts = () => this.toasts.filter((r) => !this.dismissedToasts.has(r.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set(), this.pendingDismissals = /* @__PURE__ */ new Map();
  }
}
const Yt = new ov(), cv = (u, r) => Yt.message(u, r), sv = (u) => u && typeof u == "object" && "ok" in u && typeof u.ok == "boolean" && "status" in u && typeof u.status == "number", fv = cv, dv = () => Yt.toasts, mv = () => Yt.getActiveToasts(), gu = Object.assign(fv, {
  success: Yt.success,
  info: Yt.info,
  warning: Yt.warning,
  error: Yt.error,
  custom: Yt.custom,
  message: Yt.message,
  promise: Yt.promise,
  dismiss: Yt.dismiss,
  loading: Yt.loading
}, {
  getHistory: dv,
  getToasts: mv
});
P1("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--normal-text);background:var(--normal-bg);border:1px solid var(--normal-border);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{-webkit-user-select:none;user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function Pi(u) {
  return u.label !== void 0;
}
const pv = 3, gv = "24px", yv = "16px", fp = 4e3, hv = 356, vv = 14, bv = 45, Sv = 200;
function Ve(...u) {
  return u.filter(Boolean).join(" ");
}
function Nv(u) {
  const [r, c] = u.split("-"), i = [];
  return r && i.push(r), c && i.push(c), i;
}
const xv = (u) => {
  var r, c, i, d, p, m, v, S, M;
  const { invert: O, toast: s, unstyled: D, interacting: Z, setHeights: q, visibleToasts: Y, heights: C, index: H, toasts: I, expanded: aA, removeToast: uA, defaultRichColors: iA, closeButton: sA, style: J, cancelButtonStyle: B, actionButtonStyle: gA, className: xA = "", descriptionClassName: zA = "", duration: oA, position: JA, gap: HA, expandByDefault: TA, classNames: k, icons: P, closeButtonAriaLabel: lA = "Close toast" } = u, [dA, F] = W.useState(null), [GA, WA] = W.useState(null), [rt, h] = W.useState(!1), [U, w] = W.useState(!1), [G, tA] = W.useState(!1), [Q, cA] = W.useState(!1), [L, _] = W.useState(!1), [LA, BA] = W.useState(0), [la, Ht] = W.useState(0), XA = W.useRef(s.duration || oA || fp), VA = W.useRef(null), tt = W.useRef(null), ka = H === 0, be = H + 1 <= Y, et = s.type, Ba = et ?? "default", Gt = s.dismissible !== !1, pl = s.className || "", mn = s.descriptionClassName || "", ua = W.useMemo(() => C.findIndex((mA) => mA.toastId === s.id) || 0, [
    C,
    s.id
  ]), xu = W.useMemo(() => {
    var mA;
    return (mA = s.closeButton) != null ? mA : sA;
  }, [
    s.closeButton,
    sA
  ]), se = W.useMemo(() => s.duration || oA || fp, [
    s.duration,
    oA
  ]), Ya = W.useRef(0), Se = W.useRef(0), Tu = W.useRef(0), ke = W.useRef(null), [gl, yl] = JA.split("-"), pn = W.useMemo(() => C.reduce((mA, at, PA) => PA >= ua ? mA : mA + at.height, 0), [
    C,
    ua
  ]), Uu = uv(), Pt = W.useMemo(() => {
    var mA;
    return (mA = u.swipeDirections) != null ? mA : Nv(JA);
  }, [
    u.swipeDirections,
    JA
  ]), Ut = s.invert || O, hl = et === "loading";
  Se.current = W.useMemo(() => ua * HA + pn, [
    ua,
    pn
  ]), W.useEffect(() => {
    XA.current = se;
  }, [
    se
  ]), W.useEffect(() => {
    h(!0);
  }, []), W.useEffect(() => {
    const mA = tt.current;
    if (mA) {
      const at = mA.getBoundingClientRect().height;
      return Ht(at), q((PA) => [
        {
          toastId: s.id,
          height: at,
          position: s.position
        },
        ...PA
      ]), () => q((PA) => PA.filter((qA) => qA.toastId !== s.id));
    }
  }, [
    q,
    s.id
  ]), W.useLayoutEffect(() => {
    if (!rt) return;
    const mA = tt.current, at = mA.style.height;
    mA.style.height = "auto";
    const PA = mA.getBoundingClientRect().height;
    mA.style.height = at, Ht(PA), q((qA) => qA.find((RA) => RA.toastId === s.id) ? qA.map((RA) => RA.toastId === s.id ? {
      ...RA,
      height: PA
    } : RA) : [
      {
        toastId: s.id,
        height: PA,
        position: s.position
      },
      ...qA
    ]);
  }, [
    rt,
    s.title,
    s.description,
    q,
    s.id,
    s.jsx,
    s.action,
    s.cancel
  ]);
  const fe = W.useCallback(() => {
    w(!0), BA(Se.current), q((mA) => mA.filter((at) => at.toastId !== s.id)), setTimeout(() => {
      uA(s);
    }, Sv);
  }, [
    s,
    uA,
    q,
    Se
  ]);
  W.useEffect(() => {
    if (s.promise && et === "loading" || s.duration === 1 / 0 || s.type === "loading") return;
    let mA;
    return aA || Z || Uu ? (() => {
      if (Tu.current < Ya.current) {
        const qA = (/* @__PURE__ */ new Date()).getTime() - Ya.current;
        XA.current = XA.current - qA;
      }
      Tu.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      XA.current !== 1 / 0 && (Ya.current = (/* @__PURE__ */ new Date()).getTime(), mA = setTimeout(() => {
        s.onAutoClose == null || s.onAutoClose.call(s, s), fe();
      }, XA.current));
    })(), () => clearTimeout(mA);
  }, [
    aA,
    Z,
    s,
    et,
    Uu,
    fe
  ]), W.useEffect(() => {
    s.delete && (fe(), s.onDismiss == null || s.onDismiss.call(s, s));
  }, [
    fe,
    s.delete
  ]);
  function vl() {
    var mA;
    if (P != null && P.loading) {
      var at;
      return /* @__PURE__ */ W.createElement("div", {
        className: Ve(k == null ? void 0 : k.loader, s == null || (at = s.classNames) == null ? void 0 : at.loader, "sonner-loader"),
        "data-visible": et === "loading"
      }, P.loading);
    }
    return /* @__PURE__ */ W.createElement(Av, {
      className: Ve(k == null ? void 0 : k.loader, s == null || (mA = s.classNames) == null ? void 0 : mA.loader),
      visible: et === "loading"
    });
  }
  const gn = s.icon || (P == null ? void 0 : P[et]) || _1(et);
  var Mu, bl;
  return /* @__PURE__ */ W.createElement("li", {
    tabIndex: 0,
    ref: tt,
    className: Ve(xA, pl, k == null ? void 0 : k.toast, s == null || (r = s.classNames) == null ? void 0 : r.toast, k == null ? void 0 : k[Ba], s == null || (c = s.classNames) == null ? void 0 : c[Ba]),
    "data-sonner-toast": "",
    "data-rich-colors": (Mu = s.richColors) != null ? Mu : iA,
    "data-styled": !(s.jsx || s.unstyled || D),
    "data-mounted": rt,
    "data-promise": !!s.promise,
    "data-swiped": L,
    "data-removed": U,
    "data-visible": be,
    "data-y-position": gl,
    "data-x-position": yl,
    "data-index": H,
    "data-front": ka,
    "data-swiping": G,
    "data-dismissible": Gt,
    "data-type": et,
    "data-invert": Ut,
    "data-swipe-out": Q,
    "data-swipe-direction": GA,
    "data-expanded": !!(aA || TA && rt),
    "data-testid": s.testId,
    style: {
      "--index": H,
      "--toasts-before": H,
      "--z-index": I.length - H,
      "--offset": `${U ? LA : Se.current}px`,
      "--initial-height": TA ? "auto" : `${la}px`,
      ...J,
      ...s.style
    },
    onDragEnd: () => {
      tA(!1), F(null), ke.current = null;
    },
    onPointerDown: (mA) => {
      mA.button !== 2 && (hl || !Gt || (VA.current = /* @__PURE__ */ new Date(), BA(Se.current), mA.target.setPointerCapture(mA.pointerId), mA.target.tagName !== "BUTTON" && (tA(!0), ke.current = {
        x: mA.clientX,
        y: mA.clientY
      })));
    },
    onPointerUp: () => {
      var mA, at, PA;
      if (Q || !Gt) return;
      ke.current = null;
      const qA = Number(((mA = tt.current) == null ? void 0 : mA.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), Et = Number(((at = tt.current) == null ? void 0 : at.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), RA = (/* @__PURE__ */ new Date()).getTime() - ((PA = VA.current) == null ? void 0 : PA.getTime()), Vt = dA === "x" ? qA : Et, _t = Math.abs(Vt) / RA;
      if ((dA === "x" ? Pt.includes(qA > 0 ? "right" : "left") : Pt.includes(Et > 0 ? "bottom" : "top")) && (Math.abs(Vt) >= bv || _t > 0.11)) {
        BA(Se.current), s.onDismiss == null || s.onDismiss.call(s, s), WA(dA === "x" ? qA > 0 ? "right" : "left" : Et > 0 ? "down" : "up"), fe(), cA(!0);
        return;
      } else {
        var Mt, ia;
        (Mt = tt.current) == null || Mt.style.setProperty("--swipe-amount-x", "0px"), (ia = tt.current) == null || ia.style.setProperty("--swipe-amount-y", "0px");
      }
      _(!1), tA(!1), F(null);
    },
    onPointerMove: (mA) => {
      var at, PA, qA;
      if (!ke.current || !Gt || ((at = window.getSelection()) == null ? void 0 : at.toString().length) > 0) return;
      const RA = mA.clientY - ke.current.y, Vt = mA.clientX - ke.current.x;
      !dA && (Math.abs(Vt) > 1 || Math.abs(RA) > 1) && F(Math.abs(Vt) > Math.abs(RA) ? "x" : "y");
      let _t = {
        x: 0,
        y: 0
      };
      const Sl = (Mt) => 1 / (1.5 + Math.abs(Mt) / 20);
      if (dA === "y") {
        if (Pt.includes("top") || Pt.includes("bottom"))
          if (Pt.includes("top") && RA < 0 || Pt.includes("bottom") && RA > 0)
            _t.y = RA;
          else {
            const Mt = RA * Sl(RA);
            _t.y = Math.abs(Mt) < Math.abs(RA) ? Mt : RA;
          }
      } else if (dA === "x" && (Pt.includes("left") || Pt.includes("right")))
        if (Pt.includes("left") && Vt < 0 || Pt.includes("right") && Vt > 0)
          _t.x = Vt;
        else {
          const Mt = Vt * Sl(Vt);
          _t.x = Math.abs(Mt) < Math.abs(Vt) ? Mt : Vt;
        }
      (Math.abs(_t.x) > 0 || Math.abs(_t.y) > 0) && _(!0), (PA = tt.current) == null || PA.style.setProperty("--swipe-amount-x", `${_t.x}px`), (qA = tt.current) == null || qA.style.setProperty("--swipe-amount-y", `${_t.y}px`);
    }
  }, xu && !s.jsx && et !== "loading" ? /* @__PURE__ */ W.createElement("button", {
    "aria-label": lA,
    "data-disabled": hl,
    "data-close-button": !0,
    onClick: hl || !Gt ? () => {
    } : () => {
      fe(), s.onDismiss == null || s.onDismiss.call(s, s);
    },
    className: Ve(k == null ? void 0 : k.closeButton, s == null || (i = s.classNames) == null ? void 0 : i.closeButton)
  }, (bl = P == null ? void 0 : P.close) != null ? bl : lv) : null, (et || s.icon || s.promise) && s.icon !== null && ((P == null ? void 0 : P[et]) !== null || s.icon) ? /* @__PURE__ */ W.createElement("div", {
    "data-icon": "",
    className: Ve(k == null ? void 0 : k.icon, s == null || (d = s.classNames) == null ? void 0 : d.icon)
  }, et === "loading" ? s.icon || vl() : s.promise ? vl() : null, et !== "loading" ? gn : null) : null, /* @__PURE__ */ W.createElement("div", {
    "data-content": "",
    className: Ve(k == null ? void 0 : k.content, s == null || (p = s.classNames) == null ? void 0 : p.content)
  }, /* @__PURE__ */ W.createElement("div", {
    "data-title": "",
    className: Ve(k == null ? void 0 : k.title, s == null || (m = s.classNames) == null ? void 0 : m.title)
  }, s.jsx ? s.jsx : typeof s.title == "function" ? s.title() : s.title), s.description ? /* @__PURE__ */ W.createElement("div", {
    "data-description": "",
    className: Ve(zA, mn, k == null ? void 0 : k.description, s == null || (v = s.classNames) == null ? void 0 : v.description)
  }, typeof s.description == "function" ? s.description() : s.description) : null), /* @__PURE__ */ W.isValidElement(s.cancel) ? s.cancel : s.cancel && Pi(s.cancel) ? /* @__PURE__ */ W.createElement("button", {
    "data-button": !0,
    "data-cancel": !0,
    style: s.cancelButtonStyle || B,
    onClick: (mA) => {
      Pi(s.cancel) && Gt && (s.cancel.onClick == null || s.cancel.onClick.call(s.cancel, mA), fe());
    },
    className: Ve(k == null ? void 0 : k.cancelButton, s == null || (S = s.classNames) == null ? void 0 : S.cancelButton)
  }, s.cancel.label) : null, /* @__PURE__ */ W.isValidElement(s.action) ? s.action : s.action && Pi(s.action) ? /* @__PURE__ */ W.createElement("button", {
    "data-button": !0,
    "data-action": !0,
    style: s.actionButtonStyle || gA,
    onClick: (mA) => {
      Pi(s.action) && (s.action.onClick == null || s.action.onClick.call(s.action, mA), !mA.defaultPrevented && fe());
    },
    className: Ve(k == null ? void 0 : k.actionButton, s == null || (M = s.classNames) == null ? void 0 : M.actionButton)
  }, s.action.label) : null);
};
function dp() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const u = document.documentElement.getAttribute("dir");
  return u === "auto" || !u ? window.getComputedStyle(document.documentElement).direction : u;
}
function Tv(u, r) {
  const c = {};
  return [
    u,
    r
  ].forEach((i, d) => {
    const p = d === 1, m = p ? "--mobile-offset" : "--offset", v = p ? yv : gv;
    function S(M) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((O) => {
        c[`${m}-${O}`] = typeof M == "number" ? `${M}px` : M;
      });
    }
    typeof i == "number" || typeof i == "string" ? S(i) : typeof i == "object" ? [
      "top",
      "right",
      "bottom",
      "left"
    ].forEach((M) => {
      i[M] === void 0 ? c[`${m}-${M}`] = v : c[`${m}-${M}`] = typeof i[M] == "number" ? `${i[M]}px` : i[M];
    }) : S(v);
  }), c;
}
const Uv = /* @__PURE__ */ W.forwardRef(function(r, c) {
  const { id: i, invert: d, position: p = "bottom-right", hotkey: m = [
    "altKey",
    "KeyT"
  ], expand: v, closeButton: S, className: M, offset: O, mobileOffset: s, theme: D = "light", richColors: Z, duration: q, style: Y, visibleToasts: C = pv, toastOptions: H, dir: I = dp(), gap: aA = vv, icons: uA, customAriaLabel: iA, containerAriaLabel: sA = "Notifications" } = r, [J, B] = W.useState([]), gA = W.useMemo(() => i ? J.filter((h) => h.toasterId === i) : J.filter((h) => !h.toasterId), [
    J,
    i
  ]), xA = W.useMemo(() => Array.from(new Set([
    p
  ].concat(gA.filter((h) => h.position).map((h) => h.position)))), [
    gA,
    p
  ]), [zA, oA] = W.useState([]), [JA, HA] = W.useState(!1), [TA, k] = W.useState(!1), [P, lA] = W.useState(D !== "system" ? D : typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), dA = W.useRef(null), F = m.join("+").replace(/Key/g, "").replace(/Digit/g, ""), GA = W.useRef(null), WA = W.useRef(!1), rt = W.useCallback((h) => {
    B((U) => {
      var w;
      return (w = U.find((G) => G.id === h.id)) != null && w.delete || Yt.dismiss(h.id), U.filter(({ id: G }) => G !== h.id);
    });
  }, []);
  return W.useEffect(() => Yt.subscribe((h) => {
    if (h.dismiss) {
      requestAnimationFrame(() => {
        B((U) => U.map((w) => w.id === h.id ? {
          ...w,
          delete: !0
        } : w));
      });
      return;
    }
    setTimeout(() => {
      I1.flushSync(() => {
        B((U) => {
          const w = U.findIndex((G) => G.id === h.id);
          return w !== -1 ? [
            ...U.slice(0, w),
            {
              ...U[w],
              ...h
            },
            ...U.slice(w + 1)
          ] : [
            h,
            ...U
          ];
        });
      });
    });
  }), []), W.useEffect(() => {
    if (D !== "system") {
      lA(D);
      return;
    }
    if (D === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? lA("dark") : lA("light")), typeof window > "u") return;
    const h = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      h.addEventListener("change", ({ matches: U }) => {
        lA(U ? "dark" : "light");
      });
    } catch {
      h.addListener(({ matches: w }) => {
        try {
          lA(w ? "dark" : "light");
        } catch (G) {
          console.error(G);
        }
      });
    }
  }, [
    D
  ]), W.useEffect(() => {
    J.length <= 1 && HA(!1);
  }, [
    J
  ]), W.useEffect(() => {
    const h = (U) => {
      var w;
      if (m.length > 0 && m.every((Q) => U[Q] || U.code === Q)) {
        var tA;
        HA(!0), (tA = dA.current) == null || tA.focus();
      }
      U.code === "Escape" && (document.activeElement === dA.current || (w = dA.current) != null && w.contains(document.activeElement)) && HA(!1);
    };
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
  }, [
    m
  ]), W.useEffect(() => {
    if (dA.current)
      return () => {
        GA.current && (GA.current.focus({
          preventScroll: !0
        }), GA.current = null, WA.current = !1);
      };
  }, [
    dA.current
  ]), // Remove item from normal navigation flow, only available via hotkey
  /* @__PURE__ */ W.createElement("section", {
    ref: c,
    "aria-label": iA ?? `${sA} ${F}`,
    tabIndex: -1,
    "aria-live": "polite",
    "aria-relevant": "additions text",
    "aria-atomic": "false",
    suppressHydrationWarning: !0,
    "data-react-aria-top-layer": !0
  }, xA.map((h, U) => {
    var w;
    const [G, tA] = h.split("-");
    return gA.length ? /* @__PURE__ */ W.createElement("ol", {
      key: h,
      dir: I === "auto" ? dp() : I,
      tabIndex: -1,
      ref: dA,
      className: M,
      "data-sonner-toaster": !0,
      "data-sonner-theme": P,
      "data-y-position": G,
      "data-x-position": tA,
      style: {
        "--front-toast-height": `${((w = zA[0]) == null ? void 0 : w.height) || 0}px`,
        "--width": `${hv}px`,
        "--gap": `${aA}px`,
        ...Y,
        ...Tv(O, s)
      },
      onBlur: (Q) => {
        WA.current && !Q.currentTarget.contains(Q.relatedTarget) && (WA.current = !1, GA.current && (GA.current.focus({
          preventScroll: !0
        }), GA.current = null));
      },
      onFocus: (Q) => {
        Q.target instanceof HTMLElement && Q.target.dataset.dismissible === "false" || WA.current || (WA.current = !0, GA.current = Q.relatedTarget);
      },
      onMouseEnter: () => HA(!0),
      onMouseMove: () => HA(!0),
      onMouseLeave: () => {
        TA || HA(!1);
      },
      onDragEnd: () => HA(!1),
      onPointerDown: (Q) => {
        Q.target instanceof HTMLElement && Q.target.dataset.dismissible === "false" || k(!0);
      },
      onPointerUp: () => k(!1)
    }, gA.filter((Q) => !Q.position && U === 0 || Q.position === h).map((Q, cA) => {
      var L, _;
      return /* @__PURE__ */ W.createElement(xv, {
        key: Q.id,
        icons: uA,
        index: cA,
        toast: Q,
        defaultRichColors: Z,
        duration: (L = H == null ? void 0 : H.duration) != null ? L : q,
        className: H == null ? void 0 : H.className,
        descriptionClassName: H == null ? void 0 : H.descriptionClassName,
        invert: d,
        visibleToasts: C,
        closeButton: (_ = H == null ? void 0 : H.closeButton) != null ? _ : S,
        interacting: TA,
        position: h,
        style: H == null ? void 0 : H.style,
        unstyled: H == null ? void 0 : H.unstyled,
        classNames: H == null ? void 0 : H.classNames,
        cancelButtonStyle: H == null ? void 0 : H.cancelButtonStyle,
        actionButtonStyle: H == null ? void 0 : H.actionButtonStyle,
        closeButtonAriaLabel: H == null ? void 0 : H.closeButtonAriaLabel,
        removeToast: rt,
        toasts: gA.filter((LA) => LA.position == Q.position),
        heights: zA.filter((LA) => LA.position == Q.position),
        setHeights: oA,
        expandByDefault: v,
        gap: aA,
        expanded: JA,
        swipeDirections: r.swipeDirections
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
const Mv = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), qp = (...u) => u.filter((r, c, i) => !!r && r.trim() !== "" && i.indexOf(r) === c).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var zv = {
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
const jv = z.forwardRef(
  ({
    color: u = "currentColor",
    size: r = 24,
    strokeWidth: c = 2,
    absoluteStrokeWidth: i,
    className: d = "",
    children: p,
    iconNode: m,
    ...v
  }, S) => z.createElement(
    "svg",
    {
      ref: S,
      ...zv,
      width: r,
      height: r,
      stroke: u,
      strokeWidth: i ? Number(c) * 24 / Number(r) : c,
      className: qp("lucide", d),
      ...v
    },
    [
      ...m.map(([M, O]) => z.createElement(M, O)),
      ...Array.isArray(p) ? p : [p]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xt = (u, r) => {
  const c = z.forwardRef(
    ({ className: i, ...d }, p) => z.createElement(jv, {
      ref: p,
      iconNode: r,
      className: qp(`lucide-${Mv(u)}`, i),
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
const Dv = xt("Bell", [
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
const Rv = xt("Bike", [
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
const Ov = xt("CalendarDays", [
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
const kp = xt("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ev = xt("ChefHat", [
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
const Vv = xt("Flame", [
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
const Bp = xt("MapPin", [
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
const Kv = xt("Menu", [
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
const wv = xt("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yp = xt("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cv = xt("Save", [
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
const Hp = xt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qv = xt("ShoppingBag", [
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
const kv = xt("SlidersHorizontal", [
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
const Bv = xt("Sparkles", [
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
const mp = xt("Trash2", [
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
const Gp = xt("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function Yv({ actorName: u, actorRole: r, pendingCount: c, onMenu: i, onBell: d, onSearch: p }) {
  const m = new Intl.DateTimeFormat("ar-EG", { timeZone: "Africa/Cairo", weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" }).format(/* @__PURE__ */ new Date());
  return /* @__PURE__ */ y.jsx("header", { className: "sticky top-0 z-30 border-b border-border/70 bg-surface/80 backdrop-blur-xl", children: /* @__PURE__ */ y.jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5 sm:py-3", children: [
    /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ y.jsx(
        "button",
        {
          type: "button",
          "aria-label": "القائمة",
          onClick: i,
          className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground",
          children: /* @__PURE__ */ y.jsx(Kv, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ y.jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground", children: /* @__PURE__ */ y.jsx(Ev, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ y.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ y.jsxs("p", { className: "text-lg font-extrabold tracking-tight", children: [
            "CARD",
            /* @__PURE__ */ y.jsx("span", { className: "text-brand", children: "fy" })
          ] }),
          /* @__PURE__ */ y.jsx("p", { className: "hidden text-[11px] text-muted-foreground sm:block", children: "Restaurant POS" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "relative hidden min-w-0 md:block", children: [
      /* @__PURE__ */ y.jsx(Hp, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ y.jsx(
        "input",
        {
          type: "search",
          onChange: (v) => p(v.target.value),
          placeholder: "ابحث عن منتج، صنف، أو استخدم الكود ...",
          className: "h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-16 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/60"
        }
      ),
      /* @__PURE__ */ y.jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground", children: "Ctrl + K" })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 py-2 text-xs text-muted-foreground xl:flex", children: [
        /* @__PURE__ */ y.jsx(Ov, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ y.jsx("span", { className: "whitespace-nowrap", children: m })
      ] }),
      /* @__PURE__ */ y.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "الإشعارات",
          onClick: d,
          className: "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted-foreground transition-colors hover:text-foreground",
          children: [
            /* @__PURE__ */ y.jsx(Dv, { className: "h-5 w-5" }),
            c > 0 && /* @__PURE__ */ y.jsx("span", { className: "absolute -top-1 -left-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground", children: c > 99 ? "99+" : c })
          ]
        }
      ),
      /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-2 py-1.5 sm:px-3", children: [
        /* @__PURE__ */ y.jsx("span", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold", children: u.trim().split(/\s+/).slice(0, 2).map((v) => v[0]).join("") || "C" }),
        /* @__PURE__ */ y.jsxs("div", { className: "hidden leading-tight sm:block", children: [
          /* @__PURE__ */ y.jsx("p", { className: "text-xs font-bold", children: u }),
          /* @__PURE__ */ y.jsx("p", { className: "text-[11px] text-muted-foreground", children: r })
        ] })
      ] })
    ] })
  ] }) });
}
const Fp = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/61VfSlACEQAAAAEAAFVVanVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAVS9qdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOmQzYjRiMjAzLTUxMDgtNDhiNS1hM2JiLTE0MzQ5YTlkYTAwOQAAAAxXanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAJ0Wp1bWIAAAA7anVtZEDLDDK7ikidpwsq1vR/Q2kTYzJwYS5pY29uAAAAABhjMnNo40M+L4h8uaaeFnBWkzcFmAAAABdiZmRiAGltYWdlL3N2Zyt4bWwAAAAJd2JpZGI8c3ZnIHdpZHRoPSI3MTYiIGhlaWdodD0iNzE2IiB2aWV3Qm94PSIwIDAgNzE2IDcxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUwOC43NDkgMzE3LjM5OUM1MTYuNzc3IDI4Ny4zMTQgNTA4Ljk5MSAyNTMuODg0IDQ4NS4zODkgMjMwLjI4MkM0NjEuNzg4IDIwNi42ODEgNDI4LjM2IDE5OC44OTUgMzk4LjI3MyAyMDYuOTIzQzM3Ni4yMzEgMTg0LjkyOCAzNDMuMzkgMTc0Ljk1NiAzMTEuMTQ4IDE4My41OTZDMjc4LjkwNiAxOTIuMjM0IDI1NS40NSAyMTcuMjkyIDI0Ny4zNiAyNDcuMzYxQzIxNy4yOTEgMjU1LjQ1MSAxOTIuMjMzIDI3OC45MSAxODMuNTk1IDMxMS4xNDlDMTc0Ljk1NyAzNDMuMzkxIDE4NC45MjcgMzc2LjIzMiAyMDYuOTI0IDM5OC4yNzRDMTk4Ljg5NiA0MjguMzU5IDIwNi42ODMgNDYxLjc4OSAyMzAuMjg0IDQ4NS4zOTFDMjUzLjg4NSA1MDguOTkyIDI4Ny4zMTMgNTE2Ljc3OSAzMTcuNDAxIDUwOC43NUMzMzkuNDQyIDUzMC43NDUgMzcyLjI4NiA1NDAuNzE3IDQwNC41MjUgNTMyLjA3OUM0MzYuNzY3IDUyMy40NDEgNDYwLjIyMyA0OTguMzg0IDQ2OC4zMTMgNDY4LjMxNUM0OTguMzgzIDQ2MC4yMjQgNTIzLjQ0IDQzNi43NjYgNTMyLjA3OCA0MDQuNTI2QzU0MC43MTYgMzcyLjI4NSA1MzAuNzQ3IDMzOS40NDMgNTA4Ljc0OSAzMTcuNDAyVjMxNy4zOTlaTTQ3MC44OTkgMjQ0Ljc3NkM0ODYuODkyIDI2MC43NyA0OTMuNDg4IDI4Mi42MDEgNDkwLjY4NyAzMDMuNDEyTDQxNS41NzcgMjYwLjA0NkM0MTIuNDExIDI1OC4yMTggNDA4LjUwOSAyNTguMjE4IDQwNS4zNDUgMjYwLjA0NkwzMTcuNDAxIDMxMC44MlYyNzcuNTI2QzMxNy40MDEgMjc1LjE5MSAzMTguNjUyIDI3My4wMDUgMzIwLjY3NiAyNzEuODM3TDM4Ny42NDQgMjMzLjE3NEM0MTQuMTc4IDIxOC4zNTMgNDQ4LjM0NiAyMjIuMjIzIDQ3MC45MDEgMjQ0Ljc3Nkg0NzAuODk5Wk0zNTcuODM3IDMxMS4xNDRMMzk4LjI3NSAzMzQuNDkxVjM4MS4xODVMMzU3LjgzNyA0MDQuNTMyTDMxNy4zOTggMzgxLjE4NVYzMzQuNDkxTDM1Ny44MzcgMzExLjE0NFpNMjY0Ljc3NiAyNjkuNjkzQzI2NS4yMDcgMjM5LjMwNSAyODUuNjQ0IDIxMS42NDkgMzE2LjQ1MyAyMDMuMzkzQzMzOC4zIDE5Ny41NCAzNjAuNTA1IDIwMi43NDQgMzc3LjEyNyAyMTUuNTczTDMwMi4wMTQgMjU4LjkzN0MyOTguODQ4IDI2MC43NjQgMjk2Ljg5OCAyNjQuMTQ0IDI5Ni44OTggMjY3Ljc5OFYzNjkuMzQ2TDI2OC4wNjUgMzUyLjY5OUMyNjYuMDQzIDM1MS41MzEgMjY0Ljc3NiAzNDkuMzUzIDI2NC43NzYgMzQ3LjAxN1YyNjkuNjkxVjI2OS42OTNaTTIwMy4zOTEgMzE2LjQ1NEMyMDkuMjQ0IDI5NC42MDggMjI0Ljg1NCAyNzcuOTc4IDI0NC4yNzYgMjY5Ljk5OVYzNTYuNzNDMjQ0LjI3NiAzNjAuMzg0IDI0Ni4yMjYgMzYzLjc2MyAyNDkuMzkyIDM2NS41OTFMMzM3LjMzNyA0MTYuMzY1TDMwOC41MDMgNDMzLjAxM0MzMDYuNDgxIDQzNC4xODEgMzAzLjk2MSA0MzQuMTg4IDMwMS45MzkgNDMzLjAyTDIzNC45NzEgMzk0LjM1N0MyMDguODY4IDM3OC43ODkgMTk1LjEzOCAzNDcuMjYxIDIwMy4zOTEgMzE2LjQ1NFpNMjQ0Ljc3NSA0NzAuOUMyMjguNzgxIDQ1NC45MDYgMjIyLjE4NiA0MzMuMDc1IDIyNC45ODYgNDEyLjI2NEwzMDAuMDk2IDQ1NS42M0MzMDMuMjYzIDQ1Ny40NTcgMzA3LjE2NCA0NTcuNDU3IDMxMC4zMjggNDU1LjYzTDM5OC4yNzMgNDA0Ljg1NlY0MzguMTQ5QzM5OC4yNzMgNDQwLjQ4NSAzOTcuMDIyIDQ0Mi42NzEgMzk0Ljk5NyA0NDMuODM5TDMyOC4wMjkgNDgyLjUwMkMzMDEuNDk1IDQ5Ny4zMjIgMjY3LjMyNyA0OTMuNDUyIDI0NC43NzIgNDcwLjlIMjQ0Ljc3NVpNNDUwLjg5NyA0NDUuOTgyQzQ1MC40NjYgNDc2LjM3MSA0MzAuMDI5IDUwNC4wMjcgMzk5LjIyIDUxMi4yODNDMzc3LjM3MyA1MTguMTM2IDM1NS4xNjggNTEyLjkzMiAzMzguNTQ3IDUwMC4xMDJMNDEzLjY1OSA0NTYuNzM4QzQxNi44MjYgNDU0LjkxMSA0MTguNzc1IDQ1MS41MzIgNDE4Ljc3NSA0NDcuODc3VjM0Ni4zMjlMNDQ3LjYwOSAzNjIuOTc3QzQ0OS42MzEgMzY0LjE0NSA0NTAuODk3IDM2Ni4zMjMgNDUwLjg5NyAzNjguNjU5VjQ0NS45ODVWNDQ1Ljk4MlpNNTEyLjI4MiAzOTkuMjIxQzUwNi40MjkgNDIxLjA2OCA0OTAuODE5IDQzNy42OTcgNDcxLjM5NyA0NDUuNjc2VjM1OC45NDZDNDcxLjM5NyAzNTUuMjkyIDQ2OS40NDggMzUxLjkxMiA0NjYuMjgxIDM1MC4wODVMMzc4LjMzNiAyOTkuMzExTDQwNy4xNyAyODIuNjYzQzQwOS4xOTIgMjgxLjQ5NSA0MTEuNzEyIDI4MS40ODcgNDEzLjczNCAyODIuNjU1TDQ4MC43MDIgMzIxLjMxOEM1MDYuODA1IDMzNi44ODcgNTIwLjUzNiAzNjguNDE1IDUxMi4yODIgMzk5LjIyMVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgoAAAGSanVtYgAAAEFqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmFjdGlvbnMudjIAAAAAGGMyc2gc/SpNJILAWAEEuKIL2C5OAAABSWNib3KiZ2FjdGlvbnODpGZhY3Rpb25sYzJwYS5jcmVhdGVkZHdoZW7AdDIwMjYtMDktMTZUMDA6MDA6MDBabXNvZnR3YXJlQWdlbnSiZG5hbWVpZ3B0LWltYWdlZ3ZlcnNpb25jMi4wcWRpZ2l0YWxTb3VyY2VUeXBleEZodHRwOi8vY3YuaXB0Yy5vcmcvbmV3c2NvZGVzL2RpZ2l0YWxzb3VyY2V0eXBlL3RyYWluZWRBbGdvcml0aG1pY01lZGlhomZhY3Rpb25uYzJwYS5jb252ZXJ0ZWRkd2hlbsB0MjAyNi0wOS0xNlQwMDowMDowMFqiZmFjdGlvbngYYzJwYS53YXRlcm1hcmtlZC51bmJvdW5kZHdoZW7AdDIwMjYtMDktMTZUMDA6MDA6MDBacmFsbEFjdGlvbnNJbmNsdWRlZPQAAADDanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaEk1xavNpVEoTQZHeQHkrxMAAAB7Y2JvcqVqZXhjbHVzaW9uc4GiZXN0YXJ0FGZsZW5ndGgZVWFkbmFtZW5qdW1iZiBtYW5pZmVzdGNhbGdmc2hhMjU2ZGhhc2hYIBRRW3qAHOQ4mYJpD1Ah5OMK3WI4zp28cMK548ekTGw5Y3BhZEkAAAAAAAAAAAAAAAK7anVtYgAAACdqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltLnYyAAAAAoxjYm9ypmppbnN0YW5jZUlEeCx4bXA6aWlkOjk5MDhmYzI5LWIzMGItNDMxOC05NGE2LThhZjkwODRkNGJkMnRjbGFpbV9nZW5lcmF0b3JfaW5mb6RkbmFtZXgYT3BlbkFJIE1lZGlhIFNlcnZpY2UgQVBJZGljb26iY3VybHgkc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pY29uZGhhc2hYINOe8PYuMp1owJ2vzKHEZzbItLPSSBDVk/j7+lWEfyEfa3NwZWNWZXJzaW9uZTIuMi4wd29yZy5jb250ZW50YXV0aC5jMnBh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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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", is = [{ id: "all", name: "الكل" }], cr = [], oe = {}, sr = [], Hv = (u) => { const r = String(u || "").trim(); return /^(?:https:\/\/|\/(?!\/)|data:image\/(?:png|jpe?g|webp|gif);base64,)/i.test(r) ? r : Fp; };
function Gv(u, r) {
  var c;
  is.splice(1, is.length, ...(u.categories || []).map((i) => ({ id: i.id, name: i.name_ar || i.name_en || "قسم" }))), cr.splice(0), sr.splice(0), Object.keys(oe).forEach((i) => delete oe[i]);
  for (const i of u.products || []) {
    if (!i.available) continue;
    const d = [];
    if ((c = i.variants) != null && c.length) {
      const p = `variant:${i.id}`;
      d.push(p), oe[p] = { id: p, name: "الحجم", multi: !1, required: !!i.variant_required, min: i.variant_required ? 1 : 0, max: 1, kind: "variant", options: i.variants.map((m) => ({ id: m.id, name: m.name, price: Number(m.price || 0) - Number(i.base_price || 0), rawPrice: Number(m.price || 0) })) };
    }
    for (const p of i.option_groups || []) {
      const m = `option:${p.id}`;
      d.push(m), oe[m] = { id: m, name: p.name, multi: Number(p.max_select || 1) > 1, required: !!p.required || Number(p.min_select || 0) > 0, min: Math.max(p.required ? 1 : 0, Number(p.min_select || 0)), max: Math.max(1, Number(p.max_select || 1)), kind: "option", options: (p.options || []).map((v) => ({ id: v.id, name: v.name, price: Number(v.price_delta || 0), rawPrice: Number(v.price_delta || 0) })) };
    }
    cr.push({ id: i.id, name: i.name_ar || i.name_en || "منتج", price: Number(i.base_price || 0), category: i.category_id, image: Hv(i.image_url), badge: i.badge || (i.is_featured ? "الأكثر مبيعاً" : i.is_new ? "جديد" : void 0), groups: d });
  }
  sr.push(...(u.delivery_zones || []).filter((i) => !i.branch_id || i.branch_id === r).map((i) => ({ id: i.id, name: i.name, fee: Number(i.fee || 0), branch_id: i.branch_id })));
}
const aa = (u) => `EGP ${u.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function Fv({ onAdd: u, externalQuery: r = "" }) {
  const [c, i] = z.useState("all"), [d, p] = z.useState(""), [m, v] = z.useState(""), [S, M] = z.useState(""), O = z.useMemo(
    () => cr.filter(
      (s) => {
        var D, Z;
        return (c === "all" || s.category === c) && (d.trim() === "" || s.name.includes(d.trim())) && (r.trim() === "" || s.name.includes(r.trim())) && (m !== "popular" || ((D = s.badge) == null ? void 0 : D.includes("مبيع"))) && (m !== "new" || ((Z = s.badge) == null ? void 0 : Z.includes("جديد")));
      }
    ).sort((s, D) => S === "asc" ? s.price - D.price : S === "desc" ? D.price - s.price : 0),
    [c, d, r, m, S]
  );
  return /* @__PURE__ */ y.jsxs("section", { className: "flex min-h-0 min-w-0 flex-col gap-3", children: [
    /* @__PURE__ */ y.jsxs("div", { className: "relative h-28 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-36", children: [
      /* @__PURE__ */ y.jsx(
        "img",
        {
          src: Fp,
          alt: "شاورما البلد",
          width: 1536,
          height: 512,
          className: "h-full w-full object-cover"
        }
      ),
      /* @__PURE__ */ y.jsx("div", { className: "absolute inset-0 bg-gradient-to-l from-background/20 via-background/70 to-background/95" }),
      /* @__PURE__ */ y.jsxs("div", { className: "absolute inset-0 flex flex-col justify-center gap-1 px-4 sm:px-6", children: [
        /* @__PURE__ */ y.jsxs("h1", { className: "text-xl font-extrabold tracking-tight sm:text-3xl", children: [
          "طعم أصيل ",
          /* @__PURE__ */ y.jsx("span", { className: "text-brand", children: ".." }),
          " لكل وقت"
        ] }),
        /* @__PURE__ */ y.jsx("p", { className: "text-xs text-muted-foreground sm:text-sm", children: "شاورما • وجبات • مقليات • مشروبات" })
      ] })
    ] }),
    /* @__PURE__ */ y.jsx("div", { className: "flex shrink-0 gap-2 overflow-x-auto pos-scroll pb-1", children: is.map((s) => {
      const D = s.id === c;
      return /* @__PURE__ */ y.jsx(
        "button",
        {
          type: "button",
          onClick: () => i(s.id),
          className: `shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${D ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]" : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"}`,
          children: s.name
        },
        s.id
      );
    }) }),
    /* @__PURE__ */ y.jsxs("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "relative min-w-0 flex-1", children: [
        /* @__PURE__ */ y.jsx(Hp, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ y.jsx(
          "input",
          {
            value: d,
            onChange: (s) => p(s.target.value),
            type: "search",
            placeholder: "ابحث عن منتج ...",
            className: "h-11 w-full rounded-xl border border-border bg-surface-2/70 pr-10 pl-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
          }
        )
      ] }),
      /* @__PURE__ */ y.jsx($c, { icon: /* @__PURE__ */ y.jsx(Vv, { className: "h-4 w-4 text-brand" }), label: "الأكثر مبيعاً", active: m === "popular", onClick: () => v((s) => s === "popular" ? "" : "popular") }),
      /* @__PURE__ */ y.jsx($c, { icon: /* @__PURE__ */ y.jsx(Bv, { className: "h-4 w-4 text-brand" }), label: "جديد", active: m === "new", onClick: () => v((s) => s === "new" ? "" : "new") }),
      /* @__PURE__ */ y.jsx($c, { icon: /* @__PURE__ */ y.jsx(kv, { className: "h-4 w-4" }), label: "تصفية", active: !!S, onClick: () => M((s) => s === "" ? "asc" : s === "asc" ? "desc" : "") })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto pos-scroll pl-1", children: [
      /* @__PURE__ */ y.jsx("div", { className: "grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 xl:grid-cols-4", children: O.map((s) => /* @__PURE__ */ y.jsxs(
        "button",
        {
          type: "button",
          onClick: () => u(s),
          className: "group relative overflow-hidden rounded-2xl border border-border bg-card text-right transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[var(--shadow-brand)]",
          children: [
            /* @__PURE__ */ y.jsxs("div", { className: "relative aspect-[4/3] overflow-hidden", children: [
              /* @__PURE__ */ y.jsx(
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
              s.badge && /* @__PURE__ */ y.jsx("span", { className: "absolute right-2 top-2 rounded-lg brand-gradient px-2 py-0.5 text-[11px] font-bold text-brand-foreground", children: s.badge })
            ] }),
            /* @__PURE__ */ y.jsxs("div", { className: "flex items-center justify-between gap-2 p-3", children: [
              /* @__PURE__ */ y.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ y.jsx("p", { className: "line-clamp-2 text-sm font-bold leading-snug", children: s.name }),
                /* @__PURE__ */ y.jsx("p", { className: "mt-1 text-sm font-extrabold text-brand", dir: "ltr", children: aa(s.price) })
              ] }),
              /* @__PURE__ */ y.jsx("span", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl brand-gradient text-brand-foreground", children: /* @__PURE__ */ y.jsx(Yp, { className: "h-5 w-5" }) })
            ] })
          ]
        },
        s.id
      )) }),
      O.length === 0 && /* @__PURE__ */ y.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "لا توجد منتجات مطابقة" })
    ] })
  ] });
}
function $c({ icon: u, label: r, onClick: c, active: i }) {
  return /* @__PURE__ */ y.jsxs(
    "button",
    {
      type: "button",
      onClick: c,
      "aria-pressed": i,
      className: "flex h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-surface-2/70 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
      children: [
        u,
        r
      ]
    }
  );
}
const Ns = (u) => cr.find((r) => r.id === u), Zv = (u) => Object.fromEntries(u.groups.map((r) => {
  const c = oe[r];
  return [r, c != null && c.required ? c.options.slice(0, Math.max(1, c.min)).map((i) => i.id) : []];
})), _i = (u, r) => u + "|" + Object.keys(r).sort().map((c) => `${c}:${[...r[c] || []].sort().join(",")}`).join("|"), Qv = (u) => Ns(u.productId).price + Object.entries(u.selections).reduce((r, [c, i]) => r + i.reduce((d, p) => {
  var m, v;
  return d + (((v = (m = oe[c]) == null ? void 0 : m.options.find((S) => S.id === p)) == null ? void 0 : v.price) || 0);
}, 0), 0), Zp = (u) => Qv(u) * u.quantity, Jv = (u) => Object.entries(u.selections).flatMap(([r, c]) => c.map((i) => {
  var d, p;
  return (p = (d = oe[r]) == null ? void 0 : d.options.find((m) => m.id === i)) == null ? void 0 : p.name;
}).filter(Boolean));
function Wv({
  line: u,
  onToggle: r,
  onClose: c
}) {
  const i = Ns(u.productId), d = i.groups.flatMap((p) => {
    const m = oe[p];
    return m ? [m] : [];
  });
  return /* @__PURE__ */ y.jsxs("div", { className: "rounded-2xl border border-brand/30 bg-surface-2/50 p-3", children: [
    /* @__PURE__ */ y.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ y.jsx(
          "img",
          {
            src: i.image,
            alt: i.name,
            loading: "lazy",
            width: 816,
            height: 816,
            className: "h-10 w-10 shrink-0 rounded-lg object-cover"
          }
        ),
        /* @__PURE__ */ y.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ y.jsx("p", { className: "truncate text-sm font-bold", children: i.name }),
          /* @__PURE__ */ y.jsx("p", { className: "text-xs font-bold text-brand", dir: "ltr", children: aa(i.price) })
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ y.jsx("span", { className: "hidden text-xs font-bold text-muted-foreground sm:block", children: "إضافات المنتج المحدد" }),
        /* @__PURE__ */ y.jsx(
          "button",
          {
            type: "button",
            "aria-label": "إغلاق الإضافات",
            onClick: c,
            className: "grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition-colors hover:text-foreground",
            children: /* @__PURE__ */ y.jsx(Gp, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    d.length === 0 ? /* @__PURE__ */ y.jsx("p", { className: "py-4 text-center text-xs text-muted-foreground", children: "لا توجد إضافات متاحة لهذا المنتج" }) : /* @__PURE__ */ y.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: d.map((p) => /* @__PURE__ */ y.jsxs("div", { className: "rounded-xl border border-border bg-surface/60 p-2", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "flex items-center justify-between gap-2 pb-2", children: [
        /* @__PURE__ */ y.jsx("p", { className: "truncate text-xs font-bold", children: p.name }),
        /* @__PURE__ */ y.jsx(
          "span",
          {
            className: `shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${p.required ? "bg-brand/15 text-brand" : "bg-surface-3 text-muted-foreground"}`,
            children: p.required ? "مطلوب" : "اختياري"
          }
        )
      ] }),
      /* @__PURE__ */ y.jsx("div", { className: "space-y-1.5", children: p.options.map((m) => {
        const v = (u.selections[p.id] ?? []).includes(m.id);
        return /* @__PURE__ */ y.jsxs(
          "button",
          {
            type: "button",
            onClick: () => r(p.id, m.id),
            className: `grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2.5 py-2 text-right transition-colors ${v ? "border-brand bg-brand/15" : "border-border bg-surface-2/60 hover:bg-surface-3"}`,
            children: [
              /* @__PURE__ */ y.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ y.jsx("span", { className: "block truncate text-xs font-bold", children: m.name }),
                /* @__PURE__ */ y.jsx(
                  "span",
                  {
                    className: `block text-[11px] ${v ? "text-brand" : "text-muted-foreground"}`,
                    dir: "ltr",
                    children: m.price > 0 ? `+${m.price}.00` : "+0.00"
                  }
                )
              ] }),
              /* @__PURE__ */ y.jsx(
                "span",
                {
                  className: `grid h-5 w-5 shrink-0 place-items-center border ${p.multi ? "rounded-md" : "rounded-full"} ${v ? "border-brand bg-brand text-brand-foreground" : "border-border"}`,
                  children: v && /* @__PURE__ */ y.jsx(kp, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          m.id
        );
      }) })
    ] }, p.id)) })
  ] });
}
function Lv({
  orderType: u,
  onOrderTypeChange: r,
  lines: c,
  selectedLine: i,
  onSelectLine: d,
  onQuantity: p,
  onRemove: m,
  onClearAll: v,
  onToggleModifier: S,
  onCloseModifiers: M,
  notes: O,
  onNotesChange: s,
  subtotal: D,
  deliveryFee: Z,
  zoneName: q,
  hasAddress: Y,
  onOpenAddress: C,
  onSaveOrder: H,
  onComplete: I,
  deliveryEnabled: aA
}) {
  const uA = u === "delivery", iA = D + (uA ? Z : 0), sA = c.reduce((J, B) => J + B.quantity, 0);
  return /* @__PURE__ */ y.jsxs("aside", { className: "flex min-h-0 min-w-0 flex-col gap-3", children: [
    /* @__PURE__ */ y.jsxs("div", { className: "panel shrink-0 p-2", children: [
      /* @__PURE__ */ y.jsx("p", { className: "px-1 pb-2 pt-1 text-xs font-bold text-muted-foreground", children: "نوع الطلب" }),
      /* @__PURE__ */ y.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ y.jsx(
          gp,
          {
            active: uA,
            onClick: () => r("delivery"),
            disabled: !aA,
            icon: /* @__PURE__ */ y.jsx(Rv, { className: "h-5 w-5" }),
            label: "توصيل"
          }
        ),
        /* @__PURE__ */ y.jsx(
          gp,
          {
            active: !uA,
            onClick: () => r("pickup"),
            icon: /* @__PURE__ */ y.jsx(qv, { className: "h-5 w-5" }),
            label: "استلام من المطعم"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "panel flex min-h-0 flex-1 flex-col p-3", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-3", children: [
        /* @__PURE__ */ y.jsxs("h2", { className: "truncate text-base font-extrabold", children: [
          "الطلب الحالي",
          sA > 0 && /* @__PURE__ */ y.jsxs("span", { className: "text-muted-foreground", children: [
            " (",
            sA,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ y.jsxs(
          "button",
          {
            type: "button",
            onClick: v,
            disabled: c.length === 0,
            className: "flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40",
            children: [
              /* @__PURE__ */ y.jsx(mp, { className: "h-4 w-4" }),
              "حذف الكل"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "min-h-0 flex-1 space-y-2 overflow-y-auto pos-scroll lg:min-h-[6rem]", children: [
        c.length === 0 && /* @__PURE__ */ y.jsx("div", { className: "grid h-full min-h-28 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground", children: "أضف منتجات لبدء الطلب" }),
        c.map((J) => {
          const B = Ns(J.productId), gA = Jv(J), xA = (i == null ? void 0 : i.id) === J.id;
          return /* @__PURE__ */ y.jsxs(
            "div",
            {
              role: "button",
              tabIndex: 0,
              onClick: () => d(J.id),
              onKeyDown: (zA) => zA.key === "Enter" && d(J.id),
              className: `grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2 transition-colors ${xA ? "border-brand bg-brand/10" : "border-border bg-surface-2/50 hover:bg-surface-3/60"}`,
              children: [
                /* @__PURE__ */ y.jsx(
                  "img",
                  {
                    src: B.image,
                    alt: B.name,
                    loading: "lazy",
                    width: 816,
                    height: 816,
                    className: "h-12 w-12 shrink-0 rounded-lg object-cover"
                  }
                ),
                /* @__PURE__ */ y.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ y.jsx("p", { className: "truncate text-sm font-bold", children: B.name }),
                  gA.length > 0 && /* @__PURE__ */ y.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: gA.join(" • ") }),
                  /* @__PURE__ */ y.jsx("p", { className: "mt-0.5 text-sm font-extrabold text-brand", dir: "ltr", children: aa(Zp(J)) })
                ] }),
                /* @__PURE__ */ y.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", onClick: (zA) => zA.stopPropagation(), children: [
                  /* @__PURE__ */ y.jsxs("div", { className: "flex items-center gap-1 rounded-lg border border-border bg-surface p-1", children: [
                    /* @__PURE__ */ y.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "زيادة الكمية",
                        onClick: () => p(J.id, 1),
                        className: "grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground",
                        children: /* @__PURE__ */ y.jsx(Yp, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ y.jsx("span", { className: "w-6 text-center text-sm font-extrabold", children: J.quantity }),
                    /* @__PURE__ */ y.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "تقليل الكمية",
                        onClick: () => p(J.id, -1),
                        className: "grid h-7 w-7 place-items-center rounded-md bg-surface-3 transition-colors hover:bg-brand hover:text-brand-foreground",
                        children: /* @__PURE__ */ y.jsx(wv, { className: "h-4 w-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ y.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "حذف المنتج",
                      onClick: () => m(J.id),
                      className: "grid h-8 w-8 place-items-center rounded-lg text-destructive transition-colors hover:bg-destructive/10",
                      children: /* @__PURE__ */ y.jsx(mp, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            },
            J.id
          );
        })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "min-h-0 shrink space-y-3 overflow-y-auto pos-scroll pt-3", children: [
        /* @__PURE__ */ y.jsx(
          "input",
          {
            value: O,
            onChange: (J) => s(J.target.value),
            placeholder: "ملاحظات على الطلب ...",
            className: "h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60"
          }
        ),
        i && /* @__PURE__ */ y.jsx("div", { className: "max-h-none overflow-y-auto pos-scroll", children: /* @__PURE__ */ y.jsx(
          Wv,
          {
            line: i,
            onToggle: S,
            onClose: M
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "panel shrink-0 p-3", children: [
      /* @__PURE__ */ y.jsxs("div", { className: "space-y-1.5 text-sm", children: [
        /* @__PURE__ */ y.jsx(pp, { label: "المجموع الفرعي", value: aa(D) }),
        uA && /* @__PURE__ */ y.jsx(
          pp,
          {
            label: q ? `رسوم التوصيل — ${q}` : "رسوم التوصيل",
            value: aa(Z)
          }
        ),
        /* @__PURE__ */ y.jsxs("div", { className: "mt-2 flex items-center justify-between gap-2 border-t border-border pt-2", children: [
          /* @__PURE__ */ y.jsx("span", { className: "text-sm font-extrabold", children: "الإجمالي" }),
          /* @__PURE__ */ y.jsx("span", { className: "text-xl font-extrabold text-brand", dir: "ltr", children: aa(iA) })
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ y.jsxs(
          "button",
          {
            type: "button",
            onClick: I,
            disabled: c.length === 0,
            className: "flex h-14 w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 text-lg font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.01] disabled:opacity-40",
            children: [
              /* @__PURE__ */ y.jsx(kp, { className: "h-5 w-5 shrink-0" }),
              "إتمام الطلب"
            ]
          }
        ),
        /* @__PURE__ */ y.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ y.jsxs(
            "button",
            {
              type: "button",
              onClick: H,
              disabled: c.length === 0,
              className: "flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
              children: [
                /* @__PURE__ */ y.jsx(Cv, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ y.jsx("span", { className: "truncate", children: "حفظ الطلب" })
              ]
            }
          ),
          uA && /* @__PURE__ */ y.jsxs(
            "button",
            {
              type: "button",
              onClick: C,
              className: `flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors ${Y ? "border-brand/50 bg-brand/10 text-brand" : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ y.jsx(Bp, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ y.jsx("span", { className: "truncate", children: Y ? "تعديل العنوان" : "إضافة العنوان" })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function pp({ label: u, value: r }) {
  return /* @__PURE__ */ y.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ y.jsx("span", { className: "text-muted-foreground", children: u }),
    /* @__PURE__ */ y.jsx("span", { className: "font-bold", dir: "ltr", children: r })
  ] });
}
function gp({
  active: u,
  onClick: r,
  icon: c,
  label: i,
  disabled: d = !1
}) {
  return /* @__PURE__ */ y.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      disabled: d,
      className: `flex h-14 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-all ${u ? "border-transparent brand-gradient text-brand-foreground shadow-[var(--shadow-brand)]" : "border-border bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"}`,
      children: [
        c,
        /* @__PURE__ */ y.jsx("span", { className: "truncate", children: i })
      ]
    }
  );
}
var Xv = Object.defineProperty, fl = (u, r) => Xv(u, "name", { value: r, configurable: !0 }), Qp = !!(typeof window < "u" && window.document && window.document.createElement);
function wa(u, r, { checkForDefaultPrevented: c = !0 } = {}) {
  return /* @__PURE__ */ fl(function(d) {
    if (u == null || u(d), c === !1 || !d || !d.defaultPrevented)
      return r == null ? void 0 : r(d);
  }, "handleEvent");
}
fl(wa, "composeEventHandlers");
function Iv(u) {
  var r;
  if (!Qp)
    throw new Error("Cannot access window outside of the DOM");
  return ((r = u == null ? void 0 : u.ownerDocument) == null ? void 0 : r.defaultView) ?? window;
}
fl(Iv, "getOwnerWindow");
function rs(u) {
  if (!Qp)
    throw new Error("Cannot access document outside of the DOM");
  return (u == null ? void 0 : u.ownerDocument) ?? document;
}
fl(rs, "getOwnerDocument");
function Jp(u, r = !1) {
  const { activeElement: c } = rs(u);
  if (!(c != null && c.nodeName))
    return null;
  if (Wp(c) && c.contentDocument)
    return Jp(c.contentDocument.body, r);
  if (r) {
    const i = c.getAttribute("aria-activedescendant");
    if (i) {
      const d = rs(c).getElementById(i);
      if (d)
        return d;
    }
  }
  return c;
}
fl(Jp, "getActiveElement");
function Wp(u) {
  return u.tagName === "IFRAME";
}
fl(Wp, "isFrame");
var Pv = Object.defineProperty, xs = (u, r) => Pv(u, "name", { value: r, configurable: !0 });
function os(u, r) {
  if (typeof u == "function")
    return u(r);
  u != null && (u.current = r);
}
xs(os, "setRef");
function Lp(...u) {
  return (r) => {
    let c = !1;
    const i = u.map((d) => {
      const p = os(d, r);
      return !c && typeof p == "function" && (c = !0), p;
    });
    if (c)
      return () => {
        for (let d = 0; d < i.length; d++) {
          const p = i[d];
          typeof p == "function" ? p() : os(u[d], null);
        }
      };
  };
}
xs(Lp, "composeRefs");
function dl(...u) {
  return z.useCallback(Lp(...u), u);
}
xs(dl, "useComposedRefs");
var _v = Object.defineProperty, re = (u, r) => _v(u, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function $v(u, r) {
  const c = z.createContext(r);
  c.displayName = u + "Context";
  const i = /* @__PURE__ */ re((p) => {
    const { children: m, ...v } = p, S = z.useMemo(() => v, Object.values(v));
    return /* @__PURE__ */ y.jsx(c.Provider, { value: S, children: m });
  }, "Provider");
  i.displayName = u + "Provider";
  function d(p, m = {}) {
    const { optional: v = !1 } = m, S = z.useContext(c);
    if (S) return S;
    if (r !== void 0) return r;
    if (!v)
      throw new Error(`\`${p}\` must be used within \`${u}\``);
  }
  return re(d, "useContext"), [i, d];
}
re($v, "createContext");
// @__NO_SIDE_EFFECTS__
function Xp(u, r = []) {
  let c = [];
  function i(p, m) {
    const v = z.createContext(m);
    v.displayName = p + "Context";
    const S = c.length;
    c = [...c, m];
    const M = /* @__PURE__ */ re((s) => {
      var H;
      const { scope: D, children: Z, ...q } = s, Y = ((H = D == null ? void 0 : D[u]) == null ? void 0 : H[S]) || v, C = z.useMemo(() => q, Object.values(q));
      return /* @__PURE__ */ y.jsx(Y.Provider, { value: C, children: Z });
    }, "Provider");
    M.displayName = p + "Provider";
    function O(s, D, Z = {}) {
      var H;
      const { optional: q = !1 } = Z, Y = ((H = D == null ? void 0 : D[u]) == null ? void 0 : H[S]) || v, C = z.useContext(Y);
      if (C) return C;
      if (m !== void 0) return m;
      if (!q)
        throw new Error(`\`${s}\` must be used within \`${p}\``);
    }
    return re(O, "useContext"), [M, O];
  }
  re(i, "createContext");
  const d = /* @__PURE__ */ re(() => {
    const p = c.map((m) => z.createContext(m));
    return /* @__PURE__ */ re(function(v) {
      const S = (v == null ? void 0 : v[u]) || p;
      return z.useMemo(
        () => ({ [`__scope${u}`]: { ...v, [u]: S } }),
        [v, S]
      );
    }, "useScope");
  }, "createScope");
  return d.scopeName = u, [i, Ip(d, ...r)];
}
re(Xp, "createContextScope");
function Ip(...u) {
  const r = u[0];
  if (u.length === 1) return r;
  const c = /* @__PURE__ */ re(() => {
    const i = u.map((d) => ({
      useScope: d(),
      scopeName: d.scopeName
    }));
    return /* @__PURE__ */ re(function(p) {
      const m = i.reduce((v, { useScope: S, scopeName: M }) => {
        const s = S(p)[`__scope${M}`];
        return { ...v, ...s };
      }, {});
      return z.useMemo(() => ({ [`__scope${r.scopeName}`]: m }), [m]);
    }, "useComposedScopes");
  }, "createScope");
  return c.scopeName = r.scopeName, c;
}
re(Ip, "composeContextScopes");
var Ca = globalThis != null && globalThis.document ? z.useLayoutEffect : () => {
}, Ab = Object.defineProperty, tb = (u, r) => Ab(u, "name", { value: r, configurable: !0 }), eb = Su[" useId ".trim().toString()] || (() => {
}), ab = 0;
function ir(u) {
  const [r, c] = z.useState(eb());
  return Ca(() => {
    u || c((i) => i ?? String(ab++));
  }, [u]), u || (r ? `radix-${r}` : "");
}
tb(ir, "useId");
var nb = Object.defineProperty, lb = (u, r) => nb(u, "name", { value: r, configurable: !0 }), yp = Su[" useEffectEvent ".trim().toString()], hp = Su[" useInsertionEffect ".trim().toString()];
function Pp(u) {
  if (typeof yp == "function")
    return yp(u);
  const r = z.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof hp == "function" ? hp(() => {
    r.current = u;
  }) : Ca(() => {
    r.current = u;
  }), z.useMemo(() => ((...c) => {
    var i;
    return (i = r.current) == null ? void 0 : i.call(r, ...c);
  }), []);
}
lb(Pp, "useEffectEvent");
var ub = Object.defineProperty, Nu = (u, r) => ub(u, "name", { value: r, configurable: !0 }), ib = Su[" useInsertionEffect ".trim().toString()] || Ca;
function _p({
  prop: u,
  defaultProp: r,
  onChange: c = /* @__PURE__ */ Nu(() => {
  }, "onChange"),
  caller: i
}) {
  const [d, p, m] = $p({
    defaultProp: r,
    onChange: c
  }), v = u !== void 0, S = v ? u : d, M = z.useCallback(
    (O) => {
      var s;
      if (v) {
        const D = Ag(O) ? O(u) : O;
        D !== u && ((s = m.current) == null || s.call(m, D));
      } else
        p(O);
    },
    [v, u, p, m]
  );
  return [S, M];
}
Nu(_p, "useControllableState");
function $p({
  defaultProp: u,
  onChange: r
}) {
  const [c, i] = z.useState(u), d = z.useRef(c), p = z.useRef(r);
  return ib(() => {
    p.current = r;
  }, [r]), z.useEffect(() => {
    var m;
    d.current !== c && ((m = p.current) == null || m.call(p, c), d.current = c);
  }, [c, d]), [c, i, p];
}
Nu($p, "useUncontrolledState");
function Ag(u) {
  return typeof u == "function";
}
Nu(Ag, "isFunction");
var vp = Symbol("RADIX:SYNC_STATE");
function rb(u, r, c, i) {
  const { prop: d, defaultProp: p, onChange: m, caller: v } = r, S = d !== void 0, M = Pp(m), O = [{ ...c, state: p }];
  i && O.push(i);
  const [s, D] = z.useReducer(
    (C, H) => {
      if (H.type === vp)
        return { ...C, state: H.state };
      const I = u(C, H);
      return S && !Object.is(I.state, C.state) && M(I.state), I;
    },
    ...O
  ), Z = s.state, q = z.useRef(Z);
  z.useEffect(() => {
    q.current !== Z && (q.current = Z, S || M(Z));
  }, [Z, q, S]);
  const Y = z.useMemo(() => d !== void 0 ? { ...s, state: d } : s, [s, d]);
  return z.useEffect(() => {
    S && !Object.is(d, s.state) && D({ type: vp, state: d });
  }, [d, s.state, S]), [Y, D];
}
Nu(rb, "useControllableStateReducer");
var ob = Object.defineProperty, ve = (u, r) => ob(u, "name", { value: r, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Ts(u) {
  const r = z.forwardRef((c, i) => {
    let { children: d, ...p } = c, m = null, v = !1;
    const S = [];
    cs(d) && typeof $i == "function" && (d = $i(d._payload)), z.Children.forEach(d, (D) => {
      var Z;
      if (ng(D)) {
        v = !0;
        const q = D;
        let Y = "child" in q.props ? q.props.child : q.props.children;
        cs(Y) && typeof $i == "function" && (Y = $i(Y._payload)), m = sb(q, Y), S.push((Z = m == null ? void 0 : m.props) == null ? void 0 : Z.children);
      } else
        S.push(D);
    }), m ? m = z.cloneElement(m, void 0, S) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !v && z.Children.count(d) === 1 && z.isValidElement(d) && (m = d)
    );
    const M = m ? ag(m) : void 0, O = dl(i, M);
    if (!m) {
      if (d || d === 0)
        throw new Error(
          v ? mb(u) : db(u)
        );
      return d;
    }
    const s = eg(p, m.props ?? {});
    return m.type !== z.Fragment && (s.ref = i ? O : M), z.cloneElement(m, s);
  });
  return r.displayName = `${u}.Slot`, r;
}
ve(Ts, "createSlot");
var tg = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function cb(u) {
  const r = /* @__PURE__ */ ve((c) => "child" in c ? c.children(c.child) : c.children, "Slottable");
  return r.displayName = `${u}.Slottable`, r.__radixId = tg, r;
}
ve(cb, "createSlottable");
var sb = /* @__PURE__ */ ve((u, r) => {
  if ("child" in u.props) {
    const c = u.props.child;
    return z.isValidElement(c) ? z.cloneElement(c, void 0, u.props.children(c.props.children)) : null;
  }
  return z.isValidElement(r) ? r : null;
}, "getSlottableElementFromSlottable");
function eg(u, r) {
  const c = { ...r };
  for (const i in r) {
    const d = u[i], p = r[i];
    /^on[A-Z]/.test(i) ? d && p ? c[i] = (...v) => {
      const S = p(...v);
      return d(...v), S;
    } : d && (c[i] = d) : i === "style" ? c[i] = { ...d, ...p } : i === "className" && (c[i] = [d, p].filter(Boolean).join(" "));
  }
  return { ...u, ...c };
}
ve(eg, "mergeProps");
function ag(u) {
  var i, d;
  let r = (i = Object.getOwnPropertyDescriptor(u.props, "ref")) == null ? void 0 : i.get, c = r && "isReactWarning" in r && r.isReactWarning;
  return c ? u.ref : (r = (d = Object.getOwnPropertyDescriptor(u, "ref")) == null ? void 0 : d.get, c = r && "isReactWarning" in r && r.isReactWarning, c ? u.props.ref : u.props.ref || u.ref);
}
ve(ag, "getElementRef");
function ng(u) {
  return z.isValidElement(u) && typeof u.type == "function" && "__radixId" in u.type && u.type.__radixId === tg;
}
ve(ng, "isSlottable");
var fb = Symbol.for("react.lazy");
function cs(u) {
  return u != null && typeof u == "object" && "$$typeof" in u && u.$$typeof === fb && "_payload" in u && lg(u._payload);
}
ve(cs, "isLazyComponent");
function lg(u) {
  return typeof u == "object" && u !== null && "then" in u;
}
ve(lg, "isPromiseLike");
var db = /* @__PURE__ */ ve((u) => `${u} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), mb = /* @__PURE__ */ ve((u) => `${u} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), $i = Su[" use ".trim().toString()], pb = Object.defineProperty, gb = (u, r) => pb(u, "name", { value: r, configurable: !0 }), yb = [
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
], fn = yb.reduce((u, r) => {
  const c = /* @__PURE__ */ Ts(`Primitive.${r}`), i = z.forwardRef((d, p) => {
    const { asChild: m, ...v } = d, S = m ? c : r;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y.jsx(S, { ...v, ref: p });
  });
  return i.displayName = `Primitive.${r}`, { ...u, [r]: i };
}, {});
function ug(u, r) {
  u && Ss.flushSync(() => u.dispatchEvent(r));
}
gb(ug, "dispatchDiscreteCustomEvent");
var hb = Object.defineProperty, vb = (u, r) => hb(u, "name", { value: r, configurable: !0 });
function sl(u) {
  const r = z.useRef(u);
  return z.useEffect(() => {
    r.current = u;
  }), z.useMemo(() => ((...c) => {
    var i;
    return (i = r.current) == null ? void 0 : i.call(r, ...c);
  }), []);
}
vb(sl, "useCallbackRef");
var bb = Object.defineProperty, pt = (u, r) => bb(u, "name", { value: r, configurable: !0 }), ss = "dismissableLayer.update", Sb = "dismissableLayer.pointerDownOutside", Nb = "dismissableLayer.focusOutside", bp, ig = z.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), xb = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ pt(function(r, c) {
    const {
      disableOutsidePointerEvents: i = !1,
      deferPointerDownOutside: d = !1,
      onEscapeKeyDown: p,
      onPointerDownOutside: m,
      onFocusOutside: v,
      onInteractOutside: S,
      onDismiss: M,
      ...O
    } = r, s = z.useContext(ig), [D, Z] = z.useState(null), q = (D == null ? void 0 : D.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, Y] = z.useState({}), C = dl(c, Z), H = Array.from(s.layers), [I] = [
      ...s.layersWithOutsidePointerEventsDisabled
    ].slice(-1), aA = I ? H.indexOf(I) : -1, uA = D ? H.indexOf(D) : -1, iA = s.layersWithOutsidePointerEventsDisabled.size > 0, sA = uA >= aA, J = z.useRef(!1), B = og(
      (oA) => {
        m == null || m(oA), S == null || S(oA), oA.defaultPrevented || M == null || M();
      },
      {
        ownerDocument: q,
        deferPointerDownOutside: d,
        isDeferredPointerDownOutsideRef: J,
        dismissableSurfaces: s.dismissableSurfaces,
        shouldHandlePointerDownOutside: z.useCallback(
          (oA) => {
            if (!(oA instanceof Node))
              return !1;
            const JA = [...s.branches].some(
              (HA) => HA.contains(oA)
            );
            return sA && !JA;
          },
          [s.branches, sA]
        )
      }
    ), gA = cg((oA) => {
      if (d && J.current)
        return;
      const JA = oA.target;
      [...s.branches].some((TA) => TA.contains(JA)) || (v == null || v(oA), S == null || S(oA), oA.defaultPrevented || M == null || M());
    }, q), xA = D ? uA === H.length - 1 : !1, zA = sl((oA) => {
      oA.key === "Escape" && (p == null || p(oA), !oA.defaultPrevented && M && (oA.preventDefault(), M()));
    });
    return z.useEffect(() => {
      if (xA)
        return q.addEventListener("keydown", zA, { capture: !0 }), () => q.removeEventListener("keydown", zA, { capture: !0 });
    }, [q, xA, zA]), z.useEffect(() => {
      if (D)
        return i && (s.layersWithOutsidePointerEventsDisabled.size === 0 && (bp = q.body.style.pointerEvents, q.body.style.pointerEvents = "none"), s.layersWithOutsidePointerEventsDisabled.add(D)), s.layers.add(D), fs(), () => {
          i && (s.layersWithOutsidePointerEventsDisabled.delete(D), s.layersWithOutsidePointerEventsDisabled.size === 0 && (q.body.style.pointerEvents = bp));
        };
    }, [D, q, i, s]), z.useEffect(() => () => {
      D && (s.layers.delete(D), s.layersWithOutsidePointerEventsDisabled.delete(D), fs());
    }, [D, s]), z.useEffect(() => {
      const oA = /* @__PURE__ */ pt(() => Y({}), "handleUpdate");
      return document.addEventListener(ss, oA), () => document.removeEventListener(ss, oA);
    }, []), /* @__PURE__ */ y.jsx(
      fn.div,
      {
        ...O,
        ref: C,
        style: {
          pointerEvents: iA ? sA ? "auto" : "none" : void 0,
          ...r.style
        },
        onFocusCapture: wa(r.onFocusCapture, gA.onFocusCapture),
        onBlurCapture: wa(r.onBlurCapture, gA.onBlurCapture),
        onPointerDownCapture: wa(
          r.onPointerDownCapture,
          B.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function rg() {
  const u = z.useContext(ig), [r, c] = z.useState(null);
  return z.useEffect(() => {
    if (r)
      return u.dismissableSurfaces.add(r), () => {
        u.dismissableSurfaces.delete(r);
      };
  }, [r, u.dismissableSurfaces]), c;
}
pt(rg, "useDismissableLayerSurface");
var Tb = /* @__PURE__ */ pt(() => !0, "IS_TRUE");
function og(u, r) {
  const {
    ownerDocument: c = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: i = !1,
    isDeferredPointerDownOutsideRef: d,
    dismissableSurfaces: p,
    shouldHandlePointerDownOutside: m = Tb
  } = r, v = sl(u), S = z.useRef(!1), M = z.useRef(!1), O = z.useRef(/* @__PURE__ */ new Map()), s = z.useRef(() => {
  });
  return z.useEffect(() => {
    function D() {
      M.current = !1, d.current = !1, O.current.clear();
    }
    pt(D, "resetOutsideInteraction");
    function Z() {
      return Array.from(O.current.values()).some(Boolean);
    }
    pt(Z, "isOutsideInteractionIntercepted");
    function q(aA) {
      if (!M.current)
        return;
      const uA = aA.target;
      uA instanceof Node && [...p].some((sA) => sA.contains(uA)) || O.current.set(aA.type, !0), aA.type === "click" && window.setTimeout(() => {
        M.current && s.current();
      }, 0);
    }
    pt(q, "handleInteractionCapture");
    function Y(aA) {
      M.current && O.current.set(aA.type, !1);
    }
    pt(Y, "handleInteractionBubble");
    const C = /* @__PURE__ */ pt((aA) => {
      if (aA.target && !S.current) {
        let uA = function() {
          c.removeEventListener("click", s.current);
          const sA = Z();
          D(), sA || Us(
            Sb,
            v,
            iA,
            { discrete: !0 }
          );
        };
        if (pt(uA, "handleAndDispatchPointerDownOutsideEvent"), !m(aA.target)) {
          c.removeEventListener("click", s.current), D(), S.current = !1;
          return;
        }
        const iA = { originalEvent: aA };
        M.current = !0, d.current = i && aA.button === 0, O.current.clear(), !i || aA.button !== 0 ? uA() : (c.removeEventListener("click", s.current), s.current = uA, c.addEventListener("click", s.current, { once: !0 }));
      } else
        c.removeEventListener("click", s.current), D();
      S.current = !1;
    }, "handlePointerDown"), H = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const aA of H)
      c.addEventListener(aA, q, !0), c.addEventListener(aA, Y);
    const I = window.setTimeout(() => {
      c.addEventListener("pointerdown", C);
    }, 0);
    return () => {
      window.clearTimeout(I), c.removeEventListener("pointerdown", C), c.removeEventListener("click", s.current);
      for (const aA of H)
        c.removeEventListener(aA, q, !0), c.removeEventListener(aA, Y);
    };
  }, [
    c,
    v,
    i,
    d,
    p,
    m
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ pt(() => S.current = !0, "onPointerDownCapture")
  };
}
pt(og, "usePointerDownOutside");
function cg(u, r = globalThis == null ? void 0 : globalThis.document) {
  const c = sl(u), i = z.useRef(!1);
  return z.useEffect(() => {
    const d = /* @__PURE__ */ pt((p) => {
      p.target && !i.current && Us(Nb, c, { originalEvent: p }, {
        discrete: !1
      });
    }, "handleFocus");
    return r.addEventListener("focusin", d), () => r.removeEventListener("focusin", d);
  }, [r, c]), {
    onFocusCapture: /* @__PURE__ */ pt(() => i.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ pt(() => i.current = !1, "onBlurCapture")
  };
}
pt(cg, "useFocusOutside");
function fs() {
  const u = new CustomEvent(ss);
  document.dispatchEvent(u);
}
pt(fs, "dispatchUpdate");
function Us(u, r, c, { discrete: i }) {
  const d = c.originalEvent.target, p = new CustomEvent(u, { bubbles: !1, cancelable: !0, detail: c });
  r && d.addEventListener(u, r, { once: !0 }), i ? ug(d, p) : d.dispatchEvent(p);
}
pt(Us, "handleAndDispatchCustomEvent");
var Ub = Object.defineProperty, Ot = (u, r) => Ub(u, "name", { value: r, configurable: !0 }), As = "focusScope.autoFocusOnMount", ts = "focusScope.autoFocusOnUnmount", Sp = { bubbles: !1, cancelable: !0 }, Mb = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ Ot(function(r, c) {
    const {
      loop: i = !1,
      trapped: d = !1,
      onMountAutoFocus: p,
      onUnmountAutoFocus: m,
      ...v
    } = r, [S, M] = z.useState(null), O = sl(p), s = sl(m), D = z.useRef(null), Z = dl(c, M), q = z.useRef({
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
        let C = function(uA) {
          if (q.paused || !S) return;
          const iA = uA.target;
          S.contains(iA) ? D.current = iA : ta(D.current, { select: !0 });
        }, H = function(uA) {
          if (q.paused || !S) return;
          const iA = uA.relatedTarget;
          iA !== null && (S.contains(iA) || ta(D.current, { select: !0 }));
        }, I = function(uA) {
          if (document.activeElement === document.body)
            for (const sA of uA)
              sA.removedNodes.length > 0 && ta(S);
        };
        Ot(C, "handleFocusIn"), Ot(H, "handleFocusOut"), Ot(I, "handleMutations"), document.addEventListener("focusin", C), document.addEventListener("focusout", H);
        const aA = new MutationObserver(I);
        return S && aA.observe(S, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", C), document.removeEventListener("focusout", H), aA.disconnect();
        };
      }
    }, [d, S, q.paused]), z.useEffect(() => {
      if (S) {
        Np.add(q);
        const C = document.activeElement;
        if (!S.contains(C)) {
          const I = new CustomEvent(As, Sp);
          S.addEventListener(As, O), S.dispatchEvent(I), I.defaultPrevented || (sg(gg(Ms(S)), { select: !0 }), document.activeElement === C && ta(S));
        }
        return () => {
          S.removeEventListener(As, O), setTimeout(() => {
            const I = new CustomEvent(ts, Sp);
            S.addEventListener(ts, s), S.dispatchEvent(I), I.defaultPrevented || ta(C ?? document.body, { select: !0 }), S.removeEventListener(ts, s), Np.remove(q);
          }, 0);
        };
      }
    }, [S, O, s, q]);
    const Y = z.useCallback(
      (C) => {
        if (!i && !d || q.paused) return;
        const H = C.key === "Tab" && !C.altKey && !C.ctrlKey && !C.metaKey, I = document.activeElement;
        if (H && I) {
          const aA = C.currentTarget, [uA, iA] = fg(aA);
          uA && iA ? !C.shiftKey && I === iA ? (C.preventDefault(), i && ta(uA, { select: !0 })) : C.shiftKey && I === uA && (C.preventDefault(), i && ta(iA, { select: !0 })) : I === aA && C.preventDefault();
        }
      },
      [i, d, q.paused]
    );
    return /* @__PURE__ */ y.jsx(fn.div, { tabIndex: -1, ...v, ref: Z, onKeyDown: Y });
  }, "FocusScope")
);
function sg(u, { select: r = !1 } = {}) {
  const c = document.activeElement;
  for (const i of u)
    if (ta(i, { select: r }), document.activeElement !== c) return;
}
Ot(sg, "focusFirst");
function fg(u) {
  const r = Ms(u), c = ds(r, u), i = ds(r.reverse(), u);
  return [c, i];
}
Ot(fg, "getTabbableEdges");
function Ms(u) {
  const r = [], c = document.createTreeWalker(u, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ Ot((i) => {
      const d = i.tagName === "INPUT" && i.type === "hidden";
      return i.disabled || i.hidden || d ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; c.nextNode(); ) r.push(c.currentNode);
  return r;
}
Ot(Ms, "getTabbableCandidates");
function ds(u, r) {
  const c = typeof r.checkVisibility == "function" && r.checkVisibility({ checkVisibilityCSS: !0 });
  for (const i of u)
    if (!(c ? !i.checkVisibility({ checkVisibilityCSS: !0 }) : dg(i, { upTo: r })))
      return i;
}
Ot(ds, "findVisible");
function dg(u, { upTo: r }) {
  if (getComputedStyle(u).visibility === "hidden") return !0;
  for (; u; ) {
    if (r !== void 0 && u === r) return !1;
    if (getComputedStyle(u).display === "none") return !0;
    u = u.parentElement;
  }
  return !1;
}
Ot(dg, "isHidden");
function mg(u) {
  return u instanceof HTMLInputElement && "select" in u;
}
Ot(mg, "isSelectableInput");
function ta(u, { select: r = !1 } = {}) {
  if (u && u.focus) {
    const c = document.activeElement;
    u.focus({ preventScroll: !0 }), u !== c && mg(u) && r && u.select();
  }
}
Ot(ta, "focus");
var Np = pg();
function pg() {
  let u = [];
  return {
    add(r) {
      const c = u[0];
      r !== c && (c == null || c.pause()), u = ms(u, r), u.unshift(r);
    },
    remove(r) {
      var c;
      u = ms(u, r), (c = u[0]) == null || c.resume();
    }
  };
}
Ot(pg, "createFocusScopesStack");
function ms(u, r) {
  const c = [...u], i = c.indexOf(r);
  return i !== -1 && c.splice(i, 1), c;
}
Ot(ms, "arrayRemove");
function gg(u) {
  return u.filter((r) => r.tagName !== "A");
}
Ot(gg, "removeLinks");
var zb = Object.defineProperty, jb = (u, r) => zb(u, "name", { value: r, configurable: !0 }), Db = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ jb(function(r, c) {
    var S;
    const { container: i, ...d } = r, [p, m] = z.useState(!1);
    Ca(() => m(!0), []);
    const v = i || p && ((S = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : S.body);
    return v ? Ss.createPortal(/* @__PURE__ */ y.jsx(fn.div, { ...d, ref: c }), v) : null;
  }, "Portal")
), Rb = Object.defineProperty, na = (u, r) => Rb(u, "name", { value: r, configurable: !0 });
function yg(u, r) {
  return z.useReducer((c, i) => r[c][i] ?? c, u);
}
na(yg, "useStateMachine");
var zs = /* @__PURE__ */ na((u) => {
  const { present: r, children: c } = u, i = hg(r), d = typeof c == "function" ? c({ present: i.isPresent }) : z.Children.only(c), p = vg(i.ref, bg(d));
  return typeof c == "function" || i.isPresent ? z.cloneElement(d, { ref: p }) : null;
}, "Presence");
function hg(u) {
  const [r, c] = z.useState(), i = z.useRef(null), d = z.useRef(u), p = z.useRef("none"), m = z.useRef(void 0), v = u ? "mounted" : "unmounted", [S, M] = yg(v, {
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
    S === "mounted" ? (p.current = m.current ?? ol(i.current), m.current = void 0) : p.current = "none";
  }, [S]), Ca(() => {
    const O = i.current, s = d.current;
    if (s !== u) {
      const Z = p.current, q = ol(O);
      u ? (m.current = q, M("MOUNT")) : q === "none" || (O == null ? void 0 : O.display) === "none" ? M("UNMOUNT") : M(s && Z !== q ? "ANIMATION_OUT" : "UNMOUNT"), d.current = u;
    }
  }, [u, M]), Ca(() => {
    if (r) {
      let O;
      const s = r.ownerDocument.defaultView ?? window, D = /* @__PURE__ */ na((q) => {
        const C = ol(i.current).includes(CSS.escape(q.animationName));
        if (q.target === r && C && (M("ANIMATION_END"), !d.current)) {
          const H = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", O = s.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = H);
          });
        }
      }, "handleAnimationEnd"), Z = /* @__PURE__ */ na((q) => {
        q.target === r && (p.current = ol(i.current));
      }, "handleAnimationStart");
      return r.addEventListener("animationstart", Z), r.addEventListener("animationcancel", D), r.addEventListener("animationend", D), () => {
        s.clearTimeout(O), r.removeEventListener("animationstart", Z), r.removeEventListener("animationcancel", D), r.removeEventListener("animationend", D);
      };
    } else
      M("ANIMATION_END");
  }, [r, M]), {
    isPresent: ["mounted", "unmountSuspended"].includes(S),
    ref: z.useCallback((O) => {
      if (O) {
        const s = getComputedStyle(O);
        i.current = s, m.current = ol(s);
      } else
        i.current = null;
      c(O);
    }, [])
  };
}
na(hg, "usePresence");
function ps(u, r) {
  if (typeof u == "function")
    return u(r);
  u != null && (u.current = r);
}
na(ps, "setRef");
function vg(...u) {
  const r = z.useRef(u);
  return r.current = u, z.useCallback((c) => {
    const i = r.current;
    let d = !1;
    const p = i.map((m) => {
      const v = ps(m, c);
      return !d && typeof v == "function" && (d = !0), v;
    });
    if (d)
      return () => {
        for (let m = 0; m < p.length; m++) {
          const v = p[m];
          typeof v == "function" ? v() : ps(i[m], null);
        }
      };
  }, []);
}
na(vg, "useStableComposedRefs");
function ol(u) {
  return (u == null ? void 0 : u.animationName) || "none";
}
na(ol, "getAnimationName");
function bg(u) {
  var i, d;
  let r = (i = Object.getOwnPropertyDescriptor(u.props, "ref")) == null ? void 0 : i.get, c = r && "isReactWarning" in r && r.isReactWarning;
  return c ? u.ref : (r = (d = Object.getOwnPropertyDescriptor(u, "ref")) == null ? void 0 : d.get, c = r && "isReactWarning" in r && r.isReactWarning, c ? u.props.ref : u.props.ref || u.ref);
}
na(bg, "getElementRef");
var Ob = Object.defineProperty, js = (u, r) => Ob(u, "name", { value: r, configurable: !0 }), Ar = 0, Ke = null;
function Eb(u) {
  return Ds(), u.children;
}
js(Eb, "FocusGuards");
function Ds() {
  z.useEffect(() => {
    Ke || (Ke = { start: gs(), end: gs() });
    const { start: u, end: r } = Ke;
    return document.body.firstElementChild !== u && document.body.insertAdjacentElement("afterbegin", u), document.body.lastElementChild !== r && document.body.insertAdjacentElement("beforeend", r), Ar++, () => {
      Ar === 1 && (Ke == null || Ke.start.remove(), Ke == null || Ke.end.remove(), Ke = null), Ar = Math.max(0, Ar - 1);
    };
  }, []);
}
js(Ds, "useFocusGuards");
function gs() {
  const u = document.createElement("span");
  return u.setAttribute("data-radix-focus-guard", ""), u.tabIndex = 0, u.style.outline = "none", u.style.opacity = "0", u.style.position = "fixed", u.style.pointerEvents = "none", u;
}
js(gs, "createFocusGuard");
var Ce = function() {
  return Ce = Object.assign || function(r) {
    for (var c, i = 1, d = arguments.length; i < d; i++) {
      c = arguments[i];
      for (var p in c) Object.prototype.hasOwnProperty.call(c, p) && (r[p] = c[p]);
    }
    return r;
  }, Ce.apply(this, arguments);
};
function Sg(u, r) {
  var c = {};
  for (var i in u) Object.prototype.hasOwnProperty.call(u, i) && r.indexOf(i) < 0 && (c[i] = u[i]);
  if (u != null && typeof Object.getOwnPropertySymbols == "function")
    for (var d = 0, i = Object.getOwnPropertySymbols(u); d < i.length; d++)
      r.indexOf(i[d]) < 0 && Object.prototype.propertyIsEnumerable.call(u, i[d]) && (c[i[d]] = u[i[d]]);
  return c;
}
function Vb(u, r, c) {
  if (c || arguments.length === 2) for (var i = 0, d = r.length, p; i < d; i++)
    (p || !(i in r)) && (p || (p = Array.prototype.slice.call(r, 0, i)), p[i] = r[i]);
  return u.concat(p || Array.prototype.slice.call(r));
}
var rr = "right-scroll-bar-position", or = "width-before-scroll-bar", Kb = "with-scroll-bars-hidden", wb = "--removed-body-scroll-bar-size";
function es(u, r) {
  return typeof u == "function" ? u(r) : u && (u.current = r), u;
}
function Cb(u, r) {
  var c = z.useState(function() {
    return {
      // value
      value: u,
      // last callback
      callback: r,
      // "memoized" public interface
      facade: {
        get current() {
          return c.value;
        },
        set current(i) {
          var d = c.value;
          d !== i && (c.value = i, c.callback(i, d));
        }
      }
    };
  })[0];
  return c.callback = r, c.facade;
}
var qb = typeof window < "u" ? z.useLayoutEffect : z.useEffect, xp = /* @__PURE__ */ new WeakMap();
function kb(u, r) {
  var c = Cb(null, function(i) {
    return u.forEach(function(d) {
      return es(d, i);
    });
  });
  return qb(function() {
    var i = xp.get(c);
    if (i) {
      var d = new Set(i), p = new Set(u), m = c.current;
      d.forEach(function(v) {
        p.has(v) || es(v, null);
      }), p.forEach(function(v) {
        d.has(v) || es(v, m);
      });
    }
    xp.set(c, u);
  }, [u]), c;
}
function Bb(u) {
  return u;
}
function Yb(u, r) {
  r === void 0 && (r = Bb);
  var c = [], i = !1, d = {
    read: function() {
      if (i)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return c.length ? c[c.length - 1] : u;
    },
    useMedium: function(p) {
      var m = r(p, i);
      return c.push(m), function() {
        c = c.filter(function(v) {
          return v !== m;
        });
      };
    },
    assignSyncMedium: function(p) {
      for (i = !0; c.length; ) {
        var m = c;
        c = [], m.forEach(p);
      }
      c = {
        push: function(v) {
          return p(v);
        },
        filter: function() {
          return c;
        }
      };
    },
    assignMedium: function(p) {
      i = !0;
      var m = [];
      if (c.length) {
        var v = c;
        c = [], v.forEach(p), m = c;
      }
      var S = function() {
        var O = m;
        m = [], O.forEach(p);
      }, M = function() {
        return Promise.resolve().then(S);
      };
      M(), c = {
        push: function(O) {
          m.push(O), M();
        },
        filter: function(O) {
          return m = m.filter(O), c;
        }
      };
    }
  };
  return d;
}
function Hb(u) {
  u === void 0 && (u = {});
  var r = Yb(null);
  return r.options = Ce({ async: !0, ssr: !1 }, u), r;
}
var Ng = function(u) {
  var r = u.sideCar, c = Sg(u, ["sideCar"]);
  if (!r)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var i = r.read();
  if (!i)
    throw new Error("Sidecar medium not found");
  return z.createElement(i, Ce({}, c));
};
Ng.isSideCarExport = !0;
function Gb(u, r) {
  return u.useMedium(r), Ng;
}
var xg = Hb(), as = function() {
}, dr = z.forwardRef(function(u, r) {
  var c = z.useRef(null), i = z.useState({
    onScrollCapture: as,
    onWheelCapture: as,
    onTouchMoveCapture: as
  }), d = i[0], p = i[1], m = u.forwardProps, v = u.children, S = u.className, M = u.removeScrollBar, O = u.enabled, s = u.shards, D = u.sideCar, Z = u.noRelative, q = u.noIsolation, Y = u.inert, C = u.allowPinchZoom, H = u.as, I = H === void 0 ? "div" : H, aA = u.gapMode, uA = Sg(u, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), iA = D, sA = kb([c, r]), J = Ce(Ce({}, uA), d);
  return z.createElement(
    z.Fragment,
    null,
    O && z.createElement(iA, { sideCar: xg, removeScrollBar: M, shards: s, noRelative: Z, noIsolation: q, inert: Y, setCallbacks: p, allowPinchZoom: !!C, lockRef: c, gapMode: aA }),
    m ? z.cloneElement(z.Children.only(v), Ce(Ce({}, J), { ref: sA })) : z.createElement(I, Ce({}, J, { className: S, ref: sA }), v)
  );
});
dr.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
dr.classNames = {
  fullWidth: or,
  zeroRight: rr
};
var Fb = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Zb() {
  if (!document)
    return null;
  var u = document.createElement("style");
  u.type = "text/css";
  var r = Fb();
  return r && u.setAttribute("nonce", r), u;
}
function Qb(u, r) {
  u.styleSheet ? u.styleSheet.cssText = r : u.appendChild(document.createTextNode(r));
}
function Jb(u) {
  var r = document.head || document.getElementsByTagName("head")[0];
  r.appendChild(u);
}
var Wb = function() {
  var u = 0, r = null;
  return {
    add: function(c) {
      u == 0 && (r = Zb()) && (Qb(r, c), Jb(r)), u++;
    },
    remove: function() {
      u--, !u && r && (r.parentNode && r.parentNode.removeChild(r), r = null);
    }
  };
}, Lb = function() {
  var u = Wb();
  return function(r, c) {
    z.useEffect(function() {
      return u.add(r), function() {
        u.remove();
      };
    }, [r && c]);
  };
}, Tg = function() {
  var u = Lb(), r = function(c) {
    var i = c.styles, d = c.dynamic;
    return u(i, d), null;
  };
  return r;
}, Xb = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, ns = function(u) {
  return parseInt(u || "", 10) || 0;
}, Ib = function(u) {
  var r = window.getComputedStyle(document.body), c = r[u === "padding" ? "paddingLeft" : "marginLeft"], i = r[u === "padding" ? "paddingTop" : "marginTop"], d = r[u === "padding" ? "paddingRight" : "marginRight"];
  return [ns(c), ns(i), ns(d)];
}, Pb = function(u) {
  if (u === void 0 && (u = "margin"), typeof window > "u")
    return Xb;
  var r = Ib(u), c = document.documentElement.clientWidth, i = window.innerWidth;
  return {
    left: r[0],
    top: r[1],
    right: r[2],
    gap: Math.max(0, i - c + r[2] - r[0])
  };
}, _b = Tg(), cl = "data-scroll-locked", $b = function(u, r, c, i) {
  var d = u.left, p = u.top, m = u.right, v = u.gap;
  return c === void 0 && (c = "margin"), `
  .`.concat(Kb, ` {
   overflow: hidden `).concat(i, `;
   padding-right: `).concat(v, "px ").concat(i, `;
  }
  body[`).concat(cl, `] {
    overflow: hidden `).concat(i, `;
    overscroll-behavior: contain;
    `).concat([
    r && "position: relative ".concat(i, ";"),
    c === "margin" && `
    padding-left: `.concat(d, `px;
    padding-top: `).concat(p, `px;
    padding-right: `).concat(m, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(v, "px ").concat(i, `;
    `),
    c === "padding" && "padding-right: ".concat(v, "px ").concat(i, ";")
  ].filter(Boolean).join(""), `
  }

  .`).concat(rr, ` {
    right: `).concat(v, "px ").concat(i, `;
  }

  .`).concat(or, ` {
    margin-right: `).concat(v, "px ").concat(i, `;
  }

  .`).concat(rr, " .").concat(rr, ` {
    right: 0 `).concat(i, `;
  }

  .`).concat(or, " .").concat(or, ` {
    margin-right: 0 `).concat(i, `;
  }

  body[`).concat(cl, `] {
    `).concat(wb, ": ").concat(v, `px;
  }
`);
}, Tp = function() {
  var u = parseInt(document.body.getAttribute(cl) || "0", 10);
  return isFinite(u) ? u : 0;
}, AS = function() {
  z.useEffect(function() {
    return document.body.setAttribute(cl, (Tp() + 1).toString()), function() {
      var u = Tp() - 1;
      u <= 0 ? document.body.removeAttribute(cl) : document.body.setAttribute(cl, u.toString());
    };
  }, []);
}, tS = function(u) {
  var r = u.noRelative, c = u.noImportant, i = u.gapMode, d = i === void 0 ? "margin" : i;
  AS();
  var p = z.useMemo(function() {
    return Pb(d);
  }, [d]);
  return z.createElement(_b, { styles: $b(p, !r, d, c ? "" : "!important") });
}, ys = !1;
if (typeof window < "u")
  try {
    var tr = Object.defineProperty({}, "passive", {
      get: function() {
        return ys = !0, !0;
      }
    });
    window.addEventListener("test", tr, tr), window.removeEventListener("test", tr, tr);
  } catch {
    ys = !1;
  }
var ul = ys ? { passive: !1 } : !1, eS = function(u) {
  return u.tagName === "TEXTAREA";
}, Ug = function(u, r) {
  if (!(u instanceof Element))
    return !1;
  var c = window.getComputedStyle(u);
  return (
    // not-not-scrollable
    c[r] !== "hidden" && // contains scroll inside self
    !(c.overflowY === c.overflowX && !eS(u) && c[r] === "visible")
  );
}, aS = function(u) {
  return Ug(u, "overflowY");
}, nS = function(u) {
  return Ug(u, "overflowX");
}, Up = function(u, r) {
  var c = r.ownerDocument, i = r;
  do {
    typeof ShadowRoot < "u" && i instanceof ShadowRoot && (i = i.host);
    var d = Mg(u, i);
    if (d) {
      var p = zg(u, i), m = p[1], v = p[2];
      if (m > v)
        return !0;
    }
    i = i.parentNode;
  } while (i && i !== c.body);
  return !1;
}, lS = function(u) {
  var r = u.scrollTop, c = u.scrollHeight, i = u.clientHeight;
  return [
    r,
    c,
    i
  ];
}, uS = function(u) {
  var r = u.scrollLeft, c = u.scrollWidth, i = u.clientWidth;
  return [
    r,
    c,
    i
  ];
}, Mg = function(u, r) {
  return u === "v" ? aS(r) : nS(r);
}, zg = function(u, r) {
  return u === "v" ? lS(r) : uS(r);
}, iS = function(u, r) {
  return u === "h" && r === "rtl" ? -1 : 1;
}, rS = function(u, r, c, i, d) {
  var p = iS(u, window.getComputedStyle(r).direction), m = p * i, v = c.target, S = r.contains(v), M = !1, O = m > 0, s = 0, D = 0;
  do {
    if (!v)
      break;
    var Z = zg(u, v), q = Z[0], Y = Z[1], C = Z[2], H = Y - C - p * q;
    (q || H) && Mg(u, v) && (s += H, D += q);
    var I = v.parentNode;
    v = I && I.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? I.host : I;
  } while (
    // portaled content
    !S && v !== document.body || // self content
    S && (r.contains(v) || r === v)
  );
  return (O && Math.abs(s) < 1 || !O && Math.abs(D) < 1) && (M = !0), M;
}, er = function(u) {
  return "changedTouches" in u ? [u.changedTouches[0].clientX, u.changedTouches[0].clientY] : [0, 0];
}, Mp = function(u) {
  return [u.deltaX, u.deltaY];
}, zp = function(u) {
  return u && "current" in u ? u.current : u;
}, oS = function(u, r) {
  return u[0] === r[0] && u[1] === r[1];
}, cS = function(u) {
  return `
  .block-interactivity-`.concat(u, ` {pointer-events: none;}
  .allow-interactivity-`).concat(u, ` {pointer-events: all;}
`);
}, sS = 0, il = [];
function fS(u) {
  var r = z.useRef([]), c = z.useRef([0, 0]), i = z.useRef(), d = z.useState(sS++)[0], p = z.useState(Tg)[0], m = z.useRef(u);
  z.useEffect(function() {
    m.current = u;
  }, [u]), z.useEffect(function() {
    if (u.inert) {
      document.body.classList.add("block-interactivity-".concat(d));
      var Y = Vb([u.lockRef.current], (u.shards || []).map(zp), !0).filter(Boolean);
      return Y.forEach(function(C) {
        return C.classList.add("allow-interactivity-".concat(d));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(d)), Y.forEach(function(C) {
          return C.classList.remove("allow-interactivity-".concat(d));
        });
      };
    }
  }, [u.inert, u.lockRef.current, u.shards]);
  var v = z.useCallback(function(Y, C) {
    if ("touches" in Y && Y.touches.length === 2 || Y.type === "wheel" && Y.ctrlKey)
      return !m.current.allowPinchZoom;
    var H = er(Y), I = c.current, aA = "deltaX" in Y ? Y.deltaX : I[0] - H[0], uA = "deltaY" in Y ? Y.deltaY : I[1] - H[1], iA, sA = Y.target, J = Math.abs(aA) > Math.abs(uA) ? "h" : "v";
    if ("touches" in Y && J === "h" && sA.type === "range")
      return !1;
    var B = window.getSelection(), gA = B && B.anchorNode, xA = gA ? gA === sA || gA.contains(sA) : !1;
    if (xA)
      return !1;
    var zA = Up(J, sA);
    if (!zA)
      return !0;
    if (zA ? iA = J : (iA = J === "v" ? "h" : "v", zA = Up(J, sA)), !zA)
      return !1;
    if (!i.current && "changedTouches" in Y && (aA || uA) && (i.current = iA), !iA)
      return !0;
    var oA = i.current || iA;
    return rS(oA, C, Y, oA === "h" ? aA : uA);
  }, []), S = z.useCallback(function(Y) {
    var C = Y;
    if (!(!il.length || il[il.length - 1] !== p)) {
      var H = "deltaY" in C ? Mp(C) : er(C), I = r.current.filter(function(iA) {
        return iA.name === C.type && (iA.target === C.target || C.target === iA.shadowParent) && oS(iA.delta, H);
      })[0];
      if (I && I.should) {
        C.cancelable && C.preventDefault();
        return;
      }
      if (!I) {
        var aA = (m.current.shards || []).map(zp).filter(Boolean).filter(function(iA) {
          return iA.contains(C.target);
        }), uA = aA.length > 0 ? v(C, aA[0]) : !m.current.noIsolation;
        uA && C.cancelable && C.preventDefault();
      }
    }
  }, []), M = z.useCallback(function(Y, C, H, I) {
    var aA = { name: Y, delta: C, target: H, should: I, shadowParent: dS(H) };
    r.current.push(aA), setTimeout(function() {
      r.current = r.current.filter(function(uA) {
        return uA !== aA;
      });
    }, 1);
  }, []), O = z.useCallback(function(Y) {
    c.current = er(Y), i.current = void 0;
  }, []), s = z.useCallback(function(Y) {
    M(Y.type, Mp(Y), Y.target, v(Y, u.lockRef.current));
  }, []), D = z.useCallback(function(Y) {
    M(Y.type, er(Y), Y.target, v(Y, u.lockRef.current));
  }, []);
  z.useEffect(function() {
    return il.push(p), u.setCallbacks({
      onScrollCapture: s,
      onWheelCapture: s,
      onTouchMoveCapture: D
    }), document.addEventListener("wheel", S, ul), document.addEventListener("touchmove", S, ul), document.addEventListener("touchstart", O, ul), function() {
      il = il.filter(function(Y) {
        return Y !== p;
      }), document.removeEventListener("wheel", S, ul), document.removeEventListener("touchmove", S, ul), document.removeEventListener("touchstart", O, ul);
    };
  }, []);
  var Z = u.removeScrollBar, q = u.inert;
  return z.createElement(
    z.Fragment,
    null,
    q ? z.createElement(p, { styles: cS(d) }) : null,
    Z ? z.createElement(tS, { noRelative: u.noRelative, gapMode: u.gapMode }) : null
  );
}
function dS(u) {
  for (var r = null; u !== null; )
    u instanceof ShadowRoot && (r = u.host, u = u.host), u = u.parentNode;
  return r;
}
const mS = Gb(xg, fS);
var jg = z.forwardRef(function(u, r) {
  return z.createElement(dr, Ce({}, u, { ref: r, sideCar: mS }));
});
jg.classNames = dr.classNames;
var pS = function(u) {
  if (typeof document > "u")
    return null;
  var r = Array.isArray(u) ? u[0] : u;
  return r.ownerDocument.body;
}, rl = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), nr = {}, ls = 0, Dg = function(u) {
  return u && (u.host || Dg(u.parentNode));
}, gS = function(u, r) {
  return r.map(function(c) {
    if (u.contains(c))
      return c;
    var i = Dg(c);
    return i && u.contains(i) ? i : (console.error("aria-hidden", c, "in not contained inside", u, ". Doing nothing"), null);
  }).filter(function(c) {
    return !!c;
  });
}, yS = function(u, r, c, i) {
  var d = gS(r, Array.isArray(u) ? u : [u]);
  nr[c] || (nr[c] = /* @__PURE__ */ new WeakMap());
  var p = nr[c], m = [], v = /* @__PURE__ */ new Set(), S = new Set(d), M = function(s) {
    !s || v.has(s) || (v.add(s), M(s.parentNode));
  };
  d.forEach(M);
  var O = function(s) {
    !s || S.has(s) || Array.prototype.forEach.call(s.children, function(D) {
      if (v.has(D))
        O(D);
      else
        try {
          var Z = D.getAttribute(i), q = Z !== null && Z !== "false", Y = (rl.get(D) || 0) + 1, C = (p.get(D) || 0) + 1;
          rl.set(D, Y), p.set(D, C), m.push(D), Y === 1 && q && ar.set(D, !0), C === 1 && D.setAttribute(c, "true"), q || D.setAttribute(i, "true");
        } catch (H) {
          console.error("aria-hidden: cannot operate on ", D, H);
        }
    });
  };
  return O(r), v.clear(), ls++, function() {
    m.forEach(function(s) {
      var D = rl.get(s) - 1, Z = p.get(s) - 1;
      rl.set(s, D), p.set(s, Z), D || (ar.has(s) || s.removeAttribute(i), ar.delete(s)), Z || s.removeAttribute(c);
    }), ls--, ls || (rl = /* @__PURE__ */ new WeakMap(), rl = /* @__PURE__ */ new WeakMap(), ar = /* @__PURE__ */ new WeakMap(), nr = {});
  };
}, hS = function(u, r, c) {
  c === void 0 && (c = "data-aria-hidden");
  var i = Array.from(Array.isArray(u) ? u : [u]), d = pS(u);
  return d ? (i.push.apply(i, Array.from(d.querySelectorAll("[aria-live], script"))), yS(i, d, c, "aria-hidden")) : function() {
    return null;
  };
}, vS = Object.defineProperty, ce = (u, r) => vS(u, "name", { value: r, configurable: !0 }), Rs = "Dialog", [Rg, EN] = /* @__PURE__ */ Xp(Rs), [bS, qe] = Rg(Rs), SS = /* @__PURE__ */ ce((u) => {
  const {
    __scopeDialog: r,
    children: c,
    open: i,
    defaultOpen: d,
    onOpenChange: p,
    modal: m = !0
  } = u, v = z.useRef(null), S = z.useRef(null), [M, O] = _p({
    prop: i,
    defaultProp: d ?? !1,
    onChange: p,
    caller: Rs
  }), [s, D] = z.useState(0), [Z, q] = z.useState(0);
  return /* @__PURE__ */ y.jsx(
    bS,
    {
      scope: r,
      triggerRef: v,
      contentRef: S,
      contentId: ir(),
      titleId: ir(),
      descriptionId: ir(),
      titlePresent: s > 0,
      descriptionPresent: Z > 0,
      setTitleCount: D,
      setDescriptionCount: q,
      open: M,
      onOpenChange: O,
      onOpenToggle: z.useCallback(() => O((Y) => !Y), [O]),
      modal: m,
      children: c
    }
  );
}, "Dialog"), Og = "DialogPortal", [NS, Eg] = Rg(Og, {
  forceMount: void 0
}), xS = /* @__PURE__ */ ce((u) => {
  const { __scopeDialog: r, forceMount: c, children: i, container: d } = u, p = qe(Og, r);
  return /* @__PURE__ */ y.jsx(NS, { scope: r, forceMount: c, children: z.Children.map(i, (m) => /* @__PURE__ */ y.jsx(zs, { present: c || p.open, children: /* @__PURE__ */ y.jsx(Db, { asChild: !0, container: d, children: m }) })) });
}, "DialogPortal"), hs = "DialogOverlay", Vg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ ce(function(r, c) {
    const i = Eg(hs, r.__scopeDialog), { forceMount: d = i.forceMount, ...p } = r, m = qe(hs, r.__scopeDialog);
    return m.modal ? /* @__PURE__ */ y.jsx(zs, { present: d || m.open, children: /* @__PURE__ */ y.jsx(US, { ...p, ref: c }) }) : null;
  }, "DialogOverlay")
), TS = /* @__PURE__ */ Ts("DialogOverlay.RemoveScroll"), US = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(r, c) {
    const { __scopeDialog: i, ...d } = r, p = qe(hs, i), m = rg(), v = dl(c, m);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y.jsx(jg, { as: TS, allowPinchZoom: !0, shards: [p.contentRef], children: /* @__PURE__ */ y.jsx(
        fn.div,
        {
          "data-state": Os(p.open),
          ...d,
          ref: v,
          style: { pointerEvents: "auto", ...d.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), bu = "DialogContent", Kg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ ce(function(r, c) {
    const i = Eg(bu, r.__scopeDialog), { forceMount: d = i.forceMount, ...p } = r, m = qe(bu, r.__scopeDialog);
    return /* @__PURE__ */ y.jsx(zs, { present: d || m.open, children: m.modal ? /* @__PURE__ */ y.jsx(MS, { ...p, ref: c }) : /* @__PURE__ */ y.jsx(zS, { ...p, ref: c }) });
  }, "DialogContent")
), MS = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(r, c) {
    const i = qe(bu, r.__scopeDialog), d = z.useRef(null), p = dl(c, i.contentRef, d);
    return z.useEffect(() => {
      const m = d.current;
      if (m) return hS(m);
    }, []), /* @__PURE__ */ y.jsx(
      wg,
      {
        ...r,
        ref: p,
        trapFocus: i.open,
        disableOutsidePointerEvents: i.open,
        onCloseAutoFocus: wa(r.onCloseAutoFocus, (m) => {
          var v;
          m.preventDefault(), (v = i.triggerRef.current) == null || v.focus();
        }),
        onPointerDownOutside: wa(r.onPointerDownOutside, (m) => {
          const v = m.detail.originalEvent, S = v.button === 0 && v.ctrlKey === !0;
          (v.button === 2 || S) && m.preventDefault();
        }),
        onFocusOutside: wa(
          r.onFocusOutside,
          (m) => m.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), zS = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(r, c) {
    const i = qe(bu, r.__scopeDialog), d = z.useRef(!1), p = z.useRef(!1);
    return /* @__PURE__ */ y.jsx(
      wg,
      {
        ...r,
        ref: c,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (m) => {
          var v, S;
          (v = r.onCloseAutoFocus) == null || v.call(r, m), m.defaultPrevented || (d.current || (S = i.triggerRef.current) == null || S.focus(), m.preventDefault()), d.current = !1, p.current = !1;
        },
        onInteractOutside: (m) => {
          var M, O;
          (M = r.onInteractOutside) == null || M.call(r, m), m.defaultPrevented || (d.current = !0, m.detail.originalEvent.type === "pointerdown" && (p.current = !0));
          const v = m.target;
          ((O = i.triggerRef.current) == null ? void 0 : O.contains(v)) && m.preventDefault(), m.detail.originalEvent.type === "focusin" && p.current && m.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), wg = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(r, c) {
    const { __scopeDialog: i, trapFocus: d, onOpenAutoFocus: p, onCloseAutoFocus: m, ...v } = r, S = qe(bu, i);
    return Ds(), /* @__PURE__ */ y.jsx(y.Fragment, { children: /* @__PURE__ */ y.jsx(
      Mb,
      {
        asChild: !0,
        loop: !0,
        trapped: d,
        onMountAutoFocus: p,
        onUnmountAutoFocus: m,
        children: /* @__PURE__ */ y.jsx(
          xb,
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
), jS = "DialogTitle", Cg = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ ce(function(r, c) {
    const { __scopeDialog: i, ...d } = r, p = qe(jS, i), { setTitleCount: m } = p;
    return Ca(() => (m((v) => v + 1), () => m((v) => v - 1)), [m]), /* @__PURE__ */ y.jsx(fn.h2, { id: p.titleId, ...d, ref: c });
  }, "DialogTitle")
), DS = "DialogDescription", qg = /* @__PURE__ */ z.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ce(function(r, c) {
    const { __scopeDialog: i, ...d } = r, p = qe(DS, i), { setDescriptionCount: m } = p;
    return Ca(() => (m((v) => v + 1), () => m((v) => v - 1)), [m]), /* @__PURE__ */ y.jsx(fn.p, { id: p.descriptionId, ...d, ref: c });
  }, "DialogDescription")
), RS = "DialogClose", OS = /* @__PURE__ */ z.forwardRef(
  /* @__PURE__ */ ce(function(r, c) {
    const { __scopeDialog: i, ...d } = r, p = qe(RS, i);
    return /* @__PURE__ */ y.jsx(
      fn.button,
      {
        type: "button",
        ...d,
        ref: c,
        onClick: wa(r.onClick, () => p.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function Os(u) {
  return u ? "open" : "closed";
}
ce(Os, "getState");
function kg(u) {
  var r, c, i = "";
  if (typeof u == "string" || typeof u == "number") i += u;
  else if (typeof u == "object") if (Array.isArray(u)) {
    var d = u.length;
    for (r = 0; r < d; r++) u[r] && (c = kg(u[r])) && (i && (i += " "), i += c);
  } else for (c in u) u[c] && (i && (i += " "), i += c);
  return i;
}
function ES() {
  for (var u, r, c = 0, i = "", d = arguments.length; c < d; c++) (u = arguments[c]) && (r = kg(u)) && (i && (i += " "), i += r);
  return i;
}
const VS = (u, r) => {
  const c = new Array(u.length + r.length);
  for (let i = 0; i < u.length; i++)
    c[i] = u[i];
  for (let i = 0; i < r.length; i++)
    c[u.length + i] = r[i];
  return c;
}, KS = (u, r) => ({
  classGroupId: u,
  validator: r
}), Bg = (u = /* @__PURE__ */ new Map(), r = null, c) => ({
  nextPart: u,
  validators: r,
  classGroupId: c
}), fr = "-", jp = [], wS = "arbitrary..", CS = (u) => {
  const r = kS(u), {
    conflictingClassGroups: c,
    conflictingClassGroupModifiers: i
  } = u;
  return {
    getClassGroupId: (m) => {
      if (m.startsWith("[") && m.endsWith("]"))
        return qS(m);
      const v = m.split(fr), S = v[0] === "" && v.length > 1 ? 1 : 0;
      return Yg(v, S, r);
    },
    getConflictingClassGroupIds: (m, v) => {
      if (v) {
        const S = i[m], M = c[m];
        return S ? M ? VS(M, S) : S : M || jp;
      }
      return c[m] || jp;
    }
  };
}, Yg = (u, r, c) => {
  if (u.length - r === 0)
    return c.classGroupId;
  const d = u[r], p = c.nextPart.get(d);
  if (p) {
    const M = Yg(u, r + 1, p);
    if (M) return M;
  }
  const m = c.validators;
  if (m === null)
    return;
  const v = r === 0 ? u.join(fr) : u.slice(r).join(fr), S = m.length;
  for (let M = 0; M < S; M++) {
    const O = m[M];
    if (O.validator(v))
      return O.classGroupId;
  }
}, qS = (u) => u.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = u.slice(1, -1), c = r.indexOf(":"), i = r.slice(0, c);
  return i ? wS + i : void 0;
})(), kS = (u) => {
  const {
    theme: r,
    classGroups: c
  } = u;
  return BS(c, r);
}, BS = (u, r) => {
  const c = Bg();
  for (const i in u) {
    const d = u[i];
    Es(d, c, i, r);
  }
  return c;
}, Es = (u, r, c, i) => {
  const d = u.length;
  for (let p = 0; p < d; p++) {
    const m = u[p];
    YS(m, r, c, i);
  }
}, YS = (u, r, c, i) => {
  if (typeof u == "string") {
    HS(u, r, c);
    return;
  }
  if (typeof u == "function") {
    GS(u, r, c, i);
    return;
  }
  FS(u, r, c, i);
}, HS = (u, r, c) => {
  const i = u === "" ? r : Hg(r, u);
  i.classGroupId = c;
}, GS = (u, r, c, i) => {
  if (ZS(u)) {
    Es(u(i), r, c, i);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(KS(c, u));
}, FS = (u, r, c, i) => {
  const d = Object.entries(u), p = d.length;
  for (let m = 0; m < p; m++) {
    const [v, S] = d[m];
    Es(S, Hg(r, v), c, i);
  }
}, Hg = (u, r) => {
  let c = u;
  const i = r.split(fr), d = i.length;
  for (let p = 0; p < d; p++) {
    const m = i[p];
    let v = c.nextPart.get(m);
    v || (v = Bg(), c.nextPart.set(m, v)), c = v;
  }
  return c;
}, ZS = (u) => "isThemeGetter" in u && u.isThemeGetter === !0, QS = (u) => {
  if (u < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, c = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null);
  const d = (p, m) => {
    c[p] = m, r++, r > u && (r = 0, i = c, c = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(p) {
      let m = c[p];
      if (m !== void 0)
        return m;
      if ((m = i[p]) !== void 0)
        return d(p, m), m;
    },
    set(p, m) {
      p in c ? c[p] = m : d(p, m);
    }
  };
}, vs = "!", Dp = ":", JS = [], Rp = (u, r, c, i, d) => ({
  modifiers: u,
  hasImportantModifier: r,
  baseClassName: c,
  maybePostfixModifierPosition: i,
  isExternal: d
}), WS = (u) => {
  const {
    prefix: r,
    experimentalParseClassName: c
  } = u;
  let i = (d) => {
    const p = [];
    let m = 0, v = 0, S = 0, M;
    const O = d.length;
    for (let Y = 0; Y < O; Y++) {
      const C = d[Y];
      if (m === 0 && v === 0) {
        if (C === Dp) {
          p.push(d.slice(S, Y)), S = Y + 1;
          continue;
        }
        if (C === "/") {
          M = Y;
          continue;
        }
      }
      C === "[" ? m++ : C === "]" ? m-- : C === "(" ? v++ : C === ")" && v--;
    }
    const s = p.length === 0 ? d : d.slice(S);
    let D = s, Z = !1;
    s.endsWith(vs) ? (D = s.slice(0, -1), Z = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      s.startsWith(vs) && (D = s.slice(1), Z = !0)
    );
    const q = M && M > S ? M - S : void 0;
    return Rp(p, Z, D, q);
  };
  if (r) {
    const d = r + Dp, p = i;
    i = (m) => m.startsWith(d) ? p(m.slice(d.length)) : Rp(JS, !1, m, void 0, !0);
  }
  if (c) {
    const d = i;
    i = (p) => c({
      className: p,
      parseClassName: d
    });
  }
  return i;
}, LS = (u) => {
  const r = /* @__PURE__ */ new Map();
  return u.orderSensitiveModifiers.forEach((c, i) => {
    r.set(c, 1e6 + i);
  }), (c) => {
    const i = [];
    let d = [];
    for (let p = 0; p < c.length; p++) {
      const m = c[p], v = m[0] === "[", S = r.has(m);
      v || S ? (d.length > 0 && (d.sort(), i.push(...d), d = []), i.push(m)) : d.push(m);
    }
    return d.length > 0 && (d.sort(), i.push(...d)), i;
  };
}, XS = (u) => ({
  cache: QS(u.cacheSize),
  parseClassName: WS(u),
  sortModifiers: LS(u),
  postfixLookupClassGroupIds: IS(u),
  ...CS(u)
}), IS = (u) => {
  const r = /* @__PURE__ */ Object.create(null), c = u.postfixLookupClassGroups;
  if (c)
    for (let i = 0; i < c.length; i++)
      r[c[i]] = !0;
  return r;
}, PS = /\s+/, _S = (u, r) => {
  const {
    parseClassName: c,
    getClassGroupId: i,
    getConflictingClassGroupIds: d,
    sortModifiers: p,
    postfixLookupClassGroupIds: m
  } = r, v = [], S = u.trim().split(PS);
  let M = "";
  for (let O = S.length - 1; O >= 0; O -= 1) {
    const s = S[O], {
      isExternal: D,
      modifiers: Z,
      hasImportantModifier: q,
      baseClassName: Y,
      maybePostfixModifierPosition: C
    } = c(s);
    if (D) {
      M = s + (M.length > 0 ? " " + M : M);
      continue;
    }
    let H = !!C, I;
    if (H) {
      const J = Y.substring(0, C);
      I = i(J);
      const B = I && m[I] ? i(Y) : void 0;
      B && B !== I && (I = B, H = !1);
    } else
      I = i(Y);
    if (!I) {
      if (!H) {
        M = s + (M.length > 0 ? " " + M : M);
        continue;
      }
      if (I = i(Y), !I) {
        M = s + (M.length > 0 ? " " + M : M);
        continue;
      }
      H = !1;
    }
    const aA = Z.length === 0 ? "" : Z.length === 1 ? Z[0] : p(Z).join(":"), uA = q ? aA + vs : aA, iA = uA + I;
    if (v.indexOf(iA) > -1)
      continue;
    v.push(iA);
    const sA = d(I, H);
    for (let J = 0; J < sA.length; ++J) {
      const B = sA[J];
      v.push(uA + B);
    }
    M = s + (M.length > 0 ? " " + M : M);
  }
  return M;
}, $S = (...u) => {
  let r = 0, c, i, d = "";
  for (; r < u.length; )
    (c = u[r++]) && (i = Gg(c)) && (d && (d += " "), d += i);
  return d;
}, Gg = (u) => {
  if (typeof u == "string")
    return u;
  let r, c = "";
  for (let i = 0; i < u.length; i++)
    u[i] && (r = Gg(u[i])) && (c && (c += " "), c += r);
  return c;
}, AN = (u, ...r) => {
  let c, i, d, p;
  const m = (S) => {
    const M = r.reduce((O, s) => s(O), u());
    return c = XS(M), i = c.cache.get, d = c.cache.set, p = v, v(S);
  }, v = (S) => {
    const M = i(S);
    if (M)
      return M;
    const O = _S(S, c);
    return d(S, O), O;
  };
  return p = m, (...S) => p($S(...S));
}, tN = [], ct = (u) => {
  const r = (c) => c[u] || tN;
  return r.isThemeGetter = !0, r.themeKey = u, r;
}, Fg = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Zg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, eN = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, aN = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, nN = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, lN = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, uN = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, iN = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ka = (u) => eN.test(u), bA = (u) => !!u && !Number.isNaN(Number(u)), we = (u) => !!u && Number.isInteger(Number(u)), us = (u) => u.endsWith("%") && bA(u.slice(0, -1)), Aa = (u) => aN.test(u), Qg = () => !0, rN = (u) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  nN.test(u) && !lN.test(u)
), Vs = () => !1, oN = (u) => uN.test(u), cN = (u) => iN.test(u), sN = (u) => !AA(u) && !eA(u), fN = (u) => u.startsWith("@container") && (u[10] === "/" && u[11] !== void 0 || u[11] === "s" && u[16] !== void 0 && u.startsWith("-size/", 10) || u[11] === "n" && u[18] !== void 0 && u.startsWith("-normal/", 10)), dN = (u) => qa(u, Lg, Vs), AA = (u) => Fg.test(u), sn = (u) => qa(u, Xg, rN), Op = (u) => qa(u, SN, bA), mN = (u) => qa(u, Pg, Qg), pN = (u) => qa(u, Ig, Vs), Ep = (u) => qa(u, Jg, Vs), gN = (u) => qa(u, Wg, cN), lr = (u) => qa(u, _g, oN), eA = (u) => Zg.test(u), yu = (u) => dn(u, Xg), yN = (u) => dn(u, Ig), Vp = (u) => dn(u, Jg), hN = (u) => dn(u, Lg), vN = (u) => dn(u, Wg), ur = (u) => dn(u, _g, !0), bN = (u) => dn(u, Pg, !0), qa = (u, r, c) => {
  const i = Fg.exec(u);
  return i ? i[1] ? r(i[1]) : c(i[2]) : !1;
}, dn = (u, r, c = !1) => {
  const i = Zg.exec(u);
  return i ? i[1] ? r(i[1]) : c : !1;
}, Jg = (u) => u === "position" || u === "percentage", Wg = (u) => u === "image" || u === "url", Lg = (u) => u === "length" || u === "size" || u === "bg-size", Xg = (u) => u === "length", SN = (u) => u === "number", Ig = (u) => u === "family-name", Pg = (u) => u === "number" || u === "weight", _g = (u) => u === "shadow", NN = () => {
  const u = ct("color"), r = ct("font"), c = ct("text"), i = ct("font-weight"), d = ct("tracking"), p = ct("leading"), m = ct("breakpoint"), v = ct("container"), S = ct("spacing"), M = ct("radius"), O = ct("shadow"), s = ct("inset-shadow"), D = ct("text-shadow"), Z = ct("drop-shadow"), q = ct("blur"), Y = ct("perspective"), C = ct("aspect"), H = ct("ease"), I = ct("animate"), aA = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], uA = () => [
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
  ], iA = () => [...uA(), eA, AA], sA = () => ["auto", "hidden", "clip", "visible", "scroll"], J = () => ["auto", "contain", "none"], B = () => [eA, AA, S], gA = () => [Ka, "full", "auto", ...B()], xA = () => [we, "none", "subgrid", eA, AA], zA = () => ["auto", {
    span: ["full", we, eA, AA]
  }, we, eA, AA], oA = () => [we, "auto", eA, AA], JA = () => ["auto", "min", "max", "fr", eA, AA], HA = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], TA = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], k = () => ["auto", ...B()], P = () => [Ka, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...B()], lA = () => [v, Ka, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...B()], dA = () => [Ka, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...B()], F = () => [u, eA, AA], GA = () => [...uA(), Vp, Ep, {
    position: [eA, AA]
  }], WA = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], rt = () => ["auto", "cover", "contain", hN, dN, {
    size: [eA, AA]
  }], h = () => [us, yu, sn], U = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    M,
    eA,
    AA
  ], w = () => ["", bA, yu, sn], G = () => ["solid", "dashed", "dotted", "double"], tA = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], Q = () => [bA, us, Vp, Ep], cA = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    q,
    eA,
    AA
  ], L = () => ["none", bA, eA, AA], _ = () => ["none", bA, eA, AA], LA = () => [bA, eA, AA], BA = () => [Ka, "full", ...B()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Aa],
      breakpoint: [Aa],
      color: [Qg],
      container: [Aa],
      "drop-shadow": [Aa],
      ease: ["in", "out", "in-out"],
      font: [sN],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Aa],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Aa],
      shadow: [Aa],
      spacing: ["px", bA],
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
        aspect: ["auto", "square", Ka, AA, eA, C]
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
        "@container": ["", "normal", "size", eA, AA]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [fN],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [bA, "auto", AA, eA, v]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": aA()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": aA()
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
        object: iA()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: sA()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": sA()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": sA()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: J()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": J()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": J()
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
        inset: gA()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": gA()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": gA()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": gA(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: gA()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": gA(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: gA()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": gA()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": gA()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: gA()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: gA()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: gA()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: gA()
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
        z: [we, "auto", eA, AA]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Ka, "full", "auto", v, ...B()]
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
        flex: [bA, Ka, "auto", "initial", "none", AA]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", bA, eA, AA]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", bA, eA, AA]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [we, "first", "last", "none", eA, AA]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": xA()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: zA()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": oA()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": oA()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": xA()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: zA()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": oA()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": oA()
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
        "auto-cols": JA()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": JA()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: B()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": B()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": B()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...HA(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...TA(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...TA()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...HA()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...TA(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...TA(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": HA()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...TA(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...TA()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: B()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: B()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: B()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: B()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: B()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: B()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: B()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: B()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: B()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: B()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: B()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: k()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: k()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: k()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: k()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: k()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: k()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: k()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: k()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: k()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: k()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: k()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": B()
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
        "space-y": B()
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
        size: P()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...lA()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...lA()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...lA()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...dA()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...dA()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...dA()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [v, "screen", ...P()]
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
          ...P()
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
            screen: [m]
          },
          ...P()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...P()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...P()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ...P()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", c, yu, sn]
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
        font: [i, bN, mN]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", us, AA]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [yN, pN, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [AA]
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
        tracking: [d, eA, AA]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [bA, "none", eA, Op]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          p,
          ...B()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", eA, AA]
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
        list: ["disc", "decimal", "none", eA, AA]
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
        placeholder: F()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: F()
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
        decoration: [...G(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [bA, "from-font", "auto", eA, sn]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: F()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [bA, "auto", eA, AA]
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
        indent: B()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [we, eA, AA]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", eA, AA]
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
        content: ["none", eA, AA]
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
        bg: GA()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: WA()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: rt()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, we, eA, AA],
          radial: ["", eA, AA],
          conic: ["", we, eA, AA]
        }, vN, gN]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: F()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: h()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: h()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: h()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: F()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: F()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: F()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: U()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": U()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": U()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": U()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": U()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": U()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": U()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": U()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": U()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": U()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": U()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": U()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": U()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": U()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": U()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: w()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": w()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": w()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": w()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": w()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": w()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": w()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": w()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": w()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": w()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": w()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": w()
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
        "divide-y": w()
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
        border: [...G(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...G(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: F()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": F()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": F()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": F()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": F()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": F()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": F()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": F()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": F()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": F()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": F()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: F()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...G(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [bA, eA, AA]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", bA, yu, sn]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: F()
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
          O,
          ur,
          lr
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: F()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", s, ur, lr]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": F()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: w()
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
        ring: F()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [bA, sn]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": F()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": w()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": F()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", D, ur, lr]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": F()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [bA, eA, AA]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...tA(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": tA()
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
        "mask-linear": [bA]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": Q()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": Q()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": F()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": F()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": Q()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": Q()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": F()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": F()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": Q()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": Q()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": F()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": F()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": Q()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": Q()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": F()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": F()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": Q()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": Q()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": F()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": F()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": Q()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": Q()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": F()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": F()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": Q()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": Q()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": F()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": F()
      }],
      "mask-image-radial": [{
        "mask-radial": [eA, AA]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": Q()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": Q()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": F()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": F()
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
        "mask-radial-at": uA()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [bA]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": Q()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": Q()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": F()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": F()
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
        mask: GA()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: WA()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: rt()
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
        mask: ["none", eA, AA]
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
          eA,
          AA
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: cA()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [bA, eA, AA]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [bA, eA, AA]
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
          Z,
          ur,
          lr
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": F()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", bA, eA, AA]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [bA, eA, AA]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", bA, eA, AA]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [bA, eA, AA]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", bA, eA, AA]
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
          eA,
          AA
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": cA()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [bA, eA, AA]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [bA, eA, AA]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", bA, eA, AA]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [bA, eA, AA]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", bA, eA, AA]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [bA, eA, AA]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [bA, eA, AA]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", bA, eA, AA]
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
        "border-spacing": B()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": B()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": B()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", eA, AA]
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
        duration: [bA, "initial", eA, AA]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", H, eA, AA]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [bA, eA, AA]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", I, eA, AA]
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
        perspective: [Y, eA, AA]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": iA()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: L()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": L()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": L()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": L()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: _()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": _()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": _()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": _()
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
        skew: LA()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": LA()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": LA()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [eA, AA, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: iA()
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
        translate: BA()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": BA()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": BA()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": BA()
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
        zoom: [we, eA, AA]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: F()
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
        caret: F()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", eA, AA]
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
        "scrollbar-thumb": F()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": F()
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
        "scroll-m": B()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": B()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": B()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": B()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": B()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": B()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": B()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": B()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": B()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": B()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": B()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": B()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": B()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": B()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": B()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": B()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": B()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": B()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": B()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": B()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": B()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": B()
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
        "will-change": ["auto", "scroll", "contents", "transform", eA, AA]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...F()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [bA, yu, sn, Op]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...F()]
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
}, xN = /* @__PURE__ */ AN(NN);
function ml(...u) {
  return xN(ES(u));
}
const Ks = SS, TN = xS, $g = z.forwardRef(({ className: u, ...r }, c) => /* @__PURE__ */ y.jsx(
  Vg,
  {
    ref: c,
    className: ml(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      u
    ),
    ...r
  }
));
$g.displayName = Vg.displayName;
const mr = z.forwardRef(({ className: u, children: r, ...c }, i) => /* @__PURE__ */ y.jsxs(TN, { children: [
  /* @__PURE__ */ y.jsx($g, {}),
  /* @__PURE__ */ y.jsxs(
    Kg,
    {
      ref: i,
      className: ml(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        u
      ),
      ...c,
      children: [
        r,
        /* @__PURE__ */ y.jsxs(OS, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ y.jsx(Gp, { className: "h-4 w-4" }),
          /* @__PURE__ */ y.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
mr.displayName = Kg.displayName;
const pr = ({ className: u, ...r }) => /* @__PURE__ */ y.jsx("div", { className: ml("flex flex-col space-y-1.5 text-center sm:text-left", u), ...r });
pr.displayName = "DialogHeader";
const gr = ({ className: u, ...r }) => /* @__PURE__ */ y.jsx(
  "div",
  {
    className: ml("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", u),
    ...r
  }
);
gr.displayName = "DialogFooter";
const yr = z.forwardRef(({ className: u, ...r }, c) => /* @__PURE__ */ y.jsx(
  Cg,
  {
    ref: c,
    className: ml("text-lg font-semibold leading-none tracking-tight", u),
    ...r
  }
));
yr.displayName = Cg.displayName;
const hr = z.forwardRef(({ className: u, ...r }, c) => /* @__PURE__ */ y.jsx(
  qg,
  {
    ref: c,
    className: ml("text-sm text-muted-foreground", u),
    ...r
  }
));
hr.displayName = qg.displayName;
const Kp = {
  name: "",
  phone: "",
  zoneId: "",
  address: "",
  notes: ""
};
function UN({
  open: u,
  onOpenChange: r,
  value: c,
  onSave: i
}) {
  const [d, p] = z.useState(c);
  z.useEffect(() => {
    u && p(c);
  }, [u, c]);
  const m = (S, M) => p((O) => ({ ...O, [S]: M })), v = d.name.trim() && d.phone.trim() && d.zoneId && d.address.trim();
  return /* @__PURE__ */ y.jsx(Ks, { open: u, onOpenChange: r, children: /* @__PURE__ */ y.jsxs(mr, { dir: "rtl", className: "max-w-lg border-border bg-surface text-right", children: [
    /* @__PURE__ */ y.jsxs(pr, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ y.jsxs(yr, { className: "flex items-center gap-2 text-lg font-extrabold", children: [
        /* @__PURE__ */ y.jsx(Bp, { className: "h-5 w-5 text-brand" }),
        "بيانات التوصيل"
      ] }),
      /* @__PURE__ */ y.jsx(hr, { children: "أضف بيانات العميل والعنوان لهذا الطلب." })
    ] }),
    /* @__PURE__ */ y.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ y.jsx(vu, { label: "اسم العميل", children: /* @__PURE__ */ y.jsx(
        "input",
        {
          value: d.name,
          onChange: (S) => m("name", S.target.value),
          className: hu,
          placeholder: "أحمد محمود"
        }
      ) }),
      /* @__PURE__ */ y.jsx(vu, { label: "رقم الهاتف", children: /* @__PURE__ */ y.jsx(
        "input",
        {
          value: d.phone,
          onChange: (S) => m("phone", S.target.value),
          inputMode: "tel",
          dir: "ltr",
          className: `${hu} text-right`,
          placeholder: "01000000000"
        }
      ) }),
      /* @__PURE__ */ y.jsx(vu, { label: "المنطقة", children: /* @__PURE__ */ y.jsxs(
        "select",
        {
          value: d.zoneId,
          onChange: (S) => m("zoneId", S.target.value),
          className: hu,
          children: [
            /* @__PURE__ */ y.jsx("option", { value: "", children: "اختر المنطقة" }),
            sr.map((S) => /* @__PURE__ */ y.jsxs("option", { value: S.id, children: [
              S.name,
              " — رسوم ",
              S.fee,
              " ج.م"
            ] }, S.id))
          ]
        }
      ) }),
      /* @__PURE__ */ y.jsx(vu, { label: "العنوان بالتفصيل", children: /* @__PURE__ */ y.jsx(
        "input",
        {
          value: d.address,
          onChange: (S) => m("address", S.target.value),
          className: hu,
          placeholder: "شارع / عمارة / دور / شقة"
        }
      ) }),
      /* @__PURE__ */ y.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ y.jsx(vu, { label: "ملاحظات التوصيل (اختياري)", children: /* @__PURE__ */ y.jsx(
        "textarea",
        {
          value: d.notes,
          onChange: (S) => m("notes", S.target.value),
          rows: 2,
          className: `${hu} h-auto resize-none py-2`,
          placeholder: "مثال: الجرس معطل — اتصل عند الوصول"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ y.jsxs(gr, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ y.jsx(
        "button",
        {
          type: "button",
          disabled: !v,
          onClick: () => i(d),
          className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-opacity disabled:opacity-40",
          children: "حفظ"
        }
      ),
      /* @__PURE__ */ y.jsx(
        "button",
        {
          type: "button",
          onClick: () => r(!1),
          className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground",
          children: "إلغاء"
        }
      )
    ] })
  ] }) });
}
const hu = "h-11 w-full rounded-xl border border-border bg-surface-2/70 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60";
function vu({ label: u, children: r }) {
  return /* @__PURE__ */ y.jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ y.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: u }),
    r
  ] });
}
const MN = { cash: "نقدي", card_at_venue: "بطاقة عند المطعم", pay_on_delivery: "الدفع عند الاستلام" };
function zN({ open: u, onOpenChange: r, methods: c, busy: i, onConfirm: d }) {
  const [p, m] = z.useState("");
  return z.useEffect(() => {
    u && m(c.length === 1 ? c[0] : "");
  }, [u, c]), /* @__PURE__ */ y.jsx(Ks, { open: u, onOpenChange: r, children: /* @__PURE__ */ y.jsxs(mr, { dir: "rtl", className: "max-w-md border-border bg-surface text-right", children: [
    /* @__PURE__ */ y.jsxs(pr, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ y.jsx(yr, { className: "text-lg font-extrabold", children: "تأكيد طريقة الدفع" }),
      /* @__PURE__ */ y.jsx(hr, { children: "اختر طريقة الدفع المتاحة لهذا الطلب قبل الإرسال." })
    ] }),
    /* @__PURE__ */ y.jsx("div", { className: "grid gap-2", children: c.map((v) => /* @__PURE__ */ y.jsx("button", { type: "button", onClick: () => m(v), className: `h-12 rounded-xl border px-4 text-right text-sm font-bold transition-colors ${p === v ? "border-brand bg-brand/15 text-brand" : "border-border bg-surface-2 text-foreground"}`, children: MN[v] || v }, v)) }),
    /* @__PURE__ */ y.jsxs(gr, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ y.jsx("button", { type: "button", disabled: !p || i, onClick: () => d(p), className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] disabled:opacity-40", children: i ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلب" }),
      /* @__PURE__ */ y.jsx("button", { type: "button", disabled: i, onClick: () => r(!1), className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground", children: "إلغاء" })
    ] })
  ] }) });
}
function jN({ result: u, handoffHtml: r, onClose: c }) {
  const i = () => {
    var m;
    const d = window.open("", "_blank");
    if (!d) return;
    const p = (((m = u.order) == null ? void 0 : m.items) || []).map((v) => {
      var S, M;
      return `<p>${Number(v.quantity)} × ${String(((M = (S = v.snapshot) == null ? void 0 : S.product) == null ? void 0 : M.name_ar) || "منتج").replace(/[&<>]/g, (O) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[O])} — ${aa(Number(v.line_total || 0))}</p>`;
    }).join("");
    d.document.write(`<html lang="ar" dir="rtl"><meta charset="utf-8"><title>${u.reference}</title><h2>${u.reference}</h2>${p}<strong>${aa(Number(u.total || 0))}</strong>${r}</html>`), d.document.close(), d.print();
  };
  return /* @__PURE__ */ y.jsx(Ks, { open: !0, onOpenChange: (d) => !d && c(), children: /* @__PURE__ */ y.jsxs(mr, { dir: "rtl", className: "max-w-md border-border bg-surface text-right", children: [
    /* @__PURE__ */ y.jsxs(pr, { className: "text-right sm:text-right", children: [
      /* @__PURE__ */ y.jsx(yr, { className: "text-lg font-extrabold", children: "تم حفظ الطلب" }),
      /* @__PURE__ */ y.jsxs(hr, { children: [
        u.reference,
        " — تم إرساله إلى محضّر الطلب."
      ] })
    ] }),
    /* @__PURE__ */ y.jsx("p", { className: "text-xl font-extrabold text-brand", dir: "ltr", children: aa(Number(u.total || 0)) }),
    r && /* @__PURE__ */ y.jsx("div", { dangerouslySetInnerHTML: { __html: r } }),
    /* @__PURE__ */ y.jsxs(gr, { className: "gap-2 sm:justify-start", children: [
      /* @__PURE__ */ y.jsx("button", { type: "button", onClick: i, className: "h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground", children: "طباعة الإيصال" }),
      /* @__PURE__ */ y.jsx("button", { type: "button", onClick: c, className: "h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground", children: "إغلاق" })
    ] })
  ] }) });
}
let DN = 0;
const RN = () => `line-${++DN}`;
function ON({ services: u }) {
  const r = u.snapshot.catalog.settings || {}, c = !!r.delivery_enabled, i = `cardfy_pos_draft:${u.context.client_id}:${u.branchId}`, d = z.useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(i) || "null");
    } catch {
      return null;
    }
  }, [i]), p = (d == null ? void 0 : d.orderType) === "delivery" && c ? "delivery" : "pickup", [m, v] = z.useState(p), [S, M] = z.useState(Array.isArray(d == null ? void 0 : d.lines) ? d.lines : []), [O, s] = z.useState(null), [D, Z] = z.useState(typeof (d == null ? void 0 : d.notes) == "string" ? d.notes : ""), [q, Y] = z.useState((d == null ? void 0 : d.customer) || Kp), [C, H] = z.useState(!1), [I, aA] = z.useState(!1), [uA, iA] = z.useState(!1), [sA, J] = z.useState(""), [B, gA] = z.useState(null), xA = S.find((U) => U.id === O) || null, zA = z.useMemo(() => S.reduce((U, w) => U + Zp(w), 0), [S]), oA = sr.find((U) => U.id === q.zoneId) || null, JA = m === "delivery" && oA ? oA.fee : 0, HA = (u.snapshot.orders || []).filter((U) => U.order_type !== "dinein" && !["completed", "cancelled", "delivered", "on_the_way"].includes(U.status) && !U.assigned_driver_id).length, TA = (r.payment_methods || ["cash"]).filter((U) => m === "delivery" ? ["pay_on_delivery", "cash"].includes(U) : ["cash", "card_at_venue"].includes(U)), k = (U) => {
    const w = Zv(U), G = _i(U.id, w), tA = S.find((cA) => _i(cA.productId, cA.selections) === G);
    if (tA) {
      M((cA) => cA.map((L) => L.id === tA.id ? { ...L, quantity: L.quantity + 1 } : L)), s(tA.id);
      return;
    }
    const Q = { id: RN(), productId: U.id, quantity: 1, selections: w };
    M((cA) => [...cA, Q]), s(Q.id);
  }, P = (U, w) => M((G) => G.flatMap((tA) => {
    if (tA.id !== U) return [tA];
    const Q = tA.quantity + w;
    return Q <= 0 ? (O === U && s(null), []) : [{ ...tA, quantity: Q }];
  })), lA = (U) => {
    M((w) => w.filter((G) => G.id !== U)), O === U && s(null);
  }, dA = () => {
    M([]), s(null), Z(""), sessionStorage.removeItem(i);
  }, F = (U, w) => {
    if (!xA) return;
    const G = oe[U];
    if (!G) return;
    const tA = xA.selections[U] || [];
    let Q;
    G.multi ? Q = tA.includes(w) ? tA.filter((_) => _ !== w) : tA.length >= G.max ? tA : [...tA, w] : Q = tA.includes(w) && !G.required ? [] : [w];
    const cA = { ...xA.selections, [U]: Q }, L = _i(xA.productId, cA);
    M((_) => {
      const LA = _.find((BA) => BA.id !== xA.id && _i(BA.productId, BA.selections) === L);
      return LA ? (s(LA.id), _.filter((BA) => BA.id !== xA.id).map((BA) => BA.id === LA.id ? { ...BA, quantity: BA.quantity + xA.quantity } : BA)) : _.map((BA) => BA.id === xA.id ? { ...BA, selections: cA } : BA);
    });
  }, GA = () => {
    for (const U of S)
      for (const w of Object.keys(U.selections)) {
        const G = oe[w], tA = U.selections[w].length;
        if (G && (tA < G.min || tA > G.max))
          throw s(U.id), new Error(`راجع اختيارات ${G.name}.`);
      }
    if (m === "delivery" && (!q.name.trim() || !q.phone.trim() || !q.zoneId || !q.address.trim()))
      throw H(!0), new Error("أكمل بيانات التوصيل قبل إتمام الطلب.");
    if (!TA.length) throw new Error("لا توجد طريقة دفع مفعّلة لهذا النوع من الطلبات.");
  }, WA = (U) => ({ order_type: m === "pickup" ? "takeaway" : "delivery", source: "pos", branch_id: u.branchId, payment_method: U, customer_name: m === "delivery" ? q.name : "", phone: m === "delivery" ? q.phone : "", delivery_zone_id: m === "delivery" ? q.zoneId : "", address: m === "delivery" ? q.address : "", notes: [D, m === "delivery" && q.notes ? `ملاحظات التوصيل: ${q.notes}` : ""].filter(Boolean).join(`
`), table_id: "", coupon_code: "", items: S.map((w) => {
    var Q, cA;
    const G = ((cA = (Q = Object.entries(w.selections).find(([L]) => {
      var _;
      return ((_ = oe[L]) == null ? void 0 : _.kind) === "variant";
    })) == null ? void 0 : Q[1]) == null ? void 0 : cA[0]) || "", tA = Object.entries(w.selections).filter(([L]) => {
      var _;
      return ((_ = oe[L]) == null ? void 0 : _.kind) === "option";
    }).flatMap(([, L]) => L);
    return { product_id: w.productId, quantity: w.quantity, variant_id: G, option_ids: tA, notes: "" };
  }) }), rt = () => {
    try {
      GA(), aA(!0);
    } catch (U) {
      gu.error(U.message);
    }
  }, h = async (U) => {
    iA(!0);
    try {
      const w = WA(U);
      await u.rpc("cfy_os_pos_quote", { p_token: u.context.token, p_page: "takeaway", p_order: w });
      const G = await u.rpc("cfy_os_pos_order", { p_token: u.context.token, p_page: "takeaway", p_order: w, p_intent: "save", p_request_key: crypto.randomUUID() });
      aA(!1), dA(), Y(Kp), gA(G), u.status(`تم إنشاء ${G.reference} وإرساله إلى محضّر الطلب.`), gu.success(`تم إنشاء ${G.reference}`);
    } catch (w) {
      u.status(w.message || "تعذر إنشاء الطلب.", !0), gu.error(w.message || "تعذر إنشاء الطلب.");
    } finally {
      iA(!1);
    }
  };
  return /* @__PURE__ */ y.jsxs("div", { className: "flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden", children: [
    /* @__PURE__ */ y.jsx(Yv, { actorName: u.context.name || "CARDfy", actorRole: u.context.role === "owner" ? "مالك المطعم" : "موظف المطعم", pendingCount: HA, onMenu: u.onMenu, onBell: u.onBell, onSearch: J }),
    /* @__PURE__ */ y.jsxs("main", { className: "grid min-h-0 flex-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1fr)_25rem] xl:grid-cols-[minmax(0,1fr)_28rem]", children: [
      /* @__PURE__ */ y.jsx(Fv, { onAdd: k, externalQuery: sA }),
      /* @__PURE__ */ y.jsx(Lv, { orderType: m, onOrderTypeChange: (U) => U !== "delivery" || c ? v(U) : void 0, lines: S, selectedLine: xA, onSelectLine: (U) => s(U === O ? null : U), onQuantity: P, onRemove: lA, onClearAll: dA, onToggleModifier: F, onCloseModifiers: () => s(null), notes: D, onNotesChange: Z, subtotal: zA, deliveryFee: JA, zoneName: (oA == null ? void 0 : oA.name) || null, hasAddress: !!q.address, onOpenAddress: () => H(!0), onSaveOrder: () => {
        sessionStorage.setItem(i, JSON.stringify({ lines: S, notes: D, customer: q, orderType: m })), gu.success("تم حفظ الطلب مؤقتاً");
      }, onComplete: rt, deliveryEnabled: c })
    ] }),
    /* @__PURE__ */ y.jsxs("footer", { className: "hidden items-center justify-between gap-2 border-t border-border/70 px-5 py-2 text-xs text-muted-foreground lg:flex", children: [
      /* @__PURE__ */ y.jsx("span", { className: "font-bold", children: /* @__PURE__ */ y.jsxs("bdi", { dir: "ltr", children: [
        "CARD",
        /* @__PURE__ */ y.jsx("span", { className: "text-brand", children: "fy" }),
        " Restaurant POS"
      ] }) }),
      /* @__PURE__ */ y.jsx("span", { children: "كل شيء في مكان واحد .. إدارة أسهل .. مطعم أكثر نجاحاً" })
    ] }),
    /* @__PURE__ */ y.jsx(UN, { open: C, onOpenChange: H, value: q, onSave: (U) => {
      Y(U), H(!1), gu.success("تم حفظ بيانات التوصيل");
    } }),
    /* @__PURE__ */ y.jsx(zN, { open: I, onOpenChange: aA, methods: TA, busy: uA, onConfirm: h }),
    B && /* @__PURE__ */ y.jsx(jN, { result: B, handoffHtml: u.customerHandoff(B), onClose: () => gA(null) }),
    /* @__PURE__ */ y.jsx(Uv, { richColors: !0, position: "top-center", dir: "rtl" })
  ] });
}
let ea = null;
function VN(u, r) {
  Gv(r.snapshot.catalog, r.branchId), ea == null || ea.unmount(), ea = X1.createRoot(u), ea.render(/* @__PURE__ */ y.jsx(ON, { services: r }));
}
function KN() {
  ea == null || ea.unmount(), ea = null;
}
export {
  VN as mount,
  KN as unmount
};
