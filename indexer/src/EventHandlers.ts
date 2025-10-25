// src/EventHandlers.ts
import {
  YieldVault,
  YieldVault_Deposit,
  YieldVault_Withdraw,
} from "generated";

YieldVault.Deposit.handler(async ({ event, context }) => {
  const entity: YieldVault_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    amount: event.params.amount,
    timestamp: BigInt(event.block.timestamp),
  };

  context.YieldVault_Deposit.set(entity);
});

YieldVault.Withdraw.handler(async ({ event, context }) => {
  const entity: YieldVault_Withdraw = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    amount: event.params.amount,
    timestamp: BigInt(event.block.timestamp),
  };

  context.YieldVault_Withdraw.set(entity);
});