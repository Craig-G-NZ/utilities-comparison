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
          <label>Provider name</label>
          <input type="text" class="prov-name" placeholder="e.g. Contact Energy" data-calc>
        </div>
        <div class="form-field">
          <label>Plan label</label>
          <input type="text" class="prov-plan" placeholder="e.g. Freedom Bundle" data-calc>
        </div>
      </div>
      <button type="button" class="btn btn--danger" data-remove-provider>Remove</button>
    </div>

    <p class="form-section-title">Electricity pricing (cents)</p>
    <div class="form-row form-row--5">
      <div class="form-field">
        <label>Daily fixed (c/day)</label>
        <input type="number" class="prov-daily-elec" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>Import (c/kWh)</label>
        <input type="number" class="prov-kwh-elec" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>Solar export (c/kWh)</label>
        <input type="number" class="prov-kwh-export" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>EA levy (c/unit)</label>
        <input type="number" class="prov-ea-levy-rate" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>EA levy basis</label>
        <select class="prov-ea-levy-type" data-calc>
          <option value="kwh">Per import kWh</option>
          <option value="day">Per day fixed</option>
        </select>
      </div>
    </div>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>Electricity GST</label>
        <select class="prov-gst-elec" data-calc>
          <option value="excl">GST exclusive (+15%)</option>
          <option value="incl">GST inclusive</option>
        </select>
      </div>
    </div>

    <p class="form-section-title">Gas pricing (cents)</p>
    <div class="form-row form-row--4">
      <div class="form-field">
        <label>Daily fixed (c/day)</label>
        <input type="number" class="prov-daily-gas" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>Usage energy (c/kWh)</label>
        <input type="number" class="prov-kwh-gas" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>GIC daily levy (c/day)</label>
        <input type="number" class="prov-gic-levy" step="0.001" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>Gas GST</label>
        <select class="prov-gst-gas" data-calc>
          <option value="excl">GST exclusive (+15%)</option>
          <option value="incl">GST inclusive</option>
        </select>
      </div>
    </div>

    <p class="form-section-title">Broadband add-on</p>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>Monthly subscription ($)</label>
        <input type="number" class="prov-net-monthly" step="0.01" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>Broadband GST</label>
        <select class="prov-gst-net" data-calc>
          <option value="incl">GST inclusive</option>
          <option value="excl">GST exclusive (+15%)</option>
        </select>
      </div>
    </div>

    <p class="form-section-title form-section-title--danger">Bundle incentives</p>
    <div class="form-row form-row--2">
      <div class="form-field">
        <label>Plan discount ($)</label>
        <input type="number" class="prov-discount-value" step="0.01" placeholder="0" data-calc>
      </div>
      <div class="form-field">
        <label>GST on discount</label>
        <select class="prov-gst-discount" data-calc>
          <option value="incl">GST inclusive value</option>
          <option value="excl">GST exclusive (+15%)</option>
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

function calculateCosts() {
  const daysElec = parseFloat(document.getElementById("days-elec").value) || 0;
  const kwhElec = parseFloat(document.getElementById("kwh-elec").value) || 0;
  const kwhExport = parseFloat(document.getElementById("kwh-export").value) || 0;
  const daysGas = parseFloat(document.getElementById("days-gas").value) || 0;
  const kwhGas = parseFloat(document.getElementById("kwh-gas").value) || 0;

  const providerBlocks = document.getElementsByClassName("provider-card");
  const recordsList = [];

  for (const block of providerBlocks) {
    const name = block.querySelector(".prov-name").value || "";
    const plan = block.querySelector(".prov-plan").value || "";

    const gstElecMod = block.querySelector(".prov-gst-elec").value === "excl" ? GST_RATE : 1.0;
    const gstGasMod = block.querySelector(".prov-gst-gas").value === "excl" ? GST_RATE : 1.0;
    const gstNetMod = block.querySelector(".prov-gst-net").value === "excl" ? GST_RATE : 1.0;
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

    const netMonthlyCost = parseFloat(block.querySelector(".prov-net-monthly").value) || 0;
    const totalNet = roundToCent(netMonthlyCost * gstNetMod);

    const rawDiscountValue = parseFloat(block.querySelector(".prov-discount-value").value) || 0;
    const finalDiscountDeduction = roundToCent(rawDiscountValue * gstDiscountMod);
    const finalCombinedSum = totalElec + totalGas + totalNet - finalDiscountDeduction;

    recordsList.push({
      title: (name || plan) ? `${name}${plan ? " (" + plan + ")" : ""}` : "Unnamed profile",
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
      '<tr><td colspan="6" class="empty-state-cell">No options configured. Click “Add provider” to begin.</td></tr>';
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
        ${isCheapest ? '<span class="badge">Cheapest</span>' : ""}
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
      }

      document.getElementById("providers-container").innerHTML = "";

      if (Array.isArray(data.providers)) {
        data.providers.forEach((pData) => addProviderBlock(pData));
      }

      calculateCosts();
      event.target.value = "";
    } catch {
      alert("Invalid configuration file structure.");
    }
  };
  reader.readAsText(file);
}

function init() {
  document.getElementById("add-provider-btn").addEventListener("click", () => addProviderBlock());
  document.getElementById("export-btn").addEventListener("click", exportData);
  document.getElementById("import-file").addEventListener("change", importData);

  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-calc], #days-elec, #kwh-elec, #kwh-export, #days-gas, #kwh-gas")) {
      calculateCosts();
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-calc], #days-elec, #kwh-elec, #kwh-export, #days-gas, #kwh-gas")) {
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
