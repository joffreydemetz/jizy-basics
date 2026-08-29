// jizy-basics — lazyload plugin: swaps `img[data-src]` placeholders (the thumb
// `jizyImg(width)` serves) for the original as they scroll into view. Native
// IntersectionObserver — replaces the lozad lib the sites used to pull from a
// CDN (and mostly never bundled). Same contract: the swapped image is stamped
// `data-loaded="true"`, `data-src` stays.
//
// The `<img>` already carries the thumb's width/height and native
// `loading="lazy"`, so the box never moves on swap — only the pixels sharpen.
//
// Auto-runs at DOM ready (opt-in via `lazyload` in the site `plugs:`); content
// added later (a modal) → `JiZy.lazyload(rootElement)`. Browsers without
// IntersectionObserver load the originals right away.
(function () {
	'use strict';

	const ROOT_MARGIN = '200px 0px';
	let io = null;

	function swap(img) {
		const src = img.getAttribute('data-src');
		if (src) {
			img.setAttribute('src', src);
		}
		img.setAttribute('data-loaded', 'true');
	}

	function observer() {
		if (io === null && 'IntersectionObserver' in window) {
			io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						io.unobserve(entry.target);
						swap(entry.target);
					}
				});
			}, { rootMargin: ROOT_MARGIN });
		}
		return io;
	}

	function lazyload(root) {
		const scope = (root && root.querySelectorAll) ? root : document;
		const obs = observer();
		scope.querySelectorAll('img[data-src]:not([data-loaded])').forEach(function (img) {
			if (obs) {
				obs.observe(img);
			} else {
				swap(img);
			}
		});
	}

	(window.JiZy = window.JiZy || {}).lazyload = lazyload;

	JiZy.onReady(function () {
		lazyload();
	});
})();
