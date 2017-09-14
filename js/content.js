var controller = new ContentController(cfg, $(document));
controller.init();

// Hack to send sellername to WebExtensions background
// Unable to send element to background with WebExtensions contextMenus
$('.seller-name a').each(function( index ) {
	var href = $(this).attr('href');
	var name = $(this).text();
	var string = href+'#'+name.replace(/ /g,'%20');
	$(this).attr({href:string});
});

browser.storage.onChanged.addListener(controller.checkStorageChanges);