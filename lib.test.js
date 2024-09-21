const { describe } = require("node:test");
const { getCommissionFromTransaction, listenForBlocks } = require("./lib");

describe("getCommissionFromTransaction", () => {
  jest.setTimeout(5000);

  describe("when using $RON for wildforest", () => {
    it("should return correct game stats for a valid transaction", async () => {
      const txHash =
        "0x5263f6753204d9c21f737f6a73d272108445404a9fef24461c47aa935f4d5abe";

      const result = await getCommissionFromTransaction(txHash);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain("WildForest");
      expect(result.WildForest.totalCommission).toEqual(0.0045);
      expect(result.WildForest.totalTxs).toEqual(1);
    });
  });
  describe("when using $WETH for wildforest", () => {
    it("should return correct game stats for a valid transaction", async () => {
      const txHash =
        "0x6754031fd8daf94349b1d839b872cb1f924ffef9c60e9735db0420f8cabde3f4";

      const result = await getCommissionFromTransaction(txHash);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain("WildForest");
      expect(result.WildForest.totalCommission).toEqual(0.0025);
      expect(result.WildForest.totalTxs).toEqual(1);
    });
  });
  describe("when accepting offer for wildforest", () => {
    it("should return correct game stats for a valid transaction", async () => {
      const txHash =
        "0xfbfc861e8e91326c3614b0db838c1721feee1394393bdb456bafef2fd83622ec";

      const result = await getCommissionFromTransaction(txHash);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain("WildForest");
      expect(result.WildForest.totalCommission).toEqual(0.005);
      expect(result.WildForest.totalTxs).toEqual(1);
    });
  });
  describe("when buying 2 nfts with $RON for wildforest", () => {
    it("should return correct game stats for a valid transaction", async () => {
      const txHash =
        "0x582937ee1081bb499c5adb497cec0ab96dc9869443e7259e44743ea44577ae95";

      const result = await getCommissionFromTransaction(txHash);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain("WildForest");
      expect(result.WildForest.totalCommission).toEqual(0.005);
      expect(result.WildForest.totalTxs).toEqual(2);
    });
  });

  describe("when buying 2 nfts with $WETH for wildforest", () => {
    it("should return correct game stats for a valid transaction", async () => {
      const txHash =
        "0x590540ee7e0ce451b19d84a68e0bee780278471754364c9cc6ac96af6a4e0db1";

      const result = await getCommissionFromTransaction(txHash);
      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain("WildForest");
      expect(result.WildForest.totalCommission).toEqual(0.0055);
      expect(result.WildForest.totalTxs).toEqual(2);
    });
  });
});

describe("Listen for blocks", () => {
  jest.setTimeout(10000);

  it("should listen for blocks and call onBlockProcessed", async () => {
    const mockOnBlockProcessed = jest.fn(() => {});
    const promise = listenForBlocks({
      uniqueBlock: true,
      block: 38296507,
      onBlockProcessed: mockOnBlockProcessed,
    });

    // Wait for a short time to allow the function to process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await promise;

    expect(mockOnBlockProcessed).toHaveBeenCalled();
    expect(mockOnBlockProcessed).toHaveBeenCalledWith(
      expect.objectContaining({
        blockNumber: 38296507,
        blockTimestamp: 1726726827,
        gameStats: {
          FightLeague: { totalCommission: 0, totalTxs: 0 },
          Kaidro: { totalCommission: 0, totalTxs: 0 },
          Lumitera: { totalCommission: 0, totalTxs: 0 },
          Puff: { totalCommission: 0, totalTxs: 0 },
          Ragmon: { totalCommission: 0, totalTxs: 0 },
          Runiverse: { totalCommission: 0, totalTxs: 0 },
          TMA: { totalCommission: 0, totalTxs: 0 },
          Tribesters: { totalCommission: 0, totalTxs: 0 },
          WildForest: { totalCommission: 0.005, totalTxs: 1 },
        },
      })
    );
  });
});
