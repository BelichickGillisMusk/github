// worker.js - Clean Truck Check Stockton
//
// Routes:
//   GET /             -> marketing homepage
//   GET /contractors  -> contractor revenue dashboard
//   *                 -> homepage (fallthrough)

function renderContractorsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contractor Accounts | Clean Truck Check Stockton</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap">
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    :root{
      --navy:#0f1b2e;--navy2:#162338;--green:#1a8c4a;--green-lt:#22b35e;--green-bg:rgba(26,140,74,0.12);
      --amber:#e6a817;--amber-bg:rgba(230,168,23,0.12);
      --red:#e05555;--red-bg:rgba(224,85,85,0.1);
      --txt:#e8edf5;--txt2:#9baabb;--txt3:#6b7d90;
      --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.14);
      --card:#1a2840;--card2:#1f3050;
      --mono:'JetBrains Mono',monospace;
    }
    html{scroll-behavior:smooth;}
    body{background:var(--navy);color:var(--txt);font-family:'Inter',sans-serif;font-size:15px;line-height:1.6;min-height:100vh;}

    /* TOP BAR */
    .topbar{
      background:var(--navy2);border-bottom:2px solid var(--green);
      padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;
      position:sticky;top:0;z-index:100;box-shadow:0 4px 20px rgba(0,0,0,0.4);
    }
    .brand{display:flex;align-items:center;gap:12px;text-decoration:none;}
    .brand-icon{width:36px;height:36px;background:var(--green);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;}
    .brand-name{font-size:17px;font-weight:800;color:#fff;letter-spacing:-0.3px;}
    .brand-sub{font-size:11px;font-weight:600;color:var(--green-lt);letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;}
    .topbar-right{display:flex;align-items:center;gap:12px;}
    .badge-tester{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--green-lt);background:var(--green-bg);border:1px solid var(--green);padding:5px 12px;letter-spacing:1px;}
    .btn-export{font-family:var(--mono);font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:9px 18px;background:var(--green);color:#fff;border:none;cursor:pointer;transition:background 0.2s;}
    .btn-export:hover{background:var(--green-lt);}

    /* SHELL */
    .shell{max-width:1400px;margin:0 auto;padding:32px 32px 80px;}

    /* PAGE HEADER */
    .page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;}
    .page-title{font-size:32px;font-weight:800;color:#fff;letter-spacing:-0.5px;}
    .page-sub{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--txt3);letter-spacing:1.5px;text-transform:uppercase;margin-top:5px;}
    .period-badge{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--amber);background:var(--amber-bg);border:1.5px solid var(--amber);padding:8px 18px;letter-spacing:0.5px;}

    /* KPI CARDS */
    .kpi-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:28px;}
    .kpi{background:var(--card);border:1.5px solid var(--border2);border-radius:10px;padding:22px 24px;position:relative;overflow:hidden;}
    .kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;}
    .kpi.g::before{background:linear-gradient(90deg,#0d5c30,var(--green-lt));}
    .kpi.a::before{background:linear-gradient(90deg,#8a6010,var(--amber));}
    .kpi.r::before{background:linear-gradient(90deg,#8b2020,var(--red));}
    .kpi.b::before{background:linear-gradient(90deg,#1e3a8a,#3b82f6);}
    .kpi.w::before{background:linear-gradient(90deg,#374151,#6b7280);}
    .kpi-label{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--txt3);margin-bottom:8px;}
    .kpi-val{font-family:var(--mono);font-size:30px;font-weight:700;line-height:1;color:#fff;}
    .kpi.g .kpi-val{color:var(--green-lt);}
    .kpi.a .kpi-val{color:var(--amber);}
    .kpi.r .kpi-val{color:var(--red);}
    .kpi-sub{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--txt3);margin-top:6px;}

    /* FILTER BAR */
    .filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
    .filter-label{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--txt3);margin-right:4px;}
    .fbtn{font-family:var(--mono);font-size:12px;font-weight:700;padding:7px 16px;border:1.5px solid var(--border2);background:transparent;color:var(--txt2);cursor:pointer;transition:all 0.15s;border-radius:4px;}
    .fbtn:hover{border-color:var(--green);color:var(--green-lt);}
    .fbtn.active{background:var(--green);border-color:var(--green);color:#fff;}
    .search-box{font-family:var(--mono);font-size:13px;padding:7px 14px;background:var(--card);border:1.5px solid var(--border2);color:var(--txt);outline:none;border-radius:4px;width:220px;margin-left:auto;}
    .search-box:focus{border-color:var(--green);}
    .search-box::placeholder{color:var(--txt3);}

    /* TABLE */
    .table-wrap{overflow-x:auto;border:1.5px solid var(--border2);border-radius:10px;background:var(--card);}
    table{width:100%;border-collapse:collapse;min-width:1050px;}
    thead tr{background:linear-gradient(90deg,#0d1e33,#162b44);}
    th{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);padding:16px 16px;text-align:left;white-space:nowrap;border-bottom:1.5px solid var(--border2);}
    tbody tr{border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.1s;}
    tbody tr:hover{background:rgba(26,140,74,0.07);}
    td{padding:14px 16px;font-size:14px;vertical-align:middle;}
    .company-name{font-weight:700;color:#fff;font-size:15px;}
    .company-city{font-family:var(--mono);font-size:11px;color:var(--txt3);margin-top:2px;}
    .mono{font-family:var(--mono);}
    .amt{font-family:var(--mono);font-size:15px;font-weight:700;color:var(--green-lt);}
    .cnt{font-family:var(--mono);font-size:14px;font-weight:700;color:#fff;}
    .date-cell{font-family:var(--mono);font-size:13px;color:var(--txt2);}
    .status-badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:0.3px;text-transform:uppercase;}
    .status-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;}
    .s-active{background:rgba(26,140,74,0.2);color:var(--green-lt);border:1.5px solid rgba(26,140,74,0.35);}
    .s-pending{background:var(--amber-bg);color:var(--amber);border:1.5px solid rgba(230,168,23,0.35);}
    .s-inactive{background:rgba(107,125,144,0.15);color:var(--txt3);border:1.5px solid rgba(107,125,144,0.25);}
    .type-pill{font-family:var(--mono);font-size:11px;font-weight:700;padding:4px 10px;background:rgba(255,255,255,0.06);color:var(--txt2);border-radius:4px;display:inline-block;}
    .action-btn{font-family:var(--mono);font-size:11px;font-weight:700;padding:6px 12px;border:1.5px solid var(--border2);background:transparent;color:var(--txt2);cursor:pointer;transition:all 0.15s;border-radius:4px;white-space:nowrap;}
    .action-btn:hover{border-color:var(--green);color:var(--green-lt);}

    /* TOTALS ROW */
    .totals-row{display:flex;justify-content:flex-end;background:rgba(255,255,255,0.03);border-top:1.5px solid var(--border2);border-radius:0 0 10px 10px;}
    .total-cell{font-family:var(--mono);padding:18px 22px;border-left:1px solid var(--border);text-align:right;}
    .tc-label{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--txt3);margin-bottom:4px;}
    .tc-val{font-size:20px;font-weight:800;color:#fff;}
    .tc-green .tc-val{color:var(--green-lt);}

    /* REVENUE BREAKDOWN */
    .breakdown-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px;}
    .breakdown-card{background:var(--card);border:1.5px solid var(--border2);border-radius:10px;overflow:hidden;}
    .bc-head{padding:14px 20px;font-family:var(--mono);font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border);}
    .bc-body{padding:16px 20px;}
    .bc-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
    .bc-row:last-child{border-bottom:none;}
    .bc-label{font-size:14px;font-weight:600;color:var(--txt2);}
    .bc-val{font-family:var(--mono);font-size:15px;font-weight:700;color:#fff;}
    .bc-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin:0 16px;overflow:hidden;}
    .bc-bar{height:100%;border-radius:3px;background:linear-gradient(90deg,#0d5c30,var(--green-lt));transition:width 0.6s ease;}

    @media(max-width:900px){.kpi-row{grid-template-columns:repeat(2,1fr);}.breakdown-grid{grid-template-columns:1fr;}.shell{padding:20px 16px 60px;}}
  </style>
</head>
<body>

<div class="topbar">
  <a href="/" class="brand">
    <div class="brand-icon">🚛</div>
    <div>
      <div class="brand-name">Clean Truck Check</div>
      <div class="brand-sub">Stockton · CARB Certified</div>
    </div>
  </a>
  <div class="topbar-right">
    <div class="badge-tester">TESTER ID: IF530523</div>
    <button class="btn-export" onclick="exportCSV()">↓ Export CSV</button>
  </div>
</div>

<div class="shell">

  <div class="page-header">
    <div>
      <div class="page-title">Contractor Accounts</div>
      <div class="page-sub">Revenue Tracker · Fleet Clients · Central Valley</div>
    </div>
    <div class="period-badge">2025–2026 YTD</div>
  </div>

  <!-- KPI CARDS -->
  <div class="kpi-row" id="kpi-row"></div>

  <!-- FILTER BAR -->
  <div class="filter-bar">
    <span class="filter-label">Filter:</span>
    <button class="fbtn active" onclick="filterRows('all',this)">All</button>
    <button class="fbtn" onclick="filterRows('active',this)">Active</button>
    <button class="fbtn" onclick="filterRows('pending',this)">Pending</button>
    <button class="fbtn" onclick="filterRows('inactive',this)">Inactive</button>
    <button class="fbtn" onclick="filterRows('fleet',this)">Fleet 5+</button>
    <input class="search-box" type="text" placeholder="Search company…" oninput="searchRows(this.value)" id="search-input">
  </div>

  <!-- TABLE -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th><th>Company</th><th>Service Type</th><th>Vehicles Tested</th>
          <th>Last Test</th><th>Total Revenue</th><th>YTD Tests</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="contractor-tbody"></tbody>
    </table>
    <div class="totals-row" id="totals-row"></div>
  </div>

  <!-- REVENUE BREAKDOWN -->
  <div class="breakdown-grid">
    <div class="breakdown-card">
      <div class="bc-head">📊 Revenue by Service Type</div>
      <div class="bc-body" id="service-breakdown"></div>
    </div>
    <div class="breakdown-card">
      <div class="bc-head">🏆 Top 5 Accounts by Revenue</div>
      <div class="bc-body" id="top-accounts"></div>
    </div>
  </div>

</div>

<script>
const CONTRACTORS = [
  { id:'C001', company:'Pacific Coast Freight LLC',       city:'Stockton',    type:'Fleet HD-OBD', vehicles:12, lastTest:'2026-03-28', revenue:1800, ytd:12, status:'active'   },
  { id:'C002', company:'Central Valley Trucking Co.',     city:'Modesto',     type:'Opacity + HD-OBD', vehicles:8, lastTest:'2026-04-02', revenue:2120, ytd:8, status:'active'   },
  { id:'C003', company:'Delta Transport Inc.',            city:'Stockton',    type:'Fleet HD-OBD', vehicles:15, lastTest:'2026-03-15', revenue:2250, ytd:15, status:'active'   },
  { id:'C004', company:'San Joaquin Logistics',           city:'Tracy',       type:'HD-OBD Only', vehicles:6,  lastTest:'2026-04-05', revenue:450,  ytd:6,  status:'active'   },
  { id:'C005', company:'Valley Farm Transport',           city:'Lodi',        type:'Opacity Test', vehicles:4,  lastTest:'2026-02-20', revenue:796,  ytd:4,  status:'active'   },
  { id:'C006', company:'Stockton Steel & Iron',           city:'Stockton',    type:'Fleet HD-OBD', vehicles:9,  lastTest:'2026-03-22', revenue:1350, ytd:9,  status:'active'   },
  { id:'C007', company:'Big Rig Ready Inc.',              city:'Manteca',     type:'HD-OBD Only', vehicles:7,  lastTest:'2026-04-01', revenue:525,  ytd:7,  status:'active'   },
  { id:'C008', company:'Sunrise Haulers',                 city:'Stockton',    type:'Opacity + HD-OBD', vehicles:5,  lastTest:'2026-03-10', revenue:1500, ytd:5,  status:'active'   },
  { id:'C009', company:'Interstate Cargo Partners',       city:'Lathrop',     type:'Fleet HD-OBD', vehicles:11, lastTest:'2026-04-08', revenue:1650, ytd:11, status:'active'   },
  { id:'C010', company:'Golden State Refrigerated',       city:'Stockton',    type:'HD-OBD Only', vehicles:3,  lastTest:'2026-03-05', revenue:225,  ytd:3,  status:'pending'  },
  { id:'C011', company:'Manteca Moving & Storage',        city:'Manteca',     type:'HD-OBD Only', vehicles:2,  lastTest:'2026-01-18', revenue:150,  ytd:2,  status:'active'   },
  { id:'C012', company:'Turlock Ag Transport',            city:'Turlock',     type:'Opacity Test', vehicles:6,  lastTest:'2026-02-14', revenue:1194, ytd:6,  status:'active'   },
  { id:'C013', company:'Crossroads Cement Co.',           city:'Stockton',    type:'Fleet HD-OBD', vehicles:10, lastTest:'2026-03-29', revenue:1490, ytd:10, status:'active'   },
  { id:'C014', company:'West Valley Waste Solutions',     city:'Modesto',     type:'Opacity + HD-OBD', vehicles:7,  lastTest:'2026-04-03', revenue:1960, ytd:7,  status:'active'   },
  { id:'C015', company:'Port of Stockton Contractors',    city:'Stockton',    type:'Fleet HD-OBD', vehicles:20, lastTest:'2026-04-07', revenue:2980, ytd:20, status:'active'   },
  { id:'C016', company:'NorCal Box Trucking',             city:'Sacramento',  type:'HD-OBD Only', vehicles:5,  lastTest:'2026-03-17', revenue:375,  ytd:5,  status:'active'   },
  { id:'C017', company:'Sierra Pacific Timber Haul',      city:'Angels Camp', type:'Opacity Test', vehicles:3,  lastTest:'2026-02-28', revenue:597,  ytd:3,  status:'active'   },
  { id:'C018', company:'Lodi Nursery & Landscape',        city:'Lodi',        type:'HD-OBD Only', vehicles:2,  lastTest:'2025-12-10', revenue:150,  ytd:2,  status:'inactive' },
  { id:'C019', company:'Tracy Distribution Center',       city:'Tracy',       type:'Fleet HD-OBD', vehicles:14, lastTest:'2026-04-04', revenue:2086, ytd:14, status:'active'   },
  { id:'C020', company:'Valley Propane & Gas',            city:'Stockton',    type:'HD-OBD Only', vehicles:4,  lastTest:'2026-03-20', revenue:300,  ytd:4,  status:'active'   },
  { id:'C021', company:'SJV Excavating LLC',              city:'Fresno',      type:'Opacity + HD-OBD', vehicles:6,  lastTest:'2026-03-12', revenue:1680, ytd:6,  status:'active'   },
  { id:'C022', company:'Riverbend Concrete Pumping',      city:'Stockton',    type:'Fleet HD-OBD', vehicles:8,  lastTest:'2026-03-25', revenue:1192, ytd:8,  status:'active'   },
  { id:'C023', company:'Bay Area Flatbed Express',        city:'Oakland',     type:'HD-OBD Only', vehicles:3,  lastTest:'2026-01-30', revenue:225,  ytd:3,  status:'pending'  },
  { id:'C024', company:'Diablo Asphalt Services',         city:'Antioch',     type:'Opacity Test', vehicles:5,  lastTest:'2026-02-22', revenue:995,  ytd:5,  status:'active'   },
  { id:'C025', company:'Stanislaus Tank Liners',          city:'Modesto',     type:'HD-OBD Only', vehicles:2,  lastTest:'2026-03-08', revenue:150,  ytd:2,  status:'active'   },
  { id:'C026', company:'Central Valley RV Fleet',         city:'Stockton',    type:'RV Testing',  vehicles:4,  lastTest:'2026-02-05', revenue:1200, ytd:4,  status:'active'   },
  { id:'C027', company:'Coastal Crane Rentals',           city:'Lathrop',     type:'Fleet HD-OBD', vehicles:7,  lastTest:'2026-04-06', revenue:1043, ytd:7,  status:'active'   },
  { id:'C028', company:'Gold Rush Gravel & Sand',         city:'lone',        type:'Opacity Test', vehicles:3,  lastTest:'2026-03-03', revenue:597,  ytd:3,  status:'active'   },
  { id:'C029', company:'Modesto Ice & Cold Chain',        city:'Modesto',     type:'HD-OBD Only', vehicles:5,  lastTest:'2026-03-14', revenue:375,  ytd:5,  status:'active'   },
  { id:'C030', company:'Apex Auto Transport',             city:'Stockton',    type:'Fleet HD-OBD', vehicles:9,  lastTest:'2026-04-09', revenue:1341, ytd:9,  status:'active'   },
  { id:'C031', company:'Heritage Lumber Transport',       city:'Sonora',      type:'Opacity Test', vehicles:4,  lastTest:'2026-01-22', revenue:796,  ytd:4,  status:'pending'  },
  { id:'C032', company:'Crossroads Food Distribution',    city:'Stockton',    type:'Fleet HD-OBD', vehicles:11, lastTest:'2026-03-31', revenue:1639, ytd:11, status:'active'   },
  { id:'C033', company:'Mission Ready Mechanical',        city:'Tracy',       type:'HD-OBD Only', vehicles:3,  lastTest:'2026-02-18', revenue:225,  ytd:3,  status:'active'   },
  { id:'C034', company:'Valley Visions Recycling',        city:'Stockton',    type:'Opacity + HD-OBD', vehicles:5,  lastTest:'2026-03-19', revenue:1400, ytd:5,  status:'active'   },
  { id:'C035', company:'Pacific Rim Containers',          city:'Stockton',    type:'Fleet HD-OBD', vehicles:16, lastTest:'2026-04-10', revenue:2384, ytd:16, status:'active'   },
  { id:'C036', company:'North Valley Fire Protection',    city:'Chico',       type:'HD-OBD Only', vehicles:2,  lastTest:'2025-11-14', revenue:150,  ytd:2,  status:'inactive' },
  { id:'C037', company:'San Joaquin Crane Service',       city:'Stockton',    type:'Fleet HD-OBD', vehicles:6,  lastTest:'2026-03-26', revenue:894,  ytd:6,  status:'active'   },
  { id:'C038', company:'Delta Ag Spraying LLC',           city:'Lodi',        type:'HD-OBD Only', vehicles:4,  lastTest:'2026-02-10', revenue:300,  ytd:4,  status:'active'   },
  { id:'C039', company:'I-5 Corridor Express',            city:'Stockton',    type:'Fleet HD-OBD', vehicles:13, lastTest:'2026-04-02', revenue:1937, ytd:13, status:'active'   },
  { id:'C040', company:'Sunrise Septic & Drain',          city:'Manteca',     type:'Opacity Test', vehicles:3,  lastTest:'2026-03-07', revenue:597,  ytd:3,  status:'active'   },
  { id:'C041', company:'Big Valley Beverage Dist.',       city:'Fresno',      type:'Fleet HD-OBD', vehicles:8,  lastTest:'2026-03-21', revenue:1192, ytd:8,  status:'active'   },
  { id:'C042', company:'Turlock Towing & Recovery',       city:'Turlock',     type:'HD-OBD Only', vehicles:5,  lastTest:'2026-01-28', revenue:375,  ytd:5,  status:'pending'  },
  { id:'C043', company:'Sutter Crane & Rigging',          city:'Sacramento',  type:'Fleet HD-OBD', vehicles:7,  lastTest:'2026-04-01', revenue:1043, ytd:7,  status:'active'   },
  { id:'C044', company:'West Side Produce Inc.',          city:'Fresno',      type:'Opacity + HD-OBD', vehicles:9,  lastTest:'2026-03-16', revenue:2520, ytd:9,  status:'active'   },
  { id:'C045', company:'Capitol City Flatbed',            city:'Sacramento',  type:'HD-OBD Only', vehicles:4,  lastTest:'2026-02-25', revenue:300,  ytd:4,  status:'active'   },
  { id:'C046', company:'Mountain Pass Logging',           city:'Sonora',      type:'Opacity Test', vehicles:5,  lastTest:'2025-12-20', revenue:995,  ytd:5,  status:'inactive' },
  { id:'C047', company:'Eastside Iron & Metal',           city:'Stockton',    type:'Fleet HD-OBD', vehicles:6,  lastTest:'2026-04-07', revenue:894,  ytd:6,  status:'active'   },
  { id:'C048', company:'Valley Air Freight',              city:'Fresno',      type:'HD-OBD Only', vehicles:3,  lastTest:'2026-03-11', revenue:225,  ytd:3,  status:'active'   },
  { id:'C049', company:'Horizon Tank Transport',          city:'Stockton',    type:'Fleet HD-OBD', vehicles:10, lastTest:'2026-04-08', revenue:1490, ytd:10, status:'active'   },
  { id:'C050', company:'Sierra Nevada Brewing Dist.',     city:'Chico',       type:'HD-OBD Only', vehicles:6,  lastTest:'2026-03-04', revenue:450,  ytd:6,  status:'active'   },
  { id:'C051', company:'Central Valley Hay & Feed',       city:'Tulare',      type:'Opacity Test', vehicles:4,  lastTest:'2026-02-08', revenue:796,  ytd:4,  status:'active'   },
  { id:'C052', company:'Gold Hills Aggregate',            city:'Stockton',    type:'Fleet HD-OBD', vehicles:12, lastTest:'2026-04-03', revenue:1788, ytd:12, status:'active'   },
  { id:'C053', company:'Triton Marine Transport',         city:'Stockton',    type:'HD-OBD Only', vehicles:2,  lastTest:'2026-01-15', revenue:150,  ytd:2,  status:'pending'  },
  { id:'C054', company:'Sunrise Demolition LLC',          city:'Modesto',     type:'Opacity + HD-OBD', vehicles:7,  lastTest:'2026-03-27', revenue:1960, ytd:7,  status:'active'   },
  { id:'C055', company:'NorCal Mobile Crane',             city:'Sacramento',  type:'Fleet HD-OBD', vehicles:5,  lastTest:'2026-04-04', revenue:745,  ytd:5,  status:'active'   },
  { id:'C056', company:'Valley Vines Vineyard Svc.',      city:'Lodi',        type:'HD-OBD Only', vehicles:3,  lastTest:'2026-02-17', revenue:225,  ytd:3,  status:'active'   },
  { id:'C057', company:'Stockton Ready Mix Concrete',     city:'Stockton',    type:'Fleet HD-OBD', vehicles:18, lastTest:'2026-04-09', revenue:2682, ytd:18, status:'active'   },
  { id:'C058', company:'Amador County Timber',            city:'Jackson',     type:'Opacity Test', vehicles:3,  lastTest:'2025-10-30', revenue:597,  ytd:3,  status:'inactive' },
];

function fmt$(n){ return '$' + n.toLocaleString(); }
function fmtDate(d){ return d ? d.replace(/-/g,'/') : '—'; }

function statusBadge(s){
  const map = { active:'s-active', pending:'s-pending', inactive:'s-inactive' };
  const lbl = { active:'Active', pending:'Pending', inactive:'Inactive' };
  return \`<span class="status-badge \${map[s]||'s-inactive'}">\${lbl[s]||s}</span>\`;
}

let filtered = [...CONTRACTORS];

function renderKPIs(){
  const total = CONTRACTORS.length;
  const active = CONTRACTORS.filter(c=>c.status==='active').length;
  const totalRev = CONTRACTORS.reduce((s,c)=>s+c.revenue,0);
  const totalTests = CONTRACTORS.reduce((s,c)=>s+c.ytd,0);
  const avgRev = Math.round(totalRev / total);
  document.getElementById('kpi-row').innerHTML = \`
    <div class="kpi g"><div class="kpi-label">Total Revenue YTD</div><div class="kpi-val">\${fmt$(totalRev)}</div><div class="kpi-sub">\${total} accounts</div></div>
    <div class="kpi b"><div class="kpi-label">Tests Completed</div><div class="kpi-val">\${totalTests}</div><div class="kpi-sub">YTD 2025–2026</div></div>
    <div class="kpi a"><div class="kpi-label">Active Accounts</div><div class="kpi-val">\${active}</div><div class="kpi-sub">of \${total} total</div></div>
    <div class="kpi w"><div class="kpi-label">Avg Rev / Account</div><div class="kpi-val">\${fmt$(avgRev)}</div><div class="kpi-sub">across all accounts</div></div>
    <div class="kpi g"><div class="kpi-label">Vehicles Tracked</div><div class="kpi-val">\${CONTRACTORS.reduce((s,c)=>s+c.vehicles,0)}</div><div class="kpi-sub">fleet units served</div></div>\`;
}

function renderTable(data){
  const tbody = document.getElementById('contractor-tbody');
  tbody.innerHTML = data.map((c,i) => \`
    <tr data-status="\${c.status}" data-company="\${c.company.toLowerCase()}">
      <td class="mono" style="color:var(--txt3);font-size:12px;">\${c.id}</td>
      <td><div class="company-name">\${c.company}</div><div class="company-city">\${c.city}, CA</div></td>
      <td><span class="type-pill">\${c.type}</span></td>
      <td class="cnt">\${c.vehicles}</td>
      <td class="date-cell">\${fmtDate(c.lastTest)}</td>
      <td class="amt">\${fmt$(c.revenue)}</td>
      <td class="cnt">\${c.ytd}</td>
      <td>\${statusBadge(c.status)}</td>
      <td><button class="action-btn">📋 View</button></td>
    </tr>\`).join('');

  const totRev = data.reduce((s,c)=>s+c.revenue,0);
  const totTests = data.reduce((s,c)=>s+c.ytd,0);
  const totVeh = data.reduce((s,c)=>s+c.vehicles,0);
  document.getElementById('totals-row').innerHTML = \`
    <div class="total-cell"><div class="tc-label">Showing</div><div class="tc-val">\${data.length} accounts</div></div>
    <div class="total-cell"><div class="tc-label">Vehicles</div><div class="tc-val">\${totVeh}</div></div>
    <div class="total-cell tc-green"><div class="tc-label">Revenue</div><div class="tc-val">\${fmt$(totRev)}</div></div>
    <div class="total-cell"><div class="tc-label">Tests</div><div class="tc-val">\${totTests}</div></div>\`;
}

function renderBreakdown(){
  const byType = {};
  CONTRACTORS.forEach(c => { byType[c.type] = (byType[c.type]||0) + c.revenue; });
  const sorted = Object.entries(byType).sort((a,b)=>b[1]-a[1]);
  const maxVal = sorted[0][1];
  document.getElementById('service-breakdown').innerHTML = sorted.map(([t,v]) => \`
    <div class="bc-row">
      <span class="bc-label">\${t}</span>
      <div class="bc-bar-wrap"><div class="bc-bar" style="width:\${Math.round(v/maxVal*100)}%"></div></div>
      <span class="bc-val">\${fmt$(v)}</span>
    </div>\`).join('');

  const top5 = [...CONTRACTORS].sort((a,b)=>b.revenue-a.revenue).slice(0,5);
  const maxTop = top5[0].revenue;
  document.getElementById('top-accounts').innerHTML = top5.map((c,i) => \`
    <div class="bc-row">
      <span class="bc-label" style="min-width:0;flex:1;">\${c.company.length>32?c.company.substring(0,32)+'…':c.company}</span>
      <div class="bc-bar-wrap"><div class="bc-bar" style="width:\${Math.round(c.revenue/maxTop*100)}%"></div></div>
      <span class="bc-val">\${fmt$(c.revenue)}</span>
    </div>\`).join('');
}

function filterRows(filter, btn){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('search-input').value = '';
  if(filter === 'all') filtered = [...CONTRACTORS];
  else if(filter === 'fleet') filtered = CONTRACTORS.filter(c=>c.vehicles>=5);
  else filtered = CONTRACTORS.filter(c=>c.status===filter);
  renderTable(filtered);
}

function searchRows(query){
  const q = query.toLowerCase().trim();
  filtered = q ? CONTRACTORS.filter(c=>c.company.toLowerCase().includes(q)||c.city.toLowerCase().includes(q)) : [...CONTRACTORS];
  renderTable(filtered);
}

function exportCSV(){
  let csv = 'ID,Company,City,Service Type,Vehicles,Last Test,Revenue,YTD Tests,Status\\n';
  CONTRACTORS.forEach(c=>{
    csv += \`"\${c.id}","\${c.company}","\${c.city}","\${c.type}",\${c.vehicles},"\${c.lastTest}",\${c.revenue},\${c.ytd},"\${c.status}"\\n\`;
  });
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='CleanTruckCheck_Contractors_YTD.csv'; a.click();
}

renderKPIs();
renderTable(CONTRACTORS);
renderBreakdown();
</script>
</body>
</html>`;
}

var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '') || '/';

    if (pathname === '/contractors') {
      return new Response(renderContractorsPage(), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300"
        }
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mobile CARB emissions testing in Stockton, CA. HD-OBD testing, smoke/opacity testing for trucks. We come to you - no downtime. Licensed CARB Tester ID: IF530523. 4.9&#9733; rated.">
    <meta name="keywords" content="CARB testing Stockton, Clean Truck Check Stockton, mobile emissions testing Stockton CA, HD-OBD testing Central Valley, smoke opacity test Stockton, mobile CARB tester San Joaquin">
    <meta name="geo.position" content="37.9577;-121.2908">
    <meta name="ICBM" content="37.9577,-121.2908">
    <meta name="geo.placename" content="Stockton, California">
    <meta name="geo.region" content="US-CA">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Mobile CARB Testing Stockton, CA | Clean Truck Check">
    <meta property="og:description" content="Professional CARB emissions testing in Stockton. Mobile service - we come to you. HD-OBD, smoke/opacity testing. Licensed tester. 4.9&#9733; rated.">
    <meta property="og:type" content="business.business">
    <meta property="og:url" content="https://cleantruckcheckstockton.com">
    <meta name="theme-color" content="#0f1b2e">
    <title>Mobile CARB Testing Stockton CA | Clean Truck Check - HD-OBD &amp; Opacity</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #e0e0e0;
            background-color: #0f1b2e;
            line-height: 1.6;
            overflow-x: hidden;
        }

        html {
            scroll-behavior: smooth;
        }

        /* Utility Classes */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .section-padding {
            padding: 60px 0;
        }

        @media (max-width: 768px) {
            .section-padding {
                padding: 40px 0;
            }
        }

        /* Header & Navigation */
        header {
            background-color: rgba(15, 27, 46, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 2px solid #1a8c4a;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1a8c4a;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: -0.5px;
        }

        .logo span {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
        }

        .call-btn {
            background-color: #1a8c4a;
            color: #fff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .call-btn:hover {
            background-color: #158c3a;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 140, 74, 0.3);
        }

        @media (max-width: 768px) {
            .call-btn {
                padding: 10px 20px;
                font-size: 14px;
            }
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, rgba(15, 27, 46, 0.9) 0%, rgba(26, 140, 74, 0.1) 100%),
                        radial-gradient(circle at top right, rgba(26, 140, 74, 0.15) 0%, transparent 60%);
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(26, 140, 74, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .hero::after {
            content: '';
            position: absolute;
            bottom: -20%;
            left: -5%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(26, 140, 74, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .hero-content {
            position: relative;
            z-index: 2;
            animation: fadeInUp 0.8s ease;
        }

        .hero h1 {
            font-size: 56px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #fff;
            line-height: 1.2;
        }

        .hero .highlight {
            color: #1a8c4a;
        }

        .hero p {
            font-size: 20px;
            color: #b0b0b0;
            margin-bottom: 30px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .compliance-alert {
            background-color: rgba(26, 140, 74, 0.1);
            border-left: 4px solid #1a8c4a;
            padding: 15px 20px;
            margin-bottom: 30px;
            border-radius: 4px;
            font-size: 16px;
            color: #d4edda;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
            padding: 16px 40px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 4px;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-block;
        }

        .btn-primary {
            background-color: #1a8c4a;
            color: #fff;
        }

        .btn-primary:hover {
            background-color: #158c3a;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(26, 140, 74, 0.4);
        }

        .btn-secondary {
            background-color: transparent;
            color: #1a8c4a;
            border: 2px solid #1a8c4a;
        }

        .btn-secondary:hover {
            background-color: rgba(26, 140, 74, 0.1);
            transform: translateY(-3px);
        }

        @media (max-width: 768px) {
            .hero {
                padding: 60px 0;
            }

            .hero h1 {
                font-size: 36px;
            }

            .hero p {
                font-size: 18px;
            }

            .cta-buttons {
                flex-direction: column;
            }

            .btn-primary, .btn-secondary {
                width: 100%;
            }
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Trust Badges */
        .trust-badges {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            margin-top: 50px;
            flex-wrap: wrap;
        }

        .badge {
            text-align: center;
        }

        .badge-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }

        .badge-text {
            font-size: 14px;
            color: #b0b0b0;
        }

        .badge-highlight {
            color: #1a8c4a;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .trust-badges {
                gap: 20px;
            }

            .badge-icon {
                font-size: 24px;
            }
        }

        /* Services Section */
        .services {
            background-color: #0a0f1a;
            border-top: 1px solid rgba(26, 140, 74, 0.2);
        }

        .section-title {
            font-size: 42px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 15px;
            color: #fff;
        }

        .section-subtitle {
            text-align: center;
            color: #b0b0b0;
            font-size: 18px;
            margin-bottom: 50px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .service-card {
            background: linear-gradient(135deg, rgba(26, 140, 74, 0.1) 0%, rgba(26, 140, 74, 0.05) 100%);
            border: 1px solid rgba(26, 140, 74, 0.3);
            border-radius: 8px;
            padding: 35px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            animation: slideInRight 0.6s ease;
        }

        .service-card:hover {
            border-color: #1a8c4a;
            background: linear-gradient(135deg, rgba(26, 140, 74, 0.15) 0%, rgba(26, 140, 74, 0.08) 100%);
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(26, 140, 74, 0.2);
        }

        .service-icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #1a8c4a;
        }

        .service-card h3 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #fff;
        }

        .service-card p {
            color: #b0b0b0;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .service-price {
            font-size: 28px;
            color: #1a8c4a;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .service-cta {
            display: inline-block;
            color: #1a8c4a;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .service-cta:hover {
            color: #fff;
        }

        @media (max-width: 768px) {
            .section-title {
                font-size: 32px;
            }

            .services-grid {
                gap: 20px;
            }

            .service-card {
                padding: 25px;
            }
        }

        /* Why Mobile Section */
        .why-mobile {
            background-color: #0f1b2e;
            border-top: 1px solid rgba(26, 140, 74, 0.2);
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 35px;
            margin-top: 50px;
        }

        .benefit-item {
            display: flex;
            gap: 20px;
            animation: fadeInUp 0.8s ease;
        }

        .benefit-icon {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            background-color: rgba(26, 140, 74, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .benefit-content h4 {
            font-size: 18px;
            color: #fff;
            margin-bottom: 8px;
        }

        .benefit-content p {
            color: #b0b0b0;
            font-size: 14px;
        }

        /* Local Content */
        .local-content {
            background-color: #0a0f1a;
            border-top: 1px solid rgba(26, 140, 74, 0.2);
        }

        .local-coverage {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: start;
        }

        @media (max-width: 768px) {
            .local-coverage {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }

        .coverage-text h3 {
            font-size: 28px;
            color: #fff;
            margin-bottom: 20px;
        }

        .coverage-list {
            list-style: none;
            margin-bottom: 25px;
        }

        .coverage-list li {
            color: #b0b0b0;
            padding: 8px 0;
            border-bottom: 1px solid rgba(26, 140, 74, 0.1);
            font-size: 15px;
        }

        .coverage-list li::before {
            content: '&#10003; ';
            color: #1a8c4a;
            font-weight: bold;
        }

        .coverage-highlight {
            background-color: rgba(26, 140, 74, 0.1);
            border: 1px solid rgba(26, 140, 74, 0.3);
            border-radius: 6px;
            padding: 20px;
            color: #d4edda;
            font-size: 14px;
            line-height: 1.7;
        }

        /* FAQ */
        .faq {
            background-color: #0f1b2e;
            border-top: 1px solid rgba(26, 140, 74, 0.2);
        }

        .faq-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .faq-item {
            border: 1px solid rgba(26, 140, 74, 0.2);
            border-radius: 6px;
            margin-bottom: 15px;
            overflow: hidden;
        }

        .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            cursor: pointer;
            background-color: rgba(26, 140, 74, 0.05);
            transition: background-color 0.3s ease;
        }

        .faq-question:hover {
            background-color: rgba(26, 140, 74, 0.1);
        }

        .faq-question h4 {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }

        .faq-toggle {
            color: #1a8c4a;
            font-size: 24px;
            font-weight: 300;
            flex-shrink: 0;
            transition: transform 0.3s ease;
        }

        .faq-item.active .faq-toggle {
            transform: rotate(45deg);
        }

        .faq-answer {
            display: none;
            padding: 20px 25px;
            color: #b0b0b0;
            font-size: 15px;
            line-height: 1.7;
            border-top: 1px solid rgba(26, 140, 74, 0.1);
        }

        .faq-item.active .faq-answer {
            display: block;
        }

        /* CTA Section */
        .cta-section {
            text-align: center;
            padding: 60px 20px;
        }

        .cta-section h2 {
            font-size: 42px;
            color: #fff;
            margin-bottom: 20px;
        }

        .cta-section p {
            color: #b0b0b0;
            font-size: 18px;
            margin-bottom: 35px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Footer */
        footer {
            background-color: #060d18;
            border-top: 2px solid #1a8c4a;
            padding: 60px 0 30px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }

        .footer-section h4 {
            color: #fff;
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section ul li {
            margin-bottom: 10px;
        }

        .footer-section ul li a {
            color: #b0b0b0;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
            color: #1a8c4a;
        }

        .footer-contact {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .footer-contact-icon {
            font-size: 20px;
        }

        .footer-contact a {
            color: #1a8c4a;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
        }

        .footer-bottom {
            border-top: 1px solid rgba(26, 140, 74, 0.2);
            padding-top: 30px;
            text-align: center;
            color: #b0b0b0;
            font-size: 13px;
            line-height: 2;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <a href="#hero" class="logo">
                    &#x1F69A; Clean Truck Check
                    <span>Stockton</span>
                </a>
                <a href="tel:9168904427" class="call-btn">
                    &#x1F4DE; Call Now
                </a>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="hero">
        <div class="container">
            <div class="hero-content">
                <h1>
                    Mobile CARB Testing in <span class="highlight">Stockton, CA</span>
                </h1>
                <p>
                    Licensed emissions testing comes to you. No downtime. No waiting at a shop.
                    HD-OBD, smoke/opacity, and fleet testing for the Central Valley and San Joaquin.
                </p>

                <div class="compliance-alert">
                    &#x26A0;&#xFE0F; Biannual testing is NOW REQUIRED in 2026. Don&#39;t wait for a citation. Schedule today.
                </div>

                <div class="cta-buttons">
                    <a href="tel:9168904427" class="btn-primary">Call Now: 916-890-4427</a>
                    <a href="https://norcalcarbmobile.com/contact" class="btn-secondary">Schedule Online</a>
                </div>

                <div class="trust-badges">
                    <div class="badge">
                        <div class="badge-icon">&#x2B50;</div>
                        <div class="badge-text"><span class="badge-highlight">4.9&#9733;</span> / 47+ Reviews</div>
                    </div>
                    <div class="badge">
                        <div class="badge-icon">&#x2713;</div>
                        <div class="badge-text">Licensed CARB Tester<br><span class="badge-highlight">IF530523</span></div>
                    </div>
                    <div class="badge">
                        <div class="badge-icon">&#x1F3C1;</div>
                        <div class="badge-text">Mobile Service<br><span class="badge-highlight">We Come To You</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services section-padding" id="services">
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">
                Professional CARB emissions testing for trucks and fleets. Licensed and certified for Central Valley operations.
            </p>

            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">&#x1F527;</div>
                    <h3>HD-OBD Testing</h3>
                    <p>Heavy-duty on-board diagnostic testing for trucks 2013+. Complete compliance certification.</p>
                    <div class="service-price">$75</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F4A8;</div>
                    <h3>Smoke/Opacity Testing</h3>
                    <p>Professional smoke and opacity testing. Quick turnaround with official CARB documentation.</p>
                    <div class="service-price">$199</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F69B;</div>
                    <h3>Fleet Opacity Testing</h3>
                    <p>Multi-vehicle fleet testing with volume discounts. Mobile service reduces operational downtime.</p>
                    <div class="service-price">$149+</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>

                <div class="service-card">
                    <div class="service-icon">&#x1F3E0;</div>
                    <h3>RV/Motorhome Testing</h3>
                    <p>Full-service CARB testing for RVs and motorhomes. We handle all paperwork and compliance.</p>
                    <div class="service-price">$300</div>
                    <a href="tel:9168904427" class="service-cta">Schedule Now &#x2192;</a>
                </div>
            </div>

            <div class="cta-section">
                <h2>Need a Quote?</h2>
                <p>
                    Get instant pricing and schedule your test. Our mobile service covers Stockton, Lodi, Tracy,
                    Manteca, and throughout the San Joaquin Valley.
                </p>
                <a href="tel:9168904427" class="btn-primary">Call for Pricing</a>
            </div>
        </div>
    </section>

    <!-- Why Mobile Section -->
    <section class="why-mobile section-padding" id="why-mobile">
        <div class="container">
            <h2 class="section-title">Why Choose Mobile CARB Testing?</h2>
            <p class="section-subtitle">
                No more taking your truck out of service. We bring the equipment to you.
            </p>

            <div class="benefits-grid">
                <div class="benefit-item">
                    <div class="benefit-icon">&#x23F1;&#xFE0F;</div>
                    <div class="benefit-content">
                        <h4>Zero Downtime</h4>
                        <p>We test at your location. No driving to a shop, no waiting in a queue. Keep operating.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F4B0;</div>
                    <div class="benefit-content">
                        <h4>Cost Effective</h4>
                        <p>Avoid fuel costs and operational delays. Competitive pricing for single vehicles and fleets.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x2713;</div>
                    <div class="benefit-content">
                        <h4>Licensed &amp; Certified</h4>
                        <p>CARB Tester ID IF530523. All testing meets 2026 biannual compliance requirements.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F4CB;</div>
                    <div class="benefit-content">
                        <h4>Instant Documentation</h4>
                        <p>Receive official test results immediately. Digital and printed certificates provided.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x1F5FA;&#xFE0F;</div>
                    <div class="benefit-content">
                        <h4>Central Valley Wide Coverage</h4>
                        <p>Stockton, Lodi, Tracy, Manteca, Modesto, and throughout the San Joaquin Valley corridor.</p>
                    </div>
                </div>

                <div class="benefit-item">
                    <div class="benefit-icon">&#x2B50;</div>
                    <div class="benefit-content">
                        <h4>Expert Service</h4>
                        <p>Years of experience. Fast, professional, and reliable. 4.9&#9733; rated by Central Valley customers.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Local Content Section -->
    <section class="local-content section-padding" id="service-area">
        <div class="container">
            <h2 class="section-title">CARB Testing for Stockton &amp; the San Joaquin Valley</h2>

            <div class="local-coverage">
                <div class="coverage-text">
                    <h3>Serving Stockton and Surrounding Areas</h3>
                    <p style="margin-bottom: 20px; color: #b0b0b0;">
                        NorCal CARB Mobile LLC provides professional emissions testing throughout the Central Valley,
                        including Stockton, Lodi, Tracy, and Manteca. With the Port of Stockton and
                        major I-5 logistics hubs in our region, compliance testing is essential for fleet operations.
                    </p>

                    <ul class="coverage-list">
                        <li>Stockton (Central Service Hub)</li>
                        <li>Lodi &amp; Galt</li>
                        <li>Tracy &amp; Manteca</li>
                        <li>I-5 Corridor Coverage</li>
                        <li>Port of Stockton Area</li>
                        <li>San Joaquin Industrial Districts</li>
                        <li>Modesto &amp; Turlock</li>
                        <li>Ripon &amp; Escalon</li>
                    </ul>

                    <div class="coverage-highlight">
                        <strong>2026 CARB Compliance:</strong> California&#39;s biannual testing requirement is in effect.
                        All heavy-duty trucks registered in California must undergo testing. Schedule now to avoid
                        penalties and vehicle downtime.
                    </div>
                </div>

                <div>
                    <div style="background: linear-gradient(135deg, rgba(26, 140, 74, 0.15) 0%, rgba(26, 140, 74, 0.05) 100%);
                                border: 2px solid rgba(26, 140, 74, 0.3); border-radius: 8px; padding: 40px; text-align: center;">
                        <h3 style="color: #fff; margin-bottom: 20px; font-size: 24px;">Stockton Service Info</h3>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #b0b0b0; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Contact</p>
                            <a href="tel:9168904427" style="font-size: 24px; font-weight: bold; color: #1a8c4a; text-decoration: none;">
                                916-890-4427
                            </a>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #b0b0b0; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">CARB Tester ID</p>
                            <p style="font-size: 18px; font-weight: bold; color: #fff;">IF530523</p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <p style="color: #b0b0b0; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service Hours</p>
                            <p style="color: #b0b0b0; font-size: 14px;">Monday - Friday: 6am - 5pm<br>Saturday: 8am - 4pm</p>
                        </div>

                        <div>
                            <p style="color: #b0b0b0; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Primary Website</p>
                            <a href="https://norcalcarbmobile.com" style="color: #1a8c4a; text-decoration: none;">
                                norcalcarbmobile.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq section-padding" id="faq">
        <div class="container">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p class="section-subtitle">
                Everything you need to know about CARB testing in Stockton.
            </p>

            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What is CARB testing and why do I need it?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            CARB (California Air Resources Board) testing measures heavy-duty truck emissions to ensure compliance with state air quality standards.
                            As of 2026, all trucks registered in California must undergo biannual (every 2 years) HD-OBD testing or smoke/opacity testing.
                            This is a legal requirement to operate in California and avoid citations.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How long does CARB testing take?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            HD-OBD testing typically takes 30-45 minutes per vehicle. Smoke/opacity testing takes 15-30 minutes.
                            Since our testing is mobile, we come to your location, eliminating travel time and downtime.
                            You can keep your truck operational throughout the process.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Do you test at our facility or do we need to go somewhere?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            We come to you. Our mobile testing service means we bring all equipment to your location in Stockton,
                            your fleet yard, or anywhere else in the San Joaquin Valley. There&#39;s no need to take your truck out of service
                            or drive to a testing center. This is one of our biggest advantages for busy fleets.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What&#39;s the difference between HD-OBD and smoke/opacity testing?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            HD-OBD (Heavy-Duty On-Board Diagnostic) testing checks the truck&#39;s onboard computer systems for emissions compliance.
                            It&#39;s required for trucks 2013 and newer. Smoke/opacity testing measures visible emissions during acceleration.
                            Many trucks require both or can choose either. We&#39;ll help you determine which your vehicle needs.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How much does CARB testing cost?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Pricing varies by service: HD-OBD testing is $75 per vehicle, smoke/opacity testing is $199,
                            RV/motorhome testing is $300, and fleet opacity testing starts at $149+ with volume discounts.
                            Call us at 916-890-4427 for a specific quote based on your vehicles and needs.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Are you licensed and certified?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Yes. We are a licensed CARB tester with ID IF530523. Our team is certified to perform all required emissions
                            testing under California Air Resources Board regulations. All test results are official and valid for registration
                            and compliance purposes throughout California.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How do I schedule a test?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Call us at 916-890-4427 to schedule. We serve Stockton, Lodi, Tracy, Manteca, and throughout the San Joaquin Valley.
                            We offer flexible scheduling with early morning and weekend availability. You can also visit norcalcarbmobile.com/contact
                            to request service online and we&#39;ll follow up with you.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What happens if my truck fails the test?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            If your truck doesn&#39;t pass, you&#39;ll receive documentation of the failure. You&#39;ll need to address the emissions issue
                            (often through repairs or maintenance) and then retest. We can discuss options with you and help schedule a retest
                            after repairs. Many failures are due to maintenance items that are relatively inexpensive to fix.
                        </p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Is your service available on weekends?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>
                            Yes, we offer Saturday testing. Service hours are Monday-Friday 6am-5pm and Saturday 8am-4pm.
                            Call 916-890-4427 to check availability and schedule a weekend test time that works for your fleet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="section-padding" style="background-color: #0a0f1a; border-top: 1px solid rgba(26, 140, 74, 0.2);">
        <div class="container">
            <div class="cta-section">
                <h2>Ready to Get Compliant?</h2>
                <p>
                    Schedule your CARB test today. Mobile service in Stockton and the San Joaquin Valley.
                    Quick, professional, licensed testing.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="tel:9168904427" class="btn-primary">Call: 916-890-4427</a>
                    <a href="https://norcalcarbmobile.com/contact" class="btn-secondary">Schedule Online</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Clean Truck Check Stockton</h4>
                    <p style="color: #b0b0b0; font-size: 14px; margin-bottom: 15px;">
                        Mobile CARB emissions testing serving Stockton, Lodi, Tracy, Manteca, and the San Joaquin Valley.
                    </p>
                    <div class="footer-contact">
                        <span class="footer-contact-icon">&#x1F4DE;</span>
                        <a href="tel:9168904427">916-890-4427</a>
                    </div>
                </div>

                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#services">HD-OBD Testing</a></li>
                        <li><a href="#services">Smoke/Opacity Testing</a></li>
                        <li><a href="#services">Fleet Testing</a></li>
                        <li><a href="#services">RV/Motorhome Testing</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Service Area</h4>
                    <ul>
                        <li><a href="#service-area">Stockton</a></li>
                        <li><a href="#service-area">Lodi</a></li>
                        <li><a href="#service-area">Tracy</a></li>
                        <li><a href="#service-area">Manteca</a></li>
                        <li><a href="#service-area">San Joaquin Valley</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="https://norcalcarbmobile.com">Main Website</a></li>
                        <li><a href="https://norcalcarbmobile.com/contact">Contact Us</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="#why-mobile">Why Mobile?</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>
                    <strong>NorCal CARB Mobile LLC</strong> | CARB Tester ID: IF530523 | Licensed Emissions Testing
                </p>
                <p>
                    Serving Sacramento to Stockton corridor: Stockton, Lodi, Tracy, Manteca, and the San Joaquin Valley.
                </p>
                <p>
                    &copy; 2026 Clean Truck Check Stockton. All rights reserved.
                    <a href="https://norcalcarbmobile.com" style="color: #1a8c4a; text-decoration: none;">norcalcarbmobile.com</a>
                </p>
            </div>
        </div>
    </footer>

    <!-- Schema Markup (LocalBusiness & Service) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Clean Truck Check Stockton",
        "image": "https://norcalcarbmobile.com/logo.png",
        "description": "Mobile CARB emissions testing in Stockton, CA. HD-OBD and smoke/opacity testing for trucks and fleets. Licensed CARB tester. We come to you.",
        "telephone": "916-890-4427",
        "url": "https://cleantruckcheckstockton.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Stockton",
            "addressRegion": "CA",
            "postalCode": "95202",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 37.9577,
            "longitude": -121.2908
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "Stockton",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Lodi",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Tracy",
                "addressRegion": "CA"
            },
            {
                "@type": "City",
                "name": "Manteca",
                "addressRegion": "CA"
            },
            {
                "@type": "Region",
                "name": "San Joaquin Valley",
                "addressRegion": "CA"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "47"
        },
        "sameAs": [
            "https://norcalcarbmobile.com"
        ],
        "priceRange": "$75-$300"
    }
    <\/script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "CARB Emissions Testing",
        "description": "Professional mobile CARB emissions testing in Stockton and the San Joaquin Valley. HD-OBD, smoke/opacity, and fleet testing with licensed CARB tester.",
        "provider": {
            "@type": "LocalBusiness",
            "name": "NorCal CARB Mobile LLC",
            "telephone": "916-890-4427"
        },
        "areaServed": "San Joaquin Valley, CA",
        "serviceType": ["HD-OBD Testing", "Smoke Opacity Testing", "Fleet Testing", "RV Testing"]
    }
    <\/script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is CARB testing and why do I need it?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CARB (California Air Resources Board) testing measures heavy-duty truck emissions to ensure compliance with state air quality standards. As of 2026, all trucks registered in California must undergo biannual (every 2 years) HD-OBD testing or smoke/opacity testing."
                }
            },
            {
                "@type": "Question",
                "name": "How long does CARB testing take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HD-OBD testing typically takes 30-45 minutes per vehicle. Smoke/opacity testing takes 15-30 minutes. Our mobile service comes to you, eliminating travel time and downtime."
                }
            },
            {
                "@type": "Question",
                "name": "Are you licensed and certified?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We are a licensed CARB tester with ID IF530523. Our team is certified to perform all required emissions testing under California Air Resources Board regulations."
                }
            }
        ]
    }
    <\/script>

    <!-- Interactive JavaScript -->
    <script>
        // FAQ Accordion Functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');

                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Open clicked item if it wasn't already open
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .benefit-item, .faq-item').forEach(el => {
            observer.observe(el);
        });

        // Track scroll for header shadow
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            header.style.boxShadow = scrollTop > 100
                ? '0 2px 15px rgba(0, 0, 0, 0.4)'
                : '0 2px 10px rgba(0, 0, 0, 0.3)';
        });

        console.log('Clean Truck Check Stockton - Page Loaded');
        console.log('CARB Tester ID: IF530523');
        console.log('Contact: 916-890-4427');
    <\/script>
</body>
</html>`;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
};
export {
  worker_default as default
};
