// jizy-basics — cookies plugin: boots jizy-cooky (the per-site packed `Cooky`
// global) the same way on every site.
//
//     JiZy.cookies();                                            // defaults
//     JiZy.cookies({ core: { uri: location.origin + '/legal-notice' },
//                    config: { defaultLanguage: 'fr' } });
//
// Names the `core` service "JiZy Platform" (the platform's own technical
// cookies — never the package default "Core"), applies the optional
// `Cooky.config()`, runs the consent check right away and `Cooky.ready()` at
// DOM ready, and turns any `.cooky-show` trigger (footer / menu link) into the
// `cooky.show` event that re-opens the banner. Idempotent; no-op when the
// jizy-cooky module isn't bundled. (Named `cookies`, not `cooky`: `cooky` is a
// legacy template plug name.)
(function () {
	'use strict';

	let done = false;

	function cookies(options) {
		if (done || typeof Cooky === 'undefined') {
			return;
		}
		done = true;
		options = options || {};

		Cooky.appendServiceData('core', Object.assign({ name: 'JiZy Platform' }, options.core || {}));
		if (options.config) {
			Cooky.config(options.config);
		}
		Cooky.check();

		JiZy.onReady(function () {
			Cooky.ready();

			document.querySelectorAll('.cooky-show').forEach(function (el) {
				el.addEventListener('click', function (e) {
					e.preventDefault();
					document.dispatchEvent(new CustomEvent('cooky.show', { detail: { from: 'menu' } }));
				});
			});
		});
	}

	(window.JiZy = window.JiZy || {}).cookies = cookies;
})();
