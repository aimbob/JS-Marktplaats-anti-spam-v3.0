var cfg = {

    logging: false,

    background: {
        blockUrls: [
            "*://*.2mdn.net/*",                 // It appears that 2mdn.net is a domain registered by Google which was previously used by the DoubleClick ad network for some purpose.
            "*://*.360yield.com/*",             // Improve Digital - For Transparency. For Revenue. For Content Providers.
            "*://*.adnxs.com/*",                // Adnxs™ is a portal for Publishers to the AppNexus® online auction exchange used to sell advertising space
            "*://*.amazonaws.com/*",            // Amazon Web Services (AWS) -  Cloud Computing Services
            "*://*.atdmt.com/*",                // ATDMT is a tracking cookie served by Facebook subsidiary Atlas Solutions and used as a third-party cookie by several websites. The cookie originates from the domain atdmt.com which is owned by Atlas.
            "*://*.atlassbx.com/*",             // 
            "*://*.bannerflow.com/*",           // The leading Display Ad Production Platform
            "*://*.cloudfront.net/*",           // It is a redirect to Amazon CloudFront. Amazon CloudFront is a web service for content delivery. It integrates with other Amazon Web Services to give developers and businesses an easy way to distribute content to end users with low latency, high data transfer speeds, and no commitments.
            "*://*.criteo.com/*",               // Real-Time Digital Advertising That Works | Criteo
            "*://*.criteo.net/*",               // Real-Time Digital Advertising That Works | Criteo
            "*://*.doubleclick.net/*",          // DoubleClick - Digital Advertising Solutions
            "*://*.facebook.com/*",             // Facebook garbage
            "*://*.facebook.net/*",             // Facebook garbage
            "*://*.markandmini.com/*",          // creates profiles of online visitors
            "*://*.nanigans.com/*",             // Nanigans – Advertising Automation Software | The leading advertising platform to find and remarket to your most valuable customers across social and mobile.
            "*://*.revsci.net/*",               // Audience Science which is an advertising company that is part of a network of sites, cookies, and other technologies used to track users
            "*://*.scorecardresearch.com/*",    // ScorecardResearch conducts research by collecting Internet web browsing data and then uses that data to help show how people use the Internet, what they like about it, and what they don’t.
            "*://*.tribalfusion.com/*",         // Exponential Interactive is a global provider of advertising intelligence and digital media solutions to brand advertisers.
            "*://*.userzoom.com/*",             // With UserZoom's cloud-based UX Research platform, brands can now test, measure, and monitor online user experience testing with our all-in-one platform.
            "*://*.yieldlab.net/*",             // Premium Programmatic Advertising; Yieldlab is the leading Supply Side Platform (SSP) and Solution for private marketplaces within Europe's premium publishing industry.
            "*://*.googlesyndication.com/*",
            "*://*.google-analytics.com/*",
            "*://*.googletagmanager.com/*",
            "*://*.googletagservices.com/*",
            "*://*.googletagservices.com/*",
            // "*://*.marktplaats.com/*ads.js",
            // "*://*.marktplaats.com/*nalytics*.js",
            // "*://*.marktplaats.com/*common.js",
            "*://*.google.com/adsense*.js"
        ]
    },

    default: {
        preferences: {
            links: false,
            daily: false,
            top: false,
            admart: false,
            extra: false,
            services: false,
            spammers: false
        },
        spammers: {
            sort: 'date',
            reverse: true,
            search: '',
            spammers: []
        },
        nightmode: {
            active: false
        },
        spamcount: {
            count: 0
        }
    }

}


