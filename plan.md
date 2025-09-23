# Document Generator Plan (v3)

This document outlines the plan to create a modular and scalable document generator. The architecture has been updated to leverage a headless browser for high-fidelity PDF and image rendering.

## Core Architecture

1.  **Data Generation Layer:** Generates raw, untyped fake data using `faker.js`.
2.  **Data Shaping Layer:** Transforms raw data into a specific, structured format (e.g., a change order log).
3.  **HTML Templating Layer:** Takes shaped data and generates an HTML string with embedded CSS for styling and layout.
4.  **Document Rendering Layer:** Renders data into various formats.
    - For PDF/Image: Uses a headless browser (`playwright`) to convert the generated HTML into documents.
    - For other formats (CSV, XLSX): Uses specialized libraries as before.

## Phase 1: Change Order Log Implementation (Refactored)

This phase will focus on refactoring the existing implementation to use the new headless browser architecture.

### Core Technologies

- Node.js, TypeScript, Faker.js
- **Playwright** (for headless browser rendering)
- ExcelJS (for XLSX)

### Development Steps

1.  **Project Setup:**

    - Install `playwright` dependency.
    - Create a new directory for HTML templates (e.g., `src/html-templates`).

2.  **Data Generation & Shaping Layers:**

    - These layers remain unchanged.

3.  **HTML Templating Layer (`src/html-templates`):**

    - Create a `changeOrderLogTemplate` function.
    - This function will take the shaped data and return a complete HTML document as a string, including CSS for landscape layout, table styling, and page breaks.

4.  **Document Rendering Layer (`src/document-rendering`):**

    - **Refactor `toPdf`:**
      - Launch Playwright.
      - Generate HTML using the new template.
      - Set the page content to the generated HTML.
      - Use `page.pdf()` to create a landscape PDF with proper pagination.
    - **Refactor `toImage`:**
      - Launch Playwright.
      - Generate HTML.
      - Set page content.
      - Use `page.screenshot()` to capture images. Implement logic to capture multiple pages if the content overflows.
    - The `toCsv` and `toXlsx` renderers will remain unchanged.

5.  **Orchestration (`src/index.ts`):**
    - The main script will be updated to call the new, refactored rendering functions.
    - The batch generation logic will be retained.

## Future Use Cases

The headless browser architecture is a strategic choice that enables more complex and realistic document generation in the future.

- **Mocking Real-World Forms:** We can perfectly replicate the HTML and CSS of real-world COR forms from various GC software (like Procore, Autodesk, etc.). This will allow for highly realistic testing of the AI's ability to process varied and complex layouts, which would be impossible without a browser rendering engine.
- **Complex Visual Elements:** We can include charts, graphs, signatures, and other complex visual elements that are standard in HTML but difficult to generate with low-level libraries.
- **Testing JavaScript-Rendered Content:** Some documents might be rendered dynamically with JavaScript. A headless browser can execute this JavaScript, allowing us to test the AI against the final, user-visible state of a document.
