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
        }

        loop();
        return {
            allElements: boxList,
            elementsAdded: thisAction
        }
        /*            
        Array.from(x).forEach(function(img){
            console.log(img);
            listenHoldTwoFinger(img);
            listenDoubleTap(img);
            listenTwoFingerDoubleTap(img);
            listenHoldOneFinger(img);
            listenTap(img);
        });*/

        // listenSwipe(document.getElementById("swipe"));

        //transform(boxO); -> just for boundary*/
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

        /*create edit menu
        var menu = document.createElement("ul");
        menu.style.display = "none";
        menu.className = "list";
        menu.innerHTML = '<li>Male - M</li><li>Female - M</li>';
        divE.appendChild(menu);*/     

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
                console.log(boxList[i]);
                if (boxList[i].id == el.id) {
                    boxList[i].element.style.display = 'none'; //pog
                    removedEl.push(boxList[i]);
                }
            }
        });
        return removedEl;
    },
    readdElements: function(elements) {
        console.log("readd");
        console.log(elements);

        elements.forEach(function(el){
            for (var i = 0; i < boxList.length; i++) {
                if (boxList[i].id == el.id) {
                    boxList[i].element.style.display = 'block'; //pog
                    boxList[i].element.style.display = 'block';
                }
            }
        });
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

    //when boundary innvert order <div class="el-name">Ator 1</div><img src="boundary.png">
   /* for(var i=0; i<10; i++) {
        var boxO = createBox('<img src="img/actor.png"><div class="el-name">Ator 1</div>');
        console.log(boxO);
        boxList.push(boxO);
        //transform(boxO); -> just for boundary
    }

    var x = document.getElementsByClassName("box");
    console.log(document.getElementsByClassName("box"));
    Array.from(x).forEach(function(img){
        console.log(img);
        listenHoldTwoFinger(img);
        listenDoubleTap(img);
        listenTwoFingerDoubleTap(img);
        listenHoldOneFinger(img);
        listenTap(img);
    });

   // listenSwipe(document.getElementById("swipe"));

    boxListLength = boxList.length;
    for(var i=0; i<boxListLength; i++) {
        listen(boxList[i]);
    }

    loop();*/
});


/* select elements to create relationships */
function listenHoldTwoFinger(pElement) {  
    var finger = new Fingers(pElement);
    finger.addGesture(Fingers.gesture.Hold, {
        nbFingers: 2
    }).addHandler(function(pEventType, pData, pFingers) {
        RELATE = true; /*when user done relating - set to false */
        console.log(pEventType, pData, pFingers);
        console.log("element selected to create relationship");
    });
};





/*edit element name*/
function listenHoldOneFinger(pElement) {
    var finger = new Fingers(pElement);
    finger.addGesture(Fingers.gesture.Hold, {
        nbFingers: 1
    }).addHandler(function(pEventType, pData, pFingers) {
        console.log(pFingers);
        console.log(pData, pEventType);
        setTimeout(function(){
            if(!RELATE){
                console.log("edit element name");
            }   
        },50);
        
    });
};

