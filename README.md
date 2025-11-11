# Fake Document Generator

This project is a Node.js and TypeScript-based tool for generating realistic fake documents for the purpose of benchmarking and testing AI document processing systems.

It is designed to be extensible, allowing for the addition of new document types and formats over time.

## Current Features

- **Change Order Log Generation:** The primary module generates highly varied and realistic Change Order Logs (CORs) based on real-world samples.
- **Multiple Formats:** Outputs documents in five formats: PDF, PNG, CSV, XLSX, and a "golden data" JSON.
- **Golden Data JSON:** For each generated document, a corresponding JSON file is created with the headers and rows of the table data. This is ideal for validating LLM parsing and extraction.
- **High-Fidelity Rendering:** Uses a headless browser (Playwright) to render HTML templates into pixel-perfect PDFs and images, allowing for complex layouts and styling.
- **Dynamic & Randomized Data:** Each run produces a unique set of documents with a random combination of columns, header names, and data points, ensuring a wide variety of test cases.
- **Realistic Scenarios:** The data generation logic includes rules to create more realistic documents, such as:
  - Optional, multi-line page headers that may or may not precede the main table.
  - Consistent `pcoNum` formatting within a single document.
  - Randomly skipped `pcoNum` values to simulate real-world logs.
  - Revision numbers incorporated directly into the `pcoNum` (e.g., `CO 1.1`).
  - Data consistency between `status` and date columns.

## Architecture

The generator uses a modular, four-layer architecture:

1.  **Data Generation Layer (`src/data-generation`):** Provides raw, untyped fake data using `@faker-js/faker`.
2.  **Data Shaping Layer (`src/data-shaping`):** Transforms the raw data into a structured format for a specific document type (e.g., a Change Order Log). This is where the logic for data randomization and realism resides.
3.  **HTML Templating Layer (`src/html-templates`):** Takes the shaped data and generates a complete HTML document with embedded CSS for styling.
4.  **Document Rendering Layer (`src/document-rendering`):**
    - Uses Playwright to convert the HTML template into PDFs and PNGs.
    - Uses `exceljs` and custom logic to create XLSX and CSV files.

## How to Use

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- Playwright (run `npx playwright install`)

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Generating Documents

The project is configured with an npm script to handle the entire generation process.

1.  **Run the generator:**

    ```bash
    npm run generate:cor-log
    ```

    To generate a preformatted COR log for bulk import, run:

    ```bash
    npm run generate:preformatted-cor-csv
    ```

2.  **Check the output:**
    - The `generate:cor-log` script will automatically clear and then populate the `artefacts/cor-logs` directory with a fresh batch of documents, featuring 4 different row counts and 5 different file formats.
    - The `generate:preformatted-cor-csv` script will populate the `artefacts/preformatted-cor-logs` directory with a single CSV file containing 80 rows of data.

## Extending the Generator

To add a new document type (e.g., "Invoice"):

1.  Add a new interface for the document data to `src/types.ts`.
2.  Create a new data shaper function in `src/data-shaping/generate-invoice.ts`.
3.  Create a new HTML template in `src/html-templates/invoice-template.ts`.
4.  Create a new main script in `src/generate-invoice.ts`.
5.  Add a new script to `package.json`: `"generate:invoice": "npm run build && node dist/generate-invoice.js"`.
