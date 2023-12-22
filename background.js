chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.message === 'startIndexing') {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            currentTabUrl = currentTab.url;

            const indexing_api_host = "http://localhost:8015"
            const indexing_api_endpoint = "/api/v1/bot-openai-embeddings-handler"
            const customer_id = 11066
            const bot_ref = 43984
            const url_to_index = currentTabUrl
            var user_email = "some_ramdom_email_name_3"
            // var storedData = localStorage.getItem('user_details');
            // if (storedData) {
            //     var data = JSON.parse(storedData);
            //     user_email = data.logged_in_user_email
            // }
            index_request = {
                "customerId": customer_id,
                "fileType": "html_v2",
                "botRef": bot_ref,
                "url": url_to_index,
                "actionType": "INSERT",
                "userId": user_email,
                "fileName": url_to_index
            }
            const url = indexing_api_host + indexing_api_endpoint

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(index_request),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('API response:', data);
                    if (data.status === true && data.message === 'SUCCESS') {
                        console.log("Page has been indexed successfully.")
                        chrome.runtime.sendMessage({ message: "indexing_success" });
                    } else {
                        console.log("Some error occurred. Please try again in sometime.")
                    }
                })
                .catch(error => {
                    console.log('Error:', error);
                });

        });

    }

    if (request.message.startsWith('search_query')) {
    
        const search_query_text = request.message.substr(13)

        const searching_api_host = "http://localhost:10461"
        const searching_api_endpoint = "/v1.0/api/llm-search"
        const customer_id = 11066
        const bot_ref = 43984
        var user_email = "some_ramdom_email_name_3"
        // var storedData = localStorage.getItem('user_details');
        // if (storedData) {
        //     var data = JSON.parse(storedData);
        //     user_email = data.logged_in_user_email
        // }
        index_request = {
            "userQuery": search_query_text,
            "userInfo": {
              "id": user_email,
              "userId": user_email,
              "userBotRef": bot_ref,
              "timeZone": "string",
              "userLocale": "en",
              "locale": [
                "string"
              ],
              "filterCategories": [
                "string"
              ]
            },
            "botId": bot_ref,
            "cid": customer_id,
            "queryTimestamp": 1701857829263,
            "channel": "web",
            "portalUserId": customer_id,
            "masterBotRef": bot_ref,
            "userQueryId": user_email,
            "llmStreamingTopic":"com.engati.llm.stream.response.c0",
            "enableBotLlmUpload": true
          }
        const url = searching_api_host + searching_api_endpoint

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(index_request),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('API response:', data);
                if (data.status.code === 1000 && data.status.message === 'SUCCESS') {
                    console.log("Got the response for the search query: ", data)
                    const search_response = "got_search_result_" + data.response.best_match.response
                    chrome.runtime.sendMessage({ message: search_response });
                } else {
                    console.log("Some error occurred. Please try again in sometime.")
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });

    }
});
