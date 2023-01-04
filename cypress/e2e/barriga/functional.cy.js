///<reference types="cypress"/>

import loc from "../../support/locators";
import "../../support/commandsContas";

describe("Should test at functional level", () => {
  before(() => {
    cy.clearAllLocalStorage();
    cy.login("carlos.souza@mail.com", "pwd123");
    cy.resetApp();
  });
  beforeEach(() => {
    cy.get(loc.MENU.HOME).click();
  });
  after(() => {
    cy.get(loc.MENU.SETTINGS);
    cy.get(loc.MENU.SAIR);
  });
  it("Should create an account", () => {
    cy.acessarMenuConta();
    cy.inserirConta("Conta de teste");
    cy.get(loc.MESSAGE).should("contain", "Conta inserida com sucesso!");
  });
  it("Should update an account", () => {
    cy.acessarMenuConta();
    cy.contains("Conta para alterar")
      .next()
      .find("i")
      .should("have.class", "fa-edit")
      .eq(0)
      .click();
    cy.get(loc.CONTAS.NOME).clear().type("Conta alterada");
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "Conta atualizada com sucesso");
  });
  it("Should not create an account with same name", () => {
    cy.acessarMenuConta();
    cy.get(loc.CONTAS.NOME).type("Conta alterada");
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "code 400");
  });
  it("Should create a transaction", () => {
    cy.get(loc.MENU.MOVIMENTACAO).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).type("Desc");
    cy.get(loc.MOVIMENTACAO.VALOR).type("123");
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type("inter");
    cy.get(loc.MOVIMENTACAO.CONTA).select("Conta para movimentacoes");
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "sucesso");

    cy.get(loc.EXTRATO.LINHAS).should("have.length", 7);
    // Não inseri o via xpath, foi depreciado no cypress mais novo.
  });
  it("Should get Balance", () => {
    cy.get(loc.MENU.HOME).click();
    // simplifiquei aqui usando o contains de propósito!
    cy.contains(loc.SALDO.SALDO_CONTA("Conta para saldo"))
      .next()
      .should("contain", "534,00");
    // Não implementei devido a lib depreciada de xpath
  });
  it("Should remove a transaction", () => {
    cy.get(loc.MENU.EXTRATO).click();
    cy.contains(loc.EXTRATO.FN_CONTA_NOME("Desc"));
    cy.get(loc.EXTRATO.DELETA_EL_GENERAL).eq(-1).click();
    cy.get(loc.MESSAGE).should("contain", "sucesso!");
  });
});
