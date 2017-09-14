var myApp = angular.module('mpas', ['ngSanitize']);

myApp.filter('stripDomain', function() {
    return function(input) {
        input = input.replace(/\.nl/g, '');
        input = input.replace(/ NL/g, '');
        return input.replace(/\.com/g, '');
    };
});

myApp.controller('sidebar', ['$scope', '$window', function($scope, $window) {

    $scope.loaded = {
    	preferences: false,
    	spammers: false
    }

    $scope.getPreferences = function(){
        browser.storage.local.get(['preferences'], function(response){
            if (Object.keys(response).length !== 0) {
                $scope.preferences = response.preferences;
                if(cfg.logging) console.log('SIDEBAR: scope.getPreferences [local] ->', $scope.preferences);
            }
            else {
                $scope.preferences = cfg.default.preferences;
                if(cfg.logging) console.log('SIDEBAR: scope.getPreferences [default] ->', $scope.preferences);
            }
            $scope.$apply(); // update scope
        });
    };
    $scope.getPreferences();

    $scope.getSpammers = function(){
        browser.storage.local.get(['spammers'], function(response){
            if (Object.keys(response).length !== 0) {
                $scope.spammers = response.spammers;
                if(cfg.logging) console.log('SIDEBAR: scope.getSpammers [local] ->', $scope.spammers);
            }
            else {
                $scope.spammers = cfg.default.spammers;
                if(cfg.logging) console.log('SIDEBAR: scope.getSpammers [default] ->', $scope.spammers);
            }
            $scope.$apply(); // update scope
        });
    };
    $scope.getSpammers();

    $scope.getNightmode = function(){
        browser.storage.local.get(['nightmode'], function(response){
            if (Object.keys(response).length !== 0) {
                if(cfg.logging) console.log('SIDEBAR: scope.getNightmode [local] ->',response.nightmode);
                $scope.nightmode = response.nightmode;
            }
            else {
                $scope.nightmode = cfg.default.nightmode;
                if(cfg.logging) console.log('SIDEBAR: scope.getNightmode [default] ->',$scope.nightmode);
            }
            $scope.$apply(); // update scope
        });
    };
    $scope.getNightmode();

    $scope.getSpamCount = function(){
        browser.storage.local.get(['spamcount'], function(response){
            if (Object.keys(response).length !== 0) {
                if(cfg.logging) console.log('SIDEBAR: scope.getSpamCount [local] ->',response.spamcount);
                $scope.spamcount = response.spamcount;
            }
            else {
                $scope.spamcount = cfg.default.spamcount;
                if(cfg.logging) console.log('SIDEBAR: scope.getSpamCount [default] ->',$scope.spamcount);
            }
            $scope.$apply(); // update scope
        });
    };
    $scope.getSpamCount();

    $scope.reset = function($event){
        if ( window.confirm('Marktplaats Anti Spam herstellen naar fabrieksinstellingen?') ) {
            $scope.clearStorage().then(function(){
                $scope.preferences = cfg.default.preferences;
                $scope.spammers = cfg.default.spammers;

                if(cfg.logging) console.log('SIDEBAR: reset() ->');

                $scope.menu.open = false;
                $scope.$apply(); // update scope
                location.reload();
            });
        }
        $event.preventDefault();
    }

    $scope.$watch('preferences', function(newValue, oldValue) {
        // if(cfg.logging) console.log('SIDEBAR: watchPreferences');
        if (typeof oldValue !== 'undefined')
        {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                if(cfg.logging) console.log('SIDEBAR: watchPreferences -> changed from : ', oldValue);
                if(cfg.logging) console.log('SIDEBAR: watchPreferences -> changed to   : ', newValue);

                $scope.updatePreferences().then(function(){
                    if(cfg.logging) console.log('SIDEBAR: watchPreferences -> stored successfull');
                },function(){
                    if(cfg.logging) console.log('SIDEBAR: watchPreferences -> stored failed');
                });
            }
        }
        // else {
        //     if(cfg.logging) console.log('SIDEBAR: watchPreferences -> nothing changed');
        // }
    }, true);

    $scope.$watch('nightmode', function(newValue, oldValue) {
        // if(cfg.logging) console.log('SIDEBAR: watchNightmode');
        // if(cfg.logging) console.log(oldValue);
        // if(cfg.logging) console.log(newValue);
        
        if (typeof oldValue !== 'undefined')
        {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                if(cfg.logging) console.log('SIDEBAR: watchNightmode -> changed from : ', oldValue);
                if(cfg.logging) console.log('SIDEBAR: watchNightmode -> changed to   : ', newValue);

                $scope.updateNightmode().then(function(){
                    if(cfg.logging) console.log('SIDEBAR: watchNightmode -> store success');
                },function(){
                    if(cfg.logging) console.log('SIDEBAR: watchNightmode -> store failed');
                });
            }
        }
        // else {
        //     if(cfg.logging) console.log('SIDEBAR: watchNightmode -> nothing changed');
        // }
    }, true);


    $scope.showCover = true;
    $scope.showSearch = false;
    $scope.showPreferences = true;

    $scope.clearSpammers = function(){
        if(cfg.logging) console.log('SIDEBAR: clearSpammers()');
        $scope.spammers.spammers = [];
        $scope.updateSpammers();
    }


    $scope.clearPreferences = function(){
        if(cfg.logging) console.log('SIDEBAR: clearPreferences()');
        $scope.preferences = [];
        $scope.updatePreferences();
    }

    /**
    * Clears local storage
    */
    $scope.clearStorage = function(){
        if(cfg.logging) console.log('SIDEBAR: clearStorage()');
        return browser.storage.local.clear(); // promise
    }

    $scope.search = function(event) {
        event.preventDefault();
        if (!$scope.showSearch) {
            setTimeout(function() {
                $window.document.getElementById('spammer-search-input').focus()
            }, 0);
        }
        $scope.showSearch = !$scope.showSearch;
    }

    $scope.stats = function($event){
        $event.preventDefault();
        $scope.stats.active = !$scope.stats.active;
    }


    $scope.updateSpammers = function(){
        return browser.storage.local.set({spammers:$scope.spammers}); // promise
    }
    $scope.updatePreferences = function(){
        return browser.storage.local.set({preferences:$scope.preferences}); // promise
    }
    $scope.updateNightmode = function(){
        return browser.storage.local.set({nightmode:$scope.nightmode}); // promise
    }

    $scope.removeSpammer = function(event, spammer) {
        event.preventDefault();
        console.log($scope.spammers.spammers);
        for (var i = $scope.spammers.spammers.length - 1; i >= 0; i--) {
            if ($scope.spammers.spammers[i].id == spammer.id) {
                $scope.spammers.spammers.splice(i, 1);

                $scope.updateSpammers().then(
                    function(){
                        if(cfg.logging) console.log('SIDEBAR: removeSpammer -> storage updated succesfull');
                    },
                    function(){
                        if(cfg.logging) console.log('SIDEBAR: removeSpammer -> storage updated FAILED');
                    }
                );

                console.log($scope.spammers.spammers);
            }
        }
    }


}]);


/*
    refreshes sidebar if storage has changed
*/
function storageChangeListener(changes, area)
{
    // Spamcount changed
    if (JSON.stringify(changes.spamcount.oldValue) !== JSON.stringify(changes.spamcount.newValue)) {
        location.reload();
    }

    // Spammers changed
    var noSpammersOld = changes.spammers.oldValue.spammers.length;
    var noSpammersNew = changes.spammers.newValue.spammers.length;

    if (noSpammersOld !== noSpammersNew){
        if(cfg.logging) console.log('SIDEBAR: storageChangeListener -> count spammers from '+noSpammersOld+' to '+noSpammersNew);
        location.reload();
    }
}
browser.storage.onChanged.addListener(storageChangeListener);