import { Any } from "cosmjs-types/google/protobuf/any";

type IAny = Any;

export const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
export const msgStoreCodeTypeUrl = "/cosmwasm.wasm.v1.MsgStoreCode";
export const msgInstantiateContractTypeUrl = "/cosmwasm.wasm.v1.MsgInstantiateContract";
export const msgExecuteContractTypeUrl = "/cosmwasm.wasm.v1.MsgExecuteContract";

export interface AnyMsgSend {
  readonly typeUrl: "/cosmos.bank.v1beta1.MsgSend";
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

export function isAnyMsgSend(msg: IAny): msg is AnyMsgSend {
  return msg.typeUrl === msgSendTypeUrl && !!msg.value;
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


export function GetTxLogByIndex(rawLog:string, index: number): TxLog {
  const logs:TxLog[] = JSON.parse(rawLog);

  const log = logs.find((log) => log.msg_index === index || (index === 0 && !log.msg_index));

  return log ?? {events: []};
}

export function findEventType(events: TxEvent[], type: string): TxEvent|undefined {
  return events.find((e) => e.type === type);
}

export function findEventAttribute(attrs: TxAttribute[], key: string): TxAttribute|undefined {
  return attrs.find((a) => a.key === key);
}

export function findEventAttributeValue(events: TxEvent[], type: string, key: string): string|undefined {
  const event = findEventType(events, type);

  if (!event) {
    return undefined;
  }

  const attr = findEventAttribute(event.attributes, key);

  return attr?.value;
}

/* eslint-enable @typescript-eslint/camelcase */
