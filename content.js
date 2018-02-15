"use strict";
const API_KEY = '991536d61ae34675bf2bf9a05c8d1497';
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            jQuery('#test-console').prepend('<div id="dialogflow-steroids">' +
                '<p><strong>Filter by Event</strong></p>' +
                '<input type="text" value="" id="dialogflow-steroids-filter-context" class="dialogflow-steroids"/>' +
                '<div id="dialogflow-steroids-content"></div>' +
                '</div>');
            jQuery('#dialogflow-steroids').height('130px');
            var content = jQuery('#dialogflow-steroids-content');
            dialogFlowSteroids().init();
        }
    }
);

function dialogFlowSteroids() {
    var intents = {};

    function filterContext() {
        var filterBy = jQuery(this).val();
        jQuery.each(intents, function (index, item) {
            if (item.events && item.events.length > 0) {
                jQuery.each(item.events, function (index, event) {
                    if (filterBy == event.name) {
                        console.log(item);
                    }
                });
            }
        });
    }

    function getIntentList() {
        jQuery.ajax
        ({
            type: "GET",
            url: "https://api.dialogflow.com/v1/intents?v=20150910",
            dataType: 'json',
            success: function (response) {
                intents = response;
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + API_KEY);
            }
        });
    }

    return {
        init: function () {
            if (document.getElementById('dialogflow-steroids') !== null) {
                getIntentList();
                var $newFields = jQuery('#dialogflow-steroids-filter-context');
                $newFields.on('change', filterContext);
            }
        }
    }
}
