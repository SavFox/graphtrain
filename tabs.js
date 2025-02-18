class Tabs{
	constructor(btnParentID){
		this.btnParentID = btnParentID;
		
		var tabButtonsParent = document.getElementById(this.btnParentID);
		if(tabButtonsParent != null){
			this.btnList = tabButtonsParent.getElementsByClassName("tablinks");
			this.tabs = [];
			
			for(var i = 0; i < this.btnList.length; i++){
				var tabid = this.btnList[i].getAttribute("tabid");
				if(tabid != null){
					var tab = document.getElementById(tabid);
					if(tab != null){
						tab.style.display = "none";
						this.tabs.push(tab);
						var that = this;
						this.btnList[i].addEventListener('click', function(event){ 
							var clickID = this.getAttribute("tabid");
							that.openTab(clickID, event.currentTarget);
						}, false);
					}
				}
			}
			this.openFirstTab();
		}
		else{
			console.error("TabButtons parent not found!");
		}
	}
	openFirstTab(){
		if(this.tabs.length > 0){
			var btn = this.btnList[0];
			this.openTab(btn.getAttribute("tabid"), btn);
		}
	}
	openTab(id, btnClick){
		for(var i = 0; i < this.tabs.length; i++){
			var tab = this.tabs[i];
			if(tab.id == id){
				tab.style.display = "block";
			}
			else{
				tab.style.display = "none";
			}
		}
		for(var i = 0; i < this.btnList.length; i++){
			var btn = this.btnList[i];
			btn.className = btn.className.replace(" active", "");
		}
		btnClick.className += " active";
	}
}