document.addEventListener("DOMContentLoaded", () => {
	toastr.options = {
		closeButton: true,
		progressBar: true,
		positionClass: "toast-top-right",
		timeOut: "1000",
	};

	const clearLocalStorageButton = document.getElementById(
		"clear-local-storage-btn"
	);
	const parableForm = document.getElementById("parable-form");
	const loadButton = document.getElementById("load-button");
	const parablesContainer = document.querySelector(".parables-container");

	clearLocalStorageButton.addEventListener("click", () => {
		localStorage.clear();
		alert("Local storage очищен!");
	});

	if (parableForm) {
		parableForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const title = event.target.titleP.value.trim();
			const email = event.target.email.value.trim();
			const parableText = event.target["parable-text"].value.trim();

			if (!title || !email || !parableText) {
				toastr.error("⚠ Пожалуйста, заполните все поля.", "error");
				return;
			}

			createParableElement(title, email, parableText);

			const parables = JSON.parse(localStorage.getItem("parables")) || [];
			parables.push({ title, email, parableText });
			localStorage.setItem("parables", JSON.stringify(parables));

			parableForm.reset();
			toastr.success("✅ Притча добавлена!", "success");
		});
	}

	function createParableElement(title, email, parableText, index) {
		const htmlText = `
		<div class="parable">
			<h3>${title}</h3>
			<p>
				<a href="mailto:${email}" target="_blank">${email}</a>
			</p>

			<p>${parableText}</p>

			<button class="parable__delete-btn">Удалить</button>
		</div>`;

		parablesContainer.insertAdjacentHTML("afterbegin", htmlText);

		const parableDiv = document.querySelector(".parable");
		const deleteButton = document.querySelector(".parable__delete-btn");

		deleteButton.addEventListener("click", () => {
			parableDiv.remove();
		});
	}

	/* Загрузка новых притч */
	const preloader = document.createElement("div");
	let lastId = 0;

	function createLoadParableElement(title, email, body) {
		const parableDiv = document.createElement("div");
		parableDiv.classList.add("parable");

		const nameHeader = document.createElement("h3");
		nameHeader.textContent = `${title}`;
		parableDiv.appendChild(nameHeader);

		const emailLink = document.createElement("a");
		emailLink.href = `mailto:${email}`;
		emailLink.textContent = email;
		emailLink.target = "_blank";

		const emailParagraph = document.createElement("p");
		emailParagraph.textContent = "Email: ";
		emailParagraph.appendChild(emailLink);
		parableDiv.appendChild(emailParagraph);

		const parableParagraph = document.createElement("p");
		parableParagraph.textContent = body;
		parableDiv.appendChild(parableParagraph);

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("parable__delete-btn");
		deleteButton.textContent = "Удалить";
		parableDiv.appendChild(deleteButton);

		deleteButton.addEventListener("click", () => {
			parableDiv.remove();
			const storedParables = JSON.parse(localStorage.getItem("parables"));
			if (storedParables) {
				const index = storedParables.findIndex(
					(c) => c.parableText === body && c.email === email
				);
				if (index !== -1) {
					storedParables.splice(index, 1);
					localStorage.setItem(
						"parables",
						JSON.stringify(storedParables)
					);
				}
			}
		});

		return parableDiv;
	}

	function createPreloader() {
		preloader.classList.add("preloader");
		preloader.classList.add("preloader-animation");
		parablesContainer.appendChild(preloader);
	}

	function removePreloader() {
		if (preloader.parentElement) {
			preloader.remove();
		}
	}

	function fetchParables(id) {
		createPreloader();
		fetch(
			`https://jsonplaceholder.typicode.com/comments?id_gte=${id}&_limit=3`
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				removePreloader();
				const storedParables =
					JSON.parse(localStorage.getItem("comments")) || [];

				data.forEach((parable) => {
					if (parable.email) {
						const existingParable = storedParables.find(
							(c) =>
								c.commentText === parable.body &&
								c.email === parable.email
						);
						if (!existingParable) {
							const name = "Load parables";

							storedParables.push({
								name: name,
								email: parable.email,
								parableText: parable.body,
							});
							const parableElement = createLoadParableElement(
								name,
								parable.email,
								parable.body
							);
							parablesContainer.appendChild(parableElement);
						}
					}
				});

				localStorage.setItem(
					"parables",
					JSON.stringify(storedParables)
				);
			})
			.catch((error) => {
				removePreloader();
				toastr.error("⚠ Smth went wrong", "error");
				console.error("Error fetching parables:", error);
			});
	}

	loadButton.addEventListener("click", () => {
		lastId = lastId === 0 ? 1 : 100;
		fetchParables(lastId);
	});
});
