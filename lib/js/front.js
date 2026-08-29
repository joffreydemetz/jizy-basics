// Shared front layer — the ONLY framework-wide front behaviour, appended (as
// `raw`) before each site's own front.js (the bundle's client JS). Shared
// behaviours a site opts into (obfuscator, cookies, lazyload, gallery, …) are
// the basics plugs (lib/js/plugins/, selected by the site `plugs:`); what is
// truly site-specific — modal components, captcha wiring, page effects — lives
// in that per-site front.js, so each site ships and runs only what it uses.
// Keep this file minimal.
JiZy.setBaseUrlPath('');

// DOM-ready helper shared by the basics plugs and the site front layer: runs
// `fn` right away when the DOM is already parsed, else on DOMContentLoaded.
JiZy.onReady = function (fn) {
	if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
};

// The framework's HtmlRendererExtension injects
// `JiZy.Template.onHtmlResponse({ obfuscated, captcha, … })` before </body> on
// every HTML response. Provide a minimal dispatcher; the plugs and each site
// register the handlers they need (email de-obfuscation, captcha, …) via
// `JiZy.Template.onResponse(fn)`. A failing handler must not break the page.
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
		for (let i = 0; i < this._handlers.length; i++) {
			try {
				this._handlers[i](data);
			} catch (e) {
				if (window.console && console.error) {
					console.error('[front] onHtmlResponse handler failed', e);
				}
			}
		}
	},
	// Modal content arrives as JSON, so the server-side `js` payload isn't
	// auto-run the way full HTML responses are — point a Modalizer component's
	// `onShow` at this to dispatch `payload.js` through the same handlers:
	//     Modalizer.addComponent('page', 'json').setConfigValue('onShow', JiZy.Template.onLayerShow)
	onLayerShow: function (layer, payload) {
		if (payload && payload.js) {
			JiZy.Template.onHtmlResponse(payload.js);
		}
	}
};

// Boot the factory. run() defers Messaging.ready() to DOMContentLoaded (or runs
// it now if the DOM is already parsed): it wires the server-rendered
// [data-jizy-messaging] flashes (closer click + data-timeout auto-close) and
// creates the container JS-added messages rely on. ready() self-guards via
// data-jizy-parsed, so a site calling it again is a no-op.
JiZy.run();
