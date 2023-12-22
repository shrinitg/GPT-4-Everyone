document.getElementById("startIndexing").addEventListener("click", function () {

    document.getElementById("myProgress").style.display = 'block'
    start_progress_bar()

    chrome.runtime.sendMessage({ message: "startIndexing" });
});


async function start_progress_bar() {

    var i = 0;
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 0;
        var id = setInterval(frame, 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width+=4;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
            }
        }
    }

}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("coming here")
    if (request.message === 'indexing_success') {
        console.log("yahan aa gya")
        document.getElementById('text_query').style.display = 'block'
        document.getElementById('myProgress').style.display = 'none'
    }
    if (request.message.startsWith('got_search_result_')) {
        console.log("got message as: ", request.message)
        const response = request.message.substr(18)
        document.getElementById('show_search_response').value = response
        document.getElementById('show_search_response').style.display = 'block'
    }
})

document.getElementById("start_search").addEventListener("click", function () {

    document.getElementById('load_for_response').style.display = 'block'
    const search_query_text = document.getElementById('seach_query_text').value
    const message = "search_query_" + search_query_text
    chrome.runtime.sendMessage({ message: message });

});