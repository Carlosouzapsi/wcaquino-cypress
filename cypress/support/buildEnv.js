const buildEnv = () => {
  //definir rotas para serem aproveitadas em varios testes:
  cy.intercept(
    {
      method: "POST",
      path: "/signin",
    },
    {
      id: 1000,
      nome: "Usuario falso",
      token:
        "uma string muito grande que nao deveria ser aceito mas na vdd vai",
    }
  ).as("signin");
  cy.intercept({ method: "GET", path: "/saldo" }, [
    {
      conta_id: 1545798,
      conta: "Conta para movimentacoes",
      saldo: "-1500.00",
    },
    { conta_id: 999, conta: "Carteira", saldo: "100.00" },
    { conta_id: 9909, conta: "Banco", saldo: "100000000.00" },
  ]).as("saldo");
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
    ]
  ).as("contas");
  // Mantido default, sem mexer nos valores 6 contas:
  cy.intercept(
    {
      method: "GET",
      path: "/extrato/**",
    },
    [
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
      },
      {
        conta: "Conta para saldo",
        id: 1445363,
        descricao: "Movimentacao 1, calculo saldo",
        envolvido: "CCC",
        observacao: null,
        tipo: "REC",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "3500.00",
        status: false,
        conta_id: 1545832,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para saldo",
        id: 1445364,
        descricao: "Movimentacao 2, calculo saldo",
        envolvido: "DDD",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "-1000.00",
        status: true,
        conta_id: 1545832,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para saldo",
        id: 1445365,
        descricao: "Movimentacao 3, calculo saldo",
        envolvido: "EEE",
        observacao: null,
        tipo: "REC",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "1534.00",
        status: true,
        conta_id: 1545832,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para extrato",
        id: 1445366,
        descricao: "Movimentacao para extrato",
        envolvido: "FFF",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "-220.00",
        status: true,
        conta_id: 1545833,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para movimentacoes",
        id: 1445367,
        descricao: "Desc",
        envolvido: "inter",
        observacao: null,
        tipo: "REC",
        data_transacao: "2023-01-06T03:00:00.000Z",
        data_pagamento: "2023-01-06T03:00:00.000Z",
        valor: "123.00",
        status: true,
        conta_id: 1545830,
        usuario_id: 35714,
        transferencia_id: null,
        parcelamento_id: null,
      },
    ]
  ).as("extratoList");
};

export default buildEnv;
