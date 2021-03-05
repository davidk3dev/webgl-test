export const CONFIG = {
    eaveWidth: {
      min: 1000,
      max: 5000,
      default: 4000
    },
    eaveHeight: {
      min: 2000,
      max: 4000,
      default: 3000
    },
    fasciaDepth: {
      min: 150,
      max: 400,
      default: 190
    },
    baySize: {
      min: 1524,
      max: 8000,
      default: 3810
    },
    span: {
      min: 1000,
      max: 8000,
      default: 4000
    },
    multiSpan: {
      min: 0,
      max: 8000,
      default: 0
    },
    height: {
      min: 1000,
      max: 5000,
      default: 2500
    },
    frontOverhang: {
      min: 100,
      max: 2000,
      default: 200
    },
    backOverhang: {
      min: 100,
      max: 2000,
      default: 200
    },
    leftOverhang: {
      min: 0,
      max: 2000,
      default: 100
    },
    rightOverhang: {
      min: 0,
      max: 2000,
      default: 100
    },
    flyOverBracketHeight: {
      min: 200,
      max: 700,
      default: 700
    },
    noOfBay: {
      min: 1,
      max: 10,
      default: 1
    },
    patiosPitch: {
      default: 2
    },
    existingRoofPitch: {
      default: 22.5
    },
    rakeCutVertical: {
      default: 0
    },
    rakeCutHorizontal: {
      default: 0
    },
    roofOverallLength: {
      min: 0,
      max: 80000,
      default: 0
    },
    roofOverallWidth: {
      min: 0,
      max: 20000,
      default: 0
    },
    minHeight: {
      min: 0,
      max: 5000,
      default: 0
    },
    existingLength: {
      min: 100,
      max: 20000,
      default: 4000
    },
    existingLength2: {
      min: 0,
      max: 20000,
      default: 0
    },
    existingWidth: {
      min: 0,
      max: 20000,
      default: 0
    },
    existingWidth2: {
      min: 0,
      max: 20000,
      default: 0
    },
  };

  export const GEOMETRY_CATEGORY = {
    PATIOS: 'PATOIS'
  };
  export const GEOMETRY_TYPE = {
    EXISTING_WALL: 'EXISTING_WALL',
    EAVE: 'EAVE',
    FASCIA: 'FASCIA',
    EXISTING_ROOF: 'EXISTING_ROOF1',
    FLY_OVER_BRACKET: 'FLY_OVER_BRACKET',
    SUPERIOR_BEAM: 'SUPERIOR_BEAM',
    SUPERIOR_POST: 'SUPERIOR_POST',
    ROOF_PANEL: 'ROOF_PANEL',
    ROOF_PANEL_BASE: 'ROOF_PANEL_BASE',
    ROOF_PANEL_BARGE_CAPPING: 'ROOF_PANEL_BARGE_CAPPING',
    GUTTER: 'GUTTER',
    GUTTER_PATIOS: 'GUTTER_PATIOS',
    ROOF_PATIOS: 'ROOF_PATIOS',
    DIMENSION: 'DIMENSION',
    DIMENSION_CAP: 'DIMENSION_CAP',
    DIMENSION_LINE: 'DIMENSION_LINE',
    DIRECTION_TEXT: 'DIRECTION_TEXT',
    DIMENSION_TEXT: 'DIMENSION_TEXT',
    MESH_OUTLINE: 'MESH_OUTLINE'
  };
  export const INIT = {
    CONNECTION_TYPE: 1,
    EXISTING_TYPE: 0,
  };
