const path = require("path");

const stkLyraDeployBlock = 15801447;
const stkLyraProxy = "0xdE48b1B5853cc63B1D05e507414D3E02831722F8";
const initialStakeLyra = "0xB0B06F0440ce13d03D41c5399C55AEfEa1b372CE";

const registryAddress = "0xF5A0442D4753cA1Ea36427ec071aa5E786dA5916";
const network = "optimism";

const dataSources = [
  {
    kind: "ethereum/contract",
    name: "stkLyraProxy",
    network,
    source: {
      address: stkLyraProxy,
      startBlock: stkLyraDeployBlock,
      abi: "LyraSafetyModuleProxy",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/mapping.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "LyraSafetyModuleProxy",
          file: "./abis/LyraSafetyModuleProxy.json",
        },
      ],
      eventHandlers: [
        {
          event: "Upgraded(indexed address)",
          handler: "handleUpgrade",
        },
      ],
    },
  },
  {
    kind: "ethereum/contract",
    name: "LyraSafetyModule",
    network,
    source: {
      address: stkLyraProxy,
      startBlock: stkLyraDeployBlock,
      abi: "LyraSafetyModule",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/mapping.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "LyraSafetyModule",
          file: "./abis/LyraSafetyModule.json",
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransfer",
        },
        {
          event: "CooldownUpdated(indexed address,uint256,uint256)",
          handler: "handleCooldownUpdated",
        },
        {
          event: "Cooldown(indexed address)",
          handler: "handleCooldown",
        },
        {
          event: "DelegateChanged(indexed address,indexed address,uint8)",
          handler: "handleDelegateChanged",
        },
        {
          event: "DelegatedPowerChanged(indexed address,uint256,uint8)",
          handler: "handleDelegatedPowerChanged",
        },
        {
          event: "Redeem(indexed address,indexed address,uint256)",
          handler: "handleRedeem",
        },
        {
          event: "RewardsAccrued(address,uint256)",
          handler: "handleRewardsAccrued",
        },
        {
          event: "RewardsClaimed(indexed address,indexed address,uint256)",
          handler: "handleRewardsClaimed",
        },
        {
          event: "Staked(indexed address,indexed address,uint256)",
          handler: "handleStaked",
        },
      ],
    },
  },
];

const templates = [
  {
    kind: "ethereum/contract",
    name: "LyraSafetyModule",
    network,
    source: {
      abi: "LyraSafetyModule",
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.5",
      language: "wasm/assemblyscript",
      file: "./src/mapping.ts",
      entities: ["TokenTransfer"], //This value is currently not used by TheGraph at all, it just cant be empty
      abis: [
        {
          name: "LyraSafetyModule",
          file: "./abis/LyraSafetyModule.json",
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransfer",
        },
        {
          event: "CooldownUpdated(indexed address,uint256,uint256)",
          handler: "handleCooldownUpdated",
        },
        {
          event: "Cooldown(indexed address)",
          handler: "handleCooldown",
        },
        {
          event: "DelegateChanged(indexed address,indexed address,uint8)",
          handler: "handleDelegateChanged",
        },
        {
          event: "DelegatedPowerChanged(indexed address,uint256,uint8)",
          handler: "handleDelegatedPowerChanged",
        },
        {
          event: "Redeem(indexed address,indexed address,uint256)",
          handler: "handleRedeem",
        },
        {
          event: "RewardsAccrued(address,uint256)",
          handler: "handleRewardsAccrued",
        },
        {
          event: "RewardsClaimed(indexed address,indexed address,uint256)",
          handler: "handleRewardsClaimed",
        },
        {
          event: "Staked(indexed address,indexed address,uint256)",
          handler: "handleStaked",
        },
      ],
    },
  },
];

module.exports = {
  specVersion: "0.0.2",
  description: "Lyra",
  repository: "https://github.com/lyra-finance/lyra-protocol-subgraph",
  schema: {
    file: "./schema.graphql",
  },
  dataSources,
  templates,
};
