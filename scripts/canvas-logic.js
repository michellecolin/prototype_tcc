function listen(pBoxO) {
    var finger = new Fingers(pBoxO.element);
    finger.addGesture(Fingers.gesture.Drag, null).addHandler(function(pEventType, pData, pFingers) {
        if(pEventType === Fingers.Gesture.EVENT_TYPE.move) {
            pBoxO.x += pFingers[0].getDeltaX();
            pBoxO.y += pFingers[0].getDeltaY();
            pBoxO.isUpdated = true;
        }
        else if(pEventType === Fingers.Gesture.EVENT_TYPE.start) {
            topZIndex++;
            if (pBoxO.type === "boundary") {
                pBoxO.zIndex = 0;
            } else {
                pBoxO.zIndex = topZIndex;  //if aqui, se for boundary sempre fica atrás de tudo
            }
            pBoxO.isUpdated = true;
        }
    });

   if (pBoxO.type === "boundary") {
        //code that scales objectsd - só scale boundary
       finger.addGesture(Fingers.gesture.Transform, null).addHandler(function(pEventType, pData, pFingers) {
            if(pEventType === Fingers.Gesture.EVENT_TYPE.move) {
                pBoxO.rad += pData.deltaRotation;
                pBoxO.scale = Math.max(0.5, Math.min(2, pBoxO.scale * pData.deltaScale));
                pBoxO.isUpdated = true;
            }
        });
   }

}

function transform(pBoxO) {
    if(pBoxO.isUpdated) {
        pBoxO.element.style[TRANSFORM_PREFIXED] = "translateZ(0) " +
                "translate(" + pBoxO.x + "px, " + pBoxO.y + "px) " +
                "scale(" + pBoxO.scale + ") " +
                "rotate(" + pBoxO.rad + "rad) ";
        pBoxO.element.style.zIndex = pBoxO.zIndex;
        pBoxO.isUpdated = false;
    }
}

function generateHexColor() {
    return '#'+Math.random().toString(16).substr(-6);
}

function getVendorPrefixed(pArrayOfPrefixes) {
    var result = null;
    for (var i=0; i<pArrayOfPrefixes.length; i++) {
        if (document.body.style[pArrayOfPrefixes[i]] !== undefined) {
            result = pArrayOfPrefixes[i];
            break;
        }
    }

    return result;
}

function loop() {
    for(var i=0; i<boxListLength; i++) {
        transform(boxList[i]);
    }
    requestAnimationFrame(loop);
}

Canvas = {
    temporaryRelationships: [],
    relationships: [],
    svg: null,
    intervalDraw: null,
    temporarySvg: null,
    intervalDrawFixed: null,
    isfirstRunning: false,
    svgisfirstRunning: false,
    stopFixedSvg: function() {
        if (this.intervalDrawFixed) {
            this.svgisfirstRunning = false;
            clearInterval(this.intervalDrawFixed);
        }
    },
    stopTemporary: function() {
        if (this.temporarySvg) {
            this.isfirstRunning = false;
            clearInterval(this.intervalDraw);
        }
    },
    createElements: function(elements) {
        var thisAction = [];
        for (var elementType in elements) {
            var numEl = elements[elementType];
            for(var i = 0; i < numEl; i++) {
                var boxO = this.createElement(elementType, (i+1));
                boxList.push(boxO);
                thisAction.push(boxO);
                if(elementType == "boundary") {
                    transform(boxO);
                }
            }
        }
        boxListLength = boxList.length;
        for(var i=0; i<boxListLength; i++) {
            listen(boxList[i]);
            MultitouchEvents.listenDoubleTap(boxList[i].element);
            MultitouchEvents.listenTwoFingerDoubleTap(boxList[i].element);
            MultitouchEvents.listenTap(boxList[i].element);
            MultitouchEvents.listenHoldTwoFinger(boxList[i].element);
        }

        loop();
        return {
            allElements: boxList,
            elementsAdded: thisAction
        }
    },

    createElement: function(elementType, count) {
        var divE = document.createElement("div");
        var img = document.createElement("img");
        var divLabel = document.createElement("div");
        var elId = boxList.length ? boxList.length + 1 : 1;

        if (elementType == "boundary") {
            img.setAttribute("src", "prototype_tcc/../img/boundary_canvas.png");
        } else {
            img.setAttribute("src", "prototype_tcc/../img/"+ elementType + ".png");
        }
        
        divLabel.className = elementType + "-el-name";
        divLabel.innerHTML = elementType + ' ' + count;

        divE.className = elementType + "-box box";
        divE.id = elId;
        if (elementType == "boundary") {
            divE.appendChild(divLabel);
            divE.appendChild(img);
        } else {
            divE.appendChild(img);
            divE.appendChild(divLabel);
        }

        var menu = document.createElement("ul");
        menu.className = "list";
        menu.innerHTML = '<li>Association</li><li>Generalization</li><li>Extend</li><li style="border-bottom:none;">Include</li>';
        divE.appendChild(menu);

        document.body.appendChild(divE);
        return {
            //1.57, rad for boundary
            element: divE,
            isUpdated: true,
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 300),
            rad: 0,
            scale: 1,
            rafId: 0,
            zIndex: 0,
            type: elementType,
            id: elId
        }
    },

    removeElements: function(elements) {
        var removedEl = [];
        elements.forEach(function(el){
            for (var i = 0; i < boxList.length; i++) {
                if (boxList[i].id == el.id) {
                    boxList[i].element.style.display = 'none'; //pog
                    removedEl.push(boxList[i]);
                }
            }
        });
        return removedEl;
    },

    hideElementsNotSelected: function(elements) {
        for (var i = 0; i < boxList.length; i++) {
            var matched = false;
            elements.forEach(function(el) {
                if (boxList[i].id == el.id) {
                    matched = true;
                }
            });

            if (!matched) {
                boxList[i].element.style.display = 'none';
            }
        }
    },

    showAllElements: function(element) {
        for (var i = 0; i < boxList.length; i++) {
            boxList[i].element.style.display = 'block';
        }
    },

    readdElements: function(elements) {
        elements.forEach(function(el){
            for (var i = 0; i < boxList.length; i++) {
                if (boxList[i].id == el.id) {
                    boxList[i].element.style.display = 'block'; //pog
                    boxList[i].element.style.display = 'block';
                }
            }
        });
    },

    relateDiagramElements: function(elements, type) {
        var mySVG;
        if (!this.temporarySvg) {
            this.temporarySvg = $('body').connect();
        }
        mySVG = this.temporarySvg;

        var el = {
            left_node: elements.first,
            right_node: elements.second,
            error: true,
            width: 1,
            gap: 300,
            style: type
        };

        mySVG.drawLine(el);
        
        //save relation drawn object
        this.temporaryRelationships.push(el);
        $(elements.first).on("touchmove", function(event, ui){
            mySVG.redrawLines();
        });
        $(elements.second).on("touchmove", function(event, ui){
            mySVG.redrawLines();
        });

        var running = this.isfirstRunning;
        if (!running) {
            this.isfirstRunning = true;
            this.intervalDraw = setInterval(function() {
                console.log("interval draw - 244");
                mySVG.redrawLines();
            }, 100);
        }
        
        freeToOtherRelationships(true);
    },

    removeTempRelationsships: function() {
        if (this.temporarySvg) {
            this.temporarySvg.removeLines(this.temporaryRelationships);   
        }

        this.stopTemporary();

        if (this.svg) {
            var mySVG = this.svg;
            if (!this.svgisfirstRunning) {
                this.intervalDrawFixed = setInterval(function() {
                    console.log("interval drawFixed - 263");
                    mySVG.redrawLines();
                }, 100);
                this.svgisfirstRunning = true;
            }
        }
        
        this.temporarySvg = null;
        this.temporaryRelationships = [];
    },

    saveRelationships:  function() {
        this.relationships = this.temporaryRelationships;
        this.temporaryRelationships = [];
        if (!this.svg) {
            this.svg = this.temporarySvg;
        } else {
            this.svg.addLines(this.relationships);
        }
        this.stopTemporary();
        this.temporarySvg = null;

        var mySVG = this.svg;
        if (!this.svgisfirstRunning) {
            this.intervalDrawFixed = setInterval(function() {
                console.log("interval draw fixed - 289");
                mySVG.redrawLines();
            }, 100);
            this.svgisfirstRunning = true;
        }
        freeToOtherRelationships(false);
    }
}

var TRANSFORM_PREFIXED;
var boxList = [];
var boxListLength = 0;
var topZIndex = 0;
var RELATE = false;
var FILTER = false;

$( document ).ready(function() {
    TRANSFORM_PREFIXED = getVendorPrefixed(["transform", "msTransform", "MozTransform", "webkitTransform", "OTransform"]);
});

