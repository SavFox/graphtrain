class Popup{
	constructor(){
		this.popupText = document.getElementById("popupText");
		this.callback = null;
		this.popupBody = document.getElementById("popup");
		this.overlay = document.getElementById("overlay");
		this.popupYes = document.getElementById("popupYes");
		this.popupNo = document.getElementById("popupNo");
		
		this.popupYes.addEventListener("click", (event) => {
			if(this.callback != null){
				this.callback(true);
			}
			this.hide();
		});
		this.popupNo.addEventListener("click", (event) => {
			if(this.callback != null){
				this.callback(false);
			}
			this.hide();
		});
	}
	show(text, callback, btnYesText = "Yes", btnNoText = "No"){
		this.popupText.textContent = text;

		if(btnYesText == null){
			this.popupYes.style.display = "none";
		}
		else{
			this.popupYes.style.display = "inline";
		}

		if(btnNoText == null){
			this.popupNo.style.display = "none";
		}
		else{
			this.popupNo.style.display = "inline";
		}

		this.popupYes.textContent = btnYesText;
		this.popupNo.textContent = btnNoText;
		this.callback = callback;
		this.overlay.style.display = "block";
		this.popupBody.style.display = "block";
	}
	hide(){
		this.popupText.value = "none";
		this.callback = null;
		this.overlay.style.display = "none";
		this.popupBody.style.display = "none";
	}
}