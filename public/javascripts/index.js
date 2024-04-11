
/** Called by the index.html page. */
function initHome() {
    // @todo initialize the GUI
    // Calling homepage routes
    commonInitOfPage();
}

function initPlayers(){
    localStorage.setItem('isChatOpened', 'false')
    commonInitOfPage();
}

/* -------- End of init()s -------- */

/** Function called by the **main** *"init"* functions to set common attributes and features. */
function commonInitOfPage() {
    addBtnFunctions();
    initChat();
}

/** This function assigns **ALL** the *'onclick'* attributes in the page. */
function addBtnFunctions() {
    document.getElementById('chatIconBtn').onclick = clickChatBtn;
    document.getElementById('closeChat').onclick = closeChat;
    document.getElementById('acceptTermsBtn').onclick = acceptedTerms;
    document.getElementById('declineTermsBtn').onclick = closeChat;
    document.getElementById("submitForm").onclick =  connectToRoom;
}

/** This is an EXPRESS GET function:
 * @returns {Promise} a promise from the Axios GET.
 * The promise will return a {@link Map} to take trace of flags and nations.
 * @throws TypeError if the Axios GET fails. */
async function getAllFlags() {
    return axios.get('/get_flags')
        .then(data => {
            const dataR = Array(data.data)[0];
            let flagList = new Map();
            for(let i in dataR){
                flagList.set(dataR[i].domestic_league_code, {
                    'countryName': String(dataR[i].country_name),
                    'flagURL': String(dataR[i].flag_url)
                });
            }
            return flagList;
        })
        .catch(err => {
            console.log(err);
            throw new TypeError('Error occurred during \'flags\' GET');
        })
}

function getClubById(id) {
    // @todo maybe insert a spinning element
    console.log('Club called with id: ', id);
}

function extractFormData(formId) {
    let formElements = document.getElementById(formId).children;
    let formData={};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].value;
        }
    }
    return formData;
}