function canAddStoreToWagon(store, wagon, maxRackTypes, canExceedRackTypeLimit) {
  if (canExceedRackTypeLimit) return true;
  const nextRackTypes = new Set([...wagon.rackTypes, ...store.rackTypes]);
  return nextRackTypes.size <= maxRackTypes;
}

function makeWagon(index) {
  return {
    wagonNumber: index + 1,
    stores: [],
    totalLifts: 0,
    rackTypes: new Set(),
    rackTypeTotals: {},
  };
}

function applyStoreToWagon(store, wagon) {
  wagon.stores.push(store);
  wagon.totalLifts += store.totalLifts;

  store.rackTypes.forEach((rackType) => wagon.rackTypes.add(rackType));
  Object.entries(store.rackQuantities).forEach(([rackType, qty]) => {
    if (qty <= 0) return;
    wagon.rackTypeTotals[rackType] = (wagon.rackTypeTotals[rackType] ?? 0) + qty;
  });
}

/**
 * Greedy allocation strategy:
 * 1) Sort stores by fewest lifts first.
 * 2) Fill each wagon sequentially.
 * 3) For each wagon, scan remaining stores and add ones that fit rack-type rules.
 * 4) Keep going until near the target lifts or no stores fit.
 * 5) If stores still remain, force them into the last wagon when the exception is enabled.
 */
export function allocateStores(stores, settings) {
  const { wagonCount, targetLifts, maxRackTypes, allowFinalExceed } = settings;
  const wagons = Array.from({ length: wagonCount }, (_, i) => makeWagon(i));

  const unallocated = [...stores].sort((a, b) => a.totalLifts - b.totalLifts);

  for (let i = 0; i < wagonCount; i += 1) {
    const wagon = wagons[i];
    const isLastWagon = i === wagonCount - 1;
    const rackLimitException = isLastWagon && allowFinalExceed;

    let madeProgress = true;
    while (unallocated.length && madeProgress) {
      madeProgress = false;

      for (let idx = 0; idx < unallocated.length; idx += 1) {
        const candidate = unallocated[idx];
        if (!canAddStoreToWagon(candidate, wagon, maxRackTypes, rackLimitException)) {
          continue;
        }

        // Prefer values close to target, but still allow overshoot if no better option exists.
        const projected = wagon.totalLifts + candidate.totalLifts;
        const wouldMoveAway = projected > targetLifts && wagon.totalLifts > 0;
        const hasSmallerOption = unallocated
          .slice(idx + 1)
          .some((s) => canAddStoreToWagon(s, wagon, maxRackTypes, rackLimitException) && s.totalLifts < candidate.totalLifts);

        if (wouldMoveAway && hasSmallerOption) continue;

        applyStoreToWagon(candidate, wagon);
        unallocated.splice(idx, 1);
        madeProgress = true;

        if (wagon.totalLifts >= targetLifts) break;
      }
    }
  }

  if (unallocated.length) {
    const lastWagon = wagons[wagons.length - 1];
    unallocated.splice(0).forEach((store) => applyStoreToWagon(store, lastWagon));
  }

  const warnings = [];
  wagons.forEach((wagon) => {
    if (!wagon.stores.length) {
      warnings.push(`Wagon ${wagon.wagonNumber} is empty.`);
      return;
    }

    if (wagon.totalLifts < targetLifts * 0.8) {
      warnings.push(`Wagon ${wagon.wagonNumber} is underfilled (${wagon.totalLifts} lifts).`);
    }
    if (wagon.totalLifts > targetLifts * 1.2) {
      warnings.push(`Wagon ${wagon.wagonNumber} is overfilled (${wagon.totalLifts} lifts).`);
    }

    if (wagon.rackTypes.size > maxRackTypes) {
      warnings.push(`Wagon ${wagon.wagonNumber} uses ${wagon.rackTypes.size} rack types (limit: ${maxRackTypes}).`);
    }
  });

  return {
    wagons: wagons.map((wagon) => ({
      ...wagon,
      rackTypes: [...wagon.rackTypes].sort(),
    })),
    warnings,
  };
}
