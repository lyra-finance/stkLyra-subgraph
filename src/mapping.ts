import { BigInt } from "@graphprotocol/graph-ts";

import {
  Cooldown as CooldownEvent,
  CooldownUpdated,
  DelegateChanged,
  DelegatedPowerChanged,
  Redeem as RedeemEvent,
  RewardsAccrued,
  RewardsClaimed,
  Staked,
  Transfer,
} from "../generated/templates/LyraSafetyModule/LyraSafetyModule";
import {
  Initialize1Call,
  Upgraded,
} from "../generated/stkLyraProxy/LyraSafetyModuleProxy";
import {
  TokenTransfer,
  User,
  Stake,
  Redeem,
  Cooldown,
} from "../generated/schema";
import { LyraSafetyModule as LyraSafetyModuleTemplate } from "../generated/templates";

let ZERO = BigInt.fromI32(0);

export function handleUpgrade(event: Upgraded): void {
  LyraSafetyModuleTemplate.create(event.params.implementation);
}

function loadOrCreateUser(userAddress: string): User {
  let user = User.load(userAddress);
  if (user == null) {
    user = new User(userAddress);
    user.balance = ZERO;
    user.save();
  }
  return user;
}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;

  let userFrom = loadOrCreateUser(from.toHex());
  let userTo = loadOrCreateUser(to.toHex());

  let transfer = new TokenTransfer(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );

  transfer.txHash = event.transaction.hash;
  transfer.blockNumber = event.block.number.toI32();
  transfer.timestamp = event.block.timestamp.toI32();
  transfer.to = userTo.id;
  transfer.from = userFrom.id;
  transfer.amount = value;
  transfer.save();

  userFrom.balance = userFrom.balance.minus(event.params.value);
  userTo.balance = userTo.balance.plus(event.params.value);

  userFrom.save();
  userTo.save();
}

export function handleCooldownUpdated(event: CooldownUpdated): void {
  let userAddress = event.params.user.toHex();
  loadOrCreateUser(userAddress);
  let cooldown = new Cooldown(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  cooldown.txHash = event.transaction.hash;
  cooldown.blockNumber = event.block.number.toI32();
  cooldown.timestamp = event.block.timestamp.toI32();
  cooldown.user = userAddress;
  cooldown.amount = event.params.balance;
  cooldown.cooldownTimestamp = event.params.cooldownTimestamp.toI32();
  cooldown.save();
}

export function handleDelegatedPowerChanged(
  event: DelegatedPowerChanged
): void {}
export function handleRedeem(event: RedeemEvent): void {
  let userAddress = event.params.from.toHex();
  loadOrCreateUser(userAddress);
  let redeem = new Redeem(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  redeem.txHash = event.transaction.hash;
  redeem.blockNumber = event.block.number.toI32();
  redeem.timestamp = event.block.timestamp.toI32();
  redeem.user = userAddress;
  redeem.amount = event.params.amount;
  redeem.save();
}

export function handleStaked(event: Staked): void {
  let userAddress = event.params.onBehalfOf.toHex();
  loadOrCreateUser(userAddress);
  let stake = new Stake(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  stake.txHash = event.transaction.hash;
  stake.blockNumber = event.block.number.toI32();
  stake.timestamp = event.block.timestamp.toI32();
  stake.user = userAddress;
  stake.amount = event.params.amount;
  stake.save();
}

export function handleRewardsAccrued(event: RewardsAccrued): void {}
export function handleRewardsClaimed(event: RewardsClaimed): void {}

export function handleCooldown(event: CooldownEvent): void {}
export function handleDelegateChanged(event: DelegateChanged): void {}
