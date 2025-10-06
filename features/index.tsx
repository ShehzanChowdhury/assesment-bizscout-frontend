/*
 * Features/Modules that are independent from the rest of the codebase:
 *
 * We will encapsulate each feature/module in a way that ensures removing a feature or module will not affect the rest of the codebase.
 * Each feature/module can have its own common components, config, utils, etc., allowing it to remain self-contained.
 *
 * Example:
 * An `authentication` feature may have the following directory structure (this is just a suggestion, not a limitation):
 *
 * feature/authentication/
 *   - components/
 *     - common/  // Reusable components specific to the `authentication` feature (distinct from global components under `@components/common`)
 *   - utils/
 *   - config/
 *   - hooks/
 *   - store/
 *
 * Guideline:
 * - Avoid using the `@` symbol before directories, as it should be reserved for global or reusable resources across the entire project.
 * - Remove this `index.tsx` file, it's only for this documentation
 */