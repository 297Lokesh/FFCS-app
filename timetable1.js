// Continuation of timetable.js

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
                    if (!timetableData[day]) return;
                    
                    Object.entries(timetableData[day]).forEach(([time, availableSlotsInTimeSlot]) => {
                        if (availableSlotsInTimeSlot && availableSlotsInTimeSlot.includes(slot)) {
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