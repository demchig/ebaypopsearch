function DemibayViewModel() {
    // Data
    var self = this;

    var allSites = [{id: "ALL", name : "All Sites"}]
	for(var key in SITE_IDS){
		allSites.push({
			id   : key,
			name : SITE_IDS[key],
		})
	}
    self.sites = ko.observableArray(allSites);
    self.categories = ko.observableArray(CATEGORIES);
    self.sitePopItems = ko.observableArray([]);

    self.siteId = ko.observable("0");
    self.categoryId = ko.observable("0");
    self.keyword = ko.observable("Daiso");

    // Behaviours
    self.loadPopularItems = function()
    {
    	if( ! self.keyword() ){
    		alert("Enter Keyword!");
    		return false;
    	}

    	self.sitePopItems.removeAll();

    	var siteId = self.siteId();
    	var sites = [{
    		id : siteId,
    		name : SITE_IDS[siteId],
    	}];

    	if( siteId == "ALL" ){
    		sites = allSites;
    	}
		//console.log(sites)
		
		// get popular items
		for(var i in sites){
			var siteId = sites[i].id;

			var path = [siteId, self.categoryId(), self.keyword()].join('/');

			$.get( "/ebayapi/api/popularItems/" + path , function( data ){
				for( var i in data.items ){
					if( ! data.items[i]["GalleryURL"] ){
						data.items[i]["GalleryURL"] = "";
					}
				}

				var siteName = SITE_IDS[data.siteId];
				var sitePopItem = {
					siteId : data.siteId,
					siteName : siteName,
					catId : data.catid,
					popItems : data.items,
				}
				console.log(sitePopItem);
				self.sitePopItems.push(sitePopItem);
			});
		}
    };

};


// initialize etc.	
var demibayViewModel = new DemibayViewModel();

//demibayViewModel.loadSites();

//demibayViewModel.loadPopularItems();

ko.applyBindings(demibayViewModel);
