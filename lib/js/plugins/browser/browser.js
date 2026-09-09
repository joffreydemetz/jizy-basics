// jizy-basics — browser-compatibility check plugin (self-contained, native DOM —
// no jDOM, no jizy-browser).
//
// Reveals the SSR #browser warning when the UA fails the supported-browser regex
// (browserlist.txt, injected here as __CALLISTO[canIuse]) or a required feature is
// missing. Pairs with the `browser` CSS plug (lib/less/plugins/browser/), which
// styles #browser and the .incompatible-browser body state.
//
// Opt-in like every basics plugin: a site gets it by listing `browser` in its
// build config `plugs:` list (the same key that selects the CSS).
// Unlike nav-toggler it exposes no JiZy.* entry point — being bundled IS the
// activation: the IIFE runs at load, and since the bundle sits before </body>,
// #browser already exists in the DOM.
(function () {
	if (typeof document === 'undefined' || !document.body) {
		return;
	}

	var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
	var error = '';

	// Supported-browser UA regex (built with --allowHigherVersions): no match → too old.
	var supported = false;
	var m = ua.match(__CALLISTO[canIuse]);
	if (m) {
		for (var i = 1; i < m.length; i++) {
			if (m[i]) { supported = true; break; }
		}
	}

	if (!supported) {
		error = 'Browser is too old';
	} else if (document.documentMode) {
		error = 'Cannot use Internet Explorer';
	} else if (ua.indexOf('Opera Mini') > -1) {
		error = 'Cannot use Opera Mini';
	} else if (typeof window.XMLHttpRequest === 'undefined') {
		error = 'JiZy requires XMLHttpRequest';
	} else if (typeof window.JSON === 'undefined') {
		error = 'JiZy requires JSON';
	} else if (!document.querySelector || !document.querySelectorAll) {
		error = 'JiZy requires querySelector';
	} else if (typeof window.FormData === 'undefined') {
		error = 'JiZy requires FormData';
	} else if (typeof window.URLSearchParams === 'undefined') {
		error = 'JiZy requires URLSearchParams';
	}

	if (error) {
		document.body.classList.add('incompatible-browser');
		var box = document.querySelector('#browser > div');
		if (box) { box.style.display = 'block'; }
		var errEl = document.querySelector('#browser .browser-error');
		if (errEl) { errEl.textContent = ' ' + error; }
	}
})();
