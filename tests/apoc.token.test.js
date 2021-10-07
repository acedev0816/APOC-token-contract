const { loadConfig, Blockchain } = require("@klevoya/hydra");

const config = loadConfig("hydra.yml");

describe("apoc.token", () => {
  let blockchain = new Blockchain(config);
  let tester = blockchain.createAccount(`apoc.token`);
  let alice = blockchain.createAccount(`alice`);
  let bob = blockchain.createAccount(`bob`);

  beforeAll(async () => {
    tester.setContract(blockchain.contractTemplates[`apoc.token`]);
    tester.updateAuth(`active`, `owner`, {
      accounts: [
        {
          permission: {
            actor: tester.accountName,
            permission: `eosio.code`,
          },
          weight: 1,
        },
      ],
    });
  });

  it("can create and issue tokens", async () => {
    expect.assertions(2);

    await tester.contract.create({
      issuer: alice.accountName,
      maximum_supply: "1000000000.00000 APOC",
    });
    expect(tester.getTableRowsScoped(`stat`)[`APOC`]).toEqual([
      {
        issuer: `alice`,
        max_supply: "1000000000.00000 APOC",
        supply: "0.00000 APOC",
      },
    ]);

    await tester.contract.issue(
      {
        to: alice.accountName,
        quantity: "10.00000 APOC",
        memo: `issuing some tokens for alice`,
      },
      [{ actor: alice.accountName, permission: `active` }]
    );
    expect(tester.getTableRowsScoped(`accounts`)[alice.accountName]).toEqual([
      {
        balance: "10.00000 APOC",
      },
    ]);
  });

  it("can transfer tokens", async () => {
    expect.assertions(1);

    await tester.contract.transfer(
      {
        from: alice.accountName,
        to: bob.accountName,
        quantity: `5.00000 APOC`,
        memo: `sending some APOC your way 💸`,
      },
      [{ actor: alice.accountName, permission: `active` }]
    );

    expect(tester.getTableRowsScoped(`accounts`)).toEqual({
      alice: [{ balance: "5.00000 APOC" }],
      bob: [{ balance: "5.00000 APOC" }],
    });
  });

  it("can load balances from JSON files", async () => {
    expect.assertions(1);
    // need to reset stat and accounts table first
    tester.resetTables();
    await tester.loadFixtures();

    await tester.contract.transfer(
      {
        from: alice.accountName,
        to: bob.accountName,
        quantity: `0.12345 APOC`,
        memo: ``,
      },
      [{ actor: alice.accountName, permission: `active` }]
    );

    expect(tester.getTableRowsScoped(`accounts`)).toEqual({
      alice: [{ balance: "1.00000 APOC" }],
      bob: [{ balance: "0.12345 APOC" }],
    });
  });
});
