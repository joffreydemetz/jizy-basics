// Shared front layer — the ONLY framework-wide front behaviour, appended (as
// `raw`) before each site's own front.js (the bundle's client JS). Everything
// site-specific — modals, tooltips, cooky, captcha, the dom-plugin inits, lazy
// images — lives in that per-site front.js, so each site ships and runs only what
// it uses. Keep this file minimal.
JiZy.setBaseUrlPath('');

// The framework's HtmlRendererExtension injects
// `JiZy.Template.onHtmlResponse({ obfuscated, captcha, … })` before </body> on
// every HTML response. Provide a minimal dispatcher; each site registers the
// handlers it needs (email de-obfuscation, captcha, …) from its own front.js via
// `JiZy.Template.onResponse(fn)`. A failing site handler must not break the page.
JiZy.Template = JiZy.Template || {
	_handlers: [],
	onResponse: function (fn) {
		if (typeof fn === 'function') {
			this._handlers.push(fn);
		}
		return this;
	},
	onHtmlResponse: function (data) {
		if (!data) {
			return;
		}
		for (var i = 0; i < this._handlers.length; i++) {
			try {
				this._handlers[i](data);
			} catch (e) {
				if (window.console && console.error) {
					console.error('[front] onHtmlResponse handler failed', e);
				}
			}
		}
	}
};

// Browser-compatibility check (self-contained, native DOM — no jDOM, no jizy-browser).
// Reveals the SSR #browser warning when the UA fails the supported-browser regex
// (browserlist.txt, injected here as __CALLISTO[canIuse]) or a required feature is
// missing. Runs at load — the bundle sits before </body>, so #browser already exists.
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
