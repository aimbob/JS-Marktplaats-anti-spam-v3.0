class ContentController
{
    constructor(config, doc){
        this.cfg = config;
        this.document = doc;
        this.spamcount = this.cfg.default.spamcount;
    }

    init(){
        if(this.cfg.logging) console.log('CONTENT: init');
        
        var controller = this;

        // retrieve preferences
        browser.storage.local.get(['preferences'], function(response){
            if(controller.cfg.logging) console.log('CONTENT: getPreferences ->', response.preferences);
            controller.preferences = response.preferences;

            // retrieve spammers
            browser.storage.local.get(['spammers'], function(response){
                if(controller.cfg.logging) console.log('CONTENT: getSpammers ->', response.spammers.spammers);
                controller.spammers = response.spammers.spammers;

                controller.hideAdds();
            });
        });
    }


    addSpamCount(intAmount){
        console.log('addSpamCount');
        var controller = this;

        // retrieve local
        browser.storage.local.get(['spamcount'], function(response){
            // response is present
            if (Object.keys(response).length !== 0) {
                controller.spamcount = response.spamcount;
            }

            controller.spamcount.count += intAmount;
            
            // store local
            controller.updateSpamCount(controller.spamcount).then(
                function(){
                    console.log('CONTENT: addSpamCount -> saved',controller.spamcount);
                },
                function(){
                    console.log('CONTENT: addSpamCount -> failed',controller.spamcount);
                }
            );
        });
    }

    /**
    * Stores given spamCount in local storage
    * @param {preferences} obj Object containing add-on preferences
    */
    updateSpamCount(objSpamCount){
        return browser.storage.local.set({spamcount:objSpamCount}); // promise
    }



    /**
     * Hides adds based on preferences
     */
    hideAdds(){
        this.hideGarbage();

        let count = 0;
        if(this.preferences.links) count += this.hideLinkAdds();
        if(this.preferences.daily) count += this.hideDailyAdds();
        if(this.preferences.top) count += this.hideTopAdds();
        if(this.preferences.admart) count += this.hideAdmartAdds();
        if(this.preferences.extra) this.hideExtraAdds();
        if(this.preferences.services) count += this.hideServiceAdds();
        if(this.preferences.spammers) count += this.hideSpammerAdds();
        if(this.cfg.logging) console.log('CONTENT: hideAdds() -> '+count+' adds removed on this page');

        if (Number.isInteger(count)){
            this.addSpamCount(count);
        }
    }

    /**
     * Hides empty DOM elements that contained adds but still take up screen real estate
     */
    hideGarbage(){
        if(this.cfg.logging) console.log('CONTENT: hideGarbage');   
        this.document.find('.other-listings').parents('section').remove();      // product/view -> Others viewed
        this.document.find('#banner-top, #adsense-top').remove();               // product/index -> Bannerss top
        this.document.find('#banner-viptop, .banner-viptop').remove();          // layout -> Top horizontal banner
        this.document.find('#top-banner-wrapper, .main-banners').remove();      // homepage -> top banners
        $(".feature-banner .content").remove();                                 // hide 'laat advertentie opvallen' banner
    }

    /**
     * Hides adds containing a paid link
     * @returns int Count of removed 'Marktplaats Dagtopper' adds
     */
    hideLinkAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideLinkAdds');
        let count = this.document.find('.seller-link').parents('article').remove().length;
        return count;
    }

    /**
     * Hides 'Marktplaats Dagtopper' adds
     * @returns int Count of removed 'Marktplaats Dagtopper' adds
     */
    hideDailyAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideDailyAdds');
        let count = this.document.find(":contains('Dagtopper')").parents('article').remove().length;
        return count;
    }

    /**
     * Hides 'Marktplaats Topadvertentie' adds
     * @returns int Count of removed 'Marktplaats Topadvertentie' adds
     */
    hideTopAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideTopAdds');
        let count = this.document.find(":contains('Topadvertentie')").parents('article').remove().length;
        return count;
    }

    /**
     * Hides 'Marktplaat Extra' adds
     * @returns int Count of removed 'Marktplaats Admarkt' adds
     */
    hideAdmartAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideAdmartAdds');
        this.document.find('#bottom-listings-divider').remove();
        this.document.find('.mp-adsense-header').remove();
        let count = this.document.find('.bottom-listing').remove().length;
        return count;
    }

    /**
     * Hides 'Marktplaat Extra' adds
     */
    hideExtraAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideExtraAdds');
        this.document.find('.horizontal-extended-listing').remove();
        this.document.find('.horizontalRichSnippet').remove();
    }

    /**
     * Hides service adds
     * @returns int Count of removed adds from spammers
     */
    hideServiceAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideServiceAdds');
        let count = this.document.find("a[href^='http://diensten-vakmensen.marktplaats.nl/']").parents('article').remove().length;
        return count;
    }

    /**
     * Hides adds from spammers
     * @returns int Count of removed adds from spammers
     */
    hideSpammerAdds(){
        if(this.cfg.logging) console.log('CONTENT: hideSpammerAdds');
        var count = 0;

        for (var i = 0; i < this.spammers.length; i++) {
            let c = this.document.find('.search-result a[href*='+this.spammers[i].id+']').parents('article').remove().length;
            count += c;
        }

        return count;
    }

    /**
     * Refreshes content page if storage has changed
     * @param {changes} obj Object describing the changes made to storage.
     * @param {area} str The name of the storage area ("sync", "local" or "managed") to which the changes were made.
     */
    checkStorageChanges(changes, area) {

        // changes in spammers
        if (changes.spammers){
            var noSpammersOld = changes.spammers.oldValue.spammers.length;
            var noSpammersNew = changes.spammers.newValue.spammers.length;

            if (noSpammersOld !== noSpammersNew){
                if(cfg.logging) console.log('CONTENT: spammers changed -> refreshing page');
                location.reload();
            }
        }

        // changes in preferences
        if (changes.preferences){
            var preferencesOld = changes.preferences.oldValue;
            var preferencesNew = changes.preferences.newValue;

            // refresh page only change when changed
            if (JSON.stringify(preferencesOld) !== JSON.stringify(preferencesNew)) {
                if(cfg.logging) console.log('CONTENT: preferences changed -> refreshing page');
                location.reload();
            }
        }
    }
}