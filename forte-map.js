(() => {
  const LIBS = [
    { src: "https://unpkg.com/d3@7.9.0/dist/d3.min.js", integrity: "sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i", check: () => window.d3 },
    { src: "https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js", integrity: "sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67", check: () => window.topojson }
  ];
  const WORLD = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

  function loadLib(lib) {
    if (lib.check()) return Promise.resolve();
    if (lib._p) return lib._p;
    lib._p = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = lib.src; s.integrity = lib.integrity; s.crossOrigin = "anonymous";
      s.onload = res; s.onerror = () => rej(new Error("load failed"));
      document.head.appendChild(s);
    });
    return lib._p;
  }

  const CENTER = [-52, 14];
  const PINS = [
    { coord: [-2.2, 53.5], kind: "record" },
    { coord: [-100, 40.5], kind: "record" },
    { coord: [-66, 22.5], kind: "record" },
    { coord: [-88.6, 14.5], kind: "active" },
    { coord: [-70.65, -33.45], kind: "active" }
  ];
  const INK = "#12324A", ACCENT = "#137F7C", NS = "http://www.w3.org/2000/svg";

  class ForteMap extends HTMLElement {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      this.style.display = "block";
      this.style.width = "100%";
      this.style.maxWidth = "440px";
      this.style.marginLeft = "auto";
      this.render();
    }
    attributeChangedCallback() { if (this._mounted) this.render(); }

    async render() {
      const lang = this.getAttribute("lang") === "en" ? "en" : "es";
      if (!this._geo) {
        try {
          await Promise.all(LIBS.map(loadLib));
          const topo = await fetch(WORLD).then(r => r.json());
          this._geo = window.topojson.feature(topo, topo.objects.countries);
        } catch (e) { this.innerHTML = ""; return; }
      }
      const d3 = window.d3, S = 620, pad = 24;
      const proj = d3.geoOrthographic().rotate([-CENTER[0], -CENTER[1]])
        .fitExtent([[pad, pad], [S - pad, S - pad]], { type: "Sphere" });
      const path = d3.geoPath(proj);

      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 " + S + " " + S);
      svg.setAttribute("width", "100%");
      svg.style.display = "block";
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", lang === "en" ? "Coverage map" : "Mapa de cobertura");

      const add = (tag, attrs) => {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        svg.appendChild(el);
        return el;
      };

      add("path", { d: path({ type: "Sphere" }), fill: "rgba(18,50,74,0.045)", stroke: "rgba(18,50,74,0.16)", "stroke-width": 1 });
      add("path", { d: path(d3.geoGraticule10()), fill: "none", stroke: "rgba(18,50,74,0.09)", "stroke-width": 0.6 });

      this._geo.features.forEach(f => {
        const d = path(f);
        if (d) add("path", { d, fill: "rgba(18,50,74,0.16)", stroke: "rgba(18,50,74,0.3)", "stroke-width": 0.5 });
      });

      PINS.forEach(pin => {
        if (d3.geoDistance(pin.coord, CENTER) > Math.PI / 2 - 0.04) return;
        const [x, y] = proj(pin.coord);
        if (pin.kind === "active") {
          add("circle", { cx: x, cy: y, r: 14, fill: ACCENT, opacity: 0.14 });
          add("circle", { cx: x, cy: y, r: 5.5, fill: ACCENT });
        } else {
          add("circle", { cx: x, cy: y, r: 5.5, fill: "none", stroke: ACCENT, "stroke-width": 1.6 });
        }
      });

      this.innerHTML = "";
      this.appendChild(svg);
    }
  }

  if (!customElements.get("forte-map")) customElements.define("forte-map", ForteMap);
})();
