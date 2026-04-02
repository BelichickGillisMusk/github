// worker.js - VIN Check Widget for NorCal CARB Mobile
var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API endpoint - decode VIN via NHTSA
    if (url.pathname === '/api/vin' && url.searchParams.get('vin')) {
      const vin = url.searchParams.get('vin').toUpperCase().trim();

      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return new Response(JSON.stringify({ error: 'Invalid VIN. Must be 17 characters (no I, O, or Q).' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      try {
        const resp = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`);
        const data = await resp.json();
        const r = data.Results[0];

        const year = parseInt(r.ModelYear) || null;
        const make = r.Make || 'Unknown';
        const model = r.Model || 'Unknown';
        const fuelType = r.FuelTypePrimary || 'Unknown';
        const gvwr = r.GVWR || '';
        const vehicleType = r.VehicleType || '';
        const bodyClass = r.BodyClass || '';
        const engineCylinders = r.EngineCylinders || '';
        const displacementL = r.DisplacementL || '';
        const driveType = r.DriveType || '';
        const errorCode = r.ErrorCode || '0';

        // Parse GVWR to determine weight class
        let gvwrLbs = 0;
        const gvwrMatch = gvwr.match(/([\d,]+)\s*(?:lb|pound)/i);
        if (gvwrMatch) gvwrLbs = parseInt(gvwrMatch[1].replace(/,/g, ''));
        // NHTSA sometimes returns ranges like "Class 6: 19,501 - 26,000 lb"
        const classMatch = gvwr.match(/Class\s+(\d+)/i);
        let weightClass = classMatch ? parseInt(classMatch[1]) : 0;
        if (!weightClass && gvwrLbs > 0) {
          if (gvwrLbs <= 6000) weightClass = 1;
          else if (gvwrLbs <= 10000) weightClass = 2;
          else if (gvwrLbs <= 14000) weightClass = 3;
          else if (gvwrLbs <= 16000) weightClass = 4;
          else if (gvwrLbs <= 19500) weightClass = 5;
          else if (gvwrLbs <= 26000) weightClass = 6;
          else if (gvwrLbs <= 33000) weightClass = 7;
          else weightClass = 8;
        }

        const isHeavyDuty = weightClass >= 4 || gvwrLbs > 14000;
        const isDiesel = /diesel/i.test(fuelType);
        const isAltFuel = /natural gas|propane|lpg|cng|lng/i.test(fuelType);
        const needsCTC = isHeavyDuty && (isDiesel || isAltFuel);

        let testType = 'none';
        let testPrice = null;
        let recommendation = '';

        if (!needsCTC) {
          if (!isHeavyDuty) {
            recommendation = `This vehicle (GVWR ${gvwr || 'under 14,001 lbs'}) is below the 14,001 lb threshold for CARB's Clean Truck Check program. No HD I/M testing required.`;
          } else {
            recommendation = `This vehicle runs on ${fuelType}. The Clean Truck Check program applies to diesel and select alternative fuel vehicles. Contact us to confirm your requirements.`;
          }
        } else {
          const isRV = /motorhome|rv|motor\s*home|recreational/i.test(bodyClass) || /motorhome|rv/i.test(vehicleType);

          if (isRV) {
            testType = 'rv';
            testPrice = 300;
            recommendation = `Motorhome/RV over 14,000 lbs — requires annual CARB Clean Truck Check. We come to you.`;
          } else if (year && year >= 2013) {
            testType = 'obd';
            testPrice = 75;
            recommendation = `${year} ${make} ${model} — requires OBD plug-in Clean Truck Check (HD-OBD). Quick, non-invasive on-site test.`;
          } else if (year && year < 2013) {
            testType = 'opacity';
            testPrice = 250;
            recommendation = `${year} ${make} ${model} — requires SAE J1667 smoke opacity test. We bring the equipment to your location.`;
          } else {
            testType = 'contact';
            recommendation = `${make} ${model} — likely requires CARB Clean Truck Check. Contact us to determine the exact test needed.`;
          }
        }

        return new Response(JSON.stringify({
          vin,
          year,
          make,
          model,
          fuelType,
          gvwr,
          weightClass: weightClass || null,
          vehicleType,
          bodyClass,
          engineCylinders,
          displacementL,
          isHeavyDuty,
          needsCTC,
          testType,
          testPrice,
          recommendation
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Unable to decode VIN. Please try again.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Widget HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Free VIN Check — See if your vehicle needs CARB Clean Truck Check testing. Instant results from NorCal CARB Mobile.">
    <title>VIN Check — NorCal CARB Mobile</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg: #f8fafc;
            --card: #ffffff;
            --card-border: rgba(30, 64, 124, 0.15);
            --accent: #1e407c;
            --accent-glow: rgba(30, 64, 124, 0.12);
            --accent-hover: #16325f;
            --green: #16a34a;
            --green-bg: rgba(22, 163, 74, 0.08);
            --yellow: #ca8a04;
            --yellow-bg: rgba(202, 138, 4, 0.08);
            --red: #dc2626;
            --blue: #2563eb;
            --text: #1e293b;
            --text-dim: #64748b;
            --input-bg: #f1f5f9;
        }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }

        .widget {
            width: 100%;
            max-width: 420px;
            background: var(--card);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(30, 64, 124, 0.08);
        }

        .widget-header {
            padding: 20px 24px 16px;
            border-bottom: 1px solid rgba(30, 64, 124, 0.08);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .widget-icon {
            width: 40px;
            height: 40px;
            background: var(--accent-glow);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .widget-title {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .widget-subtitle {
            font-size: 11px;
            color: var(--text-dim);
            margin-top: 2px;
        }

        .widget-body {
            padding: 20px 24px 24px;
        }

        .input-group {
            position: relative;
            margin-bottom: 12px;
        }

        .vin-input {
            width: 100%;
            padding: 14px 16px;
            background: var(--input-bg);
            border: 1.5px solid rgba(30, 64, 124, 0.15);
            border-radius: 12px;
            color: var(--text);
            font-family: 'JetBrains Mono', monospace;
            font-size: 15px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .vin-input::placeholder {
            color: rgba(100, 116, 139, 0.6);
            font-family: 'Inter', sans-serif;
            letter-spacing: 0;
            text-transform: none;
            font-size: 13px;
        }

        .vin-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .char-count {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            color: var(--text-dim);
            font-family: 'JetBrains Mono', monospace;
            pointer-events: none;
            transition: color 0.2s;
        }

        .char-count.complete { color: var(--green); }
        .char-count.over { color: var(--red); }

        .check-btn {
            width: 100%;
            padding: 14px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .check-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .check-btn:active { transform: translateY(0); }
        .check-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .spinner {
            width: 16px; height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Results */
        .result { display: none; margin-top: 16px; animation: fadeIn 0.3s ease; }
        .result.show { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .vehicle-card {
            background: var(--input-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
        }

        .vehicle-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
            letter-spacing: -0.3px;
        }

        .vehicle-detail {
            font-size: 12px;
            color: var(--text-dim);
            line-height: 1.6;
        }

        .specs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
        }

        .spec {
            background: var(--input-bg);
            padding: 8px 10px;
            border-radius: 8px;
        }

        .spec-label {
            font-size: 10px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .spec-value {
            font-size: 13px;
            font-weight: 600;
            margin-top: 2px;
        }

        .verdict {
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
        }

        .verdict.needs-test {
            background: var(--yellow-bg);
            border: 1px solid rgba(234, 179, 8, 0.2);
        }

        .verdict.no-test {
            background: var(--green-bg);
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .verdict-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .verdict-badge {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 3px 8px;
            border-radius: 6px;
        }

        .verdict.needs-test .verdict-badge {
            background: rgba(202, 138, 4, 0.15);
            color: var(--yellow);
        }

        .verdict.no-test .verdict-badge {
            background: rgba(22, 163, 74, 0.15);
            color: var(--green);
        }

        .verdict-text {
            font-size: 13px;
            line-height: 1.5;
            color: var(--text);
        }

        .price-tag {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(30, 64, 124, 0.08);
            color: var(--accent);
            font-weight: 700;
            font-size: 20px;
            padding: 6px 14px;
            border-radius: 8px;
            margin-top: 8px;
        }

        .price-label {
            font-size: 11px;
            font-weight: 500;
            color: var(--text-dim);
            margin-left: 4px;
        }

        .cta-btn {
            display: block;
            width: 100%;
            padding: 14px;
            background: var(--green);
            color: white;
            border: none;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s;
        }

        .cta-btn:hover { background: #15803d; transform: translateY(-1px); }

        .error-msg {
            background: rgba(220, 38, 38, 0.06);
            border: 1px solid rgba(220, 38, 38, 0.15);
            color: var(--red);
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            margin-top: 12px;
            display: none;
        }

        .error-msg.show { display: block; animation: fadeIn 0.3s ease; }

        .powered-by {
            text-align: center;
            padding: 12px;
            font-size: 10px;
            color: var(--text-dim);
            border-top: 1px solid rgba(30, 64, 124, 0.08);
        }

        .powered-by a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
        }

        /* Embed mode - no background */
        @media (max-width: 460px) {
            body { padding: 0; }
            .widget { border-radius: 0; border: none; max-width: 100%; }
        }
    </style>
</head>
<body>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-icon">🔍</div>
            <div>
                <div class="widget-title">VIN Lookup</div>
                <div class="widget-subtitle">Check if your vehicle needs CARB testing</div>
            </div>
        </div>
        <div class="widget-body">
            <div class="input-group">
                <input type="text" class="vin-input" id="vinInput" maxlength="17"
                       placeholder="Enter 17-character VIN"
                       autocomplete="off" spellcheck="false">
                <span class="char-count" id="charCount">0/17</span>
            </div>
            <button class="check-btn" id="checkBtn" disabled>
                <span id="btnText">Check VIN</span>
            </button>

            <div class="error-msg" id="errorMsg"></div>

            <div class="result" id="result">
                <div class="vehicle-card" id="vehicleCard"></div>
                <div id="verdictSection"></div>
                <a class="cta-btn" id="ctaBtn" href="tel:9168904427" style="display:none">
                    📞 Call 916-890-4427 — Schedule Test
                </a>
            </div>
        </div>
        <div class="powered-by">
            Courtesy of <a href="https://www.norcalcarbmobile.com" target="_blank">NorCal CARB Mobile</a> · 916-890-4427
        </div>
    </div>

    <script>
        const vinInput = document.getElementById('vinInput');
        const charCount = document.getElementById('charCount');
        const checkBtn = document.getElementById('checkBtn');
        const btnText = document.getElementById('btnText');
        const result = document.getElementById('result');
        const errorMsg = document.getElementById('errorMsg');
        const vehicleCard = document.getElementById('vehicleCard');
        const verdictSection = document.getElementById('verdictSection');
        const ctaBtn = document.getElementById('ctaBtn');

        vinInput.addEventListener('input', () => {
            const len = vinInput.value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').length;
            vinInput.value = vinInput.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '');
            charCount.textContent = len + '/17';
            charCount.className = 'char-count' + (len === 17 ? ' complete' : len > 17 ? ' over' : '');
            checkBtn.disabled = len !== 17;
        });

        vinInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !checkBtn.disabled) checkBtn.click();
        });

        checkBtn.addEventListener('click', async () => {
            const vin = vinInput.value.trim();
            if (vin.length !== 17) return;

            checkBtn.disabled = true;
            btnText.innerHTML = '<div class="spinner"></div> Checking...';
            result.classList.remove('show');
            errorMsg.classList.remove('show');

            try {
                const resp = await fetch('/api/vin?vin=' + encodeURIComponent(vin));
                const data = await resp.json();

                if (data.error) {
                    errorMsg.textContent = data.error;
                    errorMsg.classList.add('show');
                    return;
                }

                // Vehicle card
                vehicleCard.innerHTML = '<div class="vehicle-name">' +
                    (data.year || '') + ' ' + data.make + ' ' + data.model +
                    '</div>' +
                    '<div class="vehicle-detail">' + data.fuelType + (data.bodyClass ? ' · ' + data.bodyClass : '') + '</div>' +
                    '<div class="specs-grid">' +
                        '<div class="spec"><div class="spec-label">GVWR</div><div class="spec-value">' + (data.gvwr || 'N/A') + '</div></div>' +
                        '<div class="spec"><div class="spec-label">Class</div><div class="spec-value">' + (data.weightClass ? 'Class ' + data.weightClass : 'N/A') + '</div></div>' +
                        (data.engineCylinders ? '<div class="spec"><div class="spec-label">Engine</div><div class="spec-value">' + data.engineCylinders + ' cyl' + (data.displacementL ? ' · ' + parseFloat(data.displacementL).toFixed(1) + 'L' : '') + '</div></div>' : '') +
                        '<div class="spec"><div class="spec-label">Fuel</div><div class="spec-value">' + data.fuelType + '</div></div>' +
                    '</div>';

                // Verdict
                if (data.needsCTC) {
                    let priceHtml = data.testPrice ?
                        '<div class="price-tag">$' + data.testPrice + '<span class="price-label">mobile on-site</span></div>' : '';

                    verdictSection.innerHTML =
                        '<div class="verdict needs-test">' +
                            '<div class="verdict-header"><span class="verdict-badge">⚠ Testing Required</span></div>' +
                            '<div class="verdict-text">' + data.recommendation + '</div>' +
                            priceHtml +
                            '<div style="margin-top:10px;font-size:12px;color:#16a34a;font-weight:600;">✓ Free retest if you fail — just follow our code flush instructions</div>' +
                        '</div>';
                    ctaBtn.style.display = 'block';
                    ctaBtn.textContent = '📞 Call 916-890-4427 — Schedule Test';
                } else {
                    verdictSection.innerHTML =
                        '<div class="verdict no-test">' +
                            '<div class="verdict-header"><span class="verdict-badge">✓ No Testing Required</span></div>' +
                            '<div class="verdict-text">' + data.recommendation + '</div>' +
                        '</div>';
                    ctaBtn.style.display = 'none';
                }

                result.classList.add('show');
            } catch (e) {
                errorMsg.textContent = 'Unable to check VIN. Please try again.';
                errorMsg.classList.add('show');
            } finally {
                checkBtn.disabled = false;
                btnText.textContent = 'Check VIN';
            }
        });

        // Auto-focus
        vinInput.focus();
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        ...corsHeaders
      }
    });
  }
};

export default worker_default;
