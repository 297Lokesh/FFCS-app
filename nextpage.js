let selectedCourses = [];
document.addEventListener('DOMContentLoaded', function() {
    const saveImageBtn = document.getElementById('save-image-btn');
    const captureArea = document.getElementById('capture-area');

    if (saveImageBtn && captureArea) {
        saveImageBtn.addEventListener('click', () => {
            html2canvas(captureArea, {
                scale: 2,
                useCORS: true,
                logging: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'timetable_summary.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error("Error capturing image:", err);
                alert("Failed to save image.");
            });
        });
    } else {
        console.warn("Save Image button or capture area not found!");
    }


  


});
document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("studentName") || "Not Set";
    const regNo = localStorage.getItem("regNo") || "Not Set";
    const branch = localStorage.getItem("branch") || "Not Set";

    document.getElementById("nav-name").textContent = name;
    document.getElementById("nav-reg").textContent = regNo;
    document.getElementById("nav-branch").textContent = branch;
  });
document.addEventListener("DOMContentLoaded", () => {
    const outputContainer = document.getElementById("output-container");
    const storedData = sessionStorage.getItem('CourseData');
    const customLabPairs = ["L2+L3", "L4+L5", "L8+L9", "L10+L11", "L14+L15", "L16+L17", "L20+L21", "L22+L23", "L26+L27", "L28+L29"];
    function generateAlternativeLabPairs(startNum, endNum) {
        const pairs = [];
        for (let i = startNum; i <= endNum - 1; i += 2) {
            pairs.push(`L<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>+</mo><mi>L</mi></mrow><annotation encoding="application/x-tex">{i}+L</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7429em;vertical-align:-0.0833em;"></span><span class="mord"><span class="mord mathnormal">i</span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal">L</span></span></span></span>{i + 1}`);
        }
        return pairs;
    }
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print(); // This is the simplest way to trigger browser print dialog
        });
    }
    const alternativeLabPairs = generateAlternativeLabPairs(31, 60);
    const allLabPairOptions = [...customLabPairs, ...alternativeLabPairs];
    if (storedData) {
        const courseData = JSON.parse(storedData);
        if (courseData.length === 0) {
            outputContainer.textContent = "No course data found. Please go back and add courses.";
            return;
        }
        courseData.forEach((course, index) => {
            const block = document.createElement("div");
            block.className = "course-display-block";
            const container = document.createElement("div");
            container.className = "container";
            const serial = document.createElement("p");
            serial.className = "serial-number";
            serial.textContent = index + 1;
            container.appendChild(serial);
            const container1A = document.createElement("div");
            container1A.className = "container1";
            const codeLabel = document.createElement("label");
            codeLabel.textContent = "Course Code";
            container1A.appendChild(codeLabel);
            const codeP = document.createElement("p");
            codeP.textContent = course.code;
            codeP.style.margin = "5px 0 15px 0";
            container1A.appendChild(codeP);
            container.appendChild(container1A);
            const container1B = document.createElement("div");
            container1B.className = "container1";
            const creditLabel = document.createElement("label");
            creditLabel.textContent = "Course Credits";
            container1B.appendChild(creditLabel);
            const creditP = document.createElement("p");
            creditP.textContent = course.credits;
            creditP.style.margin = "5px 0 15px 0";
            container1B.appendChild(creditP);
            container.appendChild(container1B);
            const container1C = document.createElement("div");
            container1C.className = "container1";
            const theoryLabel = document.createElement("label");
            theoryLabel.textContent = "Choose Theory Slot:";
            theoryLabel.setAttribute("for", `theorySlot${index + 1}`);
            container1C.appendChild(theoryLabel);
            const theorySelect = document.createElement("select");
            theorySelect.id = `theorySlot${index + 1}`;
            container1C.appendChild(theorySelect);
            if (course.theorySlots && course.theorySlots.length > 0) {
                const defaultOption = document.createElement("option");
                defaultOption.textContent = "-- Select Theory Slot --";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                theorySelect.appendChild(defaultOption);
                course.theorySlots.forEach(slot => {
                    const opt = document.createElement("option");
                    opt.value = slot;
                    opt.textContent = slot;
                    theorySelect.appendChild(opt);
                });
            } else {
                const opt = document.createElement("option");
                opt.textContent = "No Theory Slots Selected";
                theorySelect.appendChild(opt);
                theorySelect.disabled = true;
            }
            const container1D = document.createElement("div");
            container1D.className = "container1";
            const labLabel = document.createElement("label");
            labLabel.textContent = "Choose Lab Slot:";
            labLabel.setAttribute("for", `labSlot${index + 1}`);
            container1D.appendChild(labLabel);
            const labSelect = document.createElement("select");
            labSelect.id = `labSlot${index + 1}`;
            labSelect.multiple = false;
            container1D.appendChild(labSelect);
            
            // Determine if course has lab component based on credits
            let hasLabComponent = false;
            if (course.credits) {
                // Split the credits string (format is typically "T P L" like "3.0 0.0 0.0")
                const creditsParts = course.credits.split(" ");
                if (creditsParts.length >= 3) {
                    // Check if L (Lab) credits > 0
                    const labCredits = parseFloat(creditsParts[2]);
                    hasLabComponent = labCredits > 0;
                }
            }
            
            if (hasLabComponent && course.labSlots && course.labSlots.length > 0) {
                const relevantLabPairs = [];
                allLabPairOptions.forEach(pair => {
                    relevantLabPairs.push(pair);
                });
                course.labSlots.forEach(labSlot => {
                    if (labSlot.match(/^L\d+$/) && !relevantLabPairs.includes(labSlot)) {
                        relevantLabPairs.push(labSlot);
                    }
                });
                if (relevantLabPairs.length > 0) {
                    const defaultOption = document.createElement("option");
                    defaultOption.textContent = "-- Select Lab Slot --";
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    labSelect.appendChild(defaultOption);
                    relevantLabPairs.forEach(pair => {
                        const opt = document.createElement("option");
                        opt.value = pair;
                        opt.textContent = pair;
                        labSelect.appendChild(opt);
                    });
                } else {
                    const opt = document.createElement("option");
                    opt.textContent = "No Lab Pairs Available";
                    labSelect.appendChild(opt);
                    labSelect.disabled = true;
                }
            } else {
                const opt = document.createElement("option");
                opt.textContent = hasLabComponent ? "No Lab Slots Available" : "No Lab Component";
                labSelect.appendChild(opt);
                labSelect.disabled = true;
            }
            container.appendChild(container1C);
            container.appendChild(container1D);
            block.appendChild(container);
            outputContainer.appendChild(block);
        });
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";
        const generateBtn = document.createElement("button");
        generateBtn.textContent = "Generate Timetable";
        generateBtn.className = "generate-btn";
        generateBtn.addEventListener("click", () => {
            const selectedCourses = collectSelectedCourses();
            sessionStorage.setItem('SelectedSlots', JSON.stringify(selectedCourses));
            window.location.href = "timetable.html";
        });
        const backBtn = document.createElement("button");
        backBtn.textContent = "Back";
        backBtn.className = "back-btn";
        backBtn.addEventListener("click", () => {
            window.location.href = "multi-option.html";
        });
        buttonsContainer.appendChild(generateBtn);
        buttonsContainer.appendChild(backBtn);
        outputContainer.appendChild(buttonsContainer);
    } else {
        outputContainer.textContent = "No course data found. Please go back and add courses.";
    }
});
// script.js
// ... (your selectedCourses array declaration) ...

// Add these three functions:
function addOrUpdateSelectedCourse(courseCode, lectureSlot, labSlot = 'No Lab Slot') {
    const existingIndex = selectedCourses.findIndex(course => course.courseCode === courseCode);

    if (existingIndex > -1) {
        selectedCourses[existingIndex].lectureSlot = lectureSlot;
        selectedCourses[existingIndex].labSlot = labSlot;
    } else {
        selectedCourses.push({
            sno: selectedCourses.length + 1,
            courseCode: courseCode,
            lectureSlot: lectureSlot,
            labSlot: labSlot
        });
    }
    renderSelectedCoursesSummary();
}

function removeSelectedCourse(courseCode) {
    selectedCourses = selectedCourses.filter(course => course.courseCode !== courseCode);

    selectedCourses.forEach((course, index) => {
        course.sno = index + 1;
    });
    renderSelectedCoursesSummary();
}

function renderSelectedCoursesSummary() {
    const tableBody = document.querySelector('#selected-courses-table tbody');
    if (!tableBody) {
        console.warn("Summary table not found!");
        return;
    }

    tableBody.innerHTML = '';

    if (selectedCourses.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `<td colspan="4" style="text-align: center; color: #888; padding: 15px;">No courses selected yet.</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    selectedCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.sno}</td>
            <td>${course.courseCode}</td>
            <td>${course.lectureSlot}</td>
            <td>${course.labSlot}</td>
        `;
        tableBody.appendChild(row);
    });
}


// ... (rest of your script.js content) ...
function collectSelectedCourses() {
    const selectedCourses = [];
    const storedData = JSON.parse(sessionStorage.getItem('CourseData')) || [];
    storedData.forEach((course, index) => {
        const theorySlot = document.getElementById(`theorySlot${index + 1}`)?.value;
        const labSlot = document.getElementById(`labSlot${index + 1}`)?.value;
        if (theorySlot || labSlot) {
            selectedCourses.push({
                code: course.code,
                theorySlots: theorySlot ? theorySlot.split('+') : [],
                labSlots: labSlot ? labSlot.split('+') : []
            });
        }
    });
    return selectedCourses;
}
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
const timeSlots = ["08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50", "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"];
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
function generateLabPairs() {
    const customLabPairs = ["L2+L3", "L4+L5", "L8+L9", "L10+L11", "L14+L15", "L16+L17", "L20+L21", "L22+L23", "L26+L27", "L28+L29"];
    const alternativeLabPairs = [];
    for (let i = 31; i <= 59; i += 2) {
        alternativeLabPairs.push(`L${i}+L${i + 1}`);
    }
    return [...customLabPairs, ...alternativeLabPairs];
}
const coursesContainer = document.getElementById('courses-container');
const generateBtn = document.getElementById('generate-btn');
const printBtn = document.getElementById('print-btn');
const backToSelectionBtn = document.getElementById('back-to-selection-btn');
const timetableSection = document.getElementById('timetable-section');
const timetableElement = document.getElementById('timetable');
const errorContainer = document.getElementById('error-container');
const tabButtons = document.querySelectorAll('.tab-btn');
let courses = [];
let currentView = 'all';
function init() {
    const storedData = sessionStorage.getItem('CourseData');
    if (storedData) {
        courses = JSON.parse(storedData);
        courses.forEach(course => {
            course.selectedTheorySlot = course.selectedTheorySlot || '';
            course.selectedLabSlot = course.selectedLabSlot || '';
        });
    } else {
        courses = [...sampleCourses];
    }
    renderCourseSelections();
    setupEventListeners();
}
function renderCourseSelections() {
    coursesContainer.innerHTML = '';
    if (courses.length === 0) {
        coursesContainer.innerHTML = "<p>No course data found. Please ensure you've added courses from the previous page.</p>";
        generateBtn.disabled = true;
        return;
    }
    
    generateBtn.disabled = false;
    
    courses.forEach((course, index) => {
        // Properly determine if course has lab component based on L credits
        let hasLabComponent = false;
        
        if (course.credits) {
            // Split the credits string (format is typically "T P L" like "3.0 0.0 0.0")
            const creditsParts = course.credits.split(" ");
            if (creditsParts.length >= 3) {
                // Check if L (Lab) credits > 0
                const labCredits = parseFloat(creditsParts[2]);
                hasLabComponent = labCredits > 0;
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
                            ${generateLabPairs().map(slot => `
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
function saveCoursesToSession() {
    sessionStorage.setItem('CourseData', JSON.stringify(courses));
}
function setupEventListeners() {
    generateBtn.addEventListener("click", generateTimetable);
    printBtn.addEventListener('click', () => {
        window.print();
    });
    backToSelectionBtn.addEventListener('click', () => {
        timetableSection.classList.add('hidden');
        errorContainer.classList.add('hidden');
    });
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentView = button.dataset.day;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTimetable();
        });
    });
}
function checkForConflicts() {
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
                            const key = `<span class="katex">...${day}-${time}`;

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
function generateTimetable() {
    const selectedCoursesCount = courses.filter(course => course.selectedTheorySlot !== '' || course.selectedLabSlot !== '').length;
    if (selectedCoursesCount === 0) {
        showError("Please select at least one theory or lab slot for your courses before generating the timetable.");
        return;
    }
    selectedCourses = [];
    courses.forEach((course, idx) => {
        if (course.selectedTheorySlot || course.selectedLabSlot) {
            selectedCourses.push({
                sno: selectedCourses.length + 1,
                courseCode: course.code,
                lectureSlot: course.selectedTheorySlot || 'None',
                labSlot: course.selectedLabSlot || 'None'
            });
        }
    });
    const conflicts = checkForConflicts();
    if (conflicts.length > 0) {
        let errorMessage = "Timetable conflicts detected:<br><br>";
        conflicts.sort((a, b) => {
            if (a.day !== b.day) return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
            return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
        });
        conflicts.forEach((conflict, index) => {
            errorMessage += `${index + 1}. <b>${conflict.clashingSlot}</b> clashes on <b>${conflict.day}</b> at <b>${conflict.time}</b>:<br>`;
            errorMessage += `    - Course: ${conflict.course1} (Selected Slot: ${conflict.slot1})<br>`;
           errorMessage += `    - Course: ${conflict.course2} (Selected Slot: ${conflict.slot2})<br><br>`;
        });
        showError(errorMessage);
        return;
    }
    errorContainer.classList.add('hidden');
    
    currentView = 'all';
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-day="all"]').classList.add('active');
    timetableSection.classList.remove('hidden');
    renderTimetable();
     renderSelectedCoursesSummary(); 
    timetableSection.scrollIntoView({ behavior: 'smooth' });
}
function showError(message) {
    errorContainer.innerHTML = message;
    errorContainer.classList.remove('hidden');
    errorContainer.scrollIntoView({ behavior: 'smooth' });
}
function renderTimetable() {
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
                const scheduledCourses = getCoursesForSlot(day, timeSlot);
                if (scheduledCourses.length > 0) {
                    scheduledCourses.forEach(item => {
                        const badge = document.createElement('span');
                        badge.classList.add('course-badge', item.isLab ? 'lab-badge' : 'theory-badge');
                        badge.textContent = `${item.course.code} - ${item.slot}`;

                        cell.appendChild(badge);
                        cell.appendChild(document.createElement('br'));
                    });
                } else {
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
function getCoursesForSlot(day, timeSlot) {
    const result = [];
    const availableSlotsInTimeBlock = timetableData[day][timeSlot] || [];
    if (availableSlotsInTimeBlock.length === 0) return result;
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
function generateFinalTimetable(courseData, slotMapping) {
    const timetable = document.getElementById("timetable");
    timetableSection.classList.remove('hidden');
    timetable.innerHTML = "";
    const days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50", "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"];
    const header = document.createElement("tr");
    header.appendChild(document.createElement("th"));
    days.forEach(day => {
        const th = document.createElement("th");
        th.textContent = day;
        header.appendChild(th);
    });
    timetable.appendChild(header);
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
    courseData.forEach((course, index) => {
        const selectedTheory = document.getElementById(`theorySlot${index + 1}`)?.value;
        const selectedLab = document.getElementById(`labSlot${index + 1}`)?.value;
        [selectedTheory, selectedLab].forEach(slot => {
            if (!slot) return;
            Object.entries(slotMapping).forEach(([day, times]) => {
                Object.entries(times).forEach(([time, slotArray]) => {
                    if (slotArray.includes(slot)) {
                        const cell = document.querySelector(`td[data-day="<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>d</mi><mi>a</mi><mi>y</mi></mrow><mi mathvariant="normal">&quot;</mi><mo stretchy="false">]</mo><mo stretchy="false">[</mo><mi>d</mi><mi>a</mi><mi>t</mi><mi>a</mi><mo>−</mo><mi>t</mi><mi>i</mi><mi>m</mi><mi>e</mi><mo>=</mo><mi mathvariant="normal">&quot;</mi></mrow><annotation encoding="application/x-tex">{day}&quot;][data-time=&quot;</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">d</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span></span><span class="mord">&quot;</span><span class="mclose">]</span><span class="mopen">[</span><span class="mord mathnormal">d</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">im</span><span class="mord mathnormal">e</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord">&quot;</span></span></span></span>{time}"]`);
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
    renderSelectedCoursesSummary();

}
document.addEventListener('DOMContentLoaded', init);
