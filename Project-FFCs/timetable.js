document.addEventListener("DOMContentLoaded", () => {
    const outputContainer = document.getElementById("output-container");

    const selectedCourses = JSON.parse(sessionStorage.getItem('SelectedSlots')) || [];

    if (selectedCourses.length === 0) {
        outputContainer.innerHTML = "<p>No course data found. Please go back and select courses.</p>";
        return;
    }

    const timetable = buildTimetable(selectedCourses);
    renderTimetableTable(timetable);
});
const timeSlots = [
    "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50",
    "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50",
    "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
];
const daysOfWeek = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timetableData = {
    "Tuesday": {
        "08:00 - 08:50": ["TEE1", "L1"],
        "09:00 - 09:50": ["A1", "L2"],
        "10:00 - 10:50": ["B1", "L3"],
        "11:00 - 11:50": ["C1", "L4"],
        "12:00 - 12:50": ["D1", "L5"],
        "13:00 - 13:50": ["Lunch", "L6"],
        "14:00 - 14:50": ["SE1", "E2", "L31"],
        "15:00 - 15:50": ["A2", "L32"],
        "16:00 - 16:50": ["C2", "L33"],
        "17:00 - 17:50": ["TBB2", "L34", "C2"],
        "18:00 - 18:50": ["L35", "TDD2"],
        "19:00 - 19:50": ["L36"]
    },
    "Wednesday": {
        "08:00 - 08:50": ["TG1", "L7"],
        "09:00 - 09:50": ["D1", "L8"],
        "10:00 - 10:50": ["F1", "L9"],
        "11:00 - 11:50": ["E1", "L10"],
        "12:00 - 12:50": ["B1", "L11"],
        "13:00 - 13:50": ["Lunch", "L12"],
        "14:00 - 14:50": ["E2", "L37", "SC1"],
        "15:00 - 15:50": ["D2", "L38"],
        "16:00 - 16:50": ["F2", "L39"],
        "17:00 - 17:50": ["B2", "L40"],
        "18:00 - 18:50": ["TCC2", "L41"],
        "19:00 - 19:50": ["L42"]
    },
    "Thursday": {
        "08:00 - 08:50": ["TF1", "L13"],
        "09:00 - 09:50": ["TC1", "L14"],
        "10:00 - 10:50": ["TD1", "L15"],
        "11:00 - 11:50": ["TA1", "L16"],
        "12:00 - 12:50": ["TFF1", "L17"],
        "13:00 - 13:50": ["Lunch", "L18"],
        "14:00 - 14:50": ["B2", "L43"],
        "15:00 - 15:50": ["F2", "L44"],
        "16:00 - 16:50": ["TD2", "L45"],
        "17:00 - 17:50": ["TA2", "L46"],
        "18:00 - 18:50": ["TG2", "L47"],
        "19:00 - 19:50": ["L48"]
    },
    "Friday": {
        "08:00 - 08:50": ["TCC1", "L19"],
        "09:00 - 09:50": ["TB1", "L20"],
        "10:00 - 10:50": ["TAA1", "G1", "L21"],
        "11:00 - 11:50": ["TE1", "L22"],
        "12:00 - 12:50": ["F1", "L23"],
        "13:00 - 13:50": ["Lunch", "L24"],
        "14:00 - 14:50": ["C2", "L49"],
        "15:00 - 15:50": ["TB2", "L50"],
        "16:00 - 16:50": ["TAA2", "G2", "L51"],
        "17:00 - 17:50": ["TE2", "SD1", "L52"],
        "18:00 - 18:50": ["TF2", "L53"],
        "19:00 - 19:50": ["L54"]
    },
    "Saturday": {
        "08:00 - 08:50": ["TDD1", "L25"],
        "09:00 - 09:50": ["C1", "L26"],
        "10:00 - 10:50": ["A1", "L27"],
        "11:00 - 11:50": ["TBB1", "G1", "L28"],
        "12:00 - 12:50": ["E1", "L29"],
        "13:00 - 13:50": ["Lunch", "L30"],
        "14:00 - 14:50": ["D2", "L55"],
        "15:00 - 15:50": ["TC2", "L56"],
        "16:00 - 16:50": ["A2", "G2", "L57"],
        "17:00 - 17:50": ["SF1", "L58"],
        "18:00 - 18:50": ["TEE2", "L59"],
        "19:00 - 19:50": ["L60"]
    }
};

// Generate all possible lab pairs
function generateLabPairs() {
    const customLabPairs = [
        "L2+L3", "L4+L5", "L8+L9", "L10+L11", "L14+L15", "L16+L17",
        "L20+L21", "L22+L23", "L26+L27", "L28+L29"
    ];

    const alternativeLabPairs = [];
    for (let i = 31; i <= 59; i += 2) { // Changed loop to go up to 59 to ensure L60 is covered if last pair is L59+L60
        alternativeLabPairs.push(`L${i}+L${i + 1}`);
    }
    return [...customLabPairs, ...alternativeLabPairs];
}

// DOM Elements
const coursesContainer = document.getElementById('courses-container');
const generateBtn = document.getElementById('generate-btn');
const printBtn = document.getElementById('print-btn');
const backToSelectionBtn = document.getElementById('back-to-selection-btn'); // New ID for back button
const timetableSection = document.getElementById('timetable-section');
const timetableElement = document.getElementById('timetable'); // Target the <table>
const errorContainer = document.getElementById('error-container');
const tabButtons = document.querySelectorAll('.tab-btn');

// Global variables
let courses = []; // This will hold the parsed data from sessionStorage and user selections
let currentView = 'all';

// Initialize the app
function init() {
    const storedData = sessionStorage.getItem('CourseData');

    // If data exists, parse it. Otherwise, use sampleCourses as a fallback
    if (storedData) {
        courses = JSON.parse(storedData);
        // Ensure selectedTheorySlot and selectedLabSlot exist for loaded courses
        courses.forEach(course => {
            course.selectedTheorySlot = course.selectedTheorySlot || '';
            course.selectedLabSlot = course.selectedLabSlot || '';
        });
    } else {
        courses = [...sampleCourses]; // Use sample data if nothing is stored
    }
    
    // Render course selection cards with pre-selected values if they exist
    renderCourseSelections();
    
    // Set up event listeners for all interactive elements
    setupEventListeners();
}

// Render course selection cards
// Render course selection cards
function renderCourseSelections() {
    coursesContainer.innerHTML = ''; // Clear existing content

    if (courses.length === 0) {
        coursesContainer.innerHTML = "<p>No course data found. Please ensure you've added courses from the previous page.</p>";
        generateBtn.disabled = true; // Disable generate if no courses
        return;
    }
    generateBtn.disabled = false; // Enable if courses are present

    courses.forEach((course, index) => {
        // Use the comprehensive lab pair list for dropdown
        const allPossibleLabPairs = generateLabPairs();

        // Determine if a lab slot should be enabled
        let hasLabComponent = course.hasLab; // Start with the explicit hasLab property

        // If hasLab is not true, check the credits string
        if (!hasLabComponent && course.credits) {
            const parts = course.credits.split(' ')[0].split(' '); // Get "T-P-C" part, e.g., ["3", "0", "1"]
            if (parts.length === 3) {
                const practicalCredits = parseInt(parts[1], 10); // P (Practical/Tutorial)
                const labCredits = parseInt(parts[2], 10);     // C (Contact/Lab)

                if (labCredits > 0) {
                    hasLabComponent = true;
                }
            }
        }

        const courseCard = document.createElement('div');
        courseCard.className = 'course-card'; // Reusing existing CSS class name for consistency
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

        // Add event listeners for the select elements
        const theorySelect = courseCard.querySelector(`.theory-select`);
        if (theorySelect) {
            theorySelect.addEventListener('change', (e) => {
                courses[index].selectedTheorySlot = e.target.value;
                saveCoursesToSession();
            });
        }

        const labSelect = courseCard.querySelector(`.lab-select`);
        if (labSelect) {
            labSelect.addEventListener('change', (e) => {
                courses[index].selectedLabSlot = e.target.value;
                saveCoursesToSession();
            });
        }
    });
}

// Save current course selections (including chosen slots) to sessionStorage
function saveCoursesToSession() {
    sessionStorage.setItem('CourseData', JSON.stringify(courses));
}

// Setup all event listeners
function setupEventListeners() {
    generateBtn.addEventListener("click", generateTimetable);

    // generateBtn.addEventListener("click", () => {
    //     const courseData = JSON.parse(sessionStorage.getItem("CourseData"));
    //     document.getElementById("timetable-section").classList.remove("hidden");
    //     generateFinalTimetable(courseData, timetableData);
    // });

    printBtn.addEventListener('click', () => {
        window.print();
    });
    
   
    backToSelectionBtn.addEventListener('click', () => {
        // If this page is standalone, just hide timetable and show selection
        timetableSection.classList.add('hidden');
        errorContainer.classList.add('hidden');
        // If there's an actual 'multi-option.html', uncomment this:
        // window.location.href = "multi-option.html"; 
    });
    
    // Tab buttons for timetable view
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentView = button.dataset.day;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTimetable(); // Re-render timetable based on new view
        });
    });
}

// Check for timetable conflicts
function checkForConflicts() {
    const conflicts = [];
    // A map to store which slot is occupied by which course at a specific day and time
    // Key: "Day-TimeSlot", Value: { courseCode: "CODE", slotCode: "SLOT" }
    const occupiedSlots = {};
    
    // Process each selected course
    courses.forEach(course => {
        // Only consider courses that have at least one slot selected
        if (!course.selectedTheorySlot && !course.selectedLabSlot) return;
        
        // Helper function to process slots (theory or lab)
        const processSlots = (selectedSlot, isLab) => {
            if (!selectedSlot) return;

            // Split combined slots like "A1+TA1" into individual components
            const individualSlots = selectedSlot.split('+');
            
            individualSlots.forEach(slot => {
                // Find all occurrences of this individual slot in the entire timetableData
                daysOfWeek.forEach(day => {
                    Object.entries(timetableData[day]).forEach(([time, availableSlotsInTimeSlot]) => {
                        if (availableSlotsInTimeSlot.includes(slot)) {
                            const key = `${day}-${time}`; // Unique identifier for a time block

                            if (occupiedSlots[key]) {
                                // Conflict detected!
                                conflicts.push({
                                    course1: course.code,
                                    course2: occupiedSlots[key].courseCode,
                                    slot1: selectedSlot, // Original selected slot (e.g., "A1+TA1")
                                    slot2: occupiedSlots[key].selectedOriginalSlot, // Original selected slot of the conflicting course
                                    clashingSlot: slot, // The specific slot (e.g., "A1") causing the clash
                                    day,
                                    time
                                });
                            } else {
                                // Mark this slot as occupied
                                occupiedSlots[key] = {
                                    courseCode: course.code,
                                    slotCode: slot, // The individual slot that occupies this block
                                    selectedOriginalSlot: selectedSlot, // Store the full selected slot for better conflict reporting
                                    isLab: isLab
                                };
                            }
                        }
                    });
                });
            });
        };

        processSlots(course.selectedTheorySlot, false); // Process theory slots
        processSlots(course.selectedLabSlot, true);    // Process lab slots
    });
    
    return conflicts;
}

// Generate timetable (main function triggered by button click)
function generateTimetable() {
    // Filter to get only courses for which a slot has been explicitly chosen
    const selectedCoursesCount = courses.filter(course =>
        course.selectedTheorySlot !== '' || course.selectedLabSlot !== ''
    ).length;

    if (selectedCoursesCount === 0) {
        showError("Please select at least one theory or lab slot for your courses before generating the timetable.");
        return;
    }
    
    // Check for conflicts
    const conflicts = checkForConflicts();
    
    if (conflicts.length > 0) {
        let errorMessage = "Timetable conflicts detected:<br><br>";
        // Sort conflicts to make the error message more readable
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
    
    // No conflicts, show timetable
    errorContainer.classList.add('hidden'); // Hide any previous error messages
    timetableSection.classList.remove('hidden'); // Make the timetable section visible
    
    // Render timetable with default view (Full Week)
    currentView = 'all';
    // Ensure the "Full Week" tab is active visually
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-day="all"]').classList.add('active');
    
    renderTimetable(); // Draw the timetable table
    
    // Scroll to timetable section for better UX
    timetableSection.scrollIntoView({ behavior: 'smooth' });
}

// Show error message in the dedicated container
function showError(message) {
    errorContainer.innerHTML = message;
    errorContainer.classList.remove('hidden'); // Make error container visible
    errorContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to it
}

// Render timetable table based on currentView (all days or a specific day)
function renderTimetable() {
    timetableElement.innerHTML = ''; // Clear existing table content
    
    // Determine which days to show based on the current view
    const daysToShow = currentView === 'all' ? daysOfWeek : [currentView];
    
    // Create table header row
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time';
    headerRow.appendChild(timeHeader);
    
    daysToShow.forEach(day => {
        const dayHeader = document.createElement('th');
        dayHeader.textContent = day;
        headerRow.appendChild(dayHeader);
    });
    
    timetableElement.appendChild(headerRow); // Add header to the table
    
    // Create table rows for each time slot
    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        if (timeSlot === "13:00 - 13:50") {
            row.classList.add('lunch-row'); // Add specific class for lunch row styling
        }
        
        // Add time column (first cell in each row)
        const timeCell = document.createElement('td');
        timeCell.textContent = timeSlot;
        timeCell.classList.add('time-column');
        row.appendChild(timeCell);
        
        // Add cells for each day to be displayed
        daysToShow.forEach(day => {
            const cell = document.createElement('td');
            
            // Special handling for lunch break
            if (timeSlot === "13:00 - 13:50") {
                const lunchBadge = document.createElement('span');
                lunchBadge.classList.add('course-badge', 'lunch-badge');
                lunchBadge.textContent = 'Lunch Break';
                cell.appendChild(lunchBadge);
            } else {
                // Get courses (if any) scheduled by the user for this specific day and time slot
                const scheduledCourses = getCoursesForSlot(day, timeSlot);
                
                if (scheduledCourses.length > 0) {
                    // Display each scheduled course as a badge
                    scheduledCourses.forEach(item => {
                        const badge = document.createElement('span');
                        badge.classList.add('course-badge', item.isLab ? 'lab-badge' : 'theory-badge');
                        badge.textContent = `${item.course.code} (${item.slot})`; // e.g., CS101 (A1)
                        cell.appendChild(badge);
                        cell.appendChild(document.createElement('br')); // New line for multiple courses in one slot
                    });
                } else {
                    // If no user-selected courses, show the *available* slots from timetableData
                    const availableSlots = timetableData[day][timeSlot] || [];
                    if (availableSlots.length > 0) {
                        cell.innerHTML = `<span class="empty-slot">${availableSlots.join(', ')}</span>`;
                    }
                }
            }
            
            row.appendChild(cell); // Add the cell to the current row
        });
        
        timetableElement.appendChild(row); // Add the row to the table
    });
}

// Get courses (selected by user) that fall into a specific day and time slot
function getCoursesForSlot(day, timeSlot) {
    const result = [];
    // Get all available slots defined in the base timetable for this specific day and time
    const availableSlotsInTimeBlock = timetableData[day][timeSlot] || [];
    
    if (availableSlotsInTimeBlock.length === 0) return result; // No slots defined for this block
    
    courses.forEach(course => {
        // Check if the course has a selected theory slot AND if its individual components clash
        if (course.selectedTheorySlot) {
            const theorySlots = course.selectedTheorySlot.split('+'); // Split "A1+TA1" into ["A1", "TA1"]
            
            theorySlots.forEach(slot => {
                if (availableSlotsInTimeBlock.includes(slot)) {
                    result.push({
                        course,
                        slot, // The individual slot (e.g., "A1") that matches
                        isLab: false
                    });
                }
            });
        }
        
        // Check if the course has a selected lab slot AND if its individual components clash
        if (course.selectedLabSlot) {
            const labSlots = course.selectedLabSlot.split('+'); // Split "L2+L3" into ["L2", "L3"]
            
            labSlots.forEach(slot => {
                if (availableSlotsInTimeBlock.includes(slot)) {
                    result.push({
                        course,
                        slot, // The individual slot (e.g., "L2") that matches
                        isLab: true
                    });
                }
            });
        }
    });
    
    return result; // Returns an array of scheduled course details for this slot
}


function generateFinalTimetable(courseData, slotMapping) {
    const timetable = document.getElementById("timetable");
    timetableSection.classList.remove('hidden');

    timetable.innerHTML = ""; // Clear previous table

    const days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = [
        "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50",
        "11:00 - 11:50", "12:00 - 12:50", "13:00 - 13:50",
        "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:50",
        "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"
    ];

    // Create table header
    const header = document.createElement("tr");
    header.appendChild(document.createElement("th")); // Empty top-left corner
    days.forEach(day => {
        const th = document.createElement("th");
        th.textContent = day;
        header.appendChild(th);
    });
    timetable.appendChild(header);

    // Create table body
    timeSlots.forEach(time => {
        const row = document.createElement("tr");
        const timeCell = document.createElement("td");
        timeCell.textContent = time;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement("td");
            cell.setAttribute("data-day", day);
            cell.setAttribute("data-time", time);
            row.appendChild(cell);
        });

        timetable.appendChild(row);
    });

    // Fill in slots with selected course codes
    courseData.forEach((course, index) => {
        const selectedTheory = document.getElementById(`theorySlot${index + 1}`)?.value;
        const selectedLab = document.getElementById(`labSlot${index + 1}`)?.value;

        [selectedTheory, selectedLab].forEach(slot => {
            if (!slot) return;

            Object.entries(slotMapping).forEach(([day, times]) => {
                Object.entries(times).forEach(([time, slotArray]) => {
                    if (slotArray.includes(slot)) {
                        const cell = document.querySelector(`td[data-day="${day}"][data-time="${time}"]`);
                        if (cell) {
                            const tag = document.createElement("div");
                            tag.className = "course-tag";
                            tag.textContent = course.code + ` (${slot})`;
                            cell.appendChild(tag);
                        }
                    }
                });
            });
        });
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);