"use strict";
const API_KEY = 'e53a5f857f614013b92f07c2928018d2';
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            dialogFlowSteroids().init();
        }
    }
);

function dialogFlowSteroids() {
    function getIntentList() {
        jQuery.ajax
        ({
            type: "GET",
            url: "https://api.dialogflow.com/v1/intents?v=20150910",
            dataType: 'json',
            success: function(response) {
                if (response) {
                    jQuery.each(jQuery('span.link-intent-edit>span.ng-binding'), function(i, e) {
                        jQuery.each(response, function(intent_index, intent_item) {
                            if (intent_item['name'].toLocaleLowerCase() === jQuery(e).text().toLocaleLowerCase()) {
                                var output = '<b>Action:</b>&nbsp;' + intent_item['actions'].join(', ');
                                if (intent_item['contextIn'].length > 0) {
                                    output += '&nbsp;&nbsp;<b>ContextIn:</b>&nbsp;' + intent_item['contextIn'].join(', ');
                                }
                                if (intent_item['contextOut'].length > 0) {
                                    output += '&nbsp;&nbsp;<b>ContextOut:</b>&nbsp;' + intent_item['contextOut'].join(', ');
                                }
                                if (intent_item['events'].length > 0) {
                                    output += '&nbsp;&nbsp;<b>Event:</b>&nbsp;' + intent_item['events'].map(event=> event.name ).join(', ');
                                }
                                jQuery(e).append('<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span> ' + output + '</span>');
                            }
                        });
                    });
                }
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + API_KEY);
            }
        });
    }

    return {
        init: function() {
            if (jQuery('ul.list-group') && jQuery('ul.list-group').find('li').length > 0) {
                getIntentList();
            }
        }
    }
}
