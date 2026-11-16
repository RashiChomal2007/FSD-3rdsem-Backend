const form = document.getElementById("requestForm");

const requestId =
    document.getElementById("requestId");

const studentName =
    document.getElementById("studentName");

const email =
    document.getElementById("email");

const category =
    document.getElementById("category");

const description =
    document.getElementById("description");

const priority =
    document.getElementById("priority");

const requestsList =
    document.getElementById("requestsList");

const message =
    document.getElementById("message");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");


// ==========================================
// GET ALL REQUESTS
// ==========================================

async function getRequests() {

    try {

        const response =
            await fetch("/api/requests");

        const requests =
            await response.json();

        displayRequests(requests);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load requests.";

    }
}


// ==========================================
// DISPLAY REQUESTS
// ==========================================

function displayRequests(requests) {

    if (requests.length === 0) {

        requestsList.innerHTML =
            `<p class="empty">
                No requests submitted yet.
             </p>`;

        return;
    }


    requestsList.innerHTML =
        requests.map(request => {

            return `

                <div class="request-card">

                    <h3>
                        ${escapeHTML(request.studentName)}
                    </h3>

                    <p>
                        <strong>Email:</strong>
                        ${escapeHTML(request.email)}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        <span class="badge">
                            ${escapeHTML(request.category)}
                        </span>
                    </p>

                    <p>
                        <strong>Priority:</strong>

                        <span class="
                            badge
                            priority-${request.priority.toLowerCase()}
                        ">
                            ${escapeHTML(request.priority)}
                        </span>
                    </p>

                    <p>
                        <strong>Problem:</strong>
                        ${escapeHTML(request.description)}
                    </p>

                    <div class="card-buttons">

                        <button
                            class="edit-btn"
                            onclick="editRequest(${request.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteRequest(${request.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// ==========================================
// POST / PUT REQUEST
// ==========================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const data = {

            studentName:
                studentName.value.trim(),

            email:
                email.value.trim(),

            category:
                category.value,

            description:
                description.value.trim(),

            priority:
                priority.value
        };


        const id = requestId.value;


        try {

            let response;


            // UPDATE
            if (id) {

                response =
                    await fetch(
                        `/api/requests/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

            }

            // ADD
            else {

                response =
                    await fetch(
                        "/api/requests",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );
            }


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message
                );

            }


            if (id) {

                message.textContent =
                    "Request updated successfully!";

            } else {

                message.textContent =
                    "Request submitted successfully!";

            }


            resetForm();

            getRequests();

        }

        catch (error) {

            console.error(error);

            message.textContent =
                error.message;
        }

    }
);


// ==========================================
// EDIT REQUEST
// ==========================================

async function editRequest(id) {

    try {

        const response =
            await fetch(
                `/api/requests/${id}`
            );

        const request =
            await response.json();


        if (!response.ok) {

            throw new Error(
                request.message
            );

        }


        requestId.value =
            request.id;

        studentName.value =
            request.studentName;

        email.value =
            request.email;

        category.value =
            request.category;

        description.value =
            request.description;

        priority.value =
            request.priority;


        formTitle.textContent =
            "Update Request";

        submitButton.textContent =
            "Update Request";

        cancelButton.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        message.textContent =
            error.message;

    }
}


// ==========================================
// DELETE REQUEST
// ==========================================

async function deleteRequest(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this request?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/requests/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message
            );

        }


        message.textContent =
            "Request deleted successfully!";


        getRequests();

    }

    catch (error) {

        console.error(error);

        message.textContent =
            error.message;

    }
}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener(
    "click",
    resetForm
);


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    form.reset();

    requestId.value = "";

    formTitle.textContent =
        "Submit a Request";

    submitButton.textContent =
        "Submit Request";

    cancelButton.hidden =
        true;
}


// ==========================================
// SECURITY FUNCTION
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

getRequests();