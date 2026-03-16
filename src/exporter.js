export function exportAllocationToWorkbook(allocationResult, rackHeaders) {
  const { wagons } = allocationResult;

  const detailedRows = [["Wagon Number", "Store Number", "Number of Lifts", "Rack Types for that store"]];

  wagons.forEach((wagon) => {
    wagon.stores.forEach((store) => {
      detailedRows.push([
        wagon.wagonNumber,
        store.storeNumber,
        store.totalLifts,
        store.rackTypes.join(", "),
      ]);
    });
  });

  const summaryHeader = ["Wagon Number", ...rackHeaders, "Total lifts"];
  const summaryRows = [summaryHeader];

  wagons.forEach((wagon) => {
    const row = [wagon.wagonNumber];
    rackHeaders.forEach((rackType) => {
      row.push(wagon.rackTypeTotals[rackType] ?? 0);
    });
    row.push(wagon.totalLifts);
    summaryRows.push(row);
  });

  const workbook = XLSX.utils.book_new();
  const detailSheet = XLSX.utils.aoa_to_sheet(detailedRows);
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);

  XLSX.utils.book_append_sheet(workbook, detailSheet, "Detailed Allocation");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Wagon Manifest Summary");

  XLSX.writeFile(workbook, `wagon-allocation-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
