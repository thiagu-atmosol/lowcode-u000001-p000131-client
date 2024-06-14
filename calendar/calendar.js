/*class Calendar {
  constructor(id) {
    this.id = id;
    this.parent = document.getElementById(id);
    this.BASE_URL = "https://lowcodedev.azurewebsites.net/api";
    this.config;
    this.prevBtn = this.parent.querySelector("#prevBtn");
    this.nextBtn = this.parent.querySelector("#nextBtn");
    this.monthBtn = this.parent.querySelector("#monthBtn");
    this.weekBtn = this.parent.querySelector("#weekBtn");
    this.dayBtn = this.parent.querySelector("#dayBtn");
    this.calendarDiv = this.parent.querySelector("#calendar");
    this.modal = this.parent.querySelector("#appointmentModal");
    this.closeModal = this.parent.querySelectorAll(".close")[0];
    this.appointmentHeader = this.parent.querySelector("#appointmentHeader");
    this.appointmentButton = this.parent.querySelector("#createAppointmentBtn");
    this.appointmentName = this.parent.querySelector("#appointmentName");
    this.email = this.parent.querySelector("#email");
    this.description = this.parent.querySelector("#description");
    this.startTime = this.parent.querySelector("#startTime");
    this.endTime = this.parent.querySelector("#endTime");
    this.startDate = this.parent.querySelector("#startDate");
    this.endDate = this.parent.querySelector("#endDate");
    this.appointmentForm = this.parent.querySelector("form");
    this.emailsContainer = this.parent.querySelector("#emailsContainer");
    this.multipleEmailsContainer = this.parent.querySelector(
      "#multipleEmailsContainer"
    );
    this.addEmailBtn = this.parent.querySelector("#addEmailBtn");
    this.deleteAppointmentBtn = this.parent.querySelector(
      "#deleteAppointmentBtn"
    );
    this.selectedDates = [];
    this.appointments = [];
    this.currentView = "month";
    this.timeOptions = this.generateTimeOptions();
    this.editingAppointment = null;

    this.multipleAppointmentsModal = this.parent.querySelector(
      "#multipleAppointmentsModal"
    );
    this.closeMultipleModal = this.parent.querySelectorAll(".close")[1];
    this.multipleAppointmentName = this.parent.querySelector(
      "#multipleAppointmentName"
    );
    this.multipleEmailsContainer = this.parent.querySelector(
      "#multipleEmailsContainer"
    );
    this.addMultipleEmailBtn = this.parent.querySelector(
      "#addMultipleEmailBtn"
    );
    this.selectedDatesContainer = this.parent.querySelector(
      "#selectedDatesContainer"
    );
    this.multipleDescription = this.parent.querySelector(
      "#multipleDescription"
    );
    this.multipleStartTime = this.parent.querySelector("#multipleStartTime");
    this.multipleEndTime = this.parent.querySelector("#multipleEndTime");

    this.currentDate = new Date();

    this.openModal = this.openModal.bind(this);
    this.editingAppointment = this.editingAppointment?.bind(this);

    this.addEventListeners();
    this.getConfiguration();
    this.getSchedules();
    document.addEventListener("DOMContentLoaded", () => {
      const startTimeSelect = this.parent.querySelector("#startTime");
      const endTimeSelect = this.parent.querySelector("#endTime");
      const multipleStartTimeSelect =
        this.parent.querySelector("#multipleStartTime");
      const multipleEndTimeSelect =
        this.parent.querySelector("#multipleEndTime");
      this.populateSelect(startTimeSelect, this.timeOptions);
      this.populateSelect(endTimeSelect, this.timeOptions);
      this.populateSelect(multipleStartTimeSelect, this.timeOptions);
      this.populateSelect(multipleEndTimeSelect, this.timeOptions);
      this.getSchedules();
      const createAppointmentBtn = this.parent.querySelector(
        "#createAppointmentBtn"
      );
      createAppointmentBtn.addEventListener("click", (event) =>
        this.createSingleAppointment(event)
      );
      const createMultipleAppointmentBtn = this.parent.querySelector(
        "#createMultipleAppointmentBtn"
      );
      createMultipleAppointmentBtn.addEventListener("click", (event) =>
        this.createMultipleAppointment(event)
      );
      this.monthBtn.addEventListener("click", () => {
        this.currentView = "month";
        this.renderMonthView();
        this.selectedDates = [];
      });

      this.weekBtn.addEventListener("click", () => {
        this.currentView = "week";
        this.renderWeekView();
        this.selectedDates = [];
      });

      this.dayBtn.addEventListener("click", () => {
        this.currentView = "day";
        this.renderDayView();
        this.selectedDates = [];
      });

      const calendarCells = this.parent.querySelectorAll(".calendar-cell");
      calendarCells.forEach((cell) => {
        cell.addEventListener("click", (event) => {
          console.log("this");
          this.openModal("00:00", "23:30", new Date(year, month, day));
        });
      });
    });
  }
  addEventListeners() {
    this.addEmailBtn.addEventListener("click", this.addEmailInput.bind(this));
    this.addMultipleEmailBtn.addEventListener("click", () =>
      this.addEmailInputField(this.multipleEmailsContainer)
    );

    this.closeModal.onclick = this.closeAppointmentModal.bind(this);
    this.closeMultipleModal.onclick =
      this.closeMultipleAppointmentsModal.bind(this);
    window.onclick = (event) => {
      if (event.target == this.modal) {
        this.closeAppointmentModal();
      } else if (event.target == this.multipleAppointmentsModal) {
        this.closeMultipleAppointmentsModal();
      }
    };
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
  }
  openModal(startTimeValue, endTimeValue, date) {
    console.log("check", date);
    this.appointmentHeader.textContent = "Create Appointment";
    this.appointmentButton.textContent = "Create";
    this.startTime.value = startTimeValue;
    this.endTime.value = endTimeValue;
    this.startDate.value = this.fromDateToString(date);
    this.endDate.value = this.fromDateToString(date);
    this.addEmailInput();
    this.modal.style.display = "block";
    console.log("Open Clicked");
  }
  openMultipleModal() {
    if (this.selectedDates.length > 0) {
      this.multipleAppointmentName.value = "";
      this.multipleDescription.value = "";
      this.multipleEmailsContainer.innerHTML = "";
      this.selectedDatesContainer.innerHTML = this.selectedDates.join(", ");
      this.multipleStartTime.value = "00:00";
      this.multipleEndTime.value = "23:30";
      this.addEmailInputField(this.multipleEmailsContainer);
      this.multipleAppointmentsModal.style.display = "block";
    } else {
      alert("Select some dates before proceeding");
    }
  }
  openEditModal(appointment, event) {
    // clearValidationErrors();
    this.appointmentHeader.textContent = "Edit Appointment";
    this.appointmentButton.textContent = "Update";
    this.editingAppointment = appointment;
    this.appointmentName.value = appointment.title;
    this.startDate.value = appointment.startDate;
    this.endDate.value = appointment.endDate;
    this.startTime.value = appointment.startTime;
    this.endTime.value = appointment.endTime;
    this.description.value = appointment.description;
    this.emailsContainer.innerHTML = "";
    this.deleteAppointmentBtn.style.opacity = "1";
    // Populate emails
    ["test@yopmail.com"].forEach((email) => {
      const emailInputGroup = document.createElement("div");
      emailInputGroup.classList.add("email-input-group");
      const emailInput = document.createElement("input");
      emailInput.classList.add("form-control");
      emailInput.type = "email";
      emailInput.name = "emails";
      emailInput.value = email;
      emailInput.required = true;
      const removeEmailBtn = document.createElement("button");
      removeEmailBtn.type = "button";
      removeEmailBtn.classList.add("remove-email-btn");
      removeEmailBtn.textContent = "X";
      removeEmailBtn.addEventListener("click", (event) =>
        this.removeEmailInput(event)
      );
      emailInputGroup.appendChild(emailInput);
      emailInputGroup.appendChild(removeEmailBtn);
      emailsContainer.appendChild(emailInputGroup);
    });
    this.deleteAppointmentBtn.addEventListener("click", (event) =>
      this.deleteAppointment(appointment)
    );
    this.modal.style.display = "block";
  }
  removeEmailInput(event) {
    const emailInputGroup = event.target.this.parentNode;
    this.emailsContainer.removeChild(emailInputGroup);
    event.stopPropagation();
  }
  removeMultipleEmailInput(event) {
    const emailInputGroup = event.target.this.parentNode;
    this.multipleEmailsContainer.removeChild(emailInputGroup);
    event.stopPropagation();
  }
  closeAppointmentModal() {
    this.modal.style.display = "none";
    this.appointmentName.value = "";
    this.description.value = "";
    this.emailsContainer.innerHTML = "";
    this.startTime.value = "00:00";
    this.endTime.value = "21:30";
    const deleteButton = this.parent.querySelector("#deleteAppointmentBtn");
    this.editingAppointment = null;
    deleteButton.style.opacity = "0";
  }
  closeMultipleAppointmentsModal() {
    this.multipleAppointmentsModal.style.display = "none";
    this.multipleAppointmentName.value = "";
    this.multipleDescription.value = "";
    this.multipleEmailsContainer.innerHTML = "";
    this.selectedDatesContainer.innerHTML = "";
  }
  addEmailInput() {
    const emailInputGroup = document.createElement("div");
    emailInputGroup.classList.add("email-input-group");

    const emailInput = document.createElement("input");
    emailInput.classList.add("form-control");
    emailInput.type = "email";
    emailInput.name = "emails";
    emailInput.required = true;

    const removeEmailBtn = document.createElement("button");
    removeEmailBtn.type = "button";
    removeEmailBtn.classList.add("remove-email-btn");
    removeEmailBtn.textContent = "X";
    removeEmailBtn.addEventListener("click", (event) =>
      this.removeEmailInput(event)
    );

    emailInputGroup.appendChild(emailInput);
    emailInputGroup.appendChild(removeEmailBtn);
    this.emailsContainer.appendChild(emailInputGroup);
    console.log(this.emailsContainer);
  }
  addEmailInputField(container) {
    const emailInputGroup = document.createElement("div");
    emailInputGroup.classList.add("email-input-group");

    const emailInput = document.createElement("input");
    emailInput.classList.add("form-control");
    emailInput.type = "email";
    emailInput.name = "emails";
    emailInput.required = true;

    const removeEmailBtn = document.createElement("button");
    removeEmailBtn.type = "button";
    removeEmailBtn.classList.add("remove-email-btn");
    removeEmailBtn.textContent = "X";
    removeEmailBtn.addEventListener("click", (event) =>
      this.removeMultipleEmailInput(event)
    );

    emailInputGroup.appendChild(emailInput);
    emailInputGroup.appendChild(removeEmailBtn);
    container.appendChild(emailInputGroup);
  }
  // Function to clear all validation errors
  clearValidationErrors() {
    const errorElements = this.parent.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = ""));
  }
  displayValidationErrors(errors) {
    Object.keys(errors).forEach((key) => {
      const errorElement = this.parent.querySelector(`#${key}Error`);
      if (errorElement) {
        errorElement.textContent = errors[key];
      }
    });
  }
  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    let isCheckboxEnabled = this.config?.showDateSelection;
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Create an array of days for the month
    const days = [];
    let dayCount = 1;
    for (let i = 0; i < 5; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push("");
        } else if (dayCount > lastDay) {
          week.push("");
        } else {
          week.push(dayCount);
          dayCount++;
        }
      }
      days.push(week);
    }
    let html = `<h2>${this.getMonthName(month)} ${year}</h2>`;
    html += "<table>";
    html += `<tr> ${
      this.config?.showWeekSelection ? "<th></th>" : ""
    }<th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;
    for (const [weekIndex, week] of days.entries()) {
      html += "<tr>";

      if (this.config?.showWeekSelection) {
        html += `<td><input type="checkbox" class="week-checkbox" data-week="${weekIndex}"></td>`;
      }

      for (const day of week) {
        const dayDate = day ? new Date(year, month, day) : null;
        const formattedDate = dayDate ? this.fromDateToString(dayDate) : "";
        const dayAppointments = day
          ? this.appointments.filter(
              (appointment) => appointment.startDate === formattedDate
            )
          : [];

        html += `<td class="calendar-cell"><div class="day-cell">${day || ""}${
          isCheckboxEnabled
            ? `<input type="checkbox" class="date-checkbox" data-date="${formattedDate}" ${
                !day ? "disabled" : ""
              }>`
            : ""
        }</div>`;

        if (dayAppointments.length > 0) {
          html += `<div class="day">`;
          dayAppointments.forEach((appointment) => {
            html += `<span class="month-appointment" data-appointment='${JSON.stringify(
              appointment
            )}'>${appointment.title}</span>`;
          });
          html += `</div>`;
        } else {
          html += `<div class="day"></div>`;
        }
        html += `</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    html +=
      '<div class="create-appointments-wrapper"><button class="create-appointments-btn">Create Appointments</button></div>';
    // html +=
    this.calendarDiv.innerHTML = html;
    this.bindDynamicEventListeners();
  }

  renderWeekView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const day = this.currentDate.getDate();
    const weekDay = this.currentDate.getDay();
    let isCheckboxEnabled = this.config?.showDateSelection;

    // Get the start and end dates of the current week
    const startDate = new Date(year, month, day - weekDay);
    const endDate = new Date(year, month, day - weekDay + 6);

    // Render the week view
    let html = `<h2>${startDate.toDateString()} - ${endDate.toDateString()}</h2>`;
    html += "<table>";

    html += `<tr>${
      this.config?.showWeekSelection ? "<th></th>" : ""
    }<th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;
    html += "<tr>";

    if (this.config?.showWeekSelection) {
      html += `<td><input type="checkbox" class="single-week-checkbox"></td>`;
    }

    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day - weekDay + i);
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const dayAppointments = this.appointments.filter(
        (appointment) => appointment.startDate === dateString
      );

      html += `<td class="calendar-cell"><div class="day-cell" data-date="${dateString}">${
        date.getDate() || ""
      }${
        isCheckboxEnabled
          ? `<input type="checkbox" class="date-checkbox" data-date="${dateString}" ${
              !day ? "disabled" : ""
            }>`
          : ""
      }</div>`;

      if (dayAppointments.length > 0) {
        html += `<div class="day">`;
        dayAppointments.forEach((appointment) => {
          html += `<span class="month-appointment" data-appointment='${JSON.stringify(
            appointment
          )}'>${appointment.title}</span>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="day"></div>`;
      }
      html += `</td>`;
    }

    html += "</tr>";
    html += "</table>";
    html +=
      '<div class="create-appointments-wrapper"><button class="create-appointments-btn" id="createAppointmentsBtn">Create Appointments</button><div>';
    this.calendarDiv.innerHTML = html;

    this.bindDynamicEventListeners();
  }

  renderDayView() {
    // Render the day view
    let html = `<h2>${this.currentDate.toDateString()}</h2>`;
    html += "<table>";
    html += `<tr><th>Time</th><th>Event</th></tr>`;

    for (let i = 0; i < 48; i++) {
      const hour = Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const nextHour = hour + (minute === 30 ? 1 : 0);
      const nextMinute = minute === 30 ? "00" : "30";
      const nextTime = `${nextHour.toString().padStart(2, "0")}:${nextMinute}`;
      const appointment = this.appointments.find(
        (app) =>
          app.startTime === time &&
          app.startDate === this.fromDateToString(this.currentDate)
      );

      const heightStyle = appointment
        ? `style="height: ${this.getAppointmentHeight(
            appointment
          )}px; border: 1px solid black;"`
        : "";
      const eventName = appointment ? appointment.title : "";
      html += `<tr><td>${time}</td><td class="day-row" data-time="${time}" data-next-time="${nextTime}" data-date="${
        this.currentDate
      }">
               <div class="day-appointment" ${heightStyle} data-appointment='${JSON.stringify(
        appointment
      )}'>${eventName}</div>
             </td></tr>`;
    }

    html += "</table>";
    this.calendarDiv.innerHTML = html;
    this.bindDynamicEventListeners();
  }
  createSingleAppointment(event) {
    event.preventDefault();
    this.clearValidationErrors();
    const emails = Array.from(
      this.emailsContainer.querySelectorAll("input[name='emails']")
    ).map((input) => input.value);
    const appointmentData = {
      title: this.appointmentName.value,
      emails: emails.toString(),
      startTime: this.startTime.value,
      endTime: this.endTime.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      description: this.description.value,
      status: "booked",
    };

    const validationErrors = this.validateForm(appointmentData);
    if (Object.keys(validationErrors).length > 0) {
      this.displayValidationErrors(validationErrors);
      return;
    }

    if (this.editingAppointment) {
      const canUpdate = this.canUpdateAppointment({
        ...appointmentData,
        id: this.editingAppointment.id,
      });
      if (canUpdate) {
        const index = this.appointments.findIndex(
          (app) => app.id === this.editingAppointment.id
        );
        if (index !== -1) {
          this.updateSchedule(
            JSON.stringify(appointmentData),
            this.editingAppointment.id
          ).then((response) => {
            if (response) {
              this.appointments[index] = {
                ...appointmentData,
                id: this.editingAppointment.id,
              };
              this.editingAppointment = null;
              this.refreshView();
            }
          });
        }
      } else {
        alert("Cannot update the appointment due to an overlap.");
        return;
      }
    } else {
      if (this.canScheduleAppointment(appointmentData)) {
        this.addSchedule(JSON.stringify(appointmentData));
      } else {
        alert("Cannot schedule the appointment due to an overlap.");
        return;
      }
    }
    this.refreshView();
    this.modal.style.display = "none";
    this.appointmentName.value = "";
    this.description.value = "";
    this.emailsContainer.innerHTML = "";
  }
  createMultipleAppointment(event) {
    console.log("in multiple appointment");
    event.preventDefault();
    this.clearValidationErrors();
    const emails = Array.from(
      this.multipleEmailsContainer.querySelectorAll("input[name='emails']")
    ).map((input) => input.value);

    const newAppointments = this.selectedDates.map((date) => ({
      title: this.multipleAppointmentName.value,
      email: emails,
      description: this.multipleDescription.value,
      startTime: this.multipleStartTime.value,
      endTime: this.multipleEndTime.value,
      startDate: date,
      endDate: date,
      status: "booked",
    }));

    const validationErrors = this.validateMultipleForm(newAppointments[0]);
    if (Object.keys(validationErrors).length > 0) {
      this.displayValidationErrors(validationErrors);
      return;
    }

    for (const appointment of newAppointments) {
      if (!this.canScheduleAppointment(appointment)) {
        alert("Cannot schedule the appointment due to an overlap.");
        return;
      }
    }

    newAppointments.forEach((appointment) => {
      this.addSchedule(JSON.stringify(appointment));
    });
    this.closeMultipleAppointmentsModal();
    this.refreshView();
  }
  deleteAppointment(appointment) {
    this.deleteSchedule(appointment);
  }
  prev() {
    if (this.currentView === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.renderDayView();
    }
    this.selectedDates = [];
  }

  next() {
    if (this.currentView === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.renderDayView();
    }
    this.selectedDates = [];
  }
  editAppointmentClick(event, appointment) {
    this.openEditModal(appointment, event);
    event.stopPropagation();
  }
  fromDateToString(dateValue) {
    let date = new Date(dateValue);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    let dateAsString = date.toISOString().substr(0, 10);
    return dateAsString;
  }
  validateForm(appointmentData) {
    const errors = {};

    if (!appointmentData.title.trim()) {
      errors.appointmentName = "Appointment name is required.";
    }

    if (!appointmentData.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!appointmentData.startTime) {
      errors.startTime = "Start time is required.";
    }

    if (!appointmentData.endDate) {
      errors.endDate = "End date is required.";
    }

    if (!appointmentData.endTime) {
      errors.endTime = "End time is required.";
    }
    if (
      new Date(appointmentData.endDate + " " + appointmentData.endTime) <=
      new Date(appointmentData.startDate + " " + appointmentData.startTime)
    ) {
      errors.endTime = "End date and time must be after start date and time.";
    }

    // if (!appointmentData.emails.every(email => /\S+@\S+\.\S+/.test(email))) {
    //   errors.emails = 'Please provide valid email addresses.';
    // }
    return errors;
  }
  validateMultipleForm(appointmentData) {
    const errors = {};

    if (!appointmentData.title.trim()) {
      errors.multipleAppointmentName = "Appointment name is required.";
    }

    if (!appointmentData.startTime) {
      errors.multipleStartTime = "Start time is required.";
    }

    if (!appointmentData.endTime) {
      errors.multipleEndTime = "End time is required.";
    }

    if (
      new Date(appointmentData.endDate + " " + appointmentData.endTime) <=
      new Date(appointmentData.startDate + " " + appointmentData.startTime)
    ) {
      errors.multipleEndTime =
        "End date and time must be after start date and time.";
    }

    return errors;
  }
  getAppointmentHeight(appointment) {
    const startTime = appointment.startTime;
    const endTime = appointment.endTime;
    const startDate = new Date(`2024-01-01 ${startTime}`);
    const endDate = new Date(`2024-01-01 ${endTime}`);
    const differenceMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceHours = differenceMilliseconds / (1000 * 60 * 60);
    return differenceHours * 84.8;
  }
  parseDateTime(dateString, timeString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  doTimesOverlap(
    newStartDateTime,
    newEndDateTime,
    existingStartDateTime,
    existingEndDateTime
  ) {
    return (
      (newStartDateTime >= existingStartDateTime &&
        newStartDateTime < existingEndDateTime) ||
      (newEndDateTime > existingStartDateTime &&
        newEndDateTime <= existingEndDateTime) ||
      (newStartDateTime <= existingStartDateTime &&
        newEndDateTime >= existingEndDateTime)
    );
  }
  canScheduleAppointment(newAppointment) {
    const newStartDateTime = this.parseDateTime(
      newAppointment.startDate,
      newAppointment.startTime
    );
    const newEndDateTime = this.parseDateTime(
      newAppointment.endDate,
      newAppointment.endTime
    );

    for (const existingAppointment of this.appointments) {
      const existingStartDateTime = this.parseDateTime(
        existingAppointment.startDate,
        existingAppointment.startTime
      );
      const existingEndDateTime = this.parseDateTime(
        existingAppointment.endDate,
        existingAppointment.endTime
      );

      if (
        this.doTimesOverlap(
          newStartDateTime,
          newEndDateTime,
          existingStartDateTime,
          existingEndDateTime
        )
      ) {
        return false;
      }
    }

    return true;
  }
  canUpdateAppointment(updatedAppointment) {
    const updatedStartDateTime = this.parseDateTime(
      updatedAppointment.startDate,
      updatedAppointment.startTime
    );
    const updatedEndDateTime = this.parseDateTime(
      updatedAppointment.endDate,
      updatedAppointment.endTime
    );

    for (const existingAppointment of this.appointments) {
      if (existingAppointment.id === updatedAppointment.id) {
        continue; // Skip the appointment being updated
      }

      const existingStartDateTime = this.parseDateTime(
        existingAppointment.startDate,
        existingAppointment.startTime
      );
      const existingEndDateTime = this.parseDateTime(
        existingAppointment.endDate,
        existingAppointment.endTime
      );

      if (
        this.doTimesOverlap(
          updatedStartDateTime,
          updatedEndDateTime,
          existingStartDateTime,
          existingEndDateTime
        )
      ) {
        return false;
      }
    }
    return true;
  }
  getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }
  renderInitialView(allowedCalendarViews) {
    if (
      allowedCalendarViews.includes("MonthView") &&
      allowedCalendarViews.includes("WeekView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    if (
      allowedCalendarViews.includes("WeekView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderWeekView();
      this.currentView = "week";
      return;
    }
    if (
      allowedCalendarViews.includes("MonthView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderDayView();
      this.currentView = "day";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("WeekView")
    ) {
      this.renderWeekView();
      this.currentView = "week";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("MonthView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    console.error("No valid calendar views allowed.");
  }
  refreshView() {
    if (this.currentView === "month") {
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.renderDayView();
    }
  }
  normalizeDate(date) {
    return date.split("T")[0];
  }
  generateTimeOptions() {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = `${this.padNumber(hour)}:${this.padNumber(minutes)}`;
        timeOptions.push(time);
      }
    }
    return timeOptions;
  }

  populateSelect(selectElement, options) {
    options?.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }
  padNumber(num) {
    return num.toString().padStart(2, "0");
  }
  handleClick(event) {
    event.stopPropagation();
  }
  toggleDateSelection(formattedDate) {
    const dateCheckbox = this.parent.querySelector(
      `input.date-checkbox[data-date="${formattedDate}"]`
    );
    const isChecked = dateCheckbox.checked;

    if (isChecked) {
      this.selectedDates.push(formattedDate);
    } else {
      const index = this.selectedDates.indexOf(formattedDate);
      if (index !== -1) {
        this.selectedDates.splice(index, 1);
      }
    }

    console.log("Selected Dates:", this.selectedDates);
  }

  //WEEK SELECTION
  toggleWeekSelection(weekIndex) {
    const weekCheckbox = this.parent.querySelector(
      `.week-checkbox[data-week="${weekIndex}"]`
    );
    const isChecked = weekCheckbox.checked;
    const weekDays = this.parent.querySelectorAll(
      `tr:nth-child(${weekIndex + 2}) td:not(:first-child) .date-checkbox`
    );

    weekDays.forEach((dayCheckbox) => {
      const date = dayCheckbox.dataset.date;
      if (isChecked) {
        if (!this.selectedDates.includes(date) && date) {
          this.selectedDates.push(date);
        }
      } else {
        const index = this.selectedDates.indexOf(date);
        if (index !== -1) {
          this.selectedDates.splice(index, 1);
        }
      }
      dayCheckbox.checked = isChecked;
    });
  }
  toggleSingleWeek(checkbox) {
    const isChecked = checkbox.checked;
    const dateCheckboxes = this.parent.querySelectorAll(".date-checkbox");

    dateCheckboxes.forEach((dateCheckbox) => {
      const date = dateCheckbox.dataset.date;
      if (isChecked) {
        if (!this.selectedDates.includes(date) && date) {
          this.selectedDates.push(date);
        }
      } else {
        const index = this.selectedDates.indexOf(date);
        if (index !== -1) {
          this.selectedDates.splice(index, 1);
        }
      }
      dateCheckbox.checked = isChecked;
    });
  }
  toggleCalendarViewButtons(allowedCalendarViews) {
    let views = allowedCalendarViews.split(",").map((view) => view.trim());
    this.renderInitialView(views);
    this.monthBtn.style.display = allowedCalendarViews.includes("MonthView")
      ? "inline-block"
      : "none";
    this.weekBtn.style.display = allowedCalendarViews.includes("WeekView")
      ? "inline-block"
      : "none";
    this.dayBtn.style.display = allowedCalendarViews.includes("DayView")
      ? "inline-block"
      : "none";
  }
  async addSchedule(appointment) {
    try {
      const response = await fetch(`${this.BASE_URL}calendar-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: appointment,
      });
      const data = await response.json();
      this.appointments.push({
        ...data,
        startDate: this.normalizeDate(data.startDate),
        endDate: this.normalizeDate(data.endDate),
      });
      this.refreshView();
    } catch (error) {
      alert(error);
    }
  }
  async updateSchedule(appointment, id) {
    try {
      const response = await fetch(`${this.BASE_URL}calendar-schedule/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: appointment,
      });
      return await response.json();
    } catch (error) {
      alert(error);
    }
  }
  async getConfiguration() {
    try {
      const response = await fetch(
        `${this.BASE_URL}calendar-scheduler/configuration/1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      this.config = data;
      this.toggleCalendarViewButtons(this.config.allowedCalendarViews);
      console.log(this.config);
    } catch (error) {
      alert(error);
    }
  }
  async getSchedules() {
    try {
      const response = await fetch(`${this.BASE_URL}calendar-schedule`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let updatedAppointments = data.map((appt) => {
        return {
          ...appt,
          startDate: this.normalizeDate(appt.startDate),
          endDate: this.normalizeDate(appt.endDate),
        };
      });
      this.appointments = updatedAppointments;
      this.refreshView();
    } catch (error) {
      alert(error);
    }
  }
  async deleteSchedule(appointment) {
    try {
      const response = await fetch(
        `${this.BASE_URL}calendar-schedule/${appointment.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      this.appointments = this.appointments.filter(
        (a) => a.id !== appointment.id
      );
      this.refreshView();
      this.closeAppointmentModal();
    } catch (error) {
      alert(error);
    }
  }
  bindDynamicEventListeners() {
    this.calendarDiv.querySelectorAll(".calendar-cell").forEach((cell) => {
      cell.addEventListener("click", (event) => {
        const date =
          event.currentTarget.querySelector(".date-checkbox")?.dataset.date;
        if (date) {
          this.openModal("00:00", "23:30", new Date(date));
        }
      });
    });

    this.calendarDiv
      .querySelectorAll(".month-appointment")
      .forEach((appointmentEl) => {
        appointmentEl.addEventListener("click", (event) => {
          const appointment = JSON.parse(
            event.currentTarget.dataset.appointment
          );
          this.editAppointmentClick(event, appointment);
          event.stopPropagation();
        });
      });

    this.calendarDiv.querySelectorAll(".week-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        console.log("here");
        const weekIndex = event.currentTarget.dataset.week;
        console.log(weekIndex);
        this.toggleWeekSelection(+weekIndex);
      });
    });

    this.calendarDiv.querySelectorAll(".date-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const date = event.currentTarget.dataset.date;
        this.toggleDateSelection(date);
        event.stopPropagation();
        this.handleClick(event);
      });
    });

    this.calendarDiv.querySelectorAll(".date-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    this.calendarDiv
      .querySelectorAll(".single-week-checkbox")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          this.toggleSingleWeek(event.currentTarget);
        });
      });

    this.calendarDiv
      .querySelector(".create-appointments-btn")
      ?.addEventListener("click", () => {
        this.openMultipleModal();
      });

    // Event listeners for day view
    this.calendarDiv.querySelectorAll(".day-row").forEach((row) => {
      row.addEventListener("click", (event) => {
        const time = event.currentTarget.dataset.time;
        const nextTime = event.currentTarget.dataset.nextTime;
        const date = event.currentTarget.dataset.date;
        this.openModal(time, nextTime, new Date(date));
      });
    });

    this.calendarDiv
      .querySelectorAll(".day-appointment")
      .forEach((appointmentEl) => {
        appointmentEl.addEventListener("click", (event) => {
          event.stopPropagation();
          const appointment = JSON.parse(
            event.currentTarget.dataset.appointment
          );
          this.editAppointmentClick(event, appointment);
        });
      });
  }
}*/


class Calendar {
  constructor(id) {
    this.id = id;
    this.userId = 1;
    this.projectId = 131;
    this.parent = document.getElementById(id);
    this.BASE_URL = `https://lowcodedev.azurewebsites.net/api/${this.userId}/Project/${this.projectId}/`;
    this.config;
    // this.prevBtn = this.parent.querySelector("#prevBtn");
    // this.nextBtn = this.parent.querySelector("#nextBtn");
    // this.monthBtn = this.parent.querySelector("#monthBtn");
    // this.weekBtn = this.parent.querySelector("#weekBtn");
    this.dayBtn = this.parent.querySelector("#dayBtn");
    this.calendarDiv = this.parent.querySelector("#calendar");
    this.modal = this.parent.querySelector("#appointmentModal");
    this.closeModal = this.parent.querySelectorAll(".close")[0];
    this.appointmentHeader = this.parent.querySelector("#appointmentHeader");
    this.appointmentButton = this.parent.querySelector("#createAppointmentBtn");
    this.appointmentName = this.parent.querySelector("#appointmentName");
    this.email = this.parent.querySelector("#email");
    this.description = this.parent.querySelector("#description");
    this.startTime = this.parent.querySelector("#startTime");
    this.endTime = this.parent.querySelector("#endTime");
    this.startDate = this.parent.querySelector("#startDate");
    this.endDate = this.parent.querySelector("#endDate");
    this.appointmentForm = this.parent.querySelector("form");
    this.emailsContainer = this.parent.querySelector("#emailsContainer");
    this.multipleEmailsContainer = this.parent.querySelector(
      "#multipleEmailsContainer"
    );
    this.addEmailBtn = this.parent.querySelector("#addEmailBtn");
    this.deleteAppointmentBtn = this.parent.querySelector(
      "#deleteAppointmentBtn"
    );
    this.selectedDates = [];
    this.appointments = [];
    this.currentView = "day";
    this.timeOptions = this.generateTimeOptions();
    this.editingAppointment = null;

    this.multipleAppointmentsModal = this.parent.querySelector(
      "#multipleAppointmentsModal"
    );
    this.closeMultipleModal = this.parent.querySelectorAll(".close")[1];
    this.multipleAppointmentName = this.parent.querySelector(
      "#multipleAppointmentName"
    );
    this.multipleEmailsContainer = this.parent.querySelector(
      "#multipleEmailsContainer"
    );
    this.addMultipleEmailBtn = this.parent.querySelector(
      "#addMultipleEmailBtn"
    );
    this.selectedDatesContainer = this.parent.querySelector(
      "#selectedDatesContainer"
    );
    this.multipleDescription = this.parent.querySelector(
      "#multipleDescription"
    );
    this.multipleStartTime = this.parent.querySelector("#multipleStartTime");
    this.multipleEndTime = this.parent.querySelector("#multipleEndTime");

    this.currentDate = new Date();

    this.openModal = this.openModal.bind(this);
    this.editingAppointment = this.editingAppointment?.bind(this);

    this.addEventListeners();
    // this.getConfiguration();
    this.getSchedules();
    document.addEventListener("DOMContentLoaded", () => {
      const startTimeSelect = this.parent.querySelector("#startTime");
      const endTimeSelect = this.parent.querySelector("#endTime");
      const multipleStartTimeSelect =
        this.parent.querySelector("#multipleStartTime");
      const multipleEndTimeSelect =
        this.parent.querySelector("#multipleEndTime");
      this.populateSelect(startTimeSelect, this.timeOptions);
      this.populateSelect(endTimeSelect, this.timeOptions);
      this.populateSelect(multipleStartTimeSelect, this.timeOptions);
      this.populateSelect(multipleEndTimeSelect, this.timeOptions);
      this.getSchedules();
      const createAppointmentBtn = this.parent.querySelector(
        "#createAppointmentBtn"
      );
      createAppointmentBtn.addEventListener("click", (event) =>
        this.createSingleAppointment(event)
      );
      const createMultipleAppointmentBtn = this.parent.querySelector(
        "#createMultipleAppointmentBtn"
      );
      createMultipleAppointmentBtn.addEventListener("click", (event) =>
        this.createMultipleAppointment(event)
      );
      // this.monthBtn.addEventListener("click", () => {
      //   this.currentView = "month";
      //   this.renderMonthView();
      //   this.selectedDates = [];
      // });

      // this.weekBtn.addEventListener("click", () => {
      //   this.currentView = "week";
      //   this.renderWeekView();
      //   this.selectedDates = [];
      // });

      this.dayBtn.addEventListener("click", () => {
        this.currentView = "day";
        this.renderDayView();
        this.selectedDates = [];
      });

      const calendarCells = this.parent.querySelectorAll(".calendar-cell");
      calendarCells.forEach((cell) => {
        cell.addEventListener("click", (event) => {
          console.log("this");
          this.openModal("00:00", "23:30", new Date(year, month, day));
        });
      });
    });
  }
  addEventListeners() {
    this.addEmailBtn.addEventListener("click", this.addEmailInput.bind(this));
    this.addMultipleEmailBtn.addEventListener("click", () =>
      this.addEmailInputField(this.multipleEmailsContainer)
    );

    this.closeModal.onclick = this.closeAppointmentModal.bind(this);
    this.closeMultipleModal.onclick =
      this.closeMultipleAppointmentsModal.bind(this);
    window.onclick = (event) => {
      if (event.target == this.modal) {
        this.closeAppointmentModal();
      } else if (event.target == this.multipleAppointmentsModal) {
        this.closeMultipleAppointmentsModal();
      }
    };
    // this.prevBtn.addEventListener("click", this.prev.bind(this));
    // this.nextBtn.addEventListener("click", this.next.bind(this));
  }

  openModal(startTimeValue, endTimeValue, date) {
    console.log("check", date);
    this.appointmentHeader.textContent = "Create Appointment";
    this.appointmentButton.textContent = "Create";
    this.startTime.value = startTimeValue;
    this.endTime.value = endTimeValue;
    this.startDate.value = this.fromDateToString(date);
    this.endDate.value = this.fromDateToString(date);
    this.addEmailInput();
    this.modal.style.display = "block";
    console.log("Open Clicked");
  }

  openMultipleModal() {
    if (this.selectedDates.length > 0) {
      this.multipleAppointmentName.value = "";
      this.multipleDescription.value = "";
      this.multipleEmailsContainer.innerHTML = "";
      this.selectedDatesContainer.innerHTML = this.selectedDates.join(", ");
      this.multipleStartTime.value = "00:00";
      this.multipleEndTime.value = "23:30";
      this.addEmailInputField(this.multipleEmailsContainer);
      this.multipleAppointmentsModal.style.display = "block";
    } else {
      alert("Select some dates before proceeding");
    }
  }

  openEditModal(appointment, event) {
    // clearValidationErrors();
    this.appointmentHeader.textContent = "Edit Appointment";
    this.appointmentButton.textContent = "Update";
    this.editingAppointment = appointment;
    this.appointmentName.value = appointment.title;
    this.startDate.value = appointment.startDate;
    this.endDate.value = appointment.endDate;
    this.startTime.value = appointment.startTime;
    this.endTime.value = appointment.endTime;
    this.description.value = appointment.description;
    this.emailsContainer.innerHTML = "";
    this.deleteAppointmentBtn.style.opacity = "1";
    // Populate emails
    ["test@yopmail.com"].forEach((email) => {
      const emailInputGroup = document.createElement("div");
      emailInputGroup.classList.add("email-input-group");
      const emailInput = document.createElement("input");
      emailInput.classList.add("form-control");
      emailInput.type = "email";
      emailInput.name = "emails";
      emailInput.value = email;
      emailInput.required = true;
      const removeEmailBtn = document.createElement("button");
      removeEmailBtn.type = "button";
      removeEmailBtn.classList.add("remove-email-btn");
      removeEmailBtn.textContent = "X";
      removeEmailBtn.addEventListener("click", (event) =>
        this.removeEmailInput(event)
      );
      emailInputGroup.appendChild(emailInput);
      emailInputGroup.appendChild(removeEmailBtn);
      emailsContainer.appendChild(emailInputGroup);
    });
    this.deleteAppointmentBtn.addEventListener("click", (event) =>
      this.deleteAppointment(appointment)
    );
    this.modal.style.display = "block";
  }

  removeEmailInput(event) {
    console.log(event.target.this, "this is the email remove input!!!");
    const emailInputGroup = event.target.this.parentNode;
    this.emailsContainer.removeChild(emailInputGroup);
    event.stopPropagation();
  }

  removeMultipleEmailInput(event) {
    const emailInputGroup = event.target.this.parentNode;
    this.multipleEmailsContainer.removeChild(emailInputGroup);
    event.stopPropagation();
  }

  closeAppointmentModal() {
    this.modal.style.display = "none";
    this.appointmentName.value = "";
    this.description.value = "";
    this.emailsContainer.innerHTML = "";
    this.startTime.value = "00:00";
    this.endTime.value = "21:30";
    const deleteButton = this.parent.querySelector("#deleteAppointmentBtn");
    this.editingAppointment = null;
    deleteButton.style.opacity = "0";
  }

  closeMultipleAppointmentsModal() {
    this.multipleAppointmentsModal.style.display = "none";
    this.multipleAppointmentName.value = "";
    this.multipleDescription.value = "";
    this.multipleEmailsContainer.innerHTML = "";
    this.selectedDatesContainer.innerHTML = "";
  }

  addEmailInput() {
    const emailInputGroup = document.createElement("div");
    emailInputGroup.classList.add("email-input-group");

    const emailInput = document.createElement("input");
    emailInput.classList.add("form-control");
    emailInput.type = "email";
    emailInput.name = "emails";
    emailInput.required = true;

    const removeEmailBtn = document.createElement("button");
    removeEmailBtn.type = "button";
    removeEmailBtn.classList.add("remove-email-btn");
    removeEmailBtn.textContent = "X";
    removeEmailBtn.addEventListener("click", (event) =>
      this.removeEmailInput(event)
    );

    emailInputGroup.appendChild(emailInput);
    emailInputGroup.appendChild(removeEmailBtn);
    this.emailsContainer.appendChild(emailInputGroup);
    console.log(this.emailsContainer);
  }

  addEmailInputField(container) {
    const emailInputGroup = document.createElement("div");
    emailInputGroup.classList.add("email-input-group");

    const emailInput = document.createElement("input");
    emailInput.classList.add("form-control");
    emailInput.type = "email";
    emailInput.name = "emails";
    emailInput.required = true;

    const removeEmailBtn = document.createElement("button");
    removeEmailBtn.type = "button";
    removeEmailBtn.classList.add("remove-email-btn");
    removeEmailBtn.textContent = "X";
    removeEmailBtn.addEventListener("click", (event) =>
      this.removeMultipleEmailInput(event)
    );

    emailInputGroup.appendChild(emailInput);
    emailInputGroup.appendChild(removeEmailBtn);
    container.appendChild(emailInputGroup);
  }
  // Function to clear all validation errors
  clearValidationErrors() {
    const errorElements = this.parent.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = ""));
  }
  displayValidationErrors(errors) {
    Object.keys(errors).forEach((key) => {
      const errorElement = this.parent.querySelector(`#${key}Error`);
      if (errorElement) {
        errorElement.textContent = errors[key];
      }
    });
  }
  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    let isCheckboxEnabled = this.config?.showDateSelection;
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Create an array of days for the month
    const days = [];
    let dayCount = 1;
    for (let i = 0; i < 5; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push("");
        } else if (dayCount > lastDay) {
          week.push("");
        } else {
          week.push(dayCount);
          dayCount++;
        }
      }
      days.push(week);
    }
    let html = `<h2>${this.getMonthName(month)} ${year}</h2>`;
    html += "<table>";
    html += `<tr> ${
      this.config?.showWeekSelection ? "<th></th>" : ""
    }<th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;
    for (const [weekIndex, week] of days.entries()) {
      html += "<tr>";

      if (this.config?.showWeekSelection) {
        html += `<td><input type="checkbox" class="week-checkbox" data-week="${weekIndex}"></td>`;
      }

      for (const day of week) {
        const dayDate = day ? new Date(year, month, day) : null;
        const formattedDate = dayDate ? this.fromDateToString(dayDate) : "";
        const dayAppointments = day
          ? this.appointments.filter(
              (appointment) => appointment.startDate === formattedDate
            )
          : [];

        html += `<td class="calendar-cell"><div class="day-cell">${day || ""}${
          isCheckboxEnabled
            ? `<input type="checkbox" class="date-checkbox" data-date="${formattedDate}" ${
                !day ? "disabled" : ""
              }>`
            : ""
        }</div>`;

        if (dayAppointments.length > 0) {
          html += `<div class="day">`;
          dayAppointments.forEach((appointment) => {
            html += `<span class="month-appointment" data-appointment='${JSON.stringify(
              appointment
            )}'>${appointment.title}</span>`;
          });
          html += `</div>`;
        } else {
          html += `<div class="day"></div>`;
        }
        html += `</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    html +=
      '<div class="create-appointments-wrapper"><button class="create-appointments-btn">Create Appointments</button></div>';
    // html +=
    this.calendarDiv.innerHTML = html;
    this.bindDynamicEventListeners();
  }

  renderWeekView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const day = this.currentDate.getDate();
    const weekDay = this.currentDate.getDay();
    let isCheckboxEnabled = this.config?.showDateSelection;

    // Get the start and end dates of the current week
    const startDate = new Date(year, month, day - weekDay);
    const endDate = new Date(year, month, day - weekDay + 6);

    // Render the week view
    let html = `<h2>${startDate.toDateString()} - ${endDate.toDateString()}</h2>`;
    html += "<table>";

    html += `<tr>${
      this.config?.showWeekSelection ? "<th></th>" : ""
    }<th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;
    html += "<tr>";

    if (this.config?.showWeekSelection) {
      html += `<td><input type="checkbox" class="single-week-checkbox"></td>`;
    }

    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day - weekDay + i);
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const dayAppointments = this.appointments.filter(
        (appointment) => appointment.startDate === dateString
      );

      html += `<td class="calendar-cell"><div class="day-cell" data-date="${dateString}">${
        date.getDate() || ""
      }${
        isCheckboxEnabled
          ? `<input type="checkbox" class="date-checkbox" data-date="${dateString}" ${
              !day ? "disabled" : ""
            }>`
          : ""
      }</div>`;

      if (dayAppointments.length > 0) {
        html += `<div class="day">`;
        dayAppointments.forEach((appointment) => {
          html += `<span class="month-appointment" data-appointment='${JSON.stringify(
            appointment
          )}'>${appointment.title}</span>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="day"></div>`;
      }
      html += `</td>`;
    }

    html += "</tr>";
    html += "</table>";
    html +=
      '<div class="create-appointments-wrapper"><button class="create-appointments-btn" id="createAppointmentsBtn">Create Appointments</button><div>';
    this.calendarDiv.innerHTML = html;

    this.bindDynamicEventListeners();
  }

  renderDayView() {
    // Render the day view
    let html = `<h2>${this.currentDate.toDateString()}</h2>`;
    html += "<table>";
    html += `<tr><th>Time</th><th>Event</th></tr>`;

    for (let i = 0; i < 48; i++) {
      const hour = Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const nextHour = hour + (minute === 30 ? 1 : 0);
      const nextMinute = minute === 30 ? "00" : "30";
      const nextTime = `${nextHour.toString().padStart(2, "0")}:${nextMinute}`;
      //console.log(this.appointments , "these are the appointments schedule indie the render day view!");
      console.log(time, "time inside the render day view");
      console.log(this.fromDateToString(this.currentDate), "format date!");
      const appointment = this.appointments.find(
        (app) =>
          this.isScheduleInSlot(app,time)
      );
      console.log(appointment, "inside the render day view appointment!!!");
      const heightStyle = appointment
        ? `style="height: ${this.getAppointmentHeight(
            appointment
          )}px; border: 1px solid black;"`
        : "";
      const eventName = appointment ? appointment.title : "";
      html += `<tr><td>${time}</td><td class="day-row" data-time="${time}" data-next-time="${nextTime}" data-date="${
        this.currentDate
      }">
               <div class="day-appointment" ${heightStyle} data-appointment='${JSON.stringify(
        appointment
      )}'>${eventName}</div>
             </td></tr>`;
    }

    html += "</table>";
    this.calendarDiv.innerHTML = html;
    this.bindDynamicEventListeners();
  }

  createSingleAppointment(event) {
    event.preventDefault();
    this.clearValidationErrors();
    const emails = Array.from(
      this.emailsContainer.querySelectorAll("input[name='emails']")
    ).map((input) => input.value);
    console.log(emails, "Emails inside inside create appointent!!!");
    const appointmentData = {
      title: this.appointmentName.value,
      emails: emails,
      startTime: this.startTime.value,
      endTime: this.endTime.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      description: this.description.value,
      status: "booked",
    };

    const validationErrors = this.validateForm(appointmentData);
    if (Object.keys(validationErrors).length > 0) {
      this.displayValidationErrors(validationErrors);
      return;
    }

    if (this.editingAppointment) {
      console.log("This is the Editing Appointment!!!");
      const canUpdate = this.canUpdateAppointment({
        ...appointmentData,
        id: this.editingAppointment.id,
      });
      if (canUpdate) {
        const index = this.appointments.findIndex(
          (app) => app.id === this.editingAppointment.id
        );
        console.log(canUpdate,"canUpdate!!!");
        if (index !== -1) {
          console.log(appointmentData, "Appointment Data!!!");
          var appointment = this.transformScheduleToBackendFormat(appointmentData);
          console.log(appointment, "appointment!!!");
          this.updateSchedule(
            appointment,
            this.editingAppointment.id
          ).then((response) => {
            if (response) {
              this.appointments[index] = {
                ...appointmentData,
                id: this.editingAppointment.id,
              };
              console.log(this.appointments[index], "Appointment Data Index!!!");
              this.editingAppointment = null;
              this.refreshView();
            }
          });
        }
      } else {
        alert("Cannot update the appointment due to an overlap.");
        return;
      }
    } else {
      if (this.canScheduleAppointment(appointmentData)) {
        const appointment = this.transformScheduleToBackendFormat(appointmentData)
        console.log(appointment);
        this.addSchedule(JSON.stringify(appointment));
      } else {
        alert("Cannot schedule the appointment due to an overlap.");
        return;
      }
    }
    this.refreshView();
    this.modal.style.display = "none";
    this.appointmentName.value = "";
    this.description.value = "";
    this.emailsContainer.innerHTML = "";
  }

  createMultipleAppointment(event) {
    console.log("in multiple appointment");
    event.preventDefault();
    this.clearValidationErrors();
    const emails = Array.from(
      this.multipleEmailsContainer.querySelectorAll("input[name='emails']")
    ).map((input) => input.value);

    const newAppointments = this.selectedDates.map((date) => ({
      title: this.multipleAppointmentName.value,
      email: emails,
      description: this.multipleDescription.value,
      startTime: this.multipleStartTime.value,
      endTime: this.multipleEndTime.value,
      startDate: date,
      endDate: date,
      status: "booked",
    }));

    const validationErrors = this.validateMultipleForm(newAppointments[0]);
    if (Object.keys(validationErrors).length > 0) {
      this.displayValidationErrors(validationErrors);
      return;
    }

    for (const appointment of newAppointments) {
      if (!this.canScheduleAppointment(appointment)) {
        alert("Cannot schedule the appointment due to an overlap.");
        return;
      }
    }

    newAppointments.forEach((appointment) => {
      this.addSchedule(JSON.stringify(appointment));
    });
    this.closeMultipleAppointmentsModal();
    this.refreshView();
  }

  deleteAppointment(appointment) {
    this.deleteSchedule(appointment);
  }

  prev() {
    if (this.currentView === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.renderDayView();
    }
    this.selectedDates = [];
  }

  next() {
    if (this.currentView === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.renderDayView();
    }
    this.selectedDates = [];
  }
  editAppointmentClick(event, appointment) {
    this.openEditModal(appointment, event);
    event.stopPropagation();
  }

  fromDateToString(dateValue) {
    let date = new Date(dateValue);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    let dateAsString = date.toISOString().substr(0, 10);
    return dateAsString;
  }
  
  validateForm(appointmentData) {
    const errors = {};

    if (!appointmentData.title.trim()) {
      errors.appointmentName = "Appointment name is required.";
    }

    if (!appointmentData.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!appointmentData.startTime) {
      errors.startTime = "Start time is required.";
    }

    if (!appointmentData.endDate) {
      errors.endDate = "End date is required.";
    }

    if (!appointmentData.endTime) {
      errors.endTime = "End time is required.";
    }
    if (
      new Date(appointmentData.endDate + " " + appointmentData.endTime) <=
      new Date(appointmentData.startDate + " " + appointmentData.startTime)
    ) {
      errors.endTime = "End date and time must be after start date and time.";
    }

    // if (!appointmentData.emails.every(email => /\S+@\S+\.\S+/.test(email))) {
    //   errors.emails = 'Please provide valid email addresses.';
    // }
    return errors;
  }

  validateMultipleForm(appointmentData) {
    const errors = {};

    if (!appointmentData.title.trim()) {
      errors.multipleAppointmentName = "Appointment name is required.";
    }

    if (!appointmentData.startTime) {
      errors.multipleStartTime = "Start time is required.";
    }

    if (!appointmentData.endTime) {
      errors.multipleEndTime = "End time is required.";
    }

    if (
      new Date(appointmentData.endDate + " " + appointmentData.endTime) <=
      new Date(appointmentData.startDate + " " + appointmentData.startTime)
    ) {
      errors.multipleEndTime =
        "End date and time must be after start date and time.";
    }

    return errors;
  }

  getAppointmentHeight(appointment) {
    const startTime = appointment.startTime;
    const endTime = appointment.endTime;
    const startDate = new Date(`2024-01-01 ${startTime}`);
    const endDate = new Date(`2024-01-01 ${endTime}`);
    const differenceMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceHours = differenceMilliseconds / (1000 * 60 * 60);
    return differenceHours * 84.8;
  }

  parseDateTime(dateString, timeString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  doTimesOverlap(
    newStartDateTime,
    newEndDateTime,
    existingStartDateTime,
    existingEndDateTime
  ) {
    return (
      (newStartDateTime >= existingStartDateTime &&
        newStartDateTime < existingEndDateTime) ||
      (newEndDateTime > existingStartDateTime &&
        newEndDateTime <= existingEndDateTime) ||
      (newStartDateTime <= existingStartDateTime &&
        newEndDateTime >= existingEndDateTime)
    );
  }

  canScheduleAppointment(newAppointment) {
    const newStartDateTime = this.parseDateTime(
      newAppointment.startDate,
      newAppointment.startTime
    );
    const newEndDateTime = this.parseDateTime(
      newAppointment.endDate,
      newAppointment.endTime
    );

    for (const existingAppointment of this.appointments) {
      const existingStartDateTime = this.parseDateTime(
        existingAppointment.startDate,
        existingAppointment.startTime
      );
      const existingEndDateTime = this.parseDateTime(
        existingAppointment.endDate,
        existingAppointment.endTime
      );

      if (
        this.doTimesOverlap(
          newStartDateTime,
          newEndDateTime,
          existingStartDateTime,
          existingEndDateTime
        )
      ) {
        return false;
      }
    }

    return true;
  }

  canUpdateAppointment(updatedAppointment) {
    const updatedStartDateTime = this.parseDateTime(
      updatedAppointment.startDate,
      updatedAppointment.startTime
    );
    const updatedEndDateTime = this.parseDateTime(
      updatedAppointment.endDate,
      updatedAppointment.endTime
    );

    for (const existingAppointment of this.appointments) {
      if (existingAppointment.id === updatedAppointment.id) {
        continue; // Skip the appointment being updated
      }

      const existingStartDateTime = this.parseDateTime(
        existingAppointment.startDate,
        existingAppointment.startTime
      );
      const existingEndDateTime = this.parseDateTime(
        existingAppointment.endDate,
        existingAppointment.endTime
      );

      if (
        this.doTimesOverlap(
          updatedStartDateTime,
          updatedEndDateTime,
          existingStartDateTime,
          existingEndDateTime
        )
      ) {
        return false;
      }
    }
    return true;
  }

  getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }

  renderInitialView(allowedCalendarViews) {
    if (
      allowedCalendarViews.includes("MonthView") &&
      allowedCalendarViews.includes("WeekView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    if (
      allowedCalendarViews.includes("WeekView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderWeekView();
      this.currentView = "week";
      return;
    }
    if (
      allowedCalendarViews.includes("MonthView") &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("DayView")
    ) {
      this.renderDayView();
      this.currentView = "day";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("WeekView")
    ) {
      this.renderWeekView();
      this.currentView = "week";
      return;
    }
    if (
      allowedCalendarViews.length === 1 &&
      allowedCalendarViews.includes("MonthView")
    ) {
      this.renderMonthView();
      this.currentView = "month";
      return;
    }
    console.error("No valid calendar views allowed.");
  }

  refreshView() {
    if (this.currentView === "month") {
      this.renderMonthView();
    } else if (this.currentView === "week") {
      this.renderWeekView();
    } else if (this.currentView === "day") {
      this.renderDayView();
    }
  }

  normalizeDate(date) {
    return date.split("T")[0];
  }

  generateTimeOptions() {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = `${this.padNumber(hour)}:${this.padNumber(minutes)}`;
        timeOptions.push(time);
      }
    }
    return timeOptions;
  }

  populateSelect(selectElement, options) {
    options?.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }

  padNumber(num) {
    return num.toString().padStart(2, "0");
  }

  handleClick(event) {
    event.stopPropagation();
  }

  toggleDateSelection(formattedDate) {
    const dateCheckbox = this.parent.querySelector(
      `input.date-checkbox[data-date="${formattedDate}"]`
    );
    const isChecked = dateCheckbox.checked;

    if (isChecked) {
      this.selectedDates.push(formattedDate);
    } else {
      const index = this.selectedDates.indexOf(formattedDate);
      if (index !== -1) {
        this.selectedDates.splice(index, 1);
      }
    }

    console.log("Selected Dates:", this.selectedDates);
  }

  //WEEK SELECTION
  toggleWeekSelection(weekIndex) {
    const weekCheckbox = this.parent.querySelector(
      `.week-checkbox[data-week="${weekIndex}"]`
    );
    const isChecked = weekCheckbox.checked;
    const weekDays = this.parent.querySelectorAll(
      `tr:nth-child(${weekIndex + 2}) td:not(:first-child) .date-checkbox`
    );

    weekDays.forEach((dayCheckbox) => {
      const date = dayCheckbox.dataset.date;
      if (isChecked) {
        if (!this.selectedDates.includes(date) && date) {
          this.selectedDates.push(date);
        }
      } else {
        const index = this.selectedDates.indexOf(date);
        if (index !== -1) {
          this.selectedDates.splice(index, 1);
        }
      }
      dayCheckbox.checked = isChecked;
    });
  }

  toggleSingleWeek(checkbox) {
    const isChecked = checkbox.checked;
    const dateCheckboxes = this.parent.querySelectorAll(".date-checkbox");

    dateCheckboxes.forEach((dateCheckbox) => {
      const date = dateCheckbox.dataset.date;
      if (isChecked) {
        if (!this.selectedDates.includes(date) && date) {
          this.selectedDates.push(date);
        }
      } else {
        const index = this.selectedDates.indexOf(date);
        if (index !== -1) {
          this.selectedDates.splice(index, 1);
        }
      }
      dateCheckbox.checked = isChecked;
    });
  }

  toggleCalendarViewButtons(allowedCalendarViews) {
    let views = allowedCalendarViews.split(",").map((view) => view.trim());
    this.renderInitialView(views);
    // this.monthBtn.style.display = allowedCalendarViews.includes("MonthView")
    //   ? "inline-block"
    //   : "none";
    // this.weekBtn.style.display = allowedCalendarViews.includes("WeekView")
    //   ? "inline-block"
    //   : "none";
    this.dayBtn.style.display = allowedCalendarViews.includes("DayView")
      ? "inline-block"
      : "none";
  }

  async addSchedule(appointment) {
    try {
      const response = await fetch(`${this.BASE_URL}Appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: appointment,
      });
      const data = await response.json();
      this.appointments.push(...this.transformResponse([data]))
      // this.appointments.push({
      //   ...data,
      //   startDate: this.normalizeDate(data.startDate),
      //   endDate: this.normalizeDate(data.endDate),
      // });
      this.refreshView();
    } catch (error) {
      alert(error);
    }
  }

  async updateSchedule(appointment, id) {
    try {
      const response = await fetch(`${this.BASE_URL}Appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment)
      });
      return await response.json();
    } catch (error) {
      alert(error);
    }
  }

  async getConfiguration() {
    try {
      const response = await fetch(
        `${this.BASE_URL}calendar-scheduler/configuration/1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      this.config = data;
      this.toggleCalendarViewButtons(this.config.allowedCalendarViews);
      console.log(this.config);
    } catch (error) {
      alert(error);
    }
  }

  async getSchedules() {
    try {
      const response = await fetch(`${this.BASE_URL}Appointment`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data, "data from the server!!!!");
      let transformedAppointment = this.transformResponse(data);
      console.log(transformedAppointment, "This is TransformedAppointment!!!");
      // let updatedAppointments = data.map((appt) => {
      //   return {
      //     ...appt,
      //     startDate: this.normalizeDate(appt.startDate),
      //     endDate: this.normalizeDate(appt.endDate),
      //   };
      // });
      this.appointments = [...transformedAppointment];
      console.log(this.appointments, "appointments inside the get schedule!!!");
      this.renderDayView();
    } catch (error) {
      alert(error);
    }
  }

  async deleteSchedule(appointment) {
    try {
      const response = await fetch(
        `${this.BASE_URL}Appointment/${appointment.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      this.appointments = this.appointments.filter(
        (a) => a.id !== appointment.id
      );
      this.refreshView();
      this.closeAppointmentModal();
    } catch (error) {
      alert(error);
    }
  }

  bindDynamicEventListeners() {
    this.calendarDiv.querySelectorAll(".calendar-cell").forEach((cell) => {
      cell.addEventListener("click", (event) => {
        const date =
          event.currentTarget.querySelector(".date-checkbox")?.dataset.date;
        if (date) {
          this.openModal("00:00", "23:30", new Date(date));
        }
      });
    });

    this.calendarDiv
      .querySelectorAll(".month-appointment")
      .forEach((appointmentEl) => {
        appointmentEl.addEventListener("click", (event) => {
          const appointment = JSON.parse(
            event.currentTarget.dataset.appointment
          );
          this.editAppointmentClick(event, appointment);
          event.stopPropagation();
        });
      });

    this.calendarDiv.querySelectorAll(".week-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        console.log("here");
        const weekIndex = event.currentTarget.dataset.week;
        console.log(weekIndex);
        this.toggleWeekSelection(+weekIndex);
      });
    });

    this.calendarDiv.querySelectorAll(".date-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const date = event.currentTarget.dataset.date;
        this.toggleDateSelection(date);
        event.stopPropagation();
        this.handleClick(event);
      });
    });

    this.calendarDiv.querySelectorAll(".date-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    this.calendarDiv
      .querySelectorAll(".single-week-checkbox")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          this.toggleSingleWeek(event.currentTarget);
        });
      });

    this.calendarDiv
      .querySelector(".create-appointments-btn")
      ?.addEventListener("click", () => {
        this.openMultipleModal();
      });

    // Event listeners for day view
    this.calendarDiv.querySelectorAll(".day-row").forEach((row) => {
      row.addEventListener("click", (event) => {
        const time = event.currentTarget.dataset.time;
        const nextTime = event.currentTarget.dataset.nextTime;
        const date = event.currentTarget.dataset.date;
        this.openModal(time, nextTime, new Date(date));
      });
    });

    this.calendarDiv
      .querySelectorAll(".day-appointment")
      .forEach((appointmentEl) => {
        appointmentEl.addEventListener("click", (event) => {
          event.stopPropagation();
          const appointment = JSON.parse(
            event.currentTarget.dataset.appointment
          );
          this.editAppointmentClick(event, appointment);
        });
      });
  }

  transformScheduleToBackendFormat(schedule){
    return {
        id: 0,
        title: schedule.title,
        description: schedule.description || "",
        startDateTimeUtc: new Date(`${schedule.startDate}T${schedule.startTime}:00.000Z`).toISOString(),
        endDateTimeUtc: new Date(`${schedule.endDate}T${schedule.endTime}:00.000Z`).toISOString(),
        emails: schedule.emails.map((email) => ({
            email: email
        })),
        status: "Booked",
    };
  }

  transformResponse(response) {
    return response.map(item => {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            startDate: item.startDateTimeUtc,
            startTime: item.startDateTimeUtc.substring(11, 16),
            endDate: item.endDateTimeUtc,
            endTime: item.endDateTimeUtc.substring(11, 16),
            emails: item.emails
        };
    });
}

isScheduleInSlot(schedule, slotTime) {
  const dates = this.getdateRange(new Date(schedule.startDate),new Date(schedule.endDate)); 
  console.log(dates, "dates inside getDateRange!!!");
  console.log( this.currentDate.toDateString(), "this is the currentDate!!!");
  console.log(schedule.startTime.split(":")[0],"check")
  if (dates.find(e => e.toDateString() === this.currentDate.toDateString())) {
    const appointmentStartTime = schedule.startTime;
    return slotTime.startsWith(appointmentStartTime);
  } 
    return false; 
}

getdateRange(start, end) {
  const arr = [];
  for(const dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
}

}



    
        const calendar318 = new Calendar("calendar318");
    
