# Ronin Network Game Commission Calculator

This script analyzes transactions on the Ronin Network to calculate commissions for various games. It processes blocks one by one to gather and aggregate commission data.

## Features

- Listens to new blocks on the Ronin Network
- Analyzes transactions within each block
- Calculates commissions for specific games
- Aggregates commission data by game and date
- Provides real-time updates on processed blocks and commission statistics

## Supported Games

- WildForest
- Kaidro
- Ragmon
- Lumitera
- Puff
- Runiverse
- FightLeague
- TMA
- Tribesters

## How it works

1. The script connects to the Ronin Network and listens for new blocks.
2. For each block, it analyzes all transactions.
3. It identifies transactions related to supported games and calculates the commission.
4. Commission data is aggregated by game and date.
5. The script provides real-time updates on processed blocks and commission statistics.

## Configuration

The script uses predefined contract addresses, token addresses, and treasury wallet addresses for each supported game. These can be found in the `helpers.js` file.

## Testing

Unit tests are provided in the `lib.test.js` file to ensure the accuracy of commission calculations for various transaction types.

## Note

This script is designed for monitoring and analysis purposes. Always ensure you have the necessary permissions and comply with relevant terms of service when interacting with blockchain networks.
