let timeSlots = [
    "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
    "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50",
    "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
];
let daysOfWeek = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let timetableData = {
    "Tuesday": {
        "08:00 - 08:50": ["TFF1", "L1"],
        "09:00 - 09:50": ["A1", "L2"],
        "10:00 - 10:50": ["B1", "L3"],
        "11:00 - 11:50": ["TC1","G1", "L4"],
        "12:00 - 12:50": ["D1", "L5"],
        "13:00 - 13:50": ["Lunch", "L6"],
        "14:00 - 14:50": ["F2",  "L31"],
        "15:00 - 15:50": ["A2", "L32"],
        "16:00 - 16:50": ["B2", "L33"],
        "17:00 - 17:50": ["TC2/G2", "L34"],
        "18:00 - 18:50": ["L35", "TDD2"],
        "19:00 - 19:50": ["L36"]
    },
    "Wednesday": {
        "08:00 - 08:50": ["TGG1", "L7"],
        "09:00 - 09:50": ["D1", "L8"],
        "10:00 - 10:50": ["F1", "L9"],
        "11:00 - 11:50": ["E1","SC2", "L10"],
        "12:00 - 12:50": ["B1", "L11"],
        "13:00 - 13:50": ["Lunch", "L12"],
        "14:00 - 14:50": ["D2", "L37"],
        "15:00 - 15:50": ["TF2","G2", "L38"],
        "16:00 - 16:50": ["E2", "SC1","L39"],
        "17:00 - 17:50": ["B2", "L40"],
        "18:00 - 18:50": ["TCC2", "L41"],
        "19:00 - 19:50": ["L42"]
    },
    "Thursday": {
        "08:00 - 08:50": ["TEE1", "L13"],
        "09:00 - 09:50": ["C1", "L14"],
        "10:00 - 10:50": ["TD1","TG1", "L15"],
        "11:00 - 11:50": ["TAA1", "L16"],
        "12:00 - 12:50": ["TBB1", "L17"],
        "13:00 - 13:50": ["Lunch", "L18"],
        "14:00 - 14:50": ["TE2","SE1", "L43"],
        "15:00 - 15:50": ["C2", "L44"],
        "16:00 - 16:50": ["A2", "L45"],
        "17:00 - 17:50": ["TD2","TG2", "L46"],
        "18:00 - 18:50": ["TGG2", "L47"],
        "19:00 - 19:50": ["L48"]
    },
    "Friday": {
        "08:00 - 08:50": ["TCC1", "L19"],
        "09:00 - 09:50": ["TB1", "L20"],
        "10:00 - 10:50": ["TA1", "G1", "L21"],
        "11:00 - 11:50": ["F1", "L22"],
        "12:00 - 12:50": ["TE1","SD1", "L23"],
        "13:00 - 13:50": ["Lunch", "L24"],
        "14:00 - 14:50": ["C2", "L49"],
        "15:00 - 15:50": ["TB2", "L50"],
        "16:00 - 16:50": ["TA2", "G2", "L51"],
        "17:00 - 17:50": ["F2", "SD1", "L52"],
        "18:00 - 18:50": ["TEE2", "L53"],
        "19:00 - 19:50": ["L54"]
    },
    "Saturday": {
        "08:00 - 08:50": ["TDD1", "L25"],
        "09:00 - 09:50": ["E1","SE2", "L26"],
        "10:00 - 10:50": ["C1", "L27"],
        "11:00 - 11:50": ["TF1", "G1", "L28"],
        "12:00 - 12:50": ["A1", "L29"],
        "13:00 - 13:50": ["Lunch", "L30"],
        "14:00 - 14:50": ["D2", "L55"],
        "15:00 - 15:50": ["E2","SD1", "L56"],
        "16:00 - 16:50": ["TAA2", "L57"],
        "17:00 - 17:50": ["TBB2", "L58"],
        "18:00 - 18:50": ["TFF2", "L59"],
        "19:00 - 19:50": ["L60"]
    }
};

function generateLabPairs() {
    const customLabPairs = [
        "L2+L3", "L4+L5", "L8+L9", "L10+L11", "L14+L15", "L16+L17",
        "L20+L21", "L22+L23", "L26+L27", "L28+L29"
    ];
    const alternativeLabPairs = [];
    for (let i = 31; i <= 59; i += 2) {
        alternativeLabPairs.push(`L${i}+L${i+1}`);
    }
    return [...customLabPairs, ...alternativeLabPairs];
}

function loadTimetableData() {
    const savedTimetableData = localStorage.getItem('timetableData');
    if (savedTimetableData) {
        try {
            timetableData = JSON.parse(savedTimetableData);
            console.log("Successfully loaded timetable data from localStorage");
        } catch (e) {
            console.error("Error parsing saved timetable data", e);
        }
    } else {
        console.log("No saved timetable data found in localStorage, using default data");
    }
}

function saveTimetableData() {
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
    alert('Timetable data saved successfully!');
}

function resetTimetableData() {
    if (confirm('Are you sure you want to reset the timetable to default values?')) {
        localStorage.removeItem('timetableData');
        location.reload();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Load timetable data at the beginning
    loadTimetableData();
    
    const outputContainer = document.getElementById("output-container");
    if (outputContainer) {
        const selectedCourses = JSON.parse(sessionStorage.getItem('SelectedSlots')) || [];
        if (selectedCourses.length === 0) {
            outputContainer.innerHTML = "<p>No course data found. Please go back and select courses.</p>";
            return;
        }
        renderTimetableTable();
        return;
    }
    
    const daySelect = document.getElementById('day-select');
    const timeSelect = document.getElementById('time-select');
    if (daySelect && timeSelect) {
        setupTimetableEditor();
    }
    
    const coursesContainer = document.getElementById('courses-container');
    if (coursesContainer) {
        setupCourseSelections();
    }
    
    // Add edit timetable functionality
    setupEditTimetable();
    
    // Set up clear storage button
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', function() {
            localStorage.removeItem('timetableData');
            alert('Storage cleared. Page will reload.');
            location.reload();
        });
    }
});

function setupTimetableEditor() {
    let selectedDay = 'Tuesday';
    let selectedTimeSlot = timeSlots[0];
    
    const timeSelect = document.getElementById('time-select');
    timeSelect.innerHTML = '';
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
    });
    
    document.getElementById('day-select').addEventListener('change', (e) => {
        selectedDay = e.target.value;
        updateCurrentSlotDisplay(selectedDay, selectedTimeSlot);
    });
    
    document.getElementById('time-select').addEventListener('change', (e) => {
        selectedTimeSlot = e.target.value;
        updateCurrentSlotDisplay(selectedDay, selectedTimeSlot);
    });
    
    document.getElementById('update-slot-btn').addEventListener('click', () => {
        const slotInput = document.getElementById('slot-input').value;
        updateSlot(selectedDay, selectedTimeSlot, slotInput);
    });
    
    document.getElementById('save-timetable-btn').addEventListener('click', saveTimetableData);
    
    document.getElementById('reset-timetable-btn').addEventListener('click', resetTimetableData);
    
    updateCurrentSlotDisplay(selectedDay, selectedTimeSlot);
}

function updateCurrentSlotDisplay(day, timeSlot) {
    const slotInfo = document.getElementById('selected-slot-info');
    const slotList = document.getElementById('current-slot-list');
    const slotInput = document.getElementById('slot-input');
    
    if (!slotInfo || !slotList || !slotInput) return;
    
    slotInfo.textContent = `${day}, ${timeSlot}`;
    
    // Ensure the day exists in the timetable
    if (!timetableData[day]) {
        timetableData[day] = {};
    }
    
    const currentSlots = timetableData[day][timeSlot] || [];
    
    if (currentSlots.length > 0) {
        slotList.innerHTML = `<p>Current slots: ${currentSlots.join(', ')}</p>`;
    } else {
        slotList.innerHTML = '<p>No slots assigned</p>';
    }
    
    slotInput.value = currentSlots.join(', ');
}

function updateSlot(day, timeSlot, slotInput) {
    if (!timetableData[day]) {
        timetableData[day] = {};
    }
    
    const slots = slotInput.split(',')
        .map(slot => slot.trim())
        .filter(slot => slot !== ''); 
    
    timetableData[day][timeSlot] = slots;
    
    // Save immediately to localStorage
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
    console.log(`Updated timetable data for ${day} at ${timeSlot} with slots:`, slots);
    
    updateCurrentSlotDisplay(day, timeSlot);
    
    // Update the timetable view if it exists
    const timetableElement = document.getElementById('timetable');
    if (timetableElement) {
        renderTimetable('all', []);
    }
    
    alert(`Updated ${day} at ${timeSlot} with slots: ${slots.join(', ')}`);
}

function setupCourseSelections() {
    const storedData = sessionStorage.getItem('CourseData');
    let courses = [];
    
    if (storedData) {
        courses = JSON.parse(storedData);
        courses.forEach(course => {
            course.selectedTheorySlot = course.selectedTheorySlot || '';
            course.selectedLabSlot = course.selectedLabSlot || '';
        });
    }
    
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateTimetable(courses);
        });
    }
    
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    const backBtn = document.getElementById('back-to-selection-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const timetableSection = document.getElementById('timetable-section');
            const errorContainer = document.getElementById('error-container');
            
            if (timetableSection) timetableSection.classList.add('hidden');
            if (errorContainer) errorContainer.classList.add('hidden');
        });
    }
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentView = button.dataset.day;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderTimetable(currentView, courses);
            });
        });
    }
    
    renderCourseSelections(courses);
}

function renderCourseSelections(courses) {
    const coursesContainer = document.getElementById('courses-container');
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = '';
    
    if (courses.length === 0) {
        coursesContainer.innerHTML = "<p>No course data found. Please ensure you've added courses from the previous page.</p>";
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) generateBtn.disabled = true;
        return;
    }
    
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) generateBtn.disabled = false;
    
    courses.forEach((course, index) => {
        const allPossibleLabPairs = generateLabPairs();
        
        let hasLabComponent = course.hasLab;
        
        if (!hasLabComponent && course.credits) {
            const parts = course.credits.split(' ')[0].split(' ');
            if (parts.length === 3) {
                const practicalCredits = parseInt(parts[1], 10);
                const labCredits = parseInt(parts[2], 10);
                
                if (labCredits > 0) {
                    hasLabComponent = true;
                }
            }
        }
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <span class="course-credits">Credits: ${course.credits}</span>
            </div>
            <div class="course-slots">
                ${course.theorySlots && course.theorySlots.length > 0 ? `
                    <div class="slot-selection">
                        <label class="slot-label" for="theory-${index}">Theory Slot</label>
                        <select id="theory-${index}" class="theory-select">
                            <option value="">-- Select Theory Slot --</option>
                            ${course.theorySlots.map(slot => `
                                <option value="${slot}" ${course.selectedTheorySlot === slot ? 'selected' : ''}>${slot}</option>
                            `).join('')}
                        </select>
                    </div>
                ` : `
                    <div class="slot-selection">
                        <label class="slot-label">Theory Slot</label>
                        <select disabled>
                            <option>No Theory Slots Available</option>
                        </select>
                    </div>
                `}
                ${hasLabComponent ? `
                    <div class="slot-selection">
                        <label class="slot-label" for="lab-${index}">Lab Slot</label>
                        <select id="lab-${index}" class="lab-select">
                            <option value="">-- Select Lab Slot --</option>
                            ${allPossibleLabPairs.map(slot => `
                                <option value="${slot}" ${course.selectedLabSlot === slot ? 'selected' : ''}>${slot}</option>
                            `).join('')}
                        </select>
                    </div>
                ` : `
                    <div class="slot-selection">
                        <label class="slot-label">Lab Slot</label>
                        <select disabled>
                            <option>No Lab Component</option>
                        </select>
                    </div>
                `}
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
        
        const theorySelect = courseCard.querySelector('.theory-select');
        if (theorySelect) {
            theorySelect.addEventListener('change', (e) => {
                courses[index].selectedTheorySlot = e.target.value;
                saveCoursesToSession(courses);
            });
        }
        
        const labSelect = courseCard.querySelector('.lab-select');
        if (labSelect) {
            labSelect.addEventListener('change', (e) => {
                courses[index].selectedLabSlot = e.target.value;
                saveCoursesToSession(courses);
            });
        }
    });
}

function saveCoursesToSession(courses) {
    sessionStorage.setItem('CourseData', JSON.stringify(courses));
}

function generateTimetable(courses) {
    // Make sure we have the latest timetable data
    loadTimetableData();
    
    const selectedCoursesCount = courses.filter(course =>
        course.selectedTheorySlot !== '' || course.selectedLabSlot !== ''
    ).length;
    
    if (selectedCoursesCount === 0) {
        showError("Please select at least one theory or lab slot for your courses before generating the timetable.");
        return;
    }
    
    const conflicts = checkForConflicts(courses);
    
    if (conflicts.length > 0) {
        let errorMessage = "Timetable conflicts detected:<br><br>";
        conflicts.sort((a, b) => {
            if (a.day !== b.day) return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
            return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
        });
        
        conflicts.forEach((conflict, index) => {
            errorMessage += `${index + 1}. <b>${conflict.clashingSlot}</b> clashes on <b>${conflict.day}</b> at <b>${conflict.time}</b>:<br>`;
            errorMessage += `&nbsp;&nbsp;&nbsp;&nbsp;- Course: ${conflict.course1} (Selected Slot: ${conflict.slot1})<br>`;
            errorMessage += `&nbsp;&nbsp;&nbsp;&nbsp;- Course: ${conflict.course2} (Selected Slot: ${conflict.slot2})<br><br>`;
        });
        showError(errorMessage);
        return;
    }
    
    const errorContainer = document.getElementById('error-container');
    const timetableSection = document.getElementById('timetable-section');
    
    if (errorContainer) errorContainer.classList.add('hidden');
    if (timetableSection) timetableSection.classList.remove('hidden');
    
    const currentView = 'all';
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        const fullWeekTab = document.querySelector('[data-day="all"]');
        if (fullWeekTab) fullWeekTab.classList.add('active');
    }
    
    renderTimetable(currentView, courses);
    
    if (timetableSection) timetableSection.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) return;
    
    errorContainer.innerHTML = message;
    errorContainer.classList.remove('hidden');
    errorContainer.scrollIntoView({ behavior: 'smooth' });
}

function checkForConflicts(courses) {
    const conflicts = [];
    const occupiedSlots = {};
    
    courses.forEach(course => {
        if (!course.selectedTheorySlot && !course.selectedLabSlot) return;
        
        const processSlots = (selectedSlot, isLab) => {
            if (!selectedSlot) return;
            
            const individualSlots = selectedSlot.split('+');
            
            individualSlots.forEach(slot => {
                daysOfWeek.forEach(day => {
                    Object.entries(timetableData[day]).forEach(([time, availableSlotsInTimeSlot]) => {
                        if (availableSlotsInTimeSlot.includes(slot)) {
                            const key = `${day}-${time}`;
                            
                            if (occupiedSlots[key]) {
                                conflicts.push({
                                    course1: course.code,
                                    course2: occupiedSlots[key].courseCode,
                                    slot1: selectedSlot,
                                    slot2: occupiedSlots[key].selectedOriginalSlot,
                                    clashingSlot: slot,
                                    day,
                                    time
                                });
                            } else {
                                occupiedSlots[key] = {
                                    courseCode: course.code,
                                    slotCode: slot,
                                    selectedOriginalSlot: selectedSlot,
                                    isLab: isLab
                                };
                            }
                        }
                    });
                });
            });
        };
        
        processSlots(course.selectedTheorySlot, false);
        processSlots(course.selectedLabSlot, true);
    });
    
    return conflicts;
}

function renderTimetable(currentView = 'all', courses = []) {
    const timetableElement = document.getElementById('timetable');
    if (!timetableElement) return;
    
    timetableElement.innerHTML = '';
    
    const daysToShow = currentView === 'all' ? daysOfWeek : [currentView];
    
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time';
    headerRow.appendChild(timeHeader);
    
    daysToShow.forEach(day => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    
    timetableElement.appendChild(headerRow);
    
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        if (timeSlot === "13:00 - 13:50") {
            row.classList.add('lunch-row');
        }
        
        const timeCell = document.createElement('td');
        timeCell.textContent = timeSlot;
        timeCell.classList.add('time-column');
        row.appendChild(timeCell);
        
        daysToShow.forEach(day => {
            const cell = document.createElement('td');
            
            if (timeSlot === "13:00 - 13:50") {
                const lunchBadge = document.createElement('span');
                lunchBadge.classList.add('course-badge', 'lunch-badge');
                lunchBadge.textContent = 'Lunch Break';
                cell.appendChild(lunchBadge);
            } else {
                const scheduledCourses = getCoursesForSlot(day, timeSlot, courses);
                
                if (scheduledCourses.length > 0) {
                    scheduledCourses.forEach(item => {
                        const badge = document.createElement('span');
                        badge.classList.add('course-badge', item.isLab ? 'lab-badge' : 'theory-badge');
                        badge.textContent = `${item.course.code} (${item.slot})`;
                        cell.appendChild(badge);
                        cell.appendChild(document.createElement('br'));
                    });
                } else {
                    // Make sure the day and timeslot exist in timetableData
                    if (!timetableData[day]) {
                        timetableData[day] = {};
                    }
                    
                    const availableSlots = timetableData[day][timeSlot] || [];
                    if (availableSlots.length > 0) {
                        cell.innerHTML = `<span class="empty-slot">${availableSlots.join(', ')}</span>`;
                    }
                }
            }
            
            row.appendChild(cell);
        });
        
        timetableElement.appendChild(row);
    });
}

function getCoursesForSlot(day, timeSlot, courses) {
    const result = [];
    
    // Make sure the day exists in timetableData
    if (!timetableData[day]) {
        timetableData[day] = {};
    }
    
    const availableSlots = timetableData[day][timeSlot] || [];
    
    if (availableSlots.length === 0) return result;
    
    courses.forEach(course => {
        if (course.selectedTheorySlot) {
            const theorySlots = course.selectedTheorySlot.split('+');
            
            theorySlots.forEach(slot => {
                if (availableSlots.includes(slot)) {
                    result.push({
                        course,
                        slot,
                        isLab: false
                    });
                }
            });
        }
        
        if (course.selectedLabSlot) {
            const labSlots = course.selectedLabSlot.split('+');
            
            labSlots.forEach(slot => {
                if (availableSlots.includes(slot)) {
                    result.push({
                        course,
                        slot,
                        isLab: true
                    });
                }
            });
        }
    });
    
    return result;
}

function isLabSlot(slot) {
    return slot.toString().startsWith('L');
}

function renderTimetableTable() {
    renderTimetable('all', []);
}

// Functions for edit timetable functionality
function setupEditTimetable() {
    const editBtn = document.getElementById('edit-timetable-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const timetableSection = document.getElementById('timetable-section');
            const editSection = document.getElementById('edit-timetable-section');
            
            if (timetableSection) timetableSection.classList.add('hidden');
            if (editSection) editSection.classList.remove('hidden');
            
            renderEditTimetableTable();
        });
    }
    
    const saveEditBtn = document.getElementById('save-edit-btn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEditTimetable);
    }
    
    const resetEditBtn = document.getElementById('reset-edit-btn');
    if (resetEditBtn) {
        resetEditBtn.addEventListener('click', resetTimetableData);
    }
    
    const backToTimetableBtn = document.getElementById('back-to-timetable-btn');
    if (backToTimetableBtn) {
        backToTimetableBtn.addEventListener('click', () => {
            const timetableSection = document.getElementById('timetable-section');
            const editSection = document.getElementById('edit-timetable-section');
            
            if (editSection) editSection.classList.add('hidden');
            if (timetableSection) timetableSection.classList.remove('hidden');
            
            // Refresh the timetable display when going back
            renderTimetable('all', []);
        });
    }
}

function renderEditTimetableTable() {
    const tableBody = document.querySelector('#edit-timetable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
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
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'slot-input';
                input.placeholder = 'Enter comma-separated slots';
                input.dataset.day = day;
                input.dataset.timeSlot = timeSlot;
                
                // Make sure the day exists in timetableData
                if (!timetableData[day]) {
                    timetableData[day] = {};
                }
                
                const currentSlots = timetableData[day][timeSlot] || [];
                input.value = currentSlots.join(', ');
                
                cell.appendChild(input);
            }
            
            row.appendChild(cell);
        });
        
        tableBody.appendChild(row);
    });
}

function saveEditTimetable() {
    const inputs = document.querySelectorAll('#edit-timetable input.slot-input');
    
    // Create a new object for our updated timetable data
    let newTimetableData = {};
    
    // Initialize all days
    daysOfWeek.forEach(day => {
        newTimetableData[day] = {};
        
        // Copy lunch slots
        newTimetableData[day]["13:00 - 13:50"] = timetableData[day]["13:00 - 13:50"] || ["Lunch"];
    });
    
    // Process all inputs and update the new timetable data
    inputs.forEach(input => {
        const day = input.dataset.day;
        const timeSlot = input.dataset.timeSlot;
        
        if (!day || !timeSlot || timeSlot === "13:00 - 13:50") return;
        
        const slots = input.value.split(',')
            .map(slot => slot.trim())
            .filter(slot => slot !== '');
        
        newTimetableData[day][timeSlot] = slots;
    });
    
    // Replace the global timetable data
    timetableData = newTimetableData;
    
    // Save to localStorage
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
    
    // Notify user
    alert('Timetable updated successfully!');
    
    // Return to timetable view
    const timetableSection = document.getElementById('timetable-section');
    const editSection = document.getElementById('edit-timetable-section');
    
    if (editSection) editSection.classList.add('hidden');
    if (timetableSection) timetableSection.classList.remove('hidden');
    
    // Refresh the timetable display
    renderTimetable('all', []);
}