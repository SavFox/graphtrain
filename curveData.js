class CurveData{
    constructor(name, tabProvider, graph){
		this.graph = graph;
		this.name = name;
		
        this.node = tabProvider.createTab(document.getElementById("curvePrototype"), document.getElementById("tab2"));
        this.textName = this.node.getElementsByClassName("textName")[0];
        this.textName.textContent = this.name;
        this.coordTable = this.node.getElementsByClassName("coordTable")[0];
		this.addRowButton = this.node.getElementsByClassName("addRowButton")[0];
		this.deleteCurve = this.node.getElementsByClassName("deleteCurve")[0];
		this.table = [];
		this.curve = this.graph.createCurve();
		
		this.addRowButton.addEventListener("click", (event) => {
			this.addCoordField();
		});
		this.deleteCurve.addEventListener("click", (event) => {
			G.getPopup().show("Are you sure you want to remove the line?", (ans) => { 
				if(ans == true){
					G.getCurveDataProvider().remove(this);
				} 
			});
		});
    }
	release(){
		this.graph.removeCurve(this.curve);
		this.node.remove();
	}
	onUpdateTable(){
		this.curve.clear();
		for(var i = 0; i < this.table.length; i++){
			this.curve.add(this.table[i]);
		}
		this.curve.compileSpline(1);
	}
    addCoordField(point = new Vector2(0, 0)){
        var row = this.coordTable.insertRow(-1);
		row.insertCell(0).innerHTML = '<input type="text" class="controlInputText" value="' + point.x + '">';
		row.insertCell(1).innerHTML = '<input type="text" class="controlInputText" value="' + point.y + '">';
		row.insertCell(2).innerHTML = '<button><i class="fa-solid fa-trash"></i></button>';
		this.table.push(point);
		var onRemove = (event) => {
			this.table.splice(row.rowIndex - 1, 1);
			row.remove();
			this.onUpdateTable();
		};
		var onChange = (event) => {
			var tableIndex = row.rowIndex - 1;
			var x = parseInt(row.cells[0].firstChild.value);
			var y = parseInt(row.cells[1].firstChild.value);
			if(tableIndex < this.table.length){
				if(x != NaN && y != NaN){
					this.table[tableIndex].x = x;
					this.table[tableIndex].y = y;
					this.onUpdateTable();
				}
				else{
					row.cells[0].firstChild.value = this.table[tableIndex].x;
					row.cells[1].firstChild.value = this.table[tableIndex].y;
				}
			}
		};
		row.cells[2].firstChild.addEventListener("click", onRemove);
		row.cells[0].firstChild.addEventListener("change", onChange);
		row.cells[1].firstChild.addEventListener("change", onChange);
		this.onUpdateTable();
    }
}