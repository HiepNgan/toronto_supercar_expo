document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       REGISTRATION MODAL
       ========================= */

    const modal = document.getElementById("registrationModal");
    const form = document.getElementById("registrationForm");

    if (!modal || !form) {
        console.error("Registration modal or form not found.");
        return;
    }

    const openButtons = document.querySelectorAll(
        "[data-open-registration]"
    );

    const closeButtons = document.querySelectorAll(
        "[data-close-registration]"
    );

    const successBox = document.getElementById("formSuccess");
    const confirmationCode = document.getElementById(
        "confirmationCode"
    );


    /* =========================
       OPEN MODAL
       ========================= */

    function openModal() {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        const nameInput = form.elements["fullName"];

        if (nameInput) {
            setTimeout(function () {
                nameInput.focus();
            }, 200);
        }
    }


    /* =========================
       CLOSE MODAL
       ========================= */

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";
    }


    /* =========================
       OPEN BUTTONS
       ========================= */

    openButtons.forEach(function (button) {

        button.addEventListener("click", function () {
            openModal();
        });

    });


    /* =========================
       CLOSE BUTTONS
       ========================= */

    closeButtons.forEach(function (button) {

        button.addEventListener("click", function () {
            closeModal();
        });

    });


    /* =========================
       ESC KEY
       ========================= */

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {
            closeModal();
        }

    });


    /* =========================
       VALIDATION
       ========================= */

    function showError(input, message) {

        const label = input.closest("label");

        if (!label) return;

        const error = label.querySelector(".field-error");

        label.classList.toggle(
            "has-error",
            message !== ""
        );

        if (error) {
            error.textContent = message;
        }
    }


    function validateField(input) {

        if (!input) return true;

        let message = "";

        /* FULL NAME */

        if (input.name === "fullName") {

            if (input.value.trim().length < 2) {
                message = "Please enter your full name.";
            }

        }


        /* EMAIL */

        if (input.name === "email") {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(input.value.trim())) {
                message = "Please enter a valid email address.";
            }

        }


        /* GUESTS */

        if (input.name === "guests") {

            if (!input.value) {
                message =
                    "Please select the number of guests.";
            }

        }


        /* INTEREST */

        if (input.name === "interest") {

            if (!input.value) {
                message =
                    "Please select an experience.";
            }

        }


        /* CONSENT */

        if (input.name === "consent") {

            if (!input.checked) {
                message =
                    "Please accept the event terms.";
            }

        }


        showError(input, message);

        return message === "";
    }


    /* =========================
       LIVE VALIDATION
       ========================= */

    const fields = form.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(function (input) {

        input.addEventListener("blur", function () {
            validateField(input);
        });


        input.addEventListener("input", function () {

            const label = input.closest("label");

            if (
                label &&
                label.classList.contains("has-error")
            ) {
                validateField(input);
            }

        });


        input.addEventListener("change", function () {
            validateField(input);
        });

    });


    /* =========================
       FORM SUBMIT
       ========================= */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const requiredFields = [
            form.elements["fullName"],
            form.elements["email"],
            form.elements["guests"],
            form.elements["interest"],
            form.elements["consent"]
        ];


        let formIsValid = true;


        requiredFields.forEach(function (field) {

            if (!validateField(field)) {
                formIsValid = false;
            }

        });


        /* STOP IF INVALID */

        if (!formIsValid) {

            const firstError =
                form.querySelector(".has-error input, .has-error select");

            if (firstError) {
                firstError.focus();
            }

            return;
        }


        /* =========================
           LOADING STATE
           ========================= */

        const formActions =
            form.querySelector(".form-actions");

        const submitButton =
            form.querySelector("button[type='submit']");


        if (formActions) {
            formActions.classList.add("is-loading");
        }

        if (submitButton) {
            submitButton.disabled = true;
        }


        /* =========================
           SIMULATE PROCESSING
           ========================= */

        setTimeout(function () {

            /* CREATE CONFIRMATION CODE */

            const randomCode =
                Math.random()
                    .toString(36)
                    .substring(2, 7)
                    .toUpperCase();

            const year =
                new Date().getFullYear();

            const confirmation =
                "TSX-" +
                randomCode +
                "-" +
                year;


            /* SHOW CONFIRMATION */

            if (confirmationCode) {

                confirmationCode.textContent =
                    "Confirmation: " + confirmation;

            }


            /* SHOW SUCCESS */

            if (successBox) {

                successBox.classList.add(
                    "is-visible"
                );

            }


            /* =========================
               SAVE DATA
               ========================= */

            const formData =
                new FormData(form);

            const registration = {};

            formData.forEach(function (value, key) {
                registration[key] = value;
            });


            registration.confirmation =
                confirmation;

            registration.createdAt =
                new Date().toISOString();


            try {

                localStorage.setItem(
                    "tsx_registration",
                    JSON.stringify(registration)
                );

            } catch (error) {

                console.log(
                    "Local storage is unavailable."
                );

            }


            /* =========================
               RESET LOADING
               ========================= */

            if (formActions) {
                formActions.classList.remove(
                    "is-loading"
                );
            }

            if (submitButton) {
                submitButton.disabled = false;
            }


            /* SCROLL TO SUCCESS */

            if (successBox) {

                successBox.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            }

        }, 1000);

    });


    /* =========================
       CONSOLE MESSAGE
       ========================= */

    console.log(
        "Toronto Supercar Expo website loaded successfully."
    );

});