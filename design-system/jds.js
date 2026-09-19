/*
  Jarvis Design System — helpers
  Sem build step, sem dependências.
*/
(function (global) {
  "use strict";

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

  let tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "jds-tooltip";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
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

  function badge(status, label) {
    const span = document.createElement("span");
    span.className = "jds-badge jds-badge-" + status;
    const dot = document.createElement("span");
    dot.className = "jds-dot";
    span.appendChild(dot);
    span.appendChild(document.createTextNode(label));
    return span;
  }

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

  function renderTable(tbody, rows, columns) {
    tbody.textContent = "";
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((col) => {
        const td = document.createElement("td");
        if (col.type === "name") td.className = "jds-cell-name";
        if (col.type === "num") td.className = "jds-cell-num";
        if (col.type === "badge") {
          td.appendChild(badge(row[col.key + "Status"], row[col.key]));
        } else {
          td.textContent = row[col.key];
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  global.jds = { initThemeToggle, showTooltip, moveTooltip, hideTooltip, attachTooltip, badge, renderRangeChart, renderTable };
})(window);
