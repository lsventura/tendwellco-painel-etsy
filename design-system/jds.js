/*
  Jarvis Design System — helpers
  Sem build step, sem dependências.
*/
(function (global) {
  "use strict";

  var ICON_PATHS = {
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
  };
  function icon(name, cls) {
    var span = document.createElement("span");
    span.className = "jds-icon" + (cls ? " " + cls : "");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = ICON_PATHS[name] || "";
    span.appendChild(svg);
    span.style.display = "inline-flex";
    return span;
  }

  function initThemeToggle(button, opts) {
    opts = opts || {};
    var onLabel = opts.onLabel || "Modo escuro";
    var offLabel = opts.offLabel || "Modo claro";
    var root = document.documentElement;
    function isDark() {
      return root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && global.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    function sync() { button.textContent = isDark() ? offLabel : onLabel; }
    button.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      root.setAttribute("data-theme", current === "dark" ? "light" : "dark");
      sync();
    });
    sync();
  }

  var tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "jds-tooltip";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
  function showTooltip(evt, title, detail) {
    var el = getTooltip();
    el.textContent = "";
    if (title) {
      var b = document.createElement("b");
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
    var el = getTooltip();
    el.style.left = evt.clientX + 14 + "px";
    el.style.top = evt.clientY + 14 + "px";
  }
  function hideTooltip() { if (tooltipEl) tooltipEl.classList.remove("is-visible"); }
  function attachTooltip(el, title, detail) {
    el.addEventListener("mouseenter", function (e) { showTooltip(e, title, detail); });
    el.addEventListener("mousemove", moveTooltip);
    el.addEventListener("mouseleave", hideTooltip);
    el.addEventListener("focus", function (e) { showTooltip(e, title, detail); });
    el.addEventListener("blur", hideTooltip);
  }

  function badge(status, label) {
    var span = document.createElement("span");
    span.className = "jds-badge jds-badge-" + status;
    var dot = document.createElement("span");
    dot.className = "jds-dot";
    span.appendChild(dot);
    span.appendChild(document.createTextNode(label));
    return span;
  }

  function renderRangeChart(container, items, opts) {
    var scaleMax = (opts && opts.max) || Math.max.apply(null, items.map(function (i) { return i.max; })) * 1.05;
    container.textContent = "";
    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "jds-range-row";

      var label = document.createElement("div");
      label.className = "jds-range-label";
      label.appendChild(document.createTextNode(item.label));
      if (item.sub) {
        var small = document.createElement("small");
        small.textContent = item.sub;
        label.appendChild(small);
      }

      var track = document.createElement("div");
      track.className = "jds-range-track";
      var fill = document.createElement("div");
      fill.className = "jds-range-fill" + (item.pending ? " is-pending" : "");
      var leftPct = (item.min / scaleMax) * 100;
      var widthPct = ((item.max - item.min) / scaleMax) * 100;
      fill.style.left = leftPct + "%";
      fill.style.width = widthPct + "%";
      track.appendChild(fill);
      attachTooltip(fill, item.label, item.detail || "");
      fill.tabIndex = 0;

      var value = document.createElement("div");
      value.className = "jds-range-value";
      value.textContent = "$" + item.min.toFixed(2) + "–$" + item.max.toFixed(2);

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  function renderBarChart(container, items, opts) {
    var prefix = (opts && opts.prefix) || "";
    var scaleMax = (opts && opts.max) || Math.max.apply(null, items.map(function (i) { return i.value; })) * 1.15;
    container.textContent = "";
    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "jds-bar-row";

      var label = document.createElement("div");
      label.className = "jds-bar-label";
      label.textContent = item.label;

      var trackBg = document.createElement("div");
      trackBg.className = "jds-bar-track-bg";
      var fill = document.createElement("div");
      fill.className = "jds-bar-fill" + (item.pending ? " is-pending" : "");
      fill.style.width = (item.value / scaleMax) * 100 + "%";
      trackBg.appendChild(fill);
      attachTooltip(fill, item.label, item.detail || "");
      fill.tabIndex = 0;

      var value = document.createElement("div");
      value.className = "jds-bar-value";
      value.textContent = prefix + item.value.toFixed(2);

      row.appendChild(label);
      row.appendChild(trackBg);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  function renderTable(tbody, rows, columns) {
    tbody.textContent = "";
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      columns.forEach(function (col) {
        var td = document.createElement("td");
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

  global.jds = { initThemeToggle: initThemeToggle, showTooltip: showTooltip, moveTooltip: moveTooltip, hideTooltip: hideTooltip, attachTooltip: attachTooltip, badge: badge, icon: icon, renderRangeChart: renderRangeChart, renderBarChart: renderBarChart, renderTable: renderTable };
})(window);
