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

// Boot the factory. run() defers Messaging.ready() to DOMContentLoaded (or runs
// it now if the DOM is already parsed): it wires the server-rendered
// [data-jizy-messaging] flashes (closer click + data-timeout auto-close) and
// creates the container JS-added messages rely on. ready() self-guards via
// data-jizy-parsed, so a site calling it again is a no-op.
JiZy.run();
