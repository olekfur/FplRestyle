// FPL Restyle - JavaScript Content Script
// This script injects CSS based on the current URL

// CSS styles for different pages
const styles = {
  // My Team page styles
  myTeam: `
    /* Reverse the order of the two main columns */
    div._16mjapo2 {
        display: flex !important;
        flex-direction: row-reverse !important;
    }

    /* Ensure the columns maintain their width */
    div._16mjapo2 > div {
        flex: 1;
    }

    /* Move chips and captain info to bottom */
    /* Use flexbox to reorder elements */
    div.nxc5e30 {
        display: flex !important;
        flex-direction: column !important;
    }

    /* Move chips section to bottom */
    ul.ocshmh0 {
        order: 999 !important;
        margin-top: 20px !important;
        padding: 15px !important;
        background-color: #f5f5f5 !important;
        border-radius: 8px !important;
        border-top: 1px solid #ddd !important;
    }

    /* Hide captain info section */
    div.fjxoyga {
        display: none !important;
    }

    /* Hide kit design note */
    div.fjxoyg1.fjxoyg0.fjxoyg2 {
        display: none !important;
    }

    /* Create a horizontal header with evenly spaced elements */
    /* Create a wrapper for the three elements we want horizontal */
    div._1tcyj2k0 {
        position: relative !important;
    }

    /* Position the three elements absolutely to create horizontal layout */
    h1#page-title {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 30% !important;
        margin: 0 !important;
        z-index: 10 !important;
    }

    div._1et4rvf0 {
        position: absolute !important;
        left: 35% !important;
        top: 0 !important;
        width: 30% !important;
        text-align: center !important;
        margin: 0 !important;
        z-index: 10 !important;
    }

    div._1fppqtq1 {
        position: absolute !important;
        right: 0 !important;
        top: 0 !important;
        width: 30% !important;
        text-align: right !important;
        margin: 0 !important;
        z-index: 10 !important;
    }

    /* Add space below the header to prevent overlap with other content */
    div._1tcyj2k0 {
        padding-bottom: 60px !important;
    }

    /* Add margin to the pitch container to push it down */
    div.t2sh1k5 {
        margin-top: 80px !important;
    }
  `,

  // League page styles (example for other pages)
  league: `
    /* League page specific styles can go here */

  `,

  // Transfers page styles (example for other pages)
  transfers: `
    /* Transfers page specific styles can go here */

  `,

  // Global styles that apply to all FPL pages
  global: `
    /* Global FPL styles can go here */
    /* Hide Top Nav */
    div.top-nav {
        display: none;
    }

    nav.main-navigation-wrapper {
        padding-bottom: 0px !important;
    }

    /* Border Radius on Header */
    header._7od82s0{
        border-radius: 0px !important;
    }

    ul.xjr7e60 {
        border-bottom-left-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }

    /* Background colour behind tiles */
    div._16mjapo2 {
        background-color: lightgray !important;
    }
  `
};

// Function to inject CSS
function injectCSS(css) {
  const style = document.createElement('style');
  style.textContent = css;
  style.id = 'fpl-restyle-styles';
  style.setAttribute('data-fpl-restyle', 'true');
  document.head.appendChild(style);
}

// Function to remove all FPL restyle styles
function removeAllFPLStyles() {
  const existingStyles = document.querySelectorAll('style[data-fpl-restyle="true"]');
  existingStyles.forEach(style => {
    style.remove();
  });
  
  // Also remove by ID as backup
  const styleById = document.getElementById('fpl-restyle-styles');
  if (styleById) {
    styleById.remove();
  }
}

// Function to determine which styles to inject based on URL
function injectStylesForCurrentPage() {
  const url = window.location.href;
  
  // First, remove all existing FPL restyle styles
  removeAllFPLStyles();
  
  // Always inject global styles
  injectCSS(styles.global);
  
  // Inject page-specific styles based on URL
  if (url.includes('/my-team') || url.endsWith('/my-team')) {
    injectCSS(styles.myTeam);
    console.log('FPL Restyle: Applied My Team page styles');
  }
  
  if (url.includes('/leagues') || url.includes('/league/')) {
    injectCSS(styles.league);
    console.log('FPL Restyle: Applied League page styles');
  }
  
  if (url.includes('/transfers') || url.includes('/transfer/')) {
    injectCSS(styles.transfers);
    console.log('FPL Restyle: Applied Transfers page styles');
  }
}

// Run the injection when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectStylesForCurrentPage);
} else {
  injectStylesForCurrentPage();
}

// Better SPA detection for React sites
let lastUrl = location.href;

// Method 1: Listen for popstate events (back/forward buttons)
window.addEventListener('popstate', () => {
  setTimeout(handleUrlChange, 100);
});

// Method 2: Listen for pushstate/replacestate (programmatic navigation)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  setTimeout(handleUrlChange, 100);
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  setTimeout(handleUrlChange, 100);
};

// Method 3: Poll for URL changes (fallback)
setInterval(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    handleUrlChange();
  }
}, 500);

// Method 4: Watch for React router changes via DOM mutations
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Check if the URL changed
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        handleUrlChange();
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Function to handle URL changes
function handleUrlChange() {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    
    // Remove all existing FPL restyle styles
    removeAllFPLStyles();
    
    // Inject new styles for the new page
    setTimeout(injectStylesForCurrentPage, 200);
    
    console.log('FPL Restyle: URL changed to', currentUrl);
  }
} 