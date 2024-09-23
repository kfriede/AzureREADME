document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    const authorizeButton = document.getElementById('authorizeButton');
    const logoutButton = document.getElementById('logoutButton'); // Add the logout button reference

    // Check if an access token already exists
    chrome.storage.local.get(['azureAccessToken'], function(result) {
        console.log("Access Token in storage:", result.azureAccessToken);
        if (result.azureAccessToken) {
            // If a token exists, display "Authorization complete" and show the Logout button
            statusElement.textContent = 'Authorization complete';
            authorizeButton.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            // If no token, display the "Authorize" button
            statusElement.textContent = 'Authorization required';
            authorizeButton.style.display = 'block';
            logoutButton.style.display = 'none'; // Hide the Logout button
        }
    });

    // Handle the authorize button click
    authorizeButton.addEventListener('click', function() {
        const clientId = '9f7f00f9-0a06-43f3-ba63-e244412aefcd'; // Replace with your client ID
        const redirectUri = chrome.identity.getRedirectURL();
        const scopes = [
            'https://storage.azure.com/user_impersonation'
        ];

        const authUrl = `https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_mode=fragment`;

        console.log("Auth URL:", authUrl); // Log the authorization URL for debugging

        chrome.identity.launchWebAuthFlow(
            {
                url: authUrl,
                interactive: true
            },
            function(responseUrl) {
                if (chrome.runtime.lastError || !responseUrl) {
                    console.error('Authorization failed:', chrome.runtime.lastError);
                    statusElement.textContent = 'Authorization failed';
                    return;
                }

                console.log("Response URL:", responseUrl); // Log the response URL

                // Parse the access token from the URL fragment
                const params = new URLSearchParams(new URL(responseUrl).hash.substring(1));
                const accessToken = params.get('access_token');

                if (accessToken) {
                    // Save the access token in chrome.storage.local
                    chrome.storage.local.set({ azureAccessToken: accessToken }, function() {
                        console.log('Access token saved');
                        statusElement.textContent = 'Authorization complete';
                        authorizeButton.style.display = 'none';
                        logoutButton.style.display = 'block'; // Show the Logout button
                    });
                } else {
                    statusElement.textContent = 'Authorization failed';
                }
            }
        );
    });

    // Handle the logout button click
    logoutButton.addEventListener('click', function() {
        // Remove the stored access token
        chrome.storage.local.remove('azureAccessToken', function() {
            console.log('Access token removed');
            statusElement.textContent = 'You have been logged out';
            authorizeButton.style.display = 'block'; // Show the Authorize button again
            logoutButton.style.display = 'none'; // Hide the Logout button
        });
    });
});
