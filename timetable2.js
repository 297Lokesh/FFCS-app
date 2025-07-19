// Continuation of timetable1.js

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
                    // Make sure we have up-to-date data
                    if (timetableData[day] && timetableData[day][timeSlot]) {
                        const availableSlots = timetableData[day][timeSlot];
                        if (availableSlots && availableSlots.length > 0) {
                            cell.innerHTML = `<span class="empty-slot">${availableSlots.join(', ')}</span>`;
                        }
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
    // Make sure day and timeSlot exist in timetableData
    if (!timetableData[day] || !timetableData[day][timeSlot]) return result;
    
    const availableSlotsInTimeBlock = timetableData[day][timeSlot];
    
    if (!availableSlotsInTimeBlock || availableSlotsInTimeBlock.length === 0) return result;
    
    courses.forEach(course => {
        if (course.selectedTheorySlot) {
            const theorySlots = course.selectedTheorySlot.split('+');
            
            theorySlots.forEach(slot => {
                if (availableSlotsInTimeBlock.includes(slot)) {
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
                if (availableSlotsInTimeBlock.includes(slot)) {
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

function renderTimetableTable() {
    const storedData = sessionStorage.getItem('CourseData');
    const courses = storedData ? JSON.parse(storedData) : [];
    renderTimetable('all', courses);
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
        });
    }
}

function renderEditTimetableTable() {
    const tableBody = document.querySelector('#edit-timetable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Add rows for each time slot
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
                input.dataset.day = day;
                input.dataset.timeSlot = timeSlot;
                input.placeholder = 'Enter comma-separated slots';
                
                // Make sure the key exists before accessing
                if (timetableData[day] && timetableData[day][timeSlot]) {
                    const currentSlots = timetableData[day][timeSlot];
                    input.value = currentSlots.join(', ');
                } else {
                    input.value = '';
                }
                
                cell.appendChild(input);
            }
            
            row.appendChild(cell);
        });
        
        tableBody.appendChild(row);
    });
}

function saveEditTimetable() {
    const inputs = document.querySelectorAll('#edit-timetable tbody input.slot-input');
    if (!inputs.length) return;
    
    // Create a copy of the timetable data to modify
    let hasChanges = false;
    
    // Process each input field
    inputs.forEach(input => {
        const day = input.dataset.day;
        const timeSlot = input.dataset.timeSlot;
        
        if (!day || !timeSlot) return;
        
        // Parse the input value into array of slots
        const slots = input.value.split(',')
            .map(slot => slot.trim())
            .filter(slot => slot !== '');
        
        // Ensure the day exists in timetableData
        if (!timetableData[day]) {
            timetableData[day] = {};
        }
        
        // Check if the value has changed
        const currentSlots = (timetableData[day][timeSlot] || []).join(',');
        const newSlots = slots.join(',');
        
        if (currentSlots !== newSlots) {
            timetableData[day][timeSlot] = slots;
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        // Show success message
        alert('Timetable changes saved successfully!');
        
        // Switch back to timetable view
        const timetableSection = document.getElementById('timetable-section');
        const editSection = document.getElementById('edit-timetable-section');
        
        if (editSection) editSection.classList.add('hidden');
        if (timetableSection) timetableSection.classList.remove('hidden');
        
        // Refresh the timetable display with latest data
        const storedData = sessionStorage.getItem('CourseData');
        const courses = storedData ? JSON.parse(storedData) : [];
        renderTimetable('all', courses);
    } else {
        alert('No changes were made to the timetable.');
    }
}