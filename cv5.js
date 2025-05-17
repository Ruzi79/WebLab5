document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load JSON data");
      return response.json();
    })
    .then(data => {
      const local = localStorage.getItem("cvProfile");
      const profile = local ? JSON.parse(local) : data;
function makeEditable(element) {
  element.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = element.innerText;
    input.classList.add("edit-input");

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.classList.add("edit-save");

    const container = document.createElement("span");
    container.classList.add("edit-container");

    const li = element.closest("li");
    const isDeletable =
      li &&
      (element.closest(".skills ul") ||
        element.closest(".languages ul") ||
        element.closest(".education ul") ||
        element.closest(".work-experience ul"));

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("edit-delete");

    container.appendChild(input);
    container.appendChild(saveBtn);
    if (isDeletable) container.appendChild(deleteBtn); 


    element.replaceWith(container);
    input.focus();

    function showWarning(msg) {
      const warning = document.createElement("div");
      warning.classList.add("warning");
      warning.innerText = msg;
      container.appendChild(warning);
      setTimeout(() => warning.remove(), 2000);
    }

    function save() {
      const value = input.value.trim();
      const originalValue = element.innerText;
      const charLimit = 100;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value.length > charLimit) {
        showWarning(`This field cannot exceed ${charLimit} characters!`);
        return;
      }

      if (value === "") {
        showWarning("This field cannot be empty!");
        return;
      }

      if (element.innerText.includes("@") && !emailRegex.test(value)) {
        showWarning("Please enter a valid email address!");
        return;
      }

      const newSpan = document.createElement("span");
      newSpan.innerText = value === "" ? originalValue : value;
      newSpan.className = element.className;
      makeEditable(newSpan);
      container.replaceWith(newSpan);
      saveProfileToLocalStorage(getUpdatedProfileData());

    }

    saveBtn.addEventListener("click", save);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") save();
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (
          document.activeElement !== saveBtn &&
          document.activeElement !== deleteBtn
        ) {
          save();
        }
      }, 150);
    });

    if (isDeletable) {
      deleteBtn.addEventListener("click", () => {
        const parentLi = container.closest("li");
        if (parentLi) parentLi.remove();

      });
    }
  });
}

  const h1 = document.querySelector("h1");
  h1.innerHTML = `<span class="editable bold">${profile.firstName}</span> <span class="editable" style="color: #163853;">${profile.lastName}</span>`;
  document.querySelector("h2.market").innerHTML = `<span class="editable">${profile.title}</span>`;

  const contactDiv = document.querySelector(".contact");
  contactDiv.innerHTML = `
    <h2>CONTACT</h2>
    <p>📞 <span class="editable">${profile.contact.phone}</span></p>
    <p>📧 <span class="editable">${profile.contact.email}</span></p>
    <p>📍 <span class="editable">${profile.contact.address}</span></p>
    <p>🌐 <span class="editable">${profile.contact.website}</span></p>
  `;

  const educationList = document.getElementById("education-list");
educationList.innerHTML = "";
profile.education.forEach(edu => {
  const div = document.createElement("div");
  div.classList.add("div1");
  div.innerHTML = `
    <h3 style="font-size: 13px;">
      <p style="margin-bottom: 10px;">
        <span class="editable">${edu.year}</span><br>
        <span class="editable">${edu.university}</span>
      </p>
    </h3>
    <ul style="margin-top: 0;">
      ${edu.degrees.map(degree => `<li><span class="editable">${degree}</span></li>`).join("")}
    </ul>
    <button class="delete-block">Delete</button>
  `;
  educationList.appendChild(div);
  
  div.querySelector(".delete-block").addEventListener("click", () => {
    div.remove();
    saveProfileToLocalStorage(getUpdatedProfileData());
  });

  div.querySelectorAll(".editable").forEach(el => makeEditable(el));
});

  const skillsList = document.querySelector(".skills ul");
  skillsList.innerHTML = "";
  profile.skills.forEach(skill => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="editable">${skill}</span>`;
    skillsList.appendChild(li);
  });

  const languagesList = document.querySelector(".languages ul");
  languagesList.innerHTML = "";
  profile.languages.forEach(language => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="editable">${language}</span>`;
    languagesList.appendChild(li);
  });

 const workTimeline = document.querySelector(".work-experience .timeline");
workTimeline.innerHTML = "";
profile.workExperience.forEach(job => {
  const div = document.createElement("div");
  div.classList.add("entry");
  div.innerHTML = `
    <div class="dot"></div>
    <div class="content">
      <h3><strong><span class="editable">${job.company}</span></strong> <span class="date editable">${job.date}</span></h3>
      <p><span class="editable">${job.position}</span></p>
      <ul>
        ${job.responsibilities.map(task => `<li><span class="editable">${task}</span></li>`).join("")}
      </ul>
      <button class="delete-block">Delete</button>
    </div>
  `;
  workTimeline.appendChild(div);
  
  div.querySelector(".delete-block").addEventListener("click", () => {
    div.remove();
    saveProfileToLocalStorage(getUpdatedProfileData());
  });

  div.querySelectorAll(".editable").forEach(el => makeEditable(el));
});

  const referenceContainer = document.querySelector(".reference-container");
  referenceContainer.innerHTML = "";
  profile.references.forEach(ref => {
    const div = document.createElement("div");
    div.classList.add("reference-box");
    div.innerHTML = `
      <p style="color: #545454;"><strong><span class="editable">${ref.name}</span></strong></p>
      <p><span class="editable">${ref.position}</span></p>
      <p><span class="label">Phone:</span> <span class="editable">${ref.phone}</span></p>
      <p><span class="label">Email:</span> <span class="editable">${ref.email}</span></p>
    `;
    referenceContainer.appendChild(div);
  });

  const description = document.querySelector(".profile-description");
  description.innerHTML = `<span class="editable">${profile.profileDescription}</span>`;

  document.querySelectorAll(".editable").forEach(el => makeEditable(el));

function styleButton(button, type) {
  button.classList.add("button");
  if (type === "blue") {
    button.classList.add("button-blue");
  } else {
    button.classList.add("button-white");
  }
}

  function addEducation() {
  const year = prompt("Enter year range (e.g. 2021 - 2025):");
  const university = prompt("Enter university name:");
  if (year && university) {
    const degrees = [];
    let another = true;
    while (another) {
      const degree = prompt("Enter a degree/program:");
      if (degree) {
        degrees.push(degree);
        another = confirm("Add another degree for this university?");
      } else {
        another = false;
      }
    }
    if (degrees.length > 0) {
      const div = document.createElement("div");
      div.classList.add("div1");
      div.innerHTML = `
        <h3 style="font-size: 13px;"><p style="margin-bottom: 10px;"><span class="editable">${year}</span><br><span class="editable">${university}</span></p></h3>
        <ul style="margin-top: 0;">
          ${degrees.map(degree => `<li><span class="editable">${degree}</span></li>`).join("")}
        </ul>
        <button class="delete-block">Delete</button>
      `;
      document.getElementById("education-list").appendChild(div);
      
      div.querySelector(".delete-block").addEventListener("click", () => {
        div.remove();

      });

      div.querySelectorAll(".editable").forEach(el => makeEditable(el));
      saveProfileToLocalStorage(getUpdatedProfileData());

    }
  }
}

  function addSkill() {
    const skill = prompt("Enter a new skill:");
    if (skill) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="editable">${skill}</span>`;
      skillsList.appendChild(li);
      li.querySelector(".editable").addEventListener("click", () => makeEditable(li.querySelector(".editable")));
    }
    saveProfileToLocalStorage(getUpdatedProfileData());
  }

  function addWorkExperience() {
  const company = prompt("Enter company name:");
  const dateRange = prompt("Enter date range (e.g. 2022 - 2024):");
  const position = prompt("Enter your position/title:");
  if (company && dateRange && position) {
    const responsibilities = [];
    let another = true;
    while (another) {
      const task = prompt("Enter a responsibility/task:");
      if (task) {
        responsibilities.push(task);
        another = confirm("Add another responsibility?");
      } else {
        another = false;
      }
    }
    if (responsibilities.length > 0) {
      const entry = document.createElement("div");
      entry.classList.add("entry");
      entry.innerHTML = `
        <div class="dot"></div>
        <div class="content">
          <h3><strong><span class="editable">${company}</span></strong> <span class="date editable">${dateRange}</span></h3>
          <p><span class="editable">${position}</span></p>
          <ul>
            ${responsibilities.map(task => `<li><span class="editable">${task}</span></li>`).join("")}
          </ul>
          <button class="delete-block">Delete</button>
        </div>
      `;
      document.querySelector(".work-experience .timeline").appendChild(entry);
      
      entry.querySelector(".delete-block").addEventListener("click", () => {
        entry.remove();
      });

      entry.querySelectorAll(".editable").forEach(el => makeEditable(el));
      saveProfileToLocalStorage(getUpdatedProfileData());

    }
  }
}

  function addLanguage() {
    const language = prompt("Enter a new language (e.g. Italian (Fluent)):");
    if (language) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="editable">${language}</span>`;
      languagesList.appendChild(li);
      li.querySelector(".editable").addEventListener("click", () => makeEditable(li.querySelector(".editable")));
       saveProfileToLocalStorage(getUpdatedProfileData());
    }

  }

  function makeDropdown(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    const title = section.querySelector("h2");
    const content = Array.from(section.children).filter(child => child !== title);

    const arrow = document.createElement("span");
    arrow.textContent = "▼";
    arrow.style.marginRight = "8px";
    arrow.style.display = "inline-block";
    arrow.style.transition = "transform 0.2s ease";
    title.prepend(arrow);

    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      const isHidden = content[0].style.display === "none";
      content.forEach(el => el.style.display = isHidden ? "" : "none");
      arrow.textContent = isHidden ? "▼" : "▶";
    });
  }

  makeDropdown(".education");
  makeDropdown(".skills");
  makeDropdown(".languages");
  makeDropdown(".work-experience");
  makeDropdown(".reference-section");
  makeDropdown(".contact");
  makeDropdown(".profile");
 
  const addEduBtn = document.createElement("button");
  addEduBtn.textContent = "Add Education";
  styleButton(addEduBtn, "white");
  addEduBtn.addEventListener("click", addEducation);
  document.querySelector(".education").appendChild(addEduBtn);

  const addSkillBtn = document.createElement("button");
  addSkillBtn.textContent = "Add Skill";
  styleButton(addSkillBtn, "white");
  addSkillBtn.addEventListener("click", addSkill);
  document.querySelector(".skills").appendChild(addSkillBtn);

  const addWorkBtn = document.createElement("button");
  addWorkBtn.textContent = "Add Work Experience";
  styleButton(addWorkBtn, "blue");
  addWorkBtn.addEventListener("click", addWorkExperience);
  document.querySelector(".work-experience").appendChild(addWorkBtn);

  const addLangBtn = document.createElement("button");
  addLangBtn.textContent = "Add Language";
  styleButton(addLangBtn, "white");
  addLangBtn.addEventListener("click", addLanguage);
  document.querySelector(".languages").appendChild(addLangBtn);

  function getUpdatedProfileData() {
  const updatedProfile = {...profile};

  updatedProfile.firstName = document.querySelector("h1 .bold").innerText;
  updatedProfile.lastName = document.querySelector("h1 span:not(.bold)").innerText;
  updatedProfile.title = document.querySelector("h2.market .editable").innerText;

  const contactFields = document.querySelectorAll(".contact .editable");
  updatedProfile.contact = {
    phone: contactFields[0].innerText,
    email: contactFields[1].innerText,
    address: contactFields[2].innerText,
    website: contactFields[3].innerText
  };

  updatedProfile.skills = [...document.querySelectorAll(".skills ul .editable")].map(el => el.innerText);

  updatedProfile.languages = [...document.querySelectorAll(".languages ul .editable")].map(el => el.innerText);

  updatedProfile.education = [...document.querySelectorAll("#education-list .div1")].map(div => {
    const spans = div.querySelectorAll(".editable");
    const degrees = [...div.querySelectorAll("ul li .editable")].map(el => el.innerText);
    return {
      year: spans[0].innerText,
      university: spans[1].innerText,
      degrees: degrees
    };
  });

  updatedProfile.workExperience = [...document.querySelectorAll(".work-experience .entry")].map(entry => {
    const spans = entry.querySelectorAll(".editable");
    const responsibilities = [...entry.querySelectorAll("ul li .editable")].map(el => el.innerText);
    return {
      company: spans[0].innerText,
      date: spans[1].innerText,
      position: spans[2].innerText,
      responsibilities: responsibilities
    };
  });

  updatedProfile.references = [...document.querySelectorAll(".reference-box")].map(refBox => {
    const spans = refBox.querySelectorAll(".editable");
    return {
      name: spans[0].innerText,
      position: spans[1].innerText,
      phone: spans[2].innerText,
      email: spans[3].innerText
    };
  });

  updatedProfile.profileDescription = document.querySelector(".profile-description .editable").innerText;

  return updatedProfile;
}
function saveProfileToLocalStorage(profile) {
  localStorage.setItem("cvProfile", JSON.stringify(profile));
}
function resetToLastSavedVersion() {
  const lastSaved = localStorage.getItem("cvProfile");
  if (lastSaved) {
    localStorage.removeItem("cvProfile");
    location.reload(); 
  } else {
    alert("No saved version found!");
  }
}

const resetBtn = document.createElement("button");
resetBtn.textContent = "Reset All";
styleButton(resetBtn, "blue");
resetBtn.addEventListener("click", resetToLastSavedVersion);
document.body.appendChild(resetBtn); 
 
    })
    .catch(error => {
      console.error("Error loading profile data:", error);
    });
});
