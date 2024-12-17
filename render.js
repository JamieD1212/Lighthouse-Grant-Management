// Header: render.js
// Authors: Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka
// Created: 12/09/2024
// Description: This file holds the javascript code used to control dynamic functions on the View All Grants and Single Grant View pages of our application
// Copyright (c) <2024> <Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//The code below outlines functionality for the settings pop-up
let popUpButton = document.getElementById("popUpButton")
let closeButton = document.getElementsByClassName("close")[0]

// This function makes the pop-up visible when the settings button is clicked
popUpButton.onclick = function() {
    document.getElementById("popUpModal").classList.remove("notVisible")
    popUpButton.style.backgroundColor = "#7F7F7F"
    popUpButton.style.color = "white"
    document.getElementsByClassName("activeNavigation")[0].style.backgroundColor = "#EEECEC"
    document.getElementsByClassName("activeNavigation")[0].style.color = "#7F7F7F"
}

// This function closes the pop-up when the X button is clicked
closeButton.onclick = function() {
    document.getElementById("popUpModal").classList.add("notVisible")
    popUpButton.style.backgroundColor = "#EEECEC"
    popUpButton.style.color = "#7F7F7F"
    document.getElementsByClassName("activeNavigation")[0].style.backgroundColor = "#7F7F7F"
    document.getElementsByClassName("activeNavigation")[0].style.color = "white"
}

// This function closes the pop-up when the user clicks somewhere on the screen that is not the pop-up
window.onclick = function(event) {
    if (event.target == document.getElementById("popUpModal")) {
        document.getElementById("popUpModal").classList.add("notVisible")
        popUpButton.style.backgroundColor = "#EEECEC"
        popUpButton.style.color = "#7F7F7F"
        document.getElementsByClassName("activeNavigation")[0].style.backgroundColor = "#7F7F7F"
        document.getElementsByClassName("activeNavigation")[0].style.color = "white"
    }
}

// This event listener executes all code that needs to be run once the pages load
document.addEventListener('DOMContentLoaded', function() {
    loadGrants();

    document.getElementById('exportButton').addEventListener('click', () => {
        window.electronAPI.exportCSV(); // This will trigger the export in main.js
    });

    let buttons = document.querySelectorAll('button');
    let button = document.querySelector('button');

    for (let i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', onButtonClick);
    }

});

// Dictionary for mapping IDs to their database fields and SGV labels.
let idMap= {};
idMap['fn'] = ['foundation_name', 'Foundation Name'];
idMap['gn'] = ['grant_name', 'Grant Name'];
idMap['pd'] = ['project_director', 'Project Director'];
idMap['ra'] = ['requested_amount', 'Requested Amount'];
idMap['ea'] = ['expected_amount', 'Expected Amount'];
idMap['aa'] = ['amount_awarded', 'Awarded Amount'];
idMap['hbd'] = ['hear_by_date', 'Hear By Date (yyyy-mm-dd)'];
idMap['db'] = ['due_by', 'Due By Date (yyyy-mm-dd)'];
idMap['ed'] = ['end_date', 'End Date (yyyy-mm-dd)'];
idMap['da'] = ['date_applied', "Date Applied (yyyy-mm-dd)"];
idMap['de'] = ['date_expired', 'Date Expired (yyyy-mm-dd)'];
idMap['nor'] = 'number_of_reminders';
idMap['no'] = ['notes', 'Notes'];

const aData = ['fn', 'gn', 'ed', 'pd', 'aa', 'no']
const icData = ['fn', 'gn', 'db', 'pd', 'ra', 'no']
const pData = ['fn', 'gn', 'hbd', 'pd', 'ra', 'ea', 'no']
const eaData = ['fn', 'gn', 'de', 'pd', 'aa', 'no']
const erData = ['fn', 'gn', 'da', 'pd',  'ra', 'no']

const grantTypes = {}
grantTypes['inConcept'] = icData;
grantTypes['pending'] = pData;
grantTypes['active'] = aData;
grantTypes['expiredA'] = eaData;
grantTypes['expiredR'] = erData;

let globalGrantName = "";
let globalFoundName = "";
let globalStatus = "";
let globalGrantChange = false;
let globalGrantId;
let globalViewExpired = false;

const overlay = document.getElementById('overlay') //For the popups
const viewRem = document.getElementById('ViewRemPopUp')

async function loadData(name, status) {
    let grantData = await window.electronAPI.getGrantData(name, status)
    return grantData
}

// This function displays the SGV screen which shows further details about the grant.
async function singleGrantView(status) {
    document.body.style.backgroundColor = '#85BB65';
    document.getElementById("viewAllActiveLink").innerHTML = "Single Grant View"
    let gStatus = status
    let box, box2;

    // Displays the grant's status.
    if (gStatus === 'expiredA') {
        document.getElementById("type").innerHTML = "<strong>Expired (Awarded)</strong>";
        document.getElementById("type").style.fontSize = "25px";
    }
    else if (gStatus === 'expiredR') {
        document.getElementById("type").innerHTML = "<strong>Expired (Rejected)</strong>";
        document.getElementById("type").style.fontSize = "25px";
    }
    else {
        document.getElementById("type").innerHTML = "<strong>" + gStatus.charAt(0).toUpperCase() + gStatus.slice(1) + "</strong>";
        document.getElementById("type").style.fontSize = "25px";
    }

    // Apart from Pending grants, all grants do not have 'box6' field.
    if (gStatus !== 'pending') {
        let removable = document.getElementById("box6")
        removable.classList.add("notVisible")
        removable = document.getElementById("input6")
        removable.classList.add("notVisible")

        // Changing position of 'Notes' box to fill empty space.
        box = document.getElementById("notes")
        box.remove();
        document.getElementById('row2').appendChild(box);
    }

    // Requesting the grant's data from the database.
    let data = await loadData(globalGrantId, gStatus);

    const fieldList = grantTypes[gStatus];
    let field = '';

    // Renames field labels to match the Grant Type and fills in the boxes with data.
    for (let i = 0; i < (fieldList.length - 1); i++) {
        field = idMap[fieldList[i]][1];

        box = document.getElementById("box" + (i+1))
        box.innerHTML = '<label>' + field + '</label><div id="t' + (i+1) + '" class="textBox"></div>'
        box2 = document.getElementById("input" + (i+1))
        box2.innerHTML = '<label for="' + fieldList[i] + '">' + field + '</label> <input id="' + fieldList[i] + '" name="' + idMap[fieldList[i]][0] + '" class="textBox inputBox">'

        if (i === 0) {
            box = document.getElementById("t1");
            box.innerText = globalFoundName;
            box2 = document.getElementById("input1")
            box2.children[1].value = globalFoundName
        }
        else if (i === 1) {
            box = document.getElementById("t2");
            box.innerText = globalGrantName;
            box2 = document.getElementById("input2")
            box2.children[1].value = globalGrantName
        }
        else if (i === 2) {
            if(gStatus === "expiredR") {
                box = document.getElementById("t3");
                box.innerText = data[1];
                box2 = document.getElementById("input3")
                box2.children[1].value = data[1];
            } else {
                box = document.getElementById("t3");
                box.innerText = data[2];
                box2 = document.getElementById("input3")
                box2.children[1].value = data[2];
            }
        }
        else if (i === 3) {
            box = document.getElementById("t4");
            box.innerText = data[0]
            box2 = document.getElementById("input4")
            box2.children[1].value = data[0]
        }
        else if (i === 4) {
            box = document.getElementById("t5");
            box.innerText = data[1]
            box2 = document.getElementById("input5")
            box2.children[1].value = data[1]
        }
    }
            if(gStatus === "expiredR") {
                box = document.getElementById("t5");
                box.innerText = data[2]
                box2 = document.getElementById("input5")
                box2.children[1].value = data[2]
            } else {
                box = document.getElementById("t5");
                box.innerText = data[1]
                box2 = document.getElementById("input5")
                box2.children[1].value = data[1]
            }

    box = document.getElementById("tn");
    box.innerText = data[3]
    box2 = document.getElementById("noteInput")
    box2.children[1].innerText = data[3]

    // Pending grants need an exception if-else statement.
    if (gStatus === 'pending') {
        box = document.getElementById("t3");
        box.innerText = data[3];
        box2 = document.getElementById("input3")
        box2.children[1].value = data[3];

        box = document.getElementById("t6");
        box.innerText = data[2]
        box2 = document.getElementById("input6")
        box2.children[1].value = data[2]

        box = document.getElementById("notes");
        box.children[1].innerText = data[4]
        box.style.position = "absolute";
        box.style.left = "78%";
        //box.style.top = '10%';
        box2 = document.getElementById("noteInput")
        box2.children[1].innerText = data[4]
    }
}

function grantTypeChange(change) {
    const fieldList = grantTypes[change.value];
    let field = '';
    let data = [];
    let box, box2;

    globalStatus = change.value;
    globalGrantChange = true

    // Shows 6th input box if the grant type is changed to 'pending', else it hides it if visible.
    box = document.getElementById("input6")
    if (change.value === 'pending') {
        box.classList.remove('notVisible');
    }
    else {
        if (!box.classList.contains('notVisible')) {
            box.classList.add('notVisible');
        }
    }

    // Renames field labels to match the Grant Type and fills in the boxes with data.
    for (let i = 0; i < (fieldList.length - 1); i++) {
        field = idMap[fieldList[i]][1];
        box2 = document.getElementById("input" + (i+1))
        data[i] = box2.children[1].value;
        box2.innerHTML = '<label for="' + fieldList[i] + '">' + field + '</label> <input id="' + fieldList[i] + '" name="' + idMap[fieldList[i]][0] + '" class="textBox inputBox">'
        box2.children[1].value = data[i]             // Refills the box.
    }
}

// When the edit button is clicked, show form.
function editMode() {
    document.getElementById('gt').value = globalStatus

    // Switches to input mode by hiding the 'default' elements.
    let defaults = document.getElementsByClassName("default")
    let item
    for (let i = 0; i < defaults.length; i++) {
        item = defaults[i]
        item.classList.add("notVisible")
    }

    let box = document.getElementById("misc");
    box.classList.remove("notVisible");
    box.style.position = "absolute";
    box.style.left = '70%';
    box.style.top = '21%';
    grantTypeInput.classList.remove("notVisible");
    // Making the add attachments section visible
    document.getElementById("moreAttachLabel").classList.remove("notVisible")
    document.getElementById("moreAttachButton").classList.remove("notVisible")

    box = document.getElementById('misc');
    box.classList.remove("notVisible");
    document.getElementById('edit').appendChild(box);

    // Reveals the form for editing the grant's data.
    const editForm = document.getElementById("edit")
    editForm.classList.remove("notVisible")
    const type = document.getElementById("type").innerText.toLowerCase();

    // Listener for when the submit button is clicked - sends updated data to main process.
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Access the form data
        const formData = new FormData(editForm);

        // Creates a dictionary of fields and their updated data to update a grant's data in the database.
        let updates = {};

        let typeData = grantTypes[globalStatus];
        for (let i = 0; i < typeData.length; i++) {
            if(typeData[i] == 'ed' || typeData[i] == 'db' || typeData[i] == 'hbd' || typeData[i] == 'de' || typeData[i] == 'da') {
                updates[typeData[i]] = formData.get(idMap[typeData[i]][0])
            } else {
                updates[typeData[i]] = formData.get(idMap[typeData[i]][0]);
            }
        }
        updates['type'] = globalStatus

        if (updates['fn'] !== globalFoundName || updates['gn'] !== globalGrantName) {
            window.electronAPI.changeFolderName(globalFoundName, globalGrantName, updates['fn'], updates['gn'])
        }
        // This is for sending the attachment information

        const input = document.getElementById('moreAttachButton');
        const files = input.files;
        const fileData = [];

        // Collect the file data and read the files
        const filePromises = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            filePromises.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        fileData.push({
                            name: file.name,
                            data: reader.result, //Actually contains the data in base64
                        });
                        resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(file);
                })
            );
        }

        Promise.all(filePromises).then(() => {
            const dataToSend = [updates['fn'] + "_" + updates['gn'], ...fileData];
            window.electronAPI.sendFiles(dataToSend)
        })

        submitChanges(globalGrantId, updates, globalGrantChange)
    });
}

function submitChanges(id, updates, typeChange) {
    const type = updates['type']

    // Get the warning modal
    let submit = document.getElementById("submitEditModal");

    // Get the response buttons (to delete, or not to delete?).
    let yesSub = document.getElementById("yesSub");

    // When the user clicks on the button, open the modal
    submit.style.display = "block";

    // When the user clicks anywhere outside modal, close it
    window.onclick = function(event) {
        if (event.target === submit) {
            submit.style.display = "none";
            window.electronAPI.gatherGrantDataInput(id, type, updates, typeChange)
            location.reload()
        }
    }

    yesSub.onclick = function() {
        submit.style.display = "none";
        window.electronAPI.gatherGrantDataInput(id, type, updates, typeChange)
        location.reload()
    }
}

// Opens the folder of a given grant
function openFolder() {
    window.electronAPI.sendFolderInfo(globalGrantName, globalFoundName)
}

// This function adds a reminder type drop down box to the view reminder pop-up
function addReminderDropDown() {
    const addReminderWrapper = document.getElementById("addReminderWrapper")
    const newReminderDropDown = document.createElement("select")
    const newReminderStarter = new Option("Notification Type", "value")
    newReminderStarter.disabled = "true"
    const newReminderReport = new Option("Report Due", "noteReportDue")
    const newReminderExpires = new Option("Expires", "noteExpires")
    const newReminderLook = new Option("Look At", "noteLookAt")
    const newReminderApplication = new Option("Application Due", "noteAppDue")
    const newReminderHear = new Option("Hear By", "noteHearBy")
    addReminderWrapper.appendChild(newReminderDropDown)
    newReminderDropDown.appendChild(newReminderStarter)
    newReminderDropDown.appendChild(newReminderReport)
    newReminderDropDown.appendChild(newReminderExpires)
    newReminderDropDown.appendChild(newReminderLook)
    newReminderDropDown.appendChild(newReminderApplication)
    newReminderDropDown.appendChild(newReminderHear)
    newReminderDropDown.selectedIndex = 0;
    newReminderDropDown.options[0].disabled = true
    newReminderDropDown.setAttribute("id", "popUpAddReminderDropDown")
    newReminderDropDown.style.width = "60%"
    newReminderDropDown.style.borderRadius = "4px"
}

// This function adds a deadline form to the view reminder pop-up
function addDeadline() {
    const addReminderWrapper = document.getElementById("addReminderWrapper")
    // Creating the label
    const newDeadlineLabel = document.createElement("label")
    newDeadlineLabel.innerText = "Final Deadline: "
    addReminderWrapper.appendChild(newDeadlineLabel)
    newDeadlineLabel.setAttribute("id", "popUpDeadlineLabel")
    // Creating the input
    const newDeadlineInput = document.createElement("input")
    newDeadlineInput.type = "date"
    addReminderWrapper.appendChild(newDeadlineInput)
    newDeadlineInput.setAttribute("id", "popUpDeadlineInput")
    newDeadlineInput.style.width = "32.5%"
}

// This function adds a reminder date form to the view reminder pop-up
function addDate() {
    const addReminderWrapper = document.getElementById("addReminderWrapper")
    const newReminderDateLabel = document.createElement("label")
    newReminderDateLabel.innerText = "Date for Reminder: "
    addReminderWrapper.appendChild(newReminderDateLabel)
    newReminderDateLabel.setAttribute("id", "popUpDateLabel")

    const newReminderDateInput = document.createElement("input")
    newReminderDateInput.type = "date"
    addReminderWrapper.appendChild(newReminderDateInput)
    newReminderDateInput.setAttribute("id", "popUpDateInput")
}

// This function changes the layout of the view reminders pop-up, allowing the user to add a new reminder
function addReminderOption() {
    // Changing the pop-up title and removing all child elements from it
    document.getElementById("viewRemPopUpTitle").innerHTML = "Add Reminder"
    ViewRemBody.innerHTML = ""

    const addReminderArea = document.createElement("div")
    addReminderArea.setAttribute("id", "addReminderArea")
    ViewRemBody.appendChild(addReminderArea)

    const addReminderWrapper = document.createElement("div")
    addReminderWrapper.setAttribute("id", "addReminderWrapper")
    addReminderArea.appendChild(addReminderWrapper)

    addReminderDropDown()
    let newBreak = document.createElement("br")
    addReminderWrapper.appendChild(newBreak)
    let newerBreak = document.createElement("br")
    addReminderWrapper.appendChild(newerBreak)
    addDeadline()
    let newestBreak = document.createElement("br")
    addReminderWrapper.appendChild(newestBreak)
    let newestestBreak = document.createElement("br")
    addReminderWrapper.appendChild(newestestBreak)
    addDate()
    let anotherBreak = document.createElement("br")
    addReminderWrapper.appendChild(anotherBreak)
    let oneMoreBreak = document.createElement("br")
    addReminderWrapper.appendChild(oneMoreBreak)
    const newSubmitButton = document.createElement("button")
    newSubmitButton.innerHTML = "Submit Reminder"
    newSubmitButton.classList.add("reminderButtons")
    newSubmitButton.style.width = "60%"
    newSubmitButton.setAttribute("id", "popUpSubmitButton")
    ViewRemBody.appendChild(newSubmitButton)
    newSubmitButton.setAttribute("onClick", "addNewReminder(globalGrantName, globalFoundName, globalStatus)")
}

// This function removes the form elements added when the user presses the add new reminder button
function removeAddReminder() {
    document.getElementById("popUpAddReminderDropDown").remove()
    document.getElementById("popUpDeadlineLabel").remove()
    document.getElementById("popUpDeadlineInput").remove()
    document.getElementById("popUpDateLabel").remove()
    document.getElementById("popUpDateInput").remove()
    document.getElementById("popUpSubmitButton").remove()
    document.getElementById("addReminderArea").remove()
}

// This function performs necessary operations when the submit new reminder button is pressed
function addNewReminder(name, foundation, status) {
    // Gathering information from the reminder fields and sending it to the database
    let reminderType = document.getElementById("popUpAddReminderDropDown").value
    let deadline = document.getElementById("popUpDeadlineInput").value
    let reminderDate = document.getElementById("popUpDateInput").value
    window.electronAPI.gatherParsedNotificationInput(name, foundation, status, reminderDate, deadline, "true", reminderType)
    removeAddReminder()
    viewReminder()
}

// Opens a pop-up with all the reminders
async function viewReminder() {
    let notifications = await window.electronAPI.getParsedNotifications()
    const newHr = document.createElement('hr');
    const newItem = document.createElement('p1');
    newItem.textContent = "Reminder Type" + " | " + "Date of Reminder" + " | " + "Final Date"
    ViewRemBody.appendChild(newItem);
    ViewRemBody.appendChild(newHr);
    document.getElementById("viewRemPopUpTitle").innerHTML = "All Reminders"
    const addReminderButton = document.createElement("button");
    addReminderButton.innerHTML = "Add New Reminder";
    addReminderButton.classList.add("reminderButtons")
    addReminderButton.setAttribute("onClick", "addReminderOption(globalGrantName, globalFoundName)")
    ViewRemBody.appendChild(addReminderButton)
    notifications.forEach(item => {
        if(item.grant_name == globalGrantName) {
            var first_word = item.reminder_type.slice(4)
            var reminderType = addSpaces(first_word)
            var dateCurrent = item.this_date
            var dateCurrentReady = dateCurrent.replace(/\D/g, "/")
            if(item.isReminder == "true") {
                var dateFinal = item.final_date
                var dateFinalReady = dateFinal.replace(/\D/g, "/")
            }
            else {
                var dateFinalReady = "Final"
            }
            const newHr = document.createElement('hr');
            const newItem = document.createElement('p1');
            newItem.textContent = reminderType + " | " + dateCurrentReady + " | " + dateFinalReady
            const newButton = document.createElement('button')
            newButton.innerText = "X"
            newButton.id = item.id
            newButton.classList.add("deleteNotification")
            newItem.textContent = reminderType + " | " + dateCurrentReady + " | " + dateFinalReady
            ViewRemBody.appendChild(newItem);
            ViewRemBody.appendChild(newButton);
            ViewRemBody.appendChild(newHr);
            ViewRemBody.appendChild(addReminderButton);
            ViewRemBody.addEventListener('click', onButtonClick)
        }
    })
    viewRem.classList.add('active')
    overlay.classList.add('active')
}

function addSpaces(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i > 0 && str[i] === str[i].toUpperCase()) {
            if (str[i - 1] === str[i - 1].toLowerCase()) {
                result += ' ';
            }
        }
        result += str[i];
    }
    return result;
 }

 // Sends a message to the main process to delete from the database whichever grant has the current global id.
function removeGrant() {
    // Get the warning modal
    let warning = document.getElementById("deleteGrantModal");

    // Get the response buttons (to delete, or not to delete?).
    let noDel = document.getElementsByClassName("noDel")[0];
    let yesDel = document.getElementsByClassName("yesDel")[0];

    // When the user clicks on the button, open the modal
    warning.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    noDel.onclick = function () {
        warning.style.display = "none";
    }

    yesDel.onclick = function () {
        warning.style.display = "none";
        window.electronAPI.removeGrant(globalGrantId, globalGrantName, globalFoundName)
        location.reload();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === warning) {
            warning.style.display = "none";
        }
    }
}

// Button event listener for View All Grants Page.
function onButtonClick() {
    const page1 = document.getElementById("main-page")
    const page2 = document.getElementById("grant-view")
    let button = event.target
    if(button.id.includes("_")) {
        const parts = button.id.split("_")
        globalFoundName = parts[0]
        globalGrantName = parts[1]
        globalGrantId = parts[2]
        globalStatus = button.classList[1]
    }

    if (button.id === "editBttn") {
        editMode(page2)
    }
    else if (button.id === "backBttn") {
        location.reload();
    }
    else if (button.classList.contains("grant")) {
        singleGrantView(globalStatus);
        page1.classList.add("notVisible")
        page2.classList.remove("notVisible")
    }
    else if (button.id === "viewRemButton") {
        viewReminder()
    }
    else if (button.id === "ViewRemClose") {
        viewRem.classList.remove('active')
        overlay.classList.remove('active')
        ViewRemBody.innerHTML = '';
    }
    else if(button.classList.contains("deleteNotification")) {
        deleteNotification(button.id)
        ViewRemBody.innerHTML = '';
        viewReminder()
    }
    else if (button.id === "deleteBttn") {
        page1.classList.add("notVisible")
        page2.classList.remove("notVisible")
        removeGrant()
    }

    return 1
}

//takes in the id of the notification and sends it to main where it can be deleted
async function deleteNotification(notificationID) {
    window.electronAPI.deleteNotificationInMain(notificationID)
}

function toggleExpiredButton() {
    if(globalViewExpired === true) {
        clearGrants()
        loadGrants()
        document.getElementById("removeExpiredButton").innerText = "Include Expired Grants"
        globalViewExpired = false
    }
    else {
        clearGrants()
        loadGrants()
        document.getElementById("removeExpiredButton").innerText = "Remove Expired Grants"
        globalViewExpired = true
    }
}

function clearGrants() {
    for (j = 0; j < 26; j++) {
        var chrL = String.fromCharCode(97 + j)
        var chrU = String.fromCharCode(65 + j)
        document.getElementById(chrU).style.display = ""
        document.getElementById(chrL + "Buttons").innerHTML = ""
    }
}

async function loadGrants() {
    // Calling for and receiving the grant variables from the database using the electron API
    let readGrants = await window.electronAPI.getDatabaseGrants();

    //for each grant in the list, it puts it into the correct letter, and displays the grant foundation, name, and color of the status
    for (let i = 0; i < readGrants.length; i += 1){
        if (i === 0 || i%4 === 0){
            if (globalViewExpired) {
                const grantA = document.createElement('button');
                var grantAid =  grantA.id = readGrants[i] + "_" + readGrants[i + 1] + "_" + readGrants[i + 3];
                grantA.id = grantAid;
                var br = document.createElement("p");
                br.textContent = "\n";
                var spacePadding = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
                grantA.style.width = "95%";
                grantA.style.padding = "10px";
                grantA.style.textAlign = "center";
                grantA.style.boxSizing = "border-box";
                grantA.style.display = "flex";
                grantA.style.justifyContent = "center";

                const leftText = "Foundation Name: " + readGrants[i];
                const rightText = "Grant Name: " + readGrants[i + 1];
                grantA.innerText = leftText + spacePadding + "|" + spacePadding + rightText

                for (j = 0; j < 26; j++) {
                    var chrL = String.fromCharCode(97 + j)
                    var chrU = String.fromCharCode(65 + j)
                    if (readGrants[i][0].toLowerCase() === chrL) {
                        document.getElementById(chrU).style.display = "block";
                        document.getElementById(chrL + "Buttons").appendChild(grantA);
                        document.getElementById(chrL + "Buttons").appendChild(br);
                    }
                }
                grantA.classList.add("grant");
                if (readGrants[i + 2] === "active"){
                    grantA.classList.add("active");
                } else if (readGrants [i + 2] === "pending"){
                    grantA.classList.add("pending")
                } else if (readGrants [i + 2] === "inConcept"){
                    grantA.classList.add("inConcept")
                } else if (readGrants [i + 2] === "expiredA") {
                grantA.classList.add("expiredA")
                } else if (readGrants [i + 2] === "expiredR") {
                    grantA.classList.add("expiredR")
                }
                grantA.addEventListener('click', onButtonClick)
            } else if (!globalViewExpired && !((readGrants [i + 2] === "expiredR") || (readGrants [i + 2] === "expiredA"))) {
                const grantA = document.createElement('button');
                var grantAid =  grantA.id = readGrants[i] + "_" + readGrants[i + 1] + "_" + readGrants[i + 3];
                grantA.id = grantAid;
                var br = document.createElement("p");
                br.textContent = "\n";
                var spacePadding = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
                grantA.style.width = "95%";
                grantA.style.padding = "10px";
                grantA.style.textAlign = "center";
                grantA.style.boxSizing = "border-box";
                grantA.style.display = "flex";
                grantA.style.justifyContent = "center";

                const leftText = "Foundation Name: " + readGrants[i];
                const rightText = "Grant Name: " + readGrants[i + 1];
                grantA.innerText = leftText + spacePadding + "|" + spacePadding + rightText

                for (j = 0; j < 26; j++) {
                    var chrL = String.fromCharCode(97 + j)
                    var chrU = String.fromCharCode(65 + j)
                    if (readGrants[i][0].toLowerCase() === chrL) {
                        document.getElementById(chrU).style.display = "block";
                        document.getElementById(chrL + "Buttons").appendChild(grantA);
                        document.getElementById(chrL + "Buttons").appendChild(br);
                    }
                }
                grantA.classList.add("grant");
                if (readGrants[i + 2] === "active"){
                    grantA.classList.add("active");
                } else if (readGrants [i + 2] === "pending"){
                    grantA.classList.add("pending")
                } else if (readGrants [i + 2] === "inConcept"){
                    grantA.classList.add("inConcept")
                }
                grantA.addEventListener('click', onButtonClick)
            }
        }

    }
}
