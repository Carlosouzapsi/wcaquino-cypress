import loc from "../../support/locators";
import "../../support/commandsContas";

describe("Should test at functional level", () => {
  before(() => {
    cy.login("carlos.souza@mail.com", "pwd123");
    cy.resetApp();
  });
  it.only("Should create an account", () => {
    cy.acessarMenuConta();
    cy.inserirConta("Conta de teste");
    cy.get(loc.MESSAGE).should("contain", "inserida com sucesso");
  });
  it("Should update an account", () => {
    cy.acessarMenuConta();
    cy.contains("Conta de teste")
      .siblings("td")
      .find("i")
      .should("have.class", "fa-edit")
      .eq(0)
      .click();
    cy.get(loc.CONTAS.NOME).type("Conta de alterada");
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "Conta atualizada com sucesso");
  });
});
