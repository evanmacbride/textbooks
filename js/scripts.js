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
					$recentHtml + "<li class='recent-textbook' data-id='" + 
					$textbookId + "'><form class='edit-form'><input disabled class='textbook-course' value='" + 
					doc.data().course + "'></input><input disabled class='textbook-semester' value='" + 
					doc.data().semester + "'></input><input disabled class='textbook-lead' value='" + 
					doc.data().lead + "'></input><input disabled class='textbook-title' value='" + 
					doc.data().title + "'></input><input disabled class='textbook-author' value='" + 
					doc.data().author + "'></input><input disabled class='textbook-isbn' value='" + 
					doc.data().isbn + "'></input><span class='textbook-func'>" +
					"<button type='submit' class='save-edit hideable hidden-btn' title='save edit'>" +
					"<i class='far fa-save'></i></button>" +					
					"<button type='button' class='undo-edit hideable hidden-btn' title='undo edit'>" +
					"<i class='fas fa-undo-alt'></i></button>" +					
					"<button type='button' class='edit-textbook' title='edit textbook'>" +
					"<i class='far fa-edit'></i></button>" +
					"<button type='button' class='delete-textbook' id='" + 
					$textbookId + "' title='delete textbook'><i class='far fa-trash-alt'></i></button></span></form></li>");
			});
		});
	}
	
	function displaySearchResults(queryField, queryValue) {
		$(".recent-textbooks").html("");
		db.collection("textbooks").where(queryField, ">=", queryValue).orderBy(queryField)
			.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var $recentHtml = $(".recent-textbooks").html();
				var $textbookId = doc.id;
				$(".recent-textbooks").html(
					
					$recentHtml + "<li class='recent-textbook' data-id='" + 
					$textbookId + "'><form class='edit-form'><input disabled class='textbook-course' value='" + 
					doc.data().course + "'></input><input disabled class='textbook-semester' value='" + 
					doc.data().semester + "'></input><input disabled class='textbook-lead' value='" + 
					doc.data().lead + "'></input><input disabled class='textbook-title' value='" + 
					doc.data().title + "'></input><input disabled class='textbook-author' value='" + 
					doc.data().author + "'></input><input disabled class='textbook-isbn' value='" + 
					doc.data().isbn + "'></input><span class='textbook-func'>" +
					"<button type='submit' class='save-edit hideable hidden-btn' title='save edit'>" +
					"<i class='far fa-save'></i></button>" +					
					"<button type='button' class='undo-edit hideable hidden-btn' title='undo edit'>" +
					"<i class='fas fa-undo-alt'></i></button>" +					
					"<button type='button' class='edit-textbook' title='edit textbook'>" +
					"<i class='far fa-edit'></i></button>" +
					"<button type='button' class='delete-textbook' id='" + 
					$textbookId + "' title='delete textbook'><i class='far fa-trash-alt'></i></button></span></form></li>");
			});
		});		
	}
	
	$(".wrap").on("submit", ".search-textbooks",function(event) {
		event.preventDefault();
		var $queryValue = $(this).find("#search-query").val();
		displaySearchResults("title",$queryValue);
	});

	
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
	
	// Edit textbooks "in place" (as they appear in search table) by
	// removing that line's disabled attribute. Use the edit button to
	// toggle between disabled and enabled. Clicking edit reveals icons
	// for save-edit and undo-edit.
	$(".wrap").on("click", ".recent-textbooks li .edit-textbook", function() {
		var $editingBtn = $(this);
		var $thisBookParams = $(this).closest("form").children("input");
		$thisBookParams.prop("disabled", function(i, v) {
			return !v;
		});
		$(this).siblings().each(function() {
			if ($(this).hasClass("hidden-btn")) {
				$(this).removeClass("hidden-btn");
			} else {
				if ($(this).hasClass("hideable")) {
					$(this).addClass("hidden-btn");
				}
			}
		});
	});
	
	// Save edits in place by clicking save-edit icon.
	$(".wrap").on("submit", ".edit-form", function(event) {
		event.preventDefault();
		var $course = $(this).find(".textbook-course").val();
		var $semester = $(this).find(".textbook-semester").val();
		var $lead = $(this).find(".textbook-lead").val();
		var $title = $(this).find(".textbook-title").val();
		var $author = $(this).find(".textbook-author").val();
		var $ISBN = $(this).find(".textbook-isbn").val();
		var $thisDoc = $(this).parent().attr("data-id");
		// TODO: Get id of relevant doc.
		var docRef = db.collection("textbooks").doc($thisDoc);
		docRef.get().then(function(thisDoc) {
			if (thisDoc.exists) {
				docRef.update({
				course: $course,
				semester: $semester,
				lead: $lead,
				title: $title,
				author: $author,
				isbn: $ISBN		
			})
			/*.then(function(docRef) {
				console.log("Document updated with ID: ", docRef.id);
			})*/
			.catch(function(error) {
				console.error("Error updating document: ", error);
			});
			}
		});
	});

	// Delete textbooks from database and remove them from recent-textbooks.
	$(".wrap").on("click", ".recent-textbooks li .delete-textbook", function() {
		var $deletingBtn = $(this);
		db.collection("textbooks").doc($deletingBtn.attr("id")).delete().then(function() {
			$deletingBtn.parent().parent().parent().remove();
			console.log("Document successfully deleted!");
		}).catch(function(error) {
			console.error("Error removing document: ", error);
		});
	});

	// Load new textbooks into database from new-textbooks form.
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