class SettingsPanel{
    constructor(graph){
        this.graph = graph;

        this.registerBoolField("drawPoints");
        this.registerColorField("lineColor");
        this.registerNumField("xGridSpacing", 0, Infinity);
        this.registerNumField("yGridSpacing", 0, Infinity);
        this.registerNumField("xMax", -Infinity, Infinity);
        this.registerNumField("xMin", -Infinity, Infinity);
        this.registerNumField("yMax", -Infinity, Infinity);
        this.registerNumField("yMin", -Infinity, Infinity);
    }
    registerElementByName(value){
        this.registerElement(value, value);
    }
    registerElement(id, value){
        this[value] = document.getElementById(id);
        if(this[value] != null){
            this[value].value = this.graph[value];
        }
    }
    registerColorField(value){
        this.registerElementByName(value);
        this[value].addEventListener("change", (event) => {
            this.graph[value] = this[value].value;
        });
    }
    registerBoolField(value){
        this.registerElementByName(value);
        this[value].addEventListener("change", (event) => {
            this.graph[value] = this[value].checked;
        });
    }
    registerNumField(value, min, max) {
        this.registerElementByName(value);
        this[value].addEventListener("change", (event) => {
            var number = parseInt(this[value].value);
            if(number == NaN || number < min || number > max){
                this[value].value = this.graph[value];
            }
            else{
                this.graph[value] = number;
            }
        }); 
    }
}

class PointsPanel{
	constructor(){
		this.addCurveButton = document.getElementById("addCurveButton");
		this.addCurveButton.addEventListener("click", (event) => {
			G.getCurveDataProvider().create("Curve");
		});
	}
}

class SavePanel{
    constructor(){
        this.storageFiles = document.getElementById("storageFiles");
        this.saveName = document.getElementById("saveName");
        this.saveType = document.getElementById("saveType");
        this.storageFiles = document.getElementById("storageFiles");
        this.saveButton = document.getElementById("saveButton");
        this.removeStorageButton = document.getElementById("removeStorageButton");
        this.loadStorageButton = document.getElementById("loadStorageButton");
        this.loadFileButton = document.getElementById("loadFileButton");
        this.fileInput = document.getElementById("fileInput");

        this.saveButton.addEventListener("click", (event) => {
            var data = G.getDataLoader().saveData(this.saveName.value);
            if(this.saveType.value === "storage"){
                if(localStorage.getItem(this.saveName.value) != null){
                    G.getPopup().show("A file with this name already exists in local storage! Should I overwrite it?", (ans) => {
                        if(ans){
                            localStorage.setItem(this.saveName.value, data);
                            G.getPopup().show("File saved to local storage", null, "Ok", null);
                        }
                    });
                }
                else{
                    localStorage.setItem(this.saveName.value, data);
                    G.getPopup().show("File saved to local storage", null, "Ok", null);
                }
            }
            else if(this.saveType.value === "file"){
                this.downloadFile(this.saveName.value, data);
            }
            this.updateFileList();
        });
        this.loadStorageButton.addEventListener("click", (event) => {
            var data = localStorage.getItem(this.storageFiles.value);
            if(data != null){
                G.getDataLoader().loadData(data);
            }
        });
        this.removeStorageButton.addEventListener("click", (event) => {
            var data = localStorage.getItem(this.storageFiles.value);
            if(data != null){
                G.getPopup().show("Are you sure you want to delete the file?", (ans) => {
                    if(ans){
                        localStorage.removeItem(this.storageFiles.value);
                        this.updateFileList();
                    }
                });
            }
        });
        this.loadFileButton.addEventListener("click", (event) => {
            fileInput.click();
        });
        this.fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try{
                        G.getDataLoader().loadData(event.target.result);
                    }
                    catch{}
                };
                reader.readAsText(file);
            }
        });
        
        this.updateFileList();
    }
    downloadFile(name, content) {
        const blob = new Blob([content], { type: "text/plain" });
      
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    addStorageFileToList(name){
        var file = document.createElement("option");        
        file.text = name;
        file.value = name;
        this.storageFiles.appendChild(file);
    }
    clearStorageFileList(){
        this.storageFiles.innerHTML = "";
        this.addStorageFileToList("None");
    }
    updateFileList(){
        this.clearStorageFileList();
        for(var i = 0; i < localStorage.length; i++){
            var data = "";
            var key = localStorage.key(i);
            try{
                data = JSON.parse(localStorage.getItem(key));
            }
            catch{
                continue;
            }
            if(data != null && data.type === "datafile"){
                this.addStorageFileToList(key);
            }
        }
    }
};