console.log('Background script is running');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchReadmeFromAzure' && request.storageAccountName) {
        console.log('Getting access token from storage');
        chrome.storage.local.get(['azureAccessToken'], function(result) {
            console.log('Access token in storage:', result.azureAccessToken);
            if (result.azureAccessToken) {
                console.log('Token found, fetching README from Azure');

                fetchReadmeFromAzure(result.azureAccessToken, request.storageAccountName)
                    .then(markdownContents => {
                        // Open a new tab with markdownViewer.html and pass the raw markdown via URL parameter
                        const url = chrome.runtime.getURL("html/markdownViewer.html") + '?markdown=' + encodeURIComponent(markdownContents);
                        chrome.tabs.create({ url });
                    })
                    .catch(error => {
                        console.error('Error fetching README file:', error);
                    });
            } else {
                console.error('No access token found');
            }
        });
    }
});

function fetchReadmeFromAzure(accessToken, storageAccountName) {
    return new Promise((resolve, reject) => {
        // Dynamic Blob URL based on the storage account name
        const blobUrl = `https://${storageAccountName}.blob.core.windows.net/readme/README.md`;

        fetch(blobUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-ms-version': '2020-08-04'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    console.error('Error response text:', errorText);
                    throw new Error('Failed to fetch the README file. Status: ' + response.status + ', StatusText: ' + response.statusText);
                });
            }
            return response.text();  // Assuming README is a raw markdown file
        })
        .then(markdownContents => {
            resolve(markdownContents);
        })
        .catch(error => {
            console.error('Error fetching README file:', error);
            reject(error);
        });
    });
}
