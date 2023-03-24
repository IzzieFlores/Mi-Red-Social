
$(document).ready(function () {

    const firebaseConfig = {
        apiKey: "AIzaSyCD9XclKrRqdbvTdki8hdHAP7q8rbAGiuI",
        authDomain: "login-f31f1.firebaseapp.com",
        projectId: "login-f31f1",
        storageBucket: "login-f31f1.appspot.com",
        messagingSenderId: "524541020601",
        appId: "1:524541020601:web:b4dbf9ca5328a52ae84e68",
        measurementId: "G-NLW8LC3R33"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    console.log(app);

    const db = firebase.firestore();

    //***Registrar Usuarios****//
    //Seleccionando el boton registrar
    $("#btn-register").click(function () {
        //Capturar el Email y el Password
        let userName = $("#userName").val();
        let email = $("#email").val();
        let password1 = $("#password").val();

        //  console.log(username, password1); //comprobamos si captura datos


        //Método de firebase que registra usuarios
        firebase.auth().createUserWithEmailAndPassword(email, password1)
            .then((userCredential) => {
                // Signed in
                addNombre(userName);
                Swal.fire({
                    icon: 'success',
                    title: 'Good job!',
                    text: 'Creaste tu cuenta exitosamente',
                    confirmButtonText: 'ok',
                    allowOutsideClick: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "index.html";

                    }
                })
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
                console.log(errorCode, errorMessage);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ocurrio un error al crear tu cuenta',
                })
            });

    });





    //Ingresar con nuestro correo registrado
    $("#btn-login").click(function () {

        //Capturar el Email y el Password
        let userName = $("#userName").val();
        // let email = $("#email").val();
        let password1 = $("#password").val();


        firebase.auth().signInWithEmailAndPassword(userName, password1)
            .then((userCredential) => {
                // Signed in

                Swal.fire({
                    icon: 'success',
                    title: 'Good job!',
                    text: '¿Estás seguro que quieres ir a la siguiente página?',
                    confirmButtonText: 'Yes',
                    allowOutsideClick: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "home.html";
                    }
                })
                // ...

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode, errorMessage);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo iniciar sesión',
                })
            });
    });

    //Cerrar Sesión
    $("#boton-cerrar").click(function () {

        firebase.auth().signOut().then(() => {

            Swal.fire({
                title: '¡Alerta!',
                text: "Seguro que quieres cerrar sesión?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "index.html"
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })


        })

    });

    //Iniciar sesión con cuenta google
    var provider = new firebase.auth.GoogleAuthProvider();


    $("#btn-google").click(function () {



        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                console.log(token, user);

                window.location.href = "home.html";
            }).catch((error) => {

                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(errorCode, errorMessage, email, credential);
            });
    })


    //Agregar post
    $("#publicar").click(function (e) {
        e.preventDefault();
        let am = document.getElementById("a").value;

        // console.log(am);

        let formu = document.getElementById("mm");
        const user = firebase.auth().currentUser;
        // console.log(formu);

        // Add a new document with a generated id.
        db.collection("holaaaa").add({
            _texto: am,
            _idUser: user.uid,
            _nombreUser: user.displayName,

        })
            .then((docRef) => {
                // console.log("Document written with ID: ", docRef.id);
                console.log("SE GUARDO CORRECTAMENTE");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

        formu.reset();
    })


    //AÑADIR NOMBRE

    function addNombre(nombre) {
        const user = firebase.auth().currentUser;

        user
            .updateProfile({
                displayName: nombre,

            })
            .then(() => {
                console.log("se actualizo el nombre");

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }


    //MANEJO DE SESIONES
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User

            var uid = user.uid;
            var email = user.email;
            var usuario = user.displayName;
            console.log(email, usuario, uid);
            obtenerDatos();
            // ...
        } else {
            // User is signed out
            // ...
        }
    });

    //MOSTRAR DATOS EN EL HTML
    function mostrarDatos(data) {
        const user = firebase.auth().currentUser;
        if (data.length > 0) {
            $("#post").empty();
            let html = "";
            data.forEach((doc) => {
                var post = doc.data();
                console.log("post - ", post);
                var div = ``;
                if (user.uid == post._idUser) {
                    div = `
          <div class="card card mb-3" style="width: 28rem mt-3 mx-auto" style="max-width: 800px;">
            <div class="card-body ">
              <p class="fst-italic">${post._texto}</p>
              <p class="fst-italic">Publicado por ${post._nombreUser}</p>
              <button data-id="${doc._idUser}" class="btn btn-success btn-sm">
                Editar
              </button>
              <button data-id="${doc._idUser}" class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </div>
          </div>
        `;
                } else {
                    div = `
          <div class="card " style="max-width: 800px;">
            <div class="card-body">
              <p class="fst-italic">${post._texto}</p>
              <p class="fst-italic">Publicado por ${post._nombreUser}</p>
            </div>
          </div>
        `;
                }

                html += div;
            });
            $("#post").append(html);

        }
    }

    function obtenerDatos() {
        db.collection("holaaaa").get().then((querySnapshot) => {
            mostrarDatos(querySnapshot.docs);
            
        });

    }
})

//////////////////////