///<reference types="cypress"/>

import loc from "../../support/locators";
import "../../support/commandsContas";
import buildEnv from "../../support/buildEnv";

describe("Frontend only", () => {
  after(() => {
    cy.clearAllLocalStorage();
  });
  beforeEach(() => {
    cy.clearAllLocalStorage();
    buildEnv();
    cy.login("carlos.souza@mail.com", "senha errada!");
    cy.get(loc.MENU.HOME).click();
    // cy.resetApp(); -> Não precisa mais, os dados não vem do banco...
  });

  it("Should create an account", () => {
    // Criando conta mockada:
    cy.intercept({ method: "POST", path: "/contas" }, [
      {
        id: 3,
        nome: "Conta de teste",
        visivel: true,
        usuario_id: 1,
      },
    ]).as("saveConta");
    cy.acessarMenuConta();
    // Buscando conta mockada:
    cy.intercept(
      {
        method: "GET",
        path: "/contas",
      },
      [
        {
          id: 1,
          nome: "Carteira",
          visivel: true,
          usuario_id: 1,
        },
        {
          id: 2,
          nome: "Banco",
          visivel: true,
          usuario_id: 2,
        },
        {
          id: 3,
          nome: "Conta de teste",
          visivel: true,
          usuario_id: 1,
        },
      ]
    ).as("contasSave");
    cy.inserirConta("Conta de teste");
    cy.get(loc.MESSAGE).should("contain", "Conta inserida com sucesso!");
  });
  it("Should update an account", () => {
    // Criando a resposta mockada de conta alterada:
    cy.intercept(
      {
        method: "PUT",
        url: "/contas/**",
      },
      {
        id: 1,
        nome: "Conta Alterada",
        visivel: true,
        usuario_id: 1,
      }
    );
    cy.acessarMenuConta();
    cy.contains("Carteira")
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
    // POST de contas para forçar o erro:
    cy.intercept(
      { method: "POST", path: "/contas" },
      { error: "Já existe uma conta com esse nome!", statusCode: 400 }
    ).as("saveContaMesmoNome");
    cy.acessarMenuConta();
    cy.get(loc.CONTAS.NOME).type("Conta alterada");
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "code 400");
  });
  it("Should create a transaction", () => {
    cy.intercept(
      {
        method: "POST",
        path: "/transacoes",
      },
      {
        id: 1448858,
        descricao: "dasdsa",
        envolvido: "BBBsadsadasdas",
        observacao: null,
        tipo: "REC",
        data_transacao: "2023-01-10T03:00:00.000Z",
        data_pagamento: "2023-01-10T03:00:00.000Z",
        valor: "2133.00",
        status: false,
        conta_id: 1545831,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      }
    );
    // Exibe os 7 registros:
    cy.intercept(
      {
        method: "GET",
        path: "/extrato/**",
      },
      { fixture: "movimentacaoSalva" }
    ).as("extratoList");
    cy.get(loc.MENU.MOVIMENTACAO).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).type("Desc");
    cy.get(loc.MOVIMENTACAO.VALOR).type("123");
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type("inter");
    cy.get(loc.MOVIMENTACAO.CONTA).select("Banco");
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    // Colocado por garantia antes do botão de salvar:
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "sucesso");

    cy.get(loc.EXTRATO.LINHAS).should("have.length", 7);

    // Não inseri o via xpath, foi depreciado no cypress mais novo.
  });
  // Não desenvolvido, devido aos problemas do cy.xpath() - preciso rever.
  it.skip("Should get Balance", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/transacoes/**",
      },
      {
        conta: "Conta para movimentacoes",
        id: 1445361,
        descricao: "Movimentacao para exclusao",
        envolvido: "AAA",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "-1500.00",
        status: true,
        conta_id: 1545830,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      }
    );
    cy.intercept(
      {
        method: "PUT",
        url: "/transacoes/**",
      },
      {
        conta: "Conta para movimentacoes",
        id: 1445361,
        descricao: "Movimentacao para exclusao",
        envolvido: "AAA",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "-1500.00",
        status: true,
        conta_id: 1545830,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      }
    );
    cy.get(loc.MENU.HOME).click();
    // simplifiquei aqui usando o contains de propósito!
    cy.contains(loc.SALDO.SALDO_CONTA("Carteira"))
      .next()
      .should("contain", "100,00");

    cy.get(loc.MENU.EXTRATO).click();

    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should("contain", "sucesso");

    cy.get(loc.MENU_HOME).click();
    // Não implementei devido a lib depreciada de xpath
  });
  it("Should remove a transaction", () => {
    cy.intercept(
      {
        method: "DELETE",
        url: "/transacoes/**",
      },
      { statusCode: 204 }
    ).as("del");
    cy.get(loc.MENU.EXTRATO).click();
    cy.contains(loc.EXTRATO.FN_CONTA_NOME("Desc"));
    cy.get(loc.EXTRATO.DELETA_EL_GENERAL).eq(-1).click();
    cy.get(loc.MESSAGE).should("contain", "sucesso!");
  });
  it.only("Should validate data send to create an account", () => {
    // Criando conta mockada:
    cy.intercept({ method: "POST", path: "/contas" }, [
      {
        id: 3,
        nome: "Conta de teste",
        visivel: true,
        usuario_id: 1,
      },
    ]).as("saveConta");
    cy.acessarMenuConta();
    // Buscando conta mockada:
    cy.intercept(
      {
        method: "GET",
        path: "/contas",
      },
      [
        {
          id: 1,
          nome: "Carteira",
          visivel: true,
          usuario_id: 1,
        },
        {
          id: 2,
          nome: "Banco",
          visivel: true,
          usuario_id: 2,
        },
        {
          id: 3,
          nome: "Conta de teste",
          visivel: true,
          usuario_id: 1,
        },
      ]
    ).as("contasSave");
    cy.inserirConta("{CONTROL}");
    // cy.wait("@saveConta").its("request.body.nome").should("not.be.empty"); // forma 1

    cy.get(loc.MESSAGE).should("contain", "Conta inserida com sucesso!");
  });
});
