# Utility & Broadband Cost Calculator

A premium, single-page analytics application designed for New Zealand consumers to accurately compare multi-service utility bundles (Electricity, Gas, and Broadband). 

Unlike generic utility calculators, this tool handles granular, component-level tax treatment (GST Inclusive vs. Exclusive) and replicates complex real-world New Zealand retail billing logic down to the exact cent.

## 🚀 Key Features

* **Unified Cents-Only Stacking:** Standardizes all utility billing entry fields (daily fixed lines, variable charges, and regulatory levies) into standard **Cents (c)** to match the raw unit pricing layouts seen on modern NZ invoices.
* **Component-Level Tax Logic:** Allows users to dynamically toggle whether individual service segments (Electricity, Gas, Broadband, or Bundle Incentives) are computed as **GST Corporate Exclusive (+15%)** or **GST Inclusive**.
* **Precise Retail Invoice Rounding:** Replicates exact power company database math by rounding individual line items to two decimal places *prior* to compounding forward taxes and subtracting un-taxed post-tax credits.
* **Granular Levy Integration:** Independently processes regulatory utility overheads, including the **Electricity Authority (EA) Levy** (calculated per day or per kWh) and the **Gas Industry Co (GIC) Levy**.
* **Zero-GST Solar Offsets:** Isolates buy-back generation rates to subtract them cleanly from final post-GST aggregates, preventing unintended credit inflation.
* **Automated Cost Stacking & Optimization:** Instantly re-sorts option panels to pin the cheapest package configuration to the absolute top of your summary matrix.
* **Data Portability:** Features full local import and export controls to download or restore custom configuration parameters securely as portable `.json` files.

## 📊 NZ Utility Billing Math Mechanics

Utility bills often look wrong when checked on a standard calculator due to **Line-Item Rounding**. This application prevents mismatches by executing calculations across isolated steps:

### Electricity Sequence (e.g., Contact Energy Logic)
1. **Daily Import Base** = $\text{Daily Fixed Rate (c)} \times \text{Days} \div 100 \rightarrow \text{Round to \$0.01}$
2. **Usage Volume Base** = $\text{Usage Rate (c)} \times \text{Import kWh} \div 100 \rightarrow \text{Round to \$0.01}$
3. **Regulatory Levy Line** = $\text{EA Levy Rate (c)} \times \text{Basis (Days or kWh)} \div 100 \rightarrow \text{Round to \$0.01}$
4. **Tax Compound Line** = $(\text{Daily} + \text{Usage} + \text{Levy}) \times 1.15 \text{ (GST Mod)} \rightarrow \text{Round to \$0.01}$
5. **Net Balance Due** = $\text{Tax Compound Line} - \text{Solar Generation Credits (Flat Un-taxed \$ Amount)}$

### Gas Sequence (e.g., Nova Energy Logic)
1. **Daily Service Cost** = $\text{Daily Gas Rate (c)} \times \text{Days} \div 100 \rightarrow \text{Round to \$0.01}$
2. **Volumetric Energy Cost** = $\text{Usage Rate (c)} \times \text{Gas Consumed kWh} \div 100 \rightarrow \text{Round to \$0.01}$
3. **Industry Levy Cost** = $\text{GIC Levy Rate (c)} \times \text{Days} \div 100 \rightarrow \text{Round to \$0.01}$
4. **Total Gas Charge** = $(\text{Daily Service} + \text{Volumetric Energy} + \text{Industry Levy}) \times 1.15 \text{ (GST Mod)}$

> 💡 **Note on Gas Variance:** Gas statements trace usage via volume ($m^3$) converted to energy ($kWh$) using a multi-digit multi-step calculation on the provider's backend database. This app accounts for line deviations by enforcing immediate standard line ceilings.

## 🛠️ Usage Instructions

1. Download or clone `index.html` to your local environment.
2. Launch the file directly in any modern browser—no standard local servers or framework dependencies are required.
3. Input your current volumetric windows and targeted usage metrics under the **Usage Parameters** left panel.
4. Click **+ Add Option Profile** inside the main canvas workspace to generate calculation configurations for your providers.
5. Populate your supplier rates strictly in **Cents (c)** and review the instant sorting matrix generated at the top of the viewport.
6. Use **Export Configuration** to download your session parameters to your local drive for later comparisons.

## 💻 Tech Stack

* **Structure & UI:** HTML5 & CSS3 with premium, desaturated slate typography, custom micro-interactions, responsive flex-grid wrappers, and embedded SVG asset indicators.
* **Core Font Typography:** Plus Jakarta Sans (Google Fonts Integration).
* **Script Engine:** Pure Vanilla ES6 JavaScript (No external tracking matrices, Node environments, or CDN dependencies).
