var Ce = Object.defineProperty;
var Pe = (s, e, t) => e in s ? Ce(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var U = (s, e, t) => Pe(s, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, G = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), le = /* @__PURE__ */ new WeakMap();
let _e = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (G && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = le.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && le.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Te = (s) => new _e(typeof s == "string" ? s : s + "", void 0, X), ee = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, i, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new _e(t, s, X);
}, Ue = (s, e) => {
  if (G) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = R.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, s.appendChild(r);
  }
}, ae = G ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Te(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Oe, defineProperty: Fe, getOwnPropertyDescriptor: ke, getOwnPropertyNames: Me, getOwnPropertySymbols: Ne, getPrototypeOf: Le } = Object, v = globalThis, de = v.trustedTypes, ze = de ? de.emptyScript : "", Z = v.reactiveElementPolyfillSupport, k = (s, e) => s, I = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? ze : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, te = (s, e) => !Oe(s, e), ce = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: te };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Fe(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: o } = ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const a = i == null ? void 0 : i.call(this);
      o == null || o.call(this, n), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const e = Le(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const t = this.properties, r = [...Me(t), ...Ne(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(ae(i));
    } else e !== void 0 && t.push(ae(e));
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
    return Ue(e, this.constructor.elementStyles), e;
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
    var o;
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const n = (((o = r.converter) == null ? void 0 : o.toAttribute) !== void 0 ? r.converter : I).toAttribute(t, r.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var o, n;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = r.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : I;
      this._$Em = i;
      const c = l.fromAttribute(t, a.type);
      this[i] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    var i;
    if (e !== void 0) {
      const o = this.constructor, n = this[e];
      if (r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? te)(n, t) || r.useDefault && r.reflect && n === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: o }, n) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: a } = n, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[k("elementProperties")] = /* @__PURE__ */ new Map(), C[k("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: C }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, j = M.trustedTypes, he = j ? j.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ye = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, xe = "?" + $, He = `<${xe}>`, w = document, N = () => w.createComment(""), L = (s) => s === null || typeof s != "object" && typeof s != "function", ie = Array.isArray, Re = (s) => ie(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, ue = />/g, _ = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), fe = /'/g, me = /"/g, Ae = /^(?:script|style|textarea|title)$/i, Ie = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), g = Ie(1), E = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), x = w.createTreeWalker(w, 129);
function Se(s, e) {
  if (!ie(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return he !== void 0 ? he.createHTML(e) : e;
}
const je = (s, e) => {
  const t = s.length - 1, r = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = O;
  for (let a = 0; a < t; a++) {
    const l = s[a];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (n.lastIndex = p, u = n.exec(l), u !== null); ) p = n.lastIndex, n === O ? u[1] === "!--" ? n = pe : u[1] !== void 0 ? n = ue : u[2] !== void 0 ? (Ae.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = _) : u[3] !== void 0 && (n = _) : n === _ ? u[0] === ">" ? (n = i ?? O, d = -1) : u[1] === void 0 ? d = -2 : (d = n.lastIndex - u[2].length, c = u[1], n = u[3] === void 0 ? _ : u[3] === '"' ? me : fe) : n === me || n === fe ? n = _ : n === pe || n === ue ? n = O : (n = _, i = void 0);
    const h = n === _ && s[a + 1].startsWith("/>") ? " " : "";
    o += n === O ? l + He : d >= 0 ? (r.push(c), l.slice(0, d) + ye + l.slice(d) + $ + h) : l + $ + (d === -2 ? a : h);
  }
  return [Se(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class z {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [c, u] = je(e, t);
    if (this.el = z.createElement(c, r), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = x.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(ye)) {
          const p = u[n++], h = i.getAttribute(d).split($), f = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: f[2], strings: h, ctor: f[1] === "." ? Be : f[1] === "?" ? Ve : f[1] === "@" ? Ze : B }), i.removeAttribute(d);
        } else d.startsWith($) && (l.push({ type: 6, index: o }), i.removeAttribute(d));
        if (Ae.test(i.tagName)) {
          const d = i.textContent.split($), p = d.length - 1;
          if (p > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let h = 0; h < p; h++) i.append(d[h], N()), x.nextNode(), l.push({ type: 2, index: ++o });
            i.append(d[p], N());
          }
        }
      } else if (i.nodeType === 8) if (i.data === xe) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf($, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += $.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const r = w.createElement("template");
    return r.innerHTML = e, r;
  }
}
function P(s, e, t = s, r) {
  var n, a;
  if (e === E) return e;
  let i = r !== void 0 ? (n = t._$Co) == null ? void 0 : n[r] : t._$Cl;
  const o = L(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = P(s, i._$AS(s, e.values), i, r)), e;
}
let qe = class {
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
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? w).importNode(t, !0);
    x.currentNode = i;
    let o = x.nextNode(), n = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new T(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Je(o, this, e)), this._$AV.push(c), l = r[++a];
      }
      n !== (l == null ? void 0 : l.index) && (o = x.nextNode(), n++);
    }
    return x.currentNode = w, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
};
class T {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = P(this, e, t), L(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Re(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && L(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = z.createElement(Se(r.h, r.h[0]), this.options)), r);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(t);
    else {
      const n = new qe(i, this), a = n.u(this.options);
      n.p(t), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = ge.get(e.strings);
    return t === void 0 && ge.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    ie(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const o of e) i === t.length ? t.push(r = new T(this.O(N()), this.O(N()), this, this.options)) : r = t[i], r._$AI(o), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
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
  constructor(e, t, r, i, o) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = m;
  }
  _$AI(e, t = this, r, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = P(this, e, t, 0), n = !L(e) || e !== this._$AH && e !== E, n && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = P(this, a[r + l], t, l), c === E && (c = this._$AH[l]), n || (n = !L(c) || c !== this._$AH[l]), c === m ? e = m : e !== m && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Be extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class Ve extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class Ze extends B {
  constructor(e, t, r, i, o) {
    super(e, t, r, i, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? m) === E) return;
    const r = this._$AH, i = e === m && r !== m || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== m && (r === m || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
    P(this, e);
  }
}
const We = { I: T }, W = M.litHtmlPolyfillSupport;
W == null || W(z, T), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.1");
const Ke = (s, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new T(e.insertBefore(N(), o), o, void 0, t ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
let S = class extends C {
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
    return E;
  }
};
var ve;
S._$litElement$ = !0, S.finalized = !0, (ve = A.litElementHydrateSupport) == null || ve.call(A, { LitElement: S });
const K = A.litElementPolyfillSupport;
K == null || K({ LitElement: S });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qe = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: te }, Ye = (s = Qe, e, t) => {
  const { kind: r, metadata: i } = t;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), r === "accessor") {
    const { name: n } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(n, l, s);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, s, a), a;
    } };
  }
  if (r === "setter") {
    const { name: n } = t;
    return function(a) {
      const l = this[n];
      e.call(this, a), this.requestUpdate(n, l, s);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function se(s) {
  return (e, t) => typeof t == "object" ? Ye(s, e, t) : ((r, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, r), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function oe(s) {
  return se({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = { CHILD: 2 }, Xe = (s) => (...e) => ({ _$litDirective$: s, values: e });
class et {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, r) {
    this._$Ct = e, this._$AM = t, this._$Ci = r;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: tt } = We, be = () => document.createComment(""), F = (s, e, t) => {
  var o;
  const r = s._$AA.parentNode, i = e === void 0 ? s._$AB : e._$AA;
  if (t === void 0) {
    const n = r.insertBefore(be(), i), a = r.insertBefore(be(), i);
    t = new tt(n, a, s, s.options);
  } else {
    const n = t._$AB.nextSibling, a = t._$AM, l = a !== s;
    if (l) {
      let c;
      (o = t._$AQ) == null || o.call(t, s), t._$AM = s, t._$AP !== void 0 && (c = s._$AU) !== a._$AU && t._$AP(c);
    }
    if (n !== i || l) {
      let c = t._$AA;
      for (; c !== n; ) {
        const u = c.nextSibling;
        r.insertBefore(c, i), c = u;
      }
    }
  }
  return t;
}, y = (s, e, t = s) => (s._$AI(e, t), s), it = {}, rt = (s, e = it) => s._$AH = e, st = (s) => s._$AH, Q = (s) => {
  s._$AR(), s._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = (s, e, t) => {
  const r = /* @__PURE__ */ new Map();
  for (let i = e; i <= t; i++) r.set(s[i], i);
  return r;
}, ot = Xe(class extends et {
  constructor(s) {
    if (super(s), s.type !== Ge.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(s, e, t) {
    let r;
    t === void 0 ? t = e : e !== void 0 && (r = e);
    const i = [], o = [];
    let n = 0;
    for (const a of s) i[n] = r ? r(a, n) : n, o[n] = t(a, n), n++;
    return { values: o, keys: i };
  }
  render(s, e, t) {
    return this.dt(s, e, t).values;
  }
  update(s, [e, t, r]) {
    const i = st(s), { values: o, keys: n } = this.dt(e, t, r);
    if (!Array.isArray(i)) return this.ut = n, o;
    const a = this.ut ?? (this.ut = []), l = [];
    let c, u, d = 0, p = i.length - 1, h = 0, f = o.length - 1;
    for (; d <= p && h <= f; ) if (i[d] === null) d++;
    else if (i[p] === null) p--;
    else if (a[d] === n[h]) l[h] = y(i[d], o[h]), d++, h++;
    else if (a[p] === n[f]) l[f] = y(i[p], o[f]), p--, f--;
    else if (a[d] === n[f]) l[f] = y(i[d], o[f]), F(s, l[f + 1], i[d]), d++, f--;
    else if (a[p] === n[h]) l[h] = y(i[p], o[h]), F(s, i[d], i[p]), p--, h++;
    else if (c === void 0 && (c = $e(n, h, f), u = $e(a, d, p)), c.has(a[d])) if (c.has(a[p])) {
      const b = u.get(n[h]), V = b !== void 0 ? i[b] : null;
      if (V === null) {
        const ne = F(s, i[d]);
        y(ne, o[h]), l[h] = ne;
      } else l[h] = y(V, o[h]), F(s, i[d], V), i[b] = null;
      h++;
    } else Q(i[p]), p--;
    else Q(i[d]), d++;
    for (; h <= f; ) {
      const b = F(s, l[f + 1]);
      y(b, o[h]), l[h++] = b;
    }
    for (; d <= p; ) {
      const b = i[d++];
      b !== null && Q(b);
    }
    return this.ut = n, rt(s, l), E;
  }
});
var nt = Object.defineProperty, lt = Object.getOwnPropertyDescriptor, at = (s, e, t) => e in s ? nt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, dt = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? lt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = n(i) || i);
  return i;
}, ct = (s, e, t) => at(s, e + "", t);
const ht = [
  {
    type: "text",
    label: "Text Input",
    icon: "📝",
    description: "Single line text input"
  },
  {
    type: "email",
    label: "Email",
    icon: "📧",
    description: "Email address input"
  },
  {
    type: "number",
    label: "Number",
    icon: "🔢",
    description: "Numeric input"
  },
  {
    type: "textarea",
    label: "Text Area",
    icon: "📄",
    description: "Multi-line text input"
  }
];
let Y = class extends S {
  handleDragStart(s, e) {
    if (!s.dataTransfer) return;
    s.dataTransfer.effectAllowed = "copy", s.dataTransfer.setData("application/json", JSON.stringify({ fieldType: e })), s.currentTarget.classList.add("dragging"), this.dispatchEvent(new CustomEvent("field-drag-start", {
      detail: { fieldType: e },
      bubbles: !0,
      composed: !0
    }));
  }
  handleDragEnd(s) {
    s.currentTarget.classList.remove("dragging");
  }
  handleClick(s, e) {
    const t = s.currentTarget;
    console.log("Field clicked:", e, t), this.dispatchEvent(new CustomEvent("field-click", {
      detail: { fieldType: e },
      bubbles: !0,
      composed: !0
    }));
  }
  render() {
    return g`
      <div class="palette-header">Field Types</div>
      <div class="field-types">
        ${ht.map((s) => g`
          <div
            class="field-type"
            draggable="true"
            @dragstart="${(e) => this.handleDragStart(e, s.type)}"
            @dragend="${this.handleDragEnd}"
            @click="${(e) => this.handleClick(e, s.type)}"
          >
            <div class="field-icon">${s.icon}</div>
            <div class="field-info">
              <div class="field-label">${s.label}</div>
              <div class="field-description">${s.description}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
};
ct(Y, "styles", ee`
    :host {
      display: block;
      padding: 1rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .palette-header {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .field-types {
      display: grid;
      gap: 0.5rem;
    }

    .field-type {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: grab;
      transition: all 0.15s ease-in-out;
    }

    .field-type:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .field-type:active {
      cursor: grabbing;
    }

    .field-type.dragging {
      opacity: 0.5;
    }

    .field-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .field-info {
      flex: 1;
      min-width: 0;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.125rem;
    }

    .field-description {
      font-size: 0.75rem;
      color: #6b7280;
    }
  `);
Y = dt([
  re("field-palette")
], Y);
var we = Object.defineProperty, pt = Object.getOwnPropertyDescriptor, ut = (s, e, t) => e in s ? we(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ee = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? pt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = (r ? n(e, t, i) : n(i)) || i);
  return r && i && we(e, t, i), i;
}, ft = (s, e, t) => ut(s, e + "", t);
let q = class extends S {
  constructor() {
    super(...arguments);
    U(this, "_field", null);
  }
  set field(e) {
    const t = this._field;
    this._field = e, console.log("Field property set:", e), this.requestUpdate("field", t);
  }
  get field() {
    return this._field;
  }
  handleChange(e, t) {
    this.field && this.dispatchEvent(new CustomEvent("field-update", {
      detail: {
        fieldId: this.field.id,
        property: e,
        value: t
      },
      bubbles: !0,
      composed: !0
    }));
  }
  handleDelete() {
    this.field && this.dispatchEvent(new CustomEvent("field-delete", {
      detail: { fieldId: this.field.id },
      bubbles: !0,
      composed: !0
    }));
  }
  renderCommonProperties() {
    return this.field ? g`
      <div class="form-group">
        <label class="form-label">Label</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.label}"
          @input="${(e) => this.handleChange("label", e.target.value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Field Name</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.name}"
          @input="${(e) => this.handleChange("name", e.target.value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Placeholder</label>
        <input
          type="text"
          class="form-input"
          .value="${this.field.placeholder || ""}"
          @input="${(e) => this.handleChange("placeholder", e.target.value)}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Help Text</label>
        <textarea
          class="form-textarea"
          .value="${this.field.helpText || ""}"
          @input="${(e) => this.handleChange("helpText", e.target.value)}"
        ></textarea>
      </div>

      <div class="form-checkbox">
        <input
          type="checkbox"
          id="required"
          .checked="${this.field.required || !1}"
          @change="${(e) => this.handleChange("required", e.target.checked)}"
        />
        <label for="required">Required</label>
      </div>
    ` : null;
  }
  renderTextFieldProperties() {
    var t, r;
    const e = this.field;
    return g`
      <div class="form-group">
        <label class="form-label">Min Length</label>
        <input
          type="number"
          class="form-input"
          .value="${((t = e.minLength) == null ? void 0 : t.toString()) || ""}"
          @input="${(i) => this.handleChange("minLength", Number(i.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Max Length</label>
        <input
          type="number"
          class="form-input"
          .value="${((r = e.maxLength) == null ? void 0 : r.toString()) || ""}"
          @input="${(i) => this.handleChange("maxLength", Number(i.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Pattern (Regex)</label>
        <input
          type="text"
          class="form-input"
          .value="${e.pattern || ""}"
          @input="${(i) => this.handleChange("pattern", i.target.value)}"
        />
      </div>
    `;
  }
  renderNumberFieldProperties() {
    var t, r, i;
    const e = this.field;
    return g`
      <div class="form-group">
        <label class="form-label">Minimum Value</label>
        <input
          type="number"
          class="form-input"
          .value="${((t = e.min) == null ? void 0 : t.toString()) || ""}"
          @input="${(o) => this.handleChange("min", Number(o.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Maximum Value</label>
        <input
          type="number"
          class="form-input"
          .value="${((r = e.max) == null ? void 0 : r.toString()) || ""}"
          @input="${(o) => this.handleChange("max", Number(o.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Step</label>
        <input
          type="number"
          class="form-input"
          .value="${((i = e.step) == null ? void 0 : i.toString()) || ""}"
          @input="${(o) => this.handleChange("step", Number(o.target.value))}"
        />
      </div>
    `;
  }
  renderTextareaProperties() {
    var t, r, i;
    const e = this.field;
    return g`
      <div class="form-group">
        <label class="form-label">Rows</label>
        <input
          type="number"
          class="form-input"
          .value="${((t = e.rows) == null ? void 0 : t.toString()) || "3"}"
          @input="${(o) => this.handleChange("rows", Number(o.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Min Length</label>
        <input
          type="number"
          class="form-input"
          .value="${((r = e.minLength) == null ? void 0 : r.toString()) || ""}"
          @input="${(o) => this.handleChange("minLength", Number(o.target.value))}"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Max Length</label>
        <input
          type="number"
          class="form-input"
          .value="${((i = e.maxLength) == null ? void 0 : i.toString()) || ""}"
          @input="${(o) => this.handleChange("maxLength", Number(o.target.value))}"
        />
      </div>
    `;
  }
  renderTypeSpecificProperties() {
    if (!this.field) return null;
    switch (this.field.type) {
      case "text":
        return this.renderTextFieldProperties();
      case "number":
        return this.renderNumberFieldProperties();
      case "textarea":
        return this.renderTextareaProperties();
      default:
        return null;
    }
  }
  render() {
    return console.log("FieldEditor render, field:", this.field), this.field ? g`
      <div class="editor-header">Edit Field: ${this.field.type}</div>
      ${this.renderCommonProperties()}
      ${this.renderTypeSpecificProperties()}
      <button class="btn-delete" @click="${this.handleDelete}">
        Delete Field
      </button>
    ` : g`
        <div class="editor-header">Field Properties</div>
        <div class="editor-empty">
          Select a field to edit its properties
        </div>
      `;
  }
};
ft(q, "styles", ee`
    :host {
      display: block;
      padding: 1rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .editor-header {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .editor-empty {
      text-align: center;
      padding: 2rem 1rem;
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.375rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 4rem;
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .form-checkbox input {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }

    .form-checkbox label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
    }

    .btn-delete {
      width: 100%;
      padding: 0.5rem;
      background-color: #dc2626;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
    }

    .btn-delete:hover {
      background-color: #b91c1c;
    }
  `);
Ee([
  se({ attribute: !1 })
], q.prototype, "field", 1);
q = Ee([
  re("field-editor")
], q);
var De = Object.defineProperty, mt = Object.getOwnPropertyDescriptor, gt = (s, e, t) => e in s ? De(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, H = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? mt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = (r ? n(e, t, i) : n(i)) || i);
  return r && i && De(e, t, i), i;
}, bt = (s, e, t) => gt(s, e + "", t);
let D = class extends S {
  constructor() {
    super(...arguments);
    U(this, "formDefinition", {
      id: "form-" + Date.now(),
      title: "Untitled Form",
      description: "",
      isMultiStep: !1,
      steps: [
        {
          id: "step-1",
          title: "Step 1",
          description: "",
          order: 0,
          fields: []
        }
      ]
    });
    U(this, "selectedField", null);
    U(this, "currentStepIndex", 0);
  }
  set definition(e) {
    e && (this.formDefinition = e);
  }
  get definition() {
    return this.formDefinition;
  }
  /**
   * Emit definition change event for Django integration
   */
  emitDefinitionChange() {
    this.dispatchEvent(new CustomEvent("definition-change", {
      detail: { definition: this.formDefinition },
      bubbles: !0,
      composed: !0
    }));
  }
  createField(e) {
    const t = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, r = `${e}_${Date.now()}`, i = {
      id: t,
      name: r,
      label: `${e.charAt(0).toUpperCase() + e.slice(1)} Field`,
      placeholder: "",
      required: !1
    };
    switch (e) {
      case "text":
        return { ...i, type: "text" };
      case "email":
        return { ...i, type: "email" };
      case "number":
        return { ...i, type: "number" };
      case "textarea":
        return { ...i, type: "textarea", rows: 3 };
    }
  }
  handleFieldDragStart(e, t, r) {
    if (!e.dataTransfer) return;
    e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("application/json", JSON.stringify({
      action: "reorder",
      fieldId: t.id,
      sourceIndex: r
    })), e.currentTarget.classList.add("dragging");
  }
  handleFieldDragEnd(e) {
    e.currentTarget.classList.remove("dragging");
  }
  handleDragOver(e) {
    e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
  }
  handleDropZoneDragEnter(e) {
    e.preventDefault(), console.log("Drag entered drop zone"), e.currentTarget.classList.add("drag-over");
  }
  handleDropZoneDragLeave(e) {
    e.currentTarget.classList.remove("drag-over");
  }
  handleDrop(e) {
    if (e.preventDefault(), e.currentTarget.classList.remove("drag-over"), !!e.dataTransfer)
      try {
        const r = JSON.parse(e.dataTransfer.getData("application/json")), i = this.formDefinition.steps[this.currentStepIndex];
        if (r.fieldType) {
          const o = this.createField(r.fieldType);
          i.fields = [...i.fields, o], this.selectedField = { ...o }, console.log("Added new field from palette:", o), this.requestUpdate(), this.emitDefinitionChange();
        }
      } catch (r) {
        console.error("Error handling drop:", r);
      }
  }
  handleFieldDrop(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !!e.dataTransfer)
      try {
        const r = JSON.parse(e.dataTransfer.getData("application/json")), i = this.formDefinition.steps[this.currentStepIndex];
        if (r.action === "reorder" && r.sourceIndex !== void 0) {
          const o = [...i.fields], [n] = o.splice(r.sourceIndex, 1);
          o.splice(t, 0, n), i.fields = o, this.requestUpdate(), this.emitDefinitionChange();
        } else if (r.fieldType) {
          const o = this.createField(r.fieldType), n = [...i.fields];
          n.splice(t, 0, o), i.fields = n, this.selectedField = { ...o }, console.log("Added new field at index:", t, o), this.requestUpdate(), this.emitDefinitionChange();
        }
      } catch (r) {
        console.error("Error handling field drop:", r);
      }
  }
  handleFieldClick(e) {
    console.log("Field clicked:", e), this.selectedField = { ...e }, this.requestUpdate();
  }
  handleFieldUpdate(e) {
    const { fieldId: t, property: r, value: i } = e.detail, n = this.formDefinition.steps[this.currentStepIndex].fields.find((a) => a.id === t);
    n && (n[r] = i, this.requestUpdate(), this.emitDefinitionChange());
  }
  handleFieldDelete(e) {
    var i;
    const { fieldId: t } = e.detail, r = this.formDefinition.steps[this.currentStepIndex];
    r.fields = r.fields.filter((o) => o.id !== t), ((i = this.selectedField) == null ? void 0 : i.id) === t && (this.selectedField = null), this.requestUpdate(), this.emitDefinitionChange();
  }
  handleAddStep() {
    this.requestUpdate();
    const e = {
      id: `step-${Date.now()}`,
      title: `Step ${this.formDefinition.steps.length + 1}`,
      description: "",
      order: this.formDefinition.steps.length,
      fields: []
    };
    this.formDefinition.steps = [...this.formDefinition.steps, e], this.currentStepIndex = this.formDefinition.steps.length - 1, this.emitDefinitionChange();
  }
  handleExport() {
    const e = JSON.stringify(this.formDefinition, null, 2), t = new Blob([e], { type: "application/json" }), r = URL.createObjectURL(t), i = document.createElement("a");
    i.href = r, i.download = `form-${this.formDefinition.id}.json`, i.click(), URL.revokeObjectURL(r);
  }
  renderFormHeader() {
    return g`
      <div class="form-header-editor">
        <div class="form-group">
          <label class="form-label">Form Title</label>
          <input
            type="text"
            class="form-input"
            .value="${this.formDefinition.title}"
            @input="${(e) => {
      this.formDefinition.title = e.target.value, this.requestUpdate(), this.emitDefinitionChange();
    }}"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            class="form-textarea"
            rows="2"
            .value="${this.formDefinition.description || ""}"
            @input="${(e) => {
      this.formDefinition.description = e.target.value, this.requestUpdate(), this.emitDefinitionChange();
    }}"
          ></textarea>
        </div>

        <div class="form-checkbox">
          <input
            type="checkbox"
            id="multi-step"
            .checked="${this.formDefinition.isMultiStep}"
            @change="${(e) => {
      this.formDefinition.isMultiStep = e.target.checked, this.requestUpdate(), this.emitDefinitionChange();
    }}"
          />
          <label for="multi-step">Multi-step form</label>
        </div>
      </div>
    `;
  }
  renderStepTabs() {
    return this.formDefinition.isMultiStep ? g`
      <div class="steps-container">
        <div class="step-tabs">
          ${this.formDefinition.steps.map((e, t) => g`
            <button
              class="step-tab ${t === this.currentStepIndex ? "active" : ""}"
              @click="${() => {
      this.currentStepIndex = t, this.selectedField = null, this.requestUpdate();
    }}"
            >
              ${e.title}
            </button>
          `)}
          <button class="btn-add-step" @click="${this.handleAddStep}">
            + Add Step
          </button>
        </div>
      </div>
    ` : null;
  }
  renderDropZone() {
    const e = this.formDefinition.steps[this.currentStepIndex];
    return e.fields.length ? g`
      <div
        class="field-list"
        @dragover="${this.handleDragOver}"
        @dragenter="${this.handleDropZoneDragEnter}"
        @dragleave="${this.handleDropZoneDragLeave}"
        @drop="${this.handleDrop}"
      >
        ${ot(
      e.fields,
      (t) => t.id,
      (t, r) => {
        var i;
        return g`
            <div
              class="field-item ${((i = this.selectedField) == null ? void 0 : i.id) === t.id ? "selected" : ""}"
              draggable="true"
              @dragstart="${(o) => this.handleFieldDragStart(o, t, r)}"
              @dragend="${this.handleFieldDragEnd}"
              @dragover="${this.handleDragOver}"
              @drop="${(o) => this.handleFieldDrop(o, r)}"
              @click="${() => this.handleFieldClick(t)}"
            >
              <div class="field-handle">⋮⋮</div>
              <div class="field-content">
                <div class="field-type">${t.type}</div>
                <div class="field-label">${t.label}</div>
              </div>
            </div>
          `;
      }
    )}
      </div>
    ` : g`
        <div
          class="drop-zone"
          @dragover="${this.handleDragOver}"
          @dragenter="${this.handleDropZoneDragEnter}"
          @dragleave="${this.handleDropZoneDragLeave}"
          @drop="${this.handleDrop}"
        >
          <div class="drop-zone-empty">
            Drag and drop fields here to build your form
          </div>
        </div>
      `;
  }
  render() {
    return g`
      <div class="builder-container">
        <div class="builder-sidebar">
          <field-palette
          @field-drag-start="${(e) => {
      console.log("Field drag started from palette:", e.detail.fieldType);
    }}"
          @field-drag-end="${(e) => {
      console.log("Field drag ended from palette", e.detail.fieldType);
    }}"
            @field-click="${(e) => {
      console.log("Field clicked in palette:", e.detail.fieldType);
      const t = this.createField(e.detail.fieldType), r = this.formDefinition.steps[this.currentStepIndex];
      r.fields = [...r.fields, t], this.selectedField = { ...t }, this.requestUpdate(), this.emitDefinitionChange();
    }}"
          ></field-palette>
        </div>

        <div class="builder-main">
          ${this.renderFormHeader()}
          ${this.renderStepTabs()}
          ${this.renderDropZone()}
        </div>

        <div class="builder-properties">
          ${this.renderFieldEditor()}
        </div>
      </div>

      <button class="btn-export" @click="${this.handleExport}">
        Export Form JSON
      </button>
    `;
  }
  renderFieldEditor() {
    const e = this.selectedField;
    return console.log("Rendering field editor for:", e), g`
      <field-editor
        .field="${e}"
        @field-update="${this.handleFieldUpdate}"
        @field-delete="${this.handleFieldDelete}"
      ></field-editor>
    `;
  }
};
bt(D, "styles", ee`
    :host {
      display: block;
      min-height: 600px;
      background-color: #f9fafb;
    }

    .builder-container {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      min-height: 600px;
      gap: 1rem;
      padding: 1rem;
    }

    .builder-sidebar {
      overflow-y: auto;
      max-height: 800px;
    }

    .builder-main {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      max-height: 800px;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
    }

    .builder-properties {
      overflow-y: auto;
      max-height: 800px;
    }

    .form-header-editor {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .form-checkbox input {
      width: 1.125rem;
      height: 1.125rem;
      cursor: pointer;
    }

    .form-checkbox label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
    }

    .steps-container {
      margin-bottom: 2rem;
    }

    .step-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .step-tab {
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.15s;
      margin-bottom: -2px;
    }

    .step-tab:hover {
      color: #111827;
    }

    .step-tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
    }

    .btn-add-step {
      padding: 0.5rem 1rem;
      background-color: #f3f4f6;
      border: 1px dashed #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      color: #6b7280;
    }

    .btn-add-step:hover {
      background-color: #e5e7eb;
      color: #374151;
    }

    .drop-zone {
      min-height: 200px;
      padding: 1rem;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      background-color: #f9fafb;
    }

    .drop-zone.drag-over {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .drop-zone-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #9ca3af;
      font-size: 0.875rem;
      text-align: center;
    }

    .field-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 200px;
      padding: 1rem;
      border: 2px dashed transparent;
      border-radius: 0.5rem;
      transition: all 0.15s;
    }

    .field-list.drag-over {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .field-item {
      padding: 1rem;
      background-color: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .field-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .field-item.selected {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .field-item.dragging {
      opacity: 0.5;
    }

    .field-item.drag-over-top {
      border-top-color: #3b82f6;
      border-top-width: 3px;
    }

    .field-item.drag-over-bottom {
      border-bottom-color: #3b82f6;
      border-bottom-width: 3px;
    }

    .field-handle {
      cursor: grab;
      color: #9ca3af;
      font-size: 1.25rem;
    }

    .field-handle:active {
      cursor: grabbing;
    }

    .field-content {
      flex: 1;
      min-width: 0;
    }

    .field-type {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 0.125rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
    }

    .btn-export {
      display: none;
      /* Hidden in Django admin - definition is auto-synced */
    }
  `);
H([
  se({ type: Object })
], D.prototype, "definition", 1);
H([
  oe()
], D.prototype, "formDefinition", 2);
H([
  oe()
], D.prototype, "selectedField", 2);
H([
  oe()
], D.prototype, "currentStepIndex", 2);
D = H([
  re("form-builder")
], D);
export {
  q as FieldEditor,
  Y as FieldPalette,
  D as FormBuilder
};
