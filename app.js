const years = Array.from({ length: 10 }, (_, i) => 2015 + i);

const countryBase = [
  ["USA", "United States", 2600, 3400],
  ["CHN", "China", 3600, 2800],
  ["DEU", "Germany", 1800, 1600],
  ["JPN", "Japan", 900, 980],
  ["IND", "India", 650, 780],
  ["GBR", "United Kingdom", 820, 760],
  ["FRA", "France", 770, 740],
  ["NLD", "Netherlands", 830, 790],
  ["KOR", "South Korea", 720, 690],
  ["CAN", "Canada", 710, 650],
  ["ITA", "Italy", 690, 670],
  ["BRA", "Brazil", 420, 360],
  ["AUS", "Australia", 450, 390],
  ["MEX", "Mexico", 590, 540],
  ["ESP", "Spain", 520, 500],
  ["RUS", "Russia", 510, 470],
  ["SAU", "Saudi Arabia", 390, 330],
  ["IDN", "Indonesia", 350, 320],
  ["TUR", "Turkey", 400, 350],
  ["ZAF", "South Africa", 220, 210],
  ["NGA", "Nigeria", 120, 85],
  ["ARE", "United Arab Emirates", 410, 390],
  ["SGP", "Singapore", 560, 520],
  ["CHE", "Switzerland", 480, 450],
  ["SWE", "Sweden", 300, 290],
  ["NOR", "Norway", 250, 230],
  ["ARG", "Argentina", 160, 140],
  ["EGY", "Egypt", 95, 120],
  ["PAK", "Pakistan", 80, 95],
  ["VNM", "Vietnam", 420, 400]
];

const categories = {
  exports: ["Machinery", "Electronics", "Vehicles", "Chemicals", "Metals", "Agriculture", "Energy", "Textiles", "Pharma", "Services"],
  imports: ["Electronics", "Machinery", "Energy", "Chemicals", "Vehicles", "Metals", "Food", "Textiles", "Pharma", "Services"]
};

function createCategorySplit(total, multiplier) {
  const weights = [17, 15, 13, 11, 10, 9, 8, 7, 6, 4].map((w, i) => Math.max(2, w + ((i + multiplier) % 3) - 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => Number(((w / sum) * total).toFixed(1)));
}

function buildDataset() {
  const data = {};
  years.forEach((year, yearIdx) => {
    data[year] = countryBase.map((entry, idx) => {
      const [iso3, name, impBase, expBase] = entry;
      const growth = 0.82 + yearIdx * 0.045;
      const cyclical = 1 + Math.sin((yearIdx + idx) * 0.35) * 0.035;
      const imports = Number((impBase * growth * cyclical * (1 + (idx % 5) * 0.01)).toFixed(1));
      const exports = Number((expBase * growth * cyclical * (1 + (idx % 7) * 0.008)).toFixed(1));
      return {
        iso3,
        name,
        imports,
        exports,
        balance: Number((exports - imports).toFixed(1)),
        turnover: Number((exports + imports).toFixed(1)),
        topExports: createCategorySplit(exports, idx + yearIdx),
        topImports: createCategorySplit(imports, idx + yearIdx + 2)
      };
    });
  });
  return data;
}

const dataset = buildDataset();

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const money = v => `${v < 0 ? "-" : ""}$${fmt.format(Math.abs(v))}B`;

const els = {
  countrySelect: document.getElementById("countrySelect"),
  metricSelect: document.getElementById("metricSelect"),
  yearSelect: document.getElementById("yearSelect"),
  kpiExports: document.getElementById("kpiExports"),
  kpiImports: document.getElementById("kpiImports"),
  kpiBalance: document.getElementById("kpiBalance"),
  kpiShare: document.getElementById("kpiShare"),
  countryTitle: document.getElementById("countryTitle"),
  countryMeta: document.getElementById("countryMeta"),
  leadersTable: document.getElementById("leadersTable")
};

function currentData() {
  return dataset[els.yearSelect.value];
}

function populateControls() {
  years.forEach(y => {
    const o = document.createElement("option");
    o.value = y;
    o.textContent = y;
    els.yearSelect.appendChild(o);
  });
  els.yearSelect.value = String(years[years.length - 1]);

  currentData().forEach(c => {
    const o = document.createElement("option");
    o.value = c.iso3;
    o.textContent = c.name;
    els.countrySelect.appendChild(o);
  });
  els.countrySelect.value = "USA";
}

function drawMap() {
  const data = currentData();
  const metric = els.metricSelect.value;

  const z = data.map(c => c[metric]);
  const colorscale = metric === "balance"
    ? [[0, "#ef4444"], [0.5, "#fde68a"], [1, "#22c55e"]]
    : [[0, "#1d4ed8"], [1, "#22d3ee"]];

  const trace = {
    type: "choropleth",
    locations: data.map(c => c.iso3),
    z,
    text: data.map(c => `${c.name}<br>${metric}: ${money(c[metric])}`),
    hovertemplate: "%{text}<extra></extra>",
    colorscale,
    marker: { line: { color: "#0f172a", width: 0.5 } },
    colorbar: { title: metric.toUpperCase() }
  };

  const layout = {
    margin: { l: 0, r: 0, t: 10, b: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    geo: {
      projection: { type: "natural earth" },
      bgcolor: "rgba(0,0,0,0)",
      showframe: false,
      showcoastlines: true,
      coastlinecolor: "#475569"
    }
  };

  Plotly.newPlot("worldMap", [trace], layout, { displayModeBar: false, responsive: true });

  const map = document.getElementById("worldMap");
  map.on("plotly_click", e => {
    const iso3 = e.points?.[0]?.location;
    if (!iso3) return;
    els.countrySelect.value = iso3;
    renderCountry();
  });
}

function drawCategoryChart(targetId, labels, values, color) {
  Plotly.newPlot(targetId, [{
    type: "bar",
    x: values,
    y: labels,
    orientation: "h",
    marker: { color }
  }], {
    margin: { l: 100, r: 20, t: 12, b: 28 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: { color: "#cbd5e1", title: "USD (Billions)" },
    yaxis: { color: "#cbd5e1", autorange: "reversed" }
  }, { displayModeBar: false, responsive: true });
}

function drawTrendChart(countryIso) {
  const history = years.map(year => dataset[year].find(country => country.iso3 === countryIso));
  const exportsSeries = history.map(point => point?.exports || 0);
  const importsSeries = history.map(point => point?.imports || 0);
  const balanceSeries = history.map(point => point?.balance || 0);

  Plotly.newPlot("trendChart", [
    {
      type: "scatter",
      mode: "lines+markers",
      name: "Exports",
      x: years,
      y: exportsSeries,
      line: { color: "#22c55e", width: 2.5 }
    },
    {
      type: "scatter",
      mode: "lines+markers",
      name: "Imports",
      x: years,
      y: importsSeries,
      line: { color: "#f97316", width: 2.5 }
    },
    {
      type: "scatter",
      mode: "lines+markers",
      name: "Trade Balance",
      x: years,
      y: balanceSeries,
      line: { color: "#38bdf8", width: 2.5, dash: "dot" }
    }
  ], {
    margin: { l: 52, r: 18, t: 8, b: 36 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    legend: { orientation: "h", y: 1.12, font: { color: "#cbd5e1" } },
    xaxis: { color: "#cbd5e1", title: "Year", tickmode: "linear" },
    yaxis: { color: "#cbd5e1", title: "USD (Billions)" }
  }, { displayModeBar: false, responsive: true });
}

function renderCountry() {
  const data = currentData();
  const country = data.find(c => c.iso3 === els.countrySelect.value) || data[0];
  const worldTurnover = data.reduce((sum, c) => sum + c.turnover, 0);
  const share = (country.turnover / worldTurnover) * 100;

  els.countryTitle.textContent = `${country.name} — Trade Profile (${els.yearSelect.value})`;
  els.countryMeta.textContent = `Trade turnover: ${money(country.turnover)} | Balance status: ${country.balance >= 0 ? "Surplus" : "Deficit"}`;
  els.kpiExports.textContent = money(country.exports);
  els.kpiImports.textContent = money(country.imports);
  els.kpiBalance.textContent = money(country.balance);
  els.kpiBalance.className = country.balance >= 0 ? "good" : "bad";
  els.kpiShare.textContent = `${share.toFixed(2)}%`;

  drawCategoryChart("exportsChart", categories.exports, country.topExports, "#22c55e");
  drawCategoryChart("importsChart", categories.imports, country.topImports, "#f97316");
  drawTrendChart(country.iso3);

  renderLeaders(data);
}

function renderLeaders(data) {
  const top10 = [...data].sort((a, b) => b.turnover - a.turnover).slice(0, 10);
  const rows = top10.map((c, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${c.name}</td>
      <td>${money(c.turnover)}</td>
      <td class="${c.balance >= 0 ? "good" : "bad"}">${money(c.balance)}</td>
    </tr>`).join("");

  els.leadersTable.innerHTML = `
    <table class="table">
      <thead>
        <tr><th>Rank</th><th>Country</th><th>Turnover</th><th>Balance</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function refreshAll() {
  drawMap();
  renderCountry();
}

populateControls();
refreshAll();

els.countrySelect.addEventListener("change", renderCountry);
els.metricSelect.addEventListener("change", drawMap);
els.yearSelect.addEventListener("change", () => {
  els.countrySelect.innerHTML = "";
  currentData().forEach(c => {
    const o = document.createElement("option");
    o.value = c.iso3;
    o.textContent = c.name;
    els.countrySelect.appendChild(o);
  });
  els.countrySelect.value = "USA";
  refreshAll();
});
