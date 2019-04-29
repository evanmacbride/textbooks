# Textbook Database

A Google Firestore demo in the form of a college textbook management system. The site is built with jQuery, with an attempt to create a basic Single Page Application. Textbooks are saved in a Firestore database where each book has a course number, semester, course lead instructor's initials, book title, book author, and book ISBN. After logging in with email and password, users may add new textbooks or search for and edit books currently in the system. Edits and deletions are performed "in place" (i.e. in the search results table) by clicking on the appropriate icons. Users may undo any unsaved edits. Searches can be performed on any of the six data fields saved with each document. Text notices indicate success of additions, edits, and deletions.

# TODO:

Provide notice to user when search returns no results.

Put Add New Textbooks and Search Textbooks beside each other (not on top of each other) in desktop mode.

Provide count of search results.
