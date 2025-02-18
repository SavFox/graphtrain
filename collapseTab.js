class ColapseTab{
    constructor(){
        this.elements = document.getElementsByClassName("collapseTab");
        for(var i = 0; i < this.elements.length; i++){
            this.registerTab(this.elements[i]);
        }
    }
    registerTab(element, collapse = true){
        var button = element.getElementsByClassName("collapseButton")[0];
        var content = element.getElementsByClassName("collapseTabContent")[0];
        var infoText = element.getElementsByClassName("collapseInfo")[0];
        if(button != undefined && content != undefined){
            if(collapse){
                content.style.display = "none";
                infoText.textContent = "+";
            }
            else{
                content.style.display = "block";
                infoText.textContent = "-";
            }
            button.addEventListener("click", (event) => {
                if(content.style.display == "none" || content.style.display == ""){
                    content.style.display = "block";
                    infoText.textContent = "-";
                }
                else{
                    content.style.display = "none";
                    infoText.textContent = "+";
                }
            });
        }
    }
    createTab(prototype, parent, collapse = true, id = ""){
        var node = prototype.cloneNode(true);
        node.id = id;
        parent.appendChild(node);
        node.style.display = "block";
        this.registerTab(node, collapse);
        return node;
    }
}