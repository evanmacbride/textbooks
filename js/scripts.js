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
		
	// Display all books in a formatted table.
	function displayAllBooks() {
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
					"<button type='button' class='undo-edit hideable hidden-btn' title='undo current edit'>" +
					"<i class='fas fa-undo-alt'></i></button>" +					
					"<button type='button' class='edit-textbook' title='toggle edit mode'>" +
					"<i class='far fa-edit'></i></button>" +
					"<button type='button' class='delete-textbook' id='" + 
					$textbookId + "' title='delete textbook'><i class='far fa-trash-alt'></i></button></span></form></li>");
			});
		});
	}
	
	// Display Search Results in a formatted table. If exact match is requested, omit orderBy().
	function displaySearchResults(queryField, matchType, queryValue) {
		$(".recent-textbooks").html("");
		var order = db.collection("textbooks").where(queryField, matchType, queryValue).orderBy(queryField);
		if (matchType == "==") {
			order = db.collection("textbooks").where(queryField, matchType, queryValue);
		}
		order.get().then((querySnapshot) => {
				resultCount = querySnapshot.size;
				querySnapshot.forEach((doc) => {
				
				var $recentHtml = $(".recent-textbooks").html();
				var $textbookId = doc.id;
				$(".recent-textbooks").html(
						$recentHtml + "<li class='recent-textbook' data-id='" + 
						$textbookId + "'><form class='edit-form'><input disabled class='textbook-course' value='" + 
						doc.data().course + "' last-saved='" + doc.data().course + "'></input><input disabled class='textbook-semester' value='" + 
						doc.data().semester + "' last-saved='" + doc.data().semester + "'></input><input disabled class='textbook-lead' value='" + 
						doc.data().lead + "' last-saved='" + doc.data().lead + "'></input><input disabled class='textbook-title' value='" + 
						doc.data().title + "' last-saved='" + doc.data().title + "'></input><input disabled class='textbook-author' value='" + 
						doc.data().author + "' last-saved='" + doc.data().author + "'></input><input disabled class='textbook-isbn' value='" + 
						doc.data().isbn + "' last-saved='" + doc.data().isbn + "'></input><span class='textbook-func'>" +
						"<button type='submit' class='save-edit hideable hidden-btn' title='save edit'>" +
						"<i class='far fa-save'></i></button>" +					
						"<button type='button' class='undo-edit hideable hidden-btn' title='undo current edit'>" +
						"<i class='fas fa-undo-alt'></i></button>" +					
						"<button type='button' class='edit-textbook' title='toggle edit mode'>" +
						"<i class='far fa-edit'></i></button>" +
						"<button type='button' class='delete-textbook' id='" + 
						$textbookId + "' title='delete textbook'><i class='far fa-trash-alt'></i></button></span></form></li>");
			});
		/*}).then(function() {
			var count = $(".recent-textbooks")[0].children.length;
			if (count < 1) {
				$(".textbook-display").html("Your search returned 0 results.");
			}
		}).then(function() {
			$(".textbook-display").css("display","inline-block");*/
		});		
	}
	
	// Search for desired database field. Check if exact match requested.
	$(".wrap").on("submit", ".search-textbooks",function(event) {
		event.preventDefault();
		var $queryValue = $(this).find("#search-query").val();
		var $queryType = $(this).find("#query-type").val();
		var matchType = ">=";
		if ($(this).find("#strict-search").is(":checked")) {
			matchType = "==";
		}
		$(".textbook-display").css("display","inline-block");
		displaySearchResults($queryType,matchType,$queryValue);	
		
	});

	
	// Check for log-in or log-out.
	firebase.auth().onAuthStateChanged(firebaseUser => {
		// If logged in
		if (firebaseUser) {
			console.log(firebaseUser);
			// Hide login-btn and show logout-btn.
			$(".logout-btn").show();
			$(".login-btn").hide();
			$("#search-manage").show();
		// If logged out
		} else {
			$(".wrap").load("home.html", function() {
				$("#search-manage").hide();
				$(".login-btn").show();
				$(".logout-btn").hide();
				$(".active-page").removeClass("active-page");
				setTimeout(function() {
					$("#home-page").addClass("active-page");
				},1);				
			});
		}
	});
	
	// Log in by submitting login-form. Jump to Search & Manage after
	// logging in.
	$(".wrap").on("submit",".login-form",function(event) {
		event.preventDefault();
		var $user = $("#username").val();
		var $pass = $("#password").val();
		const promise = auth.signInWithEmailAndPassword($user,$pass);
		promise.then(function() {
			$(".wrap").load("manage.html", function() {
				$(".active-page").removeClass("active-page");
				setTimeout(function() {
					$("#search-manage").addClass("active-page");
				},1);				
			});
		});
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
	
	// Undo current edit by swapping all values with last-saved attribute.
	// Get the current form then go through inputs iteratively.
	$(".wrap").on("click", ".undo-edit", function(event) {	
		$thisForm = $(this).parent().parent();
		$inputs = $(this).parent().parent().find("input");
		$inputs.each(function() {
			$(this).val($(this).attr("last-saved"));
		});
	});
	
	// Save edits in place by clicking save-edit icon.
	$(".wrap").on("submit", ".edit-form", function(event) {
		event.preventDefault();
		// If I wanted to lock last-saved to current value on save,
		// I could do these next 3 lines for each field.
		/*$formCourse = $(this).find(".textbook-course");
		var $course = $formCourse.val();
		$formCourse.attr("last-saved",$formCourse.val());*/		
		var $course = $(this).find(".textbook-course").val();
		var $semester = $(this).find(".textbook-semester").val();
		var $lead = $(this).find(".textbook-lead").val();
		var $title = $(this).find(".textbook-title").val();
		var $author = $(this).find(".textbook-author").val();
		var $ISBN = $(this).find(".textbook-isbn").val();
		var $thisLine = $(this).parent();
		var $thisDoc = $(this).parent().attr("data-id");
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
			.then(function() {
				$message = $("#function-message");
				$message.html("Changes saved").css("color","var(--green)");
				$thisLine.addClass("successful");
				setTimeout(function() {
					$thisLine.removeClass("successful");
				},800);
				$message.fadeIn(1).delay(1200).fadeOut(300);
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
			$message = $("#function-message");
			$message.html("Book deleted").css('color','var(--red)');
			$message.fadeIn(1).delay(1200).fadeOut(300);
		}).catch(function(error) {
			console.error("Error removing document: ", error);
		});
	});

	// Add new textbooks into database from new-textbooks form.
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
			$message = $(".success-message");
			$message.html("SUCCESS! Added " + $title + " to database.").fadeIn(60).delay(2000).fadeOut(300);
			$message.show();
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
			$message = $(".success-message");
			$message.html("Error! Could not add " + $title + " to database.");
			$message.show();
		});
		//displayAllBooks();
		$(this)[0].reset();
	});
	
	// Toggle About Dropdown
	$(".banner").on("click", "#about-btn", function() {
		$(".dropdown-list").toggle();
	});
	
	// Close dropdown if user clicks outside of it
	$(document).click(function(event) {
		if(!$(event.target).parent().addBack().is(".dropdown-list") && 
		!$(event.target).parent().addBack().is("#about-btn")) {
			$(".dropdown-list").hide();
		}
	});
	
	// Load Search & Manage page
	$(document).on("click", "#search-manage", function() {
		$(".wrap").load("manage.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$("#search-manage").addClass("active-page");
			},1);
		});
		$('html,body').scrollTop(0);
	});	
	
	// Load Log In page
	$(".banner").on("click", ".login-btn", function() {
		$(".wrap").load("login.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$(".login-btn").addClass("active-page");
			},1);			
		});
		$('html,body').scrollTop(0);
	});

	// Load Home Page
	$(".banner").on("click", "#home-page", function() {
		$(".wrap").load("home.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$("#home-page").addClass("active-page");
			},1);				
		});
		$('html,body').scrollTop(0);
	});
	
	// Load FAQ Page
	$(document).on("click", "#faq-page", function() {
		$(".wrap").load("faq.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$("#about-btn").addClass("active-page");
			},1);				
		});
		$('html,body').scrollTop(0);
	});

	// Load Contact Page
	$(document).on("click", "#contact-page", function() {
		$(".wrap").load("contact.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$("#about-btn").addClass("active-page");
			},1);				
		});
		$('html,body').scrollTop(0);
	});
	
	// Load User Guide Page
	$(document).on("click", "#user-guide-page", function() {
		$(".wrap").load("user-guide.html", function() {
			$(".active-page").removeClass("active-page");
			setTimeout(function() {
				$("#about-btn").addClass("active-page");
			},1);				
		});
		$('html,body').scrollTop(0);
	});
	
	// Sign out the user by clicking log-out button.
	// (Should return user to home page).
	$(".banner").on("click", ".logout-btn", function() {
		auth.signOut();
		$('html,body').scrollTop(0);
	});
});