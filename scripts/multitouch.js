FILTER = false;
REMOVE = false;

MultitouchEvents = {
    listenHoldOneFinger: function(pElement, pLabelElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Hold, {
            nbFingers: 1
        }).addHandler(function(pEventType, pData, pFingers) {
            if (pElement.dataset.action === "insert") {
                Diagram.actionStarted("insert", elementsToBeAdded);
                addDiagramElements(pElement.id);  
                updateImage(pLabelElement, pElement.id); 
            }              
        });
    },

    /* select element to be filtered */
    listenTwoFingerDoubleTap: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Tap, {
            nbFingers: 2
        }).addHandler(function(pEventType, pData, pFingers) {
            if (pData.nbTap === 2) {
                FILTER = true; 
                console.log(FILTER);
                console.log("element selected to be filtered");
                Diagram.actionStarted("filterElement", pElement);
                filterElement(pElement);
            }
        });
    },

    /*select elements to be excluded*/
    listenDoubleTap: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Tap, {
            nbFingers: 1
        }).addHandler(function(pEventType, pData, pFingers) {
            if (pData.nbTap === 2) {
                REMOVE = true;
                $(".edit-menu").css('display', 'none');
                setTimeout(function() {
                    console.log(FILTER);
                    if (!FILTER) {
                        console.log("element selected to be deleted");
                        Diagram.actionStarted("selectElementRemove", elementsToBeRemoved);
                        removeDiagramElements(pElement.id, pElement); 
                    } else {
                        REMOVE = false;
                    }  
                },70);
            }
        });
    },

    /*swipe out filter */
    listenSwipe: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Swipe, {
            nbFingers: 2
        }).addHandler(function(pEventType, pData, pFingers) {
            console.log("swipe filter off screen");
            exitFilterMenu(pElement);
        });
    },

    /*sedit name*/
    listenTap: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Tap, {
            nbFingers: 1
        }).addHandler(function(pEventType, pData, pFingers) {
            setTimeout(function(){
                console.log("one tap");
                console.log(REMOVE);
                if (!REMOVE && !FILTER) {
                    if (pData.nbTap === 1) {
                        console.log("edit name");
                        console.log(pElement);
                        $(".edit-menu").css('display', 'table');
                        $(".content").find("input").val($("#"+ pElement.id).find('div').html());

                        $("#changeName").click(function(event){
                            $("#"+ pElement.id).find('div').html($(".content").find("input").val());
                            $(".edit-menu").css('display', 'none');
                            $("#"+ pElement.id).find('div').css("background", "yellow");
                            if(!$("#"+ pElement.id).hasClass("boundary-box")) {
                                $("#"+ pElement.id).find('div').css("position", "absolute");
                            }

                            $("#"+ pElement.id).find('div').css("z-index", 800);
                            setTimeout(function() {
                                $("#"+ pElement.id).find('div').css("background", "");
                                $("#"+ pElement.id).find('div').css("position", "initial");
                                $("#changeName").off();
                            },150);
                        });
                    }
                }
            }, 250);
            
        });
    }

};



