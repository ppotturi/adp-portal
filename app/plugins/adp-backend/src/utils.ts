import { ArmsLengthBody, DeliveryProgramme } from "./types";
import { IdentityApi } from '@backstage/plugin-auth-node';
import express from 'express';

export function createName (name: string) {
    const nameValue = name.replace(/\s+/g, '-').toLowerCase().substring(0,64);
    return nameValue;
}

export function createTransformerTitle(title:string, alias?: string) {
    const titleValue =  alias ? (title + " " + `(${alias})`) : title
    return titleValue;
}

export async function checkForDuplicateTitle(
    store: DeliveryProgramme[] | ArmsLengthBody[],
    title: string,
  ): Promise<boolean> {
    title = title.trim().toLowerCase();
  
    const duplicate = store.find(
      object => object.title.trim().toLowerCase() === title,
    );
  
    return duplicate !== undefined;
  }
  
  export async function getCurrentUsername(
    identity: IdentityApi,
    req: express.Request,
  ): Promise<string> {
    const user = await identity.getIdentity({ request: req });
    return user?.identity.userEntityRef ?? 'unknown';
  }