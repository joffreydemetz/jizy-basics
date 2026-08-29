// jizy-basics — tooltips plugin: trigger wiring for jizy-tooltip (the bundled
// `jTooltip` class, which ships the #jTip widget). Document-level delegation so
// triggers added later (newWindowLink, modal content, …) work without a
// re-scan; a native `title` is moved to `data-tip` on first hover and removed,
// so the browser tooltip never doubles ours. Keyboard focus shows/hides too.
//
// Auto-runs at DOM ready (opt-in via `tooltips` in the site `plugs:` — named in
// the plural because `tooltip` is a legacy installer template plug). No-op
// without the jizy-tooltip module.
(function () {
	'use strict';

	const SELECTOR = "[data-tip], a[title], [data-toggle='tooltip']";
	let done = false;

	function resolve(target) {
		return (target && target.closest) ? target.closest(SELECTOR) : null;
	}

	function tooltips() {
		if (done || typeof jTooltip === 'undefined') {
			return;
		}
		done = true;

		const tip = new jTooltip('jTip', 10).ready();

		document.addEventListener('mouseover', function (e) {
			const el = resolve(e.target);
			if (!el) {
				return;
			}
			if (el.getAttribute('title') && !el.dataset.tip) {
				el.dataset.tip = el.getAttribute('title');
				el.removeAttribute('title');
			}
			if (el.dataset.tip) {
				tip.fromElement(el);
			}
		});
		document.addEventListener('focusin', function (e) {
			const el = resolve(e.target);
			if (el && el.dataset.tip) {
				tip.fromElement(el);
			}
		});
		document.addEventListener('mouseout', function (e) {
			if (resolve(e.target)) {
				tip.hide();
			}
		});
		document.addEventListener('focusout', function (e) {
			if (resolve(e.target)) {
				tip.hide();
			}
		});
	}

	(window.JiZy = window.JiZy || {}).tooltips = tooltips;

	JiZy.onReady(tooltips);
})();
