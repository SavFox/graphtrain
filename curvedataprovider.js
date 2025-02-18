class CurveDataProvider{
	constructor(collapseTab, graph){
		this.collapseTab = collapseTab;
		this.graph = graph;
		this.curveData = [];
	}
	create(name){
		var c = new CurveData(name, this.collapseTab, this.graph);
		this.curveData.push(c);
		return c;
	}
	remove(curveData){
		var index = this.curveData.indexOf(curveData);
		if(index != -1){
			this.curveData[index].release();
			this.curveData.splice(index, 1);
		}
	}
	clear(){
		for(var i = 0; i < this.curveData.length; i++){
			this.remove(this.curveData[i]);
		}
	}
	getCurveData(){
		return this.curveData;
	}
}