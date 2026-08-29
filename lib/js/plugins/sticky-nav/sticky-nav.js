// jizy-basics — sticky-nav plugin: toggles `body.fixedNav` (the theme shrinks /
// fixes the header) on scroll direction past a pivot, with hysteresis — added
// when scrolling DOWN past it, removed when scrolling back UP above it.
//
//     JiZy.stickyNav();                                   // pivot = the header's height (live)
//     JiZy.stickyNav({ pivot: 165 });                     // fixed pixel pivot
//     JiZy.stickyNav({ pivot: 'body > header nav',        // an element's top, measured once at init
//                      unless: 'home-page' });            // skip when body carries this class
//
// The selector pivot is measured once on purpose: once fixedNav applies, the
// element it points at moves, so a live read would flap. A pivot that resolves
// to 0 (element not laid out) keeps the header unfixed.
//
// Opt-in via `sticky-nav` in the site `plugs:`; call it from the site front
// layer's ready handler. No-op without a `body > header` / the pivot element.
(function () {
	'use strict';

	function stickyNav(options) {
		options = options || {};
		if (options.unless && document.body.classList.contains(options.unless)) {
			return;
		}

		const pivot = (options.pivot === undefined) ? 'header' : options.pivot;
		let fixed = null;

		if (typeof pivot === 'string' && pivot !== 'header') {
			const el = document.querySelector(pivot);
			if (!el) {
				return;
			}
			fixed = el.getBoundingClientRect().top + window.scrollY;
		} else if (pivot === 'header' && !document.querySelector('body > header')) {
			return;
		}

		function at() {
			if (typeof pivot === 'number') {
				return pivot;
			}
			if (fixed !== null) {
				return fixed;
			}
			const header = document.querySelector('body > header');
			return header ? header.offsetHeight : 0;
		}

		let lastScroll = 0;

		function onScroll() {
			const y = window.scrollY;
			const limit = at();
			if (fixed !== null && 0 === limit) {
				document.body.classList.remove('fixedNav');
				return;
			}
			if (y > lastScroll) {
				if (y >= limit) {
					document.body.classList.add('fixedNav');
				}
			} else if (y < lastScroll) {
				if (y <= limit) {
					document.body.classList.remove('fixedNav');
				}
			}
			lastScroll = y;
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	(window.JiZy = window.JiZy || {}).stickyNav = stickyNav;
})();
