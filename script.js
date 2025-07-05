const slotsValues = {
  "2.0 0.0 0.0": ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2"],
  "2.0 1.0 0.0": ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2"],
  "2.0 0.0 1.0": ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2"],
  "3.0 0.0 0.0": ["A1+TA1", "A2+TA2", "B1+TB1", "B2+TB2", "C1+TC1", "C2+TC2",
    "D1+TD1", "D2+TD2", "E1+TE1", "E2+TE2", "F1+TF1", "F2+TF2", "G1+TG1", "G2+TG2"],
  "3.0 1.0 0.0": [
    "A1+TA1", "A2+TA2", "B1+TB1", "B2+TB2", "C1+TC1", "C2+TC2",
    "D1+TD1", "D2+TD2", "E1+TE1", "E2+TE2", "F1+TF1", "F2+TF2", "G1+TG1", "G2+TG2"
  ],
  "3.0 0.0 1.0": [
    "A1+TA1", "A2+TA2", "B1+TB1", "B2+TB2", "C1+TC1", "C2+TC2",
    "D1+TD1", "D2+TD2", "E1+TE1", "E2+TE2", "F1+TF1", "F2+TF2", "G1+TG1", "G2+TG2"
  ],
  "4.0 0.0 0.0": [
    "A1+TA1+TAA1", "A2+TA2+TAA2", "B1+TB1+TBB1", "B2+TB2+TBB2",
    "C1+TC1+TCC1", "C2+TC2+TCC2", "D1+TD1+TDD1", "D2+TD2+TDD2",
    "E1+TE1+TEE1", "E2+TE2+TEE2", "F1+TF1+TFF1", "F2+TF2+TFF2",
    "G1+TG1+TGG1", "G2+TG2+TGG2"
  ]
};

let blockCount = 1;

function validateCCode(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input.value.trim() === "") {
    error.textContent = "*Required";
    error.style.color = "red";
  } else {
    error.textContent = "";
  }
}

function deleteBlock(btn) {
  let btnId = btn.id;
  let clickedBlockNum = parseInt(btnId.replace("DeleteBtn", ""));

  const courseContainer = document.getElementById("course-container");
  const currentTotal = blockCount;
  const blocksToRestore = currentTotal - clickedBlockNum;
  for (let i = currentTotal; i >= clickedBlockNum; i--) {
    const block = document.getElementById(`CourseSlot${i}`);
    if (block) {
      block.remove();
      blockCount--; 
    }
  }

  // Add back same number of blocks
  for (let i = 0; i < blocksToRestore; i++) {
    CoursePageAdder();
  }
}

function toggleDropdown(dropdown) {
  dropdown.classList.toggle("show");
}

function updateSlotOptions(selectEl, blockNo) {
  const value = selectEl.value;
  const container = document.getElementById(`selectedList-container${blockNo}`);
  const menu = selectEl.closest(".container").querySelector(".menu");

  container.innerHTML = "";
  menu.innerHTML = "";

  if (slotsValues[value]) {
    slotsValues[value].forEach(slot => {
      const li = document.createElement("li");
      li.textContent = slot;

      li.addEventListener("click", function (event) {
        event.stopPropagation();
        // Only add the slot if it's not already selected for this course
        if (![...container.children].some(span => span.textContent.includes(slot))) {
          // Check for conflicts with slots in other course blocks
          const allSelectedSlots = getAllSelectedSlots().filter(slotInfo => slotInfo.blockId !== blockNo);
          const selectedSlots = allSelectedSlots.map(slotInfo => slotInfo.slot);
          
          // Check if this slot conflicts with any other selected slots
          const conflictInfo = findConflictingCourse(slot, allSelectedSlots);
          
          if (conflictInfo) {
            // If there's a conflict, show the conflict modal
            showConflictModal(slot, conflictInfo);
            return;
          }
          
          // If no conflicts, add the slot
          const span = document.createElement("span");
          span.className = "selectedItem";
          span.textContent = slot;

          const cross = document.createElement("i");
          cross.className = "fa-solid fa-xmark";
          cross.addEventListener("click", (e) => {
            e.stopPropagation();
            span.classList.add("zoomOut");
            setTimeout(() => span.remove(), 300);
          });

          span.appendChild(cross);
          container.appendChild(span);
        }
      });

      menu.appendChild(li);
    });
  }
}

function showLimitModal() {
  document.getElementById("limitModal").style.display = "flex";
}

function closeLimitModal() {
  document.getElementById("limitModal").style.display = "none";
}

function CoursePageAdder() {
  const MAX_BLOCKS = 10;

  if (blockCount >= MAX_BLOCKS) {
    showLimitModal();
    return;
  }
  
  blockCount++;
  
  const courseBlock = document.createElement("div");
  courseBlock.className = "course-block";
  courseBlock.id = `CourseSlot${blockCount}`;
  
  const container = document.createElement("div");
  container.className = "container";

  const serial = document.createElement("p");
  serial.id = `SerialNo${blockCount}`;
  serial.className = "serial-number";
  serial.textContent = blockCount;
  container.appendChild(serial);

  const container1A = document.createElement("div");
  container1A.className = "container1";

  const courseLabel = document.createElement("label");
  courseLabel.setAttribute("for", `CCode${blockCount}`);
  courseLabel.textContent = "Course Code";

  const courseInput = document.createElement("input");
  courseInput.type = "text";
  courseInput.id = `CCode${blockCount}`;
  courseInput.placeholder = "e.g. CSE2001";
  courseInput.setAttribute("onblur", `validateCCode('CCode${blockCount}', 'CCodeError${blockCount}')`);

  const errorP = document.createElement("p");
  errorP.id = `CCodeError${blockCount}`;
  errorP.className = "error-msg";

  container1A.appendChild(courseLabel);
  container1A.appendChild(courseInput);
  container1A.appendChild(errorP);
  container.appendChild(container1A);

  const container1B = document.createElement("div");
  container1B.className = "container1";

  const creditLabel = document.createElement("label");
  creditLabel.setAttribute("for", `credits${blockCount}`);
  creditLabel.textContent = "Course Credits";

  const creditSelect = document.createElement("select");
  creditSelect.id = `credits${blockCount}`;
  creditSelect.setAttribute("onchange", `updateSlotOptions(this, ${blockCount})`);

  const options = ["--", "2.0 0.0 0.0", "2.0 1.0 0.0","2.0 0.0 1.0","3.0 0.0 0.0", "3.0 1.0 0.0","3.0 0.0 1.0", "4.0 0.0 0.0"];
  options.forEach(val => {
    const opt = document.createElement("option");
    opt.value = val === "--" ? "--" : val;
    opt.textContent = val === "--" ? "-- Select --" : val;
    creditSelect.appendChild(opt);
  });

  container1B.appendChild(creditLabel);
  container1B.appendChild(creditSelect);
  container.appendChild(container1B);

  const slotLabel = document.createElement("label");
  slotLabel.style.fontSize = "15px";
  slotLabel.textContent = "Slots";

  const multiselect = document.createElement("div");
  multiselect.className = "multiselect-dropdown";
  multiselect.setAttribute("onclick", "toggleDropdown(this)");

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-chevron-down icon";

  const selectedList = document.createElement("div");
  selectedList.className = "selectedList-container";
  selectedList.id = `selectedList-container${blockCount}`;

  const ulMenu = document.createElement("ul");
  ulMenu.className = "menu";

  multiselect.appendChild(icon);
  multiselect.appendChild(selectedList);
  multiselect.appendChild(ulMenu);

  container.appendChild(slotLabel);
  container.appendChild(multiselect);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.id = `DeleteBtn${blockCount}`;
  
  deleteBtn.onclick = function() {
    const block = document.getElementById(`CourseSlot${blockCount}`);
    if (block) {
      block.remove();
      blockCount--;

      // Enable the new last delete button
      if (blockCount > 0) {
        let newLastBtn = document.getElementById(`DeleteBtn${blockCount}`);
        if (newLastBtn) newLastBtn.disabled = false;
      }
    }
  };

  // Disable previous delete buttons
  for (let i = 1; i < blockCount; i++) {
    let prevBtn = document.getElementById(`DeleteBtn${i}`);
    if (prevBtn) prevBtn.disabled = true;
  }

  container.appendChild(deleteBtn);
  courseBlock.appendChild(container);

  document.getElementById("course-container").appendChild(courseBlock);
}

document.addEventListener("DOMContentLoaded", () => {
  // Already one block exists in HTML (blockCount = 1)
  for (let i = 0; i < 3; i++) {
    CoursePageAdder(); // Adds 3 more → Total 4
  }
});

function validateForm() {
  let isValid = true;
  let creditValues = [];
  let courseContainer = document.getElementById("course-container");
  let totalBlocks = courseContainer.children.length;
  const CourseData = [];

  for (let i = 1; i <= totalBlocks; i++) {
    // Check course code input
    let courseCode = document.getElementById(`CCode${i}`);
    let courseCredit = document.getElementById(`credits${i}`);

    if (!courseCode || !courseCredit) continue;

    let codeVal = courseCode.value.trim();
    let creditVal = courseCredit.value;

    if (codeVal === "") {
      isValid = false;
      showModal("Course Code cannot be empty for block " + i);
      return false;
    }

    if (creditVal === "--") {
      isValid = false;
      showModal("Please select credits for block " + i);
      return false;
    }

    // Parse credit value to get the sum of all numbers in the credit string
    const creditParts = creditVal.split(" ").map(val => parseFloat(val) || 0);
    const numericCredits = creditParts.reduce((sum, val) => sum + val, 0);
    creditValues.push(numericCredits);
  }

  // Sum of all credits
  let totalCredits = creditValues.reduce((sum, val) => sum + val, 0);

  if (totalCredits < 16 || totalCredits > 27) {
    isValid = false;
    showModal(`Total Credits must be between 16 and 27.\nYou currently have: ${totalCredits}`);
    return false;
  }

  if (isValid) {
    const CourseData = [];

    for (let i = 1; i <= totalBlocks; i++) {
      let courseCode = document.getElementById(`CCode${i}`);
      if (!courseCode) continue;
      
      let courseCredit = document.getElementById(`credits${i}`);
      if (!courseCredit) continue;

      let codeVal = courseCode.value.trim();
      let creditVal = courseCredit.value;

      // Get selected theory slots
      let theorySlots = [];
      const slotsValueId = `selectedList-container${i}`;
      const container = document.getElementById(slotsValueId);
      
      if (container) {
        for (let child of container.children) {
          // Remove the 'x' mark text
          const slotText = child.textContent.replace(/[×✕✖]/g, "").trim();
          theorySlots.push(slotText);
        }
      }

      // Separate theory and lab slots
      const pureTheorySlots = [];
      
      // Make all selected slots available in both theory and lab slots
      // This ensures all options will be available on the next page
      const labSlots = ["L2", "L3", "L4", "L5", "L8", "L9", "L10", "L11", 
                         "L14", "L15", "L16", "L17", "L20", "L21", "L22", 
                         "L23", "L26", "L27", "L28", "L29"];
      
      // For credits 2.0 0.0 1.0 and 3.0 0.0 1.0, which have lab components
      if (creditVal.includes("0.0 1.0")) {
        // Add all lab slots to ensure they're available for selection
        // Keep theory slots as they were selected
        theorySlots.forEach(slot => {
          pureTheorySlots.push(slot);
        });
      } else {
        // For non-lab credits, just pass the theory slots
        theorySlots.forEach(slot => {
          pureTheorySlots.push(slot);
        });
      }

      // Check if course has lab component (L value is 1.0)
      const hasLabComponent = creditVal.split(" ")[2] === "1.0";
      
      // Push into CourseData array
      CourseData.push({
        code: codeVal,
        credits: creditVal,
        theorySlots: pureTheorySlots,
        labSlots: hasLabComponent ? labSlots : [], // Only include lab slots if L=1.0
        hasLab: hasLabComponent
      });
    }

    // Store data in sessionStorage
    sessionStorage.setItem('CourseData', JSON.stringify(CourseData));
    
    // Navigate to the next page
    window.location.href = "nextpage.html";
  }
  
  return isValid;
}

function showModal(message) {
  const modal = document.getElementById("custom-modal");
  const modalText = document.getElementById("modal-text");
  modalText.innerText = message;
  modal.style.display = "flex";
}