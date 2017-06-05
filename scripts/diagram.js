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

      switch (this.action.name) {
        case "insert":
          var diagramElements = Canvas.createElements(this.action.elements);
          if (diagramElements) {
            removeInsertElementsPanel();
            resetElementsToBeAdded();
            this.elements.allElements = diagramElements.allElements;
            this.lastActionPerformed = {name: "insert", elements: diagramElements.elementsAdded};
          }
          break;
        case "selectElementRemove":
          REMOVE = false;
          var removedElements = Canvas.removeElements(this.action.elements); 
          changeElImagesBackToOriginal(this.action.elements);
          this.lastActionPerformed.name = "removeElements";
          this.lastActionPerformed.elements = removedElements;
          break;
        case "selectElementRelationship":
          showRelationshipPage();
          Canvas.hideElementsNotSelected(this.action.elements);
          this.actionStarted("showRelationshipPage", this.action.elements);
          this.action.elements.forEach(function(el){
            deSelectElement(el);
          });
          console.log("mudando pra pagina");
          console.log(this.action);
          break;
        case "showRelationshipPage":
          console.log("create relationships");
          break;
      }

      if (this.action.name != "showRelationshipPage") {
        this.action = null;
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
    console.log("undo");
    console.log(this.lastActionPerformed);
    console.log(this.action);
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;
    var error = false;

    if (this.action || this.lastActionPerformed) {
      if(!this.action || (this.action.name !== "selectElementRemove" && this.action.name !== "selectElementRelationship")) {
        $("#myCanvas").addClass("undo");

        switch (this.lastActionPerformed.name) {
          case "insert":
            Canvas.removeElements(this.lastActionPerformed.elements); 
            this.lastActionPerformed.name = "removeElements";
            break;
          case "removeElements":
            Canvas.readdElements(this.lastActionPerformed.elements); 
            showElementsLabels(this.lastActionPerformed.elements);
            this.lastActionPerformed.name = "insert";
            break;
        }

        this.action = null;
        setTimeout(function() {
            $("#myCanvas").removeClass("undo");
            _canvas.clearRect(0, 0, _rc.width, _rc.height);
        }, 800);
      } else {
        error = true;
      }
    } else {
      error = true;
    }

    if (error) {
      if (this.action) {
        switch (this.action.name) {
          case "selectElementRemove":
          case "selectElementRelationship":
            showErrorModal("You can't undo now, just confirm or cancel action");
            break;
        }
      } else {
        showErrorModal("No action was performed");
      }
      _canvas.clearRect(0, 0, _rc.width, _rc.height);
    }
  }, 

  redoAction: function() {
    _canvas = this.unistrokeCanvas; //binding problem on setTimeout
    _rc = this.unistrokeCanvasRect;
    var error = false;

    console.log("REDO");
    console.log(this.lastActionPerformed);
    console.log(this.action);

    if (this.action || this.lastActionPerformed) {
      if (!this.action || (this.action.name !== "selectElementRemove" && this.action.name !== "selectElementRelationship")) {
      
        $("#myCanvas").addClass("redo");

        switch (this.lastActionPerformed.name) {
          case "removeElements":
            Canvas.readdElements(this.lastActionPerformed.elements); 
            this.lastActionPerformed.name = "insert";
            break;

          case "insert":
            Canvas.removeElements(this.lastActionPerformed.elements); 
            this.lastActionPerformed.name = "removeElements";
            break;
        }

        this.action = null;
        setTimeout(function() {
            $("#myCanvas").removeClass("redo");
            _canvas.clearRect(0, 0, _rc.width, _rc.height);
        }, 800);
      } else {
        error = true;
      }
    } else {
      error = true;
    }

    if (error) {
      if (this.action) {
        switch (this.action.name) {
          case "selectElementRemove":
          case "selectElementRelationship":
            showErrorModal("You can't redo now, just confirm or cancel action");
            break;
        }
      } else {
        showErrorModal("No action was performed");
      }
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
        case "selectElementRemove":
          REMOVE = false;
          showElementsLabels(this.action.elements);
          changeElImagesBackToOriginal(this.action.elements);
          break;
        case "selectElementRelationship":
          RELATE = false;
          cancelActionRelateElements(this.action.elements);
          break;
        case "showRelationshipPage":
          RELATE = false;
          Canvas.showAllElements();
          cancelActionRelateElements(this.action.elements);
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