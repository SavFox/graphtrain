window.addEventListener("load", (event) => {
    main();
});

var context = null;
var width = 0;
var height = 0;


var draw2d = null;
var slider = null;
var isShowPoints = null;
var graph = null;
var tabs = null;
var settingsPanel = null;
var collapseTab = null;
var popup = null;
var curveDataProvider = null;
var pointsPanel = null;
var savePanel = null;
var dataLoader = null;

let lastTime = 0;
const interval = 1000 / 30; 
function draw(time){
    const deltaTime = time - lastTime;
    if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);
		
        draw2d.newFrame();
		graph.draw();
        draw2d.render();
    }
    requestAnimationFrame(draw);
}

class G{
	static getPopup(){
		return popup;
	}
	static getCurveDataProvider(){
		return curveDataProvider;
	}
	static getGraph(){
		return graph;
	}
	static getDraw2D(){
		return draw2d;
	}
	static getDataLoader(){
		return dataLoader;
	}
}

function main(){
    slider = document.getElementById("rangeTest");
	isShowPoints = document.getElementById("isShowPoints");
    draw2d = new Draw2D(830, 630, "graph", document.getElementById("content"));
	popup = new Popup();
	tabs = new Tabs("controlTabs");
	
	graph = new Graph(draw2d, 0, 100, 0, 100);
	settingsPanel = new SettingsPanel(graph);
	pointsPanel = new PointsPanel();
	savePanel = new SavePanel();

	collapseTab = new ColapseTab();
	curveDataProvider = new CurveDataProvider(collapseTab, graph);

	dataLoader = new DataLoader(graph);
	var save = dataLoader.saveData("meiow");
	dataLoader.loadData(save);

    requestAnimationFrame(draw);
}