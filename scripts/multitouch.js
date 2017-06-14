FILTER = false;
REMOVE = false;
RELATE = false;

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
                    if (!FILTER && !RELATE) {
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
            exitFilterMenu(pElement);
        });
    },
    /* select elements to create relationships */
    listenHoldTwoFinger: function(pElement) {  
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Hold, {
            nbFingers: 2
        }).addHandler(function(pEventType, pData, pFingers) {
            RELATE = true; /*when user done relating - set to false */
            if (Diagram.action) {
                if (Diagram.action.name == "showRelationshipPage") {
                    selectDiagramToRelate(pElement.id, pElement);
                } else {
                    Diagram.actionStarted("selectElementRelationship", elementsToBeRelated);
                    relateDiagramElements(pElement.id, pElement); 
                }
            } else {
                Diagram.actionStarted("selectElementRelationship", elementsToBeRelated);
                relateDiagramElements(pElement.id, pElement); 
            }
        });
    },
    listenTapMenu: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Tap, {
            nbFingers: 1
        }).addHandler(function(pEventType, pData, pFingers) {
            pElement.style.backgroundColor = "#327966";
            setTimeout(function(){
                pElement.style.backgroundColor = "#25a985";
                $(pElement).parent().css('display', 'none');
                Canvas.relateDiagramElements(twoElementsRelationship, pElement.innerHTML);
            },180);
        });
    },
    /*sedit name*/
    listenTap: function(pElement) {
        var finger = new Fingers(pElement);
        finger.addGesture(Fingers.gesture.Tap, {
            nbFingers: 1
        }).addHandler(function(pEventType, pData, pFingers) {
            setTimeout(function(){
                if (!REMOVE && !FILTER) {
                    if (pData.nbTap === 1) {
                        if (RELATE) {
                        } else {
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
                }
            }, 250);
            
        });
    }

};



