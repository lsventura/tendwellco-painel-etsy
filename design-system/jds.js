/*
  Jarvis Design System — helpers
  Sem build step, sem dependências. Import direto: <script src="jds.js"></script>
  Regra do skill dataviz (interaction.md): nomes/labels vindos de dados são
  "untrusted" — sempre textContent, nunca innerHTML com valor interpolado.
*/
(function (global) {
  "use strict";

  // ---------- ícones (Lucide, MIT license — markup fixo, nunca leva dado externo) ----------
  const ICON_PATHS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    "triangle-alert": '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "circle-x": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "arrow-up-right": '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    "arrow-down-right": '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
    package: '<path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    check2: '<path d="M20 6 9 17l-5-5"/>',
    sparkle: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  };
  // Markup é sempre um dos paths fixos acima (nunca dado externo) — seguro usar innerHTML aqui.
  function icon(name, cls) {
    const span = document.createElement("span");
    span.className = "jds-icon" + (cls ? " " + cls : "");
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = ICON_PATHS[name] || "";
    span.appendChild(svg);
    span.style.display = "inline-flex";
    return span;
  }

  // ---------- tema ----------
  function initThemeToggle(button, { onLabel = "Modo escuro", offLabel = "Modo claro" } = {}) {
    const root = document.documentElement;
    function isDark() {
      return root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && global.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    function sync() { button.textContent = isDark() ? offLabel : onLabel; }
    button.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      root.setAttribute("data-theme", current === "dark" ? "light" : "dark");
      sync();
    });
    sync();
  }

  // ---------- tooltip singleton ----------
  let tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "jds-tooltip";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
  // title: string; detail: string — inseridos via textContent, nunca innerHTML.
  function showTooltip(evt, title, detail) {
    const el = getTooltip();
    el.textContent = "";
    if (title) {
      const b = document.createElement("b");
      b.textContent = title;
      el.appendChild(b);
    }
    if (detail) {
      if (title) el.appendChild(document.createElement("br"));
      el.appendChild(document.createTextNode(detail));
    }
    moveTooltip(evt);
    el.classList.add("is-visible");
  }
  function moveTooltip(evt) {
    const el = getTooltip();
    el.style.left = evt.clientX + 14 + "px";
    el.style.top = evt.clientY + 14 + "px";
  }
  function hideTooltip() {
    if (tooltipEl) tooltipEl.classList.remove("is-visible");
  }
  function attachTooltip(el, title, detail) {
    el.addEventListener("mouseenter", (e) => showTooltip(e, title, detail));
    el.addEventListener("mousemove", moveTooltip);
    el.addEventListener("mouseleave", hideTooltip);
    el.addEventListener("focus", (e) => showTooltip(e, title, detail));
    el.addEventListener("blur", hideTooltip);
  }

  // ---------- copiar pro clipboard (com feedback visual — guideline #34 ui-ux-pro-max) ----------
  function copyText(text, button) {
    const originalHTML = button.innerHTML;
    const done = () => {
      button.textContent = "";
      button.appendChild(icon("check2", "jds-icon-sm"));
      button.appendChild(document.createTextNode(" Copiado"));
      button.classList.add("is-copied");
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("is-copied");
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }

  // ---------- sparkline mês a mês (12 pontos) — faixa min–max sempre visível
  // como texto (nunca só no hover); o detalhe mês a mês abre num dropdown ao
  // clicar/tocar (hover sozinho não funciona em touch, então não pode ser o
  // único jeito de ver o dado — mesma regra do skill dataviz pra tooltip). ----------
  function fmtNum(n) { return n.toLocaleString("pt-BR"); }
  function buildSparkline(monthly) {
    const wrap = document.createElement("div");
    wrap.className = "jds-spark-wrap";
    if (!monthly || !monthly.length) {
      wrap.classList.add("jds-spark-empty");
      wrap.textContent = "Sem dado mês a mês";
      return wrap;
    }
    const values = monthly.map((m) => m.valor);
    const min = Math.min(...values), max = Math.max(...values);
    const w = 110, h = 26, pad = 3;
    const range = max - min || 1;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.classList.add("jds-spark-svg");
    const polyline = document.createElementNS(svgNS, "polyline");
    polyline.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    polyline.setAttribute("class", "jds-spark-line");
    svg.appendChild(polyline);
    const last = pts[pts.length - 1];
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", String(last[0]));
    dot.setAttribute("cy", String(last[1]));
    dot.setAttribute("r", "2.6");
    dot.setAttribute("class", "jds-spark-dot");
    svg.appendChild(dot);

    const rangeLabel = document.createElement("div");
    rangeLabel.className = "jds-spark-range";
    rangeLabel.textContent = min === max ? fmtNum(min) + "/mês" : fmtNum(min) + "–" + fmtNum(max) + "/mês";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "jds-spark-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.appendChild(svg);
    toggle.appendChild(rangeLabel);
    toggle.appendChild(icon("chevron-down", "jds-icon-sm jds-spark-chevron"));
    wrap.appendChild(toggle);

    const panel = document.createElement("div");
    panel.className = "jds-spark-panel";
    panel.hidden = true;
    const table = document.createElement("table");
    table.className = "jds-spark-table";
    monthly.forEach((m) => {
      const tr = document.createElement("tr");
      const tdMes = document.createElement("td");
      tdMes.textContent = m.mes;
      const tdValor = document.createElement("td");
      tdValor.className = "jds-cell-num";
      tdValor.textContent = fmtNum(m.valor);
      tr.appendChild(tdMes);
      tr.appendChild(tdValor);
      table.appendChild(tr);
    });
    panel.appendChild(table);
    wrap.appendChild(panel);

    toggle.addEventListener("click", () => {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      toggle.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });

    return wrap;
  }

  // ---------- badge (status: dot + label — nunca cor sozinha) ----------
  function badge(status, label) {
    const span = document.createElement("span");
    span.className = "jds-badge jds-badge-" + status;
    const dot = document.createElement("span");
    dot.className = "jds-dot";
    span.appendChild(dot);
    span.appendChild(document.createTextNode(label));
    return span;
  }

  // ---------- range chart (faixa min–max, com legenda e tooltip) ----------
  // items: [{ label, sub, min, max, pending, detail }], opts: { max }
  function renderRangeChart(container, items, opts) {
    const scaleMax = (opts && opts.max) || Math.max(...items.map((i) => i.max)) * 1.05;
    container.textContent = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "jds-range-row";

      const label = document.createElement("div");
      label.className = "jds-range-label";
      label.appendChild(document.createTextNode(item.label));
      if (item.sub) {
        const small = document.createElement("small");
        small.textContent = item.sub;
        label.appendChild(small);
      }

      const track = document.createElement("div");
      track.className = "jds-range-track";
      const fill = document.createElement("div");
      fill.className = "jds-range-fill" + (item.pending ? " is-pending" : "");
      const leftPct = (item.min / scaleMax) * 100;
      const widthPct = ((item.max - item.min) / scaleMax) * 100;
      fill.style.left = leftPct + "%";
      fill.style.width = widthPct + "%";
      track.appendChild(fill);
      attachTooltip(fill, item.label, item.detail || "");
      fill.tabIndex = 0;

      const value = document.createElement("div");
      value.className = "jds-range-value";
      value.textContent = "$" + item.min.toFixed(2) + "–$" + item.max.toFixed(2);

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  // ---------- gráfico de barra fina (valor único, ex.: preço mediano) ----------
  // items: [{ label, value, detail, pending }], opts: { max, prefix }
  function renderBarChart(container, items, opts) {
    const prefix = (opts && opts.prefix) || "";
    const scaleMax = (opts && opts.max) || Math.max(...items.map((i) => i.value)) * 1.15;
    container.textContent = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "jds-bar-row";

      const label = document.createElement("div");
      label.className = "jds-bar-label";
      label.textContent = item.label;

      const trackBg = document.createElement("div");
      trackBg.className = "jds-bar-track-bg";
      const fill = document.createElement("div");
      fill.className = "jds-bar-fill" + (item.pending ? " is-pending" : "");
      fill.style.width = (item.value / scaleMax) * 100 + "%";
      trackBg.appendChild(fill);
      attachTooltip(fill, item.label, item.detail || "");
      fill.tabIndex = 0;

      const value = document.createElement("div");
      value.className = "jds-bar-value";
      value.textContent = prefix + item.value.toFixed(2);

      row.appendChild(label);
      row.appendChild(trackBg);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  // ---------- tabela genérica a partir de linhas + definição de colunas ----------
  // columns: [{ key, header, type: 'text'|'name'|'num'|'badge' }]
  // opts.statusAttr: nome do campo da linha usado como data-status no <tr>
  // (liga a faixa colorida lateral em .jds-table e serve de gancho pro filtro)
  function renderTable(tbody, rows, columns, opts) {
    opts = opts || {};
    tbody.textContent = "";
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      if (opts.statusAttr && row[opts.statusAttr]) tr.dataset.status = row[opts.statusAttr];
      columns.forEach((col) => {
        const td = document.createElement("td");
        if (col.type === "name") td.className = "jds-cell-name";
        if (col.type === "num") td.className = "jds-cell-num";
        if (col.type === "badge") {
          td.appendChild(badge(row[col.key + "Status"], row[col.key]));
        } else if (col.type === "copy") {
          if (row[col.key]) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "jds-copy-btn";
            btn.appendChild(icon("copy", "jds-icon-sm"));
            btn.appendChild(document.createTextNode(" Copiar título"));
            btn.addEventListener("click", () => copyText(row[col.key], btn));
            td.appendChild(btn);
          } else {
            td.textContent = "—";
          }
        } else if (col.type === "sparkline") {
          td.appendChild(buildSparkline(row[col.key]));
        } else {
          td.textContent = row[col.key];
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  // liga chips de filtro (.jds-filter-pill[data-filter]) a um <tbody> já
  // renderizado por renderTable com opts.statusAttr — filtra por tr[data-status]
  function wireStatusFilter(filterRow, tbody) {
    const pills = filterRow.querySelectorAll(".jds-filter-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");
        const filter = pill.dataset.filter;
        tbody.querySelectorAll("tr").forEach((tr) => {
          tr.style.display = filter === "all" || tr.dataset.status === filter ? "" : "none";
        });
      });
    });
  }

  // abas de painel gerenciador — só uma seção visível por vez (mobile e
  // desktop), em vez de rolar por tudo. tabsEl tem os .jds-tab-btn[data-tab],
  // os painéis em qualquer lugar do documento têm [data-tab-panel]
  function wireTabs(tabsEl) {
    const buttons = tabsEl.querySelectorAll(".jds-tab-btn");
    const panels = document.querySelectorAll("[data-tab-panel]");
    function activate(tab) {
      buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));
      panels.forEach((p) => { p.hidden = p.dataset.tabPanel !== tab; });
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => activate(btn.dataset.tab));
    });
  }

  global.jds = {
    initThemeToggle,
    showTooltip,
    moveTooltip,
    hideTooltip,
    attachTooltip,
    badge,
    icon,
    copyText,
    renderRangeChart,
    renderBarChart,
    renderTable,
    wireStatusFilter,
    wireTabs,
  };
})(window);
