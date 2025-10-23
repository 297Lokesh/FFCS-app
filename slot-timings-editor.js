// Default slot timing configurations
let slotTimingsData = {
    theory: {
        // A1, B1, C1, etc.
        "A1": {
            days: ["Tuesday", "Friday", "Saturday"],
            time: "09:00 - 09:50"
        },
        "B1": {
            days: ["Tuesday", "Wednesday", "Saturday"],
            time: "10:00 - 10:50"
        },
        "C1": {
            days: ["Thursday", "Friday", "Saturday"],
            time: "09:00 - 09:50"
        },
        "D1": {
            days: ["Tuesday", "Wednesday", "Saturday"],
            time: "12:00 - 12:50"
        },
        "E1": {
            days: ["Wednesday", "Saturday"],
            time: "11:00 - 11:50"
        },
        "F1": {
            days: ["Wednesday", "Friday"],
            time: "10:00 - 10:50"
        },
        "G1": {
            days: ["Tuesday", "Friday", "Saturday"],
            time: "11:00 - 11:50"
        },
        // A2, B2, C2, etc.
        "A2": {
            days: ["Tuesday", "Thursday"],
            time: "15:00 - 15:50"
        },
        "B2": {
            days: ["Tuesday", "Wednesday"],
            time: "16:00 - 16:50"
        },
        "C2": {
            days: ["Thursday", "Friday"],
            time: "14:00 - 14:50"
        },
        "D2": {
            days: ["Wednesday", "Saturday"],
            time: "14:00 - 14:50"
        },
        "E2": {
            days: ["Wednesday", "Saturday"],
            time: "16:00 - 16:50"
        },
        "F2": {
            days: ["Tuesday", "Friday"],
            time: "14:00 - 14:50"
        },
        "G2": {
            days: ["Tuesday", "Wednesday", "Friday"],
            time: "16:00 - 16:50"
        }
    },
    tutorial: {
        // Single letter prefixed tutorial slots (TA1, TB1, etc)
        "TA1": {
            days: ["Friday"],
            time: "10:00 - 10:50"
        },
        "TB1": {
            days: ["Friday"],
            time: "09:00 - 09:50"
        },
        "TC1": {
            days: ["Tuesday"],
            time: "11:00 - 11:50"
        },
        "TD1": {
            days: ["Thursday"],
            time: "10:00 - 10:50"
        },
        "TE1": {
            days: ["Friday"],
            time: "12:00 - 12:50"
        },
        "TF1": {
            days: ["Saturday"],
            time: "11:00 - 11:50"
        },
        "TG1": {
            days: ["Thursday"],
            time: "10:00 - 10:50"
        },
        // Double letter prefixed tutorial slots (TAA1, TBB1, etc)
        "TAA1": {
            days: ["Thursday"],
            time: "11:00 - 11:50"
        },
        "TBB1": {
            days: ["Thursday"],
            time: "12:00 - 12:50"
        },
        "TCC1": {
            days: ["Friday"],
            time: "08:00 - 08:50"
        },
        "TDD1": {
            days: ["Saturday"],
            time: "08:00 - 08:50"
        },
        "TEE1": {
            days: ["Thursday"],
            time: "08:00 - 08:50"
        },
        "TFF1": {
            days: ["Tuesday"],
            time: "08:00 - 08:50"
        },
        "TGG1": {
            days: ["Wednesday"],
            time: "08:00 - 08:50"
        },
        // Second set (TA2, TB2, etc)
        "TA2": {
            days: ["Friday"],
            time: "16:00 - 16:50"
        },
        "TB2": {
            days: ["Friday"],
            time: "15:00 - 15:50"
        },
        "TC2": {
            days: ["Tuesday"],
            time: "17:00 - 17:50"
        },
        "TD2": {
            days: ["Thursday"],
            time: "17:00 - 17:50"
        },
        "TE2": {
            days: ["Thursday"],
            time: "14:00 - 14:50"
        },
        "TF2": {
            days: ["Wednesday"],
            time: "15:00 - 15:50"
        },
        "TG2": {
            days: ["Thursday", "Wednesday"],
            time: "17:00 - 17:50"
        },
        // Double letter tutorial slots (TAA2, etc)
        "TAA2": {
            days: ["Saturday"],
            time: "16:00 - 16:50"
        },
        "TBB2": {
            days: ["Saturday"],
            time: "17:00 - 17:50"
        },
        "TCC2": {
            days: ["Wednesday"],
            time: "18:00 - 18:50"
        },
        "TDD2": {
            days: ["Tuesday"],
            time: "18:00 - 18:50"
        },
        "TEE2": {
            days: ["Friday"],
            time: "18:00 - 18:50"
        },
        "TFF2": {
            days: ["Saturday"],
            time: "18:00 - 18:50"
        },
        "TGG2": {
            days: ["Thursday"],
            time: "18:00 - 18:50"
        }
    },
    lab: {}  // Lab slots will be dynamically generated
};

// Generate lab slots timing data (L1-L60)
function initLabSlotData() {
    const daysOfWeek = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = [
        "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
        "12:00 - 12:50", "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:50", 
        "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
    ];
    
    let labCount = 1;
    daysOfWeek.forEach(day => {
        timeSlots.forEach(time => {
            if (labCount <= 60) {
                slotTimingsData.lab[`L${labCount}`] = {
                    days: [day],
                    time: time
                };
                labCount++;
            }
        });
    });
}

// Load slot timing data from localStorage if available
function loadSlotTimingsData() {
    const savedData = localStorage.getItem('slotTimingsData');
    if (savedData) {
        try {
            slotTimingsData = JSON.parse(savedData);
            console.log("Successfully loaded slot timings data from localStorage");
        } catch (e) {
            console.error("Error parsing saved slot timings data", e);
        }
    } else {
        console.log("No saved slot timings data found in localStorage, using default data");
        // Initialize lab slots data for the first time
        initLabSlotData();
    }
}

// Save slot timing data to localStorage
function saveSlotTimingsData() {
    localStorage.setItem('slotTimingsData', JSON.stringify(slotTimingsData));
    alert('Slot timings data saved successfully!');
    
    // Update the timetable preview
    updateTimetableWithNewSlotTimings();
}

// Reset slot timing data to defaults
function resetSlotTimingsData() {
    if (confirm('Are you sure you want to reset all slot timings to default values? This cannot be undone.')) {
        localStorage.removeItem('slotTimingsData');
        location.reload();
    }
}

// Update the global timetableData object based on the slot timings
function updateTimetableWithNewSlotTimings() {
    // First, we need to create a new timetable structure
    let newTimetableData = {
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {},
        "Saturday": {}
    };
    
    // Initialize time slots for each day
    const timeSlots = [
        "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
        "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50",
        "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
    ];
    
    timeSlots.forEach(time => {
        for (const day in newTimetableData) {
            newTimetableData[day][time] = time === "13:00 - 13:50" ? ["Lunch"] : [];
        }
    });
    
    // Process all slot types
    const slotTypes = ["theory", "tutorial", "lab"];
    
    slotTypes.forEach(type => {
        for (const slotCode in slotTimingsData[type]) {
            const slotInfo = slotTimingsData[type][slotCode];
            const slotTime = slotInfo.time;
            const slotDays = slotInfo.days;
            
            slotDays.forEach(day => {
                if (newTimetableData[day] && newTimetableData[day][slotTime]) {
                    if (!newTimetableData[day][slotTime].includes(slotCode)) {
                        newTimetableData[day][slotTime].push(slotCode);
                    }
                }
            });
        }
    });
    
    // Store updated timetable data in localStorage
    localStorage.setItem('timetableData', JSON.stringify(newTimetableData));
    
    // Re-render the timetable preview
    renderTimetable();
}

// Render the editor UI based on slot type
function renderSlotTimingEditor() {
    const slotTypes = ["theory", "tutorial", "lab"];
    
    slotTypes.forEach(type => {
        const container = document.getElementById(`${type}-slots-container`);
        if (!container) return;
        
        container.innerHTML = '';
        
        for (const slotCode in slotTimingsData[type]) {
            const slotInfo = slotTimingsData[type][slotCode];
            
            const slotCard = document.createElement('div');
            slotCard.className = 'slot-card';
            slotCard.dataset.slot = slotCode;
            slotCard.dataset.type = type;
            
            const slotHeader = document.createElement('div');
            slotHeader.className = 'slot-header';
            slotHeader.textContent = `Slot ${slotCode}`;
            
            const timeInput = document.createElement('div');
            timeInput.className = 'time-input-group';
            timeInput.innerHTML = `
                <label>Time:</label>
                <input type="text" class="time-input" value="${slotInfo.time}" placeholder="HH:MM - HH:MM" data-slot="${slotCode}" data-type="${type}" data-field="time">
            `;
            
            const daysSelection = document.createElement('div');
            daysSelection.className = 'days-selection';
            
            const daysLabel = document.createElement('label');
            daysLabel.textContent = 'Days:';
            
            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';
            
            const daysOfWeek = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            daysOfWeek.forEach(day => {
                const isChecked = slotInfo.days.includes(day);
                
                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'checkbox-item';
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="${type}-${slotCode}-${day}" 
                        ${isChecked ? 'checked' : ''} 
                        data-slot="${slotCode}" 
                        data-type="${type}" 
                        data-day="${day}">
                    <label for="${type}-${slotCode}-${day}">${day}</label>
                `;
                
                checkboxGroup.appendChild(checkboxItem);
            });
            
            daysSelection.appendChild(daysLabel);
            daysSelection.appendChild(checkboxGroup);
            
            slotCard.appendChild(slotHeader);
            slotCard.appendChild(timeInput);
            slotCard.appendChild(daysSelection);
            
            container.appendChild(slotCard);
        }
    });
    
    // Add event listeners to all inputs
    const timeInputs = document.querySelectorAll('.time-input');
    timeInputs.forEach(input => {
        input.addEventListener('change', function() {
            const slotCode = this.dataset.slot;
            const slotType = this.dataset.type;
            const newTime = this.value.trim();
            
            // Validate time format (simple validation)
            if (/^\d{1,2}:\d{2} - \d{1,2}:\d{2}$/.test(newTime)) {
                slotTimingsData[slotType][slotCode].time = newTime;
            } else {
                alert(`Invalid time format for ${slotCode}. Please use format "HH:MM - HH:MM"`);
                this.value = slotTimingsData[slotType][slotCode].time; // Reset to previous value
            }
        });
    });
    
    const dayCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const slotCode = this.dataset.slot;
            const slotType = this.dataset.type;
            const day = this.dataset.day;
            
            if (this.checked) {
                // Add day if not already present
                if (!slotTimingsData[slotType][slotCode].days.includes(day)) {
                    slotTimingsData[slotType][slotCode].days.push(day);
                }
            } else {
                // Remove day
                slotTimingsData[slotType][slotCode].days = slotTimingsData[slotType][slotCode].days.filter(d => d !== day);
            }
        });
    });
}

// Tab switching logic
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.slot-type-btn');
    const tabContents = document.querySelectorAll('.slot-type-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabType = this.dataset.type;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabType}-slots`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Render timetable for preview
function renderTimetable() {
    const timetableElement = document.getElementById('timetable');
    if (!timetableElement) return;
    
    const timeSlots = [
        "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
        "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50",
        "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
    ];
    
    const daysOfWeek = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Attempt to load timetable data from localStorage
    let timetableData;
    const savedTimetableData = localStorage.getItem('timetableData');
    if (savedTimetableData) {
        try {
            timetableData = JSON.parse(savedTimetableData);
        } catch (e) {
            console.error("Error parsing saved timetable data", e);
            timetableData = {};
        }
    } else {
        // Initialize empty timetable data
        timetableData = {};
        daysOfWeek.forEach(day => {
            timetableData[day] = {};
            timeSlots.forEach(time => {
                timetableData[day][time] = time === "13:00 - 13:50" ? ["Lunch"] : [];
            });
        });
    }
    
    // Clear the table
    timetableElement.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time';
    headerRow.appendChild(timeHeader);
    
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    
    timetableElement.appendChild(headerRow);
    
    // Create time slot rows
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        if (timeSlot === "13:00 - 13:50") {
            row.classList.add('lunch-row');
        }
        
        const timeCell = document.createElement('td');
        timeCell.textContent = timeSlot;
        timeCell.classList.add('time-column');
        row.appendChild(timeCell);
        
        daysOfWeek.forEach(day => {
            const cell = document.createElement('td');
            
            if (timeSlot === "13:00 - 13:50") {
                const lunchBadge = document.createElement('span');
                lunchBadge.classList.add('course-badge', 'lunch-badge');
                lunchBadge.textContent = 'Lunch Break';
                cell.appendChild(lunchBadge);
            } else {
                // Ensure the day and timeslot exist in timetableData
                if (!timetableData[day]) {
                    timetableData[day] = {};
                }
                if (!timetableData[day][timeSlot]) {
                    timetableData[day][timeSlot] = [];
                }
                
                const availableSlots = timetableData[day][timeSlot];
                
                if (availableSlots && availableSlots.length > 0 && availableSlots[0] !== "Lunch") {
                    const slotsText = document.createElement('span');
                    slotsText.className = 'empty-slot';
                    slotsText.textContent = availableSlots.join(', ');
                    cell.appendChild(slotsText);
                }
            }
            
            row.appendChild(cell);
        });
        
        timetableElement.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Load slot timing data
    loadSlotTimingsData();
    
    // Set up tab switching
    setupTabSwitching();
    
    // Render the slot timing editor UI
    renderSlotTimingEditor();
    
    // Render the timetable preview
    renderTimetable();
    
    // Add event listeners for save and reset buttons
    document.getElementById('save-all-timings-btn').addEventListener('click', saveSlotTimingsData);
    document.getElementById('reset-timings-btn').addEventListener('click', resetSlotTimingsData);
});