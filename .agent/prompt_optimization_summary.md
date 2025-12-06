Prompt Optimization Summary (Nuclear Emergency Domain)

1.  **label.js (Area/Classification Generation)**
    *   **Old Role:** Domain Classification Expert (Generic).
    *   **New Role:** Nuclear Knowledge Architect (Nuclear Information Architect).
    *   **Optimization:** Focuses on extracting core knowledge structures from FSAR, EOPs, and technical manuals. Adheres to KKS/PBS standards. Distinguishes between Nuclear Island, Conventional Island, and BOP.

2.  **labelRevise.js (Domain Tree Revision)**
    *   **Old Role:** Domain Tree Revision Expert (Generic).
    *   **New Role:** Nuclear Knowledge Maintenance Expert.
    *   **Optimization:** Acts as a System Engineer updating the knowledge base incrementally based on plant configuration changes (Modifications, Tech Spec updates). Prioritizes safety-related labels.

3.  **addLabel.js (Label Assignment)**
    *   **Old Role:** Label Matching Expert (Generic).
    *   **New Role:** Nuclear Engineering Classifier (OEF Specialist).
    *   **Optimization:** Assigns field questions (e.g., from Operating Experience) to specific KKS codes or technical domains. Distinguishes between I&C/Electrical and Safety/Non-Safety systems.

4.  **dataClean.js (Data Cleaning)**
    *   **Old Role:** Data Cleaning Expert (Generic).
    *   **New Role:** Nuclear Data QA Specialist.
    *   **Optimization:** Specialized for cleaning OCR errors in nuclear technical documents while aggressively preserving critical parameters (setpoints, units, chemical formulas) and warning statements (Warnings/Cautions).

5.  **optimizeCot.js (Chain of Thought Optimization)**
    *   **Old Role:** Chain of Thought Optimization Expert (Generic).
    *   **New Role:** Nuclear Safety Logic Optimizer.
    *   **Optimization:** Restructures reasoning into standard Operator logic: Status Assessment -> Logic Diagnosis -> Regulatory Basis (Procedure Step). Removes non-technical "meta-talk" about documents.

6.  **datasetEvaluation.js (Quality Evaluation)**
    *   **Old Role:** Dataset Quality Evaluation Expert (Generic).
    *   **New Role:** Nuclear Safety Inspector (IAEA Standards).
    *   **Optimization:** Evaluates Q&A pairs based on Technical Accuracy (Setpoints, Physics), Safety Culture (Conservative Decision Making), and Regulatory Compliance.

7.  **newAnswer.js (Answer Refinement)**
    *   **Old Role:** Fine-tuning Dataset Answer Optimization Expert (Generic).
    *   **New Role:** Nuclear Answer Refinement Specialist (SRO Instructor).
    *   **Optimization:** Refines answers based on expert feedback to correct technical deviations and enhance details with specific system parameters and interlocks, ensuring strict adherence to nuclear safety.
