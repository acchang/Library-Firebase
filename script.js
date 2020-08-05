
let newPostKey;
let titlesnap;
let fnamesnap;
let lnamesnap;
let pubsnap;
let contribsnap;

function Book(title, fname, lname, pubDate, contrib, own) {
  this.title = title;
  this.fname = fname;
  this.lname = lname;
  this.pubDate = pubDate;
  this.contrib = contrib;
  this.own = own;
};

function retrievefromDatabase() {
firebase.database().ref("Book").once("value", gotData);
  function gotData(Book) {
    var books = Book.val();
    var keys = Object.keys(books);
  
    for (var i = 0; i < keys.length; i++) {

      firebase.database().ref("Book/" + keys[i]).once("value", function(snapshot) {  
      titlesnap = snapshot.val().title; 
      fnamesnap = snapshot.val().fname;
      lnamesnap = snapshot.val().lname;
      pubsnap = snapshot.val().pubDate;
      contribsnap = snapshot.val().contrib;
      newPostKey = snapshot.key;

      const bookContainer = document.createElement("div");
      bookContainer.classList.add("book-container");
      const newVolume = document.createElement("div");
      newVolume.classList.add("volume");
      bookContainer.appendChild(newVolume);
      bookContainer.setAttribute('id', `${newPostKey}`);
      const frontCover = document.createElement("div");
      newVolume.appendChild(frontCover);
      frontCover.style.setProperty("background-color", getRandomColor());

      frontCover.innerHTML = "<br /><br />"
      + "<b>" + titlesnap + "</b>" + "<br /><br />" 
      + fnamesnap + "&nbsp;"
      + lnamesnap + "<br /><br />"
      + "Published: " + pubsnap + "<br />"
      + "Added by: <br />" + contribsnap + "<br />";

      const checkbox = document.createElement('input'); 
      checkbox.type = "checkbox"; 
      checkbox.id = "checkbox"; 
    
      if (snapshot.val().own == true) {
        checkbox.checked = true;
      }
      else {
        checkbox.checked = false;
      };  
      
    checkbox.addEventListener("change", function() {
    if (checkbox.checked === false) {
      firebase.database().ref('Book/' + bookContainer.id + '/own').set(false);
    }
    else if (checkbox.checked === true) {
      firebase.database().ref('Book/' + bookContainer.id + '/own').set(true);
        }});

    const label = document.createElement("label"); 
    label.appendChild(document.createTextNode(" I own a copy")); 
    const newgraf = document.createElement("p")
    
    frontCover.appendChild(checkbox);
    frontCover.appendChild(label);
    frontCover.appendChild(newgraf);
    
    const removeButton = document.createElement('button')
    frontCover.appendChild(removeButton);
    removeButton.textContent = 'Remove';
    removeButton.addEventListener("click", function(event){
        firebase.database().ref('Book/').child(bookContainer.id).remove()
        bookContainer.remove();
    })

      libraryContainer.insertAdjacentElement('afterbegin',bookContainer);
      });
    };
  };
};

retrievefromDatabase();

const submitButton = document.querySelector(".submitButton")
submitButton.addEventListener("click", e => {
  // the prevents the field from clearing on submit
  e.preventDefault();
  addBookToLibrary();
  })

function addBookToLibrary() {
  let title = document.querySelector("#title").value;
  let fname = document.querySelector("#fname").value;
  let lname = document.querySelector("#lname").value;
  let pubDate = document.querySelector("#pubDate").value;
  let contrib = document.querySelector("#contrib").value;
  let own = document.querySelector("#own").checked;
  var addBook = new Book(title, fname, lname, pubDate, contrib, own);
  // I could just put document.querySelector values into var addBook but this is clearer
  newPostKey = firebase.database().ref().child('Book').push().key;
  firebase.database().ref().child('Book').child(newPostKey).set(addBook);
  render();
  document.querySelector("#title").value = "";
  document.querySelector("#fname").value = "";
  document.querySelector("#lname").value = "";
  document.querySelector("#pubDate").value = "";
  document.querySelector("#contrib").value = "";
  document.querySelector("#own").checked = false;
  // I can also shorten this with form.reset()
  // https://discord.com/channels/505093832157691914/690590001486102589/736653879684628491
};

function render() {
  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-container");

  const newVolume = document.createElement("div");
  newVolume.classList.add("volume");
  bookContainer.appendChild(newVolume);
  bookContainer.setAttribute('id', `${newPostKey}`);

  const frontCover = document.createElement("div");
  newVolume.appendChild(frontCover);
 
  frontCover.style.setProperty("background-color", getRandomColor());
  
  let TitleRef = firebase.database().ref('Book/' + newPostKey + '/title');
  TitleRef.once('value', function(snapshot) {
  titlesnap = snapshot.val();
  });
// why is this reversed? variable precedes

  let FnameRef = firebase.database().ref('Book/' + newPostKey + '/fname');
  FnameRef.once('value', function(snapshot) {
  fnamesnap = snapshot.val();
  });

  let LnameRef = firebase.database().ref('Book/' + newPostKey + '/lname');
  LnameRef.once('value', function(snapshot) {
  lnamesnap = snapshot.val();
  });

  let pubRef = firebase.database().ref('Book/' + newPostKey + '/pubDate');
  pubRef.once('value', function(snapshot) {
  pubsnap = snapshot.val();
  });

  let contribRef = firebase.database().ref('Book/' + newPostKey + '/contrib');
  contribRef.once('value', function(snapshot) {
  contribsnap = snapshot.val();
  });

  frontCover.innerHTML = "<br /><br />"
                        + "<b>" + titlesnap + "</b>" + "<br /><br />" 
                        + fnamesnap + "&nbsp;"
                        + lnamesnap + "<br /><br />"
                        + "Published: " + pubsnap + "<br />"
                        + "Added by: <br />" + contribsnap + "<br />";
                        
// reads checkbox form, adds it to the rendered volume and interprets value given
  const checkbox = document.createElement('input'); 
  checkbox.type = "checkbox"; 
  checkbox.id = "checkbox"; 

if (document.getElementById("own").checked == true) {
  checkbox.checked = true;
}
else if (document.getElementById("own").checked == true) {
  checkbox.checked = false;
};  

checkbox.addEventListener("change", function() {
if (checkbox.checked === false) {
  firebase.database().ref('Book/' + bookContainer.id + '/own').set(false);
}
else if (checkbox.checked === true) {
  firebase.database().ref('Book/' + bookContainer.id + '/own').set(true);
    }
  });

const label = document.createElement("label"); 
label.appendChild(document.createTextNode(" I own a copy")); 
const newgraf = document.createElement("p")

frontCover.appendChild(checkbox);
frontCover.appendChild(label);
frontCover.appendChild(newgraf);

const removeButton = document.createElement('button')
frontCover.appendChild(removeButton);
removeButton.textContent = 'Remove';
removeButton.addEventListener("click", function(event){
    firebase.database().ref('Book/').child(bookContainer.id).remove()
    bookContainer.remove();
})

libraryContainer.insertAdjacentElement('afterbegin',bookContainer);
};

function getRandomColor() {
  color = "hsl(" + Math.random() * 360 + ", 100%, 20%)";
  return color;
}

// Inpiration for the remove button:
// https://github.com/JuicyMelon/Library

// For checkbox, I used
// https://www.geeksforgeeks.org/html-dom-input-checkbox-property/

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Lessons from Firebase:
// // firebase.database().ref("Book/-MDeGpx-BRXmR9WPbzQu").on("value", function(snapshot) {
// //   console.log("key: " + snapshot.key 
// //   + " title: " + snapshot.val().title 
// //   + " own:" + snapshot.val().own);
// // });

// // This gets me the object
// // firebase.database().ref("Book").on("value", gotData);
// // function gotData(Book) {
// //   console.log(Book.val())};

// // This just gets me the keys
// // firebase.database().ref("Book").on("value", gotData);
// // function gotData(Book) {
// //   console.log(Object.keys(Book.val()))};

// Rejected "retrievefromDatabase" functions
// function retrievefromDatabase() {
//   firebase.database().ref("Book").once("value", (book) => {
//       book.forEach((snapshot) => {
//           newPostKey = snapshot.key;

//           function oldBook(title, fname, lname, pubDate, contrib, own) {
//               this.title = title;
//               this.fname = fname;
//               this.lname = lname;
//               this.pubDate = pubDate;
//               this.contrib = contrib;
//               this.own = own;
//           };
//           var archiveBook = new oldBook(snapshot.val().title,
//               snapshot.val().fname,
//               snapshot.val().lname,
//               snapshot.val().pubDate,
//               snapshot.val().contrib,
//               snapshot.val().own);
//       })
//       render();
//   })
// };


// function retrievefromDatabase() {
//   firebase.database().ref("Book").once("value", gotData);
//       function gotData(Book) {
//       var books = Book.val();
//       var keys = Object.keys(books);
//         for (var i = 0; i < keys.length; i++) {
//           firebase.database().ref("Book/" + keys[i]).on("value", function(snapshot) {
// // maybe if I can get the "on" to "once" here; use this instead:
// // let TitleRef = firebase.database().ref('Book/' + newPostKey + '/title');
// // TitleRef.once('value', function(snapshot) {
// // titlesnap = snapshot.val();
// // });

//           newPostKey = snapshot.key;    
//           function oldBook(title, fname, lname, pubDate, contrib, own) {
//             this.title = title;
//             this.fname = fname;
//             this.lname = lname;
//             this.pubDate = pubDate;
//             this.contrib = contrib;
//             this.own = own;
//           };          
//           var archiveBook = new oldBook(snapshot.val().title, 
//           snapshot.val().fname, 
//           snapshot.val().lname, 
//           snapshot.val().pubDate,
//           snapshot.val().contrib,
//           snapshot.val().own);
//           render();
//         })}}};
