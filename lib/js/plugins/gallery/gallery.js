// jizy-basics — gallery plugin: binds the jizy-dom `picviewer` dom-plugin the
// same way on every site — `img[data-zoom]` thumbnails open the lightbox
// (picViewer), `[data-gallery]` containers group their pictures into slides
// (picSlider). `Modalizer.ready()` does NOT scan for these, so a site listing
// the `picviewer` dom/modalizer plugins still needs this binding.
//
// Auto-runs at DOM ready (opt-in via `gallery` in the site `plugs:`); content
// added later → `JiZy.gallery(rootElement)`. No-ops without jDOM / picviewer.
(function () {
	'use strict';

	function gallery(root) {
		if (typeof jDOM === 'undefined') {
			return;
		}
		const $zoom = root ? jDOM('img[data-zoom]', root) : jDOM('img[data-zoom]');
		if (typeof $zoom.picViewer === 'function') {
			$zoom.picViewer();
		}
		const $galleries = root ? jDOM('[data-gallery]', root) : jDOM('[data-gallery]');
		if (typeof $galleries.picSlider === 'function') {
			$galleries.picSlider();
		}
	}

	(window.JiZy = window.JiZy || {}).gallery = gallery;

	JiZy.onReady(function () {
		gallery();
	});
})();
