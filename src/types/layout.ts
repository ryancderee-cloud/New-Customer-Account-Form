export type PublishedLayoutResponse = {
  layout: {
    id: string;
    name: string;
    season: string | null;
    standTemplate: {
      id: string;
      name: string;
      backgroundImageUrl: string;
      width: number;
      height: number;
      gridColumns: number;
      gridRows: number;
    };
    cells: Array<{
      id: string;
      rowIndex: number;
      columnIndex: number;
      cellKey: string;
      xOffset: number;
      yOffset: number;
      widthAdjust: number;
      heightAdjust: number;
      zIndex: number;
      product: null | {
        id: string;
        name: string;
        sku: string;
        description: string;
        frontImageUrl: string;
        backImageUrl: string;
        category: string;
        packetSize: string | null;
      };
    }>;
  };
};
