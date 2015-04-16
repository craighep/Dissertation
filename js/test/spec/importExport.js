// Load the terrain module and describe tests.
define(
    [
        "../../exportImportProjects"
    ],
    function( ExportImportProjects ){
 
 
        // Describe the test suite for this module.
        describe(
            "Importing and exporting scenarios to JSON and to localstorage. Tests for importing too.",
            function(){
 
                // Check that terrain module creates a ground object, and returns it
                it(
                    "Exporting to and then importing from localStorage should work",
                    function(){
                        ExportImportProjects.ExportImportProjects("o a b o");
                        expect( ExportImportProjects.importFromLocalStorage() ).toBe("o a b o");
                    }
                );
 
                // Should export manoeuvres to JSON from the scenario
                it(
                    "Should be able to export and import from JSON",
                    function(){
                        var event = setUpEvent();
                        exportImportProjects.exportToJson("o a b o", event);
                        expect( ExportImportProjects.importFromJson("data.json") ).not.toBe(null);
                    }
                );
 
 
            }
        );
    function setUpEvent() {
        var event; // The custom event that will be created

  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent("name-of-custom-event", true, true);
  } else {
    event = document.createEventObject();
    event.eventType = "name-of-custom-event";
  }

  event.eventName = "name-of-custom-event";

  if (document.createEvent) {
    element.dispatchEvent(event);
  } else {
    element.fireEvent("on" + event.eventType, event);
  }

  return event;
    }
 
    }
);