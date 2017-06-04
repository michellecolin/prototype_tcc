Diagram = {

	action: null,
	unistrokeCanvas: null,
  unistrokeCanvasRect: null,

  init: function() {
  	console.log("diagram");
  },

  actionStarted: function(action, elements) {
  	this.action = {
  		action: action,
  		elements: elements
  	}
  	console.log(this.action);
  },

  confirmAction: function() {
  	console.log("confirming action");
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;

    if (this.action) {
      $("#myCanvas").addClass("confirm");

      setTimeout(function() {
          $("#myCanvas").removeClass("confirm");
          _canvas.clearRect(0, 0, _rc.width, _rc.height);
      }, 1500);
    } else {
      alert("no action was performed");
      _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  }, 

  undoAction: function() {
    console.log("confirming undo");
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;
    $("#myCanvas").addClass("undo");
    
    setTimeout(function() {
        $("#myCanvas").removeClass("undo");
        _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }, 1500);
  }, 

  redoAction: function() {
    console.log("confirming redo");
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;
    $("#myCanvas").addClass("redo");
    
    setTimeout(function() {
        $("#myCanvas").removeClass("redo");
        _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }, 1500);
  },  

  cancelAction: function() {
    console.log("confirming cancel");
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;
    $("#myCanvas").addClass("cancel");
    
    setTimeout(function() {
        $("#myCanvas").removeClass("cancel");
        _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }, 1500);
  }  
}