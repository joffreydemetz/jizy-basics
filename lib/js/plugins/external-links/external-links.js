// jizy-basics — external-links plugin: binds the jizy-dom `newWindowLink`
// dom-plugin on every `a[target='_blank']` (the "opens in a new window" hint /
// tip the link gets). Auto-runs at DOM ready (opt-in via `external-links` in
// the site `plugs:`); content added later → `JiZy.externalLinks(rootElement)`.
// No-op without jDOM / the newWindowLink dom-plugin.
(function () {
	'use strict';

	function externalLinks(root) {
		if (typeof jDOM === 'undefined') {
			return;
		}
		const $links = root ? jDOM("a[target='_blank']", root) : jDOM("a[target='_blank']");
		if (typeof $links.newWindowLink === 'function') {
			$links.newWindowLink();
		}
	}

	(window.JiZy = window.JiZy || {}).externalLinks = externalLinks;

	JiZy.onReady(function () {
		externalLinks();
	});
})();
