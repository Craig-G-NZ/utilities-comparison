let providerCount = 0;
const GST_RATE = 1.15;

function roundToCent(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function providerTemplate(id) {
  return `
    <div class="provider-card__header">
      <div class="form-row form-row--2">
        <div class="form-field">
          <label>
            Retailer
            <span class="field-hint">Who supplies this option</span>
          </label>
          <input type="text" class="prov-name" placeholder="e.g. Contact Energy" data-calc>
        </div>
        <div class="form-field">
          <label>
            Plan name
            <span class="field-hint">Helps tell similar deals apart in the table</span>
          </label>
          <input type="text" class="prov-plan" placeholder="e.g. Freedom Bundle" data-calc>
        </div>
      </div>
      <button type="button" class="btn btn--danger" data-remove-provider>Remove this plan</button>
    </div>

    <p class="form-section-title">Electricity rates</p>
    <p class="form-section-blurb">Enter rates in cents as shown on the bill or fact sheet. GST setting should match how the retailer quotes the line item.</p>
    <div class="form-row form-row--5">
      <div class="form-field">
        <label>
          Daily charge (c/day)
          <span class="field-hint">Fixed daily fee</span>
        </label>
        <input type="number" class="prov-daily-elec" step="0.001" placeholder="e.g. 195" data-calc>
      </div>
      <div class="form-field">
        <label>
          Import rate (c/kWh)
          <span class="field-hint">Per kWh you buy from the grid</span>
        </label>
        <input type="number" class="prov-kwh-elec" step="0.001" placeholder="e.g. 28.5" data-calc>
      </div>
      <div class="form-field">
        <label>
          Solar buy-back (c/kWh)
          <span class="field-hint">Credit per exported kWh; 0 if none</span>
        </label>
        <input type="number" class="prov-kwh-export" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>
          EA levy (c)
          <span class="field-hint">Electricity Authority levy amount</span>
        </label>
        <input type="number" class="prov-ea-levy-rate" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>
          EA levy applies to
          <span class="field-hint">How the levy is calculated</span>
        </label>
        <select class="prov-ea-levy-type" data-calc>
          <option value="kwh">Each import kWh</option>
          <option value="day">Each day in the period</option>
        </select>
      </div>
    </div>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>
          Electricity GST
          <span class="field-hint">Whether rates above include 15% GST</span>
        </label>
        <select class="prov-gst-elec" data-calc>
          <option value="excl">Exclusive — add 15%</option>
          <option value="incl">Inclusive — already includes GST</option>
        </select>
      </div>
    </div>

    <p class="form-section-title">Gas rates</p>
    <p class="form-section-blurb">Same idea: cents from the gas invoice. GIC is the gas industry levy if it appears as a daily charge.</p>
    <div class="form-row form-row--4">
      <div class="form-field">
        <label>
          Daily charge (c/day)
          <span class="field-hint">Fixed daily gas fee</span>
        </label>
        <input type="number" class="prov-daily-gas" step="0.001" placeholder="e.g. 145" data-calc>
      </div>
      <div class="form-field">
        <label>
          Energy rate (c/kWh)
          <span class="field-hint">Variable usage charge</span>
        </label>
        <input type="number" class="prov-kwh-gas" step="0.001" placeholder="e.g. 12.8" data-calc>
      </div>
      <div class="form-field">
        <label>
          GIC levy (c/day)
          <span class="field-hint">Gas Industry Company levy; 0 if N/A</span>
        </label>
        <input type="number" class="prov-gic-levy" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>
          Gas GST
          <span class="field-hint">Whether gas rates include GST</span>
        </label>
        <select class="prov-gst-gas" data-calc>
          <option value="excl">Exclusive — add 15%</option>
          <option value="incl">Inclusive — already includes GST</option>
        </select>
      </div>
    </div>

    <p class="form-section-title">Broadband override</p>
    <p class="form-section-blurb">Optional. Leave blank to use the monthly internet cost from Your usage. Enter a value to use this plan’s bundled price instead ($0 for power/gas only).</p>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>
          Monthly fee ($)
          <span class="field-hint">Advertised plan price per month</span>
        </label>
        <input type="number" class="prov-net-monthly" step="0.01" placeholder="Uses usage internet" data-calc>
      </div>
      <div class="form-field">
        <label>
          Broadband GST
          <span class="field-hint">Whether the monthly fee includes GST</span>
        </label>
        <select class="prov-gst-net" data-calc>
          <option value="incl">Inclusive — price includes GST</option>
          <option value="excl">Exclusive — add 15%</option>
        </select>
      </div>
    </div>

    <p class="form-section-title form-section-title--danger">Bundle discount</p>
    <p class="form-section-blurb">Multi-fuel or loyalty credits in dollars — subtracted from the combined total (e.g. “$20 off when you bundle”).</p>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>
          Discount amount ($)
          <span class="field-hint">Dollar value of the incentive; 0 if none</span>
        </label>
        <input type="number" class="prov-discount-value" step="0.01" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>
          Discount GST
          <span class="field-hint">Whether the stated discount includes GST</span>
        </label>
        <select class="prov-gst-discount" data-calc>
          <option value="incl">Inclusive — amount includes GST</option>
          <option value="excl">Exclusive — add 15% before deducting</option>
        </select>
      </div>
    </div>
  `;
}

function addProviderBlock(savedData = null) {
  providerCount++;
  const container = document.getElementById("providers-container");
  const id = providerCount;
  const div = document.createElement("div");
  div.className = "provider-card";
  div.id = `provider-block-${id}`;
  div.dataset.providerId = String(id);
  div.innerHTML = providerTemplate(id);

  if (container.firstChild) {
    container.insertBefore(div, container.firstChild);
  } else {
    container.appendChild(div);
  }

  if (savedData) {
    blockFill(div, savedData);
  }

  calculateCosts();
}

function blockFill(block, data) {
  block.querySelector(".prov-name").value = data.name || "";
  block.querySelector(".prov-plan").value = data.plan || "";
  block.querySelector(".prov-daily-elec").value = data.dailyElec || "";
  block.querySelector(".prov-kwh-elec").value = data.kwhElecRate || "";
  block.querySelector(".prov-kwh-export").value = data.kwhExportRate || "";
  block.querySelector(".prov-ea-levy-rate").value = data.eaLevyRate || "";
  block.querySelector(".prov-ea-levy-type").value = data.eaLevyType || "kwh";
  block.querySelector(".prov-gst-elec").value = data.gstElec || "excl";
  block.querySelector(".prov-daily-gas").value = data.dailyGas || "";
  block.querySelector(".prov-kwh-gas").value = data.kwhGasRate || "";
  block.querySelector(".prov-gic-levy").value = data.gicLevyRate || "";
  block.querySelector(".prov-gst-gas").value = data.gstGas || "excl";
  block.querySelector(".prov-net-monthly").value = data.netMonthlyCost || "";
  block.querySelector(".prov-gst-net").value = data.gstNet || "incl";
  block.querySelector(".prov-discount-value").value = data.rawDiscountValue || "";
  block.querySelector(".prov-gst-discount").value = data.gstDiscount || "incl";
}

function removeBlock(id) {
  const block = document.getElementById(id);
  if (block) {
    block.remove();
    calculateCosts();
  }
}

function resolveBroadbandCost(planNetInput, planGstNet, usageNetMonthly, usageGstNetMod) {
  if (planNetInput !== "") {
    const planNet = parseFloat(planNetInput) || 0;
    const planGstMod = planGstNet === "excl" ? GST_RATE : 1.0;
    return roundToCent(planNet * planGstMod);
  }
  return roundToCent(usageNetMonthly * usageGstNetMod);
}

function calculateCosts() {
  const daysElec = parseFloat(document.getElementById("days-elec").value) || 0;
  const kwhElec = parseFloat(document.getElementById("kwh-elec").value) || 0;
  const kwhExport = parseFloat(document.getElementById("kwh-export").value) || 0;
  const daysGas = parseFloat(document.getElementById("days-gas").value) || 0;
  const kwhGas = parseFloat(document.getElementById("kwh-gas").value) || 0;
  const usageNetMonthly = parseFloat(document.getElementById("net-monthly-usage").value) || 0;
  const usageGstNetMod =
    document.getElementById("gst-net-usage").value === "excl" ? GST_RATE : 1.0;

  const providerBlocks = document.getElementsByClassName("provider-card");
  const recordsList = [];

  for (const block of providerBlocks) {
    const name = block.querySelector(".prov-name").value || "";
    const plan = block.querySelector(".prov-plan").value || "";

    const gstElecMod = block.querySelector(".prov-gst-elec").value === "excl" ? GST_RATE : 1.0;
    const gstGasMod = block.querySelector(".prov-gst-gas").value === "excl" ? GST_RATE : 1.0;
    const gstDiscountMod = block.querySelector(".prov-gst-discount").value === "excl" ? GST_RATE : 1.0;

    const dailyElecRate = (parseFloat(block.querySelector(".prov-daily-elec").value) || 0) / 100;
    const kwhElecRate = (parseFloat(block.querySelector(".prov-kwh-elec").value) || 0) / 100;
    const kwhExportRate = (parseFloat(block.querySelector(".prov-kwh-export").value) || 0) / 100;
    const eaLevyRate = (parseFloat(block.querySelector(".prov-ea-levy-rate").value) || 0) / 100;
    const eaLevyType = block.querySelector(".prov-ea-levy-type").value;

    const lineElecDaily = roundToCent(dailyElecRate * daysElec);
    const lineElecUsage = roundToCent(kwhElecRate * kwhElec);
    const lineEALevy = roundToCent(eaLevyType === "kwh" ? eaLevyRate * kwhElec : eaLevyRate * daysElec);

    const grossElecBeforeGST = lineElecDaily + lineElecUsage + lineEALevy;
    let totalElec = roundToCent(grossElecBeforeGST * gstElecMod);
    const lineSolarCredit = roundToCent(kwhExportRate * kwhExport);
    totalElec -= lineSolarCredit;

    const dailyGasRate = (parseFloat(block.querySelector(".prov-daily-gas").value) || 0) / 100;
    const kwhGasRate = (parseFloat(block.querySelector(".prov-kwh-gas").value) || 0) / 100;
    const gicLevyRate = (parseFloat(block.querySelector(".prov-gic-levy").value) || 0) / 100;

    const lineGasDaily = roundToCent(dailyGasRate * daysGas);
    const lineGasUsage = roundToCent(kwhGasRate * kwhGas);
    const lineGicLevy = roundToCent(gicLevyRate * daysGas);
    const gasSubtotal = lineGasDaily + lineGasUsage + lineGicLevy;
    const totalGas = roundToCent(gasSubtotal * gstGasMod);

    const planNetInput = block.querySelector(".prov-net-monthly").value;
    const planGstNet = block.querySelector(".prov-gst-net").value;
    const totalNet = resolveBroadbandCost(
      planNetInput,
      planGstNet,
      usageNetMonthly,
      usageGstNetMod
    );

    const rawDiscountValue = parseFloat(block.querySelector(".prov-discount-value").value) || 0;
    const finalDiscountDeduction = roundToCent(rawDiscountValue * gstDiscountMod);
    const finalCombinedSum = totalElec + totalGas + totalNet - finalDiscountDeduction;

    recordsList.push({
      title: (name || plan) ? `${name}${plan ? " (" + plan + ")" : ""}` : "Unnamed plan",
      elec: totalElec,
      gas: totalGas,
      net: totalNet,
      discount: finalDiscountDeduction,
      total: finalCombinedSum,
    });
  }

  recordsList.sort((a, b) => a.total - b.total);
  renderResults(recordsList);
  renderStats(recordsList);
}

function renderResults(recordsList) {
  const tbody = document.getElementById("results-body");
  tbody.innerHTML = "";

  if (recordsList.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="empty-state-cell"><strong>No plans yet.</strong> Add your usage below, then click <strong>Add plan</strong> to enter a retailer’s rates.</td></tr>';
    return;
  }

  recordsList.forEach((res, index) => {
    const isCheapest = index === 0 && recordsList.length > 1;
    const tr = document.createElement("tr");
    if (isCheapest) tr.className = "row-highlight";

    const discountCell =
      res.discount > 0
        ? `<td class="col-numeric col-discount">−$${res.discount.toFixed(2)}</td>`
        : '<td class="col-numeric" style="color:var(--ink-faint)">$0.00</td>';

    tr.innerHTML = `
      <td>
        ${escapeHtml(res.title)}
        ${isCheapest ? '<span class="badge">Best price</span>' : ""}
      </td>
      <td class="col-numeric">$${res.elec.toFixed(2)}</td>
      <td class="col-numeric">$${res.gas.toFixed(2)}</td>
      <td class="col-numeric">$${res.net.toFixed(2)}</td>
      ${discountCell}
      <td class="col-numeric col-total">$${res.total.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderStats(recordsList) {
  const statsBar = document.getElementById("stats-bar");
  if (recordsList.length === 0) {
    statsBar.hidden = true;
    return;
  }

  statsBar.hidden = false;
  const cheapest = recordsList[0];
  const priciest = recordsList[recordsList.length - 1];
  const spread =
    recordsList.length > 1 ? roundToCent(priciest.total - cheapest.total) : 0;

  document.getElementById("stat-cheapest").textContent = `$${cheapest.total.toFixed(2)}`;
  document.getElementById("stat-providers").textContent = String(recordsList.length);
  document.getElementById("stat-spread").textContent =
    recordsList.length > 1 ? `$${spread.toFixed(2)}` : "—";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function exportData() {
  const payload = {
    usage: {
      daysElec: document.getElementById("days-elec").value,
      kwhElec: document.getElementById("kwh-elec").value,
      kwhExport: document.getElementById("kwh-export").value,
      daysGas: document.getElementById("days-gas").value,
      kwhGas: document.getElementById("kwh-gas").value,
      netMonthly: document.getElementById("net-monthly-usage").value,
      gstNet: document.getElementById("gst-net-usage").value,
    },
    providers: [],
  };

  const blocks = document.getElementsByClassName("provider-card");
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    payload.providers.push({
      name: block.querySelector(".prov-name").value,
      plan: block.querySelector(".prov-plan").value,
      dailyElec: block.querySelector(".prov-daily-elec").value,
      kwhElecRate: block.querySelector(".prov-kwh-elec").value,
      kwhExportRate: block.querySelector(".prov-kwh-export").value,
      eaLevyRate: block.querySelector(".prov-ea-levy-rate").value,
      eaLevyType: block.querySelector(".prov-ea-levy-type").value,
      gstElec: block.querySelector(".prov-gst-elec").value,
      dailyGas: block.querySelector(".prov-daily-gas").value,
      kwhGasRate: block.querySelector(".prov-kwh-gas").value,
      gicLevyRate: block.querySelector(".prov-gic-levy").value,
      gstGas: block.querySelector(".prov-gst-gas").value,
      netMonthlyCost: block.querySelector(".prov-net-monthly").value,
      gstNet: block.querySelector(".prov-gst-net").value,
      rawDiscountValue: block.querySelector(".prov-discount-value").value,
      gstDiscount: block.querySelector(".prov-gst-discount").value,
    });
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `utility-config-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (data.usage) {
        document.getElementById("days-elec").value = data.usage.daysElec || "";
        document.getElementById("kwh-elec").value = data.usage.kwhElec || "";
        document.getElementById("kwh-export").value = data.usage.kwhExport || "";
        document.getElementById("days-gas").value = data.usage.daysGas || "";
        document.getElementById("kwh-gas").value = data.usage.kwhGas || "";
        document.getElementById("net-monthly-usage").value = data.usage.netMonthly || "";
        document.getElementById("gst-net-usage").value = data.usage.gstNet || "incl";
      }

      document.getElementById("providers-container").innerHTML = "";

      if (Array.isArray(data.providers)) {
        data.providers.forEach((pData) => addProviderBlock(pData));
      }

      calculateCosts();
      event.target.value = "";
    } catch {
      alert(
        "That file doesn’t look like a saved comparison. Choose a JSON file you exported from this tool."
      );
    }
  };
  reader.readAsText(file);
}

function init() {
  document.getElementById("add-provider-btn").addEventListener("click", () => addProviderBlock());
  document.getElementById("export-btn").addEventListener("click", exportData);
  document.getElementById("import-file").addEventListener("change", importData);

  document.addEventListener("input", (e) => {
    if (
      e.target.matches(
        "[data-calc], #days-elec, #kwh-elec, #kwh-export, #days-gas, #kwh-gas, #net-monthly-usage, #gst-net-usage"
      )
    ) {
      calculateCosts();
    }
  });

  document.addEventListener("change", (e) => {
    if (
      e.target.matches(
        "[data-calc], #days-elec, #kwh-elec, #kwh-export, #days-gas, #kwh-gas, #net-monthly-usage, #gst-net-usage"
      )
    ) {
      calculateCosts();
    }
  });

  document.getElementById("providers-container").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-provider]");
    if (!btn) return;
    const card = btn.closest(".provider-card");
    if (card) removeBlock(card.id);
  });

  calculateCosts();
}

document.addEventListener("DOMContentLoaded", init);
