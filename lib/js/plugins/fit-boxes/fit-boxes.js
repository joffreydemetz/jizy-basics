// jizy-basics — fit-boxes plugin: full-bleed `.fit-box-vw` boxes (a hero, a
// banner) stretch to the viewport width through the jizy-dom `blockFitWidth`
// dom-plugin, offset by the centred `.page-contents` left gap so the box
// breaks out of its container. Fitted at DOM ready and refitted on resize
// (debounced to one animation frame).
//
// Opt-in via `fit-boxes` in the site `plugs:`; `JiZy.fitBoxes()` refits on
// demand. No-op without jDOM / blockFitWidth or when the page has no box.
(function () {
	'use strict';

	let raf = null;

	function fitBoxes() {
		if (typeof jDOM === 'undefined') {
			return;
		}
		const $boxes = jDOM('.fit-box-vw');
		if (typeof $boxes.blockFitWidth !== 'function' || !$boxes.exists()) {
			return;
		}
		const $contents = jDOM('body > main .page-contents');
		$boxes.blockFitWidth({ offset: $contents.exists() ? $contents.offset().left : 0 });
	}

	(window.JiZy = window.JiZy || {}).fitBoxes = fitBoxes;

	JiZy.onReady(fitBoxes);

	window.addEventListener('resize', function () {
		if (raf) {
			cancelAnimationFrame(raf);
		}
		raf = requestAnimationFrame(fitBoxes);
	});
})();
