# NuCorpus Project Context

## Project Overview

**NuCorpus** (also known as `easy-dataset`) is a comprehensive tool designed for creating fine-tuning datasets for Large Language Models (LLMs). It allows users to upload unstructured documents (PDF, Markdown, DOCX, etc.), intelligently split them into segments, generate questions and answers using LLMs, and export high-quality datasets in formats like Alpaca and ShareGPT.

The application is built as a **Next.js** web application that can also be packaged as a desktop application using **Electron**.

## Tech Stack

*   **Frontend:** Next.js 14 (App Router), React, Material-UI (MUI), Tailwind CSS.
*   **Backend:** Next.js API Routes.
*   **Database/Storage:** Prisma (SQLite) and a local file-system based storage (`local-db`) for managing project files.
*   **Desktop Wrapper:** Electron.
*   **AI/LLM:** Vercel AI SDK (`ai`), LangChain, support for OpenAI, Ollama, Zhipu, etc.
*   **Internationalization:** `i18next`, `react-i18next` (Supports English, Chinese, Turkish).

## Project Structure

*   **`app/`**: Next.js App Router directory.
    *   `api/`: Backend API routes (`projects`, `llm`, etc.).
    *   `projects/`: Project-specific pages.
    *   `page.js`: Main landing page.
*   **`components/`**: Reusable React components organized by feature (e.g., `home`, `distill`, `datasets`).
*   **`lib/`**: Core logic and utilities.
    *   `db/`: Database access abstractions.
    *   `llm/`: LLM service integrations.
    *   `services/`: Business logic services.
*   **`electron/`**: Electron main process files (`main.js`, `preload.js`).
*   **`prisma/`**: Database schema and configurations.
*   **`local-db/`**: Directory where user project data and uploaded files are stored locally.
*   **`locales/`**: I18n translation files.

## Building and Running

### Web Application (Node.js)

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Development Mode:**
    ```bash
    # Pushes schema to db and starts dev server on port 1717
    npm run dev
    ```

3.  **Production Build & Start:**
    ```bash
    npm run build
    npm run start
    ```
    Access at `http://localhost:1717`.

### Desktop Application (Electron)

1.  **Development:**
    ```bash
    npm run electron-dev
    ```

2.  **Build for Production:**
    ```bash
    # generic build
    npm run electron-build
    
    # Platform specific
    npm run electron-build-mac
    npm run electron-build-win
    npm run electron-build-linux
    ```

### Docker

1.  **Build Image:**
    ```bash
    docker build -t easy-dataset .
    ```

2.  **Run Container:**
    ```bash
    docker run -d \
      -p 1717:1717 \
      -v ./local-db:/app/local-db \
      -v ./prisma:/app/prisma \
      --name easy-dataset \
      easy-dataset
    ```

## Development Conventions

*   **Database:** The project uses Prisma. When making schema changes in `prisma/schema.prisma`, run `npm run db:push` to update the local database.
*   **State Management:** Uses `jotai` for client-side state management.
*   **Styling:** Uses a mix of Material-UI components and Tailwind CSS.
*   **I18n:** All user-facing text should be wrapped in translation functions provided by `react-i18next`. Strings are stored in `locales/`.
*   **File Handling:** User uploads are processed and stored in the `local-db` directory to ensure data persistence across restarts (especially in Docker/Electron).
