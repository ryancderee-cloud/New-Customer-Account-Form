import { parseWorkbook } from "./parser.js";
import { allocateStores } from "./allocation.js";
import { exportAllocationToWorkbook } from "./exporter.js";
import { renderMessages, renderPreview, renderWagonResults } from "./ui.js";

const fileInput = document.getElementById("file-input");
const fileStatus = document.getElementById("file-status");
const previewWrap = document.getElementById("preview-wrap");
const previewTable = document.getElementById("preview-table");
const messages = document.getElementById("messages");
const resultsWrap = document.getElementById("results-wrap");

const wagonCountInput = document.getElementById("wagon-count");
const targetLiftsInput = document.getElementById("target-lifts");
const maxRackTypesInput = document.getElementById("max-rack-types");
const allowFinalExceedInput = document.getElementById("allow-final-exceed");

const allocateBtn = document.getElementById("allocate-btn");
const exportBtn = document.getElementById("export-btn");

const state = {
  parsed: null,
  allocation: null,
};

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  state.parsed = null;
  state.allocation = null;
  exportBtn.disabled = true;
  resultsWrap.classList.add("hidden");
  resultsWrap.innerHTML = "";
  renderMessages(messages, { errors: [], warnings: [] });

  if (!file) {
    fileStatus.textContent = "No file loaded.";
    fileStatus.className = "status muted";
    previewWrap.classList.add("hidden");
    return;
  }

  try {
    const data = await file.arrayBuffer();
    const parsed = parseWorkbook(data);

    state.parsed = parsed;
    fileStatus.textContent = `Loaded ${file.name}: ${parsed.stores.length} stores, ${parsed.rackHeaders.length} rack types.`;
    fileStatus.className = "status";

    renderPreview(previewTable, parsed.stores, parsed.rackHeaders);
    previewWrap.classList.remove("hidden");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse file.";
    fileStatus.textContent = "File parsing failed.";
    fileStatus.className = "status";
    previewWrap.classList.add("hidden");
    renderMessages(messages, { errors: [message], warnings: [] });
  }
});

allocateBtn.addEventListener("click", () => {
  if (!state.parsed) {
    renderMessages(messages, { errors: ["Please upload a valid Excel file first."], warnings: [] });
    return;
  }

  const settings = {
    wagonCount: Number(wagonCountInput.value),
    targetLifts: Number(targetLiftsInput.value),
    maxRackTypes: Number(maxRackTypesInput.value),
    allowFinalExceed: allowFinalExceedInput.checked,
  };

  const invalidNumber = Object.values(settings)
    .filter((value) => typeof value === "number")
    .some((value) => !Number.isFinite(value) || value <= 0);

  if (invalidNumber) {
    renderMessages(messages, { errors: ["Please provide valid positive allocation settings."], warnings: [] });
    return;
  }

  const allocation = allocateStores(state.parsed.stores, settings);
  state.allocation = allocation;

  renderMessages(messages, { warnings: allocation.warnings, errors: [] });
  renderWagonResults(resultsWrap, allocation);
  resultsWrap.classList.remove("hidden");
  exportBtn.disabled = false;
});

exportBtn.addEventListener("click", () => {
  if (!state.allocation || !state.parsed) return;
  exportAllocationToWorkbook(state.allocation, state.parsed.rackHeaders);
});
