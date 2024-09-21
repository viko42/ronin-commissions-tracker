const axios = require("axios");
const ethers = require("ethers");
const helpers = require("./helpers");

const skymavisApikey = "-your-private-key-";
const commissionStats = {};

async function getCommissionFromTransaction(txHash) {
  const txInternalLogsResponse = await axios.request({
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api-gateway.skymavis.com/skynet/ronin/web3/v2/txs/${txHash}/internal_txs`,
    headers: {
      Accept: "application/json",
      "X-API-KEY": skymavisApikey,
    },
  });
  const txInternalLogs = (
    txInternalLogsResponse.data?.result?.items || []
  ).filter((tx) => !tx.error && tx.success);

  const gameStats = {};
  for (const [game, wallet] of Object.entries(
    helpers.constants.treasuryWallets
  )) {
    if (!gameStats[game]) {
      gameStats[game] = {
        totalCommission: 0,
        totalTxs: 0,
      };
    }

    const txInternalLogsToTreasury = txInternalLogs.filter((tx) => {
      return String(tx.to).toLowerCase() === String(wallet).toLowerCase();
    });

    const totalTxs = txInternalLogsToTreasury.filter((tx) =>
      helpers.isMoreThanZero(tx.value)
    ).length;
    const totalCommisionForGame = txInternalLogsToTreasury
      .filter((tx) => helpers.isMoreThanZero(tx.value))
      .reduce((acc, t) => acc + helpers.hexToDec(t.value), 0);

    if (totalCommisionForGame) {
      gameStats[game].totalCommission = totalCommisionForGame;
      gameStats[game].totalTxs = totalTxs;
    }
  }
  return gameStats;
}

const processBlocks = async (targetBlockNumber, provider) => {
  try {
    let blockNumber = targetBlockNumber || (await provider.getBlockNumber());
    let blockTimestamp = (await provider.getBlock(blockNumber)).timestamp;
    if (!blockNumber) {
      blockNumber = await provider.getBlockNumber();
    }
    let data = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [helpers.decToHex(blockNumber), true],
    });

    const txs = [];
    const response = await axios.request({
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api-gateway.skymavis.com/rpc/?apikey=${skymavisApikey}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    });
    if (response.data.result.transactions) {
      const transactions = response.data.result.transactions.filter((tx) => {
        if (!tx?.to || !tx?.value) {
          return false;
        }
        return helpers.isContract(tx.to);
      });
      txs.push(...transactions.map((tx) => tx.hash));
    }

    let gameStats = {};
    for (const game in helpers.constants.treasuryWallets) {
      gameStats[game] = {
        totalCommission: 0,
        totalTxs: 0,
      };
    }

    if (txs.length > 0) {
      for (const key in txs) {
        const txHash = txs[key];

        const gameStatsForTransaction = await getCommissionFromTransaction(
          txHash
        );
        for (const [game, stats] of Object.entries(gameStatsForTransaction)) {
          gameStats[game].totalCommission += stats.totalCommission;
          gameStats[game].totalTxs += stats.totalTxs;
        }
      }
    }

    return {
      gameStats,
      blockNumber,
      blockTimestamp,
    };
  } catch (error) {
    console.error(`Error processing block: ${error.message}`);
    throw error;
  }
};

function analyzeBlock(resultBlock, onCommissionStatsUpdated) {
  const { gameStats, blockTimestamp } = resultBlock;
  const date = new Date(blockTimestamp * 1000);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const key = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  let updated = false;

  if (!commissionStats[key]) {
    commissionStats[key] = {
      year,
      month,
      day,
      ...Object.fromEntries(
        Object.keys(helpers.constants.treasuryWallets).map((game) => [game, 0])
      ),
    };
    updated = true;
  }

  for (const [game, stats] of Object.entries(gameStats)) {
    if (stats.totalCommission > 0) {
      commissionStats[key][game] += stats.totalCommission;
      updated = true;
    }
  }

  if (updated && onCommissionStatsUpdated) {
    onCommissionStatsUpdated(commissionStats);
  }
}

async function listenForBlocks(
  options = {
    uniqueBlock: false,
    block: undefined,
    onBlockProcessed: (blockResult) => {},
    onCommissionStatsUpdated: (commissionStats) => {},
  }
) {
  const provider = new ethers.JsonRpcProvider("https://api.roninchain.com/rpc");
  let latestBlock = await provider.getBlockNumber();
  let currentBlock =
  options.uniqueBlock && options.block ? options.block : latestBlock;
  const MAX_RETRIES = 5;

  while (true) {
    if (currentBlock <= latestBlock) {
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const resultBlock = await processBlocks(currentBlock, provider);

          if (options.onBlockProcessed) {
            options.onBlockProcessed(resultBlock);
          }

          analyzeBlock(resultBlock, options.onCommissionStatsUpdated);
          currentBlock++;
          break;
        } catch (error) {
          retries++;
          console.error(
            `Error processing block ${currentBlock} (attempt ${retries}/${MAX_RETRIES}):`,
            error.message
          );
          if (retries >= MAX_RETRIES) {
            console.error(
              `Max retries reached for block ${currentBlock}. Moving to next block.`
            );
            currentBlock++;
          } else {
            console.log(`Retrying block ${currentBlock} in 2 seconds...`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }

      if (options.uniqueBlock) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      latestBlock = await provider.getBlockNumber();
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

module.exports = {
  getCommissionFromTransaction,
  listenForBlocks,
};
