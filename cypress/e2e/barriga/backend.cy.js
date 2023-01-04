///<reference types="cypress"/>

describe("", () => {
  // tornando o token algo a ser aproveitado na suite toda
  let token;
  before(() => {
    // comando customizado para pegar o token
    cy.getToken("carlos.souza@mail.com", "pwd123").then((tkn) => {
      token = tkn;
    });
  });
  beforeEach(() => {
    cy.resetRest();
  });
  it("Should create an account", () => {
    // Adicionar conta via api passando o token no headers
    cy.request({
      url: "/contas",
      method: "POST",
      headers: { Authorization: `JWT ${token}` }, // JWT sintaxe usada pela api ser antiga.
      //   headers: { Authorization: `Bearer ${token}` }, // forma mais atual
      body: {
        nome: "Conta via rest",
      },
    }).as("response");
    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("nome", "Conta via rest");
    });
  });
  it("Should update an account", () => {
    cy.request({
      method: "GET",
      url: "/contas",
      headers: { Authorization: `JWT ${token}` },
      // query string (qs)
      qs: {
        nome: "Conta para alterar",
      },
    }).then((res) => {
      cy.request({
        url: `/contas/${res.body[0].id}`,
        method: "PUT",
        headers: { Authorization: `JWT ${token}` },
        body: {
          nome: "Conta alterada via rest",
        },
      }).as("response");
    });
    cy.get("@response").its("status").should("be.equal", 200);
  });
  it("Should not create an account with same name", () => {
    cy.request({
      url: "/contas",
      method: "POST",
      headers: { Authorization: `JWT ${token}` }, // JWT sintaxe usada pela api ser antiga.
      //   headers: { Authorization: `Bearer ${token}` }, // forma mais atual
      body: {
        nome: "Conta mesmo nome",
      },
      failOnStatusCode: false,
    }).as("response");
    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal("Já existe uma conta com esse nome!");
    });
  });
  it("Should createa a transaction", () => {});
});
