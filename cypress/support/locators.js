const locators = {
  LOGIN: {
    USER: "[data-test='email']",
    PASSWORD: "[data-test='passwd']",
    BTN_LOGIN: "button[type='submit']",
  },
  MENU: {
    HOME: "[data-test=menu-home]",
    SETTINGS: "[data-test=menu-settings]",
    CONTAS: "[href='/contas']",
    RESET: "[href='/reset']",
    SAIR: "[href='/logout']",
    MOVIMENTACAO: "[data-test=menu-movimentacao]",
    EXTRATO: "[data-test=menu-extrato]",
  },
  CONTAS: {
    NOME: "[data-test='nome']",
    BTN_SALVAR: ".btn",
  },
  MOVIMENTACAO: {
    DESCRICAO: "[data-test=descricao]",
    VALOR: "[data-test=valor]",
    INTERESSADO: "[data-test=envolvido]",
    CONTA: "[data-test=conta]",
    STATUS: "[data-test=status]",
    BTN_SALVAR: ".btn-primary",
  },
  EXTRATO: {
    LINHAS: ".list-group > li",
    FN_CONTA_NOME: (nomeConta) => {
      return `${nomeConta}`;
    },
    DELETA_EL_GENERAL: "i[title*='Deletar']",
  },
  SALDO: {
    // construindo um xpath dinamico montando uma function!
    SALDO_CONTA: (nome) => {
      return `${nome}`;
    },
  },
  MESSAGE: ".toast-message",
};

export default locators;
