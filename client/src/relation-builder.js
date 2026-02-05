import './styles.css';

const COLUMN_TYPES = ['id', 'boolean', 'string', 'multilinestring', 'int', 'float', 'date', 'datetime', 'time', 'relation', 'select'];

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getContrastTextColor(hexColor) {
  if (!hexColor || !hexColor.startsWith('#')) return null;
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

// Color palettes for conditional formatting
const COLOR_PALETTES = {
  pastel: {
    name: 'Pastel',
    colors: ['#ffd1dc', '#ffeeba', '#d4edda', '#d1ecf1', '#e2d4f0', '#ffe0b2', '#c8e6c9', '#bbdefb', '#f8bbd0', '#e1bee7']
  },
  vivid: {
    name: 'Vivid',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  },
  dark: {
    name: 'Dark',
    colors: ['#991b1b', '#9a3412', '#854d0e', '#166534', '#115e59', '#1e40af', '#5b21b6', '#9d174d', '#0e7490', '#3f6212']
  },
  neutral: {
    name: 'Neutral',
    colors: ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373', '#404040']
  },
  warm: {
    name: 'Warm',
    colors: ['#fde68a', '#f59e0b', '#d97706', '#b45309', '#dc2626']
  },
  cool: {
    name: 'Cool',
    colors: ['#cffafe', '#22d3ee', '#0891b2', '#0e7490', '#164e63']
  },
  danger: {
    name: 'Danger',
    colors: ['#fde047', '#f97316', '#dc2626', '#9333ea']
  },
  highlight: {
    name: 'Highlight',
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0080ff', '#8000ff']
  }
};

// Generate unique ID for relation instance
function generateUID() {
  return 'r' + Math.random().toString(36).substr(2, 9);
}

// Default rel_options (relation-level configuration, persisted in JSON)
const DEFAULT_REL_OPTIONS = {
  editable: false,
  show_multicheck: false,
  show_natural_order: false,
  show_id: true,
  show_hierarchy: false,
  hierarchy_column: 'parent',
  single_item_mode: 'dialog',
  general_view_options: ['Table', 'Cards', 'Pivot', 'Correlation', 'Diagram', 'AI', 'Saved']
};

// Sample Products JSON for quick loading
const PRODUCTS_JSON = {
  "pot": "relation",
  "name": "",
  "columns": {
    "id": "id",
    "external_ref": "string",
    "name": "string",
    "brand": "string",
    "subbrand": "string",
    "ean": "string",
    "min_stock": "int",
    "category": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [
    ['1','1','PURINA DOG Chow Adulto','Nestle','PURINA','7613036584307',10,'1'],
    ['2','2','Purina ONE Supreme Adult','Nestle','PURINA','7613036584312',10,'2'],
    ['3','3','Garden Gourmet à base de proteína vegetal','Nestle','Garden Gourmet','7613036584313',5,'3'],
    ['4','4','Tablete de Chocolate Nestlé Classic','Nestle','Nestle','7613036584314',5,'4'],
    ['5','5','Bombons Nestlé Sensations','Nestle','Nestle','7613036584315',0,'4'],
    ['6','6','Barras de Chocolate Nestlé Crunch','Nestle','Nestle','7613036584316',0,'4'],
    ['7','7','CINI MINIS Churros','Nestle','Nestle','7613036584317',5,'5'],
    ['8','8','CHEERIOS Mel 375 g','Nestle','Nestle','7613034626847',10,'5'],
    ['9','9','NESCAFÉ Classic 200 mg','Nestle','NESCAFÉ','7613035304003',10,'6'],
    ['10','10','SICAL Torrado','Nestle','SICAL','7613035304008',10,'6'],
    ['11','11','Bolero Bebida de Cevada','Nestle','Bolero','7613035304013',10,'6'],
    ['12','12','Natas Longa Vida','Nestle','Longa Vida','7613035304018',10,'7'],
    ['13','13','Iogurte grego Lindahls rico em proteína','Nestle','Lindahls','7613035304023',10,'7'],
    ['14','14','Arroz de Marisco Longa Vida','Nestle','Longa Vida','7613035304028',5,'9'],
    ['15','15','Miúdos Nutrição Infantil NAN','Nestle','NAN','7613035304033',10,'11']
  ]
};

const CATEGORIES_JSON = {
  "pot": "relation",
  "name": "",
  "columns": {
    "id": "id",
    "external_ref": "string",
    "name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": [
      "Table",
      "Cards",
      "Pivot",
      "Correlation",
      "Diagram",
      "AI",
      "Saved"
    ]
  },
  "items": [
    ['1','1','Dog Food'],
    ['2','2','Cat Food'],
    ['3','3','Vegetarian Food'],
    ['4','4','Chocolate'],
    ['5','5','Cereals'],
    ['6','6','Cofee and Beverages'],
    ['7','7','Milk and Deserts'],
    ['8','8','Clinical Nutricion'],
    ['9','9','Cooking'],
    ['10','10','Cofee machines'],
    ['11','11','Child nutrition'],
    ['12','12','Proteins and Vitamins']
  ]
};

const STOCKS_JSON = {
  "pot": "relation",
  "name": "",
  "columns": {
    "id": "id",
    "stock_date": "date",
    "distributor_id": "string",
    "distributor_name": "string",
    "postal_code": "string",
    "dist_wharehouse_id": "string",
    "wharehouse_name": "string",
    "postal_code_wharehouse": "string",
    "product_code": "string",
    "product_name": "string",
    "available_stock": "int",
    "blocked_stock": "int",
    "batch": "string",
    "batch_expiration_date": "date",
    "category": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [
    ["1","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584307","PURINA DOG Chow Adulto",23,0,"0521","25/10/2026","1"],
    ["2","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584312","Purina ONE Supreme Adult",333,0,"09467","26/10/2026","2"],
    ["3","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584313","Garden Gourmet à base de proteína vegetal",33,0,"237823","27/10/2026","3"],
    ["4","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584314","Tablete de Chocolate Nestlé Classic",33,0,"23832","28/10/2026","4"],
    ["5","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584315","Bombons Nestlé Sensations",33,0,"2732","29/10/2026","4"],
    ["6","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584316","Barras de Chocolate Nestlé Crunch",4,0,"234","30/10/2026","4"],
    ["7","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584317","CINI MINIS Churros",33,0,"123","31/10/2026","5"],
    ["8","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613034626847","CHEERIOS Mel 375 g",33,0,"123","1/11/2026","5"],
    ["9","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304003","NESCAFÉ Classic 200 mg",33,0,"3d324","2/11/2026","6"],
    ["10","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304008","SICAL Torrado",33,0,"3234x","3/11/2026","6"],
    ["11","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304013","Bolero Bebida de Cevada",33,0,"x234","4/11/2026","6"],
    ["12","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304018","Natas Longa Vida",23,0,"32x","15/11/2025","7"],
    ["13","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304023","Iogurte grego Lindahls rico em proteína",33,0,"32xc","16/11/2025","7"],
    ["14","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304028","Arroz de Marisco Longa Vida",1,0,"42234","7/11/2026","9"],
    ["15","30/9/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304033","Miúdos Nutrição Infantil NAN",10,0,"42243","8/11/2026","11"],
    ["16","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584307","PURINA DOG Chow Adulto",45,0,"0521","25/10/2026","1"],
    ["17","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584312","Purina ONE Supreme Adult",40,0,"09467","26/10/2026","2"],
    ["18","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584313","Garden Gourmet à base de proteína vegetal",9,0,"237823","27/10/2026","3"],
    ["19","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584314","Tablete de Chocolate Nestlé Classic",30,0,"23832","28/10/2026","4"],
    ["20","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584315","Bombons Nestlé Sensations",3,0,"2732","29/10/2026","4"],
    ["21","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584316","Barras de Chocolate Nestlé Crunch",3,0,"234","30/10/2026","4"],
    ["22","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584317","CINI MINIS Churros",3,0,"123","31/10/2026","5"],
    ["23","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613034626847","CHEERIOS Mel 375 g",50,0,"123","1/11/2026","5"],
    ["24","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304003","NESCAFÉ Classic 200 mg",50,0,"3d324","2/11/2026","6"],
    ["25","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304008","SICAL Torrado",25,0,"3234x","3/11/2026","6"],
    ["26","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304013","Bolero Bebida de Cevada",15,0,"x234","4/11/2026","6"],
    ["27","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304018","Natas Longa Vida",15,0,"32x","15/11/2025","7"],
    ["28","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304023","Iogurte grego Lindahls rico em proteína",13,0,"32xc","16/11/2025","7"],
    ["29","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304028","Arroz de Marisco Longa Vida",1,0,"42234","7/11/2026","9"],
    ["30","30/9/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304033","Miúdos Nutrição Infantil NAN",30,0,"3373737","8/12/2026","11"],
    ["31","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584307","PURINA DOG Chow Adulto",40,0,"0521","25/10/2026","1"],
    ["32","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584312","Purina ONE Supreme Adult",45,0,"09467","26/10/2026","2"],
    ["33","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584313","Garden Gourmet à base de proteína vegetal",6,0,"237823","27/10/2026","3"],
    ["34","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584314","Tablete de Chocolate Nestlé Classic",25,0,"23832","28/10/2026","4"],
    ["35","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584315","Bombons Nestlé Sensations",4,0,"2732","29/10/2026","4"],
    ["36","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584316","Barras de Chocolate Nestlé Crunch",4,0,"234","30/10/2026","4"],
    ["37","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613036584317","CINI MINIS Churros",10,0,"123","31/10/2026","5"],
    ["38","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613034626847","CHEERIOS Mel 375 g",8,0,"123","1/11/2026","5"],
    ["39","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304003","NESCAFÉ Classic 200 mg",9,0,"3d324","2/11/2026","6"],
    ["40","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304008","SICAL Torrado",4,0,"3234x","3/11/2026","6"],
    ["41","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304013","Bolero Bebida de Cevada",4,0,"x234","4/11/2026","6"],
    ["42","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304018","Natas Longa Vida",23,0,"32x","15/11/2025","7"],
    ["43","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304023","Iogurte grego Lindahls rico em proteína",30,0,"32xc","16/11/2025","7"],
    ["44","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304028","Arroz de Marisco Longa Vida",1,0,"42234","7/11/2026","9"],
    ["45","31/10/2025","1","Pingo doce","1000","010","AZAMBUJA","2050-275","7613035304033","Miúdos Nutrição Infantil NAN",10,0,"42243","8/11/2026","11"],
    ["46","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584307","PURINA DOG Chow Adulto",500,0,"0521","25/10/2026","1"],
    ["47","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584312","Purina ONE Supreme Adult",450,0,"09467","26/10/2026","2"],
    ["48","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584313","Garden Gourmet à base de proteína vegetal",6,0,"237823","27/10/2026","3"],
    ["49","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584314","Tablete de Chocolate Nestlé Classic",50,0,"23832","28/10/2026","4"],
    ["50","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584315","Bombons Nestlé Sensations",0,0,"2732","29/10/2026","4"],
    ["51","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584316","Barras de Chocolate Nestlé Crunch",0,0,"234","30/10/2026","4"],
    ["52","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613036584317","CINI MINIS Churros",30,0,"123","31/10/2026","5"],
    ["53","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613034626847","CHEERIOS Mel 375 g",90,0,"123","1/11/2026","5"],
    ["54","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304003","NESCAFÉ Classic 200 mg",90,0,"3d324","2/11/2026","6"],
    ["55","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304008","SICAL Torrado",50,0,"3234x","3/11/2026","6"],
    ["56","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304013","Bolero Bebida de Cevada",25,0,"x234","4/11/2026","6"],
    ["57","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304018","Natas Longa Vida",25,0,"32x","15/11/2025","7"],
    ["58","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304023","Iogurte grego Lindahls rico em proteína",23,0,"32xc","16/11/2025","7"],
    ["59","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304028","Arroz de Marisco Longa Vida",5,0,"42234","7/11/2026","9"],
    ["60","31/10/2025","1","Modelo","2000","010","AZAMBUJA","2050-522","7613035304033","Miúdos Nutrição Infantil NAN",50,0,"3373737","8/12/2026","11"],
    ["61","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584307","PURINA DOG Chow Adulto",234,0,"0521","25/10/2026","1"],
    ["62","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584312","Purina ONE Supreme Adult",243,0,"09467","26/10/2026","2"],
    ["63","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584313","Garden Gourmet à base de proteína vegetal",23,0,"237823","27/10/2026","3"],
    ["64","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584314","Tablete de Chocolate Nestlé Classic",4,0,"23832","28/10/2026","4"],
    ["65","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584315","Bombons Nestlé Sensations",0,0,"2732","29/10/2026","4"],
    ["66","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584316","Barras de Chocolate Nestlé Crunch",4,0,"234","30/10/2026","4"],
    ["67","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613036584317","CINI MINIS Churros",34,0,"123","31/10/2026","5"],
    ["68","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613034626847","CHEERIOS Mel 375 g",423,0,"123","1/11/2026","5"],
    ["69","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304003","NESCAFÉ Classic 200 mg",24,0,"3d324","2/11/2026","6"],
    ["70","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304008","SICAL Torrado",24,0,"3234x","3/11/2026","6"],
    ["71","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304013","Bolero Bebida de Cevada",21,0,"x234","4/11/2026","6"],
    ["72","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304018","Natas Longa Vida",13,0,"32x","15/11/2025","7"],
    ["73","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304023","Iogurte grego Lindahls rico em proteína",13,0,"32xc","16/11/2025","7"],
    ["74","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304028","Arroz de Marisco Longa Vida",13,0,"42234","7/11/2026","9"],
    ["75","31/10/2025","1","Modelo","2000","010","MAIA","4470-177","7613035304033","Miúdos Nutrição Infantil NAN",30,0,"3373737","8/12/2026","11"]
  ]
};

const PRICELISTS_JSON = {
  "pot": "relation",
  "name": "",
  "columns": {
    "id": "id",
    "start_date": "date",
    "end_date": "date",
    "pl_name": "string",
    "product_id": "string",
    "price": "float"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [
    ['1','1/1/2024','31/12/2024','2024','1',35.56],
    ['2','1/1/2024','31/12/2024','2024','2',66.9],
    ['3','1/1/2024','31/12/2024','2024','3',3.99],
    ['4','1/1/2024','31/12/2024','2024','4',3.99],
    ['5','1/1/2024','31/12/2024','2024','5',12.74],
    ['6','1/1/2024','31/12/2024','2024','6',2.34],
    ['7','1/1/2024','31/12/2024','2024','7',4.59],
    ['8','1/1/2024','31/12/2024','2024','8',3.99],
    ['9','1/1/2024','31/12/2024','2024','9',7.89],
    ['10','1/1/2024','31/12/2024','2024','10',5.6],
    ['11','1/1/2024','31/12/2024','2024','11',2.79],
    ['12','1/1/2024','31/12/2024','2024','12',2.3],
    ['13','1/1/2024','31/12/2024','2024','13',4.49],
    ['14','1/1/2024','31/12/2024','2024','14',14.5],
    ['15','1/1/2024','31/12/2024','2024','15',23],
    ['16','1/1/2025','31/12/2025','2025','1',36],
    ['17','1/1/2025','31/12/2025','2025','2',67.5],
    ['18','1/1/2025','31/12/2025','2025','3',4.2],
    ['19','1/1/2025','31/12/2025','2025','4',3.99],
    ['20','1/1/2025','31/12/2025','2025','5',14],
    ['21','1/1/2025','31/12/2025','2025','6',2.34],
    ['22','1/1/2025','31/12/2025','2025','7',6],
    ['23','1/1/2025','31/12/2025','2025','8',3.99],
    ['24','1/1/2025','31/12/2025','2025','9',7.89],
    ['25','1/1/2025','31/12/2025','2025','10',5.6],
    ['26','1/1/2025','31/12/2025','2025','11',3.4],
    ['27','1/1/2025','31/12/2025','2025','12',2.5],
    ['28','1/1/2025','31/12/2025','2025','13',4.99],
    ['29','1/1/2025','31/12/2025','2025','14',13.9],
    ['30','1/1/2025','31/12/2025','2025','15',24.4]
  ]
};

const USERS_JSON = {
  "pot": "relation",
  "name": "admin_user",
  "columns": {
    "ID": "id",
    "IntegrationID": "string",
    "UserName": "string",
    "Password": "string",
    "Name": "string",
    "Email": "string",
    "Phone": "string",
    "Active": "boolean",
    "LastLogin": "datetime",
    "Locale": "string",
    "PasswordDate": "datetime",
    "PasswordExpired": "boolean",
    "IsExternal": "boolean",
    "ExternalUser": "string",
    "Notes": "multilinestring",
    "UserCode": "string",
    "HasMFA": "boolean",
    "MFAKey": "string",
    "FailedAttempts": "int",
    "FailedAttemptDate": "datetime"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const AUDITLOG_JSON = {
  "pot": "relation",
  "name": "admin_auditlog",
  "columns": {
    "ID": "id",
    "CompanyID": "string",
    "UserID": "string",
    "Date": "datetime",
    "Context": "string",
    "Action": "string",
    "EndDate": "datetime",
    "Error": "multilinestring"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", ""]]
};

const COMPANY_TYPES_JSON = {
  "pot": "relation",
  "name": "company_type",
  "columns": {
    "ID": "id",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", ""]]
};

const ALL_STOCKS_JSON = {
  "pot": "relation",
  "name": "stock",
  "columns": {
    "id": "id",
    "stock_date": "date",
    "distributor_id": "string",
    "distributor_name": "string",
    "postal_code": "string",
    "dist_wharehouse_id": "string",
    "wharehouse_name": "string",
    "postal_code_wharehouse": "string",
    "product_code": "string",
    "product_name": "string",
    "available_stock": "int",
    "blocked_stock": "int",
    "batch": "string",
    "batch_expiration_date": "date",
    "category": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [
    ["1", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584307", "PURINA DOG Chow Adulto", 23, 0, "0521", "25/10/2026", "1"],
    ["2", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584312", "Purina ONE Supreme Adult", 333, 0, "09467", "26/10/2026", "2"],
    ["3", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584313", "Garden Gourmet à base de proteína vegetal", 33, 0, "237823", "27/10/2026", "3"],
    ["4", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584314", "Tablete de Chocolate Nestlé Classic", 33, 0, "23832", "28/10/2026", "4"],
    ["5", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584315", "Bombons Nestlé Sensations", 33, 0, "2732", "29/10/2026", "4"],
    ["6", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584316", "Barras de Chocolate Nestlé Crunch", 4, 0, "234", "30/10/2026", "4"],
    ["7", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584317", "CINI MINIS Churros", 33, 0, "123", "31/10/2026", "5"],
    ["8", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613034626847", "CHEERIOS Mel 375 g", 33, 0, "123", "1/11/2026", "5"],
    ["9", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304003", "NESCAFÉ Classic 200 mg", 33, 0, "3d324", "2/11/2026", "6"],
    ["10", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304008", "SICAL Torrado", 33, 0, "3234x", "3/11/2026", "6"],
    ["11", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304013", "Bolero Bebida de Cevada", 33, 0, "x234", "4/11/2026", "6"],
    ["12", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304018", "Natas Longa Vida", 23, 0, "32x", "15/11/2025", "7"],
    ["13", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304023", "Iogurte grego Lindahls rico em proteína", 33, 0, "32xc", "16/11/2025", "7"],
    ["14", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304028", "Arroz de Marisco Longa Vida", 1, 0, "42234", "7/11/2026", "9"],
    ["15", "30/9/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304033", "Miúdos Nutrição Infantil NAN", 10, 0, "42243", "8/11/2026", "11"],
    ["16", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584307", "PURINA DOG Chow Adulto", 45, 0, "0521", "25/10/2026", "1"],
    ["17", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584312", "Purina ONE Supreme Adult", 40, 0, "09467", "26/10/2026", "2"],
    ["18", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584313", "Garden Gourmet à base de proteína vegetal", 9, 0, "237823", "27/10/2026", "3"],
    ["19", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584314", "Tablete de Chocolate Nestlé Classic", 30, 0, "23832", "28/10/2026", "4"],
    ["20", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584315", "Bombons Nestlé Sensations", 3, 0, "2732", "29/10/2026", "4"],
    ["21", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584316", "Barras de Chocolate Nestlé Crunch", 3, 0, "234", "30/10/2026", "4"],
    ["22", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584317", "CINI MINIS Churros", 3, 0, "123", "31/10/2026", "5"],
    ["23", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613034626847", "CHEERIOS Mel 375 g", 50, 0, "123", "1/11/2026", "5"],
    ["24", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304003", "NESCAFÉ Classic 200 mg", 50, 0, "3d324", "2/11/2026", "6"],
    ["25", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304008", "SICAL Torrado", 25, 0, "3234x", "3/11/2026", "6"],
    ["26", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304013", "Bolero Bebida de Cevada", 15, 0, "x234", "4/11/2026", "6"],
    ["27", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304018", "Natas Longa Vida", 15, 0, "32x", "15/11/2025", "7"],
    ["28", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304023", "Iogurte grego Lindahls rico em proteína", 13, 0, "32xc", "16/11/2025", "7"],
    ["29", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304028", "Arroz de Marisco Longa Vida", 1, 0, "42234", "7/11/2026", "9"],
    ["30", "30/9/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304033", "Miúdos Nutrição Infantil NAN", 30, 0, "3373737", "8/12/2026", "11"],
    ["31", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584307", "PURINA DOG Chow Adulto", 40, 0, "0521", "25/10/2026", "1"],
    ["32", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584312", "Purina ONE Supreme Adult", 45, 0, "09467", "26/10/2026", "2"],
    ["33", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584313", "Garden Gourmet à base de proteína vegetal", 6, 0, "237823", "27/10/2026", "3"],
    ["34", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584314", "Tablete de Chocolate Nestlé Classic", 25, 0, "23832", "28/10/2026", "4"],
    ["35", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584315", "Bombons Nestlé Sensations", 4, 0, "2732", "29/10/2026", "4"],
    ["36", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584316", "Barras de Chocolate Nestlé Crunch", 4, 0, "234", "30/10/2026", "4"],
    ["37", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613036584317", "CINI MINIS Churros", 10, 0, "123", "31/10/2026", "5"],
    ["38", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613034626847", "CHEERIOS Mel 375 g", 8, 0, "123", "1/11/2026", "5"],
    ["39", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304003", "NESCAFÉ Classic 200 mg", 9, 0, "3d324", "2/11/2026", "6"],
    ["40", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304008", "SICAL Torrado", 4, 0, "3234x", "3/11/2026", "6"],
    ["41", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304013", "Bolero Bebida de Cevada", 4, 0, "x234", "4/11/2026", "6"],
    ["42", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304018", "Natas Longa Vida", 23, 0, "32x", "15/11/2025", "7"],
    ["43", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304023", "Iogurte grego Lindahls rico em proteína", 30, 0, "32xc", "16/11/2025", "7"],
    ["44", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304028", "Arroz de Marisco Longa Vida", 1, 0, "42234", "7/11/2026", "9"],
    ["45", "31/10/2025", "1", "Pingo doce", "1000", "010", "AZAMBUJA", "2050-275", "7613035304033", "Miúdos Nutrição Infantil NAN", 10, 0, "42243", "8/11/2026", "11"],
    ["46", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584307", "PURINA DOG Chow Adulto", 500, 0, "0521", "25/10/2026", "1"],
    ["47", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584312", "Purina ONE Supreme Adult", 450, 0, "09467", "26/10/2026", "2"],
    ["48", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584313", "Garden Gourmet à base de proteína vegetal", 6, 0, "237823", "27/10/2026", "3"],
    ["49", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584314", "Tablete de Chocolate Nestlé Classic", 50, 0, "23832", "28/10/2026", "4"],
    ["50", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584315", "Bombons Nestlé Sensations", 0, 0, "2732", "29/10/2026", "4"],
    ["51", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584316", "Barras de Chocolate Nestlé Crunch", 0, 0, "234", "30/10/2026", "4"],
    ["52", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613036584317", "CINI MINIS Churros", 30, 0, "123", "31/10/2026", "5"],
    ["53", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613034626847", "CHEERIOS Mel 375 g", 90, 0, "123", "1/11/2026", "5"],
    ["54", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304003", "NESCAFÉ Classic 200 mg", 90, 0, "3d324", "2/11/2026", "6"],
    ["55", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304008", "SICAL Torrado", 50, 0, "3234x", "3/11/2026", "6"],
    ["56", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304013", "Bolero Bebida de Cevada", 25, 0, "x234", "4/11/2026", "6"],
    ["57", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304018", "Natas Longa Vida", 25, 0, "32x", "15/11/2025", "7"],
    ["58", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304023", "Iogurte grego Lindahls rico em proteína", 23, 0, "32xc", "16/11/2025", "7"],
    ["59", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304028", "Arroz de Marisco Longa Vida", 5, 0, "42234", "7/11/2026", "9"],
    ["60", "31/10/2025", "1", "Modelo", "2000", "010", "AZAMBUJA", "2050-522", "7613035304033", "Miúdos Nutrição Infantil NAN", 50, 0, "3373737", "8/12/2026", "11"],
    ["61", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584307", "PURINA DOG Chow Adulto", 234, 0, "0521", "25/10/2026", "1"],
    ["62", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584312", "Purina ONE Supreme Adult", 243, 0, "09467", "26/10/2026", "2"],
    ["63", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584313", "Garden Gourmet à base de proteína vegetal", 23, 0, "237823", "27/10/2026", "3"],
    ["64", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584314", "Tablete de Chocolate Nestlé Classic", 4, 0, "23832", "28/10/2026", "4"],
    ["65", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584315", "Bombons Nestlé Sensations", 0, 0, "2732", "29/10/2026", "4"],
    ["66", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584316", "Barras de Chocolate Nestlé Crunch", 4, 0, "234", "30/10/2026", "4"],
    ["67", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613036584317", "CINI MINIS Churros", 34, 0, "123", "31/10/2026", "5"],
    ["68", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613034626847", "CHEERIOS Mel 375 g", 423, 0, "123", "1/11/2026", "5"],
    ["69", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304003", "NESCAFÉ Classic 200 mg", 24, 0, "3d324", "2/11/2026", "6"],
    ["70", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304008", "SICAL Torrado", 24, 0, "3234x", "3/11/2026", "6"],
    ["71", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304013", "Bolero Bebida de Cevada", 21, 0, "x234", "4/11/2026", "6"],
    ["72", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304018", "Natas Longa Vida", 13, 0, "32x", "15/11/2025", "7"],
    ["73", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304023", "Iogurte grego Lindahls rico em proteína", 13, 0, "32xc", "16/11/2025", "7"],
    ["74", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304028", "Arroz de Marisco Longa Vida", 13, 0, "42234", "7/11/2026", "9"],
    ["75", "31/10/2025", "1", "Modelo", "2000", "010", "MAIA", "4470-177", "7613035304033", "Miúdos Nutrição Infantil NAN", 30, 0, "3373737", "8/12/2026", "11"]
  ]
};

const DISTRIBUTOR_JSON = {
  "pot": "relation",
  "name": "distributor",
  "columns": {
    "ID": "id",
    "Name": "string",
    "InternalID": "string",
    "Street": "string",
    "City": "string",
    "PostalCode": "string",
    "Country": "string",
    "TaxNumber": "string",
    "GLNCode": "string",
    "Inactive": "boolean",
    "IntegrationCode": "string",
    "CompanyTypeID": "int",
    "StateID": "int",
    "LastUpdated": "datetime"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const ADMIN_DATA_MANAGEMENT_JSON = {
  "pot": "relation",
  "name": "admin_data_management",
  "columns": {
    "ID": "id",
    "ClientCompanyID": "int",
    "DataType": "int",
    "StartDate": "datetime",
    "OriginalLoadID": "string",
    "Source": "int",
    "EDITableID": "int",
    "HistoryID": "int",
    "FileName": "string",
    "NumberOfLines": "int"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", ""]]
};

const STOCK_IMPORTS_STATES_DETAILS_JSON = {
  "pot": "relation",
  "name": "stock_imports_states_details",
  "columns": {
    "ID": "id",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", ""]]
};

const STOCK_IMPORTS_STATES_JSON = {
  "pot": "relation",
  "name": "stock_imports_states",
  "columns": {
    "ID": "id",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", ""]]
};

const STOCK_IMPORTS_TYPES_JSON = {
  "pot": "relation",
  "name": "stock_imports_types",
  "columns": {
    "ID": "id",
    "Name": "string",
    "RoleID": "int",
    "ServiceProvider": "int",
    "Active": "boolean",
    "Template": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", ""]]
};

const STOCK_IMPORTS_DETAILS_JSON = {
  "pot": "relation",
  "name": "stock_imports_details",
  "columns": {
    "ID": "id",
    "ImportationID": "int",
    "LineNumber": "int",
    "StateID": "int",
    "MessageResult": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", ""]]
};

const STOCK_IMPORT_JSON = {
  "pot": "relation",
  "name": "stock_import",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "TypeID": "int",
    "StateID": "int",
    "OriginalFileName": "string",
    "ServerFilePath": "string",
    "CreationDate": "datetime",
    "CreationUserID": "int",
    "ProcessedDate": "string",
    "MessageResult": "textarea",
    "ProfileID": "int",
    "CompanyID": "int",
    "StartDate": "datetime",
    "EndDate": "datetime",
    "ComplexFileDetailID": "int",
    "ResultServerFilePath": "textarea"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const STOCK_WAREHOUSE_JSON = {
  "pot": "relation",
  "name": "stock_warehouse",
  "columns": {
    "ID": "id",
    "IdentifierGLNCode": "string",
    "IdentifierPostalCode": "string",
    "Name": "string",
    "AddressCity": "string",
    "AddressCountryCode": "string",
    "AddressPostalCode": "string",
    "AddressStreet": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", ""]]
};

const STOCK_HISTORIC_INVENTORY_DETAIL_JSON = {
  "pot": "relation",
  "name": "stock_historic_inventory_detail",
  "columns": {
    "ID": "id",
    "InventoryReportID": "int",
    "LineNumber": "int",
    "StandardProductCode": "string",
    "BuyersProductCode": "string",
    "SuppliersProductCode": "string",
    "ProductDescription": "string",
    "AvailableQuantityValue": "float",
    "AvailableQuantityUOMCoded": "string",
    "BlockedQuantityValue": "float",
    "BlockedQuantityUOMCoded": "string",
    "BatchNumber": "string",
    "BatchExpiryDate": "date",
    "ProductID": "int",
    "TotalQuantityValue": "float",
    "BatchLatestExpiryDate": "date",
    "CalculatedTotalValue": "float",
    "NetUnitPrice": "float",
    "WareHouseIdentifierGLNCode": "string",
    "WareHouseIdentifierPostalCode": "string",
    "WareHouseName": "string",
    "WareHouseAddressCity": "string",
    "WareHouseAddressCountryCode": "string",
    "WareHouseAddressPostalCode": "string",
    "WareHouseAddressStreet": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const STOCK_HISTORIC_INVENTORY_JSON = {
  "pot": "relation",
  "name": "stock_historic_inventory",
  "columns": {
    "ID": "id",
    "MessageID": "int",
    "MessageDate": "datetime",
    "MessageSender": "string",
    "MessageReceiver": "string",
    "InventoryReportNumber": "string",
    "InventoryReportDate": "date",
    "AgentGLNCode": "string",
    "AgentPostalCode": "string",
    "AgentName": "string",
    "AgentAddressStreet": "string",
    "AgentAddressCity": "string",
    "AgentAddressPostalCode": "string",
    "AgentAddressCountryCode": "string",
    "NumberOfLines": "int",
    "ImportDate": "datetime",
    "SuplierGLNCode": "string",
    "SupplierName": "string",
    "InventoryReportYear": "string",
    "InventoryReportMonth": "string",
    "AgentID": "int",
    "SupplierID": "int"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const STOCK_INVENTORY_DETAIL_JSON = {
  "pot": "relation",
  "name": "stock_inventory_detail",
  "columns": {
    "ID": "id",
    "RAWInventoryReportID": "int",
    "LineNumber": "int",
    "StandardProductCode": "string",
    "BuyersProductCode": "string",
    "SuppliersProductCode": "string",
    "ProductDescription": "string",
    "AvailableQuantityValue": "float",
    "AvailableQuantityUOMCoded": "string",
    "BlockedQuantityValue": "float",
    "BlockedQuantityUOMCoded": "string",
    "BatchNumber": "string",
    "BatchExpiryDate": "date",
    "ErrorDescription": "textarea",
    "ErrorCode": "int",
    "StateID": "int",
    "HistoryID": "int",
    "WareHouseIdentifierGLNCode": "string",
    "WareHouseIdentifierPostalCode": "string",
    "WareHouseName": "string",
    "WareHouseAddressCity": "string",
    "WareHouseAddressCountryCode": "string",
    "WareHouseAddressPostalCode": "string",
    "WareHouseAddressStreet": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const STOCK_INVENTORY_JSON = {
  "pot": "relation",
  "name": "stock_inventory",
  "columns": {
    "ID": "id",
    "MessageID": "int",
    "MessageDate": "datetime",
    "MessageSender": "string",
    "MessageReceiver": "string",
    "InventoryReportNumber": "string",
    "InventoryReportDate": "date",
    "AgentGLNCode": "string",
    "AgentPostalCode": "string",
    "AgentName": "string",
    "AgentAddressStreet": "string",
    "AgentAddressCity": "string",
    "AgentAddressPostalCode": "string",
    "AgentAddressCountryCode": "string",
    "NumberOfLines": "int",
    "ErrorDescription": "textarea",
    "ErrorCode": "int",
    "ImportDate": "datetime",
    "SuplierGLNCode": "string",
    "SupplierName": "string",
    "InventoryReportYear": "string",
    "InventoryReportMonth": "string",
    "StateID": "int"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const CATALOG_PRODUCT_CONVERSIONS_JSON = {
  "pot": "relation",
  "name": "company_product_catalog_conversion",
  "columns": {
    "ID": "id",
    "CatalogProductID": "int",
    "ProductConversion": "float",
    "PartnerID": "int",
    "ClientProductID": "string",
    "Updated": "boolean",
    "StartDate": "datetime",
    "EndDate": "datetime"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", ""]]
};

const PRODUCT_CATALOG_JSON = {
  "pot": "relation",
  "name": "company_product_catalog",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "Name": "string",
    "BeginDate": "date",
    "EndDate": "date",
    "IntegrationID": "string",
    "LastUpdated": "datetime"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", ""]]
};

const PRICELIST_PARTNER_JSON = {
  "pot": "relation",
  "name": "pricelist_partner",
  "columns": {
    "ID": "id",
    "PriceListID": "int",
    "PartnerID": "int"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", ""]]
};

const PRICELIST_PRODUCTS_JSON = {
  "pot": "relation",
  "name": "pricelist_product",
  "columns": {
    "ID": "id",
    "PriceListID": "int",
    "ProductID": "int",
    "NetUnitPrice": "float",
    "LastUpdated": "datetime",
    "Discount": "float"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", ""]]
};

const ALL_PRICELISTS_JSON = {
  "pot": "relation",
  "name": "pricelist",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "Name": "string",
    "BeginDate": "date",
    "EndDate": "date",
    "IntegrationID": "string",
    "DefaultPriceList": "boolean"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", ""]]
};

const PRODUCT_BRANDS_JSON = {
  "pot": "relation",
  "name": "company_product_brand",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "Url": "string",
    "ParentID": "int",
    "IntegrationID": "string",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "ParentID",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", ""]]
};

const PRODUCT_SPECIES_JSON = {
  "pot": "relation",
  "name": "company_product_specie",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "IntegrationID": "string",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", ""]]
};

const PRODUCT_FAMILIES_JSON = {
  "pot": "relation",
  "name": "company_product_family",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "Level": "int",
    "ParentID": "int",
    "IntegrationID": "string",
    "Name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "ParentID",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", ""]]
};

const PRODUCT_CATEGORY_JSON = {
  "pot": "relation",
  "name": "product_category",
  "columns": {
    "id": "id",
    "external_ref": "string",
    "name": "string"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [
    ['1','1','Dog Food'],
    ['2','2','Cat Food'],
    ['3','3','Vegetarian Food'],
    ['4','4','Chocolate'],
    ['5','5','Cereals'],
    ['6','6','Cofee and Beverages'],
    ['7','7','Milk and Deserts'],
    ['8','8','Clinical Nutricion'],
    ['9','9','Cooking'],
    ['10','10','Cofee machines'],
    ['11','11','Child nutrition'],
    ['12','12','Proteins and Vitamins']
  ]
};

const ALL_PRODUCTS_JSON = {
  "pot": "relation",
  "name": "product",
  "columns": {
    "ID": "id",
    "OwnerID": "int",
    "IntegrationID": "string",
    "StandardCode": "string",
    "Name": "string",
    "ProductCategoryID": "int",
    "NetUnitPrice": "float",
    "Notes": "textarea",
    "UOMCode": "string",
    "VATRate": "float",
    "MinimumQuantity": "float",
    "QuantityIncrement": "float",
    "PackSize": "int",
    "ShortName": "string",
    "Presentation": "string",
    "LastUpdated": "datetime",
    "IsActive": "boolean",
    "IsDeprecated": "boolean",
    "ProductFamilyID": "int",
    "ProductSpecieID": "int",
    "ProductBrandID": "int",
    "GLNCode": "string",
    "Countries": "string",
    "IsSeasonItem": "boolean",
    "IsPromotionItem": "boolean",
    "PromotionType": "string",
    "NoPromotionIGTIN": "string",
    "CurrencyCode": "string",
    "StartAvailabilityDate": "date",
    "EndAvailabilityDate": "date",
    "IsBuy": "boolean",
    "IsSale": "boolean",
    "NetUnitBuyPrice": "float",
    "BuyCurrencyCode": "string",
    "VatID": "string",
    "VatExemptReasonID": "string",
    "MinimumStockQuantity": "float",
    "MaximumStockQuantity": "float",
    "InfoHTML": "string",
    "Doses": "int"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

const ALL_COMPANIES_JSON = {
  "pot": "relation",
  "name": "company",
  "columns": {
    "ID": "id",
    "Name": "string",
    "InternalID": "string",
    "Street": "string",
    "City": "string",
    "PostalCode": "string",
    "Country": "string",
    "TaxNumber": "string",
    "GLNCode": "string",
    "Inactive": "boolean",
    "IntegrationCode": "string",
    "CompanyTypeID": "int",
    "StateID": "int",
    "LastUpdated": "datetime"
  },
  "options": {
    "relation.single_item_mode": {
      "dialog": "dialog",
      "right": "right",
      "bottom": "bottom"
    }
  },
  "rel_options": {
    "editable": false,
    "show_multicheck": true,
    "show_natural_order": true,
    "show_id": true,
    "show_hierarchy": true,
    "hierarchy_column": "parent",
    "single_item_mode": "dialog",
    "general_view_options": ["Table", "Cards", "Pivot", "Correlation", "Diagram", "AI", "Saved"]
  },
  "items": [["", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
};

// Default uiState (UI state stored inside rel_options.uiState, persisted in JSON)
const DEFAULT_UI_STATE = {
  currentView: 'table',
  pageSize: 5,
  currentPage: 1,
  manualResizeHeight: null,
  cardsPageSize: 12,
  cardsCurrentPage: 1,
  selectedRows: [],        // Array for JSON serialization (converted to Set at runtime)
  highlightedRow: null,    // Currently highlighted/focused row index
  sortCriteria: [],
  filters: {},
  formatting: {},
  groupByColumns: [],
  groupedData: null,
  expandedGroups: [],      // Array for JSON serialization (converted to Set at runtime)
  groupBySelectedValues: {},
  selectedColumns: [],     // Array for JSON serialization (converted to Set at runtime)
  pivotConfig: { rowColumn: null, colColumn: null, values: [] },
  diagramNodes: [],
  filteredIndices: [],
  sortedIndices: []
};

// Initialize uiState on a relation (ensures defaults exist)
function initializeUiState(relation) {
  if (!relation.rel_options) {
    relation.rel_options = { ...DEFAULT_REL_OPTIONS };
  }
  if (!relation.rel_options.uiState) {
    relation.rel_options.uiState = { ...DEFAULT_UI_STATE };
  } else {
    // Merge with defaults for any missing properties
    relation.rel_options.uiState = { ...DEFAULT_UI_STATE, ...relation.rel_options.uiState };
  }
  return relation;
}

// Serialize filters object (convert Sets in filters to Arrays)
function serializeFilters(filters) {
  if (!filters) return {};
  const result = {};
  for (const [key, filter] of Object.entries(filters)) {
    if (filter && filter.type === 'indices' && filter.indices instanceof Set) {
      result[key] = { ...filter, indices: Array.from(filter.indices) };
    } else {
      result[key] = filter;
    }
  }
  return result;
}

// Deserialize filters object (convert Arrays in filters back to Sets)
function deserializeFilters(filters) {
  if (!filters) return {};
  const result = {};
  for (const [key, filter] of Object.entries(filters)) {
    if (filter && filter.type === 'indices' && Array.isArray(filter.indices)) {
      result[key] = { ...filter, indices: new Set(filter.indices) };
    } else {
      result[key] = filter;
    }
  }
  return result;
}

// Convert uiState Sets to Arrays for JSON serialization
// Note: groupedData is runtime-computed and excluded from serialization
function serializeUiState(uiState) {
  return {
    ...uiState,
    selectedRows: uiState.selectedRows instanceof Set ? Array.from(uiState.selectedRows) : uiState.selectedRows,
    expandedGroups: uiState.expandedGroups instanceof Set ? Array.from(uiState.expandedGroups) : uiState.expandedGroups,
    selectedColumns: uiState.selectedColumns instanceof Set ? Array.from(uiState.selectedColumns) : uiState.selectedColumns,
    filters: serializeFilters(uiState.filters),
    // Exclude runtime-computed data that cannot be serialized (Map, computed indices)
    groupedData: null,
    filteredIndices: [],
    sortedIndices: []
  };
}

// Convert uiState Arrays back to Sets for runtime use
function deserializeUiState(uiState) {
  return {
    ...uiState,
    selectedRows: new Set(Array.isArray(uiState.selectedRows) ? uiState.selectedRows : []),
    expandedGroups: new Set(Array.isArray(uiState.expandedGroups) ? uiState.expandedGroups : []),
    selectedColumns: new Set(Array.isArray(uiState.selectedColumns) ? uiState.selectedColumns : []),
    filters: deserializeFilters(uiState.filters),
    // Runtime-computed data will be recalculated on render
    groupedData: null,
    filteredIndices: [],
    sortedIndices: []
  };
}

// Global relations registry - array of all active relation instances
const relationsRegistry = [];

// Register a relation instance
function registerRelation(instance) {
  const existing = relationsRegistry.findIndex(r => r.uid === instance.uid);
  if (existing >= 0) {
    relationsRegistry[existing] = instance;
  } else {
    relationsRegistry.push(instance);
  }
}

// Unregister a relation instance
function unregisterRelation(uid) {
  const index = relationsRegistry.findIndex(r => r.uid === uid);
  if (index >= 0) {
    relationsRegistry.splice(index, 1);
  }
}

// Find a relation instance by uid
function findRelation(uid) {
  return relationsRegistry.find(r => r.uid === uid);
}

// Factory function to create a new relation state (instance-level, not persisted)
function createRelationState() {
  return {
    uid: generateUID(),
    container: null,
    relation: null,            // Reference to the relation data (contains rel_options.uiState)
    columnNames: [],
    columnTypes: [],
    options: {},
    rel_options: { ...DEFAULT_REL_OPTIONS, uiState: deserializeUiState({ ...DEFAULT_UI_STATE }) },
    // Runtime-only properties (not persisted)
    cardsResizeObserver: null
  };
}

// Accessor: get uiState from state (with Set hydration)
function getUiState(st) {
  if (!st.rel_options) st.rel_options = { ...DEFAULT_REL_OPTIONS };
  if (!st.rel_options.uiState) {
    st.rel_options.uiState = deserializeUiState({ ...DEFAULT_UI_STATE });
  }
  return st.rel_options.uiState;
}

// Accessor shortcuts for commonly used uiState properties
function getSelectedRows(st) { return getUiState(st).selectedRows; }
function setSelectedRows(st, value) { getUiState(st).selectedRows = value instanceof Set ? value : new Set(value); }
function getSortCriteria(st) { return getUiState(st).sortCriteria; }
function setSortCriteria(st, value) { getUiState(st).sortCriteria = value; }
function getFilters(st) { return getUiState(st).filters; }
function setFilters(st, value) { getUiState(st).filters = value; }
function getFormatting(st) { return getUiState(st).formatting; }
function setFormatting(st, value) { getUiState(st).formatting = value; }
function getGroupByColumns(st) { return getUiState(st).groupByColumns; }
function setGroupByColumns(st, value) { getUiState(st).groupByColumns = value; }
function getGroupedData(st) { return getUiState(st).groupedData; }
function setGroupedData(st, value) { getUiState(st).groupedData = value; }
function getExpandedGroups(st) { return getUiState(st).expandedGroups; }
function setExpandedGroups(st, value) { getUiState(st).expandedGroups = value instanceof Set ? value : new Set(value); }
function getGroupBySelectedValues(st) { return getUiState(st).groupBySelectedValues; }
function setGroupBySelectedValues(st, value) { getUiState(st).groupBySelectedValues = value; }
function getSelectedColumns(st) { return getUiState(st).selectedColumns; }
function setSelectedColumns(st, value) { getUiState(st).selectedColumns = value instanceof Set ? value : new Set(value); }
function getPivotConfig(st) { return getUiState(st).pivotConfig; }
function setPivotConfig(st, value) { getUiState(st).pivotConfig = value; }
function getDiagramNodes(st) { return getUiState(st).diagramNodes; }
function setDiagramNodes(st, value) { getUiState(st).diagramNodes = value; }
function getFilteredIndices(st) { return getUiState(st).filteredIndices; }
function setFilteredIndices(st, value) { getUiState(st).filteredIndices = value; }
function getSortedIndices(st) { return getUiState(st).sortedIndices; }
function setSortedIndices(st, value) { getUiState(st).sortedIndices = value; }
function getCurrentView(st) { return getUiState(st).currentView; }
function setCurrentView(st, value) { getUiState(st).currentView = value; }
function getPageSize(st) { return getUiState(st).pageSize; }
function setPageSize(st, value) { getUiState(st).pageSize = value; }
function getCurrentPage(st) { return getUiState(st).currentPage; }
function setCurrentPage(st, value) { getUiState(st).currentPage = value; }
function getManualResizeHeight(st) { return getUiState(st).manualResizeHeight; }
function setManualResizeHeight(st, value) { getUiState(st).manualResizeHeight = value; }
function getCardsPageSize(st) { return getUiState(st).cardsPageSize; }
function setCardsPageSize(st, value) { getUiState(st).cardsPageSize = value; }
function getCardsCurrentPage(st) { return getUiState(st).cardsCurrentPage; }
function setCardsCurrentPage(st, value) { getUiState(st).cardsCurrentPage = value; }
function getHighlightedRow(st) { return getUiState(st).highlightedRow; }
function setHighlightedRow(st, value) { getUiState(st).highlightedRow = value; }

// Global state for main relation (backwards compatibility)
let state = createRelationState();

// Map to store all relation instances (legacy, use relationsRegistry instead)
const relationInstances = new Map();

// Helper function to get the relation container for a state
function getRelationContainer(st) {
  if (st.container) return st.container;
  return document.querySelector('.relation_' + st.uid);
}

// Helper function to query elements within a relation container
function el(selector, st = state) {
  const container = getRelationContainer(st);
  if (!container) return null;
  return container.querySelector(selector);
}

// Helper function to query all elements within a relation container
function elAll(selector, st = state) {
  const container = getRelationContainer(st);
  if (!container) return [];
  return container.querySelectorAll(selector);
}

// Helper function to get the detail panel for a relation instance
function getDetailPanel(st = state) {
  return el('.relation-detail-panel', st);
}

// Helper function to update the flex wrapper state based on detail panel content
// Call this after adding/removing content to the detail panel
function updateDetailPanelState(st = state) {
  const wrapper = el('.relation-flex-wrapper', st);
  const detailPanel = getDetailPanel(st);
  if (!wrapper || !detailPanel) return;
  
  if (detailPanel.children.length > 0 || detailPanel.textContent.trim()) {
    wrapper.classList.add('has-detail');
  } else {
    wrapper.classList.remove('has-detail');
  }
}

// Helper function to check if hierarchy should be shown
// Returns true only if show_hierarchy is true AND the hierarchy_column exists
function shouldShowHierarchy(st) {
  if (!st.rel_options.show_hierarchy) return false;
  const hierarchyColumn = st.rel_options.hierarchy_column;
  if (!hierarchyColumn) return false;
  return st.columnNames.includes(hierarchyColumn);
}

function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomValue(type, nestedRelationSchema = null) {
  switch (type) {
    case 'boolean':
      return Math.random() > 0.5;
    case 'string':
      const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
      return names[Math.floor(Math.random() * names.length)] + '_' + generateRandomString(4);
    case 'multilinestring':
      const lines = Math.floor(Math.random() * 3) + 1;
      let text = '';
      for (let i = 0; i < lines; i++) {
        text += 'Line ' + (i + 1) + ': ' + generateRandomString(12) + '\n';
      }
      return text.trim();
    case 'int':
      return Math.floor(Math.random() * 1000) - 500;
    case 'float':
      return parseFloat((Math.random() * 1000 - 500).toFixed(3));
    case 'date':
      const d = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      return d.toISOString().split('T')[0];
    case 'datetime':
      const dt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      return dt.toISOString().replace('T', ' ').substring(0, 19);
    case 'time':
      const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      return `${h}:${m}:${s}`;
    case 'relation':
      if (nestedRelationSchema) {
        const defaultCounter = { value: 1 };
        return generateNestedRelation(nestedRelationSchema, defaultCounter);
      }
      return null;
    default:
      return null;
  }
}

function generateNestedRelation(schema, idCounter) {
  const numRows = Math.floor(Math.random() * 4) + 1; // 1-4 rows
  const columnNames = Object.keys(schema.columns);
  const columnTypes = Object.values(schema.columns);
  const items = [];
  
  for (let i = 0; i < numRows; i++) {
    const row = columnTypes.map((type, idx) => {
      const colName = columnNames[idx];
      if (type === 'id' || colName === 'id') {
        return String(idCounter.value++);
      }
      if (Math.random() < 0.1) return null; // 10% nulls
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    columns: schema.columns,
    options: schema.options || {},
    rel_options: { ...DEFAULT_REL_OPTIONS },
    items: items
  };
}

function generateDemoRelation() {
  // Define nested relation schemas (consistent across all rows)
  const ordersSchema = {
    columns: {
      id: 'id',
      product: 'string',
      quantity: 'int',
      price: 'float'
    }
  };
  
  const tagsSchema = {
    columns: {
      id: 'id',
      tag_name: 'string',
      priority: 'int'
    }
  };
  
  const columns = {
    id: 'id',
    name: 'string',
    country: 'select',
    active: 'boolean',
    score: 'float',
    birth_date: 'date',
    created_at: 'datetime',
    start_time: 'time',
    notes: 'multilinestring',
    orders: 'relation',
    tags: 'relation'
  };
  
  const ordersIdCounter = { value: 1 };
  const tagsIdCounter = { value: 1 };
  
  const options = {
    country: {
      pt: '🇵🇹 Portugal',
      es: '🇪🇸 España',
      fr: '🇫🇷 France',
      de: '🇩🇪 Deutschland',
      it: '🇮🇹 Italia',
      uk: '🇬🇧 United Kingdom',
      us: '🇺🇸 United States',
      br: '🇧🇷 Brasil',
      jp: '🇯🇵 Japan',
      cn: '🇨🇳 China'
    },
    'relation.single_item_mode': {
      dialog: 'dialog',
      right: 'right',
      bottom: 'bottom'
    }
  };
  
  const rel_options = {
    editable: false,
    show_multicheck: true,
    show_natural_order: true,
    show_id: true,
    show_hierarchy: true,
    hierarchy_column: 'parent',
    single_item_mode: 'dialog',
    general_view_options: ['Table', 'Cards', 'Pivot', 'Correlation', 'Diagram', 'AI', 'Saved']
  };
  
  const countryKeys = Object.keys(options.country);
  
  const columnKeys = Object.keys(columns);
  const columnTypes = Object.values(columns);
  const items = [];
  
  for (let i = 0; i < 50; i++) {
    const row = columnTypes.map((type, idx) => {
      const colName = columnKeys[idx];
      if (colName === 'id') return String(i + 1);
      if (Math.random() < 0.05) return null; // 5% nulls
      
      // Handle nested relations with their schemas
      if (type === 'relation') {
        if (colName === 'orders') {
          return generateNestedRelation(ordersSchema, ordersIdCounter);
        } else if (colName === 'tags') {
          return generateNestedRelation(tagsSchema, tagsIdCounter);
        }
      }
      
      // Handle select type
      if (type === 'select' && colName === 'country') {
        return countryKeys[Math.floor(Math.random() * countryKeys.length)];
      }
      
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    name: '',
    columns: columns,
    options: options,
    rel_options: rel_options,
    items: items
  };
}

function parseRelation(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.pot !== 'relation') {
      throw new Error('Invalid relation: pot must be "relation"');
    }
    if (typeof data.columns !== 'object' || data.columns === null) {
      throw new Error('Invalid relation: columns must be an object');
    }
    if (!Array.isArray(data.items)) {
      throw new Error('Invalid relation: items must be an array');
    }
    
    // Apply default rel_options if not present or incomplete
    const parsedRelOptions = data.rel_options || {};
    data.rel_options = {
      editable: parsedRelOptions.editable ?? DEFAULT_REL_OPTIONS.editable,
      show_multicheck: parsedRelOptions.show_multicheck ?? DEFAULT_REL_OPTIONS.show_multicheck,
      show_natural_order: parsedRelOptions.show_natural_order ?? DEFAULT_REL_OPTIONS.show_natural_order,
      show_id: parsedRelOptions.show_id ?? DEFAULT_REL_OPTIONS.show_id,
      show_hierarchy: parsedRelOptions.show_hierarchy ?? DEFAULT_REL_OPTIONS.show_hierarchy,
      hierarchy_column: parsedRelOptions.hierarchy_column ?? DEFAULT_REL_OPTIONS.hierarchy_column,
      single_item_mode: parsedRelOptions.single_item_mode ?? DEFAULT_REL_OPTIONS.single_item_mode,
      general_view_options: parsedRelOptions.general_view_options ?? [...DEFAULT_REL_OPTIONS.general_view_options]
    };
    
    // Ensure options exists
    if (!data.options) {
      data.options = {};
    }
    
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Filtering functions
function applyFilters(st = state) {
  const items = st.relation.items;
  const filteredIndices = [];
  
  for (let i = 0; i < items.length; i++) {
    let passes = true;
    
    for (const [colIdxStr, filter] of Object.entries(getFilters(st))) {
      const colIdx = parseInt(colIdxStr);
      const value = items[i][colIdx];
      
      if (filter.type === 'indices') {
        if (!filter.indices.has(i)) {
          passes = false;
          break;
        }
      } else if (filter.type === 'values') {
        // Handle null values comparison
        const matches = filter.values.some(v => {
          if (v === null) return value === null;
          if (value === null) return false;
          return String(v) === String(value);
        });
        if (!matches) {
          passes = false;
          break;
        }
      } else if (filter.type === 'criteria') {
        if (!matchesCriteria(value, filter.criteria, colIdx, st)) {
          passes = false;
          break;
        }
      }
    }
    
    // Also check group by selected values
    if (passes) {
      for (const [colIdxStr, selectedValue] of Object.entries(getGroupBySelectedValues(st))) {
        const colIdx = parseInt(colIdxStr);
        const value = items[i][colIdx];
        // Compare with proper null handling
        if (selectedValue === null) {
          if (value !== null) {
            passes = false;
            break;
          }
        } else if (value === null || String(value) !== String(selectedValue)) {
          passes = false;
          break;
        }
      }
    }
    
    if (passes) {
      filteredIndices.push(i);
    }
  }
  setFilteredIndices(st, filteredIndices);
}

function getUniqueValuesForColumn(colIdx, st = state) {
  const values = new Set();
  st.relation.items.forEach(row => {
    values.add(row[colIdx]);
  });
  return Array.from(values).sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    return String(a).localeCompare(String(b));
  });
}

function matchesCriteria(value, criteria, colIdx, st = state) {
  const type = st.columnTypes[colIdx];
  
  if (criteria.nullOnly) {
    return value === null || value === undefined;
  }
  if (criteria.notNull) {
    return value !== null && value !== undefined;
  }
  if (criteria.top !== undefined) {
    return true; // Handled in sorting
  }
  if (criteria.min !== undefined && value < criteria.min) return false;
  if (criteria.max !== undefined && value > criteria.max) return false;
  if (criteria.contains && typeof value === 'string') {
    return value.toLowerCase().includes(criteria.contains.toLowerCase());
  }
  
  // Text criteria operators for string columns
  if (criteria.textOp) {
    if (value === null || value === undefined) return false;
    const strValue = String(value);
    const searchValue = criteria.textValue || '';
    const caseSensitive = criteria.caseSensitive;
    
    const compareStr = caseSensitive ? strValue : strValue.toLowerCase();
    const compareSearch = caseSensitive ? searchValue : searchValue.toLowerCase();
    
    switch (criteria.textOp) {
      case 'includes':
        return compareStr.includes(compareSearch);
      case 'equals':
        return compareStr === compareSearch;
      case 'startsWith':
        return compareStr.startsWith(compareSearch);
      case 'endsWith':
        return compareStr.endsWith(compareSearch);
      case 'regex':
        try {
          const regex = new RegExp(searchValue, caseSensitive ? '' : 'i');
          return regex.test(strValue);
        } catch {
          return false;
        }
      default:
        return true;
    }
  }
  
  // Comparison operators for numeric and date/time types
  if (criteria.comparison) {
    if (value === null || value === undefined) return false;
    
    let numValue = value;
    let compValue = criteria.value;
    let compValue2 = criteria.value2;
    
    // Convert to comparable numbers
    if (type === 'int' || type === 'float') {
      numValue = Number(value);
      compValue = Number(compValue);
      if (compValue2 !== undefined) compValue2 = Number(compValue2);
    } else if (type === 'date' || type === 'datetime') {
      numValue = new Date(value).getTime();
      compValue = new Date(compValue).getTime();
      if (compValue2 !== undefined) compValue2 = new Date(compValue2).getTime();
    } else if (type === 'time') {
      numValue = parseTimeToMs(value);
      compValue = parseTimeToMs(compValue);
      if (compValue2 !== undefined) compValue2 = parseTimeToMs(compValue2);
    }
    
    switch (criteria.comparison) {
      case 'eq': return numValue === compValue;
      case 'neq': return numValue !== compValue;
      case 'gt': return numValue > compValue;
      case 'gte': return numValue >= compValue;
      case 'lt': return numValue < compValue;
      case 'lte': return numValue <= compValue;
      case 'between': return numValue >= compValue && numValue <= compValue2;
      default: return true;
    }
  }
  
  return true;
}

function parseTimeToMs(timeStr) {
  const parts = String(timeStr).split(':').map(Number);
  if (parts.length >= 2) {
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  return 0;
}

// Sorting functions
function applySorting(st = state) {
  const sortedIndices = [...getFilteredIndices(st)];
  
  if (getSortCriteria(st).length === 0) {
    setSortedIndices(st, sortedIndices);
    return;
  }
  
  sortedIndices.sort((a, b) => {
    const rowA = st.relation.items[a];
    const rowB = st.relation.items[b];
    
    for (const criterion of getSortCriteria(st)) {
      const valA = rowA[criterion.column];
      const valB = rowB[criterion.column];
      
      let cmp = compareValues(valA, valB, st.columnTypes[criterion.column]);
      if (criterion.direction === 'desc') cmp = -cmp;
      
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
  setSortedIndices(st, sortedIndices);
}

function compareValues(a, b, type) {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  
  if (type === 'int' || type === 'float') {
    return a - b;
  }
  if (type === 'boolean') {
    return (a ? 1 : 0) - (b ? 1 : 0);
  }
  if (type === 'date' || type === 'datetime' || type === 'time') {
    return String(a).localeCompare(String(b));
  }
  return String(a).localeCompare(String(b));
}

// Categorical Histogram SVG Generator
function generateCategoricalHistogramSVG(stats, colName) {
  if (!stats.freqTableDesc || stats.freqTableDesc.length === 0) return '';
  
  const colOptions = state.options[colName] || {};
  const data = stats.freqTableDesc;
  const maxCount = Math.max(...data.map(d => d.count));
  
  const barHeight = 24;
  const labelWidth = 200;
  const barMaxWidth = 280;
  const padding = { top: 10, bottom: 10, left: 10, right: 50 };
  const width = labelWidth + barMaxWidth + padding.left + padding.right;
  const height = data.length * barHeight + padding.top + padding.bottom;
  
  let svg = `<svg width="100%" viewBox="0 0 ${width} ${height}" class="histogram-svg" preserveAspectRatio="xMinYMin meet">`;
  
  data.forEach((item, i) => {
    const y = padding.top + i * barHeight;
    const barWidth = (item.count / maxCount) * barMaxWidth;
    const label = colOptions[item.key] || item.key;
    
    // Bar
    svg += `<rect x="${padding.left + labelWidth}" y="${y + 2}" width="${barWidth}" height="${barHeight - 4}" fill="rgba(74, 144, 226, 0.6)" rx="2"/>`;
    
    // Label (truncate only if very long)
    const displayLabel = label.length > 30 ? label.substring(0, 27) + '...' : label;
    svg += `<text x="${padding.left + labelWidth - 5}" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="11" fill="#333"><title>${label}</title>${displayLabel}</text>`;
    
    // Count
    svg += `<text x="${padding.left + labelWidth + barWidth + 4}" y="${y + barHeight/2 + 4}" text-anchor="start" font-size="10" fill="#666">${item.count}</text>`;
  });
  
  svg += `</svg>`;
  
  return `<div class="histogram-container">${svg}</div>`;
}

// Generate combined frequency table HTML for select type (both asc and desc cumulative)
function generateFrequencyTableHTML(stats, colName) {
  const colOptions = state.options[colName] || {};
  const descData = stats.freqTableDesc;
  
  if (!descData || descData.length === 0) return '';
  
  let html = `<table class="freq-table">
    <thead>
      <tr>
        <th>Value</th>
        <th>n</th>
        <th>%</th>
        <th>Cum↓ n</th>
        <th>Cum↓ %</th>
        <th>Cum↑ n</th>
        <th>Cum↑ %</th>
      </tr>
    </thead>
    <tbody>`;
  
  descData.forEach(item => {
    const label = colOptions[item.key] || item.key;
    const displayLabel = label.length > 12 ? label.substring(0, 10) + '...' : label;
    html += `<tr>
      <td title="${label}">${displayLabel}</td>
      <td>${item.count}</td>
      <td>${item.percent}%</td>
      <td>${item.cumCount}</td>
      <td>${item.cumPercent}%</td>
      <td>${item.cumAscCount ?? '—'}</td>
      <td>${item.cumAscPercent ?? '—'}%</td>
    </tr>`;
  });
  
  html += `</tbody></table>`;
  return html;
}

// Boolean Histogram SVG Generator
function generateBooleanHistogramSVG(stats) {
  if (!stats.freqTableDesc || stats.freqTableDesc.length === 0) return '';
  
  const data = stats.freqTableDesc;
  const maxCount = Math.max(...data.map(d => d.count));
  
  const barHeight = 28;
  const labelWidth = 70;
  const barMaxWidth = 200;
  const padding = { top: 10, bottom: 10, left: 10, right: 120 };
  const width = labelWidth + barMaxWidth + padding.left + padding.right;
  const height = data.length * barHeight + padding.top + padding.bottom;
  
  let svg = `<svg width="100%" viewBox="0 0 ${width} ${height}" class="histogram-svg" preserveAspectRatio="xMinYMin meet">`;
  
  data.forEach((item, i) => {
    const y = padding.top + i * barHeight;
    const barWidth = (item.count / maxCount) * barMaxWidth;
    const label = item.key === 'true' ? '✓ True' : '✗ False';
    const color = item.key === 'true' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    
    svg += `<rect x="${padding.left + labelWidth}" y="${y + 4}" width="${barWidth}" height="${barHeight - 8}" fill="${color}" rx="3"/>`;
    svg += `<text x="${padding.left + labelWidth - 5}" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="12" fill="#333">${label}</text>`;
    svg += `<text x="${padding.left + labelWidth + barWidth + 4}" y="${y + barHeight/2 + 4}" text-anchor="start" font-size="11" fill="#666">${item.count} (${item.percent}%)</text>`;
  });
  
  svg += `</svg>`;
  
  return `<div class="histogram-container">${svg}</div>`;
}

// Boolean Frequency Table HTML Generator (combined asc and desc cumulative)
function generateBooleanFrequencyTableHTML(stats) {
  const descData = stats.freqTableDesc;
  
  if (!descData || descData.length === 0) return '';
  
  let html = `<table class="freq-table">
    <thead>
      <tr>
        <th>Value</th>
        <th>n</th>
        <th>%</th>
        <th>Cum↓ n</th>
        <th>Cum↓ %</th>
        <th>Cum↑ n</th>
        <th>Cum↑ %</th>
      </tr>
    </thead>
    <tbody>`;
  
  descData.forEach(item => {
    const label = item.key === 'true' ? '✓ True' : '✗ False';
    html += `<tr>
      <td>${label}</td>
      <td>${item.count}</td>
      <td>${item.percent}%</td>
      <td>${item.cumCount}</td>
      <td>${item.cumPercent}%</td>
      <td>${item.cumAscCount ?? '—'}</td>
      <td>${item.cumAscPercent ?? '—'}%</td>
    </tr>`;
  });
  
  html += `</tbody></table>`;
  return html;
}

// Box Plot SVG Generator
function generateStatsExplanationsHTML(type) {
  let explanations = [];
  
  // Common explanations
  explanations.push({ term: 'Total Records', def: 'Total number of rows in the dataset.' });
  explanations.push({ term: 'Non-null / Null', def: 'Count of rows with/without values. Nulls may indicate missing data.' });
  
  if (type === 'int' || type === 'float' || type === 'date' || type === 'datetime' || type === 'time' || type === 'relation') {
    explanations.push({ term: 'Min / Max', def: 'Smallest and largest values in the data.' });
    explanations.push({ term: 'Range', def: 'Difference between maximum and minimum values.' });
    explanations.push({ term: 'Mean (μ)', def: 'Arithmetic average: sum of all values divided by count. Sensitive to outliers.' });
    explanations.push({ term: 'Median', def: 'Middle value when data is sorted. 50% of values are below, 50% above. Robust to outliers.' });
    explanations.push({ term: 'Mode', def: 'Most frequently occurring value(s). A dataset can have multiple modes.' });
    explanations.push({ term: 'Std Dev (σ)', def: 'Standard deviation measures how spread out values are from the mean. Low σ = values clustered near mean.' });
    explanations.push({ term: 'Variance (σ²)', def: 'Square of standard deviation. Same interpretation but in squared units.' });
    explanations.push({ term: 'Q1 (25%)', def: 'First quartile: 25% of values are below this point.' });
    explanations.push({ term: 'Q3 (75%)', def: 'Third quartile: 75% of values are below this point.' });
    explanations.push({ term: 'IQR', def: 'Interquartile range (Q3-Q1). Contains the middle 50% of values. Used to detect outliers.' });
    explanations.push({ term: 'Outliers', def: 'Values below Q1-1.5×IQR or above Q3+1.5×IQR. Unusual but not extreme.' });
    explanations.push({ term: 'Far Outliers', def: 'Values below Q1-3×IQR or above Q3+3×IQR. Potentially erroneous or exceptional data.' });
    explanations.push({ term: 'Skewness', def: 'Measures asymmetry. Positive = tail extends right (more low values). Negative = tail extends left. Zero = symmetric.' });
    explanations.push({ term: 'Kurtosis', def: 'Measures "tailedness". High = more outliers. Low = fewer outliers. Normal distribution has kurtosis ≈ 0.' });
  }
  
  if (type === 'select' || type === 'boolean') {
    explanations.push({ term: 'Categories', def: 'Number of unique values/options in the data.' });
    explanations.push({ term: 'Mode', def: 'Most frequently occurring category.' });
    explanations.push({ term: 'Mode Count', def: 'How many times the mode appears.' });
    explanations.push({ term: 'Variation Ratio', def: 'Proportion of values that are NOT the mode. 0 = all same value. Higher = more dispersed.' });
    explanations.push({ term: 'Entropy H(X)', def: 'Measures uncertainty/disorder. 0 = all values identical. Higher = more evenly distributed.' });
    explanations.push({ term: 'Max Entropy', def: 'Maximum possible entropy if all categories were equally likely.' });
    explanations.push({ term: 'Normalized Entropy', def: 'Entropy divided by max entropy. 0 to 1 scale. 1 = perfectly uniform distribution.' });
    explanations.push({ term: 'Gini-Simpson', def: 'Probability that two random values are different. 0 = all same. Higher = more diverse.' });
    explanations.push({ term: 'IQV', def: 'Index of Qualitative Variation. Normalized Gini-Simpson. 0 = no variation. 1 = maximum variation.' });
  }
  
  if (type === 'string' || type === 'multilinestring') {
    explanations.push({ term: 'Unique Values', def: 'Number of distinct text values.' });
    explanations.push({ term: 'Length Statistics', def: 'Statistics based on character count of each text value.' });
    if (type === 'multilinestring') {
      explanations.push({ term: 'Line Statistics', def: 'Statistics based on number of lines in each text value.' });
    }
  }
  
  let html = '<div class="stats-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stats-definitions">';
  explanations.forEach(e => {
    html += '<dt>' + e.term + '</dt><dd>' + e.def + '</dd>';
  });
  html += '</dl></details></div>';
  
  return html;
}

function generateBoxPlotSVG(stats) {
  if (!stats.allNumericValues || stats.allNumericValues.length === 0) return '';
  
  const width = 350;
  const height = 180;
  const padding = { top: 15, bottom: 25, left: 45, right: 15 };
  const plotHeight = height - padding.top - padding.bottom;
  const scatterX = 70;  // X position for scatter points
  const boxX = 115;     // X position for box plot
  const boxWidth = 30;
  const labelX = 170;   // X position for annotations
  
  const min = stats.min;
  const max = stats.max;
  const range = max - min || 1;
  
  // Scale function: value to Y position (inverted because SVG Y grows downward)
  const scaleY = (val) => padding.top + plotHeight - ((val - min) / range) * plotHeight;
  
  let svg = `<svg width="${width}" height="${height}" class="boxplot-svg">`;
  
  // Y-axis
  svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#666" stroke-width="1"/>`;
  
  // Y-axis ticks and labels
  const tickValues = [min, stats.q1, stats.median, stats.q3, max];
  tickValues.forEach(val => {
    const y = scaleY(val);
    svg += `<line x1="${padding.left - 4}" y1="${y}" x2="${padding.left}" y2="${y}" stroke="#666" stroke-width="1"/>`;
    svg += `<text x="${padding.left - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="#888">${val.toFixed(1)}</text>`;
  });
  
  // Scatter plot points (left column) with jitter
  const jitterRange = 15;
  stats.allNumericValues.forEach((val, i) => {
    const y = scaleY(val);
    const jitter = (Math.random() - 0.5) * jitterRange;
    const x = scatterX + jitter;
    
    // Determine color based on outlier status
    let color = 'rgba(74, 144, 226, 0.15)'; // Normal - blue with 10% opacity
    if (stats.farOutliers.includes(val)) {
      color = 'rgba(220, 53, 69, 0.5)'; // Far outlier - red
    } else if (stats.outliers.includes(val)) {
      color = 'rgba(255, 152, 0, 0.5)'; // Outlier - orange
    }
    
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
  });
  
  // Box plot (right side)
  const q1Y = scaleY(stats.q1);
  const q3Y = scaleY(stats.q3);
  const medianY = scaleY(stats.median);
  const whiskerLowY = scaleY(stats.whiskerLow);
  const whiskerHighY = scaleY(stats.whiskerHigh);
  
  // Whiskers (vertical lines)
  svg += `<line x1="${boxX + boxWidth/2}" y1="${whiskerHighY}" x2="${boxX + boxWidth/2}" y2="${q3Y}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/2}" y1="${q1Y}" x2="${boxX + boxWidth/2}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Whisker caps (horizontal lines)
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerHighY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerHighY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerLowY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Box (Q1 to Q3)
  svg += `<rect x="${boxX}" y="${q3Y}" width="${boxWidth}" height="${q1Y - q3Y}" fill="rgba(74, 144, 226, 0.3)" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Median line
  svg += `<line x1="${boxX}" y1="${medianY}" x2="${boxX + boxWidth}" y2="${medianY}" stroke="#2563eb" stroke-width="2"/>`;
  
  // Mean marker (diamond)
  const meanY = scaleY(stats.mean);
  svg += `<polygon points="${boxX + boxWidth/2},${meanY - 4} ${boxX + boxWidth/2 + 4},${meanY} ${boxX + boxWidth/2},${meanY + 4} ${boxX + boxWidth/2 - 4},${meanY}" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>`;
  
  // Annotations (right side labels)
  const annotationStyle = 'font-size="8" fill="#666"';
  
  // Upper whisker annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerHighY}" x2="${labelX - 5}" y2="${whiskerHighY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerHighY + 3}" ${annotationStyle}>Upper: Q3+1.5×IQR (Q3−Q1)</text>`;
  
  // Q3 annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${q3Y}" x2="${labelX - 5}" y2="${q3Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q3Y + 3}" ${annotationStyle}>Q3 (75%)</text>`;
  
  // Median annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${medianY}" x2="${labelX - 5}" y2="${medianY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${medianY + 3}" ${annotationStyle}>Median (50%)</text>`;
  
  // Q1 annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${q1Y}" x2="${labelX - 5}" y2="${q1Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q1Y + 3}" ${annotationStyle}>Q1 (25%)</text>`;
  
  // Lower whisker annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerLowY}" x2="${labelX - 5}" y2="${whiskerLowY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerLowY + 3}" ${annotationStyle}>Lower: Q1−1.5×IQR (Q3−Q1)</text>`;
  
  // Outliers on box plot side
  stats.outliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
  });
  
  // Far outliers on box plot side
  stats.farOutliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#dc3545" stroke-width="2"/>`;
    svg += `<line x1="${boxX + boxWidth/2 - 2}" y1="${y - 2}" x2="${boxX + boxWidth/2 + 2}" y2="${y + 2}" stroke="#dc3545" stroke-width="1.5"/>`;
    svg += `<line x1="${boxX + boxWidth/2 - 2}" y1="${y + 2}" x2="${boxX + boxWidth/2 + 2}" y2="${y - 2}" stroke="#dc3545" stroke-width="1.5"/>`;
  });
  
  // Labels
  svg += `<text x="${scatterX}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Points</text>`;
  svg += `<text x="${boxX + boxWidth/2}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Box</text>`;
  
  svg += `</svg>`;
  
  // Legend
  let legend = `<div class="boxplot-legend">
    <span><span class="legend-dot legend-normal"></span>Normal</span>
    <span><span class="legend-dot legend-outlier"></span>Outlier</span>
    <span><span class="legend-dot legend-far"></span>Far outlier</span>
    <span><span class="legend-diamond"></span>Mean</span>
  </div>`;
  
  return `<div class="boxplot-container">${svg}${legend}</div>`;
}

// Skewness visualization SVG - compares with normal distribution (skewness = 0)
function generateSkewnessSVG(skewness) {
  if (skewness === null || skewness === undefined) return '';
  
  const width = 160;
  const height = 60;
  const centerX = width / 2;
  const baseY = height - 10;
  
  // Clamp skewness for display
  const clampedSkew = Math.max(-3, Math.min(3, skewness));
  
  // Generate normal curve points
  const normalPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    const y = baseY - 35 * Math.exp(-t * t / 2);
    normalPoints.push(`${x},${y}`);
  }
  
  // Generate skewed curve points (using skew-normal approximation)
  const skewedPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    // Shift peak based on skewness
    const shift = -clampedSkew * 0.3;
    const adjustedT = t - shift;
    // Asymmetric tails
    const asymmetry = 1 + clampedSkew * adjustedT * 0.15;
    const y = baseY - 35 * Math.exp(-adjustedT * adjustedT / 2) * Math.max(0.2, asymmetry);
    skewedPoints.push(`${x},${y}`);
  }
  
  let svg = `<svg width="${width}" height="${height}" class="shape-svg">`;
  
  // Baseline
  svg += `<line x1="10" y1="${baseY}" x2="${width-10}" y2="${baseY}" stroke="#ddd" stroke-width="1"/>`;
  
  // Normal distribution (dashed gray)
  svg += `<polyline points="${normalPoints.join(' ')}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-dasharray="3,2"/>`;
  
  // Skewed distribution (solid blue)
  svg += `<polyline points="${skewedPoints.join(' ')}" fill="none" stroke="#4a90e2" stroke-width="2"/>`;
  
  // Center line
  svg += `<line x1="${centerX}" y1="${baseY - 40}" x2="${centerX}" y2="${baseY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  
  svg += `</svg>`;
  
  // Interpretation
  let interpretation = 'Symmetric';
  if (skewness > 0.5) interpretation = 'Right-skewed (positive)';
  else if (skewness < -0.5) interpretation = 'Left-skewed (negative)';
  
  return `
    <div class="shape-chart">
      <div class="shape-chart-title">Skewness: ${skewness.toFixed(3)}</div>
      ${svg}
      <div class="shape-chart-legend">
        <span class="legend-line legend-normal-line"></span> Normal (0)
        <span class="legend-line legend-data-line"></span> Data
      </div>
      <div class="shape-interpretation">${interpretation}</div>
    </div>
  `;
}

// Kurtosis visualization SVG - compares with normal distribution (kurtosis = 3)
function generateKurtosisSVG(kurtosis) {
  if (kurtosis === null || kurtosis === undefined) return '';
  
  const width = 160;
  const height = 60;
  const centerX = width / 2;
  const baseY = height - 10;
  
  // Excess kurtosis (normal = 0)
  const excessKurtosis = kurtosis - 3;
  const clampedKurt = Math.max(-3, Math.min(6, excessKurtosis));
  
  // Generate normal curve points (mesokurtic)
  const normalPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    const y = baseY - 35 * Math.exp(-t * t / 2);
    normalPoints.push(`${x},${y}`);
  }
  
  // Generate curve with different kurtosis
  const kurtPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    // Adjust peak height and tail weight based on kurtosis
    const peakFactor = 1 + clampedKurt * 0.08;
    const tailFactor = 1 + clampedKurt * 0.05;
    const exponent = 2 / (1 + clampedKurt * 0.1);
    const y = baseY - 35 * peakFactor * Math.exp(-Math.pow(Math.abs(t), exponent) * tailFactor / 2);
    kurtPoints.push(`${x},${y}`);
  }
  
  let svg = `<svg width="${width}" height="${height}" class="shape-svg">`;
  
  // Baseline
  svg += `<line x1="10" y1="${baseY}" x2="${width-10}" y2="${baseY}" stroke="#ddd" stroke-width="1"/>`;
  
  // Normal distribution (dashed gray)
  svg += `<polyline points="${normalPoints.join(' ')}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-dasharray="3,2"/>`;
  
  // Data distribution (solid blue)
  svg += `<polyline points="${kurtPoints.join(' ')}" fill="none" stroke="#4a90e2" stroke-width="2"/>`;
  
  svg += `</svg>`;
  
  // Interpretation
  let interpretation = 'Mesokurtic (normal)';
  if (excessKurtosis > 1) interpretation = 'Leptokurtic (heavy tails)';
  else if (excessKurtosis < -1) interpretation = 'Platykurtic (light tails)';
  
  return `
    <div class="shape-chart">
      <div class="shape-chart-title">Kurtosis: ${kurtosis.toFixed(3)} (excess: ${excessKurtosis.toFixed(3)})</div>
      ${svg}
      <div class="shape-chart-legend">
        <span class="legend-line legend-normal-line"></span> Normal (3)
        <span class="legend-line legend-data-line"></span> Data
      </div>
      <div class="shape-interpretation">${interpretation}</div>
    </div>
  `;
}

// DateTime Box Plot SVG Generator (uses numeric milliseconds)
function generateDateTimeBoxPlotSVG(stats, type) {
  if (!stats.allNumericValues || stats.allNumericValues.length === 0) return '';
  
  const width = 350;
  const height = 180;
  const padding = { top: 15, bottom: 25, left: 45, right: 15 };
  const plotHeight = height - padding.top - padding.bottom;
  const scatterX = 70;
  const boxX = 115;
  const boxWidth = 30;
  const labelX = 170;
  
  const min = stats.numMin;
  const max = stats.numMax;
  const range = max - min || 1;
  
  const scaleY = (val) => padding.top + plotHeight - ((val - min) / range) * plotHeight;
  
  let svg = `<svg width="${width}" height="${height}" class="boxplot-svg">`;
  
  // Y-axis
  svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#666" stroke-width="1"/>`;
  
  // Scatter plot points with jitter
  const jitterRange = 15;
  stats.allNumericValues.forEach((val) => {
    const y = scaleY(val);
    const jitter = (Math.random() - 0.5) * jitterRange;
    const x = scatterX + jitter;
    
    let color = 'rgba(74, 144, 226, 0.15)';
    if (stats.farOutliers.includes(val)) {
      color = 'rgba(220, 53, 69, 0.5)';
    } else if (stats.outliers.includes(val)) {
      color = 'rgba(255, 152, 0, 0.5)';
    }
    
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
  });
  
  // Box plot
  const q1Y = scaleY(stats.numQ1);
  const q3Y = scaleY(stats.numQ3);
  const medianY = scaleY(stats.numMedian);
  const whiskerLowY = scaleY(stats.whiskerLow);
  const whiskerHighY = scaleY(stats.whiskerHigh);
  
  // Whiskers
  svg += `<line x1="${boxX + boxWidth/2}" y1="${whiskerHighY}" x2="${boxX + boxWidth/2}" y2="${q3Y}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/2}" y1="${q1Y}" x2="${boxX + boxWidth/2}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Whisker caps
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerHighY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerHighY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerLowY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Box
  svg += `<rect x="${boxX}" y="${q3Y}" width="${boxWidth}" height="${q1Y - q3Y}" fill="rgba(74, 144, 226, 0.3)" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Median line
  svg += `<line x1="${boxX}" y1="${medianY}" x2="${boxX + boxWidth}" y2="${medianY}" stroke="#2563eb" stroke-width="2"/>`;
  
  // Mean marker
  const meanY = scaleY(stats.numMean);
  svg += `<polygon points="${boxX + boxWidth/2},${meanY - 4} ${boxX + boxWidth/2 + 4},${meanY} ${boxX + boxWidth/2},${meanY + 4} ${boxX + boxWidth/2 - 4},${meanY}" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>`;
  
  // Annotations
  const annotationStyle = 'font-size="8" fill="#666"';
  
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerHighY}" x2="${labelX - 5}" y2="${whiskerHighY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerHighY + 3}" ${annotationStyle}>Upper: Q3+1.5×IQR (Q3−Q1)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${q3Y}" x2="${labelX - 5}" y2="${q3Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q3Y + 3}" ${annotationStyle}>Q3 (75%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${medianY}" x2="${labelX - 5}" y2="${medianY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${medianY + 3}" ${annotationStyle}>Median (50%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${q1Y}" x2="${labelX - 5}" y2="${q1Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q1Y + 3}" ${annotationStyle}>Q1 (25%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerLowY}" x2="${labelX - 5}" y2="${whiskerLowY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerLowY + 3}" ${annotationStyle}>Lower: Q1−1.5×IQR (Q3−Q1)</text>`;
  
  // Outliers
  stats.outliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
  });
  
  stats.farOutliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#dc3545" stroke-width="2"/>`;
  });
  
  // Labels
  svg += `<text x="${scatterX}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Points</text>`;
  svg += `<text x="${boxX + boxWidth/2}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Box</text>`;
  
  svg += `</svg>`;
  
  let legend = `<div class="boxplot-legend">
    <span><span class="legend-dot legend-normal"></span>Normal</span>
    <span><span class="legend-dot legend-outlier"></span>Outlier</span>
    <span><span class="legend-dot legend-far"></span>Far outlier</span>
    <span><span class="legend-diamond"></span>Mean</span>
  </div>`;
  
  return `<div class="boxplot-container">${svg}${legend}</div>`;
}

// Statistics functions
function calculateStatistics(colIdx, st = state) {
  const values = st.relation.items
    .map(row => row[colIdx])
    .filter(v => v !== null && v !== undefined);
  
  const type = st.columnTypes[colIdx];
  const total = st.relation.items.length;
  const nonNull = values.length;
  const nullCount = total - nonNull;
  
  const stats = {
    total,
    nonNull,
    nullCount,
    nullPercent: ((nullCount / total) * 100).toFixed(2)
  };
  
  if (type === 'int' || type === 'float') {
    const nums = values.map(Number).filter(n => !isNaN(n));
    if (nums.length > 0) {
      nums.sort((a, b) => a - b);
      
      stats.min = Math.min(...nums);
      stats.max = Math.max(...nums);
      stats.sum = nums.reduce((a, b) => a + b, 0);
      stats.mean = stats.sum / nums.length;
      
      // Median
      const mid = Math.floor(nums.length / 2);
      stats.median = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      
      // Mode
      const freq = {};
      nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      
      // Variance and Std Dev
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - stats.mean, 2), 0) / nums.length;
      stats.variance = variance;
      stats.stdDev = Math.sqrt(variance);
      
      // Quartiles
      const q1Idx = Math.floor(nums.length * 0.25);
      const q3Idx = Math.floor(nums.length * 0.75);
      stats.q1 = nums[q1Idx];
      stats.q3 = nums[q3Idx];
      stats.iqr = stats.q3 - stats.q1;
      
      // Whiskers and outliers for box plot
      const lowerWhisker = stats.q1 - 1.5 * stats.iqr;
      const upperWhisker = stats.q3 + 1.5 * stats.iqr;
      const lowerFar = stats.q1 - 3 * stats.iqr;
      const upperFar = stats.q3 + 3 * stats.iqr;
      
      // Find actual whisker endpoints (min/max within bounds)
      stats.whiskerLow = nums.find(n => n >= lowerWhisker) ?? stats.min;
      stats.whiskerHigh = nums.slice().reverse().find(n => n <= upperWhisker) ?? stats.max;
      
      // Classify points
      stats.normalPoints = nums.filter(n => n >= lowerWhisker && n <= upperWhisker);
      stats.outliers = nums.filter(n => (n < lowerWhisker && n >= lowerFar) || (n > upperWhisker && n <= upperFar));
      stats.farOutliers = nums.filter(n => n < lowerFar || n > upperFar);
      stats.allNumericValues = nums;
      
      // Skewness
      const n = nums.length;
      if (n >= 3 && stats.stdDev > 0) {
        const m3 = nums.reduce((sum, x) => sum + Math.pow(x - stats.mean, 3), 0) / n;
        stats.skewness = m3 / Math.pow(stats.stdDev, 3);
      }
      
      // Kurtosis
      if (n >= 4 && stats.stdDev > 0) {
        const m4 = nums.reduce((sum, x) => sum + Math.pow(x - stats.mean, 4), 0) / n;
        stats.kurtosis = m4 / Math.pow(stats.stdDev, 4) - 3;
      }
      
      // Range
      stats.range = stats.max - stats.min;
    }
  } else if (type === 'select') {
    // Categorical statistics for select type
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    
    const k = Object.keys(freq).length; // Number of categories
    stats.categoryCount = k;
    
    // Frequency table sorted by count descending (display order)
    const sortedDesc = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const n = nonNull;
    
    // Build frequency table with absolute, relative frequencies first
    stats.freqTableDesc = sortedDesc.map(([key, count]) => ({
      key,
      count,
      percent: ((count / n) * 100).toFixed(2),
      cumCount: 0,
      cumPercent: '0.00'
    }));
    
    // Calculate cumulative descending (top to bottom)
    let cumDesc = 0;
    for (let i = 0; i < stats.freqTableDesc.length; i++) {
      cumDesc += stats.freqTableDesc[i].count;
      stats.freqTableDesc[i].cumCount = cumDesc;
      stats.freqTableDesc[i].cumPercent = ((cumDesc / n) * 100).toFixed(2);
    }
    
    // Calculate cumulative ascending (bottom to top, stored as cumAscCount/cumAscPercent)
    let cumAsc = 0;
    for (let i = stats.freqTableDesc.length - 1; i >= 0; i--) {
      cumAsc += stats.freqTableDesc[i].count;
      stats.freqTableDesc[i].cumAscCount = cumAsc;
      stats.freqTableDesc[i].cumAscPercent = ((cumAsc / n) * 100).toFixed(2);
    }
    
    // freqTableAsc not needed anymore, but keep for backward compatibility
    stats.freqTableAsc = stats.freqTableDesc;
    
    // Mode (most frequent category/categories)
    const maxFreq = Math.max(...Object.values(freq));
    stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq);
    stats.modeCount = maxFreq;
    stats.modePercent = ((maxFreq / n) * 100).toFixed(2);
    
    // Entropy (Shannon entropy for diversity measurement)
    const probabilities = Object.values(freq).map(c => c / n);
    stats.entropy = -probabilities.reduce((sum, p) => {
      if (p > 0) return sum + p * Math.log2(p);
      return sum;
    }, 0);
    stats.maxEntropy = Math.log2(k); // Maximum possible entropy
    stats.normalizedEntropy = k > 1 ? (stats.entropy / stats.maxEntropy) : 0;
    
    // Gini-Simpson Index (probability that two random items are different)
    stats.giniSimpson = 1 - probabilities.reduce((sum, p) => sum + p * p, 0);
    
    // Variation Ratio (proportion of cases not in the mode)
    stats.variationRatio = 1 - (maxFreq / n);
    
    // Index of Qualitative Variation (IQV) - 0 to 1, 1 = max diversity
    if (k > 1) {
      const sumPSquared = probabilities.reduce((sum, p) => sum + p * p, 0);
      stats.iqv = (k / (k - 1)) * (1 - sumPSquared);
    } else {
      stats.iqv = 0;
    }
    
    stats.frequencies = freq;
  } else if (type === 'string' || type === 'multilinestring') {
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    stats.uniqueCount = Object.keys(freq).length;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    stats.topValues = sorted.slice(0, 5);
    
    // Length statistics (Unicode character count)
    const lengths = values.map(v => [...String(v)].length);
    lengths.sort((a, b) => a - b);
    
    if (lengths.length > 0) {
      stats.lengthStats = {};
      stats.lengthStats.allNumericValues = lengths;
      stats.lengthStats.min = Math.min(...lengths);
      stats.lengthStats.max = Math.max(...lengths);
      stats.lengthStats.sum = lengths.reduce((a, b) => a + b, 0);
      stats.lengthStats.mean = stats.lengthStats.sum / lengths.length;
      stats.lengthStats.range = stats.lengthStats.max - stats.lengthStats.min;
      
      // Median
      const mid = Math.floor(lengths.length / 2);
      stats.lengthStats.median = lengths.length % 2 ? lengths[mid] : (lengths[mid - 1] + lengths[mid]) / 2;
      
      // Mode
      const lenFreq = {};
      lengths.forEach(v => lenFreq[v] = (lenFreq[v] || 0) + 1);
      const maxLenFreq = Math.max(...Object.values(lenFreq));
      stats.lengthStats.mode = Object.keys(lenFreq).filter(k => lenFreq[k] === maxLenFreq).map(Number);
      
      // Variance and Std Dev
      stats.lengthStats.variance = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 2), 0) / lengths.length;
      stats.lengthStats.stdDev = Math.sqrt(stats.lengthStats.variance);
      
      // Quartiles
      const q1Idx = Math.floor(lengths.length * 0.25);
      const q3Idx = Math.floor(lengths.length * 0.75);
      stats.lengthStats.q1 = lengths[q1Idx];
      stats.lengthStats.q3 = lengths[q3Idx];
      stats.lengthStats.iqr = stats.lengthStats.q3 - stats.lengthStats.q1;
      
      // Whiskers for box plot
      const whiskerLow = stats.lengthStats.q1 - 1.5 * stats.lengthStats.iqr;
      const whiskerHigh = stats.lengthStats.q3 + 1.5 * stats.lengthStats.iqr;
      stats.lengthStats.whiskerLow = Math.max(whiskerLow, stats.lengthStats.min);
      stats.lengthStats.whiskerHigh = Math.min(whiskerHigh, stats.lengthStats.max);
      
      // Outliers
      stats.lengthStats.outliers = lengths.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = stats.lengthStats.q1 - 3 * stats.lengthStats.iqr;
      const farHigh = stats.lengthStats.q3 + 3 * stats.lengthStats.iqr;
      stats.lengthStats.farOutliers = lengths.filter(n => n < farLow || n > farHigh);
      
      // Skewness
      const m3 = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 3), 0) / lengths.length;
      stats.lengthStats.skewness = stats.lengthStats.stdDev > 0 ? m3 / Math.pow(stats.lengthStats.stdDev, 3) : 0;
      
      // Kurtosis
      const m4 = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 4), 0) / lengths.length;
      stats.lengthStats.kurtosis = stats.lengthStats.variance > 0 ? (m4 / Math.pow(stats.lengthStats.variance, 2)) : 0;
    }
    
    // Line count statistics (only for multilinestring)
    if (type === 'multilinestring') {
      const lineCounts = values.map(v => String(v).split('\n').length);
      lineCounts.sort((a, b) => a - b);
      
      if (lineCounts.length > 0) {
        stats.lineStats = {};
        stats.lineStats.allNumericValues = lineCounts;
        stats.lineStats.min = Math.min(...lineCounts);
        stats.lineStats.max = Math.max(...lineCounts);
        stats.lineStats.sum = lineCounts.reduce((a, b) => a + b, 0);
        stats.lineStats.mean = stats.lineStats.sum / lineCounts.length;
        stats.lineStats.range = stats.lineStats.max - stats.lineStats.min;
        
        // Median
        const midLine = Math.floor(lineCounts.length / 2);
        stats.lineStats.median = lineCounts.length % 2 ? lineCounts[midLine] : (lineCounts[midLine - 1] + lineCounts[midLine]) / 2;
        
        // Mode
        const lineFreq = {};
        lineCounts.forEach(v => lineFreq[v] = (lineFreq[v] || 0) + 1);
        const maxLineFreq = Math.max(...Object.values(lineFreq));
        stats.lineStats.mode = Object.keys(lineFreq).filter(k => lineFreq[k] === maxLineFreq).map(Number);
        
        // Variance and Std Dev
        stats.lineStats.variance = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 2), 0) / lineCounts.length;
        stats.lineStats.stdDev = Math.sqrt(stats.lineStats.variance);
        
        // Quartiles
        const q1LineIdx = Math.floor(lineCounts.length * 0.25);
        const q3LineIdx = Math.floor(lineCounts.length * 0.75);
        stats.lineStats.q1 = lineCounts[q1LineIdx];
        stats.lineStats.q3 = lineCounts[q3LineIdx];
        stats.lineStats.iqr = stats.lineStats.q3 - stats.lineStats.q1;
        
        // Whiskers for box plot
        const whiskerLineLow = stats.lineStats.q1 - 1.5 * stats.lineStats.iqr;
        const whiskerLineHigh = stats.lineStats.q3 + 1.5 * stats.lineStats.iqr;
        stats.lineStats.whiskerLow = Math.max(whiskerLineLow, stats.lineStats.min);
        stats.lineStats.whiskerHigh = Math.min(whiskerLineHigh, stats.lineStats.max);
        
        // Outliers
        stats.lineStats.outliers = lineCounts.filter(n => n < whiskerLineLow || n > whiskerLineHigh);
        const farLineLow = stats.lineStats.q1 - 3 * stats.lineStats.iqr;
        const farLineHigh = stats.lineStats.q3 + 3 * stats.lineStats.iqr;
        stats.lineStats.farOutliers = lineCounts.filter(n => n < farLineLow || n > farLineHigh);
        
        // Skewness
        const m3Line = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 3), 0) / lineCounts.length;
        stats.lineStats.skewness = stats.lineStats.stdDev > 0 ? m3Line / Math.pow(stats.lineStats.stdDev, 3) : 0;
        
        // Kurtosis
        const m4Line = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 4), 0) / lineCounts.length;
        stats.lineStats.kurtosis = stats.lineStats.variance > 0 ? (m4Line / Math.pow(stats.lineStats.variance, 2)) : 0;
      }
    }
  } else if (type === 'boolean') {
    // Treat boolean as categorical data
    const freq = {};
    values.forEach(v => {
      const key = v === true ? 'true' : 'false';
      freq[key] = (freq[key] || 0) + 1;
    });
    
    const trueCount = freq['true'] || 0;
    const falseCount = freq['false'] || 0;
    stats.trueCount = trueCount;
    stats.falseCount = falseCount;
    stats.truePercent = ((trueCount / nonNull) * 100).toFixed(1);
    stats.falsePercent = ((falseCount / nonNull) * 100).toFixed(1);
    
    const k = Object.keys(freq).length;
    stats.categoryCount = k;
    
    const n = nonNull;
    const sortedDesc = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    
    // Build frequency table with absolute, relative frequencies first
    stats.freqTableDesc = sortedDesc.map(([key, count]) => ({
      key,
      count,
      percent: ((count / n) * 100).toFixed(2),
      cumCount: 0,
      cumPercent: '0.00'
    }));
    
    // Calculate cumulative descending (top to bottom)
    let cumDesc = 0;
    for (let i = 0; i < stats.freqTableDesc.length; i++) {
      cumDesc += stats.freqTableDesc[i].count;
      stats.freqTableDesc[i].cumCount = cumDesc;
      stats.freqTableDesc[i].cumPercent = ((cumDesc / n) * 100).toFixed(2);
    }
    
    // Calculate cumulative ascending (bottom to top)
    let cumAsc = 0;
    for (let i = stats.freqTableDesc.length - 1; i >= 0; i--) {
      cumAsc += stats.freqTableDesc[i].count;
      stats.freqTableDesc[i].cumAscCount = cumAsc;
      stats.freqTableDesc[i].cumAscPercent = ((cumAsc / n) * 100).toFixed(2);
    }
    
    stats.freqTableAsc = stats.freqTableDesc;
    
    // Mode
    const maxFreq = Math.max(...Object.values(freq));
    stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq);
    stats.modeCount = maxFreq;
    stats.modePercent = ((maxFreq / n) * 100).toFixed(2);
    
    // Entropy
    const probabilities = Object.values(freq).map(c => c / n);
    stats.entropy = -probabilities.reduce((sum, p) => {
      if (p > 0) return sum + p * Math.log2(p);
      return sum;
    }, 0);
    stats.maxEntropy = Math.log2(k);
    stats.normalizedEntropy = k > 1 ? (stats.entropy / stats.maxEntropy) : 0;
    
    // Gini-Simpson Index
    stats.giniSimpson = 1 - probabilities.reduce((sum, p) => sum + p * p, 0);
    
    // Variation Ratio
    stats.variationRatio = 1 - (maxFreq / n);
    
    // IQV
    if (k > 1) {
      const sumPSquared = probabilities.reduce((sum, p) => sum + p * p, 0);
      stats.iqv = (k / (k - 1)) * (1 - sumPSquared);
    } else {
      stats.iqv = 0;
    }
    
    stats.frequencies = freq;
  } else if (type === 'date' || type === 'datetime' || type === 'time') {
    // Convert to milliseconds for statistical calculations
    let nums;
    if (type === 'time') {
      // Parse time strings (HH:MM:SS or HH:MM) to milliseconds since midnight
      nums = values.map(v => {
        const parts = String(v).split(':').map(Number);
        if (parts.length >= 2) {
          const hours = parts[0] || 0;
          const minutes = parts[1] || 0;
          const seconds = parts[2] || 0;
          return (hours * 3600 + minutes * 60 + seconds) * 1000;
        }
        return NaN;
      }).filter(n => !isNaN(n));
    } else {
      nums = values.map(v => new Date(v).getTime()).filter(n => !isNaN(n));
    }
    
    if (nums.length > 0) {
      nums.sort((a, b) => a - b);
      
      // Format functions for display
      const formatValue = (ms) => {
        if (type === 'time') {
          const totalSec = Math.floor(ms / 1000);
          const h = Math.floor(totalSec / 3600);
          const m = Math.floor((totalSec % 3600) / 60);
          const s = totalSec % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else if (type === 'date') {
          return new Date(ms).toISOString().split('T')[0];
        } else {
          return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
        }
      };
      
      stats.min = formatValue(Math.min(...nums));
      stats.max = formatValue(Math.max(...nums));
      stats.sum = nums.reduce((a, b) => a + b, 0);
      stats.mean = formatValue(stats.sum / nums.length);
      
      // Median
      const mid = Math.floor(nums.length / 2);
      const medianMs = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      stats.median = formatValue(medianMs);
      
      // Range in human-readable format
      const rangeMs = Math.max(...nums) - Math.min(...nums);
      if (type === 'time') {
        stats.range = formatValue(rangeMs);
      } else {
        // For dates, show range in days
        const rangeDays = rangeMs / (1000 * 60 * 60 * 24);
        stats.range = `${rangeDays.toFixed(1)} days`;
      }
      
      // Variance and Std Dev (in milliseconds, shown as duration)
      const meanMs = stats.sum / nums.length;
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 2), 0) / nums.length;
      stats.variance = variance;
      stats.stdDev = Math.sqrt(variance);
      
      // Format std dev as duration
      if (type === 'time') {
        stats.stdDevFormatted = formatValue(stats.stdDev);
      } else {
        const stdDevDays = stats.stdDev / (1000 * 60 * 60 * 24);
        stats.stdDevFormatted = `${stdDevDays.toFixed(2)} days`;
      }
      
      // Quartiles
      const q1Idx = Math.floor(nums.length * 0.25);
      const q3Idx = Math.floor(nums.length * 0.75);
      const q1Ms = nums[q1Idx];
      const q3Ms = nums[q3Idx];
      stats.q1 = formatValue(q1Ms);
      stats.q3 = formatValue(q3Ms);
      const iqrMs = q3Ms - q1Ms;
      if (type === 'time') {
        stats.iqr = formatValue(iqrMs);
      } else {
        stats.iqr = `${(iqrMs / (1000 * 60 * 60 * 24)).toFixed(1)} days`;
      }
      
      // Store numeric values for box plot generation
      stats.allNumericValues = nums;
      stats.numMin = Math.min(...nums);
      stats.numMax = Math.max(...nums);
      stats.numQ1 = q1Ms;
      stats.numQ3 = q3Ms;
      stats.numMedian = medianMs;
      stats.numMean = meanMs;
      stats.numIqr = iqrMs;
      
      // Whiskers for box plot
      const whiskerLow = q1Ms - 1.5 * iqrMs;
      const whiskerHigh = q3Ms + 1.5 * iqrMs;
      stats.whiskerLow = Math.max(whiskerLow, stats.numMin);
      stats.whiskerHigh = Math.min(whiskerHigh, stats.numMax);
      
      // Outliers
      stats.outliers = nums.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = q1Ms - 3 * iqrMs;
      const farHigh = q3Ms + 3 * iqrMs;
      stats.farOutliers = nums.filter(n => n < farLow || n > farHigh);
      
      // Skewness (Fisher's)
      const m3 = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 3), 0) / nums.length;
      stats.skewness = m3 / Math.pow(stats.stdDev, 3);
      
      // Kurtosis (Fisher's)
      const m4 = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 4), 0) / nums.length;
      stats.kurtosis = (m4 / Math.pow(stats.variance, 2));
    }
  } else if (type === 'relation') {
    // Statistics based on row counts in nested relations
    const rowCounts = values.map(v => v?.items?.length || 0);
    
    if (rowCounts.length > 0) {
      rowCounts.sort((a, b) => a - b);
      
      stats.allNumericValues = rowCounts;
      stats.min = Math.min(...rowCounts);
      stats.max = Math.max(...rowCounts);
      stats.sum = rowCounts.reduce((a, b) => a + b, 0);
      stats.mean = stats.sum / rowCounts.length;
      stats.range = stats.max - stats.min;
      
      // Median
      const mid = Math.floor(rowCounts.length / 2);
      stats.median = rowCounts.length % 2 ? rowCounts[mid] : (rowCounts[mid - 1] + rowCounts[mid]) / 2;
      
      // Mode
      const freq = {};
      rowCounts.forEach(v => freq[v] = (freq[v] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      
      // Variance and Std Dev
      stats.variance = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 2), 0) / rowCounts.length;
      stats.stdDev = Math.sqrt(stats.variance);
      
      // Quartiles
      const q1Idx = Math.floor(rowCounts.length * 0.25);
      const q3Idx = Math.floor(rowCounts.length * 0.75);
      stats.q1 = rowCounts[q1Idx];
      stats.q3 = rowCounts[q3Idx];
      stats.iqr = stats.q3 - stats.q1;
      
      // Whiskers for box plot
      const whiskerLow = stats.q1 - 1.5 * stats.iqr;
      const whiskerHigh = stats.q3 + 1.5 * stats.iqr;
      stats.whiskerLow = Math.max(whiskerLow, stats.min);
      stats.whiskerHigh = Math.min(whiskerHigh, stats.max);
      
      // Outliers
      stats.outliers = rowCounts.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = stats.q1 - 3 * stats.iqr;
      const farHigh = stats.q3 + 3 * stats.iqr;
      stats.farOutliers = rowCounts.filter(n => n < farLow || n > farHigh);
      
      // Skewness
      const m3 = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 3), 0) / rowCounts.length;
      stats.skewness = stats.stdDev > 0 ? m3 / Math.pow(stats.stdDev, 3) : 0;
      
      // Kurtosis
      const m4 = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 4), 0) / rowCounts.length;
      stats.kurtosis = stats.variance > 0 ? (m4 / Math.pow(stats.variance, 2)) : 0;
    }
  }
  
  return stats;
}

// Group By functions
function applyGroupBy() {
  if (getGroupByColumns(state).length === 0) {
    setGroupedData(state, null);
    return;
  }
  
  const groups = new Map();
  
  getFilteredIndices(state).forEach(idx => {
    const row = state.relation.items[idx];
    const key = getGroupByColumns(state).map(colIdx => JSON.stringify(row[colIdx])).join('|');
    
    if (!groups.has(key)) {
      groups.set(key, {
        keyValues: getGroupByColumns(state).map(colIdx => row[colIdx]),
        indices: []
      });
    }
    groups.get(key).indices.push(idx);
  });
  
  setGroupedData(state, groups);
}

function getVisibleColumns() {
  return state.columnNames
    .map((name, idx) => ({ name, type: state.columnTypes[idx], idx }))
    .filter((_, idx) => !getGroupByColumns(state).includes(idx));
}





// Relation type functions
function formatCellValue(value, type, colName) {
  if (value === null || value === undefined) return '<span class="null-value">null</span>';
  
  if (type === 'relation') {
    const count = value?.items?.length || 0;
    return `<span class="relation-cell-icon" title="${count} rows">📋 ${count}</span>`;
  }
  if (type === 'boolean') {
    // Checkboxes are handled separately in renderTable to allow interaction
    if (value === true) return '<span class="bool-display bool-display-true">✓</span>';
    if (value === false) return '<span class="bool-display bool-display-false">✗</span>';
    return '<span class="bool-display bool-display-null">—</span>';
  }
  if (type === 'multilinestring') {
    return `<span class="multiline-preview">${String(value).substring(0, 50)}${value.length > 50 ? '...' : ''}</span>`;
  }
  if (type === 'select') {
    const colOptions = state.options[colName];
    if (colOptions && colOptions[value] !== undefined) {
      return `<span class="select-display">${colOptions[value]}</span>`;
    }
    return `<span class="select-display-key">${value}</span>`;
  }
  
  return String(value);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function updateTextarea(st = state) {
  const textarea = st.container 
    ? st.container.querySelector('.relation-json')
    : el('.relation-json');
  if (textarea) textarea.value = JSON.stringify(st.relation, null, 2);
}

// Alias for updateTextarea
function updateJsonOutput(st = state) {
  updateTextarea(st);
}

// Pagination functions
function getTotalPages(st = state) {
  if (getPageSize(st) === 'all') return 1;
  return Math.ceil(getSortedIndices(st).length / getPageSize(st));
}

function getCurrentPageIndices(st = state) {
  if (getPageSize(st) === 'all') {
    return getSortedIndices(st);
  }
  const start = (getCurrentPage(st) - 1) * getPageSize(st);
  const end = start + getPageSize(st);
  return getSortedIndices(st).slice(start, end);
}

// Selection functions
function updateHeaderCheckbox(st = state, container = null) {
  const headerCheckbox = container 
    ? container.querySelector('.select-all-checkbox')
    : el('.select-all-checkbox');
  if (!headerCheckbox) return;
  
  const pageIndices = getCurrentPageIndices(st);
  const selectedInPage = pageIndices.filter(i => getSelectedRows(st).has(i)).length;
  
  if (selectedInPage === 0) {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = false;
  } else if (selectedInPage === pageIndices.length) {
    headerCheckbox.checked = true;
    headerCheckbox.indeterminate = false;
  } else {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = true;
  }
}

function toggleSelectAll(st = state) {
  const pageIndices = getCurrentPageIndices(st);
  const allSelected = pageIndices.every(i => getSelectedRows(st).has(i));
  
  if (allSelected) {
    pageIndices.forEach(i => getSelectedRows(st).delete(i));
  } else {
    pageIndices.forEach(i => getSelectedRows(st).add(i));
  }
  
  renderTable(st);
}

function invertSelection(pageOnly = false, st = state) {
  const indices = pageOnly ? getCurrentPageIndices(st) : getSortedIndices(st);
  
  indices.forEach(i => {
    if (getSelectedRows(st).has(i)) {
      getSelectedRows(st).delete(i);
    } else {
      getSelectedRows(st).add(i);
    }
  });
  
  renderTable(st);
}

function removeSelectedRows(st = state) {
  if (getSelectedRows(st).size === 0) return;
  
  if (!confirm(`Remove ${getSelectedRows(st).size} selected rows from the data?`)) return;
  
  // Get sorted indices to remove (descending to preserve indices)
  const indicesToRemove = [...getSelectedRows(st)].sort((a, b) => b - a);
  
  indicesToRemove.forEach(idx => {
    st.relation.items.splice(idx, 1);
  });
  
  getSelectedRows(st).clear();
  setCurrentPage(st, 1);
  renderTable(st);
  updateJsonOutput(st);
}

function removeUnselectedRows(st = state) {
  if (getSelectedRows(st).size === 0) return;
  
  const unselectedCount = getSortedIndices(st).length - getSelectedRows(st).size;
  if (!confirm(`Remove ${unselectedCount} unselected rows from the data? Only ${getSelectedRows(st).size} selected rows will remain.`)) return;
  
  // Keep only selected rows (create new array with selected items)
  const selectedIndices = [...getSelectedRows(st)].sort((a, b) => a - b);
  st.relation.items = selectedIndices.map(idx => st.relation.items[idx]);
  
  getSelectedRows(st).clear();
  setCurrentPage(st, 1);
  renderTable(st);
  updateJsonOutput(st);
}

// Render functions
function createInputForType(type, value, rowIdx, colIdx, editable, st = state) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relation-cell-input';
  
  if (!editable) {
    if (type === 'boolean') {
      // Boolean uses tri-state checkbox even in read-only mode
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.row = rowIdx;
      checkbox.dataset.col = colIdx;
      checkbox.className = 'bool-tristate';
      if (value === true) {
        checkbox.checked = true;
        checkbox.classList.add('bool-tristate-true');
      } else if (value === false) {
        checkbox.checked = false;
        checkbox.classList.add('bool-tristate-false');
      } else {
        checkbox.checked = false;
        checkbox.indeterminate = true;
        checkbox.classList.add('bool-tristate-null');
      }
      wrapper.appendChild(checkbox);
      return wrapper;
    }
    
    if (type === 'select') {
      const colName = st.columnNames[colIdx];
      const colOptions = st.options[colName];
      const span = document.createElement('span');
      span.className = 'relation-cell-readonly select-display';
      if (colOptions && colOptions[value] !== undefined) {
        span.innerHTML = colOptions[value];
      } else if (value !== null && value !== undefined) {
        span.textContent = value;
      } else {
        span.textContent = '—';
      }
      wrapper.appendChild(span);
      return wrapper;
    }
    
    if (type === 'relation') {
      const btn = document.createElement('button');
      btn.className = 'relation-cell-btn';
      const count = value?.items?.length || 0;
      btn.innerHTML = `📋 ${count}`;
      btn.title = `View nested relation (${count} rows)`;
      btn.dataset.row = rowIdx;
      btn.dataset.col = colIdx;
      wrapper.appendChild(btn);
      return wrapper;
    }
    
    const span = document.createElement('span');
    span.className = 'relation-cell-readonly';
    if (type === 'multilinestring') {
      span.className = 'relation-cell-multiline';
      span.textContent = value || '—';
    } else {
      span.textContent = value !== null && value !== undefined ? String(value) : '—';
    }
    wrapper.appendChild(span);
    return wrapper;
  }
  
  if (type === 'relation') {
    const btn = document.createElement('button');
    btn.className = 'relation-cell-btn';
    const count = value?.items?.length || 0;
    btn.innerHTML = `📋 ${count}`;
    btn.title = `View nested relation (${count} rows)`;
    btn.dataset.row = rowIdx;
    btn.dataset.col = colIdx;
    wrapper.appendChild(btn);
  } else if (type === 'boolean') {
    // Boolean uses tri-state checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.row = rowIdx;
    checkbox.dataset.col = colIdx;
    checkbox.className = 'bool-tristate';
    if (value === true) {
      checkbox.checked = true;
      checkbox.classList.add('bool-tristate-true');
    } else if (value === false) {
      checkbox.checked = false;
      checkbox.classList.add('bool-tristate-false');
    } else {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      checkbox.classList.add('bool-tristate-null');
    }
    wrapper.appendChild(checkbox);
  } else if (type === 'multilinestring') {
    const textarea = document.createElement('textarea');
    textarea.value = value || '';
    textarea.dataset.row = rowIdx;
    textarea.dataset.col = colIdx;
    textarea.className = 'relation-textarea';
    textarea.rows = 2;
    wrapper.appendChild(textarea);
  } else if (type === 'select') {
    const colName = state.columnNames[colIdx];
    const colOptions = state.options[colName] || {};
    const select = document.createElement('select');
    select.dataset.row = rowIdx;
    select.dataset.col = colIdx;
    select.className = 'relation-select';
    
    // Add empty option for null
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '— Select —';
    select.appendChild(emptyOpt);
    
    // Add options
    for (const [key, html] of Object.entries(colOptions)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.innerHTML = html;
      if (value === key) opt.selected = true;
      select.appendChild(opt);
    }
    
    wrapper.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.type = getInputType(type);
    input.value = formatValueForInput(type, value);
    input.dataset.row = rowIdx;
    input.dataset.col = colIdx;
    input.className = 'relation-input';
    if (type === 'int' || type === 'float') {
      input.step = type === 'float' ? '0.001' : '1';
    }
    wrapper.appendChild(input);
  }
  
  return wrapper;
}

function getInputType(type) {
  switch (type) {
    case 'int':
    case 'float':
      return 'number';
    case 'date':
      return 'date';
    case 'datetime':
      return 'datetime-local';
    case 'time':
      return 'time';
    default:
      return 'text';
  }
}

function formatValueForInput(type, value) {
  if (value === null || value === undefined) return '';
  if (type === 'datetime' && typeof value === 'string') {
    return value.replace(' ', 'T');
  }
  return String(value);
}

function getSortIndicator(colIdx, st = state) {
  const criterion = getSortCriteria(st).find(c => c.column === colIdx);
  if (!criterion) return '';
  
  const priority = getSortCriteria(st).length > 1 ? `<span class="sort-priority">${getSortCriteria(st).indexOf(criterion) + 1}</span>` : '';
  const arrow = criterion.direction === 'asc' ? '↑' : '↓';
  return `<span class="sort-indicator">${arrow}${priority}</span>`;
}

function applyConditionalFormatting(value, colIdx, cell, rowIdx, st = state) {
  const rules = getFormatting(st)[colIdx];
  const type = st.columnTypes[colIdx];
  
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      if (matchesFormattingCondition(value, rule.condition, type)) {
        if (rule.style.color) cell.style.color = rule.style.color;
        if (rule.style.backgroundColor) {
          cell.style.backgroundColor = rule.style.backgroundColor;
          if (!rule.style.color) {
            const textColor = getContrastTextColor(rule.style.backgroundColor);
            if (textColor) cell.style.color = textColor;
          }
        }
        if (rule.style.fontWeight) cell.style.fontWeight = rule.style.fontWeight;
        if (rule.style.fontStyle) cell.style.fontStyle = rule.style.fontStyle;
        
        if (rule.style.dataBar && (type === 'int' || type === 'float')) {
          const stats = calculateStatistics(colIdx);
          if (stats.min !== undefined && stats.max !== undefined && stats.max !== stats.min) {
            const percent = ((value - stats.min) / (stats.max - stats.min)) * 100;
            cell.style.background = `linear-gradient(to right, ${rule.style.dataBar} ${percent}%, transparent ${percent}%)`;
          }
        }
        
        if (rule.style.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'format-icon';
          iconSpan.textContent = rule.style.icon;
          cell.insertBefore(iconSpan, cell.firstChild);
        }
      }
    }
  }
  
  applyPersistedColor(colIdx, cell, rowIdx);
}

function applyPersistedColor(colIdx, cell, rowIdx) {
  if (!state.relation || !state.relation.colored_items) return;
  if (!state.columnNames || !state.relation.items) return;
  
  const colName = state.columnNames[colIdx];
  const coloredItems = state.relation.colored_items[colName];
  if (!coloredItems || coloredItems.length === 0) return;
  
  const idColIdx = state.columnNames.indexOf('id');
  if (idColIdx < 0) return;
  
  const row = state.relation.items[rowIdx];
  if (!row) return;
  
  const rowId = row[idColIdx];
  
  if (rowId === null || rowId === undefined) return;
  
  const colorItem = coloredItems.find(item => item.id === rowId);
  if (colorItem) {
    cell.style.backgroundColor = colorItem.color;
    const textColor = getContrastTextColor(colorItem.color);
    if (textColor) cell.style.color = textColor;
  }
}

function matchesFormattingCondition(value, condition, type) {
  if (condition.activeFilter) return hasActiveFilter();
  if (condition.equals !== undefined) return value === condition.equals;
  if (condition.gt !== undefined && value <= condition.gt) return false;
  if (condition.gte !== undefined && value < condition.gte) return false;
  if (condition.lt !== undefined && value >= condition.lt) return false;
  if (condition.lte !== undefined && value > condition.lte) return false;
  if (condition.isNull) return value === null || value === undefined;
  if (condition.isNotNull) return value !== null && value !== undefined;
  if (condition.contains && typeof value === 'string') {
    return value.toLowerCase().includes(condition.contains.toLowerCase());
  }
  return true;
}

function renderPagination(st = state) {
  // Get container - from instance container or pagination container
  const paginationContainer = st.container
    ? st.container.querySelector('.relation-pagination')
    : el('.relation-pagination');
  if (!paginationContainer) return;
  
  const totalRecords = st.relation.items.length;
  const filteredRecords = getSortedIndices(st).length;
  const selectedRecords = getSelectedRows(st).size;
  
  // Handle empty results: show 0 of 0 with disabled controls
  const hasResults = filteredRecords > 0;
  const totalPages = hasResults ? getTotalPages(st) : 0;
  const currentPage = hasResults ? getCurrentPage(st) : 0;
  
  const hasFilter = filteredRecords !== totalRecords;
  
  const showMulticheck = st.rel_options.show_multicheck;
  paginationContainer.innerHTML = `
    <div class="pagination-info">
      <span class="pagination-total">${totalRecords} total</span>
      ${hasFilter ? `<span class="pagination-filtered">${filteredRecords} filtered</span>` : ''}
      <span class="pagination-selected${showMulticheck ? '' : ' hidden'}">${selectedRecords} selected</span>
    </div>
    <div class="pagination-size">
      <label>Per page:</label>
      <select class="page-size-select" ${!hasResults ? 'disabled' : ''}>
        <option value="5" ${getPageSize(st) === 5 ? 'selected' : ''}>5</option>
        <option value="10" ${getPageSize(st) === 10 ? 'selected' : ''}>10</option>
        <option value="20" ${getPageSize(st) === 20 ? 'selected' : ''}>20</option>
        <option value="50" ${getPageSize(st) === 50 ? 'selected' : ''}>50</option>
        <option value="100" ${getPageSize(st) === 100 ? 'selected' : ''}>100</option>
        <option value="all" ${getPageSize(st) === 'all' ? 'selected' : ''}>All</option>
      </select>
    </div>
    <div class="pagination-nav">
      <button class="btn-page btn-first" ${!hasResults || currentPage === 1 ? 'disabled' : ''}>⟨⟨</button>
      <button class="btn-page btn-prev" ${!hasResults || currentPage === 1 ? 'disabled' : ''}>⟨</button>
      <span class="page-indicator">
        <input type="number" class="page-input" value="${currentPage}" min="${hasResults ? 1 : 0}" max="${totalPages}" ${!hasResults ? 'disabled' : ''} />
        <span>of ${totalPages}</span>
      </span>
      <button class="btn-page btn-next" ${!hasResults || currentPage >= totalPages ? 'disabled' : ''}>⟩</button>
      <button class="btn-page btn-last" ${!hasResults || currentPage >= totalPages ? 'disabled' : ''}>⟩⟩</button>
    </div>
    <div class="pagination-actions${showMulticheck ? '' : ' hidden'}">
      <select class="selection-actions selection-actions-select" ${!hasResults ? 'disabled' : ''}>
        <option value="" disabled selected>Selection Actions...</option>
        <option value="invert-page">↔ Invert Page</option>
        <option value="invert-all">↔ Invert All</option>
        <option value="remove-selected" ${selectedRecords === 0 ? 'disabled' : ''}>✕ Remove Selected (${selectedRecords})</option>
        <option value="remove-unselected" ${selectedRecords === 0 ? 'disabled' : ''}>✕ Remove Unselected (${filteredRecords - selectedRecords})</option>
      </select>
    </div>
  `;
  
  // Helper to query within container or global
  const queryEl = (selector) => paginationContainer.querySelector(selector);
  
  // Event listeners
  queryEl('.page-size-select')?.addEventListener('change', (e) => {
    setPageSize(st, e.target.value === 'all' ? 'all' : parseInt(e.target.value));
    setCurrentPage(st, 1);
    renderTable(st);
  });
  
  queryEl('.btn-first')?.addEventListener('click', () => {
    setCurrentPage(st, 1);
    renderTable(st);
  });
  
  queryEl('.btn-prev')?.addEventListener('click', () => {
    if (getCurrentPage(st) > 1) {
      setCurrentPage(st, getCurrentPage(st) - 1);
      renderTable(st);
    }
  });
  
  queryEl('.btn-next')?.addEventListener('click', () => {
    if (getCurrentPage(st) < getTotalPages(st)) {
      setCurrentPage(st, getCurrentPage(st) + 1);
      renderTable(st);
    }
  });
  
  queryEl('.btn-last')?.addEventListener('click', () => {
    setCurrentPage(st, getTotalPages(st));
    renderTable(st);
  });
  
  queryEl('.page-input')?.addEventListener('change', (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= getTotalPages(st)) {
      setCurrentPage(st, page);
      renderTable(st);
    }
  });
  
  queryEl('.selection-actions')?.addEventListener('change', (e) => {
    const action = e.target.value;
    e.target.value = ''; // Reset to placeholder
    
    switch (action) {
      case 'invert-page':
        invertSelection(true, st);
        break;
      case 'invert-all':
        invertSelection(false, st);
        break;
      case 'remove-selected':
        removeSelectedRows(st);
        break;
      case 'remove-unselected':
        removeUnselectedRows(st);
        break;
    }
  });
}

function syncFooterColumnWidths(mainTable, footerTable) {
  // Wait for DOM to render, then sync widths
  requestAnimationFrame(() => {
    // Select only header row th cells, not parent row (relation-parent-row) cells
    const headerRow = mainTable.querySelector('thead tr:not(.relation-parent-row)');
    const mainCells = headerRow ? headerRow.querySelectorAll('th') : [];
    const footerCells = footerTable.querySelectorAll('tfoot td');
    
    mainCells.forEach((th, idx) => {
      if (footerCells[idx]) {
        footerCells[idx].style.width = th.offsetWidth + 'px';
        footerCells[idx].style.minWidth = th.offsetWidth + 'px';
      }
    });
    
    // Match total table width
    footerTable.style.width = mainTable.offsetWidth + 'px';
  });
  
  // Sync horizontal scroll (footer has overflow hidden, main controls scroll)
  const tableWrapper = mainTable.closest('.relation-table-wrapper');
  const footerWrapper = footerTable.closest('.relation-footer-wrapper');
  
  if (tableWrapper && footerWrapper) {
    tableWrapper.addEventListener('scroll', () => {
      footerWrapper.scrollLeft = tableWrapper.scrollLeft;
    });
  }
}

function renderTable(st = state) {
  // Get container - from instance container or global DOM
  const container = st.container 
    ? st.container.querySelector('.relation-table-container')
    : el('.relation-table-container');
  
  if (!container) return;
  container.innerHTML = '';
  
  if (!st.relation || !st.relation.columns || !st.relation.items) {
    container.innerHTML = '<p class="text-muted-foreground">No data to display</p>';
    return;
  }
  
  // Apply filters and sorting
  applyFilters(st);
  applySorting(st);
  
  const pageIndices = getCurrentPageIndices(st);
  
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'relation-table-wrapper';
  
  const table = document.createElement('table');
  table.className = 'relation-table';
  if (!st.rel_options.editable) {
    table.classList.add('relation-table-readonly');
  }
  
  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // Selection checkbox column
  const selectTh = document.createElement('th');
  selectTh.className = 'relation-th-select' + (st.rel_options.show_multicheck ? '' : ' hidden');
  selectTh.innerHTML = `<input type="checkbox" class="select-all-checkbox" />`;
  headerRow.appendChild(selectTh);
  
  // Operations column header (position 2)
  const opsTh = document.createElement('th');
  opsTh.className = 'relation-th-ops';
  opsTh.textContent = '';
  headerRow.appendChild(opsTh);
  
  // Index column
  const indexTh = document.createElement('th');
  indexTh.textContent = '#';
  indexTh.className = 'relation-th-index' + (st.rel_options.show_natural_order ? '' : ' hidden');
  headerRow.appendChild(indexTh);
  
  // Group info header (if any groups)
  if (getGroupByColumns(st).length > 0) {
    const groupInfo = document.createElement('div');
    groupInfo.className = 'group-by-indicator';
    
    let groupHtml = '<span>Grouped by:</span>';
    getGroupByColumns(st).forEach(colIdx => {
      const colName = st.columnNames[colIdx];
      const uniqueValues = getUniqueValuesForColumn(colIdx, st);
      const currentValue = getGroupBySelectedValues(st)[colIdx];
      const hasSelection = currentValue !== undefined;
      
      const colType = st.columnTypes[colIdx];
      groupHtml += `
        <div class="group-by-col" data-col="${colIdx}">
          <strong>${colName}:</strong>
          <select class="group-value-select" data-col="${colIdx}">
            <option value="__all__"${!hasSelection ? ' selected' : ''}>All (${uniqueValues.length})</option>
            ${uniqueValues.map(v => {
              const val = v === null ? '__null__' : v;
              let label;
              if (v === null) {
                label = '(null)';
              } else if (colType === 'select') {
                const colOptions = st.options[colName];
                label = (colOptions && colOptions[v] !== undefined) ? colOptions[v] : String(v);
              } else {
                label = String(v);
              }
              const selected = hasSelection && String(currentValue) === String(v) ? ' selected' : '';
              return `<option value="${val}"${selected}>${escapeHtml(label)}</option>`;
            }).join('')}
          </select>
        </div>
      `;
    });
    groupHtml += '<button class="btn-clear-groups" data-testid="button-clear-groups">✕ Clear</button>';
    
    groupInfo.innerHTML = groupHtml;
    container.appendChild(groupInfo);
    
    groupInfo.querySelector('.btn-clear-groups').addEventListener('click', () => {
      setGroupByColumns(st, []);
      setGroupBySelectedValues(st, {});
      renderTable(st);
    });
    
    groupInfo.querySelectorAll('.group-value-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const colIdx = parseInt(e.target.dataset.col);
        const value = e.target.value;
        
        if (value === '__all__') {
          delete getGroupBySelectedValues(st)[colIdx];
        } else if (value === '__null__') {
          getGroupBySelectedValues(st)[colIdx] = null;
        } else {
          getGroupBySelectedValues(st)[colIdx] = value;
        }
        
        setCurrentPage(st, 1);
        renderTable(st);
      });
    });
  }
  
  // Data columns (skip grouped columns)
  st.columnNames.forEach((name, idx) => {
    if (getGroupByColumns(st).includes(idx)) return;
    
    const th = document.createElement('th');
    const type = st.columnTypes[idx];
    const isHiddenId = type === 'id' && !st.rel_options.show_id;
    th.className = 'relation-th-sortable' + (isHiddenId ? ' hidden' : '');
    th.dataset.col = idx;
    const sortIndicator = getSortIndicator(idx, st);
    const filterActive = getFilters(st)[idx] ? ' filter-active' : '';
    const colSelected = getSelectedColumns(st).has(idx) ? ' col-selected' : '';
    const filterIcon = getFilters(st)[idx] ? `<span class="filter-icon" data-col="${idx}" title="Filter active">⧩</span>` : '';
    th.innerHTML = `
      <div class="relation-th-content${filterActive}${colSelected}">
        <span class="relation-col-name">${name}${sortIndicator}${filterIcon}</span>
        <span class="relation-col-type">${type}</span>
      </div>
    `;
    headerRow.appendChild(th);
  });
  
  // Parent row (above header, no click handlers)
  const parentRow = document.createElement('tr');
  parentRow.className = 'relation-parent-row' + (shouldShowHierarchy(st) ? '' : ' hidden');
  
  // Parent row cells with first item data (temporary example)
  const firstItem = st.relation.items.length > 0 ? st.relation.items[0] : null;
  
  // Select column - empty
  const parentSelectTh = document.createElement('th');
  parentSelectTh.className = 'relation-th-parent' + (st.rel_options.show_multicheck ? '' : ' hidden');
  parentRow.appendChild(parentSelectTh);
  
  // Ops column - up button here
  const parentOpsTh = document.createElement('th');
  parentOpsTh.className = 'relation-th-parent';
  const btnParentUp = document.createElement('button');
  btnParentUp.className = 'btn-parent-up';
  btnParentUp.title = 'Move to the upper level';
  btnParentUp.textContent = '↑';
  btnParentUp.dataset.testid = 'button-parent-up';
  parentOpsTh.appendChild(btnParentUp);
  parentRow.appendChild(parentOpsTh);
  
  // Index column - always empty
  const parentIndexTh = document.createElement('th');
  parentIndexTh.className = 'relation-th-parent' + (st.rel_options.show_natural_order ? '' : ' hidden');
  parentRow.appendChild(parentIndexTh);
  
  // Data columns
  st.columnNames.forEach((name, idx) => {
    if (getGroupByColumns(st).includes(idx)) return;
    const th = document.createElement('th');
    const type = st.columnTypes[idx];
    const isHiddenId = type === 'id' && !st.rel_options.show_id;
    th.className = 'relation-th-parent' + (isHiddenId ? ' hidden' : '');
    if (firstItem) {
      const value = firstItem[idx];
      
      if (type === 'relation') {
        const btn = document.createElement('button');
        btn.className = 'relation-cell-btn';
        const count = value?.items?.length || 0;
        btn.innerHTML = `📋 ${count}`;
        btn.title = `View nested relation (${count} rows)`;
        btn.dataset.row = '0';
        btn.dataset.col = idx;
        btn.dataset.testid = `button-parent-relation-${idx}`;
        th.appendChild(btn);
      } else {
        th.textContent = value !== null && value !== undefined ? String(value) : '';
      }
    }
    parentRow.appendChild(th);
  });
  
  thead.appendChild(parentRow);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Body
  const tbody = document.createElement('tbody');
  
  pageIndices.forEach((rowIdx) => {
    const row = st.relation.items[rowIdx];
    const tr = document.createElement('tr');
    tr.dataset.rowIdx = rowIdx;
    
    if (getSelectedRows(st).has(rowIdx)) {
      tr.classList.add('row-selected');
    }
    if (getHighlightedRow(st) === rowIdx) {
      tr.classList.add('row-highlighted');
    }
    
    // Selection checkbox
    const selectTd = document.createElement('td');
    selectTd.className = 'relation-td-select' + (st.rel_options.show_multicheck ? '' : ' hidden');
    const selectCheckbox = document.createElement('input');
    selectCheckbox.type = 'checkbox';
    selectCheckbox.checked = getSelectedRows(st).has(rowIdx);
    selectCheckbox.dataset.rowIdx = rowIdx;
    selectCheckbox.className = 'row-select-checkbox';
    selectTd.appendChild(selectCheckbox);
    tr.appendChild(selectTd);
    
    // Operations button (position 2)
    const opsTd = document.createElement('td');
    opsTd.className = 'relation-td-ops';
    opsTd.innerHTML = `<button class="btn-row-ops" data-row="${rowIdx}" title="Row operations">⋮</button>`;
    tr.appendChild(opsTd);
    
    // Index
    const indexTd = document.createElement('td');
    indexTd.textContent = rowIdx + 1;
    indexTd.className = 'relation-td-index' + (st.rel_options.show_natural_order ? '' : ' hidden');
    tr.appendChild(indexTd);
    
    // Data cells (skip grouped columns)
    row.forEach((value, colIdx) => {
      if (getGroupByColumns(st).includes(colIdx)) return;
      
      const td = document.createElement('td');
      const type = st.columnTypes[colIdx];
      const isHiddenId = type === 'id' && !st.rel_options.show_id;
      if (isHiddenId) td.classList.add('hidden');
      td.appendChild(createInputForType(type, value, rowIdx, colIdx, st.rel_options.editable, st));
      applyConditionalFormatting(value, colIdx, td, rowIdx, st);
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  // Calculate height based on actual rendered content after DOM insertion
  requestAnimationFrame(() => {
    if (getManualResizeHeight(st)) {
      // Use manually set height
      tableWrapper.style.maxHeight = getManualResizeHeight(st) + 'px';
    } else {
      // Calculate based on actual row heights
      const theadEl = table.querySelector('thead');
      const theadHeight = theadEl ? theadEl.offsetHeight : 40;
      const rows = tbody.querySelectorAll('tr');
      let totalRowHeight = 0;
      const maxRows = getPageSize(st) === 'all' ? Math.min(rows.length, 20) : getPageSize(st);
      for (let i = 0; i < Math.min(rows.length, maxRows); i++) {
        totalRowHeight += rows[i].offsetHeight;
      }
      // If fewer rows than pageSize, estimate remaining
      if (rows.length < maxRows && rows.length > 0) {
        const avgRowHeight = totalRowHeight / rows.length;
        totalRowHeight = avgRowHeight * maxRows;
      }
      // +20 for borders, padding, and scrollbar prevention
      const calculatedHeight = theadHeight + totalRowHeight + 20;
      tableWrapper.style.maxHeight = calculatedHeight + 'px';
    }
  });
  
  // Footer table (separate, outside scroll area)
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'relation-footer-wrapper';
  
  const footerTable = document.createElement('table');
  footerTable.className = 'relation-table relation-footer-table';
  
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  
  const footerSelectTd = document.createElement('td');
  if (!st.rel_options.show_multicheck) footerSelectTd.classList.add('hidden');
  footerRow.appendChild(footerSelectTd); // Select column
  footerRow.appendChild(document.createElement('td')); // Operations column
  const footerIndexTd = document.createElement('td');
  if (!st.rel_options.show_natural_order) footerIndexTd.classList.add('hidden');
  footerRow.appendChild(footerIndexTd); // Index column
  
  st.columnNames.forEach((_, colIdx) => {
    if (getGroupByColumns(st).includes(colIdx)) return;
    
    const td = document.createElement('td');
    const type = st.columnTypes[colIdx];
    const isHiddenId = type === 'id' && !st.rel_options.show_id;
    td.className = 'relation-td-stats' + (isHiddenId ? ' hidden' : '');
    td.innerHTML = `<button class="btn-stats" data-col="${colIdx}" title="Statistics">Σ</button>`;
    footerRow.appendChild(td);
  });
  
  tfoot.appendChild(footerRow);
  footerTable.appendChild(tfoot);
  footerWrapper.appendChild(footerTable);
  container.appendChild(footerWrapper);
  
  // Sync column widths between main table and footer
  syncFooterColumnWidths(table, footerTable);
  
  // Pagination
  const paginationDiv = document.createElement('div');
  paginationDiv.id = 'relation-pagination';
  paginationDiv.className = 'relation-pagination';
  container.appendChild(paginationDiv);
  renderPagination(st);
  
  // Update header checkbox state
  updateHeaderCheckbox(st, container);
  
  // Attach event listeners
  attachTableEventListeners(st, container);
  
  // Re-add resize handle if it was removed
  const existingHandle = container.querySelector('.resize-handle');
  if (!existingHandle) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.dataset.testid = 'resize-handle';
    container.appendChild(resizeHandle);
    if (st === state) setupResizeHandle();
  }
}

// Global flag to prevent menu close after long press
let longPressJustTriggered = false;

function addLongPressSupport(element, callback, duration = 500) {
  let pressTimer = null;
  let longPressTriggered = false;
  
  const startPress = (e) => {
    longPressTriggered = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    pressTimer = setTimeout(() => {
      longPressTriggered = true;
      longPressJustTriggered = true;
      callback(e, clientX, clientY);
      // Reset flag after a short delay to allow click events to be ignored
      setTimeout(() => { longPressJustTriggered = false; }, 300);
    }, duration);
  };
  
  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };
  
  element.addEventListener('mousedown', startPress);
  element.addEventListener('mouseup', cancelPress);
  element.addEventListener('mouseleave', cancelPress);
  element.addEventListener('touchstart', (e) => {
    // Prevent default context menu on long press
    e.target.addEventListener('contextmenu', (ev) => ev.preventDefault(), { once: true });
    startPress(e);
  }, { passive: true });
  element.addEventListener('touchend', cancelPress);
  element.addEventListener('touchmove', cancelPress);
  
  // Return a function to check if long press was triggered (to prevent click)
  element._wasLongPress = () => longPressTriggered;
}

function attachTableEventListeners(st = state, container = null) {
  // Get the table container to scope event listener queries
  const tableContainer = container || el('.relation-table-container');
  if (!tableContainer) return;
  
  // Header click for sorting
  tableContainer.querySelectorAll('.relation-th-sortable').forEach(th => {
    // Add long press support for context menu
    addLongPressSupport(th, (e, clientX, clientY) => {
      e.preventDefault?.();
      const colIdx = parseInt(th.dataset.col);
      showColumnMenu(colIdx, clientX, clientY, st);
    });
    
    th.addEventListener('click', (e) => {
      // Skip if this was a long press
      if (th._wasLongPress && th._wasLongPress()) return;
      
      const colIdx = parseInt(th.dataset.col);
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+click toggles column selection
        if (getSelectedColumns(st).has(colIdx)) {
          getSelectedColumns(st).delete(colIdx);
        } else {
          getSelectedColumns(st).add(colIdx);
        }
        renderTable(st);
      } else {
        // Normal click or shift+click for sorting
        handleSort(colIdx, e.shiftKey, st);
      }
    });
    
    th.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const colIdx = parseInt(th.dataset.col);
      showColumnMenu(colIdx, e.clientX, e.clientY, st);
    });
  });
  
  // Filter icon click - opens appropriate filter dialog
  tableContainer.querySelectorAll('.filter-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent header click/sort
      const colIdx = parseInt(icon.dataset.col);
      openFilterDialogForColumn(colIdx, st);
    });
  });
  
  // Select all checkbox
  tableContainer.querySelector('.select-all-checkbox')?.addEventListener('click', () => toggleSelectAll(st));
  
  // Row selection
  tableContainer.querySelectorAll('.row-select-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const rowIdx = parseInt(e.target.dataset.rowIdx);
      if (e.target.checked) {
        getSelectedRows(st).add(rowIdx);
      } else {
        getSelectedRows(st).delete(rowIdx);
      }
      updateHeaderCheckbox(st, tableContainer);
      renderPagination(st);
      e.target.closest('tr').classList.toggle('row-selected', e.target.checked);
    });
  });
  
  // Row click for highlighting
  tableContainer.querySelectorAll('tbody tr').forEach(tr => {
    tr.addEventListener('click', (e) => {
      // Don't highlight if clicking directly on interactive elements
      if (e.target.matches('input, button, select, textarea, .btn-row-ops')) return;
      // Also skip if clicking on a nested table or its contents
      if (e.target.closest('.nested-relation-table-dynamic')) return;
      
      const rowIdx = parseInt(tr.dataset.rowIdx);
      if (isNaN(rowIdx)) return;
      
      // Toggle highlight: if same row clicked again, unhighlight
      const currentHighlight = getHighlightedRow(st);
      if (currentHighlight === rowIdx) {
        setHighlightedRow(st, null);
        tr.classList.remove('row-highlighted');
      } else {
        // Remove highlight from previous row
        tableContainer.querySelectorAll('tbody tr.row-highlighted').forEach(row => {
          row.classList.remove('row-highlighted');
        });
        setHighlightedRow(st, rowIdx);
        tr.classList.add('row-highlighted');
      }
    });
  });
  
  // Statistics buttons
  tableContainer.querySelectorAll('.btn-stats').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const colIdx = parseInt(e.target.dataset.col);
      showStatisticsPanel(colIdx, st);
    });
  });
  
  // Cell editing
  tableContainer.addEventListener('change', (e) => {
    if (e.target.matches('.relation-input, .relation-textarea, .relation-select')) {
      updateRelationFromInput(e.target, st);
    }
  });
  
  // Row operations button
  tableContainer.querySelectorAll('.btn-row-ops').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rowIdx = parseInt(btn.dataset.row);
      showRowMenuForInstance(st, rowIdx, e.clientX, e.clientY);
    });
  });
  
  // Relation cell buttons (for nested relations)
  tableContainer.querySelectorAll('.relation-cell-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rowIdx = parseInt(btn.dataset.row);
      const colIdx = parseInt(btn.dataset.col);
      showNestedRelationDialog(rowIdx, colIdx, st);
    });
  });
}

function updateBoolCheckbox(checkbox, value) {
  checkbox.classList.remove('bool-tristate-true', 'bool-tristate-false', 'bool-tristate-null');
  
  // Use setTimeout to ensure DOM properties are set after the event cycle completes
  setTimeout(() => {
    if (value === true) {
      checkbox.checked = true;
      checkbox.indeterminate = false;
      checkbox.classList.add('bool-tristate-true');
    } else if (value === false) {
      checkbox.checked = false;
      checkbox.indeterminate = false;
      checkbox.classList.add('bool-tristate-false');
    } else {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      checkbox.classList.add('bool-tristate-null');
    }
  }, 0);
}

function handleSort(colIdx, addToExisting, st = state) {
  const existingIdx = getSortCriteria(st).findIndex(c => c.column === colIdx);
  
  if (existingIdx >= 0) {
    const existing = getSortCriteria(st)[existingIdx];
    if (existing.direction === 'asc') {
      existing.direction = 'desc';
    } else {
      getSortCriteria(st).splice(existingIdx, 1);
    }
  } else {
    if (!addToExisting) {
      setSortCriteria(st, []);
    }
    getSortCriteria(st).push({ column: colIdx, direction: 'asc' });
  }
  
  renderTable(st);
}

function adjustMenuPosition(menu) {
  const rect = menu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = parseFloat(menu.style.left) || rect.left;
  let top = parseFloat(menu.style.top) || rect.top;
  
  // Adjust if menu goes beyond right edge
  if (rect.right > viewportWidth - 10) {
    left = Math.max(10, viewportWidth - rect.width - 10);
    menu.style.left = left + 'px';
  }
  
  // Adjust if menu goes beyond bottom edge
  if (rect.bottom > viewportHeight - 10) {
    top = Math.max(10, viewportHeight - rect.height - 10);
    menu.style.top = top + 'px';
  }
  
  // Adjust if menu goes beyond left edge
  if (rect.left < 10) {
    menu.style.left = '10px';
  }
  
  // Adjust if menu goes beyond top edge
  if (rect.top < 10) {
    menu.style.top = '10px';
  }
}

function showColumnMenu(colIdx, x, y, st = state) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'column-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const type = st.columnTypes[colIdx];
  const name = st.columnNames[colIdx];
  
  const isGrouped = getGroupByColumns(st).includes(colIdx);
  const isSelected = getSelectedColumns(st).has(colIdx);
  
  menu.innerHTML = `
    <div class="column-menu-header">${name} (${type})</div>
    <div class="column-menu-accordion">
      <div class="accordion-section" data-section="sort">
        <div class="accordion-header">Sort <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="sort-asc">↑ Ascending</button>
          <button class="column-menu-item" data-action="sort-desc">↓ Descending</button>
          <button class="column-menu-item" data-action="sort-clear">✕ Clear Sort</button>
        </div>
      </div>
      <div class="accordion-section" data-section="filter">
        <div class="accordion-header">Filter <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="filter-values">By Values...</button>
          ${type === 'int' || type === 'float' || type === 'date' || type === 'datetime' || type === 'time' ? `
            <button class="column-menu-item" data-action="filter-comparison">By Comparison...</button>
            <button class="column-menu-item" data-action="filter-top10">Top 10</button>
            <button class="column-menu-item" data-action="filter-top10p">Top 10%</button>
          ` : ''}
          ${type === 'string' || type === 'multilinestring' ? `
            <button class="column-menu-item" data-action="filter-text-criteria">By Criteria...</button>
          ` : ''}
          <button class="column-menu-item" data-action="filter-null">Only Null</button>
          <button class="column-menu-item" data-action="filter-not-null">Not Null</button>
          <button class="column-menu-item" data-action="filter-clear">✕ Clear Filter</button>
        </div>
      </div>
      <div class="accordion-section" data-section="group">
        <div class="accordion-header">Group By <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item ${isGrouped ? 'active' : ''}" data-action="toggle-group">${isGrouped ? '✓ Grouped' : 'Group by this column'}</button>
          <button class="column-menu-item" data-action="clear-groups">✕ Clear All Groups</button>
        </div>
      </div>
      ${type === 'relation' ? `
      <div class="accordion-section" data-section="relation">
        <div class="accordion-header">Relation <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="expand-relation">⊗ Cartesian Product</button>
        </div>
      </div>
      ` : ''}
      <div class="accordion-section" data-section="selection">
        <div class="accordion-header">Column Selection <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item ${isSelected ? 'active' : ''}" data-action="toggle-select-col">${isSelected ? '✓ Selected' : 'Select Column'}</button>
          <button class="column-menu-item" data-action="select-all-cols">Select All Columns</button>
          <button class="column-menu-item ${getSelectedColumns(st).size > 0 ? '' : 'disabled'}" data-action="group-selected-cols" ${getSelectedColumns(st).size > 0 ? '' : 'disabled'}>Group Selected → Relation</button>
          <button class="column-menu-item ${getSelectedColumns(st).size > 0 ? '' : 'disabled'}" data-action="clear-col-selection" ${getSelectedColumns(st).size > 0 ? '' : 'disabled'}>Clear Selection</button>
        </div>
      </div>
      <div class="accordion-section" data-section="formatting">
        <div class="accordion-header">Conditional Formatting <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="format-databar">Color Bar</button>
          <button class="column-menu-item" data-action="format-color-scale">Color Scale</button>
          <button class="column-menu-item ${hasActiveFilter(st) ? '' : 'disabled'}" data-action="format-active-filter" ${hasActiveFilter(st) ? '' : 'disabled'}>Active Filter Color...</button>
          <button class="column-menu-item" data-action="format-clear">✕ Clear Formatting</button>
        </div>
      </div>
      <div class="accordion-section" data-section="remove">
        <div class="accordion-header">Remove <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="remove-column">Remove Column</button>
          <button class="column-menu-item ${getSelectedColumns(st).size > 1 ? '' : 'disabled'}" data-action="remove-selected-cols" ${getSelectedColumns(st).size > 1 ? '' : 'disabled'}>Remove Selected Columns (${getSelectedColumns(st).size})</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Accordion behavior - only one open at a time
  menu.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      const section = header.parentElement;
      const isOpen = section.classList.contains('open');
      
      // Close all sections
      menu.querySelectorAll('.accordion-section').forEach(s => s.classList.remove('open'));
      
      // Open clicked section if it was closed
      if (!isOpen) {
        section.classList.add('open');
      }
      
      // Adjust position after size change
      requestAnimationFrame(() => adjustMenuPosition(menu));
    });
  });
  
  // Initial position adjustment
  requestAnimationFrame(() => adjustMenuPosition(menu));
  
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    handleColumnMenuAction(colIdx, action, st);
    menu.remove();
  });
  
  document.addEventListener('click', function closeMenu(e) {
    // Don't close if this click is from a long press release
    if (longPressJustTriggered) return;
    
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  }, { once: false });
}

function handleColumnMenuAction(colIdx, action, st = state) {
  switch (action) {
    case 'sort-asc':
      setSortCriteria(st, [{ column: colIdx, direction: 'asc' }]);
      break;
    case 'sort-desc':
      setSortCriteria(st, [{ column: colIdx, direction: 'desc' }]);
      break;
    case 'sort-clear':
      setSortCriteria(st, getSortCriteria(st).filter(c => c.column !== colIdx));
      break;
    case 'filter-values':
      showFilterValuesDialog(colIdx, st);
      return;
    case 'filter-comparison':
      showFilterComparisonDialog(colIdx, st);
      return;
    case 'filter-text-criteria':
      showFilterTextCriteriaDialog(colIdx, st);
      return;
    case 'filter-null':
      getFilters(st)[colIdx] = { type: 'criteria', criteria: { nullOnly: true } };
      break;
    case 'filter-not-null':
      getFilters(st)[colIdx] = { type: 'criteria', criteria: { notNull: true } };
      break;
    case 'filter-top10':
      applyTopFilter(colIdx, 10, false, st);
      break;
    case 'filter-top10p':
      applyTopFilter(colIdx, 10, true, st);
      break;
    case 'filter-clear':
      delete getFilters(st)[colIdx];
      break;
    case 'format-databar':
      getFormatting(st)[colIdx] = [{ condition: {}, style: { dataBar: 'var(--primary-200)' } }];
      break;
    case 'format-color-scale':
      applyColorScale(colIdx, st);
      break;
    case 'format-clear':
      delete getFormatting(st)[colIdx];
      // Also clear persisted colors for this column
      if (st.relation.colored_items) {
        const colName = st.columnNames[colIdx];
        delete st.relation.colored_items[colName];
      }
      break;
    case 'toggle-group':
      toggleGroupBy(colIdx, st);
      return;
    case 'clear-groups':
      setGroupByColumns(st, []);
      setGroupBySelectedValues(st, {});
      break;
    case 'expand-relation':
      expandRelationColumn(colIdx, st);
      return;
    case 'toggle-select-col':
      if (getSelectedColumns(st).has(colIdx)) {
        getSelectedColumns(st).delete(colIdx);
      } else {
        getSelectedColumns(st).add(colIdx);
      }
      break;
    case 'select-all-cols':
      st.columnNames.forEach((_, idx) => {
        getSelectedColumns(st).add(idx);
      });
      break;
    case 'group-selected-cols':
      showGroupColumnsDialog(st);
      return;
    case 'clear-col-selection':
      getSelectedColumns(st).clear();
      break;
    case 'format-active-filter':
      showActiveFilterColorDialog(colIdx, st);
      return;
    case 'remove-column':
      removeColumn(colIdx, st);
      break;
    case 'remove-selected-cols':
      removeSelectedColumns(st);
      break;
  }
  
  setCurrentPage(st, 1);
  renderTable(st);
}

function applyTopFilter(colIdx, n, isPercent, st = state) {
  const values = st.relation.items
    .map((row, idx) => ({ value: row[colIdx], idx }))
    .filter(item => item.value !== null && item.value !== undefined)
    .sort((a, b) => b.value - a.value);
  
  const count = isPercent ? Math.ceil(values.length * n / 100) : Math.min(n, values.length);
  const topIndices = new Set(values.slice(0, count).map(item => item.idx));
  
  // Use indices-based filter for accuracy with duplicates
  getFilters(st)[colIdx] = { type: 'indices', indices: topIndices };
}

function applyColorScale(colIdx, st = state) {
  const stats = calculateStatistics(colIdx, st);
  if (stats.min === undefined || stats.max === undefined) return;
  
  const range = stats.max - stats.min;
  if (range === 0) return;
  
  const rules = [];
  const steps = 5;
  const colors = ['#f87171', '#fb923c', '#facc15', '#a3e635', '#4ade80'];
  
  for (let i = 0; i < steps; i++) {
    const minVal = stats.min + (range / steps) * i;
    const maxVal = stats.min + (range / steps) * (i + 1);
    rules.push({
      condition: { gte: minVal, lt: maxVal },
      style: { backgroundColor: colors[i] }
    });
  }
  
  getFormatting(st)[colIdx] = rules;
}

function openFilterDialogForColumn(colIdx, st = state) {
  const filter = getFilters(st)[colIdx];
  const type = st.columnTypes[colIdx];
  
  if (!filter) {
    // No filter, open appropriate default dialog based on column type
    if (type === 'string' || type === 'multilinestring') {
      showFilterTextCriteriaDialog(colIdx, st);
    } else if (type === 'int' || type === 'float' || type === 'date' || type === 'datetime' || type === 'time') {
      showFilterComparisonDialog(colIdx, st);
    } else {
      showFilterValuesDialog(colIdx, st);
    }
    return;
  }
  
  // Open dialog based on current filter type
  if (filter.type === 'values') {
    showFilterValuesDialog(colIdx, st);
  } else if (filter.type === 'indices') {
    // Top 10 / Top 10% - show values dialog to see selected items
    showFilterValuesDialog(colIdx, st);
  } else if (filter.type === 'criteria') {
    if (filter.criteria.textOp) {
      showFilterTextCriteriaDialog(colIdx, st);
    } else if (filter.criteria.comparison) {
      showFilterComparisonDialog(colIdx, st);
    } else if (filter.criteria.nullOnly || filter.criteria.notNull) {
      // Null filters - show values dialog
      showFilterValuesDialog(colIdx, st);
    } else {
      showFilterValuesDialog(colIdx, st);
    }
  } else {
    showFilterValuesDialog(colIdx, st);
  }
}

function showFilterValuesDialog(colIdx, st = state) {
  closeAllMenus();
  
  const colName = st.columnNames[colIdx];
  const colOptions = st.options[colName] || {};
  const hasOptions = Object.keys(colOptions).length > 0;
  
  // Helper to get display label for a value
  const getDisplayLabel = (v) => {
    if (v === null) return '(null)';
    if (hasOptions && colOptions[v] !== undefined) {
      // Strip HTML tags for text display
      const html = colOptions[v];
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || String(v);
    }
    return String(v);
  };
  
  // Count occurrences of each value
  const valueCounts = new Map();
  const naturalOrder = [];
  st.relation.items.forEach(row => {
    const v = row[colIdx];
    if (!valueCounts.has(v)) {
      valueCounts.set(v, 0);
      naturalOrder.push(v);
    }
    valueCounts.set(v, valueCounts.get(v) + 1);
  });
  
  const currentFilter = getFilters(st)[colIdx];
  const selectedValues = currentFilter?.type === 'values' ? new Set(currentFilter.values) : new Set();
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  function sortValues(order) {
    let sorted = [...naturalOrder];
    if (order === 'asc') {
      sorted.sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        // Sort by display label, not key
        return getDisplayLabel(a).localeCompare(getDisplayLabel(b), undefined, { numeric: true });
      });
    } else if (order === 'desc') {
      sorted.sort((a, b) => {
        if (a === null) return 1;
        if (b === null) return -1;
        return getDisplayLabel(b).localeCompare(getDisplayLabel(a), undefined, { numeric: true });
      });
    } else if (order === 'histogram-desc') {
      sorted.sort((a, b) => {
        const countDiff = valueCounts.get(b) - valueCounts.get(a);
        if (countDiff !== 0) return countDiff;
        if (a === null) return 1;
        if (b === null) return -1;
        return getDisplayLabel(a).localeCompare(getDisplayLabel(b), undefined, { numeric: true });
      });
    } else if (order === 'histogram-asc') {
      sorted.sort((a, b) => {
        const countDiff = valueCounts.get(a) - valueCounts.get(b);
        if (countDiff !== 0) return countDiff;
        if (a === null) return -1;
        if (b === null) return 1;
        return getDisplayLabel(a).localeCompare(getDisplayLabel(b), undefined, { numeric: true });
      });
    }
    return sorted;
  }
  
  function renderValuesList(order) {
    const sorted = sortValues(order);
    const listEl = dialog.querySelector('.filter-values-list');
    listEl.innerHTML = sorted.map(v => {
      const displayLabel = getDisplayLabel(v).substring(0, 50);
      const count = valueCounts.get(v);
      const countLabel = count > 1 ? ` <span class="filter-value-count">#${count}</span>` : '';
      const checked = selectedValues.has(v) ? 'checked' : '';
      const dataValue = v === null ? '__null__' : String(v).replace(/"/g, '&quot;');
      return `<label class="filter-value-item"><input type="checkbox" data-value="${dataValue}" ${checked}><span>${displayLabel}${countLabel}</span></label>`;
    }).join('');
    
    // Re-attach checkbox listeners
    listEl.querySelectorAll('.filter-value-item input').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.dataset.value === '__null__' ? null : cb.dataset.value;
        if (cb.checked) {
          selectedValues.add(val);
        } else {
          selectedValues.delete(val);
        }
      });
    });
  }
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${st.columnNames[colIdx]}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-search-row">
      <input type="text" class="filter-search filter-input" placeholder="Search...">
      <button class="btn btn-sm filter-search-btn">Find</button>
      <button class="btn btn-sm filter-search-clear">Clear</button>
    </div>
    <div class="filter-dialog-actions">
      <button class="btn btn-sm filter-select-all">Select All</button>
      <button class="btn btn-sm filter-select-none">Select None</button>
      <select class="filter-sort-select filter-sort">
        <option value="natural">Natural Order</option>
        <option value="asc">Ascending ↑</option>
        <option value="desc">Descending ↓</option>
        <option value="histogram-desc">Histogram ↓</option>
        <option value="histogram-asc">Histogram ↑</option>
      </select>
    </div>
    <div class="filter-values-list"></div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline filter-clear">Clear Column Filter</button>
      <button class="btn btn-outline filter-clear-all">Clear All Filters</button>
      <button class="btn btn-outline filter-cancel">Cancel</button>
      <button class="btn btn-primary filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  renderValuesList('natural');
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('.filter-cancel').addEventListener('click', () => dialog.remove());
  dialog.querySelector('.filter-clear').addEventListener('click', () => {
    delete getFilters(st)[colIdx];
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  dialog.querySelector('.filter-clear-all').addEventListener('click', () => {
    setFilters(st, {});
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  
  // Search functionality - declare early so sort handler can use it
  let lastSearchIndex = -1;
  let lastSearchTerm = '';
  
  dialog.querySelector('.filter-sort').addEventListener('change', (e) => {
    // Get currently highlighted value before re-render
    const highlightedItem = dialog.querySelector('.filter-value-item.search-highlight input');
    const highlightedValue = highlightedItem ? highlightedItem.dataset.value : null;
    
    renderValuesList(e.target.value);
    
    // Restore highlight and scroll to preserved item
    if (highlightedValue !== null) {
      const listEl = dialog.querySelector('.filter-values-list');
      const items = listEl.querySelectorAll('.filter-value-item');
      for (let i = 0; i < items.length; i++) {
        const input = items[i].querySelector('input');
        if (input && input.dataset.value === highlightedValue) {
          items[i].classList.add('search-highlight');
          items[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
          lastSearchIndex = i;
          break;
        }
      }
    }
  });
  
  dialog.querySelector('.filter-select-all').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => {
      cb.checked = true;
      const val = cb.dataset.value === '__null__' ? null : cb.dataset.value;
      selectedValues.add(val);
    });
  });
  
  dialog.querySelector('.filter-select-none').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => cb.checked = false);
    selectedValues.clear();
  });
  
  const clearSearch = () => {
    const searchInput = dialog.querySelector('.filter-search');
    const listEl = dialog.querySelector('.filter-values-list');
    const items = listEl.querySelectorAll('.filter-value-item');
    
    searchInput.value = '';
    lastSearchIndex = -1;
    lastSearchTerm = '';
    items.forEach(item => item.classList.remove('search-highlight'));
    listEl.scrollTop = 0;
  };
  
  const performSearch = () => {
    const searchInput = dialog.querySelector('.filter-search');
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
      clearSearch();
      return;
    }
    
    const listEl = dialog.querySelector('.filter-values-list');
    const items = listEl.querySelectorAll('.filter-value-item');
    
    // If search term changed, reset
    if (searchTerm !== lastSearchTerm) {
      lastSearchIndex = -1;
      lastSearchTerm = searchTerm;
      // Remove previous highlights
      items.forEach(item => item.classList.remove('search-highlight'));
    }
    
    // Find next matching item starting from lastSearchIndex + 1
    let foundIndex = -1;
    for (let i = lastSearchIndex + 1; i < items.length; i++) {
      const text = items[i].textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        foundIndex = i;
        break;
      }
    }
    
    // If not found, wrap around to beginning
    if (foundIndex === -1) {
      for (let i = 0; i <= lastSearchIndex && i < items.length; i++) {
        const text = items[i].textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          foundIndex = i;
          break;
        }
      }
    }
    
    if (foundIndex !== -1) {
      // Remove previous highlights
      items.forEach(item => item.classList.remove('search-highlight'));
      
      // Highlight and scroll to found item
      const foundItem = items[foundIndex];
      foundItem.classList.add('search-highlight');
      foundItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
      foundItem.querySelector('input')?.focus();
      lastSearchIndex = foundIndex;
    }
  };
  
  dialog.querySelector('.filter-search-btn').addEventListener('click', performSearch);
  dialog.querySelector('.filter-search-clear').addEventListener('click', clearSearch);
  dialog.querySelector('.filter-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
  
  dialog.querySelector('.filter-apply').addEventListener('click', () => {
    if (selectedValues.size === 0 || selectedValues.size === naturalOrder.length) {
      delete getFilters(st)[colIdx];
    } else {
      getFilters(st)[colIdx] = { type: 'values', values: [...selectedValues] };
    }
    
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
}

function showFilterComparisonDialog(colIdx, st = state) {
  closeAllMenus();
  
  const type = st.columnTypes[colIdx];
  const name = st.columnNames[colIdx];
  const currentFilter = getFilters(st)[colIdx];
  
  const isDateTime = type === 'date' || type === 'datetime' || type === 'time';
  let inputType = 'number';
  if (type === 'date') inputType = 'date';
  if (type === 'datetime') inputType = 'datetime-local';
  if (type === 'time') inputType = 'time';
  
  const currentComparison = currentFilter?.criteria?.comparison || 'eq';
  const currentValue = currentFilter?.criteria?.value || '';
  const currentValue2 = currentFilter?.criteria?.value2 || '';
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${name}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-comparison-form">
      <div class="filter-form-row">
        <label>Operator:</label>
        <select class="filter-comparison-op filter-select">
          <option value="eq" ${currentComparison === 'eq' ? 'selected' : ''}>=  Equal</option>
          <option value="neq" ${currentComparison === 'neq' ? 'selected' : ''}>≠  Not Equal</option>
          <option value="gt" ${currentComparison === 'gt' ? 'selected' : ''}>>  Greater Than</option>
          <option value="gte" ${currentComparison === 'gte' ? 'selected' : ''}>≥  Greater or Equal</option>
          <option value="lt" ${currentComparison === 'lt' ? 'selected' : ''}><  Less Than</option>
          <option value="lte" ${currentComparison === 'lte' ? 'selected' : ''}>≤  Less or Equal</option>
          <option value="between" ${currentComparison === 'between' ? 'selected' : ''}>↔  Between</option>
        </select>
      </div>
      <div class="filter-form-row">
        <label class="filter-value-label">Value:</label>
        <input type="${inputType}" class="filter-comparison-value filter-input" value="${currentValue}" ${type === 'float' ? 'step="0.001"' : ''}>
      </div>
      <div class="filter-form-row filter-value2-row" style="display: ${currentComparison === 'between' ? 'flex' : 'none'}">
        <label>To:</label>
        <input type="${inputType}" class="filter-comparison-value2 filter-input" value="${currentValue2}" ${type === 'float' ? 'step="0.001"' : ''}>
      </div>
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline filter-clear">Clear Column Filter</button>
      <button class="btn btn-outline filter-clear-all">Clear All Filters</button>
      <button class="btn btn-outline filter-cancel">Cancel</button>
      <button class="btn btn-primary filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const opSelect = dialog.querySelector('.filter-comparison-op');
  const value2Row = dialog.querySelector('.filter-value2-row');
  const valueLabel = dialog.querySelector('.filter-value-label');
  const valueInput = dialog.querySelector('.filter-comparison-value');
  
  dialog.querySelector('.filter-clear').addEventListener('click', () => {
    delete getFilters(st)[colIdx];
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  dialog.querySelector('.filter-clear-all').addEventListener('click', () => {
    setFilters(st, {});
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  
  opSelect.addEventListener('change', () => {
    const isBetween = opSelect.value === 'between';
    value2Row.style.display = isBetween ? 'flex' : 'none';
    valueLabel.textContent = isBetween ? 'From:' : 'Value:';
    valueInput.focus();
  });
  
  // Focus value input by default
  valueInput.focus();
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('.filter-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('.filter-apply').addEventListener('click', () => {
    const comparison = opSelect.value;
    const value = dialog.querySelector('.filter-comparison-value').value;
    const value2 = dialog.querySelector('.filter-comparison-value2').value;
    
    if (!value) {
      dialog.remove();
      return;
    }
    
    const criteria = { comparison, value };
    if (comparison === 'between' && value2) {
      criteria.value2 = value2;
    }
    
    getFilters(st)[colIdx] = { type: 'criteria', criteria };
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
}

function showFilterTextCriteriaDialog(colIdx, st = state) {
  closeAllMenus();
  
  const name = st.columnNames[colIdx];
  const existingFilter = getFilters(st)[colIdx];
  
  // Get current filter values if any
  let currentOp = 'includes';
  let currentValue = '';
  let currentCaseSensitive = false;
  
  if (existingFilter?.type === 'criteria' && existingFilter.criteria.textOp) {
    currentOp = existingFilter.criteria.textOp;
    currentValue = existingFilter.criteria.textValue || '';
    currentCaseSensitive = existingFilter.criteria.caseSensitive || false;
  }
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${name}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-comparison-form">
      <div class="filter-form-row">
        <label>Operator:</label>
        <select class="filter-text-op filter-select">
          <option value="includes" ${currentOp === 'includes' ? 'selected' : ''}>includes</option>
          <option value="equals" ${currentOp === 'equals' ? 'selected' : ''}>equal to</option>
          <option value="startsWith" ${currentOp === 'startsWith' ? 'selected' : ''}>starts with</option>
          <option value="endsWith" ${currentOp === 'endsWith' ? 'selected' : ''}>ends with</option>
          <option value="regex" ${currentOp === 'regex' ? 'selected' : ''}>regular expression</option>
        </select>
      </div>
      <div class="filter-form-row">
        <label class="filter-text-value-label">Text:</label>
        <input type="text" class="filter-text-value filter-input" value="${currentValue.replace(/"/g, '&quot;')}" placeholder="Enter text...">
      </div>
      <div class="filter-form-row filter-case-row">
        <label></label>
        <label class="checkbox-label">
          <input type="checkbox" class="filter-case-sensitive" ${currentCaseSensitive ? 'checked' : ''}>
          Case sensitive
        </label>
      </div>
      <div class="filter-regex-help filter-regex-hint" style="display: ${currentOp === 'regex' ? 'block' : 'none'}">
        <div class="regex-help-title">Special Codes:</div>
        <div class="regex-help-grid">
          <span class="regex-code">\\d</span><span>digit (0-9)</span>
          <span class="regex-code">\\D</span><span>non-digit</span>
          <span class="regex-code">\\w</span><span>word char (a-z, A-Z, 0-9, _)</span>
          <span class="regex-code">\\W</span><span>non-word char</span>
          <span class="regex-code">\\s</span><span>whitespace</span>
          <span class="regex-code">\\S</span><span>non-whitespace</span>
          <span class="regex-code">.</span><span>any character</span>
          <span class="regex-code">^</span><span>start of text</span>
          <span class="regex-code">$</span><span>end of text</span>
          <span class="regex-code">*</span><span>0 or more</span>
          <span class="regex-code">+</span><span>1 or more</span>
          <span class="regex-code">?</span><span>0 or 1</span>
          <span class="regex-code">{n}</span><span>exactly n times</span>
          <span class="regex-code">{n,m}</span><span>n to m times</span>
          <span class="regex-code">[abc]</span><span>a, b, or c</span>
          <span class="regex-code">[^abc]</span><span>not a, b, or c</span>
          <span class="regex-code">(a|b)</span><span>a or b</span>
        </div>
        <div class="regex-help-title" style="margin-top: 6px;">Examples:</div>
        <div class="regex-examples">
          <code>^[A-Z]</code> starts with uppercase<br>
          <code>\\d{3}-\\d{4}</code> phone like 123-4567<br>
          <code>@.*\\.com$</code> ends with @...com
        </div>
      </div>
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline filter-clear">Clear Column Filter</button>
      <button class="btn btn-outline filter-clear-all">Clear All Filters</button>
      <button class="btn btn-outline filter-cancel">Cancel</button>
      <button class="btn btn-primary filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const opSelect = dialog.querySelector('.filter-text-op');
  const regexHint = dialog.querySelector('.filter-regex-hint');
  const valueLabel = dialog.querySelector('.filter-text-value-label');
  
  const textInput = dialog.querySelector('.filter-text-value');
  
  dialog.querySelector('.filter-clear').addEventListener('click', () => {
    delete getFilters(st)[colIdx];
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  dialog.querySelector('.filter-clear-all').addEventListener('click', () => {
    setFilters(st, {});
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
  
  opSelect.addEventListener('change', () => {
    const isRegex = opSelect.value === 'regex';
    regexHint.style.display = isRegex ? 'block' : 'none';
    valueLabel.textContent = isRegex ? 'Pattern:' : 'Text:';
    textInput.focus();
  });
  
  // Focus text input by default
  textInput.focus();
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('.filter-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('.filter-apply').addEventListener('click', () => {
    const textOp = opSelect.value;
    const textValue = dialog.querySelector('.filter-text-value').value;
    const caseSensitive = dialog.querySelector('.filter-case-sensitive').checked;
    
    if (!textValue) {
      dialog.remove();
      return;
    }
    
    // Validate regex if needed
    if (textOp === 'regex') {
      try {
        new RegExp(textValue, caseSensitive ? '' : 'i');
      } catch (e) {
        alert('Invalid regular expression: ' + e.message);
        return;
      }
    }
    
    getFilters(st)[colIdx] = { 
      type: 'criteria', 
      criteria: { textOp, textValue, caseSensitive } 
    };
    setCurrentPage(st, 1);
    dialog.remove();
    renderTable(st);
  });
}

function showStatisticsPanel(colIdx) {
  // Check if panel for this column is already open - if so, close it (toggle behavior)
  const existingPanel = document.querySelector(`.stats-panel[data-col="${colIdx}"]`);
  if (existingPanel) {
    existingPanel.remove();
    return;
  }
  
  closeAllMenus();
  
  const stats = calculateStatistics(colIdx);
  const type = state.columnTypes[colIdx];
  const name = state.columnNames[colIdx];
  
  const panel = document.createElement('div');
  panel.className = 'stats-panel';
  panel.dataset.col = colIdx;
  
  const nonNullPercent = ((stats.nonNull / stats.total) * 100).toFixed(2);
  
  let statsHtml = `
    <div class="stats-row"><span>Total Records:</span><span>${stats.total} (100.00%)</span></div>
    <div class="stats-row"><span>Non-null:</span><span>${stats.nonNull} (${nonNullPercent}%)</span></div>
    <div class="stats-row"><span>Null:</span><span>${stats.nullCount} (${stats.nullPercent}%)</span></div>
  `;
  
  if (type === 'int' || type === 'float') {
    // Add box plot visualization
    statsHtml += generateBoxPlotSVG(stats);
    
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min:</span><span>${stats.min?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Max:</span><span>${stats.max?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Sum:</span><span>${stats.sum?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.slice(0, 3).join(', ') ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev:</span><span>${stats.stdDev?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Variance:</span><span>${stats.variance?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
    `;
  } else if (type === 'select') {
    // Get mode display value
    const colOptions = state.options[name] || {};
    const modeDisplay = stats.mode?.map(k => colOptions[k] || k).join(', ') || '—';
    
    // Add histogram
    statsHtml += generateCategoricalHistogramSVG(stats, name);
    
    // Centrality measures
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Centrality</div>
      <div class="stats-row"><span>Categories:</span><span>${stats.categoryCount}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${modeDisplay}</span></div>
      <div class="stats-row"><span>Mode Count:</span><span>${stats.modeCount} (${stats.modePercent}%)</span></div>
    `;
    
    // Dispersion measures
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Dispersion</div>
      <div class="stats-row"><span>Variation Ratio:</span><span>${stats.variationRatio?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Entropy:</span><span>${stats.entropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Max Entropy:</span><span>${stats.maxEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Norm. Entropy:</span><span>${stats.normalizedEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Gini-Simpson:</span><span>${stats.giniSimpson?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>IQV:</span><span>${stats.iqv?.toFixed(4) ?? '—'}</span></div>
    `;
    
    // Frequency table (combined)
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Frequency Table</div>
      ${generateFrequencyTableHTML(stats, name)}
    `;
  } else if (type === 'boolean') {
    // Generate boolean histogram (similar to categorical)
    statsHtml += generateBooleanHistogramSVG(stats);
    
    // Basic counts
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Centrality</div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.join(', ') ?? '—'} (${stats.modePercent}%)</span></div>
      <div class="stats-row"><span>Categories:</span><span>${stats.categoryCount}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Dispersion</div>
      <div class="stats-row"><span>Entropy H(X):</span><span>${stats.entropy?.toFixed(4) ?? '—'} bits</span></div>
      <div class="stats-row"><span>Max Entropy:</span><span>${stats.maxEntropy?.toFixed(4) ?? '—'} bits</span></div>
      <div class="stats-row"><span>Normalized Entropy:</span><span>${stats.normalizedEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Gini-Simpson:</span><span>${stats.giniSimpson?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>IQV:</span><span>${stats.iqv?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Variation Ratio:</span><span>${stats.variationRatio?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Frequency Table</div>
      ${generateBooleanFrequencyTableHTML(stats)}
    `;
  } else if (type === 'string' || type === 'multilinestring') {
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Unique Values:</span><span>${stats.uniqueCount}</span></div>
    `;
    if (stats.topValues) {
      statsHtml += `<div class="stats-subtitle">Top Values:</div>`;
      stats.topValues.forEach(([val, count]) => {
        statsHtml += `<div class="stats-row stats-row-small"><span>${String(val).substring(0, 20)}</span><span>${count}</span></div>`;
      });
    }
    
    // Length statistics (Unicode character count)
    if (stats.lengthStats) {
      const ls = stats.lengthStats;
      statsHtml += generateBoxPlotSVG(ls);
      statsHtml += `
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Length Statistics (Unicode chars)</div>
        <div class="stats-row"><span>Min Length:</span><span>${ls.min ?? '—'}</span></div>
        <div class="stats-row"><span>Max Length:</span><span>${ls.max ?? '—'}</span></div>
        <div class="stats-row"><span>Range |max−min|:</span><span>${ls.range ?? '—'}</span></div>
        <div class="stats-row"><span>Total Chars:</span><span>${ls.sum ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Mean:</span><span>${ls.mean?.toFixed(2) ?? '—'}</span></div>
        <div class="stats-row"><span>Median:</span><span>${ls.median ?? '—'}</span></div>
        <div class="stats-row"><span>Mode:</span><span>${ls.mode?.join(', ') ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Std Dev σ:</span><span>${ls.stdDev?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-row"><span>Variance σ²:</span><span>${ls.variance?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Q1 (25%):</span><span>${ls.q1 ?? '—'}</span></div>
        <div class="stats-row"><span>Q3 (75%):</span><span>${ls.q3 ?? '—'}</span></div>
        <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${ls.iqr ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${ls.outliers?.length ?? 0}</span></div>
        <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${ls.farOutliers?.length ?? 0}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Distribution Shape</div>
        <div class="shape-charts-row">
          ${generateSkewnessSVG(ls.skewness)}
          ${generateKurtosisSVG(ls.kurtosis)}
        </div>
      `;
    }
    
    // Line count statistics (only for multilinestring)
    if (stats.lineStats) {
      const lns = stats.lineStats;
      statsHtml += generateBoxPlotSVG(lns);
      statsHtml += `
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Line Count Statistics</div>
        <div class="stats-row"><span>Min Lines:</span><span>${lns.min ?? '—'}</span></div>
        <div class="stats-row"><span>Max Lines:</span><span>${lns.max ?? '—'}</span></div>
        <div class="stats-row"><span>Range |max−min|:</span><span>${lns.range ?? '—'}</span></div>
        <div class="stats-row"><span>Total Lines:</span><span>${lns.sum ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Mean:</span><span>${lns.mean?.toFixed(2) ?? '—'}</span></div>
        <div class="stats-row"><span>Median:</span><span>${lns.median ?? '—'}</span></div>
        <div class="stats-row"><span>Mode:</span><span>${lns.mode?.join(', ') ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Std Dev σ:</span><span>${lns.stdDev?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-row"><span>Variance σ²:</span><span>${lns.variance?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Q1 (25%):</span><span>${lns.q1 ?? '—'}</span></div>
        <div class="stats-row"><span>Q3 (75%):</span><span>${lns.q3 ?? '—'}</span></div>
        <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${lns.iqr ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${lns.outliers?.length ?? 0}</span></div>
        <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${lns.farOutliers?.length ?? 0}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Distribution Shape</div>
        <div class="shape-charts-row">
          ${generateSkewnessSVG(lns.skewness)}
          ${generateKurtosisSVG(lns.kurtosis)}
        </div>
      `;
    }
  } else if (type === 'date' || type === 'datetime' || type === 'time') {
    const label = type === 'time' ? 'Time' : 'Date';
    
    // Box plot for date/time values
    statsHtml += generateDateTimeBoxPlotSVG(stats, type);
    
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min ${label}:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max ${label}:</span><span>${stats.max ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev:</span><span>${stats.stdDevFormatted ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1 ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3 ?? '—'}</span></div>
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
    `;
  } else if (type === 'relation') {
    // Statistics based on row counts in nested relations
    statsHtml += generateBoxPlotSVG(stats);
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Row Count Statistics</div>
      <div class="stats-row"><span>Min Rows:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max Rows:</span><span>${stats.max ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range ?? '—'}</span></div>
      <div class="stats-row"><span>Total Rows:</span><span>${stats.sum ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean?.toFixed(2) ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median ?? '—'}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.join(', ') ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev σ:</span><span>${stats.stdDev?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Variance σ²:</span><span>${stats.variance?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1 ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3 ?? '—'}</span></div>
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
    `;
  }
  
  // Add explanations section
  const explanationsHtml = generateStatsExplanationsHTML(type);
  
  panel.innerHTML = `
    <div class="stats-panel-header">
      <span>Statistics: ${name}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="stats-panel-content">${statsHtml}</div>
    ${explanationsHtml}
  `;
  
  document.body.appendChild(panel);
  
  panel.querySelector('.btn-close-dialog').addEventListener('click', () => panel.remove());
  
  document.addEventListener('click', function closePanel(e) {
    if (!panel.contains(e.target) && !e.target.classList.contains('btn-stats')) {
      panel.remove();
      document.removeEventListener('click', closePanel);
    }
  });
}

function closeAllMenus() {
  document.querySelectorAll('.column-menu, .filter-dialog, .stats-panel, .row-ops-menu, .nested-relation-dialog, .group-cols-dialog, .color-palette-dialog').forEach(el => el.remove());
}

function hasActiveFilter(st = state) {
  return Object.keys(getFilters(st)).length > 0;
}

function removeColumn(colIdx, st = state) {
  if (st.columnNames.length <= 1) return;
  
  const colName = st.columnNames[colIdx];
  
  st.columnNames.splice(colIdx, 1);
  st.columnTypes.splice(colIdx, 1);
  delete st.options[colName];
  
  st.relation.items = st.relation.items.map(row => {
    const newRow = [...row];
    newRow.splice(colIdx, 1);
    return newRow;
  });
  
  const newColumns = {};
  st.columnNames.forEach((name, idx) => {
    newColumns[name] = st.columnTypes[idx];
  });
  st.relation.columns = newColumns;
  
  setSortCriteria(st, getSortCriteria(st)
    .filter(c => c.column !== colIdx)
    .map(c => ({ ...c, column: c.column > colIdx ? c.column - 1 : c.column })));
  
  const newFilters = {};
  for (const [idx, filter] of Object.entries(getFilters(st))) {
    const i = parseInt(idx);
    if (i < colIdx) newFilters[i] = filter;
    else if (i > colIdx) newFilters[i - 1] = filter;
  }
  setFilters(st, newFilters);
  
  const newFormatting = {};
  for (const [idx, fmt] of Object.entries(getFormatting(st))) {
    const i = parseInt(idx);
    if (i < colIdx) newFormatting[i] = fmt;
    else if (i > colIdx) newFormatting[i - 1] = fmt;
  }
  setFormatting(st, newFormatting);
  
  getSelectedColumns(st).clear();
  setGroupByColumns(st, getGroupByColumns(st)
    .filter(c => c !== colIdx)
    .map(c => c > colIdx ? c - 1 : c));
  
  const newGroupBySelectedValues = {};
  for (const [idx, val] of Object.entries(getGroupBySelectedValues(st))) {
    const i = parseInt(idx);
    if (i < colIdx) newGroupBySelectedValues[i] = val;
    else if (i > colIdx) newGroupBySelectedValues[i - 1] = val;
  }
  setGroupBySelectedValues(st, newGroupBySelectedValues);
  
  getSelectedRows(st).clear();
  setPivotConfig(st, { rowDim: null, colDim: null });
  setExpandedGroups(st, new Set());
  setDiagramNodes(st, []);
  
  applyFilters(st);
  applySorting(st);
}

function removeSelectedColumns(st = state) {
  const cols = [...getSelectedColumns(st)].sort((a, b) => b - a);
  cols.forEach(colIdx => removeColumn(colIdx, st));
}

function showActiveFilterColorDialog(colIdx, st = state) {
  closeAllMenus();
  
  const dialog = document.createElement('div');
  dialog.className = 'color-palette-dialog';
  
  let palettesHtml = '';
  for (const [key, palette] of Object.entries(COLOR_PALETTES)) {
    palettesHtml += `
      <div class="palette-section" data-palette="${key}">
        <div class="palette-name">${palette.name}</div>
        <div class="palette-colors">
          ${palette.colors.map(c => {
            const textColor = getContrastTextColor(c);
            const showT = textColor === '#ffffff';
            return `<button class="color-swatch" data-color="${c}" style="background-color: ${c}">${showT ? '<span style="color: white; font-size: 10px; font-weight: bold;">T</span>' : ''}</button>`;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  dialog.innerHTML = `
    <div class="color-palette-header">
      <span>Choose Color for Filtered Rows</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="color-palettes-container">
      ${palettesHtml}
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  
  dialog.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      applyActiveFilterColor(colIdx, swatch.dataset.color, st);
      dialog.remove();
    });
  });
}

function applyActiveFilterColor(colIdx, color, st = state) {
  if (!hasActiveFilter(st)) return;
  
  const colName = st.columnNames[colIdx];
  const idColIdx = st.columnNames.indexOf('id');
  
  if (idColIdx < 0) {
    alert('No "id" column found. Cannot persist color.');
    return;
  }
  
  if (!st.relation.colored_items) {
    st.relation.colored_items = {};
  }
  if (!st.relation.colored_items[colName]) {
    st.relation.colored_items[colName] = [];
  }
  
  const coloredItems = st.relation.colored_items[colName];
  
  getSortedIndices(st).forEach(rowIdx => {
    const row = st.relation.items[rowIdx];
    const rowId = row[idColIdx];
    
    if (rowId === null || rowId === undefined) return;
    
    const existingIdx = coloredItems.findIndex(item => item.id === rowId);
    if (existingIdx >= 0) {
      coloredItems[existingIdx].color = color;
    } else {
      coloredItems.push({ id: rowId, color: color });
    }
  });
  
  renderTable(st);
}

function toggleGroupBy(colIdx, st = state) {
  const idx = getGroupByColumns(st).indexOf(colIdx);
  if (idx >= 0) {
    getGroupByColumns(st).splice(idx, 1);
    // Also remove selected value for this column
    delete getGroupBySelectedValues(st)[colIdx];
  } else {
    getGroupByColumns(st).push(colIdx);
  }
  setCurrentPage(st, 1);
  renderTable(st);
}

function expandRelationColumn(colIdx, st = state) {
  // Find ALL relation columns
  const relationColIndices = [];
  st.columnTypes.forEach((type, idx) => {
    if (type === 'relation') {
      relationColIndices.push(idx);
    }
  });
  
  if (relationColIndices.length === 0) return;
  
  // Collect all nested columns from all relation columns
  const allNestedColumns = {};
  st.relation.items.forEach(row => {
    relationColIndices.forEach(relColIdx => {
      const nestedRelation = row[relColIdx];
      if (nestedRelation && nestedRelation.columns) {
        Object.assign(allNestedColumns, nestedRelation.columns);
      }
    });
  });
  
  // Build new column structure: non-relation columns + all nested columns
  const newColumnsObj = {};
  st.columnNames.forEach((name, idx) => {
    if (st.columnTypes[idx] !== 'relation') {
      newColumnsObj[name] = st.columnTypes[idx];
    }
  });
  Object.assign(newColumnsObj, allNestedColumns);
  
  const nestedColNames = Object.keys(allNestedColumns);
  const nonRelationColIndices = [];
  st.columnTypes.forEach((type, idx) => {
    if (type !== 'relation') {
      nonRelationColIndices.push(idx);
    }
  });
  
  // Generate Cartesian product of all relation columns
  let newItems = [];
  
  st.relation.items.forEach(row => {
    // Start with base row (non-relation values)
    const baseValues = nonRelationColIndices.map(idx => row[idx]);
    
    // Collect arrays of rows from each relation column
    const relationRowArrays = relationColIndices.map(relColIdx => {
      const nestedRelation = row[relColIdx];
      if (!nestedRelation || !nestedRelation.items || nestedRelation.items.length === 0) {
        // No nested data - return array with nulls for all nested columns from this relation
        const nestedColCount = nestedRelation?.columns ? Object.keys(nestedRelation.columns).length : 0;
        return [new Array(nestedColCount).fill(null)];
      }
      return nestedRelation.items;
    });
    
    // Cartesian product of all relation row arrays
    function cartesianProduct(arrays) {
      if (arrays.length === 0) return [[]];
      return arrays.reduce((acc, curr) => {
        const result = [];
        acc.forEach(a => {
          curr.forEach(b => {
            result.push([...a, ...b]);
          });
        });
        return result;
      }, [[]]);
    }
    
    const cartesian = cartesianProduct(relationRowArrays);
    
    // Create new rows combining base values with cartesian product results
    cartesian.forEach(nestedValues => {
      // Map nested values to correct positions based on column names
      const newRow = [...baseValues];
      
      // Add values for each nested column (in order of allNestedColumns)
      let offset = 0;
      relationColIndices.forEach(relColIdx => {
        const nestedRelation = row[relColIdx];
        if (nestedRelation && nestedRelation.columns) {
          const nestedColNamesForThis = Object.keys(nestedRelation.columns);
          nestedColNamesForThis.forEach((ncName, ncIdx) => {
            const targetIdx = nestedColNames.indexOf(ncName);
            if (targetIdx >= 0) {
              const valueIdx = offset + ncIdx;
              if (valueIdx < nestedValues.length) {
                newRow[nonRelationColIndices.length + targetIdx] = nestedValues[valueIdx];
              }
            }
          });
          offset += nestedColNamesForThis.length;
        }
      });
      
      // Fill any missing nested columns with null
      while (newRow.length < nonRelationColIndices.length + nestedColNames.length) {
        newRow.push(null);
      }
      
      newItems.push(newRow);
    });
  });
  
  st.relation = {
    pot: 'relation',
    columns: newColumnsObj,
    items: newItems
  };
  
  st.columnNames = Object.keys(newColumnsObj);
  st.columnTypes = Object.values(newColumnsObj);
  setFilteredIndices(st, [...Array(newItems.length).keys()]);
  setSortedIndices(st, [...getFilteredIndices(st)]);
  setSelectedRows(st, new Set());
  setSortCriteria(st, []);
  setFilters(st, {});
  setFormatting(st, {});
  setGroupByColumns(st, []);
  setGroupBySelectedValues(st, {});
  setCurrentPage(st, 1);
  
  el('.relation-json').value = JSON.stringify(st.relation, null, 2);
  renderTable(st);
}

function showGroupColumnsDialog(st = state) {
  closeAllMenus();
  
  const selectedCols = [...getSelectedColumns(st)];
  if (selectedCols.length === 0) return;
  
  const dialog = document.createElement('div');
  dialog.className = 'group-cols-dialog';
  
  const colNames = selectedCols.map(i => st.columnNames[i]).join(', ');
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Group Columns into Relation</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="group-cols-content">
      <p>Selected columns: <strong>${colNames}</strong></p>
      <label>New relation column name:</label>
      <input type="text" class="group-col-name relation-input" value="nested_data" />
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline group-cancel">Cancel</button>
      <button class="btn btn-primary group-apply">Group</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('.group-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('.group-apply').addEventListener('click', () => {
    const newColName = dialog.querySelector('.group-col-name').value.trim() || 'nested_data';
    groupColumnsIntoRelation(selectedCols, newColName, st);
    dialog.remove();
  });
}

function groupColumnsIntoRelation(colIndices, newColName, st = state) {
  const nestedColumnNames = colIndices.map(i => st.columnNames[i]);
  const nestedColumnTypes = colIndices.map(i => st.columnTypes[i]);
  
  const nestedColumns = {};
  nestedColumnNames.forEach((name, i) => {
    nestedColumns[name] = nestedColumnTypes[i];
  });
  
  const newItems = st.relation.items.map(row => {
    const nestedRow = colIndices.map(i => row[i]);
    const nestedRelation = {
      pot: 'relation',
      columns: nestedColumns,
      items: [nestedRow]
    };
    
    const newRow = row.filter((_, i) => !colIndices.includes(i));
    newRow.push(nestedRelation);
    return newRow;
  });
  
  const newColumnsObj = {};
  st.columnNames.forEach((name, i) => {
    if (!colIndices.includes(i)) {
      newColumnsObj[name] = st.columnTypes[i];
    }
  });
  newColumnsObj[newColName] = 'relation';
  
  st.relation = {
    pot: 'relation',
    columns: newColumnsObj,
    items: newItems
  };
  
  st.columnNames = Object.keys(newColumnsObj);
  st.columnTypes = Object.values(newColumnsObj);
  setFilteredIndices(st, [...Array(newItems.length).keys()]);
  setSortedIndices(st, [...getFilteredIndices(st)]);
  setSelectedRows(st, new Set());
  setSelectedColumns(st, new Set());
  setSortCriteria(st, []);
  setFilters(st, {});
  setFormatting(st, {});
  setGroupByColumns(st, []);
  setGroupBySelectedValues(st, {});
  setCurrentPage(st, 1);
  
  el('.relation-json').value = JSON.stringify(st.relation, null, 2);
  renderTable(st);
}

function showRowOperationsMenu(rowIdx, x, y) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'row-ops-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const hasSelection = getSelectedRows(state).size > 0;
  
  menu.innerHTML = `
    <div class="column-menu-header">Row ${rowIdx + 1}</div>
    <button class="column-menu-item" data-action="view-row" data-testid="button-row-view">👁 View</button>
    <button class="column-menu-item" data-action="edit-row" data-testid="button-row-edit">✏️ Edit</button>
    <button class="column-menu-item" data-action="copy-row" data-testid="button-row-copy">📋 Copy</button>
    <button class="column-menu-item" data-action="new-row" data-testid="button-row-new">➕ New</button>
    <button class="column-menu-item" data-action="new-fast-row" data-testid="button-row-new-fast">⚡ New Fast</button>
    <button class="column-menu-item" data-action="delete-row" data-testid="button-row-delete">🗑️ Delete</button>
    <button class="column-menu-item" data-action="paper-form-row" data-testid="button-row-paper-form">📄 Paper Form</button>
    ${hasSelection ? `
      <div class="column-menu-section">
        <div class="column-menu-title">Selection (${getSelectedRows(state).size} rows)</div>
        <button class="column-menu-item" data-action="delete-selected" data-testid="button-delete-selected">🗑️ Delete Selected</button>
      </div>
    ` : ''}
  `;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    
    handleRowOperation(state, rowIdx, action);
    menu.remove();
  });
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 0);
}

function handleRowOperation(st, rowIdx, action) {
  switch (action) {
    case 'view-row':
      showRowViewDialog(st, rowIdx);
      break;
    case 'edit-row':
      showRowEditDialog(st, rowIdx);
      break;
    case 'copy-row':
      showRowCopyDialog(st, rowIdx);
      break;
    case 'new-row':
      showRowNewDialog(st, -1, 'new');
      break;
    case 'delete-row':
      showRowDeleteDialog(st, rowIdx);
      break;
    case 'delete-selected':
      if (confirm(`Delete ${getSelectedRows(st).size} selected rows?`)) {
        const indices = [...getSelectedRows(st)].sort((a, b) => b - a);
        indices.forEach(i => st.relation.items.splice(i, 1));
        getSelectedRows(st).clear();
        setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
        setSortedIndices(st, [...getFilteredIndices(st)]);
        renderTable(st);
      }
      break;
    case 'new-fast-row':
      showRowNewDialog(st, -1, 'new-fast');
      break;
    case 'paper-form-row':
      showRowPaperFormDialog(st, rowIdx);
      break;
  }
}

function getNextNegativeId(st) {
  const idColIdx = st.columnTypes.findIndex(t => t === 'id');
  if (idColIdx === -1) return -1;
  
  let minId = 0;
  st.relation.items.forEach(row => {
    const id = parseInt(row[idColIdx]);
    if (!isNaN(id) && id < minId) minId = id;
  });
  return minId - 1;
}

function generateRowFormattedContent(st, row, mode = 'view') {
  let html = '<div class="row-operation-content">';
  
  st.columnNames.forEach((name, colIdx) => {
    const type = st.columnTypes[colIdx];
    const value = row[colIdx];
    
    if (type === 'relation') {
      html += `<div class="row-field row-field-relation">`;
      html += `<label class="row-field-label">${escapeHtml(name)}</label>`;
      html += `<div class="row-field-relation-container" data-col="${colIdx}"></div>`;
      html += `</div>`;
    } else {
      html += `<div class="row-field row-field-${type}">`;
      html += `<label class="row-field-label">${escapeHtml(name)}</label>`;
      
      if (mode === 'view' || (mode === 'edit' && type === 'id')) {
        html += `<span class="row-field-value row-field-value-${type}">${formatValueForViewDisplay(value, type, st, colIdx)}</span>`;
      } else {
        html += createEditInputHtml(type, value, colIdx, st);
      }
      html += `</div>`;
    }
  });
  
  html += '</div>';
  return html;
}

function formatValueForViewDisplay(value, type, st, colIdx) {
  if (value === null || value === undefined) return '<span class="null-value">null</span>';
  
  if (type === 'boolean') {
    return value ? '<span class="bool-true">✓ true</span>' : '<span class="bool-false">✗ false</span>';
  }
  
  if (type === 'select' && st.options && st.options[st.columnNames[colIdx]]) {
    const options = st.options[st.columnNames[colIdx]];
    const displayValue = options[value] || value;
    return `<span class="select-value">${escapeHtml(displayValue)}</span>`;
  }
  
  if (type === 'id') {
    return `<span class="id-value">${escapeHtml(String(value))}</span>`;
  }
  
  if (type === 'int' || type === 'float') {
    return `<span class="number-value">${value}</span>`;
  }
  
  if (type === 'multilinestring') {
    return `<span class="multiline-value">${escapeHtml(String(value))}</span>`;
  }
  
  return `<span class="string-value">${escapeHtml(String(value))}</span>`;
}

function initRelationFieldsInContainer(container, st, row) {
  const relationContainers = container.querySelectorAll('.row-field-relation-container');
  relationContainers.forEach(relContainer => {
    const colIdx = parseInt(relContainer.dataset.col);
    const relValue = row[colIdx];
    if (relValue && relValue.columns) {
      initRelationInstance(relContainer, relValue, { showJsonEditor: false, isNested: true });
    } else {
      relContainer.innerHTML = '<span class="null-value">null</span>';
    }
  });
}

function closeRowOperationPanel(st) {
  const detailPanel = st.container.querySelector('.relation-detail-panel');
  if (detailPanel) {
    detailPanel.innerHTML = '';
    const wrapper = st.container.querySelector('.relation-flex-wrapper');
    if (wrapper) wrapper.classList.remove('has-detail');
  }
}

function showRowViewDialog(st, rowIdx) {
  closeAllMenus();
  
  const row = st.relation.items[rowIdx];
  const title = `Ver Registo ${rowIdx + 1}`;
  
  const footerButtons = `
    <button class="btn btn-outline btn-action" data-action="edit">✏️ Edit</button>
    <button class="btn btn-outline btn-action" data-action="copy">📋 Copy</button>
    <button class="btn btn-outline btn-action btn-danger-outline" data-action="delete">🗑️ Delete</button>
  `;
  
  showContentBasedOnMode(st, (container) => {
    container.innerHTML = generateRowFormattedContent(st, row, 'view');
    initRelationFieldsInContainer(container, st, row);
    
    // Set up footer button handlers (buttons are in parent footer)
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelectorAll('.btn-action').forEach(btn => {
          btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'edit') showRowEditDialog(st, rowIdx);
            else if (action === 'copy') showRowCopyDialog(st, rowIdx);
            else if (action === 'delete') showRowDeleteDialog(st, rowIdx);
          });
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showRowCopyDialog(st, rowIdx) {
  closeAllMenus();
  
  const row = st.relation.items[rowIdx];
  const title = `Copiar Registo ${rowIdx + 1}`;
  
  const footerButtons = `
    <input type="number" class="copy-count-input" min="1" value="1" style="width: 60px;">
    <button class="btn btn-primary generate-copies">Gera Cópias</button>
  `;
  
  showContentBasedOnMode(st, (container) => {
    container.innerHTML = generateRowFormattedContent(st, row, 'view');
    initRelationFieldsInContainer(container, st, row);
    
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelector('.generate-copies')?.addEventListener('click', () => {
          const countInput = footer.querySelector('.copy-count-input');
          const count = Math.max(1, parseInt(countInput.value) || 1);
          const idColIdx = st.columnTypes.findIndex(t => t === 'id');
          
          for (let i = 0; i < count; i++) {
            const newRow = [...row];
            if (idColIdx !== -1) {
              newRow[idColIdx] = getNextNegativeId(st);
              st.relation.items.push(newRow);
            } else {
              st.relation.items.push(newRow);
            }
          }
          
          setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
          setSortedIndices(st, [...getFilteredIndices(st)]);
          renderTable(st);
          closeRowOperationPanel(st);
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showRowDeleteDialog(st, rowIdx) {
  closeAllMenus();
  
  const row = st.relation.items[rowIdx];
  const title = `Eliminar Registo ${rowIdx + 1}`;
  
  const footerButtons = `<button class="btn btn-danger delete-record">Elimina Registo</button>`;
  
  showContentBasedOnMode(st, (container) => {
    container.innerHTML = generateRowFormattedContent(st, row, 'view');
    initRelationFieldsInContainer(container, st, row);
    
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelector('.delete-record')?.addEventListener('click', () => {
          if (confirm('Tem a certeza que pretende eliminar este registo?')) {
            st.relation.items.splice(rowIdx, 1);
            getSelectedRows(st).delete(rowIdx);
            setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
            setSortedIndices(st, [...getFilteredIndices(st)]);
            renderTable(st);
            closeRowOperationPanel(st);
          }
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showRowNewDialog(st, rowIdx, mode = 'new') {
  closeAllMenus();
  
  const defaultRow = st.columnTypes.map((type, idx) => {
    if (type === 'id') return getNextNegativeId(st);
    if (type === 'boolean') return false;
    if (type === 'int' || type === 'float') return null;
    return null;
  });
  
  const title = mode === 'new-fast' ? 'Novo Registo Rápido' : 'Novo Registo';
  
  let footerButtons = '';
  if (mode === 'new') {
    footerButtons += `<button class="btn btn-outline clear-form">Limpar</button>`;
  }
  footerButtons += `<button class="btn btn-primary save-record">Gravar</button>`;
  footerButtons += `<button class="btn btn-primary save-and-new">Gravar e Novo</button>`;
  
  showContentBasedOnMode(st, (container) => {
    container.innerHTML = generateRowFormattedContent(st, defaultRow, 'edit');
    
    const clearForm = () => {
      st.columnNames.forEach((name, colIdx) => {
        const type = st.columnTypes[colIdx];
        const input = container.querySelector(`[data-col="${colIdx}"]`);
        if (input && type !== 'id') {
          if (type === 'boolean') {
            input.checked = false;
          } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
          } else {
            input.value = '';
          }
        }
      });
    };
    
    const collectFormData = () => {
      const newRow = [...defaultRow];
      st.columnNames.forEach((name, colIdx) => {
        const type = st.columnTypes[colIdx];
        if (type === 'id') {
          newRow[colIdx] = getNextNegativeId(st);
        } else {
          const input = container.querySelector(`[data-col="${colIdx}"]`);
          if (input) {
            if (type === 'boolean') {
              newRow[colIdx] = input.checked;
            } else if (type === 'int') {
              newRow[colIdx] = input.value === '' ? null : parseInt(input.value);
            } else if (type === 'float') {
              newRow[colIdx] = input.value === '' ? null : parseFloat(input.value);
            } else {
              newRow[colIdx] = input.value === '' ? null : input.value;
            }
          }
        }
      });
      return newRow;
    };
    
    const saveRecord = () => {
      const newRow = collectFormData();
      st.relation.items.push(newRow);
      setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
      setSortedIndices(st, [...getFilteredIndices(st)]);
      renderTable(st);
    };
    
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelector('.clear-form')?.addEventListener('click', clearForm);
        footer.querySelector('.save-record')?.addEventListener('click', () => {
          saveRecord();
          closeRowOperationPanel(st);
        });
        footer.querySelector('.save-and-new')?.addEventListener('click', () => {
          saveRecord();
          clearForm();
          const idInput = container.querySelector(`[data-col="${st.columnTypes.findIndex(t => t === 'id')}"]`);
          if (idInput) idInput.textContent = getNextNegativeId(st);
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showRowPaperFormDialog(st, rowIdx) {
  closeAllMenus();
  
  const defaultRow = st.columnTypes.map((type, idx) => {
    if (type === 'id') return '____';
    if (type === 'boolean') return false;
    return '';
  });
  
  const title = 'Formulário para Impressão';
  const footerButtons = `<button class="btn btn-primary print-form">Imprimir</button>`;
  
  showContentBasedOnMode(st, (container) => {
    let html = '<div class="paper-form-content" style="width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; background: white;">';
    
    // Add relation name as title if it exists
    const relationName = st.relation.name || '';
    if (relationName.trim()) {
      html += `<h1 class="paper-form-title" style="text-align: center; margin-bottom: 20px; font-size: 18pt;">${escapeHtml(relationName)}</h1>`;
    }
    
    st.columnNames.forEach((name, colIdx) => {
      const type = st.columnTypes[colIdx];
      
      html += `<div class="paper-form-field">`;
      html += `<label class="paper-form-label">${escapeHtml(name)}</label>`;
      
      if (type === 'select' && st.options && st.options[st.columnNames[colIdx]]) {
        const options = st.options[st.columnNames[colIdx]];
        html += `<div class="paper-form-radio-group">`;
        Object.entries(options).forEach(([k, v]) => {
          html += `<label class="paper-form-radio"><input type="radio" name="field_${colIdx}" disabled> ${escapeHtml(v)}</label>`;
        });
        html += `</div>`;
      } else if (type === 'boolean') {
        html += `<div class="paper-form-checkbox"><input type="checkbox" disabled> Sim</div>`;
      } else if (type === 'multilinestring') {
        html += `<div class="paper-form-textarea-placeholder"></div>`;
      } else {
        html += `<div class="paper-form-input-placeholder"></div>`;
      }
      html += `</div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelector('.print-form')?.addEventListener('click', () => {
          const printContent = container.querySelector('.paper-form-content');
          const printWindow = window.open('', '_blank');
          printWindow.document.write(`
            <html>
            <head>
              <title>Formulário</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20mm; }
                .paper-form-title { text-align: center; margin-bottom: 20px; font-size: 18pt; }
                .paper-form-field { margin-bottom: 15px; }
                .paper-form-label { display: block; font-weight: bold; margin-bottom: 5px; }
                .paper-form-input-placeholder { border-bottom: 1px solid #000; height: 25px; }
                .paper-form-textarea-placeholder { border: 1px solid #000; height: 80px; }
                .paper-form-radio-group { display: flex; gap: 20px; flex-wrap: wrap; }
                .paper-form-radio { display: flex; align-items: center; gap: 5px; }
                .paper-form-checkbox { display: flex; align-items: center; gap: 5px; }
              </style>
            </head>
            <body>${printContent.innerHTML}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showRowEditDialog(st, rowIdx) {
  closeAllMenus();
  
  const row = st.relation.items[rowIdx];
  const title = `Editar Registo ${rowIdx + 1}`;
  const footerButtons = `<button class="btn btn-primary save-record">Gravar</button>`;
  
  showContentBasedOnMode(st, (container) => {
    container.innerHTML = generateRowFormattedContent(st, row, 'edit');
    
    const idColIdx = st.columnTypes.findIndex(t => t === 'id');
    const rowId = idColIdx !== -1 ? row[idColIdx] : null;
    
    setTimeout(() => {
      const footer = container.closest('.detail-panel-content, .nested-relation-dialog')?.querySelector('.detail-panel-footer, .filter-dialog-footer');
      if (footer) {
        footer.querySelector('.save-record')?.addEventListener('click', () => {
          let targetRowIdx = rowIdx;
          if (rowId !== null) {
            targetRowIdx = st.relation.items.findIndex(r => r[idColIdx] === rowId);
          }
          
          if (targetRowIdx === -1) {
            alert('Registo não encontrado');
            return;
          }
          
          st.columnNames.forEach((name, colIdx) => {
            const type = st.columnTypes[colIdx];
            if (type === 'id') return;
            
            const input = container.querySelector(`[data-col="${colIdx}"]`);
            if (input) {
              let value;
              if (type === 'boolean') {
                value = input.checked;
              } else if (type === 'int') {
                value = input.value === '' ? null : parseInt(input.value);
              } else if (type === 'float') {
                value = input.value === '' ? null : parseFloat(input.value);
              } else {
                value = input.value === '' ? null : input.value;
              }
              st.relation.items[targetRowIdx][colIdx] = value;
            }
          });
          
          renderTable(st);
          closeRowOperationPanel(st);
        });
      }
    }, 0);
  }, title, footerButtons);
}

function showNestedRelationDialog(rowIdx, colIdx, st = state) {
  closeAllMenus();
  
  const nestedRelation = st.relation.items[rowIdx][colIdx];
  if (!nestedRelation || !nestedRelation.columns) return;
  
  // Ensure nested relation has default rel_options
  if (!nestedRelation.rel_options) {
    nestedRelation.rel_options = { ...DEFAULT_REL_OPTIONS };
  }
  if (!nestedRelation.options) {
    nestedRelation.options = {};
  }
  
  const title = `Sub-Relation (${nestedRelation.items?.length || 0} rows)`;
  
  // Use mode-based display based on parent's single_item_mode
  showContentBasedOnMode(st, (container) => {
    // Create a nested relation builder inside the container
    container.classList.add('nested-relation-builder-container');
    initRelationInstance(container, nestedRelation, { showJsonEditor: false, isNested: true });
  }, title);
}

// Open a nested relation dialog using the shared initRelationInstance function
function openNestedRelationDialog(relationData) {
  const dialogId = `nested-relation-${Date.now()}`;
  
  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'nested-relation-overlay';
  overlay.id = `${dialogId}-overlay`;
  
  const dialog = document.createElement('div');
  dialog.className = 'nested-relation-dialog';
  dialog.id = dialogId;
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Sub-Relation (${relationData.items?.length || 0} rows)</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="nested-relation-content">
      <div class="nested-relation-builder-container" id="${dialogId}-builder"></div>
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline close-nested">Fechar</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
  
  // Use the shared initRelationInstance function
  const builderContainer = document.getElementById(`${dialogId}-builder`);
  const instanceState = initRelationInstance(builderContainer, relationData, { showJsonEditor: false, isNested: true });
  
  const closeDialog = () => {
    // Cleanup instance from both legacy map and new registry
    if (instanceState) {
      relationInstances.delete(instanceState.uid);
      unregisterRelation(instanceState.uid);
    }
    overlay.remove();
    dialog.remove();
  };
  
  overlay.addEventListener('click', closeDialog);
  dialog.querySelector('.btn-close-dialog').addEventListener('click', closeDialog);
  dialog.querySelector('.close-nested').addEventListener('click', closeDialog);
}

// Legacy functions removed - now using initRelationInstance for nested relations

// Show content based on single_item_mode setting
// Returns a cleanup function if content is displayed in detail panel
function showContentBasedOnMode(st, contentBuilder, title = '', footerButtonsHtml = '') {
  const singleItemMode = st.rel_options.single_item_mode || 'dialog';
  
  if (singleItemMode === 'dialog') {
    // Show in popup dialog
    return showContentInPopup(contentBuilder, title, footerButtonsHtml);
  } else {
    // Show in detail panel (right or bottom based on flex class already set)
    return showContentInDetailPanel(st, contentBuilder, title, footerButtonsHtml);
  }
}

// Show content in the detail panel (for single_item_mode: 'right' or 'bottom')
function showContentInDetailPanel(st, contentBuilder, title = '', footerButtonsHtml = '') {
  const detailPanel = getDetailPanel(st);
  if (!detailPanel) {
    // Fallback to popup if no detail panel exists
    return showContentInPopup(contentBuilder, title, footerButtonsHtml);
  }
  
  // Clear existing content
  detailPanel.innerHTML = '';
  
  // Create content wrapper with header, body, and footer
  const wrapper = document.createElement('div');
  wrapper.className = 'detail-panel-content';
  
  wrapper.innerHTML = `
    <div class="detail-panel-header">
      <span class="detail-panel-title">${title}</span>
      <button class="btn-close-detail-panel" title="Fechar">✕</button>
    </div>
    <div class="detail-panel-body"></div>
    <div class="detail-panel-footer">
      ${footerButtonsHtml}
      <button class="btn btn-outline close-panel">Fechar</button>
    </div>
  `;
  
  detailPanel.appendChild(wrapper);
  
  // Build content into the body
  const body = wrapper.querySelector('.detail-panel-body');
  contentBuilder(body);
  
  // Toggle .has-detail class on wrapper for proper layout
  updateDetailPanelState(st);
  
  // Set up close handler
  const closeHandler = () => {
    clearDetailPanel(st);
  };
  
  wrapper.querySelector('.btn-close-detail-panel').addEventListener('click', closeHandler);
  wrapper.querySelector('.close-panel').addEventListener('click', closeHandler);
  
  return closeHandler;
}

// Show content in a popup dialog (for single_item_mode: 'dialog')
function showContentInPopup(contentBuilder, title = '', footerButtonsHtml = '') {
  const dialogId = `content-dialog-${Date.now()}`;
  
  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'nested-relation-overlay';
  overlay.id = `${dialogId}-overlay`;
  
  const dialog = document.createElement('div');
  dialog.className = 'nested-relation-dialog';
  dialog.id = dialogId;
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>${title}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="popup-content-body"></div>
    <div class="filter-dialog-footer">
      ${footerButtonsHtml}
      <button class="btn btn-outline close-popup">Fechar</button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);
  
  // Build content into the body
  const body = dialog.querySelector('.popup-content-body');
  contentBuilder(body);
  
  const closeDialog = () => {
    overlay.remove();
    dialog.remove();
  };
  
  overlay.addEventListener('click', closeDialog);
  dialog.querySelector('.btn-close-dialog').addEventListener('click', closeDialog);
  dialog.querySelector('.close-popup').addEventListener('click', closeDialog);
  
  return closeDialog;
}

// Clear the detail panel content and update layout state
function clearDetailPanel(st) {
  const detailPanel = getDetailPanel(st);
  if (detailPanel) {
    detailPanel.innerHTML = '';
    // Update layout state to remove .has-detail class
    updateDetailPanelState(st);
  }
}

// Show nested relation dialog from data (for deeper nesting)
function showNestedRelationDialogFromData(relation) {
  // Ensure nested relation has default rel_options
  if (!relation.rel_options) {
    relation.rel_options = { ...DEFAULT_REL_OPTIONS };
  }
  if (!relation.options) {
    relation.options = {};
  }
  
  // Reuse the same dialog function
  openNestedRelationDialog(relation);
}

function updateRelationFromInput(input) {
  const rowIdx = parseInt(input.dataset.row);
  const colIdx = parseInt(input.dataset.col);
  const type = state.columnTypes[colIdx];
  
  let value;
  if (type === 'boolean') {
    value = input.checked;
  } else if (type === 'int') {
    value = parseInt(input.value) || 0;
  } else if (type === 'float') {
    value = parseFloat(input.value) || 0;
  } else if (type === 'datetime') {
    value = input.value.replace('T', ' ');
  } else if (type === 'select') {
    value = input.value || null;
  } else {
    value = input.value;
  }
  
  state.relation.items[rowIdx][colIdx] = value;
  
  const textarea = el('.relation-json');
  if (textarea) textarea.value = JSON.stringify(state.relation, null, 2);
}

// AI Panel functions
async function askAI(question, st = state) {
  const aiView = st.container ? st.container.querySelector('.view-ai') : el('.view-ai');
  const responseDiv = aiView ? aiView.querySelector('.ai-response') : el('.ai-response');
  if (!responseDiv) return;
  
  // Check for empty items
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    responseDiv.innerHTML = '<p class="text-muted-foreground">Não existem dados para analisar com IA.</p>';
    return;
  }
  
  responseDiv.innerHTML = '';
  responseDiv.classList.add('loading');
  
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        relation: st.relation
      })
    });
    
    if (!response.ok) throw new Error('AI request failed');
    
    const result = await response.json();
    responseDiv.classList.remove('loading');
    
    if (result.type === 'filter' && result.conditions) {
      responseDiv.innerHTML = `
        <div>${result.description || 'Filter suggestion:'}</div>
        <div class="ai-filter-result">
          <span>Filter: ${result.conditions.map(c => `${c.column} ${c.operator} ${c.value ?? ''}`).join(' AND ')}</span>
          <button class="btn-apply-ai-filter">Apply Filter</button>
        </div>
      `;
      
      responseDiv.querySelector('.btn-apply-ai-filter')?.addEventListener('click', () => {
        applyAIFilter(result.conditions, st);
      });
    } else if (result.type === 'answer') {
      responseDiv.innerHTML = `<div>${result.text}</div>`;
    } else {
      responseDiv.innerHTML = `<div>${JSON.stringify(result)}</div>`;
    }
  } catch (error) {
    responseDiv.classList.remove('loading');
    responseDiv.innerHTML = `<div class="ai-error">Error: ${error.message}</div>`;
  }
}

function applyAIFilter(conditions, st = state) {
  conditions.forEach(cond => {
    const colIdx = st.columnNames.indexOf(cond.column);
    if (colIdx === -1) return;
    
    const colType = st.columnTypes[colIdx];
    
    let filterType, filterValue;
    switch (cond.operator) {
      case 'equals':
        filterType = 'values';
        filterValue = new Set([cond.value]);
        break;
      case 'contains':
        filterType = 'values';
        const matchingValues = new Set();
        st.relation.items.forEach(row => {
          const val = row[colIdx];
          if (val && String(val).toLowerCase().includes(String(cond.value).toLowerCase())) {
            matchingValues.add(val);
          }
        });
        filterValue = matchingValues;
        break;
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
        filterType = 'values';
        const numericMatches = new Set();
        st.relation.items.forEach(row => {
          const val = row[colIdx];
          const numVal = parseFloat(val);
          const condVal = parseFloat(cond.value);
          if (!isNaN(numVal) && !isNaN(condVal)) {
            if ((cond.operator === 'gt' && numVal > condVal) ||
                (cond.operator === 'gte' && numVal >= condVal) ||
                (cond.operator === 'lt' && numVal < condVal) ||
                (cond.operator === 'lte' && numVal <= condVal)) {
              numericMatches.add(val);
            }
          }
        });
        filterValue = numericMatches;
        break;
      case 'isNull':
        filterType = 'null';
        break;
      case 'isNotNull':
        filterType = 'notNull';
        break;
      default:
        return;
    }
    
    if (filterType === 'values' && filterValue) {
      getFilters(st)[colIdx] = { type: 'values', values: filterValue };
    } else if (filterType === 'null') {
      getFilters(st)[colIdx] = { type: 'null' };
    } else if (filterType === 'notNull') {
      getFilters(st)[colIdx] = { type: 'notNull' };
    }
  });
  
  setCurrentPage(st, 1);
  applyFilters(st);
  renderTable(st);
  showToast('AI filter applied');
}

// View tab icons SVG definitions
const VIEW_TAB_ICONS = {
  table: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
  cards: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  pivot: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3H3v18h18V3Z"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
  correlation: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>',
  diagram: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>',
  ai: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
  saved: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>'
};

// Render view tabs dynamically based on general_view_options
function renderViewTabs() {
  const viewTabs = el('.view-tabs');
  if (!viewTabs) return;
  
  // Clear existing tabs
  viewTabs.innerHTML = '';
  
  const viewOptions = state.rel_options.general_view_options || DEFAULT_REL_OPTIONS.general_view_options;
  
  // Create left section for tabs
  const tabsLeft = document.createElement('div');
  tabsLeft.className = 'view-tabs-left';
  
  viewOptions.forEach((viewName, idx) => {
    const viewKey = viewName.toLowerCase();
    const btn = document.createElement('button');
    btn.className = 'view-tab' + (idx === 0 ? ' active' : '');
    btn.dataset.view = viewKey;
    btn.dataset.testid = 'tab-' + viewKey;
    btn.innerHTML = (VIEW_TAB_ICONS[viewKey] || '') + ' ' + viewName;
    
    btn.addEventListener('click', () => {
      switchView(viewKey);
    });
    
    tabsLeft.appendChild(btn);
  });
  
  viewTabs.appendChild(tabsLeft);
  
  // Create right section for help badge (only if table view is available)
  const hasTableView = viewOptions.some(v => v.toLowerCase() === 'table');
  if (hasTableView) {
    const tabsRight = document.createElement('div');
    tabsRight.className = 'view-tabs-right';
    // Show badge only if table is the initial view
    const initialView = viewOptions[0]?.toLowerCase() || 'table';
    const badgeDisplay = initialView === 'table' ? '' : 'display: none;';
    tabsRight.innerHTML = `
      <span class="keyboard-help-badge" title="Keyboard Shortcuts" data-testid="button-help-keyboard" style="${badgeDisplay}">ℹ</span>
    `;
    viewTabs.appendChild(tabsRight);
    
    // Add hover event to show tooltip with fixed positioning
    const badge = tabsRight.querySelector('.keyboard-help-badge');
    if (badge) {
      badge.addEventListener('mouseenter', showKeyboardHelpTooltip);
      badge.addEventListener('mouseleave', hideKeyboardHelpTooltip);
    }
  }
  
  // Show view tabs
  viewTabs.style.display = 'flex';
}

// Keyboard help tooltip functions
let keyboardHelpTooltipEl = null;

function showKeyboardHelpTooltip(e) {
  const badge = e.currentTarget;
  const rect = badge.getBoundingClientRect();
  
  // Remove existing tooltip if any
  hideKeyboardHelpTooltip();
  
  // Create tooltip element
  keyboardHelpTooltipEl = document.createElement('div');
  keyboardHelpTooltipEl.className = 'keyboard-help-tooltip-fixed';
  keyboardHelpTooltipEl.dataset.testid = 'text-keyboard-shortcuts';
  keyboardHelpTooltipEl.innerHTML = `
    <strong>Atalhos de teclado e rato para o cabeçalho da coluna da tabela</strong><br>
    <b>Right-click</b> — menu de contexto<br>
    <b>Shift+click</b> — ordenar por várias colunas<br>
    <b>Ctrl+click</b> — selecionar colunas
  `;
  
  document.body.appendChild(keyboardHelpTooltipEl);
  
  // Calculate position
  const tooltipRect = keyboardHelpTooltipEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Position above the badge by default
  let top = rect.top - tooltipRect.height - 8;
  let left = rect.right - tooltipRect.width;
  
  // If would go off top, position below
  if (top < 8) {
    top = rect.bottom + 8;
  }
  
  // If would go off left, adjust
  if (left < 8) {
    left = 8;
  }
  
  // If would go off right, adjust
  if (left + tooltipRect.width > viewportWidth - 8) {
    left = viewportWidth - tooltipRect.width - 8;
  }
  
  keyboardHelpTooltipEl.style.top = top + 'px';
  keyboardHelpTooltipEl.style.left = left + 'px';
}

function hideKeyboardHelpTooltip() {
  if (keyboardHelpTooltipEl) {
    keyboardHelpTooltipEl.remove();
    keyboardHelpTooltipEl = null;
  }
}

function switchView(viewName) {
  setCurrentView(state, viewName);
  
  // Update tab states (scoped to relation container)
  elAll('.view-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewName);
  });
  
  // Show/hide keyboard help badge based on view (only show for table view)
  const helpBadge = el('.keyboard-help-badge');
  if (helpBadge) {
    helpBadge.style.display = viewName === 'table' ? '' : 'none';
  }
  
  // Show/hide view content (scoped to relation container)
  elAll('.view-content').forEach(content => {
    content.style.display = 'none';
  });
  const viewEl = el('.view-' + viewName);
  if (viewEl) viewEl.style.display = 'block';
  
  // Render specific view content
  if (viewName === 'cards') {
    renderCardsView();
  } else if (viewName === 'pivot') {
    initPivotConfig();
  } else if (viewName === 'correlation') {
    initCorrelationConfig();
  } else if (viewName === 'diagram') {
    // Setup click handler for diagram canvas
    setupDiagramClickHandler();
  } else if (viewName === 'ai') {
    // AI view is always ready
  } else if (viewName === 'saved') {
    // Saved view placeholder - future feature
  }
}

let cardsResizeObserver = null;

function renderCardsView(st = state) {
  if (!st.relation) return;
  
  const wrapper = st.container ? st.container.querySelector('.cards-view-wrapper') : el('.cards-view-wrapper');
  const cardsContent = st.container ? st.container.querySelector('.cards-content') : el('.cards-content');
  const cardsNavigation = st.container ? st.container.querySelector('.cards-navigation') : el('.cards-navigation');
  
  if (!wrapper || !cardsContent || !cardsNavigation) return;
  
  // Check for empty items
  if (!st.relation.items || st.relation.items.length === 0) {
    cardsContent.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para mostrar na vista de cards.</p>';
    cardsNavigation.innerHTML = '';
    return;
  }
  
  // Ensure indices are populated for this state
  if (getSortedIndices(st).length === 0 && getFilteredIndices(st).length === 0) {
    setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
    setSortedIndices(st, [...getFilteredIndices(st)]);
  }
  
  const indices = getSortedIndices(st);
  
  // Setup resize observer if not already (only for global state)
  if (!st.container && !cardsResizeObserver) {
    cardsResizeObserver = new ResizeObserver(() => {
      if (getCurrentView(st) === 'cards') {
        renderCardsView(st);
      }
    });
    cardsResizeObserver.observe(wrapper);
  }
  
  // Calculate cards per row based on container width
  const containerWidth = wrapper.offsetWidth || 900;
  const cardMinWidth = 200;
  const cardsPerRow = Math.max(2, Math.floor(containerWidth / cardMinWidth));
  
  // Calculate page sizes (3, 6, 9, 12 rows of cards)
  const pageSizeOptions = [3, 6, 9, 12].map(rows => rows * cardsPerRow);
  setCardsPageSize(st, pageSizeOptions.find(s => s >= getCardsPageSize(st)) || pageSizeOptions[0]);
  
  const totalItems = indices.length;
  const totalPages = Math.ceil(totalItems / getCardsPageSize(st));
  const startIdx = (getCardsCurrentPage(st) - 1) * getCardsPageSize(st);
  const endIdx = Math.min(startIdx + getCardsPageSize(st), totalItems);
  const pageIndices = indices.slice(startIdx, endIdx);
  
  // Render cards grid in first div
  let cardsHtml = '<div class="cards-grid" style="display: grid; grid-template-columns: repeat(' + cardsPerRow + ', 1fr); gap: 16px;">';
  
  // Calculate grid layout based on number of columns
  const numCols = st.columnNames.length;
  const gridCols = Math.min(numCols, 4); // Max 4 columns in grid
  
  pageIndices.forEach((rowIdx, i) => {
    const row = st.relation.items[rowIdx];
    const isSelected = getSelectedRows(st).has(rowIdx);
    const isHighlighted = getHighlightedRow(st) === rowIdx;
    
    cardsHtml += '<div class="data-card' + (isSelected ? ' selected' : '') + (isHighlighted ? ' highlighted' : '') + '" data-row-idx="' + rowIdx + '" style="--card-grid-cols: ' + gridCols + ';">';
    cardsHtml += '<div class="data-card-header">';
    cardsHtml += '<input type="checkbox" class="data-card-checkbox" ' + (isSelected ? 'checked' : '') + ' data-row-idx="' + rowIdx + '">';
    cardsHtml += '<span class="data-card-id">#' + (rowIdx + 1) + '</span>';
    cardsHtml += '</div>';
    cardsHtml += '<div class="data-card-body">';
    
    st.columnNames.forEach((colName, colIdx) => {
      const value = row[colIdx];
      const type = st.columnTypes[colIdx];
      let displayValue = formatCellValue(value, type, colName);
      
      // Get display value for tooltip (use option label for select type)
      let tooltipValue = '';
      if (value !== null && value !== undefined) {
        if (type === 'select') {
          const colOptions = st.options[colName];
          tooltipValue = (colOptions && colOptions[value] !== undefined) ? colOptions[value] : String(value);
        } else if (type === 'relation') {
          tooltipValue = (value?.items?.length || 0) + ' rows';
        } else {
          tooltipValue = String(value);
        }
      }
      
      // Determine if field should span full width (multiline, relation, long text)
      const isWide = type === 'multilinestring' || type === 'relation' || type === 'string';
      const fieldClass = 'data-card-field data-card-col-' + colIdx + (isWide ? ' data-card-field-wide' : '');
      
      // Add data attributes for relation columns to enable click handling
      const dataAttrs = type === 'relation' ? ' data-row-idx="' + rowIdx + '" data-col-idx="' + colIdx + '" data-type="relation"' : '';
      
      cardsHtml += '<div class="' + fieldClass + '" title="' + escapeHtml(colName) + ': ' + escapeHtml(tooltipValue) + '"' + dataAttrs + '>';
      // Value only - label appears in tooltip
      cardsHtml += '<span class="data-card-value">' + displayValue + '</span>';
      cardsHtml += '</div>';
    });
    
    cardsHtml += '</div>';
    cardsHtml += '</div>';
  });
  
  cardsHtml += '</div>';
  cardsContent.innerHTML = cardsHtml;
  
  // Render navigation in second div
  const totalRecords = st.relation.items.length;
  const filteredRecords = getFilteredIndices(st).length;
  const selectedRecords = getSelectedRows(st).size;
  const hasFilter = filteredRecords !== totalRecords;
  
  let navHtml = '<div class="cards-info">';
  navHtml += '<span class="cards-info-total">' + totalRecords + ' total</span>';
  if (hasFilter) {
    navHtml += '<span class="cards-info-filtered">' + filteredRecords + ' filtered</span>';
  }
  navHtml += '<span class="cards-info-selected">' + selectedRecords + ' selected</span>';
  navHtml += '</div>';
  
  navHtml += '<div class="cards-pagination">';
  navHtml += '<button class="btn btn-outline btn-sm" data-action="cards-first" ' + (getCardsCurrentPage(st) <= 1 ? 'disabled' : '') + '>⟨⟨</button>';
  navHtml += '<button class="btn btn-outline btn-sm" data-action="cards-prev" ' + (getCardsCurrentPage(st) <= 1 ? 'disabled' : '') + '>⟨</button>';
  navHtml += '<span>Page ' + getCardsCurrentPage(st) + ' of ' + totalPages + '</span>';
  navHtml += '<button class="btn btn-outline btn-sm" data-action="cards-next" ' + (getCardsCurrentPage(st) >= totalPages ? 'disabled' : '') + '>⟩</button>';
  navHtml += '<button class="btn btn-outline btn-sm" data-action="cards-last" ' + (getCardsCurrentPage(st) >= totalPages ? 'disabled' : '') + '>⟩⟩</button>';
  navHtml += '<select class="cards-page-size">';
  pageSizeOptions.forEach(size => {
    navHtml += '<option value="' + size + '" ' + (getCardsPageSize(st) === size ? 'selected' : '') + '>' + size + ' cards</option>';
  });
  navHtml += '</select>';
  navHtml += '</div>';
  
  navHtml += '<div class="cards-actions">';
  navHtml += '<select class="cards-selection-actions">';
  navHtml += '<option value="" disabled selected>Selection Actions...</option>';
  navHtml += '<option value="invert-page">↔ Invert Page</option>';
  navHtml += '<option value="invert-all">↔ Invert All</option>';
  navHtml += '<option value="select-all">✓ Select All</option>';
  navHtml += '<option value="deselect-all">✗ Deselect All</option>';
  navHtml += '</select>';
  navHtml += '</div>';
  
  cardsNavigation.innerHTML = navHtml;
  
  // Event listeners for cards
  cardsContent.querySelectorAll('.data-card-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.rowIdx);
      if (e.target.checked) {
        getSelectedRows(st).add(idx);
      } else {
        getSelectedRows(st).delete(idx);
      }
      e.target.closest('.data-card').classList.toggle('selected', e.target.checked);
    });
  });
  
  // Card click for highlighting
  cardsContent.querySelectorAll('.data-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't highlight if clicking on checkbox or relation field
      if (e.target.closest('input, [data-type="relation"]')) return;
      
      const rowIdx = parseInt(card.dataset.rowIdx);
      // Toggle highlight: if same card clicked again, unhighlight
      const currentHighlight = getHighlightedRow(st);
      if (currentHighlight === rowIdx) {
        setHighlightedRow(st, null);
        card.classList.remove('highlighted');
      } else {
        // Remove highlight from previous card
        cardsContent.querySelectorAll('.data-card.highlighted').forEach(c => {
          c.classList.remove('highlighted');
        });
        setHighlightedRow(st, rowIdx);
        card.classList.add('highlighted');
      }
    });
  });
  
  // Event listeners for relation columns in cards
  cardsContent.querySelectorAll('[data-type="relation"]').forEach(field => {
    field.style.cursor = 'pointer';
    field.addEventListener('click', (e) => {
      const rowIdx = parseInt(field.dataset.rowIdx);
      const colIdx = parseInt(field.dataset.colIdx);
      showNestedRelationDialog(rowIdx, colIdx, st);
    });
  });
  
  cardsNavigation.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'cards-first') setCardsCurrentPage(st, 1);
      else if (action === 'cards-prev') setCardsCurrentPage(st, Math.max(1, getCardsCurrentPage(st) - 1));
      else if (action === 'cards-next') setCardsCurrentPage(st, Math.min(totalPages, getCardsCurrentPage(st) + 1));
      else if (action === 'cards-last') setCardsCurrentPage(st, totalPages);
      renderCardsView(st);
    });
  });
  
  cardsNavigation.querySelector('.cards-page-size')?.addEventListener('change', (e) => {
    setCardsPageSize(st, parseInt(e.target.value));
    setCardsCurrentPage(st, 1);
    renderCardsView(st);
  });
  
  cardsNavigation.querySelector('.cards-selection-actions')?.addEventListener('change', (e) => {
    const action = e.target.value;
    e.target.value = '';
    
    if (action === 'invert-page') {
      pageIndices.forEach(idx => {
        if (getSelectedRows(st).has(idx)) {
          getSelectedRows(st).delete(idx);
        } else {
          getSelectedRows(st).add(idx);
        }
      });
    } else if (action === 'invert-all') {
      indices.forEach(idx => {
        if (getSelectedRows(st).has(idx)) {
          getSelectedRows(st).delete(idx);
        } else {
          getSelectedRows(st).add(idx);
        }
      });
    } else if (action === 'select-all') {
      indices.forEach(idx => getSelectedRows(st).add(idx));
    } else if (action === 'deselect-all') {
      getSelectedRows(st).clear();
    }
    
    renderCardsView(st);
  });
}

function getCategoricalOrNumericColumns(st = state) {
  const cols = [];
  st.columnNames.forEach((name, idx) => {
    const type = st.columnTypes[idx];
    if (['boolean', 'string', 'select', 'int', 'float', 'date', 'datetime', 'time'].includes(type)) {
      cols.push({ idx, name, type });
    }
  });
  return cols;
}

function initPivotConfig(st = state) {
  const pivotView = st.container ? st.container.querySelector('.view-pivot') : el('.view-pivot');
  if (!pivotView) return;
  
  // Check for empty items
  const pivotContainer = pivotView.querySelector('.pivot-table-container');
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    if (pivotContainer) {
      pivotContainer.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para gerar uma tabela pivot.</p>';
    }
    return;
  }
  
  const cols = getCategoricalOrNumericColumns(st);
  
  const rowSelect = pivotView.querySelector('.pivot-rows');
  const colSelect = pivotView.querySelector('.pivot-cols');
  
  if (!rowSelect || !colSelect) return;
  
  let options = '<option value="">Select column...</option>';
  cols.forEach(c => {
    options += '<option value="' + c.idx + '">' + escapeHtml(c.name) + ' (' + c.type + ')</option>';
  });
  
  rowSelect.innerHTML = options;
  colSelect.innerHTML = options;
  
  // Initialize values config
  renderPivotValuesConfig(st);
  
  // Add event listeners for Generate Pivot button
  const generateBtn = pivotView.querySelector('.btn-generate-pivot');
  if (generateBtn) {
    const newBtn = generateBtn.cloneNode(true);
    generateBtn.parentNode.replaceChild(newBtn, generateBtn);
    newBtn.addEventListener('click', () => generatePivotTable(st));
  }
  
  // Add event listener for Add Value button
  const addValueBtn = pivotView.querySelector('.btn-add-pivot-value');
  if (addValueBtn) {
    const newBtn = addValueBtn.cloneNode(true);
    addValueBtn.parentNode.replaceChild(newBtn, addValueBtn);
    newBtn.addEventListener('click', () => {
      getPivotConfig(st).values.push({ column: null, aggregation: 'count' });
      renderPivotValuesConfig(st);
    });
  }
}

function renderPivotValuesConfig(st = state) {
  const container = st.container ? st.container.querySelector('.pivot-values-config') : el('.pivot-values-config');
  if (!container) return;
  
  const cols = getCategoricalOrNumericColumns(st);
  
  let html = '';
  getPivotConfig(st).values.forEach((v, i) => {
    const colName = v.column !== null ? st.columnNames[v.column] : '';
    html += '<div class="pivot-value-item">';
    html += '<select class="pivot-value-col" data-idx="' + i + '">';
    html += '<option value="">Column...</option>';
    cols.forEach(c => {
      html += '<option value="' + c.idx + '" ' + (v.column === c.idx ? 'selected' : '') + '>' + escapeHtml(c.name) + '</option>';
    });
    html += '</select>';
    html += '<select class="pivot-value-agg" data-idx="' + i + '">';
    html += '<option value="count" ' + (v.aggregation === 'count' ? 'selected' : '') + '>Count</option>';
    html += '<option value="sum" ' + (v.aggregation === 'sum' ? 'selected' : '') + '>Sum</option>';
    html += '<option value="average" ' + (v.aggregation === 'average' ? 'selected' : '') + '>Average</option>';
    html += '<option value="median" ' + (v.aggregation === 'median' ? 'selected' : '') + '>Median</option>';
    html += '<option value="stddev" ' + (v.aggregation === 'stddev' ? 'selected' : '') + '>Std Dev</option>';
    html += '<option value="pctTotal" ' + (v.aggregation === 'pctTotal' ? 'selected' : '') + '>% Total</option>';
    html += '<option value="pctRow" ' + (v.aggregation === 'pctRow' ? 'selected' : '') + '>% Row</option>';
    html += '<option value="pctCol" ' + (v.aggregation === 'pctCol' ? 'selected' : '') + '>% Col</option>';
    html += '</select>';
    html += '<button data-remove-idx="' + i + '">×</button>';
    html += '</div>';
  });
  
  container.innerHTML = html;
  
  // Event listeners
  container.querySelectorAll('.pivot-value-col').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      getPivotConfig(st).values[idx].column = e.target.value ? parseInt(e.target.value) : null;
    });
  });
  
  container.querySelectorAll('.pivot-value-agg').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      getPivotConfig(st).values[idx].aggregation = e.target.value;
    });
  });
  
  container.querySelectorAll('[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.removeIdx);
      getPivotConfig(st).values.splice(idx, 1);
      renderPivotValuesConfig(st);
    });
  });
}

function generatePivotTable(st = state) {
  // Check for empty items
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    const pivotView = st.container ? st.container.querySelector('.view-pivot') : el('.view-pivot');
    const pivotContainer = pivotView?.querySelector('.pivot-table-container');
    if (pivotContainer) {
      pivotContainer.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para gerar uma tabela pivot.</p>';
    }
    return;
  }
  
  const rowSelect = st.container ? st.container.querySelector('.pivot-rows') : el('.pivot-rows');
  const colSelect = st.container ? st.container.querySelector('.pivot-cols') : el('.pivot-cols');
  const rowColIdx = rowSelect?.value;
  const colColIdx = colSelect?.value;
  
  const hasRows = rowColIdx !== '' && rowColIdx !== null && rowColIdx !== undefined;
  const hasCols = colColIdx !== '' && colColIdx !== null && colColIdx !== undefined;
  
  if (!hasRows && !hasCols) {
    alert('Please select at least one dimension (Rows or Columns)');
    return;
  }
  
  const rowIdx = hasRows ? parseInt(rowColIdx) : null;
  const colIdx = hasCols ? parseInt(colColIdx) : null;
  
  
  // Get aggregation configs (default to id, count if none selected)
  const idColumnIdx = st.columnNames.indexOf('id') !== -1 ? st.columnNames.indexOf('id') : 0;
  const aggregations = getPivotConfig(st).values.length > 0 ? 
    getPivotConfig(st).values.filter(v => v.column !== null || v.aggregation === 'count') :
    [{ column: idColumnIdx, aggregation: 'count' }];
  
  if (aggregations.length === 0) {
    aggregations.push({ column: idColumnIdx, aggregation: 'count' });
  }
  
  // Get unique values for rows and columns
  const rowValues = new Set();
  const colValues = new Set();
  
  getSortedIndices(st).forEach(i => {
    const row = st.relation.items[i];
    if (hasRows && row[rowIdx] !== null) rowValues.add(String(row[rowIdx]));
    if (hasCols && row[colIdx] !== null) colValues.add(String(row[colIdx]));
  });
  
  const rowValuesArr = hasRows ? Array.from(rowValues).sort() : ['Total'];
  const colValuesArr = hasCols ? Array.from(colValues).sort() : ['Total'];
  
  // Build pivot data for each aggregation - store arrays of values for numeric aggregations
  const pivotData = {}; // { aggIdx: { rowVal: { colVal: [] or count } } }
  let grandTotal = 0;
  const rowTotals = {};
  const colTotals = {};
  const rowValuesData = {}; // { aggIdx: { rowVal: [] } } for row totals
  const colValuesData = {}; // { aggIdx: { colVal: [] } } for col totals
  const grandValuesData = {}; // { aggIdx: [] } for grand totals
  
  const numericAggs = ['sum', 'average', 'median', 'stddev'];
  
  aggregations.forEach((agg, aggIdx) => {
    pivotData[aggIdx] = {};
    rowValuesData[aggIdx] = {};
    colValuesData[aggIdx] = {};
    grandValuesData[aggIdx] = [];
    
    rowValuesArr.forEach(rv => {
      pivotData[aggIdx][rv] = {};
      rowValuesData[aggIdx][rv] = [];
      colValuesArr.forEach(cv => {
        pivotData[aggIdx][rv][cv] = numericAggs.includes(agg.aggregation) ? [] : 0;
      });
    });
    colValuesArr.forEach(cv => {
      colValuesData[aggIdx][cv] = [];
    });
  });
  
  rowValuesArr.forEach(rv => {
    rowTotals[rv] = 0;
  });
  colValuesArr.forEach(cv => {
    colTotals[cv] = 0;
  });
  
  getSortedIndices(st).forEach(i => {
    const row = st.relation.items[i];
    const rv = hasRows ? (row[rowIdx] !== null ? String(row[rowIdx]) : null) : 'Total';
    const cv = hasCols ? (row[colIdx] !== null ? String(row[colIdx]) : null) : 'Total';
    
    const rvValid = hasRows ? rv !== null : true;
    const cvValid = hasCols ? cv !== null : true;
    
    if (rvValid && cvValid) {
      aggregations.forEach((agg, aggIdx) => {
        if (numericAggs.includes(agg.aggregation)) {
          if (agg.column !== null) {
            const val = parseFloat(row[agg.column]);
            if (!isNaN(val)) {
              pivotData[aggIdx][rv][cv].push(val);
              rowValuesData[aggIdx][rv].push(val);
              colValuesData[aggIdx][cv].push(val);
              grandValuesData[aggIdx].push(val);
            }
          }
        } else {
          pivotData[aggIdx][rv][cv]++;
        }
      });
      rowTotals[rv]++;
      colTotals[cv]++;
      grandTotal++;
    }
  });
  
  // Helper functions for statistics
  function calcSum(arr) { return arr.reduce((a, b) => a + b, 0); }
  function calcMean(arr) { return arr.length > 0 ? calcSum(arr) / arr.length : 0; }
  function calcMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
  function calcStdDev(arr) {
    if (arr.length < 1) return 0;
    const mean = calcMean(arr);
    const sqDiffs = arr.map(v => (v - mean) ** 2);
    return Math.sqrt(calcSum(sqDiffs) / arr.length); // Population std dev for consistency
  }
  
  function computeAggValue(data, aggType) {
    if (Array.isArray(data)) {
      if (data.length === 0) return '-';
      if (aggType === 'sum') return calcSum(data).toFixed(2);
      if (aggType === 'average') return calcMean(data).toFixed(2);
      if (aggType === 'median') return calcMedian(data).toFixed(2);
      if (aggType === 'stddev') return calcStdDev(data).toFixed(2);
    }
    return data;
  }
  
  // Helper to format value based on aggregation type
  function formatValue(data, aggType, rowVal, colVal) {
    if (numericAggs.includes(aggType)) {
      return computeAggValue(data, aggType);
    }
    const count = data;
    if (aggType === 'count') return count;
    if (aggType === 'pctTotal') return grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%';
    if (aggType === 'pctRow') return rowTotals[rowVal] > 0 ? (count / rowTotals[rowVal] * 100).toFixed(1) + '%' : '0%';
    if (aggType === 'pctCol') return colTotals[colVal] > 0 ? (count / colTotals[colVal] * 100).toFixed(1) + '%' : '0%';
    return count;
  }
  
  // Helper to format pivot dimension values using options
  function formatPivotValue(value, colIndex) {
    if (value === 'Total') return value;
    if (colIndex === null) return escapeHtml(value);
    const colName = st.columnNames[colIndex];
    const colOptions = st.options[colName];
    if (colOptions && colOptions[value] !== undefined) {
      return escapeHtml(colOptions[value]);
    }
    return escapeHtml(value);
  }
  
  // Render pivot table
  let html = '<table class="pivot-table">';
  
  // Determine header labels
  const rowLabel = hasRows ? escapeHtml(st.columnNames[rowIdx]) : '';
  const colLabel = hasCols ? escapeHtml(st.columnNames[colIdx]) : '';
  const headerLabel = hasRows && hasCols ? rowLabel + ' \\ ' + colLabel : (hasRows ? rowLabel : colLabel);
  
  // Header row with column values
  html += '<thead><tr>';
  html += '<th class="pivot-row-header" rowspan="2">' + headerLabel + '</th>';
  
  if (hasCols) {
    colValuesArr.forEach(cv => {
      html += '<th colspan="' + aggregations.length + '">' + formatPivotValue(cv, colIdx) + '</th>';
    });
    html += '<th colspan="' + aggregations.length + '" class="pivot-total">Total</th>';
  } else {
    aggregations.forEach(agg => {
      const labels = {
        count: 'Count', sum: 'Sum', average: 'Avg', median: 'Med', stddev: 'StdDev',
        pctTotal: '%Tot', pctRow: '%Row', pctCol: '%Col'
      };
      const label = labels[agg.aggregation] || agg.aggregation;
      html += '<th>' + label + '</th>';
    });
  }
  html += '</tr>';
  
  // Sub-header with aggregation labels (only if we have columns)
  if (hasCols) {
    html += '<tr>';
    for (let c = 0; c <= colValuesArr.length; c++) {
      aggregations.forEach(agg => {
        const labels = {
          count: 'Count', sum: 'Sum', average: 'Avg', median: 'Med', stddev: 'StdDev',
          pctTotal: '%Tot', pctRow: '%Row', pctCol: '%Col'
        };
        const label = labels[agg.aggregation] || agg.aggregation;
        html += '<th style="font-size: 0.75rem; font-weight: normal;">' + label + '</th>';
      });
    }
    html += '</tr>';
  }
  html += '</thead>';
  
  html += '<tbody>';
  
  rowValuesArr.forEach(rv => {
    html += '<tr>';
    html += '<td class="pivot-row-header">' + formatPivotValue(rv, rowIdx) + '</td>';
    
    if (hasCols) {
      colValuesArr.forEach(cv => {
        aggregations.forEach((agg, aggIdx) => {
          const count = pivotData[aggIdx][rv][cv];
          const displayVal = formatValue(count, agg.aggregation, rv, cv);
          html += '<td>' + displayVal + '</td>';
        });
      });
      // Row totals
      aggregations.forEach((agg, aggIdx) => {
        let displayVal;
        if (numericAggs.includes(agg.aggregation)) {
          displayVal = computeAggValue(rowValuesData[aggIdx][rv], agg.aggregation);
        } else {
          const count = rowTotals[rv];
          displayVal = agg.aggregation === 'count' ? count : 
                       agg.aggregation === 'pctTotal' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                       agg.aggregation === 'pctRow' ? '100%' :
                       (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%');
        }
        html += '<td class="pivot-total">' + displayVal + '</td>';
      });
    } else {
      // No columns - just show values for each row
      aggregations.forEach((agg, aggIdx) => {
        const count = pivotData[aggIdx][rv]['Total'];
        const displayVal = formatValue(count, agg.aggregation, rv, 'Total');
        html += '<td>' + displayVal + '</td>';
      });
    }
    html += '</tr>';
  });
  
  // Total row (only if we have both or columns)
  if (hasCols || !hasRows) {
    html += '<tr class="pivot-total">';
    html += '<td class="pivot-row-header pivot-total">Total</td>';
    
    if (hasCols) {
      colValuesArr.forEach(cv => {
        aggregations.forEach((agg, aggIdx) => {
          let displayVal;
          if (numericAggs.includes(agg.aggregation)) {
            displayVal = computeAggValue(colValuesData[aggIdx][cv], agg.aggregation);
          } else {
            const count = colTotals[cv];
            displayVal = agg.aggregation === 'count' ? count :
                         agg.aggregation === 'pctTotal' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                         agg.aggregation === 'pctRow' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                         '100%';
          }
          html += '<td>' + displayVal + '</td>';
        });
      });
      // Grand total
      aggregations.forEach((agg, aggIdx) => {
        let displayVal;
        if (numericAggs.includes(agg.aggregation)) {
          displayVal = computeAggValue(grandValuesData[aggIdx], agg.aggregation);
        } else {
          displayVal = agg.aggregation === 'count' ? grandTotal : '100%';
        }
        html += '<td>' + displayVal + '</td>';
      });
    } else {
      // Grand total only
      aggregations.forEach((agg, aggIdx) => {
        let displayVal;
        if (numericAggs.includes(agg.aggregation)) {
          displayVal = computeAggValue(grandValuesData[aggIdx], agg.aggregation);
        } else {
          displayVal = agg.aggregation === 'count' ? grandTotal : '100%';
        }
        html += '<td>' + displayVal + '</td>';
      });
    }
    html += '</tr>';
  }
  
  html += '</tbody></table>';
  
  const pivotContainer = st.container ? st.container.querySelector('.pivot-table-container') : el('.pivot-table-container');
  if (pivotContainer) pivotContainer.innerHTML = html;
}

function initCorrelationConfig(st = state) {
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  if (!corrView) return;
  
  // Check for empty items
  const corrResult = corrView.querySelector('.correlation-result');
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    if (corrResult) {
      corrResult.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para calcular correlações.</p>';
    }
    return;
  }
  
  const cols = getCategoricalOrNumericColumns(st);
  
  const xSelect = corrView.querySelector('.corr-col-x');
  const ySelect = corrView.querySelector('.corr-col-y');
  
  if (!xSelect || !ySelect) return;
  
  let options = '<option value="">Select column...</option>';
  cols.forEach(c => {
    const typeLabel = ['int', 'float'].includes(c.type) ? 'numeric' : 
                      ['boolean', 'string', 'select'].includes(c.type) ? 'categorical' : 'temporal';
    options += '<option value="' + c.idx + '">' + escapeHtml(c.name) + ' (' + typeLabel + ')</option>';
  });
  
  xSelect.innerHTML = options;
  ySelect.innerHTML = options;
  
  const calcBtn = corrView.querySelector('.btn-calculate-corr');
  if (calcBtn) {
    const newBtn = calcBtn.cloneNode(true);
    calcBtn.parentNode.replaceChild(newBtn, calcBtn);
    newBtn.addEventListener('click', () => calculateCorrelation(st));
  }
  
  const allBtn = corrView.querySelector('.btn-corr-all');
  if (allBtn) {
    const newBtn = allBtn.cloneNode(true);
    allBtn.parentNode.replaceChild(newBtn, allBtn);
    newBtn.addEventListener('click', () => analyzeAllPairs(st));
  }
  
  // Add event listener for Help button
  const helpBtn = corrView.querySelector('.btn-corr-help');
  if (helpBtn) {
    const newBtn = helpBtn.cloneNode(true);
    helpBtn.parentNode.replaceChild(newBtn, helpBtn);
    newBtn.addEventListener('click', () => {
      const helpDiv = corrView.querySelector('.correlation-help');
      if (helpDiv) {
        helpDiv.style.display = helpDiv.style.display === 'none' ? 'block' : 'none';
      }
    });
  }
}

function calculateCorrelation(st = state) {
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  if (!corrView) return;
  
  // Check for empty items
  const corrResult = corrView.querySelector('.correlation-result');
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    if (corrResult) {
      corrResult.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para calcular correlações.</p>';
    }
    return;
  }
  
  const xColIdx = corrView.querySelector('.corr-col-x')?.value;
  const yColIdx = corrView.querySelector('.corr-col-y')?.value;
  const method = corrView.querySelector('.corr-method')?.value || 'auto';
  
  if (!xColIdx || !yColIdx) {
    alert('Please select both X and Y columns');
    return;
  }
  
  const xIdx = parseInt(xColIdx);
  const yIdx = parseInt(yColIdx);
  const xType = st.columnTypes[xIdx];
  const yType = st.columnTypes[yIdx];
  
  const isNumericX = ['int', 'float'].includes(xType);
  const isNumericY = ['int', 'float'].includes(yType);
  const isTemporalX = ['date', 'datetime', 'time'].includes(xType);
  const isTemporalY = ['date', 'datetime', 'time'].includes(yType);
  const corrResultEl = corrView.querySelector('.correlation-result');
  
  function toNumeric(val, type) {
    if (val === null) return null;
    if (['int', 'float'].includes(type)) return typeof val === 'number' ? val : null;
    if (['date', 'datetime'].includes(type)) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.getTime();
    }
    if (type === 'time') {
      const parts = String(val).split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
      }
      return null;
    }
    return null;
  }
  
  const isBinaryX = xType === 'boolean';
  const isBinaryY = yType === 'boolean';
  
  let effectiveMethod = method;
  if (method === 'auto') {
    if (isBinaryX && isBinaryY) {
      effectiveMethod = 'phi';
    } else if ((isBinaryX && (isNumericY || isTemporalY)) || (isBinaryY && (isNumericX || isTemporalX))) {
      effectiveMethod = 'pointbiserial';
    } else if ((isNumericX || isTemporalX) && (isNumericY || isTemporalY)) {
      let pairCount = 0;
      getSortedIndices(st).forEach(i => {
        const row = st.relation.items[i];
        const x = toNumeric(row[xIdx], xType);
        const y = toNumeric(row[yIdx], yType);
        if (x !== null && y !== null) pairCount++;
      });
      effectiveMethod = pairCount < 30 ? 'kendall' : 'pearson';
    } else {
      effectiveMethod = 'cramers';
    }
  }
  
  if (['pearson', 'spearman', 'kendall'].includes(effectiveMethod)) {
    const pairs = [];
    getSortedIndices(st).forEach(i => {
      const row = st.relation.items[i];
      const x = toNumeric(row[xIdx], xType);
      const y = toNumeric(row[yIdx], yType);
      if (x !== null && y !== null) pairs.push({ x, y });
    });
    
    if (pairs.length < 2) {
      if (corrResultEl) corrResultEl.innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    if (effectiveMethod === 'spearman') {
      renderSpearmanCorrelation(pairs, xIdx, yIdx, st);
    } else if (effectiveMethod === 'kendall') {
      renderKendallCorrelation(pairs, xIdx, yIdx, st);
    } else {
      renderPearsonCorrelation(pairs, xIdx, yIdx, st);
    }
  } else if (effectiveMethod === 'pointbiserial') {
    const binaryIdx = isBinaryX ? xIdx : yIdx;
    const numericIdx = isBinaryX ? yIdx : xIdx;
    const numericType = isBinaryX ? yType : xType;
    
    const pairs = [];
    getSortedIndices(st).forEach(i => {
      const row = st.relation.items[i];
      const bVal = row[binaryIdx];
      const nVal = toNumeric(row[numericIdx], numericType);
      if (bVal !== null && nVal !== null) pairs.push({ binary: bVal ? 1 : 0, numeric: nVal });
    });
    
    if (pairs.length < 2) {
      if (corrResultEl) corrResultEl.innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    renderPointBiserialCorrelation(pairs, xIdx, yIdx, binaryIdx, numericIdx, st);
  } else if (effectiveMethod === 'phi') {
    const pairs = [];
    getSortedIndices(st).forEach(i => {
      const row = st.relation.items[i];
      const x = row[xIdx];
      const y = row[yIdx];
      if (x !== null && y !== null) pairs.push({ x: x ? 1 : 0, y: y ? 1 : 0 });
    });
    
    if (pairs.length < 2) {
      if (corrResultEl) corrResultEl.innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    renderPhiCorrelation(pairs, xIdx, yIdx, st);
  } else {
    const contingency = {};
    const xCounts = {};
    const yCounts = {};
    let total = 0;
    
    getSortedIndices(st).forEach(i => {
      const row = st.relation.items[i];
      const xVal = row[xIdx] !== null ? String(row[xIdx]) : null;
      const yVal = row[yIdx] !== null ? String(row[yIdx]) : null;
      
      if (xVal !== null && yVal !== null) {
        if (!contingency[xVal]) contingency[xVal] = {};
        if (!contingency[xVal][yVal]) contingency[xVal][yVal] = 0;
        contingency[xVal][yVal]++;
        xCounts[xVal] = (xCounts[xVal] || 0) + 1;
        yCounts[yVal] = (yCounts[yVal] || 0) + 1;
        total++;
      }
    });
    
    if (total < 2) {
      if (corrResultEl) corrResultEl.innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    let chiSquared = 0;
    const xKeys = Object.keys(xCounts);
    const yKeys = Object.keys(yCounts);
    
    xKeys.forEach(xVal => {
      yKeys.forEach(yVal => {
        const observed = (contingency[xVal] && contingency[xVal][yVal]) || 0;
        const expected = (xCounts[xVal] * yCounts[yVal]) / total;
        if (expected > 0) chiSquared += Math.pow(observed - expected, 2) / expected;
      });
    });
    
    const k = Math.min(xKeys.length, yKeys.length);
    const cramersV = k > 1 ? Math.sqrt(chiSquared / (total * (k - 1))) : 0;
    
    renderCramersV(cramersV, total, xIdx, yIdx, xKeys.length, yKeys.length, st);
  }
}

function detectOutliers(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return { lowerBound, upperBound, q1, q3, iqr };
}

function testNormality(values) {
  const n = values.length;
  if (n < 3) return null;
  
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance) || 1;
  
  // Calculate skewness and kurtosis
  const m3 = values.reduce((s, v) => s + ((v - mean) / std) ** 3, 0) / n;
  const m4 = values.reduce((s, v) => s + ((v - mean) / std) ** 4, 0) / n;
  const skewness = m3;
  const kurtosis = m4 - 3; // Excess kurtosis (normal = 0)
  
  // Jarque-Bera test statistic
  const jbStat = (n / 6) * (skewness ** 2 + (kurtosis ** 2) / 4);
  // Approximate p-value using chi-square(2) distribution
  const jbPValue = Math.exp(-jbStat / 2);
  
  // D'Agostino-Pearson K² test (simplified)
  // Uses skewness and kurtosis z-scores
  const seSkew = Math.sqrt((6 * n * (n - 1)) / ((n - 2) * (n + 1) * (n + 3)));
  const seKurt = 2 * seSkew * Math.sqrt((n * n - 1) / ((n - 3) * (n + 5)));
  const zSkew = skewness / seSkew;
  const zKurt = kurtosis / seKurt;
  const dpK2 = zSkew ** 2 + zKurt ** 2;
  const dpPValue = Math.exp(-dpK2 / 2);
  
  // Shapiro-Wilk approximation for small samples (simplified)
  // Uses correlation between ordered stats and expected normal quantiles
  const sorted = [...values].sort((a, b) => a - b);
  let swW = 0;
  if (n >= 3 && n <= 50) {
    // Simplified approximation
    const expectedZ = sorted.map((_, i) => {
      const p = (i + 0.5) / n;
      // Approximate inverse normal using Beasley-Springer-Moro algorithm (simplified)
      return p < 0.5 ? -Math.sqrt(-2 * Math.log(p)) : Math.sqrt(-2 * Math.log(1 - p));
    });
    const sumEZ = expectedZ.reduce((s, z) => s + z, 0);
    const meanEZ = sumEZ / n;
    const ssEZ = expectedZ.reduce((s, z) => s + (z - meanEZ) ** 2, 0);
    const ssV = values.reduce((s, v) => s + (v - mean) ** 2, 0);
    const covar = sorted.reduce((s, v, i) => s + (v - mean) * (expectedZ[i] - meanEZ), 0);
    swW = ssV > 0 && ssEZ > 0 ? (covar ** 2) / (ssV * ssEZ) : 1;
  }
  const swPValue = swW > 0.9 ? 0.5 : swW > 0.8 ? 0.1 : swW > 0.7 ? 0.01 : 0.001;
  
  // Determine overall normality conclusion
  const alpha = 0.05;
  const jbNormal = jbPValue > alpha;
  const dpNormal = dpPValue > alpha;
  const swNormal = swPValue > alpha;
  
  // Consensus
  const normalVotes = (jbNormal ? 1 : 0) + (dpNormal ? 1 : 0) + (swNormal ? 1 : 0);
  const isNormal = normalVotes >= 2;
  
  return {
    n,
    skewness,
    kurtosis,
    tests: [
      {
        name: 'Jarque-Bera',
        stat: jbStat,
        pValue: jbPValue,
        isNormal: jbNormal,
        when: 'Large samples (n>30). Based on skewness and kurtosis.'
      },
      {
        name: "D'Agostino-Pearson",
        stat: dpK2,
        pValue: dpPValue,
        isNormal: dpNormal,
        when: 'Medium to large samples (n>20). Omnibus test combining skewness and kurtosis.'
      },
      {
        name: 'Shapiro-Wilk',
        stat: swW,
        pValue: swPValue,
        isNormal: swNormal,
        when: 'Small samples (n<50). Most powerful test for normality.'
      }
    ],
    isNormal,
    recommendation: n < 20 ? 'Shapiro-Wilk' : n < 50 ? "D'Agostino-Pearson" : 'Jarque-Bera'
  };
}

function renderNormalityPanel(xValues, yValues, xName, yName) {
  const xNorm = testNormality(xValues);
  const yNorm = testNormality(yValues);
  
  if (!xNorm || !yNorm) return '';
  
  let html = '<div class="normality-panel">';
  html += '<div class="normality-header">Normality Analysis</div>';
  html += '<div class="normality-note">Pearson correlation assumes both variables are normally distributed.</div>';
  
  // X variable
  html += '<div class="normality-var">';
  html += '<div class="normality-var-name">' + escapeHtml(xName) + '</div>';
  html += '<div class="normality-stats">Skewness: ' + xNorm.skewness.toFixed(3) + ' | Kurtosis: ' + xNorm.kurtosis.toFixed(3) + '</div>';
  html += '<table class="normality-table"><tr><th>Test</th><th>Statistic</th><th>p-value</th><th>Normal?</th><th>Best for</th></tr>';
  xNorm.tests.forEach(t => {
    const cls = t.isNormal ? 'norm-pass' : 'norm-fail';
    const recommended = t.name === xNorm.recommendation ? ' (recommended)' : '';
    html += '<tr class="' + cls + '"><td>' + t.name + recommended + '</td><td>' + t.stat.toFixed(4) + '</td><td>' + t.pValue.toFixed(4) + '</td><td>' + (t.isNormal ? '✓' : '✗') + '</td><td>' + t.when + '</td></tr>';
  });
  html += '</table>';
  html += '<div class="normality-conclusion ' + (xNorm.isNormal ? 'norm-pass' : 'norm-fail') + '">';
  html += xNorm.isNormal ? '✓ Data appears normally distributed' : '✗ Data may not be normally distributed';
  html += '</div></div>';
  
  // Y variable
  html += '<div class="normality-var">';
  html += '<div class="normality-var-name">' + escapeHtml(yName) + '</div>';
  html += '<div class="normality-stats">Skewness: ' + yNorm.skewness.toFixed(3) + ' | Kurtosis: ' + yNorm.kurtosis.toFixed(3) + '</div>';
  html += '<table class="normality-table"><tr><th>Test</th><th>Statistic</th><th>p-value</th><th>Normal?</th><th>Best for</th></tr>';
  yNorm.tests.forEach(t => {
    const cls = t.isNormal ? 'norm-pass' : 'norm-fail';
    const recommended = t.name === yNorm.recommendation ? ' (recommended)' : '';
    html += '<tr class="' + cls + '"><td>' + t.name + recommended + '</td><td>' + t.stat.toFixed(4) + '</td><td>' + t.pValue.toFixed(4) + '</td><td>' + (t.isNormal ? '✓' : '✗') + '</td><td>' + t.when + '</td></tr>';
  });
  html += '</table>';
  html += '<div class="normality-conclusion ' + (yNorm.isNormal ? 'norm-pass' : 'norm-fail') + '">';
  html += yNorm.isNormal ? '✓ Data appears normally distributed' : '✗ Data may not be normally distributed';
  html += '</div></div>';
  
  // Overall conclusion
  const bothNormal = xNorm.isNormal && yNorm.isNormal;
  html += '<div class="normality-overall ' + (bothNormal ? 'norm-pass' : 'norm-fail') + '">';
  if (bothNormal) {
    html += '<strong>Conclusion:</strong> Both variables appear normally distributed. Pearson correlation is appropriate.';
  } else {
    html += '<strong>Conclusion:</strong> One or both variables may not be normally distributed. Consider using Spearman or Kendall correlation instead.';
  }
  html += '</div>';
  html += '</div>';
  
  return html;
}

function renderPearsonCorrelation(pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  const sumX = pairs.reduce((s, p) => s + p.x, 0);
  const sumY = pairs.reduce((s, p) => s + p.y, 0);
  const sumXY = pairs.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = pairs.reduce((s, p) => s + p.x * p.x, 0);
  const sumY2 = pairs.reduce((s, p) => s + p.y * p.y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  const r = denominator === 0 ? 0 : numerator / denominator;
  
  // Detect outliers using IQR method
  const xValues = pairs.map(p => p.x);
  const yValues = pairs.map(p => p.y);
  const xOutlierBounds = detectOutliers(xValues);
  const yOutlierBounds = detectOutliers(yValues);
  
  const outlierPairs = pairs.filter(p => 
    p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
    p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound
  );
  const outlierCount = outlierPairs.length;
  
  // Calculate residuals for linearity assessment
  const meanX = sumX / n;
  const meanY = sumY / n;
  const slope = numerator / (n * sumX2 - sumX * sumX || 1);
  const intercept = meanY - slope * meanX;
  
  const residuals = pairs.map(p => {
    const predicted = slope * p.x + intercept;
    return p.y - predicted;
  });
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const ssTot = pairs.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  
  const absR = Math.abs(r);
  let strength = 'No correlation';
  if (absR >= 0.9) strength = 'Very strong';
  else if (absR >= 0.7) strength = 'Strong';
  else if (absR >= 0.5) strength = 'Moderate';
  else if (absR >= 0.3) strength = 'Weak';
  else if (absR >= 0.1) strength = 'Very weak';
  
  const colorClass = r > 0.1 ? 'correlation-positive' : r < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Pearson Correlation (r)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + r.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (r > 0 ? 'positive' : r < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs | R² = ' + (rSquared * 100).toFixed(1) + '%</div>';
  
  // Sample size warning
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample (n&lt;30): Consider using Kendall\'s Tau for more robust results</div>';
  }
  
  // Outlier warning
  if (outlierCount > 0) {
    const outlierPct = ((outlierCount / n) * 100).toFixed(1);
    html += '<div class="correlation-warning">⚠️ ' + outlierCount + ' outliers detected (' + outlierPct + '%): Consider using Spearman for robust analysis</div>';
  }
  
  // Linearity indicator
  if (rSquared < 0.5 && absR > 0.3) {
    html += '<div class="correlation-warning">⚠️ Low R² suggests non-linear relationship: Consider Spearman (monotonic) or transform data</div>';
  }
  
  html += renderNormalityPanel(xValues, yValues, st.columnNames[xIdx], st.columnNames[yIdx]);
  
  const width = 400;
  const height = 300;
  const padding = 40;
  
  const xMin = Math.min(...pairs.map(p => p.x));
  const xMax = Math.max(...pairs.map(p => p.x));
  const yMin = Math.min(...pairs.map(p => p.y));
  const yMax = Math.max(...pairs.map(p => p.y));
  
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="12">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="15" y="' + (height/2) + '" text-anchor="middle" font-size="12" transform="rotate(-90 15 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  // Draw points with outliers in different color
  pairs.forEach(p => {
    const cx = xScale(p.x);
    const cy = yScale(p.y);
    const isOutlier = p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
                      p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound;
    const color = isOutlier ? '#ef4444' : '#3b82f6';
    const radius = isOutlier ? 6 : 4;
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="' + color + '" opacity="0.7"/>';
  });
  
  // Trend line (using already calculated slope/intercept)
  const lineX1 = xMin;
  const lineY1 = slope * lineX1 + intercept;
  const lineX2 = xMax;
  const lineY2 = slope * lineX2 + intercept;
  
  html += '<line x1="' + xScale(lineX1) + '" y1="' + yScale(lineY1) + '" x2="' + xScale(lineX2) + '" y2="' + yScale(lineY2) + '" stroke="#10b981" stroke-width="2" stroke-dasharray="5,5"/>';
  html += '</svg>';
  if (outlierCount > 0) {
    html += '<div class="correlation-legend"><span class="legend-dot outlier"></span> Outliers (IQR method) <span class="legend-dot normal"></span> Normal points</div>';
  }
  html += '<div class="correlation-alternatives">';
  html += '<span class="correlation-alt-label">Try alternative:</span>';
  html += '<button class="btn-alt-spearman btn btn-outline btn-sm" data-testid="button-alt-spearman">Spearman</button>';
  html += '<button class="btn-alt-kendall btn btn-outline btn-sm" data-testid="button-alt-kendall">Kendall</button>';
  html += '</div>';
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) {
    corrResultEl.innerHTML = html;
    corrResultEl.querySelector('.btn-alt-spearman')?.addEventListener('click', () => {
      renderSpearmanCorrelation(pairs, xIdx, yIdx, st);
    });
    corrResultEl.querySelector('.btn-alt-kendall')?.addEventListener('click', () => {
      renderKendallCorrelation(pairs, xIdx, yIdx, st);
    });
  }
}

function renderSpearmanCorrelation(pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  
  // Rank the values
  function rank(arr) {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(arr.length);
    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (j < sorted.length && sorted[j].v === sorted[i].v) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) {
        ranks[sorted[k].i] = avgRank;
      }
      i = j;
    }
    return ranks;
  }
  
  const xRanks = rank(pairs.map(p => p.x));
  const yRanks = rank(pairs.map(p => p.y));
  
  // Calculate Spearman correlation on ranks
  const sumRx = xRanks.reduce((s, r) => s + r, 0);
  const sumRy = yRanks.reduce((s, r) => s + r, 0);
  const sumRxRy = xRanks.reduce((s, r, i) => s + r * yRanks[i], 0);
  const sumRx2 = xRanks.reduce((s, r) => s + r * r, 0);
  const sumRy2 = yRanks.reduce((s, r) => s + r * r, 0);
  
  const numerator = n * sumRxRy - sumRx * sumRy;
  const denominator = Math.sqrt((n * sumRx2 - sumRx * sumRx) * (n * sumRy2 - sumRy * sumRy));
  
  const rho = denominator === 0 ? 0 : numerator / denominator;
  
  const absRho = Math.abs(rho);
  let strength = 'No correlation';
  if (absRho >= 0.9) strength = 'Very strong';
  else if (absRho >= 0.7) strength = 'Strong';
  else if (absRho >= 0.5) strength = 'Moderate';
  else if (absRho >= 0.3) strength = 'Weak';
  else if (absRho >= 0.1) strength = 'Very weak';
  
  const colorClass = rho > 0.1 ? 'correlation-positive' : rho < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  // Detect outliers using IQR method
  const xValues = pairs.map(p => p.x);
  const yValues = pairs.map(p => p.y);
  const xOutlierBounds = detectOutliers(xValues);
  const yOutlierBounds = detectOutliers(yValues);
  
  const outlierCount = pairs.filter(p => 
    p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
    p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound
  ).length;
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Spearman Correlation (ρ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + rho.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (rho > 0 ? 'positive' : rho < 0 ? 'negative' : '') + ' monotonic correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs</div>';
  html += '<div class="correlation-note">Spearman measures monotonic (rank-based) relationship. More robust to outliers than Pearson.</div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample (n&lt;30): Kendall\'s Tau may be more appropriate</div>';
  }
  if (outlierCount > 0) {
    html += '<div class="correlation-warning">ℹ️ ' + outlierCount + ' potential outliers detected (marked in red) - Spearman is robust to these</div>';
  }
  
  // SVG scatter plot
  const width = 400;
  const height = 300;
  const padding = 40;
  
  const xMin = Math.min(...pairs.map(p => p.x));
  const xMax = Math.max(...pairs.map(p => p.x));
  const yMin = Math.min(...pairs.map(p => p.y));
  const yMax = Math.max(...pairs.map(p => p.y));
  
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="12">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="15" y="' + (height/2) + '" text-anchor="middle" font-size="12" transform="rotate(-90 15 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    const cx = xScale(p.x);
    const cy = yScale(p.y);
    const isOutlier = p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
                      p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound;
    const color = isOutlier ? '#ef4444' : '#10b981';
    const radius = isOutlier ? 6 : 4;
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="' + color + '" opacity="0.7"/>';
  });
  
  html += '</svg>';
  html += '<div class="correlation-alternatives">';
  html += '<span class="correlation-alt-label">Try alternative:</span>';
  html += '<button class="btn-alt-pearson btn btn-outline btn-sm" data-testid="button-alt-pearson">Pearson</button>';
  html += '<button class="btn-alt-kendall btn btn-outline btn-sm" data-testid="button-alt-kendall">Kendall</button>';
  html += '</div>';
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) {
    corrResultEl.innerHTML = html;
    corrResultEl.querySelector('.btn-alt-pearson')?.addEventListener('click', () => {
      renderPearsonCorrelation(pairs, xIdx, yIdx, st);
    });
    corrResultEl.querySelector('.btn-alt-kendall')?.addEventListener('click', () => {
      renderKendallCorrelation(pairs, xIdx, yIdx, st);
    });
  }
}

function renderKendallCorrelation(pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  
  // Calculate Kendall's Tau
  let concordant = 0;
  let discordant = 0;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const xDiff = pairs[j].x - pairs[i].x;
      const yDiff = pairs[j].y - pairs[i].y;
      const product = xDiff * yDiff;
      if (product > 0) concordant++;
      else if (product < 0) discordant++;
    }
  }
  
  const totalPairs = (n * (n - 1)) / 2;
  const tau = totalPairs > 0 ? (concordant - discordant) / totalPairs : 0;
  
  const absTau = Math.abs(tau);
  let strength = 'No correlation';
  if (absTau >= 0.9) strength = 'Very strong';
  else if (absTau >= 0.7) strength = 'Strong';
  else if (absTau >= 0.5) strength = 'Moderate';
  else if (absTau >= 0.3) strength = 'Weak';
  else if (absTau >= 0.1) strength = 'Very weak';
  
  const colorClass = tau > 0.1 ? 'correlation-positive' : tau < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  // Detect outliers using IQR method
  const xValues = pairs.map(p => p.x);
  const yValues = pairs.map(p => p.y);
  const xOutlierBounds = detectOutliers(xValues);
  const yOutlierBounds = detectOutliers(yValues);
  
  const outlierCount = pairs.filter(p => 
    p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
    p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound
  ).length;
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Kendall\'s Tau (τ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + tau.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (tau > 0 ? 'positive' : tau < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs | Concordant: ' + concordant + ' | Discordant: ' + discordant + '</div>';
  html += '<div class="correlation-note">Kendall\'s Tau is recommended for small samples (n&lt;30) and ordinal data. Robust to outliers.</div>';
  
  if (n >= 30) {
    html += '<div class="correlation-warning">ℹ️ Large sample (n≥30): Pearson or Spearman may be more efficient</div>';
  }
  if (outlierCount > 0) {
    html += '<div class="correlation-warning">⚠️ ' + outlierCount + ' outliers detected (marked in red below)</div>';
  }
  
  // SVG scatter plot
  const width = 400;
  const height = 300;
  const padding = 40;
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="12">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="15" y="' + (height/2) + '" text-anchor="middle" font-size="12" transform="rotate(-90 15 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    const isOutlier = p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
                      p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound;
    const color = isOutlier ? '#ef4444' : '#8b5cf6';
    const radius = isOutlier ? 6 : 4;
    html += '<circle cx="' + xScale(p.x) + '" cy="' + yScale(p.y) + '" r="' + radius + '" fill="' + color + '" opacity="0.7"/>';
  });
  
  html += '</svg>';
  html += '<div class="correlation-alternatives">';
  html += '<span class="correlation-alt-label">Try alternative:</span>';
  html += '<button class="btn-alt-pearson btn btn-outline btn-sm">Pearson</button>';
  html += '<button class="btn-alt-spearman btn btn-outline btn-sm">Spearman</button>';
  html += '</div>';
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) {
    corrResultEl.innerHTML = html;
    corrResultEl.querySelector('.btn-alt-pearson')?.addEventListener('click', () => renderPearsonCorrelation(pairs, xIdx, yIdx, st));
    corrResultEl.querySelector('.btn-alt-spearman')?.addEventListener('click', () => renderSpearmanCorrelation(pairs, xIdx, yIdx, st));
  }
}

function renderPointBiserialCorrelation(pairs, xIdx, yIdx, binaryIdx, numericIdx, st = state) {
  const n = pairs.length;
  const group0 = pairs.filter(p => p.binary === 0).map(p => p.numeric);
  const group1 = pairs.filter(p => p.binary === 1).map(p => p.numeric);
  
  if (group0.length === 0 || group1.length === 0) {
    const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
    const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
    if (corrResultEl) corrResultEl.innerHTML = '<p class="text-muted-foreground">Both binary groups need at least one observation</p>';
    return;
  }
  
  const n0 = group0.length;
  const n1 = group1.length;
  const mean0 = group0.reduce((s, v) => s + v, 0) / n0;
  const mean1 = group1.reduce((s, v) => s + v, 0) / n1;
  const allValues = pairs.map(p => p.numeric);
  const meanAll = allValues.reduce((s, v) => s + v, 0) / n;
  const variance = allValues.reduce((s, v) => s + (v - meanAll) ** 2, 0) / n;
  const std = Math.sqrt(variance) || 1;
  
  const rpb = ((mean1 - mean0) / std) * Math.sqrt((n0 * n1) / (n * n));
  
  const absRpb = Math.abs(rpb);
  let strength = 'No correlation';
  if (absRpb >= 0.9) strength = 'Very strong';
  else if (absRpb >= 0.7) strength = 'Strong';
  else if (absRpb >= 0.5) strength = 'Moderate';
  else if (absRpb >= 0.3) strength = 'Weak';
  else if (absRpb >= 0.1) strength = 'Very weak';
  
  const colorClass = rpb > 0.1 ? 'correlation-positive' : rpb < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Point-Biserial Correlation (r<sub>pb</sub>)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + rpb.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (rpb > 0 ? 'positive' : rpb < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' | Group 0: ' + n0 + ' (mean=' + mean0.toFixed(2) + ') | Group 1: ' + n1 + ' (mean=' + mean1.toFixed(2) + ')</div>';
  html += '<div class="correlation-note">Point-Biserial measures association between a binary variable and a continuous variable.</div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample (n&lt;30): Results may have limited statistical power</div>';
  }
  if (Math.min(n0, n1) < 5) {
    html += '<div class="correlation-warning">⚠️ Unbalanced groups: One group has fewer than 5 observations</div>';
  }
  
  // Box plot visualization
  const width = 400;
  const height = 200;
  const padding = 50;
  
  const allMin = Math.min(...allValues);
  const allMax = Math.max(...allValues);
  const scale = (v) => padding + ((v - allMin) / (allMax - allMin || 1)) * (width - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - 30) + '" x2="' + (width - padding) + '" y2="' + (height - 30) + '" stroke="#ccc" stroke-width="1"/>';
  
  // Draw group 0 points
  group0.forEach(v => {
    html += '<circle cx="' + scale(v) + '" cy="50" r="4" fill="#f59e0b" opacity="0.6"/>';
  });
  html += '<line x1="' + scale(mean0) + '" y1="40" x2="' + scale(mean0) + '" y2="60" stroke="#f59e0b" stroke-width="3"/>';
  html += '<text x="' + 20 + '" y="55" font-size="11" fill="#666">0</text>';
  
  // Draw group 1 points
  group1.forEach(v => {
    html += '<circle cx="' + scale(v) + '" cy="100" r="4" fill="#06b6d4" opacity="0.6"/>';
  });
  html += '<line x1="' + scale(mean1) + '" y1="90" x2="' + scale(mean1) + '" y2="110" stroke="#06b6d4" stroke-width="3"/>';
  html += '<text x="' + 20 + '" y="105" font-size="11" fill="#666">1</text>';
  
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="12">' + escapeHtml(st.columnNames[numericIdx]) + '</text>';
  html += '</svg>';
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) corrResultEl.innerHTML = html;
}

function renderPhiCorrelation(pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  
  // Build 2x2 contingency table
  let a = 0, b = 0, c = 0, d = 0;
  pairs.forEach(p => {
    if (p.x === 1 && p.y === 1) a++;
    else if (p.x === 1 && p.y === 0) b++;
    else if (p.x === 0 && p.y === 1) c++;
    else d++;
  });
  
  const numerator = (a * d) - (b * c);
  const denominator = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
  const phi = denominator === 0 ? 0 : numerator / denominator;
  
  const absPhi = Math.abs(phi);
  let strength = 'No association';
  if (absPhi >= 0.5) strength = 'Strong';
  else if (absPhi >= 0.3) strength = 'Moderate';
  else if (absPhi >= 0.1) strength = 'Weak';
  else if (absPhi >= 0.05) strength = 'Very weak';
  
  const colorClass = phi > 0.1 ? 'correlation-positive' : phi < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Phi Coefficient (φ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + phi.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (phi > 0 ? 'positive' : phi < 0 ? 'negative' : '') + ' association</div>';
  html += '<div class="correlation-label">n = ' + n + '</div>';
  html += '<div class="correlation-note">Phi coefficient measures association between two binary variables. Equivalent to Pearson for 2×2 tables.</div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample (n&lt;30): Results may have limited statistical power</div>';
  }
  const minCell = Math.min(a, b, c, d);
  if (minCell < 5) {
    html += '<div class="correlation-warning">⚠️ Some cells have fewer than 5 observations: Consider Fisher\'s exact test</div>';
  }
  
  html += '<table class="phi-table">';
  html += '<tr><th></th><th>' + escapeHtml(st.columnNames[yIdx]) + '=1</th><th>' + escapeHtml(st.columnNames[yIdx]) + '=0</th><th>Total</th></tr>';
  html += '<tr><th>' + escapeHtml(st.columnNames[xIdx]) + '=1</th><td>' + a + '</td><td>' + b + '</td><td>' + (a + b) + '</td></tr>';
  html += '<tr><th>' + escapeHtml(st.columnNames[xIdx]) + '=0</th><td>' + c + '</td><td>' + d + '</td><td>' + (c + d) + '</td></tr>';
  html += '<tr><th>Total</th><td>' + (a + c) + '</td><td>' + (b + d) + '</td><td>' + n + '</td></tr>';
  html += '</table>';
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) corrResultEl.innerHTML = html;
}

function renderCramersV(v, n, xIdx, yIdx, xCategories, yCategories, st = state) {
  let strength = 'No association';
  if (v >= 0.5) strength = 'Strong';
  else if (v >= 0.3) strength = 'Moderate';
  else if (v >= 0.1) strength = 'Weak';
  else if (v >= 0.05) strength = 'Very weak';
  
  const colorClass = v >= 0.3 ? 'correlation-positive' : v >= 0.1 ? 'correlation-neutral' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Cramér\'s V (categorical association)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + v.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' association</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs | ' + xCategories + ' × ' + yCategories + ' categories</div>';
  
  // Visual bar for Cramér's V (0 to 1)
  const width = 300;
  const barHeight = 30;
  
  html += '<svg viewBox="0 0 ' + width + ' ' + (barHeight + 20) + '" style="width: 300px; height: 50px;">';
  html += '<rect x="0" y="0" width="' + width + '" height="' + barHeight + '" fill="#e5e7eb" rx="4"/>';
  html += '<rect x="0" y="0" width="' + (v * width) + '" height="' + barHeight + '" fill="#10b981" rx="4"/>';
  html += '<text x="10" y="' + (barHeight + 15) + '" font-size="11" fill="#666">0</text>';
  html += '<text x="' + (width - 10) + '" y="' + (barHeight + 15) + '" font-size="11" fill="#666" text-anchor="end">1</text>';
  html += '</svg>';
  
  html += '</div>';
  
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  const corrResultEl = corrView ? corrView.querySelector('.correlation-result') : el('.correlation-result');
  if (corrResultEl) corrResultEl.innerHTML = html;
}

function analyzeAllPairs(st = state) {
  const corrView = st.container ? st.container.querySelector('.view-correlation') : el('.view-correlation');
  if (!corrView) return;
  
  const corrResultEl = corrView.querySelector('.correlation-result');
  
  // Check for empty items
  if (!st.relation || !st.relation.items || st.relation.items.length === 0 || getSortedIndices(st).length < 2) {
    if (corrResultEl) {
      corrResultEl.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados suficientes para análise de correlações.</p>';
    }
    return;
  }
  
  const method = corrView.querySelector('.corr-method')?.value || 'auto';
  const results = [];
  
  const validCols = [];
  st.columnTypes.forEach((type, idx) => {
    if (['int', 'float', 'date', 'datetime', 'time', 'boolean', 'string', 'select'].includes(type)) {
      validCols.push(idx);
    }
  });
  
  if (validCols.length < 2) {
    alert('Need at least 2 columns for correlation analysis');
    return;
  }
  
  // Helper to convert values
  function toNumeric(val, type) {
    if (val === null) return null;
    if (['int', 'float'].includes(type)) return typeof val === 'number' ? val : null;
    if (['date', 'datetime'].includes(type)) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.getTime();
    }
    if (type === 'time') {
      const parts = String(val).split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
      }
      return null;
    }
    return null;
  }
  
  for (let i = 0; i < validCols.length; i++) {
    for (let j = i + 1; j < validCols.length; j++) {
      const xIdx = validCols[i];
      const yIdx = validCols[j];
      const xType = st.columnTypes[xIdx];
      const yType = st.columnTypes[yIdx];
      
      const isNumericX = ['int', 'float'].includes(xType);
      const isNumericY = ['int', 'float'].includes(yType);
      const isTemporalX = ['date', 'datetime', 'time'].includes(xType);
      const isTemporalY = ['date', 'datetime', 'time'].includes(yType);
      const isBinaryX = xType === 'boolean';
      const isBinaryY = yType === 'boolean';
      
      let effectiveMethod = method;
      if (method === 'auto') {
        if (isBinaryX && isBinaryY) {
          effectiveMethod = 'phi';
        } else if ((isBinaryX && (isNumericY || isTemporalY)) || (isBinaryY && (isNumericX || isTemporalX))) {
          effectiveMethod = 'pointbiserial';
        } else if ((isNumericX || isTemporalX) && (isNumericY || isTemporalY)) {
          effectiveMethod = 'pearson';
        } else {
          effectiveMethod = 'cramers';
        }
      }
      
      let correlation = 0;
      let methodUsed = effectiveMethod;
      let n = 0;
      
      if (['pearson', 'spearman', 'kendall'].includes(effectiveMethod)) {
        const pairs = [];
        getSortedIndices(st).forEach(idx => {
          const row = st.relation.items[idx];
          const x = toNumeric(row[xIdx], xType);
          const y = toNumeric(row[yIdx], yType);
          if (x !== null && y !== null) pairs.push({ x, y });
        });
        
        if (pairs.length >= 2) {
          n = pairs.length;
          if (effectiveMethod === 'kendall') {
            // Kendall's Tau
            let concordant = 0;
            let discordant = 0;
            for (let ii = 0; ii < n - 1; ii++) {
              for (let jj = ii + 1; jj < n; jj++) {
                const xDiff = pairs[jj].x - pairs[ii].x;
                const yDiff = pairs[jj].y - pairs[ii].y;
                const product = xDiff * yDiff;
                if (product > 0) concordant++;
                else if (product < 0) discordant++;
              }
            }
            const totalPairs = (n * (n - 1)) / 2;
            correlation = totalPairs > 0 ? (concordant - discordant) / totalPairs : 0;
          } else if (effectiveMethod === 'spearman') {
            // Rank values
            function rank(arr) {
              const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
              const ranks = new Array(arr.length);
              let k = 0;
              while (k < sorted.length) {
                let l = k;
                while (l < sorted.length && sorted[l].v === sorted[k].v) l++;
                const avgRank = (k + 1 + l) / 2;
                for (let m = k; m < l; m++) ranks[sorted[m].i] = avgRank;
                k = l;
              }
              return ranks;
            }
            const xRanks = rank(pairs.map(p => p.x));
            const yRanks = rank(pairs.map(p => p.y));
            const sumRx = xRanks.reduce((s, r) => s + r, 0);
            const sumRy = yRanks.reduce((s, r) => s + r, 0);
            const sumRxRy = xRanks.reduce((s, r, idx) => s + r * yRanks[idx], 0);
            const sumRx2 = xRanks.reduce((s, r) => s + r * r, 0);
            const sumRy2 = yRanks.reduce((s, r) => s + r * r, 0);
            const num = n * sumRxRy - sumRx * sumRy;
            const den = Math.sqrt((n * sumRx2 - sumRx * sumRx) * (n * sumRy2 - sumRy * sumRy));
            correlation = den === 0 ? 0 : num / den;
          } else {
            // Pearson
            const sumX = pairs.reduce((s, p) => s + p.x, 0);
            const sumY = pairs.reduce((s, p) => s + p.y, 0);
            const sumXY = pairs.reduce((s, p) => s + p.x * p.y, 0);
            const sumX2 = pairs.reduce((s, p) => s + p.x * p.x, 0);
            const sumY2 = pairs.reduce((s, p) => s + p.y * p.y, 0);
            const num = n * sumXY - sumX * sumY;
            const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            correlation = den === 0 ? 0 : num / den;
          }
        }
      } else if (effectiveMethod === 'pointbiserial') {
        const pairs = [];
        getSortedIndices(st).forEach(idx => {
          const row = st.relation.items[idx];
          const bVal = isBinaryX ? row[xIdx] : row[yIdx];
          const nVal = isBinaryX ? toNumeric(row[yIdx], yType) : toNumeric(row[xIdx], xType);
          if (bVal !== null && nVal !== null) {
            pairs.push({ binary: bVal ? 1 : 0, numeric: nVal });
          }
        });
        
        if (pairs.length >= 2) {
          n = pairs.length;
          const group0 = pairs.filter(p => p.binary === 0).map(p => p.numeric);
          const group1 = pairs.filter(p => p.binary === 1).map(p => p.numeric);
          if (group0.length > 0 && group1.length > 0) {
            const n0 = group0.length;
            const n1 = group1.length;
            const mean0 = group0.reduce((s, v) => s + v, 0) / n0;
            const mean1 = group1.reduce((s, v) => s + v, 0) / n1;
            const allValues = pairs.map(p => p.numeric);
            const meanAll = allValues.reduce((s, v) => s + v, 0) / n;
            const variance = allValues.reduce((s, v) => s + (v - meanAll) ** 2, 0) / n;
            const std = Math.sqrt(variance) || 1;
            correlation = ((mean1 - mean0) / std) * Math.sqrt((n0 * n1) / (n * n));
          }
        }
      } else if (effectiveMethod === 'phi') {
        const pairs = [];
        getSortedIndices(st).forEach(idx => {
          const row = st.relation.items[idx];
          const x = row[xIdx];
          const y = row[yIdx];
          if (x !== null && y !== null) {
            pairs.push({ x: x ? 1 : 0, y: y ? 1 : 0 });
          }
        });
        
        if (pairs.length >= 2) {
          n = pairs.length;
          let a = 0, b = 0, c = 0, d = 0;
          pairs.forEach(p => {
            if (p.x === 1 && p.y === 1) a++;
            else if (p.x === 1 && p.y === 0) b++;
            else if (p.x === 0 && p.y === 1) c++;
            else d++;
          });
          const numerator = (a * d) - (b * c);
          const denominator = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
          correlation = denominator === 0 ? 0 : numerator / denominator;
        }
      } else {
        const contingency = {};
        const xCounts = {};
        const yCounts = {};
        let total = 0;
        
        getSortedIndices(st).forEach(idx => {
          const row = st.relation.items[idx];
          const xVal = row[xIdx] !== null ? String(row[xIdx]) : null;
          const yVal = row[yIdx] !== null ? String(row[yIdx]) : null;
          if (xVal !== null && yVal !== null) {
            if (!contingency[xVal]) contingency[xVal] = {};
            if (!contingency[xVal][yVal]) contingency[xVal][yVal] = 0;
            contingency[xVal][yVal]++;
            xCounts[xVal] = (xCounts[xVal] || 0) + 1;
            yCounts[yVal] = (yCounts[yVal] || 0) + 1;
            total++;
          }
        });
        
        if (total >= 2) {
          n = total;
          let chiSquared = 0;
          const xKeys = Object.keys(xCounts);
          const yKeys = Object.keys(yCounts);
          xKeys.forEach(xVal => {
            yKeys.forEach(yVal => {
              const observed = (contingency[xVal] && contingency[xVal][yVal]) || 0;
              const expected = (xCounts[xVal] * yCounts[yVal]) / total;
              if (expected > 0) chiSquared += Math.pow(observed - expected, 2) / expected;
            });
          });
          const k = Math.min(xKeys.length, yKeys.length);
          correlation = k > 1 ? Math.sqrt(chiSquared / (total * (k - 1))) : 0;
        }
      }
      
      if (n >= 2) {
        results.push({
          xIdx, yIdx,
          xName: st.columnNames[xIdx],
          yName: st.columnNames[yIdx],
          method: methodUsed,
          correlation: correlation,
          absCorrelation: Math.abs(correlation),
          n: n
        });
      }
    }
  }
  
  // Sort by absolute correlation descending
  results.sort((a, b) => b.absCorrelation - a.absCorrelation);
  
  // Render accordion
  let html = '<div class="correlation-accordion">';
  results.forEach((r, idx) => {
    const sign = r.method === 'cramers' ? '' : (r.correlation >= 0 ? '+' : '');
    const colorClass = r.absCorrelation >= 0.5 ? 'corr-strong' : r.absCorrelation >= 0.3 ? 'corr-moderate' : r.absCorrelation >= 0.1 ? 'corr-weak' : 'corr-none';
    const methodLabel = r.method === 'pearson' ? 'Pearson' : r.method === 'spearman' ? 'Spearman' : "Cramér's V";
    
    html += '<div class="corr-accordion-item">';
    html += '<div class="corr-accordion-header ' + colorClass + '" data-idx="' + idx + '">';
    html += '<span class="corr-accordion-title">' + escapeHtml(r.xName) + ' × ' + escapeHtml(r.yName) + '</span>';
    html += '<span class="corr-accordion-meta">' + methodLabel + ': ' + sign + r.correlation.toFixed(3) + ' (n=' + r.n + ')</span>';
    html += '<span class="corr-accordion-arrow">▶</span>';
    html += '</div>';
    html += '<div class="corr-accordion-content" data-x="' + r.xIdx + '" data-y="' + r.yIdx + '" data-method="' + r.method + '" style="display: none;"></div>';
    html += '</div>';
  });
  html += '</div>';
  
  if (results.length === 0) {
    html = '<p class="text-muted-foreground">No valid column pairs found for correlation analysis.</p>';
  }
  
  if (corrResultEl) {
    corrResultEl.innerHTML = html;
    
    corrResultEl.querySelectorAll('.corr-accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const arrow = this.querySelector('.corr-accordion-arrow');
        const isOpen = content.style.display !== 'none';
        
        if (isOpen) {
          content.style.display = 'none';
          arrow.textContent = '▶';
        } else {
          content.style.display = 'block';
          arrow.textContent = '▼';
          
          if (!content.dataset.loaded) {
            const xIdx = parseInt(content.dataset.x);
            const yIdx = parseInt(content.dataset.y);
            const method = content.dataset.method;
            renderPairDetail(content, xIdx, yIdx, method, st);
            content.dataset.loaded = 'true';
          }
        }
      });
    });
  }
}

function renderPairDetail(container, xIdx, yIdx, method, st = state) {
  const xType = st.columnTypes[xIdx];
  const yType = st.columnTypes[yIdx];
  const isNumericX = ['int', 'float'].includes(xType);
  const isNumericY = ['int', 'float'].includes(yType);
  const isTemporalX = ['date', 'datetime', 'time'].includes(xType);
  const isTemporalY = ['date', 'datetime', 'time'].includes(yType);
  const isBinaryX = xType === 'boolean';
  const isBinaryY = yType === 'boolean';
  const bothNumericOrTemporal = (isNumericX || isTemporalX) && (isNumericY || isTemporalY);
  const bothBinary = isBinaryX && isBinaryY;
  const oneBinaryOneNumeric = (isBinaryX && (isNumericY || isTemporalY)) || (isBinaryY && (isNumericX || isTemporalX));
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'pair-detail-content';
  
  const altDiv = document.createElement('div');
  altDiv.className = 'pair-detail-alternatives';
  
  let altHtml = '<div class="try-alternatives-row"><span class="try-alt-label">Try alternative:</span>';
  const alternatives = [];
  
  if (bothNumericOrTemporal) {
    if (method !== 'pearson') alternatives.push({ id: 'pearson', label: 'Pearson' });
    if (method !== 'spearman') alternatives.push({ id: 'spearman', label: 'Spearman' });
    if (method !== 'kendall') alternatives.push({ id: 'kendall', label: "Kendall's τ" });
  }
  if (bothBinary && method !== 'phi') {
    alternatives.push({ id: 'phi', label: 'Phi' });
  }
  if (oneBinaryOneNumeric && method !== 'pointbiserial') {
    alternatives.push({ id: 'pointbiserial', label: 'Point-Biserial' });
  }
  if (method !== 'cramers') {
    alternatives.push({ id: 'cramers', label: "Cramér's V" });
  }
  
  alternatives.forEach(alt => {
    altHtml += '<button class="btn btn-outline btn-sm try-alt-btn" data-method="' + alt.id + '">' + alt.label + '</button>';
  });
  altHtml += '</div>';
  
  if (alternatives.length > 0) {
    altDiv.innerHTML = altHtml;
  }
  
  container.innerHTML = '';
  container.appendChild(contentDiv);
  container.appendChild(altDiv);
  
  renderPairContent(contentDiv, xIdx, yIdx, method, st);
  
  altDiv.querySelectorAll('.try-alt-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const newMethod = this.dataset.method;
      renderPairDetail(container, xIdx, yIdx, newMethod, st);
    });
  });
}

function renderPairContent(container, xIdx, yIdx, method, st = state) {
  const xType = st.columnTypes[xIdx];
  const yType = st.columnTypes[yIdx];
  const isBinaryX = xType === 'boolean';
  const isBinaryY = yType === 'boolean';
  
  function toNumeric(val, type) {
    if (val === null) return null;
    if (['int', 'float'].includes(type)) return typeof val === 'number' ? val : null;
    if (['date', 'datetime'].includes(type)) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.getTime();
    }
    if (type === 'time') {
      const parts = String(val).split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
      }
      return null;
    }
    return null;
  }
  
  if (['pearson', 'spearman', 'kendall'].includes(method)) {
    const pairs = [];
    getSortedIndices(st).forEach(idx => {
      const row = st.relation.items[idx];
      const x = toNumeric(row[xIdx], xType);
      const y = toNumeric(row[yIdx], yType);
      if (x !== null && y !== null) pairs.push({ x, y });
    });
    
    if (pairs.length < 2) {
      container.innerHTML = '<p class="text-muted-foreground">Not enough data pairs.</p>';
      return;
    }
    
    if (method === 'pearson') {
      renderPearsonCorrelationTo(container, pairs, xIdx, yIdx, st);
    } else if (method === 'spearman') {
      renderSpearmanCorrelationTo(container, pairs, xIdx, yIdx, st);
    } else {
      renderKendallCorrelationTo(container, pairs, xIdx, yIdx, st);
    }
  } else if (method === 'pointbiserial') {
    const pairs = [];
    const binaryIdx = isBinaryX ? xIdx : yIdx;
    const numericIdx = isBinaryX ? yIdx : xIdx;
    const numericType = isBinaryX ? yType : xType;
    
    getSortedIndices(st).forEach(idx => {
      const row = st.relation.items[idx];
      const bVal = row[binaryIdx];
      const nVal = toNumeric(row[numericIdx], numericType);
      if (bVal !== null && nVal !== null) pairs.push({ binary: bVal ? 1 : 0, numeric: nVal });
    });
    
    if (pairs.length < 2) {
      container.innerHTML = '<p class="text-muted-foreground">Not enough data pairs.</p>';
      return;
    }
    
    renderPointBiserialCorrelationTo(container, pairs, xIdx, yIdx, binaryIdx, numericIdx, st);
  } else if (method === 'phi') {
    const pairs = [];
    getSortedIndices(st).forEach(idx => {
      const row = st.relation.items[idx];
      const x = row[xIdx];
      const y = row[yIdx];
      if (x !== null && y !== null) pairs.push({ x: x ? 1 : 0, y: y ? 1 : 0 });
    });
    
    if (pairs.length < 2) {
      container.innerHTML = '<p class="text-muted-foreground">Not enough data pairs.</p>';
      return;
    }
    
    renderPhiCorrelationTo(container, pairs, xIdx, yIdx, st);
  } else {
    const contingency = {};
    const xCounts = {};
    const yCounts = {};
    let total = 0;
    
    getSortedIndices(st).forEach(idx => {
      const row = st.relation.items[idx];
      const xVal = row[xIdx] !== null ? String(row[xIdx]) : null;
      const yVal = row[yIdx] !== null ? String(row[yIdx]) : null;
      if (xVal !== null && yVal !== null) {
        if (!contingency[xVal]) contingency[xVal] = {};
        if (!contingency[xVal][yVal]) contingency[xVal][yVal] = 0;
        contingency[xVal][yVal]++;
        xCounts[xVal] = (xCounts[xVal] || 0) + 1;
        yCounts[yVal] = (yCounts[yVal] || 0) + 1;
        total++;
      }
    });
    
    const xKeys = Object.keys(xCounts);
    const yKeys = Object.keys(yCounts);
    
    renderCramersVTo(container, contingency, total, xIdx, yIdx, xKeys.length, yKeys.length, xCounts, yCounts, st);
  }
}

function renderPearsonCorrelationTo(container, pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  const sumX = pairs.reduce((s, p) => s + p.x, 0);
  const sumY = pairs.reduce((s, p) => s + p.y, 0);
  const sumXY = pairs.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = pairs.reduce((s, p) => s + p.x * p.x, 0);
  const sumY2 = pairs.reduce((s, p) => s + p.y * p.y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denominator === 0 ? 0 : numerator / denominator;
  
  const xValues = pairs.map(p => p.x);
  const yValues = pairs.map(p => p.y);
  const xOutlierBounds = detectOutliers(xValues);
  const yOutlierBounds = detectOutliers(yValues);
  
  const outlierCount = pairs.filter(p => 
    p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound ||
    p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound
  ).length;
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  const slope = numerator / (n * sumX2 - sumX * sumX || 1);
  const intercept = meanY - slope * meanX;
  
  const residuals = pairs.map(p => p.y - (slope * p.x + intercept));
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const ssTot = pairs.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  
  const absR = Math.abs(r);
  let strength = 'No correlation';
  if (absR >= 0.9) strength = 'Very strong';
  else if (absR >= 0.7) strength = 'Strong';
  else if (absR >= 0.5) strength = 'Moderate';
  else if (absR >= 0.3) strength = 'Weak';
  else if (absR >= 0.1) strength = 'Very weak';
  
  const colorClass = r > 0.1 ? 'correlation-positive' : r < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Pearson Correlation (r)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + r.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (r > 0 ? 'positive' : r < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs | R² = ' + (rSquared * 100).toFixed(1) + '%</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>r (Pearson coefficient)</dt><dd>Measures linear relationship between two variables. Ranges from -1 (perfect negative) to +1 (perfect positive). 0 means no linear relationship.</dd>';
  html += '<dt>R² (Coefficient of determination)</dt><dd>Percentage of variance in Y explained by X. R²=70% means 70% of Y\'s variation can be predicted from X.</dd>';
  html += '<dt>n (Sample size)</dt><dd>Number of valid data pairs used in the calculation.</dd>';
  html += '</dl></details></div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample (n&lt;30): Consider Kendall\'s Tau</div>';
  }
  if (outlierCount > 0) {
    html += '<div class="correlation-warning">⚠️ ' + outlierCount + ' outliers detected: Consider Spearman</div>';
  }
  if (rSquared < 0.5 && absR > 0.3) {
    html += '<div class="correlation-warning">⚠️ Low R²: Consider Spearman or transform data</div>';
  }
  
  html += renderNormalityPanel(xValues, yValues, st.columnNames[xIdx], st.columnNames[yIdx]);
  
  const width = 350, height = 250, padding = 35;
  const xMin = Math.min(...xValues), xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues), yMax = Math.max(...yValues);
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="10">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="12" y="' + (height/2) + '" text-anchor="middle" font-size="10" transform="rotate(-90 12 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    const isOutlier = p.x < xOutlierBounds.lowerBound || p.x > xOutlierBounds.upperBound || p.y < yOutlierBounds.lowerBound || p.y > yOutlierBounds.upperBound;
    html += '<circle cx="' + xScale(p.x) + '" cy="' + yScale(p.y) + '" r="' + (isOutlier ? 5 : 3) + '" fill="' + (isOutlier ? '#ef4444' : '#3b82f6') + '" opacity="0.6"/>';
  });
  
  const lineY1 = slope * xMin + intercept, lineY2 = slope * xMax + intercept;
  html += '<line x1="' + xScale(xMin) + '" y1="' + yScale(lineY1) + '" x2="' + xScale(xMax) + '" y2="' + yScale(lineY2) + '" stroke="#10b981" stroke-width="2" stroke-dasharray="5,5"/>';
  html += '</svg></div>';
  
  container.innerHTML = html;
}

function renderSpearmanCorrelationTo(container, pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  
  function rank(arr) {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(arr.length);
    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (j < sorted.length && sorted[j].v === sorted[i].v) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) ranks[sorted[k].i] = avgRank;
      i = j;
    }
    return ranks;
  }
  
  const xRanks = rank(pairs.map(p => p.x));
  const yRanks = rank(pairs.map(p => p.y));
  
  const sumRx = xRanks.reduce((s, r) => s + r, 0);
  const sumRy = yRanks.reduce((s, r) => s + r, 0);
  const sumRxRy = xRanks.reduce((s, r, i) => s + r * yRanks[i], 0);
  const sumRx2 = xRanks.reduce((s, r) => s + r * r, 0);
  const sumRy2 = yRanks.reduce((s, r) => s + r * r, 0);
  
  const numerator = n * sumRxRy - sumRx * sumRy;
  const denominator = Math.sqrt((n * sumRx2 - sumRx * sumRx) * (n * sumRy2 - sumRy * sumRy));
  const rho = denominator === 0 ? 0 : numerator / denominator;
  
  const absRho = Math.abs(rho);
  let strength = 'No correlation';
  if (absRho >= 0.9) strength = 'Very strong';
  else if (absRho >= 0.7) strength = 'Strong';
  else if (absRho >= 0.5) strength = 'Moderate';
  else if (absRho >= 0.3) strength = 'Weak';
  else if (absRho >= 0.1) strength = 'Very weak';
  
  const colorClass = rho > 0.1 ? 'correlation-positive' : rho < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Spearman Correlation (ρ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + rho.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (rho > 0 ? 'positive' : rho < 0 ? 'negative' : '') + ' monotonic correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs</div>';
  html += '<div class="correlation-note">Spearman measures monotonic relationship. Robust to outliers.</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>ρ (Spearman\'s rho)</dt><dd>Measures monotonic relationship (both variables move in the same direction, not necessarily at a constant rate). Based on ranks, not actual values. Ranges from -1 to +1.</dd>';
  html += '<dt>Monotonic relationship</dt><dd>When one variable increases, the other consistently increases (or decreases). Unlike Pearson, works for curved relationships as long as they are consistently increasing or decreasing.</dd>';
  html += '<dt>Robust to outliers</dt><dd>Extreme values have less impact because the calculation uses ranks instead of actual values.</dd>';
  html += '</dl></details></div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample: Kendall\'s Tau may be more appropriate</div>';
  }
  
  const width = 350, height = 250, padding = 35;
  const xMin = Math.min(...pairs.map(p => p.x)), xMax = Math.max(...pairs.map(p => p.x));
  const yMin = Math.min(...pairs.map(p => p.y)), yMax = Math.max(...pairs.map(p => p.y));
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="10">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="12" y="' + (height/2) + '" text-anchor="middle" font-size="10" transform="rotate(-90 12 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    html += '<circle cx="' + xScale(p.x) + '" cy="' + yScale(p.y) + '" r="3" fill="#10b981" opacity="0.6"/>';
  });
  html += '</svg></div>';
  
  container.innerHTML = html;
}

function renderKendallCorrelationTo(container, pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  let concordant = 0, discordant = 0;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const product = (pairs[j].x - pairs[i].x) * (pairs[j].y - pairs[i].y);
      if (product > 0) concordant++;
      else if (product < 0) discordant++;
    }
  }
  
  const totalPairs = (n * (n - 1)) / 2;
  const tau = totalPairs > 0 ? (concordant - discordant) / totalPairs : 0;
  
  const absTau = Math.abs(tau);
  let strength = 'No correlation';
  if (absTau >= 0.9) strength = 'Very strong';
  else if (absTau >= 0.7) strength = 'Strong';
  else if (absTau >= 0.5) strength = 'Moderate';
  else if (absTau >= 0.3) strength = 'Weak';
  else if (absTau >= 0.1) strength = 'Very weak';
  
  const colorClass = tau > 0.1 ? 'correlation-positive' : tau < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Kendall\'s Tau (τ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + tau.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (tau > 0 ? 'positive' : tau < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' | Concordant: ' + concordant + ' | Discordant: ' + discordant + '</div>';
  html += '<div class="correlation-note">Kendall\'s Tau is recommended for small samples and ordinal data.</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>τ (Kendall\'s Tau)</dt><dd>Measures association based on concordant and discordant pairs. Ranges from -1 to +1. More robust than Spearman for small samples.</dd>';
  html += '<dt>Concordant pairs</dt><dd>Two observations where if one has a higher X, it also has a higher Y (or both lower). They "agree" on the direction.</dd>';
  html += '<dt>Discordant pairs</dt><dd>Two observations where one has higher X but lower Y (or vice versa). They "disagree" on the direction.</dd>';
  html += '<dt>Formula</dt><dd>τ = (Concordant - Discordant) / Total pairs. τ=1 means all pairs agree; τ=-1 means all disagree.</dd>';
  html += '</dl></details></div>';
  
  if (n >= 30) {
    html += '<div class="correlation-warning">ℹ️ Large sample: Pearson or Spearman may be more efficient</div>';
  }
  
  const width = 350, height = 250, padding = 35;
  const xMin = Math.min(...pairs.map(p => p.x)), xMax = Math.max(...pairs.map(p => p.x));
  const yMin = Math.min(...pairs.map(p => p.y)), yMax = Math.max(...pairs.map(p => p.y));
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="10">' + escapeHtml(st.columnNames[xIdx]) + '</text>';
  html += '<text x="12" y="' + (height/2) + '" text-anchor="middle" font-size="10" transform="rotate(-90 12 ' + (height/2) + ')">' + escapeHtml(st.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    html += '<circle cx="' + xScale(p.x) + '" cy="' + yScale(p.y) + '" r="3" fill="#8b5cf6" opacity="0.6"/>';
  });
  html += '</svg></div>';
  
  container.innerHTML = html;
}

function renderPointBiserialCorrelationTo(container, pairs, xIdx, yIdx, binaryIdx, numericIdx, st = state) {
  const n = pairs.length;
  const group0 = pairs.filter(p => p.binary === 0).map(p => p.numeric);
  const group1 = pairs.filter(p => p.binary === 1).map(p => p.numeric);
  
  if (group0.length === 0 || group1.length === 0) {
    container.innerHTML = '<p class="text-muted-foreground">Both groups need at least one observation</p>';
    return;
  }
  
  const n0 = group0.length, n1 = group1.length;
  const mean0 = group0.reduce((s, v) => s + v, 0) / n0;
  const mean1 = group1.reduce((s, v) => s + v, 0) / n1;
  const allValues = pairs.map(p => p.numeric);
  const meanAll = allValues.reduce((s, v) => s + v, 0) / n;
  const variance = allValues.reduce((s, v) => s + (v - meanAll) ** 2, 0) / n;
  const std = Math.sqrt(variance) || 1;
  
  const rpb = ((mean1 - mean0) / std) * Math.sqrt((n0 * n1) / (n * n));
  
  const absRpb = Math.abs(rpb);
  let strength = 'No correlation';
  if (absRpb >= 0.9) strength = 'Very strong';
  else if (absRpb >= 0.7) strength = 'Strong';
  else if (absRpb >= 0.5) strength = 'Moderate';
  else if (absRpb >= 0.3) strength = 'Weak';
  else if (absRpb >= 0.1) strength = 'Very weak';
  
  const colorClass = rpb > 0.1 ? 'correlation-positive' : rpb < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Point-Biserial (r<sub>pb</sub>)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + rpb.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' | Group 0: ' + n0 + ' (μ=' + mean0.toFixed(2) + ') | Group 1: ' + n1 + ' (μ=' + mean1.toFixed(2) + ')</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>r<sub>pb</sub> (Point-Biserial)</dt><dd>Measures correlation between a binary variable (0/1) and a continuous variable. Ranges from -1 to +1. Equivalent to Pearson for this special case.</dd>';
  html += '<dt>μ (Mean)</dt><dd>Average value of the numeric variable for each group. μ₀ is the mean for group 0, μ₁ for group 1.</dd>';
  html += '<dt>Group 0 / Group 1</dt><dd>The two categories of the binary variable. The diagram shows the distribution of numeric values for each group.</dd>';
  html += '</dl></details></div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample: Limited statistical power</div>';
  }
  if (Math.min(n0, n1) < 5) {
    html += '<div class="correlation-warning">⚠️ Unbalanced groups</div>';
  }
  
  const width = 350, height = 150, padding = 50;
  const allMin = Math.min(...allValues), allMax = Math.max(...allValues);
  const scale = (v) => padding + ((v - allMin) / (allMax - allMin || 1)) * (width - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - 20) + '" x2="' + (width - padding) + '" y2="' + (height - 20) + '" stroke="#ccc"/>';
  group0.forEach(v => { html += '<circle cx="' + scale(v) + '" cy="40" r="4" fill="#f59e0b" opacity="0.6"/>'; });
  html += '<line x1="' + scale(mean0) + '" y1="30" x2="' + scale(mean0) + '" y2="50" stroke="#f59e0b" stroke-width="3"/>';
  html += '<text x="20" y="45" font-size="10">0</text>';
  group1.forEach(v => { html += '<circle cx="' + scale(v) + '" cy="80" r="4" fill="#06b6d4" opacity="0.6"/>'; });
  html += '<line x1="' + scale(mean1) + '" y1="70" x2="' + scale(mean1) + '" y2="90" stroke="#06b6d4" stroke-width="3"/>';
  html += '<text x="20" y="85" font-size="10">1</text>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="10">' + escapeHtml(st.columnNames[numericIdx]) + '</text>';
  html += '</svg></div>';
  
  container.innerHTML = html;
}

function renderPhiCorrelationTo(container, pairs, xIdx, yIdx, st = state) {
  const n = pairs.length;
  let a = 0, b = 0, c = 0, d = 0;
  pairs.forEach(p => {
    if (p.x === 1 && p.y === 1) a++;
    else if (p.x === 1 && p.y === 0) b++;
    else if (p.x === 0 && p.y === 1) c++;
    else d++;
  });
  
  const numerator = (a * d) - (b * c);
  const denominator = Math.sqrt((a + b) * (c + d) * (a + c) * (b + d));
  const phi = denominator === 0 ? 0 : numerator / denominator;
  
  const absPhi = Math.abs(phi);
  let strength = 'No association';
  if (absPhi >= 0.5) strength = 'Strong';
  else if (absPhi >= 0.3) strength = 'Moderate';
  else if (absPhi >= 0.1) strength = 'Weak';
  
  const colorClass = phi > 0.1 ? 'correlation-positive' : phi < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Phi Coefficient (φ)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + phi.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' association</div>';
  html += '<div class="correlation-label">n = ' + n + '</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>φ (Phi coefficient)</dt><dd>Measures association between two binary (yes/no) variables. Ranges from -1 to +1. Positive means both tend to be true/false together; negative means they tend to be opposite.</dd>';
  html += '<dt>Contingency table</dt><dd>2×2 table showing the count of observations for each combination of values. Cell "a" = both true, "d" = both false, "b" and "c" = one true and one false.</dd>';
  html += '<dt>Formula</dt><dd>φ = (ad - bc) / √[(a+b)(c+d)(a+c)(b+d)]</dd>';
  html += '</dl></details></div>';
  
  if (n < 30) {
    html += '<div class="correlation-warning">⚠️ Small sample</div>';
  }
  if (Math.min(a, b, c, d) < 5) {
    html += '<div class="correlation-warning">⚠️ Some cells have &lt;5 observations</div>';
  }
  
  html += '<table class="phi-table">';
  html += '<tr><th></th><th>' + escapeHtml(st.columnNames[yIdx]) + '=1</th><th>' + escapeHtml(st.columnNames[yIdx]) + '=0</th><th>Total</th></tr>';
  html += '<tr><th>' + escapeHtml(st.columnNames[xIdx]) + '=1</th><td>' + a + '</td><td>' + b + '</td><td>' + (a+b) + '</td></tr>';
  html += '<tr><th>' + escapeHtml(st.columnNames[xIdx]) + '=0</th><td>' + c + '</td><td>' + d + '</td><td>' + (c+d) + '</td></tr>';
  html += '<tr><th>Total</th><td>' + (a+c) + '</td><td>' + (b+d) + '</td><td>' + n + '</td></tr>';
  html += '</table></div>';
  
  container.innerHTML = html;
}

function renderCramersVTo(container, contingency, total, xIdx, yIdx, xCategories, yCategories, xCounts, yCounts, st = state) {
  const xKeys = Object.keys(xCounts);
  const yKeys = Object.keys(yCounts);
  
  let chiSquared = 0;
  xKeys.forEach(xVal => {
    yKeys.forEach(yVal => {
      const observed = (contingency[xVal] && contingency[xVal][yVal]) || 0;
      const expected = (xCounts[xVal] * yCounts[yVal]) / total;
      if (expected > 0) {
        chiSquared += ((observed - expected) ** 2) / expected;
      }
    });
  });
  
  const minDim = Math.min(xCategories, yCategories) - 1;
  const v = minDim > 0 ? Math.sqrt(chiSquared / (total * minDim)) : 0;
  
  let strength = 'No association';
  if (v >= 0.5) strength = 'Strong';
  else if (v >= 0.3) strength = 'Moderate';
  else if (v >= 0.1) strength = 'Weak';
  
  const colorClass = v >= 0.3 ? 'correlation-positive' : v >= 0.1 ? 'correlation-neutral' : '';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Cramér\'s V</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + v.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' association</div>';
  html += '<div class="correlation-label">n = ' + total + ' | ' + xCategories + ' × ' + yCategories + ' categories | χ² = ' + chiSquared.toFixed(2) + '</div>';
  
  html += '<div class="stat-explanations">';
  html += '<details><summary>What do these values mean?</summary>';
  html += '<dl class="stat-definitions">';
  html += '<dt>V (Cramér\'s V)</dt><dd>Measures association between two categorical variables with any number of categories. Ranges from 0 (no association) to 1 (perfect association). Cannot be negative.</dd>';
  html += '<dt>χ² (Chi-squared)</dt><dd>Measures how much the observed frequencies differ from expected frequencies (if variables were independent). Higher χ² = stronger association.</dd>';
  html += '<dt>Categories</dt><dd>Number of unique values in each variable. A 3×4 contingency table has 3 categories in one variable and 4 in the other.</dd>';
  html += '<dt>Formula</dt><dd>V = √(χ² / (n × min(r-1, c-1))) where r and c are the number of rows/columns.</dd>';
  html += '</dl></details></div>';
  
  const width = 300, barHeight = 30;
  html += '<svg viewBox="0 0 ' + width + ' ' + (barHeight + 20) + '" style="width: 300px; height: 50px;">';
  html += '<rect x="0" y="0" width="' + width + '" height="' + barHeight + '" fill="#e5e7eb" rx="4"/>';
  html += '<rect x="0" y="0" width="' + (v * width) + '" height="' + barHeight + '" fill="#10b981" rx="4"/>';
  html += '<text x="10" y="' + (barHeight + 15) + '" font-size="11" fill="#666">0</text>';
  html += '<text x="' + (width - 10) + '" y="' + (barHeight + 15) + '" font-size="11" fill="#666" text-anchor="end">1</text>';
  html += '</svg></div>';
  
  container.innerHTML = html;
}

function runClustering(st = state) {
  if (!st.relation || !st.relation.items || st.relation.items.length === 0) {
    const diagramView = st.container ? st.container.querySelector('.view-diagram') : el('.view-diagram');
    const diagramResult = diagramView?.querySelector('.diagram-result');
    if (diagramResult) {
      diagramResult.innerHTML = '<p class="text-muted-foreground text-center py-8">Não existem dados para executar clustering.</p>';
    }
    return;
  }
  
  if (getSortedIndices(st).length === 0 && getFilteredIndices(st).length === 0) {
    setFilteredIndices(st, [...Array(st.relation.items.length).keys()]);
    setSortedIndices(st, [...getFilteredIndices(st)]);
  }
  
  const n = getSortedIndices(st).length;
  const maxPoints = 500;
  
  if (n > maxPoints) {
    if (!confirm('You have ' + n + ' rows. t-SNE with more than ' + maxPoints + ' points may be slow and freeze the browser. Continue anyway?')) {
      return;
    }
  }
  
  const diagramView = st.container ? st.container.querySelector('.view-diagram') : el('.view-diagram');
  const numClusters = parseInt(diagramView?.querySelector('.tsne-clusters')?.value) || 5;
  const perplexity = parseInt(diagramView?.querySelector('.tsne-perplexity')?.value) || 30;
  const iterations = parseInt(diagramView?.querySelector('.tsne-iterations')?.value) || 500;
  
  const cols = [];
  st.columnTypes.forEach((type, idx) => {
    if (['boolean', 'string', 'select', 'int', 'float'].includes(type)) {
      cols.push(idx);
    }
  });
  
  if (cols.length === 0) {
    alert('No suitable columns for clustering');
    return;
  }
  
  const data = getSortedIndices(st).map(i => {
    const row = st.relation.items[i];
    return cols.map(colIdx => {
      const val = row[colIdx];
      const type = st.columnTypes[colIdx];
      if (val === null) return 0;
      if (type === 'boolean') return val ? 1 : 0;
      if (type === 'int' || type === 'float') return val;
      if (type === 'string' || type === 'select') {
        let hash = 0;
        const str = String(val);
        for (let j = 0; j < str.length; j++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(j);
          hash |= 0;
        }
        return hash;
      }
      return 0;
    });
  });
  
  const nCols = cols.length;
  const nRows = data.length;
  
  for (let c = 0; c < nCols; c++) {
    let mean = 0;
    for (let r = 0; r < nRows; r++) mean += data[r][c];
    mean /= nRows;
    
    let variance = 0;
    for (let r = 0; r < nRows; r++) variance += (data[r][c] - mean) ** 2;
    variance /= nRows;
    const std = Math.sqrt(variance) || 1;
    
    for (let r = 0; r < nRows; r++) {
      data[r][c] = (data[r][c] - mean) / std;
    }
  }
  
  const progressEl = diagramView?.querySelector('.tsne-progress');
  if (progressEl) progressEl.style.display = 'block';
  
  setTimeout(() => {
    const result = tSNE(data, {
      perplexity: Math.min(perplexity, Math.floor(nRows / 3)),
      iterations: iterations,
      learningRate: 200,
      onProgress: (iter, total) => {
        if (progressEl) {
          progressEl.textContent = 't-SNE: ' + Math.round(iter / total * 100) + '%';
        }
      }
    });
    
    const canvas = diagramView?.querySelector('.diagram-canvas');
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    result.forEach(p => {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    });
    
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    const ballRadius = Math.max(4, Math.min(12, 200 / Math.sqrt(nRows)));
    
    let nodes = result.map((p, i) => ({
      idx: getSortedIndices(st)[i],
      x: padding + ((p[0] - minX) / rangeX) * (width - 2 * padding),
      y: padding + ((p[1] - minY) / rangeY) * (height - 2 * padding),
      rawData: data[i],
      radius: ballRadius
    }));
    
    // Apply k-means clustering for colors
    const effectiveClusters = Math.min(numClusters, nRows);
    const clusterColors = [
      '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
      '#ff7f00', '#ffff33', '#a65628', '#f781bf',
      '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3',
      '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3',
      '#1b9e77', '#d95f02', '#7570b3', '#e7298a'
    ];
    
    const clusterAssignments = kMeansClustering(result, effectiveClusters);
    nodes.forEach((node, i) => {
      node.cluster = clusterAssignments[i];
      node.color = clusterColors[clusterAssignments[i] % clusterColors.length];
    });
    
    // Apply collision detection to prevent overlapping
    nodes = applyCollisionDetection(nodes, width, height, padding);
    
    setDiagramNodes(st, nodes);
    st.diagramBallRadius = ballRadius;
    
    if (progressEl) progressEl.style.display = 'none';
    renderDiagram(st);
  }, 50);
}

// K-means clustering algorithm
function kMeansClustering(points, k, maxIterations = 50) {
  const n = points.length;
  if (n === 0) return [];
  
  // Initialize centroids randomly from data points
  const centroidIndices = [];
  while (centroidIndices.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (!centroidIndices.includes(idx)) {
      centroidIndices.push(idx);
    }
  }
  let centroids = centroidIndices.map(i => [...points[i]]);
  
  let assignments = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    let changed = false;
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let minCluster = 0;
      for (let c = 0; c < k; c++) {
        const dist = (points[i][0] - centroids[c][0]) ** 2 + (points[i][1] - centroids[c][1]) ** 2;
        if (dist < minDist) {
          minDist = dist;
          minCluster = c;
        }
      }
      if (assignments[i] !== minCluster) {
        assignments[i] = minCluster;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Update centroids
    const counts = new Array(k).fill(0);
    const sums = centroids.map(() => [0, 0]);
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      sums[c][0] += points[i][0];
      sums[c][1] += points[i][1];
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c][0] = sums[c][0] / counts[c];
        centroids[c][1] = sums[c][1] / counts[c];
      }
    }
  }
  
  return assignments;
}

// Collision detection with gentle force-based separation
function applyCollisionDetection(nodes, width, height, padding, iterations = 15) {
  const minDist = (nodes[0]?.radius || 8) * 2.1;
  
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          
          nodes[i].x -= ux * overlap;
          nodes[i].y -= uy * overlap;
          nodes[j].x += ux * overlap;
          nodes[j].y += uy * overlap;
          moved = true;
        }
      }
    }
    
    // Keep nodes within bounds
    for (let i = 0; i < nodes.length; i++) {
      const r = nodes[i].radius;
      nodes[i].x = Math.max(padding + r, Math.min(width - padding - r, nodes[i].x));
      nodes[i].y = Math.max(padding + r, Math.min(height - padding - r, nodes[i].y));
    }
    
    if (!moved) break;
  }
  
  return nodes;
}

function tSNE(X, options = {}) {
  const n = X.length;
  const dim = 2;
  const perplexity = options.perplexity || 30;
  const iterations = options.iterations || 500;
  const learningRate = options.learningRate || 200;
  const onProgress = options.onProgress || (() => {});
  const earlyExaggeration = 4;
  const earlyExaggerationEnd = 100;
  
  // Compute pairwise distances
  const D = [];
  for (let i = 0; i < n; i++) {
    D[i] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < X[i].length; k++) {
        sum += (X[i][k] - X[j][k]) ** 2;
      }
      D[i][j] = sum;
    }
  }
  
  // Compute P (joint probabilities in high-dimensional space)
  const P = computeJointProbabilities(D, perplexity, n);
  
  // Apply early exaggeration to P
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      P[i][j] *= earlyExaggeration;
    }
  }
  
  // Initialize Y randomly
  const Y = [];
  for (let i = 0; i < n; i++) {
    Y[i] = [Math.random() * 0.0001, Math.random() * 0.0001];
  }
  
  // Initialize momentum, gains, and previous gradients
  const gains = [];
  const Ymom = [];
  const prevGrads = [];
  for (let i = 0; i < n; i++) {
    gains[i] = [1, 1];
    Ymom[i] = [0, 0];
    prevGrads[i] = [0, 0];
  }
  
  // Optimization loop
  for (let iter = 0; iter < iterations; iter++) {
    // End early exaggeration
    if (iter === earlyExaggerationEnd) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          P[i][j] /= earlyExaggeration;
        }
      }
    }
    
    // Compute low-dimensional affinities Q
    const Qnum = [];
    let Qsum = 0;
    
    for (let i = 0; i < n; i++) {
      Qnum[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          Qnum[i][j] = 0;
        } else {
          const dist = (Y[i][0] - Y[j][0]) ** 2 + (Y[i][1] - Y[j][1]) ** 2;
          Qnum[i][j] = 1 / (1 + dist);
          Qsum += Qnum[i][j];
        }
      }
    }
    
    // Normalize Q
    const Q = [];
    for (let i = 0; i < n; i++) {
      Q[i] = [];
      for (let j = 0; j < n; j++) {
        Q[i][j] = Math.max(Qnum[i][j] / Qsum, 1e-12);
      }
    }
    
    // Compute gradients
    const grads = [];
    for (let i = 0; i < n; i++) {
      let gx = 0, gy = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const mult = (P[i][j] - Q[i][j]) * Qnum[i][j];
          gx += mult * (Y[i][0] - Y[j][0]);
          gy += mult * (Y[i][1] - Y[j][1]);
        }
      }
      grads[i] = [4 * gx, 4 * gy];
    }
    
    // Update with momentum and adaptive gains
    const momentum = iter < 250 ? 0.5 : 0.8;
    
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        // Compare current gradient sign with previous gradient sign (not momentum)
        const sameSign = Math.sign(grads[i][d]) === Math.sign(prevGrads[i][d]);
        gains[i][d] = sameSign ? gains[i][d] * 0.8 : gains[i][d] + 0.2;
        gains[i][d] = Math.max(gains[i][d], 0.01);
        
        Ymom[i][d] = momentum * Ymom[i][d] - learningRate * gains[i][d] * grads[i][d];
        Y[i][d] += Ymom[i][d];
        
        prevGrads[i][d] = grads[i][d];
      }
    }
    
    // Center Y
    let meanX = 0, meanY = 0;
    for (let i = 0; i < n; i++) {
      meanX += Y[i][0];
      meanY += Y[i][1];
    }
    meanX /= n;
    meanY /= n;
    for (let i = 0; i < n; i++) {
      Y[i][0] -= meanX;
      Y[i][1] -= meanY;
    }
    
    if (iter % 50 === 0) {
      onProgress(iter, iterations);
    }
  }
  
  onProgress(iterations, iterations);
  return Y;
}

function computeJointProbabilities(D, perplexity, n) {
  const P = [];
  const targetEntropy = Math.log(perplexity);
  
  for (let i = 0; i < n; i++) {
    P[i] = [];
    
    // Binary search for sigma
    let sigma = 1;
    let sigmaMin = -Infinity;
    let sigmaMax = Infinity;
    
    for (let attempt = 0; attempt < 50; attempt++) {
      // Compute conditional probabilities
      let sumP = 0;
      const pRow = [];
      
      for (let j = 0; j < n; j++) {
        if (i === j) {
          pRow[j] = 0;
        } else {
          pRow[j] = Math.exp(-D[i][j] / (2 * sigma * sigma));
          sumP += pRow[j];
        }
      }
      
      // Normalize and compute entropy
      let entropy = 0;
      for (let j = 0; j < n; j++) {
        pRow[j] = sumP > 0 ? pRow[j] / sumP : 0;
        if (pRow[j] > 1e-12) {
          entropy -= pRow[j] * Math.log(pRow[j]);
        }
      }
      
      // Check if entropy is close enough
      const diff = entropy - targetEntropy;
      if (Math.abs(diff) < 1e-5) {
        P[i] = pRow;
        break;
      }
      
      // Binary search update
      if (diff > 0) {
        sigmaMax = sigma;
        sigma = sigmaMin === -Infinity ? sigma / 2 : (sigma + sigmaMin) / 2;
      } else {
        sigmaMin = sigma;
        sigma = sigmaMax === Infinity ? sigma * 2 : (sigma + sigmaMax) / 2;
      }
      
      if (attempt === 49) {
        P[i] = pRow;
      }
    }
  }
  
  // Symmetrize
  const Psym = [];
  for (let i = 0; i < n; i++) {
    Psym[i] = [];
    for (let j = 0; j < n; j++) {
      Psym[i][j] = Math.max((P[i][j] + P[j][i]) / (2 * n), 1e-12);
    }
  }
  
  return Psym;
}

function renderDiagram(st = state) {
  const container = st.container;
  const canvas = container 
    ? container.querySelector('.diagram-canvas')
    : el('.diagram-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw nodes
  getDiagramNodes(st).forEach(node => {
    const radius = node.radius || 8;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  // Draw cluster legend
  const clusters = [...new Set(getDiagramNodes(st).map(n => n.cluster))].sort((a, b) => a - b);
  const clusterColors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
    '#ff7f00', '#ffff33', '#a65628', '#f781bf'
  ];
  
  let legendX = 10;
  ctx.font = '11px sans-serif';
  clusters.forEach((cluster, i) => {
    const color = clusterColors[cluster % clusterColors.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(legendX + 6, canvas.height - 20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    const label = 'C' + (cluster + 1);
    ctx.fillText(label, legendX + 15, canvas.height - 16);
    legendX += 40;
  });
  
  // Add info text
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  ctx.fillText('Rows: ' + getDiagramNodes(st).length + ' | Click a point to see data', 10, canvas.height - 40);
}

function setupDiagramClickHandler(st = state) {
  const diagramView = st.container ? st.container.querySelector('.view-diagram') : el('.view-diagram');
  const canvas = diagramView?.querySelector('.diagram-canvas');
  if (!canvas) return;
  
  if (canvas._diagramClickHandler) {
    canvas.removeEventListener('click', canvas._diagramClickHandler);
  }
  
  const handler = (event) => handleDiagramClick(event, st);
  canvas._diagramClickHandler = handler;
  canvas.addEventListener('click', handler);
}

function handleDiagramClick(event, st = state) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  let clickedNode = null;
  for (let i = getDiagramNodes(st).length - 1; i >= 0; i--) {
    const node = getDiagramNodes(st)[i];
    const dx = x - node.x;
    const dy = y - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= (node.radius || 8)) {
      clickedNode = node;
      break;
    }
  }
  
  if (clickedNode) {
    showDiagramPopup(clickedNode, event.clientX, event.clientY, st);
  } else {
    hideDiagramPopup();
  }
}

function showDiagramPopup(node, clientX, clientY, st = state) {
  hideDiagramPopup();
  
  const rowIdx = node.idx;
  const rowData = st.relation.items[rowIdx];
  
  const popup = document.createElement('div');
  popup.className = 'diagram-popup diagram-popup-instance';
  
  const header = document.createElement('div');
  header.className = 'diagram-popup-header';
  header.textContent = 'Row ' + (rowIdx + 1) + ' ';
  
  const badge = document.createElement('span');
  badge.className = 'cluster-badge';
  badge.style.background = node.color;
  badge.textContent = 'Cluster ' + (node.cluster + 1);
  header.appendChild(badge);
  
  popup.appendChild(header);
  
  const content = document.createElement('div');
  content.className = 'diagram-popup-content';
  
  st.columnNames.forEach((col, i) => {
    const value = rowData[i];
    const type = st.columnTypes[i];
    
    const field = document.createElement('div');
    field.className = 'popup-field';
    
    const label = document.createElement('span');
    label.className = 'popup-label';
    label.textContent = col + ': ';
    field.appendChild(label);
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'popup-value';
    
    if (value === null || value === undefined) {
      valueSpan.className += ' null-value';
      valueSpan.textContent = 'null';
    } else if (type === 'relation') {
      valueSpan.textContent = '[Relation: ' + (value.items?.length || 0) + ' rows]';
    } else if (typeof value === 'object') {
      valueSpan.textContent = JSON.stringify(value);
    } else if (type === 'multilinestring') {
      const str = String(value);
      valueSpan.textContent = str.substring(0, 100) + (str.length > 100 ? '...' : '');
    } else {
      const str = String(value);
      valueSpan.textContent = str.substring(0, 50) + (str.length > 50 ? '...' : '');
    }
    
    field.appendChild(valueSpan);
    content.appendChild(field);
  });
  
  popup.appendChild(content);
  
  // Position popup
  document.body.appendChild(popup);
  
  const popupRect = popup.getBoundingClientRect();
  let left = clientX + 10;
  let top = clientY + 10;
  
  // Keep within viewport
  if (left + popupRect.width > window.innerWidth) {
    left = clientX - popupRect.width - 10;
  }
  if (top + popupRect.height > window.innerHeight) {
    top = clientY - popupRect.height - 10;
  }
  
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeDiagramPopupOnOutsideClick);
  }, 10);
}

function hideDiagramPopup() {
  const existing = document.querySelector('.diagram-popup-instance');
  if (existing) existing.remove();
  document.removeEventListener('click', closeDiagramPopupOnOutsideClick);
}

function closeDiagramPopupOnOutsideClick(event) {
  const popup = document.querySelector('.diagram-popup-instance');
  if (popup && !popup.contains(event.target)) {
    hideDiagramPopup();
  }
}

// Initialize a relation instance in a container with given data
function initRelationInstance(container, relationData, options = {}) {
  const { showJsonEditor = false, isNested = false } = options;
  
  // Initialize uiState on relation data if not present
  initializeUiState(relationData);
  
  // Create a new state for this instance
  const instanceState = createRelationState();
  instanceState.container = container;
  instanceState.relation = relationData;
  instanceState.columnNames = Object.keys(relationData.columns || {});
  instanceState.columnTypes = Object.values(relationData.columns || {});
  instanceState.options = relationData.options || {};
  
  const parsedRelOptions = relationData.rel_options || {};
  instanceState.rel_options = {
    editable: parsedRelOptions.editable ?? DEFAULT_REL_OPTIONS.editable,
    show_multicheck: parsedRelOptions.show_multicheck ?? DEFAULT_REL_OPTIONS.show_multicheck,
    show_natural_order: parsedRelOptions.show_natural_order ?? DEFAULT_REL_OPTIONS.show_natural_order,
    show_id: parsedRelOptions.show_id ?? DEFAULT_REL_OPTIONS.show_id,
    show_hierarchy: parsedRelOptions.show_hierarchy ?? DEFAULT_REL_OPTIONS.show_hierarchy,
    hierarchy_column: parsedRelOptions.hierarchy_column ?? DEFAULT_REL_OPTIONS.hierarchy_column,
    single_item_mode: parsedRelOptions.single_item_mode ?? DEFAULT_REL_OPTIONS.single_item_mode,
    general_view_options: parsedRelOptions.general_view_options ?? [...DEFAULT_REL_OPTIONS.general_view_options],
    // Deserialize uiState from JSON (convert arrays to Sets)
    uiState: deserializeUiState(parsedRelOptions.uiState || { ...DEFAULT_UI_STATE })
  };
  
  // Initialize filteredIndices and sortedIndices
  const itemCount = (relationData.items || []).length;
  setFilteredIndices(instanceState, [...Array(itemCount).keys()]);
  setSortedIndices(instanceState, [...getFilteredIndices(instanceState)]);
  
  // Store instance in both legacy map and new registry
  relationInstances.set(instanceState.uid, instanceState);
  registerRelation(instanceState);
  
  // Add class to container
  container.classList.add('relation_' + instanceState.uid);
  container.classList.add('relation-instance');
  
  // Generate HTML structure
  const viewOptions = instanceState.rel_options.general_view_options;
  
  // Determine flex wrapper class based on single_item_mode
  const singleItemMode = instanceState.rel_options.single_item_mode || 'dialog';
  const flexWrapperClass = singleItemMode === 'right' ? 'flex-wrapper-horizontal' : 'flex-wrapper-vertical';
  
  let mainPanelHtml = '';
  
  if (showJsonEditor) {
    mainPanelHtml += `
      <div class="json-section">
        <textarea class="relation-json" rows="6" readonly>${JSON.stringify(relationData, null, 2)}</textarea>
      </div>
    `;
  }
  
  const hasTableView = viewOptions.some(v => v.toLowerCase() === 'table');
  const initialView = viewOptions[0]?.toLowerCase() || 'table';
  const badgeDisplay = initialView === 'table' ? '' : 'display: none;';
  
  mainPanelHtml += `
    <div class="view-tabs" style="margin-bottom: 1rem;">
      <div class="view-tabs-left">
        ${viewOptions.map((view, idx) => {
          const viewKey = view.toLowerCase();
          const icon = VIEW_TAB_ICONS[viewKey] || '';
          return `<button class="view-tab${idx === 0 ? ' active' : ''}" data-view="${viewKey}" data-testid="tab-${viewKey}">${icon} ${view}</button>`;
        }).join('')}
      </div>
      ${hasTableView ? `<div class="view-tabs-right"><span class="keyboard-help-badge" title="Keyboard Shortcuts" data-testid="button-help-keyboard" style="${badgeDisplay}">ℹ</span></div>` : ''}
    </div>
    
    <div class="view-table view-content">
      <div class="relation-table-container resizable">
        <p class="text-muted-foreground text-center py-8">Loading...</p>
        <div class="resize-handle" data-testid="resize-handle"></div>
      </div>
    </div>
    
    <div class="view-cards view-content" style="display: none;">
      <div class="cards-view-wrapper">
        <div class="cards-content"></div>
        <div class="cards-navigation"></div>
      </div>
    </div>
    
    <div class="view-pivot view-content" style="display: none;">
      <div class="pivot-config">
        <div class="pivot-config-row">
          <label>Rows:</label>
          <select class="pivot-rows pivot-select"></select>
        </div>
        <div class="pivot-config-row">
          <label>Columns:</label>
          <select class="pivot-cols pivot-select"></select>
        </div>
        <div class="pivot-config-row">
          <label>Values:</label>
          <div class="pivot-values-config"></div>
          <button class="btn-add-pivot-value btn btn-outline btn-sm">+ Add</button>
        </div>
        <button class="btn-generate-pivot btn btn-primary btn-sm">Generate Pivot</button>
      </div>
      <div class="pivot-table-container"></div>
    </div>
    
    <div class="view-correlation view-content" style="display: none;">
      <div class="correlation-config">
        <div class="correlation-section">
          <div class="correlation-section-header">Analyze Single Pair</div>
          <div class="correlation-config-row">
            <label>Column X:</label>
            <select class="corr-col-x pivot-select"></select>
          </div>
          <div class="correlation-config-row">
            <label>Column Y:</label>
            <select class="corr-col-y pivot-select"></select>
          </div>
          <div class="correlation-config-row">
            <label>Method:</label>
            <select class="corr-method pivot-select">
              <option value="auto">Auto-detect</option>
              <option value="pearson">Pearson (linear, normal)</option>
              <option value="spearman">Spearman (monotonic, robust)</option>
              <option value="kendall">Kendall's Tau (ordinal, small n)</option>
              <option value="pointbiserial">Point-Biserial (binary × numeric)</option>
              <option value="phi">Phi (binary × binary)</option>
              <option value="cramers">Cramér's V (categorical)</option>
            </select>
          </div>
          <div class="correlation-actions">
            <button class="btn-calculate-corr btn btn-primary btn-sm">Calculate</button>
            <button class="btn-corr-help btn btn-outline btn-sm">?</button>
          </div>
        </div>
        <div class="correlation-section">
          <div class="correlation-section-header">Analyze All Pairs</div>
          <div class="correlation-section-desc">Calculate correlations between all column combinations</div>
          <button class="btn-corr-all btn btn-primary btn-sm">Analyze All Pairs</button>
        </div>
      </div>
      <div class="correlation-help" style="display: none;">
        <p><strong>Choosing a correlation method:</strong></p>
        <ul>
          <li><strong>Pearson (r)</strong> - Linear relationship. Assumes normality. Best for continuous data. Range: -1 to +1.</li>
          <li><strong>Spearman (ρ)</strong> - Monotonic relationship. No normality assumption. Robust to outliers. Range: -1 to +1.</li>
          <li><strong>Kendall's Tau (τ)</strong> - Rank correlation. Better for small samples (n&lt;30) or ordinal data. More robust than Spearman. Range: -1 to +1.</li>
          <li><strong>Point-Biserial (r<sub>pb</sub>)</strong> - When one variable is binary (0/1) and other is numeric. Range: -1 to +1.</li>
          <li><strong>Phi (φ)</strong> - Association between two binary variables. Special case of Pearson for 2×2 tables. Range: -1 to +1.</li>
          <li><strong>Cramér's V</strong> - Categorical association. Based on chi-squared. Range: 0 to 1 (no direction).</li>
        </ul>
        <p><strong>Auto-detect logic:</strong></p>
        <ul>
          <li>Both binary → Phi</li>
          <li>One binary + one numeric → Point-Biserial</li>
          <li>Both numeric, n&lt;30 → Kendall's Tau</li>
          <li>Both numeric, n≥30 → Pearson</li>
          <li>Either categorical → Cramér's V</li>
        </ul>
      </div>
      <div class="correlation-result"></div>
    </div>
    
    <div class="view-diagram view-content" style="display: none;">
      <div class="diagram-info">
        <p class="diagram-description">This diagram uses <strong>t-SNE</strong> (t-Distributed Stochastic Neighbor Embedding) to visualize data similarity. Similar rows cluster together, while dissimilar rows are placed further apart. Each circle represents a row, colored by cluster assignment. <strong>Recommended clusters:</strong> Use 3-10 clusters for most datasets. A common rule is sqrt(n/2) where n is the number of rows. Too few clusters may oversimplify patterns; too many may create noise.</p>
      </div>
      <div class="diagram-config">
        <div class="diagram-config-row">
          <label>Clusters:</label>
          <input type="number" class="tsne-clusters pivot-select" value="5" min="2" max="20" style="width: 80px;">
          <span class="diagram-field-help">Number of color groups. Range: 2-20. Recommended: sqrt(n/2) where n is the number of rows.</span>
        </div>
        <div class="diagram-config-row">
          <label>Perplexity:</label>
          <input type="number" class="tsne-perplexity pivot-select" value="30" min="5" max="100" style="width: 80px;">
          <span class="diagram-field-help">Balance between local and global structure. Range: 5-100. Typical: 5-50. Lower values focus on local clusters, higher values preserve global structure.</span>
        </div>
        <div class="diagram-config-row">
          <label>Iterations:</label>
          <input type="number" class="tsne-iterations pivot-select" value="500" min="100" max="2000" step="100" style="width: 100px;">
          <span class="diagram-field-help">Number of optimization steps. Range: 100-2000. More iterations produce more stable results but take longer.</span>
        </div>
        <button class="btn-run-clustering btn btn-primary btn-sm">Run t-SNE</button>
        <span class="tsne-progress" style="display: none;">Calculating...</span>
      </div>
      <div class="diagram-container">
        <canvas class="diagram-canvas" width="800" height="600"></canvas>
      </div>
    </div>
    
    <div class="view-ai view-content" style="display: none;">
      <div class="ai-panel-inline">
        <div class="ai-voice-row">
          <select class="voice-language pivot-select" title="Voice recognition language">
            <option value="pt-PT" selected>Português (PT)</option>
            <option value="pt-BR">Português (BR)</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Español (ES)</option>
            <option value="es-MX">Español (MX)</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="it-IT">Italiano</option>
            <option value="ja-JP">日本語</option>
            <option value="zh-CN">中文 (简体)</option>
            <option value="zh-TW">中文 (繁體)</option>
            <option value="ru-RU">Русский</option>
            <option value="ko-KR">한국어</option>
            <option value="ar-SA">العربية</option>
            <option value="hi-IN">हिन्दी</option>
          </select>
          <button class="btn-ai-voice btn btn-outline btn-sm" title="Voice input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
        </div>
        <div class="ai-input-row">
          <input type="text" class="ai-question ai-question-input" placeholder="Ask a question about your data...">
          <button class="btn-ai-ask btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
        <div class="ai-response"></div>
      </div>
    </div>
    
    <div class="view-saved view-content" style="display: none;">
      <div class="saved-panel">
        <p class="text-muted-foreground text-center py-8">Saved views will appear here</p>
      </div>
    </div>
  `;
  
  // Wrap in flex structure with main panel and detail panel
  const html = `
    <div class="relation-flex-wrapper ${flexWrapperClass}">
      <div class="relation-main-panel">
        ${mainPanelHtml}
      </div>
      <div class="relation-detail-panel"></div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Set up MutationObserver on detail panel to auto-toggle .has-detail class
  const detailPanel = container.querySelector('.relation-detail-panel');
  if (detailPanel) {
    const observer = new MutationObserver(() => {
      updateDetailPanelState(instanceState);
    });
    observer.observe(detailPanel, { childList: true, subtree: true, characterData: true });
  }
  
  // Initialize event listeners
  initInstanceEventListeners(instanceState);
  
  // Render initial view
  setCurrentView(instanceState, viewOptions[0]?.toLowerCase() || 'table');
  switchViewForInstance(instanceState, getCurrentView(instanceState));
  
  return instanceState;
}

// Initialize event listeners for a relation instance
function initInstanceEventListeners(st) {
  const container = st.container;
  
  // View tab clicks
  container.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      switchViewForInstance(st, tab.dataset.view);
      
      // Show/hide keyboard help badge based on view
      const helpBadge = container.querySelector('.keyboard-help-badge');
      if (helpBadge) {
        helpBadge.style.display = tab.dataset.view === 'table' ? '' : 'none';
      }
    });
  });
  
  // Keyboard help badge hover events
  const badge = container.querySelector('.keyboard-help-badge');
  if (badge) {
    badge.addEventListener('mouseenter', showKeyboardHelpTooltip);
    badge.addEventListener('mouseleave', hideKeyboardHelpTooltip);
  }
}

// Switch view for a specific instance
function switchViewForInstance(st, view) {
  setCurrentView(st, view);
  const container = st.container;
  
  // Hide all view wrappers (using .view-content class pattern)
  container.querySelectorAll('.view-content').forEach(w => w.style.display = 'none');
  
  // Show the selected view
  const viewWrapper = container.querySelector(`.view-${view}`);
  if (viewWrapper) {
    viewWrapper.style.display = 'block';
  }
  
  // Render the view - use parametrized functions
  if (view === 'table') {
    renderTable(st);
  } else if (view === 'cards') {
    renderCards(st);
  } else if (view === 'pivot') {
    renderPivot(st);
  } else if (view === 'correlation') {
    renderCorrelation(st);
  } else if (view === 'diagram') {
    initDiagramView(st);
  } else if (view === 'ai') {
    renderAI(st);
  } else if (view === 'saved') {
    renderSaved(st);
  } else {
    // Other views show placeholder for now
    if (viewWrapper) {
      const inner = viewWrapper.querySelector('p');
      if (inner) inner.textContent = `Vista "${view}" - funcionalidade completa em desenvolvimento.`;
    }
  }
}

// Wrapper functions for parametrized view rendering - all views use same code path
function renderCards(st = state) {
  renderCardsView(st);
}

function renderPivot(st = state) {
  initPivotConfig(st);
}

function renderCorrelation(st = state) {
  initCorrelationConfig(st);
}

function renderAI(st = state) {
  initAIView(st);
}

function renderSaved(st = state) {
  initSavedView(st);
}

function initDiagramView(st = state) {
  renderDiagram(st);
  setupDiagramClickHandler(st);
  
  const diagramView = st.container ? st.container.querySelector('.view-diagram') : el('.view-diagram');
  if (!diagramView) return;
  
  const clusterBtn = diagramView.querySelector('.btn-run-clustering');
  if (clusterBtn) {
    const newBtn = clusterBtn.cloneNode(true);
    clusterBtn.parentNode.replaceChild(newBtn, clusterBtn);
    newBtn.addEventListener('click', () => runClustering(st));
  }
}

function initAIView(st = state) {
  const aiView = st.container ? st.container.querySelector('.view-ai') : el('.view-ai');
  if (!aiView) return;
  
  const input = aiView.querySelector('.ai-question');
  const submitBtn = aiView.querySelector('.btn-ai-ask');
  const voiceBtn = aiView.querySelector('.btn-ai-voice');
  const languageSelect = aiView.querySelector('.voice-language');
  
  if (input && submitBtn) {
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    
    newSubmitBtn.addEventListener('click', () => {
      const question = newInput.value.trim();
      if (question) {
        askAI(question, st);
      }
    });
    
    newInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const question = newInput.value.trim();
        if (question) {
          askAI(question, st);
        }
      }
    });
    
    if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const newVoiceBtn = voiceBtn.cloneNode(true);
      voiceBtn.parentNode.replaceChild(newVoiceBtn, voiceBtn);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const currentInput = aiView.querySelector('.ai-question');
        if (currentInput) currentInput.value = transcript;
        newVoiceBtn.classList.remove('recording');
      };
      
      recognition.onerror = () => {
        newVoiceBtn.classList.remove('recording');
      };
      
      recognition.onend = () => {
        newVoiceBtn.classList.remove('recording');
      };
      
      newVoiceBtn.addEventListener('click', () => {
        if (newVoiceBtn.classList.contains('recording')) {
          recognition.stop();
          newVoiceBtn.classList.remove('recording');
        } else {
          const lang = languageSelect ? languageSelect.value : 'pt-PT';
          recognition.lang = lang;
          recognition.start();
          newVoiceBtn.classList.add('recording');
        }
      });
    }
  }
}

function initSavedView(st = state) {
  const container = st.container ? st.container.querySelector('.saved-views-list') : el('.saved-views-list');
  if (!container) return;
  
  // Saved view placeholder - will show saved view configs when implemented
  container.innerHTML = '<p class="text-muted-foreground">No saved views yet. Save a view configuration to access it here.</p>';
}

async function askAIWithState(question, st = state) {
  if (!st.relation) return;
  
  const responseContainer = st.container ? st.container.querySelector('.ai-response') : el('.ai-response');
  if (!responseContainer) return;
  
  responseContainer.innerHTML = '<p class="text-muted-foreground">Analyzing...</p>';
  
  try {
    const context = {
      columns: st.columnNames.map((name, i) => ({ name, type: st.columnTypes[i] })),
      rowCount: st.relation.items.length,
      sampleData: st.relation.items.slice(0, 5)
    };
    
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    });
    
    if (!response.ok) throw new Error('AI request failed');
    
    const result = await response.json();
    responseContainer.innerHTML = '<div class="ai-result">' + escapeHtml(result.answer || result.response || 'No response') + '</div>';
  } catch (error) {
    responseContainer.innerHTML = '<p class="text-error">Error: ' + escapeHtml(error.message) + '</p>';
  }
}

// renderTableWithState removed - using parametrized renderTable(st) directly

function getSortIndicatorWithState(st, colIdx) {
  const criteria = getSortCriteria(st);
  const sortInfo = criteria.find(c => c.column === colIdx);
  if (!sortInfo) return '';
  
  const position = criteria.findIndex(c => c.column === colIdx) + 1;
  const arrow = sortInfo.direction === 'asc' ? '▲' : '▼';
  return criteria.length > 1 ? ` <span class="sort-indicator">${arrow}<sub>${position}</sub></span>` : ` <span class="sort-indicator">${arrow}</span>`;
}

function updateHeaderCheckboxWithState(st, container) {
  const headerCheckbox = container.querySelector('.select-all-checkbox');
  if (!headerCheckbox) return;
  
  const pageIndices = getCurrentPageIndices(st);
  const selectedOnPage = pageIndices.filter(idx => getSelectedRows(st).has(idx)).length;
  
  if (selectedOnPage === 0) {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = false;
  } else if (selectedOnPage === pageIndices.length) {
    headerCheckbox.checked = true;
    headerCheckbox.indeterminate = false;
  } else {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = true;
  }
}

function renderPaginationWithState(st, paginationDiv) {
  const totalItems = getSortedIndices(st).length;
  const pageSize = getPageSize(st);
  const effectivePageSize = pageSize === 'all' ? totalItems : pageSize;
  
  // Handle empty results: show 0 of 0 with disabled controls
  const hasResults = totalItems > 0;
  const totalPages = hasResults ? Math.max(1, Math.ceil(totalItems / effectivePageSize)) : 0;
  const currentPage = hasResults ? getCurrentPage(st) : 0;
  
  const selectedCount = getSelectedRows(st).size;
  const showMulticheck = st.rel_options.show_multicheck;
  
  paginationDiv.innerHTML = `
    <span class="pagination-info">${totalItems} rows</span>
    <span class="pagination-selected${showMulticheck ? '' : ' hidden'}">${selectedCount} selected</span>
    <select class="page-size-select" ${!hasResults ? 'disabled' : ''}>
      <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
      <option value="20" ${pageSize === 20 ? 'selected' : ''}>20</option>
      <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
      <option value="100" ${pageSize === 100 ? 'selected' : ''}>100</option>
      <option value="all" ${pageSize === 'all' ? 'selected' : ''}>All</option>
    </select>
    <button class="btn btn-sm page-btn" data-action="first" ${!hasResults || currentPage === 1 ? 'disabled' : ''}>«</button>
    <button class="btn btn-sm page-btn" data-action="prev" ${!hasResults || currentPage === 1 ? 'disabled' : ''}>‹</button>
    <span class="page-info">Página ${currentPage} de ${totalPages}</span>
    <button class="btn btn-sm page-btn" data-action="next" ${!hasResults || currentPage >= totalPages ? 'disabled' : ''}>›</button>
    <button class="btn btn-sm page-btn" data-action="last" ${!hasResults || currentPage >= totalPages ? 'disabled' : ''}>»</button>
  `;
}

function createInputForTypeWithState(st, type, value, rowIdx, colIdx, editable) {
  const colName = st.columnNames[colIdx];
  const options = st.options;
  
  // Reuse the existing createInputForType logic but with st context
  return createInputForType(type, value, rowIdx, colIdx, editable);
}

function applyConditionalFormattingWithState(st, value, colIdx, td, rowIdx) {
  const formatting = getFormatting(st);
  if (!formatting[colIdx]) return;
  
  const rules = formatting[colIdx];
  for (const rule of rules) {
    if (evaluateCondition(value, rule.operator, rule.value)) {
      td.style.backgroundColor = rule.bgColor || '';
      td.style.color = rule.textColor || '';
      break;
    }
  }
}

function attachTableEventListenersWithState(st, container) {
  const totalItems = getSortedIndices(st).length;
  const pageSize = getPageSize(st);
  const effectivePageSize = pageSize === 'all' ? totalItems : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  
  // Header click for sorting
  container.querySelectorAll('.relation-th-sortable').forEach(th => {
    th.addEventListener('click', (e) => {
      const colIdx = parseInt(th.dataset.col);
      if (e.ctrlKey || e.metaKey) {
        if (getSelectedColumns(st).has(colIdx)) {
          getSelectedColumns(st).delete(colIdx);
        } else {
          getSelectedColumns(st).add(colIdx);
        }
        renderTable(st);
      } else {
        handleSortWithState(st, colIdx, e.shiftKey);
      }
    });
    
    th.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const colIdx = parseInt(th.dataset.col);
      showColumnMenuForInstance(st, colIdx, e.clientX, e.clientY);
    });
  });
  
  // Select all checkbox
  container.querySelector('.select-all-checkbox')?.addEventListener('click', () => {
    toggleSelectAllWithState(st, container);
  });
  
  // Row selection
  container.querySelectorAll('.row-select-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const rowIdx = parseInt(e.target.dataset.rowIdx);
      if (e.target.checked) {
        getSelectedRows(st).add(rowIdx);
      } else {
        getSelectedRows(st).delete(rowIdx);
      }
      updateHeaderCheckboxWithState(st, container);
      renderPaginationWithState(st, container.querySelector('.relation-pagination'));
      e.target.closest('tr').classList.toggle('row-selected', e.target.checked);
    });
  });
  
  // Statistics buttons
  container.querySelectorAll('.btn-stats').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const colIdx = parseInt(e.target.dataset.col);
      showStatisticsPanelForInstance(st, colIdx);
    });
  });
  
  // Page size change
  container.querySelector('.page-size-select')?.addEventListener('change', (e) => {
    const newSize = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    setPageSize(st, newSize);
    setCurrentPage(st, 1);
    renderTable(st);
  });
  
  // Pagination buttons
  container.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'first') setCurrentPage(st, 1);
      else if (action === 'prev') setCurrentPage(st, Math.max(1, getCurrentPage(st) - 1));
      else if (action === 'next') setCurrentPage(st, Math.min(totalPages, getCurrentPage(st) + 1));
      else if (action === 'last') setCurrentPage(st, totalPages);
      renderTable(st);
    });
  });
  
  // Cell editing
  container.addEventListener('change', (e) => {
    if (e.target.matches('.relation-input, .relation-textarea, .relation-select')) {
      updateRelationFromInputWithState(st, e.target);
    }
  });
  
  // Row operations button
  container.querySelectorAll('.btn-row-ops').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rowIdx = parseInt(btn.dataset.row);
      showRowMenuForInstance(st, rowIdx, e.clientX, e.clientY);
    });
  });
  
  // Relation cell buttons (for nested relations)
  container.querySelectorAll('.relation-cell-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rowIdx = parseInt(btn.dataset.row);
      const colIdx = parseInt(btn.dataset.col);
      showNestedRelationDialog(rowIdx, colIdx, st);
    });
  });
}

function handleSortWithState(st, colIdx, addToExisting) {
  const criteria = getSortCriteria(st);
  const existingIdx = criteria.findIndex(c => c.column === colIdx);
  
  if (existingIdx >= 0) {
    const existing = criteria[existingIdx];
    if (existing.direction === 'asc') {
      existing.direction = 'desc';
    } else {
      criteria.splice(existingIdx, 1);
    }
  } else {
    if (!addToExisting) {
      setSortCriteria(st, []);
    }
    getSortCriteria(st).push({ column: colIdx, direction: 'asc' });
  }
  
  renderTable(st);
}

function toggleSelectAllWithState(st, container) {
  const pageIndices = getCurrentPageIndices(st);
  const allSelected = pageIndices.every(idx => getSelectedRows(st).has(idx));
  
  if (allSelected) {
    pageIndices.forEach(idx => getSelectedRows(st).delete(idx));
  } else {
    pageIndices.forEach(idx => getSelectedRows(st).add(idx));
  }
  
  renderTable(st);
}

function updateRelationFromInputWithState(st, input) {
  const rowIdx = parseInt(input.dataset.row);
  const colIdx = parseInt(input.dataset.col);
  const type = st.columnTypes[colIdx];
  
  let value;
  if (type === 'boolean') {
    if (input.indeterminate) value = null;
    else value = input.checked;
  } else if (type === 'int') {
    value = input.value === '' ? null : parseInt(input.value);
  } else if (type === 'float') {
    value = input.value === '' ? null : parseFloat(input.value);
  } else {
    value = input.value === '' ? null : input.value;
  }
  
  st.relation.items[rowIdx][colIdx] = value;
}

function showColumnMenuForInstance(st, colIdx, x, y) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'column-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const type = st.columnTypes[colIdx];
  const name = st.columnNames[colIdx];
  
  menu.innerHTML = `
    <div class="column-menu-header">${name} (${type})</div>
    <div class="column-menu-item" data-action="sort-asc">Sort Ascending</div>
    <div class="column-menu-item" data-action="sort-desc">Sort Descending</div>
    <div class="column-menu-separator"></div>
    <div class="column-menu-item" data-action="filter">Filter...</div>
    <div class="column-menu-item" data-action="clear-filter" ${!getFilters(st)[colIdx] ? 'style="display:none"' : ''}>Clear Filter</div>
  `;
  
  document.body.appendChild(menu);
  adjustMenuPosition(menu);
  
  menu.querySelectorAll('.column-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action === 'sort-asc') {
        setSortCriteria(st, [{ column: colIdx, direction: 'asc' }]);
        renderTable(st);
      } else if (action === 'sort-desc') {
        setSortCriteria(st, [{ column: colIdx, direction: 'desc' }]);
        renderTable(st);
      } else if (action === 'clear-filter') {
        delete getFilters(st)[colIdx];
        setCurrentPage(st, 1);
        renderTable(st);
      }
      menu.remove();
    });
  });
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 10);
}

function showRowMenuForInstance(st, rowIdx, x, y) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'row-ops-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const hasSelection = getSelectedRows(st).size > 0;
  
  menu.innerHTML = `
    <div class="column-menu-header">Row ${rowIdx + 1}</div>
    <button class="column-menu-item" data-action="view-row" data-testid="button-row-view">👁 View</button>
    <button class="column-menu-item" data-action="edit-row" data-testid="button-row-edit">✏️ Edit</button>
    <button class="column-menu-item" data-action="copy-row" data-testid="button-row-copy">📋 Copy</button>
    <button class="column-menu-item" data-action="new-row" data-testid="button-row-new">➕ New</button>
    <button class="column-menu-item" data-action="new-fast-row" data-testid="button-row-new-fast">⚡ New Fast</button>
    <button class="column-menu-item" data-action="delete-row" data-testid="button-row-delete">🗑️ Delete</button>
    <button class="column-menu-item" data-action="paper-form-row" data-testid="button-row-paper-form">📄 Paper Form</button>
    ${hasSelection ? `
      <div class="column-menu-section">
        <div class="column-menu-title">Selection (${getSelectedRows(st).size} rows)</div>
        <button class="column-menu-item" data-action="delete-selected">🗑️ Delete Selected</button>
      </div>
    ` : ''}
  `;
  
  document.body.appendChild(menu);
  adjustMenuPosition(menu);
  
  menu.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    
    handleRowOperation(st, rowIdx, action);
    menu.remove();
  });
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 10);
}

function formatValueForDisplay(value, type) {
  if (value === null || value === undefined) return '<span class="null-value">null</span>';
  if (type === 'boolean') return value ? '✓ true' : '✗ false';
  if (type === 'relation') return `📋 ${value?.items?.length || 0} rows`;
  return escapeHtml(String(value));
}

function createEditInputHtml(type, value, colIdx, st) {
  if (type === 'boolean') {
    return `<input type="checkbox" data-col="${colIdx}" ${value ? 'checked' : ''}>`;
  } else if (type === 'int' || type === 'float') {
    return `<input type="number" class="relation-input" data-col="${colIdx}" value="${value !== null ? value : ''}" ${type === 'float' ? 'step="any"' : ''}>`;
  } else if (type === 'select' && st.options[st.columnNames[colIdx]]) {
    const options = st.options[st.columnNames[colIdx]];
    let html = `<select class="relation-select" data-col="${colIdx}">`;
    html += '<option value="">Select...</option>';
    Object.entries(options).forEach(([k, v]) => {
      html += `<option value="${escapeHtml(k)}" ${value === k ? 'selected' : ''}>${escapeHtml(v)}</option>`;
    });
    html += '</select>';
    return html;
  } else if (type === 'multilinestring') {
    return `<textarea class="relation-textarea" data-col="${colIdx}" rows="3">${value !== null ? escapeHtml(value) : ''}</textarea>`;
  } else if (type === 'relation') {
    return `<span class="view-value">📋 ${value?.items?.length || 0} rows (not editable here)</span>`;
  } else {
    return `<input type="text" class="relation-input" data-col="${colIdx}" value="${value !== null ? escapeHtml(value) : ''}">`;
  }
}

function showStatisticsPanelForInstance(st, colIdx) {
  // Use the global statistics panel function but with instance data
  const type = st.columnTypes[colIdx];
  const name = st.columnNames[colIdx];
  const values = getFilteredIndices(st).map(idx => st.relation.items[idx][colIdx]).filter(v => v !== null && v !== undefined);
  
  // Create a simple stats popup
  const popup = document.createElement('div');
  popup.className = 'stats-popup';
  popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; z-index: 1000; min-width: 200px;';
  
  let statsHtml = `<h4 style="margin-bottom: 0.5rem;">${name} Statistics</h4>`;
  statsHtml += `<p>Count: ${values.length}</p>`;
  
  if (['int', 'float'].includes(type) && values.length > 0) {
    const numValues = values.map(Number).filter(n => !isNaN(n));
    if (numValues.length > 0) {
      const sum = numValues.reduce((a, b) => a + b, 0);
      const mean = sum / numValues.length;
      const min = Math.min(...numValues);
      const max = Math.max(...numValues);
      statsHtml += `<p>Min: ${min.toFixed(2)}</p>`;
      statsHtml += `<p>Max: ${max.toFixed(2)}</p>`;
      statsHtml += `<p>Mean: ${mean.toFixed(2)}</p>`;
    }
  }
  
  statsHtml += `<button class="btn btn-sm" onclick="this.parentElement.remove()">Close</button>`;
  popup.innerHTML = statsHtml;
  
  document.body.appendChild(popup);
}

// Duplicate functions removed - using parametrized versions

function init() {
  // Add unique class to relation container
  const relationContainer = document.querySelector('.relation');
  if (relationContainer) {
    relationContainer.classList.add('relation_' + state.uid);
  }
  
  const textarea = el('.relation-json');
  const btnGenerate = el('.btn-generate-demo');
  const btnParse = el('.btn-parse-relation');
  const btnAiAsk = el('.btn-ai-ask');
  const aiQuestion = el('.ai-question');
  
  btnGenerate?.addEventListener('click', () => {
    const demo = generateDemoRelation();
    textarea.value = JSON.stringify(demo, null, 2);
  });
  
  const btnLoadProducts = el('.btn-load-products');
  btnLoadProducts?.addEventListener('click', () => {
    textarea.value = JSON.stringify(PRODUCTS_JSON, null, 2);
  });
  
  const btnLoadCategories = el('.btn-load-categories');
  btnLoadCategories?.addEventListener('click', () => {
    textarea.value = JSON.stringify(CATEGORIES_JSON, null, 2);
  });
  
  const btnLoadStocks = el('.btn-load-stocks');
  btnLoadStocks?.addEventListener('click', () => {
    textarea.value = JSON.stringify(STOCKS_JSON, null, 2);
  });
  
  const btnLoadPriceLists = el('.btn-load-pricelists');
  btnLoadPriceLists?.addEventListener('click', () => {
    textarea.value = JSON.stringify(PRICELISTS_JSON, null, 2);
  });
  
  const btnSimpleObj = el('.btn-simple-obj');
  btnSimpleObj?.addEventListener('click', () => {
    textarea.value = '{a:"string",b:True,c:15,d:15.5}';
  });
  
  const btnArrayObj = el('.btn-array-obj');
  btnArrayObj?.addEventListener('click', () => {
    textarea.value = '{a:"string",b:True,c:15,d:15.5,e:[1,2,3,4,5]}';
  });
  
  const btnObjectObj = el('.btn-object-obj');
  btnObjectObj?.addEventListener('click', () => {
    textarea.value = '{a:"string",b:True,c:15,d:15.5,e:{aa:"string",bb:True,cc:15,dd:15.5}}';
  });
  
  const btnAttributeObj = el('.btn-attribute-obj');
  btnAttributeObj?.addEventListener('click', () => {
    textarea.value = '{}';
  });
  
  const btnRelObj = el('.btn-rel-obj');
  btnRelObj?.addEventListener('click', () => {
    textarea.value = '{}';
  });
  
  const btnObjToRel = el('.btn-obj-to-rel');
  btnObjToRel?.addEventListener('click', () => {
    alert('Obj->Rel: functionality to be implemented');
  });
  
  // Menu item event listeners - close dropdown on click
  document.querySelectorAll('.nav-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const dropdown = item.closest('.nav-item');
      if (dropdown) {
        dropdown.classList.add('menu-closed');
        setTimeout(() => dropdown.classList.remove('menu-closed'), 100);
      }
    });
  });
  
  const menuUsers = document.querySelector('[data-testid="menu-users"]');
  menuUsers?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(USERS_JSON, null, 2);
  });
  
  const menuAuditLog = document.querySelector('[data-testid="menu-audit-log"]');
  menuAuditLog?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(AUDITLOG_JSON, null, 2);
  });
  
  const menuAllCompanies = document.querySelector('[data-testid="menu-all-companies"]');
  menuAllCompanies?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(ALL_COMPANIES_JSON, null, 2);
  });
  
  const menuCompanyTypes = document.querySelector('[data-testid="menu-company-types"]');
  menuCompanyTypes?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(COMPANY_TYPES_JSON, null, 2);
  });
  
  const menuAllProducts = document.querySelector('[data-testid="menu-all-products"]');
  menuAllProducts?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(ALL_PRODUCTS_JSON, null, 2);
  });
  
  const menuProductCategory = document.querySelector('[data-testid="menu-product-category"]');
  menuProductCategory?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRODUCT_CATEGORY_JSON, null, 2);
  });
  
  const menuProductFamilies = document.querySelector('[data-testid="menu-product-families"]');
  menuProductFamilies?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRODUCT_FAMILIES_JSON, null, 2);
  });
  
  const menuProductSpecies = document.querySelector('[data-testid="menu-product-species"]');
  menuProductSpecies?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRODUCT_SPECIES_JSON, null, 2);
  });
  
  const menuProductBrands = document.querySelector('[data-testid="menu-product-brands"]');
  menuProductBrands?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRODUCT_BRANDS_JSON, null, 2);
  });
  
  const menuProductCatalog = document.querySelector('[data-testid="menu-product-catalog"]');
  menuProductCatalog?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRODUCT_CATALOG_JSON, null, 2);
  });
  
  const menuCatalogProductConversions = document.querySelector('[data-testid="menu-product-catalog-conversions"]');
  menuCatalogProductConversions?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(CATALOG_PRODUCT_CONVERSIONS_JSON, null, 2);
  });
  
  const menuAllPricelists = document.querySelector('[data-testid="menu-all-pricelists"]');
  menuAllPricelists?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(ALL_PRICELISTS_JSON, null, 2);
  });
  
  const menuPricelistProducts = document.querySelector('[data-testid="menu-pricelist-products"]');
  menuPricelistProducts?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRICELIST_PRODUCTS_JSON, null, 2);
  });
  
  const menuPricelistPartner = document.querySelector('[data-testid="menu-pricelist-partner"]');
  menuPricelistPartner?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(PRICELIST_PARTNER_JSON, null, 2);
  });
  
  const menuInventory = document.querySelector('[data-testid="menu-inventory"]');
  menuInventory?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_INVENTORY_JSON, null, 2);
  });
  
  const menuInventoryDetail = document.querySelector('[data-testid="menu-inventory-detail"]');
  menuInventoryDetail?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_INVENTORY_DETAIL_JSON, null, 2);
  });
  
  const menuHistoricInventory = document.querySelector('[data-testid="menu-historic-inventory"]');
  menuHistoricInventory?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_HISTORIC_INVENTORY_JSON, null, 2);
  });
  
  const menuHistoricInventoryDetail = document.querySelector('[data-testid="menu-historic-inventory-detail"]');
  menuHistoricInventoryDetail?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_HISTORIC_INVENTORY_DETAIL_JSON, null, 2);
  });
  
  const menuWarehouses = document.querySelector('[data-testid="menu-wharehouses"]');
  menuWarehouses?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_WAREHOUSE_JSON, null, 2);
  });
  
  const menuImports = document.querySelector('[data-testid="menu-imports"]');
  menuImports?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_IMPORT_JSON, null, 2);
  });
  
  const menuImportsDetails = document.querySelector('[data-testid="menu-imports-details"]');
  menuImportsDetails?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_IMPORTS_DETAILS_JSON, null, 2);
  });
  
  const menuImportsTypes = document.querySelector('[data-testid="menu-imports-types"]');
  menuImportsTypes?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_IMPORTS_TYPES_JSON, null, 2);
  });
  
  const menuImportsStates = document.querySelector('[data-testid="menu-imports-states"]');
  menuImportsStates?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_IMPORTS_STATES_JSON, null, 2);
  });
  
  const menuImportsDetailStates = document.querySelector('[data-testid="menu-imports-detail-states"]');
  menuImportsDetailStates?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(STOCK_IMPORTS_STATES_DETAILS_JSON, null, 2);
  });
  
  const menuDataManagement = document.querySelector('[data-testid="menu-data-management"]');
  menuDataManagement?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(ADMIN_DATA_MANAGEMENT_JSON, null, 2);
  });
  
  const menuDistributor = document.querySelector('[data-testid="menu-distributor"]');
  menuDistributor?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(DISTRIBUTOR_JSON, null, 2);
  });
  
  const menuAllStocks = document.querySelector('[data-testid="menu-all-stocks"]');
  menuAllStocks?.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = JSON.stringify(ALL_STOCKS_JSON, null, 2);
  });
  
  btnParse?.addEventListener('click', () => {
    const result = parseRelation(textarea.value);
    
    if (result.success) {
      // Create main relation instance using unified code
      createMainRelationInstance(result.data);
      
      // Create a second relation instance at the bottom of the page
      createSecondRelationInstance(result.data);
    } else {
      alert('Parse error: ' + result.error);
    }
  });
  
  // Create or update the main relation instance
  function createMainRelationInstance(relationData) {
    const mainContainer = document.querySelector('.relation-main-instance');
    if (!mainContainer) return;
    
    // Clear existing content and unregister old instance
    const oldUid = mainContainer.dataset.relationUid;
    if (oldUid) {
      relationInstances.delete(oldUid);
      unregisterRelation(oldUid);
    }
    mainContainer.innerHTML = '';
    
    // Deep clone the relation data to avoid shared state
    const clonedData = JSON.parse(JSON.stringify(relationData));
    
    // Initialize the main instance using the same code as all other instances
    const mainState = initRelationInstance(mainContainer, clonedData, { showJsonEditor: false, isNested: false });
    
    // Store uid for cleanup
    mainContainer.dataset.relationUid = mainState.uid;
    
    // Update the global state reference to point to the main instance
    // This maintains backward compatibility with any code still using global state
    Object.assign(state, mainState);
  }
  
  // Create a second relation instance at the bottom of the body
  function createSecondRelationInstance(relationData) {
    // Remove existing second instance if present
    const existingSecond = document.querySelector('.relation-second-instance');
    if (existingSecond) {
      // Unregister the old instance
      const oldUid = existingSecond.dataset.relationUid;
      if (oldUid) {
        relationInstances.delete(oldUid);
        unregisterRelation(oldUid);
      }
      existingSecond.remove();
    }
    
    // Create new container at bottom of body
    const secondContainer = document.createElement('div');
    secondContainer.className = 'relation relation-second-instance';
    secondContainer.style.cssText = 'width: 100%; margin-top: 2rem; padding: 1rem; background: var(--card); border-radius: var(--radius);';
    document.body.appendChild(secondContainer);
    
    // Deep clone the relation data to avoid shared state
    const clonedData = JSON.parse(JSON.stringify(relationData));
    
    // Initialize the second instance
    const secondState = initRelationInstance(secondContainer, clonedData, { showJsonEditor: false, isNested: false });
    
    // Store uid for cleanup
    secondContainer.dataset.relationUid = secondState.uid;
  }
  
  
  // Pivot table events
  el('.btn-add-pivot-value')?.addEventListener('click', () => {
    if (getPivotConfig(state).values.length < 4) {
      getPivotConfig(state).values.push({ column: null, aggregation: 'count' });
      renderPivotValuesConfig();
    }
  });
  
  el('.btn-generate-pivot')?.addEventListener('click', () => generatePivotTable());
  
  // Correlation events
  el('.btn-calculate-corr')?.addEventListener('click', () => calculateCorrelation());
  el('.btn-corr-help')?.addEventListener('click', () => {
    const helpDiv = el('.correlation-help');
    if (helpDiv) {
      helpDiv.style.display = helpDiv.style.display === 'none' ? 'block' : 'none';
    }
  });
  el('.btn-corr-all')?.addEventListener('click', () => analyzeAllPairs());
  
  // Diagram events
  el('.btn-run-clustering')?.addEventListener('click', () => runClustering());
  
  // AI events
  btnAiAsk?.addEventListener('click', () => {
    const question = aiQuestion?.value.trim();
    if (question) {
      askAI(question);
    }
  });
  
  aiQuestion?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const question = aiQuestion.value.trim();
      if (question) {
        askAI(question);
      }
    }
  });
  
  // Resize handle functionality
  setupResizeHandle();
  
  // Voice input button
  const btnVoice = el('.btn-ai-voice');
  let recognition = null;
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      aiQuestion.value = transcript;
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      }
    };
    
    recognition.onend = () => {
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
    };
    
    btnVoice?.addEventListener('click', () => {
      if (btnVoice.classList.contains('recording')) {
        recognition.stop();
      } else {
        const langSelect = el('.voice-language');
        recognition.lang = langSelect?.value || 'en-US';
        btnVoice.classList.add('recording');
        btnVoice.querySelector('svg').style.color = '#ef4444';
        recognition.start();
      }
    });
  } else {
    // Browser doesn't support speech recognition
    btnVoice?.addEventListener('click', () => {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
    });
  }
}

function setupResizeHandle() {
  const container = el('.relation-table-container');
  const handle = container?.querySelector('.resize-handle');
  const wrapper = container?.querySelector('.relation-table-wrapper');
  
  if (!handle || !container) return;
  
  let isResizing = false;
  let startPageY = 0;  // Use page coordinates (includes scroll)
  let startHeight = 0;
  let scrollInterval = null;
  
  // Get the main content area for adding padding
  const mainContent = document.querySelector('.main-content') || document.body;
  
  const startResize = (pageY) => {
    isResizing = true;
    startPageY = pageY;
    startHeight = wrapper ? wrapper.offsetHeight : container.offsetHeight;
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
  };
  
  const updateSize = (pageY) => {
    if (!isResizing) return;
    
    // Use page coordinates to account for scroll
    const deltaY = pageY - startPageY;
    const newHeight = Math.max(200, startHeight + deltaY);
    
    if (wrapper) {
      wrapper.style.maxHeight = newHeight + 'px';
    }
    container.style.minHeight = (newHeight + 50) + 'px';
    
    // Add large padding to allow page to grow
    mainContent.style.paddingBottom = (newHeight + 500) + 'px';
  };
  
  const startAutoScroll = () => {
    if (scrollInterval) return;
    scrollInterval = setInterval(() => {
      window.scrollBy({ top: 5, behavior: 'instant' });
    }, 30);
  };
  
  const stopAutoScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  };
  
  const handleMove = (clientY, pageY) => {
    if (!isResizing) return;
    
    updateSize(pageY);
    
    // Auto-scroll when near bottom of viewport
    const viewportHeight = window.innerHeight;
    if (clientY > viewportHeight - 80) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  };
  
  const endResize = () => {
    if (isResizing) {
      // Save the manual resize height
      if (wrapper) {
        const currentHeight = parseInt(wrapper.style.maxHeight);
        if (currentHeight) {
          setManualResizeHeight(state, currentHeight);
        }
      }
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      mainContent.style.paddingBottom = '';
      stopAutoScroll();
    }
  };
  
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startResize(e.pageY);
  });
  
  document.addEventListener('mousemove', (e) => {
    handleMove(e.clientY, e.pageY);
  });
  
  document.addEventListener('mouseup', endResize);
  
  handle.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startResize(touch.pageY);
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!isResizing) return;
    const touch = e.touches[0];
    handleMove(touch.clientY, touch.pageY);
  }, { passive: true });
  
  document.addEventListener('touchend', endResize);
}

document.addEventListener('DOMContentLoaded', init);
