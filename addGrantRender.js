// Header: addGrantRender.js
// Authors: Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka
// Created: 12/09/2024
// Description: This file holds the javascript code for the Add Grant page of the Lighthouse Grant Management Application, managing all of the dynamic features on this page.
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

// The code below outlines the functionality for our alert modal
let secondCloseButton = document.getElementsByClassName("close")[1]

secondCloseButton.onclick = function() {
    document.getElementById("alertModal").classList.add("notVisible")
}

window.onclick = function(event) {
    if (event.target == document.getElementById("alertModal")) {
        document.getElementById("alertModal").classList.add("notVisible")
    }
}

// The code below makes certain elements visible and not visible based on which type of grant has been selected.

// This function calls other functions which need to be initiated when the type of grant the user is adding is changed
function grantTypeChange(answer) {
    toggleQuestions(answer)
    deleteReminders()
}

// Creating a function which is called when there is a change to the drop down box. This function takes the variable answer which is the drop down value selected.
// Based on the drop down box answer, the styling of different question boxes and labels is changed so they appear on or disapear from the screen.
function toggleQuestions(answer) {
    document.getElementById("directorLabel").classList.remove("notVisible")
    document.getElementById("directorInput").classList.remove("notVisible")
    document.getElementById("reminderLabel").classList.remove("notVisible")
    document.getElementById("reminderNumber").classList.remove("notVisible")
    document.getElementById("reminderDropDown").classList.remove("notVisible")
    document.getElementById("deadlineLabel").classList.remove("notVisible")
    document.getElementById("deadlineInput").classList.remove("notVisible")
    document.getElementById("reminderNumberLabel").classList.remove("notVisible")
    document.getElementById("reminderNumberInput").classList.remove("notVisible")
    document.getElementById("firstLabel").classList.remove("notVisible")
    document.getElementById("firstInput").classList.remove("notVisible")
    document.getElementById("addReminderButton").classList.remove("notVisible")
    document.getElementById("notesLabel").classList.remove("notVisible")
    document.getElementById("notesInput").classList.remove("notVisible")
    document.getElementById("attachmentsLabel").classList.remove("notVisible")
    document.getElementById("attachmentButton").classList.remove("notVisible")
    document.getElementById("submitButton").classList.remove("notVisible")
    document.getElementById("grantAwardedDropDown").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("expiredDateLabel").classList.add("notVisible")
    document.getElementById("appliedDateLabel").classList.add("notVisible")
    document.getElementById("expiredInput").classList.add("notVisible")
    if(answer.value == "inConcept") {
        inConceptToggle()
    } else if(answer.value == "pending") {
        pendingToggle()
    } else if(answer.value == "active") {
        activeToggle()
    } else if(answer.value == "expired") {
        expiredToggle()
   }
}

// This function adds visibiltiy to form items needed for in-concept grants and removes visibility from those not needed.
function inConceptToggle() {
    document.getElementById("requestAmountLabel").classList.remove("notVisible")
    document.getElementById("requestAmountInput").classList.remove("notVisible")
    document.getElementById("expectedLabel").classList.add("notVisible")
    document.getElementById("expectedInput").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("dueByLabel").classList.remove("notVisible")
    document.getElementById("hearByLabel").classList.add("notVisible")
    document.getElementById("endDateLabel").classList.add("notVisible")
    document.getElementById("beforeInput").classList.remove("notVisible")
    document.getElementById("activeInput").classList.add("notVisible")
    document.getElementById("grantAwardedDropDown").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("expiredDateLabel").classList.add("notVisible")
    document.getElementById("appliedDateLabel").classList.add("notVisible")
    document.getElementById("expiredInput").classList.add("notVisible")
}

// This function adds visibiltiy to form items needed for pending grants and removes visibility from those not needed.
function pendingToggle() {
    document.getElementById("requestAmountLabel").classList.remove("notVisible")
    document.getElementById("requestAmountInput").classList.remove("notVisible")
    document.getElementById("expectedLabel").classList.remove("notVisible")
    document.getElementById("expectedInput").classList.remove("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("dueByLabel").classList.add("notVisible")
    document.getElementById("hearByLabel").classList.remove("notVisible")
    document.getElementById("endDateLabel").classList.add("notVisible")
    document.getElementById("beforeInput").classList.remove("notVisible")
    document.getElementById("activeInput").classList.add("notVisible")
    document.getElementById("grantAwardedDropDown").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("expiredDateLabel").classList.add("notVisible")
    document.getElementById("appliedDateLabel").classList.add("notVisible")
    document.getElementById("expiredInput").classList.add("notVisible")
}

// This function adds visibiltiy to form items needed for active grants and removes visibility from those not needed.
function activeToggle() {
    document.getElementById("requestAmountLabel").classList.add("notVisible")
    document.getElementById("requestAmountInput").classList.add("notVisible")
    document.getElementById("expectedLabel").classList.add("notVisible")
    document.getElementById("expectedInput").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.remove("notVisible")
    document.getElementById("awardedAmountInput").classList.remove("notVisible")
    document.getElementById("dueByLabel").classList.add("notVisible")
    document.getElementById("hearByLabel").classList.add("notVisible")
    document.getElementById("endDateLabel").classList.remove("notVisible")
    document.getElementById("beforeInput").classList.add("notVisible")
    document.getElementById("activeInput").classList.remove("notVisible")
    document.getElementById("grantAwardedDropDown").classList.add("notVisible")
    document.getElementById("expiredDateLabel").classList.add("notVisible")
    document.getElementById("appliedDateLabel").classList.add("notVisible")
    document.getElementById("expiredInput").classList.add("notVisible")
}

// This function adds visibiltiy to form items needed for expired grants and removes visibility from those not needed.
function expiredToggle() {
    document.getElementById("directorLabel").classList.add("notVisible")
    document.getElementById("directorInput").classList.add("notVisible")
    document.getElementById("reminderLabel").classList.add("notVisible")
    document.getElementById("reminderNumber").classList.add("notVisible")
    document.getElementById("reminderDropDown").classList.add("notVisible")
    document.getElementById("deadlineLabel").classList.add("notVisible")
    document.getElementById("deadlineInput").classList.add("notVisible")
    document.getElementById("reminderNumberLabel").classList.add("notVisible")
    document.getElementById("reminderNumberInput").classList.add("notVisible")
    document.getElementById("firstLabel").classList.add("notVisible")
    document.getElementById("firstInput").classList.add("notVisible")
    document.getElementById("requestAmountLabel").classList.add("notVisible")
    document.getElementById("requestAmountInput").classList.add("notVisible")
    document.getElementById("expectedLabel").classList.add("notVisible")
    document.getElementById("expectedInput").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("dueByLabel").classList.add("notVisible")
    document.getElementById("hearByLabel").classList.add("notVisible")
    document.getElementById("endDateLabel").classList.add("notVisible")
    document.getElementById("beforeInput").classList.add("notVisible")
    document.getElementById("activeInput").classList.add("notVisible")
    document.getElementById("addReminderButton").classList.add("notVisible")
    // Removing the drop down and creating a new one so it is reset to the non-clickable label option each time
    document.getElementById("grantAwardedDropDown").remove()
    let thisDiv = document.getElementById("grantAwarded?")
    const expiredDropDown = document.createElement("select")
    const starterOption = new Option("Grant Awarded?", "value")
    starterOption.disabled = "true"
    const yesOption = new Option("Yes", "yes")
    const noOption = new Option("No", "no")
    thisDiv.appendChild(expiredDropDown)
    expiredDropDown.appendChild(starterOption)
    expiredDropDown.appendChild(yesOption)
    expiredDropDown.appendChild(noOption)
    expiredDropDown.selectedIndex = 0;
    expiredDropDown.setAttribute("id", "grantAwardedDropDown")
    expiredDropDown.classList.add("fullWidth")
    expiredDropDown.setAttribute("onChange", "toggleAwarded(this)")
    //Making more elements not visible
    document.getElementById("notesLabel").classList.add("notVisible")
    document.getElementById("notesInput").classList.add("notVisible")
    document.getElementById("attachmentsLabel").classList.add("notVisible")
    document.getElementById("attachmentButton").classList.add("notVisible")
    document.getElementById("submitButton").classList.add("notVisible")
}

// This function is called when there is a change to the grant awarded drop down box (only visible when a grant is marked as expired). The one parameter is the drop down variable selected.
// Based on the selection (yes or no) the css of elements is changed so they toggle between being hidden and visible.
function toggleAwarded(answer) {
    document.getElementById("expiredInput").classList.remove("notVisible")
    document.getElementById("notesLabel").classList.remove("notVisible")
    document.getElementById("notesInput").classList.remove("notVisible")
    document.getElementById("attachmentsLabel").classList.remove("notVisible")
    document.getElementById("attachmentButton").classList.remove("notVisible")
    document.getElementById("submitButton").classList.remove("notVisible")
    if(answer.value == "yes") {
       document.getElementById("awardedAmountLabel").classList.remove("notVisible")
       document.getElementById("awardedAmountInput").classList.remove("notVisible")
       document.getElementById("addGrantAwarded").style.left = "170px"
       document.getElementById("expiredDateLabel").classList.remove("notVisible")
       document.getElementById("directorLabel").classList.remove("notVisible")
       document.getElementById("directorInput").classList.remove("notVisible")
       document.getElementById("addGrantDirector").style.left = "480px"
    } else {
       document.getElementById("awardedAmountLabel").classList.add("notVisible")
       document.getElementById("awardedAmountInput").classList.add("notVisible")
       document.getElementById("addGrantAwarded").style.left = "300px"
       document.getElementById("expiredDateLabel").classList.add("notVisible")
       document.getElementById("directorLabel").classList.add("notVisible")
       document.getElementById("directorInput").classList.add("notVisible")
       document.getElementById("addGrantDirector").style.left = "0px"
   } if(answer.value == "no") {
       document.getElementById("appliedDateLabel").classList.remove("notVisible")
       document.getElementById("requestAmountLabel").classList.remove("notVisible")
       document.getElementById("requestAmountInput").classList.remove("notVisible")
       document.getElementById("addGrantRequest").style.left = "170px"
   } else {
       document.getElementById("appliedDateLabel").classList.add("notVisible")
       document.getElementById("requestAmountLabel").classList.add("notVisible")
       document.getElementById("requestAmountInput").classList.add("notVisible")
       document.getElementById("addGrantRequest").style.left = "300px"
   }
}

// This section of code handles the adding and removing of reminder sections based on which buttons the user presses.

// Variables for the adding reminder element section
const subButton = document.getElementById("subtractReminderButton")
let remindersAdded = 0

// This function adds a new reminder section when the user presses the add reminder button
function addReminder() {
    remindersAdded += 1
    addReminderLabel()
    addReminderDropDown()
    addDeadline()
    addNumber()
    addFirstReminder()
    subButton.classList.remove("notVisible")
}

// This function adds a reminder number label to the add grant page
function addReminderLabel() {
    let reminderDiv = document.getElementById("reminderSection")
    const newReminderLabel = document.createElement("p")
    newReminderLabel.innerText = "Reminder #" + (remindersAdded + 1) +": "
    reminderDiv.appendChild(newReminderLabel)
    newReminderLabel.style.fontSize = "18px"
    let idName = "newLabel" + remindersAdded
    newReminderLabel.setAttribute("id", idName)
}

// This function creates a new reminder type drop down box and styles it so it appears in the correct location.
function addReminderDropDown() {
    let reminderDiv = document.getElementById("reminderSection")
    const newReminderDropDown = document.createElement("select")
    const newReminderStarter = new Option("Notification Type", "value")
    newReminderStarter.disabled = "true"
    let firstIdName = "newFirstSelect" + remindersAdded
    newReminderStarter.setAttribute("id", firstIdName)
    const newReminderReport = new Option("Report Due", "noteReportDue")
    const newReminderExpires = new Option("Expires", "noteExpires")
    const newReminderLook = new Option("Look At", "noteLookAt")
    const newReminderApplication = new Option("Application Due", "noteApplicationDue")
    const newReminderHear = new Option("Hear By", "noteHearBy")
    reminderDiv.appendChild(newReminderDropDown)
    newReminderDropDown.appendChild(newReminderStarter)
    newReminderDropDown.appendChild(newReminderReport)
    newReminderDropDown.appendChild(newReminderExpires)
    newReminderDropDown.appendChild(newReminderLook)
    newReminderDropDown.appendChild(newReminderApplication)
    newReminderDropDown.appendChild(newReminderHear)
    newReminderDropDown.selectedIndex = 0;
    //Giving the drop down box an id
    let idName = "newDropDown" + remindersAdded
    newReminderDropDown.setAttribute("id", idName)

    //Disabling the first drop down option so it is used only as a label
    newReminderDropDown.options[0].disabled = true
    newReminderDropDown.classList.add("fullWidth")
    newReminderDropDown.style.borderRadius = "4px"
    newReminderDropDown.setAttribute("onChange", 'addReminderAsterisks(remindersAdded)')
}

// This function creates a new deadline input box and labels and defines the position of them based on the occurence of other reminders.
function addDeadline() {
    let reminderDiv = document.getElementById("reminderSection")
    // Creating and styling the deadline label
    const newDeadlineLabel = document.createElement("label")
    newDeadlineLabel.innerText = "Deadline: "
    reminderDiv.appendChild(newDeadlineLabel)
    // Giving the deadline label an id
    let deadlineLabelId = "newDeadlineLabel" + remindersAdded
    newDeadlineLabel.setAttribute("id", deadlineLabelId)


    // Creating and styling the deadline input
    const newDeadlineInput = document.createElement("input")
    newDeadlineInput.type = "date"
    reminderDiv.appendChild(newDeadlineInput)
    newDeadlineInput.classList.add("reminderDateWidth")
    // Giving the deadline input an id
    let deadlineInputId = "newDeadlineInput" + remindersAdded
    newDeadlineInput.setAttribute("id", deadlineInputId)
    newDeadlineInput.setAttribute("onChange", 'addReminderAsterisks(remindersAdded)')
}

// This function creates a new number of reminders input box and labels and defines the position of them based on the occurence of other reminders.
function addNumber() {
    let reminderDiv = document.getElementById("reminderSection")
    // Smaller div to prevent the label for the following input from formatting weirdly
    let smallerDiv = document.createElement("div")
    // Creating and styling the number of reminders label
    const newReminderNumberLabel = document.createElement("label")
    newReminderNumberLabel.innerText = "Number of Reminders: "
    reminderDiv.appendChild(smallerDiv)
    smallerDiv.appendChild(newReminderNumberLabel)
    // Giving the number label an id
    let numberLabelId = "newNumberLabel" + remindersAdded
    newReminderNumberLabel.setAttribute("id", numberLabelId)

    // Creating and styling the number of reminders input box
    const newReminderNumberInput = document.createElement("input")
    newReminderNumberInput.type = "number"
    smallerDiv.appendChild(newReminderNumberInput)
    // Giving the number input an id
    let numberInputId = "newNumberInput" + remindersAdded
    newReminderNumberInput.setAttribute("id", numberInputId)
    newReminderNumberInput.classList.add("smallerWidth")
    newReminderNumberInput.setAttribute("onChange", 'addReminderAsterisks(remindersAdded)')
}

// This function creates a new first reminder by input box and labels and defines the position of them based on the occurence of other reminders.
function addFirstReminder() {
    let reminderDiv = document.getElementById("reminderSection")
    // Creating and styling the first reminder label
    const newFirstReminderLabel = document.createElement("label")
    newFirstReminderLabel.innerText = "First Reminder On:"
    reminderDiv.appendChild(newFirstReminderLabel)
    // Giving the first reminder label an id
    let firstLabelId = "newFirstLabel" + remindersAdded
    newFirstReminderLabel.setAttribute("id", firstLabelId)

    // Creating and styling the first reminder input
    const newFirstReminderInput = document.createElement("input")
    newFirstReminderInput.type = "date"
    reminderDiv.appendChild(newFirstReminderInput)
    // Giving the first reminder input an id
    let firstInputId = "newFirstInput" + remindersAdded
    newFirstReminderInput.setAttribute("id", firstInputId)
    newFirstReminderInput.classList.add("reminderDateWidth")
    newFirstReminderInput.setAttribute("onChange", 'addReminderAsterisks(remindersAdded)')
}

// This function handles the process of deleting a reminder. It is called when the remove reminder button is clicked.
function subReminder() {
    subReminderLabel()
    subReminderDropDown()
    subDeadline()
    subNumber()
    subFirstReminder()
    remindersAdded -= 1
    if(remindersAdded == 0) {
        document.getElementById("subtractReminderButton").classList.add("notVisible")
    }
}

// This function removes the reminder label that was just added to the page
function subReminderLabel() {
    let idNameDropDown = "newLabel" + remindersAdded
    let removedDropDown = document.getElementById(idNameDropDown)
    removedDropDown.remove()
}

// This function removes the reminder type drop down that was just added to the page
function subReminderDropDown() {
    let idNameDropDown = "newDropDown" + remindersAdded
    let removedDropDown = document.getElementById(idNameDropDown)
    removedDropDown.remove()
}

// This function removes the deadline form that was just added to the page
function subDeadline() {
    // Removing deadline label
    let idNameDeadlineLabel = "newDeadlineLabel" + remindersAdded
    let removedDeadlineLabel = document.getElementById(idNameDeadlineLabel)
    removedDeadlineLabel.remove()

    // Removing deadline input
    let idNameDeadlineInput = "newDeadlineInput" + remindersAdded
    let removedDeadlineInput = document.getElementById(idNameDeadlineInput)
    removedDeadlineInput.remove()
}

// This function removes the number of reminders form that was just added to the page
function subNumber() {
    // Removing the number of reminders label
    let idNumberLabel = "newNumberLabel" + remindersAdded
    let removedNumberLabel = document.getElementById(idNumberLabel)
    removedNumberLabel.remove()

    // Removing the number of reminders input
    let idNumberInput = "newNumberInput" + remindersAdded
    let removedNumberInput = document.getElementById(idNumberInput)
    removedNumberInput.remove()
}

// This function removes the first reminder form that was just added to the page
function subFirstReminder() {
    // Removing the first reminder label
    let idFirstLabel = "newFirstLabel" + remindersAdded
    let removedFirstLabel = document.getElementById(idFirstLabel)
    removedFirstLabel.remove()

    // Removing the first reminder input
    let idFirstInput = "newFirstInput" + remindersAdded
    let removedFirstInput = document.getElementById(idFirstInput)
    removedFirstInput.remove()
}

// This function resets the reminders so there is just one reminder displayed at a time, even if other reminders were added in previous add grant tabs
function deleteReminders() {
    while (remindersAdded > 0) {
        subReminderLabel()
        subReminderDropDown()
        subDeadline()
        subNumber()
        subFirstReminder()
        remindersAdded -= 1
   }
   document.getElementById("subtractReminderButton").classList.add("notVisible")
}

// This function adds asterisks to all of the labels for the first reminder section on the add grant page
function addFirstReminderAsterisks() {
    document.getElementById("disabledSelection").innerHTML = "Notification Type *"
    document.getElementById("deadlineLabel").innerHTML = "Deadline: *"
    document.getElementById("reminderNumberLabel").innerHTML = "Number of Reminders: *"
    document.getElementById("firstLabel").innerHTML = "First Reminder On: *"
}

// This function removes the asterisks from all of the labels for the first reminder section on the add grant page
function removeFirstReminderAsterisks() {
    document.getElementById("disabledSelection").innerHTML = "Notification Type"
    document.getElementById("deadlineLabel").innerHTML = "Deadline: "
    document.getElementById("reminderNumberLabel").innerHTML = "Number of Reminders: "
    document.getElementById("firstLabel").innerHTML = "First Reminder On: "
}

// This function adds asterisks to all the labels for the reminder section denoted by the reminder number which is passed as a parameter.
function addReminderAsterisks(reminderNum) {
    document.getElementById("newFirstSelect" + reminderNum).innerHTML = "Notification Type *"
    document.getElementById("newDeadlineLabel" + reminderNum).innerHTML = "Deadline: *"
    document.getElementById("newNumberLabel" + reminderNum).innerHTML = "Number of Reminders: *"
    document.getElementById("newFirstLabel" + reminderNum).innerHTML = "First Reminder On: *"
}

// The code below handles the submission of user data. It is checked to make sure it is valid before being sent to the main.js file where it is added to the database.

// This function resets the add grant page when the user wants to add another grant after they have submitted one
function newGrant() {
    // Removing any reminders that we added
    deleteReminders()
    // And removing the asterisks from the first set of reminders
    removeFirstReminderAsterisks()
    // Hidding all elements except those that are required for each grant
    document.getElementById("directorLabel").classList.add("notVisible")
    document.getElementById("directorInput").classList.add("notVisible")
    document.getElementById("grantAwardedDropDown").classList.add("notVisible")
    document.getElementById("requestAmountLabel").classList.add("notVisible")
    document.getElementById("requestAmountInput").classList.add("notVisible")
    document.getElementById("expectedLabel").classList.add("notVisible")
    document.getElementById("expectedInput").classList.add("notVisible")
    document.getElementById("awardedAmountLabel").classList.add("notVisible")
    document.getElementById("awardedAmountInput").classList.add("notVisible")
    document.getElementById("dueByLabel").classList.add("notVisible")
    document.getElementById("hearByLabel").classList.add("notVisible")
    document.getElementById("beforeInput").classList.add("notVisible")
    document.getElementById("endDateLabel").classList.add("notVisible")
    document.getElementById("activeInput").classList.add("notVisible")
    document.getElementById("expiredDateLabel").classList.add("notVisible")
    document.getElementById("appliedDateLabel").classList.add("notVisible")
    document.getElementById("expiredInput").classList.add("notVisible")
    document.getElementById("reminderLabel").classList.add("notVisible")
    document.getElementById("reminderNumber").classList.add("notVisible")
    document.getElementById("reminderDropDown").classList.add("notVisible")
    document.getElementById("deadlineLabel").classList.add("notVisible")
    document.getElementById("deadlineInput").classList.add("notVisible")
    document.getElementById("reminderNumberLabel").classList.add("notVisible")
    document.getElementById("reminderNumberInput").classList.add("notVisible")
    document.getElementById("firstLabel").classList.add("notVisible")
    document.getElementById("firstInput").classList.add("notVisible")
    document.getElementById("addReminderButton").classList.add("notVisible")
    document.getElementById("notesLabel").classList.add("notVisible")
    document.getElementById("notesInput").classList.add("notVisible")
    document.getElementById("attachmentsLabel").classList.add("notVisible")
    document.getElementById("attachmentButton").classList.add("notVisible")
    document.getElementById("submitButton").classList.add("notVisible")
    // Making the input fields for grant name and grant foundation/source blank
    document.getElementById("grantNameInput").value = ""
    document.getElementById("addGrantFoundationInput").value = ""
    // Resetting the grant type drop down (this involves deleting and re-creating the drop down in order for the select disabled option to remain)
    document.getElementById("grantIsDropDown").remove()
    const grantTypeDropDown = document.createElement("select")
    const starterOption = new Option("This Grant Is *", "value")
    starterOption.disabled = "true"
    const inConceptOption = new Option("In Concept", "inConcept")
    const pendingOption = new Option("Pending", "pending")
    const activeOption = new Option("Active", "active")
    const expiredOption = new Option("Expired", "expired")
    let section = document.getElementById("firstDropDown")
    section.appendChild(grantTypeDropDown)
    grantTypeDropDown.appendChild(starterOption)
    grantTypeDropDown.appendChild(inConceptOption)
    grantTypeDropDown.appendChild(pendingOption)
    grantTypeDropDown.appendChild(activeOption)
    grantTypeDropDown.appendChild(expiredOption)
    grantTypeDropDown.setAttribute("id", "grantIsDropDown")
    grantTypeDropDown.selectedIndex = 0;
    grantTypeDropDown.setAttribute("onChange", "grantTypeChange(this)")
    grantTypeDropDown.classList.add("fullWidth")
}

// This function determines if the dates of any of the reminders the user is setting occured in the past
// Parameters: numReminders (the number of reminders added for the specific grant), thisDay (a date object created with today's date)
// Returns: a boolean value based on whether or not dates for reminders occured in the past
function findBadReminderDates(numReminders, thisDay) {
    // Checking to make sure the initial reminder dates are valid
    let ogDeadline = document.getElementById("deadlineInput").value
    let ogDeadlineDate = new Date(ogDeadline)
    let ogFirst = document.getElementById("firstInput").value
    let ogFirstDate = new Date(ogFirst)
    if(ogDeadlineDate.getTime() < thisDay.getTime() || ogFirstDate.getTime() < thisDay.getTime()) {
        return true
    }

    // Checking to make sure initial reminder dates added in are valid
    let numberOfReminders = numReminders
    while(numberOfReminders > 0) {
        let deadlineId = "newDeadlineInput" + numberOfReminders
        let deadline = document.getElementById(deadlineId).value
        let deadlineDate = new Date(deadline)
        let firstId = "newFirstInput" + numberOfReminders
        let first = document.getElementById(firstId).value
        let firstDate = new Date(first)

        if(deadlineDate.getTime() < thisDay.getTime() || firstDate.getTime() < thisDay.getTime()) {
            return true
        }
        numberOfReminders -= 1
    }
    return false
}

// This function determines if some fields for a reminder have been filled out, while others have not. It returns a boolean value based on whether some fields have been forgotten
function findBadReminders(numReminders) {
    let ogDropDown = document.getElementById("reminderDropDown").value
    let ogDeadline = document.getElementById("deadlineInput").value
    let ogReminderNumber = document.getElementById("reminderNumberInput").value
    let ogFirst = document.getElementById("firstInput").value

    if((ogDropDown != "Notification Type" && (ogDeadline == "" || ogReminderNumber == "" || ogFirst == "")) || (ogDeadline != "" && (ogDropDown == "Notification Type" || ogReminderNumber == "" || ogFirst == "")) || (ogReminderNumber != "" && (ogDeadline == "" || ogDropDown == "Notification Type" || ogFirst == "")) || (ogFirst != "" && (ogDeadline == "" || ogReminderNumber == "" || ogDropDown == "Notificatin Type"))) {
        return true
    } else {
        if(numReminders > 0) {
            let numberOfReminders = numReminders
            while(numberOfReminders > 0) {
                let dropDownId = "newDropDown" + numberOfReminders
                let dropDown = document.getElementById(dropDownId).value
                let deadlineId = "newDeadlineInput" + numberOfReminders
                let deadline = document.getElementById(deadlineId).value
                let firstId = "newFirstInput" + numberOfReminders
                let first = document.getElementById(firstId).value
                let numberId = "newNumberInput" + numberOfReminders
                let number = document.getElementById(numberId).value

                if((dropDown != "Notification Type" && (deadline == "" || number == "" || first == "")) || (deadline != "" && (dropDown == "Notification Type" || number == "" || first == "")) || (number != "" && (deadline == "" || dropDown == "Notification Type" || first == "")) || (first != "" && (deadline == "" || number == "" || dropDown == "Notificatin Type"))) {
                    return true
                }
                numberOfReminders -= 1
            }
        } else {
            return false
        }
    }
}

// This function returns a boolean value based on whether a grant exists in the database with the given grant name and foundation name. To determine this, the information is sent to the main.mjs file where the database it queried.
async function doesGrantExist(thisName, thisFoundation) {
    let returnValue = await window.electronAPI.getInfoToCheck(thisName, thisFoundation)
    return returnValue
}

// This function is called when the user clicks the submit button. It alerts them if they need to add a grant name and otherwise displays a message saying the grant has been submitted.
async function checkSubmission() {
    let grantName = document.getElementById("grantNameInput").value
    let grantType = document.getElementById("grantIsDropDown").value
    let source = document.getElementById("addGrantFoundationInput").value
    let dueOrHearBy = document.getElementById("beforeInput").value
    let dueOrHearDate = new Date(dueOrHearBy)
    let endDate = document.getElementById("activeInput").value
    let endOn = new Date(endDate)
    let today = new Date()
    let badReminderDate = findBadReminderDates(remindersAdded, today)
    let badReminders = findBadReminders(remindersAdded)
    let grantMade = await doesGrantExist(grantName, source)
    if(grantName == "") {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "Please enter a grant name."
    } else if(source == "") {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "Please enter a foundation name."
    } else if(grantType != "expired" && (endOn.getTime() < today.getTime() || dueOrHearDate.getTime() < today.getTime())) {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "Date cannot occur in the past."
    } else if(badReminderDate == true) {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "Dates for reminders cannot occur in the past."
    } else if(badReminders == true) {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "All fields must be filled out for each reminder."
    } else if(grantMade == true) {
        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "A grant with this foundation and this name already exists!"
    } else {
        // Calling functions that gather user input
        gatherUserInput(grantName, source);
        gatherNotificationInput(grantName, source);

        // This is for sending the attachment information
        const input = document.getElementById('attachmentButton');
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
            const dataToSend = [source + "_" + grantName, ...fileData];
            window.electronAPI.sendFiles(dataToSend)
        })

        document.getElementById("alertModal").classList.remove("notVisible")
        document.getElementById("alertModalText").innerHTML = "Grant Submitted!"
        newGrant();
    }
}

// This function gathers the user input from relative text fields. It is called when the user presses the submit button.
function gatherUserInput(grantName, grantFoundation) {
    // Grant name and foundation do not need to be collected because they were already passed as parameters
    let grantType = document.getElementById("grantIsDropDown").value
    // Determining if the grant was awarded or not
    let awarded = document.getElementById("grantAwardedDropDown").value
    // Setting the grant type to expiredA or expiredR based on whether an expired grant was accepted or rejected
    if(grantType == "expired") {
        if(awarded == "yes") {
            grantType = "expiredA"
        } else {
            grantType = "expiredR"
        }
    }
    // Gathering notes input
    let grantNotes = document.getElementById("notesInput").value
    // Gathering director input
    let director = document.getElementById("directorInput").value
    // Gathering request amount input
    let request = document.getElementById("requestAmountInput").value
    //Gathering expected amount input
    let expect = document.getElementById("expectedInput").value
    // Gathering awarded amount input
    let awardedAmount = document.getElementById("awardedAmountInput").value
    // Gathering due by or hear by date
    let beforeDate = document.getElementById("beforeInput").value
    // Gathering end date
    let endDate = document.getElementById("activeInput").value
    // Gathering dates for expired grants
    let expiredDate = document.getElementById("expiredInput").value

    // Adding to the reminders added variable to get the current value
    let reminderNum = remindersAdded + 1

    // Sending essential informatin about the grant to the main.js file
    window.electronAPI.gatherEssentialInfo(grantName, grantFoundation, grantType, awarded, grantNotes, director, request, expect, awardedAmount, beforeDate, endDate, expiredDate, reminderNum)
}

// This function sends information entered by the user about each reminder to the main.js file so it can be added to the database
function gatherNotificationInput(grantName, grantFoundation) {
    // Gathering information from the first reminder
    let ogReminderType = document.getElementById("reminderDropDown").value
    let ogDeadline = document.getElementById("deadlineInput").value
    let ogNumber = document.getElementById("reminderNumberInput").value
    let ogFirst = document.getElementById("firstInput").value

    //initializing the values tbh not sure if this needs to be done but when the let was in the if statements it looked sad
    let thisDate = document.getElementById("beforeInput").value
    let reminderTypeP = "noteHearBy"
    //for the Parsed Table
    //this sets the notification for the initial date that is put in regardless of if there are notifications selected
    let statusP = document.getElementById("grantIsDropDown").value


    if(statusP == "inConcept") {
        thisDate = document.getElementById("beforeInput").value
        reminderTypeP = "noteApplicationDue"
    } else if (statusP == "pending"){
        thisDate = document.getElementById("beforeInput").value
        reminderTypeP = "noteHearBy"
    } else if(statusP == "active"){
        thisDate = document.getElementById("activeInput").value
        reminderTypeP = "noteExpires"
    }
    let finalDate = thisDate
    let isReminder = "false"
    //and name is grantName

    //sending initial date plugged in to user bar as notification to parsed notification to main.js
    window.electronAPI.gatherParsedNotificationInput(grantName, grantFoundation, statusP, thisDate, finalDate, isReminder, reminderTypeP)

    //sending information from the first reminder to main.js for parsed notification
    let reminderstoAdd = []
    if(ogNumber > 0) {
        reminderstoAdd = determineReminderDates(ogFirst, ogDeadline, ogNumber)
        for (const aDate of reminderstoAdd) {
            isReminder = "true"
            window.electronAPI.gatherParsedNotificationInput(grantName, grantFoundation, statusP, aDate, ogDeadline, isReminder, ogReminderType)
        }
    }

    if (!(ogReminderType == reminderTypeP && ogDeadline == finalDate) && (ogReminderType != "Notification Type")) {
        isReminder = "false"
        window.electronAPI.gatherParsedNotificationInput(grantName, grantFoundation, statusP, ogDeadline, ogDeadline, isReminder, ogReminderType)
    }

    // Sending information from the first reminder to main.js
    window.electronAPI.gatherNotificationInput(grantName, grantFoundation, statusP, ogReminderType, ogDeadline, ogNumber, ogFirst)

    // Establishing the number of reminders added on top of the pre-populated one
    let reminderCounter = remindersAdded

    // Using a while loop to send reminder information to main.js for each added reminder
    while(reminderCounter > 0) {
        let idNameDropDown = "newDropDown" + reminderCounter
        let reminderType = document.getElementById(idNameDropDown).value

        let idNameDeadlineInput = "newDeadlineInput" + reminderCounter
        let deadline = document.getElementById(idNameDeadlineInput).value

        let idNameNewNumberInput = "newNumberInput" + reminderCounter
        let number = document.getElementById(idNameNewNumberInput).value

        let idNameFirstInput = "newFirstInput" + reminderCounter
        let first = document.getElementById(idNameFirstInput).value

        // Sending the information to main.js
        window.electronAPI.gatherNotificationInput(grantName, grantFoundation, statusP, reminderType, deadline, number, first)

       //sending information from the first reminder to main.js for parsed notification
       let reminderstoAdd = []
       if(number > 0) {
           reminderstoAdd = determineReminderDates(first, deadline, number)
           for (const aDate of reminderstoAdd) {
               isReminder = "true"
               window.electronAPI.gatherParsedNotificationInput(grantName, grantFoundation, statusP, aDate, deadline, isReminder, reminderType)
           }
       }

       if (!(reminderTypeP == reminderType && deadline == finalDate)) {
           isReminder = "false"
           window.electronAPI.gatherParsedNotificationInput(grantName, grantFoundation, statusP, deadline, deadline, isReminder, reminderType)
       }

       reminderCounter -= 1
   }
}

// This function determines the dates on which emails for a given reminder should be sent based on the reminder deadline, the number of reminders requested, and the requested date of the first reminder
// Parameters: a string representing the date of the first reminder, a string representing the reminder deadline and the number of reminders
// Returns: an array with strings representing the dates on which each email/calendar notification will be provided for a given reminder
function determineReminderDates(firstDate, deadline, reminderNumber) {
    let finalDates = [firstDate]
    let days = findNumberOfDays(firstDate, deadline)
    let interval = Math.round(days/reminderNumber)

    // Subtracting a reminder to account for the first reminder which was already added to the list
    reminderNumber -= 1
    let pastDate = new Date(firstDate)

    // Adding dates to the list at evenly dispersed intervals (a reminder will be provided on the deadline which is not included in this list)
    while(reminderNumber > 0) {
       days -= interval
       let thisDate = pastDate
       thisDate.setDate(thisDate.getDate() + interval)
       let presentableDate = thisDate.getFullYear() + "-" + padWithZero(thisDate.getMonth() + 1) + "-" + padWithZero(thisDate.getDate())
       finalDates.push(presentableDate)
       reminderNumber -= 1
    }
    return finalDates
}
// This is to ensure the dates that are pushed to finalDates have the format YYYY-MM-DD as it was possible for YYYY-M-D which the calendar could not read
function padWithZero(value) {
    return value.toString().padStart(2, '0');
}

function findNumberOfDays(first, second) {
    let startDate = new Date(first)
    let endDate = new Date(second)
    let timeDifferenceSeconds = endDate.getTime() - startDate.getTime()
    let numberOfDays = timeDifferenceSeconds/(24 * 3600 * 1000)
    return numberOfDays
}
