Diagram = {

	action: null,
	unistrokeCanvas: null,
  unistrokeCanvasRect: null,
  lastActionPerformed: null,
  elements: [],

  init: function() {
  },

  actionStarted: function(action, elements) {
  	this.action = {
  		name: action,
  		elements: elements
  	}
  },

  confirmAction: function() {
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;

    if (this.action) {
      $("#myCanvas").addClass("confirm");
      var diagramElements = Canvas.createElements(this.action.elements);
      console.log("create");
      console.log(diagramElements);
      if (diagramElements) {
        removeInsertElementsPanel();
        resetElementsToBeAdded();
        this.elements.allElements = diagramElements.allElements;
        this.lastActionPerformed = {name: "insert", elements: diagramElements.elementsAdded};
        console.log(this.lastActionPerformed);
      }

      setTimeout(function() {
          $("#myCanvas").removeClass("confirm");
          _canvas.clearRect(0, 0, _rc.width, _rc.height);
      }, 800);
    } else {
      showErrorModal("No action was performed");
      _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  }, 

  undoAction: function() {
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;

    if (this.action && this.lastActionPerformed) {
      $("#myCanvas").addClass("undo");
      
      switch (this.lastActionPerformed.name) {
        case "insert":
          Canvas.removeElements(this.lastActionPerformed.elements); 
          this.lastActionPerformed.name = "removeElements";
          break;
      }

      setTimeout(function() {
          $("#myCanvas").removeClass("undo");
          _canvas.clearRect(0, 0, _rc.width, _rc.height);
      }, 800);
    } else {
      showErrorModal("No action was performed");
      _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  }, 

  redoAction: function() {
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;

    console.log("redo");
    console.log(this.lastActionPerformed);
    if (this.action && this.lastActionPerformed) {
      $("#myCanvas").addClass("redo");

      switch (this.lastActionPerformed.name) {
        case "removeElements":
          Canvas.readdElements(this.lastActionPerformed.elements); 
          this.lastActionPerformed.name = "insert";
          break;
      }

      setTimeout(function() {
          $("#myCanvas").removeClass("redo");
          _canvas.clearRect(0, 0, _rc.width, _rc.height);
      }, 800);
    } else {
      showErrorModal("No action was performed");
      _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  },  

  cancelAction: function() {
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;

    if (this.action) {
      $("#myCanvas").addClass("cancel");

      switch (this.action.name) {
        case "insert":
          cancelActionInsertElements();
          break;
      }

      this.action = null;
      setTimeout(function() {
          $("#myCanvas").removeClass("cancel");
          _canvas.clearRect(0, 0, _rc.width, _rc.height);
      }, 800);
    } else {
        showErrorModal("No action was performed");
        _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  }  
}