///<reference types="cypress"/>

import dayjs from "dayjs";

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
    cy.getContaByName("Conta para alterar").then((contaId) => {
      cy.request({
        url: `/contas/${contaId}`,
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
  it("Should create a transaction", () => {
    cy.getContaByName("Conta para movimentacoes").then((contaId) => {
      cy.request({
        method: "POST",
        url: "/transacoes",
        headers: { Authorization: `JWT ${token}` },
        body: {
          conta_id: contaId,
          data_pagamento: dayjs().add(1, "day").format("DD/MM/YYYY"),
          data_transacao: dayjs().format("DD/MM/YYYY"),
          descricao: "desc",
          envolvido: "inter",
          status: true,
          tipo: "REC",
          valor: "123",
        },
      }).as("response");
    });
    cy.get("@response").its("status").should("be.equal", 201);
    cy.get("@response").its("body.id").should("exist");
  });
});
