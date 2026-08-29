// jizy-basics — obfuscator plugin: wires jizy-obfuscator (the bundled
// `Obfuscator` global, Rot13) to the shared response dispatcher.
//
// Server-side (jdz/obfuscator) every mailto is replaced by an `#obfuscated-<i>`
// placeholder and the rot13 map ships as `obfuscated` in the page's
// `JiZy.Template.onHtmlResponse({ … })` payload — decoded here. Content that
// arrives later (modal fragments) carries the map either in the layer payload
// (`payload.js` → dispatch it with `JiZy.Template.onLayerShow`) or as an inline
// `<script type="application/json" data-obfuscate>` → `JiZy.obfuscator.decodeIn(root)`.
//
// Opt-in like every basics plugin (`obfuscator` in the site `plugs:`). Bundled
// before the jizy-obfuscator module, so `Obfuscator` is only looked up when a
// payload actually arrives — a site without the module simply keeps its placeholders.
(function () {
	'use strict';

	function decode(map) {
		if (map && typeof Obfuscator !== 'undefined') {
			Obfuscator.decode(map);
		}
	}

	// <script type="application/json" data-obfuscate>[ "…rot13…", … ]</script>
	function decodeIn(root) {
		const scope = (root && root.querySelectorAll) ? root : document;
		scope.querySelectorAll('script[type="application/json"][data-obfuscate]').forEach(function (el) {
			if (el.getAttribute('data-obfuscate-done')) {
				return;
			}
			el.setAttribute('data-obfuscate-done', 'true');
			try {
				decode(JSON.parse(el.textContent));
			} catch (e) {
				// malformed map: leave the placeholders as they are
			}
		});
	}

	JiZy.Template.onResponse(function (data) {
		decode(data.obfuscated);
	});

	(window.JiZy = window.JiZy || {}).obfuscator = { decode: decode, decodeIn: decodeIn };
})();
