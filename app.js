"use strict";

const STORAGE_KEY = "student-results-portal-v2";
const PASS_MARK = 40;
const SUBJECTS = [
  { key: "agenticAi", name: "Agentic AI" },
  { key: "fullstack", name: "Fullstack" },
  { key: "dsa", name: "DSA" },
  { key: "sqlNoSql", name: "SQL/NO SQL" },
  { key: "linux", name: "Linux" },
  { key: "python", name: "Python" }
];
const GRADES = [
  { name: "A+", minimum: 90 },
  { name: "A", minimum: 80 },
  { name: "B", minimum: 70 },
  { name: "C", minimum: 60 },
  { name: "D", minimum: 50 },
  { name: "F", minimum: 0 }
];
const form = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");
const recordsMessage = document.querySelector("#records-message");
const recordsBody = document.querySelector("#records-body");
const dialog = document.querySelector("#marksheet-dialog");
let students = loadStudents();
let editingId = null;
let activeResultFilter = "all";

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(isStudentRecord)) {
      throw new Error("Stored student records are not in the expected format.");
    }
    return parsed;
  } catch (error) {
    console.error("Unable to load student records.", error);
    showMessage(formMessage, "Saved student records could not be loaded from this browser.");
    return [];
  }
}

function isStudentRecord(student) {
  return student !== null
    && typeof student === "object"
    && typeof student.id === "string"
    && typeof student.name === "string"
    && typeof student.rollNumber === "string"
    && typeof student.course === "string"
    && student.marks !== null
    && typeof student.marks === "object"
    && SUBJECTS.every(({ key }) => Number.isInteger(student.marks[key]) && student.marks[key] >= 0 && student.marks[key] <= 100);
}

function showMessage(element, text) {
  element.textContent = text;
}

function persistStudents(nextStudents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStudents));
    students = nextStudents;
    return true;
  } catch (error) {
    console.error("Unable to save student records.", error);
    showMessage(formMessage, "Could not save the records. Check available browser storage and try again.");
    return false;
  }
}

function gradeFor(percentage) {
  return GRADES.find(({ minimum }) => percentage >= minimum).name;
}

function calculateResult(marks) {
  const total = SUBJECTS.reduce((sum, { key }) => sum + marks[key], 0);
  const percentage = Number((total / SUBJECTS.length).toFixed(2));
  const passed = percentage >= PASS_MARK && SUBJECTS.every(({ key }) => marks[key] >= PASS_MARK);
  return { total, percentage, grade: gradeFor(percentage), result: passed ? "Pass" : "Fail" };
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readForm() {
  const data = new FormData(form);
  const marks = {};
  for (const { key, name } of SUBJECTS) {
    const value = data.get(key);
    const mark = Number(value);
    if (value === "" || !Number.isInteger(mark) || mark < 0 || mark > 100) {
      throw new Error(`${name} marks must be a whole number from 0 to 100.`);
    }
    marks[key] = mark;
  }

  const student = {
    id: editingId ?? createId(),
    rollNumber: data.get("rollNumber").trim(),
    name: data.get("name").trim(),
    email: data.get("email").trim(),
    course: data.get("course"),
    semester: data.get("semester"),
    gender: data.get("gender"),
    dateOfBirth: data.get("dateOfBirth"),
    phone: data.get("phone").trim(),
    academicYear: data.get("academicYear").trim(),
    marks,
    ...calculateResult(marks)
  };

  if ([student.rollNumber, student.name, student.email, student.course, student.semester, student.dateOfBirth]
    .some((value) => !value.trim())) {
    throw new Error("Complete all required student details.");
  }
  return student;
}

function renderLiveTotal() {
  const marks = SUBJECTS.map(({ key }) => Number(form.elements.namedItem(key).value));
  if (marks.some((mark) => !Number.isInteger(mark) || mark < 0 || mark > 100)) {
    document.querySelector("#current-total").textContent = "—";
    document.querySelector("#current-percentage").textContent = "—";
    return;
  }
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  document.querySelector("#current-total").textContent = String(total);
  document.querySelector("#current-percentage").textContent = (total / SUBJECTS.length).toFixed(2);
}

function resetForm() {
  form.reset();
  editingId = null;
  document.querySelector("#submit-button").textContent = "Register student";
  document.querySelector("#registration-title").textContent = "1. Student personal & academic details";
  showMessage(formMessage, "");
  renderLiveTotal();
}

function setFormFromStudent(student) {
  for (const [name, value] of Object.entries(student)) {
    const field = form.elements.namedItem(name);
    if (field && typeof value !== "object") field.value = value ?? "";
  }
  for (const { key } of SUBJECTS) {
    form.elements.namedItem(key).value = student.marks[key];
  }
  editingId = student.id;
  document.querySelector("#submit-button").textContent = "Save changes";
  document.querySelector("#registration-title").textContent = "1. Edit student details";
  showMessage(formMessage, "");
  renderLiveTotal();
  showView("registration");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addCell(row, value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = String(value);
  if (className) cell.className = className;
  row.append(cell);
  return cell;
}

function addAction(row, text, accessibleLabel, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "action-button";
  button.textContent = text;
  button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", action);
  const cell = row.lastElementChild;
  cell.append(button);
}

function renderRecords() {
  const search = document.querySelector("#search-records").value.trim().toLocaleLowerCase();
  const course = document.querySelector("#course-filter").value;
  const passCount = students.filter((student) => student.result === "Pass").length;
  const failCount = students.length - passCount;
  document.querySelector("#nav-count").textContent = String(students.length);
  document.querySelector("#all-count").textContent = String(students.length);
  document.querySelector("#pass-count").textContent = String(passCount);
  document.querySelector("#fail-count").textContent = String(failCount);
  recordsBody.replaceChildren();

  const visibleStudents = students.filter((student) => {
    const matchesSearch = `${student.name} ${student.rollNumber}`.toLocaleLowerCase().includes(search);
    const matchesCourse = !course || student.course === course;
    const matchesResult = activeResultFilter === "all" || student.result === activeResultFilter;
    return matchesSearch && matchesCourse && matchesResult;
  });

  for (const student of visibleStudents) {
    const row = document.createElement("tr");
    addCell(row, student.rollNumber, "mono strong-cell");
    const nameCell = addCell(row, "");
    const name = document.createElement("strong");
    name.textContent = student.name;
    const email = document.createElement("small");
    email.textContent = student.email;
    nameCell.append(name, email);
    const courseCell = addCell(row, "");
    const courseName = document.createElement("span");
    courseName.textContent = student.course;
    const semester = document.createElement("small");
    semester.textContent = student.semester;
    courseCell.append(courseName, semester);
    addCell(row, `${student.total}/600`, "mono strong-cell");
    addCell(row, `${student.percentage.toFixed(1)}%`, "mono strong-cell");
    addCell(row, student.grade, "strong-cell");
    addCell(row, student.result.toUpperCase(), `result-label ${student.result.toLowerCase()}`);
    const actions = document.createElement("td");
    row.append(actions);
    addAction(row, "View", `View ${student.name}'s marksheet`, () => showMarksheet(student));
    addAction(row, "Edit", `Edit ${student.name}`, () => setFormFromStudent(student));
    addAction(row, "Delete", `Delete ${student.name}`, () => deleteStudent(student.id));
    recordsBody.append(row);
  }

  document.querySelector("#empty-records").hidden = visibleStudents.length > 0;
  updateCourseFilter();
}

function updateCourseFilter() {
  const filter = document.querySelector("#course-filter");
  const selected = filter.value;
  const courses = [...new Set(students.map((student) => student.course))].sort();
  filter.replaceChildren(new Option("All courses", ""));
  for (const course of courses) filter.add(new Option(course, course));
  filter.value = courses.includes(selected) ? selected : "";
}

function deleteStudent(id) {
  const student = students.find((record) => record.id === id);
  if (!student || !window.confirm(`Delete ${student.name}'s record?`)) return;
  if (persistStudents(students.filter((record) => record.id !== id))) {
    showMessage(recordsMessage, "");
    renderRecords();
    renderSummary();
  }
}

function showMarksheet(student) {
  document.querySelector("#marksheet-name").textContent = student.name;
  document.querySelector("#marksheet-details").textContent =
    `${student.rollNumber} · ${student.course} · ${student.semester} · ${student.email}`;
  const tbody = document.querySelector("#marksheet-subjects");
  tbody.replaceChildren();
  for (const { key, name } of SUBJECTS) {
    const row = document.createElement("tr");
    addCell(row, name);
    addCell(row, student.marks[key]);
    addCell(row, 100);
    tbody.append(row);
  }
  document.querySelector("#marksheet-total").textContent =
    `Total ${student.total}/600 · ${student.percentage.toFixed(2)}% · Grade ${student.grade} · ${student.result}`;
  dialog.showModal();
}

function renderSummary() {
  const count = students.length;
  const pass = students.filter((student) => student.result === "Pass").length;
  const average = count
    ? students.reduce((sum, student) => sum + student.percentage, 0) / count
    : 0;
  const highest = students.reduce((top, student) => !top || student.percentage > top.percentage ? student : top, null);
  document.querySelector("#summary-enrolled").textContent = String(count);
  document.querySelector("#summary-pass-rate").textContent = `${count ? Math.round((pass / count) * 100) : 0}%`;
  document.querySelector("#summary-pass-count").textContent = `${pass} Passed / ${count - pass} Failed`;
  document.querySelector("#summary-average").textContent = `${average.toFixed(1)}%`;
  document.querySelector("#summary-highest").textContent = highest?.name ?? "—";
  document.querySelector("#summary-highest-score").textContent = highest
    ? `${highest.percentage.toFixed(1)}% (${highest.rollNumber})`
    : "No records yet";

  const gradeBody = document.querySelector("#grade-distribution");
  gradeBody.replaceChildren();
  for (const { name } of GRADES) {
    const gradeCount = students.filter((student) => student.grade === name).length;
    const row = document.createElement("tr");
    addCell(row, `Grade ${name}`, "strong-cell");
    addCell(row, gradeCount);
    addCell(row, `${count ? ((gradeCount / count) * 100).toFixed(1) : "0.0"}%`, "mono");
    gradeBody.append(row);
  }

  const courseBody = document.querySelector("#course-distribution");
  courseBody.replaceChildren();
  const courses = new Map();
  for (const student of students) courses.set(student.course, (courses.get(student.course) ?? 0) + 1);
  if (courses.size === 0) addEmptyRow(courseBody, "No student records yet.", 2);
  for (const [name, courseCount] of courses) {
    const row = document.createElement("tr");
    addCell(row, name);
    addCell(row, courseCount, "mono");
    courseBody.append(row);
  }

  const subjectBody = document.querySelector("#subject-summary");
  subjectBody.replaceChildren();
  for (const { key, name } of SUBJECTS) {
    const totalMarks = students.reduce((sum, student) => sum + student.marks[key], 0);
    const passed = students.filter((student) => student.marks[key] >= PASS_MARK).length;
    const row = document.createElement("tr");
    addCell(row, name, "strong-cell");
    addCell(row, count ? (totalMarks / count).toFixed(1) : "0.0", "mono strong-cell");
    addCell(row, `${count ? Math.round((passed / count) * 100) : 0}%`, "mono green-text");
    subjectBody.append(row);
  }
}

function addEmptyRow(tbody, text, columns) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = columns;
  cell.textContent = text;
  cell.className = "empty-cell";
  row.append(cell);
  tbody.append(row);
}

function showView(viewName) {
  for (const view of document.querySelectorAll(".view")) {
    const isActive = view.id === `${viewName}-view`;
    view.hidden = !isActive;
    view.classList.toggle("active", isActive);
  }
  for (const button of document.querySelectorAll(".nav-button")) {
    button.classList.toggle("active", button.dataset.view === viewName);
  }
  if (viewName === "records") renderRecords();
  if (viewName === "summary") renderSummary();
}

function exportRecords() {
  const file = new Blob([JSON.stringify(students, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-records.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importRecords(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(String(reader.result));
      if (!Array.isArray(imported) || !imported.every(isStudentRecord)) {
        throw new Error("Choose a JSON file containing valid student records.");
      }
      const combined = [...students];
      for (const student of imported) {
        const duplicateIndex = combined.findIndex((existing) =>
          existing.rollNumber.toLocaleLowerCase() === student.rollNumber.toLocaleLowerCase()
        );
        if (duplicateIndex === -1) combined.push(student);
        else combined[duplicateIndex] = student;
      }
      if (persistStudents(combined)) {
        showMessage(recordsMessage, `Imported ${imported.length} student record${imported.length === 1 ? "" : "s"}.`);
        renderRecords();
        renderSummary();
      }
    } catch (error) {
      console.error("Unable to import student records.", error);
      showMessage(recordsMessage, error.message);
    }
  });
  reader.addEventListener("error", () => {
    showMessage(recordsMessage, "Could not read the selected JSON file.");
  });
  reader.readAsText(file);
}

function demoStudents() {
  const examples = [
    ["CS2026001", "Aarav Sharma", "aarav.sharma@campus.edu", "B.Tech Computer Science & Engineering", "Semester 4", [94, 91, 89, 93, 92, 99]],
    ["IT2026019", "Priya Iyer", "priya.iyer@campus.edu", "B.Tech Information Technology", "Semester 4", [86, 82, 81, 84, 78, 95]],
    ["AI2026042", "Rohan Mehra", "rohan.mehra@campus.edu", "B.Tech Artificial Intelligence & Data Science", "Semester 4", [70, 68, 73, 64, 61, 72]],
    ["MCA2026008", "Ananya Verma", "ananya.verma@campus.edu", "MCA (Master of Computer Applications)", "Semester 2", [53, 48, 57, 51, 50, 52]],
    ["BCA2026031", "Vikramaditya Roy", "vikram.roy@campus.edu", "BCA (Bachelor of Computer Applications)", "Semester 3", [35, 36, 38, 28, 34, 42]]
  ];
  const additions = examples.map(([rollNumber, name, email, course, semester, scores], index) => {
    const marks = Object.fromEntries(SUBJECTS.map(({ key }, subjectIndex) => [key, scores[subjectIndex]]));
    return {
      id: `demo-${rollNumber}`,
      rollNumber, name, email, course, semester,
      gender: "", dateOfBirth: "", phone: "",
      academicYear: "2026–2027",
      marks,
      ...calculateResult(marks),
      createdAt: new Date(Date.now() + index).toISOString()
    };
  });
  const existingRolls = new Set(students.map((student) => student.rollNumber.toLocaleLowerCase()));
  const unique = additions.filter((student) => !existingRolls.has(student.rollNumber.toLocaleLowerCase()));
  if (persistStudents([...students, ...unique])) {
    showMessage(recordsMessage, unique.length ? `${unique.length} demo records added.` : "Demo records are already loaded.");
    renderRecords();
    renderSummary();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showMessage(formMessage, "");
  if (!form.reportValidity()) return;
  try {
    const student = readForm();
    const duplicate = students.find((record) =>
      record.rollNumber.toLocaleLowerCase() === student.rollNumber.toLocaleLowerCase()
      && record.id !== editingId
    );
    if (duplicate) {
      showMessage(formMessage, "A student with this roll number is already registered.");
      document.querySelector("#roll-number").focus();
      return;
    }
    const nextStudents = editingId
      ? students.map((record) => record.id === editingId ? student : record)
      : [student, ...students];
    if (!persistStudents(nextStudents)) return;
    resetForm();
    renderRecords();
    renderSummary();
    showView("records");
  } catch (error) {
    showMessage(formMessage, error.message);
  }
});

for (const field of form.querySelectorAll('input[type="number"]')) {
  field.addEventListener("input", renderLiveTotal);
}
form.addEventListener("input", () => showMessage(formMessage, ""));
document.querySelector("#reset-form").addEventListener("click", resetForm);
document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});
document.querySelector("#add-student-button").addEventListener("click", () => {
  resetForm();
  showView("registration");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector("#search-records").addEventListener("input", renderRecords);
document.querySelector("#course-filter").addEventListener("change", renderRecords);
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeResultFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    renderRecords();
  });
});
document.querySelector("#export-button").addEventListener("click", exportRecords);
document.querySelector("#import-button").addEventListener("click", () => document.querySelector("#import-file").click());
document.querySelector("#import-file").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importRecords(file);
  event.target.value = "";
});
document.querySelector("#demo-button").addEventListener("click", demoStudents);
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

renderRecords();
renderSummary();
