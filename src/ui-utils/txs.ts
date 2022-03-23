import { Any } from "cosmjs-types/google/protobuf/any";

type IAny = Any;

export const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
export const msgAckTypeUrl = "/ibc.core.channel.v1.MsgAcknowledgement";
export const msgReceiveTypeUrl = "/ibc.core.channel.v1.MsgRecvPacket";
export const msgStoreCodeTypeUrl = "/cosmwasm.wasm.v1.MsgStoreCode";
export const msgInstantiateContractTypeUrl = "/cosmwasm.wasm.v1.MsgInstantiateContract";
export const msgExecuteContractTypeUrl = "/cosmwasm.wasm.v1.MsgExecuteContract";
export const msgMigrateContractTypeUrl = "/cosmwasm.wasm.v1.MsgMigrateContract";
export const msgMsgUpdateAdminTypeUrl = "/cosmwasm.wasm.v1.MsgUpdateAdmin";
export const msgMsgClearAdminTypeUrl = "/cosmwasm.wasm.v1.MsgClearAdmin";

export interface AnyMsgSend {
  readonly typeUrl: "/cosmos.bank.v1beta1.MsgSend";
  readonly value: Uint8Array;
}

export interface AnyMsgAcknowledgement {
  readonly typeUrl: "/ibc.core.channel.v1.MsgAcknowledgement";
  readonly value: Uint8Array;
}

export interface AnyMsgRecvPacket {
  readonly typeUrl: "/ibc.core.channel.v1.MsgRecvPacket";
  readonly value: Uint8Array;
}

export interface AnyMsgStoreCode {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode";
  readonly value: Uint8Array;
}

export interface AnyMsgInstantiateContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract";
  readonly value: Uint8Array;
}

export interface AnyMsgExecuteContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract";
  readonly value: Uint8Array;
}

export interface AnyMsgMigrateContract {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract";
  readonly value: Uint8Array;
}

export interface AnyMsgUpdateAdmin {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin";
  readonly value: Uint8Array;
}

export interface AnyMsgClearAdmin {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin";
  readonly value: Uint8Array;
}

export function isAnyMsgSend(msg: IAny): msg is AnyMsgSend {
  return msg.typeUrl === msgSendTypeUrl && !!msg.value;
}

export function isAnyIbcAck(msg: IAny): msg is AnyMsgAcknowledgement {
  return msg.typeUrl === msgAckTypeUrl && !!msg.value;
}

export function isAnyIbcReceive(msg: IAny): msg is AnyMsgRecvPacket {
  return msg.typeUrl === msgReceiveTypeUrl && !!msg.value;
}

export function isAnyMsgStoreCode(msg: IAny): msg is AnyMsgStoreCode {
  return msg.typeUrl === msgStoreCodeTypeUrl && !!msg.value;
}

export function isAnyMsgInstantiateContract(msg: IAny): msg is AnyMsgInstantiateContract {
  return msg.typeUrl === msgInstantiateContractTypeUrl && !!msg.value;
}

export function isAnyMsgExecuteContract(msg: IAny): msg is AnyMsgExecuteContract {
  return msg.typeUrl === msgExecuteContractTypeUrl && !!msg.value;
}

export function isAnyMsgMigrateContract(msg: IAny): msg is AnyMsgMigrateContract {
  return msg.typeUrl === msgMigrateContractTypeUrl && !!msg.value;
}

export function isAnyMsgUpdateAdmin(msg: IAny): msg is AnyMsgUpdateAdmin {
  return msg.typeUrl === msgMsgUpdateAdminTypeUrl && !!msg.value;
}

export function isAnyMsgClearAdmin(msg: IAny): msg is AnyMsgClearAdmin {
  return msg.typeUrl === msgMsgClearAdminTypeUrl && !!msg.value;
}

export interface TxLog {
  msg_index?: number
  events: TxEvent[]
}

export interface TxEvent {
  type: string
  attributes: TxAttribute[]
}

export interface TxAttribute {
  key: string
  value: string
}

export interface ContractEvent {
  contract: string
  attributes: TxAttribute[]
}

export function GetTxLogByIndex(rawLog:string, index: number): TxLog {
  const logs:TxLog[] = JSON.parse(rawLog);

  const log = logs.find((log) => log.msg_index === index || (index === 0 && !log.msg_index));

  return log ?? {events: []};
}

export function findEventType(events: TxEvent[], type: string): TxEvent|undefined {
  return events.find((e) => e.type === type);
}

export function findEventAttributes(attrs: TxAttribute[], key: string): TxAttribute[] {
  return attrs.filter((a) => a.key === key);
}

export function findEventAttributeValue(events: TxEvent[], type: string, key: string): string|undefined {
  const event = findEventType(events, type);

  if (!event) {
    return undefined;
  }

  const attr = findEventAttributes(event.attributes, key);

  return attr.length > 0 ? attr[0].value : undefined;
}

export function parseContractEvent(attrs: TxAttribute[]): ContractEvent[] {
  const contracts: ContractEvent[] = []
  let event: ContractEvent|undefined = undefined;
  attrs.forEach(attr => {
    if (attr.key !== "_contract_address") {
      event?.attributes.push(attr);

      return;
    }

    if (event) {
      contracts.push(event);
    }

    event = {
      contract: attr.value,
      attributes: []
    }
  });

  if (event) {
    contracts.push(event);
  }

  return contracts;
}

/* eslint-enable @typescript-eslint/camelcase */
