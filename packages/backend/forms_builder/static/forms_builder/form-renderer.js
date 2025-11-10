var Ce = Object.defineProperty;
var Oe = (o, e, t) => e in o ? Ce(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var $ = (o, e, t) => Oe(o, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, X = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), re = /* @__PURE__ */ new WeakMap();
let be = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (X && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = re.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && re.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ue = (o) => new be(typeof o == "string" ? o : o + "", void 0, Y), ve = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((r, n, i) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + o[i + 1], o[0]);
  return new be(t, o, Y);
}, Te = (o, e) => {
  if (X) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), n = F.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = t.cssText, o.appendChild(r);
  }
}, ie = X ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Ue(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ne, defineProperty: He, getOwnPropertyDescriptor: Me, getOwnPropertyNames: De, getOwnPropertySymbols: ke, getPrototypeOf: Le } = Object, _ = globalThis, se = _.trustedTypes, je = se ? se.emptyScript : "", K = _.reactiveElementPolyfillSupport, M = (o, e) => o, q = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? je : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, ee = (o, e) => !Ne(o, e), ne = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: ee };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ne) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && He(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: i } = Me(this.prototype, e) ?? { get() {
      return this[t];
    }, set(s) {
      this[t] = s;
    } };
    return { get: n, set(s) {
      const l = n == null ? void 0 : n.call(this);
      i == null || i.call(this, s), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ne;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const e = Le(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const t = this.properties, r = [...De(t), ...ke(t)];
      for (const n of r) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, n] of t) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const n = this._$Eu(t, r);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const n of r) t.unshift(ie(n));
    } else e !== void 0 && t.push(ie(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Te(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var i;
    const r = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, r);
    if (n !== void 0 && r.reflect === !0) {
      const s = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : q).toAttribute(t, r.type);
      this._$Em = e, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i, s;
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const l = r.getPropertyOptions(n), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((i = l.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? l.converter : q;
      this._$Em = n;
      const h = a.fromAttribute(t, l.type);
      this[n] = h ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    var n;
    if (e !== void 0) {
      const i = this.constructor, s = this[e];
      if (r ?? (r = i.getPropertyOptions(e)), !((r.hasChanged ?? ee)(s, t) || r.useDefault && r.reflect && s === ((n = this._$Ej) == null ? void 0 : n.get(e)) && !this.hasAttribute(i._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: n, wrapped: i }, s) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, s ?? t ?? this[e]), i !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, s] of this._$Ep) this[i] = s;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, s] of n) {
        const { wrapped: l } = s, a = this[i];
        l !== !0 || this._$AL.has(i) || a === void 0 || this.C(i, void 0, s, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((n) => {
        var i;
        return (i = n.hostUpdate) == null ? void 0 : i.call(n);
      }), this.update(t)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var n;
      return (n = r.hostUpdated) == null ? void 0 : n.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[M("elementProperties")] = /* @__PURE__ */ new Map(), P[M("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: P }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, V = D.trustedTypes, oe = V ? V.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, _e = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Ae = "?" + v, Re = `<${Ae}>`, w = document, k = () => w.createComment(""), L = (o) => o === null || typeof o != "object" && typeof o != "function", te = Array.isArray, Ie = (o) => te(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ae = /-->/g, le = />/g, S = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, de = /"/g, Se = /^(?:script|style|textarea|title)$/i, ze = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), p = ze(1), O = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), x = w.createTreeWalker(w, 129);
function xe(o, e) {
  if (!te(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const Fe = (o, e) => {
  const t = o.length - 1, r = [];
  let n, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = H;
  for (let l = 0; l < t; l++) {
    const a = o[l];
    let h, c, d = -1, u = 0;
    for (; u < a.length && (s.lastIndex = u, c = s.exec(a), c !== null); ) u = s.lastIndex, s === H ? c[1] === "!--" ? s = ae : c[1] !== void 0 ? s = le : c[2] !== void 0 ? (Se.test(c[2]) && (n = RegExp("</" + c[2], "g")), s = S) : c[3] !== void 0 && (s = S) : s === S ? c[0] === ">" ? (s = n ?? H, d = -1) : c[1] === void 0 ? d = -2 : (d = s.lastIndex - c[2].length, h = c[1], s = c[3] === void 0 ? S : c[3] === '"' ? de : he) : s === de || s === he ? s = S : s === ae || s === le ? s = H : (s = S, n = void 0);
    const m = s === S && o[l + 1].startsWith("/>") ? " " : "";
    i += s === H ? a + Re : d >= 0 ? (r.push(h), a.slice(0, d) + _e + a.slice(d) + v + m) : a + v + (d === -2 ? l : m);
  }
  return [xe(o, i + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class j {
  constructor({ strings: e, _$litType$: t }, r) {
    let n;
    this.parts = [];
    let i = 0, s = 0;
    const l = e.length - 1, a = this.parts, [h, c] = Fe(e, t);
    if (this.el = j.createElement(h, r), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = x.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(_e)) {
          const u = c[s++], m = n.getAttribute(d).split(v), g = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: i, name: g[2], strings: m, ctor: g[1] === "." ? Ve : g[1] === "?" ? Be : g[1] === "@" ? We : B }), n.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: i }), n.removeAttribute(d));
        if (Se.test(n.tagName)) {
          const d = n.textContent.split(v), u = d.length - 1;
          if (u > 0) {
            n.textContent = V ? V.emptyScript : "";
            for (let m = 0; m < u; m++) n.append(d[m], k()), x.nextNode(), a.push({ type: 2, index: ++i });
            n.append(d[u], k());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ae) a.push({ type: 2, index: i });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: i }), d += v.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = w.createElement("template");
    return r.innerHTML = e, r;
  }
}
function U(o, e, t = o, r) {
  var s, l;
  if (e === O) return e;
  let n = r !== void 0 ? (s = t._$Co) == null ? void 0 : s[r] : t._$Cl;
  const i = L(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== i && ((l = n == null ? void 0 : n._$AO) == null || l.call(n, !1), i === void 0 ? n = void 0 : (n = new i(o), n._$AT(o, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = n : t._$Cl = n), n !== void 0 && (e = U(o, n._$AS(o, e.values), n, r)), e;
}
class qe {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? w).importNode(t, !0);
    x.currentNode = n;
    let i = x.nextNode(), s = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (s === a.index) {
        let h;
        a.type === 2 ? h = new R(i, i.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (h = new Je(i, this, e)), this._$AV.push(h), a = r[++l];
      }
      s !== (a == null ? void 0 : a.index) && (i = x.nextNode(), s++);
    }
    return x.currentNode = w, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class R {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, n) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = U(this, e, t), L(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ie(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && L(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var i;
    const { values: t, _$litType$: r } = e, n = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = j.createElement(xe(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === n) this._$AH.p(t);
    else {
      const s = new qe(n, this), l = s.u(this.options);
      s.p(t), this.T(l), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = ue.get(e.strings);
    return t === void 0 && ue.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    te(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, n = 0;
    for (const i of e) n === t.length ? t.push(r = new R(this.O(k()), this.O(k()), this, this.options)) : r = t[n], r._$AI(i), n++;
    n < t.length && (this._$AR(r && r._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const n = e.nextSibling;
      e.remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, n, i) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = f;
  }
  _$AI(e, t = this, r, n) {
    const i = this.strings;
    let s = !1;
    if (i === void 0) e = U(this, e, t, 0), s = !L(e) || e !== this._$AH && e !== O, s && (this._$AH = e);
    else {
      const l = e;
      let a, h;
      for (e = i[0], a = 0; a < i.length - 1; a++) h = U(this, l[r + a], t, a), h === O && (h = this._$AH[a]), s || (s = !L(h) || h !== this._$AH[a]), h === f ? e = f : e !== f && (e += (h ?? "") + i[a + 1]), this._$AH[a] = h;
    }
    s && !n && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ve extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class Be extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class We extends B {
  constructor(e, t, r, n, i) {
    super(e, t, r, n, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? f) === O) return;
    const r = this._$AH, n = e === f && r !== f || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== f && (r === f || n);
    n && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Je {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    U(this, e);
  }
}
const G = D.litHtmlPolyfillSupport;
G == null || G(j, R), (D.litHtmlVersions ?? (D.litHtmlVersions = [])).push("3.3.1");
const Ke = (o, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let n = r._$litPart$;
  if (n === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = n = new R(e.insertBefore(k(), i), i, void 0, t ?? {});
  }
  return n._$AI(o), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class C extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ke(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return O;
  }
}
var ye;
C._$litElement$ = !0, C.finalized = !0, (ye = E.litElementHydrateSupport) == null || ye.call(E, { LitElement: C });
const Q = E.litElementPolyfillSupport;
Q == null || Q({ LitElement: C });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: ee }, Ge = (o = Ze, e, t) => {
  const { kind: r, metadata: n } = t;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), r === "setter" && ((o = Object.create(o)).wrapped = !0), i.set(t.name, o), r === "accessor") {
    const { name: s } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(s, a, o);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, o, l), l;
    } };
  }
  if (r === "setter") {
    const { name: s } = t;
    return function(l) {
      const a = this[s];
      e.call(this, l), this.requestUpdate(s, a, o);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function T(o) {
  return (e, t) => typeof t == "object" ? Ge(o, e, t) : ((r, n, i) => {
    const s = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, r), s ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(o) {
  return T({ ...o, state: !0, attribute: !1 });
}
function Qe(o, e) {
  const t = [];
  if (o.required && (!e || typeof e == "string" && e.trim() === "") && t.push({
    field: o.name,
    message: `${o.label} is required`
  }), !o.validation)
    return t;
  for (const r of o.validation)
    switch (r.type) {
      case "required":
        (!e || typeof e == "string" && e.trim() === "") && t.push({ field: o.name, message: r.message });
        break;
      case "email":
        e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)) && t.push({ field: o.name, message: r.message });
        break;
      case "min":
        r.value !== void 0 && (o.type === "number" && Number(e) < Number(r.value) ? t.push({ field: o.name, message: r.message }) : typeof e == "string" && e.length < Number(r.value) && t.push({ field: o.name, message: r.message }));
        break;
      case "max":
        r.value !== void 0 && (o.type === "number" && Number(e) > Number(r.value) ? t.push({ field: o.name, message: r.message }) : typeof e == "string" && e.length > Number(r.value) && t.push({ field: o.name, message: r.message }));
        break;
      case "pattern":
        r.value && e && (new RegExp(String(r.value)).test(String(e)) || t.push({ field: o.name, message: r.message }));
        break;
      case "custom":
        r.validator && !r.validator(e) && t.push({ field: o.name, message: r.message });
        break;
    }
  return t;
}
function ce(o, e) {
  const t = [];
  for (const r of o) {
    const n = e[r.name], i = Qe(r, n);
    t.push(...i);
  }
  return {
    valid: t.length === 0,
    errors: t
  };
}
var Xe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ye(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var Ee = { exports: {} };
(function(o, e) {
  (function(t, r) {
    o.exports = r();
  })(Xe, function() {
    Array.isArray || (Array.isArray = function(i) {
      return Object.prototype.toString.call(i) === "[object Array]";
    });
    function t(i) {
      for (var s = [], l = 0, a = i.length; l < a; l++)
        s.indexOf(i[l]) === -1 && s.push(i[l]);
      return s;
    }
    var r = {}, n = {
      "==": function(i, s) {
        return i == s;
      },
      "===": function(i, s) {
        return i === s;
      },
      "!=": function(i, s) {
        return i != s;
      },
      "!==": function(i, s) {
        return i !== s;
      },
      ">": function(i, s) {
        return i > s;
      },
      ">=": function(i, s) {
        return i >= s;
      },
      "<": function(i, s, l) {
        return l === void 0 ? i < s : i < s && s < l;
      },
      "<=": function(i, s, l) {
        return l === void 0 ? i <= s : i <= s && s <= l;
      },
      "!!": function(i) {
        return r.truthy(i);
      },
      "!": function(i) {
        return !r.truthy(i);
      },
      "%": function(i, s) {
        return i % s;
      },
      log: function(i) {
        return console.log(i), i;
      },
      in: function(i, s) {
        return !s || typeof s.indexOf > "u" ? !1 : s.indexOf(i) !== -1;
      },
      cat: function() {
        return Array.prototype.join.call(arguments, "");
      },
      substr: function(i, s, l) {
        if (l < 0) {
          var a = String(i).substr(s);
          return a.substr(0, a.length + l);
        }
        return String(i).substr(s, l);
      },
      "+": function() {
        return Array.prototype.reduce.call(arguments, function(i, s) {
          return parseFloat(i, 10) + parseFloat(s, 10);
        }, 0);
      },
      "*": function() {
        return Array.prototype.reduce.call(arguments, function(i, s) {
          return parseFloat(i, 10) * parseFloat(s, 10);
        });
      },
      "-": function(i, s) {
        return s === void 0 ? -i : i - s;
      },
      "/": function(i, s) {
        return i / s;
      },
      min: function() {
        return Math.min.apply(this, arguments);
      },
      max: function() {
        return Math.max.apply(this, arguments);
      },
      merge: function() {
        return Array.prototype.reduce.call(arguments, function(i, s) {
          return i.concat(s);
        }, []);
      },
      var: function(i, s) {
        var l = s === void 0 ? null : s, a = this;
        if (typeof i > "u" || i === "" || i === null)
          return a;
        for (var h = String(i).split("."), c = 0; c < h.length; c++)
          if (a == null || (a = a[h[c]], a === void 0))
            return l;
        return a;
      },
      missing: function() {
        for (var i = [], s = Array.isArray(arguments[0]) ? arguments[0] : arguments, l = 0; l < s.length; l++) {
          var a = s[l], h = r.apply({ var: a }, this);
          (h === null || h === "") && i.push(a);
        }
        return i;
      },
      missing_some: function(i, s) {
        var l = r.apply({ missing: s }, this);
        return s.length - l.length >= i ? [] : l;
      }
    };
    return r.is_logic = function(i) {
      return typeof i == "object" && // An object
      i !== null && // but not null
      !Array.isArray(i) && // and not an array
      Object.keys(i).length === 1;
    }, r.truthy = function(i) {
      return Array.isArray(i) && i.length === 0 ? !1 : !!i;
    }, r.get_operator = function(i) {
      return Object.keys(i)[0];
    }, r.get_values = function(i) {
      return i[r.get_operator(i)];
    }, r.apply = function(i, s) {
      if (Array.isArray(i))
        return i.map(function(y) {
          return r.apply(y, s);
        });
      if (!r.is_logic(i))
        return i;
      var l = r.get_operator(i), a = i[l], h, c, d, u, m;
      if (Array.isArray(a) || (a = [a]), l === "if" || l == "?:") {
        for (h = 0; h < a.length - 1; h += 2)
          if (r.truthy(r.apply(a[h], s)))
            return r.apply(a[h + 1], s);
        return a.length === h + 1 ? r.apply(a[h], s) : null;
      } else if (l === "and") {
        for (h = 0; h < a.length; h += 1)
          if (c = r.apply(a[h], s), !r.truthy(c))
            return c;
        return c;
      } else if (l === "or") {
        for (h = 0; h < a.length; h += 1)
          if (c = r.apply(a[h], s), r.truthy(c))
            return c;
        return c;
      } else {
        if (l === "filter")
          return u = r.apply(a[0], s), d = a[1], Array.isArray(u) ? u.filter(function(y) {
            return r.truthy(r.apply(d, y));
          }) : [];
        if (l === "map")
          return u = r.apply(a[0], s), d = a[1], Array.isArray(u) ? u.map(function(y) {
            return r.apply(d, y);
          }) : [];
        if (l === "reduce")
          return u = r.apply(a[0], s), d = a[1], m = typeof a[2] < "u" ? r.apply(a[2], s) : null, Array.isArray(u) ? u.reduce(
            function(y, Pe) {
              return r.apply(
                d,
                { current: Pe, accumulator: y }
              );
            },
            m
          ) : m;
        if (l === "all") {
          if (u = r.apply(a[0], s), d = a[1], !Array.isArray(u) || !u.length)
            return !1;
          for (h = 0; h < u.length; h += 1)
            if (!r.truthy(r.apply(d, u[h])))
              return !1;
          return !0;
        } else if (l === "none") {
          if (u = r.apply(a[0], s), d = a[1], !Array.isArray(u) || !u.length)
            return !0;
          for (h = 0; h < u.length; h += 1)
            if (r.truthy(r.apply(d, u[h])))
              return !1;
          return !0;
        } else if (l === "some") {
          if (u = r.apply(a[0], s), d = a[1], !Array.isArray(u) || !u.length)
            return !1;
          for (h = 0; h < u.length; h += 1)
            if (r.truthy(r.apply(d, u[h])))
              return !0;
          return !1;
        }
      }
      if (a = a.map(function(y) {
        return r.apply(y, s);
      }), n.hasOwnProperty(l) && typeof n[l] == "function")
        return n[l].apply(s, a);
      if (l.indexOf(".") > 0) {
        var g = String(l).split("."), z = n;
        for (h = 0; h < g.length; h++) {
          if (!z.hasOwnProperty(g[h]))
            throw new Error("Unrecognized operation " + l + " (failed at " + g.slice(0, h + 1).join(".") + ")");
          z = z[g[h]];
        }
        return z.apply(s, a);
      }
      throw new Error("Unrecognized operation " + l);
    }, r.uses_data = function(i) {
      var s = [];
      if (r.is_logic(i)) {
        var l = r.get_operator(i), a = i[l];
        Array.isArray(a) || (a = [a]), l === "var" ? s.push(a[0]) : a.forEach(function(h) {
          s.push.apply(s, r.uses_data(h));
        });
      }
      return t(s);
    }, r.add_operation = function(i, s) {
      n[i] = s;
    }, r.rm_operation = function(i) {
      delete n[i];
    }, r.rule_like = function(i, s) {
      if (s === i || s === "@")
        return !0;
      if (s === "number")
        return typeof i == "number";
      if (s === "string")
        return typeof i == "string";
      if (s === "array")
        return Array.isArray(i) && !r.is_logic(i);
      if (r.is_logic(s)) {
        if (r.is_logic(i)) {
          var l = r.get_operator(s), a = r.get_operator(i);
          if (l === "@" || l === a)
            return r.rule_like(
              r.get_values(i, !1),
              r.get_values(s, !1)
            );
        }
        return !1;
      }
      if (Array.isArray(s))
        if (Array.isArray(i)) {
          if (s.length !== i.length)
            return !1;
          for (var h = 0; h < s.length; h += 1)
            if (!r.rule_like(i[h], s[h]))
              return !1;
          return !0;
        } else
          return !1;
      return !1;
    }, r;
  });
})(Ee);
var et = Ee.exports;
const tt = /* @__PURE__ */ Ye(et);
function pe(o, e) {
  try {
    return tt.apply(o, e);
  } catch (t) {
    return console.error("Error evaluating logic:", t), !1;
  }
}
var rt = Object.defineProperty, J = (o, e, t, r) => {
  for (var n = void 0, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = s(e, t, n) || n);
  return n && rt(e, t, n), n;
};
class b extends C {
  constructor() {
    super(...arguments);
    $(this, "field");
    $(this, "value", "");
    $(this, "errors", []);
    $(this, "hidden", !1);
  }
  handleInput(t) {
    const r = t.target;
    this.value = r.value, this.dispatchEvent(new CustomEvent("field-change", {
      detail: {
        name: this.field.name,
        value: this.value
      },
      bubbles: !0,
      composed: !0
    }));
  }
  renderLabel() {
    return p`
      <label
        class="field-label ${this.field.required ? "required" : ""}"
        for="${this.field.id}"
      >
        ${this.field.label}
      </label>
    `;
  }
  renderHelp() {
    return this.field.helpText ? p`<div class="field-help">${this.field.helpText}</div>` : null;
  }
  renderErrors() {
    const t = this.errors.filter((r) => r.field === this.field.name);
    return t.length === 0 ? null : p`
      <div class="field-errors">
        ${t.map((r) => p`
          <div class="field-error">${r.message}</div>
        `)}
      </div>
    `;
  }
  hasErrors() {
    return this.errors.some((t) => t.field === this.field.name);
  }
}
$(b, "styles", ve`
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    :host([hidden]) {
      display: none;
    }

    .field-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .field-label {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .field-label.required::after {
      content: ' *';
      color: #dc2626;
    }

    .field-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      line-height: 1.5;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .field-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .field-input.error {
      border-color: #dc2626;
    }

    .field-input.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .field-help {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .field-errors {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .field-error {
      font-size: 0.75rem;
      color: #dc2626;
    }
  `);
J([
  T({ type: Object })
], b.prototype, "field");
J([
  T({ type: String })
], b.prototype, "value");
J([
  T({ type: Array })
], b.prototype, "errors");
J([
  T({ type: Boolean })
], b.prototype, "hidden");
var it = Object.getOwnPropertyDescriptor, st = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? it(e, t) : e, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = s(n) || n);
  return n;
};
let fe = class extends b {
  render() {
    return p`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? "error" : ""}"
          type="text"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ""}"
          ?required="${this.field.required}"
          minlength="${this.field.minLength || ""}"
          maxlength="${this.field.maxLength || ""}"
          pattern="${this.field.pattern || ""}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ""}"
        />
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
};
fe = st([
  I("form-text-field")
], fe);
var nt = Object.getOwnPropertyDescriptor, ot = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? nt(e, t) : e, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = s(n) || n);
  return n;
};
let me = class extends b {
  render() {
    return p`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? "error" : ""}"
          type="email"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ""}"
          ?required="${this.field.required}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ""}"
        />
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
};
me = ot([
  I("form-email-field")
], me);
var at = Object.getOwnPropertyDescriptor, lt = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? at(e, t) : e, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = s(n) || n);
  return n;
};
let $e = class extends b {
  render() {
    return p`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <input
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? "error" : ""}"
          type="number"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ""}"
          ?required="${this.field.required}"
          min="${this.field.min ?? ""}"
          max="${this.field.max ?? ""}"
          step="${this.field.step ?? ""}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ""}"
        />
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
};
$e = lt([
  I("form-number-field")
], $e);
var ht = Object.getOwnPropertyDescriptor, dt = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? ht(e, t) : e, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = s(n) || n);
  return n;
};
let ge = class extends b {
  render() {
    return p`
      <div class="field-wrapper">
        ${this.renderLabel()}
        <textarea
          id="${this.field.id}"
          class="field-input ${this.hasErrors() ? "error" : ""}"
          name="${this.field.name}"
          .value="${this.value}"
          placeholder="${this.field.placeholder || ""}"
          ?required="${this.field.required}"
          rows="${this.field.rows || 3}"
          minlength="${this.field.minLength || ""}"
          maxlength="${this.field.maxLength || ""}"
          @input="${this.handleInput}"
          aria-invalid="${this.hasErrors()}"
          aria-describedby="${this.field.helpText ? `${this.field.id}-help` : ""}"
        ></textarea>
        ${this.renderHelp()}
        ${this.renderErrors()}
      </div>
    `;
  }
};
ge = dt([
  I("form-textarea-field")
], ge);
var we = Object.defineProperty, ut = Object.getOwnPropertyDescriptor, ct = (o, e, t) => e in o ? we(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, N = (o, e, t, r) => {
  for (var n = r > 1 ? void 0 : r ? ut(e, t) : e, i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (n = (r ? s(e, t, n) : s(n)) || n);
  return r && n && we(e, t, n), n;
}, pt = (o, e, t) => ct(o, e + "", t);
let A = class extends C {
  constructor() {
    super(...arguments);
    $(this, "definition");
    $(this, "formData", {});
    $(this, "errors", []);
    $(this, "currentStepIndex", 0);
    $(this, "isSubmitting", !1);
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("field-change", this.handleFieldChange);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("field-change", this.handleFieldChange);
  }
  handleFieldChange(e) {
    const { name: t, value: r } = e.detail;
    this.formData = { ...this.formData, [t]: r }, this.errors = this.errors.filter((n) => n.field !== t);
  }
  getCurrentStep() {
    return this.getVisibleSteps()[this.currentStepIndex] || null;
  }
  getVisibleSteps() {
    var e;
    return (e = this.definition) != null && e.steps ? this.definition.steps.filter((t) => this.isStepVisible(t)).sort((t, r) => t.order - r.order) : [];
  }
  isStepVisible(e) {
    return e.conditionalLogic ? pe(e.conditionalLogic, this.formData) : !0;
  }
  isFieldVisible(e) {
    return e.conditionalLogic ? pe(e.conditionalLogic, this.formData) : !0;
  }
  async handleNext() {
    const e = this.getCurrentStep();
    if (!e) return;
    const t = e.fields.filter((i) => this.isFieldVisible(i)), r = ce(t, this.formData);
    if (!r.valid) {
      this.errors = r.errors, console.log("Validation failed:", r.errors), this.requestUpdate();
      return;
    }
    this.errors = [];
    const n = this.getVisibleSteps();
    this.currentStepIndex < n.length - 1 && (this.currentStepIndex++, this.requestUpdate());
  }
  handlePrevious() {
    this.currentStepIndex > 0 && (this.currentStepIndex--, this.errors = [], this.requestUpdate());
  }
  async handleSubmit(e) {
    e.preventDefault();
    const t = this.getCurrentStep();
    if (!t) return;
    const r = t.fields.filter((i) => this.isFieldVisible(i)), n = ce(r, this.formData);
    if (!n.valid) {
      this.errors = n.errors;
      return;
    }
    this.isSubmitting = !0, this.errors = [];
    try {
      this.definition.onSubmit && await this.definition.onSubmit(this.formData), this.dispatchEvent(new CustomEvent("form-submit", {
        detail: { data: this.formData },
        bubbles: !0,
        composed: !0
      }));
    } catch (i) {
      console.error("Form submission error:", i), this.errors = [{ field: "_form", message: "An error occurred while submitting the form" }];
    } finally {
      this.isSubmitting = !1;
    }
  }
  renderField(e) {
    if (!this.isFieldVisible(e)) return null;
    const t = this.formData[e.name] || e.defaultValue || "";
    switch (e.type) {
      case "text":
        return p`<form-text-field
          .field="${e}"
          .value="${t}"
          .errors="${this.errors}"
        ></form-text-field>`;
      case "email":
        return p`<form-email-field
          .field="${e}"
          .value="${t}"
          .errors="${this.errors}"
        ></form-email-field>`;
      case "number":
        return p`<form-number-field
          .field="${e}"
          .value="${t}"
          .errors="${this.errors}"
        ></form-number-field>`;
      case "textarea":
        return p`<form-textarea-field
          .field="${e}"
          .value="${t}"
          .errors="${this.errors}"
        ></form-textarea-field>`;
      default:
        return null;
    }
  }
  renderProgress() {
    if (!this.definition.isMultiStep) return null;
    const e = this.getVisibleSteps();
    return p`
      <div class="step-progress">
        ${e.map((t, r) => p`
          <div class="progress-step ${r < this.currentStepIndex ? "completed" : r === this.currentStepIndex ? "active" : ""}"></div>
        `)}
      </div>
    `;
  }
  renderStepHeader(e) {
    return this.definition.isMultiStep ? p`
      <div class="step-header">
        <h2 class="step-title">${e.title}</h2>
        ${e.description ? p`
          <p class="step-description">${e.description}</p>
        ` : null}
      </div>
    ` : null;
  }
  renderActions() {
    const e = this.getVisibleSteps(), t = this.currentStepIndex === e.length - 1, r = this.currentStepIndex === 0;
    return p`
      <div class="form-actions">
        ${this.definition.isMultiStep && !r ? p`
          <button
            type="button"
            class="btn btn-secondary"
            @click="${this.handlePrevious}"
            ?disabled="${this.isSubmitting}"
          >
            Previous
          </button>
        ` : null}

        ${t ? p`
          <button
            type="submit"
            class="btn btn-primary"
            ?disabled="${this.isSubmitting}"
          >
            ${this.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ` : p`
          <button
            type="button"
            class="btn btn-primary"
            @click="${this.handleNext}"
          >
            Next
          </button>
        `}
      </div>
    `;
  }
  render() {
    if (!this.definition)
      return p`<div>No form definition provided</div>`;
    const e = this.getCurrentStep();
    return e ? p`
      <form @submit="${this.handleSubmit}">
        <div class="form-header">
          <h1 class="form-title">${this.definition.title}</h1>
          ${this.definition.description ? p`
            <p class="form-description">${this.definition.description}</p>
          ` : null}
        </div>

        ${this.renderProgress()}

        <div class="form-step">
          ${this.renderStepHeader(e)}

          <div class="form-fields">
            ${e.fields.map((t) => this.renderField(t))}
          </div>
        </div>

        ${this.renderActions()}
      </form>
    ` : p`<div>No visible steps in form</div>`;
  }
};
pt(A, "styles", ve`
    :host {
      display: block;
      max-width: 42rem;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .form-description {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    .form-step {
      margin-bottom: 2rem;
    }

    .step-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .step-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .step-progress {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .progress-step {
      flex: 1;
      height: 0.5rem;
      background-color: #e5e7eb;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }

    .progress-step.active,
    .progress-step.completed {
      background-color: #3b82f6;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    .form-success {
      padding: 1rem;
      background-color: #d1fae5;
      border: 1px solid #10b981;
      border-radius: 0.375rem;
      color: #065f46;
      text-align: center;
    }
  `);
N([
  T({ type: Object })
], A.prototype, "definition", 2);
N([
  W()
], A.prototype, "formData", 2);
N([
  W()
], A.prototype, "errors", 2);
N([
  W()
], A.prototype, "currentStepIndex", 2);
N([
  W()
], A.prototype, "isSubmitting", 2);
A = N([
  I("form-renderer")
], A);
export {
  b as BaseField,
  me as EmailField,
  A as FormRenderer,
  $e as NumberField,
  fe as TextField,
  ge as TextareaField
};
