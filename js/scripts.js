// TODO: Use custom attribute doc-id instead of button id to store document id.
// Edit records in place by making each recent-textbook a form that
// defaults to readonly or disabled. Add an "edit" button that will
// remove the disabled attribute. Add an "undo" button to revert to
// previous values and cancel edit. Add a "save" button to save
// changes and revert recent-textbook to disabled. Exclude config
// from version?

$(document).ready(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAJc9wFNeEZmACO9J5ConY6hOIqxM1aCyI",
		authDomain: "textbooks-9c0e3.firebaseapp.com",
		databaseURL: "https://textbooks-9c0e3.firebaseio.com",
		projectId: "textbooks-9c0e3",
		storageBucket: "textbooks-9c0e3.appspot.com",
		messagingSenderId: "715114654330"
	};
	firebase.initializeApp(config);
	var db = firebase.firestore();
	const auth = firebase.auth();
	
	// Fetch recent textbooks from database and render them 
	// into recent-textbooks.
	// TODO: Allow sorting by different parameters. Show new
	// parameters (timestamp etc.). Create a second line of
	// data that will scroll down upon pushing an "info" icon.
	function displayRecent() {
		$(".recent-textbooks").html("");
		db.collection("textbooks")
			.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var $recentHtml = $(".recent-textbooks").html();
				var $textbookId = doc.id;
				$(".recent-textbooks").html(
					$recentHtml + "<li class='recent-textbook'><span class='textbook-course'>" + 
					doc.data().course + "</span><span class='textbook-semester'>" + 
					doc.data().semester + "</span><span class='textbook-lead'>" + 
					doc.data().lead + "</span><span class='textbook-title'>" +
					doc.data().title + "</span><span class='textbook-author'>" +
					doc.data().author + "</span><span class='textbook-isbn'>" + 
					doc.data().isbn + "</span><span class='textbook-func'>" +
					"<button type='button' class='edit-textbook' id='" +
					$textbookId + "'title='edit textbook'><i class='far fa-edit'></i></button></span>" +
					"<button type='button' class='delete-textbook' id='" + 
					$textbookId + "'title='delete textbook'><i class='far fa-trash-alt'></i></button></span></li>");
			});
		});
	}
	
	// Check for log-in or log-out.
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			console.log(firebaseUser);
			$(".wrap").load("manage.html");
			$(document).prop("title", "Textbook Database");
			displayRecent();
		} else {
			$(".wrap").load("login.html");
			$(document).prop("title", "Textbook Database Log In");
		}
	});
	
	// Handle log-ins
	$(".wrap").on("submit",".login-form",function(event) {
		event.preventDefault();
		var $user = $("#username").val();
		var $pass = $("#password").val();
		const promise = auth.signInWithEmailAndPassword($user,$pass);
		promise.catch(function(event) {
			// Provide a username/password not found message and log
			// error to console.
			$(".login-message").html("Username or password not found.");
			console.log(event.message);
		});
		$(this)[0].reset();
	});

	// Delete textbooks from database and remove them from recent-textbooks.
	$(".wrap").on("click", ".recent-textbooks li button", function() {
		var $deletingBtn = $(this);
		db.collection("textbooks").doc($deletingBtn.attr("id")).delete().then(function() {
			$deletingBtn.parent().parent().remove();
			console.log("Document successfully deleted!");
		}).catch(function(error) {
			console.error("Error removing document: ", error);
		});
	});

	// Load new textbooks into database from new-textbooks form.
	// TODO: Collect additional data (author, lead and course).
	$(".wrap").on("submit", ".new-textbooks", function(event) {
		event.preventDefault();
		//var d = new Date();
		//var $date = d.toISOString();
		var $course = $("#new-course").val();
		var $semester = $("#new-semester").val();
		var $lead = $("#new-lead").val();
		var $title = $("#new-title").val();
		var $author = $("#new-author").val();
		var $ISBN = $("#new-ISBN").val();

		db.collection("textbooks").add({
			//date: $date,
			course: $course,
			semester: $semester,
			lead: $lead,
			title: $title,
			author: $author,
			isbn: $ISBN
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});
		// Could I just display the new record from the local data 
		// after a successful upload? Do I need to 
		// call displayRecent()?
		displayRecent();
		$(this)[0].reset();
	});

	// Sign out the user by clicking log-out button.
	$(".wrap").on("click", "#logout", function() {
		auth.signOut();
	});
});