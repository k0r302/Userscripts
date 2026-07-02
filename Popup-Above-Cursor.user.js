// ==UserScript==
// @name        Popup Above Cursor
// @version     1.3
// @description Position overlib popups above cursor instead of below
// @include     /https?://www\.empornium\.(is|sx)/*
// @include     /https?://www\.happyfappy\.net/*
// @include     /https?://femdomcult\.org/*
// @include     /https?://www\.cheggit\.me/*
// @include     /https?://kufirc.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    let lastMouseX = 0;
    let lastMouseY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }, true);

    // Wait for overDiv to exist and watch it
    function setupOverDivWatcher() {
        const overDiv = document.getElementById('overDiv');
        if (!overDiv) {
            // Try again in a moment
            setTimeout(setupOverDivWatcher, 500);
            return;
        }

        // Watch for attribute changes on overDiv
        const attrObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const visibility = overDiv.style.visibility;
                    const left = overDiv.style.left;
                    const top = overDiv.style.top;

                    // Check if it's now visible (not hidden, not at -10000px)
                    if (visibility === 'visible' || (left !== '-10000px' && top !== '-10000px')) {
                        // Position above cursor
                        const height = overDiv.offsetHeight;
                        const padding = 15;
                        const newY = lastMouseY - height - padding;
                        const finalY = Math.max(10, newY); // Keep 10px from top

                        // Apply new positioning
                        overDiv.style.position = 'fixed';
                        overDiv.style.top = finalY + 'px';
                        overDiv.style.left = lastMouseX + 'px';
                        overDiv.style.visibility = 'visible';
                        console.log('[PopupAbove] Repositioned popup above cursor');
                    }
                }
            });
        });

        attrObserver.observe(overDiv, {
            attributes: true,
            attributeFilter: ['style']
        });

        console.log('[PopupAbove] Started watching overDiv element');
    }

    // Initialize watcher when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupOverDivWatcher);
    } else {
        setupOverDivWatcher();
    }
})();
