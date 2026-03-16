export function renderPreview(previewTable, stores, rackHeaders) {
  const maxRows = 20;
  const previewStores = stores.slice(0, maxRows);

  const headers = ["Store #", ...rackHeaders, "Total Lifts"];
  const thead = `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;

  const rows = previewStores
    .map((store) => {
      const rackCells = rackHeaders.map((r) => `<td>${store.rackQuantities[r] ?? 0}</td>`).join("");
      return `<tr><td>${escapeHtml(store.storeNumber)}</td>${rackCells}<td>${store.totalLifts}</td></tr>`;
    })
    .join("");

  const suffix = stores.length > maxRows ? `<caption>Showing first ${maxRows} of ${stores.length} stores.</caption>` : "";
  previewTable.innerHTML = `${thead}<tbody>${rows}</tbody>${suffix}`;
}

export function renderMessages(container, { errors = [], warnings = [] }) {
  const chunks = [];
  errors.forEach((message) => chunks.push(`<div class="msg error">${escapeHtml(message)}</div>`));
  warnings.forEach((message) => chunks.push(`<div class="msg warning">${escapeHtml(message)}</div>`));
  container.innerHTML = chunks.join("");
}

export function renderWagonResults(container, allocation) {
  const cards = allocation.wagons
    .map((wagon) => {
      const storeRows = wagon.stores.length
        ? wagon.stores
            .map(
              (store) =>
                `<tr>
                  <td>${escapeHtml(store.storeNumber)}</td>
                  <td>${store.totalLifts}</td>
                  <td>${escapeHtml(store.rackTypes.join(", ") || "-")}</td>
                </tr>`
            )
            .join("")
        : '<tr><td colspan="3">No stores allocated.</td></tr>';

      return `<article class="wagon-card">
        <header class="wagon-head">
          <strong>Wagon ${wagon.wagonNumber}</strong>
          <span class="meta">Total lifts: ${wagon.totalLifts}</span>
          <span class="meta">Rack types: ${escapeHtml(wagon.rackTypes.join(", ") || "-")}</span>
        </header>
        <div class="wagon-body">
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Store #</th>
                  <th>Lifts</th>
                  <th>Rack Types</th>
                </tr>
              </thead>
              <tbody>${storeRows}</tbody>
            </table>
          </div>
        </div>
      </article>`;
    })
    .join("");

  container.innerHTML = cards;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
