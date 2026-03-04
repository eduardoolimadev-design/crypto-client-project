"use strict";
document.addEventListener("DOMContentLoaded", function () {
	gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, Flip);
	const body = document.querySelector("body");
	/**
	 * Preloader
	 */
	const preloader = document.querySelector(".preloader");
	window.addEventListener("load", function () {
		if (preloader) {
			setTimeout(() => {
				preloader.style.display = "none";
			}, 300);
		}
	});
	/**
	 * Slide Up
	 */
	const slideUp = (target, duration = 500) => {
		if (!target) return;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.boxSizing = "border-box";
		target.style.height = target.offsetHeight + "px";
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = "none";
			target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
		}, duration);
	};
	/**
	 * Slide Down
	 */
	const slideDown = (target, duration = 500) => {
		if (!target) return;
		target.style.removeProperty("display");
		let display = window.getComputedStyle(target).display;
		if (display === "none") display = "block";
		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = "border-box";
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
		}, duration);
	};
	/**
	 * Slide Toggle
	 */
	const slideToggle = (target, duration = 500) => {
		if (!target) return;
		if (target.style === undefined || target.style.display === "none") {
			return slideDown(target, duration);
		}
		return slideUp(target, duration);
	};
	/**
	 * Header Crossed
	 */
	let scrollTimeout;
	window.addEventListener("scroll", () => {
		if (!body) return;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const primaryHeader = document.querySelector(".primary-header");
			if (primaryHeader) {
				const primaryHeaderTop = primaryHeader.offsetHeight / 3;
				const scrolled = window.scrollY;
				if (scrolled > primaryHeaderTop) {
					body.classList.add("primary-header-crossed");
				} else {
					body.classList.remove("primary-header-crossed");
				}
			}
		}, 100);
	});
	/**
	 * Primary Menu
	 */
	const mdScreen = "(max-width: 991px)";
	const primaryHeader = document.querySelector(".primary-header");
	if (primaryHeader) {
		primaryHeader.addEventListener("click", function (e) {
			const target = e.target.closest(".has-sub-menu > a, .has-sub-2nd > a");
			if (!target) return;
			const isMobile = window.matchMedia(mdScreen).matches;
			if (isMobile) {
				e.preventDefault();
				e.stopPropagation();
				target.classList.toggle("active");
				const menuSub = target.nextElementSibling;
				if (menuSub) {
					slideToggle(menuSub, 500);
				}
			} else {
				if (!target.getAttribute("href") || target.getAttribute("href") === "#") {
					e.preventDefault();
				}
			}
		});
		window.matchMedia(mdScreen).addEventListener("change", function (e) {
			const subMenus = primaryHeader.querySelectorAll(
				".navigation-0__menu, .navigation-1__menu, .navigation-1__sub-menu"
			);
			if (!subMenus.length) return;
			for (let i = 0; i < subMenus.length; i++) {
				const menu = subMenus[i];
				if (menu.style.display !== "none") {
					slideUp(menu, 0);
					const parentLink = menu.previousElementSibling;
					if (parentLink) {
						parentLink.classList.remove("active");
					}
				}
			}
		});
	}
	/**
	 * Duplicate Scroller-X Item
	 */
	const scrollerX = document.querySelectorAll(".scroller-x");
	function scrollerXDuplication(scroller) {
		if (scroller.dataset.duplicated === "true") return;
		const scrollerInner = scroller.querySelector(".scroller-x__list");
		if (!scrollerInner) return;
		const scrollerContent = Array.from(scrollerInner.children);
		if (!scrollerContent.length) return;
		const fragment = document.createDocumentFragment();
		scrollerContent.forEach((item) => {
			const duplicateItem = item.cloneNode(true);
			fragment.appendChild(duplicateItem);
		});
		scrollerInner.appendChild(fragment);
		scroller.dataset.duplicated = "true";
	}
	scrollerX.forEach((scroller) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						scrollerXDuplication(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0 }
		);
		observer.observe(scroller);
	});
	/**
	 * Countdown Timer
	 */
	function updateCountdown() {
		const countdownElements = document.querySelectorAll(".countdown");

		if (!countdownElements.length) return;

		function updateAll() {
			const currentDate = new Date().getTime();
			let activeCountdowns = false;

			countdownElements.forEach((countdown) => {
				const targetDateStr = countdown.dataset.date;

				if (!targetDateStr) {
					console.error(
						"Error: Target date not specified in the data-date attribute."
					);
					return;
				}

				const targetDate = new Date(targetDateStr).getTime();

				if (isNaN(targetDate)) {
					console.error("Error: Invalid target date format.");
					return;
				}

				const timeDifference = targetDate - currentDate;

				if (timeDifference <= 0) {
					const selectors = [
						{ sel: ".days", val: "00" },
						{ sel: ".months", val: "00" },
						{ sel: ".hours", val: "00" },
						{ sel: ".minutes", val: "00" },
						{ sel: ".seconds", val: "00" },
					];
					selectors.forEach(({ sel, val }) => {
						const element = countdown.querySelector(sel);
						if (element) element.innerText = val;
					});
					return;
				}

				activeCountdowns = true;

				const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
				const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
				const hours = Math.floor(
					(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor(
					(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

				const selectors = [
					{ sel: ".days", val: days.toString().padStart(2, "0") },
					{ sel: ".months", val: months.toString().padStart(2, "0") },
					{ sel: ".hours", val: hours.toString().padStart(2, "0") },
					{ sel: ".minutes", val: minutes.toString().padStart(2, "0") },
					{ sel: ".seconds", val: seconds.toString().padStart(2, "0") },
				];

				selectors.forEach(({ sel, val }) => {
					const element = countdown.querySelector(sel);
					if (element) element.innerText = val;
				});
			});

			if (!activeCountdowns) {
				clearInterval(timer);
			}
		}

		updateAll();
		const timer = setInterval(updateAll, 1000);
	}
	// Initialize countdown timer
	updateCountdown();
	/**
	 * Text Copy Functionality
	 */
	const copyBtn = document.getElementById("copyBtn");
	const input = document.getElementById("walletAddress");

	if (copyBtn && input) {
		copyBtn.addEventListener("click", function () {
			if (!input.value) {
				console.warn("No wallet address to copy");
				return;
			}

			// Check if Clipboard API is available
			if (navigator.clipboard?.writeText) {
				navigator.clipboard
					.writeText(input.value)
					.then(() => {
						// Success feedback
						this.classList.add("btn-success");
						setTimeout(() => this.classList.remove("btn-success"), 2000);
					})
					.catch((err) => {
						console.error("Failed to copy:", err);
						alert("Your browser blocked clipboard access.");
					});
			} else {
				// Graceful fallback (no copy, just alert user)
				alert("Clipboard API not supported in this browser.");
			}
		});
	}

	/**
	 * Initialize ScrollSmoother
	 */
	ScrollSmoother.create({
		wrapper: "#smooth-wrapper",
		content: "#smooth-content",
		smooth: 1.5,
		effects: true,
		normalizeScroll: true,
		smoothTouch: 0.1,
	});
	/**
	 * Animation
	 */
	let mm = gsap.matchMedia();
	mm.add("(min-width: 1200px)", () => {
		function textAnimation() {
			const items = gsap.utils.toArray(".gsap-text-animation");
			if (!items.length) return;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0.05";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "50";
				const animationOpacity = item.dataset.opacity || "0";
				const splitType = item.dataset.splitType || "chars";
				const scrollMarker = item.dataset.markers || false;
				const textSplit = new SplitText(item, { type: splitType });
				let itemsToAnimate;
				if (splitType === "chars") {
					itemsToAnimate = textSplit.chars;
				} else if (splitType === "words") {
					itemsToAnimate = textSplit.words;
				} else if (splitType === "lines") {
					itemsToAnimate = textSplit.lines;
				} else {
					console.error("Invalid split type:", splitType);
					continue;
				}
				if (!itemsToAnimate.length) {
					textSplit.revert();
					continue;
				}
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(itemsToAnimate, {
					opacity: parseFloat(animationOpacity),
					delay: parseFloat(animationDelay),
					yPercent: parseFloat(animationY),
					duration: parseFloat(animationDuration),
					stagger: parseFloat(animationStagger),
					ease: "back.out",
					onComplete: () => {
						textSplit.revert();
					},
				});
			}
		}
		function imageRevealAnimation() {
			const imageContainers = gsap.utils.toArray(".gsap-image-reveal");
			if (!imageContainers.length) return;
			for (let i = 0; i < imageContainers.length; i++) {
				const image = imageContainers[i];
				const revealImage = image.querySelector("img");
				if (!revealImage) continue;
				const scrollTriggerSupport = image.dataset.scrollTrigger;
				const animationStart = image.dataset.start || "85%";
				const animationEnd = image.dataset.end || "25%";
				const scrollMarker = image.dataset.markers || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: image,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.set(image, { autoAlpha: 1 });
				tl.from(image, { xPercent: -100, duration: 1.5, ease: "power2.out" });
				tl.from(revealImage, {
					xPercent: 100,
					ease: "power2.out",
					scale: 1.5,
					duration: 1.5,
					delay: -1.5,
				});
			}
		}
		function fadeInAnimation() {
			const fadeIn = gsap.utils.toArray(".gsap-fade-in");
			if (!fadeIn.length) return;
			for (let i = 0; i < fadeIn.length; i++) {
				const item = fadeIn[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "0";
				const animationX = item.dataset.x || "0";
				const animationOpacity = item.dataset.opacity || "0";
				const scrollMarker = item.dataset.markers || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					yPercent: parseFloat(animationY),
					xPercent: parseFloat(animationX),
					delay: parseFloat(animationDelay),
					stagger: parseFloat(animationStagger),
					duration: parseFloat(animationDuration),
					ease: "back.out",
				});
			}
		}
		function zoomAnimation() {
			const zoomAnimation = gsap.utils.toArray(".gsap-zoom");
			if (!zoomAnimation.length) return;
			for (let i = 0; i < zoomAnimation.length; i++) {
				const item = zoomAnimation[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "85%";
				const animationEnd = item.dataset.end || "25%";
				const animationOpacity = item.dataset.opacity || "1";
				const animationScale = item.dataset.scale || "1";
				const animationScrub = item.dataset.scrub || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								scrub: parseFloat(animationScrub),
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					scale: parseFloat(animationScale),
				});
			}
		}
		function rocketLaunch() {
			const rocketLaunch = document.querySelector(
				".road-map-section-1__element--1"
			);
			if (rocketLaunch) {
				const startY = 0;
				const endY = 1200;

				ScrollTrigger.create({
					trigger: rocketLaunch,
					start: "top 75%",
					end: "bottom -25%",
					scrub: true,
					onUpdate: (self) => {
						const progress = self.progress;
						const interpolatedY = startY + (endY - startY) * progress;
						rocketLaunch.style.top = `${interpolatedY}px`;
					},
				});
			}
		}
		function herothree() {
			const heroThree = document.querySelector(".hero-3");

			if (heroThree) {
				// Set initial CSS custom properties for pseudo-elements
				heroThree.style.setProperty("--before-opacity", 0);
				heroThree.style.setProperty("--after-opacity", 0);

				// Animate the custom properties using GSAP
				gsap.to(heroThree, {
					"--before-opacity": 1,
					duration: 1.5,
					delay: 4.5,
				});

				gsap.to(heroThree, {
					"--after-opacity": 1,
					duration: 1.5,
					delay: 4,
				});
			}
		}
		herothree();
		rocketLaunch();
		imageRevealAnimation();
		fadeInAnimation();
		zoomAnimation();
		document.fonts.ready
			.then(() => {
				textAnimation();
			})
			.catch((error) => {
				console.error("Font loading failed:", error);
				textAnimation();
			});
	});
});
/**
 * Scroll to Section
 */
// Smooth scroll with GSAP
function smoothScrollTo(targetId) {
	const target = document.querySelector(targetId);
	if (target) {
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: target, offsetY: getHeaderHeight() },
			ease: "power2.inOut",
		});
	}
}

function getHeaderHeight() {
	const header = document.querySelector("header"); // adjust selector if needed
	return header ? header.offsetHeight : 0;
}

// Detect homepage by body attribute
function isHomePage() {
	return document.body.dataset.page === "home";
}

// Save the current homepage variation in sessionStorage
function rememberHomePage() {
	if (isHomePage()) {
		const path = window.location.pathname;
		const file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
		sessionStorage.setItem("homePageFile", file);
	}
}

// Get the remembered homepage variation (fallback: index.html)
function getRememberedHomePage() {
	return sessionStorage.getItem("homePageFile") || "index.html";
}

// Redirect back to the remembered homepage variation with hash
function redirectToRememberedHome(targetId) {
	const currentPath = window.location.pathname.substring(
		0,
		window.location.pathname.lastIndexOf("/") + 1
	);
	const homeFile = getRememberedHomePage();
	window.location.href = currentPath + homeFile + targetId;
}

// Handle clicks for all internal section links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener("click", function (e) {
		const targetId = this.getAttribute("href");

		e.preventDefault();

		// If not on homepage, redirect back to remembered variation
		if (!isHomePage()) {
			redirectToRememberedHome(targetId);
			return;
		}

		// If already on homepage, smooth scroll
		smoothScrollTo(targetId);
	});
});

// On homepage load, remember which homepage this is
rememberHomePage();

// On homepage load, check if URL has hash and scroll smoothly
window.addEventListener("load", () => {
	if (isHomePage() && window.location.hash) {
		setTimeout(() => {
			smoothScrollTo(window.location.hash);
		}, 300); // delay so layout is ready
	}
});
