class Draw2D{
    constructor(width, height, id, parent = null){
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.id = id;
        if(parent != null){
            parent.appendChild(this.canvas);
        }

        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.textSize = 14;
        this.textFont = "Arial";
        this.textColor = "black";

        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = this.canvas.width;
        this.bufferCanvas.height = this.canvas.height;
        this.bufferContext = this.bufferCanvas.getContext("2d");
    }
    getCanvas(){
        return this.canvas;
    }
    newFrame() {
        this.bufferContext.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
    }
	setTextSize(size){
		this.textSize = size;
	}
	setTextColor(color){
		this.textColor = color;
	}
	setTextFont(font){
		this.textFont = font;
	}
	applyTextParams(){
		this.bufferContext.fillStyle = this.textColor;
		this.bufferContext.font = this.textSize + "px " + this.textFont;
	}
	getTextWidth(str){
		this.applyTextParams();
		return this.bufferContext.measureText(str).width;
	}
    drawRect(x, y, w, h, color){
        this.bufferContext.fillStyle = color;
        this.bufferContext.fillRect(x, y, w, h);
    }
    drawLine(x1, y1, x2, y2, width, color){
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(x1, y1);
        this.bufferContext.lineTo(x2, y2);
        this.bufferContext.lineWidth = width;
        this.bufferContext.strokeStyle = color;
        this.bufferContext.stroke();
    }
	drawPoint(x, y, w, h, color){
		let w2 = w / 2;
		let h2 = h / 2;
		this.drawRect(x - w2, y - h2, w, h, color);
	}
	drawText(str, x, y, hAlign = "left") {
		this.applyTextParams();
		
		var w = this.getTextWidth(str);
		if(hAlign == "right"){
			x -= w;
		} else if(hAlign == "center"){
			x -= w / 2
		}
		this.bufferContext.fillText(str, x, y);
	}
    beginLine(x, y, width, color){
        this.bufferContext.beginPath();
        this.bufferContext.moveTo(x, y);
        this.bufferContext.lineWidth = width;
        this.bufferContext.strokeStyle = color;
    }
    endLine(){
        this.bufferContext.stroke();
    }
    addLinePoint(x, y){
        this.bufferContext.lineTo(x, y);
    }
    render(){
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.bufferCanvas, 0, 0);
    }
}