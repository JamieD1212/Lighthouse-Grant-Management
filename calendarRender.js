// Header: calendarRender.js
// Authors: Samuel Anaevune, Abigail Bernardeau, Jamie Duncan, Ingrid Mast and Andreas Matejka
// Created: 12/09/2024
// Description: This file holds the javascript code for the Calendar page of the Lighthouse Grant Management Application, handling all of the dynamic functioning on this page.
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

let calendar;
// This event listener executes all code that needs to be run once the pages load
document.addEventListener('DOMContentLoaded', function() {
    loadCalendar()
    findDates()
});

// This function recieves the parsed notifications from main.js
async function findDates() {
    let notifications = await window.electronAPI.getParsedNotifications()

    notifications.forEach(item => {
        var first_word = item.reminder_type.slice(4)
        var word = addSpaces(first_word)
        var date = item.final_date.slice(5)
        var new_date = date.replace(/\D/g, "/")
        if(item.isReminder == "true") {
            var eventTitle = item.foundation_name + " " + word + " " + new_date
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: 'yellow',
                borderColor: 'yellow',
                textColor: 'black'
            })
        } else if(item.grant_status == "inConcept") {
            var eventTitle = item.foundation_name + " " + word + " " + "today"
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: '#59B4C1',
                borderColor: '#59B4C1'
            })
        } else if(item.grant_status == "pending") {
            var eventTitle = item.foundation_name + " " + word + " " + "today"
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: '#1155ccff',
                borderColor: '#1155ccff'
            })
        } else if(item.grant_status == "active") {
            var eventTitle = item.foundation_name + " " + word + " " + "today"
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: 'green',
                borderColor: 'green'
            })
        } else if(item.grant_status == "expiredA") {
            var eventTitle = item.foundation_name + " " + word + " " + "today"
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: '#E0843D',
                borderColor: '#E0843D'
            })
        } else if(item.grant_status == "expiredR") {
            var eventTitle = item.foundation_name + " " + word + " " + "today"
            addEvent({
                title: eventTitle,
                start: item.this_date,
                backgroundColor: '#E0573D',
                borderColor: '#E0573D'
            })
        }
    });
}

async function addNextSeven() {
    let today = new Date()
    let notifications = await window.electronAPI.getParsedNotifications()
    const inSlidep = document.getElementById('inSlidep');

    notifications.forEach(item => {
        let itemDate = new Date(item.this_date)
        let timeDifferenceSeconds = itemDate.getTime() - today.getTime()
        let numberOfDays = timeDifferenceSeconds/(24 * 3600 * 1000)
        if (numberOfDays < 8 && numberOfDays > -1) {
            var dateCurrent = item.this_date.slice(5)
            var dateCurrentReady = dateCurrent.replace(/\D/g, "/")
            var dateFinal = item.final_date.slice(5)
            var dateFinalReady = dateFinal.replace(/\D/g, "/")
            var first_word = item.reminder_type.slice(4)
            var word = addSpaces(first_word)
            const newItem = document.createElement('p1');
            newItem.textContent = dateCurrentReady + ": " + item.foundation_name + " " + word + " " + dateFinalReady;
            const newHr = document.createElement('hr');
            inSlidep.appendChild(newItem);
            inSlidep.appendChild(newHr);
        }
    })
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

function loadCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        aspectRatio: 2.5,
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth'
        },
        multiMonthMaxColumns: 2,
        editable: true,
        eventLimit: false,
        events: [],
        views: {
            multiMonthYear: {
                aspectRatio: 1.5,
            }
        },
    });
    calendar.render();
}

function clearNextSeven() {
    const inSlidep = document.getElementById('inSlidep');
    inSlidep.innerHTML = '';
}

function rerenderCalendar() {
    calendar.render();
    clearNextSeven();
    addNextSeven();
};

function addEvent(event) {
    calendar.addEvent( event );
}

// This code is to fix the sidebar from activating whenever the calendar screen is clicked
document.getElementById('toggleArea').addEventListener('click', function(event) {
    const checkbox = document.getElementById('nextSevenCheckBox');
    checkbox.checked = !checkbox.checked;
    rerenderCalendar();
    event.stopPropagation();
});

document.querySelector('label').addEventListener('click', function(event) {
    event.preventDefault();
});
