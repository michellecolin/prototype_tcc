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
    var empty = false;
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
          this.lastActionPerformed.lines = Canvas.svg.removeElementsRemoved(removedElements);
          break;
        case "selectElementRelationship":
          Canvas.stopFixedSvg();
          showRelationshipPage();
          RELATEPAGE = true;
          Canvas.hideElementsNotSelected(this.action.elements);
          this.actionStarted("showRelationshipPage", this.action.elements);
          this.action.elements.forEach(function(el){
            deSelectElement(el);
          });
          break;
        case "showRelationshipPage":
          RELATE = false;
          Canvas.saveRelationships();
          this.lastActionPerformed.name = "createRelationships";
          this.lastActionPerformed.elements = Canvas.relationships;
          Canvas.showAllElements();
          confirmRelationsCreated();
          empty = true;
          break;
      }

      if (this.action.name != "showRelationshipPage" || empty) {
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
            Canvas.svg.addLines(this.lastActionPerformed.lines);
            this.lastActionPerformed.name = "insert";
            break;
          case "createRelationships":
            Canvas.svg.removeLines(this.lastActionPerformed.elements);
            this.lastActionPerformed.name = "removeRelationships";
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

    if (this.action || this.lastActionPerformed) {
      if (!this.action || (this.action.name !== "selectElementRemove" && this.action.name !== "selectElementRelationship")) {
      
        $("#myCanvas").addClass("redo");

        switch (this.lastActionPerformed.name) {
          case "removeElements":
            Canvas.readdElements(this.lastActionPerformed.elements); 
            if (Canvas.svg) {
              this.lastActionPerformed.lines = Canvas.svg.removeElementsRemoved(this.lastActionPerformed.elements);
            }
            this.lastActionPerformed.name = "insert";
            break;

          case "insert":
            Canvas.removeElements(this.lastActionPerformed.elements);
            if (Canvas.svg) {
              this.lastActionPerformed.lines = Canvas.svg.removeLines(this.lastActionPerformed.lines); 
            }
            this.lastActionPerformed.name = "removeElements";
            break;

          case "removeRelationships":
            Canvas.svg.addLines(this.lastActionPerformed.elements);
            this.lastActionPerformed.name = "createRelationships";
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