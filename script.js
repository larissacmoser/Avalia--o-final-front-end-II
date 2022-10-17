const modalOne = new bootstrap.Modal("#modal-one");
const modalTwo = new bootstrap.Modal("#modal-two");
const modalFade = new bootstrap.Modal("#modalFade");
const exampleModal = new bootstrap.Modal("#exampleModal");
let executeVar;
let globalID = "";
let changeButton = document.getElementById("change-button");
let notes = [];
let inputDescription = document.getElementById("input1");
let inputDetailing = document.getElementById("input2");
const tBody = document.getElementById("list");
let row = {
  description: null,
  detailing: null,
};

let linkAccount = document.getElementById("link-account");

let btnLog = document.getElementById("btn-log");
let btnSave = document.getElementById("btnSave");
let usersList = [];
let userlogged = JSON.parse(localStorage.getItem("userlogged"));

//pagina-recados
function toCleanBtn() {
  inputDescription.value = "";
  inputDetailing.value = "";
}
//pagina-recados
function toSaveNotes() {
  if (inputDescription.value == null || inputDescription.value == "") {
    alert("Por favor, escreva o recado");
    inputDescription.focus();
    return;
  }

  let newNote = {
    description: inputDescription.value,
    detailing: inputDetailing.value,
    id: Math.floor(Date.now() / 1000),
    userId: getLoggedUser().id,
  };

  usersList = JSON.parse(localStorage.getItem("userslist"));
  usersList.forEach((object) => {
    if (object.id == userlogged) {
      object.notes.push(newNote);
    }
  });

  localStorage.setItem("userslist", JSON.stringify(usersList));

  renderData();
}
//pagina-recados
function showConfirm(id) {
  globalID = id;
  modalTwo.show();
}
function toRemoveNotes() {
  usersList = JSON.parse(localStorage.getItem("userslist"));
  usersList.forEach((object) => {
    if (object.id == userlogged) {
      object.notes = object.notes.filter((value) => {
        return value.id != globalID;
      });
    }
  });
  localStorage.setItem("userslist", JSON.stringify(usersList));
  changeButton.innerHTML =
    '<button type="button" class="btn btn-success" onclick="toRemoveNotes(globalID)"> Sim </button>;<button type="button" class="btn btn-danger" data-bs-dismiss="modal"> Não </button>';
  renderData();
  modalTwo.hide();
}
//pagina-recados
function editNotes(id) {
  let idRow = document.getElementById(id);
  let getTD = idRow.querySelectorAll("td");
  let tdDescription = getTD[1];
  let tdDetailing = getTD[2];
  tdDescription.innerHTML =
    "<input type='text' id='ipt-test-one' value='" +
    tdDescription.innerHTML +
    "'>";
  tdDetailing.innerHTML =
    "<input type='text' id='ipt-test-two' value='" +
    tdDetailing.innerHTML +
    "'>";
  let iptDescrip = document.getElementById("ipt-test-one");
  iptDescrip.addEventListener("blur", () => {
    let iDrow = document.getElementById(id);
    tdDescription.innerHTML = `${iptDescrip.value}`;
    saveNotesAfterEdit(iDrow);
  });

  let iptDetail = document.getElementById("ipt-test-two");
  iptDetail.addEventListener("blur", () => {
    let iDrow2 = document.getElementById(id);
    tdDetailing.innerHTML = `${iptDetail.value}`;
    saveNotesAfterEdit(iDrow2);
    modalOne.show();
  });
}
//pagina-recados
function saveNotesAfterEdit(element) {
  let users = JSON.parse(localStorage.getItem("userslist") || "[]");
  let getTD = element.querySelectorAll("td");
  let tdDescription = getTD[1];
  let tdDetailing = getTD[2];

  users.forEach((object) => {
    if (object.id == userlogged) {
      let noteObject = object.notes;
      noteObject.forEach((note) => {
        if (note.id == element.id) {
          note.description = tdDescription.innerText;
          note.detailing = tdDetailing.innerText;
        }
      });
    }
  });
  localStorage.setItem("userslist", JSON.stringify(users));
}
renderData();
//pagina-recados
function renderData() {
  let notes = searchForNotes();
  if (!notes) {
    return;
    // para a execução da função
  }
  tBody.innerHTML = "";
  for (let note of notes) {
    //renderizar os dados na tela
    const elementTR = document.createElement("tr");
    elementTR.id = note.id;

    // bloco para criação da ordem
    const elementTDId = document.createElement("td");
    elementTDId.innerHTML = `<abbr title="${note.id}">${note.id}</abbr>`;
    elementTDId.style.fontSize = "5px";
    elementTDId.style.textAlign = "center";
    elementTR.appendChild(elementTDId);

    // bloco para criação da informação da descrição
    const elementTDDescription = document.createElement("td");
    elementTDDescription.innerText = note.description;
    elementTDDescription.style.textAlign = "center";
    elementTR.appendChild(elementTDDescription);

    //bloco para criação do elemento do detalhamento
    const elementTDDetailing = document.createElement("td");
    elementTDDetailing.innerText = note.detailing;
    elementTDDetailing.style.textAlign = "center";
    elementTR.appendChild(elementTDDetailing);

    // bloco para criação das ações
    const elementTDActions = document.createElement("td");
    elementTDActions.className = "d-flex flex-column";
    const btnEdit = document.createElement("button");
    btnEdit.innerText = "Editar";
    btnEdit.style.backgroundColor = "green";
    btnEdit.style.color = "white";
    btnEdit.style.border = "none";
    btnEdit.style.borderRadius = "5px";
    btnEdit.style.padding = "10px";
    btnEdit.addEventListener("click", () => {
      editNotes(elementTR.id);
    });

    const btnRemove = document.createElement("button");
    btnRemove.innerText = "Remover";
    btnRemove.style.backgroundColor = "red";
    btnRemove.style.color = "white";
    btnRemove.style.border = "none";
    btnRemove.style.borderRadius = "5px";
    btnRemove.style.padding = "10px";
    btnRemove.addEventListener("click", () => {
      showConfirm(elementTR.id);
    });

    elementTDActions.appendChild(btnEdit);
    elementTDActions.appendChild(btnRemove);
    elementTR.appendChild(elementTDActions);
    tBody.appendChild(elementTR);
  }
}
//pagina-criar-conta
function createAccount() {
  const myModal = new bootstrap.Modal("#myModal");
  let usersList = JSON.parse(localStorage.getItem("userslist"));
  let iptUser = document.getElementById("ipt-user");
  let iptPassword1 = document.getElementById("ipt-password-1");
  let iptPassword2 = document.getElementById("ipt-password-2");
  if (iptPassword1.value == iptPassword2.value) {
    let newUser = {
      id: 0,
      username: iptUser.value,
      password: iptPassword1.value,
      notes: [],
    };

    usersList = JSON.parse(localStorage.getItem("userslist") || "[]");
    newUser.id = usersList.length + 1;
    usersList.push(newUser);

    localStorage.setItem("userslist", JSON.stringify(usersList));

    iptUser.value = "";
    iptPassword1.value = "";
    iptPassword2.value = "";
  } else {
    alert("Verifique sua senha novamente");
    iptPassword2.style.borderColor = "red";
  }
  myModal.show();
}
//pagina-criar-conta
function toValidateUser() {
  let iptUser = document.getElementById("ipt-user");
  if (iptUser.value.length < 7) {
    alert("Digite pelo menos 7 caracteres!");
    iptUser.style.borderColor = "red";
    return;
  } else {
    iptUser.style.borderColor = "green";
  }
}
//pagina-criar-conta
function toValidatePassword1() {
  let iptPassword1 = document.getElementById("ipt-password-1");
  if (iptPassword1.value == null || iptPassword1.value == "") {
    alert("Digite sua senha");
    iptPassword1.style.borderColor = "red";
    return;
  } else {
    iptPassword1.style.borderColor = "green";
  }
}
//pagina-criar-conta
function toValidatePassword2() {
  let iptPassword2 = document.getElementById("ipt-password-2");
  if (iptPassword2.value == null || iptPassword2.value == "") {
    alert("Digite sua senha novamente");
    iptPassword2.style.borderColor = "red";
    return;
  } else {
    iptPassword2.style.borderColor = "green";
  }
}
//pagina-login
function login() {
  let usersList = JSON.parse(localStorage.getItem("userslist"));
  let iptUserLog = document.getElementById("ipt-user-log");

  let iptPassLog = document.getElementById("ipt-pass-log");
  console.log(usersList);
  console.log(iptUserLog);
  console.log(iptPassLog);
  usersList.forEach((object) => {
    if (
      object.username == iptUserLog.value &&
      object.password == iptPassLog.value
    ) {
      window.location.assign("./pagina-recados.html");
      localStorage.setItem("userlogged", JSON.stringify(object.id));
      return;
    }
  });
}
getLoggedUser();
//pagina-recados
function getLoggedUser() {
  let userlogged = JSON.parse(localStorage.getItem("userlogged"));
  let users = JSON.parse(localStorage.getItem("userslist")); //pega o id do user logged
  let findLoggedUser = users.find((user) => {
    return user.id == userlogged;
  });
  return findLoggedUser;

  //pegou meu objeto do user logado
  //colocar dentro desse usuário os recados salvos
}
//pagina-recados
function searchForNotes() {
  let userlogged = JSON.parse(localStorage.getItem("userlogged"));
  let users = JSON.parse(localStorage.getItem("userslist"));
  console.log(userlogged);
  console.log(users);
  let loggedUser = users.find((user) => user.id == userlogged);
  console.log(loggedUser);
  return loggedUser.notes;
  //retorna um array de notas
}
//pagina-recados
function toLogout() {
  localStorage.removeItem(userlogged);
  window.location.assign("./pagina-login.html");
}
//pagina-criar-conta
function takeToLoginPage() {
  window.location.assign("./pagina-login.html");
}
//pagina-recados
function executePage() {
  exampleModal.show();
  executeVar = setTimeout(showPage, 3000);
}
//pagina-recados
function showPage() {
  exampleModal.hide();
}
