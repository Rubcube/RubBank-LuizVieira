import { PrismaClient } from '@prisma/client';
import { AddressIn } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AdressModel {

  create = async (adress: AddressIn) => {
    return await prisma.address.create({
      data: adress
    });
  }
};