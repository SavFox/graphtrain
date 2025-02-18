const mapNumber = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

function validNumberInput(event, min, max){
	var text = event.currentTarget.value;
	if(text < min){
		event.currentTarget.value = min;
	}
	if(text > max){
		event.currentTarget.value = max;
	}
}

class Vector2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	toString(){
		return "Point(" + this.x + ", " + this.y + ");";
	}
}