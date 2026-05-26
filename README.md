# Utility & Broadband Cost Calculator

A premium, New Zealand-focused single-page web application designed to accurately compare multi-service utility bundles (Electricity, Gas, and Broadband). 

Unlike generic online calculators, this tool replicates real-world NZ retail billing structures and handles component-level tax treatments to provide true apple-to-apples cost comparisons.

## 🚀 Key Features

* **Unified Cents-Only Input:** Standardizes all utility billing entry fields (daily fixed lines, variable charges, and regulatory levies) into standard **Cents (c)** to match the raw unit pricing layouts seen on modern NZ invoices.
* **Component-Level Tax Logic:** Allows users to dynamically toggle whether individual service segments (Electricity, Gas, Broadband, or Bundle Incentives) are computed as **GST Exclusive (+15%)** or **GST Inclusive**.
* **Precise Retail Invoice Rounding:** Replicates power company database math by rounding individual line items to two decimal places *before* adding GST and subtracting solar credits, ensuring your digital calculations match your physical bill.
* **Granular Levy Integration:** Independently accounts for specific New Zealand regulatory utility overheads, including the **Electricity Authority (EA) Levy** (per day or per kWh) and the **Gas Industry Co (GIC) Levy**.
* **Zero-GST Solar Offsets:** Isolates solar buy-back generation rates to subtract them cleanly from final post-GST aggregates, preventing unintended credit inflation.
* **Automated Cost Sorting:** Instantly calculates and re-sorts option panels to automatically pin the cheapest provider configuration to the absolute top of your summary matrix.
* **Data Portability:** Features full local import and export controls to download or restore custom configuration parameters securely as portable `.json` files.

## 📊 Why Use This Tool?

Standard calculators often fail to match real utility statements because power companies calculate bills in a specific sequence:
1. They calculate each individual charge (like daily fixed charges vs. your actual usage).
2. They round each of those specific lines to the nearest cent.
3. They apply GST to that rounded subtotal.

This dashboard mirrors that exact line-by-line decimal behavior for both **Electricity** and **Gas**, resolving the common "few cents mismatch" caused by basic spreadsheets.

> 💡 **Note on Gas Variance:** Gas statements trace usage via volume (m³) converted to energy (kWh) using a multi-digit calculation on the provider's backend database. This app accounts for minor rounding differences gracefully by letting you compare standard kWh rates directly, with a built-in notice layout on the dashboard.

## 🛠️ Usage Instructions

1. Download or clone `index.html` to your local environment.
2. Launch the file directly in any modern web browser—no local servers, terminal setups, or external framework dependencies required.
3. Input your current billing window (days) and targeted usage metrics under the **Usage Parameters** left panel.
4. Click **+ Add Option Profile** inside the main canvas workspace to generate calculation configurations for your different providers.
5. Populate your supplier rates strictly in **Cents (c)** and review the instant sorting matrix generated at the top of the viewport.
6. Use **Export Configuration** to download your parameters to your local drive for easy access later.

## 💻 Tech Stack

* **Structure & UI:** HTML5 & CSS3 with premium, desaturated slate typography, custom micro-interactions, responsive flex-grid wrappers, and embedded SVG asset indicators.
* **Core Font Typography:** Plus Jakarta Sans (Google Fonts Integration).
* **Script Engine:** Pure Vanilla ES6 JavaScript (No external tracking matrices, Node environments, or CDN dependencies).
