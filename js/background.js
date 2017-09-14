var background = new BackgroundController(cfg);
background.init();

// RIGHT CLICK MENU
browser.contextMenus.create({
    id: "clickme",
    targetUrlPatterns: [
        "*://*.marktplaats.nl/verkopers/*"
    ],
    title: "Blokkeer gebruiker op marktplaats",
    contexts: ["all"],
    onclick: function(onClickData, tab) {
        sellerId = onClickData.linkUrl.match(/\d+/)[0];
        sellerName = onClickData.linkUrl.split('#')[1];
        sellerName = sellerName.replace(/%27/g,"'");
        sellerName = sellerName.replace(/%20/g,' ');
        // sellerName = sellerName.replace(/-/g,' ');
        background.addSpammer(sellerId, sellerName);
    }
});

/*
    refreshes sidebar if storage has changed
*/
function storageChangeListener(changes, area) {
    var noSpammersOld = changes.spammers.oldValue.spammers.length;
    var noSpammersNew = changes.spammers.newValue.spammers.length;

    if (noSpammersOld !== noSpammersNew){
        if(cfg.logging) console.log('BACKGROUND: storageChangeListener -> count spammers from '+noSpammersOld+' to '+noSpammersNew);
        background.spammers = background.getSpammers();
    }
}
browser.storage.onChanged.addListener(storageChangeListener);