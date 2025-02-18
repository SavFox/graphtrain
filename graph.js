class Graph{
	constructor(draw2d, xMin, xMax, yMin, yMax){
		this.draw2d = draw2d;
		this.curves = [];
		this.xMax = xMax;
		this.xMin = xMin;
		this.yMax = yMax;
		this.yMin = yMin;
		this.outlineSize = 50;
		this.strokeSize = 5;
		this.textSize = 14;
		this.drawPoints = false;
		this.pointSize = new Vector2(10, 10);
		this.lineColor = "#13b620";
		this.xGridSpacing = 10;
		this.yGridSpacing = 10;
	}
	setPointSize(size){
		this.pointSize = size;
	}
	createCurve(){
		var curve = new Curve();
		this.curves.push(curve);
		return curve;
	}
	removeCurve(curve){
		var index = this.curves.indexOf(curve);
		if(index != -1){
			this.curves.splice(index, 1);
		}
	}
	toString(){
		var text = "Graph(\n";
		for(var i = 0; i < this.curves.length; i++){
			text += this.curves[i].toString() + "\n";
		}
		return text + ");";
	}
	getPointOnGraph(point){
		var x = mapNumber(point.x, this.xMin, this.xMax, this.outlineSize, this.draw2d.width);
		var y = mapNumber(point.y, this.yMin, this.yMax, this.outlineSize, this.draw2d.height);
		y = this.draw2d.height - y;
		return new Vector2(x, y);
	}
	drawLineCurve(curve){
		var startPoint = this.getPointOnGraph(curve.points[0]);
		this.draw2d.beginLine(startPoint.x, startPoint.y, 2, this.lineColor);
		for(let i = 1; i < curve.points.length; i++){
			var tmp = this.getPointOnGraph(curve.points[i]);
			this.draw2d.addLinePoint(tmp.x, tmp.y);
		}
		this.draw2d.endLine();
	}
	getLineIntersection(line1Start, line1End, line2Start, line2End) {
		var x1 = line1Start.x, y1 = line1Start.y;
		var x2 = line1End.x, y2 = line1End.y;
		var x3 = line2Start.x, y3 = line2Start.y;
		var x4 = line2End.x, y4 = line2End.y;

		var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (denom === 0) {
			return null;
		}

		var intersectX = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
		var intersectY = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
		return new Vector2(intersectX, intersectY);
	}
	getZeroPoint(curve){
		var spline = curve.spline;
		var xRange = new Vector2(curve.points[0].x, curve.points.at(-1).x);
		var zeroPoint = new Vector2(this.xMin, this.yMin);
		var iSpace = 1;
		for(let i = xRange.x; i <= xRange.y; i += iSpace){
			var y = spline.at(i);
			if(i < this.xMin || y < this.yMin){
				continue;
			}
			zeroPoint = new Vector2(i, y);
			if(i > xRange.x){
				var prevPoint = new Vector2(i - iSpace, spline.at(i - iSpace));
				var inters = this.getLineIntersection(prevPoint, zeroPoint, new Vector2(this.xMin, this.yMin), new Vector2(this.xMax, this.yMin));
				if(inters != null){
					if(inters.x >= this.xMin){
						return inters;
					}
				}
			}
			break;
		}
		return zeroPoint;
	}
	drawSplineCurve(curve){
		if(curve.points.length < 2){
			return;
		}
		var spline = curve.spline;
		var zero = this.getZeroPoint(curve);
		var startPoint = this.getPointOnGraph(zero);
		var xRange = new Vector2(zero.x, curve.points.at(-1).x);
		
		this.draw2d.beginLine(startPoint.x, startPoint.y, 2, this.lineColor);
		var i = xRange.x;
		for(; i <= xRange.y; i++){
			var y = spline.at(i);
			var tmp = this.getPointOnGraph(new Vector2(i, y));
			this.draw2d.addLinePoint(tmp.x, tmp.y);
		}
		if(i != xRange.y){
			var y = spline.at(xRange.y);
			var tmp = this.getPointOnGraph(new Vector2(xRange.y, y));
			this.draw2d.addLinePoint(tmp.x, tmp.y);
		}
		this.draw2d.endLine();
	}
	drawCurve(curve){
		if(curve.points.length == 0){
			return;
		}
		if(curve.spline == null){
			this.drawLineCurve(curve);
		}
		else{
			this.drawSplineCurve(curve);
		}
		if(this.pointSize.x > 0 && this.pointSize.y > 0 && this.drawPoints){
			for(let i = 0; i < curve.points.length; i++){
				var point = curve.points[i];
				if(point.x >= this.xMin && point.y >= this.yMin){
					var pointPos = this.getPointOnGraph(point);
					this.draw2d.drawPoint(pointPos.x, pointPos.y, this.pointSize.x, this.pointSize.y, "red");
				}
			}
		}
	}

	draw(){		
		//Draw Zero line
		var posOnGraph = this.getPointOnGraph(new Vector2(this.xMin, this.yMin));
		this.draw2d.drawLine(this.outlineSize - this.strokeSize, posOnGraph.y, this.draw2d.width, posOnGraph.y, 2, "black");
		this.draw2d.drawLine(posOnGraph.x, 0, posOnGraph.x, this.draw2d.height - this.outlineSize + this.strokeSize, 2, "black");
		
		if(this.xMin == 0 && this.yMin == 0){
			this.draw2d.drawText("0", posOnGraph.x - 5, posOnGraph.y + 5, "right");
		}
		else{
			this.draw2d.drawText(this.yMin.toString(), posOnGraph.x - 5, posOnGraph.y + 5, "right");
			this.draw2d.drawText(this.xMin.toString(), posOnGraph.x, posOnGraph.y + 15, "center");
		}
		
		if(this.yMax > 0){
			for(var i = this.yMin + this.yGridSpacing; i < this.yMax; i += this.yGridSpacing){
				posOnGraph = this.getPointOnGraph(new Vector2(this.xMin, i));
				this.draw2d.drawLine(this.outlineSize - this.strokeSize, posOnGraph.y, this.draw2d.width, posOnGraph.y, 1, "gray");
				this.draw2d.drawText(i.toString(), posOnGraph.x - 5, posOnGraph.y + 5, "right");
			}
		}
		if(this.yMin < 0){
			for(var i = this.yMin - this.yGridSpacing; i > this.yMin; i -= this.yGridSpacing){
				posOnGraph = this.getPointOnGraph(new Vector2(this.xMin, i));
				this.draw2d.drawLine(this.outlineSize - this.strokeSize, posOnGraph.y, this.draw2d.width, posOnGraph.y, 1, "gray");
				this.draw2d.drawText(i.toString(), posOnGraph.x - 5, posOnGraph.y + 5, "right");
			}
		}
		
		if(this.xMax > 0){
			for(var i = this.xMin + this.xGridSpacing; i < this.xMax; i += this.xGridSpacing){
				posOnGraph = this.getPointOnGraph(new Vector2(i, this.yMin));
				this.draw2d.drawLine(posOnGraph.x, 0, posOnGraph.x, this.draw2d.height - this.outlineSize + this.strokeSize, 1, "gray");
				this.draw2d.drawText(i.toString(), posOnGraph.x, posOnGraph.y + 15, "center");
			}
		}
		if(this.xMin < 0){
			for(var i = this.xMin - this.xGridSpacing; i > this.xMin; i -= this.xGridSpacing){
				posOnGraph = this.getPointOnGraph(new Vector2(i, this.yMin));
				this.draw2d.drawLine(posOnGraph.x, 0, posOnGraph.x, this.draw2d.height - this.outlineSize + this.strokeSize, 1, "gray");
				this.draw2d.drawText(i.toString(), posOnGraph.x, posOnGraph.y + 15, "center");
			}
		}
		
		for(var i = 0; i < this.curves.length; i++){
			this.drawCurve(this.curves[i]);
		}
	}
}