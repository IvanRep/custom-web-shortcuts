chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        
        let functionWrapper = null;
        switch(command){
            case "player-load":
                functionWrapper = loadPlayer;
                break;
            case "prev-chapter":
                functionWrapper = previousChapter;
                break;
            case "next-chapter":
                functionWrapper = nextChapter;
                break;
            default:
                alert("Unimplemented command: " + command);
                break;
        }
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: functionWrapper
        })
    })
})

function nextChapter() {
    function xpathPrepare(xpath, searchString) {
        for (let i = 0; i < searchString.length; i++) {
            xpath = xpath.replaceAll("$u" + i, searchString[i].toUpperCase())
            .replaceAll("$l" + i, searchString[i].toLowerCase())
            .replaceAll("$s" + i, searchString[i].toLowerCase());
        }
        return xpath;
    }
    
    const expr = xpathPrepare(`//a[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]
                            | button[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]
                            | input[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]`, 
                            ["next","siguiente","proximo"]);
    document.evaluate(expr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}

function previousChapter() {
    function xpathPrepare(xpath, searchString) {
        for (let i = 0; i < searchString.length; i++) {
            xpath = xpath.replaceAll("$u" + i, searchString[i].toUpperCase())
            .replaceAll("$l" + i, searchString[i].toLowerCase())
            .replaceAll("$s" + i, searchString[i].toLowerCase());
        }
        return xpath;
    }

    const expr = xpathPrepare(`//a[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]
                            | button[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]
                            | input[contains(translate(., '$u0', '$l0'), '$s0') or contains(translate(., '$u1', '$l1'), '$s1') or contains(translate(., '$u2', '$l2'), '$s2')]`, 
                            ["prev","anterior","previo"]);
    document.evaluate(expr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}

function loadPlayer() {
    const player = document.getElementById("videoLoading")
    player.click();
}