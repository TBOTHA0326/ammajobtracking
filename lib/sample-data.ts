export type Branch = {
  id: string;
  name: string;
};

export type Dismantler = {
  id: string;
  name: string;
  branchId: string;
};

export type HarvestedPart = {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  condition: 'Good' | 'Fair' | 'Refurb Required' | 'Scrap';
  acquisitionCost: number;
  listPrice: number;
  status: 'In Stock' | 'Reserved' | 'Sold' | 'Scrapped';
  buyerId?: string;
};

export type JobHistoryEntry = {
  id: string;
  status: string;
  enteredAt: string;
  exitedAt?: string;
};

export type StripJob = {
  id: string;
  number: string;
  donorVehicle: {
    rego: string;
    make: string;
    model: string;
    year: number;
    variant: string;
    engine: string;
    odometer: number;
    vin?: string;
    condition: 'accident-damaged' | 'written-off' | '2nd-hand' | 'flood-damaged';
    acquisitionSource: string;
    acquisitionCost: number;
  };
  branchId: string;
  dismantlerId: string;
  status: string;
  category: 'Full Strip' | 'Partial Strip' | 'Parts Only' | 'Write-off Assessment';
  acquiredDate: string;
  estimatedCompletionDate: string;
  description: string;
  isArchived?: boolean;
  harvestedParts: HarvestedPart[];
  history: JobHistoryEntry[];
};

export type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  type: 'Trade' | 'Retail' | 'Dealer';
};

export type StatusDefinition = {
  id: string;
  label: string;
  color: string;
  showOnDashboard: boolean;
  isTerminal: boolean;
};

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

export const branches: Branch[] = [
  { id: 'east', name: 'East Rand' },
  { id: 'north', name: 'Northgate' },
  { id: 'south', name: 'South Rand' },
];

export const dismantlers: Dismantler[] = [
  { id: 'd1', name: 'Luke Mbatha', branchId: 'east' },
  { id: 'd2', name: 'Naomi Reed', branchId: 'north' },
  { id: 'd3', name: 'Mpho Dube', branchId: 'south' },
  { id: 'd4', name: 'Tariq Abbas', branchId: 'east' },
  { id: 'd5', name: 'Leah van Wyk', branchId: 'north' },
];

export const buyers: Buyer[] = [
  { id: 'b1', name: 'Amelia van der Merwe', email: 'amelia@spares.co.za', phone: '+27 82 555 0101', branchId: 'east', type: 'Retail' },
  { id: 'b2', name: 'Sizwe Nkosi Auto', email: 'sizwe.nkosi@snautospares.co.za', phone: '+27 82 555 0192', branchId: 'north', type: 'Trade' },
  { id: 'b3', name: 'Jaco Botha', email: 'jaco.botha@example.com', phone: '+27 82 555 0123', branchId: 'south', type: 'Retail' },
  { id: 'b4', name: 'Naledi Motors', email: 'naledi@naledimotors.co.za', phone: '+27 82 555 0144', branchId: 'east', type: 'Dealer' },
  { id: 'b5', name: 'Ryan Pretorius', email: 'ryan.pretorius@example.com', phone: '+27 82 555 0155', branchId: 'north', type: 'Retail' },
  { id: 'b6', name: 'Khumalo Trade Parts', email: 'parts@khumalo.co.za', phone: '+27 82 555 0166', branchId: 'south', type: 'Trade' },
  { id: 'b7', name: 'Theo Erasmus', email: 'theo.erasmus@example.com', phone: '+27 82 555 0177', branchId: 'east', type: 'Retail' },
  { id: 'b8', name: 'SA Fleet Spares', email: 'orders@safleetspares.co.za', phone: '+27 11 555 0200', branchId: 'north', type: 'Dealer' },
];

export const statuses: StatusDefinition[] = [
  { id: 'assessment',          label: 'Assessment',          color: 'slate',   showOnDashboard: true,  isTerminal: false },
  { id: 'awaiting-collection', label: 'Awaiting Collection', color: 'sky',     showOnDashboard: true,  isTerminal: false },
  { id: 'vehicle-received',    label: 'Vehicle Received',    color: 'sky',     showOnDashboard: true,  isTerminal: false },
  { id: 'stripping',           label: 'Stripping',           color: 'blue',    showOnDashboard: true,  isTerminal: false },
  { id: 'parts-catalogued',    label: 'Parts Catalogued',    color: 'indigo',  showOnDashboard: true,  isTerminal: false },
  { id: 'quality-check',       label: 'Quality Check',       color: 'emerald', showOnDashboard: true,  isTerminal: false },
  { id: 'parts-listed',        label: 'Parts Listed',        color: 'emerald', showOnDashboard: true,  isTerminal: false },
  { id: 'completed',           label: 'Completed',           color: 'slate',   showOnDashboard: false, isTerminal: true  },
  { id: 'cancelled',           label: 'Cancelled',           color: 'rose',    showOnDashboard: false, isTerminal: true  },
  { id: 'written-off-scrap',   label: 'Scrapped',            color: 'rose',    showOnDashboard: false, isTerminal: true  },
];

// ---------------------------------------------------------------------------
// Sample strip jobs
// ---------------------------------------------------------------------------

export const sampleJobs: StripJob[] = [
  // SJ-0101 — VW Polo accident write-off, currently stripping
  {
    id: 'job-1',
    number: 'SJ-0101',
    donorVehicle: {
      rego: 'GP 512 RZ',
      make: 'VW',
      model: 'Polo',
      year: 2019,
      variant: '1.0 TSI Comfortline',
      engine: '1.0 TSI',
      odometer: 87400,
      vin: 'WVWZZZ6RZKU123456',
      condition: 'accident-damaged',
      acquisitionSource: 'Insurance auction — MIB',
      acquisitionCost: 28000,
    },
    branchId: 'east',
    dismantlerId: 'd1',
    status: 'stripping',
    category: 'Full Strip',
    acquiredDate: '2026-04-08',
    estimatedCompletionDate: '2026-04-24',
    description: 'Front-end collision write-off. Engine and gearbox undamaged. Full strip for mechanical and body parts.',
    harvestedParts: [
      { id: 'hp-1', partNumber: 'VWP-ENG-010TSI-19', description: '1.0 TSI Engine Assembly', quantity: 1, condition: 'Good', acquisitionCost: 9000, listPrice: 22000, status: 'Reserved', buyerId: 'b2' },
      { id: 'hp-2', partNumber: 'VWP-GBX-6SPD-19', description: '6-Speed Manual Gearbox', quantity: 1, condition: 'Good', acquisitionCost: 4000, listPrice: 9500, status: 'In Stock' },
      { id: 'hp-3', partNumber: 'VWP-DOOR-RL-19', description: 'Rear Left Door — Silver', quantity: 1, condition: 'Good', acquisitionCost: 1200, listPrice: 3200, status: 'In Stock' },
      { id: 'hp-4', partNumber: 'VWP-DOOR-RR-19', description: 'Rear Right Door — Silver', quantity: 1, condition: 'Fair', acquisitionCost: 1200, listPrice: 2400, status: 'In Stock' },
      { id: 'hp-5', partNumber: 'VWP-RAD-19', description: 'Radiator', quantity: 1, condition: 'Scrap', acquisitionCost: 500, listPrice: 0, status: 'Scrapped' },
    ],
    history: [
      { id: 'h1', status: 'assessment', enteredAt: '2026-04-07T09:00:00Z', exitedAt: '2026-04-07T11:30:00Z' },
      { id: 'h2', status: 'awaiting-collection', enteredAt: '2026-04-07T11:30:00Z', exitedAt: '2026-04-08T14:00:00Z' },
      { id: 'h3', status: 'vehicle-received', enteredAt: '2026-04-08T14:00:00Z', exitedAt: '2026-04-10T08:00:00Z' },
      { id: 'h4', status: 'stripping', enteredAt: '2026-04-10T08:00:00Z' },
    ],
  },

  // SJ-0102 — Toyota Hilux 2nd-hand, parts catalogued
  {
    id: 'job-2',
    number: 'SJ-0102',
    donorVehicle: {
      rego: 'KZN 341 GP',
      make: 'Toyota',
      model: 'Hilux',
      year: 2017,
      variant: '2.8 GD-6 Raider 4x4',
      engine: '2.8 GD-6',
      odometer: 214800,
      condition: '2nd-hand',
      acquisitionSource: 'Private seller',
      acquisitionCost: 55000,
    },
    branchId: 'north',
    dismantlerId: 'd2',
    status: 'parts-catalogued',
    category: 'Full Strip',
    acquiredDate: '2026-04-05',
    estimatedCompletionDate: '2026-04-22',
    description: 'High-mileage Hilux acquired for full strip. Engine worn but chassis, body, and suspension in good condition.',
    harvestedParts: [
      { id: 'hp-6', partNumber: 'TOY-SUSP-FL-17', description: 'Front Left Suspension Assembly', quantity: 1, condition: 'Good', acquisitionCost: 3000, listPrice: 7500, status: 'In Stock' },
      { id: 'hp-7', partNumber: 'TOY-SUSP-FR-17', description: 'Front Right Suspension Assembly', quantity: 1, condition: 'Good', acquisitionCost: 3000, listPrice: 7500, status: 'Reserved', buyerId: 'b4' },
      { id: 'hp-8', partNumber: 'TOY-DIFF-REAR-17', description: 'Rear Differential', quantity: 1, condition: 'Good', acquisitionCost: 5000, listPrice: 14000, status: 'In Stock' },
      { id: 'hp-9', partNumber: 'TOY-CANOPY-17', description: 'Fibreglass Canopy — White', quantity: 1, condition: 'Fair', acquisitionCost: 2000, listPrice: 5500, status: 'In Stock' },
      { id: 'hp-10', partNumber: 'TOY-ENG-28GD6-17', description: '2.8 GD-6 Engine — High Mileage', quantity: 1, condition: 'Refurb Required', acquisitionCost: 8000, listPrice: 12000, status: 'In Stock' },
    ],
    history: [
      { id: 'h5', status: 'assessment', enteredAt: '2026-04-04T10:00:00Z', exitedAt: '2026-04-04T12:00:00Z' },
      { id: 'h6', status: 'awaiting-collection', enteredAt: '2026-04-04T12:00:00Z', exitedAt: '2026-04-05T09:00:00Z' },
      { id: 'h7', status: 'vehicle-received', enteredAt: '2026-04-05T09:00:00Z', exitedAt: '2026-04-07T08:00:00Z' },
      { id: 'h8', status: 'stripping', enteredAt: '2026-04-07T08:00:00Z', exitedAt: '2026-04-14T16:00:00Z' },
      { id: 'h9', status: 'parts-catalogued', enteredAt: '2026-04-14T16:00:00Z' },
    ],
  },

  // SJ-0103 — Ford Ranger flood damage, quality check
  {
    id: 'job-3',
    number: 'SJ-0103',
    donorVehicle: {
      rego: 'WC 207 LT',
      make: 'Ford',
      model: 'Ranger',
      year: 2020,
      variant: '2.0 Bi-Turbo Wildtrak 4x4',
      engine: '2.0 Bi-Turbo',
      odometer: 63200,
      vin: 'WF0DXXGBGDKM98765',
      condition: 'flood-damaged',
      acquisitionSource: 'Insurance auction — Hollard',
      acquisitionCost: 38000,
    },
    branchId: 'south',
    dismantlerId: 'd3',
    status: 'quality-check',
    category: 'Partial Strip',
    acquiredDate: '2026-04-02',
    estimatedCompletionDate: '2026-04-21',
    description: 'Flood-damaged Ranger. Engine seized, but cab, body panels, and electrics assessed as salvageable.',
    harvestedParts: [
      { id: 'hp-11', partNumber: 'FRD-HOOD-20', description: 'Bonnet — Conquer Orange', quantity: 1, condition: 'Good', acquisitionCost: 2500, listPrice: 6800, status: 'In Stock' },
      { id: 'hp-12', partNumber: 'FRD-BUMPER-F-20', description: 'Front Bumper Assembly', quantity: 1, condition: 'Good', acquisitionCost: 3000, listPrice: 7200, status: 'Sold', buyerId: 'b6' },
      { id: 'hp-13', partNumber: 'FRD-SEAT-F-20', description: 'Front Seat Pair — Leather', quantity: 1, condition: 'Good', acquisitionCost: 4000, listPrice: 9500, status: 'Reserved', buyerId: 'b1' },
      { id: 'hp-14', partNumber: 'FRD-ROLLBAR-20', description: 'Sports Roll Bar', quantity: 1, condition: 'Good', acquisitionCost: 1500, listPrice: 3800, status: 'In Stock' },
      { id: 'hp-15', partNumber: 'FRD-ENG-20BIT', description: '2.0 Bi-Turbo Engine — Seized', quantity: 1, condition: 'Scrap', acquisitionCost: 5000, listPrice: 0, status: 'Scrapped' },
    ],
    history: [
      { id: 'h10', status: 'assessment', enteredAt: '2026-04-01T09:30:00Z', exitedAt: '2026-04-01T13:00:00Z' },
      { id: 'h11', status: 'awaiting-collection', enteredAt: '2026-04-01T13:00:00Z', exitedAt: '2026-04-02T10:00:00Z' },
      { id: 'h12', status: 'vehicle-received', enteredAt: '2026-04-02T10:00:00Z', exitedAt: '2026-04-04T08:00:00Z' },
      { id: 'h13', status: 'stripping', enteredAt: '2026-04-04T08:00:00Z', exitedAt: '2026-04-10T15:00:00Z' },
      { id: 'h14', status: 'parts-catalogued', enteredAt: '2026-04-10T15:00:00Z', exitedAt: '2026-04-15T09:00:00Z' },
      { id: 'h15', status: 'quality-check', enteredAt: '2026-04-15T09:00:00Z' },
    ],
  },

  // SJ-0104 — BMW 3 Series written-off, parts listed
  {
    id: 'job-4',
    number: 'SJ-0104',
    donorVehicle: {
      rego: 'GP 889 MK',
      make: 'BMW',
      model: '3 Series',
      year: 2018,
      variant: '320d M Sport',
      engine: '2.0 TwinPower Diesel',
      odometer: 128500,
      vin: 'WBA8C9C53JA123789',
      condition: 'written-off',
      acquisitionSource: 'Insurance auction — Santam',
      acquisitionCost: 62000,
    },
    branchId: 'east',
    dismantlerId: 'd4',
    status: 'parts-listed',
    category: 'Full Strip',
    acquiredDate: '2026-03-20',
    estimatedCompletionDate: '2026-04-18',
    description: 'Rear-end write-off. Premium interior, engine and drivetrain intact. High-value strip job.',
    harvestedParts: [
      { id: 'hp-16', partNumber: 'BMW-ENG-20D-18', description: '2.0 TwinPower Diesel Engine', quantity: 1, condition: 'Good', acquisitionCost: 18000, listPrice: 42000, status: 'Reserved', buyerId: 'b8' },
      { id: 'hp-17', partNumber: 'BMW-ZF8-GBX-18', description: 'ZF 8-Speed Auto Gearbox', quantity: 1, condition: 'Good', acquisitionCost: 8000, listPrice: 19500, status: 'In Stock' },
      { id: 'hp-18', partNumber: 'BMW-DASH-18', description: 'Complete Dashboard Assembly', quantity: 1, condition: 'Good', acquisitionCost: 5000, listPrice: 12000, status: 'Sold', buyerId: 'b4' },
      { id: 'hp-19', partNumber: 'BMW-SEAT-F-18', description: 'M Sport Front Seat Pair', quantity: 1, condition: 'Good', acquisitionCost: 4000, listPrice: 9800, status: 'In Stock' },
      { id: 'hp-20', partNumber: 'BMW-WHEEL-18', description: '18" M Sport Alloy Wheels x4', quantity: 4, condition: 'Good', acquisitionCost: 3000, listPrice: 2200, status: 'Sold', buyerId: 'b7' },
      { id: 'hp-21', partNumber: 'BMW-DIFF-REAR-18', description: 'Rear Differential', quantity: 1, condition: 'Good', acquisitionCost: 4000, listPrice: 9500, status: 'In Stock' },
    ],
    history: [
      { id: 'h16', status: 'assessment', enteredAt: '2026-03-18T09:00:00Z', exitedAt: '2026-03-18T11:00:00Z' },
      { id: 'h17', status: 'awaiting-collection', enteredAt: '2026-03-18T11:00:00Z', exitedAt: '2026-03-20T10:00:00Z' },
      { id: 'h18', status: 'vehicle-received', enteredAt: '2026-03-20T10:00:00Z', exitedAt: '2026-03-22T08:00:00Z' },
      { id: 'h19', status: 'stripping', enteredAt: '2026-03-22T08:00:00Z', exitedAt: '2026-04-01T16:00:00Z' },
      { id: 'h20', status: 'parts-catalogued', enteredAt: '2026-04-01T16:00:00Z', exitedAt: '2026-04-05T10:00:00Z' },
      { id: 'h21', status: 'quality-check', enteredAt: '2026-04-05T10:00:00Z', exitedAt: '2026-04-08T09:00:00Z' },
      { id: 'h22', status: 'parts-listed', enteredAt: '2026-04-08T09:00:00Z' },
    ],
  },

  // SJ-0105 — Hyundai Tucson 2nd-hand, vehicle received
  {
    id: 'job-5',
    number: 'SJ-0105',
    donorVehicle: {
      rego: 'NW 103 ZP',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2016,
      variant: '2.0 Elite AWD',
      engine: '2.0 MPI',
      odometer: 189300,
      condition: '2nd-hand',
      acquisitionSource: 'Private seller',
      acquisitionCost: 32000,
    },
    branchId: 'north',
    dismantlerId: 'd5',
    status: 'vehicle-received',
    category: 'Full Strip',
    acquiredDate: '2026-04-17',
    estimatedCompletionDate: '2026-05-02',
    description: 'High-mileage Tucson, body and interior in reasonable condition. Strip for body panels, interior, and running gear.',
    harvestedParts: [],
    history: [
      { id: 'h23', status: 'assessment', enteredAt: '2026-04-15T10:00:00Z', exitedAt: '2026-04-15T12:30:00Z' },
      { id: 'h24', status: 'awaiting-collection', enteredAt: '2026-04-15T12:30:00Z', exitedAt: '2026-04-17T08:45:00Z' },
      { id: 'h25', status: 'vehicle-received', enteredAt: '2026-04-17T08:45:00Z' },
    ],
  },

  // SJ-0106 — Nissan NP200 accident damaged, assessment only
  {
    id: 'job-6',
    number: 'SJ-0106',
    donorVehicle: {
      rego: 'FS 774 QT',
      make: 'Nissan',
      model: 'NP200',
      year: 2021,
      variant: '1.6i SE',
      engine: '1.6i',
      odometer: 44200,
      condition: 'accident-damaged',
      acquisitionSource: 'Insurance auction — Discovery Insure',
      acquisitionCost: 18000,
    },
    branchId: 'south',
    dismantlerId: 'd3',
    status: 'assessment',
    category: 'Write-off Assessment',
    acquiredDate: '2026-04-19',
    estimatedCompletionDate: '2026-04-25',
    description: 'Bakkie with front and side impact damage. Low mileage — assessing viability of engine and gearbox recovery.',
    harvestedParts: [],
    history: [
      { id: 'h26', status: 'assessment', enteredAt: '2026-04-19T09:00:00Z' },
    ],
  },

  // SJ-0107 — Mercedes C-Class write-off, completed
  {
    id: 'job-7',
    number: 'SJ-0107',
    donorVehicle: {
      rego: 'GP 345 BT',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2017,
      variant: 'C200 AMG Line',
      engine: '2.0 Turbo Petrol',
      odometer: 152000,
      vin: 'WDD2050321R654321',
      condition: 'written-off',
      acquisitionSource: 'Insurance auction — Old Mutual',
      acquisitionCost: 75000,
    },
    branchId: 'east',
    dismantlerId: 'd1',
    status: 'completed',
    category: 'Full Strip',
    acquiredDate: '2026-03-01',
    estimatedCompletionDate: '2026-04-01',
    description: 'Completed full strip. All high-value parts sold or reserved. Shell sent to metal recycler.',
    harvestedParts: [
      { id: 'hp-22', partNumber: 'MB-ENG-20T-17', description: '2.0 Turbo Petrol Engine', quantity: 1, condition: 'Good', acquisitionCost: 22000, listPrice: 48000, status: 'Sold', buyerId: 'b2' },
      { id: 'hp-23', partNumber: 'MB-7GTC-GBX-17', description: '7G-Tronic Auto Gearbox', quantity: 1, condition: 'Good', acquisitionCost: 10000, listPrice: 22000, status: 'Sold', buyerId: 'b8' },
      { id: 'hp-24', partNumber: 'MB-SEAT-F-17', description: 'AMG Front Seat Pair — Black Leather', quantity: 1, condition: 'Good', acquisitionCost: 5000, listPrice: 11500, status: 'Sold', buyerId: 'b3' },
      { id: 'hp-25', partNumber: 'MB-WHEEL-17', description: '18" AMG Alloy Wheels x4', quantity: 4, condition: 'Good', acquisitionCost: 3000, listPrice: 2800, status: 'Sold', buyerId: 'b5' },
      { id: 'hp-26', partNumber: 'MB-NAVI-17', description: 'COMAND Navigation Head Unit', quantity: 1, condition: 'Good', acquisitionCost: 4000, listPrice: 9000, status: 'Sold', buyerId: 'b4' },
    ],
    history: [
      { id: 'h27', status: 'assessment', enteredAt: '2026-02-28T09:00:00Z', exitedAt: '2026-02-28T11:30:00Z' },
      { id: 'h28', status: 'awaiting-collection', enteredAt: '2026-02-28T11:30:00Z', exitedAt: '2026-03-01T10:00:00Z' },
      { id: 'h29', status: 'vehicle-received', enteredAt: '2026-03-01T10:00:00Z', exitedAt: '2026-03-03T08:00:00Z' },
      { id: 'h30', status: 'stripping', enteredAt: '2026-03-03T08:00:00Z', exitedAt: '2026-03-15T16:00:00Z' },
      { id: 'h31', status: 'parts-catalogued', enteredAt: '2026-03-15T16:00:00Z', exitedAt: '2026-03-19T09:00:00Z' },
      { id: 'h32', status: 'quality-check', enteredAt: '2026-03-19T09:00:00Z', exitedAt: '2026-03-21T14:00:00Z' },
      { id: 'h33', status: 'parts-listed', enteredAt: '2026-03-21T14:00:00Z', exitedAt: '2026-04-02T10:00:00Z' },
      { id: 'h34', status: 'completed', enteredAt: '2026-04-02T10:00:00Z' },
    ],
  },

  // SJ-0108 — Isuzu D-Max 2nd-hand, awaiting collection
  {
    id: 'job-8',
    number: 'SJ-0108',
    donorVehicle: {
      rego: 'MP 512 RX',
      make: 'Isuzu',
      model: 'D-Max',
      year: 2015,
      variant: '3.0 DDi LE 4x4',
      engine: '3.0 DDi',
      odometer: 247000,
      condition: '2nd-hand',
      acquisitionSource: 'Private seller',
      acquisitionCost: 41000,
    },
    branchId: 'north',
    dismantlerId: 'd2',
    status: 'awaiting-collection',
    category: 'Parts Only',
    acquiredDate: '2026-04-21',
    estimatedCompletionDate: '2026-05-05',
    description: 'High-mileage D-Max purchased specifically for its 3.0 DDi engine and gearbox — in demand. Remainder of vehicle to be assessed for additional parts.',
    harvestedParts: [],
    history: [
      { id: 'h35', status: 'assessment', enteredAt: '2026-04-18T14:00:00Z', exitedAt: '2026-04-18T16:00:00Z' },
      { id: 'h36', status: 'awaiting-collection', enteredAt: '2026-04-18T16:00:00Z' },
    ],
  },

  // SJ-0109 — Volkswagen Golf 7 written-off, scrapped
  {
    id: 'job-9',
    number: 'SJ-0109',
    donorVehicle: {
      rego: 'GP 101 YK',
      make: 'VW',
      model: 'Golf',
      year: 2016,
      variant: 'GTI 2.0 TSI',
      engine: '2.0 TSI',
      odometer: 178600,
      condition: 'written-off',
      acquisitionSource: 'Insurance auction — Nedbank Insurance',
      acquisitionCost: 22000,
    },
    branchId: 'south',
    dismantlerId: 'd3',
    status: 'written-off-scrap',
    category: 'Write-off Assessment',
    acquiredDate: '2026-03-10',
    estimatedCompletionDate: '2026-03-25',
    description: 'Severe fire damage — no usable parts recovered. Shell sent to scrap merchant after assessment.',
    harvestedParts: [
      { id: 'hp-27', partNumber: 'VWG-ENG-20TSI-16', description: '2.0 TSI Engine — Fire Damaged', quantity: 1, condition: 'Scrap', acquisitionCost: 15000, listPrice: 0, status: 'Scrapped' },
      { id: 'hp-28', partNumber: 'VWG-INT-16', description: 'Interior Assembly — Fire Damaged', quantity: 1, condition: 'Scrap', acquisitionCost: 5000, listPrice: 0, status: 'Scrapped' },
    ],
    history: [
      { id: 'h37', status: 'assessment', enteredAt: '2026-03-10T09:00:00Z', exitedAt: '2026-03-10T11:30:00Z' },
      { id: 'h38', status: 'vehicle-received', enteredAt: '2026-03-10T11:30:00Z', exitedAt: '2026-03-11T08:00:00Z' },
      { id: 'h39', status: 'stripping', enteredAt: '2026-03-11T08:00:00Z', exitedAt: '2026-03-12T16:00:00Z' },
      { id: 'h40', status: 'written-off-scrap', enteredAt: '2026-03-12T16:00:00Z' },
    ],
  },

  // SJ-0110 — Toyota Fortuner accident damaged, stripping (overdue)
  {
    id: 'job-10',
    number: 'SJ-0110',
    donorVehicle: {
      rego: 'LP 678 NQ',
      make: 'Toyota',
      model: 'Fortuner',
      year: 2022,
      variant: '2.8 GD-6 4x4 Legend',
      engine: '2.8 GD-6',
      odometer: 52100,
      vin: 'MR0GX3KM20R456789',
      condition: 'accident-damaged',
      acquisitionSource: 'Insurance auction — Outsurance',
      acquisitionCost: 98000,
    },
    branchId: 'east',
    dismantlerId: 'd4',
    status: 'stripping',
    category: 'Full Strip',
    acquiredDate: '2026-04-01',
    estimatedCompletionDate: '2026-04-15',
    description: 'Near-new Fortuner, side-impact write-off. Engine and most mechanicals untouched — high-value job. Stripping behind schedule.',
    harvestedParts: [
      { id: 'hp-29', partNumber: 'TOY-ENG-28GD6-22', description: '2.8 GD-6 Engine Assembly', quantity: 1, condition: 'Good', acquisitionCost: 28000, listPrice: 65000, status: 'Reserved', buyerId: 'b8' },
      { id: 'hp-30', partNumber: 'TOY-GBX-6AT-22', description: '6-Speed Automatic Gearbox', quantity: 1, condition: 'Good', acquisitionCost: 12000, listPrice: 28000, status: 'Reserved', buyerId: 'b6' },
      { id: 'hp-31', partNumber: 'TOY-DOOR-FL-22', description: 'Front Left Door — Graphite', quantity: 1, condition: 'Good', acquisitionCost: 3500, listPrice: 8500, status: 'In Stock' },
      { id: 'hp-32', partNumber: 'TOY-DOOR-RL-22', description: 'Rear Left Door — Graphite', quantity: 1, condition: 'Good', acquisitionCost: 3500, listPrice: 8000, status: 'In Stock' },
    ],
    history: [
      { id: 'h41', status: 'assessment', enteredAt: '2026-03-30T09:00:00Z', exitedAt: '2026-03-30T11:00:00Z' },
      { id: 'h42', status: 'awaiting-collection', enteredAt: '2026-03-30T11:00:00Z', exitedAt: '2026-04-01T08:00:00Z' },
      { id: 'h43', status: 'vehicle-received', enteredAt: '2026-04-01T08:00:00Z', exitedAt: '2026-04-03T08:00:00Z' },
      { id: 'h44', status: 'stripping', enteredAt: '2026-04-03T08:00:00Z' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper exports
// ---------------------------------------------------------------------------

export const statusById = (id: string) =>
  statuses.find((s) => s.id === id) ?? statuses[0];

export const getStatusLabel = (id: string) => statusById(id).label;
export const getStatusColor = (id: string) => statusById(id).color;
export const getBranchName = (id: string) =>
  branches.find((b) => b.id === id)?.name ?? 'Unknown';
export const getDismantlerName = (id: string) =>
  dismantlers.find((d) => d.id === id)?.name ?? 'Unassigned';
export const getBuyerById = (id: string) =>
  buyers.find((b) => b.id === id);
