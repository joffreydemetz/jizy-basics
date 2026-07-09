// jizy-basics — mobile nav-toggler plugin (vanilla, no jDOM).
//
// Toggles a `.nav-toggler` button's `data-target` menu open/closed on mobile,
// with a height slide via the Web Animations API and correct `aria-expanded`
// (on the trigger) / `aria-hidden` (on the menu). Desktop keeps the menu shown
// via CSS; the plugin only drives the mobile open/close.
//
// Usage — call once from your site front layer's ready handler:
//     JiZy.navToggler();                     // default breakpoint: max-width 767px
//     JiZy.navToggler({ breakpoint: 575 });  // narrower mobile breakpoint
//
// No-ops when there is no `.nav-toggler` (e.g. a logo-only header) or when the
// target selector resolves to nothing. Safe to call more than once (guarded).
(function () {
	'use strict';

	const DURATION = 450;
	const EASING = 'cubic-bezier(0.25, 0.1, 0.44, 1.4)';

	function prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	// Slide the menu open (down) or closed (up). Uses the Web Animations API to
	// animate height between 0 and the natural content height; `.slider-hidden`
	// (height:0 !important, from the theme) is the resting collapsed state and is
	// dropped while opening so it can't override the animated height. Falls back
	// to an instant show/hide when animation or motion is unavailable.
	function slide(menu, down) {
		if (menu._navAnim) {
			menu._navAnim.cancel();
			menu._navAnim = null;
		}

		if (down) {
			menu.classList.remove('slider-hidden');
			menu.style.display = 'block';
			menu.setAttribute('aria-hidden', 'false');
		} else {
			menu.setAttribute('aria-hidden', 'true');
		}

		if (typeof menu.animate !== 'function' || prefersReducedMotion()) {
			if (down) {
				menu.style.removeProperty('height');
				menu.style.removeProperty('overflow');
			} else {
				menu.classList.add('slider-hidden');
				menu.style.display = 'none';
			}
			return;
		}

		const height = menu.scrollHeight;
		const frames = down
			? [{ height: '0px' }, { height: height + 'px' }]
			: [{ height: height + 'px' }, { height: '0px' }];

		menu.style.overflow = 'hidden';
		const anim = menu.animate(frames, { duration: DURATION, easing: EASING });
		menu._navAnim = anim;

		anim.onfinish = function () {
			menu._navAnim = null;
			menu.style.removeProperty('overflow');
			if (down) {
				menu.style.removeProperty('height');
			} else {
				// Settle into the resting collapsed state before the fill reverts,
				// so the menu never flashes back to full height on the way out.
				menu.classList.add('slider-hidden');
				menu.style.display = 'none';
			}
		};
	}

	function navToggler(options) {
		const trigger = document.querySelector('.nav-toggler');
		if (!trigger || trigger.getAttribute('data-nav-toggler-done')) {
			return;
		}
		trigger.setAttribute('data-nav-toggler-done', 'true');

		const menu = document.querySelector(trigger.dataset.target || '');
		if (!menu) {
			return;
		}

		const breakpoint = (options && typeof options.breakpoint === 'number') ? options.breakpoint : 767;
		const mql = window.matchMedia('(max-width: ' + breakpoint + 'px)');

		// Leaving mobile: drop every trace of the collapsed state so the desktop
		// menu (shown via `display:flex !important`) isn't stuck at height 0 by a
		// leftover slide.
		mql.addEventListener('change', function (e) {
			if (e.matches) {
				return;
			}
			if (menu._navAnim) {
				menu._navAnim.cancel();
				menu._navAnim = null;
			}
			menu.classList.remove('slider-hidden');
			menu.style.removeProperty('height');
			menu.style.removeProperty('overflow');
			menu.style.removeProperty('display');
			menu.removeAttribute('aria-hidden');
		});

		trigger.addEventListener('click', function (e) {
			e.preventDefault();
			const expanded = trigger.getAttribute('aria-expanded') === 'true';
			trigger.setAttribute('aria-expanded', String(!expanded));
			slide(menu, !expanded);
		});
	}

	// Expose on the JiZy namespace (jizy-factory global, bundled first); the site
	// front layer calls JiZy.navToggler() from its ready handler.
	(window.JiZy = window.JiZy || {}).navToggler = navToggler;
})();
