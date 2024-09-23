// Function to extract storage account name from the current tab
function getStorageAccountName() {
    try {
        const storageAccountLink = document.querySelector('a[href*="Microsoft.Storage/storageAccounts"]');
        if (storageAccountLink) {
            const urlParts = storageAccountLink.href.split('/');
            const storageAccountName = urlParts[urlParts.indexOf('storageAccounts') + 1];
            console.log('Extracted Storage Account Name:', storageAccountName);
            return storageAccountName;
        } else {
            console.error('Storage account link not found');
            return null;
        }
    } catch (error) {
        console.error('Error extracting storage account name:', error);
        return null;
    }
}

// Function to add the README icon and text
function addReadmeIcon() {
    try {
        const toolbarContainer = document.querySelector('.azc-toolbar-container');
        console.log('Toolbar container:', toolbarContainer);  // Log the container to ensure it's being found

        if (toolbarContainer) {
            const createButton = toolbarContainer.querySelector('.azc-toolbarButton[title="Create"]').closest('li');
            console.log('Create button found:', createButton);  // Log to see if the create button is being selected

            const readmeButton = document.createElement('li');
            readmeButton.className = 'azc-toolbar-item azc-toolbarButton fxs-commandBar-item fxs-vivaresize';
            readmeButton.title = 'Open README';

            const readmeButtonDiv = document.createElement('div');
            readmeButtonDiv.className = 'azc-toolbarButton-container fxs-fxclick fxs-portal-hover';
            readmeButtonDiv.setAttribute('role', 'button');
            readmeButtonDiv.setAttribute('aria-label', 'Open README');
            readmeButtonDiv.title = 'Open README';
            readmeButtonDiv.tabIndex = 0;

            const readmeIcon = document.createElement('img');
            readmeIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABeUlEQVR4nO2Tv0oDQRDGlzRio0SI7CRiYay10FYrW1/APIGChZVCvJlWwTLgn04CigpipaCNZEYRyZtoQhoNCUhkEtRLsmcukmChA79m95vvu53dM+a/OlUsLUlAzlqUGxeAcgjES4Zqkc8mqkUAJaV7wX2cHSWeMECSB5JaJyzJ9eTq5YBSNwjRA8SPBpDfwolFQ7aUsHr1NqHFpAH8bFGeuunpKgB+QFOApbt5vZhWYmlJWpKib1RFXXNpwZO54ADkY0DZb8USH1jkik9X0TWnVj0CR4RyBSSnbSCfAXHV9zqqjTWXtu7hDkhQbmp8g6MuLHLBd4JCkE49fu+SASUVJ15wAcQl34hKlmQWPJ5pJe7x4ncn2Pv4mdpAKX+NSMpBOkDebQrwv45eY5ErxhJf9C2A5NyMrd0PWsqttB2VJGNJjoDk1hK/Or7upbFX12QcI11WbxOmouv5YSDZ8Zlvj9DDkOl1AcqJ/qmmX5XY5GmlbwHmT9Y7mRsRke7+D3AAAAAASUVORK5CYII=';
            readmeIcon.alt = 'README icon';
            readmeIcon.style.height = '24px';
            readmeIcon.style.width = '24px';
            readmeIcon.style.marginRight = '8px';            

            const readmeLabel = document.createElement('span');
            readmeLabel.textContent = 'Readme';
            readmeLabel.style.fontSize = '14px';
            readmeLabel.style.verticalAlign = 'middle';

            readmeButtonDiv.appendChild(readmeIcon);
            readmeButtonDiv.appendChild(readmeLabel);
            readmeButton.appendChild(readmeButtonDiv);

            if (createButton) {
                createButton.insertAdjacentElement('afterend', readmeButton);
            } else {
                toolbarContainer.appendChild(readmeButton);
            }

            // Add click handler to Readme button
            readmeButtonDiv.addEventListener('click', function() {
                console.log('README button clicked, sending message to background');
                const storageAccountName = getStorageAccountName();
                if (storageAccountName) {
                    // Send the storage account name to the background script
                    chrome.runtime.sendMessage({
                        action: 'fetchReadmeFromAzure',
                        storageAccountName: storageAccountName
                    });
                } else {
                    console.error('Storage account name not found');
                }
            });
        }
    } catch (error) {
        console.error('Error in addReadmeIcon:', error);  // Catch and log any errors that occur in this block
    }
}

// Use MutationObserver to monitor changes in the DOM
const observer = new MutationObserver((mutations, observer) => {
    const toolbarContainer = document.querySelector('.azc-toolbar-container');
    if (toolbarContainer) {
        addReadmeIcon();
        observer.disconnect(); // Stop observing once the element is found
    }
});

// Start observing the document for changes (monitor the entire DOM tree)
observer.observe(document.body, { childList: true, subtree: true });
