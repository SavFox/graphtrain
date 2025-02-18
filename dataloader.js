class Curve {
	constructor() {
		this.points = [];
		this.splineType = 0;
		this.spline = null;
	}
	add(point){
		this.points.push(point);
	}
	clear(){
		this.points = [];
	}
	compileSpline(splineType = 0){
		this.splineType = splineType;
		this.spline = null;
		if(this.splineType == 1){
			var x = [];
			var y = [];
			for(var i = 0; i < this.points.length; i++){
				var point = this.points[i];
				x.push(point.x);
				y.push(point.y);
			}
			this.spline = new CubicSpline(x, y);
		}
	}
	toString(){
		var text = "Curve(";
		for(let i = 0; i < this.points.length; i++){
			text += this.points[i].toString() + " ";
		}
		return text + ");";
	}
}

class DataLoader{
    constructor(graph){
        this.graph = graph;
    }
    saveData(filename){
        var curveData = [];
        var cData = G.getCurveDataProvider().getCurveData();
        for(var i = 0; i < cData.length; i++){
            curveData.push({
                name: cData[i].name,
                points: cData[i].curve.points,
            });    
        }
        var fileStructure = {
            name: filename,
            curves: curveData,
            type: "datafile",
            
            xMax: this.graph.xMax,
            xMin: this.graph.xMin,
            yMax: this.graph.yMax,
            yMin: this.graph.yMin,
            outlineSize: this.graph.outlineSize,
            strokeSize: this.graph.strokeSize,
            textSize: this.graph.textSize,
            drawPoints: this.graph.drawPoints,
            pointSize: this.graph.pointSize,
            lineColor: this.graph.lineColor,
            xGridSpacing: this.graph.xGridSpacing,
            yGridSpacing: this.graph.yGridSpacing
        };
        try{
            return JSON.stringify(fileStructure);
        }
        catch{
            return "{}";
        }
    }
    isValid(data, value){
        if(data[value] == undefined || data[value] == null){
            return false;
        }
        return true;
    }
    setWithCheck(value, data, object){
        if(this.isValid(data, value)){
            object[value] = data[value];
        }
    }
    loadData(json){
        var data = null;
        try{
            data = JSON.parse(json);
        }
        catch{
            return;
        }
        if(this.isValid(data, "type")){
            if(data.type != "datafile"){
                return;
            }
        }
        this.setWithCheck("xMax", data, this.graph);
        this.setWithCheck("xMin", data, this.graph);
        this.setWithCheck("yMax", data, this.graph);
        this.setWithCheck("yMin", data, this.graph);

        this.setWithCheck("outlineSize", data, this.graph);
        this.setWithCheck("strokeSize", data, this.graph);
        this.setWithCheck("textSize", data, this.graph);
        this.setWithCheck("strokeSize", data, this.graph);
        this.setWithCheck("drawPoints", data, this.graph);
        this.setWithCheck("pointSize", data, this.graph);
        this.setWithCheck("lineColor", data, this.graph);
        this.setWithCheck("xGridSpacing", data, this.graph);
        this.setWithCheck("yGridSpacing", data, this.graph);

        if(this.isValid(data, "curves")){
            var cData = data["curves"];
            var points = null;
            var curve = null;
            G.getCurveDataProvider().clear();
            for(var i = 0; i < cData.length; i++){
                if(this.isValid(cData[i], "name") && this.isValid(cData[i], "points")){
                    curve = G.getCurveDataProvider().create(cData[i].name);  
                    points = cData[i].points;
                    for(var b = 0; b < points.length; b++){
                        if(this.isValid(points[b], "x") && this.isValid(points[b], "y")){
                            curve.addCoordField(new Vector2(points[b].x, points[b].y));    
                        }
                    }     
                }
            }
        }
    }
}