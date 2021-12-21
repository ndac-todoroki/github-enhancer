exportAsJSON('manifest.json', {
    manifest_version: 2,
    name: "GitHub Enhancer",
    version: "1.0",
    description: "Adds more accessability to GitHub",

    icons: {
        48: "icons/border-48.png"
    },

    content_scripts: [
        {
            matches: [
                "*://github.com/*",
                "*://*.github.com/*",
            ],
            js: [
                'scripts/content-script.js'
            ],
            run_at: 'document_start',
        }
    ],

    options_ui: {
        // #if CHROME_MV3
        // #elif CHROME
        chrome_style: false,
        /* #elif FIREFOX
        browser_style: false,
        */
        // #endif
        // #if !SAFARI
        open_in_tab: true,
        // #endif
        page: 'pages/options.html',
    },

    permissions: [
        'activeTab',
    ],

    web_accessible_resources: [
        'pages/options.html'
    ],
});
