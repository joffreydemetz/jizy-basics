/**
 * jizy-basics is CSS-primary. Its JS payload is the shared front layer, which
 * ships as raw source at ./js/front.js and is concatenated into the per-site
 * front bundle by the callisto jizy-builder — it is not a module to import here.
 *
 * This entry exists so the package resolves as ESM; it intentionally exports
 * nothing meaningful.
 */
export default {};
