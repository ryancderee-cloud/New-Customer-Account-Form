export function parseWorkbook(fileData) {
  const workbook = XLSX.read(fileData, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("No worksheet found in the uploaded file.");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: null });
  if (!matrix.length || !matrix[0].length) {
    throw new Error("Worksheet is empty.");
  }

  const headerRow = matrix[0];
  const rackHeaders = headerRow.slice(1).map((h) => String(h ?? "").trim()).filter(Boolean);
  if (!rackHeaders.length) {
    throw new Error("No rack type headers found in row 1.");
  }

  const stores = [];

  for (let rowIndex = 1; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex] || [];
    const storeNumber = String(row[0] ?? "").trim();

    // Ignore blank rows; blank quantities are treated as zero.
    if (!storeNumber) continue;

    const rackQuantities = {};
    let totalLifts = 0;

    rackHeaders.forEach((rackType, rackIndex) => {
      const raw = row[rackIndex + 1];
      const parsed = Number(raw);
      const quantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      rackQuantities[rackType] = quantity;
      totalLifts += quantity;
    });

    const nonZeroRackTypes = Object.entries(rackQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([rackType]) => rackType);

    stores.push({
      storeNumber,
      rackQuantities,
      rackTypes: nonZeroRackTypes,
      totalLifts,
      sourceRow: rowIndex + 1,
    });
  }

  if (!stores.length) {
    throw new Error("No valid store rows were found in column A.");
  }

  return { stores, rackHeaders, sheetName: firstSheetName };
}
