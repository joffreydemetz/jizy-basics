// jizy-basics — hasher-links plugin: back-compat for DB-resident content and
// menus that still link modals the legacy way, `data-hasher-url` (+ the `hh` /
// `sm` / `lg` classes). Maps them onto the Modalizer attributes
// (`data-mdzr-path`, `data-mdzr-noheader`, `data-mdzr-size`) so the delegated
// `[data-mdzr-path]` binding picks them up. Attributes already set win.
//
// Auto-runs at DOM ready (opt-in via `hasher-links` in the site `plugs:`);
// content added later → `JiZy.hasherLinks(rootElement)`.
(function () {
	'use strict';

	function hasherLinks(root) {
		const scope = (root && root.querySelectorAll) ? root : document;
		scope.querySelectorAll('[data-hasher-url]').forEach(function (el) {
			if (el.getAttribute('data-mdzr-path')) {
				return;
			}
			el.setAttribute('data-mdzr-path', el.getAttribute('data-hasher-url'));
			if (el.classList.contains('hh') && !el.hasAttribute('data-mdzr-noheader')) {
				el.setAttribute('data-mdzr-noheader', '');
			}
			if (!el.getAttribute('data-mdzr-size')) {
				if (el.classList.contains('sm')) {
					el.setAttribute('data-mdzr-size', 'sm');
				} else if (el.classList.contains('lg')) {
					el.setAttribute('data-mdzr-size', 'lg');
				}
			}
		});
	}

	(window.JiZy = window.JiZy || {}).hasherLinks = hasherLinks;

	JiZy.onReady(function () {
		hasherLinks();
	});
})();
