class BackgroundController
{
    constructor(config)
    {
        this.cfg = config;
        this.preferences = this.getPreferences();
        this.spammers = this.getSpammers();
    }

    init()
    {
        this.attachListeners();

        browser.storage.local.set({spammers:{
            sort: 'date',
            reverse: true,
            search: '',
            spammers: [
                { id: '9134108', name: 'RetroGameFreak', date: '1498207521' },
                { id: '8134208', name: 'Games Garage', date: '1498215107' },
                { id: '6134208', name: 'MyXLshop', date: '1465404320' },
                { id: '9184208', name: 'Tweek.nl', date: '1498207521' },
                { id: '4134208', name: 'Gameland-Groningen', date: '1498207521' },
                { id: '5134208', name: 'Theboxprotectorshop NL', date: '1498207521' },
                { id: '1139208', name: 'TheRetroGameShop', date: '1498207521' },
                { id: '9134208', name: 'MAD-GAMESHOP', date: '1498207521' },
                { id: '3734608', name: 'Kend Used Items', date: '1498207521' },
                { id: '9734208', name: 'Xclusif collectibles', date: '1498207521' },
                { id: '9134708', name: 'Used Products Groningen', date: '1498207521' },
                { id: '9234209', name: 'Mario64.nl', date: '1498207521' },
                { id: '9134204', name: 'HLHV', date: '1498207521' },
                { id: '9834205', name: 'Game-Outlet NL', date: '1498207521' },
                { id: '9164202', name: 'RetroNintendoKopen.nl', date: '1498207521' },
                { id: '9134201', name: 'Used Products Heerlen', date: '1498207521' }
            ]
        }});

        // this.clearStorage();
    }

    /**
    * Retrieves preferences from local storage
    */
    getPreferences(){
        var controller = this;

        browser.storage.local.get(['preferences'], function(response){
            // check if preferences are set
            if (Object.keys(response).length !== 0) {
                controller.preferences = response.preferences;
            }
            else {
                controller.preferences = controller.cfg.default.preferences;
                controller.updatePreferences(controller.preferences);
            }
        });
    }

    /**
    * Retrieves spammers from local storage
    */
    getSpammers(){
        var controller = this;

        browser.storage.local.get(['spammers'], function(response){
            // check if spammers are set
            if (Object.keys(response).length !== 0) {
                controller.spammers = response.spammers;
            }
            else {
                controller.spammers = controller.cfg.default.spammers;
                controller.updateSpammers(controller.spammers);
            }
        });
    }

    /**
    * Stores given preferences in local storage
    * @param {preferences} obj Object containing add-on preferences
    */
    updatePreferences(preferences){
        return browser.storage.local.set({preferences:preferences}); // promise
    }

    /**
    * Stores given spammers in local storage
    * @param {spammers} obj Object containing spammer + spammer related settings
    */
    updateSpammers(spammers){
        return browser.storage.local.set({spammers:spammers}); // promise
    }

    /**
    * Clears local storage
    */
    clearStorage(){
        return browser.storage.local.clear(); // promise
    }

    /**
    * Attach listener to block certain requests
    */
    attachListeners(){
        browser.webRequest.onBeforeRequest.addListener(
          this.blockRequest,
          {urls: this.cfg.background.blockUrls},
          ["blocking"]
        );
    }

    /**
    * Adds spammer to collection and stores locally
    * @param {sellerId} str The id of seller
    * @param {sellerName} str The name of seller
    */
    addSpammer(sellerId, sellerName){
        
        // add if not present in spammer collection
        if(this.spammers.spammers.filter(x => x.id === sellerId).length > 0){
            if(this.cfg.logging) console.log('BACKGROUND: addSpammer -> spammer '+sellerName+' ('+sellerId+') already present');
        }
        else {
            if(this.cfg.logging) console.log('BACKGROUND: addSpammer -> spammer '+sellerName+' ('+sellerId+') added');

            this.spammers.spammers.push({
                id:sellerId,
                name:sellerName,
                date:Math.floor(Date.now() / 1000)
            });

            this.updateSpammers(this.spammers);
        }
    }

    /**
    * block certain advertisement URL requests
    * @param {request} obj The id of seller
    */
    blockRequest(request){
        // only block request if given from domain marktplaats.nl
        if(request.originUrl.indexOf('https://www.marktplaats.nl/') !== -1){
            console.log({ success: 'BLOCK', type: request.type, url: request.url, req: request.originUrl });
            return { cancel: true };
        }
        else {
            return { cancel: false };
        }
    }
}