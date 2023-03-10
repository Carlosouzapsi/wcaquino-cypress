// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import loc from "./locators";

Cypress.Commands.add("login", (user, password) => {
  cy.visit("https://barrigareact.wcaquino.me");
  cy.get(loc.LOGIN.USER).type(user);
  cy.get(loc.LOGIN.PASSWORD).type(password);
  cy.get(loc.LOGIN.BTN_LOGIN).should("have.text", "Entrar").click();
  cy.get(loc.MESSAGE).should("contain", "Bem vindo");
});

Cypress.Commands.add("resetApp", () => {
  cy.get(loc.MENU.SETTINGS).click();
  cy.get(loc.MENU.RESET).click();
});

Cypress.Commands.add("getToken", (user, passwd) => {
  cy.request({
    method: "POST",
    url: "/signin",
    body: {
      email: user,
      redirecionar: false,
      senha: passwd,
    },
  })
    .its("body.token")
    .should("not.be.empty")
    .then((token) => {
      // declaracao e valor da variável token
      Cypress.env("token", token);
      return token;
    });
});

Cypress.Commands.add("resetRest", () => {
  cy.getToken("carlos.souza@mail.com", "pwd123").then((token) => {
    cy.request({
      method: "GET",
      url: "/reset",
      headers: { Authorization: `JWT ${token}` },
    })
      .its("status")
      .should("be.equal", 200);
  });
});

Cypress.Commands.add("getContaByName", (name) => {
  cy.getToken("carlos.souza@mail.com", "pwd123").then((token) => {
    cy.request({
      method: "GET",
      url: "/contas",
      headers: { Authorization: `JWT ${token}` },
      // query string (qs)
      qs: {
        nome: name,
      },
    }).then((res) => {
      return res.body[0].id;
    });
  });
});

// Sobreescrevendo o método request do cypress
Cypress.Commands.overwrite("request", (originalFn, ...options) => {
  const token = Cypress.env("token");
  if (options.length === 1) {
    if (token) {
      options[0].headers = {
        Authorization: `JWT ${token}`,
      };
    }
  }
  return originalFn(...options);
});
